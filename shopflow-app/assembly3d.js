/* ============================================================
   ShopFlow — the assembly station's 3-D cabinet (Asm3D)

   The cabinet builder sends, with its drawing sheets, every cabinet as
   boxes ("3D modelis.json" on the project): each board's extent in its
   cabinet (x right, y from the front to the back, z up), its colour and
   how far it moves in the exploded view (the same as the sheets').
   Here it is drawn with three.js (vendored, loaded only when first used)
   so the person at the bench can turn it round, pull it apart, take the
   fronts off, and see the scanned (or tapped) board in orange.

   Plain Promises, no ?. — this runs on the older shop tablets too.
   ============================================================ */
"use strict";

var Asm3D = {
  LIB: "../hub/shared/vendor/three/three-view.min.js",
  T: null,
  _libP: null,
  _models: {},        // fileId → Promise<model json>
  v: null,            // the live view: {box, R, scene, cam, ctl, root, meshes, cab, sel, mode, exp, t, dim, raf}
  mode: "assembly",   // assembly | interior (no fronts)
  exp: false,         // exploded
  dim: false,         // the others see-through

  init() {
    try { var k = JSON.parse(localStorage.getItem("asm.3d") || "null"); if (k) { this.mode = k.mode === "interior" ? "interior" : "assembly"; this.exp = !!k.exp; this.dim = !!k.dim; } } catch (e) {}
  },
  L(en, lt) { return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en; },

  /* ---------- the model on the project ---------- */
  modelFile(o) {
    var ids = (typeof Assembly !== "undefined" ? Assembly.related(o) : [{ o: o }]).filter(r => r.src !== "client").map(r => r.o.id);
    var list = D.files().filter(f => ids.indexOf(f.orderId) >= 0 && f.drw && f.drw.model);
    list.sort((a, b) => (ids.indexOf(a.orderId) - ids.indexOf(b.orderId)) || ((b.at || 0) - (a.at || 0)));
    return list[0] || null;
  },
  model(f) {
    if (!f) return Promise.resolve(null);
    if (this._models[f.id]) return this._models[f.id];
    var self = this;
    var p = Files.url(f.id).then(u => {
      if (!u) throw new Error(self.L("The 3-D model has not reached the cloud yet", "3D modelis dar neįkeltas į debesį"));
      return fetch(u).then(r => r.json());
    });
    p.catch(() => { delete self._models[f.id]; });
    this._models[f.id] = p;
    return p;
  },
  /* the cabinet whose boards are this cabinet's panels (their builder names) */
  cabOf(model, names) {
    if (!model || !Array.isArray(model.cabs)) return null;
    var want = {}, n = 0;
    (names || []).forEach(x => { if (x) { want[String(x).toUpperCase()] = 1; n++; } });
    if (!n) return null;
    var best = null, bestN = 0;
    model.cabs.forEach(c => {
      var k = (c.parts || []).filter(p => p.n && want[String(p.n).toUpperCase()]).length;
      if (k > bestN) { best = c; bestN = k; }
    });
    return best;
  },

  /* ---------- three.js ---------- */
  lib() {
    if (this.T) return Promise.resolve(this.T);
    if (this._libP) return this._libP;
    var self = this, url = new URL(this.LIB, location.href).href;
    this._libP = new Promise((resolve, reject) => {
      var imp;
      try { imp = new Function("u", "return import(u)"); } catch (e) { return reject(new Error(self.L("This browser cannot show 3-D", "Ši naršyklė negali rodyti 3D"))); }
      imp(url).then(m => { self.T = m; resolve(m); }, e => { self._libP = null; reject(new Error(self.L("Could not load the 3-D viewer — check the internet connection", "Nepavyko įkelti 3D peržiūros — patikrinkite internetą"))); });
    });
    return this._libP;
  },

  /* ---------- the view ---------- */
  mount(box, cab, opts) {
    var self = this;
    opts = opts || {};
    this.unmount();
    return this.lib().then(T => {
      if (!box.isConnected) return;
      var R;
      try { R = new T.WebGLRenderer({ antialias: true, alpha: false }); }
      catch (e) { throw new Error(self.L("This tablet cannot draw 3-D (WebGL is off)", "Ši planšetė negali piešti 3D (išjungtas WebGL)")); }
      R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      R.toneMapping = T.ACESFilmicToneMapping; R.toneMappingExposure = 1.05; R.outputColorSpace = T.SRGBColorSpace;
      var sc = new T.Scene(); sc.background = new T.Color("#eef0f1");
      try { var pm = new T.PMREMGenerator(R); sc.environment = pm.fromScene(new T.RoomEnvironment(), 0.03).texture; sc.environmentIntensity = 0.55; } catch (e) {}
      var key = new T.DirectionalLight(0xffffff, 1.5); key.position.set(-900, 1500, 1300); sc.add(key);
      var fill = new T.DirectionalLight(0xffffff, 0.5); fill.position.set(1200, 500, 600); sc.add(fill);
      sc.add(new T.AmbientLight(0xffffff, 0.4));
      var cam = new T.PerspectiveCamera(28, 1, 10, 80000);
      var ctl = new T.OrbitControls(cam, R.domElement);
      ctl.enableDamping = true; ctl.dampingFactor = 0.12; ctl.rotateSpeed = 0.8; ctl.zoomToCursor = true;
      var root = new T.Group(); root.rotation.x = -Math.PI / 2; sc.add(root);   // cabinet z up → screen up
      var cv = R.domElement; cv.className = "a3-cv";
      box.innerHTML = "";
      box.appendChild(cv);
      var v = self.v = { box: box, R: R, scene: sc, cam: cam, ctl: ctl, root: root, meshes: [], cab: cab, sel: opts.sel || "", t: self.exp ? 1 : 0, raf: 0,
        onPick: opts.onPick || null, mats: {}, ray: new T.Raycaster(), down: null, fly: null };
      self.build();
      self.view(self._kind || "iso", true);
      var kp = self._keep;
      if (kp && kp.nr === cab.nr && kp.n === (cab.parts || []).length) { cam.position.fromArray(kp.pos); ctl.target.fromArray(kp.tg); ctl.update(); }   // the same cabinet again: as it was turned
      cv.addEventListener("pointerdown", e => { v.fly = null; v.down = [e.clientX, e.clientY]; });
      cv.addEventListener("pointerup", e => {
        var d = v.down; v.down = null;
        if (!d || Math.hypot(e.clientX - d[0], e.clientY - d[1]) > 6) return;
        var hit = self.hit(e);
        if (hit && hit.userData.p.n && v.onPick) v.onPick(hit.userData.p.n);
      });
      cv.addEventListener("wheel", () => { v.fly = null; }, { passive: true });
      var loop = () => {
        if (self.v !== v || !cv.isConnected) { if (self.v === v) self.unmount(); return; }
        v.raf = requestAnimationFrame(loop);
        self.frame();
      };
      v.raf = requestAnimationFrame(loop);
    });
  },
  unmount() {
    var v = this.v; if (!v) return;
    this.v = null;
    if (v.raf) cancelAnimationFrame(v.raf);
    this._keep = { nr: v.cab.nr, n: (v.cab.parts || []).length, pos: v.cam.position.toArray(), tg: v.ctl.target.toArray() };
    try { v.ctl.dispose(); } catch (e) {}
    v.meshes.forEach(m => { try { m.geometry.dispose(); m.children.forEach(c => c.geometry.dispose()); } catch (e) {} });
    Object.keys(v.mats).forEach(k => { try { v.mats[k].dispose(); } catch (e) {} });
    try { v.R.dispose(); if (v.R.forceContextLoss) v.R.forceContextLoss(); } catch (e) {}
    if (v.R.domElement.parentNode) v.R.domElement.parentNode.removeChild(v.R.domElement);
  },
  mat(color, opt) {
    var T = this.T, v = this.v, k = color + "|" + JSON.stringify(opt || {});
    if (!v.mats[k]) v.mats[k] = new T.MeshStandardMaterial(Object.assign({ color: new T.Color(color), roughness: 0.62, metalness: 0 }, opt || {}));
    return v.mats[k];
  },
  build() {
    var T = this.T, v = this.v;
    (v.cab.parts || []).forEach(p => {
      var e = p.e, sx = Math.max(0.5, e[0][1] - e[0][0]), sy = Math.max(0.5, e[1][1] - e[1][0]), sz = Math.max(0.5, e[2][1] - e[2][0]);
      var g = new T.BoxGeometry(sx, sy, sz);
      var m = new T.Mesh(g, this.mat(p.f || "#ffffff", p.fit === "pin" || p.fit === "drawer" || p.role === "KOJA" ? { metalness: 0.4, roughness: 0.4 } : null));
      var ln = new T.LineSegments(new T.EdgesGeometry(g, 25), new T.LineBasicMaterial({ color: 0x1c211e, transparent: true, opacity: 0.32 }));
      m.add(ln);
      m.userData = { p: p, c: [(e[0][0] + e[0][1]) / 2, (e[1][0] + e[1][1]) / 2, (e[2][0] + e[2][1]) / 2], d: p.d || [0, 0, 0], ln: ln };
      v.root.add(m); v.meshes.push(m);
    });
    this.place(); this.paint();
  },
  /* where the boards are: assembled → exploded (t 0…1) */
  place() {
    var v = this.v; if (!v) return;
    var t = v.t;
    v.meshes.forEach(m => {
      var u = m.userData;
      m.position.set(u.c[0] + u.d[0] * t, u.c[1] + u.d[1] * t, u.c[2] + u.d[2] * t);
      m.visible = !(this.mode === "interior" && u.p.front);
    });
  },
  paint() {
    var v = this.v; if (!v) return;
    var sel = String(v.sel || "").toUpperCase(), any = !!sel && v.meshes.some(m => String(m.userData.p.n).toUpperCase() === sel);
    v.meshes.forEach(m => {
      var p = m.userData.p, on = any && String(p.n).toUpperCase() === sel;
      if (on) m.material = this.mat("#ff9a1f", { emissive: new this.T.Color("#b34700"), emissiveIntensity: 0.55, roughness: 0.5 });
      else if (any && this.dim) m.material = this.mat(p.f || "#ffffff", { transparent: true, opacity: 0.16, depthWrite: false });
      else m.material = this.mat(p.f || "#ffffff", p.fit === "pin" || p.fit === "drawer" || p.role === "KOJA" ? { metalness: 0.4, roughness: 0.4 } : null);
      m.userData.ln.material.color.set(on ? 0x7a2e00 : 0x1c211e);
      m.userData.ln.material.opacity = on ? 0.9 : any && this.dim ? 0.12 : 0.32;
      m.renderOrder = on ? 2 : 0;
    });
  },
  select(name) { if (!this.v) return; this.v.sel = name || ""; this.paint(); },
  setMode(mode) { this.mode = mode; this.place(); this.fit(true); },
  setExp(on) { this.exp = !!on; },
  setDim(on) { this.dim = !!on; this.paint(); },
  hit(e) {
    var v = this.v, T = this.T, r = v.R.domElement.getBoundingClientRect();
    var p = new T.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    v.ray.setFromCamera(p, v.cam);
    var hits = v.ray.intersectObjects(v.meshes.filter(m => m.visible), false);
    if (this.dim && v.sel) {   // see-through boards are not in the way
      var sel = String(v.sel).toUpperCase(), solid = hits.filter(h => String(h.object.userData.p.n).toUpperCase() === sel);
      if (solid.length) return solid[0].object;
    }
    return hits.length ? hits[0].object : null;
  },
  bounds(exploded) {
    var T = this.T, v = this.v, b = new T.Box3(), k = exploded ? 1 : 0;
    v.meshes.forEach(m => {
      if (!m.visible) return;
      var u = m.userData, e = u.p.e;
      b.expandByPoint(new T.Vector3(e[0][0] + u.d[0] * k, e[1][0] + u.d[1] * k, e[2][0] + u.d[2] * k));
      b.expandByPoint(new T.Vector3(e[0][1] + u.d[0] * k, e[1][1] + u.d[1] * k, e[2][1] + u.d[2] * k));
    });
    if (b.isEmpty()) b.set(new T.Vector3(0, 0, 0), new T.Vector3(600, 560, 720));
    return b;
  },
  /* the camera from a side: front | iso | left | back */
  view(kind, now) {
    var v = this.v; if (!v) return;
    this._kind = kind;
    var T = this.T, b = this.bounds(this.exp), c = b.getCenter(new T.Vector3()), sz = b.getSize(new T.Vector3());
    var dirs = { front: [0, -1, 0.04], iso: [-0.55, -0.85, 0.5], left: [-1, -0.02, 0.06], right: [1, -0.02, 0.06], back: [0, 1, 0.1], top: [0, -0.05, 1] };
    var d = new T.Vector3().fromArray(dirs[kind] || dirs.iso).normalize();
    var r = 0.5 * Math.hypot(sz.x, sz.y, sz.z), w = v.box.clientWidth || 800, h = v.box.clientHeight || 600;
    var fov = v.cam.fov * Math.PI / 180, fh = Math.min(fov, 2 * Math.atan(Math.tan(fov / 2) * (w / h)));
    var dist = r / Math.sin(fh / 2) * 1.04;
    v.root.updateMatrixWorld();
    var cw = c.clone().applyMatrix4(v.root.matrixWorld);
    var dW = new T.Vector3(d.x, d.z, -d.y);   // cabinet axes → screen axes (root turned −90° about x)
    var pos = cw.clone().add(dW.multiplyScalar(dist));
    if (now) { v.cam.position.copy(pos); v.ctl.target.copy(cw); v.ctl.update(); v.fly = null; }
    else v.fly = { pos: pos, tg: cw };
  },
  fit(soft) { this.view(this._kind || "iso", !soft); },
  frame() {
    var v = this.v, box = v.box, w = box.clientWidth, h = box.clientHeight;
    if (!w || !h) return;
    if (v.w !== w || v.h !== h) { v.w = w; v.h = h; v.R.setSize(w, h, false); v.cam.aspect = w / h; v.cam.updateProjectionMatrix(); }
    var goal = this.exp ? 1 : 0;
    if (Math.abs(v.t - goal) > 0.001) { v.t += (goal - v.t) * 0.16; if (Math.abs(v.t - goal) < 0.003) v.t = goal; this.place(); }
    if (v.fly) {
      v.cam.position.lerp(v.fly.pos, 0.18); v.ctl.target.lerp(v.fly.tg, 0.18);
      if (v.cam.position.distanceTo(v.fly.pos) < 2) { v.cam.position.copy(v.fly.pos); v.ctl.target.copy(v.fly.tg); v.fly = null; }
    }
    v.ctl.update();
    v.R.render(v.scene, v.cam);
  },
  zoom(k) {
    var v = this.v; if (!v) return;
    v.fly = null;
    v.cam.position.sub(v.ctl.target).multiplyScalar(k).add(v.ctl.target); v.ctl.update();
  }
};
Asm3D.init();
