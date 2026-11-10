/* ============================================================
   ShopFlow — Planner (general project management)
   Asana / Monday / ClickUp / Jira-style: projects with custom
   status columns, tasks (assignee, due, priority, labels,
   subtasks, comments) across Board / List / Timeline / Calendar,
   plus a cross-project My Tasks. Reuses the shell, team, roles,
   notifications, activity — none of the manufacturing modules.
   ============================================================ */
"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var GPM = {
  section: "projects",
  // projects | mytasks
  openId: null,
  // open project
  tab: "board",
  // board | list | timeline | calendar
  taskId: null,
  // open task (drawer)
  calY: null,
  calM: null,
  DAY_W: 34,
  /* status column colours (map to accent vars) */
  STAGE_C: {
    blue: "var(--blue)",
    indigo: "var(--indigo)",
    teal: "var(--teal)",
    purple: "var(--purple)",
    orange: "var(--orange)",
    green: "var(--green)",
    red: "var(--red)",
    gray: "var(--gray)"
  },
  stageColor(s) {
    return this.STAGE_C[s && s.color] || "var(--gray)";
  },
  isActive() {
    return App.me && App.view === "planner";
  },
  project() {
    return D.gproject(this.openId);
  },
  /* ================= view ================= */
  view() {
    if (this.openId && !D.gproject(this.openId)) this.openId = null;
    if (this.openId) return this.projectView();
    return `<div style="display:flex;flex-direction:column;height:100%">
      <div class="vtabs">
        <button class="vtab ${this.section === "projects" ? "active" : ""}" data-gsection="projects">${icon("columns", 14)} Projects</button>
        <button class="vtab ${this.section === "mytasks" ? "active" : ""}" data-gsection="mytasks">${icon("check-circle", 14)} My Tasks <span class="count-badge">${D.myGTaskCount(App.me.id)}</span></button>
      </div>
      <div class="projects-body">${this.section === "mytasks" ? this.myTasksView() : this.gallery()}</div>
    </div>`;
  },
  /* ---------- gallery ---------- */
  gallery() {
    var projects = D.activeGProjects();
    return `<div class="tab-pad view-anim">
      <div class="portfolio-grid">
        ${projects.map(p => {
      var pr = D.gProgress(p);
      var members = [...new Set(p.tasks.map(t => t.assigneeId).filter(Boolean))].map(id => D.member(id)).filter(Boolean).slice(0, 4);
      return `<button class="gp-card" data-gp-open="${p.id}">
            <div class="gp-card-top" style="background:${this.STAGE_C[p.color] || "var(--blue)"}">
              <span class="gp-ico">${icon(p.icon || "columns", 20)}</span>
              <span class="gp-key">${esc(p.key)}</span>
            </div>
            <div class="gp-card-body">
              <b>${esc(p.name)}</b>
              <div class="prog-row"><div class="progress ${pr.pct === 100 ? "done" : ""}"><i style="width:${pr.pct}%"></i></div><span class="t-caption">${pr.done}/${pr.total}</span></div>
              <div class="row" style="justify-content:space-between">
                <span class="t-caption">${p.tasks.length} task${p.tasks.length === 1 ? "" : "s"}</span>
                <span class="avatar-stack">${members.map(m => avatarHtml(m, "sm")).join("")}</span>
              </div>
            </div>
          </button>`;
    }).join("")}
        <button class="portfolio-card portfolio-new" id="gp-new">${icon("plus", 15)} New project</button>
      </div>
    </div>`;
  },
  /* ---------- My Tasks (cross-project) ---------- */
  myTasksView() {
    var mine = D.myGTasks(App.me.id);
    var today = new Date();
    today.setHours(23, 59, 59, 999);
    var weekEnd = Date.now() + 7 * DAY;
    var groups = [["Overdue", mine.filter(x => x.task.due && x.task.due < Date.now())], ["Today", mine.filter(x => x.task.due && x.task.due >= Date.now() && x.task.due <= today.getTime())], ["This week", mine.filter(x => x.task.due && x.task.due > today.getTime() && x.task.due <= weekEnd)], ["Later", mine.filter(x => x.task.due && x.task.due > weekEnd)], ["No date", mine.filter(x => !x.task.due)]].filter(g => g[1].length);
    return `<div class="tab-pad view-anim" style="max-width:760px">
      ${mine.length ? groups.map(([label, items]) => `
        <div class="group-head">${label} <span class="count-badge">${items.length}</span></div>
        <div class="table-card" style="margin-bottom:14px"><div class="gtask-rows">
          ${items.map(({
      project,
      task
    }) => this.taskRow(project, task, true)).join("")}
        </div></div>
      `).join("") : `<div class="empty-state"><span class="big">${icon("check-circle", 44)}</span><h3>Nothing assigned to you</h3><p>Tasks people assign you across projects show up here.</p></div>`}
    </div>`;
  },
  taskRow(project, task, showProject) {
    var st = D.gstage(project, task.stageId);
    var a = D.member(task.assigneeId);
    var due = task.due ? fmtDue(task.due) : null;
    var sub = D.gSubProgress(task);
    var done = D.gTaskDone(project, task);
    return `<div class="gtask-row ${done ? "done" : ""}" data-gt="${project.id}/${task.id}">
      <button class="gt-check ${done ? "on" : ""}" data-gt-done="${project.id}/${task.id}">${done ? icon("check", 12) : ""}</button>
      <span class="grow">
        <b>${esc(task.title)}</b>
        <span class="gt-meta">
          ${showProject ? `<span class="gt-proj" style="color:${this.STAGE_C[project.color]}">${esc(project.key)}</span>` : ""}
          <span class="gt-stage" style="--sc:${this.stageColor(st)}">${esc(st ? st.name : "")}</span>
          ${task.priority !== "normal" ? prioHtml(task.priority) : ""}
          ${sub.total ? `<span class="t-caption">${icon("check", 10)} ${sub.done}/${sub.total}</span>` : ""}
          ${task.comments && task.comments.length ? `<span class="t-caption">${icon("info", 10)} ${task.comments.length}</span>` : ""}
        </span>
      </span>
      ${due ? `<span class="due-chip ${due.cls}">${due.label}</span>` : ""}
      ${a ? avatarHtml(a, "sm") : `<span class="gt-unassigned">${icon("users", 13)}</span>`}
    </div>`;
  },
  /* ---------- project view ---------- */
  projectView() {
    var p = this.project();
    var pr = D.gProgress(p);
    var tabs = [["board", "kanban", "Board"], ["list", "list", "List"], ["timeline", "gantt", "Timeline"], ["calendar", "calendar", "Calendar"]];
    var body = {
      board: () => this.board(p),
      list: () => `<div class="tab-pad">${this.list(p)}</div>`,
      timeline: () => this.timeline(p),
      calendar: () => `<div class="tab-pad">${this.calendar(p)}</div>`
    }[this.tab]();
    return `<div style="display:flex;flex-direction:column;height:100%">
      <div class="gp-head">
        <button class="icon-btn" id="gp-back" title="All projects">${icon("chev-left", 16)}</button>
        <span class="gp-head-ico" style="background:${this.STAGE_C[p.color] || "var(--blue)"}">${icon(p.icon || "columns", 16)}</span>
        <input class="gp-title" id="gp-title" value="${esc(p.name)}" maxlength="60">
        <span class="pill" style="background:var(--surface-2);color:var(--text-3)">${esc(p.key)}</span>
        <div class="progress" style="width:120px"><i style="width:${pr.pct}%"></i></div>
        <span class="t-caption">${pr.done}/${pr.total} done</span>
        <span class="grow"></span>
        <button class="btn primary" id="gp-add-task">${icon("plus", 13)} Add task</button>
        <button class="icon-btn" id="gp-copy" title="Copy project">${icon("copy", 15)}</button>
        <button class="icon-btn" id="gp-del" title="Delete project">${icon("trash", 15)}</button>
      </div>
      <div class="vtabs">
        ${tabs.map(([id, ic, label]) => `<button class="vtab ${this.tab === id ? "active" : ""}" data-gtab="${id}"><span class="ico">${icon(ic, 14)}</span>${label}</button>`).join("")}
      </div>
      <div class="projects-body">${body}</div>
    </div>`;
  },
  /* ---------- Board (kanban) ---------- */
  board(p) {
    return `<div class="board-wrap view-anim"><div class="board gboard">
      ${p.stages.map(s => {
      var tasks = D.gStageTasks(p, s.id);
      return `<div class="board-col gcol" data-gstage="${s.id}">
          <header><span class="gstage-dot" style="background:${this.stageColor(s)}"></span>
            <input class="gstage-name" data-gstage-name="${s.id}" value="${esc(s.name)}">
            <span class="count-badge">${tasks.length}</span>
            <button class="mini-btn" data-gstage-menu="${s.id}" title="Column options">⋯</button>
          </header>
          <div class="board-col-cards gcards" data-gdrop="${s.id}">
            ${tasks.map(t => this.card(p, t)).join("")}
            <button class="gcard-add" data-gadd="${s.id}">${icon("plus", 12)} Add task</button>
          </div>
        </div>`;
    }).join("")}
      <button class="gcol-add" id="gstage-add">${icon("plus", 15)}<span>Add status</span></button>
    </div></div>`;
  },
  card(p, t) {
    var a = D.member(t.assigneeId);
    var due = t.due ? fmtDue(t.due) : null;
    var sub = D.gSubProgress(t);
    var done = D.gTaskDone(p, t);
    var labels = (t.labelIds || []).map(id => D.gLabel(p, id)).filter(Boolean);
    return `<div class="gcard ${done ? "done" : ""}" draggable="true" data-gcard="${t.id}">
      ${labels.length ? `<div class="gcard-labels">${labels.map(l => `<span class="glabel" style="background:${this.STAGE_C[l.color]}">${esc(l.name)}</span>`).join("")}</div>` : ""}
      <div class="gcard-title">${esc(t.title)}</div>
      ${t.priority !== "normal" || sub.total || t.comments && t.comments.length ? `<div class="gcard-meta">
        ${t.priority !== "normal" ? prioHtml(t.priority) : ""}
        ${sub.total ? `<span class="t-caption">${icon("check", 10)} ${sub.done}/${sub.total}</span>` : ""}
        ${t.comments && t.comments.length ? `<span class="t-caption">${icon("info", 10)} ${t.comments.length}</span>` : ""}
      </div>` : ""}
      <div class="gcard-foot">
        ${due ? `<span class="due-chip ${due.cls}">${due.label}</span>` : "<span></span>"}
        ${a ? avatarHtml(a, "sm") : `<span class="gt-unassigned">${icon("users", 12)}</span>`}
      </div>
    </div>`;
  },
  /* ---------- List ---------- */
  list(p) {
    return `<div class="view-anim">
      ${p.stages.map(s => {
      var tasks = D.gStageTasks(p, s.id);
      return `<div class="group-head"><span class="gstage-dot" style="background:${this.stageColor(s)}"></span> ${esc(s.name)} <span class="count-badge">${tasks.length}</span></div>
          <div class="table-card" style="margin-bottom:14px"><div class="gtask-rows">
            ${tasks.map(t => this.taskRow(p, t, false)).join("") || `<div class="t-caption" style="padding:10px 16px">No tasks</div>`}
            <div class="gtask-add"><input class="input" data-glist-add="${s.id}" placeholder="${icon ? "" : ""}Add a task…"><button class="btn subtle" data-glist-addbtn="${s.id}">${icon("plus", 12)} Add</button></div>
          </div></div>`;
    }).join("")}
    </div>`;
  },
  /* ---------- Timeline (Gantt of tasks with due dates) ---------- */
  timeline(p) {
    var W = this.DAY_W;
    var dated = p.tasks.filter(t => t.due).sort((a, b) => a.due - b.due);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (!dated.length) return `<div class="tab-pad"><div class="empty-state"><span class="big">${icon("gantt", 44)}</span><h3>No dated tasks</h3><p>Give tasks a due date to see them on the timeline.</p></div></div>`;
    var start = today.getTime() - 3 * DAY,
      end = today.getTime() + 7 * DAY;
    dated.forEach(t => {
      var s = t.start || t.due;
      if (s - 2 * DAY < start) start = s - 2 * DAY;
      if (t.due + 3 * DAY > end) end = t.due + 3 * DAY;
    });
    var days = Math.round((end - start) / DAY) + 1;
    var dayList = Array.from({
      length: days
    }, (_, i) => new Date(start + i * DAY));
    var months = [];
    for (var _i = 0, _dayList = dayList; _i < _dayList.length; _i++) {
      var d = _dayList[_i];
      var k = d.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
      });
      if (!months.length || months[months.length - 1].key !== k) months.push({
        key: k,
        n: 0
      });
      months[months.length - 1].n++;
    }
    var todayX = Math.round((today.getTime() - start) / DAY) * W;
    return `<div class="tl-scroll view-anim"><div class="tl">
      <div class="tl-head">
        <div class="tl-label-col">Task</div>
        <div><div class="tl-months">${months.map(m => `<div class="tl-month" style="width:${m.n * W}px">${m.key}</div>`).join("")}</div>
        <div class="tl-days">${dayList.map(d => {
      var wd = d.getDay();
      var tod = d.getTime() === today.getTime();
      return `<div class="tl-day ${wd === 0 || wd === 6 ? "weekend" : ""} ${tod ? "today" : ""}">${d.getDate()}</div>`;
    }).join("")}</div></div>
      </div>
      <div class="tl-body">
        ${dated.map(t => {
      var st = D.gstage(p, t.stageId);
      var s = t.start || t.due;
      var x = Math.round((s - start) / DAY) * W;
      var wDays = Math.max(1, Math.round((t.due - s) / DAY) + 1);
      var a = D.member(t.assigneeId);
      return `<div class="tl-row">
            <div class="tl-label-col tl-row-label" data-gcard="${t.id}"><b>${esc(t.title)}</b><span>${esc(st ? st.name : "")}${a ? " · " + esc(a.name) : ""}</span></div>
            <div class="tl-canvas" style="width:${days * W}px">
              ${dayList.map((d, i) => d.getDay() === 0 || d.getDay() === 6 ? `<div class="tl-grid-day weekend" style="left:${i * W}px"></div>` : "").join("")}
              <div class="tl-today-line" style="left:${todayX + W / 2}px"></div>
              <div class="tl-bar" data-gcard="${t.id}" style="left:${x + 3}px;width:${wDays * W - 6}px;background:${this.stageColor(st)}22;color:${this.stageColor(st)};border-color:${this.stageColor(st)}55">
                <span>${esc(t.title)}</span>
              </div>
            </div>
          </div>`;
    }).join("")}
      </div>
    </div></div>`;
  },
  /* ---------- Calendar ---------- */
  calendar(p) {
    var now = new Date();
    if (this.calY == null) {
      this.calY = now.getFullYear();
      this.calM = now.getMonth();
    }
    var first = new Date(this.calY, this.calM, 1);
    var title = first.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric"
    });
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
      return p.tasks.filter(t => t.due && t.due >= a && t.due < b);
    };
    return `<div class="view-anim">
      <div class="cal-head"><h2>${title}</h2>
        <button class="icon-btn" id="gcal-prev">${icon("chev-left", 15)}</button>
        <button class="icon-btn" id="gcal-next">${icon("chev-right", 15)}</button>
        <button class="btn ghost" id="gcal-today" style="padding:6px 13px;font-size:12.5px">Today</button>
        <div class="grow"></div><span class="t-caption">Drag tasks to reschedule</span>
      </div>
      <div class="cal-grid">
        ${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => `<div class="cal-dow">${d}</div>`).join("")}
        ${cells.slice(0, rows).map(d => {
      var inM = d.getMonth() === this.calM;
      var tod = d.getTime() === today.getTime();
      var items = byDay(d).slice(0, 4);
      var more = byDay(d).length - items.length;
      return `<div class="cal-cell ${inM ? "" : "other"} ${tod ? "today" : ""}" data-gcal-day="${d.getTime()}">
            <span class="d">${d.getDate()}</span>
            ${items.map(t => {
        var st = D.gstage(p, t.stageId);
        return `<div class="cal-chip" draggable="true" data-gcard="${t.id}" style="background:${this.stageColor(st)}1f;color:${this.stageColor(st)};border-color:${this.stageColor(st)}"><span>${esc(t.title)}</span></div>`;
      }).join("")}
            ${more > 0 ? `<div class="cal-more">+${more} more</div>` : ""}
          </div>`;
    }).join("")}
      </div>
    </div>`;
  },
  /* ================= bind ================= */
  bind(root) {
    if (this.taskId) this.renderTaskDrawer();
    if (!this.openId) {
      $$("[data-gsection]", root).forEach(b => b.onclick = () => {
        this.section = b.dataset.gsection;
        App.render();
      });
      $$("[data-gp-open]", root).forEach(b => b.onclick = () => {
        this.openId = b.dataset.gpOpen;
        this.tab = "board";
        Router.push();
        App.render();
      });
      var nb = $("#gp-new", root);
      if (nb) nb.onclick = () => this.newProjectModal();
      $$("[data-gt]", root).forEach(el => el.onclick = e => {
        if (e.target.closest("[data-gt-done]")) return;
        var _el$dataset$gt$split = el.dataset.gt.split("/"),
          _el$dataset$gt$split2 = _slicedToArray(_el$dataset$gt$split, 2),
          pid = _el$dataset$gt$split2[0],
          tid = _el$dataset$gt$split2[1];
        this.openTask(pid, tid);
      });
      $$("[data-gt-done]", root).forEach(b => b.onclick = e => {
        e.stopPropagation();
        var _b$dataset$gtDone$spl = b.dataset.gtDone.split("/"),
          _b$dataset$gtDone$spl2 = _slicedToArray(_b$dataset$gtDone$spl, 2),
          pid = _b$dataset$gtDone$spl2[0],
          tid = _b$dataset$gtDone$spl2[1];
        this.toggleDone(pid, tid);
      });
      return;
    }
    this.bindProject(root);
  },
  bindProject(root) {
    var p = this.project();
    $("#gp-back", root).onclick = () => {
      this.openId = null;
      Router.push();
      App.render();
    };
    var cp = $("#gp-copy", root);
    if (cp) cp.onclick = () => this.copyProjectModal(this.openId);
    $("#gp-title", root).onchange = e => {
      M.updateGProject(p.id, {
        name: e.target.value.trim() || p.name
      });
    };
    $("#gp-del", root).onclick = () => {
      var snap = Store.snapshot();
      M.deleteGProject(p.id, App.me.id);
      this.openId = null;
      App.render();
      Toast.show("Project deleted", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    };
    $("#gp-add-task", root).onclick = () => this.addTaskInline(p.stages[0].id);
    $$("[data-gtab]", root).forEach(b => b.onclick = () => {
      this.tab = b.dataset.gtab;
      Router.replace();
      App.render();
    });
    if (this.tab === "board") this.bindBoard(root, p);
    if (this.tab === "list") this.bindList(root, p);
    if (this.tab === "timeline") this.bindTimeline(root, p);
    if (this.tab === "calendar") this.bindCalendar(root, p);
  },
  bindBoard(root, p) {
    // open task
    $$(".gcard", root).forEach(c => c.onclick = () => this.openTask(p.id, c.dataset.gcard));
    // rename stage
    $$("[data-gstage-name]", root).forEach(inp => inp.onchange = () => M.updateGStage(p.id, inp.dataset.gstageName, {
      name: inp.value.trim() || "Status"
    }));
    // stage menu
    $$("[data-gstage-menu]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      this.stageMenu(b, p, b.dataset.gstageMenu);
    });
    // add stage
    $("#gstage-add", root).onclick = () => {
      M.addGStage(p.id, "New status", App.me.id);
      App.render();
    };
    // add task per column
    $$("[data-gadd]", root).forEach(b => b.onclick = () => this.addTaskInline(b.dataset.gadd));
    // drag & drop
    var drag = null;
    $$(".gcard", root).forEach(c => {
      c.ondragstart = e => {
        drag = c.dataset.gcard;
        c.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", drag);
      };
      c.ondragend = () => {
        c.classList.remove("dragging");
        drag = null;
      };
    });
    $$("[data-gdrop]", root).forEach(col => {
      col.ondragover = e => {
        e.preventDefault();
        col.closest(".gcol").classList.add("drag-over");
      };
      col.ondragleave = () => col.closest(".gcol").classList.remove("drag-over");
      col.ondrop = e => {
        e.preventDefault();
        col.closest(".gcol").classList.remove("drag-over");
        var id = e.dataTransfer.getData("text/plain") || drag;
        if (!id) return;
        var overCard = e.target.closest(".gcard");
        var beforeId = overCard && overCard.dataset.gcard !== id ? overCard.dataset.gcard : null;
        M.placeGTask(p.id, id, col.dataset.gdrop, beforeId, App.me.id);
        App.render();
      };
    });
  },
  bindList(root, p) {
    $$("[data-gt]", root).forEach(el => el.onclick = e => {
      if (e.target.closest("[data-gt-done]")) return;
      var _el$dataset$gt$split3 = el.dataset.gt.split("/"),
        _el$dataset$gt$split4 = _slicedToArray(_el$dataset$gt$split3, 2),
        pid = _el$dataset$gt$split4[0],
        tid = _el$dataset$gt$split4[1];
      this.openTask(pid, tid);
    });
    $$("[data-gt-done]", root).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var _b$dataset$gtDone$spl3 = b.dataset.gtDone.split("/"),
        _b$dataset$gtDone$spl4 = _slicedToArray(_b$dataset$gtDone$spl3, 2),
        pid = _b$dataset$gtDone$spl4[0],
        tid = _b$dataset$gtDone$spl4[1];
      this.toggleDone(pid, tid);
    });
    $$("[data-glist-addbtn]", root).forEach(b => {
      var sid = b.dataset.glistAddbtn;
      var inp = $(`[data-glist-add="${sid}"]`, root);
      var add = () => {
        var v = inp.value.trim();
        if (!v) return;
        M.addGTask(p.id, {
          title: v,
          stageId: sid
        }, App.me.id);
        App.render();
      };
      b.onclick = add;
      inp.onkeydown = e => {
        if (e.key === "Enter") add();
      };
    });
  },
  bindTimeline(root, p) {
    $$("[data-gcard]", root).forEach(el => el.onclick = () => this.openTask(p.id, el.dataset.gcard));
  },
  bindCalendar(root, p) {
    $("#gcal-prev", root).onclick = () => {
      this.calM--;
      if (this.calM < 0) {
        this.calM = 11;
        this.calY--;
      }
      App.render();
    };
    $("#gcal-next", root).onclick = () => {
      this.calM++;
      if (this.calM > 11) {
        this.calM = 0;
        this.calY++;
      }
      App.render();
    };
    $("#gcal-today", root).onclick = () => {
      var n = new Date();
      this.calY = n.getFullYear();
      this.calM = n.getMonth();
      App.render();
    };
    var drag = null;
    $$(".cal-chip", root).forEach(ch => {
      ch.onclick = () => this.openTask(p.id, ch.dataset.gcard);
      ch.ondragstart = e => {
        drag = ch.dataset.gcard;
        ch.classList.add("dragging");
        e.dataTransfer.setData("text/plain", drag);
      };
      ch.ondragend = () => {
        ch.classList.remove("dragging");
        drag = null;
      };
    });
    $$("[data-gcal-day]", root).forEach(cell => {
      cell.ondragover = e => {
        e.preventDefault();
        cell.classList.add("drag-over");
      };
      cell.ondragleave = () => cell.classList.remove("drag-over");
      cell.ondrop = e => {
        e.preventDefault();
        cell.classList.remove("drag-over");
        var id = e.dataTransfer.getData("text/plain") || drag;
        if (!id) return;
        M.updateGTask(p.id, id, {
          due: parseInt(cell.dataset.gcalDay) + 12 * 3600000
        }, App.me.id);
        App.render();
      };
    });
  },
  toggleDone(pid, tid) {
    var p = D.gproject(pid),
      t = D.gtask(p, tid);
    var doneStage = p.stages.find(s => s.done);
    var todoStage = p.stages.find(s => !s.done) || p.stages[0];
    if (D.gTaskDone(p, t)) M.placeGTask(pid, tid, todoStage.id, null, App.me.id);else if (doneStage) M.placeGTask(pid, tid, doneStage.id, null, App.me.id);
    App.render();
  },
  addTaskInline(stageId) {
    var p = this.project() || D.gproject(this.openId);
    var t = M.addGTask(p.id, {
      title: "New task",
      stageId
    }, App.me.id);
    App.render();
    this.openTask(p.id, t.id, true);
  },
  /* ---------- New project ---------- */
  /* Copy a Planner project — the stage columns and labels are the template;
     tasks are optional. Names stay unique so two boards can't be confused. */
  copyProjectModal(pid) {
    var p = D.gproject(pid);
    if (!p) return;
    var suggested = D.uniqueName(p.name, n => D.gprojectNameTaken(n));
    Modal.open(`
      <header><h2>Copy project</h2><button class="icon-btn" data-close>✕</button></header>
      <div class="modal-body">
        <div class="t-caption"><b>${esc(p.name)}</b></div>
        <div class="t-caption">Copies the stage columns and labels.</div>
        <div class="field"><label>New name</label>
          <input class="input" id="gcp-name" value="${esc(suggested)}" autocomplete="off">
          <span class="t-caption" id="gcp-warn" style="color:var(--red);min-height:15px"></span>
        </div>
        <label class="check-row"><input type="checkbox" id="gcp-tasks"> Also copy the ${p.tasks.length} task${p.tasks.length === 1 ? "" : "s"} (unticked subtasks, no comments)</label>
      </div>
      <footer><button class="btn" data-close>Cancel</button>
        <button class="btn primary" id="gcp-go">${icon("copy", 14)} Create copy</button></footer>`, m => {
      var name = $("#gcp-name", m),
        warn = $("#gcp-warn", m),
        go = $("#gcp-go", m);
      var check = () => {
        var v = name.value.trim();
        var bad = !v ? "Give the copy a name" : D.gprojectNameTaken(v) ? "That name is already used by another project" : "";
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
        var copy = M.duplicateGProject(p.id, {
          name: name.value.trim(),
          copyTasks: $("#gcp-tasks", m).checked
        }, App.me.id);
        Modal.close();
        this.openId = copy.id;
        this.tab = "board";
        Router.push();
        App.render();
        Toast.show(`“${copy.name}” created`, {
          emoji: "copy"
        });
      };
    });
  },
  newProjectModal() {
    var COLORS = Object.keys(this.STAGE_C);
    Modal.open(`
      <header><h2>New project</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="field"><label>Project name</label><input class="input" id="gnp-name" placeholder="e.g. Website relaunch"></div>
        <div class="form-row">
          <div class="field"><label>Short key</label><input class="input" id="gnp-key" placeholder="WEB" maxlength="4" style="text-transform:uppercase"></div>
          <div class="field"><label>Colour</label><div class="row" id="gnp-colors" style="gap:6px;flex-wrap:wrap">
            ${COLORS.map((c, i) => `<span class="wb-swatch ${i === 0 ? "on" : ""}" data-c="${c}" style="background:${this.STAGE_C[c]}"></span>`).join("")}
          </div></div>
        </div>
        <div class="t-caption">Starts with Backlog · To do · In progress · In review · Done — fully editable after.</div>
      </div>
      <footer><button class="btn ghost" data-close>Cancel</button><button class="btn primary" id="gnp-create">Create project</button></footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var color = "blue";
      $$("[data-c]", modal).forEach(sw => sw.onclick = () => {
        color = sw.dataset.c;
        $$("[data-c]", modal).forEach(x => x.classList.toggle("on", x === sw));
      });
      var nameEl = $("#gnp-name", modal),
        keyEl = $("#gnp-key", modal);
      nameEl.oninput = () => {
        if (!keyEl.dataset.touched) keyEl.value = nameEl.value.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase();
      };
      keyEl.oninput = () => keyEl.dataset.touched = "1";
      var create = () => {
        var name = nameEl.value.trim();
        if (!name) {
          nameEl.focus();
          return;
        }
        var p = M.addGProject({
          name,
          key: keyEl.value.trim() || name.slice(0, 3),
          color
        }, App.me.id);
        Modal.close();
        this.openId = p.id;
        this.tab = "board";
        App.render();
        Toast.show(`Project “${name}” created`, {
          emoji: "sparkles"
        });
      };
      $("#gnp-create", modal).onclick = create;
      nameEl.onkeydown = e => {
        if (e.key === "Enter") create();
      };
    });
  },
  /* ---------- Stage menu ---------- */
  stageMenu(anchor, p, sid) {
    var st = D.gstage(p, sid);
    Popover.open(anchor, `
      <div class="opt-title">Column</div>
      <div class="opt-row"><span class="grow">Mark as “done” column</span>${switchHtml("done", st.done)}</div>
      <div class="opt-title">Colour</div>
      <div class="opt-row" style="flex-wrap:wrap;gap:6px">
        ${Object.keys(this.STAGE_C).map(c => `<span class="wb-swatch ${st.color === c ? "on" : ""}" data-sc="${c}" style="background:${this.STAGE_C[c]}"></span>`).join("")}
      </div>
      <div class="opt-sep"></div>
      <button class="opt-row" data-sm="left">${icon("arrow-up", 14)} Move left</button>
      <button class="opt-row" data-sm="right">${icon("arrow-down", 14)} Move right</button>
      <button class="opt-row danger" data-sm="del">${icon("trash", 14)} Delete column</button>
    `, pop => {
      $('[data-switch="done"]', pop).onclick = () => {
        M.updateGStage(p.id, sid, {
          done: !st.done
        });
        Popover.close();
        App.render();
      };
      $$("[data-sc]", pop).forEach(sw => sw.onclick = () => {
        M.updateGStage(p.id, sid, {
          color: sw.dataset.sc
        });
        Popover.close();
        App.render();
      });
      $$("[data-sm]", pop).forEach(b => b.onclick = () => {
        var a = b.dataset.sm;
        if (a === "left") M.moveGStage(p.id, sid, -1);
        if (a === "right") M.moveGStage(p.id, sid, 1);
        if (a === "del") {
          if (!M.deleteGStage(p.id, sid)) Toast.show("Keep at least one column", {
            emoji: "alert"
          });
        }
        Popover.close();
        App.render();
      });
    });
  },
  /* ================= task drawer ================= */
  openTask(pid, tid, focusTitle) {
    this.openId = this.openId || pid;
    this.taskId = tid;
    this._taskPid = pid;
    if (typeof Drawer !== "undefined") Drawer.orderId = null; // release the order drawer
    this.renderTaskDrawer(focusTitle);
  },
  closeTask() {
    this.taskId = null;
    var r = $("#drawer-root");
    if (r) r.innerHTML = "";
  },
  renderTaskDrawer(focusTitle) {
    var _D$member;
    var p = D.gproject(this._taskPid);
    var t = D.gtask(p, this.taskId);
    if (!p || !t) {
      this.closeTask();
      return;
    }
    var root = $("#drawer-root");
    var done = D.gTaskDone(p, t);
    var sub = D.gSubProgress(t);
    root.innerHTML = `<div class="drawer-scrim"></div><div class="drawer gtask-drawer">
      <header>
        <div class="head-row">
          <span class="pill" style="background:${this.STAGE_C[p.color]}22;color:${this.STAGE_C[p.color]}">${esc(p.key)}</span>
          <span class="grow"></span>
          <button class="icon-btn" id="gtd-del" title="Delete task">${icon("trash", 15)}</button>
          <button class="icon-btn" data-gtd-close>${icon("x", 15)}</button>
        </div>
        <div class="gtd-title-row">
          <button class="gt-check lg ${done ? "on" : ""}" id="gtd-done">${done ? icon("check", 15) : ""}</button>
          <textarea class="gtd-title" id="gtd-title" rows="1">${esc(t.title)}</textarea>
        </div>
      </header>
      <div class="drawer-body">
        <div class="meta-grid">
          <div class="meta-box"><span class="t-label">Status</span>
            <select id="gtd-stage">${p.stages.map(s => `<option value="${s.id}" ${t.stageId === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select>
          </div>
          <div class="meta-box"><span class="t-label">Assignee</span>
            <select id="gtd-assignee"><option value="">Unassigned</option>${Store.state.members.map(m => `<option value="${m.id}" ${t.assigneeId === m.id ? "selected" : ""}>${esc(m.name)}</option>`).join("")}</select>
          </div>
          <div class="meta-box"><span class="t-label">Due date</span><input type="date" id="gtd-due" value="${t.due ? new Date(t.due).toISOString().slice(0, 10) : ""}"></div>
          <div class="meta-box"><span class="t-label">Priority</span>
            <select id="gtd-prio">${["rush", "high", "normal", "low"].map(x => `<option value="${x}" ${t.priority === x ? "selected" : ""}>${x === "rush" ? "Rush" : x[0].toUpperCase() + x.slice(1)}</option>`).join("")}</select>
          </div>
        </div>

        ${p.labels && p.labels.length ? `<div><div class="t-label" style="margin-bottom:6px">Labels</div><div class="row" style="flex-wrap:wrap;gap:6px">
          ${p.labels.map(l => `<button class="glabel-pick ${(t.labelIds || []).includes(l.id) ? "on" : ""}" data-glabel="${l.id}" style="--lc:${this.STAGE_C[l.color]}">${esc(l.name)}</button>`).join("")}
        </div></div>` : ""}

        <div class="field"><label>Description</label><textarea class="input" id="gtd-desc" placeholder="Add more detail…" style="min-height:70px">${esc(t.desc || "")}</textarea></div>

        <div>
          <div class="t-label" style="margin-bottom:8px">Subtasks ${sub.total ? `· ${sub.done}/${sub.total}` : ""}</div>
          ${sub.total ? `<div class="progress" style="margin-bottom:8px"><i style="width:${Math.round(sub.done / sub.total * 100)}%"></i></div>` : ""}
          <div class="gsub-list">
            ${t.subtasks.map(s => `<div class="gsub"><button class="gt-check sm ${s.done ? "on" : ""}" data-gsub-done="${s.id}">${s.done ? icon("check", 11) : ""}</button><span class="grow ${s.done ? "gsub-done" : ""}">${esc(s.title)}</span><button class="mini-btn danger" data-gsub-del="${s.id}">${icon("x", 11)}</button></div>`).join("")}
          </div>
          <div class="gsub-add"><input class="input" id="gsub-input" placeholder="Add a subtask…"><button class="btn subtle" id="gsub-addbtn">${icon("plus", 12)} Add</button></div>
        </div>

        <div>
          <div class="t-label" style="margin-bottom:8px">Comments — @mention a teammate to notify them</div>
          <div class="ocomment-list">
            ${t.comments.map(c => commentRowHtml(c, {
      canDelete: App.isManager() || c.by === App.me.id
    })).join("") || `<span class="t-caption">No comments yet</span>`}
          </div>
          <div class="ocomment-add">${avatarHtml(App.me, "sm")}<input class="input" id="gc-input" placeholder="Write a comment — type @ to mention…" autocomplete="off"><button class="btn subtle" id="gc-addbtn">${icon("send", 13)}</button></div>
        </div>

        <div class="t-caption">Created by ${esc(((_D$member = D.member(t.createdBy)) === null || _D$member === void 0 ? void 0 : _D$member.name) || "?")} · ${fmtAgo(t.createdAt)}</div>
      </div>
    </div>`;
    var el = $(".drawer", root);
    $(".drawer-scrim", root).onclick = () => this.closeTask();
    $$("[data-gtd-close]", el).forEach(b => b.onclick = () => this.closeTask());
    var save = patch => {
      M.updateGTask(p.id, t.id, patch, App.me.id);
      App.render();
      this.renderTaskDrawer();
    };
    // title auto-grow + save
    var titleEl = $("#gtd-title", el);
    var grow = () => {
      titleEl.style.height = "auto";
      titleEl.style.height = titleEl.scrollHeight + "px";
    };
    grow();
    titleEl.oninput = grow;
    titleEl.onchange = () => M.updateGTask(p.id, t.id, {
      title: titleEl.value.trim() || t.title
    }, App.me.id);
    if (focusTitle) {
      titleEl.focus();
      titleEl.select();
    }
    $("#gtd-done", el).onclick = () => {
      this.toggleDone(p.id, t.id);
      this.renderTaskDrawer();
    };
    $("#gtd-stage", el).onchange = e => {
      M.placeGTask(p.id, t.id, e.target.value, null, App.me.id);
      App.render();
      this.renderTaskDrawer();
    };
    $("#gtd-assignee", el).onchange = e => save({
      assigneeId: e.target.value || null
    });
    $("#gtd-due", el).onchange = e => save({
      due: e.target.value ? new Date(e.target.value + "T12:00:00").getTime() : null
    });
    $("#gtd-prio", el).onchange = e => save({
      priority: e.target.value
    });
    $("#gtd-desc", el).onchange = e => M.updateGTask(p.id, t.id, {
      desc: e.target.value
    }, App.me.id);
    $$("[data-glabel]", el).forEach(b => b.onclick = () => {
      var ids = new Set(t.labelIds || []);
      var id = b.dataset.glabel;
      ids.has(id) ? ids.delete(id) : ids.add(id);
      M.updateGTask(p.id, t.id, {
        labelIds: [...ids]
      }, App.me.id);
      App.render();
      this.renderTaskDrawer();
    });
    $("#gtd-del", el).onclick = () => {
      var snap = Store.snapshot();
      M.deleteGTask(p.id, t.id);
      this.closeTask();
      App.render();
      Toast.show("Task deleted", {
        undo: () => {
          Store.restore(snap);
          App.render();
        }
      });
    };
    // subtasks
    $$("[data-gsub-done]", el).forEach(b => b.onclick = () => {
      M.toggleSubtask(p.id, t.id, b.dataset.gsubDone);
      App.render();
      this.renderTaskDrawer();
    });
    $$("[data-gsub-del]", el).forEach(b => b.onclick = () => {
      M.deleteSubtask(p.id, t.id, b.dataset.gsubDel);
      App.render();
      this.renderTaskDrawer();
    });
    var subIn = $("#gsub-input", el);
    var addSub = () => {
      var v = subIn.value.trim();
      if (!v) return;
      M.addSubtask(p.id, t.id, v);
      App.render();
      this.renderTaskDrawer();
      setTimeout(() => {
        var _$;
        return (_$ = $("#gsub-input")) === null || _$ === void 0 ? void 0 : _$.focus();
      }, 30);
    };
    $("#gsub-addbtn", el).onclick = addSub;
    subIn.onkeydown = e => {
      if (e.key === "Enter") addSub();
    };
    // comments
    var cIn = $("#gc-input", el);
    var addC = () => {
      var v = cIn.value.trim();
      if (!v) return;
      M.addGComment(p.id, t.id, v, App.me.id);
      cIn.value = "";
      App.render();
      this.renderTaskDrawer();
      var named = D.parseMentions(v).filter(id => id !== App.me.id).map(id => {
        var _D$member2;
        return (_D$member2 = D.member(id)) === null || _D$member2 === void 0 ? void 0 : _D$member2.name;
      }).filter(Boolean);
      if (named.length) Toast.show(`${named.join(", ")} notified`, {
        emoji: "bell"
      });
      setTimeout(() => {
        var _$2;
        return (_$2 = $("#gc-input")) === null || _$2 === void 0 ? void 0 : _$2.focus();
      }, 40);
    };
    Mentions.attach(cIn, addC);
    $$("[data-oc-del]", el).forEach(b => b.onclick = () => {
      t.comments = t.comments.filter(c => c.id !== b.dataset.ocDel);
      Store.save();
      this.renderTaskDrawer();
    });
    $("#gc-addbtn", el).onclick = addC; // Enter is handled by Mentions.attach (it may be picking a name)
  }
};