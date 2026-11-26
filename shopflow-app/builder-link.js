/* ============================================================
   builder-link.js — a project finished in Spintelių kūrėjas arrives here

   The builder (/builder/, Gamyba → "Į ShopFlow gamybą") leaves its report
   list — the same .xlsx as its "Detalių sąrašas", read like a SWOOD
   "Report Lists to Excel" export — in localStorage "dbShopflowHandoff" and
   opens /shopflow-app/?from=builder (kept 30 min). Once someone who may create projects
   is signed in, the usual SWOOD import opens with that file already read:
   check the name, client, date and lines, then "Create project" (or into
   the project ShopFlow suggests when one of that name is already here).
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
BuilderLink.boot();
