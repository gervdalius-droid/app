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
    /* a station screen signed in as a worker doesn't load the floor plan by itself, but scanners need
       its places (station QR codes, who is at a machine): read it here, without touching any jobs */
    if (typeof Cechas !== "undefined" && !Cechas.allowed() && (!Cechas.data || Date.now() - Cechas.at > 120000)) {
      Sync.client.from(Sync.table || "workspaces").select("data").eq("id", Cechas.ROW).limit(1).then(r => {
        if (r && !r.error && r.data && r.data[0]) { Cechas.data = r.data[0].data; Cechas.at = Date.now(); }
      }).catch(() => {});
    }
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
  /* A scanner can be carried around: scanning a station's QR code from the floor plan
     (…/cechas/?at=<place>) moves it to that place for the rest of the day, so the next
     part labels count at that place's step. ?at=off, or the machine's own QR, brings it back. */
  cfgOf(type) { var all = Store.state.machineCfg || (Store.state.machineCfg = {}); return all[type] || (all[type] = {}); },
  dayStart() { var d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); },
  placeOf(type) {
    var pl = ((Store.state.machineCfg || {})[type] || {}).place;
    return pl && +pl.at >= this.dayStart() ? pl : null;
  },
  placeCode(raw) {
    var m = /[?&]at=([^&#\s]+)/i.exec(String(raw || ""));
    return m && /cechas/i.test(String(raw)) ? decodeURIComponent(m[1]) : null;
  },
  setPlace(type, itemId, at) {
    var cfg = this.cfgOf(type), C = typeof Cechas !== "undefined" ? Cechas : null;
    var home = this.planItem(type);
    if (!itemId || itemId === "off" || itemId === home) { delete cfg.place; return { home: true }; }
    var items = C && C.layout().items || {};
    var it = items[itemId];
    if (C && C.data && !it) return { bad: true };
    var step = C && it ? C.stepFor(itemId) : null;
    var name = C ? C.placeName(itemId) : itemId;
    cfg.place = { item: itemId, step: step || "", name: name, at: at || Date.now() };
    return { place: cfg.place };
  },
  stationFor(type, base) {
    var cfg = (Store.state.machineCfg || {})[type] || {};
    var pl = !base && this.placeOf(type);
    if (pl && pl.step && D.station(pl.step)) return pl.step;
    if (cfg.stationId && D.station(cfg.stationId)) return cfg.stationId;
    var item = this.planItem(type);
    var fromPlan = item && typeof Cechas !== "undefined" ? Cechas.stepFor(item) : null;
    if (fromPlan) return fromPlan;
    /* the Volter cuts the nested sheets: the cutting step (Pjovimas) */
    if (type === "volter" && typeof Cechas !== "undefined") { var cut = Cechas.resolveStep("cut"); if (cut) return cut; }
    var st = (Store.state.stations || []).find(s => /gr[eė][žz]|drill|bor/i.test(String(s.id) + " " + String(s.name || "")));
    return st ? st.id : (D.station("cnc") ? "cnc" : null);
  },
  /* Scanner stations: every machine and desk on the floor plan where work is scanned. Each has its
     ShopFlow step (set on the floor plan) and may have a default person (Settings → Scanners). */
  WORK_TYPES: ["altendorf", "felder", "olimpic", "startech", "volter", "vitap", "blum", "booth", "laser", "desk"],
  places() {
    if (typeof Cechas === "undefined") return [];
    var items = Cechas.layout().items || {}, out = [];
    Object.keys(items).forEach(id => {
      var it = items[id];
      if (!it || this.WORK_TYPES.indexOf(it.t) < 0) return;
      out.push({ id: id, t: it.t, name: Cechas.placeName(id), step: Cechas.stepFor(id) });
    });
    return out.sort((a, b) => ((a.t === "desk") - (b.t === "desk")) || String(a.name).localeCompare(String(b.name), "lt"));
  },
  placeCfgOf(itemId) { var all = Store.state.placeCfg || (Store.state.placeCfg = {}); return all[itemId] || (all[itemId] = {}); },
  /* who works at a place: its default person, else who is marked there on the floor plan */
  personAt(itemId) {
    if (!itemId) return null;
    var def = ((Store.state.placeCfg || {})[itemId] || {}).memberId;
    if (def && D.member(def)) return def;
    if (typeof Cechas === "undefined") return null;
    var ppl = Cechas.state().people || {};
    for (var k in ppl) {
      var p = ppl[k];
      if (p && p.at === itemId && !p.pz && Cechas.counts(p)) { var m = Cechas.memberFor(p.n); if (m) return m.id; }
    }
    return null;
  },
  /* who scans: the scanner's own person (Settings → Scanners), else the person of the station it is at
     (the station it was moved to by its QR, or its machine) */
  memberFor(type) {
    var fixed = ((Store.state.machineCfg || {})[type] || {}).memberId;
    if (fixed && D.member(fixed)) return fixed;
    var pl = this.placeOf(type);
    if (pl) return this.personAt(pl.item);
    var item = this.planItem(type);
    var def = item && ((Store.state.placeCfg || {})[item] || {}).memberId;
    if (def && D.member(def)) return def;
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
    var who = this.memberFor(type);
    var now = Date.now();
    fresh.forEach(s => {
      seen[rowId] = Math.max(+seen[rowId] || 0, +s.seq);
      who = this.memberFor(type); // the station may have changed with the previous scan
      if (now - (+s.at || 0) > this.MAX_AGE_MS) return;
      /* a station's QR code from the floor plan: the scanner moves there */
      var place = this.placeCode(s.code);
      if (place) {
        var r = this.setPlace(type, place, +s.at || now);
        who = this.memberFor(type);
        var L = (en, lt) => typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
        var stn = r.place && r.place.step && D.station(r.place.step);
        var msg = r.bad ? L("unknown station code", "nežinomas vietos kodas")
          : r.home ? L("back at the machine", "grįžta prie staklių") + (D.station(this.stationFor(type)) ? " · " + D.station(this.stationFor(type)).name : "")
          : r.place.name + (stn ? " · " + stn.name : " · " + L("this place has no ShopFlow step — set it on the floor plan", "ši vieta neturi ShopFlow etapo — nustatykite jį cecho plane"));
        this._say(type, (data.name || type) + (who && D.member(who) ? " · " + D.member(who).name : "") + " → " + msg, !r.bad && (r.home || !!stn));
        this.recent.unshift({ at: +s.at || now, code: r.place ? r.place.name : String(s.code).slice(0, 40), status: r.bad ? "notfound" : "place", order: stn ? stn.name : "" });
        if (this.recent.length > 12) this.recent.length = 12;
        return;
      }
      /* a nesting layout sheet (NS-XXXXXX-03): one scan = one sheet cut, always at the machine's own step */
      if (typeof NestSheets !== "undefined" && NestSheets.isCode(s.code)) {
        var cut = this.stationFor(type, true);
        if (!cut) return;
        NestSheets.queue({ key: rowId + "-" + s.seq, code: String(s.code).trim().toUpperCase(), at: +s.at || now, stationId: cut, who: who, src: data.name || type, type: type });
        return;
      }
      var stationId = this.stationFor(type);
      if (!stationId) return;
      var res = this.handle(s, stationId, who, data.name || type, rowId);
      /* a scanner set to a person: the work is theirs, even if someone else was already on the step */
      var fixed = this.cfgOf(type).memberId;
      if (fixed && res && res.op && (res.status === "ok" || res.status === "opDone" || res.status === "program")) {
        var ids = Array.isArray(res.op.assigneeIds) ? res.op.assigneeIds : (res.op.assigneeId ? [res.op.assigneeId] : []);
        if (ids.indexOf(fixed) < 0) { res.op.assigneeIds = ids.concat([fixed]); if (!res.op.assigneeId) res.op.assigneeId = fixed; }
      }
      if (res) {
        var L2 = (en, lt) => typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
        var good = res.status === "ok" || res.status === "opDone" || res.status === "program";
        var q = res.item && res.qtyDone ? " · " + res.qtyDone + "/" + res.item.qty : "";
        var stn2 = D.station(stationId);
        this._say(type, (data.name || type) + " · " + String(s.code).slice(0, 40) + (res.order ? " → " + res.order.num + " · " + (res.order.product || "") : "") + (stn2 ? " · " + stn2.name : "") + q +
          (good ? "" : " — " + ({ dup: L2("already counted", "jau įskaityta"), stationDone: L2("step already done", "etapas jau atliktas"), notrouted: L2("project has no such step", "projektas neturi šio etapo"), notfound: L2("no project found", "projektas nerastas"), waiting: L2("earlier step not done", "ankstesnis etapas neatliktas"), unknownPart: L2("not on the part list", "nėra detalių sąraše") }[res.status] || res.status)), good);
      }
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
  /* a short message on the station screen of this scanner (Settings → Machines, or ?station=<type>) */
  _say(type, text, good) {
    try {
      if (typeof NestSheets === "undefined" || typeof Toast === "undefined") return;
      if (NestSheets.mine(type)) Toast.show(text, { emoji: good ? "check" : "alert", ms: 9000 });
    } catch (e) {}
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
    var stLbl = { place: L("scanner moved to", "skeneris perkeltas į"), sheet: L("sheet cut, step running", "plokštė supjauta, etapas vyksta"), sheetDone: L("sheet cut, step finished", "plokštė supjauta, etapas baigtas"), confirm: L("waiting for the operator to pick the project", "laukia, kol operatorius pasirinks projektą"), nestUnknown: L("nesting project not found", "Nesting projektas nerastas"), sheetUnknown: L("no such sheet in the nesting project", "Nesting projekte tokios plokštės nėra"), error: L("could not read the nesting project", "nepavyko nuskaityti Nesting projekto"), ok: L("part counted", "detalė įskaityta"), opDone: L("step finished", "etapas baigtas"), dup: L("already counted", "jau įskaityta"), program: L("step started (program)", "etapas paleistas (programa)"), notfound: L("no project found", "projektas nerastas"), stationDone: L("step already done", "etapas jau atliktas"), waiting: L("earlier step not done", "ankstesnis etapas neatliktas"), notrouted: L("project has no such step", "projektas neturi šio etapo"), unknownPart: L("not on the part list", "nėra detalių sąraše") };
    var nest = typeof NestSheets !== "undefined" ? NestSheets.settingsHtml() : "";
    if (!rows.length) return `<div class="t-caption">${L("No machine helper has reported yet.", "Joks staklių pagalbininkas dar nesiuntė duomenų.")}</div>` + nest;
    return rows.map(x => {
      var d = x.d, type = d.type || x.id.slice(this.PREFIX.length), st = this.status(type), stId = this.stationFor(type, true), stn = stId && D.station(stId);
      return `<div class="mach-card">
        <div class="mach-head"><b>${esc(d.name || type)}</b>
          <span class="mach-dot ${st && st.online ? "on" : ""}"></span><span class="t-caption">${st && st.online ? L("helper online", "pagalbininkas veikia") : L("helper offline", "pagalbininkas neprisijungęs") + (d.agentAt ? " · " + fmtAgo(d.agentAt) : "")}${d.host ? " · " + esc(d.host) : ""}</span>
        </div>
        <div class="mach-form">
          <label class="mach-field"><span class="t-caption">${L("Who scans (gets the questions and the credit)", "Kas skenuoja (gauna klausimus ir darbą)")}</span>
            <select class="select" data-mach-who="${esc(type)}"><option value="">${L("— whoever is at it on the floor plan —", "— kas pažymėtas cecho plane —")}</option>${(Store.state.members || []).filter(m => m && m.name && !m.archived).map(m => `<option value="${esc(m.id)}" ${this.cfgOf(type).memberId === m.id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select></label>
          <label class="mach-field"><span class="t-caption">${L("Step at the machine", "Etapas prie staklių")}</span>
            <select class="select" data-mach-st="${esc(type)}">${(Store.state.stations || []).filter(s0 => s0.kind !== "eng").map(s0 => `<option value="${esc(s0.id)}" ${stId === s0.id ? "selected" : ""}>${esc(s0.name)}</option>`).join("")}</select></label>
        </div>
        ${(() => { var pl = this.placeOf(type), ps = pl && pl.step && D.station(pl.step); return pl ? `<div class="mach-row"><span>${L("Now at", "Dabar")}: <b>${esc(pl.name)}</b>${ps ? " · " + esc(ps.name) : ""} <span class="t-caption">${L("since", "nuo")} ${new Date(+pl.at).toLocaleTimeString("lt-LT", { hour: "2-digit", minute: "2-digit" })}</span></span><span class="grow"></span><button class="btn" data-mach-home="${esc(type)}">${L("Back to the machine", "Grąžinti prie staklių")}</button></div>` : ""; })()}
        <div class="mach-list">${this.recent.length ? this.recent.map(r => `<div class="mach-row ${r.status === "notfound" ? "bad" : ""}"><span class="t-num">${new Date(r.at).toLocaleTimeString("lt-LT", { hour: "2-digit", minute: "2-digit" })}</span><code>${esc(r.code)}</code><span>→ ${esc(stLbl[r.status] || r.status)}${r.order ? " · <b>" + esc(r.order) + "</b>" : ""}</span></div>`).join("") : `<div class="t-caption">${L("Scans handled by this screen appear here. Today on the machine: ", "Čia matysis šio ekrano apdoroti skenavimai. Šiandien staklėse: ")}${d.today || 0}${d.last ? " · " + L("last", "paskutinis") + ": " + esc(d.last.code) : ""}</div>`}</div>
      </div>`;
    }).join("") + this.placesHtml(L) + nest;
  },
  placesHtml(L) {
    var list = this.places();
    var mem = (Store.state.members || []).filter(m => m && m.name && !m.archived);
    var head = `<div class="mach-card"><div class="mach-head"><b>${L("Scanner stations — machines and desks", "Skenavimo stotys — staklės ir stalai")}</b><span class="grow"></span>
      <a class="btn" href="../hub/cechas/?qr=1" target="_blank" rel="noopener">${icon("qr", 14)} ${L("Print station QR codes", "Spausdinti stočių QR kodus")}</a></div>
      <div class="t-caption">${L("A scanner works at a station after scanning its QR code (or at its own machine). Scans count at the station's step, for the scanner's person, else the station's person below, else who is marked there on the floor plan. Steps are set on the floor plan.", "Skeneris dirba stotyje nuskenavęs jos QR kodą (arba prie savo staklių). Skenavimai įskaitomi stoties etape — skenerio žmogui, jei jo nėra — žemiau nurodytam stoties žmogui, jei ir jo nėra — pažymėtam cecho plane. Etapai nustatomi cecho plane.")}</div>`;
    if (!list.length) return head + `<div class="t-caption">${L("The floor plan is not loaded on this screen yet.", "Šiame ekrane cecho planas dar neįkeltas.")}</div></div>`;
    return head + `<div class="place-list">${list.map(p => {
      var st = p.step && D.station(p.step), def = ((Store.state.placeCfg || {})[p.id] || {}).memberId;
      var here = Object.keys(this.rows).map(id => this.rows[id]).filter(d => { var ty = d.type || ""; var pl = this.placeOf(ty); return pl ? pl.item === p.id : this.planItem(ty) === p.id; }).map(d => d.name || d.type);
      return `<div class="place-row">
        <span class="place-name"><b>${esc(p.name)}</b>${here.length ? `<span class="t-caption"> · ${icon("scan", 11)} ${esc(here.join(", "))}</span>` : ""}</span>
        <span class="place-step ${st ? "" : "none"}">${st ? esc(st.name) : L("no step — set on the floor plan", "nėra etapo — nustatykite cecho plane")}</span>
        <select class="select" data-place-who="${esc(p.id)}"><option value="">${L("— by the floor plan —", "— pagal cecho planą —")}</option>${mem.map(m => `<option value="${esc(m.id)}" ${def === m.id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select>
      </div>`;
    }).join("")}</div></div>`;
  },
  /* the scanners' settings in a window of their own (from the sheet pop-up, a scan message or Settings) */
  async openSettings() {
    var L = (en, lt) => typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
    Modal.open(`<header><h2>${icon("scan", 18)} ${L("Scanners", "Skeneriai")}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body"><div class="mach-wrap wide" id="mach-pop"><div class="t-caption">${L("Loading…", "Kraunama…")}</div></div></div>
      <footer><span class="grow"></span><button class="btn primary" data-close>${L("Done", "Baigta")}</button></footer>`, m => { m.style.maxWidth = "780px"; }, { quiet: true });
    try {
      if (typeof Sync !== "undefined" && Sync.client) {
        var r = await Sync.client.from(Sync.table || "workspaces").select("id,data").like("id", this.PREFIX + "%");
        if (r && !r.error && Array.isArray(r.data)) r.data.forEach(row => { if (row && row.data) this.rows[row.id] = row.data; });
        if (typeof Cechas !== "undefined" && !Cechas.data) {
          var c = await Sync.client.from(Sync.table || "workspaces").select("data").eq("id", Cechas.ROW).limit(1);
          if (c && !c.error && c.data && c.data[0]) { Cechas.data = c.data[0].data; Cechas.at = Date.now(); }
        }
      }
    } catch (e) {}
    this.paintSettings();
  },
  paintSettings() {
    var box = document.getElementById("mach-pop");
    if (!box) return;
    box.innerHTML = this.settingsHtml();
    this.bindSettings(box);
  },
  bindSettings(root) {
    $$("[data-mach-st]", root).forEach(sel => sel.onchange = () => {
      var cfg = Store.state.machineCfg || (Store.state.machineCfg = {});
      cfg[sel.dataset.machSt] = Object.assign({}, cfg[sel.dataset.machSt] || {}, { stationId: sel.value });
      Store.save();
      Toast.show("✓", { emoji: "check" });
    });
    $$("[data-mach-who]", root).forEach(sel => sel.onchange = () => {
      var cfg = this.cfgOf(sel.dataset.machWho);
      if (sel.value) cfg.memberId = sel.value; else delete cfg.memberId;
      Store.save();
      Toast.show("✓", { emoji: "check" });
    });
    $$("[data-place-who]", root).forEach(sel => sel.onchange = () => {
      var c = this.placeCfgOf(sel.dataset.placeWho);
      if (sel.value) c.memberId = sel.value; else delete c.memberId;
      Store.save();
      Toast.show("✓", { emoji: "check" });
    });
    $$("[data-mach-home]", root).forEach(b => b.onclick = () => {
      this.setPlace(b.dataset.machHome, "off");
      Store.save();
      if (document.getElementById("mach-pop")) this.paintSettings(); else if (typeof App !== "undefined") App.render();
    });
    if (typeof NestSheets !== "undefined") NestSheets.bindSettings(root);
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
