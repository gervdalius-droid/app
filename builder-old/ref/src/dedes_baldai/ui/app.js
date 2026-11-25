/* =====================================================================
   app.js — Dėdės Baldai plugin window: cabinet editor, panel properties,
   export, settings. Talks to Ruby through window.sketchup.<callback>(json);
   Ruby answers through DB.<fn>(data). ES2015 only (SketchUp 2017+ Chromium).
   ===================================================================== */
(function () {
"use strict";
var E = window.DBEngine, X = window.DBExport;

/* ----------------------------------------------------------------- i18n */
var I18N = {
  lt: {
    tabCab:'Spintelė', tabPanel:'Detalė', tabExport:'Eksportas', tabSettings:'Nustatymai',
    newCab:'Nauja spintelė', editing:'Redaguojama', newBtn:'+ Nauja', presets:'Šablonai',
    pBaseDr:'Apatinė su stalčiais', pBaseDoor:'Apatinė su durimis', pWall:'Viršutinė', pTall:'Aukšta', pDish:'Indaplovės fasadas', pSample:'Pavyzdys: TANDEM 400',
    dims:'Matmenys', name:'Pavadinimas', W:'Plotis W', H:'Aukštis H', D:'Gylis D', thick:'Karkaso storis', legH:'Kojelių aukštis',
    hintH:'H — karkaso aukštis be kojelių',
    constr:'Konstrukcija', joinery:'Jungtis', jConf:'Konfirmatai', jCam:'Kaiščiai + ekscentrikai',
    top:'Viršus', tRails:'Juostos (4×100)', tFull:'Pilnas viršus', topOver:'Viršus dengia fasadus',
    back:'Nugara', bNone:'Nėra / plona HDF', bTop:'Kieta 18, ant viršaus', bInside:'Kieta 18, viduje',
    legs:'Kojelės', facadeT:'Fasado storis', dishwasher:'Indaplovės spintelė (tik fasadas)',
    mats:'Medžiagos ir kraštai', mCarc:'Karkasas', mFac:'Fasadai', mBack:'Nugara (jei kita)', eCarc:'Karkaso kraštas', eFac:'Fasadų kraštas',
    matHint:'Pavadinimai kaip sandėlyje / išpjovimo programoje — pagal juos kuriamos plokštės.',
    secs:'Sekcijos (nuo apačios)', kDrawers:'Stalčiai', kDoors:'Durys', kOpen:'Atvira', height:'Aukštis', auto:'likęs aukštis',
    nDrawers:'Stalčių', runner:'Bėgeliai', rail:'Bėgelių ilgis', nDoors:'Durų', split:'Dalijimas', splitV:'šalia', splitH:'viena virš kitos',
    hinge:'Lankstai', shelves:'Lentynų', addDr:'+ Stalčiai', addDoor:'+ Durys', addOpen:'+ Atvira',
    place:'Įdėti į modelį', update:'Atnaujinti modelyje', asNew:'Įdėti kaip naują',
    preview:'Vaizdas iš priekio', parts:'Detalių', programs:'CNC programų', hw:'Furnitūra', warns:'Pastabos',
    selCab:'Modelyje pažymėta', editIt:'Redaguoti', noSketchup:'Peržiūros režimas — SketchUp nepasiekiamas',
    panelTitle:'Detalės savybės', panelNone:'Pažymėkite modelyje vieną ar kelias detales (grupes ar komponentus).',
    panelCab:'Pažymėta spintelė — jos detalės valdomos skirtuke „Spintelė“.', panelBuilder:'Tai spintelės detalė — keiskite spintelės parametrus skirtuke „Spintelė“.',
    pName:'Pavadinimas sąraše', pMat:'Medžiaga', pEdges:'Kraštai', pEdgeMat:'Krašto medžiaga', pPaint:'Nudažyti modelyje šia medžiaga', pSkip:'Neįtraukti į detalių sąrašą',
    apply:'Pritaikyti', selected:'Pažymėta', measured:'Išmatuota', notPanel:'ne plokštė (netinka matmenys)',
    L1:'L1', L2:'L2', W1:'W1', W2:'W2', edgeHelp:'L — ilgieji kraštai, W — trumpieji',
    project:'Projekto pavadinimas', collect:'Atnaujinti iš modelio', exportAll:'Išsaugoti viską (.xlsm + .XXL)', exportXlsm:'Tik detalių sąrašas (.xlsm)', exportXxl:'Tik CNC programos (.XXL)',
    cabinets:'Spintelių', loose:'Pavienių detalių', exportHint:'Detalių sąrašas atidaromas išpjovimo programoje kaip SWOOD .xlsm. Programos rašomos į aplanką <projektas>_XXL (senos .XXL ten ištrinamos).',
    cPart:'Part (DB_PART)', cName:'Detalė', cMat:'Medžiaga', cL:'Ilgis', cW:'Plotis', cT:'Storis', cQty:'Kiekis', cEdges:'Kraštai', cProg:'Programos',
    looseHdr:'Rankomis nubraižytos detalės', empty:'Modelyje nėra spintelių ar plokščių.', openDir:'Atidaryti aplanką',
    settings:'Nustatymai', matLists:'Medžiagų sąrašai (po vieną eilutėje)', defaults:'Naujų spintelių numatytieji', save:'Išsaugoti', saved:'Išsaugota',
    holes:'Rodyti / slėpti skyles', about:'Gręžimų taisyklės — tos pačios kaip pasiūlymų programos CNC skirtuke (patikrinta su SWOOD modeliais).',
    needCab:'Pažymėkite spintelę modelyje', built:'Spintelė modelyje', drawer:'Stalčius', door:'Durys', none:'—'
  },
  en: {
    tabCab:'Cabinet', tabPanel:'Panel', tabExport:'Export', tabSettings:'Settings',
    newCab:'New cabinet', editing:'Editing', newBtn:'+ New', presets:'Presets',
    pBaseDr:'Base, drawers', pBaseDoor:'Base, doors', pWall:'Wall', pTall:'Tall', pDish:'Dishwasher front', pSample:'Sample: TANDEM 400',
    dims:'Dimensions', name:'Name', W:'Width W', H:'Height H', D:'Depth D', thick:'Carcass thickness', legH:'Leg height',
    hintH:'H — carcass height without legs',
    constr:'Construction', joinery:'Joinery', jConf:'Confirmats', jCam:'Dowels + cams',
    top:'Top', tRails:'Rails (4×100)', tFull:'Full top', topOver:'Top covers the fronts',
    back:'Back', bNone:'None / thin HDF', bTop:'Solid 18, on the back', bInside:'Solid 18, inside',
    legs:'Legs', facadeT:'Front thickness', dishwasher:'Dishwasher cabinet (front only)',
    mats:'Materials and edgebands', mCarc:'Carcass', mFac:'Fronts', mBack:'Back (if different)', eCarc:'Carcass edge', eFac:'Front edge',
    matHint:'Use the names from the warehouse / nesting app — boards are created from them.',
    secs:'Sections (from the bottom)', kDrawers:'Drawers', kDoors:'Doors', kOpen:'Open', height:'Height', auto:'remaining height',
    nDrawers:'Drawers', runner:'Runners', rail:'Runner length', nDoors:'Doors', split:'Split', splitV:'side by side', splitH:'stacked',
    hinge:'Hinges', shelves:'Shelves', addDr:'+ Drawers', addDoor:'+ Doors', addOpen:'+ Open',
    place:'Place in model', update:'Update in model', asNew:'Place as new',
    preview:'Front view', parts:'Parts', programs:'CNC programs', hw:'Hardware', warns:'Notes',
    selCab:'Selected in model', editIt:'Edit', noSketchup:'Preview mode — SketchUp not connected',
    panelTitle:'Panel properties', panelNone:'Select one or more panels (groups or components) in the model.',
    panelCab:'A cabinet is selected — its panels are set on the Cabinet tab.', panelBuilder:'This is a cabinet panel — change the cabinet on the Cabinet tab.',
    pName:'Name in the part list', pMat:'Material', pEdges:'Edgebands', pEdgeMat:'Edge material', pPaint:'Paint it with this material', pSkip:'Leave out of the part list',
    apply:'Apply', selected:'Selected', measured:'Measured', notPanel:'not a board (size does not fit)',
    L1:'L1', L2:'L2', W1:'W1', W2:'W2', edgeHelp:'L — long edges, W — short edges',
    project:'Project name', collect:'Refresh from model', exportAll:'Save all (.xlsm + .XXL)', exportXlsm:'Part list only (.xlsm)', exportXxl:'CNC programs only (.XXL)',
    cabinets:'Cabinets', loose:'Loose panels', exportHint:'The part list opens in the nesting app like a SWOOD .xlsm. Programs go to the folder <project>_XXL (old .XXL files there are deleted).',
    cPart:'Part (DB_PART)', cName:'Part', cMat:'Material', cL:'Length', cW:'Width', cT:'Thick.', cQty:'Qty', cEdges:'Edges', cProg:'Programs',
    looseHdr:'Hand-drawn panels', empty:'No cabinets or boards in the model.', openDir:'Open folder',
    settings:'Settings', matLists:'Material lists (one per line)', defaults:'Defaults for new cabinets', save:'Save', saved:'Saved',
    holes:'Show / hide holes', about:'Drilling rules — the same as the offer app CNC tab (verified against SWOOD models).',
    needCab:'Select a cabinet in the model', built:'Cabinet in model', drawer:'Drawer', door:'Door', none:'—'
  }
};

/* ----------------------------------------------------------------- state */
var S = {
  lang:'lt', tab:'cab', version:'', connected:!!window.sketchup,
  settings:{ lang:'lt', mats:{ carc:'', facade:'', edge:'' },
             defaults:{ joinery:'confirmat', top:'rails', back:'none', legs:true, legH:100, thick:18, facadeT:18, carc:'', facade:'', edgeCarc:'', edgeFacade:'' } },
  cab:null, edit:null, nextNr:1, sel:null, project:'', projectTouched:false,
  col:null, pj:null, pendingWrite:null, lastDir:null, pf:null, pfSig:''
};
function t(k) { var d = I18N[S.lang] || I18N.lt; return d[k] !== undefined ? d[k] : (I18N.lt[k] !== undefined ? I18N.lt[k] : k); }
function clone(o) { return JSON.parse(JSON.stringify(o)); }
function esc(s) { return String(s === undefined || s === null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
function rb(name, arg) {
  if (window.sketchup && typeof window.sketchup[name] === 'function') window.sketchup[name](arg === undefined ? '' : arg);
  else if (window.console) console.log('[sketchup.' + name + ']', arg);
}
function lines(s) { return String(s || '').split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean); }
function toast(text, err) {
  var el = document.getElementById('toast'); el.textContent = text; el.className = 'toast on' + (err ? ' err' : '');
  clearTimeout(toast._t); toast._t = setTimeout(function () { el.className = 'toast'; }, err ? 6000 : 2600);
}
var num = E.num;
function r1(v) { return num(Math.round(v * 10) / 10); }

/* ----------------------------------------------------------------- presets */
function dflt() { return S.settings.defaults; }
function preset(key) {
  var d = dflt(), c = E.newCabinet();
  c.thick = +d.thick || 18; c.legH = +d.legH || 100;
  c.mat = { carc:d.carc || '', facade:d.facade || '', back:'' }; c.edge = { carc:d.edgeCarc || '', facade:d.edgeFacade || '' };
  c.cnc = { joinery:d.joinery, top:d.top, back:d.back, legs:!!d.legs, topOverFacade:false, facadeT:+d.facadeT || 18 };
  var sec = function (k, o) { return Object.assign(E.newSection(k), o); };
  if (key === 'baseDoor') { c.sections = [sec('doors', { fill:true, nDoors:1, shelves:1 })]; }
  else if (key === 'wall') { c.H = 720; c.D = 330; c.cnc.legs = false; c.cnc.top = 'full'; c.sections = [sec('doors', { fill:true, nDoors:2, shelves:1 })]; }
  else if (key === 'tall') { c.H = 2000; c.D = 580; c.cnc.top = 'full'; c.sections = [sec('drawers', { fill:false, height:700, nDrawers:2, hw:'BLUM TANDEMBOX', rail:500 }), sec('doors', { fill:true, nDoors:2, shelves:3 })]; }
  else if (key === 'dish') { c.name = 'Indaplovė'; c.dishwasher = true; c.cnc.legs = false; c.sections = []; }
  else if (key === 'sample') { c.name = 'TANDEM'; c.W = 400; c.H = 580; c.D = 438; c.cnc = { joinery:'cam', back:'top', top:'full', legs:true, topOverFacade:true, facadeT:18 }; c.sections = [sec('drawers', { fill:true, nDrawers:4, hw:'BLUM TANDEM', rail:400 })]; }
  else { c.sections = [sec('drawers', { fill:true, nDrawers:3, hw:'BLUM TANDEMBOX', rail:500 })]; }
  return c;
}
function normalizeCab(def) {
  var c = Object.assign(E.newCabinet(), clone(def || {}));
  c.mat = Object.assign({ carc:'', facade:'', back:'' }, c.mat || {}); c.edge = Object.assign({ carc:'', facade:'' }, c.edge || {});
  E.cncDefaults(c); c.sections = (c.sections || []).map(function (s) { return Object.assign(E.newSection(s.kind), s); });
  return c;
}

/* ----------------------------------------------------------------- tabs */
var TABS = [['cab', 'tabCab'], ['panel', 'tabPanel'], ['export', 'tabExport'], ['settings', 'tabSettings']];
function renderTabs() {
  document.getElementById('tabs').innerHTML = TABS.map(function (x) { return '<button data-act="tab:' + x[0] + '" class="' + (S.tab === x[0] ? 'on' : '') + '">' + t(x[1]) + '</button>'; }).join('');
  Array.prototype.forEach.call(document.querySelectorAll('.lang button'), function (b) { b.className = b.getAttribute('data-lang') === S.lang ? 'on' : ''; });
  document.getElementById('ver').textContent = S.version ? 'v' + S.version : '';
}
function render() {
  renderTabs();
  var m = document.getElementById('main');
  if (S.tab === 'cab') m.innerHTML = viewCab();
  else if (S.tab === 'panel') m.innerHTML = viewPanel();
  else if (S.tab === 'export') m.innerHTML = viewExport();
  else m.innerHTML = viewSettings();
  if (S.tab === 'cab') renderPreview();
}

/* ----------------------------------------------------------------- form helpers */
function fNum(label, bind, val, extra) { return '<label class="f"><span>' + label + '</span><input type="number" step="any" data-bind="' + bind + '" value="' + esc(val) + '"' + (extra || '') + '></label>'; }
function fText(label, bind, val, list, cls) { return '<label class="f ' + (cls || 'grow') + '"><span>' + label + '</span><input type="text" data-bind="' + bind + '" value="' + esc(val) + '"' + (list ? ' list="' + list + '"' : '') + '></label>'; }
function fSel(label, bind, val, opts, rer) { return '<label class="f"><span>' + label + '</span><select data-bind="' + bind + '"' + (rer ? ' data-rerender="1"' : '') + '>' + opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (String(val) === String(o[0]) ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>'; }
function fChk(label, bind, val, rer) { return '<label class="chk"><input type="checkbox" data-bind="' + bind + '"' + (val ? ' checked' : '') + (rer ? ' data-rerender="1"' : '') + '>' + label + '</label>'; }
function datalists() {
  var m = S.settings.mats;
  var dl = function (id, arr) { return '<datalist id="' + id + '">' + lines(arr).map(function (x) { return '<option value="' + esc(x) + '">'; }).join('') + '</datalist>'; };
  return dl('dl-carc', m.carc) + dl('dl-fac', m.facade + '\n' + m.carc) + dl('dl-edge', m.edge);
}
function getPath(o, path) { return path.split('.').reduce(function (a, k) { return a == null ? a : a[k]; }, o); }
function setPath(o, path, v) { var ks = path.split('.'), last = ks.pop(); var tgt = ks.reduce(function (a, k) { if (a[k] == null) a[k] = {}; return a[k]; }, o); tgt[last] = v; }

/* ----------------------------------------------------------------- cabinet tab */
function viewCab() {
  var c = S.cab, o = c.cnc;
  var head = S.edit
    ? '<span class="badge edit">' + t('editing') + ': S' + S.edit.nr + (c.name ? ' ' + esc(c.name) : '') + '</span><button class="btn sm" data-act="new">' + t('newBtn') + '</button>'
    : '<span class="badge">' + t('newCab') + ' · S' + S.nextNr + '</span>';
  var banner = '';
  if (S.sel && S.sel.cabinet && (!S.edit || S.sel.cabinet.uid !== S.edit.uid)) {
    banner = '<div class="note info" style="margin-bottom:10px;display:flex;align-items:center;gap:8px;justify-content:space-between"><span>' + t('selCab') + ': <b>S' + S.sel.cabinet.nr + ' ' + esc(S.sel.cabinet.def && S.sel.cabinet.def.name || '') + '</b></span><button class="btn sm" data-act="editSel">' + t('editIt') + '</button></div>';
  }
  if (!S.connected) banner += '<div class="note" style="margin-bottom:10px">' + t('noSketchup') + '</div>';
  var presetChips = [['baseDr', 'pBaseDr'], ['baseDoor', 'pBaseDoor'], ['wall', 'pWall'], ['tall', 'pTall'], ['dish', 'pDish'], ['sample', 'pSample']]
    .map(function (p) { return '<button class="chip" data-act="preset:' + p[0] + '">' + t(p[1]) + '</button>'; }).join('');

  var dims = '<div class="card"><h3>' + t('dims') + '</h3><div class="row">' + fText(t('name'), 'name', c.name, null, 'grow') + '</div><div class="row" style="margin-top:8px">' +
    fNum(t('W'), 'W', c.W) + fNum(t('H'), 'H', c.H) + fNum(t('D'), 'D', c.D) + fNum(t('thick'), 'thick', c.thick) + (o.legs && !c.dishwasher ? fNum(t('legH'), 'legH', c.legH) : '') +
    '</div><div class="hint" style="margin-top:6px">' + t('hintH') + '</div></div>';

  var constr = '<div class="card"><h3>' + t('constr') + '</h3>' + (c.dishwasher ? '' :
    '<div class="row">' + fSel(t('joinery'), 'cnc.joinery', o.joinery, [['confirmat', t('jConf')], ['cam', t('jCam')]]) +
    fSel(t('top'), 'cnc.top', o.top, [['rails', t('tRails')], ['full', t('tFull')]], true) +
    fSel(t('back'), 'cnc.back', o.back, [['none', t('bNone')], ['top', t('bTop')], ['inside', t('bInside')]]) + '</div>' +
    '<div class="row" style="margin-top:8px">' + fNum(t('facadeT'), 'cnc.facadeT', o.facadeT) + fChk(t('legs'), 'cnc.legs', o.legs, true) +
    (o.top === 'full' ? fChk(t('topOver'), 'cnc.topOverFacade', o.topOverFacade) : '') + '</div>') +
    '<div class="row" style="margin-top:6px">' + fChk(t('dishwasher'), 'dishwasher', c.dishwasher, true) + '</div></div>';

  var mats = '<div class="card"><h3>' + t('mats') + '</h3><div class="row">' + fText(t('mCarc'), 'mat.carc', c.mat.carc, 'dl-carc') + fText(t('mFac'), 'mat.facade', c.mat.facade, 'dl-fac') + '</div>' +
    '<div class="row" style="margin-top:8px">' + fText(t('mBack'), 'mat.back', c.mat.back, 'dl-carc') + fText(t('eCarc'), 'edge.carc', c.edge.carc, 'dl-edge') + fText(t('eFac'), 'edge.facade', c.edge.facade, 'dl-edge') + '</div>' +
    '<div class="hint" style="margin-top:6px">' + t('matHint') + '</div></div>';

  var secs = c.dishwasher ? '' : '<div class="card"><h3>' + t('secs') + '</h3>' + c.sections.map(viewSection).join('') +
    '<div class="bar"><button class="btn sm" data-act="secAdd:drawers">' + t('addDr') + '</button><button class="btn sm" data-act="secAdd:doors">' + t('addDoor') + '</button><button class="btn sm" data-act="secAdd:open">' + t('addOpen') + '</button></div></div>';

  var actions = '<div class="bar">' + (S.edit
    ? '<button class="btn pri" data-act="build">' + t('update') + '</button><button class="btn" data-act="buildNew">' + t('asNew') + '</button>'
    : '<button class="btn pri" data-act="build">' + t('place') + '</button>') +
    '<span style="flex:1"></span><button class="btn ghost" data-act="holes">' + t('holes') + '</button></div>';

  return datalists() + '<div class="grid"><div>' +
    '<div class="status"><div class="bar">' + head + '</div></div>' + banner +
    '<div class="card"><h3>' + t('presets') + '</h3><div class="presets">' + presetChips + '</div></div>' +
    dims + constr + mats + secs + actions +
    '</div><div class="sticky"><div class="card"><h3>' + t('preview') + '</h3><div class="sketch" id="sketch"></div></div><div class="card" id="summary"></div></div></div>';
}

function viewSection(s, i) {
  var b = 'sec.' + i + '.';
  var kinds = [['drawers', t('kDrawers')], ['doors', t('kDoors')], ['open', t('kOpen')]];
  var h = '<div class="sec"><div class="head"><span class="num">' + (i + 1) + '</span>' +
    '<label class="f"><select data-bind="' + b + 'kind" data-rerender="1">' + kinds.map(function (k) { return '<option value="' + k[0] + '"' + (s.kind === k[0] ? ' selected' : '') + '>' + k[1] + '</option>'; }).join('') + '</select></label>' +
    fChk(t('auto'), b + 'fill', s.fill, true) + (s.fill ? '' : '<label class="f"><input type="number" step="any" class="w-s" data-bind="' + b + 'height" value="' + esc(s.height) + '" title="' + t('height') + '"></label>') +
    '<div class="tools"><button class="btn ghost sm" data-act="secDown:' + i + '" title="↓">↓</button><button class="btn ghost sm" data-act="secUp:' + i + '" title="↑">↑</button><button class="btn ghost sm" data-act="secDel:' + i + '" title="×">✕</button></div></div><div class="row">';
  if (s.kind === 'drawers') {
    h += fNum(t('nDrawers'), b + 'nDrawers', s.nDrawers) + fSel(t('runner'), b + 'hw', s.hw, E.DRAWER_HW.map(function (x) { return [x, x]; })) +
      fSel(t('rail'), b + 'rail', s.rail, [270, 300, 350, 400, 450, 500, 550, 600, 650].map(function (x) { return [x, x + ' mm']; }));
  } else if (s.kind === 'doors') {
    h += fNum(t('nDoors'), b + 'nDoors', s.nDoors) + fSel(t('split'), b + 'doorSplit', s.doorSplit, [['v', t('splitV')], ['h', t('splitH')]]) +
      fSel(t('hinge'), b + 'hinge', s.hinge, E.DOOR_HW.map(function (x) { return [x, x]; })) + fNum(t('shelves'), b + 'shelves', s.shelves);
  } else {
    h += fNum(t('shelves'), b + 'shelves', s.shelves);
  }
  return h + '</div></div>';
}

function compute() {
  var nr = S.edit ? S.edit.nr : S.nextNr;
  return E.buildCabinet(clone(S.cab), nr - 1, S.project || 'PROJ');
}

function renderPreview() {
  var el = document.getElementById('sketch'); if (!el) return;
  var r = compute();
  el.innerHTML = sketchSvg(r, S.cab);
  var progs = 0, warns = r.warnings.slice();
  r.panels.forEach(function (p) { var pr = E.programs(p); progs += pr.files.length; pr.warnings.forEach(function (w) { warns.push(w.replace(/^[^:]+: /, p.short + ': ')); }); });
  warns = warns.filter(function (w, i) { return warns.indexOf(w) === i; });
  var sum = '<div class="stats" style="grid-template-columns:repeat(3,1fr)"><div class="stat"><b>' + r.panels.length + '</b><span>' + t('parts') + '</span></div><div class="stat"><b>' + progs + '</b><span>' + t('programs') + '</span></div><div class="stat"><b>' + num(+S.cab.W) + '×' + num(+S.cab.H) + '×' + num(+S.cab.D) + '</b><span>W×H×D</span></div></div>';
  if (r.hardware.length) sum += '<h3>' + t('hw') + '</h3><div class="kv" style="margin-bottom:10px">' + r.hardware.map(function (h) { return '<span>' + h.qty + ' ' + esc(h.unit) + '</span><div>' + esc(h.item) + '</div>'; }).join('') + '</div>';
  if (warns.length) sum += '<h3>' + t('warns') + '</h3><ul class="warns">' + warns.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>';
  document.getElementById('summary').innerHTML = sum;
}

/* front view: every panel's box projected on X–Z, back to front */
function sketchSvg(r, c) {
  var W = +c.W || 1, H = +c.H || 1, legH = (c.cnc && c.cnc.legs && !c.dishwasher) ? (+c.legH || 0) : 0;
  var sc = Math.min(380 / W, 400 / (H + legH)), pad = 34;
  var vw = W*sc + 2*pad + 20, vh = (H + legH)*sc + 2*pad;
  var X0 = function (x) { return pad + x*sc; }, Z0 = function (z) { return pad + (H - z)*sc; };
  var boxes = r.panels.map(function (p) {
    var q = p.place, mn = [1e9, 1e9, 1e9], mx = [-1e9, -1e9, -1e9];
    [0, p.L].forEach(function (a) { [0, p.W].forEach(function (b) { [0, p.T].forEach(function (cc) {
      for (var i = 0; i < 3; i++) { var v = q.o[i] + a*q.u[i] + b*q.v[i] - cc*q.n[i]; if (v < mn[i]) mn[i] = v; if (v > mx[i]) mx[i] = v; }
    }); }); });
    return { p:p, mn:mn, mx:mx };
  }).sort(function (a, b) { return b.mn[1] - a.mn[1]; });
  var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + vw + ' ' + vh + '" width="' + vw + '" height="' + vh + '" font-family="Segoe UI,Arial,sans-serif">';
  s += '<defs><marker id="ar" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 1 L8 4 L0 7z" fill="#8a8378"/></marker></defs>';
  var frontY = Math.min.apply(null, r.legs.map(function (k) { return k.y; }).concat([1e9]));
  r.legs.forEach(function (k) { if (k.y !== frontY) return; s +='<rect x="' + X0(k.x - k.d/2) + '" y="' + Z0(0) + '" width="' + k.d*sc + '" height="' + k.h*sc + '" fill="#4a4743"/>'; });
  var fn = 0;
  boxes.forEach(function (b) {
    var p = b.p, isFac = p.role === 'FASADAS' || p.role === 'DURYS';
    var x = X0(b.mn[0]), y = Z0(b.mx[2]), w = (b.mx[0] - b.mn[0])*sc, h = (b.mx[2] - b.mn[2])*sc;
    if (p.role === 'LENTYNA') { s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + Math.max(h, 1) + '" fill="#d9d3c8" stroke="#9a9286" stroke-width="0.6"/>'; return; }
    s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + (isFac ? '#d6bf9c' : '#ece7dc') + '" fill-opacity="' + (isFac ? 0.82 : 1) + '" stroke="' + (isFac ? '#8a6c43' : '#7b7468') + '" stroke-width="0.8"/>';
    if (isFac) {
      fn++;
      var lbl = (p.role === 'DURYS' ? t('door') : t('drawer')) + ' ' + num(Math.round(p.role === 'DURYS' ? Math.min(p.L, p.W) : p.L)) + '×' + num(Math.round(p.role === 'DURYS' ? Math.max(p.L, p.W) : p.W));
      if (h > 16 && w > 60) s += '<text x="' + (x + w/2) + '" y="' + (y + h/2 + 4) + '" text-anchor="middle" font-size="11" fill="#5a4426">' + esc(lbl) + '</text>';
      if (p.role === 'FASADAS' && h > 12) s += '<rect x="' + (x + w/2 - 18) + '" y="' + (y + Math.min(14, h/4)) + '" width="36" height="3" rx="1.5" fill="#6d5636" opacity=".55"/>';
    }
  });
  var yb = Z0(-legH) + 16;
  s += '<line x1="' + X0(0) + '" y1="' + yb + '" x2="' + X0(W) + '" y2="' + yb + '" stroke="#8a8378" marker-start="url(#ar)" marker-end="url(#ar)"/><text x="' + X0(W/2) + '" y="' + (yb + 13) + '" text-anchor="middle" font-size="11" fill="#5e584f">' + num(W) + '</text>';
  var xr = X0(W) + 14;
  s += '<line x1="' + xr + '" y1="' + Z0(H) + '" x2="' + xr + '" y2="' + Z0(0) + '" stroke="#8a8378" marker-start="url(#ar)" marker-end="url(#ar)"/><text x="' + (xr + 4) + '" y="' + (Z0(H/2)) + '" font-size="11" fill="#5e584f" transform="rotate(90 ' + (xr + 4) + ' ' + Z0(H/2) + ')" text-anchor="middle">' + num(H) + '</text>';
  return s + '</svg>';
}

/* ----------------------------------------------------------------- panel tab */
function selSig() { return S.sel ? JSON.stringify((S.sel.panels || []).map(function (p) { return [p.name, p.mat, p.eb]; })) : ''; }
function initPanelForm() {
  var p = (S.sel && S.sel.panels && S.sel.panels[0]) || {};
  var eb = p.eb || {}, m = eb.eb1 || eb.eb2 || eb.eb3 || eb.eb4 || dflt().edgeCarc || '';
  S.pf = { name:(S.sel && S.sel.panels.length === 1) ? (p.name || '') : '', mat:p.mat || p.paint || '', ebMat:m,
           e1:!!eb.eb1, e2:!!eb.eb2, e3:!!eb.eb3, e4:!!eb.eb4, skip:!!p.skip, paint:false };
  S.pfSig = selSig();
}
function viewPanel() {
  var sel = S.sel || { panels:[] };
  if (sel.cabinet && !sel.panels.length) return '<div class="card"><div class="empty">' + t('panelCab') + '</div></div>';
  if (!sel.panels.length) return '<div class="card"><div class="empty">' + t('panelNone') + '</div></div>';
  if (!S.pf || S.pfSig !== selSig()) initPanelForm();
  var f = S.pf;
  var builder = sel.panels.some(function (p) { return p.builder; });
  var list = sel.panels.slice(0, 12).map(function (p) {
    return '<tr><td>' + esc(p.name || '—') + '</td><td>' + esc(p.mat || p.paint || '—') + '</td><td class="n">' + (p.dims ? p.dims.map(num).join(' × ') : '<span class="hint">' + t('notPanel') + '</span>') + '</td></tr>';
  }).join('');
  var eb = function (k, lbl) { return '<label><input type="checkbox" data-pf="' + k + '"' + (f[k] ? ' checked' : '') + '>' + lbl + '</label>'; };
  return datalists() + '<div class="split"><div class="card"><h3>' + t('panelTitle') + '</h3>' +
    (builder ? '<div class="note" style="margin-bottom:10px">' + t('panelBuilder') + '</div>' : '') +
    '<div class="row"><label class="f grow"><span>' + t('pName') + '</span><input type="text" data-pf="name" value="' + esc(f.name) + '"></label></div>' +
    '<div class="row" style="margin-top:8px"><label class="f grow"><span>' + t('pMat') + '</span><input type="text" list="dl-fac" data-pf="mat" value="' + esc(f.mat) + '"></label></div>' +
    '<div class="row" style="margin-top:4px"><label class="chk"><input type="checkbox" data-pf="paint"' + (f.paint ? ' checked' : '') + '>' + t('pPaint') + '</label></div>' +
    '<h3 style="margin-top:12px">' + t('pEdges') + '</h3><div class="row" style="align-items:center;gap:16px">' +
    '<div class="edgebox"><span style="grid-column:2;grid-row:1">' + eb('e1', 'L1') + '</span><span style="grid-column:1;grid-row:2">' + eb('e3', 'W1') + '</span><div class="pn"></div><span style="grid-column:3;grid-row:2">' + eb('e4', 'W2') + '</span><span style="grid-column:2;grid-row:3">' + eb('e2', 'L2') + '</span></div>' +
    '<div class="grow"><label class="f"><span>' + t('pEdgeMat') + '</span><input type="text" list="dl-edge" data-pf="ebMat" value="' + esc(f.ebMat) + '"></label><div class="hint" style="margin-top:4px">' + t('edgeHelp') + '</div></div></div>' +
    '<div class="row" style="margin-top:10px"><label class="chk"><input type="checkbox" data-pf="skip"' + (f.skip ? ' checked' : '') + '>' + t('pSkip') + '</label></div>' +
    '<div class="bar" style="margin-top:12px"><button class="btn pri" data-act="applyPanel">' + t('apply') + '</button><span class="hint">' + t('selected') + ': ' + sel.panels.length + '</span></div></div>' +
    '<div class="card"><h3>' + t('measured') + '</h3><table><thead><tr><th>' + t('cName') + '</th><th>' + t('cMat') + '</th><th>L × W × T</th></tr></thead><tbody>' + list + '</tbody></table></div></div>';
}
function applyPanel() {
  var f = S.pf, m = f.ebMat.trim();
  var props = { mat:f.mat.trim(), paint:!!f.paint, skip:!!f.skip, eb:{ eb1:f.e1 ? m : '', eb2:f.e2 ? m : '', eb3:f.e3 ? m : '', eb4:f.e4 ? m : '' } };
  if (f.name.trim() || (S.sel && S.sel.panels.length === 1)) props.name = f.name.trim();
  rb('set_panel', JSON.stringify(props));
}

/* ----------------------------------------------------------------- export tab */
function rebuildProject() { if (S.col) S.pj = X.buildProject(S.col, { project:S.project, date:S.col.date }); }
function viewExport() {
  var pj = S.pj;
  var head = '<div class="card"><div class="row">' +
    '<label class="f grow"><span>' + t('project') + '</span><input type="text" id="proj" value="' + esc(S.project) + '"></label>' +
    '<button class="btn" data-act="collect">↻ ' + t('collect') + '</button></div>' +
    '<div class="bar" style="margin-top:10px"><button class="btn pri" data-act="write:all"' + (pj && pj.parts.length ? '' : ' disabled') + '>' + t('exportAll') + '</button>' +
    '<button class="btn" data-act="write:xlsm"' + (pj && pj.parts.length ? '' : ' disabled') + '>' + t('exportXlsm') + '</button>' +
    '<button class="btn" data-act="write:xxl"' + (pj && pj.files.length ? '' : ' disabled') + '>' + t('exportXxl') + '</button>' +
    (S.lastDir ? '<button class="btn ghost" data-act="openDir">' + t('openDir') + '</button>' : '') + '</div>' +
    '<div class="hint" style="margin-top:8px">' + esc(t('exportHint')) + '</div></div>';
  if (!pj) return head + '<div class="card"><div class="empty">…</div></div>';
  if (!pj.parts.length) return head + '<div class="card"><div class="empty">' + t('empty') + '</div></div>';
  var nCab = (S.col.cabinets || []).length, nLoose = pj.parts.filter(function (p) { return p.src === 'loose'; }).reduce(function (a, p) { return a + p.qty; }, 0);
  var stats = '<div class="stats"><div class="stat"><b>' + nCab + '</b><span>' + t('cabinets') + '</span></div><div class="stat"><b>' + pj.parts.reduce(function (a, p) { return a + p.qty; }, 0) + '</b><span>' + t('parts') + '</span></div>' +
    '<div class="stat"><b>' + pj.files.length + '</b><span>' + t('programs') + '</span></div><div class="stat"><b>' + nLoose + '</b><span>' + t('loose') + '</span></div></div>';
  var rows = '', lastCab = null;
  var cabName = {}; (S.col.cabinets || []).forEach(function (c) { cabName[c.nr] = c; });
  pj.parts.forEach(function (p) {
    var key = p.src === 'loose' ? 'L' : p.cab;
    if (key !== lastCab) {
      lastCab = key;
      var c = cabName[p.cab];
      rows += p.src === 'loose' ? '<tr class="cabrow"><td colspan="8">' + t('looseHdr') + '</td></tr>'
        : '<tr class="cabrow" data-act="selCab:' + esc(c ? c.uid : '') + '"><td colspan="8">S' + p.cab + (c && c.def && c.def.name ? ' — ' + esc(c.def.name) : '') + '  ·  ' + (c ? num(c.def.W) + '×' + num(c.def.H) + '×' + num(c.def.D) : '') + '</td></tr>';
    }
    rows += '<tr><td>' + esc(p.short) + '</td><td>' + esc(p.mat) + '</td><td class="n">' + r1(p.L) + '</td><td class="n">' + r1(p.W) + '</td><td class="n">' + r1(p.T) + '</td><td class="n">' + p.qty + '</td><td>' + esc(X.edgeText(p.eb)) + '</td><td class="mono">' + [p.op1, p.op2].filter(Boolean).map(function (x) { return esc(x.replace(/^.*_(\dOP)$/, '$1')); }).join(' ') + '</td></tr>';
  });
  var table = '<div class="card"><h3>' + t('parts') + '</h3><div class="tblwrap"><table><thead><tr><th>' + t('cName') + '</th><th>' + t('cMat') + '</th><th>' + t('cL') + '</th><th>' + t('cW') + '</th><th>' + t('cT') + '</th><th>' + t('cQty') + '</th><th>' + t('cEdges') + '</th><th>' + t('cProg') + '</th></tr></thead><tbody>' + rows + '</tbody></table></div></div>';
  var side = '';
  if (pj.hardware.length) side += '<div class="card"><h3>' + t('hw') + '</h3><div class="kv">' + pj.hardware.map(function (h) { return '<span>' + h.qty + ' ' + esc(h.unit) + '</span><div>' + esc(h.item) + '</div>'; }).join('') + '</div></div>';
  if (pj.warnings.length) side += '<div class="card"><h3>' + t('warns') + ' (' + pj.warnings.length + ')</h3><ul class="warns">' + pj.warnings.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul></div>';
  return head + stats + table + '<div class="split">' + side + '</div>';
}
function doWrite(kind) {
  var pj = S.pj; if (!pj) return;
  var entries = null;
  if (kind !== 'xxl') { var e = X.workbookEntries(X.sheets(pj)); entries = Object.keys(e).map(function (k) { return [k, e[k]]; }); }
  if (kind === 'xlsm') rb('write_xlsm', JSON.stringify({ project:pj.project, entries:entries }));
  else rb('write_all', JSON.stringify({ project:pj.project, entries:entries, files:kind === 'xlsm' ? null : pj.files }));
}

/* ----------------------------------------------------------------- settings tab */
function viewSettings() {
  var m = S.settings.mats, d = dflt();
  var ta = function (k, lbl) { return '<label class="f"><span>' + lbl + '</span><textarea data-set="mats.' + k + '">' + esc(m[k]) + '</textarea></label>'; };
  return datalists() + '<div class="split"><div class="card"><h3>' + t('matLists') + '</h3>' + ta('carc', t('mCarc')) + '<div style="height:8px"></div>' + ta('facade', t('mFac')) + '<div style="height:8px"></div>' + ta('edge', t('eCarc') + ' / ' + t('eFac')) + '</div>' +
    '<div class="card"><h3>' + t('defaults') + '</h3><div class="row">' +
    sSel(t('joinery'), 'joinery', d.joinery, [['confirmat', t('jConf')], ['cam', t('jCam')]]) + sSel(t('top'), 'top', d.top, [['rails', t('tRails')], ['full', t('tFull')]]) +
    sSel(t('back'), 'back', d.back, [['none', t('bNone')], ['top', t('bTop')], ['inside', t('bInside')]]) + '</div><div class="row" style="margin-top:8px">' +
    sNum(t('thick'), 'thick', d.thick) + sNum(t('facadeT'), 'facadeT', d.facadeT) + sNum(t('legH'), 'legH', d.legH) +
    '<label class="chk"><input type="checkbox" data-set="defaults.legs"' + (d.legs ? ' checked' : '') + '>' + t('legs') + '</label></div><div class="row" style="margin-top:8px">' +
    sText(t('mCarc'), 'carc', d.carc, 'dl-carc') + sText(t('mFac'), 'facade', d.facade, 'dl-fac') + '</div><div class="row" style="margin-top:8px">' +
    sText(t('eCarc'), 'edgeCarc', d.edgeCarc, 'dl-edge') + sText(t('eFac'), 'edgeFacade', d.edgeFacade, 'dl-edge') + '</div>' +
    '<div class="bar" style="margin-top:12px"><button class="btn pri" data-act="saveSettings">' + t('save') + '</button></div>' +
    '<p class="hint" style="margin-top:14px">' + t('about') + '</p></div></div>';
}
function sSel(l, k, v, opts) { return '<label class="f"><span>' + l + '</span><select data-set="defaults.' + k + '">' + opts.map(function (o) { return '<option value="' + o[0] + '"' + (v === o[0] ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>'; }
function sNum(l, k, v) { return '<label class="f"><span>' + l + '</span><input type="number" step="any" data-set="defaults.' + k + '" value="' + esc(v) + '"></label>'; }
function sText(l, k, v, list) { return '<label class="f grow"><span>' + l + '</span><input type="text" list="' + list + '" data-set="defaults.' + k + '" value="' + esc(v) + '"></label>'; }

/* ----------------------------------------------------------------- events */
function bindValue(el) {
  var path = el.getAttribute('data-bind'); if (!path) return false;
  var v = el.type === 'checkbox' ? el.checked : el.value;
  if (el.type === 'number') v = el.value === '' ? '' : +el.value;
  if (/^sec\.\d+\./.test(path)) {
    var m = path.match(/^sec\.(\d+)\.(.+)$/), s = S.cab.sections[+m[1]];
    if (m[2] === 'rail') v = +v;
    s[m[2]] = v;
    if (m[2] === 'kind') { var fresh = E.newSection(v); ['nDrawers', 'hw', 'rail', 'nDoors', 'doorSplit', 'hinge', 'shelves'].forEach(function (k) { if (s[k] === undefined) s[k] = fresh[k]; }); }
  } else setPath(S.cab, path, v);
  return true;
}
document.addEventListener('input', function (e) {
  var el = e.target;
  if (el.hasAttribute('data-bind')) { if (el.type !== 'checkbox' && el.tagName !== 'SELECT') { bindValue(el); renderPreview(); } }
  else if (el.hasAttribute('data-pf')) { var k = el.getAttribute('data-pf'); S.pf[k] = el.type === 'checkbox' ? el.checked : el.value; }
  else if (el.id === 'proj') { S.project = el.value; S.projectTouched = true; rebuildProject(); }
});
document.addEventListener('change', function (e) {
  var el = e.target;
  if (el.hasAttribute('data-bind')) { bindValue(el); if (el.hasAttribute('data-rerender')) render(); else renderPreview(); }
  else if (el.hasAttribute('data-pf')) { var k = el.getAttribute('data-pf'); S.pf[k] = el.type === 'checkbox' ? el.checked : el.value; }
  else if (el.hasAttribute('data-set')) { setPath(S.settings, el.getAttribute('data-set'), el.type === 'checkbox' ? el.checked : (el.type === 'number' ? +el.value : el.value)); }
  else if (el.id === 'proj') { S.project = el.value.trim(); rb('save_settings', JSON.stringify({ project:S.project })); rebuildProject(); render(); }
});
document.addEventListener('click', function (e) {
  var lb = e.target.closest ? e.target.closest('[data-lang]') : null;
  if (lb) { S.lang = lb.getAttribute('data-lang'); S.settings.lang = S.lang; rb('save_settings', JSON.stringify({ lang:S.lang })); render(); return; }
  var b = e.target.closest ? e.target.closest('[data-act]') : null; if (!b || b.disabled) return;
  var a = b.getAttribute('data-act'), arg = a.indexOf(':') > 0 ? a.slice(a.indexOf(':') + 1) : '';
  a = a.split(':')[0];
  var secs = S.cab && S.cab.sections;
  switch (a) {
    case 'tab': S.tab = arg; if (arg === 'export') collect(); if (arg === 'panel') rb('refresh'); render(); break;
    case 'preset': var keepName = S.edit ? S.cab.name : ''; S.cab = preset(arg); if (keepName && !S.cab.name) S.cab.name = keepName; render(); break;
    case 'new': S.edit = null; S.cab = preset('baseDr'); render(); break;
    case 'editSel': if (S.sel && S.sel.cabinet) loadCab(S.sel.cabinet); render(); break;
    case 'secAdd': secs.push(Object.assign(E.newSection(arg), { fill:!secs.some(function (s) { return s.fill; }) })); render(); break;
    case 'secDel': secs.splice(+arg, 1); render(); break;
    case 'secUp': if (+arg < secs.length - 1) { var x = secs[+arg]; secs[+arg] = secs[+arg + 1]; secs[+arg + 1] = x; } render(); break;
    case 'secDown': if (+arg > 0) { var y = secs[+arg]; secs[+arg] = secs[+arg - 1]; secs[+arg - 1] = y; } render(); break;
    case 'build': build(false); break;
    case 'buildNew': build(true); break;
    case 'holes': rb('toggle_holes'); break;
    case 'applyPanel': applyPanel(); break;
    case 'collect': collect(); break;
    case 'write': S.pendingWrite = arg; collect(); break;
    case 'selCab': if (arg) rb('select_cabinet', arg); break;
    case 'openDir': rb('open_folder', S.lastDir); break;
    case 'saveSettings': rb('save_settings', JSON.stringify({ mats:S.settings.mats, defaults:S.settings.defaults })); toast(t('saved')); render(); break;
  }
});

function build(asNew) {
  var r = compute();
  if (asNew) r = E.buildCabinet(clone(S.cab), S.nextNr - 1, S.project || 'PROJ');
  var geo = { panels:r.panels.map(function (p) { return { name:p.name, role:p.role, short:p.short, L:p.L, W:p.W, T:p.T, mat:p.mat, place:p.place, holes:p.holes, edges:p.edges }; }), legs:r.legs };
  rb('build', JSON.stringify({ uid:(S.edit && !asNew) ? S.edit.uid : null, def:clone(S.cab), geo:geo }));
}
function collect() { rb('collect'); }
function loadCab(info) { S.cab = normalizeCab(info.def); S.edit = { uid:info.uid, nr:info.nr }; S.tab = 'cab'; }

/* ----------------------------------------------------------------- Ruby → JS */
window.DB = {
  init: function (d) {
    S.version = d.version || '';
    var st = d.settings || {};
    if (st.mats) S.settings.mats = Object.assign(S.settings.mats, st.mats);
    if (st.defaults) S.settings.defaults = Object.assign(S.settings.defaults, st.defaults);
    if (st.lang) S.lang = S.settings.lang = st.lang;
    S.cab = preset('baseDr'); render();
  },
  state: function (d) {
    S.sel = d.sel || null;
    if (S.sel) { S.nextNr = S.sel.nextNr || 1; if (!S.projectTouched) S.project = S.sel.project || S.project; }
    var mode = d.mode;
    if (mode === 'edit') { if (S.sel && S.sel.cabinet) loadCab(S.sel.cabinet); else toast(t('needCab'), true); S.tab = 'cab'; }
    else if (mode === 'new') { S.edit = null; S.cab = preset('baseDr'); S.tab = 'cab'; }
    else if (mode === 'panel') S.tab = 'panel';
    else if (mode === 'export') { S.tab = 'export'; collect(); }
    var active = document.activeElement;
    var typing = active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA') && !mode;
    if (!typing) render(); else renderTabs();
  },
  built: function (d) { S.edit = { uid:d.uid, nr:d.nr }; toast(t('built') + ': S' + d.nr); },
  collected: function (d) {
    S.col = d; if (!S.projectTouched && d.project) S.project = d.project;
    rebuildProject();
    if (S.pendingWrite) { var k = S.pendingWrite; S.pendingWrite = null; if (S.pj && S.pj.parts.length) doWrite(k); }
    if (S.tab === 'export') render();
  },
  saved: function (d) { S.lastDir = d.dir || S.lastDir; toast(d.text); if (S.tab === 'export') render(); },
  toast: function (d) { toast(d.text); },
  error: function (d) { toast('⚠ ' + d.where + ': ' + d.message, true); }
};

/* start: ask Ruby for settings and selection; standalone preview without SketchUp */
S.cab = preset('baseDr');
render();
if (window.sketchup) rb('ready');
})();
