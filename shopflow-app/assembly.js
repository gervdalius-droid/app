/* ============================================================
   ShopFlow — the assembly station (Surinkimas)

   On the scan station at the assembly bench (a tablet, ?scan=<station>), a
   scanned panel label does not count a piece — assembly counts cabinets.
   Instead it:
     1. finds the panel's cabinet (module) and the project's drawings,
     2. opens the drawing full screen: the cabinet's own drawing if there is
        one, else the page of the project drawing that names the cabinet,
        else the project drawing itself,
     3. starts the project's assembly step for the person signed in — unless
        another step of this project is running right now (then it asks).
   "Spintelė surinkta" ticks the cabinet, which moves the assembly count.
   Scanning the next panel opens the next cabinet.

   Drawings are the files on the project; a production order that came from
   an engineering project also gets that project's files (that is where the
   drawings usually are). PDFs are drawn with pdf.js (Android Chrome cannot
   show a PDF inside the page), loaded only when first needed.

   Plain Promises, no ?. or async — this runs on the older shop tablets too.
   ============================================================ */
"use strict";

var Assembly = {
  PDFJS: "../hub/shared/vendor/pdfjs/pdf.min.js",
  PDFJS_WORKER: "../hub/shared/vendor/pdfjs/pdf.worker.min.js",
  cur: null,          // {orderId, moduleId, key, partCode, start, fileId, page, zoom}
  _docs: {},          // fileId → Promise<pdf document>
  _texts: {},         // fileId → Promise<[page text…]>
  _camWas: false,

  L(en, lt) { return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en; },
  isOpen() { return !!document.getElementById("asm-sheet"); },

  /* ---------- which station, which step ---------- */
  isAssemblyStation(o, stationId) {
    var op = D.assemblyOp(o);
    if (op) return op.stationId === stationId;
    var st = D.station(stationId);
    return !!(st && /surink|assembl/i.test(st.name) && o.ops.some(x => x.stationId === stationId));
  },
  stepOf(o, stationId) {
    var a = D.assemblyOp(o);
    if (a) return a;
    return o.ops.find(x => x.stationId === stationId && x.status !== "done") || o.ops.find(x => x.stationId === stationId) || null;
  },

  /* ---------- the cabinet a panel belongs to ---------- */
  keyOf(o, part) { return part ? D.cabinetOf(part, part.proj || (o.swood && o.swood.project)) : ""; },
  moduleOf(o, key) {
    if (!key) return null;
    var mods = D.orderModules(o);
    return mods.find(m => (m.key || m.name) === key) || mods.find(m => m.name === key) || null;
  },
  partsOf(o, key) {
    if (!key) return [];
    return (o.parts || []).filter(p => p.solid ? this.keyOf(o, p) === key : p.name === key);
  },
  label(m) { return m ? (m.num ? m.num + " · " : "") + m.name : ""; },
  /* the cabinet builder's sheet of this cabinet (its parts are the cabinet's parts) */
  sheetFor(o, key) {
    var mine = {}, n = 0;
    this.partsOf(o, key).forEach(p => { if (p.solid) { mine[String(p.solid).toUpperCase()] = 1; n++; } });
    if (!n) return null;
    return D.files().find(f => f.orderId === o.id && f.drw && f.drw.cab != null && !f.drw.cont && (f.drw.parts || []).some(x => mine[String(x).toUpperCase()])) || null;
  },
  /* what the people at the bench call the cabinet: the builder's "2 „Kriauklė“", else SP-3 · name */
  title(o, m, key) {
    var f = this.sheetFor(o, key || (m && (m.key || m.name)));
    if (f) return this._base(f.name).replace(/^(Spintelė|Cabinet)\s+/i, "");
    return m ? this.label(m) : key || "";
  },

  /* ---------- start the assembly step ---------- */
  start(o, stationId, force) {
    var op = this.stepOf(o, stationId);
    var me = App.me && App.me.id;
    if (!op) return { state: "none" };
    if (op.status === "done") return { state: "done", op: op };
    if (op.status === "running") return { state: "running", op: op, who: D.opAssignees(op).map(m => m.name) };
    var others = o.ops.filter(x => x !== op && x.status === "running");
    if (others.length && !force) return { state: "elsewhere", op: op, others: others };
    M.startOp(o.id, op.id, me);
    return { state: "started", op: op };
  },

  /* ---------- a scan at the station: true = handled here ---------- */
  onScan(payload, stationId) {
    var parsed = D.scanParse(payload);
    if (!parsed || !parsed.order || parsed.unknownPart) return false;
    var o = parsed.order;
    if (!this.isAssemblyStation(o, stationId)) return false;
    var part = parsed.part || D.orderPart(o, parsed.partCode);
    var key = this.keyOf(o, part);
    // the same label read again (a camera keeps seeing it): nothing new
    if (this.isOpen() && this.cur && this.cur.orderId === o.id && this.cur.partCode === parsed.partCode) return true;
    var res = this.start(o, stationId, false);
    Store.state.scanLog = Store.state.scanLog || [];
    Store.state.scanLog.unshift({ ts: Date.now(), by: App.me && App.me.id, payload: String(payload).slice(0, 60), status: "opened",
      orderId: o.id, stationId: stationId, partCode: parsed.partCode || null });
    if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
    Store.save();
    if (typeof ScanStation !== "undefined") ScanStation.beep(res.state === "elsewhere" ? "warn" : "ok");
    this.open(o.id, { key: key, partCode: parsed.partCode || "", start: res, stationId: stationId });
    return true;
  },

  /* ---------- the project's drawings, best first ---------- */
  related(o) {
    var out = [{ o: o, src: "own" }], seen = {};
    seen[o.id] = 1;
    var add = (x, src) => { if (x && !seen[x.id]) { seen[x.id] = 1; out.push({ o: x, src: src }); } };
    if (o.fromEngId) add(D.order(o.fromEngId), "eng");
    if (o.engLink && o.engLink.engId) add(D.order(o.engLink.engId), "eng");
    (Store.state.orders || []).forEach(x => { if (x.handedOffTo === o.id) add(x, "eng"); });
    if (typeof D.engMatchesFor === "function") { try { (D.engMatchesFor(o, { min: 0.55 }) || []).slice(0, 2).forEach(m => add(m.eng, "eng")); } catch (e) {} }
    (Store.state.orders || []).forEach(x => { if (!x.archived && D._clientScore && D._clientScore(o, x) >= 0.85) add(x, "client"); });
    return out;
  },
  _base(n) { return String(n || "").replace(/\.[a-z0-9]{2,5}$/i, ""); },
  _norm(s) { return String(s || "").toUpperCase().replace(/[^A-Z0-9ĄČĘĖĮŠŲŪŽ]+/g, ""); },
  _toks(s) { return String(s || "").toUpperCase().split(/[^A-Z0-9ĄČĘĖĮŠŲŪŽ]+/).filter(t => t.length >= 3 && !/^(GAMYBA|BREZINIAI|PDF|DWG|PROJEKTAS)$/.test(t)); },
  drawings(o, key, m) {
    var self = this, list = [];
    var want = this._toks([o.product, o.num, o.swood && o.swood.project].join(" "));
    var client = this._toks(o.client);
    var nk = this._norm(key), nn = this._norm(m && m.name);
    var mine = {};                                                         // this cabinet's parts (their SolidWorks / builder names)
    this.partsOf(o, key).forEach(p => { if (p.solid) mine[String(p.solid).toUpperCase()] = 1; });
    var mineN = Object.keys(mine).length;
    this.related(o).forEach(r => {
      D.files().filter(f => f.orderId === r.o.id && f.kind !== "email" && /pdf|image/i.test(f.type || "") ).forEach(f => {
        var b = self._norm(self._base(f.name));
        var s = { own: 100, eng: 80, client: 0 }[r.src];
        if (f.drw) {                                                       // a sheet from the cabinet builder's own drawings
          var hit = mineN && (f.drw.parts || []).some(n => mine[String(n).toUpperCase()]);
          s += hit ? (f.drw.cont ? 1190 : 1200) : f.drw.cab == null ? 160 : 60;
          list.push({ f: f, score: s, cab: !!hit, src: r.src, from: r.o, drw: true });
          return;
        }
        var cab = !!(nk && (b === nk || (nn && b === nn)));
        if (cab) s += 1000;
        else if (nk && b.length > 6 && nk.indexOf(b) >= 0) s += 300;
        var overlap = self._toks(f.name).filter(t => want.indexOf(t) >= 0 && client.indexOf(t) < 0).length;
        s += overlap * 30;
        if (r.src === "client" && !overlap && !cab) return;          // another job of the same client
        if (/GAMYB|BR[EĖ][ZŽ]|DRAW/i.test(f.name)) s += 40;
        if (/ESKIZ|SKETCH/i.test(f.name)) s += 5;
        if (/pdf/i.test(f.type)) s += 5;
        list.push({ f: f, score: s, cab: cab, src: r.src, from: r.o });
      });
    });
    list.sort((a, b) => b.score - a.score || (a.drw && b.drw ? (a.f.drw.cab == null ? -1 : a.f.drw.cab) - (b.f.drw.cab == null ? -1 : b.f.drw.cab) : b.f.at - a.f.at));
    return list;
  },

  /* ---------- pdf.js ---------- */
  _lib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (this._libP) return this._libP;
    var self = this;
    this._libP = new Promise((resolve, reject) => {
      var s = document.createElement("script");
      s.src = self.PDFJS; s.async = true;
      s.onload = () => {
        if (!window.pdfjsLib) return reject(new Error("pdf.js"));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = self.PDFJS_WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = () => { self._libP = null; reject(new Error(self.L("Could not load the PDF viewer — check the internet connection", "Nepavyko įkelti PDF peržiūros — patikrinkite internetą"))); };
      document.head.appendChild(s);
    });
    return this._libP;
  },
  doc(fileId) {
    if (this._docs[fileId]) return this._docs[fileId];
    var self = this;
    var p = Promise.all([this._lib(), Files.url(fileId)]).then(r => {
      if (!r[1]) throw new Error(self.L("The file is not in the cloud yet", "Failas dar neįkeltas į debesį"));
      return fetch(r[1]).then(x => x.arrayBuffer()).then(buf => r[0].getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise);
    });
    p.catch(() => { delete self._docs[fileId]; });
    this._docs[fileId] = p;
    return p;
  },
  texts(fileId) {
    if (this._texts[fileId]) return this._texts[fileId];
    var p = this.doc(fileId).then(doc => {
      var out = [], i = 1;
      var next = () => {
        if (i > doc.numPages) return out;
        return doc.getPage(i).then(pg => pg.getTextContent()).then(tc => {
          out.push(tc.items.map(t => t.str).join(" "));
          i++;
          return next();
        });
      };
      return next();
    });
    this._texts[fileId] = p;
    return p;
  },
  /* the page that names this cabinet: its SolidWorks name, else its drawing number (SP-3, not SP-30) */
  findPage(fileId, key, m) {
    var self = this;
    return this.texts(fileId).then(pages => {
      var nk = self._norm(key), nn = self._norm(m && m.name);
      var num = m && m.num ? new RegExp("(^|[^A-Z0-9])" + String(m.num).replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "($|[^0-9])", "i") : null;
      for (var i = 0; i < pages.length; i++) if (nk && self._norm(pages[i]).indexOf(nk) >= 0) return i + 1;
      if (nn && nn !== nk && nn.length >= 6) for (var j = 0; j < pages.length; j++) if (self._norm(pages[j]).indexOf(nn) >= 0) return j + 1;
      if (num) for (var k = 0; k < pages.length; k++) if (num.test(pages[k])) return k + 1;
      return 0;
    }).catch(() => 0);
  },

  /* ---------- the sheet ---------- */
  open(orderId, opts) {
    var o = D.order(orderId);
    if (!o) return;
    var m = this.moduleOf(o, opts.key);
    var draws = this.drawings(o, opts.key, m);
    this.cur = { orderId: o.id, key: opts.key || "", moduleId: m ? m.id : null, partCode: opts.partCode || "", start: opts.start || null,
      stationId: opts.stationId || (typeof ScanStation !== "undefined" ? ScanStation.stationId : null),
      fileId: draws[0] ? draws[0].f.id : null, page: 1, pages: 0, zoom: 1, found: draws[0] ? draws[0].cab : false };
    if (typeof ScanStation !== "undefined" && ScanStation.camera) { this._camWas = true; ScanStation.stopCamera(); }
    this.render();
    this.showFile(true);
  },
  close() {
    var el = document.getElementById("asm-sheet");
    if (el) el.parentNode.removeChild(el);
    this.cur = null;
    if (this._camWas && typeof ScanStation !== "undefined" && ScanStation.isActive()) { this._camWas = false; ScanStation.startCamera(); }
    var cap = document.getElementById("scan-capture"); if (cap) cap.focus();
  },
  startLine(o) {
    var r = this.cur.start, L = this.L.bind(this);
    if (!r) return "";
    var stName = r.op ? (D.station(r.op.stationId) || {}).name : "";
    if (r.state === "started") return `<span class="asm-pill ok">${icon("play", 14)} ${L("Started", "Pradėta")}: ${esc(stName)}</span>`;
    if (r.state === "running") return `<span class="asm-pill ok">${icon("play", 14)} ${esc(stName)} ${L("in progress", "vyksta")}${r.who && r.who.length ? " · " + esc(r.who.join(", ")) : ""}</span>`;
    if (r.state === "done") return `<span class="asm-pill info">${icon("check-circle", 14)} ${esc(stName)} ${L("already finished", "jau baigtas")}</span>`;
    if (r.state === "elsewhere") {
      var where = r.others.map(x => (D.station(x.stationId) || {}).name + (D.opAssignees(x).length ? " (" + D.opAssignees(x).map(p => p.name).join(", ") + ")" : "")).join(", ");
      return `<span class="asm-pill warn">${icon("alert", 14)} ${L("Still being worked on", "Dar dirbama")}: ${esc(where)}</span>
        <button class="btn" id="asm-force">${icon("play", 14)} ${L("Start assembly anyway", "Pradėti surinkimą vis tiek")}</button>`;
    }
    return "";
  },
  render() {
    var c = this.cur, o = c && D.order(c.orderId);
    if (!o) return;
    var L = this.L.bind(this);
    var m = c.moduleId ? D.module(o, c.moduleId) : null;
    var parts = this.partsOf(o, c.key);
    var mods = D.sortModules(D.orderModules(o));
    var draws = this.drawings(o, c.key, m);
    var done = D.modulesDone(o), total = D.modulesTotal(o);
    var host = document.getElementById("asm-sheet");
    if (!host) { host = document.createElement("div"); host.id = "asm-sheet"; host.className = "asm-sheet"; host.setAttribute("role", "dialog"); host.setAttribute("aria-modal", "true"); document.body.appendChild(host); this._css(); }
    var mDone = m && (m.done || 0) >= (m.qty || 1);
    host.innerHTML = `
      <div class="asm-top">
        <button class="icon-btn" id="asm-close" aria-label="${L("Close", "Uždaryti")}">${icon("x", 20)}</button>
        <div class="asm-title"><b>${esc(o.num)}</b><span>${esc([o.client, o.product].filter(Boolean).join(" · "))}</span></div>
        <div class="asm-start">${this.startLine(o)}</div>
        ${total ? `<div class="asm-count"><b class="t-num">${done}/${total}</b><span>${L("cabinets assembled", "spintelių surinkta")}</span></div>` : ""}
      </div>
      <div class="asm-body">
        <div class="asm-draw">
          <div class="asm-files" role="tablist" aria-label="${L("Drawings", "Brėžiniai")}">
            ${draws.length ? draws.slice(0, 8).map(d => `<button role="tab" class="asm-file ${d.f.id === c.fileId ? "on" : ""}" data-file="${d.f.id}" aria-selected="${d.f.id === c.fileId}" title="${esc(d.f.name)}${d.src !== "own" ? " · " + esc(d.from.num) : ""}">${icon(/pdf/i.test(d.f.type) ? "ruler" : "eye", 13)} ${esc(this._base(d.f.name))}${d.cab ? ` <i>${L("cabinet", "spintelė")}</i>` : ""}</button>`).join("") : ""}
          </div>
          <div class="asm-canvas" id="asm-canvas">${draws.length ? `<div class="sync-spinner"></div>` : `<div class="asm-empty">${icon("ruler", 40, "", 1.4)}<b>${L("No drawing on this project yet", "Šiame projekte dar nėra brėžinio")}</b><span>${L("Add the PDF to the project in ShopFlow (or to its engineering project) and it opens here.", "Pridėkite PDF prie projekto ShopFlow'e (arba prie jo projektavimo projekto) — jis atsidarys čia.")}</span></div>`}</div>
          <div class="asm-tools" id="asm-tools" hidden>
            <button class="icon-btn" id="asm-prev" aria-label="${L("Previous page", "Ankstesnis lapas")}">${icon("chev-left", 18)}</button>
            <span id="asm-pg" class="t-num"></span>
            <button class="icon-btn" id="asm-next" aria-label="${L("Next page", "Kitas lapas")}">${icon("chev-right", 18)}</button>
            <span class="grow"></span>
            <span id="asm-hint" class="t-caption"></span>
            <button class="icon-btn" id="asm-zout" aria-label="${L("Zoom out", "Mažinti")}">−</button>
            <button class="btn ghost" id="asm-zfit">${L("Fit", "Visas")}</button>
            <button class="icon-btn" id="asm-zin" aria-label="${L("Zoom in", "Didinti")}">+</button>
          </div>
        </div>
        <aside class="asm-side">
          <div class="asm-cab">
            <span class="t-caption">${m ? L("Cabinet", "Spintelė") : c.key ? L("Part of", "Detalė iš") : L("Project", "Projektas")}</span>
            <b class="asm-cab-name">${esc(m || c.key ? this.title(o, m, c.key) : (o.product || o.num))}</b>
            ${c.partCode ? `<span class="t-caption">${L("Scanned", "Nuskenuota")}: <b>${esc(c.partCode)}</b></span>` : ""}
          </div>
          ${m ? `<button class="btn ${mDone ? "" : "primary"} asm-done" id="asm-done">${icon(mDone ? "check-circle" : "check", 18)} ${mDone ? L("Assembled — undo", "Surinkta — atšaukti") : L("Cabinet assembled", "Spintelė surinkta")}</button>` : ""}
          ${parts.length ? `<div class="asm-parts"><div class="t-caption">${L("Panels in this cabinet", "Šios spintelės detalės")} · ${parts.length}</div>
            ${parts.map(p => `<div class="asm-part ${String(p.code).toUpperCase() === String(c.partCode).toUpperCase() ? "hit" : ""}"><span>${esc(p.name || p.code)}</span><span class="t-num">${p.l && p.w ? p.l + "×" + p.w : ""}</span></div>`).join("")}</div>` : ""}
          ${mods.length > 1 ? `<div class="asm-mods"><div class="t-caption">${L("All cabinets", "Visos spintelės")}</div><div class="asm-mod-list">
            ${mods.map(x => { var sh = this.sheetFor(o, x.key || x.name), nm = x.num || (sh ? this._base(sh.name).replace(/^(Spintelė|Cabinet)\s+/i, "") : x.name);
              return `<button class="asm-mod ${x.id === c.moduleId ? "on" : ""} ${(x.done || 0) >= (x.qty || 1) ? "done" : ""}" data-mod="${x.id}" title="${esc(x.name)}">${(x.done || 0) >= (x.qty || 1) ? icon("check", 12) + " " : ""}${esc(nm)}</button>`; }).join("")}
          </div></div>` : ""}
          <div class="asm-next">${icon("qr", 16)} ${L("Scan the next panel — its cabinet opens here", "Skenuokite kitą detalę — atsidarys jos spintelė")}</div>
        </aside>
      </div>`;
    this.bind(host, o);
  },
  bind(host, o) {
    var self = this, c = this.cur;
    $("#asm-close", host).onclick = () => self.close();
    var f = $("#asm-force", host);
    if (f) f.onclick = () => { c.start = self.start(o, c.stationId, true); self.render(); self.showFile(false); };
    var d = $("#asm-done", host);
    if (d) d.onclick = () => {
      var m = D.module(o, c.moduleId); if (!m) return;
      var done = (m.done || 0) >= (m.qty || 1);
      M.setModuleDone(o.id, m.id, done ? 0 : (m.qty || 1), App.me && App.me.id);
      if (!done && typeof ScanStation !== "undefined") ScanStation.beep(D.modulesDone(o) >= D.modulesTotal(o) ? "done" : "ok");
      self.render(); self.showFile(false);
    };
    $$("[data-file]", host).forEach(b => b.onclick = () => { c.fileId = b.dataset.file; c.page = 1; c.zoom = 1; c.found = false; self.render(); self.showFile(true); });
    $$("[data-mod]", host).forEach(b => b.onclick = () => {
      var m = D.module(o, b.dataset.mod); if (!m) return;
      c.moduleId = m.id; c.key = m.key || m.name; c.partCode = "";
      var dr = self.drawings(o, c.key, m);
      c.fileId = dr[0] ? dr[0].f.id : null; c.page = 1; c.zoom = 1; c.found = dr[0] ? dr[0].cab : false;
      self.render(); self.showFile(true);
    });
    var go = n => { if (!c.pages) return; c.page = Math.max(1, Math.min(c.pages, c.page + n)); self.draw(); };
    $("#asm-prev", host).onclick = () => go(-1);
    $("#asm-next", host).onclick = () => go(1);
    $("#asm-zin", host).onclick = () => { c.zoom = Math.min(4, c.zoom * 1.35); self.draw(); };
    $("#asm-zout", host).onclick = () => { c.zoom = Math.max(1, c.zoom / 1.35); self.draw(); };
    $("#asm-zfit", host).onclick = () => { c.zoom = 1; self.draw(); };
  },
  /* load the chosen file; seek = find the cabinet's page */
  showFile(seek) {
    var self = this, c = this.cur;
    if (!c || !c.fileId) return;
    var f = D.file(c.fileId); if (!f) return;
    var box = document.getElementById("asm-canvas");
    if (!/pdf/i.test(f.type)) {
      c.pages = 0;
      var tools = document.getElementById("asm-tools"); if (tools) tools.hidden = false;
      var pg = document.getElementById("asm-pg"); if (pg) pg.textContent = "";
      var hint = document.getElementById("asm-hint"); if (hint) hint.textContent = f.drw ? self.L("Cabinet builder drawing", "Spintelių kūrėjo brėžinys") : "";
      $$("#asm-prev,#asm-next").forEach(b => { b.style.display = "none"; });
      Files.url(f.id).then(u => {
        if (!self.cur || self.cur.fileId !== f.id || !box) return;
        var st = c.zoom > 1 ? `width:${Math.round(100 * c.zoom)}%;height:auto` : "max-width:100%;max-height:100%;width:100%;height:100%;object-fit:contain";
        box.innerHTML = u ? `<div class="asm-scroll${c.zoom > 1 ? " zoomed" : ""}"><img src="${u}" alt="${esc(f.name)}" style="${st}"></div>` : self._missing(f);
      });
      return;
    }
    $$("#asm-prev,#asm-next").forEach(b => { b.style.display = ""; });
    this.doc(f.id).then(doc => {
      if (!self.cur || self.cur.fileId !== f.id) return;
      c.pages = doc.numPages;
      if (!seek || c.found || doc.numPages < 2 || !c.key) return self.draw();
      self.draw();
      var hint = document.getElementById("asm-hint");
      if (hint) hint.textContent = self.L("Looking for the cabinet…", "Ieškoma spintelės lapo…");
      var m = c.moduleId ? D.module(D.order(c.orderId), c.moduleId) : null;
      self.findPage(f.id, c.key, m).then(pg => {
        if (!self.cur || self.cur.fileId !== f.id) return;
        var h = document.getElementById("asm-hint");
        if (pg) { c.page = pg; c.found = true; self.draw(); if (h) h.textContent = self.L("Cabinet's page", "Spintelės lapas"); }
        else if (h) h.textContent = self.L("Cabinet not named in this drawing", "Šiame brėžinyje spintelė nepažymėta");
      });
    }, err => { if (box && self.cur && self.cur.fileId === f.id) box.innerHTML = self._missing(f, err); });
  },
  _missing(f, err) {
    return `<div class="asm-empty">${icon("cloud-off", 36, "", 1.4)}<b>${esc(f.name)}</b><span>${esc(err && err.message || this.L("The full file has not reached the cloud yet.", "Pilnas failas dar neįkeltas į debesį."))}</span></div>`;
  },
  draw() {
    var self = this, c = this.cur;
    if (!c) return;
    var box = document.getElementById("asm-canvas"), tools = document.getElementById("asm-tools");
    if (!box) return;
    if (tools) tools.hidden = false;
    var pg = document.getElementById("asm-pg"); if (pg) pg.textContent = c.pages ? c.page + " / " + c.pages : "";
    var f = D.file(c.fileId);
    if (!f || !/pdf/i.test(f.type)) { if (f) this.showFile(false); return; }
    var ticket = (this._ticket = (this._ticket || 0) + 1);
    this.doc(f.id).then(doc => doc.getPage(c.page)).then(page => {
      if (ticket !== self._ticket) return;
      var vp1 = page.getViewport({ scale: 1 });
      var w = Math.max(200, box.clientWidth - 8), h = Math.max(200, box.clientHeight - 8);
      var fit = Math.min(w / vp1.width, h / vp1.height);        // the whole sheet on screen
      var css = fit * c.zoom, dpr = Math.min(window.devicePixelRatio || 1, 2);
      var vp = page.getViewport({ scale: css * dpr });
      var cv = document.createElement("canvas");
      cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
      cv.style.width = Math.floor(vp.width / dpr) + "px"; cv.style.height = Math.floor(vp.height / dpr) + "px";
      return page.render({ canvasContext: cv.getContext("2d"), viewport: vp }).promise.then(() => {
        if (ticket !== self._ticket) return;
        box.innerHTML = "";
        var sc = document.createElement("div"); sc.className = "asm-scroll" + (c.zoom > 1 ? " zoomed" : "");
        sc.appendChild(cv); box.appendChild(sc);
      });
    }).catch(err => { if (ticket === self._ticket) box.innerHTML = self._missing(f, err); });
  },

  _css() {
    if (document.getElementById("asm-css")) return;
    var s = document.createElement("style"); s.id = "asm-css";
    s.textContent = `
.asm-sheet{position:fixed;inset:0;z-index:130;background:var(--bg);color:var(--text);display:flex;flex-direction:column}
.asm-top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 14px;background:var(--surface);border-bottom:1px solid var(--border)}
.asm-title{display:flex;flex-direction:column;min-width:0}.asm-title b{font-size:18px}.asm-title span{color:var(--text-2);font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:46vw}
.asm-start{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}
.asm-pill{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;font-size:13.5px;font-weight:600}
.asm-pill.ok{background:var(--green-soft);color:#1b7a36}.asm-pill.warn{background:var(--orange-soft);color:#8a4d00}.asm-pill.info{background:var(--blue-soft);color:#0a58b8}
.asm-count{display:flex;flex-direction:column;align-items:flex-end;line-height:1.15}.asm-count b{font-size:20px}.asm-count span{font-size:12px;color:var(--text-2)}
.asm-body{flex:1;min-height:0;display:flex;gap:0}
.asm-draw{flex:1;min-width:0;display:flex;flex-direction:column}
.asm-files{display:flex;gap:6px;overflow-x:auto;padding:8px 12px;scrollbar-width:thin}
.asm-file{flex:none;display:inline-flex;align-items:center;gap:6px;max-width:320px;padding:8px 12px;border-radius:999px;border:1px solid var(--border-strong);background:var(--surface);color:var(--text);font:inherit;font-size:13.5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer}
.asm-file.on{background:var(--text);color:var(--surface);border-color:var(--text)}.asm-file i{font-style:normal;font-size:11.5px;opacity:.75}
.asm-canvas{flex:1;min-height:0;position:relative;display:flex;align-items:center;justify-content:center;background:#e9eaec;margin:0 12px;border-radius:var(--r-md);overflow:hidden}
.asm-scroll{position:absolute;inset:0;overflow:auto;display:flex;align-items:center;justify-content:center;-webkit-overflow-scrolling:touch}
.asm-scroll.zoomed{display:block}.asm-scroll canvas{background:#fff;box-shadow:var(--shadow-2);margin:4px auto;display:block}
.asm-scroll img{display:block;margin:auto;background:#fff}
.asm-tools{display:flex;align-items:center;gap:8px;padding:8px 12px}.asm-tools .icon-btn{width:44px;height:44px;font-size:22px}
.asm-tools .grow{flex:1}
.asm-empty{display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;max-width:420px;padding:24px;color:var(--text-2)}.asm-empty b{color:var(--text);font-size:17px}
.asm-side{flex:0 0 320px;min-width:0;display:flex;flex-direction:column;gap:14px;padding:12px 14px;border-left:1px solid var(--border);background:var(--surface);overflow:auto}
.asm-cab{display:flex;flex-direction:column;gap:3px}.asm-cab-name{font-size:22px;line-height:1.2;word-break:break-word}
.asm-done{min-height:56px;font-size:17px;justify-content:center}
.asm-parts{display:flex;flex-direction:column;gap:4px}.asm-part{display:flex;justify-content:space-between;gap:8px;padding:8px 10px;border-radius:var(--r-sm);background:var(--surface-2);font-size:14px}
.asm-part.hit{background:var(--accent-soft);outline:2px solid var(--accent);font-weight:700}
.asm-mod-list{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}
.asm-mod{min-height:40px;padding:6px 10px;border-radius:var(--r-sm);border:1px solid var(--border-strong);background:var(--surface);color:var(--text);font:inherit;font-size:13px;cursor:pointer;max-width:100%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.asm-mod.done{background:var(--green-soft);border-color:transparent}.asm-mod.on{outline:2px solid var(--text)}
.asm-next{margin-top:auto;display:flex;align-items:center;gap:8px;color:var(--text-2);font-size:13.5px;padding-top:6px}
@media (max-width:820px){.asm-body{flex-direction:column}.asm-side{flex:0 0 auto;max-height:40vh;border-left:0;border-top:1px solid var(--border)}.asm-title span{max-width:60vw}}
`;
    document.head.appendChild(s);
  }
};

/* the scan station hands assembly scans here first */
(function () {
  if (typeof ScanStation === "undefined") return;
  var orig = ScanStation.onScan;
  ScanStation.onScan = function (payload) {
    var now = Date.now();
    if (payload === this._last.payload && now - this._last.ts < 700) return;
    try {
      if (Assembly.onScan(String(payload).trim(), this.stationId)) { this._last = { payload: payload, ts: now }; return; }
    } catch (e) { console.warn("[assembly]", e); }
    return orig.call(this, payload);
  };
  window.addEventListener("resize", () => { if (Assembly.isOpen() && Assembly.cur && Assembly.cur.pages) Assembly.draw(); });
})();
