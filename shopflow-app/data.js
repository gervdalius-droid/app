/* ============================================================
   ShopFlow — Data layer
   localStorage-persisted store, seed data, domain logic.

   v3 model (MRPEasy-inspired):
   - orders have items (article lines with quantities)
   - each item's ops form parallel LANES (part groups, e.g.
     Facades / Carcass) that merge into a shared final lane
   - ops track qtyDone: pieces flow downstream as they finish
   - order.type: "prod" | "eng" (engineering projects)
   - portfolios group orders + projects
   ============================================================ */
"use strict";

function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var DB_KEY = "shopflow.v1";
var BK_KEY = "shopflow.backups"; // rolling local auto-backups (restore points)
var BK_MAX = 6; // keep the last N automatic snapshots on this device
var BK_KEEP_MAX = 24; // …plus up to this many named restore points, never auto-evicted
/* Counting snapshots was the wrong budget: 18 copies of a 400 KB document is
   7 MB. Against localStorage that was fatal; the vault has room, so the
   ceiling is generous rather than mean. */
var BK_BUDGET = 20000000; // characters of JSON across ALL local backups (vault)
var BK_BUDGET_LS = 1200000; // …and the tight one, for the localStorage fallback
var QUOTA_GUESS = 5000000; // what browsers give an origin in localStorage
var IDX_KEY = "shopflow.index"; // a few KB the hub can read without the whole document

/* ============================================================
   Vault — the local store that actually has room

   localStorage gives the WHOLE origin about 5 MB, shared with the hub, offers
   and invoices, and a shop's document plus its restore points went past that.
   IndexedDB is budgeted against free disk instead — hundreds of megabytes —
   so that is where the document lives now. localStorage keeps only a small
   index for the hub, and remains the fallback when IndexedDB is unavailable
   (some private-browsing modes), where the old tight limits still apply.
   ============================================================ */
var VAULT_DB = "shopflow-vault",
  VAULT_STORE = "kv";
var Vault = {
  _db: null,
  supported() {
    return typeof indexedDB !== "undefined" && indexedDB !== null;
  },
  open() {
    if (this._db) return Promise.resolve(this._db);
    if (!this.supported()) return Promise.reject(new Error("no indexedDB"));
    return new Promise((resolve, reject) => {
      var req = indexedDB.open(VAULT_DB, 1);
      req.onupgradeneeded = () => {
        var db = req.result;
        if (!db.objectStoreNames.contains(VAULT_STORE)) db.createObjectStore(VAULT_STORE);
      };
      req.onsuccess = () => {
        this._db = req.result;
        resolve(this._db);
      };
      req.onerror = () => reject(req.error);
      req.onblocked = () => reject(new Error("indexedDB blocked"));
    });
  },
  _tx(mode, fn) {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var db;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _this.open();
          case 2:
            db = _context.sent;
            return _context.abrupt("return", new Promise((resolve, reject) => {
              var tx = db.transaction(VAULT_STORE, mode);
              var req = fn(tx.objectStore(VAULT_STORE));
              tx.onerror = () => reject(tx.error);
              tx.onabort = () => reject(tx.error || new Error("aborted"));
              if (req) req.onsuccess = () => resolve(req.result);else tx.oncomplete = () => resolve();
            }));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  get(k) {
    return this._tx("readonly", s => s.get(k));
  },
  set(k, v) {
    return this._tx("readwrite", s => s.put(v, k));
  },
  del(k) {
    return this._tx("readwrite", s => s.delete(k));
  },
  keys() {
    return this._tx("readonly", s => s.getAllKeys());
  },
  size() {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var e;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return navigator.storage.estimate();
          case 3:
            e = _context2.sent;
            return _context2.abrupt("return", {
              used: e.usage || 0,
              quota: e.quota || 0
            });
          case 7:
            _context2.prev = 7;
            _context2.t0 = _context2["catch"](0);
            return _context2.abrupt("return", {
              used: 0,
              quota: 0
            });
          case 10:
          case "end":
            return _context2.stop();
        }
      }, _callee2, null, [[0, 7]]);
    }))();
  },
  /* usage() has to answer synchronously for a render, so the browser's own
     estimate is fetched in the background and read from here. */
  est: null,
  refresh() {
    this.size().then(e => {
      this.est = e;
    }).catch(() => {});
    return this.est;
  }
};
var EXPORT_NAG_DAYS = 14; // remind to download a backup after this long
var DAY = 86400000;

/* ---------- PIN hashing ----------
   PINs are never stored or exported in plaintext. We keep a per-install
   random salt + a SHA-256 digest of salt+PIN. A 4-digit PIN is a small
   keyspace (10k) so this is obfuscation against casual snooping, not
   strong crypto — it removes plaintext exposure and the reveal button. */
function sha256(ascii) {
  function rr(v, a) {
    return v >>> a | v << 32 - a;
  }
  var mp = Math.pow,
    maxWord = mp(2, 32);
  var result = "",
    words = [],
    i,
    j;
  var asciiBitLength = ascii.length * 8;
  var hash = sha256.h = sha256.h || [];
  var k = sha256.k = sha256.k || [];
  var primeCounter = k.length;
  var isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = mp(candidate, .5) * maxWord | 0;
      k[primeCounter++] = mp(candidate, 1 / 3) * maxWord | 0;
    }
  }
  ascii += "\x80";
  while (ascii.length % 64 - 56) ascii += "\x00";
  for (i = 0; i < ascii.length; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return "";
    words[i >> 2] |= j << (3 - i) % 4 * 8;
  }
  words[words.length] = asciiBitLength / maxWord | 0;
  words[words.length] = asciiBitLength;
  for (j = 0; j < words.length;) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var w15 = w[i - 15],
        w2 = w[i - 2];
      var a = hash[0],
        e = hash[4];
      var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + (e & hash[5] ^ ~e & hash[6]) + k[i] + (w[i] = i < 16 ? w[i] : w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ w15 >>> 3) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ w2 >>> 10) | 0);
      var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + (a & hash[1] ^ a & hash[2] ^ hash[1] & hash[2]);
      hash = [t1 + t2 | 0].concat(hash);
      hash[4] = hash[4] + t1 | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = hash[i] + oldHash[i] | 0;
  }
  for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) {
    var b = hash[i] >> j * 8 & 255;
    result += (b < 16 ? 0 : "") + b.toString(16);
  }
  return result;
}
function randSalt() {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return [...a].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  return (Math.random().toString(36) + Math.random().toString(36)).replace(/[^a-z0-9]/g, "").slice(0, 24);
}
function hashPin(pin, salt) {
  return sha256((salt || "") + "$" + String(pin));
}

/* ---------- Avatar palette (Apple-ish gradients) ---------- */
var AV_COLORS = [["#ff9f0a", "#ff6b22"], ["#0a84ff", "#0055d4"], ["#30d158", "#1fa946"], ["#bf5af2", "#8e2de2"], ["#ff375f", "#d61f47"], ["#64d2ff", "#2fa8e0"], ["#ffd60a", "#e0a800"], ["#5e5ce6", "#3634a3"], ["#ff453a", "#c22b22"], ["#30b0c7", "#1d8a9e"]];
var STATION_ICONS = ["🪚", "📏", "⚙️", "🔩", "🌀", "🎨", "🔍", "📦", "🪵", "🧰", "🪛", "🗜️", "🚪", "🪞", "🛠️", "✨"];
var MATERIAL_ICONS = ["🟫", "🪵", "🧻", "🧴", "🧲", "🔩", "🪝", "🎨", "🧪", "📦", "🪟", "⬜️"];
var PORTFOLIO_ICONS = ["📁", "☕️", "🏨", "🏠", "🏢", "📦", "🛋", "🚪", "🍽", "🧒"];

/* ---------- Stations (production + engineering stages) ---------- */
var SEED_STATIONS = [{
  id: "cut",
  name: "Cutting",
  icon: "🪚",
  ic: "saw",
  estMins: 90,
  kind: "prod"
}, {
  id: "edge",
  name: "Edge Banding",
  icon: "📏",
  ic: "ruler",
  estMins: 60,
  kind: "prod"
}, {
  id: "cnc",
  name: "CNC / Drilling",
  icon: "⚙️",
  ic: "drill",
  estMins: 75,
  kind: "prod"
}, {
  id: "asm",
  name: "Assembly",
  icon: "🔩",
  ic: "wrench",
  estMins: 150,
  kind: "prod"
}, {
  id: "sand",
  name: "Sanding",
  icon: "🌀",
  ic: "disc",
  estMins: 60,
  kind: "prod"
}, {
  id: "fin",
  name: "Finishing",
  icon: "🎨",
  ic: "brush",
  estMins: 120,
  kind: "prod"
}, {
  id: "qc",
  name: "Quality Check",
  icon: "🔍",
  ic: "badge",
  estMins: 30,
  kind: "prod"
}, {
  id: "pack",
  name: "Packing",
  icon: "📦",
  ic: "box",
  estMins: 45,
  kind: "prod"
}];
var ENG_STATIONS = [{
  id: "eg-brief",
  name: "Brief",
  icon: "📋",
  ic: "bulb",
  estMins: 60,
  kind: "eng"
}, {
  id: "eg-meas",
  name: "Measurement",
  icon: "📐",
  ic: "compass",
  estMins: 120,
  kind: "eng"
}, {
  id: "eg-design",
  name: "Design & Drawings",
  icon: "✏️",
  ic: "pencil",
  estMins: 480,
  kind: "eng"
}, {
  id: "eg-appr",
  name: "Client Approval",
  icon: "🤝",
  ic: "handshake",
  estMins: 60,
  kind: "eng"
}, {
  id: "eg-cam",
  name: "CNC Programs",
  icon: "💾",
  ic: "cpu",
  estMins: 180,
  kind: "eng"
}, {
  id: "eg-hand",
  name: "Handoff to Production",
  icon: "🏭",
  ic: "factory",
  estMins: 30,
  kind: "eng"
}];
var STATION_IC_KEYS = ["saw", "ruler", "drill", "wrench", "disc", "brush", "badge", "box", "hammer", "toolbox", "bulb", "compass", "pencil", "handshake", "cpu", "factory", "door", "sparkles"];
var MATERIAL_IC_KEYS = ["layers", "roll", "bottle", "screw", "flask", "box", "square", "toolbox"];
var PORTFOLIO_IC_KEYS = ["folder", "cup", "building", "home", "bed", "door", "child", "box", "archive", "sparkles"];

/* ---------- Articles (standard products with lane routings) ----------
   Each lane = a part group produced in parallel (Facades, Carcass…).
   The lane with group:null is the shared final lane (assembly → pack)
   and starts once every part lane has produced pieces.
   mpu = minutes per unit. */
function seedArticles() {
  return [{
    id: "a-bc600",
    sku: "BC-600",
    name: "Base cabinet 600",
    unit: "pcs",
    lanes: [{
      group: "Carcass",
      route: [{
        stationId: "cut",
        mpu: 8
      }, {
        stationId: "edge",
        mpu: 6
      }, {
        stationId: "cnc",
        mpu: 5
      }]
    }, {
      group: "Facades",
      route: [{
        stationId: "cut",
        mpu: 6
      }, {
        stationId: "edge",
        mpu: 5
      }, {
        stationId: "sand",
        mpu: 4
      }, {
        stationId: "fin",
        mpu: 8
      }]
    }, {
      group: null,
      route: [{
        stationId: "asm",
        mpu: 15
      }, {
        stationId: "qc",
        mpu: 3
      }, {
        stationId: "pack",
        mpu: 5
      }]
    }]
  }, {
    id: "a-wc800",
    sku: "WC-800",
    name: "Wall cabinet 800",
    unit: "pcs",
    lanes: [{
      group: "Carcass",
      route: [{
        stationId: "cut",
        mpu: 7
      }, {
        stationId: "edge",
        mpu: 5
      }, {
        stationId: "cnc",
        mpu: 4
      }]
    }, {
      group: "Facades",
      route: [{
        stationId: "cut",
        mpu: 5
      }, {
        stationId: "edge",
        mpu: 4
      }, {
        stationId: "fin",
        mpu: 7
      }]
    }, {
      group: null,
      route: [{
        stationId: "asm",
        mpu: 12
      }, {
        stationId: "qc",
        mpu: 3
      }, {
        stationId: "pack",
        mpu: 4
      }]
    }]
  }, {
    id: "a-tb160",
    sku: "TB-O160",
    name: "Oak table 1600",
    unit: "pcs",
    lanes: [{
      group: "Tops",
      route: [{
        stationId: "cut",
        mpu: 20
      }, {
        stationId: "sand",
        mpu: 15
      }, {
        stationId: "fin",
        mpu: 25
      }]
    }, {
      group: "Frames & legs",
      route: [{
        stationId: "cut",
        mpu: 15
      }, {
        stationId: "cnc",
        mpu: 10
      }]
    }, {
      group: null,
      route: [{
        stationId: "asm",
        mpu: 20
      }, {
        stationId: "qc",
        mpu: 5
      }, {
        stationId: "pack",
        mpu: 10
      }]
    }]
  }];
}

/* ---------- Warehouse seed ---------- */
function seedMaterials() {
  return [{
    id: "mat1",
    sku: "MDF-18",
    name: "MDF board 18 mm",
    unit: "pcs",
    qty: 34,
    minQty: 10,
    location: "A1",
    icon: "🟫",
    supplierId: "sup1"
  }, {
    id: "mat2",
    sku: "PLY-12",
    name: "Birch plywood 12 mm",
    unit: "pcs",
    qty: 18,
    minQty: 8,
    location: "A2",
    icon: "🪵",
    supplierId: "sup1"
  }, {
    id: "mat3",
    sku: "OAK-20",
    name: "Oak panel 20 mm",
    unit: "pcs",
    qty: 12,
    minQty: 6,
    location: "A3",
    icon: "🪵",
    supplierId: "sup1"
  }, {
    id: "mat4",
    sku: "EB-W23",
    name: "Edge banding, white 23 mm",
    unit: "m",
    qty: 240,
    minQty: 100,
    location: "B1",
    icon: "🧻",
    supplierId: "sup1"
  }, {
    id: "mat5",
    sku: "EB-O23",
    name: "Edge banding, oak 23 mm",
    unit: "m",
    qty: 65,
    minQty: 80,
    location: "B1",
    icon: "🧻",
    supplierId: "sup1"
  }, {
    id: "mat6",
    sku: "LAC-M",
    name: "Matte lacquer",
    unit: "L",
    qty: 2,
    minQty: 10,
    location: "C2",
    icon: "🧴",
    supplierId: "sup3"
  }, {
    id: "mat7",
    sku: "GLU-D3",
    name: "Wood glue D3",
    unit: "L",
    qty: 14,
    minQty: 5,
    location: "C1",
    icon: "🧴",
    supplierId: "sup3"
  }, {
    id: "mat8",
    sku: "HNG-HET",
    name: "Hettich hinges",
    unit: "pcs",
    qty: 260,
    minQty: 100,
    location: "D4",
    icon: "🪝",
    supplierId: "sup2"
  }, {
    id: "mat9",
    sku: "SLD-500",
    name: "Drawer slides 500 mm",
    unit: "pairs",
    qty: 42,
    minQty: 20,
    location: "D2",
    icon: "🔩",
    supplierId: "sup2"
  }, {
    id: "mat10",
    sku: "SCR-435",
    name: "Screws 4×35",
    unit: "boxes",
    qty: 9,
    minQty: 4,
    location: "D1",
    icon: "📦",
    supplierId: "sup2"
  }, {
    id: "mat11",
    sku: "SND-180",
    name: "Sandpaper P180",
    unit: "sheets",
    qty: 55,
    minQty: 40,
    location: "C3",
    icon: "🧻",
    supplierId: "sup3"
  }];
}
function seedSuppliers() {
  return [{
    id: "sup1",
    name: "Medienos centras",
    contact: "Rimas Petraitis",
    email: "uzsakymai@medienoscentras.lt",
    phone: "+370 600 11223",
    leadDays: 5,
    notes: "Boards and edge banding. Cut-off for next-day delivery is 14:00."
  }, {
    id: "sup2",
    name: "Hettich Lietuva",
    contact: "Agnė Kazlauskienė",
    email: "sales@hettich.lt",
    phone: "+370 601 44556",
    leadDays: 10,
    notes: "Hinges and slides. Orders under €300 carry a delivery fee."
  }, {
    id: "sup3",
    name: "Dažų ir lakų namai",
    contact: "Tomas Verba",
    email: "info@lakunamai.lt",
    phone: "+370 602 77889",
    leadDays: 3,
    notes: ""
  }];
}
function seedPurchases(now) {
  return [{
    id: "po1",
    num: "PO-1001",
    supplierId: "sup1",
    status: "sent",
    createdAt: now - 4 * DAY,
    createdBy: "m2",
    sentAt: now - 4 * DAY,
    expectedAt: now + 1 * DAY,
    receivedAt: null,
    notes: "",
    lines: [{
      id: "pl1",
      materialId: "mat5",
      qty: 200,
      received: 0
    }, {
      id: "pl2",
      materialId: "mat2",
      qty: 20,
      received: 0
    }]
  }, {
    id: "po2",
    num: "PO-1002",
    supplierId: "sup3",
    status: "draft",
    createdAt: now - 6 * 3600000,
    createdBy: "m2",
    sentAt: null,
    expectedAt: null,
    receivedAt: null,
    notes: "Waiting on a price for the matte lacquer.",
    lines: [{
      id: "pl3",
      materialId: "mat6",
      qty: 20,
      received: 0
    }]
  }];
}
function seedStockMoves() {
  var now = Date.now();
  return [{
    id: "sm1",
    ts: now - 5 * DAY,
    materialId: "mat1",
    delta: +40,
    note: "Delivery — Medienos centras",
    who: "m2"
  }, {
    id: "sm2",
    ts: now - 4 * DAY,
    materialId: "mat1",
    delta: -24,
    note: "Consumed for WO-1041",
    orderId: "o1",
    who: "m3"
  }, {
    id: "sm3",
    ts: now - 4 * DAY,
    materialId: "mat4",
    delta: -120,
    note: "Consumed for WO-1041",
    orderId: "o1",
    who: "m4"
  }, {
    id: "sm4",
    ts: now - 3 * DAY,
    materialId: "mat3",
    delta: -16,
    note: "Consumed for WO-1043",
    orderId: "o3",
    who: "m3"
  }, {
    id: "sm5",
    ts: now - 2 * DAY,
    materialId: "mat8",
    delta: +100,
    note: "Delivery — Hettich",
    who: "m2"
  }, {
    id: "sm6",
    ts: now - 2 * DAY,
    materialId: "mat6",
    delta: -3,
    note: "Stocktake correction",
    who: "m2"
  }, {
    id: "sm7",
    ts: now - 1 * DAY,
    materialId: "mat1",
    delta: -8,
    note: "Consumed for WO-1042",
    orderId: "o2",
    who: "m3"
  }];
}
var lineSeq = 1;
var mkLine = (materialId, qty, consumed) => ({
  id: "ln" + lineSeq++,
  materialId,
  qty,
  consumed: !!consumed,
  consumedAt: consumed ? Date.now() - 3 * DAY : null,
  consumedBy: consumed ? "m3" : null
});
function seedOrderLines(orderId) {
  switch (orderId) {
    case "o1":
      return [mkLine("mat1", 24, true), mkLine("mat4", 120, true), mkLine("mat8", 48), mkLine("mat9", 12)];
    case "o2":
      return [mkLine("mat1", 8, true), mkLine("mat5", 40)];
    case "o3":
      return [mkLine("mat3", 16, true), mkLine("mat6", 6)];
    // lacquer shortage → the block
    case "o4":
      return [mkLine("mat1", 6)];
    case "o5":
      return [mkLine("mat1", 9), mkLine("mat4", 60)];
    case "o12":
      return [mkLine("mat1", 40), mkLine("mat4", 200)];
    default:
      return [];
  }
}
var uid = p => p + Math.random().toString(36).slice(2, 9);
/* structuredClone is a 2022 browser; this file already round-tripped JSON
   everywhere else, and a shop tablet should not need a new Chrome to copy
   an order. */
var deepCopy = v => JSON.parse(JSON.stringify(v));
var esc0 = v => String(v !== null && v !== void 0 ? v : ""); // activity text is plain, escaped at render time

/* Build ops for an item from an article's lanes.
   prog: `${group||"_"}/${stationId}` -> [status, qtyDone, who, loggedMins, blockNote] */
function opsFromArticle(article, item, prog = {}) {
  var now = Date.now();
  var ops = [];
  var _iterator = _createForOfIteratorHelper(article.lanes),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var lane = _step.value;
      var _iterator2 = _createForOfIteratorHelper(lane.route),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var r = _step2.value;
          var key = `${lane.group || "_"}/${r.stationId}`;
          var _ref = prog[key] || [],
            _ref2 = _slicedToArray(_ref, 5),
            _ref2$ = _ref2[0],
            status = _ref2$ === void 0 ? "queued" : _ref2$,
            _ref2$2 = _ref2[1],
            qtyDone = _ref2$2 === void 0 ? 0 : _ref2$2,
            _ref2$3 = _ref2[2],
            who = _ref2$3 === void 0 ? null : _ref2$3,
            _ref2$4 = _ref2[3],
            logged = _ref2$4 === void 0 ? 0 : _ref2$4,
            _ref2$5 = _ref2[4],
            blockNote = _ref2$5 === void 0 ? null : _ref2$5;
          ops.push({
            id: uid("op"),
            itemId: item.id,
            group: lane.group,
            stationId: r.stationId,
            estMins: Math.max(5, Math.round(r.mpu * item.qty)),
            status,
            qtyDone: status === "done" ? item.qty : qtyDone,
            assigneeId: who,
            loggedMs: logged * 60000,
            startedAt: status === "running" ? now - 22 * 60000 : null,
            completedAt: status === "done" ? now - 2 * DAY : null,
            blockNote
          });
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return ops;
}

/* ---------- Whiteboard starter content ---------- */
function seedBoard(members, lt) {
  var by = i => members[i % members.length].id;
  var now = Date.now();
  var T = lt ? {
    name: "Idėjų lenta",
    title: "Dėdės Baldai — idėjų lenta",
    s1: "Galandinti obliaus peilius kas penktadienį",
    s2: "Atraižų lentyna prie CNC — naudoti >300 mm",
    s3: "Dažyklai reikia geresnės ventiliacijos!",
    th: ["Staklės", "Aptarnauta", "Kitas kartas"],
    tr1: ["CNC", "2026-06-10", "2026-09-10"],
    tr2: ["Obliavimo", "2026-05-02", "2026-08-02"],
    w1: "Idėja 💡",
    w2: "Išbandom viename užsakyme",
    w3: "Tampa standartu ✅"
  } : {
    name: "Shop improvement board",
    title: "Shop improvement board",
    s1: "Sharpen planer blades every Friday",
    s2: "Offcut shelf near CNC — reuse >300 mm pieces",
    s3: "Lacquer room needs better extraction!",
    th: ["Machine", "Last service", "Next due"],
    tr1: ["CNC", "2026-06-10", "2026-09-10"],
    tr2: ["Planer", "2026-05-02", "2026-08-02"],
    w1: "Idea 💡",
    w2: "Try it on one order",
    w3: "Make it standard ✅"
  };
  var els = [{
    id: uid("we"),
    type: "text",
    x: 40,
    y: 16,
    w: 420,
    h: 48,
    color: 6,
    text: T.title,
    by: by(0),
    ts: now - 6 * DAY
  }, {
    id: uid("we"),
    type: "sticky",
    x: 40,
    y: 90,
    w: 180,
    h: 180,
    color: 0,
    text: T.s1,
    by: by(2),
    ts: now - 5 * DAY
  }, {
    id: uid("we"),
    type: "sticky",
    x: 244,
    y: 90,
    w: 180,
    h: 180,
    color: 4,
    text: T.s2,
    by: by(4),
    ts: now - 4 * DAY
  }, {
    id: uid("we"),
    type: "sticky",
    x: 448,
    y: 90,
    w: 180,
    h: 180,
    color: 2,
    text: T.s3,
    by: by(5),
    ts: now - 2 * DAY
  }, {
    id: uid("we"),
    type: "table",
    x: 40,
    y: 320,
    w: 360,
    h: 0,
    color: 6,
    text: "",
    rows: [T.th, T.tr1, T.tr2],
    by: by(1),
    ts: now - 3 * DAY
  }, {
    id: "wf1-" + (lt ? "lt" : "en"),
    type: "shape",
    x: 470,
    y: 320,
    w: 190,
    h: 64,
    color: 4,
    kind: "pill",
    text: T.w1,
    by: by(0),
    ts: now - 3 * DAY
  }, {
    id: "wf2-" + (lt ? "lt" : "en"),
    type: "shape",
    x: 470,
    y: 424,
    w: 190,
    h: 64,
    color: 0,
    kind: "rect",
    text: T.w2,
    by: by(0),
    ts: now - 3 * DAY
  }, {
    id: "wf3-" + (lt ? "lt" : "en"),
    type: "shape",
    x: 470,
    y: 528,
    w: 190,
    h: 64,
    color: 3,
    kind: "rect",
    text: T.w3,
    by: by(0),
    ts: now - 3 * DAY
  }];
  var conns = [{
    id: uid("wc"),
    from: "wf1-" + (lt ? "lt" : "en"),
    to: "wf2-" + (lt ? "lt" : "en")
  }, {
    id: uid("wc"),
    from: "wf2-" + (lt ? "lt" : "en"),
    to: "wf3-" + (lt ? "lt" : "en")
  }];
  return {
    id: uid("wb"),
    name: T.name,
    createdBy: members[0].id,
    createdAt: now - 6 * DAY,
    updatedAt: now - 2 * DAY,
    els,
    conns,
    visibility: "team",
    memberIds: []
  };
}

/* ---------- Planner (general PM) seed ---------- */
var GP_COLORS = ["blue", "indigo", "teal", "purple", "orange", "green", "red", "gray"];
function defaultStages() {
  return [{
    id: uid("gs"),
    name: "Backlog",
    color: "gray",
    done: false
  }, {
    id: uid("gs"),
    name: "To do",
    color: "blue",
    done: false
  }, {
    id: uid("gs"),
    name: "In progress",
    color: "orange",
    done: false
  }, {
    id: uid("gs"),
    name: "In review",
    color: "purple",
    done: false
  }, {
    id: uid("gs"),
    name: "Done",
    color: "green",
    done: true
  }];
}
function seedPlanner(members) {
  var now = Date.now();
  var by = i => (members[i % members.length] || members[0]).id;
  var mk = (name, key, color, icon, tasks) => {
    var stages = defaultStages();
    var S = n => stages[n].id;
    var ord = 0;
    return {
      id: uid("gp"),
      name,
      key,
      color,
      icon,
      desc: "",
      createdBy: by(0),
      createdAt: now - 20 * DAY,
      archived: false,
      stages,
      labels: [{
        id: uid("gl"),
        name: "Bug",
        color: "red"
      }, {
        id: uid("gl"),
        name: "Design",
        color: "purple"
      }, {
        id: uid("gl"),
        name: "Urgent",
        color: "orange"
      }],
      tasks: tasks.map(([title, si, who, dueD, prio, subs]) => ({
        id: uid("gt"),
        title,
        desc: "",
        stageId: S(si),
        assigneeId: who,
        due: dueD == null ? null : now + dueD * DAY,
        start: null,
        priority: prio || "normal",
        labelIds: [],
        subtasks: (subs || []).map(t => ({
          id: uid("gk"),
          title: t[0],
          done: !!t[1]
        })),
        comments: [],
        createdBy: by(0),
        createdAt: now - 18 * DAY,
        ord: ord++
      }))
    };
  };
  return [mk("Website relaunch", "WEB", "blue", "sparkles", [["Finalise sitemap", 4, by(0), -2, "high", [["Home", true], ["Products", true], ["Contact", false]]], ["Write homepage copy", 2, by(1), 3, "normal"], ["Design system in Figma", 2, by(1), 5, "high"], ["Set up CMS", 1, by(0), 9, "normal"], ["Photo shoot — workshop", 3, by(1), 1, "high", [["Book photographer", true], ["Shot list", false]]], ["Migrate old blog posts", 0, null, 14, "low"], ["Launch checklist", 1, by(0), 12, "normal"]]), mk("Q3 marketing", "MKT", "orange", "flame", [["Plan autumn campaign", 2, by(0), 2, "high"], ["Instagram content calendar", 1, by(1), 6, "normal", [["Week 1", true], ["Week 2", false], ["Week 3", false]]], ["Email newsletter #8", 3, by(1), -1, "high"], ["Trade fair booth brief", 0, by(0), 20, "normal"], ["Review ad budget", 4, by(0), -3, "normal"]]), mk("Office move", "OPS", "teal", "building", [["Get quotes from movers", 4, by(0), -5, "normal"], ["New floor plan", 2, by(1), 4, "normal", [["Measure space", true], ["Desk layout", false]]], ["Update address everywhere", 1, by(0), 10, "low"], ["Internet + phones", 1, by(0), 7, "high"]])];
}
function seedData() {
  var now = Date.now();
  var members = [{
    id: "m1",
    name: "Ričardas",
    trade: "Owner",
    role: "manager",
    pin: "1234",
    color: 1
  }, {
    id: "m2",
    name: "Eglė",
    trade: "Production Manager",
    role: "manager",
    pin: "5678",
    color: 3
  }, {
    id: "m8",
    name: "Rūta",
    trade: "Design & Drawings",
    role: "engineer",
    pin: "6789",
    color: 7,
    station: "eg-design"
  }, {
    id: "m3",
    name: "Andrius",
    trade: "Cutting & Panels",
    role: "worker",
    pin: "1111",
    color: 0,
    station: "cut"
  }, {
    id: "m4",
    name: "Lukas",
    trade: "Edge & CNC",
    role: "worker",
    pin: "2222",
    color: 5,
    station: "cnc"
  }, {
    id: "m5",
    name: "Jonas",
    trade: "Assembly",
    role: "worker",
    pin: "3333",
    color: 2,
    station: "asm"
  }, {
    id: "m6",
    name: "Milda",
    trade: "Finishing",
    role: "worker",
    pin: "4444",
    color: 4,
    station: "fin"
  }, {
    id: "m7",
    name: "Greta",
    trade: "QC & Packing",
    role: "worker",
    pin: "5555",
    color: 9,
    station: "qc"
  }];
  var articles = seedArticles();
  var artOf = id => articles.find(a => a.id === id);

  /* Flat ops builder for custom orders (single General item, one lane) */
  var opSeq = 1;
  var mkOps = (itemId, specs) => specs.map(([st, status, who, logged, qtyDone]) => {
    var stn = SEED_STATIONS.find(s => s.id === st);
    return {
      id: "op" + opSeq++,
      itemId,
      group: null,
      stationId: st,
      estMins: stn.estMins,
      status: status || "queued",
      qtyDone: qtyDone !== null && qtyDone !== void 0 ? qtyDone : 0,
      assigneeId: who || null,
      loggedMs: (logged || 0) * 60000,
      startedAt: status === "running" ? now - 22 * 60000 : null,
      completedAt: status === "done" ? now - 3 * DAY : null,
      blockNote: null
    };
  });
  /* single-item custom order helper */
  var flat = (id, qty, specs) => {
    var item = {
      id: id + "-it0",
      articleId: null,
      name: "General",
      qty
    };
    var ops = mkOps(item.id, specs.map(s => {
      // done ops carry full qty
      if (s[1] === "done") return [...s.slice(0, 4), qty];
      return s;
    }));
    return {
      items: [item],
      ops
    };
  };

  /* ---- o1: standard kitchen from articles, lanes mid-flow ---- */
  var o1it1 = {
    id: "o1-it1",
    articleId: "a-bc600",
    name: "Base cabinet 600",
    qty: 8
  };
  var o1it2 = {
    id: "o1-it2",
    articleId: "a-wc800",
    name: "Wall cabinet 800",
    qty: 4
  };
  var o1ops = [...opsFromArticle(artOf("a-bc600"), o1it1, {
    "Carcass/cut": ["done", 8, "m3", 70],
    "Carcass/edge": ["done", 8, "m4", 50],
    "Carcass/cnc": ["paused", 5, "m4", 40],
    "Facades/cut": ["done", 8, "m3", 50],
    "Facades/edge": ["done", 8, "m4", 40],
    "Facades/sand": ["done", 8, "m6", 35],
    "Facades/fin": ["done", 8, "m6", 70],
    "_/asm": ["running", 3, "m5", 95]
  }), ...opsFromArticle(artOf("a-wc800"), o1it2, {
    "Carcass/cut": ["done", 4, "m3", 30],
    "Facades/cut": ["done", 4, "m3", 22]
  })];

  /* ---- o3: rush tables from article, finishing blocked ---- */
  var o3it = {
    id: "o3-it1",
    articleId: "a-tb160",
    name: "Oak table 1600",
    qty: 8
  };
  var o3ops = opsFromArticle(artOf("a-tb160"), o3it, {
    "Tops/cut": ["done", 8, "m3", 160],
    "Tops/sand": ["done", 8, "m6", 75],
    "Tops/fin": ["blocked", 3, "m6", 40, "Out of matte lacquer — delivery expected tomorrow"],
    "Frames & legs/cut": ["done", 8, "m3", 60],
    "Frames & legs/cnc": ["done", 8, "m4", 45]
  });

  /* ---- o12: standard stock batch, all queued ---- */
  var o12it = {
    id: "o12-it1",
    articleId: "a-bc600",
    name: "Base cabinet 600",
    qty: 20
  };
  var o12ops = opsFromArticle(artOf("a-bc600"), o12it, {});

  /* ---- o13: engineering project ---- */
  var o13it = {
    id: "o13-it1",
    articleId: null,
    name: "Project",
    qty: 1
  };
  var o13ops = ["eg-brief", "eg-meas", "eg-design", "eg-appr", "eg-cam", "eg-hand"].map((st, i) => {
    var stn = ENG_STATIONS.find(s => s.id === st);
    var status = i < 2 ? "done" : i === 2 ? "running" : "queued";
    return {
      id: uid("op"),
      itemId: o13it.id,
      group: null,
      stationId: st,
      estMins: stn.estMins,
      status,
      qtyDone: status === "done" ? 1 : 0,
      assigneeId: i <= 2 ? "m8" : null,
      loggedMs: (i === 2 ? 190 : i < 2 ? stn.estMins : 0) * 60000,
      startedAt: status === "running" ? now - 35 * 60000 : null,
      completedAt: status === "done" ? now - 2 * DAY : null,
      blockNote: null
    };
  });
  var orders = [{
    id: "o1",
    num: "WO-1041",
    type: "prod",
    product: "Oak kitchen — Vilniaus g. 14",
    client: "Šiaulių NT projektai",
    qty: 12,
    unit: "cabinets",
    priority: "high",
    due: now + 2 * DAY,
    shipped: false,
    portfolioId: "p2",
    notes: "Handleless fronts, matte lacquer NCS S 0502-Y. Client wants site delivery before Aug 1.",
    createdAt: now - 9 * DAY,
    items: [o1it1, o1it2],
    ops: o1ops
  }, _objectSpread({
    id: "o2",
    num: "WO-1042",
    type: "prod",
    product: "Walnut wardrobe, sliding doors",
    client: "A. Petrauskienė",
    qty: 1,
    unit: "unit",
    priority: "normal",
    due: now + 6 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "Soft-close Hettich rails. Mirror on middle door.",
    createdAt: now - 7 * DAY
  }, flat("o2", 1, [["cut", "done", "m3", 95], ["edge", "done", "m4", 55], ["cnc", "queued", "m4"], ["asm"], ["sand"], ["fin"], ["qc"], ["pack"]])), {
    id: "o3",
    num: "WO-1043",
    type: "prod",
    product: "Restaurant tables ×8",
    client: "Bistro „Ąžuolas“",
    qty: 8,
    unit: "tables",
    priority: "rush",
    due: now - 1 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "RUSH — opening pushed to next week. Solid oak tops, steel legs arrive Thursday.",
    createdAt: now - 12 * DAY,
    items: [o3it],
    ops: o3ops
  }, _objectSpread({
    id: "o4",
    num: "WO-1044",
    type: "prod",
    product: "Office reception counter",
    client: "UAB Baltic Hub",
    qty: 1,
    unit: "unit",
    priority: "normal",
    due: now + 11 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "Corian top ordered separately — arrives in ~1 week.",
    createdAt: now - 4 * DAY
  }, flat("o4", 1, [["cut", "running", "m3", 35], ["edge"], ["cnc"], ["asm"], ["sand"], ["fin"], ["qc"], ["pack"]])), _objectSpread({
    id: "o5",
    num: "WO-1045",
    type: "prod",
    product: "Bathroom vanities ×3",
    client: "Domus Interjeras",
    qty: 3,
    unit: "units",
    priority: "normal",
    due: now + 4 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "Moisture-resistant MDF, painted RAL 7016.",
    createdAt: now - 6 * DAY
  }, flat("o5", 3, [["cut", "done", "m3", 80], ["edge", "queued", null], ["cnc"], ["asm"], ["fin"], ["qc"], ["pack"]])), _objectSpread({
    id: "o6",
    num: "WO-1046",
    type: "prod",
    product: "TV wall unit, smoked oak",
    client: "M. Kazlauskas",
    qty: 1,
    unit: "unit",
    priority: "low",
    due: now + 16 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "",
    createdAt: now - 2 * DAY
  }, flat("o6", 1, [["cut"], ["edge"], ["cnc"], ["asm"], ["sand"], ["fin"], ["qc"], ["pack"]])), _objectSpread({
    id: "o7",
    num: "WO-1047",
    type: "prod",
    product: "Kids room set — bed + desk",
    client: "I. Jankauskienė",
    qty: 2,
    unit: "pieces",
    priority: "high",
    due: now + 1 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "Birch plywood, rounded corners everywhere, water-based lacquer only.",
    createdAt: now - 10 * DAY
  }, flat("o7", 2, [["cut", "done", "m3", 70], ["cnc", "done", "m4", 60], ["asm", "done", "m5", 130], ["sand", "done", "m6", 45], ["fin", "done", "m6", 95], ["qc", "paused", "m7", 12, 1], ["pack"]])), _objectSpread({
    id: "o8",
    num: "WO-1048",
    type: "prod",
    product: "Wardrobe doors refit ×6",
    client: "Senamiesčio butai",
    qty: 6,
    unit: "doors",
    priority: "normal",
    due: now + 3 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "",
    createdAt: now - 5 * DAY
  }, flat("o8", 6, [["cut", "done", "m3", 55], ["edge", "running", "m4", 20, 2], ["fin"], ["qc"], ["pack"]])), _objectSpread({
    id: "o9",
    num: "WO-1039",
    type: "prod",
    product: "Standing desks ×4, ash",
    client: "Kūrybos namai",
    qty: 4,
    unit: "desks",
    priority: "normal",
    due: now + 1 * DAY,
    shipped: false,
    portfolioId: null,
    notes: "Legs pre-ordered (Linak). Cable trays included.",
    createdAt: now - 15 * DAY
  }, flat("o9", 4, [["cut", "done", "m3", 90], ["edge", "done", "m4", 50], ["asm", "done", "m5", 120], ["sand", "done", "m6", 40], ["fin", "done", "m6", 110], ["qc", "done", "m7", 25], ["pack", "done", "m7", 30]])), _objectSpread({
    id: "o10",
    num: "WO-1038",
    type: "prod",
    product: "Oak bookshelf wall",
    client: "V. Norkus",
    qty: 1,
    unit: "unit",
    priority: "normal",
    due: now - 3 * DAY,
    shipped: true,
    shippedAt: now - 2 * DAY,
    portfolioId: null,
    notes: "",
    createdAt: now - 20 * DAY
  }, flat("o10", 1, [["cut", "done", "m3", 85], ["edge", "done", "m4", 45], ["asm", "done", "m5", 140], ["fin", "done", "m6", 100], ["qc", "done", "m7", 20], ["pack", "done", "m7", 35]])), _objectSpread({
    id: "o11",
    num: "WO-1049",
    type: "prod",
    product: "Café bar counter, 4.2 m",
    client: "Kavinė „Šviesa“",
    qty: 1,
    unit: "unit",
    priority: "high",
    due: now + 8 * DAY,
    shipped: false,
    portfolioId: "p1",
    notes: "Fluted oak front. Brass foot rail supplied by client.",
    createdAt: now - 1 * DAY
  }, flat("o11", 1, [["cut"], ["edge"], ["cnc"], ["asm"], ["sand"], ["fin"], ["qc"], ["pack"]])), {
    id: "o12",
    num: "WO-1050",
    type: "prod",
    product: "Base cabinets 600 — stock batch",
    client: "Stock",
    qty: 20,
    unit: "pcs",
    priority: "low",
    due: now + 18 * DAY,
    shipped: false,
    portfolioId: "p2",
    notes: "Standard batch for the showroom + stock.",
    createdAt: now - 1 * DAY,
    items: [o12it],
    ops: o12ops
  }, {
    id: "o13",
    num: "ENG-2043",
    type: "eng",
    product: "Bar counter — drawings & CNC programs",
    client: "Kavinė „Šviesa“",
    qty: 1,
    unit: "project",
    priority: "high",
    due: now + 5 * DAY,
    shipped: false,
    portfolioId: "p1",
    notes: "Fluted front detail 1:1 sample to approve. Brass rail bracket positions TBC.",
    createdAt: now - 3 * DAY,
    items: [o13it],
    ops: o13ops
  }];
  orders.forEach(o => {
    o.materials = seedOrderLines(o.id);
  });
  var activity = [{
    ts: now - 22 * 60000,
    who: "m5",
    orderId: "o1",
    text: "started **Assembly** on WO-1041 — 3 of 12 pcs done"
  }, {
    ts: now - 35 * 60000,
    who: "m2",
    orderId: "o13",
    text: "started **Design & Drawings** on ENG-2043"
  }, {
    ts: now - 47 * 60000,
    who: "m4",
    orderId: "o8",
    text: "started **Edge Banding** on WO-1048 — 2 of 6 pcs done"
  }, {
    ts: now - 70 * 60000,
    who: "m4",
    orderId: "o1",
    text: "reported **5 of 8 pcs** at CNC / Drilling · Carcass on WO-1041"
  }, {
    ts: now - 2 * 3600000,
    who: "m6",
    orderId: "o3",
    text: "blocked **Finishing · Tops** on WO-1043 — out of matte lacquer"
  }, {
    ts: now - 3 * 3600000,
    who: "m7",
    orderId: "o7",
    text: "paused **Quality Check** on WO-1047"
  }, {
    ts: now - 5 * 3600000,
    who: "m7",
    orderId: "o9",
    text: "completed **Packing** on WO-1039 — ready to ship"
  }, {
    ts: now - 8 * 3600000,
    who: "m3",
    orderId: "o4",
    text: "started **Cutting** on WO-1044"
  }, {
    ts: now - 1 * DAY,
    who: "m2",
    orderId: "o12",
    text: "created order **WO-1050** — Base cabinet 600 ×20"
  }, {
    ts: now - 1 * DAY - 3600000,
    who: "m6",
    orderId: "o7",
    text: "completed **Finishing** on WO-1047"
  }, {
    ts: now - 2 * DAY,
    who: "m2",
    materialId: "mat8",
    text: "received **100 pcs Hettich hinges**"
  }];
  var todos = [{
    id: uid("td"),
    text: "Order more matte lacquer (10 L)",
    forId: "m2",
    by: "m1",
    ts: now - 2 * 3600000,
    done: false,
    due: now + DAY
  }, {
    id: uid("td"),
    text: "Calibrate the edge bander before WO-1050",
    forId: "m4",
    by: "m2",
    ts: now - 5 * 3600000,
    done: false,
    due: now + 2 * DAY
  }, {
    id: uid("td"),
    text: "Send photos of WO-1039 desks to client",
    forId: "m1",
    by: "m1",
    ts: now - DAY,
    done: true,
    doneAt: now - 3 * 3600000
  }];
  var pinSalt = randSalt();
  members.forEach(m => {
    m.pinHash = hashPin(m.pin, pinSalt);
    delete m.pin;
  }); // never store plaintext

  // demo: the manager already confirmed the client is happy with the drawings for the eng project
  var o13 = orders.find(o => o.id === "o13");
  if (o13) o13.clientApproved = {
    at: now - 2 * 3600000,
    by: "m1"
  };
  var notifications = [{
    id: uid("nt"),
    forId: "m8",
    by: "m1",
    ts: now - 2 * 3600000,
    read: false,
    type: "client_ok",
    orderId: "o13",
    text: "Client approved the drawings for ENG-2043 — you're clear to proceed to CNC programs"
  }];
  orders.forEach(o => {
    if (!Array.isArray(o.comments)) o.comments = [];
    if (!o.parts) o.parts = [];
  }); // v13 comments, v15 parts

  return {
    v: 18,
    backupMeta: {
      lastExportAt: null,
      firstSeenAt: now
    },
    perms: JSON.parse(JSON.stringify(DEFAULT_PERMS)),
    shopName: "Dėdės Baldai",
    pinSalt,
    notifications,
    gprojects: seedPlanner(members),
    oneDrive: {
      baseUrl: "https://onedrive.live.com/Gervinsko-Baldai/Projektai",
      template: "{base}/{code}"
    },
    orderSeq: 1051,
    engSeq: 2044,
    members,
    stations: [...SEED_STATIONS, ...ENG_STATIONS],
    orders,
    activity,
    materials: seedMaterials(),
    stockMoves: seedStockMoves(),
    suppliers: seedSuppliers(),
    purchases: seedPurchases(now),
    poSeq: 1003,
    articles,
    portfolios: [{
      id: "p1",
      name: "Kavinė Šviesa fit-out",
      icon: "☕️",
      ic: "cup"
    }, {
      id: "p2",
      name: "Standard products — July",
      icon: "📦",
      ic: "box"
    }],
    boards: [seedBoard(members, false)],
    todos,
    shift: JSON.parse(JSON.stringify(DEFAULT_SHIFT)),
    scan: {
      prefixes: {}
    },
    scanLog: [],
    prefs: {}
  };
}

/* ============================================================
   Store
   ============================================================ */
var Store = {
  state: null,
  /* Boot the real way: the vault first, localStorage only to migrate out of.
     Falls back to the old synchronous path when IndexedDB is not there, so a
     locked-down browser still runs ShopFlow exactly as before. */
  boot() {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var doc, raw, back;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (Vault.supported()) {
              _context3.next = 3;
              break;
            }
            _this2.load();
            return _context3.abrupt("return", _this2._vault = false);
          case 3:
            doc = null;
            _context3.prev = 4;
            _context3.next = 7;
            return Vault.get("doc");
          case 7:
            doc = _context3.sent;
            _context3.next = 15;
            break;
          case 10:
            _context3.prev = 10;
            _context3.t0 = _context3["catch"](4);
            console.warn("[Store] vault unavailable:", _context3.t0 && _context3.t0.message);
            _this2.load();
            return _context3.abrupt("return", _this2._vault = false);
          case 15:
            _this2._vault = true;
            Vault.refresh(); // the browser's own figure, for Settings
            if (!doc) {
              _context3.next = 31;
              break;
            }
            _context3.prev = 18;
            _this2.state = typeof doc === "string" ? JSON.parse(doc) : doc;
            _this2.migrate();
            _context3.next = 23;
            return _this2._loadBackups();
          case 23:
            _this2._sessionBackup();
            _this2._writeIndex();
            return _context3.abrupt("return", true);
          case 28:
            _context3.prev = 28;
            _context3.t1 = _context3["catch"](18);
            console.warn("[Store] vault document unreadable:", _context3.t1 && _context3.t1.message);
          case 31:
            /* nothing in the vault yet: adopt whatever localStorage holds, prove it
               landed, and only then give the space back to the rest of the domain */
            raw = (() => {
              try {
                return localStorage.getItem(DB_KEY);
              } catch (_) {
                return null;
              }
            })();
            if (!raw) {
              _context3.next = 56;
              break;
            }
            _context3.prev = 33;
            _this2.state = JSON.parse(raw);
            _this2.migrate();
            _context3.next = 38;
            return Vault.set("doc", JSON.stringify(_this2.state));
          case 38:
            _context3.next = 40;
            return Vault.get("doc");
          case 40:
            back = _context3.sent;
            if (!back) {
              _context3.next = 46;
              break;
            }
            _context3.next = 44;
            return _this2._migrateBackups();
          case 44:
            try {
              localStorage.removeItem(DB_KEY);
            } catch (_) {}
            console.info("[Store] moved to the vault; localStorage freed");
          case 46:
            _context3.next = 48;
            return _this2._loadBackups();
          case 48:
            _this2._sessionBackup();
            _this2._writeIndex();
            return _context3.abrupt("return", true);
          case 53:
            _context3.prev = 53;
            _context3.t2 = _context3["catch"](33);
            console.warn("[Store] could not migrate:", _context3.t2 && _context3.t2.message);
          case 56:
            _this2.state = typeof REAL_SEED !== "undefined" ? JSON.parse(JSON.stringify(REAL_SEED)) : seedData();
            _this2.migrate();
            _context3.next = 60;
            return _this2._loadBackups();
          case 60:
            _this2.save();
            return _context3.abrupt("return", true);
          case 62:
          case "end":
            return _context3.stop();
        }
      }, _callee3, null, [[4, 10], [18, 28], [33, 53]]);
    }))();
  },
  load() {
    try {
      var raw = localStorage.getItem(DB_KEY);
      if (raw) {
        this.state = JSON.parse(raw);
        this.migrate();
        this._sessionBackup();
        return;
      }
    } catch (e) {
      // primary state is corrupted — recover from the newest auto-backup before reseeding
      var b = this._backups()[0];
      if (b) {
        try {
          this.state = JSON.parse(b.data);
          this.migrate();
          console.warn("[Store] recovered from backup", new Date(b.ts));
          return;
        } catch (_) {}
      }
    }
    // fresh start: prefer the real-workshop backup seed (realdata.js) when present
    this.state = typeof REAL_SEED !== "undefined" ? JSON.parse(JSON.stringify(REAL_SEED)) : seedData();
    this.migrate();
    this.save();
  },
  loadReal() {
    if (typeof REAL_SEED === "undefined") return false;
    this._backup("before restoring Dėdės Baldai backup");
    this.state = JSON.parse(JSON.stringify(REAL_SEED));
    this.migrate();
    this.save();
    return true;
  },
  loadDemo() {
    this._backup("before loading demo");
    this.state = seedData();
    this.save();
  },
  /* Upgrade older saved states in place (never lose user edits) */
  migrate() {
    var s = this.state;
    if (s && s.shopName === "Gervinsko Baldai") s.shopName = "Dėdės Baldai"; // old built-in default
    if (!s.v || s.v < 2) {
      if (!s.materials) s.materials = seedMaterials();
      if (!s.stockMoves) s.stockMoves = seedStockMoves();
      if (!s.prefs) s.prefs = {};
      s.orders.forEach(o => {
        if (!o.materials) o.materials = seedOrderLines(o.id);
      });
      s.activity.forEach(a => {
        if (!a.orderId) {
          var m = a.text.match(/WO-\d+/);
          if (m) {
            var o = s.orders.find(x => x.num === m[0]);
            if (o) a.orderId = o.id;
          }
        }
      });
      s.v = 2;
    }
    if (s.v < 3) {
      // stations: mark production kind, append engineering stages
      s.stations.forEach(st => {
        if (!st.kind) st.kind = "prod";
      });
      var _loop = function _loop() {
        var es = _ENG_STATIONS[_i];
        if (!s.stations.find(x => x.id === es.id)) s.stations.push(_objectSpread({}, es));
      };
      for (var _i = 0, _ENG_STATIONS = ENG_STATIONS; _i < _ENG_STATIONS.length; _i++) {
        _loop();
      }
      // catalogs
      if (!s.articles) s.articles = seedArticles();
      if (!s.portfolios) s.portfolios = [{
        id: "p1",
        name: "Kavinė Šviesa fit-out",
        icon: "☕️"
      }, {
        id: "p2",
        name: "Standard products — July",
        icon: "📦"
      }];
      if (!s.engSeq) s.engSeq = 2044;
      // orders: wrap flat ops into a single General item, add qty tracking
      s.orders.forEach(o => {
        o.type = o.type || (o.num && o.num.startsWith("ENG-") ? "eng" : "prod");
        if (o.portfolioId === undefined) o.portfolioId = o.id === "o11" ? "p1" : o.id === "o1" ? "p2" : null;
        if (!o.items) {
          var item = {
            id: o.id + "-it0",
            articleId: null,
            name: "General",
            qty: o.qty || 1
          };
          o.items = [item];
          o.ops.forEach(op => {
            op.itemId = item.id;
            if (op.group === undefined) op.group = null;
            if (op.qtyDone === undefined) op.qtyDone = op.status === "done" ? item.qty : 0;
          });
        }
      });
      s.v = 3;
    }
    if (s.v < 4) {
      // whiteboards: starter board in the workshop's language flavour
      var lt = /baldai/i.test(s.shopName || "") && s.shopName !== "Gervinsko Baldai";
      if (!s.boards) s.boards = [seedBoard(s.members, lt)];
      s.v = 4;
    }
    if (s.v < 5) {
      // vector icon keys for stations/materials/portfolios (legacy emoji kept as fallback)
      s.stations.forEach(st => {
        if (!st.ic) st.ic = EMOJI_ICON_MAP[st.icon] || (st.kind === "eng" ? "bulb" : "toolbox");
      });
      (s.materials || []).forEach(m => {
        if (!m.ic) m.ic = EMOJI_ICON_MAP[m.icon] || "box";
      });
      (s.portfolios || []).forEach(p => {
        if (!p.ic) p.ic = EMOJI_ICON_MAP[p.icon] || "folder";
      });
      // whiteboard sharing
      (s.boards || []).forEach(b => {
        if (!b.visibility) {
          b.visibility = "team";
          b.memberIds = [];
        }
      });
      // personal to-dos
      if (!s.todos) s.todos = [];
      s.v = 5;
    }
    if (s.v < 6) {
      // OneDrive project-files linking (base folder + per-project overrides)
      if (!s.oneDrive) s.oneDrive = {
        baseUrl: "",
        template: "{base}/{code}"
      };
      s.v = 6;
    }
    if (s.v < 7) {
      // QR / barcode scan stations
      if (!s.scan) s.scan = {
        prefixes: {}
      }; // { "<scanner prefix>": stationId }
      if (!s.scanLog) s.scanLog = [];
      s.v = 7;
    }
    if (s.v < 8) {
      // engineer role: design staff become "engineer" (only they + managers see engineering)
      s.members.forEach(m => {
        if (m.role === "manager" && /projektav|design|engineer|konstrukt/i.test(m.trade || "")) m.role = "engineer";
      });
      // project archive: ended (shipped/delivered) projects are archived
      s.orders.forEach(o => {
        if (o.archived === undefined) o.archived = !!o.shipped;
        if (o.archived && !o.archivedAt) o.archivedAt = o.shippedAt || Date.now();
      });
      s.v = 8;
    }
    if (s.v < 9) {
      // hash PINs at rest — drop any plaintext pins
      if (!s.pinSalt) s.pinSalt = randSalt();
      s.members.forEach(m => {
        if (m.pin != null && !m.pinHash) m.pinHash = hashPin(m.pin, s.pinSalt);
        delete m.pin;
      });
      s.v = 9;
    }
    if (s.v < 10) {
      if (!s.notifications) s.notifications = [];
      s.v = 10;
    }
    if (s.v < 11) {
      // general project management (Planner): Asana/ClickUp-style projects+tasks
      if (!s.gprojects) s.gprojects = seedPlanner(s.members);
      s.v = 11;
    }
    if (s.v < 12) {
      // Engineering and production are SEPARATE: an order carries only the steps
      // that match its own type. Older imports merged eng + prod tasks onto one
      // order (so a design project already showed Pjovimas etc.) and auto-started
      // some tasks. Split the phases apart, and reset auto-started tasks to queued.
      this._backup("before separating engineering/production"); // safety point — this cleanup drops steps
      var kindOf = {};
      (s.stations || []).forEach(st => {
        kindOf[st.id] = st.kind || "prod";
      });
      (s.orders || []).forEach(o => {
        if (!Array.isArray(o.ops)) return;
        var want = o.type === "eng" ? "eng" : "prod";
        var match = o.ops.filter(op => (kindOf[op.stationId] || "prod") === want);
        if (match.length && match.length !== o.ops.length) {
          o.ops = match; // drop the other phase's steps
        } else if (!match.length && o.ops.length) {
          o.type = (kindOf[o.ops[0].stationId] || "prod") === "eng" ? "eng" : "prod"; // mistyped → fix type
        }
        o.ops.forEach(op => {
          // nothing starts on its own
          if (op.status === "running" || op.status === "paused") {
            op.status = "queued";
            op.startedAt = null;
            op.loggedMs = 0;
          }
        });
      });
      s.v = 12;
    }
    if (s.v < 13) {
      // comment threads on manufacturing/engineering projects (Planner tasks
      // already had them), and a home for backup bookkeeping
      (s.orders || []).forEach(o => {
        if (!Array.isArray(o.comments)) o.comments = [];
      });
      (s.gprojects || []).forEach(p => (p.tasks || []).forEach(t => {
        if (!Array.isArray(t.comments)) t.comments = [];
        t.comments.forEach(c => {
          if (!Array.isArray(c.mentions)) c.mentions = [];
        });
      }));
      if (!s.backupMeta) s.backupMeta = {
        lastExportAt: null,
        firstSeenAt: Date.now()
      };
      s.v = 13;
    }
    if (s.v < 14) {
      // roles became capabilities: everyone shares the cockpit, permissions differ
      if (!s.perms) s.perms = JSON.parse(JSON.stringify(DEFAULT_PERMS));
      s.v = 14;
    }
    if (s.v < 15) {
      (s.orders || []).forEach(o => {
        if (!Array.isArray(o.parts)) o.parts = [];
      }); // SWOOD part lists
      s.v = 15;
    }
    if (s.v < 16) {
      // durations are now measured against the shop's shift, not the wall clock
      if (!s.shift) s.shift = JSON.parse(JSON.stringify(DEFAULT_SHIFT));
      s.v = 16;
    }
    if (s.v < 17) {
      // Reports arrived with its own permission; existing installs have a perms
      // table without the key, and an absent key reads as "no" for every role.
      for (var _i2 = 0, _Object$entries = Object.entries(s.perms || {}); _i2 < _Object$entries.length; _i2++) {
        var _DEFAULT_PERMS$role;
        var _Object$entries$_i = _slicedToArray(_Object$entries[_i2], 2),
          role = _Object$entries$_i[0],
          table = _Object$entries$_i[1];
        if (table["reports.view"] === undefined) table["reports.view"] = !!((_DEFAULT_PERMS$role = DEFAULT_PERMS[role]) !== null && _DEFAULT_PERMS$role !== void 0 && _DEFAULT_PERMS$role["reports.view"]);
      }
      s.v = 17;
    }
    if (s.v < 18) {
      // Purchasing. A real shop's suppliers are its own — the migration creates
      // the shelves empty and never invents a business relationship.
      if (!s.suppliers) s.suppliers = [];
      if (!s.purchases) s.purchases = [];
      if (!s.poSeq) s.poSeq = 1001;
      (s.materials || []).forEach(m => {
        if (m.supplierId === undefined) m.supplierId = null;
        if (m.reorderQty === undefined) m.reorderQty = null;
      });
      s.v = 18;
    }
    this.save();
  },
  /* The cloud is a mirror, not the live store: every change is written here
     first so the shop keeps working when the wifi on the floor drops, and the
     in-memory state is pushed to Supabase afterwards. That is why a full disk
     still says something even when sync is connected — but what it should say
     depends entirely on whether the cloud already has the work. */
  save() {
    if (this._vault) this._flushSoon(); // index written with the flush
    else {
      this._saveLocal();
      this._writeIndex();
    }
    if (this._onSave) this._onSave(); // cloud sync still receives the in-memory state
    if (typeof Bridge !== "undefined") Bridge.mark(); // shared document index, when the hub is present
  },
  /* ---- writing to the vault ----
     save() stays synchronous to everything that calls it — the in-memory state
     IS the truth during a session — and the write is coalesced a beat later so
     a burst of edits is one transaction instead of forty. Short enough that
     nothing meaningful is ever in flight, and the tab going away flushes it
     immediately anyway. */
  FLUSH_MS: 120,
  _flushSoon() {
    this._dirty = true;
    clearTimeout(this._flushTimer);
    this._flushTimer = setTimeout(() => this.flush(), this.FLUSH_MS);
  },
  flush() {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var snap;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!(!_this3._vault || !_this3._dirty || _this3._flushing)) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return");
          case 2:
            clearTimeout(_this3._flushTimer);
            _this3._flushing = true;
            snap = JSON.stringify(_this3.state);
            _this3._dirty = false;
            _context4.prev = 6;
            _context4.next = 9;
            return Vault.set("doc", snap);
          case 9:
            _this3._saveError = null;
            _this3._quotaToldAt = 0;
            _this3._writeIndex(); // once per settled write, not per edit
            _this3._announce();
            _context4.next = 21;
            break;
          case 15:
            _context4.prev = 15;
            _context4.t0 = _context4["catch"](6);
            _this3._dirty = true; // it did not land; try again on the next change
            _this3._saveError = _context4.t0;
            console.error("[Store] vault write failed:", _context4.t0 && _context4.t0.message);
            _this3._saveLocal(); // last resort: the small store, with its old warning
          case 21:
            _context4.prev = 21;
            _this3._flushing = false;
            return _context4.finish(21);
          case 24:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[6, 15, 21, 24]]);
    }))();
  },
  /* localStorage: the fallback, and where the tight limits still live */
  _saveLocal() {
    try {
      localStorage.setItem(DB_KEY, JSON.stringify(this.state));
      this._saveError = null;
      this._quotaToldAt = 0;
    } catch (e) {
      // storage full? free the auto-backups and retry once — the live data always wins
      try {
        localStorage.removeItem(BK_KEY);
        localStorage.setItem(DB_KEY, JSON.stringify(this.state));
        this._saveError = null;
        this._quotaToldAt = 0;
      } catch (e2) {
        this._saveError = e2;
        console.error("[Store] save failed:", e2 && e2.message);
        this._warnQuota();
      }
    }
  },
  /* The hub reads ShopFlow's orders to offer an import. It used to read the
     whole document out of localStorage; now it gets a few KB of exactly what
     it asks for, which is the only reason anything of ours stays there. */
  _writeIndex() {
    if (!this.state) return;
    try {
      localStorage.setItem(IDX_KEY, JSON.stringify({
        at: Date.now(),
        orders: (this.state.orders || []).map(o => ({
          id: o.id,
          num: o.num,
          product: o.product,
          client: o.client,
          type: o.type,
          shipped: !!o.shipped,
          archived: !!o.archived,
          createdAt: o.createdAt
        }))
      }));
    } catch (_) {/* the index is a courtesy, never a reason to fail a save */}
  },
  /* another tab of the same shop should pick this up */
  _announce() {
    try {
      if (!this._chan && typeof BroadcastChannel !== "undefined") this._chan = new BroadcastChannel("shopflow");
      if (this._chan) this._chan.postMessage({
        t: "doc",
        at: Date.now()
      });
    } catch (_) {}
  },
  /* Said once every few minutes, not on every keystroke — the old version
     fired on each save and stacked identical toasts down the screen. */
  _warnQuota() {
    if (typeof Toast === "undefined") return;
    if (Date.now() - (this._quotaToldAt || 0) < 300000) return;
    this._quotaToldAt = Date.now();
    var live = typeof Sync !== "undefined" && Sync.status === "live";
    Toast.show(live ? "This device is out of storage — your work is safe in the cloud, but it can't be kept offline here. Settings → Storage." : "Couldn't save on this device — storage is full. Export a backup now.", {
      emoji: "alert",
      ms: 9000
    });
  },
  reset() {
    try {
      localStorage.removeItem(DB_KEY);
    } catch (_) {}
    if (this._vault) {
      Vault.del("doc").catch(() => {});
      this._dirty = false;
      clearTimeout(this._flushTimer);
    }
    this.load();
  },
  snapshot() {
    return JSON.stringify(this.state);
  },
  restore(snap) {
    this.state = JSON.parse(snap);
    Store.save();
  },
  /* ---- what is actually filling this device up ----
     Every app published under app.dedesbaldai.lt shares ONE localStorage
     quota of about 5 MB — ShopFlow, the hub, offers, invoices. So "storage is
     full" is rarely about one runaway thing; it is the whole origin. This
     reports it honestly instead of leaving people to guess. */
  /* "0.00 MB" tells nobody anything — say KB when it is KB. */
  fmtBytes(b) {
    if (b < 1024) return b + " B";
    if (b < 1048576) return Math.round(b / 1024) + " KB";
    if (b < 1073741824) return (b / 1048576).toFixed(b < 10485760 ? 1 : 0) + " MB";
    return (b / 1073741824).toFixed(b < 10737418240 ? 1 : 0) + " GB";
  },
  usage() {
    var bytes = v => v == null ? 0 : v.length * 2; // UTF-16 in the store
    var keys = [];
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      keys.push({
        key: k,
        bytes: bytes(localStorage.getItem(k))
      });
    }
    keys.sort((a, b) => b.bytes - a.bytes);
    var doc = JSON.stringify(this.state || {});
    var sections = Object.keys(this.state || {}).map(k => ({
      key: k,
      bytes: bytes(JSON.stringify(this.state[k]))
    })).sort((a, b) => b.bytes - a.bytes);

    /* attachment thumbnails ride along in the document so every device can see
       a drawing without downloading it — worth knowing what that costs */
    var thumbs = 0,
      thumbN = 0;
    var _iterator3 = _createForOfIteratorHelper(this.state && this.state.files || []),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var f = _step3.value;
        if (f.thumb) {
          thumbs += bytes(f.thumb);
          thumbN++;
        }
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    var total = keys.reduce((n, k) => n + k.bytes, 0);
    var bk = this._backups();
    var backupBytes = this._vault ? bk.reduce((n, b) => n + (b.bytes || 0) * 2, 0) : bytes(localStorage.getItem(BK_KEY));
    return {
      keys,
      sections,
      total,
      docBytes: bytes(doc),
      backupBytes,
      backupCount: bk.length,
      thumbBytes: thumbs,
      thumbCount: thumbN,
      vault: !!this._vault,
      /* what the browser says the vault may have — disk-sized, not 5 MB */
      vaultUsed: Vault.est && Vault.est.used || 0,
      vaultQuota: Vault.est && Vault.est.quota || 0,
      /* in the vault the document and its restore points no longer count
         against the small store the rest of the domain is fighting over */
      quota: QUOTA_GUESS,
      over: total > QUOTA_GUESS * 0.9
    };
  },
  /* ---- local auto-backups: rolling restore points, best-effort ----
     In the vault the snapshot bodies live one key per backup ("bk:<ts>") and
     only their descriptions are held in memory, so listing them stays instant
     and synchronous for the UI without carrying twenty megabytes of JSON
     around. On the localStorage fallback it is the old single blob. */
  _bk: null,
  _backups() {
    if (this._vault) return this._bk || [];
    try {
      return JSON.parse(localStorage.getItem(BK_KEY) || "[]");
    } catch (e) {
      return [];
    }
  },
  _loadBackups() {
    var _this4 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (_this4._vault) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return");
          case 2:
            _context5.prev = 2;
            _context5.next = 5;
            return Vault.get("bk-index");
          case 5:
            _context5.t0 = _context5.sent;
            if (_context5.t0) {
              _context5.next = 8;
              break;
            }
            _context5.t0 = [];
          case 8:
            _this4._bk = _context5.t0;
            _context5.next = 14;
            break;
          case 11:
            _context5.prev = 11;
            _context5.t1 = _context5["catch"](2);
            _this4._bk = [];
          case 14:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[2, 11]]);
    }))();
  },
  _saveBackupIndex() {
    if (!this._vault) return;
    Vault.set("bk-index", this._bk || []).catch(e => console.warn("[Store] backup index:", e && e.message));
  },
  /* one-time: carry the localStorage backups into the vault, then let them go */
  _migrateBackups() {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var list, index, _iterator4, _step4, b;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            list = [];
            _context6.prev = 1;
            list = JSON.parse(localStorage.getItem(BK_KEY) || "[]");
            _context6.next = 8;
            break;
          case 5:
            _context6.prev = 5;
            _context6.t0 = _context6["catch"](1);
            return _context6.abrupt("return");
          case 8:
            if (list.length) {
              _context6.next = 10;
              break;
            }
            return _context6.abrupt("return");
          case 10:
            index = [];
            _iterator4 = _createForOfIteratorHelper(list);
            _context6.prev = 12;
            _iterator4.s();
          case 14:
            if ((_step4 = _iterator4.n()).done) {
              _context6.next = 26;
              break;
            }
            b = _step4.value;
            _context6.prev = 16;
            _context6.next = 19;
            return Vault.set("bk:" + b.ts, b.data);
          case 19:
            index.push({
              ts: b.ts,
              reason: b.reason,
              keep: !!b.keep,
              by: b.by || null,
              bytes: (b.data || "").length
            });
            _context6.next = 24;
            break;
          case 22:
            _context6.prev = 22;
            _context6.t1 = _context6["catch"](16);
          case 24:
            _context6.next = 14;
            break;
          case 26:
            _context6.next = 31;
            break;
          case 28:
            _context6.prev = 28;
            _context6.t2 = _context6["catch"](12);
            _iterator4.e(_context6.t2);
          case 31:
            _context6.prev = 31;
            _iterator4.f();
            return _context6.finish(31);
          case 34:
            _this5._bk = index;
            _this5._saveBackupIndex();
            try {
              localStorage.removeItem(BK_KEY);
            } catch (_) {}
          case 37:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[1, 5], [12, 28, 31, 34], [16, 22]]);
    }))();
  },
  /* Throw every restore point away — from wherever they actually live. */
  clearBackups() {
    var _this6 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var list, n;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            if (!_this6._vault) {
              _context7.next = 8;
              break;
            }
            list = _this6._bk || [];
            _this6._bk = [];
            _context7.next = 5;
            return Promise.all(list.map(b => Vault.del("bk:" + b.ts).catch(() => {})));
          case 5:
            _this6._saveBackupIndex();
            Vault.refresh();
            return _context7.abrupt("return", list.length);
          case 8:
            n = _this6._backups().length;
            try {
              localStorage.removeItem(BK_KEY);
            } catch (_) {}
            return _context7.abrupt("return", n);
          case 11:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  },
  /* the body of one backup, which only a restore actually needs */
  backupData(ts) {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var b;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            if (!_this7._vault) {
              _context8.next = 4;
              break;
            }
            _context8.next = 3;
            return Vault.get("bk:" + ts);
          case 3:
            return _context8.abrupt("return", _context8.sent);
          case 4:
            b = _this7._backups().find(x => x.ts === ts);
            return _context8.abrupt("return", b ? b.data : null);
          case 6:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }))();
  },
  /* Trim to BK_MAX automatic snapshots, but never drop a named restore point
     (keep:true) — those are the ones a person deliberately made. */
  _trimBackups(list, budget) {
    var BUDGET = budget || (this._vault ? BK_BUDGET : BK_BUDGET_LS);
    var auto = 0,
      kept = 0;
    var byCount = list.filter(b => b.keep ? ++kept <= BK_KEEP_MAX : ++auto <= BK_MAX);
    /* then the byte ceiling: oldest automatic snapshots go first, and a named
       restore point is only dropped when nothing else is left to drop. */
    var size = b => b.bytes != null ? b.bytes : (b.data || "").length;
    var out = byCount.slice();
    var total = out.reduce((n, b) => n + size(b), 0);
    var dropOldest = pred => {
      for (var i = out.length - 1; i >= 0 && total > BUDGET; i--) {
        if (!pred(out[i], i)) continue;
        total -= size(out[i]);
        out.splice(i, 1);
      }
    };
    dropOldest((b, i) => !b.keep && i > 0); // never the newest snapshot
    dropOldest((b, i) => i > 0); // still over: named ones too
    return out;
  },
  _backup(reason, opts = {}) {
    if (!this.state) return null;
    var snap = JSON.stringify(this.state);
    if (this._vault) {
      var list = this._bk || (this._bk = []);
      // an unchanged auto-snapshot is noise; a named one is still worth keeping
      if (!opts.keep && list[0] && list[0].bytes === snap.length && list[0].sig === this._sig(snap)) return null;
      var entry = {
        ts: Date.now(),
        reason: reason || "auto",
        bytes: snap.length,
        sig: this._sig(snap)
      };
      if (opts.keep) {
        entry.keep = true;
        entry.by = opts.by || null;
      }
      list.unshift(entry);
      var kept = this._trimBackups(list);
      var gone = list.filter(b => !kept.includes(b));
      this._bk = kept;
      Vault.set("bk:" + entry.ts, snap).then(() => {
        var _iterator5 = _createForOfIteratorHelper(gone),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var b = _step5.value;
            Vault.del("bk:" + b.ts).catch(() => {});
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
        this._saveBackupIndex();
      }).catch(e => {
        // it never landed — do not claim it did
        this._bk = this._bk.filter(b => b.ts !== entry.ts);
        console.warn("[Store] backup failed:", e && e.message);
      });
      return entry;
    }
    try {
      var _list = this._backups();
      if (!opts.keep && _list[0] && _list[0].data === snap) return null;
      var _entry = {
        ts: Date.now(),
        reason: reason || "auto",
        data: snap
      };
      if (opts.keep) {
        _entry.keep = true;
        _entry.by = opts.by || null;
      }
      _list.unshift(_entry);
      localStorage.setItem(BK_KEY, JSON.stringify(this._trimBackups(_list)));
      return _entry;
    } catch (e) {
      try {
        localStorage.setItem(BK_KEY, JSON.stringify(this._backups().filter(b => b.keep).slice(0, 2)));
      } catch (_) {}
      return null;
    }
  },
  /* cheap content fingerprint — only ever used to skip an identical snapshot */
  _sig(str) {
    var h = 5381;
    for (var i = 0; i < str.length; i += 97) h = (h << 5) + h + str.charCodeAt(i) | 0;
    return h;
  },
  /* a restore point the user asked for, by name — survives auto-eviction */
  savePoint(label, byId) {
    return this._backup((label || "").trim() || "Restore point", {
      keep: true,
      by: byId || null
    });
  },
  deleteBackup(ts) {
    if (this._vault) {
      this._bk = (this._bk || []).filter(b => b.ts !== ts);
      Vault.del("bk:" + ts).catch(() => {});
      this._saveBackupIndex();
      return true;
    }
    var list = this._backups().filter(b => b.ts !== ts);
    try {
      localStorage.setItem(BK_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  },
  /* ---- export bookkeeping: so we can nag when a download is overdue ---- */
  markExported() {
    if (!this.state.backupMeta) this.state.backupMeta = {};
    this.state.backupMeta.lastExportAt = Date.now();
    this.save();
  },
  /* Pure — this runs during render, so it must never write or it would
     reset its own clock (and push to the cloud) on every repaint. */
  exportOverdueDays() {
    var meta = this.state.backupMeta || {};
    var since = meta.lastExportAt || meta.firstSeenAt;
    return since ? Math.floor((Date.now() - since) / 864e5) : 0;
  },
  _sessionBackup() {
    // one restore point per hour of use
    var list = this._backups();
    if (!list[0] || Date.now() - list[0].ts > 36e5) this._backup("session");
  },
  /* Async now: in the vault the snapshot body is fetched only when a restore
     actually happens, rather than being carried in memory forever. */
  restoreBackup(ts) {
    var _this8 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var b, data;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            b = _this8._backups().find(x => x.ts === ts);
            if (b) {
              _context9.next = 3;
              break;
            }
            return _context9.abrupt("return", false);
          case 3:
            _context9.next = 5;
            return _this8.backupData(ts);
          case 5:
            data = _context9.sent;
            if (data) {
              _context9.next = 8;
              break;
            }
            return _context9.abrupt("return", false);
          case 8:
            _this8._backup("before restore"); // so the restore itself is undoable
            _this8.state = JSON.parse(data);
            _this8.migrate();
            _this8.save();
            return _context9.abrupt("return", true);
          case 13:
          case "end":
            return _context9.stop();
        }
      }, _callee9);
    }))();
  },
  /* ---- import a JSON file exported from ShopFlow ---- */
  importJSON(text) {
    var incoming = JSON.parse(text); // throws on invalid JSON
    if (!incoming || typeof incoming !== "object" || !Array.isArray(incoming.orders) || !Array.isArray(incoming.members)) throw new Error("Not a ShopFlow backup");
    this._backup("before import");
    this.state = incoming;
    this.migrate(); // upgrade older exports (also saves)
    return true;
  }
};

/* ============================================================
   Domain helpers (derived state)
   ============================================================ */
/* ============================================================
   Working time
   A task left running overnight must not bill sixteen hours, and
   a weekend must not bill at all. Every duration in the app is
   measured against the shop's shift instead of the wall clock.
   ============================================================ */
var DEFAULT_SHIFT = {
  days: [1, 2, 3, 4, 5],
  // 0=Sun … 6=Sat
  start: "08:00",
  end: "17:00",
  breaks: [{
    from: "10:00",
    to: "10:15"
  }, {
    from: "12:00",
    to: "12:45"
  },
  // lunch
  {
    from: "15:00",
    to: "15:15"
  }],
  auto: true,
  // derive work time from scans
  idleMins: 30 // silence that ends a scan session
};

/* "08:00" → minutes past midnight */
var hhmm = s => {
  var m = /^(\d{1,2}):(\d{2})$/.exec(String(s || "").trim());
  return m ? Math.min(1440, +m[1] * 60 + +m[2]) : 0;
};
var mmhh = min => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

/* ============================================================
   Capabilities — everyone SEES the same cockpit; roles differ
   only in what they may CHANGE. Managers always hold every
   capability; the rest are editable in Settings → Permissions.
   Anything not listed here (viewing, working on your own tasks,
   commenting, to-dos, Planner, Whiteboard) is open to everyone.
   ============================================================ */
var CAPS = [{
  id: "orders.create",
  label: "Create new orders & projects",
  hint: "The + New Order button"
}, {
  id: "orders.edit",
  label: "Edit order details",
  hint: "Due date, priority, notes, portfolio, project files"
}, {
  id: "orders.route",
  label: "Change routing",
  hint: "Add, move or remove production steps"
}, {
  id: "orders.assign",
  label: "Assign teammates to steps",
  hint: "Decide who does what"
}, {
  id: "orders.copy",
  label: "Copy a project",
  hint: "Duplicate a job with its full route"
}, {
  id: "orders.finish",
  label: "Ship, archive or restore projects",
  hint: "Close a job out"
}, {
  id: "orders.delete",
  label: "Delete orders & projects",
  hint: "Permanent — usually managers only"
}, {
  id: "materials.use",
  label: "Mark order materials as used",
  hint: "Consuming a line moves real stock"
}, {
  id: "warehouse.edit",
  label: "Manage the warehouse",
  hint: "Stock, materials, suppliers, purchase orders and the catalogue"
}, {
  id: "team.manage",
  label: "Manage the team",
  hint: "Add members, change roles, reset PINs"
}, {
  id: "reports.view",
  label: "See Reports",
  hint: "Throughput, on-time delivery and where the hours go"
}, {
  id: "settings",
  label: "Open Settings",
  hint: "Stations, engineering stages, data, backups, cloud"
}];

/* Defaults per role. Managers are deliberately absent — they always get
   everything, so a shop can never lock itself out of its own settings. */
var DEFAULT_PERMS = {
  engineer: {
    "orders.create": true,
    "orders.edit": true,
    "orders.route": true,
    "orders.assign": true,
    "orders.copy": true,
    "orders.finish": true,
    "orders.delete": false,
    "materials.use": false,
    "warehouse.edit": false,
    "team.manage": false,
    "reports.view": true,
    "settings": false
  },
  worker: {
    "orders.create": false,
    "orders.edit": false,
    "orders.route": false,
    "orders.assign": false,
    "orders.copy": false,
    "orders.finish": false,
    "orders.delete": false,
    "materials.use": true,
    "warehouse.edit": false,
    "team.manage": false,
    "reports.view": false,
    "settings": false
  }
};
var escapeRe = s => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/* Members longest name first, so "@Anastasija" is never read as "@Ana". */
var mentionOrder = () => [...Store.state.members].sort((a, b) => b.name.length - a.name.length);
/* A name ends where a letter/digit stops — \b is ASCII-only and would break on ė/š/ž */
var mentionRe = (name, flags = "iu") => new RegExp("@" + escapeRe(name) + "(?![\\p{L}\\p{N}])", flags);
var D = {
  member: id => Store.state.members.find(m => m.id === id) || null,
  station: id => Store.state.stations.find(s => s.id === id) || null,
  stationsOf: kind => Store.state.stations.filter(s => (s.kind || "prod") === kind),
  order: id => Store.state.orders.find(o => o.id === id) || null,
  material: id => Store.state.materials.find(m => m.id === id) || null,
  article: id => Store.state.articles.find(a => a.id === id) || null,
  portfolio: id => Store.state.portfolios.find(p => p.id === id) || null,
  board: id => (Store.state.boards || []).find(b => b.id === id) || null,
  /* ---- imported part lists (SWOOD) ---- */
  orderPart(order, code) {
    if (!order || !order.parts || !order.parts.length) return null;
    var up = String(code || "").trim().toUpperCase();
    return order.parts.find(p => p.code.toUpperCase() === up) || null;
  },
  /* which order owns this part code? */
  findByPart(code) {
    var up = String(code || "").trim().toUpperCase();
    var _iterator6 = _createForOfIteratorHelper(Store.state.orders),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var o = _step6.value;
        if (o.parts && o.parts.some(p => p.code.toUpperCase() === up)) return o;
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return null;
  },
  partsOfItem: (order, itemId) => (order.parts || []).filter(p => p.itemId === itemId),
  /* ---- working time ---- */
  shift() {
    return Store.state.shift || DEFAULT_SHIFT;
  },
  /* The worked minutes of one day, as [fromMin, toMin] spans with the
     breaks cut out. Computed once per shift config, not per call. */
  _shiftSpans() {
    var sh = this.shift();
    var key = JSON.stringify([sh.start, sh.end, sh.breaks]);
    if (this.__spanKey === key) return this.__spans;
    var from = hhmm(sh.start),
      to = hhmm(sh.end);
    var spans = [];
    var cursor = from;
    var brs = [...(sh.breaks || [])].map(b => [hhmm(b.from), hhmm(b.to)]).filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
    var _iterator7 = _createForOfIteratorHelper(brs),
      _step7;
    try {
      for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
        var _step7$value = _slicedToArray(_step7.value, 2),
          bf = _step7$value[0],
          bt = _step7$value[1];
        if (bt <= cursor || bf >= to) continue;
        if (bf > cursor) spans.push([cursor, Math.min(bf, to)]);
        cursor = Math.max(cursor, bt);
      }
    } catch (err) {
      _iterator7.e(err);
    } finally {
      _iterator7.f();
    }
    if (cursor < to) spans.push([cursor, to]);
    this.__spanKey = key;
    this.__spans = spans;
    return spans;
  },
  /* Worked milliseconds in a full working day (08:00–17:00 less breaks = 7h45m) */
  shiftDayMs() {
    return this._shiftSpans().reduce((n, [a, b]) => n + (b - a), 0) * 60000;
  },
  isWorkingDay(d) {
    return (this.shift().days || []).includes(d.getDay());
  },
  /* Working milliseconds between two instants. Weekends, evenings, nights and
     breaks contribute nothing. */
  workMsBetween(from, to) {
    if (!from || !to || to <= from) return 0;
    var spans = this._shiftSpans();
    if (!spans.length) return 0;
    var total = 0;
    var day = new Date(from);
    day.setHours(0, 0, 0, 0);
    var last = new Date(to);
    for (var guard = 0; day.getTime() <= last.getTime() && guard < 400; guard++) {
      if (this.isWorkingDay(day)) {
        var midnight = day.getTime();
        var _iterator8 = _createForOfIteratorHelper(spans),
          _step8;
        try {
          for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
            var _step8$value = _slicedToArray(_step8.value, 2),
              a = _step8$value[0],
              b = _step8$value[1];
            var s = midnight + a * 60000,
              e = midnight + b * 60000;
            var lo = Math.max(s, from),
              hi = Math.min(e, to);
            if (hi > lo) total += hi - lo;
          }
        } catch (err) {
          _iterator8.e(err);
        } finally {
          _iterator8.f();
        }
      }
      day.setDate(day.getDate() + 1); // DST-safe: local dates, not +24h
    }
    return total;
  },
  /* Is the shop working right now? */
  isWorkingNow(at = Date.now()) {
    var d = new Date(at);
    if (!this.isWorkingDay(d)) return false;
    var min = d.getHours() * 60 + d.getMinutes();
    return this._shiftSpans().some(([a, b]) => min >= a && min < b);
  },
  /* ---- capabilities ---- */
  /* Managers always hold everything — a shop must never be able to lock
     itself out of Settings. Unknown roles fall back to the worker set. */
  roleCan(role, cap) {
    if (role === "manager") return true;
    var table = (Store.state.perms || {})[role] || (Store.state.perms || {}).worker || DEFAULT_PERMS.worker;
    return !!table[cap];
  },
  /* ---- @mentions ---- */
  /* Which teammates does this text address? Resolved by name at post time so
     the stored text stays readable in exports. */
  /* Walk the text once and claim each "@" for the LONGEST name that fits
     there. Testing every name against the whole string instead meant a short
     name matched inside a longer one: "@Mantas Projektavimas" notified both
     Mantas Projektavimas and Mantas — two different people, one of whom has
     nothing to do with the job — and the highlighter wrapped a second pill
     inside the first. */
  scanMentions(text) {
    var hits = [];
    if (!text || text.indexOf("@") < 0) return hits;
    var names = mentionOrder(); // longest first
    var low = text.toLowerCase();
    var wordChar = /(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDD40-\uDD65\uDD6F-\uDD85\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDF70-\uDF81\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDED0-\uDEE3\uDF00-\uDF1A\uDF30-\uDF3B\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0\uDFF0-\uDFF9]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDF50-\uDF59\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D\uDD30-\uDD39]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDE70-\uDEBE\uDEC0-\uDEC9\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDD70-\uDD79\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD833[\uDCF0-\uDCF9]|\uD834[\uDEC0-\uDED3\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD839[\uDCD0-\uDCEB\uDCF0-\uDCF9\uDDD0-\uDDED\uDDF0-\uDDFA\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF])/;
    for (var i = 0; i < text.length; i++) {
      if (text[i] !== "@") continue;
      var _iterator9 = _createForOfIteratorHelper(names),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var m = _step9.value;
          var n = m.name.toLowerCase();
          if (!n || !low.startsWith(n, i + 1)) continue;
          var after = text[i + 1 + n.length];
          if (after && wordChar.test(after)) continue; // @Mantasx is not @Mantas
          hits.push({
            start: i,
            end: i + 1 + n.length,
            member: m
          });
          i += n.length; // and nothing inside it matches again
          break;
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
    }
    return hits;
  },
  parseMentions(text) {
    var ids = [];
    var _iterator10 = _createForOfIteratorHelper(this.scanMentions(text)),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var h = _step10.value;
        if (!ids.includes(h.member.id)) ids.push(h.member.id);
      }
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    return ids;
  },
  /* Members whose name starts with what has been typed after the "@" */
  mentionCandidates(query, limit = 6) {
    var q = (query || "").toLowerCase();
    return Store.state.members.filter(m => !q || m.name.toLowerCase().startsWith(q) || m.name.toLowerCase().includes(" " + q)).slice(0, limit);
  },
  /* ---- unique project names (a copy must never collide) ---- */
  projectNameTaken: (name, exceptId) => Store.state.orders.some(o => o.id !== exceptId && (o.product || "").trim().toLowerCase() === (name || "").trim().toLowerCase()),
  gprojectNameTaken: (name, exceptId) => Store.state.gprojects.some(p => p.id !== exceptId && (p.name || "").trim().toLowerCase() === (name || "").trim().toLowerCase()),
  /* "Kitchen" → "Kitchen (copy)" → "Kitchen (copy 2)" … */
  uniqueName(base, taken) {
    var stem = String(base || "Project").replace(/\s*\(copy(?:\s+\d+)?\)\s*$/i, "").trim() || "Project";
    var candidate = `${stem} (copy)`;
    for (var n = 2; taken(candidate); n++) candidate = `${stem} (copy ${n})`;
    return candidate;
  },
  /* boards a member may see: team-wide, own, or explicitly shared */
  boardAccess(b, memberId) {
    if (!b) return false;
    if (b.createdBy === memberId) return true;
    if ((b.visibility || "team") === "team") return true;
    if (b.visibility === "custom") return (b.memberIds || []).includes(memberId);
    return false; // private
  },
  boardsFor(memberId) {
    return (Store.state.boards || []).filter(b => this.boardAccess(b, memberId));
  },
  /* ---------- To-dos ---------- */
  todosFor(memberId) {
    return (Store.state.todos || []).filter(t => t.forId === memberId).sort((a, b) => a.done - b.done || (a.due || Infinity) - (b.due || Infinity) || b.ts - a.ts);
  },
  openTodoCount(memberId) {
    return (Store.state.todos || []).filter(t => t.forId === memberId && !t.done).length;
  },
  /* ---------- Planner (general PM) ---------- */
  gproject: id => (Store.state.gprojects || []).find(p => p.id === id) || null,
  activeGProjects() {
    return (Store.state.gprojects || []).filter(p => !p.archived);
  },
  gtask(project, taskId) {
    return project ? project.tasks.find(t => t.id === taskId) : null;
  },
  gstage(project, stageId) {
    return project ? project.stages.find(s => s.id === stageId) : null;
  },
  gStageTasks(project, stageId) {
    return project.tasks.filter(t => t.stageId === stageId).sort((a, b) => a.ord - b.ord);
  },
  gTaskDone(project, task) {
    var s = this.gstage(project, task.stageId);
    return !!(s && s.done);
  },
  gProgress(project) {
    var total = project.tasks.length;
    var done = project.tasks.filter(t => this.gTaskDone(project, t)).length;
    return {
      done,
      total,
      pct: total ? Math.round(done / total * 100) : 0
    };
  },
  gSubProgress(task) {
    var s = task.subtasks || [];
    return {
      done: s.filter(x => x.done).length,
      total: s.length
    };
  },
  /* all tasks assigned to a member across active projects (each with its project) */
  myGTasks(memberId) {
    var out = [];
    var _iterator11 = _createForOfIteratorHelper(this.activeGProjects()),
      _step11;
    try {
      for (_iterator11.s(); !(_step11 = _iterator11.n()).done;) {
        var p = _step11.value;
        var _iterator12 = _createForOfIteratorHelper(p.tasks),
          _step12;
        try {
          for (_iterator12.s(); !(_step12 = _iterator12.n()).done;) {
            var t = _step12.value;
            if (t.assigneeId === memberId && !this.gTaskDone(p, t)) out.push({
              project: p,
              task: t
            });
          }
        } catch (err) {
          _iterator12.e(err);
        } finally {
          _iterator12.f();
        }
      }
    } catch (err) {
      _iterator11.e(err);
    } finally {
      _iterator11.f();
    }
    out.sort((a, b) => (a.task.due || Infinity) - (b.task.due || Infinity) || prioRank(a.task) - prioRank(b.task));
    return out;
  },
  myGTaskCount(memberId) {
    return this.activeGProjects().reduce((n, p) => n + p.tasks.filter(t => t.assigneeId === memberId && !this.gTaskDone(p, t)).length, 0);
  },
  gLabel(project, id) {
    return (project.labels || []).find(l => l.id === id) || null;
  },
  /* ---------- Notifications ---------- */
  notificationsFor(memberId) {
    return (Store.state.notifications || []).filter(n => n.forId === memberId).sort((a, b) => b.ts - a.ts);
  },
  unreadCount(memberId) {
    return (Store.state.notifications || []).filter(n => n.forId === memberId && !n.read).length;
  },
  /* ---------- who is carrying this project ----------
     Everyone whose name is on a step that is not finished. Not the same as
     projectEngineers(), which is about who COULD take a design and falls back
     to every engineer; this is who actually has it. */
  orderResponsible(order) {
    var ids = new Set();
    var _iterator13 = _createForOfIteratorHelper(order.ops || []),
      _step13;
    try {
      for (_iterator13.s(); !(_step13 = _iterator13.n()).done;) {
        var op = _step13.value;
        if (op.status === "done") continue;
        var _iterator14 = _createForOfIteratorHelper(this.opAssigneeIds(op)),
          _step14;
        try {
          for (_iterator14.s(); !(_step14 = _iterator14.n()).done;) {
            var id = _step14.value;
            if (this.member(id)) ids.add(id);
          }
        } catch (err) {
          _iterator14.e(err);
        } finally {
          _iterator14.f();
        }
      }
    } catch (err) {
      _iterator13.e(err);
    } finally {
      _iterator13.f();
    }
    return [...ids];
  },
  /* Remarks nobody has read yet. Opening the project marks them read, so the
     count means "since you last looked", not "since the beginning". */
  unreadComments(order, memberId) {
    var seen = (order.commentsSeen || {})[memberId] || 0;
    return (order.comments || []).filter(c => c.ts > seen && c.by !== memberId).length;
  },
  /* engineers (or managers) carrying a project — who to notify about it */
  projectEngineers(order) {
    var ids = new Set();
    var _iterator15 = _createForOfIteratorHelper(order.ops),
      _step15;
    try {
      for (_iterator15.s(); !(_step15 = _iterator15.n()).done;) {
        var op = _step15.value;
        var m = op.assigneeId && this.member(op.assigneeId);
        if (m && (m.role === "engineer" || m.role === "manager")) ids.add(m.id);
      }
    } catch (err) {
      _iterator15.e(err);
    } finally {
      _iterator15.f();
    }
    if (!ids.size) Store.state.members.filter(m => m.role === "engineer").forEach(m => ids.add(m.id));
    return [...ids];
  },
  /* ---------- same job twice: an ENG design project and a WO made separately ----------
     Production often opens a WO before engineering hands off (or the engineer
     never presses "Hand off"), so the same job sits in both lists. These score
     every open engineering project against a WO by client, name and files, so
     the app can ask "is this the same project?". Plain loops on purpose: this
     file is read by older shop tablets. */
  _normName(s) {
    var x = String(s || "").toLowerCase();
    if (x.normalize) x = x.normalize("NFD").replace(/[̀-ͯ]/g, "");
    x = x.replace(/[„“”"'«»()\[\].,;:!?\/\\#+&*_\-–—]/g, " ");
    x = x.replace(/\b(uab|mb|ab|ii|vsi|ltd|oy|sia|ou|gmbh)\b/g, " ");
    return x.replace(/\s+/g, " ").trim();
  },
  _nameStems(s) {
    var stop = {
      ir: 1, su: 1, be: 1, the: 1, and: 1, for: 1, vnt: 1, pcs: 1,
      projektas: 1, projekt: 1, project: 1, gamyba: 1, baldai: 1, brez: 1, breziniai: 1,
      cnc: 1, programos: 1, drawings: 1, design: 1, programs: 1
    };
    var words = this._normName(s).split(" ");
    var out = [];
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (w.length < 3 && !/^\d+$/.test(w)) continue;
      if (stop[w]) continue;
      var st = w.length > 5 ? w.slice(0, 5) : w; // Lithuanian endings: virtuvė / virtuvei / virtuvės
      if (out.indexOf(st) < 0) out.push(st);
    }
    return out;
  },
  _stemOverlap(a, b) {
    if (!a.length || !b.length) return 0;
    var common = 0;
    for (var i = 0; i < a.length; i++) if (b.indexOf(a[i]) >= 0) common++;
    return 2 * common / (a.length + b.length);
  },
  _clientScore(a, b) {
    if (a.customerId && b.customerId && a.customerId === b.customerId) return 1;
    var x = this._normName(a.client),
      y = this._normName(b.client);
    if (!x || !y) return 0;
    if (x === y) return 1;
    if (x.length >= 4 && y.length >= 4 && (x.indexOf(y) >= 0 || y.indexOf(x) >= 0)) return 0.85;
    return this._stemOverlap(this._nameStems(x), this._nameStems(y));
  },
  /* the engineering project a WO is waiting on (asked, not yet confirmed) */
  engLinkPending(prod) {
    if (!prod || !prod.engLink || prod.engLink.status !== "pending") return null;
    return this.order(prod.engLink.engId);
  },
  /* the WO an engineering project has been asked to merge with */
  engLinkRequestFor(eng) {
    if (!eng || !eng.linkRequest) return null;
    var p = this.order(eng.linkRequest.prodId);
    return p && p.engLink && p.engLink.status === "pending" && p.engLink.engId === eng.id ? p : null;
  },
  /* Open engineering projects that look like this WO, best first.
     Each: {eng, score, why:[…]} — why lists what matched, for the question. */
  engMatchesFor(prod, opts) {
    var res = [];
    if (!prod || prod.type === "eng" || prod.archived || prod.fromEngId) return res;
    if (this.engLinkPending(prod)) return res;
    var min = opts && opts.min != null ? opts.min : 0.55;
    var no = prod.engNotMatch || [];
    var pStems = this._nameStems(prod.product);
    var pLink = String(prod.oneDriveUrl || "").trim();
    var orders = Store.state.orders || [];
    for (var i = 0; i < orders.length; i++) {
      var e = orders[i];
      if (e.type !== "eng" || e.archived || e.handedOffTo) continue;
      if (no.indexOf(e.id) >= 0) continue;
      if (this.engLinkRequestFor(e)) continue; // already asked about another WO
      var why = [];
      var cs = this._clientScore(prod, e);
      var ps = this._stemOverlap(pStems, this._nameStems(e.product));
      var sameFiles = pLink && pLink === String(e.oneDriveUrl || "").trim();
      var samePf = prod.portfolioId && prod.portfolioId === e.portfolioId;
      if (cs >= 0.85) why.push("client");
      if (ps >= 0.5) why.push("name");
      if (sameFiles) why.push("files");
      if (samePf) why.push("portfolio");
      // the client carries most of it; a name alone is too weak (two "kitchens")
      var score = cs * 0.6 + ps * 0.4 + (sameFiles ? 0.6 : 0) + (samePf ? 0.25 : 0);
      if (cs < 0.5 && !sameFiles && !samePf) score = Math.min(score, ps >= 0.8 ? 0.6 : 0.4);
      if (score >= min) res.push({ eng: e, score: Math.min(1, score), why: why });
    }
    res.sort((a, b) => b.score - a.score || (b.eng.createdAt || 0) - (a.eng.createdAt || 0));
    return res.slice(0, 4);
  },
  /* WOs that still need the question answered — for the dashboard */
  unlinkedEngMatches() {
    var out = [];
    var orders = Store.state.orders || [];
    for (var i = 0; i < orders.length; i++) {
      var o = orders[i];
      if (o.type === "eng" || o.archived || o.fromEngId) continue;
      var m = this.engMatchesFor(o);
      if (m.length) out.push({ order: o, matches: m });
    }
    return out;
  },
  /* ---------- QR / barcode scanning ----------
     Labels (e.g. SWOOD) encode a part code like "SA_GA_VIRT_404"
     = {PROJECT}_{partNo}. We strip the part number to get the
     project code, match the order, and count the part at a station. */
  scanParse(raw) {
    var _Store$state$scan;
    var body = String(raw || "").trim();
    if (!body) return null;
    var stationId = null;
    // optional scanner prefix "EDGE#..." → route to a station
    var px = ((_Store$state$scan = Store.state.scan) === null || _Store$state$scan === void 0 ? void 0 : _Store$state$scan.prefixes) || {};
    var h = body.indexOf("#");
    if (h > 0 && px[body.slice(0, h)]) {
      stationId = px[body.slice(0, h)];
      body = body.slice(h + 1).trim();
    }
    // native ShopFlow token: SF|orderId|itemId|part
    if (body.startsWith("SF|")) {
      var _body$split = body.split("|"),
        _body$split2 = _slicedToArray(_body$split, 4),
        oid = _body$split2[1],
        iid = _body$split2[2],
        part = _body$split2[3];
      var o = D.order(oid);
      if (o) return {
        order: o,
        item: iid ? D.item(o, iid) : null,
        partCode: part || body,
        stationId
      };
    }
    var partCode = body;
    // An imported SWOOD part list is the most precise match we have: the code
    // names one physical panel, so it resolves the order AND the material line.
    var owner = D.findByPart(partCode);
    if (owner) {
      var _part = D.orderPart(owner, partCode);
      return {
        order: owner,
        item: _part && _part.itemId ? D.item(owner, _part.itemId) : null,
        part: _part,
        partCode,
        project: owner.swood && owner.swood.project || owner.num,
        stationId
      };
    }
    var project = body.replace(/[_-]\d+[A-Z]?$/i, "").trim(); // SA_GA_VIRT_404 -> SA_GA_VIRT
    var UP = body.toUpperCase(),
      PUP = project.toUpperCase();
    var hit = o => {
      var n = (o.num || "").toUpperCase(),
        p = (o.product || "").toUpperCase();
      // an imported job keeps its SWOOD project code, so renaming the project
      // in ShopFlow can't stop its own labels from finding it
      var sw = (o.swood && o.swood.project || "").toUpperCase();
      if (sw && (sw === UP || sw === PUP)) return true;
      return n === UP || n === PUP || PUP && (n.includes(PUP) || p.includes(PUP)) || n && UP.includes(n);
    };
    var order = Store.state.orders.find(o => (o.num || "").toUpperCase() === UP) || Store.state.orders.find(o => (o.swood && o.swood.project || "").toUpperCase() === PUP) || Store.state.orders.find(o => (o.num || "").toUpperCase() === PUP) || Store.state.orders.find(hit);
    // an imported project knows every panel it contains, so a code that looks
    // like one of its labels but isn't on the list is a mis-print, not progress
    if (order && order.parts && order.parts.length && !D.orderPart(order, partCode)) return {
      order,
      item: null,
      partCode,
      project,
      stationId,
      unknownPart: true
    };
    // article SKU on the label → item
    var item = null;
    if (!order) {
      var _iterator16 = _createForOfIteratorHelper(Store.state.orders),
        _step16;
      try {
        for (_iterator16.s(); !(_step16 = _iterator16.n()).done;) {
          var _o = _step16.value;
          var _iterator17 = _createForOfIteratorHelper(_o.items),
            _step17;
          try {
            for (_iterator17.s(); !(_step17 = _iterator17.n()).done;) {
              var it = _step17.value;
              var art = it.articleId ? D.article(it.articleId) : null;
              if (art && UP.includes(art.sku.toUpperCase())) {
                order = _o;
                item = it;
                break;
              }
            }
          } catch (err) {
            _iterator17.e(err);
          } finally {
            _iterator17.f();
          }
        }
      } catch (err) {
        _iterator16.e(err);
      } finally {
        _iterator16.f();
      }
    }
    return order ? {
      order,
      item,
      partCode,
      project,
      stationId
    } : {
      order: null,
      partCode,
      project,
      stationId
    };
  },
  stationScanStats(stationId) {
    var done = 0,
      total = 0;
    var _iterator18 = _createForOfIteratorHelper(Store.state.orders),
      _step18;
    try {
      for (_iterator18.s(); !(_step18 = _iterator18.n()).done;) {
        var o = _step18.value;
        if (o.archived) continue;
        var _iterator19 = _createForOfIteratorHelper(o.ops),
          _step19;
        try {
          for (_iterator19.s(); !(_step19 = _iterator19.n()).done;) {
            var op = _step19.value;
            if (op.stationId === stationId) {
              var it = D.item(o, op.itemId);
              done += op.qtyDone;
              total += it ? it.qty : 0;
            }
          }
        } catch (err) {
          _iterator19.e(err);
        } finally {
          _iterator19.f();
        }
      }
    } catch (err) {
      _iterator18.e(err);
    } finally {
      _iterator18.f();
    }
    return {
      done,
      total
    };
  },
  /* ---------- Project files (OneDrive) ---------- */
  slug(s) {
    return String(s || "").trim().replace(/[\\/:*?"<>|#%]+/g, "").replace(/\s+/g, "_");
  },
  projectLink(order) {
    if (!order) return null;
    if (order.oneDriveUrl) return order.oneDriveUrl; // explicit per-project override
    var od = Store.state.oneDrive;
    if (od && od.baseUrl) {
      var base = od.baseUrl.replace(/\/+$/, "");
      return (od.template || "{base}/{code}").replace("{base}", base).replace("{code}", encodeURIComponent(this.slug(order.num))).replace("{name}", encodeURIComponent(this.slug(order.product)));
    }
    return null;
  },
  projectLinkIsAuto(order) {
    var _Store$state$oneDrive;
    return !!order && !order.oneDriveUrl && !!((_Store$state$oneDrive = Store.state.oneDrive) !== null && _Store$state$oneDrive !== void 0 && _Store$state$oneDrive.baseUrl);
  },
  /* status label with order context (eng projects aren't "shipped") */
  statusLabelFor(order, st) {
    if (order.type === "eng") {
      if (st === "ready") return "Complete";
      if (st === "shipped") return "Delivered";
    }
    return this.statusLabel[st] || st;
  },
  item: (order, itemId) => order.items.find(i => i.id === itemId) || null,
  /* ---------- Lanes & piece flow ---------- */
  laneOps(order, itemId, group) {
    return order.ops.filter(op => op.itemId === itemId && op.group === group);
  },
  itemGroups(order, itemId) {
    var gs = [];
    var _iterator20 = _createForOfIteratorHelper(order.ops),
      _step20;
    try {
      for (_iterator20.s(); !(_step20 = _iterator20.n()).done;) {
        var op = _step20.value;
        if (op.itemId !== itemId || op.group === null) continue;
        if (!gs.includes(op.group)) gs.push(op.group);
      }
    } catch (err) {
      _iterator20.e(err);
    } finally {
      _iterator20.f();
    }
    return gs;
  },
  /* pieces available to process at this op (upstream throughput cap) */
  opAvail(order, op) {
    var item = this.item(order, op.itemId);
    if (!item) return 0;
    var lane = this.laneOps(order, op.itemId, op.group);
    var i = lane.indexOf(op);
    if (i > 0) return lane[i - 1].status === "done" ? item.qty : lane[i - 1].qtyDone;
    if (op.group !== null) return item.qty; // first op of a part lane
    // first op of the shared/final lane: capped by the slowest part lane
    var groups = this.itemGroups(order, op.itemId);
    if (!groups.length) return item.qty;
    var avail = item.qty;
    var _iterator21 = _createForOfIteratorHelper(groups),
      _step21;
    try {
      for (_iterator21.s(); !(_step21 = _iterator21.n()).done;) {
        var g = _step21.value;
        var l = this.laneOps(order, op.itemId, g);
        var last = l[l.length - 1];
        avail = Math.min(avail, last.status === "done" ? item.qty : last.qtyDone);
      }
    } catch (err) {
      _iterator21.e(err);
    } finally {
      _iterator21.f();
    }
    return avail;
  },
  /* can this op be worked on now? */
  opReady(order, op) {
    if (op.status === "done") return false;
    return this.opAvail(order, op) > 0 || op.qtyDone > 0 || ["running", "paused", "blocked"].includes(op.status);
  },
  activeOps(order) {
    return order.ops.filter(op => this.opReady(order, op));
  },
  currentOp(order) {
    return this.activeOps(order)[0] || (order.ops.find(op => op.status !== "done") ? order.ops.find(op => op.status !== "done") : null);
  },
  opLabel(order, op) {
    var st = this.station(op.stationId);
    var item = this.item(order, op.itemId);
    var multi = order.items.length > 1;
    var bits = [];
    if (op.group) bits.push(op.group);
    if (multi && item) bits.push(item.name);
    return {
      station: st,
      suffix: bits.join(" · ")
    };
  },
  /* is this project ended (archived)? */
  isActive(order) {
    return !order.archived;
  },
  /* Order status derived from ops */
  orderStatus(order) {
    if (order.archived || order.shipped) return "shipped";
    if (!order.ops.length) return "queued";
    if (order.ops.every(op => op.status === "done")) return "ready";
    var active = this.activeOps(order);
    if (active.some(op => op.status === "blocked")) return "blocked";
    if (active.some(op => op.status === "running")) return "running";
    if (active.some(op => op.status === "paused")) return "paused";
    if (order.ops.some(op => op.status === "done" || op.qtyDone > 0)) return "running";
    return "queued";
  },
  statusLabel: {
    queued: "Not started",
    running: "In production",
    paused: "Paused",
    blocked: "Blocked",
    ready: "Ready to ship",
    shipped: "Shipped",
    done: "Done"
  },
  progress(order) {
    var done = order.ops.filter(op => op.status === "done").length;
    return {
      done,
      total: order.ops.length,
      pct: order.ops.length ? Math.round(done / order.ops.length * 100) : 0
    };
  },
  /* final-op output per item, e.g. how many are packed */
  itemFinished(order, itemId) {
    var ops = order.ops.filter(op => op.itemId === itemId);
    if (!ops.length) return {
      done: 0,
      label: "finished"
    };
    // "finished" = output of the final (shared) lane's last op, not whatever op sits last in the array
    var finalLane = ops.filter(op => op.group === null);
    var last = (finalLane.length ? finalLane : ops)[(finalLane.length ? finalLane : ops).length - 1];
    var st = this.station(last.stationId);
    var item = this.item(order, itemId);
    return {
      done: last.status === "done" ? item.qty : last.qtyDone,
      label: st ? st.name.toLowerCase() : "finished"
    };
  },
  orderQty(order) {
    return order.items.reduce((s, i) => s + i.qty, 0);
  },
  /* On a SWOOD job this used to add 96 panels to 16 cabinets and print the sum
     under the last stage's name — "surinkimas 0 / 112", which is not a thing
     that exists. When the job is counted in cabinets, report the cabinets. */
  packedSummary(order) {
    var asm = this.hasModules(order) ? this.assemblyOp(order) : null;
    if (asm) {
      var f = this.itemFinished(order, asm.itemId);
      var item = this.item(order, asm.itemId);
      return {
        done: f.done,
        total: item && item.qty || 0,
        label: f.label
      };
    }
    var done = 0,
      total = 0,
      label = "packed";
    var _iterator22 = _createForOfIteratorHelper(order.items),
      _step22;
    try {
      for (_iterator22.s(); !(_step22 = _iterator22.n()).done;) {
        var it = _step22.value;
        var _f = this.itemFinished(order, it.id);
        done += _f.done;
        total += it.qty;
        label = _f.label;
      }
    } catch (err) {
      _iterator22.e(err);
    } finally {
      _iterator22.f();
    }
    return {
      done,
      total,
      label
    };
  },
  /* Time on a task, counted in working hours only.
     When the clock was started by a scan rather than a button, a run ends at
     the last scan plus the idle grace — nobody has to remember to stop it. */
  opElapsed(op) {
    var ms = op.loggedMs || 0;
    if (op.status === "running" && op.startedAt) ms += this.workMsBetween(op.startedAt, this.opRunUntil(op));
    return ms;
  },
  /* How far a running clock has legitimately reached.
     For a scan-started run that is min(now, last scan + grace): the clock
     keeps ticking for a while after the last scan and then simply stops. It
     never jumps backwards, so what a worker saw is what gets logged. */
  opRunUntil(op, now = Date.now()) {
    if (op.autoStarted && op.lastScanAt) {
      var idle = Math.max(1, this.shift().idleMins || 30) * 60000;
      return Math.min(now, op.lastScanAt + idle);
    }
    return now;
  },
  /* A scan-started task whose session has gone quiet — the sweep closes these */
  opRunStale(op, now = Date.now()) {
    return op.status === "running" && op.autoStarted && op.lastScanAt && now - op.lastScanAt > Math.max(1, this.shift().idleMins || 30) * 60000;
  },
  /* What a member is running right now */
  runningOpOf(memberId) {
    var _iterator23 = _createForOfIteratorHelper(Store.state.orders),
      _step23;
    try {
      for (_iterator23.s(); !(_step23 = _iterator23.n()).done;) {
        var o = _step23.value;
        if (o.archived) continue;
        var op = o.ops.find(op => op.status === "running" && this.opAssignedTo(op, memberId));
        if (op) return {
          order: o,
          op
        };
      }
    } catch (err) {
      _iterator23.e(err);
    } finally {
      _iterator23.f();
    }
    return null;
  },
  /* Task queue for a member: ready ops assigned to them or unassigned at their home station.
     Production workers only see manufacturing projects; engineers only engineering. */
  workerQueue(memberId) {
    var me = this.member(memberId);
    var wantEng = me && me.role === "engineer";
    var out = [];
    var _iterator24 = _createForOfIteratorHelper(Store.state.orders),
      _step24;
    try {
      for (_iterator24.s(); !(_step24 = _iterator24.n()).done;) {
        var o = _step24.value;
        if (o.archived) continue;
        if (o.type === "eng" !== wantEng) continue; // workers never see eng; engineers only eng
        var _iterator25 = _createForOfIteratorHelper(this.activeOps(o)),
          _step25;
        try {
          for (_iterator25.s(); !(_step25 = _iterator25.n()).done;) {
            var op = _step25.value;
            var mine = this.opAssignedTo(op, memberId); // shared work counts as mine
            var atMyStation = !this.opAssigneeIds(op).length && me.station && op.stationId === me.station;
            if (mine || atMyStation) out.push({
              order: o,
              op
            });
          }
        } catch (err) {
          _iterator25.e(err);
        } finally {
          _iterator25.f();
        }
      }
    } catch (err) {
      _iterator24.e(err);
    } finally {
      _iterator24.f();
    }
    out.sort((a, b) => prioRank(a.order) - prioRank(b.order) || a.order.due - b.order.due);
    return out;
  },
  /* ---------- everything on my plate, whoever I am ----------
     workerQueue() splits by role — workers never see engineering, engineers
     only see engineering — which is right for a bench screen and wrong for
     "what do I personally owe anyone". A manager assigned a drawing had no
     screen that told them. This is role-blind on purpose: if your name is on
     it, it is here. */
  myWork(memberId) {
    var out = [];
    var _iterator26 = _createForOfIteratorHelper(Store.state.orders),
      _step26;
    try {
      for (_iterator26.s(); !(_step26 = _iterator26.n()).done;) {
        var o = _step26.value;
        if (o.archived) continue;
        /* the bench queue only shows what can be started; this shows everything
           with your name on it, so it has to say which is which — otherwise the
           count disagrees with the queue and neither looks trustworthy */
        var ready = new Set(this.activeOps(o).map(x => x.id));
        var _iterator28 = _createForOfIteratorHelper(o.ops),
          _step28;
        try {
          for (_iterator28.s(); !(_step28 = _iterator28.n()).done;) {
            var op = _step28.value;
            if (op.status === "done") continue;
            if (!this.opAssignedTo(op, memberId)) continue;
            out.push({
              kind: "op",
              order: o,
              op,
              due: o.due,
              blocked: op.status === "blocked",
              running: op.status === "running",
              waiting: !ready.has(op.id) && op.status !== "running" && op.status !== "blocked"
            });
          }
        } catch (err) {
          _iterator28.e(err);
        } finally {
          _iterator28.f();
        }
      }
    } catch (err) {
      _iterator26.e(err);
    } finally {
      _iterator26.f();
    }
    var _iterator27 = _createForOfIteratorHelper(this.todosFor(memberId)),
      _step27;
    try {
      for (_iterator27.s(); !(_step27 = _iterator27.n()).done;) {
        var t = _step27.value;
        if (t.done) continue;
        out.push({
          kind: "todo",
          todo: t,
          due: t.due || null
        });
      }
      /* running first — it is the thing in your hands — then blocked, then by
         priority and date; a to-do with no date sinks rather than leads */
    } catch (err) {
      _iterator27.e(err);
    } finally {
      _iterator27.f();
    }
    out.sort((a, b) => b.running - a.running || b.blocked - a.blocked || !!a.waiting - !!b.waiting || (
    // what you can start now, first
    a.kind === "op" && b.kind === "op" ? prioRank(a.order) - prioRank(b.order) : 0) || (a.due || Infinity) - (b.due || Infinity));
    return out;
  },
  myWorkSummary(memberId) {
    var list = this.myWork(memberId);
    var now = Date.now();
    return {
      total: list.length,
      running: list.filter(x => x.running).length,
      blocked: list.filter(x => x.blocked).length,
      waiting: list.filter(x => x.waiting).length,
      /* what you could pick up this minute — the number the bench already shows */
      now: list.filter(x => !x.waiting && !x.blocked).length,
      late: list.filter(x => x.due && x.due < now).length,
      list
    };
  },
  /* All ready tasks at a station (an order can be at several stations at once) */
  stationQueue(stationId) {
    var out = [];
    var _iterator29 = _createForOfIteratorHelper(Store.state.orders),
      _step29;
    try {
      for (_iterator29.s(); !(_step29 = _iterator29.n()).done;) {
        var o = _step29.value;
        if (o.archived) continue;
        var _iterator30 = _createForOfIteratorHelper(this.activeOps(o)),
          _step30;
        try {
          for (_iterator30.s(); !(_step30 = _iterator30.n()).done;) {
            var op = _step30.value;
            if (op.stationId === stationId) out.push({
              order: o,
              op
            });
          }
        } catch (err) {
          _iterator30.e(err);
        } finally {
          _iterator30.f();
        }
      }
    } catch (err) {
      _iterator29.e(err);
    } finally {
      _iterator29.f();
    }
    out.sort((a, b) => prioRank(a.order) - prioRank(b.order) || a.order.due - b.order.due);
    return out;
  },
  doneTodayBy(memberId) {
    var midnight = new Date();
    midnight.setHours(0, 0, 0, 0);
    var n = 0;
    var _iterator31 = _createForOfIteratorHelper(Store.state.orders),
      _step31;
    try {
      for (_iterator31.s(); !(_step31 = _iterator31.n()).done;) {
        var o = _step31.value;
        var _iterator32 = _createForOfIteratorHelper(o.ops),
          _step32;
        try {
          for (_iterator32.s(); !(_step32 = _iterator32.n()).done;) {
            var op = _step32.value;
            if (op.status === "done" && op.completedAt >= midnight.getTime() && (this.opAssignedTo(op, memberId) || op.completedBy === memberId)) n++;
          }
        } catch (err) {
          _iterator32.e(err);
        } finally {
          _iterator32.f();
        }
      }
    } catch (err) {
      _iterator31.e(err);
    } finally {
      _iterator31.f();
    }
    return n;
  },
  /* ---------- Portfolios ---------- */
  portfolioOrders(pid) {
    return Store.state.orders.filter(o => o.portfolioId === pid);
  },
  portfolioRollup(pid) {
    var orders = this.portfolioOrders(pid);
    var done = 0,
      total = 0;
    var statuses = {};
    var minDue = Infinity,
      maxDue = -Infinity;
    var _iterator33 = _createForOfIteratorHelper(orders),
      _step33;
    try {
      for (_iterator33.s(); !(_step33 = _iterator33.n()).done;) {
        var o = _step33.value;
        var p = this.progress(o);
        done += p.done;
        total += p.total;
        var st = this.orderStatus(o);
        statuses[st] = (statuses[st] || 0) + 1;
        if (!o.archived) {
          minDue = Math.min(minDue, o.due);
          maxDue = Math.max(maxDue, o.due);
        }
      }
    } catch (err) {
      _iterator33.e(err);
    } finally {
      _iterator33.f();
    }
    return {
      orders,
      done,
      total,
      pct: total ? Math.round(done / total * 100) : 0,
      statuses,
      minDue,
      maxDue
    };
  },
  /* ---------- Warehouse ---------- */
  lowStock() {
    return Store.state.materials.filter(m => m.qty <= m.minQty);
  },
  lastMove(materialId) {
    return Store.state.stockMoves.filter(sm => sm.materialId === materialId).sort((a, b) => b.ts - a.ts)[0] || null;
  },
  materialMoves(materialId) {
    return Store.state.stockMoves.filter(sm => sm.materialId === materialId).sort((a, b) => b.ts - a.ts);
  },
  lineShort(line) {
    var mat = this.material(line.materialId);
    return !line.consumed && mat && mat.qty < line.qty;
  },
  orderShortages(order) {
    return (order.materials || []).filter(l => this.lineShort(l));
  },
  materialInUse(materialId) {
    return Store.state.orders.some(o => !o.archived && (o.materials || []).some(l => l.materialId === materialId && !l.consumed));
  },
  /* ---------- suggesting a SKU ----------
     The shop's own codes follow a shape: MDF-18, SCR-435, SLD-500, EB-W23 —
     a short word from the name, then the numbers in it. So that is what this
     builds. It is only ever a suggestion; the field stays editable. */
  SKU_UNITS: new Set(["MM", "CM", "M", "M2", "KG", "G", "L", "ML", "PCS", "VNT", "KOMPL", "SET", "X"]),
  suggestSku(name, {
    unique = true
  } = {}) {
    var clean = String(name || "").replace(/[ąĄ]/g, "a").replace(/[čČ]/g, "c").replace(/[ęėĘĖ]/g, "e").replace(/[įĮ]/g, "i").replace(/[šŠ]/g, "s").replace(/[ųūŲŪ]/g, "u").replace(/[žŽ]/g, "z").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/(\d)[.,](\d)/g, "$1$2") // 0,6 → 06, so it survives as one token
    .replace(/[^A-Z0-9]+/g, " ").trim();
    var parts = clean.split(/\s+/).filter(Boolean);
    if (!parts.length) return "";
    var isUnit = t => this.SKU_UNITS.has(t);
    /* keep the WHOLE token, not the trimmed head — comparing a 6-character
       head against the token it came from excludes nothing */
    var headToken = parts.find(t => !/^\d+$/.test(t) && !isUnit(t)) || "";
    var head = (headToken || "MAT").slice(0, 6);

    /* a mixed token like ST7 or A356 is a code in its own right, but a unit
       glued on ("3MM") is noise, and a dimension string ("12X1220X2440") is
       only interesting up to its first number */
    var cleanMixed = t => {
      var v = t.replace(/(\d)(MM|CM|KG|ML|M2|M)$/, "$1");
      var dim = v.match(/^(\d+)X\d/);
      if (dim) v = dim[1];
      return v.slice(0, 6);
    };
    var rest = parts.filter(t => t !== headToken && !isUnit(t) && /\d/.test(t));
    var mixed = rest.find(t => /[A-Z]/.test(t));
    var tail = mixed ? cleanMixed(mixed) : rest.filter(t => /^\d+$/.test(t)).join("").slice(0, 5);
    if (!tail && parts.length > 1) {
      var second = parts.find(t => t !== headToken && !isUnit(t));
      tail = second ? second.slice(0, 3) : "";
    }
    var base = (head + (tail ? "-" + tail : "")).replace(/-+$/, "");
    return unique ? this.uniqueSku(base) : base;
  },
  /* Two materials sharing a code is how the wrong thing gets picked later. */
  uniqueSku(base) {
    var taken = new Set(Store.state.materials.map(m => String(m.sku || "").toUpperCase()));
    if (!taken.has(base.toUpperCase())) return base;
    for (var i = 2; i < 100; i++) if (!taken.has((base + "-" + i).toUpperCase())) return base + "-" + i;
    return base + "-" + Date.now().toString(36).slice(-3).toUpperCase();
  },
  /* ---------- matching a written name to warehouse stock ----------
     A SWOOD report list carries the names the designer typed — "BOARD 18",
     "Edge1", "LMDP 18 baltas" — not the shop's SKUs. Exact matching found
     almost nothing, so this widens in steps and stops at the first that is
     still safe to trust. It never guesses from a single short token: "Edge1"
     must not silently become "Edge banding, oak 23 mm". */
  _matTokens(s) {
    return String(s || "").toLowerCase().replace(/(?:[\0-\/:-@\[-`\{-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u055F\u0589-\u05CF\u05EB-\u05EE\u05F3-\u061F\u064B-\u065F\u066A-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07BF\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u086F\u0888\u088F-\u089F\u08CA-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0965\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09E5\u09F2\u09F3\u09FA\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A65\u0A70\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AE5\u0AF0-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B65\u0B70\u0B78-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0BE5\u0BF3-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C62-\u0C65\u0C70-\u0C77\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDC\u0CDF\u0CE2-\u0CE5\u0CF0\u0CF3-\u0D03\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57\u0D62-\u0D65\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DE5\u0DF0-\u0E00\u0E31\u0E34-\u0E3F\u0E47-\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F1F\u0F34-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u104A-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u1368\u137D-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u1712-\u171E\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u17DF\u17EA-\u17EF\u17FA-\u180F\u181A-\u181F\u1879-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19FF\u1A17-\u1A1F\u1A55-\u1A7F\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4D-\u1B4F\u1B5A-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BFF\u1C24-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C8B-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u206F\u2072\u2073\u207A-\u207E\u208A-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A-\u245F\u249C-\u24E9\u2500-\u2775\u2794-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF4-\u2CFC\u2CFE\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u3004\u3008-\u3020\u302A-\u3030\u3036\u3037\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u3191\u3196-\u319F\u31C0-\u31EF\u3200-\u321F\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6F0-\uA716\uA720\uA721\uA789\uA78A\uA7CE\uA7CF\uA7D2\uA7D4\uA7DD-\uA7F1\uA802\uA806\uA80B\uA823-\uA82F\uA836-\uA83F\uA874-\uA881\uA8B4-\uA8CF\uA8DA-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FF\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9DA-\uA9DF\uA9E5\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABE3-\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD06\uDD34-\uDD3F\uDD79-\uDD89\uDD8C-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEE0\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6F\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDBF\uDDF4-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC57\uDC77\uDC78\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE3F\uDE49-\uDE5F\uDE7F\uDEA0-\uDEBF\uDEC8\uDEE5-\uDEEA\uDEF0-\uDEFF\uDF36-\uDF3F\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD24-\uDD2F\uDD3A-\uDD3F\uDD66-\uDD6E\uDD86-\uDE5F\uDE7F\uDEAA-\uDEAF\uDEB2-\uDEC1\uDEC5-\uDEFF\uDF28-\uDF2F\uDF46-\uDF50\uDF55-\uDF6F\uDF82-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC51\uDC70\uDC73\uDC74\uDC76-\uDC82\uDCB0-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDD02\uDD27-\uDD35\uDD40-\uDD43\uDD45\uDD46\uDD48-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDCF\uDDDB\uDDDD-\uDDE0\uDDF5-\uDDFF\uDE12\uDE2C-\uDE3E\uDE41-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDEEF\uDEFA-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDF7F\uDF8A\uDF8C\uDF8D\uDF8F\uDFB6\uDFB8-\uDFD0\uDFD2\uDFD4-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC4F\uDC5A-\uDC5E\uDC62-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEAB-\uDEB7\uDEB9-\uDEBF\uDECA-\uDECF\uDEE4-\uDEFF\uDF1B-\uDF2F\uDF3C-\uDF3F\uDF47-\uDFFF]|\uD806[\uDC2C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD30-\uDD3E\uDD40\uDD42-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE2\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE9C\uDE9E-\uDEAF\uDEF9-\uDFBF\uDFE1-\uDFEF\uDFFA-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC4F\uDC6D-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF3-\uDF01\uDF03\uDF11\uDF34-\uDF4F\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFD5-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD812-\uD817\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD836\uD83D\uD83F\uD87C\uD87D\uD87F\uD889-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF1-\uDFFF]|\uD80D[\uDC30-\uDC40\uDC47-\uDC5F]|\uD810[\uDFFB-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD818[\uDC00-\uDCFF\uDD1E-\uDD2F\uDD3A-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6F\uDEBF\uDECA-\uDECF\uDEEE-\uDEFF\uDF30-\uDF3F\uDF44-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDD3F\uDD6D-\uDD6F\uDD7A-\uDE3F\uDE97-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2\uDFE4-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFE\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD833[\uDC00-\uDCEF\uDCFA-\uDFFF]|\uD834[\uDC00-\uDEBF\uDED4-\uDEDF\uDEF4-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC00-\uDC2F\uDC6E-\uDCFF\uDD2D-\uDD36\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDE8F\uDEAE-\uDEBF\uDEEC-\uDEEF\uDEFA-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCEC-\uDCEF\uDCFA-\uDDCF\uDDEE\uDDEF\uDDFB-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD0-\uDCFF\uDD44-\uDD4A\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCAC\uDCB0\uDCB5-\uDD00\uDD2E\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF3A-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD888[\uDFB0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+/g, " ").split(" ").filter(Boolean);
  },
  matchMaterial(name) {
    var _this9 = this;
    var q = String(name || "").trim();
    if (!q) return null;
    var mats = Store.state.materials;
    var low = q.toLowerCase();
    var exact = mats.find(m => m.name.trim().toLowerCase() === low);
    if (exact) return exact;
    var bySku = mats.find(m => (m.sku || "").trim().toLowerCase() === low);
    if (bySku) return bySku;

    // same characters, different punctuation or spacing
    var flat = s => String(s || "").toLowerCase().replace(/(?:[\0-\/:-@\[-`\{-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u055F\u0589-\u05CF\u05EB-\u05EE\u05F3-\u061F\u064B-\u065F\u066A-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07BF\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u086F\u0888\u088F-\u089F\u08CA-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0965\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09E5\u09F2\u09F3\u09FA\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A65\u0A70\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AE5\u0AF0-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B65\u0B70\u0B78-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0BE5\u0BF3-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C62-\u0C65\u0C70-\u0C77\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDC\u0CDF\u0CE2-\u0CE5\u0CF0\u0CF3-\u0D03\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57\u0D62-\u0D65\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DE5\u0DF0-\u0E00\u0E31\u0E34-\u0E3F\u0E47-\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F1F\u0F34-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u104A-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u1368\u137D-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u1712-\u171E\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u17DF\u17EA-\u17EF\u17FA-\u180F\u181A-\u181F\u1879-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19FF\u1A17-\u1A1F\u1A55-\u1A7F\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4D-\u1B4F\u1B5A-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BFF\u1C24-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C8B-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u206F\u2072\u2073\u207A-\u207E\u208A-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A-\u245F\u249C-\u24E9\u2500-\u2775\u2794-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF4-\u2CFC\u2CFE\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u3004\u3008-\u3020\u302A-\u3030\u3036\u3037\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u3191\u3196-\u319F\u31C0-\u31EF\u3200-\u321F\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6F0-\uA716\uA720\uA721\uA789\uA78A\uA7CE\uA7CF\uA7D2\uA7D4\uA7DD-\uA7F1\uA802\uA806\uA80B\uA823-\uA82F\uA836-\uA83F\uA874-\uA881\uA8B4-\uA8CF\uA8DA-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FF\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9DA-\uA9DF\uA9E5\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABE3-\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD06\uDD34-\uDD3F\uDD79-\uDD89\uDD8C-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEE0\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6F\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDBF\uDDF4-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC57\uDC77\uDC78\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE3F\uDE49-\uDE5F\uDE7F\uDEA0-\uDEBF\uDEC8\uDEE5-\uDEEA\uDEF0-\uDEFF\uDF36-\uDF3F\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD24-\uDD2F\uDD3A-\uDD3F\uDD66-\uDD6E\uDD86-\uDE5F\uDE7F\uDEAA-\uDEAF\uDEB2-\uDEC1\uDEC5-\uDEFF\uDF28-\uDF2F\uDF46-\uDF50\uDF55-\uDF6F\uDF82-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC51\uDC70\uDC73\uDC74\uDC76-\uDC82\uDCB0-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDD02\uDD27-\uDD35\uDD40-\uDD43\uDD45\uDD46\uDD48-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDCF\uDDDB\uDDDD-\uDDE0\uDDF5-\uDDFF\uDE12\uDE2C-\uDE3E\uDE41-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDEEF\uDEFA-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDF7F\uDF8A\uDF8C\uDF8D\uDF8F\uDFB6\uDFB8-\uDFD0\uDFD2\uDFD4-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC4F\uDC5A-\uDC5E\uDC62-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEAB-\uDEB7\uDEB9-\uDEBF\uDECA-\uDECF\uDEE4-\uDEFF\uDF1B-\uDF2F\uDF3C-\uDF3F\uDF47-\uDFFF]|\uD806[\uDC2C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD30-\uDD3E\uDD40\uDD42-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE2\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE9C\uDE9E-\uDEAF\uDEF9-\uDFBF\uDFE1-\uDFEF\uDFFA-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC4F\uDC6D-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF3-\uDF01\uDF03\uDF11\uDF34-\uDF4F\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFD5-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD812-\uD817\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD836\uD83D\uD83F\uD87C\uD87D\uD87F\uD889-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF1-\uDFFF]|\uD80D[\uDC30-\uDC40\uDC47-\uDC5F]|\uD810[\uDFFB-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD818[\uDC00-\uDCFF\uDD1E-\uDD2F\uDD3A-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6F\uDEBF\uDECA-\uDECF\uDEEE-\uDEFF\uDF30-\uDF3F\uDF44-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDD3F\uDD6D-\uDD6F\uDD7A-\uDE3F\uDE97-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2\uDFE4-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFE\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD833[\uDC00-\uDCEF\uDCFA-\uDFFF]|\uD834[\uDC00-\uDEBF\uDED4-\uDEDF\uDEF4-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC00-\uDC2F\uDC6E-\uDCFF\uDD2D-\uDD36\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDE8F\uDEAE-\uDEBF\uDEEC-\uDEEF\uDEFA-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCEC-\uDCEF\uDCFA-\uDDCF\uDDEE\uDDEF\uDDFB-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD0-\uDCFF\uDD44-\uDD4A\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCAC\uDCB0\uDCB5-\uDD00\uDD2E\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF3A-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD888[\uDFB0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+/g, "");
    var same = mats.find(m => flat(m.name) === flat(q) || flat(m.sku) === flat(q));
    if (same) return same;

    // every word of the shorter name appears in the longer one, and the
    // overlap carries real information: a word of 3+ letters AND a number
    var qt = this._matTokens(q);
    if (!qt.length) return null;
    var best = null,
      bestScore = 0;
    var _iterator34 = _createForOfIteratorHelper(mats),
      _step34;
    try {
      var _loop2 = function _loop2() {
          var m = _step34.value;
          var mt = _this9._matTokens(m.name + " " + (m.sku || ""));
          var shared = qt.filter(t => mt.includes(t));
          if (shared.length < 2) return 0; // continue
          var hasWord = shared.some(t => /(?:[A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u0870-\u0887\u0889-\u088E\u08A0-\u08C9\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C5D\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16F1-\u16F8\u1700-\u1711\u171F-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4C\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C8A\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA7CD\uA7D0\uA7D1\uA7D3\uA7D5-\uA7DC\uA7F2-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF2D-\uDF40\uDF42-\uDF49\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF]|\uD801[\uDC00-\uDC9D\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDD70-\uDD7A\uDD7C-\uDD8A\uDD8C-\uDD92\uDD94\uDD95\uDD97-\uDDA1\uDDA3-\uDDB1\uDDB3-\uDDB9\uDDBB\uDDBC\uDDC0-\uDDF3\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67\uDF80-\uDF85\uDF87-\uDFB0\uDFB2-\uDFBA]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD23\uDD4A-\uDD65\uDD6F-\uDD85\uDE80-\uDEA9\uDEB0\uDEB1\uDEC2-\uDEC4\uDF00-\uDF1C\uDF27\uDF30-\uDF45\uDF70-\uDF81\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC71\uDC72\uDC75\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE2B\uDE3F\uDE40\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61\uDF80-\uDF89\uDF8B\uDF8E\uDF90-\uDFB5\uDFB7\uDFD1\uDFD3]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE80-\uDEAA\uDEB8\uDF00-\uDF1A\uDF40-\uDF46]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCDF\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEB0-\uDEF8\uDFC0-\uDFE0]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDEE0-\uDEF2\uDF02\uDF04-\uDF10\uDF12-\uDF33\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC80-\uDD43]|\uD80B[\uDF90-\uDFF0]|[\uD80C\uD80E\uD80F\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883\uD885-\uD887][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2F\uDC41-\uDC46\uDC60-\uDFFF]|\uD810[\uDC00-\uDFFA]|\uD811[\uDC00-\uDE46]|\uD818[\uDD00-\uDD1D]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE70-\uDEBE\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDD40-\uDD6C\uDE40-\uDE7F\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDCFF-\uDD08]|\uD82B[\uDFF0-\uDFF3\uDFF5-\uDFFB\uDFFD\uDFFE]|\uD82C[\uDC00-\uDD22\uDD32\uDD50-\uDD52\uDD55\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD837[\uDF00-\uDF1E\uDF25-\uDF2A]|\uD838[\uDC30-\uDC6D\uDD00-\uDD2C\uDD37-\uDD3D\uDD4E\uDE90-\uDEAD\uDEC0-\uDEEB]|\uD839[\uDCD0-\uDCEB\uDDD0-\uDDED\uDDF0\uDFE0-\uDFE6\uDFE8-\uDFEB\uDFED\uDFEE\uDFF0-\uDFFE]|\uD83A[\uDC00-\uDCC4\uDD00-\uDD43\uDD4B]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDEDF\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF39\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0\uDFF0-\uDFFF]|\uD87B[\uDC00-\uDE5D]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A\uDF50-\uDFFF]|\uD888[\uDC00-\uDFAF]){3,}/.test(t));
          var hasNum = shared.some(t => /\d/.test(t));
          if (!hasWord || !hasNum) return 0; // continue
          var score = shared.length / Math.max(qt.length, 1);
          if (score > bestScore) {
            bestScore = score;
            best = m;
          }
        },
        _ret;
      for (_iterator34.s(); !(_step34 = _iterator34.n()).done;) {
        _ret = _loop2();
        if (_ret === 0) continue;
      }
    } catch (err) {
      _iterator34.e(err);
    } finally {
      _iterator34.f();
    }
    return bestScore >= 0.6 ? best : null;
  },
  /* ---------- the briefing ----------
     Everything an outside pair of eyes would need to judge this shop, built
     from what the app already knows. Lists are capped so the whole thing stays
     small enough to send, and the tracking coverage is stated up front: this
     shop's biggest analytical trap is time that was never logged, which reads
     as "fast" rather than "unmeasured" unless it is called out. */
  briefing({
    days = 90
  } = {}) {
    var to = Date.now(),
      from = to - days * DAY;
    var s = Store.state;
    var rep = this.report({
      from,
      to,
      scope: "all"
    });
    var active = s.orders.filter(o => !o.archived && !o.shipped);
    var att = App && App.me ? this.attention(App.me.id) : this.attention((s.members[0] || {}).id);
    var hrs = ms => Math.round(ms / 360000) / 10;
    var day = ms => Math.round(ms / Math.max(1, this.shiftDayMs()) * 10) / 10;

    /* How much of the work actually carries logged time. Without this, an
       untracked shop looks like an instant one. */
    var opsTotal = 0,
      opsTimed = 0,
      opsDone = 0,
      opsDoneTimed = 0;
    var _iterator35 = _createForOfIteratorHelper(s.orders),
      _step35;
    try {
      for (_iterator35.s(); !(_step35 = _iterator35.n()).done;) {
        var o = _step35.value;
        var _iterator37 = _createForOfIteratorHelper(o.ops),
          _step37;
        try {
          for (_iterator37.s(); !(_step37 = _iterator37.n()).done;) {
            var op = _step37.value;
            opsTotal++;
            if (this.opElapsed(op) > 0) opsTimed++;
            if (op.status === "done") {
              opsDone++;
              if (this.opElapsed(op) > 0) opsDoneTimed++;
            }
          }
        } catch (err) {
          _iterator37.e(err);
        } finally {
          _iterator37.f();
        }
      }
    } catch (err) {
      _iterator35.e(err);
    } finally {
      _iterator35.f();
    }
    var byCustomer = new Map();
    var _iterator36 = _createForOfIteratorHelper(rep.finished),
      _step36;
    try {
      for (_iterator36.s(); !(_step36 = _iterator36.n()).done;) {
        var f = _step36.value;
        var k = f.order.client || "—";
        var c = byCustomer.get(k) || {
          customer: k,
          finished: 0,
          onTime: 0,
          leadDays: []
        };
        c.finished++;
        if (f.finishedAt <= f.order.due) c.onTime++;
        c.leadDays.push(day(this.workMsBetween(f.order.createdAt, f.finishedAt)));
        byCustomer.set(k, c);
      }
    } catch (err) {
      _iterator36.e(err);
    } finally {
      _iterator36.f();
    }
    return {
      generatedAt: new Date(to).toISOString(),
      period: {
        days,
        from: new Date(from).toISOString(),
        to: new Date(to).toISOString()
      },
      shop: {
        name: s.shopName || "",
        people: s.members.length,
        roles: s.members.reduce((m, x) => (m[x.role] = (m[x.role] || 0) + 1, m), {}),
        stations: this.stationsOf("prod").map(x => x.name),
        workingDay: {
          hoursPerDay: Math.round(this.shiftDayMs() / 360000) / 10,
          days: (this.shift().days || []).length
        },
        automaticTimeTracking: !!this.shift().auto
      },
      tracking: {
        tasksTotal: opsTotal,
        tasksWithLoggedTime: opsTimed,
        finishedTasks: opsDone,
        finishedTasksWithLoggedTime: opsDoneTimed,
        note: opsDone && opsDoneTimed / opsDone < 0.5 ? "Most finished work carries no logged time, so any hours figure below is only the part that was tracked." : "Time tracking covers most finished work."
      },
      delivery: {
        finishedInPeriod: rep.count,
        onTimePercent: rep.onTimePct,
        avgLeadWorkingDays: rep.count ? day(rep.avgLead) : null,
        openJobs: active.length,
        perWeek: rep.buckets.map(b => ({
          weekOf: new Date(b.from).toISOString().slice(0, 10),
          finished: b.n
        }))
      },
      time: {
        hoursLogged: hrs(rep.workedMs),
        hoursEstimatedForThatWork: hrs(rep.estMs),
        byStation: rep.stations.slice(0, 15).map(x => ({
          station: x.station.name,
          tasks: x.n,
          hours: hrs(x.ms),
          estimatedHours: hrs(x.est),
          overUnderPercent: x.est ? Math.round((x.ms - x.est) / x.est * 100) : null
        })),
        byPerson: rep.members.slice(0, 20).map(x => ({
          person: x.member.name,
          tasks: x.n,
          hours: hrs(x.ms)
        }))
      },
      workInProgress: this.stationsOf("prod").map(st => ({
        station: st.name,
        waiting: this.stationQueue(st.id).length
      })),
      attention: {
        blocked: att.blocked.slice(0, 10).map(b => ({
          job: b.order.num,
          product: b.order.product,
          customer: b.order.client,
          station: (this.station(b.op.stationId) || {}).name,
          reason: b.op.blockNote || ""
        })),
        overdue: att.late.slice(0, 10).map(o => ({
          job: o.num,
          product: o.product,
          customer: o.client,
          daysLate: Math.round((Date.now() - o.due) / DAY)
        })),
        notMovedInDays: att.stale.slice(0, 10).map(x => ({
          job: x.order.num,
          product: x.order.product,
          customer: x.order.client,
          daysQuiet: x.since ? Math.round((Date.now() - x.since) / DAY) : null
        }))
      },
      materials: {
        shortForAcceptedWork: this.demandShortfalls().slice(0, 20).map(r => {
          var d = r.material ? this.onOrderDetail(r.material.id) : null;
          return {
            material: r.name,
            unit: r.unit,
            needed: r.need,
            inStock: r.stock,
            short: r.short,
            inTheWarehouse: !!r.material,
            onOrder: d ? d.sent : 0,
            onlyDrafted: d ? d.draft : 0,
            expected: d && d.expectedAt ? new Date(d.expectedAt).toISOString().slice(0, 10) : null,
            overdueDelivery: !!(d && d.late),
            jobsWaiting: r.lines.slice(0, 6).map(l => l.order.num)
          };
        }),
        notLinkedToStock: this.materialDemand().filter(r => !r.material).length,
        openPurchaseOrders: this.openPurchases().length
      },
      customers: [...byCustomer.values()].sort((a, b) => b.finished - a.finished).slice(0, 15).map(c => ({
        customer: c.customer,
        finishedInPeriod: c.finished,
        onTime: c.onTime,
        lateJobs: c.finished - c.onTime,
        avgLeadWorkingDays: c.leadDays.length ? Math.round(c.leadDays.reduce((a, b) => a + b, 0) / c.leadDays.length * 10) / 10 : null
      })),
      finishedJobs: rep.finished.slice(0, 25).map(f => ({
        job: f.order.num,
        product: f.order.product,
        customer: f.order.client,
        finished: new Date(f.finishedAt).toISOString().slice(0, 10),
        onTime: f.finishedAt <= f.order.due,
        leadWorkingDays: day(this.workMsBetween(f.order.createdAt, f.finishedAt)),
        hoursLogged: hrs(this.orderActualMs(f.order)),
        hoursEstimated: hrs(this.orderEstMs(f.order))
      }))
    };
  },
  /* ---------- one place to look first ----------
     Everything below already existed, in five different views. With a lot of
     projects running, the cost was not that any single screen was wrong — it
     was that nobody could hold five of them in their head every morning. */
  STALE_DAYS: 7,
  attention(memberId) {
    var active = Store.state.orders.filter(o => !o.archived && !o.shipped);
    var blocked = [];
    var _iterator38 = _createForOfIteratorHelper(active),
      _step38;
    try {
      for (_iterator38.s(); !(_step38 = _iterator38.n()).done;) {
        var o = _step38.value;
        var _iterator41 = _createForOfIteratorHelper(o.ops),
          _step41;
        try {
          for (_iterator41.s(); !(_step41 = _iterator41.n()).done;) {
            var op = _step41.value;
            if (op.status === "blocked") blocked.push({
              order: o,
              op
            });
          }
        } catch (err) {
          _iterator41.e(err);
        } finally {
          _iterator41.f();
        }
      }
    } catch (err) {
      _iterator38.e(err);
    } finally {
      _iterator38.f();
    }
    var late = active.filter(o => this.orderStatus(o) !== "ready" && o.due < Date.now()).sort((a, b) => a.due - b.due);

    /* a job nobody has touched in a week, that is not finished and not
       waiting on anything named — the quiet kind of lost */
    var cut = Date.now() - this.STALE_DAYS * DAY;
    var touched = new Map();
    var _iterator39 = _createForOfIteratorHelper(Store.state.activity),
      _step39;
    try {
      for (_iterator39.s(); !(_step39 = _iterator39.n()).done;) {
        var a = _step39.value;
        if (!a.orderId) continue;
        touched.set(a.orderId, Math.max(touched.get(a.orderId) || 0, a.ts));
      }
    } catch (err) {
      _iterator39.e(err);
    } finally {
      _iterator39.f();
    }
    var stale = active.filter(o => {
      if (this.orderStatus(o) === "ready") return false;
      var last = Math.max(touched.get(o.id) || 0, o.createdAt || 0, ...o.ops.map(op => op.completedAt || op.startedAt || 0));
      return last < cut;
    }).map(o => ({
      order: o,
      since: Math.max(touched.get(o.id) || 0, o.createdAt || 0)
    })).sort((a, b) => a.since - b.since);
    var seen = this.pref(memberId, "attentionSeen", 0);
    var changed = Store.state.activity.filter(a => a.ts > seen && a.who !== memberId);
    var shortfalls = this.demandShortfalls();
    var waiting = this.blockedByStock();

    /* something ordered that was promised by now and has not turned up —
       the thing nobody was watching, which is why details exist at all */
    var overdueDetails = [];
    var _iterator40 = _createForOfIteratorHelper(active),
      _step40;
    try {
      for (_iterator40.s(); !(_step40 = _iterator40.n()).done;) {
        var _o2 = _step40.value;
        var _iterator42 = _createForOfIteratorHelper(this.details(_o2)),
          _step42;
        try {
          for (_iterator42.s(); !(_step42 = _iterator42.n()).done;) {
            var d = _step42.value;
            if (this.detailLate(d)) overdueDetails.push({
              order: _o2,
              detail: d
            });
          }
        } catch (err) {
          _iterator42.e(err);
        } finally {
          _iterator42.f();
        }
      }
    } catch (err) {
      _iterator40.e(err);
    } finally {
      _iterator40.f();
    }
    overdueDetails.sort((a, b) => a.detail.due - b.detail.due);
    return {
      blocked,
      late,
      stale,
      changed,
      shortfalls,
      waiting,
      seen,
      overdueDetails,
      count: blocked.length + late.length + stale.length + shortfalls.length + overdueDetails.length
    };
  },
  /* ---------- what the live jobs actually need ----------
     Low stock compares what is on the shelf against a static minimum, which
     says nothing about the work already accepted. This compares it against
     the jobs in hand: a shop can be green on every minimum and still be short
     for what it has promised, and the only way to find that out used to be
     opening projects one at a time.
      Lines with no warehouse link are included on purpose and grouped by the
     name they were imported under — an unmatched SWOOD material is exactly
     the kind that goes missing. */
  materialDemand({
    includeSatisfied = true
  } = {}) {
    var rows = new Map();
    var _iterator43 = _createForOfIteratorHelper(Store.state.orders),
      _step43;
    try {
      for (_iterator43.s(); !(_step43 = _iterator43.n()).done;) {
        var o = _step43.value;
        if (o.archived || o.shipped) continue;
        var _iterator44 = _createForOfIteratorHelper(o.materials || []),
          _step44;
        try {
          for (_iterator44.s(); !(_step44 = _iterator44.n()).done;) {
            var line = _step44.value;
            if (line.consumed) continue; // already taken off the shelf
            var mat = line.materialId ? this.material(line.materialId) : null;
            var name = mat && mat.name || line.name || "—";
            var key = mat ? mat.id : "name:" + this._stName(name);
            if (!rows.has(key)) {
              rows.set(key, {
                key,
                material: mat,
                name,
                unit: mat && mat.unit || line.unit || "",
                need: 0,
                stock: mat ? mat.qty : this.spotStock(key),
                // one-off stock counts too
                spot: !mat && this.spotStock(key) !== null,
                onOrder: mat ? this.onOrder(mat.id) : 0,
                lines: []
              });
            }
            var r = rows.get(key);
            r.need = Math.round((r.need + (Number(line.qty) || 0)) * 1000) / 1000;
            r.lines.push({
              order: o,
              line,
              qty: Number(line.qty) || 0
            });
          }
        } catch (err) {
          _iterator44.e(err);
        } finally {
          _iterator44.f();
        }
      }
    } catch (err) {
      _iterator43.e(err);
    } finally {
      _iterator43.f();
    }
    var out = [...rows.values()].map(r => _objectSpread(_objectSpread({}, r), {}, {
      // an unlinked material has no stock figure, so everything it needs is short
      short: Math.round((r.need - (r.stock || 0) - r.onOrder) * 1000) / 1000
    }));
    return out.filter(r => includeSatisfied || r.short > 0).sort((a, b) => b.short - a.short || b.need - a.need || a.name.localeCompare(b.name));
  },
  /* ---------- stock we happen to have, without a catalogue entry ----------
     A one-off material does not deserve a permanent warehouse item — it is
     bought for one job and never seen again. But the jobs still need to know
     it is covered, so the amount on hand is recorded against the NAME the
     jobs are asking for. No SKU, no minimum, no supplier: just "we have 800
     of this". Held as a plain map and created on first use, because nothing
     existing has to be reshaped for it.
     A linked material ignores this entirely — the warehouse is the truth then. */
  _spot() {
    return Store.state.spotStock = Store.state.spotStock || {};
  },
  spotStock(key) {
    var r = this._spot()[key];
    return r && typeof r.qty === "number" ? r.qty : null;
  },
  spotNote(key) {
    return (this._spot()[key] || {}).note || "";
  },
  /* Not just HOW MUCH is coming, but when — and whether it has actually been
     ordered or is still sitting in a draft nobody sent. "On order: 200" with
     no date answers half the question the shop is asking. */
  onOrderDetail(materialId) {
    var sent = 0,
      draft = 0,
      expectedAt = null,
      count = 0;
    var _iterator45 = _createForOfIteratorHelper(this.openPurchases()),
      _step45;
    try {
      for (_iterator45.s(); !(_step45 = _iterator45.n()).done;) {
        var po = _step45.value;
        var out = po.lines.filter(l => l.materialId === materialId).reduce((n, l) => n + this.poLineOutstanding(l), 0);
        if (!out) continue;
        if (po.status === "sent") {
          sent += out;
          count++;
          // the LATEST of them: that is when the shortfall actually clears
          if (po.expectedAt && (!expectedAt || po.expectedAt > expectedAt)) expectedAt = po.expectedAt;
        } else {
          draft += out;
        }
      }
    } catch (err) {
      _iterator45.e(err);
    } finally {
      _iterator45.f();
    }
    return {
      sent,
      draft,
      total: Math.round((sent + draft) * 1000) / 1000,
      expectedAt,
      count,
      late: !!(expectedAt && expectedAt < Date.now())
    };
  },
  /* One demand row is an aggregate of lines on several orders, so anything
     done to it — renaming, linking to stock — has to reach every one of them.
     Looked up fresh rather than held, because the rows are rebuilt on render. */
  demandRow(key) {
    return this.materialDemand().find(r => r.key === key) || null;
  },
  demandLines(key) {
    var r = this.demandRow(key);
    return r ? r.lines : [];
  },
  /* Jobs that cannot be made with what is on the shelf and on its way. */
  demandShortfalls() {
    return this.materialDemand({
      includeSatisfied: false
    });
  },
  blockedByStock() {
    var ids = new Set();
    var _iterator46 = _createForOfIteratorHelper(this.demandShortfalls()),
      _step46;
    try {
      for (_iterator46.s(); !(_step46 = _iterator46.n()).done;) {
        var r = _step46.value;
        var _iterator47 = _createForOfIteratorHelper(r.lines),
          _step47;
        try {
          for (_iterator47.s(); !(_step47 = _iterator47.n()).done;) {
            var l = _step47.value;
            ids.add(l.order.id);
          }
        } catch (err) {
          _iterator47.e(err);
        } finally {
          _iterator47.f();
        }
      }
    } catch (err) {
      _iterator46.e(err);
    } finally {
      _iterator46.f();
    }
    return [...ids].map(id => this.order(id)).filter(Boolean);
  },
  /* ---------- resolving a production stage to a real station ----------
     The SWOOD importer used to ask for stations by the seed's ids — "edge",
     "cnc", "asm" — but a shop that imported its own station list has ids like
     "st-briaunavimas", so every lookup missed and the route collapsed to a
     single step. Names are what actually survive between installs, so a stage
     is matched by name (Lithuanian first, since that is what the shop uses)
     and only then by id. */
  STAGE_NAMES: {
    cut: ["pjovimas", "pjaustymas", "cutting", "saw"],
    edge: ["briaunavimas", "kantavimas", "edge banding", "edgebanding", "briaunos"],
    cnc: ["grezimas", "cnc", "drilling"],
    asm: ["surinkimas", "assembly", "montavimas"],
    qc: ["kokybe", "quality check", "quality", "patikra", "kk"],
    pack: ["pakavimas", "packing", "pakuote"]
  },
  _stName: s => String(s || "").toLowerCase().replace(/[ąĄ]/g, "a").replace(/[čČ]/g, "c").replace(/[ęėĘĖ]/g, "e").replace(/[įĮ]/g, "i").replace(/[šŠ]/g, "s").replace(/[ųūŲŪ]/g, "u").replace(/[žŽ]/g, "z").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim(),
  stationFor(stage) {
    var _this10 = this;
    var byId = this.station(stage);
    if (byId && byId.kind !== "eng") return byId;
    var prod = this.stationsOf("prod");
    var _iterator48 = _createForOfIteratorHelper(this.STAGE_NAMES[stage] || []),
      _step48;
    try {
      var _loop3 = function _loop3() {
          var want = _step48.value;
          var hit = prod.find(st => {
            var n = _this10._stName(st.name);
            return n === want || n.split(" ").includes(want) || n.includes(want);
          });
          if (hit) return {
            v: hit
          };
        },
        _ret2;
      for (_iterator48.s(); !(_step48 = _iterator48.n()).done;) {
        _ret2 = _loop3();
        if (_ret2) return _ret2.v;
      }
    } catch (err) {
      _iterator48.e(err);
    } finally {
      _iterator48.f();
    }
    return null;
  },
  /* ---------- repairing an imported route ----------
     A job imported before stages were resolved by name got a single cutting
     step, so it looked finished the moment it was cut. Re-importing would
     throw away the cutting already done, so instead work out what is missing
     and append it — nothing existing is touched. */
  swoodRouteGaps(order) {
    var _this11 = this;
    if (!order || !order.swood) return null;
    var finalName = order.items.find(i => (order.parts || []).every(p => p.itemId !== i.id));
    var add = [];
    var _iterator49 = _createForOfIteratorHelper(order.items),
      _step49;
    try {
      var _loop4 = function _loop4() {
          var item = _step49.value;
          if (finalName && item.id === finalName.id) return 0; // continue
          // the assembly line, handled below
          var parts = (order.parts || []).filter(p => p.itemId === item.id);
          if (!parts.length) return 0; // continue
          var edged = parts.some(p => (p.edges || []).some(Boolean));
          var want = [];
          if (edged) {
            var st = _this11.stationFor("edge");
            if (st) want.push(st);
          }
          var cnc = _this11.stationFor("cnc");
          if (cnc) want.push(cnc);
          var held = new Set(order.ops.filter(op => op.itemId === item.id).map(op => op.stationId));
          var missing = want.filter(st => !held.has(st.id));
          if (missing.length) add.push({
            item,
            stations: missing
          });
        },
        _ret3;
      for (_iterator49.s(); !(_step49 = _iterator49.n()).done;) {
        _ret3 = _loop4();
        if (_ret3 === 0) continue;
      }
      // and the closing line — assembly, checking, packing
    } catch (err) {
      _iterator49.e(err);
    } finally {
      _iterator49.f();
    }
    var finalRoute = ["asm", "qc", "pack"].map(k => this.stationFor(k)).filter(Boolean);
    var hasFinal = !!finalName && order.ops.some(op => op.itemId === finalName.id);
    var addFinal = !hasFinal && finalRoute.length ? finalRoute : null;
    if (!add.length && !addFinal) return null;
    return {
      add,
      addFinal,
      modules: order.swood && order.swood.modules || 1
    };
  },
  /* ---------- Purchasing ---------- */
  supplier: id => (Store.state.suppliers || []).find(s => s.id === id) || null,
  suppliers() {
    return [...(Store.state.suppliers || [])].sort((a, b) => a.name.localeCompare(b.name));
  },
  purchase: id => (Store.state.purchases || []).find(p => p.id === id) || null,
  /* Newest first — a purchasing screen is read from the top */
  purchases(status) {
    var list = [...(Store.state.purchases || [])];
    if (status) list = list.filter(p => status === "open" ? p.status === "draft" || p.status === "sent" : p.status === status);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  },
  openPurchases() {
    return this.purchases("open");
  },
  poLineOutstanding: l => Math.max(0, l.qty - (l.received || 0)),
  poOutstanding(po) {
    return po.lines.reduce((n, l) => n + this.poLineOutstanding(l), 0);
  },
  poFullyReceived(po) {
    return po.lines.length > 0 && po.lines.every(l => this.poLineOutstanding(l) === 0);
  },
  supplierUsed(supplierId) {
    return this.openPurchases().some(p => p.supplierId === supplierId);
  },
  /* How much of a material is already coming — a drafted order counts, or the
     reorder suggestion would keep proposing what somebody just wrote down. */
  onOrder(materialId) {
    var n = 0;
    var _iterator50 = _createForOfIteratorHelper(this.openPurchases()),
      _step50;
    try {
      for (_iterator50.s(); !(_step50 = _iterator50.n()).done;) {
        var po = _step50.value;
        var _iterator51 = _createForOfIteratorHelper(po.lines),
          _step51;
        try {
          for (_iterator51.s(); !(_step51 = _iterator51.n()).done;) {
            var l = _step51.value;
            if (l.materialId === materialId) n += this.poLineOutstanding(l);
          }
        } catch (err) {
          _iterator51.e(err);
        } finally {
          _iterator51.f();
        }
      }
    } catch (err) {
      _iterator50.e(err);
    } finally {
      _iterator50.f();
    }
    return n;
  },
  /* Top a material back up to its reorder level, minus whatever is already
     on its way. Returns only the materials that still need something. */
  reorderTarget(m) {
    return m.reorderQty || Math.max(m.minQty * 2, m.minQty + 1);
  },
  reorderSuggestions() {
    var out = [];
    var _iterator52 = _createForOfIteratorHelper(Store.state.materials),
      _step52;
    try {
      for (_iterator52.s(); !(_step52 = _iterator52.n()).done;) {
        var m = _step52.value;
        if (m.qty > m.minQty) continue;
        var qty = Math.round((this.reorderTarget(m) - m.qty - this.onOrder(m.id)) * 100) / 100;
        if (qty > 0) out.push({
          material: m,
          qty,
          supplier: this.supplier(m.supplierId)
        });
      }
    } catch (err) {
      _iterator52.e(err);
    } finally {
      _iterator52.f();
    }
    return out.sort((a, b) => {
      var _a$supplier, _b$supplier;
      return (((_a$supplier = a.supplier) === null || _a$supplier === void 0 ? void 0 : _a$supplier.name) || "￿").localeCompare(((_b$supplier = b.supplier) === null || _b$supplier === void 0 ? void 0 : _b$supplier.name) || "￿");
    });
  },
  /* Grouped the way the orders will actually be placed: one per supplier */
  reorderBySupplier() {
    var groups = new Map();
    var _iterator53 = _createForOfIteratorHelper(this.reorderSuggestions()),
      _step53;
    try {
      for (_iterator53.s(); !(_step53 = _iterator53.n()).done;) {
        var s = _step53.value;
        var key = s.material.supplierId || "";
        if (!groups.has(key)) groups.set(key, {
          supplier: s.supplier,
          lines: []
        });
        groups.get(key).lines.push(s);
      }
    } catch (err) {
      _iterator53.e(err);
    } finally {
      _iterator53.f();
    }
    return [...groups.values()];
  },
  /* ---------- modules: the cabinets, not a number ----------
     A SWOOD job's assembly line is counted in modules. "0/48" tells the person
     at the bench nothing; the names do. Ticking a module is what moves the
     assembly task's count, so the two can never disagree. */
  orderModules(o) {
    return o && o.modules || [];
  },
  hasModules(o) {
    return this.orderModules(o).length > 0;
  },
  module(o, id) {
    return this.orderModules(o).find(m => m.id === id) || null;
  },
  modulesDone(o) {
    return this.orderModules(o).reduce((n, m) => n + (m.done || 0), 0);
  },
  modulesTotal(o) {
    return this.orderModules(o).reduce((n, m) => n + (m.qty || 1), 0);
  },
  /* ---------- correcting the cabinet count ----------
     Modules are derived from SOLIDNAME by stripping the part name off the
     front, and that guess is only as good as the shop's naming. When it counts
     48 and the job is 16 cabinets, it has been counting PANELS — three names
     per cabinet that never collapsed.
      Rather than throw the names away and number them 1..16, try to recover the
     real grouping: trim segments off either end and see whether the names fall
     into exactly the number asked for. "SPINTELE_A1_SONAS", "SPINTELE_A1_DURYS"
     and "SPINTELE_A1_LENTYNA" become "SPINTELE_A1" — which is what the cabinet
     is actually called. Only if nothing groups cleanly does it fall back to
     numbering. */
  /* ---------- one customer's job, not five unrelated projects ----------
     A house is quoted and drawn piece by piece — GI_SI_VIRT, GI_SI_MIEG,
     GI_SI_KOR are the kitchen, the bedroom and the hall of ONE job — and every
     view treated them as strangers. The shop already writes the grouping into
     the name, so read it rather than asking anyone to maintain it twice.
      An explicit portfolio always wins; a shared name prefix is the fallback,
     and only counts when more than one project actually shares it, so a
     one-off keeps its own name instead of being filed under half of it. */
  jobKeyOf(o, shared, byPrefix) {
    if (o.portfolioId && this.portfolio(o.portfolioId)) return "pf:" + o.portfolioId;
    var pre = this.namePrefix(o.product || o.num || "");
    /* A project nobody filed, whose name matches ones that WERE filed, belongs
       with them. GI_SI_KOR has no portfolio and "GI_SI_KOR" typed into its
       client field; GI_SI_MIEG and GI_SI_VIRT are both in "Giedrius Sirv".
       Without this the hall ends up in a lane of its own, which is the exact
       thing being fixed. Only when one portfolio claims that prefix — two
       would be a guess, and a guess here is worse than a separate row. */
    if (pre && byPrefix && byPrefix.get(pre) && byPrefix.get(pre).size === 1) return "pf:" + [...byPrefix.get(pre)][0];
    if (pre && (!shared || shared.has(pre))) return "px:" + pre;
    if (o.client) return "cl:" + this.norm(o.client);
    return "id:" + o.id;
  },
  /* everything before the last _ segment: GI_SI_VIRT → GI_SI */
  namePrefix(name) {
    var segs = String(name).split("_").filter(Boolean);
    return segs.length >= 2 ? segs.slice(0, -1).join("_") : "";
  },
  norm(v) {
    return String(v || "").trim().toLowerCase();
  },
  /* ---------- a colour per job ----------
     Red is left out: in this app red means something is wrong — an overdue
     chip, a blocked note — and a job that merely exists should never borrow
     that. It stays pickable by hand, just never handed out automatically.
      With more jobs than hues two will eventually share one. The colour is
     derived from the job's own key, so it is stable: it never changes when the
     list is filtered or something else is added, and the name is still what
     identifies a lane — the colour only helps the eye find it again. */
  JOB_COLORS: ["blue", "indigo", "teal", "purple", "green", "orange", "gray"],
  jobColor(keyOrGroup) {
    var g = typeof keyOrGroup === "string" ? null : keyOrGroup;
    var key = g ? g.key : keyOrGroup;
    if (g && g.pf && g.pf.color) return g.pf.color;
    if (key && key.startsWith("pf:")) {
      var pf = this.portfolio(key.slice(3));
      if (pf && pf.color) return pf.color;
    }
    return this.JOB_COLORS[this._hue(String(key)) % this.JOB_COLORS.length];
  },
  /* FNV-1a with murmur3's finaliser. A plain djb2 put three of the shop's six
     visible lanes on the same green — short keys that differ in one or two
     characters land in neighbouring buckets without an avalanche step. On the
     40 jobs in the real backup this spreads 9/3/3/6/12/5/2 into 5/4/8/6/7/4/6. */
  _hue(str) {
    var h = 2166136261;
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    h ^= h >>> 16;
    h = Math.imul(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = Math.imul(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h >>> 0;
  },
  jobLabel(key, orders) {
    if (key.startsWith("pf:")) {
      var p = this.portfolio(key.slice(3));
      return p ? p.name : "Portfolio";
    }
    if (key.startsWith("px:")) return key.slice(3);
    if (key.startsWith("cl:")) return orders[0] && orders[0].client || "—";
    return orders[0] && (orders[0].product || orders[0].num) || "—";
  },
  /* The pieces of a job, and how the job as a whole is doing. */
  jobGroups(orders) {
    /* Which portfolios own which name prefixes — so a project left unfiled can
       be matched to the job its siblings are already in. */
    var byPrefix = new Map();
    var _iterator54 = _createForOfIteratorHelper(orders),
      _step54;
    try {
      for (_iterator54.s(); !(_step54 = _iterator54.n()).done;) {
        var o = _step54.value;
        if (!(o.portfolioId && this.portfolio(o.portfolioId))) continue;
        var pre = this.namePrefix(o.product || o.num || "");
        if (!pre) continue;
        if (!byPrefix.has(pre)) byPrefix.set(pre, new Set());
        byPrefix.get(pre).add(o.portfolioId);
      }

      /* Count prefixes only among the projects nobody has filed by hand. A
         portfolio has already claimed its own, and counting those made a prefix
         look shared when the single project left behind was the only one using
         it — which filed it under half its own name. */
    } catch (err) {
      _iterator54.e(err);
    } finally {
      _iterator54.f();
    }
    var loose = orders.filter(o => !(o.portfolioId && this.portfolio(o.portfolioId)));
    var counts = new Map();
    var _iterator55 = _createForOfIteratorHelper(loose),
      _step55;
    try {
      for (_iterator55.s(); !(_step55 = _iterator55.n()).done;) {
        var _o3 = _step55.value;
        var _pre = this.namePrefix(_o3.product || _o3.num || "");
        if (_pre && !byPrefix.has(_pre)) counts.set(_pre, (counts.get(_pre) || 0) + 1);
      }
    } catch (err) {
      _iterator55.e(err);
    } finally {
      _iterator55.f();
    }
    var shared = new Set([...counts].filter(([, n]) => n > 1).map(([k]) => k));
    var by = new Map();
    var _iterator56 = _createForOfIteratorHelper(orders),
      _step56;
    try {
      for (_iterator56.s(); !(_step56 = _iterator56.n()).done;) {
        var _o4 = _step56.value;
        var k = this.jobKeyOf(_o4, shared, byPrefix);
        if (!by.has(k)) by.set(k, []);
        by.get(k).push(_o4);
      }
    } catch (err) {
      _iterator56.e(err);
    } finally {
      _iterator56.f();
    }
    var groups = [...by].map(([key, list]) => {
      var dues = list.map(o => o.due).filter(Boolean);
      var done = list.reduce((n, o) => n + this.progress(o).done, 0);
      var total = list.reduce((n, o) => n + this.progress(o).total, 0);
      var pf = key.startsWith("pf:") ? this.portfolio(key.slice(3)) : null;
      return {
        key,
        orders: list,
        pf,
        color: this.jobColor({
          key,
          pf
        }),
        label: this.jobLabel(key, list),
        client: list[0].client || "",
        single: list.length === 1,
        due: dues.length ? Math.min(...dues) : null,
        overdue: list.filter(o => o.due && o.due < Date.now() && !o.archived && !o.shipped).length,
        done,
        total,
        pct: total ? Math.round(done / total * 100) : 0
      };
    });
    /* worst first: a job with something overdue is the one to look at */
    groups.sort((a, b) => b.overdue - a.overdue || (a.due || Infinity) - (b.due || Infinity) || a.label.localeCompare(b.label));
    /* …unless someone has put the jobs in order by dragging. Jobs nobody has
       placed yet (new ones) stay on top, where they are seen; the dragged
       order follows. */
    var order = Store.state.jobOrder || [];
    if (order.length) {
      var rank = {};
      order.forEach((k, i) => rank[k] = i);
      var fresh = groups.filter(g => !(g.key in rank));
      var placed = groups.filter(g => g.key in rank).sort((a, b) => rank[a.key] - rank[b.key]);
      groups = fresh.concat(placed);
    }
    return groups;
  },
  /* Jobs imported before cabinets were tracked have no checklist at all. If
     their parts kept SOLIDNAME we can rebuild the real names from those; if
     they did not, there is genuinely nothing to recover and they get numbered.
     Mirrors what SWOOD.plan() does at import time, deliberately. */
  moduleNamesFromParts(o) {
    var out = new Set();
    var _iterator57 = _createForOfIteratorHelper(o.parts || []),
      _step57;
    try {
      for (_iterator57.s(); !(_step57 = _iterator57.n()).done;) {
        var p = _step57.value;
        var solid = p.solid || "";
        if (!solid) continue;
        out.add(solid.startsWith(p.name + "_") ? solid.slice(p.name.length + 1) : solid);
      }
    } catch (err) {
      _iterator57.e(err);
    } finally {
      _iterator57.f();
    }
    return [...out].sort((a, b) => a.localeCompare(b));
  },
  regroupModules(names, want) {
    var uniq = a => [...new Set(a)];
    var segs = names.map(n => String(n).split("_").filter(Boolean));
    var depth = Math.max(...segs.map(x => x.length), 1);
    var _loop5 = function _loop5(keep) {
        // trim from the end
        var g = uniq(segs.map(x => x.slice(0, keep).join("_")));
        if (g.length === want) return {
          v: g
        };
      },
      _ret4;
    for (var keep = depth - 1; keep >= 1; keep--) {
      _ret4 = _loop5(keep);
      if (_ret4) return _ret4.v;
    }
    var _loop6 = function _loop6(drop) {
        // trim from the front
        var g = uniq(segs.map(x => x.slice(drop).join("_")));
        if (g.length === want) return {
          v: g
        };
      },
      _ret5;
    for (var drop = 1; drop < depth; drop++) {
      _ret5 = _loop6(drop);
      if (_ret5) return _ret5.v;
    }
    return null;
  },
  /* The task the checklist belongs to: the first step of the line that has no
     parts of its own — assembly, in a SWOOD import. */
  assemblyOp(o) {
    /* Not gated on the checklist any more: a job imported before cabinets were
       tracked has no checklist and still has an assembly line, and that is
       exactly the job whose count needs correcting. It IS gated on the job
       having cut parts, or "the item with no parts" would just be the only
       item on an ordinary one-line order. */
    if (!o || !(o.parts || []).length) return null;
    var partItems = new Set((o.parts || []).map(p => p.itemId));
    var item = o.items.find(i => !partItems.has(i.id));
    if (!item) return null;
    return o.ops.find(op => op.itemId === item.id) || null;
  },
  /* ---------- who is on a job ----------
     One name was never enough — two people carry a carcass. assigneeId stays
     the primary so nothing that reads it breaks; the list is what the UI uses. */
  /* ---------- project details: the facts that live in someone's head ----------
     "GI_SI_VIRT rankenos užsakytos" was true, and nobody could see it. Notes
     are a paragraph nobody reads to the end; this is a row per thing, each
     with a state you can tell at a glance and a date you are waiting on.
      state: info    — a fact, no waiting involved
            need    — wanted, nobody has ordered it
            ordered — on its way; `due` is when it was promised
            here    — arrived, nothing left to chase */
  DETAIL_STATES: ["need", "ordered", "here", "client", "info"],
  /* ---------- appliances (buitinė technika) ----------
     Usually the client buys them and only tells us the model, so this is a list
     of facts to build around (model, niche, spec), not things we order. The
     old "Appliances" rows in Details are moved here the first time a project
     is opened. */
  APPLIANCE_TYPES: ["Oven", "Hob", "Hood", "Microwave", "Steam oven", "Coffee machine", "Fridge", "Freezer", "Wine cooler", "Dishwasher", "Washing machine", "Dryer", "Sink", "Tap", "Warming drawer", "Other"],
  appliances(o) {
    if (!o) return [];
    if (!o.appliancesMoved && Array.isArray(o.details) && o.details.some(d => d.cat === "appliances")) {
      if (!Array.isArray(o.appliances)) o.appliances = [];
      var keep = [];
      for (var i = 0; i < o.details.length; i++) {
        var d = o.details[i];
        if (d.cat !== "appliances") { keep.push(d); continue; }
        o.appliances.push({ id: uid("ap"), type: d.label, model: d.value || "", by: d.state === "ordered" || d.state === "here" ? "us" : "client", note: "", link: "", at: d.at || Date.now() });
      }
      o.details = keep;
      o.appliancesMoved = true;
    }
    return o.appliances || [];
  },
  applianceSummary(o) {
    var l = this.appliances(o);
    return { total: l.length, missing: l.filter(a => !String(a.model || "").trim()).length };
  },
  DETAIL_LABEL: {
    info: "Note",
    need: "Needed",
    ordered: "Ordered",
    here: "Arrived",
    client: "Client handles"
  },
  /* What a kitchen is actually made of, in the order someone thinks about it.
     Offered as a list, not enforced as one — a shop will always have a kind of
     thing nobody anticipated, and typing it should not be a fight. */
  DETAIL_CATS: [{
    id: "handles",
    label: "Handles",
    ic: "wrench"
  }, {
    id: "worktop",
    label: "Worktop",
    ic: "layers"
  }, {
    id: "hardware",
    label: "Hardware",
    ic: "sliders"
  }, {
    id: "sink",
    label: "Sink & tap",
    ic: "warehouse"
  }, {
    id: "lighting",
    label: "Lighting",
    ic: "bulb"
  }, {
    id: "fronts",
    label: "Fronts",
    ic: "door"
  }, {
    id: "other",
    label: "Other",
    ic: "box"
  }],
  detailCat(id) {
    return this.DETAIL_CATS.find(c => c.id === id) || null;
  },
  detailCatLabel(d) {
    var c = this.detailCat(d.cat);
    return c ? c.label : d.cat || "Other";
  },
  /* Grouped the way the list is read: the known kinds in their own order,
     anything the shop invented after them, and the unfiled last. */
  detailsByCategory(o) {
    var list = this.details(o);
    var order = this.DETAIL_CATS.map(c => c.id);
    var seen = new Map();
    var _iterator58 = _createForOfIteratorHelper(list),
      _step58;
    try {
      for (_iterator58.s(); !(_step58 = _iterator58.n()).done;) {
        var d = _step58.value;
        var key = d.cat || "other";
        if (!seen.has(key)) seen.set(key, []);
        seen.get(key).push(d);
      }
    } catch (err) {
      _iterator58.e(err);
    } finally {
      _iterator58.f();
    }
    return [...seen].sort((a, b) => {
      var ia = order.indexOf(a[0]),
        ib = order.indexOf(b[0]);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || String(a[0]).localeCompare(String(b[0]));
    }).map(([cat, rows]) => ({
      cat,
      label: this.detailCatLabel({
        cat
      }),
      ic: (this.detailCat(cat) || {}).ic || "box",
      rows,
      open: rows.filter(d => d.state === "need" || d.state === "ordered").length,
      late: rows.filter(d => this.detailLate(d)).length
    }));
  },
  details(o) {
    return o && o.details || [];
  },
  detail(o, id) {
    return this.details(o).find(d => d.id === id) || null;
  },
  /* An ordered thing whose promised date has gone by is the whole point of
     writing it down — it is the one that quietly holds a job up. */
  detailLate(d) {
    return d.state === "ordered" && d.due && d.due < Date.now();
  },
  detailSummary(o) {
    var list = this.details(o);
    var n = st => list.filter(d => d.state === st).length;
    return {
      total: list.length,
      info: n("info"),
      need: n("need"),
      ordered: n("ordered"),
      here: n("here"),
      late: list.filter(d => this.detailLate(d)).length,
      /* what is still being waited on, which is what a card should say */
      open: n("need") + n("ordered")
    };
  },
  /* ---------- who a task goes to before anyone touches it ----------
     In this shop one engineer does every stage after the idea. Leaving every
     task unassigned meant someone re-picking the same name on every project,
     and "Nepriskirta" reads as "nobody has this" when in fact it is always the
     same person. A station can name its default. */
  /* Several, not one: two people carry a carcass, and a stage can belong to a
     pair as easily as to a person. defaultAssigneeId stays readable so a
     station set before this still works. */
  stationDefaults(stationId) {
    var st = this.station(stationId);
    if (!st) return [];
    var raw = Array.isArray(st.defaultAssigneeIds) && st.defaultAssigneeIds.length ? st.defaultAssigneeIds : st.defaultAssigneeId ? [st.defaultAssigneeId] : [];
    return raw.filter(id => this.member(id));
  },
  stationDefault(stationId) {
    return this.stationDefaults(stationId)[0] || null;
  },
  /* Stamp the station's person on tasks nobody has picked yet. Done in one
     place, after the ops are built, rather than at each of the six literals
     that create one — the variable holding the station id is named something
     different in most of them, which is exactly how this goes wrong. */
  applyStationDefaults(ops) {
    var _iterator59 = _createForOfIteratorHelper(ops || []),
      _step59;
    try {
      for (_iterator59.s(); !(_step59 = _iterator59.n()).done;) {
        var op = _step59.value;
        if (op.assigneeId) continue;
        var crew = this.stationDefaults(op.stationId);
        if (crew.length) {
          op.assigneeIds = [...crew];
          op.assigneeId = crew[0];
        }
      }
    } catch (err) {
      _iterator59.e(err);
    } finally {
      _iterator59.f();
    }
    return ops;
  },
  opAssigneeIds(op) {
    if (Array.isArray(op.assigneeIds) && op.assigneeIds.length) return op.assigneeIds;
    return op.assigneeId ? [op.assigneeId] : [];
  },
  opAssignees(op) {
    return this.opAssigneeIds(op).map(id => this.member(id)).filter(Boolean);
  },
  opAssignedTo(op, memberId) {
    return this.opAssigneeIds(op).includes(memberId);
  },
  /* ---------- attachments ----------
     State holds only the metadata and a thumbnail; the bytes live in
     IndexedDB and, where a bucket is configured, in Supabase Storage. See
     files.js for why: the whole state document is pushed on every change. */
  files() {
    return Store.state.files = Store.state.files || [];
  },
  file(id) {
    return this.files().find(f => f.id === id) || null;
  },
  filesFor({
    orderId = null,
    opId = null
  } = {}) {
    return this.files().filter(f => opId ? f.opId === opId : f.orderId === orderId && !f.opId).sort((a, b) => a.at - b.at);
  },
  fileCount(orderId) {
    return this.files().filter(f => f.orderId === orderId).length;
  },
  /* ---------- Audit ----------
     Entries are sentences, not structured records — they were written to be
     read, and they predate any need to filter them. Rather than migrate every
     old line, the kind is derived from the words: the log is English by
     design (interpolated data makes partial translation worse than none), so
     matching on it is safe. */
  ACT_KINDS: [["progress", "Progress", /\b(started|paused|completed|reported|moved|reopened|scan|shipped|delivered|unblocked|blocked)\b/i], ["materials", "Materials", /\b(material|stock|consumed|used|received|supplier|purchase|drafted|sent)\b|PO-/i], ["routing", "Routing", /\b(step|routing|reordered|filled in|station)\b/i], ["people", "People", /\b(assigned|claimed|unassigned|member|role|PIN|revoked)\b/i], ["created", "Created", /\b(created|imported|copied|handed off|drafted a)\b/i], ["admin", "Admin", /\b(archived|restored|deleted|renamed|reset|settings|backup|shift)\b/i]],
  activityKind(a) {
    var t = String(a && a.text || "");
    var _iterator60 = _createForOfIteratorHelper(this.ACT_KINDS),
      _step60;
    try {
      for (_iterator60.s(); !(_step60 = _iterator60.n()).done;) {
        var _step60$value = _slicedToArray(_step60.value, 3),
          id = _step60$value[0],
          re = _step60$value[2];
        if (re.test(t)) return id;
      }
    } catch (err) {
      _iterator60.e(err);
    } finally {
      _iterator60.f();
    }
    return "other";
  },
  /* Every change on one project, newest first. */
  orderHistory(orderId) {
    var o = this.order(orderId);
    return Store.state.activity.filter(a => a.orderId === orderId || o && a.text.includes(o.num));
  },
  /* ---------- View prefs (per member) ---------- */
  pref(memberId, key, def) {
    var _Store$state$prefs;
    var v = (_Store$state$prefs = Store.state.prefs) === null || _Store$state$prefs === void 0 || (_Store$state$prefs = _Store$state$prefs[memberId]) === null || _Store$state$prefs === void 0 ? void 0 : _Store$state$prefs[key];
    return v === undefined ? def : v;
  },
  /* ---------- Reporting ----------
     Every duration here goes through workMsBetween, so a lead time reads in
     working days, not calendar days — a job finished Monday morning that
     arrived Friday afternoon took a couple of hours, not a weekend. */

  /* When a project was actually finished: shipping wins, otherwise the moment
     its last task was completed. Null while anything is still open. */
  orderFinishedAt(o) {
    if (o.shippedAt) return o.shippedAt;
    if (!o.ops.length || !o.ops.every(op => op.status === "done")) return null;
    return o.ops.reduce((t, op) => Math.max(t, op.completedAt || 0), 0) || null;
  },
  orderActualMs(o) {
    return o.ops.reduce((ms, op) => ms + this.opElapsed(op), 0);
  },
  orderEstMs(o) {
    return o.ops.reduce((ms, op) => ms + (op.estMins || 0) * 60000, 0);
  },
  orderLeadMs(o) {
    var fin = this.orderFinishedAt(o);
    return fin ? this.workMsBetween(o.createdAt, fin) : null;
  },
  /* A task carries one cumulative loggedMs, not a time series, so its time is
     attributed to when it was worked — finished, or failing that started.
     Everything downstream says "work finished in this period" for that reason. */
  opWorkedAt(op) {
    return op.completedAt || op.startedAt || null;
  },
  /* Mon-based week starts, so buckets line up with how a shop talks about weeks */
  weekStart(ts) {
    var d = new Date(ts);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (d.getDay() + 6) % 7);
    return d.getTime();
  },
  monthStart(ts) {
    var d = new Date(ts);
    return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  },
  /* Weekly buckets while they stay readable, monthly beyond that */
  reportBuckets(from, to) {
    var byMonth = to - from > 130 * DAY;
    var out = [];
    var cur = byMonth ? this.monthStart(from) : this.weekStart(from);
    var guard = 0;
    while (cur <= to && guard++ < 400) {
      var d = new Date(cur);
      var next = byMonth ? new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7).getTime();
      out.push({
        from: cur,
        to: next - 1,
        byMonth,
        n: 0
      });
      cur = next;
    }
    return out;
  },
  reportScope(o, scope) {
    return scope === "all" ? true : scope === "eng" ? o.type === "eng" : o.type !== "eng";
  },
  /* One pass over the orders — every figure the Reports view shows. */
  report({
    from,
    to,
    scope = "all"
  }) {
    var orders = Store.state.orders.filter(o => this.reportScope(o, scope));
    var finished = [];
    var _iterator61 = _createForOfIteratorHelper(orders),
      _step61;
    try {
      for (_iterator61.s(); !(_step61 = _iterator61.n()).done;) {
        var o = _step61.value;
        var fin = this.orderFinishedAt(o);
        if (fin && fin >= from && fin <= to) finished.push({
          order: o,
          finishedAt: fin
        });
      }
    } catch (err) {
      _iterator61.e(err);
    } finally {
      _iterator61.f();
    }
    finished.sort((a, b) => b.finishedAt - a.finishedAt);
    var onTime = finished.filter(f => f.finishedAt <= f.order.due).length;
    var leads = finished.map(f => this.workMsBetween(f.order.createdAt, f.finishedAt));
    var avgLead = leads.length ? leads.reduce((a, b) => a + b, 0) / leads.length : 0;
    var buckets = this.reportBuckets(from, to);
    var _loop7 = function _loop7() {
      var f = _finished[_i3];
      var b = buckets.find(x => f.finishedAt >= x.from && f.finishedAt <= x.to);
      if (b) b.n++;
    };
    for (var _i3 = 0, _finished = finished; _i3 < _finished.length; _i3++) {
      _loop7();
    }

    // time worked in the period, by station and by person
    var byStation = new Map(),
      byMember = new Map();
    var workedMs = 0,
      estMs = 0;
    var _iterator62 = _createForOfIteratorHelper(orders),
      _step62;
    try {
      for (_iterator62.s(); !(_step62 = _iterator62.n()).done;) {
        var _o5 = _step62.value;
        var _iterator63 = _createForOfIteratorHelper(_o5.ops),
          _step63;
        try {
          for (_iterator63.s(); !(_step63 = _iterator63.n()).done;) {
            var op = _step63.value;
            var at = this.opWorkedAt(op);
            if (!at || at < from || at > to) continue;
            var ms = this.opElapsed(op);
            if (!ms) continue;
            workedMs += ms;
            estMs += (op.estMins || 0) * 60000;
            var st = byStation.get(op.stationId) || {
              ms: 0,
              est: 0,
              n: 0
            };
            st.ms += ms;
            st.est += (op.estMins || 0) * 60000;
            st.n++;
            byStation.set(op.stationId, st);
            if (op.assigneeId) {
              var mb = byMember.get(op.assigneeId) || {
                ms: 0,
                n: 0
              };
              mb.ms += ms;
              mb.n++;
              byMember.set(op.assigneeId, mb);
            }
          }
        } catch (err) {
          _iterator63.e(err);
        } finally {
          _iterator63.f();
        }
      }
    } catch (err) {
      _iterator62.e(err);
    } finally {
      _iterator62.f();
    }
    var stations = [...byStation.entries()].map(([id, v]) => _objectSpread({
      station: this.station(id)
    }, v)).filter(x => x.station).sort((a, b) => b.ms - a.ms);
    var members = [...byMember.entries()].map(([id, v]) => _objectSpread({
      member: this.member(id)
    }, v)).filter(x => x.member).sort((a, b) => b.ms - a.ms);
    return {
      from,
      to,
      scope,
      finished,
      buckets,
      stations,
      members,
      count: finished.length,
      onTime,
      onTimePct: finished.length ? Math.round(onTime / finished.length * 100) : null,
      avgLead,
      workedMs,
      estMs,
      openCount: orders.filter(o => !o.archived && !this.orderFinishedAt(o)).length
    };
  }
};
function prioRank(order) {
  var _rush$high$normal$low;
  return (_rush$high$normal$low = {
    rush: 0,
    high: 1,
    normal: 2,
    low: 3
  }[order.priority]) !== null && _rush$high$normal$low !== void 0 ? _rush$high$normal$low : 2;
}

/* ============================================================
   Mutations (all go through here → persisted + activity log)
   ============================================================ */
var M = {
  log(who, text, meta = {}) {
    Store.state.activity.unshift(_objectSpread({
      ts: Date.now(),
      who,
      text
    }, meta));
    if (Store.state.activity.length > 500) Store.state.activity.length = 500;
  },
  _opName(o, op) {
    var _D$opLabel = D.opLabel(o, op),
      station = _D$opLabel.station,
      suffix = _D$opLabel.suffix;
    return `${station ? station.name : "?"}${suffix ? " · " + suffix : ""}`;
  },
  _pauseOtherRunning(memberId) {
    var _iterator64 = _createForOfIteratorHelper(Store.state.orders),
      _step64;
    try {
      for (_iterator64.s(); !(_step64 = _iterator64.n()).done;) {
        var o = _step64.value;
        var _iterator65 = _createForOfIteratorHelper(o.ops),
          _step65;
        try {
          for (_iterator65.s(); !(_step65 = _iterator65.n()).done;) {
            var op = _step65.value;
            if (op.status === "running" && D.opAssignedTo(op, memberId)) {
              op.loggedMs = D.opElapsed(op);
              op.startedAt = null;
              op.status = "paused";
            }
          }
        } catch (err) {
          _iterator65.e(err);
        } finally {
          _iterator65.f();
        }
      }
    } catch (err) {
      _iterator64.e(err);
    } finally {
      _iterator64.f();
    }
  },
  startOp(orderId, opId, memberId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    /* someone starting a job that already has its people picked (e.g. a teammate pressing start for them) starts
       it for those people: they stay the assignees and the starter is not put on it */
    var picked = Array.isArray(op.assigneeIds) && op.assigneeIds.length ? op.assigneeIds : null;
    var forTeam = picked && memberId && !picked.includes(memberId);
    if (!forTeam) this._pauseOtherRunning(memberId);
    // fold any already-ticking time (e.g. op was running unassigned) before resetting the clock
    if (op.status === "running" && op.startedAt) op.loggedMs = D.opElapsed(op);
    if (forTeam) op.assigneeId = picked[0];
    else if (memberId) { op.assigneeId = memberId; if (picked) op.assigneeIds = picked.includes(memberId) ? picked : picked.concat([memberId]); }
    op.status = "running";
    op.startedAt = Date.now();
    op.blockNote = null;
    op.autoStarted = false; // a person is holding this one
    this.log(memberId, `started **${this._opName(o, op)}** on ${o.num}`, {
      orderId
    });
    Store.save();
  },
  pauseOp(orderId, opId, memberId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    op.loggedMs = D.opElapsed(op);
    op.startedAt = null;
    op.status = "paused";
    this.log(memberId, `paused **${this._opName(o, op)}** on ${o.num}`, {
      orderId
    });
    Store.save();
  },
  /* Report produced pieces at an op (MRPEasy-style partial completion).
     Auto-completes the op when the full item quantity is reached. */
  reportQty(orderId, opId, qty, memberId, opts = {}) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    var item = D.item(o, op.itemId);
    var avail = D.opAvail(o, op);
    // never force an already-reported count down to a shrunken avail — allow stepping down one at a time
    var upper = Math.max(avail, Math.min(op.qtyDone, item.qty));
    var clamped = Math.max(0, Math.min(qty, upper));
    if (clamped === op.qtyDone) return op.qtyDone;
    op.qtyDone = clamped;
    if (op.qtyDone >= item.qty) {
      op.loggedMs = D.opElapsed(op);
      op.startedAt = null;
      op.status = "done";
      op.completedAt = Date.now();
      op.completedBy = memberId;
      op.blockNote = null;
      if (!opts.silent) this.log(memberId, `completed **${this._opName(o, op)}** on ${o.num} — all ${item.qty} ${item.qty > 1 ? "pcs" : "pc"} done`, {
        orderId
      });
    } else if (!opts.silent) {
      this.log(memberId, `reported **${op.qtyDone} of ${item.qty} pcs** at ${this._opName(o, op)} on ${o.num}`, {
        orderId
      });
    }
    Store.save();
    return op.qtyDone;
  },
  /* Register a scanned part at a station. Dedups by part code per op. */
  scanPart(payload, stationId, memberId) {
    var parsed = D.scanParse(payload);
    var push = (status, extra) => {
      var _extra$order, _extra$station;
      var rec = {
        ts: Date.now(),
        by: memberId,
        payload: String(payload).slice(0, 60),
        status,
        orderId: (extra === null || extra === void 0 || (_extra$order = extra.order) === null || _extra$order === void 0 ? void 0 : _extra$order.id) || null,
        stationId: (extra === null || extra === void 0 || (_extra$station = extra.station) === null || _extra$station === void 0 ? void 0 : _extra$station.id) || stationId || null,
        partCode: (parsed === null || parsed === void 0 ? void 0 : parsed.partCode) || null
      };
      Store.state.scanLog.unshift(rec);
      if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
      Store.save();
      return _objectSpread({
        status,
        parsed
      }, extra);
    };
    if (!parsed || !parsed.order) return push("notfound", {
      order: (parsed === null || parsed === void 0 ? void 0 : parsed.order) || null
    });
    if (parsed.unknownPart) return push("unknownPart", {
      order: parsed.order
    });
    var o = parsed.order;
    var st = D.station(parsed.stationId || stationId);
    if (!st) return push("nostation", {
      order: o
    });
    // candidate ops at this station (optionally for the scanned item), not yet done
    var cands = o.ops.filter(op => op.stationId === st.id && op.status !== "done");
    if (parsed.item) cands = cands.filter(op => op.itemId === parsed.item.id);
    var op = cands.find(op => D.opReady(o, op)) || cands[0];
    if (!op) {
      var routed = o.ops.some(op => op.stationId === st.id);
      return push(routed ? "stationDone" : "notrouted", {
        order: o,
        station: st
      });
    }
    var item = D.item(o, op.itemId);
    // dedup identical part scanned twice at the same op
    op.scanCodes = op.scanCodes || [];
    if (parsed.partCode && op.scanCodes.includes(parsed.partCode)) return push("dup", {
      order: o,
      station: st,
      item,
      op
    });
    if (op.qtyDone >= item.qty) return push("stationDone", {
      order: o,
      station: st,
      item,
      op
    });
    if (op.qtyDone >= D.opAvail(o, op)) return push("waiting", {
      order: o,
      station: st,
      item,
      op
    });
    if (parsed.partCode) op.scanCodes.push(parsed.partCode);
    var wasStatus = op.status;
    if (!op.assigneeId) op.assigneeId = memberId;
    this.touchScanClock(op, memberId); // the scan IS the timer
    var newQty = this.reportQty(o.id, op.id, op.qtyDone + 1, memberId, {
      silent: true
    });
    var completed = D.order(o.id).ops.find(x => x.id === op.id).status === "done";
    if (completed) this.log(memberId, `scan: completed **${this._opName(o, op)}** on ${o.num} — ${item.qty} pcs`, {
      orderId: o.id
    });
    return push(completed ? "opDone" : "ok", {
      order: o,
      station: st,
      item,
      op,
      qtyDone: newQty
    });
  },
  /* ---- automatic time tracking ----
     Workers scan parts because the job needs it; nobody should also have to
     remember a stopwatch. A scan opens a run, later scans extend it, and a
     run closes itself after `idleMins` of silence — at the last scan, not at
     whatever time somebody finally notices. */
  touchScanClock(op, memberId) {
    if (!D.shift().auto) {
      // shop prefers manual control
      if (op.status === "queued") op.status = "paused";
      return;
    }
    var now = Date.now();
    if (op.status === "running") {
      if (D.opRunStale(op, now)) {
        // previous session already ended
        op.loggedMs = D.opElapsed(op);
        op.startedAt = now; // and this scan opens a new one
      }
    } else {
      this._pauseOtherRunning(memberId); // one job at a time per person
      op.loggedMs = op.loggedMs || 0;
      op.status = "running";
      op.startedAt = now;
    }
    op.autoStarted = true;
    op.lastScanAt = now;
  },
  /* Close out runs that have gone quiet, so the board stops showing them as
     live work. Returns how many it settled. Cheap and idempotent. */
  sweepClocks() {
    var closed = 0;
    var _iterator66 = _createForOfIteratorHelper(Store.state.orders),
      _step66;
    try {
      for (_iterator66.s(); !(_step66 = _iterator66.n()).done;) {
        var o = _step66.value;
        if (o.archived || o.shipped) continue;
        var _iterator67 = _createForOfIteratorHelper(o.ops),
          _step67;
        try {
          for (_iterator67.s(); !(_step67 = _iterator67.n()).done;) {
            var op = _step67.value;
            if (!D.opRunStale(op)) continue;
            op.loggedMs = D.opElapsed(op);
            op.startedAt = null;
            op.status = op.qtyDone > 0 ? "paused" : "queued";
            op.autoStarted = false;
            closed++;
          }
        } catch (err) {
          _iterator67.e(err);
        } finally {
          _iterator67.f();
        }
      }
    } catch (err) {
      _iterator66.e(err);
    } finally {
      _iterator66.f();
    }
    if (closed) Store.save();
    return closed;
  },
  setScanPrefix(prefix, stationId) {
    Store.state.scan = Store.state.scan || {
      prefixes: {}
    };
    if (!stationId) delete Store.state.scan.prefixes[prefix];else Store.state.scan.prefixes[prefix] = stationId;
    Store.save();
  },
  completeOp(orderId, opId, memberId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    var item = D.item(o, op.itemId);
    var avail = D.opAvail(o, op);
    op.loggedMs = D.opElapsed(op);
    op.startedAt = null;
    if (item && avail < item.qty) {
      // upstream hasn't produced everything yet — report what's possible (never lower an existing count)
      op.qtyDone = Math.max(op.qtyDone, avail);
      op.status = "paused";
      this.log(memberId, `reported **${op.qtyDone} of ${item.qty} pcs** at ${this._opName(o, op)} on ${o.num} — waiting for upstream`, {
        orderId
      });
      Store.save();
      return null;
    }
    op.qtyDone = item ? item.qty : 1;
    op.status = "done";
    op.completedAt = Date.now();
    op.completedBy = memberId;
    op.blockNote = null;
    var next = D.activeOps(o).find(x => x.itemId === op.itemId && x.group === op.group) || D.activeOps(o)[0] || null;
    this.log(memberId, next ? `completed **${this._opName(o, op)}** on ${o.num} → next: ${this._opName(o, next)}` : `completed **${this._opName(o, op)}** on ${o.num}${o.ops.every(x => x.status === "done") ? " — ready to ship 🎉" : ""}`, {
      orderId
    });
    Store.save();
    return next;
  },
  /* ---- create a manufacturing project straight from a SWOOD plan ----
     One item per board material (qty = pieces of that board) plus a module
     line for assembly, so a scanned part increments the line it belongs to. */
  /* `scope` is how many of the whole project are being made: a report list
     describes one, and the shop often builds sixteen. It multiplies the
     pieces, the parts and the modules, which is also what keeps scanning
     honest — the same label is scanned scope× as many times.
      `consumables`, when given, REPLACES the plan's own materials and is taken
     as final: the import dialog has already applied the scope and whatever
     the user corrected, because a report list names materials the way the
     designer wrote them, not the way the warehouse does. */
  createFromSwood(plan, {
    product,
    client,
    due,
    priority,
    notes,
    portfolioId,
    oneDriveUrl,
    moduleQty,
    scope,
    consumables,
    lineNames
  }, byId) {
    var s = Store.state;
    var id = uid("o");
    var num = "WO-" + s.orderSeq++;
    var items = [],
      ops = [],
      parts = [];
    var mult = Math.max(1, Math.round(Number(scope) || 1));
    var _iterator68 = _createForOfIteratorHelper(plan.items),
      _step68;
    try {
      for (_iterator68.s(); !(_step68 = _iterator68.n()).done;) {
        var line = _step68.value;
        var named = lineNames && lineNames[line.name] || line.name;
        var _item = {
          id: uid("it"),
          articleId: null,
          name: named,
          qty: line.qty * mult
        };
        items.push(_item);
        var _iterator71 = _createForOfIteratorHelper(line.route),
          _step71;
        try {
          for (_iterator71.s(); !(_step71 = _iterator71.n()).done;) {
            var _stId = _step71.value;
            var _st = D.station(_stId);
            if (!_st) continue;
            ops.push({
              id: uid("op"),
              itemId: _item.id,
              group: null,
              stationId: _stId,
              estMins: Math.max(_st.estMins, Math.round(_st.estMins * _item.qty / 8)),
              status: "queued",
              qtyDone: 0,
              assigneeId: null,
              loggedMs: 0,
              startedAt: null,
              completedAt: null,
              blockNote: null
            });
          }
        } catch (err) {
          _iterator71.e(err);
        } finally {
          _iterator71.f();
        }
        var _iterator72 = _createForOfIteratorHelper(line.partCodes),
          _step72;
        try {
          var _loop8 = function _loop8() {
            var code = _step72.value;
            var p = plan.parts.find(x => x.code === code);
            if (p) parts.push({
              code: p.code,
              name: p.name,
              board: p.board,
              l: p.l,
              w: p.w,
              qty: p.qty * mult,
              edges: p.edges,
              notes: p.notes,
              solid: p.solid || "",
              // which cabinet the part belongs to
              itemId: _item.id
            });
          };
          for (_iterator72.s(); !(_step72 = _iterator72.n()).done;) {
            _loop8();
          }
        } catch (err) {
          _iterator72.e(err);
        } finally {
          _iterator72.f();
        }
      }

      // assembly / QC / packing counted in modules, not panels
    } catch (err) {
      _iterator68.e(err);
    } finally {
      _iterator68.f();
    }
    var mods = Math.max(1, (moduleQty || plan.moduleCount || 1) * mult);
    /* Named, so assembly can be ticked off cabinet by cabinet rather than as a
       number nobody can map onto the bench in front of them. */
    var modules = (plan.moduleNames || []).map(name => ({
      id: uid("mod"),
      name,
      qty: mult,
      done: 0
    }));
    if (plan.finalRoute.length) {
      var item = {
        id: uid("it"),
        articleId: null,
        name: plan.finalName,
        qty: mods
      };
      items.push(item);
      var _iterator69 = _createForOfIteratorHelper(plan.finalRoute),
        _step69;
      try {
        for (_iterator69.s(); !(_step69 = _iterator69.n()).done;) {
          var stId = _step69.value;
          var st = D.station(stId);
          if (!st) continue;
          ops.push({
            id: uid("op"),
            itemId: item.id,
            group: null,
            stationId: stId,
            estMins: Math.max(st.estMins, Math.round(st.estMins * mods / 8)),
            status: "queued",
            qtyDone: 0,
            assigneeId: null,
            loggedMs: 0,
            startedAt: null,
            completedAt: null,
            blockNote: null
          });
        }
      } catch (err) {
        _iterator69.e(err);
      } finally {
        _iterator69.f();
      }
    }
    D.applyStationDefaults(ops);

    // consumables: whatever the dialog settled on, else the plan's own list scaled
    var materials = [];
    var source = consumables || [...plan.boards, ...plan.edgeband, ...plan.hardware].map(g => ({
      name: g.name,
      qty: g.qty * mult,
      unit: g.unit
    }));
    var _iterator70 = _createForOfIteratorHelper(source),
      _step70;
    try {
      for (_iterator70.s(); !(_step70 = _iterator70.n()).done;) {
        var g = _step70.value;
        var mat = g.materialId ? D.material(g.materialId) : D.matchMaterial(g.name);
        materials.push({
          id: uid("ml"),
          materialId: mat ? mat.id : null,
          name: g.name,
          qty: g.qty,
          unit: mat ? mat.unit : g.unit,
          consumed: false,
          consumedBy: null,
          consumedAt: null
        });
      }
    } catch (err) {
      _iterator70.e(err);
    } finally {
      _iterator70.f();
    }
    var order = {
      id,
      num,
      type: "prod",
      product: product || plan.project,
      client: client || "",
      qty: items.reduce((n, i) => n + i.qty, 0),
      unit: "pcs",
      priority: priority || "normal",
      due: due || Date.now() + 14 * DAY,
      notes: notes || "",
      shipped: false,
      archived: false,
      createdAt: Date.now(),
      portfolioId: portfolioId || null,
      oneDriveUrl: oneDriveUrl || "",
      modules,
      swood: {
        project: plan.project,
        importedAt: Date.now(),
        importedBy: byId,
        pieces: plan.totalPieces * mult,
        modules: mods,
        scope: mult
      },
      materials,
      items,
      ops,
      comments: [],
      parts
    };
    s.orders.unshift(order);
    this.log(byId, `imported **${plan.project}** from SWOOD → ${num} · ${parts.length} parts, ${plan.totalPieces * mult} pcs across ${plan.items.length} materials${mult > 1 ? ` (×${mult})` : ""}`, {
      orderId: id
    });
    Store.save();
    return order;
  },
  /* A SWOOD report list into a project that already exists (made by hand, or
     handed over from engineering): the parts, production lines, steps and
     materials come from SWOOD; the project keeps its number, name, client,
     date, files, remarks, appliances and details. Work already done is kept —
     a step finished at a station stays finished there, time logged on a
     station moves to the new step at that station. */
  applySwoodTo(orderId, plan, opts, byId) {
    var tgt = D.order(orderId);
    if (!tgt) return null;
    opts = opts || {};
    var seq = Store.state.orderSeq;
    var tmp = this.createFromSwood(plan, {
      product: tgt.product, client: tgt.client, due: tgt.due, priority: tgt.priority, notes: tgt.notes,
      portfolioId: tgt.portfolioId, oneDriveUrl: tgt.oneDriveUrl,
      scope: opts.scope, consumables: opts.consumables, lineNames: opts.lineNames
    }, byId);
    /* createFromSwood made a new order — take its contents and undo the order itself */
    Store.state.orders = Store.state.orders.filter(o => o.id !== tmp.id);
    Store.state.orderSeq = seq;
    Store.state.activity = Store.state.activity.filter(a => a.orderId !== tmp.id);
    tgt = D.order(orderId);
    /* what has happened at each station so far */
    var prog = {};
    (tgt.ops || []).forEach(op => {
      var p = prog[op.stationId] || (prog[op.stationId] = { n: 0, done: 0, ms: 0, who: null, at: null, by: null, started: false });
      p.n++;
      if (op.status === "done") { p.done++; p.at = Math.max(p.at || 0, op.completedAt || 0); p.by = op.completedBy || p.by; }
      var ms = op.startedAt ? D.opElapsed(op) : op.loggedMs || 0;
      p.ms += ms;
      if (ms > 0 || op.status === "running" || op.status === "paused") p.started = true;
      if (!p.who && op.assigneeId) p.who = op.assigneeId;
    });
    var firstAt = {};
    tmp.ops.forEach(op => {
      var p = prog[op.stationId];
      if (!p) return;
      if (p.n && p.done === p.n) {
        var it = tmp.items.find(i => i.id === op.itemId);
        op.status = "done";
        op.qtyDone = it ? it.qty : op.qtyDone;
        op.completedAt = p.at || Date.now();
        op.completedBy = p.by || byId;
      } else if (p.started && !firstAt[op.stationId]) {
        firstAt[op.stationId] = true;
        op.status = "paused";
        op.loggedMs = p.ms;
      }
      if (!op.assigneeId && p.who) op.assigneeId = p.who;
    });
    /* materials: lines already taken from stock stay; the rest come from SWOOD */
    var kept = (tgt.materials || []).filter(l => l.consumed);
    tgt.items = tmp.items;
    tgt.ops = tmp.ops;
    tgt.parts = tmp.parts;
    tgt.modules = tmp.modules;
    tgt.qty = tmp.qty;
    tgt.unit = tmp.unit;
    tgt.materials = kept.concat(tmp.materials);
    var had = !!tgt.swood;
    tgt.swood = tmp.swood;
    this.log(byId, `${had ? "re-imported" : "imported"} SWOOD **${plan.project}** into ${tgt.num} · ${tmp.parts.length} parts`, { orderId: tgt.id });
    Store.save();
    return tgt;
  },
  /* Append the stages an imported job never got. Only ever adds: every task
     already done, running or counted keeps exactly what it had. */
  repairSwoodRoute(orderId, byId) {
    var o = D.order(orderId);
    var gaps = D.swoodRouteGaps(o);
    if (!gaps) return 0;
    var added = 0;
    var mkOp = (itemId, st, qty) => ({
      id: uid("op"),
      itemId,
      group: null,
      stationId: st.id,
      estMins: Math.max(st.estMins, Math.round(st.estMins * qty / 8)),
      status: "queued",
      qtyDone: 0,
      assigneeId: D.stationDefault(st.id),
      loggedMs: 0,
      startedAt: null,
      completedAt: null,
      blockNote: null
    });
    var _iterator73 = _createForOfIteratorHelper(gaps.add),
      _step73;
    try {
      var _loop9 = function _loop9() {
        var _step73$value = _step73.value,
          item = _step73$value.item,
          stations = _step73$value.stations;
        // keep each item's tasks together and in flow order
        var at = o.ops.map((op, i) => op.itemId === item.id ? i : -1).filter(i => i >= 0).pop();
        var fresh = stations.map(st => mkOp(item.id, st, item.qty));
        o.ops.splice(at + 1, 0, ...fresh);
        added += fresh.length;
      };
      for (_iterator73.s(); !(_step73 = _iterator73.n()).done;) {
        _loop9();
      }
    } catch (err) {
      _iterator73.e(err);
    } finally {
      _iterator73.f();
    }
    if (gaps.addFinal) {
      var item = {
        id: uid("it"),
        articleId: null,
        name: "Surinkimas ir pakavimas",
        qty: gaps.modules
      };
      o.items.push(item);
      var _iterator74 = _createForOfIteratorHelper(gaps.addFinal),
        _step74;
      try {
        for (_iterator74.s(); !(_step74 = _iterator74.n()).done;) {
          var st = _step74.value;
          o.ops.push(mkOp(item.id, st, gaps.modules));
          added++;
        }
      } catch (err) {
        _iterator74.e(err);
      } finally {
        _iterator74.f();
      }
      o.qty = o.items.reduce((n, i) => n + i.qty, 0);
    }
    if (added) this.log(byId, `filled in ${added} missing step(s) on **${o.num}**`, {
      orderId: o.id
    });
    Store.save();
    return added;
  },
  /* ---- duplicate a manufacturing / engineering project ----
     A copy is a fresh job: same product structure and route, but no progress,
     no logged time, no conversation and its own number. */
  duplicateOrder(orderId, {
    name,
    copyMaterials = true,
    copyAssignees = false
  } = {}, byId) {
    var src = D.order(orderId);
    if (!src) return null;
    var wanted = (name || "").trim() || D.uniqueName(src.product, n => D.projectNameTaken(n));
    if (D.projectNameTaken(wanted)) wanted = D.uniqueName(wanted, n => D.projectNameTaken(n));
    var s = Store.state;
    var id = uid("o");
    var num = src.type === "eng" ? "ENG-" + s.engSeq++ : "WO-" + s.orderSeq++;
    var itemMap = {};
    var items = src.items.map(it => {
      var nid = uid("it");
      itemMap[it.id] = nid;
      return _objectSpread(_objectSpread({}, it), {}, {
        id: nid
      });
    });
    var ops = src.ops.map(op => {
      var _items$;
      return _objectSpread(_objectSpread({}, op), {}, {
        id: uid("op"),
        itemId: itemMap[op.itemId] || ((_items$ = items[0]) === null || _items$ === void 0 ? void 0 : _items$.id) || null,
        status: "queued",
        qtyDone: 0,
        loggedMs: 0,
        startedAt: null,
        completedAt: null,
        completedBy: null,
        blockNote: null,
        assigneeId: copyAssignees ? op.assigneeId || null : null
      });
    });
    var order = _objectSpread(_objectSpread({}, deepCopy(src)), {}, {
      id,
      num,
      product: wanted,
      items,
      ops,
      materials: copyMaterials ? deepCopy(src.materials || []).map(m => _objectSpread(_objectSpread({}, m), {}, {
        consumed: 0
      })) : [],
      comments: [],
      shipped: false,
      shippedAt: null,
      archived: false,
      archivedAt: null,
      createdAt: Date.now(),
      clientApproved: false,
      clientApprovedAt: null,
      fromEngId: null,
      handedOffTo: null
    });
    s.orders.unshift(order);
    this.log(byId, `copied **${src.num}** → **${order.num}** (${esc0(wanted)})`, {
      orderId: order.id
    });
    Store.save();
    return order;
  },
  blockOp(orderId, opId, memberId, note) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    op.loggedMs = D.opElapsed(op);
    op.startedAt = null;
    op.status = "blocked";
    op.blockNote = note || "Blocked";
    this.log(memberId, `blocked **${this._opName(o, op)}** on ${o.num} — ${note || ""}`, {
      orderId
    });
    Store.save();
  },
  unblockOp(orderId, opId, memberId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    op.status = op.loggedMs > 0 ? "paused" : "queued";
    op.blockNote = null;
    this.log(memberId, `unblocked **${this._opName(o, op)}** on ${o.num}`, {
      orderId
    });
    Store.save();
  },
  reopenOp(orderId, opId, memberId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    op.status = "paused";
    op.completedAt = null;
    this.log(memberId, `reopened **${this._opName(o, op)}** on ${o.num}`, {
      orderId
    });
    Store.save();
  },
  assignOp(orderId, opId, memberId, byId) {
    var _D$member;
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    var prev = D.member(op.assigneeId);
    var isNew = memberId && memberId !== op.assigneeId;
    op.assigneeId = memberId || null;
    op.assigneeIds = memberId ? [memberId] : [];
    /* a task appearing on someone's plate should reach them, not wait to be
       noticed — but never tell someone they assigned it to themselves */
    if (isNew && memberId !== byId) this.notify(memberId, {
      type: "task",
      orderId: o.id,
      text: `**${((_D$member = D.member(byId)) === null || _D$member === void 0 ? void 0 : _D$member.name) || "Someone"}** gave you ${this._opName(o, op)} on ${o.num}`
    }, byId);
    this.log(byId, memberId ? `assigned **${this._opName(o, op)}** on ${o.num} to ${D.member(memberId).name}` : `unassigned **${this._opName(o, op)}** on ${o.num}${prev ? ` (was ${prev.name})` : ""}`, {
      orderId
    });
    Store.save();
  },
  /* ---------- project details ---------- */
  addAppliance(orderId, a, byId) {
    var o = D.order(orderId);
    if (!o) return null;
    D.appliances(o);
    if (!Array.isArray(o.appliances)) o.appliances = [];
    var row = {
      id: uid("ap"),
      type: String(a && a.type || "").trim() || "Other",
      model: String(a && a.model || "").trim(),
      by: a && a.by === "us" ? "us" : "client",
      note: String(a && a.note || "").trim(),
      link: String(a && a.link || "").trim(),
      at: Date.now()
    };
    o.appliances.push(row);
    this.log(byId, `added appliance **${esc0(row.type)}**${row.model ? " " + esc0(row.model) : ""} to ${o.num}`, { orderId: orderId });
    Store.save();
    return row;
  },
  updateAppliance(orderId, id, patch, byId) {
    var o = D.order(orderId);
    var a = o && D.appliances(o).find(x => x.id === id);
    if (!a) return null;
    var before = a.model;
    Object.assign(a, patch);
    if (patch.model != null && patch.model !== before && patch.model) this.log(byId, `set **${esc0(a.type)}** model on ${o.num}: ${esc0(patch.model)}`, { orderId: orderId });
    Store.save();
    return a;
  },
  removeAppliance(orderId, id, byId) {
    var o = D.order(orderId);
    if (!o) return;
    var a = D.appliances(o).find(x => x.id === id);
    o.appliances = D.appliances(o).filter(x => x.id !== id);
    if (a) this.log(byId, `removed appliance **${esc0(a.type)}** from ${o.num}`, { orderId: orderId });
    Store.save();
  },
  addDetail(orderId, {
    label,
    value,
    state,
    due,
    cat
  } = {}, byId) {
    var o = D.order(orderId);
    if (!o) return null;
    if (!o.details) o.details = [];
    var d = {
      id: uid("dt"),
      label: String(label || "").trim() || "Untitled",
      value: String(value || "").trim(),
      state: D.DETAIL_STATES.includes(state) ? state : "need",
      cat: cat || "other",
      due: due || null,
      at: Date.now(),
      by: byId || null
    };
    o.details.push(d);
    this.log(byId, `added **${esc0(d.label)}** to ${o.num} — ${D.DETAIL_LABEL[d.state].toLowerCase()}`, {
      orderId
    });
    Store.save();
    return d;
  },
  updateDetail(orderId, detailId, patch, byId) {
    var o = D.order(orderId);
    var d = D.detail(o, detailId);
    if (!d) return null;
    var wasState = d.state;
    if (patch.label !== undefined) d.label = String(patch.label).trim() || d.label;
    if (patch.value !== undefined) d.value = String(patch.value).trim();
    if (patch.due !== undefined) d.due = patch.due || null;
    if (patch.state !== undefined && D.DETAIL_STATES.includes(patch.state)) d.state = patch.state;
    if (patch.cat !== undefined) d.cat = String(patch.cat || "other").trim() || "other";
    d.at = Date.now();
    d.by = byId || d.by;
    /* only a state change is worth a line in the history — correcting a typo
       in a supplier code is not something anyone needs to be told about */
    if (d.state !== wasState) {
      this.log(byId, `**${esc0(d.label)}** on ${o.num} — ${D.DETAIL_LABEL[d.state].toLowerCase()}${d.state === "ordered" && d.due ? `, expected ${fmtDate(d.due)}` : ""}`, {
        orderId
      });
    }
    Store.save();
    return d;
  },
  removeDetail(orderId, detailId, byId) {
    var o = D.order(orderId);
    var d = D.detail(o, detailId);
    if (!d) return false;
    o.details = o.details.filter(x => x.id !== detailId);
    this.log(byId, `removed **${esc0(d.label)}** from ${o.num}`, {
      orderId
    });
    Store.save();
    return true;
  },
  /* Name the person a station's work goes to, and offer to fix what is already
     sitting there unassigned — otherwise the setting only helps future work
     and every project already on the board stays blank. */
  setStationDefault(stationId, memberIds, byId) {
    var st = D.station(stationId);
    if (!st) return null;
    var ids = (Array.isArray(memberIds) ? memberIds : [memberIds]).filter(id => id && D.member(id));
    st.defaultAssigneeIds = ids;
    st.defaultAssigneeId = ids[0] || null; // what older code still reads
    var names = ids.map(id => D.member(id).name).join(", ");
    this.log(byId, ids.length ? `**${names}** now get new ${esc0(st.name)} tasks` : `no default person for ${esc0(st.name)} any more`);
    Store.save();
    return {
      station: st,
      ids,
      pending: this.pendingAtStation(stationId)
    };
  },
  /* tasks already on the board that nobody has picked up */
  pendingAtStation(stationId) {
    var n = 0;
    var _iterator75 = _createForOfIteratorHelper(Store.state.orders),
      _step75;
    try {
      for (_iterator75.s(); !(_step75 = _iterator75.n()).done;) {
        var o = _step75.value;
        if (o.archived) continue;
        var _iterator76 = _createForOfIteratorHelper(o.ops),
          _step76;
        try {
          for (_iterator76.s(); !(_step76 = _iterator76.n()).done;) {
            var op = _step76.value;
            if (op.stationId === stationId && op.status !== "done" && !D.opAssigneeIds(op).length) n++;
          }
        } catch (err) {
          _iterator76.e(err);
        } finally {
          _iterator76.f();
        }
      }
    } catch (err) {
      _iterator75.e(err);
    } finally {
      _iterator75.f();
    }
    return n;
  },
  assignPendingAtStation(stationId, memberIds, byId) {
    var ids = (Array.isArray(memberIds) ? memberIds : [memberIds]).filter(id => id && D.member(id));
    if (!ids.length) return 0;
    var n = 0;
    var _iterator77 = _createForOfIteratorHelper(Store.state.orders),
      _step77;
    try {
      for (_iterator77.s(); !(_step77 = _iterator77.n()).done;) {
        var o = _step77.value;
        if (o.archived) continue;
        var _iterator78 = _createForOfIteratorHelper(o.ops),
          _step78;
        try {
          for (_iterator78.s(); !(_step78 = _iterator78.n()).done;) {
            var op = _step78.value;
            if (op.stationId !== stationId || op.status === "done" || D.opAssigneeIds(op).length) continue;
            op.assigneeIds = [...ids];
            op.assigneeId = ids[0];
            n++;
          }
        } catch (err) {
          _iterator78.e(err);
        } finally {
          _iterator78.f();
        }
      }
    } catch (err) {
      _iterator77.e(err);
    } finally {
      _iterator77.f();
    }
    var names = ids.map(id => D.member(id).name).join(", ");
    if (n) this.log(byId, `assigned **${names}** to ${n} unassigned ${esc0((D.station(stationId) || {}).name)} task${n === 1 ? "" : "s"}`);
    Store.save();
    return n;
  },
  /* ---------- Routing editing ---------- */
  addOp(orderId, stationId, estMins, byId, itemId, group) {
    var o = D.order(orderId);
    var st = D.station(stationId);
    var item = itemId ? D.item(o, itemId) : o.items[0];
    var newOp = {
      id: uid("op"),
      itemId: item.id,
      group: group !== null && group !== void 0 ? group : null,
      stationId,
      estMins: estMins || st.estMins,
      status: "queued",
      qtyDone: 0,
      assigneeId: D.stationDefault(stationId),
      loggedMs: 0,
      startedAt: null,
      completedAt: null,
      blockNote: null
    };
    // keep lanes contiguous: insert right after the lane's current last op
    var lane = D.laneOps(o, item.id, newOp.group);
    if (lane.length) o.ops.splice(o.ops.indexOf(lane[lane.length - 1]) + 1, 0, newOp);else o.ops.push(newOp);
    o.shipped = false;
    this.log(byId, `added step **${st.name}${group ? " · " + group : ""}** to ${o.num} routing`, {
      orderId
    });
    Store.save();
  },
  removeOp(orderId, opId, byId) {
    var _D$station;
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    if (!op || op.status === "done") return false;
    o.ops = o.ops.filter(x => x.id !== opId);
    this.log(byId, `removed step **${((_D$station = D.station(op.stationId)) === null || _D$station === void 0 ? void 0 : _D$station.name) || "?"}** from ${o.num} routing`, {
      orderId
    });
    Store.save();
    return true;
  },
  moveOp(orderId, opId, dir, byId) {
    var o = D.order(orderId);
    var op = o.ops.find(x => x.id === opId);
    if (!op || op.status === "done") return false;
    // swap with the lane neighbour (lane order = array order, but lanes may not be array-contiguous)
    var lane = D.laneOps(o, op.itemId, op.group);
    var li = lane.indexOf(op),
      lj = li + dir;
    if (lj < 0 || lj >= lane.length || lane[lj].status === "done") return false;
    var i = o.ops.indexOf(lane[li]),
      j = o.ops.indexOf(lane[lj]);
    var _ref3 = [o.ops[j], o.ops[i]];
    o.ops[i] = _ref3[0];
    o.ops[j] = _ref3[1];
    this.log(byId, `reordered routing on ${o.num}`, {
      orderId
    });
    Store.save();
    return true;
  },
  /* Drag a lane's task to a station column: complete lane ops before it, reopen from it */
  moveLane(orderId, itemId, group, stationId, byId) {
    var o = D.order(orderId);
    var item = D.item(o, itemId);
    if (stationId === "__ready") {
      var _iterator79 = _createForOfIteratorHelper(o.ops),
        _step79;
      try {
        for (_iterator79.s(); !(_step79 = _iterator79.n()).done;) {
          var op = _step79.value;
          if (op.status !== "done") {
            op.loggedMs = D.opElapsed(op);
            op.startedAt = null;
            op.status = "done";
            op.qtyDone = D.item(o, op.itemId).qty;
            op.completedAt = Date.now();
            op.completedBy = byId;
          }
        }
      } catch (err) {
        _iterator79.e(err);
      } finally {
        _iterator79.f();
      }
      this.log(byId, `moved ${o.num} to **Ready to ship**`, {
        orderId
      });
      Store.save();
      return true;
    }
    var lane = D.laneOps(o, itemId, group);
    var idx = lane.findIndex(op => op.stationId === stationId);
    if (idx < 0) return false;
    lane.forEach((op, i) => {
      if (i < idx && op.status !== "done") {
        op.loggedMs = D.opElapsed(op);
        op.startedAt = null;
        op.status = "done";
        op.qtyDone = item.qty;
        op.completedAt = Date.now();
        op.completedBy = byId;
      }
      if (i === idx && op.status === "done") {
        op.status = "queued";
        op.qtyDone = 0;
        op.completedAt = null;
      }
      if (i > idx && (op.status !== "queued" || op.qtyDone > 0)) {
        // everything downstream of the new position starts over
        op.loggedMs = D.opElapsed(op);
        op.startedAt = null;
        op.status = "queued";
        op.qtyDone = 0;
        op.completedAt = null;
        op.blockNote = null;
      }
    });
    o.shipped = false;
    o.archived = false;
    this.log(byId, `moved ${o.num}${group ? ` · ${group}` : ""} to **${D.station(stationId).name}**`, {
      orderId
    });
    Store.save();
    return true;
  },
  /* Legacy helper: single-lane orders only */
  moveOrderToStation(orderId, stationId, byId) {
    var o = D.order(orderId);
    if (stationId === "__ready") return this.moveLane(orderId, o.items[0].id, null, "__ready", byId);
    // find the unique lane containing this station
    var lanes = [];
    var _iterator80 = _createForOfIteratorHelper(o.items),
      _step80;
    try {
      for (_iterator80.s(); !(_step80 = _iterator80.n()).done;) {
        var it = _step80.value;
        for (var _i4 = 0, _arr = [...D.itemGroups(o, it.id), null]; _i4 < _arr.length; _i4++) {
          var g = _arr[_i4];
          if (D.laneOps(o, it.id, g).some(op => op.stationId === stationId)) lanes.push([it.id, g]);
        }
      }
    } catch (err) {
      _iterator80.e(err);
    } finally {
      _iterator80.f();
    }
    if (lanes.length !== 1) return false;
    return this.moveLane(orderId, lanes[0][0], lanes[0][1], stationId, byId);
  },
  shipOrder(orderId, byId) {
    var o = D.order(orderId);
    o.shipped = true;
    o.shippedAt = Date.now();
    o.archived = true;
    o.archivedAt = Date.now(); // ending a project archives it
    this.log(byId, o.type === "eng" ? `delivered **${o.num}** — ${o.product}` : `shipped **${o.num}** — ${o.product}`, {
      orderId
    });
    Store.save();
  },
  /* End a project (any state) → send to archive */
  archiveOrder(orderId, byId) {
    var o = D.order(orderId);
    o.archived = true;
    o.archivedAt = Date.now();
    this.log(byId, `archived **${o.num}** — ${o.product}`, {
      orderId
    });
    Store.save();
  },
  unarchiveOrder(orderId, byId) {
    var o = D.order(orderId);
    o.archived = false;
    o.archivedAt = null;
    o.shipped = false;
    o.shippedAt = null;
    this.log(byId, `restored **${o.num}** from archive`, {
      orderId
    });
    Store.save();
  },
  /* Hand an engineering project off to production: spawn a linked manufacturing
     project and archive the engineering one (its design phase is done). */
  handoffToProduction(engId, {
    route,
    lines
  }, byId) {
    var eng = D.order(engId);
    var prod = this.createOrder({
      type: "prod",
      product: eng.product,
      client: eng.client,
      unit: "vnt",
      priority: eng.priority,
      due: eng.due,
      notes: eng.notes,
      portfolioId: eng.portfolioId,
      oneDriveUrl: eng.oneDriveUrl,
      route,
      lines
    }, byId);
    prod.fromEngId = eng.id;
    eng.handedOffTo = prod.id;
    eng.archived = true;
    eng.archivedAt = Date.now();
    this.log(byId, `handed off **${eng.num}** to production → created **${prod.num}**`, {
      orderId: prod.id
    });
    Store.save();
    return prod;
  },
  /* Create order.
     type "prod": either `lines` [{articleId, qty} | {name, qty, route:[{stationId,estMins}]}]
                  or legacy `route` (single custom item)
     type "eng":  `stages` [stationId…] */
  createOrder({
    type = "prod",
    product,
    client,
    qty,
    unit,
    priority,
    due,
    notes,
    route,
    lines,
    stages,
    portfolioId,
    oneDriveUrl
  }, byId) {
    var s = Store.state;
    var num = type === "eng" ? "ENG-" + s.engSeq++ : "WO-" + s.orderSeq++;
    var id = uid("o");
    var items = [];
    var ops = [];
    if (type === "eng") {
      var item = {
        id: id + "-it0",
        articleId: null,
        name: "Project",
        qty: 1
      };
      items.push(item);
      var _iterator81 = _createForOfIteratorHelper(stages || []),
        _step81;
      try {
        for (_iterator81.s(); !(_step81 = _iterator81.n()).done;) {
          var stId = _step81.value;
          var st = D.station(stId);
          ops.push({
            id: uid("op"),
            itemId: item.id,
            group: null,
            stationId: stId,
            estMins: st.estMins,
            status: "queued",
            qtyDone: 0,
            assigneeId: null,
            loggedMs: 0,
            startedAt: null,
            completedAt: null,
            blockNote: null
          });
        }
      } catch (err) {
        _iterator81.e(err);
      } finally {
        _iterator81.f();
      }
    } else if (lines && lines.length) {
      var _iterator82 = _createForOfIteratorHelper(lines),
        _step82;
      try {
        for (_iterator82.s(); !(_step82 = _iterator82.n()).done;) {
          var line = _step82.value;
          var _item2 = {
            id: uid("it"),
            articleId: line.articleId || null,
            name: line.name,
            qty: line.qty
          };
          items.push(_item2);
          if (line.articleId) {
            var art = D.article(line.articleId);
            _item2.name = art.name;
            var _skip = line.skip || [];
            ops.push(...opsFromArticle(art, _item2).filter(op => _skip.indexOf(op.stationId) < 0));
          } else {
            var _iterator83 = _createForOfIteratorHelper(line.route || []),
              _step83;
            try {
              for (_iterator83.s(); !(_step83 = _iterator83.n()).done;) {
                var r = _step83.value;
                ops.push({
                  id: uid("op"),
                  itemId: _item2.id,
                  group: null,
                  stationId: r.stationId,
                  estMins: r.estMins,
                  status: "queued",
                  qtyDone: 0,
                  assigneeId: null,
                  loggedMs: 0,
                  startedAt: null,
                  completedAt: null,
                  blockNote: null
                });
              }
            } catch (err) {
              _iterator83.e(err);
            } finally {
              _iterator83.f();
            }
          }
        }
      } catch (err) {
        _iterator82.e(err);
      } finally {
        _iterator82.f();
      }
    } else {
      var _item3 = {
        id: id + "-it0",
        articleId: null,
        name: "General",
        qty: qty || 1
      };
      items.push(_item3);
      var _iterator84 = _createForOfIteratorHelper(route || []),
        _step84;
      try {
        for (_iterator84.s(); !(_step84 = _iterator84.n()).done;) {
          var _r = _step84.value;
          ops.push({
            id: uid("op"),
            itemId: _item3.id,
            group: null,
            stationId: _r.stationId,
            estMins: _r.estMins,
            status: "queued",
            qtyDone: 0,
            assigneeId: _r.assigneeId || null,
            loggedMs: 0,
            startedAt: null,
            completedAt: null,
            blockNote: null
          });
        }
      } catch (err) {
        _iterator84.e(err);
      } finally {
        _iterator84.f();
      }
    }
    D.applyStationDefaults(ops);
    var order = {
      id,
      num,
      type,
      product,
      client,
      qty: items.reduce((sum, i) => sum + i.qty, 0),
      unit: unit || (type === "eng" ? "project" : "units"),
      priority: priority || "normal",
      due,
      notes: notes || "",
      shipped: false,
      archived: false,
      createdAt: Date.now(),
      portfolioId: portfolioId || null,
      oneDriveUrl: oneDriveUrl || "",
      materials: [],
      items,
      ops
    };
    Store.state.orders.unshift(order);
    var taskNote = ops.length ? ` — ${ops.length} tasks created` : "";
    this.log(byId, `created ${type === "eng" ? "engineering project" : "order"} **${num}** for ${client}${taskNote}`, {
      orderId: order.id
    });
    Store.save();
    return order;
  },
  updateOrder(orderId, patch, byId) {
    var o = D.order(orderId);
    Object.assign(o, patch);
    Store.save();
  },
  /* ---------- modules ---------- */
  setModuleDone(orderId, moduleId, done, byId) {
    var o = D.order(orderId);
    var m = D.module(o, moduleId);
    if (!o || !m) return null;
    m.done = Math.max(0, Math.min(m.qty || 1, Math.round(Number(done) || 0)));
    /* the assembly task counts modules, so the tick IS the report — keeping
       them as two numbers somebody has to reconcile is how they drift apart */
    var op = D.assemblyOp(o);
    if (op) {
      var total = D.modulesDone(o);
      var item = D.item(o, op.itemId);
      op.qtyDone = Math.min(total, item ? item.qty : total);
      if (op.status === "queued" && op.qtyDone > 0) op.status = "paused";
      if (item && op.qtyDone >= item.qty && op.status !== "done") {
        op.status = "done";
        op.completedAt = Date.now();
        op.loggedMs = D.opElapsed(op);
        op.startedAt = null;
      } else if (op.status === "done" && item && op.qtyDone < item.qty) {
        op.status = "paused";
        op.completedAt = null;
      }
    }
    this.log(byId, `${m.done ? "assembled" : "un-ticked"} **${esc0(m.name)}** on ${o.num}`, {
      orderId
    });
    Store.save();
    return m;
  },
  /* Set how many cabinets this job really is. The assembly line is counted in
     modules, so the task targets move with it. */
  setModuleCount(orderId, want, byId) {
    var o = D.order(orderId);
    if (!o) return null;
    var n = Math.max(1, Math.round(Number(want) || 0));
    var old = D.orderModules(o);
    if (old.length === n) return null;
    var scope = o.swood && o.swood.scope || old[0] && old[0].qty || 1;
    var doneBefore = D.modulesDone(o);
    /* With a checklist, regroup what is there. Without one — a job imported
       before any of this existed — the parts are the only place the cabinets'
       names could still be. */
    var source = old.length ? old.map(m => m.name) : D.moduleNamesFromParts(o);
    var names = source.length === n ? source : D.regroupModules(source, n);
    var recovered = !!names;
    o.modules = (names || Array.from({
      length: n
    }, (_, i) => `Cabinet ${i + 1}`)).map(name => ({
      id: uid("mod"),
      name,
      qty: scope,
      done: 0
    }));

    /* what was already assembled stays assembled — filled from the top, since
       which specific cabinet it was is no longer knowable after a regroup.
       On a job that never had a checklist, the assembly task is what knows. */
    var asmOp = D.assemblyOp(o);
    var left = Math.min(old.length ? doneBefore : asmOp ? asmOp.qtyDone : 0, n * scope);
    var _iterator85 = _createForOfIteratorHelper(o.modules),
      _step85;
    try {
      for (_iterator85.s(); !(_step85 = _iterator85.n()).done;) {
        var m = _step85.value;
        var take = Math.min(m.qty, left);
        m.done = take;
        left -= take;
      }

      /* the assembly line is measured in modules; move its target with them */
    } catch (err) {
      _iterator85.e(err);
    } finally {
      _iterator85.f();
    }
    var op = asmOp;
    if (op) {
      var item = D.item(o, op.itemId);
      if (item) {
        var was = item.qty || 1;
        item.qty = n * scope;
        var _iterator86 = _createForOfIteratorHelper(o.ops.filter(y => y.itemId === item.id)),
          _step86;
        try {
          for (_iterator86.s(); !(_step86 = _iterator86.n()).done;) {
            var x = _step86.value;
            if (was > 0) x.estMins = Math.max(5, Math.round(x.estMins * item.qty / was));
            x.qtyDone = Math.min(x.qtyDone, item.qty);
            if (x.status === "done" && x.qtyDone < item.qty) {
              x.status = "queued";
              x.completedAt = null;
            }
          }
        } catch (err) {
          _iterator86.e(err);
        } finally {
          _iterator86.f();
        }
        op.qtyDone = D.modulesDone(o);
        o.qty = o.items.reduce((sum, i) => sum + i.qty, 0);
      }
    }
    if (o.swood) o.swood.modules = n * scope;
    this.log(byId, `set ${o.num} to ${n} cabinet${n === 1 ? "" : "s"}${recovered ? " — names regrouped" : " — renumbered"}`, {
      orderId
    });
    Store.save();
    return {
      count: n,
      recovered,
      names: o.modules.map(m => m.name)
    };
  },
  /* A cabinet the shop calls something else. */
  renameModule(orderId, moduleId, name, byId) {
    var o = D.order(orderId);
    var m = D.module(o, moduleId);
    var clean = String(name || "").trim();
    if (!m || !clean || m.name === clean) return null;
    var was = m.name;
    m.name = clean;
    this.log(byId, `renamed **${esc0(was)}** to **${esc0(clean)}** on ${o.num}`, {
      orderId
    });
    Store.save();
    return m;
  },
  /* ---------- who is on a job ---------- */
  setOpAssignees(orderId, opId, ids, byId) {
    var o = D.order(orderId);
    var op = o && o.ops.find(x => x.id === opId);
    if (!op) return null;
    var clean = [...new Set((ids || []).filter(id => D.member(id)))];
    var before = new Set(D.opAssigneeIds(op));
    op.assigneeIds = clean;
    op.assigneeId = clean[0] || null; // what the rest of the app still reads
    for (var _i5 = 0, _clean = clean; _i5 < _clean.length; _i5++) {
      var _D$member2;
      var id = _clean[_i5];
      if (before.has(id) || id === byId) continue;
      this.notify(id, {
        type: "task",
        orderId: o.id,
        text: `**${((_D$member2 = D.member(byId)) === null || _D$member2 === void 0 ? void 0 : _D$member2.name) || "Someone"}** put you on ${this._opName(o, op)} on ${o.num}`
      }, byId);
    }
    var names = clean.map(id => D.member(id).name).join(", ");
    this.log(byId, clean.length ? `assigned **${names}** to ${this._opName(o, op)} on ${o.num}` : `unassigned ${this._opName(o, op)} on ${o.num}`, {
      orderId
    });
    Store.save();
    return op;
  },
  /* ---------- attachments ---------- */
  addFileMeta(meta, byId) {
    var f = _objectSpread({
      at: Date.now(),
      by: byId || null,
      cloud: false
    }, meta);
    D.files().unshift(f);
    var o = f.orderId ? D.order(f.orderId) : null;
    this.log(byId, `attached **${esc0(f.name)}**${o ? ` to ${o.num}` : ""}`, {
      orderId: f.orderId || undefined
    });
    Store.save();
    return f;
  },
  removeFile(id, byId) {
    var f = D.file(id);
    if (!f) return false;
    Store.state.files = D.files().filter(x => x.id !== id);
    this.log(byId, `removed attachment **${esc0(f.name)}**`, {
      orderId: f.orderId || undefined
    });
    Store.save();
    return true;
  },
  /* Quiet bookkeeping — no log line, these are not decisions anyone made. */
  setFileStore(id, store, note) {
    var f = D.file(id);
    if (!f || f.store === store && !note) return;
    f.store = store;
    f.storeNote = note || "";
    Store.save();
  },
  markFileHere(id) {
    var f = D.file(id);
    if (!f) return;
    var dev = Files.deviceId();
    if (!(f.devices || []).includes(dev)) {
      f.devices = [...(f.devices || []), dev];
      Store.save();
    }
  },
  /* Kept in state so it survives a reload and reaches other devices — an
     assessment somebody paid for should not be a one-off toast. */
  saveInsight(insight, meta, byId) {
    Store.state.insights = {
      at: Date.now(),
      by: byId || null,
      insight,
      meta: meta || {}
    };
    this.log(byId, `asked for an assessment of the last ${(meta || {}).days || "?"} days`);
    Store.save();
    return Store.state.insights;
  },
  /* ---------- changing how many to make ----------
     order.qty was only ever a headline: every task counts against its ITEM's
     qty, so editing the order to 4 left the header saying 4 while the shop
     floor still had to report 6. Changing it has to reach the items, the task
     targets and the estimates, or the number on the drawer is a decoration. */
  setOrderQty(orderId, qty, byId) {
    var o = D.order(orderId);
    if (!o) return null;
    var want = Math.max(1, Math.round(Number(qty) || 0));
    var items = o.items || [];
    if (!items.length) return null;
    var was = new Map(items.map(i => [i.id, i.qty])); // needed to scale estimates
    var before = items.reduce((n, i) => n + i.qty, 0);
    if (before === want) return null;

    /* one item is the ordinary case and can be set outright; several are
       scaled in proportion, and the header then follows the real sum rather
       than claiming a total the lines do not add up to */
    if (items.length === 1) {
      items[0].qty = want;
    } else {
      var f = want / before;
      var _iterator87 = _createForOfIteratorHelper(items),
        _step87;
      try {
        for (_iterator87.s(); !(_step87 = _iterator87.n()).done;) {
          var it = _step87.value;
          it.qty = Math.max(1, Math.round(it.qty * f));
        }
      } catch (err) {
        _iterator87.e(err);
      } finally {
        _iterator87.f();
      }
    }
    o.qty = items.reduce((n, i) => n + i.qty, 0);
    var reopened = 0;
    var _iterator88 = _createForOfIteratorHelper(o.ops),
      _step88;
    try {
      var _loop10 = function _loop10() {
        var op = _step88.value;
        var item = items.find(i => i.id === op.itemId);
        if (!item) return 1; // continue
        var old = was.get(item.id) || item.qty;
        if (old > 0 && item.qty !== old) op.estMins = Math.max(5, Math.round(op.estMins * item.qty / old));
        // reported pieces can never exceed what is being made
        if (op.qtyDone > item.qty) op.qtyDone = item.qty;
        // a task finished for a smaller run has more to do now
        if (op.status === "done" && op.qtyDone < item.qty) {
          op.status = "queued";
          op.completedAt = null;
          reopened++;
        }
      };
      for (_iterator88.s(); !(_step88 = _iterator88.n()).done;) {
        if (_loop10()) continue;
      }
    } catch (err) {
      _iterator88.e(err);
    } finally {
      _iterator88.f();
    }
    this.log(byId, `changed ${o.num} to ${o.qty} ${o.unit || "pcs"}${reopened ? ` — ${reopened} task(s) reopened` : ""}`, {
      orderId
    });
    Store.save();
    return {
      qty: o.qty,
      reopened
    };
  },
  updateOrderLogged(orderId, patch, byId) {
    var o = D.order(orderId);
    var changes = [];
    var label = {
      product: v => `renamed to “${v}”`,
      client: v => `client → ${v}`,
      qty: v => `quantity → ${v}`,
      unit: v => `unit → ${v}`,
      priority: v => `priority ${o.priority} → ${v}`,
      due: v => `due date ${fmtDate(o.due)} → ${fmtDate(v)}`,
      notes: () => `edited notes`,
      portfolioId: v => {
        var _D$portfolio;
        return `portfolio → ${v ? ((_D$portfolio = D.portfolio(v)) === null || _D$portfolio === void 0 ? void 0 : _D$portfolio.name) || "?" : "none"}`;
      },
      oneDriveUrl: v => v ? `set OneDrive link` : `cleared OneDrive link`
    };
    for (var _i6 = 0, _Object$keys = Object.keys(patch); _i6 < _Object$keys.length; _i6++) {
      var k = _Object$keys[_i6];
      if ((patch[k] || "") === (o[k] || "") && typeof patch[k] !== "number") continue; // no real change (treats ""≈undefined)
      if (patch[k] !== o[k] && label[k]) changes.push(label[k](patch[k]));
    }
    Object.assign(o, patch);
    if (changes.length) this.log(byId, `updated ${o.num}: ${changes.join(", ")}`, {
      orderId
    });
    Store.save();
    return changes.length;
  },
  deleteOrder(orderId, byId) {
    var o = D.order(orderId);
    Store.state.orders = Store.state.orders.filter(x => x.id !== orderId);
    this.log(byId, `deleted order **${o.num}** (${o.product})`);
    Store.save();
  },
  /* ---------- OneDrive config ---------- */
  setOneDrive(patch, byId) {
    Store.state.oneDrive = _objectSpread(_objectSpread({}, Store.state.oneDrive || {
      baseUrl: "",
      template: "{base}/{code}"
    }), patch);
    Store.save();
  },
  /* the job rows on the project board, in the order people dragged them */
  setJobOrder(keys, byId) {
    var seen = {};
    var old = Store.state.jobOrder || [];
    var next = [];
    keys.concat(old).forEach(k => { if (k && !seen[k]) { seen[k] = 1; next.push(k); } });
    Store.state.jobOrder = next.slice(0, 600);
    Store.save();
  },
  resetJobOrder() {
    Store.state.jobOrder = [];
    Store.save();
  },
  /* ---------- Portfolios ---------- */
  addPortfolio(name, icon, byId, ic, color) {
    var p = {
      id: uid("p"),
      name,
      icon: icon || "📁",
      ic: ic || "folder",
      color: color || null
    };
    Store.state.portfolios.push(p);
    this.log(byId, `created portfolio **${name}**`);
    Store.save();
    return p;
  },
  updatePortfolio(id, patch) {
    Object.assign(D.portfolio(id), patch);
    Store.save();
  },
  deletePortfolio(id, byId) {
    var p = D.portfolio(id);
    Store.state.orders.forEach(o => {
      if (o.portfolioId === id) o.portfolioId = null;
    });
    Store.state.portfolios = Store.state.portfolios.filter(x => x.id !== id);
    this.log(byId, `deleted portfolio **${p.name}**`);
    Store.save();
  },
  /* ---------- Articles ---------- */
  addArticle({
    sku,
    name,
    unit,
    lanes
  }, byId) {
    var a = {
      id: uid("a"),
      sku: sku || name.slice(0, 6).toUpperCase(),
      name,
      unit: unit || "pcs",
      lanes: lanes || [{
        group: null,
        route: []
      }]
    };
    Store.state.articles.push(a);
    this.log(byId, `added article **${a.name}** (${a.sku})`);
    Store.save();
    return a;
  },
  updateArticle(id, patch, byId) {
    var a = D.article(id);
    Object.assign(a, patch);
    if (byId) this.log(byId, `updated article **${a.name}**`);
    Store.save();
  },
  deleteArticle(id, byId) {
    var a = D.article(id);
    Store.state.articles = Store.state.articles.filter(x => x.id !== id);
    this.log(byId, `deleted article **${a.name}**`);
    Store.save();
  },
  /* ---------- Warehouse ---------- */
  _move(materialId, delta, note, byId, orderId) {
    Store.state.stockMoves.unshift({
      id: uid("sm"),
      ts: Date.now(),
      materialId,
      delta,
      note: note || "",
      orderId: orderId || null,
      who: byId
    });
    if (Store.state.stockMoves.length > 1000) Store.state.stockMoves.length = 1000;
  },
  receiveStock(materialId, qty, note, byId) {
    var mat = D.material(materialId);
    mat.qty += qty;
    this._move(materialId, +qty, note || "Received", byId);
    this.log(byId, `received **${qty} ${mat.unit} ${mat.name}**${note ? ` — ${note}` : ""}`, {
      materialId
    });
    Store.save();
  },
  adjustStock(materialId, delta, note, byId) {
    var mat = D.material(materialId);
    mat.qty += delta;
    this._move(materialId, delta, note || "Adjustment", byId);
    this.log(byId, `adjusted **${mat.name}** by ${delta > 0 ? "+" : ""}${delta} ${mat.unit}${note ? ` — ${note}` : ""}`, {
      materialId
    });
    Store.save();
  },
  addMaterial({
    sku,
    name,
    unit,
    qty,
    minQty,
    location,
    icon,
    ic,
    supplierId,
    reorderQty
  }, byId) {
    var mat = {
      id: uid("mat"),
      sku,
      name,
      unit: unit || "pcs",
      qty: qty || 0,
      minQty: minQty || 0,
      location: location || "",
      icon: icon || "📦",
      ic: ic || "box",
      supplierId: supplierId || null,
      reorderQty: reorderQty || null
    };
    Store.state.materials.push(mat);
    if (mat.qty) this._move(mat.id, mat.qty, "Initial stock", byId);
    this.log(byId, `added material **${mat.name}** (${mat.qty} ${mat.unit})`, {
      materialId: mat.id
    });
    Store.save();
    return mat;
  },
  updateMaterial(id, patch, byId) {
    var mat = D.material(id);
    var renamed = patch.name && patch.name !== mat.name;
    Object.assign(mat, patch);
    if (byId && renamed) this.log(byId, `updated material **${mat.name}**`, {
      materialId: id
    });
    Store.save();
  },
  deleteMaterial(id, byId) {
    if (D.materialInUse(id)) return false;
    var mat = D.material(id);
    Store.state.materials = Store.state.materials.filter(m => m.id !== id);
    Store.state.orders.forEach(o => {
      o.materials = (o.materials || []).filter(l => l.materialId !== id);
    });
    this.log(byId, `deleted material **${mat.name}**`);
    Store.save();
    return true;
  },
  /* ---------- Suppliers ---------- */
  addSupplier({
    name,
    contact,
    email,
    phone,
    leadDays,
    notes
  }, byId) {
    var sup = {
      id: uid("sup"),
      name: (name || "").trim() || "Supplier",
      contact: contact || "",
      email: email || "",
      phone: phone || "",
      leadDays: leadDays || null,
      notes: notes || ""
    };
    (Store.state.suppliers = Store.state.suppliers || []).push(sup);
    this.log(byId, `added supplier **${sup.name}**`);
    Store.save();
    return sup;
  },
  updateSupplier(id, patch, byId) {
    var sup = D.supplier(id);
    if (!sup) return;
    Object.assign(sup, patch);
    this.log(byId, `updated supplier **${sup.name}**`);
    Store.save();
  },
  /* Refused while an order is still out with them — deleting would strand it */
  deleteSupplier(id, byId) {
    if (D.supplierUsed(id)) return false;
    var sup = D.supplier(id);
    if (!sup) return false;
    Store.state.suppliers = Store.state.suppliers.filter(s => s.id !== id);
    Store.state.materials.forEach(m => {
      if (m.supplierId === id) m.supplierId = null;
    });
    this.log(byId, `deleted supplier **${sup.name}**`);
    Store.save();
    return true;
  },
  /* ---------- Purchase orders ----------
     A PO is a promise, not stock: nothing touches the shelves until it is
     received, and receiving goes through the same stock movement as any
     other delivery, so the material history stays one story. */
  createPurchase({
    supplierId,
    lines,
    expectedAt,
    notes
  }, byId) {
    var _D$supplier;
    var s = Store.state;
    if (!s.poSeq) s.poSeq = 1001;
    var po = {
      id: uid("po"),
      num: "PO-" + s.poSeq++,
      supplierId: supplierId || null,
      status: "draft",
      createdAt: Date.now(),
      createdBy: byId || null,
      sentAt: null,
      expectedAt: expectedAt || null,
      receivedAt: null,
      notes: notes || "",
      lines: (lines || []).filter(l => l.qty > 0).map(l => ({
        id: uid("pl"),
        materialId: l.materialId,
        qty: l.qty,
        received: 0
      }))
    };
    (s.purchases = s.purchases || []).unshift(po);
    this.log(byId, `drafted **${po.num}** for ${((_D$supplier = D.supplier(po.supplierId)) === null || _D$supplier === void 0 ? void 0 : _D$supplier.name) || "no supplier"} — ${po.lines.length} line${po.lines.length === 1 ? "" : "s"}`, {
      purchaseId: po.id
    });
    Store.save();
    return po;
  },
  /* qty 0 removes the line; an unknown material adds one */
  setPurchaseLine(poId, materialId, qty, byId) {
    var po = D.purchase(poId);
    if (!po || po.status !== "draft") return; // a sent order is a record, not a scratchpad
    var line = po.lines.find(l => l.materialId === materialId);
    if (qty > 0) {
      if (line) line.qty = qty;else po.lines.push({
        id: uid("pl"),
        materialId,
        qty,
        received: 0
      });
    } else if (line) {
      po.lines = po.lines.filter(l => l !== line);
    }
    Store.save();
  },
  updatePurchase(poId, patch, byId) {
    var po = D.purchase(poId);
    if (!po) return;
    Object.assign(po, patch);
    Store.save();
  },
  sendPurchase(poId, byId) {
    var _D$supplier3;
    var po = D.purchase(poId);
    if (!po || po.status !== "draft" || !po.lines.length) return false;
    po.status = "sent";
    po.sentAt = Date.now();
    // no explicit date? fall back to the supplier's own lead time
    if (!po.expectedAt) {
      var _D$supplier2;
      var lead = (_D$supplier2 = D.supplier(po.supplierId)) === null || _D$supplier2 === void 0 ? void 0 : _D$supplier2.leadDays;
      if (lead) po.expectedAt = Date.now() + lead * DAY;
    }
    this.log(byId, `sent **${po.num}** to ${((_D$supplier3 = D.supplier(po.supplierId)) === null || _D$supplier3 === void 0 ? void 0 : _D$supplier3.name) || "supplier"}`, {
      purchaseId: po.id
    });
    Store.save();
    return true;
  },
  /* receipts: { [lineId]: qty }. Omitted lines are received in full, so the
     common case — the whole delivery arrived — is one click. */
  receivePurchase(poId, receipts, byId) {
    var po = D.purchase(poId);
    if (!po || po.status === "cancelled" || po.status === "received") return false;
    var moved = 0;
    var _iterator89 = _createForOfIteratorHelper(po.lines),
      _step89;
    try {
      for (_iterator89.s(); !(_step89 = _iterator89.n()).done;) {
        var l = _step89.value;
        var want = receipts && receipts[l.id] !== undefined ? Number(receipts[l.id]) : D.poLineOutstanding(l);
        var take = Math.min(Math.max(0, want), D.poLineOutstanding(l));
        if (!take) continue;
        l.received = (l.received || 0) + take;
        var mat = D.material(l.materialId);
        if (mat) {
          var _D$supplier4;
          this.receiveStock(l.materialId, take, `${po.num} — ${((_D$supplier4 = D.supplier(po.supplierId)) === null || _D$supplier4 === void 0 ? void 0 : _D$supplier4.name) || "delivery"}`, byId);
          moved++;
        }
      }
    } catch (err) {
      _iterator89.e(err);
    } finally {
      _iterator89.f();
    }
    if (D.poFullyReceived(po)) {
      po.status = "received";
      po.receivedAt = Date.now();
    }
    if (moved) this.log(byId, `received ${D.poFullyReceived(po) ? "" : "part of "}**${po.num}**`, {
      purchaseId: po.id
    });
    Store.save();
    return moved > 0;
  },
  cancelPurchase(poId, byId) {
    var po = D.purchase(poId);
    if (!po || po.status === "received") return false;
    po.status = "cancelled";
    this.log(byId, `cancelled **${po.num}**`, {
      purchaseId: po.id
    });
    Store.save();
    return true;
  },
  deletePurchase(poId, byId) {
    var po = D.purchase(poId);
    if (!po) return false;
    // only a draft can vanish; anything sent or received is a record
    if (po.status !== "draft") return false;
    Store.state.purchases = Store.state.purchases.filter(p => p.id !== poId);
    this.log(byId, `deleted draft **${po.num}**`);
    Store.save();
    return true;
  },
  /* ---------- acting on a demand row ----------
     A row gathers the same material across several jobs, so a correction made
     once has to land on all of them — otherwise the row splits in two and the
     shop is looking at half its own demand. */
  renameDemandMaterial(key, newName, byId) {
    var name = String(newName || "").trim();
    if (!name) return 0;
    var lines = D.demandLines(key);
    var n = 0;
    var _iterator90 = _createForOfIteratorHelper(lines),
      _step90;
    try {
      for (_iterator90.s(); !(_step90 = _iterator90.n()).done;) {
        var _step90$value = _step90.value,
          order = _step90$value.order,
          line = _step90$value.line;
        if (line.materialId) continue; // a linked line takes its name from the warehouse
        if (line.name === name) continue;
        line.name = name;
        n++;
        this.log(byId, `renamed a material on **${order.num}** → ${esc0(name)}`, {
          orderId: order.id
        });
      }
    } catch (err) {
      _iterator90.e(err);
    } finally {
      _iterator90.f();
    }
    if (n) {
      /* the key is built from the name, so renaming moves the row — carry the
         one-off stock across or it is orphaned under a name nobody uses */
      var spot = D._spot();
      var to = "name:" + D._stName(name);
      if (spot[key] && to !== key) {
        spot[to] = _objectSpread(_objectSpread({}, spot[key]), {}, {
          name
        });
        delete spot[key];
      }
      Store.save();
    }
    return n;
  },
  linkDemandMaterial(key, materialId, byId) {
    var mat = materialId ? D.material(materialId) : null;
    var lines = D.demandLines(key);
    var n = 0;
    var _iterator91 = _createForOfIteratorHelper(lines),
      _step91;
    try {
      for (_iterator91.s(); !(_step91 = _iterator91.n()).done;) {
        var _step91$value = _step91.value,
          order = _step91$value.order,
          line = _step91$value.line;
        line.materialId = mat ? mat.id : null;
        if (mat) line.unit = mat.unit;
        n++;
        this.log(byId, `linked ${esc0(line.name || mat && mat.name || "a material")} on **${order.num}** to ${mat ? `**${mat.name}**` : "no stock item"}`, {
          orderId: order.id,
          materialId: mat ? mat.id : undefined
        });
      }
    } catch (err) {
      _iterator91.e(err);
    } finally {
      _iterator91.f();
    }
    if (n) Store.save();
    return n;
  },
  /* "We have ordered this, and it lands on Thursday." Goes through a real
     purchase order, because that is the shop's record of what is coming — and
     creates the stock item first if the jobs were asking for a name the
     warehouse had never heard of. */
  markDemandOrdered(key, {
    qty,
    supplierId,
    expectedAt,
    sku,
    unit
  } = {}, byId) {
    var row = D.demandRow(key);
    if (!row) return null;
    var mat = row.material;
    if (!mat) {
      mat = this.stockFromDemand(key, {
        sku,
        unit: unit || row.unit,
        qty: 0,
        minQty: 0,
        supplierId
      }, byId);
      if (!mat) return null;
      row = D.demandRow(mat.id);
    }
    var amount = Number(qty) > 0 ? Number(qty) : Math.max(0, row.short);
    if (!amount) return null;
    if (supplierId && !mat.supplierId) this.updateMaterial(mat.id, {
      supplierId
    }, byId);
    var po = this.createPurchase({
      supplierId: supplierId || mat.supplierId || null,
      lines: [{
        materialId: mat.id,
        qty: amount
      }],
      expectedAt: expectedAt || null
    }, byId);
    this.sendPurchase(po.id, byId); // it is ordered, not a draft
    if (expectedAt) this.updatePurchase(po.id, {
      expectedAt
    }, byId);
    return po;
  },
  /* "We already have 800 of this" — without inventing a catalogue item for
     something bought once. Pass null to forget it again. */
  setSpotStock(key, qty, note, byId) {
    var spot = D._spot();
    var row = D.demandRow(key);
    if (qty === null || qty === undefined || qty === "") {
      delete spot[key];
      this.log(byId, `cleared the on-hand amount for ${esc0(row ? row.name : "a material")}`);
    } else {
      var n = Math.max(0, Number(qty) || 0);
      spot[key] = {
        qty: n,
        note: note || "",
        at: Date.now(),
        by: byId || null,
        name: row ? row.name : ""
      };
      this.log(byId, `recorded ${n}${row ? " " + esc0(row.unit) : ""} of ${esc0(row ? row.name : "a material")} on hand`);
    }
    Store.save();
    return true;
  },
  /* Take a name the jobs are asking for and make it a real stock item. */
  stockFromDemand(key, {
    sku,
    unit,
    qty,
    minQty,
    location,
    supplierId
  } = {}, byId) {
    var row = D.demandRow(key);
    if (!row || row.material) return null;
    var mat = this.addMaterial({
      sku: sku || "",
      name: row.name,
      unit: unit || row.unit || "pcs",
      qty: qty || 0,
      minQty: minQty || 0,
      location: location || "",
      supplierId: supplierId || null
    }, byId);
    this.linkDemandMaterial(key, mat.id, byId);
    return mat;
  },
  /* Draft orders for what the live jobs are short of, rather than for what has
     dipped below a minimum — the figure that actually stops work. */
  draftFromDemand(byId) {
    var bySupplier = new Map();
    var skipped = 0;
    var _iterator92 = _createForOfIteratorHelper(D.demandShortfalls()),
      _step92;
    try {
      for (_iterator92.s(); !(_step92 = _iterator92.n()).done;) {
        var r = _step92.value;
        if (!r.material || !r.material.supplierId) {
          skipped++;
          continue;
        }
        var k = r.material.supplierId;
        if (!bySupplier.has(k)) bySupplier.set(k, []);
        bySupplier.get(k).push({
          materialId: r.material.id,
          qty: r.short
        });
      }
    } catch (err) {
      _iterator92.e(err);
    } finally {
      _iterator92.f();
    }
    var created = [];
    var _iterator93 = _createForOfIteratorHelper(bySupplier),
      _step93;
    try {
      for (_iterator93.s(); !(_step93 = _iterator93.n()).done;) {
        var _step93$value = _slicedToArray(_step93.value, 2),
          supplierId = _step93$value[0],
          lines = _step93$value[1];
        created.push(this.createPurchase({
          supplierId,
          lines
        }, byId));
      }
    } catch (err) {
      _iterator93.e(err);
    } finally {
      _iterator93.f();
    }
    return {
      created,
      skipped
    };
  },
  /* One draft per supplier, covering everything below its minimum. Materials
     with no supplier yet cannot be ordered, so they are reported back rather
     than silently dropped. */
  draftReorder(byId) {
    var created = [];
    var skipped = 0;
    var _iterator94 = _createForOfIteratorHelper(D.reorderBySupplier()),
      _step94;
    try {
      for (_iterator94.s(); !(_step94 = _iterator94.n()).done;) {
        var g = _step94.value;
        if (!g.supplier) {
          skipped += g.lines.length;
          continue;
        }
        created.push(this.createPurchase({
          supplierId: g.supplier.id,
          lines: g.lines.map(l => ({
            materialId: l.material.id,
            qty: l.qty
          }))
        }, byId));
      }
    } catch (err) {
      _iterator94.e(err);
    } finally {
      _iterator94.f();
    }
    return {
      created,
      skipped
    };
  },
  /* ---------- Order ↔ materials ---------- */
  addOrderMaterial(orderId, materialId, qty, byId) {
    var o = D.order(orderId);
    var mat = D.material(materialId);
    o.materials = o.materials || [];
    o.materials.push({
      id: uid("ln"),
      materialId,
      qty,
      consumed: false,
      consumedAt: null,
      consumedBy: null
    });
    this.log(byId, `added **${qty} ${mat.unit} ${mat.name}** to ${o.num}`, {
      orderId,
      materialId
    });
    Store.save();
  },
  removeOrderMaterial(orderId, lineId, byId) {
    var o = D.order(orderId);
    var line = o.materials.find(l => l.id === lineId);
    if (!line || line.consumed) return false;
    var mat = D.material(line.materialId);
    o.materials = o.materials.filter(l => l.id !== lineId);
    this.log(byId, `removed **${mat ? mat.name : "material"}** from ${o.num}`, {
      orderId
    });
    Store.save();
    return true;
  },
  consumeLine(orderId, lineId, byId) {
    var o = D.order(orderId);
    var line = o.materials.find(l => l.id === lineId);
    if (!line || line.consumed) return false;
    var mat = D.material(line.materialId);
    mat.qty -= line.qty;
    line.consumed = true;
    line.consumedAt = Date.now();
    line.consumedBy = byId;
    this._move(mat.id, -line.qty, `Consumed for ${o.num}`, byId, orderId);
    this.log(byId, `used **${line.qty} ${mat.unit} ${mat.name}** on ${o.num}`, {
      orderId,
      materialId: mat.id
    });
    Store.save();
    return true;
  },
  /* ---------- Stations (shop flow customization) ---------- */
  addStation({
    name,
    icon,
    ic,
    estMins,
    kind
  }, byId) {
    var st = {
      id: uid("st"),
      name: name || "New station",
      icon: icon || "🛠️",
      ic: ic || (kind === "eng" ? "bulb" : "toolbox"),
      estMins: estMins || 60,
      kind: kind || "prod"
    };
    Store.state.stations.push(st);
    this.log(byId, `added station **${st.name}**`);
    Store.save();
    return st;
  },
  updateStation(id, patch, byId) {
    var st = D.station(id);
    var renamed = patch.name && patch.name !== st.name;
    var old = st.name;
    Object.assign(st, patch);
    if (byId && renamed) this.log(byId, `renamed station **${old}** → **${st.name}**`);
    Store.save();
  },
  moveStation(id, dir) {
    var arr = Store.state.stations;
    var i = arr.findIndex(s => s.id === id);
    if (i < 0) return false;
    var kind = arr[i].kind || "prod";
    var j = i + dir; // skip over entries of the other kind
    while (j >= 0 && j < arr.length && (arr[j].kind || "prod") !== kind) j += dir;
    if (j < 0 || j >= arr.length) return false;
    var _ref4 = [arr[j], arr[i]];
    arr[i] = _ref4[0];
    arr[j] = _ref4[1];
    Store.save();
    return true;
  },
  deleteStation(id, byId) {
    var used = Store.state.orders.some(o => o.ops.some(op => op.stationId === id)) || Store.state.articles.some(a => a.lanes.some(l => l.route.some(r => r.stationId === id)));
    if (used) return false;
    var st = D.station(id);
    Store.state.stations = Store.state.stations.filter(s => s.id !== id);
    Store.state.members.forEach(m => {
      if (m.station === id) m.station = null;
    });
    this.log(byId, `deleted station **${st.name}**`);
    Store.save();
    return true;
  },
  /* ---------- Whiteboards ---------- */
  addBoard(name, byId) {
    var b = {
      id: uid("wb"),
      name: name || "New board",
      createdBy: byId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      els: [],
      conns: []
    };
    Store.state.boards.push(b);
    this.log(byId, `created whiteboard **${b.name}**`);
    Store.save();
    return b;
  },
  renameBoard(id, name, byId) {
    var b = D.board(id);
    var old = b.name;
    b.name = name || b.name;
    b.updatedAt = Date.now();
    if (old !== b.name) this.log(byId, `renamed whiteboard **${old}** → **${b.name}**`);
    Store.save();
  },
  deleteBoard(id, byId) {
    var b = D.board(id);
    Store.state.boards = Store.state.boards.filter(x => x.id !== id);
    this.log(byId, `deleted whiteboard **${b.name}**`);
    Store.save();
  },
  wbAdd(boardId, el, byId) {
    var b = D.board(boardId);
    el.id = el.id || uid("we");
    el.by = byId;
    el.ts = Date.now();
    b.els.push(el);
    b.updatedAt = Date.now();
    Store.save();
    return el;
  },
  wbUpdate(boardId, elId, patch) {
    var b = D.board(boardId);
    var el = b.els.find(e => e.id === elId);
    if (!el) return;
    Object.assign(el, patch);
    b.updatedAt = Date.now();
    Store.save();
  },
  wbDelete(boardId, elId) {
    var b = D.board(boardId);
    var gone = b.els.find(e => e.id === elId);
    b.els = b.els.filter(e => e.id !== elId);
    b.conns = b.conns.filter(c => c.from !== elId && c.to !== elId);
    b.updatedAt = Date.now();
    Store.save();
    /* a deleted picture should not leave its file behind in the store —
       unless some other board is still showing the same one */
    if (gone && gone.fileId && typeof Files !== "undefined") {
      var stillUsed = (Store.state.boards || []).some(x => (x.els || []).some(e => e.fileId === gone.fileId));
      if (!stillUsed) Files.remove(gone.fileId, null).catch(() => {});
    }
  },
  wbFront(boardId, elId) {
    var b = D.board(boardId);
    var i = b.els.findIndex(e => e.id === elId);
    if (i >= 0) b.els.push(b.els.splice(i, 1)[0]);
    Store.save();
  },
  wbConnect(boardId, from, to) {
    var b = D.board(boardId);
    if (from === to) return null;
    if (b.conns.some(c => c.from === from && c.to === to)) return null;
    var c = {
      id: uid("wc"),
      from,
      to
    };
    b.conns.push(c);
    b.updatedAt = Date.now();
    Store.save();
    return c;
  },
  wbDisconnect(boardId, connId) {
    var b = D.board(boardId);
    b.conns = b.conns.filter(c => c.id !== connId);
    b.updatedAt = Date.now();
    Store.save();
  },
  setBoardSharing(boardId, visibility, memberIds, byId) {
    var b = D.board(boardId);
    b.visibility = visibility;
    b.memberIds = visibility === "custom" ? memberIds || [] : [];
    var label = {
      team: "the whole team",
      private: "only themselves",
      custom: `${b.memberIds.length + 1} people`
    }[visibility];
    this.log(byId, `changed **${b.name}** sharing → ${label}`);
    Store.save();
  },
  /* ---------- Notifications ---------- */
  notify(forId, {
    type,
    orderId,
    gprojectId,
    gtaskId,
    text
  }, byId) {
    var n = {
      id: uid("nt"),
      forId,
      by: byId || null,
      ts: Date.now(),
      read: false,
      type: type || "info",
      orderId: orderId || null,
      gprojectId: gprojectId || null,
      gtaskId: gtaskId || null,
      text
    };
    Store.state.notifications.unshift(n);
    if (Store.state.notifications.length > 300) Store.state.notifications.length = 300;
    Store.save();
    return n;
  },
  markNotifRead(id) {
    var n = Store.state.notifications.find(x => x.id === id);
    if (n && !n.read) {
      n.read = true;
      Store.save();
    }
  },
  markAllNotifsRead(memberId) {
    Store.state.notifications.forEach(n => {
      if (n.forId === memberId) n.read = true;
    });
    Store.save();
  },
  clearNotifs(memberId) {
    Store.state.notifications = Store.state.notifications.filter(n => n.forId !== memberId);
    Store.save();
  },
  /* Manager confirms the client is happy with the drawings → notify the engineer(s) */
  confirmClientApproval(orderId, byId) {
    var o = D.order(orderId);
    if (!o || o.type !== "eng" || o.clientApproved) return [];
    o.clientApproved = {
      at: Date.now(),
      by: byId
    };
    var engineers = D.projectEngineers(o).filter(id => id !== byId);
    var mgr = D.member(byId);
    var _iterator95 = _createForOfIteratorHelper(engineers),
      _step95;
    try {
      for (_iterator95.s(); !(_step95 = _iterator95.n()).done;) {
        var engId = _step95.value;
        this.notify(engId, {
          type: "client_ok",
          orderId: o.id,
          text: `${mgr ? mgr.name : "A manager"} confirmed the client approved the drawings for ${o.num} — you're clear to proceed`
        }, byId);
      }
    } catch (err) {
      _iterator95.e(err);
    } finally {
      _iterator95.f();
    }
    this.log(byId, `confirmed **client approval** of drawings on ${o.num}${engineers.length ? ` — notified ${engineers.map(id => {
      var _D$member3;
      return (_D$member3 = D.member(id)) === null || _D$member3 === void 0 ? void 0 : _D$member3.name;
    }).filter(Boolean).join(", ")}` : ""}`, {
      orderId: o.id
    });
    Store.save();
    return engineers;
  },
  revokeClientApproval(orderId, byId) {
    var o = D.order(orderId);
    if (!o || !o.clientApproved) return;
    o.clientApproved = null;
    this.log(byId, `revoked client approval on ${o.num}`, {
      orderId: o.id
    });
    Store.save();
  },
  /* ---------- "is this the same project as ENG-…?" ----------
     Production says yes → the WO waits on the engineer. The engineer confirms
     → the open design steps are closed, the ENG project is linked and archived
     exactly as a hand-off would leave it. Says no → the pair is never asked
     about again. */
  _ltText(en, lt) {
    return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
  },
  _engLinkTargets(eng, byId) {
    var ids = D.orderResponsible(eng);
    if (!ids.length) ids = D.projectEngineers(eng);
    return ids.filter(id => id !== byId);
  },
  requestEngLink(prodId, engId, byId) {
    var prod = D.order(prodId),
      eng = D.order(engId);
    if (!prod || !eng || eng.type !== "eng" || prod.type === "eng") return [];
    var now = Date.now();
    prod.engLink = { engId: eng.id, by: byId, at: now, status: "pending" };
    eng.linkRequest = { prodId: prod.id, by: byId, at: now };
    var who = D.member(byId);
    var name = who ? who.name : this._ltText("Production", "Gamyba");
    var targets = this._engLinkTargets(eng, byId);
    for (var i = 0; i < targets.length; i++) {
      this.notify(targets[i], {
        type: "eng_link",
        orderId: eng.id,
        text: this._ltText(
          `${name} says ${prod.num} in production is the same job as ${eng.num} — confirm to close the design steps`,
          `${name} pažymėjo, kad gamybos ${prod.num} yra tas pats projektas kaip ${eng.num} — patvirtinkite, kad uždarytume projektavimo etapus`)
      }, byId);
    }
    this.log(byId, `asked to link **${prod.num}** with engineering **${eng.num}**${targets.length ? ` — waiting for ${targets.map(id => (D.member(id) || {}).name).filter(Boolean).join(", ")}` : ""}`, {
      orderId: prod.id
    });
    Store.save();
    return targets;
  },
  cancelEngLink(prodId, byId) {
    var prod = D.order(prodId);
    var eng = D.engLinkPending(prod);
    if (!prod || !prod.engLink) return;
    if (eng && eng.linkRequest && eng.linkRequest.prodId === prod.id) eng.linkRequest = null;
    prod.engLink = null;
    this.log(byId, `withdrew the link request on **${prod.num}**`, { orderId: prod.id });
    Store.save();
  },
  /* "No, a different project" from the WO side — stop suggesting this pair */
  dismissEngMatch(prodId, engId, byId) {
    var prod = D.order(prodId);
    if (!prod) return;
    if (!Array.isArray(prod.engNotMatch)) prod.engNotMatch = [];
    if (prod.engNotMatch.indexOf(engId) < 0) prod.engNotMatch.push(engId);
    Store.save();
  },
  /* Engineer: yes, same job.
     opIds — the open design steps to close (default: all of them)
     fill  — copy files link / portfolio / client record / notes onto the WO where it has none */
  confirmEngLink(engId, opts, byId) {
    var eng = D.order(engId);
    var prod = D.engLinkRequestFor(eng);
    if (!eng || !prod) return null;
    opts = opts || {};
    var now = Date.now();
    var open = eng.ops.filter(op => op.status !== "done");
    var close = opts.opIds ? open.filter(op => opts.opIds.indexOf(op.id) >= 0) : open;
    for (var i = 0; i < close.length; i++) {
      var op = close[i];
      if (op.startedAt) op.loggedMs = D.opElapsed(op);
      op.startedAt = null;
      op.status = "done";
      op.qtyDone = (D.item(eng, op.itemId) || { qty: 1 }).qty;
      op.completedAt = now;
      op.completedBy = byId;
      op.blockNote = null;
      op.closedByLink = prod.id;
    }
    var filled = [];
    if (opts.fill !== false) {
      if (!String(prod.oneDriveUrl || "").trim() && eng.oneDriveUrl) { prod.oneDriveUrl = eng.oneDriveUrl; filled.push("files"); }
      if (!prod.portfolioId && eng.portfolioId) { prod.portfolioId = eng.portfolioId; filled.push("portfolio"); }
      if (!prod.customerId && eng.customerId) { prod.customerId = eng.customerId; filled.push("client"); }
      if (!String(prod.notes || "").trim() && eng.notes) { prod.notes = eng.notes; filled.push("notes"); }
    }
    var still = eng.ops.filter(op => op.status !== "done").length;
    prod.fromEngId = eng.id;
    prod.engLink = { engId: eng.id, by: prod.engLink.by, at: prod.engLink.at, status: "confirmed", confirmedBy: byId, confirmedAt: now };
    eng.handedOffTo = prod.id;
    eng.linkRequest = null;
    if (!still) { eng.archived = true; eng.archivedAt = now; }
    var who = D.member(byId);
    var asker = prod.engLink.by;
    if (asker && asker !== byId) this.notify(asker, {
      type: "eng_link_ok",
      orderId: prod.id,
      text: this._ltText(
        `${who ? who.name : "The engineer"} confirmed ${prod.num} is ${eng.num}${close.length ? ` — ${close.length} design step${close.length === 1 ? "" : "s"} closed` : ""}`,
        `${who ? who.name : "Inžinierius"} patvirtino: ${prod.num} yra ${eng.num}${close.length ? ` — uždaryta projektavimo etapų: ${close.length}` : ""}`)
    }, byId);
    this.log(byId, `confirmed **${prod.num}** is **${eng.num}**${close.length ? ` — closed ${close.length} design step${close.length === 1 ? "" : "s"}` : ""}${filled.length ? `, filled in ${filled.join(", ")}` : ""}${still ? "" : ", archived the design project"}`, {
      orderId: eng.id
    });
    Store.save();
    return { prod: prod, closed: close.length, filled: filled, archived: !still };
  },
  /* Engineer: no, they are different jobs */
  rejectEngLink(engId, byId) {
    var eng = D.order(engId);
    var prod = D.engLinkRequestFor(eng);
    if (!eng || !prod) return null;
    var asker = prod.engLink.by;
    prod.engLink = null;
    eng.linkRequest = null;
    if (!Array.isArray(prod.engNotMatch)) prod.engNotMatch = [];
    if (prod.engNotMatch.indexOf(eng.id) < 0) prod.engNotMatch.push(eng.id);
    var who = D.member(byId);
    if (asker && asker !== byId) this.notify(asker, {
      type: "eng_link_no",
      orderId: prod.id,
      text: this._ltText(
        `${who ? who.name : "The engineer"}: ${prod.num} is not ${eng.num} — they stay separate`,
        `${who ? who.name : "Inžinierius"}: ${prod.num} nėra ${eng.num} — projektai lieka atskiri`)
    }, byId);
    this.log(byId, `said **${prod.num}** is not **${eng.num}**`, { orderId: eng.id });
    Store.save();
    return prod;
  },
  /* ---------- Planner: projects ---------- */
  addGProject({
    name,
    key,
    color,
    icon
  }, byId) {
    var p = {
      id: uid("gp"),
      name: name || "New project",
      key: (key || name.slice(0, 3)).toUpperCase().slice(0, 4),
      color: color || "blue",
      icon: icon || "columns",
      desc: "",
      createdBy: byId,
      createdAt: Date.now(),
      archived: false,
      stages: defaultStages(),
      labels: [],
      tasks: []
    };
    Store.state.gprojects.push(p);
    this.log(byId, `created project **${p.name}** in Planner`);
    Store.save();
    return p;
  },
  updateGProject(id, patch) {
    Object.assign(D.gproject(id), patch);
    Store.save();
  },
  archiveGProject(id, byId) {
    var p = D.gproject(id);
    p.archived = true;
    p.archivedAt = Date.now();
    this.log(byId, `archived project **${p.name}**`);
    Store.save();
  },
  unarchiveGProject(id) {
    var p = D.gproject(id);
    p.archived = false;
    p.archivedAt = null;
    Store.save();
  },
  deleteGProject(id, byId) {
    var p = D.gproject(id);
    Store.state.gprojects = Store.state.gprojects.filter(x => x.id !== id);
    this.log(byId, `deleted project **${p.name}**`);
    Store.save();
  },
  /* stages (status columns) */
  addGStage(pid, name, byId) {
    var p = D.gproject(pid);
    var st = {
      id: uid("gs"),
      name: name || "New status",
      color: GP_COLORS[p.stages.length % GP_COLORS.length],
      done: false
    };
    // insert before a trailing done stage if present
    var doneIdx = p.stages.findIndex(s => s.done);
    if (doneIdx >= 0) p.stages.splice(doneIdx, 0, st);else p.stages.push(st);
    Store.save();
    return st;
  },
  updateGStage(pid, sid, patch) {
    Object.assign(D.gstage(D.gproject(pid), sid), patch);
    Store.save();
  },
  moveGStage(pid, sid, dir) {
    var arr = D.gproject(pid).stages;
    var i = arr.findIndex(s => s.id === sid),
      j = i + dir;
    if (i < 0 || j < 0 || j >= arr.length) return false;
    var _ref5 = [arr[j], arr[i]];
    arr[i] = _ref5[0];
    arr[j] = _ref5[1];
    Store.save();
    return true;
  },
  deleteGStage(pid, sid) {
    var p = D.gproject(pid);
    if (p.stages.length <= 1) return false;
    var idx = p.stages.findIndex(s => s.id === sid);
    var fallback = p.stages[idx === 0 ? 1 : idx - 1].id;
    p.tasks.forEach(t => {
      if (t.stageId === sid) t.stageId = fallback;
    });
    p.stages = p.stages.filter(s => s.id !== sid);
    Store.save();
    return true;
  },
  /* tasks */
  addGTask(pid, {
    title,
    stageId,
    assigneeId,
    due,
    priority
  }, byId) {
    var _D$member4;
    var p = D.gproject(pid);
    var stage = stageId || p.stages[0] && p.stages[0].id;
    var maxOrd = Math.max(-1, ...p.tasks.filter(t => t.stageId === stage).map(t => t.ord));
    var t = {
      id: uid("gt"),
      title: title || "Untitled task",
      desc: "",
      stageId: stage,
      assigneeId: assigneeId || null,
      due: due || null,
      start: null,
      priority: priority || "normal",
      labelIds: [],
      subtasks: [],
      comments: [],
      createdBy: byId,
      createdAt: Date.now(),
      ord: maxOrd + 1
    };
    p.tasks.push(t);
    if (t.assigneeId && t.assigneeId !== byId) this.notify(t.assigneeId, {
      type: "task",
      text: `${((_D$member4 = D.member(byId)) === null || _D$member4 === void 0 ? void 0 : _D$member4.name) || "Someone"} assigned you “${t.title}” in ${p.name}`,
      gprojectId: p.id,
      gtaskId: t.id
    }, byId);
    Store.save();
    return t;
  },
  updateGTask(pid, taskId, patch, byId) {
    var _D$member5;
    var p = D.gproject(pid);
    var t = D.gtask(p, taskId);
    var reassigned = "assigneeId" in patch && patch.assigneeId !== t.assigneeId ? patch.assigneeId : null;
    Object.assign(t, patch);
    if (reassigned && reassigned !== byId) this.notify(reassigned, {
      type: "task",
      text: `${((_D$member5 = D.member(byId)) === null || _D$member5 === void 0 ? void 0 : _D$member5.name) || "Someone"} assigned you “${t.title}” in ${p.name}`,
      gprojectId: p.id,
      gtaskId: t.id
    }, byId);
    Store.save();
  },
  moveGTask(pid, taskId, stageId, ord) {
    var p = D.gproject(pid);
    var t = D.gtask(p, taskId);
    t.stageId = stageId;
    if (ord != null) t.ord = ord;
    Store.save();
  },
  /* place a task into a stage before beforeId (or at end), renumbering that stage */
  placeGTask(pid, taskId, stageId, beforeId, byId) {
    var p = D.gproject(pid);
    var t = D.gtask(p, taskId);
    var wasDone = D.gTaskDone(p, t);
    t.stageId = stageId;
    var inStage = p.tasks.filter(x => x.stageId === stageId && x.id !== taskId).sort((a, b) => a.ord - b.ord);
    var idx = beforeId ? inStage.findIndex(x => x.id === beforeId) : inStage.length;
    if (idx < 0) idx = inStage.length;
    inStage.splice(idx, 0, t);
    inStage.forEach((x, i) => x.ord = i);
    var nowDone = D.gTaskDone(p, t);
    if (byId && nowDone && !wasDone) this.log(byId, `completed task **${t.title}** in ${p.name}`, {});
    Store.save();
  },
  deleteGTask(pid, taskId) {
    var p = D.gproject(pid);
    p.tasks = p.tasks.filter(t => t.id !== taskId);
    Store.save();
  },
  addSubtask(pid, taskId, title) {
    var t = D.gtask(D.gproject(pid), taskId);
    t.subtasks.push({
      id: uid("gk"),
      title,
      done: false
    });
    Store.save();
  },
  toggleSubtask(pid, taskId, subId) {
    var t = D.gtask(D.gproject(pid), taskId);
    var s = t.subtasks.find(x => x.id === subId);
    if (s) s.done = !s.done;
    Store.save();
  },
  deleteSubtask(pid, taskId, subId) {
    var t = D.gtask(D.gproject(pid), taskId);
    t.subtasks = t.subtasks.filter(x => x.id !== subId);
    Store.save();
  },
  /* ---- working hours ---- */
  setShift(patch, byId) {
    var sh = _objectSpread(_objectSpread({}, D.shift()), patch);
    Store.state.shift = sh;
    D.__spanKey = null; // drop the memoised spans
    this.log(byId, `changed the working hours — ${sh.start}–${sh.end}, ${(sh.breaks || []).length} breaks`);
    Store.save();
  },
  /* ---- permissions (managers only; the manager row is not editable) ---- */
  setPerm(role, cap, on, byId) {
    if (role === "manager") return;
    if (!Store.state.perms) Store.state.perms = JSON.parse(JSON.stringify(DEFAULT_PERMS));
    if (!Store.state.perms[role]) Store.state.perms[role] = {};
    Store.state.perms[role][cap] = !!on;
    var label = (CAPS.find(c => c.id === cap) || {}).label || cap;
    this.log(byId, `${on ? "granted" : "removed"} **${label}** for ${role}s`);
    Store.save();
  },
  resetPerms(role, byId) {
    if (role === "manager") return;
    Store.state.perms[role] = _objectSpread({}, DEFAULT_PERMS[role] || DEFAULT_PERMS.worker);
    this.log(byId, `reset ${role} permissions to the defaults`);
    Store.save();
  },
  /* ---- comments on a manufacturing / engineering project ---- */
  addOrderComment(orderId, text, byId) {
    var _D$member6;
    var o = D.order(orderId);
    var body = (text || "").trim();
    if (!o || !body) return null;
    if (!Array.isArray(o.comments)) o.comments = [];
    var mentions = D.parseMentions(body);
    /* Two remarks inside the same millisecond would share a timestamp, and
       "unread since I last looked" is a > comparison against one — so the
       second would count as already read. Keep them strictly increasing. */
    var prev = o.comments.length ? o.comments[o.comments.length - 1].ts : 0;
    var ts = Math.max(Date.now(), prev + 1);
    var c = {
      id: uid("oc"),
      by: byId,
      ts,
      text: body,
      mentions
    };
    o.comments.push(c);
    this.notifyMentions(mentions, byId, body, {
      type: "mention",
      orderId: o.id
    }, `on ${o.num}`);

    /* A remark that only reaches the people somebody remembered to @ is a
       remark that gets missed. Everyone carrying the project hears about it —
       minus the author, and minus anyone already told by name. */
    var told = new Set([byId, ...(mentions || [])]);
    var who = ((_D$member6 = D.member(byId)) === null || _D$member6 === void 0 ? void 0 : _D$member6.name) || "Someone";
    var snippet = body.length > 90 ? body.slice(0, 88).trimEnd() + "…" : body;
    var _iterator96 = _createForOfIteratorHelper(D.orderResponsible(o)),
      _step96;
    try {
      for (_iterator96.s(); !(_step96 = _iterator96.n()).done;) {
        var id = _step96.value;
        if (told.has(id)) continue;
        this.notify(id, {
          type: "remark",
          orderId: o.id,
          text: `**${who}** on ${o.num}: ${snippet}`
        }, byId);
      }

      /* writing one counts as having read the thread */
    } catch (err) {
      _iterator96.e(err);
    } finally {
      _iterator96.f();
    }
    if (!o.commentsSeen) o.commentsSeen = {};
    o.commentsSeen[byId] = ts;
    this.log(byId, `remarked on ${o.num}`, {
      orderId: o.id
    });
    Store.save();
    return c;
  },
  markCommentsSeen(orderId, memberId) {
    var o = D.order(orderId);
    if (!o || !memberId || !(o.comments || []).length) return false;
    var last = o.comments[o.comments.length - 1].ts;
    if (!o.commentsSeen) o.commentsSeen = {};
    if (o.commentsSeen[memberId] === last) return false;
    o.commentsSeen[memberId] = last;
    Store.save(); // read state only — never logged
    return true;
  },
  deleteOrderComment(orderId, commentId, byId) {
    var o = D.order(orderId);
    if (!o || !o.comments) return;
    o.comments = o.comments.filter(c => c.id !== commentId);
    Store.save();
  },
  /* One notification per mentioned teammate — never to yourself. */
  notifyMentions(ids, byId, text, meta, where) {
    var _D$member7;
    var who = ((_D$member7 = D.member(byId)) === null || _D$member7 === void 0 ? void 0 : _D$member7.name) || "Someone";
    var snippet = text.length > 90 ? text.slice(0, 88).trimEnd() + "…" : text;
    var _iterator97 = _createForOfIteratorHelper(ids || []),
      _step97;
    try {
      for (_iterator97.s(); !(_step97 = _iterator97.n()).done;) {
        var id = _step97.value;
        if (id === byId) continue;
        this.notify(id, _objectSpread(_objectSpread({}, meta), {}, {
          text: `**${who}** mentioned you ${where}: ${snippet}`
        }), byId);
      }
    } catch (err) {
      _iterator97.e(err);
    } finally {
      _iterator97.f();
    }
  },
  /* ---- duplicate a Planner project ---- */
  duplicateGProject(pid, {
    name,
    copyTasks = false
  } = {}, byId) {
    var src = D.gproject(pid);
    if (!src) return null;
    var wanted = (name || "").trim() || D.uniqueName(src.name, n => D.gprojectNameTaken(n));
    if (D.gprojectNameTaken(wanted)) wanted = D.uniqueName(wanted, n => D.gprojectNameTaken(n));
    var stageMap = {};
    var p = _objectSpread(_objectSpread({}, deepCopy(src)), {}, {
      id: uid("gp"),
      name: wanted,
      archived: false,
      archivedAt: null,
      createdBy: byId,
      createdAt: Date.now(),
      stages: src.stages.map(st => {
        var id = uid("gs");
        stageMap[st.id] = id;
        return _objectSpread(_objectSpread({}, st), {}, {
          id
        });
      }),
      labels: src.labels.map(l => _objectSpread(_objectSpread({}, l), {}, {
        id: uid("gl")
      })),
      tasks: []
    });
    if (copyTasks) {
      var labelMap = {};
      src.labels.forEach((l, i) => {
        labelMap[l.id] = p.labels[i].id;
      });
      p.tasks = src.tasks.map(t => _objectSpread(_objectSpread({}, deepCopy(t)), {}, {
        id: uid("gt"),
        stageId: stageMap[t.stageId] || p.stages[0].id,
        labelIds: (t.labelIds || []).map(id => labelMap[id]).filter(Boolean),
        subtasks: (t.subtasks || []).map(x => _objectSpread(_objectSpread({}, x), {}, {
          id: uid("gsb"),
          done: false
        })),
        comments: [],
        // a copy starts its own conversation
        createdBy: byId,
        createdAt: Date.now()
      }));
    }
    Store.state.gprojects.push(p);
    this.log(byId, `copied Planner project **${src.name}** → **${p.name}**`);
    Store.save();
    return p;
  },
  addGComment(pid, taskId, text, byId) {
    var _D$member8;
    var p = D.gproject(pid);
    var t = D.gtask(p, taskId);
    var mentions = D.parseMentions(text);
    t.comments.push({
      id: uid("gc"),
      by: byId,
      ts: Date.now(),
      text,
      mentions
    });
    this.notifyMentions(mentions, byId, text, {
      type: "mention",
      gprojectId: p.id,
      gtaskId: t.id
    }, `on “${t.title}”`);
    if (t.assigneeId && t.assigneeId !== byId && !mentions.includes(t.assigneeId))
      // a mention already told them
      this.notify(t.assigneeId, {
        type: "task",
        text: `${((_D$member8 = D.member(byId)) === null || _D$member8 === void 0 ? void 0 : _D$member8.name) || "Someone"} commented on “${t.title}”`,
        gprojectId: p.id,
        gtaskId: t.id
      }, byId);
    Store.save();
  },
  /* ---------- To-dos ---------- */
  addTodo({
    text,
    forId,
    due
  }, byId) {
    var _D$member9;
    var t = {
      id: uid("td"),
      text,
      forId: forId || byId,
      by: byId,
      ts: Date.now(),
      done: false,
      doneAt: null,
      due: due || null
    };
    Store.state.todos.push(t);
    if (t.forId !== byId) this.log(byId, `added a to-do for **${((_D$member9 = D.member(t.forId)) === null || _D$member9 === void 0 ? void 0 : _D$member9.name) || "?"}**: ${text}`);
    Store.save();
    return t;
  },
  toggleTodo(id, byId) {
    var t = Store.state.todos.find(x => x.id === id);
    if (!t) return;
    t.done = !t.done;
    t.doneAt = t.done ? Date.now() : null;
    if (t.done && t.by !== t.forId) this.log(byId, `completed the to-do: ${t.text}`);
    Store.save();
  },
  updateTodo(id, patch) {
    var t = Store.state.todos.find(x => x.id === id);
    if (t) Object.assign(t, patch);
    Store.save();
  },
  deleteTodo(id) {
    Store.state.todos = Store.state.todos.filter(x => x.id !== id);
    Store.save();
  },
  /* ---------- View prefs ---------- */
  setPref(memberId, key, value) {
    var p = Store.state.prefs;
    (p[memberId] = p[memberId] || {})[key] = value;
    Store.save();
  },
  addMember({
    name,
    trade,
    role,
    pin,
    station
  }, byId) {
    var m = {
      id: uid("m"),
      name,
      trade,
      role,
      station: station || null,
      pinHash: pin ? hashPin(pin, Store.state.pinSalt) : "",
      color: Store.state.members.length % AV_COLORS.length
    };
    Store.state.members.push(m);
    this.log(byId, `added **${name}** to the team`);
    Store.save();
    return m;
  },
  updateMember(id, patch) {
    var m = D.member(id);
    if (patch.pin) {
      m.pinHash = hashPin(patch.pin, Store.state.pinSalt);
    } // never store plaintext
    delete patch.pin;
    Object.assign(m, patch);
    Store.save();
  },
  /* set / reset a member's PIN (managers only, via the member modal) */
  setPin(id, pin, byId) {
    var m = D.member(id);
    m.pinHash = hashPin(pin, Store.state.pinSalt);
    delete m.pin;
    if (byId) this.log(byId, `reset PIN for **${m.name}**`);
    Store.save();
  },
  verifyPin(id, pin) {
    var m = D.member(id);
    if (!m) return false;
    if (m.pinHash) return m.pinHash === hashPin(pin, Store.state.pinSalt);
    if (m.pin != null) {
      // legacy plaintext → verify then upgrade
      var ok = String(m.pin) === String(pin);
      if (ok) {
        m.pinHash = hashPin(pin, Store.state.pinSalt);
        delete m.pin;
        Store.save();
      }
      return ok;
    }
    return false;
  },
  removeMember(id, byId) {
    var m = D.member(id);
    var _iterator98 = _createForOfIteratorHelper(Store.state.orders),
      _step98;
    try {
      for (_iterator98.s(); !(_step98 = _iterator98.n()).done;) {
        var o = _step98.value;
        var _iterator99 = _createForOfIteratorHelper(o.ops),
          _step99;
        try {
          for (_iterator99.s(); !(_step99 = _iterator99.n()).done;) {
            var op = _step99.value;
            if (op.assigneeId === id) op.assigneeId = null;
          }
        } catch (err) {
          _iterator99.e(err);
        } finally {
          _iterator99.f();
        }
      }
    } catch (err) {
      _iterator98.e(err);
    } finally {
      _iterator98.f();
    }
    Store.state.members = Store.state.members.filter(x => x.id !== id);
    this.log(byId, `removed **${m.name}** from the team`);
    Store.save();
  }
};