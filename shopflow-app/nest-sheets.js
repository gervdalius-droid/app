/* ============================================================
   ShopFlow ↔ nesting layout sheets scanned at a machine
   Every sheet the Nesting app exports carries a QR + barcode
   "NS-<project>-<sheet>", e.g. NS-7K2QF9-03. The project part is a short
   hash of the nesting project's name; the sheet part is the sheet number as
   printed. The Volter helper (machine-agent/volter) sends each scan here
   through the same cloud row as the Startech ("dedes-machine-volter").

   One scan = one sheet cut:
     • the nesting project is found by its hash (table fabflow_projects),
       the sheet's parts are read from its saved layout,
     • the parts are matched to a ShopFlow project by their SWOOD codes
       (or by a link remembered from an earlier confirmation),
     • found → the cutting step starts (scan = timer) and the sheet's parts
       are counted through it, for the person at the machine,
     • not sure which project → the sheet waits for the operator to confirm
       it in a pop-up on the station screen (or in Settings → Machines);
       the choice is remembered for every later sheet of that nesting project.
   Identical sheets share one code, so a code can be scanned as many times as
   the sheet is cut (PJAUTI × 3), and no more.
   ============================================================ */
"use strict";

var NestSheets = {
  RE: /^NS-([23456789ABCDEFGHJKLMNPQRSTUVWXYZ]{6})-(\d{1,3})$/,
  TABLE: "fabflow_projects",
  names: null,          // { hash: [project name, …] }
  namesAt: 0,
  cache: {},            // project name → { at, layouts, parts }
  _q: [],
  _busy: false,
  _shown: null,         // key of the pending sheet the pop-up shows

  L(en, lt) { return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en; },
  isCode(raw) { return this.RE.test(String(raw || "").trim().toUpperCase()); },
  parse(raw) {
    var m = this.RE.exec(String(raw || "").trim().toUpperCase());
    return m ? { code: m[0], hash: m[1], sheet: +m[2] } : null;
  },
  /* the same hash the Nesting app prints (nesting/index.html → _projCode) */
  hashOf(name) {
    var s = String(name || "Untitled"), h = 0x811c9dc5;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
    var A = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ", out = "";
    for (var k = 0; k < 6; k++) { out += A[h & 31]; h = h >>> 5; if (k === 3) h ^= (s.length * 2654435761) >>> 0; }
    return out;
  },
  tbl() { return Sync.client.from(this.TABLE); },

  /* ---------- nesting projects ---------- */
  async loadNames(force) {
    if (this.names && !force && Date.now() - this.namesAt < 10 * 60000) return this.names;
    if (this.names && force && Date.now() - this.namesAt < 30000) return this.names;
    var r = await this.tbl().select("name");
    if (r.error) throw r.error;
    var map = {};
    (r.data || []).forEach(x => { if (!x || !x.name) return; var h = this.hashOf(x.name); (map[h] = map[h] || []).push(x.name); });
    this.names = map; this.namesAt = Date.now();
    return map;
  },
  async project(hash) {
    var map = await this.loadNames(false);
    if (!map[hash]) map = await this.loadNames(true); // a project saved since the last look
    var list = map[hash] || [];
    if (!list.length) return null;
    var name = list[0];
    var c = this.cache[name];
    if (!c || Date.now() - c.at > 60000) {
      var r = await this.tbl().select("name,layouts:data->layouts,parts:data->parts,codes:data->sheetCodes").eq("name", name).limit(1);
      if (r.error) throw r.error;
      var row = r.data && r.data[0];
      if (!row) return null;
      c = this.cache[name] = { at: Date.now(), name: name, layouts: Array.isArray(row.layouts) ? row.layouts : [], parts: Array.isArray(row.parts) ? row.parts : [],
        codes: row.codes && typeof row.codes === "object" ? row.codes : {} };
    }
    return c;
  },
  /* what is on sheet n: its parts' codes, material, and how many identical sheets share the code */
  sheet(proj, n, code) {
    /* what the sheet held when it was printed/exported (saved by the Nesting app with its code) —
       this survives later edits and re-nesting; projects printed before that fall back to the saved layout */
    var rec = code && proj.codes && proj.codes[code];
    if (rec && Array.isArray(rec.parts)) {
      return { n: n, mat: rec.mat || "", copies: Math.max(1, +rec.copies || 1),
        parts: rec.parts.map(x => { var c = String(x || "").split("|").filter(Boolean); return { codes: c, name: c[c.length - 1] || "" }; }) };
    }
    var lay = (proj.layouts || [])[n - 1];
    if (!lay) return null;
    var byId = {};
    (proj.parts || []).forEach(p => { if (p && p.id != null) byId[String(p.id)] = p; });
    var sig = l => (l.matName || "?") + "#" + (l.machine || "?") + "#" + l.sw + "x" + l.sh + "@@" + (l.placements || []).map(pl => {
      var p = byId[String(pl.partId)] || {};
      return [p.origName || p.name || "?", pl.pw, pl.ph, pl.x, pl.y, pl.rot ? 1 : 0].join(",");
    }).sort().join("|");
    var mine = sig(lay), copies = proj.layouts.filter(l => l && sig(l) === mine).length;
    var codes = [];
    (lay.placements || []).forEach(pl => {
      var p = byId[String(pl.partId)];
      if (!p) return;
      codes.push({ codes: [p.layoutName, p.origName, p.name].filter(Boolean).map(String), name: p.name || p.origName || "" });
    });
    return { n: n, mat: lay.matName || "", copies: Math.max(1, copies), parts: codes };
  },

  /* ---------- ShopFlow side ---------- */
  active(o) { return o && !o.archived && !o.shipped && o.type !== "eng"; },
  /* the ShopFlow part each piece on the sheet is */
  partsOf(sh) {
    var out = [];
    sh.parts.forEach(pc => {
      for (var i = 0; i < pc.codes.length; i++) {
        var o = D.findByPart(pc.codes[i]);
        if (o && this.active(o)) { out.push({ o: o, part: D.orderPart(o, pc.codes[i]), code: pc.codes[i] }); return; }
      }
      out.push({ o: null, code: pc.codes[0] || pc.name });
    });
    return out;
  },
  /* the project a sheet belongs to, and whether that is sure enough to start without asking */
  resolve(hash, proj, sh) {
    var links = Store.state.nestLinks || {};
    var linked = links[hash] && D.order(links[hash]);
    if (linked && this.active(linked)) return { o: linked, sure: true, how: "link" };
    var found = this.partsOf(sh), cnt = {};
    found.forEach(f => { if (f.o) cnt[f.o.id] = (cnt[f.o.id] || 0) + 1; });
    var ids = Object.keys(cnt).sort((a, b) => cnt[b] - cnt[a]);
    if (ids.length && cnt[ids[0]] >= Math.ceil(found.length * 0.8)) return { o: D.order(ids[0]), sure: true, how: "parts" };
    if (ids.length) return { o: D.order(ids[0]), sure: false, how: "parts" };
    var g = this.guessByName(proj.name);
    return { o: g, sure: false, how: g ? "name" : "" };
  },
  guessByName(name) {
    var tk = v => String(v || "").replace(/([a-zà-ſ])([A-Z0-9])/g, "$1 $2").replace(/([A-Za-z])(\d)/g, "$1 $2").replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter(Boolean);
    var fit = (a, b) => {
      var x = tk(a), y = tk(b); if (!x.length || !y.length) return 0;
      if (x.join("") === y.join("")) return 3;
      if (x.length === y.length && x.length >= 2 && x.every((t, i) => t.indexOf(y[i]) === 0 || y[i].indexOf(t) === 0)) return 2;
      return 0;
    };
    var best = null, lvl = 0, tie = false;
    (Store.state.orders || []).forEach(o => {
      if (!this.active(o)) return;
      var f = Math.max(fit(o.product, name), fit(o.num, name), fit(o.swood && o.swood.project, name));
      if (f > lvl) { best = o; lvl = f; tie = false; } else if (f && f === lvl) tie = true;
    });
    if (best && !tie) return best;
    return typeof Machines !== "undefined" ? Machines.matchOrder(name) : null;
  },

  /* ---------- scans from the machine helper ---------- */
  queue(job) { this._q.push(job); this.run(); },
  async run() {
    if (this._busy) return;
    this._busy = true;
    try {
      while (this._q.length) {
        var job = this._q.shift();
        try { await this.handle(job); } catch (e) { console.warn("[nest-sheets]", e); this.log(job, "error", null, String(e && e.message || e)); }
      }
    } finally { this._busy = false; }
    if (typeof App !== "undefined") App.render();
    this.prompt();
  },
  async handle(job) {
    var p = this.parse(job.code);
    var proj = await this.project(p.hash);
    var miss = st => {
      Store.state.scanLog.unshift({ ts: Date.now(), by: job.who, payload: p.code, status: st, orderId: null, stationId: job.stationId, partCode: null, machine: job.src });
      if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
      Store.save();
    };
    if (!proj) { miss("nestUnknown"); return this.log(job, "nestUnknown", null); }
    var sh = this.sheet(proj, p.sheet, p.code);
    if (!sh) { miss("sheetUnknown"); return this.log(job, "sheetUnknown", null, proj.name); }
    var r = this.resolve(p.hash, proj, sh);
    if (r.sure) return this.apply(job, p, proj, sh, r.o);
    /* ask: the operator picks the project on the station screen */
    var pend = Store.state.machinePending || (Store.state.machinePending = []);
    /* the same sheet scanned again while it waits (the operator thought nothing happened) is the same question, not a new one */
    if (!pend.some(x => x.key === job.key || x.code === p.code)) {
      pend.push({ key: job.key, code: p.code, hash: p.hash, sheet: p.sheet, nest: proj.name, mat: sh.mat, n: sh.parts.length, copies: sh.copies,
        at: job.at, guess: r.o ? r.o.id : "", st: job.stationId, w: job.who || "", src: job.src, type: job.type });
      if (pend.length > 30) pend.splice(0, pend.length - 30);
    }
    this.log(job, "confirm", r.o, proj.name);
    Store.save();
  },
  /* the sheet is cut: run the step and count its parts */
  apply(job, p, proj, sh, o) {
    var done = Store.state.sheetScans || (Store.state.sheetScans = {});
    var keys = done[p.code] || (done[p.code] = []);
    if (keys.indexOf(job.key) >= 0) return null;
    if (keys.length >= sh.copies) { this.log(job, "dup", o, proj.name); Store.save(); return "dup"; }
    keys.push(job.key);
    var codes = Object.keys(done);
    if (codes.length > 400) codes.slice(0, codes.length - 400).forEach(k => delete done[k]);

    var stationId = job.stationId;
    var who = job.who || (typeof Machines !== "undefined" ? Machines._fallbackMember(o, stationId) : null);
    var ops = o.ops.filter(x => x.stationId === stationId && x.status !== "done");
    var status = "sheet", counted = 0;
    if (!ops.length) {
      status = o.ops.some(x => x.stationId === stationId) ? "stationDone" : "notrouted";
    } else {
      /* pieces of this project on the sheet, per material line */
      var per = {}, any = false;
      this.partsOf(sh).forEach(f => {
        if (!f.o || f.o.id !== o.id) return;
        var k = f.part && f.part.itemId || "";
        (per[k] = per[k] || []).push(f.code);
        any = true;
      });
      var started = [];
      var startOp = op => {
        if (started.indexOf(op) >= 0) return;
        started.push(op);
        if (!op.assigneeId && who) op.assigneeId = who;
        M.touchScanClock(op, who);
      };
      if (any) {
        Object.keys(per).forEach(itemId => {
          var cand = ops.filter(x => !itemId || x.itemId === itemId);
          var op = cand.find(x => D.opReady(o, x)) || cand[0] || ops.find(x => D.opReady(o, x)) || ops[0];
          if (!op) return;
          startOp(op);
          var item = D.item(o, op.itemId);
          op.scanCodes = op.scanCodes || [];
          per[itemId].forEach(c => { if (op.scanCodes.indexOf(c) < 0) op.scanCodes.push(c); });
          var add = per[itemId].length, before = op.qtyDone || 0;
          var to = item ? Math.min(item.qty, before + add) : before + add;
          var now = M.reportQty(o.id, op.id, to, who, { silent: true });
          counted += Math.max(0, now - before);
        });
      } else {
        /* project without a matching report list: the step runs, nothing is counted */
        startOp(ops.find(x => D.opReady(o, x)) || ops[0]);
      }
      if (started.some(op => op.status === "done")) status = "sheetDone";
    }
    /* remember: later sheets of this nesting project go straight to this project, and the floor plan can name it */
    var links = Store.state.nestLinks || (Store.state.nestLinks = {});
    links[p.hash] = o.id;
    var mc = Store.state.machineCodes || (Store.state.machineCodes = {});
    mc[p.code] = o.id;
    var mk = Object.keys(mc);
    if (mk.length > 300) mk.slice(0, mk.length - 300).forEach(k => delete mc[k]);
    Store.state.scanLog.unshift({ ts: Date.now(), by: who, payload: p.code, status: status, orderId: o.id, stationId: stationId, partCode: null, machine: job.src });
    if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
    this.log(job, status, o, proj.name, counted ? counted + " " + this.L("pcs", "vnt.") : "", who);
    Store.save();
    return status;
  },
  log(job, status, o, nest, extra, who) {
    var line = { at: job.at || Date.now(), code: job.code, status: status, order: o ? o.num + " · " + o.product : "", nest: nest || "", extra: extra || "" };
    if (typeof Machines !== "undefined") {
      Machines.recent.unshift({ at: line.at, code: job.code, status: status, order: line.order + (nest ? " ← " + nest : "") + (extra ? " · " + extra : "") });
      if (Machines.recent.length > 12) Machines.recent.length = 12;
    }
    /* the station screen says what happened to every sheet, also when nothing changed */
    try {
      if (this.mine(job.type) && status !== "confirm" && typeof Toast !== "undefined" && Date.now() - (+job.at || 0) < 10 * 60000) {
        var L = this.L.bind(this);
        var said = { sheet: L("cutting step running", "pjovimo etapas vyksta"), sheetDone: L("cutting step finished", "pjovimo etapas baigtas"),
          stationDone: L("cutting was already finished for this project — nothing changed", "šio projekto pjovimas jau baigtas — niekas nepakeista"),
          notrouted: L("this project has no cutting step", "šis projektas neturi pjovimo etapo"), dup: L("this sheet was already counted", "ši plokštė jau įskaityta"),
          nestUnknown: L("no nesting project has this code", "joks Nesting projektas neturi šio kodo"), sheetUnknown: L("the nesting project has no such sheet", "Nesting projekte tokios plokštės nėra"),
          error: L("could not read the nesting project", "nepavyko nuskaityti Nesting projekto") }[status] || status;
        var good = status === "sheet" || status === "sheetDone";
        Toast.show((job.src || "CNC") + " · " + job.code + (line.order ? " → " + line.order : "") + (extra ? " · " + extra : "") + " — " + said, { emoji: good ? "check" : "alert", ms: 9000 });
      }
    } catch (e) {}
    if (typeof ScanLog !== "undefined" && status !== "dup") {
      try { ScanLog.add({ k: job.key, ts: job.at || Date.now(), src: job.src, code: job.code, st: job.stationId, o: o ? o.id : "", w: who || job.who || "", r: status, q: extra || "" }); } catch (e) {}
    }
  },

  /* ---------- the confirmation pop-up ---------- */
  /* a screen shows it when it is a station screen (opened with ?station=volter once — remembered),
     or when "show confirmations here" is ticked in Settings → Machines */
  STATION_KEY: "shopflow.station",
  /* who gets a scanner's questions and messages: the person the scanner belongs to
     (Settings → Machines → Who scans), on whatever screen they are signed in; a scanner with
     no person set falls back to its station screen (?station=volter) */
  ownerOf(type) { var c = (Store.state.machineCfg || {})[type]; return c && c.memberId && D.member(c.memberId) ? c.memberId : null; },
  mine(type) {
    if (typeof App === "undefined" || !App.me) return false;
    var owner = this.ownerOf(type);
    if (owner) return App.me.id === owner;
    var here = this.stationHere();
    return !!here && (here === "all" || here === type);
  },
  stationHere() {
    try {
      var q = new URLSearchParams(location.search).get("station");
      if (q) localStorage.setItem(this.STATION_KEY, q === "off" ? "" : q.toLowerCase());
      return localStorage.getItem(this.STATION_KEY) || "";
    } catch (e) { return ""; }
  },
  setStationHere(v) { try { localStorage.setItem(this.STATION_KEY, v || ""); } catch (e) {} },
  pending() {
    var now = Date.now();
    return (Store.state.machinePending || []).filter(x => x && now - (+x.at || 0) < 12 * 36e5);
  },
  prompt() {
    if (typeof Modal === "undefined" || typeof App === "undefined" || !App.me) return;
    try { this.tidy(); } catch (e) {}
    var list = this.pending().filter(x => this.mine(x.type));
    if (!list.length) {
      if (this._shown && document.getElementById("nest-pop")) Modal.close();
      this._shown = null;
      return;
    }
    var root = document.getElementById("modal-root");
    if (this._shown && document.getElementById("nest-pop")) return;     // already asking
    if (root && root.innerHTML.trim()) return;                           // someone is busy in another dialog
    this.open(list[0].key);
  },
  _norm(v) { return String(v || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim(); },
  /* production steps a project made here gets: every production step except installation (changeable in the form) */
  defaultRoute() {
    return (Store.state.stations || []).filter(st => st && st.kind !== "eng" && !/^eg-/.test(st.id));
  },
  open(key) {
    var x = this.pending().find(p => p.key === key);
    if (!x) return;
    var L = this.L.bind(this);
    var orders = (Store.state.orders || []).filter(o => this.active(o))
      .sort((a, b) => (a.id === x.guess ? -1 : b.id === x.guess ? 1 : String(b.num).localeCompare(String(a.num), "lt", { numeric: true })));
    var label = o => o.num + " · " + (o.product || "") + (o.client ? " — " + o.client : "");
    var steps = this.defaultRoute();
    var more = this.pending().length - 1;
    this._shown = key;
    Modal.open(`<div id="nest-pop"></div>
      <header><h2>${icon("scan", 18)} ${esc(x.src || "CNC")}: ${esc(L("which project is this sheet?", "kuriam projektui ši plokštė?"))}</h2><button class="icon-btn" data-nest-cfg title="${esc(L("Scanner settings", "Skenerio nustatymai"))}">${icon("sliders", 16)}</button><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body" style="display:flex;flex-direction:column;gap:12px">
        <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:14px">
          <span class="t-caption">${esc(L("Code", "Kodas"))}</span><code>${esc(x.code)}</code>
          <span class="t-caption">${esc(L("Nesting project", "Nesting projektas"))}</span><b>${esc(x.nest)}</b>
          <span class="t-caption">${esc(L("Sheet", "Plokštė"))}</span><span>${esc(String(x.sheet))}${x.mat ? " · " + esc(x.mat) : ""} · ${esc(String(x.n))} ${esc(L("parts", "detalės"))}${x.copies > 1 ? " · ×" + esc(String(x.copies)) : ""}</span>
          <span class="t-caption">${esc(L("Scanned", "Nuskenuota"))}</span><span>${new Date(+x.at || Date.now()).toLocaleTimeString("lt-LT", { hour: "2-digit", minute: "2-digit" })}</span>
        </div>
        <div id="nest-pick" style="display:flex;flex-direction:column;gap:6px">
          <span class="t-caption">${esc(L("Project in ShopFlow", "Projektas ShopFlow"))}</span>
          <input class="input" id="nest-q" type="search" autocomplete="off" placeholder="${esc(L("Type to search: number, name or client…", "Rašykite paieškai: numeris, pavadinimas ar klientas…"))}">
          <select class="select" id="nest-ord" size="7" style="height:auto;min-height:12em">${orders.map(o => `<option value="${esc(o.id)}" ${o.id === x.guess ? "selected" : ""}>${esc(label(o))}</option>`).join("")}</select>
          <div class="t-caption" id="nest-none" style="display:none">${esc(L("No project matches.", "Tokio projekto nėra."))}</div>
          <button type="button" class="btn" id="nest-new-btn" style="align-self:flex-start">${icon("plus", 14)} ${esc(L("New project", "Naujas projektas"))}</button>
        </div>
        <div id="nest-new" style="display:none;flex-direction:column;gap:8px;border:1px solid var(--border);border-radius:var(--r-md);padding:10px 12px">
          <b>${esc(L("New project in ShopFlow", "Naujas projektas ShopFlow"))}</b>
          <label class="field"><span class="t-caption">${esc(L("Project name", "Projekto pavadinimas"))}</span><input class="input" id="nest-new-name" value="${esc(x.nest)}"></label>
          <label class="field"><span class="t-caption">${esc(L("Client", "Klientas"))}</span><input class="input" id="nest-new-client" placeholder="${esc(L("e.g. DB", "pvz. DB"))}" value="DB"></label>
          <span class="t-caption">${esc(L("Steps", "Etapai"))}</span>
          <div style="display:flex;flex-wrap:wrap;gap:6px">${steps.map(st => `<label class="chip" style="display:inline-flex;gap:5px;align-items:center;padding:4px 10px;border:1px solid var(--border);border-radius:999px;cursor:pointer"><input type="checkbox" data-nest-st="${esc(st.id)}" ${/montav|install/i.test(st.name) ? "" : "checked"}> ${esc(st.name)}</label>`).join("")}</div>
          <div style="display:flex;gap:8px"><button type="button" class="btn" id="nest-new-cancel">${esc(L("Back to the list", "Atgal į sąrašą"))}</button><span class="grow"></span>
            <button type="button" class="btn primary" id="nest-new-ok">${icon("play", 14)} ${esc(L("Create and start", "Sukurti ir pradėti"))}</button></div>
        </div>
        <p class="t-caption" style="margin:0">${esc(L("Start runs the cutting step and counts this sheet's parts. Later sheets of this nesting project go to the same project without asking.", "„Pradėti“ paleidžia pjovimo etapą ir įskaito šios plokštės detales. Kitos šio Nesting projekto plokštės bus priskirtos tam pačiam projektui be klausimo."))}</p>
        ${more > 0 ? `<p class="t-caption" style="margin:0">${esc(L("More sheets waiting: ", "Dar laukia plokščių: "))}${more}</p>` : ""}
      </div>
      <footer><button class="btn" data-nest-skip>${esc(L("Not cut / ignore", "Nepjauta / atmesti"))}</button><span class="grow"></span>
        <button class="btn" data-close>${esc(L("Later", "Vėliau"))}</button>
        <button class="btn primary" data-nest-ok>${icon("play", 14)} ${esc(L("Start", "Pradėti"))}</button></footer>`,
    modal => {
      var q = modal.querySelector("#nest-q"), sel = modal.querySelector("#nest-ord"), none = modal.querySelector("#nest-none");
      var ok = modal.querySelector("[data-nest-ok]");
      var sync = () => { ok.disabled = !sel.value || modal.querySelector("#nest-new").style.display !== "none"; };
      var fill = () => {
        var words = this._norm(q.value).split(" ").filter(Boolean), keep = sel.value;
        var hit = orders.filter(o => { var h = this._norm(label(o)); return words.every(w => h.indexOf(w) >= 0); });
        sel.innerHTML = hit.map(o => `<option value="${esc(o.id)}">${esc(label(o))}</option>`).join("");
        if (hit.some(o => o.id === keep)) sel.value = keep; else if (hit.length) sel.value = hit[0].id;
        none.style.display = hit.length ? "none" : "";
        sel.style.display = hit.length ? "" : "none";
        sync();
      };
      q.oninput = fill;
      q.onkeydown = e => {
        if (e.key === "ArrowDown") { e.preventDefault(); sel.focus(); }
        else if (e.key === "Enter") { e.preventDefault(); if (sel.value) this.confirm(key, sel.value); }
      };
      sel.onchange = sync;
      sel.ondblclick = () => { if (sel.value) this.confirm(key, sel.value); };
      sel.onkeydown = e => { if (e.key === "Enter" && sel.value) { e.preventDefault(); this.confirm(key, sel.value); } };
      ok.onclick = () => { if (sel.value) this.confirm(key, sel.value); };
      var pick = modal.querySelector("#nest-pick"), form = modal.querySelector("#nest-new");
      var showNew = on => { form.style.display = on ? "flex" : "none"; pick.style.display = on ? "none" : "flex"; sync(); if (on) { var n = modal.querySelector("#nest-new-name"); n.focus(); n.select(); } else q.focus(); };
      modal.querySelector("#nest-new-btn").onclick = () => {
        var typed = q.value.trim();
        if (typed && this._norm(x.nest).indexOf(this._norm(typed)) < 0 && !orders.some(o => this._norm(label(o)).indexOf(this._norm(typed)) >= 0)) modal.querySelector("#nest-new-name").value = typed;
        showNew(true);
      };
      modal.querySelector("#nest-new-cancel").onclick = () => showNew(false);
      modal.querySelector("#nest-new-ok").onclick = () => {
        var name = modal.querySelector("#nest-new-name").value.trim(), client = modal.querySelector("#nest-new-client").value.trim() || "DB";
        var route = [...modal.querySelectorAll("[data-nest-st]")].filter(c => c.checked).map(c => { var st = D.station(c.getAttribute("data-nest-st")); return { stationId: st.id, estMins: st.estMins || 60 }; });
        if (!name) { modal.querySelector("#nest-new-name").focus(); return; }
        if (!route.length) { Toast.show(L("Tick at least one step", "Pažymėkite bent vieną etapą"), { emoji: "alert" }); return; }
        var o = this.createProject(name, client, route, x);
        if (o) this.confirm(key, o.id);
      };
      modal.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", () => { this._later = this._later || {}; this._later[key] = Date.now(); }));
      modal.querySelector("[data-nest-skip]").onclick = () => { this.drop(key); };
      modal.querySelector("[data-nest-cfg]").onclick = () => { this._later[key] = Date.now(); this._shown = null; Modal.close(true); setTimeout(() => Machines.openSettings(), 60); };
      sync();
      setTimeout(() => q.focus(), 80);
    }, { quiet: false });
  },
  /* a quick production project from the station, named after the nesting project; the office can fill in the rest */
  createProject(name, client, route, x) {
    try {
      var by = App.me ? App.me.id : null;
      var o = M.createOrder({ type: "prod", product: name, client: client, qty: 1, unit: "vnt.", priority: "normal",
        due: Date.now() + 14 * 864e5, notes: this.L("Created at the " + (x.src || "CNC") + " station from nesting project ", "Sukurta " + (x.src || "CNC") + " stotyje iš Nesting projekto ") + x.nest, route: route }, by);
      if (typeof Bridge !== "undefined") { try { var cid = Bridge.resolveClient(client); if (cid) o.customerId = cid; } catch (e) {} }
      Store.save();
      Toast.show(o.num + " · " + name + " " + this.L("created", "sukurtas"), { emoji: "check" });
      return o;
    } catch (e) {
      Toast.show(String(e && e.message || e), { emoji: "alert" });
      return null;
    }
  },
  async confirm(key, orderId) {
    var x = this.pending().find(p => p.key === key), o = D.order(orderId);
    if (!x || !o) return;
    try {
      var proj = await this.project(x.hash), sh = proj && this.sheet(proj, x.sheet, x.code);
      if (!sh) throw new Error(this.L("The nesting sheet is gone", "Nesting plokštė nerasta"));
      var job = { key: x.key, code: x.code, at: x.at, stationId: x.st, who: x.w, src: x.src, type: x.type };
      var st = this.apply(job, this.parse(x.code), proj, sh, o);
      this.settle(x);
      Store.save();
      Modal.close(true);
      this._shown = null;
      Toast.show(st === "dup" ? this.L("This sheet was already counted", "Ši plokštė jau įskaityta") : "✓ " + o.num + " · " + o.product, { emoji: st === "dup" ? "alert" : "check" });
      if (typeof App !== "undefined") App.render();
      setTimeout(() => this.prompt(), 400);
    } catch (e) {
      Toast.show(String(e && e.message || e), { emoji: "alert" });
    }
  },
  drop(key) {
    var x = this.pending().find(p => p.key === key);
    if (x) (Store.state.machinePending || []).filter(p => p.code === x.code).forEach(p => this.remove(p.key));
    this.remove(key);
    Store.save();
    Modal.close(true);
    this._shown = null;
    if (typeof App !== "undefined") App.render();
    setTimeout(() => this.prompt(), 400);
  },
  /* after a sheet is confirmed: the same sheet waiting again is answered, and other sheets of that
     nesting project now go to the chosen project by themselves */
  settle(x) {
    var pend = Store.state.machinePending || [];
    pend.filter(p => p.code === x.code).forEach(p => this.remove(p.key));
    pend.filter(p => p.hash === x.hash).slice().forEach(p => {
      this.remove(p.key);
      this.queue({ key: p.key, code: p.code, at: p.at, stationId: p.st, who: p.w, src: p.src, type: p.type });
    });
  },
  /* a waiting sheet that has meanwhile been counted (another screen, a repeat scan) is no longer a question */
  tidy() {
    var pend = Store.state.machinePending || [], done = Store.state.sheetScans || {}, links = Store.state.nestLinks || {}, gone = false;
    pend.slice().forEach(p => {
      var counted = (done[p.code] || []).length >= (+p.copies || 1);
      if (counted || (links[p.hash] && D.order(links[p.hash]))) {
        this.remove(p.key); gone = true;
        if (!counted) this.queue({ key: p.key, code: p.code, at: p.at, stationId: p.st, who: p.w, src: p.src, type: p.type });
      }
    });
    if (gone) Store.save();
    return gone;
  },
  remove(key) {
    var pend = Store.state.machinePending || [];
    var i = pend.findIndex(p => p.key === key);
    if (i >= 0) pend.splice(i, 1);
  },
  /* the "Later" button: ask again after a few minutes, not on every poll */
  _later: {},
  tick() {
    if (typeof App === "undefined" || !App.me) return;
    try { this.tidy(); } catch (e) {}
    var list = this.pending().filter(x => this.mine(x.type) && !(this._later[x.key] && Date.now() - this._later[x.key] < 3 * 60000));
    if (!list.length) return;
    if (document.getElementById("nest-pop")) return;
    var root = document.getElementById("modal-root");
    if (root && root.innerHTML.trim()) return;
    this.open(list[0].key);
  },

  /* ---------- Settings → Machines ---------- */
  settingsHtml() {
    var L = this.L.bind(this), here = this.stationHere(), list = this.pending();
    var types = {};
    Object.keys((typeof Machines !== "undefined" && Machines.rows) || {}).forEach(id => { var d = Machines.rows[id]; types[d.type || id.slice(Machines.PREFIX.length)] = d.name || d.type; });
    if (!types.volter) types.volter = "Volter CNC";
    var h = `<div class="mach-card"><div class="mach-head"><b>${esc(L("Nesting sheets (QR on the layout sheet)", "Nesting plokštės (QR ant išdėstymo lapo)"))}</b><span class="grow"></span>
      <label class="t-caption">${esc(L("Scanners with no person set ask on this screen for", "Skeneriai be priskirto žmogaus klausia šiame ekrane dėl"))}</label>
      <select class="select" data-nest-here><option value="">${esc(L("— nothing —", "— nieko —"))}</option>${Object.keys(types).map(t => `<option value="${esc(t)}" ${here === t ? "selected" : ""}>${esc(types[t])}</option>`).join("")}<option value="all" ${here === "all" ? "selected" : ""}>${esc(L("all machines", "visų staklių"))}</option></select></div>`;
    if (!list.length) h += `<div class="t-caption">${esc(L("No sheets waiting for a project.", "Jokia plokštė nelaukia projekto."))}</div>`;
    else h += `<div class="mach-list">${list.map(x => `<div class="mach-row bad"><span class="t-num">${new Date(+x.at).toLocaleTimeString("lt-LT", { hour: "2-digit", minute: "2-digit" })}</span><code>${esc(x.code)}</code><span>${esc(x.nest)} · ${esc(L("sheet", "plokštė"))} ${esc(String(x.sheet))}</span><span class="grow"></span><button class="btn" data-nest-open="${esc(x.key)}">${esc(L("Choose project", "Pasirinkti projektą"))}</button></div>`).join("")}</div>`;
    return h + "</div>";
  },
  bindSettings(root) {
    var s = root.querySelector("[data-nest-here]");
    if (s) s.onchange = () => { this.setStationHere(s.value); Toast.show("✓", { emoji: "check" }); };
    root.querySelectorAll("[data-nest-open]").forEach(b => b.onclick = () => { Modal.close(true); setTimeout(() => this.open(b.getAttribute("data-nest-open")), 120); });
  }
};
if (typeof window !== "undefined") {
  try { NestSheets.stationHere(); } catch (e) {} // remember ?station=volter before any sign-in redirect drops it
  window.addEventListener("load", () => setTimeout(() => {
    try { NestSheets.stationHere(); } catch (e) {}
    setInterval(() => { try { if (typeof Machines !== "undefined" && Machines.ready()) NestSheets.tick(); } catch (e) {} }, 5000);
  }, 6000));
}
