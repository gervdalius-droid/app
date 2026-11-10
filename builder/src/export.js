/* =====================================================================
   export.js — project → part list workbook (.xlsm) and CNC programs.

   The workbook copies the layout of a SWOOD report closely enough for the
   nesting app (FabFlow Nesting) to import it exactly like a SWOOD .xlsm:
     PARTLIST      header row with "DETALĖ" in column E, data: C = DB_PART name,
                   E = short name, F = material, G = length, H = width,
                   I = thickness, J = quantity; "18 mm" group rows in column B
     LABEL         10-row blocks, two labels per row band; QR formulas end in
                   &"<program id>") so the nesting app links parts to programs
     EDGEBAND      Part · Feature (EDGE1..4) · Material — EDGE1/2 long edges,
                   EDGE3/4 short edges
     STOCK_CORE    fallback list (Part C, Feature E, Material F, L I, W J, T K, Qty L)
     HARDWARE_LIST fittings counted from the cabinets
     SUMMARY       totals
   Strings are written as shared strings (the nesting reader ignores inline
   strings) and the zip is written with sizes in the local headers.
   ===================================================================== */
(function (root) {
"use strict";
var E = (typeof module !== 'undefined' && module.exports) ? require('./engine.js') : root.DBEngine;
var num = E.num;
function r1(v) { return Math.round(v * 10) / 10; }   // part list: 0.1 mm (programs keep the exact size)

/* ----------------------------------------------------------------- project */
function buildProject(col, opts) {
  opts = opts || {};
  var proj = E.safeName(opts.project || 'PROJ') || 'PROJ';
  var parts = [], files = [], warnings = [], hardware = [];
  var cabs = (col.cabinets || []).slice().sort(function (a, b) { return (a.nr || 0) - (b.nr || 0); });

  cabs.forEach(function (c) {
    var def = JSON.parse(JSON.stringify(c.def));
    var r = E.buildCabinet(def, (c.nr || 1) - 1, proj);
    var label = 'Spintelė ' + c.nr + (def.name ? ' „' + def.name + '“' : '');
    if (c.scaled) warnings.push(label + ': grupė buvo ištempta (Scale) — sąraše naudojami spintelės parametrai, ne ištempti matmenys');
    r.warnings.forEach(function (w) { warnings.push(label + ': ' + w); });
    r.hardware.forEach(function (h) { hardware.push({ item:h.item, qty:h.qty, unit:h.unit, cab:c.nr }); });
    r.panels.forEach(function (p) {
      var pr = E.programs(p);
      pr.files.forEach(function (f) { files.push({ name:f.file, text:f.text }); });
      pr.warnings.forEach(function (w) { warnings.push(label + ': ' + w); });
      if (pr.files.length > 2) warnings.push(label + ': ' + p.short + ' turi ' + pr.files.length + ' programas — etiketėje telpa 2 QR, ' + pr.files.slice(2).map(function (f) { return f.id; }).join(', ') + ' paleiskite pagal sąrašą');
      parts.push({ name:p.name, short:p.short, cab:c.nr, role:p.role, mat:p.mat || '', L:p.L, W:p.W, T:p.T, qty:1,
                   eb:{ eb1:p.eb.y0 || '', eb2:p.eb.y1 || '', eb3:p.eb.x0 || '', eb4:p.eb.x1 || '' },
                   op1:pr.files[0] ? pr.files[0].id : '', op2:pr.files[1] ? pr.files[1].id : '',
                   progs:pr.files.map(function (f) { return { id:f.id, kind:f.kind, file:f.file }; }), src:'cab',
                   pic:{ holes:p.holes.map(function (h) { return { x:h.x, y:h.y, d:h.d, face:h.face, through:!!h.through }; }),
                         edges:p.edges.map(function (e) { return { edge:e.edge, pos:e.pos, d:e.d, depth:e.depth }; }) } });
    });
  });

  /* loose panels drawn by hand: identical ones are counted together */
  var groups = {}, order = [];
  (col.loose || []).forEach(function (l) {
    var eb = l.eb || {};
    var key = [l.cab || '', l.name, l.mat, num(l.L), num(l.W), num(l.T), eb.eb1, eb.eb2, eb.eb3, eb.eb4].join('|');
    if (!groups[key]) { groups[key] = { l:l, qty:0, paths:[] }; order.push(key); }
    groups[key].qty += (+l.qty || 1); if (l.path) groups[key].paths.push(l.path);
  });
  var used = {};
  parts.forEach(function (p) { used[p.name] = 1; });
  order.forEach(function (k) {
    var g = groups[k], l = g.l, eb = l.eb || {};
    var shortBase = (l.cab ? l.cab + '-' : '') + (String(l.name || 'Detalė').replace(/_/g, '-').trim() || 'Detalė');
    var base = proj + '_' + (l.cab ? l.cab + '_' : '') + (E.safeName(l.name || 'DETALE').replace(/^_+|_+$/g, '') || 'DETALE'), nm = base, i = 2;
    while (used[nm]) nm = base + '_' + (i++);
    used[nm] = 1;
    var mat = l.mat || '';
    if (!mat) { mat = 'BE MEDŽIAGOS'; warnings.push('„' + shortBase + '“: medžiaga nenurodyta — pažymėta „BE MEDŽIAGOS“'); }
    if (l.shaped) warnings.push('„' + shortBase + '“: ne stačiakampė detalė — sąraše jos gabaritai');
    parts.push({ name:nm, short:shortBase, cab:l.cab || '', role:'', mat:mat, progs:[], L:Math.round(l.L*10)/10, W:Math.round(l.W*10)/10, T:Math.round(l.T*10)/10,
                 qty:g.qty, eb:{ eb1:eb.eb1 || '', eb2:eb.eb2 || '', eb3:eb.eb3 || '', eb4:eb.eb4 || '' }, op1:'', op2:'', src:'loose' });
  });

  /* hardware merged over the project */
  var hm = {}, ho = [];
  hardware.forEach(function (h) { var k = h.item + '|' + h.unit; if (!hm[k]) { hm[k] = { item:h.item, unit:h.unit, qty:0, cabs:[] }; ho.push(k); } hm[k].qty += h.qty; if (hm[k].cabs.indexOf(h.cab) < 0) hm[k].cabs.push(h.cab); });

  var ebLen = function (p) { return ((p.eb.eb1 ? p.L : 0) + (p.eb.eb2 ? p.L : 0) + (p.eb.eb3 ? p.W : 0) + (p.eb.eb4 ? p.W : 0)) * p.qty; };
  parts.forEach(function (p) { p.ebLen = ebLen(p); });
  warnings = warnings.filter(function (w, i) { return warnings.indexOf(w) === i; });
  return { project:proj, date:opts.date || '', parts:parts, files:files, warnings:warnings, hardware:ho.map(function (k) { return hm[k]; }) };
}

/* ----------------------------------------------------------------- sheets */
function edgeText(eb) { var s = []; ['eb1','eb2','eb3','eb4'].forEach(function (k, i) { if (eb[k]) s.push((i < 2 ? 'L' : 'W') + (i % 2 + 1)); }); return s.join(' '); }
function byThickThenName(a, b) { return (b.T - a.T) || String(a.mat).localeCompare(String(b.mat)) || ((+a.cab || 999) - (+b.cab || 999)) || a.name.localeCompare(b.name); }
function H(v) { return { v:v, b:true }; }

function sheets(pj) {
  var parts = pj.parts.slice().sort(byThickThenName);
  var title = function (name) { return [['', H(name), H(pj.project)], ['', 'Data', pj.date], ['', 'Sugeneruota', 'Dėdės Baldai spintelių kūrėjas']]; };

  /* PARTLIST */
  var pl = title('DETALIŲ SĄRAŠAS'); pl.push([]);
  pl.push([H('Nr'), H('Grupė'), H('Part'), H('Spintelė'), H('DETALĖ'), H('MEDŽIAGA'), H('ILGIS'), H('PLOTIS'), H('STORIS'), H('KIEKIS'), H('KRAŠTAI'), H('KRAŠTO MEDŽIAGA'), H('PROGRAMOS')]);
  var curT = null, nr = 0;
  parts.forEach(function (p) {
    if (p.T !== curT) { curT = p.T; pl.push(['', H(num(p.T) + ' mm')]); }
    var ebm = [p.eb.eb1, p.eb.eb2, p.eb.eb3, p.eb.eb4].filter(function (x, i, a) { return x && a.indexOf(x) === i; }).join(', ');
    pl.push([++nr, '', p.name, p.cab === '' ? '' : p.cab, p.short, p.mat, r1(p.L), r1(p.W), r1(p.T), p.qty, edgeText(p.eb), ebm, (p.progs && p.progs.length ? p.progs.map(function (f) { return f.id; }) : [p.op1, p.op2].filter(Boolean)).join(' ')]);
  });

  /* LABEL — two labels per band (A:F and H:M), 10 rows each */
  var lb = [];
  var qr = function (id) { return { f:'_xlfn.IMAGE("https://api.qrserver.com/v1/create-qr-code/?size=150x150&data="&"' + id + '")' }; };
  for (var i = 0; i < parts.length; i += 2) {
    var band = []; for (var r = 0; r < 10; r++) band.push([]);
    [parts[i], parts[i + 1]].forEach(function (p, side) {
      if (!p) return; var c = side ? 7 : 0;
      band[0][c] = '1OP'; band[0][c + 1] = p.op1 || ''; band[0][c + 5] = '2OP'; band[0][c + 6] = p.op2 || '';
      if (p.op1) band[1][c] = qr(p.op1);
      if (p.op2) band[1][c + 5] = qr(p.op2);
      band[7][c] = 'Kraštai: ' + (edgeText(p.eb) || '—');
      band[8][c] = num(r1(p.L)) + ' × ' + num(r1(p.W)) + ' × ' + num(r1(p.T)); band[8][c + 3] = p.short;
      band[9][c] = p.mat; band[9][c + 3] = p.name;
    });
    band.forEach(function (row) { for (var k = 0; k < row.length; k++) if (row[k] === undefined) row[k] = ''; lb.push(row); });
  }

  /* EDGEBAND */
  var eb = [[H('Part'), H('Feature'), H('Material'), H('Length'), H('Qty')]];
  parts.forEach(function (p) { ['eb1','eb2','eb3','eb4'].forEach(function (k, j) { if (p.eb[k]) eb.push([p.name, 'EDGE' + (j + 1), p.eb[k], r1(j < 2 ? p.L : p.W), p.qty]); }); });

  /* STOCK_CORE (nesting fallback) */
  var sc = [['', H('STOCK_CORE'), H(pj.project)], [], ['', '', H('Part'), '', H('Feature'), H('Material'), '', '', H('Length'), H('Width'), H('Thickness'), H('Qty')]];
  parts.forEach(function (p) { sc.push(['', '', p.name, '', 'CORE', p.mat, '', '', r1(p.L), r1(p.W), r1(p.T), p.qty]); });

  /* HARDWARE_LIST */
  var hw = title('FURNITŪRA'); hw.push([]); hw.push([H('Pozicija'), H('Kiekis'), H('Vnt.'), H('Spintelės')]);
  pj.hardware.forEach(function (h) { hw.push([h.item, h.qty, h.unit, h.cabs.join(', ')]); });
  hw.push([]); hw.push(['Kiekiai apskaičiuoti iš spintelių konstrukcijos — patikrinkite prieš užsakant.']);

  /* SUMMARY */
  var sm = title('SUVESTINĖ'); sm.push([]);
  var mats = {}, mo = [];
  parts.forEach(function (p) { var k = p.mat + '|' + p.T; if (!mats[k]) { mats[k] = { mat:p.mat, T:p.T, n:0, a:0 }; mo.push(k); } mats[k].n += p.qty; mats[k].a += p.L*p.W*p.qty/1e6; });
  sm.push([H('Medžiaga'), H('Storis'), H('Detalių'), H('Plotas, m²')]);
  mo.forEach(function (k) { var m = mats[k]; sm.push([m.mat, m.T, m.n, Math.round(m.a*1000)/1000]); });
  sm.push([]);
  var em = {}, eo = [];
  parts.forEach(function (p) { ['eb1','eb2','eb3','eb4'].forEach(function (k, j) { var m = p.eb[k]; if (!m) return; if (!em[m]) { em[m] = 0; eo.push(m); } em[m] += (j < 2 ? p.L : p.W)*p.qty; }); });
  sm.push([H('Krašto medžiaga'), H('Ilgis, m')]);
  eo.forEach(function (m) { sm.push([m, Math.round(em[m]/10)/100]); });
  sm.push([]);
  sm.push([H('Detalių iš viso'), parts.reduce(function (a, p) { return a + p.qty; }, 0)]);
  sm.push([H('CNC programų'), pj.files.length]);

  return [
    { name:'PARTLIST', rows:pl, cols:[5, 7, 34, 9, 20, 26, 8, 8, 8, 8, 10, 22, 40] },
    { name:'LABEL', rows:lb, cols:[12, 10, 4, 18, 6, 12, 10, 12, 10, 4, 18, 6, 12, 10] },
    { name:'HARDWARE_LIST', rows:hw, cols:[40, 10, 8, 20] },
    { name:'STOCK_CORE', rows:sc, cols:[3, 3, 34, 3, 8, 26, 3, 3, 9, 9, 10, 6] },
    { name:'EDGEBAND', rows:eb, cols:[34, 9, 26, 9, 6] },
    { name:'SUMMARY', rows:sm, cols:[34, 10, 10, 12] }
  ];
}

/* ----------------------------------------------------------------- OOXML (xlsm, no macros) */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); }
function colName(c) { var s = ''; c++; while (c > 0) { var m = (c - 1) % 26; s = String.fromCharCode(65 + m) + s; c = Math.floor((c - 1)/26); } return s; }

function workbookEntries(sheetList) {
  var ss = [], ssi = {};
  var sidx = function (s) { s = String(s); if (ssi[s] === undefined) { ssi[s] = ss.length; ss.push(s); } return ssi[s]; };
  var sheetXml = sheetList.map(function (sh) {
    var rows = sh.rows.map(function (row, ri) {
      var cells = [];
      row.forEach(function (cell, ci) {
        if (cell === '' || cell === null || cell === undefined) return;
        var ref = colName(ci) + (ri + 1), st = '';
        var v = cell;
        if (typeof cell === 'object') { if (cell.b) st = ' s="1"'; if (cell.f) { cells.push('<c r="' + ref + '" t="str"' + st + '><f>' + esc(cell.f) + '</f></c>'); return; } v = cell.v; }
        if (typeof v === 'number' && isFinite(v)) cells.push('<c r="' + ref + '"' + st + '><v>' + v + '</v></c>');
        else cells.push('<c r="' + ref + '" t="s"' + st + '><v>' + sidx(v) + '</v></c>');
      });
      return cells.length ? '<row r="' + (ri + 1) + '">' + cells.join('') + '</row>' : '';
    }).join('');
    var cols = sh.cols ? '<cols>' + sh.cols.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols>' : '';
    return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' + cols + '<sheetData>' + rows + '</sheetData></worksheet>';
  });
  var e = {};
  e['[Content_Types].xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.ms-excel.sheet.macroEnabled.main+xml"/>' +
    sheetList.map(function (s, i) { return '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>'; }).join('') +
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    '<Override PartName="/xl/sharedStrings.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml"/></Types>';
  e['_rels/.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  e['xl/workbook.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' +
    sheetList.map(function (s, i) { return '<sheet name="' + esc(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>'; }).join('') + '</sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>';
  e['xl/_rels/workbook.xml.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    sheetList.map(function (s, i) { return '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>'; }).join('') +
    '<Relationship Id="rId' + (sheetList.length + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' +
    '<Relationship Id="rId' + (sheetList.length + 2) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings" Target="sharedStrings.xml"/></Relationships>';
  sheetXml.forEach(function (x, i) { e['xl/worksheets/sheet' + (i + 1) + '.xml'] = x; });
  e['xl/styles.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="2"><font><sz val="10"/><name val="Arial"/></font><font><b/><sz val="10"/><name val="Arial"/></font></fonts>' +
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>' +
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
    '<cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs>' +
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
  e['xl/sharedStrings.xml'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + ss.length + '" uniqueCount="' + ss.length + '">' +
    ss.map(function (s) { return '<si><t xml:space="preserve">' + esc(s) + '</t></si>'; }).join('') + '</sst>';
  return e;
}

/* project → input of report.js (the DB_PartList-identical ReportLists workbook) */
function reportInput(pj) {
  return { project:pj.project, hardware:pj.hardware.map(function (h) { return { item:h.item, qty:h.qty }; }),
    parts:pj.parts.map(function (p) {
      return { solid:p.name, dbpart:p.name, name:p.short, mat:p.mat, L:r1(p.L), W:r1(p.W), T:r1(p.T), qty:p.qty,
               eb:{ F:p.eb.eb1 || '', B:p.eb.eb2 || '', L:p.eb.eb3 || '', R:p.eb.eb4 || '' }, progs:p.progs || [], pic:p.pic || null };
    }) };
}
var api = { buildProject:buildProject, sheets:sheets, workbookEntries:workbookEntries, edgeText:edgeText, reportInput:reportInput };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBExport = api;
})(typeof window !== 'undefined' ? window : this);
