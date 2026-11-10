/* Front view of one cabinet, drawn from the engine's real parts (buildCabinet().panels): every part projected
   straight onto the front plane at its true size, painted back to front, coloured by its material
   (a few common board names → colours), with soft interior shadow, handles, legs and an oven where one is.
   window.DBFront.svg(c, r, opts) → SVG string. opts: { bnd:[x…], sel:k, over:[bool], ovens:[{x0,x1,z0,z1}], legH, legs:bool, type } */
(function () {
'use strict';
var MAT = [
  [/balt|white|snow|sniego|alpin/i, '#f1f1ed'], [/antrac|anthrac|grafit|graphit/i, '#3b3f44'], [/juod|black|nero/i, '#26272a'],
  [/kašmyr|kasmyr|cashmere|smėl|smel|beige|sand|kreminė|cream/i, '#d7ccba'], [/pilk|grey|gray|beton|concrete|cement/i, '#a2a4a5'],
  [/riešut|riesut|walnut/i, '#7c573a'], [/ąžuol|azuol|oak/i, '#c7a378'], [/uos|ash/i, '#d6c3a1'], [/buk|beech/i, '#d8b28a'],
  [/žal|zal|green|olive|alyv/i, '#6a7a5e'], [/mėlyn|melyn|blue|navy/i, '#3f5875'], [/raudon|red|bordo/i, '#8d3c35']
];
var WOOD = /ąžuol|azuol|oak|riešut|riesut|walnut|uos|ash|buk|beech|wood|medi/i;
function matColor(name, dflt) { name = String(name || ''); for (var i = 0; i < MAT.length; i++) if (MAT[i][0].test(name)) return MAT[i][1]; return dflt; }
function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
function mix(c, to, f) { var a = hex(c), b = hex(to); return '#' + a.map(function (v, i) { var x = Math.round(v + (b[i] - v) * f); return (x < 16 ? '0' : '') + x.toString(16); }).join(''); }
function dark(c, f) { return mix(c, '#000000', f); }
function light(c, f) { return mix(c, '#ffffff', f); }
function lum(c) { var a = hex(c); return (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) / 255; }
function n(v) { return (Math.round(v * 10) / 10).toString(); }

function box(p) {   // the part's extent in the cabinet: [x, y (depth from the front), z (up)]
  var q = p.place, pts = [];
  [0, p.L].forEach(function (a) { [0, p.W].forEach(function (b) { [0, p.T].forEach(function (c) { pts.push([0, 1, 2].map(function (i) { return q.o[i] + a * q.u[i] + b * q.v[i] - c * q.n[i]; })); }); }); });
  return [0, 1, 2].map(function (i) { return [Math.min.apply(null, pts.map(function (r) { return r[i]; })), Math.max.apply(null, pts.map(function (r) { return r[i]; }))]; });
}

function svg(c, r, o) {
  o = o || {};
  var W = +r.dims.W, H = +r.dims.H, D = +r.dims.D, t = +r.dims.t || 18, legH = o.legs ? Math.max(0, +o.legH || 0) : 0;
  var Y = function (z) { return H - z; };   // svg y from height above the carcass bottom
  var carc = matColor(c.mat && c.mat.carc, '#efefeb'), fac = matColor(c.mat && c.mat.facade, '#e7e5df'), back = matColor((c.mat && c.mat.back) || (c.mat && c.mat.carc), carc);
  var hdf = '#e4e1da', wall = '#cfcbc2', woodF = WOOD.test((c.mat && c.mat.facade) || ''), woodC = WOOD.test((c.mat && c.mat.carc) || '');
  var bnd = o.bnd || [0, W], nC = bnd.length - 1;
  var vbH = H + legH + 14, s = '';
  s += '<svg class="fr-svg" viewBox="0 -4 ' + n(W) + ' ' + n(vbH) + '" preserveAspectRatio="xMidYMax meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="' + (o.label || '') + '">';
  /* ---- shared paints */
  s += '<defs>' +
    '<linearGradient id="frGloss" x1="0" y1="0" x2="0.35" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity=".04"/><stop offset="1" stop-color="#000" stop-opacity=".08"/></linearGradient>' +
    '<linearGradient id="frTopSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".42"/><stop offset=".22" stop-color="#000" stop-opacity=".12"/><stop offset=".6" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="frSideL" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="frSideR" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="frUnder" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".26"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient>' +
    '<linearGradient id="frMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9ebee"/><stop offset=".5" stop-color="#a9aeb4"/><stop offset="1" stop-color="#7d838a"/></linearGradient>' +
    '<linearGradient id="frMetalV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#e9ebee"/><stop offset=".5" stop-color="#a9aeb4"/><stop offset="1" stop-color="#7d838a"/></linearGradient>' +
    '<linearGradient id="frGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3f46"/><stop offset=".38" stop-color="#16191c"/><stop offset=".40" stop-color="#2b3036"/><stop offset=".55" stop-color="#121417"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>' +
    '<radialGradient id="frFloor" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".30"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>' +
    (woodF || woodC ? '<pattern id="frGrain" width="60" height="240" patternUnits="userSpaceOnUse"><path d="M6 0c3 60-3 120 2 240M19 0c-4 70 5 140-1 240M33 0c2 80-2 150 3 240M47 0c-3 50 4 130-2 240" fill="none" stroke="#5a3a1c" stroke-opacity=".13" stroke-width="1.2"/></pattern>' : '') +
    '</defs>';
  /* ---- floor shadow and legs */
  if (legH > 0) {
    s += '<ellipse cx="' + n(W / 2) + '" cy="' + n(Y(-legH)) + '" rx="' + n(W * 0.56) + '" ry="9" fill="url(#frFloor)"/>';
    (r.legs || []).filter(function (l, i, all) { return Math.abs(l.y - Math.min.apply(null, all.map(function (q) { return q.y; }))) < 1; }).forEach(function (l) {
      var d = l.d || 40; s += '<rect x="' + n(l.x - d / 2) + '" y="' + n(Y(0)) + '" width="' + n(d) + '" height="' + n(legH) + '" fill="#2d3034"/>' +
        '<rect x="' + n(l.x - d / 2) + '" y="' + n(Y(0)) + '" width="' + n(d * 0.35) + '" height="' + n(legH) + '" fill="#fff" fill-opacity=".08"/>' +
        '<rect x="' + n(l.x - d * 0.7) + '" y="' + n(Y(-legH + 10)) + '" width="' + n(d * 1.4) + '" height="10" rx="3" fill="#1f2124"/>'; });
  } else s += '<rect x="0" y="' + n(Y(0) + 2) + '" width="' + n(W) + '" height="10" fill="url(#frUnder)"/>';
  /* ---- parts, back to front */
  var parts = (r.panels || []).map(function (p) { return { p:p, b:box(p) }; });
  var isFront = function (q) { return /FASADAS|DURYS/.test(q.p.role) && q.b[1][1] <= 0.5; };
  var inner = parts.filter(function (q) { return !isFront(q) && q.b[1][0] >= 1; }).sort(function (a, b) { return b.b[1][0] - a.b[1][0]; });
  var edges = parts.filter(function (q) { return !isFront(q) && q.b[1][0] < 1; });
  var fronts = parts.filter(isFront);
  var ix = function (k) { return [k === 0 ? t : bnd[k] + t / 2, k === nC - 1 ? W - t : bnd[k + 1] - t / 2]; };
  // the wall seen through a column without a back
  for (var k = 0; k < nC; k++) { var a = ix(k); s += '<rect x="' + n(a[0]) + '" y="' + n(Y(H)) + '" width="' + n(a[1] - a[0]) + '" height="' + n(H) + '" fill="' + dark(wall, 0.16) + '"/>'; }
  var rect = function (b, fill, extra) { return '<rect x="' + n(b[0][0]) + '" y="' + n(Y(b[2][1])) + '" width="' + n(b[0][1] - b[0][0]) + '" height="' + n(b[2][1] - b[2][0]) + '" fill="' + fill + '"' + (extra || '') + '/>'; };
  inner.forEach(function (q) {
    var depth = Math.max(0, Math.min(1, q.b[1][0] / Math.max(1, D))), role = q.p.role;
    var base = role === 'PLAUSAS' || /HDF/.test(q.p.mat || '') ? hdf : role === 'NUGARA' ? back : carc;
    var thin = (q.b[0][1] - q.b[0][0]) < 0.5 || (q.b[2][1] - q.b[2][0]) < 0.5; if (thin) return;
    s += rect(q.b, dark(base, 0.06 + depth * 0.26));
    if (role === 'LENTYNA' || role === 'ORKAITE' || /LENT/.test(role)) {   // a shelf seen edge-on: lit edge, shadow under it
      s += '<rect x="' + n(q.b[0][0]) + '" y="' + n(Y(q.b[2][0])) + '" width="' + n(q.b[0][1] - q.b[0][0]) + '" height="46" fill="url(#frUnder)"/>';
      s += '<rect x="' + n(q.b[0][0]) + '" y="' + n(Y(q.b[2][1])) + '" width="' + n(q.b[0][1] - q.b[0][0]) + '" height="2" fill="#fff" fill-opacity=".45"/>';
    }
  });
  // interior shadow: under the top / rails, along the sides
  for (var k2 = 0; k2 < nC; k2++) { var a2 = ix(k2), w2 = a2[1] - a2[0], h2 = H - 2 * t;
    s += '<rect x="' + n(a2[0]) + '" y="' + n(Y(H - t)) + '" width="' + n(w2) + '" height="' + n(h2) + '" fill="url(#frTopSh)"/>' +
         '<rect x="' + n(a2[0]) + '" y="' + n(Y(H - t)) + '" width="' + n(Math.min(60, w2 / 3)) + '" height="' + n(h2) + '" fill="url(#frSideL)"/>' +
         '<rect x="' + n(a2[1] - Math.min(50, w2 / 3)) + '" y="' + n(Y(H - t)) + '" width="' + n(Math.min(50, w2 / 3)) + '" height="' + n(h2) + '" fill="url(#frSideR)"/>'; }
  // board edges facing the front (edge band)
  var edgeC = lum(carc) > 0.6 ? dark(carc, 0.04) : light(carc, 0.06), edgeL = dark(carc, 0.22);
  edges.forEach(function (q) { s += rect(q.b, edgeC, ' stroke="' + edgeL + '" stroke-width=".7" vector-effect="non-scaling-stroke"'); });
  // ovens: the appliance in its opening
  (o.ovens || []).forEach(function (ov) {
    var x0 = ov.x0 + 2, x1 = ov.x1 - 2, z0 = ov.z0 + 2, z1 = ov.z1 - 2, w = x1 - x0, h = z1 - z0; if (w < 40 || h < 60) return;
    var cp = Math.min(110, h * 0.17);
    s += '<rect x="' + n(x0) + '" y="' + n(Y(z1)) + '" width="' + n(w) + '" height="' + n(h) + '" rx="4" fill="#1b1d20"/>' +
      '<rect x="' + n(x0 + 3) + '" y="' + n(Y(z1) + 3) + '" width="' + n(w - 6) + '" height="' + n(cp - 6) + '" rx="2" fill="#26292d"/>' +
      '<rect x="' + n(x0 + w / 2 - 40) + '" y="' + n(Y(z1) + cp / 2 - 9) + '" width="80" height="18" rx="2" fill="#0d0f10"/><text x="' + n(x0 + w / 2) + '" y="' + n(Y(z1) + cp / 2 + 5) + '" text-anchor="middle" font-size="14" font-family="ui-monospace,monospace" fill="#ff9a4d">12:00</text>';
    [0.16, 0.30, 0.70, 0.84].forEach(function (f) { s += '<circle cx="' + n(x0 + w * f) + '" cy="' + n(Y(z1) + cp / 2) + '" r="' + n(Math.min(16, cp * 0.26)) + '" fill="#3a3e43" stroke="#0e0f11" stroke-width="1.5"/><circle cx="' + n(x0 + w * f) + '" cy="' + n(Y(z1) + cp / 2 - Math.min(16, cp * 0.26) * 0.55) + '" r="2" fill="#c9ccd0"/>'; });
    var gy = Y(z1) + cp + 34, gh = h - cp - 54;
    s += '<rect x="' + n(x0 + 26) + '" y="' + n(gy) + '" width="' + n(w - 52) + '" height="' + n(Math.max(10, gh)) + '" rx="6" fill="url(#frGlass)"/>' +
      '<rect x="' + n(x0 + 30) + '" y="' + n(Y(z1) + cp + 10) + '" width="' + n(w - 60) + '" height="12" rx="6" fill="url(#frMetal)"/>';
  });
  // fronts with handles
  var tall = o.type === 'ŪKINĖ', wallC = o.type === 'PAKABINAMOS';
  var fEdge = dark(fac, lum(fac) > 0.5 ? 0.26 : 0.45);
  fronts.forEach(function (q) {
    var b = q.b, x0 = b[0][0], x1 = b[0][1], z0 = b[2][0], z1 = b[2][1], w = x1 - x0, h = z1 - z0;
    s += '<g class="fr-front">' + rect(b, fac) + (woodF ? rect(b, 'url(#frGrain)') : '') + rect(b, 'url(#frGloss)') +
      '<rect x="' + n(x0) + '" y="' + n(Y(z1)) + '" width="' + n(w) + '" height="' + n(h) + '" fill="none" stroke="' + fEdge + '" stroke-width=".9" vector-effect="non-scaling-stroke"/>' +
      '<line x1="' + n(x0 + 1) + '" y1="' + n(Y(z1) + 1) + '" x2="' + n(x1 - 1) + '" y2="' + n(Y(z1) + 1) + '" stroke="#fff" stroke-opacity=".5" stroke-width=".8" vector-effect="non-scaling-stroke"/>';
    var hl, hx, hz, vert = q.p.role === 'DURYS' && q.p.hingeLeft !== undefined && h > w * 0.9;
    if (vert) {
      hl = Math.min(192, Math.max(96, h * 0.25)); hx = q.p.hingeLeft ? x1 - 34 : x0 + 22;
      hz = wallC ? z0 + 40 : tall ? Math.max(z0 + 40, Math.min(z1 - 40 - hl, 1000 - (o.legH || 0) - hl / 2)) : z1 - 40 - hl;
      s += '<rect x="' + n(hx + 3) + '" y="' + n(Y(hz + hl) + 4) + '" width="12" height="' + n(hl) + '" rx="6" fill="#000" fill-opacity=".18"/>' +
           '<rect x="' + n(hx) + '" y="' + n(Y(hz + hl)) + '" width="12" height="' + n(hl) + '" rx="6" fill="url(#frMetalV)"/>';
    } else if (w > 60 && h > 40) {
      hl = Math.min(224, Math.max(96, w * 0.4)); hx = x0 + (w - hl) / 2;
      hz = wallC && q.p.role === 'DURYS' ? z0 + 34 : z1 - Math.min(h / 2, 48) - 6;
      s += '<rect x="' + n(hx + 3) + '" y="' + n(Y(hz + 12) + 4) + '" width="' + n(hl) + '" height="12" rx="6" fill="#000" fill-opacity=".18"/>' +
           '<rect x="' + n(hx) + '" y="' + n(Y(hz + 12)) + '" width="' + n(hl) + '" height="12" rx="6" fill="url(#frMetal)"/>';
    }
    s += '</g>';
  });
  /* ---- columns: problems, the one being edited, click targets */
  for (var k3 = 0; k3 < nC; k3++) {
    var cx0 = bnd[k3], cx1 = bnd[k3 + 1];
    if (o.over && o.over[k3]) s += '<rect x="' + n(cx0 + 3) + '" y="' + n(Y(H) + 3) + '" width="' + n(cx1 - cx0 - 6) + '" height="' + n(H - 6) + '" fill="#b4291f" fill-opacity=".10" stroke="#b4291f" stroke-width="2" stroke-dasharray="6 4" vector-effect="non-scaling-stroke"/>';
    if (nC > 1) s += '<rect class="fr-hit' + (k3 === o.sel ? ' on' : '') + '" data-act="colsel" data-v="' + k3 + '" x="' + n(cx0 + 1) + '" y="' + n(Y(H) - 2) + '" width="' + n(cx1 - cx0 - 2) + '" height="' + n(H + 4) + '" rx="6"/>';
  }
  return s + '</svg>';
}
window.DBFront = { svg:svg, matColor:matColor };
})();
