/* =====================================================================
   engine.js — Dėdės Baldai cabinet engine (cabinet creator app; first written for the SketchUp plugin).

   cabinet definition → panels (size, material, edgebands, 3-D placement,
   drillings) → SCM Startech CN Plus programs (.XXL).

   The construction and drilling rules are the ones of the offer app's CNC tab
   (cnc-module.js v0.1, verified against the SWOOD models Spintele_su_tandem and
   Spintele_su_tandembox, Oct 2026). For drawer cabinets this engine produces
   exactly the same programs; test/compare_ref.js proves it on every change.

   Added for the plugin (no drillings, so no change to any program):
     - 3-D placement of every panel (origin + axes) so SketchUp can draw it
     - doors, shelves, dishwasher front and legs as drawn panels
     - materials and edgebands per panel (for the part list)

   Units: millimetres. Cabinet axes: X to the right, Y from the front (Y=0)
   to the back, Z up from the underside of the bottom panel.
   Runs in the plugin dialog (Chromium) and in Node for tests. ES2015 only.
   ===================================================================== */
(function (root) {
"use strict";

/* ----------------------------------------------------------------- rules */
var R = {
  cam:   { cam:{d:15, depth:15, fromEdge:34, fromFront:50},   // cams in the side's inner face
           bolt:{d:8, depthFace:15, depthEdge:31.906},         // bolt hole in bottom/top face; the Ø8 bore in the part's edge stops at 31.906
                                                               // (cam centre at 34 — as SWOOD CAM / step2xxl drill it: the drill cannot go to 34)
           dowel:{d:8, depthEdge:27, depthFace:12, offset:32}, // dowels at cam ±32 (outer cams only)
           backFix:{d:8, fromEdge:50} },                       // confirmats back→side: 8 through in back
  confirmat: { d:8, pilot:{d:5, depth:32}, fromFront:70, railFromEdge:[30,70], railAlong:50 },
  rail: 100,
  legs: { fromSide:55, fromFront:95, fromBack:55, markD:5, markDepth:2, markOff:14.85, drawD:40 },
  runner: {
    "BLUM TANDEM":    { marks:[37,165,229],          up:37, facade:null },
    "BLUM TANDEMBOX": { marks:[19,28,37,261,293,453], up:33,
                        facade:{d:10, depth:12, fromSide:32, ys:[65.5,97.5], yGallery:225.5} }
  },
  facade: { sideGap:3, gap:3, zoneGapRails:2 },   // facade clearances (zone = H - t under a covering top, H - 2 with rails)
  shelf:  { clearW:2, setback:20 },               // drawn shelves: 1 mm each side, 20 mm back from the front edge
  /* ---- operations added for the cabinet creator (Oct 2026). Blum catalogue values, NOT yet
          verified against a SWOOD model of the shop — editable in the app's settings. */
  hinge:  { cupD:35, cupDepth:13, cupFromEdge:22.5,           // 35 mm cup, centre 22.5 from the door edge
            fromEnd:100,                                      // outer hinges 100 mm from the door ends
            dowelD:8, dowelDepth:11, dowelSpacing:45, dowelOffset:9.5,   // press-in (INSERTA) cups only
            plateD:5, plateDepth:2, plateFromFront:37, plateSpacing:32 },   // mounting plate screw positions in the side: markings (post: Ø5 × 2)
  pins:   { d:5, depth:12, fromFront:37, fromBack:30, below:3, pitch:32, extra:2 },   // shelf supports in the sides
  backCam: { fromEnd:80 },                       // cams fixing a back: first/last 80 from the ends (clear of the corner cams)
  through_extra: 6.559,
  /* post-processor rules (Dalius's SolidWorks → XXL post, step2xxl, matching SWOOD CAM): every marking — drawer runners,
     hinge plates, legs, front fixing marks — is a Ø5 hole 2 mm deep with N="L"; holes are listed left end (F=3) first,
     then the top face by X, then the right end (F=2) */
  post: { markD:5, markDepth:2, edgeMaxZ:31.906 },   // edgeMaxZ: no horizontal bore goes deeper (SWOOD CAM / step2xxl)
  /* boring head as equipped (Maestro StartechCNPlus .atrx/.cfgx): top 5/8/15/35, through 5/8, X ends 5/8, long edges 8.
     5 mm long-edge bores go to a separate program with the panel turned 90° (as step2xxl), panels up to machine.maxY. */
  drills: { top:[5,8,15,35], through:[5,8], xEnds:[5,8], yEdges:[8], edgeMax:35 },
  machine: { maxX:3050, maxY:900, minX:200, minY:80 },
  hdf: { t:3, inset:2, mat:'HDF 3 mm' }          // plaušo nugara: nailed on the back, 2 mm in from the carcass edges
};
var DRAWER_HW = ["BLUM TANDEM", "BLUM TANDEMBOX"];
var DOOR_HW   = ["BLUM LANKSTAI", "BLUM TIP-ON", "KT. LANKSTAI", "BE FURNITŪROS"];
var hingesPerDoor = function (h) { return h <= 900 ? 2 : h <= 1500 ? 3 : h <= 2000 ? 4 : 5; };   // same rule as the offer app
/* hinge positions along a door of height h, from its bottom edge: outer ones R.hinge.fromEnd from the ends, rest evenly between */
function hingeYs(h) { var n = hingesPerDoor(h), e = Math.min(R.hinge.fromEnd, h*0.25), ys = []; for (var q = 0; q < n; q++) ys.push(e + (h - 2*e)*q/(n - 1)); return ys; }
/* do two or more hinges physically fit on a door of height h? (cups/press-in dowels inside the panel, not overlapping) */
function hingesFit(h, press) {
  var hr = R.hinge, ys = hingeYs(h), half = press ? hr.dowelSpacing/2 + hr.dowelD/2 : hr.cupD/2, need = press ? hr.dowelSpacing + hr.dowelD : hr.cupD;
  if (ys[0] - half < 3) return false;
  for (var i = 1; i < ys.length; i++) if (ys[i] - ys[i-1] < need + 3) return false;
  return true;
}
/* override rule values (deep merge of plain objects), e.g. setRules({hinge:{cupFromEdge:21.5}}) */
function setRules(over) {
  (function merge(dst, src) { Object.keys(src || {}).forEach(function (k) {
    if (src[k] && typeof src[k] === 'object' && !Array.isArray(src[k]) && dst[k] && typeof dst[k] === 'object') merge(dst[k], src[k]);
    else if (src[k] !== undefined && src[k] !== '' && src[k] !== null) dst[k] = Array.isArray(src[k]) ? src[k].slice() : src[k]; }); })(R, over);
}

var X = [1,0,0], Y = [0,1,0], Z = [0,0,1];
var neg = function (v) { return [-v[0], -v[1], -v[2]]; };

/* ----------------------------------------------------------------- panel model
   Panel: L (along machine X), W (along Y), T. Face A = the face defined as "up" for the
   part (inner face of a side, top face of bottom, inner face of a facade); face B the opposite.
   Holes on either face are given in the same (x,y) seen from face A. Edge holes: edge x0/x1
   (short ends) or y0/y1 (long edges), pos along it.
   Placement: point o is the panel's (x=0, y=0) corner on face A; u, v are the directions of
   panel x and y in cabinet axes, n the outward normal of face A. The body lies on the -n side. */
function panel(name, role, L, W, T, note) {
  return { name:name, role:role, L:L, W:W, T:T, note:note || "", holes:[], edges:[], warnings:[],
           eb:{ y0:"", y1:"", x0:"", x1:"" }, mat:"", place:null };
}
function place(p, o, u, v, n) { p.place = { o:o, u:u, v:v, n:n }; return p; }
function hole(p, face, x, y, d, depth, opts) { p.holes.push(Object.assign({ face:face, x:x, y:y, d:d, depth:depth || 0 }, opts || {})); }
function edge(p, e, pos, d, depth) { p.edges.push({ edge:e, pos:pos, d:d, depth:depth }); }
function legMarks(p, face, cx, cy) {
  var o = R.legs.markOff;
  [[-o,-o],[-o,o],[o,-o],[o,o]].forEach(function (ab) { hole(p, face, cx + ab[0], cy + ab[1], R.legs.markD, R.legs.markDepth, { mark:true }); });
}

/* make the long side run along X: rotate the whole part 90° if needed */
/* The machine frame must be right-handed: X along the part, Y across it, Z out of the face that is up (X × Y = Z).
   Some parts were described mirrored (e.g. the sides "inner face up, bottom X=0, front Y=0", the doors, the back rail),
   which put cams and hinge cups on the wrong side when drilled — the shop had to mirror those programs on the machine.
   Such a part is mirrored here across its width (y → W − y), so its programs come out right; the part itself does not move. */
function rightHanded(p) {
  var q = p.place; if (!q) return p;
  var c = [q.u[1]*q.v[2] - q.u[2]*q.v[1], q.u[2]*q.v[0] - q.u[0]*q.v[2], q.u[0]*q.v[1] - q.u[1]*q.v[0]];
  if (c[0]*q.n[0] + c[1]*q.n[1] + c[2]*q.n[2] > 0) return p;
  var W = p.W;
  p.holes.forEach(function (h) { h.y = W - h.y; });
  p.edges.forEach(function (e) { if (e.edge === 'y0') e.edge = 'y1'; else if (e.edge === 'y1') e.edge = 'y0'; else e.pos = W - e.pos; });
  var y0 = p.eb.y0; p.eb.y0 = p.eb.y1; p.eb.y1 = y0;
  p.place = { o:[q.o[0] + W*q.v[0], q.o[1] + W*q.v[1], q.o[2] + W*q.v[2]], u:q.u, v:neg(q.v), n:q.n };
  p.note = p.note.replace(/Y=(DY|0)\b/g, function (m, g) { return g === 'DY' ? 'Y=0' : 'Y=DY'; });
  p.mirrored = true;
  return p;
}
function orient(p) {
  if (p.L >= p.W) return p;
  var L = p.L;
  p.holes.forEach(function (h) { var x = h.x, y = h.y; h.x = y; h.y = L - x; });
  var map = { x0:'y1', x1:'y0', y0:'x0', y1:'x1' };
  p.edges.forEach(function (e) { e.edge = map[e.edge]; });
  p.edges.forEach(function (e) { if (e.edge === 'x0' || e.edge === 'x1') e.pos = L - e.pos; });
  var eb = {}; Object.keys(p.eb).forEach(function (k) { eb[map[k]] = p.eb[k]; }); p.eb = eb;
  if (p.place) {   // new x = old y, new y = L - old x  →  u' = v, v' = -u, o' = o + L·u
    var q = p.place;
    p.place = { o:[q.o[0] + L*q.u[0], q.o[1] + L*q.u[1], q.o[2] + L*q.u[2]], u:q.v, v:neg(q.u), n:q.n };
  }
  var tmp = p.L; p.L = p.W; p.W = tmp;
  p.note = p.note.replace('apatinis kraštas Y=0', 'apatinis kraštas X=0');   // old y (height) became x
  return p;
}

/* ----------------------------------------------------------------- cabinet defaults */
function cncDefaults(c) {
  c.cnc = Object.assign({ joinery:'confirmat', back:'none', backFix:'confirmat', joints:{}, top:'rails', rails:null, railW:0, legs:true, topOverFacade:false, facadeT:18,
                          runnerMarks:true, tbFront:'mark', hinges:false, hingeFix:'screw', pins:'off' }, c.cnc || {});
  if (c.cnc.tbFront === true) c.cnc.tbFront = 'hole'; else if (c.cnc.tbFront === false) c.cnc.tbFront = 'off';   // old boolean form
  c.cnc.rails = Object.assign({ front:'h', back:'h', bottom:false }, c.cnc.rails || {});
  return c.cnc;
}
function newSection(kind) {
  return { kind:kind || 'doors', col:0, fill:(kind !== 'drawers'), height:kind === 'drawers' ? 700 : 400,
           nDrawers:3, hw:'BLUM TANDEMBOX', rail:500, nDoors:1, doorSplit:'v', hinge:'BLUM LANKSTAI', hingeSide:'auto',
           shelves:0, shelfAdj:true, shelfMode:'even', shelfPos:[] };
}
function newCabinet() {
  return { v:1, name:"", W:600, H:720, D:560, thick:18, cols:1, dishwasher:false,
           mat:{ carc:"", facade:"", back:"" }, edge:{ carc:"", facade:"" }, legH:100,
           cnc:{ joinery:'confirmat', back:'none', top:'rails', legs:true, topOverFacade:false, facadeT:18 },
           sections:[ Object.assign(newSection('drawers'), { fill:true, nDrawers:3 }) ] };
}
function safeName(s) { return ascii(String(s || '')).replace(/[^\w\-]+/g, '_'); }   // Aukšta → Auksta (program/label names stay plain ASCII)

/* ----------------------------------------------------------------- cabinet → panels */
/* split a section among n stacked fronts. hs = front heights from the TOP down (what the worker sees and measures);
   an empty / 0 entry shares what is left. Returns module heights (front + gap) from the BOTTOM up, and a note when
   the given heights do not fit (then the bottom-most given front takes the difference, or all share equally). */
function splitFronts(secH, n, hs, gap) {
  n = Math.max(1, Math.round(+n || 1)); gap = gap == null ? R.facade.gap : gap;
  var top = []; for (var i = 0; i < n; i++) { var v = hs && +hs[i] > 0 ? +hs[i] : 0; top.push(v); }
  var fixed = top.filter(function (v) { return v > 0; }), nAuto = n - fixed.length, sumFix = fixed.reduce(function (a, v) { return a + v + gap; }, 0), note = '';
  var mods;
  if (!fixed.length) mods = top.map(function () { return secH / n; });
  else if (nAuto > 0) {
    var rest = (secH - sumFix) / nAuto;
    if (rest < 80 + gap) { note = 'nurodyti fasadų aukščiai (' + fixed.join(' + ') + ') netelpa į sekciją ' + num(secH) + ' mm — fasadai padalinti po lygiai'; mods = top.map(function () { return secH / n; }); }
    else mods = top.map(function (v) { return v > 0 ? v + gap : rest; });
  } else if (Math.abs(sumFix - secH) > 0.5) {
    var last = -1; top.forEach(function (v, q) { if (v > 0) last = q; });
    var adj = top[last] + gap + (secH - sumFix);
    if (adj < 80 + gap) { note = 'fasadų aukščių suma (' + num(sumFix - n*gap) + ' + tarpai) neatitinka sekcijos ' + num(secH) + ' mm — fasadai padalinti po lygiai'; mods = top.map(function () { return secH / n; }); }
    else { note = 'fasadų aukščių suma neatitinka sekcijos ' + num(secH) + ' mm — apatinis fasadas ' + num(adj - gap) + ' mm'; mods = top.map(function (v, q) { return q === last ? adj : v + gap; }); }
  } else mods = top.map(function (v) { return v + gap; });
  return { mods:mods.slice().reverse(), note:note };
}

function buildCabinet(c, idx, projName) {
  var o = cncDefaults(c); var t = +c.thick || 18, W = +c.W, H = +c.H, D = +c.D;
  var base = safeName(projName || 'PROJ') + '_' + (idx + 1) + (c.name ? '_' + safeName(c.name) : '');
  var nm = function (role) { return base + '_' + role; };
  var out = [], warn = [], hw = [];
  var warnOnce = function (w) { if (warn.indexOf(w) < 0) warn.push(w); };
  var mat = c.mat || {}, ed = c.edge || {};
  var mCarc = mat.carc || '', mFac = mat.facade || mCarc, mBack = mat.back || mCarc;
  var eCarc = ed.carc || '', eFac = ed.facade || '';
  var fT = +o.facadeT || 18;
  var sideGap = R.facade.sideGap, gap = R.facade.gap;

  if (!(W > 0 && H > 0 && D > 0)) { warn.push('netinkami matmenys'); return { panels:out, warnings:warn, hardware:hw, legs:[] }; }

  if (c.dishwasher) {   // dishwasher cabinet: front only, no programs
    warn.push('indaplovės spintelė: tik fasadas — programų negeneruojama');
    var pd = panel(nm('FASADAS1'), 'FASADAS', W - 2*sideGap, H - gap, fT, 'galinė (vidinė) pusė viršuje, apatinis kraštas Y=0');
    place(pd, [sideGap, 0, 0], X, Z, Y); pd.mat = mFac; pd.eb = { y0:eFac, y1:eFac, x0:eFac, x1:eFac };
    out.push(orient(pd));
    return { panels:out, warnings:warn, hardware:hw, legs:[] };
  }
  /* ---- columns (pertvaros): outer widths as in the offer app; partition k stands centred on bnd[k+1] */
  var cols = Math.max(1, Math.min(4, Math.floor(+c.cols || 1)));
  var colW = Array.isArray(c.colW) && c.colW.length === cols && c.colW.every(function (w) { return +w > 0; }) ? c.colW.map(Number) : null;
  if (!colW) { colW = []; for (var q0 = 0; q0 < cols; q0++) colW.push(W / cols); }
  var sumCW = colW.reduce(function (a, b) { return a + b; }, 0); colW = colW.map(function (w) { return w * W / sumCW; });
  var bnd = [0]; colW.forEach(function (w, k) { bnd.push(bnd[k] + w); }); bnd[cols] = W;
  var ix0 = function (k) { return k === 0 ? t : bnd[k] + t/2; }, ix1 = function (k) { return k === cols - 1 ? W - t : bnd[k + 1] - t/2; };   // inside, between side / partition faces
  var fx0 = function (k) { return k === 0 ? sideGap : bnd[k] + gap/2; }, fx1 = function (k) { return k === cols - 1 ? W - sideGap : bnd[k + 1] - gap/2; };   // fronts of column k
  var tgL = function (k) { return k === 0 ? 'L' : { p:k - 1, f:'R' }; }, tgR = function (k) { return k === cols - 1 ? 'R' : { p:k, f:'L' }; };   // what a part in column k ends on
  if (cols > 1) colW.forEach(function (w, k) { if (ix1(k) - ix0(k) < 100) warn.push('kolona ' + (k + 1) + ' per siaura (' + num(ix1(k) - ix0(k)) + ' mm tarp šono ir pertvaros) — netinkami matmenys'); });
  /* ---- back per column: none | hdf (plaušas, nailed on the back) | solid (18 mm: one back on the back of the whole cabinet, or inside each column) */
  var colBacks = []; for (var q1 = 0; q1 < cols; q1++) colBacks.push(Array.isArray(o.backs) && o.backs[q1] ? o.backs[q1] : (!o.back || o.back === 'none' ? 'none' : 'solid'));
  var solidMount = o.backMount || (o.back === 'inside' ? 'inside' : 'top');
  var backTop = colBacks.every(function (b) { return b === 'solid'; }) && solidMount === 'top';
  var inBack = function (k) { return !backTop && colBacks[k] === 'solid'; };
  var anyInside = colBacks.some(function (b, k) { return inBack(k); }), anyHdf = colBacks.some(function (b) { return b === 'hdf'; });
  var hdfT = +R.hdf.t || 3;
  var tb = backTop ? t : anyHdf ? hdfT : 0;        // depth taken by the back behind the sides
  var topFull = o.top === 'full';
  var Dside = D - tb;                              // side depth
  var Lside = topFull ? H - 2*t : H - t;           // side height
  var rw = +o.railW > 0 ? +o.railW : R.rail;       // rail width
  /* surišimo juostos (only with a rail top): front flat/standing/none, back flat/standing/both/none, standing rail on the bottom at the back */
  var rl = topFull ? { front:'none', back:'none', bottom:false } : { front:o.rails.front, back:o.rails.back, bottom:!!o.rails.bottom };
  if (anyInside && (rl.back === 'v' || rl.back === 'hv' || rl.bottom)) {
    warn.push('nugara viduje: stačios galinės juostos netelpa šalia nugaros — praleistos');
    rl.back = rl.back === 'hv' ? 'h' : rl.back === 'v' ? 'none' : rl.back; rl.bottom = false;
  }
  var backH = rl.back === 'h' || rl.back === 'hv', backV = rl.back === 'v' || rl.back === 'hv';
  if (!topFull && rl.front === 'none' && rl.back === 'none') warn.push('viršuje nėra nei viršaus, nei juostų — karkasas nesurištas');
  var clearBackK = function (k) { return (inBack(k) || backV || rl.bottom) ? t : 0; };   // shelves stop in front of an inside back / standing back rails
  var unver = []; var U = function (s) { if (unver.indexOf(s) < 0) unver.push(s); };
  var cf = R.confirmat, cm = R.cam;

  /* ---- sections → facades (bottom-up) and drawer runner heights (relative to carcass bottom), column by column */
  var Hz = H - (topFull && o.topOverFacade ? t : (topFull ? 0 : R.facade.zoneGapRails));   // facade zone height
  var runners = [], facades = [], doors = [], shelves = [];
  for (var colN = 0; colN < cols; colN++) (function (col) {
    var secs = (c.sections || []).filter(function (s) { return Math.min(cols - 1, Math.max(0, Math.floor(+s.col || 0))) === col; });
    var lbl = function (si) { return 'sekcija ' + (cols > 1 ? (col + 1) + '.' : '') + (si + 1); };
    var F0 = fx0(col), FW = fx1(col) - fx0(col);
    var sumExp = 0, nFill = 0; secs.forEach(function (s) { if (s.fill) nFill++; else sumExp += Math.max(0, +s.height || 0); });
    var fillH = nFill > 0 ? Math.max(0, Hz - sumExp) / nFill : 0;
    if (sumExp > Hz + 0.5) warn.push((cols > 1 ? 'kolona ' + (col + 1) + ': ' : '') + 'sekcijų aukščių suma (' + sumExp + ') didesnė už fasadų zoną (' + num(Hz) + ')');
    var yCur = 0;
    secs.forEach(function (s, si) {
      var secH = s.fill ? fillH : Math.max(0, +s.height || 0);
      if (s.kind === 'drawers') {
        var n = Math.max(1, Math.round(+s.nDrawers || 1)), sp = splitFronts(secH, n, s.frontH, gap), fbs = [0];
        sp.mods.forEach(function (m) { fbs.push(fbs[fbs.length - 1] + m); });
        if (sp.note) warn.push(lbl(si) + ': ' + sp.note);
        var rt = R.runner[s.hw]; if (!rt) warn.push(lbl(si) + ': bėgeliams „' + s.hw + '" skylių šablono nėra — bėgelių žymės nepridėtos');
        for (var j = 0; j < n; j++) {
          var fb = yCur + fbs[j], fh = sp.mods[j];
          facades.push({ w:FW, h:fh - gap, bottom:fb, x:F0, hw:s.hw, sec:si, idx:j, col:col });
          if (rt) runners.push({ fb:fb, type:s.hw, col:col });
          hw.push({ item:(s.hw || 'Stalčiaus bėgeliai') + ' L=' + (+s.rail || 500), qty:1, unit:'kompl.' });
        }
        if (+s.innerDrawers > 0) warn.push(lbl(si) + ': vidiniai stalčiai dar nepalaikomi');
      } else if (s.kind === 'doors') {
        if (+s.innerDrawers > 0) warn.push(lbl(si) + ': vidiniai stalčiai už durų dar nepalaikomi — nebraižomi ir negręžiami');
        var hingedSec = s.hinge !== 'BE FURNITŪROS';
        if (hingedSec && !o.hinges) warn.push(lbl(si) + ': durys — lankstų skylės išjungtos (gręžiama rankomis)');
        var nd = Math.max(1, Math.round(+s.nDoors || 1)), horiz = s.doorSplit === 'h', hs = s.hingeSide || 'auto';
        var dsp = horiz ? splitFronts(secH, nd, s.frontH, gap) : null, dzs = [0];
        if (dsp) { dsp.mods.forEach(function (m) { dzs.push(dzs[dzs.length - 1] + m); }); if (dsp.note) warn.push(lbl(si) + ': ' + dsp.note); }
        for (var k = 0; k < nd; k++) {
          var dw = horiz ? FW : (FW - (nd - 1)*gap) / nd;
          var dh = horiz ? dsp.mods[k] - gap : secH - gap;
          var dx = horiz ? F0 : F0 + k*(dw + gap);
          var dz = horiz ? yCur + dzs[k] : yCur;
          var hl = horiz ? hs !== 'right' : (hs === 'left' ? true : hs === 'right' ? false : k < nd - 1);   // same rule as the offer app's sketch
          /* hinge heights on the door: catalogue spacing, kept clear of the bottom panel and the top / top rail so the
             mounting plate screws (±plateSpacing/2) land in the free part of the side; cups and plates share these */
          var hr0 = R.hinge, clr = hr0.plateSpacing/2 + hr0.plateD/2 + 3;
          var lo = t + clr - dz, hi = t + Lside - (topFull ? 0 : t) - clr - dz;
          var ys = hingeYs(dh).map(function (y) { return Math.max(lo, Math.min(hi, y)); });
          var fits = !hingedSec || (hingesFit(dh, o.hingeFix === 'press') && ys.every(function (y, q) { return q === 0 || ys[q] - ys[q-1] >= hr0.cupD + 3; }));
          if (hingedSec && o.hinges && !fits) warnOnce('durys ' + num(dw) + '×' + num(dh) + ': per žemos lankstams — lankstų skylės nepridėtos');
          if (hingedSec && o.hinges && fits && hingeYs(dh).some(function (y, q) { return Math.abs(y - ys[q]) > 0.01; })) warnOnce('durys ' + num(dw) + '×' + num(dh) + ': lankstas perkeltas, kad plokštelė nepatektų po viršumi/juosta');
          doors.push({ w:dw, h:dh, x:dx, z:dz, sec:si, hingeLeft:hl, hinged:hingedSec && fits, ys:ys, col:col });
          if (s.hinge && s.hinge !== 'BE FURNITŪROS') hw.push({ item:s.hinge, qty:hingesPerDoor(dh), unit:'vnt.' });
        }
      }
      if (s.kind === 'oven' && +s.shelves > 0) {   // appliance support shelves: niche bottom, then niche top (as in the offer app)
        var nSup = Math.round(+s.shelves);
        if (nSup >= 1 && yCur >= t) shelves.push({ z:yCur, sec:si, fixed:true, oven:true, col:col });
        if (nSup >= 2 && yCur + secH <= t + Lside - t) shelves.push({ z:yCur + secH - t, sec:si, fixed:true, oven:true, col:col });
        if (nSup > 2) warn.push(lbl(si) + ': daugiau nei 2 orkaitės atramos lentynos — pridėtos tik apatinė ir viršutinė');
      } else if ((s.kind === 'doors' || s.kind === 'open') && +s.shelves > 0) {
        var ns = Math.round(+s.shelves), z0 = Math.max(yCur, t), z1 = Math.min(yCur + secH, topFull ? H - t : H - t);
        var manual = s.shelfMode === 'manual' && Array.isArray(s.shelfPos);
        for (var m = 0; m < ns; m++) {
          var zc = z0 + (m + 1)*(z1 - z0)/(ns + 1);                        // shelf centre
          if (manual && +s.shelfPos[m] > 0) zc = Math.max(z0 + t/2, Math.min(z1 - t/2, yCur + (+s.shelfPos[m])));   // offer app: height of the shelf from the section bottom
          shelves.push({ z:zc - t/2, sec:si, fixed:s.shelfAdj === false, col:col });
        }
        if (s.shelfAdj !== false) hw.push({ item:'Lentynų laikikliai', qty:4*ns, unit:'vnt.' });
      }
      yCur += secH;
    });
  })(colN);


  /* ---- joints. Holes in the sides are collected first (side coords: x along the side from its bottom end,
     yf from the front edge) and drilled when the sides are built. Rule for both systems: the part whose END meets
     the other part's FACE carries the edge bores (confirmat pilot Ø5×32, or cam bolt Ø8×34 + cam Ø15 in its face);
     the face gets the confirmat Ø8 through hole, or the Ø8×15 bolt hole and Ø8×12 dowels. */
  var SJ = [], SB = [];     // SJ: holes in the sides' inner face; SB: bores in the sides' back edge
  var sideHole = function (x, yf, d, depth, through, side) { SJ.push({ x:x, yf:yf, d:d, depth:depth || 0, through:!!through, side:side }); };   // side 'L'/'R' only when the two sides differ
  /* ---- joint table: every joint can take its own connector (confirmat | cam | dowel), count and edge distance.
     Defaults are the verified SWOOD patterns; o.joints[key] = { type, n, e } overrides. */
  var J = o.joints || {}, jointsInfo = [], seenJ = {};
  if (J.part) { J = Object.assign({}, J); for (var jk = 1; jk < 4; jk++) ['partB', 'partT'].forEach(function (b) { if (!J[b + jk]) J[b + jk] = J.part; }); }   // projects saved before each partition joint was its own
  var TYPE_LT = { confirmat:'konfirmatai', cam:'ekscentrikai', dowel:'kaiščiai' };
  /* joint lines for the 3D editor: where a joint's connectors sit in the cabinet (x across, y from the front, z up from the
     carcass bottom), the direction its positions are measured in and its length; the right side is the mirror */
  var seams = [], lastJ = {};
  /* a seam shorter or longer than the joint's first use (e.g. a deeper shelf in a column with plaušas) carries the spots drilled on it */
  function at(key, sd, w) { var r = lastJ[key + '|' + w], f = jointsInfo.filter(function (j) { return j.key === key; })[0];
    if (!r || !f || Math.abs(f.w - w) < 0.01) return null; r = r[f.single ? 'L' : sd]; return { type:r.type, pos:r.pos.slice(), dowels:r.dowels.slice() }; }
  function seam(key, o3, d3, w) { [false, true].forEach(function (r) { var sd = r ? 'R' : 'L', q = { key:key, side:sd, o:[r ? W - o3[0] : o3[0], o3[1], o3[2]], d:d3.slice(), w:w }, a = at(key, sd, w); if (a) q.at = a; seams.push(q); }); }
  function seam1(key, side, o3, d3, w) { var q = { key:key, side:side, o:o3.slice(), d:d3.slice(), w:w }, a = at(key, side, w); if (a) q.at = a; seams.push(q); }   // one end only (parts inside a column)
  function lin(w, n, e) { if (n <= 1) return [w/2]; var r = []; for (var i = 0; i < n; i++) r.push(e + (w - 2*e)*i/(n - 1)); return r; }
  function camDowels(pos, w) {
    var off = cm.dowel.offset, d = pos.length >= 2 ? [pos[0] + off, pos[pos.length - 1] - off] : [pos[0] - off, pos[0] + off];
    if (pos.length === 2 && pos[1] - pos[0] < 2*off + 16) d = [];
    return d.filter(function (a) { return a >= 8 && a <= w - 8; });
  }
  function defSpots(w, kind, type) {
    var e, n, pos;
    if (kind === 'long') { pos = [cf.railAlong, w/2, w - cf.railAlong]; return { pos:pos, n:3, e:pos[0], dowels:[] }; }   // along a rail: the verified 3-cam pattern
    if (kind === 'rail') { if (type === 'cam') { pos = [w/2]; return { pos:pos, n:1, e:w/2, dowels:camDowels(pos, w) }; }
      pos = w === 100 ? cf.railFromEdge.slice() : [30, w - 30]; return { pos:pos, n:2, e:pos[0] }; }
    if (kind === 'carc') { e = type === 'cam' ? cm.cam.fromFront : cf.fromFront; pos = [e, w/2, w - e];
      return { pos:pos, n:3, e:e, dowels:type === 'cam' ? [e + cm.dowel.offset, w - e - cm.dowel.offset] : [] }; }
    if (kind === 'back') { e = type === 'cam' ? R.backCam.fromEnd : cm.backFix.fromEdge; pos = [e, w/2, w - e];
      return { pos:pos, n:3, e:e, dowels:type === 'cam' ? (w >= 2*e + 2*cm.dowel.offset + 40 ? [e + cm.dowel.offset, w - e - cm.dowel.offset] : []) : [] }; }
    /* shelf */
    if (type === 'cam') { var ec = cm.cam.fromFront; pos = w >= 2*ec + 100 ? [ec, w/2, w - ec] : [w/2];
      return { pos:pos, n:pos.length, e:pos[0], dowels:pos.length === 3 ? [ec + cm.dowel.offset, w - ec - cm.dowel.offset] : [] }; }
    e = cf.fromFront; pos = w >= 2*e + 80 ? [e, w/2, w - e] : w >= 120 ? [40, w - 40] : [w/2];
    return { pos:pos, n:pos.length, e:pos[0] };
  }
  /* verified on the shop's SWOOD cabinets: carcass bottom/top with confirmats or cams, confirmat rails, back on the back with confirmats */
  var VERIFIED = { bottom:['confirmat', 'cam'], top:['confirmat', 'cam'], railF:['confirmat'], railB:['confirmat'], railV:['confirmat'], railBottom:['confirmat'], back:['confirmat'] };
  /* o.joints[key] = { type, n, e, pos } for both sides, or { L:{…}, R:{…} } when the left and right side differ */
  function joint(key, w, kind, label, dflt) {
    var J0 = J[key] || {}, split = !!(J0.L || J0.R), res = {};
    dflt = dflt || o.joinery;
    ['L', 'R'].forEach(function (sd) { res[sd] = resolve(split ? (J0[sd] || {}) : J0, w, kind, split ? label + ' (' + (sd === 'L' ? 'kairė' : 'dešinė') + ')' : label, dflt); });
    var same = res.L.type === res.R.type && res.L.pos.join() === res.R.pos.join() && res.L.dowels.join() === res.R.dowels.join();
    lastJ[key + '|' + w] = res;
    if (!seenJ[key]) {
      seenJ[key] = 1;
      var side = function (r) { return { type:r.type, pos:r.pos.slice(), dowels:r.dowels.slice(), n:r.n, e:r.e, manual:r.cust, custom:r.type !== dflt || !!r.n || !!r.e || r.cust,
                                        defPos:r.base.pos.slice(), defN:r.base.n, defE:Math.round(r.base.e*10)/10, minGap:r.minGap, minEdge:r.minEdge }; };
      var a = side(res.L), b = side(res.R);
      var single = /^(part[BTFR]\d|backP\d|railVH|railBotB)$/.test(key);   // one joint line, no left / right side
      jointsInfo.push(Object.assign({ key:key, label:label, dflt:dflt, w:w }, a, { custom:a.custom || b.custom || split, split:split && !same && !single, single:single, sides:{ L:a, R:single ? a : b } }));
      [res.L, res.R].forEach(function (r) {
        if ((VERIFIED[key] || []).indexOf(r.type) < 0) U(label + ' (' + TYPE_LT[r.type] + ')');
        else if (r.n || r.e || r.cust) U(label + ': pakeistos vietos');
      });
    }
    return { L:res.L, R:res.R, same:same, type:res.L.type, pos:res.L.pos, dowels:res.L.dowels,
             has:function (t) { return res.L.type === t || res.R.type === t; } };
  }
  function resolve(j, w, kind, label, dflt) {
    var type = TYPE_LT[j.type] ? j.type : dflt;
    var base = defSpots(w, kind, type);
    var n = +j.n > 0 ? Math.round(+j.n) : 0, e = +j.e > 0 ? +j.e : 0, pos = base.pos, dws = base.dowels || [];
    var minGap = type === 'cam' ? 24 : 16, minEdge = type === 'cam' ? 12 : 9;
    var cust = Array.isArray(j.pos) ? j.pos.map(Number).filter(function (a) { return isFinite(a); }) : null;
    if (cust) {   /* connectors placed one by one (3D editor): mm along the joint from its start (front / bottom / back end) */
      var clampN = 0, kept = [];
      cust.map(function (a) { var b = Math.max(minEdge, Math.min(w - minEdge, a)); if (Math.abs(b - a) > 0.05) clampN++; return Math.round(b*10)/10; })
          .sort(function (a, b) { return a - b; })
          .forEach(function (a) { if (!kept.length || a - kept[kept.length - 1] >= minGap - 0.01) kept.push(a); });
      if (clampN) warnOnce(label + ': ' + clampN + ' jungt. buvo per arti krašto — perkelta į ' + num(minEdge) + ' mm nuo krašto, patikrinkite');
      if (kept.length < cust.length) warnOnce(label + ': ' + (cust.length - kept.length) + ' jungt. per arti kitos (mažiau nei ' + minGap + ' mm) — praleista');
      if (!kept.length) warnOnce(label + ': nėra nė vienos jungties — mazgas nesurištas');
      pos = kept; dws = type === 'cam' && kept.length ? camDowels(pos, w) : []; n = 0; e = 0;
    } else if (n || e) {
      var nn = n || base.n, ee = e || base.e;
      if (nn > 1 && !e && base.n === 1) ee = Math.max(minEdge, Math.min(30, w/4));   // one centred cam → spread them out
      ee = Math.max(minEdge, Math.min(ee, w/2));
      var maxN = ee >= w/2 - 0.01 ? 1 : Math.floor((w - 2*ee)/minGap + 1e-9) + 1;
      if (nn > maxN) { warnOnce(label + ': ' + nn + ' jungtys netelpa ' + num(w) + ' mm pločio — sumažinta iki ' + maxN); nn = maxN; }
      pos = lin(w, nn, ee); dws = type === 'cam' ? camDowels(pos, w) : [];
    }
    dws = dws.filter(function (a) { return pos.every(function (q) { return Math.abs(q - a) >= 12; }); });   // keep dowels clear of the bolts
    return { type:type, pos:pos, dowels:dws, n:n, e:e, cust:!!cust, base:base, minGap:minGap, minEdge:minEdge };
  }
  /* a part between the sides, its ends x0 (left) / x1 (right); along(a) maps a position across the end (panel y) to side coords */
  var endShift = { L:0, R:0 };   // how far the last endJoint moved each end's set on a partition (the seam drawn in 3D moves with it)
  function seamS(key, sd, o3, d3, w) { seam1(key, sd, o3.map(function (v, i) { return v + endShift[sd]*d3[i]; }), d3, w); }
  function endJoint(p, L, J2, camFace, along, tl, tr) {   // tl/tr: what the left/right end meets when it is not the cabinet side (a partition)
    endShift = { L:0, R:0 };
    if (!J2.same || tl || tr) { endSide(p, L, J2.L, 'L', camFace, along, tl || 'L'); endSide(p, L, J2.R, 'R', camFace, along, tr || 'R'); return; }
    var jt = J2.L;
    if (jt.type === 'cam') {
      jt.pos.forEach(function (a) {
        hole(p, camFace, cm.cam.fromEdge, a, cm.cam.d, cm.cam.depth); hole(p, camFace, L - cm.cam.fromEdge, a, cm.cam.d, cm.cam.depth);
        edge(p, 'x0', a, cm.bolt.d, cm.bolt.depthEdge); edge(p, 'x1', a, cm.bolt.d, cm.bolt.depthEdge);
        var q = along(a); sideHole(q.x, q.yf, cm.bolt.d, cm.bolt.depthFace);
      });
      jt.dowels.forEach(function (a) {
        edge(p, 'x0', a, cm.dowel.d, cm.dowel.depthEdge); edge(p, 'x1', a, cm.dowel.d, cm.dowel.depthEdge);
        var q = along(a); sideHole(q.x, q.yf, cm.dowel.d, cm.dowel.depthFace);
      });
    } else if (jt.type === 'dowel') {
      jt.pos.forEach(function (a) {
        edge(p, 'x0', a, cm.dowel.d, cm.dowel.depthEdge); edge(p, 'x1', a, cm.dowel.d, cm.dowel.depthEdge);
        var q = along(a); sideHole(q.x, q.yf, cm.dowel.d, cm.dowel.depthFace);
      });
    } else {
      jt.pos.forEach(function (a) {
        edge(p, 'x0', a, cf.pilot.d, cf.pilot.depth); edge(p, 'x1', a, cf.pilot.d, cf.pilot.depth);
        var q = along(a); sideHole(q.x, q.yf, cf.d, 0, true);
      });
    }
  }

  function endSide(p, L, s, sd, camFace, along, tg) {   // one end only: x0 meets the left side, x1 the right side (or a partition: tg)
    var ed = sd === 'L' ? 'x0' : 'x1', cx = sd === 'L' ? cm.cam.fromEdge : L - cm.cam.fromEdge; tg = tg || sd;
    if (typeof tg === 'object') {   /* on a partition: connectors from the two columns must not meet inside it — move this end's set along the joint if they would */
      var opp = tg.f === 'R' ? 'L' : 'R', pts = s.pos.concat(s.dowels || []);
      var clash = function (dl) { return pts.some(function (a) { var b = a + dl; if (b < 9 || b > p.W - 9) return true; var q = along(b);
        return SJ.some(function (j) { return j.side && typeof j.side === 'object' && j.side.p === tg.p && j.side.f === opp && Math.abs(j.x - q.x) < 13 && Math.abs(j.yf - q.yf) < 13; }); }); };
      var cand = [0]; for (var mq = 1; mq <= 20; mq++) cand.push(8*mq, -8*mq);
      var dl = cand.filter(function (d) { return !clash(d); })[0];
      if (dl == null) warnOnce('pertvara ' + (tg.p + 1) + ': jungtys iš abiejų pusių susitinka ir jų nepavyko pastumti — pakeiskite jungtis (Atskirai) arba lentynų aukščius');
      else if (dl) { warnOnce('pertvara ' + (tg.p + 1) + ': jungtys iš dešinės kolonos pastumtos ' + dl + ' mm, kad nesusitiktų su kairės kolonos jungtimis');
        s = { type:s.type, pos:s.pos.map(function (a) { return a + dl; }), dowels:(s.dowels || []).map(function (a) { return a + dl; }) }; endShift[sd] = dl; }
    }
    if (s.type === 'cam') {
      s.pos.forEach(function (a) { hole(p, camFace, cx, a, cm.cam.d, cm.cam.depth); edge(p, ed, a, cm.bolt.d, cm.bolt.depthEdge); var q = along(a); sideHole(q.x, q.yf, cm.bolt.d, cm.bolt.depthFace, false, tg); });
      s.dowels.forEach(function (a) { edge(p, ed, a, cm.dowel.d, cm.dowel.depthEdge); var q = along(a); sideHole(q.x, q.yf, cm.dowel.d, cm.dowel.depthFace, false, tg); });
    } else if (s.type === 'dowel') {
      s.pos.forEach(function (a) { edge(p, ed, a, cm.dowel.d, cm.dowel.depthEdge); var q = along(a); sideHole(q.x, q.yf, cm.dowel.d, cm.dowel.depthFace, false, tg); });
    } else {
      s.pos.forEach(function (a) { edge(p, ed, a, cf.pilot.d, cf.pilot.depth); var q = along(a); sideHole(q.x, q.yf, cf.d, 0, true, tg); });
    }
  }

  /* ---- surišimo juostos */
  var Lr = W - 2*t, railPanels = [], bottomRailHoles = [];
  if (!topFull) {
    var hx = Lside - t/2;   // side x of a flat rail's mid-thickness
    var ra = cf.railAlong;
    /* a standing rail is held to the flat rail above it / the bottom below it with cams: the Ø8 bolt bore in its long edge is
       drilled in place (F=4/F=5), while a Ø5 confirmat pilot there would need the 100 mm rail turned — below the machine minimum */
    /* a rail's long edge (ed) on another part's face: cam in the rail's face A at camY, the other part's hole through put(x, d, depth, through) */
    var longJoint = function (below, ed, camY, s, put) {
      if (s.type === 'cam') {
        s.pos.forEach(function (x) { hole(below, 'A', x, camY, cm.cam.d, cm.cam.depth); edge(below, ed, x, cm.bolt.d, cm.bolt.depthEdge); put(x, cm.bolt.d, cm.bolt.depthFace, false); });
        s.dowels.forEach(function (x) { edge(below, ed, x, cm.dowel.d, cm.dowel.depthEdge); put(x, cm.dowel.d, cm.dowel.depthFace, false); });
      } else if (s.type === 'dowel') s.pos.forEach(function (x) { edge(below, ed, x, cm.dowel.d, cm.dowel.depthEdge); put(x, cm.dowel.d, cm.dowel.depthFace, false); });
      else s.pos.forEach(function (x) { edge(below, ed, x, cf.pilot.d, cf.pilot.depth); put(x, cf.d, 0, true); });
      U('Ø8 skylės ilgame krašte (F=4/F=5)');
    };
    var railRail = function (top, below, yHole) {
      var jv = joint('railVH', Lr, 'long', 'stati juosta ↔ gulsčia', 'cam'); seam1('railVH', 'L', [t, Dside - t/2, zv + rw], X, Lr);
      longJoint(below, 'y1', rw - cm.cam.fromEdge, jv.L, function (x, d, depth, th) { hole(top, 'B', x, yHole, d, depth, th ? { through:true } : null); });
      U('stati juosta prie gulsčios (ekscentrikai)');
    };
    var pF = null, pBH = null, pBV = null;
    if (rl.front === 'h') {
      pF = panel(nm('JUOSTA_PRIEKIS'), 'JUOSTA_PRIEKIS', Lr, rw, t, 'gulscia, viršus viršuje, priekinis kraštas Y=0');
      endJoint(pF, Lr, joint('railF', rw, 'rail', 'priekinė juosta'), 'A', function (a) { return { x:hx, yf:a }; }); seam('railF', [t, 0, H - t/2], Y, rw);
      place(pF, [t, 0, H], X, Y, Z); pF.eb.y0 = eCarc;
    } else if (rl.front === 'v') {
      var zf = H - rw;
      pF = panel(nm('JUOSTA_PRIEKIS'), 'JUOSTA_PRIEKIS', Lr, rw, t, 'stati, vidinė pusė viršuje, apatinis kraštas Y=0');
      endJoint(pF, Lr, joint('railF', rw, 'rail', 'priekinė juosta'), 'A', function (a) { return { x:zf + a - t, yf:t/2 }; }); seam('railF', [t, t/2, zf], Z, rw);
      place(pF, [t, t, zf], X, Z, Y); pF.eb.y0 = eCarc;
    }
    if (backH) {
      pBH = panel(nm('JUOSTA_GALAS_H'), 'JUOSTA_GALAS_H', Lr, rw, t, 'gulscia, viršus viršuje, galinis kraštas Y=0');
      endJoint(pBH, Lr, joint('railB', rw, 'rail', 'galinė juosta'), 'A', function (a) { return { x:hx, yf:Dside - a }; }); seam('railB', [t, Dside, H - t/2], neg(Y), rw);
      place(pBH, [t, Dside, H], X, neg(Y), Z);
    }
    if (backV) {
      var zv = backH ? H - t - rw : H - rw;
      pBV = panel(nm('JUOSTA_GALAS_V'), 'JUOSTA_GALAS_V', Lr, rw, t, 'stati, išorė viršuje, apatinis kraštas Y=0');
      endJoint(pBV, Lr, joint('railV', rw, 'rail', 'stati galinė juosta'), 'A', function (a) { return { x:zv + a - t, yf:Dside - t/2 }; }); seam('railV', [t, Dside - t/2, zv], Z, rw);
      place(pBV, [t, Dside, zv], X, Z, Y);
      if (pBH) railRail(pBH, pBV, t/2);
    }
    if (rl.bottom) {
      var pA = panel(nm('JUOSTA_APACIA_V'), 'JUOSTA_APACIA_V', Lr, rw, t, 'stati, išorė viršuje, apatinis kraštas Y=0');
      endJoint(pA, Lr, joint('railBottom', rw, 'rail', 'apatinė juosta'), 'A', function (a) { return { x:a, yf:Dside - t/2 }; }); seam('railBottom', [t, Dside - t/2, t], Z, rw);
      place(pA, [t, Dside, t], X, Z, Y);
      var jbb = joint('railBotB', Lr, 'long', 'apatinė juosta ↔ dugnas', 'cam'); seam1('railBotB', 'L', [t, Dside - t/2, t], X, Lr);
      longJoint(pA, 'y0', cm.cam.fromEdge, jbb.L, function (x, d, depth, th) { bottomRailHoles.push({ x:x + t, d:d, depth:depth, through:th }); });
      U('apatinė juosta prie dugno (ekscentrikai)');
    }
    [pF, pBH, pBV, pA].forEach(function (p) { if (p) { p.mat = mCarc; railPanels.push(p); } });
  }

  /* ---- back */
  var backPanels = [], backType = null;
  var y0p = rl.front === 'v' ? t : 0, y1p = Dside - ((backV || rl.bottom) ? t : 0), Dp = y1p - y0p, Lp = H - 2*t;   // partitions: depth range, height
  if (backTop) {
    var Hb = topFull ? H - t : H;
    var pk = panel(nm('NUGARA'), 'NUGARA', W, Hb, t, 'išorė viršuje, apatinis kraštas Y=0');
    var jb = joint('back', Lside, 'back', 'nugara', o.backFix === 'cam' ? 'cam' : 'confirmat'); backType = jb.has('confirmat') ? 'confirmat' : jb.type; seam('back', [t/2, Dside, t], Z, Lside);
    var backSide = function (s, bxs, sd) {   // bxs: x of this side's holes in the back; sd undefined = both sides alike
      if (s.type === 'cam') {
        s.pos.forEach(function (x) { sideHole(x, Dside - cm.cam.fromEdge, cm.cam.d, cm.cam.depth, false, sd); SB.push({ pos:x, d:cm.bolt.d, depth:cm.cam.fromEdge, side:sd });
          bxs.forEach(function (bx) { hole(pk, 'B', bx, x + t, cm.bolt.d, cm.bolt.depthFace); }); });
        s.dowels.forEach(function (x) { SB.push({ pos:x, d:cm.dowel.d, depth:cm.dowel.depthEdge, side:sd }); bxs.forEach(function (bx) { hole(pk, 'B', bx, x + t, cm.dowel.d, cm.dowel.depthFace); }); });
        U('Ø8 skylės šonų ilgame krašte (F=4/F=5)');
      } else if (s.type === 'dowel') {
        s.pos.forEach(function (x) { SB.push({ pos:x, d:cm.dowel.d, depth:cm.dowel.depthEdge, side:sd }); bxs.forEach(function (bx) { hole(pk, 'B', bx, x + t, cm.dowel.d, cm.dowel.depthFace); }); });
        U('Ø8 skylės šonų ilgame krašte (F=4/F=5)');
      } else {
        s.pos.forEach(function (x) { bxs.forEach(function (bx) { hole(pk, 'A', bx, x + t, cm.backFix.d, 0, { through:true }); }); SB.push({ pos:x, d:cf.pilot.d, depth:cf.pilot.depth, side:sd }); });
      }
    };
    if (jb.same) backSide(jb.L, [t/2, W - t/2]); else { backSide(jb.L, [t/2], 'L'); backSide(jb.R, [W - t/2], 'R'); }
    for (var kb = 0; kb < cols - 1; kb++) {   // the back is fixed to the partitions' back edges too
      if (y1p === Dside) { var jbp = joint('backP' + (kb + 1), Lp, 'back', 'nugara ↔ pertvara ' + (kb + 1), o.backFix === 'cam' ? 'cam' : 'confirmat'); seam1('backP' + (kb + 1), 'L', [bnd[kb + 1], Dside, t], Z, Lp);
        backSide(jbp.L, [bnd[kb + 1]], { p:kb, f:'R' }); }
      else warnOnce('nugara ant galo: pertvara nesiekia nugaros (stati galinė juosta) — prie pertvaros nepritvirtinta');
    }
    place(pk, [0, D, 0], X, Z, Y); pk.mat = mBack; backPanels.push(pk);
  } else if (anyInside) {
    var Hi = topFull ? H - 2*t : (backH ? H - 2*t : H - t);
    var jbi = joint('back', Hi, 'back', 'nugara viduje'); backType = jbi.has('confirmat') ? 'confirmat' : jbi.type;
    if (cols === 1) {
      var Li = W - 2*t, pi = panel(nm('NUGARA'), 'NUGARA', Li, Hi, t, 'tarp šonų, išorė viršuje, apatinis kraštas Y=0');
      seam('back', [t, Dside - t/2, t], Z, Hi);
      endJoint(pi, Li, jbi, 'A', function (a) { return { x:a, yf:Dside - t/2 }; });
      place(pi, [t, Dside, t], X, Z, Y); pi.mat = mBack; backPanels.push(pi);
    } else for (var kc = 0; kc < cols; kc++) {
      if (!inBack(kc)) continue;
      var Lk = ix1(kc) - ix0(kc), pc = panel(nm('NUGARA' + (kc + 1)), 'NUGARA', Lk, Hi, t, 'kolona ' + (kc + 1) + ', tarp šono/pertvaros, išorė viršuje, apatinis kraštas Y=0');
      endJoint(pc, Lk, jbi, 'A', function (a) { return { x:a, yf:Dside - t/2 }; }, tgL(kc), tgR(kc));
      seamS('back', 'L', [ix0(kc), Dside - t/2, t], Z, Hi); seamS('back', 'R', [ix1(kc), Dside - t/2, t], Z, Hi);
      place(pc, [ix0(kc), Dside, t], X, Z, Y); pc.mat = mBack; backPanels.push(pc);
    }
  }
  /* plaušas (HDF): nailed on the back, no CNC work; neighbouring columns with plaušas share one sheet */
  var hdfPanels = [];
  if (anyHdf && !backTop) {
    var ins = +R.hdf.inset || 0, grp = [];
    colBacks.forEach(function (b, k) { if (b !== 'hdf') return; if (grp.length && Math.abs(grp[grp.length - 1][1] - bnd[k]) < 0.01) grp[grp.length - 1][1] = bnd[k + 1]; else grp.push([bnd[k], bnd[k + 1]]); });
    grp.forEach(function (g, i) {
      var ph = panel(nm('PLAUSAS' + (grp.length > 1 ? i + 1 : '')), 'PLAUSAS', g[1] - g[0] - 2*ins, H - 2*ins, hdfT, 'plaušo nugara — prikalama, CNC nereikia');
      place(ph, [g[0] + ins, D, ins], X, Z, Y); ph.mat = mat.hdf || R.hdf.mat; hdfPanels.push(ph);
    });
    hw.push({ item:'Kabės / vinutės plaušui', qty:1, unit:'kompl.' });
  }

  /* ---- shelves: adjustable ones are drawn and get pins; fixed ones (and oven supports) are joined like a rail */
  var shelfPanels = [];
  shelves.forEach(function (s, i) {
    var p, k = s.col || 0, Lc = ix1(k) - ix0(k), cb = clearBackK(k);
    s.depth = Dside - cb - R.shelf.setback;   // adjustable shelf depth (the pins follow it)
    if (s.fixed) {
      var sb = s.oven ? 0 : R.shelf.setback, dF = Dside - cb - sb;
      p = panel(nm('LENTYNA' + (i + 1)), 'LENTYNA', Lc, dF, t, (s.oven ? 'orkaitės atrama' : 'fiksuota lentyna') + (cols > 1 ? ', kolona ' + (k + 1) : '') + ', viršus viršuje, priekis Y=0');
      var zc = s.z + t/2 - t;   // side x of the shelf's mid-thickness
      endJoint(p, Lc, s.oven ? joint('oven', dF, 'shelf', 'orkaitės atramos') : joint('shelf', dF, 'shelf', 'fiksuotos lentynos'), 'B', function (a) { return { x:zc, yf:sb + a }; }, cols > 1 ? tgL(k) : null, cols > 1 ? tgR(k) : null);
      if (cols === 1) seam(s.oven ? 'oven' : 'shelf', [t, sb, s.z + t/2], Y, dF);
      else { seamS(s.oven ? 'oven' : 'shelf', 'L', [ix0(k), sb, s.z + t/2], Y, dF); seamS(s.oven ? 'oven' : 'shelf', 'R', [ix1(k), sb, s.z + t/2], Y, dF); }
      place(p, [ix0(k), sb, s.z + t], X, Y, Z);
    } else {
      p = panel(nm('LENTYNA' + (i + 1)), 'LENTYNA', Lc - R.shelf.clearW, s.depth, t, 'lentyna' + (cols > 1 ? ', kolona ' + (k + 1) : ''));
      place(p, [ix0(k) + R.shelf.clearW/2, R.shelf.setback, s.z + t], X, Y, Z);
    }
    p.mat = mCarc; p.eb.y0 = eCarc; shelfPanels.push(p);
  });

  /* ---- sides */
  var jBot = joint('bottom', Dside, 'carc', 'dugnas'), jTop = topFull ? joint('top', Dside, 'carc', 'viršus') : null;
  seam('bottom', [t/2, 0, t], Y, Dside); if (topFull) seam('top', [t/2, 0, H - t], Y, Dside);
  var faceJoint = function (p, J2, face, xs, yOff) {   // bottom / top panel: the face the sides stand on (xs[0] left side, xs[1] right)
    xs.forEach(function (x, i) {
      var jt = i === 0 ? J2.L : J2.R;
      if (jt.type === 'cam') { jt.pos.forEach(function (y) { hole(p, face, x, y + yOff, cm.bolt.d, cm.bolt.depthFace); }); jt.dowels.forEach(function (y) { hole(p, face, x, y + yOff, cm.dowel.d, cm.dowel.depthFace); }); }
      else if (jt.type === 'dowel') jt.pos.forEach(function (y) { hole(p, face, x, y + yOff, cm.dowel.d, cm.dowel.depthFace); });
      else jt.pos.forEach(function (y) { hole(p, face, x, y + yOff, cf.d, 0, { through:true }); });
    });
  };
  var mkSide = function (role, right) {
    var p = panel(nm(role), role, Lside, Dside, t, 'vidinė pusė viršuje, apatinis kraštas X=0, priekis ' + (right ? 'Y=DY' : 'Y=0'));
    var Yf = function (y) { return right ? Dside - y : y; };   // mirror for the right side
    [[jBot, 'x0', cm.cam.fromEdge], [jTop, 'x1', Lside - cm.cam.fromEdge]].forEach(function (k) {   // the side's ends sit on the bottom / under the top
      var jt = k[0] && k[0][right ? 'R' : 'L'], ed = k[1], cx = k[2]; if (!jt) return;
      if (jt.type === 'cam') {
        jt.pos.forEach(function (y) { hole(p, 'A', cx, Yf(y), cm.cam.d, cm.cam.depth); edge(p, ed, Yf(y), cm.bolt.d, cm.bolt.depthEdge); });
        jt.dowels.forEach(function (y) { edge(p, ed, Yf(y), cm.dowel.d, cm.dowel.depthEdge); });
      } else if (jt.type === 'dowel') jt.pos.forEach(function (y) { edge(p, ed, Yf(y), cm.dowel.d, cm.dowel.depthEdge); });
      else jt.pos.forEach(function (y) { edge(p, ed, Yf(y), cf.pilot.d, cf.pilot.depth); });
    });
    var mine = function (j) { return !j.side || j.side === (right ? 'R' : 'L'); }, myCol = right ? cols - 1 : 0;
    SJ.forEach(function (j) { if (mine(j)) hole(p, 'A', j.x, Yf(j.yf), j.d, j.depth, j.through ? { through:true } : null); });
    SB.forEach(function (b) { if (mine(b)) edge(p, right ? 'y0' : 'y1', b.pos, b.d, b.depth); });   // back edge: y = Dside on the left side, y = 0 on the right
    if (o.runnerMarks !== false) runners.forEach(function (r) { if (r.col !== myCol) return; var rt = R.runner[r.type]; var x = Math.max(rt.up, r.fb + rt.up - t); rt.marks.forEach(function (m) {
      var hit = p.holes.some(function (g) { return !g.mark && (g.face === 'A' || g.through) && Math.hypot(g.x - x, g.y - Yf(m)) < g.d/2; });   // mark centre inside a joint hole (touching the rim is fine: the verified SWOOD Tandem cabinet does that)
      if (hit) warnOnce('bėgelio ' + r.type + ' žymė (' + num(x + t) + ' mm aukštyje, ' + num(m) + ' nuo priekio) patenka į ekscentriko skylę — bėgelio varžtas kliūs už jungties; patikrinkite (pvz. rinkitės konfirmatus)');
      hole(p, 'A', x, Yf(m), R.legs.markD, R.legs.markDepth, { mark:true }); }); });
    /* mounting plates of the doors hinged on this side (side x = cabinet z − t) */
    if (o.hinges) {
      var hr = R.hinge, nPl = 0;
      doors.forEach(function (d) {
        if (!d.hinged || d.hingeLeft === right || d.col !== myCol) return;
        var atSide = right ? Math.abs(d.x + d.w - fx1(myCol)) < 0.5 : Math.abs(d.x - fx0(myCol)) < 0.5;
        if (!atSide) { warnOnce('durys ' + num(d.w) + '×' + num(d.h) + ': lankstų pusė ne prie šono (reikia pertvaros) — plokštelių skylės nepridėtos'); return; }
        d.ys.forEach(function (yh) {
          var xc = d.z + yh - t;
          [xc - hr.plateSpacing/2, xc + hr.plateSpacing/2].forEach(function (x) {
            var hitP = p.holes.some(function (g) { return (g.face === 'A' || g.through) && Math.hypot(g.x - x, g.y - Yf(hr.plateFromFront)) < (g.d + hr.plateD)/2 + 1.5; });
            if (hitP) warnOnce('lanksto plokštelės skylė (' + num(x + t) + ' mm aukštyje) kliūna už kitos skylės — praleista, patikrinkite');
            else if (x > 5 && x < Lside - 5) { hole(p, 'A', x, Yf(hr.plateFromFront), R.post.markD, R.post.markDepth, { op:'hinge', mark:true }); nPl++; }
            else p.warnings.push('lanksto plokštelės skylė už šono ribų (' + num(x) + ') — praleista');
          });
        });
      });
      if (nPl) p.warnings.push('lankstų plokštelių skylės pagal Blum katalogą — NEPATIKRINTA su SWOOD modeliu');
    }
    /* shelf supports */
    if (o.pins && o.pins !== 'off') {
      var pr = R.pins, nPin = 0;
      shelves.forEach(function (s) {
        if (s.fixed || s.col !== myCol) return;
        var yB = R.shelf.setback + s.depth - pr.fromBack;
        var xc = s.z - pr.below - t, xs = [xc];
        if (o.pins === 'row') for (var k = 1; k <= pr.extra; k++) { xs.push(xc - k*pr.pitch); xs.push(xc + k*pr.pitch); }
        xs.forEach(function (x) {
          if (x < 10 || x > Lside - 10) return;
          [pr.fromFront, yB].forEach(function (y) {
            var hit = p.holes.some(function (g) { return (g.face === 'A' || g.through) && Math.hypot(g.x - x, g.y - Yf(y)) < (g.d + pr.d)/2 + 1.5; });
            if (hit) { warnOnce('lentyna ' + num(s.z + t) + ' mm aukštyje: laikiklio skylė kliūna už kitos skylės (lankstas/bėgelis) — praleista, perkelkite lentyną'); return; }
            hole(p, 'A', x, Yf(y), pr.d, pr.depth, { op:'pin' }); nPin++; });
        });
      });
      if (nPin) p.warnings.push('lentynų laikiklių skylės pagal standartą — NEPATIKRINTA su SWOOD modeliu');
    }
    if (right) place(p, [W - t, Dside, t], Z, neg(Y), neg(X)); else place(p, [t, 0, t], Z, Y, X);
    p.mat = mCarc; if (right) p.eb.y1 = eCarc; else p.eb.y0 = eCarc;   // front edge
    return p;
  };
  out.push(mkSide('KAIRE', false)); out.push(mkSide('DESINE', true));

  /* ---- partitions: stand on the bottom, under the top or the flat rails; face B looks into column k, face A into column k+1 */
  /* partition joints, each its own (and editable in 3D): bottom, full top or each flat rail */
  var jPB = [], jPT = [];
  var endBores = function (p, ed, cx, s, yOf, n) {   // the partition's end ed: bores (and cams in face A at cx); positions outside the partition are left out
    var ok = function (y) { if (y > 8 && y < n - 8) return true; warnOnce('pertvaros jungtis už pertvaros ribų — praleista, patikrinkite vietas'); return false; };
    if (s.type === 'cam') {
      s.pos.forEach(function (a) { var y = yOf(a); if (ok(y)) { hole(p, 'A', cx, y, cm.cam.d, cm.cam.depth); edge(p, ed, y, cm.bolt.d, cm.bolt.depthEdge); } });
      s.dowels.forEach(function (a) { var y = yOf(a); if (ok(y)) edge(p, ed, y, cm.dowel.d, cm.dowel.depthEdge); });
    } else if (s.type === 'dowel') s.pos.forEach(function (a) { var y = yOf(a); if (ok(y)) edge(p, ed, y, cm.dowel.d, cm.dowel.depthEdge); });
    else s.pos.forEach(function (a) { var y = yOf(a); if (ok(y)) edge(p, ed, y, cf.pilot.d, cf.pilot.depth); });
  };
  var railFace = function (rp, x, s, keep) {   // the rail's lower face B gets the partition's holes (positions = rail y)
    var put = function (a, d, depth, th) { if (keep(a)) hole(rp, 'B', x, a, d, depth, th ? { through:true } : null); };
    if (s.type === 'cam') { s.pos.forEach(function (a) { put(a, cm.bolt.d, cm.bolt.depthFace); }); s.dowels.forEach(function (a) { put(a, cm.dowel.d, cm.dowel.depthFace); }); }
    else if (s.type === 'dowel') s.pos.forEach(function (a) { put(a, cm.dowel.d, cm.dowel.depthFace); });
    else s.pos.forEach(function (a) { put(a, cf.d, 0, true); });
  };
  var mkPart = function (k) {
    var xc = bnd[k + 1], p = panel(nm('PERTVARA' + (k + 1)), 'PERTVARA', Lp, Dp, t, 'pertvara ' + (k + 1) + ', dešinė pusė viršuje, apatinis kraštas X=0, priekis Y=0'), n1 = k + 1;
    jPB[k] = joint('partB' + n1, Dp, 'carc', 'pertvara ' + n1 + ' ↔ dugnas'); seam1('partB' + n1, 'L', [xc, y0p, t], Y, Dp);
    endBores(p, 'x0', cm.cam.fromEdge, jPB[k].L, function (a) { return a; }, Dp);
    if (topFull) {
      jPT[k] = joint('partT' + n1, Dp, 'carc', 'pertvara ' + n1 + ' ↔ viršus'); seam1('partT' + n1, 'L', [xc, y0p, H - t], Y, Dp);
      endBores(p, 'x1', Lp - cm.cam.fromEdge, jPT[k].L, function (a) { return a; }, Dp);
    } else {   // under the flat rails: each rail is its own joint, positions across the rail
      var inP = function (y) { return y > 8 && y < Dp - 8; };
      if (rl.front === 'h' && pF) { var jf = joint('partF' + n1, rw, 'rail', 'priekinė juosta ↔ pertvara ' + n1); seam1('partF' + n1, 'L', [xc, 0, H - t], Y, rw);
        endBores(p, 'x1', Lp - cm.cam.fromEdge, jf.L, function (a) { return a - y0p; }, Dp); railFace(pF, xc - t, jf.L, function (a) { return inP(a - y0p); }); }
      if (backH && pBH) { var jr = joint('partR' + n1, rw, 'rail', 'galinė juosta ↔ pertvara ' + n1); seam1('partR' + n1, 'L', [xc, Dside, H - t], neg(Y), rw);
        endBores(p, 'x1', Lp - cm.cam.fromEdge, jr.L, function (a) { return Dside - a - y0p; }, Dp); railFace(pBH, xc - t, jr.L, function (a) { return inP(Dside - a - y0p); }); }
      if (!(rl.front === 'h' && pF) && !(backH && pBH)) warnOnce('pertvara viršuje nepritvirtinta — reikia gulsčios juostos arba pilno viršaus');
    }
    var forMe = function (j) { return j.side && typeof j.side === 'object' && j.side.p === k; };
    SJ.forEach(function (j) { if (forMe(j)) hole(p, j.side.f === 'R' ? 'A' : 'B', j.x, j.yf - y0p, j.d, j.depth, j.through ? { through:true } : null); });
    SB.forEach(function (b) { if (forMe(b)) edge(p, 'y1', b.pos, b.d, b.depth); });
    /* runners, hinge plates and shelf pins of the two columns, each on its own face; pins on face A sit 10 mm further in so they never meet the ones from face B */
    [['B', k, false], ['A', k + 1, true]].forEach(function (fc) {
      var face = fc[0], colk = fc[1], isA = fc[2];
      var meets = function (x, y, d, depth) { return p.holes.some(function (g) { return g.face !== face && !g.through && !g.mark && Math.hypot(g.x - x, g.y - y) < (g.d + d)/2 + 0.5 && g.depth + depth > t - 2; }); };   // a blind hole from the other face
      var free = function (x, y, d, depth) { return !p.holes.some(function (g) { return (g.face === face || g.through) && Math.hypot(g.x - x, g.y - y) < (g.d + d)/2 + 1.5; }) && !meets(x, y, d, depth || 0); };
      if (o.runnerMarks !== false) runners.forEach(function (r) { if (r.col !== colk) return; var rt = R.runner[r.type], x = Math.max(rt.up, r.fb + rt.up - t);
        rt.marks.forEach(function (m) { if (m - y0p > 0 && m - y0p < Dp) hole(p, face, x, m - y0p, R.legs.markD, R.legs.markDepth, { mark:true }); }); });
      if (o.hinges) doors.forEach(function (d) {
        if (!d.hinged || d.col !== colk || d.hingeLeft !== isA) return;   // face B: doors of column k hinged on the right; face A: column k+1 hinged on the left
        if (isA ? Math.abs(d.x - fx0(colk)) > 0.5 : Math.abs(d.x + d.w - fx1(colk)) > 0.5) { warnOnce('durys ' + num(d.w) + '×' + num(d.h) + ': lankstų pusė ne prie pertvaros — plokštelių skylės nepridėtos'); return; }
        var hr = R.hinge, y = hr.plateFromFront - y0p;
        /* doors hinged on both faces of a partition at the same heights: move this door's hinges (cups and plates together) */
        var plates = function (ys) { var o2 = []; ys.forEach(function (yh) { var xc2 = d.z + yh - t; o2.push(xc2 - hr.plateSpacing/2, xc2 + hr.plateSpacing/2); }); return o2; };
        var okYs = function (ys) { return ys.every(function (yh) { return yh >= hr.cupD/2 + 3 && yh <= d.h - hr.cupD/2 - 3; }) && plates(ys).every(function (x) { return x > 5 && x < Lp - 5 && !meets(x, y, hr.plateD, hr.plateDepth); }); };
        if (!okYs(d.ys)) { var sh2 = [40, -40, 64, -64, 96, -96].filter(function (dd) { return okYs(d.ys.map(function (v) { return v + dd; })); })[0];
          if (sh2 != null) { d.ys = d.ys.map(function (v) { return v + sh2; }); warnOnce('durys ' + num(d.w) + '×' + num(d.h) + ': lankstai pastumti ' + sh2 + ' mm, kad plokštelės nesusitiktų su kitos pertvaros pusės plokštelėmis — patikrinkite'); } }
        d.ys.forEach(function (yh) { var xc2 = d.z + yh - t; [xc2 - hr.plateSpacing/2, xc2 + hr.plateSpacing/2].forEach(function (x) {
          if (!free(x, y, hr.plateD, hr.plateDepth)) { warnOnce('lanksto plokštelės skylė pertvaroje (' + num(x + t) + ' mm aukštyje) kliūna už kitos skylės — praleista, patikrinkite'); return; }
          if (x > 5 && x < Lp - 5) hole(p, face, x, y, R.post.markD, R.post.markDepth, { op:'hinge', mark:true }); }); });
      });
      if (o.pins && o.pins !== 'off') shelves.forEach(function (s) {
        if (s.fixed || s.col !== colk) return;
        var pr = R.pins, xc3 = s.z - pr.below - t, xs = [xc3], sh = isA ? 10 : 0;
        if (o.pins === 'row') for (var q = 1; q <= pr.extra; q++) { xs.push(xc3 - q*pr.pitch); xs.push(xc3 + q*pr.pitch); }
        xs.forEach(function (x) { if (x < 10 || x > Lp - 10) return;
          [pr.fromFront + sh, R.shelf.setback + s.depth - pr.fromBack - sh].forEach(function (yf) { var y = yf - y0p;
            if (!free(x, y, pr.d, pr.depth)) { warnOnce('lentyna ' + num(s.z + t) + ' mm aukštyje: laikiklio skylė pertvaroje kliūna už kitos skylės — praleista, perkelkite lentyną'); return; }
            hole(p, face, x, y, pr.d, pr.depth, { op:'pin' }); }); });
      });
    });
    /* blind holes from both faces must not meet inside the 18 mm board */
    var hsA = p.holes.filter(function (h) { return h.face === 'A' && !h.through && !h.mark; }), hsB = p.holes.filter(function (h) { return h.face === 'B' && !h.through && !h.mark; });
    hsA.forEach(function (a) { hsB.forEach(function (b) { if (Math.hypot(a.x - b.x, a.y - b.y) < (a.d + b.d)/2 + 0.5 && a.depth + b.depth > t - 2) warnOnce(p.name.replace(/^.*_/, '') + ': skylės iš abiejų pusių susitinka (' + num(a.x + t) + ' mm aukštyje) — pakeiskite lentynų / durų / jungčių vietas (NEPROGRAMUOTA teisingai)'); }); });
    place(p, [xc + t/2, y0p, t], Z, Y, X); p.mat = mCarc; p.eb.y0 = eCarc;
    return p;
  };
  for (var kp = 0; kp < cols - 1; kp++) out.push(mkPart(kp));

  /* ---- legs: o.legsX = legs in a row across the width (2–6, or 'parts' = at both sides and under every partition), o.legsY = rows (2 or 3).
     A leg's plate (Ø60) must not cover a connector head on the underside: such a leg moves sideways, and the worker is told. */
  var legPos = null;
  function legSpots(bp) {
    if (legPos) return legPos;
    var fs = R.legs.fromSide, nx = o.legsX === 'parts' ? 'parts' : Math.max(2, Math.min(6, Math.round(+o.legsX) || 2)), ny = +o.legsY === 3 ? 3 : 2, xs = [];
    if (nx === 'parts') { xs.push(fs); for (var q = 1; q < cols; q++) xs.push(bnd[q]); xs.push(W - fs); }
    else for (var q2 = 0; q2 < nx; q2++) xs.push(fs + (W - 2*fs) * q2 / (nx - 1));
    var yf = R.legs.fromFront, yb = Dside - R.legs.fromBack, ys = ny === 3 ? [yf, (yf + yb) / 2, yb] : [yf, yb];
    var heads = bp ? bp.holes.filter(function (h) { return !h.mark && (h.through || h.face === 'B'); }) : [];
    var free = function (x, y) { return x >= 35 && x <= W - 35 && heads.every(function (h) { return Math.hypot(h.x - x, h.y - y) >= 30 + h.d/2 + 4; }); };
    legPos = []; var moved = 0;
    var shift = function (x0, rows) { for (var m = 0; m <= 12; m++) for (var sg = 0; sg < 2; sg++) { var d = sg ? -m * 8 : m * 8; if (rows.every(function (y) { return free(x0 + d, y); })) return d; } return null; };
    xs.forEach(function (x0) {
      var dAll = shift(x0, ys);   // the whole line of legs front to back moves together, so they stay in a line
      ys.forEach(function (y) {
        var dx = dAll !== null ? dAll : shift(x0, [y]);
        if (dx === null) { dx = 0; warnOnce('kojelė ' + num(x0) + ' mm: plokštelė uždengia jungties galvutę dugno apačioje — patikrinkite'); }
        else if (dx) moved++;
        legPos.push({ x:x0 + dx, y:y });
      });
    });
    for (var g = 1; g < xs.length; g++) if (xs[g] - xs[g - 1] < 70) { warnOnce('kojelės per tankiai: tarp kojelių mažiau nei 70 mm — sumažinkite kojelių skaičių eilėje'); break; }
    if (moved) warnOnce('kojelės: ' + moved + ' vnt. pastumtos šonu, kad plokštelė neuždengtų jungčių dugno apačioje');
    return legPos;
  }
  /* ---- bottom (face A = top face, Y from front) */
  (function () {
    var p = panel(nm('DUGNAS'), 'DUGNAS', W, Dside, t, 'viršus viršuje, priekis Y=0');
    faceJoint(p, jBot, 'A', [t/2, W - t/2], 0);
    for (var kq = 0; kq < cols - 1; kq++) faceJoint(p, { L:jPB[kq].L, R:jPB[kq].L }, 'A', [bnd[kq + 1]], y0p);
    bottomRailHoles.forEach(function (h) { hole(p, 'A', h.x, Dside - t/2, h.d, h.depth, h.through ? { through:true } : null); });   // the standing bottom back rail
    if (o.legs) legSpots(p).forEach(function (l) { legMarks(p, 'B', l.x, l.y); });
    place(p, [0, 0, t], X, Y, Z); p.mat = mCarc; p.eb.y0 = eCarc;
    out.push(p);
  })();

  /* ---- top: full panel or rails */
  if (topFull) {
    var off = o.topOverFacade ? fT : 0, Dtop = Dside + off + (backTop ? tb : 0);   // top covers a solid back on the back too (not the plaušas)
    var pt = panel(nm('VIRSUS'), 'VIRSUS', W, Dtop, t, 'apačia viršuje (gręžiama iš apačios), priekis Y=0');
    faceJoint(pt, jTop, 'B', [t/2, W - t/2], off);
    for (var kt = 0; kt < cols - 1; kt++) faceJoint(pt, { L:jPT[kt].L, R:jPT[kt].L }, 'B', [bnd[kt + 1]], off + y0p);
    place(pt, [0, -off, H], X, Y, Z); pt.mat = mCarc; pt.eb.y0 = eCarc;
    out.push(pt);
  } else railPanels.forEach(function (p) { out.push(p); });

  backPanels.forEach(function (p) { out.push(p); });
  hdfPanels.forEach(function (p) { out.push(p); });

  /* ---- facades (drawer fronts) */
  facades.forEach(function (f, i) {
    var p = panel(nm('FASADAS' + (i + 1)), 'FASADAS', f.w, f.h, fT, 'galinė (vidinė) pusė viršuje, apatinis kraštas Y=0');
    var rt = R.runner[f.hw];
    if (rt && rt.facade && o.tbFront !== 'off') {
      var fc = rt.facade, mk = o.tbFront === 'mark';
      var fh = function (x, y) { if (mk) hole(p, 'A', x, y, R.legs.markD, R.legs.markDepth, { mark:true }); else hole(p, 'A', x, y, fc.d, fc.depth); };
      [fc.fromSide, f.w - fc.fromSide].forEach(function (x) { fc.ys.forEach(function (y) { fh(x, y); }); if (f.h >= 250) fh(x, fc.yGallery); });
      if (f.h >= 250) p.warnings.push('TANDEMBOX viršutinė tvirtinimo skylė 225.5 — patikrinti pagal Blum lentelę šiam stalčiaus aukščiui');
    }
    place(p, [f.x, 0, f.bottom], X, Z, Y); p.mat = mFac; p.eb = { y0:eFac, y1:eFac, x0:eFac, x1:eFac };
    out.push(p);
  });

  /* ---- doors */
  doors.forEach(function (d, i) {
    var drill = o.hinges && d.hinged;
    var p = panel(nm('DURYS' + (i + 1)), 'DURYS', d.w, d.h, fT, drill ? 'vidinė pusė viršuje, apatinis kraštas Y=0, lankstai ' + (d.hingeLeft ? 'X=0' : 'X=DX') + ' pusėje' : 'durys be lankstų skylių');
    if (drill) {
      var hr = R.hinge, xc = d.hingeLeft ? hr.cupFromEdge : d.w - hr.cupFromEdge, dir = d.hingeLeft ? 1 : -1;
      d.ys.forEach(function (y) {
        hole(p, 'A', xc, y, hr.cupD, hr.cupDepth, { op:'hinge' });
        if (o.hingeFix === 'press') [-1, 1].forEach(function (sg) { hole(p, 'A', xc + dir*hr.dowelOffset, y + sg*hr.dowelSpacing/2, hr.dowelD, hr.dowelDepth, { op:'hinge' }); });
      });
      p.warnings.push('lankstų puodelių skylės pagal Blum katalogą — NEPATIKRINTA su SWOOD modeliu');
    }
    place(p, [d.x, 0, d.z], X, Z, Y); p.mat = mFac; p.eb = { y0:eFac, y1:eFac, x0:eFac, x1:eFac };
    p.hingeLeft = d.hingeLeft;   // for drawings (room view): which side the door opens from
    out.push(p);
  });
  shelfPanels.forEach(function (p) { out.push(p); });

  /* ---- legs (drawn under the bottom; only marks are drilled) */
  var legs = [];
  if (o.legs) legSpots(null).forEach(function (l) { legs.push({ x:l.x, y:l.y, d:R.legs.drawD, h:+c.legH || 100 }); });
  if (legs.length) hw.push({ item:'Kojelės', qty:legs.length, unit:'vnt.' });

  out.forEach(orient);
  out.forEach(rightHanded);
  /* doors: say on which edge the hinge cups ended up, after the part was turned */
  out.forEach(function (p) {
    if (p.role !== 'DURYS') return;
    var cups = p.holes.filter(function (h) { return h.op === 'hinge' && h.d === R.hinge.cupD; }); if (!cups.length) return;
    var c0 = cups[0], e = Math.abs(c0.x - R.hinge.cupFromEdge) < 0.01 ? 'X=0' : Math.abs(c0.x - (p.L - R.hinge.cupFromEdge)) < 0.01 ? 'X=DX' : Math.abs(c0.y - R.hinge.cupFromEdge) < 0.01 ? 'Y=0' : 'Y=DY';
    p.note = p.note.replace(/lankstai X=D?X?0? ?pusėje/, 'lankstai ' + e + ' krašte');
  });
  out.forEach(function (p) { p.cab = idx + 1; p.short = (idx + 1) + '-' + p.role.replace(/_/g, '-') + (/\d$/.test(p.name) ? p.name.match(/\d+$/)[0] : ''); });
  /* holes that run into each other (possible with custom joints): report, never silently drill */
  out.forEach(function (p) {
    var hs = p.holes;
    for (var i = 0; i < hs.length; i++) for (var k = i + 1; k < hs.length; k++) {
      var a = hs[i], b = hs[k]; if (a.mark || b.mark || a.op || b.op) continue;
      if (!(a.face === b.face || a.through || b.through)) continue;
      if (Math.hypot(a.x - b.x, a.y - b.y) < (a.d + b.d)/2 + 0.5) { warnOnce(p.short + ': jungčių skylės persidengia (' + num(a.x) + ', ' + num(a.y) + ') — pakeiskite jungčių kiekį ar atstumą'); break; }
    }
    var es = p.edges;
    for (var i2 = 0; i2 < es.length; i2++) for (var k2 = i2 + 1; k2 < es.length; k2++)
      if (es[i2].edge === es[k2].edge && Math.abs(es[i2].pos - es[k2].pos) < (es[i2].d + es[k2].d)/2 + 0.5) { warnOnce(p.short + ': krašto skylės persidengia (' + num(es[i2].pos) + ') — pakeiskite jungčių kiekį ar atstumą'); break; }
  });
  /* constructions whose 5 mm long-edge holes cannot be turned on the machine: say what to change */
  if (backTop && backType === 'confirmat' && Lside > R.machine.maxY) warn.push('nugaros konfirmatų Ø5 skylės šonų gale negali būti gręžiamos CNC (šonas ' + num(Lside) + ' mm > ' + R.machine.maxY + ') — nugarai pasirinkite ekscentrikus arba kaiščius');
  if (anyInside && backType === 'confirmat' && backPanels.some(function (bp) { return Math.max(bp.L, bp.W) > R.machine.maxY && bp.edges.some(function (e) { return (e.edge === 'y0' || e.edge === 'y1') && e.d === cf.pilot.d; }); })) warn.push('nugaros viduje Ø5 skylės ilguose kraštuose negali būti gręžiamos CNC (> ' + R.machine.maxY + ' mm) — nugarai pasirinkite ekscentrikus arba kaiščius');
  if (unver.length) warn.push('naujos jungtys, dar nepatikrintos su SWOOD modeliu: ' + unver.join(', ') + ' — patikrinkite pirmą gaminį');
  hardwareFromHoles(out, o, hw);
  return { panels:out, warnings:warn, hardware:mergeHw(hw), legs:legs, joints:jointsInfo, seams:seams, dims:{ W:W, H:H, D:D, t:t } };
}

/* fixings counted from the drillings themselves */
function hardwareFromHoles(panels, o, hw) {
  var cams = 0, dowels = 0, conf = 0;
  panels.forEach(function (p) {
    p.holes.forEach(function (h) { if (h.d === 15 && !h.mark) cams++; if (h.through && h.d === 8) conf++; });
    p.edges.forEach(function (e) { if (e.d === 8 && e.depth === R.cam.dowel.depthEdge) dowels++; });
  });
  if (cams) { hw.push({ item:'Ekscentrikai (Minifix 15)', qty:cams, unit:'vnt.' }); hw.push({ item:'Ekscentrikų varžtai', qty:cams, unit:'vnt.' }); }
  if (dowels) hw.push({ item:'Kaiščiai 8×30', qty:dowels, unit:'vnt.' });
  if (conf) hw.push({ item:'Konfirmatai 7×50', qty:conf, unit:'vnt.' });
}
function mergeHw(list) {
  var m = {}, order = [];
  list.forEach(function (h) { if (!m[h.item]) { m[h.item] = Object.assign({}, h); order.push(h.item); } else m[h.item].qty += h.qty; });
  return order.map(function (k) { return m[k]; });
}

/* ----------------------------------------------------------------- XXL writer */
var num = function (v) { v = Math.round(v*1e6)/1e6; return Number.isInteger(v) ? String(v) : String(v).replace(/0+$/, ''); };
var LT = { 'ą':'a','č':'c','ę':'e','ė':'e','į':'i','š':'s','ų':'u','ū':'u','ž':'z','Ą':'A','Č':'C','Ę':'E','Ė':'E','Į':'I','Š':'S','Ų':'U','Ū':'U','Ž':'Z','—':'-','–':'-','×':'x','„':'"','“':'"','°':' deg' };
function ascii(s) { return String(s).replace(/[^\x00-\x7F]/g, function (ch) { return LT[ch] !== undefined ? LT[ch] : '?'; }); }

function programs(p) {
  var DX = p.L, DY = p.W, DZ = p.T; var w = [], M = R.machine;
  var cnt = function (f) { return p.holes.filter(function (h) { return h.face === f && !h.through; }).length; };
  var up1 = cnt('B') > cnt('A') ? 'B' : 'A', up2 = up1 === 'A' ? 'B' : 'A';
  var need2 = cnt(up2) > 0;
  var mach = function (h, up) { return { x:h.x, y:(up === 'A') ? h.y : DY - h.y }; };   // all holes are given as seen from face A; B up mirrors Y
  var isLong = function (e) { return e.edge === 'y0' || e.edge === 'y1'; };
  var rotE = p.edges.filter(function (e) { return isLong(e) && R.drills.yEdges.indexOf(e.d) < 0; });   // long-edge bores the front/back spindles cannot drill
  var bores = function (up) {
    var out = [];
    p.holes.forEach(function (h) {
      var isUp = h.face === up;
      if (!(h.through && up === up1) && !isUp) return;
      var m = mach(h, up);
      if (R.drills.top.indexOf(h.d) < 0) { w.push(p.name + ': ø' + h.d + ' skylė (' + num(m.x) + ',' + num(m.y) + ') — tokio grąžto galvoje nėra, NEPROGRAMUOTA'); return; }
      if (h.through && R.drills.through.indexOf(h.d) < 0) w.push(p.name + ': kiaurai ø' + h.d + ' — kiauro grąžto nėra');
      if (h.mark) { out.push({ F:1, X:m.x, Y:m.y, Z:-R.post.markDepth, D:R.post.markD, N:'L', sx:m.x }); return; }   // a marking: always as the post makes it
      out.push({ F:1, X:m.x, Y:m.y, Z:h.through ? -(DZ + R.through_extra) : -h.depth, D:h.d, N:h.through ? 'L' : 'P', sx:m.x });
    });
    if (up === up1) p.edges.forEach(function (e) {
      if (rotE.indexOf(e) >= 0) return;                     // → turned program
      var F, Xp, Yp, sx;
      var yUp = function (y) { return (up === 'A') ? y : DY - y; };
      if (e.edge === 'x0') { F = 3; Xp = DZ/2; Yp = yUp(e.pos); sx = e.depth; }
      else if (e.edge === 'x1') { F = 2; Xp = DZ/2; Yp = yUp(e.pos); sx = DX - e.depth; }
      else { F = ((e.edge === 'y0') === (up === 'A')) ? 4 : 5; Xp = e.pos; Yp = DZ/2; sx = e.pos; }
      var ok = (F === 2 || F === 3) ? R.drills.xEnds.indexOf(e.d) >= 0 : R.drills.yEdges.indexOf(e.d) >= 0;
      if (!ok) { w.push(p.name + ': ø' + e.d + ' krašto skylė (' + e.edge + ', ' + num(e.pos) + ') — šiam kraštui grąžto nėra, NEPROGRAMUOTA'); return; }
      out.push({ F:F, X:Xp, Y:Yp, Z:-Math.min(e.depth, R.post.edgeMaxZ), D:e.d, N:'P', sx:sx });   // horizontal bores stop at the post's maximum
    });
    var g = function (b) { return b.F === 3 ? -1 : b.F === 2 ? DX + 1 : b.X; };   // post order: left end, top face by X, right end
    out.sort(function (a, b) { return (g(a) - g(b)) || (a.Y - b.Y) || (a.X - b.X); });
    return out;
  };
  /* turned program (as step2xxl): same face up as 1OP, panel turned 90° counter-clockwise seen from above —
     the front edge (machine Y=0 in 1OP) becomes the left end X=0, the back edge the right end; new Y = DX − x */
  var rotBores = function () {
    var out = [];
    rotE.forEach(function (e) {
      var front = (e.edge === 'y0') === (up1 === 'A');
      if (R.drills.xEnds.indexOf(e.d) < 0) { w.push(p.name + ': ø' + e.d + ' krašto skylė — grąžto nėra, NEPROGRAMUOTA'); return; }
      out.push({ F:front ? 3 : 2, X:DZ/2, Y:DX - e.pos, Z:-Math.min(e.depth, R.post.edgeMaxZ), D:e.d, N:'P', sx:front ? e.depth : DY - e.depth });
    });
    out.sort(function (a, b) { return (a.sx - b.sx) || (a.Y - b.Y); });
    return out;
  };
  var faceTxt = function (up) { return up === 'A' ? '' : ' -- THIS PROGRAM DRILLS THE OTHER FACE: panel turned over about X (long edge stays, Y mirrored)'; };
  var text = function (bl, op, kind, up) {
    var dx = kind === 'rot' ? DY : DX, dy = kind === 'rot' ? DX : DY;
    var L = ['H DX=' + num(dx) + ' DY=' + num(dy) + ' DZ=' + num(DZ) + ' BX=0 BY=0 BZ=21 -EH T=0 *MM /"DEF" R=1 V=0',
      '; Machine Type:  ZapPZmN', ';Ensemble : ', ';Piece : ', ';Ref : ', ';Fichier : ' + p.name + '_' + op + 'OP', ';** Date codage : db-kurejas'];
    if (kind === 'flip' && op === 2) L.push('; 2OP: panel turned over about the X axis after 1OP (long edge stays in place, Y is mirrored)');
    if (kind === 'rot') L.push('; ' + op + 'OP: ' + (op > 1 ? 'same face up as 1OP, ' : '') + 'panel ROTATED 90 deg counter-clockwise - the front edge (Y=0 of the POSITION below) becomes the left end (X=0), long side along Y');
    if (p.note) L.push('; POSITION (1OP): ' + p.note + (kind === 'rot' ? '' : faceTxt(up)));
    if (bl.length) { L.push('; ------ BP_SCM_DRILLING_BLOCK'); bl.forEach(function (b) { L.push(' XBO X=' + num(b.X) + ' Y=' + num(b.Y) + ' Z=' + num(b.Z) + ' D=' + num(b.D) + ' N="' + b.N + '" F=' + b.F + ' R=1#'); }); }
    L.push(';**********************************************************', '.END', ';**********************************************************', ';FINEPROG');
    return ascii(L.join('\r\n') + '\r\n');
  };
  var res = [], b1 = bores(up1), b2 = need2 ? bores(up2) : [], br = [];
  if (rotE.length) {
    if (DX > M.maxY + 1e-6) w.push(p.name + ': ' + rotE.length + ' ø' + rotE[0].d + ' skylės ilgame krašte — pasukti 90° negalima (ilgis ' + num(DX) + ' > ' + M.maxY + ' mm), NEPROGRAMUOTA');
    else { br = rotBores(); if (br.length && DY < M.minX) w.push(p.name + ': pasuktoje programoje X ilgis tik ' + num(DY) + ' mm (staklių min. ' + M.minX + ') — patikrinkite prispaudimą'); }
  }
  if (b1.length || b2.length || br.length) {
    if (DY > M.maxY + 1e-6) w.push(p.name + ': plotis ' + num(DY) + ' mm > ' + M.maxY + ' — netelpa į stakles, NEPROGRAMUOTA'); 
    if (DX > M.maxX + 1e-6) w.push(p.name + ': ilgis ' + num(DX) + ' mm > ' + M.maxX + ' — netelpa į stakles, NEPROGRAMUOTA');
  }
  var n = 0, add = function (bl, kind, up) { n++; res.push({ file:p.name + '_' + n + 'OP.XXL', id:p.name + '_' + n + 'OP', text:text(bl, n, kind, up), n:bl.length, up:up, kind:kind }); };
  if (b1.length) add(b1, 'main', up1);
  if (b2.length) add(b2, 'flip', up2);
  if (br.length) add(br, 'rot', up1);
  return { files:res, warnings:w.concat(p.warnings) };
}

var api = { R:R, DRAWER_HW:DRAWER_HW, DOOR_HW:DOOR_HW, newCabinet:newCabinet, newSection:newSection, cncDefaults:cncDefaults,
            buildCabinet:buildCabinet, programs:programs, num:num, ascii:ascii, safeName:safeName, hingesPerDoor:hingesPerDoor,
            hingeYs:hingeYs, hingesFit:hingesFit, setRules:setRules, splitFronts:splitFronts };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBEngine = api;
})(typeof window !== 'undefined' ? window : this);
