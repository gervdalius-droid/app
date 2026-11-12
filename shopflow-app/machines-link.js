/* ============================================================
   ShopFlow ↔ machines that report their own scans
   The SCM Startech CN Plus PC runs a small helper (machine-agent/) that
   sees each label the operator scans to open a drilling program and
   writes it to the cloud row "dedes-machine-startech". Here each new
   scan is treated exactly like a scan at ShopFlow's own Scan Station:
     • the part is counted through the Startech's step (the step the
       floor plan maps the Startech to, normally Grėžimas / CNC),
     • the step starts running (scan = timer), so the card goes green,
     • a program-name barcode that is not a part on the list still
       starts the project's step, it just can't count a part.
   The person is whoever the floor plan has at the Startech today.
   Only a ShopFlow screen that is live (in sync) does this, and every
   scan is handled once: the last handled number is saved in ShopFlow's
   own data, and repeated part codes are not counted twice anyway.
   ============================================================ */
"use strict";

var Machines = {
  PREFIX: "dedes-machine-",
  POLL_MS: 8000,
  MAX_AGE_MS: 12 * 36e5, // scans older than this (a screen that was off) are not replayed
  rows: {},
  _t: null,
  _busy: false,
  start() {
    if (this._t) return;
    this._t = setInterval(() => this.poll(), this.POLL_MS);
    setTimeout(() => this.poll(), 4000);
  },
  ready() {
    return typeof Sync !== "undefined" && Sync.client && Sync.status === "live" && !Sync._applying && typeof App !== "undefined" && App.me;
  },
  poll() {
    if (this._busy || !this.ready() || document.hidden) return;
    this._busy = true;
    Sync.client.from(Sync.table || "workspaces").select("id,data").like("id", this.PREFIX + "%").then(r => {
      this._busy = false;
      if (!r || r.error || !Array.isArray(r.data)) return;
      r.data.forEach(row => {
        if (!row || !row.data) return;
        this.rows[row.id] = row.data;
        try { this.process(row.id, row.data); } catch (e) { console.warn("[machines]", row.id, e); }
      });
    }).catch(() => { this._busy = false; });
  },
  /* the plan item for this machine type (the Startech on the floor plan) */
  planItem(type) {
    if (typeof Cechas === "undefined" || !Cechas.data) return null;
    var items = Cechas.layout().items || {};
    for (var k in items) if (items[k] && items[k].t === type) return k;
    return null;
  },
  stationFor(type) {
    var cfg = (Store.state.machineCfg || {})[type] || {};
    if (cfg.stationId && D.station(cfg.stationId)) return cfg.stationId;
    var item = this.planItem(type);
    var fromPlan = item && typeof Cechas !== "undefined" ? Cechas.stepFor(item) : null;
    if (fromPlan) return fromPlan;
    var st = (Store.state.stations || []).find(s => /gr[eė][žz]|drill|bor/i.test(String(s.id) + " " + String(s.name || "")));
    return st ? st.id : (D.station("cnc") ? "cnc" : null);
  },
  /* who is at the machine on the floor plan right now */
  memberFor(type) {
    var item = this.planItem(type);
    if (!item || typeof Cechas === "undefined") return null;
    var ppl = Cechas.state().people || {};
    for (var k in ppl) {
      var p = ppl[k];
      if (p && p.at === item && !p.pz && Cechas.counts(p)) {
        var m = Cechas.memberFor(p.n);
        if (m) return m.id;
      }
    }
    return null;
  },
  /* C:\Programs\GEL\GEL_12.pgm → GEL_12 ; GEL_Salionas1_79_ → GEL_Salionas1_79 */
  codeOf(raw) {
    var s = String(raw || "").trim();
    var base = s.split(/[\\/]/).pop();
    var noExt = base.replace(/\.[A-Za-z0-9]{1,5}$/, "");
    var clean = noExt.replace(/[_\-\s.]+$/, "").replace(/^[_\-\s.]+/, "");
    return { raw: s, code: clean || noExt || s, isFile: base !== s || noExt !== base };
  },
  _n(v) {
    return String(v || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "");
  },
  /* A program name like GEL_Salionas1_79 is not a ShopFlow name, but its pieces
     are: "GEL" (client / portfolio / start of the name) and "Salionas1" (in the
     name GelumbauskoSalionas1). The project whose name holds the most of the
     code wins — only when it clearly beats the next one. */
  matchOrder(code) {
    var toks = String(code || "").split(/[_\-\s.]+/).filter(Boolean);
    while (toks.length > 1 && /^\d+[a-z]?$/i.test(toks[toks.length - 1])) toks.pop(); // the part number
    toks = toks.map(t => this._n(t)).filter(t => t.length >= 2);
    if (!toks.length) return null;
    var joined = toks.join("");
    var best = null, second = 0;
    (Store.state.orders || []).forEach(o => {
      if (o.archived || o.shipped || o.type === "eng") return;
      var prod = this._n(o.product), num = this._n(o.num), sw = this._n(o.swood && o.swood.project);
      var pf = o.portfolioId && D.portfolio(o.portfolioId) ? this._n(D.portfolio(o.portfolioId).name) : "";
      var cl = this._n(o.client);
      var sc = 0;
      if (joined === sw || joined === num || joined === prod) sc += 100;
      toks.forEach(t => {
        if (prod.indexOf(t) >= 0) sc += t.length * 2;
        else if (sw.indexOf(t) >= 0 || num.indexOf(t) >= 0) sc += t.length * 2;
        else if (cl.indexOf(t) === 0 || pf.indexOf(t) === 0 || cl === t || pf === t) sc += t.length;
      });
      if (!best || sc > best.sc) { second = best ? best.sc : 0; best = { o: o, sc: sc }; } else if (sc > second) second = sc;
    });
    return best && best.sc >= 8 && best.sc > second ? best.o : null;
  },
  process(rowId, data) {
    var scans = Array.isArray(data.scans) ? data.scans : [];
    if (!scans.length) return;
    var seen = Store.state.machineSeq || (Store.state.machineSeq = {});
    var top = scans.reduce((n, s) => Math.max(n, +s.seq || 0), 0);
    /* first time this machine is seen: take its scans from the last two hours, not its whole history */
    if (!(rowId in seen)) {
      var since = Date.now() - 2 * 36e5;
      var older = scans.filter(x => (+x.at || 0) < since).reduce((n, x) => Math.max(n, +x.seq || 0), 0);
      seen[rowId] = older;
    }
    var last = +seen[rowId] || 0;
    if (top < last) { seen[rowId] = top; Store.save(); return; } // the helper was reinstalled and started counting again
    var fresh = scans.filter(s => +s.seq > last).sort((a, b) => a.seq - b.seq);
    if (!fresh.length) return;
    var type = data.type || rowId.slice(this.PREFIX.length);
    var stationId = this.stationFor(type);
    var who = this.memberFor(type);
    var now = Date.now();
    fresh.forEach(s => {
      seen[rowId] = Math.max(+seen[rowId] || 0, +s.seq);
      if (!stationId || now - (+s.at || 0) > this.MAX_AGE_MS) return;
      this.handle(s, stationId, who, data.name || type, rowId);
    });
    Store.save();
    if (typeof App !== "undefined") App.render();
  },
  handle(scan, stationId, who, machineName, rowId) {
    var key = (rowId || "machine") + "-" + scan.seq;
    var ctx = { key: key, ts: +scan.at || Date.now(), src: machineName || "machine" };
    if (typeof ScanLog !== "undefined") ScanLog._ctx = ctx;
    try { return this._handle(scan, stationId, who, machineName, ctx); } finally { if (typeof ScanLog !== "undefined") ScanLog._ctx = null; }
  },
  _handle(scan, stationId, who, machineName, ctx) {
    var c = this.codeOf(scan.code);
    /* the code as scanned first (a part label), then without folder/extension (a program file) */
    var tries = c.code !== c.raw ? [c.raw, c.code] : [c.raw];
    var viaScanPart = false;
    var result = r => {
      this._remember(scan, c, r);
      /* M.scanPart writes its own log line; anything decided here gets one too */
      if (!viaScanPart && typeof ScanLog !== "undefined") ScanLog.add({ k: ctx.key, ts: ctx.ts, src: ctx.src, code: c.raw, st: stationId, o: r.order ? r.order.id : "", w: who || (r.op && r.op.assigneeId) || "", r: r.status });
      return r;
    };
    var res = null;
    for (var i = 0; i < tries.length; i++) {
      var parsed = D.scanParse(tries[i]);
      if (parsed && parsed.order && !parsed.unknownPart) {
        viaScanPart = true;
        res = M.scanPart(tries[i], stationId, who || this._fallbackMember(parsed.order, stationId));
        break;
      }
    }
    if (res) return result(res);
    /* a program name for a known project that isn't one of its parts: the project
       is being drilled — run its step, without counting a part */
    var p = D.scanParse(c.code);
    var o = p && p.order ? p.order : this.matchOrder(c.code);
    if (o) {
      var op = o.ops.filter(x => x.stationId === stationId && x.status !== "done").find(x => D.opReady(o, x)) || o.ops.find(x => x.stationId === stationId && x.status !== "done");
      if (op) {
        var m = who || this._fallbackMember(o, stationId);
        if (!op.assigneeId && m) op.assigneeId = m;
        M.touchScanClock(op, m);
        Store.state.scanLog.unshift({ ts: Date.now(), by: m, payload: String(c.raw).slice(0, 60), status: "program", orderId: o.id, stationId: stationId, partCode: null, machine: machineName });
        if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
        return result({ status: "program", order: o, op: op });
      }
      return result({ status: "stationDone", order: o });
    }
    Store.state.scanLog.unshift({ ts: Date.now(), by: who, payload: String(c.raw).slice(0, 60), status: "notfound", orderId: null, stationId: stationId, partCode: null, machine: machineName });
    if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
    return result({ status: "notfound" });
  },
  /* what happened to the last scans, for Settings → Machines */
  recent: [],
  _remember(scan, c, r) {
    this.recent.unshift({ at: +scan.at || Date.now(), code: c.raw, status: r.status, order: r.order ? r.order.num + " · " + r.order.product : "" });
    if (this.recent.length > 12) this.recent.length = 12;
  },
  settingsHtml() {
    var rows = Object.keys(this.rows).map(id => ({ id: id, d: this.rows[id] }));
    var lt = typeof I18N !== "undefined" && I18N.lang === "lt";
    var L = (en, l) => lt ? l : en;
    var stLbl = { ok: L("part counted", "detalė įskaityta"), opDone: L("step finished", "etapas baigtas"), dup: L("already counted", "jau įskaityta"), program: L("step started (program)", "etapas paleistas (programa)"), notfound: L("no project found", "projektas nerastas"), stationDone: L("step already done", "etapas jau atliktas"), waiting: L("earlier step not done", "ankstesnis etapas neatliktas"), notrouted: L("project has no such step", "projektas neturi šio etapo"), unknownPart: L("not on the part list", "nėra detalių sąraše") };
    if (!rows.length) return `<div class="t-caption">${L("No machine helper has reported yet.", "Joks staklių pagalbininkas dar nesiuntė duomenų.")}</div>`;
    return rows.map(x => {
      var d = x.d, type = d.type || x.id.slice(this.PREFIX.length), st = this.status(type), stId = this.stationFor(type), stn = stId && D.station(stId);
      return `<div class="mach-card">
        <div class="mach-head"><b>${esc(d.name || type)}</b>
          <span class="mach-dot ${st && st.online ? "on" : ""}"></span><span class="t-caption">${st && st.online ? L("helper online", "pagalbininkas veikia") : L("helper offline", "pagalbininkas neprisijungęs") + (d.agentAt ? " · " + fmtAgo(d.agentAt) : "")}</span>
          <span class="grow"></span>
          <label class="t-caption">${L("Step", "Etapas")}</label>
          <select class="select mach-st" data-mach-st="${esc(type)}">${(Store.state.stations || []).map(s0 => `<option value="${esc(s0.id)}" ${stId === s0.id ? "selected" : ""}>${esc(s0.name)}</option>`).join("")}</select>
        </div>
        <div class="mach-list">${this.recent.length ? this.recent.map(r => `<div class="mach-row ${r.status === "notfound" ? "bad" : ""}"><span class="t-num">${new Date(r.at).toLocaleTimeString("lt-LT", { hour: "2-digit", minute: "2-digit" })}</span><code>${esc(r.code)}</code><span>→ ${esc(stLbl[r.status] || r.status)}${r.order ? " · <b>" + esc(r.order) + "</b>" : ""}</span></div>`).join("") : `<div class="t-caption">${L("Scans handled by this screen appear here. Today on the machine: ", "Čia matysis šio ekrano apdoroti skenavimai. Šiandien staklėse: ")}${d.today || 0}${d.last ? " · " + L("last", "paskutinis") + ": " + esc(d.last.code) : ""}</div>`}</div>
      </div>`;
    }).join("");
  },
  bindSettings(root) {
    $$("[data-mach-st]", root).forEach(sel => sel.onchange = () => {
      var cfg = Store.state.machineCfg || (Store.state.machineCfg = {});
      cfg[sel.dataset.machSt] = Object.assign({}, cfg[sel.dataset.machSt] || {}, { stationId: sel.value });
      Store.save();
      Toast.show("✓", { emoji: "check" });
    });
  },
  /* nobody marked on the plan: the step's own assignee, else whoever usually runs that station */
  _fallbackMember(o, stationId) {
    var op = o.ops.find(x => x.stationId === stationId && x.status !== "done");
    if (op && op.assigneeId) return op.assigneeId;
    var st = D.station(stationId);
    if (st && Array.isArray(st.defaultAssigneeIds) && st.defaultAssigneeIds[0]) return st.defaultAssigneeIds[0];
    if (st && st.defaultAssigneeId) return st.defaultAssigneeId;
    return App.me ? App.me.id : null;
  },
  /* for a status line: when the machine last scanned and whether its helper is online */
  status(type) {
    var d = this.rows[this.PREFIX + type];
    if (!d) return null;
    var now = Date.now();
    return {
      online: !!d.agentAt && now - d.agentAt < 3 * 60000,
      lastAt: d.lastAt || null,
      last: d.last || null,
      busy: !!d.lastAt && now - d.lastAt < 10 * 60000
    };
  }
};
if (typeof window !== "undefined") window.addEventListener("load", () => setTimeout(() => { try { Machines.start(); } catch (e) {} }, 5000));
