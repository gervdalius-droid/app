/* ============================================================
   Dėdės Baldai — one editor per project (Spintelių kūrėjas, Nesting, Pasiūlymai).
   Load after workshop-auth.js:  <script src="/hub/shared/project-lock.js"></script>

   When a project opens, the app asks the database (0019_project_locks.sql)
   to take it for editing. If someone else has it open, the person chooses:
     Tik peržiūrėti  — see it, nothing is saved
     Daryti kopiją   — a new project from this one (use it as a template)
     Perimti         — edit here; the other person's app stops saving and says so
     Atgal           — back to the project list
   While open, the app confirms every 40 s that it still is; a closed tab or a
   sleeping computer frees the project within 2 minutes.
   Without internet or sign-in nothing is blocked (work goes on as before).

     var L = ProjectLock.create({
       app: "builder",                  // builder | nesting | offers
       lang: function () { return "lt"; },
       edit:  function () {},           // you may save again
       view:  function (who) {},        // read-only: do not save
       copy:  function () {},           // make a copy, open it (then call L.open for it)
       leave: function () {}            // back to the list
     });
     L.open(projectId, "Title")  → Promise "edit" | "view" | "copy" | "leave"
     L.close()                   // project closed / another one opened
     L.list()                    → Promise [{project, name, self}] open right now
   Written in ES5 so it runs on old workshop tablets too.
   ============================================================ */
(function () {
  "use strict";
  if (window.ProjectLock) return;
  var BEAT = 40000;

  function device() {
    var k = "hub.lockdev.v1", v = null;
    try { v = sessionStorage.getItem(k); } catch (e) {}
    if (!v || v.length < 8) {
      v = "d" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
      try { sessionStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }
  var DEV = device();
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function hm(iso) { var d = new Date(iso); return isNaN(d) ? "" : ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2); }
  function ago(s, lt) { s = +s || 0; if (s < 60) return lt ? "ką tik" : "just now"; var m = Math.round(s / 60); return lt ? "prieš " + m + " min." : m + " min ago"; }

  /* ---------- look ---------- */
  var CSS =
    ".pl-bg{position:fixed;inset:0;z-index:2147483000;background:rgba(15,18,17,.55);display:flex;align-items:center;justify-content:center;padding:16px;font:15px/1.45 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased}" +
    ".pl-card{--pl-s:#f8f9f6;--pl-i:#131715;--pl-m:#59615b;--pl-l:#d2d7cf;--pl-f:#fff;--pl-a:#ff4a1c;background:var(--pl-s);color:var(--pl-i);width:100%;max-width:440px;border-radius:14px;padding:22px;box-shadow:0 24px 48px -20px rgba(0,0,0,.6);display:flex;flex-direction:column;gap:12px;max-height:calc(100vh - 32px);overflow:auto}" +
    ".pl-card h2{margin:0;font-size:20px;line-height:1.2;font-weight:800;letter-spacing:-.015em}" +
    ".pl-card p{margin:0;color:var(--pl-m);font-size:14px}.pl-card p b{color:var(--pl-i)}" +
    ".pl-card .pl-who{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid var(--pl-l);border-radius:10px;background:var(--pl-f)}" +
    ".pl-card .pl-dot{width:10px;height:10px;border-radius:50%;background:#2e9b5a;flex:none;box-shadow:0 0 0 3px rgba(46,155,90,.18)}" +
    ".pl-card .pl-dot.idle{background:#c99a14;box-shadow:0 0 0 3px rgba(201,154,20,.18)}" +
    ".pl-opts{display:flex;flex-direction:column;gap:8px;margin-top:2px}" +
    ".pl-opt{display:flex;flex-direction:column;align-items:flex-start;gap:1px;text-align:left;width:100%;min-height:52px;padding:10px 14px;border:1px solid var(--pl-l);border-radius:10px;background:var(--pl-f);color:var(--pl-i);font:inherit;cursor:pointer}" +
    ".pl-opt b{font-size:15px}.pl-opt span{font-size:12.5px;color:var(--pl-m)}" +
    ".pl-opt:hover{border-color:var(--pl-i)}.pl-opt:focus-visible{outline:3px solid var(--pl-a);outline-offset:1px}" +
    ".pl-opt.main{background:var(--pl-i);color:var(--pl-s);border-color:var(--pl-i)}.pl-opt.main span{color:inherit;opacity:.75}" +
    ".pl-opt.warn b{color:#b7321a}" +
    ".pl-back{align-self:flex-start;border:0;background:none;color:var(--pl-m);font:inherit;font-size:14px;padding:6px 2px;cursor:pointer;text-decoration:underline;text-underline-offset:3px}" +
    ".pl-bar{position:fixed;left:50%;bottom:14px;transform:translateX(-50%);z-index:2147482000;display:flex;align-items:center;gap:10px;flex-wrap:wrap;max-width:min(760px,calc(100vw - 24px));padding:10px 12px 10px 14px;border-radius:12px;background:#fff3d6;color:#3d2c00;border:1px solid #e3c36b;box-shadow:0 10px 30px -10px rgba(0,0,0,.45);font:14px/1.35 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}" +
    ".pl-bar.lost{background:#ffe1d8;border-color:#e79a85;color:#4a1406}" +
    ".pl-bar .pl-t{flex:1 1 240px}.pl-bar .pl-t b{font-weight:700}" +
    ".pl-bar button{min-height:36px;padding:6px 12px;border-radius:8px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;font-weight:600;cursor:pointer;white-space:nowrap}" +
    ".pl-bar button.main{background:#131715;color:#fff;border-color:#131715}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) .pl-card{--pl-s:#171b19;--pl-i:#e9ede8;--pl-m:#97a19a;--pl-l:#2a302c;--pl-f:#1e2320}}" +
    ":root[data-theme=dark] .pl-card{--pl-s:#171b19;--pl-i:#e9ede8;--pl-m:#97a19a;--pl-l:#2a302c;--pl-f:#1e2320}" +
    "@media (max-width:640px){.pl-bar{left:10px;right:10px;bottom:10px;transform:none;max-width:none}.pl-bar .pl-t{flex-basis:100%}.pl-bar button{flex:1}}" +
    "@media print{.pl-bar,.pl-bg{display:none!important}}";
  function style() { if (document.getElementById("pl-css")) return; var s = document.createElement("style"); s.id = "pl-css"; s.textContent = CSS; (document.head || document.documentElement).appendChild(s); }

  function create(o) {
    var W = window.WorkshopAuth, cur = null, beatT = null, bar = null, mode = "none", title = "";
    var lt = function () { return (typeof o.lang === "function" ? o.lang() : o.lang || "lt") !== "en"; };
    function rpc(fn, body) {
      if (!W || !W.signedIn || !W.signedIn()) return Promise.reject(new Error("signed-out"));
      return W.rest("rpc/" + fn, { method: "POST", body: JSON.stringify(body) });
    }
    function args(extra) { var a = { p_app: o.app, p_project: cur, p_device: DEV }; for (var k in extra) a[k] = extra[k]; return a; }

    /* ---- the choice when someone else has it ---- */
    function ask(info) {
      style();
      var L = lt(), self = !!info.self, idle = (+info.idle_s || 0) > 75;
      var bg = document.createElement("div");
      bg.className = "pl-bg"; bg.setAttribute("data-back-layer", "");
      bg.innerHTML = '<div class="pl-card" role="alertdialog" aria-modal="true" aria-labelledby="pl-h" aria-describedby="pl-d">' +
        '<h2 id="pl-h">' + (self ? (L ? "Šis projektas jau atidarytas kitur" : "This project is already open elsewhere")
                                 : (L ? "Šį projektą dabar redaguoja " : "This project is being edited by ") + esc(info.name)) + '</h2>' +
        '<div class="pl-who"><span class="pl-dot' + (idle ? " idle" : "") + '"></span><div><b>' + esc(self ? (L ? "Tu pats — kitame lange ar įrenginyje" : "You — in another window or device") : info.name) + '</b><br>' +
          '<span style="font-size:13px;opacity:.8">' + (L ? "atidarė " : "opened ") + hm(info.since) + " · " + (L ? "aktyvus " : "active ") + ago(info.idle_s, L) + '</span></div></div>' +
        '<p id="pl-d">' + (title ? "„" + esc(title) + "“. " : "") + (L ? "Jei dirbsite abu, vienas kito pakeitimus perrašysite. Ką darysite?" : "If you both work on it, you will overwrite each other's changes. What would you like to do?") + '</p>' +
        '<div class="pl-opts">' +
          '<button type="button" class="pl-opt main" data-c="copy"><b>' + (L ? "Daryti kopiją" : "Make a copy") + '</b><span>' + (L ? "Naujas projektas pagal šį — kaip šablonas" : "A new project from this one — as a template") + '</span></button>' +
          '<button type="button" class="pl-opt" data-c="view"><b>' + (L ? "Tik peržiūrėti" : "View only") + '</b><span>' + (L ? "Matysite viską, bet niekas nebus išsaugota" : "You see everything, nothing is saved") + '</span></button>' +
          '<button type="button" class="pl-opt warn" data-c="take"><b>' + (self ? (L ? "Dirbti čia" : "Work here") : (L ? "Perimti redagavimą" : "Take over editing")) + '</b><span>' +
            (self ? (L ? "Ten pakeitimai nebebus saugomi" : "Changes there will no longer be saved") : esc(info.name) + (L ? " nebegalės išsaugoti savo pakeitimų" : " will no longer be able to save")) + '</span></button>' +
        '</div><button type="button" class="pl-back" data-c="leave">' + (L ? "← Atgal į projektų sąrašą" : "← Back to the project list") + '</button></div>';
      document.body.appendChild(bg);
      setTimeout(function () { var b = bg.querySelector(".pl-opt"); if (b) b.focus(); }, 30);
      return new Promise(function (res) {
        function done(c) { document.removeEventListener("keydown", key, true); if (bg.parentNode) bg.parentNode.removeChild(bg); res(c); }
        function key(e) { if (e.key === "Escape") { e.preventDefault(); done("leave"); } }
        document.addEventListener("keydown", key, true);
        bg.__hubBackClose = function () { done("leave"); };     // phone Back = Atgal
        bg.addEventListener("click", function (e) { var b = e.target.closest("[data-c]"); if (b) done(b.getAttribute("data-c")); else if (e.target === bg) done("leave"); });
      });
    }

    /* ---- the bar while read-only ---- */
    function showBar(info, lost) {
      style(); hideBar();
      var L = lt();
      bar = document.createElement("div");
      bar.className = "pl-bar" + (lost ? " lost" : ""); bar.setAttribute("role", "status");
      var who = info && info.self ? (L ? "tu pats kitame lange" : "you, in another window") : esc(info && info.name || "?");
      bar.innerHTML = '<span class="pl-t">' + (lost
          ? (L ? "<b>" + who + "</b> perėmė šį projektą" + (info.since ? " " + hm(info.since) : "") + ". Tolesni pakeitimai čia <b>nebeišsaugomi</b>."
               : "<b>" + who + "</b> took over this project" + (info.since ? " at " + hm(info.since) : "") + ". Further changes here are <b>not saved</b>.")
          : (L ? "👁 Tik peržiūra — redaguoja <b>" + who + "</b>. Pakeitimai neišsaugomi."
               : "👁 View only — <b>" + who + "</b> is editing. Changes are not saved.")) + '</span>' +
        '<button type="button" class="main" data-c="copy">' + (L ? "Daryti kopiją" : "Make a copy") + '</button>' +
        '<button type="button" data-c="take">' + (L ? "Perimti" : "Take over") + '</button>';
      bar.addEventListener("click", function (e) {
        var b = e.target.closest("[data-c]"); if (!b) return;
        var c = b.getAttribute("data-c");
        if (c === "copy") { hideBar(); stop(); var was = cur; cur = null; o.copy && o.copy(was); }
        else if (c === "take") {
          if (!confirm(L ? (info && info.self ? "Dirbti čia? Kitame lange pakeitimai nebebus saugomi." : (info && info.name || "?") + " nebegalės išsaugoti savo pakeitimų. Perimti?")
                         : (info && info.self ? "Work here? The other window will stop saving." : (info && info.name || "?") + " will no longer be able to save. Take over?"))) return;
          take();
        }
      });
      document.body.appendChild(bar);
    }
    function hideBar() { if (bar && bar.parentNode) bar.parentNode.removeChild(bar); bar = null; }

    /* ---- heartbeat ---- */
    function stop() { clearInterval(beatT); beatT = null; }
    function start() { stop(); beatT = setInterval(beat, BEAT); }
    function beat() {
      if (!cur || mode !== "edit") return;
      var id = cur;
      rpc("lock_beat", args({})).then(function (r) {
        if (id !== cur || mode !== "edit") return;
        if (r && r.ok === false) { mode = "lost"; stop(); showBar(r, true); o.view && o.view(r, true); }
      }, function () { /* offline: keep working, try again next time */ });
    }
    function take() {
      return rpc("lock_open", args({ p_title: title || null, p_force: true })).then(function () {
        mode = "edit"; hideBar(); start(); o.edit && o.edit(); return "edit";
      }, function () { mode = "edit"; hideBar(); start(); o.edit && o.edit(); return "edit"; });
    }

    var api = {
      device: DEV,
      get current() { return cur; },
      get mode() { return mode; },
      open: function (project, t) {
        if (!project) return Promise.resolve("edit");
        if (cur && cur !== project) api.close();
        cur = String(project).slice(0, 200); title = t || ""; var id = cur;
        return rpc("lock_open", args({ p_title: title || null, p_force: false })).then(function (r) {
          if (id !== cur) return "leave";
          if (!r || r.ok !== false) { mode = "edit"; hideBar(); start(); o.edit && o.edit(); return "edit"; }
          return ask(r).then(function (c) {
            if (id !== cur) return "leave";
            if (c === "take") return take();
            if (c === "view") { mode = "view"; showBar(r, false); o.view && o.view(r, false); return "view"; }
            cur = null; mode = "none";
            if (c === "copy") { o.copy && o.copy(id); return "copy"; }
            o.leave && o.leave(); return "leave";
          });
        }, function () {
          // offline / not signed in: do not block the work
          if (id !== cur) return "leave";
          mode = "edit"; start(); o.edit && o.edit(); return "edit";
        });
      },
      close: function () {
        stop(); hideBar();
        if (cur && mode === "edit") rpc("lock_close", args({})).catch(function () {});
        cur = null; mode = "none";
      },
      list: function () { return rpc("lock_list", { p_app: o.app }).then(function (r) { return r || []; }, function () { return []; }); }
    };

    // back to the page (phone woke up): check at once whether it is still ours
    document.addEventListener("visibilitychange", function () { if (!document.hidden) beat(); });
    window.addEventListener("online", beat);
    // leaving the page frees the project at once (best effort; otherwise in 2 minutes)
    window.addEventListener("pagehide", function () {
      if (!cur || mode !== "edit" || !W || !W.tokenNow) return;
      var tok = W.tokenNow(); if (!tok) return;
      try { fetch(W.cfg.url + "/rest/v1/rpc/lock_close", { method: "POST", keepalive: true, headers: W.headers(tok), body: JSON.stringify(args({})) }); } catch (e) {}
    });
    return api;
  }

  window.ProjectLock = { create: create, device: DEV };
})();
