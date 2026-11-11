/* ============================================================
   ShopFlow ↔ Cecho planas (the workshop floor plan, /hub/cechas/)
   - "Cechas" in the top bar: who is at which machine or desk right
     now and on what project, as people marked it on the plan or by
     scanning a station's QR code.
   - New project names typed on the floor can be turned into a
     ShopFlow order with one click (ShopFlow's own New order form
     opens, filled in, so ShopFlow saves it the usual way).
   - Link to the plan's time report (how long each project took at
     each station).
   Read-only towards the plan: this file never writes its data.
   ============================================================ */
"use strict";

var Cechas = {
  ROW: "dedes-cechas",
  PLAN: "../hub/cechas/",
  data: null,
  at: 0,
  err: false,
  _t: null,
  /* station names for older entries saved before the plan sent its names along */
  TYPE_NAMES: { altendorf: "Altendorf WA 80", felder: "Felder K 940 S", startech: "SCM Startech CN Plus", olimpic: "SCM Olimpic K 360",
    volter: "Volter CNC", booth: "Dažymo kamera", oproom: "CNC operatorių kambarys", laser: "Lazerinis graviruoklis", desk: "Surinkimo stalas",
    zone: "Zona", compressor: "Kaeser kompresorius", vitap: "VITAP gręžimo staklės", blum: "Blum gręžimo staklės" },

  lt() { return (typeof I18N !== "undefined" && I18N.lang === "lt"); },
  tx(lt, en) { return this.lt() ? lt : en; },
  allowed() { return typeof App !== "undefined" && App.me && (App.isManager() || App.isEngineer()); },
  dayStart() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); },
  norm(v) { return String(v || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[_\s]+/g, " ").trim(); },
  hhmm(ms) { var d = new Date(ms), p = function (x) { return String(x).padStart(2, "0"); }; return p(d.getHours()) + ":" + p(d.getMinutes()); },

  state() { return this.data && this.data.state || {}; },
  layout() { return this.data && this.data.layout || {}; },
  placeName(id, p) {
    if (p && p.sn) return p.sn;
    var it = (this.layout().items || {})[id];
    if (it && it.n) return it.n;
    return it && this.TYPE_NAMES[it.t] || id;
  },
  /* people marked at a station today; yesterday's marks do not count (the plan starts every day empty) */
  here() {
    var ppl = this.state().people || {}, d0 = this.dayStart(), items = this.layout().items || {}, out = [];
    Object.keys(ppl).forEach(k => {
      var p = ppl[k];
      if (p && p.at && items[p.at] && +p.ts >= d0) out.push({ n: p.n || "", place: this.placeName(p.at, p), pr: p.pr || "", nt: p.nt || "", ts: +p.ts });
    });
    return out.sort((a, b) => a.place.localeCompare(b.place, "lt") || a.n.localeCompare(b.n, "lt"));
  },
  /* project names typed on the floor that no ShopFlow order carries yet */
  newProjects() {
    var orders = (Store.state.orders || []), have = {};
    orders.forEach(o => { have[this.norm(o.product)] = 1; have[this.norm([o.num, o.product].filter(Boolean).join(" · "))] = 1; });
    var seen = {};
    return (this.state().projects || []).filter(n => {
      var k = this.norm(n);
      if (!k || have[k] || seen[k]) return false;
      seen[k] = 1; return true;
    });
  },

  async load() {
    if (typeof Sync === "undefined" || !Sync.client || !Sync.authed) return;
    try {
      var r = await Sync.client.from(Sync.table || "workspaces").select("data").eq("id", this.ROW).limit(1);
      if (r.error) throw r.error;
      this.data = r.data && r.data[0] ? r.data[0].data : null;
      this.at = Date.now(); this.err = false;
    } catch (e) { this.err = true; }
    this.paintBtn();
    if (document.querySelector("#cechas-panel")) this.paintPanel();
  },
  start() {
    if (this._t) return;
    var tick = () => { if (!document.hidden && this.allowed()) this.load(); };
    this._t = setInterval(tick, 45000);
    document.addEventListener("visibilitychange", tick);
    setTimeout(tick, 1500);
  },

  /* ---------- top bar button ---------- */
  btnHtml() {
    if (!this.allowed()) return "";
    this.start();
    var n = this.data ? this.here().length : 0, np = this.data ? this.newProjects().length : 0;
    return '<button class="btn" id="cechas-btn" title="' + esc(this.tx("Kas kur dirba ceche", "Who is working where on the floor")) + '">🏭 ' +
      esc(this.tx("Cechas", "Floor")) + (n ? ' <span class="count-badge">' + n + "</span>" : "") +
      (np ? ' <span class="count-badge" style="background:var(--orange-soft);color:var(--orange)">+' + np + "</span>" : "") + "</button>";
  },
  paintBtn() {
    var b = document.querySelector("#cechas-btn");
    if (!b) return;
    var tmp = document.createElement("div"); tmp.innerHTML = this.btnHtml();
    if (tmp.firstChild) b.innerHTML = tmp.firstChild.innerHTML;
  },

  /* ---------- panel ---------- */
  open() {
    Modal.open(
      "<header><h2>🏭 " + esc(this.tx("Cechas dabar", "On the floor now")) + '</h2><button class="icon-btn" data-close>✕</button></header>' +
      '<div class="modal-body" id="cechas-panel"></div>' +
      '<footer><a class="btn" style="text-decoration:none" href="' + this.PLAN + '#laikas" target="_blank" rel="noopener">⏱ ' + esc(this.tx("Laiko ataskaita", "Time report")) + "</a>" +
      '<a class="btn" style="text-decoration:none" href="' + this.PLAN + '" target="_blank" rel="noopener">' + esc(this.tx("Cecho planas", "Floor plan")) + "</a>" +
      '<button class="btn primary" data-close>' + esc(this.tx("Uždaryti", "Close")) + "</button></footer>",
      modal => {
        modal.addEventListener("click", e => {
          var b = e.target.closest("[data-cx-import]");
          if (b) this.importProject(b.getAttribute("data-cx-import"));
        });
      });
    this.paintPanel();
    this.load();
  },
  paintPanel() {
    var box = document.querySelector("#cechas-panel");
    if (!box) return;
    if (!this.data) { box.innerHTML = '<p style="color:var(--text-3)">' + esc(this.err ? this.tx("Nepavyko gauti cecho plano duomenų.", "Could not read the floor plan.") : this.tx("Kraunama…", "Loading…")) + "</p>"; return; }
    var rows = this.here(), np = this.newProjects();
    var h = '<div style="display:flex;flex-direction:column;gap:6px">';
    if (!rows.length) h += '<p style="color:var(--text-3);margin:0">' + esc(this.tx("Šiandien dar niekas nepažymėtas prie staklių ar stalo.", "Nobody is marked at a machine or desk today yet.")) + "</p>";
    rows.forEach(r => {
      h += '<div style="display:flex;gap:12px;align-items:baseline;padding:8px 0;border-bottom:1px solid var(--border)">' +
        '<b style="min-width:7em">' + esc(r.n) + "</b>" +
        '<span style="flex:1;min-width:0">' + esc(r.place) + (r.pr ? ' <span style="color:var(--text-2)">· ' + esc(r.pr) + "</span>" : "") + (r.nt ? ' <span style="color:var(--text-3)">· ' + esc(r.nt) + "</span>" : "") + "</span>" +
        '<span style="color:var(--text-3);white-space:nowrap">' + esc(this.tx("nuo", "since")) + " " + this.hhmm(r.ts) + "</span></div>";
    });
    h += "</div>";
    if (np.length) {
      h += '<h3 style="margin:18px 0 4px;font-size:15px">' + esc(this.tx("Nauji projektai iš cecho", "New projects from the floor")) + "</h3>" +
        '<p style="color:var(--text-3);margin:0 0 6px;font-size:13px">' + esc(this.tx("Įrašyti telefonu prie staklių. Sukurk iš jų užsakymą, kad matytųsi visur.", "Typed on a phone at a station. Make an order from one so it shows everywhere.")) + "</p>";
      np.forEach(n => {
        h += '<div style="display:flex;gap:10px;align-items:center;padding:6px 0;border-bottom:1px solid var(--border)"><span style="flex:1">' + esc(n) + "</span>" +
          (App.can("orders.create") ? '<button class="btn" data-cx-import="' + esc(n) + '">＋ ' + esc(this.tx("Sukurti užsakymą", "Create order")) + "</button>" : "") + "</div>";
      });
    }
    h += '<p style="color:var(--text-3);font-size:12px;margin:14px 0 0">' + esc(this.tx("Atnaujinta", "Updated")) + " " + this.hhmm(this.at) + "</p>";
    box.innerHTML = h;
  },
  /* ShopFlow's own New order form, filled in; ShopFlow saves the order the usual way */
  importProject(name) {
    if (typeof NewOrder === "undefined") return;
    Modal.close(true);
    NewOrder.mode = App.isEngineer() ? "eng" : "custom";
    NewOrder.draft = { product: name };
    NewOrder._pending = [];
    NewOrder.render();
  }
};

document.addEventListener("click", function (e) {
  if (e.target.closest && e.target.closest("#cechas-btn")) Cechas.open();
});
