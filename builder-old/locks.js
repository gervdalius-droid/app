/* ============================================================
   Spintelių kūrėjas — one editor per project (hub/shared/project-lock.js)

   Whatever way a project gets opened (the list, the last one at start-up,
   Back, a version restore, a new project), this notices it and asks the
   database whether someone else is editing it. Until that is answered — and
   for as long as the person only views it — S.ro is set, and the app saves
   nothing (save() / libSave() return early).
   The project list shows who has which project open right now.
   ============================================================ */
(function () {
  "use strict";
  var D = window.__dbk, PL = window.ProjectLock, W = window.WorkshopAuth;
  if (!D || !PL || !W || !D.openProject) return;
  var S = D.S, want = null, grantedAt = null;
  var lt = function () { return S.lang !== "en"; };
  function recOf(id) { var r = D.lib().filter(function (x) { return x.id === id; })[0]; return r || null; }
  function keepPlace(fn) { var t = S.tab, s = S.sel, k = S.picking; fn(); S.tab = t; S.sel = s; S.picking = k; }
  function ms(x) { var v = Date.parse(x || ""); return isNaN(v) ? 0 : v; }

  var L = PL.create({
    app: "builder",
    lang: function () { return S.lang; },
    edit: function () {
      var dirty = S.roDirty; S.ro = null; S.roDirty = false;
      if (dirty) D.saveNow();
      grantedAt = S.proj && S.proj.updated;
      D.render();
      // the newest copy from the cloud, if the last editor saved after this browser last synced
      if (window.BuilderCloud && S.proj) {
        var id = S.proj.id;
        window.BuilderCloud.sync().then(function () {
          if (!S.proj || S.proj.id !== id || S.ro || S.proj.updated !== grantedAt) return;   // already edited here: keep it
          var r = recOf(id);
          if (r && ms(r.updated) > ms(S.proj.updated)) { keepPlace(function () { D.openProject(r.data); }); D.render(); D.toast(lt() ? "Atnaujinta naujausia versija" : "Updated to the latest version"); }
        });
      }
    },
    view: function (who) { S.ro = who || {}; D.render(); },
    copy: function (id) {
      var src = S.proj && S.proj.id === id ? S.proj : (recOf(id) || {}).data;   // what is on screen (with any changes made while viewing)
      if (!src) { S.ro = null; S.home = true; D.render(); return; }
      var cp = JSON.parse(JSON.stringify(src));
      cp.id = D.uid(); cp.name = (cp.name || "") + (lt() ? " (kopija)" : " (copy)"); cp.updated = new Date().toISOString();
      S.ro = null; S.roDirty = false;
      keepPlace(function () { D.openProject(cp); });
      want = cp.id;
      D.libSaveNow(); D.render();
      L.open(cp.id, cp.name);
      D.toast(lt() ? "Sukurta kopija: " + cp.name : "Copy made: " + cp.name);
    },
    leave: function () { S.ro = null; S.roDirty = false; S.home = true; want = null; D.render(); }
  });

  function tick() {
    var id = !S.home && S.proj ? S.proj.id : null;
    if (id === want) return;
    want = id;
    if (!id) { L.close(); if (S.ro) { S.ro = null; S.roDirty = false; } return; }
    if (!W.signedIn()) { S.ro = null; return; }          // no account here: works as before (this browser only)
    S.ro = { checking: true }; S.roDirty = false;
    L.open(id, S.proj.name || "");
  }
  setInterval(tick, 400);
  document.addEventListener("click", function () { setTimeout(tick, 0); }, true);
  W.onChange(function () { want = undefined; tick(); });   // signed in / out: check again

  // while only viewing: follow the editor's saves (unless something was changed here)
  setInterval(function () {
    if (!S.ro || S.ro.checking || S.roDirty || !S.proj || S.home) return;
    var r = recOf(S.proj.id);
    if (r && ms(r.updated) > ms(S.proj.updated)) { var ro = S.ro; keepPlace(function () { D.openProject(r.data); }); S.ro = ro; D.render(); }
  }, 15000);

  // the project list: who has which project open right now
  var open = {}, listAt = 0, wasHome = false;
  function badges() {
    if (!S.home) return;
    document.querySelectorAll('.prow-main[data-act="popen"]').forEach(function (b) {
      var id = b.getAttribute("data-v"), who = open[id], el = b.querySelector(".pl-lk");
      if (!who) { if (el) el.remove(); return; }
      var txt = "🔒 " + (who.self ? (lt() ? "atidarytas kitur" : "open elsewhere") : who.name);
      if (!el) { el = document.createElement("span"); el.className = "badge pl-lk"; el.style.cssText = "margin-left:6px;background:#fff3d6;color:#5a4100;border:1px solid #e3c36b"; var bb = b.querySelector("b"); (bb || b).appendChild(el); }
      if (el.textContent !== txt) el.textContent = txt;
      el.title = lt() ? "Dabar redaguoja: " + (who.self ? "tu pats kitame lange" : who.name) : "Being edited by: " + (who.self ? "you, elsewhere" : who.name);
    });
  }
  function refreshList() {
    if (S.home && !wasHome) listAt = 0;          // back on the list: ask at once
    wasHome = !!S.home;
    if (!S.home || !W.signedIn() || Date.now() - listAt < 10000) return badges();
    listAt = Date.now();
    L.list().then(function (rows) {
      open = {};
      rows.forEach(function (r) { if (!(r.self && r.project === L.current)) open[r.project] = r; });
      badges();
    });
  }
  setInterval(refreshList, 1000);
  if (window.MutationObserver) new MutationObserver(function () { if (S.home) badges(); }).observe(document.body, { childList: true, subtree: true });
})();
