/* ============================================================
   Engineering flow after the client's changes (EngFlow)

     1. the engineer finishes the drawings and submits them for checking
     2. Ricardas or DB (any manager — one is enough) confirms them, or sends
        them back with remarks; the engineer is told either way
     3. confirmed → report list and CNC programs
     4. handoff: OneDrive folders ticked off, the report list attached — that
        makes the manufacturing project — and the technician is told it is
        ready to start
   Plain functions and Promises only — the shop tablets are old.
   ============================================================ */
"use strict";

var EngFlow = {
  /* what has to be in the project's OneDrive folder before production gets it */
  CHECKS: [
    ["drawings", "Drawings (PDF)", "Brėžiniai (PDF)", "Brėžiniai"],
    ["cnc", "CNC programs (.XXL)", "CNC programos (.XXL)", "CNC"],
    ["list", "Report list / labels", "Reportlist / etiketės", "Reportlist"],
    ["hw", "Hardware & purchase list", "Furnitūros ir užsakymų sąrašas", "Furnitūra"]
  ],
  _lt(en, lt) {
    return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
  },
  isReviewer() {
    return !!App.me && (App.me.role === "manager" || App.isManager());
  },
  canSubmit(o) {
    if (!App.me) return false;
    return App.me.role === "engineer" || App.isManager() || D.orderResponsible(o).indexOf(App.me.id) >= 0;
  },
  files(ids) {
    return (ids || []).map(id => D.file(id)).filter(Boolean);
  },

  /* two review rounds share one look: the design draft (vadyba checks it and
     sends it to the client) and the finished drawings (vadyba confirms them) */
  kinds() {
    var L = (en, lt) => this._lt(en, lt);
    return {
      draft: {
        list: o => M.draftReviews(o),
        okStatus: "sent",
        submit: (id, res) => M.submitDraft(id, res, App.me.id),
        review: (id, rid, ok, res) => M.reviewDraft(id, rid, ok, res, App.me.id),
        title: { pending: L("Design draft waiting for vadyba", "Eskizas laukia vadybos peržiūros"), sent: L("Design draft sent to the client", "Eskizas išsiųstas klientui"), remarks: L("Design draft returned with remarks", "Eskizas grąžintas su pastabomis") },
        okBy: L("Sent to the client by", "Klientui išsiuntė"),
        okBtn: L("Checked — sent to the client", "Peržiūrėta — išsiųsta klientui"),
        okToast: L("Marked as sent to the client — the engineer is told", "Pažymėta: išsiųsta klientui — inžinieriui pranešta"),
        next: L("Client's answer: add it as client corrections, or confirm the client approved.", "Kliento atsakymą įkelkite kaip kliento pataisas arba patvirtinkite, kad klientas patvirtino."),
        submitBtn: L("Upload a design draft for vadyba…", "Įkelti eskizą vadybai…"),
        resubmitBtn: L("Upload the corrected draft…", "Įkelti pataisytą eskizą…"),
        againBtn: L("Upload a new draft version…", "Įkelti naują eskizo versiją…"),
        modalTitle: L("Design draft for vadyba", "Eskizas vadybai"),
        filesLabel: L("The draft — PDF, renders, screenshots", "Eskizas — PDF, vizualizacijos, nuotraukos"),
        noteLabel: L("Note for vadyba (optional)", "Pastaba vadybai (nebūtina)"),
        sendLabel: L("Send to vadyba", "Siųsti vadybai"),
        sentToast: L("Sent to vadyba", "Išsiųsta vadybai"),
        remarksTitle: L("Remarks on the draft", "Pastabos eskizui")
      },
      draw: {
        list: o => M.drawReviews(o),
        okStatus: "ok",
        submit: (id, res) => M.submitDrawings(id, res, App.me.id),
        review: (id, rid, ok, res) => M.reviewDrawings(id, rid, ok, res, App.me.id),
        title: { pending: L("Drawings waiting for a check", "Brėžiniai laukia patikros"), ok: L("Drawings confirmed", "Brėžiniai patvirtinti"), remarks: L("Drawings returned with remarks", "Brėžiniai grąžinti su pastabomis") },
        okBy: L("Confirmed by", "Patvirtino"),
        okBtn: L("Confirm", "Patvirtinti"),
        okToast: L("Drawings confirmed — the engineer is told", "Brėžiniai patvirtinti — inžinieriui pranešta"),
        next: L("Next: report list and CNC programs, then hand off.", "Toliau: reportlist ir CNC programos, tada perdavimas."),
        submitBtn: L("Send drawings for checking…", "Pateikti brėžinius patikrai…"),
        resubmitBtn: L("Send corrected drawings for checking…", "Pateikti pataisytus brėžinius patikrai…"),
        againBtn: "",
        modalTitle: L("Send drawings for checking", "Pateikti brėžinius patikrai"),
        filesLabel: L("The drawings — PDF from the SolidWorks macro", "Brėžiniai — PDF iš SolidWorks makro"),
        noteLabel: L("Note for the check (optional)", "Pastaba tikrintojui (nebūtina)"),
        sendLabel: L("Send for checking", "Pateikti patikrai"),
        sentToast: L("Sent for checking", "Pateikta patikrai"),
        remarksTitle: L("Remarks on the drawings", "Pastabos brėžiniams")
      }
    };
  },

  /* chip on the board card — the drawings once they exist, else the draft */
  cardChip(o) {
    if (!o || o.type !== "eng" || o.archived) return "";
    var st = M.drawState(o);
    if (st === "pending") return `<div class="ef-chip wait">${icon("badge", 11)} ${esc(this._lt("Drawings to check", "Brėžiniai patikrai"))}</div>`;
    if (st === "remarks") return `<div class="ef-chip bad">${icon("alert", 11)} ${esc(this._lt("Drawings: remarks", "Brėžiniai: pastabos"))}</div>`;
    if (st === "ok") return `<div class="ef-chip ok">${icon("check", 11)} ${esc(this._lt("Drawings confirmed", "Brėžiniai patvirtinti"))}</div>`;
    var ds = M.draftState(o);
    if (ds === "pending") return `<div class="ef-chip wait">${icon("pencil", 11)} ${esc(this._lt("Draft for vadyba", "Eskizas vadybai"))}</div>`;
    if (ds === "remarks") return `<div class="ef-chip bad">${icon("alert", 11)} ${esc(this._lt("Draft: remarks", "Eskizas: pastabos"))}</div>`;
    if (ds === "sent") return `<div class="ef-chip ok">${icon("send", 11)} ${esc(this._lt("Draft at the client", "Eskizas pas klientą"))}</div>`;
    return "";
  },

  /* the block on the project panel */
  html(o) {
    if (!o || o.type !== "eng") return "";
    if (o.handedOffTo) {
      var p = D.order(o.handedOffTo);
      return p ? `<div class="ef-card ok"><div class="ef-head">${icon("factory", 15)} <b>${esc(this._lt("Handed off to production", "Perduota į gamybą"))}</b> <span class="grow"></span><button class="link" data-ef-open="${p.id}">${esc(p.num)} →</button></div></div>` : "";
    }
    var drawingsStarted = M.drawReviews(o).length > 0;
    /* once drawings are being checked the draft stage is over — its history stays */
    var out = this.sectionHtml(o, "draft", drawingsStarted) + this.sectionHtml(o, "draw", false);
    return out ? `<div class="ef-panel">${out}</div>` : "";
  },
  sectionHtml(o, kind, quiet) {
    var K = this.kinds()[kind];
    var all = K.list(o);
    var last = all[all.length - 1];
    var st = last ? last.status : "none";
    var out = "";
    if (last && !quiet) out += this.roundHtml(o, kind, last, true);
    if (!quiet && this.canSubmit(o) && !o.archived) {
      var label = st === "none" ? K.submitBtn : st === "remarks" ? K.resubmitBtn : st === K.okStatus ? K.againBtn : "";
      if (label) out += `<button class="btn ${st === "remarks" ? "primary" : "ghost"} project-link-btn" data-ef-submit="${kind}">${icon(kind === "draft" ? "pencil" : "send", 15)} ${esc(label)}</button>`;
    }
    var older = (quiet ? all : all.slice(0, -1)).slice().reverse();
    if (older.length) out += `<details class="rev-hist"><summary>${esc(kind === "draft" ? this._lt("Design drafts", "Eskizai") : this._lt("Earlier drawing versions", "Ankstesnės brėžinių versijos"))} (${older.length})</summary>${older.map(r => this.roundHtml(o, kind, r, false)).join("")}</details>`;
    return out;
  },
  roundHtml(o, kind, r, current) {
    var K = this.kinds()[kind];
    var by = D.member(r.by);
    var rv = r.reviewBy ? D.member(r.reviewBy) : null;
    var fs = this.files(r.files);
    var rfs = this.files(r.reviewFiles);
    var cls = r.status === K.okStatus ? "ok" : r.status === "remarks" ? "bad" : "wait";
    var acts = "";
    if (current && r.status === "pending" && this.isReviewer() && !o.archived) {
      acts = `<div class="rev-acts">
        <button class="btn primary sm" data-ef-ok="${kind}:${r.id}">${icon(kind === "draft" ? "send" : "check", 13)} ${esc(K.okBtn)}</button>
        <button class="btn ghost sm" data-ef-back="${kind}:${r.id}">${icon("pencil", 13)} ${esc(this._lt("Return with remarks…", "Grąžinti su pastabomis…"))}</button>
      </div>`;
    }
    if (current && r.status === K.okStatus && !o.archived) acts = `<div class="rev-acts"><span class="t-caption">${esc(K.next)}</span></div>`;
    return `<div class="ef-card ${current ? cls : ""}">
      <div class="ef-head">
        <b>${esc(K.title[r.status] || "")}</b> <span class="t-caption">v${r.n} · ${esc(by ? by.name : "")} · ${fmtAgo(r.at)}</span>
      </div>
      ${r.note ? `<div class="rev-note">${esc(r.note)}</div>` : ""}
      ${fs.length ? Files.chipsHtml(fs, { canEdit: false }) : ""}
      ${r.status !== "pending" ? `<div class="ef-answer">
        <div class="t-caption">${esc(r.status === K.okStatus ? K.okBy : this._lt("Remarks from", "Pastabos nuo"))} ${esc(rv ? rv.name : "")} · ${fmtAgo(r.reviewAt)}</div>
        ${r.reviewNote ? `<div class="rev-note">${esc(r.reviewNote)}</div>` : ""}
        ${rfs.length ? Files.chipsHtml(rfs, { canEdit: false }) : ""}
      </div>` : ""}
      ${acts}
    </div>`;
  },
  bind(el, o) {
    if (!o || o.type !== "eng") return;
    var redraw = () => {
      App.render();
      Drawer.refresh();
    };
    var kinds = this.kinds();
    $$(".ef-card", el).forEach(c => Files.bindChips(c, {}));
    $$("[data-ef-submit]", el).forEach(b => b.onclick = () => {
      var K = kinds[b.dataset.efSubmit];
      this.noteModal({
        title: K.modalTitle + " · " + o.num,
        noteLabel: K.noteLabel,
        filesLabel: K.filesLabel,
        needFile: true,
        who: M.reviewers().filter(id => id !== App.me.id),
        okLabel: K.sendLabel,
        orderId: o.id
      }).then(res => {
        if (!res) return;
        K.submit(o.id, res);
        Toast.show(K.sentToast, { emoji: "check" });
        redraw();
      });
    });
    $$("[data-ef-ok]", el).forEach(b => b.onclick = () => {
      var k = b.dataset.efOk.split(":");
      kinds[k[0]].review(o.id, k[1], true, {});
      Toast.show(kinds[k[0]].okToast, { emoji: "check" });
      redraw();
    });
    $$("[data-ef-back]", el).forEach(b => b.onclick = () => {
      var k = b.dataset.efBack.split(":");
      var K = kinds[k[0]];
      this.noteModal({
        title: K.remarksTitle + " · " + o.num,
        noteLabel: this._lt("What has to be fixed", "Ką reikia pataisyti"),
        filesLabel: this._lt("Marked-up PDF, screenshots (optional)", "PDF su pastabomis, nuotraukos (nebūtina)"),
        needNote: true,
        okLabel: this._lt("Return to the engineer", "Grąžinti inžinieriui"),
        orderId: o.id
      }).then(res => {
        if (!res) return;
        K.review(o.id, k[1], false, res);
        Toast.show(this._lt("Returned with remarks", "Grąžinta su pastabomis"), { emoji: "check" });
        redraw();
      });
    });
    $$("[data-ef-open]", el).forEach(b => b.onclick = () => Drawer.open(b.dataset.efOpen));
  },

  /* notes + files dialog; resolves {note, fileIds} or null */
  noteModal(opt) {
    return new Promise(resolve => {
      var picked = [];
      var done = false;
      var finish = v => {
        if (done) return;
        done = true;
        resolve(v);
      };
      var whoNames = (opt.who || []).map(id => (D.member(id) || {}).name).filter(Boolean);
      var list = () => picked.length ? `<div class="rev-picked">${picked.map((f, i) => `<span class="rev-pf">${icon("folder", 13)} ${esc(f.name)} <button class="link" data-unpick="${i}">${icon("x", 11)}</button></span>`).join("")}</div>` : "";
      Modal.open(`
        <header><h2>${esc(opt.title)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
        <div class="modal-body">
          <div class="field"><label>${esc(opt.filesLabel)}</label>
            ${Files.dropHtml("ef-in", this._lt("Add files", "Pridėti failus"))}
            <div id="ef-picked">${list()}</div>
          </div>
          <div class="field"><label>${esc(opt.noteLabel)}</label>
            <textarea class="input" id="ef-note" rows="5"></textarea>
          </div>
          ${whoNames.length ? `<div class="t-caption">${esc(this._lt("Will be notified: ", "Bus pranešta: ") + whoNames.join(", "))}</div>` : ""}
        </div>
        <footer>
          <button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button>
          <button class="btn primary" id="ef-save">${icon("send", 14)} <span>${esc(opt.okLabel)}</span></button>
        </footer>`, modal => {
        $$("[data-close]", modal).forEach(b => b.onclick = () => {
          Modal.close();
          finish(null);
        });
        var redrawList = () => {
          $("#ef-picked", modal).innerHTML = list();
          $$("[data-unpick]", modal).forEach(b => b.onclick = e => {
            e.preventDefault();
            picked.splice(+b.dataset.unpick, 1);
            redrawList();
          });
        };
        Files.bindDrop(modal, "ef-in", files => {
          files.forEach(f => picked.push(f));
          redrawList();
        });
        modal.addEventListener("drop", e => {
          if (!e.dataTransfer || !e.dataTransfer.files.length || e.defaultPrevented) return;
          e.preventDefault();
          [].slice.call(e.dataTransfer.files).forEach(f => picked.push(f));
          redrawList();
        });
        modal.addEventListener("dragover", e => e.preventDefault());
        var save = $("#ef-save", modal);
        save.onclick = () => {
          var note = $("#ef-note", modal).value;
          if (opt.needFile && !picked.length) {
            Toast.show(this._lt("Add the file", "Pridėkite failą"), { emoji: "alert" });
            return;
          }
          if (opt.needNote && !note.trim() && !picked.length) {
            Toast.show(this._lt("Write what has to be fixed", "Įrašykite, ką pataisyti"), { emoji: "alert" });
            return;
          }
          save.disabled = true;
          $("span", save).textContent = this._lt("Uploading…", "Įkeliama…");
          var ids = [], errs = [], queue = picked.slice();
          var next = () => {
            if (!queue.length) return Promise.resolve();
            var f = queue.shift();
            return Files.attach(f, { orderId: opt.orderId }, App.me.id).then(meta => { if (meta) ids.push(meta.id); }, err => { errs.push(f.name + ": " + (err && err.message || err)); }).then(next);
          };
          next().then(() => {
            Modal.close();
            if (errs.length) Toast.show(errs.join(" · "), { emoji: "alert", ms: 9000 });
            finish({ note: note, fileIds: ids });
          });
        };
      });
    });
  },

  /* handoff: OneDrive folders ticked, who to tell — then the report list */
  handoffModal(engId) {
    var eng = D.order(engId);
    if (!eng) return;
    var st = M.drawState(eng);
    var link = String(eng.oneDriveUrl || "").trim() || (D.projectLink ? D.projectLink(eng) : "");
    var prefs = Store.state.prefs && Store.state.prefs.handoffNotify;
    var people = Store.state.members.filter(m => !m.archived && m.id !== App.me.id);
    var pre = prefs && prefs.length ? prefs : people.filter(m => /^donatas/i.test(m.name)).map(m => m.id);
    var checks = {};
    var notify = new Set(pre.filter(id => people.some(m => m.id === id)));
    var override = false;
    var html = () => `
      <header><h2>${esc(this._lt("Hand off to production", "Perduoti į gamybą"))} · ${esc(eng.num)}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        ${st !== "ok" ? `<div class="ef-warn">${icon("alert", 15)} <span>${esc(st === "pending" ? this._lt("The drawings are still waiting for a check.", "Brėžiniai dar laukia patikros.") : st === "remarks" ? this._lt("The drawings were returned with remarks and not sent again.", "Brėžiniai grąžinti su pastabomis ir dar nepateikti iš naujo.") : this._lt("The drawings were never sent for checking.", "Brėžiniai nebuvo pateikti patikrai."))}</span>
          ${App.isManager() ? `<label class="rev-opt"><input type="checkbox" id="ef-override" ${override ? "checked" : ""}> <span>${esc(this._lt("Hand off anyway", "Perduoti vis tiek"))}</span></label>` : ""}</div>` : ""}
        <div class="field"><label>${esc(this._lt("In the project's OneDrive folder", "Projekto OneDrive aplanke"))}</label>
          ${link ? `<a class="btn ghost sm ef-od" href="${esc(link)}" target="_blank" rel="noopener">${icon("cloud", 14)} ${esc(this._lt("Open the OneDrive folder", "Atidaryti OneDrive aplanką"))}</a>` : `<div class="ef-warn">${icon("alert", 15)} <span>${esc(this._lt("This project has no OneDrive folder linked — link it first (cloud icon at the top).", "Projektui nesusietas OneDrive aplankas — pirmiausia susiekite (debesėlis viršuje)."))}</span></div>`}
          <div class="ef-checks">
            ${this.CHECKS.map(c => `<label class="ef-check ${checks[c[0]] ? "on" : ""}"><input type="checkbox" data-chk="${c[0]}" ${checks[c[0]] ? "checked" : ""}> <span><b>${esc(this._lt(c[1], c[2]))}</b> <span class="t-caption">→ ${esc(c[3])}</span></span></label>`).join("")}
          </div>
        </div>
        <div class="field"><label>${esc(this._lt("Tell when it is ready to start", "Pranešti, kad galima pradėti"))}</label>
          <div class="ef-people">${people.map(m => `<button class="ef-person ${notify.has(m.id) ? "on" : ""}" data-person="${m.id}">${avatarHtml(m, "sm")} ${esc(m.name)}</button>`).join("")}</div>
        </div>
        <div class="t-caption">${esc(this._lt("Next you attach the report list: it makes the manufacturing project with its parts, steps and materials, and this engineering project is archived.", "Toliau prisegsite reportlist: iš jo sukuriamas gamybos projektas su detalėmis, etapais ir medžiagomis, o šis projektavimo projektas archyvuojamas."))}</div>
      </div>
      <footer>
        <button class="btn ghost" data-close>${esc(this._lt("Cancel", "Atšaukti"))}</button>
        <button class="btn primary" id="ef-next">${icon("import", 14)} <span>${esc(this._lt("Attach the report list…", "Prisegti reportlist…"))}</span></button>
      </footer>`;
    var bind = modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => Modal.close());
      $$("[data-chk]", modal).forEach(c => c.onchange = () => {
        checks[c.dataset.chk] = c.checked;
        c.closest(".ef-check").classList.toggle("on", c.checked);
      });
      $$("[data-person]", modal).forEach(b => b.onclick = () => {
        var id = b.dataset.person;
        if (notify.has(id)) notify.delete(id); else notify.add(id);
        b.classList.toggle("on", notify.has(id));
      });
      var ov = $("#ef-override", modal);
      if (ov) ov.onchange = () => { override = ov.checked; };
      $("#ef-next", modal).onclick = () => {
        if (st !== "ok" && !override) {
          Toast.show(this._lt("The drawings have to be confirmed first", "Pirmiausia turi būti patvirtinti brėžiniai"), { emoji: "alert" });
          return;
        }
        var missing = this.CHECKS.filter(c => !checks[c[0]]);
        if (missing.length) {
          Toast.show(this._lt("Tick what is in OneDrive: ", "Pažymėkite, kas yra OneDrive: ") + missing.map(c => this._lt(c[1], c[2])).join(", "), { emoji: "alert", ms: 6000 });
          return;
        }
        if (!notify.size) {
          Toast.show(this._lt("Choose who to tell", "Pasirinkite, kam pranešti"), { emoji: "alert" });
          return;
        }
        var h = { checks: this.CHECKS.map(c => c[0]), notifyIds: [...notify] };
        Modal.close(true);
        SwoodImport.openHandoff(engId, h);
      };
    };
    Modal.open(html(), bind);
  },

  /* a worker's tablet has no bell — notifications for them show at the top of My Work */
  workerBanner() {
    if (!App.me) return "";
    var ns = (Store.state.notifications || []).filter(n => n.forId === App.me.id && !n.read).slice(0, 4);
    if (!ns.length) return "";
    return `<div class="ef-wnotes">${ns.map(n => `<div class="ef-wnote ${n.type === "handoff_ready" ? "go" : ""}">
      ${icon(n.type === "handoff_ready" ? "factory" : "bell", 18)}
      <span class="grow">${esc(n.text)}<span class="t-caption"> · ${fmtAgo(n.ts)}</span></span>
      <button class="btn ${n.type === "handoff_ready" ? "primary" : "ghost"} sm" data-wnote="${n.id}">${esc(this._lt("Got it", "Supratau"))}</button>
    </div>`).join("")}</div>`;
  },
  bindWorker(root) {
    $$("[data-wnote]", root).forEach(b => b.onclick = () => {
      M.markNotifRead(b.dataset.wnote);
      App.render();
    });
  }
};
