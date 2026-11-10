/* =====================================================================
   art.js — pictures of the connectors (cutaway through the joint):
   side board standing on the left, the joined part coming in from the
   right. Used on the palette cards, the joinery choices and the inspector.
   ===================================================================== */
(function (root) {
"use strict";
var BOARDS = '<rect class="ia-bd" x="14" y="2" width="32" height="96" rx="1.5"/>' +
  '<rect class="ia-bd" x="46" y="44" width="112" height="32" rx="1.5"/>' +
  '<path class="ia-gr" d="M20 8v84M28 6v88M37 9v82M54 50h98M60 58h94M56 66h96M64 71h88"/>';
function thread(x0, x1, yc, rc, ro) {   // threaded part: core + zig-zag crests
  var p = 'M' + x0 + ' ' + (yc - rc), q = 'M' + x0 + ' ' + (yc + rc);
  for (var x = x0, k = 0; x + 2.5 <= x1; x += 2.5, k++) { var y = k % 2 ? rc : ro; p += ' L' + (x + 2.5) + ' ' + (yc - y); q += ' L' + (x + 2.5) + ' ' + (yc + y); }
  return '<rect class="ia-mt" x="' + x0 + '" y="' + (yc - rc) + '" width="' + (x1 - x0) + '" height="' + (2 * rc) + '"/><path class="ia-th" d="' + p + '"/><path class="ia-th" d="' + q + '"/>';
}
var PICS = {
  confirmat:
    BOARDS +
    '<rect class="ia-hl" x="14" y="53" width="32" height="14"/>' +                 // Ø8 through the side
    '<rect class="ia-hl" x="46" y="55.5" width="58" height="9"/>' +                // Ø5×32 pilot in the edge
    '<rect class="ia-mt" x="16" y="54" width="31" height="12"/>' +                 // smooth neck
    thread(46, 100, 60, 3.6, 6.2) + '<path class="ia-mt" d="M100 56.4 L108 60 L100 63.6 Z"/>' +
    '<path class="ia-mt" d="M5 49 L16 54 L16 66 L5 71 Z"/><path class="ia-ln" d="M9 55v10"/>' +
    '<path class="ia-dim" d="M46 86h58M46 82v8M104 82v8"/><text class="ia-t" x="75" y="97" text-anchor="middle">Ø5×32</text>' +
    '<text class="ia-t" x="30" y="30" text-anchor="middle">Ø8</text><path class="ia-dim" d="M30 33v19"/>',
  cam:   /* Minifix-type: plastic-sleeved bolt in the side, steel pin through the Ø8 edge bore, Ø15 cam 34 mm from the edge grabs the pin head */
    BOARDS +
    '<rect class="ia-hl" x="24.4" y="53" width="21.6" height="14"/>' +             // Ø8 hole in the side's face for the sleeve
    '<rect class="ia-hl" x="46" y="54" width="52" height="12"/>' +                 // Ø8 bore in the edge
    '<rect class="ia-hl" x="93.7" y="44" width="27" height="26"/>' +               // Ø15 pocket from the top face
    // blue plastic sleeve with ribs
    '<rect class="ia-pl" x="25.5" y="54" width="20.5" height="12" rx="2"/>' +
    '<path class="ia-plr" d="M29 54v12M32.5 54v12M36 54v12M39.5 54v12"/><path class="ia-pls" d="M25.5 60h5"/>' +
    // steel pin and its head
    '<rect class="ia-mt" x="40" y="57" width="62" height="6" rx="1"/><path class="ia-hi" d="M41 58.2h60"/>' +
    // cam drum (section) with the slot the head sits in
    '<rect class="ia-cm" x="95" y="44.6" width="24.4" height="24.4" rx="3.5"/><path class="ia-hi" d="M97 47.2h20.4"/>' +
    '<path class="ia-cut" d="M95 56.4 H99.5 V52 H108.5 Q112 60 108.5 68 H99.5 V63.6 H95 Z"/>' +
    '<rect class="ia-mt" x="101" y="53" width="4.6" height="14" rx="1.6"/>' +
    '<path class="ia-ln" d="M104.4 44.6v3.2M110 44.6v3.2"/>' +
    // pull arrow: turning the cam pulls the pin and the side tight
    '<path class="ia-arr" d="M58 49.5h22"/><path class="ia-arrh" d="M84 49.5l-6 -3.2v6.4z"/>' +
    // top view of the cam
    '<circle class="ia-cm" cx="107.2" cy="18" r="12.5"/><circle class="ia-hiC" cx="107.2" cy="18" r="9.5"/>' +
    '<rect class="ia-slot" x="100.7" y="16.6" width="13" height="2.8" rx="1"/><rect class="ia-slot" x="105.8" y="11.5" width="2.8" height="13" rx="1"/>' +
    '<path class="ia-arr" d="M89 13 A 19 19 0 0 1 120 3.6"/><path class="ia-arrh" d="M123.5 5.5 l-7.2 -1.4 l3.2 6.4 z"/>' +
    '<path class="ia-dim" d="M107.2 31v12" stroke-dasharray="2.5 2"/>' +
    '<text class="ia-t" x="124" y="27">Ø15</text>' +
    '<text class="ia-t" x="30" y="40" text-anchor="middle">Ø8</text><path class="ia-dim" d="M30 42.5v10"/>' +
    '<path class="ia-dim" d="M46 86h61.2M46 82v8M107.2 82v8"/><text class="ia-t" x="76.6" y="97" text-anchor="middle">34</text>',
  dowel:
    BOARDS +
    '<rect class="ia-hl" x="24" y="53" width="22" height="14"/>' +                 // Ø8×12 in the face
    '<rect class="ia-hl" x="46" y="53" width="49" height="14"/>' +                 // Ø8×27 in the edge
    '<rect class="ia-wd" x="26" y="54.2" width="66" height="11.6" rx="4"/>' +
    '<path class="ia-fl" d="M33 55l-3 10M40 55l-3 10M47 55l-3 10M54 55l-3 10M61 55l-3 10M68 55l-3 10M75 55l-3 10M82 55l-3 10M89 55l-3 10"/>' +
    '<path class="ia-dim" d="M24 86h71M24 82v8M95 82v8"/><text class="ia-t" x="60" y="97" text-anchor="middle">Ø8</text>'
};
function art(type, cls) {
  return '<svg class="iart ' + (cls || '') + '" viewBox="0 0 160 100" aria-hidden="true" focusable="false">' + (PICS[type] || PICS.confirmat) + '</svg>';
}
/* a photo-like dowel (no shop photo yet): fluted beech Ø8 with chamfered ends, same 4:3 frame as the photos */
var DOWEL = '<svg class="iph" viewBox="0 0 360 270" role="img" aria-label="kaištis">' +
  '<defs><linearGradient id="dwG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b98445"/><stop offset=".22" stop-color="#f3d7a1"/><stop offset=".45" stop-color="#e4bb7c"/><stop offset=".8" stop-color="#b47e3b"/><stop offset="1" stop-color="#8f5f26"/></linearGradient>' +
  '<radialGradient id="dwE" cx=".45" cy=".45" r=".6"><stop offset="0" stop-color="#f1d39b"/><stop offset="1" stop-color="#c8955a"/></radialGradient>' +
  '<radialGradient id="dwS" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>' +
  '<rect width="360" height="270" fill="#fff"/><ellipse cx="185" cy="205" rx="150" ry="20" fill="url(#dwS)"/>' +
  '<g transform="translate(180 135) rotate(-17)">' +
  '<path d="M-128 -22 L-120 -30 H122 V30 H-120 L-128 22 Z" fill="url(#dwG)" stroke="#8a5b22" stroke-width="1.2"/>' +
  [-20, -9, 2, 13, 23].map(function (y) { return '<path d="M-116 ' + y + ' H120" stroke="#9b6a2e" stroke-width="2.4" opacity=".5"/><path d="M-116 ' + (y + 2.2) + ' H120" stroke="#f7e2b8" stroke-width="1" opacity=".55"/>'; }).join('') +
  '<path d="M-90 -26 C-40 -24 10 -27 60 -25 M-60 26 C-10 24 40 27 100 25" stroke="#a87436" stroke-width=".8" fill="none" opacity=".45"/>' +
  '<ellipse cx="122" cy="0" rx="11" ry="30" fill="url(#dwE)" stroke="#8a5b22" stroke-width="1.2"/>' +
  '<ellipse cx="122" cy="0" rx="6" ry="17" fill="none" stroke="#b9854a" stroke-width=".9"/><ellipse cx="122" cy="0" rx="2.6" ry="7" fill="none" stroke="#b9854a" stroke-width=".9"/>' +
  '</g></svg>';
function photo(type, alt) {
  var P = root.DBPhotos || {};
  if (P[type]) return '<img class="iph" src="' + P[type] + '" alt="' + String(alt || type).replace(/"/g, '') + '" draggable="false">';
  return DOWEL;
}
/* photo + cutaway side by side (the cutaway hides on narrow cards) */
function pic(type, alt) { return '<span class="ipic"><span class="ipic-ph">' + photo(type, alt) + '</span><span class="ipic-cs">' + art(type) + '</span></span>'; }
var api = { art:art, photo:photo, pic:pic };
if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.DBArt = api;
})(typeof window !== 'undefined' ? window : this);
