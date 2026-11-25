/* operations drawn by hand on a part (c.sketch): tool paths, holes, programs, both faces
   node sketch_check.js <engine.js> */
const E = require(process.argv[2] || process.env.ENG || '../src/engine.js');
let bad = 0; const fail = (m) => { bad++; console.log('FAIL', m); };
const c = E.newCabinet(); Object.assign(c, { type:'PASTATOMOS', W:600, H:720, D:560, thick:18 }); c.cnc = E.cncDefaults(c); c.mat = { carc:'K', facade:'F' }; c.edge = { carc:'E' };
c.sections = [Object.assign(E.newSection('doors'), { fill:true, shelves:1 })];
c.sketch = { KAIRE:[
  { id:1, t:'rect', x:100, y:100, w:200, h:120, op:'in', face:'A', through:true },
  { id:2, t:'circle', x:400, y:300, r:4, op:'drill', face:'A', depth:12 },
  { id:3, t:'line', pts:[[50, 450], [600, 450]], op:'on', face:'B', depth:6 },
  { id:4, t:'rect', x:350, y:50, w:100, h:60, op:'pocket', face:'A', depth:8 },
  { id:5, t:'circle', x:600, y:200, r:40, op:'out', face:'A', depth:5 },
  { id:6, t:'line', pts:[[0, 0], [10, 10]], op:'none' },
  { id:7, t:'circle', x:100, y:400, r:5, op:'drill', face:'A', depth:10 },          // no Ø10 drill
  { id:8, t:'rect', x:100, y:300, w:10, h:10, op:'in', face:'A', depth:5 } ] };   // smaller than the cutter
const r = E.buildCabinet(c, 0, 'T'), p = r.panels.find(q => q.key === 'KAIRE');
const by = (n) => p.paths.filter(g => g.name === n || g.name.indexOf(n + '_') === 0);
const r0 = E.R.rout.dia / 2, inR = by('ESKIZAS_1')[0];
if (!inR || inR.depth !== p.T - E.R.rout.skin) fail('cut-out through: depth T − skin');
else { const xs = inR.pts.map(q => q[0]), ys = inR.pts.map(q => q[1]);
  if (Math.abs(Math.min(...xs) - (100 + r0)) > 0.01 || Math.abs(Math.max(...ys) - (220 - r0)) > 0.01) fail('cut-out: tool inside by its radius');
  let a = 0; for (let i = 0; i < inR.pts.length - 1; i++) a += inR.pts[i][0] * inR.pts[i + 1][1] - inR.pts[i + 1][0] * inR.pts[i][1]; if (!(a > 0)) fail('cut-out: counter-clockwise'); }
if (p.holes.filter(h => h.op === 'sketch').length !== 1) fail('one drilled hole (Ø8), the Ø10 refused');
if (!r.warnings.some(w => /eskizas #7: ø10 grąžto nėra/.test(w))) fail('warning: no Ø10 drill');
if (!r.warnings.some(w => /eskizas #8: kontūras per mažas/.test(w))) fail('warning: cut-out too small');
if (by('ESKIZAS_4').length < 2) fail('pocket: several loops');
const out = by('ESKIZAS_5')[0]; if (!out || Math.abs(Math.max(...out.pts.map(q => q[0])) - (640 + r0)) > 0.5) fail('cut round: tool outside');
const pr = E.programs(p), f1 = pr.files.find(f => f.up === 'A'), f2 = pr.files.find(f => f.up === 'B');
if (!f1 || !/ESKIZAS_1/.test(f1.text) || !/XBO X=400 Y=300 Z=-12 D=8/.test(f1.text)) fail('1OP: cut-out and hole');
if (!f2 || !/ESKIZAS_3/.test(f2.text) || !/XL2P X=600 Y=110 Z=-6/.test(f2.text)) fail('face B program: the line, Y mirrored (560 − 450)');
if (r.hardware.some(h => /Konfirmat/.test(h.item) && h.qty % 2)) fail('drilled holes are not counted as hardware');
const c2 = JSON.parse(JSON.stringify(c)); delete c2.sketch; const q2 = E.buildCabinet(c2, 0, 'T').panels.find(q => q.key === 'KAIRE');
if ((q2.paths || []).length || q2.sketch) fail('no sketch: nothing added');
console.log('sketch check: ' + (bad ? bad + ' problems' : '0 problems'));
process.exit(bad ? 1 : 0);
