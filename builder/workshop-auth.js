/* ============================================================
   workshop-auth.js — one login for the Dėdės Baldai workshop apps
   (Nesting, Spintelių kūrėjas, ShopFlow, Invoices, hub)

   All apps live on one origin (app.dedesbaldai.lt/<app>/), so they
   share localStorage. The session is kept under the exact key supabase-js
   uses for this project, so ShopFlow (which uses supabase-js) and these apps
   see ONE session: sign in once, in any app, and the others are signed in.

   Workers sign in with name + PIN. Behind the scenes that is a normal
   Supabase account (email = name.code@domain, password = PIN + salt) that an
   admin created. Being signed in is not enough on its own: the database only
   answers accounts on the member list (see 0001_workshop.sql).

   The public key below is not a secret: on its own it reads nothing.
   Plain ES5 + Promise + fetch, so the older shop tablets run it too.

   Canonical copy: db/workshop/workshop-auth.js — copies live in each app repo.
   ============================================================ */
(function (root) {
  "use strict";
  var CFG = Object.assign({
    url: "https://niveinyzkkwtreeeaziv.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pdmVpbnl6a2t3dHJlZWVheml2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4Mzc2ODgsImV4cCI6MjEwMTQxMzY4OH0.E2LnA_ClFpE1pe_pVPp28M1zOCkzi1RoAIU3bo9PNxk",
    domain: "dedesbaldai.lt",   // synthetic email domain (no mail is sent)
    code: "gvs",                // workshop code, keeps the hidden email unique
    pinLen: 6,
    pinSalt: "_dedes"           // PIN + salt = the real password (Supabase needs 6+ chars)
  }, root.WORKSHOP_CLOUD || {});

  var REF = CFG.url.replace(/^https?:\/\//, "").split(".")[0];
  // Two separate sign-ins on one computer:
  //   default slot  → workshop apps (Nesting, Builder, ShopFlow); same key as supabase-js,
  //                   so ShopFlow shares it.
  //   "office" slot → Pasiūlymai, Prašymai, workers page. Its own session, so a workshop
  //                   computer can stay signed in as a worker while office apps stay locked.
  //                   It re-locks itself after OFFICE_IDLE minutes without use, unless this
  //                   computer is marked as an office computer (hub tick "Biuro kompiuteris").
  var SLOT = CFG.slot === "office" ? "office" : "";
  var KEY = "sb-" + REF + "-auth-token" + (SLOT ? "-" + SLOT : "");   // default = supabase-js v2 key
  var LOCK = "lock:" + KEY;                   // supabase-js v2 lock name
  var IDLE_KEY = "workshop.office.lastActive", OFFICE_PC = "workshop.officeComputer";
  var OFFICE_IDLE = 10;                       // minutes
  var listeners = [];
  var meCache = null;

  function read() { try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.access_token ? s : null; } catch (e) { return null; } }
  function write(s) { try { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); } catch (e) {} emit(); }
  function emit() { listeners.forEach(function (fn) { try { fn(read()); } catch (e) {} }); }
  function nowSec() { return Math.floor(Date.now() / 1000); }

  // Run fn while holding the same lock supabase-js uses, so two apps (or two
  // tabs) never spend the same refresh token — Supabase would revoke it.
  function locked(fn) {
    if (root.navigator && navigator.locks && navigator.locks.request) {
      return navigator.locks.request(LOCK, { mode: "exclusive" }, function () { return fn(); });
    }
    return Promise.resolve().then(fn);
  }

  function slug(s) {
    var m = { "ą": "a", "č": "c", "ę": "e", "ė": "e", "į": "i", "š": "s", "ų": "u", "ū": "u", "ž": "z" };
    return String(s || "").trim().toLowerCase()
      .replace(/[ąčęėįšųūž]/g, function (c) { return m[c] || c; })
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }
  function emailFor(name) { return slug(name) + "." + slug(CFG.code) + "@" + CFG.domain; }

  function tokenCall(grant, body) {
    return fetch(CFG.url + "/auth/v1/token?grant_type=" + grant, {
      method: "POST", headers: { apikey: CFG.key, "Content-Type": "application/json" }, body: JSON.stringify(body)
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (d) {
        if (!r.ok || !d.access_token) { var e = new Error(d.error_description || d.msg || d.error || ("HTTP " + r.status)); e.status = r.status; throw e; }
        return {
          access_token: d.access_token, token_type: "bearer", expires_in: d.expires_in || 3600,
          expires_at: d.expires_at || (nowSec() + (d.expires_in || 3600)),
          refresh_token: d.refresh_token, user: d.user || null
        };
      });
    });
  }

  var refreshing = null;
  function refresh() {
    if (refreshing) return refreshing;
    refreshing = locked(function () {
      var s = read();                                     // re-read: another app may have refreshed already
      if (!s || !s.refresh_token) return null;
      if (s.expires_at > nowSec() + 90) return s;
      return tokenCall("refresh_token", { refresh_token: s.refresh_token })
        .then(function (n) { if (!n.user) n.user = s.user; write(n); return n; })
        .catch(function (e) { if (e.status === 400 || e.status === 401) { write(null); meCache = null; } return null; });
    }).then(function (x) { refreshing = null; return x; }, function () { refreshing = null; return null; });
    return refreshing;
  }

  var W = {
    cfg: CFG, storageKey: KEY, emailFor: emailFor,

    session: read,
    signedIn: function () { return !!read(); },
    /** current access token without waiting (may be about to expire) */
    tokenNow: function () { var s = read(); return s ? s.access_token : null; },
    /** valid access token, refreshing if needed; null when signed out */
    token: function () {
      var s = read(); if (!s) return Promise.resolve(null);
      if (s.expires_at > nowSec() + 90) return Promise.resolve(s.access_token);
      return refresh().then(function (n) { return n ? n.access_token : null; });
    },

    /** name + PIN → session. Rejects with a readable message. */
    login: function (name, pin) {
      return W.loginEmail(emailFor(name), String(pin) + CFG.pinSalt);
    },
    loginEmail: function (email, password) {
      return locked(function () { return tokenCall("password", { email: email, password: password }); })
        .then(function (s) { write(s); meCache = null; return W.me(); })
        .then(function (me) {
          if (!me) { W.logout(true); throw new Error("not-member"); }
          return me;
        });
    },
    logout: function (quiet) {
      var t = W.tokenNow(); write(null); meCache = null;
      if (t) fetch(CFG.url + "/auth/v1/logout", { method: "POST", headers: { apikey: CFG.key, Authorization: "Bearer " + t } }).catch(function () {});
      if (!quiet) emit();
    },

    /** {display_name, role} for an active member, null otherwise */
    me: function () {
      if (meCache) return Promise.resolve(meCache);
      return W.rest("rpc/workshop_me", { method: "POST", body: "{}" })
        .then(function (rows) { meCache = (rows && rows[0]) || null; return meCache; })
        .catch(function () { return null; });
    },

    headers: function (tok, extra) {
      return Object.assign({ apikey: CFG.key, Authorization: "Bearer " + (tok || CFG.key), "Content-Type": "application/json" }, extra || {});
    },
    /** PostgREST call as the signed-in user. Resolves parsed JSON (or null). */
    rest: function (path, opts) {
      opts = opts || {};
      return W.token().then(function (tok) {
        if (!tok) { var e = new Error("signed-out"); e.status = 401; throw e; }
        return fetch(CFG.url + "/rest/v1/" + path, {
          method: opts.method || "GET", body: opts.body, headers: W.headers(tok, opts.headers)
        });
      }).then(function (r) {
        return r.text().then(function (txt) {
          if (!r.ok) { var e = new Error("HTTP " + r.status + " " + txt.slice(0, 160)); e.status = r.status; throw e; }
          return txt ? JSON.parse(txt) : null;
        });
      });
    },

    onChange: function (fn) { listeners.push(fn); },

    isManager: function (me) { return !!me && (me.role === "admin" || me.role === "manager"); },
    can: function (me, area) { return !!me && (!me.areas || me.areas.indexOf(area) >= 0); },

    /** Block the page until a member who may use `area` is signed in.
        Resolves {display_name, role, areas}. Someone without access sees a neutral
        notice with a button to sign in as someone else (the session stays shared). */
    requireArea: function (area, opts) {
      opts = opts || {};
      var lt = (opts.lang || "lt") === "lt";
      return (W.signedIn() ? W.me() : Promise.resolve(null)).then(function check(me) {
        if (!me) return W.gate({ lang: opts.lang, title: opts.title, opaque: true }).then(check);
        if (W.can(me, area)) return me;
        return new Promise(function (resolve) {
          var d = document.createElement("div");
          d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
          d.style.cssText = "position:fixed;inset:0;z-index:9999;background:#0f1211;display:flex;align-items:center;justify-content:center;padding:16px;font:15px system-ui,sans-serif";
          d.innerHTML = '<div style="background:#fff;color:#161a17;border-radius:12px;padding:22px;max-width:340px;display:flex;flex-direction:column;gap:12px">' +
            '<span role="img" aria-label="Dėdės Baldai" style="display:block;width:52px;height:52px;background:#161a17;-webkit-mask:url(https://app.dedesbaldai.lt/hub/shared/logo-mask.png) center/contain no-repeat;mask:url(https://app.dedesbaldai.lt/hub/shared/logo-mask.png) center/contain no-repeat"></span>' +
            '<b style="font-size:18px">' + (lt ? "Nėra prieigos" : "No access") + '</b>' +
            '<span style="color:#5b625d">' + (lt ? "Prisijungta kaip " : "Signed in as ") + String(me.display_name).replace(/[<&>"]/g, "") +
            (lt ? ". Ši programa jūsų paskyrai neatidaryta." : ". This app isn't open to your account.") + '</span>' +
            '<button type="button" style="padding:11px;border:0;border-radius:8px;background:#161a17;color:#fff;font-size:15px;cursor:pointer">' +
            (lt ? "Prisijungti kitu vardu" : "Sign in as someone else") + '</button></div>';
          document.body.appendChild(d);
          d.querySelector("button").onclick = function () {
            d.parentNode.removeChild(d); W.logout(true);
            W.gate({ lang: opts.lang, title: opts.title, opaque: true }).then(check).then(resolve);
          };
        });
      });
    },

    /* ---- a small sign-in screen for apps that have none of their own ---- */
    gate: function (opts) {
      opts = opts || {};
      var lt = (opts.lang || "lt") === "lt";
      var T = lt ? { h: "Prisijungimas", name: "Vardas", pin: "PIN", go: "Prisijungti", skip: "Dirbti be sinchronizavimo",
                     bad: "Neteisingas vardas arba PIN.", notm: "Jūsų paskyra dar neaktyvi. Paprašykite, kad ją pridėtų darbuotojų puslapyje.", net: "Nėra ryšio su serveriu." }
                 : { h: "Sign in", name: "Name", pin: "PIN", go: "Sign in", skip: "Work without sync",
                     bad: "Wrong name or PIN.", notm: "Your account isn't active yet. Ask to be added on the workers page.", net: "Can't reach the server." };
      return new Promise(function (resolve) {
        var d = document.createElement("div");
        d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true");
        d.style.cssText = "position:fixed;inset:0;z-index:9999;background:" + (opts.opaque ? "#0f1211" : "rgba(15,18,16,.72)") + ";display:flex;align-items:center;justify-content:center;padding:16px;font:15px system-ui,sans-serif";
        d.innerHTML =
          '<form style="background:#fff;color:#161a17;border-radius:12px;padding:22px;width:100%;max-width:320px;display:flex;flex-direction:column;gap:10px;box-shadow:0 20px 60px rgba(0,0,0,.35)">' +
          '<span role="img" aria-label="Dėdės Baldai" style="display:block;width:52px;height:52px;background:#161a17;-webkit-mask:url(https://app.dedesbaldai.lt/hub/shared/logo-mask.png) center/contain no-repeat;mask:url(https://app.dedesbaldai.lt/hub/shared/logo-mask.png) center/contain no-repeat"></span>' +
          '<b style="font-size:18px">' + T.h + '</b>' +
          (opts.title ? '<span style="color:#5b625d;font-size:13px">' + String(opts.title).replace(/[<&>"]/g, "") + '</span>' : "") +
          '<label style="font-size:12px;color:#5b625d">' + T.name + '<input name="n" autocomplete="username" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #c9cec9;border-radius:8px;font-size:16px"></label>' +
          '<label style="font-size:12px;color:#5b625d">' + T.pin + '<input name="p" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="' + CFG.pinLen + '" autocomplete="current-password" style="display:block;width:100%;box-sizing:border-box;margin-top:4px;padding:10px;border:1px solid #c9cec9;border-radius:8px;font-size:16px;letter-spacing:.3em"></label>' +
          '<div data-e style="display:none;color:#a33;font-size:13px"></div>' +
          '<button type="submit" style="padding:11px;border:0;border-radius:8px;background:#161a17;color:#fff;font-size:15px;cursor:pointer">' + T.go + '</button>' +
          (opts.allowSkip ? '<button type="button" data-skip style="padding:6px;border:0;background:none;color:#5b625d;font-size:13px;cursor:pointer;text-decoration:underline">' + T.skip + '</button>' : "") +
          '</form>';
        document.body.appendChild(d);
        var f = d.querySelector("form"), fn = f.elements.n, fp = f.elements.p, err = d.querySelector("[data-e]"), btn = f.querySelector("[type=submit]");
        try { fn.value = localStorage.getItem("workshop.lastName") || ""; } catch (e) {}
        setTimeout(function () { (fn.value ? fp : fn).focus(); }, 30);
        function done(v) { if (d.parentNode) d.parentNode.removeChild(d); resolve(v); }
        var sk = d.querySelector("[data-skip]"); if (sk) sk.onclick = function () { done(null); };
        f.onsubmit = function (ev) {
          ev.preventDefault();
          var n = fn.value.trim(), p = fp.value.trim();
          if (!n || p.length < 4) return;
          btn.disabled = true; err.style.display = "none";
          W.login(n, p).then(function (me) {
            try { localStorage.setItem("workshop.lastName", n); } catch (e) {}
            done(me);
          }, function (e) {
            btn.disabled = false; fp.value = ""; fp.focus();
            err.textContent = e.message === "not-member" ? T.notm : (e.status ? T.bad : T.net);
            err.style.display = "block";
          });
        };
      });
    }
  };

  // keep other tabs / apps in step
  root.addEventListener && root.addEventListener("storage", function (e) { if (e.key === KEY) { meCache = null; emit(); } });

  /* ---- office slot: re-lock after inactivity ---- */
  function officePc() { try { return localStorage.getItem(OFFICE_PC) === "1"; } catch (e) { return false; } }
  function lastActive() { try { return +localStorage.getItem(IDLE_KEY) || 0; } catch (e) { return 0; } }
  function touch() { try { localStorage.setItem(IDLE_KEY, String(Date.now())); } catch (e) {} }
  function idleExpired() { return !officePc() && read() && Date.now() - lastActive() > OFFICE_IDLE * 60000; }
  W.slot = SLOT;
  W.officeComputer = function (on) {
    if (on === undefined) return officePc();
    try { if (on) localStorage.setItem(OFFICE_PC, "1"); else localStorage.removeItem(OFFICE_PC); } catch (e) {}
    touch();
  };
  if (SLOT === "office") {
    if (idleExpired()) { try { localStorage.removeItem(KEY); } catch (e) {} }   // stale before the page even starts
    else if (read()) touch();
    var _lw = W.loginEmail;
    W.loginEmail = function (e, p) { return _lw(e, p).then(function (me) { touch(); return me; }); };
    var last = 0;
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) {
      root.addEventListener && root.addEventListener(ev, function () { var n = Date.now(); if (n - last > 15000) { last = n; touch(); } }, { passive: true, capture: true });
    });
    setInterval(function () { if (idleExpired()) { W.logout(true); emit(); } }, 30000);
  }
  W.officeIdleMinutes = OFFICE_IDLE;

  root.WorkshopAuth = W;
})(typeof window !== "undefined" ? window : this);
