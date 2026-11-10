// Random ordinary cabinets (1–3 columns, every section kind, runner and construction option): no two parts take the
// same space and no front leaves the outline, unless the engine warned about it.
// usage: node test/geo_check.js engine.js [seed] [runs]
const E = require(process.argv[2]);
let seed = +process.argv[3] || 1; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
const P = (p, a, b, c) => { const q = p.place; return [0, 1, 2].map(i => q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]); };
const box = p => { const pts = []; for (const a of [0, p.L]) for (const b of [0, p.W]) for (const c of [0, p.T]) pts.push(P(p, a, b, c)); return [0, 1, 2].map(i => [Math.min(...pts.map(q => q[i])), Math.max(...pts.map(q => q[i]))]); };
const K = {}; let bad = 0, n = 0; const B = (m, c, r) => { bad++; const k = m.split(' ').slice(0, 2).join(' '); if (!K[k]) { K[k] = 0; console.log(m, JSON.stringify(c).slice(0, 1800), '\n   warnings:', JSON.stringify(r.warnings).slice(0, 600)); } K[k]++; };
const HW = ['BLUM TANDEMBOX', 'BLUM TANDEM', 'GTV KULKINIAI H45', 'DTC KULKINIAI H45', 'DTC PASLĖPTI'];
for (let run = 0; run < (+process.argv[4] || 3000); run++) {
  const cols = pick([1, 1, 2, 3]), H = pick([720, 820, 2100, 400, 1200]), W = pick([400, 600, 800, 900, 1200]), secs = [];
  for (let k = 0; k < cols; k++) { const m = Math.floor(rnd() * 3) + 1; for (let i = 0; i < m; i++) secs.push(Object.assign(E.newSection(pick(['drawers', 'doors', 'open', 'oven', 'doors'])), { col:k, fill:i === 0 || rnd() < 0.3, height:pick([150, 300, 450, 600]), nDrawers:pick([1, 2, 3]), hw:pick(HW), rail:pick([300, 400, 450, 500]), nDoors:pick([1, 2]), doorSplit:pick(['v', 'v', 'h']), hingeSide:pick(['auto', 'left', 'right']), shelves:pick([0, 1, 2]), shelfAdj:rnd() < 0.6 })); }
  const c = { id:'x', name:'', type:pick(['PASTATOMOS', 'PAKABINAMOS', 'ŪKINĖ']), W, H, D:pick([300, 330, 560, 580, 600]), thick:pick([18, 18, 16]), cols, colW:[], legH:100, mat:{ carc:'M', facade:'F' }, edge:{ carc:'E' }, sections:secs, extras:[],
    cnc:{ joinery:pick(['confirmat', 'cam']), top:pick(['rails', 'full']), topOverFacade:rnd() < 0.3, legs:rnd() < 0.6, feet:rnd() < 0.2, bottom:pick(['under', 'under', 'inside']), bottomZ:pick([0, 100]), facadeT:18,
      backs:Array.from({ length:cols }, () => pick(['none', 'hdf', 'solid'])), backMount:pick(['top', 'inside']), rails:{ front:pick(['h', 'v']), back:pick(['h', 'v', 'hv']), bottom:rnd() < 0.3 }, hinges:true, hingeFix:pick(['screw', 'press']), pins:pick(['shelf', 'row']), runnerMarks:true, tbFront:pick(['mark', 'hole']) } };
  const c0 = JSON.parse(JSON.stringify(c)), r = E.buildCabinet(c, 0, 'P'); n++;
  if (r.warnings.some(w => /didesnė už fasadų zoną|per siaura|per maž|netinkami|persidengia|kertasi/.test(w))) continue;
  const ps = r.panels, bx = ps.map(box);
  for (let i = 0; i < bx.length; i++) for (let j = i + 1; j < bx.length; j++) {
    const v = bx[i].reduce((a, ri, k) => a * Math.max(0, Math.min(ri[1], bx[j][k][1]) - Math.max(ri[0], bx[j][k][0])), 1);
    if (v > 1e-3) B('OVERLAP ' + ps[i].role + ' ' + ps[j].role + ' ' + ps[i].name + ' ' + ps[j].name, c0, r); }
  ps.filter(p => /FASADAS|DURYS/.test(p.role)).forEach(p => { const b = box(p); if (b[0][0] < -0.01 || b[0][1] > W + 0.01 || b[2][1] > H + 0.01 || b[2][0] < -0.01) B('FRONT OUTSIDE ' + p.name + ' ' + JSON.stringify(b), c0, r); });
}
console.log(n, 'cabinets; problems', bad, JSON.stringify(K)); process.exit(bad ? 1 : 0);
