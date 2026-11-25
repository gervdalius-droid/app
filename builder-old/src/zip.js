/* =====================================================================
   zip.js — minimal ZIP writer (STORE, no compression).
   Sizes and CRC are written in every local header (no data descriptors):
   the nesting app's .xlsm reader needs them there. UTF-8 names flagged.
   ===================================================================== */
(function (root) {
"use strict";
var CRC = (function () { var t = new Uint32Array(256); for (var n = 0; n < 256; n++) { var c = n; for (var k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); t[n] = c >>> 0; } return t; })();
function crc32(b) { var c = 0xFFFFFFFF; for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xFF] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; }
function utf8(s) { return new TextEncoder().encode(s); }

/* files: [{ name, data: string | Uint8Array }] → Uint8Array */
function zip(files) {
  var now = new Date();
  var dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
  var dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();
  var parts = [], central = [], offset = 0;
  files.forEach(function (f) {
    var name = utf8(f.name), data = typeof f.data === 'string' ? utf8(f.data) : f.data, crc = crc32(data);
    var h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true);
    h.setUint16(10, dosTime, true); h.setUint16(12, dosDate, true); h.setUint32(14, crc, true);
    h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, name.length, true); h.setUint16(28, 0, true);
    parts.push(new Uint8Array(h.buffer), name, data);
    var c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true);
    c.setUint16(12, dosTime, true); c.setUint16(14, dosDate, true); c.setUint32(16, crc, true);
    c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, name.length, true);
    c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), name);
    offset += 30 + name.length + data.length;
  });
  var cdSize = central.reduce(function (a, b) { return a + b.length; }, 0);
  var e = new DataView(new ArrayBuffer(22));
  e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true);
  e.setUint32(12, cdSize, true); e.setUint32(16, offset, true);
  var all = parts.concat(central, [new Uint8Array(e.buffer)]);
  var out = new Uint8Array(all.reduce(function (a, b) { return a + b.length; }, 0)), p = 0;
  all.forEach(function (b) { out.set(b, p); p += b.length; });
  return out;
}
/* {path: text} map (workbook entries) → files list */
function fromEntries(map) { return Object.keys(map).map(function (k) { return { name:k, data:map[k] }; }); }

var api = { zip:zip, crc32:crc32, fromEntries:fromEntries };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBZip = api;
})(typeof window !== 'undefined' ? window : this);
