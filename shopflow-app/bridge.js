/* ============================================================
   bridge.js — ShopFlow's half of the shared shop system

   OPTIONAL BY DESIGN. It does something only when the hub's core.js has
   loaded; every entry point is guarded, so ShopFlow served on its own — or
   with the hub not deployed yet — behaves exactly as it always has. The
   <script> tag for core.js is allowed to 404.

   Two jobs:
     • publish every order into the shared document index, so a quote knows
       which order it became and an invoice knows what it is billing
     • resolve `order.client`, which has only ever been a string, to a shared
       customer record

   It never invents a customer in the background. A typo in a client name
   would otherwise quietly become a new company in the shared list, so the
   periodic sync only MATCHES; creating happens when a person actually
   submits a name (M.createOrder / the edit dialog).
   ============================================================ */
"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var Bridge = {
  DEBOUNCE: 900,
  _timer: null,
  ready() {
    return typeof Core !== "undefined" && !!Core.state;
  },
  boot() {
    if (!this.ready()) return;
    Core.boot();
    Core.cloud.load();
    this.sync();
    // a customer edited in the hub or in Invoices should show up in the picker
    Core.on("change", () => {
      if (typeof App !== "undefined" && App._html) App._html = null;
    });
    if (Core.cloud.on()) Core.startPolling();
  },
  /* Store.save() calls this on every change; the index only needs the settled
     result, so it is debounced rather than run per keystroke. */
  mark() {
    if (!this.ready()) return;
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.sync(), this.DEBOUNCE);
  },
  /* A production order is an "order"; an engineering project is a "design".
     Calling both an order would lose the distinction the shop actually makes. */
  kindOf(o) {
    return o.type === "eng" ? "design" : "order";
  },
  statusOf(o) {
    if (o.archived || o.shipped) return "done";
    var st = D.orderStatus(o);
    return st === "ready" ? "ready" : st === "blocked" ? "blocked" : "active";
  },
  sync() {
    if (!this.ready()) return 0;
    var n = 0;
    var held = new Set();
    var _iterator = _createForOfIteratorHelper(Store.state.orders),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var o = _step.value;
        held.add(String(o.id));
        // match only — never create from a background pass
        var customerId = o.customerId || null;
        if (!customerId && o.client) {
          var m = Core.matchCustomer({
            name: o.client
          });
          if (m) customerId = m.customer.id;
        }
        Core.linkDoc({
          app: "shopflow",
          ref: o.id,
          kind: this.kindOf(o),
          num: o.num,
          customerId,
          title: o.product || "",
          status: this.statusOf(o),
          amount: null,
          // ShopFlow does not carry money
          date: o.createdAt || Date.now(),
          fromId: o.fromQuoteId || null // set when an order comes from a quote
        });
        n++;
      }
      // an order deleted here should stop appearing in the shared index
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var _iterator2 = _createForOfIteratorHelper(Core.docs({
        app: "shopflow"
      })),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var d = _step2.value;
        if (!held.has(String(d.ref))) Core.unlinkDoc("shopflow", d.ref);
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    return n;
  },
  /* Called when a person submits a client name, so this one may create. */
  resolveClient(name) {
    if (!this.ready() || !name) return null;
    var rec = Core.resolveCustomer({
      name: name.trim()
    });
    return rec ? rec.id : null;
  },
  /* Names for the client field's datalist, so the shop stops re-typing them. */
  customerNames() {
    if (!this.ready()) return [];
    return Core.customers().map(c => c.name);
  },
  datalistHtml(id = "shared-customers") {
    var names = this.customerNames();
    if (!names.length) return "";
    return `<datalist id="${id}">${names.map(n => `<option value="${esc(n)}"></option>`).join("")}</datalist>`;
  }
};