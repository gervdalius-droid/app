/* ============================================================
   ShopFlow — the assembly bench page (app.dedesbaldai.lt/surinkimas)

   A page of its own for the tablet at the assembly bench: the people
   there sign in with their name and PIN, press "Skenuoti" (or use a
   USB/Bluetooth scanner) and the scanned panel's cabinet opens — its
   drawing, the 3-D cabinet, its panels (assembly.js). Nothing else of
   ShopFlow is shown or reachable from here: no menus, no projects, no
   settings, no search.

   It runs on ShopFlow's own data, sync and sign-in (the same scripts),
   with App.render replaced by this one screen. Loaded by
   /surinkimas/index.html only — never by ShopFlow itself.
   ============================================================ */
"use strict";

var Kiosk = {
  IDLE_MS: 60 * 60 * 1000,        // signed out after an hour without a touch
  stationId: null,
  _html: null,
  _idleAt: Date.now(),
  msg: null,                       // {cls, text} — the last scan that did not open anything

  L(en, lt) { return typeof I18N !== "undefined" && I18N.lang === "en" ? en : lt; },
  station() {
    var want = new URLSearchParams(location.search).get("station") || "st-f1da3f6c";
    var st = D.station(want) || (Store.state.stations || []).find(s => /surink|assembl/i.test(s.name || ""));
    return st || null;
  },

  /* ---------- the one screen ---------- */
  html() {
    var L = this.L.bind(this), me = App.me, st = this.station();
    this.stationId = st ? st.id : null;
    ScanStation.stationId = this.stationId;
    var hasCam = "BarcodeDetector" in window;
    return `<div class="ksk">
      <header class="ksk-top">
        <div class="ksk-brand">${icon("hammer", 22)}<div><b>${L("Assembly", "Surinkimas")}</b><span>Dėdės Baldai</span></div></div>
        <span class="grow"></span>
        <div class="ksk-me">${avatarHtml(me, "sm")}<b>${esc(me.name)}</b></div>
        <button class="btn" id="ksk-out">${icon("power", 16)} ${L("Sign out", "Atsijungti")}</button>
      </header>
      <main class="ksk-main">
        ${st ? "" : `<div class="ksk-msg err">${icon("alert", 18)} ${L("There is no assembly station set up — ask the office to add one.", "Nesukurta surinkimo stotis — paprašykite biuro ją sukurti.")}</div>`}
        <div class="ksk-scan ${ScanStation.camera ? "cam-on" : ""}">
          <div class="ksk-video">
            <video id="scan-video" class="${ScanStation.camera ? "" : "hide"}" playsinline muted></video>
            <button class="ksk-x" id="ksk-cam-x" aria-label="${L("Close the camera", "Uždaryti kamerą")}">${icon("x", 30, "", 2.4)}</button>
            <button class="ksk-off" id="ksk-cam-off">${icon("x", 22)} ${L("Stop scanning", "Baigti skenuoti")}</button>
          </div>
          <button class="ksk-cam ${ScanStation.camera ? "active" : ""}" id="scan-cam-btn" ${hasCam ? "" : "disabled"}>
            ${icon("camera", 40, "", 1.6)}
            <b>${ScanStation.camera ? L("Stop the camera", "Išjungti kamerą") : L("Scan a panel", "Skenuoti detalę")}</b>
            <span>${hasCam ? L("Hold the panel's label up to the camera — its cabinet opens", "Atsukite detalės etiketę į kamerą — atsidarys jos spintelė") : L("This browser has no camera scanner — use a hand scanner or type the code", "Ši naršyklė neturi kameros skaitytuvo — naudokite skenerį arba įveskite kodą")}</span>
          </button>
          <div class="ksk-type">
            <input id="scan-capture" class="input" autocomplete="off" autocapitalize="off" spellcheck="false" ${ScanStation.touch() ? 'inputmode="none"' : ""} placeholder="${L("…or the label's code, then Enter", "…arba etiketės kodas ir Enter")}">
            ${ScanStation.touch() ? `<button class="btn" id="scan-kbd">${icon("type", 15)} ${L("Type", "Įvesti")}</button>` : ""}
          </div>
          <div id="ksk-msg">${this.msgHtml()}</div>
        </div>
        <section class="ksk-recent">
          <div class="t-caption">${L("Opened lately", "Neseniai atidaryta")}</div>
          <div id="ksk-recent">${this.recentHtml()}</div>
        </section>
      </main>
    </div>`;
  },
  msgHtml() { var m = this.msg; return m ? `<div class="ksk-msg ${m.cls}">${icon(m.cls === "err" ? "ban" : "alert", 18)} <span>${esc(m.text)}</span></div>` : ""; },
  /* the cabinets opened here lately (one line each), to open again with a tap */
  recentHtml() {
    var L = this.L.bind(this), seen = {}, rows = [];
    (Store.state.scanLog || []).forEach(r => {
      if (rows.length >= 8 || r.stationId !== this.stationId || r.status !== "opened" || !r.orderId) return;
      var o = D.order(r.orderId); if (!o) return;
      var part = r.partCode ? D.orderPart(o, r.partCode) : null, key = Assembly.keyOf(o, part);
      var k = o.id + "|" + key; if (seen[k]) return; seen[k] = 1;
      var m = Assembly.moduleOf(o, key), who = D.member(r.by);
      rows.push(`<button class="ksk-rec" data-o="${o.id}" data-p="${esc(r.partCode || "")}">
        <span class="ksk-rec-ic">${icon(m && (m.done || 0) >= (m.qty || 1) ? "check-circle" : "ruler", 18)}</span>
        <span class="grow"><b>${esc(o.num)} · ${esc(key ? Assembly.title(o, m, key) : (o.product || ""))}</b><span>${esc([o.client, who && who.name, fmtAgo(r.ts)].filter(Boolean).join(" · "))}</span></span>
        ${icon("chev-right", 16)}
      </button>`);
    });
    return rows.length ? rows.join("") : `<div class="ksk-none">${L("Nothing yet — scan a panel.", "Dar nieko — nuskenuokite detalę.")}</div>`;
  },
  bind(root) {
    var self = this;
    $("#ksk-out", root).onclick = () => { ScanStation.stopCamera(); Assembly.close(); App.logout(); };
    $("#scan-cam-btn", root).onclick = () => { self.msg = null; ScanStation.camera ? ScanStation.stopCamera() : ScanStation.startCamera(); };
    $$("#ksk-cam-off,#ksk-cam-x", root).forEach(b => b.onclick = () => { Assembly._camWas = false; ScanStation.stopCamera(); });
    var cap = $("#scan-capture", root);
    cap.onkeydown = e => { if (e.key === "Enter") { e.preventDefault(); var v = cap.value; cap.value = ""; if (v.trim()) self.scan(v.trim()); } };
    var focus = () => { if (!ScanStation.camera && !Assembly.isOpen() && document.activeElement !== cap) cap.focus(); };
    focus();
    root.onclick = e => { if (!e.target.closest("button,input,video")) focus(); };
    cap.onblur = () => setTimeout(() => { if (App.me && !ScanStation.camera && !Assembly.isOpen() && document.getElementById("scan-capture") === cap) focus(); }, 80);
    var kb = $("#scan-kbd", root);
    if (kb) kb.onclick = () => { cap.setAttribute("inputmode", "text"); cap.blur(); setTimeout(() => cap.focus(), 30); cap.addEventListener("blur", () => cap.setAttribute("inputmode", "none"), { once: true }); };
    $$("[data-o]", root).forEach(b => b.onclick = () => {
      var o = D.order(b.dataset.o); if (!o) return;
      var part = b.dataset.p ? D.orderPart(o, b.dataset.p) : null;
      Assembly.open(o.id, { key: Assembly.keyOf(o, part), partCode: b.dataset.p || "", start: null, stationId: self.stationId });
    });
  },
  /* live bits without rebuilding the screen (the camera keeps running) */
  paint() {
    var m = document.getElementById("ksk-msg"); if (m) m.innerHTML = this.msgHtml();
    var r = document.getElementById("ksk-recent"); if (r) { r.innerHTML = this.recentHtml(); this.bind(document.getElementById("app")); }
    var sc = document.querySelector(".ksk-scan"); if (sc) sc.classList.toggle("cam-on", !!ScanStation.camera);
    var b = document.getElementById("scan-cam-btn");
    if (b) { b.classList.toggle("active", !!ScanStation.camera); var t = b.querySelector("b"); if (t) t.textContent = ScanStation.camera ? this.L("Stop the camera", "Išjungti kamerą") : this.L("Scan a panel", "Skenuoti detalę"); }
  },

  /* ---------- a scan ---------- */
  scan(payload) {
    var L = this.L.bind(this), now = Date.now();
    if (payload === ScanStation._last.payload && now - ScanStation._last.ts < 700) return;
    ScanStation._last = { payload: payload, ts: now };
    this.msg = null;
    try { if (this.stationId && Assembly.onScan(payload, this.stationId)) { this.paint(); return; } } catch (e) { console.warn("[kiosk]", e); }
    var parsed = D.scanParse(payload);
    if (!parsed || !parsed.order || parsed.unknownPart) {
      this.msg = { cls: "err", text: L("Not found: ", "Nerasta: ") + String(payload).slice(0, 60) + L(" — has the project been sent to production?", " — ar projektas perduotas į gamybą?") };
      ScanStation.beep("err"); this.paint(); return;
    }
    /* a project without an assembly step: its drawing still opens, nothing is started */
    var o = parsed.order, part = parsed.part || D.orderPart(o, parsed.partCode);
    Store.state.scanLog = Store.state.scanLog || [];
    Store.state.scanLog.unshift({ ts: now, by: App.me && App.me.id, payload: String(payload).slice(0, 60), status: "opened", orderId: o.id, stationId: this.stationId, partCode: parsed.partCode || null });
    if (Store.state.scanLog.length > 300) Store.state.scanLog.length = 300;
    Store.save();
    ScanStation.beep("warn");
    this.msg = { cls: "warn", text: o.num + L(": this project has no assembly step — the drawing is shown, nothing was started.", ": šis projektas neturi surinkimo etapo — rodomas brėžinys, niekas nepradėta.") };
    Assembly.open(o.id, { key: Assembly.keyOf(o, part), partCode: parsed.partCode || "", sel: part && part.solid || "", start: { state: "none" }, stationId: this.stationId });
    this.paint();
  },

  /* ---------- the page around it ---------- */
  render() {
    if (App._pointerDown && Date.now() - App._pointerAt < 2000) { App._renderQueued = true; return; }
    App._pointerDown = false; App._renderQueued = false;
    if (App.me) { var m = D.member(App.me.id); if (m) App.me = m; }
    var root = $("#app"), html;
    App.view = "scan";
    if (typeof Sync !== "undefined" && !App._localOnly && Sync.needsGate()) {
      this._html = null; App._html = null;
      root.innerHTML = this.rebrand(Sync.gateHtml());
      Sync.bindGate(root);
      return;
    }
    if (!App.me) {
      html = this.rebrand(Login.html());
      if (html !== this._html || !root.firstElementChild) { root.innerHTML = html; this._html = html; Login.bind(root); }
      return;
    }
    if (this._html && this._html.indexOf('class="ksk"') >= 0 && root.querySelector(".ksk")) { this.paint(); return; }   // signed in: the screen stays, its lists refresh
    html = this.html();
    ScanStation.stopCamera();
    root.innerHTML = html; this._html = html;
    this.bind(root);
  },
  rebrand(h) {
    return String(h).replace(/<h1>ShopFlow<\/h1>/g, "<h1>" + this.L("Assembly", "Surinkimas") + "</h1>")
      .replace(/<div class="login-foot">ShopFlow<\/div>/g, '<div class="login-foot">Dėdės Baldai</div>');
  },
  boot() {
    var self = this;
    document.title = this.L("Assembly", "Surinkimas") + " · Dėdės Baldai";
    App.render = function () { return self.render(); };
    var login = App.login;
    App.login = function (m) { self._html = null; self.msg = null; self._idleAt = Date.now(); login.call(App, m); App.view = "scan"; self.render(); };
    var logout = App.logout;
    App.logout = function () { self._html = null; Login.selected = null; Login.entered = ""; logout.call(App); };
    App.usesCockpit = () => false;
    App.navigate = () => self.render();             // nothing to go to from here
    if (typeof Palette !== "undefined") { Palette.toggle = () => {}; Palette.open = () => {}; }
    if (typeof Drawer !== "undefined") Drawer.open = () => {};
    if (typeof MyWork !== "undefined") { MyWork.paint = () => {}; MyWork.open = () => {}; }
    ScanStation.isActive = () => !!App.me;
    ScanStation.onScan = function (payload) { self.scan(String(payload).trim()); };
    ScanStation.render = function () {};
    /* the screen follows the camera, whenever it starts or stops (the permission prompt, the drawing closing…) */
    var start = ScanStation.startCamera, stop = ScanStation.stopCamera;
    ScanStation.startCamera = function () { self._camAt = Date.now(); var r = start.apply(ScanStation, arguments); Promise.resolve(r).then(() => self.paint(), () => self.paint()); return r; };
    ScanStation.stopCamera = function () { var r = stop.apply(ScanStation, arguments); self.paint(); return r; };
    setInterval(() => {   // nobody scanning for 3 minutes: the camera goes off (battery, and the bench is quiet)
      if (ScanStation.camera && !Assembly.isOpen() && Date.now() - Math.max(self._camAt || 0, ScanStation._last.ts || 0) > 3 * 60000) ScanStation.stopCamera();
    }, 15000);
    var close = Assembly.close;
    Assembly.close = function () { close.call(Assembly); self.paint(); };
    ["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, () => { self._idleAt = Date.now(); }, true));
    setInterval(() => {
      if (App.me && Date.now() - self._idleAt > self.IDLE_MS && !ScanStation.camera) { Assembly.close(); App.logout(); }
    }, 60000);
    this._css();
  },
  _css() {
    var s = document.createElement("style");
    s.textContent = `
.ksk{min-height:100vh;min-height:100dvh;display:flex;flex-direction:column;background:var(--bg)}
.ksk-top{display:flex;align-items:center;gap:12px;padding:12px 18px;background:var(--surface);border-bottom:1px solid var(--border)}
.ksk-top .grow{flex:1}
.ksk-brand{display:flex;align-items:center;gap:10px;color:var(--accent)}.ksk-brand div{display:flex;flex-direction:column;line-height:1.15;color:var(--text)}.ksk-brand b{font-size:19px}.ksk-brand span{font-size:12.5px;color:var(--text-2)}
.ksk-me{display:flex;align-items:center;gap:8px;font-size:15px}
.ksk-top .btn{min-height:44px}
.ksk-main{flex:1;display:flex;gap:18px;padding:18px;max-width:1100px;width:100%;margin:0 auto;box-sizing:border-box}
.ksk-scan{flex:1;min-width:0;display:flex;flex-direction:column;gap:14px}
.ksk-video{position:relative;display:none;flex:none;height:56vh;max-height:620px;min-height:260px;border-radius:var(--r-lg);overflow:hidden;background:#000}.ksk-scan.cam-on .ksk-video{display:block}
.ksk-video #scan-video{opacity:1}
.ksk-off{z-index:2}
.ksk-x{position:absolute;top:12px;right:12px;z-index:2;width:64px;height:64px;border-radius:50%;border:0;background:rgba(20,20,20,.78);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3)}
.ksk-off{position:absolute;left:50%;bottom:14px;transform:translateX(-50%);display:inline-flex;align-items:center;gap:8px;min-height:56px;padding:0 22px;border-radius:999px;border:0;background:rgba(20,20,20,.78);color:#fff;font:inherit;font-size:17px;font-weight:700;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,.3)}
.ksk-scan.cam-on .ksk-cam{display:none}
.ksk-cam{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:230px;padding:26px;border-radius:var(--r-lg);border:0;background:var(--accent);color:#fff;font:inherit;cursor:pointer;box-shadow:var(--shadow-2);text-align:center}
.ksk-cam b{font-size:26px}.ksk-cam span{font-size:15px;opacity:.9;max-width:440px}
.ksk-cam.active{background:var(--surface);color:var(--text);border:2px solid var(--border-strong);min-height:90px;padding:14px;box-shadow:none}.ksk-cam.active span{display:none}.ksk-cam.active b{font-size:19px}
.ksk-cam:disabled{background:var(--surface-2);color:var(--text-2);cursor:default}
.ksk-type{display:flex;gap:8px}.ksk-type .input{flex:1;min-height:48px;font-size:16px}.ksk-type .btn{min-height:48px}
.ksk-msg{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:var(--r-md);font-size:15px}
.ksk-msg.err{background:var(--red-soft,#fde8e8);color:#9b1c1c}.ksk-msg.warn{background:var(--orange-soft);color:#8a4d00}
.ksk-recent{flex:0 0 330px;display:flex;flex-direction:column;gap:8px}
.ksk-rec{display:flex;align-items:center;gap:10px;width:100%;min-height:60px;padding:10px 12px;border-radius:var(--r-md);border:1px solid var(--border);background:var(--surface);color:var(--text);font:inherit;text-align:left;cursor:pointer}
.ksk-rec .grow{flex:1;min-width:0;display:flex;flex-direction:column}.ksk-rec b{font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.ksk-rec .grow span{font-size:12.5px;color:var(--text-2)}
.ksk-rec-ic{color:var(--accent)}
.ksk-none{color:var(--text-2);font-size:14px;padding:10px 2px}
@media (max-width:820px){.ksk-main{flex-direction:column}.ksk-recent{flex:0 0 auto}.ksk-me b{display:none}}
`;
    document.head.appendChild(s);
  }
};
Kiosk.boot();
