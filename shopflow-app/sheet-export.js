/* ============================================================
   sheet-export.js — the project sheet as a workbook

   An .xlsx is a ZIP of XML. swood.js already reads one; this writes one,
   with no library and no build step. Entries are STORED rather than
   deflated — Excel, LibreOffice and Numbers all accept that, and it saves
   shipping a compressor to a shop tablet for a file of a few hundred rows.

   Strings are written inline, so there is no shared-string table to keep in
   step with the cells pointing at it.
   ============================================================ */
"use strict";

function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t.return || t.return(); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var XlsxOut = {
  /* ---------- the ZIP ---------- */
  _crcTable: null,
  crc32(bytes) {
    if (!this._crcTable) {
      var t = new Uint32Array(256);
      for (var n = 0; n < 256; n++) {
        var _c = n;
        for (var k = 0; k < 8; k++) _c = _c & 1 ? 0xEDB88320 ^ _c >>> 1 : _c >>> 1;
        t[n] = _c >>> 0;
      }
      this._crcTable = t;
    }
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) c = this._crcTable[(c ^ bytes[i]) & 0xFF] ^ c >>> 8;
    return (c ^ 0xFFFFFFFF) >>> 0;
  },
  zip(entries) {
    var enc = new TextEncoder();
    var parts = [],
      dir = [];
    var offset = 0;
    var u16 = n => [n & 255, n >>> 8 & 255];
    var u32 = n => [n & 255, n >>> 8 & 255, n >>> 16 & 255, n >>> 24 & 255];
    var _iterator = _createForOfIteratorHelper(entries),
      _step;
    try {
      for (_iterator.s(); !(_step = _iterator.n()).done;) {
        var _step$value = _slicedToArray(_step.value, 2),
          name = _step$value[0],
          text = _step$value[1];
        var nameB = enc.encode(name);
        var data = enc.encode(text);
        var crc = this.crc32(data);
        /* local header: stored (method 0), sizes known up front.
           0x0800 says the name is UTF-8, which matters for nothing here but
           is what every modern writer sets. */
        var local = [].concat(u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(nameB.length), u16(0));
        parts.push(new Uint8Array(local), nameB, data);
        dir.push({
          nameB,
          crc,
          size: data.length,
          offset
        });
        offset += local.length + nameB.length + data.length;
      }
    } catch (err) {
      _iterator.e(err);
    } finally {
      _iterator.f();
    }
    var central = [];
    for (var _i = 0, _dir = dir; _i < _dir.length; _i++) {
      var e = _dir[_i];
      central.push(new Uint8Array([].concat(u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(0), u16(0), u32(e.crc), u32(e.size), u32(e.size), u16(e.nameB.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(e.offset))));
      central.push(e.nameB);
    }
    var centralSize = central.reduce((n, a) => n + a.length, 0);
    var end = new Uint8Array([].concat(u32(0x06054b50), u16(0), u16(0), u16(dir.length), u16(dir.length), u32(centralSize), u32(offset), u16(0)));
    return new Blob([...parts, ...central, end], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
  },
  /* ---------- the workbook ---------- */
  CTRL: /[\x00-\x08\x0B\x0C\x0E-\x1F]/g,
  // Excel refuses a file containing these
  esc(v) {
    return String(v === null || v === undefined ? "" : v).replace(this.CTRL, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  },
  col(i) {
    // 0 → A, 26 → AA
    var s = "";
    for (i++; i > 0; i = Math.floor((i - 1) / 26)) s = String.fromCharCode(65 + (i - 1) % 26) + s;
    return s;
  },
  /* A row is an array of cells. A cell is a string, a number, or
     { v, style } — style 0 normal, 1 bold, 2 a section heading. */
  sheetXml(rows, widths) {
    var out = [];
    (rows || []).forEach((row, r) => {
      var cells = [];
      (row || []).forEach((cell, c) => {
        var o = cell && typeof cell === "object" ? cell : {
          v: cell
        };
        if (o.v === null || o.v === undefined || o.v === "") return;
        var ref = this.col(c) + (r + 1);
        var st = o.style ? ` s="${o.style}"` : "";
        if (typeof o.v === "number" && isFinite(o.v)) {
          cells.push(`<c r="${ref}"${st}><v>${o.v}</v></c>`);
        } else {
          cells.push(`<c r="${ref}"${st} t="inlineStr"><is><t xml:space="preserve">${this.esc(o.v)}</t></is></c>`);
        }
      });
      if (cells.length) out.push(`<row r="${r + 1}">${cells.join("")}</row>`);
    });
    var cols = (widths || []).length ? `<cols>${widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")}</cols>` : "";
    return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` + cols + `<sheetData>${out.join("")}</sheetData></worksheet>`;
  },
  /* a sheet name Excel will accept: 31 chars, none of \ / * ? [ ] : */
  tabName(name) {
    return this.esc(String(name || "Sheet").replace(/[\\/*?[\]:]/g, "-").slice(0, 31)) || "Sheet";
  },
  /* sheets: [{ name, rows, widths }] */
  build(sheets) {
    var files = [];
    var n = sheets.length;
    files.push(["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` + `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` + `<Default Extension="xml" ContentType="application/xml"/>` + `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` + `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` + sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join("") + `</Types>`]);
    files.push(["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` + `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` + `</Relationships>`]);
    files.push(["xl/workbook.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"` + ` xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>` + sheets.map((s, i) => `<sheet name="${this.tabName(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join("") + `</sheets></workbook>`]);
    files.push(["xl/_rels/workbook.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` + sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join("") + `<Relationship Id="rId${n + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>` + `</Relationships>`]);

    /* three cell formats: normal, bold, and bold on a tint for a heading */
    files.push(["xl/styles.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>` + `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` + `<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font>` + `<font><b/><sz val="11"/><name val="Calibri"/></font></fonts>` + `<fills count="3"><fill><patternFill patternType="none"/></fill>` + `<fill><patternFill patternType="gray125"/></fill>` + `<fill><patternFill patternType="solid"><fgColor rgb="FFEFEFF4"/><bgColor indexed="64"/></patternFill></fill></fills>` + `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` + `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` + `<cellXfs count="3">` + `<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>` + `<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>` + `<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>` + `</cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`]);
    sheets.forEach((s, i) => files.push([`xl/worksheets/sheet${i + 1}.xml`, this.sheetXml(s.rows, s.widths)]));
    return this.zip(files);
  }
};

/* ============================================================
   The project sheet, as sheets
   ============================================================ */
var SheetExport = {
  B: v => ({
    v,
    style: 1
  }),
  H: v => ({
    v,
    style: 2
  }),
  date(ts) {
    return ts ? new Date(ts).toISOString().slice(0, 10) : "";
  },
  /* The interface is translated by watching the DOM, and a workbook never
     touches the DOM — so an export came out in English on a Lithuanian shop
     floor. Everything that reaches a cell goes through the dictionary. */
  t(v) {
    return typeof I18N !== "undefined" && I18N.t ? I18N.t(String(v)) : String(v);
  },
  workbook(orderId) {
    var o = D.order(orderId);
    if (!o) return null;
    var isEng = o.type === "eng";
    var cur = D.currentOp(o);
    var p = D.progress(o);
    var crew = D.orderResponsible(o).map(id => D.member(id)).filter(Boolean);

    /* ---- 1. the card itself: facts, then everything by category ---- */
    var main = [[this.B("Projektas"), o.product || o.num], [this.B("Nr."), o.num], [this.B("Klientas"), o.client || ""], [this.B("Būsena"), this.t(D.statusLabel[D.orderStatus(o)] || "")], [this.B("Terminas"), this.date(o.due)], [this.B(isEng ? "Etapas" : "Dabar"), cur ? (D.station(cur.stationId) || {}).name || "" : ""], [this.B("Sukurta"), this.date(o.createdAt)], [this.B("Eiga"), `${p.done}/${p.total}`], [this.B("Atsakingi"), crew.map(m => m.name).join(", ")], [this.B("Portfelis"), o.portfolioId ? (D.portfolio(o.portfolioId) || {}).name || "" : ""], [], [this.H("Kategorija"), this.H("Ką"), this.H("Būsena"), this.H("Tiekėjas / kodas"), this.H("Laukiama iki")]];
    var _iterator2 = _createForOfIteratorHelper(D.detailsByCategory(o)),
      _step2;
    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var g = _step2.value;
        var _iterator7 = _createForOfIteratorHelper(g.rows),
          _step7;
        try {
          for (_iterator7.s(); !(_step7 = _iterator7.n()).done;) {
            var d = _step7.value;
            main.push([this.t(g.label), d.label, this.t(D.DETAIL_LABEL[d.state] || d.state), d.value || "", d.state === "ordered" ? this.date(d.due) : ""]);
          }
        } catch (err) {
          _iterator7.e(err);
        } finally {
          _iterator7.f();
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }
    if (!D.details(o).length) main.push(["", "— nieko neįrašyta —"]);
    if (o.notes) {
      main.push([], [this.H("Užrašai")], [o.notes]);
    }
    var sheets = [{
      name: "Kortelė",
      rows: main,
      widths: [20, 30, 13, 34, 14]
    }];

    /* ---- 2. materials ---- */
    var mats = [[this.H("Medžiaga"), this.H("Reikia"), this.H("Vnt."), this.H("Sandėlyje"), this.H("Panaudota")]];
    var _iterator3 = _createForOfIteratorHelper(o.materials || []),
      _step3;
    try {
      for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
        var l = _step3.value;
        var mat = D.material(l.materialId);
        mats.push([mat ? mat.name : l.name || "", l.qty, mat ? mat.unit : l.unit || "", mat ? mat.qty : "", l.consumed ? "taip" : ""]);
      }
    } catch (err) {
      _iterator3.e(err);
    } finally {
      _iterator3.f();
    }
    if (mats.length === 1) mats.push(["— nesusietų medžiagų —"]);
    sheets.push({
      name: "Medžiagos",
      rows: mats,
      widths: [34, 10, 8, 12, 12]
    });

    /* ---- 3. the conversation ---- */
    var rem = [[this.H("Kada"), this.H("Kas"), this.H("Pastaba")]];
    var _iterator4 = _createForOfIteratorHelper(o.comments || []),
      _step4;
    try {
      for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
        var c = _step4.value;
        rem.push([this.date(c.ts), (D.member(c.by) || {}).name || "", c.text]);
      }
    } catch (err) {
      _iterator4.e(err);
    } finally {
      _iterator4.f();
    }
    if (rem.length === 1) rem.push(["— pastabų nėra —"]);
    sheets.push({
      name: "Pastabos",
      rows: rem,
      widths: [12, 20, 80]
    });

    /* ---- 4. what happened ---- */
    var hist = [[this.H("Kada"), this.H("Kas"), this.H("Ką")]];
    var _iterator5 = _createForOfIteratorHelper(D.orderHistory(o.id)),
      _step5;
    try {
      for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
        var a = _step5.value;
        hist.push([this.date(a.ts), (D.member(a.who) || {}).name || "", String(a.text || "").replace(/\*\*/g, "")]);
      }
    } catch (err) {
      _iterator5.e(err);
    } finally {
      _iterator5.f();
    }
    sheets.push({
      name: "Istorija",
      rows: hist,
      widths: [12, 20, 80]
    });

    /* ---- 5. the cut list, when there is one ---- */
    if ((o.parts || []).length) {
      var parts = [[this.H("Kodas"), this.H("Detalė"), this.H("Plokštė"), this.H("L"), this.H("W"), this.H("Kiekis"), this.H("Spintelė")]];
      var _iterator6 = _createForOfIteratorHelper(o.parts),
        _step6;
      try {
        for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
          var pt = _step6.value;
          parts.push([pt.code, pt.name, pt.board, pt.l, pt.w, pt.qty, pt.solid || ""]);
        }
      } catch (err) {
        _iterator6.e(err);
      } finally {
        _iterator6.f();
      }
      sheets.push({
        name: "Detalės",
        rows: parts,
        widths: [16, 22, 22, 9, 9, 9, 22]
      });
    }
    return {
      sheets,
      name: this.fileName(o)
    };
  },
  fileName(o) {
    var safe = String(o.product || o.num).replace(/(?:[\0-,\.\/:-@\[-\^`\{-\xA9\xAB-\xB1\xB4\xB6-\xB8\xBB\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u036F\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482-\u0489\u0530\u0557\u0558\u055A-\u055F\u0589-\u05CF\u05EB-\u05EE\u05F3-\u061F\u064B-\u065F\u066A-\u066D\u0670\u06D4\u06D6-\u06E4\u06E7-\u06ED\u06FD\u06FE\u0700-\u070F\u0711\u0730-\u074C\u07A6-\u07B0\u07B2-\u07BF\u07EB-\u07F3\u07F6-\u07F9\u07FB-\u07FF\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u083F\u0859-\u085F\u086B-\u086F\u0888\u088F-\u089F\u08CA-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962-\u0965\u0970\u0981-\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA-\u09BC\u09BE-\u09CD\u09CF-\u09DB\u09DE\u09E2-\u09E5\u09F2\u09F3\u09FA\u09FB\u09FD-\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A-\u0A58\u0A5D\u0A5F-\u0A65\u0A70\u0A71\u0A75-\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA-\u0ABC\u0ABE-\u0ACF\u0AD1-\u0ADF\u0AE2-\u0AE5\u0AF0-\u0AF8\u0AFA-\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A-\u0B3C\u0B3E-\u0B5B\u0B5E\u0B62-\u0B65\u0B70\u0B78-\u0B82\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BCF\u0BD1-\u0BE5\u0BF3-\u0C04\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C3E-\u0C57\u0C5B\u0C5C\u0C5E\u0C5F\u0C62-\u0C65\u0C70-\u0C77\u0C7F\u0C81-\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA-\u0CBC\u0CBE-\u0CDC\u0CDF\u0CE2-\u0CE5\u0CF0\u0CF3-\u0D03\u0D0D\u0D11\u0D3B\u0D3C\u0D3E-\u0D4D\u0D4F-\u0D53\u0D57\u0D62-\u0D65\u0D79\u0D80-\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DE5\u0DF0-\u0E00\u0E31\u0E34-\u0E3F\u0E47-\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EB1\u0EB4-\u0EBC\u0EBE\u0EBF\u0EC5\u0EC7-\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F1F\u0F34-\u0F3F\u0F48\u0F6D-\u0F87\u0F8D-\u0FFF\u102B-\u103E\u104A-\u104F\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F\u109A-\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B-\u1368\u137D-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u1712-\u171E\u1732-\u173F\u1752-\u175F\u176D\u1771-\u177F\u17B4-\u17D6\u17D8-\u17DB\u17DD-\u17DF\u17EA-\u17EF\u17FA-\u180F\u181A-\u181F\u1879-\u187F\u1885\u1886\u18A9\u18AB-\u18AF\u18F6-\u18FF\u191F-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DB-\u19FF\u1A17-\u1A1F\u1A55-\u1A7F\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1B04\u1B34-\u1B44\u1B4D-\u1B4F\u1B5A-\u1B82\u1BA1-\u1BAD\u1BE6-\u1BFF\u1C24-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C8B-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1CFB-\u1CFF\u1DC0-\u1DFF\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u206F\u2072\u2073\u207A-\u207E\u208A-\u208F\u209D-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A-\u245F\u249C-\u24E9\u2500-\u2775\u2794-\u2BFF\u2CE5-\u2CEA\u2CEF-\u2CF1\u2CF4-\u2CFC\u2CFE\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7F\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF-\u2E2E\u2E30-\u3004\u3008-\u3020\u302A-\u3030\u3036\u3037\u303D-\u3040\u3097-\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u3191\u3196-\u319F\u31C0-\u31EF\u3200-\u321F\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA66F-\uA67E\uA69E\uA69F\uA6F0-\uA716\uA720\uA721\uA789\uA78A\uA7CE\uA7CF\uA7D2\uA7D4\uA7DD-\uA7F1\uA802\uA806\uA80B\uA823-\uA82F\uA836-\uA83F\uA874-\uA881\uA8B4-\uA8CF\uA8DA-\uA8F1\uA8F8-\uA8FA\uA8FC\uA8FF\uA926-\uA92F\uA947-\uA95F\uA97D-\uA983\uA9B3-\uA9CE\uA9DA-\uA9DF\uA9E5\uA9FF\uAA29-\uAA3F\uAA43\uAA4C-\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAC3-\uAADA\uAADE\uAADF\uAAEB-\uAAF1\uAAF5-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABE3-\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB1E\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD06\uDD34-\uDD3F\uDD79-\uDD89\uDD8C-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEE0\uDEFC-\uDEFF\uDF24-\uDF2C\uDF4B-\uDF4F\uDF76-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDD6F\uDD7B\uDD8B\uDD93\uDD96\uDDA2\uDDB2\uDDBA\uDDBD-\uDDBF\uDDF4-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDF7F\uDF86\uDFB1\uDFBB-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56\uDC57\uDC77\uDC78\uDC9F-\uDCA6\uDCB0-\uDCDF\uDCF3\uDCF6-\uDCFA\uDD1C-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBB\uDDD0\uDDD1\uDE01-\uDE0F\uDE14\uDE18\uDE36-\uDE3F\uDE49-\uDE5F\uDE7F\uDEA0-\uDEBF\uDEC8\uDEE5-\uDEEA\uDEF0-\uDEFF\uDF36-\uDF3F\uDF56\uDF57\uDF73-\uDF77\uDF92-\uDFA8\uDFB0-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCF9\uDD24-\uDD2F\uDD3A-\uDD3F\uDD66-\uDD6E\uDD86-\uDE5F\uDE7F\uDEAA-\uDEAF\uDEB2-\uDEC1\uDEC5-\uDEFF\uDF28-\uDF2F\uDF46-\uDF50\uDF55-\uDF6F\uDF82-\uDFAF\uDFCC-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC00-\uDC02\uDC38-\uDC51\uDC70\uDC73\uDC74\uDC76-\uDC82\uDCB0-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDD02\uDD27-\uDD35\uDD40-\uDD43\uDD45\uDD46\uDD48-\uDD4F\uDD73-\uDD75\uDD77-\uDD82\uDDB3-\uDDC0\uDDC5-\uDDCF\uDDDB\uDDDD-\uDDE0\uDDF5-\uDDFF\uDE12\uDE2C-\uDE3E\uDE41-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEDF-\uDEEF\uDEFA-\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A-\uDF3C\uDF3E-\uDF4F\uDF51-\uDF5C\uDF62-\uDF7F\uDF8A\uDF8C\uDF8D\uDF8F\uDFB6\uDFB8-\uDFD0\uDFD2\uDFD4-\uDFFF]|\uD805[\uDC35-\uDC46\uDC4B-\uDC4F\uDC5A-\uDC5E\uDC62-\uDC7F\uDCB0-\uDCC3\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDAF-\uDDD7\uDDDC-\uDDFF\uDE30-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEAB-\uDEB7\uDEB9-\uDEBF\uDECA-\uDECF\uDEE4-\uDEFF\uDF1B-\uDF2F\uDF3C-\uDF3F\uDF47-\uDFFF]|\uD806[\uDC2C-\uDC9F\uDCF3-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD30-\uDD3E\uDD40\uDD42-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD1-\uDDE0\uDDE2\uDDE4-\uDDFF\uDE01-\uDE0A\uDE33-\uDE39\uDE3B-\uDE4F\uDE51-\uDE5B\uDE8A-\uDE9C\uDE9E-\uDEAF\uDEF9-\uDFBF\uDFE1-\uDFEF\uDFFA-\uDFFF]|\uD807[\uDC09\uDC2F-\uDC3F\uDC41-\uDC4F\uDC6D-\uDC71\uDC90-\uDCFF\uDD07\uDD0A\uDD31-\uDD45\uDD47-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8A-\uDD97\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF3-\uDF01\uDF03\uDF11\uDF34-\uDF4F\uDF5A-\uDFAF\uDFB1-\uDFBF\uDFD5-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD812-\uD817\uD819\uD824-\uD82A\uD82D\uD82E\uD830-\uD832\uD836\uD83D\uD83F\uD87C\uD87D\uD87F\uD889-\uDBFF][\uDC00-\uDFFF]|\uD80B[\uDC00-\uDF8F\uDFF1-\uDFFF]|\uD80D[\uDC30-\uDC40\uDC47-\uDC5F]|\uD810[\uDFFB-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD818[\uDC00-\uDCFF\uDD1E-\uDD2F\uDD3A-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDE6F\uDEBF\uDECA-\uDECF\uDEEE-\uDEFF\uDF30-\uDF3F\uDF44-\uDF4F\uDF5A\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDD3F\uDD6D-\uDD6F\uDD7A-\uDE3F\uDE97-\uDEFF\uDF4B-\uDF4F\uDF51-\uDF92\uDFA0-\uDFDF\uDFE2\uDFE4-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFE\uDD09-\uDFFF]|\uD82B[\uDC00-\uDFEF\uDFF4\uDFFC\uDFFF]|\uD82C[\uDD23-\uDD31\uDD33-\uDD4F\uDD53\uDD54\uDD56-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDFFF]|\uD833[\uDC00-\uDCEF\uDCFA-\uDFFF]|\uD834[\uDC00-\uDEBF\uDED4-\uDEDF\uDEF4-\uDF5F\uDF79-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|\uD837[\uDC00-\uDEFF\uDF1F-\uDF24\uDF2B-\uDFFF]|\uD838[\uDC00-\uDC2F\uDC6E-\uDCFF\uDD2D-\uDD36\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDE8F\uDEAE-\uDEBF\uDEEC-\uDEEF\uDEFA-\uDFFF]|\uD839[\uDC00-\uDCCF\uDCEC-\uDCEF\uDCFA-\uDDCF\uDDEE\uDDEF\uDDFB-\uDFDF\uDFE7\uDFEC\uDFEF\uDFFF]|\uD83A[\uDCC5\uDCC6\uDCD0-\uDCFF\uDD44-\uDD4A\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83B[\uDC00-\uDC70\uDCAC\uDCB0\uDCB5-\uDD00\uDD2E\uDD3E-\uDDFF\uDE04\uDE20\uDE23\uDE25\uDE26\uDE28\uDE33\uDE38\uDE3A\uDE3C-\uDE41\uDE43-\uDE46\uDE48\uDE4A\uDE4C\uDE50\uDE53\uDE55\uDE56\uDE58\uDE5A\uDE5C\uDE5E\uDE60\uDE63\uDE65\uDE66\uDE6B\uDE73\uDE78\uDE7D\uDE7F\uDE8A\uDE9C-\uDEA0\uDEA4\uDEAA\uDEBC-\uDFFF]|\uD83C[\uDC00-\uDCFF\uDD0D-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEE0-\uDEFF]|\uD86D[\uDF3A-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFEF]|\uD87B[\uDE5E-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDF4F]|\uD888[\uDFB0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])+/g, "_").replace(/^_+|_+$/g, "");
    return `${safe || o.num}_kortele_${new Date().toISOString().slice(0, 10)}.xlsx`;
  },
  blob(orderId) {
    var wb = this.workbook(orderId);
    return wb ? XlsxOut.build(wb.sheets) : null;
  },
  download(orderId) {
    var wb = this.workbook(orderId);
    if (!wb) return null;
    var blob = XlsxOut.build(wb.sheets);
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = wb.name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    return wb.name;
  }
};