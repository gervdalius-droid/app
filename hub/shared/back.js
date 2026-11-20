/* ============================================================
   Dėdės Baldai — the phone's Back button (and the browser's) inside the apps.
   Load once per app:  <script src="/hub/shared/back.js" defer></script>

   Without this, Back left the app at once (to the hub or whatever was open
   before), even when the person was three screens deep or had a window open.
   Now Back first
     1. closes what is open on top — a window, dialog, side panel, the bell;
     2. then steps back through the app's own screens, if the app tells
        this script what a "screen" is:
          HubBack.view({ get: () => ({...where am I...}),
                         set: where => { ...go there... } })
        get() must return small plain data (it is kept in the history);
        set() gets one of those values back and shows that screen.
     3. and only then leaves the app.
   Windows are found by themselves (dialog, aria-modal, role=dialog and the
   usual .modal/.overlay/.drawer… names, while they cover the screen); an app
   can mark its own with data-back-layer, or stop one being closed by Back with
   data-back-ignore. Sign-in screens are never closed by Back.
   Written in ES5 so it runs on old workshop tablets too.
   ============================================================ */
(function () {
  "use strict";
  if (window.HubBack || !window.history || !history.pushState) return;

  var H = history, views = [], seq = 0, busy = 0, gesture = 0, stale = false, timer = null, lastLayers = [];
  try { var s0 = H.state; if (s0 && s0.__hb && s0.i) seq = s0.i + 1000; } catch (e) {}   // after a reload: keep counting upward
  var IGNORE = "#hub-gate,.wa,.wa-wrap,[data-back-ignore],.ntc-must,.ntc-mwrap";
  var LAYER = "dialog[open],[aria-modal=true],[role=dialog],[role=alertdialog],[data-back-layer]," +
              ".modal,.modal-bg,.modal-backdrop,.modal-wrap,.overlay,.backdrop,.drawer,.dlg,.dialog,.popup,.lightbox,.scrim-panel,.sheet-modal";
  var CLOSE_TXT = /^[✕×✖╳←‹]?\s*(✕|×|✖|╳|x|uždaryti|close|atšaukti|cancel|atgal|back)\s*[✕×✖╳]?$/i;
  var CLOSE_ATTR = /(^|\b)(uždaryti|close|atšaukti|cancel|atgal|back|dismiss)(\b|$)/i;

  function now() { return Date.now ? Date.now() : +new Date(); }
  function st() { var s = H.state; return s && typeof s === "object" ? s : null; }
  function mine(s) { return !!(s && s.__hb); }
  function put(push, kind) {
    curKind = kind;
    var s = { __hb: kind, i: ++seq, v: viewKey() };
    var old = st(); if (old && !mine(old)) { for (var k in old) if (!(k in s)) s[k] = old[k]; }   // keep what the app itself stored
    try { if (push) H.pushState(s, "", location.href); else H.replaceState(s, "", location.href); } catch (e) {}
  }

  /* ---------- screens (from the app) ---------- */
  function viewKey() {
    if (!views.length) return "";
    var out = [];
    for (var i = 0; i < views.length; i++) { try { out.push(views[i].get()); } catch (e) { out.push(null); } }
    try { return JSON.stringify(out); } catch (e) { return ""; }
  }
  function applyView(key) {
    var want; try { want = JSON.parse(key || "null"); } catch (e) { return; }
    if (!want) return;
    for (var i = 0; i < views.length; i++) {
      var now_; try { now_ = JSON.stringify(views[i].get()); } catch (e) { now_ = null; }
      if (now_ !== JSON.stringify(want[i])) { try { views[i].set(want[i]); } catch (e) { if (window.console) console.warn("HubBack", e); } }
    }
  }

  /* ---------- windows on top ---------- */
  function shown(el) {
    if (el.closest && el.closest(IGNORE)) return false;
    if (el.hidden || el.getAttribute("aria-hidden") === "true" || el.hasAttribute("inert")) return false;
    var cs = window.getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false;
    var r = el.getBoundingClientRect(), vw = window.innerWidth, vh = window.innerHeight;
    if (r.width < 2 || r.height < 2) return false;
    var ix = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0)), iy = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    if (ix * iy < 0.3 * r.width * Math.min(r.height, vh)) return false;              // slid away off screen
    var tag = el.tagName === "DIALOG" || el.getAttribute("aria-modal") === "true" || el.hasAttribute("data-back-layer");
    if (tag) return true;
    // a class or role alone is not enough: it must float above the page (fixed) and be a real window, not a toast
    var fixed = cs.position === "fixed", p = el.parentElement;
    while (!fixed && p && p !== document.body) { if (window.getComputedStyle(p).position === "fixed") fixed = true; p = p.parentElement; }
    return fixed && ix * iy > 0.08 * vw * vh;
  }
  // a page-wide shaded background added straight to the page = a window, whatever it is called
  function dimmer(el) {
    if (el.closest && el.closest(IGNORE)) return false;
    var cs = window.getComputedStyle(el);
    if (cs.position !== "fixed" || cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false;
    var m = /rgba?\(\s*\d+[\s,]+\d+[\s,]+\d+[\s,/]+([\d.]+)/.exec(cs.backgroundColor), a = m ? +m[1] : 0;
    if (!(a > 0.05 && a < 0.97) && !(cs.backdropFilter && cs.backdropFilter !== "none")) return false;
    var r = el.getBoundingClientRect();
    return r.width * r.height >= 0.85 * window.innerWidth * window.innerHeight;
  }
  function layers() {
    var all = [].slice.call(document.querySelectorAll(LAYER)), out = [];
    var kids = document.body ? document.body.children : [];
    for (var c = 0; c < kids.length; c++) if (all.indexOf(kids[c]) < 0 && !/^(SCRIPT|STYLE|LINK|TEMPLATE)$/.test(kids[c].tagName) && dimmer(kids[c])) all.push(kids[c]);
    for (var i = 0; i < all.length; i++) {
      var el = all[i];
      if (!shown(el)) continue;
      var top = true;
      for (var j = 0; j < out.length; j++) if (out[j].contains(el)) { top = false; break; }
      if (!top) continue;
      for (var k = out.length - 1; k >= 0; k--) if (el.contains(out[k])) out.splice(k, 1);
      out.push(el);
    }
    out.sort(function (a, b) { return z(a) - z(b) || (a.compareDocumentPosition(b) & 4 ? -1 : 1); });   // topmost last
    return out;
  }
  function z(el) { var v = 0; for (var e = el; e && e !== document.body; e = e.parentElement) { var n = parseInt(window.getComputedStyle(e).zIndex, 10); if (!isNaN(n)) v = Math.max(v, n); } return v; }
  function visible(b) { var r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && !b.disabled; }
  function closeBtn(el) {
    var bs = el.querySelectorAll("button,[role=button],a[href='#'],a:not([href]),.close,.x");
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i]; if (!visible(b)) continue;
      var t = (b.textContent || "").replace(/\s+/g, " ").trim();
      var a = (b.getAttribute("aria-label") || "") + " " + (b.getAttribute("title") || "");
      var d = (b.getAttribute("data-act") || b.getAttribute("data-action") || "") + " " + (b.className && b.className.baseVal == null ? b.className : "");
      if (b.hasAttribute("data-close") || b.hasAttribute("data-dismiss") || b.hasAttribute("data-back-close") ||
          CLOSE_TXT.test(t) || (t.length <= 2 && /[✕×✖╳]/.test(t)) || CLOSE_ATTR.test(a) || /(^|[\s_-])(close|cancel|dismiss)([\s_-]|$)/i.test(d)) return b;
    }
    return null;
  }
  function key(el, k) {
    var ev; try { ev = new KeyboardEvent("keydown", { key: k, code: k, keyCode: 27, which: 27, bubbles: true, cancelable: true }); }
    catch (e) { ev = document.createEvent("Event"); ev.initEvent("keydown", true, true); ev.key = k; ev.keyCode = 27; }
    (el || document).dispatchEvent(ev);
  }
  function tryClose(el, done) {
    if (typeof el.__hubBackClose === "function") { el.__hubBackClose(); return later(); }
    var b = closeBtn(el);
    if (b) { b.click(); return later(); }
    var f = document.activeElement && el.contains(document.activeElement) ? document.activeElement : el;
    key(f, "Escape");
    setTimeout(function () {
      if (!shown(el)) return done(true);
      try { el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); el.dispatchEvent(new MouseEvent("click", { bubbles: true })); } catch (e) { el.click && el.click(); }   // a tap on the shaded background
      setTimeout(function () {
        if (shown(el) && el.tagName === "DIALOG" && el.close) { try { el.close(); } catch (e) {} }
        done(!shown(el));
      }, 80);
    }, 60);
    function later() { setTimeout(function () { done(!el.isConnected || !shown(el)); }, 80); }
  }

  /* ---------- keeping the history in step with the screen ---------- */
  var cur = 0, curKind = "v", lastHref = location.href;   // the step we are on
  function check() {
    timer = null;
    if (busy) return;
    var L = layers(), s = st(), v = viewKey();
    var opened = L.some(function (x) { return lastLayers.indexOf(x) < 0; });
    if (!L.length && lastLayers.length && s && s.__hb === "g") stale = true;      // closed with its own ✕: this step is now empty
    lastLayers = L;
    var moved = false;
    if (!s || !mine(s)) put(false, "v");
    else if (s.v !== v) {
      if (now() - gesture < 2500 && !(s.__hb === "g" && L.length && !opened)) { put(true, "v"); stale = false; moved = true; }   // the person went somewhere: one step back
      else put(false, s.__hb);                                                     // the app moved by itself: just note it
    }
    var urlMoved = location.href !== lastHref; lastHref = location.href;
    if (opened && L.length && !moved && !urlMoved && now() - gesture < 2500) {     // (an app that changed the address for it keeps its own step)                                            // (a window that came with a new screen goes back with it)
      var s2 = st();
      if (stale && s2 && s2.__hb === "g") stale = false;                           // reuse the empty step
      else put(true, "g");                                                         // a step for the window, so Back closes it
    }
    cur = (st() || {}).i || cur;
  }
  function soon(ms) { if (timer) clearTimeout(timer); timer = setTimeout(check, ms || 60); }

  window.addEventListener("popstate", function (e) {
    var s = e.state && typeof e.state === "object" ? e.state : null, ours = mine(s);
    var back = !ours || s.i < cur, leftGuard = curKind === "g";
    if (ours) { cur = s.i; curKind = s.__hb; } else curKind = "";
    if (!back) {                                                                   // Forward
      if (s.__hb === "g" && !layers().length) { H.forward(); return; }
      if (s.v !== viewKey()) { busy++; applyView(s.v); setTimeout(function () { busy--; lastLayers = layers(); }, 150); }
      return;
    }
    if (ours && s.__hb === "v" && s.v !== viewKey()) {                            // back to another screen: the app shows it (and closes what belongs to it)
      busy++;
      applyView(s.v);
      setTimeout(function () { busy--; if (viewKey() !== s.v) put(false, "v"); lastLayers = layers(); }, 150);
      return;
    }
    var L = layers();
    if (L.length && location.href !== lastHref) {
      // the address changed: the app may close its window itself (#hash routes) — give it a moment first
      lastHref = location.href; busy++;
      setTimeout(function () { busy--; if (layers().length >= L.length) closeTop(s, ours); else { lastLayers = layers(); soon(0); } }, 220);
      return;
    }
    if (L.length) { closeTop(s, ours); return; }
    if (!ours) return;                                                             // the app's own step (#hash): the app handles it
    if (s.__hb === "g") { H.back(); return; }                                      // an empty step from a window closed with ✕: skip it
    if (leftGuard && s.v === viewKey()) { H.back(); return; }                     // we left such an empty step: this press is for the screen before
    if (s.v !== viewKey()) {
      busy++;
      applyView(s.v);
      setTimeout(function () { busy--; if (viewKey() !== s.v) put(false, "v"); lastLayers = layers(); }, 150);
    }
  });
  function closeTop(s, ours) {
    var L = layers(); if (!L.length) return;
    {
      // Back with a window open: close it and stay on this screen
      busy++;
      var top = L[L.length - 1], was = viewKey();
      tryClose(top, function (ok) {
        var rest = layers(), c = st();
        lastLayers = rest; stale = false;
        if (!ok || rest.length) { if (!(c && c.__hb === "g")) put(true, "g"); }     // something still open: keep a step for it
        else if (c && c.__hb === "g") { H.back(); }                                // step off the now empty step
        else if (c && mine(c) && c.v !== was) { put(true, "v"); }                  // we landed on another screen's step: put ours back
        cur = (st() || {}).i || cur;
        setTimeout(function () { busy--; lastHref = location.href; }, 120);
      });
    }
  }

  function touched() { gesture = now(); soon(80); setTimeout(function () { soon(60); }, 450); }
  ["pointerdown", "keydown", "click", "change", "submit"].forEach(function (t) { document.addEventListener(t, touched, true); });
  function start() {
    put(false, "v"); cur = seq;
    if (window.MutationObserver) new MutationObserver(function () { if (!timer) soon(90); })
      .observe(document.body || document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style", "hidden", "open", "aria-hidden"] });
    soon(200);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();

  window.HubBack = {
    // a screen the app can go back to
    view: function (o) { if (o && typeof o.get === "function" && typeof o.set === "function") { views.push(o); var s = st(); if (s && mine(s) && !busy) put(false, s.__hb); } },
    // the app's own tab buttons: Back clicks the one that was on before
    tabs: function (sel, attr) {
      this.view({
        get: function () { var b = document.querySelector(sel + "[aria-selected=true]," + sel + ".on," + sel + ".active," + sel + "[aria-current=page]," + sel + "[aria-current=true]"); return b ? b.getAttribute(attr) : null; },
        set: function (v) { if (v == null) return; var all = document.querySelectorAll(sel); for (var i = 0; i < all.length; i++) if (all[i].getAttribute(attr) === v) { all[i].click(); return; } }
      });
    },
    // more of the app's own windows (CSS selectors)
    layer: function (sel) { if (sel) LAYER += "," + sel; },
    // never closed by Back (sign-in, a start screen that must be answered…)
    ignore: function (sel) { if (sel) IGNORE += "," + sel; },
    check: function () { soon(0); }
  };
  // apps can set themselves up before this file has loaded:
  //   (window.HubBackQ = window.HubBackQ || []).push(function (B) { B.view({...}); });
  var q = window.HubBackQ;
  window.HubBackQ = { push: function (f) { try { f(window.HubBack); } catch (e) { if (window.console) console.warn("HubBack", e); } } };
  if (q && q.length) for (var qi = 0; qi < q.length; qi++) window.HubBackQ.push(q[qi]);
})();
