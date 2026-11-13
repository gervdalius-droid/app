/* ============================================================
   Client corrections on engineering projects (Kliento pataisos)
   The concept goes to the client, the client sends back a marked-up PDF and
   notes. Whoever receives it adds a round here: notes + files. The engineer on
   the project is notified, sees the round at the top of the project, downloads
   the files and takes it over.
   Plain functions and Promises only — the shop tablets are old.
   ============================================================ */
"use strict";

var Revisions = {
  _lt(en, lt) {
    return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
  },
  canAdd() {
    return App.can("orders.edit") || App.isManager();
  },
  canTake(o) {
    if (!App.me) return false;
    if (App.isManager()) return true;
    var r = App.me.role;
    return r === "engineer" || D.orderResponsible(o).indexOf(App.me.id) >= 0;
  },
  files(r) {
    return (r.files || []).map(id => D.file(id)).filter(Boolean);
  },

  /* little chip on a board card while a round waits to be taken over */
  cardChip(o) {
    if (!o || o.type !== "eng") return "";
    var open = M.openRevisions(o);
    if (!open.length) return "";
    var last = open[open.length - 1];
    return `<div class="rev-chip" title="${esc(this._lt("Client corrections waiting to be taken over", "Kliento pataisos laukia, kol bus perimtos"))}">${icon("pencil", 11)} ${esc(this._lt("Corrections", "Pataisos"))} #${last.n}</div>`;
  },

  /* the block on the project panel */
  html(o) {
    if (!o || o.type !== "eng") return "";
    var all = M.revisions(o);
    var open = all.filter(r => !r.takenAt);
    var done = all.filter(r => r.takenAt).slice().reverse();
    /* the round being worked on stays in view until the next one arrives */
    var current = !open.length && done.length ? [done.shift()] : [];
    var add = this.canAdd() ? `<button class="btn ghost project-link-btn" id="rev-add">${icon("pencil", 15)} ${esc(this._lt("Add client corrections…", "Pridėti kliento pataisas…"))}</button>` : "";
    var row = (r, isOpen) => {
      var by = D.member(r.by);
      var fs = this.files(r);
      var took = r.takenBy ? D.member(r.takenBy) : null;
      return `<div class="rev-card ${isOpen ? "open" : ""}" data-rev="${r.id}">
        <div class="rev-head">
          <b>${esc(this._lt("Client corrections", "Kliento pataisos"))} #${r.n}</b>
          <span class="t-caption">${esc(by ? by.name : "")} · ${fmtAgo(r.at)}</span>
          <span class="grow"></span>
          ${isOpen ? "" : `<span class="rev-took">${icon("check", 11)} ${esc(this._lt("taken over by", "perėmė"))} ${esc(took ? took.name : "")} ${fmtAgo(r.takenAt)}</span>`}
        </div>
        ${r.note ? `<div class="rev-note">${esc(r.note)}</div>` : ""}
        ${fs.length ? Files.chipsHtml(fs, { canEdit: false }) : ""}
        <div class="rev-acts">
          ${fs.length ? `<button class="btn ghost sm" data-rev-dl="${r.id}">${icon("import", 13)} ${esc(this._lt("Download all", "Atsisiųsti visus"))} (${fs.length})</button>` : ""}
          ${isOpen && this.canTake(o) ? `<button class="btn primary sm" data-rev-take="${r.id}">${icon("check", 13)} ${esc(this._lt("Take over", "Perimu"))}</button>` : ""}
          ${App.isManager() ? `<button class="link rev-rm" data-rev-rm="${r.id}">${esc(this._lt("Remove", "Pašalinti"))}</button>` : ""}
        </div>
      </div>`;
    };
    if (!all.length) return add;
    return `<div class="rev-panel">
      ${open.map(r => row(r, true)).join("")}
      ${current.map(r => row(r, false)).join("")}
      ${add}
      ${done.length ? `<details class="rev-hist"><summary>${esc(this._lt("Earlier corrections", "Ankstesnės pataisos"))} (${done.length})</summary>${done.map(r => row(r, false)).join("")}</details>` : ""}
    </div>`;
  },

  bind(el, o) {
    if (!o || o.type !== "eng") return;
    var redraw = () => {
      App.render();
      Drawer.refresh();
      if (typeof OrderDetail !== "undefined" && OrderDetail._sheetId === o.id) OrderDetail.refreshSheet();
    };
    var add = $("#rev-add", el);
    if (add) add.onclick = () => this.modal(o.id);
    $$(".rev-card", el).forEach(card => Files.bindChips(card, {}));
    $$("[data-rev-take]", el).forEach(b => b.onclick = () => {
      M.takeRevision(o.id, b.dataset.revTake, App.me.id);
      var r = M.revisions(o).find(x => x.id === b.dataset.revTake);
      if (r && this.files(r).length) this.download(r);
      Toast.show(this._lt("Corrections taken over", "Pataisos perimtos"), { emoji: "check" });
      redraw();
    });
    $$("[data-rev-dl]", el).forEach(b => b.onclick = () => {
      var r = M.revisions(o).find(x => x.id === b.dataset.revDl);
      if (r) this.download(r);
    });
    $$("[data-rev-rm]", el).forEach(b => b.onclick = () => {
      var r = M.revisions(o).find(x => x.id === b.dataset.revRm);
      var go = ok => { if (!ok) return; M.removeRevision(o.id, b.dataset.revRm, App.me.id); redraw(); };
      if (typeof Confirm !== "undefined") Confirm.ask({ title: this._lt("Remove corrections?", "Pašalinti pataisas?"), name: this._lt("Client corrections", "Kliento pataisos") + " #" + (r ? r.n : ""), note: this._lt("The files stay on the project.", "Failai liks projekte.") }).then(go);
      else go(confirm(this._lt("Remove this round of corrections?", "Pašalinti šias pataisas?")));
    });
  },

  /* every file of a round, one after another, under its own name */
  download(r) {
    var fs = this.files(r);
    var i = 0;
    var next = () => {
      if (i >= fs.length) return Promise.resolve();
      var f = fs[i++];
      return Promise.resolve(Files.url(f.id)).then(u => {
        if (!u) {
          Toast.show(this._lt("Not reachable from here: ", "Nepavyko atsisiųsti: ") + f.name, { emoji: "alert", ms: 6000 });
          return;
        }
        var a = document.createElement("a");
        a.href = u;
        a.download = f.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }).catch(() => {}).then(() => new Promise(res => setTimeout(res, 350))).then(next);
    };
    return next();
  },

  /* adding a round: notes, files (PDF, emails, photos), and whether the design
     step opens again */
  modal(orderId) {
    var o = D.order(orderId);
    if (!o) return;
    var picked = [];
    var design = o.ops.find(op => op.stationId === "eg-design");
    var canReopen = !!(design && design.status === "done");
    var n = M.revisions(o).length + 1;
    var targets = D.orderResponsible(o);
    if (!targets.length) targets = D.projectEngineers(o);
    var names = targets.filter(id => id !== App.me.id).map(id => (D.member(id) || {}).name).filter(Boolean);
    var fileList = () => picked.length ? `<div class="rev-picked">${picked.map((f, i) => `<span class="rev-pf">${icon("folder", 13)} ${esc(f.name)} <button class="link" data-unpick="${i}">${icon("x", 11)}</button></span>`).join("")}</div>` : "";
    Modal.open(`
      <header><h2>${esc(this._lt("Client corrections", "Kliento pataisos"))} #${n} · ${esc(o.num)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="field"><label>${esc(this._lt("What the client wants changed", "Ką klientas nori pakeisti"))}</label>
          <textarea class="input" id="rev-note" rows="6" placeholder="${esc(this._lt("e.g. Move the oven column to the left wall, handles black, drawer under the sink…", "pvz. Orkaitės koloną perkelti prie kairės sienos, rankenos juodos, stalčius po kriaukle…"))}"></textarea>
        </div>
        <div class="field"><label>${esc(this._lt("Files from the client — marked-up PDF, emails, photos", "Kliento failai — PDF su pastabomis, laiškai, nuotraukos"))}</label>
          ${Files.dropHtml("rev-in", this._lt("Add files", "Pridėti failus"))}
          <div id="rev-picked">${fileList()}</div>
        </div>
        ${canReopen ? `<label class="rev-opt"><input type="checkbox" id="rev-reopen" checked> <span>${esc(this._lt("Reopen “Design & Drawings” — the engineer has to redraw", "Atidaryti „Projektavimas ir brėžiniai“ iš naujo — inžinierius turi perbraižyti"))}</span></label>` : ""}
        <div class="t-caption">${names.length ? esc(this._lt("Will be notified: ", "Bus pranešta: ") + names.join(", ")) : esc(this._lt("Nobody is assigned to this project yet — all engineers will be notified.", "Projektui dar niekas nepriskirtas — bus pranešta visiems inžinieriams."))}</div>
      </div>
      <footer>
        <button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button>
        <button class="btn primary" id="rev-save">${icon("send", 14)} <span>${esc(this._lt("Save and notify", "Išsaugoti ir pranešti"))}</span></button>
      </footer>
    `, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      var redrawList = () => {
        $("#rev-picked", modal).innerHTML = fileList();
        $$("[data-unpick]", modal).forEach(b => b.onclick = e => {
          e.preventDefault();
          picked.splice(+b.dataset.unpick, 1);
          redrawList();
        });
      };
      Files.bindDrop(modal, "rev-in", files => {
        files.forEach(f => picked.push(f));
        redrawList();
      });
      /* the page-wide project drop would attach straight to the project — inside
         this dialog, a dropped file belongs to the round */
      modal.addEventListener("drop", e => {
        if (!e.dataTransfer || !e.dataTransfer.files.length || e.defaultPrevented) return;
        e.preventDefault();
        [].slice.call(e.dataTransfer.files).forEach(f => picked.push(f));
        redrawList();
      });
      modal.addEventListener("dragover", e => e.preventDefault());
      var save = $("#rev-save", modal);
      save.onclick = () => {
        var note = $("#rev-note", modal).value;
        if (!note.trim() && !picked.length) {
          Toast.show(this._lt("Add a note or a file", "Įrašykite pastabą arba pridėkite failą"), { emoji: "alert" });
          return;
        }
        save.disabled = true;
        $("span", save).textContent = this._lt("Uploading…", "Įkeliama…");
        var ids = [], errs = [];
        var list = picked.slice();
        var next = () => {
          if (!list.length) return Promise.resolve();
          var f = list.shift();
          return Files.attach(f, { orderId: o.id }, App.me.id).then(meta => { if (meta) ids.push(meta.id); }, err => { errs.push(f.name + ": " + (err && err.message || err)); }).then(next);
        };
        next().then(() => {
          var reopen = $("#rev-reopen", modal);
          var r = M.addRevision(o.id, { note: note, fileIds: ids, reopen: !!(reopen && reopen.checked) }, App.me.id);
          Modal.close();
          App.render();
          Drawer.refresh();
          if (typeof OrderDetail !== "undefined" && OrderDetail._sheetId === o.id) OrderDetail.refreshSheet();
          var who = (r.notified || []).map(id => (D.member(id) || {}).name).filter(Boolean);
          Toast.show(this._lt("Corrections saved", "Pataisos išsaugotos") + (who.length ? " — " + this._lt("notified ", "pranešta: ") + who.join(", ") : ""), { emoji: "check", ms: 4500 });
          if (errs.length) Toast.show(errs.join(" · "), { emoji: "alert", ms: 9000 });
        });
      };
    });
  }
};
