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
  css.textContent =
    "html.hg-wait body{visibility:hidden}" +
    "html.hg-locked body>*:not(#hub-gate){display:none!important}" +
    "html.hg-locked,html.hg-locked body{overflow:hidden;background:#e6e8e3}" +
    "#hub-gate{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;padding:20px;background:#e6e8e3;color:#131715;" +
    "font:16px/1.45 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;-webkit-font-smoothing:antialiased;visibility:visible}" +
    "#hub-gate form{width:100%;max-width:340px;display:flex;flex-direction:column;gap:12px}" +
    "#hub-gate .lg{width:84px;height:84px;background:#131715;-webkit-mask:url(" + LOGO + ") center/contain no-repeat;mask:url(" + LOGO + ") center/contain no-repeat;margin:0 0 6px}" +
    "#hub-gate h1{margin:0;font-size:26px;font-weight:800;letter-spacing:-.02em;line-height:1.1}" +
    "#hub-gate p{margin:0;color:#59615b;font-size:14.5px}" +
    "#hub-gate input{width:100%;box-sizing:border-box;min-height:48px;padding:10px 14px;border:1px solid #b4bbb1;border-radius:6px;background:#fff;color:#131715;font:inherit;font-size:17px}" +
    "#hub-gate input:focus{outline:3px solid #ff4a1c;outline-offset:1px;border-color:#131715}" +
    "#hub-gate button{min-height:48px;border:0;border-radius:6px;background:#131715;color:#f8f9f6;font:inherit;font-weight:700;font-size:16px;cursor:pointer}" +
    "#hub-gate button:disabled{opacity:.6;cursor:default}" +
    "#hub-gate .err{color:#c4321c;font-size:14px;font-weight:500;min-height:20px}" +
    "#hub-gate .note{font-size:12.5px;color:#8a918b}" +
    "@media (prefers-color-scheme:dark){#hub-gate,html.hg-locked,html.hg-locked body{background:#0f1211}#hub-gate{color:#e9ede8}#hub-gate .lg{background:#e9ede8}" +
    "#hub-gate p{color:#8e9890}#hub-gate input{background:#191d1b;color:#e9ede8;border-color:#3d4540}#hub-gate button{background:#e9ede8;color:#0f1211}}";
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
      d.innerHTML = '<form autocomplete="on" novalidate><span class="lg" role="img" aria-label="Dėdės Baldai"></span><h1 id="hg-t">Dėdės Baldai</h1>' +
        '<p>Vidinės programos. Įveskite slaptažodį.</p>' +
        '<input type="text" name="username" value="dedes-baldai" autocomplete="username" hidden aria-hidden="true">' +
        '<input type="password" name="p" placeholder="Slaptažodis" autocomplete="current-password" aria-label="Slaptažodis" required>' +
        '<button type="submit">Atidaryti</button><div class="err" role="alert">' + (msg || "") + '</div>' +
        '<div class="note">Šiame įrenginyje bus atsiminta. Darbuotojai, prisijungę vardu ir PIN, slaptažodžio neveda.</div></form>';
      document.body.appendChild(d);
      var f = d.querySelector("form"), inp = f.elements.p, btn = f.querySelector("button"), err = f.querySelector(".err");
      setTimeout(function () { inp.focus(); }, 30);
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
