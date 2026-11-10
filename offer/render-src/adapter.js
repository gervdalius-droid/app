/* =====================================================================
   Offer app → cabinet creator (builder) cabinet, for the builder's 3D
   assembly view. Mirrors the builder's fromOffer / normCab / engineDef
   (gervdalius-droid/builder, app.js) with the builder's default settings.
   Part-list cabinets imported from a drawing (c.parts) are turned into
   sections (drawers / oven / doors / shelves) so they can be drawn too.
   ===================================================================== */
(function (root) {
  'use strict';
  const E = (typeof module !== 'undefined' && module.exports) ? require('./engine.js') : root.DBEngine;
  const clone = o => JSON.parse(JSON.stringify(o));
  const num = v => { const n = parseFloat(String(v == null ? '' : v).replace(',', '.')); return isFinite(n) ? n : 0; };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const TYPES = ['PASTATOMOS', 'PAKABINAMOS', 'ŪKINĖ'];
  const TYPE_DEF = {   // builder defSettings().types
    'PASTATOMOS':  { joinery: 'confirmat', top: 'rails', back: 'none', backFix: 'confirmat', topOverFacade: false, legs: true,  railFront: 'h', railBack: 'h', railBottom: false },
    'PAKABINAMOS': { joinery: 'confirmat', top: 'full',  back: 'top',  backFix: 'confirmat', topOverFacade: false, legs: false, railFront: 'h', railBack: 'h', railBottom: false },
    'ŪKINĖ':       { joinery: 'confirmat', top: 'full',  back: 'top',  backFix: 'cam',       topOverFacade: false, legs: true,  railFront: 'h', railBack: 'h', railBottom: false }
  };
  const OPS = { runnerMarks: true, tbFront: 'mark', hinges: true, hingeFix: 'screw', pins: 'shelf' };
  const legacyBack = cnc => cnc.back === 'hdf' ? 'hdf' : !cnc.back || cnc.back === 'none' ? 'none' : 'solid';
  function cncFor(type) {
    const ty = TYPE_DEF[type] || TYPE_DEF.PASTATOMOS, op = OPS;
    return { joinery: ty.joinery, top: ty.top, back: ty.back === 'hdf' ? 'top' : ty.back, backFix: ty.backFix || 'confirmat', topOverFacade: !!ty.topOverFacade, legs: !!ty.legs, facadeT: 18,
      rails: { front: ty.railFront || 'h', back: ty.railBack || 'h', bottom: !!ty.railBottom }, railW: 100, joints: {},
      runnerMarks: op.runnerMarks, tbFront: op.tbFront, hinges: op.hinges, hingeFix: op.hingeFix, pins: op.pins,
      backs: [legacyBack(ty)], backMount: ty.back === 'inside' ? 'inside' : 'top' };
  }
  function newSection(kind) {
    return { id: uid(), kind, col: 0, fill: kind !== 'drawers' && kind !== 'oven', height: kind === 'drawers' ? 540 : kind === 'oven' ? 595 : 400,
      nDrawers: 3, hw: 'BLUM TANDEMBOX', rail: 500, nDoors: kind === 'doors' ? 2 : 1, hinge: 'BLUM LANKSTAI', doorSplit: 'v', hingeSide: 'auto',
      shelves: kind === 'oven' ? 2 : kind === 'open' ? 2 : 1, shelfAdj: true, shelfMode: 'even', shelfPos: [] };
  }
  const colsOf = c => c.dishwasher ? 1 : Math.max(1, Math.min(3, Math.floor(num(c.cols) || 1)));
  function colWidths(c) {
    const n = colsOf(c), W = num(c.W); let w = Array.isArray(c.colW) && c.colW.length === n ? c.colW.map(num) : null;
    let rest = w ? W - w.slice(0, n - 1).reduce((a, b) => a + b, 0) : 0;
    if (!w || w.slice(0, n - 1).some(v => !(v >= 50)) || rest < 50) { w = []; for (let k = 0; k < n; k++) w.push(Math.round(W / n)); rest = W - w.slice(0, n - 1).reduce((a, b) => a + b, 0); }
    w[n - 1] = rest; return w;
  }

  // the offer app's section keys the builder reads (builder fromOffer)
  const SEC_KEYS = ['kind', 'col', 'fill', 'height', 'nDrawers', 'hw', 'rail', 'nDoors', 'hinge', 'doorSplit', 'hingeSide', 'shelves', 'shelfAdj', 'shelfMode', 'shelfPos', 'innerDrawers'];

  /** part-list cabinet (drawing import) → sections */
  function sectionsFromParts(c) {
    const P = c.parts || [], q = p => num(p.qty) || 0;
    const shelves = P.filter(p => p.cls === 'shelf').reduce((s, p) => s + q(p), 0) || Math.max(0, Math.min(4, Math.round(num(c.shelves))));
    const drawers = num(c.drawers), doors = num(c.doors), oven = !!c.oven || P.some(p => /ORKAIT/i.test(p.name || ''));
    const S = [];
    const dr = (n, o) => Object.assign(newSection('drawers'), { nDrawers: n, hw: 'BLUM TANDEMBOX', rail: 500 }, o);
    const dd = (n, o) => Object.assign(newSection('doors'), { nDoors: Math.max(1, Math.min(2, n || 1)), shelves, hinge: 'BLUM LANKSTAI' }, o);
    const hasFront = P.some(p => p.cls === 'fac');
    if (oven) {                                        // bottom → top (the engine stacks the first section at the bottom)
      const nDr = drawers || (!doors && hasFront && num(c.H) - 600 > 120 ? 1 : 0);
      if (nDr) S.push(dr(nDr, doors ? { fill: false, height: 180 * nDr } : { fill: true }));
      S.push(Object.assign(newSection('oven'), { fill: !doors && !nDr && num(c.H) - 600 <= 120, height: 595, shelves: 1 }));
      if (doors) S.push(dd(doors, { fill: true }));
      else if (!nDr && num(c.H) - 600 > 120) S.push(Object.assign(newSection('open'), { fill: true, shelves: 0 }));
    } else if (drawers > 0 && doors > 0) {             // doors below, drawers on top
      S.push(dd(doors, { fill: true })); S.push(dr(drawers, { fill: false, height: Math.min(num(c.H) * 0.5, 180 * drawers) }));
    } else if (drawers > 0) S.push(dr(drawers, { fill: true }));
    else if (doors > 0 || P.some(p => p.cls === 'fac')) S.push(dd(doors || (num(c.W) > 650 ? 2 : 1), { fill: true }));
    else S.push(Object.assign(newSection('open'), { fill: true, shelves }));
    return S;
  }
  const backOfParts = c => (c.parts || []).some(p => p.cls === 'hdf' && p.cls !== 'skip') ? 'hdf' : (c.parts || []).some(p => p.cls === 'back') ? 'solid' : 'none';

  /** offer cabinet → builder cabinet definition ready for DBEngine.buildCabinet */
  function toBuilder(c, matName) {
    matName = matName || (v => v || '');
    const type = TYPES.indexOf(c.type) >= 0 ? c.type : 'PASTATOMOS';
    const isParts = Array.isArray(c.parts);
    const dish = !!c.dishwasher || (isParts && (c.parts || []).some(p => /INDAPLOV/i.test(p.name || '')));
    const cab = {
      id: c.id || uid(), name: c.name || '', type, W: num(c.W), H: num(c.H), D: num(c.D) || 560, thick: num(c.thick) || 18,
      cols: isParts ? 1 : (num(c.cols) || 1), colW: isParts ? [] : (c.colW || []), dishwasher: dish, dishWidth: num(c.dishWidth) || num(c.W) || 600, legH: 100,
      mat: { carc: matName(c.carcMat, 'KARKASAS') || c.impCarcName || '', facade: matName(c.defFacadeMat, 'FASADAS') || c.impFacName || '', back: matName(c.carcMat, 'KARKASAS') || '' },
      edge: { carc: '', facade: '' }, extras: [], sections: [],
      worktop: { on: false, mat: '', T: (E.WT_DEF || {}).T || 38, over: (E.WT_DEF || {}).over || 20, left: 0, right: 0, edge: '' }
    };
    cab.cnc = cncFor(type);
    if (isParts) { if (num(c.legs) === 0 && type !== 'PAKABINAMOS' && !(c.hw || []).some(h => /KOJOS/.test(h.key))) cab.cnc.legs = type === 'PASTATOMOS'; cab.cnc.backs = [backOfParts(c)]; }
    else if (c.hasBack === false) cab.cnc.backs = ['none']; else if (c.backType === 'hdf' || !c.backType) cab.cnc.backs = ['hdf']; else cab.cnc.backs = ['solid'];
    const secs = isParts ? sectionsFromParts(c) : (c.sections || []).map(s => { const o = {}; SEC_KEYS.forEach(k => { if (s[k] !== undefined) o[k] = s[k]; }); return o; });
    cab.sections = dish ? [] : secs.map(s => Object.assign(newSection(s.kind || 'doors'), s));
    // fixCols
    const n = colsOf(cab); cab.cols = n; cab.colW = n > 1 ? colWidths(cab) : [];
    const b = cab.cnc.backs.slice(0, 3); while (b.length < n) b.push(b.length ? b[b.length - 1] : legacyBack(cab.cnc)); cab.cnc.backs = b;
    cab.sections.forEach(s => { s.col = Math.min(n - 1, Math.max(0, Math.floor(num(s.col) || 0))); });
    // engineDef
    ['W', 'H', 'D', 'thick', 'dishWidth', 'legH'].forEach(k => cab[k] = num(cab[k]));
    if (cab.dishwasher) { cab.W = cab.dishWidth || cab.W; if (cab.H < 300) cab.H = 760; }   // a drawing's dishwasher page lists only the rail pieces
    cab.sections.forEach(s => { ['height', 'nDrawers', 'rail', 'nDoors', 'shelves'].forEach(k => s[k] = num(s[k])); s.shelfPos = (s.shelfPos || []).map(num); });
    return cab;
  }
  function build(c, matName) {
    const def = toBuilder(c, matName);
    const r = E.buildCabinet(def, 0, 'OFFER');
    return { def, r };
  }
  const api = { toBuilder, build, sectionsFromParts };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBOfferBuild = api;
})(typeof window !== 'undefined' ? window : this);
