function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
/* ============================================================
   ShopFlow service worker — the app keeps working without a network.

   All the shop's data already lives in localStorage; what a dropped
   connection used to take away was the app ITSELF, because every file is
   fetched from GitHub Pages. This caches the shell so the workshop can
   open ShopFlow on a dead WiFi and carry on, and so it can be installed
   to a tablet's home screen.

   BUILD is rewritten by tools/deploy-pages.sh with the git sha, so a new
   deploy lands in a new cache and the old one is dropped on activate.
   ============================================================ */
var BUILD = "dbl1110b";
var CACHE = `shopflow-${BUILD}`;

/* The shell. Optional files (realdata.js is dev-only, sync-config.js only
   exists once the shop is wired to Supabase) must not fail the install. */
var SHELL = [".", "index.html", "styles.css", "legacy-polyfills.js", "icons.js", "i18n.js", "data.js", "app.js", "manager.js", "worker.js", "wb.js", "scan.js", "gpm.js", "swood.js", "sheet-export.js", "reports.js", "insights.js", "files.js", "bridge.js", "sync.js", "manifest.json", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "icons/apple-touch-icon.png", "icons/favicon-64.png", "icons/logo-mask.png"];
var OPTIONAL = ["sync-config.js", "realdata.js", "../hub/core.js"];
self.addEventListener("install", e => {
  e.waitUntil(_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var cache;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return caches.open(CACHE);
        case 2:
          cache = _context.sent;
          _context.next = 5;
          return Promise.allSettled(SHELL.map(u => cache.add(new Request(u, {
            cache: "reload"
          }))));
        case 5:
          _context.next = 7;
          return Promise.allSettled(OPTIONAL.map(u => cache.add(new Request(u, {
            cache: "reload"
          }))));
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }))());
});
self.addEventListener("activate", e => {
  e.waitUntil(_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    var _iterator, _step, k;
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.t0 = _createForOfIteratorHelper;
          _context2.next = 3;
          return caches.keys();
        case 3:
          _context2.t1 = _context2.sent;
          _iterator = (0, _context2.t0)(_context2.t1);
          _context2.prev = 5;
          _iterator.s();
        case 7:
          if ((_step = _iterator.n()).done) {
            _context2.next = 14;
            break;
          }
          k = _step.value;
          if (!(k.startsWith("shopflow-") && k !== CACHE)) {
            _context2.next = 12;
            break;
          }
          _context2.next = 12;
          return caches.delete(k);
        case 12:
          _context2.next = 7;
          break;
        case 14:
          _context2.next = 19;
          break;
        case 16:
          _context2.prev = 16;
          _context2.t2 = _context2["catch"](5);
          _iterator.e(_context2.t2);
        case 19:
          _context2.prev = 19;
          _iterator.f();
          return _context2.finish(19);
        case 22:
          _context2.next = 24;
          return self.clients.claim();
        case 24:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[5, 16, 19, 22]]);
  }))());
});

/* The page asks for the update once the user accepts it, so a shopfloor
   screen is never swapped out from under someone mid-task. */
self.addEventListener("message", e => {
  if (e.data === "skip-waiting") self.skipWaiting();
  if (e.data === "build") e.source && e.source.postMessage({
    build: BUILD
  });
});
var putIfOk = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(req, res) {
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          if (!(res && res.ok && res.type === "basic")) {
            _context3.next = 4;
            break;
          }
          _context3.next = 3;
          return caches.open(CACHE);
        case 3:
          _context3.sent.put(req, res.clone());
        case 4:
          return _context3.abrupt("return", res);
        case 5:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return function putIfOk(_x, _x2) {
    return _ref3.apply(this, arguments);
  };
}();
self.addEventListener("fetch", e => {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Supabase and friends: never our business

  // A navigation must survive being offline — that is the whole point.
  if (req.mode === "navigate") {
    e.respondWith(_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.t0 = putIfOk;
            _context4.t1 = req;
            _context4.next = 5;
            return fetch(req);
          case 5:
            _context4.t2 = _context4.sent;
            _context4.next = 8;
            return (0, _context4.t0)(_context4.t1, _context4.t2);
          case 8:
            return _context4.abrupt("return", _context4.sent);
          case 11:
            _context4.prev = 11;
            _context4.t3 = _context4["catch"](0);
            _context4.next = 15;
            return caches.match("index.html");
          case 15:
            _context4.t5 = _context4.sent;
            if (_context4.t5) {
              _context4.next = 20;
              break;
            }
            _context4.next = 19;
            return caches.match(".");
          case 19:
            _context4.t5 = _context4.sent;
          case 20:
            _context4.t4 = _context4.t5;
            if (_context4.t4) {
              _context4.next = 23;
              break;
            }
            _context4.t4 = new Response("<h1>ShopFlow is offline</h1><p>Reconnect once to install the app, then it opens without a network.</p>", {
              headers: {
                "Content-Type": "text/html"
              }
            });
          case 23:
            return _context4.abrupt("return", _context4.t4);
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 11]]);
    }))());
    return;
  }

  // Deployed assets carry ?v=<sha>, so a given URL can never change content:
  // serve those straight from the cache. Unversioned URLs are what a developer
  // is editing right now, so those go to the network first.
  var versioned = url.searchParams.has("v");
  e.respondWith(_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
    var hit;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          if (!versioned) {
            _context5.next = 20;
            break;
          }
          _context5.next = 3;
          return caches.match(req);
        case 3:
          hit = _context5.sent;
          if (!hit) {
            _context5.next = 6;
            break;
          }
          return _context5.abrupt("return", hit);
        case 6:
          _context5.prev = 6;
          _context5.t0 = putIfOk;
          _context5.t1 = req;
          _context5.next = 11;
          return fetch(req);
        case 11:
          _context5.t2 = _context5.sent;
          _context5.next = 14;
          return (0, _context5.t0)(_context5.t1, _context5.t2);
        case 14:
          return _context5.abrupt("return", _context5.sent);
        case 17:
          _context5.prev = 17;
          _context5.t3 = _context5["catch"](6);
          return _context5.abrupt("return", caches.match(req, {
            ignoreSearch: true
          }));
        case 20:
          _context5.prev = 20;
          _context5.t4 = putIfOk;
          _context5.t5 = req;
          _context5.next = 25;
          return fetch(req);
        case 25:
          _context5.t6 = _context5.sent;
          _context5.next = 28;
          return (0, _context5.t4)(_context5.t5, _context5.t6);
        case 28:
          return _context5.abrupt("return", _context5.sent);
        case 31:
          _context5.prev = 31;
          _context5.t7 = _context5["catch"](20);
          _context5.next = 35;
          return caches.match(req);
        case 35:
          _context5.t9 = _context5.sent;
          if (_context5.t9) {
            _context5.next = 40;
            break;
          }
          _context5.next = 39;
          return caches.match(req, {
            ignoreSearch: true
          });
        case 39:
          _context5.t9 = _context5.sent;
        case 40:
          _context5.t8 = _context5.t9;
          if (_context5.t8) {
            _context5.next = 43;
            break;
          }
          _context5.t8 = Response.error();
        case 43:
          return _context5.abrupt("return", _context5.t8);
        case 44:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[6, 17], [20, 31]]);
  }))());
});

/* ---- Dėdės Baldai notices: phone/computer notifications (same as /hub/notify-sw.js) ---- */
self.addEventListener("push", function (e) {
  var d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = { title: "Dėdės Baldai", body: e.data ? e.data.text() : "" }; }
  var title = d.title || "Dėdės Baldai";
  var opts = {
    body: d.body || "",
    icon: "/hub/shared/touch-180.png",
    badge: "/hub/shared/badge-96.png",
    tag: d.id ? "n-" + d.id : undefined,
    renotify: !!d.id,
    requireInteraction: !!d.important,
    timestamp: Date.now(),
    data: { url: d.url || "/hub/shopfloor/", id: d.id || null }
  };
  e.waitUntil(Promise.all([
    self.registration.showNotification(title, opts),
    // tell open pages so they refresh their bell right away
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      list.forEach(function (c) { try { c.postMessage({ type: "notice-push", id: d.id || null }); } catch (err) {} });
    })
  ]));
});

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "/hub/shopfloor/";
  var target = new URL(url, self.location.origin);
  if (e.notification.data && e.notification.data.id) target.searchParams.set("notice", e.notification.data.id);
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
    var base = target.origin + target.pathname;
    for (var i = 0; i < list.length; i++) {
      var c = list[i];
      if (c.url.indexOf(base) === 0 && "focus" in c) {
        try { c.postMessage({ type: "notice-open", id: e.notification.data && e.notification.data.id }); } catch (err) {}
        return c.focus().then(function (w) { return target.hash && w && w.navigate ? w.navigate(target.href) : w; }).catch(function () {});
      }
    }
    return self.clients.openWindow(target.href);
  }));
});
