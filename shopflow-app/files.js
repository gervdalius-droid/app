/* ============================================================
   files.js — drawings and photos, on the job and on the task

   WHERE THE BYTES GO, and why. Supabase Storage holds the file — that is the
   copy the whole shop reads. Two things sit in front of it:

     • IndexedDB   a local cache, so a preview is instant and a drawing still
                   opens with no network
     • a thumbnail in state, a few KB, so every device can SEE an attachment
                   before it has fetched the full thing

   State never carries the file itself: Sync.push() sends the WHOLE state
   document on every change, so a drawing living there would be re-uploaded
   every time anyone edited anything.

   An upload that fails is marked, not lost — flush() retries on boot and when
   the network returns, so a photo taken on a tablet with no signal still
   reaches the shop. With no bucket configured at all it degrades to
   local-only and says so on the file itself.
   ============================================================ */
"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Files = {
  DB: "shopflow.files",
  STORE: "blobs",
  VERSION: 1,
  MAX_BYTES: 12 * 1024 * 1024,
  // a phone photo, not a CAD archive
  FULL_PX: 2000,
  // plenty to read a dimension off a drawing
  THUMB_PX: 220,
  BUCKET: "shopflow",
  _db: null,
  _urls: new Map(),
  /* ---------- the local blob store ---------- */
  open() {
    if (this._db) return Promise.resolve(this._db);
    return new Promise((resolve, reject) => {
      var req = indexedDB.open(this.DB, this.VERSION);
      req.onupgradeneeded = () => {
        var db = req.result;
        if (!db.objectStoreNames.contains(this.STORE)) db.createObjectStore(this.STORE);
      };
      req.onsuccess = () => {
        this._db = req.result;
        resolve(this._db);
      };
      req.onerror = () => reject(req.error);
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
              var tx = db.transaction(_this.STORE, mode);
              var req = fn(tx.objectStore(_this.STORE));
              tx.onerror = () => reject(tx.error);
              if (req) req.onsuccess = () => resolve(req.result);else tx.oncomplete = () => resolve();
            }));
          case 4:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  },
  putBlob(id, blob) {
    return this._tx("readwrite", s => s.put(blob, id));
  },
  getBlob(id) {
    return this._tx("readonly", s => s.get(id));
  },
  delBlob(id) {
    return this._tx("readwrite", s => s.delete(id));
  },
  /* ---------- making a file small enough to be useful ---------- */
  isImage: type => /^image\//.test(type || ""),
  _draw(file, maxPx, quality) {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var bmp, scale, w, h, canvas, blob;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return createImageBitmap(file);
          case 2:
            bmp = _context2.sent;
            scale = Math.min(1, maxPx / Math.max(bmp.width, bmp.height));
            w = Math.max(1, Math.round(bmp.width * scale));
            h = Math.max(1, Math.round(bmp.height * scale));
            canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            canvas.getContext("2d").drawImage(bmp, 0, 0, w, h);
            bmp.close && bmp.close();
            _context2.next = 13;
            return new Promise(r => canvas.toBlob(r, "image/jpeg", quality));
          case 13:
            blob = _context2.sent;
            return _context2.abrupt("return", {
              blob,
              w,
              h,
              dataUrl: canvas.toDataURL("image/jpeg", quality)
            });
          case 15:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  },
  /* ---------- attaching ---------- */
  attach(file, {
    orderId = null,
    opId = null
  } = {}, byId) {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var id, blob, w, h, thumb, full, meta;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            if (file) {
              _context3.next = 2;
              break;
            }
            return _context3.abrupt("return", null);
          case 2:
            if (!(file.size > _this2.MAX_BYTES)) {
              _context3.next = 4;
              break;
            }
            throw new Error(`${file.name} is ${Math.round(file.size / 1048576)} MB — the limit is ${_this2.MAX_BYTES / 1048576} MB`);
          case 4:
            id = uid("f");
            blob = file, w = null, h = null, thumb = "";
            if (!_this2.isImage(file.type)) {
              _context3.next = 16;
              break;
            }
            _context3.next = 9;
            return _this2._draw(file, _this2.FULL_PX, 0.85);
          case 9:
            full = _context3.sent;
            if (full.blob && full.blob.size < file.size) blob = full.blob;
            w = full.w;
            h = full.h;
            _context3.next = 15;
            return _this2._draw(file, _this2.THUMB_PX, 0.7);
          case 15:
            thumb = _context3.sent.dataUrl;
          case 16:
            _context3.next = 18;
            return _this2.putBlob(id, blob);
          case 18:
            // cached locally so the preview is instant
            meta = M.addFileMeta({
              id,
              name: file.name,
              type: file.type || "application/octet-stream",
              size: blob.size,
              w,
              h,
              thumb,
              orderId,
              opId,
              path: _this2.path(id),
              store: _this2.storage() ? "uploading" : "local",
              devices: [_this2.deviceId()]
            }, byId);
            if (_this2.storage()) _this2.upload(id, blob); // resolves the status either way
            return _context3.abrupt("return", meta);
          case 21:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  },
  /* ---------- uploading ----------
     Storage is where an attachment really lives; IndexedDB is a cache in front
     of it. An upload that fails is not lost — it is marked and retried, so a
     drawing added on a tablet with no signal still reaches the shop later. */
  upload(id, blob) {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var st, meta, _yield$st$upload, error;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            st = _this3.storage();
            if (st) {
              _context4.next = 3;
              break;
            }
            return _context4.abrupt("return", false);
          case 3:
            _context4.prev = 3;
            if (blob) {
              _context4.next = 8;
              break;
            }
            _context4.next = 7;
            return _this3.getBlob(id);
          case 7:
            blob = _context4.sent;
          case 8:
            if (blob) {
              _context4.next = 11;
              break;
            }
            M.setFileStore(id, "missing");
            return _context4.abrupt("return", false);
          case 11:
            meta = D.file(id);
            _context4.next = 14;
            return st.upload(_this3.path(id), blob, {
              upsert: true,
              contentType: meta && meta.type || blob.type || "application/octet-stream"
            });
          case 14:
            _yield$st$upload = _context4.sent;
            error = _yield$st$upload.error;
            if (!error) {
              _context4.next = 18;
              break;
            }
            throw error;
          case 18:
            M.setFileStore(id, "stored");
            if (typeof App !== "undefined" && App.me) App.render();
            return _context4.abrupt("return", true);
          case 23:
            _context4.prev = 23;
            _context4.t0 = _context4["catch"](3);
            M.setFileStore(id, "pending", _context4.t0 && _context4.t0.message || "upload failed");
            if (typeof App !== "undefined" && App.me) App.render();
            return _context4.abrupt("return", false);
          case 28:
          case "end":
            return _context4.stop();
        }
      }, _callee4, null, [[3, 23]]);
    }))();
  },
  /* Anything that never made it up, tried again — on boot and when the network
     comes back. Only files this device actually holds can be retried. */
  flush() {
    var _this4 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var n, _iterator, _step, f;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (_this4.storage()) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return", 0);
          case 2:
            n = 0;
            _iterator = _createForOfIteratorHelper(D.files());
            _context5.prev = 4;
            _iterator.s();
          case 6:
            if ((_step = _iterator.n()).done) {
              _context5.next = 16;
              break;
            }
            f = _step.value;
            if (!(f.store === "stored" || !_this4.here(f))) {
              _context5.next = 10;
              break;
            }
            return _context5.abrupt("continue", 14);
          case 10:
            _context5.next = 12;
            return _this4.upload(f.id);
          case 12:
            if (!_context5.sent) {
              _context5.next = 14;
              break;
            }
            n++;
          case 14:
            _context5.next = 6;
            break;
          case 16:
            _context5.next = 21;
            break;
          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](4);
            _iterator.e(_context5.t0);
          case 21:
            _context5.prev = 21;
            _iterator.f();
            return _context5.finish(21);
          case 24:
            return _context5.abrupt("return", n);
          case 25:
          case "end":
            return _context5.stop();
        }
      }, _callee5, null, [[4, 18, 21, 24]]);
    }))();
  },
  boot() {
    if (typeof window === "undefined") return;
    window.addEventListener("online", () => this.flush());
    setTimeout(() => this.flush(), 4000); // after sync has had a chance to sign in
  },
  /* Which device holds the full copy. Not identity — just "was it this one". */
  DEV_KEY: "shopflow.device",
  deviceId() {
    var d = localStorage.getItem(this.DEV_KEY);
    if (!d) {
      d = uid("dev");
      localStorage.setItem(this.DEV_KEY, d);
    }
    return d;
  },
  here(meta) {
    return (meta.devices || []).includes(this.deviceId());
  },
  /* ---------- the copy that travels ---------- */
  storage() {
    if (typeof Sync === "undefined" || !Sync.configured() || !Sync.client || App._localOnly) return null;
    return Sync.client.storage.from(this.BUCKET);
  },
  path(id) {
    return `${typeof SYNC_CONFIG !== "undefined" && SYNC_CONFIG.workspace || "shop"}/${id}`;
  },
  /* Local first — it is instant and works with no network. Then the bucket. */
  url(id) {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var blob, _u, st, _yield$st$download, data, error, u;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            if (!_this5._urls.has(id)) {
              _context6.next = 2;
              break;
            }
            return _context6.abrupt("return", _this5._urls.get(id));
          case 2:
            _context6.next = 4;
            return _this5.getBlob(id).catch(() => null);
          case 4:
            blob = _context6.sent;
            if (!blob) {
              _context6.next = 9;
              break;
            }
            _u = URL.createObjectURL(blob);
            _this5._urls.set(id, _u);
            return _context6.abrupt("return", _u);
          case 9:
            st = _this5.storage();
            if (st) {
              _context6.next = 12;
              break;
            }
            return _context6.abrupt("return", null);
          case 12:
            _context6.next = 14;
            return st.download(_this5.path(id));
          case 14:
            _yield$st$download = _context6.sent;
            data = _yield$st$download.data;
            error = _yield$st$download.error;
            if (!(error || !data)) {
              _context6.next = 19;
              break;
            }
            return _context6.abrupt("return", null);
          case 19:
            _context6.next = 21;
            return _this5.putBlob(id, data).catch(() => {});
          case 21:
            // keep it for next time
            M.markFileHere(id);
            u = URL.createObjectURL(data);
            _this5._urls.set(id, u);
            return _context6.abrupt("return", u);
          case 25:
          case "end":
            return _context6.stop();
        }
      }, _callee6);
    }))();
  },
  remove(id, byId) {
    var _this6 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var st, _yield$st$remove, error;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            st = _this6.storage();
            if (!st) {
              _context7.next = 9;
              break;
            }
            _context7.next = 4;
            return st.remove([_this6.path(id)]);
          case 4:
            _yield$st$remove = _context7.sent;
            error = _yield$st$remove.error;
            if (!(error && D.file(id) && D.file(id).store === "stored")) {
              _context7.next = 9;
              break;
            }
            Toast.show("Could not remove it from the shop's storage — try again when you are online", {
              emoji: "alert",
              ms: 5000
            });
            return _context7.abrupt("return", false);
          case 9:
            _context7.next = 11;
            return _this6.delBlob(id).catch(() => {});
          case 11:
            if (_this6._urls.has(id)) {
              URL.revokeObjectURL(_this6._urls.get(id));
              _this6._urls.delete(id);
            }
            M.removeFile(id, byId);
            return _context7.abrupt("return", true);
          case 14:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  },
  /* ---------- previews ---------- */
  chipsHtml(files, {
    canEdit = false
  } = {}) {
    if (!files.length) return "";
    return `<div class="file-chips">
      ${files.map(f => `<button class="file-chip ${this.isImage(f.type) ? "img" : "doc"}" data-file="${f.id}" title="${esc(f.name)}">
        ${f.thumb ? `<img src="${f.thumb}" alt="${esc(f.name)}">` : `<span class="ico">${icon(/pdf/.test(f.type) ? "quote" : "box", 18)}</span>`}
        <span class="nm">${esc(f.name)}</span>
        ${this.stateHtml(f)}
        ${canEdit ? `<span class="rm" data-file-rm="${f.id}" title="Remove">${icon("x", 11)}</span>` : ""}
      </button>`).join("")}
    </div>`;
  },
  /* Where this file actually is. Silence means "in the shop's storage, where
     everyone can reach it" — the only state that needs no explanation. */
  stateHtml(f) {
    if (f.store === "stored") return "";
    if (f.store === "uploading") return `<span class="f-state up" title="Uploading…">${icon("arrow-up", 10)}</span>`;
    if (f.store === "pending") return `<span class="f-state wait" title="${esc(f.storeNote || "Waiting to upload")}">${icon("cloud-off", 10)}</span>`;
    if (f.store === "missing") return `<span class="f-state gone" title="The file is not on this device">${icon("alert", 10)}</span>`;
    return `<span class="f-state wait" title="On this device only — set up storage to share it">${icon("cloud-off", 10)}</span>`;
  },
  dropHtml(id, label = "Add a drawing or photo") {
    return `<div class="file-drop" data-drop="${id}">
      <span class="ico">${icon("import", 17)}</span>
      <span><b>${esc(label)}</b><span class="t-caption">Drop it here, or click to choose — images are shrunk to fit</span></span>
      <input type="file" id="${id}" multiple accept="image/*,application/pdf" hidden>
    </div>`;
  },
  /* Wires a drop zone. onPick receives the chosen File list. */
  bindDrop(root, id, onPick) {
    var zone = $(`[data-drop="${id}"]`, root),
      input = $("#" + id, root);
    if (!zone || !input) return;
    zone.onclick = () => input.click();
    zone.ondragover = e => {
      e.preventDefault();
      zone.classList.add("over");
    };
    zone.ondragleave = () => zone.classList.remove("over");
    zone.ondrop = e => {
      e.preventDefault();
      zone.classList.remove("over");
      if (e.dataTransfer.files.length) onPick([...e.dataTransfer.files]);
    };
    input.onchange = () => {
      if (input.files.length) onPick([...input.files]);
      input.value = "";
    };
  },
  bindChips(root, {
    onRemove
  } = {}) {
    $$("[data-file]", root).forEach(b => b.onclick = e => {
      if (e.target.closest("[data-file-rm]")) return;
      this.viewer(b.dataset.file);
    });
    $$("[data-file-rm]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var f = D.file(b.dataset.fileRm);
      if (!f || !confirm(`Remove ${f.name}?`)) return;
      this.remove(f.id, App.me.id).then(() => {
        App.render();
        if (onRemove) onRemove();
      });
    });
  },
  /* Full-screen, because a drawing you cannot read is not an attachment. */
  viewer(id) {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var f, root, url, body;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            f = D.file(id);
            if (f) {
              _context8.next = 3;
              break;
            }
            return _context8.abrupt("return");
          case 3:
            root = $("#modal-root");
            root.innerHTML = `<div class="file-view" id="file-view">
      <div class="fv-bar">
        <b>${esc(f.name)}</b>
        <span class="t-caption">${f.w ? `${f.w}×${f.h} · ` : ""}${Math.round(f.size / 1024)} KB</span>
        <span class="grow"></span>
        <a class="btn ghost" id="fv-dl" download="${esc(f.name)}">Download</a>
        <button class="icon-btn" id="fv-close">${icon("x", 17)}</button>
      </div>
      <div class="fv-body" id="fv-body">
        ${f.thumb ? `<img src="${f.thumb}" class="fv-blur" alt="">` : ""}
        <div class="sync-spinner"></div>
      </div>
    </div>`;
            $("#fv-close", root).onclick = () => {
              root.innerHTML = "";
            };
            $("#file-view", root).onclick = e => {
              if (e.target.id === "file-view") root.innerHTML = "";
            };
            _context8.next = 9;
            return _this7.url(id);
          case 9:
            url = _context8.sent;
            body = $("#fv-body", root);
            if (body) {
              _context8.next = 13;
              break;
            }
            return _context8.abrupt("return");
          case 13:
            if (url) {
              _context8.next = 16;
              break;
            }
            body.innerHTML = `<div class="fv-missing">${icon("cloud-off", 26)}
        <b>The full file is not on this device</b>
        <span>${_this7.storage() ? "It was added on another device and has not finished uploading there yet." : "It was added on another device, and the shop's file storage is not set up — see SETUP-CLOUD.md."}</span>
        ${f.thumb ? `<img src="${f.thumb}" alt="${esc(f.name)}">` : ""}</div>`;
            return _context8.abrupt("return");
          case 16:
            $("#fv-dl", root).href = url;
            body.innerHTML = _this7.isImage(f.type) ? `<img src="${url}" alt="${esc(f.name)}">` : `<iframe src="${url}" title="${esc(f.name)}"></iframe>`;
          case 18:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }))();
  }
};