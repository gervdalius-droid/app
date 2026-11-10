// Side panels (extras of kind 'side') in the room: the engine's panel geometry, adding one with "＋ Left / Right"
// (the cabinets around move over to make room, or the shortage is reported), snapping and the free gap with panels,
// and panels that follow the room ("floor to ceiling") when the room height or the hanging height changes.
// usage: node test/side_check.js engine.js room.js [runs]
global.window = global.window || {};
const E = require(process.argv[2]); window.DBEngine = E;
const RM = require(process.argv[3]), RUNS = +process.argv[4] || 400;
let bad = 0, nAdd = 0, nMoved = 0, nShort = 0; const K = {};
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
const near = (a, b) => Math.abs(a - b) < 0.11;
function cab(k) {
  const kind = pick(['base', 'base', 'wall', 'tall']), W = pick([300, 400, 450, 600, 800]);
  return { id:'c' + k, name:'C' + k, W, H:kind === 'tall' ? 2100 : kind === 'wall' ? pick([720, 900, 1500]) : 720, D:kind === 'wall' ? pick([330, 600]) : 560, thick:18,
           type:kind === 'wall' ? 'PAKABINAMOS' : kind === 'tall' ? 'ŪKINĖ' : 'PASTATOMOS', cnc:{ legs:kind !== 'wall', facadeT:18 }, legH:100, mat:{ carc:'K', facade:'F' }, sections:[], extras:[] };
}
const fp = (c, it) => { const s = RM.sideW(c); return [it.x - s.L, it.x + RM.cabW(c) + s.R]; };
const vr = (c, it, L) => { const z0 = RM.z0Of(c, it, L); return RM.level(c) === 'wall' ? [z0, z0 + RM.cabH(c)] : [0, z0 + RM.cabH(c)]; };
const ov = (a, b) => Math.min(a[1], b[1]) - Math.max(a[0], b[0]) > 0.5;
for (let run = 0; run < RUNS; run++) {
  const nw = pick([1, 2, 3]), proj = { name:'S' + run, cabinets:[], layout:{ walls:Array.from({ length:nw }, () => ({ len:pick([1800, 2400, 2920, 3600]) })), wallZ:pick([800, 1450]), roomH:pick([2300, 2600]), worktop:false, items:{} } };
  const n = 2 + Math.floor(rnd() * 7);
  for (let k = 0; k < n; k++) { const c = cab(run * 10 + k); proj.cabinets.push(c); }
  RM.ensure(proj);
  /* placed rows touch, as a user lines them up: no problems to begin with are not needed — the checks look at what adding changes */
  for (let s = 0; s < 3; s++) {
    const i = Math.floor(rnd() * n), c = proj.cabinets[i], it = proj.layout.items[c.id]; if (!it || it.wall < 0) continue;
    const L = proj.layout, before = JSON.parse(JSON.stringify(L.items)), sd = pick(['L', 'R']);
    const others = RM.placed(proj).filter(o => o.c.id !== c.id && o.it.wall === it.wall && ov(vr(c, it, L), vr(o.c, o.it, L)));
    const len0 = RM.geo(L)[it.wall].len, wasFree = others.every(o => !ov(fp(c, it), fp(o.c, o.it))) && fp(c, it)[0] >= -0.5 && fp(c, it)[1] <= len0 + 0.5;   // in nobody and on its wall
    const res = RM.addSide(proj, c, sd); nAdd++;
    const x = c.extras[c.extras.length - 1];
    if (x.kind !== 'side' || x.side !== sd) { B('ADD KIND ' + JSON.stringify(x)); continue; }
    /* the panel: against the carcass side (outside the panels already there), as tall as its choice */
    const pan = E.sidePanels(c).filter(q => q.x === x)[0]; if (!pan) { B('ADD NOPANEL ' + JSON.stringify(x)); continue; }
    const sw = E.sidePanels(c).filter(q => q.side === sd && q.x !== x).reduce((a, q) => a + q.T, 0);
    if (sd === 'L' ? !near(pan.x1, -sw) : !near(pan.x0, RM.cabW(c) + sw)) B('PANEL X ' + sd + ' ' + pan.x0 + '..' + pan.x1 + ' after ' + sw);
    const f = RM.sideFit(c, proj.layout.items[c.id], L, x.fit);
    if (!near(pan.z0, f.zb) || !near(pan.z1 - pan.z0, f.L)) B('PANEL Z ' + x.fit + ' ' + pan.z0 + '..' + pan.z1);
    if (x.fit === 'room' && !near(RM.z0Of(c, proj.layout.items[c.id], L) + pan.z1, Math.max(+L.roomH, RM.z0Of(c, proj.layout.items[c.id], L) + RM.cabH(c)))) B('PANEL CEIL ' + pan.z1);
    if (x.fit === 'floor' && !near(RM.z0Of(c, proj.layout.items[c.id], L) + pan.z0, 0)) B('PANEL FLOOR ' + pan.z0);
    if (res.moved) nMoved++; if (res.short) nShort++;
    /* nothing moved except along the same wall, by the same amount, keeping order */
    Object.keys(before).forEach(id => { const a = before[id], b = L.items[id]; if (a.wall !== b.wall) B('MOVE WALL ' + id); if (!near(a.x, b.x) && !(res.moved && near(Math.abs(a.x - b.x), res.moved))) B('MOVE AMOUNT ' + id + ' ' + a.x + '→' + b.x + ' ' + JSON.stringify(res)); });
    /* when it was free before and nothing is short, the footprint (panels included) sits in nobody at its height on its wall, and on the wall */
    const it2 = L.items[c.id], g = RM.geo(L)[it2.wall];
    if (wasFree && !res.short) {
      const f2 = fp(c, it2);
      RM.placed(proj).forEach(o => { if (o.c.id === c.id || o.it.wall !== it2.wall || !ov(vr(c, it2, L), vr(o.c, o.it, L))) return; if (ov(f2, fp(o.c, o.it))) { B('ADD HIT ' + c.id + ' ' + o.c.id + ' ' + JSON.stringify(res) + ' ' + sd + ' fp ' + f2 + ' / ' + fp(o.c, o.it) + ' lv ' + RM.level(c) + '/' + RM.level(o.c) + ' before ' + JSON.stringify(before[c.id]) + JSON.stringify(before[o.c.id])); } });
      if (f2[0] < -0.5 || f2[1] > g.len + 0.5) B('ADD OUT ' + c.id + ' ' + f2 + ' ' + g.len + ' ' + JSON.stringify(res) + ' ' + sd + ' wall ' + it2.wall + '/' + L.walls.length);
    }
  }
  /* the free gap: the carcass that fills it, with its panels, ends where the gap ends */
  RM.placed(proj).forEach(o => { const g = RM.gapAround(proj, o.c); if (!g) return; const s = RM.sideW(o.c); if (!near(g.cx - s.L, g.x0) || !near(g.cx + g.cw + s.R, g.x1)) B('GAP ' + JSON.stringify(g) + ' ' + JSON.stringify(s)); });
  /* snapping next to a neighbour: footprints touch */
  RM.placed(proj).forEach(o => {
    const L = proj.layout; RM.placed(proj).forEach(q => { if (q.c.id === o.c.id || q.it.wall !== o.it.wall || !ov(vr(o.c, o.it, L), vr(q.c, q.it, L))) return;
      const want = fp(q.c, q.it)[1] + RM.sideW(o.c).L, sn = RM.snap(proj, o.c, o.it.wall, want, 10);
      if (Math.abs(sn.x - want) > 0.11 && !(sn.why && sn.why !== 'nb')) B('SNAP ' + sn.x + ' ' + want + ' ' + sn.why); });
  });
  /* "floor to ceiling" follows the room */
  const L = proj.layout, rooms = []; proj.cabinets.forEach(c => (c.extras || []).forEach(x => { if (x.kind === 'side' && x.fit === 'room') rooms.push([c, x]); }));
  if (rooms.length) { L.roomH = +L.roomH + 100; const ch = RM.ensure(proj), low = rooms.some(([c]) => RM.z0Of(c, L.items[c.id], L) + RM.cabH(c) < +L.roomH - 0.5); if (!ch && low) B('REFIT NOCHANGE');
    rooms.forEach(([c, x]) => { const it = L.items[c.id], z0 = RM.z0Of(c, it, L); if (!near(z0 + (+x.zb) + (+x.L), Math.max(+L.roomH, z0 + RM.cabH(c)))) B('REFIT ' + x.zb + ' ' + x.L); }); }
}
/* loose panels (kind 'panel'): one board, any size; dropped at a row, the row moves over when it can */
let nLoose = 0, nLooseMoved = 0;
for (let run = 0; run < RUNS; run++) {
  const proj = { name:'P' + run, cabinets:[], layout:{ walls:[{ len:pick([2400, 2920, 3600]) }], wallZ:800, roomH:2300, worktop:false, items:{} } };
  const n = 2 + Math.floor(rnd() * 4); for (let k = 0; k < n; k++) proj.cabinets.push(cab(run * 10 + k));
  RM.ensure(proj);
  const pc = { id:'p' + run, kind:'panel', name:'', type:'PASTATOMOS', W:pick([16, 18, 25]), H:pick([800, 2300]), D:pick([560, 618, 700]), thick:18, cnc:{ legs:false }, pe:{ e1:true, e2:true, e3:false, e4:true }, mat:{ carc:'F' }, edge:{ carc:'E' }, sections:[], extras:[] };
  const r = E.buildCabinet(pc, n, 'P'); nLoose++;
  if (r.panels.length !== 1) { B('LOOSE PARTS ' + r.panels.length); continue; }
  const pp = r.panels[0], L0 = Math.max(pc.H, pc.D), W0 = Math.min(pc.H, pc.D);
  if (!near(pp.L, L0) || !near(pp.W, W0) || !near(pp.T, pc.W)) B('LOOSE SIZE ' + pp.L + 'x' + pp.W + 'x' + pp.T);
  if (E.programs(pp).files.length) B('LOOSE PROGRAM');
  const ex = [0, 1, 2].map(k => { const v = []; [0, pp.L].forEach(a => [0, pp.W].forEach(b => [0, pp.T].forEach(t => v.push(pp.place.o[k] + a * pp.place.u[k] + b * pp.place.v[k] - t * pp.place.n[k])))); return [Math.min(...v), Math.max(...v)]; });
  if (!near(ex[0][0], 0) || !near(ex[0][1], pc.W) || !near(ex[1][0], 0) || !near(ex[1][1], pc.D) || !near(ex[2][0], 0) || !near(ex[2][1], pc.H)) B('LOOSE PLACE ' + JSON.stringify(ex));
  if (pp.L === pc.H && (pp.eb.y0 !== 'E' || pp.eb.y1 !== 'E' || pp.eb.x0 !== '' || pp.eb.x1 !== 'E')) B('LOOSE EDGE ' + JSON.stringify(pp.eb));   // L1 front, L2 back, W1 bottom (off here), W2 top
  /* dropped at a row start / end / middle */
  const ps = RM.placed(proj).filter(o => o.it.wall === 0); if (!ps.length) continue;
  const tgt = pick(ps), at = pick([fp(tgt.c, tgt.it)[0], fp(tgt.c, tgt.it)[1] - pc.W, fp(tgt.c, tgt.it)[0] + 5]);
  proj.cabinets.push(pc); proj.layout.items[pc.id] = { wall:0, x:Math.max(0, at) };
  const L = proj.layout, len = L.walls[0].len, others = () => RM.placed(proj).filter(o => o.c !== pc && o.it.wall === 0 && ov(vr(pc, L.items[pc.id], L), vr(o.c, o.it, L)));
  const okBefore = others().every(o => !ov(fp(o.c, o.it), [-1e9, 0]) && fp(o.c, o.it)[1] <= len + 0.5);
  const rs = ['L', 'R'].map(sd => RM.makeRoom(proj, pc, sd)); if (rs.some(x => x.moved)) nLooseMoved++;
  if (okBefore && !rs.some(x => x.short)) {
    const f = fp(pc, L.items[pc.id]); others().forEach(o => { if (ov(f, fp(o.c, o.it))) B('LOOSE HIT ' + f + ' ' + fp(o.c, o.it) + ' ' + JSON.stringify(rs)); });
    others().forEach((o, k, a) => a.forEach((q, j) => { if (j > k && ov(vr(o.c, o.it, L), vr(q.c, q.it, L)) && ov(fp(o.c, o.it), fp(q.c, q.it)) && !(ov(fp(o.c, before0(o)), fp(q.c, before0(q))))) B('LOOSE PUSHED INTO ' + o.c.id + ' ' + q.c.id); }));
  }
}
function before0(o) { return o.it; }
console.log(nLoose + ' loose panels (' + nLooseMoved + ' made room)');
console.log(RUNS + ' rooms, ' + nAdd + ' side panels added (' + nMoved + ' made room, ' + nShort + ' short), ' + bad + ' problems');
if (bad) console.log(K);
