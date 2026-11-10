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

  // The session lives in localStorage. When the browser's storage is full (the
  // label PC: years of cached projects) saving it used to fail silently, so a
  // correct PIN ended in "account not active". Now: ask the app to free space
  // (window.WorkshopAuthFreeSpace) and retry; if it still doesn't fit, keep the
  // session in memory so this page works until it is reloaded.
  var mem;                                    // undefined = storage holds the truth
  function read() {
    if (mem !== undefined) return mem && mem.access_token ? mem : null;
    try { var s = JSON.parse(localStorage.getItem(KEY) || "null"); return s && s.access_token ? s : null; } catch (e) { return null; }
  }
  function store(s) { if (s) localStorage.setItem(KEY, JSON.stringify(s)); else localStorage.removeItem(KEY); }
  function write(s) {
    try { store(s); mem = undefined; }
    catch (e) {
      var ok = false;
      try { if (typeof root.WorkshopAuthFreeSpace === "function") { root.WorkshopAuthFreeSpace(); store(s); ok = true; } } catch (e2) {}
      if (ok) mem = undefined;
      else { mem = s || null; try { localStorage.removeItem(KEY); } catch (e3) {} }
    }
    emit();
  }
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

  // a fresh session from any sign-in path → keep it, check the member list
  function adopt(sess) {
    write(sess); meCache = null;
    if (SLOT === "office") touch();
    return W.me().then(function (me) {
      if (!me) { W.logout(true); throw new Error("not-member"); }
      return me;
    });
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

    /** name + PIN → session. ShopFlow people (4-digit PIN) first; names
        ShopFlow doesn't know fall back to the older accounts (Vadyba, Gamyba).
        Rejects with Error(code): wrong | locked | busy | blocked | nopin | not-member | net | server */
    login: function (name, pin) {
      pin = String(pin || "");
      function old() {
        return W.loginEmail(emailFor(name), pin + CFG.pinSalt).catch(function (e2) {
          if (e2.message === "not-member") throw e2;
          var x = new Error(e2.status ? "wrong" : "net"); x.status = e2.status; throw x;
        });
      }
      // ShopFlow PINs are 4 digits; anything else can only be an older account
      if (!/^[0-9]{4}$/.test(pin)) return old();
      return W.pinLogin(name, pin).catch(function (e) {
        if (e.message === "unknown" || e.status === 404) return old();
        throw e;
      });
    },
    /** ShopFlow name + PIN → own session (server function pin-login) */
    pinLogin: function (name, pin) {
      return fetch(CFG.url + "/functions/v1/pin-login", {
        method: "POST", headers: W.headers(null), body: JSON.stringify({ name: String(name || "").trim(), pin: String(pin || "") })
      }).then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (d) {
          if (d && d.session && d.session.access_token) return adopt(d.session);
          var e = new Error((d && d.error) || (r.status >= 500 ? "server" : "wrong"));
          e.left = d && d.left; e.waitMin = d && d.wait_min; e.status = r.status; throw e;
        });
      }, function () { throw new Error("net"); });
    },
    loginEmail: function (email, password) {
      return locked(function () { return tokenCall("password", { email: email, password: password }); })
        .then(adopt);
    },
    /** names for the sign-in screen (empty unless this device passed the hub password or is signed in) */
    people: function () {
      var hub = null; try { hub = localStorage.getItem("hub.gate.v1"); } catch (e) {}
      var p = W.signedIn() ? W.token() : Promise.resolve(null);
      return p.then(function (tok) {
        return fetch(CFG.url + "/rest/v1/rpc/pin_people", { method: "POST", headers: W.headers(tok), body: JSON.stringify({ p_hub_token: hub }) });
      }).then(function (r) { return r.ok ? r.json() : []; })
        .then(function (a) { return Array.isArray(a) ? a.filter(function (x) { return x && x.name && x.pin !== false; }) : []; })
        .catch(function () { return []; });
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
          var v = shell(true);
          v.card.innerHTML = head(opts.title) +
            '<h2 class="wa-h">' + (lt ? "Nėra prieigos" : "No access") + '</h2>' +
            '<p class="wa-p">' + (lt ? "Prisijungta kaip " : "Signed in as ") + '<b>' + esc(me.display_name) + '</b>. ' +
            (lt ? "Ši programa jūsų paskyrai neatidaryta." : "This app isn't open to your account.") + '</p>' +
            '<button type="button" class="wa-btn">' + (lt ? "Prisijungti kitu vardu" : "Sign in as someone else") + '</button>';
          v.card.querySelector(".wa-btn").onclick = function () {
            v.close(); W.logout(true);
            W.gate({ lang: opts.lang, title: opts.title, opaque: true }).then(check).then(resolve);
          };
          v.card.querySelector(".wa-btn").focus();
        });
      });
    },

    /* ---- the sign-in screen: pick your name, then the PIN (as in ShopFlow) ----
       opts: lang, title, opaque (hide the page), allowSkip (resolve null; skipLabel),
             managers (only office people's names; default: office slot) */
    gate: function (opts) {
      opts = opts || {};
      var lt = (opts.lang || "lt") === "lt";
      var T = lt ? { who: "Kas jūs?", pick: "Pasirinkite savo vardą", other: "Kita paskyra", name: "Vardas", pin: "PIN",
                     pinHint: "Įveskite PIN kodą", go: "Prisijungti", back: "Atgal", notYou: "Ne jūs?", skip: "Dirbti be prisijungimo",
                     del: "Ištrinti", clr: "Išvalyti", wait: "Jungiamasi…" }
                 : { who: "Who are you?", pick: "Pick your name", other: "Another account", name: "Name", pin: "PIN",
                     pinHint: "Enter your PIN", go: "Sign in", back: "Back", notYou: "Not you?", skip: "Work without signing in",
                     del: "Delete", clr: "Clear", wait: "Signing in…" };
      var onlyMgr = opts.managers != null ? !!opts.managers : SLOT === "office";
      return new Promise(function (resolve) {
        var v = shell(!!opts.opaque), card = v.card, people = [], busy = false, kb = null;
        function done(x) { if (kb) document.removeEventListener("keydown", kb, true); v.close(); resolve(x); }
        function foot() {
          return opts.allowSkip ? '<button type="button" class="wa-link" data-skip>' + esc(opts.skipLabel || T.skip) + '</button>' : "";
        }
        function bindFoot() { var b = card.querySelector("[data-skip]"); if (b) b.onclick = function () { done(null); }; }
        function setKb(fn) { if (kb) document.removeEventListener("keydown", kb, true); kb = fn; if (fn) document.addEventListener("keydown", fn, true); }

        // 1. names
        function list() {
          setKb(null);
          card.innerHTML = head(opts.title) + '<h2 class="wa-h">' + T.who + '</h2><p class="wa-p">' + T.pick + '</p>' +
            '<div class="wa-people" role="list">' + people.map(function (p, i) {
              return '<button type="button" class="wa-person" role="listitem" data-i="' + i + '">' + avatar(p, 30) + '<span>' + esc(p.name) + '</span></button>';
            }).join("") + '</div>' +
            '<div class="wa-row"><button type="button" class="wa-link" data-other>' + T.other + '</button>' + foot() + '</div>';
          [].forEach.call(card.querySelectorAll(".wa-person"), function (b) { b.onclick = function () { pad(people[+b.getAttribute("data-i")]); }; });
          card.querySelector("[data-other]").onclick = function () { manual(true); };
          bindFoot();
          card.focus();
        }

        // 2a. PIN pad for a picked person (4 digits, goes on its own)
        function pad(p) {
          var pin = "";
          card.innerHTML = '<button type="button" class="wa-back" data-back aria-label="' + T.back + '">' + ICON_BACK + '<span>' + T.notYou + '</span></button>' +
            '<div class="wa-me">' + avatar(p, 64) + '<b>' + esc(p.name) + '</b><span class="wa-p">' + T.pinHint + '</span></div>' +
            '<div class="wa-dots" aria-hidden="true">' + "<i></i><i></i><i></i><i></i>" + '</div>' +
            '<div class="wa-err" role="alert" aria-live="assertive"></div>' +
            keypad() + '<div class="wa-row wa-c">' + foot() + '</div>';
          var dots = card.querySelectorAll(".wa-dots i"), err = card.querySelector(".wa-err"), dotsBox = card.querySelector(".wa-dots");
          function paint() { [].forEach.call(dots, function (d, i) { d.className = i < pin.length ? "on" : ""; }); }
          function key(k) {
            if (busy) return;
            if (k === "del") { pin = pin.slice(0, -1); paint(); return; }
            if (k === "clr") { pin = ""; paint(); return; }
            if (pin.length >= 4) return;
            pin += k; paint(); err.textContent = ""; dotsBox.classList.remove("bad");
            if (pin.length === 4) submit(p.name, pin, err, function () { pin = ""; paint(); dotsBox.classList.add("bad"); });
          }
          [].forEach.call(card.querySelectorAll("[data-k]"), function (b) { b.onclick = function () { key(b.getAttribute("data-k")); }; });
          card.querySelector("[data-back]").onclick = function () { people.length ? list() : manual(false); };
          bindFoot();
          setKb(function (e) {
            if (e.ctrlKey || e.metaKey || e.altKey) return;
            if (/^[0-9]$/.test(e.key)) key(e.key);
            else if (e.key === "Backspace") key("del");
            else if (e.key === "Escape") list();
            else return;
            e.preventDefault(); e.stopPropagation();
          });
          card.focus();
          paint();
        }

        // 2b. name + PIN typed (no names list here, or another account)
        function manual(canBack) {
          setKb(null);
          card.innerHTML = (canBack ? '<button type="button" class="wa-back" data-back>' + ICON_BACK + '<span>' + T.back + '</span></button>' : "") +
            head(opts.title) + '<form class="wa-form" novalidate>' +
            '<label class="wa-l">' + T.name + '<input class="wa-in" name="n" autocomplete="username" autocapitalize="words" spellcheck="false"></label>' +
            '<label class="wa-l">' + T.pin + '<input class="wa-in wa-pin" name="p" type="password" inputmode="numeric" pattern="[0-9]*" maxlength="8" autocomplete="current-password"></label>' +
            '<div class="wa-err" role="alert" aria-live="assertive"></div>' +
            '<button type="submit" class="wa-btn">' + T.go + '</button></form><div class="wa-row wa-c">' + foot() + '</div>';
          var f = card.querySelector("form"), fn = f.elements.n, fp = f.elements.p, err = card.querySelector(".wa-err"), btn = f.querySelector(".wa-btn");
          try { fn.value = localStorage.getItem("workshop.lastName") || ""; } catch (e) {}
          var b = card.querySelector("[data-back]"); if (b) b.onclick = list;
          bindFoot();
          f.onsubmit = function (ev) {
            ev.preventDefault();
            var n = fn.value.trim(), p = fp.value.trim();
            if (!n) { fn.focus(); return; }
            if (!/^[0-9]{4,8}$/.test(p)) { err.textContent = lt ? "PIN — 4–6 skaitmenys." : "PIN is 4–6 digits."; fp.focus(); return; }
            btn.disabled = true; btn.textContent = T.wait;
            submit(n, p, err, function () { fp.value = ""; fp.focus(); }, function () { btn.disabled = false; btn.textContent = T.go; });
          };
          setTimeout(function () { (fn.value ? fp : fn).focus(); }, 30);
        }

        function submit(name, pin, err, onFail, always) {
          busy = true; card.classList.add("wa-busy");
          W.login(name, pin).then(function (me) {
            try { localStorage.setItem("workshop.lastName", name); } catch (e) {}
            busy = false; done(me);
          }, function (e) {
            busy = false; card.classList.remove("wa-busy");
            err.textContent = message(e, lt); onFail && onFail(); always && always();
          });
        }

        // start: the names come first when this device may see them
        card.innerHTML = head(opts.title) + '<div class="wa-load" aria-label="…"><i></i><i></i><i></i></div>';
        var t = setTimeout(function () { people = []; manual(false); t = null; }, 5000);
        W.people().then(function (a) {
          if (!t) return; clearTimeout(t);
          people = onlyMgr ? a.filter(function (p) { return p.role === "manager"; }) : a;
          people.length ? list() : manual(false);
        });
      });
    }
  };

  /* ---------- sign-in screen look (one style for every app, light + dark) ---------- */
  var LOGO = "https://app.dedesbaldai.lt/hub/shared/logo-mask.png";
  var ICON_BACK = '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var AV = ["#ff7a1a", "#1f6fe0", "#21a35a", "#9a4fd8", "#e2364f", "#2a9fd0", "#c99400", "#5452d6", "#d8402f", "#22919f"];
  function esc(s) { return String(s == null ? "" : s).replace(/[<&>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function initials(n) { var p = String(n || "?").trim().split(/\s+/); return ((p[0] || "?")[0] + (p[1] ? p[1][0] : "")).toUpperCase(); }
  function avatar(p, size) {
    var c = typeof p.color === "number" ? AV[p.color % AV.length] : (/^#[0-9a-f]{3,8}$/i.test(p.color || "") ? p.color : null);
    if (!c) { var h = 0; for (var i = 0; i < p.name.length; i++) h = (h * 31 + p.name.charCodeAt(i)) >>> 0; c = AV[h % AV.length]; }
    return '<span class="wa-av" aria-hidden="true" style="--av:' + c + ';width:' + size + 'px;height:' + size + 'px;font-size:' + Math.round(size * .38) + 'px">' + esc(initials(p.name)) + '</span>';
  }
  function head(title) {
    return '<div class="wa-brand"><span class="wa-logo" role="img" aria-label="Dėdės Baldai"></span><span><b>Dėdės Baldai</b>' +
      (title ? '<small>' + esc(title) + '</small>' : "") + '</span></div>';
  }
  function keypad() {
    var k = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return '<button type="button" class="wa-key" data-k="' + n + '">' + n + '</button>'; }).join("");
    return '<div class="wa-pad">' + k +
      '<button type="button" class="wa-key wa-soft" data-k="clr" aria-label="Išvalyti">C</button>' +
      '<button type="button" class="wa-key" data-k="0">0</button>' +
      '<button type="button" class="wa-key wa-soft" data-k="del" aria-label="Ištrinti"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M9 6h11v12H9l-6-6z M12.5 9.5l5 5 M17.5 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"/></svg></button></div>';
  }
  function message(e, lt) {
    var c = e && e.message, m = e && e.waitMin;
    if (c === "wrong") return lt ? "Neteisingas PIN." + (e.left ? " Liko bandymų: " + e.left + "." : "") : "Wrong PIN." + (e.left ? " Tries left: " + e.left + "." : "");
    if (c === "locked") return m >= 60 ? (lt ? "Per daug bandymų. Šiuo vardu prisijungti galėsite rytoj — arba kreipkitės į biurą." : "Too many tries. Try again tomorrow, or ask the office.")
                                       : (lt ? "Per daug bandymų. Palaukite " + (m || 15) + " min." : "Too many tries. Wait " + (m || 15) + " min.");
    if (c === "busy") return lt ? "Per daug bandymų. Palaukite 10 min." : "Too many tries. Wait 10 min.";
    if (c === "blocked") return lt ? "Ši paskyra išjungta. Kreipkitės į biurą." : "This account is switched off. Ask the office.";
    if (c === "nopin") return lt ? "Jums dar nenustatytas PIN. Paprašykite, kad jį nustatytų ShopFlow." : "No PIN set for you yet. Ask for one to be set in ShopFlow.";
    if (c === "not-member") return lt ? "Jūsų paskyra dar neaktyvi. Paprašykite, kad ją pridėtų darbuotojų puslapyje." : "Your account isn't active yet. Ask to be added on the workers page.";
    if (c === "net") return lt ? "Nėra ryšio su serveriu." : "Can't reach the server.";
    if (c === "server") return lt ? "Serverio klaida. Bandykite dar kartą." : "Server error. Try again.";
    return lt ? "Neteisingas vardas arba PIN." : "Wrong name or PIN.";
  }
  var CSS =
    ".wa{--wa-bg:#e6e8e3;--wa-surface:#f8f9f6;--wa-ink:#131715;--wa-muted:#59615b;--wa-line:#d2d7cf;--wa-line2:#b4bbb1;--wa-key:#fff;--wa-keyh:#eef0ec;--wa-accent:#ff4a1c;--wa-err:#b7321a;--wa-scrim:rgba(19,23,21,.5);--wa-shadow:0 1px 0 rgba(19,23,21,.05),0 24px 48px -24px rgba(19,23,21,.45);" +
    "position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:16px;overflow:auto;" +
    "font:15px/1.45 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--wa-ink);-webkit-font-smoothing:antialiased;color-scheme:light}" +
    ".wa.wa-scrim{background:var(--wa-scrim);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.wa.wa-solid{background:var(--wa-bg)}" +
    ".wa *{box-sizing:border-box}" +
    ":where(.wa) :where(button,input,label,h2,p,b,span,small,form,div){margin:0;letter-spacing:normal;text-transform:none;white-space:normal;text-shadow:none;float:none;max-width:none;min-width:0;line-height:inherit}" +
    ":where(.wa) :where(button,input){box-shadow:none;font-family:inherit;width:auto;height:auto}" +
    ".wa-card{position:relative;width:100%;max-width:400px;margin:auto;background:var(--wa-surface);border:1px solid var(--wa-line);border-radius:14px;padding:24px;box-shadow:var(--wa-shadow);display:flex;flex-direction:column;gap:14px}" +
    ".wa-brand{display:flex;align-items:center;gap:12px}.wa-brand b{display:block;font-size:16px;font-weight:700;letter-spacing:-.01em}.wa-brand small{display:block;color:var(--wa-muted);font-size:13px}" +
    ".wa-logo{width:40px;height:40px;flex:none;background:var(--wa-ink);-webkit-mask:url(" + LOGO + ") center/contain no-repeat;mask:url(" + LOGO + ") center/contain no-repeat}" +
    ".wa-h{margin:4px 0 0;font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.15}.wa-p{margin:0;color:var(--wa-muted);font-size:14px}.wa-p b{color:var(--wa-ink)}" +
    ".wa-people{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:8px;max-height:min(52vh,420px);overflow:auto;padding:2px;margin:0 -2px}" +
    ".wa-person{display:flex;align-items:center;gap:8px;min-height:56px;padding:8px 8px 8px 8px;font-size:14.5px;border:1px solid var(--wa-line);border-radius:10px;background:var(--wa-key);color:var(--wa-ink);font:inherit;font-weight:600;text-align:left;cursor:pointer;transition:background .12s,border-color .12s}" +
    ".wa-person span:last-child{min-width:0;line-height:1.2;overflow-wrap:break-word}" +
    ".wa-person:hover{background:var(--wa-keyh);border-color:var(--wa-line2)}" +
    ".wa-av{display:inline-flex;align-items:center;justify-content:center;flex:none;border-radius:50%;background:var(--av);color:#fff;font-weight:700;letter-spacing:.02em}" +
    ".wa-me{display:flex;flex-direction:column;align-items:center;gap:6px;text-align:center;padding-top:4px}.wa-me b{font-size:20px;font-weight:700}" +
    ".wa-dots{display:flex;justify-content:center;gap:16px;height:20px;align-items:center}" +
    ".wa-dots i{width:14px;height:14px;border-radius:50%;border:2px solid var(--wa-line2);transition:background .1s,border-color .1s,transform .1s}" +
    ".wa-dots i.on{background:var(--wa-ink);border-color:var(--wa-ink);transform:scale(1.05)}" +
    ".wa-dots.bad{animation:wa-shake .32s}.wa-dots.bad i{border-color:var(--wa-err)}" +
    "@keyframes wa-shake{20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}" +
    ".wa-pad{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}" +
    ".wa-key{height:60px;border:1px solid var(--wa-line);border-radius:10px;background:var(--wa-key);color:var(--wa-ink);font:600 24px/1 inherit;font-family:inherit;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .1s,transform .06s;-webkit-tap-highlight-color:transparent;touch-action:manipulation}" +
    ".wa-key:hover{background:var(--wa-keyh)}.wa-key:active{transform:scale(.97);background:var(--wa-keyh)}" +
    ".wa-key.wa-soft{background:transparent;border-color:transparent;color:var(--wa-muted);font-size:17px}.wa-key.wa-soft:hover{background:var(--wa-keyh)}" +
    ".wa-busy .wa-pad,.wa-busy .wa-form{opacity:.55;pointer-events:none}" +
    ".wa-err{min-height:20px;color:var(--wa-err);font-size:14px;font-weight:500;text-align:center}.wa-form .wa-err{text-align:left}.wa-err:empty{min-height:0}" +
    ".wa-form{display:flex;flex-direction:column;gap:12px}.wa-l{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:600;color:var(--wa-muted)}" +
    ".wa-in{width:100%;min-height:48px;padding:10px 14px;border:1px solid var(--wa-line2);border-radius:8px;background:var(--wa-key);color:var(--wa-ink);font:inherit;font-size:17px;font-weight:500}" +
    ".wa-in.wa-pin{letter-spacing:.35em}" +
    ".wa-btn{min-height:50px;border:0;border-radius:8px;background:var(--wa-ink);color:var(--wa-surface);font:inherit;font-weight:700;font-size:16px;cursor:pointer}.wa-btn:disabled{opacity:.6;cursor:default}" +
    ".wa-row{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}.wa-row.wa-c{justify-content:center}.wa-row:empty{display:none}" +
    ".wa-link{border:0;background:none;padding:6px 2px;color:var(--wa-muted);font:inherit;font-size:14px;font-weight:500;text-decoration:underline;text-underline-offset:3px;cursor:pointer}.wa-link:hover{color:var(--wa-ink)}" +
    ".wa-back{align-self:flex-start;display:inline-flex;align-items:center;gap:4px;border:0;background:none;padding:4px 8px 4px 2px;margin:-6px 0 -4px -4px;color:var(--wa-muted);font:inherit;font-size:14px;font-weight:500;cursor:pointer;border-radius:6px}.wa-back:hover{color:var(--wa-ink)}" +
    ".wa :focus-visible{outline:3px solid var(--wa-accent);outline-offset:2px}.wa .wa-in:focus{outline:3px solid var(--wa-accent);outline-offset:1px;border-color:var(--wa-ink)}" +
        ".wa-load{display:flex;justify-content:center;gap:8px;padding:28px 0}.wa-load i{width:8px;height:8px;border-radius:50%;background:var(--wa-line2);animation:wa-b 1s infinite}.wa-load i:nth-child(2){animation-delay:.15s}.wa-load i:nth-child(3){animation-delay:.3s}" +
    "@keyframes wa-b{0%,80%,100%{opacity:.3}40%{opacity:1}}" +
    ".wa .wa-card:focus,.wa .wa-card:focus-visible{outline:none}" +
    "@media (max-width:380px){.wa{padding:10px}.wa-card{padding:18px}.wa-key{height:56px}}" +
    "@media (prefers-reduced-motion:reduce){.wa *{animation:none!important;transition:none!important}}";
  var DARK = "--wa-bg:#0f1211;--wa-surface:#171b19;--wa-ink:#e9ede8;--wa-muted:#97a19a;--wa-line:#2a302c;--wa-line2:#454e48;--wa-key:#1e2320;--wa-keyh:#272d29;--wa-accent:#ff6b3d;--wa-err:#ff8a6b;--wa-scrim:rgba(0,0,0,.62);--wa-shadow:0 1px 0 rgba(0,0,0,.4),0 24px 48px -20px rgba(0,0,0,.9);color-scheme:dark";
  CSS += "@media (prefers-color-scheme:dark){:root:not([data-theme=light]):not(.light) .wa{" + DARK + "}}" +
         ":root[data-theme=dark] .wa,:root.dark .wa,body.dark .wa{" + DARK + "}";
  function shell(opaque) {
    if (!document.getElementById("wa-css")) {
      var st = document.createElement("style"); st.id = "wa-css"; st.textContent = CSS;
      (document.head || document.documentElement).appendChild(st);
    }
    var d = document.createElement("div");
    d.className = "wa " + (opaque ? "wa-solid" : "wa-scrim");
    d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", "Prisijungimas");
    d.innerHTML = '<div class="wa-card" tabindex="-1"></div>';
    var prev = document.activeElement;
    (document.body || document.documentElement).appendChild(d);
    return { el: d, card: d.firstChild, close: function () { if (d.parentNode) d.parentNode.removeChild(d); try { prev && prev.focus && prev.focus(); } catch (e) {} } };
  }

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
    var last = 0;
    ["pointerdown", "keydown", "wheel", "touchstart"].forEach(function (ev) {
      root.addEventListener && root.addEventListener(ev, function () { var n = Date.now(); if (n - last > 15000) { last = n; touch(); } }, { passive: true, capture: true });
    });
    setInterval(function () { if (idleExpired()) { W.logout(true); emit(); } }, 30000);
  }
  W.officeIdleMinutes = OFFICE_IDLE;

  root.WorkshopAuth = W;
})(typeof window !== "undefined" ? window : this);
