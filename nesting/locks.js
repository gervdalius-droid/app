/* ============================================================
   Nesting — one editor per project (hub/shared/project-lock.js)

   Projects are known by their name. Whenever the open project's name changes
   (start-up, Open, New, rename, import) this asks the database whether someone
   else is editing it. Until that is answered — and while only viewing —
   window.__nestRO is set and saveProject() saves nothing.
   Renaming while viewing = saving your own copy under the new name.
   ============================================================ */
(function () {
  "use strict";
  var PL = window.ProjectLock, W = window.WorkshopAuth;
  if (!PL || !W) return;
  var want = null;
  var lt = function () { return typeof _lang === "undefined" || _lang === "lt"; };
  function startupOpen() { var o = document.getElementById("startup-overlay"); return !!(o && o.classList.contains("open")); }
  function cur() { return typeof currentProjectName === "string" ? currentProjectName.trim() : ""; }

  var L = PL.create({
    app: "nesting",
    lang: function () { return lt() ? "lt" : "en"; },
    edit: function () {
      var dirty = window.__nestRODirty; window.__nestRO = null; window.__nestRODirty = false;
      if (typeof setStatus === "function") setStatus("", "");
      if (dirty && typeof saveProject === "function") saveProject();
    },
    view: function (who) { window.__nestRO = who || {}; },
    copy: function (name) {
      var base = (name || cur() || "Projektas") + (lt() ? " (kopija)" : " (copy)");
      (typeof listProjects === "function" ? listProjects() : Promise.resolve([])).catch(function () { return []; }).then(function (list) {
        var have = {}; (list || []).forEach(function (p) { have[p.name] = 1; });
        var nm = base, n = 2; while (have[nm]) { nm = base.replace(/\)$/, " " + n + ")"); n++; }
        window.__nestRO = null; window.__nestRODirty = false;
        currentProjectName = nm; want = nm;
        var pn = document.getElementById("projName"); if (pn) pn.value = nm;
        _lastSavedHash = "";
        L.open(nm, nm);
        if (typeof saveProject === "function") saveProject();
        if (typeof toast === "function") toast((lt() ? "Sukurta kopija: " : "Copy made: ") + nm);
        else if (typeof setStatus === "function") setStatus("saved", (lt() ? "Sukurta kopija: " : "Copy made: ") + nm);
      });
    },
    leave: function () {
      // keep it read-only until another project is chosen; the project picker opens
      window.__nestRO = window.__nestRO || {}; want = null;
      if (typeof showStartupModal === "function") showStartupModal();
    }
  });

  function tick() {
    if (startupOpen()) return;                       // choosing a project right now
    var id = cur();
    if (id === want) return;
    want = id;
    if (!id) { L.close(); window.__nestRO = null; return; }
    if (!W.signedIn()) { window.__nestRO = null; return; }
    window.__nestRO = { checking: true }; window.__nestRODirty = false;
    L.open(id, id);
  }
  setInterval(tick, 400);
  document.addEventListener("click", function () { setTimeout(tick, 0); }, true);
  W.onChange(function () { want = undefined; });
})();
