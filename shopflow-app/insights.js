/* ============================================================
   insights.js — an outside opinion on the shop's own numbers

   Reports says what happened. This says what to do about it: what is
   genuinely working, what is costing money, and the order to fix it in.

   The shop's briefing goes to a Supabase Edge Function which holds the
   Anthropic key; no key ever reaches a browser, because ShopFlow runs on
   shared tablets and a key in localStorage is a key anyone at the machine can
   read. Without the function deployed the briefing is still shown in full —
   you can see exactly what would be sent before anything is.
   ============================================================ */
"use strict";

function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(typeof e + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
var Insights = {
  FN: "ai-insights",
  DAYS: 90,
  busy: false,
  error: "",
  showBriefing: false,
  held() {
    return Store.state.insights || null;
  },
  briefing() {
    return D.briefing({
      days: this.DAYS
    });
  },
  /* The function is reachable only when the shop is signed in to the cloud —
     it spends real money, so the shop login is the gate. */
  available() {
    return typeof Sync !== "undefined" && Sync.configured() && !!Sync.client && !App._localOnly;
  },
  run() {
    var _this = this;
    return _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
      var _yield$Sync$client$au, session, briefing, res, body;
      return _regeneratorRuntime().wrap(function _callee$(_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            if (!_this.busy) {
              _context.next = 2;
              break;
            }
            return _context.abrupt("return");
          case 2:
            _this.busy = true;
            _this.error = "";
            App.render();
            _context.prev = 5;
            _context.next = 8;
            return Sync.client.auth.getSession();
          case 8:
            _yield$Sync$client$au = _context.sent;
            session = _yield$Sync$client$au.data.session;
            if (session) {
              _context.next = 12;
              break;
            }
            throw new Error("Sign in to the shop workspace first.");
          case 12:
            briefing = _this.briefing();
            _context.next = 15;
            return fetch(`${SYNC_CONFIG.url}/functions/v1/${_this.FN}`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                apikey: SYNC_CONFIG.anonKey,
                Authorization: `Bearer ${session.access_token}`
              },
              body: JSON.stringify({
                briefing
              })
            });
          case 15:
            res = _context.sent;
            _context.next = 18;
            return res.json().catch(() => ({}));
          case 18:
            body = _context.sent;
            if (!(!res.ok || !body.ok)) {
              _context.next = 21;
              break;
            }
            throw new Error(body.detail ? `${body.error || "Request failed"} — ${String(body.detail).slice(0, 180)}` : body.error || `Request failed (${res.status})`);
          case 21:
            M.saveInsight(body.insight, {
              model: body.model,
              usage: body.usage,
              days: _this.DAYS,
              finished: briefing.delivery.finishedInPeriod
            }, App.me.id);
            Toast.show("Assessment ready", {
              emoji: "sparkles"
            });
            _context.next = 28;
            break;
          case 25:
            _context.prev = 25;
            _context.t0 = _context["catch"](5);
            _this.error = _context.t0 && _context.t0.message || String(_context.t0);
          case 28:
            _context.prev = 28;
            _this.busy = false;
            App.render();
            return _context.finish(28);
          case 32:
          case "end":
            return _context.stop();
        }
      }, _callee, null, [[5, 25, 28, 32]]);
    }))();
  },
  /* ---------- view ---------- */
  view() {
    var held = this.held();
    var b = this.briefing();
    var canRun = this.available() && App.can("reports.view");
    return `<div class="panel ins-panel">
      <header>
        <h2>${icon("brain", 15)} Assessment</h2>
        <span class="t-caption">${held ? `from ${fmtDate(held.at)} · last ${held.meta.days} days` : "an experienced read of the numbers below"}</span>
        <div class="grow"></div>
        ${canRun ? `<button class="btn ${held ? "" : "primary"}" id="ins-run" ${this.busy ? "disabled" : ""}>
          ${this.busy ? `<span class="sync-spinner"></span> Reading the numbers…` : `${icon("sparkles", 13)} ${held ? "Look again" : "Get an assessment"}`}
        </button>` : ""}
      </header>
      <div class="panel-pad">
        ${this.error ? `<div class="ins-error">${icon("alert", 16)}<span>${esc(this.error)}</span></div>` : ""}
        ${!canRun ? `<div class="ins-setup">${icon("cloud-off", 17)}
          <span class="grow"><b>Not connected</b>
            <span>${this.available() ? "You need permission to see Reports." : "Sign in to the shop workspace, and deploy the ai-insights function, and an assessment can be requested here. The briefing below is what it would be given."}</span></span>
        </div>` : ""}
        ${held ? this.resultHtml(held) : ""}
        ${this.briefingHtml(b, held)}
      </div>
    </div>`;
  },
  resultHtml(held) {
    var r = held.insight || {};
    var conf = {
      high: "",
      medium: "warn",
      low: "bad"
    }[r.confidence] || "";
    var sev = s => ({
      high: "bad",
      medium: "warn",
      low: ""
    })[s] || "";
    var list = arr => Array.isArray(arr) ? arr : [];
    return `
      <div class="ins-headline">
        <b>${esc(r.headline || "")}</b>
        ${r.confidence ? `<span class="pill ${conf === "bad" ? "blocked" : conf === "warn" ? "paused" : "done"}">${esc(r.confidence)} confidence</span>` : ""}
        ${r.confidence_note ? `<span>${esc(r.confidence_note)}</span>` : ""}
      </div>

      ${list(r.strengths).length ? `<div class="t-label ins-h">${icon("check-circle", 13)} What is working</div>
        <div class="ins-list">
          ${list(r.strengths).map(x => `<div class="ins-card good">
            <b>${esc(x.title)}</b>
            <span>${esc(x.detail)}</span>
            <span class="ins-ev">${esc(x.evidence)}</span>
          </div>`).join("")}
        </div>` : ""}

      ${list(r.issues).length ? `<div class="t-label ins-h">${icon("alert", 13)} What is costing you</div>
        <div class="ins-list">
          ${list(r.issues).map(x => `<div class="ins-card ${sev(x.severity)}">
            <b>${esc(x.title)} <span class="ins-sev">${esc(x.severity || "")}</span></b>
            <span>${esc(x.detail)}</span>
            <span class="ins-cost">${esc(x.cost)}</span>
            <span class="ins-ev">${esc(x.evidence)}</span>
          </div>`).join("")}
        </div>` : ""}

      ${list(r.steps).length ? `<div class="t-label ins-h">${icon("arrow-right", 13)} What to do, in order</div>
        <ol class="ins-steps">
          ${list(r.steps).map(x => `<li>
            <b>${esc(x.title)}</b> <span class="tag">${esc(x.effort || "")}</span>
            <span>${esc(x.detail)}</span>
            <span class="ins-ev">Expect: ${esc(x.expect)}</span>
          </li>`).join("")}
        </ol>` : ""}

      <div class="ins-meta">${esc(held.meta.model || "")} · ${held.meta.finished} finished jobs in ${held.meta.days} days${held.meta.usage && held.meta.usage.input ? ` · ${(held.meta.usage.input / 1000).toFixed(1)}k in / ${(held.meta.usage.output / 1000).toFixed(1)}k out` : ""}</div>`;
  },
  /* The briefing is shown, not hidden: it is the shop's own data leaving the
     building, and they should be able to read every line of it. */
  briefingHtml(b, held) {
    var rows = [["Finished in the period", `${b.delivery.finishedInPeriod} jobs · ${b.delivery.onTimePercent === null ? "—" : b.delivery.onTimePercent + "% on time"}`], ["Average lead time", b.delivery.avgLeadWorkingDays === null ? "—" : `${b.delivery.avgLeadWorkingDays} working days`], ["Open jobs", `${b.delivery.openJobs}`], ["Hours logged", `${b.time.hoursLogged} h against ${b.time.hoursEstimatedForThatWork} h estimated`], ["Time tracking", `${b.tracking.finishedTasksWithLoggedTime} of ${b.tracking.finishedTasks} finished tasks carry time`], ["Needs attention", `${b.attention.blocked.length} blocked · ${b.attention.overdue.length} overdue · ${b.attention.notMovedInDays.length} gone quiet`], ["Materials short", `${b.materials.shortForAcceptedWork.length} · ${b.materials.notLinkedToStock} not linked to stock`], ["Customers", `${b.customers.length} with finished work`]];
    return `<details class="sw-cols ins-brief" ${held ? "" : "open"}>
      <summary>What it is given — ${this.DAYS} days of this shop's own data</summary>
      <div class="sw-cols-body">
        <div class="ins-facts">
          ${rows.map(([k, v]) => `<div><span>${esc(k)}</span><b>${esc(v)}</b></div>`).join("")}
        </div>
        <div class="t-caption" style="margin-top:10px">
          Jobs, customers, stations, hours, materials and delivery dates are included, by name.
          Nothing is stored by the assessment; the key stays on the server.
        </div>
        <button class="link" id="ins-raw" type="button">${this.showBriefing ? "Hide" : "Show"} the exact data</button>
        ${this.showBriefing ? `<pre class="ins-raw">${esc(JSON.stringify(b, null, 1))}</pre>` : ""}
      </div>
    </details>`;
  },
  bind(root) {
    var run = $("#ins-run", root);
    if (run) run.onclick = () => this.run();
    var raw = $("#ins-raw", root);
    if (raw) raw.onclick = () => {
      this.showBriefing = !this.showBriefing;
      App.render();
    };
  }
};