/* ============================================================
   builder-link.js — a project finished in Spintelių kūrėjas arrives here

   The builder (/builder/, Gamyba → "Į ShopFlow gamybą") leaves its report
   list — the same .xlsx as its "Detalių sąrašas", read like a SWOOD
   "Report Lists to Excel" export — in localStorage "dbShopflowHandoff" and
   opens /shopflow-app/?from=builder (kept 30 min). Once someone who may create projects
   is signed in, the usual SWOOD import opens with that file already read:
   check the name, client, date and lines, then "Create project" (or into
   the project ShopFlow suggests when one of that name is already here).

   The builder's drawing sheets come along (IndexedDB "db-handoff" → "drawings":
   the very SVG sheets of its "Brėžiniai", each with its cabinet's part names).
   When the project has been created or filled from this handoff, the sheets are
   attached to it as files (f.drw = {builderId, sheet, cab, cont, name, parts});
   sheets from an earlier handoff of the same builder project are replaced.
   The assembly station (assembly.js) opens the sheet of the scanned part's cabinet.
   ============================================================ */
"use strict";
var BuilderLink = {
  KEY: "dbShopflowHandoff",
  MAX_AGE: 30 * 60 * 1000,
  take() {
    var raw = null, h = null;
    try { raw = localStorage.getItem(this.KEY); } catch (e) { raw = null; }
    if (!raw) return null;
    try { h = JSON.parse(raw); } catch (e) { h = null; }
    if (!h || !h.b64 || Date.now() - (h.at || 0) > this.MAX_AGE) { this.drop(); return null; }
    return h;
  },
  drop() { try { localStorage.removeItem(this.KEY); } catch (e) {} },
  lt() { return typeof I18N === "undefined" || I18N.lang === "lt"; },
  boot() {
    var h = this.take(); if (!h) return;   // also after a sign-in that reloads the page (the ?from=builder is gone then)
    var tries = 0, wait = () => {   // after the sign-in, whenever that is
      var ready = typeof App !== "undefined" && App.me && typeof SwoodImport !== "undefined" && typeof Modal !== "undefined" && typeof D !== "undefined";
      if (!ready) { if (tries++ < 3600) setTimeout(wait, 500); return; }
      if (!App.can("orders.create")) {
        if (typeof Toast !== "undefined") Toast.show(this.lt() ? "Projektą iš Spintelių kūrėjo gali sukurti tik tas, kas kuria projektus — prisijunkite kaip vadovas." : "Only someone who creates projects can take a project from the cabinet builder — sign in as a manager.", { emoji: "alert", ms: 7000 });
        return;
      }
      this.drop();
      try { history.replaceState(null, "", location.pathname + location.hash); } catch (e) {}
      this.open(h);
      if (h.drawings) this.takeDrawings(h);
    };
    setTimeout(wait, 400);
  },
  open(h) {
    var bin = atob(h.b64), u8 = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
    var f = new File([u8], h.name || "ReportLists_to_Excel.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    SwoodImport.open(null);
    var m = document.querySelector(".sw-modal"); if (!m) return;
    var h2 = m.querySelector("header h2");
    if (h2) h2.textContent = (this.lt() ? "Į gamybą iš Spintelių kūrėjo · " : "To production from the cabinet builder · ") + (h.project || "");
    Promise.resolve(SwoodImport.load(f, m)).then(() => {   // the builder's own project name and client, when it has them
      if (!SwoodImport.form) return;
      var changed = false;
      if (h.project && !SwoodImport.target) { SwoodImport.form.name = h.project; changed = true; }
      if (h.client && !SwoodImport.form.client) { SwoodImport.form.client = h.client; changed = true; }
      if (changed) SwoodImport.render(m);
    });
  }
};
/* ---------- the drawing sheets ---------- */
BuilderLink.idb = function (mode, fn) {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) return reject(new Error("no IndexedDB"));
    var rq = indexedDB.open("db-handoff", 1);
    rq.onupgradeneeded = () => rq.result.createObjectStore("kv");
    rq.onerror = () => reject(rq.error);
    rq.onsuccess = () => {
      var db = rq.result, tx = db.transaction("kv", mode), out = fn(tx.objectStore("kv"));
      tx.oncomplete = () => { db.close(); resolve(out && "result" in out ? out.result : undefined); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    };
  });
};
BuilderLink.takeDrawings = function (h) {
  var t0 = Date.now() - 5000;
  this.idb("readonly", st => st.get("drawings")).then(v => {
    if (!v || !Array.isArray(v.sheets) || !v.sheets.length) return;
    if (h.builderId && v.project && v.project !== h.builderId) return;     // left over from another project
    var solids = {};
    v.sheets.forEach(sh => (sh.parts || []).forEach(n => { solids[String(n).toUpperCase()] = 1; }));
    var tries = 0, watch = () => {                                         // until the import has made (or filled) the project
      var o = (Store.state.orders || []).find(x => x.swood && x.swood.importedAt >= t0 &&
        (x.parts || []).some(p => solids[String(p.solid || "").toUpperCase()]));
      if (o) return this.attachDrawings(o, h.builderId || v.project || "", v.sheets, v.model);
      if (tries++ < 1800) setTimeout(watch, 1000);                         // 30 minutes to finish the import
    };
    watch();
  }).catch(e => console.warn("[builder-link] drawings", e));
};
BuilderLink.thumb = function (blob) {
  return new Promise(resolve => {
    var u = URL.createObjectURL(blob), img = new Image();
    img.onload = () => {
      try {
        var k = Math.min(1, 360 / Math.max(img.naturalWidth || 1, img.naturalHeight || 1)), cv = document.createElement("canvas");
        cv.width = Math.max(1, Math.round((img.naturalWidth || 420) * k)); cv.height = Math.max(1, Math.round((img.naturalHeight || 297) * k));
        var g = cv.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, cv.width, cv.height); g.drawImage(img, 0, 0, cv.width, cv.height);
        resolve({ w: img.naturalWidth || null, h: img.naturalHeight || null, thumb: cv.toDataURL("image/jpeg", 0.7) });
      } catch (e) { resolve({}); }
      URL.revokeObjectURL(u);
    };
    img.onerror = () => { URL.revokeObjectURL(u); resolve({}); };
    img.src = u;
  });
};
BuilderLink.attachDrawings = function (o, builderId, sheets, model) {
  var by = App.me && App.me.id;
  D.files().filter(f => f.orderId === o.id && f.drw && f.drw.builderId === builderId).forEach(f => {   // the previous handoff's sheets
    if (typeof Files !== "undefined" && Files.remove) Files.remove(f.id, by); else M.removeFile(f.id, by);
  });
  var n = 0, next = i => {
    if (i === sheets.length && Array.isArray(model) && model.length) {   // the cabinets in 3-D (the assembly station turns them round)
      var mb = new Blob([JSON.stringify({ v: 1, builderId: builderId, cabs: model })], { type: "application/json" }), mid = uid("f");
      return Files.putBlob(mid, mb).then(() => {
        M.addFileMeta({ id: mid, name: (this.lt() ? "3D modelis" : "3D model") + ".json", type: "application/json", size: mb.size, orderId: o.id, opId: null, path: Files.path(mid),
          store: Files.storage() ? "uploading" : "local", devices: [Files.deviceId()],
          drw: { builderId: builderId, model: true, cab: null, parts: [] } }, by);
        if (Files.storage()) Files.upload(mid, mb);
      }).catch(e => console.warn("[builder-link] 3-D model", e)).then(() => next(i + 1));
    }
    if (i >= sheets.length) {
      this.idb("readwrite", st => st.delete("drawings")).catch(() => {});
      if (typeof Toast !== "undefined") Toast.show((this.lt() ? "Pridėti brėžiniai iš Spintelių kūrėjo: " : "Drawings added from the cabinet builder: ") + n + " · " + o.num, { emoji: "📦" });
      if (typeof App !== "undefined") App.render();
      return;
    }
    var sh = sheets[i], blob = new Blob([sh.svg], { type: "image/svg+xml" }), id = uid("f");
    this.thumb(blob).then(t => Files.putBlob(id, blob).then(() => {
      M.addFileMeta({
        id, name: String(sh.title || ("Brėžinys " + (i + 1))).replace(/[\\/:*?"<>|]+/g, " ").trim() + ".svg", type: "image/svg+xml", size: blob.size,
        w: t.w || null, h: t.h || null, thumb: t.thumb || "", orderId: o.id, opId: null, path: Files.path(id),
        store: Files.storage() ? "uploading" : "local", devices: [Files.deviceId()],
        drw: { builderId: builderId, sheet: sh.id, cab: sh.cab == null ? null : sh.cab, cont: !!sh.cont, name: sh.name || "", parts: (sh.parts || []).slice(0, 400) }
      }, by);
      if (Files.storage()) Files.upload(id, blob);
      n++;
    })).catch(e => console.warn("[builder-link] sheet", sh.title, e)).then(() => next(i + 1));
  };
  next(0);
};
BuilderLink.boot();
