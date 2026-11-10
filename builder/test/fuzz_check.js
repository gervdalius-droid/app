// Random and odd inputs (empty, 0, negative, text, huge) for cabinets and 3D constructions: the engine must not throw,
// every part has a real size and place, holes / edges / programs / fittings / warnings hold no NaN, undefined or Infinity.
// usage: node test/fuzz_check.js engine.js [seed] [runs]
const E = require(process.argv[2]); const BUILD = E.buildCabinet;
let seed = +process.argv[3] || 1; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
const K = {}; let bad = 0; const B = (m, c) => { bad++; const k = m.split(' ').slice(0, 3).join(' '); if (!K[k]) { K[k] = 0; console.log(m, JSON.stringify(c).slice(0, 1500)); } K[k]++; };
const weird = [600, 600, 450, 300, 900, 1200, 150, 80, 3000, '', 0, -100, '600', 'abc', null, 2400];
const fin = v => typeof v === 'number' && isFinite(v);
const HW = ['BLUM TANDEMBOX', 'BLUM TANDEM', 'GTV KULKINIAI H45', 'DTC KULKINIAI H45', 'DTC PASLĖPTI', 'KT. PASLĖPTO MONTAVIMO', 'GUOLINIAI'];
function cab() {
  const cols = pick([1, 1, 2, 3, 4, 0, '']), secs = [];
  const nS = Math.floor(rnd() * 5);
  for (let i = 0; i < nS; i++) secs.push(Object.assign(E.newSection(pick(['drawers', 'doors', 'open', 'oven'])), { col:Math.floor(rnd() * 4), fill:rnd() < 0.5, height:pick([0, 100, 300, 600, '', 2000, -5]), nDrawers:pick([1, 2, 3, 6, 0, '', 12]), hw:pick(HW), rail:pick([250, 300, 450, 500, 650, '', 0]), nDoors:pick([1, 2, 3, 0]), doorSplit:pick(['v', 'h']), hinge:pick(['BLUM LANKSTAI', 'BE FURNITŪROS', 'BLUM TIP-ON']), hingeSide:pick(['auto', 'left', 'right']), hingeN:pick(['', 2, 5, 9]), shelves:pick([0, 1, 3, '']), shelfAdj:rnd() < 0.5, frontH:rnd() < 0.2 ? [pick([100, 200, 900]), pick([0, 150])] : undefined }));
  const c = { id:'x', name:pick(['', 'Spintelė „A“/1', 'x']), type:pick(['PASTATOMOS', 'PAKABINAMOS', 'ŪKINĖ']), W:pick(weird), H:pick(weird), D:pick(weird), thick:pick([18, 16, 25, '', 0]), cols, colW:rnd() < 0.3 ? [pick([100, 300, 900])] : [], dishwasher:rnd() < 0.05, dishWidth:pick([450, 600]), legH:pick([100, 0, 150]),
    mat:{ carc:pick(['', 'LMDP 18']), facade:pick(['', 'F']), back:'' }, edge:{ carc:'', facade:'' }, sections:secs, extras:[],
    worktop:rnd() < 0.3 ? { on:true, mat:'W', T:pick([38, '', 0, -1]), over:pick([20, '', -50]), left:pick([0, 30, -5]), right:0 } : undefined,
    cnc:{ joinery:pick(['confirmat', 'cam']), top:pick(['rails', 'full']), topOverFacade:rnd() < 0.3, legs:rnd() < 0.6, feet:rnd() < 0.2, bottom:pick(['under', 'inside']), bottomZ:pick([0, 100, 500, '']), facadeT:pick([18, 22, '', 0]),
      backs:Array.from({ length:4 }, () => pick(['none', 'hdf', 'solid'])), backMount:pick(['top', 'inside']), rails:{ front:pick(['h', 'v', 'none']), back:pick(['h', 'v', 'hv', 'none']), bottom:rnd() < 0.3 }, railW:pick([100, 80, '']),
      hinges:rnd() < 0.8, hingeFix:pick(['screw', 'press']), pins:pick(['shelf', 'row', 'off']), runnerMarks:rnd() < 0.9, tbFront:pick(['mark', 'hole', 'off']), legsX:pick([2, 3, 'parts']), legsY:pick([2, 3]) } };
  return c;
}
function boxc() {
  const boards = {}; E.BOX_IDS.forEach(id => { boards[id] = { on:rnd() < 0.8, inset:pick([0, 0, 20, 400]), T:pick(['', 8, 22]) }; });
  const inner = []; let id = 1; for (let k = 0; k < Math.floor(rnd() * 3); k++) inner.push({ id:id++, kind:'part', x:pick([100, 300, 450, -5, 5000]) });
  for (let k = 0; k < Math.floor(rnd() * 3); k++) inner.push({ id:id++, kind:'shelf', z:pick([100, 300, 9000, -1]), col:pick([0, 1, 5]), adj:rnd() < 0.5 });
  const fronts = []; for (let k = 0; k < Math.floor(rnd() * 4); k++) fronts.push({ id:id++, kind:pick(['doors', 'drawers']), col:pick([0, 1, 7]), cell:pick([0, 1, 9]), span:pick([1, 2, 0, '']), inset:rnd() < 0.4, nDoors:pick([1, 2, 3]), nDrawers:pick([1, 4, 0]), hw:pick(HW), rail:pick([300, 500, '']), hinge:pick(['BLUM LANKSTAI', 'BE FURNITŪROS']), hingeN:pick(['', 3]) });
  return { kind:'box', name:'B', W:pick(weird), H:pick(weird), D:pick(weird), thick:pick([18, 16, '']), cnc:{ joinery:pick(['confirmat', 'cam']), hinges:true, facadeT:18, joints:{} }, box:{ boards, cover:{}, inner, fronts, pinRow:rnd() < 0.3 }, mat:{ carc:'M', facade:'F' }, edge:{ carc:'E' }, worktop:rnd() < 0.2 ? { on:true, mat:'W' } : undefined };
}
const N = +process.argv[4] || 4000;
for (let run = 0; run < N; run++) {
  const c = rnd() < 0.75 ? cab() : boxc(), c0 = JSON.parse(JSON.stringify(c));
  let r;
  try { r = E.buildCabinet(c, 0, 'P'); } catch (e) { B('EXCEPTION build ' + e.message + ' @' + (e.stack || '').split('\n')[1], c0); continue; }
  if (!r || !Array.isArray(r.panels)) { B('NO RESULT', c0); continue; }
  r.panels.forEach(p => {
    if (!(fin(p.L) && fin(p.W) && fin(p.T)) || p.L <= 0 || p.W <= 0 || p.T <= 0) B('BAD PANEL_SIZE ' + p.role + ' ' + p.name + ' ' + p.L + 'x' + p.W + 'x' + p.T, c0);
    if (p.place && ![...p.place.o, ...p.place.u, ...p.place.v, ...p.place.n].every(fin)) B('BAD PLACE ' + p.role, c0);
    p.holes.forEach(h => { if (![h.x, h.y, h.d].every(fin) || !(h.depth >= 0 || h.through)) B('BAD HOLE ' + p.role + ' ' + JSON.stringify(h), c0); });
    p.edges.forEach(e => { if (![e.pos, e.d, e.depth].every(fin)) B('BAD EDGE ' + p.role + ' ' + JSON.stringify(e), c0); });
    let pr; try { pr = E.programs(p); } catch (e) { B('EXCEPTION programs ' + p.role + ' ' + e.message + ' @' + (e.stack || '').split('\n')[1], c0); return; }
    pr.files.forEach(f => { if (/NaN|undefined|Infinity|null/.test(f.text)) B('BAD PROGRAM TEXT ' + p.role + ' ' + (f.text.match(/.{30}(NaN|undefined|Infinity|null).{10}/) || [''])[0], c0); });
  });
  (r.hardware || []).forEach(h => { if (!fin(h.qty) || h.qty <= 0 || /undefined|NaN/.test(h.item)) B('BAD HW ' + JSON.stringify(h), c0); });
  (r.warnings || []).forEach(w => { if (/undefined|NaN|\[object/.test(w)) B('BAD WARNING ' + w, c0); });
  const v = JSON.stringify(r.visual || {}); if (/null|NaN/.test(v.replace(/"plinth":null/, '').replace(/"pname":null/g, ''))) B('BAD VISUAL ' + v.slice(0, 200), c0);
  if (r.worktop && ![r.worktop.L, r.worktop.W, r.worktop.T].every(fin)) B('BAD WORKTOP', c0);
  if (r.joints) r.joints.forEach(j => { if (!fin(j.w)) B('BAD JOINT', c0); });
}
console.log('fuzz done, problems', bad, JSON.stringify(K, null, 0)); process.exit(bad ? 1 : 0);
