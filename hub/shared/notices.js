/* ============================================================
   Dėdės Baldai — pranešimai (notices) for every app.

   • bell with unread count + a panel: received / sent, "Perskaičiau"
   • popups for new notices; important ones must be confirmed
   • office writes notices to everyone / the workshop / the office / a person;
     the workshop can write to the office or a person
   • personal reminders ("Ketvirtadienį 9:00 — paskambinti tiekėjui")
   • phone/computer notifications (Web Push) — switched on per device;
     the device can say who uses it (ShopFlow people) so personal notices
     (mentions, tasks, reminders) reach the right phone

   Needs workshop-auth.js on the page (window.WorkshopAuth). Optional config,
   set before this script:
     window.NOTICES_CFG = {
       mount: "#selector",          // put the bell there (else it floats)
       side: "right" | "left",      // floating bell corner
       bottom: 92, inset: 25, z: 65 // floating bell position / stacking (optional)
       skipKinds: ["shopflow"],     // kinds this app shows by itself
       person: function () { return { id, name } | null }   // ShopFlow user on this device
     }
   Written in ES5 so it also runs on old workshop tablets.
   ============================================================ */
(function () {
  "use strict";
  if (window.__notices) return;
  var W = window.WorkshopAuth;
  if (!W || !window.fetch || !window.Promise) return;
  var CFG = window.NOTICES_CFG || {};
  var skip = CFG.skipKinds || [];
  var POLL = 30000;
  var LS_READ = "notices.read.v1", LS_POP = "notices.popped.v1", LS_PEOPLE = "notices.people.v1", LS_EP = "notices.endpoint.v1", LS_SYNC = "notices.subsync.v1";
  var IS_SF = /\/shopflow-app\//.test(location.pathname);
  var SW_URL = "/hub/notify-sw.js", SW_SCOPE = "/hub/";
  var LOGO = "https://app.dedesbaldai.lt/hub/shared/logo-mask.png";

  /* ---------- helpers ---------- */
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function localDT(d) { return ymd(d) + "T" + pad(d.getHours()) + ":" + pad(d.getMinutes()); }
  var MON = ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod."];
  var WDN = ["sekmadienį", "pirmadienį", "antradienį", "trečiadienį", "ketvirtadienį", "penktadienį", "šeštadienį"];
  function when(iso) {
    if (!iso) return ""; var t = new Date(iso), s = (Date.now() - t.getTime()) / 1000, hm = pad(t.getHours()) + ":" + pad(t.getMinutes());
    if (s < 0) { var dd = Math.round((new Date(ymd(t)) - new Date(ymd(new Date()))) / 86400000); return (dd === 0 ? "šiandien " : dd === 1 ? "rytoj " : dd < 7 ? WDN[t.getDay()] + " " : t.getDate() + " " + MON[t.getMonth()] + " ") + hm; }
    if (s < 60) return "ką tik"; if (s < 3600) return "prieš " + Math.floor(s / 60) + " min.";
    if (ymd(t) === ymd(new Date())) return "šiandien " + hm;
    var y = new Date(); y.setDate(y.getDate() - 1); if (ymd(t) === ymd(y)) return "vakar " + hm;
    return t.getDate() + " " + MON[t.getMonth()] + " " + hm;
  }
  function urlB64(s) { s = String(s).replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  function abB64(buf) { var b = new Uint8Array(buf), s = ""; for (var i = 0; i < b.length; i++) s += String.fromCharCode(b[i]); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function rest(path, opts) { return W.rest(path, opts); }

  /* ---------- styles ---------- */
  var CSS = "" +
    ".ntc,.ntc *{box-sizing:border-box}" +
    ".ntc{--n-bg:#f8f9f6;--n-raised:#fff;--n-ink:#131715;--n-muted:#59615b;--n-line:#d2d7cf;--n-line2:#b4bbb1;--n-accent:#ff4a1c;--n-bad:#c4321c;--n-ok:#127c52;--n-warn:#b86e00;--n-soft:#eef0ec;" +
    "font:15px/1.45 'Schibsted Grotesk',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;color:var(--n-ink);-webkit-font-smoothing:antialiased}" +
    "@media (prefers-color-scheme:dark){.ntc{--n-bg:#191d1b;--n-raised:#1f2421;--n-ink:#e9ede8;--n-muted:#8e9890;--n-line:#2a302c;--n-line2:#3d4540;--n-accent:#ff6b3d;--n-bad:#ff7a63;--n-ok:#4cc993;--n-warn:#f0b23a;--n-soft:#141816}}" +
    ".ntc button{font:inherit;color:inherit;cursor:pointer}" +
    ".ntc :focus-visible{outline:3px solid var(--n-accent);outline-offset:2px}" +
    ".ntc-bell{position:relative;display:inline-grid;place-items:center;width:38px;height:38px;border-radius:50%;border:1px solid var(--n-line2);background:var(--n-raised);color:var(--n-ink);padding:0;flex:none}" +
    ".ntc-bell:hover{background:var(--n-soft)}" +
    ".ntc-bell svg{width:19px;height:19px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}" +
    ".ntc-bell b{position:absolute;top:-4px;right:-4px;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:var(--n-bad);color:#fff;font:600 11px/19px ui-monospace,Menlo,monospace;text-align:center;box-shadow:0 0 0 2px var(--n-raised)}" +
    ".ntc-bell b[hidden]{display:none}" +
    ".ntc-bell.ring svg{animation:ntc-ring .9s ease 2}" +
    "@keyframes ntc-ring{0%,100%{transform:rotate(0)}20%{transform:rotate(14deg)}40%{transform:rotate(-12deg)}60%{transform:rotate(8deg)}80%{transform:rotate(-5deg)}}" +
    ".ntc-float{position:fixed;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:2147482000}" +
    ".ntc-float.r{right:16px}.ntc-float.l{left:16px}" +
    ".ntc-float .ntc-bell{width:48px;height:48px;box-shadow:0 10px 28px -10px rgba(0,0,0,.45),0 1px 2px rgba(0,0,0,.08)}" +
    ".ntc-float .ntc-bell svg{width:22px;height:22px}" +
    ".ntc-float.quiet .ntc-bell{opacity:.55}.ntc-float.quiet .ntc-bell:hover{opacity:1}" +
    /* panel */
    ".ntc-scrim{position:fixed;inset:0;background:rgba(15,18,16,.35);z-index:2147482500;opacity:0;transition:opacity .2s}" +
    ".ntc-scrim.on{opacity:1}" +
    ".ntc-panel{position:fixed;top:0;right:0;bottom:0;width:min(420px,100vw);background:var(--n-bg);z-index:2147482600;display:flex;flex-direction:column;box-shadow:0 30px 80px -20px rgba(0,0,0,.5);transform:translateX(105%);transition:transform .25s cubic-bezier(.2,.8,.2,1)}" +
    ".ntc-panel.on{transform:none}" +
    ".ntc-ph{display:flex;align-items:center;gap:10px;padding:14px 16px 10px;border-bottom:1px solid var(--n-line)}" +
    ".ntc-ph h2{margin:0;font-size:19px;font-weight:800;letter-spacing:-.01em;flex:1}" +
    ".ntc-x{border:0;background:none;width:34px;height:34px;border-radius:6px;font-size:20px;line-height:1}" +
    ".ntc-x:hover{background:var(--n-soft)}" +
    ".ntc-acts{display:flex;gap:8px;padding:10px 16px;flex-wrap:wrap}" +
    ".ntc-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:34px;padding:0 12px;border:1px solid var(--n-line2);border-radius:5px;background:var(--n-raised);font-size:14px;font-weight:500;white-space:nowrap;text-decoration:none;color:var(--n-ink)}" +
    ".ntc-btn:hover{background:var(--n-soft)}" +
    ".ntc-btn.pri{background:var(--n-ink);border-color:var(--n-ink);color:var(--n-bg)}" +
    ".ntc-btn.acc{background:var(--n-accent);border-color:var(--n-accent);color:#160700;font-weight:600}" +
    ".ntc-btn.sm{min-height:28px;padding:0 9px;font-size:13px}" +
    ".ntc-tabs{display:flex;gap:2px;padding:0 16px;border-bottom:1px solid var(--n-line)}" +
    ".ntc-tabs button{border:0;background:none;padding:9px 10px;font-weight:600;font-size:14px;color:var(--n-muted);border-bottom:3px solid transparent;margin-bottom:-1px}" +
    ".ntc-tabs button[aria-selected=true]{color:var(--n-ink);border-bottom-color:var(--n-accent)}" +
    ".ntc-list{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:4px 0 12px}" +
    ".ntc-item{display:grid;grid-template-columns:30px 1fr;gap:10px;padding:12px 16px;border-bottom:1px solid var(--n-line);position:relative}" +
    ".ntc-item.unread{background:color-mix(in srgb,var(--n-accent) 6%,transparent)}" +
    ".ntc-item.unread::before{content:'';position:absolute;left:6px;top:20px;width:7px;height:7px;border-radius:50%;background:var(--n-accent)}" +
    ".ntc-ic{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:var(--n-soft);border:1px solid var(--n-line);color:var(--n-muted)}" +
    ".ntc-ic svg{width:15px;height:15px;stroke:currentColor;fill:none;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}" +
    ".ntc-ic.imp{background:var(--n-bad);border-color:var(--n-bad);color:#fff}" +
    ".ntc-it{font-weight:700;line-height:1.3;overflow-wrap:anywhere}" +
    ".ntc-ib{white-space:pre-wrap;overflow-wrap:anywhere;color:var(--n-ink);font-size:14px;margin-top:3px}" +
    ".ntc-ib.clamp{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden;cursor:pointer}" +
    ".ntc-im{font-size:12px;color:var(--n-muted);margin-top:5px}" +
    ".ntc-ia{display:flex;gap:6px;margin-top:8px;flex-wrap:wrap}" +
    ".ntc-tag{display:inline-block;font:600 10.5px/1 ui-monospace,Menlo,monospace;letter-spacing:.06em;text-transform:uppercase;padding:3px 6px;border-radius:3px;background:var(--n-soft);color:var(--n-muted);margin-right:6px;vertical-align:1px}" +
    ".ntc-tag.imp{background:var(--n-bad);color:#fff}" +
    ".ntc-empty{padding:40px 24px;text-align:center;color:var(--n-muted)}" +
    ".ntc-foot{border-top:1px solid var(--n-line);padding:12px 16px calc(12px + env(safe-area-inset-bottom,0px));font-size:13px;color:var(--n-muted);display:flex;flex-direction:column;gap:8px}" +
    ".ntc-foot .row{display:flex;align-items:center;gap:8px;justify-content:space-between;flex-wrap:wrap}" +
    ".ntc-ok{color:var(--n-ok);font-weight:600}" +
    /* toasts */
    ".ntc-toasts{position:fixed;top:calc(12px + env(safe-area-inset-top,0px));right:12px;z-index:2147483000;display:flex;flex-direction:column;gap:10px;width:min(380px,calc(100vw - 24px));pointer-events:none}" +
    ".ntc-toast{pointer-events:auto;background:var(--n-raised);border:1px solid var(--n-line);border-left:4px solid var(--n-ink);border-radius:8px;box-shadow:0 18px 50px -14px rgba(0,0,0,.45);padding:12px 12px 10px 14px;animation:ntc-in .25s cubic-bezier(.2,.8,.2,1)}" +
    ".ntc-toast.imp{border-left-color:var(--n-bad)}" +
    ".ntc-toast .h{display:flex;gap:8px;align-items:flex-start}" +
    ".ntc-toast .h .lg{width:22px;height:22px;flex:none;background:var(--n-ink);-webkit-mask:url(" + LOGO + ") center/contain no-repeat;mask:url(" + LOGO + ") center/contain no-repeat;margin-top:1px}" +
    ".ntc-toast .h .t{flex:1;font-weight:700;line-height:1.3}" +
    ".ntc-toast .b{white-space:pre-wrap;font-size:14px;margin:4px 0 0 30px;display:-webkit-box;-webkit-line-clamp:5;-webkit-box-orient:vertical;overflow:hidden}" +
    ".ntc-toast .m{font-size:12px;color:var(--n-muted);margin:4px 0 0 30px}" +
    ".ntc-toast .a{display:flex;gap:6px;justify-content:flex-end;margin-top:8px}" +
    "@keyframes ntc-in{from{transform:translateY(-8px);opacity:0}}" +
    /* modal */
    ".ntc-mwrap{position:fixed;inset:0;z-index:2147483200;background:rgba(15,18,16,.55);display:flex;align-items:center;justify-content:center;padding:16px;overflow-y:auto}" +
    ".ntc-modal{width:100%;max-width:520px;background:var(--n-bg);border:1px solid var(--n-line);border-radius:10px;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);animation:ntc-in .2s ease}" +
    ".ntc-modal header{display:flex;align-items:center;gap:10px;padding:16px 18px 4px}" +
    ".ntc-modal header h3{margin:0;font-size:19px;flex:1;letter-spacing:-.01em}" +
    ".ntc-modal .mb{padding:10px 18px;display:grid;gap:12px}" +
    ".ntc-modal .mf{display:flex;justify-content:flex-end;gap:8px;padding:12px 18px 16px;flex-wrap:wrap}" +
    ".ntc-must{border-top:6px solid var(--n-bad)}" +
    ".ntc-must .big{font-size:22px;font-weight:800;letter-spacing:-.02em;line-height:1.2}" +
    ".ntc-must .txt{white-space:pre-wrap;font-size:16px}" +
    ".ntc-f{display:flex;flex-direction:column;gap:4px}" +
    ".ntc-f>span{font-size:12px;color:var(--n-muted);font-weight:500}" +
    ".ntc-in{width:100%;min-height:38px;padding:7px 10px;border:1px solid var(--n-line2);border-radius:5px;background:var(--n-raised);color:var(--n-ink);font:inherit;font-size:15px}" +
    "textarea.ntc-in{min-height:80px;resize:vertical}" +
    ".ntc-chips{display:flex;flex-wrap:wrap;gap:6px}" +
    ".ntc-chip{border:1px solid var(--n-line2);background:var(--n-raised);border-radius:999px;padding:5px 12px;font-size:13.5px;font-weight:500;color:var(--n-muted)}" +
    ".ntc-chip[aria-pressed=true]{background:var(--n-ink);border-color:var(--n-ink);color:var(--n-bg)}" +
    ".ntc-check{display:flex;gap:9px;align-items:flex-start;font-size:14px;cursor:pointer}" +
    ".ntc-check input{margin-top:3px;width:17px;height:17px;accent-color:var(--n-bad)}" +
    ".ntc-err{color:var(--n-bad);font-size:13px;font-weight:500}" +
    ".ntc-note{font-size:13px;color:var(--n-muted);line-height:1.4}" +
    "@media (max-width:560px){.ntc-mwrap{padding:0;align-items:stretch}.ntc-modal{border-radius:0;max-width:none;min-height:100%}.ntc-toasts{left:12px;right:12px;width:auto}}" +
    "@media (prefers-reduced-motion:reduce){.ntc *{animation:none!important;transition:none!important}}" +
    "@media print{.ntc{display:none!important}}";

  var IC = {
    bell: '<path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2.2 2.2 0 0 0 4 0"/>',
    notice: '<path d="M4 10v4h3l6 4V6L7 10z"/><path d="M16.5 9.5a3.5 3.5 0 0 1 0 5M19 7a7 7 0 0 1 0 10"/>',
    reminder: '<circle cx="12" cy="13" r="7"/><path d="M12 9.5V13l2.5 2M9 3h6"/>',
    deadline: '<rect x="4" y="5" width="16" height="15" rx="1.5"/><path d="M8 3v4M16 3v4M4 10h16M12 13v3"/>',
    shopflow: '<path d="M4 6l1.5 1.5L8 5M11 6h9M4 12l1.5 1.5L8 11M11 12h9M11 18h9"/>',
    mention: '<circle cx="12" cy="12" r="3.5"/><path d="M15.5 12v1.5a2.5 2.5 0 0 0 5 0V12a8.5 8.5 0 1 0-3.3 6.7"/>'
  };
  function svg(n) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + (IC[n] || IC.notice) + "</svg>"; }

  /* ---------- state ---------- */
  var S = { me: null, uid: null, items: [], reads: {}, acks: {}, people: null, open: false, tab: "in", busy: false, timer: null, sentReads: {}, pushKey: undefined };
  var root, bell, toasts, panel, scrim, popped = lsGet(LS_POP, {}), localRead = lsGet(LS_READ, {});

  function devicePeople() {
    if (typeof CFG.person === "function") { try { var p = CFG.person(); if (p && p.id) return [p.id]; } catch (e) {} }
    return lsGet(LS_PEOPLE, []) || [];
  }
  function readerKey() { var p = devicePeople(); return p.length ? "m:" + p[0] : "u:" + S.uid; }
  function myName() {
    if (typeof CFG.person === "function") { try { var p = CFG.person(); if (p && p.name) return p.name; } catch (e) {} }
    var ids = devicePeople(); if (ids.length && S.people) { var m = S.people.filter(function (x) { return x.id === ids[0]; })[0]; if (m) return m.name; }
    return S.me ? S.me.display_name : "";
  }
  function isOffice() { return S.me && (S.me.role === "admin" || S.me.role === "manager"); }
  function forMe(n) {
    if (n.cancelled || new Date(n.deliver_at).getTime() > Date.now() + 5000) return false;
    if (skip.indexOf(n.kind) >= 0) return false;
    var mine = n.created_by === S.uid;
    if (mine && n.kind !== "reminder") return false;
    switch (n.audience) {
      case "all": return true;
      case "workshop": return S.me.role === "worker" || S.me.role === "shop";
      case "office": return isOffice();
      case "user": return n.target_user === S.uid;
      case "member": return devicePeople().indexOf(n.target_member) >= 0;
    }
    return false;
  }
  function isRead(n) { return !!(S.reads[n.id] || localRead[n.id]); }
  function isAcked(n) { return !!S.acks[n.id]; }
  function unread() { return S.items.filter(function (n) { return forMe(n) && (!isRead(n) || (n.needs_ack && !isAcked(n))); }); }

  /* ---------- data ---------- */
  function load() {
    if (!W.signedIn()) return Promise.resolve();
    var since = new Date(Date.now() - 45 * 86400000).toISOString();
    return rest("notices?select=*&order=deliver_at.desc&limit=200&deliver_at=gte." + encodeURIComponent(since)).then(function (rows) {
      S.items = rows || [];
      var keys = ["u:" + S.uid].concat(devicePeople().map(function (m) { return "m:" + m; }));
      return rest("notice_reads?select=notice_id,reader,acked_at&reader=in.(" + keys.map(encodeURIComponent).join(",") + ")");
    }).then(function (rs) {
      var me = readerKey(); S.reads = {}; S.acks = {};
      (rs || []).forEach(function (r) {
        if (r.reader === me || r.reader === "u:" + S.uid) { S.reads[r.notice_id] = 1; if (r.acked_at) S.acks[r.notice_id] = 1; }
      });
      paint(); popNew();
    }).catch(function () { /* offline — try again later */ });
  }
  function markRead(ids, ack) {
    ids = ids.filter(Boolean); if (!ids.length) return Promise.resolve();
    var now = new Date().toISOString(), rk = readerKey(), nm = myName();
    ids.forEach(function (id) { localRead[id] = 1; S.reads[id] = 1; if (ack) S.acks[id] = 1; });
    lsSet(LS_READ, trimMap(localRead)); paint();
    var rows = ids.map(function (id) { var o = { notice_id: id, reader: rk, name: nm, read_at: now }; if (ack) o.acked_at = now; return o; });
    return rest("notice_reads?on_conflict=notice_id,reader", { method: "POST", body: JSON.stringify(rows), headers: { Prefer: "resolution=merge-duplicates,return=minimal" } }).catch(function () {});
  }
  function trimMap(m) { var k = Object.keys(m); if (k.length > 600) k.slice(0, k.length - 600).forEach(function (x) { delete m[x]; }); return m; }
  function people() {
    if (S.people) return Promise.resolve(S.people);
    return rest("rpc/notice_people", { method: "POST", body: "{}" }).then(function (r) { S.people = r || []; return S.people; }, function () { return []; });
  }
  function kick() {   // ask the server to push right away (the minute timer is the backup)
    W.token().then(function (t) {
      if (!t) return;
      fetch(W.cfg.url + "/functions/v1/notices-dispatch", { method: "POST", headers: W.headers(t), body: "{}" }).catch(function () {});
    });
  }

  /* ---------- UI: bell ---------- */
  function mountBell() {
    root = document.createElement("div"); root.className = "ntc"; document.body.appendChild(root);
    var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    bell = document.createElement("button");
    bell.type = "button"; bell.className = "ntc-bell"; bell.setAttribute("aria-label", "Pranešimai"); bell.title = "Pranešimai";
    bell.innerHTML = svg("bell") + "<b hidden></b>";
    bell.onclick = function () { togglePanel(); };
    var host = CFG.mount ? $(CFG.mount) : null;
    if (host) { var wrap = document.createElement("span"); wrap.className = "ntc"; wrap.style.display = "inline-flex"; wrap.appendChild(bell); host.appendChild(wrap); }
    else {
      var f = document.createElement("div"); f.className = "ntc-float quiet " + (CFG.side === "left" ? "l" : "r"); f.appendChild(bell); root.appendChild(f);
      if (CFG.bottom != null) f.style.bottom = "calc(" + CFG.bottom + "px + env(safe-area-inset-bottom,0px))";
      if (CFG.inset != null) f.style[CFG.side === "left" ? "left" : "right"] = CFG.inset + "px";
      if (CFG.z != null) f.style.zIndex = CFG.z;
    }
    toasts = document.createElement("div"); toasts.className = "ntc-toasts"; toasts.setAttribute("aria-live", "polite"); root.appendChild(toasts);
  }
  function paint() {
    if (!bell) return;
    var n = unread().length, b = bell.querySelector("b");
    b.hidden = !n; b.textContent = n > 99 ? "99+" : n;
    bell.setAttribute("aria-label", n ? "Pranešimai: " + n + " nauji" : "Pranešimai");
    var fl = bell.parentNode; if (fl && fl.classList && fl.classList.contains("ntc-float")) fl.classList.toggle("quiet", !n);
    try { if (navigator.setAppBadge) { if (n) navigator.setAppBadge(n); else navigator.clearAppBadge(); } } catch (e) {}
    placeToasts();
    if (S.open) renderPanel();
  }

  /* ---------- popups ---------- */
  var mustQueue = [], mustOpen = false;
  function popNew() {
    var fresh = S.items.filter(function (n) {
      return forMe(n) && !popped[n.id] && !isRead(n) && Date.now() - new Date(n.deliver_at).getTime() < 3 * 86400000;
    }).sort(function (a, b) { return String(a.deliver_at).localeCompare(String(b.deliver_at)); });
    if (!fresh.length) return;
    var first = !S.poppedOnce; S.poppedOnce = true;
    var must = fresh.filter(function (n) { return n.needs_ack && !isAcked(n); });
    var rest_ = fresh.filter(function (n) { return !(n.needs_ack && !isAcked(n)); });
    if (first && rest_.length > 3) rest_ = rest_.slice(-3);              // don't flood on opening
    fresh.forEach(function (n) { popped[n.id] = Date.now(); }); lsSet(LS_POP, trimMap(popped));
    var important = fresh.some(function (n) { return n.priority === "important" || n.needs_ack; });
    if (important) beep();
    bell.classList.remove("ring"); void bell.offsetWidth; bell.classList.add("ring");
    rest_.forEach(toast);
    must.forEach(function (n) { if (mustQueue.indexOf(n) < 0) mustQueue.push(n); });
    nextMust();
    if (document.visibilityState === "hidden" && !lsGet(LS_EP, null)) localNotify(fresh);
  }
  function placeToasts() {   // with the bell in a header, cards start below it so the bell stays clickable
    if (!CFG.mount || !bell || !toasts) return;
    var rb = bell.getBoundingClientRect ? bell.getBoundingClientRect() : { bottom: 0 };
    toasts.style.top = (rb.bottom > 0 && rb.bottom < 240 ? Math.round(rb.bottom + 10) : 72) + "px";
  }
  function toast(n) {
    var imp = n.priority === "important";
    var el = document.createElement("div"); el.className = "ntc-toast" + (imp ? " imp" : ""); el.setAttribute("role", imp ? "alert" : "status");
    el.innerHTML = '<div class="h"><span class="lg" aria-hidden="true"></span><div class="t">' + esc(n.title) + '</div><button type="button" class="ntc-x" aria-label="Uždaryti" style="width:26px;height:26px;font-size:17px">×</button></div>' +
      (n.body ? '<div class="b">' + esc(n.body) + "</div>" : "") +
      '<div class="m">' + esc([n.from_name, when(n.deliver_at)].filter(Boolean).join(" · ")) + "</div>" +
      '<div class="a">' + (n.url ? '<a class="ntc-btn sm" href="' + esc(n.url) + '">Atidaryti</a>' : "") + '<button type="button" class="ntc-btn sm pri" data-ok>Gerai</button></div>';
    var close = function () { if (el.parentNode) el.parentNode.removeChild(el); };
    el.querySelector(".ntc-x").onclick = close;
    el.querySelector("[data-ok]").onclick = function () { markRead([n.id]); close(); };
    var a = el.querySelector("a"); if (a) a.onclick = function () { markRead([n.id]); };
    placeToasts();
    toasts.appendChild(el);
    while (toasts.children.length > 4) toasts.removeChild(toasts.firstChild);
    if (!imp) setTimeout(close, 15000);
  }
  function nextMust() {
    if (mustOpen || !mustQueue.length) return;
    var n = mustQueue.shift(); if (isAcked(n)) return nextMust();
    mustOpen = true;
    var w = document.createElement("div"); w.className = "ntc-mwrap";
    w.innerHTML = '<div class="ntc-modal ntc-must" role="alertdialog" aria-modal="true" aria-labelledby="ntc-must-t"><header><span class="ntc-tag imp">Svarbu</span><span class="ntc-note">' +
      esc([n.from_name, when(n.deliver_at)].filter(Boolean).join(" · ")) + "</span></header>" +
      '<div class="mb"><div class="big" id="ntc-must-t">' + esc(n.title) + "</div>" + (n.body ? '<div class="txt">' + esc(n.body) + "</div>" : "") + "</div>" +
      '<div class="mf">' + (n.url ? '<a class="ntc-btn" href="' + esc(n.url) + '" data-go>Atidaryti</a>' : "") + '<button type="button" class="ntc-btn acc" data-ack>Perskaičiau</button></div></div>';
    root.appendChild(w);
    var done = function () { markRead([n.id], true); if (w.parentNode) w.parentNode.removeChild(w); mustOpen = false; setTimeout(nextMust, 200); };
    w.querySelector("[data-ack]").onclick = done;
    var g = w.querySelector("[data-go]"); if (g) g.onclick = function () { markRead([n.id], true); };
    setTimeout(function () { var b = w.querySelector("[data-ack]"); if (b) b.focus(); }, 30);
  }
  function beep() {
    try {
      var C = window.AudioContext || window.webkitAudioContext; if (!C) return;
      var c = S.ac || (S.ac = new C()); if (c.state === "suspended") c.resume();
      [0, 0.18].forEach(function (t, i) {
        var o = c.createOscillator(), g = c.createGain();
        o.type = "sine"; o.frequency.value = i ? 1046 : 784; g.gain.setValueAtTime(0.0001, c.currentTime + t);
        g.gain.exponentialRampToValueAtTime(0.18, c.currentTime + t + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + t + 0.16);
        o.connect(g); g.connect(c.destination); o.start(c.currentTime + t); o.stop(c.currentTime + t + 0.18);
      });
    } catch (e) {}
  }
  function localNotify(list) {
    try {
      if (!("Notification" in window) || Notification.permission !== "granted") return;
      list.slice(-3).forEach(function (n) { var x = new Notification(n.title, { body: n.body || "", tag: "n-" + n.id, icon: "/hub/shared/touch-180.png" }); x.onclick = function () { window.focus(); x.close(); }; });
    } catch (e) {}
  }

  /* ---------- panel ---------- */
  function togglePanel(force) {
    S.open = force != null ? force : !S.open;
    if (!panel) {
      scrim = document.createElement("div"); scrim.className = "ntc-scrim"; scrim.onclick = function () { togglePanel(false); };
      panel = document.createElement("aside"); panel.className = "ntc-panel"; panel.setAttribute("role", "dialog"); panel.setAttribute("aria-label", "Pranešimai");
      root.appendChild(scrim); root.appendChild(panel);
      panel.addEventListener("click", onPanelClick);
    }
    scrim.style.display = S.open ? "block" : "none";
    setTimeout(function () { scrim.classList.toggle("on", S.open); panel.classList.toggle("on", S.open); }, 10);
    if (S.open) { if (toasts) toasts.innerHTML = ""; renderPanel(); load(); people(); setTimeout(function () { var x = panel.querySelector(".ntc-x"); if (x) x.focus(); }, 60); }
    else if (bell) bell.focus();
  }
  function itemHtml(n, sent) {
    var imp = n.priority === "important" || n.needs_ack, un = !sent && forMe(n) && !isRead(n);
    var to = { all: "Visiems", workshop: "Dirbtuvėms", office: "Biurui", user: n.target_name || "Paskyrai", member: n.target_name || "Žmogui" }[n.audience];
    var future = new Date(n.deliver_at).getTime() > Date.now();
    var meta = sent ? ["→ " + to, (future ? "bus " : "") + when(n.deliver_at)] : [n.from_name, when(n.deliver_at)];
    var h = '<div class="ntc-item' + (un ? " unread" : "") + '" data-id="' + esc(n.id) + '"><span class="ntc-ic' + (imp ? " imp" : "") + '">' + svg(n.kind) + "</span><div>" +
      '<div class="ntc-it">' + (n.kind === "reminder" ? '<span class="ntc-tag">Priminimas</span>' : "") + (n.cancelled ? '<span class="ntc-tag">Atšaukta</span>' : "") + esc(n.title) + "</div>" +
      (n.body ? '<div class="ntc-ib clamp" data-expand>' + esc(n.body) + "</div>" : "") +
      '<div class="ntc-im">' + esc(meta.filter(Boolean).join(" · ")) + "</div>";
    var acts = [];
    if (sent) {
      var rs = S.sentReads[n.id];
      if (rs && rs.length) h += '<div class="ntc-im">Perskaitė: ' + esc(rs.map(function (r) { return r.name || "?"; }).join(", ")) + " (" + rs.length + ")</div>";
      else if (n.needs_ack && !future) h += '<div class="ntc-im">Dar niekas nepatvirtino.</div>';
      if (!n.cancelled && future) acts.push('<button type="button" class="ntc-btn sm" data-cancel="' + esc(n.id) + '">Atšaukti</button>');
    } else {
      if (n.needs_ack && !isAcked(n)) acts.push('<button type="button" class="ntc-btn sm acc" data-ack="' + esc(n.id) + '">Perskaičiau</button>');
      else if (un) acts.push('<button type="button" class="ntc-btn sm" data-read="' + esc(n.id) + '">Pažymėti perskaitytu</button>');
      if (n.url) acts.push('<a class="ntc-btn sm" href="' + esc(n.url) + '" data-open="' + esc(n.id) + '">Atidaryti</a>');
    }
    if (acts.length) h += '<div class="ntc-ia">' + acts.join("") + "</div>";
    return h + "</div></div>";
  }
  function renderPanel() {
    if (!panel) return;
    var inbox = S.items.filter(forMe), sent = S.items.filter(function (n) { return n.created_by === S.uid && n.source_key == null; });
    var all = isOffice() ? S.items.filter(function (n) { return !forMe(n) && n.created_by !== S.uid; }) : [];
    if (S.tab === "sent" && !sent.length) S.tab = "in";
    var un = unread().length;
    var list = S.tab === "sent" ? sent : S.tab === "all" ? all : inbox;
    var h = '<div class="ntc-ph"><span style="width:26px;height:26px;background:currentColor;-webkit-mask:url(' + LOGO + ') center/contain no-repeat;mask:url(' + LOGO + ') center/contain no-repeat"></span><h2>Pranešimai</h2>' +
      '<button type="button" class="ntc-x" data-close aria-label="Uždaryti">×</button></div>' +
      '<div class="ntc-acts"><button type="button" class="ntc-btn acc" data-compose>+ Pranešimas</button><button type="button" class="ntc-btn" data-remind>+ Priminimas sau</button>' +
      (un ? '<button type="button" class="ntc-btn" data-readall>Visi perskaityti</button>' : "") + "</div>" +
      '<div class="ntc-tabs" role="tablist"><button role="tab" data-tab="in" aria-selected="' + (S.tab === "in") + '">Man' + (un ? " (" + un + ")" : "") + "</button>" +
      (sent.length ? '<button role="tab" data-tab="sent" aria-selected="' + (S.tab === "sent") + '">Išsiųsti</button>' : "") +
      (all.length ? '<button role="tab" data-tab="all" aria-selected="' + (S.tab === "all") + '">Kitiems</button>' : "") + "</div>" +
      '<div class="ntc-list">' + (list.length ? list.map(function (n) { return itemHtml(n, S.tab !== "in"); }).join("")
        : '<div class="ntc-empty">' + (S.tab === "in" ? "Pranešimų nėra." : "Nieko nėra.") + "</div>") + "</div>" +
      '<div class="ntc-foot">' + footHtml() + "</div>";
    var y = panel.querySelector(".ntc-list"); var sy = y ? y.scrollTop : 0;
    panel.innerHTML = h;
    var y2 = panel.querySelector(".ntc-list"); if (y2) y2.scrollTop = sy;
    if (S.tab === "sent") loadSentReads(sent);
  }
  function loadSentReads(sent) {
    var ids = sent.map(function (n) { return n.id; }).filter(function (id) { return !S.sentReads[id]; }).slice(0, 60);
    if (!ids.length || S.loadingSent) return;
    S.loadingSent = true;
    rest("notice_reads?select=notice_id,name,acked_at&notice_id=in.(" + ids.join(",") + ")").then(function (rs) {
      ids.forEach(function (id) { S.sentReads[id] = []; });
      (rs || []).forEach(function (r) { (S.sentReads[r.notice_id] = S.sentReads[r.notice_id] || []).push(r); });
      S.loadingSent = false; renderPanel();
    }, function () { S.loadingSent = false; });
  }
  function onPanelClick(e) {
    var t = e.target, a;
    if (t.closest("[data-close]")) return togglePanel(false);
    if ((a = t.closest("[data-tab]"))) { S.tab = a.getAttribute("data-tab"); return renderPanel(); }
    if (t.closest("[data-compose]")) return compose();
    if (t.closest("[data-remind]")) return remind();
    if (t.closest("[data-readall]")) return markRead(unread().filter(function (n) { return !n.needs_ack; }).map(function (n) { return n.id; }));
    if ((a = t.closest("[data-ack]"))) return markRead([a.getAttribute("data-ack")], true);
    if ((a = t.closest("[data-read]"))) return markRead([a.getAttribute("data-read")]);
    if ((a = t.closest("[data-open]"))) { markRead([a.getAttribute("data-open")]); return; }
    if ((a = t.closest("[data-cancel]"))) {
      var id = a.getAttribute("data-cancel");
      return rest("notices?id=eq." + id, { method: "PATCH", body: JSON.stringify({ cancelled: true }), headers: { Prefer: "return=minimal" } }).then(load);
    }
    if ((a = t.closest("[data-expand]"))) { a.classList.toggle("clamp"); return; }
    if (t.closest("[data-push-on]")) return pushOn();
    if (t.closest("[data-push-off]")) return pushOff();
    if (t.closest("[data-push-test]")) return pushTest();
    if (t.closest("[data-who]")) return chooseWho();
  }

  /* ---------- device notifications (Web Push) ---------- */
  function pushSupport() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window) || !("Notification" in window)) {
      var ios = /iPhone|iPad|iPod/.test(navigator.userAgent), standalone = window.navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
      return ios && !standalone ? "ios" : "no";
    }
    return "yes";
  }
  function footHtml() {
    var sup = pushSupport(), ep = lsGet(LS_EP, null), perm = window.Notification ? Notification.permission : "default";
    var who = devicePeople(), whoNames = who.map(function (id) { var m = (S.people || []).filter(function (x) { return x.id === id; })[0]; return m ? m.name : ""; }).filter(Boolean);
    var h = "";
    if (sup === "ios") h += '<div>Telefono pranešimai iPhone/iPad veikia, kai programa pridėta į pradžios ekraną: <b>Bendrinti → „Į pradžios ekraną“</b>, tada atidarykite iš ten ir įjunkite.</div>';
    else if (sup === "no") h += "<div>Ši naršyklė telefono / kompiuterio pranešimų nepalaiko — pranešimai rodomi atidarius programą.</div>";
    else if (perm === "denied") h += "<div>Pranešimai šiai svetainei užblokuoti naršyklės nustatymuose. Leiskite juos (spynos ženkliukas adreso juostoje → Pranešimai).</div>";
    else if (ep && perm === "granted") h += '<div class="row"><span class="ntc-ok">✓ Pranešimai šiame įrenginyje įjungti</span><span><button type="button" class="ntc-btn sm" data-push-test>Išbandyti</button> <button type="button" class="ntc-btn sm" data-push-off>Išjungti</button></span></div>';
    else h += '<div class="row"><span>Gaukite pranešimus ir kai programa uždaryta.</span><button type="button" class="ntc-btn sm pri" data-push-on>Įjungti šiame įrenginyje</button></div>';
    if (typeof CFG.person !== "function")
      h += '<div class="row"><span>Šiuo įrenginiu naudojasi: <b>' + esc(whoNames.length ? whoNames.join(", ") : "nepasirinkta (paskyra „" + (S.me ? S.me.display_name : "") + "“)") + '</b></span><button type="button" class="ntc-btn sm" data-who>Keisti</button></div>';
    if (S.pushMsg) h += '<div class="ntc-err">' + esc(S.pushMsg) + "</div>";
    return h;
  }
  function swReg() {
    if (IS_SF) return navigator.serviceWorker.getRegistration().then(function (r) { if (r) return r; throw new Error("ShopFlow service worker not ready"); });
    return navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE }).then(function (r) {
      if (r.active) return r;
      return new Promise(function (res) {
        var w = r.installing || r.waiting; if (!w) return res(r);
        w.addEventListener("statechange", function () { if (w.state === "activated") res(r); });
        setTimeout(function () { res(r); }, 6000);
      });
    });
  }
  function pushKey() {
    if (S.pushKey !== undefined) return Promise.resolve(S.pushKey);
    return rest("rpc/notices_push_key", { method: "POST", body: "{}" }).then(function (k) { S.pushKey = typeof k === "string" && k ? k : null; return S.pushKey; });
  }
  function saveSub(sub) {
    var j = sub.toJSON ? sub.toJSON() : {};
    var row = { endpoint: sub.endpoint, p256dh: (j.keys && j.keys.p256dh) || abB64(sub.getKey("p256dh")), auth: (j.keys && j.keys.auth) || abB64(sub.getKey("auth")),
      members: devicePeople(), ua: navigator.userAgent.slice(0, 200), updated_at: new Date().toISOString() };
    return rest("push_subs?on_conflict=endpoint,user_id", { method: "POST", body: JSON.stringify(row), headers: { Prefer: "resolution=merge-duplicates,return=minimal" } })
      .then(function () { lsSet(LS_EP, sub.endpoint); lsSet(LS_SYNC, { at: Date.now(), uid: S.uid, who: devicePeople().join(",") }); });
  }
  function pushOn() {
    S.pushMsg = "";
    var ask = Notification.permission === "granted" ? Promise.resolve("granted") : new Promise(function (res) {
      var p = Notification.requestPermission(function (x) { res(x); }); if (p && p.then) p.then(res);
    });
    return ask.then(function (perm) {
      if (perm !== "granted") throw new Error("Pranešimai neleisti. Leiskite juos naršyklėje ir bandykite dar kartą.");
      return Promise.all([swReg(), pushKey()]);
    }).then(function (x) {
      var reg = x[0], key = x[1];
      if (!key) throw new Error("Pranešimų siuntimas dar neįjungtas serveryje (administratorius turi įrašyti raktus).");
      return reg.pushManager.getSubscription().then(function (s) {
        return s || reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlB64(key) });
      });
    }).then(saveSub).then(function () {
      if (people) people();
      renderPanel(); toastText("Pranešimai įjungti šiame įrenginyje.");
    }).catch(function (e) { S.pushMsg = e && e.message ? e.message : "Nepavyko įjungti."; renderPanel(); });
  }
  function pushOff() {
    var ep = lsGet(LS_EP, null);
    var unsub = ("serviceWorker" in navigator ? swReg().then(function (r) { return r.pushManager.getSubscription(); }).then(function (s) { return s && s.unsubscribe(); }) : Promise.resolve()).catch(function () {});
    return unsub.then(function () {
      return ep ? rest("push_subs?endpoint=eq." + encodeURIComponent(ep), { method: "DELETE", headers: { Prefer: "return=minimal" } }).catch(function () {}) : null;
    }).then(function () { lsSet(LS_EP, null); lsSet(LS_SYNC, null); renderPanel(); });
  }
  function pushTest() {
    var p = devicePeople(), body = { title: "Bandomasis pranešimas", body: "Jei matote šį pranešimą — viskas veikia.", kind: "reminder",
      from_name: myName(), source_endpoint: null };
    if (p.length) { body.audience = "member"; body.target_member = p[0]; body.target_name = myName(); }
    else { body.audience = "user"; body.target_user = S.uid; body.target_name = S.me.display_name; }
    return rest("notices", { method: "POST", body: JSON.stringify(body), headers: { Prefer: "return=minimal" } }).then(function () {
      kick(); toastText("Išsiųsta — pranešimas turėtų atsirasti per kelias sekundes.");
    }, function (e) { toastText("Nepavyko: " + e.message); });
  }
  function resync() {   // keep this device's subscription pointing at the current account / people
    var ep = lsGet(LS_EP, null); if (!ep || pushSupport() !== "yes" || Notification.permission !== "granted") return;
    var s = lsGet(LS_SYNC, {}) || {};
    if (s.uid === S.uid && s.who === devicePeople().join(",") && Date.now() - (s.at || 0) < 86400000) return;
    swReg().then(function (r) { return r.pushManager.getSubscription(); }).then(function (sub) {
      if (sub) return saveSub(sub);
      lsSet(LS_EP, null);
    }).catch(function () {});
  }

  /* ---------- who uses this device ---------- */
  function chooseWho() {
    people().then(function (list) {
      var members = list.filter(function (p) { return p.kind === "member"; }), cur = devicePeople();
      modal("Kas naudoja šį įrenginį?",
        '<div class="ntc-note">Pažymėkite save — tada asmeniniai pranešimai (paminėjimai, priskirti darbai, priminimai) ateis į šį telefoną / kompiuterį. Bendram dirbtuvių kompiuteriui nieko nežymėkite.</div>' +
        '<div style="display:grid;gap:8px">' + members.map(function (m) {
          return '<label class="ntc-check"><input type="checkbox" value="' + esc(m.id) + '"' + (cur.indexOf(m.id) >= 0 ? " checked" : "") + "> " + esc(m.name) + "</label>"; }).join("") + "</div>",
        "Išsaugoti", function (box) {
          var ids = $$("input:checked", box).map(function (i) { return i.value; });
          lsSet(LS_PEOPLE, ids); lsSet(LS_SYNC, null); resync(); load(); renderPanel();
        });
    });
  }

  /* ---------- compose / remind ---------- */
  function modal(title, inner, okText, onOk) {
    var w = document.createElement("div"); w.className = "ntc-mwrap";
    w.innerHTML = '<form class="ntc-modal" novalidate><header><h3>' + esc(title) + '</h3><button type="button" class="ntc-x" data-x aria-label="Uždaryti">×</button></header><div class="mb">' + inner +
      '<div class="ntc-err" data-err hidden></div></div><div class="mf"><button type="button" class="ntc-btn" data-x>Atšaukti</button><button type="submit" class="ntc-btn acc">' + esc(okText) + "</button></div></form>";
    root.appendChild(w);
    var f = w.querySelector("form"), close = function () { if (w.parentNode) w.parentNode.removeChild(w); document.removeEventListener("keydown", onKey, true); };
    function onKey(e) { if (e.key === "Escape") { e.stopPropagation(); close(); } }
    document.addEventListener("keydown", onKey, true);
    $$("[data-x]", w).forEach(function (b) { b.onclick = close; });
    w.addEventListener("click", function (e) { if (e.target === w) close(); });
    f.onsubmit = function (e) {
      e.preventDefault();
      var err = w.querySelector("[data-err]"); err.hidden = true;
      var r = onOk(f, function (msg) { err.textContent = msg; err.hidden = false; });
      if (r === false) return;
      if (r && r.then) { var b = f.querySelector("[type=submit]"); b.disabled = true; r.then(close, function (x) { b.disabled = false; err.textContent = (x && x.message) || "Nepavyko"; err.hidden = false; }); }
      else close();
    };
    setTimeout(function () { var i = f.querySelector("input:not([type=checkbox]),textarea"); if (i) i.focus(); }, 40);
    return w;
  }
  function chipGroup(name, opts, val) {
    return '<div class="ntc-chips" data-group="' + name + '">' + opts.map(function (o) {
      return '<button type="button" class="ntc-chip" data-v="' + esc(o[0]) + '" aria-pressed="' + (o[0] === val) + '">' + esc(o[1]) + "</button>"; }).join("") + "</div>";
  }
  function wireChips(w, onChange) {
    $$("[data-group]", w).forEach(function (g) {
      g.addEventListener("click", function (e) {
        var b = e.target.closest("[data-v]"); if (!b) return;
        $$("[data-v]", g).forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
        onChange && onChange(g.getAttribute("data-group"), b.getAttribute("data-v"));
      });
    });
  }
  function chipVal(w, name) { var b = w.querySelector('[data-group="' + name + '"] [aria-pressed="true"]'); return b ? b.getAttribute("data-v") : null; }
  function compose() {
    people().then(function (list) {
      var office = isOffice();
      var aud = office ? [["all", "Visiems"], ["workshop", "Dirbtuvėms"], ["office", "Biurui"], ["person", "Žmogui"]] : [["office", "Biurui"], ["person", "Žmogui"]];
      var opts = list.filter(function (p) { return p.kind === "member" || (office && p.role !== "shop"); });
      var w = modal("Naujas pranešimas",
        '<div class="ntc-f"><span>Kam</span>' + chipGroup("aud", aud, office ? "all" : "office") + "</div>" +
        '<label class="ntc-f" data-person hidden><span>Žmogus</span><select class="ntc-in" name="person"><option value="">— pasirinkite —</option>' +
        opts.map(function (p) { return '<option value="' + esc(p.kind + ":" + p.id) + '">' + esc(p.name) + (p.kind === "user" ? " (paskyra)" : "") + "</option>"; }).join("") + "</select></label>" +
        '<label class="ntc-f"><span>Antraštė *</span><input class="ntc-in" name="title" maxlength="200" placeholder="pvz. Penktadienį dirbame iki 15:00"></label>' +
        '<label class="ntc-f"><span>Tekstas</span><textarea class="ntc-in" name="body" maxlength="4000" placeholder="Smulkiau (neprivaloma)"></textarea></label>' +
        '<div class="ntc-f"><span>Kada</span>' + chipGroup("when", [["now", "Dabar"], ["later", "Vėliau"]], "now") +
        '<input class="ntc-in" type="datetime-local" name="at" hidden value="' + localDT(new Date(Date.now() + 3600000)) + '"></div>' +
        '<label class="ntc-check"><input type="checkbox" name="imp"> <span><b>Svarbu</b> — iššoks per visą ekraną ir reikės paspausti „Perskaičiau“ (matysite, kas perskaitė)</span></label>' +
        (location.origin === "https://app.dedesbaldai.lt" ? '<label class="ntc-check" style="accent-color:currentColor"><input type="checkbox" name="link"> <span>Pridėti nuorodą į šį puslapį</span></label>' : ""),
        "Siųsti", function (f, fail) {
          var a = chipVal(w, "aud"), title = f.elements.title.value.trim();
          if (!title) { f.elements.title.focus(); fail("Įrašykite antraštę."); return false; }
          var row = { kind: "notice", title: title, body: f.elements.body.value.trim(), from_name: myName(), audience: a, source_endpoint: lsGet(LS_EP, null) };
          if (a === "person") {
            var v = f.elements.person.value; if (!v) { fail("Pasirinkite žmogų."); return false; }
            var k = v.split(":")[0], id = v.slice(k.length + 1), p = opts.filter(function (x) { return x.kind === k && x.id === id; })[0];
            row.audience = k === "user" ? "user" : "member"; row[k === "user" ? "target_user" : "target_member"] = id; row.target_name = p ? p.name : "";
            if (!office && k === "user") { fail("Paskyrai rašykite per „Biurui“."); return false; }
          }
          if (chipVal(w, "when") === "later") {
            var t = new Date(f.elements.at.value); if (isNaN(t)) { fail("Nurodykite laiką."); return false; }
            row.deliver_at = t.toISOString();
          }
          if (f.elements.imp.checked) { row.priority = "important"; row.needs_ack = true; }
          if (f.elements.link && f.elements.link.checked) row.url = location.href.split("#")[0] + (location.hash || "");
          return rest("notices", { method: "POST", body: JSON.stringify(row), headers: { Prefer: "return=minimal" } }).then(function () {
            kick(); toastText(row.deliver_at ? "Suplanuota: " + when(row.deliver_at) : "Išsiųsta"); S.tab = "sent"; load();
          });
        });
      wireChips(w, function (g, v) {
        if (g === "aud") w.querySelector("[data-person]").hidden = v !== "person";
        if (g === "when") w.querySelector("[name=at]").hidden = v !== "later";
      });
    });
  }
  function remind() {
    var d = new Date();
    var tomorrow8 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1, 8, 0);
    var mon8 = new Date(d.getFullYear(), d.getMonth(), d.getDate() + (((8 - d.getDay()) % 7) || 7), 8, 0);
    var opts = [["1h", "Po 1 val."], ["3h", "Po 3 val."], ["tom", "Rytoj 8:00"], ["mon", "Pirmadienį 8:00"], ["pick", "Pasirinkti…"]];
    var who = myName();
    var w = modal("Priminimas sau",
      '<label class="ntc-f"><span>Ką priminti? *</span><input class="ntc-in" name="title" maxlength="200" placeholder="pvz. Paskambinti tiekėjui dėl plokščių"></label>' +
      '<label class="ntc-f"><span>Pastabos</span><textarea class="ntc-in" name="body" maxlength="2000" style="min-height:60px"></textarea></label>' +
      '<div class="ntc-f"><span>Kada</span>' + chipGroup("at", opts, "tom") + '<input class="ntc-in" type="datetime-local" name="at" hidden value="' + localDT(tomorrow8) + '"></div>' +
      '<div class="ntc-note">Ateis: <b>' + esc(who) + "</b>" + (devicePeople().length || typeof CFG.person === "function" ? "" : " (paskyra) — į visus įrenginius, kuriuose ji prisijungusi") + ".</div>",
      "Išsaugoti", function (f, fail) {
        var title = f.elements.title.value.trim(); if (!title) { f.elements.title.focus(); fail("Įrašykite, ką priminti."); return false; }
        var c = chipVal(w, "at"), t = c === "1h" ? new Date(Date.now() + 3600000) : c === "3h" ? new Date(Date.now() + 3 * 3600000) : c === "tom" ? tomorrow8 : c === "mon" ? mon8 : new Date(f.elements.at.value);
        if (isNaN(t)) { fail("Nurodykite laiką."); return false; }
        var p = devicePeople(), row = { kind: "reminder", title: title, body: f.elements.body.value.trim(), from_name: who, deliver_at: t.toISOString() };
        if (p.length) { row.audience = "member"; row.target_member = p[0]; row.target_name = who; } else { row.audience = "user"; row.target_user = S.uid; row.target_name = S.me.display_name; }
        return rest("notices", { method: "POST", body: JSON.stringify(row), headers: { Prefer: "return=minimal" } }).then(function () {
          toastText("Priminsiu " + when(row.deliver_at)); load();
        });
      });
    wireChips(w, function (g, v) { if (g === "at") w.querySelector("[name=at]").hidden = v !== "pick"; });
  }
  function toastText(msg) { toast({ id: "local-" + Date.now(), title: msg, priority: "normal" }); var last = toasts.lastChild; if (last) { var b = last.querySelector("[data-ok]"); if (b) b.onclick = function () { last.parentNode && last.parentNode.removeChild(last); }; } }

  /* ---------- start ---------- */
  function start() {
    if (S.started) return; S.started = true;
    mountBell();
    W.me().then(function (me) {
      if (!me) { bell.parentNode.style.display = "none"; return; }
      S.me = me; S.uid = (W.session() && W.session().user && W.session().user.id) || null;
      if (!S.uid) { try { S.uid = JSON.parse(atob(W.tokenNow().split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))).sub; } catch (e) {} }
      load().then(resync);
      people();
      S.timer = setInterval(function () { if (document.visibilityState !== "hidden" || !lsGet(LS_EP, null)) load(); }, POLL);
    });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible" && S.me) load(); });
    window.addEventListener("focus", function () { if (S.me) load(); });
    if ("serviceWorker" in navigator) navigator.serviceWorker.addEventListener("message", function (e) { if (e.data && /^notice-/.test(e.data.type) && S.me) load(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && S.open && !$(".ntc-mwrap")) togglePanel(false); });
    // opened from a phone notification → mark it read
    var m = /[?&]notice=([0-9a-f-]{36})/.exec(location.search); if (m) setTimeout(function () { markRead([m[1]]); }, 1500);
  }
  function boot() {
    if (W.signedIn()) start();
    else W.onChange(function (s) { if (s && !S.started) start(); });
    W.onChange(function (s) { if (!s && S.started) { S.me = null; S.items = []; paint(); if (bell) bell.parentNode.style.display = "none"; } else if (s && S.started && !S.me) { if (bell) bell.parentNode.style.display = ""; W.me().then(function (me) { S.me = me; load(); }); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  window.__notices = { S: S, load: load, compose: compose, remind: remind, togglePanel: togglePanel, forMe: forMe, unread: unread, markRead: markRead, pushOn: pushOn, kick: kick };
})();
