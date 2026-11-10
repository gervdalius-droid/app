/* ============================================================
   ShopFlow — SWOOD "Report Lists to Excel" import
   Turns a SWOOD export straight into a manufacturing project:
   parts, per-material quantities, a production route, and the
   material + hardware lines the job will consume.

   No libraries: an .xlsx/.xlsm is a ZIP of XML, and browsers can
   inflate on their own (DecompressionStream) and parse XML with
   DOMParser. That keeps the shopfloor working offline.
   ============================================================ */
"use strict";

/* ---------- minimal XLSX reader ---------- */
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var XLSX = {
  /* Read the ZIP central directory. Only the entries we ask for are
     inflated, so a 3 MB workbook of 560 files costs us five sheets. */
  open(buf) {
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var dv, u8, eocd, i, count, dirOff, _i, z64, files, p, _i2, method, csize, nameLen, extraLen, cmtLen, local, name;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            dv = new DataView(buf), u8 = new Uint8Array(buf); // End of Central Directory: scan back from the tail (max 64k comment)
            eocd = -1;
            i = u8.length - 22;
          case 3:
            if (!(i >= Math.max(0, u8.length - 65558))) {
              _context.next = 10;
              break;
            }
            if (!(dv.getUint32(i, true) === 0x06054b50)) {
              _context.next = 7;
              break;
            }
            eocd = i;
            return _context.abrupt("break", 10);
          case 7:
            i--;
            _context.next = 3;
            break;
          case 10:
            if (!(eocd < 0)) {
              _context.next = 12;
              break;
            }
            throw new Error("Not a valid .xlsx/.xlsm file (no ZIP directory)");
          case 12:
            count = dv.getUint16(eocd + 10, true);
            dirOff = dv.getUint32(eocd + 16, true); // ZIP64 fallback — a big workbook stores the real offsets in a locator
            if (!(dirOff === 0xffffffff || count === 0xffff)) {
              _context.next = 25;
              break;
            }
            _i = eocd - 20;
          case 16:
            if (!(_i >= 0)) {
              _context.next = 25;
              break;
            }
            if (!(dv.getUint32(_i, true) === 0x07064b50)) {
              _context.next = 22;
              break;
            }
            z64 = Number(dv.getBigUint64(_i + 8, true));
            count = Number(dv.getBigUint64(z64 + 32, true));
            dirOff = Number(dv.getBigUint64(z64 + 48, true));
            return _context.abrupt("break", 25);
          case 22:
            _i--;
            _context.next = 16;
            break;
          case 25:
            files = new Map();
            p = dirOff;
            _i2 = 0;
          case 28:
            if (!(_i2 < count && p + 46 <= u8.length)) {
              _context.next = 43;
              break;
            }
            if (!(dv.getUint32(p, true) !== 0x02014b50)) {
              _context.next = 31;
              break;
            }
            return _context.abrupt("break", 43);
          case 31:
            method = dv.getUint16(p + 10, true);
            csize = dv.getUint32(p + 20, true);
            nameLen = dv.getUint16(p + 28, true);
            extraLen = dv.getUint16(p + 30, true);
            cmtLen = dv.getUint16(p + 32, true);
            local = dv.getUint32(p + 42, true);
            name = new TextDecoder().decode(u8.subarray(p + 46, p + 46 + nameLen));
            files.set(name, {
              method,
              csize,
              local
            });
            p += 46 + nameLen + extraLen + cmtLen;
          case 40:
            _i2++;
            _context.next = 28;
            break;
          case 43:
            return _context.abrupt("return", new XlsxFile(buf, dv, u8, files));
          case 44:
          case "end":
            return _context.stop();
        }
      }, _callee);
    }))();
  }
};
class XlsxFile {
  constructor(buf, dv, u8, files) {
    this.buf = buf;
    this.dv = dv;
    this.u8 = u8;
    this.files = files;
    this._shared = null;
    this._sheets = null;
  }
  raw(name) {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      var e, nameLen, extraLen, start, bytes, stream;
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            e = _this.files.get(name);
            if (e) {
              _context2.next = 3;
              break;
            }
            return _context2.abrupt("return", null);
          case 3:
            // the local header repeats the name/extra lengths — the central copy lies
            nameLen = _this.dv.getUint16(e.local + 26, true);
            extraLen = _this.dv.getUint16(e.local + 28, true);
            start = e.local + 30 + nameLen + extraLen;
            bytes = _this.u8.subarray(start, start + e.csize);
            if (!(e.method === 0)) {
              _context2.next = 9;
              break;
            }
            return _context2.abrupt("return", new TextDecoder().decode(bytes));
          case 9:
            if (!(e.method !== 8)) {
              _context2.next = 11;
              break;
            }
            throw new Error("Unsupported compression in the workbook");
          case 11:
            stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
            return _context2.abrupt("return", new Response(stream).text());
          case 13:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }))();
  }
  xml(name) {
    var _this2 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      var text;
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return _this2.raw(name);
          case 2:
            text = _context3.sent;
            if (!(text == null)) {
              _context3.next = 5;
              break;
            }
            return _context3.abrupt("return", null);
          case 5:
            return _context3.abrupt("return", new DOMParser().parseFromString(text, "application/xml"));
          case 6:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }))();
  }

  /* sheet name → part path, via workbook.xml + its rels */
  sheetIndex() {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
      var wb, rels, target, _iterator, _step, r, map, _iterator2, _step2, s, rid, t;
      return _regeneratorRuntime().wrap(function _callee4$(_context4) {
        while (1) switch (_context4.prev = _context4.next) {
          case 0:
            if (!_this3._sheets) {
              _context4.next = 2;
              break;
            }
            return _context4.abrupt("return", _this3._sheets);
          case 2:
            _context4.next = 4;
            return _this3.xml("xl/workbook.xml");
          case 4:
            wb = _context4.sent;
            _context4.next = 7;
            return _this3.xml("xl/_rels/workbook.xml.rels");
          case 7:
            rels = _context4.sent;
            if (!(!wb || !rels)) {
              _context4.next = 10;
              break;
            }
            throw new Error("Workbook is missing its index");
          case 10:
            target = {};
            _iterator = _createForOfIteratorHelper(rels.getElementsByTagName("Relationship"));
            try {
              for (_iterator.s(); !(_step = _iterator.n()).done;) {
                r = _step.value;
                target[r.getAttribute("Id")] = r.getAttribute("Target");
              }
            } catch (err) {
              _iterator.e(err);
            } finally {
              _iterator.f();
            }
            map = new Map();
            _iterator2 = _createForOfIteratorHelper(wb.getElementsByTagName("sheet"));
            try {
              for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
                s = _step2.value;
                rid = s.getAttribute("r:id") || s.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships", "id");
                t = target[rid] || "";
                if (t && !t.startsWith("xl/")) t = "xl/" + t.replace(/^\/?/, "");
                map.set(s.getAttribute("name"), t);
              }
            } catch (err) {
              _iterator2.e(err);
            } finally {
              _iterator2.f();
            }
            return _context4.abrupt("return", _this3._sheets = map);
          case 17:
          case "end":
            return _context4.stop();
        }
      }, _callee4);
    }))();
  }
  sharedStrings() {
    var _this4 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
      var doc, out, _iterator3, _step3, si, s, _iterator4, _step4, t;
      return _regeneratorRuntime().wrap(function _callee5$(_context5) {
        while (1) switch (_context5.prev = _context5.next) {
          case 0:
            if (!_this4._shared) {
              _context5.next = 2;
              break;
            }
            return _context5.abrupt("return", _this4._shared);
          case 2:
            _context5.next = 4;
            return _this4.xml("xl/sharedStrings.xml");
          case 4:
            doc = _context5.sent;
            out = [];
            if (doc) {
              _iterator3 = _createForOfIteratorHelper(doc.getElementsByTagName("si"));
              try {
                for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                  si = _step3.value;
                  s = ""; // rich text = several <t> runs
                  _iterator4 = _createForOfIteratorHelper(si.getElementsByTagName("t"));
                  try {
                    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                      t = _step4.value;
                      s += t.textContent;
                    }
                  } catch (err) {
                    _iterator4.e(err);
                  } finally {
                    _iterator4.f();
                  }
                  out.push(s);
                }
              } catch (err) {
                _iterator3.e(err);
              } finally {
                _iterator3.f();
              }
            }
            return _context5.abrupt("return", _this4._shared = out);
          case 8:
          case "end":
            return _context5.stop();
        }
      }, _callee5);
    }))();
  }
  static col(ref) {
    // "AH12" → 33 (0-based)
    var n = 0;
    for (var i = 0; i < ref.length; i++) {
      var c = ref.charCodeAt(i);
      if (c < 65 || c > 90) break;
      n = n * 26 + (c - 64);
    }
    return n - 1;
  }

  /* → array of rows, each a sparse array of strings/numbers */
  rows(sheetName, maxRows = 100000) {
    var _this5 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
      var idx, path, doc, shared, out, _iterator5, _step5, row, r, cells, _iterator6, _step6, c, ci, t, v, _iterator7, _step7, tt, _shared$parseInt, vn, n, i;
      return _regeneratorRuntime().wrap(function _callee6$(_context6) {
        while (1) switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return _this5.sheetIndex();
          case 2:
            idx = _context6.sent;
            path = idx.get(sheetName);
            if (path) {
              _context6.next = 6;
              break;
            }
            return _context6.abrupt("return", null);
          case 6:
            _context6.next = 8;
            return _this5.xml(path);
          case 8:
            doc = _context6.sent;
            _context6.next = 11;
            return _this5.sharedStrings();
          case 11:
            shared = _context6.sent;
            if (doc) {
              _context6.next = 14;
              break;
            }
            return _context6.abrupt("return", null);
          case 14:
            out = [];
            _iterator5 = _createForOfIteratorHelper(doc.getElementsByTagName("row"));
            _context6.prev = 16;
            _iterator5.s();
          case 18:
            if ((_step5 = _iterator5.n()).done) {
              _context6.next = 65;
              break;
            }
            row = _step5.value;
            r = parseInt(row.getAttribute("r") || "0", 10);
            if (!(r > maxRows)) {
              _context6.next = 23;
              break;
            }
            return _context6.abrupt("break", 65);
          case 23:
            cells = [];
            _iterator6 = _createForOfIteratorHelper(row.getElementsByTagName("c"));
            _context6.prev = 25;
            _iterator6.s();
          case 27:
            if ((_step6 = _iterator6.n()).done) {
              _context6.next = 54;
              break;
            }
            c = _step6.value;
            ci = XlsxFile.col(c.getAttribute("r") || "A1");
            t = c.getAttribute("t");
            v = void 0;
            if (!(t === "inlineStr")) {
              _context6.next = 38;
              break;
            }
            v = "";
            _iterator7 = _createForOfIteratorHelper(c.getElementsByTagName("t"));
            try {
              for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
                tt = _step7.value;
                v += tt.textContent;
              }
            } catch (err) {
              _iterator7.e(err);
            } finally {
              _iterator7.f();
            }
            _context6.next = 51;
            break;
          case 38:
            vn = c.getElementsByTagName("v")[0];
            if (vn) {
              _context6.next = 41;
              break;
            }
            return _context6.abrupt("continue", 52);
          case 41:
            v = vn.textContent;
            if (!(t === "s")) {
              _context6.next = 46;
              break;
            }
            v = (_shared$parseInt = shared[parseInt(v, 10)]) !== null && _shared$parseInt !== void 0 ? _shared$parseInt : "";
            _context6.next = 51;
            break;
          case 46:
            if (!(t === "e")) {
              _context6.next = 50;
              break;
            }
            return _context6.abrupt("continue", 52);
          case 50:
            if (t !== "str") {
              n = Number(v);
              if (!Number.isNaN(n)) v = n;
            }
          case 51:
            if (v !== "" && v != null) cells[ci] = v;
          case 52:
            _context6.next = 27;
            break;
          case 54:
            _context6.next = 59;
            break;
          case 56:
            _context6.prev = 56;
            _context6.t0 = _context6["catch"](25);
            _iterator6.e(_context6.t0);
          case 59:
            _context6.prev = 59;
            _iterator6.f();
            return _context6.finish(59);
          case 62:
            out[r - 1] = cells;
          case 63:
            _context6.next = 18;
            break;
          case 65:
            _context6.next = 70;
            break;
          case 67:
            _context6.prev = 67;
            _context6.t1 = _context6["catch"](16);
            _iterator5.e(_context6.t1);
          case 70:
            _context6.prev = 70;
            _iterator5.f();
            return _context6.finish(70);
          case 73:
            for (i = 0; i < out.length; i++) if (!out[i]) out[i] = [];
            return _context6.abrupt("return", out);
          case 75:
          case "end":
            return _context6.stop();
        }
      }, _callee6, null, [[16, 67, 70, 73], [25, 56, 59, 62]]);
    }))();
  }
}

/* ============================================================
   SWOOD report-list → a manufacturing plan
   ============================================================ */
var SWOOD = {
  SHEETS: {
    parts: "PARTLIST",
    stock: "STOCK_CORE",
    edge: "EDGEBAND",
    hw: "HARDWARE_LIST"
  },
  /* strip diacritics + case so "DETALĖS KODAS" matches "detales kodas" */
  norm: s => String(s !== null && s !== void 0 ? s : "").normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toUpperCase(),
  num(v) {
    var n = typeof v === "number" ? v : parseFloat(String(v !== null && v !== void 0 ? v : "").replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  },
  parse(buf) {
    var _this6 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
      var wb, warn, rows, hRow, cCode, r, i, H, foundBy, byName, cQty, C, project, _r, row, _i3, parts, section, _r2, _row$C$board, _row$C$solid, _row$C$notes, _row, code, name, len, wid, banner, edges, board, dup, boards, edgeband, hardware;
      return _regeneratorRuntime().wrap(function _callee7$(_context7) {
        while (1) switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return XLSX.open(buf);
          case 2:
            wb = _context7.sent;
            warn = [];
            _context7.next = 6;
            return wb.rows(_this6.SHEETS.parts);
          case 6:
            rows = _context7.sent;
            if (rows) {
              _context7.next = 9;
              break;
            }
            throw new Error("No PARTLIST sheet — is this a SWOOD “Report Lists to Excel” export?");
          case 9:
            /* ---- header row: located by name, so extra columns can't shift us ---- */
            hRow = -1, cCode = -1;
            r = 0;
          case 11:
            if (!(r < Math.min(rows.length, 40))) {
              _context7.next = 20;
              break;
            }
            i = (rows[r] || []).findIndex(v => _this6.norm(v) === "DETALES KODAS");
            if (!(i >= 0)) {
              _context7.next = 17;
              break;
            }
            hRow = r;
            cCode = i;
            return _context7.abrupt("break", 20);
          case 17:
            r++;
            _context7.next = 11;
            break;
          case 20:
            if (!(hRow < 0)) {
              _context7.next = 22;
              break;
            }
            throw new Error("PARTLIST has no “DETALĖS KODAS” column — unexpected SWOOD template");
          case 22:
            /* ---- columns: by NAME first, position only as a last resort ----
               These used to be fixed offsets from DETALĖS KODAS, on the assumption
               that the block is always code, name, board, L, W, KIEKIS, F, B, L, R.
               A template with one extra column — a thickness, say — shifts every
               offset, and the piece count then silently reads whatever sits where
               KIEKIS was expected. So each column is looked up by its own header and
               only falls back to the offset when the name is missing.
                The exception is L: the sheet has TWO columns called "L", the panel
               length and the left-hand edge. They are told apart by position — the
               length comes before KIEKIS, the edge after it. */
            H = (rows[hRow] || []).map(v => _this6.norm(v));
            foundBy = {};
            byName = (key, names, fallback, lo, hi) => {
              var _iterator8 = _createForOfIteratorHelper(names),
                _step8;
              try {
                var _loop = function _loop() {
                    var n = _step8.value;
                    var i = H.findIndex((h, idx) => h === n && (lo === undefined || idx > lo) && (hi === undefined || idx < hi));
                    if (i >= 0) {
                      foundBy[key] = H[i];
                      return {
                        v: i
                      };
                    }
                  },
                  _ret;
                for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
                  _ret = _loop();
                  if (_ret) return _ret.v;
                }
              } catch (err) {
                _iterator8.e(err);
              } finally {
                _iterator8.f();
              }
              foundBy[key] = null; // nothing named it; we are guessing
              return fallback;
            };
            cQty = byName("qty", ["KIEKIS", "QTY", "QUANTITY", "PCS"], cCode + 5, cCode);
            C = {
              code: cCode,
              solid: byName("solid", ["SOLIDNAME", "SOLID NAME"], cCode - 1),
              name: byName("name", ["DETALE", "DETAIL", "PART NAME"], cCode + 1, cCode),
              board: byName("board", ["PLOKSTE", "BOARD", "MATERIAL", "PANEL"], cCode + 2, cCode),
              len: byName("len", ["L", "ILGIS", "LENGTH"], cCode + 3, cCode, cQty),
              wid: byName("wid", ["W", "PLOTIS", "WIDTH"], cCode + 4, cCode, cQty),
              qty: cQty,
              eF: cQty + 1,
              eB: cQty + 2,
              eL: cQty + 3,
              eR: cQty + 4,
              notes: byName("notes", ["NOTES", "PASTABOS", "PASTABA"], cCode + 11)
            };
            foundBy.code = H[cCode] || null;
            /* The piece count is the one that changes what the shop makes, so if it
               was guessed rather than found, say so on the preview. */
            if (!foundBy.qty) warn.push(`No “KIEKIS” column header — piece counts were read from column ${C.qty + 1}, which may be wrong`);

            /* ---- project code ---- */
            project = "";
            _r = 0;
          case 31:
            if (!(_r < hRow)) {
              _context7.next = 41;
              break;
            }
            row = rows[_r] || [];
            _i3 = row.findIndex(v => _this6.norm(v).startsWith("PROJEKTAS") || _this6.norm(v) === "PROJECT");
            if (!(_i3 >= 0)) {
              _context7.next = 38;
              break;
            }
            project = String(row.slice(_i3 + 1).find(v => v) || "").trim();
            if (!project) {
              _context7.next = 38;
              break;
            }
            return _context7.abrupt("break", 41);
          case 38:
            _r++;
            _context7.next = 31;
            break;
          case 41:
            /* ---- parts ---- */
            parts = [];
            section = "";
            _r2 = hRow + 1;
          case 44:
            if (!(_r2 < rows.length)) {
              _context7.next = 59;
              break;
            }
            _row = rows[_r2] || [];
            code = _row[C.code], name = _row[C.name];
            len = _this6.num(_row[C.len]), wid = _this6.num(_row[C.wid]);
            if (!(!code || !name || !len || !wid)) {
              _context7.next = 52;
              break;
            }
            // a thickness banner ("18 mm") introduces the next block of parts
            banner = _row.find(v => /^\s*\d+([.,]\d+)?\s*mm\s*$/i.test(String(v !== null && v !== void 0 ? v : "")));
            if (banner) section = String(banner).trim();
            return _context7.abrupt("continue", 56);
          case 52:
            edges = [_row[C.eF], _row[C.eB], _row[C.eL], _row[C.eR]].map(v => v == null ? "" : String(v).trim());
            board = String((_row$C$board = _row[C.board]) !== null && _row$C$board !== void 0 ? _row$C$board : "").trim();
            if (!board) {
              board = section || "Unspecified";
              warn.push(`${code}: no board material in the export — filed under “${board}”`);
            }
            parts.push({
              code: String(code).trim(),
              name: String(name).trim(),
              solid: String((_row$C$solid = _row[C.solid]) !== null && _row$C$solid !== void 0 ? _row$C$solid : "").trim(),
              board,
              l: len,
              w: wid,
              qty: Math.max(1, Math.round(_this6.num(_row[C.qty]) || 1)),
              edges,
              edged: edges.some(Boolean),
              notes: String((_row$C$notes = _row[C.notes]) !== null && _row$C$notes !== void 0 ? _row$C$notes : "").trim()
            });
          case 56:
            _r2++;
            _context7.next = 44;
            break;
          case 59:
            if (parts.length) {
              _context7.next = 61;
              break;
            }
            throw new Error("PARTLIST has no part rows");
          case 61:
            if (!project) {
              // fall back to the shared code prefix
              project = parts[0].code.replace(/[_-]\d+[A-Z]?$/i, "");
              warn.push(`No PROJEKTAS cell — using “${project}” from the part codes`);
            }
            dup = parts.map(p => p.code).filter((c, i, a) => a.indexOf(c) !== i);
            if (dup.length) warn.push(`${dup.length} duplicate part code(s), e.g. ${dup[0]} — scans can't tell them apart`);

            /* ---- consumables ---- */
            _context7.next = 66;
            return _this6._group(wb, _this6.SHEETS.stock, "MATERIAL", ["M2", "M²"], "m²");
          case 66:
            boards = _context7.sent;
            _context7.next = 69;
            return _this6._group(wb, _this6.SHEETS.edge, "MATERIAL", ["M"], "m");
          case 69:
            edgeband = _context7.sent;
            _context7.next = 72;
            return _this6._group(wb, _this6.SHEETS.hw, "NAME", ["QTY"], "pcs");
          case 72:
            hardware = _context7.sent;
            return _context7.abrupt("return", {
              project,
              parts,
              boards,
              edgeband,
              hardware,
              warnings: warn,
              columns: {
                map: C,
                foundBy,
                header: H
              },
              totalPieces: parts.reduce((s, p) => s + p.qty, 0)
            });
          case 74:
          case "end":
            return _context7.stop();
        }
      }, _callee7);
    }))();
  },
  /* Sum one sheet into {name, qty, unit} rows: find the header, then the
     label column and the quantity column by name. */
  _group(wb, sheet, labelHdr, qtyHdrs, unit) {
    var _this7 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
      var rows, want, hRow, cLabel, cQty, r, row, li, qi, acc, _r3, _cLabel, label, q;
      return _regeneratorRuntime().wrap(function _callee8$(_context8) {
        while (1) switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return wb.rows(sheet);
          case 2:
            rows = _context8.sent;
            if (rows) {
              _context8.next = 5;
              break;
            }
            return _context8.abrupt("return", []);
          case 5:
            want = qtyHdrs.map(h => _this7.norm(h));
            hRow = -1, cLabel = -1, cQty = -1;
            r = 0;
          case 8:
            if (!(r < Math.min(rows.length, 30))) {
              _context8.next = 23;
              break;
            }
            row = rows[r] || [];
            li = row.findIndex(v => _this7.norm(v) === _this7.norm(labelHdr));
            if (!(li < 0)) {
              _context8.next = 13;
              break;
            }
            return _context8.abrupt("continue", 20);
          case 13:
            qi = row.findIndex(v => want.includes(_this7.norm(v)));
            if (!(qi < 0)) {
              _context8.next = 16;
              break;
            }
            return _context8.abrupt("continue", 20);
          case 16:
            hRow = r;
            cLabel = li;
            cQty = qi;
            return _context8.abrupt("break", 23);
          case 20:
            r++;
            _context8.next = 8;
            break;
          case 23:
            if (!(hRow < 0)) {
              _context8.next = 25;
              break;
            }
            return _context8.abrupt("return", []);
          case 25:
            acc = new Map();
            _r3 = hRow + 1;
          case 27:
            if (!(_r3 < rows.length)) {
              _context8.next = 38;
              break;
            }
            label = String((_cLabel = (rows[_r3] || [])[cLabel]) !== null && _cLabel !== void 0 ? _cLabel : "").trim();
            if (!(!label || _this7.norm(label) === "GRAND TOTAL")) {
              _context8.next = 31;
              break;
            }
            return _context8.abrupt("continue", 35);
          case 31:
            q = _this7.num((rows[_r3] || [])[cQty]);
            if (q) {
              _context8.next = 34;
              break;
            }
            return _context8.abrupt("continue", 35);
          case 34:
            acc.set(label, (acc.get(label) || 0) + q);
          case 35:
            _r3++;
            _context8.next = 27;
            break;
          case 38:
            return _context8.abrupt("return", [...acc].map(([name, qty]) => ({
              name,
              qty: Math.round(qty * 1000) / 1000,
              unit
            })).sort((a, b) => b.qty - a.qty));
          case 39:
          case "end":
            return _context8.stop();
        }
      }, _callee8);
    }))();
  },
  /* ---------- turn the parse into something manufacturable ---------- */
  /* One item per board material (qty = pieces of that board), because that is
     what gets nested, cut and counted — and it makes a scanned part increment
     the right line. Assembly/QC/Packing live on a separate module line. */
  plan(parsed, opts = {}) {
    var byBoard = new Map();
    var _iterator9 = _createForOfIteratorHelper(parsed.parts),
      _step9;
    try {
      for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
        var p = _step9.value;
        if (!byBoard.has(p.board)) byBoard.set(p.board, {
          board: p.board,
          pieces: 0,
          parts: [],
          edged: false
        });
        var g = byBoard.get(p.board);
        g.pieces += p.qty;
        g.parts.push(p);
        g.edged = g.edged || p.edged;
      }
    } catch (err) {
      _iterator9.e(err);
    } finally {
      _iterator9.f();
    }
    var modules = new Set();
    var _iterator10 = _createForOfIteratorHelper(parsed.parts),
      _step10;
    try {
      for (_iterator10.s(); !(_step10 = _iterator10.n()).done;) {
        var _p = _step10.value;
        var s = _p.solid || "";
        modules.add(s.startsWith(_p.name + "_") ? s.slice(_p.name.length + 1) : s || _p.name);
      }
      /* Stages are resolved by name, so this works on a shop's own station list
         and not just the seed's ids. A stage the shop does not have is left out
         of the route — and said out loud, because a route that quietly collapses
         to one step looks like the job is finished after cutting. */
    } catch (err) {
      _iterator10.e(err);
    } finally {
      _iterator10.f();
    }
    var warnRoute = [];
    var stage = (key, label) => {
      var st = D.stationFor(key);
      if (!st) warnRoute.push(label);
      return st;
    };
    var edgeSt = stage("edge", "Edge banding"),
      cncSt = stage("cnc", "CNC / drilling");
    var cutSt = D.stationFor("cut") || D.stationsOf("prod")[0];
    var cutting = opts.cutStation || (cutSt || {}).id;
    var anyEdged = [...byBoard.values()].some(g => g.edged);
    var items = [...byBoard.values()].sort((a, b) => b.pieces - a.pieces).map(g => ({
      name: g.board,
      qty: g.pieces,
      partCodes: g.parts.map(p => p.code),
      route: [cutting, ...(g.edged && edgeSt ? [edgeSt.id] : []), ...(cncSt ? [cncSt.id] : [])].filter(Boolean)
    }));
    var finalRoute = ["asm", "qc", "pack"].map(k => stage(k, {
      asm: "Assembly",
      qc: "Quality check",
      pack: "Packing"
    }[k])).filter(Boolean).map(st => st.id);
    /* only complain about edge banding if something actually needs it */
    var missing = warnRoute.filter(w => w !== "Edge banding" || anyEdged);
    return {
      project: parsed.project,
      items,
      moduleCount: modules.size,
      /* the cabinets themselves, by name. Assembly is counted in modules, and
         "48" means nothing to the person holding the screwdriver — these are
         what he is actually ticking off. */
      moduleNames: [...modules].sort((a, b) => a.localeCompare(b)),
      finalRoute,
      finalName: opts.finalName || "Surinkimas ir pakavimas",
      boards: parsed.boards,
      edgeband: parsed.edgeband,
      hardware: parsed.hardware,
      columns: parsed.columns,
      missingStages: missing,
      parts: parsed.parts,
      totalPieces: parsed.totalPieces,
      warnings: missing.length ? [...parsed.warnings, `No station matches ${missing.join(", ")} — those steps are left out of the route`] : parsed.warnings
    };
  }
};

/* ============================================================
   Import dialog — pick the file, see exactly what will be made,
   then create it. Nothing is written until "Create project".
   ============================================================ */
var SwoodImport = {
  plan: null,
  fileName: "",
  scope: 1,
  // how many of the whole project are being made
  form: null,
  // name / client / due, kept across re-renders
  lineEdits: null,
  // production line name → corrected name
  consEdits: null,
  // consumable index → { name, qty, materialId }

  open() {
    this.plan = null;
    this.fileName = "";
    this.scope = 1;
    this.form = null;
    this.lineEdits = {};
    this.consEdits = {};
    Modal.open(`
      <header><h2>Import SWOOD report list</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body" id="sw-body">${this.pickHtml()}</div>
      <footer id="sw-foot">
        <button class="btn" data-close>Cancel</button>
        <button class="btn primary" id="sw-go" disabled>${icon("import", 14)} Create project</button>
      </footer>`, m => {
      m.classList.add("sw-modal");
      this.bind(m);
    });
  },
  pickHtml() {
    return `<div class="sw-drop" id="sw-drop">
      <span class="ico">${icon("import", 26)}</span>
      <b>Choose the “Report Lists to Excel” file</b>
      <span class="t-caption">The .xlsm (or .xlsx) SWOOD writes next to the project — drop it here or click to browse</span>
      <input type="file" id="sw-file" accept=".xlsm,.xlsx" hidden>
    </div>`;
  },
  bind(m) {
    var drop = $("#sw-drop", m),
      file = $("#sw-file", m);
    if (drop) {
      drop.onclick = () => file.click();
      drop.ondragover = e => {
        e.preventDefault();
        drop.classList.add("over");
      };
      drop.ondragleave = () => drop.classList.remove("over");
      drop.ondrop = e => {
        e.preventDefault();
        drop.classList.remove("over");
        if (e.dataTransfer.files[0]) this.load(e.dataTransfer.files[0], m);
      };
      file.onchange = () => file.files[0] && this.load(file.files[0], m);
    }
    var go = $("#sw-go", m);
    if (go) go.onclick = () => this.create(m);
  },
  load(f, m) {
    var _this8 = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9() {
      var body, parsed;
      return _regeneratorRuntime().wrap(function _callee9$(_context9) {
        while (1) switch (_context9.prev = _context9.next) {
          case 0:
            _this8.fileName = f.name;
            body = $("#sw-body", m);
            body.innerHTML = `<div class="sw-busy"><div class="sync-spinner"></div><span>Reading ${esc(f.name)}…</span></div>`;
            _context9.prev = 3;
            if (!(typeof DecompressionStream === "undefined")) {
              _context9.next = 6;
              break;
            }
            throw new Error("This browser can't unzip the workbook — please use an up-to-date Chrome, Edge or Safari.");
          case 6:
            _context9.t0 = SWOOD;
            _context9.next = 9;
            return f.arrayBuffer();
          case 9:
            _context9.t1 = _context9.sent;
            _context9.next = 12;
            return _context9.t0.parse.call(_context9.t0, _context9.t1);
          case 12:
            parsed = _context9.sent;
            _this8.plan = SWOOD.plan(parsed);
            _this8.scope = 1;
            _this8.lineEdits = {};
            _this8.consEdits = {};
            _this8.form = {
              name: _this8.plan.project,
              client: "",
              due: new Date(Date.now() + 14 * 864e5).toISOString().slice(0, 10)
            };
            _this8.render(m);
            $("#sw-go", m).disabled = false;
            _context9.next = 28;
            break;
          case 22:
            _context9.prev = 22;
            _context9.t2 = _context9["catch"](3);
            _this8.plan = null;
            body.innerHTML = `<div class="sw-error">${icon("alert", 20)}<div><b>Couldn't read that file</b>
        <span>${esc(_context9.t2 && _context9.t2.message || String(_context9.t2))}</span></div></div>${_this8.pickHtml()}`;
            _this8.bind(m);
            $("#sw-go", m).disabled = true;
          case 28:
          case "end":
            return _context9.stop();
        }
      }, _callee9, null, [[3, 22]]);
    }))();
  },
  /* ---------- the working lists ----------
     The plan is left alone; what the dialog shows is the plan scaled by the
     scope, with the user's corrections laid over it. */

  lineRows() {
    return this.plan.items.map(it => ({
      src: it.name,
      name: this.lineEdits[it.name] !== undefined ? this.lineEdits[it.name] : it.name,
      base: it.qty,
      // what the report itself said
      qty: it.qty * this.scope,
      route: it.route
    }));
  },
  consBase() {
    return [...this.plan.boards, ...this.plan.edgeband, ...this.plan.hardware];
  },
  consRows() {
    return this.consBase().map((g, i) => {
      var e = this.consEdits[i] || {};
      var name = e.name !== undefined ? e.name : g.name;
      var qty = e.qty !== undefined ? e.qty : Math.round(g.qty * this.scope * 1000) / 1000;
      // an untouched row keeps following the name; once a person picks, it sticks
      var mat = e.materialId !== undefined ? e.materialId ? D.material(e.materialId) : null : D.matchMaterial(name);
      return {
        i,
        name,
        qty,
        base: g.qty,
        edited: e.qty !== undefined,
        unit: mat && mat.unit || g.unit,
        mat,
        chosen: e.materialId !== undefined
      };
    });
  },
  render(m) {
    $("#sw-body", m).innerHTML = this.previewHtml();
    this.bindPreview(m);
  },
  previewHtml() {
    var p = this.plan,
      f = this.form;
    var lines = this.lineRows(),
      cons = this.consRows();
    var linked = cons.filter(c => c.mat).length;
    var mods = p.moduleCount * this.scope;
    var pieces = p.totalPieces * this.scope;
    return `
      <div class="sw-stats">
        <div><b>${p.parts.length}</b><span>part codes</span></div>
        <div><b>${pieces}</b><span>${this.scope > 1 ? `pieces · ${p.totalPieces} × ${this.scope}` : "pieces"}</span></div>
        <div><b>${lines.length}</b><span>materials</span></div>
        <div><b>${mods}</b><span>modules</span></div>
      </div>
      ${p.warnings.length ? `<div class="sw-warn">${icon("alert", 15)}<div><b>${p.warnings.length} thing${p.warnings.length > 1 ? "s" : ""} worth a look</b>
        ${p.warnings.slice(0, 4).map(w => `<span>${esc(w)}</span>`).join("")}
        ${p.warnings.length > 4 ? `<span>…and ${p.warnings.length - 4} more</span>` : ""}</div></div>` : ""}

      ${this.columnsHtml(p)}

      <div class="field"><label>Project name</label><input class="input" id="sw-name" value="${esc(f.name)}" autocomplete="off">
        <span class="t-caption" id="sw-namewarn" style="color:var(--red);min-height:15px"></span></div>
      <div class="row" style="gap:12px">
        <div class="field grow"><label>Client</label>
          <input class="input" id="sw-client" value="${esc(f.client)}" placeholder="Optional" autocomplete="off"
            list="shared-customers">${typeof Bridge !== "undefined" ? Bridge.datalistHtml() : ""}</div>
        <div class="field"><label>Due date</label><input class="input" type="date" id="sw-due" value="${esc(f.due)}"></div>
        <div class="field sw-scope"><label>How many?</label>
          <input class="input" type="number" min="1" step="1" id="sw-scope" value="${this.scope}"></div>
      </div>
      ${this.scope > 1 ? `<div class="sw-scope-note">${icon("info", 14)}
        <span>The report describes one project. Everything below is multiplied by <b>${this.scope}</b> —
        pieces, modules and materials — so a scanned label counts up to ${this.scope}× as many.</span></div>` : ""}

      <div class="t-label">Production lines it will create</div>
      <div class="sw-table">
        ${lines.map(l => `<div class="sw-row sw-edit">
          <input class="input sw-in" data-line="${esc(l.src)}" value="${esc(l.name)}" autocomplete="off">
          <span class="sw-route">${l.route.map(id => esc((D.station(id) || {}).name || id)).join(" → ")}</span>
          <span class="qty-pill ${this.scope > 1 ? "stacked" : ""}">${l.qty} pcs${this.scope > 1 ? `<span class="sw-arith">${l.base} × ${this.scope}</span>` : ""}</span></div>`).join("")}
        ${p.finalRoute.length ? `<div class="sw-row sw-edit">
          <span class="sw-in-static"><b>${esc(p.finalName)}</b></span>
          <span class="sw-route">${p.finalRoute.map(id => esc((D.station(id) || {}).name || id)).join(" → ")}</span>
          <span class="qty-pill ${this.scope > 1 ? "stacked" : ""}">${mods} modules${this.scope > 1 ? `<span class="sw-arith">${p.moduleCount} × ${this.scope}</span>` : ""}</span></div>` : ""}
      </div>

      <div class="t-label" style="display:flex;align-items:center;gap:8px">
        <span class="grow">Materials &amp; hardware — ${linked} of ${cons.length} matched to stock</span>
        <button class="link" id="sw-rematch" type="button">Match again</button>
      </div>
      <div class="t-caption" style="margin:-4px 0 6px">
        A report list carries the names the designer typed. Correct anything here and point it at the right stock item.
      </div>
      <div id="sw-cons">${this.consHtml(cons)}</div>`;
  },
  /* What was actually read out of the workbook. Folded away, because most of
     the time it is uninteresting — but when a count looks wrong, this is the
     only thing that answers "where did that number come from". */
  columnsHtml(p) {
    var c = p.columns;
    if (!c) return "";
    var FIELDS = [["code", "Part code"], ["name", "Part name"], ["board", "Board"], ["len", "Length"], ["wid", "Width"], ["qty", "Quantity"]];
    var guessed = FIELDS.filter(([k]) => !c.foundBy[k]).length;
    var sample = p.parts.slice(0, 3);
    return `<details class="sw-cols" ${guessed ? "open" : ""}>
      <summary>What it read from your file${guessed ? ` — <b style="color:var(--orange)">${guessed} column${guessed > 1 ? "s" : ""} guessed by position</b>` : ""}</summary>
      <div class="sw-cols-body">
        <div class="sw-cols-grid">
          ${FIELDS.map(([k, label]) => {
      var _c$map$k;
      return `<div>
            <span>${label}</span>
            <b class="${c.foundBy[k] ? "" : "guess"}">${c.foundBy[k] ? esc(c.foundBy[k]) : `column ${((_c$map$k = c.map[k]) !== null && _c$map$k !== void 0 ? _c$map$k : 0) + 1} — by position`}</b>
          </div>`;
    }).join("")}
        </div>
        ${sample.length ? `<div class="t-caption" style="margin-top:8px">First rows as understood:</div>
          <div class="sw-cols-sample">
            ${sample.map(x => `<div><span class="mono">${esc(x.code)}</span>
              <span>${esc(x.board)}</span>
              <span>${x.l}×${x.w}</span>
              <b>${x.qty} pcs</b></div>`).join("")}
          </div>` : ""}
      </div>
    </details>`;
  },
  consHtml(cons) {
    if (!cons.length) return `<div class="sw-table"><span class="t-caption" style="padding:10px 12px">None listed in the export</span></div>`;
    var mats = [...Store.state.materials].sort((a, b) => a.name.localeCompare(b.name));
    return `<div class="sw-table sw-scroll">
      ${cons.map(c => `<div class="sw-row sw-cons-row">
        <input class="input sw-in" data-cname="${c.i}" value="${esc(c.name)}" autocomplete="off">
        <input class="input sw-qty" type="number" min="0" step="any" data-cqty="${c.i}" value="${c.qty}">
        <span class="sw-unit">${esc(c.unit)}${this.scope > 1 ? `<span class="sw-arith">${c.edited ? "typed" : `${c.base} × ${this.scope}`}</span>` : ""}</span>
        <span class="sw-link ${c.mat ? "on" : ""}">${Picker.html("swl-" + c.i, {
      value: c.mat ? c.mat.id : "",
      placeholder: `Search ${mats.length} stock items…`,
      empty: "— not in the warehouse —",
      options: mats.map(m => ({
        value: m.id,
        label: m.name,
        sub: m.sku || ""
      })),
      attrs: `data-clink="${c.i}"`
    })}</span>
      </div>`).join("")}
    </div>`;
  },
  bindPreview(m) {
    var name = $("#sw-name", m),
      warn = $("#sw-namewarn", m),
      go = $("#sw-go", m);
    var check = () => {
      var v = name.value.trim();
      var bad = !v ? "Give the project a name" : D.projectNameTaken(v) ? "A project with that name already exists" : "";
      warn.textContent = bad;
      go.disabled = !!bad;
      return !bad;
    };
    name.oninput = () => {
      this.form.name = name.value;
      check();
    };
    check();
    $("#sw-client", m).oninput = e => {
      this.form.client = e.target.value;
    };
    $("#sw-due", m).onchange = e => {
      this.form.due = e.target.value;
    };

    /* Scope changes every quantity, so a quantity somebody typed for the old
       scope is no longer what they meant — those are dropped, while the names
       and stock links they corrected are kept. */
    var scope = $("#sw-scope", m);
    scope.onchange = () => {
      var raw = scope.valueAsNumber;
      var v = Math.max(1, Math.round(isNaN(raw) ? 1 : raw));
      if (v === this.scope) return;
      this.scope = v;
      for (var _i4 = 0, _Object$keys = Object.keys(this.consEdits); _i4 < _Object$keys.length; _i4++) {
        var k = _Object$keys[_i4];
        delete this.consEdits[k].qty;
      }
      this.render(m);
      var again = $("#sw-scope", m);
      if (again) again.focus();
    };
    $$("[data-line]", m).forEach(inp => inp.onchange = () => {
      this.lineEdits[inp.dataset.line] = inp.value.trim() || inp.dataset.line;
    });
    Picker.bind(m);
    this.bindCons(m);
    $("#sw-rematch", m).onclick = () => {
      for (var _i5 = 0, _Object$keys2 = Object.keys(this.consEdits); _i5 < _Object$keys2.length; _i5++) {
        var k = _Object$keys2[_i5];
        delete this.consEdits[k].materialId;
      }
      this.render(m);
    };
  },
  bindCons(m) {
    var edit = i => this.consEdits[i] = this.consEdits[i] || {};
    var repaint = () => {
      var cons = this.consRows();
      $("#sw-cons", m).innerHTML = this.consHtml(cons);
      Picker.bind(m);
      this.bindCons(m);
      var label = $(".t-label .grow", m);
      if (label) label.textContent = `Materials & hardware — ${cons.filter(c => c.mat).length} of ${cons.length} matched to stock`;
    };
    $$("[data-cname]", m).forEach(inp => inp.onchange = () => {
      edit(inp.dataset.cname).name = inp.value.trim();
      repaint(); // a corrected name may now find its stock
    });
    $$("[data-cqty]", m).forEach(inp => inp.onchange = () => {
      // valueAsNumber, not Number(value): the field renders in the browser's
      // locale and a comma decimal would parse as NaN
      var v = inp.valueAsNumber;
      edit(inp.dataset.cqty).qty = isNaN(v) ? 0 : Math.max(0, v);
    });
    $$("[data-clink]", m).forEach(sel => sel.onchange = () => {
      edit(sel.dataset.clink).materialId = sel.value || null;
      repaint();
    });
  },
  create(m) {
    if (!this.plan) return;
    var name = $("#sw-name", m).value.trim();
    if (D.projectNameTaken(name) || !name) return;
    var dueVal = $("#sw-due", m).value;
    var cons = this.consRows().filter(c => c.qty > 0 && c.name).map(c => ({
      name: c.name,
      qty: c.qty,
      unit: c.unit,
      materialId: c.mat ? c.mat.id : null
    }));
    var order = M.createFromSwood(this.plan, {
      product: name,
      client: $("#sw-client", m).value.trim(),
      due: dueVal ? new Date(dueVal + "T12:00:00").getTime() : undefined,
      notes: `Imported from SWOOD (${this.fileName})${this.scope > 1 ? ` — ×${this.scope}` : ""}`,
      scope: this.scope,
      consumables: cons,
      lineNames: this.lineEdits
    }, App.me.id);
    if (typeof Bridge !== "undefined") {
      var cid = Bridge.resolveClient(order.client);
      if (cid) {
        order.customerId = cid;
        Store.save();
      }
    }
    Modal.close();
    App.navigate("projects");
    Drawer.open(order.id);
    Toast.show(`${order.num} created — ${order.parts.length} part codes${this.scope > 1 ? ` ×${this.scope}` : ""} across ${this.plan.items.length} materials`, {
      emoji: "import",
      ms: 5000
    });
  }
};