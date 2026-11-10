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
           bolt:{d:8, depthFace:15},                           // bolt hole in bottom/top face
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
            plateD:5, plateDepth:12, plateFromFront:37, plateSpacing:32 },   // mounting plate screws in the side
  pins:   { d:5, depth:12, fromFront:37, fromBack:30, below:3, pitch:32, extra:2 },   // shelf supports in the sides
  backCam: { fromEnd:80 },                       // cams fixing a back: first/last 80 from the ends (clear of the corner cams)
  through_extra: 6.559,
  /* boring head as equipped (Maestro StartechCNPlus .atrx/.cfgx): top 5/8/15/35, through 5/8, X ends 5/8, long edges 8.
     5 mm long-edge bores go to a separate program with the panel turned 90° (as step2xxl), panels up to machine.maxY. */
  drills: { top:[5,8,15,35], through:[5,8], xEnds:[5,8], yEdges:[8], edgeMax:35 },
  machine: { maxX:3050, maxY:900, minX:200, minY:80 }
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
  c.cnc = Object.assign({ joinery:'confirmat', back:'none', backFix:'confirmat', top:'rails', rails:null, railW:0, legs:true, topOverFacade:false, facadeT:18,
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
  var cols = Math.max(1, Math.floor(+c.cols || 1)); if (cols > 1) warn.push('pertvaros (kolonos) dar nepalaikomos — generuojamas karkasas be pertvarų');
  var tb = o.back === 'top' ? t : 0;               // back thickness behind the sides
  var topFull = o.top === 'full';
  var Dside = D - tb;                              // side depth
  var Lside = topFull ? H - 2*t : H - t;           // side height
  var rw = +o.railW > 0 ? +o.railW : R.rail;       // rail width
  /* surišimo juostos (only with a rail top): front flat/standing/none, back flat/standing/both/none, standing rail on the bottom at the back */
  var rl = topFull ? { front:'none', back:'none', bottom:false } : { front:o.rails.front, back:o.rails.back, bottom:!!o.rails.bottom };
  if (o.back === 'inside' && (rl.back === 'v' || rl.back === 'hv' || rl.bottom)) {
    warn.push('nugara viduje: stačios galinės juostos netelpa šalia nugaros — praleistos');
    rl.back = rl.back === 'hv' ? 'h' : rl.back === 'v' ? 'none' : rl.back; rl.bottom = false;
  }
  var backH = rl.back === 'h' || rl.back === 'hv', backV = rl.back === 'v' || rl.back === 'hv';
  if (!topFull && rl.front === 'none' && rl.back === 'none') warn.push('viršuje nėra nei viršaus, nei juostų — karkasas nesurištas');
  var clearBack = (o.back === 'inside' || backV || rl.bottom) ? t : 0;   // shelves stop in front of an inside back / standing back rails
  var unver = []; var U = function (s) { if (unver.indexOf(s) < 0) unver.push(s); };
  var cf = R.confirmat, cm = R.cam;

  /* ---- sections → facades (bottom-up) and drawer runner heights (relative to carcass bottom) */
  var secs = (c.sections || []).filter(function (s) { return Math.floor(+s.col || 0) === 0; });
  var Hz = H - (topFull && o.topOverFacade ? t : (topFull ? 0 : R.facade.zoneGapRails));   // facade zone height
  var sumExp = 0, nFill = 0; secs.forEach(function (s) { if (s.fill) nFill++; else sumExp += Math.max(0, +s.height || 0); });
  var fillH = nFill > 0 ? Math.max(0, Hz - sumExp) / nFill : 0;
  if (sumExp > Hz + 0.5) warn.push('sekcijų aukščių suma (' + sumExp + ') didesnė už fasadų zoną (' + num(Hz) + ')');
  var runners = [], facades = [], doors = [], shelves = [], yCur = 0;
  secs.forEach(function (s, si) {
    var secH = s.fill ? fillH : Math.max(0, +s.height || 0);
    if (s.kind === 'drawers') {
      var n = Math.max(1, Math.round(+s.nDrawers || 1)); var fh = secH / n;
      var rt = R.runner[s.hw]; if (!rt) warn.push('sekcija ' + (si+1) + ': bėgeliams „' + s.hw + '" skylių šablono nėra — bėgelių žymės nepridėtos');
      for (var j = 0; j < n; j++) {
        var fb = yCur + j*fh;
        facades.push({ w:W - 2*sideGap, h:fh - gap, bottom:fb, hw:s.hw, sec:si, idx:j });
        if (rt) runners.push({ fb:fb, type:s.hw });
        hw.push({ item:(s.hw || 'Stalčiaus bėgeliai') + ' L=' + (+s.rail || 500), qty:1, unit:'kompl.' });
      }
      if (+s.innerDrawers > 0) warn.push('sekcija ' + (si+1) + ': vidiniai stalčiai dar nepalaikomi');
    } else if (s.kind === 'doors') {
      if (+s.innerDrawers > 0) warn.push('sekcija ' + (si+1) + ': vidiniai stalčiai už durų dar nepalaikomi — nebraižomi ir negręžiami');
      var hingedSec = s.hinge !== 'BE FURNITŪROS';
      if (hingedSec && !o.hinges) warn.push('sekcija ' + (si+1) + ': durys — lankstų skylės išjungtos (gręžiama rankomis)');
      var nd = Math.max(1, Math.round(+s.nDoors || 1)), horiz = s.doorSplit === 'h', hs = s.hingeSide || 'auto';
      for (var k = 0; k < nd; k++) {
        var dw = horiz ? W - 2*sideGap : (W - 2*sideGap - (nd - 1)*gap) / nd;
        var dh = horiz ? secH/nd - gap : secH - gap;
        var dx = horiz ? sideGap : sideGap + k*(dw + gap);
        var dz = horiz ? yCur + k*secH/nd : yCur;
        var hl = horiz ? hs !== 'right' : (hs === 'left' ? true : hs === 'right' ? false : k < nd - 1);   // same rule as the offer app's sketch
        /* hinge heights on the door: catalogue spacing, kept clear of the bottom panel and the top / top rail so the
           mounting plate screws (±plateSpacing/2) land in the free part of the side; cups and plates share these */
        var hr0 = R.hinge, clr = hr0.plateSpacing/2 + hr0.plateD/2 + 3;
        var lo = t + clr - dz, hi = t + Lside - (topFull ? 0 : t) - clr - dz;
        var ys = hingeYs(dh).map(function (y) { return Math.max(lo, Math.min(hi, y)); });
        var fits = !hingedSec || (hingesFit(dh, o.hingeFix === 'press') && ys.every(function (y, q) { return q === 0 || ys[q] - ys[q-1] >= hr0.cupD + 3; }));
        if (hingedSec && o.hinges && !fits) warnOnce('durys ' + num(dw) + '×' + num(dh) + ': per žemos lankstams — lankstų skylės nepridėtos');
        if (hingedSec && o.hinges && fits && hingeYs(dh).some(function (y, q) { return Math.abs(y - ys[q]) > 0.01; })) warnOnce('durys ' + num(dw) + '×' + num(dh) + ': lankstas perkeltas, kad plokštelė nepatektų po viršumi/juosta');
        doors.push({ w:dw, h:dh, x:dx, z:dz, sec:si, hingeLeft:hl, hinged:hingedSec && fits, ys:ys });
        if (s.hinge && s.hinge !== 'BE FURNITŪROS') hw.push({ item:s.hinge, qty:hingesPerDoor(dh), unit:'vnt.' });
      }
    }
    if (s.kind === 'oven' && +s.shelves > 0) {   // appliance support shelves: niche bottom, then niche top (as in the offer app)
      var nSup = Math.round(+s.shelves);
      if (nSup >= 1 && yCur >= t) shelves.push({ z:yCur, sec:si, fixed:true, oven:true });
      if (nSup >= 2 && yCur + secH <= t + Lside - t) shelves.push({ z:yCur + secH - t, sec:si, fixed:true, oven:true });
      if (nSup > 2) warn.push('sekcija ' + (si+1) + ': daugiau nei 2 orkaitės atramos lentynos — pridėtos tik apatinė ir viršutinė');
    } else if ((s.kind === 'doors' || s.kind === 'open') && +s.shelves > 0) {
      var ns = Math.round(+s.shelves), z0 = Math.max(yCur, t), z1 = Math.min(yCur + secH, topFull ? H - t : H - t);
      var manual = s.shelfMode === 'manual' && Array.isArray(s.shelfPos);
      for (var m = 0; m < ns; m++) {
        var zc = z0 + (m + 1)*(z1 - z0)/(ns + 1);                        // shelf centre
        if (manual && +s.shelfPos[m] > 0) zc = Math.max(z0 + t/2, Math.min(z1 - t/2, yCur + (+s.shelfPos[m])));   // offer app: height of the shelf from the section bottom
        shelves.push({ z:zc - t/2, sec:si, fixed:s.shelfAdj === false });
      }
      if (s.shelfAdj !== false) hw.push({ item:'Lentynų laikikliai', qty:4*ns, unit:'vnt.' });
    }
    yCur += secH;
  });


  /* ---- joints. Holes in the sides are collected first (side coords: x along the side from its bottom end,
     yf from the front edge) and drilled when the sides are built. Rule for both systems: the part whose END meets
     the other part's FACE carries the edge bores (confirmat pilot Ø5×32, or cam bolt Ø8×34 + cam Ø15 in its face);
     the face gets the confirmat Ø8 through hole, or the Ø8×15 bolt hole and Ø8×12 dowels. */
  var SJ = [], SB = [];     // SJ: holes in the sides' inner face; SB: bores in the sides' back edge
  var sideHole = function (x, yf, d, depth, through) { SJ.push({ x:x, yf:yf, d:d, depth:depth || 0, through:!!through }); };
  /* a part between the sides, its ends x0 (left) / x1 (right); along(a) maps a position across the end (panel y) to side coords */
  function endJoint(p, L, as, camFace, along, what) {
    if (o.joinery === 'cam') {
      var cams = as.cams, dws = as.dowels;
      cams.forEach(function (a) {
        hole(p, camFace, cm.cam.fromEdge, a, cm.cam.d, cm.cam.depth); hole(p, camFace, L - cm.cam.fromEdge, a, cm.cam.d, cm.cam.depth);
        edge(p, 'x0', a, cm.bolt.d, cm.cam.fromEdge); edge(p, 'x1', a, cm.bolt.d, cm.cam.fromEdge);
        var q = along(a); sideHole(q.x, q.yf, cm.bolt.d, cm.bolt.depthFace);
      });
      dws.forEach(function (a) {
        edge(p, 'x0', a, cm.dowel.d, cm.dowel.depthEdge); edge(p, 'x1', a, cm.dowel.d, cm.dowel.depthEdge);
        var q = along(a); sideHole(q.x, q.yf, cm.dowel.d, cm.dowel.depthFace);
      });
      if (what) U(what + ' su ekscentrikais');
    } else {
      as.conf.forEach(function (a) {
        edge(p, 'x0', a, cf.pilot.d, cf.pilot.depth); edge(p, 'x1', a, cf.pilot.d, cf.pilot.depth);
        var q = along(a); sideHole(q.x, q.yf, cf.d, 0, true);
      });
      if (what && what !== 'juostos') U(what + ' su konfirmatais');
    }
  }
  /* fixing positions across a part of width w: confirmats as in the verified rails/bottom, cams centred with dowels ±32 */
  function spots(w, kind) {
    if (kind === 'rail') {
      var c0 = w/2, dw = [c0 - cm.dowel.offset, c0 + cm.dowel.offset].filter(function (a) { return a >= 8 && a <= w - 8; });
      return { conf:(w === 100 ? cf.railFromEdge.slice() : [30, w - 30]), cams:[c0], dowels:dw };
    }
    var e = cf.fromFront, ec = cm.cam.fromFront;
    return { conf:(w >= 2*e + 80 ? [e, w/2, w - e] : w >= 120 ? [40, w - 40] : [w/2]),
             cams:(w >= 2*ec + 100 ? [ec, w/2, w - ec] : [w/2]),
             dowels:(w >= 2*ec + 100 ? [ec + cm.dowel.offset, w - ec - cm.dowel.offset] : []) };
  }

  /* ---- surišimo juostos */
  var Lr = W - 2*t, railPanels = [], bottomRailHoles = [];
  if (!topFull) {
    var hx = Lside - t/2;   // side x of a flat rail's mid-thickness
    var ra = cf.railAlong;
    /* a standing rail is held to the flat rail above it / the bottom below it with cams: the Ø8 bolt bore in its long edge is
       drilled in place (F=4/F=5), while a Ø5 confirmat pilot there would need the 100 mm rail turned — below the machine minimum */
    var railRail = function (top, below, yHole) {
      [ra, Lr/2, Lr - ra].forEach(function (x) { hole(below, 'A', x, rw - cm.cam.fromEdge, cm.cam.d, cm.cam.depth); edge(below, 'y1', x, cm.bolt.d, cm.cam.fromEdge); hole(top, 'B', x, yHole, cm.bolt.d, cm.bolt.depthFace); });
      U('stati juosta prie gulsčios (ekscentrikai)'); U('Ø8 skylės ilgame krašte (F=4/F=5)');
    };
    var pF = null, pBH = null, pBV = null;
    if (rl.front === 'h') {
      pF = panel(nm('JUOSTA_PRIEKIS'), 'JUOSTA_PRIEKIS', Lr, rw, t, 'gulscia, viršus viršuje, priekinis kraštas Y=0');
      endJoint(pF, Lr, spots(rw, 'rail'), 'A', function (a) { return { x:hx, yf:a }; }, 'juostos');
      place(pF, [t, 0, H], X, Y, Z); pF.eb.y0 = eCarc;
    } else if (rl.front === 'v') {
      var zf = H - rw;
      pF = panel(nm('JUOSTA_PRIEKIS'), 'JUOSTA_PRIEKIS', Lr, rw, t, 'stati, vidinė pusė viršuje, apatinis kraštas Y=0');
      endJoint(pF, Lr, spots(rw, 'rail'), 'A', function (a) { return { x:zf + a - t, yf:t/2 }; }, 'juostos');
      place(pF, [t, t, zf], X, Z, Y); pF.eb.y0 = eCarc;
    }
    if (backH) {
      pBH = panel(nm('JUOSTA_GALAS_H'), 'JUOSTA_GALAS_H', Lr, rw, t, 'gulscia, viršus viršuje, galinis kraštas Y=0');
      endJoint(pBH, Lr, spots(rw, 'rail'), 'A', function (a) { return { x:hx, yf:Dside - a }; }, 'juostos');
      place(pBH, [t, Dside, H], X, neg(Y), Z);
    }
    if (backV) {
      var zv = backH ? H - t - rw : H - rw;
      pBV = panel(nm('JUOSTA_GALAS_V'), 'JUOSTA_GALAS_V', Lr, rw, t, 'stati, išorė viršuje, apatinis kraštas Y=0');
      endJoint(pBV, Lr, spots(rw, 'rail'), 'A', function (a) { return { x:zv + a - t, yf:Dside - t/2 }; }, 'juostos');
      place(pBV, [t, Dside, zv], X, Z, Y);
      if (pBH) railRail(pBH, pBV, t/2);
    }
    if (rl.bottom) {
      var pA = panel(nm('JUOSTA_APACIA_V'), 'JUOSTA_APACIA_V', Lr, rw, t, 'stati, išorė viršuje, apatinis kraštas Y=0');
      endJoint(pA, Lr, spots(rw, 'rail'), 'A', function (a) { return { x:a, yf:Dside - t/2 }; }, 'juostos');
      place(pA, [t, Dside, t], X, Z, Y);
      [t + ra, W/2, W - t - ra].forEach(function (x) { bottomRailHoles.push(x); hole(pA, 'A', x - t, cm.cam.fromEdge, cm.cam.d, cm.cam.depth); edge(pA, 'y0', x - t, cm.bolt.d, cm.cam.fromEdge); });
      U('apatinė juosta prie dugno (ekscentrikai)'); U('Ø8 skylės ilgame krašte (F=4/F=5)');
    }
    [pF, pBH, pBV, pA].forEach(function (p) { if (p) { p.mat = mCarc; railPanels.push(p); } });
  }

  /* ---- back */
  var backPanel = null;
  if (o.back === 'top') {
    var Hb = topFull ? H - t : H;
    var pk = panel(nm('NUGARA'), 'NUGARA', W, Hb, t, 'išorė viršuje, apatinis kraštas Y=0');
    if (o.backFix === 'cam') {
      var e0 = R.backCam.fromEnd, cps = [e0, Lside/2, Lside - e0], dps = [e0 + cm.dowel.offset, Lside - e0 - cm.dowel.offset];
      cps.forEach(function (x) { sideHole(x, Dside - cm.cam.fromEdge, cm.cam.d, cm.cam.depth); SB.push({ pos:x, d:cm.bolt.d, depth:cm.cam.fromEdge });
        [t/2, W - t/2].forEach(function (bx) { hole(pk, 'B', bx, x + t, cm.bolt.d, cm.bolt.depthFace); }); });
      dps.forEach(function (x) { SB.push({ pos:x, d:cm.dowel.d, depth:cm.dowel.depthEdge }); [t/2, W - t/2].forEach(function (bx) { hole(pk, 'B', bx, x + t, cm.dowel.d, cm.dowel.depthFace); }); });
      U('nugara su ekscentrikais'); U('Ø8 skylės šonų ilgame krašte (F=4/F=5)');
    } else {
      var ysB = [cm.backFix.fromEdge, Lside/2, Lside - cm.backFix.fromEdge];
      ysB.forEach(function (x) { [t/2, W - t/2].forEach(function (bx) { hole(pk, 'A', bx, x + t, cm.backFix.d, 0, { through:true }); }); SB.push({ pos:x, d:cf.pilot.d, depth:cf.pilot.depth }); });
    }
    place(pk, [0, D, 0], X, Z, Y); pk.mat = mBack; backPanel = pk;
  } else if (o.back === 'inside') {
    var Hi = topFull ? H - 2*t : (backH ? H - 2*t : H - t), Li = W - 2*t;
    var pi = panel(nm('NUGARA'), 'NUGARA', Li, Hi, t, 'tarp šonų, išorė viršuje, apatinis kraštas Y=0');
    var bs = spots(Hi, 'back');
    if (o.joinery === 'cam') { var e1 = R.backCam.fromEnd; bs.cams = [e1, Hi/2, Hi - e1]; bs.dowels = Hi >= 2*e1 + 2*cm.dowel.offset + 40 ? [e1 + cm.dowel.offset, Hi - e1 - cm.dowel.offset] : []; }
    else bs.conf = [cm.backFix.fromEdge, Hi/2, Hi - cm.backFix.fromEdge];
    endJoint(pi, Li, bs, 'A', function (a) { return { x:a, yf:Dside - t/2 }; }, 'nugara viduje');
    place(pi, [t, Dside, t], X, Z, Y); pi.mat = mBack; backPanel = pi;
  }

  /* ---- shelves: adjustable ones are drawn and get pins; fixed ones (and oven supports) are joined like a rail */
  var shW = W - 2*t - R.shelf.clearW, shD = Dside - clearBack - R.shelf.setback;
  var shelfPanels = [];
  shelves.forEach(function (s, i) {
    var p;
    if (s.fixed) {
      var sb = s.oven ? 0 : R.shelf.setback, dF = Dside - clearBack - sb;
      p = panel(nm('LENTYNA' + (i + 1)), 'LENTYNA', Lr, dF, t, (s.oven ? 'orkaitės atrama' : 'fiksuota lentyna') + ', viršus viršuje, priekis Y=0');
      var zc = s.z + t/2 - t;   // side x of the shelf's mid-thickness
      endJoint(p, Lr, spots(dF, 'shelf'), 'B', function (a) { return { x:zc, yf:sb + a }; }, 'fiksuotos lentynos');
      place(p, [t, sb, s.z + t], X, Y, Z);
    } else {
      p = panel(nm('LENTYNA' + (i + 1)), 'LENTYNA', shW, shD, t, 'lentyna');
      place(p, [t + R.shelf.clearW/2, R.shelf.setback, s.z + t], X, Y, Z);
    }
    p.mat = mCarc; p.eb.y0 = eCarc; shelfPanels.push(p);
  });

  /* ---- sides */
  var mkSide = function (role, right) {
    var p = panel(nm(role), role, Lside, Dside, t, 'vidinė pusė viršuje, apatinis kraštas X=0, priekis ' + (right ? 'Y=DY' : 'Y=0'));
    var Yf = function (y) { return right ? Dside - y : y; };   // mirror for the right side
    if (o.joinery === 'cam') {
      var cr = R.cam.cam, ys = [cr.fromFront, Dside/2, Dside - cr.fromFront];
      ys.forEach(function (y) {
        hole(p, 'A', cr.fromEdge, Yf(y), cr.d, cr.depth); edge(p, 'x0', Yf(y), R.cam.bolt.d, cr.fromEdge);
        if (topFull) { hole(p, 'A', Lside - cr.fromEdge, Yf(y), cr.d, cr.depth); edge(p, 'x1', Yf(y), R.cam.bolt.d, cr.fromEdge); }
      });
      [cr.fromFront + R.cam.dowel.offset, Dside - cr.fromFront - R.cam.dowel.offset].forEach(function (y) {
        edge(p, 'x0', Yf(y), R.cam.dowel.d, R.cam.dowel.depthEdge); if (topFull) edge(p, 'x1', Yf(y), R.cam.dowel.d, R.cam.dowel.depthEdge);
      });
    } else {
      var cf = R.confirmat, ys2 = [cf.fromFront, Dside/2, Dside - cf.fromFront];
      ys2.forEach(function (y) { edge(p, 'x0', Yf(y), cf.pilot.d, cf.pilot.depth); if (topFull) edge(p, 'x1', Yf(y), cf.pilot.d, cf.pilot.depth); });
    }
    SJ.forEach(function (j) { hole(p, 'A', j.x, Yf(j.yf), j.d, j.depth, j.through ? { through:true } : null); });
    SB.forEach(function (b) { edge(p, right ? 'y0' : 'y1', b.pos, b.d, b.depth); });   // back edge: y = Dside on the left side, y = 0 on the right
    if (o.runnerMarks !== false) runners.forEach(function (r) { var rt = R.runner[r.type]; var x = Math.max(rt.up, r.fb + rt.up - t); rt.marks.forEach(function (m) {
      var hit = p.holes.some(function (g) { return !g.mark && (g.face === 'A' || g.through) && Math.hypot(g.x - x, g.y - Yf(m)) < g.d/2; });   // mark centre inside a joint hole (touching the rim is fine: the verified SWOOD Tandem cabinet does that)
      if (hit) warnOnce('bėgelio ' + r.type + ' žymė (' + num(x + t) + ' mm aukštyje, ' + num(m) + ' nuo priekio) patenka į ekscentriko skylę — bėgelio varžtas kliūs už jungties; patikrinkite (pvz. rinkitės konfirmatus)');
      hole(p, 'A', x, Yf(m), R.legs.markD, R.legs.markDepth, { mark:true }); }); });
    /* mounting plates of the doors hinged on this side (side x = cabinet z − t) */
    if (o.hinges) {
      var hr = R.hinge, nPl = 0;
      doors.forEach(function (d) {
        if (!d.hinged || d.hingeLeft === right) return;
        var atSide = right ? Math.abs(d.x + d.w - (W - sideGap)) < 0.5 : Math.abs(d.x - sideGap) < 0.5;
        if (!atSide) { warnOnce('durys ' + num(d.w) + '×' + num(d.h) + ': lankstų pusė ne prie šono (reikia pertvaros) — plokštelių skylės nepridėtos'); return; }
        d.ys.forEach(function (yh) {
          var xc = d.z + yh - t;
          [xc - hr.plateSpacing/2, xc + hr.plateSpacing/2].forEach(function (x) {
            var hitP = p.holes.some(function (g) { return (g.face === 'A' || g.through) && Math.hypot(g.x - x, g.y - Yf(hr.plateFromFront)) < (g.d + hr.plateD)/2 + 1.5; });
            if (hitP) warnOnce('lanksto plokštelės skylė (' + num(x + t) + ' mm aukštyje) kliūna už kitos skylės — praleista, patikrinkite');
            else if (x > 5 && x < Lside - 5) { hole(p, 'A', x, Yf(hr.plateFromFront), hr.plateD, hr.plateDepth, { op:'hinge' }); nPl++; }
            else p.warnings.push('lanksto plokštelės skylė už šono ribų (' + num(x) + ') — praleista');
          });
        });
      });
      if (nPl) p.warnings.push('lankstų plokštelių skylės pagal Blum katalogą — NEPATIKRINTA su SWOOD modeliu');
    }
    /* shelf supports */
    if (o.pins && o.pins !== 'off') {
      var pr = R.pins, nPin = 0, shD0 = shD;
      var yB = R.shelf.setback + shD0 - pr.fromBack;
      shelves.forEach(function (s) {
        if (s.fixed) return;
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

  /* ---- bottom (face A = top face, Y from front) */
  (function () {
    var p = panel(nm('DUGNAS'), 'DUGNAS', W, Dside, t, 'viršus viršuje, priekis Y=0');
    var ys = o.joinery === 'cam' ? [R.cam.cam.fromFront, Dside/2, Dside - R.cam.cam.fromFront] : [R.confirmat.fromFront, Dside/2, Dside - R.confirmat.fromFront];
    [t/2, W - t/2].forEach(function (x) { ys.forEach(function (y) { if (o.joinery === 'cam') hole(p, 'A', x, y, R.cam.bolt.d, R.cam.bolt.depthFace); else hole(p, 'A', x, y, R.confirmat.d, 0, { through:true }); }); });
    if (o.joinery === 'cam') [t/2, W - t/2].forEach(function (x) { [R.cam.cam.fromFront + R.cam.dowel.offset, Dside - R.cam.cam.fromFront - R.cam.dowel.offset].forEach(function (y) { hole(p, 'A', x, y, R.cam.dowel.d, R.cam.dowel.depthFace); }); });
    bottomRailHoles.forEach(function (x) { hole(p, 'A', x, Dside - t/2, cm.bolt.d, cm.bolt.depthFace); });   // cam bolts of the standing bottom back rail
    if (o.legs) [R.legs.fromSide, W - R.legs.fromSide].forEach(function (x) { [R.legs.fromFront, Dside - R.legs.fromBack].forEach(function (y) { legMarks(p, 'B', x, y); }); });
    place(p, [0, 0, t], X, Y, Z); p.mat = mCarc; p.eb.y0 = eCarc;
    out.push(p);
  })();

  /* ---- top: full panel or rails */
  if (topFull) {
    var off = o.topOverFacade ? fT : 0, Dtop = Dside + off + tb;   // top covers the back too
    var pt = panel(nm('VIRSUS'), 'VIRSUS', W, Dtop, t, 'apačia viršuje (gręžiama iš apačios), priekis Y=0');
    var ysT = o.joinery === 'cam' ? [R.cam.cam.fromFront, Dside/2, Dside - R.cam.cam.fromFront] : [R.confirmat.fromFront, Dside/2, Dside - R.confirmat.fromFront];
    [t/2, W - t/2].forEach(function (x) { ysT.forEach(function (y) { if (o.joinery === 'cam') hole(pt, 'B', x, y + off, R.cam.bolt.d, R.cam.bolt.depthFace); else hole(pt, 'B', x, y + off, R.confirmat.d, 0, { through:true }); }); });
    if (o.joinery === 'cam') [t/2, W - t/2].forEach(function (x) { [R.cam.cam.fromFront + R.cam.dowel.offset, Dside - R.cam.cam.fromFront - R.cam.dowel.offset].forEach(function (y) { hole(pt, 'B', x, y + off, R.cam.dowel.d, R.cam.dowel.depthFace); }); });
    place(pt, [0, -off, H], X, Y, Z); pt.mat = mCarc; pt.eb.y0 = eCarc;
    out.push(pt);
  } else railPanels.forEach(function (p) { out.push(p); });

  if (backPanel) out.push(backPanel);

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
    place(p, [sideGap, 0, f.bottom], X, Z, Y); p.mat = mFac; p.eb = { y0:eFac, y1:eFac, x0:eFac, x1:eFac };
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
    out.push(p);
  });
  shelfPanels.forEach(function (p) { out.push(p); });

  /* ---- legs (drawn under the bottom; only marks are drilled) */
  var legs = [];
  if (o.legs) [R.legs.fromSide, W - R.legs.fromSide].forEach(function (x) { [R.legs.fromFront, Dside - R.legs.fromBack].forEach(function (y) { legs.push({ x:x, y:y, d:R.legs.drawD, h:+c.legH || 100 }); }); });
  if (legs.length) hw.push({ item:'Kojelės', qty:legs.length, unit:'vnt.' });

  out.forEach(orient);
  /* doors: say on which edge the hinge cups ended up, after the part was turned */
  out.forEach(function (p) {
    if (p.role !== 'DURYS') return;
    var cups = p.holes.filter(function (h) { return h.op === 'hinge' && h.d === R.hinge.cupD; }); if (!cups.length) return;
    var c0 = cups[0], e = Math.abs(c0.x - R.hinge.cupFromEdge) < 0.01 ? 'X=0' : Math.abs(c0.x - (p.L - R.hinge.cupFromEdge)) < 0.01 ? 'X=DX' : Math.abs(c0.y - R.hinge.cupFromEdge) < 0.01 ? 'Y=0' : 'Y=DY';
    p.note = p.note.replace(/lankstai X=D?X?0? ?pusėje/, 'lankstai ' + e + ' krašte');
  });
  out.forEach(function (p) { p.cab = idx + 1; p.short = (idx + 1) + '-' + p.role.replace(/_/g, '-') + (/\d$/.test(p.name) ? p.name.match(/\d+$/)[0] : ''); });
  /* constructions whose 5 mm long-edge holes cannot be turned on the machine: say what to change */
  if (o.back === 'top' && o.backFix !== 'cam' && Lside > R.machine.maxY) warn.push('nugaros konfirmatų Ø5 skylės šonų gale negali būti gręžiamos CNC (šonas ' + num(Lside) + ' mm > ' + R.machine.maxY + ') — pasirinkite nugaros tvirtinimą ekscentrikais');
  if (o.back === 'inside' && o.joinery !== 'cam' && backPanel && Math.max(backPanel.L, backPanel.W) > R.machine.maxY && backPanel.edges.some(function (e) { return (e.edge === 'y0' || e.edge === 'y1') && e.d === cf.pilot.d; })) warn.push('nugaros viduje Ø5 skylės ilguose kraštuose negali būti gręžiamos CNC (> ' + R.machine.maxY + ' mm) — pasirinkite ekscentrikus arba nugarą ant viršaus');
  if (unver.length) warn.push('naujos jungtys, dar nepatikrintos su SWOOD modeliu: ' + unver.join(', ') + ' — patikrinkite pirmą gaminį');
  hardwareFromHoles(out, o, hw);
  return { panels:out, warnings:warn, hardware:mergeHw(hw), legs:legs };
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
      out.push({ F:1, X:m.x, Y:m.y, Z:h.through ? -(DZ + R.through_extra) : -h.depth, D:h.d, N:(h.through || h.mark) ? 'L' : 'P', sx:m.x });
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
      if (e.depth > R.drills.edgeMax) w.push(p.name + ': krašto skylė ' + num(e.depth) + ' mm gylio — grąžtas siekia ' + R.drills.edgeMax);
      out.push({ F:F, X:Xp, Y:Yp, Z:-e.depth, D:e.d, N:'P', sx:sx });
    });
    out.sort(function (a, b) { return (a.sx - b.sx) || (a.Y - b.Y) || (a.X - b.X); });
    return out;
  };
  /* turned program (as step2xxl): same face up as 1OP, panel turned 90° counter-clockwise seen from above —
     the front edge (machine Y=0 in 1OP) becomes the left end X=0, the back edge the right end; new Y = DX − x */
  var rotBores = function () {
    var out = [];
    rotE.forEach(function (e) {
      var front = (e.edge === 'y0') === (up1 === 'A');
      if (R.drills.xEnds.indexOf(e.d) < 0) { w.push(p.name + ': ø' + e.d + ' krašto skylė — grąžto nėra, NEPROGRAMUOTA'); return; }
      if (e.depth > R.drills.edgeMax) w.push(p.name + ': krašto skylė ' + num(e.depth) + ' mm gylio — grąžtas siekia ' + R.drills.edgeMax);
      out.push({ F:front ? 3 : 2, X:DZ/2, Y:DX - e.pos, Z:-e.depth, D:e.d, N:'P', sx:front ? e.depth : DY - e.depth });
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
            hingeYs:hingeYs, hingesFit:hingesFit, setRules:setRules };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBEngine = api;
})(typeof window !== 'undefined' ? window : this);
