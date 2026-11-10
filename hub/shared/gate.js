/* ============================================================
   Dėdės Baldai — hub password gate.
   Load FIRST in <head> (no defer): <script src="/hub/shared/gate.js"></script>

   One shared password keeps strangers with the link out. It is checked
   by the database (only a hash is stored there); a correct password gives
   this device a key for 180 days. A device already signed in with a
   workshop name + PIN passes straight through. Until an admin sets a
   password (Darbuotojai page) the hub stays open.
   Written in ES5 so it runs on old workshop tablets too.
   ============================================================ */
(function () {
  "use strict";
  var URL_ = "https://niveinyzkkwtreeeaziv.supabase.co";
  var KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmVpbnl6a2t3dHJlZWVheml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4Mzc2ODgsImV4cCI6MjEwMTQxMzY4OH0.E2LnA_ClFpE1pe_pVPp28M1zOCkzi1RoAIU3bo9PNxk";
  var LS = "hub.gate.v1", SESS = "sb-niveinyzkkwtreeeaziv-auth-token";
  var LOGO = "https://app.dedesbaldai.lt/hub/shared/logo-mask.png";
  var html = document.documentElement;
  if (window.__hubGate) return; window.__hubGate = true;

  var css = document.createElement("style");
  var DARK = "--g-bg:#0f1211;--g-surface:#171b19;--g-ink:#e9ede8;--g-muted:#97a19a;--g-line:#2a302c;--g-line2:#454e48;--g-field:#1e2320;--g-accent:#ff6b3d;--g-err:#ff8a6b;--g-shadow:0 1px 0 rgba(0,0,0,.4),0 24px 48px -20px rgba(0,0,0,.9);color-scheme:dark";
  css.textContent =
    "html.hg-wait body{visibility:hidden}" +
    "html.hg-locked body>*:not(#hub-gate):not(.hg-own){display:none!important}" +
    "html.hg-locked,html.hg-locked body{overflow:hidden;background:#e6e8e3}" +
    "#hub-gate{--g-bg:#e6e8e3;--g-surface:#f8f9f6;--g-ink:#131715;--g-muted:#59615b;--g-line:#d2d7cf;--g-line2:#b4bbb1;--g-field:#fff;--g-accent:#ff4a1c;--g-err:#b7321a;" +
    "--g-shadow:0 1px 0 rgba(19,23,21,.05),0 24px 48px -24px rgba(19,23,21,.45);color-scheme:light;" +
    "position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;background:var(--g-bg);color:var(--g-ink);" +
    "font:15px/1.45 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;visibility:visible}" +
    "#hub-gate *{box-sizing:border-box}" +
    "#hub-gate form{width:100%;max-width:380px;margin:auto;display:flex;flex-direction:column;gap:14px;background:var(--g-surface);border:1px solid var(--g-line);border-radius:14px;padding:24px;box-shadow:var(--g-shadow)}" +
    "#hub-gate .br{display:flex;align-items:center;gap:12px}#hub-gate .br b{font-size:16px;font-weight:700;letter-spacing:-.01em}" +
    "#hub-gate .lg{width:40px;height:40px;flex:none;background:var(--g-ink);-webkit-mask:url(" + LOGO + ") center/contain no-repeat;mask:url(" + LOGO + ") center/contain no-repeat}" +
    "#hub-gate h1{margin:4px 0 0;font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.15}" +
    "#hub-gate p{margin:0;color:var(--g-muted);font-size:14px}" +
    "#hub-gate input{width:100%;min-height:48px;padding:10px 14px;border:1px solid var(--g-line2);border-radius:8px;background:var(--g-field);color:var(--g-ink);font:inherit;font-size:17px}" +
    "#hub-gate input:focus{outline:3px solid var(--g-accent);outline-offset:1px;border-color:var(--g-ink)}" +
    "#hub-gate button{min-height:50px;border:0;border-radius:8px;background:var(--g-ink);color:var(--g-surface);font:inherit;font-weight:700;font-size:16px;cursor:pointer}" +
    "#hub-gate button:disabled{opacity:.6;cursor:default}#hub-gate button:focus-visible,#hub-gate .alt:focus-visible{outline:3px solid var(--g-accent);outline-offset:2px}" +
    "#hub-gate .err{color:var(--g-err);font-size:14px;font-weight:500}#hub-gate .err:empty{display:none}" +
    "#hub-gate .sep{display:flex;align-items:center;gap:10px;color:var(--g-muted);font-size:12.5px;margin:2px 0 -2px}#hub-gate .sep:before,#hub-gate .sep:after{content:'';flex:1;height:1px;background:var(--g-line)}" +
    "#hub-gate .alt{min-height:48px;background:transparent;color:var(--g-ink);border:1px solid var(--g-line2);font-weight:600;font-size:15px}#hub-gate .alt:hover{background:var(--g-field)}" +
    "#hub-gate .note{font-size:12.5px;color:var(--g-muted)}" +
    "@media (prefers-color-scheme:dark){:root:not([data-theme=light]) #hub-gate{" + DARK + "}:root:not([data-theme=light]).hg-locked,:root:not([data-theme=light]).hg-locked body{background:#0f1211}}" +
    ":root[data-theme=dark] #hub-gate{" + DARK + "}:root[data-theme=dark].hg-locked,:root[data-theme=dark].hg-locked body{background:#0f1211}";
  (document.head || html).appendChild(css);

  function get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function set(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) {} }
  function rpc(fn, body, token) {
    return fetch(URL_ + "/rest/v1/rpc/" + fn, {
      method: "POST", headers: { apikey: KEY, Authorization: "Bearer " + (token || KEY), "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.text().then(function (t) { var d = null; try { d = t ? JSON.parse(t) : null; } catch (e) {} if (!r.ok) { var er = new Error((d && d.message) || ("HTTP " + r.status)); er.status = r.status; throw er; } return d; }); });
  }
  // a workshop sign-in on this device (not expired) → the person already proved who they are
  function memberToken() {
    var keys = [SESS, SESS + "-office"];
    for (var i = 0; i < keys.length; i++) {
      try { var s = JSON.parse(get(keys[i]) || "null"); if (s && s.access_token && s.expires_at > Date.now() / 1000 + 30) return s.access_token; } catch (e) {}
    }
    return null;
  }

  function open() { html.classList.remove("hg-wait"); html.classList.remove("hg-locked"); var g = document.getElementById("hub-gate"); if (g && g.parentNode) g.parentNode.removeChild(g); }
  function lock(msg) {
    html.classList.remove("hg-wait"); html.classList.add("hg-locked");
    var build = function () {
      if (document.getElementById("hub-gate")) { var e0 = document.querySelector("#hub-gate .err"); if (e0 && msg) e0.textContent = msg; return; }
      var d = document.createElement("div"); d.id = "hub-gate"; d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-labelledby", "hg-t");
      d.innerHTML = '<form autocomplete="on" novalidate><div class="br"><span class="lg" role="img" aria-label="Dėdės Baldai"></span><b>Dėdės Baldai</b></div>' +
        '<h1 id="hg-t">Vidinės programos</h1><p>Įveskite bendrą slaptažodį.</p>' +
        '<input type="text" name="username" value="dedes-baldai" autocomplete="username" hidden aria-hidden="true">' +
        '<input type="password" name="p" placeholder="Slaptažodis" autocomplete="current-password" aria-label="Slaptažodis" required>' +
        '<div class="err" role="alert">' + (msg || "") + '</div><button type="submit">Atidaryti</button>' +
        '<div class="sep">arba</div><button type="button" class="alt">Prisijungti vardu ir PIN</button>' +
        '<div class="note">Šiame įrenginyje bus atsiminta. Vardas ir PIN — tie patys kaip ShopFlow.</div></form>';
      document.body.appendChild(d);
      var f = d.querySelector("form"), inp = f.elements.p, btn = f.querySelector("button"), err = f.querySelector(".err");
      setTimeout(function () { inp.focus(); }, 30);
      f.querySelector(".alt").onclick = function () { pinSignIn(d); };
      f.onsubmit = function (ev) {
        ev.preventDefault();
        if (!inp.value) { inp.focus(); return; }
        btn.disabled = true; err.textContent = "";
        rpc("hub_unlock", { p_password: inp.value, p_ua: navigator.userAgent.slice(0, 200) }).then(function (tok) {
          if (tok === "open") { open(); return; }
          if (!tok) { err.textContent = "Neteisingas slaptažodis."; inp.value = ""; inp.focus(); btn.disabled = false; return; }
          set(LS, tok); open();
        }, function (e) {
          btn.disabled = false;
          err.textContent = /too many/.test(e.message) ? "Per daug bandymų. Palaukite 10 minučių." : "Nėra ryšio su serveriu. Bandykite dar kartą.";
        });
      };
    };
    if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);
  }

  // Worker sign-in instead of the shared password: the same name + PIN as in
  // ShopFlow (workshop-auth.js). A signed-in worker passes this gate anyway.
  function withAuth(cb) {
    if (window.WorkshopAuth) return cb();
    var sc = document.createElement("script");
    sc.src = "/hub/workers/workshop-auth.js";
    sc.onload = cb;
    sc.onerror = function () { lock("Nėra ryšio su serveriu."); };
    document.head.appendChild(sc);
  }
  function pinSignIn(g) {
    withAuth(function () {
      g.style.display = "none";
      var waiting = document.querySelector(".wa");            // the app's own sign-in, if it asked already
      var p = window.WorkshopAuth.gate({ opaque: true, allowSkip: true, skipLabel: "Atgal — bendras slaptažodis", managers: false });
      var all = document.querySelectorAll(".wa"), mine = all[all.length - 1];
      if (mine) mine.className += " hg-own";
      p.then(function (me) {
        if (!me) { g.style.display = ""; var i = g.querySelector("input[name=p]"); if (i) i.focus(); return; }
        if (waiting) location.reload(); else open();
      });
    });
  }

  var tok = get(LS);
  if (tok) {
    // known device: show at once, confirm in the background
    rpc("hub_status", { p_token: tok }).then(function (s) {
      if (s === "ok" || s === "open") return;
      set(LS, null);
      var mt = memberToken();
      if (mt) return rpc("workshop_me", {}, mt).then(function (me) { if (!(me && me[0])) lock("Slaptažodis pakeistas — įveskite naują."); }, function () { lock("Slaptažodis pakeistas — įveskite naują."); });
      lock("Slaptažodis pakeistas — įveskite naują.");
    }, function () { /* offline: keep working */ });
    return;
  }
  html.classList.add("hg-wait");
  var safety = setTimeout(function () { lock(""); }, 8000);
  var mt = memberToken();
  (mt ? rpc("workshop_me", {}, mt).then(function (me) { return me && me[0] ? "ok" : rpc("hub_status", { p_token: null }); }, function () { return rpc("hub_status", { p_token: null }); })
      : rpc("hub_status", { p_token: null })
  ).then(function (s) { clearTimeout(safety); if (s === "open" || s === "ok") open(); else lock(""); },
         function () { clearTimeout(safety); lock("Nėra ryšio su serveriu."); });
})();
