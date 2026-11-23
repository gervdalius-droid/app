/* ============================================================
   Pasiūlymai — one editor per offer (hub/shared/project-lock.js)

   An offer saved in the cloud is known by its name. When one is opened (or
   saved under a name), this asks the database whether someone else is
   editing it. While only viewing, window.__offerRO is set and saving under
   that same name is refused — saving under another name makes your own copy.
   ============================================================ */
(function () {
  "use strict";
  var PL = window.ProjectLock, W = window.WorkshopAuth;
  if (!PL || !W) return;
  var want = null, held = null;
  var lt = function () { return typeof LANG === "undefined" || LANG === "lt"; };
  function name() { try { return String(S.projectName || "").trim(); } catch (e) { return ""; } }
  function saved(nm) { try { return cloudCache.some(function (r) { return r.name === nm; }); } catch (e) { return false; } }
  function listOpen() { var m = document.getElementById("projModal"); return !!(m && m.classList.contains("on")); }

  var L = PL.create({
    app: "offers",
    lang: function () { return lt() ? "lt" : "en"; },
    edit: function () { window.__offerRO = null; },
    view: function (who) { var w = who || {}; w.project = held; window.__offerRO = w; },
    copy: function (nm) {
      var base = (nm || name()) + (lt() ? " (kopija)" : " (copy)"), n = 2, x = base;
      while (saved(x)) { x = base.replace(/\)$/, " " + n + ")"); n++; }
      window.__offerRO = null;
      S.projectName = x; var pn = document.getElementById("projName"); if (pn) pn.value = x;
      if (typeof saveProjectAs === "function") saveProjectAs(x, true);
    },
    leave: function () { want = null; if (typeof openProjects === "function") openProjects(); }
  });

  function tick() {
    if (listOpen()) return;                          // choosing an offer right now
    var nm = name(), id = nm && saved(nm) ? nm : null;   // only offers saved in the cloud (not a name being typed)
    if (id === want) return;
    want = id;
    if (!id) { L.close(); held = null; window.__offerRO = null; return; }
    if (!W.signedIn()) { window.__offerRO = null; return; }
    held = id;
    window.__offerRO = { checking: true, project: id };
    L.open(id, id);
  }
  setInterval(tick, 700);
  W.onChange(function () { want = undefined; });
})();
