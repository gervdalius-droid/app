function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
/* ============================================================
   Reports — what the shop actually did

   The Dashboard answers "what is happening right now". This answers
   "how are we doing", which only became honest in v19: durations are
   measured against the shift, so a lead time here is working days, and
   an evening or a weekend adds nothing to it.

   One filter row scopes every figure on the page. Charts are single
   series on purpose — the story is always one magnitude, so there is no
   colour to decode and no legend to match.
   ============================================================ */
var Reports = {
  range: 90,
  // days, or "all"
  scope: "all",
  // all | prod | eng

  RANGES: [[30, "30 days"], [90, "90 days"], [365, "12 months"], ["all", "All time"]],
  SCOPES: [["all", "All work"], ["prod", "Production"], ["eng", "Engineering"]],
  window() {
    var to = Date.now();
    if (this.range === "all") {
      var first = Store.state.orders.reduce((t, o) => Math.min(t, o.createdAt || t), to);
      return {
        from: Math.min(first, to - 30 * DAY),
        to
      };
    }
    return {
      from: to - this.range * DAY,
      to
    };
  },
  data() {
    return D.report(_objectSpread(_objectSpread({}, this.window()), {}, {
      scope: this.scope
    }));
  },
  /* Working days, because that is the unit the shop plans in */
  days(ms) {
    var d = ms / Math.max(1, D.shiftDayMs());
    return d >= 10 ? Math.round(d) : Math.round(d * 10) / 10;
  },
  view() {
    var r = this.data();
    var est = r.estMs,
      act = r.workedMs;
    var drift = est ? Math.round((act - est) / est * 100) : null;
    return `<div class="view-anim">
      <div class="toolbar rep-filters">
        <div class="filter-chips">
          ${this.RANGES.map(([v, label]) => `<button class="fchip ${String(this.range) === String(v) ? "active" : ""}" data-rrange="${v}">${label}</button>`).join("")}
        </div>
        <div class="grow"></div>
        <div class="segmented">
          ${this.SCOPES.map(([v, label]) => `<button class="${this.scope === v ? "active" : ""}" data-rscope="${v}">${label}</button>`).join("")}
        </div>
        <button class="btn" id="rep-csv" ${r.count ? "" : "disabled"}>${icon("save", 13)} Export CSV</button>
      </div>

      <div class="kpis">
        <div class="kpi static"><span class="val">${r.count}</span><span class="lbl">Finished</span>
          <span class="sub muted">${r.openCount} still open</span></div>
        <div class="kpi static ${r.onTimePct !== null && r.onTimePct < 80 ? "warn" : r.onTimePct !== null && r.onTimePct >= 95 ? "ok" : ""}">
          <span class="val">${r.onTimePct === null ? "—" : r.onTimePct + "%"}</span><span class="lbl">On time</span>
          <span class="sub muted">${r.count ? `${r.onTime} of ${r.count} met the due date` : "nothing finished yet"}</span></div>
        <div class="kpi static"><span class="val">${r.count ? this.days(r.avgLead) : "—"}</span><span class="lbl">Avg lead time</span>
          <span class="sub muted">working days, order to done</span></div>
        <div class="kpi static"><span class="val">${Math.round(act / 3600000)}</span><span class="lbl">Hours worked</span>
          <span class="sub ${drift === null ? "muted" : drift > 10 ? "" : "muted"}" ${drift !== null && drift > 10 ? `style="color:var(--orange)"` : ""}>${drift === null ? "no estimates to compare" : drift > 0 ? `${drift}% over estimate` : `${-drift}% under estimate`}</span></div>
      </div>

      ${typeof Insights !== "undefined" ? Insights.view() : ""}

      <div class="rep-grid">
        ${this.throughput(r)}
        ${this.stationLoad(r)}
      </div>
      <div class="rep-grid rev">
        ${this.people(r)}
        ${this.finishedTable(r)}
      </div>
    </div>`;
  },
  /* ---- Throughput: how many projects crossed the line, per week ---- */
  throughput(r) {
    var _r$buckets$;
    var max = Math.max(1, ...r.buckets.map(b => b.n));
    var byMonth = (_r$buckets$ = r.buckets[0]) === null || _r$buckets$ === void 0 ? void 0 : _r$buckets$.byMonth;
    // gridlines land on whole projects — half a project means nothing
    var step = max <= 4 ? 1 : max <= 10 ? 2 : Math.ceil(max / 5);
    var ticks = [];
    for (var v = 0; v <= max; v += step) ticks.push(v);
    var peak = r.buckets.reduce((a, b) => b.n > a.n ? b : a, {
      n: -1
    });
    var last = r.buckets[r.buckets.length - 1];
    return `<div class="panel">
      <header><h2>${icon("trend-up", 15)} Finished per ${byMonth ? "month" : "week"}</h2>
        <span class="t-caption">${r.count} in this period</span></header>
      <div class="panel-pad">
        ${r.buckets.length ? `<div class="chart-col">
          <div class="chart-plot">
            ${ticks.map(v => `<div class="gl" style="bottom:${v / max * 100}%"><span>${v}</span></div>`).join("")}
            <div class="cols">
              ${r.buckets.map(b => {
      // label the peak and the latest bar only — a number on every
      // column is noise, and the axis carries the rest
      var label = b.n && (b === peak || b === last);
      return `<div class="col" data-tip="${esc(this.bucketLabel(b, true))} · ${b.n} finished">
                  ${label ? `<span class="col-val">${b.n}</span>` : ""}
                  <div class="bar" style="height:${b.n / max * 100}%"></div>
                </div>`;
    }).join("")}
            </div>
          </div>
          <div class="chart-x">${r.buckets.map(b => `<span>${esc(this.bucketLabel(b))}</span>`).join("")}</div>
        </div>` : `<div class="empty-mini"><span class="big">${icon("trend-up", 26)}</span>Nothing finished in this period</div>`}
      </div>
    </div>`;
  },
  bucketLabel(b, long) {
    var d = new Date(b.from);
    if (b.byMonth) return d.toLocaleDateString(isLT() ? "lt-LT" : "en-GB", {
      month: "short",
      year: long ? "numeric" : undefined
    });
    if (long) return `Week of ${fmtDate(b.from)}`;
    return d.toLocaleDateString(isLT() ? "lt-LT" : "en-GB", {
      day: "numeric",
      month: "short"
    });
  },
  /* ---- Where the hours went, with the estimate as a reference mark ----
     One bar per station (actual) and a tick where the estimate sat. Two
     grouped bars would need a legend to say which is which; a target mark
     reads immediately and keeps it a single series. */
  stationLoad(r) {
    var max = Math.max(1, ...r.stations.map(s => Math.max(s.ms, s.est)));
    return `<div class="panel">
      <header><h2>${icon("factory", 15)} Where the hours went</h2>
        <span class="t-caption">tasks worked in this period</span></header>
      <div class="panel-pad">
        ${r.stations.length ? `<div class="hbars">
          ${r.stations.map(s => {
      var over = s.est && s.ms > s.est * 1.1;
      return `<div class="hbar-row" data-tip="${esc(s.station.name)} · ${s.n} task${s.n === 1 ? "" : "s"} · ${fmtDur(s.ms)} worked${s.est ? `, ${fmtDur(s.est)} estimated` : ""}">
              <span class="hbar-label">${esc(s.station.name)}</span>
              <span class="hbar-track">
                <span class="hbar-fill" style="width:${s.ms / max * 100}%"></span>
                ${s.est ? `<span class="hbar-target" style="left:${Math.min(100, s.est / max * 100)}%"></span>` : ""}
              </span>
              <span class="hbar-val">${fmtDur(s.ms)}${over ? ` <span class="over-tag">over</span>` : ""}</span>
            </div>`;
    }).join("")}
          <div class="chart-key"><span class="key-target"></span> the tick marks the estimate</div>
        </div>` : `<div class="empty-mini"><span class="big">${icon("factory", 26)}</span>No time logged in this period</div>`}
      </div>
    </div>`;
  },
  /* ---- Hours per person ---- */
  people(r) {
    var max = Math.max(1, ...r.members.map(m => m.ms));
    return `<div class="panel">
      <header><h2>${icon("users", 15)} Hours per person</h2>
        <span class="t-caption">${r.members.length} people logged work</span></header>
      <div class="panel-pad">
        ${r.members.length ? `<div class="hbars">
          ${r.members.map(m => `<div class="hbar-row" data-tip="${esc(m.member.name)} · ${m.n} task${m.n === 1 ? "" : "s"} · ${fmtDur(m.ms)}">
            <span class="hbar-label">${avatarHtml(m.member, "sm")} ${esc(m.member.name)}</span>
            <span class="hbar-track"><span class="hbar-fill" style="width:${m.ms / max * 100}%"></span></span>
            <span class="hbar-val">${fmtDur(m.ms)}</span>
          </div>`).join("")}
        </div>` : `<div class="empty-mini"><span class="big">${icon("users", 26)}</span>No assigned work in this period</div>`}
      </div>
    </div>`;
  },
  /* ---- The table view: every figure above, readable without colour ---- */
  finishedTable(r) {
    var rows = r.finished.slice(0, 40);
    return `<div class="panel">
      <header><h2>${icon("check-circle", 15)} Finished projects</h2>
        ${r.finished.length > rows.length ? `<span class="t-caption">newest ${rows.length} of ${r.finished.length}</span>` : ""}</header>
      <div class="table-card flush">
        ${rows.length ? `<table class="orders rep-table">
          <thead><tr><th>Project</th><th>Finished</th><th>Lead time</th><th>Worked</th><th>vs est.</th></tr></thead>
          <tbody>
            ${rows.map(f => {
      var o = f.order;
      var late = f.finishedAt > o.due;
      var act = D.orderActualMs(o),
        est = D.orderEstMs(o);
      // no tracked time is not "100% under estimate" — it is no answer
      var pct = est && act ? Math.round((act - est) / est * 100) : null;
      return `<tr data-order="${o.id}">
                <td class="ord-cell"><b>${esc(o.product)}</b><span class="mono">${esc(o.num)} · ${esc(o.client)}</span></td>
                <td><span class="t-caption">${fmtDate(f.finishedAt)}</span>
                  ${late ? `<span class="due-chip overdue">late</span>` : `<span class="due-chip ok-chip">on time</span>`}</td>
                <td><span class="t-num t-caption">${this.days(D.workMsBetween(o.createdAt, f.finishedAt))} d</span></td>
                <td>${act ? `<span class="t-num t-caption">${fmtDur(act)}</span>` : `<span class="muted">—</span>`}</td>
                <td>${pct === null ? `<span class="muted">—</span>` : `<span class="t-num t-caption" ${pct > 10 ? `style="color:var(--orange)"` : ""}>${pct > 0 ? "+" : ""}${pct}%</span>`}</td>
              </tr>`;
    }).join("")}
          </tbody>
        </table>` : `<div class="empty-state"><span class="big">${icon("check-circle", 40)}</span><h3>Nothing finished yet</h3><p>Completed projects and their lead times land here.</p></div>`}
      </div>
    </div>`;
  },
  csv() {
    var r = this.data();
    var head = ["Number", "Project", "Client", "Type", "Created", "Due", "Finished", "On time", "Lead time (working days)", "Estimated (h)", "Worked (h)"];
    var iso = ts => new Date(ts).toISOString().slice(0, 10);
    var h = ms => (ms / 3600000).toFixed(2);
    var cell = v => {
      var s = String(v !== null && v !== void 0 ? v : "");
      return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    var lines = [head.join(",")];
    var _iterator = _createForOfIteratorHelper(r.finished),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var f = _step.value;
        var o = f.order;
        lines.push([o.num, o.product, o.client, o.type === "eng" ? "Engineering" : "Production", iso(o.createdAt), iso(o.due), iso(f.finishedAt), f.finishedAt <= o.due ? "yes" : "no", this.days(D.workMsBetween(o.createdAt, f.finishedAt)), h(D.orderEstMs(o)), h(D.orderActualMs(o))].map(cell).join(","));
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    return lines.join("\n");
  },
  bind(root) {
    $$("[data-rrange]", root).forEach(b => b.onclick = () => {
      var v = b.dataset.rrange;
      this.range = v === "all" ? "all" : Number(v);
      App.render();
    });
    $$("[data-rscope]", root).forEach(b => b.onclick = () => {
      this.scope = b.dataset.rscope;
      App.render();
    });
    $$("tr[data-order]", root).forEach(tr => tr.onclick = () => Drawer.open(tr.dataset.order));
    Tip.bind(root);
    if (typeof Insights !== "undefined") Insights.bind(root);
    var csv = $("#rep-csv", root);
    if (csv) csv.onclick = () => {
      // Excel opens UTF-8 CSV correctly only with a BOM, and these are Lithuanian names
      var blob = new Blob(["﻿" + this.csv()], {
        type: "text/csv;charset=utf-8"
      });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `shopflow-report-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      Toast.show("Report exported", {
        emoji: "check"
      });
    };
  }
};