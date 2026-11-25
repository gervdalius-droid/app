/* =====================================================================
   report.js — ReportLists_to_Excel.xlsm exactly as the SolidWorks macro
   DB_PartList v18 writes it: the same template workbook (a previous
   report), the same PARTLIST rows and groups, the same LABEL blocks
   (1OP / 2OP QR, LAMINUOJASI texts, sizes, material, solid name) and the
   same black-only label pictures (outline 0.75 pt, banded edges 2.25 pt,
   holes as ovals – dashed when drilled from the other face, edge bores
   as dashed rectangles). EDGEBAND, STOCK_CORE, HARDWARE(_LIST) filled,
   SUMMARY pivots refreshed when Excel opens the file.

   The layout rules were measured on a v18 report (DiG_Virtuve, Oct 2026):
     PARTLIST picture box 120.5 × 54 pt, centre B+63.25 pt / row top+32.2 pt
     LABEL    picture box 109   × 54 pt, centre C+57.5  pt / 3rd label row+30 pt
     scale = min(box width / LENGTH, 54 / WIDTH), LENGTH horizontal, F edge at the bottom
     column width in points = characters × 5.5
   ===================================================================== */
(function (root) {
"use strict";
var JSZipLib = (typeof module !== 'undefined' && module.exports) ? require('jszip') : root.JSZip;
var EMU = 12700;

/* ----------------------------------------------------------------- xml helpers */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ''); }
function unesc(s) { return String(s).replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, function (m, d) { return String.fromCharCode(+d); }).replace(/&amp;/g, '&'); }
function colNum(L) { var n = 0; for (var i = 0; i < L.length; i++) n = n*26 + (L.charCodeAt(i) - 64); return n; }
function colName(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1)/26); } return s; }
function splitRef(ref) { var m = /^([A-Z]+)(\d+)$/.exec(ref); return { col:colNum(m[1]), row:+m[2] }; }
function n6(v) { return Math.round(v*1e6)/1e6; }
function fmt1(v) { return (Math.round(v*10)/10).toFixed(1); }

/* rows of a sheet: { r: { attrs, cells:[{ref,col,xml,s}] } } */
function parseRows(xml) {
  var rows = {}, re = /<row r="(\d+)"([^>]*?)(\/>|>([\s\S]*?)<\/row>)/g, m;
  while ((m = re.exec(xml))) {
    var r = +m[1], attrs = m[2], body = m[4] || '', cells = [], cm, cre = /<c r="([A-Z]+\d+)"([^>]*?)(\/>|>([\s\S]*?)<\/c>)/g;
    while ((cm = cre.exec(body))) { var sm = / s="(\d+)"/.exec(cm[2]); cells.push({ ref:cm[1], col:splitRef(cm[1]).col, xml:cm[0], s:sm ? sm[1] : null }); }
    rows[r] = { attrs:attrs, cells:cells };
  }
  return rows;
}
function styleMap(row) { var m = {}; (row ? row.cells : []).forEach(function (c) { m[c.col] = c.s; }); return m; }
function attr(a, k, v) { var re = new RegExp(' ' + k + '="[^"]*"'); return re.test(a) ? a.replace(re, ' ' + k + '="' + v + '"') : a + ' ' + k + '="' + v + '"'; }

/* shared strings */
function SST(xml) {
  var items = [], map = {};
  var body = /<sst[^>]*>([\s\S]*)<\/sst>/.exec(xml);
  var re = /<si>([\s\S]*?)<\/si>/g, m;
  while ((m = re.exec(body ? body[1] : ''))) {
    items.push(m[0]);
    var txt = ''; m[1].replace(/<t(?: [^>]*)?>([\s\S]*?)<\/t>/g, function (_, t) { txt += unesc(t); return _; });
    if (map[txt] === undefined) map[txt] = items.length - 1;
  }
  this.items = items; this.map = map; this.refs = 0;
}
SST.prototype.idx = function (s) {
  s = String(s); this.refs++;
  if (this.map[s] === undefined) { this.items.push('<si><t xml:space="preserve">' + esc(s) + '</t></si>'); this.map[s] = this.items.length - 1; }
  return this.map[s];
};
SST.prototype.xml = function () {
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="' + Math.max(this.refs, this.items.length) + '" uniqueCount="' + this.items.length + '">' + this.items.join('') + '</sst>';
};

/* cell writers */
function cEmpty(ref, s) { return '<c r="' + ref + '"' + (s != null ? ' s="' + s + '"' : '') + '/>'; }
function cNum(ref, s, v) { return '<c r="' + ref + '"' + (s != null ? ' s="' + s + '"' : '') + '><v>' + n6(v) + '</v></c>'; }
function cStr(ref, s, v, sst) { return '<c r="' + ref + '"' + (s != null ? ' s="' + s + '"' : '') + ' t="s"><v>' + sst.idx(v) + '</v></c>'; }
function cF(ref, s, f, str) { return '<c r="' + ref + '"' + (s != null ? ' s="' + s + '"' : '') + (str ? ' t="str"' : '') + '><f>' + esc(f) + '</f></c>'; }
function cell(ref, s, v, sst) {
  if (v === undefined || v === null || v === '') return cEmpty(ref, s);
  if (typeof v === 'object' && v.f) return cF(ref, s, v.f, v.str);
  if (typeof v === 'number') return isFinite(v) ? cNum(ref, s, v) : cEmpty(ref, s);
  return cStr(ref, s, v, sst);
}
function rowXml(r, attrs, cellsXml) { return '<row r="' + r + '"' + attrs + (cellsXml ? '>' + cellsXml + '</row>' : '/>'); }
/* a template row moved to row r: cell refs renumbered, cells in `clear` columns lose their value, `put` sets values */
function moveRow(row, r, put, clearFn, sst) {
  var seen = {}, out = [];
  row.cells.forEach(function (c) {
    var L = colName(c.col), ref = L + r; seen[c.col] = 1;
    if (put[c.col] !== undefined) out.push({ col:c.col, x:cell(ref, c.s, put[c.col], sst) });
    else if (clearFn(c.col)) out.push({ col:c.col, x:cEmpty(ref, c.s) });
    else out.push({ col:c.col, x:c.xml.replace(/r="[A-Z]+\d+"/, 'r="' + ref + '"').replace(/ (vm|cm)="\d+"/g, '') });
  });
  Object.keys(put).forEach(function (k) { if (!seen[k] && put[k] !== undefined && put[k] !== '') out.push({ col:+k, x:cell(colName(+k) + r, null, put[k], sst) }); });
  out.sort(function (a, b) { return a.col - b.col; });
  return rowXml(r, row.attrs, out.map(function (o) { return o.x; }).join(''));
}
function shiftRange(ref, d) { return ref.replace(/(\$?[A-Z]+\$?)(\d+)/g, function (m, c, n) { return c + (+n + d); }); }

/* ----------------------------------------------------------------- sheet geometry (points) */
function Geom(sheetXml, rowHeights) {
  var fp = /<sheetFormatPr([^>]*)>/.exec(sheetXml) || ['', ''];
  var dcw = +((/defaultColWidth="([\d.]+)"/.exec(fp[1]) || [0, 8.43])[1]);
  var drh = +((/defaultRowHeight="([\d.]+)"/.exec(fp[1]) || [0, 15])[1]);
  var widths = {};
  (/<cols>([\s\S]*?)<\/cols>/.exec(sheetXml) || ['', ''])[1].replace(/<col ([^>]*)\/>/g, function (_, a) {
    var mn = +/min="(\d+)"/.exec(a)[1], mx = +/max="(\d+)"/.exec(a)[1], w = +((/width="([\d.]+)"/.exec(a) || [0, dcw])[1]), hid = / hidden="1"/.test(a);
    for (var i = mn; i <= Math.min(mx, 200); i++) widths[i] = hid ? 0 : w*5.5;
    return _;
  });
  this.cw = function (c) { return widths[c] !== undefined ? widths[c] : dcw*5.5; };
  this.rh = function (r) { return rowHeights[r] !== undefined ? rowHeights[r] : drh; };
  var cs = [0, 0]; for (var c = 1; c <= 200; c++) cs[c + 1] = cs[c] + this.cw(c);
  this.colStart = function (c) { return cs[c]; };
  var rt = [0, 0]; this.rowTop = function (r) { while (rt.length <= r) { var k = rt.length - 1; rt.push(rt[k] + this.rh(k)); } return rt[r]; };
}
Geom.prototype.anchorX = function (x) { var c = 1; while (this.colStart(c + 1) <= x + 1e-9 && c < 199) c++; return { col:c - 1, off:Math.round((x - this.colStart(c))*EMU) }; };
Geom.prototype.anchorY = function (y) { var r = 1; while (this.rowTop(r + 1) <= y + 1e-9 && r < 1e6) r++; return { row:r - 1, off:Math.round((y - this.rowTop(r))*EMU) }; };

/* ----------------------------------------------------------------- picture shapes (black only, as DB_PartList) */
var STY_SP = '<xdr:style><a:lnRef idx="2"><a:schemeClr val="accent1"><a:shade val="15000"/></a:schemeClr></a:lnRef><a:fillRef idx="1"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></xdr:style><xdr:txBody><a:bodyPr vertOverflow="clip" horzOverflow="clip" rtlCol="0" anchor="t"/><a:lstStyle/><a:p><a:pPr algn="l"/><a:endParaRPr lang="en-US" sz="1100"/></a:p></xdr:txBody>';
var STY_LN = '<xdr:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="0"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></xdr:style>';
function anchor(g, x, y, w, h, inner) {
  var a = g.anchorX(x), b = g.anchorY(y), c = g.anchorX(x + w), d = g.anchorY(y + h);
  return '<xdr:twoCellAnchor><xdr:from><xdr:col>' + a.col + '</xdr:col><xdr:colOff>' + a.off + '</xdr:colOff><xdr:row>' + b.row + '</xdr:row><xdr:rowOff>' + b.off + '</xdr:rowOff></xdr:from>' +
    '<xdr:to><xdr:col>' + c.col + '</xdr:col><xdr:colOff>' + c.off + '</xdr:colOff><xdr:row>' + d.row + '</xdr:row><xdr:rowOff>' + d.off + '</xdr:rowOff></xdr:to>' + inner + '<xdr:clientData/></xdr:twoCellAnchor>';
}
function xfrm(x, y, w, h) { return '<a:xfrm><a:off x="' + Math.round(x*EMU) + '" y="' + Math.round(y*EMU) + '"/><a:ext cx="' + Math.round(w*EMU) + '" cy="' + Math.round(h*EMU) + '"/></a:xfrm>'; }
function Shapes(g) { this.g = g; this.id = 2; this.out = []; }
Shapes.prototype.box = function (name, x, y, w, h) {
  this.out.push(anchor(this.g, x, y, w, h, '<xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="' + (this.id++) + '" name="' + name + '"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>' + xfrm(x, y, w, h) +
    '<a:prstGeom prst="rect"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:ln w="12700" cap="flat" cmpd="sng" algn="ctr"><a:noFill/><a:prstDash val="solid"/><a:miter lim="800000"/></a:ln><a:effectLst/></xdr:spPr>' + STY_SP + '</xdr:sp>'));
};
Shapes.prototype.line = function (name, x1, y1, x2, y2, wEmu, dash) {   // drawn in ascending order, so nothing is flipped
  var x = Math.min(x1, x2), y = Math.min(y1, y2), w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
  this.out.push(anchor(this.g, x, y, w, h, '<xdr:cxnSp macro=""><xdr:nvCxnSpPr><xdr:cNvPr id="' + (this.id++) + '" name="' + name + '"/><xdr:cNvCxnSpPr/></xdr:nvCxnSpPr><xdr:spPr>' + xfrm(x, y, w, h) +
    '<a:prstGeom prst="line"><a:avLst/></a:prstGeom><a:ln w="' + wEmu + '"><a:solidFill><a:srgbClr val="000000"/></a:solidFill>' + (dash ? '<a:prstDash val="dash"/>' : '') + '</a:ln></xdr:spPr>' + STY_LN + '</xdr:cxnSp>'));
};
Shapes.prototype.oval = function (name, cx, cy, dia, dash) {
  var x = cx - dia/2, y = cy - dia/2;
  this.out.push(anchor(this.g, x, y, dia, dia, '<xdr:sp macro="" textlink=""><xdr:nvSpPr><xdr:cNvPr id="' + (this.id++) + '" name="' + name + '"/><xdr:cNvSpPr/></xdr:nvSpPr><xdr:spPr>' + xfrm(x, y, dia, dia) +
    '<a:prstGeom prst="ellipse"><a:avLst/></a:prstGeom><a:solidFill><a:srgbClr val="FFFFFF"/></a:solidFill><a:ln w="6350"><a:solidFill><a:srgbClr val="000000"/></a:solidFill>' + (dash ? '<a:prstDash val="dash"/>' : '') + '</a:ln></xdr:spPr>' + STY_SP + '</xdr:sp>'));
};
/* one panel picture: box centre (cx, cy), box size bw × bh; part = { L, W, pic:{holes, edges}, eb:{F,B,L,R} } */
var MIN_MARK = 2.4, W_OUT = 9525, W_EB = 28575, W_DASH = 6350;
function drawPanel(sh, tag, part, cx, cy, bw, bh) {
  var L = +part.L, W = +part.W; if (!(L > 0 && W > 0)) return;
  var s = Math.min(bw/L, bh/W), pw = L*s, ph = W*s, x0 = cx - pw/2, y0 = cy - ph/2, x1 = x0 + pw, y1 = y0 + ph, k = 0;
  var nm = function () { return tag + '_' + (k++); };
  var X = function (x) { return x0 + x*s; }, Y = function (y) { return y1 - y*s; };   // F edge (panel y = 0) at the bottom
  sh.box(nm(), x0, y0, pw, ph);
  sh.line(nm(), x0, y0, x1, y0, W_OUT); sh.line(nm(), x0, y0, x0, y1, W_OUT); sh.line(nm(), x0, y1, x1, y1, W_OUT); sh.line(nm(), x1, y0, x1, y1, W_OUT);
  var pic = part.pic || {};
  (pic.holes || []).forEach(function (h) { sh.oval(nm(), X(h.x), Y(h.y), Math.max(h.d*s, MIN_MARK), h.face === 'B' && !h.through); });
  (pic.edges || []).forEach(function (e) {
    var dw = Math.max(e.d*s, MIN_MARK), dl = e.depth*s, a, b, c, d;
    if (e.edge === 'x0' || e.edge === 'x1') {
      var yc = Y(e.pos); a = e.edge === 'x0' ? x0 : x1 - dl; c = a + dl; b = yc - dw/2; d = yc + dw/2;
      sh.line(nm(), a, b, c, b, W_DASH, 1); sh.line(nm(), a, d, c, d, W_DASH, 1); sh.line(nm(), a, b, a, d, W_DASH, 1); sh.line(nm(), c, b, c, d, W_DASH, 1);
    } else {
      var xc = X(e.pos); a = xc - dw/2; c = xc + dw/2; b = e.edge === 'y1' ? y0 : y1 - dl; d = b + dl;
      sh.line(nm(), a, b, a, d, W_DASH, 1); sh.line(nm(), c, b, c, d, W_DASH, 1); sh.line(nm(), a, d, c, d, W_DASH, 1); sh.line(nm(), a, b, c, b, W_DASH, 1);
    }
  });
  var eb = part.eb || {};
  if (eb.L) sh.line(nm(), x0, y0, x0, y1, W_EB);
  if (eb.R) sh.line(nm(), x1, y0, x1, y1, W_EB);
  if (eb.B) sh.line(nm(), x0, y0, x1, y0, W_EB);
  if (eb.F) sh.line(nm(), x0, y1, x1, y1, W_EB);
}

/* ----------------------------------------------------------------- order (as the macro: thickness ↓, material, length ↓, width ↓, part code) */
function binCmp(a, b) { a = String(a); b = String(b); return a < b ? -1 : a > b ? 1 : 0; }   // VBA binary text compare
function sortParts(parts) {
  return parts.slice().sort(function (a, b) {
    return (b.T - a.T) || binCmp(a.mat, b.mat) || (b.L - a.L) || (b.W - a.W) || binCmp(a.dbpart, b.dbpart);
  });
}
function qrF(id) { return { f:'_xlfn.IMAGE("https://quickchart.io/qr?text=' + encodeURIComponent(id).replace(/%2F/g, '/') + '")' }; }

/* ----------------------------------------------------------------- main */
async function buildReport(tplBytes, pj, opts) {
  opts = opts || {};
  var zip = await JSZipLib.loadAsync(tplBytes);
  var rd = function (n) { var f = zip.file(n); return f ? f.async('string') : Promise.resolve(null); };
  var wr = function (n, s) { zip.file(n, s); };

  /* the template may be a full report: drop cached rich values (QR pictures), calc chain */
  var wbRels = await rd('xl/_rels/workbook.xml.rels'), ct = await rd('[Content_Types].xml');
  var richImgs = [], rir = await rd('xl/richData/_rels/rdRichValueWebImage.xml.rels');
  if (rir) rir.replace(/Target="\.\.\/media\/([^"]+)"/g, function (_, f) { richImgs.push('xl/media/' + f); return _; });
  Object.keys(zip.files).forEach(function (n) { if (/^xl\/richData\//.test(n) || n === 'xl/metadata.xml' || n === 'xl/calcChain.xml' || richImgs.indexOf(n) >= 0) zip.remove(n); });
  wbRels = wbRels.replace(/<Relationship [^>]*Target="(?:metadata\.xml|calcChain\.xml|richData\/[^"]+)"[^>]*\/>/g, '');
  ct = ct.replace(/<Override PartName="\/xl\/(?:metadata\.xml|calcChain\.xml|richData\/[^"]+)"[^>]*\/>/g, '');
  wr('xl/_rels/workbook.xml.rels', wbRels); wr('[Content_Types].xml', ct);

  var wbXml = await rd('xl/workbook.xml');
  var sheetPath = {};
  wbXml.replace(/<sheet name="([^"]+)"[^>]*r:id="(rId\d+)"\/>/g, function (_, name, rid) {
    var m = new RegExp('<Relationship (?:[^>]*?)Id="' + rid + '"[^>]*?Target="([^"]+)"').exec(wbRels) || new RegExp('<Relationship (?:[^>]*?)Target="([^"]+)"[^>]*?Id="' + rid + '"').exec(wbRels);
    if (m) sheetPath[name] = 'xl/' + m[1].replace(/^\//, '').replace(/^xl\//, '');
    return _;
  });
  var sst = new SST(await rd('xl/sharedStrings.xml'));
  var proj = pj.project || 'PROJEKTAS';
  var parts = sortParts(pj.parts.map(function (p) {
    return { solid:p.solid, dbpart:p.dbpart, name:p.name, mat:p.mat || '', L:+p.L, W:+p.W, T:+p.T, qty:Math.max(1, Math.round(+p.qty || 1)),
             eb:p.eb || {}, ebInfo:p.ebInfo || {}, stockRef:p.stockRef || '', progs:p.progs || [], pic:p.pic || null };
  }));
  var drawingOf = async function (sheetFile) {
    var rels = await rd(sheetFile.replace('worksheets/', 'worksheets/_rels/') + '.rels');
    var m = rels && /Target="\.\.\/drawings\/(drawing\d+\.xml)"/.exec(rels);
    return m ? 'xl/drawings/' + m[1] : null;
  };
  var emptyDrawing = function (xml) { var keep = (xml.match(/<xdr:(twoCellAnchor|oneCellAnchor)[^>]*>[\s\S]*?<\/xdr:\1>/g) || []).filter(function (a) { return a.indexOf('<xdr:pic>') >= 0 && !/name="PIC_/.test(a); });
    return { head:xml.slice(0, xml.indexOf('>', xml.indexOf('<xdr:wsDr')) + 1), keep:keep.join('') }; };

  /* ================= PARTLIST ================= */
  var plPath = sheetPath.PARTLIST, pl = await rd(plPath), plRows = parseRows(pl);
  var head = pl.slice(0, pl.indexOf('<sheetData>') + 11), tail = pl.slice(pl.indexOf('</sheetData>'));
  var out = [], heights = {};
  for (var r = 1; r <= 9; r++) if (plRows[r]) {
    var put = {}; if (r === 1) put[10] = proj; if (r === 5) put[17] = proj;
    out.push(moveRow(plRows[r], r, put, function () { return false; }, sst));
    heights[r] = +((/ ht="([\d.]+)"/.exec(plRows[r].attrs) || [0, 15])[1]);
  }
  var gFirst = plRows[10], gNext = plRows[12] || plRows[10], dRow = plRows[11] || plRows[13];
  var settingsCells = {};   // template cells right of the table in rows 10-12 (SETTINGS_* switches)
  [10, 11, 12].forEach(function (rr) { settingsCells[rr] = (plRows[rr] ? plRows[rr].cells : []).filter(function (c) { return c.col >= 24 && c.col <= 28; }); });
  var ds = styleMap(dRow), gs1 = styleMap(gFirst), gs2 = styleMap(gNext);
  var dAttrs = dRow.attrs, gAttrs = gFirst.attrs;
  var merges = [], plPics = [], row = 10, lastKey = null, firstGroup = true;
  var rowCells = function (rr, list) {   // append the template settings cells for rows 10-12
    (settingsCells[rr] || []).forEach(function (c) { list.push({ col:c.col, x:c.xml.replace(/r="[A-Z]+\d+"/, 'r="' + colName(c.col) + rr + '"') }); });
    list.sort(function (a, b) { return a.col - b.col; });
    return list.map(function (o) { return o.x; }).join('');
  };
  parts.forEach(function (p) {
    var key = p.T + '|' + p.mat;
    if (key !== lastKey) {
      lastKey = key; var gsm = firstGroup ? gs1 : gs2; firstGroup = false;
      var list = [{ col:1, x:cEmpty('A' + row, gsm[1]) }, { col:2, x:cell('B' + row, gsm[2], (Math.round(p.T*10)/10) + ' mm', sst) }];
      for (var c = 3; c <= 18; c++) list.push({ col:c, x:cEmpty(colName(c) + row, gsm[c]) });
      for (var c2 = 19; c2 <= 23; c2++) if (gsm[c2]) list.push({ col:c2, x:cEmpty(colName(c2) + row, gsm[c2]) });
      out.push(rowXml(row, gAttrs, rowCells(row, list))); heights[row] = +((/ ht="([\d.]+)"/.exec(gAttrs) || [0, 24.9])[1]);
      merges.push('B' + row + ':R' + row); row++;
    }
    var v = { 1:{ f:'D' + row, str:1 }, 2:'', 3:p.solid, 4:p.dbpart, 5:p.name, 6:p.mat, 7:p.L, 8:p.W, 9:p.T, 10:p.qty,
              11:p.eb.F || '', 12:p.eb.B || '', 13:p.eb.L || '', 14:p.eb.R || '', 15:'', 16:p.name, 17:p.solid, 18:{ f:'$Q$5&""&(ROW()-9)', str:1 } };
    var list2 = [];
    for (var c3 = 1; c3 <= 18; c3++) list2.push({ col:c3, x:cell(colName(c3) + row, ds[c3], v[c3], sst) });
    for (var c4 = 19; c4 <= 23; c4++) if (ds[c4]) list2.push({ col:c4, x:cEmpty(colName(c4) + row, ds[c4]) });
    out.push(rowXml(row, dAttrs, rowCells(row, list2))); heights[row] = +((/ ht="([\d.]+)"/.exec(dAttrs) || [0, 60])[1]);
    plPics.push({ row:row, part:p }); row++;
  });
  for (var rr2 = row; rr2 <= 12; rr2++) if (settingsCells[rr2] && settingsCells[rr2].length) out.push(rowXml(rr2, '', rowCells(rr2, [])));
  var lastPl = Math.max(row - 1, 9);
  var tplMerges = (pl.match(/<mergeCell ref="([^"]+)"\/>/g) || []).map(function (m) { return /ref="([^"]+)"/.exec(m)[1]; }).filter(function (m) { return +/\d+/.exec(m)[0] <= 9; });
  merges = tplMerges.concat(merges);
  tail = tail.replace(/<mergeCells[\s\S]*?<\/mergeCells>/, '<mergeCells count="' + merges.length + '">' + merges.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells>');
  tail = tail.replace(/<conditionalFormatting sqref="([^"]+)">/g, function (m0, sq) {   // status rules follow the data rows
    var first = sq.split(' ')[0], rr = +/\d+/.exec(first)[0]; if (rr <= 9) return m0;
    var cols = first.replace(/\d+/g, '').split(':'); return '<conditionalFormatting sqref="' + cols[0] + '10' + (cols[1] ? ':' + cols[1] : ':' + cols[0]) + lastPl + '">';
  });
  head = head.replace(/<dimension ref="[^"]*"\/>/, '<dimension ref="A1:AI' + lastPl + '"/>');
  wr(plPath, head + out.join('') + tail);
  var plGeom = new Geom(pl, heights);
  var plDrawPath = await drawingOf(plPath);
  if (plDrawPath) {
    var d1 = emptyDrawing(await rd(plDrawPath)), sh1 = new Shapes(plGeom); sh1.id = 1000;
    plPics.forEach(function (q) { drawPanel(sh1, 'PIC_B' + q.row, q.part, plGeom.colStart(2) + 3 + 120.5/2, plGeom.rowTop(q.row) + 32.2, 120.5, 54); });
    wr(plDrawPath, d1.head + d1.keep + sh1.out.join('') + '</xdr:wsDr>');
  }

  /* ================= LABEL ================= */
  var lbPath = sheetPath.LABEL, lb = await rd(lbPath), lbRows = parseRows(lb);
  var lhead = lb.slice(0, lb.indexOf('<sheetData>') + 11), ltail = lb.slice(lb.indexOf('</sheetData>'));
  var labels = parts.slice();   // one label per PARTLIST row, as DB_PartList (the quantity is on the label's part list row)
  var nBlocks = Math.ceil(labels.length / 2), lout = [], lheights = {}, lmerges = [], lpics = [];
  var tplMergesL = (lb.match(/<mergeCell ref="([^"]+)"\/>/g) || []).map(function (m) { return /ref="([^"]+)"/.exec(m)[1]; });
  var mBlock1 = tplMergesL.filter(function (m) { return +/\d+/.exec(m)[0] <= 10; });
  var mBlock2 = tplMergesL.filter(function (m) { var n = +/\d+/.exec(m)[0]; return n >= 11 && n <= 20; });
  if (!mBlock2.length) mBlock2 = mBlock1.filter(function (m) { return colNum(/[A-Z]+/.exec(m)[0]) <= 14; }).map(function (m) { return shiftRange(m, 10); });
  var labelArea = function (c) { return c <= 14; };
  for (var b = 0; b < nBlocks; b++) {
    var base = 10*b + 1, L = labels[2*b], R = labels[2*b + 1];
    for (var i = 0; i < 10; i++) {
      var tr = b === 0 ? lbRows[1 + i] : (lbRows[11 + i] || lbRows[1 + i]), rnum = base + i, put = {};
      var side = function (p, off) {
        if (!p) { if (i === 1) { put[1 + off] = ''; put[6 + off] = ''; } return; }
        if (i === 1) { put[1 + off] = '1OP'; put[2 + off] = p.dbpart; put[6 + off] = '2OP'; }
        if (i === 2) {
          put[1 + off] = qrF(p.progs[0] ? p.progs[0].id : p.dbpart + '_1OP');
          put[6 + off] = p.progs[1] ? qrF(p.progs[1].id) : '';
          put[2 + off] = p.eb.L ? 'LAMINUOJASI' : ''; put[3 + off] = p.eb.B ? 'LAMINUOJASI' : ''; put[5 + off] = p.eb.R ? 'LAMINUOJASI' : '';
        }
        if (i === 7) put[3 + off] = p.eb.F ? 'LAMINUOJASI' : '';
        if (i === 8) { put[1 + off] = fmt1(p.L) + 'x' + fmt1(p.W) + 'x' + fmt1(p.T); put[4 + off] = p.name; }
        if (i === 9) { put[1 + off] = 'MAT: ' + p.mat; put[4 + off] = p.solid; }
      };
      side(L, 0); side(R, 7);
      lout.push(moveRow(tr, rnum, put, function (c) { return labelArea(c) && !(i === 1 && (c === 1 || c === 6 || c === 8 || c === 13)); }, sst));
      lheights[rnum] = +((/ ht="([\d.]+)"/.exec(tr.attrs) || [0, 15])[1]);
    }
    (b === 0 ? mBlock1 : mBlock2.map(function (m) { return shiftRange(m, 10*(b - 1)); })).forEach(function (m) { lmerges.push(m); });
    if (L) lpics.push({ col:3, row:base + 3, part:L });
    if (R) lpics.push({ col:10, row:base + 3, part:R });
  }
  var lastLb = Math.max(10*nBlocks, 1);
  ltail = ltail.replace(/<mergeCells[\s\S]*?<\/mergeCells>/, lmerges.length ? '<mergeCells count="' + lmerges.length + '">' + lmerges.map(function (m) { return '<mergeCell ref="' + m + '"/>'; }).join('') + '</mergeCells>' : '');
  ltail = ltail.replace(/<conditionalFormatting sqref="([^"]+)">[\s\S]*?<\/conditionalFormatting>/g, function (m0, sq) { return +/\d+/.exec(sq)[0] <= 10 ? m0 : ''; });
  lhead = lhead.replace(/<dimension ref="[^"]*"\/>/, '<dimension ref="A1:AE' + lastLb + '"/>').replace(/ topLeftCell="[^"]*"/, '').replace(/<selection [^>]*\/>/, '<selection activeCell="A1" sqref="A1"/>');
  wr(lbPath, lhead + lout.join('') + ltail);
  var lbGeom = new Geom(lb, lheights);
  var lbDrawPath = await drawingOf(lbPath);
  if (lbDrawPath) {
    var d2 = emptyDrawing(await rd(lbDrawPath)), sh2 = new Shapes(lbGeom); sh2.id = 1000;
    lpics.forEach(function (q) { drawPanel(sh2, 'PIC_' + colName(q.col) + q.row, q.part, lbGeom.colStart(q.col) + 3 + 109/2, lbGeom.rowTop(q.row) + 30, 109, 54); });
    wr(lbDrawPath, d2.head + d2.keep + sh2.out.join('') + '</xdr:wsDr>');
  }

  /* ================= EDGEBAND / STOCK_CORE / HARDWARE(_LIST) ================= */
  async function fillList(name, firstRow, nSettings, rowsData) {
    var path = sheetPath[name]; if (!path) return;
    var x = await rd(path), rows = parseRows(x), hd = x.slice(0, x.indexOf('<sheetData>') + 11), tl = x.slice(x.indexOf('</sheetData>'));
    var tplRow = rows[firstRow], st = styleMap(tplRow), keepCols = {};
    var settings = {}; for (var k = 0; k < nSettings; k++) settings[firstRow + k] = (rows[firstRow + k] ? rows[firstRow + k].cells : []).filter(function (c) { return c.col > rowsData.lastCol; });
    var o = []; Object.keys(rows).map(Number).sort(function (a, b) { return a - b; }).forEach(function (r) { if (r < firstRow) o.push(moveRow(rows[r], r, {}, function () { return false; }, sst)); });
    var n = Math.max(rowsData.rows.length, nSettings);
    for (var i = 0; i < n; i++) {
      var r = firstRow + i, vals = rowsData.rows[i], list = [];
      if (vals) for (var c = 2; c <= rowsData.lastCol; c++) {
        var v = typeof vals[c] === 'function' ? vals[c](r) : vals[c];
        list.push({ col:c, x:cell(colName(c) + r, st[c], v, sst) });
      }
      (settings[r] || []).forEach(function (cc) { list.push({ col:cc.col, x:cc.xml.replace(/r="[A-Z]+\d+"/, 'r="' + colName(cc.col) + r + '"') }); });
      list.sort(function (a, b) { return a.col - b.col; });
      o.push(rowXml(r, tplRow ? tplRow.attrs : ' ht="15" customHeight="1"', list.map(function (q) { return q.x; }).join('')));
    }
    hd = hd.replace(/<dimension ref="([A-Z]+\d+):([A-Z]+)\d+"\/>/, function (m, a, c) { return '<dimension ref="' + a + ':' + c + (firstRow + n - 1) + '"/>'; });
    wr(path, hd + o.join('') + tl);
  }
  var EB_ORDER = [['F', 'Edgeband1'], ['B', 'Edgeband2'], ['L', 'Edgeband3'], ['R', 'Edgeband4']];
  var ebRows = [];
  parts.forEach(function (p) { EB_ORDER.forEach(function (e) { if (!p.eb[e[0]]) return;
    var inf = p.ebInfo[e[0]] || {};
    var len = inf.len || ((e[0] === 'F' || e[0] === 'B') ? p.L : p.W);
    ebRows.push({ 3:p.solid, 5:inf.feat || e[1], 6:p.eb[e[0]], 9:len, 10:inf.thk, 11:p.qty, 13:inf.cost, 12:function (r) { return { f:'IFERROR((I' + r + ')/(1000)*K' + r + ',0)' }; }, 14:function (r) { return { f:'IFERROR((L' + r + '*M' + r + '),0)' }; } }); }); });
  await fillList('EDGEBAND', 4, 3, { lastCol:14, rows:ebRows });
  var scRows = parts.map(function (p) { return { 3:p.solid, 5:'CORE', 6:p.mat, 8:p.stockRef, 9:p.L, 10:p.W, 11:p.T, 12:p.qty,
    13:function (r) { return { f:'IFERROR((I' + r + ')/(1000)*L' + r + ',0)' }; }, 14:function (r) { return { f:'IFERROR((I' + r + '*J' + r + ')/(1000^2)*L' + r + ',0)' }; },
    15:function (r) { return { f:'IFERROR((I' + r + '*J' + r + '*K' + r + ')/(1000^3)*L' + r + ',0)' }; }, 16:function (r) { return { f:'IF(R' + r + '=1,N' + r + ',IF(R' + r + '=0,O' + r + ',M' + r + '))' }; },
    18:1, 19:function (r) { return { f:'IF(R' + r + '="","",IF(R' + r + '=1,"m²",IF(R' + r + '=0,"m3","ml")))', str:1 }; }, 20:function (r) { return { f:'IFERROR((P' + r + '*Q' + r + '),0)' }; } }; });
  await fillList('STOCK_CORE', 4, 3, { lastCol:20, rows:scRows });
  var hwRows = (pj.hardware || []).map(function (h) { return { 3:h.item, 4:h.supplier, 5:h.ref, 6:h.qty, 7:h.cost || 0, 8:{ f:'VLOOKUP("F",Tp_LANGUAGE!$A$2:$Z$1001,MATCH(Tp_Global!$J$6,Tp_LANGUAGE!$A$1:$Z$1,0),FALSE)', str:1 } }; });
  await fillList('HARDWARE_LIST', 8, 3, { lastCol:8, rows:hwRows });
  await fillList('HARDWARE', 8, 3, { lastCol:8, rows:hwRows });

  /* ================= workbook: recalc + pivots on open, version name ================= */
  wbXml = wbXml.replace(/<calcPr([^>]*?)\/>/, function (m, a) { return '<calcPr' + attr(a, 'fullCalcOnLoad', '1') + '/>'; });
  var ver = opts.version || 'v18-kurejas';
  if (/<definedName name="DB_PartList_Version"/.test(wbXml)) wbXml = wbXml.replace(/(<definedName name="DB_PartList_Version"[^>]*>)[^<]*</, '$1"' + esc(ver) + '"<');
  else wbXml = wbXml.replace('</definedNames>', '<definedName name="DB_PartList_Version">"' + esc(ver) + '"</definedName></definedNames>');
  wr('xl/workbook.xml', wbXml);
  for (var pc = 1; pc <= 20; pc++) {
    var pcd = await rd('xl/pivotCache/pivotCacheDefinition' + pc + '.xml'); if (!pcd) continue;
    wr('xl/pivotCache/pivotCacheDefinition' + pc + '.xml', pcd.replace(/<pivotCacheDefinition([^>]*)>/, function (m, a) { return '<pivotCacheDefinition' + attr(a, 'refreshOnLoad', '1') + '>'; }));
  }
  wr('xl/sharedStrings.xml', sst.xml());
  return zip.generateAsync({ type:'uint8array', compression:'DEFLATE', compressionOptions:{ level:6 } });
}

var api = { buildReport:buildReport, sortParts:sortParts, drawPanel:drawPanel, Geom:Geom };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBReport = api;
})(typeof window !== 'undefined' ? window : this);
