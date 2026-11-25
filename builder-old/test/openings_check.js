// Doors and windows in the room (layout.openings): kept sound by ensure(), the wall cut round them into pieces that cover
// exactly the wall less the holes, their parts inside the wall's frame, the problems they raise (past the wall end or the ceiling,
// into each other, a cabinet in front of one, a cabinet in a door's sweep — and none for a base cabinet under a window at sill
// height), and the drawing sheets made with them.
// usage: node test/openings_check.js engine.js room.js drawings.js [runs]
global.window = global.window || {};
const E = require(process.argv[2]); window.DBEngine = E;
const RM = require(process.argv[3]), DR = require(process.argv[4]), RUNS = +process.argv[5] || 300;
let bad = 0; const K = {}, N = { pieces:0, parts:0, sheets:0, probs:0 };
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
function cab(k, kind, W) {
  return { id:'c' + k, name:'C' + k, W, H:kind === 'tall' ? 2100 : kind === 'wall' ? 720 : 720, D:kind === 'wall' ? 330 : 560, thick:18,
           type:kind === 'wall' ? 'PAKABINAMOS' : kind === 'tall' ? 'ŪKINĖ' : 'PASTATOMOS', cnc:{ legs:kind === 'base', facadeT:18, worktop:kind === 'base' }, legH:100, mat:{ carc:'K', facade:'F' }, sections:[], extras:[] };
}
const room = (walls, H) => ({ name:'R', cabinets:[], layout:{ walls:walls.map(len => ({ len })), wallZ:1450, roomH:H || 2600, worktop:true, items:{}, openings:[] } });
const kinds = pr => pr.list.map(p => p.kind).sort().join(',');
/* 1. sanitising */
{ const p = room([3000, 2000]); p.layout.openings = [null, { type:'door', wall:0, x:'500', w:900, h:2100 }, { type:'bogus', wall:5, x:0 }, { type:'window', wall:1, x:300, w:-5, z:'a', color:'red' }, { id:'same', type:'window', wall:0, x:2000 }, { id:'same', type:'window', wall:1, x:0 }];
  RM.ensure(p); const o = p.layout.openings;
  if (o.length !== 4) B('NORM COUNT ' + o.length);
  if (o[0].x !== 500 || o[0].z !== 0 || o[0].hinge !== 'L' || o[0].swing !== 'in') B('NORM DOOR ' + JSON.stringify(o[0]));
  if (o[1].w !== 200 || o[1].z !== 900 || !/^#[0-9a-f]{6}$/.test(o[1].color)) B('NORM WIN ' + JSON.stringify(o[1]));
  if (new Set(o.map(x => x.id)).size !== o.length) B('NORM IDS ' + o.map(x => x.id)); }
/* 2. problems that must and must not show */
{ const p = room([3000, 2400]); p.cabinets.push(cab(1, 'base', 600)); RM.ensure(p); p.layout.items.c1 = { wall:0, x:1000 };
  const wt = RM.wtOf(p.cabinets[0]), top = RM.z0Of(p.cabinets[0], p.layout.items.c1, p.layout) + RM.cabH(p.cabinets[0]) + (wt ? wt.T : 0);
  p.layout.openings = [{ id:'w', type:'window', wall:0, x:900, w:800, h:1200, z:top, hinge:'L', swing:'in', color:'#ffffff' }];
  let pr = RM.problems(p); if (pr.list.length) B('UNDER WINDOW ' + kinds(pr) + ' top ' + top);
  p.layout.openings[0].z = top - 50; pr = RM.problems(p); if (kinds(pr) !== 'opblock' || !pr.bad.c1 || !pr.badOp.w) B('LOW WINDOW ' + kinds(pr));
  p.layout.openings = [{ id:'d', type:'door', wall:0, x:1500, w:880, h:2070, z:0, hinge:'L', swing:'in', color:'#ffffff' }];   // casing from 1430: the cabinet ends at 1600
  pr = RM.problems(p); if (kinds(pr) !== 'opblock') B('DOOR BLOCK ' + kinds(pr));
  p.layout.openings[0].x = 1600 + 70; pr = RM.problems(p); if (pr.list.length) B('DOOR BESIDE ' + kinds(pr));
  p.layout.openings[0].x = 3000 - 880 - 70 + 10; pr = RM.problems(p); if (kinds(pr) !== 'opout') B('DOOR OUT ' + kinds(pr));
  p.layout.openings[0].x = 1800; p.layout.openings[0].h = 2600; pr = RM.problems(p); if (pr.list.length) B('DOOR TO CEIL ' + kinds(pr));   // up to the ceiling: no casing over it, fine
  if (RM.opParts(p.layout.openings[0], 100, p.layout).some(function (q) { return q.e[5] > 2600.5; })) B('DOOR CASING OVER CEIL');
  p.layout.openings[0].h = 2650; pr = RM.problems(p); if (kinds(pr) !== 'opceil') B('DOOR CEIL ' + kinds(pr));
  p.layout.openings = [{ id:'a', type:'door', wall:0, x:1700, w:800, h:2000, z:0, hinge:'L', swing:'out', color:'#ffffff' }, { id:'b', type:'window', wall:0, x:2400, w:500, h:600, z:1200, hinge:'L', swing:'in', color:'#ffffff' }];
  pr = RM.problems(p); if (kinds(pr) !== 'ophit') B('OP HIT ' + kinds(pr));
  /* a door near the corner opening into the room: a cabinet on the next wall in its sweep */
  const q = room([3000, 2400]); q.cabinets.push(cab(2, 'tall', 600)); RM.ensure(q); q.layout.items.c2 = { wall:1, x:0 };
  q.layout.openings = [{ id:'s', type:'door', wall:0, x:3000 - 880 - 70, w:880, h:2070, z:0, hinge:'R', swing:'in', color:'#ffffff' }];
  pr = RM.problems(q); if (!/opswing|opblock/.test(kinds(pr))) B('SWEEP ' + kinds(pr));
  q.layout.openings[0].swing = 'out'; pr = RM.problems(q); if (/opswing/.test(kinds(pr))) B('SWEEP OUT ' + kinds(pr)); N.probs += 9; }
/* 2b. sockets and pipes: kept sound, off the wall, behind a cabinet side, in an opening, fine in the middle of a cabinet's back */
{ const p = room([3000, 2400]); p.cabinets.push(cab(9, 'base', 600)); RM.ensure(p); p.layout.items.c9 = { wall:0, x:1000 };
  p.layout.points = [{ type:'cold', wall:0, x:'1300', z:550 }, { type:'bogus', wall:0, x:200 }, { type:'drain', wall:7, x:0 }, null];
  RM.ensure(p); const q0 = p.layout.points;
  if (q0.length !== 2 || q0[0].x !== 1300 || q0[1].type !== 'socket' || q0[1].z !== RM.PT_DEF.socket.z) B('PT NORM ' + JSON.stringify(q0));
  let pr = RM.problems(p); if (pr.list.some(x => x.pt)) B('PT FINE ' + kinds(pr));
  p.layout.points[0].x = 1005; pr = RM.problems(p); if (!pr.list.some(x => x.kind === 'ptside') || !pr.badPt[q0[0].id]) B('PT SIDE ' + kinds(pr));
  p.layout.points[0].x = 2990; pr = RM.problems(p); if (!pr.list.some(x => x.kind === 'ptout')) B('PT OUT ' + kinds(pr));
  p.layout.points[0].x = 2400; p.layout.points[0].z = 1500; p.layout.openings = [{ id:'w', type:'window', wall:0, x:2000, w:800, h:1000, z:1000, hinge:'L', swing:'in', color:'#ffffff' }];
  pr = RM.problems(p); if (!pr.list.some(x => x.kind === 'pthit')) B('PT HIT ' + kinds(pr));
  p.layout.points.forEach(pt => RM.ptParts(pt).forEach(q => { const e = q.e; if (!(e[1] > e[0] && e[3] > e[2] && e[5] > e[4])) B('PT PART ' + e); }));
  /* a wall taken away takes its points */
  p.layout.walls.pop(); p.layout.points.push({ id:'z', type:'hot', wall:1, x:100, z:500 }); RM.ensure(p); if (p.layout.points.some(x => x.wall > 0)) B('PT WALL GONE'); N.probs += 5; }
/* 3. random rooms: the wall pieces and holes tile the wall; parts are sound; sheets are made */
for (let run = 0; run < RUNS; run++) {
  const nw = pick([1, 2, 3, 4]), p = room(Array.from({ length:nw }, () => pick([1800, 2400, 3000, 3600])), pick([2400, 2600, 2800]));
  const n = 1 + Math.floor(rnd() * 6); for (let k = 0; k < n; k++) p.cabinets.push(cab(run * 10 + k, pick(['base', 'base', 'wall', 'tall']), pick([400, 600, 800])));
  RM.ensure(p); const L = p.layout, G = RM.geo(L), H = +L.roomH;
  /* openings that do not overlap one another on a wall */
  G.forEach((g, wi) => { let x = 100 + Math.floor(rnd() * 300); while (x < g.len - 700 && rnd() < 0.7) { const t = pick(['door', 'gdoor', 'window']), w = pick([600, 800, 900, 1200, 1500]); if (x + w + 100 > g.len) break;
    L.openings.push({ id:'o' + run + '_' + wi + '_' + x, type:t, wall:wi, x, w, h:t === 'window' ? pick([600, 1200, 1400]) : pick([2000, 2070]), z:t === 'window' ? pick([300, 900, 1000]) : 0, hinge:pick(['L', 'R']), swing:pick(['in', 'out']), color:'#a0a0a0' });
    x += w + 200 + Math.floor(rnd() * 400); } });
  G.forEach((g, wi) => { for (let k = 0; k < 3; k++) if (rnd() < 0.5) L.points.push({ id:'p' + run + '_' + wi + '_' + k, type:pick(['socket', 'socket2', 'cold', 'hot', 'drain']), wall:wi, x:100 + rnd() * (g.len - 200), z:pick([300, 450, 550, 1100]) }); });
  RM.ensure(p);
  G.forEach((g, wi) => {
    const pcs = RM.wallPieces(L, wi, -100, g.len + 100, H); N.pieces += pcs.length;
    let area = 0; pcs.forEach(q => { if (q[1] - q[0] <= 0 || q[3] - q[2] <= 0 || q[0] < -100.01 || q[1] > g.len + 100.01 || q[2] < -0.01 || q[3] > H + 0.01) B('PIECE BOUNDS ' + q); area += (q[1] - q[0]) * (q[3] - q[2]); });
    let holes = 0; RM.opsOf(L).filter(o => o.wall === wi).forEach(o => { const z0 = RM.isDoor(o) ? 0 : o.z - 25, z1 = Math.min(H, o.z + o.h); const a = Math.max(-100, o.x), b = Math.min(g.len + 100, o.x + o.w); if (b > a && z1 > z0) holes += (b - a) * (z1 - Math.max(0, z0)); });
    if (Math.abs(area + holes - (g.len + 200) * H) > 1) B('PIECE AREA wall ' + wi + ' ' + area + ' + ' + holes + ' vs ' + (g.len + 200) * H);
    for (let i = 0; i < pcs.length; i++) for (let j = i + 1; j < pcs.length; j++) { const a = pcs[i], b = pcs[j]; if (Math.min(a[1], b[1]) - Math.max(a[0], b[0]) > 0.5 && Math.min(a[3], b[3]) - Math.max(a[2], b[2]) > 0.5) B('PIECE OVERLAP ' + a + ' / ' + b); }
  });
  RM.opsOf(L).forEach(o => RM.opParts(o, 100).forEach(q => { N.parts++; const e = q.e; if (!(e[1] > e[0] && e[3] > e[2] && e[5] > e[4]) || !/^#/.test(q.color)) B('PART ' + q.kind + ' ' + e);
    if (q.kind === 'glass' && (e[0] < o.x - 0.5 || e[1] > o.x + o.w + 0.5)) B('GLASS OUT ' + e); }));
  const pr = RM.problems(p); if (!pr.badOp) B('NO BADOP');
  if (run % 10 === 0) { const infos = p.cabinets.map(c => ({ r:E.buildCabinet(c, {}) }));
    try { const sh = DR.sheets(p, infos, { lang:pick(['lt', 'en']), RM }); sh.forEach(s2 => { const svg = s2.make ? s2.make({}) : s2.svg; N.sheets++; if (!svg || svg.indexOf('</svg>') < 0) B('SHEET ' + s2.id); }); } catch (e) { B('SHEET ERR ' + e.message); } }
}
console.log(RUNS + ' rooms, ' + N.pieces + ' wall pieces, ' + N.parts + ' door/window parts, ' + N.sheets + ' sheets, ' + N.probs + ' problem cases, ' + bad + ' problems', bad ? JSON.stringify(K) : '');
