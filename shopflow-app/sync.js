/* ============================================================
   ShopFlow — Cloud sync (GitHub Pages app + Supabase data)
   Shared workspace across every device with a real login:
   the shop password signs in to Supabase, and the database is
   locked to authenticated sessions — the public key alone gets
   you nothing. Instant sync via Supabase realtime.

   Inert until configured: with no SYNC_CONFIG (no sync-config.js)
   this stays off and the app runs fully local. See SETUP-CLOUD.md.
   ============================================================ */
"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Sync = {
  client: null,
  channel: null,
  wsId: "default",
  table: "workspaces",
  status: "off",
  authed: false,
  checking: false,
  _debounce: null,
  _applying: false,
  _initted: false,
  _lastSync: null,
  configured() {
    return typeof SYNC_CONFIG !== "undefined" && SYNC_CONFIG && SYNC_CONFIG.url && SYNC_CONFIG.anonKey;
  },
  _load() {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var mod;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!_this.client) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _context.next = 4;
            return import("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm");
          case 4:
            mod = _context.sent;
            _this.client = mod.createClient(SYNC_CONFIG.url, SYNC_CONFIG.anonKey);
            _this.wsId = SYNC_CONFIG.workspace || "default";
            _this.table = SYNC_CONFIG.table || "workspaces";
          case 8:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  init() {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var _yield$_this2$client$, session;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (!(_this2._initted || !_this2.configured())) {
              _context2.next = 3;
              break;
            }
            _this2.paint();
            return _context2.abrupt("return");
          case 3:
            _this2._initted = true;
            _this2.checking = true;
            _context2.prev = 5;
            _context2.next = 8;
            return _this2._load();
          case 8:
            _context2.next = 10;
            return _this2.client.auth.getSession();
          case 10:
            _yield$_this2$client$ = _context2.sent;
            session = _yield$_this2$client$.data.session;
            // remembered on this device?
            _this2.checking = false;
            if (!session) {
              _context2.next = 19;
              break;
            }
            _this2.authed = true;
            _context2.next = 17;
            return _this2._afterAuth();
          case 17:
            _context2.next = 21;
            break;
          case 19:
            _this2.authed = false;
            App.render();
          case 21:
            _context2.next = 29;
            break;
          case 23:
            _context2.prev = 23;
            _context2.t0 = _context2["catch"](5);
            console.warn("[Sync] init:", _context2.t0 && _context2.t0.message || _context2.t0);
            _this2.checking = false;
            _this2.status = "error";
            App.render();
          case 29:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[5, 23]]);
    }))();
  },
  /* shop login (shared password → Supabase auth session) */
  login(password) {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var _yield$_this3$client$, error;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _this3._load();
          case 2:
            _context3.next = 4;
            return _this3.client.auth.signInWithPassword({
              email: SYNC_CONFIG.shopEmail,
              password
            });
          case 4:
            _yield$_this3$client$ = _context3.sent;
            error = _yield$_this3$client$.error;
            if (!error) {
              _context3.next = 8;
              break;
            }
            return _context3.abrupt("return", false);
          case 8:
            _this3.authed = true;
            _context3.next = 11;
            return _this3._afterAuth();
          case 11:
            return _context3.abrupt("return", true);
          case 12:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  logout() {
    var _this4 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            _context4.next = 3;
            return _this4.client;
          case 3:
            _context4.t0 = _context4.sent;
            if (!_context4.t0) {
              _context4.next = 6;
              break;
            }
            _this4.client.auth.signOut();
          case 6:
            _context4.next = 10;
            break;
          case 8:
            _context4.prev = 8;
            _context4.t1 = _context4["catch"](0);
          case 10:
            location.reload();
          case 11:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[0, 8]]);
    }))();
  },
  _afterAuth() {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var _yield$_this5$client$, data, error;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _this5.client.from(_this5.table).select("data").eq("id", _this5.wsId).maybeSingle();
          case 2:
            _yield$_this5$client$ = _context5.sent;
            data = _yield$_this5$client$.data;
            error = _yield$_this5$client$.error;
            if (!(!error && data && data.data)) {
              _context5.next = 9;
              break;
            }
            _this5._applyRemote(data.data);
            _context5.next = 11;
            break;
          case 9:
            _context5.next = 11;
            return _this5.push(true);
          case 11:
            // empty cloud → seed from this device
            Store._onSave = () => {
              if (!_this5._applying) _this5.schedulePush();
            };
            _this5.channel = _this5.client.channel("ws-" + _this5.wsId).on("postgres_changes", {
              event: "*",
              schema: "public",
              table: _this5.table,
              filter: "id=eq." + _this5.wsId
            }, p => {
              var d = p.new && p.new.data;
              if (d) _this5._applyRemote(d);
            }).subscribe(st => {
              _this5.status = st === "SUBSCRIBED" ? "live" : "connecting";
              _this5.paint();
            });
            _this5.status = "live";
            App.render();
            _this5.paint();
          case 16:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  },
  /* replace local state with a cloud version, without echoing it back up.
     Realtime hands us back our OWN writes too, so a payload we already hold
     must be dropped: re-applying it used to fire a second full re-render
     ~1s after every button press — the screen flicker on the shopfloor. */
  _applyRemote(state) {
    var json;
    try {
      json = JSON.stringify(state);
    } catch (e) {
      json = null;
    }
    if (json && (json === this._lastSync || json === JSON.stringify(Store.state))) {
      this.paint();
      return;
    }
    this._lastSync = json;
    var ae = document.activeElement;
    var typing = ae && (ae.isContentEditable || /^(INPUT|TEXTAREA)$/.test(ae.tagName || ""));
    this._applying = true;
    try {
      Store.state = state;
      Store.save();
    } finally {
      this._applying = false;
    }
    if (typeof Notif !== "undefined") Notif.flushLive();
    if (!typing && typeof App !== "undefined" && App.render) App.render();
    this.paint();
  },
  schedulePush() {
    clearTimeout(this._debounce);
    this._debounce = setTimeout(() => this.push(), 500);
  },
  push(initial) {
    var _this6 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var row, _yield$_this6$client$, error;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!(!_this6.authed || !_this6.client)) {
              _context6.next = 2;
              break;
            }
            return _context6.abrupt("return");
          case 2:
            _context6.prev = 2;
            row = {
              id: _this6.wsId,
              data: Store.state,
              updated_by: typeof App !== "undefined" && App.me && App.me.name || null
            };
            _this6._lastSync = JSON.stringify(Store.state); // recognise our own echo
            _context6.next = 7;
            return _this6.client.from(_this6.table).upsert(row);
          case 7:
            _yield$_this6$client$ = _context6.sent;
            error = _yield$_this6$client$.error;
            if (!error) {
              _context6.next = 11;
              break;
            }
            throw error;
          case 11:
            if (_this6.status !== "live") {
              _this6.status = "live";
              _this6.paint();
            }
            _context6.next = 19;
            break;
          case 14:
            _context6.prev = 14;
            _context6.t0 = _context6["catch"](2);
            console.warn("[Sync] push:", _context6.t0 && _context6.t0.message || _context6.t0);
            _this6.status = "error";
            _this6.paint();
          case 19:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[2, 14]]);
    }))();
  },
  pull() {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var _yield$_this7$client$, data;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (!(!_this7.authed || !_this7.client)) {
              _context7.next = 2;
              break;
            }
            return _context7.abrupt("return");
          case 2:
            _context7.next = 4;
            return _this7.client.from(_this7.table).select("data").eq("id", _this7.wsId).maybeSingle();
          case 4:
            _yield$_this7$client$ = _context7.sent;
            data = _yield$_this7$client$.data;
            if (data && data.data) _this7._applyRemote(data.data);
          case 7:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  },
  /* ---- shop login gate (before the PIN picker when cloud is on) ---- */
  needsGate() {
    return this.configured() && !this.authed;
  },
  gateHtml() {
    var s = Store.state;
    return `<div class="login-screen"><div class="pin-stage" style="gap:4px">
      <div class="login-logo"><div class="mark" style="color:var(--accent)">${icon("logo", 52, "", 1.6)}</div>
        <h1>ShopFlow</h1>
        <p>${this.checking ? "Connecting…" : "Sign in to your workspace"}</p></div>
      ${this.checking ? `<div class="sync-spinner"></div>` : `
        <div class="field" style="width:280px"><input class="input" id="shop-pass" type="password" placeholder="Shop password" autocomplete="current-password"></div>
        <button class="btn primary xl" id="shop-login-btn" style="width:280px;margin-top:12px">Sign in</button>
        <div class="t-caption" id="shop-login-err" style="color:var(--red);min-height:16px;margin-top:8px"></div>`}
    </div></div>`;
  },
  bindGate(root) {
    var _this8 = this;
    if (this.checking) return;
    var inp = $("#shop-pass", root),
      btn = $("#shop-login-btn", root),
      err = $("#shop-login-err", root);
    var go = /*#__PURE__*/function () {
      var _ref = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
        var ok;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              if (inp.value) {
                _context8.next = 2;
                break;
              }
              return _context8.abrupt("return");
            case 2:
              btn.disabled = true;
              err.textContent = "";
              _context8.next = 6;
              return _this8.login(inp.value).catch(() => false);
            case 6:
              ok = _context8.sent;
              if (!ok) {
                btn.disabled = false;
                err.textContent = "Wrong password — try again";
                inp.value = "";
                inp.focus();
              }
            case 8:
            case "end":
              return _context8.stop();
          }
        }, _callee8);
      }));
      return function go() {
        return _ref.apply(this, arguments);
      };
    }();
    btn.onclick = go;
    inp.onkeydown = e => {
      if (e.key === "Enter") go();
    };
    setTimeout(() => inp && inp.focus(), 60);
  },
  paint() {
    var el = document.getElementById("sync-status");
    if (el) el.outerHTML = this.badge();
  },
  badge() {
    var map = {
      off: "Local only (not connected)",
      connecting: "Connecting…",
      live: "Synced live",
      error: "Sync error — see console"
    };
    return `<span id="sync-status" class="sync-badge ${this.status}">${map[this.status] || map.off}</span>`;
  }
};