/* =====================================================================
   iso.js — 3D connector editor (Konstrukcija step).
   The carcass is drawn in an axonometric view from the engine's panels
   (place o/u/v/n), joint lines from buildCabinet().seams. Connectors are
   dragged from the palette onto a joint line (add / change the joint's
   type), dragged along the line (move) or off it (remove). Positions are
   mm along the joint, written as c.cnc.joints[key] = { type, pos:[…] }.
   Left and right sides share one joint (mirror), as the engine drills them.
   ===================================================================== */
(function (root) {
"use strict";
var V = { th:0.62, ph:0.42 };          // view: azimuth (0 = from the front, + = from the left), elevation
var C = null;                           // current mount: { el, o, svg, geo, seams, k, … }
var D = null;                           // drag in progress
var RO = null;
var MODE = 'both';                       // 'both': a change applies to both sides (mirror); 'sep': only the side you drag on
var FULL = false;                       // editor opened over the whole screen
var ARM = null;                         // tap mode: a palette type picked by a tap, placed by the next tap on a joint line
var TYPES = ['confirmat', 'cam', 'dowel'];
var REF = { bottom:'isoRefFront', top:'isoRefFront', railB:'isoRefBack', railV:'isoRefRail', railBottom:'isoRefBottom', back:'isoRefBottom', shelf:'isoRefShelf', oven:'isoRefShelf' };

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function f1(v) { v = Math.round(v * 10) / 10; return String(v); }
function T(k) { return C && C.o.t ? C.o.t(k) : k; }

/* ---------------------------------------------------------------- projection */
function setupView() {
  var d = C.o.r.dims, legH = C.o.legH || 0, w = C.el.querySelector('.iso-stage').clientWidth || 640;
  var st = C.el.querySelector('.iso-stage'), h = FULL && st.clientHeight > 200 ? st.clientHeight : Math.round(Math.max(320, Math.min(520, w * 0.7)));
  var R = 0.5 * Math.sqrt(d.W * d.W + d.D * d.D + (d.H + legH) * (d.H + legH));
  C.w = w; C.h = h; C.top = 30; C.k = Math.min(w, h - C.top) / (2 * R * 1.04);   // top strip kept for the view buttons
  C.c3 = [d.W / 2, d.D / 2, (d.H - legH) / 2];
  C.ct = Math.cos(V.th); C.st = Math.sin(V.th); C.cp = Math.cos(V.ph); C.sp = Math.sin(V.ph);
}
function P(q) {   // cabinet mm → screen px (+ distance from the viewer for sorting)
  var x = q[0] - C.c3[0], y = q[1] - C.c3[1], z = q[2] - C.c3[2];
  var rx = x * C.ct + y * C.st, dp = -x * C.st + y * C.ct;
  return [C.w / 2 + rx * C.k, (C.h + C.top) / 2 - (z * C.cp + dp * C.sp) * C.k, dp * C.cp - z * C.sp];
}
function W3(p, a, b, c) { var q = p.place; return [0, 1, 2].map(function (i) { return q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]; }); }
function along(s, a) { return [s.o[0] + a * s.d[0], s.o[1] + a * s.d[1], s.o[2] + a * s.d[2]]; }

/* ---------------------------------------------------------------- geometry layer */
function roleCls(p) {
  if (p.role === 'KAIRE' || p.role === 'DESINE') return 'iso-side';
  if (/^JUOSTA/.test(p.role)) return 'iso-rail';
  if (p.role === 'NUGARA') return 'iso-back';
  if (p.role === 'LENTYNA') return p.holes.length || p.edges.length ? 'iso-shelf' : 'iso-shelf adj';
  return 'iso-carc';
}
function drawGeo() {
  var r = C.o.r, faces = [], s = '';
  (r.legs || []).forEach(function (l) {
    var a = P([l.x, l.y, 0]), b = P([l.x, l.y, -l.h]);
    s += '<line class="iso-leg" x1="' + a[0].toFixed(1) + '" y1="' + a[1].toFixed(1) + '" x2="' + b[0].toFixed(1) + '" y2="' + b[1].toFixed(1) + '" stroke-width="' + Math.max(3, l.d * C.k).toFixed(1) + '"/>';
  });
  r.panels.forEach(function (p) {
    if (!p.place || p.role === 'FASADAS' || p.role === 'DURYS') return;
    var cls = roleCls(p), Lp = p.L, Wp = p.W, Tp = p.T;
    var q = function (a, b, c) { return P(W3(p, a, b, c)); };
    var quads = [
      [q(0, 0, 0), q(Lp, 0, 0), q(Lp, Wp, 0), q(0, Wp, 0)], [q(0, 0, Tp), q(Lp, 0, Tp), q(Lp, Wp, Tp), q(0, Wp, Tp)],
      [q(0, 0, 0), q(0, Wp, 0), q(0, Wp, Tp), q(0, 0, Tp)], [q(Lp, 0, 0), q(Lp, Wp, 0), q(Lp, Wp, Tp), q(Lp, 0, Tp)],
      [q(0, 0, 0), q(Lp, 0, 0), q(Lp, 0, Tp), q(0, 0, Tp)], [q(0, Wp, 0), q(Lp, Wp, 0), q(Lp, Wp, Tp), q(0, Wp, Tp)]];
    quads.forEach(function (f, i) { faces.push({ f:f, cls:cls + (i < 2 ? ' big' : ' edge'), z:(f[0][2] + f[1][2] + f[2][2] + f[3][2]) / 4 }); });
  });
  faces.sort(function (a, b) { return b.z - a.z; });
  faces.forEach(function (x) { s += '<polygon class="' + x.cls + '" points="' + x.f.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>'; });
  var d = r.dims, fr = P([d.W / 2, -Math.max(60, d.D * 0.16), 0]);
  s += '<text class="iso-front" x="' + fr[0].toFixed(1) + '" y="' + fr[1].toFixed(1) + '" text-anchor="middle">' + esc(T('isoFront')) + '</text>';
  return s;
}

/* ---------------------------------------------------------------- joints / seams */
function jointOf(key) { return (C.o.r.joints || []).filter(function (j) { return j.key === key; })[0]; }
function sideOf(key, side) { var j = jointOf(key); return j ? Object.assign({ key:key, w:j.w }, j.sides ? j.sides[side || 'L'] : j) : null; }
function perSide(key) { var j = jointOf(key); if (j && j.single) return false; return MODE === 'sep' || !!(j && j.split); }   // a partition / rail joint has one line only   // a joint whose sides already differ is always edited per side
function sameGroup(key, side, k2, s2) { return key === k2 && (side === s2 || !perSide(key)); }
function selOn(key, side) { var q = C.o.sel; return !!q && sameGroup(q.key, q.side || 'L', key, side); }
function seamPx(s) { var a = P(s.o), b = P(along(s, s.w)); return { s:s, a:a, b:b, len:Math.hypot(b[0] - a[0], b[1] - a[1]) }; }
function seg(m, sp) {
  var dx = sp.b[0] - sp.a[0], dy = sp.b[1] - sp.a[1], L2 = dx * dx + dy * dy;
  var u = L2 > 1e-6 ? ((m[0] - sp.a[0]) * dx + (m[1] - sp.a[1]) * dy) / L2 : 0, uc = Math.max(0, Math.min(1, u));
  return { u:u, uc:uc, d:Math.hypot(m[0] - (sp.a[0] + uc * dx), m[1] - (sp.a[1] + uc * dy)) };
}
/* positions shown on one side of a joint: the drag preview, else what the engine drills */
function inDrag(key, side) { return D && D.key === key && D.prev && sameGroup(D.key, D.side, key, side); }
function posOf(key, side) { if (inDrag(key, side)) return D.prev; var j = sideOf(key, side); return j ? j.pos : []; }
function typeOf(key, side) { var j = sideOf(key, side); return j ? j.type : 'confirmat'; }
function camDowels(pos, w) {   // same rule as the engine (outer cams ±32), for the preview only
  if (!pos.length) return [];
  var off = 32, d = pos.length >= 2 ? [pos[0] + off, pos[pos.length - 1] - off] : [pos[0] - off, pos[0] + off];
  if (pos.length === 2 && pos[1] - pos[0] < 2 * off + 16) d = [];
  return d.filter(function (a) { return a >= 8 && a <= w - 8 && pos.every(function (q) { return Math.abs(q - a) >= 12; }); });
}
function mk(type, x, y, cls) {
  x = x.toFixed(1); y = y.toFixed(1);
  if (type === 'cam') return '<g class="iso-m cam ' + cls + '"><circle cx="' + x + '" cy="' + y + '" r="9.5"/><line x1="' + (+x - 5) + '" y1="' + y + '" x2="' + (+x + 5) + '" y2="' + y + '"/></g>';
  if (type === 'dowel') return '<g class="iso-m dow ' + cls + '"><circle cx="' + x + '" cy="' + y + '" r="6.8"/></g>';
  return '<g class="iso-m conf ' + cls + '"><circle cx="' + x + '" cy="' + y + '" r="8"/><circle class="hd" cx="' + x + '" cy="' + y + '" r="2.6"/></g>';
}
function drawSeams() {
  var s = '';
  C.seams.forEach(function (sp, i) {
    if (sp.len < 1) return;
    var tgt = D && D.mode === 'add' && sp.len >= 12, on = selOn(sp.s.key, sp.s.side), hot = D && D.cand && (D.cand.i === i || (!D.cand.per && D.cand.key === sp.s.key));
    if (tgt) s += '<line class="iso-tgt' + (hot ? ' hot' : '') + '" x1="' + sp.a[0].toFixed(1) + '" y1="' + sp.a[1].toFixed(1) + '" x2="' + sp.b[0].toFixed(1) + '" y2="' + sp.b[1].toFixed(1) + '"/>';
    s += '<line class="iso-seam' + (on ? ' on' : '') + (hot ? ' hot' : '') + '" x1="' + sp.a[0].toFixed(1) + '" y1="' + sp.a[1].toFixed(1) + '" x2="' + sp.b[0].toFixed(1) + '" y2="' + sp.b[1].toFixed(1) + '"/>';
    s += '<line class="iso-seamhit" data-seam="' + i + '" x1="' + sp.a[0].toFixed(1) + '" y1="' + sp.a[1].toFixed(1) + '" x2="' + sp.b[0].toFixed(1) + '" y2="' + sp.b[1].toFixed(1) + '"><title>' + esc(T('jk_' + sp.s.key)) + '</title></line>';
  });
  return s;
}
function drawMarks() {
  var s = '', sel = C.o.sel || {};
  C.seams.forEach(function (sp, i) {
    var key = sp.s.key, sd = sp.s.side, j = sideOf(key, sd); if (!j) return;
    var own = sp.s.at && !inDrag(key, sd), pos = own ? sp.s.at.pos : posOf(key, sd), type = own ? sp.s.at.type : typeOf(key, sd), dws = type === 'cam' ? (inDrag(key, sd) ? camDowels(pos, sp.s.w) : own ? sp.s.at.dowels : j.dowels) : [];
    var drg = D && D.mode === 'move' && sameGroup(D.key, D.side, key, sd), jsel = selOn(key, sd);
    dws.forEach(function (a) { var p = P(along(sp.s, a)); s += '<circle class="iso-dw" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2"/>'; });
    pos.forEach(function (a, n) {
      var p = P(along(sp.s, a)), isSel = jsel && sel.idx === n && !drg;
      var act = drg && D.idx === n, off = act && D.off;
      s += mk(type, p[0], p[1], (jsel ? 'jsel ' : '') + (isSel ? 'sel ' : '') + (act ? 'act ' : '') + (off ? 'off ' : '') + (act && D.bad ? 'bad' : ''));
      if (!D || D.mode !== 'add') s += '<circle class="iso-hit" data-key="' + key + '" data-side="' + sd + '" data-i="' + n + '" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="16"><title>' + esc(T('jk_' + key) + ' · ' + sideTxt(key, sd) + ' · ' + f1(a) + ' mm ' + T(refKey(sp.s))) + '</title></circle>';
    });
  });
  if (D && D.mode === 'add' && D.cand) C.seams.forEach(function (sp, i) {   // the new connector on this side, or on both when the sides go together
    if (i !== D.cand.i && (D.cand.per || sp.s.key !== D.cand.key)) return;
    var cp = P(along(sp.s, D.cand.a)); s += mk(D.type, cp[0], cp[1], 'ghost' + (D.bad ? ' bad' : '')); });
  if (D && D.tip) s += tipSVG(D.tip.x, D.tip.y, D.tip.lines, D.tip.bad);
  return s;
}
function isSingle(key) { var j = jointOf(key); return !!(j && j.single); }
function sideTxt(key, side) { return isSingle(key) ? T('isoOneLine') : perSide(key) ? T(side === 'R' ? 'sideR' : 'sideL') : T('isoBoth'); }
function refKey(s) {
  if (s.key === 'railF') return Math.abs(s.d[2]) > 0.5 ? 'isoRefRail' : 'isoRefFront';
  if (/^partF\d/.test(s.key)) return 'isoRefPartF';
  if (/^partR\d/.test(s.key)) return 'isoRefPartR';
  if (/^backP\d/.test(s.key)) return 'isoRefBottom';
  if (s.key === 'railVH' || s.key === 'railBotB') return 'isoRefLeft';
  return REF[s.key] || 'isoRefFront';
}
function tipSVG(x, y, lines, bad) {
  var w = Math.min(C.w - 8, Math.max.apply(null, lines.map(function (l) { return l.length; })) * 6.6 + 14), h = lines.length * 15 + 8;
  var tx = Math.min(C.w - w - 4, Math.max(4, x + 14)), ty = Math.max(4, y - h - 12);
  return '<g class="iso-tip' + (bad ? ' bad' : '') + '"><rect x="' + tx.toFixed(1) + '" y="' + ty.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h + '" rx="5"/>' +
    lines.map(function (l, i) { return '<text x="' + (tx + 7).toFixed(1) + '" y="' + (ty + 16 + i * 15).toFixed(1) + '"' + (i ? '' : ' class="b"') + '>' + esc(l) + '</text>'; }).join('') + '</g>';
}
function draw(only) {
  if (!C) return;
  setupView();
  C.seams = (C.o.r.seams || []).map(seamPx);
  var svg = C.el.querySelector('.iso-stage svg');
  if (!svg || only !== 'marks') {
    C.el.querySelector('.iso-stage').innerHTML = '<svg width="' + C.w + '" height="' + C.h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(T('isoTitle')) + '">' +
      '<g class="iso-geo">' + drawGeo() + '</g><g class="iso-seams">' + drawSeams() + '</g><g class="iso-mk">' + drawMarks() + '</g></svg>';
  } else {
    svg.querySelector('.iso-seams').innerHTML = drawSeams();
    svg.querySelector('.iso-mk').innerHTML = drawMarks();
  }
}

/* ---------------------------------------------------------------- snapping & limits */
function pxPerMm(sp) { return sp.len / Math.max(1, sp.s.w); }
function snap(a, sp, j, others) {
  var w = sp.s.w, thr = 7 / Math.max(0.05, pxPerMm(sp)), best = null;
  var cands = [[w / 2, 'isoSnapMid']];
  others.forEach(function (p) { cands.push([w - p, 'isoSnapSym']); });
  (j.defPos || []).forEach(function (p) { cands.push([p, 'isoSnapStd']); });
  cands.forEach(function (c) { var d = Math.abs(c[0] - a); if (d <= thr && (!best || d < best.d)) best = { a:c[0], why:c[1], d:d }; });
  a = best ? best.a : Math.round(a);
  var lo = j.minEdge, hi = w - j.minEdge;
  a = Math.max(lo, Math.min(hi, a));
  return { a:Math.round(a * 10) / 10, why:best && Math.abs(best.a - a) < 0.05 ? best.why : '' };
}
function limitsFor(type) { return type === 'cam' ? { gap:24, edge:12 } : { gap:16, edge:9 }; }
function tooClose(a, list, gap) { return list.some(function (p) { return Math.abs(p - a) < gap - 0.01; }); }

/* ---------------------------------------------------------------- pointer handling */
function hitMarker(m) {   // nearest connector within reach (dense corners: nearest wins, not the one drawn last)
  var best = null;
  C.seams.forEach(function (sp, i) { if (!jointOf(sp.s.key)) return;
    posOf(sp.s.key, sp.s.side).forEach(function (a, n) { var p = P(along(sp.s, a)), d = Math.hypot(p[0] - m[0], p[1] - m[1]);
      if (d <= 20 && (!best || d < best.d)) best = { key:sp.s.key, side:sp.s.side, idx:n, seam:i, d:d }; }); });
  return best;
}
function hitSeam(m) { var best = null, bd = 9; C.seams.forEach(function (sp, i) { if (sp.len < 1 || !jointOf(sp.s.key)) return; var g = seg(m, sp); if (g.d < bd) { bd = g.d; best = i; } }); return best; }
function local(e) { var r = C.el.querySelector('.iso-stage svg').getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function inside(e) { var r = C.el.querySelector('.iso-stage').getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }

function startOrbit(e) { D = { mode:'orbit', x:e.clientX, y:e.clientY, th:V.th, ph:V.ph, moved:false }; }
function startMove(e, key, side, idx, si) {
  var j = sideOf(key, side); if (!j) return;
  D = { mode:'move', key:key, side:side, per:perSide(key), idx:idx, seam:si, orig:j.pos.slice(), prev:j.pos.slice(), x:e.clientX, y:e.clientY, moved:false, type:j.type };
}
/* what goes to the app: side null = both sides get it */
function commit(key, side, type, pos, meta) { C.o.onCommit(key, { side:perSide(key) ? side : null, type:type, pos:pos }, meta || {}); }
var TOUCH_UP = 56;   // on touch the connector is carried above the finger so it stays visible
function startAdd(e, type) {
  D = { mode:'add', type:type, x:e.clientX, y:e.clientY, moved:false, touch:e.pointerType === 'touch' };
  var g = document.createElement('div'); g.className = 'iso-ghost'; g.innerHTML = '<div class="iso-ghost-art">' + photo(type) + '</div><b>' + esc(T('isoT_' + type)) + '</b>';
  document.body.appendChild(g); D.ghostEl = g; moveGhost(e); draw('marks');
}
function moveGhost(e) {
  if (!D || !D.ghostEl) return;
  var g = D.ghostEl, up = D.touch ? TOUCH_UP : 0;
  g.style.left = e.clientX + 'px'; g.style.top = (e.clientY - up) + 'px';
  g.classList.toggle('on', !!D.cand); g.classList.toggle('moving', !!D.moved);
}
function art(type) { return root.DBArt ? root.DBArt.art(type) : chipIcon(type); }
function photo(type) { return root.DBArt ? root.DBArt.photo(type, T('isoT_' + type)) : art(type); }
function pic(type) { return root.DBArt ? root.DBArt.pic(type, T('isoT_' + type)) : art(type); }

function onMove(e) {
  if (!D || !C) return;
  if (Math.hypot(e.clientX - D.x, e.clientY - D.y) > 4) D.moved = true;
  if (D.mode === 'orbit') {
    if (!D.moved) return;
    V.th = D.th - (e.clientX - D.x) * 0.009; V.ph = Math.max(-0.15, Math.min(1.35, D.ph + (e.clientY - D.y) * 0.007));
    draw(); return;
  }
  var m = local(e);
  if (D.mode === 'move') {
    if (!D.moved) return;
    var sp = C.seams[D.seam], j = sideOf(D.key, D.side), g = seg(m, sp), others = D.orig.filter(function (x, n) { return n !== D.idx; });
    D.off = g.d > 70;
    var lim = limitsFor(j.type), ref = T(refKey(sp.s));
    if (D.off) { D.prev = others; D.bad = false; D.tip = { x:m[0], y:m[1], lines:[T('isoDropRemove')], bad:true }; }
    else {
      var a = sp.len < 10 ? D.orig[D.idx] : snap(g.u * sp.s.w, sp, j, others).a, why = sp.len < 10 ? '' : snap(g.u * sp.s.w, sp, j, others).why;
      D.bad = tooClose(a, others, lim.gap); D.a = a;
      D.prev = D.orig.map(function (x, n) { return n === D.idx ? a : x; });
      D.tip = { x:m[0], y:m[1], lines:[f1(a) + ' mm ' + ref + (why ? ' · ' + T(why) : ''), D.bad ? T('isoTooClose').replace('{n}', lim.gap) : (sp.len < 10 ? T('isoTurn') : T('jk_' + D.key) + ' · ' + sideTxt(D.key, D.side))], bad:D.bad };
    }
    draw('marks'); return;
  }
  if (D.mode === 'add') {
    D.cand = null; D.tip = null; D.bad = false;
    if (D.touch && !D.tap) m = [m[0], m[1] - TOUCH_UP];
    if (inside(e) || D.touch) {
      var best = null;
      C.seams.forEach(function (sp, i) { if (sp.len < 12 || !jointOf(sp.s.key)) return; var gg = seg(m, sp); if (gg.d < (D.touch ? 64 : 52) && (!best || gg.d < best.g.d)) best = { i:i, sp:sp, g:gg }; });
      if (best) {
        var bsd = best.sp.s.side, jj = sideOf(best.sp.s.key, bsd), cur = jj.pos.slice(), r0 = best.g.uc * best.sp.s.w;
        var hitIdx = -1, hitPx = 8 / Math.max(0.05, pxPerMm(best.sp));
        cur.forEach(function (p, n) { if (Math.abs(p - r0) < hitPx && (hitIdx < 0 || Math.abs(p - r0) < Math.abs(cur[hitIdx] - r0))) hitIdx = n; });
        var lim2 = limitsFor(D.type), ref2 = T(refKey(best.sp.s)), nm = T('jk_' + best.sp.s.key) + ' · ' + sideTxt(best.sp.s.key, bsd), per = perSide(best.sp.s.key);
        if (hitIdx >= 0) {   // dropped on a connector: the whole joint takes this type
          D.cand = { i:best.i, key:best.sp.s.key, side:bsd, per:per, a:cur[hitIdx], conv:true };
          D.bad = jj.type === D.type;
          D.tip = { x:m[0], y:m[1], lines:[nm, D.bad ? T('isoSame') : T('isoConvert').replace('{t}', T('isoT_' + D.type))], bad:D.bad };
        } else {
          var sn = snap(r0, best.sp, Object.assign({}, jj, { minEdge:Math.max(jj.minEdge, lim2.edge) }), cur);
          D.cand = { i:best.i, key:best.sp.s.key, side:bsd, per:per, a:sn.a, conv:false };
          D.bad = tooClose(sn.a, cur, lim2.gap);
          D.tip = { x:m[0], y:m[1], lines:[nm + ' · ' + f1(sn.a) + ' mm ' + ref2 + (sn.why ? ' · ' + T(sn.why) : ''),
            D.bad ? T('isoTooClose').replace('{n}', lim2.gap) : (jj.type !== D.type ? T('isoAddConv').replace('{t}', T('isoT_' + D.type)) : T('isoAdd'))], bad:D.bad };
        }
      }
    }
    moveGhost(e); draw('marks');
  }
}
function onUp(e) {
  if (!D || !C) { D = null; return; }
  var d = D; D = null;
  if (d.ghostEl) d.ghostEl.remove();
  if (d.mode === 'orbit') { if (!d.moved && C.o.onSelect) C.o.onSelect(null); return; }
  if (d.mode === 'move') {
    if (!d.moved) { C.o.onSelect({ key:d.key, side:d.side, idx:d.idx }); return; }
    if (d.off) { commit(d.key, d.side, d.type, d.orig.filter(function (x, n) { return n !== d.idx; }), { sel:{ key:d.key, side:d.side, idx:null }, msg:T('isoRemoved') }); return; }
    if (d.bad) { draw(); if (C.o.toast) C.o.toast(T('isoTooClose').replace('{n}', limitsFor(d.type).gap), true); return; }
    var np = d.prev.slice().sort(function (a, b) { return a - b; });
    if (Math.abs(d.a - d.orig[d.idx]) < 0.05) { draw(); C.o.onSelect({ key:d.key, side:d.side, idx:d.idx }); return; }
    commit(d.key, d.side, d.type, np, { sel:{ key:d.key, side:d.side, idx:np.indexOf(d.a) } });
    return;
  }
  if (d.mode === 'add') {
    if (!d.cand) { draw('marks'); if (d.moved && C.o.toast) C.o.toast(T(d.tap ? 'isoMissTap' : 'isoMiss')); return; }
    var cd = d.cand, j = sideOf(cd.key, cd.side);
    if (d.bad) { draw('marks'); if (C.o.toast) C.o.toast(d.cand.conv ? T('isoSame') : T('isoTooClose').replace('{n}', limitsFor(d.type).gap), true); return; }
    var msg = T('jk_' + cd.key) + (cd.per ? ' · ' + T(cd.side === 'R' ? 'sideR' : 'sideL') : '') + ': ' + T('isoT_' + d.type);
    if (cd.conv) { commit(cd.key, cd.side, d.type, j.manual ? j.pos.slice() : null, { sel:{ key:cd.key, side:cd.side, idx:null }, msg:msg }); return; }
    var pos = j.pos.concat([cd.a]).sort(function (a, b) { return a - b; });
    commit(cd.key, cd.side, d.type, pos, { sel:{ key:cd.key, side:cd.side, idx:pos.indexOf(cd.a) }, msg:j.type !== d.type ? msg : '' });
  }
}

/* ---------------------------------------------------------------- toolbar + inspector */
function chipIcon(type) {
  if (type === 'cam') return '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="7.5" class="ic-cam"/><line x1="8" y1="12" x2="16" y2="12" class="ic-cam"/></svg>';
  if (type === 'dowel') return '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="5.5" class="ic-dow"/></svg>';
  return '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="12" cy="12" r="6.5" class="ic-conf"/><circle cx="12" cy="12" r="2" class="ic-hd"/></svg>';
}
function bar() {
  return '<div class="iso-bar"><span class="iso-bl">' + esc(T('isoDrag')) + '</span><div class="iso-cards">' +
    TYPES.map(function (ty) { return '<button type="button" class="iso-card iso-chip' + (ARM === ty ? ' on' : '') + '" data-chip="' + ty + '" aria-pressed="' + (ARM === ty) + '" title="' + esc(T('isoChipT')) + '">' +
      '<span class="iso-cart">' + pic(ty) + '</span><span class="iso-ctx"><b>' + chipIcon(ty) + esc(T('isoT_' + ty)) + '</b><small>' + esc(T('isoD_' + ty)) + '</small><em>' + esc(T(ARM === ty ? 'isoTapLine' : 'isoGrab')) + '</em></span></button>'; }).join('') +
    '</div><div class="iso-mode"><span class="iso-bl">' + esc(T('isoSides')) + '</span><div class="seg" role="group">' +
    [['both', T('isoModeBoth')], ['sep', T('isoModeSep')]].map(function (m) { return '<button type="button" data-iso="mode" data-v="' + m[0] + '" class="' + (MODE === m[0] ? 'on' : '') + '" aria-pressed="' + (MODE === m[0]) + '" title="' + esc(T(m[0] === 'both' ? 'isoModeBothT' : 'isoModeSepT')) + '">' + esc(m[1]) + '</button>'; }).join('') +
    '</div></div>' + (ARM ? '<span class="iso-arm">' + esc(T('isoArmed')) + '</span>' : '') + '</div>';
}
function viewBtns() {
  return '<div class="iso-view"><button type="button" class="btn ghost iso-fullb" data-iso="full" title="' + esc(T(FULL ? 'isoFullOff' : 'isoFullOn')) + '" aria-label="' + esc(T(FULL ? 'isoFullOff' : 'isoFullOn')) + '">' + (FULL ? '✕<span class="iso-vl"> ' + esc(T('isoFullOffS')) + '</span>' : '⤢<span class="iso-vl"> ' + esc(T('isoFullOnS')) + '</span>') + '</button><button type="button" class="btn ghost" data-iso="rotL" title="' + esc(T('isoRotL')) + '" aria-label="' + esc(T('isoRotL')) + '">⟲</button>' +
    '<button type="button" class="btn ghost" data-iso="rotR" title="' + esc(T('isoRotR')) + '" aria-label="' + esc(T('isoRotR')) + '">⟳</button>' +
    '<button type="button" class="btn ghost" data-iso="home" title="' + esc(T('isoHome')) + '" aria-label="' + esc(T('isoHome')) + '">⌂<span class="iso-vl"> ' + esc(T('isoHomeS')) + '</span></button>' +
    '<button type="button" class="btn" data-iso="undo"' + (C.o.canUndo ? '' : ' disabled') + ' title="Ctrl+Z" aria-label="' + esc(T('isoUndo')) + '">↶<span class="iso-vl"> ' + esc(T('isoUndo')) + '</span></button></div>';
}
function inspector() {
  var sel = C.o.sel, js = (C.o.r.joints || []);
  if (!sel || !jointOf(sel.key)) {
    return '<div class="iso-ins"><div class="lbl">' + esc(T('isoJoints')) + '</div><div class="iso-jl">' + js.map(function (j) {
      var sm = function (x) { return x.pos.length + ' × ' + T('isoT_' + x.type); };
      return '<button type="button" class="iso-jb' + (j.custom ? ' custom' : '') + '" data-iso="sel" data-key="' + j.key + '"><span>' + esc(T('jk_' + j.key)) + '</span><small>' +
        (j.split ? esc(T('isoL1') + ' ' + sm(j.sides.L) + ' · ' + T('isoR1') + ' ' + sm(j.sides.R)) : esc(sm(j)) + (j.manual ? ' · ' + esc(T('isoManualS')) : '')) + '</small></button>'; }).join('') +
      '</div><p class="note">' + esc(T('isoHint')) + '</p></div>';
  }
  var sd = sel.side || 'L', j0 = jointOf(sel.key), j = sideOf(sel.key, sd), per = perSide(sel.key);
  var sm = (C.o.r.seams || []).filter(function (s) { return s.key === j.key; })[0], ref = sm ? T(refKey(sm)) : '';
  var rows = j.pos.map(function (a, n) {
    return '<div class="iso-pr' + (sel.idx === n ? ' on' : '') + '"><span class="iso-no">' + (n + 1) + '</span>' + chipIcon(j.type) +
      '<input type="text" inputmode="decimal" id="iso-p-' + n + '" data-iso-pos="' + n + '" value="' + f1(a) + '" aria-label="' + esc(T('jk_' + j.key) + ' ' + (n + 1)) + '"><span class="unit">mm</span>' +
      '<button type="button" class="xbtn" data-iso="rm" data-i="' + n + '" aria-label="' + esc(T('isoRm')) + '" title="' + esc(T('isoRm')) + '">✕</button></div>';
  }).join('');
  var tabs = per ? '<div class="iso-sides seg" role="group">' + ['L', 'R'].map(function (x) {
      return '<button type="button" data-iso="side" data-v="' + x + '" class="' + (sd === x ? 'on' : '') + '" aria-pressed="' + (sd === x) + '">' + esc(T(x === 'L' ? 'sideL' : 'sideR')) + '</button>'; }).join('') + '</div>' +
      (j0.split ? '<div class="iso-split"><span class="badge">' + esc(T('isoDiffer')) + '</span><button type="button" class="btn ghost" data-iso="copy">⇄ ' + esc(T(sd === 'L' ? 'isoCopyToR' : 'isoCopyToL')) + '</button></div>' : '')
    : isSingle(j.key) ? '' : '<div class="iso-both">' + esc(T('isoBothNote')) + '</div>';
  return '<div class="iso-ins"><div class="iso-ih"><b>' + esc(T('jk_' + j.key)) + '</b><button type="button" class="btn ghost" data-iso="desel" aria-label="' + esc(T('close')) + '">✕</button></div>' + tabs +
    '<div class="seg" role="group">' + TYPES.map(function (ty) { return '<button type="button" data-iso="type" data-v="' + ty + '" class="' + (j.type === ty ? 'on' : '') + '" aria-pressed="' + (j.type === ty) + '">' + chipIcon(ty) + esc(T('isoT_' + ty)) + '</button>'; }).join('') + '</div>' +
    '<div class="iso-insart">' + pic(j.type) + '</div><p class="note iso-insd">' + esc(T('isoD_' + j.type)) + '</p>' +
    '<div class="iso-ref">' + esc(T('isoPos')) + ' · ' + esc(ref) + '</div><div class="iso-prs">' + (rows || '<p class="note bad">' + esc(T('isoNone')) + '</p>') + '</div>' +
    '<div class="iso-acts"><button type="button" class="btn" data-iso="add">＋ ' + esc(T('isoAddBtn')) + '</button><button type="button" class="btn" data-iso="even"' + (j.pos.length < 3 ? ' disabled' : '') + '>' + esc(T('isoEven')) + '</button>' +
    (j0.custom ? '<button type="button" class="btn ghost" data-iso="reset" title="' + esc(T('isoResetT')) + '">↺ ' + esc(T('jAuto')) + '</button>' : '') + '</div>' +
    '<p class="note">' + esc(T('isoLen').replace('{w}', f1(j.w)).replace('{e}', j.minEdge).replace('{g}', j.minGap)) + (j.type === 'cam' ? ' ' + esc(T('isoCamDw')) : '') + '</p></div>';
}
/* positions of the selected joint / side changed in the inspector or with the keyboard */
function selSide() { var q = C.o.sel; return q ? sideOf(q.key, q.side || 'L') : null; }
function commitPos(pos, idxVal, msg, extra) {
  var q = C.o.sel, j = selSide(), np = pos.slice().sort(function (a, b) { return a - b; });
  commit(q.key, q.side || 'L', j.type, np, Object.assign({ sel:{ key:q.key, side:q.side || 'L', idx:idxVal == null ? null : np.indexOf(idxVal) }, msg:msg || '' }, extra || {}));
}
function onClick(e) {
  var b = e.target.closest('[data-iso]'); if (!b || !C) return;
  var a = b.getAttribute('data-iso'), q = C.o.sel, j = q ? selSide() : null;
  if (a === 'rotL' || a === 'rotR') { V.th += (a === 'rotL' ? 1 : -1) * Math.PI / 2; draw(); return; }
  if (a === 'home') { V.th = 0.62; V.ph = 0.42; draw(); return; }
  if (a === 'undo') { C.o.onUndo(); return; }
  if (a === 'full') { setFull(!FULL); return; }
  if (a === 'mode') { MODE = b.getAttribute('data-v'); if (C.o.onMode) C.o.onMode(MODE); attach(C.el, C.o); return; }
  if (a === 'sel') { C.o.onSelect({ key:b.getAttribute('data-key'), side:'L', idx:null }); return; }
  if (a === 'desel') { C.o.onSelect(null); return; }
  if (!j) return;
  var sd = q.side || 'L';
  if (a === 'side') { C.o.onSelect({ key:q.key, side:b.getAttribute('data-v'), idx:null }); return; }
  if (a === 'copy') { C.o.onCommit(q.key, { side:null, type:j.type, pos:j.manual ? j.pos.slice() : null }, { sel:{ key:q.key, side:sd, idx:null }, msg:T('isoCopied') }); return; }
  if (a === 'type') { var ty = b.getAttribute('data-v'); if (ty !== j.type) commit(q.key, sd, ty, j.manual ? j.pos.slice() : null, { sel:{ key:q.key, side:sd, idx:null } }); return; }
  if (a === 'rm') { var i = +b.getAttribute('data-i'); commitPos(j.pos.filter(function (x, n) { return n !== i; }), null, T('isoRemoved')); return; }
  if (a === 'reset') { C.o.onReset(q.key); return; }
  if (a === 'add') {   // in the middle of the widest free stretch
    var pts = [j.minEdge].concat(j.pos, [j.w - j.minEdge]), bi = 0, bw = -1;
    for (var k = 0; k < pts.length - 1; k++) if (pts[k + 1] - pts[k] > bw) { bw = pts[k + 1] - pts[k]; bi = k; }
    var na = Math.round((pts[bi] + pts[bi + 1]) / 2);
    if (j.pos.length && bw < 2 * j.minGap) { if (C.o.toast) C.o.toast(T('isoTooClose').replace('{n}', j.minGap), true); return; }
    commitPos(j.pos.concat([na]), na); return;
  }
  if (a === 'even') { var n = j.pos.length, p0 = j.pos[0], p1 = j.pos[n - 1]; commitPos(j.pos.map(function (x, r) { return Math.round((p0 + (p1 - p0) * r / (n - 1)) * 10) / 10; }), null); }
}
function onChange(e) {
  var el = e.target; if (!C || !el.hasAttribute('data-iso-pos') || !C.o.sel) return;
  var j = selSide(), i = +el.getAttribute('data-iso-pos'), v = parseFloat(String(el.value).replace(',', '.'));
  if (!isFinite(v)) { el.value = f1(j.pos[i]); return; }
  commitPos(j.pos.map(function (x, n) { return n === i ? Math.round(v * 10) / 10 : x; }), null);
}
function onKey(e) {
  if (!C || !C.o.sel || C.o.sel.idx == null || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  var j = selSide(), i = C.o.sel.idx; if (!j || j.pos[i] == null) return;
  if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); commitPos(j.pos.filter(function (x, n) { return n !== i; }), null, T('isoRemoved')); return; }
  var st = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -1 : 0; if (!st) return;
  e.preventDefault();
  var a = Math.max(j.minEdge, Math.min(j.w - j.minEdge, j.pos[i] + st * (e.shiftKey ? 10 : 1))), others = j.pos.filter(function (x, n) { return n !== i; });
  if (tooClose(a, others, j.minGap)) return;
  commitPos(j.pos.map(function (x, n) { return n === i ? a : x; }), a, '', { keepFocus:true });
}

/* ---------------------------------------------------------------- mount */
function setFull(on) {
  FULL = !!on; document.documentElement.classList.toggle('iso-noscroll', FULL);
  if (C) attach(C.el, C.o);
}
document.addEventListener('keydown', function (e) { if (e.key !== 'Escape' || (D && D.mode) || !C) return; if (ARM) { ARM = null; attach(C.el, C.o); } else if (FULL) setFull(false); });
function attach(el, o) {
  if (!el) { C = null; return; }
  el.classList.toggle('full', FULL);
  if (o.mode && !attach.done) { MODE = o.mode; attach.done = true; }
  C = { el:el, o:o };
  el.innerHTML = bar() + '<div class="iso-main"><div class="iso-sw"><div class="iso-stage' + (ARM ? ' armed' : '') + '" tabindex="0" aria-label="' + esc(T('isoTitle')) + '"></div>' + viewBtns() + '</div>' + inspector() + '</div>';
  draw();
  var stage = el.querySelector('.iso-stage');
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    var m = local(e), hm = hitMarker(m), hs;
    if (ARM) { D = { mode:'add', type:ARM, x:e.clientX, y:e.clientY, moved:true, tap:true }; onMove(e); }
    else if (hm) startMove(e, hm.key, hm.side, hm.idx, hm.seam);
    else if ((hs = hitSeam(m)) != null) D = { mode:'pick', key:C.seams[hs].s.key, side:C.seams[hs].s.side, x:e.clientX, y:e.clientY, moved:false, th:V.th, ph:V.ph };
    else startOrbit(e);
    try { stage.setPointerCapture(e.pointerId); } catch (er) {}
    stage.focus({ preventScroll:true }); e.preventDefault();
  });
  stage.addEventListener('pointermove', function (e) { if (D && D.mode === 'pick') { if (Math.hypot(e.clientX - D.x, e.clientY - D.y) > 4) D.mode = 'orbit'; else return; } onMove(e); });
  var up = function (e) { if (D && D.mode === 'pick') { var k = D.key, sd = D.side; D = null; C.o.onSelect({ key:k, side:sd, idx:null }); return; } onUp(e); };
  stage.addEventListener('pointerup', up); stage.addEventListener('pointercancel', function () { if (D && D.ghostEl) D.ghostEl.remove(); D = null; draw(); });
  stage.addEventListener('keydown', onKey);
  el.querySelectorAll('.iso-chip').forEach(function (ch) {
    ch.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      startAdd(e, ch.getAttribute('data-chip')); try { ch.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault();
    });
    ch.addEventListener('pointermove', function (e) { if (D && D.mode === 'add') onMove(e); });
    ch.addEventListener('pointerup', function (e) { if (D && D.mode === 'add') { if (!D.moved) { var g = D.ghostEl, ty = D.type; D = null; if (g) g.remove(); ARM = ARM === ty ? null : ty; attach(C.el, C.o); return; } onUp(e); } });
    ch.addEventListener('pointercancel', function () { if (D && D.ghostEl) D.ghostEl.remove(); D = null; draw('marks'); });
  });
  if (!el.__isoBound) { el.__isoBound = true; el.addEventListener('click', onClick); el.addEventListener('change', onChange); }
  if (o.focusStage) stage.focus({ preventScroll:true });
  if (window.ResizeObserver) { if (RO) RO.disconnect(); var lastW = stage.clientWidth; RO = new ResizeObserver(function () { if (C && C.el === el && Math.abs(stage.clientWidth - lastW) > 2) { lastW = stage.clientWidth; draw(); } }); RO.observe(stage); }
}

var api = { attach:attach, view:V, sym:chipIcon, art:art, full:function () { return FULL; }, _state:function () { return { C:C, D:D }; } };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBIso = api;
})(typeof window !== 'undefined' ? window : this);
