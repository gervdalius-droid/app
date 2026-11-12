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
  /* C:\Programs\GEL\GEL_12.pgm → GEL_12 */
  codeOf(raw) {
    var s = String(raw || "").trim();
    var base = s.split(/[\\/]/).pop();
    var noExt = base.replace(/\.[A-Za-z0-9]{1,5}$/, "");
    return { raw: s, code: noExt || s, isFile: base !== s || noExt !== base };
  },
  process(rowId, data) {
    var scans = Array.isArray(data.scans) ? data.scans : [];
    if (!scans.length) return;
    var seen = Store.state.machineSeq || (Store.state.machineSeq = {});
    var top = scans.reduce((n, s) => Math.max(n, +s.seq || 0), 0);
    /* first time this machine is seen: start from now, don't replay its history */
    if (!(rowId in seen)) { seen[rowId] = top; Store.save(); return; }
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
      this.handle(s, stationId, who, data.name || type);
    });
    Store.save();
    if (typeof App !== "undefined") App.render();
  },
  handle(scan, stationId, who, machineName) {
    var c = this.codeOf(scan.code);
    /* the code as scanned first (a part label), then without folder/extension (a program file) */
    var tries = c.code !== c.raw ? [c.raw, c.code] : [c.raw];
    var res = null;
    for (var i = 0; i < tries.length; i++) {
      var parsed = D.scanParse(tries[i]);
      if (parsed && parsed.order && !parsed.unknownPart) {
        res = M.scanPart(tries[i], stationId, who || this._fallbackMember(parsed.order, stationId));
        break;
      }
    }
    if (res) return res;
    /* a program name for a known project that isn't one of its parts: the project
       is being drilled — run its step, without counting a part */
    var p = D.scanParse(c.code);
    if (p && p.order) {
      var o = p.order;
      var op = o.ops.filter(x => x.stationId === stationId && x.status !== "done").find(x => D.opReady(o, x)) || o.ops.find(x => x.stationId === stationId && x.status !== "done");
      if (op) {
        var m = who || this._fallbackMember(o, stationId);
        if (!op.assigneeId && m) op.assigneeId = m;
        M.touchScanClock(op, m);
        Store.state.scanLog.unshift({ ts: Date.now(), by: m, payload: String(c.raw).slice(0, 60), status: "program", orderId: o.id, stationId: stationId, partCode: null, machine: machineName });
        if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
        return { status: "program", order: o, op: op };
      }
    }
    Store.state.scanLog.unshift({ ts: Date.now(), by: who, payload: String(c.raw).slice(0, 60), status: "notfound", orderId: null, stationId: stationId, partCode: null, machine: machineName });
    if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
    return { status: "notfound" };
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
