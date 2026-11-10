/* ============================================================
   ShopFlow — Icon system
   Monochrome stroke icons (24×24, currentColor) — a coherent
   tech look replacing all emoji glyphs across the UI.
   ============================================================ */
"use strict";

var ICONS = {
  /* brand & chrome */
  logo: '<rect x="3" y="3" width="18" height="18" rx="5.5"/><path d="m8 12.5 2.8 2.8L16 9"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.5-4.5"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  power: '<path d="M12 2v9"/><path d="M18.4 6.6a9 9 0 1 1-12.8 0"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  "check-circle": '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5L15.5 9.5"/>',
  "chev-left": '<path d="m15 18-6-6 6-6"/>',
  "chev-right": '<path d="m9 18 6-6-6-6"/>',
  "chev-down": '<path d="m6 9 6 6 6-6"/>',
  pencil: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1.2 14H6.2L5 6"/><path d="M10 10v7M14 10v7"/>',
  copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  import: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  at: '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.9 7.9"/>',
  save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
  alert: '<path d="M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/>',
  lock: '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
  send: '<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4Z"/>',
  play: '<path d="M7 5v14l12-7Z"/>',
  pause: '<path d="M9 5v14M15 5v14"/>',
  ban: '<circle cx="12" cy="12" r="9"/><path d="m5.8 5.8 12.4 12.4"/>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/>',
  "arrow-up": '<path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>',
  "arrow-down": '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
  "arrow-right": '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  truck: '<path d="M2 7h11v9H2z"/><path d="M13 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="16.5" cy="17.5" r="1.7"/>',
  "trend-down": '<path d="m22 17-7.5-7.5-4 4L2 5"/><path d="M16 17h6v-6"/>',
  "trend-up": '<path d="m22 7-7.5 7.5-4-4L2 19"/><path d="M16 7h6v6"/>',
  chart: '<path d="M3 3v16.5a1.5 1.5 0 0 0 1.5 1.5H21"/><path d="M7.5 15.5v2M12 10.5v7M16.5 6.5v11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
  history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l3.5 2"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.5 1.6A3.75 3.75 0 0 1 17.5 18Z"/>',
  "cloud-open": '<path d="M7 17.5a4.3 4.3 0 0 1-.5-8.57 5.8 5.8 0 0 1 10.9 1.3A3.6 3.6 0 0 1 18 17.5"/><path d="M12 21v-8"/><path d="m8.7 16.3 3.3-3.3 3.3 3.3"/>',
  "cloud-off": '<path d="M7 18a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 9.2-1.6"/><path d="M18.4 12.1A3.75 3.75 0 0 1 17.5 18H10"/><path d="m3 3 18 18"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.6"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.6"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  scan: '<path d="M4 7V5a1 1 0 0 1 1-1h2"/><path d="M17 4h2a1 1 0 0 1 1 1v2"/><path d="M20 17v2a1 1 0 0 1-1 1h-2"/><path d="M7 20H5a1 1 0 0 1-1-1v-2"/><path d="M4 12h16"/>',
  qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1"/><path d="M14 14h3v3M20.5 14v.01M14 20.5v.01M17 17h3.5v3.5"/>',
  camera: '<path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"/><circle cx="12" cy="12.5" r="3.5"/>',
  volume: '<path d="M11 5 6 9H3v6h3l5 4Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8 8 0 0 1 0 12"/>',
  bolt: '<path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12Z"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
  columns: '<rect x="3" y="4" width="5.5" height="16" rx="1.3"/><rect x="9.25" y="4" width="5.5" height="11" rx="1.3"/><rect x="15.5" y="4" width="5.5" height="14" rx="1.3"/>',
  /* nav */
  dashboard: '<rect x="3" y="3" width="7.5" height="9" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="5.5" rx="1.5"/><rect x="13.5" y="12" width="7.5" height="9" rx="1.5"/><rect x="3" y="15.5" width="7.5" height="5.5" rx="1.5"/>',
  kanban: '<rect x="3.5" y="4" width="4.6" height="15" rx="1.4"/><rect x="9.7" y="4" width="4.6" height="10" rx="1.4"/><rect x="15.9" y="4" width="4.6" height="12.5" rx="1.4"/>',
  folder: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2.4h8a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
  warehouse: '<path d="M22 9.3V19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.3a2 2 0 0 1 1.3-1.87l8-3.2a2 2 0 0 1 1.4 0l8 3.2A2 2 0 0 1 22 9.3Z"/><path d="M6 21v-8h12v8"/><path d="M6 17h12"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.6"/><path d="M22 21v-2a4 4 0 0 0-3-3.85"/><path d="M15.5 3.4a3.6 3.6 0 0 1 0 7.2"/>',
  board: '<path d="M3 4h18"/><path d="M5 4v11.5h14V4"/><path d="M12 15.5V19"/><path d="m8.5 22 3.5-3 3.5 3"/><path d="m8.5 8 2.5 3.5L15.5 7"/>',
  list: '<path d="M8.5 6h12M8.5 12h12M8.5 18h12"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  gantt: '<path d="M5 6h9"/><path d="M8 12h11"/><path d="M5 18h6"/>',
  calendar: '<rect x="3" y="4.5" width="18" height="17" rx="2"/><path d="M16 2.5v4M8 2.5v4M3 10.5h18"/>',
  archive: '<rect x="3" y="4" width="18" height="4.5" rx="1"/><path d="M5 8.5V19a1.5 1.5 0 0 0 1.5 1.5h11A1.5 1.5 0 0 0 19 19V8.5"/><path d="M10 13h4"/>',
  todo: '<path d="m3 6.5 1.8 1.8L8.5 4.6"/><path d="m3 17 1.8 1.8 3.7-3.7"/><path d="M13 6.5h8M13 12h8M13 17.5h8"/>',
  sliders: '<path d="M4 7h9M17 7h3M4 17h3M11 17h9M4 12h13"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/><circle cx="19" cy="12" r="2"/>',
  /* production stations */
  saw: '<circle cx="10" cy="11" r="6.5"/><circle cx="10" cy="11" r="1.4"/><path d="m14.8 15.8 5.7 4.2"/><path d="M3 21h10"/>',
  ruler: '<path d="M21.3 8.7 15.3 2.7a1 1 0 0 0-1.4 0l-11.2 11.2a1 1 0 0 0 0 1.4l6 6a1 1 0 0 0 1.4 0l11.2-11.2a1 1 0 0 0 0-1.4Z"/><path d="m7.5 10.5 2 2"/><path d="m10.5 7.5 2 2"/><path d="m13.5 4.5 2 2"/>',
  drill: '<path d="M4 8h9.5v6.5H4z"/><path d="M13.5 9.5H17a1.5 1.5 0 0 1 0 3.5h-3.5"/><path d="M17 11.2h4"/><path d="M7 14.5V19a1 1 0 0 0 1 1h2.5"/>',
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76Z"/>',
  disc: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="2.6"/><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2"/>',
  brush: '<path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 1 0-3-3Z"/><path d="M9 8c-2 3-4 3.5-7 4l8 8c.5-3 1-5 4-7"/>',
  badge: '<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"/><path d="m9 12 2 2 4-4"/>',
  box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  hammer: '<path d="m15 12-8.37 8.37a1.5 1.5 0 1 1-3-3L12 9"/><path d="m18 15 4-4"/><path d="m21.5 11.5-1.9-1.9A2 2 0 0 1 19 8.2V7l-2.3-2.3a6 6 0 0 0-4.2-1.7L9 3l.9.8A6.2 6.2 0 0 1 12 8.4V10l2 2h1.2a2 2 0 0 1 1.4.6l1.9 1.9"/>',
  toolbox: '<rect x="3" y="9" width="18" height="11" rx="2"/><path d="M8 9V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3"/><path d="M3 14h18"/><path d="M10 12.5v3M14 12.5v3"/>',
  /* engineering stages */
  bulb: '<path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2v.3h6v-.3c0-.8.4-1.5 1-2A7 7 0 0 0 12 2Z"/><path d="M9 20h6"/><path d="M10 22.5h4"/>',
  compass: '<circle cx="12" cy="12" r="9"/><path d="m16.2 7.8-2.1 6.3-6.3 2.1 2.1-6.3Z"/>',
  cube: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  cpu: '<rect x="6" y="6" width="12" height="12" rx="1.5"/><rect x="10" y="10" width="4" height="4"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
  factory: '<path d="M3 21h18"/><path d="M5 21V10l5 3.2V10l5 3.2V10l4 2.6V21"/><path d="M9 17h.01M13 17h.01M17 17h.01"/>',
  handshake: '<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2L13 9l-2.2 2.2a2 2 0 0 1-2.83 0L7.5 10.7a2 2 0 0 1 0-2.83L10.6 4.8a4 4 0 0 1 5.66 0L21 9.5"/><path d="m3 9.5 5.5 5.5"/>',
  /* materials */
  layers: '<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/><path d="m3 17.5 9 5 9-5"/>',
  roll: '<circle cx="9.5" cy="12" r="5.5"/><circle cx="9.5" cy="12" r="1.5"/><path d="M15 12h6"/>',
  bottle: '<path d="M10 2h4"/><path d="M10 2v4.5L7 10v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9l-3-3.5V2"/><path d="M7 14h10"/>',
  screw: '<path d="M9 3h6l1 2.5H8Z"/><path d="M10 5.5v11l2 4 2-4v-11"/><path d="M10 9h4M10 12h4M10 15h4"/>',
  flask: '<path d="M9 2h6"/><path d="M10 2v6L4 19.5A1.6 1.6 0 0 0 5.5 22h13a1.6 1.6 0 0 0 1.5-2.5L14 8V2"/><path d="M7 15h10"/>',
  /* whiteboard tools */
  cursor: '<path d="m4 3 7.6 18 2.3-7.4L21 11.3Z"/>',
  sticky: '<path d="M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10.5L21 15.5V5a2 2 0 0 0-2-2Z"/><path d="M15 21v-5.5H21"/>',
  type: '<path d="M4 7V4h16v3"/><path d="M12 4v16"/><path d="M9 20h6"/>',
  square: '<rect x="4" y="4" width="16" height="16" rx="2.5"/>',
  table: '<rect x="3" y="4.5" width="18" height="15" rx="1.5"/><path d="M3 10h18M3 14.7h18M10.5 4.5v15"/>',
  pen: '<path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  brain: '<path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0-1.32 4.24 3 3 0 0 0 .34 5.58 2.5 2.5 0 0 0 2.96 3.08A2.5 2.5 0 0 0 12 19.5Z"/><path d="M12 4.5a2.5 2.5 0 0 1 4.96-.46 2.5 2.5 0 0 1 1.98 3 2.5 2.5 0 0 1 1.32 4.24 3 3 0 0 1-.34 5.58 2.5 2.5 0 0 1-2.96 3.08A2.5 2.5 0 0 1 12 19.5Z"/>',
  /* misc */
  home: '<path d="m3 10.5 9-7.5 9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><path d="M9 22v-7h6v7"/>',
  building: '<rect x="4.5" y="3" width="15" height="18" rx="1.5"/><path d="M8 7h.01M12 7h.01M16 7h.01M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01"/><path d="M10 21v-3h4v3"/>',
  bed: '<path d="M3 19V5"/><path d="M3 15h18v4"/><path d="M3 11h18v4"/><circle cx="7" cy="8" r="1.6"/>',
  cup: '<path d="M5 8h11v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4Z"/><path d="M16 9h2a2.5 2.5 0 0 1 0 5h-2"/><path d="M7 3.5v2M10.5 3.5v2M14 3.5v2"/>',
  door: '<path d="M4 21h16"/><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"/><path d="M14.5 12h.01"/>',
  child: '<circle cx="12" cy="7" r="3.6"/><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"/>',
  sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9Z"/><path d="M19 15.5l.9 2.4 2.4.9-2.4.9-.9 2.4-.9-2.4-2.4-.9 2.4-.9Z"/>',
  zzz: '<path d="M4 9h6l-6 7h6"/><path d="M14 5h6l-6 7h6"/>',
  inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9-1 2-1 4.5-1.5 6.5C17.5 15 15.5 20 11 20Z"/><path d="M4 21c2-3.5 5-7 11-9"/>'
};

/* Render an icon. size in px; cls extra classes; sw stroke width */
function icon(name, size = 16, cls = "", sw = 1.8) {
  if (name === "logo") {
    // Dėdės Baldai logo (drawn in the current text colour, like the other icons)
    var m = "url(icons/logo-mask.png) center/contain no-repeat";
    return '<span class="ic dblogo ' + cls + '" role="img" aria-label="D\u0117d\u0117s Baldai" style="display:inline-block;vertical-align:middle;flex:none;width:' + size + 'px;height:' + size + 'px;background:currentColor;-webkit-mask:' + m + ';mask:' + m + '"></span>';
  }
  var body = ICONS[name] || ICONS.box;
  var fillIcons = {
    play: true
  };
  return `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fillIcons[name] ? "currentColor" : "none"}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

/* Legacy emoji → icon key mapping (stations/materials stored in state) */
var EMOJI_ICON_MAP = {
  "🪚": "saw",
  "📏": "ruler",
  "⚙️": "drill",
  "🔩": "wrench",
  "🌀": "disc",
  "🎨": "brush",
  "🔍": "badge",
  "📦": "box",
  "🛠️": "hammer",
  "🧰": "toolbox",
  "🪛": "drill",
  "🗜️": "toolbox",
  "🚪": "door",
  "🪞": "square",
  "✨": "sparkles",
  "💡": "bulb",
  "📐": "compass",
  "✏️": "pencil",
  "🤝": "handshake",
  "💾": "cpu",
  "🏭": "factory",
  "🟫": "layers",
  "🪵": "layers",
  "🧻": "roll",
  "🧴": "bottle",
  "🪝": "screw",
  "🧪": "flask",
  "🪟": "square",
  "⬜️": "square",
  "📁": "folder",
  "☕️": "cup",
  "🏨": "building",
  "🏠": "home",
  "🏢": "building",
  "🛋": "bed",
  "🍽": "cup",
  "🧒": "child"
};

/* Station icon (prefers new `ic` key, falls back to legacy emoji mapping) */
function stIcon(st, size = 15) {
  if (!st) return icon("toolbox", size);
  return icon(st.ic || EMOJI_ICON_MAP[st.icon] || "toolbox", size);
}
function matIcon(m, size = 16) {
  if (!m) return icon("box", size);
  return icon(m.ic || EMOJI_ICON_MAP[m.icon] || "box", size);
}
function pfIcon(p, size = 16) {
  if (!p) return icon("folder", size);
  return icon(p.ic || EMOJI_ICON_MAP[p.icon] || "folder", size);
}
function prioIcon(p, size = 12) {
  if (p === "rush") return icon("flame", size);
  if (p === "high") return icon("arrow-up", size);
  if (p === "low") return icon("arrow-down", size);
  return "";
}