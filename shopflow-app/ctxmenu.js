/* ============================================================
   Right-click menu (Dešinio pelės klavišo meniu)
   Right-click a project card, a material line on a card, a job row on the
   board or the open project panel, and the things people look for most are
   right there: report a problem (block), clear it, urgent, a remark, a missing
   detail, a file, the due date, who does the step. On a tablet the same menu
   comes up on a long press.
   Plain functions and Promises only — the shop tablets are old.
   ============================================================ */
"use strict";

var CtxMenu = {
  _el: null,
  _lt(en, lt) {
    return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
  },

  init() {
    if (this._ready) return;
    this._ready = true;
    document.addEventListener("contextmenu", e => {
      var t = this.targetOf(e.target);
      if (!t) return;
      e.preventDefault();
      this.open(t, e.clientX, e.clientY);
    });
    /* long press on touch screens */
    var timer = null, sx = 0, sy = 0;
    document.addEventListener("touchstart", e => {
      if (e.touches.length !== 1) return;
      var t = this.targetOf(e.target);
      if (!t) return;
      sx = e.touches[0].clientX;
      sy = e.touches[0].clientY;
      timer = setTimeout(() => {
        timer = null;
        this.open(t, sx, sy);
        if (navigator.vibrate) navigator.vibrate(15);
      }, 600);
    }, { passive: true });
    var cancel = e => {
      if (!timer) return;
      if (e.type === "touchmove" && e.touches[0] && Math.abs(e.touches[0].clientX - sx) + Math.abs(e.touches[0].clientY - sy) < 10) return;
      clearTimeout(timer);
      timer = null;
    };
    document.addEventListener("touchmove", cancel, { passive: true });
    document.addEventListener("touchend", cancel, { passive: true });
    document.addEventListener("mousedown", e => { if (this._el && !this._el.contains(e.target)) this.close(); }, true);
    document.addEventListener("keydown", e => { if (e.key === "Escape") this.close(); });
    window.addEventListener("blur", () => this.close());
    window.addEventListener("resize", () => this.close());
    /* a real scroll closes it — not the nudge the browser gives right after the click */
    document.addEventListener("scroll", e => {
      if (!this._el || Date.now() - this._at < 400 || this._el.contains(e.target)) return;
      this.close();
    }, true);
  },

  /* what was clicked: {orderId, opId?} */
  targetOf(node) {
    if (!node || !node.closest || !App.me) return null;
    if (node.closest("input, textarea, select, [contenteditable], .modal, .ctx-menu")) return null; // keep copy/paste there
    var line = node.closest(".oc-line[data-op]");
    if (line) return { orderId: line.dataset.order, opId: line.dataset.op };
    var card = node.closest(".order-card[data-order]");
    if (card) return { orderId: card.dataset.order, opId: card.dataset.op || null };
    var step = node.closest("[data-op-row], .op-row[data-op]");
    if (step && Drawer.orderId) return { orderId: Drawer.orderId, opId: step.dataset.opRow || step.dataset.op };
    var row = node.closest("[data-order]");
    if (row && D.order(row.dataset.order)) return { orderId: row.dataset.order, opId: null };
    if (node.closest(".drawer") && Drawer.orderId) return { orderId: Drawer.orderId, opId: null };
    return null;
  },

  /* the step a project-level click acts on: the one being worked on, else the next one */
  stepFor(o, opId) {
    if (opId) return o.ops.find(x => x.id === opId) || null;
    var act = D.activeOps(o);
    return act.find(x => x.status === "blocked") || act.find(x => x.status === "running") || act[0] || null;
  },

  items(t) {
    var o = D.order(t.orderId);
    if (!o) return [];
    var op = this.stepFor(o, t.opId);
    var st = op ? D.station(op.stationId) : null;
    var stName = st ? (typeof I18N !== "undefined" ? I18N.t(st.name) : st.name) : "";
    var L = (en, lt) => this._lt(en, lt);
    var can = p => App.can ? App.can(p) : true;
    var out = [];
    out.push({ head: true, text: `${o.num} · ${o.product}`, sub: stName });
    if (op && op.status !== "done") {
      if (op.status === "blocked") {
        out.push({ ic: "check", text: L("Problem solved", "Problema išspręsta"), cls: "good", run: () => {
          M.unblockOp(o.id, op.id, App.me.id);
          this.after(L("Unblocked — back in the queue", "Atblokuota — vėl eilėje"));
        } });
        out.push({ ic: "pencil", text: L("Edit the problem…", "Redaguoti problemą…"), run: () => OrderDetail.blockDialog(o.id, op.id) });
      } else {
        out.push({ ic: "ban", text: L("Report a problem (block)…", "Pažymėti problemą (blokuoti)…"), cls: "bad", run: () => OrderDetail.blockDialog(o.id, op.id) });
      }
      if (op.status === "running") out.push({ ic: "pause", text: L("Pause this step", "Pristabdyti etapą"), run: () => { M.pauseOp(o.id, op.id, App.me.id); this.after(); } });
      else if (op.status !== "blocked") out.push({ ic: "play", text: L("Start this step", "Pradėti etapą"), run: () => { M.startOp(o.id, op.id, App.me.id); this.after(); } });
      if (can("orders.edit")) out.push({ ic: "users", text: L("Who does this step…", "Kas atlieka etapą…"), run: () => this.assignModal(o, op) });
      var inst = D.readyBeforeStation && D.readyBeforeStation();
      if (inst && op.stationId === inst.id && op.status === "queued" && !(op.qtyDone > 0) && can("orders.edit")) {
        if (op.onSite) out.push({ ic: "check-circle", text: L("Back to Ready (not started)", "Grąžinti į Paruošta"), run: () => { M.setOnSite(o.id, false, App.me.id); this.after(); } });
        else out.push({ ic: "truck", text: L("Installation started (no timer)", "Montavimas pradėtas (be laiko)"), run: () => { M.setOnSite(o.id, true, App.me.id); this.after(); } });
      }
    }
    var inst0 = D.readyBeforeStation && D.readyBeforeStation();
    if (inst0 && !o.ops.some(x => x.stationId === inst0.id) && can("orders.edit")) out.push({ ic: "truck", text: L("Send to installation", "Perduoti montavimui"), run: () => { M.addInstallStep(o.id, App.me.id); M.setOnSite(o.id, true, App.me.id); this.after(); } });
    out.push({ sep: true });
    var urgent = o.priority === "rush";
    if (can("orders.edit")) out.push({ ic: "flame", text: urgent ? L("Not urgent any more", "Nebeskubu") : L("Mark urgent", "Skubu"), cls: urgent ? "" : "bad", run: () => {
      M.updateOrderLogged(o.id, { priority: urgent ? "normal" : "rush" }, App.me.id);
      this.after(urgent ? L("No longer urgent", "Nebeskubus") : L("Marked urgent", "Pažymėta: skubu"));
    } });
    out.push({ ic: "send", text: L("Write a remark…", "Rašyti pastabą…"), run: () => this.remarkModal(o) });
    if (can("orders.edit")) out.push({ ic: "box", text: L("Missing detail / to order…", "Trūksta detalės / užsakyti…"), run: () => this.detailModal(o) });
    out.push({ ic: "folder", text: L("Attach a file…", "Prisegti failą…"), run: () => this.attach(o) });
    if (can("orders.edit")) out.push({ ic: "calendar", text: L("Change the due date…", "Keisti terminą…"), run: () => this.dueModal(o) });
    out.push({ sep: true });
    out.push({ ic: "eye", text: L("Open the project", "Atidaryti projektą"), run: () => Drawer.open(o.id) });
    if (typeof OrderDetail !== "undefined" && OrderDetail.sheetModal) out.push({ ic: "layers", text: L("Project card", "Projekto kortelė"), run: () => OrderDetail.sheetModal(o.id) });
    var link = o.oneDriveUrl || (D.projectLink ? D.projectLink(o) : "");
    if (link) out.push({ ic: "cloud", text: L("Open OneDrive folder", "Atidaryti OneDrive aplanką"), run: () => window.open(link, "_blank", "noopener") });
    return out;
  },

  open(t, x, y) {
    this.close();
    var items = this.items(t);
    if (!items.length) return;
    var el = document.createElement("div");
    el.className = "ctx-menu";
    el.innerHTML = items.map((it, i) => it.head
      ? `<div class="ctx-head"><b>${esc(it.text)}</b>${it.sub ? `<span>${esc(it.sub)}</span>` : ""}</div>`
      : it.sep ? `<div class="ctx-sep"></div>`
      : `<button class="ctx-item ${it.cls || ""}" data-i="${i}">${icon(it.ic, 15)}<span>${esc(it.text)}</span></button>`).join("");
    document.body.appendChild(el);
    this._el = el;
    this._at = Date.now();
    var w = el.offsetWidth, h = el.offsetHeight;
    el.style.left = Math.max(6, Math.min(x, window.innerWidth - w - 6)) + "px";
    el.style.top = Math.max(6, Math.min(y, window.innerHeight - h - 6)) + "px";
    $$(".ctx-item", el).forEach(b => b.onclick = e => {
      e.stopPropagation();
      var it = items[+b.dataset.i];
      this.close();
      if (it && it.run) it.run();
    });
  },
  close() {
    if (this._el) this._el.remove();
    this._el = null;
  },
  after(msg) {
    App.render();
    Drawer.refresh();
    if (msg) Toast.show(msg, { emoji: "check" });
  },

  /* ---- small dialogs ---- */
  remarkModal(o) {
    Modal.open(`
      <header><h2>${esc(this._lt("Remark", "Pastaba"))} · ${esc(o.num)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <textarea class="input" id="cx-text" rows="4" placeholder="${esc(this._lt("Everyone on this project is told. @name to tell someone else.", "Pranešama visiems projekto žmonėms. @vardas — kitam žmogui."))}"></textarea>
      </div>
      <footer><button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button><button class="btn primary" id="cx-ok">${icon("send", 13)} ${esc(this._lt("Send", "Siųsti"))}</button></footer>`, m => {
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      var ta = $("#cx-text", m);
      var go = () => {
        if (!ta.value.trim()) return;
        M.addOrderComment(o.id, ta.value, App.me.id);
        Modal.close();
        this.after(this._lt("Remark sent", "Pastaba išsiųsta"));
      };
      $("#cx-ok", m).onclick = go;
      ta.onkeydown = e => { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) go(); };
      setTimeout(() => ta.focus(), 60);
    });
  },
  detailModal(o) {
    var cats = D.DETAIL_CATS || [];
    Modal.open(`
      <header><h2>${esc(this._lt("Missing detail", "Trūkstama detalė"))} · ${esc(o.num)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="field"><label>${esc(this._lt("What is missing / has to be ordered", "Ko trūksta / ką užsakyti"))}</label>
          <input class="input" id="cx-dt" placeholder="${esc(this._lt("e.g. 4 hinges Blum 110°, handle 320 mm black", "pvz. 4 lankstai Blum 110°, rankena 320 mm juoda"))}"></div>
        ${cats.length ? `<div class="field"><label>${esc(this._lt("Kind", "Tipas"))}</label><select class="input" id="cx-cat">${cats.map(c => `<option value="${esc(c.id)}">${esc(typeof I18N !== "undefined" ? I18N.t(c.label || c.name || c.id) : c.label || c.id)}</option>`).join("")}</select></div>` : ""}
      </div>
      <footer><button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button><button class="btn primary" id="cx-ok">${icon("plus", 13)} ${esc(this._lt("Add", "Pridėti"))}</button></footer>`, m => {
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      var inp = $("#cx-dt", m);
      var go = () => {
        var label = inp.value.trim();
        if (!label) return;
        var cat = $("#cx-cat", m);
        M.addDetail(o.id, { label: label, state: "need", cat: cat ? cat.value : undefined }, App.me.id);
        Modal.close();
        this.after(this._lt("Added to the project's details", "Pridėta prie projekto detalių"));
      };
      $("#cx-ok", m).onclick = go;
      inp.onkeydown = e => { if (e.key === "Enter") go(); };
      setTimeout(() => inp.focus(), 60);
    });
  },
  dueModal(o) {
    var cur = o.due ? new Date(o.due).toISOString().slice(0, 10) : "";
    Modal.open(`
      <header><h2>${esc(this._lt("Due date", "Terminas"))} · ${esc(o.num)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body"><input class="input" type="date" id="cx-due" value="${cur}"></div>
      <footer><button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button><button class="btn primary" id="cx-ok">${icon("check", 13)} ${esc(this._lt("Save", "Išsaugoti"))}</button></footer>`, m => {
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      $("#cx-ok", m).onclick = () => {
        var v = $("#cx-due", m).value;
        if (!v) return;
        M.updateOrderLogged(o.id, { due: new Date(v + "T12:00:00").getTime() }, App.me.id);
        Modal.close();
        this.after(this._lt("Due date changed", "Terminas pakeistas"));
      };
    });
  },
  assignModal(o, op) {
    var people = Store.state.members.filter(m => !m.archived);
    var cur = new Set(op.assigneeIds || (op.assigneeId ? [op.assigneeId] : []));
    var st = D.station(op.stationId);
    Modal.open(`
      <header><h2>${esc(this._lt("Who does it", "Kas atlieka"))} · ${esc(st ? (typeof I18N !== "undefined" ? I18N.t(st.name) : st.name) : "")}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body"><div class="ef-people">${people.map(m => `<button class="ef-person ${cur.has(m.id) ? "on" : ""}" data-p="${m.id}">${avatarHtml(m, "sm")} ${esc(m.name)}</button>`).join("")}</div></div>
      <footer><button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button><button class="btn primary" id="cx-ok">${icon("check", 13)} ${esc(this._lt("Save", "Išsaugoti"))}</button></footer>`, m => {
      $$("[data-close]", m).forEach(b => b.onclick = () => Modal.close());
      $$("[data-p]", m).forEach(b => b.onclick = () => {
        var id = b.dataset.p;
        if (cur.has(id)) cur.delete(id); else cur.add(id);
        b.classList.toggle("on", cur.has(id));
      });
      $("#cx-ok", m).onclick = () => {
        M.setOpAssignees(o.id, op.id, [...cur], App.me.id);
        Modal.close();
        this.after(this._lt("Saved", "Išsaugota"));
      };
    });
  },
  attach(o) {
    var inp = document.createElement("input");
    inp.type = "file";
    inp.multiple = true;
    inp.onchange = () => {
      var files = [].slice.call(inp.files || []);
      if (!files.length) return;
      var add = typeof ProjectFiles !== "undefined" && ProjectFiles.add ? ProjectFiles.add(o, files) : Promise.all(files.map(f => Files.attach(f, { orderId: o.id }, App.me.id)));
      Promise.resolve(add).then(() => this.after(this._lt("Attached", "Prisegta") + ` · ${files.length}`), err => Toast.show(String(err && err.message || err), { emoji: "alert" }));
    };
    inp.click();
  }
};

CtxMenu.init();
