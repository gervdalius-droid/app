// Side-mount ball-bearing runners (GTV / DTC H45) and their board drawer boxes, over many cabinets:
//  no two parts take the same space; every box sits 12.7 mm clear of the side / partition faces and inside the carcass;
//  every confirmat pilot bore of a box front / back meets a Ø8 through hole of a box side (same point, facing it);
//  the cabinet member marks on the side faces and the drawer member marks on the box sides lie on one axis (same height,
//  same distances from the front), at least 2 per runner; marks never sit in a joint hole; programs come out clean.
// usage: node test/ball_check.js engine.js
const E = require(process.argv[2]);
const P = (p, a, b, c) => { const q = p.place; return [0, 1, 2].map(i => q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]); };
const box = p => { const pts = []; for (const a of [0, p.L]) for (const b of [0, p.W]) for (const c of [0, p.T]) pts.push(P(p, a, b, c)); return [0, 1, 2].map(i => [Math.min(...pts.map(q => q[i])), Math.max(...pts.map(q => q[i]))]); };
let bad = 0, cabs = 0, boxes = 0, marks = 0; const K = {};
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 3; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
for (let run = 0; run < 3000; run++) {
  const cols = pick([1, 1, 2, 3]), W = pick([400, 600, 800, 900, 1200]), H = pick([720, 820, 2100]), D = pick([560, 580, 600]);
  const secs = []; for (let k = 0; k < cols; k++) {
    secs.push(Object.assign(E.newSection('drawers'), { col:k, fill:rnd() < 0.6, height:pick([300, 450, 600]), nDrawers:pick([1, 2, 3, 4]), hw:pick(['GTV KULKINIAI H45', 'DTC KULKINIAI H45', 'GTV KULKINIAI H45', 'BLUM TANDEMBOX']), rail:pick([300, 400, 450, 500, 550]) }));
    if (rnd() < 0.5) secs.push(Object.assign(E.newSection('doors'), { col:k, fill:true, nDoors:1, shelves:1 }));
  }
  const c = { W, H, D, thick:pick([18, 18, 16]), cols, legH:100, mat:{ carc:'M' }, edge:{ carc:'E' }, sections:secs,
              cnc:{ joinery:pick(['confirmat', 'cam']), top:pick(['rails', 'full']), legs:true, bottom:rnd() < 0.2 ? 'inside' : 'under', bottomZ:pick([0, 100]),
                    backs:Array.from({ length:cols }, () => pick(['none', 'hdf', 'solid'])), backMount:pick(['top', 'inside']), rails:{ front:pick(['h', 'v']), back:pick(['h', 'v', 'hv']), bottom:rnd() < 0.3 } } };
  if (rnd() < 0.3) E.setRules({ ball:{ up:pick([37, 48]), front:pick([35, 37]), rear:pick([30, 32]), midFrom:pick([450, 0]), perLen:rnd() < 0.2 ? '450: 35,195,420; 500: 35,227,470' : '' } });
  else E.setRules({ ball:{ up:37, front:35, rear:30, midFrom:450, perLen:'' } });
  const r = E.buildCabinet(c, 0, 'P'); cabs++;
  if (r.warnings.some(w => /didesnė už fasadų zoną|per siaura/.test(w))) continue;
  const ps = r.panels, bx = ps.map(box);
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { if (!ps[i].drawerOf && !ps[j].drawerOf) continue;   // carcass-only overlaps are the other tests' job
    const v = bx[i].reduce((a, ri, k) => a * Math.max(0, Math.min(ri[1], bx[j][k][1]) - Math.max(ri[0], bx[j][k][0])), 1);
    if (v > 1e-3) B('OVERLAP ' + ps[i].name + ' ' + ps[j].name + ' ' + JSON.stringify(c.cnc.rails) + ' ' + c.cnc.top + ' ' + JSON.stringify(c.cnc.backs) + c.cnc.backMount); }
  const carcB = ps.filter(p => !p.drawerOf && !/FASADAS|DURYS/.test(p.role)).map(box), env = [0, 1, 2].map(k => [Math.min(...carcB.map(b => b[k][0])), Math.max(...carcB.map(b => b[k][1]))]);
  /* boxes */
  const byF = {}; ps.forEach((p, i) => { if (p.drawerOf) (byF[p.drawerOf] = byF[p.drawerOf] || []).push(i); });
  Object.keys(byF).forEach(fn => {
    boxes++; const idx = byF[fn], sides = idx.filter(i => ps[i].role === 'STALC_SONAS');
    if (idx.length !== 5 || sides.length !== 2) { B('BOX PARTS ' + idx.length); return; }
    idx.forEach(i => { const b = bx[i]; if (b[0][0] < env[0][0] - 0.01 || b[0][1] > env[0][1] + 0.01 || b[1][0] < -0.01 || b[1][1] > env[1][1] + 0.01 || b[2][0] < env[2][0] - 0.01 || b[2][1] > env[2][1] + 0.01) B('BOX OUTSIDE ' + ps[i].name); });
    /* 12.7 clear of the nearest vertical carcass face each side */
    const sb = sides.map(i => bx[i]).sort((a, b) => a[0][0] - b[0][0]), zc = (sb[0][2][0] + sb[0][2][1]) / 2;
    const vert = ps.filter(p => !p.drawerOf && !/FASADAS|DURYS/.test(p.role)).map(box).filter(b => (b[0][1] - b[0][0]) < Math.min(b[1][1] - b[1][0], b[2][1] - b[2][0]) && b[2][0] <= zc && b[2][1] >= zc);
    const lf = Math.max(...vert.filter(b => b[0][1] <= sb[0][0][0] + 0.01).map(b => b[0][1])), rf = Math.min(...vert.filter(b => b[0][0] >= sb[1][0][1] - 0.01).map(b => b[0][0]));
    if (Math.abs(sb[0][0][0] - lf - 12.7) > 0.05 || Math.abs(rf - sb[1][0][1] - 12.7) > 0.05) B('CLEARANCE ' + (sb[0][0][0] - lf) + ' ' + (rf - sb[1][0][1]));
    /* drawer member marks ↔ cabinet member marks */
    sides.forEach(i => { const p = ps[i], dm = p.holes.filter(h => h.mark).map(h => P(p, h.x, h.y, p.T));
      if (dm.length < 2) B('FEW DRAWER MARKS ' + p.name);
      const outward = p.place.n.map(v => -v);   // face B looks at the carcass
      if (process.env.DBG && run < 3) console.log("dm", p.name, JSON.stringify(dm.map(q=>q.map(v=>Math.round(v)))), JSON.stringify(ps.filter(s=>!s.drawerOf).flatMap(s=>s.holes.filter(h=>h.mark).map(h=>{const w=P(s,h.x,h.y,h.face==="A"?0:s.T);return s.role+":"+w.map(v=>Math.round(v))}))));
      dm.forEach(q => { marks++; const tgt = ps.find(s => !s.drawerOf && !/FASADAS|DURYS/.test(s.role) && s.holes.some(h => h.mark && (() => { const f = h.face === 'A' ? 0 : s.T, w = P(s, h.x, h.y, f); return Math.abs(w[1] - q[1]) < 0.05 && Math.abs(w[2] - q[2]) < 0.05 && Math.sign(w[0] - q[0]) === Math.sign(outward[0]); })()));
        if (!tgt) B('DRAWER MARK WITHOUT CABINET MARK ' + p.name + ' ' + q.map(v => Math.round(v * 10) / 10)); }); });
  });
  /* confirmat bores of box fronts/backs meet side holes */
  ps.filter(p => p.drawerOf && /PRIEKIS|GALAS/.test(p.role)).forEach(p => p.edges.forEach(e => { const a = e.edge === 'x0' ? 0 : e.edge === 'x1' ? p.L : e.pos, b = e.edge === 'y0' ? 0 : e.edge === 'y1' ? p.W : e.pos, pt = P(p, a, b, p.T / 2);
    const ok = ps.some(s => s.drawerOf === p.drawerOf && s.role === 'STALC_SONAS' && s.holes.some(h => h.through && h.d === 8 && [0, s.T].some(f => { const w = P(s, h.x, h.y, f); return Math.hypot(w[0] - pt[0], w[1] - pt[1], w[2] - pt[2]) < 0.6; })));
    if (!ok) B('BOX BORE MEETS NOTHING ' + p.name + ' ' + JSON.stringify(e)); }));
  ps.forEach(p => p.holes.forEach(h => { if (h.x < -0.01 || h.x > p.L + 0.01 || h.y < -0.01 || h.y > p.W + 0.01) B('HOLE OUTSIDE PART ' + p.name + ' ' + JSON.stringify(h)); }));
  /* runner marks on the carcass: ≥ 2 per runner, never inside a joint hole; programs */
  ps.forEach(p => { if (p.drawerOf) return; const mk = p.holes.filter(h => h.mark && h.d === 5);
    mk.forEach(m => { if (p.holes.some(h => !h.mark && (h.face === m.face || h.through) && Math.hypot(h.x - m.x, h.y - m.y) < h.d / 2 - 0.01) && !r.warnings.some(w => /patenka į ekscentriko/.test(w))) B('MARK IN HOLE ' + p.name + ' ' + JSON.stringify(m) + ' ' + JSON.stringify(p.holes.find(h => !h.mark && (h.face === m.face || h.through) && Math.hypot(h.x - m.x, h.y - m.y) < h.d / 2 - 0.01))); }); });
  ps.forEach(p => { const pr = E.programs(p); pr.warnings.forEach(w => { if (/NEPROGRAMUOTA/.test(w) && !/netelpa|pasukti 90/.test(w)) B('PROGRAM ' + w); }); });
  /* hardware: one runner set per ball drawer */
  const nBall = (r.visual.drawers || []).filter(f => /KULKINIAI/.test(f.hw)).length, hwN = r.hardware.filter(h => /KULKINIAI/.test(h.item)).reduce((a, h) => a + h.qty, 0);
  if (nBall !== hwN) B('HARDWARE ' + nBall + ' vs ' + hwN);
}
console.log(`${cabs} cabinets, ${boxes} drawer boxes, ${marks} drawer member marks checked, ${bad} problems`);
if (bad) console.log(K);
process.exit(bad ? 1 : 0);
