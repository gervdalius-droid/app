/* ============================================================
   ShopFlow — Manager views
   Shell, Dashboard, Board, Orders, Warehouse, Team, Activity,
   Settings, Order detail drawer, New order modal.
   ============================================================ */
"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var Mgr = {
  /* ---------------- Shell ---------------- */
  shell() {
    var eng = App.isEngineer();
    // engineers only count/see engineering projects; managers see all active
    var active = Store.state.orders.filter(o => !o.archived && (!eng || o.type === "eng"));
    var attention = active.filter(o => {
      var st = D.orderStatus(o);
      return st === "blocked" || fmtDue(o.due).cls === "overdue" && st !== "ready";
    }).length;
    var low = D.lowStock().length;
    var myTodos = D.openTodoCount(App.me.id);
    // engineers get a focused workspace (design projects + shared tools); managers get everything
    var myOps = App.isWorker() ? D.workerQueue(App.me.id).length : 0;
    var nav = eng ? [["dashboard", "dashboard", "Dashboard"], ["projects", "compass", "Projektavimas", active.length], ["todo", "todo", "To-Do", myTodos], ["planner", "columns", "Planner", D.myGTaskCount(App.me.id)], ["whiteboard", "board", "Whiteboard"], ["activity", "history", "Activity"], ...(App.can("reports.view") ? [["reports", "chart", "Reports"]] : [])] : [
    // everyone gets the same cockpit — Settings is the only thing a role can hide
    ["dashboard", "dashboard", "Dashboard"], ...(App.isWorker() ? [["mywork", "wrench", "My Work", myOps]] : []), ["board", "kanban", "Production Board"], ["projects", "folder", "Projects", active.length], ["warehouse", "warehouse", "Warehouse", low, "low"], ["todo", "todo", "To-Do", myTodos], ["planner", "columns", "Planner", D.myGTaskCount(App.me.id)], ["scan", "scan", "Scan Station"], ["team", "users", "Team"], ["whiteboard", "board", "Whiteboard"], ["activity", "history", "Activity"], ...(App.can("reports.view") ? [["reports", "chart", "Reports"]] : []), ...(App.can("settings") ? [["settings", "sliders", "Settings"]] : [])];
    var navActive = id => id === "projects" ? ["projects", "orders"].includes(App.view) : App.view === id;
    return `<div class="shell">
      <aside class="sidebar">
        <div class="brand"><span class="mark" style="color:var(--accent)">${icon("logo", 23, "", 1.7)}</span> ShopFlow</div>
        ${nav.map(([id, ico, label, count, warn]) => `
          <button class="nav-item ${navActive(id) ? "active" : ""}" data-nav="${id}">
            <span class="ico">${icon(ico, 17)}</span> ${label}
            ${count ? `<span class="count-badge" ${warn ? `style="background:var(--red-soft);color:var(--red)"` : ""}>${count}</span>` : ""}
          </button>`).join("")}
        <div class="spacer"></div>
        ${(() => {
      var n = D.attention(App.me.id).count;
      return n ? `<button class="nav-item ${App.view === "attention" ? "active" : ""}" data-nav="attention" style="color:var(--red)">
            <span class="ico">${icon("alert", 16)}</span> Needs attention <span class="count-badge" style="background:var(--red-soft);color:var(--red)">${n}</span>
          </button>` : "";
    })()}
        <button class="nav-item bench-switch" id="bench-btn" title="Big-button screen for a bench tablet">
          <span class="ico">${icon("wrench", 16)}</span> Bench mode
        </button>
        <button class="user-chip" id="logout-btn" title="Sign out">
          ${avatarHtml(App.me, "md")}
          <span class="meta"><b>${esc(App.me.name)}</b><span>${esc(App.me.trade)}</span></span>
          <span class="out">${icon("power", 15)}</span>
        </button>
      </aside>
      <div class="main">
        <div class="topbar">
          <h1 id="page-title">${this.titles[App.view] || ""}</h1>
          <div class="grow"></div>
          <div class="search-box" id="topbar-search">${icon("search", 14)}<span style="flex:1">Search</span><kbd>⌘K</kbd></div>
          ${Offline.badgeHtml()}
          ${Notif.bellHtml(App.me.id)}
          <button class="icon-btn" id="theme-btn" title="Toggle appearance">${icon("moon", 16)}</button>
          ${App.can("orders.create") && App.view !== "planner" && !App.isEngineer() ? `<button class="btn" id="swood-btn" title="Import a SWOOD Report Lists to Excel export">${icon("import", 14)} Import SWOOD</button>` : ""}
          ${App.can("orders.create") || App.view === "planner" ? `<button class="btn primary" id="new-order-btn">${icon("plus", 14)} ${App.view === "planner" ? "New project" : App.isEngineer() ? "New Project" : "New Order"}</button>` : ""}
        </div>
        <div class="content ${["board", "orders", "projects", "whiteboard", "scan", "planner"].includes(App.view) ? "no-pad" : ""}" id="content">${this.viewHtml()}</div>
      </div>
      ${this.mobileNav(nav, navActive, attention)}
    </div>`;
  },
  titles: {
    dashboard: "Dashboard",
    projects: "Projects",
    board: "Production Board",
    orders: "Projects",
    mywork: "My Work",
    attention: "Needs attention",
    warehouse: "Warehouse",
    todo: "To-Do",
    planner: "Planner",
    scan: "Scan Station",
    team: "Team",
    whiteboard: "Whiteboard",
    activity: "Activity",
    reports: "Reports",
    settings: "Settings"
  },
  viewHtml() {
    // engineers only reach their own workspace views
    if (App.isEngineer() && !["dashboard", "projects", "orders", "todo", "planner", "whiteboard", "activity", "reports"].includes(App.view)) App.view = "dashboard";
    if (App.view === "settings" && !App.can("settings")) App.view = "dashboard"; // never reachable by URL either
    if (App.view === "reports" && !App.can("reports.view")) App.view = "dashboard";
    switch (App.view) {
      case "dashboard":
        return this.dashboard();
      case "mywork":
        return this.myWork();
      case "board":
        return this.board();
      case "orders":
        this.projectsTab = "list";
        App.view = "projects";
        return this.projects();
      case "projects":
        return this.projects();
      case "warehouse":
        return Warehouse.view();
      case "todo":
        return Todo.view();
      case "planner":
        return GPM.view();
      case "scan":
        return ScanStation.view();
      case "team":
        return this.team();
      case "whiteboard":
        return WB.view();
      case "activity":
        return Activity.view();
      case "reports":
        return Reports.view();
      case "attention":
        return this.attention();
      case "settings":
        return this.settings();
      default:
        return this.dashboard();
    }
  },
  /* ---- phone navigation ----
     The sidebar can't fit a phone, so the same nav appears as a bottom bar:
     the first four destinations plus a sheet holding the rest, the profile
     and sign-out. Hidden above 760px, where the sidebar takes over. */
  /* a tab bar has ~70px per label — long names must be shortened, not clipped */
  SHORT_NAV: {
    dashboard: "Home",
    board: "Board",
    projects: "Projects",
    mywork: "My Work",
    warehouse: "Stock",
    todo: "To-Do",
    planner: "Planner",
    scan: "Scan",
    reports: "Reports",
    team: "Team",
    whiteboard: "Board",
    activity: "Activity",
    settings: "Settings"
  },
  mobileNav(nav, navActive, attention) {
    var primary = nav.slice(0, 4);
    var rest = nav.slice(4);
    var moreOpen = App.moreOpen;
    return `
      <nav class="mobile-nav">
        ${primary.map(([id, ico, label, count, warn]) => `
          <button class="${navActive(id) && !moreOpen ? "active" : ""}" data-nav="${id}">
            <span class="ico">${icon(ico, 20)}${count ? `<i class="dot ${warn ? "warn" : ""}"></i>` : ""}</span>${esc(this.SHORT_NAV[id] || label)}
          </button>`).join("")}
        <button class="${moreOpen ? "active" : ""}" id="nav-more">
          <span class="ico">${icon("menu", 20)}</span>More
        </button>
      </nav>
      ${moreOpen ? `<div class="more-scrim" id="more-scrim"></div>
      <div class="more-sheet">
        <div class="more-grab"></div>
        <div class="more-grid">
          ${rest.map(([id, ico, label, count, warn]) => `
            <button data-nav="${id}">
              <span class="ico">${icon(ico, 20)}</span><span class="grow">${esc(label)}</span>
              ${count ? `<span class="count-badge" ${warn ? `style="background:var(--red-soft);color:var(--red)"` : ""}>${count}</span>` : ""}
            </button>`).join("")}
        </div>
        ${attention ? `<button class="btn more-attention" data-nav="attention">
          ${icon("alert", 15)} Needs attention <span class="count-badge">${attention}</span>
        </button>` : ""}
        <div class="more-actions">
          ${App.can("orders.create") && !App.isEngineer() ? `<button class="btn" id="more-swood">${icon("import", 15)} Import SWOOD</button>` : ""}
          <button class="btn" id="more-bench">${icon("wrench", 15)} Bench mode</button>
          <button class="btn" id="more-theme">${icon("moon", 15)} Appearance</button>
        </div>
        <div class="more-build">ShopFlow · build ${esc(App.build())}</div>
        <button class="more-user" id="more-logout">
          ${avatarHtml(App.me, "md")}
          <span class="grow"><b>${esc(App.me.name)}</b><span>${esc(App.me.trade || App.me.role)}</span></span>
          <span class="out">${icon("power", 16)}</span>
        </button>
      </div>` : ""}`;
  },
  bindMobileNav(root) {
    var more = $("#nav-more", root);
    if (more) more.onclick = () => {
      App.moreOpen = !App.moreOpen;
      App.render();
    };
    var close = () => {
      App.moreOpen = false;
      App.render();
    };
    var scrim = $("#more-scrim", root);
    if (scrim) scrim.onclick = close;
    var sw = $("#more-swood", root);
    if (sw) sw.onclick = () => {
      App.moreOpen = false;
      App.render();
      SwoodImport.open();
    };
    var bench = $("#more-bench", root);
    if (bench) bench.onclick = () => {
      App.moreOpen = false;
      App.setBenchMode(true);
    };
    var th = $("#more-theme", root);
    if (th) th.onclick = () => {
      var cur = document.documentElement.getAttribute("data-theme");
      App.applyTheme(cur === "dark" ? "light" : "dark");
    };
    var out = $("#more-logout", root);
    if (out) out.onclick = () => {
      App.moreOpen = false;
      App.logout();
    };
  },
  /* ---- My Work (cockpit) ----
     The same hero task + queue a worker gets on the bench tablet, rendered
     inside the full shell so they can jump straight from their own job to
     the board, the project or the warehouse. */
  myWork() {
    return `<div class="view-anim mywork-pad">${Wkr.myWork()}</div>`;
  },
  bind(root) {
    $$("[data-nav]", root).forEach(b => b.onclick = () => {
      App.moreOpen = false;
      App.navigate(b.dataset.nav, b.dataset.filter ? {
        filter: b.dataset.filter
      } : {});
    });
    this.bindMobileNav(root);
    $("#logout-btn", root).onclick = () => App.logout();
    var bench = $("#bench-btn", root);
    if (bench) bench.onclick = () => App.setBenchMode(true);
    Notif.bindBell(root);
    $("#topbar-search", root).onclick = () => Palette.open();
    $("#theme-btn", root).onclick = () => {
      var cur = document.documentElement.getAttribute("data-theme");
      App.applyTheme(cur === "dark" ? "light" : "dark");
    };
    var sw = $("#swood-btn", root);
    if (sw) sw.onclick = () => SwoodImport.open();
    var newBtn = $("#new-order-btn", root);
    if (newBtn) newBtn.onclick = () => App.view === "planner" ? GPM.newProjectModal() : NewOrder.open();
    var bindView = {
      dashboard: () => this.bindDashboard(root),
      mywork: () => {
        Wkr.bindWork(root);
        Todo.bind(root);
      },
      board: () => this.bindBoard(root),
      projects: () => this.bindProjects(root),
      warehouse: () => Warehouse.bind(root),
      reports: () => Reports.bind(root),
      attention: () => this.bindAttention(root),
      todo: () => Todo.bind(root),
      planner: () => GPM.bind(root),
      scan: () => ScanStation.bind(root),
      team: () => this.bindTeam(root),
      whiteboard: () => WB.bind(root),
      activity: () => Activity.bind(root),
      settings: () => this.bindSettings(root)
    }[App.view];
    if (bindView) bindView();
  },
  /* ---------------- Projects hub (multi-view + scope) ---------------- */
  projectsTab: null,
  projectsScope: null,
  // "prod" | "eng"

  currentTab() {
    if (App.viewParams.tab) {
      this.projectsTab = App.viewParams.tab;
      App.viewParams.tab = null;
    }
    if (App.viewParams.scope) {
      this.projectsScope = App.viewParams.scope;
      App.viewParams.scope = null;
    }
    if (!this.projectsTab) this.projectsTab = D.pref(App.me.id, "projectsTab", "list");
    if (!this.projectsScope) this.projectsScope = D.pref(App.me.id, "projectsScope", "prod");
    if (App.isEngineer()) this.projectsScope = "eng"; // engineers only see projektavimas
    return this.projectsTab;
  },
  scopeType() {
    return this.projectsScope === "eng" ? "eng" : "prod";
  },
  projects() {
    var tab = this.currentTab();
    var scope = this.projectsScope;
    var tabs = [["list", "list", "List"], ["board", "kanban", "Board"], ["timeline", "gantt", "Timeline"], ["calendar", "calendar", "Calendar"], ["workload", "users", "Workload"], ...(App.isManager() ? [["portfolios", "archive", "Portfolios"]] : [])];
    if (!tabs.some(t => t[0] === tab)) {
      tab = "list";
      this.projectsTab = "list";
    }
    var body = {
      list: () => `<div class="tab-pad">${this.orders()}</div>`,
      board: () => this.board(scope === "eng" ? "eng" : "prod"),
      timeline: () => this.timeline(),
      calendar: () => `<div class="tab-pad">${this.calendar()}</div>`,
      workload: () => `<div class="tab-pad">${this.workload()}</div>`,
      portfolios: () => `<div class="tab-pad">${this.portfolios()}</div>`
    }[tab]();
    return `<div style="display:flex;flex-direction:column;height:100%">
      <div class="vtabs">
        ${tabs.map(([id, ico, label]) => `
          <button class="vtab ${tab === id ? "active" : ""}" data-vtab="${id}">
            <span class="ico">${icon(ico, 14)}</span>${label}
          </button>`).join("")}
        ${tab !== "portfolios" && App.isManager() ? `<div class="segmented scope-seg" id="scope-seg">
          <button data-scope="prod" class="${scope !== "eng" ? "active" : ""}">${icon("factory", 13)} Production</button>
          <button data-scope="eng" class="${scope === "eng" ? "active" : ""}">${icon("pencil", 13)} Engineering</button>
        </div>` : ""}
      </div>
      <div class="projects-body">${body}</div>
    </div>`;
  },
  bindProjects(root) {
    $$("[data-vtab]", root).forEach(b => b.onclick = () => {
      this.projectsTab = b.dataset.vtab;
      M.setPref(App.me.id, "projectsTab", b.dataset.vtab);
      Router.push();
      App.render();
    });
    $$("[data-scope]", root).forEach(b => b.onclick = () => {
      this.projectsScope = b.dataset.scope;
      M.setPref(App.me.id, "projectsScope", b.dataset.scope);
      App.render();
    });
    var tab = this.projectsTab;
    if (tab === "list") this.bindOrders(root);
    if (tab === "board") this.bindBoard(root);
    if (tab === "timeline") this.bindTimeline(root);
    if (tab === "calendar") this.bindCalendar(root);
    if (tab === "workload") this.bindWorkload(root);
    if (tab === "portfolios") this.bindPortfolios(root);
  },
  /* ---------------- Portfolios ---------------- */
  portfolios() {
    var s = Store.state;
    return `<div class="view-anim">
      <div class="portfolio-grid">
        ${s.portfolios.map(p => {
      var r = D.portfolioRollup(p.id);
      var open = r.orders.filter(o => !o.archived);
      var eng = r.orders.filter(o => o.type === "eng").length;
      var due = isFinite(r.maxDue) ? fmtDue(r.maxDue) : null;
      /* The card opens the portfolio; the pencil edits it. It used to be
         one big button with nowhere to rename or delete from — the editor
         existed and nothing could reach it. */
      var c = D.jobColor("pf:" + p.id);
      return `<div class="portfolio-card" style="--job:var(--${c});--job-soft:var(--${c}-soft)">
            <button class="pf-main" data-portfolio="${p.id}">
              <div class="ph">
                <span class="ico pf-ico">${pfIcon(p, 21)}</span>
                <span class="grow"><b>${esc(p.name)}</b>
                <span>${r.orders.length} project${r.orders.length === 1 ? "" : "s"}${eng ? ` · ${eng} engineering` : ""}${open.length ? "" : " · all done"}</span></span>
                ${due ? `<span class="due-chip ${due.cls}">${due.label}</span>` : ""}
              </div>
              <div class="prog-row">
                <div class="progress ${r.pct === 100 ? "done" : ""}"><i style="width:${r.pct}%"></i></div>
                <span class="t-caption">${r.done}/${r.total} tasks</span>
              </div>
              <div class="pills">
                ${Object.entries(r.statuses).map(([st, n]) => pillHtml(st, `${n} ${D.statusLabel[st]}`)).join("")}
              </div>
            </button>
            <button class="icon-btn pf-edit" data-pf-edit="${p.id}" title="Rename, change the icon, or delete">${icon("pencil", 14)}</button>
          </div>`;
    }).join("")}
        <button class="portfolio-card portfolio-new" id="pf-add">＋ New portfolio</button>
      </div>
      <div class="t-caption" style="margin-top:14px;max-width:760px;line-height:1.55">
        <span>A portfolio is a job you file by hand. To put a project in one, open the project and set its Portfolio.</span><br>
        <span>Projects nobody filed are grouped anyway — by the name they share and by customer — so the board still shows one row per job.</span>
      </div>
    </div>`;
  },
  bindPortfolios(root) {
    $$("[data-portfolio]", root).forEach(b => b.onclick = () => {
      this.ordersFilter = "all";
      this.portfolioFilter = b.dataset.portfolio;
      this.projectsTab = "list";
      App.render();
    });
    $$("[data-pf-edit]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      this.portfolioModal(b.dataset.pfEdit);
    });
    $("#pf-add", root).onclick = () => this.portfolioModal();
  },
  portfolioModal(pid) {
    var p = pid ? D.portfolio(pid) : null;
    Modal.open(`
      <header><h2>${p ? "Edit portfolio" : "New portfolio"}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="pf-name" value="${esc((p === null || p === void 0 ? void 0 : p.name) || "")}" placeholder="e.g. Hotel Vilnius fit-out"></div>
          <div class="field"><label>Icon</label><button class="mat-ico" id="pf-icon" type="button" data-ic="${(p === null || p === void 0 ? void 0 : p.ic) || "folder"}" style="cursor:pointer">${pfIcon(p || {
      ic: "folder"
    }, 19)}</button></div>
        </div>
        <div class="field"><label>Colour</label>
          <div class="swatches" id="pf-colors">
            <button type="button" class="sw sw-auto ${p && p.color ? "" : "on"}" data-c="" title="Chosen from the name — stable, and never red">A</button>
            ${["blue", "indigo", "teal", "purple", "green", "orange", "red", "gray"].map(c => `<button type="button" class="sw ${p && p.color === c ? "on" : ""}" data-c="${c}" style="--sw:var(--${c})" title="${c}"></button>`).join("")}
          </div>
        </div>
        ${p ? `<button class="btn danger" id="pf-del" style="align-self:flex-start">Delete portfolio</button>` : ""}
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="pf-save">${p ? "Save" : "Create"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var iconBtn = $("#pf-icon", modal);
      iconBtn.onclick = () => Popover.open(iconBtn, `<div class="icon-grid">${PORTFOLIO_IC_KEYS.map(k => `<button data-ic="${k}" title="${k}">${icon(k, 17)}</button>`).join("")}</div>`, pop => {
        $$("[data-ic]", pop).forEach(ib => ib.onclick = () => {
          iconBtn.dataset.ic = ib.dataset.ic;
          iconBtn.innerHTML = icon(ib.dataset.ic, 19);
          Popover.close();
        });
      });
      var color = p && p.color || "";
      $$("#pf-colors .sw", modal).forEach(b => b.onclick = () => {
        color = b.dataset.c;
        $$("#pf-colors .sw", modal).forEach(x => x.classList.toggle("on", x === b));
      });
      $("#pf-save", modal).onclick = () => {
        var name = $("#pf-name", modal).value.trim();
        if (!name) {
          $("#pf-name", modal).focus();
          return;
        }
        if (p) M.updatePortfolio(p.id, {
          name,
          ic: iconBtn.dataset.ic || "folder",
          color: color || null
        });else M.addPortfolio(name, "📁", App.me.id, iconBtn.dataset.ic || "folder", color || null);
        Modal.close();
        App.render();
        Toast.show(p ? "Portfolio updated" : `Portfolio “${name}” created`, {
          emoji: "🗄"
        });
      };
      var del = $("#pf-del", modal);
      if (del) del.onclick = () => {
        M.deletePortfolio(p.id, App.me.id);
        Modal.close();
        App.render();
        Toast.show("Portfolio deleted — projects kept", {
          emoji: "🗑"
        });
      };
    });
  },
  /* ---------------- Timeline (Gantt) ---------------- */
  DAY_W: 34,
  tlRange() {
    var active = Store.state.orders.filter(o => !o.archived && (o.type || "prod") === this.scopeType());
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var start = today.getTime() - 7 * DAY;
    var end = today.getTime() + 21 * DAY;
    var _iterator = _createForOfIteratorHelper(active),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var o = _step.value;
        if (o.due + 4 * DAY > end) end = o.due + 4 * DAY;
        if (o.createdAt - 2 * DAY < start) start = Math.max(o.createdAt - 2 * DAY, today.getTime() - 30 * DAY);
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return {
      start,
      end,
      days: Math.round((end - start) / DAY) + 1
    };
  },
  timeline() {
    var _this$tlRange = this.tlRange(),
      start = _this$tlRange.start,
      days = _this$tlRange.days;
    var W = this.DAY_W;
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var active = Store.state.orders.filter(o => !o.archived && (o.type || "prod") === this.scopeType()).sort((a, b) => a.due - b.due);
    var dayList = Array.from({
      length: days
    }, (_, i) => new Date(start + i * DAY));

    /* month header segments */
    var months = [];
    for (var _i = 0, _dayList = dayList; _i < _dayList.length; _i++) {
      var d = _dayList[_i];
      var key = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      if (!months.length || months[months.length - 1].key !== key) months.push({
        key,
        n: 0
      });
      months[months.length - 1].n++;
    }
    var todayX = Math.round((today.getTime() - start) / DAY) * W;
    return `<div class="tl-scroll view-anim">
      <div class="tl">
        <div class="tl-head">
          <div class="tl-label-col">Order</div>
          <div>
            <div class="tl-months">${months.map(m => `<div class="tl-month" style="width:${m.n * W}px">${m.key}</div>`).join("")}</div>
            <div class="tl-days">${dayList.map(d => {
      var wd = d.getDay();
      var isToday = d.getTime() === today.getTime();
      return `<div class="tl-day ${wd === 0 || wd === 6 ? "weekend" : ""} ${isToday ? "today" : ""}">${d.getDate()}</div>`;
    }).join("")}</div>
          </div>
        </div>
        <div class="tl-body">
          ${active.map(o => {
      var _D$station;
      var st = D.orderStatus(o);
      var cls = {
        running: "s-running",
        paused: "s-paused",
        blocked: "s-blocked",
        queued: "s-queued",
        ready: "s-ready"
      }[st] || "s-queued";
      var p = D.progress(o);
      var barStart = Math.max(o.createdAt, start);
      var x = Math.round((barStart - start) / DAY) * W;
      var wDays = Math.max(1, Math.round((o.due - barStart) / DAY) + 1);
      var w = wDays * W - 6;
      var cur = D.currentOp(o);
      return `<div class="tl-row">
              <div class="tl-label-col tl-row-label" data-order="${o.id}">
                <b>${esc(o.num)} · ${esc(o.product)}</b>
                <span>${cur ? esc(((_D$station = D.station(cur.stationId)) === null || _D$station === void 0 ? void 0 : _D$station.name) || "") : "Ready to ship"} · ${p.done}/${p.total}</span>
              </div>
              <div class="tl-canvas" style="width:${days * W}px">
                ${dayList.map((d, i) => d.getDay() === 0 || d.getDay() === 6 ? `<div class="tl-grid-day weekend" style="left:${i * W}px"></div>` : "").join("")}
                <div class="tl-today-line" style="left:${todayX + W / 2}px"></div>
                <div class="tl-bar ${cls}" data-tl-bar="${o.id}" style="left:${x + 3}px;width:${w}px">
                  <span class="fill" style="width:${p.pct}%"></span>
                  <span>${o.priority === "rush" ? "🔥 " : ""}${esc(o.num)}</span>
                  ${w > 150 ? `<span style="font-weight:560;opacity:.75">${esc(o.product.slice(0, Math.floor(w / 9)))}</span>` : ""}
                  <span class="tl-handle" data-tl-handle="${o.id}" title="Drag to change due date"></span>
                </div>
              </div>
            </div>`;
    }).join("")}
        </div>
      </div>
      <div class="tl-legend">
        <span><i style="background:var(--blue)"></i>In production</span>
        <span><i style="background:var(--orange)"></i>Paused</span>
        <span><i style="background:var(--red)"></i>Blocked</span>
        <span><i style="background:var(--gray)"></i>Not started</span>
        <span><i style="background:var(--green)"></i>Ready</span>
        <span style="margin-left:auto">Bars run from order creation to due date — drag the right edge to reschedule</span>
      </div>
    </div>`;
  },
  bindTimeline(root) {
    $$(".tl-row-label", root).forEach(el => el.onclick = () => Drawer.open(el.dataset.order));
    var drag = null; // {orderId, bar, startX, origW, days}
    $$("[data-tl-handle]", root).forEach(h => {
      h.onpointerdown = e => {
        e.preventDefault();
        e.stopPropagation();
        var bar = h.closest(".tl-bar");
        drag = {
          orderId: h.dataset.tlHandle,
          bar,
          startX: e.clientX,
          origW: bar.offsetWidth,
          days: 0
        };
        bar.classList.add("resizing");
        h.setPointerCapture(e.pointerId);
      };
      h.onpointermove = e => {
        if (!drag) return;
        var dx = e.clientX - drag.startX;
        drag.days = Math.round(dx / this.DAY_W);
        var w = Math.max(this.DAY_W - 6, drag.origW + drag.days * this.DAY_W);
        drag.bar.style.width = w + "px";
      };
      h.onpointerup = () => {
        if (!drag) return;
        var _drag = drag,
          orderId = _drag.orderId,
          days = _drag.days,
          bar = _drag.bar;
        bar.classList.remove("resizing");
        drag = null;
        if (days !== 0) {
          var o = D.order(orderId);
          var snap = Store.snapshot();
          M.updateOrderLogged(orderId, {
            due: o.due + days * DAY
          }, App.me.id);
          App.render();
          Toast.show(`${o.num} due ${fmtDate(o.due)}`, {
            emoji: "📅",
            undo: () => {
              Store.restore(snap);
              App.render();
            }
          });
        }
      };
    });
    $$("[data-tl-bar]", root).forEach(bar => {
      bar.onclick = e => {
        if (e.target.closest("[data-tl-handle]")) return;
        Drawer.open(bar.dataset.tlBar);
      };
    });
  },
  /* ---------------- Calendar (month) ---------------- */
  calY: null,
  calM: null,
  calendar() {
    var now = new Date();
    if (this.calY === null) {
      this.calY = now.getFullYear();
      this.calM = now.getMonth();
    }
    var first = new Date(this.calY, this.calM, 1);
    var title = first.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
    /* grid starts Monday */
    var gridStart = new Date(first);
    gridStart.setDate(1 - (first.getDay() + 6) % 7);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var cells = Array.from({
      length: 42
    }, (_, i) => {
      var d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      return d;
    });
    var rows = cells[35].getMonth() === this.calM ? 42 : 35;
    var byDay = d => {
      var a = d.getTime(),
        b = a + DAY;
      return Store.state.orders.filter(o => o.due >= a && o.due < b && (o.type || "prod") === this.scopeType()).sort((x, y) => x.archived - y.archived || prioRank(x) - prioRank(y));
    };
    return `<div class="view-anim">
      <div class="cal-head">
        <h2>${title}</h2>
        <button class="icon-btn" id="cal-prev">‹</button>
        <button class="icon-btn" id="cal-next">›</button>
        <button class="btn ghost" id="cal-today" style="padding:6px 13px;font-size:12.5px">Today</button>
        <div class="grow"></div>
        <span class="t-caption">Chips sit on their due date — drag to reschedule</span>
      </div>
      <div class="cal-grid">
        ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => `<div class="cal-dow">${d}</div>`).join("")}
        ${cells.slice(0, rows).map(d => {
      var inMonth = d.getMonth() === this.calM;
      var isToday = d.getTime() === today.getTime();
      var orders = byDay(d);
      var shown = orders.slice(0, 3);
      return `<div class="cal-cell ${inMonth ? "" : "other"} ${isToday ? "today" : ""}" data-cal-day="${d.getTime()}">
            <span class="d">${d.getDate()}</span>
            ${shown.map(o => {
        var st = D.orderStatus(o);
        return `<div class="cal-chip s-${st}" ${o.archived ? "" : `draggable="true"`} data-cal-order="${o.id}" title="${esc(o.num)} · ${esc(o.product)}">
                <span>${o.priority === "rush" ? "🔥 " : ""}${esc(o.num)} ${esc(o.product)}</span>
              </div>`;
      }).join("")}
            ${orders.length > 3 ? `<div class="cal-more">+${orders.length - 3} more</div>` : ""}
          </div>`;
    }).join("")}
      </div>
    </div>`;
  },
  bindCalendar(root) {
    $("#cal-prev", root).onclick = () => {
      this.calM--;
      if (this.calM < 0) {
        this.calM = 11;
        this.calY--;
      }
      App.render();
    };
    $("#cal-next", root).onclick = () => {
      this.calM++;
      if (this.calM > 11) {
        this.calM = 0;
        this.calY++;
      }
      App.render();
    };
    $("#cal-today", root).onclick = () => {
      var n = new Date();
      this.calY = n.getFullYear();
      this.calM = n.getMonth();
      App.render();
    };
    var dragId = null;
    $$("[data-cal-order]", root).forEach(chip => {
      chip.onclick = () => Drawer.open(chip.dataset.calOrder);
      chip.ondragstart = e => {
        dragId = chip.dataset.calOrder;
        chip.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", dragId);
      };
      chip.ondragend = () => {
        chip.classList.remove("dragging");
        dragId = null;
      };
    });
    $$("[data-cal-day]", root).forEach(cell => {
      cell.ondragover = e => {
        e.preventDefault();
        cell.classList.add("drag-over");
      };
      cell.ondragleave = () => cell.classList.remove("drag-over");
      cell.ondrop = e => {
        e.preventDefault();
        cell.classList.remove("drag-over");
        var id = e.dataTransfer.getData("text/plain") || dragId;
        if (!id) return;
        var o = D.order(id);
        var newDue = parseInt(cell.dataset.calDay) + 12 * 3600000;
        if (new Date(newDue).toDateString() === new Date(o.due).toDateString()) return;
        var snap = Store.snapshot();
        M.updateOrderLogged(id, {
          due: newDue
        }, App.me.id);
        App.render();
        Toast.show(`${o.num} due ${fmtDate(newDue)}`, {
          emoji: "🗓",
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
    });
  },
  /* ---------------- Workload ---------------- */
  workload() {
    if (this.scopeType() === "eng") return this.workloadEng(); // design = tracked by projects, not tasks
    var engScope = false;
    var workers = Store.state.members.filter(m => m.role === "worker");
    var loads = workers.map(m => {
      var jobs = [];
      var _iterator2 = _createForOfIteratorHelper(Store.state.orders),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var o = _step2.value;
          if (o.archived || o.type === "eng" !== engScope) continue;
          var _iterator3 = _createForOfIteratorHelper(o.ops),
            _step3;
          try {
            for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
              var op = _step3.value;
              if (op.assigneeId === m.id && op.status !== "done") jobs.push({
                order: o,
                op,
                remMins: Math.max(op.estMins - Math.round(D.opElapsed(op) / 60000), 15)
              });
            }
          } catch (err) {
            _iterator3.e(err);
          } finally {
            _iterator3.f();
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
      jobs.sort((a, b) => prioRank(a.order) - prioRank(b.order) || a.order.due - b.order.due);
      return {
        m,
        jobs,
        total: jobs.reduce((s, j) => s + j.remMins, 0)
      };
    });
    var maxLoad = Math.max(...loads.map(l => l.total), 480);
    var COLORS = ["var(--blue)", "var(--indigo)", "var(--teal)", "var(--purple)", "var(--orange)", "var(--green)"];
    return `<div class="view-anim">
      <div class="section-title"><h2 class="muted" style="font-weight:500">Estimated remaining work per person — a full day is 8h</h2></div>
      <div class="panel">
        ${loads.map(({
      m,
      jobs,
      total
    }) => {
      var run = D.runningOpOf(m.id);
      var over = total > 480;
      return `<div class="wl-row">
            <div class="wl-who">
              ${avatarHtml(m, "md")}
              <span class="meta"><b>${esc(m.name)}</b><span>${run ? `🟢 on ${esc(run.order.num)}` : esc(m.trade)}</span></span>
            </div>
            <div class="wl-bar-area">
              ${jobs.length ? `<div class="wl-bar">
                ${jobs.map((j, i) => {
        var _D$station2;
        return `<div class="wl-seg" data-order="${j.order.id}"
                  style="width:${Math.max(j.remMins / maxLoad * 100, 4)}%;background:${COLORS[i % COLORS.length]}"
                  title="${esc(j.order.num)} · ${esc(((_D$station2 = D.station(j.op.stationId)) === null || _D$station2 === void 0 ? void 0 : _D$station2.name) || "")} · ~${fmtDur(j.remMins * 60000)}">${esc(j.order.num)}</div>`;
      }).join("")}
              </div>` : `<div class="t-caption" style="padding:3px 0">No assigned work — free for new jobs</div>`}
            </div>
            <div class="wl-total ${over ? "wl-over" : ""}">
              <b>${fmtDur(total * 60000)}</b>
              <span>${jobs.length} job${jobs.length === 1 ? "" : "s"}${over ? " · over capacity" : ""}</span>
            </div>
          </div>`;
    }).join("")}
      </div>
    </div>`;
  },
  /* Engineering workload — by project (a designer carries projects, not part-minutes) */
  workloadEng() {
    var CAP = 4; // soft concurrent-project capacity per engineer
    var COLORS = ["var(--blue)", "var(--indigo)", "var(--teal)", "var(--purple)", "var(--orange)", "var(--green)"];
    var engProjects = Store.state.orders.filter(o => o.type === "eng" && !o.archived);
    var people = Store.state.members.filter(m => m.role === "engineer");
    // include a manager only if they actually carry a design project
    Store.state.members.filter(m => m.role === "manager").forEach(m => {
      if (engProjects.some(o => o.ops.some(op => op.assigneeId === m.id && op.status !== "done"))) people.push(m);
    });
    var loads = people.map(m => {
      var projects = engProjects.filter(o => o.ops.some(op => op.assigneeId === m.id && op.status !== "done"));
      projects.sort((a, b) => prioRank(a) - prioRank(b) || a.due - b.due);
      return {
        m,
        projects
      };
    });
    var unassigned = engProjects.filter(o => !o.ops.some(op => op.assigneeId && op.status !== "done"));
    var maxP = Math.max(...loads.map(l => l.projects.length), CAP);
    return `<div class="view-anim">
      <div class="section-title"><h2 class="muted" style="font-weight:500">Active design projects per person — a comfortable load is ${CAP} at once</h2></div>
      <div class="panel">
        ${loads.map(({
      m,
      projects
    }) => {
      var over = projects.length > CAP;
      var run = D.runningOpOf(m.id);
      return `<div class="wl-row">
            <div class="wl-who">
              ${avatarHtml(m, "md")}
              <span class="meta"><b>${esc(m.name)}</b><span>${run && run.order.type === "eng" ? `on ${esc(run.order.num)}` : esc(m.trade)}</span></span>
            </div>
            <div class="wl-bar-area">
              ${projects.length ? `<div class="wl-bar">
                ${projects.map((o, i) => {
        var _D$station3;
        var cur = D.currentOp(o);
        var due = fmtDue(o.due);
        return `<div class="wl-seg" data-order="${o.id}"
                    style="width:${100 / maxP}%;background:${COLORS[i % COLORS.length]}"
                    title="${esc(o.num)} · ${cur ? esc(((_D$station3 = D.station(cur.stationId)) === null || _D$station3 === void 0 ? void 0 : _D$station3.name) || "") : "ready to hand off"} · ${due.label}">${esc(o.num)}</div>`;
      }).join("")}
              </div>` : `<div class="t-caption" style="padding:3px 0">No active design projects — free for new work</div>`}
            </div>
            <div class="wl-total ${over ? "wl-over" : ""}">
              <b>${projects.length}</b>
              <span>project${projects.length === 1 ? "" : "s"}${over ? " · over capacity" : ""}</span>
            </div>
          </div>`;
    }).join("")}
      </div>
      ${unassigned.length ? `<div class="panel" style="margin-top:14px">
        <header><h2>${icon("compass", 15)} Unassigned projects <span class="count-badge">${unassigned.length}</span></h2></header>
        <div class="panel-list">
          ${unassigned.sort((a, b) => prioRank(a) - prioRank(b) || a.due - b.due).map(o => {
      var _D$station4;
      var cur = D.currentOp(o);
      var due = fmtDue(o.due);
      return `<button class="panel-row" data-order="${o.id}">
              <span style="color:var(--text-3)">${cur ? stIcon(D.station(cur.stationId), 17) : icon("check-circle", 17)}</span>
              <span class="grow"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)}</b><span>${cur ? `at ${esc(((_D$station4 = D.station(cur.stationId)) === null || _D$station4 === void 0 ? void 0 : _D$station4.name) || "")}` : "ready to hand off"} · needs an engineer</span></span>
              <span class="due-chip ${due.cls}">${due.label}</span>
            </button>`;
    }).join("")}
        </div>
      </div>` : ""}
    </div>`;
  },
  bindWorkload(root) {
    $$(".wl-seg", root).forEach(seg => seg.onclick = () => Drawer.open(seg.dataset.order));
    $$(".panel-row[data-order]", root).forEach(b => b.onclick = () => Drawer.open(b.dataset.order));
  },
  /* ---------------- Dashboard ---------------- */
  dashboard() {
    if (App.isEngineer()) return this.engineerDashboard();
    var s = Store.state;
    var active = s.orders.filter(o => !o.archived);
    var inProd = active.filter(o => ["running", "paused"].includes(D.orderStatus(o)) || o.ops.some(op => op.status === "done"));
    var weekEnd = Date.now() + 7 * DAY;
    var dueWeek = active.filter(o => o.due <= weekEnd && D.orderStatus(o) !== "ready");
    var overdue = active.filter(o => fmtDue(o.due).cls === "overdue" && D.orderStatus(o) !== "ready");
    var blocked = active.filter(o => D.orderStatus(o) === "blocked");
    var ready = active.filter(o => o.type !== "eng" && D.orderStatus(o) === "ready");
    var engActive = active.filter(o => o.type === "eng");
    var low = D.lowStock();
    var shortfalls = D.demandShortfalls(); // measured against the work in hand
    var runningOps = [];
    var _iterator4 = _createForOfIteratorHelper(active),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var o = _step4.value;
        var _iterator5 = _createForOfIteratorHelper(o.ops),
          _step5;
        try {
          for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
            var op = _step5.value;
            if (op.status === "running") runningOps.push({
              order: o,
              op
            });
          }
        } catch (err) {
          _iterator5.e(err);
        } finally {
          _iterator5.f();
        }
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    var attention = [...blocked, ...overdue.filter(o => !blocked.includes(o))];
    var bkDays = Store.exportOverdueDays();
    var nagging = bkDays >= EXPORT_NAG_DAYS && !App._nagHidden; // "Not now" lasts this session

    return `<div class="view-anim">
      ${nagging ? `<div class="backup-nag">
        <span style="color:var(--orange)">${icon("save", 20)}</span>
        <span class="grow"><b>No backup downloaded in ${bkDays} days</b>
          <span>Everything lives in this browser. Download a copy you can keep off the machine.</span></span>
        <button class="btn" id="nag-export">Export backup</button>
        <button class="icon-btn" id="nag-hide" title="Not now">${icon("x", 15)}</button>
      </div>` : ""}
      <div class="kpis">
        <div class="kpi" data-goto="orders"><span class="val">${active.length}</span><span class="lbl">Open orders</span><span class="sub muted">${inProd.length} in production</span></div>
        <div class="kpi" data-goto="orders" data-f="week"><span class="val">${dueWeek.length}</span><span class="lbl">Due this week</span><span class="sub muted">${fmtDate(Date.now())} – ${fmtDate(weekEnd)}</span></div>
        <div class="kpi ${overdue.length ? "warn" : ""}" data-goto="orders" data-f="overdue"><span class="val">${overdue.length}</span><span class="lbl">Overdue</span><span class="sub" style="color:var(--red)">${overdue.length ? "needs action" : ""}</span></div>
        <div class="kpi ${shortfalls.length ? "warn" : low.length ? "warn" : ""}" data-goto="warehouse" data-wtab="${shortfalls.length ? "demand" : "materials"}"><span class="val">${shortfalls.length || low.length}</span><span class="lbl">${shortfalls.length ? "Short for the jobs" : "Low stock"}</span><span class="sub" style="color:var(--red)">${shortfalls.length ? `${D.blockedByStock().length} project${D.blockedByStock().length === 1 ? "" : "s"} waiting` : low.length ? "reorder soon" : ""}</span></div>
        <div class="kpi ${ready.length ? "ok" : ""}" data-goto="orders" data-f="ready"><span class="val">${ready.length}</span><span class="lbl">Ready to ship</span><span class="sub" style="color:var(--green)">${ready.length ? "good to go" : ""}</span></div>
      </div>

      <div class="flow-strip-wrap">
        <div class="t-label" style="margin-bottom:12px">Production flow — every task, right now</div>
        <div class="flow-strip">
          ${D.stationsOf("prod").map(st => {
      var q = D.stationQueue(st.id);
      return `<div class="flow-station" data-station="${st.id}">
              <div class="head"><span class="ico">${stIcon(st, 15)}</span><b>${esc(st.name)}</b></div>
              <div class="n ${q.length ? "" : "zero"}">${q.length}</div>
              <div class="flow-chips">
                ${q.slice(0, 3).map(({
        order,
        op
      }) => `<span class="flow-chip ${op.status === "running" ? "running" : ""} ${op.status === "blocked" ? "blocked" : ""}" title="${esc(order.num)}${op.group ? " · " + esc(op.group) : ""}">${esc(order.num)}${op.group ? "·" + esc(op.group[0]) : ""} ${op.status === "running" ? "●" : ""}${op.status === "blocked" ? "✕" : ""}</span>`).join("")}
                ${q.length > 3 ? `<span class="flow-chip">+${q.length - 3} more</span>` : ""}
              </div>
            </div>`;
    }).join("")}
          <div class="flow-station" data-station="__ready">
            <div class="head"><span class="ico" style="color:var(--green)">${icon("check-circle", 15)}</span><b>Ready</b></div>
            <div class="n ${ready.length ? "" : "zero"}" style="color:var(--green)">${ready.length}</div>
            <div class="flow-chips">${ready.slice(0, 3).map(o => `<span class="flow-chip">${esc(o.num)}</span>`).join("")}</div>
          </div>
        </div>
      </div>

      <div class="dash-grid">
        <div style="display:flex;flex-direction:column;gap:16px">
          <div class="panel">
            <header><h2>${icon("alert", 15)} Needs attention</h2><button class="link" data-goto="orders">View all</button></header>
            <div class="panel-list">
              ${attention.length || low.length || shortfalls.length ? `
                ${attention.slice(0, 5).map(o => {
      var _D$station5;
      var st = D.orderStatus(o);
      var due = fmtDue(o.due);
      var cur = D.currentOp(o);
      return `<button class="panel-row" data-order="${o.id}">
                    <span style="color:var(--red)">${icon(st === "blocked" ? "ban" : "clock", 17)}</span>
                    <span class="grow"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)}</b>
                    <span>${st === "blocked" ? esc((cur === null || cur === void 0 ? void 0 : cur.blockNote) || "Blocked") : `at ${esc(((_D$station5 = D.station(cur === null || cur === void 0 ? void 0 : cur.stationId)) === null || _D$station5 === void 0 ? void 0 : _D$station5.name) || "—")}`}</span></span>
                    <span class="due-chip ${due.cls}">${due.label}</span>
                    ${pillHtml(st, D.statusLabelFor(o, st))}
                  </button>`;
    }).join("")}
                ${shortfalls.slice(0, 4).map(r => `<button class="panel-row" data-goto="warehouse" data-wtab="demand">
                  <span style="color:var(--red)">${icon("trend-down", 17)}</span>
                  <span class="grow"><b>${esc(r.name)}</b><span>${r.lines.length} project${r.lines.length === 1 ? "" : "s"} need ${r.need} ${esc(r.unit)}${r.stock === null ? " · not in the warehouse" : ` · ${r.stock} on the shelf`}</span></span>
                  <span class="low-badge">${Math.round(r.short * 100) / 100} short</span>
                </button>`).join("")}
                ${!shortfalls.length ? low.slice(0, 4).map(m => `<button class="panel-row" data-goto="warehouse">
                  <span style="color:var(--red)">${icon("trend-down", 17)}</span>
                  <span class="grow"><b>${esc(m.name)}</b><span>only ${m.qty} ${esc(m.unit)} left · min ${m.minQty}</span></span>
                  <span class="low-badge">Low stock</span>
                </button>`).join("") : ""}` : `<div class="empty-mini"><span class="big">${icon("sparkles", 26)}</span>All clear — nothing blocked, overdue or low</div>`}
            </div>
          </div>

          <div class="panel">
            <header><h2><span class="pill running" style="padding:2px 8px"><span class="dot"></span></span> On the floor right now</h2></header>
            <div class="panel-list">
              ${runningOps.length ? runningOps.map(({
      order,
      op
    }) => {
      var m = D.member(op.assigneeId);
      var st = D.station(op.stationId);
      var item = D.item(order, op.itemId);
      return `<button class="panel-row" data-order="${order.id}">
                  ${avatarHtml(m, "md")}
                  <span class="grow"><b>${esc(m ? m.name : "—")} · ${esc(st.name)}${op.group ? ` · ${esc(op.group)}` : ""}</b>
                  <span>${esc(order.num)} — ${esc(order.product)}${item && item.qty > 1 ? ` · ${op.qtyDone}/${item.qty} pcs` : ""}</span></span>
                  <span class="pill running"><span class="dot"></span><span class="t-num" data-timer="${order.id}/${op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(op))}</span></span>
                </button>`;
    }).join("") : `<div class="empty-mini"><span class="big">${icon("zzz", 26)}</span>Nobody has a job running</div>`}
            </div>
          </div>

          ${engActive.length ? `<div class="panel">
            <header><h2>${icon("pencil", 15)} Engineering</h2><button class="link" data-goto-eng>View all</button></header>
            <div class="panel-list">
              ${engActive.map(o => {
      var _D$member;
      var cur = D.currentOp(o);
      var st = cur ? D.station(cur.stationId) : null;
      var due = fmtDue(o.due);
      var p = D.progress(o);
      return `<button class="panel-row" data-order="${o.id}">
                  <span style="color:var(--text-2)">${st ? stIcon(st, 17) : icon("check-circle", 17)}</span>
                  <span class="grow"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)}</b>
                  <span>${st ? `at ${esc(st.name)}` : "complete"} · ${p.done}/${p.total} stages${cur && cur.assigneeId ? ` · ${esc(((_D$member = D.member(cur.assigneeId)) === null || _D$member === void 0 ? void 0 : _D$member.name) || "")}` : ""}</span></span>
                  <span class="due-chip ${due.cls}">${due.label}</span>
                  ${pillHtml(D.orderStatus(o), D.statusLabelFor(o, D.orderStatus(o)))}
                </button>`;
    }).join("")}
            </div>
          </div>` : ""}
        </div>

        <div class="panel">
          <header><h2>Recent activity</h2><button class="link" data-goto="activity">View all</button></header>
          <div class="panel-list">
            ${s.activity.slice(0, 9).map(a => {
      var m = D.member(a.who);
      return `<div class="activity-row">
                ${avatarHtml(m, "sm")}
                <span class="txt"><b>${esc(m ? m.name : "Someone")}</b> ${activityHtml(a.text)}</span>
                <span class="when">${fmtAgo(a.ts)}</span>
              </div>`;
    }).join("")}
          </div>
        </div>
      </div>
    </div>`;
  },
  /* Engineer dashboard — design projects only, no production/warehouse noise */
  engineerDashboard() {
    var s = Store.state;
    var eng = s.orders.filter(o => o.type === "eng" && !o.archived);
    var weekEnd = Date.now() + 7 * DAY;
    var dueWeek = eng.filter(o => o.due <= weekEnd && D.orderStatus(o) !== "ready");
    var overdue = eng.filter(o => fmtDue(o.due).cls === "overdue" && D.orderStatus(o) !== "ready");
    var ready = eng.filter(o => D.orderStatus(o) === "ready"); // done → ready to hand off
    var mine = eng.filter(o => o.ops.some(op => D.opAssignedTo(op, App.me.id) && op.status !== "done"));
    var engStations = D.stationsOf("eng");
    return `<div class="view-anim">
      <div class="kpis">
        <div class="kpi" data-goto="projects"><span class="val">${eng.length}</span><span class="lbl">Active projects</span><span class="sub muted">projektavimas</span></div>
        <div class="kpi" data-goto="projects"><span class="val">${mine.length}</span><span class="lbl">Assigned to me</span><span class="sub muted">in progress</span></div>
        <div class="kpi ${overdue.length ? "warn" : ""}" data-goto="projects"><span class="val">${overdue.length}</span><span class="lbl">Overdue</span><span class="sub" style="color:var(--red)">${overdue.length ? "needs action" : ""}</span></div>
        <div class="kpi ${ready.length ? "ok" : ""}" data-goto="projects"><span class="val">${ready.length}</span><span class="lbl">Ready to hand off</span><span class="sub" style="color:var(--green)">${ready.length ? "to production" : ""}</span></div>
      </div>

      <div class="flow-strip-wrap">
        <div class="t-label" style="margin-bottom:12px">Design flow — projects at each stage</div>
        <div class="flow-strip">
          ${engStations.map(st => {
      var q = D.stationQueue(st.id);
      return `<div class="flow-station" data-station="${st.id}">
              <div class="head"><span class="ico">${stIcon(st, 15)}</span><b>${esc(st.name)}</b></div>
              <div class="n ${q.length ? "" : "zero"}">${q.length}</div>
              <div class="flow-chips">${q.slice(0, 3).map(({
        order
      }) => `<span class="flow-chip">${esc(order.num)}</span>`).join("")}${q.length > 3 ? `<span class="flow-chip">+${q.length - 3}</span>` : ""}</div>
            </div>`;
    }).join("")}
          <div class="flow-station" data-station="__ready">
            <div class="head"><span class="ico" style="color:var(--green)">${icon("factory", 15)}</span><b>Hand off</b></div>
            <div class="n ${ready.length ? "" : "zero"}" style="color:var(--green)">${ready.length}</div>
            <div class="flow-chips">${ready.slice(0, 3).map(o => `<span class="flow-chip">${esc(o.num)}</span>`).join("")}</div>
          </div>
        </div>
      </div>

      <div class="dash-grid">
        <div class="panel">
          <header><h2>${icon("compass", 15)} My design projects</h2><button class="link" data-goto="projects">View all</button></header>
          <div class="panel-list">
            ${eng.length ? eng.slice(0, 8).map(o => {
      var cur = D.currentOp(o);
      var st = cur ? D.station(cur.stationId) : null;
      var due = fmtDue(o.due);
      var p = D.progress(o);
      return `<button class="panel-row" data-order="${o.id}">
                <span style="color:var(--text-2)">${st ? stIcon(st, 17) : icon("check-circle", 17)}</span>
                <span class="grow"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)}</b><span>${st ? `at ${esc(st.name)}` : "ready to hand off"} · ${p.done}/${p.total} stages</span></span>
                <span class="due-chip ${due.cls}">${due.label}</span>${pillHtml(D.orderStatus(o), D.statusLabelFor(o, D.orderStatus(o)))}
              </button>`;
    }).join("") : `<div class="empty-mini"><span class="big">${icon("compass", 26)}</span>No design projects yet</div>`}
          </div>
        </div>
        <div class="panel">
          <header><h2>Recent activity</h2><button class="link" data-goto="activity">View all</button></header>
          <div class="panel-list">
            ${s.activity.filter(a => {
      var o = a.orderId ? D.order(a.orderId) : null;
      return !o || o.type === "eng";
    }).slice(0, 9).map(a => {
      var mem = D.member(a.who);
      return `<div class="activity-row">${avatarHtml(mem, "sm")}<span class="txt"><b>${esc(mem ? mem.name : "Someone")}</b> ${activityHtml(a.text)}</span><span class="when">${fmtAgo(a.ts)}</span></div>`;
    }).join("")}
          </div>
        </div>
      </div>
    </div>`;
  },
  bindDashboard(root) {
    $$("[data-goto]", root).forEach(b => b.onclick = () => {
      if (b.dataset.wtab) Warehouse.tab = b.dataset.wtab; // land on the right tab, not just the view
      App.navigate(b.dataset.goto, {
        filter: b.dataset.f
      });
    });
    var nagGo = $("#nag-export", root),
      nagHide = $("#nag-hide", root);
    if (nagGo) nagGo.onclick = () => {
      App.navigate("settings");
      setTimeout(() => {
        var _$;
        return (_$ = $("#set-export")) === null || _$ === void 0 ? void 0 : _$.click();
      }, 80);
    };
    if (nagHide) nagHide.onclick = () => {
      App._nagHidden = true;
      App.render();
    };
    $$("[data-goto-eng]", root).forEach(b => b.onclick = () => {
      this.projectsScope = "eng";
      M.setPref(App.me.id, "projectsScope", "eng");
      App.navigate("projects", {
        tab: "list"
      });
    });
    $$("[data-order]", root).forEach(b => b.onclick = () => Drawer.open(b.dataset.order));
    $$(".flow-station", root).forEach(b => b.onclick = () => {
      if (App.isEngineer()) App.navigate("projects", {
        tab: "board"
      });else App.navigate("board", {
        focus: b.dataset.station
      });
    });
  },
  /* ---------------- Board ---------------- */
  board(kind = "prod") {
    var s = Store.state;
    var bp = D.pref(App.me.id, "board", {});
    var density = bp.density || "comfortable";
    var filterWho = bp.assignee || "";
    var filterPrio = bp.prio || "";
    var hideEmpty = !!bp.hideEmpty;
    var byJob = bp.byJob !== false; // grouping is the default; it is what the shop asked for

    // columns already partition by station kind, so mixed projects (e.g. a design
    // project with production tasks) still surface their tasks on the right board
    var matches = ({
      order,
      op
    }) => (!filterWho || op && op.assigneeId === filterWho) && (!filterPrio || order.priority === filterPrio);
    var ready = s.orders.filter(o => !o.archived && o.type === (kind === "eng" ? "eng" : "prod") && o.ops.length && o.ops.every(op => op.status === "done")).filter(o => (!filterPrio || o.priority === filterPrio) && !filterWho);
    var cols = D.stationsOf(kind).map(st => ({
      st,
      q: D.stationQueue(st.id).filter(matches)
    })).filter(c => !hideEmpty || c.q.length);
    return `<div class="view-anim" style="display:flex;flex-direction:column;height:100%">
      <div class="board-toolbar">
        <select class="select" id="bf-who">
          <option value="">Everyone</option>
          ${s.members.filter(m => kind === "eng" ? m.role === "engineer" || m.role === "manager" : m.role === "worker").map(m => `<option value="${m.id}" ${filterWho === m.id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}
        </select>
        <select class="select" id="bf-prio">
          <option value="">All priorities</option>
          ${["rush", "high", "normal", "low"].map(p => `<option value="${p}" ${filterPrio === p ? "selected" : ""}>${p === "rush" ? "🔥 Rush" : p[0].toUpperCase() + p.slice(1)}</option>`).join("")}
        </select>
        <div class="grow"></div>
        <div class="segmented" id="bf-density">
          <button data-d="comfortable" class="${density === "comfortable" ? "active" : ""}">Comfortable</button>
          <button data-d="compact" class="${density === "compact" ? "active" : ""}">Compact</button>
        </div>
        <div class="row" style="gap:8px;font-size:12.5px;color:var(--text-2);font-weight:560">
          Group by job ${switchHtml("byJob", byJob)}
        </div>
        <div class="row" style="gap:8px;font-size:12.5px;color:var(--text-2);font-weight:560">
          Hide empty ${switchHtml("hideEmpty", hideEmpty)}
        </div>
      </div>
      ${byJob ? this.boardLanes(cols, ready, kind, density) : `<div class="board-wrap"><div class="board ${density === "compact" ? "compact" : ""}">
        ${cols.map(({
      st,
      q
    }) => `<div class="board-col" data-drop="${st.id}">
          <header><span class="ico">${stIcon(st, 15)}</span><b>${esc(st.name)}</b><span class="count-badge">${q.length}</span></header>
          <div class="board-col-cards">
            ${q.length ? q.map(({
      order,
      op
    }) => this.orderCard(order, op)).join("") : `<div class="col-empty">No tasks here</div>`}
          </div>
        </div>`).join("")}
        <div class="board-col" data-drop="__ready">
          <header><span class="ico" style="color:var(--green)">${icon("check-circle", 15)}</span><b>${kind === "eng" ? "Complete" : "Ready to ship"}</b><span class="count-badge">${ready.length}</span></header>
          <div class="board-col-cards">
            ${ready.length ? ready.map(o => this.orderCard(o, null)).join("") : `<div class="col-empty">Nothing ready yet</div>`}
          </div>
        </div>
      </div></div>`}
    </div>`;
  },
  /* ---------------- the board, one row per job ----------------
     Same columns, same cards, same drag and drop — but a customer's job is a
     lane across them, so "where is GI_SI?" is one glance along a row instead
     of hunting three cards through five columns. */
  boardLanes(cols, ready, kind, density) {
    var all = [...cols.flatMap(c => c.q.map(x => x.order)), ...ready];
    var groups = D.jobGroups([...new Map(all.map(o => [o.id, o])).values()]);
    var readyLabel = kind === "eng" ? "Complete" : "Ready to ship";
    var collapsed = D.pref(App.me.id, "boardLanes", {}) || {};
    var heads = [...cols.map(({
      st,
      q
    }) => `<div class="bg-head-cell">
        <span class="ico">${stIcon(st, 14)}</span><b>${esc(st.name)}</b><span class="count-badge">${q.length}</span>
      </div>`), `<div class="bg-head-cell"><span class="ico" style="color:var(--green)">${icon("check-circle", 14)}</span><b>${readyLabel}</b><span class="count-badge">${ready.length}</span></div>`].join("");
    var lane = g => {
      var due = g.due ? fmtDue(g.due) : null;
      var shut = !!collapsed[g.key];
      var cells = [...cols.map(({
        st,
        q
      }) => ({
        drop: st.id,
        cards: q.filter(x => g.orders.some(o => o.id === x.order.id))
      })), {
        drop: "__ready",
        cards: ready.filter(o => g.orders.some(x => x.id === o.id)).map(o => ({
          order: o,
          op: null
        }))
      }];
      return `<div class="bg-lane ${shut ? "shut" : ""}">
        <div class="bg-lane-head" style="--job:var(--${g.color});--job-soft:var(--${g.color}-soft)">
          <button class="bg-lane-toggle" data-lane="${esc(g.key)}" title="${shut ? "Expand" : "Collapse"}">
            ${icon(shut ? "chev-right" : "chev-down", 14)}
          </button>
          <span class="grow">
            <b>${esc(g.label)}</b>
            <span class="bg-lane-sub">${g.single ? esc(g.client || "one project") : `${g.orders.length} <span>pieces</span>${g.client ? ` · ${esc(g.client)}` : ""}`}</span>
            <span class="bg-lane-prog"><span class="progress ${g.pct === 100 ? "done" : ""}"><i style="width:${g.pct}%"></i></span></span>
          </span>
          ${g.overdue ? `<span class="due-chip bad" title="${g.overdue} of ${g.orders.length} past due">${g.overdue} <span>late</span></span>` : due ? `<span class="due-chip ${due.cls}">${due.label}</span>` : ""}
        </div>
        ${cells.map(c => `<div class="bg-cell ${c.cards.length ? "" : "none"}" data-drop="${c.drop}">${c.cards.map(({
        order,
        op
      }) => this.orderCard(order, op)).join("")}</div>`).join("")}
      </div>`;
    };
    return `<div class="board-wrap">
      <div class="board-grid ${density === "compact" ? "compact" : ""}" style="--bg-cols:${cols.length + 1}">
        <div class="bg-head"><div class="bg-corner">${icon("folder", 13)} <span>Job</span></div>${heads}</div>
        ${groups.length ? groups.map(lane).join("") : `<div class="bg-empty">Nothing on this board yet</div>`}
      </div>
    </div>`;
  },
  /* A card = one TASK (lane op) — an order with parallel lanes appears in several columns */
  orderCard(order, op) {
    var due = fmtDue(order.due);
    var p = D.progress(order);
    var assignee = op ? D.member(op.assigneeId) : null;
    var short = D.orderShortages(order).length;
    var item = op ? D.item(order, op.itemId) : null;
    var multi = order.items.length > 1;
    var showNum = order.num !== order.product;
    var showClient = order.client && order.client !== order.product;
    return `<div class="order-card" draggable="true" data-order="${order.id}" ${op ? `data-op="${op.id}"` : ""}>
      <div class="top">
        ${showNum ? `<span class="num">${esc(order.num)}</span>` : ""}
        ${prioHtml(order.priority)}
        ${short ? `<span title="Material shortage" style="color:var(--red)">${icon("trend-down", 13)}</span>` : ""}
        <span class="grow"></span>
        ${D.projectLink(order) ? `<button class="od-shortcut" data-od-open="${order.id}" title="Open project files in OneDrive">${icon("cloud", 13)}</button>` : ""}
        ${op && App.can("orders.assign") ? `<button class="od-shortcut card-block ${op.status === "blocked" ? "on" : ""}" data-card-block="${order.id}:${op.id}" title="${op.status === "blocked" ? "Edit or clear this problem" : "Report a problem"}">${icon("ban", 13)}</button>` : ""}
        <span class="due-chip ${due.cls}">${due.label}</span>
      </div>
      <div class="title">${esc(order.product)}</div>
      ${showClient || item && item.qty > 1 ? `<div class="client">${showClient ? esc(order.client) : ""}${showClient && item && item.qty > 1 ? " · " : ""}${item && item.qty > 1 ? `${item.qty} ${esc(order.unit)}` : ""}</div>` : ""}
      ${op && (op.group || multi) ? `<div class="row" style="gap:5px;flex-wrap:wrap">
        ${op.group ? `<span class="task-tag">${esc(op.group)}</span>` : ""}
        ${multi && item ? `<span class="task-tag" style="background:var(--teal-soft);color:var(--teal)">${esc(item.name)}</span>` : ""}
        ${item && item.qty > 1 && op.qtyDone > 0 ? `<span class="qty-pill part">${op.qtyDone}/${item.qty}</span>` : ""}
      </div>` : ""}
      ${op && op.status === "running" ? `<div class="runner"><span class="pill running" style="padding:0;background:none"><span class="dot"></span></span>${esc(assignee ? assignee.name : "Running")}<span class="t t-num" data-timer="${order.id}/${op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(op))}</span></div>` : ""}
      ${op && op.status === "blocked" ? `<div class="blocked-note">${icon("ban", 12)} ${esc(op.blockNote || "Blocked")}</div>` : ""}
      ${(() => {
      var n = D.unreadComments(order, App.me.id);
      return n ? `<div class="card-remarks">${icon("send", 12)}<span>${n} <span>new remark${n === 1 ? "" : "s"}</span></span></div>` : "";
    })()}
      ${(() => {
      /* the whole reason this exists: somebody ordered the handles and the
         board said nothing about it */
      var sum = D.detailSummary(order);
      if (!sum.open && !sum.late) return "";
      var waiting = D.details(order).filter(d => d.state === "ordered" || d.state === "need");
      return `<div class="card-detail ${sum.late ? "late" : ""}">
          ${icon(sum.late ? "alert" : "truck", 12)}
          <span>${esc(waiting.slice(0, 2).map(d => d.label).join(", "))}${waiting.length > 2 ? ` +${waiting.length - 2}` : ""}</span>
        </div>`;
    })()}
      <div class="bottom">
        ${stepsMini(order)}
        <span class="grow"></span>
        <span class="t-caption t-num">${p.done}/${p.total}</span>
        ${assignee ? avatarHtml(assignee, "sm") : op ? `<span class="avatar sm" style="--av-c1:transparent;--av-c2:transparent;border:1.5px dashed var(--border-strong);color:var(--text-3)">+</span>` : ""}
      </div>
    </div>`;
  },
  bindBoard(root) {
    var setBp = patch => {
      var bp = _objectSpread(_objectSpread({}, D.pref(App.me.id, "board", {})), patch);
      M.setPref(App.me.id, "board", bp);
      App.render();
    };
    $("#bf-who", root).onchange = e => setBp({
      assignee: e.target.value
    });
    $("#bf-prio", root).onchange = e => setBp({
      prio: e.target.value
    });
    $$("#bf-density button", root).forEach(b => b.onclick = () => setBp({
      density: b.dataset.d
    }));
    var sw = $('[data-switch="hideEmpty"]', root);
    if (sw) sw.onclick = () => setBp({
      hideEmpty: !D.pref(App.me.id, "board", {}).hideEmpty
    });
    var swJob = $('[data-switch="byJob"]', root);
    if (swJob) swJob.onclick = () => setBp({
      byJob: D.pref(App.me.id, "board", {}).byJob === false
    });
    $$("[data-lane]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var shut = _objectSpread({}, D.pref(App.me.id, "boardLanes", {}) || {});
      shut[b.dataset.lane] = !shut[b.dataset.lane];
      M.setPref(App.me.id, "boardLanes", shut);
      App.render();
    });
    $$("[data-od-open]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var link = D.projectLink(D.order(b.dataset.odOpen));
      if (link) {
        window.open(link, "_blank", "noopener");
        Toast.show("Opening project files…", {
          emoji: "cloud"
        });
      }
    });
    /* A problem is noticed looking AT the board, not after opening the project
       and hunting for the right step — so it can be reported from the card. */
    $$("[data-card-block]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      e.preventDefault();
      var _b$dataset$cardBlock$ = b.dataset.cardBlock.split(":"),
        _b$dataset$cardBlock$2 = _slicedToArray(_b$dataset$cardBlock$, 2),
        orderId = _b$dataset$cardBlock$2[0],
        opId = _b$dataset$cardBlock$2[1];
      OrderDetail.blockDialog(orderId, opId); // the dialog lives with the project detail
    });
    var dragRef = null; // {orderId, opId}
    $$(".order-card", root).forEach(card => {
      card.onclick = () => Drawer.open(card.dataset.order);
      card.ondragstart = e => {
        dragRef = {
          orderId: card.dataset.order,
          opId: card.dataset.op || null
        };
        card.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", JSON.stringify(dragRef));
      };
      card.ondragend = () => {
        card.classList.remove("dragging");
        dragRef = null;
      };
    });
    $$("[data-drop]", root).forEach(col => {
      col.ondragover = e => {
        e.preventDefault();
        col.classList.add("drag-over");
      };
      col.ondragleave = () => col.classList.remove("drag-over");
      col.ondrop = e => {
        e.preventDefault();
        col.classList.remove("drag-over");
        var ref = dragRef;
        try {
          ref = JSON.parse(e.dataTransfer.getData("text/plain")) || dragRef;
        } catch (_) {/* keep dragRef */}
        if (!ref) return;
        var snap = Store.snapshot();
        var o = D.order(ref.orderId);
        var target = col.dataset.drop;
        var op = ref.opId ? o.ops.find(x => x.id === ref.opId) : null;
        if (op && target !== "__ready" && op.stationId === target) return; // no-op
        var ok = target === "__ready" ? M.moveLane(o.id, o.items[0].id, null, "__ready", App.me.id) : op ? M.moveLane(o.id, op.itemId, op.group, target, App.me.id) : M.moveOrderToStation(o.id, target, App.me.id);
        if (!ok) {
          var _D$station6, _D$station7;
          Toast.show(op ? `${((_D$station6 = D.station(target)) === null || _D$station6 === void 0 ? void 0 : _D$station6.name) || "That station"} isn't in this task's route` : `Several part groups pass ${((_D$station7 = D.station(target)) === null || _D$station7 === void 0 ? void 0 : _D$station7.name) || "there"} — open ${o.num} and reopen the step you need`, {
            emoji: "🤔",
            ms: 4200
          });
          return;
        }
        App.render();
        var name = target === "__ready" ? "Ready" : D.station(target).name;
        Toast.show(`${o.num}${op && op.group ? " · " + op.group : ""} moved to ${name}`, {
          emoji: "✦",
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
    });
    if (App.viewParams.focus) {
      var col = $(`[data-drop="${App.viewParams.focus}"]`, root);
      if (col) col.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest"
      });
      App.viewParams.focus = null; // once — don't re-scroll on every re-render
    }
  },
  /* ---------------- Orders ---------------- */
  ordersFilter: "all",
  orderSearch: "",
  portfolioFilter: null,
  defaultCols: {
    station: true,
    progress: true,
    assignee: true,
    due: true,
    status: true
  },
  orders() {
    if (App.viewParams.filter) {
      this.ordersFilter = App.viewParams.filter;
      App.viewParams.filter = null;
    }
    var s = Store.state;
    var f = this.ordersFilter;
    var q = this.orderSearch.trim().toLowerCase();
    var groupBy = D.pref(App.me.id, "ordersGroup", "none");
    var cols = _objectSpread(_objectSpread({}, this.defaultCols), D.pref(App.me.id, "ordersCols", {}));
    var list = s.orders.filter(o => (o.type || "prod") === this.scopeType());
    if (this.portfolioFilter) list = list.filter(o => o.portfolioId === this.portfolioFilter);
    var weekEnd = Date.now() + 7 * DAY;
    list = list.filter(o => {
      var st = D.orderStatus(o);
      if (f === "active") return !o.archived;
      if (f === "production") return !o.archived && ["running", "paused"].includes(st);
      if (f === "blocked") return st === "blocked";
      if (f === "ready") return st === "ready";
      if (f === "overdue") return !o.archived && fmtDue(o.due).cls === "overdue" && st !== "ready";
      if (f === "week") return !o.archived && o.due <= weekEnd;
      if (f === "archive") return o.archived;
      if (f === "attention") return !o.archived && (st === "blocked" || fmtDue(o.due).cls === "overdue" && st !== "ready");
      return true;
    });
    if (q) list = list.filter(o => o.num.toLowerCase().includes(q) || o.product.toLowerCase().includes(q) || o.client.toLowerCase().includes(q));
    list.sort((a, b) => a.archived - b.archived || prioRank(a) - prioRank(b) || a.due - b.due);
    var filters = [["all", "All"], ["active", "Active"], ["production", "In production"], ["blocked", "Blocked"], ["ready", "Ready"], ["overdue", "Overdue"], ["archive", "Archive"]];

    /* Grouping */
    var groups;
    if (groupBy === "none") groups = [{
      label: null,
      items: list
    }];else if (groupBy === "status") {
      var orderOf = ["blocked", "running", "paused", "queued", "ready", "shipped"];
      var icoOf = {
        blocked: "ban",
        running: "play",
        paused: "pause",
        queued: "clock",
        ready: "check-circle",
        shipped: "truck"
      };
      groups = orderOf.map(k => ({
        label: D.statusLabel[k],
        icon: icon(icoOf[k], 14),
        items: list.filter(o => D.orderStatus(o) === k)
      }));
    } else if (groupBy === "station") {
      groups = s.stations.map(st => ({
        label: st.name,
        icon: stIcon(st, 14),
        items: list.filter(o => {
          var _D$currentOp;
          return !o.archived && ((_D$currentOp = D.currentOp(o)) === null || _D$currentOp === void 0 ? void 0 : _D$currentOp.stationId) === st.id;
        })
      }));
      groups.push({
        label: "Ready to ship",
        icon: icon("check-circle", 14),
        items: list.filter(o => !o.archived && !D.currentOp(o))
      });
      groups.push({
        label: "Archived",
        icon: icon("archive", 14),
        items: list.filter(o => o.archived)
      });
    } else if (groupBy === "priority") {
      groups = ["rush", "high", "normal", "low"].map(p => ({
        label: p === "rush" ? "Rush" : p[0].toUpperCase() + p.slice(1),
        icon: prioIcon(p, 14) || icon("check", 14),
        items: list.filter(o => o.priority === p)
      }));
    } else if (groupBy === "portfolio") {
      groups = s.portfolios.map(p => ({
        label: p.name,
        icon: pfIcon(p, 14),
        items: list.filter(o => o.portfolioId === p.id)
      }));
      groups.push({
        label: "No portfolio",
        icon: icon("folder", 14),
        items: list.filter(o => !o.portfolioId)
      });
    } else if (groupBy === "job") {
      /* the same grouping the board draws lanes from — a customer's pieces
         together, worst first, without anyone maintaining a portfolio */
      groups = D.jobGroups(list).map(g => ({
        label: g.label,
        color: g.color,
        icon: g.pf ? pfIcon(g.pf, 14) : icon(g.single ? "building" : "folder", 14),
        sub: g.single ? "" : `${g.orders.length} <span>pieces</span>${g.client ? ` · ${esc(g.client)}` : ""}`,
        items: g.orders
      }));
    } else {
      // client
      var clients = [...new Set(list.map(o => o.client))].sort((a, b) => a.localeCompare(b));
      groups = clients.map(c => ({
        label: c,
        icon: icon("building", 14),
        items: list.filter(o => o.client === c)
      }));
    }
    groups = groups.filter(g => g.items.length);
    var pf = this.portfolioFilter ? D.portfolio(this.portfolioFilter) : null;
    return `<div class="view-anim">
      <div class="toolbar">
        ${pf ? `<button class="fchip active" id="pf-clear" title="Clear portfolio filter">${pfIcon(pf, 13)} ${esc(pf.name)} ✕</button>` : ""}
        <div class="filter-chips">
          ${filters.map(([id, label]) => `<button class="fchip ${f === id || f === "attention" && id === "all" ? "active" : ""}" data-f="${id}">${label}</button>`).join("")}
        </div>
        <div class="grow"></div>
        <div class="search-box" style="min-width:230px">${icon("search", 14)}<input id="order-search" placeholder="Search orders…" value="${esc(this.orderSearch)}"></div>
        <button class="btn" id="view-opts">${icon("sliders", 14)} View</button>
      </div>
      ${groups.length ? groups.map(g => `
        ${g.label !== null ? `<div class="group-head" ${g.color ? `style="--job:var(--${g.color})"` : ""}><span class="${g.color ? "gh-ico" : ""}">${g.icon || ""}</span> ${esc(g.label)}${g.sub ? ` <span class="gh-sub">${g.sub}</span>` : ""} <span class="count-badge">${g.items.length}</span></div>` : ""}
        <div class="table-card" style="margin-bottom:14px">${this.orderTable(g.items, cols)}</div>
      `).join("") : `<div class="table-card"><div class="empty-state"><span class="big">${icon("inbox", 40)}</span><h3>No orders match</h3><p>Try a different filter or search.</p></div></div>`}
    </div>`;
  },
  orderTable(list, cols) {
    return `<table class="orders">
      <thead><tr>
        <th>Order</th>
        ${cols.station ? "<th>Station</th>" : ""}
        ${cols.progress ? "<th>Progress</th>" : ""}
        ${cols.assignee ? "<th>Assignee</th>" : ""}
        ${cols.due ? "<th>Due</th>" : ""}
        ${cols.status ? "<th>Status</th>" : ""}
      </tr></thead>
      <tbody>
        ${list.map(o => {
      var st = D.orderStatus(o);
      var active = o.archived ? [] : D.activeOps(o);
      var cur = active[0] || null;
      var stn = cur ? D.station(cur.stationId) : null;
      var p = D.progress(o);
      var due = fmtDue(o.due);
      var assignee = cur ? D.member(cur.assigneeId) : null;
      var packed = D.packedSummary(o);
      var pfo = o.portfolioId ? D.portfolio(o.portfolioId) : null;
      return `<tr data-order="${o.id}">
            <td class="ord-cell" style="min-width:220px"><b>${o.num !== o.product ? esc(o.num) + " · " : ""}${esc(o.product)} ${o.priority !== "normal" ? prioHtml(o.priority) : ""} ${D.orderShortages(o).length ? `<span style="color:var(--red)">${icon("trend-down", 13)}</span>` : ""}${D.projectLink(o) ? `<button class="od-shortcut" data-od-open="${o.id}" title="Open project files in OneDrive">${icon("cloud", 13)}</button>` : ""}</b><span>${o.client && o.client !== o.product ? esc(o.client) + " · " : ""}${o.qty} ${esc(o.unit)}${o.qty > 1 ? ` · ${packed.done}/${packed.total} ${esc(packed.label)}` : ""}${pfo ? ` · ${esc(pfo.name)}` : ""}</span></td>
            ${cols.station ? `<td>${o.archived ? `<span class="station-cell">${icon("archive", 14)} ${o.type === "eng" ? "Delivered" : "Archived"}</span>` : stn ? `<span class="station-cell">${stIcon(stn, 14)} ${esc(stn.name)}${active.length > 1 ? ` <span class="count-badge" title="${active.length} tasks active in parallel">+${active.length - 1}</span>` : ""}</span>` : `<span class="station-cell" style="color:var(--green)">${icon("check-circle", 14)} ${o.type === "eng" ? "Complete" : "Ready"}</span>`}</td>` : ""}
            ${cols.progress ? `<td><div class="progress-cell"><div class="progress ${p.pct === 100 ? "done" : ""}"><i style="width:${p.pct}%"></i></div><span class="t-caption">${p.done}/${p.total}</span></div></td>` : ""}
            ${cols.assignee ? `<td>${assignee ? `<span class="row" style="gap:7px">${avatarHtml(assignee, "sm")}<span style="font-size:13px">${esc(assignee.name)}</span></span>` : `<span class="muted" style="font-size:13px">—</span>`}</td>` : ""}
            ${cols.due ? `<td><span class="due-chip ${o.archived ? "" : due.cls}">${o.archived ? fmtDate(o.archivedAt || o.shippedAt || o.due) : due.label}</span></td>` : ""}
            ${cols.status ? `<td>${pillHtml(st, D.statusLabelFor(o, st))}</td>` : ""}
          </tr>`;
    }).join("")}
      </tbody>
    </table>`;
  },
  bindOrders(root) {
    $$(".fchip", root).forEach(b => b.onclick = () => {
      this.ordersFilter = b.dataset.f;
      App.render();
    });
    $$("[data-od-open]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var link = D.projectLink(D.order(b.dataset.odOpen));
      if (link) {
        window.open(link, "_blank", "noopener");
        Toast.show("Opening project files…", {
          emoji: "cloud"
        });
      }
    });
    $$("tr[data-order]", root).forEach(tr => tr.onclick = () => Drawer.open(tr.dataset.order));
    var search = $("#order-search", root);
    if (search) {
      search.oninput = () => {
        this.orderSearch = search.value;
        var pos = search.selectionStart;
        App.render();
        var s2 = $("#order-search");
        if (s2) {
          s2.focus();
          s2.setSelectionRange(pos, pos);
        }
      };
    }
    $("#view-opts", root).onclick = e => this.viewOptionsPopover(e.currentTarget);
    var pfClear = $("#pf-clear", root);
    if (pfClear) pfClear.onclick = () => {
      this.portfolioFilter = null;
      App.render();
    };
  },
  viewOptionsPopover(anchor) {
    var groupBy = D.pref(App.me.id, "ordersGroup", "none");
    var cols = _objectSpread(_objectSpread({}, this.defaultCols), D.pref(App.me.id, "ordersCols", {}));
    var colDefs = [["station", "Station"], ["progress", "Progress"], ["assignee", "Assignee"], ["due", "Due date"], ["status", "Status"]];
    Popover.open(anchor, `
      <div class="opt-title">Group by</div>
      <div class="opt-row">
        <select class="select" id="po-group" style="flex:1">
          ${[["none", "None"], ["job", "Job (customer's pieces)"], ["status", "Status"], ["station", "Station"], ["priority", "Priority"], ["client", "Client"], ["portfolio", "Portfolio"]].map(([v, l]) => `<option value="${v}" ${groupBy === v ? "selected" : ""}>${l}</option>`).join("")}
        </select>
      </div>
      <div class="opt-sep"></div>
      <div class="opt-title">Columns</div>
      ${colDefs.map(([k, l]) => `<div class="opt-row"><span class="grow">${l}</span>${switchHtml("col:" + k, cols[k])}</div>`).join("")}
    `, pop => {
      $("#po-group", pop).onchange = e => {
        M.setPref(App.me.id, "ordersGroup", e.target.value);
        App.render();
      };
      $$("[data-switch]", pop).forEach(sw => sw.onclick = () => {
        var key = sw.dataset.switch.split(":")[1];
        var cur = _objectSpread(_objectSpread({}, this.defaultCols), D.pref(App.me.id, "ordersCols", {}));
        cur[key] = !cur[key];
        M.setPref(App.me.id, "ordersCols", cur);
        sw.classList.toggle("on", cur[key]);
        App.render();
      });
    });
  },
  /* ---------------- Team ---------------- */
  team() {
    var s = Store.state;
    return `<div class="view-anim">
      <div class="section-title">
        <h2 class="muted" style="font-weight:500">${s.members.length} people · ${s.members.filter(m => D.runningOpOf(m.id)).length} working now</h2>
        ${App.can("team.manage") ? `<button class="btn subtle" id="add-member-btn">${icon("plus", 13)} Add member</button>` : ""}
      </div>
      <div class="team-grid">
        ${s.members.map(m => {
      var _D$station8;
      var run = D.runningOpOf(m.id);
      var doneToday = D.doneTodayBy(m.id);
      var queue = m.role === "worker" || m.role === "engineer" ? D.workerQueue(m.id).length : null;
      return `<button class="member-card" ${App.can("team.manage") ? `data-member="${m.id}"` : `style="cursor:default"`}>
            <div class="mtop">
              ${avatarHtml(m, "lg")}
              <span class="meta">
                <b>${esc(m.name)}</b>
                <span class="mrole">${m.trade ? `<span class="mtrade">${esc(m.trade)}</span>` : ""}<span class="role-badge ${m.role}">${m.role}</span></span>
              </span>
            </div>
            ${run ? `<div class="now active"><span class="pill running" style="padding:0;background:none"><span class="dot"></span></span>${esc(D.station(run.op.stationId).name)} · ${esc(run.order.num)}<span class="grow"></span><span class="t-num" data-timer="${run.order.id}/${run.op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(run.op))}</span></div>` : `<div class="now">${icon("zzz", 14)} Not clocked on a job</div>`}
            <div class="mstats">
              <div class="mstat"><b>${doneToday}</b><span>done today</span></div>
              ${queue !== null ? `<div class="mstat"><b>${queue}</b><span>in queue</span></div>` : ""}
              ${m.station ? `<div class="mstat"><b>${stIcon(D.station(m.station), 15)}</b><span>${esc(((_D$station8 = D.station(m.station)) === null || _D$station8 === void 0 ? void 0 : _D$station8.name) || "")}</span></div>` : ""}
            </div>
          </button>`;
    }).join("")}
      </div>
    </div>`;
  },
  bindTeam(root) {
    var add = $("#add-member-btn", root);
    if (add) add.onclick = () => this.memberModal();
    $$("[data-member]", root).forEach(b => b.onclick = () => this.memberModal(b.dataset.member));
  },
  memberModal(memberId) {
    var m = memberId ? D.member(memberId) : null;
    var s = Store.state;
    Modal.open(`
      <header><h2>${m ? "Edit member" : "Add team member"}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="mm-name" value="${esc((m === null || m === void 0 ? void 0 : m.name) || "")}" placeholder="e.g. Tomas"></div>
          <div class="field"><label>Trade / title</label><input class="input" id="mm-trade" value="${esc((m === null || m === void 0 ? void 0 : m.trade) || "")}" placeholder="e.g. Assembly"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Role</label>
            <select class="select" id="mm-role">
              <option value="worker" ${(m === null || m === void 0 ? void 0 : m.role) === "worker" ? "selected" : ""}>Worker — shopfloor (production only)</option>
              <option value="engineer" ${(m === null || m === void 0 ? void 0 : m.role) === "engineer" ? "selected" : ""}>Engineer — design / projektavimas</option>
              <option value="manager" ${(m === null || m === void 0 ? void 0 : m.role) === "manager" ? "selected" : ""}>Manager — full access</option>
            </select>
          </div>
          <div class="field"><label>Home station</label>
            <select class="select" id="mm-station">
              <option value="">None</option>
              <optgroup label="Production">${D.stationsOf("prod").map(st => `<option value="${st.id}" ${(m === null || m === void 0 ? void 0 : m.station) === st.id ? "selected" : ""}>${esc(st.name)}</option>`).join("")}</optgroup>
              <optgroup label="Engineering">${D.stationsOf("eng").map(st => `<option value="${st.id}" ${(m === null || m === void 0 ? void 0 : m.station) === st.id ? "selected" : ""}>${esc(st.name)}</option>`).join("")}</optgroup>
            </select>
          </div>
        </div>
        <div class="field"><label>${m ? "Reset PIN (leave blank to keep current)" : "PIN code (4 digits) — used to sign in"}</label>
          <div class="pin-input-row">
            ${[0, 1, 2, 3].map(i => `<input maxlength="1" inputmode="numeric" pattern="[0-9]" type="password" class="pin-cell" data-i="${i}" autocomplete="off">`).join("")}
          </div>
          ${m ? `<span class="t-caption">Existing PINs are stored hashed and can't be shown — set a new one to change it.</span>` : ""}
        </div>
        ${m && m.id !== App.me.id ? `<button class="btn danger" id="mm-remove" style="align-self:flex-start">Remove from team</button>` : ""}
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="mm-save">${m ? "Save changes" : "Add member"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var cells = $$(".pin-cell", modal);
      cells.forEach((c, i) => {
        c.oninput = () => {
          c.value = c.value.replace(/\D/g, "").slice(0, 1);
          if (c.value && i < 3) cells[i + 1].focus();
        };
        c.onkeydown = e => {
          if (e.key === "Backspace" && !c.value && i > 0) cells[i - 1].focus();
        };
      });
      var removeBtn = $("#mm-remove", modal);
      if (removeBtn) removeBtn.onclick = () => {
        var snap = Store.snapshot();
        M.removeMember(m.id, App.me.id);
        Modal.close();
        App.render();
        Toast.show(`${m.name} removed`, {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
      $("#mm-save", modal).onclick = () => {
        var name = $("#mm-name", modal).value.trim();
        var trade = $("#mm-trade", modal).value.trim();
        var role = $("#mm-role", modal).value;
        var station = $("#mm-station", modal).value || null;
        var pin = cells.map(c => c.value).join("");
        if (!name) {
          $("#mm-name", modal).focus();
          return;
        }
        if (pin && pin.length !== 4) {
          var _cells$pin$length;
          (_cells$pin$length = cells[pin.length]) === null || _cells$pin$length === void 0 || _cells$pin$length.focus();
          Toast.show("PIN must be 4 digits", {
            emoji: "🔢"
          });
          return;
        }
        if (m) {
          if (!pin && !m.pinHash) {
            var _cells$;
            (_cells$ = cells[0]) === null || _cells$ === void 0 || _cells$.focus();
            Toast.show("Set a PIN for this member", {
              emoji: "🔢"
            });
            return;
          }
          M.updateMember(m.id, {
            name,
            trade,
            role,
            station
          });
          if (pin) M.setPin(m.id, pin, App.me.id);
          Toast.show(pin ? "Member updated · PIN reset" : "Member updated", {
            emoji: "✓"
          });
        } else {
          if (pin.length !== 4) {
            var _cells$2;
            (_cells$2 = cells[0]) === null || _cells$2 === void 0 || _cells$2.focus();
            Toast.show("Set a 4-digit PIN", {
              emoji: "🔢"
            });
            return;
          }
          M.addMember({
            name,
            trade,
            role,
            station,
            pin
          }, App.me.id);
          Toast.show(`${name} added to the team`, {
            emoji: "👋"
          });
        }
        Modal.close();
        App.render();
      };
    });
  },
  /* ---------------- Settings ---------------- */
  settings() {
    var _s$oneDrive, _s$oneDrive2;
    var sh = D.shift();
    var theme = localStorage.getItem("shopflow.theme") || "auto";
    var s = Store.state;
    return `<div class="view-anim settings-wrap">
      <div class="panel">
        <div class="settings-row">
          <span class="grow"><b>Workshop name</b><span>Shown on the sign-in screen</span></span>
          <input class="input" style="width:220px" id="set-name" value="${esc(s.shopName)}">
        </div>
        <div class="settings-row">
          <span class="grow"><b>Appearance</b><span>Follows your system by default</span></span>
          <div class="segmented" id="set-theme">
            ${["auto", "light", "dark"].map(t => `<button data-t="${t}" class="${theme === t ? "active" : ""}">${t[0].toUpperCase() + t.slice(1)}</button>`).join("")}
          </div>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Language</b><span>Interface language for this device</span></span>
          <div class="segmented" id="set-lang">
            ${[["en", "English"], ["lt", "Lietuvių"]].map(([v, lbl]) => `<button data-l="${v}" class="${(typeof I18N !== "undefined" ? I18N.lang : "en") === v ? "active" : ""}">${lbl}</button>`).join("")}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="settings-head">
          <b>Working hours</b>
          <span>Time on a task is counted against these hours only. Evenings, weekends and breaks never add to a job — a task left running overnight costs nothing.</span>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Working days</b><span>A day off contributes no time at all</span></span>
          <div class="day-picker" id="set-days">
            ${["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => `
              <button data-day="${i}" class="${sh.days.includes(i) ? "on" : ""}">${d}</button>`).join("")}
          </div>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Shift</b><span>${D.shiftDayMs() > 0 ? `${fmtDur(D.shiftDayMs())} of work per day after breaks` : "No working time — check the times below"}</span></span>
          <div class="row" style="gap:8px;align-items:center">
            <input class="input time-input" type="time" id="set-shift-start" value="${esc(sh.start)}">
            <span class="t-caption">to</span>
            <input class="input time-input" type="time" id="set-shift-end" value="${esc(sh.end)}">
          </div>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Breaks</b><span>Not counted as work</span></span>
          <div class="break-list">
            ${(sh.breaks || []).map((b, i) => `
              <div class="break-row">
                <input class="input time-input" type="time" data-brk="${i}/from" value="${esc(b.from)}">
                <span class="t-caption">–</span>
                <input class="input time-input" type="time" data-brk="${i}/to" value="${esc(b.to)}">
                <button class="mini-btn danger" data-brk-del="${i}" title="Remove break">✕</button>
              </div>`).join("")}
            <button class="add-inline" id="set-brk-add">＋ Add a break</button>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="settings-head">
          <b>Automatic time tracking</b>
          <span>Scanning a part is the timer. The first scan at a station starts the clock, later scans keep it going, and it stops on its own — nobody has to press start or stop.</span>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Track time from scans</b><span>${sh.auto ? "On — the Scan Station drives the clock" : "Off — tasks are timed with the Start / Pause buttons"}</span></span>
          <div class="segmented" id="set-auto">
            <button data-auto="1" class="${sh.auto ? "active" : ""}">On</button>
            <button data-auto="0" class="${!sh.auto ? "active" : ""}">Off</button>
          </div>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Stop after</b><span>How long the clock keeps running once the scanning stops</span></span>
          <div class="row" style="gap:8px;align-items:center">
            <input class="input" type="number" min="5" max="240" step="5" id="set-idle" value="${sh.idleMins}" style="width:84px">
            <span class="t-caption">minutes of quiet</span>
          </div>
        </div>
      </div>

      ${[["prod", "Workflow stations", "The production steps every order can flow through — rename, reorder, add your own", "＋ Add station"], ["eng", "Engineering stages", "The stages engineering projects go through — brief, design, approval…", "＋ Add stage"]].map(([kind, title, sub, addLabel]) => {
      var stationsOfKind = D.stationsOf(kind);
      return `<div class="panel">
        <div class="settings-row" style="border-top:none">
          <span class="grow"><b>${title}</b><span>${sub}</span></span>
          <button class="btn subtle" data-st-add="${kind}">${addLabel}</button>
        </div>
        <div>
          ${stationsOfKind.map((st, i) => `
            <div class="station-edit-row" data-st="${st.id}">
              <button class="ico-pick" data-st-icon="${st.id}" title="Change icon">${stIcon(st, 18)}</button>
              <input class="input" data-st-name="${st.id}" value="${esc(st.name)}">
              <input class="input est-input" data-st-est="${st.id}" type="number" min="5" value="${st.estMins}" title="Default estimate (min)">
              <span class="t-caption">min</span>
              ${(() => {
        var crew = D.stationDefaults(st.id).map(id => D.member(id));
        return `<button class="assign-select crew-btn st-who" data-st-who="${st.id}" title="Who new tasks here go to">
                  ${crew.length ? `<span class="avatar-stack">${crew.slice(0, 3).map(m => avatarHtml(m, "sm")).join("")}</span>
                    <span>${esc(crew.slice(0, 2).map(m => m.name.split(" ")[0]).join(", "))}${crew.length > 2 ? ` +${crew.length - 2}` : ""}</span>` : `<span>— nobody —</span>`}
                  ${icon("chev-down", 12)}
                </button>`;
      })()}
              <button class="mini-btn" data-st-move="${st.id}/-1" ${i === 0 ? "disabled" : ""}>↑</button>
              <button class="mini-btn" data-st-move="${st.id}/1" ${i === stationsOfKind.length - 1 ? "disabled" : ""}>↓</button>
              <button class="mini-btn danger" data-st-del="${st.id}" title="Delete station">✕</button>
            </div>`).join("")}
        </div>
      </div>`;
    }).join("")}

      <div class="panel">
        <div class="settings-row" style="border-top:none;align-items:flex-start">
          <span class="grow"><b>Project files (OneDrive)</b><span>Base folder where each project has a subfolder named by its code — projects then auto-open with one click. Leave blank to link each project by hand.</span></span>
          <div style="display:flex;flex-direction:column;gap:8px;width:340px">
            <input class="input" id="set-od-base" value="${esc(((_s$oneDrive = s.oneDrive) === null || _s$oneDrive === void 0 ? void 0 : _s$oneDrive.baseUrl) || "")}" placeholder="https://onedrive.live.com/…/Projektai">
            <div class="row" style="gap:8px">
              <input class="input" id="set-od-tpl" value="${esc(((_s$oneDrive2 = s.oneDrive) === null || _s$oneDrive2 === void 0 ? void 0 : _s$oneDrive2.template) || "{base}/{code}")}" style="flex:1;font-family:var(--font-mono);font-size:12px" title="Link template — {base}, {code}, {name}">
            </div>
            <div class="t-caption" id="set-od-preview" style="word-break:break-all"></div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="settings-row" style="border-top:none;align-items:flex-start">
          <span class="grow"><b>Scan stations (QR / barcode)</b><span>Open a station kiosk on a device at each machine — a USB/Bluetooth scanner or the camera then advances every part you scan. Give a scanner a prefix (e.g. <span class="mono">EDGE#</span>) to route it to a station automatically when several share one PC.</span></span>
          <div style="display:flex;flex-direction:column;gap:6px;width:340px">
            ${D.stationsOf("prod").map(st => {
      var _s$scan;
      var pfx = Object.keys(((_s$scan = s.scan) === null || _s$scan === void 0 ? void 0 : _s$scan.prefixes) || {}).find(k => s.scan.prefixes[k] === st.id) || "";
      return `<div class="row" style="gap:8px">
                <span class="row" style="gap:7px;flex:1;min-width:0"><span style="color:var(--text-2)">${stIcon(st, 15)}</span><b style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(st.name)}</b></span>
                <input class="input" data-scan-prefix="${st.id}" value="${esc(pfx)}" placeholder="prefix" style="width:88px;font-family:var(--font-mono);font-size:12px;padding:6px 9px">
                <button class="btn subtle" data-scan-open="${st.id}" style="padding:6px 12px;font-size:12.5px">${icon("scan", 13)} Kiosk</button>
              </div>`;
    }).join("")}
            <div class="t-caption">Label token also understood: <span class="mono">SF|orderId|itemId|part</span>, or any code containing the project (e.g. <span class="mono">SA_GA_VIRT_404</span>).</div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="settings-row" style="border-top:none">
          <span class="grow"><b>Cloud sync</b><span>Share this workspace live across every device. ${typeof Sync !== "undefined" && Sync.configured() ? "Connected to Supabase." : "Not set up yet — see SETUP-CLOUD.md, then add sync-config.js."}</span></span>
          <div style="display:flex;flex-direction:column;gap:8px;align-items:flex-end">
            ${typeof Sync !== "undefined" ? Sync.badge() : `<span class="sync-badge off">Local only</span>`}
            ${typeof Sync !== "undefined" && Sync.configured() ? `<div class="row" style="gap:8px">
              <button class="btn subtle" id="sync-pull">Pull from cloud</button>
              <button class="btn" id="sync-push">Upload this device →</button>
            </div>
            <button class="btn ghost" id="sync-logout" style="padding:5px 12px;font-size:12.5px">Sign out of workspace (this device)</button>` : ""}
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="settings-head">
          <b>Permissions</b>
          <span>Everyone sees the same screens. This is only about what each role may change — managers always keep everything.</span>
        </div>
        ${["engineer", "worker"].map(role => `
          <div class="perm-role">
            <div class="perm-role-head">
              <span class="role-badge ${role}">${role}</span>
              <span class="grow"></span>
              <button class="add-inline" data-perm-reset="${role}">Reset to defaults</button>
            </div>
            ${CAPS.map(c => `
              <label class="perm-row">
                <input type="checkbox" data-perm="${role}/${c.id}" ${D.roleCan(role, c.id) ? "checked" : ""}>
                <span class="grow"><b>${c.label}</b><span>${c.hint}</span></span>
              </label>`).join("")}
          </div>`).join("")}
      </div>

      <div class="panel">
        <div class="settings-row">
          <span class="grow"><b>Export data</b><span>${(() => {
      var at = (Store.state.backupMeta || {}).lastExportAt;
      var d = Store.exportOverdueDays();
      if (!at) return "Download all orders, stock & team as a JSON backup file — never exported on this device";
      return `Last downloaded ${fmtAgo(at)}${d >= EXPORT_NAG_DAYS ? " — overdue" : ""}`;
    })()}</span></span>
          <button class="btn ${Store.exportOverdueDays() >= EXPORT_NAG_DAYS ? "primary" : ""}" id="set-export">Export</button>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Save a restore point</b><span>Name the current state so you can roll back to it later — kept until you delete it</span></span>
          <button class="btn subtle" id="set-savepoint">${icon("save", 14)} Save now</button>
        </div>
        <div class="settings-row">
          <span class="grow"><b>Import a backup</b><span>Restore everything from a JSON file you exported earlier — current data is replaced (undoable)</span></span>
          <button class="btn subtle" id="set-import">Import…</button>
          <input type="file" id="set-import-file" accept="application/json,.json" hidden>
        </div>
        ${(() => {
      /* Putting ShopFlow on a tablet's home screen is the difference
         between a browser tab someone closes and an app that is just
         there. Chrome hides the offer in a menu nobody on a shop floor
         will find; this is the button. */
      var on = Offline.installed();
      var can = !!Offline.installEvent;
      var ios = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (on) return `<div class="settings-row">
            <span class="grow"><b>Installed on this device</b>
              <span>ShopFlow is running as an app here — it opens without the browser and keeps working offline.</span></span>
            <span class="pill done"><span class="dot"></span>Installed</span>
          </div>`;
      return `<div class="settings-row">
            <span class="grow"><b>Install on this device</b>
              <span>${can ? "Put ShopFlow on the home screen — it opens full screen, without browser chrome, and keeps working when the wifi drops." : ios ? "On iPad: Share → Add to Home Screen." : "Open this page in Chrome to install it. In Chrome, use the ⋮ menu → Install app."}</span></span>
            ${can ? `<button class="btn primary" id="set-install">${icon("plus", 13)} Install</button>` : ""}
          </div>`;
    })()}
        ${(() => {
      var u = Store.usage();
      var mb = Store.fmtBytes;
      var pct = Math.min(100, Math.round(u.total / u.quota * 100));
      var mine = u.keys.filter(k => k.key.startsWith("shopflow"));
      var others = u.keys.filter(k => !k.key.startsWith("shopflow"));
      var otherBytes = others.reduce((n, k) => n + k.bytes, 0);
      /* Two different stores, two different stories. The vault is sized
         against free disk; the little one is the 5 MB the whole domain
         shares, and all ShopFlow leaves in it is an index for the hub. */
      var vpct = u.vaultQuota ? Math.min(100, Math.round(u.vaultUsed / u.vaultQuota * 100)) : 0;
      return `<div class="settings-row st-row">
            <span class="grow"><b>Storage on this device</b>
              ${u.vault ? `
                <span>Your workshop is kept in this browser's large store, which the browser sizes against free disk${u.vaultQuota ? ` — ${mb(u.vaultUsed)} of about ${mb(u.vaultQuota)} available` : ""}.</span>
                <div class="st-bar ${vpct > 90 ? "bad" : vpct > 70 ? "warn" : ""}"><i style="width:${Math.max(vpct, 1)}%"></i></div>
                <div class="st-legend">
                  <span><b>${mb(u.docBytes)}</b> this workshop's data</span>
                  <span><b>${mb(u.backupBytes)}</b> ${u.backupCount} restore point${u.backupCount === 1 ? "" : "s"}</span>
                  ${u.thumbCount ? `<span><b>${mb(u.thumbBytes)}</b> ${u.thumbCount} attachment preview${u.thumbCount === 1 ? "" : "s"}</span>` : ""}
                  <span class="st-tot"><b>${mb(u.total)}</b> in the small store shared with the hub, offers and invoices</span>
                </div>` : `
                <span>Every app on this domain shares one browser store of about ${mb(u.quota)} — ShopFlow, the hub, offers, invoices.</span>
                <div class="st-bar ${pct > 90 ? "bad" : pct > 70 ? "warn" : ""}"><i style="width:${pct}%"></i></div>
                <div class="st-legend">
                  <span><b>${mb(u.docBytes)}</b> this workshop's data</span>
                  <span><b>${mb(u.backupBytes)}</b> ${u.backupCount} local backup${u.backupCount === 1 ? "" : "s"}</span>
                  ${u.thumbCount ? `<span><b>${mb(u.thumbBytes)}</b> ${u.thumbCount} attachment preview${u.thumbCount === 1 ? "" : "s"}</span>` : ""}
                  ${otherBytes ? `<span><b>${mb(otherBytes)}</b> other apps on this domain</span>` : ""}
                  <span class="st-tot"><b>${mb(u.total)}</b> of ${mb(u.quota)} used</span>
                </div>
                ${u.over ? `<div class="mc-warn" style="margin-top:8px">${icon("alert", 15)}<span>Nearly full. Freeing the local backups is safe when cloud sync is connected — the cloud holds the current data either way.</span></div>` : ""}`}
            </span>
            <button class="btn ${!u.vault && u.over ? "primary" : "subtle"}" id="set-storage">Details…</button>
          </div>` + (() => {
        var all = Store._backups();
        var n = all.length;
        var named = all.filter(b => b.keep).length;
        return `<div class="settings-row">
            <span class="grow"><b>Restore from a backup</b><span>${n ? `${named ? `${named} named restore point${named > 1 ? "s" : ""} · ` : ""}${n - named} automatic snapshot${n - named === 1 ? "" : "s"} on this device` : "Automatic backups appear here as you work"}</span></span>
            ${n ? `<button class="btn subtle" id="set-backups">Restore…</button>` : `<span class="muted t-caption">none yet</span>`}
          </div>`;
      })();
    })()}
        ${typeof REAL_SEED !== "undefined" ? `<div class="settings-row">
          <span class="grow"><b>Restore Dėdės Baldai backup</b><span>Reload the real data imported from the 2026-07-17 backup — current changes will be lost</span></span>
          <button class="btn subtle" id="set-real">Restore backup</button>
        </div>` : ""}
        <div class="settings-row">
          <span class="grow"><b>Load demo workshop</b><span>Sample data for exploring — current changes will be lost</span></span>
          <button class="btn danger" id="set-reset">Load demo</button>
        </div>
      </div>
      <div class="t-caption" style="text-align:center">ShopFlow · local-first, saved in this browser · build ${esc(App.build())}</div>
    </div>`;
  },
  exportBackup() {
    var blob = new Blob([Store.snapshot()], {
      type: "application/json"
    });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `shopflow-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    Store.markExported(); // so the overdue reminder resets
    App.render();
  },
  /* What is in the browser store, largest first, and the two safe ways to get
     room back. Deliberately shows other apps' keys too — they share the quota
     and hiding them would make ShopFlow look like the whole problem. */
  storageModal() {
    var u = Store.usage();
    var mb = Store.fmtBytes;
    /* key names are identifiers, not prose — the translator must leave them alone */
    var rows = (list, label) => list.slice(0, 10).map(x => `<div class="st-line">
      <span class="grow mono" data-notranslate>${esc(x.key)}</span><b>${mb(x.bytes)}</b></div>`).join("") || `<div class="t-caption">${label}</div>`;
    var live = typeof Sync !== "undefined" && Sync.status === "live";
    Modal.open(`
      <header><h2>Storage on this device</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--text-2)">
          ShopFlow writes every change to this browser first, so the shop keeps working when the
          wifi drops, and pushes it to the cloud afterwards.
          ${u.vault ? `Your workshop lives in IndexedDB, which the browser sizes against free disk${u.vaultQuota ? ` — <b>${mb(u.vaultUsed)}</b> of about <b>${mb(u.vaultQuota)}</b>` : ""},
               so it is not competing for the small store any more. All that is left there is a
               ${mb(u.total)} index the hub reads.` : `This browser is using the small store every app on the domain shares —
               about ${mb(u.quota)} between ShopFlow, the hub, offers and invoices — and
               <b>${mb(u.total)}</b> of it is in use.`}
          ${live ? "Sync is connected, so the current data is in the cloud as well as here." : "Sync is <b>not</b> connected, so this device is the only copy — export a backup before freeing anything."}
        </p>

        <div class="t-label ins-h">Biggest keys in the browser store</div>
        ${rows(u.keys, "nothing stored")}

        <div class="t-label ins-h">Inside this workshop's data</div>
        ${rows(u.sections, "no data")}
        ${u.thumbCount ? `<div class="t-caption" style="margin-top:6px">${u.thumbCount} attachment previews account for ${mb(u.thumbBytes)} of that — they travel with the data so every device can see a drawing without downloading it.</div>` : ""}
      </div>
      <footer>
        <button class="btn subtle" id="st-export">${icon("download", 13)} Export a backup</button>
        <div class="grow"></div>
        <button class="btn ghost" data-close>Close</button>
        ${u.backupCount ? `<button class="btn ${live ? "primary" : "danger"}" id="st-free">Free ${mb(u.backupBytes)} of local backups</button>` : ""}
      </footer>`, m => {
      $("#st-export", m).onclick = () => {
        Modal.close();
        Mgr.exportBackup();
      };
      $("#st-free", m).onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var freed;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              freed = u.backupBytes;
              _context.next = 3;
              return Store.clearBackups();
            case 3:
              Modal.close();
              App.render();
              Toast.show(`Freed ${mb(freed)} — local restore points cleared`, {
                emoji: "check",
                ms: 5000
              });
            case 6:
            case "end":
              return _context.stop();
          }
        }, _callee);
      }));
    });
  },
  setStationCrew(stId, ids) {
    if (D.stationDefaults(stId).join(",") === ids.join(",")) {
      App.render();
      return;
    }
    var r = M.setStationDefault(stId, ids, App.me.id);
    App.render();
    if (!r) return;
    var st = D.station(stId);
    if (!r.ids.length) {
      Toast.show("New tasks here start unassigned", {
        emoji: "users"
      });
      return;
    }
    var names = r.ids.map(id => D.member(id).name).join(", ");
    /* The setting on its own only helps future work; everything already on the
       board would stay blank, which is the state being complained about. */
    if (!r.pending) {
      Toast.show(`${names} now get new ${st.name} tasks`, {
        emoji: "users",
        ms: 4500
      });
      return;
    }
    Modal.open(`
      <header><h2>Also take the ones already there?</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--text-2);line-height:1.6">
          <b>${esc(names)}</b> · <b>${esc(st.name)}</b><br>
          <span>${r.ids.length > 1 ? "New tasks at this stage go to these people from now on." : "New tasks at this stage go to this person from now on."}</span><br>
          <span>Already on the board and picked up by nobody:</span> <b>${r.pending}</b>
        </p>
      </div>
      <footer>
        <div class="grow"></div>
        <button class="btn ghost" data-close>Leave them</button>
        <button class="btn primary" id="sd-all"><span>Take them too</span> — ${r.pending}</button>
      </footer>`, m => {
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      $("#sd-all", m).onclick = () => {
        var n = M.assignPendingAtStation(stId, r.ids, App.me.id);
        Modal.close();
        App.render();
        Toast.show(`${n} task${n === 1 ? "" : "s"} assigned to ${names}`, {
          emoji: "check",
          ms: 5000
        });
      };
    });
  },
  bindSettings(root) {
    $("#set-name", root).onchange = e => {
      Store.state.shopName = e.target.value.trim() || "My Workshop";
      Store.save();
      Toast.show("Workshop renamed", {
        emoji: "✓"
      });
    };
    $$("#set-theme button", root).forEach(b => b.onclick = () => {
      App.applyTheme(b.dataset.t);
      App.render();
    });
    $$("#set-lang button", root).forEach(b => b.onclick = () => I18N.set(b.dataset.l));

    /* OneDrive base folder */
    var odBase = $("#set-od-base", root),
      odTpl = $("#set-od-tpl", root),
      odPrev = $("#set-od-preview", root);
    var sampleOrder = Store.state.orders[0];
    var renderPreview = () => {
      var base = odBase.value.trim();
      if (!base) {
        odPrev.innerHTML = `<span class="muted">No base folder — projects are linked individually.</span>`;
        return;
      }
      var preview = (odTpl.value.trim() || "{base}/{code}").replace("{base}", base.replace(/\/+$/, "")).replace("{code}", encodeURIComponent(D.slug((sampleOrder === null || sampleOrder === void 0 ? void 0 : sampleOrder.num) || "WO-1041"))).replace("{name}", encodeURIComponent(D.slug((sampleOrder === null || sampleOrder === void 0 ? void 0 : sampleOrder.product) || "Project")));
      odPrev.innerHTML = `${icon("cloud", 12)} e.g. ${sampleOrder ? esc(sampleOrder.num) : "WO-1041"} → <span class="mono">${esc(preview)}</span>`;
    };
    var saveOd = () => {
      M.setOneDrive({
        baseUrl: odBase.value.trim(),
        template: odTpl.value.trim() || "{base}/{code}"
      }, App.me.id);
      renderPreview();
    };
    odBase.oninput = renderPreview;
    odTpl.oninput = renderPreview;
    odBase.onchange = saveOd;
    odTpl.onchange = saveOd;
    renderPreview();

    /* Scan stations */
    $$("[data-scan-prefix]", root).forEach(inp => inp.onchange = () => {
      var _Store$state$scan;
      var stId = inp.dataset.scanPrefix;
      // clear any old prefix that pointed here, then set the new one
      var prefixes = ((_Store$state$scan = Store.state.scan) === null || _Store$state$scan === void 0 ? void 0 : _Store$state$scan.prefixes) || {};
      Object.keys(prefixes).forEach(k => {
        if (prefixes[k] === stId) M.setScanPrefix(k, null);
      });
      var v = inp.value.trim();
      if (v) M.setScanPrefix(v, stId);
      Toast.show(v ? `Scanner prefix “${v}” → ${D.station(stId).name}` : "Prefix cleared", {
        emoji: "scan"
      });
    });
    $$("[data-scan-open]", root).forEach(b => b.onclick = () => {
      ScanStation.stationId = b.dataset.scanOpen;
      App.navigate("scan");
    });
    var syncPush = $("#sync-push", root);
    if (syncPush) syncPush.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
      return _regeneratorRuntime().wrap(function _callee2$(_context2) {
        while (1) switch (_context2.prev = _context2.next) {
          case 0:
            if (confirm("Upload THIS device's data to the cloud, overwriting the shared copy? Do this once, from the device that has the correct data.")) {
              _context2.next = 2;
              break;
            }
            return _context2.abrupt("return");
          case 2:
            _context2.next = 4;
            return Sync.push(true);
          case 4:
            Toast.show("Uploaded to cloud", {
              emoji: "cloud"
            });
          case 5:
          case "end":
            return _context2.stop();
        }
      }, _callee2);
    }));
    var syncPull = $("#sync-pull", root);
    if (syncPull) syncPull.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
      return _regeneratorRuntime().wrap(function _callee3$(_context3) {
        while (1) switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Sync.pull();
          case 2:
            Toast.show("Pulled latest from cloud", {
              emoji: "cloud"
            });
          case 3:
          case "end":
            return _context3.stop();
        }
      }, _callee3);
    }));
    var syncLogout = $("#sync-logout", root);
    if (syncLogout) syncLogout.onclick = () => {
      if (confirm("Sign this device out of the shared workspace? You'll need the shop password to sign back in.")) Sync.logout();
    };
    $("#set-export", root).onclick = () => this.exportBackup();
    var stBtn = $("#set-storage", root);
    if (stBtn) stBtn.onclick = () => this.storageModal();

    /* Named restore point — the one a person makes before a risky change */
    /* ---- working hours ---- */
    $$("[data-day]", root).forEach(b => b.onclick = () => {
      var d = +b.dataset.day;
      var days = D.shift().days.includes(d) ? D.shift().days.filter(x => x !== d) : [...D.shift().days, d].sort();
      M.setShift({
        days
      }, App.me.id);
      App.render();
    });
    var shStart = $("#set-shift-start", root),
      shEnd = $("#set-shift-end", root);
    if (shStart) shStart.onchange = () => {
      M.setShift({
        start: shStart.value
      }, App.me.id);
      App.render();
    };
    if (shEnd) shEnd.onchange = () => {
      M.setShift({
        end: shEnd.value
      }, App.me.id);
      App.render();
    };
    $$("[data-brk]", root).forEach(inp => inp.onchange = () => {
      var _inp$dataset$brk$spli = inp.dataset.brk.split("/"),
        _inp$dataset$brk$spli2 = _slicedToArray(_inp$dataset$brk$spli, 2),
        i = _inp$dataset$brk$spli2[0],
        side = _inp$dataset$brk$spli2[1];
      var breaks = D.shift().breaks.map((b, n) => n === +i ? _objectSpread(_objectSpread({}, b), {}, {
        [side]: inp.value
      }) : b);
      M.setShift({
        breaks
      }, App.me.id);
      App.render();
    });
    $$("[data-brk-del]", root).forEach(b => b.onclick = () => {
      M.setShift({
        breaks: D.shift().breaks.filter((_, n) => n !== +b.dataset.brkDel)
      }, App.me.id);
      App.render();
    });
    var brkAdd = $("#set-brk-add", root);
    if (brkAdd) brkAdd.onclick = () => {
      M.setShift({
        breaks: [...D.shift().breaks, {
          from: "14:00",
          to: "14:15"
        }]
      }, App.me.id);
      App.render();
    };
    $$("[data-auto]", root).forEach(b => b.onclick = () => {
      M.setShift({
        auto: b.dataset.auto === "1"
      }, App.me.id);
      App.render();
      Toast.show(b.dataset.auto === "1" ? "Scans now drive the clock" : "Back to manual Start / Pause", {
        emoji: "clock"
      });
    });
    var idle = $("#set-idle", root);
    if (idle) idle.onchange = () => {
      M.setShift({
        idleMins: Math.max(5, Math.min(240, parseInt(idle.value) || 30))
      }, App.me.id);
      App.render();
    };
    $$("[data-perm]", root).forEach(cb => cb.onchange = () => {
      var _cb$dataset$perm$spli = cb.dataset.perm.split("/"),
        _cb$dataset$perm$spli2 = _slicedToArray(_cb$dataset$perm$spli, 2),
        role = _cb$dataset$perm$spli2[0],
        cap = _cb$dataset$perm$spli2[1];
      M.setPerm(role, cap, cb.checked, App.me.id);
      App.render();
      var c = CAPS.find(x => x.id === cap);
      Toast.show(`${role}s ${cb.checked ? "can now" : "can no longer"} ${(c ? c.label : cap).toLowerCase()}`, {
        emoji: "lock"
      });
    });
    $$("[data-perm-reset]", root).forEach(b => b.onclick = () => {
      var role = b.dataset.permReset;
      M.resetPerms(role, App.me.id);
      App.render();
      Toast.show(`${role} permissions reset`, {
        emoji: "history"
      });
    });
    var spBtn = $("#set-savepoint", root);
    if (spBtn) spBtn.onclick = () => {
      var when = new Date().toLocaleString(isLT() ? "lt-LT" : "en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
      Modal.open(`
        <header><h2>Save a restore point</h2><button class="icon-btn" data-close>✕</button></header>
        <div class="modal-body">
          <div class="t-caption">A snapshot of everything as it is right now, kept on this device until you delete it. Automatic backups will never push it out.</div>
          <div class="field"><label>Name it</label><input class="input" id="sp-name" value="${esc(when)}" autocomplete="off"></div>
        </div>
        <footer><button class="btn" data-close>Cancel</button>
          <button class="btn primary" id="sp-go">${icon("save", 14)} Save restore point</button></footer>`, m => {
        var inp = $("#sp-name", m);
        var go = () => {
          var entry = Store.savePoint(inp.value, App.me.id);
          Modal.close();
          App.render();
          Toast.show(entry ? `Restore point “${entry.reason}” saved` : "Couldn't save — device storage is full", {
            emoji: entry ? "save" : "alert"
          });
        };
        $("#sp-go", m).onclick = go;
        inp.onkeydown = e => {
          if (e.key === "Enter") go();
        };
      });
    };
    $("#set-import", root).onclick = () => $("#set-import-file", root).click();
    $("#set-import-file", root).onchange = e => {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = () => {
        var snap = Store.snapshot();
        try {
          Store.importJSON(reader.result);
        } catch (err) {
          Toast.show("Import failed — not a valid ShopFlow backup file", {
            emoji: "alert"
          });
          return;
        }
        App.logout();
        Toast.show("Backup imported", {
          emoji: "check",
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
      reader.readAsText(file);
    };
    var bkBtn = $("#set-backups", root);
    if (bkBtn) bkBtn.onclick = () => {
      var list = Store._backups();
      var fmtBk = ts => new Date(ts).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit"
      });
      var rows = b => `<div class="settings-row" style="border:none;background:var(--surface-2);border-radius:10px;padding:10px 14px">
            <span class="grow bk-row"><span style="display:flex;flex-direction:column;min-width:0">
              <b>${esc(b.keep ? b.reason : fmtBk(b.ts))}</b>
              <span>${b.keep ? fmtBk(b.ts) + (b.by && D.member(b.by) ? " · " + esc(D.member(b.by).name) : "") : esc(b.reason || "auto")}</span>
            </span>${b.keep ? `<span class="bk-tag">saved</span>` : ""}</span>
            ${b.keep ? `<button class="icon-btn" data-bk-del="${b.ts}" title="Delete this restore point">${icon("trash", 14)}</button>` : ""}
            <button class="btn subtle" data-bk="${b.ts}">Restore</button>
          </div>`;
      var named = list.filter(b => b.keep),
        auto = list.filter(b => !b.keep);
      Modal.open(`<h3 style="margin:0 0 4px">Restore a backup</h3>
        <p class="t-caption" style="margin:0 0 14px">Roll back to a snapshot saved on this device. Your current data is backed up first, so this is undoable.</p>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:50vh;overflow:auto">
          ${named.length ? `<div class="t-label">Your restore points</div>${named.map(rows).join("")}` : ""}
          ${auto.length ? `<div class="t-label" style="margin-top:6px">Automatic</div>${auto.map(rows).join("")}` : ""}
        </div>
        <div class="row" style="justify-content:flex-end;margin-top:16px"><button class="btn ghost" id="bk-close">Close</button></div>`, m => {
        $("#bk-close", m).onclick = () => Modal.close();
        $$("[data-bk-del]", m).forEach(btn => btn.onclick = () => {
          Store.deleteBackup(parseInt(btn.dataset.bkDel));
          Modal.close();
          App.render();
          Toast.show("Restore point deleted", {
            emoji: "trash"
          });
        });
        $$("[data-bk]", m).forEach(btn => btn.onclick = /*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
          var snap;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                snap = Store.snapshot();
                btn.disabled = true;
                _context4.next = 4;
                return Store.restoreBackup(parseInt(btn.dataset.bk));
              case 4:
                if (!_context4.sent) {
                  _context4.next = 10;
                  break;
                }
                Modal.close();
                App.logout();
                Toast.show("Backup restored", {
                  emoji: "history",
                  undo: () => {
                    Store.restore(snap);
                    App.render();
                  }
                });
                _context4.next = 12;
                break;
              case 10:
                btn.disabled = false;
                Toast.show("That backup could not be read", {
                  emoji: "alert"
                });
              case 12:
              case "end":
                return _context4.stop();
            }
          }, _callee4);
        })));
      });
    };
    $("#set-reset", root).onclick = () => {
      var snap = Store.snapshot();
      Store.loadDemo();
      App.logout();
      Toast.show("Demo workshop loaded", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    };
    var realBtn = $("#set-real", root);
    if (realBtn) realBtn.onclick = () => {
      var snap = Store.snapshot();
      Store.loadReal();
      App.logout();
      Toast.show("Dėdės Baldai backup restored", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    };

    /* Stations editor */
    $$("[data-st-add]", root).forEach(b => b.onclick = () => {
      var kind = b.dataset.stAdd;
      M.addStation({
        name: kind === "eng" ? "New stage" : "New station",
        estMins: 60,
        kind
      }, App.me.id);
      App.render();
    });
    $$("[data-st-icon]", root).forEach(b => b.onclick = e => {
      var id = b.dataset.stIcon;
      Popover.open(b, `<div class="icon-grid">${STATION_IC_KEYS.map(k => `<button data-ic="${k}" title="${k}">${icon(k, 17)}</button>`).join("")}</div>`, pop => {
        $$("[data-ic]", pop).forEach(ib => ib.onclick = () => {
          M.updateStation(id, {
            ic: ib.dataset.ic
          });
          Popover.close();
          App.render();
        });
      });
    });
    $$("[data-st-name]", root).forEach(inp => inp.onchange = () => {
      M.updateStation(inp.dataset.stName, {
        name: inp.value.trim() || "Station"
      }, App.me.id);
      App.render();
    });
    $$("[data-st-est]", root).forEach(inp => inp.onchange = () => {
      M.updateStation(inp.dataset.stEst, {
        estMins: parseInt(inp.value) || 60
      });
    });
    $$("[data-st-who]", root).forEach(btn => btn.onclick = () => {
      var stId = btn.dataset.stWho,
        st = D.station(stId);
      var picked = new Set(D.stationDefaults(stId));
      /* Everybody is listed, with the people whose trade fits this kind of
         station first. Filtering them out would be tidier right up until the
         person you actually wanted is the one not shown. */
      var fits = m => st.kind === "eng" ? m.role === "manager" || m.role === "engineer" : m.role === "worker" || m.role === "manager";
      var eligible = [...Store.state.members].sort((a, b) => fits(b) - fits(a) || a.name.localeCompare(b.name));
      var firstOther = eligible.findIndex(m => !fits(m));
      Popover.open(btn, `<div class="crew-pick">
        ${eligible.map((m, i) => `${i === firstOther && i > 0 ? `<div class="crew-sep">Anyone else</div>` : ""}
          <label class="crew-row">
          <input type="checkbox" data-sw-m="${m.id}" ${picked.has(m.id) ? "checked" : ""}>
          ${avatarHtml(m, "sm")}<span class="grow">${esc(m.name)}</span>
          <span class="t-caption">${esc(m.trade || m.role)}</span>
        </label>`).join("")}
        <button class="crew-clear" data-sw-none>Nobody</button>
      </div>`, pop => {
        $$("[data-sw-m]", pop).forEach(c => c.onchange = () => {
          c.checked ? picked.add(c.dataset.swM) : picked.delete(c.dataset.swM);
        });
        $("[data-sw-none]", pop).onclick = () => {
          Popover.close();
          this.setStationCrew(stId, []);
        };
        /* applied once, when the picker closes: choosing two people should be
           one line in the history and one question about the work already
           waiting, not one of each per checkbox */
        pop._onClose = () => this.setStationCrew(stId, [...picked]);
      });
    });
    $$("[data-st-move]", root).forEach(b => b.onclick = () => {
      var _b$dataset$stMove$spl = b.dataset.stMove.split("/"),
        _b$dataset$stMove$spl2 = _slicedToArray(_b$dataset$stMove$spl, 2),
        id = _b$dataset$stMove$spl2[0],
        dir = _b$dataset$stMove$spl2[1];
      M.moveStation(id, parseInt(dir));
      App.render();
    });
    $$("[data-st-del]", root).forEach(b => b.onclick = () => {
      var id = b.dataset.stDel;
      var st = D.station(id);
      var snap = Store.snapshot();
      if (!M.deleteStation(id, App.me.id)) {
        Toast.show(`Can't delete “${st.name}” — used by existing orders`, {
          emoji: "⚠️",
          ms: 4200
        });
        return;
      }
      App.render();
      Toast.show(`Station “${st.name}” deleted`, {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    });
  }
};

/* ============================================================
   Warehouse
   ============================================================ */
var Warehouse = {
  filter: "all",
  search: "",
  tab: "materials",
  // materials | purchases | suppliers | articles

  view() {
    var open = D.openPurchases().length;
    var shortfalls = D.demandShortfalls().length;
    var tabs = [["materials", "layers", "Materials", 0], ["demand", "trend-down", "What the jobs need", shortfalls, "warn"], ["purchases", "truck", "Purchase orders", open], ["suppliers", "handshake", "Suppliers", 0], ["articles", "box", "Articles (products)", 0]];
    return `<div class="view-anim">
      <div class="toolbar" style="margin-bottom:10px">
        <div class="segmented">
          ${tabs.map(([id, ico, label, n, warn]) => `<button class="${this.tab === id ? "active" : ""}" data-wtab="${id}">${icon(ico, 13)} ${label}${n ? ` <span class="seg-count ${warn || ""}">${n}</span>` : ""}</button>`).join("")}
        </div>
      </div>
      ${this.tab === "articles" ? this.articlesView() : this.tab === "demand" ? this.demandView() : this.tab === "purchases" ? this.purchasesView() : this.tab === "suppliers" ? this.suppliersView() : this.materialsView()}
    </div>`;
  },
  /* ============================================================
     Purchasing — the other half of the warehouse
      Low stock used to be a red badge and nothing else; somebody still had
     to remember what to order and from whom. A purchase order is a promise,
     so nothing here touches the shelves until a delivery is received, and
     receiving goes through the same stock movement as any other delivery.
     ============================================================ */
  PO_LABEL: {
    draft: "Draft",
    sent: "Ordered",
    received: "Received",
    cancelled: "Cancelled"
  },
  /* reusing the status palette; no dot, so "sent" doesn't inherit the pulse */
  PO_PILL: {
    draft: "queued",
    sent: "running",
    received: "done",
    cancelled: "queued"
  },
  poPill(po) {
    return `<span class="pill ${this.PO_PILL[po.status]}">${this.PO_LABEL[po.status]}</span>`;
  },
  /* ============================================================
     What the jobs need
      "Low stock" measures the shelf against a minimum somebody set once.
     This measures it against the work already accepted, which is the number
     that decides whether Monday happens.
     ============================================================ */
  demandView() {
    var rows = D.materialDemand();
    var short = rows.filter(r => r.short > 0);
    var unlinked = short.filter(r => !r.material);
    var canBuy = App.can("warehouse.edit");
    var fmtQ = n => (Math.round(n * 100) / 100).toLocaleString("lt-LT");
    return `<div>
      ${short.length ? `<div class="reorder-nag">
        <span style="color:var(--orange)">${icon("alert", 20)}</span>
        <span class="grow"><b>${short.length} material${short.length > 1 ? "s are" : " is"} short for the jobs in hand</b>
          <span>${D.blockedByStock().length} project${D.blockedByStock().length === 1 ? "" : "s"} need${D.blockedByStock().length === 1 ? "s" : ""} more than the shelf and the open orders can cover${unlinked.length ? ` · ${unlinked.length} not linked to any stock item yet` : ""}.</span></span>
        ${canBuy && short.some(r => r.material && r.material.supplierId) ? `<button class="btn" id="dm-draft">${icon("plus", 13)} Draft orders for the shortfall</button>` : ""}
      </div>` : ""}

      <div class="toolbar">
        <span class="t-caption">Every unconsumed material line on every unfinished project, added up</span>
      </div>

      <div class="table-card">
        ${rows.length ? `<table class="orders dm-table">
          <thead><tr>
            <th>Material &amp; the jobs waiting for it</th>
            <th class="num">Needed</th><th class="num">In stock</th>
            <th class="num">On order</th><th class="num">Short</th><th></th>
          </tr></thead>
          <tbody>
            ${rows.map(r => `<tr class="${r.short > 0 ? "dm-short" : ""}" data-dm="${esc(r.key)}">
              <td>
                <span class="row" style="gap:10px;align-items:flex-start">
                  <span class="mat-ico">${r.material ? matIcon(r.material, 16) : icon("alert", 16)}</span>
                  <span class="ord-cell" style="min-width:0">
                    <b>${esc(r.name)}</b>
                    <span class="${r.material ? "mono" : ""}" ${r.material ? "" : `style="color:var(--orange)"`}>${r.material ? esc(r.material.sku || "in the warehouse") : "not linked to stock"}</span>
                  </span>
                </span>
                <span class="dm-jobs">${r.lines.map(l => `<button class="tag-btn" data-dm-order="${l.order.id}" title="${esc(l.order.product)}">${esc(l.order.num)} · ${fmtQ(l.qty)} ${esc(r.unit)}</button>`).join("")}</span>
              </td>
              <td class="num"><b>${fmtQ(r.need)}</b> <small>${esc(r.unit)}</small></td>
              <td class="num">${r.stock === null ? `<span class="muted">—</span>` : `${fmtQ(r.stock)}${r.spot ? `<span class="dm-eta">on hand · one-off</span>` : ""}`}</td>
              <td class="num">${(() => {
      if (!r.material) return `<span class="muted">—</span>`;
      var d = D.onOrderDetail(r.material.id);
      if (!d.total) return `<span class="muted">—</span>`;
      return `${fmtQ(d.total)}
                  <span class="dm-eta ${d.late ? "late" : ""}">${d.sent && d.expectedAt ? d.late ? `overdue ${fmtDate(d.expectedAt)}` : fmtDate(d.expectedAt) : d.sent ? "no date given" : "draft — not sent"}</span>`;
    })()}</td>
              <td class="num">${(() => {
      if (r.short > 0) return `<span class="dm-gap">−${fmtQ(r.short)}</span>`;
      /* "covered" by a draft nobody sent is not covered. The draft
         still counts against re-ordering, but it must not read green. */
      var d = r.material ? D.onOrderDetail(r.material.id) : null;
      var real = d ? r.need - (r.stock || 0) - d.sent : 0;
      return d && d.draft > 0 && real > 0 ? `<span class="dm-draft">draft only</span>` : `<span class="dm-ok">${icon("check", 12)} covered</span>`;
    })()}</td>
              <td style="text-align:right;white-space:nowrap">
                ${canBuy ? `<button class="btn subtle" data-dm-fix="${esc(r.key)}" style="padding:5.5px 12px;font-size:12.5px">${r.material ? "Edit" : `${icon("link", 12)} Link`}</button>` : ""}
              </td>
            </tr>`).join("")}
          </tbody>
        </table>` : `<div class="empty-state"><span class="big">${icon("check-circle", 40)}</span>
          <h3>Nothing is waiting on materials</h3>
          <p>Material lines on unfinished projects appear here, added up across every job.</p></div>`}
      </div>
    </div>`;
  },
  /* A supplier picker that can also add one. Typing a supplier's name into a
     dialog beats leaving, creating it, and coming back to start again. */
  supplierField(id, value) {
    return `${Picker.html(id, {
      value: value || "",
      placeholder: "Search suppliers…",
      empty: "— none —",
      actions: [{
        value: "__new",
        label: "＋ Add a new supplier"
      }],
      options: D.suppliers().map(x => ({
        value: x.id,
        label: x.name,
        sub: x.leadDays ? x.leadDays + " day lead" : x.contact || ""
      }))
    })}
    <div class="sup-new" id="${id}-new" hidden>
      <input class="input" id="${id}-name" placeholder="Supplier name" autocomplete="off">
      <input class="input" id="${id}-lead" type="number" min="0" placeholder="lead days">
    </div>`;
  },
  bindSupplierField(id, root) {
    var sel = $("#" + id, root),
      box = $("#" + id + "-new", root);
    if (!sel || !box) return;
    var sync = () => {
      box.hidden = sel.value !== "__new";
    };
    sel.addEventListener("change", sync);
    sync();
  },
  /* Called at save time: returns an id, creating the supplier if that is what
     was asked for, and reusing one that already has the name. */
  resolveSupplierField(id, root, byId) {
    var sel = $("#" + id, root);
    if (!sel) return null;
    if (sel.value !== "__new") return sel.value || null;
    var clean = String(($("#" + id + "-name", root) || {}).value || "").trim();
    if (!clean) return null;
    var held = D.suppliers().find(x => x.name.trim().toLowerCase() === clean.toLowerCase());
    if (held) return held.id;
    var lead = ($("#" + id + "-lead", root) || {}).valueAsNumber;
    return M.addSupplier({
      name: clean,
      leadDays: isNaN(lead) ? null : lead
    }, byId).id;
  },
  /* One row, and everything you can do about it: correct the name the
     designer typed, point it at real stock (or make stock out of it), and see
     exactly which jobs are waiting and for how much. */
  demandModal(key) {
    var r = D.demandRow(key);
    if (!r) return;
    var mats = [...Store.state.materials].sort((a, b) => a.name.localeCompare(b.name));
    var suggestion = r.material ? null : D.matchMaterial(r.name);
    var fmtQ = n => (Math.round(n * 100) / 100).toLocaleString("lt-LT");
    Modal.open(`
      <header>
        <span class="mat-ico" style="width:38px;height:38px">${r.material ? matIcon(r.material, 19) : icon("alert", 19)}</span>
        <h2 style="margin-left:2px">${esc(r.name)}</h2>
        <button class="icon-btn" data-close>${icon("x", 15)}</button>
      </header>
      <div class="modal-body">
        <div class="qty-hero">
          <span class="n ${r.short > 0 ? "low" : ""} t-num">${fmtQ(r.need)}</span>
          <span class="meta"><b>${esc(r.unit)} needed by ${r.lines.length} job${r.lines.length === 1 ? "" : "s"}</b>
            <span>${r.stock === null ? "nothing on the shelf — not linked to stock yet" : `${fmtQ(r.stock)} in stock${r.onOrder ? ` · ${fmtQ(r.onOrder)} on order` : ""}`}</span></span>
          ${r.short > 0 ? `<span class="low-badge" style="font-size:12px;padding:5px 10px">${fmtQ(r.short)} short</span>` : ""}
        </div>

        <div class="field"><label>Name the jobs are asking for</label>
          <input class="input" id="dm-name" value="${esc(r.name)}" ${r.material ? "disabled" : ""}>
          <span class="t-caption">${r.material ? "Linked to stock, so the warehouse owns the name — change it on the material itself." : `Renaming applies to all ${r.lines.length} job${r.lines.length === 1 ? "" : "s"} below.`}</span></div>

        ${r.material ? "" : `<div class="field"><label>Do you already have some?</label>
          <div class="row" style="gap:8px;align-items:center">
            <input class="input" id="dm-have" type="number" min="0" step="any" style="max-width:140px"
              value="${r.spot ? r.stock : ""}" placeholder="none">
            <span class="t-caption">${esc(r.unit)} on hand</span>
            ${r.spot ? `<button class="btn ghost" id="dm-have-clear" type="button">Forget it</button>` : ""}
          </div>
          <span class="t-caption">For a one-off — counted against these jobs without becoming a warehouse item.</span></div>`}

        <div class="field"><label>Stock item</label>
          ${Picker.html("dm-link", {
      value: r.material ? r.material.id : "",
      placeholder: `Search ${mats.length} stock items…`,
      empty: "— not in the warehouse —",
      actions: [{
        value: "__new",
        label: "＋ Create a stock item from this name"
      }],
      options: mats.map(m => ({
        value: m.id,
        label: m.name,
        sub: m.sku || ""
      }))
    })}
          ${suggestion ? `<span class="t-caption">Closest match in the warehouse: <b>${esc(suggestion.name)}</b>
            — <button class="link" id="dm-suggest" type="button">use it</button></span>` : ""}</div>

        <div id="dm-new" hidden>
          <div class="form-row">
            <div class="field"><label>SKU</label>
              <input class="input" id="dm-sku" value="${esc(D.suggestSku(r.name))}" placeholder="e.g. KNF-540">
              <span class="t-caption">Suggested from the name — change it if your codes read differently.</span></div>
            <div class="field" style="max-width:110px"><label>Unit</label><input class="input" id="dm-unit" value="${esc(r.unit || "pcs")}"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Already on the shelf</label><input class="input" id="dm-qty" type="number" min="0" step="any" value="0"></div>
            <div class="field"><label>Min stock</label><input class="input" id="dm-min" type="number" min="0" step="any" value="0"></div>
          </div>
          <div class="form-row">
            <div class="field"><label>Supplier</label>${this.supplierField("dm-sup")}</div>
          </div>
        </div>

        ${(() => {
      var d = r.material ? D.onOrderDetail(r.material.id) : null;
      if (!d || !d.total) return "";
      return `<div class="dm-onway ${d.late ? "late" : ""}">
            <span>${icon("truck", 17)}</span>
            <span class="grow"><b>${fmtQ(d.total)} ${esc(r.unit)} on the way</b>
              <span>${d.sent && d.expectedAt ? d.late ? `was expected ${fmtDate(d.expectedAt)} — chase it` : `expected ${fmtDate(d.expectedAt)}` : d.sent ? "ordered, no delivery date given" : "still a draft — nobody has sent it"}${d.count > 1 ? ` · ${d.count} orders` : ""}</span></span>
          </div>`;
    })()}

        <details class="sw-cols" id="dm-order" ${r.short > 0 ? "open" : ""}>
          <summary>Mark it as ordered${r.short > 0 ? ` — ${fmtQ(r.short)} ${esc(r.unit)} still missing` : ""}</summary>
          <div class="sw-cols-body">
            <div class="form-row">
              <div class="field" style="max-width:130px"><label>How much</label>
                <input class="input" id="dm-oqty" type="number" min="0" step="any" value="${r.short > 0 ? Math.round(r.short * 100) / 100 : ""}"></div>
              <div class="field" style="max-width:170px"><label>Expected</label>
                <input class="input" id="dm-oeta" type="date"></div>
              <div class="field"><label>Supplier</label>
                ${this.supplierField("dm-osup", r.material && r.material.supplierId || "")}</div>
            </div>
            <button class="btn" id="dm-order-go">${icon("truck", 13)} Record the order</button>
            <span class="t-caption" style="display:block;margin-top:6px">${r.material ? "Creates a purchase order so the delivery shows up in the warehouse." : "Creates the stock item first, then the purchase order."}</span>
          </div>
        </details>

        <div>
          <div class="t-label" style="margin-bottom:4px">Which jobs need it</div>
          <div class="sw-table">
            ${r.lines.map(l => `<div class="sw-row">
              <span class="grow"><b>${esc(l.order.num)} · ${esc(l.order.product)}</b>
                <span>${l.order.client ? esc(l.order.client) + " · " : ""}due ${fmtDate(l.order.due)}</span></span>
              <span class="qty-pill">${fmtQ(l.qty)} ${esc(r.unit)}</span>
              <button class="btn subtle" data-dm-goto="${l.order.id}" style="padding:5px 11px;font-size:12.5px">Open</button>
            </div>`).join("")}
          </div>
        </div>
      </div>
      <footer>
        <div class="grow"></div>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="dm-save">Save</button>
      </footer>
    `, m => {
      Picker.bind(m);
      this.bindSupplierField("dm-sup", m);
      this.bindSupplierField("dm-osup", m);

      /* one-off stock: recorded against the name, saved as you leave the field
         so it is not lost by closing the dialog another way */
      var have = $("#dm-have", m);
      if (have) {
        var apply = () => {
          var v = have.value.trim();
          M.setSpotStock(key, v === "" ? null : have.valueAsNumber, "", App.me.id);
        };
        have.onchange = apply;
        var clear = $("#dm-have-clear", m);
        if (clear) clear.onclick = () => {
          M.setSpotStock(key, null, "", App.me.id);
          Modal.close();
          App.render();
        };
      }
      var sel = $("#dm-link", m),
        box = $("#dm-new", m);
      var sync = () => {
        box.hidden = sel.value !== "__new";
      };
      sel.onchange = sync;
      sync();
      var sug = $("#dm-suggest", m);
      if (sug) sug.onclick = () => {
        sel.value = suggestion.id;
        $(".picker-input", sel.closest(".picker")).value = suggestion.name;
        sync();
      };
      $$("[data-dm-goto]", m).forEach(b => b.onclick = () => {
        Modal.close();
        Drawer.open(b.dataset.dmGoto);
      });
      $("#dm-order-go", m).onclick = () => {
        var nameEl = $("#dm-name", m);
        if (nameEl && !nameEl.disabled) M.renameDemandMaterial(key, nameEl.value, App.me.id);
        var freshKey = r.material ? key : "name:" + D._stName(nameEl && nameEl.value.trim() || r.name);
        var eta = $("#dm-oeta", m).value;
        var po = M.markDemandOrdered(freshKey, {
          qty: $("#dm-oqty", m).valueAsNumber,
          supplierId: this.resolveSupplierField("dm-osup", m, App.me.id),
          expectedAt: eta ? new Date(eta + "T12:00:00").getTime() : null,
          sku: $("#dm-sku", m) ? $("#dm-sku", m).value.trim() : "",
          unit: r.unit
        }, App.me.id);
        Modal.close();
        App.render();
        Toast.show(po ? `${po.num} recorded${eta ? ` — expected ${fmtDate(new Date(eta + "T12:00:00").getTime())}` : ""}` : "Nothing to order — set a quantity", {
          emoji: po ? "truck" : "info",
          ms: 4500
        });
      };
      $("#dm-save", m).onclick = () => {
        if (have) {
          var v = have.value.trim();
          M.setSpotStock(key, v === "" ? null : have.valueAsNumber, "", App.me.id);
        }
        var nameEl = $("#dm-name", m);
        if (nameEl && !nameEl.disabled) M.renameDemandMaterial(key, nameEl.value, App.me.id);
        // renaming changes the row's key, so find it again before linking
        var freshKey = r.material ? key : "name:" + D._stName(nameEl && nameEl.value.trim() || r.name);
        if (sel.value === "__new") {
          M.stockFromDemand(freshKey, {
            sku: $("#dm-sku", m).value.trim(),
            unit: $("#dm-unit", m).value.trim() || r.unit,
            qty: $("#dm-qty", m).valueAsNumber || 0,
            minQty: $("#dm-min", m).valueAsNumber || 0,
            supplierId: this.resolveSupplierField("dm-sup", m, App.me.id)
          }, App.me.id);
          Toast.show(`${$("#dm-name", m) ? $("#dm-name", m).value.trim() : r.name} is now a stock item`, {
            emoji: "box"
          });
        } else if (sel.value !== (r.material ? r.material.id : "")) {
          M.linkDemandMaterial(freshKey, sel.value || null, App.me.id);
          Toast.show(sel.value ? "Linked to stock" : "Unlinked", {
            emoji: "check"
          });
        }
        Modal.close();
        App.render();
      };
    });
  },
  purchasesView() {
    var list = D.purchases();
    var groups = D.reorderBySupplier();
    var need = groups.reduce((n, g) => n + g.lines.length, 0);
    var orphan = groups.filter(g => !g.supplier).reduce((n, g) => n + g.lines.length, 0);
    var canEdit = App.can("warehouse.edit");
    return `<div>
      ${need ? `<div class="reorder-nag">
        <span style="color:var(--orange)">${icon("trend-down", 20)}</span>
        <span class="grow"><b>${need} material${need === 1 ? " is" : "s are"} at or below the minimum</b>
          <span>${orphan ? `${orphan} of them ${orphan === 1 ? "has" : "have"} no supplier yet — set one on the material to include ${orphan === 1 ? "it" : "them"}.` : "Drafting groups them into one order per supplier. Nothing is sent until you say so."}</span></span>
        ${canEdit && need > orphan ? `<button class="btn" id="po-draft-all">${icon("plus", 13)} Draft orders</button>` : ""}
      </div>` : ""}
      <div class="toolbar">
        <span class="t-caption">${list.length} order${list.length === 1 ? "" : "s"} · ${D.openPurchases().length} still open</span>
        <div class="grow"></div>
        ${canEdit ? `<button class="btn primary" id="po-add">${icon("plus", 13)} New purchase order</button>` : ""}
      </div>
      <div class="table-card">
        ${list.length ? `<table class="orders">
          <thead><tr><th>Order</th><th>Supplier</th><th>Items</th><th>Expected</th><th>Status</th></tr></thead>
          <tbody>
            ${list.map(po => {
      var sup = D.supplier(po.supplierId);
      var out = D.poOutstanding(po);
      var late = po.status === "sent" && po.expectedAt && po.expectedAt < Date.now();
      return `<tr data-po="${po.id}">
                <td class="ord-cell"><b>${esc(po.num)}</b><span class="mono">${fmtDate(po.createdAt)}</span></td>
                <td>${sup ? esc(sup.name) : `<span class="muted">no supplier</span>`}</td>
                <td><span class="t-caption">${po.lines.length} line${po.lines.length === 1 ? "" : "s"}${out && po.status === "sent" ? ` · ${out} still to come` : ""}</span></td>
                <td>${po.expectedAt ? `<span class="t-caption" ${late ? `style="color:var(--red)"` : ""}>${fmtDate(po.expectedAt)}${late ? " · overdue" : ""}</span>` : `<span class="muted">—</span>`}</td>
                <td>${this.poPill(po)}</td>
              </tr>`;
    }).join("")}
          </tbody>
        </table>` : `<div class="empty-state"><span class="big">${icon("truck", 40)}</span><h3>No purchase orders yet</h3><p>Order materials from your suppliers and receive them straight onto the shelf.</p></div>`}
      </div>
    </div>`;
  },
  suppliersView() {
    var list = D.suppliers();
    var canEdit = App.can("warehouse.edit");
    return `<div>
      <div class="toolbar">
        <span class="t-caption">Who you buy from, and how long they take</span>
        <div class="grow"></div>
        ${canEdit ? `<button class="btn primary" id="sup-add">${icon("plus", 13)} Add supplier</button>` : ""}
      </div>
      ${list.length ? `<div class="sup-grid">
        ${list.map(sup => {
      var mats = Store.state.materials.filter(m => m.supplierId === sup.id);
      var open = D.openPurchases().filter(p => p.supplierId === sup.id).length;
      return `<button class="sup-card" data-sup="${sup.id}">
            <div class="sup-head"><b>${esc(sup.name)}</b>${open ? `<span class="count-badge">${open} open</span>` : ""}</div>
            ${sup.contact ? `<span class="t-caption">${esc(sup.contact)}</span>` : ""}
            ${sup.email ? `<span class="t-caption mono">${esc(sup.email)}</span>` : ""}
            ${sup.phone ? `<span class="t-caption mono">${esc(sup.phone)}</span>` : ""}
            <div class="sup-foot">
              <span class="t-caption">${mats.length} material${mats.length === 1 ? "" : "s"}</span>
              ${sup.leadDays ? `<span class="t-caption">${icon("clock", 12)} ${sup.leadDays} day lead</span>` : ""}
            </div>
          </button>`;
    }).join("")}
      </div>` : `<div class="table-card"><div class="empty-state"><span class="big">${icon("handshake", 40)}</span><h3>No suppliers yet</h3><p>Add the places you buy from, then link them to your materials to order in one click.</p></div></div>`}
    </div>`;
  },
  articlesView() {
    var s = Store.state;
    return `<div>
      <div class="toolbar">
        <span class="t-caption">Standard products — ordering an article auto-creates its routing tasks per part group (facades, carcass…)</span>
        <div class="grow"></div>
        ${App.can("warehouse.edit") ? `<button class="btn primary" id="art-add">${icon("plus", 13)} New article</button>` : ""}
      </div>
      <div class="table-card">
        ${s.articles.length ? `<table class="orders">
          <thead><tr><th>Article</th><th>Unit</th><th>Part groups</th><th>Steps</th><th>Time / unit</th></tr></thead>
          <tbody>
            ${s.articles.map(a => {
      var groups = a.lanes.filter(l => l.group);
      var steps = a.lanes.reduce((n, l) => n + l.route.length, 0);
      var mins = a.lanes.reduce((n, l) => n + l.route.reduce((x, r) => x + r.mpu, 0), 0);
      return `<tr data-article="${a.id}">
                <td class="ord-cell"><b>${esc(a.name)}</b><span class="mono">${esc(a.sku)}</span></td>
                <td><span class="t-caption">${esc(a.unit)}</span></td>
                <td>${groups.length ? groups.map(l => `<span class="task-tag" style="margin-right:4px">${esc(l.group)}</span>`).join("") + `<span class="task-tag" style="background:var(--gray-soft);color:var(--text-2)">Final</span>` : `<span class="muted t-caption">single lane</span>`}</td>
                <td><span class="t-num" style="font-weight:650">${steps}</span></td>
                <td><span class="t-caption t-num">${fmtDur(mins * 60000)}</span></td>
              </tr>`;
    }).join("")}
          </tbody>
        </table>` : `<div class="empty-state"><span class="big">${icon("box", 40)}</span><h3>No articles yet</h3><p>Define your standard products to order them in one click.</p></div>`}
      </div>
    </div>`;
  },
  materialsView() {
    var s = Store.state;
    var q = this.search.trim().toLowerCase();
    var list = [...s.materials];
    if (this.filter === "low") list = list.filter(m => m.qty <= m.minQty);
    if (q) list = list.filter(m => m.name.toLowerCase().includes(q) || m.sku.toLowerCase().includes(q) || (m.location || "").toLowerCase().includes(q));
    list.sort((a, b) => (a.qty <= a.minQty ? 0 : 1) - (b.qty <= b.minQty ? 0 : 1) || a.name.localeCompare(b.name));
    var low = D.lowStock().length;
    return `<div>
      <div class="toolbar">
        <div class="filter-chips">
          <button class="fchip ${this.filter === "all" ? "active" : ""}" data-wf="all">All items</button>
          <button class="fchip ${this.filter === "low" ? "active" : ""}" data-wf="low">${icon("trend-down", 12)} Low stock${low ? ` · ${low}` : ""}</button>
        </div>
        <div class="grow"></div>
        <div class="search-box" style="min-width:230px">${icon("search", 14)}<input id="mat-search" placeholder="Search materials…" value="${esc(this.search)}"></div>
        ${App.can("warehouse.edit") ? `<button class="btn primary" id="mat-add">${icon("plus", 13)} Add material</button>` : ""}
      </div>
      <div class="table-card">
        ${list.length ? `<table class="orders">
          <thead><tr><th>Material</th><th>In stock</th><th>Min</th><th>Location</th><th>Last movement</th><th></th></tr></thead>
          <tbody>
            ${list.map(m => {
      var isLow = m.qty <= m.minQty;
      var onOrder = D.onOrder(m.id);
      var lm = D.lastMove(m.id);
      return `<tr data-mat="${m.id}">
                <td><span class="row" style="gap:11px"><span class="mat-ico">${matIcon(m, 17)}</span><span class="ord-cell"><b>${esc(m.name)}</b><span class="mono">${esc(m.sku)}</span></span></span></td>
                <td><span class="stock-qty ${isLow ? "low" : ""}">${m.qty} <small>${esc(m.unit)}</small> ${isLow ? `<span class="low-badge">Low</span>` : ""}</span>
                  ${onOrder ? `<span class="on-order-badge">＋${onOrder} on order</span>` : ""}</td>
                <td><span class="t-caption t-num">${m.minQty} ${esc(m.unit)}</span></td>
                <td>${m.location ? `<span class="loc-chip">${esc(m.location)}</span>` : `<span class="muted">—</span>`}</td>
                <td>${lm ? `<span class="t-caption">${lm.delta > 0 ? "＋" : "−"}${Math.abs(lm.delta)} · ${esc(lm.note || "")} · ${fmtAgo(lm.ts)}</span>` : `<span class="muted t-caption">—</span>`}</td>
                <td style="text-align:right;white-space:nowrap">
                  ${App.can("warehouse.edit") ? `<button class="btn subtle" data-receive="${m.id}" style="padding:5.5px 12px;font-size:12.5px">${icon("plus", 12)} Receive</button>` : ""}
                </td>
              </tr>`;
    }).join("")}
          </tbody>
        </table>` : `<div class="empty-state"><span class="big">${icon("warehouse", 40)}</span><h3>No materials</h3><p>Add your stock items to track them here.</p></div>`}
      </div>
    </div>`;
  },
  /* A purchase order: edit while it is a draft, receive once it is out */
  poModal(poId) {
    var po = D.purchase(poId);
    if (!po) return;
    var canEdit = App.can("warehouse.edit");
    var draft = po.status === "draft";
    var open = po.status === "sent";
    var sup = D.supplier(po.supplierId);
    var free = Store.state.materials.filter(m => !po.lines.some(l => l.materialId === m.id));
    var dateVal = ts => ts ? new Date(ts - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10) : "";
    Modal.open(`
      <header>
        <h2>${esc(po.num)}</h2>
        ${this.poPill(po)}
        <button class="icon-btn" data-close>${icon("x", 15)}</button>
      </header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Supplier</label>
            ${draft && canEdit ? `<select class="select" id="po-sup">
              <option value="">— none —</option>
              ${D.suppliers().map(x => `<option value="${x.id}" ${x.id === po.supplierId ? "selected" : ""}>${esc(x.name)}</option>`).join("")}
            </select>` : `<div class="readout">${sup ? esc(sup.name) : "—"}</div>`}
          </div>
          <div class="field"><label>Expected${sup && sup.leadDays && draft ? ` (lead ${sup.leadDays}d)` : ""}</label>
            ${po.status !== "received" && canEdit ? `<input class="input" id="po-exp" type="date" value="${dateVal(po.expectedAt)}">` : `<div class="readout">${po.expectedAt ? fmtDate(po.expectedAt) : "—"}</div>`}
          </div>
        </div>

        <div class="t-label" style="margin-bottom:4px">Items</div>
        <div class="po-lines">
          ${po.lines.length ? po.lines.map(l => {
      var m = D.material(l.materialId);
      var out = D.poLineOutstanding(l);
      return `<div class="po-line">
              <span class="mat-ico">${m ? matIcon(m, 16) : icon("box", 16)}</span>
              <span class="grow"><b>${esc(m ? m.name : "removed material")}</b>
                <span class="t-caption">${m ? `${m.qty} ${esc(m.unit)} in stock · min ${m.minQty}` : ""}</span></span>
              ${draft && canEdit ? `<input class="input po-qty" data-po-qty="${l.materialId}" type="number" min="0" step="any" value="${l.qty}">
                   <button class="mini-btn danger" data-po-rm="${l.materialId}" title="Remove">${icon("x", 12)}</button>` : `<span class="t-num t-caption">${l.qty}${m ? " " + esc(m.unit) : ""} ordered${l.received ? ` · ${l.received} received` : ""}</span>`}
              ${open && canEdit ? `<label class="po-recv"><span>Arriving now</span>
                <input class="input po-qty" data-po-recv="${l.id}" type="number" min="0" max="${out}" step="any" value="${out}"></label>` : ""}
            </div>`;
    }).join("") : `<span class="t-caption">Nothing on this order yet.</span>`}
        </div>
        ${draft && canEdit && free.length ? `<div class="po-add-row">
          ${Picker.html("po-newmat", {
      value: "",
      placeholder: `Search ${free.length} materials…`,
      options: free.map(m => ({
        value: m.id,
        label: m.name,
        sub: `${m.sku ? m.sku + " · " : ""}${m.qty} ${m.unit} in stock`
      }))
    })}
          <input class="input" id="po-newqty" type="number" min="0" step="any" placeholder="Qty">
          <button class="btn" id="po-addline">${icon("plus", 12)} Add</button>
        </div>` : ""}

        <div class="field"><label>Notes</label>
          <textarea class="input" id="po-notes" rows="2" ${canEdit && po.status !== "received" ? "" : "disabled"}>${esc(po.notes || "")}</textarea></div>
      </div>
      <footer>
        ${draft && canEdit ? `<button class="btn danger ghost" id="po-del">Delete draft</button>` : ""}
        ${open && canEdit ? `<button class="btn danger ghost" id="po-cancel">Cancel order</button>` : ""}
        <div class="grow"></div>
        <button class="btn ghost" data-close>Close</button>
        ${draft && canEdit ? `<button class="btn primary" id="po-send" ${po.lines.length ? "" : "disabled"}>Mark as ordered</button>` : ""}
        ${open && canEdit ? `<button class="btn green" id="po-recv">Receive delivery</button>` : ""}
      </footer>
    `, modal => {
      Picker.bind(modal);
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var save = () => {
        var patch = {};
        var sel = $("#po-sup", modal);
        if (sel) patch.supplierId = sel.value || null;
        var exp = $("#po-exp", modal);
        if (exp) patch.expectedAt = exp.value ? new Date(exp.value + "T12:00").getTime() : null;
        var nts = $("#po-notes", modal);
        if (nts && !nts.disabled) patch.notes = nts.value.trim();
        M.updatePurchase(po.id, patch, App.me.id);
      };
      $$("[data-po-qty]", modal).forEach(inp => inp.onchange = () => {
        M.setPurchaseLine(po.id, inp.dataset.poQty, Math.max(0, parseFloat(inp.value) || 0), App.me.id);
        App.render();
      });
      $$("[data-po-rm]", modal).forEach(b => b.onclick = () => {
        save();
        M.setPurchaseLine(po.id, b.dataset.poRm, 0, App.me.id);
        App.render();
        this.poModal(po.id);
      });
      var addLine = $("#po-addline", modal);
      if (addLine) addLine.onclick = () => {
        var q = parseFloat($("#po-newqty", modal).value);
        if (!q || q <= 0) {
          $("#po-newqty", modal).focus();
          return;
        }
        save();
        M.setPurchaseLine(po.id, $("#po-newmat", modal).value, q, App.me.id);
        App.render();
        this.poModal(po.id);
      };
      var send = $("#po-send", modal);
      if (send) send.onclick = () => {
        save();
        M.sendPurchase(po.id, App.me.id);
        Modal.close();
        App.render();
        Toast.show(`${po.num} marked as ordered`, {
          emoji: "truck"
        });
      };
      var recv = $("#po-recv", modal);
      if (recv) recv.onclick = () => {
        save();
        var receipts = {};
        $$("[data-po-recv]", modal).forEach(inp => {
          receipts[inp.dataset.poRecv] = parseFloat(inp.value) || 0;
        });
        if (!M.receivePurchase(po.id, receipts, App.me.id)) {
          Toast.show("Nothing to receive — set a quantity above zero", {
            emoji: "info"
          });
          return;
        }
        var after = D.purchase(po.id);
        Modal.close();
        App.render();
        Toast.show(after.status === "received" ? `${po.num} received in full` : `Part of ${po.num} received — the rest stays on order`, {
          emoji: "box"
        });
      };
      var cancel = $("#po-cancel", modal);
      if (cancel) cancel.onclick = () => {
        if (!confirm(`Cancel ${po.num}? It stays on the list as a record.`)) return;
        M.cancelPurchase(po.id, App.me.id);
        Modal.close();
        App.render();
      };
      var del = $("#po-del", modal);
      if (del) del.onclick = () => {
        if (!confirm(`Delete draft ${po.num}?`)) return;
        M.deletePurchase(po.id, App.me.id);
        Modal.close();
        App.render();
      };
      // there is no close hook on Modal, so the header fields save as they change
      ["#po-sup", "#po-exp", "#po-notes"].forEach(sel => {
        var el = $(sel, modal);
        if (el && !el.disabled) el.onchange = save;
      });
    });
  },
  supplierModal(supId) {
    var _sup$leadDays;
    var sup = supId ? D.supplier(supId) : null;
    var mats = sup ? Store.state.materials.filter(m => m.supplierId === sup.id) : [];
    var locked = sup && D.supplierUsed(sup.id);
    Modal.open(`
      <header><h2>${sup ? esc(sup.name) : "New supplier"}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="sup-name" value="${esc((sup === null || sup === void 0 ? void 0 : sup.name) || "")}" placeholder="e.g. Medienos centras"></div>
          <div class="field"><label>Contact person</label><input class="input" id="sup-contact" value="${esc((sup === null || sup === void 0 ? void 0 : sup.contact) || "")}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Email</label><input class="input" id="sup-email" type="email" value="${esc((sup === null || sup === void 0 ? void 0 : sup.email) || "")}"></div>
          <div class="field"><label>Phone</label><input class="input" id="sup-phone" value="${esc((sup === null || sup === void 0 ? void 0 : sup.phone) || "")}"></div>
        </div>
        <div class="field" style="max-width:220px"><label>Typical lead time (days)</label>
          <input class="input" id="sup-lead" type="number" min="0" value="${(_sup$leadDays = sup === null || sup === void 0 ? void 0 : sup.leadDays) !== null && _sup$leadDays !== void 0 ? _sup$leadDays : ""}" placeholder="e.g. 5"></div>
        <div class="field"><label>Notes</label><textarea class="input" id="sup-notes" rows="2">${esc((sup === null || sup === void 0 ? void 0 : sup.notes) || "")}</textarea></div>
        ${sup ? `<div>
          <div class="t-label" style="margin-bottom:4px">Materials from this supplier</div>
          ${mats.length ? mats.map(m => `<div class="movement-row"><span class="note">${esc(m.name)}</span><span class="when">${m.qty} ${esc(m.unit)}</span></div>`).join("") : `<span class="t-caption">None yet — pick this supplier on a material to link it.</span>`}
        </div>` : ""}
        ${sup ? `<button class="btn danger" id="sup-del" style="align-self:flex-start" ${locked ? "disabled title='There is still an open order with this supplier'" : ""}>Delete supplier</button>` : ""}
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="sup-save">${sup ? "Save supplier" : "Add supplier"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      $("#sup-save", modal).onclick = () => {
        var name = $("#sup-name", modal).value.trim();
        if (!name) {
          $("#sup-name", modal).focus();
          return;
        }
        var patch = {
          name,
          contact: $("#sup-contact", modal).value.trim(),
          email: $("#sup-email", modal).value.trim(),
          phone: $("#sup-phone", modal).value.trim(),
          leadDays: parseInt($("#sup-lead", modal).value) || null,
          notes: $("#sup-notes", modal).value.trim()
        };
        sup ? M.updateSupplier(sup.id, patch, App.me.id) : M.addSupplier(patch, App.me.id);
        Modal.close();
        App.render();
      };
      var del = $("#sup-del", modal);
      if (del && !locked) del.onclick = () => {
        if (!confirm(`Delete ${sup.name}? Materials keep their stock but lose the link.`)) return;
        M.deleteSupplier(sup.id, App.me.id);
        Modal.close();
        App.render();
      };
    });
  },
  bind(root) {
    $$("[data-wtab]", root).forEach(b => b.onclick = () => {
      this.tab = b.dataset.wtab;
      App.render();
    });
    $$("[data-wf]", root).forEach(b => b.onclick = () => {
      this.filter = b.dataset.wf;
      App.render();
    });
    var search = $("#mat-search", root);
    if (search) search.oninput = () => {
      this.search = search.value;
      var pos = search.selectionStart;
      App.render();
      var s2 = $("#mat-search");
      if (s2) {
        s2.focus();
        s2.setSelectionRange(pos, pos);
      }
    };
    var matAdd = $("#mat-add", root);
    if (matAdd) matAdd.onclick = () => this.addModal();
    if (App.can("warehouse.edit")) $$("tr[data-mat]", root).forEach(tr => tr.onclick = () => this.materialModal(tr.dataset.mat));
    $$("[data-receive]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      this.materialModal(b.dataset.receive, true);
    });
    var artAdd = $("#art-add", root);
    if (artAdd) artAdd.onclick = () => this.articleModal();

    /* demand */
    $$("[data-dm-order]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      Drawer.open(b.dataset.dmOrder);
    });
    if (App.can("warehouse.edit")) {
      $$("[data-dm-fix]", root).forEach(b => b.onclick = e => {
        e.stopPropagation();
        this.demandModal(b.dataset.dmFix);
      });
      $$("tr[data-dm]", root).forEach(tr => tr.onclick = () => this.demandModal(tr.dataset.dm));
    }
    var dmDraft = $("#dm-draft", root);
    if (dmDraft) dmDraft.onclick = () => {
      var _M$draftFromDemand = M.draftFromDemand(App.me.id),
        created = _M$draftFromDemand.created,
        skipped = _M$draftFromDemand.skipped;
      this.tab = "purchases";
      App.render();
      Toast.show(created.length ? `${created.length} draft order${created.length === 1 ? "" : "s"} for the shortfall${skipped ? ` · ${skipped} material${skipped === 1 ? "" : "s"} skipped, no supplier` : ""}` : "Nothing to draft — the short materials have no supplier yet", {
        emoji: "truck",
        ms: 5000
      });
    };

    /* purchasing */
    $$("tr[data-po]", root).forEach(tr => tr.onclick = () => this.poModal(tr.dataset.po));
    $$("[data-sup]", root).forEach(b => b.onclick = () => this.supplierModal(b.dataset.sup));
    var supAdd = $("#sup-add", root);
    if (supAdd) supAdd.onclick = () => this.supplierModal();
    var poAdd = $("#po-add", root);
    if (poAdd) poAdd.onclick = () => {
      var _D$suppliers$;
      var po = M.createPurchase({
        supplierId: ((_D$suppliers$ = D.suppliers()[0]) === null || _D$suppliers$ === void 0 ? void 0 : _D$suppliers$.id) || null,
        lines: []
      }, App.me.id);
      App.render();
      this.poModal(po.id);
    };
    var draftAll = $("#po-draft-all", root);
    if (draftAll) draftAll.onclick = () => {
      var _M$draftReorder = M.draftReorder(App.me.id),
        created = _M$draftReorder.created,
        skipped = _M$draftReorder.skipped;
      App.render();
      if (!created.length) {
        Toast.show("Nothing to draft — every low material still needs a supplier", {
          emoji: "info"
        });
        return;
      }
      Toast.show(`${created.length} draft order${created.length === 1 ? "" : "s"} ready to review${skipped ? ` · ${skipped} material${skipped === 1 ? "" : "s"} skipped, no supplier` : ""}`, {
        emoji: "truck",
        ms: 5000
      });
      if (created.length === 1) this.poModal(created[0].id);
    };
    if (App.can("warehouse.edit")) $$("tr[data-article]", root).forEach(tr => tr.onclick = () => this.articleModal(tr.dataset.article));
  },
  /* ---------- Article editor (lanes + routes) ---------- */
  articleModal(articleId) {
    var a = articleId ? D.article(articleId) : null;
    // working copy of lanes
    var lanes = a ? JSON.parse(JSON.stringify(a.lanes)) : [{
      group: "Facades",
      route: [{
        stationId: "cut",
        mpu: 6
      }, {
        stationId: "edge",
        mpu: 5
      }]
    }, {
      group: "Carcass",
      route: [{
        stationId: "cut",
        mpu: 8
      }, {
        stationId: "edge",
        mpu: 6
      }]
    }, {
      group: null,
      route: [{
        stationId: "asm",
        mpu: 15
      }, {
        stationId: "pack",
        mpu: 5
      }]
    }];
    var prodStations = () => D.stationsOf("prod");
    var lanesHtml = () => lanes.map((lane, li) => `
      <div class="lane-edit" data-lane="${li}">
        <div class="lh">
          ${lane.group === null ? `<b style="font-size:12.5px">🔗 Final lane <span class="t-caption">(after all part groups)</span></b>` : `<input class="input" data-lane-name="${li}" value="${esc(lane.group)}" placeholder="Part group, e.g. Facades" style="padding:6px 10px;font-size:13px;font-weight:620">`}
          <span class="grow"></span>
          ${lane.group !== null ? `<button class="mini-btn danger" data-lane-del="${li}" title="Remove lane">✕</button>` : ""}
        </div>
        ${lane.route.map((r, ri) => `
          <div class="lane-step">
            <select class="select" data-step-st="${li}/${ri}">
              ${prodStations().map(st => `<option value="${st.id}" ${r.stationId === st.id ? "selected" : ""}>${esc(st.name)}</option>`).join("")}
            </select>
            <input class="input" data-step-mpu="${li}/${ri}" type="number" min="1" value="${r.mpu}">
            <span class="t-caption">min/unit</span>
            <button class="mini-btn danger" data-step-del="${li}/${ri}">✕</button>
          </div>`).join("")}
        <button class="add-inline" data-step-add="${li}">＋ Add step</button>
      </div>`).join("");
    Modal.open(`
      <header><h2>${a ? "Edit article" : "New article"}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="art-name" value="${esc((a === null || a === void 0 ? void 0 : a.name) || "")}" placeholder="e.g. Base cabinet 600"></div>
          <div class="field"><label>SKU</label><input class="input" id="art-sku" value="${esc((a === null || a === void 0 ? void 0 : a.sku) || "")}" placeholder="e.g. BC-600"></div>
        </div>
        <div class="field" style="max-width:140px"><label>Unit</label><input class="input" id="art-unit" value="${esc((a === null || a === void 0 ? void 0 : a.unit) || "pcs")}"></div>
        <div class="field"><label>Routing lanes — part groups made in parallel, then the final lane</label>
          <div id="art-lanes">${lanesHtml()}</div>
          <button class="add-inline" id="art-add-lane" style="align-self:flex-start">＋ Add part group</button>
        </div>
        ${a ? `<button class="btn danger" id="art-del" style="align-self:flex-start">Delete article</button>` : ""}
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="art-save">${a ? "Save article" : "Create article"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var rerenderLanes = () => {
        $("#art-lanes", modal).innerHTML = lanesHtml();
        bindLanes();
      };
      var syncInputs = () => {
        $$("[data-lane-name]", modal).forEach(inp => {
          lanes[+inp.dataset.laneName].group = inp.value.trim() || "Group";
        });
        $$("[data-step-st]", modal).forEach(sel => {
          var _sel$dataset$stepSt$s = sel.dataset.stepSt.split("/"),
            _sel$dataset$stepSt$s2 = _slicedToArray(_sel$dataset$stepSt$s, 2),
            li = _sel$dataset$stepSt$s2[0],
            ri = _sel$dataset$stepSt$s2[1];
          lanes[+li].route[+ri].stationId = sel.value;
        });
        $$("[data-step-mpu]", modal).forEach(inp => {
          var _inp$dataset$stepMpu$ = inp.dataset.stepMpu.split("/"),
            _inp$dataset$stepMpu$2 = _slicedToArray(_inp$dataset$stepMpu$, 2),
            li = _inp$dataset$stepMpu$2[0],
            ri = _inp$dataset$stepMpu$2[1];
          lanes[+li].route[+ri].mpu = Math.max(1, parseInt(inp.value) || 1);
        });
      };
      var bindLanes = () => {
        $$("[data-step-add]", modal).forEach(b => b.onclick = () => {
          syncInputs();
          lanes[+b.dataset.stepAdd].route.push({
            stationId: prodStations()[0].id,
            mpu: 10
          });
          rerenderLanes();
        });
        $$("[data-step-del]", modal).forEach(b => b.onclick = () => {
          syncInputs();
          var _b$dataset$stepDel$sp = b.dataset.stepDel.split("/"),
            _b$dataset$stepDel$sp2 = _slicedToArray(_b$dataset$stepDel$sp, 2),
            li = _b$dataset$stepDel$sp2[0],
            ri = _b$dataset$stepDel$sp2[1];
          lanes[+li].route.splice(+ri, 1);
          rerenderLanes();
        });
        $$("[data-lane-del]", modal).forEach(b => b.onclick = () => {
          syncInputs();
          lanes.splice(+b.dataset.laneDel, 1);
          rerenderLanes();
        });
      };
      bindLanes();
      $("#art-add-lane", modal).onclick = () => {
        syncInputs();
        var finalIdx = lanes.findIndex(l => l.group === null);
        var newLane = {
          group: "New group",
          route: [{
            stationId: "cut",
            mpu: 10
          }]
        };
        if (finalIdx >= 0) lanes.splice(finalIdx, 0, newLane);else lanes.push(newLane);
        rerenderLanes();
      };
      $("#art-save", modal).onclick = () => {
        var name = $("#art-name", modal).value.trim();
        if (!name) {
          $("#art-name", modal).focus();
          return;
        }
        syncInputs();
        var cleaned = lanes.filter(l => l.route.length);
        if (!cleaned.length) {
          Toast.show("Add at least one routing step", {
            emoji: "⚠️"
          });
          return;
        }
        var payload = {
          name,
          sku: $("#art-sku", modal).value.trim() || name.slice(0, 6).toUpperCase(),
          unit: $("#art-unit", modal).value.trim() || "pcs",
          lanes: cleaned
        };
        if (a) M.updateArticle(a.id, payload, App.me.id);else M.addArticle(payload, App.me.id);
        Modal.close();
        App.render();
        Toast.show(a ? "Article updated" : `Article “${name}” created`, {
          emoji: "📦"
        });
      };
      var del = $("#art-del", modal);
      if (del) del.onclick = () => {
        M.deleteArticle(a.id, App.me.id);
        Modal.close();
        App.render();
        Toast.show("Article deleted — existing orders keep their routing", {
          emoji: "🗑"
        });
      };
    });
  },
  materialModal(matId, focusReceive) {
    var _m$reorderQty;
    var m = D.material(matId);
    if (!m) return;
    var isLow = m.qty <= m.minQty;
    var moves = D.materialMoves(matId).slice(0, 10);
    Modal.open(`
      <header>
        <span class="mat-ico" style="width:42px;height:42px">${matIcon(m, 21)}</span>
        <h2 style="margin-left:2px">${esc(m.name)}</h2>
        <button class="icon-btn" data-close>${icon("x", 15)}</button>
      </header>
      <div class="modal-body">
        <div class="qty-hero">
          <span class="n ${isLow ? "low" : ""} t-num">${m.qty}</span>
          <span class="meta"><b>${esc(m.unit)} in stock</b><span>min ${m.minQty} ${esc(m.unit)} · ${m.location ? "shelf " + esc(m.location) : "no location"}</span></span>
          ${(() => {
      var oo = D.onOrder(m.id);
      return oo ? `<span class="on-order-badge">${oo} ${esc(m.unit)} on order</span>` : "";
    })()}
          ${isLow ? `<span class="low-badge" style="font-size:12px;padding:5px 10px">Low — reorder</span>` : ""}
        </div>
        <div class="stock-actions">
          <input class="input" id="stk-qty" type="number" min="0" step="any" placeholder="Qty" value="">
          <input class="input" id="stk-note" placeholder="Note (supplier, reason…)" style="flex:1;width:auto">
          <button class="btn danger" id="stk-use" title="Remove from stock">−</button>
          <button class="btn green" id="stk-recv" title="Add to stock">＋</button>
        </div>
        <div>
          <div class="t-label" style="margin-bottom:4px">Movements</div>
          ${moves.length ? moves.map(sm => {
      var w = D.member(sm.who);
      return `<div class="movement-row">
              <span class="delta ${sm.delta > 0 ? "pos" : "neg"} t-num">${sm.delta > 0 ? "＋" : "−"}${Math.abs(sm.delta)} ${esc(m.unit)}</span>
              <span class="note">${esc(sm.note || "")}</span>
              ${w ? avatarHtml(w, "sm") : ""}
              <span class="when">${fmtAgo(sm.ts)}</span>
            </div>`;
    }).join("") : `<span class="t-caption">No movements yet</span>`}
        </div>
        <div class="opt-sep" style="margin:2px 0"></div>
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="mat-name" value="${esc(m.name)}"></div>
          <div class="field"><label>SKU</label><input class="input" id="mat-sku" value="${esc(m.sku)}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Unit</label><input class="input" id="mat-unit" value="${esc(m.unit)}"></div>
          <div class="field"><label>Min stock (alert below)</label><input class="input" id="mat-min" type="number" min="0" value="${m.minQty}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Location / shelf</label><input class="input" id="mat-loc" value="${esc(m.location || "")}"></div>
          <div class="field"><label>Reorder up to</label>
            <input class="input" id="mat-reorder" type="number" min="0" step="any" value="${(_m$reorderQty = m.reorderQty) !== null && _m$reorderQty !== void 0 ? _m$reorderQty : ""}" placeholder="${D.reorderTarget(m)} ${esc(m.unit)}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Supplier</label>
            ${Picker.html("mat-sup", {
      value: m.supplierId || "",
      placeholder: "Search suppliers…",
      empty: "— none —",
      options: D.suppliers().map(x => ({
        value: x.id,
        label: x.name,
        sub: x.contact || ""
      }))
    })}</div>
          <div class="field"><label>&nbsp;</label><button class="btn danger" id="mat-del">Delete material</button></div>
        </div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Close</button>
        <button class="btn primary" id="mat-save">Save changes</button>
      </footer>
    `, modal => {
      Picker.bind(modal);
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var qtyInp = $("#stk-qty", modal);
      if (focusReceive) setTimeout(() => qtyInp.focus(), 80);
      var doMove = sign => {
        var qv = parseFloat(qtyInp.value);
        if (!qv || qv <= 0) {
          qtyInp.focus();
          return;
        }
        var note = $("#stk-note", modal).value.trim();
        if (sign > 0) M.receiveStock(m.id, qv, note, App.me.id);else M.adjustStock(m.id, -qv, note || "Used / written off", App.me.id);
        Modal.close();
        App.render();
        var nm = D.material(m.id);
        Toast.show(`${sign > 0 ? "＋" : "−"}${qv} ${m.unit} ${m.name} — now ${nm.qty} ${m.unit}`, {
          emoji: sign > 0 ? "📦" : "📤"
        });
        if (nm.qty <= nm.minQty) Toast.show(`${m.name} is low — ${nm.qty} ${m.unit} left`, {
          emoji: "📉",
          ms: 4200
        });
      };
      $("#stk-recv", modal).onclick = () => doMove(+1);
      $("#stk-use", modal).onclick = () => doMove(-1);
      $("#mat-save", modal).onclick = () => {
        M.updateMaterial(m.id, {
          name: $("#mat-name", modal).value.trim() || m.name,
          sku: $("#mat-sku", modal).value.trim(),
          unit: $("#mat-unit", modal).value.trim() || "pcs",
          minQty: parseFloat($("#mat-min", modal).value) || 0,
          location: $("#mat-loc", modal).value.trim(),
          supplierId: $("#mat-sup", modal).value || null,
          reorderQty: parseFloat($("#mat-reorder", modal).value) || null
        }, App.me.id);
        Modal.close();
        App.render();
        Toast.show("Material updated", {
          emoji: "✓"
        });
      };
      $("#mat-del", modal).onclick = () => {
        var snap = Store.snapshot();
        if (!M.deleteMaterial(m.id, App.me.id)) {
          Toast.show("Can't delete — needed by open orders", {
            emoji: "⚠️"
          });
          return;
        }
        Modal.close();
        App.render();
        Toast.show(`${m.name} deleted`, {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
    });
  },
  addModal() {
    Modal.open(`
      <header><h2>Add material</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field"><label>Name</label><input class="input" id="am-name" placeholder="e.g. Oak veneer 0.6 mm"></div>
          <div class="field"><label>SKU</label><input class="input" id="am-sku" placeholder="suggested from the name"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Unit</label><input class="input" id="am-unit" value="pcs"></div>
          <div class="field"><label>Icon</label><button class="mat-ico" id="am-icon" type="button" data-ic="box" style="cursor:pointer">${icon("box", 19)}</button></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Initial stock</label><input class="input" id="am-qty" type="number" min="0" step="any" value="0"></div>
          <div class="field"><label>Min stock (alert below)</label><input class="input" id="am-min" type="number" min="0" step="any" value="0"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>Location / shelf</label><input class="input" id="am-loc" placeholder="e.g. B2"></div>
          <div class="field"><label>Supplier</label>${this.supplierField("am-sup")}</div>
        </div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="am-save">Add material</button>
      </footer>
    `, modal => {
      Picker.bind(modal);
      this.bindSupplierField("am-sup", modal);
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());

      /* follow the name until somebody types their own code, then stop */
      var nameEl = $("#am-name", modal),
        skuEl = $("#am-sku", modal);
      skuEl.oninput = () => {
        skuEl.dataset.touched = "1";
      };
      nameEl.oninput = () => {
        if (skuEl.dataset.touched) return;
        skuEl.value = D.suggestSku(nameEl.value);
      };
      var iconBtn = $("#am-icon", modal);
      iconBtn.onclick = () => Popover.open(iconBtn, `<div class="icon-grid">${MATERIAL_IC_KEYS.map(k => `<button data-ic="${k}" title="${k}">${icon(k, 17)}</button>`).join("")}</div>`, pop => {
        $$("[data-ic]", pop).forEach(ib => ib.onclick = () => {
          iconBtn.dataset.ic = ib.dataset.ic;
          iconBtn.innerHTML = icon(ib.dataset.ic, 19);
          Popover.close();
        });
      });
      $("#am-save", modal).onclick = () => {
        var name = $("#am-name", modal).value.trim();
        if (!name) {
          $("#am-name", modal).focus();
          return;
        }
        var mat = M.addMaterial({
          name,
          sku: $("#am-sku", modal).value.trim() || D.suggestSku(name),
          unit: $("#am-unit", modal).value.trim() || "pcs",
          qty: parseFloat($("#am-qty", modal).value) || 0,
          minQty: parseFloat($("#am-min", modal).value) || 0,
          location: $("#am-loc", modal).value.trim(),
          supplierId: this.resolveSupplierField("am-sup", modal, App.me.id),
          icon: "📦",
          ic: iconBtn.dataset.ic || "box"
        }, App.me.id);
        Modal.close();
        App.render();
        Toast.show(`${mat.name} added to warehouse`, {
          emoji: "🏬"
        });
      };
    });
  }
};

/* ============================================================
   Notifications — in-app centre (bell), live toast + optional
   desktop alert. Managers confirm client approval → engineers hear.
   ============================================================ */
var Notif = {
  ICON: {
    client_ok: "handshake",
    info: "info",
    todo: "todo",
    mention: "at",
    task: "columns"
  },
  bellHtml(memberId) {
    var n = D.unreadCount(memberId);
    return `<button class="icon-btn notif-bell" id="notif-bell" title="Notifications" style="position:relative">
      ${icon("bell", 16)}${n ? `<span class="notif-dot">${n > 9 ? "9+" : n}</span>` : ""}
    </button>`;
  },
  bindBell(root) {
    var bell = $("#notif-bell", root);
    if (bell) bell.onclick = () => this.openPanel(bell);
  },
  openPanel(anchor) {
    var me = App.me.id;
    var list = D.notificationsFor(me).slice(0, 30);
    var canDesktop = typeof Notification !== "undefined";
    var permd = canDesktop && Notification.permission === "granted";
    Popover.open(anchor, `
      <div class="opt-row" style="padding:6px 10px 4px"><b class="grow" style="font-size:13px">Notifications</b>
        ${list.some(n => !n.read) ? `<button class="add-inline" id="nt-readall">Mark all read</button>` : ""}
      </div>
      <div class="opt-sep"></div>
      <div class="notif-list">
        ${list.length ? list.map(n => {
      var by = D.member(n.by);
      return `<button class="notif-item ${n.read ? "" : "unread"}" data-nt="${n.id}" ${n.orderId ? `data-nt-order="${n.orderId}"` : ""} ${n.gprojectId ? `data-nt-gp="${n.gprojectId}" data-nt-gt="${n.gtaskId}"` : ""}>
            <span class="notif-ic ${n.type === "client_ok" ? "ok" : ""}">${icon(this.ICON[n.type] || "info", 15)}</span>
            <span class="grow"><b>${activityHtml(n.text)}</b><span>${by ? esc(by.name) + " · " : ""}${fmtAgo(n.ts)}</span></span>
            ${n.read ? "" : `<span class="notif-unread-dot"></span>`}
          </button>`;
    }).join("") : `<div class="notif-empty">${icon("bell", 22)}<span>No notifications yet</span></div>`}
      </div>
      ${canDesktop && !permd ? `<div class="opt-sep"></div><button class="opt-row clickable" id="nt-desktop" style="font-size:12px;color:var(--accent-text)">${icon("bell", 14)} Enable desktop alerts</button>` : ""}
    `, pop => {
      var readall = $("#nt-readall", pop);
      if (readall) readall.onclick = e => {
        e.stopPropagation();
        M.markAllNotifsRead(me);
        Popover.close();
        App.render();
      };
      var desk = $("#nt-desktop", pop);
      if (desk) desk.onclick = e => {
        e.stopPropagation();
        Notification.requestPermission().then(() => {
          Popover.close();
          Toast.show(Notification.permission === "granted" ? "Desktop alerts on" : "Desktop alerts blocked", {
            emoji: "bell"
          });
        });
      };
      $$("[data-nt]", pop).forEach(b => b.onclick = () => {
        M.markNotifRead(b.dataset.nt);
        Popover.close();
        if (b.dataset.ntGp && D.gproject(b.dataset.ntGp)) {
          GPM.openId = b.dataset.ntGp;
          GPM.tab = "board";
          App.navigate("planner");
          GPM.openTask(b.dataset.ntGp, b.dataset.ntGt);
        } else if (b.dataset.ntOrder && D.order(b.dataset.ntOrder)) Drawer.open(b.dataset.ntOrder);else App.render();
      });
    });
  },
  /* live delivery: toast + optional desktop alert for notifications that
     arrived since this session last looked (fired from the storage sync) */
  flushLive() {
    if (!App.me) return;
    var fresh = D.notificationsFor(App.me.id).filter(n => n.ts > (App._notifSeenTs || 0));
    if (!fresh.length) return;
    App._notifSeenTs = Math.max(App._notifSeenTs || 0, ...fresh.map(n => n.ts));
    var n = fresh[0]; // newest
    Toast.show(n.text, {
      emoji: n.type === "client_ok" ? "handshake" : "bell",
      ms: 6000
    });
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        new Notification(Store.state.shopName + " · " + (n.type === "client_ok" ? "Client approved" : "Update"), {
          body: n.text
        });
      } catch (e) {}
    }
  }
};

/* ============================================================
   To-Do — personal lists; managers can assign to anyone
   ============================================================ */
var Todo = {
  showDone: false,
  itemHtml(t, {
    showFor = false
  } = {}) {
    var by = D.member(t.by);
    var assignedByOther = t.by && t.by !== t.forId;
    var due = t.due ? fmtDue(t.due) : null;
    return `<div class="todo-item ${t.done ? "done" : ""}">
      <button class="todo-check" data-todo-toggle="${t.id}" aria-checked="${t.done}">${t.done ? icon("check", 13) : ""}</button>
      <span class="grow">
        <span class="todo-text">${esc(t.text)}</span>
        <span class="todo-meta">
          ${showFor ? `${avatarHtml(D.member(t.forId), "sm")} ` : ""}
          ${assignedByOther ? `assigned by ${esc((by === null || by === void 0 ? void 0 : by.name) || "?")} · ` : ""}${fmtAgo(t.ts)}
          ${due && !t.done ? ` · <span class="due-chip ${due.cls}">${due.label}</span>` : ""}
          ${t.done && t.doneAt ? ` · done ${fmtAgo(t.doneAt)}` : ""}
        </span>
      </span>
      <button class="mini-btn danger" data-todo-del="${t.id}" title="Delete">${icon("x", 12)}</button>
    </div>`;
  },
  addRow(forId, ph) {
    return `<div class="todo-add">
      <input class="input" data-todo-input="${forId}" placeholder="${ph}">
      <input class="input" data-todo-due="${forId}" type="date" title="Due date (optional)">
      <button class="btn subtle" data-todo-add="${forId}">${icon("plus", 13)} Add</button>
    </div>`;
  },
  view() {
    var me = App.me;
    var mine = D.todosFor(me.id).filter(t => this.showDone || !t.done);
    var others = Store.state.members.filter(m => m.id !== me.id);
    return `<div class="view-anim" style="max-width:900px">
      <div class="toolbar">
        <h2 class="muted" style="font-weight:500">Personal to-dos — everyone sees their own; managers can assign to anyone</h2>
        <div class="grow"></div>
        <button class="fchip ${this.showDone ? "active" : ""}" id="todo-showdone">Show done</button>
      </div>

      <div class="panel" style="margin-bottom:16px">
        <header><h2>${icon("todo", 15)} My list <span class="count-badge">${D.openTodoCount(me.id)}</span></h2></header>
        <div class="todo-list">
          ${mine.length ? mine.map(t => this.itemHtml(t)).join("") : `<div class="empty-mini" style="border:none"><span class="big">${icon("sparkles", 24)}</span>Nothing on your list</div>`}
          ${this.addRow(me.id, "Add a to-do for yourself…")}
        </div>
      </div>

      ${me.role === "manager" ? `
      <div class="section-title"><h2>Team lists</h2></div>
      <div class="todo-grid">
        ${others.map(m => {
      var list = D.todosFor(m.id).filter(t => this.showDone || !t.done);
      return `<div class="panel">
            <header style="padding-bottom:10px">${avatarHtml(m, "md")}<h2 style="flex:1;margin-left:4px">${esc(m.name)}</h2><span class="count-badge">${D.openTodoCount(m.id)}</span></header>
            <div class="todo-list">
              ${list.length ? list.map(t => this.itemHtml(t)).join("") : `<div class="t-caption" style="padding:6px 16px 10px">No open to-dos</div>`}
              ${this.addRow(m.id, `Assign a task to ${esc(m.name)}…`)}
            </div>
          </div>`;
    }).join("")}
      </div>` : ""}
    </div>`;
  },
  bind(root) {
    var sd = $("#todo-showdone", root);
    if (sd) sd.onclick = () => {
      this.showDone = !this.showDone;
      App.render();
    };
    $$("[data-todo-toggle]", root).forEach(b => b.onclick = () => {
      M.toggleTodo(b.dataset.todoToggle, App.me.id);
      App.render();
    });
    $$("[data-todo-del]", root).forEach(b => b.onclick = () => {
      var snap = Store.snapshot();
      M.deleteTodo(b.dataset.todoDel);
      App.render();
      Toast.show("To-do deleted", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    });
    $$("[data-todo-add]", root).forEach(b => {
      var forId = b.dataset.todoAdd;
      var input = $(`[data-todo-input="${forId}"]`, root);
      var dueEl = $(`[data-todo-due="${forId}"]`, root);
      var add = () => {
        var _D$member2;
        var text = input.value.trim();
        if (!text) {
          input.focus();
          return;
        }
        M.addTodo({
          text,
          forId,
          due: dueEl.value ? new Date(dueEl.value + "T12:00:00").getTime() : null
        }, App.me.id);
        App.render();
        var who = forId === App.me.id ? "your list" : ((_D$member2 = D.member(forId)) === null || _D$member2 === void 0 ? void 0 : _D$member2.name) || "";
        Toast.show(`Added to ${who}`, {
          emoji: "todo"
        });
      };
      b.onclick = add;
      input.onkeydown = e => {
        if (e.key === "Enter") add();
      };
    });
  }
};

/* ============================================================
   Activity (full audit trail)
   ============================================================ */
/* ============================================================
   Needs attention — the one screen to open first

   Nothing here is new information. It was spread across the warehouse, the
   board, the order list and the activity feed, and holding five screens in
   your head every morning is how things got lost.
   ============================================================ */
Object.assign(Mgr, {
  attention() {
    var a = D.attention(App.me.id);
    var sec = (id, ico, title, n, body, tone) => !n ? "" : `<div class="panel att-sec">
      <header><h2><span style="color:var(--${tone || "orange"})">${icon(ico, 15)}</span> ${title}</h2>
        <span class="att-n">${n}</span></header>
      <div class="panel-list">${body}</div>
    </div>`;
    var jobRow = (o, right, sub) => `<button class="panel-row" data-order="${o.id}">
      <span class="grow"><b>${esc(o.num)} · ${esc(o.product)}</b>
        <span>${o.client ? esc(o.client) + " · " : ""}${sub}</span></span>
      ${right}
    </button>`;
    var waitingHtml = a.shortfalls.slice(0, 8).map(r => {
      /* something short but arriving Thursday is a different problem from
         something short with nothing on the way — say which */
      var d = r.material ? D.onOrderDetail(r.material.id) : null;
      var eta = d && d.total ? d.sent && d.expectedAt ? d.late ? ` · ${Math.round(d.total)} was due ${fmtDate(d.expectedAt)}` : ` · ${Math.round(d.total)} arriving ${fmtDate(d.expectedAt)}` : d.sent ? ` · ${Math.round(d.total)} ordered, no date` : ` · ${Math.round(d.total)} still only drafted` : "";
      return `<button class="panel-row" data-goto="warehouse" data-wtab="demand">
        <span style="color:var(--${d && d.late ? "red" : "orange"})">${icon(d && d.total ? "truck" : "trend-down", 17)}</span>
        <span class="grow"><b>${esc(r.name)}</b>
          <span>${r.lines.length} project${r.lines.length === 1 ? "" : "s"} need ${r.need} ${esc(r.unit)}${r.stock === null ? " · not in the warehouse" : ` · ${r.stock} on the shelf`}${eta}</span></span>
        <span class="low-badge">${Math.round(r.short * 100) / 100} short</span>
      </button>`;
    }).join("");

    /* promised by a date that has gone by — the handles nobody was watching */
    var overdueDetailsHtml = a.overdueDetails.slice(0, 8).map(({
      order,
      detail
    }) => jobRow(order, `<span class="due-chip bad">${fmtDue(detail.due).label}</span>`, `${esc(detail.label)}${detail.value ? " · " + esc(detail.value) : ""} — ordered, expected ${fmtDate(detail.due)}`)).join("");
    var blockedHtml = a.blocked.slice(0, 8).map(({
      order,
      op
    }) => jobRow(order, `<span class="pill blocked"><span class="dot"></span>Blocked</span>`, `${esc((D.station(op.stationId) || {}).name || "—")}${op.blockNote ? " · " + esc(op.blockNote) : ""}`)).join("");
    var lateHtml = a.late.slice(0, 8).map(o => jobRow(o, `<span class="due-chip overdue">${fmtDue(o.due).label}</span>`, `at ${esc((D.station((D.currentOp(o) || {}).stationId) || {}).name || "—")}`)).join("");
    var staleHtml = a.stale.slice(0, 8).map(({
      order,
      since
    }) => jobRow(order, `<span class="tag">${since ? fmtAgo(since) : "never"}</span>`, `nothing has moved on it`)).join("");
    var changedHtml = a.changed.slice(0, 10).map(c => {
      var m = D.member(c.who);
      return `<${c.orderId ? "button" : "div"} class="panel-row" ${c.orderId ? `data-order="${c.orderId}"` : ""}>
        ${avatarHtml(m, "sm")}
        <span class="grow"><b>${esc(m ? m.name : "Someone")}</b><span>${activityHtml(c.text)}</span></span>
        <span class="tag">${fmtAgo(c.ts)}</span>
      </${c.orderId ? "button" : "div"}>`;
    }).join("");
    var nothing = !a.count && !a.changed.length;
    return `<div class="view-anim" style="max-width:860px">
      <div class="toolbar">
        <span class="t-caption">${nothing ? "Nothing is waiting on you." : `${a.count} thing${a.count === 1 ? "" : "s"} to look at${a.changed.length ? ` · ${a.changed.length} change${a.changed.length === 1 ? "" : "s"} since you last looked` : ""}`}</span>
        <div class="grow"></div>
        ${a.changed.length ? `<button class="btn" id="att-seen">Mark changes as seen</button>` : ""}
      </div>

      ${sec("details", "truck", "Ordered and still not here", a.overdueDetails.length, overdueDetailsHtml, "red")}
      ${sec("materials", "trend-down", "Waiting on materials", a.shortfalls.length, waitingHtml)}
      ${sec("blocked", "ban", "Blocked", a.blocked.length, blockedHtml, "red")}
      ${sec("late", "clock", "Past due", a.late.length, lateHtml, "red")}
      ${sec("stale", "zzz", `Not moved in ${D.STALE_DAYS} days`, a.stale.length, staleHtml, "gray")}
      ${sec("changed", "history", "Changed since you last looked", a.changed.length, changedHtml, "blue")}

      ${nothing ? `<div class="empty-state"><span class="big">${icon("check-circle", 40)}</span>
        <h3>All clear</h3><p>No shortages, nothing blocked or overdue, and nothing has gone quiet.</p></div>` : ""}
    </div>`;
  },
  bindAttention(root) {
    $$("[data-order]", root).forEach(b => b.onclick = () => Drawer.open(b.dataset.order));
    $$("[data-goto]", root).forEach(b => b.onclick = () => {
      if (b.dataset.wtab) Warehouse.tab = b.dataset.wtab;
      App.navigate(b.dataset.goto);
    });
    var seen = $("#att-seen", root);
    if (seen) seen.onclick = () => {
      M.setPref(App.me.id, "attentionSeen", Date.now());
      App.render();
      Toast.show("Caught up", {
        emoji: "check"
      });
    };
  }
});
var Activity = {
  who: "",
  search: "",
  project: "",
  // one project's whole story
  kind: "",
  // progress / materials / routing / …
  limit: 120,
  // raised by "Show earlier", never a silent cutoff

  view() {
    var s = Store.state;
    var q = this.search.trim().toLowerCase();
    var list = [...s.activity].sort((a, b) => b.ts - a.ts);
    if (this.who) list = list.filter(a => a.who === this.who);
    if (this.project) {
      var o = D.order(this.project);
      list = list.filter(a => a.orderId === this.project || o && a.text.includes(o.num));
    }
    if (this.kind) list = list.filter(a => D.activityKind(a) === this.kind);
    if (q) list = list.filter(a => a.text.toLowerCase().includes(q));
    var total = list.length;
    var shown = list.slice(0, this.limit);

    /* group by day */
    var groups = [];
    var curKey = null;
    var _iterator6 = _createForOfIteratorHelper(shown),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var a = _step6.value;
        var d = new Date(a.ts);
        var key = d.toDateString();
        if (key !== curKey) {
          curKey = key;
          var today = new Date().toDateString();
          var yest = new Date(Date.now() - DAY).toDateString();
          groups.push({
            label: key === today ? "Today" : key === yest ? "Yesterday" : d.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric"
            }),
            items: []
          });
        }
        groups[groups.length - 1].items.push(a);
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return `<div class="view-anim" style="max-width:760px">
      <div class="toolbar">
        <div class="member-filter">
          <button class="fchip all-chip ${!this.who ? "active" : ""}" data-who="">Everyone</button>
          ${s.members.map(m => `<button class="fchip ${this.who === m.id ? "active" : ""}" data-who="${m.id}">${avatarHtml(m, "sm")} ${esc(m.name)}</button>`).join("")}
        </div>
        <div class="grow"></div>
        <div class="search-box" style="min-width:210px">${icon("search", 14)}<input id="act-search" placeholder="Search changes…" value="${esc(this.search)}"></div>
      </div>
      <div class="toolbar" style="margin-top:-4px">
        <select class="select" id="act-project" style="max-width:280px">
          <option value="">All projects</option>
          ${[...s.orders].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).map(o => `<option value="${o.id}" ${this.project === o.id ? "selected" : ""}>${esc(o.num)} · ${esc(o.product)}${o.archived ? " (archived)" : ""}</option>`).join("")}
        </select>
        <div class="filter-chips">
          <button class="fchip ${!this.kind ? "active" : ""}" data-akind="">Everything</button>
          ${D.ACT_KINDS.map(([id, label]) => `<button class="fchip ${this.kind === id ? "active" : ""}" data-akind="${id}">${label}</button>`).join("")}
        </div>
      </div>
      ${this.project ? (() => {
      var o = D.order(this.project);
      return o ? `<div class="act-project">
          <span class="grow"><b>${esc(o.num)} · ${esc(o.product)}</b>
            <span>${total} change${total === 1 ? "" : "s"}${o.client ? " · " + esc(o.client) : ""}</span></span>
          <button class="btn subtle" id="act-open">Open project</button>
        </div>` : "";
    })() : ""}
      ${groups.length ? groups.map(g => `
        <div class="day-head">${g.label}</div>
        <div class="act-card">
          ${g.items.map(a => {
      var m = D.member(a.who);
      var clickable = a.orderId || a.materialId;
      var time = new Date(a.ts).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit"
      });
      return `<${clickable ? "button" : "div"} class="act-row" ${a.orderId ? `data-act-order="${a.orderId}"` : a.materialId ? `data-act-mat="${a.materialId}"` : ""}>
              ${avatarHtml(m, "md")}
              <span class="txt"><b>${esc(m ? m.name : "Someone")}</b> ${activityHtml(a.text)}</span>
              <span class="when">${time}</span>
            </${clickable ? "button" : "div"}>`;
    }).join("")}
        </div>
      `).join("") : `<div class="empty-state"><span class="big">${icon("history", 40)}</span><h3>No activity found</h3><p>Try another person, project or search.</p></div>`}
      ${total > shown.length ? `<div style="display:flex;justify-content:center;padding:14px 0">
        <button class="btn" id="act-more">Show earlier — ${total - shown.length} more</button></div>` : total ? `<div class="t-caption" style="text-align:center;padding:12px 0">That is the whole history — ${total} change${total === 1 ? "" : "s"}</div>` : ""}
    </div>`;
  },
  bind(root) {
    /* any change of filter starts the window again, or "show earlier" would
       carry a depth that belonged to a different question */
    $$("[data-who]", root).forEach(b => b.onclick = () => {
      this.who = b.dataset.who;
      this.limit = 120;
      App.render();
    });
    $$("[data-akind]", root).forEach(b => b.onclick = () => {
      this.kind = b.dataset.akind;
      this.limit = 120;
      App.render();
    });
    var proj = $("#act-project", root);
    if (proj) proj.onchange = () => {
      this.project = proj.value;
      this.limit = 120;
      App.render();
    };
    var more = $("#act-more", root);
    if (more) more.onclick = () => {
      this.limit += 200;
      App.render();
    };
    var open = $("#act-open", root);
    if (open) open.onclick = () => Drawer.open(this.project);
    var search = $("#act-search", root);
    if (search) search.oninput = () => {
      this.search = search.value;
      this.limit = 120;
      var pos = search.selectionStart;
      App.render();
      var s2 = $("#act-search");
      if (s2) {
        s2.focus();
        s2.setSelectionRange(pos, pos);
      }
    };
    $$("[data-act-order]", root).forEach(b => b.onclick = () => {
      if (D.order(b.dataset.actOrder)) Drawer.open(b.dataset.actOrder);
    });
    $$("[data-act-mat]", root).forEach(b => b.onclick = () => {
      if (D.material(b.dataset.actMat)) Warehouse.materialModal(b.dataset.actMat);
    });
  }
};

/* ============================================================
   Order detail (drawer content) — shared by manager & worker
   ============================================================ */
var OrderDetail = {
  /* ============================================================
     The cabinets themselves
      Assembly on a SWOOD job is counted in modules, and "0/48" means nothing
     to the person holding the screwdriver. These are the cabinets, by name,
     and ticking one IS the progress report — so the count and the bench can
     never disagree.
     ============================================================ */
  /* ---------- the project sheet ----------
     The drawer is a column you scroll: stages, then remarks, then details,
     then materials, then the part list. Everything is in it and nothing is
     next to anything. This is the same panels side by side on one screen —
     composed from the very same methods, so there is no second version of any
     of it to drift. */
  sheetModal(orderId) {
    var _this = this;
    var o = D.order(orderId);
    if (!o) return;
    var canEdit = App.can("orders.edit");
    var isEng = o.type === "eng";
    var st = D.orderStatus(o);
    var due = fmtDue(o.due);
    var p = D.progress(o);
    var crew = D.orderResponsible(o).map(id => D.member(id)).filter(Boolean);
    var sum = D.detailSummary(o);
    var cur = D.currentOp(o);
    Modal.open(`
      <header>
        <h2>${esc(o.product || o.num)}</h2>
        <span class="t-caption">${esc(o.num)}${o.client ? " · " + esc(o.client) : ""}</span>
        <div class="grow"></div>
        <button class="icon-btn" data-close>${icon("x", 15)}</button>
      </header>
      <div class="modal-body sheet">
        <div class="sheet-facts">
          <div><span class="t-label">Status</span>${pillHtml(st, D.statusLabel[st])}</div>
          <div><span class="t-label">Due</span><b class="${due.cls === "overdue" ? "bad" : ""}">${due.label}</b></div>
          <div><span class="t-label">${isEng ? "Stage" : "Now at"}</span><b>${esc(cur ? (D.station(cur.stationId) || {}).name || "—" : "—")}</b></div>
          <div><span class="t-label">Progress</span><b>${p.done}/${p.total} <span>tasks</span></b></div>
          <div><span class="t-label">On it</span>
            <b>${crew.length ? `<span class="row" style="gap:5px">${crew.slice(0, 4).map(m => avatarHtml(m, "sm")).join("")}
              ${esc(crew.map(m => m.name.split(" ")[0]).join(", "))}</span>` : "—"}</b></div>
          ${sum.total ? `<div><span class="t-label">Waiting on</span>
            <b class="${sum.late ? "bad" : ""}">${sum.late ? `${sum.late} <span>overdue</span>` : sum.open ? `${sum.open} <span>outstanding</span>` : "nothing"}</b></div>` : ""}
        </div>

        <div class="sheet-cols">
          <div class="sheet-col">${this.detailsHtml(o, canEdit)}</div>
          <div class="sheet-col">
            ${this.remarksHtml(o)}
            <div style="margin-top:18px">
              <div class="t-label" style="margin-bottom:8px">Drawings &amp; photos</div>
              ${(() => {
      var fs = D.filesFor({
        orderId: o.id
      });
      return `<div class="od-files">
                  ${fs.length ? Files.chipsHtml(fs, {
        canEdit
      }) : `<span class="t-caption">Nothing attached</span>`}
                  ${canEdit ? Files.dropHtml("sheet-files-in", fs.length ? "Add another" : "Add a drawing or photo") : ""}
                </div>`;
    })()}
            </div>
            <div style="margin-top:18px">
              <div class="t-label" style="margin-bottom:8px">History — every change, by whom</div>
              <div class="sheet-hist">
                ${D.orderHistory(o.id).slice(0, 12).map(a => {
      var who = D.member(a.who);
      return `<div class="activity-row" style="border:none;padding:4px 0">
                    ${avatarHtml(who, "sm")}
                    <span class="txt"><b>${esc(who ? who.name : "?")}</b> ${activityHtml(a.text)}</span>
                    <span class="when">${fmtAgo(a.ts)}</span>
                  </div>`;
    }).join("") || `<span class="t-caption">Nothing has happened yet</span>`}
              </div>
            </div>

            ${o.notes || canEdit ? `<div style="margin-top:18px">
              <div class="t-label" style="margin-bottom:8px">Notes</div>
              ${canEdit ? `<textarea class="input" id="sheet-notes" rows="3" placeholder="Anything that is not a remark or a detail…">${esc(o.notes)}</textarea>` : `<div class="meta-box" style="font-size:13.5px;line-height:1.5">${esc(o.notes) || "—"}</div>`}
            </div>` : ""}
          </div>
        </div>
      </div>
      <footer>
        <button class="btn ghost" id="sheet-open">${icon("arrow-right", 13)} Open the full project</button>
        <button class="btn subtle" id="sheet-xlsx">${icon("table", 13)} Export .xlsx</button>
        ${D.projectLink(o) ? `<button class="btn subtle" id="sheet-od">${icon("cloud", 13)} Project folder</button>` : ""}
        <div class="grow"></div>
        <button class="btn primary" data-close>Done</button>
      </footer>`, m => {
      m.classList.add("sheet-modal"); // wider than a dialog: it is a page
      /* the panels are the drawer's own, so they bind with the drawer's own
         handlers — pointed at the modal instead of the drawer */
      this.bind(m, o);
      /* after bind, never before: it is the drawer's handlers running over
         somebody else's markup, and the last word has to be the sheet's */
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      var notes = $("#sheet-notes", m);
      if (notes) notes.onchange = () => {
        M.updateOrderLogged(o.id, {
          notes: notes.value
        }, App.me.id);
        App.render();
      };
      if (canEdit) Files.bindDrop(m, "sheet-files-in", /*#__PURE__*/function () {
        var _ref5 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5(picked) {
          var _iterator7, _step7, f;
          return _regeneratorRuntime().wrap(function _callee5$(_context5) {
            while (1) switch (_context5.prev = _context5.next) {
              case 0:
                _iterator7 = _createForOfIteratorHelper(picked);
                _context5.prev = 1;
                _iterator7.s();
              case 3:
                if ((_step7 = _iterator7.n()).done) {
                  _context5.next = 15;
                  break;
                }
                f = _step7.value;
                _context5.prev = 5;
                _context5.next = 8;
                return Files.attach(f, {
                  orderId: o.id
                }, App.me.id);
              case 8:
                _context5.next = 13;
                break;
              case 10:
                _context5.prev = 10;
                _context5.t0 = _context5["catch"](5);
                Toast.show(_context5.t0.message, {
                  emoji: "alert",
                  ms: 5000
                });
              case 13:
                _context5.next = 3;
                break;
              case 15:
                _context5.next = 20;
                break;
              case 17:
                _context5.prev = 17;
                _context5.t1 = _context5["catch"](1);
                _iterator7.e(_context5.t1);
              case 20:
                _context5.prev = 20;
                _iterator7.f();
                return _context5.finish(20);
              case 23:
                App.render();
                Drawer.refresh();
                Modal.close();
                _this.sheetModal(o.id); // redraw the sheet with them on it
              case 27:
              case "end":
                return _context5.stop();
            }
          }, _callee5, null, [[1, 17, 20, 23], [5, 10]]);
        }));
        return function (_x) {
          return _ref5.apply(this, arguments);
        };
      }());
      Files.bindChips(m, {
        onRemove: () => {
          Modal.close();
          this.sheetModal(o.id);
        }
      });
      $("#sheet-open", m).onclick = () => {
        Modal.close();
        Drawer.open(o.id);
      };
      /* The card as a workbook: everything on this screen, by category, in the
         sheets a supplier or a client can actually be sent. */
      $("#sheet-xlsx", m).onclick = () => {
        try {
          var name = SheetExport.download(o.id);
          var link = D.projectLink(o);
          Toast.show(name ? `${name} saved` : "Could not build the file", {
            emoji: name ? "check" : "alert",
            ms: 7000,
            undo: link && name ? () => window.open(link, "_blank", "noopener") : null,
            undoLabel: link && name ? "Open the project folder" : null
          });
        } catch (e) {
          Toast.show(e && e.message || "Could not build the file", {
            emoji: "alert",
            ms: 6000
          });
        }
      };
      var od = $("#sheet-od", m);
      if (od) od.onclick = () => window.open(D.projectLink(o), "_blank", "noopener");
    });
  },
  /* ---------- remarks ----------
     A thread, not a field. Notes are one block somebody overwrites; this
     keeps who said what and when, and reaches the people carrying the project
     whether or not anyone remembered to @ them. On an engineering project the
     conversation IS the work, so it sits near the top rather than under the
     part list. */
  remarksHtml(o) {
    var list = o.comments || [];
    var unread = D.unreadComments(o, App.me.id);
    return `<div>
      <div class="t-label" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="grow">Remarks — everyone on this project is told</span>
        ${unread ? `<span class="due-chip bad">${unread} <span>new</span></span>` : ""}
        ${list.length ? `<span class="t-caption">${list.length}</span>` : ""}
      </div>
      <div class="ocomment-list">
        ${list.map(c => commentRowHtml(c, {
      canDelete: App.isManager() || c.by === App.me.id
    })).join("") || `<span class="t-caption">Nothing written yet — a remark here reaches whoever is carrying the project.</span>`}
      </div>
      <div class="ocomment-add">${avatarHtml(App.me, "sm")}
        <input class="input" id="od-c-input" placeholder="Write a remark — type @ to name someone…" autocomplete="off">
        <button class="btn subtle" id="od-c-add" title="Post remark">${icon("send", 13)}</button>
      </div>
    </div>`;
  },
  /* ---------- project details ----------
     One row per thing being waited on, because "rankenos užsakytos" was a fact
     somebody knew and nobody could see. Everything is editable in place; the
     state chip is a button that walks need → ordered → arrived, since that is
     the change people actually make. */
  detailsHtml(o, canEdit) {
    var list = D.details(o);
    var sum = D.detailSummary(o);
    var chip = d => {
      var late = D.detailLate(d);
      var cls = {
        info: "",
        need: "warn",
        ordered: late ? "bad" : "go",
        here: "ok"
      }[d.state] || "";
      return `<button class="dt-state ${cls}" ${canEdit ? `data-dt-cycle="${d.id}"` : "disabled"}
        title="${canEdit ? "Click to move it on" : ""}">${icon({
        info: "info",
        need: "alert",
        ordered: "truck",
        here: "check-circle"
      }[d.state] || "info", 13)}
        <span>${D.DETAIL_LABEL[d.state]}</span></button>`;
    };
    return `<div>
      <div class="t-label" style="display:flex;align-items:center;gap:8px;margin-bottom:10px;flex-wrap:wrap">
        <span class="grow">Details — what is ordered, what is still missing</span>
        ${sum.late ? `<span class="due-chip bad">${sum.late} <span>overdue</span></span>` : sum.open ? `<span class="due-chip">${sum.open} <span>outstanding</span></span>` : ""}
      </div>
      ${list.length ? D.detailsByCategory(o).map(g => `
        <div class="dt-group">
          <div class="dt-group-head">
            <span class="ico">${icon(g.ic, 13)}</span><b>${esc(g.label)}</b>
            <span class="grow"></span>
            ${g.late ? `<span class="due-chip bad">${g.late} <span>overdue</span></span>` : g.open ? `<span class="t-caption">${g.open} <span>outstanding</span></span>` : ""}
          </div>
          <div class="dt-list">
        ${g.rows.map(d => `<div class="dt-row ${d.state} ${D.detailLate(d) ? "late" : ""}" data-dt="${d.id}">
          ${chip(d)}
          <span class="dt-main">
            ${canEdit ? `<input class="dt-in dt-label" data-dt-label="${d.id}" value="${esc(d.label)}" placeholder="What?">` : `<b>${esc(d.label)}</b>`}
            ${canEdit ? `<input class="dt-in dt-value" data-dt-value="${d.id}" value="${esc(d.value)}" placeholder="Supplier, code, quantity…">` : d.value ? `<span>${esc(d.value)}</span>` : ""}
            ${canEdit ? `<select class="dt-in dt-cat" data-dt-cat="${d.id}" title="What kind of thing is this?">
              ${D.DETAIL_CATS.map(c => `<option value="${c.id}" ${(d.cat || "other") === c.id ? "selected" : ""}>${esc(c.label)}</option>`).join("")}
              ${D.detailCat(d.cat) ? "" : `<option value="${esc(d.cat || "other")}" selected>${esc(D.detailCatLabel(d))}</option>`}
            </select>` : ""}
          </span>
          ${d.state === "ordered" ? canEdit ? `<input class="dt-in dt-due" type="date" data-dt-due="${d.id}" value="${d.due ? new Date(d.due).toISOString().slice(0, 10) : ""}" title="Expected">` : `<span class="t-caption">${d.due ? fmtDate(d.due) : "—"}</span>` : `<span class="dt-when t-caption">${d.at ? fmtAgo(d.at) : ""}</span>`}
          ${canEdit ? `<button class="mini-btn danger" data-dt-del="${d.id}" title="Remove">✕</button>` : ""}
        </div>`).join("")}
          </div>
        </div>`).join("") : `<div class="t-caption" style="margin-bottom:8px">Nothing noted yet — handles, worktops, anything being waited on.</div>`}
      ${canEdit ? `<div class="dt-add">
        <input class="input" id="dt-new" placeholder="e.g. Rankenos, stalviršis, spyruoklės">
        <select class="select" id="dt-new-cat">
          ${D.DETAIL_CATS.map(c => `<option value="${c.id}">${esc(c.label)}</option>`).join("")}
        </select>
        <button class="btn subtle" id="dt-add">${icon("plus", 13)} Add</button>
      </div>` : ""}
    </div>`;
  },
  /* The count is a guess made from SOLIDNAME; this is how the shop corrects it. */
  moduleCountModal(orderId) {
    var o = D.order(orderId);
    var mods = D.orderModules(o);
    var op = D.assemblyOp(o);
    var item = op ? D.item(o, op.itemId) : null;
    /* The number on screen is the checklist's if there is one, and the assembly
       line's quantity if there is not — which is the case for every job
       imported before cabinets were tracked. */
    var now = mods.length || (item ? item.qty : 0);
    var source = mods.length ? mods.map(m => m.name) : D.moduleNamesFromParts(o);
    var fresh = !mods.length;
    Modal.open(`
      <header><h2>How many cabinets?</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--text-2)">
          ${fresh ? `${item ? `<b>${esc(item.name)}</b> is set to <b>${now}</b>` : `This job is set to <b>${now}</b>`}, because the import counted
               the panels the cabinets are made of rather than the cabinets themselves.
               Put the real number in and the assembly, QC and packing steps all follow it${source.length ? ", and you get a checklist to tick off cabinet by cabinet." : "."}` : `The import works the cabinets out from the SOLIDNAME column, and it currently makes
               <b>${now}</b>. If the real number is lower, it has been counting panels —
               several names for the same cabinet that never collapsed into one.`}
        </p>
        <div class="form-row">
          <div class="field" style="max-width:150px"><label>Cabinets in this job</label>
            <input class="input" id="mc-n" type="number" min="1" value="${now}"></div>
        </div>
        <div class="t-caption">${source.length ? `It will try to recover the real names first — ${esc(source.slice(0, 3).join(", "))}${source.length > 3 ? "…" : ""}
             — by trimming the part off the end or the front. Only if nothing groups cleanly does it number them.` : `This job kept no cabinet names — it was imported before they were recorded — so they will be
             numbered. You can rename any of them afterwards by clicking it.`}</div>
        <div id="mc-preview" style="margin-top:10px"></div>
      </div>
      <footer>
        <div class="grow"></div>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="mc-go">Set the count</button>
      </footer>`, m => {
      var input = $("#mc-n", m),
        prev = $("#mc-preview", m);
      var paint = () => {
        var want = Math.max(1, Math.round(input.valueAsNumber || 0));
        var names = source.length === want ? source : D.regroupModules(source, want);
        prev.innerHTML = want === now && !fresh ? "" : names ? `<div class="mc-ok">${icon("check-circle", 15)}<span>${want} cabinets, named: <b>${esc(names.slice(0, 4).join(", "))}${names.length > 4 ? "…" : ""}</b></span></div>` : `<div class="mc-warn">${icon("alert", 15)}<span>${source.length ? `The names do not group into ${want}, so they will be numbered` : `They will be numbered`} <b>Cabinet 1…${want}</b>. You can rename any of them afterwards.</span></div>`;
      };
      input.oninput = paint;
      paint();
      $("#mc-go", m).onclick = () => {
        var r = M.setModuleCount(o.id, input.valueAsNumber, App.me.id);
        Modal.close();
        App.render();
        Drawer.refresh();
        if (r) Toast.show(`${r.count} cabinets — ${r.recovered ? "names recovered" : "numbered; rename any that need it"}`, {
          emoji: "check",
          ms: 4500
        });
      };
    });
  },
  modulesHtml(o) {
    var mods = D.orderModules(o);
    var done = D.modulesDone(o),
      total = D.modulesTotal(o);
    var canEdit = App.can("orders.edit") || App.can("orders.assign");
    var op = D.assemblyOp(o);
    var st = op ? D.station(op.stationId) : null;

    /* which materials each cabinet needs, so you can see at a glance whether
       the parts for it have actually been cut yet */
    var boards = name => {
      var parts = (o.parts || []).filter(p => (p.solid || "").includes(name) || (p.name || "") === name);
      return [...new Set(parts.map(p => p.board))].filter(Boolean);
    };
    var cutFor = board => {
      var item = o.items.find(i => i.name === board);
      if (!item) return null;
      var first = o.ops.find(x => x.itemId === item.id);
      return first ? first.status === "done" ? "done" : first.qtyDone > 0 ? "part" : "no" : null;
    };
    return `<div>
      <div class="t-label" style="display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap">
        <span class="grow">Cabinets — ${done} of ${total} assembled${st ? ` · counted at ${esc(st.name)}` : ""}</span>
        ${canEdit ? `<button class="link" id="mod-count">${mods.length} <span>cabinets — not right?</span></button>` : ""}
        ${canEdit && done < total ? `<button class="link" id="mod-all">Tick all</button>` : ""}
        ${canEdit && done > 0 ? `<button class="link" id="mod-none">Clear</button>` : ""}
      </div>
      <div class="mod-list">
        ${mods.map(m => {
      var bs = boards(m.name);
      var blocked = bs.filter(b => cutFor(b) === "no");
      return `<label class="mod-row ${m.done >= (m.qty || 1) ? "on" : ""}">
            <input type="checkbox" data-mod="${m.id}" ${m.done >= (m.qty || 1) ? "checked" : ""} ${canEdit ? "" : "disabled"}>
            <span class="grow"><b ${canEdit ? `data-mod-name="${m.id}" title="Click to rename"` : ""}>${esc(m.name)}</b>
              ${bs.length ? `<span class="mod-mats">${bs.map(b => `<span class="mod-mat ${cutFor(b) || ""}">${esc(b)}</span>`).join("")}</span>` : ""}</span>
            ${(m.qty || 1) > 1 ? `<span class="qty-pill">${m.done}/${m.qty}</span>` : ""}
            ${blocked.length ? `<span class="mod-wait" title="Not cut yet: ${esc(blocked.join(", "))}">${icon("clock", 12)}</span>` : ""}
          </label>`;
    }).join("")}
      </div>
    </div>`;
  },
  showAllHist: false,
  html(o) {
    var _D$member3, _D$portfolio;
    var st = D.orderStatus(o);
    var p = D.progress(o);
    var canEdit = App.can("orders.edit"); // due date, priority, notes, portfolio, files
    var canRoute = App.can("orders.route"); // add / move / remove steps
    var canMats = App.can("materials.use");
    var isEng = o.type === "eng";
    var due = fmtDue(o.due);
    var dueISO = new Date(o.due).toISOString().slice(0, 10);
    var shortages = D.orderShortages(o);
    var history = D.orderHistory(o.id);
    var shownHist = this.showAllHist ? history : history.slice(0, 6);
    var packed = D.packedSummary(o);
    return `
      <header>
        <div class="head-row">
          <span class="num">${esc(o.num)}</span>
          ${isEng ? `<span class="eng-badge">Engineering</span>` : ""}
          ${pillHtml(st, D.statusLabelFor(o, st))}
          ${prioHtml(o.priority)}
          <span class="grow"></span>
          ${D.projectLink(o) ? `<button class="icon-btn" id="od-od-quick" title="Open project files in OneDrive">${icon("cloud", 15)}</button>` : ""}
          <button class="btn subtle" id="od-sheet" title="Everything about this project on one screen">${icon("layers", 13)} Project sheet</button>
          ${canEdit ? `<button class="icon-btn" id="od-edit" title="Edit order details">${icon("pencil", 14)}</button>` : ""}
          <button class="icon-btn" data-close>${icon("x", 15)}</button>
        </div>
        <h1>${esc(o.product)}</h1>
        <div class="sub">${o.client && o.client !== o.product ? esc(o.client) + " · " : ""}${o.qty} ${esc(o.unit)} · created ${fmtDate(o.createdAt)}</div>
      </header>
      <div class="drawer-body">
        ${(() => {
      var link = D.projectLink(o);
      if (link) return `<button class="btn subtle project-link-btn" id="od-onedrive" title="${esc(link)}">
            ${icon("cloud-open", 16)} Open project files in OneDrive ${icon("external", 13)}
            ${D.projectLinkIsAuto(o) ? `<span class="auto-tag">auto</span>` : ""}
          </button>`;
      if (canEdit) return `<button class="btn ghost project-link-btn" id="od-onedrive-set">
            ${icon("link", 15)} Link OneDrive folder…
          </button>`;
      return "";
    })()}
        ${shortages.length ? `<div class="short-banner">${icon("trend-down", 14)} Material shortage: ${shortages.map(l => {
      var mat = D.material(l.materialId);
      return `${esc(mat.name)} (need ${l.qty}, have ${mat.qty} ${esc(mat.unit)})`;
    }).join(" · ")}</div>` : ""}

        ${isEng && o.clientApproved ? `<div class="approve-banner">
          ${icon("handshake", 15)} <span>Client approved the drawings — ${esc(((_D$member3 = D.member(o.clientApproved.by)) === null || _D$member3 === void 0 ? void 0 : _D$member3.name) || "manager")} confirmed ${fmtAgo(o.clientApproved.at)}</span>
          ${App.isManager() ? `<button class="mini-act" id="od-unapprove">Revoke</button>` : ""}
        </div>` : ""}
        ${isEng && !o.clientApproved && App.isManager() ? `<button class="btn green project-link-btn" id="od-approve">
          ${icon("handshake", 15)} Confirm client approved the drawings
        </button>` : ""}

        <div class="meta-grid">
          <div class="meta-box"><span class="t-label">Due date</span>
            ${canEdit ? `<input type="date" id="od-due" value="${dueISO}">` : `<span class="v due-chip ${due.cls}" style="font-size:13.5px">${due.label}</span>`}
          </div>
          <div class="meta-box"><span class="t-label">Priority</span>
            ${canEdit ? `<select id="od-prio">
              ${["rush", "high", "normal", "low"].map(x => `<option value="${x}" ${o.priority === x ? "selected" : ""}>${x === "rush" ? "🔥 Rush" : x[0].toUpperCase() + x.slice(1)}</option>`).join("")}
            </select>` : `<span class="v">${o.priority === "normal" ? "Normal" : prioHtml(o.priority)}</span>`}
          </div>
          <div class="meta-box"><span class="t-label">Progress</span><span class="v"><div class="progress ${p.pct === 100 ? "done" : ""}" style="width:80px"><i style="width:${p.pct}%"></i></div> ${p.done}/${p.total} tasks</span></div>
          <div class="meta-box"><span class="t-label">Time logged</span>
            <span class="v t-num">${fmtDur(o.ops.reduce((a, op) => a + D.opElapsed(op), 0))}</span>
            <span class="t-caption">${D.shift().auto ? "counted from scans, working hours only" : "working hours only"}</span></div>
          ${!isEng && o.qty > 1 ? `<div class="meta-box"><span class="t-label">${esc(packed.label)}</span><span class="v ${packed.done === packed.total ? "" : ""}" style="${packed.done === packed.total ? "color:var(--green)" : ""}">${packed.done} / ${packed.total} ${esc(o.unit)}</span></div>` : ""}
          <div class="meta-box"><span class="t-label">Portfolio</span>
            ${canEdit ? `<select id="od-portfolio">
              <option value="">None</option>
              ${Store.state.portfolios.map(pf => `<option value="${pf.id}" ${o.portfolioId === pf.id ? "selected" : ""}>${esc(pf.name)}</option>`).join("")}
            </select>` : `<span class="v">${o.portfolioId ? esc(((_D$portfolio = D.portfolio(o.portfolioId)) === null || _D$portfolio === void 0 ? void 0 : _D$portfolio.name) || "—") : "—"}</span>`}
          </div>
        </div>

        ${D.hasModules(o) ? this.modulesHtml(o) : ""}

        <div>
          <div class="t-label" style="margin-bottom:12px">${isEng ? "Stages" : "Routing — tasks per part group"}</div>
          ${(() => {
      var gaps = App.can("orders.route") ? D.swoodRouteGaps(o) : null;
      if (!gaps) return "";
      var n = gaps.add.reduce((k, a) => k + a.stations.length, 0) + (gaps.addFinal ? gaps.addFinal.length : 0);
      var names = [...new Set([...gaps.add.flatMap(a => a.stations.map(st => st.name)), ...(gaps.addFinal || []).map(st => st.name)])];
      return `<div class="route-gap">
              <span style="color:var(--orange)">${icon("alert", 17)}</span>
              <span class="grow"><b>This job stops after cutting</b>
                <span>It was imported before the shop's own stations were matched by name, so ${n} step${n > 1 ? "s were" : " was"} never created: ${esc(names.join(", "))}. Adding them keeps everything already done.</span></span>
              <button class="btn" id="od-fixroute">${icon("plus", 13)} Add the missing steps</button>
            </div>`;
    })()}
          ${(() => {
      /* The assembly line is counted in cabinets, so its quantity is the
         cabinet count — and that is the number people look at and want to
         correct. Make it the control rather than a read-only label. */
      var asm = D.assemblyOp(o);
      return o.items.map(item => {
        var groups = D.itemGroups(o, item.id);
        var fin = D.itemFinished(o, item.id);
        var multi = o.items.length > 1 || groups.length > 0;
        var art = item.articleId ? D.article(item.articleId) : null;
        var isAsm = asm && asm.itemId === item.id && App.can("orders.edit");
        return `<div class="item-block">
              ${multi || o.items.length > 1 ? `<div class="item-head">
                <b>${esc(item.name)}${art ? ` <span class="t-caption mono">${esc(art.sku)}</span>` : ""}</b>
                ${item.qty > 1 ? `<span class="fin ${fin.done === item.qty ? "all" : ""}">${fin.done}/${item.qty} ${esc(fin.label)}</span>` : ""}
                ${isAsm ? `<button class="qty-big qty-edit" id="od-asm-qty" title="How many cabinets is this really? Click to correct it">×${item.qty}</button>` : `<span class="qty-big">×${item.qty}</span>`}
              </div>` : ""}
              ${[...groups, null].map(g => {
          var lane = D.laneOps(o, item.id, g);
          if (!lane.length) return "";
          return `${groups.length ? `<div class="lane-label">${g ? esc(g) : `${icon("arrow-down", 11)} <span class="merge">Final — needs all part groups</span>`}</div>` : ""}
                <div class="route">
                  ${lane.map((op, i) => this.opHtml(o, op, i, lane.length, item)).join("")}
                </div>`;
        }).join("")}
            </div>`;
      }).join("");
    })()}
          ${canRoute ? `<button class="add-step-btn" id="od-add-step">＋ Add step</button>` : ""}
        </div>

        ${isEng ? this.remarksHtml(o) : ""}

        ${this.detailsHtml(o, canEdit)}

        <div>
          <div class="t-label" style="margin-bottom:10px">Materials</div>
          ${(o.materials || []).map(l => {
      var mat = D.material(l.materialId);
      if (!mat) return "";
      var short = D.lineShort(l);
      var by = D.member(l.consumedBy);
      return `<div class="mat-line ${short ? "short" : ""} ${l.consumed ? "used" : ""}">
              <span class="mat-ico" style="width:32px;height:32px">${matIcon(mat, 16)}</span>
              <span class="grow"><b>${esc(mat.name)}</b>
                <span>${l.qty} ${esc(mat.unit)} needed${l.consumed ? ` · ✓ used${by ? " by " + esc(by.name) : ""} ${l.consumedAt ? fmtAgo(l.consumedAt) : ""}` : short ? ` · only ${mat.qty} ${esc(mat.unit)} in stock` : ` · ${mat.qty} ${esc(mat.unit)} in stock`}</span></span>
              ${!l.consumed && canMats ? `<button class="btn subtle" data-consume="${l.id}">Use</button>` : ""}
              ${canMats && !l.consumed ? `<button class="mini-btn danger" data-line-del="${l.id}">✕</button>` : ""}
            </div>`;
    }).join("") || `<div class="t-caption" style="margin-bottom:8px">No materials linked yet</div>`}
          ${canMats ? `<div class="mat-add-row">
            <select class="select" id="od-mat-sel">
              <option value="">Add material…</option>
              ${Store.state.materials.map(m => `<option value="${m.id}">${esc(m.name)} (${m.qty} ${esc(m.unit)})</option>`).join("")}
            </select>
            <input class="input" id="od-mat-qty" type="number" min="0" step="any" placeholder="Qty">
            <button class="btn subtle" id="od-mat-add">Add</button>
          </div>` : ""}
        </div>

        ${o.notes || canEdit ? `<div class="field">
          <label>Notes</label>
          ${(() => {
      var fs = D.filesFor({
        orderId: o.id
      });
      return `<div class="od-files">
              ${fs.length ? Files.chipsHtml(fs, {
        canEdit
      }) : ""}
              ${canEdit ? Files.dropHtml("od-files-in", fs.length ? "Add another drawing" : "Add a drawing or photo") : ""}
            </div>`;
    })()}
          ${canEdit ? `<textarea class="input" id="od-notes" placeholder="Materials, hardware, client wishes…">${esc(o.notes)}</textarea>` : `<div class="meta-box" style="font-size:13.5px;line-height:1.5">${esc(o.notes) || "—"}</div>`}
        </div>` : ""}

        ${(o.parts || []).length ? `<div>
          <div class="t-label" style="margin-bottom:8px">Part list — ${o.parts.length} panels${o.swood ? ` · imported from SWOOD ${fmtAgo(o.swood.importedAt)}` : ""}</div>
          <div class="parts-table">
            <div class="parts-head"><span>Code</span><span>Part</span><span>Size</span><span>Material</span><span>Edges</span></div>
            <div class="parts-body">
              ${o.parts.slice(0, this.showAllParts ? o.parts.length : 12).map(p => `<div class="parts-row">
                <span class="mono">${esc(p.code)}</span>
                <span>${esc(p.name)}</span>
                <span class="mono">${p.l}×${p.w}${p.qty > 1 ? ` ×${p.qty}` : ""}</span>
                <span class="muted">${esc(p.board)}</span>
                <span class="muted">${(p.edges || []).filter(Boolean).length || "—"}</span>
              </div>`).join("")}
            </div>
          </div>
          ${o.parts.length > 12 && !this.showAllParts ? `<button class="btn ghost" id="od-parts-all" style="margin-top:6px;padding:5px 12px;font-size:12.5px">Show all ${o.parts.length} parts</button>` : ""}
        </div>` : ""}

        ${isEng ? "" : this.remarksHtml(o)}

        <div>
          <div class="t-label" style="margin-bottom:8px">History — every change, by whom</div>
          ${shownHist.map(a => {
      var m = D.member(a.who);
      return `<div class="activity-row" style="border:none;padding:5px 0">
              ${avatarHtml(m, "sm")}
              <span class="txt"><b>${esc(m ? m.name : "?")}</b> ${activityHtml(a.text)}</span>
              <span class="when">${fmtAgo(a.ts)}</span>
            </div>`;
    }).join("") || `<span class="t-caption">No history yet</span>`}
          ${history.length > 6 && !this.showAllHist ? `<button class="btn ghost" id="od-hist-all" style="margin-top:6px;padding:5px 12px;font-size:12.5px">Show all ${history.length} entries</button>` : ""}
        </div>

        ${App.can("orders.finish") || App.can("orders.copy") || App.can("orders.delete") ? `<div class="drawer-actions">
          ${isEng && !o.archived && App.can("orders.finish") ? `<button class="btn primary" id="od-handoff" style="flex:1">${icon("factory", 15)} Hand off to production</button>` : ""}
          ${st === "ready" && !o.archived && App.can("orders.finish") ? `<button class="btn green" id="od-ship" style="flex:1">${icon(isEng ? "check-circle" : "truck", 15)} ${isEng ? "Deliver & archive" : "Ship & archive"}</button>` : ""}
          ${App.can("orders.copy") ? `<button class="btn" id="od-copy">${icon("copy", 15)} Copy ${isEng ? "project" : "order"}</button>` : ""}
          ${!o.archived && App.can("orders.finish") ? `<button class="btn" id="od-archive">${icon("archive", 15)} End project → Archive</button>` : ""}
          ${o.archived && App.can("orders.finish") ? `<button class="btn subtle" id="od-restore">${icon("history", 15)} Restore from archive</button>` : ""}
          ${App.can("orders.delete") ? `<button class="btn danger" id="od-delete">Delete ${isEng ? "project" : "order"}</button>` : ""}
        </div>` : ""}
        ${o.handedOffTo && D.order(o.handedOffTo) ? `<button class="panel-row" style="border:1px solid var(--border);border-radius:var(--r-md)" data-open-order="${o.handedOffTo}"><span style="color:var(--text-2)">${icon("factory", 16)}</span><span class="grow"><b>Handed off to ${esc(D.order(o.handedOffTo).num)}</b><span>Open the manufacturing project</span></span>${icon("chev-right", 14)}</button>` : ""}
        ${o.fromEngId && D.order(o.fromEngId) ? `<button class="panel-row" style="border:1px solid var(--border);border-radius:var(--r-md)" data-open-order="${o.fromEngId}"><span style="color:var(--text-2)">${icon("compass", 16)}</span><span class="grow"><b>From engineering ${esc(D.order(o.fromEngId).num)}</b><span>Open the design project</span></span>${icon("chev-right", 14)}</button>` : ""}
      </div>`;
  },
  opHtml(o, op, i, laneLen, item) {
    var _D$member4;
    var st = D.station(op.stationId) || {
      name: "(removed station)",
      icon: "▫️"
    };
    var ready = D.opReady(o, op);
    var avail = D.opAvail(o, op);
    var canRoute = App.can("orders.route");
    var canAssign = App.can("orders.assign");
    var canAct = App.usesCockpit() || ready; // in the cockpit every task row offers its actions
    var assignee = D.member(op.assigneeId);
    var elapsed = D.opElapsed(op);
    var nodeIcon = op.status === "done" ? icon("check", 13) : op.status === "blocked" ? icon("x", 13) : stIcon(st, 13);
    var last = i === laneLen - 1;
    var lane = D.laneOps(o, op.itemId, op.group);
    var canMoveUp = canRoute && op.status !== "done" && i > 0 && lane[i - 1].status !== "done";
    var canMoveDown = canRoute && op.status !== "done" && !last && lane[i + 1].status !== "done";
    var showQty = item && item.qty > 1;
    var waiting = !ready && op.status === "queued";
    return `<div class="route-op">
      <div class="rail">
        <div class="node ${op.status}">${nodeIcon}</div>
        ${!last ? `<div class="line ${op.status === "done" ? "done" : ""}"></div>` : ""}
      </div>
      <div class="body">
        <div class="r1">
          <b>${esc(st.name)}</b>
          ${showQty ? `<span class="qty-pill ${op.status === "done" ? "full" : op.qtyDone > 0 ? "part" : waiting ? "waiting" : ""}">${op.qtyDone}/${item.qty}</span>` : ""}
          ${op.status === "running" ? `<span class="pill running"><span class="dot"></span><span data-timer="${o.id}/${op.id}" data-timer-style="clock">${fmtClock(elapsed)}</span></span>` : ""}
          ${op.status === "paused" ? pillHtml("paused") : ""}
          ${op.status === "blocked" ? pillHtml("blocked") : ""}
          ${canRoute && op.status !== "done" ? `<span class="route-edit-controls">
            <button class="mini-btn" data-op-move="${op.id}/-1" ${canMoveUp ? "" : "disabled"} title="Move up">↑</button>
            <button class="mini-btn" data-op-move="${op.id}/1" ${canMoveDown ? "" : "disabled"} title="Move down">↓</button>
            <button class="mini-btn danger" data-op-del="${op.id}" title="Remove step">✕</button>
          </span>` : ""}
        </div>
        <div class="r2">
          ${(() => {
      var crew = D.opAssignees(op);
      if (!canAssign) return crew.length ? `<span class="row" style="gap:5px">${crew.map(m => avatarHtml(m, "sm")).join("")} ${esc(crew.map(m => m.name).join(", "))}</span>` : `<span>Unassigned</span>`;
      /* two people carry a carcass; one name was never enough */
      return `<button class="assign-select crew-btn" data-crew="${op.id}">
              ${crew.length ? `<span class="avatar-stack">${crew.slice(0, 3).map(m => avatarHtml(m, "sm")).join("")}</span>
                <span>${esc(crew.map(m => m.name.split(" ")[0]).join(", "))}${crew.length > 3 ? ` +${crew.length - 3}` : ""}</span>` : `<span>Unassigned</span>`}
              ${icon("chev-down", 12)}
            </button>`;
    })()}
          <span>· est ${fmtDur(op.estMins * 60000)}</span>
          ${elapsed > 0 ? `<span>· logged <span class="t-num" ${op.status === "running" ? `data-timer="${o.id}/${op.id}" data-timer-style="dur"` : ""}>${fmtDur(elapsed)}</span></span>` : ""}
          ${op.status === "done" && op.completedAt ? `<span>· done ${fmtAgo(op.completedAt)}${op.completedBy ? " by " + esc(((_D$member4 = D.member(op.completedBy)) === null || _D$member4 === void 0 ? void 0 : _D$member4.name) || "?") : ""}</span>` : ""}
          ${waiting ? `<span class="avail-hint">· waiting for upstream</span>` : showQty && op.status !== "done" && avail < item.qty ? `<span class="avail-hint">· ${avail} available upstream</span>` : ""}
        </div>
        ${op.blockNote ? `<div class="r2" style="color:var(--red);font-weight:590">${icon("ban", 12)} ${esc(op.blockNote)}</div>` : ""}
        ${canAct && op.status !== "done" ? `<div class="ops-actions">
          ${op.status === "running" ? `<button class="btn" data-op-act="pause" data-op="${op.id}">${icon("pause", 12)} Pause</button>
               <button class="btn green" data-op-act="done" data-op="${op.id}">${icon("check", 12)} Complete</button>` : op.status === "blocked" ? `<button class="btn subtle" data-op-act="unblock" data-op="${op.id}">Unblock</button>` : `<button class="btn subtle" data-op-act="start" data-op="${op.id}" ${ready ? "" : "disabled"}>${icon("play", 11)} Start</button>
               ${elapsed > 0 || ready ? `<button class="btn green" data-op-act="done" data-op="${op.id}" ${ready ? "" : "disabled"}>${icon("check", 12)} Complete</button>` : ""}`}
          ${showQty && ready ? `<span class="qty-stepper" style="margin-left:auto">
            <button class="step-btn" data-op-qty="${op.id}/-1" ${op.qtyDone <= 0 ? "disabled" : ""} style="width:30px;height:30px;border-radius:9px;font-size:15px">−</button>
            <span class="qv" style="font-size:13px;min-width:44px">${op.qtyDone}<small>/${item.qty}</small></span>
            <button class="step-btn" data-op-qty="${op.id}/1" ${op.qtyDone >= avail ? "disabled" : ""} style="width:30px;height:30px;border-radius:9px;font-size:15px">＋</button>
          </span>` : ""}
          <button class="btn ghost" data-op-act="block" data-op="${op.id}">${op.status === "blocked" ? "Edit problem" : "Report problem"}</button>
        </div>` : ""}
        ${App.can("orders.route") && op.status === "done" ? `<div class="ops-actions"><button class="btn ghost" data-op-act="reopen" data-op="${op.id}">↩ Reopen</button></div>` : ""}
      </div>
    </div>`;
  },
  bind(el, o) {
    /* Only the drawer's own close buttons. These same panels are rendered into
       the project sheet, and claiming every [data-close] there re-pointed the
       modal's X and its Done button at Drawer.close() — so they shut the
       drawer behind the sheet and the sheet itself sat there, dead. */
    if (el.closest && el.closest("#drawer-root")) $$("[data-close]", el).forEach(b => b.onclick = () => Drawer.close());
    var inCockpit = App.usesCockpit(); // handlers below are all null-guarded:
    // a control the role can't use simply isn't rendered

    /* OneDrive project files */
    var openFiles = () => {
      var link = D.projectLink(o);
      if (link) {
        window.open(link, "_blank", "noopener");
        Toast.show("Opening project files in OneDrive…", {
          emoji: "cloud"
        });
      }
    };
    var odBtn = $("#od-onedrive", el);
    if (odBtn) odBtn.onclick = openFiles;
    var odQuick = $("#od-od-quick", el);
    if (odQuick) odQuick.onclick = openFiles;
    var odSet = $("#od-onedrive-set", el);
    if (odSet) odSet.onclick = () => this.linkDialog(o.id);
    $$("[data-op-act]", el).forEach(b => {
      b.onclick = e => {
        e.stopPropagation();
        var act = b.dataset.opAct,
          opId = b.dataset.op;
        if (act === "start") M.startOp(o.id, opId, App.me.id);
        if (act === "pause") M.pauseOp(o.id, opId, App.me.id);
        if (act === "done") {
          if (!App.tapGuard()) return; // reflex double-tap
          var op = o.ops.find(x => x.id === opId);
          var item = D.item(o, op.itemId);
          var next = M.completeOp(o.id, opId, App.me.id);
          if (op.status !== "done") {
            Toast.show(`Reported ${op.qtyDone} of ${item.qty} pcs — waiting for upstream`, {
              emoji: "⏳",
              ms: 4200
            });
          } else if (next) {
            Toast.show(`Step done → next: ${D.station(next.stationId).name}`, {
              emoji: "✅"
            });
          } else {
            Toast.show(o.ops.every(x => x.status === "done") ? `${o.num} is ready to ship!` : "Step done", {
              emoji: "🎉"
            });
          }
        }
        if (act === "unblock") M.unblockOp(o.id, opId, App.me.id);
        if (act === "reopen") M.reopenOp(o.id, opId, App.me.id);
        if (act === "block") {
          this.blockDialog(o.id, opId);
          return;
        }
        App.render();
      };
    });

    /* ticking a cabinet reports it — no second number to reconcile */
    $$("[data-mod]", el).forEach(c => c.onchange = () => {
      var m = D.module(o, c.dataset.mod);
      M.setModuleDone(o.id, c.dataset.mod, c.checked ? m.qty || 1 : 0, App.me.id);
      App.render();
      Drawer.refresh();
    });
    var modAll = $("#mod-all", el);
    if (modAll) modAll.onclick = () => {
      var _iterator8 = _createForOfIteratorHelper(D.orderModules(o)),
        _step8;
      try {
        for (_iterator8.s(); !(_step8 = _iterator8.n()).done;) {
          var m = _step8.value;
          M.setModuleDone(o.id, m.id, m.qty || 1, App.me.id);
        }
      } catch (err) {
        _iterator8.e(err);
      } finally {
        _iterator8.f();
      }
      App.render();
      Drawer.refresh();
    };
    var modNone = $("#mod-none", el);
    if (modNone) modNone.onclick = () => {
      var _iterator9 = _createForOfIteratorHelper(D.orderModules(o)),
        _step9;
      try {
        for (_iterator9.s(); !(_step9 = _iterator9.n()).done;) {
          var m = _step9.value;
          M.setModuleDone(o.id, m.id, 0, App.me.id);
        }
      } catch (err) {
        _iterator9.e(err);
      } finally {
        _iterator9.f();
      }
      App.render();
      Drawer.refresh();
    };
    /* ---- project details ---- */
    var dtAdd = $("#dt-add", el),
      dtNew = $("#dt-new", el);
    var addDetail = () => {
      var label = dtNew.value.trim();
      if (!label) {
        dtNew.focus();
        return;
      }
      var cat = ($("#dt-new-cat", el) || {}).value || "other";
      M.addDetail(o.id, {
        label,
        state: "need",
        cat
      }, App.me.id);
      App.render();
      Drawer.refresh();
      setTimeout(() => {
        var n = $("#dt-new");
        if (n) n.focus();
      }, 40);
    };
    if (dtAdd) dtAdd.onclick = addDetail;
    if (dtNew) dtNew.onkeydown = e => {
      if (e.key === "Enter") {
        e.preventDefault();
        addDetail();
      }
    };
    $$("[data-dt-cycle]", el).forEach(b => b.onclick = () => {
      var d = D.detail(o, b.dataset.dtCycle);
      if (!d) return;
      /* info stays where it is — it is a fact, not a thing being chased */
      var ring = d.state === "info" ? ["info", "need"] : ["need", "ordered", "here", "need"];
      var next = ring[Math.min(ring.indexOf(d.state) + 1, ring.length - 1)];
      var patch = {
        state: next
      };
      if (next === "ordered" && !d.due) patch.due = Date.now() + 7 * DAY; // a guess you can correct
      M.updateDetail(o.id, d.id, patch, App.me.id);
      App.render();
      Drawer.refresh();
    });
    var live = (sel, key) => $$(sel, el).forEach(inp => {
      inp.onchange = () => {
        var id = inp.dataset.dtLabel || inp.dataset.dtValue || inp.dataset.dtDue;
        var v = key === "due" ? inp.value ? new Date(inp.value + "T12:00").getTime() : null : inp.value;
        M.updateDetail(o.id, id, {
          [key]: v
        }, App.me.id);
      };
      inp.onkeydown = e => {
        if (e.key === "Enter") inp.blur();
      };
    });
    live("[data-dt-label]", "label");
    live("[data-dt-value]", "value");
    live("[data-dt-due]", "due");
    $$("[data-dt-cat]", el).forEach(sel => sel.onchange = () => {
      M.updateDetail(o.id, sel.dataset.dtCat, {
        cat: sel.value
      }, App.me.id);
      App.render();
      Drawer.refresh();
    });
    $$("[data-dt-del]", el).forEach(b => b.onclick = () => {
      M.removeDetail(o.id, b.dataset.dtDel, App.me.id);
      App.render();
      Drawer.refresh();
    });
    var modCount = $("#mod-count", el);
    if (modCount) modCount.onclick = () => this.moduleCountModal(o.id);
    var asmQty = $("#od-asm-qty", el);
    if (asmQty) asmQty.onclick = () => this.moduleCountModal(o.id);
    $$("[data-mod-name]", el).forEach(b => b.onclick = e => {
      e.preventDefault();
      e.stopPropagation(); // do not toggle the tick
      var m = D.module(o, b.dataset.modName);
      var next = prompt(I18N.t("What is this cabinet called?"), m.name);
      if (next === null) return;
      M.renameModule(o.id, m.id, next, App.me.id);
      App.render();
      Drawer.refresh();
    });

    /* picking a crew: a popover of tick boxes, because more than one person
       works a bench and a <select> can only ever say one name */
    $$("[data-crew]", el).forEach(btn => btn.onclick = () => {
      var opId = btn.dataset.crew;
      var op = o.ops.find(x => x.id === opId);
      var eligible = Store.state.members.filter(m => (o.type === "eng" ? m.role === "manager" || m.role === "engineer" : m.role === "worker" || m.role === "manager") || D.opAssignedTo(op, m.id));
      Popover.open(btn, `<div class="crew-pick">
        ${eligible.map(m => `<label class="crew-row">
          <input type="checkbox" data-crew-m="${m.id}" ${D.opAssignedTo(op, m.id) ? "checked" : ""}>
          ${avatarHtml(m, "sm")}<span class="grow">${esc(m.name)}</span>
          <span class="t-caption">${esc(m.trade || m.role)}</span>
        </label>`).join("")}
        <button class="crew-clear" data-crew-none>Nobody</button>
      </div>`, pop => {
        var apply = () => {
          var ids = $$("[data-crew-m]", pop).filter(c => c.checked).map(c => c.dataset.crewM);
          M.setOpAssignees(o.id, opId, ids, App.me.id);
          App.render();
          Drawer.refresh();
        };
        $$("[data-crew-m]", pop).forEach(c => c.onchange = apply);
        $("[data-crew-none]", pop).onclick = () => {
          M.setOpAssignees(o.id, opId, [], App.me.id);
          Popover.close();
          App.render();
          Drawer.refresh();
        };
      });
    });

    /* Piece reporting (+/− produced qty) */
    $$("[data-op-qty]", el).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var _b$dataset$opQty$spli = b.dataset.opQty.split("/"),
        _b$dataset$opQty$spli2 = _slicedToArray(_b$dataset$opQty$spli, 2),
        opId = _b$dataset$opQty$spli2[0],
        delta = _b$dataset$opQty$spli2[1];
      var op = o.ops.find(x => x.id === opId);
      var item = D.item(o, op.itemId);
      var before = op.qtyDone;
      M.reportQty(o.id, opId, op.qtyDone + parseInt(delta), App.me.id);
      if (op.status === "done" && before < item.qty) Toast.show(`${D.station(op.stationId).name} complete — all ${item.qty} pcs`, {
        emoji: "🎉"
      });
      App.render();
    });

    /* Routing editor */
    $$("[data-op-move]", el).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var _b$dataset$opMove$spl = b.dataset.opMove.split("/"),
        _b$dataset$opMove$spl2 = _slicedToArray(_b$dataset$opMove$spl, 2),
        opId = _b$dataset$opMove$spl2[0],
        dir = _b$dataset$opMove$spl2[1];
      if (M.moveOp(o.id, opId, parseInt(dir), App.me.id)) App.render();
    });
    $$("[data-op-del]", el).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var snap = Store.snapshot();
      if (M.removeOp(o.id, b.dataset.opDel, App.me.id)) {
        App.render();
        Toast.show("Step removed", {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      }
    });
    var addStep = $("#od-add-step", el);
    if (addStep) addStep.onclick = () => {
      var kind = o.type === "eng" ? "eng" : "prod";
      Popover.open(addStep, `
        <div class="opt-title">Add ${o.type === "eng" ? "stage" : "routing step"}</div>
        <div class="opt-row"><select class="select" id="as-station" style="flex:1">
          ${D.stationsOf(kind).map(st => `<option value="${st.id}">${esc(st.name)}</option>`).join("")}
        </select></div>
        ${o.items.length > 1 ? `<div class="opt-row"><select class="select" id="as-item" style="flex:1">
          ${o.items.map(it => `<option value="${it.id}">${esc(it.name)} ×${it.qty}</option>`).join("")}
        </select></div>` : ""}
        <div class="opt-row" id="as-group-row"></div>
        <div class="opt-row"><span class="grow" style="font-size:12.5px;color:var(--text-2)">Estimate</span>
          <input class="input" id="as-est" type="number" min="5" value="60" style="width:74px;text-align:right;padding:6px 9px"><span class="t-caption">min</span></div>
      <div class="opt-row"><button class="btn primary" id="as-add" style="flex:1">Add step</button></div>
      `, pop => {
        var sel = $("#as-station", pop);
        var itemSel = $("#as-item", pop);
        var groupRow = $("#as-group-row", pop);
        var renderGroups = () => {
          var itemId = itemSel ? itemSel.value : o.items[0].id;
          var groups = D.itemGroups(o, itemId);
          groupRow.innerHTML = groups.length ? `<select class="select" id="as-group" style="flex:1">
            ${groups.map(g => `<option value="${esc(g)}">${esc(g)} lane</option>`).join("")}
            <option value="">Final lane</option>
          </select>` : "";
        };
        renderGroups();
        if (itemSel) itemSel.onchange = renderGroups;
        sel.onchange = () => {
          var _D$station9;
          $("#as-est", pop).value = ((_D$station9 = D.station(sel.value)) === null || _D$station9 === void 0 ? void 0 : _D$station9.estMins) || 60;
        };
        sel.onchange();
        $("#as-add", pop).onclick = () => {
          var itemId = itemSel ? itemSel.value : o.items[0].id;
          var groupSel = $("#as-group", pop);
          var group = groupSel && groupSel.value ? groupSel.value : null;
          M.addOp(o.id, sel.value, parseInt($("#as-est", pop).value) || 60, App.me.id, itemId, group);
          Popover.close();
          App.render();
          Toast.show(`${D.station(sel.value).name} added to routing`, {
            emoji: "✦"
          });
        };
      });
    };

    /* Materials */
    $$("[data-consume]", el).forEach(b => b.onclick = () => {
      var line = o.materials.find(l => l.id === b.dataset.consume);
      var mat = D.material(line.materialId);
      var wasShort = D.lineShort(line);
      M.consumeLine(o.id, line.id, App.me.id);
      App.render();
      Toast.show(`Used ${line.qty} ${mat.unit} ${mat.name}`, {
        emoji: "📤"
      });
      var nm = D.material(mat.id);
      if (wasShort || nm.qty <= nm.minQty) Toast.show(`${mat.name}: ${nm.qty} ${mat.unit} left${nm.qty < 0 ? " — negative stock!" : " — low"}`, {
        emoji: "📉",
        ms: 4200
      });
    });
    $$("[data-line-del]", el).forEach(b => b.onclick = () => {
      if (M.removeOrderMaterial(o.id, b.dataset.lineDel, App.me.id)) App.render();
    });
    var matAdd = $("#od-mat-add", el);
    if (matAdd) matAdd.onclick = () => {
      var sel = $("#od-mat-sel", el),
        qty = parseFloat($("#od-mat-qty", el).value);
      if (!sel.value) {
        sel.focus();
        return;
      }
      if (!qty || qty <= 0) {
        $("#od-mat-qty", el).focus();
        return;
      }
      M.addOrderMaterial(o.id, sel.value, qty, App.me.id);
      App.render();
    };
    var partsAll = $("#od-parts-all", el);
    if (partsAll) partsAll.onclick = () => {
      this.showAllParts = true;
      Drawer.refresh();
    };

    /* History expand */
    var histAll = $("#od-hist-all", el);
    if (histAll) histAll.onclick = () => {
      this.showAllHist = true;
      Drawer.refresh();
    };

    /* Comments — anyone on the job can post; @mentions notify */
    var cIn = $("#od-c-input", el),
      cAdd = $("#od-c-add", el);
    if (cIn) {
      var post = () => {
        var text = cIn.value.trim();
        if (!text) return;
        var c = M.addOrderComment(o.id, text, App.me.id);
        cIn.value = "";
        Drawer.refresh();
        App.render();
        var named = ((c === null || c === void 0 ? void 0 : c.mentions) || []).filter(id => id !== App.me.id).map(id => {
          var _D$member5;
          return (_D$member5 = D.member(id)) === null || _D$member5 === void 0 ? void 0 : _D$member5.name;
        }).filter(Boolean);
        if (named.length) Toast.show(`${named.join(", ")} notified`, {
          emoji: "bell"
        });
        setTimeout(() => {
          var _$2;
          return (_$2 = $("#od-c-input")) === null || _$2 === void 0 ? void 0 : _$2.focus();
        }, 40);
      };
      Mentions.attach(cIn, post);
      if (cAdd) cAdd.onclick = post;
    }
    $$("[data-oc-del]", el).forEach(b => b.onclick = () => {
      M.deleteOrderComment(o.id, b.dataset.ocDel, App.me.id);
      Drawer.refresh();
    });
    if (inCockpit) {
      var sheetBtn = $("#od-sheet", el);
      if (sheetBtn) sheetBtn.onclick = () => this.sheetModal(o.id);
      var editBtn = $("#od-edit", el);
      if (editBtn) editBtn.onclick = () => this.editOrderModal(o.id);
      var due = $("#od-due", el);
      if (due) due.onchange = () => {
        M.updateOrderLogged(o.id, {
          due: new Date(due.value + "T12:00:00").getTime()
        }, App.me.id);
        App.render();
      };
      var prio = $("#od-prio", el);
      if (prio) prio.onchange = () => {
        M.updateOrderLogged(o.id, {
          priority: prio.value
        }, App.me.id);
        App.render();
      };
      /* attachments on the project — bind() is a different scope from the
         template, so the permission is read again here rather than borrowed */
      Files.bindChips(el, {
        onRemove: () => Drawer.refresh()
      });
      if (App.can("orders.edit")) Files.bindDrop(el, "od-files-in", /*#__PURE__*/function () {
        var _ref6 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6(picked) {
          var _iterator10, _step10, f;
          return _regeneratorRuntime().wrap(function _callee6$(_context6) {
            while (1) switch (_context6.prev = _context6.next) {
              case 0:
                _iterator10 = _createForOfIteratorHelper(picked);
                _context6.prev = 1;
                _iterator10.s();
              case 3:
                if ((_step10 = _iterator10.n()).done) {
                  _context6.next = 15;
                  break;
                }
                f = _step10.value;
                _context6.prev = 5;
                _context6.next = 8;
                return Files.attach(f, {
                  orderId: o.id
                }, App.me.id);
              case 8:
                _context6.next = 13;
                break;
              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](5);
                Toast.show(_context6.t0.message, {
                  emoji: "alert",
                  ms: 5000
                });
              case 13:
                _context6.next = 3;
                break;
              case 15:
                _context6.next = 20;
                break;
              case 17:
                _context6.prev = 17;
                _context6.t1 = _context6["catch"](1);
                _iterator10.e(_context6.t1);
              case 20:
                _context6.prev = 20;
                _iterator10.f();
                return _context6.finish(20);
              case 23:
                App.render();
                Drawer.refresh();
                Toast.show(`${picked.length} attached`, {
                  emoji: "check"
                });
              case 26:
              case "end":
                return _context6.stop();
            }
          }, _callee6, null, [[1, 17, 20, 23], [5, 10]]);
        }));
        return function (_x2) {
          return _ref6.apply(this, arguments);
        };
      }());
      var notes = $("#od-notes", el);
      if (notes) notes.onchange = () => {
        M.updateOrderLogged(o.id, {
          notes: notes.value
        }, App.me.id);
      };
      var pf = $("#od-portfolio", el);
      if (pf) pf.onchange = () => {
        M.updateOrderLogged(o.id, {
          portfolioId: pf.value || null
        }, App.me.id);
        App.render();
      };
      var ship = $("#od-ship", el);
      if (ship) ship.onclick = () => {
        M.shipOrder(o.id, App.me.id);
        Drawer.close();
        App.render();
        Toast.show(`${o.num} ${o.type === "eng" ? "delivered" : "shipped"} & archived`, {
          emoji: o.type === "eng" ? "check-circle" : "truck"
        });
      };
      var copyBtn = $("#od-copy", el);
      if (copyBtn) copyBtn.onclick = () => this.copyOrderModal(o.id);
      var fixRoute = $("#od-fixroute", el);
      if (fixRoute) fixRoute.onclick = () => {
        var snap = Store.snapshot();
        var n = M.repairSwoodRoute(o.id, App.me.id);
        App.render();
        Drawer.refresh();
        Toast.show(n ? `${n} step${n > 1 ? "s" : ""} added — nothing already done was touched` : "Nothing to add", {
          emoji: n ? "check" : "info",
          undo: n ? () => {
            Store.restore(snap);
            App.render();
            Drawer.refresh();
          } : null
        });
      };
      var archiveBtn = $("#od-archive", el);
      if (archiveBtn) archiveBtn.onclick = () => {
        var snap = Store.snapshot();
        M.archiveOrder(o.id, App.me.id);
        Drawer.close();
        App.render();
        Toast.show(`${o.num} archived`, {
          emoji: "archive",
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
      var restore = $("#od-restore", el);
      if (restore) restore.onclick = () => {
        M.unarchiveOrder(o.id, App.me.id);
        App.render();
        Drawer.refresh();
        Toast.show(`${o.num} restored`, {
          emoji: "history"
        });
      };
      var handoff = $("#od-handoff", el);
      if (handoff) handoff.onclick = () => this.handoffModal(o.id);
      var approve = $("#od-approve", el);
      if (approve) approve.onclick = () => {
        var engineers = M.confirmClientApproval(o.id, App.me.id);
        Drawer.refresh();
        App.render();
        Toast.show(engineers.length ? `Client approval confirmed — ${engineers.map(id => {
          var _D$member6;
          return (_D$member6 = D.member(id)) === null || _D$member6 === void 0 ? void 0 : _D$member6.name;
        }).filter(Boolean).join(", ")} notified` : "Client approval confirmed", {
          emoji: "handshake",
          ms: 4000
        });
      };
      var unapprove = $("#od-unapprove", el);
      if (unapprove) unapprove.onclick = () => {
        M.revokeClientApproval(o.id, App.me.id);
        Drawer.refresh();
        App.render();
      };
      $$("[data-open-order]", el).forEach(b => b.onclick = () => Drawer.open(b.dataset.openOrder));
      var del = $("#od-delete", el);
      if (del) del.onclick = () => {
        var snap = Store.snapshot();
        M.deleteOrder(o.id, App.me.id);
        Drawer.close();
        App.render();
        Toast.show(`${o.num} deleted`, {
          undo: () => {
            Store.restore(snap);
            App.render();
          }
        });
      };
    }
  },
  /* Copy a project — a fresh job from a proven one. The name must be free:
     two live projects with the same name is how the wrong one gets shipped. */
  copyOrderModal(orderId) {
    var o = D.order(orderId);
    var isEng = o.type === "eng";
    var suggested = D.uniqueName(o.product, n => D.projectNameTaken(n));
    Modal.open(`
      <header><h2>Copy ${isEng ? "project" : "order"}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="t-caption"><b>${esc(o.num)}</b></div>
        <div class="t-caption">Copies the product structure and the full route. Progress, logged time and comments start fresh.</div>
        <div class="field"><label>New name</label>
          <input class="input" id="cp-name" value="${esc(suggested)}" autocomplete="off">
          <span class="t-caption" id="cp-warn" style="color:var(--red);min-height:15px"></span>
        </div>
        <label class="check-row"><input type="checkbox" id="cp-mats" checked> Copy the material list (nothing consumed yet)</label>
        <label class="check-row"><input type="checkbox" id="cp-assign"> Keep the same people assigned to each step</label>
      </div>
      <footer><button class="btn" data-close>Cancel</button>
        <button class="btn primary" id="cp-go">${icon("copy", 14)} Create copy</button></footer>`, m => {
      var name = $("#cp-name", m),
        warn = $("#cp-warn", m),
        go = $("#cp-go", m);
      var check = () => {
        var v = name.value.trim();
        var bad = !v ? "Give the copy a name" : D.projectNameTaken(v) ? "That name is already used by another project" : "";
        warn.textContent = bad;
        go.disabled = !!bad;
        return !bad;
      };
      name.oninput = check;
      check();
      name.onkeydown = e => {
        if (e.key === "Enter") go.click();
      };
      go.onclick = () => {
        if (!check()) return;
        var copy = M.duplicateOrder(o.id, {
          name: name.value.trim(),
          copyMaterials: $("#cp-mats", m).checked,
          copyAssignees: $("#cp-assign", m).checked
        }, App.me.id);
        Modal.close();
        App.render();
        Drawer.open(copy.id);
        Toast.show(`${copy.num} created from ${o.num}`, {
          emoji: "copy"
        });
      };
    });
  },
  editOrderModal(orderId) {
    var o = D.order(orderId);
    Modal.open(`
      <header><h2>Edit order</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="field"><label>Product / job</label><input class="input" id="eo-product" value="${esc(o.product)}"></div>
        <div class="field"><label>Client</label>
          <input class="input" id="eo-client" value="${esc(o.client)}" list="shared-customers" autocomplete="off">
          ${typeof Bridge !== "undefined" ? Bridge.datalistHtml() : ""}</div>
        <div class="form-row">
          <div class="field"><label>Quantity</label>
            <input class="input" id="eo-qty" type="number" min="1" value="${o.qty}" ${o.swood ? "disabled" : ""}>
            ${o.swood ? `<span class="t-caption">Comes from the SWOOD part list — change it by re-importing.</span>` : o.items.length > 1 ? `<span class="t-caption">Spread across ${o.items.length} lines, in proportion.</span>` : ""}</div>
          <div class="field"><label>Unit</label><input class="input" id="eo-unit" value="${esc(o.unit)}"></div>
        </div>
        <div class="field"><label>OneDrive folder link ${D.projectLinkIsAuto(o) ? `<span class="t-caption">— leave blank to use the auto link</span>` : ""}</label>
          <input class="input" id="eo-onedrive" value="${esc(o.oneDriveUrl || "")}" placeholder="${esc(D.projectLink(o) || "https://onedrive.live.com/…")}">
          ${D.projectLinkIsAuto(o) ? `<span class="t-caption">Auto: ${esc(D.projectLink(o))}</span>` : ""}
        </div>
        <div class="t-caption">Every change is recorded in the order history with your name.</div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="eo-save">Save changes</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      $("#eo-save", modal).onclick = () => {
        var n = M.updateOrderLogged(o.id, {
          product: $("#eo-product", modal).value.trim() || o.product,
          client: $("#eo-client", modal).value.trim() || o.client,
          // a name a person actually submitted may create the shared record
          customerId: typeof Bridge !== "undefined" && Bridge.resolveClient($("#eo-client", modal).value.trim() || o.client) || o.customerId || null,
          unit: $("#eo-unit", modal).value.trim() || o.unit,
          oneDriveUrl: $("#eo-onedrive", modal).value.trim()
        }, App.me.id);
        /* quantity is not a field on the order — it is the sum of the items,
           and every task counts against those, so it goes through its own
           mutation rather than being assigned over the top */
        var qEl = $("#eo-qty", modal);
        var q = qEl.disabled ? null : M.setOrderQty(o.id, qEl.valueAsNumber, App.me.id);
        Modal.close();
        App.render();
        Drawer.refresh();
        Toast.show(q ? `Now making ${q.qty} ${esc(o.unit || "pcs")}${q.reopened ? ` — ${q.reopened} task${q.reopened > 1 ? "s" : ""} reopened, there is more to make` : ""}` : n ? "Order updated — logged in history" : "No changes", {
          emoji: q || n ? "✓" : "•",
          ms: q && q.reopened ? 5200 : 3200
        });
      };
    });
  },
  handoffModal(engId) {
    var eng = D.order(engId);
    Modal.open(`
      <header><h2>Hand off to production</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="t-caption">Creates a manufacturing project from <b>${esc(eng.num)} · ${esc(eng.product)}</b> and archives the design project. Client, portfolio and files carry over.</div>
        <div class="field"><label>Manufacturing routing — production steps this job goes through</label>
          <div class="route-picker">
            ${D.stationsOf("prod").map(st => `
              <div class="route-pick on" data-st="${st.id}">
                <span class="chk">✓</span>
                <span class="ico" style="color:var(--text-2)">${stIcon(st, 16)}</span><b>${esc(st.name)}</b>
                <input type="number" min="5" value="${st.estMins}" data-est onclick="event.stopPropagation()"><span class="unit">min</span>
              </div>`).join("")}
          </div>
        </div>
        <div class="t-caption">Tip: set the part count later (or via a scanned import) so progress is exact.</div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="ho-create">${icon("factory", 14)} Create manufacturing project</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      $$(".route-pick", modal).forEach(rp => {
        rp.onclick = () => rp.classList.toggle("on");
      });
      $("#ho-create", modal).onclick = () => {
        var route = $$(".route-pick.on", modal).map(rp => ({
          stationId: rp.dataset.st,
          estMins: parseInt($("[data-est]", rp).value) || 60
        }));
        if (!route.length) {
          Toast.show("Pick at least one station", {
            emoji: "alert"
          });
          return;
        }
        var prod = M.handoffToProduction(engId, {
          route
        }, App.me.id);
        Modal.close();
        Drawer.open(prod.id);
        App.render();
        Toast.show(`${prod.num} created from ${eng.num}`, {
          emoji: "factory",
          ms: 4000
        });
      };
    });
  },
  linkDialog(orderId) {
    var _Store$state$oneDrive;
    var o = D.order(orderId);
    var base = (_Store$state$oneDrive = Store.state.oneDrive) === null || _Store$state$oneDrive === void 0 ? void 0 : _Store$state$oneDrive.baseUrl;
    Modal.open(`
      <header><h2>Link project files</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="field"><label>OneDrive / SharePoint folder for ${esc(o.num)}</label>
          <input class="input" id="ld-url" placeholder="https://onedrive.live.com/…" value="${esc(o.oneDriveUrl || "")}">
        </div>
        ${base ? `<div class="t-caption">Tip: set a base folder in Settings and projects auto-link by code — no need to paste each one.</div>` : `<div class="t-caption">Paste this project's folder link, or set a base folder in Settings to auto-link every project by its code.</div>`}
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="ld-save">Save link</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var save = () => {
        M.updateOrderLogged(o.id, {
          oneDriveUrl: $("#ld-url", modal).value.trim()
        }, App.me.id);
        Modal.close();
        Drawer.refresh();
        Toast.show("Project files linked", {
          emoji: "cloud"
        });
      };
      $("#ld-save", modal).onclick = save;
      $("#ld-url", modal).onkeydown = e => {
        if (e.key === "Enter") save();
      };
    });
  },
  /* Opened from the card and from the step inside a project. If the step is
     already blocked it edits that note rather than making a second one, and
     offers the way out — "fixed" is as important to record as "stuck". */
  blockDialog(orderId, opId) {
    var o = D.order(orderId);
    var op = o && o.ops.find(x => x.id === opId);
    if (!op) return;
    var was = op.status === "blocked";
    var st = D.station(op.stationId);
    Modal.open(`
      <header><h2>${was ? "This step is blocked" : "Report a problem"}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="t-caption" style="margin-bottom:10px">${esc(o.product || o.num)}${st ? ` · ${esc(st.name)}` : ""}</div>
        <div class="field"><label>What's blocking this step?</label>
          <input class="input" id="block-note" value="${esc(was ? op.blockNote || "" : "")}"
            placeholder="e.g. Reik pakeisti 4 lankstus / neužsidaro durys"></div>
        <div class="t-caption" style="margin-top:8px">It shows on the card, on the project, and in Needs attention until it is cleared.</div>
      </div>
      <footer>
        ${was ? `<button class="btn" id="block-clear">${icon("check", 13)} Problem solved</button>` : ""}
        <div class="grow"></div>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn danger" id="block-save">${icon("ban", 13)} ${was ? "Save" : "Mark blocked"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var save = () => {
        var note = $("#block-note", modal).value.trim() || "Blocked";
        M.blockOp(orderId, opId, App.me.id, note);
        Modal.close();
        App.render();
        Drawer.refresh();
        Toast.show(was ? "Problem updated" : "Marked blocked — managers can see it", {
          emoji: "ban"
        });
      };
      $("#block-save", modal).onclick = save;
      var input = $("#block-note", modal);
      input.onkeydown = e => {
        if (e.key === "Enter") save();
      };
      setTimeout(() => input.focus(), 60);
      var clear = $("#block-clear", modal);
      if (clear) clear.onclick = () => {
        M.unblockOp(orderId, opId, App.me.id);
        Modal.close();
        App.render();
        Drawer.refresh();
        Toast.show("Unblocked — back in the queue", {
          emoji: "check"
        });
      };
    });
  }
};

/* ============================================================
   New order modal — Standard articles / Custom job / Engineering
   ============================================================ */
var NewOrder = {
  mode: "articles",
  // articles | custom | eng
  draft: {},
  // survives mode switches so typed fields aren't lost

  _pending: null,
  // files chosen before the project exists

  open() {
    this.mode = App.isEngineer() ? "eng" : Store.state.articles.length ? "articles" : "custom";
    this.draft = {};
    this._pending = [];
    this.render();
  },
  captureDraft(modal) {
    var _v, _v2, _v3, _v4, _v5, _v6;
    var v = sel => {
      var el = $(sel, modal);
      return el ? el.value : undefined;
    };
    this.draft = {
      product: (_v = v("#no-product")) !== null && _v !== void 0 ? _v : this.draft.product,
      client: (_v2 = v("#no-client")) !== null && _v2 !== void 0 ? _v2 : this.draft.client,
      portfolio: (_v3 = v("#no-portfolio")) !== null && _v3 !== void 0 ? _v3 : this.draft.portfolio,
      due: (_v4 = v("#no-due")) !== null && _v4 !== void 0 ? _v4 : this.draft.due,
      prio: (_v5 = v("#no-prio")) !== null && _v5 !== void 0 ? _v5 : this.draft.prio,
      notes: (_v6 = v("#no-notes")) !== null && _v6 !== void 0 ? _v6 : this.draft.notes
    };
  },
  render() {
    var _this2 = this;
    var s = Store.state;
    var d = this.draft;
    var defaultDue = d.due || new Date(Date.now() + 14 * DAY).toISOString().slice(0, 10);
    var mode = this.mode;
    var isEng = mode === "eng";
    Modal.open(`
      <header><h2>${isEng ? "New engineering project" : "New order"}</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        ${App.isEngineer() ? "" : `<div class="segmented" style="align-self:flex-start">
          <button data-mode="articles" class="${mode === "articles" ? "active" : ""}">${icon("box", 13)} Standard articles</button>
          <button data-mode="custom" class="${mode === "custom" ? "active" : ""}">${icon("toolbox", 13)} Custom job</button>
          <button data-mode="eng" class="${mode === "eng" ? "active" : ""}">${icon("pencil", 13)} Engineering</button>
        </div>`}

        <div class="field"><label>${isEng ? "Project name" : "Product / job"}</label>
          <input class="input" id="no-product" value="${esc(d.product || "")}" placeholder="${isEng ? "e.g. Bar counter — drawings & CNC programs" : "e.g. Oak kitchen — Client St. 5"}"></div>
        <div class="form-row">
          <div class="field"><label>Client</label>
            <input class="input" id="no-client" value="${esc(d.client || "")}" placeholder="Client name" list="shared-customers" autocomplete="off">
            ${typeof Bridge !== "undefined" ? Bridge.datalistHtml() : ""}</div>
          <div class="field"><label>Portfolio</label>
            <select class="select" id="no-portfolio">
              <option value="">None</option>
              ${s.portfolios.map(p => `<option value="${p.id}" ${d.portfolio === p.id ? "selected" : ""}>${p.icon} ${esc(p.name)}</option>`).join("")}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="field"><label>Due date</label><input class="input" id="no-due" type="date" value="${defaultDue}"></div>
          <div class="field"><label>Priority</label>
            <select class="select" id="no-prio">
              ${[["normal", "Normal"], ["high", "High"], ["rush", "🔥 Rush"], ["low", "Low"]].map(([v, l]) => `<option value="${v}" ${d.prio === v ? "selected" : ""}>${l}</option>`).join("")}
            </select>
          </div>
        </div>

        ${mode === "articles" ? `
        <div class="field"><label>Articles & quantities — routing tasks are created automatically per part group</label>
          <div id="no-lines">
            <div class="mat-add-row no-line" style="margin-bottom:7px">
              <select class="select" data-line-art>
                ${s.articles.map(a => `<option value="${a.id}">${esc(a.name)} (${esc(a.sku)})</option>`).join("")}
              </select>
              <input class="input" data-line-qty type="number" min="1" value="1">
              <button class="mini-btn danger" data-line-del style="visibility:hidden">✕</button>
            </div>
          </div>
          <button class="add-inline" id="no-add-line" style="align-self:flex-start">+ Add another article</button>
          <div class="t-caption" id="no-task-preview" style="margin-top:6px"></div>
        </div>` : ""}

        ${mode === "custom" ? `
        <div class="form-row">
          <div class="field"><label>Quantity</label><input class="input" id="no-qty" type="number" min="1" value="1"></div>
          <div class="field"><label>Unit</label><input class="input" id="no-unit" value="units"></div>
        </div>
        <div class="field"><label>Routing — which stations does this job go through?</label>
          <div class="route-picker">
            ${D.stationsOf("prod").map(st => `
              <div class="route-pick on" data-st="${st.id}">
                <span class="chk">✓</span>
                <span class="ico" style="color:var(--text-2)">${stIcon(st, 16)}</span><b>${esc(st.name)}</b>
                <input type="number" min="5" value="${st.estMins}" data-est onclick="event.stopPropagation()"><span class="unit">min</span>
              </div>`).join("")}
          </div>
        </div>` : ""}

        ${isEng ? `
        <div class="field"><label>Stages</label>
          <div class="route-picker">
            ${D.stationsOf("eng").map(st => `
              <div class="route-pick on" data-st="${st.id}">
                <span class="chk">✓</span>
                <span class="ico" style="color:var(--text-2)">${stIcon(st, 16)}</span><b>${esc(st.name)}</b>
                <input type="number" min="5" value="${st.estMins}" data-est onclick="event.stopPropagation()"><span class="unit">min</span>
              </div>`).join("")}
          </div>
        </div>` : ""}

        <div class="field"><label>Notes (optional)</label><textarea class="input" id="no-notes" placeholder="${isEng ? "Scope, references, links…" : "Materials, hardware, finishes…"}">${esc(d.notes || "")}</textarea></div>
        <div class="field"><label>Drawings &amp; photos</label>
          ${Files.dropHtml("no-files")}
          <div id="no-files-list">${this._pending && this._pending.length ? `<div class="file-chips">${this._pending.map((f, i) => `<button class="file-chip img" type="button" data-pend-rm="${i}">
                ${f.preview ? `<img src="${f.preview}" alt="">` : `<span class="ico">${icon("box", 18)}</span>`}
                <span class="nm">${esc(f.file.name)}</span><span class="rm">${icon("x", 11)}</span></button>`).join("")}</div>` : ""}</div></div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary lg" id="no-create">${isEng ? "Create project" : "Create order"}</button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      $$("[data-mode]", modal).forEach(b => b.onclick = () => {
        this.captureDraft(modal); // keep what's typed when switching modes
        this.mode = b.dataset.mode;
        this.render();
      });
      $$(".route-pick", modal).forEach(rp => {
        rp.onclick = () => rp.classList.toggle("on");
      });

      /* article lines */
      var linesEl = $("#no-lines", modal);
      var preview = () => {
        var pv = $("#no-task-preview", modal);
        if (!pv) return;
        var tasks = 0,
          pcs = 0;
        $$(".no-line", modal).forEach(row => {
          var art = D.article($("[data-line-art]", row).value);
          var q = parseInt($("[data-line-qty]", row).value) || 0;
          if (art && q > 0) {
            tasks += art.lanes.reduce((n, l) => n + l.route.length, 0);
            pcs += q;
          }
        });
        pv.textContent = tasks ? `Will create ${tasks} tasks across part groups for ${pcs} pcs — e.g. Cutting runs separately for facades and carcass.` : "";
      };
      if (linesEl) {
        var bindLine = row => {
          $("[data-line-art]", row).onchange = preview;
          $("[data-line-qty]", row).oninput = preview;
          $("[data-line-del]", row).onclick = () => {
            row.remove();
            preview();
          };
        };
        $$(".no-line", linesEl).forEach(bindLine);
        $("#no-add-line", modal).onclick = () => {
          var row = $(".no-line", linesEl).cloneNode(true);
          $("[data-line-qty]", row).value = 1;
          $("[data-line-del]", row).style.visibility = "visible";
          linesEl.appendChild(row);
          bindLine(row);
          preview();
        };
        preview();
      }

      /* A project has no id until it is created, so the files wait here with a
         preview the person can check and remove before committing. */
      Files.bindDrop(modal, "no-files", /*#__PURE__*/function () {
        var _ref7 = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7(picked) {
          var _iterator11, _step11, file, _preview;
          return _regeneratorRuntime().wrap(function _callee7$(_context7) {
            while (1) switch (_context7.prev = _context7.next) {
              case 0:
                _this2._pending = _this2._pending || [];
                _iterator11 = _createForOfIteratorHelper(picked);
                _context7.prev = 2;
                _iterator11.s();
              case 4:
                if ((_step11 = _iterator11.n()).done) {
                  _context7.next = 17;
                  break;
                }
                file = _step11.value;
                if (!Files.isImage(file.type)) {
                  _context7.next = 12;
                  break;
                }
                _context7.next = 9;
                return Files._draw(file, 220, 0.7).then(r => r.dataUrl).catch(() => "");
              case 9:
                _context7.t0 = _context7.sent;
                _context7.next = 13;
                break;
              case 12:
                _context7.t0 = "";
              case 13:
                _preview = _context7.t0;
                _this2._pending.push({
                  file,
                  preview: _preview
                });
              case 15:
                _context7.next = 4;
                break;
              case 17:
                _context7.next = 22;
                break;
              case 19:
                _context7.prev = 19;
                _context7.t1 = _context7["catch"](2);
                _iterator11.e(_context7.t1);
              case 22:
                _context7.prev = 22;
                _iterator11.f();
                return _context7.finish(22);
              case 25:
                _this2.captureDraft(modal);
                _this2.render(); // re-render with the previews
              case 27:
              case "end":
                return _context7.stop();
            }
          }, _callee7, null, [[2, 19, 22, 25]]);
        }));
        return function (_x3) {
          return _ref7.apply(this, arguments);
        };
      }());
      $$("[data-pend-rm]", modal).forEach(b => b.onclick = () => {
        this._pending.splice(+b.dataset.pendRm, 1);
        this.captureDraft(modal);
        this.render();
      });
      $("#no-create", modal).onclick = () => {
        var mode2 = this.mode;
        var client = $("#no-client", modal).value.trim();
        var product = $("#no-product", modal).value.trim();
        if (!client) {
          $("#no-client", modal).focus();
          return;
        }
        var base = {
          client,
          priority: $("#no-prio", modal).value,
          due: new Date($("#no-due", modal).value + "T12:00:00").getTime(),
          notes: $("#no-notes", modal).value.trim(),
          portfolioId: $("#no-portfolio", modal).value || null
        };
        var order;
        if (mode2 === "articles") {
          var lines = $$(".no-line", modal).map(row => ({
            articleId: $("[data-line-art]", row).value,
            qty: parseInt($("[data-line-qty]", row).value) || 1
          })).filter(l => l.qty > 0 && l.articleId && D.article(l.articleId));
          if (!lines.length) {
            Toast.show(Store.state.articles.length ? "Add at least one article" : "No articles yet — define them in Warehouse → Articles, or use Custom job", {
              emoji: "⚠️",
              ms: 4500
            });
            return;
          }
          if (!product) product = lines.map(l => `${D.article(l.articleId).name} ×${l.qty}`).join(", ");
          order = M.createOrder(_objectSpread({
            type: "prod",
            product,
            unit: "pcs",
            lines
          }, base), App.me.id);
        } else if (mode2 === "eng") {
          if (!product) {
            $("#no-product", modal).focus();
            return;
          }
          var stages = $$(".route-pick.on", modal).map(rp => rp.dataset.st);
          if (!stages.length) {
            Toast.show("Pick at least one stage", {
              emoji: "⚠️"
            });
            return;
          }
          order = M.createOrder(_objectSpread({
            type: "eng",
            product,
            stages
          }, base), App.me.id);
        } else {
          if (!product) {
            $("#no-product", modal).focus();
            return;
          }
          var route = $$(".route-pick.on", modal).map(rp => ({
            stationId: rp.dataset.st,
            estMins: parseInt($("[data-est]", rp).value) || 60
          }));
          if (!route.length) {
            Toast.show("Pick at least one station", {
              emoji: "⚠️"
            });
            return;
          }
          order = M.createOrder(_objectSpread({
            type: "prod",
            product,
            qty: parseInt($("#no-qty", modal).value) || 1,
            unit: $("#no-unit", modal).value.trim() || "units",
            route
          }, base), App.me.id);
        }
        // a client name someone actually submitted may create the shared record
        if (typeof Bridge !== "undefined") {
          var cid = Bridge.resolveClient(client);
          if (cid) {
            order.customerId = cid;
            Store.save();
          }
        }
        var waiting = this._pending || [];
        this._pending = [];
        Modal.close();
        App.render();
        Toast.show(`${order.num} created — ${order.ops.length} tasks`, {
          emoji: "🎉"
        });
        Drawer.open(order.id);
        if (waiting.length) _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8() {
          var _iterator12, _step12, p;
          return _regeneratorRuntime().wrap(function _callee8$(_context8) {
            while (1) switch (_context8.prev = _context8.next) {
              case 0:
                _iterator12 = _createForOfIteratorHelper(waiting);
                _context8.prev = 1;
                _iterator12.s();
              case 3:
                if ((_step12 = _iterator12.n()).done) {
                  _context8.next = 15;
                  break;
                }
                p = _step12.value;
                _context8.prev = 5;
                _context8.next = 8;
                return Files.attach(p.file, {
                  orderId: order.id
                }, App.me.id);
              case 8:
                _context8.next = 13;
                break;
              case 10:
                _context8.prev = 10;
                _context8.t0 = _context8["catch"](5);
                Toast.show(_context8.t0.message, {
                  emoji: "alert",
                  ms: 5000
                });
              case 13:
                _context8.next = 3;
                break;
              case 15:
                _context8.next = 20;
                break;
              case 17:
                _context8.prev = 17;
                _context8.t1 = _context8["catch"](1);
                _iterator12.e(_context8.t1);
              case 20:
                _context8.prev = 20;
                _iterator12.f();
                return _context8.finish(20);
              case 23:
                App.render();
                Drawer.refresh();
                Toast.show(`${waiting.length} file${waiting.length > 1 ? "s" : ""} attached to ${order.num}`, {
                  emoji: "check"
                });
              case 26:
              case "end":
                return _context8.stop();
            }
          }, _callee8, null, [[1, 17, 20, 23], [5, 10]]);
        }))();
      };
    });
  }
};