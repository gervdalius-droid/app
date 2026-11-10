// Cabinets with many parts (3 columns of GTV drawer boxes, 4 columns of drawers): every part and fitting reaches a sheet
// (the cabinet sheet or its continuation), and no text is written below the frame of any sheet; the wall and layout sheets
// list every cabinet (40 cabinets on one wall).
// usage: node test/sheet_overflow_check.js engine.js room.js drawings.js
global.window = global.window || {};
const E = require(process.argv[2]); window.DBEngine = E;
const RM = require(process.argv[3]), DR = require(process.argv[4]);
let bad = 0; const B = m => { bad++; if (bad < 20) console.log(m); };
const nm = v => String(Math.round(v * 10) / 10);
const below = svg => [...svg.matchAll(/<text[^>]* y="([\d.]+)"/g)].filter(m => +m[1] > 297 - 10 + 0.5).length;
const cab = (cols, n, hw, W) => ({ id:'k' + cols + n, name:'Big', W, H:820, D:580, thick:18, cols, colW:[], legH:100, mat:{ carc:'M', facade:'F' }, edge:{ carc:'E' },
  cnc:{ joinery:'confirmat', top:'rails', legs:true, backs:Array(cols).fill('hdf'), hinges:true },
  sections:Array.from({ length:cols }, (_, k) => Object.assign(E.newSection('drawers'), { col:k, fill:true, nDrawers:n, hw, rail:450 })) });
const cases = [cab(3, 3, 'GTV KULKINIAI H45', 1500), cab(3, 4, 'DTC PASLĖPTI', 1800), cab(4, 4, 'GTV KULKINIAI H45', 2400), cab(2, 4, 'GTV KULKINIAI H45', 1000), cab(1, 2, 'BLUM TANDEMBOX', 600)];
cases.forEach((c, ci) => { ['lt', 'en'].forEach(lang => {
  const proj = { name:'T', cabinets:[c] }, infos = [{ r:E.buildCabinet(JSON.parse(JSON.stringify(c)), 0, 'T') }];
  const list = DR.sheets(proj, infos, { lang, project:'T', date:'2026-10-27', RM }), r = infos[0].r, all = list.map(s => s.svg).join('');
  list.forEach(s => { if (s.error) B('ERROR ' + s.error.split('\n')[0]); const n = below(s.svg); if (n) B('TEXT BELOW FRAME case ' + ci + ' ' + s.id + ': ' + n); });
  r.panels.forEach(p => { const want = '>' + nm(p.L) + ' × ' + nm(p.W) + ' × ' + nm(p.T) + '<'; if (!all.includes('>' + p.short + '<')) B('PART MISSING case ' + ci + ' ' + p.short); if (!all.includes(want)) B('SIZE MISSING case ' + ci + ' ' + p.short); });
  r.hardware.forEach(h => { if (!all.includes('>' + DR.hwText(h.item).replace(/&/g, '&amp;'))) B('FITTING MISSING case ' + ci + ' ' + h.item); });
  if (ci === 2 && list.length < 2) B('NO CONTINUATION SHEET for 4 × 4 drawers');
}); });
/* 40 cabinets on one wall */
const many = { name:'M', cabinets:[], layout:{ walls:[{ len:24000 }], wallZ:1450, roomH:2600, worktop:true, items:{} } };
for (let i = 0; i < 40; i++) { const c = { id:'m' + i, name:'C' + i, W:600, H:720, D:560, thick:18, cols:1, legH:100, mat:{ carc:'M', facade:'F' }, edge:{}, cnc:{ legs:true, backs:['hdf'] }, sections:[Object.assign(E.newSection('doors'), { fill:true })] };
  many.cabinets.push(c); many.layout.items[c.id] = { wall:0, x:i * 600 }; }
const inf2 = many.cabinets.map((c, i) => ({ r:E.buildCabinet(JSON.parse(JSON.stringify(c)), i, 'M') }));
const l2 = DR.sheets(many, inf2, { lang:'lt', project:'M', date:'', RM });
['layout', 'wall0'].forEach(id => { const s = l2.find(x => x.id === id); if (!s) { B('NO SHEET ' + id); return; }
  const n = below(s.svg); if (n) B('TEXT BELOW FRAME ' + id + ': ' + n);
  const miss = []; for (let i = 0; i < 40; i++) if (!s.svg.includes('>C' + i + '<')) miss.push(i);
  if (miss.length && !s.svg.includes('>… ' + miss.length + ' ')) B('CABINETS NOT LISTED and not counted ' + id + ' ' + miss.length); });
console.log(`${cases.length} big cabinets, 40-cabinet wall: ${bad} problems`);
process.exit(bad ? 1 : 0);
