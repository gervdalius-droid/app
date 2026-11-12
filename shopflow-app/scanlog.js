/* ============================================================
   Scan log — every part scanned anywhere, as plain lines:
     2026-11-12 11:28:03  Grėžimas  GEL_Salionas1_77  WO-1027 GelumbauskoSalionas1  Donatas  įskaityta
   Scans from the scan-station kiosks and from machines that send their own
   (the Startech helper) all end up here. Stored in the cloud as one row per
   day ("dedes-baldai-scans-YYYY-MM-DD"), so the history is not limited by
   ShopFlow's own data and every screen sees the same log. Each line has a
   key, so a scan written twice (two screens, a retry) is still one line.
   Offline scans wait in this device's queue and are written when it is back.
   Plain loops / Promises only — this file also runs on the older tablets.
   ============================================================ */
"use strict";

var ScanLog = {
  PFX: "dedes-baldai-scans-",
  QKEY: "shopflow.scanlog.q",
  _q: [],
  _busy: false,
  _ctx: null,
  dev: null,
  init() {
    try { this._q = JSON.parse(localStorage.getItem(this.QKEY) || "[]") || []; } catch (e) { this._q = []; }
    try {
      this.dev = localStorage.getItem("shopflow.dev");
      if (!this.dev) { this.dev = uid("d"); localStorage.setItem("shopflow.dev", this.dev); }
    } catch (e) { this.dev = uid("d"); }
    this._wrap();
    setInterval(() => this.flush(), 5000);
    window.addEventListener("online", () => this.flush());
  },
  _lt() { return typeof I18N !== "undefined" && I18N.lang === "lt"; },
  RES: {
    ok: ["counted", "įskaityta"], opDone: ["step finished", "etapas baigtas"], dup: ["already counted", "jau įskaityta"],
    program: ["step started (program)", "etapas paleistas (programa)"], notfound: ["no project found", "projektas nerastas"],
    stationDone: ["step already done", "etapas jau atliktas"], waiting: ["earlier step not done", "ankstesnis etapas neatliktas"],
    notrouted: ["project has no such step", "projektas neturi šio etapo"], unknownPart: ["not on the part list", "nėra detalių sąraše"],
    nostation: ["no station", "nėra stoties"]
  },
  resText(r) { var x = this.RES[r]; return x ? x[this._lt() ? 1 : 0] : r; },
  dayKey(ms) {
    var d = new Date(ms), p = n => (n < 10 ? "0" : "") + n;
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  },
  /* every scan goes through M.scanPart — note what it did */
  _wrap() {
    if (typeof M === "undefined" || M._scanLogWrapped) return;
    M._scanLogWrapped = true;
    var orig = M.scanPart.bind(M);
    var self = this;
    M.scanPart = function (payload, stationId, memberId) {
      var res = orig(payload, stationId, memberId);
      try {
        var ctx = self._ctx || {};
        self.add({
          k: ctx.key || self.dev + "-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          ts: ctx.ts || Date.now(),
          src: ctx.src || "kiosk",
          code: String(payload || "").slice(0, 80),
          st: (res && res.station && res.station.id) || stationId || "",
          o: res && res.order ? res.order.id : "",
          w: memberId || "",
          r: res ? res.status : "notfound",
          q: res && res.item && res.qtyDone ? res.qtyDone + "/" + res.item.qty : ""
        });
      } catch (e) {}
      return res;
    };
  },
  /* what a line keeps: names as they were then, so the log reads right even after renames */
  add(e) {
    var st = e.st && D.station(e.st), o = e.o && D.order(e.o), m = e.w && D.member(e.w);
    var line = {
      k: e.k, ts: e.ts || Date.now(), src: e.src || "", code: e.code || "",
      st: e.st || "", sn: st ? st.name : e.sn || "",
      o: e.o || "", on: o ? [o.num, o.product].filter(Boolean).join(" ") : e.on || "",
      w: e.w || "", wn: m ? m.name : e.wn || "",
      r: e.r || "", q: e.q || ""
    };
    /* the first time a scan is handled is what happened; a second screen handling the
       same machine scan again ("already counted") must not replace it */
    if (this._q.some(x => x.k === line.k)) return;
    this._q.push(line);
    if (this._q.length > 5000) this._q = this._q.slice(-5000);
    this._save();
    setTimeout(() => this.flush(), 800);
  },
  _save() { try { localStorage.setItem(this.QKEY, JSON.stringify(this._q)); } catch (e) {} },
  ready() { return typeof Sync !== "undefined" && Sync.client && Sync.status === "live"; },
  /* read the day, add our lines, write it back only if nobody wrote in between (else try again) */
  flush() {
    if (this._busy || !this._q.length || !this.ready() || !navigator.onLine) return;
    this._busy = true;
    var byDay = {};
    this._q.forEach(x => { var d = this.dayKey(x.ts); (byDay[d] = byDay[d] || []).push(x); });
    var days = Object.keys(byDay);
    var tbl = () => Sync.client.from(Sync.table || "workspaces");
    var one = (day, tries) => {
      var id = this.PFX + day;
      return tbl().select("data,updated_at").eq("id", id).limit(1).then(r => {
        if (r.error) throw r.error;
        var row = r.data && r.data[0];
        var data = row && row.data && typeof row.data === "object" ? row.data : {};
        if (!data.e || typeof data.e !== "object") data.e = {};
        byDay[day].forEach(x => { if (!data.e[x.k]) data.e[x.k] = x; });
        var stamp = new Date().toISOString();
        var up = tbl().update({ data: data, updated_at: stamp }).eq("id", id);
        var w = row
          ? (row.updated_at ? up.eq("updated_at", row.updated_at) : up.is("updated_at", null)).select("id")
          : tbl().upsert({ id: id, data: data, updated_at: stamp }).select("id");
        return w.then(res => {
          if (res.error) throw res.error;
          if (!res.data || !res.data.length) { // someone else wrote this day just now
            if (tries < 4) return one(day, tries + 1);
            throw new Error("busy");
          }
          var keys = {};
          byDay[day].forEach(x => { keys[x.k] = 1; });
          this._q = this._q.filter(x => !keys[x.k]);
          this._save();
        });
      });
    };
    var chain = Promise.resolve();
    days.forEach(d => { chain = chain.then(() => one(d, 0)).catch(e => console.warn("[scanlog]", d, e && e.message || e)); });
    chain.then(() => { this._busy = false; }, () => { this._busy = false; });
  },
  /* lines between two days (inclusive), newest first; this device's unsent ones included */
  load(fromDay, toDay) {
    if (!this.ready()) return Promise.resolve(this._q.slice().reverse());
    return Sync.client.from(Sync.table || "workspaces").select("id,data").gte("id", this.PFX + fromDay).lte("id", this.PFX + toDay).then(r => {
      if (r.error) throw r.error;
      var all = {};
      (r.data || []).forEach(row => { var e = row.data && row.data.e || {}; for (var k in e) all[k] = e[k]; });
      this._q.forEach(x => { var d = this.dayKey(x.ts); if (d >= fromDay && d <= toDay) all[x.k] = x; });
      return Object.keys(all).map(k => all[k]).sort((a, b) => b.ts - a.ts);
    });
  },
  /* ---------- the text everyone can read ---------- */
  pad(s, n) { s = String(s || ""); return s.length >= n ? s.slice(0, n) : s + new Array(n - s.length + 1).join(" "); },
  fmt(ts) {
    var d = new Date(ts), p = n => (n < 10 ? "0" : "") + n;
    return this.dayKey(ts) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
  },
  text(lines) {
    return lines.slice().sort((a, b) => a.ts - b.ts).map(x =>
      this.fmt(x.ts) + "  " + this.pad(x.sn || x.st, 16) + "  " + this.pad(x.code, 26) + "  " + this.pad(x.on || "—", 34) + "  " + this.pad(x.wn || "", 14) + "  " + this.resText(x.r) + (x.q ? " " + x.q : "") + (x.src && x.src !== "kiosk" ? "  [" + x.src + "]" : "")
    ).join("\r\n") + "\r\n";
  },
  csv(lines) {
    var q = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    var head = this._lt() ? ["Laikas", "Stotis", "Kodas", "Projektas", "Kas", "Rezultatas", "Kiekis", "Šaltinis"] : ["Time", "Station", "Code", "Project", "Who", "Result", "Qty", "Source"];
    return "﻿" + [head.map(q).join(";")].concat(lines.slice().sort((a, b) => a.ts - b.ts).map(x => [this.fmt(x.ts), x.sn || x.st, x.code, x.on, x.wn, this.resText(x.r), x.q, x.src].map(q).join(";"))).join("\r\n");
  },
  download(name, body, type) {
    var b = new Blob([body], { type: type });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(b);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  },
  /* ---------- the window ---------- */
  open(opts) {
    opts = opts || {};
    var today = this.dayKey(Date.now());
    var st = { from: opts.from || today, to: opts.to || today, station: opts.station || "", order: opts.order || "", q: "", lines: [] };
    var L = (en, lt) => this._lt() ? lt : en;
    var stations = Store.state.stations || [];
    Modal.open(`
      <header><h2>${L("Scan log", "Skenavimų žurnalas")}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body sl-body">
        <div class="sl-filters">
          <div class="field"><label>${L("From", "Nuo")}</label><input class="input" type="date" id="sl-from" value="${st.from}"></div>
          <div class="field"><label>${L("To", "Iki")}</label><input class="input" type="date" id="sl-to" value="${st.to}"></div>
          <div class="field"><label>${L("Station", "Stotis")}</label><select class="select" id="sl-st"><option value="">${L("All", "Visos")}</option>${stations.map(s => `<option value="${esc(s.id)}" ${st.station === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></div>
          <div class="field grow"><label>${L("Search", "Paieška")}</label><input class="input" id="sl-q" placeholder="${L("Part code, project, person…", "Detalės kodas, projektas, žmogus…")}" value="${esc(opts.order ? (D.order(opts.order) || {}).num || "" : "")}"></div>
        </div>
        <div class="sl-quick">
          <button class="mini-act" data-sl-days="0">${L("Today", "Šiandien")}</button>
          <button class="mini-act" data-sl-days="1">${L("Yesterday", "Vakar")}</button>
          <button class="mini-act" data-sl-days="7">${L("7 days", "7 dienos")}</button>
          <button class="mini-act" data-sl-days="30">${L("30 days", "30 dienų")}</button>
          <span class="grow"></span><span class="t-caption" id="sl-count"></span>
        </div>
        <pre class="sl-text" id="sl-text"><span class="t-caption">${L("Loading…", "Kraunama…")}</span></pre>
      </div>
      <footer>
        <button class="btn ghost" data-close>${L("Close", "Uždaryti")}</button>
        <span class="grow"></span>
        <button class="btn subtle" id="sl-csv">${icon("table", 13)} .csv (Excel)</button>
        <button class="btn primary" id="sl-txt">${icon("import", 13)} ${L("Download .txt", "Atsisiųsti .txt")}</button>
      </footer>`, m => {
      m.classList.add("sl-modal");
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      var shown = [];
      var paint = () => {
        var q = $("#sl-q", m).value.trim().toLowerCase();
        var stF = $("#sl-st", m).value;
        shown = st.lines.filter(x => (!stF || x.st === stF) && (!q || [x.code, x.on, x.wn, x.sn].join(" ").toLowerCase().indexOf(q) >= 0));
        $("#sl-count", m).textContent = shown.length + " " + L("scans", "skenavimai");
        $("#sl-text", m).textContent = shown.length ? this.text(shown) : L("No scans in this period.", "Šiuo laikotarpiu skenavimų nėra.");
      };
      var load = () => {
        st.from = $("#sl-from", m).value || today;
        st.to = $("#sl-to", m).value || st.from;
        if (st.to < st.from) { var t = st.to; st.to = st.from; st.from = t; }
        $("#sl-text", m).textContent = L("Loading…", "Kraunama…");
        this.load(st.from, st.to).then(lines => { st.lines = lines; paint(); }).catch(e => { $("#sl-text", m).textContent = (e && e.message) || String(e); });
      };
      $("#sl-from", m).onchange = load;
      $("#sl-to", m).onchange = load;
      $("#sl-st", m).onchange = paint;
      $("#sl-q", m).oninput = paint;
      $$("[data-sl-days]", m).forEach(b => b.onclick = () => {
        var n = +b.dataset.slDays, end = n === 1 ? Date.now() - 864e5 : Date.now(), start = n <= 1 ? end : Date.now() - (n - 1) * 864e5;
        $("#sl-from", m).value = this.dayKey(start);
        $("#sl-to", m).value = this.dayKey(end);
        load();
      });
      var fname = ext => "skenavimai_" + st.from + (st.to !== st.from ? "_" + st.to : "") + ext;
      $("#sl-txt", m).onclick = () => this.download(fname(".txt"), "﻿" + this.text(shown), "text/plain;charset=utf-8");
      $("#sl-csv", m).onclick = () => this.download(fname(".csv"), this.csv(shown), "text/csv;charset=utf-8");
      load();
    });
  }
};
if (typeof window !== "undefined") window.addEventListener("load", () => { try { ScanLog.init(); } catch (e) { console.warn("[scanlog]", e); } });
