/* ============================================================
   ShopFlow — Scan Station (QR / barcode)
   A kiosk you run on a device at each station. A hardware
   scanner (HID keyboard-wedge) types the label code + Enter,
   or the device camera reads the QR. Each scan advances the
   part through this station and updates progress live.
   ============================================================ */
"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var ScanStation = {
  stationId: null,
  camera: false,
  _last: {
    payload: "",
    ts: 0
  },
  _ac: null,
  _stream: null,
  _raf: null,
  _det: null,
  isActive() {
    return App.me && App.view === "scan";
  },
  view() {
    if (this.stationId && !D.station(this.stationId)) this.stationId = null;
    return this.stationId ? this.kiosk() : this.picker();
  },
  /* ---------- station picker ---------- */
  picker() {
    var stns = D.stationsOf("prod");
    return `<div class="scan-picker view-anim">
      <div class="scan-picker-head">
        <div class="scan-logo">${icon("scan", 26)}</div>
        <div><h1 style="font-size:22px">Scan station</h1>
        <p class="muted" style="font-size:13.5px">Pick the station this device sits at. A USB/Bluetooth scanner or the camera then advances every part you scan.</p></div>
      </div>
      <div class="scan-grid">
        ${stns.map(st => {
      var s = D.stationScanStats(st.id);
      var pct = s.total ? Math.round(s.done / s.total * 100) : 0;
      return `<button class="scan-station-card" data-scan-station="${st.id}">
            <div class="ico">${stIcon(st, 26)}</div>
            <b>${esc(st.name)}</b>
            <div class="progress ${pct === 100 ? "done" : ""}" style="width:100%"><i style="width:${pct}%"></i></div>
            <span class="t-caption t-num">${s.done}/${s.total} pcs today</span>
          </button>`;
    }).join("")}
      </div>
    </div>`;
  },
  /* ---------- kiosk ---------- */
  kiosk() {
    var st = D.station(this.stationId);
    var s = D.stationScanStats(st.id);
    var pct = s.total ? Math.round(s.done / s.total * 100) : 0;
    var hasCam = typeof window !== "undefined" && "BarcodeDetector" in window;
    return `<div class="scan-shell view-anim">
      <div class="scan-top">
        <button class="icon-btn" id="scan-back" title="Change station">${icon("chev-left", 16)}</button>
        <div class="scan-st-ico">${stIcon(st, 22)}</div>
        <div class="grow"><b style="font-size:18px;font-weight:700">${esc(st.name)}</b>
        <span class="t-caption">Scan station · ready for labels</span></div>
        <button class="btn ghost" id="scan-cam-btn" title="${hasCam ? "Use device camera" : "No built-in camera scanner — use a USB/Bluetooth scanner"}">${icon("camera", 15)} Camera</button>
        <div class="scan-progress-badge"><b class="t-num">${s.done}/${s.total}</b><span>pcs · ${pct}%</span></div>
      </div>
      <div class="scan-body">
        <div class="scan-main">
          <video id="scan-video" class="hide" playsinline muted></video>
          <div class="scan-status idle" id="scan-status">
            <div class="scan-status-ico">${icon("qr", 54, "", 1.4)}</div>
            <div class="scan-status-title">Ready to scan</div>
            <div class="scan-status-sub">Point the scanner at a part label’s QR code</div>
          </div>
          <input id="scan-capture" class="scan-capture" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="…or type / paste a part code and press Enter">
        </div>
        <div class="scan-side">
          <div class="scan-side-head">${icon("history", 14)} Recent scans</div>
          <div class="scan-recent" id="scan-recent">${this.recentHtml()}</div>
        </div>
      </div>
    </div>`;
  },
  recentHtml() {
    var rows = (Store.state.scanLog || []).filter(r => r.stationId === this.stationId).slice(0, 40);
    if (!rows.length) return `<div class="t-caption" style="padding:14px">No scans yet at this station.</div>`;
    var meta = {
      ok: ["ok", "check"],
      opDone: ["ok", "check-circle"],
      dup: ["warn", "history"],
      waiting: ["warn", "clock"],
      notrouted: ["warn", "alert"],
      stationDone: ["info", "check-circle"],
      notfound: ["err", "ban"],
      nostation: ["err", "alert"]
    };
    return rows.map(r => {
      var _ref = meta[r.status] || ["info", "info"],
        _ref2 = _slicedToArray(_ref, 2),
        cls = _ref2[0],
        ic = _ref2[1];
      var o = r.orderId ? D.order(r.orderId) : null;
      var m = D.member(r.by);
      return `<div class="scan-rec ${cls}">
        <span class="scan-rec-ic">${icon(ic, 13)}</span>
        <span class="grow"><b>${esc(r.partCode || r.payload)}</b><span>${o ? esc(o.num) : "unknown"} · ${m ? esc(m.name) : ""} · ${fmtAgo(r.ts)}</span></span>
      </div>`;
    }).join("");
  },
  /* ---------- bind ---------- */
  bind(root) {
    if (!this.stationId) {
      $$("[data-scan-station]", root).forEach(b => b.onclick = () => {
        this.stationId = b.dataset.scanStation;
        App.render();
      });
      return;
    }
    $("#scan-back", root).onclick = () => {
      this.stopCamera();
      this.stationId = null;
      App.render();
    };
    var cap = $("#scan-capture", root);
    var focus = () => {
      if (!this.camera && cap && document.activeElement !== cap) cap.focus();
    };
    focus();
    // keyboard-wedge scanners end with Enter
    cap.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        var v = cap.value;
        cap.value = "";
        if (v.trim()) this.onScan(v.trim());
      }
    };
    // keep the field focused for the scanner (unless camera or a dialog is open)
    root.onclick = e => {
      if (!e.target.closest("button,input,video,.wb-el")) focus();
    };
    cap.onblur = () => setTimeout(() => {
      if (this.isActive() && !this.camera && !$(".modal-scrim")) focus();
    }, 60);
    $("#scan-cam-btn", root).onclick = () => this.camera ? this.stopCamera() : this.startCamera();
  },
  /* ---------- scan handling ---------- */
  onScan(payload) {
    var now = Date.now();
    if (payload === this._last.payload && now - this._last.ts < 700) return; // scanners double-fire
    this._last = {
      payload,
      ts: now
    };
    var res = M.scanPart(payload, this.stationId, App.me.id);
    this.render(res);
    this.beep(res.status === "opDone" ? "done" : res.status === "ok" ? "ok" : ["notfound", "nostation"].includes(res.status) ? "err" : "warn");
  },
  render(res) {
    var el = $("#scan-status");
    if (!el) return;
    var cls = {
      ok: "ok",
      opDone: "ok",
      dup: "warn",
      waiting: "warn",
      notrouted: "warn",
      stationDone: "info",
      notfound: "err",
      nostation: "err"
    }[res.status] || "info";
    var o = res.order,
      item = res.item,
      op = res.op;
    var ico = "check",
      title = "",
      sub = "";
    if (res.status === "ok") {
      ico = "check-circle";
      title = `${res.qtyDone} / ${item.qty}`;
      sub = `${o.num} · ${esc(res.parsed.partCode || "")}`;
    } else if (res.status === "opDone") {
      ico = "check-circle";
      title = "Station complete";
      sub = `${o.num} — all ${item.qty} pcs through ${res.station.name}`;
    } else if (res.status === "dup") {
      ico = "history";
      title = "Already scanned";
      sub = `${esc(res.parsed.partCode)} counted here already`;
    } else if (res.status === "waiting") {
      ico = "clock";
      title = "Waiting for upstream";
      sub = `${o.num} — earlier step hasn’t produced this part yet`;
    } else if (res.status === "notrouted") {
      ico = "alert";
      title = "Not routed here";
      sub = `${o.num} doesn’t pass ${res.station.name}`;
    } else if (res.status === "stationDone") {
      ico = "check-circle";
      title = "Already complete";
      sub = `${o.num} is done at ${res.station.name}`;
    } else if (res.status === "unknownPart") {
      ico = "ban";
      title = "Not on the part list";
      sub = `${res.order.num} has no part “${esc(res.parsed.partCode)}” — wrong or outdated label`;
    } else if (res.status === "notfound") {
      var _res$parsed, _res$parsed2;
      ico = "ban";
      title = "Unknown code";
      sub = `No project matches “${esc(((_res$parsed = res.parsed) === null || _res$parsed === void 0 ? void 0 : _res$parsed.partCode) || ((_res$parsed2 = res.parsed) === null || _res$parsed2 === void 0 ? void 0 : _res$parsed2.project) || "")}”`;
    } else {
      ico = "alert";
      title = "No station";
      sub = "Pick a station first";
    }
    el.className = `scan-status ${cls} flash`;
    el.innerHTML = `<div class="scan-status-ico">${icon(ico, 54, "", 1.5)}</div>
      <div class="scan-status-title">${title}</div>
      <div class="scan-status-sub">${sub}</div>
      ${item && ["ok", "opDone"].includes(res.status) ? `<div class="scan-status-bar"><div class="progress ${res.qtyDone >= item.qty ? "done" : ""}" style="width:220px"><i style="width:${Math.round((res.qtyDone || item.qty) / item.qty * 100)}%"></i></div></div>` : ""}`;
    setTimeout(() => {
      if ($("#scan-status") === el) el.classList.remove("flash");
    }, 500);
    var rec = $("#scan-recent");
    if (rec) rec.innerHTML = this.recentHtml();
    var badge = $(".scan-progress-badge");
    if (badge) {
      var s = D.stationScanStats(this.stationId);
      badge.innerHTML = `<b class="t-num">${s.done}/${s.total}</b><span>pcs · ${s.total ? Math.round(s.done / s.total * 100) : 0}%</span>`;
    }
  },
  /* ---------- feedback beep ---------- */
  beep(kind) {
    try {
      this._ac = this._ac || new (window.AudioContext || window.webkitAudioContext)();
      var ac = this._ac,
        t = ac.currentTime;
      var tone = (f, s, d, g = 0.14) => {
        var o = ac.createOscillator(),
          ga = ac.createGain();
        o.type = "sine";
        o.frequency.value = f;
        o.connect(ga);
        ga.connect(ac.destination);
        ga.gain.setValueAtTime(g, t + s);
        ga.gain.exponentialRampToValueAtTime(0.001, t + s + d);
        o.start(t + s);
        o.stop(t + s + d);
      };
      if (kind === "ok") {
        tone(880, 0, 0.09);
        tone(1320, 0.08, 0.11);
      } else if (kind === "done") {
        tone(880, 0, 0.08);
        tone(1174, 0.09, 0.08);
        tone(1568, 0.18, 0.16);
      } else if (kind === "warn") {
        tone(440, 0, 0.18, 0.11);
      } else {
        tone(180, 0, 0.3, 0.16);
      }
    } catch (e) {/* audio may be blocked until a user gesture */}
  },
  /* ---------- camera (BarcodeDetector) ---------- */
  startCamera() {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _$, v, _loop;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if ("BarcodeDetector" in window) {
              _context2.next = 3;
              break;
            }
            Toast.show("This browser has no built-in QR reader — use a USB/Bluetooth scanner", {
              emoji: "camera",
              ms: 4800
            });
            return _context2.abrupt("return");
          case 3:
            _context2.prev = 3;
            _this._det = _this._det || new window.BarcodeDetector({
              formats: ["qr_code", "data_matrix", "code_128", "code_39", "ean_13"]
            });
            _context2.next = 7;
            return navigator.mediaDevices.getUserMedia({
              video: {
                facingMode: "environment"
              }
            });
          case 7:
            _this._stream = _context2.sent;
            v = $("#scan-video");
            v.srcObject = _this._stream;
            _context2.next = 12;
            return v.play();
          case 12:
            v.classList.remove("hide");
            _this.camera = true;
            (_$ = $("#scan-cam-btn")) === null || _$ === void 0 || _$.classList.add("active");
            _loop = /*#__PURE__*/function () {
              var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
                var codes;
                return _regeneratorRuntime().wrap(function _callee$(_context) {
                  while (1) switch (_context.prev = _context.next) {
                    case 0:
                      if (_this.camera) {
                        _context.next = 2;
                        break;
                      }
                      return _context.abrupt("return");
                    case 2:
                      _context.prev = 2;
                      _context.next = 5;
                      return _this._det.detect(v);
                    case 5:
                      codes = _context.sent;
                      if (codes && codes[0]) _this.onScan(codes[0].rawValue);
                      _context.next = 11;
                      break;
                    case 9:
                      _context.prev = 9;
                      _context.t0 = _context["catch"](2);
                    case 11:
                      _this._raf = requestAnimationFrame(_loop);
                    case 12:
                    case "end":
                      return _context.stop();
                  }
                }, _callee, null, [[2, 9]]);
              }));
              return function loop() {
                return _ref3.apply(this, arguments);
              };
            }();
            _this._raf = requestAnimationFrame(_loop);
            _context2.next = 22;
            break;
          case 19:
            _context2.prev = 19;
            _context2.t0 = _context2["catch"](3);
            Toast.show("Camera unavailable — check permissions", {
              emoji: "alert"
            });
          case 22:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[3, 19]]);
    }))();
  },
  stopCamera() {
    var _$2, _$3;
    this.camera = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this._stream) this._stream.getTracks().forEach(t => t.stop());
    this._stream = null;
    (_$2 = $("#scan-video")) === null || _$2 === void 0 || _$2.classList.add("hide");
    (_$3 = $("#scan-cam-btn")) === null || _$3 === void 0 || _$3.classList.remove("active");
    var cap = $("#scan-capture");
    if (cap) cap.focus();
  }
};