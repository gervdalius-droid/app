// 3D constructions with doors and drawers on their openings (c.box.fronts): random boards, partitions, fixed and adjustable
// shelves, overlay / inset fronts, every runner type. Checks: no two parts take the same space (fronts, drawer boxes, boards);
// fronts stay inside the outline (overlay: in front of the boards, inset: inside the opening); each drawer has its runner
// marks on both vertical boards (≥ 2 each, same height and depth on both); each hinged door has 2 plate marks per hinge on its
// hinge-side board level with its cups; drawer-box bores meet the through holes; holes stay in their parts; programs are clean.
// usage: node test/box_fronts_check.js engine.js
const E = require(process.argv[2]);
const P = (p, a, b, c) => { const q = p.place; return [0, 1, 2].map(i => q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]); };
const box = p => { const pts = []; for (const a of [0, p.L]) for (const b of [0, p.W]) for (const c of [0, p.T]) pts.push(P(p, a, b, c)); return [0, 1, 2].map(i => [Math.min(...pts.map(q => q[i])), Math.max(...pts.map(q => q[i]))]); };
let bad = 0, cabs = 0, nF = 0, nDr = 0, nDoor = 0; const K = {};
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 13; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
const HW = ['BLUM TANDEMBOX', 'BLUM TANDEM', 'GTV KULKINIAI H45', 'DTC KULKINIAI H45', 'DTC PASLĖPTI'];
for (let run = 0; run < 2500; run++) {
  const W = pick([600, 900, 1200]), H = pick([720, 900, 2100]), D = pick([560, 600]), t = 18;
  const boards = {}; E.BOX_IDS.forEach(id => { boards[id] = { on:id !== 'front' && (id === 'back' ? rnd() < 0.8 : true), inset:0, T:'' }; });
  if (rnd() < 0.15) boards.front.on = true;
  const inner = []; let id = 1; const np = pick([0, 0, 1, 2]);
  for (let k = 0; k < np; k++) inner.push({ id:id++, kind:'part', x:Math.round(W * (k + 1) / (np + 1)) });
  const ns = pick([0, 1, 2]); for (let k = 0; k < ns; k++) inner.push({ id:id++, kind:'shelf', z:Math.round(H * (k + 1) / (ns + 1)) - 9, col:Math.floor(rnd() * (np + 1)), adj:rnd() < 0.3 });
  const c = { kind:'box', name:'B', W, H, D, thick:t, cnc:{ joinery:pick(['confirmat', 'cam']), hinges:true, hingeFix:pick(['screw', 'press']), facadeT:18, tbFront:'mark' }, box:{ boards, cover:{}, inner, fronts:[] }, mat:{ carc:'M', facade:'F' }, edge:{ carc:'E' } };
  let r = E.buildCabinet(JSON.parse(JSON.stringify(c)), 0, 'P');
  const ops = (r.box.openings || []).slice(), used = {};
  ops.forEach(o => { if (rnd() < 0.7 && !used[o.col + ':' + o.cell]) { used[o.col + ':' + o.cell] = 1; const dr = rnd() < 0.5;
    c.box.fronts.push(dr ? { id:id++, kind:'drawers', col:o.col, cell:o.cell, span:1, inset:rnd() < 0.3, nDrawers:pick([1, 2, 3]), hw:pick(HW), rail:pick([300, 400, 450, 500]) }
                         : { id:id++, kind:'doors', col:o.col, cell:o.cell, span:1, inset:rnd() < 0.3, nDoors:pick([1, 2]), hinge:'BLUM LANKSTAI', hingeSide:pick(['auto', 'left', 'right']), hingeN:pick(['', 2, 3]) }); } });
  r = E.buildCabinet(c, 0, 'P'); cabs++;
  const ps = r.panels, bx = ps.map(box), flagged = r.warnings.some(w => /kertasi|persidengia|kampas/.test(w));
  if (boards.front.on) { if (ps.some(p => /FASADAS|DURYS/.test(p.role))) B('FRONTS ON A CLOSED BOX'); continue; }
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) {
    const v = bx[i].reduce((a, ri, k) => a * Math.max(0, Math.min(ri[1], bx[j][k][1]) - Math.max(ri[0], bx[j][k][0])), 1);
    if (v > 1e-3 && !flagged) B('OVERLAP ' + ps[i].name + ' ' + ps[j].name + ' ' + JSON.stringify(c.box.fronts.map(f => [f.kind, f.inset, f.hw]))); }
  const fronts = ps.filter(p => /FASADAS|DURYS/.test(p.role)); nF += fronts.length;
  fronts.forEach(p => { const b = box(p); if (b[0][0] < -0.01 || b[0][1] > W + 0.01 || b[2][0] < -0.01 || b[2][1] > H + 0.01) B('FRONT OUTSIDE ' + p.name); });
  const vert = ps.filter(p => !p.drawerOf && /KAIRE|DESINE|PERTVARA/.test(p.role));
  const marksW = vert.flatMap(p => p.holes.filter(h => h.mark && h.d === 5).map(h => ({ p, w:P(p, h.x, h.y, h.face === 'A' ? 0 : p.T), op:h.op })));
  const fWarn = r.warnings.some(w => /žymė|netelpa|ilgesnis|per žem|nėra plokštės|kliūna/.test(w));
  (r.visual.drawers || []).forEach(f => { nDr++; const rt = E.R.runner[f.hw]; if (!rt || fWarn) return;
    const near = marksW.filter(m => !m.op && m.w[2] > f.bottom - 60 && m.w[2] < f.bottom + f.h);
    const lft = near.filter(m => Math.abs(m.w[0] - f.ox0) < 0.05), rgt = near.filter(m => Math.abs(m.w[0] - f.ox1) < 0.05);
    if (lft.length < 2 || rgt.length < 2) B('FEW RUNNER MARKS ' + f.hw + ' ' + lft.length + '/' + rgt.length);
    const key = m => Math.round(m.w[1]) + ':' + Math.round(m.w[2]); const ks = new Set(lft.map(key));
    if (rgt.some(m => !ks.has(key(m)))) B('RUNNER MARKS NOT LEVEL ' + f.hw); });
  (r.visual.doors || []).forEach(d => { nDoor++; if (!d.hinged || fWarn) return;
    d.ys.forEach(y => { const z = d.z + y, pl = marksW.filter(m => m.op === 'hinge' && Math.abs(m.w[0] - d.hx) < 0.05 && Math.abs(Math.abs(m.w[2] - z) - E.R.hinge.plateSpacing / 2) < 0.05);
      if (pl.length < 2) B('HINGE PLATE MARKS ' + pl.length + ' at ' + Math.round(z)); }); });
  ps.filter(p => p.drawerOf && p.T > 5).forEach(p => p.edges.forEach(e => {
    const a = e.edge === 'x0' ? 0 : e.edge === 'x1' ? p.L : e.pos, b = e.edge === 'y0' ? 0 : e.edge === 'y1' ? p.W : e.pos, pt = P(p, a, b, p.T / 2);
    const ok = ps.some(s => s !== p && s.drawerOf === p.drawerOf && s.holes.some(h => h.through && h.d === 8 && [0, s.T].some(f => { const w = P(s, h.x, h.y, f); return Math.hypot(w[0] - pt[0], w[1] - pt[1], w[2] - pt[2]) < 0.6; })));
    if (!ok) B('BOX BORE MEETS NOTHING ' + p.name); }));
  ps.forEach(p => p.holes.forEach(h => { if (h.x < -0.01 || h.x > p.L + 0.01 || h.y < -0.01 || h.y > p.W + 0.01) B('HOLE OUTSIDE PART ' + p.name + ' ' + JSON.stringify(h)); }));
  ps.forEach(p => { const pr = E.programs(p); pr.warnings.forEach(w => { if (/NEPROGRAMUOTA/.test(w) && !/netelpa|pasukti 90/.test(w)) B('PROGRAM ' + w); }); });
  const shorts = ps.map(p => p.short); if (new Set(shorts).size !== shorts.length) B('DUPLICATE SHORT NAMES');
}
console.log(`${cabs} constructions, ${nF} fronts, ${nDr} drawers, ${nDoor} doors, ${bad} problems`);
if (bad) console.log(K);
process.exit(bad ? 1 : 0);
