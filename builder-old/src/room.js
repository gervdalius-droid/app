/* =====================================================================
   room.js — the whole kitchen in one view (Virtuvė tab).
   Walls form a chain turning clockwise (seen from above): wall A runs to
   the right, B down, C left, D up; cabinets stand against a wall with
   their back on it. Model, kept in the project:
     proj.layout = { walls:[{len}], wallZ, roomH, worktop, items:{ cabId:{ wall, x, z } } }
   wall = -1 → taken off the walls (listed as not placed). x = mm from the
   wall start (left end when facing the wall), z = bottom of a wall
   cabinet (empty → wallZ). Views: plan (top), front of every wall side by
   side, 3D. Plan and front take drag & drop; new cabinets are dragged in
   from the palette.
   ===================================================================== */
(function (root) {
"use strict";
var V = { view:'front', wall:-1, th:0.55, ph:0.5 };   // view state survives re-renders
var C = null, D = null, RO = null;
var GAP = 500;                                       // mm between walls in the front view

function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function T(k) { return C && C.o.t ? C.o.t(k) : k; }
function r1(v) { return Math.round(v * 10) / 10; }
function fm(v) { v = r1(v); return String(v); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
var LETTER = 'ABCDEFGH';

/* ---------------------------------------------------------------- model */
function cabW(c) { return +(c.dishwasher ? c.dishWidth : c.W) || 600; }
function cabD(c) { return +c.D || 560; }
function cabH(c) { return +c.H || 720; }
function level(c) { if (c.dishwasher) return 'base'; return c.type === 'PAKABINAMOS' ? 'wall' : c.type === 'ŪKINĖ' ? 'tall' : 'base'; }
function legH(c) { if (c.dishwasher) return +c.legH || 100; return c.cnc && c.cnc.legs ? (+c.legH || 0) : 0; }
function z0Of(c, it, L) { if (level(c) === 'wall') return it && it.z !== '' && it.z != null && isFinite(+it.z) ? +it.z : +L.wallZ || 1450; return legH(c); }
function vRange(c, it, L) { var z0 = z0Of(c, it, L); return level(c) === 'wall' ? [z0, z0 + cabH(c)] : [0, z0 + cabH(c)]; }
function defLayout() { return { walls:[{ len:3600 }], wallZ:1450, roomH:2600, worktop:true, items:{} }; }
function geo(L) {   // wall start points, direction along the wall, normal into the room (plan coords: x right, y down)
  var out = [], P = [0, 0], dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  L.walls.forEach(function (w, i) { var d = dirs[i % 4]; out.push({ P:P.slice(), d:d, n:[-d[1], d[0]], len:+w.len || 0 }); P = [P[0] + d[0] * (+w.len || 0), P[1] + d[1] * (+w.len || 0)]; });
  return out;
}
function placed(proj) { var L = proj.layout; return proj.cabinets.map(function (c, i) { return { c:c, i:i, it:L.items[c.id] }; }).filter(function (x) { return x.it && x.it.wall >= 0 && x.it.wall < L.walls.length; }); }
function vOverlap(a, b) { return Math.min(a[1], b[1]) - Math.max(a[0], b[0]) > 1; }
/* free space for a cabinet of width w at level of c on wall wi: ends of what stands there, corners included */
function cornerIn(proj, wi, c, exceptId) {   // depth taken at the start of wall wi by the previous wall's cabinet in the corner
  var L = proj.layout, G = geo(L); if (wi === 0) return 0;
  var vr = vRange(c, L.items[c.id] || {}, L), dep = 0;
  placed(proj).forEach(function (o) { if (o.c.id === exceptId || o.it.wall !== wi - 1) return;
    if (o.it.x + cabW(o.c) >= G[wi - 1].len - cabD(c) - 1 && vOverlap(vr, vRange(o.c, o.it, L))) dep = Math.max(dep, cabD(o.c)); });
  return dep;
}
function cornerOut(proj, wi, c, exceptId) {  // depth taken at the end of wall wi by the next wall's cabinet in the corner
  var L = proj.layout; if (wi >= L.walls.length - 1) return 0;
  var vr = vRange(c, L.items[c.id] || {}, L), dep = 0;
  placed(proj).forEach(function (o) { if (o.c.id === exceptId || o.it.wall !== wi + 1) return;
    if (o.it.x <= cabD(c) + 1 && vOverlap(vr, vRange(o.c, o.it, L))) dep = Math.max(dep, cabD(o.c)); });
  return dep;
}
function neighbours(proj, c, wi) {   // what stands on wall wi at c's height, except c
  var L = proj.layout, vr = vRange(c, L.items[c.id] || {}, L);
  return placed(proj).filter(function (o) { return o.c.id !== c.id && o.it.wall === wi && vOverlap(vr, vRange(o.c, o.it, L)); });
}
function snapCands(proj, c, wi) {
  var L = proj.layout, G = geo(L), w = cabW(c), len = G[wi].len, out = [[0, 'wall'], [len - w, 'wall']];
  var ci = cornerIn(proj, wi, c, c.id), co = cornerOut(proj, wi, c, c.id);
  if (ci) out.push([ci, 'corner']); if (co) out.push([len - co - w, 'corner']);
  neighbours(proj, c, wi).forEach(function (o) { out.push([o.it.x - w, 'nb']); out.push([o.it.x + cabW(o.c), 'nb']); });
  return out;
}
function snap(proj, c, wi, x, thr) {
  var best = null; snapCands(proj, c, wi).forEach(function (s) { var d = Math.abs(s[0] - x); if (d <= thr && (!best || d < best.d)) best = { x:s[0], d:d, why:s[1] }; });
  return best ? { x:r1(best.x), why:best.why } : { x:Math.round(x / 5) * 5, why:'' };
}
function gapAround(proj, c) {   // the free stretch c stands in (for "fill the gap")
  var L = proj.layout, it = L.items[c.id]; if (!it || it.wall < 0) return null;
  var G = geo(L), len = G[it.wall].len, a = Math.max(0, cornerIn(proj, it.wall, c, c.id)), b = len - cornerOut(proj, it.wall, c, c.id);
  var mid = it.x + cabW(c) / 2;
  neighbours(proj, c, it.wall).forEach(function (o) { var x0 = o.it.x, x1 = o.it.x + cabW(o.c);
    if (x1 <= mid + 0.5) a = Math.max(a, x1); else if (x0 >= mid - 0.5) b = Math.min(b, x0); });
  return { x0:r1(a), x1:r1(b), w:r1(b - a) };
}
function planRect(c, it, G) {
  var g = G[it.wall], w = cabW(c), d = cabD(c), p = function (a, b) { return [g.P[0] + g.d[0] * a + g.n[0] * b, g.P[1] + g.d[1] * a + g.n[1] * b]; };
  var pts = [p(it.x, 0), p(it.x + w, 0), p(it.x + w, d), p(it.x, d)];
  var xs = pts.map(function (q) { return q[0]; }), ys = pts.map(function (q) { return q[1]; });
  return { pts:pts, x0:Math.min.apply(null, xs), x1:Math.max.apply(null, xs), y0:Math.min.apply(null, ys), y1:Math.max.apply(null, ys) };
}
/* problems: cabinets in each other (plan + height), past a wall end */
function problems(proj) {
  var L = proj.layout, G = geo(L), ps = placed(proj), out = [], bad = {};
  ps.forEach(function (a, k) {
    if (a.it.x < -0.5 || a.it.x + cabW(a.c) > G[a.it.wall].len + 0.5) { out.push({ kind:'out', a:a.i }); bad[a.c.id] = 1; }
    var ra = planRect(a.c, a.it, G), va = vRange(a.c, a.it, L);
    for (var j = k + 1; j < ps.length; j++) {
      var b = ps[j], rb = planRect(b.c, b.it, G);
      var ox = Math.min(ra.x1, rb.x1) - Math.max(ra.x0, rb.x0), oy = Math.min(ra.y1, rb.y1) - Math.max(ra.y0, rb.y0);
      if (ox > 1 && oy > 1 && vOverlap(va, vRange(b.c, b.it, L))) { out.push({ kind:'hit', a:a.i, b:b.i }); bad[a.c.id] = bad[b.c.id] = 1; }
    }
  });
  return { list:out, bad:bad };
}
/* first free place for a cabinet: after the last one at its height on the first wall with room, else at the end of wall A */
function autoSpot(proj, c) {
  var L = proj.layout, G = geo(L), w = cabW(c);
  for (var wi = 0; wi < G.length; wi++) {
    var ends = neighbours(proj, c, wi).map(function (o) { return o.it.x + cabW(o.c); });
    var x = Math.max(cornerIn(proj, wi, c, c.id), ends.length ? Math.max.apply(null, ends) : 0);
    if (x + w <= G[wi].len - cornerOut(proj, wi, c, c.id) + 0.5) return { wall:wi, x:r1(x) };
  }
  var e0 = neighbours(proj, c, 0).map(function (o) { return o.it.x + cabW(o.c); });
  return { wall:0, x:r1(e0.length ? Math.max.apply(null, e0) : 0) };
}
/* make sure the project has a layout and every cabinet a place (new ones go after the others) */
function ensure(proj) {
  var fresh = !proj.layout;
  if (fresh) proj.layout = defLayout();
  var L = proj.layout; L.walls = (L.walls && L.walls.length ? L.walls : [{ len:3600 }]).slice(0, 4); L.items = L.items || {};
  if (L.wallZ == null) L.wallZ = 1450; if (L.roomH == null) L.roomH = 2600; if (L.worktop == null) L.worktop = true;
  if (fresh && proj.cabinets.length) {   // one long wall that takes the floor cabinets in project order
    var run = proj.cabinets.filter(function (c) { return level(c) !== 'wall'; }).reduce(function (a, c) { return a + cabW(c); }, 0);
    L.walls[0].len = Math.max(2400, Math.ceil((run + 200) / 100) * 100);
  }
  var changed = fresh;
  proj.cabinets.forEach(function (c) { if (!L.items[c.id]) { L.items[c.id] = { wall:-1, x:0 }; var s = autoSpot(proj, c); L.items[c.id] = { wall:s.wall, x:s.x }; changed = true; } });
  Object.keys(L.items).forEach(function (id) { if (!proj.cabinets.some(function (c) { return c.id === id; })) { delete L.items[id]; changed = true; } });
  return changed;
}

/* ---------------------------------------------------------------- shared drawing bits */
function cabName(c, i) { return (i + 1) + ' · ' + (c.name || T(c.dishwasher ? 'pDish' : ({ 'PASTATOMOS':'tBase', 'PAKABINAMOS':'tWall', 'ŪKINĖ':'tTall' })[c.type] || 'tBase')); }
function fronts(i) {   // fronts of cabinet i from the engine: rectangles in cabinet coords (x across, z up from carcass bottom)
  var inf = C.o.infos[i], out = [];
  if (!inf || !inf.r) return out;
  inf.r.panels.forEach(function (p) {
    if (!p.place || (p.role !== 'FASADAS' && p.role !== 'DURYS')) return;
    var q = p.place, pt = function (a, b) { return [q.o[0] + a * q.u[0] + b * q.v[0], q.o[2] + a * q.u[2] + b * q.v[2]]; };
    var cs = [pt(0, 0), pt(p.L, 0), pt(0, p.W), pt(p.L, p.W)], xs = cs.map(function (v) { return v[0]; }), zs = cs.map(function (v) { return v[1]; });
    out.push({ x0:Math.min.apply(null, xs), x1:Math.max.apply(null, xs), z0:Math.min.apply(null, zs), z1:Math.max.apply(null, zs), door:p.role === 'DURYS', left:p.hingeLeft });
  });
  return out;
}

/* ---------------------------------------------------------------- FRONT: every wall side by side (or one wall) */
function frontLayout() {
  var L = C.o.proj.layout, G = geo(L), ws = V.wall >= 0 && V.wall < G.length ? [V.wall] : G.map(function (g, i) { return i; });
  var off = {}, x = 0; ws.forEach(function (wi) { off[wi] = x; x += G[wi].len + GAP; });
  var total = x - GAP, H = Math.max(+L.roomH || 2600, 2300), w = C.w, k = (w - 40) / Math.max(total, 1200);
  k = Math.min(k, (C.h - 110) / H);
  C.fr = { ws:ws, off:off, k:k, H:H, ox:(w - total * k) / 2, base:30 + H * k + 10 };
  C.h = Math.round(C.fr.base + 70);
}
function fX(wi, x) { return C.fr.ox + (C.fr.off[wi] + x) * C.fr.k; }
function fY(z) { return C.fr.base - z * C.fr.k; }
function drawFront() {
  var proj = C.o.proj, L = proj.layout, G = geo(L), F = C.fr, k = F.k, s = '', prob = problems(proj);
  F.ws.forEach(function (wi) {
    var g = G[wi], x0 = fX(wi, 0), x1 = fX(wi, g.len);
    s += '<rect class="rm-wall" x="' + x0.toFixed(1) + '" y="' + fY(F.H).toFixed(1) + '" width="' + (x1 - x0).toFixed(1) + '" height="' + (F.H * k).toFixed(1) + '"/>';
    s += '<line class="rm-floor" x1="' + (x0 - 6).toFixed(1) + '" y1="' + fY(0).toFixed(1) + '" x2="' + (x1 + 6).toFixed(1) + '" y2="' + fY(0).toFixed(1) + '"/>';
    s += '<text class="rm-wt" x="' + ((x0 + x1) / 2).toFixed(1) + '" y="' + (fY(F.H) - 8).toFixed(1) + '" text-anchor="middle">' + esc(T('rmWall')) + ' ' + LETTER[wi] + ' · ' + fm(g.len) + '</text>';
    // corners taken by the neighbouring walls' cabinets: hatched
    [[0, wi > 0], [g.len, wi < G.length - 1]].forEach(function (cn) { if (cn[1]) s += '<line class="rm-corner" x1="' + fX(wi, cn[0]).toFixed(1) + '" y1="' + fY(0).toFixed(1) + '" x2="' + fX(wi, cn[0]).toFixed(1) + '" y2="' + fY(F.H).toFixed(1) + '"/>'; });
  });
  // cabinets: wall level drawn after floor level
  var ps = placed(proj).filter(function (o) { return F.ws.indexOf(o.it.wall) >= 0; });
  ps.sort(function (a, b) { return (level(a.c) === 'wall') - (level(b.c) === 'wall'); });
  var drag = D && D.mode === 'move' ? D : null;
  ps.forEach(function (o) {
    var it = drag && drag.id === o.c.id ? drag.it : o.it; if (F.ws.indexOf(it.wall) < 0) return;
    s += frontCab(o.c, o.i, it, prob.bad[o.c.id] || (drag && drag.id === o.c.id && drag.bad), drag && drag.id === o.c.id);
  });
  if (D && D.mode === 'add' && D.cand && F.ws.indexOf(D.cand.wall) >= 0) s += frontGhost(D.cand);
  // worktop over floor cabinets
  if (L.worktop) ps.forEach(function (o) { if (level(o.c) !== 'base' || o.c.dishwasher && false) return; var it = drag && drag.id === o.c.id ? drag.it : o.it; if (F.ws.indexOf(it.wall) < 0) return;
    var top = z0Of(o.c, it, L) + cabH(o.c); s += '<rect class="rm-top" x="' + fX(it.wall, it.x).toFixed(1) + '" y="' + fY(top + 38).toFixed(1) + '" width="' + (cabW(o.c) * k).toFixed(1) + '" height="' + Math.max(1.5, 38 * k).toFixed(1) + '"/>'; });
  // dimension chain under each wall (floor level)
  F.ws.forEach(function (wi) {
    var row = ps.filter(function (o) { var it = drag && drag.id === o.c.id ? drag.it : o.it; return it.wall === wi && level(o.c) !== 'wall'; })
      .map(function (o) { var it = drag && drag.id === o.c.id ? drag.it : o.it; return [it.x, it.x + cabW(o.c)]; }).sort(function (a, b) { return a[0] - b[0]; });
    var marks = [0], y = fY(0) + 16; row.forEach(function (r) { marks.push(r[0], r[1]); }); marks.push(G[wi].len);
    marks = marks.filter(function (m, i, a) { return i === 0 || Math.abs(m - a[i - 1]) > 0.5; });
    s += '<line class="rm-dim" x1="' + fX(wi, 0).toFixed(1) + '" y1="' + y + '" x2="' + fX(wi, G[wi].len).toFixed(1) + '" y2="' + y + '"/>';
    marks.forEach(function (m, i) { s += '<line class="rm-dim" x1="' + fX(wi, m).toFixed(1) + '" y1="' + (y - 4) + '" x2="' + fX(wi, m).toFixed(1) + '" y2="' + (y + 4) + '"/>';
      if (i) { var d = marks[i] - marks[i - 1], px = d * k; if (px > 22) s += '<text class="rm-dt" x="' + ((fX(wi, marks[i]) + fX(wi, marks[i - 1])) / 2).toFixed(1) + '" y="' + (y + 14) + '" text-anchor="middle">' + fm(d) + '</text>'; } });
  });
  if (D && D.tip) s += tip(D.tip);
  return s;
}
function frontCab(c, i, it, bad, act) {
  var L = C.o.proj.layout, k = C.fr.k, w = cabW(c), h = cabH(c), z0 = z0Of(c, it, L), x0 = fX(it.wall, it.x), sel = C.o.sel === i;
  var s = '<g class="rm-cab lv-' + level(c) + (sel ? ' sel' : '') + (bad ? ' bad' : '') + (act ? ' act' : '') + '" data-cab="' + i + '">';
  var lh = legH(c);
  if (lh && !c.dishwasher) [55, w - 55].forEach(function (lx) { s += '<rect class="rm-leg" x="' + (x0 + (lx - 15) * k).toFixed(1) + '" y="' + fY(lh).toFixed(1) + '" width="' + Math.max(1.5, 30 * k).toFixed(1) + '" height="' + (lh * k).toFixed(1) + '"/>'; });
  if (c.dishwasher && lh) s += '<rect class="rm-plinth" x="' + x0.toFixed(1) + '" y="' + fY(lh).toFixed(1) + '" width="' + (w * k).toFixed(1) + '" height="' + (lh * k).toFixed(1) + '"/>';
  s += '<rect class="rm-body' + (c.dishwasher ? ' dish' : '') + '" x="' + x0.toFixed(1) + '" y="' + fY(z0 + h).toFixed(1) + '" width="' + (w * k).toFixed(1) + '" height="' + (h * k).toFixed(1) + '"/>';
  fronts(i).forEach(function (f) {
    var fx = x0 + f.x0 * k, fy = fY(z0 + f.z1), fw = (f.x1 - f.x0) * k, fh = (f.z1 - f.z0) * k;
    s += '<rect class="rm-front" x="' + fx.toFixed(1) + '" y="' + fy.toFixed(1) + '" width="' + fw.toFixed(1) + '" height="' + fh.toFixed(1) + '"/>';
    if (f.door) { var hx = f.left ? fx + fw : fx, ox = f.left ? fx : fx + fw;   // opening lines meet on the handle side (opposite the hinges): a pair hinged outside points to the middle
      s += '<path class="rm-open" d="M' + ox.toFixed(1) + ' ' + fy.toFixed(1) + ' L' + hx.toFixed(1) + ' ' + (fy + fh / 2).toFixed(1) + ' L' + ox.toFixed(1) + ' ' + (fy + fh).toFixed(1) + '"/>'; }
    else if (fw > 8) s += '<line class="rm-handle" x1="' + (fx + fw * 0.35).toFixed(1) + '" y1="' + (fy + Math.min(fh * 0.22, 40 * k + 3)).toFixed(1) + '" x2="' + (fx + fw * 0.65).toFixed(1) + '" y2="' + (fy + Math.min(fh * 0.22, 40 * k + 3)).toFixed(1) + '"/>';
  });
  var cx = x0 + w * k / 2, cy = fY(z0 + h) + Math.min(18, h * k / 2);
  if (w * k > 26) s += '<circle class="rm-no" cx="' + cx.toFixed(1) + '" cy="' + cy.toFixed(1) + '" r="9"/><text class="rm-not" x="' + cx.toFixed(1) + '" y="' + (cy + 3.5).toFixed(1) + '" text-anchor="middle">' + (i + 1) + '</text>';
  return s + '<title>' + esc(cabName(c, i) + ' · ' + fm(w) + '×' + fm(h) + '×' + fm(cabD(c))) + '</title></g>';
}
function frontGhost(cd) {
  var k = C.fr.k, z0 = cd.lv === 'wall' ? (+C.o.proj.layout.wallZ || 1450) : (cd.legs || 0);
  return '<rect class="rm-ghost' + (cd.bad ? ' bad' : '') + '" x="' + fX(cd.wall, cd.x).toFixed(1) + '" y="' + fY(z0 + cd.H).toFixed(1) + '" width="' + (cd.W * k).toFixed(1) + '" height="' + (cd.H * k).toFixed(1) + '"/>';
}

/* ---------------------------------------------------------------- PLAN */
function planLayout() {
  var L = C.o.proj.layout, G = geo(L), xs = [], ys = [];
  G.forEach(function (g) { xs.push(g.P[0], g.P[0] + g.d[0] * g.len); ys.push(g.P[1], g.P[1] + g.d[1] * g.len); });
  var maxD = 700; G.forEach(function (g) { xs.push(g.P[0] + g.n[0] * maxD); ys.push(g.P[1] + g.n[1] * maxD); });
  var x0 = Math.min.apply(null, xs) - 250, x1 = Math.max.apply(null, xs) + 250, y0 = Math.min.apply(null, ys) - 320, y1 = Math.max.apply(null, ys) + 250;
  var k = Math.min((C.w - 20) / (x1 - x0), 520 / (y1 - y0), 0.22);
  C.pl = { k:k, x0:x0, y0:y0, ox:(C.w - (x1 - x0) * k) / 2 };
  C.h = Math.round((y1 - y0) * k + 20);
}
function pX(x) { return C.pl.ox + (x - C.pl.x0) * C.pl.k; }
function pY(y) { return 10 + (y - C.pl.y0) * C.pl.k; }
function drawPlan() {
  var proj = C.o.proj, L = proj.layout, G = geo(L), k = C.pl.k, s = '', prob = problems(proj), drag = D && D.mode === 'move' ? D : null;
  G.forEach(function (g, wi) {   // wall: a thick line on the outside of the room line
    var a = g.P, b = [g.P[0] + g.d[0] * g.len, g.P[1] + g.d[1] * g.len], t = 100, o = [-g.n[0] * t, -g.n[1] * t];
    s += '<polygon class="rm-pwall" points="' + [a, b, [b[0] + o[0], b[1] + o[1]], [a[0] + o[0], a[1] + o[1]]].map(function (q) { return pX(q[0]).toFixed(1) + ',' + pY(q[1]).toFixed(1); }).join(' ') + '"/>';
    var m = [(a[0] + b[0]) / 2 - g.n[0] * 260, (a[1] + b[1]) / 2 - g.n[1] * 260];
    s += '<text class="rm-wt" x="' + pX(m[0]).toFixed(1) + '" y="' + (pY(m[1]) + 4).toFixed(1) + '" text-anchor="middle">' + LETTER[wi] + ' · ' + fm(g.len) + '</text>';
  });
  var ps = placed(proj).slice().sort(function (a, b) { return (level(a.c) === 'wall') - (level(b.c) === 'wall'); });
  ps.forEach(function (o) {
    var it = drag && drag.id === o.c.id ? drag.it : o.it, r = planRect(o.c, it, G), sel = C.o.sel === o.i;
    var cls = 'rm-pcab lv-' + level(o.c) + (sel ? ' sel' : '') + ((prob.bad[o.c.id] || (drag && drag.id === o.c.id && drag.bad)) ? ' bad' : '') + (drag && drag.id === o.c.id ? ' act' : '');
    s += '<g class="' + cls + '" data-cab="' + o.i + '"><polygon points="' + r.pts.map(function (q) { return pX(q[0]).toFixed(1) + ',' + pY(q[1]).toFixed(1); }).join(' ') + '"/>';
    var g = G[it.wall], fa = [g.P[0] + g.d[0] * it.x + g.n[0] * cabD(o.c), g.P[1] + g.d[1] * it.x + g.n[1] * cabD(o.c)], fb = [fa[0] + g.d[0] * cabW(o.c), fa[1] + g.d[1] * cabW(o.c)];
    s += '<line class="rm-pfront" x1="' + pX(fa[0]).toFixed(1) + '" y1="' + pY(fa[1]).toFixed(1) + '" x2="' + pX(fb[0]).toFixed(1) + '" y2="' + pY(fb[1]).toFixed(1) + '"/>';
    var cx = pX((r.x0 + r.x1) / 2), cy = pY((r.y0 + r.y1) / 2);
    if (level(o.c) !== 'wall' || !ps.some(function (q) { return q !== o && level(q.c) !== 'wall' && q.it.wall === it.wall && vOverlap([it.x, it.x + cabW(o.c)], [q.it.x, q.it.x + cabW(q.c)]); }))
      s += '<text class="rm-pn" x="' + cx.toFixed(1) + '" y="' + (cy + 4).toFixed(1) + '" text-anchor="middle">' + (o.i + 1) + '</text>';
    s += '<title>' + esc(cabName(o.c, o.i) + ' · ' + fm(cabW(o.c))) + '</title></g>';
  });
  if (D && D.mode === 'add' && D.cand) {
    var cd = D.cand, g2 = G[cd.wall], q = function (a, b) { return [g2.P[0] + g2.d[0] * a + g2.n[0] * b, g2.P[1] + g2.d[1] * a + g2.n[1] * b]; };
    s += '<polygon class="rm-ghost' + (cd.bad ? ' bad' : '') + '" points="' + [q(cd.x, 0), q(cd.x + cd.W, 0), q(cd.x + cd.W, cd.D), q(cd.x, cd.D)].map(function (p) { return pX(p[0]).toFixed(1) + ',' + pY(p[1]).toFixed(1); }).join(' ') + '"/>';
  }
  s += '<text class="rm-legend" x="10" y="' + (C.h - 6) + '">' + esc(T('rmPlanLeg')) + '</text>';
  if (D && D.tip) s += tip(D.tip);
  return s;
}

/* ---------------------------------------------------------------- 3D of the whole kitchen */
function setup3d() {
  var L = C.o.proj.layout, G = geo(L), xs = [0], ys = [0];
  G.forEach(function (g) { xs.push(g.P[0] + g.d[0] * g.len, g.P[0] + g.n[0] * 700); ys.push(g.P[1] + g.d[1] * g.len, g.P[1] + g.n[1] * 700); });
  var cx = (Math.min.apply(null, xs) + Math.max.apply(null, xs)) / 2, cy = (Math.min.apply(null, ys) + Math.max.apply(null, ys)) / 2, H = +L.roomH || 2600;
  var R = 0.5 * Math.sqrt(Math.pow(Math.max.apply(null, xs) - Math.min.apply(null, xs), 2) + Math.pow(Math.max.apply(null, ys) - Math.min.apply(null, ys), 2) + H * H);
  C.h = Math.round(Math.max(340, Math.min(600, C.w * 0.62)));
  C.d3 = { cx:cx, cy:cy, cz:H / 2, k:Math.min(C.w, C.h) / (2 * R * 1.02), ct:Math.cos(V.th), st:Math.sin(V.th), cp:Math.cos(V.ph), sp:Math.sin(V.ph) };
}
function P3(px, py, z) {   // plan (x right, y down) + height → screen; world Y = -plan y so the picture is not mirrored
  var Q = C.d3, x = px - Q.cx, y = -(py - Q.cy), zz = z - Q.cz;
  var rx = x * Q.ct + y * Q.st, dp = -x * Q.st + y * Q.ct;
  return [C.w / 2 + rx * Q.k, C.h / 2 - (zz * Q.cp + dp * Q.sp) * Q.k, dp * Q.cp - zz * Q.sp];
}
function draw3d() {
  var proj = C.o.proj, L = proj.layout, G = geo(L), faces = [], H = +L.roomH || 2600;
  var quad = function (pts, cls, cab) { var q = pts.map(function (p) { return P3(p[0], p[1], p[2]); }); faces.push({ q:q, cls:cls, cab:cab, z:(q[0][2] + q[1][2] + q[2][2] + q[3][2]) / 4 }); };
  var box = function (tr, x0, x1, y0, y1, z0, z1, cls, cab) {   // box in cabinet coords through tr()
    var c = [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0], [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]].map(tr);
    [[0, 1, 2, 3, 'b'], [4, 5, 6, 7, 't'], [0, 1, 5, 4, 'f'], [3, 2, 6, 7, 'k'], [0, 3, 7, 4, 's'], [1, 2, 6, 5, 's']].forEach(function (f) { quad([c[f[0]], c[f[1]], c[f[2]], c[f[3]]], cls + ' f' + f[4], cab); });
  };
  // floor and walls of the room
  var fl = []; G.forEach(function (g) { fl.push([g.P[0], g.P[1], 0]); });
  if (G.length >= 3) { var last = G[G.length - 1]; fl.push([last.P[0] + last.d[0] * last.len, last.P[1] + last.d[1] * last.len, 0]); }
  G.forEach(function (g) { var a = g.P, b = [g.P[0] + g.d[0] * g.len, g.P[1] + g.d[1] * g.len]; quad([[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], H], [a[0], a[1], H]], 'rm3-wall'); });
  placed(proj).forEach(function (o) {
    var c = o.c, it = o.it, g = G[it.wall], D0 = cabD(c), z0 = z0Of(c, it, L), inf = C.o.infos[o.i], sel = C.o.sel === o.i;
    var tr = function (p) { var a = it.x + p[0], b = D0 - p[1]; return [g.P[0] + g.d[0] * a + g.n[0] * b, g.P[1] + g.d[1] * a + g.n[1] * b, z0 + p[2]]; };
    if (inf && inf.r && inf.r.panels.length) inf.r.panels.forEach(function (p) {
      if (!p.place) return;
      var q = p.place, pts = [];
      [0, p.L].forEach(function (a) { [0, p.W].forEach(function (b) { [0, p.T].forEach(function (t) { pts.push([q.o[0] + a * q.u[0] + b * q.v[0] - t * q.n[0], q.o[1] + a * q.u[1] + b * q.v[1] - t * q.n[1], q.o[2] + a * q.u[2] + b * q.v[2] - t * q.n[2]]); }); }); });
      var mn = [0, 1, 2].map(function (k) { return Math.min.apply(null, pts.map(function (v) { return v[k]; })); }), mx = [0, 1, 2].map(function (k) { return Math.max.apply(null, pts.map(function (v) { return v[k]; })); });
      var cls = (p.role === 'FASADAS' || p.role === 'DURYS') ? 'rm3-front' : 'rm3-carc';
      box(tr, mn[0], mx[0], mn[1], mx[1], mn[2], mx[2], cls + (sel ? ' sel' : ''), o.i);
    });
    else box(tr, 0, cabW(c), 0, D0, 0, cabH(c), 'rm3-carc' + (sel ? ' sel' : ''), o.i);
    if (inf && inf.r && inf.r.legs) inf.r.legs.forEach(function (lg) { box(tr, lg.x - 15, lg.x + 15, lg.y - 15, lg.y + 15, -legH(c), 0, 'rm3-leg', o.i); });
    if (L.worktop && level(c) === 'base') box(tr, 0, cabW(c), -20, D0, cabH(c), cabH(c) + 38, 'rm3-top', o.i);
  });
  faces.sort(function (a, b) { return b.z - a.z; });
  var s = '';
  if (fl.length >= 3) s += '<polygon class="rm3-floor" points="' + fl.map(function (p) { var q = P3(p[0], p[1], 0); return q[0].toFixed(1) + ',' + q[1].toFixed(1); }).join(' ') + '"/>';
  faces.forEach(function (f) { s += '<polygon class="' + f.cls + '"' + (f.cab != null ? ' data-cab="' + f.cab + '"' : '') + ' points="' + f.q.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '"/>'; });
  return s + '<text class="rm-legend" x="10" y="' + (C.h - 8) + '">' + esc(T('rm3Leg')) + '</text>';
}

/* ---------------------------------------------------------------- tooltip */
function tip(t) {
  var lines = t.lines, w = Math.min(C.w - 8, Math.max.apply(null, lines.map(function (l) { return l.length; })) * 6.6 + 16), h = lines.length * 15 + 8;
  var x = Math.min(C.w - w - 4, Math.max(4, t.x + 14)), y = Math.max(4, t.y - h - 12);
  return '<g class="rm-tip' + (t.bad ? ' bad' : '') + '"><rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h + '" rx="5"/>' +
    lines.map(function (l, i) { return '<text x="' + (x + 8).toFixed(1) + '" y="' + (y + 16 + i * 15).toFixed(1) + '"' + (i ? '' : ' class="b"') + '>' + esc(l) + '</text>'; }).join('') + '</g>';
}

/* ---------------------------------------------------------------- draw */
function draw() {
  if (!C) return;
  var st = C.el.querySelector('.rm-stage'); C.w = st.clientWidth || 800; C.h = Math.round(Math.max(380, Math.min(620, C.w * 0.62)));
  var body;
  if (V.view === 'plan') { planLayout(); body = drawPlan(); }
  else if (V.view === '3d') { setup3d(); body = draw3d(); }
  else { frontLayout(); body = drawFront(); }
  st.innerHTML = '<svg width="' + C.w + '" height="' + C.h + '" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + esc(T('rmTitle')) + '">' + body + '</svg>';
}

/* ---------------------------------------------------------------- pointer → room position */
function local(e) { var r = C.el.querySelector('.rm-stage svg').getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function inStage(e) { var r = C.el.querySelector('.rm-stage').getBoundingClientRect(); return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; }
/* where along which wall the pointer is: { wall, along } (mm) */
function wallAt(m) {
  var L = C.o.proj.layout, G = geo(L);
  if (V.view === 'front') {
    var F = C.fr, best = null;
    F.ws.forEach(function (wi) { var a = fX(wi, 0) - GAP * F.k / 2, b = fX(wi, G[wi].len) + GAP * F.k / 2; if (m[0] >= a && m[0] <= b) best = wi; });
    if (best == null) best = m[0] < fX(F.ws[0], 0) ? F.ws[0] : F.ws[F.ws.length - 1];
    return { wall:best, along:(m[0] - fX(best, 0)) / F.k, z:(C.fr.base - m[1]) / F.k };
  }
  var p = [(m[0] - C.pl.ox) / C.pl.k + C.pl.x0, (m[1] - 10) / C.pl.k + C.pl.y0], bw = null, bd = 1e9;
  G.forEach(function (g, wi) { var rel = [p[0] - g.P[0], p[1] - g.P[1]], a = rel[0] * g.d[0] + rel[1] * g.d[1], n = rel[0] * g.n[0] + rel[1] * g.n[1];
    var ac = Math.max(0, Math.min(g.len, a)), d = Math.hypot(a - ac, n); if (d < bd) { bd = d; bw = { wall:wi, along:a, dist:d }; } });   // nearest wall line
  return bw;
}
function thrMm() { return 14 / (V.view === 'front' ? C.fr.k : C.pl.k); }

function startMove(e, i) {
  var proj = C.o.proj, c = proj.cabinets[i], it = proj.layout.items[c.id]; if (!it || it.wall < 0) return;
  var w = wallAt(local(e));
  D = { mode:'move', id:c.id, i:i, c:c, it:clone(it), orig:clone(it), grab:w && w.wall === it.wall ? w.along - it.x : cabW(c) / 2, x:e.clientX, y:e.clientY, moved:false };
}
function onMove(e) {
  if (!D || !C) return;
  if (Math.hypot(e.clientX - D.x, e.clientY - D.y) > 4) D.moved = true;
  if (D.mode === 'orbit') { if (!D.moved) return; V.th = D.th - (e.clientX - D.x) * 0.008; V.ph = Math.max(0.05, Math.min(1.35, D.ph + (e.clientY - D.y) * 0.006)); draw(); return; }
  var m = local(e);
  if (D.mode === 'move') {
    if (!D.moved) return;
    var proj = C.o.proj, w = wallAt(m); if (!w) return;
    var tmp = proj.layout.items[D.id]; proj.layout.items[D.id] = { wall:w.wall, x:0, z:D.orig.z };   // snapping sees the cabinet on its new wall
    var sn = snap(proj, D.c, w.wall, w.along - D.grab, thrMm());
    D.it = { wall:w.wall, x:sn.x, z:D.orig.z }; proj.layout.items[D.id] = D.it;
    var pr = problems(proj); D.bad = !!pr.bad[D.id];
    proj.layout.items[D.id] = tmp;
    var g = gapAroundAt(proj, D.c, D.it);
    D.tip = { x:m[0], y:m[1], bad:D.bad, lines:[cabName(D.c, D.i) + ' → ' + T('rmWall') + ' ' + LETTER[w.wall], T('rmFromStart').replace('{x}', fm(sn.x)) + (g ? ' · ' + T('rmLeftRight').replace('{l}', fm(sn.x - g.x0)).replace('{r}', fm(g.x1 - sn.x - cabW(D.c))) : '') + (sn.why ? ' · ' + T('rmSnap_' + sn.why) : ''), D.bad ? T('rmHit') : ''].filter(Boolean) };
    draw(); return;
  }
  if (D.mode === 'add') {
    moveGhost(e);
    D.cand = null; D.tip = null;
    if (inStage(e) && V.view !== '3d') {
      var w2 = wallAt(m), pr0 = C.o.presets[D.preset];
      if (w2 && (V.view === 'front' || w2.dist < 1200)) {
        var proj2 = C.o.proj, fake = { id:'__new', W:pr0.W, D:pr0.D, H:pr0.H, type:pr0.type, dishwasher:!!pr0.dish, dishWidth:pr0.W, legH:pr0.legH, cnc:{ legs:pr0.legs } };
        proj2.layout.items.__new = { wall:w2.wall, x:0 }; proj2.cabinets.push(fake);
        var sn2 = snap(proj2, fake, w2.wall, w2.along - pr0.W / 2, thrMm());
        proj2.layout.items.__new = { wall:w2.wall, x:sn2.x };
        var g2 = gapAround(proj2, fake), pr2 = problems(proj2), bad = !!pr2.bad.__new;
        var fitW = g2 && bad && g2.w >= 150 && g2.w < pr0.W ? g2.w : null;
        proj2.cabinets.pop(); delete proj2.layout.items.__new;
        D.cand = { wall:w2.wall, x:fitW ? g2.x0 : sn2.x, W:fitW || pr0.W, D:pr0.D, H:pr0.H, lv:pr0.type === 'PAKABINAMOS' ? 'wall' : 'base', legs:pr0.legs ? pr0.legH : 0, bad:bad && !fitW, fit:!!fitW };
        D.tip = { x:m[0], y:m[1], bad:D.cand.bad, lines:[pr0.name + ' → ' + T('rmWall') + ' ' + LETTER[w2.wall] + ' · ' + T('rmFromStart').replace('{x}', fm(D.cand.x)), fitW ? T('rmFitTo').replace('{w}', fm(fitW)) : (D.cand.bad ? T('rmHit') : T('rmDropAdd'))] };
      }
    }
    draw();
  }
}
function gapAroundAt(proj, c, it) { var keep = proj.layout.items[c.id]; proj.layout.items[c.id] = it; var g = gapAround(proj, c); proj.layout.items[c.id] = keep; return g; }
function onUp(e) {
  if (!D || !C) { D = null; return; }
  var d = D; D = null; if (d.ghost) d.ghost.remove();
  if (d.mode === 'orbit') { if (!d.moved) { draw(); } return; }
  if (d.mode === 'pick') { C.o.onSelect(d.i); return; }
  if (d.mode === 'move') {
    if (!d.moved) { C.o.onSelect(d.i); return; }
    C.o.onLayout(function (proj) { proj.layout.items[d.id] = { wall:d.it.wall, x:d.it.x, z:d.orig.z }; }, { sel:d.i, msg:d.bad ? T('rmHitDrop') : '' });
    return;
  }
  if (d.mode === 'add') {
    if (!d.cand) { draw(); if (d.moved && C.o.toast) C.o.toast(T(V.view === '3d' ? 'rmNo3dDrop' : 'rmMiss')); return; }
    C.o.onAdd(d.preset, d.cand.wall, d.cand.x, d.cand.fit ? d.cand.W : null);
  }
}
function moveGhost(e) { if (D && D.ghost) { D.ghost.style.left = e.clientX + 'px'; D.ghost.style.top = e.clientY + 'px'; D.ghost.classList.toggle('on', !!D.cand); } }

/* ---------------------------------------------------------------- side panels */
function bar() {
  var L = C.o.proj.layout, views = [['front', T('rmVFront')], ['plan', T('rmVPlan')], ['3d', '3D']];
  return '<div class="rm-bar"><div class="seg" role="group">' + views.map(function (v) { return '<button type="button" data-rm="view" data-v="' + v[0] + '" class="' + (V.view === v[0] ? 'on' : '') + '" aria-pressed="' + (V.view === v[0]) + '">' + esc(v[1]) + '</button>'; }).join('') + '</div>' +
    (V.view === 'front' && L.walls.length > 1 ? '<div class="seg" role="group" aria-label="' + esc(T('rmWalls')) + '">' + [[-1, T('rmAllWalls')]].concat(L.walls.map(function (w, i) { return [i, LETTER[i]]; })).map(function (v) {
      return '<button type="button" data-rm="wallv" data-v="' + v[0] + '" class="' + (V.wall === v[0] ? 'on' : '') + '">' + esc(v[1]) + '</button>'; }).join('') + '</div>' : '') +
    (V.view === '3d' ? '<span class="unit">' + esc(T('rm3Hint')) + '</span>' : '') +
    '<button type="button" class="btn" data-rm="undo"' + (C.o.canUndo ? '' : ' disabled') + ' title="Ctrl+Z">↶ ' + esc(T('isoUndo')) + '</button></div>';
}
function palette() {
  var proj = C.o.proj, L = proj.layout, un = proj.cabinets.map(function (c, i) { return { c:c, i:i }; }).filter(function (o) { var it = L.items[o.c.id]; return !it || it.wall < 0 || it.wall >= L.walls.length; });
  return '<aside class="rm-pal"><div class="lbl">' + esc(T('rmAdd')) + '</div><div class="rm-pre">' + C.o.presets.map(function (p, i) {
      return '<button type="button" class="rm-chip" data-pre="' + i + '" title="' + esc(T('rmAddT')) + '">' + p.icon + '<span><b>' + esc(p.name) + '</b><small>' + p.W + '×' + p.H + '×' + p.D + '</small></span></button>'; }).join('') + '</div>' +
    (un.length ? '<div class="lbl" style="margin-top:10px">' + esc(T('rmUnplaced')) + '</div><div class="rm-un">' + un.map(function (o) {
      return '<div class="rm-unrow"><span>' + esc(cabName(o.c, o.i)) + '<small>' + fm(cabW(o.c)) + ' mm</small></span><button type="button" class="btn" data-rm="place" data-i="' + o.i + '">' + esc(T('rmPlace')) + '</button></div>'; }).join('') + '</div>' : '') +
    '</aside>';
}
function inspector() {
  var proj = C.o.proj, L = proj.layout, G = geo(L), i = C.o.sel, c = i != null ? proj.cabinets[i] : null, it = c ? L.items[c.id] : null;
  var pr = problems(proj);
  if (c && it && it.wall >= 0 && it.wall < G.length) {
    var g = gapAround(proj, c), wOpts = L.walls.map(function (w, k) { return '<option value="' + k + '"' + (k === it.wall ? ' selected' : '') + '>' + esc(T('rmWall')) + ' ' + LETTER[k] + ' · ' + fm(w.len) + '</option>'; }).join('');
    var my = pr.list.filter(function (p) { return p.a === i || p.b === i; });
    return '<aside class="rm-ins"><div class="rm-ih"><b>' + esc(cabName(c, i)) + '</b><button type="button" class="btn ghost" data-rm="desel" aria-label="' + esc(T('close')) + '">✕</button></div>' +
      '<div class="rm-f"><label for="rm-w">' + esc(T('W')) + '</label><span><input id="rm-w" type="text" inputmode="decimal" data-rmf="W" value="' + fm(cabW(c)) + '"' + (c.dishwasher ? ' data-dish="1"' : '') + '> mm</span>' +
      '<label for="rm-x">' + esc(T('rmX')) + '</label><span><input id="rm-x" type="text" inputmode="decimal" data-rmf="x" value="' + fm(it.x) + '"> mm</span>' +
      '<label for="rm-wall">' + esc(T('rmWall')) + '</label><select id="rm-wall" data-rmf="wall">' + wOpts + '</select>' +
      (level(c) === 'wall' ? '<label for="rm-z">' + esc(T('rmZ')) + '</label><span><input id="rm-z" type="text" inputmode="decimal" data-rmf="z" value="' + fm(z0Of(c, it, L)) + '"> mm</span>' : '') + '</div>' +
      (my.length ? '<p class="note bad">' + esc(T('rmHitShort')) + '</p>' : '') +
      (g && Math.abs(g.w - cabW(c)) > 0.5 && g.w >= 100 && g.w <= 1200 && !c.dishwasher ? '<button type="button" class="btn rm-fill" data-rm="fill">↔ ' + esc(T('rmFill').replace('{w}', fm(g.w))) + '</button>' : '') +
      '<div class="rm-acts"><button type="button" class="btn pri" data-rm="edit">✎ ' + esc(T('rmEdit')) + '</button><button type="button" class="btn" data-rm="dup">⧉ ' + esc(T('rmDup')) + '</button>' +
      '<button type="button" class="btn ghost" data-rm="unplace">' + esc(T('rmUnplace')) + '</button><button type="button" class="btn ghost danger" data-rm="del">' + esc(C.o.confirmDel ? T('delSure') : T('del')) + '</button></div>' +
      '<p class="note">' + esc(T('rmKeys')) + '</p></aside>';
  }
  var rows = G.map(function (gw, k) {
    var used = placed(proj).filter(function (o) { return o.it.wall === k && level(o.c) !== 'wall'; }).reduce(function (a, o) { return a + cabW(o.c); }, 0);
    return '<div class="rm-wrow"><b>' + LETTER[k] + '</b><span><input type="text" inputmode="decimal" id="rm-len-' + k + '" data-rmwall="' + k + '" value="' + fm(gw.len) + '" aria-label="' + esc(T('rmWall') + ' ' + LETTER[k]) + '"> mm</span><small>' + esc(T('rmUsed').replace('{u}', fm(used))) + '</small>' +
      (k === G.length - 1 && k > 0 ? '<button type="button" class="btn ghost" data-rm="wdel" title="' + esc(T('rmWallDel')) + '">✕</button>' : '<span></span>') + '</div>';
  }).join('');
  return '<aside class="rm-ins"><div class="lbl">' + esc(T('rmRoom')) + '</div><p class="note">' + esc(T('rmRoomL')) + '</p>' +
    '<div class="rm-walls">' + rows + '</div>' + (G.length < 4 ? '<button type="button" class="btn" data-rm="wadd">＋ ' + esc(T('rmWallAdd')) + '</button>' : '') +
    '<div class="rm-f" style="margin-top:10px"><label for="rm-wz">' + esc(T('rmWallZ')) + '</label><span><input id="rm-wz" type="text" inputmode="decimal" data-rml="wallZ" value="' + fm(L.wallZ) + '"> mm</span>' +
    '<label for="rm-rh">' + esc(T('rmRoomH')) + '</label><span><input id="rm-rh" type="text" inputmode="decimal" data-rml="roomH" value="' + fm(L.roomH) + '"> mm</span>' +
    '<label for="rm-wt">' + esc(T('rmWorktop')) + '</label><span><input id="rm-wt" type="checkbox" data-rml="worktop"' + (L.worktop ? ' checked' : '') + '></span></div>' +
    (pr.list.length ? '<div class="rm-probs"><div class="lbl">' + esc(T('rmProbs')) + '</div>' + pr.list.map(function (p) {
      return '<button type="button" class="rm-prob" data-rm="sel" data-i="' + p.a + '">' + esc(p.kind === 'out' ? T('rmProbOut').replace('{a}', p.a + 1) : T('rmProbHit').replace('{a}', p.a + 1).replace('{b}', p.b + 1)) + '</button>'; }).join('') + '</div>'
      : '<p class="note ok">✓ ' + esc(T('rmNoProbs')) + '</p>') +
    '<p class="note">' + esc(T('rmHint')) + '</p></aside>';
}

/* ---------------------------------------------------------------- events */
function onClick(e) {
  var b = e.target.closest('[data-rm]'); if (!b || !C) return;
  var a = b.getAttribute('data-rm'), v = b.getAttribute('data-v'), proj = C.o.proj, L = proj.layout, i = C.o.sel, c = i != null ? proj.cabinets[i] : null;
  if (a === 'view') { V.view = v; D = null; attach(C.el, C.o); return; }
  if (a === 'wallv') { V.wall = +v; draw(); C.el.querySelectorAll('[data-rm=wallv]').forEach(function (x) { x.classList.toggle('on', +x.getAttribute('data-v') === V.wall); }); return; }
  if (a === 'undo') { C.o.onUndo(); return; }
  if (a === 'desel') { C.o.onSelect(null); return; }
  if (a === 'sel') { C.o.onSelect(+b.getAttribute('data-i')); return; }
  if (a === 'place') { var k = +b.getAttribute('data-i'), cc = proj.cabinets[k]; C.o.onLayout(function (p) { delete p.layout.items[cc.id]; var s = autoSpot(p, cc); p.layout.items[cc.id] = { wall:s.wall, x:s.x }; }, { sel:k }); return; }
  if (a === 'wadd') { C.o.onLayout(function (p) { p.layout.walls.push({ len:2400 }); }, {}); return; }
  if (a === 'wdel') { C.o.onLayout(function (p) { var last = p.layout.walls.length - 1; p.layout.walls.pop(); Object.keys(p.layout.items).forEach(function (id) { if (p.layout.items[id].wall === last) p.layout.items[id].wall = -1; }); }, { msg:T('rmWallDelDone') }); return; }
  if (!c) return;
  if (a === 'edit') { C.o.onEdit(i); return; }
  if (a === 'dup') { C.o.onDup(i); return; }
  if (a === 'del') { C.o.onDelete(i); return; }
  if (a === 'unplace') { C.o.onLayout(function (p) { p.layout.items[c.id] = { wall:-1, x:0 }; }, { sel:null }); return; }
  if (a === 'fill') { var g = gapAround(proj, c); if (!g) return; C.o.onCab(i, { W:g.w }, function (p) { p.layout.items[c.id].x = g.x0; }); return; }
}
function num(v) { var n = parseFloat(String(v).replace(',', '.')); return isFinite(n) ? n : null; }
function onChange(e) {
  var el = e.target, proj = C.o.proj, L = proj.layout, i = C.o.sel, c = i != null ? proj.cabinets[i] : null;
  if (el.hasAttribute('data-rmwall')) { var k = +el.getAttribute('data-rmwall'), n = num(el.value); if (n == null || n < 300) { el.value = fm(L.walls[k].len); return; } C.o.onLayout(function (p) { p.layout.walls[k].len = n; }, {}); return; }
  if (el.hasAttribute('data-rml')) { var f = el.getAttribute('data-rml'); if (f === 'worktop') { C.o.onLayout(function (p) { p.layout.worktop = el.checked; }, {}); return; }
    var n2 = num(el.value); if (n2 == null || n2 < 0) { el.value = fm(L[f]); return; } C.o.onLayout(function (p) { p.layout[f] = n2; }, {}); return; }
  if (!c || !el.hasAttribute('data-rmf')) return;
  var fld = el.getAttribute('data-rmf');
  if (fld === 'W') { var w = num(el.value); if (w == null || w < 100) { el.value = fm(cabW(c)); return; } C.o.onCab(i, c.dishwasher ? { dishWidth:w } : { W:w }); return; }
  if (fld === 'x') { var x = num(el.value); if (x == null) { el.value = fm(L.items[c.id].x); return; } C.o.onLayout(function (p) { p.layout.items[c.id].x = x; }, { sel:i }); return; }
  if (fld === 'wall') { C.o.onLayout(function (p) { var s; p.layout.items[c.id] = { wall:+el.value, x:0, z:p.layout.items[c.id].z }; var ends = neighbours(p, c, +el.value).map(function (o) { return o.it.x + cabW(o.c); }); p.layout.items[c.id].x = r1(Math.max(cornerIn(p, +el.value, c, c.id), ends.length ? Math.max.apply(null, ends) : 0)); }, { sel:i }); return; }
  if (fld === 'z') { var z = num(el.value); C.o.onLayout(function (p) { p.layout.items[c.id].z = z == null ? null : z; }, { sel:i }); }
}
function onKey(e) {
  if (!C || C.o.sel == null || /INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
  var proj = C.o.proj, c = proj.cabinets[C.o.sel], it = c && proj.layout.items[c.id]; if (!it || it.wall < 0) return;
  var st = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
  if (e.key === 'Delete') { e.preventDefault(); C.o.onLayout(function (p) { p.layout.items[c.id] = { wall:-1, x:0 }; }, { sel:null, msg:T('rmUnplaced1') }); return; }
  if (!st) return; e.preventDefault();
  var nx = r1(it.x + st * (e.shiftKey ? 100 : 10));
  C.o.onLayout(function (p) { p.layout.items[c.id].x = nx; }, { sel:C.o.sel, focus:true });
}

/* ---------------------------------------------------------------- mount */
function attach(el, o) {
  if (!el) { C = null; return; }
  C = { el:el, o:o };
  el.innerHTML = bar() + '<div class="rm-main">' + palette() + '<div class="rm-stage" tabindex="0" aria-label="' + esc(T('rmTitle')) + '"></div>' + inspector() + '</div>';
  draw();
  var stage = el.querySelector('.rm-stage');
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    var cab = e.target.closest('[data-cab]');
    if (V.view === '3d') { D = { mode:'orbit', x:e.clientX, y:e.clientY, th:V.th, ph:V.ph, moved:false, cab:cab ? +cab.getAttribute('data-cab') : null }; }
    else if (cab) startMove(e, +cab.getAttribute('data-cab'));
    else D = { mode:'bg', x:e.clientX, y:e.clientY, moved:false };
    try { stage.setPointerCapture(e.pointerId); } catch (er) {}
    stage.focus({ preventScroll:true }); e.preventDefault();
  });
  stage.addEventListener('pointermove', onMove);
  stage.addEventListener('pointerup', function (e) {
    if (D && D.mode === 'orbit' && !D.moved && D.cab != null) { var k = D.cab; D = null; C.o.onSelect(k); return; }
    if (D && D.mode === 'bg') { var mv = D.moved; D = null; if (!mv) C.o.onSelect(null); return; }
    onUp(e);
  });
  stage.addEventListener('pointercancel', function () { D = null; draw(); });
  stage.addEventListener('keydown', onKey);
  el.querySelectorAll('.rm-chip').forEach(function (ch) {
    ch.addEventListener('pointerdown', function (e) {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      var k = +ch.getAttribute('data-pre');
      D = { mode:'add', preset:k, x:e.clientX, y:e.clientY, moved:false };
      var g = document.createElement('div'); g.className = 'rm-ghostcard'; g.innerHTML = C.o.presets[k].icon + '<b>' + esc(C.o.presets[k].name) + '</b>'; document.body.appendChild(g); D.ghost = g; moveGhost(e);
      try { ch.setPointerCapture(e.pointerId); } catch (er) {} e.preventDefault();
    });
    ch.addEventListener('pointermove', function (e) { if (D && D.mode === 'add') onMove(e); });
    ch.addEventListener('pointerup', function (e) {
      if (!D || D.mode !== 'add') return;
      if (!D.moved) { var k = D.preset; if (D.ghost) D.ghost.remove(); D = null; C.o.onAdd(k, null, null, null); return; }   // a tap adds it after the last cabinet
      onUp(e);
    });
    ch.addEventListener('pointercancel', function () { if (D && D.ghost) D.ghost.remove(); D = null; draw(); });
  });
  if (!el.__rmBound) { el.__rmBound = true; el.addEventListener('click', onClick); el.addEventListener('change', onChange); }
  if (o.focusStage) stage.focus({ preventScroll:true });
  if (window.ResizeObserver) { if (RO) RO.disconnect(); var lw = stage.clientWidth; RO = new ResizeObserver(function () { if (C && C.el === el && Math.abs(stage.clientWidth - lw) > 2) { lw = stage.clientWidth; draw(); } }); RO.observe(stage); }
}

var api = { attach:attach, ensure:ensure, problems:problems, geo:geo, snap:snap, gapAround:gapAround, autoSpot:autoSpot, cabW:cabW, level:level, view:V, _state:function () { return { C:C, D:D }; } };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBRoom = api;
})(typeof window !== 'undefined' ? window : this);
