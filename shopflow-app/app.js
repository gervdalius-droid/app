/* ============================================================
   ShopFlow — App core
   Session, PIN login, shell, router, toasts, modals, palette.
   ============================================================ */
"use strict";

/* ---------- Tiny DOM + format utils ---------- */
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _toArray(r) { return _arrayWithHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableRest(); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var $ = (sel, el = document) => el.querySelector(sel);
var $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
var esc = s => String(s !== null && s !== void 0 ? s : "").replace(/[&<>"']/g, c => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
})[c]);
function isLT() {
  return typeof I18N !== "undefined" && I18N.lang === "lt";
}
function fmtDate(ts) {
  return new Date(ts).toLocaleDateString(isLT() ? "lt-LT" : "en-US", {
    month: "short",
    day: "numeric"
  });
}
function fmtDue(ts) {
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  var d = new Date(ts);
  d.setHours(0, 0, 0, 0);
  var diff = Math.round((d - today) / DAY);
  var lt = isLT();
  if (diff < -1) return {
    cls: "overdue",
    label: lt ? `Vėluoja ${-diff} d.` : `${-diff}d overdue`
  };
  if (diff === -1) return {
    cls: "overdue",
    label: lt ? "Vėluoja 1 d." : "1d overdue"
  };
  if (diff === 0) return {
    cls: "today",
    label: lt ? "Šiandien" : "Due today"
  };
  if (diff === 1) return {
    cls: "soon",
    label: lt ? "Rytoj" : "Due tomorrow"
  };
  if (diff <= 4) return {
    cls: "soon",
    label: lt ? `Po ${diff} d.` : `Due in ${diff}d`
  };
  return {
    cls: "",
    label: (lt ? "Iki " : "Due ") + fmtDate(ts)
  };
}
function fmtDur(ms) {
  var m = Math.floor(ms / 60000);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;
}
function fmtClock(ms) {
  var s = Math.floor(ms / 1000);
  var hh = Math.floor(s / 3600),
    mm = Math.floor(s % 3600 / 60),
    ss = s % 60;
  return (hh ? hh + ":" : "") + String(mm).padStart(2, "0") + ":" + String(ss).padStart(2, "0");
}
function fmtAgo(ts) {
  var s = Math.floor((Date.now() - ts) / 1000);
  var lt = isLT();
  if (s < 60) return lt ? "ką tik" : "just now";
  if (s < 3600) return lt ? `prieš ${Math.floor(s / 60)} min.` : Math.floor(s / 60) + "m ago";
  if (s < 86400) return lt ? `prieš ${Math.floor(s / 3600)} val.` : Math.floor(s / 3600) + "h ago";
  return lt ? `prieš ${Math.floor(s / 86400)} d.` : Math.floor(s / 86400) + "d ago";
}
function initials(name) {
  return name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
}
function avatarHtml(member, size = "md") {
  if (!member) return `<span class="avatar ${size}" style="--av-c1:#aeaeb2;--av-c2:#8e8e93">?</span>`;
  var _AV_COLORS = _slicedToArray(AV_COLORS[member.color % AV_COLORS.length], 2),
    c1 = _AV_COLORS[0],
    c2 = _AV_COLORS[1];
  return `<span class="avatar ${size}" style="--av-c1:${c1};--av-c2:${c2}" title="${esc(member.name)}">${esc(initials(member.name))}</span>`;
}
function pillHtml(status, label) {
  return `<span class="pill ${status}"><span class="dot"></span>${esc(label || D.statusLabel[status] || status)}</span>`;
}
function prioHtml(p) {
  var labels = {
    rush: "Rush",
    high: "High",
    normal: "Normal",
    low: "Low"
  };
  if (p === "normal") return "";
  return `<span class="prio ${p}">${prioIcon(p)} ${labels[p]}</span>`;
}
function stepsMini(order) {
  var shown = order.ops.slice(0, 14);
  return `<span class="steps-mini">${shown.map(op => {
    var _D$station;
    return `<i class="${op.status}" title="${esc(((_D$station = D.station(op.stationId)) === null || _D$station === void 0 ? void 0 : _D$station.name) || "")}"></i>`;
  }).join("")}${order.ops.length > 14 ? `<span class="t-caption" style="font-size:10px">+${order.ops.length - 14}</span>` : ""}</span>`;
}
function activityHtml(text) {
  return esc(text).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
}

/* ============================================================
   App
   ============================================================ */
var App = {
  me: null,
  // logged-in member
  view: "dashboard",
  // current manager view
  viewParams: {},
  workerTab: "my",
  // worker mode tab
  _tick: null,
  /* role helpers — managers + engineers use the cockpit; only they see engineering */
  isManager() {
    return this.me && this.me.role === "manager";
  },
  isEngineer() {
    return this.me && this.me.role === "engineer";
  },
  isWorker() {
    return this.me && this.me.role === "worker";
  },
  seesEng() {
    return this.me && (this.me.role === "manager" || this.me.role === "engineer");
  },
  /* Can I do this? Everyone shares one cockpit; roles differ in what they
     may CHANGE, and a manager decides that in Settings → Permissions. */
  can(cap) {
    return !!this.me && D.roleCan(this.me.role, cap);
  },
  /* ---- which shell ----
     Everybody gets the cockpit now. "Bench mode" is the big-button tablet
     screen, kept for the shopfloor: a per-device choice (a shared tablet
     should stay in bench mode whoever signs in), never a role. */
  /* stamped into index.html by tools/deploy-pages.sh; "dev" when served raw */
  build() {
    var m = document.querySelector('meta[name="shopflow-build"]');
    return m && m.content || "dev";
  },
  BENCH_KEY: "shopflow.bench",
  benchMode() {
    return localStorage.getItem(this.BENCH_KEY) === "1";
  },
  setBenchMode(on) {
    on ? localStorage.setItem(this.BENCH_KEY, "1") : localStorage.removeItem(this.BENCH_KEY);
    if (!on && !this.usesCockpit()) this.view = "mywork";
    if (on) this.workerTab = "my";
    this._html = null; // shell changes wholesale
    Router.replace();
    this.render();
  },
  usesCockpit() {
    return !!this.me && !this.benchMode();
  },
  boot() {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var savedTheme, p, devHost, as, m, sid, stn, o, settle, adopt, chan;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (typeof I18N !== "undefined") I18N.boot(); // localization: watch renders, translate UI chrome
            _context2.next = 3;
            return Store.boot();
          case 3:
            // the vault, falling back to localStorage
            // theme
            savedTheme = localStorage.getItem("shopflow.theme") || "auto";
            _this.applyTheme(savedTheme);

            // Auto-login (dev/demo only): ?as=… bypasses the PIN, so honour it only on
            // localhost / file:// — never when the app is actually hosted for the shop.
            p = new URLSearchParams(location.search);
            if (p.get("theme")) _this.applyTheme(p.get("theme"));
            devHost = ["localhost", "127.0.0.1", "", "[::1]"].includes(location.hostname) || location.protocol === "file:";
            as = devHost ? p.get("as") : null;
            if (as) {
              _this._localOnly = true; // local dev (?as= on localhost): run fully offline, never touch the shop's cloud
              m = Store.state.members.find(x => x.name.toLowerCase() === as.toLowerCase() || as === "manager" && x.role === "manager" || as === "engineer" && x.role === "engineer" || as === "worker" && x.role === "worker");
              if (m) _this.me = m;
              if (p.get("view")) _this.view = p.get("view");
              if (p.get("tab")) {
                _this.workerTab = p.get("tab");
                _this.viewParams.tab = p.get("tab");
              }
              if (p.get("scope")) _this.viewParams.scope = p.get("scope");
            } else {
              sid = sessionStorage.getItem("shopflow.session");
              if (sid) _this.me = D.member(sid);
            }
            // Scan-station kiosk deep link: ?scan=<stationId> (works for any signed-in user)
            if (_this.me && p.get("scan") && typeof ScanStation !== "undefined") {
              _this.view = "scan";
              stn = D.station(p.get("scan"));
              ScanStation.stationId = stn ? stn.id : null;
            }
            _this._notifSeenTs = Date.now(); // baseline: existing notifications show as badge, not toast
            // if cloud sync is configured, show the connecting gate immediately (no PIN-picker flash)
            if (typeof Sync !== "undefined" && Sync.configured() && !_this._localOnly) Sync.checking = true;
            _this.render();
            if (_this.me && p.get("order")) {
              o = Store.state.orders.find(x => x.id === p.get("order") || x.num === p.get("order"));
              if (o) Drawer.open(o.id);
            }
            M.sweepClocks(); // settle runs that went quiet while away
            _this._tick = setInterval(() => _this.tickTimers(), 1000);
            _this._sweep = setInterval(() => {
              if (M.sweepClocks()) _this.render();
            }, 60000);
            _this._bindPointerGuard();
            Router.boot();
            Offline.boot(); // cache the shell; keep working without a network
            if (typeof Bridge !== "undefined") Bridge.boot(); // shared customers + document index (optional)
            if (typeof Files !== "undefined") Files.boot(); // retry any attachment that never uploaded

            document.addEventListener("keydown", e => {
              if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                _this.me && Palette.toggle();
              }
              if (e.key === "Escape") {
                Palette.close();
                Modal.close();
                Drawer.close();
                Popover.close();
                MyWork.close();
              }
            });

            /* Nothing in flight may be lost because a tab was closed or a tablet was
               pocketed. Both events fire; flush() is a no-op when nothing is dirty. */
            settle = () => {
              Store.flush();
            };
            window.addEventListener("pagehide", settle);
            document.addEventListener("visibilitychange", () => {
              if (document.hidden) settle();
            });

            /* Live sync between open tabs/windows: another tab saved → adopt its state.
               The vault raises no storage event, so tabs tell each other directly; the
               storage listener stays for the localStorage fallback path. */
            adopt = next => {
              var _document$activeEleme, _document$activeEleme2;
              var typing = typeof WB !== "undefined" && WB.editingId || ((_document$activeEleme = document.activeElement) === null || _document$activeEleme === void 0 ? void 0 : _document$activeEleme.isContentEditable) || /^(INPUT|TEXTAREA)$/.test(((_document$activeEleme2 = document.activeElement) === null || _document$activeEleme2 === void 0 ? void 0 : _document$activeEleme2.tagName) || "");
              Store.state = next;
              if (typeof Notif !== "undefined") Notif.flushLive(); // toast/desktop-alert new arrivals
              if (!typing) _this.render();
            };
            window.addEventListener("storage", ev => {
              if (ev.key !== DB_KEY || !ev.newValue) return;
              try {
                adopt(JSON.parse(ev.newValue));
              } catch (_) {}
            });
            if (typeof BroadcastChannel !== "undefined") {
              chan = new BroadcastChannel("shopflow");
              chan.onmessage = /*#__PURE__*/function () {
                var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee(ev) {
                  var raw;
                  return _regeneratorRuntime().wrap(function _callee$(_context) {
                    while (1) switch (_context.prev = _context.next) {
                      case 0:
                        if (!(!ev.data || ev.data.t !== "doc" || Store._dirty || Store._flushing)) {
                          _context.next = 2;
                          break;
                        }
                        return _context.abrupt("return");
                      case 2:
                        _context.prev = 2;
                        _context.next = 5;
                        return Vault.get("doc");
                      case 5:
                        raw = _context.sent;
                        if (raw) adopt(JSON.parse(raw));
                        _context.next = 11;
                        break;
                      case 9:
                        _context.prev = 9;
                        _context.t0 = _context["catch"](2);
                      case 11:
                      case "end":
                        return _context.stop();
                    }
                  }, _callee, null, [[2, 9]]);
                }));
                return function (_x) {
                  return _ref.apply(this, arguments);
                };
              }();
            }

            // Cloud sync — no-op unless sync-config.js provides SYNC_CONFIG
            if (typeof Sync !== "undefined" && !_this._localOnly) Sync.init();
          case 31:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  applyTheme(mode) {
    localStorage.setItem("shopflow.theme", mode);
    var dark = mode === "dark" || mode === "auto" && matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
  },
  login(member) {
    this.me = member;
    this._notifSeenTs = Date.now(); // only genuinely new notifications toast; existing show as a badge
    sessionStorage.setItem("shopflow.session", member.id);
    // workers land on their own work; everyone else on the dashboard. ("my" is
    // the bench tab id — the cockpit page is "mywork".)
    this.view = member.role === "worker" ? this.benchMode() ? "my" : "mywork" : "dashboard";
    // shared-tablet hygiene: don't inherit the previous worker's tab/station
    this.workerTab = "my";
    if (typeof Wkr !== "undefined") Wkr.station = null;
    this.render();
    Router.replace();
  },
  logout() {
    this.me = null;
    sessionStorage.removeItem("shopflow.session");
    Drawer.close(true);
    Modal.close(true);
    Palette.close();
    this.render();
  },
  navigate(view, params = {}) {
    this.view = view;
    this.viewParams = params;
    Router.push();
    this.render();
  },
  /* ---- render plumbing: never yank the DOM out from under a finger ----
     A full re-render replaces #app wholesale, so any button the user is
     pressing is destroyed mid-tap and the click never fires — that is the
     "press Complete twice" bug. Renders that arrive while a pointer is down
     (cloud echo, another tab, another device) are queued and flushed after
     the click has been dispatched. */
  _pointerDown: false,
  _pointerAt: 0,
  _renderQueued: false,
  _html: null,
  moreOpen: false,
  // phone: the "More" navigation sheet

  _bindPointerGuard() {
    var down = () => {
      this._pointerDown = true;
      this._pointerAt = Date.now();
    };
    // release AFTER the click has been dispatched, otherwise the flush
    // destroys the button between pointerup and click — the same bug again
    var up = () => {
      this._pointerDown = false;
      setTimeout(() => {
        if (!this._pointerDown && this._renderQueued) this.render();
      }, 0);
    };
    document.addEventListener("pointerdown", down, true);
    ["pointerup", "pointercancel", "dragend", "drop"].forEach(ev => document.addEventListener(ev, up, true));
    window.addEventListener("blur", up);
  },
  /* scroll containers survive the innerHTML swap — a queue that jumps back
     to the top on every tap reads as flicker and loses the worker's place */
  _SCROLLERS: ".content,.worker-body,.board-wrap,.board-col-cards,.projects-body,.tl-scroll,.scan-recent",
  _snapScroll(root) {
    var m = new Map();
    $$(this._SCROLLERS, root).forEach((el, i) => {
      if (el.scrollTop || el.scrollLeft) m.set(i + "|" + el.className, [el.scrollTop, el.scrollLeft]);
    });
    return m;
  },
  _restoreScroll(root, m) {
    if (!m.size) return;
    $$(this._SCROLLERS, root).forEach((el, i) => {
      var v = m.get(i + "|" + el.className);
      if (!v) return;
      var prev = el.style.scrollBehavior;
      el.style.scrollBehavior = "auto"; // .content animates otherwise
      el.scrollTop = v[0];
      el.scrollLeft = v[1];
      el.style.scrollBehavior = prev;
    });
  },
  /* Re-render everything (state changed) */
  render() {
    // mid-tap: hold the rebuild until the finger lifts (2s ceiling so a
    // swallowed pointerup can never freeze the UI)
    if (this._pointerDown && Date.now() - this._pointerAt < 2000) {
      this._renderQueued = true;
      return;
    }
    this._pointerDown = false;
    this._renderQueued = false;

    // a cloud/cross-tab sync swaps Store.state wholesale, which leaves me
    // pointing at the previous state's member object — re-resolve it
    if (this.me) {
      var m = D.member(this.me.id);
      if (m) this.me = m;
    }
    var root = $("#app");
    // cloud shop-login gate: when sync is on but this device isn't signed in yet
    if (typeof Sync !== "undefined" && !App._localOnly && Sync.needsGate()) {
      this._html = null;
      root.innerHTML = Sync.gateHtml();
      Sync.bindGate(root);
      return;
    }
    var html, view;
    if (!this.me) {
      html = Login.html();
      view = Login;
    } else if (this.usesCockpit()) {
      html = Mgr.shell();
      view = Mgr;
    } else {
      html = Wkr.shell();
      view = Wkr;
    }

    // identical output → leave the live DOM (and its handlers, scroll and
    // ticking timers) exactly where it is. Kills every redundant repaint.
    if (html !== this._html || !root.firstElementChild) {
      var scroll = this._snapScroll(root);
      root.innerHTML = html;
      this._html = html;
      view.bind(root);
      this._restoreScroll(root, scroll);
    }
    if (typeof GPM !== "undefined" && this.view !== "planner" && GPM.taskId) GPM.closeTask();
    if (typeof Router !== "undefined") Router.sync();
    Drawer.refresh();
    if (typeof MyWork !== "undefined") MyWork.paint(); // floats above every view, in both shells
  },
  /* Completing is one tap now. Swallow the reflex second tap people learned
     to give, so it can't land on the next task's button after the re-render. */
  _lastDone: 0,
  tapGuard(ms = 450) {
    var now = Date.now();
    if (now - this._lastDone < ms) return false;
    this._lastDone = now;
    return true;
  },
  /* Light-touch: update visible timers without re-rendering */
  tickTimers() {
    // refresh the login lock countdown (and re-enable the pad when it expires)
    if (!this.me && Login.selected && (Login.lockUntil[Login.selected.id] || 0) > Date.now() - 1500) {
      if ($(".pin-stage")) {
        this.render();
        return;
      }
    }
    $$("[data-timer]").forEach(el => {
      var _el$dataset$timer$spl = el.dataset.timer.split("/"),
        _el$dataset$timer$spl2 = _slicedToArray(_el$dataset$timer$spl, 2),
        orderId = _el$dataset$timer$spl2[0],
        opId = _el$dataset$timer$spl2[1];
      var o = D.order(orderId);
      if (!o) return;
      var op = o.ops.find(x => x.id === opId);
      if (!op) return;
      var style = el.dataset.timerStyle || "clock";
      el.textContent = style === "clock" ? fmtClock(D.opElapsed(op)) : fmtDur(D.opElapsed(op));
    });
  }
};

/* ============================================================
   Router — the browser Back button belongs to the app
   A shopfloor tablet's Back gesture should step back through the
   app (close the drawer, return to the previous view), not walk
   off the site. Views live in the hash so a refresh keeps your
   place, which also means no server-side routes to configure.
   ============================================================ */
var Router = {
  _applying: false,
  snapshot() {
    return {
      view: App.view,
      params: App.viewParams || {},
      tab: App.workerTab,
      station: typeof Wkr !== "undefined" ? Wkr.station : null,
      gp: typeof GPM !== "undefined" ? GPM.openId : null,
      gtab: typeof GPM !== "undefined" ? GPM.tab : null,
      ptab: typeof Mgr !== "undefined" ? Mgr.projectsTab : null
    };
  },
  hash() {
    var st = this.snapshot();
    var parts = [App.usesCockpit() ? st.view : "w-" + (st.tab || "my")];
    if (st.view === "planner" && st.gp) parts.push(st.gp);
    if (st.view === "projects" && st.ptab) parts.push(st.ptab);
    return "#" + parts.join("/");
  },
  /* Browsers throttle history writes (Chrome ~100/10s); a burst of navigation
     must never take the app down with it. */
  _safe(fn) {
    try {
      fn();
    } catch (e) {/* rate-limited — the view still renders */}
  },
  /* Replace, don't grow: same destination shouldn't stack duplicates */
  push() {
    if (this._applying || !App.me) return;
    var h = this.hash();
    this._safe(() => location.hash === h ? history.replaceState(this.snapshot(), "", h) : history.pushState(this.snapshot(), "", h));
  },
  replace() {
    if (this._applying || !App.me) return;
    this._safe(() => history.replaceState(this.snapshot(), "", this.hash()));
  },
  /* Keep the URL honest after any state change, without growing history.
     Guarded on an actual change — browsers rate-limit replaceState. */
  sync() {
    if (this._applying || !App.me) return;
    if (location.hash !== this.hash()) this.replace();
  },
  /* Any transient layer the Back gesture should dismiss first */
  topOverlay() {
    if ($("#pop-root")) return () => Popover.close();
    if (Palette.isOpen) return () => Palette.close();
    if ($(".modal-scrim", $("#modal-root"))) return () => Modal.close();
    if (App.moreOpen) return () => {
      App.moreOpen = false;
      App.render();
    };
    if (typeof GPM !== "undefined" && GPM.taskId) return () => {
      GPM.closeTask();
      App.render();
    };
    if (Drawer.orderId) return () => Drawer.close();
    return null;
  },
  apply(state) {
    if (!state) return;
    this._applying = true;
    try {
      App.view = state.view || App.view;
      App.viewParams = state.params || {};
      if (state.tab) App.workerTab = state.tab;
      if (typeof Wkr !== "undefined" && state.station !== undefined) Wkr.station = state.station;
      if (typeof GPM !== "undefined") {
        if (state.gp !== undefined) GPM.openId = state.gp;
        if (state.gtab) GPM.tab = state.gtab;
      }
      if (typeof Mgr !== "undefined" && state.ptab) Mgr.projectsTab = state.ptab;
      App.render();
    } finally {
      this._applying = false;
    }
  },
  /* Read a view out of the URL on a cold load / refresh */
  fromHash() {
    var h = decodeURIComponent(location.hash || "").replace(/^#/, "");
    if (!h) return null;
    var _h$split = h.split("/"),
      _h$split2 = _toArray(_h$split),
      head = _h$split2[0],
      rest = _h$split2.slice(1);
    if (head.startsWith("w-")) return {
      tab: head.slice(2)
    };
    var st = {
      view: head,
      params: {}
    };
    if (head === "planner" && rest[0]) st.gp = rest[0];
    if (head === "projects" && rest[0]) st.ptab = rest[0];
    return st;
  },
  boot() {
    var fromUrl = this.fromHash();
    if (fromUrl && App.me) {
      // a refresh should land where you were, not on the dashboard
      if (fromUrl.view && App.usesCockpit()) {
        App.view = fromUrl.view;
        if (fromUrl.ptab) Mgr.projectsTab = fromUrl.ptab;
        if (fromUrl.gp) GPM.openId = fromUrl.gp;
      }
      if (fromUrl.tab && !App.usesCockpit()) App.workerTab = fromUrl.tab;
      App.render();
    }
    this.replace(); // own the first entry

    window.addEventListener("popstate", ev => {
      // Back closes what's on top first — drawer, modal, popover — and puts
      // the entry back so the user's history depth is unchanged
      var close = this.topOverlay();
      if (close) {
        close();
        this._safe(() => history.pushState(this.snapshot(), "", this.hash()));
        return;
      }
      if (ev.state) this.apply(ev.state);else this.apply(this.fromHash() || this.snapshot());
    });
  }
};

/* ============================================================
   Mentions — type "@" in a comment box to address a teammate
   Names are resolved to member ids when the comment is posted
   (D.parseMentions), so the stored text stays readable and a
   rename can't orphan a thread. This is only the typing aid.
   ============================================================ */
var Mentions = {
  /* Wire an <input>/<textarea>. onSubmit runs on Enter (unless picking). */
  attach(input, onSubmit) {
    if (!input || input._mentions) return;
    input._mentions = true;
    var menu = null,
      items = [],
      sel = 0,
      from = -1;
    var close = () => {
      if (menu) menu.remove();
      menu = null;
      items = [];
      from = -1;
    };

    /* the "@word" being typed immediately before the caret, if any */
    var token = () => {
      var _input$selectionStart;
      var pos = (_input$selectionStart = input.selectionStart) !== null && _input$selectionStart !== void 0 ? _input$selectionStart : input.value.length;
      var before = input.value.slice(0, pos);
      var m = before.match(/(^|[\t-\r \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF])@((?:[\x2D\.0-9A-Z_a-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDD40-\uDD65\uDD6F-\uDD85\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDED0-\uDEE3\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0\uDFF0-\uDFF9]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D\uDD30-\uDD39]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDD70-\uDD79\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD833[\uDCF0-\uDCF9]|\uD834[\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDCD0-\uDCEB\uDCF0-\uDCF9\uDDD0-\uDDED\uDDF0-\uDDFA\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])*)$/);
      return m ? {
        start: pos - m[2].length - 1,
        query: m[2]
      } : null;
    };
    var paint = () => {
      var t = token();
      if (!t) return close();
      items = D.mentionCandidates(t.query);
      if (!items.length) return close();
      from = t.start;
      if (!menu) {
        menu = document.createElement("div");
        menu.className = "mention-menu";
        document.body.appendChild(menu);
      }
      sel = Math.min(sel, items.length - 1);
      menu.innerHTML = items.map((m, i) => `<button class="${i === sel ? "on" : ""}" data-mi="${i}">
        ${avatarHtml(m, "sm")}<span class="grow"><b>${esc(m.name)}</b><span>${esc(m.role || "")}</span></span></button>`).join("");
      var r = input.getBoundingClientRect();
      menu.style.left = Math.max(8, Math.min(r.left, innerWidth - 250)) + "px";
      menu.style.width = Math.min(Math.max(r.width, 220), 320) + "px";
      // above the field when there's no room below (worker tablets, keyboard up)
      var h = menu.offsetHeight || 180;
      menu.style.top = (r.bottom + h + 12 > innerHeight ? Math.max(8, r.top - h - 6) : r.bottom + 6) + "px";
      $$("[data-mi]", menu).forEach(b => b.onmousedown = e => {
        e.preventDefault();
        pick(+b.dataset.mi);
      });
    };
    var pick = i => {
      var _input$selectionStart2;
      var m = items[i];
      if (!m || from < 0) return;
      var pos = (_input$selectionStart2 = input.selectionStart) !== null && _input$selectionStart2 !== void 0 ? _input$selectionStart2 : input.value.length;
      input.value = input.value.slice(0, from) + "@" + m.name + " " + input.value.slice(pos);
      var caret = from + m.name.length + 2;
      close();
      input.focus();
      input.setSelectionRange(caret, caret);
    };
    input.addEventListener("input", paint);
    input.addEventListener("blur", () => setTimeout(close, 120));
    input.addEventListener("keydown", e => {
      if (menu && items.length) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          sel = (sel + 1) % items.length;
          paint();
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          sel = (sel - 1 + items.length) % items.length;
          paint();
          return;
        }
        if (e.key === "Enter" || e.key === "Tab") {
          e.preventDefault();
          e.stopImmediatePropagation();
          pick(sel);
          return;
        }
        if (e.key === "Escape") {
          e.preventDefault();
          close();
          return;
        }
      }
      if (e.key === "Enter" && onSubmit) {
        e.preventDefault();
        close();
        onSubmit();
      }
    });
  }
};

/* A timer that has stopped because the shop is shut needs to say so, or it
   reads as broken. Returns nothing during working hours. */
function offShiftHtml(compact) {
  if (typeof D === "undefined" || D.isWorkingNow()) return "";
  var d = new Date();
  var why = !D.isWorkingDay(d) ? I18N.t("Not a working day") : d.getHours() * 60 + d.getMinutes() < hhmm(D.shift().start) || d.getHours() * 60 + d.getMinutes() >= hhmm(D.shift().end) ? I18N.t("Outside working hours") : I18N.t("On a break");
  return `<span class="off-shift" title="${I18N.t("Time is only counted during working hours")}">
    ${icon("clock", 12)} ${esc(why)}${compact ? "" : ` · ${I18N.t("not counting")}`}</span>`;
}

/* Comment body: bold markers, then every @teammate we know highlighted. */
/* Built from the single scan rather than by replacing one name at a time —
   replacing wrapped "@Mantas" a second time INSIDE the "@Mantas Projektavimas"
   pill it had just made, which is why the highlight broke across the name. */
function commentHtml(text) {
  var hits = D.scanMentions(text);
  if (!hits.length) return activityHtml(text);
  var out = "",
    at = 0;
  var _iterator = _createForOfIteratorHelper(hits),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var h = _step.value;
      out += activityHtml(text.slice(at, h.start));
      out += `<span class="mention">@${esc(h.member.name)}</span>`;
      at = h.end;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return out + activityHtml(text.slice(at));
}

/* One comment row — shared by the order drawer and Planner tasks. */
function commentRowHtml(c, {
  canDelete
} = {}) {
  var who = D.member(c.by);
  return `<div class="ocomment">${avatarHtml(who, "sm")}
    <div class="grow">
      <div class="oc-head"><b>${esc(who ? who.name : "?")}</b><span class="when">${fmtAgo(c.ts)}</span>
        ${canDelete ? `<button class="icon-btn tiny" data-oc-del="${c.id}" title="Delete comment">${icon("trash", 12)}</button>` : ""}</div>
      <div class="oc-body">${commentHtml(c.text)}</div>
    </div></div>`;
}

/* ============================================================
   Login (profile grid → PIN pad)
   ============================================================ */
var Login = {
  selected: null,
  entered: "",
  html() {
    var s = Store.state;
    if (!this.selected) {
      return `<div class="login-screen">
        <div class="login-logo">
          <div class="mark" style="color:var(--accent)">${icon("logo", 52, "", 1.6)}</div>
          <h1>ShopFlow</h1>
          <p>Who's working?</p>
        </div>
        <div class="profiles">
          ${s.members.map(m => `
            <button class="profile" data-id="${m.id}">
              ${avatarHtml(m, "xl")}
              <span class="name">${esc(m.name)}</span>
              <span class="role">${esc(m.trade)}</span>
            </button>`).join("")}
        </div>
        <div class="login-foot">ShopFlow</div>
      </div>`;
    }
    var m = this.selected;
    var locked = this.isLocked(m.id);
    var secs = locked ? Math.ceil((this.lockUntil[m.id] - Date.now()) / 1000) : 0;
    var triesLeft = this.MAX_FAILS - (this.fails[m.id] || 0);
    return `<div class="login-screen">
      <div class="pin-stage">
        <div class="pin-user">
          ${avatarHtml(m, "xl")}
          <div class="name">${esc(m.name)}</div>
          <div class="hint">${locked ? `Too many attempts — try again in ${secs}s` : this.fails[m.id] ? `Wrong PIN · ${triesLeft} ${triesLeft === 1 ? "try" : "tries"} left` : "Enter your PIN"}</div>
        </div>
        <div class="pin-dots ${locked ? "error" : ""}" id="pin-dots">${[0, 1, 2, 3].map(i => `<i class="${i < this.entered.length ? "filled" : ""}"></i>`).join("")}</div>
        <div class="pin-pad ${locked ? "locked" : ""}">
          ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="pin-key" data-k="${n}" ${locked ? "disabled" : ""}>${n}</button>`).join("")}
          <button class="pin-key soft" data-k="back">Back</button>
          <button class="pin-key" data-k="0" ${locked ? "disabled" : ""}>0</button>
          <button class="pin-key soft" data-k="del" ${locked ? "disabled" : ""}>⌫</button>
        </div>
      </div>
    </div>`;
  },
  fails: {},
  // per-member wrong-attempt count
  lockUntil: {},
  // per-member lock expiry (ms)
  MAX_FAILS: 5,
  LOCK_MS: 30000,
  bind(root) {
    $$(".profile", root).forEach(b => b.onclick = () => {
      this.selected = D.member(b.dataset.id);
      this.entered = "";
      App.render();
    });
    $$(".pin-key", root).forEach(b => b.onclick = () => this.key(b.dataset.k));
    if (this.selected) {
      this._kb = e => {
        if (/^[0-9]$/.test(e.key)) this.key(e.key);
        if (e.key === "Backspace") this.key("del");
        if (e.key === "Escape") this.key("back");
      };
      document.addEventListener("keydown", this._kb, {
        once: false
      });
    }
  },
  isLocked(id) {
    return (this.lockUntil[id] || 0) > Date.now();
  },
  key(k) {
    if (k === "back") {
      this.selected = null;
      this.entered = "";
      this._unbindKb();
      App.render();
      return;
    }
    if (this.selected && this.isLocked(this.selected.id)) return; // locked out
    if (k === "del") {
      this.entered = this.entered.slice(0, -1);
      this._paint();
      return;
    }
    if (this.entered.length >= 4) return;
    this.entered += k;
    this._paint();
    if (this.entered.length === 4) {
      var m = this.selected;
      if (M.verifyPin(m.id, this.entered)) {
        this.fails[m.id] = 0;
        this.selected = null;
        this.entered = "";
        this._unbindKb();
        App.login(m);
      } else {
        this.fails[m.id] = (this.fails[m.id] || 0) + 1;
        var dots = $("#pin-dots");
        if (dots) dots.classList.add("error");
        if (this.fails[m.id] >= this.MAX_FAILS) {
          this.lockUntil[m.id] = Date.now() + this.LOCK_MS;
          setTimeout(() => {
            this.entered = "";
            App.render();
          }, 600);
        } else {
          setTimeout(() => {
            this.entered = "";
            if (dots) dots.classList.remove("error");
            this._paint();
          }, 600);
        }
      }
    }
  },
  _paint() {
    var dots = $("#pin-dots");
    if (!dots) return;
    $$("i", dots).forEach((el, i) => el.classList.toggle("filled", i < this.entered.length));
  },
  _unbindKb() {
    if (this._kb) {
      document.removeEventListener("keydown", this._kb);
      this._kb = null;
    }
  }
};

/* ============================================================
   Toasts
   ============================================================ */
var Toast = {
  /* legacy emoji → icon so every toast matches the vector icon system */
  ICON_MAP: {
    "✓": "check",
    "✅": "check-circle",
    "🎉": "check-circle",
    "•": "info",
    "🔢": "info",
    "⚠️": "alert",
    "🚫": "ban",
    "🤔": "info",
    "⏳": "clock",
    "📉": "trend-down",
    "🚚": "truck",
    "📦": "box",
    "🏬": "warehouse",
    "📤": "arrow-up",
    "🗑": "trash",
    "📅": "calendar",
    "🗓": "calendar",
    "✦": "sparkles",
    "👋": "users",
    "🧠": "brain",
    "▶️": "play",
    "⏸": "pause",
    "💪": "check",
    "🗄": "archive",
    "😴": "zzz"
  },
  /* `undo` is usually an undo, but not always — an export offers to open the
     folder it went to. A button that does one thing and says another is worse
     than no button, so the label travels with the action. */
  show(msg, {
    emoji = "",
    undo = null,
    undoLabel = "Undo",
    ms = 3200
  } = {}) {
    var root = $("#toast-root");
    var el = document.createElement("div");
    el.className = "toast";
    var ic = this.ICON_MAP[emoji] || (/^[a-z-]+$/.test(emoji) ? emoji : null);
    var lead = ic ? `<span class="emoji">${icon(ic, 15)}</span>` : emoji ? `<span class="emoji">${emoji}</span>` : "";
    el.innerHTML = `${lead}<span>${esc(msg)}</span>${undo ? `<button>${esc(undoLabel)}</button>` : ""}`;
    if (undo) $("button", el).onclick = () => {
      undo();
      this._dismiss(el);
    };
    root.appendChild(el);
    setTimeout(() => this._dismiss(el), ms);
  },
  _dismiss(el) {
    if (!el.isConnected) return;
    el.classList.add("leaving");
    setTimeout(() => el.remove(), 300);
  }
};

/* ============================================================
   Tip — hover/focus tooltip for chart marks

   Native title= is too slow and unstyled for a chart, and an absolutely
   positioned tip would be clipped by the panel it sits in, so this is one
   fixed-position element shared by the whole page. Tooltips only ever
   supplement: every value they show is also on the page or in a table.
   ============================================================ */
/* ============================================================
   Picker — a <select> you can actually search

   The shop's material catalogue runs to hundreds of items, and a native
   dropdown of that length is a wall of text you scroll past. This is a text
   field that filters as you type.

   The chosen value lives in a hidden input carrying the CALLER'S id and
   attributes, and a real `change` event is dispatched on it — so call sites
   that already read `.value` and assign `.onchange` need no rewriting.
   ============================================================ */
var Picker = {
  _cfg: {},
  _seq: 0,
  MAX: 60,
  // render a screenful, not the whole catalogue

  /* options: [{ value, label, sub }] · actions sit above the list */
  html(id, {
    value = "",
    options = [],
    placeholder = "Search…",
    empty = "",
    actions = [],
    attrs = ""
  } = {}) {
    var key = id || "pk" + ++this._seq;
    this._cfg[key] = {
      options,
      empty,
      actions
    };
    var cur = options.find(o => String(o.value) === String(value));
    var act = actions.find(a => String(a.value) === String(value));
    return `<div class="picker" data-pk="${esc(key)}">
      <input class="input picker-input" value="${esc(cur ? cur.label : act ? act.label : value ? "" : empty)}"
        placeholder="${esc(placeholder)}" autocomplete="off" spellcheck="false">
      <span class="picker-caret">${icon("chev-down", 14)}</span>
      <input type="hidden" id="${esc(key)}" value="${esc(value)}" ${attrs}>
      <div class="picker-menu" hidden></div>
    </div>`;
  },
  norm: s => String(s || "").toLowerCase().replace(/[ąĄ]/g, "a").replace(/[čČ]/g, "c").replace(/[ęėĘĖ]/g, "e").replace(/[įĮ]/g, "i").replace(/[šŠ]/g, "s").replace(/[ųūŲŪ]/g, "u").replace(/[žŽ]/g, "z").normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
  bind(root) {
    $$(".picker", root).forEach(el => {
      if (el._pkBound) return;
      el._pkBound = true;
      var cfg = this._cfg[el.dataset.pk];
      if (!cfg) return;
      var input = $(".picker-input", el);
      var hidden = $('input[type="hidden"]', el);
      var menu = $(".picker-menu", el);
      var rows = [],
        active = -1,
        typed = false;
      var labelFor = v => {
        var o = cfg.options.find(x => String(x.value) === String(v)) || cfg.actions.find(x => String(x.value) === String(v));
        return o ? o.label : v ? "" : cfg.empty;
      };
      var render = () => {
        var q = this.norm(typed ? input.value.trim() : "");
        var hits = q ? cfg.options.filter(o => this.norm(o.label + " " + (o.sub || "")).includes(q)) : cfg.options;
        rows = [
        /* "— none —" is noise once you have typed a query; the create action
           is the opposite — it is exactly what you want after a bad search */
        ...(cfg.empty && !q ? [{
          value: "",
          label: cfg.empty,
          muted: true
        }] : []), ...cfg.actions, ...hits.slice(0, this.MAX)];
        var more = hits.length - Math.min(hits.length, this.MAX);
        menu.innerHTML = rows.map((o, i) => `<button type="button" class="picker-row ${i === active ? "on" : ""} ${o.muted ? "muted" : ""}" data-i="${i}">
            <span>${esc(o.label)}</span>${o.sub ? `<small>${esc(o.sub)}</small>` : ""}
          </button>`).join("") + (more > 0 ? `<div class="picker-more">…and ${more} more — keep typing</div>` : "")
        /* judged on the HITS, not on rows — the create action is always there,
           and "nothing matches" is still the useful thing to say */ + (q && !hits.length ? `<div class="picker-more">Nothing matches “${esc(input.value.trim())}”</div>` : "");
        $$(".picker-row", menu).forEach(b => b.onmousedown = e => {
          e.preventDefault();
          choose(+b.dataset.i);
        });
        menu.hidden = false;
        /* What clips this menu is usually the DIALOG, not the window — measuring
           the viewport says there is plenty of room while the modal body cuts
           the list in half. So measure against whatever actually scrolls. */
        var clip = (() => {
          for (var p = el.parentElement; p; p = p.parentElement) {
            var ov = getComputedStyle(p).overflowY;
            if (ov === "auto" || ov === "scroll") return p.getBoundingClientRect();
          }
          return {
            top: 0,
            bottom: window.innerHeight
          };
        })();
        var box = el.getBoundingClientRect();
        var want = Math.min(240, menu.scrollHeight + 10);
        var below = clip.bottom - box.bottom,
          above = box.top - clip.top;
        menu.classList.toggle("up", below < want && above > below);
        menu.scrollIntoView({
          block: "nearest"
        }); // and bring it into view either way
      };
      var choose = i => {
        var o = rows[i];
        if (!o) return;
        hidden.value = o.value;
        input.value = o.value ? o.label : cfg.empty;
        close();
        hidden.dispatchEvent(new Event("change", {
          bubbles: true
        }));
      };
      var close = () => {
        menu.hidden = true;
        active = -1;
        typed = false;
      };
      input.onfocus = () => {
        typed = false;
        input.select();
        render();
      };
      input.oninput = () => {
        typed = true;
        active = 0;
        render();
      };
      input.onblur = () => {
        setTimeout(() => {
          input.value = labelFor(hidden.value);
          close();
        }, 120);
      };
      $(".picker-caret", el).onmousedown = e => {
        e.preventDefault();
        if (menu.hidden) input.focus();else close();
      };
      input.onkeydown = e => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (menu.hidden) {
            render();
            active = 0;
          } else active = Math.max(0, Math.min(rows.length - 1, active + (e.key === "ArrowDown" ? 1 : -1)));
          render();
          var on = $(".picker-row.on", menu);
          if (on) on.scrollIntoView({
            block: "nearest"
          });
        } else if (e.key === "Enter") {
          if (!menu.hidden) {
            e.preventDefault();
            choose(active < 0 ? 0 : active);
          }
        } else if (e.key === "Escape") {
          if (!menu.hidden) {
            e.stopPropagation();
            input.value = labelFor(hidden.value);
            close();
          }
        }
      };
    });
  }
};
var Tip = {
  el: null,
  show(target, text) {
    if (!text) return;
    if (!this.el) {
      this.el = document.createElement("div");
      this.el.className = "tip-pop";
      document.body.appendChild(this.el);
    }
    this.el.textContent = text;
    this.el.classList.add("on");
    var r = target.getBoundingClientRect(),
      t = this.el.getBoundingClientRect();
    var x = Math.max(8, Math.min(window.innerWidth - t.width - 8, r.left + r.width / 2 - t.width / 2));
    var above = r.top > t.height + 12;
    this.el.style.left = x + "px";
    this.el.style.top = (above ? r.top - t.height - 8 : r.bottom + 8) + "px";
  },
  hide() {
    if (this.el) this.el.classList.remove("on");
  },
  /* Keyboard focus shows exactly what hover shows */
  bind(root) {
    $$("[data-tip]", root).forEach(el => {
      if (!el.hasAttribute("tabindex")) el.tabIndex = 0;
      el.onmouseenter = () => this.show(el, el.dataset.tip);
      el.onmouseleave = () => this.hide();
      el.onfocus = () => this.show(el, el.dataset.tip);
      el.onblur = () => this.hide();
    });
  }
};

/* ============================================================
   Offline — the app itself survives a dropped network

   The shop's data was always local; the files were not, so a WiFi blip
   used to mean a blank page. sw.js caches the shell, which also makes
   ShopFlow installable to a tablet's home screen.
   ============================================================ */
var Offline = {
  online: navigator.onLine !== false,
  reg: null,
  _reloading: false,
  UPDATE_EVERY: 30 * 60000,
  // a bench tablet stays open for days

  /* Android Chrome offers to install a PWA through a menu nobody on a shop
     floor is going to find. Catch its event and put a real button in Settings
     instead. iOS fires nothing — there it is Share → Add to Home Screen, and
     we say so rather than pretending there is a button. */
  installEvent: null,
  installed() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  },
  promptInstall() {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var _yield$_this2$install, outcome;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (_this2.installEvent) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return", false);
          case 2:
            _this2.installEvent.prompt();
            _context3.next = 5;
            return _this2.installEvent.userChoice.catch(() => ({
              outcome: "dismissed"
            }));
          case 5:
            _yield$_this2$install = _context3.sent;
            outcome = _yield$_this2$install.outcome;
            if (outcome === "accepted") _this2.installEvent = null;
            return _context3.abrupt("return", outcome === "accepted");
          case 9:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  boot() {
    window.addEventListener("beforeinstallprompt", e => {
      e.preventDefault();
      this.installEvent = e;
      if (typeof App !== "undefined" && App.render) {
        App._html = null;
        App.render();
      }
    });
    window.addEventListener("appinstalled", () => {
      this.installEvent = null;
      if (typeof Toast !== "undefined") Toast.show("ShopFlow installed on this device", {
        emoji: "check-circle",
        ms: 5000
      });
      if (typeof App !== "undefined" && App.render) {
        App._html = null;
        App.render();
      }
    });
    window.addEventListener("online", () => this._net(true));
    window.addEventListener("offline", () => this._net(false));
    if (!("serviceWorker" in navigator)) return;
    // The manifest is what marks this page as the installable app — test.html
    // has none, and must never have a worker caching the files under test.
    if (!document.querySelector('link[rel="manifest"]')) return;
    if (!/^https?:$/.test(location.protocol)) return; // file:// can't host a worker

    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").then(reg => {
        this.reg = reg;
        if (reg.waiting && navigator.serviceWorker.controller) this._offerUpdate(reg);
        reg.addEventListener("updatefound", () => {
          var nw = reg.installing;
          if (!nw) return;
          nw.addEventListener("statechange", () => {
            // no controller yet = first install, nothing to interrupt
            if (nw.state === "installed" && navigator.serviceWorker.controller) this._offerUpdate(reg);
          });
        });
        setInterval(() => reg.update().catch(() => {}), this.UPDATE_EVERY);
        document.addEventListener("visibilitychange", () => {
          if (document.visibilityState === "visible") reg.update().catch(() => {});
        });
      }).catch(e => console.warn("[sw] registration failed:", e && e.message));
    });
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this._reloading) return; // one reload, never a loop
      this._reloading = true;
      location.reload();
    });
  },
  _net(up) {
    if (this.online === up) return;
    this.online = up;
    App.render(); // the badge lives in the shell
    Toast.show(up ? "Back online" : "Offline — ShopFlow keeps working, changes sync when you reconnect", {
      emoji: up ? "check" : "info",
      ms: up ? 2200 : 5000
    });
  },
  /* Shown in the topbar so a shopfloor screen says what is going on. */
  badgeHtml() {
    return this.online ? "" : `<span class="offline-chip" title="No network. Your work is saved on this device and syncs when the connection returns.">${icon("cloud-off", 13)} Offline</span>`;
  },
  /* A new build is cached and ready. Never swap it in mid-task — ask. */
  _offerUpdate(reg) {
    if ($("#sw-update")) return;
    var el = document.createElement("div");
    el.className = "sw-update";
    el.id = "sw-update";
    el.innerHTML = `<span class="ico">${icon("sparkles", 17)}</span>
      <span class="grow"><b>A new version is ready</b><span>Reload to pick it up — nothing in progress is lost.</span></span>
      <button class="btn primary" id="sw-reload">Reload</button>
      <button class="icon-btn" id="sw-later" title="Later">${icon("x", 15)}</button>`;
    document.body.appendChild(el);
    $("#sw-reload", el).onclick = () => {
      $("#sw-reload", el).disabled = true;
      // controllerchange reloads us once the new worker takes over
      reg.waiting ? reg.waiting.postMessage("skip-waiting") : location.reload();
    };
    $("#sw-later", el).onclick = () => el.remove();
  }
};

/* ============================================================
   Modal
   ============================================================ */
var Modal = {
  open(html, bindFn, opts) {
    var root = $("#modal-root");
    var quiet = !!(opts && opts.quiet);
    root.innerHTML = `<div class="modal-scrim${quiet ? " quiet" : ""}"><div class="modal">${html}</div></div>`;
    /* Clicking the backdrop deliberately does NOT close. These dialogs hold
       work in progress — a corrected SWOOD material list, a half-filled order,
       a route being edited — and a stray click beside the dialog threw all of
       it away with no warning and no undo. Every modal carries a visible
       Cancel or Close, and Escape still works. */
    $$("[data-close]", root).forEach(b => b.onclick = () => this.close()); // every modal marks its own close buttons
    if (bindFn) bindFn($(".modal", root));
    var firstInput = $(".modal input, .modal select", root);
    if (firstInput && !quiet) setTimeout(() => firstInput.focus(), 60);
  },
  close(instant) {
    var root = $("#modal-root");
    var scrim = $(".modal-scrim", root);
    if (!scrim) return;
    if (instant) {
      root.innerHTML = "";
      return;
    }
    scrim.classList.add("closing");
    setTimeout(() => {
      root.innerHTML = "";
    }, 200);
  }
};

/* ============================================================
   Drawer (order detail) — content defined in manager.js/worker.js
   ============================================================ */
var Drawer = {
  orderId: null,
  _html: null,
  open(orderId) {
    this.orderId = orderId;
    if (typeof GPM !== "undefined") GPM.taskId = null; // don't fight the Planner task drawer
    if (typeof OrderDetail !== "undefined") {
      OrderDetail.showAllHist = false;
      OrderDetail.showAllParts = false;
    }
    this.refresh(true);
    /* opening the project is reading its remarks — done after the paint so the
       "N new" chip is still there when it opens, and gone next time */
    if (App.me) setTimeout(() => {
      if (M.markCommentsSeen(orderId, App.me.id)) App._html = null;
    }, 1200);
  },
  refresh(fresh) {
    /* the project sheet (a modal) shows the same project — keep it current,
       unless someone is typing in it */
    if (typeof OrderDetail !== "undefined" && OrderDetail._sheetId && !this._sheetBusy) {
      var sm = $("#modal-root .sheet-modal");
      var ae = document.activeElement;
      var typing = sm && ae && sm.contains(ae) && /^(INPUT|TEXTAREA|SELECT)$/.test(ae.tagName) && !/^(ap-new-model|dt-new)$/.test(ae.id);
      if (sm && !typing) {
        this._sheetBusy = true;
        try { OrderDetail.refreshSheet(); } finally { this._sheetBusy = false; }
      }
    }
    if (!this.orderId) return;
    var o = D.order(this.orderId);
    if (!o) {
      this.close(true);
      return;
    }
    var root = $("#drawer-root");
    var body = OrderDetail.html(o);
    if (fresh || !$(".drawer", root)) {
      this._html = body;
      root.innerHTML = `<div class="drawer-scrim"></div><div class="drawer">${body}</div>`;
    } else {
      // App.render() calls us on every state change — rebuilding an unchanged
      // drawer scrolls it back to the top and destroys the button under the
      // user's finger (the "press Complete twice" bug, drawer edition)
      if (body === this._html) return;
      this._html = body;
      var d = $(".drawer", root);
      var sc = $(".drawer-body", d),
        top = sc ? sc.scrollTop : 0;
      d.innerHTML = body;
      var sc2 = $(".drawer-body", d);
      if (sc2 && top) sc2.scrollTop = top;
    }
    $(".drawer-scrim", root).onclick = () => this.close();
    OrderDetail.bind($(".drawer", root), o);
  },
  close(instant) {
    var root = $("#drawer-root");
    this.orderId = null;
    var d = $(".drawer", root),
      s = $(".drawer-scrim", root);
    if (!d) return;
    if (instant) {
      root.innerHTML = "";
      return;
    }
    d.classList.add("closing");
    s.classList.add("closing");
    setTimeout(() => {
      root.innerHTML = "";
    }, 240);
  }
};

/* ============================================================
   Popover (anchored menu — Apple style)
   ============================================================ */
var Popover = {
  open(anchor, html, bind) {
    this.close();
    var root = document.createElement("div");
    root.id = "pop-root";
    root.innerHTML = `<div class="pop-scrim"></div><div class="popover">${html}</div>`;
    document.body.appendChild(root);
    var pop = $(".popover", root);
    var r = anchor.getBoundingClientRect();
    pop.style.top = Math.min(r.bottom + 8, innerHeight - pop.offsetHeight - 12) + "px";
    pop.style.left = Math.max(12, Math.min(r.right - pop.offsetWidth, innerWidth - pop.offsetWidth - 12)) + "px";
    $(".pop-scrim", root).onclick = () => this.close();
    if (bind) bind(pop);
  },
  /* A picker where several boxes get ticked wants to act once, when the person
     is done, not on every tick — so a popover can leave a note to run then. */
  close() {
    var r = $("#pop-root");
    if (!r) return;
    var pop = $(".popover", r),
      fn = pop && pop._onClose;
    if (pop) pop._onClose = null;
    r.remove();
    if (fn) fn();
  }
};

/* ============================================================
   MyWork — the floating "what do I owe anyone" button

   Every role gets it, managers included. The cockpit has a To-Do page and the
   bench has a queue, but neither answers "what is on MY plate" for someone
   who is both: a manager assigned a drawing had no screen that said so. This
   sits above everything, on every view, in both shells.
   ============================================================ */
var MyWork = {
  open: false,
  toggle() {
    this.open = !this.open;
    this.paint();
  },
  close() {
    if (this.open) {
      this.open = false;
      this.paint();
    }
  },
  paint() {
    var root = document.getElementById("mywork-root");
    if (!root) return;
    var me = App.me;
    if (!me) {
      root.innerHTML = "";
      return;
    }
    var s = D.myWorkSummary(me.id);
    var tone = s.blocked ? "bad" : s.late ? "warn" : s.running ? "go" : "";
    root.innerHTML = `
      ${this.open ? `<div class="mw-scrim"></div>` : ""}
      ${this.open ? this.panelHtml(s) : ""}
      <button class="mw-fab ${tone} ${this.open ? "on" : ""}" id="mw-fab"
        title="My tasks" aria-label="My tasks">
        ${icon(this.open ? "x" : "check-circle", 21)}
        ${!this.open && s.total ? `<span class="mw-count">${s.total > 99 ? "99+" : s.total}</span>` : ""}
      </button>`;
    var fab = document.getElementById("mw-fab");
    if (fab) fab.onclick = () => this.toggle();
    var scrim = root.querySelector(".mw-scrim");
    if (scrim) scrim.onclick = () => this.close();
    if (this.open) this.bind(root);
  },
  panelHtml(s) {
    var row = x => {
      if (x.kind === "todo") {
        var _due = x.todo.due ? fmtDue(x.todo.due) : null;
        return `<button class="mw-row" data-mw-todo="${x.todo.id}">
          <span class="mw-ico">${icon("check-circle", 15)}</span>
          <span class="grow"><b>${esc(x.todo.text)}</b><span>To-do</span></span>
          ${_due ? `<span class="due-chip ${_due.cls}">${_due.label}</span>` : ""}
        </button>`;
      }
      var st = D.station(x.op.stationId);
      var due = fmtDue(x.order.due);
      return `<button class="mw-row ${x.blocked ? "blocked" : ""} ${x.waiting ? "waiting" : ""}" data-mw-order="${x.order.id}">
        <span class="mw-ico">${x.running ? `<span class="pill running" style="padding:0;background:none"><span class="dot"></span></span>` : stIcon(st, 15)}</span>
        <span class="grow"><b>${esc(x.order.product || x.order.num)}</b>
          <span>${esc(st ? st.name : "—")}${x.order.client ? " · " + esc(x.order.client) : ""}${x.blocked ? ` · ${esc(x.op.blockNote || "Blocked")}` : x.waiting ? ` · <i>waiting for upstream</i>` : ""}</span></span>
        ${x.running ? `<span class="t-num" data-timer="${x.order.id}/${x.op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(x.op))}</span>` : `<span class="due-chip ${due.cls}">${due.label}</span>`}
      </button>`;
    };
    return `<div class="mw-panel">
      <header>
        <h3>My tasks</h3>
        <span class="grow"></span>
        <span class="t-caption">${s.now} <span>ready now</span>${s.waiting ? ` · ${s.waiting} <span>waiting</span>` : ""}</span>
        ${s.blocked ? `<span class="pill blocked"><span class="dot"></span>${s.blocked}</span>` : ""}
      </header>
      ${s.total ? `<div class="mw-list">${s.list.slice(0, 40).map(row).join("")}</div>` : `<div class="mw-empty">${icon("check-circle", 30)}<b>Nothing on your plate</b>
           <span>Work assigned to you shows up here.</span></div>`}
      ${s.total > 40 ? `<div class="t-caption" style="padding:8px 14px">…and ${s.total - 40} more</div>` : ""}
    </div>`;
  },
  bind(root) {
    $$("[data-mw-order]", root).forEach(b => b.onclick = () => {
      var id = b.dataset.mwOrder;
      this.close();
      if (App.usesCockpit()) Drawer.open(id);else App.navigate("my"); // the bench's own queue
    });
    $$("[data-mw-todo]", root).forEach(b => b.onclick = () => {
      this.close();
      App.navigate(App.usesCockpit() ? "todo" : "my");
    });
  }
};

/* Apple-style toggle switch */
function switchHtml(id, on) {
  return `<button class="switch ${on ? "on" : ""}" data-switch="${id}" role="switch" aria-checked="${on}"><i></i></button>`;
}

/* ============================================================
   Command palette (⌘K)
   ============================================================ */
var Palette = {
  isOpen: false,
  toggle() {
    this.isOpen ? this.close() : this.open();
  },
  open() {
    this.isOpen = true;
    var root = $("#palette-root");
    root.innerHTML = `<div class="palette-scrim"></div>
      <div class="palette">
        <input placeholder="Search orders, clients, people…" id="pal-q">
        <div class="palette-list" id="pal-list"></div>
      </div>`;
    $(".palette-scrim", root).onclick = () => this.close();
    var q = $("#pal-q", root);
    q.oninput = () => this.renderList(q.value);
    q.onkeydown = e => {
      if (e.key === "Enter") {
        var first = $(".palette-item", root);
        if (first) first.click();
      }
    };
    this.renderList("");
    setTimeout(() => q.focus(), 40);
  },
  close() {
    if (!this.isOpen) return;
    this.isOpen = false;
    $("#palette-root").innerHTML = "";
  },
  renderList(query) {
    var list = $("#pal-list");
    if (!list) return;
    var ql = query.trim().toLowerCase();
    var orders = Store.state.orders.filter(o => !ql || o.num.toLowerCase().includes(ql) || o.product.toLowerCase().includes(ql) || o.client.toLowerCase().includes(ql)).slice(0, 6);
    var members = ql ? Store.state.members.filter(m => m.name.toLowerCase().includes(ql)).slice(0, 3) : [];
    var mats = ql && App.usesCockpit() ? Store.state.materials.filter(m => m.name.toLowerCase().includes(ql) || m.sku.toLowerCase().includes(ql)).slice(0, 4) : [];
    var boards = ql ? D.boardsFor(App.me.id).filter(b => b.name.toLowerCase().includes(ql)).slice(0, 3) : [];
    var html = "";
    var _iterator2 = _createForOfIteratorHelper(orders),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var o = _step2.value;
        var st = D.orderStatus(o);
        var cur = D.currentOp(o);
        html += `<button class="palette-item" data-order="${o.id}">
        <span class="ico">${cur ? stIcon(D.station(cur.stationId), 17) : icon(o.shipped ? "truck" : "check-circle", 17)}</span>
        <span class="grow"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)}</b><span>${o.client && o.client !== o.product ? esc(o.client) + " — " : ""}${D.statusLabelFor(o, st)}</span></span>
        ${pillHtml(st, D.statusLabelFor(o, st))}
      </button>`;
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    var _iterator3 = _createForOfIteratorHelper(members),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var m = _step3.value;
        html += `<button class="palette-item" data-member="${m.id}">
        ${avatarHtml(m, "sm")}
        <span class="grow"><b>${esc(m.name)}</b><span>${esc(m.trade)}</span></span>
      </button>`;
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var _iterator4 = _createForOfIteratorHelper(mats),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var _m = _step4.value;
        var low = _m.qty <= _m.minQty;
        html += `<button class="palette-item" data-material="${_m.id}">
        <span class="ico">${matIcon(_m, 17)}</span>
        <span class="grow"><b>${esc(_m.name)}</b><span>${esc(_m.sku)} · ${_m.qty} ${esc(_m.unit)} in stock</span></span>
        ${low ? `<span class="pill blocked"><span class="dot"></span>Low</span>` : ""}
      </button>`;
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var _iterator5 = _createForOfIteratorHelper(boards),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var b = _step5.value;
        html += `<button class="palette-item" data-board="${b.id}">
        <span class="ico">${icon("brain", 17)}</span>
        <span class="grow"><b>${esc(b.name)}</b><span>Whiteboard · ${b.els.length} items</span></span>
      </button>`;
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    list.innerHTML = html || `<div class="palette-empty">No matches for “${esc(query)}”</div>`;
    $$(".palette-item", list).forEach(b => b.onclick = () => {
      this.close();
      if (b.dataset.order) Drawer.open(b.dataset.order);
      if (b.dataset.member && App.isManager()) App.navigate("team");
      if (b.dataset.material) {
        App.navigate("warehouse");
        Warehouse.materialModal(b.dataset.material);
      }
      if (b.dataset.board) {
        WB.openId = b.dataset.board;
        WB.fit(true);
        if (App.usesCockpit()) App.navigate("whiteboard");else {
          App.workerTab = "board";
          App.render();
        }
      }
    });
  }
};