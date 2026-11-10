// English mode: every engine / program / project warning must come out without Lithuanian left in it.
// usage: node test/warn_en_check.js engine.js [runs]
const fs = require('fs'), path = require('path');
const E = require(process.argv[2]);
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const a = html.indexOf('var WARN_EN = '), b = html.indexOf('function hingeLabel(v)');
const S = { lang:'en' };
const wTxt = new Function('S', html.slice(a, b) + '; return wTxt;')(S);
// random cabinets and constructions: the generators of fuzz_check.js
const fz = fs.readFileSync(path.join(__dirname, 'fuzz_check.js'), 'utf8');
let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }; const pick = a2 => a2[Math.floor(rnd() * a2.length)];
const gen = new Function('E', 'rnd', 'pick', fz.slice(fz.indexOf('const weird'), fz.indexOf('function cab()')).replace('const fin', 'var fin') + fz.slice(fz.indexOf('function cab()'), fz.indexOf('const N =')) + '; return { cab, boxc };')(E, rnd, pick);
const LT = /[ąčęėįšųūžĄČĘĖĮŠŲŪŽ]|\b(ir|su|nėra|yra|nuo|už|kad|arba|tik|mm aukštyje|patikrinkite|praleista|nepridėt\w*|jungt\w*|lentyn\w*|skyl\w*|plokšt\w*|dugn\w*|šon\w*|bėgel\w*|stalč\w*|fasad\w*|lankst\w*|kraš\w*|vietos|anga|angos|netinkami|matmenys|tarp|juosta|kampas|durys|sekcija|kolona|pertvara|dugnas|viršus|nugara|kairė|dešinė|priekis)\b/
const KEEP = /DTC PASLĖPTI|KT\. PASLĖPTO MONTAVIMO|BE FURNITŪROS|KRAŠTAS|BE MEDŽIAGOS|GUOLINIAI|KULKINIAI|SONAS|STALC|DUGNAS|PRIEKIS|GALAS|NUGARA|VIRSUS|LENTYNA|PERTVARA|FASADAS|DURYS|STALVIRSIS|PLAUSAS|KAIRE|DESINE/g;
const seen = {}; let bad = 0, total = 0;
function check(w) {
  total++; const en = wTxt(w), probe = en.replace(KEEP, '').replace(/“[^”]*”/g, '""');
  const m = LT.exec(probe);
  if (m) { const k = w.replace(/[\d.,]+/g, '#').slice(0, 90); if (!seen[k]) { seen[k] = 1; bad++; console.log('LT LEFT [' + m[0] + ']\n  lt: ' + w + '\n  en: ' + en); } }
}
const N = +process.argv[3] || 3000;
for (let run = 0; run < N; run++) {
  const c = rnd() < 0.7 ? gen.cab() : gen.boxc(); let r;
  try { r = E.buildCabinet(c, 0, 'P'); } catch (e) { continue; }
  (r.warnings || []).forEach(check);
  r.panels.forEach(p => { try { E.programs(p).warnings.forEach(check); } catch (e) {} });
}
['„1-STALVIRSIS“ kampe susiduria su „2-STALVIRSIS“ — sutrumpintas 38 mm (pradžioje), patikrinkite sujungimą', '„1-STALVIRSIS-1-2“: stalviršis 4300 mm ilgesnis nei 4100 — patikrinkite plokštės ilgį arba numatykite sujungimą',
 '„1-DETALE“: papildoma detalė be ilgio ar pločio — nepridėta, įrašykite matmenis', '„2-X“: kiekis 0 — nepridėta', 'Spintelė 1 „A“: 1-DUGNAS turi 3 programas — etiketėje telpa 2 QR, A, B paleiskite pagal sąrašą',
 '„1-X“: medžiaga nenurodyta — pažymėta „BE MEDŽIAGOS“'].forEach(check);
console.log('warnings checked', total, '· with Lithuanian left', bad); process.exit(bad ? 1 : 0);
