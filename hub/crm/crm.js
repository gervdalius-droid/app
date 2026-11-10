/* ============================================================
   Dėdės Baldai CRM — clients, deals (užklausos), next steps, timeline.

   Data: Supabase table crm_items (one row per record, office-only RLS).
   Sync:
     • every edit is queued locally first (survives reload / no internet),
       then sent in one batch to rpc/crm_put, which MERGES only the changed
       fields — two people editing the same deal never overwrite each other;
     • every 10 s (and on focus / reconnect) the app pulls "what changed
       since last time" from the server, so all computers stay in step;
     • deletes are a flag, so they reach the other computers too.
   Sign-in: workshop-auth.js, office slot (same as Pasiūlymai / Prašymai).
   ============================================================ */
(function () {
  "use strict";
  var W = window.WorkshopAuth;

  /* ---------------- constants ---------------- */
  var STAGES = [
    { id: "lead",   n: "Nauja užklausa",          s: "Užklausa" },
    { id: "meet",   n: "Matavimai / konsultacija", s: "Matavimai" },
    { id: "quote",  n: "Pasiūlymas išsiųstas",    s: "Pasiūlymas" },
    { id: "decide", n: "Laukiam sprendimo",       s: "Sprendimas" }
  ];
  var OPEN = STAGES.map(function (s) { return s.id; });
  var SNAME = { won: "Laimėta", lost: "Pralaimėta" };
  STAGES.forEach(function (s) { SNAME[s.id] = s.n; });
  var SOURCES = ["Rekomendacija", "Internetas", "Facebook / Instagram", "Pakartotinis klientas", "Partneris / architektas", "Skambutis / salonas", "Kita"];
  var LOST = ["Per brangu", "Pasirinko kitus", "Atidėjo projektą", "Nebeatsako", "Kita"];
  var ACT = { note: "Pastaba", call: "Skambutis", meet: "Susitikimas", email: "Laiškas" };
  var STALE_DAYS = 14;
  var PULL_MS = 10000;
  var PKEY = "crm.pending.v1", VKEY = "crm.ui.v1";
  var OFFER_URL = "https://app.dedesbaldai.lt/offer/";

  var ICON = {
    note: '<path d="M5 4h10l4 4v12H5z"/><path d="M14 4v5h5M8 13h8M8 17h5"/>',
    call: '<path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    meet: '<circle cx="9" cy="8" r="3.2"/><path d="M3.5 19a5.5 5.5 0 0 1 11 0"/><circle cx="17" cy="9" r="2.5"/><path d="M15.5 14.2A4.5 4.5 0 0 1 21 18.5"/>',
    email: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3.5 6.5 8.5 7 8.5-7"/>',
    sys: '<path d="M12 7v5l3 2"/><circle cx="12" cy="12" r="8"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    phone: '<path d="M6 3h3l2 5-2 1.5a11 11 0 0 0 5.5 5.5L16 13l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2z"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
    doc: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    ext: '<path d="M14 4h6v6M20 4l-9 9M18 14v6H4V6h6"/>'
  };
  function ic(n, cls) { return '<svg class="ic' + (cls ? " " + cls : "") + '" viewBox="0 0 24 24" aria-hidden="true">' + ICON[n] + "</svg>"; }

  /* ---------------- helpers ---------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(v) { return String(v == null ? "" : v).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { d = d || new Date(); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function plusDays(n) { var d = new Date(); d.setDate(d.getDate() + n); return ymd(d); }
  function nextMonday() { var d = new Date(); var add = ((8 - d.getDay()) % 7) || 7; d.setDate(d.getDate() + add); return ymd(d); }
  function parseYmd(s) { var m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s || ""); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; }
  function dayDiff(s) { var d = parseYmd(s); if (!d) return null; var t = parseYmd(ymd()); return Math.round((d - t) / 86400000); }
  var NF = (function () { try { return new Intl.NumberFormat("lt-LT", { maximumFractionDigits: 0 }); } catch (e) { return null; } })();
  function money(v) { v = Math.round(Number(v) || 0); var s = NF ? NF.format(v) : String(v); return s.replace(/[  ]/g, " ") + " €"; }
  function num(s) { if (typeof s === "number") return s; var v = parseFloat(String(s || "").replace(/[\s   €]/g, "").replace(",", ".")); return isFinite(v) ? Math.round(v * 100) / 100 : 0; }
  var WD = ["sekmadienį", "pirmadienį", "antradienį", "trečiadienį", "ketvirtadienį", "penktadienį", "šeštadienį"];
  var MON = ["saus.", "vas.", "kov.", "bal.", "geg.", "birž.", "liep.", "rugp.", "rugs.", "spal.", "lapkr.", "gruod."];
  var MONL = ["sausio", "vasario", "kovo", "balandžio", "gegužės", "birželio", "liepos", "rugpjūčio", "rugsėjo", "spalio", "lapkričio", "gruodžio"];
  var WDN = ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis"];
  function shortDate(s) { var d = parseYmd(s); if (!d) return ""; return d.getDate() + " " + MON[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? " " + d.getFullYear() : ""); }
  function dueText(s) {
    var n = dayDiff(s); if (n == null) return "";
    if (n === 0) return "Šiandien"; if (n === 1) return "Rytoj"; if (n === -1) return "Vakar";
    if (n < 0) return "Prieš " + (-n) + " d."; if (n < 7) { var d = parseYmd(s); return WDN[d.getDay()].replace(/^./, function (c) { return c.toUpperCase(); }); }
    return shortDate(s);
  }
  function dueCls(s) { var n = dayDiff(s); return n == null ? "none" : n < 0 ? "over" : n === 0 ? "today" : ""; }
  function when(iso) {
    if (!iso) return ""; var t = new Date(iso), s = (Date.now() - t.getTime()) / 1000;
    if (s < 60) return "ką tik"; if (s < 3600) return "prieš " + Math.floor(s / 60) + " min.";
    var hm = pad(t.getHours()) + ":" + pad(t.getMinutes());
    if (ymd(t) === ymd()) return "šiandien " + hm; if (ymd(t) === plusDays(-1)) return "vakar " + hm;
    return shortDate(ymd(t)) + " " + hm;
  }
  function initials(s) { return String(s || "?").trim().split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase() || "?"; }
  function rnd(n) { var a = "abcdefghijkmnpqrstuvwxyz23456789", s = "", b; try { b = crypto.getRandomValues(new Uint8Array(n)); } catch (e) { b = []; } for (var i = 0; i < n; i++) s += a[(b[i] != null ? b[i] : Math.floor(Math.random() * 256)) % a.length]; return s; }
  function uid(k) { return k + "-" + Date.now().toString(36) + "-" + rnd(6); }
  function norm(s) { var m = { "ą": "a", "č": "c", "ę": "e", "ė": "e", "į": "i", "š": "s", "ų": "u", "ū": "u", "ž": "z" }; return String(s || "").toLowerCase().replace(/[ąčęėįšųūž]/g, function (c) { return m[c]; }); }
  function digits(s) { return String(s || "").replace(/\D/g, ""); }
  function telHref(p) { var d = String(p || "").replace(/[^\d+]/g, ""); return d ? "tel:" + d : ""; }
  function lsGet(k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }
  function lsSet(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ---------------- state ---------------- */
  var S = {
    me: null, items: new Map(), pending: new Map(), cursor: null, loaded: false,
    err: null, lastSync: 0, pushing: false, pulling: false,
    view: "today", open: null,                 // open = {kind:'deal'|'client', id}
    ui: Object.assign({ pipeMode: "open", mine: false, q: "", cq: "", composer: "note" }, lsGet(VKEY, {}))
  };
  function saveUi() { lsSet(VKEY, { pipeMode: S.ui.pipeMode, mine: S.ui.mine, composer: S.ui.composer }); }
  function loadPending() { S.pending.clear(); (lsGet(PKEY, []) || []).forEach(function (p) { if (p && p.id) S.pending.set(p.id, p); }); }
  function savePending() { lsSet(PKEY, S.pending.size ? Array.from(S.pending.values()) : null); }

  /** a record as everyone will see it: server copy + my unsent changes on top */
  function rec(id) {
    var s = S.items.get(id), p = S.pending.get(id);
    if (!p) return s || null;
    return {
      id: id, kind: (s && s.kind) || p.kind,
      data: Object.assign({}, s ? s.data : {}, p.patch),
      deleted: p.deleted != null ? p.deleted : (s ? s.deleted : false),
      rev: s ? s.rev : 0, created_at: s ? s.created_at : p.at, updated_at: s ? s.updated_at : p.at, local: true
    };
  }
  var C = null;   // derived indexes, rebuilt after any change
  function idx() {
    if (C) return C;
    var c = { client: [], deal: [], task: [], activity: [], by: new Map(), tasksOf: {}, actsOfDeal: {}, actsOfClient: {}, dealsOf: {} };
    var ids = new Set(); S.items.forEach(function (v, k) { ids.add(k); }); S.pending.forEach(function (v, k) { ids.add(k); });
    ids.forEach(function (id) {
      var r = rec(id); if (!r || r.deleted || !c[r.kind]) return;
      c.by.set(id, r); c[r.kind].push(r);
    });
    function push(map, k, v) { if (!k) return; (map[k] = map[k] || []).push(v); }
    c.task.forEach(function (t) { if (!t.data.done) push(c.tasksOf, t.data.dealId || ("c:" + t.data.clientId), t); });
    Object.keys(c.tasksOf).forEach(function (k) { c.tasksOf[k].sort(byDue); });
    c.activity.forEach(function (a) { push(c.actsOfDeal, a.data.dealId, a); push(c.actsOfClient, a.data.clientId, a); });
    c.deal.forEach(function (d) { push(c.dealsOf, d.data.clientId, d); });
    return (C = c);
  }
  function byDue(a, b) { return String(a.data.due || "9999").localeCompare(String(b.data.due || "9999")); }
  function get(id) { return idx().by.get(id) || null; }
  function clientOf(d) { return d && d.data.clientId ? get(d.data.clientId) : null; }
  function nextTask(d) { var t = idx().tasksOf[d.id]; return t && t.length ? t[0] : null; }
  function lastTouch(d) {
    var a = idx().actsOfDeal[d.id] || [], m = d.created_at || "";
    a.forEach(function (x) { if (x.data.type !== "sys" && (x.data.at || "") > m) m = x.data.at; });
    if ((d.data.stageAt || "") > m.slice(0, 10)) m = d.data.stageAt;
    return m;
  }
  function staleDays(d) { var m = lastTouch(d); if (!m) return 0; return Math.floor((Date.now() - new Date(m.length === 10 ? m + "T12:00:00" : m).getTime()) / 86400000); }
  function isOpen(d) { return OPEN.indexOf(d.data.stage) >= 0; }
  function meName() { return S.me ? S.me.display_name : ""; }

  /* ---------------- writing ---------------- */
  function put(id, kind, patch, deleted) {
    var p = S.pending.get(id) || { id: id, kind: kind, patch: {}, v: 0, at: new Date().toISOString() };
    if (patch) Object.keys(patch).forEach(function (k) { p.patch[k] = patch[k] === undefined ? null : patch[k]; });
    if (deleted != null) p.deleted = !!deleted;
    p.v++; S.pending.set(id, p); savePending();
    changed(); schedulePush();
    return id;
  }
  function log(dealId, clientId, type, text) {
    return put(uid("a"), "activity", { type: type, text: text, dealId: dealId || null, clientId: clientId || null, at: new Date().toISOString(), by: meName() });
  }

  /* ---------------- sync ---------------- */
  var pushTimer = null, backoff = 0;
  function schedulePush(ms) { clearTimeout(pushTimer); pushTimer = setTimeout(push, ms == null ? 300 : ms); status(); }
  function absorb(row) {
    if (!row || !/^[A-Za-z0-9_-]{6,64}$/.test(String(row.id))) return false;
    var cur = S.items.get(row.id);
    if (!S.cursor || row.updated_at > S.cursor) S.cursor = row.updated_at;
    if (cur && cur.rev > row.rev) return false;
    if (cur && cur.rev === row.rev && cur.updated_at === row.updated_at) return false;
    S.items.set(row.id, { id: row.id, kind: row.kind, data: row.data || {}, deleted: !!row.deleted, rev: +row.rev || 0, created_at: row.created_at, updated_at: row.updated_at });
    return true;
  }
  function push() {
    if (S.pushing || !S.pending.size || !S.me) { status(); return Promise.resolve(); }
    if (navigator.onLine === false) { status(); return Promise.resolve(); }
    S.pushing = true; status();
    var batch = Array.from(S.pending.values()).slice(0, 200);
    var body = batch.map(function (p) { var o = { id: p.id, kind: p.kind, patch: p.patch }; if (p.deleted != null) o.deleted = p.deleted; return o; });
    var sent = batch.map(function (p) { return [p.id, p.v]; });
    return W.rest("rpc/crm_put", { method: "POST", body: JSON.stringify({ p_items: body }) }).then(function (rows) {
      (rows || []).forEach(absorb);
      sent.forEach(function (s) { var p = S.pending.get(s[0]); if (p && p.v === s[1]) S.pending.delete(s[0]); });
      savePending(); S.err = null; backoff = 0; S.lastSync = Date.now();
    }, function (e) {
      S.err = e; backoff = Math.min(60000, backoff ? backoff * 2 : 3000);
      if (e && (e.status === 401 || e.message === "signed-out")) relock();
      else schedulePush(backoff);
    }).then(function () {
      S.pushing = false; changed();
      if (S.pending.size && !S.err) schedulePush(30);
    });
  }
  function pull(full) {
    if (S.pulling || !S.me) return Promise.resolve();
    S.pulling = true;
    var base = "crm_items?select=id,kind,data,deleted,rev,created_at,updated_at&order=updated_at.asc,id.asc";
    if (!full && S.cursor) base += "&updated_at=gte." + encodeURIComponent(new Date(new Date(S.cursor).getTime() - 60000).toISOString());
    var any = false, PAGE = 1000;
    function page(off) {
      return W.rest(base + "&limit=" + PAGE + "&offset=" + off).then(function (rows) {
        rows = rows || []; rows.forEach(function (r) { if (absorb(r)) any = true; });
        if (rows.length === PAGE) return page(off + PAGE);
      });
    }
    return page(0).then(function () {
      S.loaded = true; S.err = S.pushing ? S.err : null; S.lastSync = Date.now();
    }, function (e) {
      if (e && (e.status === 401 || e.message === "signed-out")) relock(); else S.err = S.err || e;
    }).then(function () {
      S.pulling = false; if (any || !S.loadedOnce) { S.loadedOnce = S.loaded; changed(); } else status();
    });
  }
  function syncNow() { return push().then(function () { return pull(); }); }
  var ticker = null;
  function startTimers() {
    if (ticker) return;
    ticker = setInterval(function () {
      if (document.visibilityState === "hidden") return;
      pull(); if (S.pending.size && !S.pushing) push();
    }, PULL_MS);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") syncNow(); });
    window.addEventListener("focus", function () { syncNow(); });
    window.addEventListener("online", function () { backoff = 0; syncNow(); });
    window.addEventListener("offline", status);
    window.addEventListener("beforeunload", function (e) {
      if (S.pending.size && navigator.onLine !== false) { push(); }
    });
  }
  function status() {
    var el = $("#sync"); if (!el) return;
    var n = S.pending.size, st, tx;
    if (navigator.onLine === false) { st = "off"; tx = "Nėra interneto" + (n ? " · " + n + " laukia" : ""); }
    else if (S.err && n) { st = "err"; tx = "Nepavyko išsaugoti · bandoma vėl"; }
    else if (S.pushing || n || !S.loaded) { st = "busy"; tx = S.loaded ? "Saugoma…" : "Jungiamasi…"; }
    else { st = "ok"; tx = "Išsaugota"; }
    el.setAttribute("data-s", st); el.querySelector("span").textContent = tx;
    el.title = (st === "off" ? "Pakeitimai saugomi šiame kompiuteryje ir bus išsiųsti, kai atsiras internetas." :
      st === "ok" ? "Visi pakeitimai debesyje. Kiti kompiuteriai atsinaujina kas 10 s." : "") +
      (S.lastSync ? "\nPaskutinis sinchronizavimas: " + new Date(S.lastSync).toLocaleTimeString("lt-LT") : "") + "\nSpustelėkite, kad atnaujintumėte dabar.";
  }

  /* ---------------- render loop ---------------- */
  var raf = 0, dragging = null;
  function changed() { C = null; if (raf) return; raf = (window.requestAnimationFrame || setTimeout)(function () { raf = 0; if (dragging) { changed(); return; } paint(); }); }
  function swap(el, html) {
    if (el._html === html) return;
    var a = document.activeElement, key = a && el.contains(a) ? a.getAttribute("data-keep") : null, val, s0, s1;
    if (key) { val = a.value; try { s0 = a.selectionStart; s1 = a.selectionEnd; } catch (e) {} }
    var scrolls = $$("[data-scroll]", el).map(function (n) { return [n.getAttribute("data-scroll"), n.scrollLeft, n.scrollTop]; });
    // anything typed but not saved yet survives a refresh from another computer
    var typed = $$("input[data-keep],textarea[data-keep]", el).filter(function (n) { return n.type !== "date" && n.value !== n.defaultValue; })
      .map(function (n) { return [n.getAttribute("data-keep"), n.value]; });
    el.innerHTML = html; el._html = html;
    scrolls.forEach(function (s) { var n = el.querySelector('[data-scroll="' + s[0] + '"]'); if (n) { n.scrollLeft = s[1]; n.scrollTop = s[2]; } });
    typed.forEach(function (t) { var n = el.querySelector('[data-keep="' + t[0] + '"]'); if (n) n.value = t[1]; });
    if (key) {
      var n = el.querySelector('[data-keep="' + key + '"]');
      if (n) { if (val !== undefined && n.value !== val) n.value = val; n.focus(); try { if (s0 != null) n.setSelectionRange(s0, s1); } catch (e) {} }
    }
  }
  function paint() {
    if (!S.me) return;
    $$(".tabs [data-view]").forEach(function (b) { b.setAttribute("aria-selected", String(b.getAttribute("data-view") === S.view)); });
    var c = idx(), over = c.task.filter(function (t) { return dayDiff(t.data.due) != null && dayDiff(t.data.due) <= 0; }).length;
    var nb = $("#n-today"); nb.hidden = !over; nb.textContent = over;
    nb.className = "n" + (c.task.some(function (t) { return dayDiff(t.data.due) < 0; }) ? "" : " calm");
    var html = !S.loaded && !c.by.size ? '<div class="loading">Kraunama…</div>'
      : S.view === "pipe" ? vPipe() : S.view === "clients" ? vClients() : vToday();
    swap($("#view"), html);
    paintDrawer();
    status();
  }

  /* ---------------- views: Today ---------------- */
  function taskRow(t) {
    var d = t.data.dealId ? get(t.data.dealId) : null, cl = get(t.data.clientId) || clientOf(d);
    var sub = [d ? d.data.title : "", cl ? cl.data.name : ""].filter(Boolean).join(" · ");
    return '<div class="row" data-open="' + (d ? "deal/" + d.id : cl ? "client/" + cl.id : "") + '">' +
      '<button class="chk" role="checkbox" aria-checked="false" data-act="done" data-id="' + t.id + '" aria-label="Pažymėti atliktu: ' + esc(t.data.title) + '"><svg viewBox="0 0 24 24">' + ICON.check + "</svg></button>" +
      '<div class="main"><b>' + esc(t.data.title || "Be pavadinimo") + "</b>" + (sub ? "<span>" + esc(sub) + "</span>" : "") + "</div>" +
      '<span class="due ' + dueCls(t.data.due) + '">' + esc(dueText(t.data.due) || "Be datos") + "</span></div>";
  }
  function dealRow(d, side) {
    var cl = clientOf(d);
    return '<div class="row" data-open="deal/' + d.id + '"><div class="main"><b><span class="stage-dot" data-st="' + esc(d.data.stage) + '"></span>' + esc(d.data.title || "Be pavadinimo") + "</b><span>" +
      esc([cl ? cl.data.name : "", SNAME[d.data.stage] || ""].filter(Boolean).join(" · ")) + "</span></div>" +
      '<div class="side">' + (side || (d.data.value ? '<span class="val">' + money(d.data.value) + "</span>" : "")) + "</div></div>";
  }
  function vToday() {
    var c = idx(), now = new Date();
    var open = c.deal.filter(isOpen), mon = ymd(now).slice(0, 7);
    var wonM = c.deal.filter(function (d) { return d.data.stage === "won" && String(d.data.wonAt || "").slice(0, 7) === mon; });
    var since = plusDays(-90), closed = c.deal.filter(function (d) { var x = d.data.wonAt || d.data.lostAt; return (d.data.stage === "won" || d.data.stage === "lost") && x && x >= since; });
    var rate = closed.length ? Math.round(100 * closed.filter(function (d) { return d.data.stage === "won"; }).length / closed.length) : null;
    var sum = function (a) { return a.reduce(function (s, d) { return s + (Number(d.data.value) || 0); }, 0); };
    var tasks = c.task.slice().sort(byDue);
    var overT = tasks.filter(function (t) { return dayDiff(t.data.due) < 0; });
    var todayT = tasks.filter(function (t) { return dayDiff(t.data.due) === 0; });
    var soonT = tasks.filter(function (t) { var n = dayDiff(t.data.due); return n == null || (n > 0 && n <= 7); });
    var laterN = tasks.length - overT.length - todayT.length - soonT.length;
    var noNext = open.filter(function (d) { return !nextTask(d); }).sort(function (a, b) { return String(a.created_at).localeCompare(String(b.created_at)); });
    var fresh = open.filter(function (d) { return d.data.stage === "lead"; }).sort(function (a, b) { return String(b.created_at).localeCompare(String(a.created_at)); }).slice(0, 6);
    var name = meName();
    var h = '<div class="head"><div><h1>Labas' + (name ? ", " + esc(name) : "") + "</h1><p>" + WDN[now.getDay()].replace(/^./, function (x) { return x.toUpperCase(); }) + ", " + MONL[now.getMonth()] + " " + now.getDate() + " d.</p></div>" +
      (c.deal.length ? '<div class="toolbar"><button class="btn" data-act="view" data-v="pipe">Atidaryti sandorius</button></div>' : "") + "</div>";
    var empty = !c.deal.length && !c.client.length;
    if (!empty) h += '<dl class="kpis">' +
      '<div class="kpi"><dt>Atviri sandoriai</dt><dd>' + open.length + "<small>" + money(sum(open)) + "</small></dd></div>" +
      '<div class="kpi"><dt>Laimėta šį mėn.</dt><dd>' + wonM.length + "<small>" + money(sum(wonM)) + "</small></dd></div>" +
      '<div class="kpi"><dt>Laimime (90 d.)</dt><dd>' + (rate == null ? "—" : rate + " %") + "<small>" + (closed.length ? "iš " + closed.length : "dar nėra") + "</small></dd></div>" +
      '<div class="kpi' + (overT.length ? " alert" : "") + '"><dt>Vėluoja darbų</dt><dd>' + overT.length + "<small>" + (todayT.length ? todayT.length + " šiandien" : "") + "</small></dd></div></dl>";
    if (empty) {
      h += '<section class="panel welcome"><div><h2>Pradėkime nuo pirmos užklausos</h2>' +
        '<p class="muted">Kai paskambina ar parašo klientas — paspauskite <b>Nauja užklausa</b> (arba klavišą <kbd>N</kbd>). Viena forma sukuria klientą, sandorį ir kitą žingsnį.</p>' +
        "<ol><li>Kiekvienas sandoris visada turi <b>kitą žingsnį</b> su data — taip niekas nepamirštama.</li>" +
        "<li><b>Sandoriai</b> — tempkite korteles per etapus: užklausa → matavimai → pasiūlymas → sprendimas.</li>" +
        "<li>Viskas išsisaugo iškart ir matosi visuose biuro kompiuteriuose.</li></ol></div>" +
        '<button class="btn accent" data-act="quick">' + ic("plus") + " Nauja užklausa</button></section>";
      return h;
    }
    h += '<div class="grid2"><div>';
    h += '<section class="panel"><h2>Darbai <span class="c">' + tasks.length + '</span><button class="btn small" data-act="newtask">' + ic("plus") + " Darbas</button></h2>";
    if (!tasks.length) h += '<div class="empty"><b>Visi darbai atlikti.</b> Naujas darbas atsiras, kai sandoriui pridėsite kitą žingsnį.</div>';
    if (overT.length) h += '<div class="group-h over">Vėluoja</div>' + overT.map(taskRow).join("");
    if (todayT.length) h += '<div class="group-h">Šiandien</div>' + todayT.map(taskRow).join("");
    if (soonT.length) h += '<div class="group-h">Šią savaitę</div>' + soonT.map(taskRow).join("");
    if (laterN) h += '<div class="empty">Dar ' + laterN + " vėlesni darbai — matysite, kai priartės.</div>";
    h += "</section></div><div>";
    h += '<section class="panel"><h2>Be kito žingsnio <span class="c">' + noNext.length + "</span></h2>" +
      (noNext.length ? '<div class="empty" style="padding-bottom:6px">Šiems sandoriams nesuplanuota, ką daryti toliau.</div>' + noNext.slice(0, 8).map(function (d) { return dealRow(d, '<span class="due none">Pridėti</span>'); }).join("") +
        (noNext.length > 8 ? '<div class="empty">ir dar ' + (noNext.length - 8) + "…</div>" : "")
        : '<div class="empty">Visi atviri sandoriai turi suplanuotą kitą žingsnį.</div>') + "</section>";
    h += '<section class="panel"><h2>Naujos užklausos <span class="c">' + open.filter(function (d) { return d.data.stage === "lead"; }).length + "</span></h2>" +
      (fresh.length ? fresh.map(function (d) { return dealRow(d); }).join("") : '<div class="empty">Naujų užklausų nėra.</div>') + "</section>";
    h += "</div></div>";
    return h;
  }

  /* ---------------- views: Pipeline ---------------- */
  function matchDeal(d, q) {
    if (!q) return true; var cl = clientOf(d);
    var hay = norm([d.data.title, d.data.notes, d.data.owner, cl && cl.data.name, cl && cl.data.company, cl && cl.data.city].join(" "));
    var dq = digits(q);
    return hay.indexOf(norm(q)) >= 0 || (dq.length >= 3 && cl && digits(cl.data.phone).indexOf(dq) >= 0);
  }
  function dealOrder(a, b) {
    var ta = nextTask(a), tb = nextTask(b);
    var ka = ta ? (ta.data.due || "9998") : "0000", kb = tb ? (tb.data.due || "9998") : "0000";   // no next step first: needs attention
    return ka.localeCompare(kb) || String(b.created_at).localeCompare(String(a.created_at));
  }
  function card(d) {
    var cl = clientOf(d), t = nextTask(d), st = staleDays(d);
    return '<article class="card" tabindex="0" draggable="false" data-deal="' + d.id + '" data-open="deal/' + d.id + '">' +
      '<div class="t"><b>' + esc(d.data.title || "Be pavadinimo") + "</b>" + (d.data.value ? '<span class="val">' + money(d.data.value) + "</span>" : "") + "</div>" +
      (cl ? '<div class="cl">' + esc(cl.data.name) + (cl.data.city ? " · " + esc(cl.data.city) : "") + "</div>" : "") +
      '<div class="ft">' + (t ? '<span class="due ' + dueCls(t.data.due) + '">' + esc(dueText(t.data.due) || "Be datos") + '</span><span class="nx">' + esc(t.data.title) + "</span>"
        : '<span class="due over">Nėra kito žingsnio</span><span class="nx"></span>') +
      (st >= STALE_DAYS ? '<span class="stale" title="Nuo paskutinio kontakto">' + st + " d.</span>" : "") + "</div></article>";
  }
  function vPipe() {
    var c = idx(), q = S.ui.q.trim(), me = meName();
    var mine = function (d) { return !S.ui.mine || d.data.owner === me; };
    var h = '<div class="head"><div><h1>Sandoriai</h1><p>Tempkite kortelę į kitą etapą. Paspauskite — atsidarys visa informacija.</p></div><div class="toolbar">' +
      '<div class="filter">' + ic("search") + '<input class="inp" type="search" placeholder="Filtruoti…" data-keep="pq" data-in="q" value="' + esc(S.ui.q) + '" aria-label="Filtruoti sandorius"></div>' +
      '<div class="seg" role="group" aria-label="Kieno"><button data-act="mine" data-v="0" aria-pressed="' + !S.ui.mine + '">Visi</button><button data-act="mine" data-v="1" aria-pressed="' + S.ui.mine + '">Mano</button></div>' +
      '<div class="seg" role="group" aria-label="Būsena"><button data-act="pmode" data-v="open" aria-pressed="' + (S.ui.pipeMode === "open") + '">Atviri</button><button data-act="pmode" data-v="won" aria-pressed="' + (S.ui.pipeMode === "won") + '">Laimėti</button><button data-act="pmode" data-v="lost" aria-pressed="' + (S.ui.pipeMode === "lost") + '">Pralaimėti</button></div>' +
      "</div></div>";
    if (S.ui.pipeMode !== "open") {
      var list = c.deal.filter(function (d) { return d.data.stage === S.ui.pipeMode && mine(d) && matchDeal(d, q); })
        .sort(function (a, b) { return String(b.data.wonAt || b.data.lostAt || "").localeCompare(String(a.data.wonAt || a.data.lostAt || "")); });
      var tot = list.reduce(function (s, d) { return s + (Number(d.data.value) || 0); }, 0);
      h += '<section class="panel"><table class="table"><thead><tr><th>Sandoris</th><th class="hide-m">Klientas</th><th class="hide-m">' + (S.ui.pipeMode === "won" ? "Laimėta" : "Priežastis") + '</th><th class="r">Suma</th></tr></thead><tbody>' +
        (list.length ? list.map(function (d) {
          var cl = clientOf(d);
          return '<tr data-open="deal/' + d.id + '"><td class="nm"><b>' + esc(d.data.title || "Be pavadinimo") + "</b><span>" + esc(shortDate(d.data.wonAt || d.data.lostAt)) + '</span></td><td class="hide-m">' + esc(cl ? cl.data.name : "") +
            '</td><td class="hide-m">' + esc(S.ui.pipeMode === "won" ? shortDate(d.data.wonAt) : d.data.lostReason || "—") + '</td><td class="r val">' + (d.data.value ? money(d.data.value) : "") + "</td></tr>";
        }).join("") : '<tr><td colspan="4" class="empty">Nieko nerasta.</td></tr>') +
        "</tbody>" + (list.length ? '<tfoot><tr><td colspan="3" class="hide-m"></td><td class="r val"><b>' + money(tot) + "</b></td></tr></tfoot>" : "") + "</table></section>";
      return h;
    }
    h += '<div class="board" data-scroll="board">';
    STAGES.forEach(function (s) {
      var ds = c.deal.filter(function (d) { return d.data.stage === s.id && mine(d) && matchDeal(d, q); }).sort(dealOrder);
      var sum = ds.reduce(function (a, d) { return a + (Number(d.data.value) || 0); }, 0);
      h += '<section class="col" data-st="' + s.id + '" data-drop="' + s.id + '"><header><b><span class="stage-dot"></span>' + esc(s.n) + '<span class="k">' + ds.length + "</span></b><span>" + money(sum) + "</span></header>" +
        '<div class="cards">' + ds.map(card).join("") + "</div>" +
        '<button class="add-in" data-act="quick" data-stage="' + s.id + '">+ Pridėti</button></section>';
    });
    return h + "</div>";
  }

  /* ---------------- views: Clients ---------------- */
  function vClients() {
    var c = idx(), q = S.ui.cq.trim(), nq = norm(q), dq = digits(q);
    var list = c.client.filter(function (cl) {
      if (!q) return true;
      return norm([cl.data.name, cl.data.company, cl.data.email, cl.data.city, cl.data.address].join(" ")).indexOf(nq) >= 0 || (dq.length >= 3 && digits(cl.data.phone).indexOf(dq) >= 0);
    });
    var lastOf = function (cl) { var a = c.actsOfClient[cl.id] || [], m = cl.created_at || ""; a.forEach(function (x) { if ((x.data.at || "") > m) m = x.data.at; }); return m; };
    list.sort(function (a, b) { return norm(a.data.name).localeCompare(norm(b.data.name), "lt"); });
    var h = '<div class="head"><div><h1>Klientai</h1><p>' + c.client.length + " klient" + (c.client.length % 10 === 1 && c.client.length % 100 !== 11 ? "as" : "ai") + '</p></div><div class="toolbar">' +
      '<div class="filter">' + ic("search") + '<input class="inp" type="search" placeholder="Vardas, telefonas, miestas…" data-keep="cq" data-in="cq" value="' + esc(S.ui.cq) + '" aria-label="Ieškoti klientų"></div>' +
      '<button class="btn" data-act="newclient">' + ic("plus") + " Naujas klientas</button></div></div>";
    h += '<section class="panel"><table class="table"><thead><tr><th>Klientas</th><th>Telefonas</th><th class="hide-m">El. paštas</th><th class="hide-m">Miestas</th><th class="hide-m r">Atviri sandoriai</th><th class="hide-m r">Paskutinis kontaktas</th></tr></thead><tbody>' +
      (list.length ? list.map(function (cl) {
        var ds = (c.dealsOf[cl.id] || []).filter(isOpen), sum = ds.reduce(function (s, d) { return s + (Number(d.data.value) || 0); }, 0);
        return '<tr data-open="client/' + cl.id + '"><td class="nm"><b>' + esc(cl.data.name || "Be vardo") + "</b>" + (cl.data.company ? "<span>" + esc(cl.data.company) + "</span>" : "") + "</td>" +
          '<td class="mono">' + (cl.data.phone ? '<a href="' + esc(telHref(cl.data.phone)) + '" data-stop>' + esc(cl.data.phone) + "</a>" : "") + "</td>" +
          '<td class="hide-m">' + (cl.data.email ? '<a href="mailto:' + esc(cl.data.email) + '" data-stop>' + esc(cl.data.email) + "</a>" : "") + "</td>" +
          '<td class="hide-m">' + esc(cl.data.city) + '</td><td class="hide-m r val">' + (ds.length ? ds.length + " · " + money(sum) : '<span class="muted">—</span>') + '</td><td class="hide-m r muted">' + esc(when(lastOf(cl))) + "</td></tr>";
      }).join("") : '<tr><td colspan="6" class="empty">' + (q ? "Pagal „" + esc(q) + "“ nieko nerasta." : "Klientų dar nėra — jie atsiranda kuriant užklausą.") + "</td></tr>") +
      "</tbody></table></section>";
    return h;
  }

  /* ---------------- drawer ---------------- */
  function paintDrawer() {
    var dr = $("#drawer"), on = !!S.open, r = on ? get(S.open.id) : null;
    dr.classList.toggle("on", on); $("#scrim").classList.toggle("on", on); dr.setAttribute("aria-hidden", String(!on));
    document.body.style.overflow = on ? "hidden" : "";
    if (!on) { if (dr._html) { swap(dr, ""); } return; }
    if (!r) {
      swap(dr, '<div class="d-head"><div class="d-bar"><button class="btn small ghost x" data-act="close">' + ic("x") + ' Uždaryti</button></div></div><div class="d-body"><div class="empty">' +
        (S.loaded ? "Šis įrašas ištrintas arba nerastas." : "Kraunama…") + "</div></div>");
      return;
    }
    swap(dr, r.kind === "deal" ? dDeal(r) : dClient(r));
  }
  function tl(acts) {
    acts = (acts || []).slice().sort(function (a, b) { return String(b.data.at).localeCompare(String(a.data.at)); });
    if (!acts.length) return '<div class="empty" style="padding:8px 0 0">Kol kas įrašų nėra.</div>';
    return '<ul class="tl">' + acts.map(function (a) {
      var t = a.data.type, sys = t === "sys";
      return '<li class="' + (sys ? "sys" : "") + '"><span class="ti">' + ic(ICON[t] ? t : "note") + '</span><div><div class="tx">' + (sys ? "" : "<b>" + esc(ACT[t] || "Pastaba") + ".</b> ") + esc(a.data.text) + "</div>" +
        '<div class="mt">' + esc([a.data.by, when(a.data.at)].filter(Boolean).join(" · ")) + (sys ? "" : ' · <button class="linkish" style="font-weight:400;font-size:12px" data-act="delact" data-id="' + a.id + '">ištrinti</button>') + "</div></div></li>";
    }).join("") + "</ul>";
  }
  function composer(target) {
    var t = S.ui.composer || "note";
    return '<div class="composer"><div class="chips" role="group" aria-label="Įrašo tipas">' + Object.keys(ACT).map(function (k) {
      return '<button class="chip" data-act="ctype" data-v="' + k + '" aria-pressed="' + (t === k) + '">' + esc(ACT[k]) + "</button>"; }).join("") + "</div>" +
      '<textarea class="inp" rows="2" data-keep="comp" id="comp" placeholder="' + (t === "call" ? "Apie ką kalbėjote?" : t === "meet" ? "Kas sutarta susitikime?" : t === "email" ? "Ką parašėte / gavote?" : "Pastaba…") + '"></textarea>' +
      '<div class="bar"><span class="muted" style="font-size:12px">Ctrl + Enter — išsaugoti</span><button class="btn primary small" data-act="addact" data-target="' + target + '">Įrašyti</button></div></div>';
  }
  function nextBlock(d) {
    var ts = (idx().tasksOf[d.id] || []);
    var h = '<div class="d-sec"><h3>Kitas žingsnis</h3>';
    if (ts.length) h += ts.map(function (t) {
      return '<div class="task-line"><button class="chk" role="checkbox" aria-checked="false" data-act="done" data-id="' + t.id + '" aria-label="Atlikta"><svg viewBox="0 0 24 24">' + ICON.check + "</svg></button>" +
        '<div class="tt">' + esc(t.data.title) + '</div><span class="due ' + dueCls(t.data.due) + '">' + esc(dueText(t.data.due) || "Be datos") + "</span>" +
        '<button class="btn small ghost" data-act="deltask" data-id="' + t.id + '" aria-label="Pašalinti">' + ic("x") + "</button></div>";
    }).join("");
    else if (isOpen(d)) h += '<div class="hint">Nesuplanuota, ką daryti toliau — pridėkite žingsnį, kad nepamirštumėte.</div>';
    if (isOpen(d) || ts.length) {
      var dv = S.ui.nextDue || plusDays(1);
      h += '<div class="next-add"><input class="inp" id="nextTitle" data-keep="nt" placeholder="Pvz. Paskambinti dėl matavimų" list="nextIdeas">' +
        '<input class="inp" type="date" id="nextDue" data-keep="nd" value="' + esc(dv) + '" aria-label="Data">' +
        '<div class="chips">' + [["Šiandien", 0], ["Rytoj", 1], ["Po 3 d.", 3], ["Kitą savaitę", "mon"], ["Po 2 sav.", 14]].map(function (x) {
          var v = x[1] === "mon" ? nextMonday() : plusDays(x[1]);
          return '<button class="chip" data-act="due" data-v="' + v + '" aria-pressed="' + (v === dv) + '">' + x[0] + "</button>"; }).join("") +
        '<button class="btn primary small" style="margin-left:auto" data-act="addtask" data-deal="' + d.id + '">Pridėti</button></div></div>' +
        '<datalist id="nextIdeas"><option value="Paskambinti"><option value="Suderinti matavimus"><option value="Atvykti matuoti"><option value="Paruošti pasiūlymą"><option value="Išsiųsti pasiūlymą"><option value="Paskambinti dėl pasiūlymo"><option value="Suderinti sutartį"><option value="Gauti avansą"></datalist>';
    }
    return h + "</div>";
  }
  function dDeal(d) {
    var cl = clientOf(d), st = d.data.stage, si = OPEN.indexOf(st), c = idx();
    var clients = c.client.slice().sort(function (a, b) { return norm(a.data.name).localeCompare(norm(b.data.name), "lt"); });
    var owners = {}; c.deal.forEach(function (x) { if (x.data.owner) owners[x.data.owner] = 1; }); if (meName()) owners[meName()] = 1;
    var h = '<div class="d-head"><div class="d-bar"><span class="kind">Sandoris</span><span>· sukurta ' + esc(when(d.created_at)) + (d.local ? " · <i>saugoma…</i>" : "") + "</span>" +
      '<button class="btn small ghost x" data-act="close" aria-label="Uždaryti">' + ic("x") + " <kbd>Esc</kbd></button></div>" +
      '<input class="d-title" data-f="title" data-keep="f:title" value="' + esc(d.data.title) + '" aria-label="Pavadinimas" placeholder="Ko reikia klientui?">' +
      '<div class="stepper" role="group" aria-label="Etapas">' + STAGES.map(function (s, i) {
        return '<button data-st="' + s.id + '" class="' + (s.id === st ? "cur" : (si > i || st === "won") ? "past" : "") + '" data-act="stage" data-v="' + s.id + '" aria-pressed="' + (s.id === st) + '" title="' + esc(s.n) + '">' + esc(s.s) + "</button>"; }).join("") + "</div>";
    if (st === "won") h += '<div class="banner won">' + ic("check") + " Laimėta " + esc(shortDate(d.data.wonAt)) + '<button class="btn small" data-act="stage" data-v="decide">Atidaryti iš naujo</button></div>';
    else if (st === "lost") h += '<div class="banner lost">Pralaimėta ' + esc(shortDate(d.data.lostAt)) + (d.data.lostReason ? " — " + esc(d.data.lostReason) : "") + '<button class="btn small" data-act="stage" data-v="decide">Atidaryti iš naujo</button></div>';
    else if (S.ui.lostPick === d.id) h += '<div class="d-sec" style="margin:10px 0 0"><h3>Kodėl pralaimėjome?</h3><div class="chips">' + LOST.map(function (r) { return '<button class="chip" data-act="lost" data-v="' + esc(r) + '">' + esc(r) + "</button>"; }).join("") + '<button class="chip" data-act="lostcancel">Atšaukti</button></div></div>';
    else h += '<div class="closebtns"><button class="btn ok" data-act="won">' + ic("check") + ' Laimėta</button><button class="btn bad" data-act="lostask">' + ic("x") + " Pralaimėta</button></div>";
    h += '</div><div class="d-body" data-scroll="db">';
    // client
    h += '<div class="d-sec"><h3>Klientas' + (cl ? '<button class="btn small" data-act="openclient" data-id="' + cl.id + '">Kortelė</button>' : "") + "</h3>";
    if (cl) h += '<div class="contact"><span class="av">' + esc(initials(cl.data.name)) + '</span><div class="info"><b>' + esc(cl.data.name) + (cl.data.company ? ' <span style="font-weight:400">· ' + esc(cl.data.company) + "</span>" : "") + "</b>" +
      [cl.data.phone ? '<a href="' + esc(telHref(cl.data.phone)) + '">' + ic("phone") + " " + esc(cl.data.phone) + "</a>" : "",
       cl.data.email ? '<a href="mailto:' + esc(cl.data.email) + '">' + esc(cl.data.email) + "</a>" : "",
       cl.data.city ? "<span>" + esc(cl.data.city) + "</span>" : ""].filter(Boolean).join(" ") + "</div></div>";
    h += '<label class="field" style="margin-top:10px"><span>' + (cl ? "Pakeisti klientą" : "Pasirinkite klientą") + '</span><select class="inp" data-f="clientId" data-keep="f:clientId"><option value="">—</option>' +
      clients.map(function (x) { return '<option value="' + x.id + '"' + (cl && x.id === cl.id ? " selected" : "") + ">" + esc(x.data.name) + (x.data.phone ? " · " + esc(x.data.phone) : "") + "</option>"; }).join("") + "</select></label></div>";
    // next step
    h += nextBlock(d);
    // details
    h += '<div class="d-sec"><h3>Informacija</h3><div class="fgrid">' +
      '<label class="field"><span>Suma, €</span><input class="inp mono" inputmode="decimal" data-f="value" data-keep="f:value" value="' + esc(d.data.value ? (NF ? NF.format(d.data.value).replace(/[\u00a0\u202f]/g, " ") : String(d.data.value)) : "") + '" placeholder="0"></label>' +
      '<label class="field"><span>Atsakingas</span><input class="inp" data-f="owner" data-keep="f:owner" list="owners" value="' + esc(d.data.owner) + '"></label>' +
      '<label class="field"><span>Šaltinis</span><select class="inp" data-f="source" data-keep="f:source"><option value="">—</option>' + SOURCES.map(function (s) { return '<option' + (s === d.data.source ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field"><span>Pasiūlymo nr.</span><input class="inp" data-f="offerRef" data-keep="f:offerRef" value="' + esc(d.data.offerRef) + '" placeholder="pvz. P-2026-041"></label>' +
      '<label class="field wide"><span>Pastabos (ko nori klientas, matmenys, medžiagos)</span><textarea class="inp" rows="3" data-f="notes" data-keep="f:notes">' + esc(d.data.notes) + "</textarea></label>" +
      '</div><datalist id="owners">' + Object.keys(owners).map(function (o) { return '<option value="' + esc(o) + '">'; }).join("") + "</datalist></div>";
    // timeline
    h += '<div class="d-sec"><h3>Istorija</h3>' + composer("deal:" + d.id) + tl(c.actsOfDeal[d.id]) + "</div>";
    h += '<div class="d-foot"><a class="btn" href="' + OFFER_URL + '" target="_blank" rel="noopener">' + ic("doc") + ' Pasiūlymų programa</a><button class="btn ghost bad" data-act="deldeal" data-id="' + d.id + '">' + ic("trash") + " Ištrinti sandorį</button></div>";
    return h + "</div>";
  }
  function dClient(cl) {
    var c = idx(), ds = (c.dealsOf[cl.id] || []).slice().sort(function (a, b) { return (isOpen(b) - isOpen(a)) || String(b.created_at).localeCompare(String(a.created_at)); });
    var acts = c.actsOfClient[cl.id] || [];
    var h = '<div class="d-head"><div class="d-bar"><span class="kind">Klientas</span><span>· nuo ' + esc(shortDate(String(cl.created_at || "").slice(0, 10))) + (cl.local ? " · <i>saugoma…</i>" : "") + "</span>" +
      '<button class="btn small ghost x" data-act="close" aria-label="Uždaryti">' + ic("x") + " <kbd>Esc</kbd></button></div>" +
      '<input class="d-title" data-f="name" data-keep="f:name" value="' + esc(cl.data.name) + '" aria-label="Vardas" placeholder="Vardas Pavardė">' +
      '<div class="toolbar" style="margin-top:8px">' + (cl.data.phone ? '<a class="btn small" href="' + esc(telHref(cl.data.phone)) + '">' + ic("phone") + " Skambinti</a>" : "") +
      (cl.data.email ? '<a class="btn small" href="mailto:' + esc(cl.data.email) + '">' + ic("email") + " Rašyti</a>" : "") +
      '<button class="btn small" data-act="quick" data-client="' + cl.id + '">' + ic("plus") + " Naujas sandoris</button></div></div>";
    h += '<div class="d-body" data-scroll="db"><div class="d-sec"><h3>Kontaktai</h3><div class="fgrid">' +
      fld("Telefonas", "phone", cl.data.phone, 'inputmode="tel" class="inp mono"') + fld("El. paštas", "email", cl.data.email, 'inputmode="email"') +
      fld("Įmonė", "company", cl.data.company) + fld("Miestas", "city", cl.data.city) +
      fld("Adresas (objektas)", "address", cl.data.address, "", true) +
      '<label class="field"><span>Šaltinis</span><select class="inp" data-f="source" data-keep="f:source"><option value="">—</option>' + SOURCES.map(function (s) { return '<option' + (s === cl.data.source ? " selected" : "") + ">" + esc(s) + "</option>"; }).join("") + "</select></label>" +
      '<label class="field wide"><span>Pastabos</span><textarea class="inp" rows="2" data-f="notes" data-keep="f:notes">' + esc(cl.data.notes) + "</textarea></label></div></div>";
    h += '<div class="d-sec"><h3>Sandoriai <span style="letter-spacing:0">' + ds.length + "</span></h3>" + (ds.length ? ds.map(function (d) {
      var t = nextTask(d);
      return '<div class="minirow" data-open="deal/' + d.id + '"><span class="stage-dot" data-st="' + esc(d.data.stage) + '"></span><div class="main"><b>' + esc(d.data.title || "Be pavadinimo") + '</b><div class="muted" style="font-size:13px">' + esc(SNAME[d.data.stage] || "") +
        (t ? " · " + esc(dueText(t.data.due)) + ": " + esc(t.data.title) : "") + "</div></div>" + (d.data.value ? '<span class="val">' + money(d.data.value) + "</span>" : "") + "</div>";
    }).join("") : '<div class="empty" style="padding:4px 0">Sandorių nėra.</div>') + "</div>";
    h += '<div class="d-sec"><h3>Istorija</h3>' + composer("client:" + cl.id) + tl(acts) + "</div>";
    h += '<div class="d-foot"><span></span><button class="btn ghost bad" data-act="delclient" data-id="' + cl.id + '">' + ic("trash") + " Ištrinti klientą</button></div>";
    return h + "</div>";
  }
  function fld(label, f, v, attrs, wide) {
    attrs = attrs || "";
    if (attrs.indexOf("class=") < 0) attrs += ' class="inp"';
    return '<label class="field' + (wide ? " wide" : "") + '"><span>' + esc(label) + "</span><input " + attrs + ' data-f="' + f + '" data-keep="f:' + f + '" value="' + esc(v) + '"></label>';
  }

  /* ---------------- actions ---------------- */
  function setStage(id, st, reason) {
    var d = get(id); if (!d || d.data.stage === st && !reason) return;
    var from = d.data.stage, p = { stage: st, stageAt: ymd() };
    if (st === "won") { p.wonAt = ymd(); p.lostAt = null; p.lostReason = null; }
    else if (st === "lost") { p.lostAt = ymd(); p.lostReason = reason || ""; p.wonAt = null; }
    else { p.wonAt = null; p.lostAt = null; p.lostReason = null; }
    put(id, "deal", p);
    log(id, d.data.clientId, "sys", (SNAME[from] || "—") + " → " + SNAME[st] + (reason ? " (" + reason + ")" : ""));
    if (st === "won") toast("Sandoris laimėtas. Puiku!");
  }
  function completeTask(id) {
    var t = get(id); if (!t) return;
    put(id, "task", { done: true, doneAt: new Date().toISOString(), doneBy: meName() });
    log(t.data.dealId, t.data.clientId, "sys", "Atlikta: " + t.data.title);
    var d = t.data.dealId ? get(t.data.dealId) : null;
    var more = d && (idx().tasksOf[d.id] || []).length;
    toast("Atlikta: " + t.data.title, "Atšaukti", function () { put(id, "task", { done: false, doneAt: null }); log(t.data.dealId, t.data.clientId, "sys", "Grąžinta: " + t.data.title); });
    if (d && isOpen(d) && !more) {
      if (!S.open || S.open.id !== d.id) openRec("deal", d.id);
      setTimeout(function () { var n = $("#nextTitle"); if (n) n.focus(); }, 300);
    }
  }
  function addTask(dealId, clientId, title, due) {
    title = String(title || "").trim(); if (!title) return false;
    var d = dealId ? get(dealId) : null;
    put(uid("t"), "task", { title: title, due: due || null, done: false, dealId: dealId || null, clientId: clientId || (d && d.data.clientId) || null, owner: meName(), by: meName() });
    return true;
  }
  function softDelete(id, kind, label, extra) {
    put(id, kind, null, true); (extra || []).forEach(function (x) { put(x.id, x.kind, null, true); });
    toast(label + " ištrintas", "Atšaukti", function () { put(id, kind, null, false); (extra || []).forEach(function (x) { put(x.id, x.kind, null, false); }); });
  }

  /* ---------------- quick add ---------------- */
  function quickAdd(opts) {
    opts = opts || {};
    var pre = opts.client ? get(opts.client) : null;
    var st = { client: pre, src: pre ? pre.data.source || "" : "", due: plusDays(1) };
    var layer = $("#layer");
    layer.innerHTML = '<div class="modal-wrap" data-modal><form class="modal" id="qa" autocomplete="off" novalidate><header><h2>' + (pre ? "Naujas sandoris" : "Nauja užklausa") + '</h2><button type="button" class="btn small ghost" data-act="mclose">' + ic("x") + " <kbd>Esc</kbd></button></header><div class=\"mb\">" +
      '<div id="qaClient"></div>' +
      '<label class="field"><span>Ko reikia? *</span><input class="inp" name="what" required placeholder="Pvz. Virtuvės baldai, spinta į nišą"></label>' +
      '<div class="fgrid"><label class="field"><span>Apytikslė suma, €</span><input class="inp mono" name="value" inputmode="decimal" placeholder="neprivaloma"></label>' +
      '<label class="field"><span>Etapas</span><select class="inp" name="stage">' + STAGES.map(function (s) { return '<option value="' + s.id + '"' + (s.id === (opts.stage || "lead") ? " selected" : "") + ">" + esc(s.n) + "</option>"; }).join("") + "</select></label></div>" +
      '<div class="field"><span>Iš kur sužinojo?</span><div class="chips" id="qaSrc">' + SOURCES.map(function (s) { return '<button type="button" class="chip" data-src="' + esc(s) + '" aria-pressed="' + (s === st.src) + '">' + esc(s) + "</button>"; }).join("") + "</div></div>" +
      '<div class="field"><span>Kitas žingsnis</span><div class="next-add" style="margin:0"><input class="inp" name="next" value="Paskambinti" list="qaIdeas"><input class="inp" type="date" name="due" value="' + st.due + '"><div class="chips" id="qaDue">' +
      [["Šiandien", 0], ["Rytoj", 1], ["Po 3 d.", 3], ["Kitą savaitę", "mon"]].map(function (x) { var v = x[1] === "mon" ? nextMonday() : plusDays(x[1]); return '<button type="button" class="chip" data-due="' + v + '" aria-pressed="' + (v === st.due) + '">' + x[0] + "</button>"; }).join("") +
      '</div></div><datalist id="qaIdeas"><option value="Paskambinti"><option value="Suderinti matavimus"><option value="Atvykti matuoti"><option value="Paruošti pasiūlymą"><option value="Išsiųsti pasiūlymą"></datalist></div>' +
      '<label class="field"><span>Pastabos</span><textarea class="inp" name="notes" rows="2" placeholder="Matmenys, pageidavimai, terminai…"></textarea></label>' +
      '<div class="err" id="qaErr" hidden></div></div><div class="mf"><button type="button" class="btn" data-act="mclose">Atšaukti</button><button type="submit" class="btn accent">Išsaugoti <kbd>Ctrl ↵</kbd></button></div></form></div>';
    var f = $("#qa"), box = $("#qaClient");
    function drawClient() {
      if (st.client) {
        box.innerHTML = '<div class="field"><span>Klientas</span><div class="picked">' + ic("user") + "<b>" + esc(st.client.data.name) + "</b><span class=\"muted\">" + esc(st.client.data.phone || st.client.data.email || "") + '</span><button type="button" class="btn small ghost" data-unpick aria-label="Keisti klientą">' + ic("x") + "</button></div></div>";
        box.querySelector("[data-unpick]").onclick = function () { st.client = null; drawClient(); box.querySelector("[name=cname]").focus(); };
        return;
      }
      box.innerHTML = '<div class="fgrid"><label class="field wide"><span>Klientas *</span><input class="inp" name="cname" placeholder="Vardas Pavardė arba telefonas" required><div class="suggest" id="qaSug" hidden></div></label>' +
        '<label class="field"><span>Telefonas</span><input class="inp mono" name="phone" inputmode="tel" placeholder="+370…"></label><label class="field"><span>El. paštas</span><input class="inp" name="email" inputmode="email"></label>' +
        '<label class="field wide"><span>Miestas</span><input class="inp" name="city" placeholder="neprivaloma"></label></div>';
      var inp = box.querySelector("[name=cname]"), sug = $("#qaSug"), phone = box.querySelector("[name=phone]");
      function suggest() {
        var q = inp.value.trim() || phone.value.trim(), nq = norm(q), dq = digits(q);
        if (q.length < 2) { sug.hidden = true; return; }
        var hits = idx().client.filter(function (c) { return norm(c.data.name).indexOf(nq) >= 0 || (dq.length >= 4 && digits(c.data.phone).indexOf(dq) >= 0); }).slice(0, 5);
        sug.hidden = !hits.length;
        sug.innerHTML = hits.length ? '<div class="group-h" style="padding:6px 10px 2px">Jau yra — pasirinkite, kad nesidubliuotų</div>' + hits.map(function (c) { return '<button type="button" data-pick="' + c.id + '">' + ic("user") + esc(c.data.name) + "<span>" + esc(c.data.phone || c.data.city || "") + "</span></button>"; }).join("") : "";
        $$("[data-pick]", sug).forEach(function (b) { b.onclick = function () { st.client = get(b.getAttribute("data-pick")); st.src = st.src || st.client.data.source || ""; drawClient(); f.elements.what.focus(); }; });
      }
      inp.oninput = suggest; phone.oninput = suggest;
      if (/^[\d\s+()-]{6,}$/.test(opts.q || "")) phone.value = opts.q; else if (opts.q) inp.value = opts.q;
    }
    drawClient();
    $$("#qaSrc [data-src]").forEach(function (b) { b.onclick = function () { st.src = st.src === b.getAttribute("data-src") ? "" : b.getAttribute("data-src"); $$("#qaSrc [data-src]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-src") === st.src)); }); }; });
    $$("#qaDue [data-due]").forEach(function (b) { b.onclick = function () { f.elements.due.value = b.getAttribute("data-due"); $$("#qaDue [data-due]").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); }); }; });
    f.elements.due.onchange = function () { $$("#qaDue [data-due]").forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-due") === f.elements.due.value)); }); };
    f.onkeydown = function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); f.requestSubmit ? f.requestSubmit() : f.onsubmit(e); } };
    f.onsubmit = function (e) {
      if (e && e.preventDefault) e.preventDefault();
      var err = $("#qaErr"), title = f.elements.what.value.trim(), cname = f.elements.cname ? f.elements.cname.value.trim() : "";
      var phoneV = f.elements.phone ? f.elements.phone.value.trim() : "";
      if (!st.client && !cname && !phoneV) { err.textContent = "Įrašykite kliento vardą arba telefoną."; err.hidden = false; (f.elements.cname).focus(); return; }
      if (!title) { err.textContent = "Trumpai parašykite, ko reikia (pvz. „Virtuvė“)."; err.hidden = false; f.elements.what.focus(); return; }
      var cid = st.client ? st.client.id : put(uid("c"), "client", { name: cname || phoneV, phone: phoneV, email: f.elements.email.value.trim(), city: f.elements.city.value.trim(), source: st.src, by: meName() });
      var did = put(uid("d"), "deal", { title: title, clientId: cid, stage: f.elements.stage.value, stageAt: ymd(), value: num(f.elements.value.value) || null, source: st.src, notes: f.elements.notes.value.trim(), owner: meName() });
      log(did, cid, "sys", "Sukurta: " + SNAME[f.elements.stage.value]);
      addTask(did, cid, f.elements.next.value, f.elements.due.value);
      closeModal(); openRec("deal", did);
      toast("Užklausa išsaugota");
    };
    setTimeout(function () { var n = st.client ? f.elements.what : box.querySelector("[name=cname]"); if (n) n.focus(); }, 30);
  }
  function simpleModal(title, fields, onOk) {
    $("#layer").innerHTML = '<div class="modal-wrap" data-modal><form class="modal" id="sm" autocomplete="off"><header><h2>' + esc(title) + '</h2><button type="button" class="btn small ghost" data-act="mclose">' + ic("x") + '</button></header><div class="mb">' +
      fields + '</div><div class="mf"><button type="button" class="btn" data-act="mclose">Atšaukti</button><button type="submit" class="btn accent">Išsaugoti</button></div></form></div>';
    var f = $("#sm"); f.onsubmit = function (e) { e.preventDefault(); if (onOk(f) !== false) closeModal(); };
    setTimeout(function () { var n = f.querySelector("input,textarea"); if (n) n.focus(); }, 30);
  }
  function closeModal() { $("#layer").innerHTML = ""; }

  /* ---------------- search palette ---------------- */
  function palette() {
    $("#layer").innerHTML = '<div class="modal-wrap" data-modal><div class="modal palette" role="dialog" aria-label="Paieška"><div class="q">' + ic("search") + '<input id="pq" placeholder="Kliento vardas, telefonas, sandoris…" aria-label="Paieška"><kbd>Esc</kbd></div><div class="res" id="pres"></div>' +
      '<div class="foot"><span><kbd>↑</kbd> <kbd>↓</kbd> pasirinkti</span><span><kbd>↵</kbd> atidaryti</span></div></div></div>';
    var inp = $("#pq"), res = $("#pres"), sel = 0, items = [];
    function draw() {
      var q = inp.value.trim(), nq = norm(q), dq = digits(q), c = idx();
      var cl = c.client.filter(function (x) { return !q || norm([x.data.name, x.data.company, x.data.email, x.data.city, x.data.address].join(" ")).indexOf(nq) >= 0 || (dq.length >= 3 && digits(x.data.phone).indexOf(dq) >= 0); });
      var ds = c.deal.filter(function (d) { return matchDeal(d, q); });
      if (!q) { ds = ds.filter(isOpen).sort(function (a, b) { return String(b.updated_at).localeCompare(String(a.updated_at)); }); cl = cl.sort(function (a, b) { return String(b.updated_at).localeCompare(String(a.updated_at)); }); }
      cl = cl.slice(0, 6); ds = ds.slice(0, 8);
      items = [];
      var h = "";
      if (ds.length) { h += '<div class="gh">Sandoriai</div>'; ds.forEach(function (d) { var x = clientOf(d); items.push("deal/" + d.id); h += '<button data-i="' + (items.length - 1) + '"><span class="stage-dot" data-st="' + esc(d.data.stage) + '"></span><span class="main"><b>' + esc(d.data.title) + "</b><span>" + esc([x && x.data.name, SNAME[d.data.stage]].filter(Boolean).join(" · ")) + "</span></span>" + (d.data.value ? '<span class="val">' + money(d.data.value) + "</span>" : "") + "</button>"; }); }
      if (cl.length) { h += '<div class="gh">Klientai</div>'; cl.forEach(function (x) { items.push("client/" + x.id); h += '<button data-i="' + (items.length - 1) + '">' + ic("user") + '<span class="main"><b>' + esc(x.data.name) + "</b><span>" + esc([x.data.phone, x.data.city].filter(Boolean).join(" · ")) + "</span></span></button>"; }); }
      if (q) { items.push("new:" + q); h += '<div class="gh">Nauja</div><button data-i="' + (items.length - 1) + '">' + ic("plus") + '<span class="main"><b>Nauja užklausa: „' + esc(q) + "“</b></span></button>"; }
      if (!items.length) h = '<div class="empty">Dar nėra įrašų.</div>';
      res.innerHTML = h; sel = Math.min(sel, items.length - 1); mark();
      $$("[data-i]", res).forEach(function (b) { b.onclick = function () { go(+b.getAttribute("data-i")); }; b.onmousemove = function () { sel = +b.getAttribute("data-i"); mark(); }; });
    }
    function mark() { $$("[data-i]", res).forEach(function (b) { b.classList.toggle("on", +b.getAttribute("data-i") === sel); }); var on = res.querySelector(".on"); if (on && on.scrollIntoView) on.scrollIntoView({ block: "nearest" }); }
    function go(i) { var t = items[i]; if (!t) return; closeModal(); if (t.indexOf("new:") === 0) quickAdd({ q: t.slice(4) }); else { var p = t.split("/"); openRec(p[0], p[1]); } }
    inp.oninput = function () { sel = 0; draw(); };
    inp.onkeydown = function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(items.length - 1, sel + 1); mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(0, sel - 1); mark(); }
      else if (e.key === "Enter") { e.preventDefault(); go(sel); }
    };
    draw(); setTimeout(function () { inp.focus(); }, 20);
  }

  /* ---------------- routing ---------------- */
  function openRec(kind, id) { var h = "#" + kind + "/" + id; if (location.hash !== h) location.hash = h; else route(); }
  function closeRec() { S.ui.lostPick = null; if (S.open) { try { history.replaceState(null, "", "#" + S.view); } catch (e) { location.hash = S.view; } route(); } }
  function route() {
    var h = decodeURIComponent(location.hash.slice(1) || ""), p = h.split("/");
    if (p[0] === "deal" || p[0] === "client") { if (S.ui.lostPick && S.ui.lostPick !== p[1]) S.ui.lostPick = null; S.open = { kind: p[0], id: p[1] }; }
    else { S.open = null; if (["today", "pipe", "clients"].indexOf(p[0]) >= 0) S.view = p[0]; }
    changed();
    if (S.open) setTimeout(function () { var dr = $("#drawer"); if (dr && !dr.contains(document.activeElement)) { var b = dr.querySelector(".d-body"); if (b) b.scrollTop = 0; } }, 0);
  }
  function setView(v) { S.view = v; S.open = null; try { history.pushState(null, "", "#" + v); } catch (e) { location.hash = v; } changed(); window.scrollTo && window.scrollTo(0, 0); }

  /* ---------------- toast ---------------- */
  var toastT = null;
  function toast(msg, act, fn) {
    var t = $("#toast"); t.innerHTML = "<span>" + esc(msg) + "</span>" + (act ? '<button type="button">' + esc(act) + "</button>" : "");
    if (act) t.querySelector("button").onclick = function () { t.classList.remove("on"); fn && fn(); };
    t.classList.add("on"); clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("on"); }, act ? 6000 : 2600);
  }

  /* ---------------- menu ---------------- */
  function menu(open) {
    var m = $("#menu"), b = $("#meBtn"); if (open == null) open = m.hidden;
    m.hidden = !open; b.setAttribute("aria-expanded", String(open));
    if (!open) return;
    var pc = W.officeComputer ? W.officeComputer() : false;
    m.innerHTML = '<div class="who"><b>' + esc(meName()) + "</b><span>" + esc(S.me.role === "admin" ? "Administratorius" : "Biuras") + "</span></div>" +
      '<button data-act="csv" data-v="deals">' + ic("doc") + " Sandoriai → Excel (CSV)</button>" +
      '<button data-act="csv" data-v="clients">' + ic("doc") + " Klientai → Excel (CSV)</button><hr>" +
      '<a href="../shopfloor/">' + ic("ext") + " Visos programos</a>" +
      (W.officeComputer ? '<label><input type="checkbox" data-act="officepc"' + (pc ? " checked" : "") + "> Biuro kompiuteris (neužrakinti po " + (W.officeIdleMinutes || 10) + " min.)</label>" : "") +
      '<hr><button data-act="logout">' + ic("x") + " Atsijungti</button>";
  }
  function csv(kind) {
    var c = idx(), rows, cols;
    var q = function (v) { v = v == null ? "" : String(v); return /[";\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
    if (kind === "clients") {
      cols = ["Vardas", "Įmonė", "Telefonas", "El. paštas", "Miestas", "Adresas", "Šaltinis", "Pastabos", "Sukurta"];
      rows = c.client.map(function (x) { var d = x.data; return [d.name, d.company, d.phone, d.email, d.city, d.address, d.source, d.notes, String(x.created_at || "").slice(0, 10)]; });
    } else {
      cols = ["Sandoris", "Klientas", "Telefonas", "Etapas", "Suma €", "Šaltinis", "Atsakingas", "Kitas žingsnis", "Data", "Laimėta", "Pralaimėta", "Priežastis", "Sukurta"];
      rows = c.deal.map(function (d) { var x = clientOf(d), t = nextTask(d); return [d.data.title, x && x.data.name, x && x.data.phone, SNAME[d.data.stage], d.data.value, d.data.source, d.data.owner, t && t.data.title, t && t.data.due, d.data.wonAt, d.data.lostAt, d.data.lostReason, String(d.created_at || "").slice(0, 10)]; });
    }
    var text = "﻿" + [cols].concat(rows).map(function (r) { return r.map(q).join(";"); }).join("\r\n");
    var a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    a.download = (kind === "clients" ? "klientai-" : "sandoriai-") + ymd() + ".csv"; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------------- events ---------------- */
  document.addEventListener("click", function (e) {
    var t = e.target;
    if (t.closest && t.closest("[data-stop]")) return;
    if (!$("#menu").hidden && !t.closest(".me")) menu(false);
    var a = t.closest && t.closest("[data-act]");
    if (a) {
      var act = a.getAttribute("data-act"), v = a.getAttribute("data-v"), id = a.getAttribute("data-id");
      var cur = S.open ? get(S.open.id) : null;
      switch (act) {
        case "view": e.preventDefault(); setView(v); return;
        case "quick": e.preventDefault(); quickAdd({ stage: a.getAttribute("data-stage"), client: a.getAttribute("data-client") }); return;
        case "palette": palette(); return;
        case "sync": S.err = null; backoff = 0; syncNow(); return;
        case "menu": menu(); return;
        case "close": closeRec(); return;
        case "mclose": closeModal(); return;
        case "mine": S.ui.mine = v === "1"; saveUi(); changed(); return;
        case "pmode": S.ui.pipeMode = v; saveUi(); changed(); return;
        case "done": e.stopPropagation(); a.setAttribute("aria-checked", "true"); setTimeout(function () { completeTask(id); }, 160); return;
        case "deltask": { var tk = get(id); if (tk) { put(id, "task", null, true); toast("Žingsnis pašalintas", "Atšaukti", function () { put(id, "task", null, false); }); } return; }
        case "stage": if (cur) setStage(cur.id, v); return;
        case "won": if (cur) setStage(cur.id, "won"); return;
        case "lostask": if (cur) { S.ui.lostPick = cur.id; changed(); } return;
        case "lostcancel": S.ui.lostPick = null; changed(); return;
        case "lost": if (cur) { S.ui.lostPick = null; setStage(cur.id, "lost", v); } return;
        case "due": { S.ui.nextDue = v; var nd = $("#nextDue"); if (nd) nd.value = v; $$('[data-act="due"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-v") === v)); }); return; }
        case "addtask": {
          var tt = $("#nextTitle"), dd = $("#nextDue");
          if (!tt.value.trim()) { tt.focus(); tt.placeholder = "Įrašykite, ką reikia padaryti"; return; }
          if (addTask(cur.id, cur.data.clientId, tt.value, dd.value)) { tt.value = ""; S.ui.nextDue = null; toast("Žingsnis pridėtas: " + dueText(dd.value)); }
          return;
        }
        case "ctype": S.ui.composer = v; saveUi(); changed(); setTimeout(function () { var cp = $("#comp"); if (cp) cp.focus(); }, 0); return;
        case "addact": {
          var cp = $("#comp"), txt = cp ? cp.value.trim() : ""; if (!txt) { cp && cp.focus(); return; }
          var tg = a.getAttribute("data-target").split(":"), d = tg[0] === "deal" ? get(tg[1]) : null;
          log(d ? d.id : null, d ? d.data.clientId : tg[1], S.ui.composer || "note", txt); cp.value = ""; toast("Įrašyta");
          return;
        }
        case "delact": put(id, "activity", null, true); toast("Įrašas ištrintas", "Atšaukti", function () { put(id, "activity", null, false); }); return;
        case "openclient": openRec("client", id); return;
        case "deldeal": { var dd2 = get(id); if (!dd2) return; closeRec(); softDelete(id, "deal", "Sandoris", (idx().tasksOf[id] || []).map(function (x) { return { id: x.id, kind: "task" }; })); return; }
        case "delclient": {
          var cl = get(id); if (!cl) return; var deals = idx().dealsOf[id] || [];
          if (deals.length && !confirm("Klientas turi " + deals.length + " sandor" + (deals.length === 1 ? "į" : "ius") + ". Ištrinti klientą kartu su jais?")) return;
          var extra = deals.map(function (x) { return { id: x.id, kind: "deal" }; });
          deals.forEach(function (x) { (idx().tasksOf[x.id] || []).forEach(function (t) { extra.push({ id: t.id, kind: "task" }); }); });
          closeRec(); softDelete(id, "client", "Klientas", extra); return;
        }
        case "newclient":
          simpleModal("Naujas klientas", '<label class="field"><span>Vardas Pavardė *</span><input class="inp" name="name" required></label><div class="fgrid"><label class="field"><span>Telefonas</span><input class="inp mono" name="phone" inputmode="tel"></label><label class="field"><span>El. paštas</span><input class="inp" name="email"></label><label class="field"><span>Įmonė</span><input class="inp" name="company"></label><label class="field"><span>Miestas</span><input class="inp" name="city"></label></div>',
            function (f) { var n = f.elements.name.value.trim(); if (!n) { f.elements.name.focus(); return false; } var id2 = put(uid("c"), "client", { name: n, phone: f.elements.phone.value.trim(), email: f.elements.email.value.trim(), company: f.elements.company.value.trim(), city: f.elements.city.value.trim(), by: meName() }); setTimeout(function () { openRec("client", id2); }, 0); });
          return;
        case "newtask": {
          var opts = idx().deal.filter(isOpen).sort(function (x, y) { return norm(x.data.title).localeCompare(norm(y.data.title)); });
          simpleModal("Naujas darbas", '<label class="field"><span>Ką reikia padaryti? *</span><input class="inp" name="t" required></label><div class="fgrid"><label class="field"><span>Data</span><input class="inp" type="date" name="d" value="' + plusDays(1) + '"></label>' +
            '<label class="field"><span>Sandoris</span><select class="inp" name="deal"><option value="">— nesusieta —</option>' + opts.map(function (x) { var c2 = clientOf(x); return '<option value="' + x.id + '">' + esc(x.data.title) + (c2 ? " · " + esc(c2.data.name) : "") + "</option>"; }).join("") + "</select></label></div>",
            function (f) { if (!addTask(f.elements.deal.value || null, null, f.elements.t.value, f.elements.d.value)) { f.elements.t.focus(); return false; } toast("Darbas pridėtas"); });
          return;
        }
        case "csv": menu(false); csv(v); return;
        case "officepc": W.officeComputer(a.checked); return;
        case "logout":
          menu(false);
          if (S.pending.size && !confirm("Dar " + S.pending.size + " pakeitimai neišsiųsti (nėra ryšio). Jie liks šiame kompiuteryje ir bus išsiųsti kitą kartą prisijungus. Atsijungti?")) return;
          W.logout(); return;
      }
    }
    var o = t.closest && t.closest("[data-open]");
    if (o && !dragJustEnded && o.getAttribute("data-open")) { var p = o.getAttribute("data-open").split("/"); openRec(p[0], p[1]); }
  });
  // edits in the drawer: save on change (fields) — text fields also while typing (debounced)
  var typing = {};
  function fieldSave(el) {
    if (!S.open) return; var r = get(S.open.id); if (!r) return;
    var f = el.getAttribute("data-f"), v = el.value;
    if (f === "value") v = num(v) || null; else if (typeof v === "string" && el.tagName !== "TEXTAREA") v = v.trim();
    if ((r.data[f] == null ? "" : r.data[f]) === (v == null ? "" : v)) return;
    var patch = {}; patch[f] = v; put(r.id, r.kind, patch);
    if (f === "clientId" && r.kind === "deal") { var nc = get(v); log(r.id, v, "sys", "Klientas: " + (nc ? nc.data.name : "—")); }
  }
  document.addEventListener("change", function (e) { var el = e.target; if (el.matches && el.matches("[data-f]")) { clearTimeout(typing[el.getAttribute("data-f")]); fieldSave(el); } });
  document.addEventListener("input", function (e) {
    var el = e.target;
    if (el.matches && el.matches("[data-in]")) { S.ui[el.getAttribute("data-in")] = el.value; changed(); return; }
    if (el.matches && el.matches("[data-f]") && el.tagName !== "SELECT") { var k = el.getAttribute("data-f"); clearTimeout(typing[k]); var kp = el.getAttribute("data-keep");
      typing[k] = setTimeout(function () { var cur = (kp && document.querySelector('#drawer [data-keep="' + kp + '"]')) || el; if (document.body.contains(cur)) fieldSave(cur); }, 900); }
    if (el.id === "nextDue") { S.ui.nextDue = el.value; $$('[data-act="due"]').forEach(function (x) { x.setAttribute("aria-pressed", String(x.getAttribute("data-v") === el.value)); }); }
  });
  document.addEventListener("keydown", function (e) {
    var t = e.target, inField = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
    if (e.key === "Escape") {
      if (!$("#menu").hidden) { menu(false); return; }
      if ($("#layer").firstChild) { closeModal(); return; }
      if (S.open) { if (inField) t.blur(); closeRec(); return; }
      return;
    }
    if (t && t.id === "comp" && e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); var b = $('[data-act="addact"]'); b && b.click(); return; }
    if (t && t.id === "nextTitle" && e.key === "Enter") { e.preventDefault(); var b2 = $('[data-act="addtask"]'); b2 && b2.click(); return; }
    if (t && t.classList && t.classList.contains("card") && e.key === "Enter") { t.click(); return; }
    if (inField || e.ctrlKey || e.metaKey || e.altKey || !S.me || $("#layer").firstChild) return;
    if (e.key === "n" || e.key === "N") { e.preventDefault(); quickAdd(); }
    else if (e.key === "/") { e.preventDefault(); palette(); }
    else if (e.key === "1") setView("today"); else if (e.key === "2") setView("pipe"); else if (e.key === "3") setView("clients");
  });
  $$(".tabs [data-view]").forEach(function (b) { b.addEventListener("click", function () { setView(b.getAttribute("data-view")); }); });
  document.addEventListener("click", function (e) { var w = e.target.closest && e.target.closest("[data-modal]"); if (w && e.target === w) closeModal(); });
  window.addEventListener("hashchange", route);

  /* ---------------- drag & drop (mouse / pen; on phones use the stage buttons) ---------------- */
  var dragJustEnded = false;
  document.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch" || e.button !== 0) return;
    var cardEl = e.target.closest && e.target.closest(".card[data-deal]"); if (!cardEl) return;
    var sx = e.clientX, sy = e.clientY, ghost = null, overEl = null, id = cardEl.getAttribute("data-deal");
    function move(ev) {
      if (!ghost) {
        if (Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) < 7) return;
        dragging = id; ghost = cardEl.cloneNode(true); ghost.classList.add("dragghost"); ghost.style.width = cardEl.offsetWidth + "px"; document.body.appendChild(ghost);
        cardEl.classList.add("dragging"); document.body.classList.add("drag");
      }
      ghost.style.left = (ev.clientX - 30) + "px"; ghost.style.top = (ev.clientY - 18) + "px";
      var hit = document.elementFromPoint(ev.clientX, ev.clientY), z = hit && hit.closest && (hit.closest("[data-zone]") || hit.closest("[data-drop]"));
      if (z !== overEl) { if (overEl) overEl.classList.remove("over"); overEl = z; if (z) z.classList.add("over"); }
    }
    function up() {
      document.removeEventListener("pointermove", move); document.removeEventListener("pointerup", up); document.removeEventListener("pointercancel", up);
      if (!ghost) return;
      ghost.remove(); cardEl.classList.remove("dragging"); document.body.classList.remove("drag");
      dragJustEnded = true; setTimeout(function () { dragJustEnded = false; }, 50);
      var target = overEl && (overEl.getAttribute("data-zone") || overEl.getAttribute("data-drop")); if (overEl) overEl.classList.remove("over");
      dragging = null;
      if (target === "lost") { S.ui.lostPick = id; openRec("deal", id); }
      else if (target) setStage(id, target);
      changed();
    }
    document.addEventListener("pointermove", move); document.addEventListener("pointerup", up); document.addEventListener("pointercancel", up);
  });

  /* ---------------- sign-in / lock ---------------- */
  var gating = false;
  function relock() {
    if (gating) return; gating = true;
    S.me = null; S.items.clear(); S.cursor = null; S.loaded = false; S.loadedOnce = false; C = null;
    $("#app").hidden = true; $("#view").innerHTML = ""; $("#view")._html = ""; S.open = null; paintDrawer(); closeModal();
    W.requireArea("crm", { title: "CRM — klientai ir užklausos" }).then(function (me) {
      gating = false; S.me = me; $("#app").hidden = false; $("#meBtn").textContent = initials(me.display_name);
      route(); changed(); pull(true).then(push); startTimers();
    });
  }
  W.onChange(function (s) { if (!s && S.me) relock(); });
  loadPending();
  window.addEventListener("storage", function (e) { if (e.key === PKEY && !S.pushing) { loadPending(); changed(); } });
  relock();

  // test hook
  window.__crm = { S: S, idx: idx, put: put, push: push, pull: pull, syncNow: syncNow, setStage: setStage, completeTask: completeTask, quickAdd: quickAdd, addTask: addTask, route: route, paint: paint };
})();
