// Drawing sheets (drawings.js) for many cabinets and room layouts (one sheet per cabinet: views, parts, assembly):
//  every sheet is made without an error and is well-formed XML (checked by the caller: python xml),
//  the far-to-near order of the parts never puts a part behind one it covers (every overlapping pair whose order
//  an axis decides is drawn in that order — in the front, side, top and 3-D views, assembled and exploded),
//  fronts are drawn after the carcass parts behind them, the parts list on the assembly sheet lists every part
//  with its real size, the overall width / height / depth appear as dimensions on the views sheet.
// usage: [DBFIT=fit.js] node test/drawings_check.js engine.js room.js drawings.js [outdir]
global.window = global.window || {};
const E = require(process.argv[2]); window.DBEngine = E;
if (process.env.DBFIT) window.DBFit = require(process.env.DBFIT);   // the makers' fittings (TANDEMBOX, TANDEM, hinges) drawn from their models
const RM = require(process.argv[3]), DR = require(process.argv[4]), out = process.argv[5];
const fs = require('fs');
let bad = 0, nSheets = 0, nPairs = 0, nCab = 0; const K = {};
const B = m => { bad++; if (bad < 15) console.log(m); const k = m.split(' ').slice(0, 2).join(' '); K[k] = (K[k] || 0) + 1; };
let seed = 5; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a => a[Math.floor(rnd() * a.length)];
const nm = v => String(Math.round(v * 10) / 10);
function cabinet(k) {
  if (k % 7 === 6) {   // a 3D construction
    const boards = {}; E.BOX_IDS.forEach(id => { boards[id] = { on:rnd() < 0.85, inset:0, T:'' }; }); boards.bottom.on = true; boards.left.on = true;
    const inner = []; if (rnd() < 0.6) inner.push({ id:1, kind:'part', x:300 }); if (rnd() < 0.7) inner.push({ id:2, kind:'shelf', z:300, col:0, adj:rnd() < 0.5 });
    boards.front.on = false;
    const fronts = rnd() < 0.7 ? [{ id:9, kind:pick(['doors', 'drawers']), col:0, cell:0, span:1, inset:rnd() < 0.4, nDoors:pick([1, 2]), nDrawers:pick([1, 2]), hw:pick(['BLUM TANDEMBOX', 'GTV KULKINIAI H45', 'DTC PASLĖPTI']), rail:300, hinge:'BLUM LANKSTAI' }] : [];
    return { id:'b' + k, kind:'box', name:'Box' + k, W:600, H:pick([400, 720]), D:pick([350, 560]), thick:18, cnc:{ joinery:pick(['confirmat', 'cam']), hinges:true }, box:{ boards, cover:{}, inner, fronts }, mat:{ carc:'M', facade:'F' }, edge:{ carc:'E' } };
  }
  if (k % 13 === 12) return { id:'p' + k, kind:'panel', name:'', type:'PASTATOMOS', W:pick([16, 18, 25]), H:pick([720, 2300]), D:pick([560, 650]), thick:18, cnc:{ legs:false }, pe:{ e1:true, e2:true, e3:true, e4:false }, mat:{ carc:'LMDP balta 18' }, edge:{ carc:'ABS 1' }, sections:[] };   // a loose panel
  if (k % 11 === 10) return { id:'d' + k, name:'Indaplovė', W:600, H:720, D:560, dishwasher:true, dishWidth:600, legH:100, cnc:{}, sections:[] };
  const cols = pick([1, 1, 2, 3]), H = pick([720, 720, 2100, 330 + 390]), W = pick([400, 600, 900, 1200]);
  const secs = []; for (let c = 0; c < cols; c++) {
    const kind = pick(['drawers', 'doors', 'open', 'doors']);
    secs.push(Object.assign(E.newSection(kind), { col:c, fill:true, hw:pick(['BLUM TANDEMBOX', 'BLUM TANDEM', 'GTV KULKINIAI H45', 'DTC KULKINIAI H45']), rail:pick([300, 400, 450, 500]), hingeN:pick(['', '', 3, 4]), nDrawers:pick([1, 2, 3, 4]), nDoors:pick([1, 2]), shelves:pick([0, 1, 2]), hingeSide:pick(['auto', 'left', 'right']) }));
    if (H > 1500) secs.push(Object.assign(E.newSection('drawers'), { col:c, fill:false, height:500, nDrawers:2 }));
  }
  return { id:'c' + k, name:'C' + k, W, H, D:pick([330, 560, 580]), thick:18, cols, legH:100,
           cnc:{ joinery:pick(['confirmat', 'cam']), top:pick(['rails', 'full']), legs:rnd() < 0.8, feet:rnd() < 0.3, bottom:rnd() < 0.3 ? 'inside' : 'under', bottomZ:pick([0, 100]),
                 backs:Array.from({ length:cols }, () => pick(['none', 'hdf', 'solid'])), hinges:true, pins:'shelf' },
           sections:secs, mat:{ carc:'LMDP balta 18', facade:'LMDP antracitas 18' }, edge:{ carc:'ABS 0.8' },
           worktop:H < 1500 && rnd() < 0.5 ? { on:true, mat:pick(['Stalviršis Egger F244 38', 'Kompaktinė plokštė 12', '']), T:pick([38, 12, '']), over:pick([20, '', 0, 40]), left:pick([0, 0, 30]), right:pick([0, 50]), edge:pick(['', 'ABS 2']) } : undefined, extras:(rnd() < 0.3 ? [{ name:'Cokolis', kind:'plinth', L:W, W:100, T:18, qty:1 }] : []).concat(rnd() < 0.35 ? [{ name:'Šoninė plokštė', kind:'side', side:pick(['L', 'R', '']), L:H + pick([0, 100]), W:pick([560, 578, 600]), T:18, qty:1, zb:pick([0, -100]), yf:18 }] : []) };   // side panels: in the room sheets
}
function orderOk(order, V, tag) {   // every overlapping pair whose order an axis decides is drawn in that order
  const eps = 0.01;
  for (let i = 0; i < order.length; i++) for (let j = i + 1; j < order.length; j++) {
    const A = order[i], Bx = order[j];   // A drawn first
    if (!DR.overlap2(A.hull, Bx.hull)) continue;   // the two pictures do not overlap: either order is right
    nPairs++;
    const said = [];   // what every separating axis says (they agree whenever a view ray meets both boxes)
    for (let k = 0; k < 3; k++) { if (Math.abs(V.d[k]) < 1e-9) continue;
      if (A.e[k][1] <= Bx.e[k][0] + eps) said.push(V.d[k] < 0); else if (Bx.e[k][1] <= A.e[k][0] + eps) said.push(V.d[k] > 0); }
    if (said.length && said.every(x => x === false)) { B('ORDER ' + tag + ' ' + (A.p ? A.p.name : A.leg ? 'leg' : '?') + ' before ' + (Bx.p ? Bx.p.name : Bx.leg ? 'leg' : '?')); return; }
  }
}
for (let run = 0; run < 60; run++) {
  const n = 1 + Math.floor(rnd() * 6), proj = { name:'T' + run, cabinets:[] };
  for (let k = 0; k < n; k++) proj.cabinets.push(cabinet(run * 7 + k));
  const infos = proj.cabinets.map((c, i) => ({ r:E.buildCabinet(JSON.parse(JSON.stringify(c)), i, proj.name) }));
  /* room: none, one wall, L or U, some cabinets hanging */
  const nw = pick([0, 1, 2, 3]);
  if (nw) { proj.layout = { walls:Array.from({ length:nw }, () => ({ len:pick([2400, 3600]) })), wallZ:1450, roomH:2600, worktop:true, items:{} };
    const x = Array(nw).fill(0);
    proj.cabinets.forEach((c, i) => { if (rnd() < 0.2) return; const w = Math.floor(rnd() * nw); c.hang = c.dishwasher ? undefined : (+c.H < 800 && rnd() < 0.3);
      const it = { wall:w, x:x[w] + (w ? 600 : 0) }; x[w] += RM.cabW(c); proj.layout.items[c.id] = it; }); }
  nCab += n;
  /* painter's order, every cabinet, every view */
  infos.forEach((inf, i) => {
    ['front', 'left', 'top'].forEach(v => { const V = DR.viewOrtho(v), o = DR.solve(DR.cabBoxes(inf.r, { fit:true, c:proj.cabinets[i] }), V); orderOk(o, V, v + ' cab' + i);
      if (v === 'front') o.forEach((b, bi) => { if (!b.front) return; o.forEach((q, qi) => { if (qi > bi && !q.front && q.p && q.e[1][0] >= b.e[1][1] - 0.01 && Math.min(q.bb[1], b.bb[1]) - Math.max(q.bb[0], b.bb[0]) > 0.05 && Math.min(q.bb[3], b.bb[3]) - Math.max(q.bb[2], b.bb[2]) > 0.05) B('FRONT UNDER CARCASS ' + b.p.name + ' ' + q.p.name); }); }); });
    const Vi = DR.viewIso([-0.55, 0.78, -0.42]); orderOk(DR.solve(DR.cabBoxes(inf.r, {}), Vi), Vi, 'iso cab' + i);
    const bx = DR.cabBoxes(inf.r, { plinth:false, fit:true, c:proj.cabinets[i] }); DR.explode(inf.r, bx); orderOk(DR.solve(bx, Vi), Vi, 'exploded cab' + i);
  });
  ['lt', 'en'].forEach(lang => {
    const list = DR.sheets(proj, infos, { lang, project:proj.name, date:'2026-10-23', RM });
    list.forEach((sh, k) => {
      nSheets++;
      if (sh.error) B('SHEET ERROR ' + sh.id + ' ' + sh.error.split('\n')[0]);
      if (/NaN|undefined|Infinity/.test(sh.svg)) B('BAD NUMBER ' + sh.id + ' ' + (sh.svg.match(/.{40}(NaN|undefined|Infinity).{20}/) || [''])[0]);
      if (!sh.svg.includes('>' + (k + 1) + ' / ' + list.length + '<')) B('SHEET NUMBER ' + sh.id);
      if (out && lang === 'lt' && run < 12) fs.writeFileSync(out + '/r' + run + '_' + k + '_' + sh.id + '.svg', sh.svg);
      if (sh.cab != null) {
        const r = infos[sh.cab].r;
        if (sh.id[0] === 'c') r.panels.forEach(p => { if (!p.place) return; const want = nm(p.L) + ' × ' + nm(p.W) + ' × ' + nm(p.T);
          if (!sh.svg.includes('>' + (p.short || p.role) + '<') && !sh.svg.includes('>' + (p.short || p.role).slice(0, 10))) B('PART MISSING ' + p.name);
          if (!sh.svg.includes('>' + want + '<')) B('PART SIZE ' + p.name + ' ' + want); });
        if (sh.id[0] === 'c') (r.hardware || []).forEach((h, hi) => { const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
          const hn = esc(DR.hwText(h.item)); if (!sh.svg.includes('>' + hn + '<') && !sh.svg.includes('>' + hn.slice(0, 20))) B('FITTING NOT LISTED ' + h.item + ' / ' + hn);
          const k = DR.hwKind(h.item), letter = String.fromCharCode(65 + hi);
          if ((k === 'drawer' || k === 'leg') && !(k === 'drawer' && r.warnings.some(w => /ilgesnis nei telpa|netelpa šone|per žemas arba skyrius per siauras/.test(w))) && !sh.svg.includes('fill="#7a4d12">' + letter + '<')) B('FITTING WITHOUT BALLOON ' + h.item); });
        if (sh.id[0] === 'c') { const b = DR.cabBoxes(r, {}), bw = DR.cabBoxes(r, { worktop:true }), ex = q => [0, 1, 2].map(k2 => [Math.min(...q.map(x => x.e[k2][0])), Math.max(...q.map(x => x.e[k2][1]))]), e = ex(b), ew = ex(bw);
          [e[0][1] - e[0][0], ew[1][1] - ew[1][0], ew[2][1] - ew[2][0]].forEach(v => { if (!sh.svg.includes('>' + nm(v) + '<')) B('DIM MISSING ' + sh.id + ' ' + nm(v)); });
          if (r.worktop) { const w = r.worktop; if (!sh.svg.includes('>' + nm(w.L) + ' × ' + nm(w.W) + ' × ' + nm(w.T) + '<')) B('WORKTOP NOT LISTED ' + sh.id);
            if (!bw.some(x => x.worktop)) B('WORKTOP NOT DRAWN ' + sh.id); } }
      }
    });
    const placed = proj.layout ? RM.placed(proj) : [];
    if (placed.length && !list.some(x => x.id === 'layout')) B('NO LAYOUT SHEET');
    if (!placed.length && proj.cabinets.length > 1 && !list.some(x => x.id === 'all')) B('NO ALL-FRONTS SHEET');
    if (placed.length) RM.geo(proj.layout).forEach((g, wi) => { const on = placed.some(o => o.it.wall === wi); if (on !== list.some(x => x.id === 'wall' + wi)) B('WALL SHEET ' + wi); });
  });
}
console.log(`${nCab} cabinets, ${nSheets} sheets, ${nPairs} overlapping part pairs in drawing order, ${bad} problems`);
if (bad) console.log(K);
process.exit(bad ? 1 : 0);
