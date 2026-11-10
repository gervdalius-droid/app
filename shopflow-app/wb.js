/* ============================================================
   ShopFlow — Whiteboard (WB)
   FigJam/Freeform-style shared canvas: sticky notes, text,
   shapes + connectors (workflows), tables, freehand pen.
   Every team member can add; every element remembers its author.
   ============================================================ */
"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var WB = {
  openId: null,
  tool: "select",
  // select | sticky | text | shape | table | pen | connect
  selectedId: null,
  editingId: null,
  connectFrom: null,
  vp: {
    x: 60,
    y: 40,
    z: 1
  },
  _gesture: null,
  _kbInstalled: false,
  COLORS: 7,
  // wb-c0..c6

  isActive() {
    return !!App.me && !!this.openId && (App.usesCockpit() && App.view === "whiteboard" || App.me.role === "worker" && App.workerTab === "board");
  },
  board() {
    return D.board(this.openId);
  },
  /* ================= view ================= */
  view() {
    if (this.openId && (!D.board(this.openId) || !D.boardAccess(D.board(this.openId), App.me.id))) this.openId = null;
    return this.openId ? this.canvasView() : this.gallery();
  },
  shareBadge(b, size = 12) {
    var _D$member;
    var v = b.visibility || "team";
    if (v === "private") return `<span class="wb-vis" title="Private — only ${esc(((_D$member = D.member(b.createdBy)) === null || _D$member === void 0 ? void 0 : _D$member.name) || "the creator")}">${icon("lock", size)} Private</span>`;
    if (v === "custom") return `<span class="wb-vis" title="Shared with selected people">${icon("users", size)} ${(b.memberIds || []).length + 1}</span>`;
    return `<span class="wb-vis" title="Visible to the whole team">${icon("users", size)} Team</span>`;
  },
  /* ---------- gallery ---------- */
  gallery() {
    var boards = D.boardsFor(App.me.id).sort((a, b) => b.updatedAt - a.updatedAt);
    return `<div class="wb-gallery view-anim">
      <div class="section-title">
        <h2 class="muted" style="font-weight:500">${boards.length} board${boards.length === 1 ? "" : "s"} you can see — private boards stay yours</h2>
      </div>
      <div class="wb-grid">
        ${boards.map(b => {
      var creator = D.member(b.createdBy);
      return `<button class="wb-card" data-wb-open="${b.id}">
            <div class="thumb">${this.thumb(b)}</div>
            <div class="cbody">
              <span class="grow"><b>${esc(b.name)}</b>
              <span>${b.els.length} item${b.els.length === 1 ? "" : "s"} · ${fmtAgo(b.updatedAt)} · ${this.shareBadge(b, 10)}</span></span>
              ${avatarHtml(creator, "sm")}
            </div>
          </button>`;
    }).join("")}
        <button class="wb-card wb-new-card" id="wb-new">${icon("plus", 15)} New board</button>
      </div>
    </div>`;
  },
  thumb(b) {
    if (!b.els.length) return "";
    var xs = b.els.map(e => e.x),
      ys = b.els.map(e => e.y);
    var x0 = Math.min(...xs),
      y0 = Math.min(...ys);
    var x1 = Math.max(...b.els.map(e => e.x + (e.w || 100))),
      y1 = Math.max(...b.els.map(e => e.y + (e.h || 60)));
    var sc = Math.min(230 / Math.max(x1 - x0, 1), 96 / Math.max(y1 - y0, 1), 0.4);
    return b.els.slice(0, 14).map(e => {
      var cls = e.type === "sticky" || e.type === "shape" ? `wb-c${e.color % this.COLORS}` : "";
      var bg = cls ? "" : "background:var(--surface-3);";
      return `<i class="${cls}" style="${bg}left:${6 + (e.x - x0) * sc}px;top:${6 + (e.y - y0) * sc}px;width:${Math.max(6, (e.w || 100) * sc)}px;height:${Math.max(4, (e.h || 60) * sc)}px"></i>`;
    }).join("");
  },
  /* ---------- canvas ---------- */
  canvasView() {
    var b = this.board();
    var creator = D.member(b.createdBy);
    return `<div class="wb-shell view-anim">
      <div class="wb-topbar">
        <button class="icon-btn" id="wb-back" title="All boards">${icon("chev-left", 16)}</button>
        <span style="color:var(--accent)">${icon("brain", 19)}</span>
        <input class="wb-title" id="wb-title" value="${esc(b.name)}" maxlength="60">
        <span class="meta">${creator ? "by " + esc(creator.name) + " · " : ""}updated ${fmtAgo(b.updatedAt)}</span>
        <span class="grow"></span>
        <button class="btn ghost" id="wb-share" style="padding:6px 13px;font-size:12.5px">${this.shareBadge(b, 12)}</button>
        ${b.createdBy === App.me.id || App.isManager() ? `<button class="icon-btn" id="wb-del-board" title="Delete board">${icon("trash", 15)}</button>` : ""}
      </div>
      <div class="wb-canvas ${this.toolClass()}" id="wb-canvas">
        <div class="wb-world" id="wb-world" style="transform:translate(${this.vp.x}px,${this.vp.y}px) scale(${this.vp.z})">
          ${this.linesSvg(b)}
          ${b.els.map(e => this.elHtml(e)).join("")}
        </div>
        ${this.contextBar(b)}
        <div class="wb-hint" id="wb-hint">${this.hint()}</div>
        <div class="wb-tools">
          ${[["select", "cursor", "Select · drag empty space to pan", "V"], ["sticky", "sticky", "Sticky note", "S"], ["text", "type", "Text", "T"], ["shape", "square", "Shape (workflow node)", "R"], ["connect", "arrow-right", "Connector — click two shapes", "C"], ["table", "table", "Table", "B"], ["pen", "pen", "Pen", "P"]].map(([t, ico, tip, k]) => `<button class="wb-tool ${this.tool === t ? "active" : ""}" data-wb-tool="${t}" title="${tip}">${icon(ico, 18)}<span class="kbd">${k}</span></button>`).join("")}
        </div>
        <div class="wb-zoom">
          <button id="wb-zout" title="Zoom out">−</button>
          <span class="pct">${Math.round(this.vp.z * 100)}%</span>
          <button id="wb-zin" title="Zoom in">＋</button>
          <button id="wb-fit" title="Fit to content">⛶</button>
        </div>
      </div>
    </div>`;
  },
  toolClass() {
    if (this.tool === "pen") return "tool-pen";
    if (this.tool === "connect") return "tool-connect";
    if (["sticky", "text", "shape", "table"].includes(this.tool)) return "tool-place";
    return "";
  },
  hint() {
    return {
      select: "Double-click empty space for a sticky · double-click an item to edit its text",
      sticky: "Click anywhere to place a sticky note",
      text: "Click anywhere to place text",
      shape: "Click to place a workflow node — connect them with ↦",
      table: "Click anywhere to place a table",
      pen: "Draw freely — release to finish a stroke",
      connect: this.connectFrom ? "Now click the target item" : "Click the first item, then the second — click a line to remove it"
    }[this.tool] || "";
  },
  linesSvg(b) {
    var mid = e => e ? [e.x + (e.w || 100) / 2, e.y + (e.h || 60) / 2] : null;
    return `<svg class="wb-lines">
      <defs><marker id="wb-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--text-3)"></path>
      </marker></defs>
      ${b.conns.map(c => {
      var a = mid(b.els.find(e => e.id === c.from));
      var z = mid(b.els.find(e => e.id === c.to));
      if (!a || !z) return "";
      return `<path class="conn" data-conn="${c.id}" d="M ${a[0]} ${a[1]} L ${z[0]} ${z[1]}" marker-end="url(#wb-arrow)"></path>`;
    }).join("")}
    </svg>`;
  },
  elHtml(e) {
    var sel = e.id === this.selectedId ? "selected" : "";
    var src = e.id === this.connectFrom ? "connect-src" : "";
    var by = D.member(e.by);
    var byChip = `<span class="wb-by">${by ? avatarHtml(by, "sm") : ""}${by ? esc(by.name) : ""} · ${fmtAgo(e.ts)}</span>`;
    var base = `class="wb-el ${sel} ${src}" data-el="${e.id}"`;
    var pos = h => `style="left:${e.x}px;top:${e.y}px;width:${e.w}px;${h ? `height:${e.h}px;` : ""}"`;
    if (e.type === "sticky") return `<div ${base.replace('class="', 'class="wb-sticky wb-c' + e.color % this.COLORS + " ")} ${pos(true)}>
        <div class="wb-text">${esc(e.text)}</div><span class="wb-resize"></span>${byChip}</div>`;
    if (e.type === "image") {
      var f = D.files().find(x => x.id === e.fileId);
      /* the thumbnail is already in the document and paints instantly; the
         full picture is fetched from the file store and swapped in */
      return `<div ${base.replace('class="', 'class="wb-image ')} ${pos(true)}>
        ${f ? `<img class="wb-img" data-file="${f.id}" src="${f.thumb || ""}" alt="${esc(f.name || "")}" draggable="false">` : `<div class="wb-img-missing">${icon("camera", 22)}<span>Picture not here yet</span></div>`}
        <span class="wb-resize"></span>${byChip}</div>`;
    }
    if (e.type === "text") return `<div ${base.replace('class="', 'class="wb-textblock ')} ${pos(false)}>
        <div class="wb-text">${esc(e.text)}</div><span class="wb-resize"></span>${byChip}</div>`;
    if (e.type === "shape") return `<div ${base.replace('class="', `class="wb-shape kind-${e.kind || "rect"} wb-c${e.color % this.COLORS} `)} ${pos(true)}>
        <div class="wb-text" style="display:flex;align-items:center;justify-content:center">${esc(e.text)}</div><span class="wb-resize"></span>${byChip}</div>`;
    if (e.type === "table") return `<div ${base.replace('class="', 'class="wb-tablewrap ')} ${pos(false)}>
        <div class="wb-tablebar"><i></i><i></i><i></i></div>
        <table>${e.rows.map((row, r) => `<tr>${row.map((cell, c) => `<td contenteditable="true" data-r="${r}" data-c="${c}">${esc(cell)}</td>`).join("")}</tr>`).join("")}</table>
        <span class="wb-resize"></span>${byChip}</div>`;
    if (e.type === "draw") {
      var stroke = ["#e0a800", "#ff6b22", "#d61f47", "#1fa946", "#0a84ff", "#8e2de2", "var(--text)"][e.color % this.COLORS];
      return `<div ${base.replace('class="', 'class="wb-draw ')} ${pos(true)}>
        <svg width="${e.w}" height="${e.h}"><polyline points="${e.points.map(p => p.join(",")).join(" ")}" stroke="${stroke}"></polyline></svg>${byChip}</div>`;
    }
    return "";
  },
  contextBar(b) {
    var e = b.els.find(x => x.id === this.selectedId);
    if (!e) return "";
    var by = D.member(e.by);
    var labels = {
      sticky: "Sticky",
      text: "Text",
      shape: "Shape",
      table: "Table",
      draw: "Drawing"
    };
    var colorable = ["sticky", "shape", "draw"].includes(e.type);
    return `<div class="wb-context">
      <b style="color:var(--text)">${labels[e.type] || "Item"}</b>
      <span>· ${by ? esc(by.name) : "?"} · ${fmtAgo(e.ts)}</span>
      ${colorable ? Array.from({
      length: this.COLORS
    }, (_, i) => `<span class="wb-swatch wb-c${i} ${e.color % this.COLORS === i ? "on" : ""}" data-wb-color="${i}"></span>`).join("") : ""}
      ${e.type === "shape" ? `<button class="mini-act" data-wb-kind>${(e.kind || "rect") === "rect" ? "◯ Pill" : "▢ Rect"}</button>` : ""}
      ${e.type === "table" ? `<button class="mini-act" data-wb-tbl="row+">＋ Row</button>
        <button class="mini-act" data-wb-tbl="row-">− Row</button>
        <button class="mini-act" data-wb-tbl="col+">＋ Col</button>
        <button class="mini-act" data-wb-tbl="col-">− Col</button>` : ""}
      <button class="mini-act danger" data-wb-el-del>Delete</button>
    </div>`;
  },
  /* ================= bind ================= */
  bind(root) {
    if (!this.openId) {
      $$("[data-wb-open]", root).forEach(bn => bn.onclick = () => {
        this.openId = bn.dataset.wbOpen;
        this.selectedId = null;
        this.tool = "select";
        this.connectFrom = null;
        this.fit(true);
        App.render();
      });
      var nb = $("#wb-new", root);
      if (nb) nb.onclick = () => {
        Modal.open(`
          <header><h2>New board</h2><button class="icon-btn" data-close>✕</button></header>
          <div class="modal-body"><div class="field"><label>Board name</label>
            <input class="input" id="nb-name" placeholder="e.g. Shop improvement ideas"></div></div>
          <footer><button class="btn ghost" data-close>Cancel</button>
            <button class="btn primary" id="nb-create">Create board</button></footer>
        `, modal => {
          $$("[data-close]", modal).forEach(x => x.onclick = () => Modal.close());
          var create = () => {
            var name = $("#nb-name", modal).value.trim() || "New board";
            var b = M.addBoard(name, App.me.id);
            Modal.close();
            this.openId = b.id;
            this.vp = {
              x: 60,
              y: 40,
              z: 1
            };
            App.render();
            Toast.show(`Board “${name}” — everyone on the team can add to it`, {
              emoji: "brain",
              ms: 3800
            });
          };
          $("#nb-create", modal).onclick = create;
          $("#nb-name", modal).onkeydown = ev => {
            if (ev.key === "Enter") create();
          };
        });
      };
      return;
    }
    this.bindCanvas(root);
    this.installKeys();
    this.installPaste();
  },
  bindCanvas(root) {
    var b = this.board();
    $("#wb-back", root).onclick = () => {
      this.openId = null;
      App.render();
    };
    $("#wb-title", root).onchange = e => M.renameBoard(b.id, e.target.value.trim(), App.me.id);
    $("#wb-share", root).onclick = () => this.shareModal(b);
    var delBtn = $("#wb-del-board", root);
    if (delBtn) delBtn.onclick = () => {
      var snap = Store.snapshot();
      M.deleteBoard(b.id, App.me.id);
      this.openId = null;
      App.render();
      Toast.show("Board deleted", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    };
    $$("[data-wb-tool]", root).forEach(bt => bt.onclick = () => {
      this.tool = bt.dataset.wbTool;
      this.connectFrom = null;
      this.repaint();
    });
    $("#wb-zin", root).onclick = () => this.zoomBy(1.2);
    $("#wb-zout", root).onclick = () => this.zoomBy(1 / 1.2);
    $("#wb-fit", root).onclick = () => {
      this.fit();
      this.repaint();
    };
    var canvas = $("#wb-canvas", root);
    canvas.onwheel = e => {
      e.preventDefault();
      if (e.ctrlKey || e.metaKey) {
        var f = Math.pow(1.0016, -e.deltaY);
        this.zoomAt(e.clientX, e.clientY, f, canvas);
      } else {
        this.vp.x -= e.deltaX;
        this.vp.y -= e.deltaY;
        this.applyTransform(canvas);
      }
    };
    canvas.onpointerdown = e => this.pointerDown(e, canvas);
    canvas.onpointermove = e => this.pointerMove(e, canvas);
    canvas.onpointerup = e => this.pointerUp(e, canvas);
    canvas.ondblclick = e => this.dblClick(e, canvas);
    this.hydrateImages(canvas); // thumbnails first, full pictures behind them

    /* connectors: click a line to remove it */
    $$("path.conn", canvas).forEach(p => p.style.pointerEvents = "stroke");
    canvas.addEventListener("click", e => {
      var path = e.target.closest && e.target.closest("path.conn");
      if (path && this.tool === "connect") {
        M.wbDisconnect(b.id, path.dataset.conn);
        this.repaint();
      }
    });

    /* table cell edits save on focusout */
    canvas.addEventListener("focusout", e => {
      var td = e.target.closest && e.target.closest("td[data-r]");
      if (!td) return;
      var wrap = td.closest(".wb-el");
      var rows = [...wrap.querySelectorAll("tr")].map(tr => [...tr.children].map(c => c.innerText.trim()));
      M.wbUpdate(b.id, wrap.dataset.el, {
        rows
      });
    });
  },
  /* ---------- sharing ---------- */
  shareModal(b) {
    var _D$member2, _D$member3, _D$member4;
    var canEdit = b.createdBy === App.me.id || App.isManager();
    var v = b.visibility || "team";
    Modal.open(`
      <header><h2>Board sharing</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        ${canEdit ? `
        <div class="field"><label>Who can see “${esc(b.name)}”?</label>
          <div class="route-picker">
            ${[["team", "users", "Whole team", "Everyone can view and edit"], ["private", "lock", "Only me", "Visible only to " + esc(((_D$member2 = D.member(b.createdBy)) === null || _D$member2 === void 0 ? void 0 : _D$member2.name) || "the creator")], ["custom", "sliders", "Selected people", "Pick exactly who has access"]].map(([val, ic, label, sub]) => `
              <div class="route-pick ${v === val ? "on" : ""}" data-vis="${val}">
                <span class="chk">✓</span>
                <span class="ico" style="color:var(--text-2)">${icon(ic, 16)}</span>
                <b>${label}</b><span class="t-caption">${sub}</span>
              </div>`).join("")}
          </div>
        </div>
        <div class="field ${v === "custom" ? "" : "hide"}" id="wb-share-members">
          <label>People with access (besides ${esc(((_D$member3 = D.member(b.createdBy)) === null || _D$member3 === void 0 ? void 0 : _D$member3.name) || "creator")})</label>
          <div class="route-picker">
            ${Store.state.members.filter(m => m.id !== b.createdBy).map(m => `
              <div class="route-pick ${(b.memberIds || []).includes(m.id) ? "on" : ""}" data-share-m="${m.id}">
                <span class="chk">✓</span>${avatarHtml(m, "sm")}<b>${esc(m.name)}</b>
                <span class="t-caption">${esc(m.trade)}</span>
              </div>`).join("")}
          </div>
        </div>` : `<div class="t-caption">Only ${esc(((_D$member4 = D.member(b.createdBy)) === null || _D$member4 === void 0 ? void 0 : _D$member4.name) || "the creator")} or a manager can change sharing.</div>`}
      </div>
      ${canEdit ? `<footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="wb-share-save">Save sharing</button>
      </footer>` : ""}
    `, modal => {
      $$("[data-close]", modal).forEach(x => x.onclick = () => Modal.close());
      var vis = v;
      $$("[data-vis]", modal).forEach(r => r.onclick = () => {
        vis = r.dataset.vis;
        $$("[data-vis]", modal).forEach(x => x.classList.toggle("on", x === r));
        $("#wb-share-members", modal).classList.toggle("hide", vis !== "custom");
      });
      $$("[data-share-m]", modal).forEach(r => r.onclick = () => r.classList.toggle("on"));
      var save = $("#wb-share-save", modal);
      if (save) save.onclick = () => {
        var ids = $$("[data-share-m].on", modal).map(r => r.dataset.shareM);
        M.setBoardSharing(b.id, vis, ids, App.me.id);
        Modal.close();
        App.render();
        Toast.show(vis === "team" ? "Shared with the whole team" : vis === "private" ? "Board is now private" : `Shared with ${ids.length + 1} people`, {
          emoji: vis === "private" ? "lock" : "users"
        });
      };
    });
  },
  /* ================= geometry ================= */
  world(e, canvas) {
    var r = canvas.getBoundingClientRect();
    return [(e.clientX - r.left - this.vp.x) / this.vp.z, (e.clientY - r.top - this.vp.y) / this.vp.z];
  },
  applyTransform(canvas) {
    var w = $("#wb-world", canvas);
    if (w) w.style.transform = `translate(${this.vp.x}px,${this.vp.y}px) scale(${this.vp.z})`;
    var pct = canvas.querySelector(".wb-zoom .pct");
    if (pct) pct.textContent = Math.round(this.vp.z * 100) + "%";
  },
  zoomAt(cx, cy, f, canvas) {
    var r = canvas.getBoundingClientRect();
    var z2 = Math.max(0.25, Math.min(2.5, this.vp.z * f));
    var k = z2 / this.vp.z;
    this.vp.x = cx - r.left - k * (cx - r.left - this.vp.x);
    this.vp.y = cy - r.top - k * (cy - r.top - this.vp.y);
    this.vp.z = z2;
    this.applyTransform(canvas);
  },
  zoomBy(f) {
    var canvas = $("#wb-canvas");
    if (canvas) {
      var r = canvas.getBoundingClientRect();
      this.zoomAt(r.left + r.width / 2, r.top + r.height / 2, f, canvas);
    }
  },
  fit(initial) {
    var b = this.board();
    if (!b || !b.els.length) {
      this.vp = {
        x: 60,
        y: 40,
        z: 1
      };
      return;
    }
    var hEst = e => e.h || (e.type === "table" ? e.rows.length * 34 + 24 : 60);
    var x0 = Math.min(...b.els.map(e => e.x)),
      y0 = Math.min(...b.els.map(e => e.y));
    var x1 = Math.max(...b.els.map(e => e.x + (e.w || 100))),
      y1 = Math.max(...b.els.map(e => e.y + hEst(e)));
    var canvas = $("#wb-canvas");
    var cw = canvas ? canvas.clientWidth : 1100,
      ch = canvas ? canvas.clientHeight : 640;
    var z = Math.max(0.25, Math.min((cw - 100) / Math.max(x1 - x0, 1), (ch - 170) / Math.max(y1 - y0, 1), initial ? 1 : 1.4));
    this.vp = {
      z,
      x: (cw - (x1 - x0) * z) / 2 - x0 * z,
      y: (ch - (y1 - y0) * z) / 2 - y0 * z - 20
    };
  },
  /* ================= interactions ================= */
  DEFAULTS: {
    sticky: {
      w: 180,
      h: 180,
      color: 0,
      text: ""
    },
    text: {
      w: 240,
      h: 44,
      color: 6,
      text: ""
    },
    shape: {
      w: 180,
      h: 64,
      color: 4,
      kind: "rect",
      text: ""
    },
    image: {
      w: 320,
      h: 240
    },
    table: {
      w: 340,
      h: 0,
      color: 6,
      text: "",
      rows: [["", "", ""], ["", "", ""], ["", "", ""]]
    }
  },
  pointerDown(e, canvas) {
    if (e.target.closest(".wb-tools, .wb-zoom, .wb-context, .wb-hint, .wb-topbar")) return;
    var b = this.board();
    var _this$world = this.world(e, canvas),
      _this$world2 = _slicedToArray(_this$world, 2),
      wx = _this$world2[0],
      wy = _this$world2[1];
    if (["sticky", "text", "shape", "table"].includes(this.tool)) {
      var def = JSON.parse(JSON.stringify(this.DEFAULTS[this.tool]));
      var el = M.wbAdd(b.id, _objectSpread({
        type: this.tool,
        x: Math.round(wx - def.w / 2),
        y: Math.round(wy - (def.h || 60) / 2)
      }, def), App.me.id);
      this.tool = "select";
      this.selectedId = el.id;
      this.repaint();
      if (el.type !== "table") this.startEditing(el.id);
      return;
    }
    if (this.tool === "pen") {
      canvas.setPointerCapture(e.pointerId);
      this._gesture = {
        kind: "pen",
        pts: [[wx, wy]]
      };
      var w = $("#wb-world", canvas);
      var tmp = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      tmp.setAttribute("class", "wb-lines");
      tmp.id = "wb-pen-tmp";
      tmp.innerHTML = `<polyline fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="${wx},${wy}"></polyline>`;
      w.appendChild(tmp);
      return;
    }
    var elDiv = e.target.closest(".wb-el");
    if (this.tool === "connect") {
      if (elDiv) {
        var id = elDiv.dataset.el;
        if (!this.connectFrom) {
          this.connectFrom = id;
        } else if (this.connectFrom !== id) {
          M.wbConnect(b.id, this.connectFrom, id);
          this.connectFrom = null;
        }
        this.repaint();
      }
      return;
    }

    // ---- select tool ----
    var handle = e.target.closest(".wb-resize");
    if (handle && elDiv) {
      var _el = b.els.find(x => x.id === elDiv.dataset.el);
      canvas.setPointerCapture(e.pointerId);
      this._gesture = {
        kind: "resize",
        el: _el,
        sw: _el.w,
        sh: _el.h || 0,
        sx: wx,
        sy: wy,
        div: elDiv
      };
      return;
    }
    if (elDiv) {
      var _id = elDiv.dataset.el;
      if (this.editingId === _id) return; // typing — leave alone
      if (e.target.closest("td[data-r]")) {
        this.select(_id);
        return;
      } // table cells edit on click
      var _el2 = b.els.find(x => x.id === _id);
      canvas.setPointerCapture(e.pointerId);
      this._gesture = {
        kind: "drag",
        el: _el2,
        ox: wx - _el2.x,
        oy: wy - _el2.y,
        div: elDiv,
        moved: false
      };
      this.select(_id);
      return;
    }
    // empty canvas → pan
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add("panning");
    this._gesture = {
      kind: "pan",
      sx: e.clientX,
      sy: e.clientY,
      ox: this.vp.x,
      oy: this.vp.y
    };
    if (this.selectedId) {
      this.selectedId = null;
      this.repaint();
    }
  },
  pointerMove(e, canvas) {
    var g = this._gesture;
    if (!g) return;
    var _this$world3 = this.world(e, canvas),
      _this$world4 = _slicedToArray(_this$world3, 2),
      wx = _this$world4[0],
      wy = _this$world4[1];
    if (g.kind === "pan") {
      this.vp.x = g.ox + (e.clientX - g.sx);
      this.vp.y = g.oy + (e.clientY - g.sy);
      this.applyTransform(canvas);
    } else if (g.kind === "drag") {
      g.moved = true;
      g.el.x = Math.round(wx - g.ox);
      g.el.y = Math.round(wy - g.oy);
      g.div.style.left = g.el.x + "px";
      g.div.style.top = g.el.y + "px";
      this.updateConnPaths(canvas);
    } else if (g.kind === "resize") {
      g.el.w = Math.max(60, Math.round(g.sw + (wx - g.sx)));
      g.div.style.width = g.el.w + "px";
      if (g.el.type !== "table" && g.el.type !== "text") {
        g.el.h = Math.max(40, Math.round(g.sh + (wy - g.sy)));
        g.div.style.height = g.el.h + "px";
      }
      this.updateConnPaths(canvas);
    } else if (g.kind === "pen") {
      var last = g.pts[g.pts.length - 1];
      if (Math.hypot(wx - last[0], wy - last[1]) > 2.5 / this.vp.z) {
        g.pts.push([wx, wy]);
        var poly = canvas.querySelector("#wb-pen-tmp polyline");
        if (poly) poly.setAttribute("points", g.pts.map(p => p.join(",")).join(" "));
      }
    }
  },
  pointerUp(e, canvas) {
    var g = this._gesture;
    this._gesture = null;
    canvas.classList.remove("panning");
    if (!g) return;
    var b = this.board();
    if (g.kind === "drag") {
      if (g.moved) {
        g.el.x = Math.round(g.el.x / 8) * 8;
        g.el.y = Math.round(g.el.y / 8) * 8; // snap
        M.wbUpdate(b.id, g.el.id, {
          x: g.el.x,
          y: g.el.y
        });
        M.wbFront(b.id, g.el.id);
        this.repaint();
      }
    } else if (g.kind === "resize") {
      M.wbUpdate(b.id, g.el.id, {
        w: g.el.w,
        h: g.el.h
      });
      this.repaint();
    } else if (g.kind === "pen") {
      var _$;
      (_$ = $("#wb-pen-tmp", canvas)) === null || _$ === void 0 || _$.remove();
      if (g.pts.length > 2) {
        var xs = g.pts.map(p => p[0]),
          ys = g.pts.map(p => p[1]);
        var x0 = Math.min(...xs),
          y0 = Math.min(...ys);
        M.wbAdd(b.id, {
          type: "draw",
          x: Math.round(x0),
          y: Math.round(y0),
          w: Math.max(8, Math.round(Math.max(...xs) - x0)),
          h: Math.max(8, Math.round(Math.max(...ys) - y0)),
          color: 4,
          points: g.pts.map(p => [Math.round(p[0] - x0), Math.round(p[1] - y0)])
        }, App.me.id);
        this.repaint();
      }
    }
  },
  dblClick(e, canvas) {
    if (e.target.closest(".wb-tools, .wb-zoom, .wb-context, .wb-hint")) return;
    /* Do NOT trust e.target. The first click selects the note, which used to
       re-render the whole canvas, so by the time the second click lands the
       original node is gone — and the browser then reports the double-click
       against the nearest surviving ancestor, the canvas. That read as "empty
       space", and empty space means "make a sticky": double-clicking a note to
       edit it dropped a second note on top of it instead.
       Selection no longer re-renders, and this asks what is under the cursor
       now rather than which node the event was filed against. */
    var hit = document.elementFromPoint(e.clientX, e.clientY);
    var elDiv = hit && hit.closest && hit.closest(".wb-el") || e.target.closest(".wb-el");
    if (elDiv) {
      if (elDiv.querySelector(".wb-text")) this.startEditing(elDiv.dataset.el);
      return; // a picture has no text to edit; the double-click just selects it
    }
    // FigJam habit: double-click empty space → sticky (select tool only)
    if (this.tool !== "select") return;
    var _this$world5 = this.world(e, canvas),
      _this$world6 = _slicedToArray(_this$world5, 2),
      wx = _this$world6[0],
      wy = _this$world6[1];
    var def = JSON.parse(JSON.stringify(this.DEFAULTS.sticky));
    var el = M.wbAdd(this.board().id, _objectSpread({
      type: "sticky",
      x: Math.round(wx - 90),
      y: Math.round(wy - 90)
    }, def), App.me.id);
    this.selectedId = el.id;
    this.repaint();
    this.startEditing(el.id);
  },
  startEditing(elId) {
    var div = document.querySelector(`.wb-el[data-el="${elId}"] .wb-text`);
    if (!div) return;
    this.editingId = elId;
    div.contentEditable = "true";
    div.focus();
    var range = document.createRange();
    range.selectNodeContents(div);
    range.collapse(false);
    var s = getSelection();
    s.removeAllRanges();
    s.addRange(range);
    div.onblur = () => {
      div.contentEditable = "false";
      this.editingId = null;
      M.wbUpdate(this.openId, elId, {
        text: div.innerText.trim()
      });
    };
  },
  /* Selecting is a class, not a rebuild. A full re-render threw away the node
     under the user's finger mid-gesture, which broke double-click to edit and
     made every selection cost a whole canvas. */
  select(id) {
    if (this.selectedId === id) return;
    this.selectedId = id;
    var host = document.getElementById("wb-canvas");
    if (!host) {
      this.repaint();
      return;
    }
    host.querySelectorAll(".wb-el.selected").forEach(n => n.classList.remove("selected"));
    var next = id && host.querySelector(`.wb-el[data-el="${id}"]`);
    if (next) next.classList.add("selected");
    this.paintContext();
  },
  /* The bar of actions for whatever is selected. Swapped in place rather than
     re-rendered with the board; its buttons are delegated on document, so it
     needs no rebinding. */
  paintContext() {
    var host = document.getElementById("wb-canvas");
    var b = this.board();
    if (!host || !b) return;
    var html = this.contextBar(b);
    var bar = host.querySelector(".wb-context");
    if (bar && !html) bar.remove();else if (bar && html) bar.outerHTML = html;else if (html) host.insertAdjacentHTML("beforeend", html);
  },
  updateConnPaths(canvas) {
    var b = this.board();
    var mid = e => e ? [e.x + (e.w || 100) / 2, e.y + (e.h || 60) / 2] : null;
    b.conns.forEach(c => {
      var path = canvas.querySelector(`path[data-conn="${c.id}"]`);
      if (!path) return;
      var a = mid(b.els.find(e => e.id === c.from));
      var z = mid(b.els.find(e => e.id === c.to));
      if (a && z) path.setAttribute("d", `M ${a[0]} ${a[1]} L ${z[0]} ${z[1]}`);
    });
  },
  /* light re-render of the canvas area only (keeps scroll/topbar) */
  repaint() {
    var host = $("#wb-canvas");
    if (!host) {
      App.render();
      return;
    }
    App.render();
  },
  /* ---------- pictures from the clipboard ----------
     A photo of a hinge or a screenshot of a drawing is the fastest way to say
     what you mean, and it was the one thing this board could not hold. The
     bytes go to the file store, never into the board — the whole document is
     pushed on every save, so a picture in it would be pushed with it. */
  installPaste() {
    var _this = this;
    if (this._pasteInstalled) return;
    this._pasteInstalled = true;
    document.addEventListener("paste", /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(e) {
        var _document$activeEleme;
        var items, img, blob, text;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!(!_this.isActive() || !_this.openId)) {
                _context.next = 2;
                break;
              }
              return _context.abrupt("return");
            case 2:
              if (!(_this.editingId || (_document$activeEleme = document.activeElement) !== null && _document$activeEleme !== void 0 && _document$activeEleme.isContentEditable)) {
                _context.next = 4;
                break;
              }
              return _context.abrupt("return");
            case 4:
              // typing into a note
              items = [...(e.clipboardData && e.clipboardData.items || [])];
              img = items.find(it => it.kind === "file" && /^image\//.test(it.type));
              if (!img) {
                _context.next = 11;
                break;
              }
              e.preventDefault();
              blob = img.getAsFile();
              if (blob) _this.dropImage(blob);
              return _context.abrupt("return");
            case 11:
              text = e.clipboardData && e.clipboardData.getData("text/plain");
              if (text && text.trim()) {
                e.preventDefault();
                _this.dropSticky(text.trim());
              }
            case 13:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    /* and the same thing dragged in from a folder */
    document.addEventListener("dragover", e => {
      if (!this.isActive() || !this.openId) return;
      if (e.dataTransfer && [...e.dataTransfer.types].includes("Files")) e.preventDefault();
    });
    document.addEventListener("drop", e => {
      if (!this.isActive() || !this.openId) return;
      var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
      if (!f || !/^image\//.test(f.type)) return;
      e.preventDefault();
      this.dropImage(f, e);
    });
  },
  /* where a pasted thing lands: under the cursor if we have one, else the
     middle of what the person is actually looking at */
  _cascade: 0,
  dropPoint(e) {
    var canvas = document.getElementById("wb-canvas");
    if (!canvas) return [0, 0];
    if (e && e.clientX != null) {
      this._cascade = 0;
      return this.world(e, canvas);
    }
    var r = canvas.getBoundingClientRect();
    var _this$world7 = this.world({
        clientX: r.left + r.width / 2,
        clientY: r.top + r.height / 2
      }, canvas),
      _this$world8 = _slicedToArray(_this$world7, 2),
      x = _this$world8[0],
      y = _this$world8[1];
    /* paste twice and the second should not hide under the first */
    var n = this._cascade = (this._cascade + 1) % 8;
    return [x + n * 26, y + n * 26];
  },
  dropImage(blob, e) {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var b, name, file, meta, max, ratio, w, h, _this2$dropPoint, _this2$dropPoint2, wx, wy, el;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            b = _this2.board();
            if (b) {
              _context2.next = 3;
              break;
            }
            return _context2.abrupt("return");
          case 3:
            _context2.prev = 3;
            name = blob.name || `pasted-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "")}.jpg`;
            file = blob instanceof File ? blob : new File([blob], name, {
              type: blob.type || "image/png"
            });
            Toast.show("Adding the picture…", {
              emoji: "camera",
              ms: 1800
            });
            _context2.next = 9;
            return Files.attach(file, {}, App.me.id);
          case 9:
            meta = _context2.sent;
            if (meta) {
              _context2.next = 12;
              break;
            }
            return _context2.abrupt("return");
          case 12:
            /* keep the picture's own shape — a squashed drawing is unreadable */
            max = 420;
            ratio = meta.w && meta.h ? meta.h / meta.w : 0.75;
            w = Math.round(Math.min(max, meta.w || max));
            h = Math.round(w * ratio);
            _this2$dropPoint = _this2.dropPoint(e), _this2$dropPoint2 = _slicedToArray(_this2$dropPoint, 2), wx = _this2$dropPoint2[0], wy = _this2$dropPoint2[1];
            el = M.wbAdd(b.id, {
              type: "image",
              fileId: meta.id,
              x: Math.round(wx - w / 2),
              y: Math.round(wy - h / 2),
              w,
              h
            }, App.me.id);
            _this2.selectedId = el.id;
            _this2.repaint();
            _context2.next = 25;
            break;
          case 22:
            _context2.prev = 22;
            _context2.t0 = _context2["catch"](3);
            Toast.show(_context2.t0 && _context2.t0.message || "Could not add that picture", {
              emoji: "alert",
              ms: 6000
            });
          case 25:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[3, 22]]);
    }))();
  },
  dropSticky(text, e) {
    var b = this.board();
    if (!b) return;
    var def = JSON.parse(JSON.stringify(this.DEFAULTS.sticky));
    var _this$dropPoint = this.dropPoint(e),
      _this$dropPoint2 = _slicedToArray(_this$dropPoint, 2),
      wx = _this$dropPoint2[0],
      wy = _this$dropPoint2[1];
    var el = M.wbAdd(b.id, _objectSpread(_objectSpread({
      type: "sticky",
      x: Math.round(wx - def.w / 2),
      y: Math.round(wy - def.h / 2)
    }, def), {}, {
      text: text.slice(0, 2000)
    }), App.me.id);
    this.selectedId = el.id;
    this.repaint();
  },
  /* swap the full picture in behind the thumbnail once it is to hand */
  hydrateImages(root) {
    $$("img.wb-img", root).forEach(/*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(img) {
        var u;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!img.dataset.full) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              img.dataset.full = "1";
              _context3.prev = 3;
              _context3.next = 6;
              return Files.url(img.dataset.file);
            case 6:
              u = _context3.sent;
              if (u) img.src = u;
              _context3.next = 12;
              break;
            case 10:
              _context3.prev = 10;
              _context3.t0 = _context3["catch"](3);
            case 12:
            case "end":
              return _context3.stop();
          }
        }, _callee3, null, [[3, 10]]);
      }));
      return function (_x2) {
        return _ref2.apply(this, arguments);
      };
    }());
  },
  /* context bar & keyboard */
  installKeys() {
    if (this._kbInstalled) return;
    this._kbInstalled = true;
    document.addEventListener("keydown", e => {
      var _document$activeEleme2, _document$activeEleme3;
      if (!this.isActive()) return;
      if (this.editingId || (_document$activeEleme2 = document.activeElement) !== null && _document$activeEleme2 !== void 0 && _document$activeEleme2.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(((_document$activeEleme3 = document.activeElement) === null || _document$activeEleme3 === void 0 ? void 0 : _document$activeEleme3.tagName) || "")) return;
      var map = {
        v: "select",
        s: "sticky",
        t: "text",
        r: "shape",
        c: "connect",
        b: "table",
        p: "pen"
      };
      var k = e.key.toLowerCase();
      if (map[k] && !e.metaKey && !e.ctrlKey) {
        this.tool = map[k];
        this.connectFrom = null;
        this.repaint();
      }
      if ((e.key === "Delete" || e.key === "Backspace") && this.selectedId) {
        e.preventDefault();
        var snap = Store.snapshot();
        M.wbDelete(this.openId, this.selectedId);
        this.selectedId = null;
        this.repaint();
        Toast.show("Deleted", {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      }
      if (e.key === "Escape") {
        if (this.connectFrom) this.connectFrom = null;else if (this.selectedId) this.selectedId = null;else this.tool = "select";
        this.repaint();
      }
    });
    /* context bar actions (delegated — survives repaints) */
    document.addEventListener("click", e => {
      if (!this.isActive() || !this.selectedId) return;
      var b = this.board();
      var el = b && b.els.find(x => x.id === this.selectedId);
      if (!el) return;
      var sw = e.target.closest("[data-wb-color]");
      if (sw) {
        M.wbUpdate(b.id, el.id, {
          color: parseInt(sw.dataset.wbColor)
        });
        this.repaint();
        return;
      }
      if (e.target.closest("[data-wb-kind]")) {
        M.wbUpdate(b.id, el.id, {
          kind: (el.kind || "rect") === "rect" ? "pill" : "rect"
        });
        this.repaint();
        return;
      }
      var tbl = e.target.closest("[data-wb-tbl]");
      if (tbl) {
        var rows = el.rows.map(r => [...r]);
        var act = tbl.dataset.wbTbl;
        if (act === "row+") rows.push(rows[0].map(() => ""));
        if (act === "row-" && rows.length > 1) rows.pop();
        if (act === "col+") rows.forEach(r => r.push(""));
        if (act === "col-" && rows[0].length > 1) rows.forEach(r => r.pop());
        M.wbUpdate(b.id, el.id, {
          rows
        });
        this.repaint();
        return;
      }
      if (e.target.closest("[data-wb-el-del]")) {
        var snap = Store.snapshot();
        M.wbDelete(b.id, el.id);
        this.selectedId = null;
        this.repaint();
        Toast.show("Deleted", {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      }
    });
  }
};