// Concealed undermount runners (DTC PASLĖPTI) and their board drawer boxes, over many cabinets:
//  no drawer part takes the space of another part; boxes stay inside the carcass; inside width = opening − deduction
//  (42 for 16 mm sides), box length = runner − 10, bottom set in 13 mm, 14 mm under the box above the runner's hole row
//  minus `up`; every confirmat pilot of a box part meets a Ø8 through hole of another part of the same box (same point,
//  facing it); the cabinet sides carry the runner holes; holes stay in their parts; programs come out clean.
// usage: node test/under_check.js engine.js
const E = require(process.argv[2]);
const P = (p, a, b, c) => { const q = p.place; return [0, 1, 2].map(i => q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]); };
const box = p => { const pts = []; for (const a of [0, p.L]) for (const b of [0, p.W]) for (const c of [0, p.T]) pts.push(P(p, a, b, c)); return [0, 1, 2].map(i => [Math.min(...pts.map(q => q[i])), Math.max(...pts.map(q => q[i]))]); };
let bad = 0, cabs = 0, boxes = 0, bores = 0; const K = {};
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
for (let run = 0; run < 3000; run++) {
  const cols = pick([1, 1, 2, 3]), W = pick([300, 400, 600, 800, 900, 1200]), H = pick([720, 820, 2100]), D = pick([560, 580, 600, 450]);
  const secs = []; for (let k = 0; k < cols; k++) {
    secs.push(Object.assign(E.newSection('drawers'), { col:k, fill:rnd() < 0.6, height:pick([300, 450, 600]), nDrawers:pick([1, 2, 3, 4]), hw:pick(['DTC PASLĖPTI', 'DTC PASLĖPTI', 'GTV KULKINIAI H45', 'BLUM TANDEMBOX']), rail:pick([250, 300, 350, 400, 450, 500, 550, 600]) }));
    if (rnd() < 0.5) secs.push(Object.assign(E.newSection('doors'), { col:k, fill:true, nDoors:1, shelves:1 }));
  }
  const thick = pick([18, 18, 16]);
  const c = { W, H, D, thick, cols, legH:100, mat:{ carc:'M' }, edge:{ carc:'E' }, sections:secs,
              cnc:{ joinery:pick(['confirmat', 'cam']), top:pick(['rails', 'full']), legs:true, bottom:rnd() < 0.25 ? 'inside' : 'under', bottomZ:pick([0, 100]),
                    backs:Array.from({ length:cols }, () => pick(['none', 'hdf', 'solid'])), backMount:pick(['top', 'inside']), rails:{ front:pick(['h', 'v']), back:pick(['h', 'v', 'hv']), bottom:rnd() < 0.3 } } };
  const boxT = rnd() < 0.25 ? 16 : 0;
  E.setRules({ under:{ up:37, marks:'37, 165, 229', clearBelow:14, recess:13, shorter:10, ded:'', boxT, perLen:rnd() < 0.2 ? '250: 37,165; 600: 37,165,229,453' : '' } });
  const r = E.buildCabinet(c, 0, 'P'); cabs++;
  if (r.warnings.some(w => /didesnė už fasadų zoną|per siaura/.test(w))) continue;
  const ps = r.panels, bx = ps.map(box);
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) { if (!ps[i].drawerOf && !ps[j].drawerOf) continue;
    const v = bx[i].reduce((a, ri, k) => a * Math.max(0, Math.min(ri[1], bx[j][k][1]) - Math.max(ri[0], bx[j][k][0])), 1);
    if (v > 1e-3) B('OVERLAP ' + ps[i].name + ' ' + ps[j].name); }
  const carcB = ps.filter(p => !p.drawerOf && !/FASADAS|DURYS/.test(p.role)).map(box), env = [0, 1, 2].map(k => [Math.min(...carcB.map(b => b[k][0])), Math.max(...carcB.map(b => b[k][1]))]);
  const byF = {}; ps.forEach((p, i) => { if (p.drawerOf) (byF[p.drawerOf] = byF[p.drawerOf] || []).push(i); });
  const bt = boxT || thick;
  Object.keys(byF).forEach(fn => {
    const idx = byF[fn]; if (!ps[idx[0]].name.includes('STALC')) return;
    const sides = idx.filter(i => ps[i].role === 'STALC_SONAS'), bot = idx.find(i => ps[i].role === 'STALC_DUGNAS');
    if (ps[bot].T < 5) return;   // a ball-runner box (HDF bottom): ball_check's job
    boxes++;
    if (idx.length !== 5 || sides.length !== 2) { B('BOX PARTS ' + idx.length); return; }
    idx.forEach(i => { const b = bx[i]; if (b[0][0] < env[0][0] - 0.01 || b[0][1] > env[0][1] + 0.01 || b[1][0] < -0.01 || b[1][1] > env[1][1] + 0.01 || b[2][0] < env[2][0] - 0.01 || b[2][1] > env[2][1] + 0.01) B('BOX OUTSIDE ' + ps[i].name); });
    const sb = sides.map(i => bx[i]).sort((a, b) => a[0][0] - b[0][0]), zc = (sb[0][2][0] + sb[0][2][1]) / 2;
    const vert = carcB.filter(b => (b[0][1] - b[0][0]) < Math.min(b[1][1] - b[1][0], b[2][1] - b[2][0]) && b[2][0] <= zc && b[2][1] >= zc);
    const lf = Math.max(...vert.filter(b => b[0][1] <= sb[0][0][0] + 0.01).map(b => b[0][1])), rf = Math.min(...vert.filter(b => b[0][0] >= sb[1][0][1] - 0.01).map(b => b[0][0]));
    const inside = sb[1][0][0] - sb[0][0][1], want = (rf - lf) - E.underDeduct(bt);
    if (Math.abs(inside - want) > 0.05) B('INSIDE WIDTH ' + inside + ' want ' + want);
    if (Math.abs((sb[0][0][0] - lf) - (rf - sb[1][0][1])) > 0.05) B('NOT CENTRED');
    const sec = r.visual.drawers.find(f => f.pname === fn), s2 = c.sections.filter(q => q.col === (sec.col || 0))[sec.sec], rail = s2.rail;
    if (Math.abs(sb[0][1][1] - sb[0][1][0] - (rail - 10)) > 0.05 || Math.abs(sb[0][1][0]) > 0.05) B('BOX LENGTH ' + (sb[0][1][1] - sb[0][1][0]) + ' rail ' + rail);
    if (Math.abs(bx[bot][2][0] - sb[0][2][0] - 13) > 0.05) B('BOTTOM RECESS ' + (bx[bot][2][0] - sb[0][2][0]));
    /* the cabinet runner holes on the side / partition left of the box: hole row = box bottom − 14 + 37 */
    const rowZ = sb[0][2][0] - 14 + 37, lp = ps.find(p => !p.drawerOf && /KAIRE|PERTVARA|DESINE/.test(p.name) && Math.abs(box(p)[0][1] - lf) < 0.05 && box(p)[2][0] <= zc && box(p)[2][1] >= zc);
    if (lp) { const mk = lp.holes.filter(h => h.mark && h.d === 5).map(h => P(lp, h.x, h.y, h.face === 'A' ? 0 : lp.T)).filter(w => Math.abs(w[2] - rowZ) < 0.05);
      const fit = mk.filter(w => w[1] < rail - 10);
      if (fit.length < 2 && !r.warnings.some(w => /patenka į ekscentriko|netelpa šone/.test(w))) B('FEW RUNNER HOLES ' + lp.name + ' ' + fit.length + ' at ' + rowZ); }
  });
  /* every confirmat pilot of a box part meets a Ø8 through hole of another part of its box */
  ps.filter(p => p.drawerOf && p.T > 5).forEach(p => p.edges.forEach(e => { bores++;
    const a = e.edge === 'x0' ? 0 : e.edge === 'x1' ? p.L : e.pos, b = e.edge === 'y0' ? 0 : e.edge === 'y1' ? p.W : e.pos, pt = P(p, a, b, p.T / 2);
    const ok = ps.some(s => s !== p && s.drawerOf === p.drawerOf && s.holes.some(h => h.through && h.d === 8 && [0, s.T].some(f => { const w = P(s, h.x, h.y, f); return Math.hypot(w[0] - pt[0], w[1] - pt[1], w[2] - pt[2]) < 0.6; })));
    if (!ok) B('BORE MEETS NOTHING ' + p.name + ' ' + JSON.stringify(e)); }));
  ps.forEach(p => p.holes.forEach(h => { if (h.x < -0.01 || h.x > p.L + 0.01 || h.y < -0.01 || h.y > p.W + 0.01) B('HOLE OUTSIDE PART ' + p.name + ' ' + JSON.stringify(h)); }));
  ps.forEach(p => { const pr = E.programs(p); pr.warnings.forEach(w => { if (/NEPROGRAMUOTA/.test(w) && !/netelpa|pasukti 90/.test(w)) B('PROGRAM ' + w); }); });
  ps.filter(p => p.drawerOf).forEach(p => { p.holes.forEach((h, i) => p.holes.forEach((g, k) => { if (k <= i) return; if (Math.hypot(g.x - h.x, g.y - h.y) < (g.d + h.d) / 2 + 0.5) B('HOLES TOUCH ' + p.name); })); });
  const nU = (r.visual.drawers || []).filter(f => f.hw === 'DTC PASLĖPTI').length, hwN = r.hardware.filter(h => /PASLĖPTI/.test(h.item)).reduce((a, h) => a + h.qty, 0);
  if (nU !== hwN) B('HARDWARE ' + nU + ' vs ' + hwN);
}
console.log(`${cabs} cabinets, ${boxes} undermount drawer boxes, ${bores} box bores checked, ${bad} problems`);
if (bad) console.log(K);
process.exit(bad ? 1 : 0);
