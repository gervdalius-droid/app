/* ============================================================
   ShopFlow — Worker (shopfloor) mode
   Big targets, zero clutter: My Work · Station · Flow.
   Designed for a tablet at the bench.
   ============================================================ */
"use strict";

function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var Wkr = {
  station: null,
  // selected station in Station tab (defaults to member's home)

  shell() {
    var me = App.me;
    var today = new Date().toLocaleDateString(isLT() ? "lt-LT" : "en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });
    var homeSt = me.station ? D.station(me.station) : null; // may be null if the station was deleted
    var tabs = [["my", "wrench", "My Work"], ["station", "factory", "Stations"], ["flow", "list", "Flow"], ["board", "bulb", "Ideas"]];
    return `<div class="worker-shell">
      <div class="worker-top">
        ${avatarHtml(me, "lg")}
        <div class="meta"><b>${I18N.t("Hi,")} ${esc(me.name)}</b><span>${today}${homeSt ? ` · ${esc(homeSt.name)}` : ""}</span></div>
        ${Offline.badgeHtml()}
        <button class="btn subtle w-exit" id="w-cockpit">${icon("dashboard", 15)} ${I18N.t("Full view")}</button>
        <button class="icon-btn" id="w-theme" title="Appearance">${icon("moon", 16)}</button>
        <button class="icon-btn" id="w-logout" title="Sign out">${icon("power", 15)}</button>
      </div>
      <div class="worker-body ${App.workerTab === "board" ? "wb-fill" : ""}" id="w-body">${this.tabHtml()}</div>
      <div class="tabbar">
        ${tabs.map(([id, ico, label]) => `
          <button class="${App.workerTab === id ? "active" : ""}" data-tab="${id}">
            <span class="ico">${icon(ico, 20)}</span>${label}
          </button>`).join("")}
      </div>
    </div>`;
  },
  tabHtml() {
    switch (App.workerTab) {
      case "my":
        return this.myWork();
      case "station":
        return this.stationView();
      case "flow":
        return this.flowView();
      case "board":
        return WB.view();
      default:
        return this.myWork();
    }
  },
  bind(root) {
    $$("[data-tab]", root).forEach(b => b.onclick = () => {
      App.workerTab = b.dataset.tab;
      Router.push();
      App.render();
    });
    $("#w-logout", root).onclick = () => App.logout();
    $("#w-theme", root).onclick = () => {
      var cur = document.documentElement.getAttribute("data-theme");
      App.applyTheme(cur === "dark" ? "light" : "dark");
    };
    $("#w-cockpit", root).onclick = () => App.setBenchMode(false);
    this.bindWork(root);

    // Whiteboard tab
    if (App.workerTab === "board") WB.bind(root);
    // Personal to-dos on My Work
    if (App.workerTab === "my") Todo.bind(root);
  },
  /* Just the task actions — shared with the cockpit's "My Work" page, which
     has no worker top bar or tab bar to wire up. */
  bindWork(root) {
    // Hero actions
    $$("[data-w-act]", root).forEach(b => b.onclick = () => {
      var act = b.dataset.wAct;
      var _b$dataset$target$spl = b.dataset.target.split("/"),
        _b$dataset$target$spl2 = _slicedToArray(_b$dataset$target$spl, 2),
        orderId = _b$dataset$target$spl2[0],
        opId = _b$dataset$target$spl2[1];
      var o = D.order(orderId);
      var op = o.ops.find(x => x.id === opId);
      if (act === "start") {
        M.startOp(orderId, opId, App.me.id);
        Toast.show("Clocked on — good luck!", {
          emoji: "play"
        });
      }
      if (act === "pause") {
        M.pauseOp(orderId, opId, App.me.id);
        Toast.show("Paused", {
          emoji: "⏸"
        });
      }
      if (act === "qty+" || act === "qty-") {
        var item = D.item(o, op.itemId);
        var before = op.qtyDone;
        M.reportQty(orderId, opId, op.qtyDone + (act === "qty+" ? 1 : -1), App.me.id);
        if (op.status === "done" && before < item.qty) Toast.show(`All ${item.qty} pcs done — great work!`, {
          emoji: "check-circle",
          ms: 4000
        });
      }
      if (act === "done") {
        if (!App.tapGuard()) return; // reflex double-tap
        var _item = D.item(o, op.itemId);
        var next = M.completeOp(orderId, opId, App.me.id);
        if (op.status !== "done") {
          Toast.show(`Reported ${op.qtyDone} of ${_item.qty} — the rest is still upstream`, {
            emoji: "⏳",
            ms: 4200
          });
        } else {
          Toast.show(next ? `Done! Next: ${D.station(next.stationId).name}${next.group ? " · " + next.group : ""}` : `${o.num}: all tasks done!`, {
            emoji: "✅",
            ms: 4000
          });
        }
      }
      if (act === "block") {
        OrderDetail.blockDialog(orderId, opId);
        return;
      }
      App.render();
    });

    // Open order details
    $$("[data-w-order]", root).forEach(b => b.onclick = e => {
      if (e.target.closest("[data-w-act]") || e.target.closest("[data-file]")) return;
      Drawer.open(b.dataset.wOrder);
    });

    // Station chips
    $$("[data-w-station]", root).forEach(b => b.onclick = () => {
      this.station = b.dataset.wStation;
      Router.push();
      App.render();
    });

    /* tapping a drawing opens it full screen — and must not also open the
       order drawer underneath it */
    if (typeof Files !== "undefined") Files.bindChips(root);
  },
  /* ---------------- My Work ---------------- */
  myWork() {
    var me = App.me;
    var running = D.runningOpOf(me.id);
    // paused op of mine (shown as hero when nothing is running)
    var pausedMine = null;
    if (!running) {
      var _iterator = _createForOfIteratorHelper(Store.state.orders),
        _step;
      try {
        var _loop = function _loop() {
            var o = _step.value;
            if (o.shipped) return 0; // continue
            var op = o.ops.find(x => x.status === "paused" && x.assigneeId === me.id && D.opReady(o, x));
            if (op) {
              pausedMine = {
                order: o,
                op
              };
              return 1; // break
            }
          },
          _ret;
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          _ret = _loop();
          if (_ret === 0) continue;
          if (_ret === 1) break;
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    var heroOpId = running ? running.op.id : pausedMine ? pausedMine.op.id : null;
    var queue = D.workerQueue(me.id).filter(x => x.op.id !== heroOpId);
    var doneToday = D.doneTodayBy(me.id);
    var html = "";
    if (running) {
      var order = running.order,
        op = running.op;
      var st = D.station(op.stationId);
      var due = fmtDue(order.due);
      var item = D.item(order, op.itemId);
      var avail = D.opAvail(order, op);
      var showQty = item && item.qty > 1;
      html += `<div class="worker-section">
        <div class="hero-task" data-w-order="${order.id}">
          <div class="ht-top">
            <div class="grow">
              <div class="stat-line"><span class="dot"></span> ${I18N.t("Working now")} — ${esc(st.name)}${op.group ? ` · ${esc(op.group)}` : ""}</div>
              <h1>${esc(order.product)}</h1>
              <div class="sub">${order.num !== order.product ? esc(order.num) + " · " : ""}${order.client && order.client !== order.product ? esc(order.client) + " · " : ""}${item && order.items.length > 1 ? `${esc(item.name)} · ` : ""}${item ? item.qty : order.qty} ${esc(order.unit)} · ${due.label}</div>
            </div>
          </div>
          ${(() => {
        /* the drawing belongs where the work is — this task's files first,
           then the project's, because at the machine you want both */
        var fs = [...D.filesFor({
          opId: op.id
        }), ...D.filesFor({
          orderId: order.id
        })];
        return fs.length ? Files.chipsHtml(fs) : "";
      })()}
          <div class="row" style="justify-content:space-between;flex-wrap:wrap;gap:12px">
            <div class="timer"><span data-timer="${order.id}/${op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(op))}</span><small>${I18N.t("est")} ${fmtDur(op.estMins * 60000)}</small>${offShiftHtml(true)}</div>
            ${showQty ? `<div class="qty-stepper">
              <button class="step-btn" data-w-act="qty-" data-target="${order.id}/${op.id}" ${op.qtyDone <= 0 ? "disabled" : ""}>−</button>
              <span class="qv">${op.qtyDone}<small> / ${item.qty} pcs</small></span>
              <button class="step-btn" data-w-act="qty+" data-target="${order.id}/${op.id}" ${op.qtyDone >= avail ? "disabled" : ""}>＋</button>
            </div>` : ""}
          </div>
          ${showQty && avail < item.qty ? `<div style="font-size:12px;opacity:.8">${icon("clock", 12)} ${avail} of ${item.qty} available from the previous step so far</div>` : ""}
          <div class="ht-actions">
            <button class="btn" data-w-act="pause" data-target="${order.id}/${op.id}">${icon("pause", 13)} Pause</button>
            <button class="btn" data-w-act="block" data-target="${order.id}/${op.id}">${icon("alert", 13)} Problem</button>
            <button class="btn done-btn" data-w-act="done" data-target="${order.id}/${op.id}">${icon("check", 13)} Done</button>
          </div>
        </div>
      </div>`;
    } else if (pausedMine) {
      var _pausedMine = pausedMine,
        _order = _pausedMine.order,
        _op = _pausedMine.op;
      var _st = D.station(_op.stationId);
      var _item2 = D.item(_order, _op.itemId);
      var _avail = D.opAvail(_order, _op);
      var _showQty = _item2 && _item2.qty > 1;
      html += `<div class="worker-section">
        <div class="hero-task paused" data-w-order="${_order.id}">
          <div class="ht-top"><div class="grow">
            <div class="stat-line">${icon("pause", 12)} Paused — ${esc(_st.name)}${_op.group ? ` · ${esc(_op.group)}` : ""}</div>
            <h1>${esc(_order.product)}</h1>
            <div class="sub">${_order.num !== _order.product ? esc(_order.num) + " · " : ""}${_order.client && _order.client !== _order.product ? esc(_order.client) + " · " : ""}logged ${fmtDur(D.opElapsed(_op))}</div>
          </div></div>
          ${_showQty ? `<div class="qty-stepper">
            <button class="step-btn" data-w-act="qty-" data-target="${_order.id}/${_op.id}" ${_op.qtyDone <= 0 ? "disabled" : ""}>−</button>
            <span class="qv">${_op.qtyDone}<small> / ${_item2.qty} pcs</small></span>
            <button class="step-btn" data-w-act="qty+" data-target="${_order.id}/${_op.id}" ${_op.qtyDone >= _avail ? "disabled" : ""}>＋</button>
          </div>` : ""}
          <div class="ht-actions">
            <button class="btn" data-w-act="done" data-target="${_order.id}/${_op.id}">${icon("check", 13)} Done</button>
            <button class="btn done-btn" style="color:#b35c00" data-w-act="start" data-target="${_order.id}/${_op.id}">${icon("play", 12)} Resume</button>
          </div>
        </div>
      </div>`;
    }
    if (doneToday > 0) {
      html += `<div class="done-today">${icon("check-circle", 15)} ${doneToday} step${doneToday > 1 ? "s" : ""} completed today — keep it up!</div>`;
    }

    /* personal to-do list (admin can assign into it too) */
    var todos = D.todosFor(me.id).filter(t => !t.done);
    html += `<div class="worker-section">
      <h2>${icon("todo", 16)} My to-dos <span class="count-badge">${todos.length}</span></h2>
      <div class="panel"><div class="todo-list">
        ${todos.length ? todos.map(t => Todo.itemHtml(t)).join("") : `<div class="t-caption" style="padding:8px 16px 4px">Nothing on your list</div>`}
        ${Todo.addRow(me.id, "Add a to-do…")}
      </div></div>
    </div>`;
    html += `<div class="worker-section">
      <h2>Up next <span class="count-badge">${queue.length}</span></h2>
      ${queue.length ? queue.map(({
      order,
      op
    }) => this.taskRow(order, op)).join("") : !running ? `<div class="worker-empty"><span class="big">${icon("sparkles", 44)}</span><h3>All caught up!</h3><p class="muted">No jobs waiting for you. Check Stations for unclaimed work.</p></div>` : `<div class="empty-mini" style="border:none">Nothing else queued for you.</div>`}
    </div>`;
    return `<div class="view-anim">${html}</div>`;
  },
  taskRow(order, op) {
    var st = D.station(op.stationId);
    var due = fmtDue(order.due);
    var blocked = op.status === "blocked";
    var item = D.item(order, op.itemId);
    var showQty = item && item.qty > 1;
    return `<div class="task-row" data-w-order="${order.id}">
      <div class="ico-wrap">${stIcon(st, 21)}</div>
      <div class="grow">
        <b>${esc(order.product)}</b>
        <div class="l2">
          ${order.num !== order.product ? `<span class="mono" style="font-size:11.5px">${esc(order.num)}</span>` : ""}
          <span>${stIcon(st, 13)} ${esc(st.name)}</span>
          ${op.group ? `<span class="task-tag">${esc(op.group)}</span>` : ""}
          ${order.items.length > 1 && item ? `<span class="task-tag" style="background:var(--teal-soft);color:var(--teal)">${esc(item.name)}</span>` : ""}
          ${showQty ? `<span class="qty-pill ${op.qtyDone > 0 ? "part" : ""}">${op.qtyDone}/${item.qty}</span>` : ""}
          <span class="due-chip ${due.cls}">${due.label}</span>
          ${prioHtml(order.priority)}
          ${blocked ? `<span class="pill blocked"><span class="dot"></span>${esc(op.blockNote || "Blocked")}</span>` : ""}
        </div>
      </div>
      ${blocked ? `<button class="btn subtle" data-w-act="start" data-target="${order.id}/${op.id}">Unblock & start</button>` : `<button class="btn primary start-btn" data-w-act="start" data-target="${order.id}/${op.id}">${icon("play", 12)} Start</button>`}
    </div>`;
  },
  /* ---------------- Station queues ---------------- */
  stationView() {
    var me = App.me;
    var stId = this.station || me.station || D.stationsOf("prod")[0].id;
    this.station = stId;
    var q = D.stationQueue(stId);
    return `<div class="view-anim">
      <div class="station-pick">
        ${D.stationsOf("prod").map(st => {
      var n = D.stationQueue(st.id).length;
      return `<button class="${st.id === stId ? "active" : ""}" data-w-station="${st.id}">${stIcon(st, 13)} ${esc(st.name)}${n ? ` · ${n}` : ""}</button>`;
    }).join("")}
      </div>
      ${q.length ? q.map(({
      order,
      op
    }) => {
      var mine = op.assigneeId === me.id;
      var assignee = D.member(op.assigneeId);
      var due = fmtDue(order.due);
      var item = D.item(order, op.itemId);
      return `<div class="task-row" data-w-order="${order.id}">
          <div class="ico-wrap">${op.status === "running" ? '<span class="pill running" style="padding:0;background:none"><span class="dot"></span></span>' : op.status === "blocked" ? icon("ban", 18) : icon("list", 18)}</div>
          <div class="grow">
            <b>${esc(order.product)}</b>
            <div class="l2">
              ${order.num !== order.product ? `<span class="mono" style="font-size:11.5px">${esc(order.num)}</span>` : ""}
              ${op.group ? `<span class="task-tag">${esc(op.group)}</span>` : ""}
              ${order.items.length > 1 && item ? `<span class="task-tag" style="background:var(--teal-soft);color:var(--teal)">${esc(item.name)}</span>` : ""}
              ${item && item.qty > 1 ? `<span class="qty-pill ${op.qtyDone > 0 ? "part" : ""}">${op.qtyDone}/${item.qty}</span>` : ""}
              <span class="due-chip ${due.cls}">${due.label}</span>
              ${prioHtml(order.priority)}
              ${assignee ? `<span class="row" style="gap:5px">${avatarHtml(assignee, "sm")} ${mine ? "You" : esc(assignee.name)}</span>` : `<span class="muted">Unclaimed</span>`}
              ${op.status === "running" ? `<span class="pill running"><span class="dot"></span><span data-timer="${order.id}/${op.id}" data-timer-style="clock">${fmtClock(D.opElapsed(op))}</span></span>` : ""}
            </div>
          </div>
          ${op.status !== "running" && op.status !== "blocked" ? `<button class="btn ${op.assigneeId && !mine ? "" : "primary"} start-btn" data-w-act="start" data-target="${order.id}/${op.id}">${icon("play", 12)} Start</button>` : op.status === "blocked" ? pillHtml("blocked") : ""}
        </div>`;
    }).join("") : `<div class="worker-empty"><span class="big">${icon("leaf", 44)}</span><h3>Queue is empty</h3><p class="muted">No orders waiting at this station.</p></div>`}
    </div>`;
  },
  /* ---------------- Flow (read-only overview) ---------------- */
  flowView() {
    var s = Store.state;
    var ready = s.orders.filter(o => !o.shipped && o.type !== "eng" && o.ops.length && o.ops.every(op => op.status === "done"));
    return `<div class="view-anim">
      ${D.stationsOf("prod").map(st => {
      var q = D.stationQueue(st.id);
      if (!q.length) return "";
      return `<div class="worker-section">
          <h2>${stIcon(st, 15)} ${esc(st.name)} <span class="count-badge">${q.length}</span></h2>
          ${q.map(({
        order,
        op
      }) => {
        var due = fmtDue(order.due);
        var assignee = D.member(op.assigneeId);
        var item = D.item(order, op.itemId);
        return `<div class="task-row" data-w-order="${order.id}" style="cursor:pointer">
              <div class="ico-wrap">${op.status === "running" ? '<span class="pill running" style="padding:0;background:none"><span class="dot"></span></span>' : op.status === "blocked" ? icon("ban", 16) : icon("clock", 16)}</div>
              <div class="grow">
                <b>${order.num !== order.product ? esc(order.num) + " · " : ""}${esc(order.product)}</b>
                <div class="l2">
                  ${op.group ? `<span class="task-tag">${esc(op.group)}</span>` : ""}
                  ${item && item.qty > 1 ? `<span class="qty-pill ${op.qtyDone > 0 ? "part" : ""}">${op.qtyDone}/${item.qty}</span>` : ""}
                  <span class="due-chip ${due.cls}">${due.label}</span>${assignee ? esc(assignee.name) : ""}
                </div>
              </div>
              ${stepsMini(order)}
            </div>`;
      }).join("")}
        </div>`;
    }).join("")}
      ${ready.length ? `<div class="worker-section">
        <h2><span style="color:var(--green)">${icon("check-circle", 15)}</span> Ready to ship <span class="count-badge">${ready.length}</span></h2>
        ${ready.map(o => `<div class="task-row" data-w-order="${o.id}">
          <div class="ico-wrap">${icon("box", 19)}</div>
          <div class="grow"><b>${esc(o.num)} · ${esc(o.product)}</b><div class="l2">${esc(o.client)}</div></div>
          ${pillHtml("ready")}
        </div>`).join("")}
      </div>` : ""}
    </div>`;
  }
};