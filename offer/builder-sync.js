/* =====================================================================
   Dėdės Baldai · Pasiūlymai — SPINTELIŲ KŪRĖJO PROJEKTAS (sinchronizuotas)
   ---------------------------------------------------------------------
   An offer linked to a project of the cabinet builder (/builder/) takes
   its cabinets from there and keeps them up to date: while the builder
   is open in this browser the offer follows within a second or two
   (localStorage 'dbKurejas.offerFeed' + the storage event); on another
   computer from the workspaces row 'builder-offer-<project id>' (checked
   on opening, on returning to the tab and every 30 s).

   The builder publishes quantities only (builder: src/ui/67-offerfeed.js):
   every board by material and m² (a visible side in the front material is
   a front board; backs and the worktop are outside the m² the overheads
   follow), cutting metres, banding metres per edge material (karkaso /
   PAGAL FASADA …), the drawer boxes made besides the parts, the worktop
   and every fitting. Prices are the offer's own: a material by its name
   in Medžiagos (a new name is added there once, at the default price for
   its kind, marked), an edge by its name (unit €/m), a fitting in
   Įkainiai (fasteners are in the "tvirtinimo €/m²" line, as before), then
   the usual ladder. Sizes, parts and fittings are changed in the builder.

   Install: one line after import-module.js:
       <script src="builder-sync.js"></script>
   ===================================================================== */
(function (root) {
  'use strict';
  if (typeof document === 'undefined' || typeof root.calcCabinet !== 'function') return;
  const L2 = (lt, en) => (LANG === 'lt' ? lt : en);
  const esc = s => root.escapeHtml(s);
  const isBld = c => !!(c && c.bld && c.bldId);
  const FEED = 'dbKurejas.offerFeed';
  const CONNECTOR = /konfirmat|confirmat|ekscentrik|minifix|kaišč|kaisc|dowel|varžt|varzt|laikikl|sraig/i;
  const KIND = { facade: ['Fasadas', 'Front'], carc: ['Karkasas', 'Carcass'], drawer: ['Stalčiai', 'Drawers'], back: ['Nugara', 'Back'], top: ['Stalviršis', 'Worktop'] };
  const DEF = { facade: 29, carc: 8, drawer: 8, back: 5, top: 60 };
  const nkey = s => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/\s+/g, ' ').trim();
  const r3 = v => Math.round((+v || 0) * 1000) / 1000;

  /* ------------------------------------------------------------------ prices */
  const findMat = name => { const k = nkey(name); return k ? (S.materials || []).find(m => nkey(m.name) === k) : null; };
  const catOf = kind => kind === 'facade' ? 'FASADAS' : (kind === 'carc' || kind === 'drawer') ? 'KARKASAS' : 'KITA';
  function boardPrice(c, name, kind) {
    const m = findMat(name);
    if (m && m.unit !== 'm') return { p: root.netM2(m), ok: !m.bldNew, m };
    const d = kind === 'facade' ? +c.defFacadePrice : kind === 'back' ? +c.backPrice : kind === 'top' ? DEF.top : +c.carcPrice;
    return { p: isFinite(d) && d > 0 ? d : DEF[kind] || 0, ok: false };
  }
  function edgePrice(name) {
    const m = findMat(name);
    if (m) return { p: m.unit === 'm' ? num(m.price) * (100 - num(m.disc)) / 100 : root.netM2(m), ok: !m.bldNew, m };
    return { p: num(S.rates.edge), ok: !name };
  }
  const hwBase = item => String(item || '').replace(/[,\s]+[LW]{1,2}=\d+.*$/, '').replace(/\s+[LW]=\d+.*$/, '').trim();
  function hwPrice(item) {
    const hw = S.rates.hw || {};
    const fresh = k => (S.rates.hwCustom || []).some(h => h.name === k && h.bldNew);
    if (hw[item] != null && hw[item] !== '') return { key: item, p: num(hw[item]), ok: !fresh(item) };
    const b = hwBase(item);
    if (hw[b] != null && hw[b] !== '') return { key: b, p: num(hw[b]), ok: !fresh(b) };
    if (CONNECTOR.test(item)) return { key: b, p: 0, ok: true, incl: true };
    return { key: b, p: 0, ok: false };
  }
  const hwCat = k => /TANDEM|MERIVO|GUOLIN|STALČ|STALC|CARGO|PASLĖPTO/i.test(k) ? 'drawer' : /LANKST|TIP-ON|VYR/i.test(k) ? 'door' : 'other';

  /* one cabinet from the builder → the same result shape as calcCabinet / calcParts */
  function calcBld(c) {
    const B = c.bld, cut = num(S.rates.cut), W = num(c.W);
    const G = {}; ['facade', 'box', 'part', 'drawer', 'shelf', 'back', 'top'].forEach(k => G[k] = { m2: 0, cut: 0, band: 0, mat: 0, edge: 0 });
    const gOf = kind => kind === 'facade' ? G.facade : kind === 'drawer' ? G.drawer : kind === 'back' ? G.back : kind === 'top' ? G.top : G.box;
    const missing = [];
    let facadeM2 = 0, carcM2 = 0, drawerM2 = 0, mat = 0, edgeCost = 0, cutLen = num(B.cutM), bandLen = 0;
    (B.boards || []).forEach(b => {
      const pr = boardPrice(c, b.mat, b.kind), g = gOf(b.kind), m2 = num(b.m2);
      if (!pr.ok) missing.push(L2('medžiaga „', 'material “') + (b.mat || L2('be pavadinimo', 'no name')) + L2('“ — kaina numatyta', '” — default price'));
      g.m2 += m2; g.mat += m2 * pr.p; mat += m2 * pr.p;
      if (b.basis) { if (b.kind === 'facade') facadeM2 += m2; else if (b.kind === 'drawer') drawerM2 += m2; else carcM2 += m2; }
    });
    // cutting belongs to the board groups in proportion to their area (for the breakdown only — the sum is exact)
    const totM2 = Object.values(G).reduce((s, g) => s + g.m2, 0) || 1;
    Object.values(G).forEach(g => { g.cut = num(B.cutM) * g.m2 / totM2; });
    Object.keys(B.edges || {}).forEach(name => {
      const m = num(B.edges[name]), pr = edgePrice(name); bandLen += m; edgeCost += m * pr.p;
      if (!pr.ok && name) missing.push(L2('briauna „', 'edge “') + name + L2('“ — kaina numatyta', '” — default price'));
    });
    const d = B.drawers || {};
    if (num(d.n) > 0) {
      const pr = boardPrice(c, d.mat, 'carc'), m2 = num(d.m2);
      G.drawer.m2 += m2; G.drawer.mat += m2 * pr.p; mat += m2 * pr.p; drawerM2 += m2;
      G.drawer.cut += num(d.cutM); cutLen += num(d.cutM); bandLen += num(d.bandM); edgeCost += num(d.bandM) * num(S.rates.edge);
    }
    if (B.top) {
      const pr = boardPrice(c, B.top.mat, 'top'), m2 = num(B.top.m2);
      if (!pr.ok) missing.push(L2('stalviršis „', 'worktop “') + (B.top.mat || '—') + L2('“ — kaina numatyta', '” — default price'));
      G.top.m2 += m2; G.top.mat += m2 * pr.p; mat += m2 * pr.p; G.top.cut += num(B.top.cutM); cutLen += num(B.top.cutM);
      if (num(B.top.edgeM) > 0) { const ep = edgePrice(B.top.edge); bandLen += num(B.top.edgeM); edgeCost += num(B.top.edgeM) * ep.p; }
    }
    const hwBreak = {}; let hwCost = 0;
    (B.hw || []).forEach(h => {
      const q = num(h.qty); if (q <= 0) return; const hp = hwPrice(h.item);
      if (!hp.ok) missing.push(L2('furnitūra „', 'fitting “') + hp.key + L2('“ — kaina nenurodyta (Įkainiai)', '” — no price (Rates)'));
      const k = hp.incl ? h.item : hp.key, e = hwBreak[k] = hwBreak[k] || { n: 0, cost: 0, cat: hwCat(k), incl: !!hp.incl, unit: h.unit || '', price: hp.p };
      e.n = r3(e.n + q); e.cost += q * hp.p; hwCost += q * hp.p;
    });
    const net = mat + cutLen * cut, withLam = net + edgeCost;
    return { G, hwCost, hwBreak, secOut: [], cols: 1, colW: [W], colUsed: [], perPart: [], bld: true, missing, edgeCost, cutCost: cutLen * cut, matCost: mat,
      coverM2: 0, facadeM2, carcM2, drawerM2, cutLen, bandLen, net, withLam, withHw: withLam + hwCost, valid: true, over: false };
  }

  /* ------------------------------------------------------------------ app hooks */
  const _calc = root.calcCabinet;
  root.calcCabinet = function (c) { return isBld(c) ? calcBld(c) : _calc.apply(this, arguments); };
  const _sec = root.sectionsHTML;
  root.sectionsHTML = function (i, c, r) { return isBld(c) ? '' : _sec.apply(this, arguments); };
  const _svg = root.cabinetSVG;
  root.cabinetSVG = function (c, r) { return isBld(c) ? bldSVG(c) : _svg.apply(this, arguments); };
  const _desc = root.quoteItemDesc;
  if (_desc) root.quoteItemDesc = function (c) {
    if (!isBld(c)) return _desc.apply(this, arguments);
    const B = c.bld, bits = [];
    if (B.drawerN) bits.push(L2(`stalčiai ${B.drawerN}`, `${B.drawerN} drawers`));
    if (B.doors) bits.push(L2(`durys ${B.doors}`, `${B.doors} doors`));
    return `${c.W}×${c.H}×${c.D}${bits.length ? ' · ' + bits.join(', ') : ''}`;
  };
  const _brk = root.cabBreakdown;
  root.cabBreakdown = function (c, r) {
    if (!isBld(c) || !r || !r.bld) return _brk.apply(this, arguments);
    const row = (l, m, v, cls) => `<div class="br ${cls || ''}"><div class="bl">${l}</div><div class="bm">${m}</div><div class="bv">€ ${eur(v)}</div></div>`;
    let h = '';
    ['facade', 'box', 'drawer', 'back', 'top'].forEach(k => { const g = r.G[k]; if (g.m2 > 0) h += row(L2(...(KIND[k === 'box' ? 'carc' : k])), fx(g.m2, 3) + ' m²', g.mat); });
    h += row(L2('Pjovimas', 'Cutting'), fx(r.cutLen, 1) + ' m', r.cutCost);
    h += row(L2('Briaunos', 'Edging'), fx(r.bandLen, 1) + ' m', r.edgeCost);
    h += row(t('grpHw'), '', r.hwCost);
    h += row(t('oNet'), '', r.net, 'tot') + row(t('oLam'), '', r.withLam) + row(t('oHw'), '', r.withHw, 'grand');
    return h;
  };

  function bldSVG(c) {
    const B = c.bld, W = +c.W || 600, H = +c.H || 720, sc = Math.min(200 / W, 190 / H), w = W * sc, h = H * sc, x = (230 - w) / 2, y = (215 - h) / 2;
    let lines = '';
    if (B.drawerN && !B.doors) for (let k = 1; k < B.drawerN; k++) lines += `<line x1="${x}" x2="${x + w}" y1="${y + h * k / B.drawerN}" y2="${y + h * k / B.drawerN}" stroke="currentColor" stroke-opacity=".5"/>`;
    else if (B.doors > 1) for (let k = 1; k < B.doors; k++) lines += `<line y1="${y}" y2="${y + h}" x1="${x + w * k / B.doors}" x2="${x + w * k / B.doors}" stroke="currentColor" stroke-opacity=".5"/>`;
    return `<svg viewBox="0 0 230 250" width="100%" style="max-height:250px;color:var(--ink)"><rect x="${x}" y="${y}" width="${w}" height="${h}" fill="var(--bench)" stroke="currentColor" stroke-width="1.5"/>${lines}
      <text x="115" y="${y + h + 16}" text-anchor="middle" font-size="11" fill="var(--ink2)" font-family="var(--mono)">${c.W}×${c.H}×${c.D}</text>
      <text x="115" y="${y + h + 31}" text-anchor="middle" font-size="11" fill="var(--ink2)">${(B.parts || []).length} ${L2('detalių', 'parts')} · ${B.drawerN || 0} ${L2('stalč.', 'dr.')} · ${B.doors || 0} ${L2('dur.', 'doors')}</text></svg>`;
  }

  function bldMainHTML(i, c, r) {
    const B = c.bld, types = { 'PASTATOMOS': L2('Pastatoma', 'Base'), 'PAKABINAMOS': L2('Pakabinama', 'Wall'), 'ŪKINĖ': L2('Aukšta', 'Tall') };
    const useF = root.selField(t('fUse'), [['VIRTUVĖ', t('useKitchen')], ['SPINTA', t('useWardrobe')]], c.use, `upCab(${i},'use',this.value)`);
    const mrow = (name, kind, m2) => { const pr = kind === 'edge' ? edgePrice(name) : boardPrice(c, name, kind);
      return `<tr class="${pr.ok ? '' : 'bldnew'}"><td>${esc(name || L2('(be pavadinimo)', '(no name)'))}${pr.ok ? '' : ` <span class="impflag" title="${L2('Kaina dar nepatikrinta — įrašykite ją čia arba Medžiagose', 'Price not checked yet — enter it here or in Materials')}">${L2('nauja', 'new')}</span>`}</td>
        <td>${kind === 'edge' ? L2('Briauna', 'Edge') : L2(...KIND[kind])}</td><td class="num mono">${fx(m2, kind === 'edge' ? 1 : 3)} ${kind === 'edge' ? 'm' : 'm²'}</td>
        <td class="num"><input type="number" step="0.01" value="${fx(pr.p, 2)}" onchange="DBBuilderSync.setPrice('${kind}',${JSON.stringify(String(name || '')).replace(/"/g, '&quot;')},this.value,${i})" style="width:76px"></td>
        <td class="num mono">€ ${eur(m2 * pr.p)}</td></tr>`; };
    let mats = '';
    (B.boards || []).forEach(b => { mats += mrow(b.mat, b.kind, num(b.m2)); });
    if (num((B.drawers || {}).n) > 0) mats += mrow(B.drawers.mat, 'drawer', num(B.drawers.m2)).replace('</td>', ` <span class="muted">(${L2('stalčių dėžės', 'drawer boxes')} ${B.drawers.n})</span></td>`);
    if (B.top) mats += mrow(B.top.mat, 'top', num(B.top.m2));
    Object.keys(B.edges || {}).forEach(e => { mats += mrow(e, 'edge', num(B.edges[e])); });
    if (B.top && B.top.edgeM > 0) mats += mrow(B.top.edge, 'edge', num(B.top.edgeM));
    const parts = (B.parts || []).map(p => `<tr class="${p.vis ? 'bldvis' : ''}"><td>${esc(p.n)}${p.vis ? ` <span class="muted">· ${L2('matoma, fasado medž.', 'visible, front board')}</span>` : ''}</td><td>${esc(p.mat || '')}</td><td class="num mono">${p.L}</td><td class="num mono">${p.W}</td><td class="num mono">${p.T}</td><td class="mono">${esc(p.eb || '')}</td></tr>`).join('');
    const hw = Object.keys(r.hwBreak || {}).map(k => { const e = r.hwBreak[k];
      const nw = !e.incl && !hwPrice(k).ok; return `<tr class="${nw ? 'bldnew' : ''}"><td>${esc(k)}${nw ? ` <span class="impflag">${L2('nauja', 'new')}</span>` : ''}</td><td class="num mono">${e.n} ${esc(e.unit || '')}</td><td class="num">${e.incl ? `<span class="muted" title="${L2('Įskaičiuota į tvirtinimo €/m²', 'In the fasteners €/m²')}">${L2('tvirt. €/m²', 'fast. €/m²')}</span>` : `<input type="number" step="0.01" value="${fx(e.price, 2)}" onchange="DBBuilderSync.setHw(${JSON.stringify(k).replace(/"/g, '&quot;')},this.value)" style="width:70px">`}</td><td class="num mono">€ ${eur(e.cost)}</td></tr>`; }).join('');
    const um = [...new Set(r.missing || [])];
    const miss = um.length ? `<div class="note impwarn" title="${esc(um.join('\n'))}">⚠ ${L2(`${um.length} kain${um.length === 1 ? 'a dar nepatikrinta' : 'os dar nepatikrintos'} — pažymėtos „nauja“ (įrašykite kainą lentelėje; ji išsisaugos Medžiagose / Įkainiuose visiems projektams)`, `${um.length} price${um.length === 1 ? '' : 's'} not checked yet — marked “new” (enter it in the table; it is saved in Materials / Rates for every project)`)}</div>` : '';
    const openP = OPEN.has('bldP_' + c.id) ? 'open' : '', openH = OPEN.has('bldH_' + c.id) ? 'open' : '';
    return `
      <div class="impsrc">🔗 ${L2('Spintelių kūrėjas', 'Cabinet builder')} · SP-${B.no} · <b>${c.W}×${c.H}×${c.D}</b> mm · ${types[c.type] || esc(c.type || '')}${B.legH ? ' · ' + L2('kojelės ', 'legs ') + B.legH : ''}</div>
      <div class="muted" style="font-size:12px;margin:4px 0 8px">${L2('Matmenys, detalės, briaunos ir furnitūra ateina iš Spintelių kūrėjo — keiskite ten, čia atsinaujins. Kainos — šios programos.', 'Sizes, parts, edges and fittings come from the cabinet builder — change them there, this updates. Prices are this app’s.')}</div>
      ${miss}
      <div class="fgrid">${useF}</div>
      <div class="tblwrap" style="margin-top:10px"><table class="imptbl"><thead><tr><th>${L2('Medžiaga / briauna', 'Material / edge')}</th><th>${L2('Kur', 'Where')}</th><th class="num">${L2('Kiekis', 'Qty')}</th><th class="num">€/m² · €/m</th><th class="num">€</th></tr></thead><tbody>${mats}</tbody></table></div>
      <div class="muted mono" style="font-size:11px;margin-top:6px">${L2('pjovimas', 'cutting')} ${fx(r.cutLen, 1)} m · ${L2('briaunos', 'edging')} ${fx(r.bandLen, 1)} m · ${L2('skaičiuojami m²', 'm² counted')} ${fx(r.carcM2 + r.facadeM2 + r.drawerM2, 2)}</div>
      <details class="more" ${openP} ontoggle="tglOpen('bldP_${c.id}',this.open)"><summary>${L2('Detalės', 'Parts')} (${(B.parts || []).length})</summary>
        <div class="tblwrap"><table class="imptbl"><thead><tr><th>${L2('Detalė', 'Part')}</th><th>${L2('Medžiaga', 'Material')}</th><th class="num">L</th><th class="num">W</th><th class="num">T</th><th>${L2('Briaunos', 'Edges')}</th></tr></thead><tbody>${parts}</tbody></table></div></details>
      <details class="more" ${openH} ontoggle="tglOpen('bldH_${c.id}',this.open)"><summary>${L2('Furnitūra', 'Fittings')} (${Object.keys(r.hwBreak || {}).length}) · € ${eur(r.hwCost)}</summary>
        <div class="tblwrap"><table class="imptbl"><thead><tr><th>${L2('Furnitūra', 'Fitting')}</th><th class="num">${L2('Kiekis', 'Qty')}</th><th class="num">€/vnt</th><th class="num">€</th></tr></thead><tbody>${hw}</tbody></table></div></details>`;
  }

  const _render = root.renderCabinets;
  root.renderCabinets = function () {
    _render.apply(this, arguments);
    const list = document.getElementById('cabList'); if (!list) return;
    const cards = list.querySelectorAll(':scope > .card.cab');
    S.cabinets.forEach((c, i) => {
      if (!isBld(c)) return; const card = cards[i]; if (!card) return;
      const r = root.calcCabinet(c), main = card.querySelector('.cabgrid > div:first-child'); if (main) main.innerHTML = bldMainHTML(i, c, r);
      const nm = card.querySelector('.cname'); if (nm) { nm.readOnly = true; nm.title = L2('Pavadinimas — iš Spintelių kūrėjo', 'Name — from the cabinet builder'); }
      const pill = card.querySelector('.head .pill'); if (pill) pill.textContent = 'SP-' + c.bld.no;
    });
    bar();
  };

  /* ------------------------------------------------------------------ price edits (one place: the catalog / the rates) */
  function ensureMat(name, kind, price) {
    let m = findMat(name);
    if (!m) { m = { id: root.uid(), name: name, code: '', supplier: '', cat: kind === 'edge' ? 'KITA' : catOf(kind), unit: kind === 'edge' ? 'm' : 'm2', price: price, sL: 2800, sW: 2070, disc: 0, bldNew: true }; S.materials.push(m); }
    return m;
  }
  const API = {};
  API.setPrice = function (kind, name, v, ci) {
    const p = num(v);
    if (!name) {   // a board without a material name: the cabinet's own default for that kind
      const c = S.cabinets[ci]; if (!c) return;
      if (kind === 'facade') c.defFacadePrice = p; else if (kind === 'back') c.backPrice = p; else if (kind === 'edge') S.rates.edge = p; else c.carcPrice = p;
    } else {
      const m = ensureMat(name, kind, p);
      m.unit = kind === 'edge' ? 'm' : (m.unit === 'm' ? 'm2' : m.unit); m.price = m.unit === 'sheet' ? p * (num(m.sL) * num(m.sW) / 1e6) / ((100 - num(m.disc)) / 100 || 1) : p / ((100 - num(m.disc)) / 100 || 1);
      m.price = Math.round(m.price * 100) / 100; delete m.bldNew;
    }
    if (root.renderMaterials) root.renderMaterials();
    root.renderCabinets(); root.recalc(); root.saveNow();
  };
  API.setHw = function (key, v) {
    S.rates.hw = S.rates.hw || {}; S.rates.hw[key] = num(v);
    (S.rates.hwCustom || []).forEach(h => { if (h.name === key) delete h.bldNew; });
    if (root.renderRates) root.renderRates();
    root.renderCabinets(); root.recalc(); root.saveNow();
  };

  /* ------------------------------------------------------------------ the link */
  function feedsLocal() { try { return JSON.parse(localStorage.getItem(FEED) || '{}') || {}; } catch (e) { return {}; } }
  const W = () => root.WorkshopAuth;
  const signed = () => { const w = W(); return !!(w && w.signedIn && w.signedIn()); };
  function feedCloud(pid) {
    if (!signed()) return Promise.resolve(null);
    return W().rest('workspaces?select=data&id=eq.' + encodeURIComponent('builder-offer-' + pid)).then(rows => (rows && rows[0] && rows[0].data) || null).catch(() => null);
  }
  function listCloud() {
    if (!signed()) return Promise.resolve([]);
    return W().rest('workspaces?select=id,updated_at,name:data->>name,at:data->>at,n:data->cabinets&id=like.builder-offer-*&order=updated_at.desc&limit=80')
      .then(rows => (rows || []).map(x => ({ pid: x.id.replace(/^builder-offer-/, ''), name: x.name || '', at: +x.at || Date.parse(x.updated_at) || 0, n: Array.isArray(x.n) ? x.n.length : 0, cloud: true }))).catch(() => []);
  }
  function apply(feed, quiet) {
    if (!feed || !Array.isArray(feed.cabinets)) return;
    const keep = {}; S.cabinets.forEach(c => { if (c.bldId) keep[c.bldId] = c; });
    const out = feed.cabinets.map(fc => {
      const c = keep[fc.id] || newCabinet();
      Object.assign(c, { bldId: fc.id, bld: fc, name: fc.name, W: fc.W, H: fc.H, D: fc.D, type: fc.type || c.type, dishwasher: false, cols: 1, colW: [], sections: [], hasBack: false });
      delete c.parts;
      if (!keep[fc.id] && fc.type === 'ŪKINĖ' && /spint|drabu/i.test(fc.name || '')) c.use = 'SPINTA';
      return c;
    });
    S.cabinets = out.concat(S.cabinets.filter(c => !c.bldId));
    // names the catalog / the rates do not know yet: added once, at the default price for their kind, marked "nauja"
    const cheap = cat => { const m = root.cheapestNet ? root.cheapestNet(cat) : null; return m ? root.netM2(m) : null; };
    feed.cabinets.forEach(fc => {
      (fc.boards || []).forEach(b => { if (b.mat && !findMat(b.mat)) ensureMat(b.mat, b.kind, cheap(catOf(b.kind)) || DEF[b.kind] || 8); });
      if (fc.top && fc.top.mat && !findMat(fc.top.mat)) ensureMat(fc.top.mat, 'top', DEF.top);
      Object.keys(fc.edges || {}).concat(fc.top && fc.top.edge ? [fc.top.edge] : []).forEach(e => { if (e && !findMat(e)) ensureMat(e, 'edge', num(S.rates.edge) || 1.7); });
      (fc.hw || []).forEach(h => {
        const hp = hwPrice(h.item); if (hp.ok || hp.incl) return;
        S.rates.hwCustom = S.rates.hwCustom || []; S.rates.hw = S.rates.hw || {};
        if (!S.rates.hwCustom.some(x => x.name === hp.key)) S.rates.hwCustom.push({ name: hp.key, cat: hwCat(hp.key), bldNew: true });
        if (S.rates.hw[hp.key] === undefined) S.rates.hw[hp.key] = 0;
      });
    });
    S.bld = { pid: feed.pid, name: feed.name, at: feed.at, sig: feed.sig, updated: feed.updated };
    if (!S.projectName) { S.projectName = feed.name; const pn = document.getElementById('projName'); if (pn) pn.value = feed.name; }
    if (root.renderMaterials) root.renderMaterials();
    if (root.renderRates) root.renderRates();
    root.renderCabinets(); root.recalc(); root.saveNow();
    if (!quiet) root.toast(L2(`Atnaujinta iš Spintelių kūrėjo: ${feed.cabinets.length} spint.`, `Updated from the cabinet builder: ${feed.cabinets.length} cabinets`));
  }
  let busy = false;
  API.sync = function (force) {
    if (!S.bld || !S.bld.pid || busy) return Promise.resolve();
    const pid = S.bld.pid, loc = feedsLocal()[pid] || null;
    busy = true;
    return feedCloud(pid).then(cl => {
      busy = false;
      const f = [loc, cl].filter(Boolean).sort((a, b) => (b.at || 0) - (a.at || 0))[0];
      if (!f || !S.bld || S.bld.pid !== pid) return;
      if (!force && f.sig === S.bld.sig) return;
      apply(f, false);
    }, () => { busy = false; });
  };
  API.link = function (pid) {
    const loc = feedsLocal()[pid] || null;
    return feedCloud(pid).then(cl => {
      const f = [loc, cl].filter(Boolean).sort((a, b) => (b.at || 0) - (a.at || 0))[0];
      if (!f) { root.toast(L2('Šio projekto duomenų nerasta — atidarykite jį Spintelių kūrėjuje.', 'No data for this project — open it in the cabinet builder.')); return; }
      const manual = S.cabinets.filter(c => !c.bldId).length;
      if (manual && !confirm(L2(`Pasiūlyme yra ${manual} spintelės ne iš Spintelių kūrėjo — jos liks. Tęsti?`, `The offer has ${manual} cabinets not from the builder — they stay. Continue?`))) return;
      API.close(); apply(f, false);
    });
  };
  API.unlink = function () {
    if (!S.bld) return;
    if (!confirm(L2('Atsieti nuo Spintelių kūrėjo? Spintelės liks tokios, kokios yra dabar, bet nebeatsinaujins.', 'Unlink from the cabinet builder? The cabinets stay as they are now, but no longer update.'))) return;
    S.bld = null; root.renderCabinets(); root.saveNow();
  };

  /* ------------------------------------------------------------------ UI: the bar over the cabinets, the project picker */
  function ago(at) { if (!at) return ''; const d = new Date(+at); return d.toLocaleString(LANG === 'lt' ? 'lt-LT' : 'en-GB', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }); }
  function bar() {
    const list = document.getElementById('cabList'); if (!list) return;
    let el = document.getElementById('bldBar');
    if (!el) { el = document.createElement('div'); el.id = 'bldBar'; list.parentNode.insertBefore(el, list); }
    if (!S.bld) { el.style.display = 'none'; el.innerHTML = ''; return; }
    el.style.display = '';
    el.className = 'bldbar';
    el.innerHTML = `<span>🔗 ${L2('Susieta su Spintelių kūrėjo projektu', 'Linked to the cabinet builder project')} <b>${esc(S.bld.name || '')}</b> · ${L2('atnaujinta', 'updated')} ${ago(S.bld.at)}</span>
      <span class="hspace"></span>
      <a class="btn sm" href="/builder/" target="_blank" rel="noopener">↗ ${L2('Atidaryti kūrėją', 'Open the builder')}</a>
      <button class="btn sm" onclick="DBBuilderSync.sync(true)">⟳ ${L2('Atnaujinti', 'Update')}</button>
      <button class="btn sm ghost" onclick="DBBuilderSync.unlink()">${L2('Atsieti', 'Unlink')}</button>`;
  }
  function ensureModal() {
    let m = document.getElementById('bldModal'); if (m) return m;
    m = document.createElement('div'); m.id = 'bldModal'; m.className = 'modal';
    m.onclick = e => { if (e.target === m) API.close(); };
    document.body.appendChild(m); return m;
  }
  API.open = function () {
    const m = ensureModal(); m.classList.add('on');
    const loc = feedsLocal(), rows = Object.keys(loc).map(pid => ({ pid, name: loc[pid].name, at: loc[pid].at, n: (loc[pid].cabinets || []).length }));
    const draw = (cl, loading) => {
      const all = {}; rows.concat(cl).forEach(x => { if (!all[x.pid] || (x.at || 0) > (all[x.pid].at || 0)) all[x.pid] = x; });
      const list = Object.values(all).sort((a, b) => (b.at || 0) - (a.at || 0));
      m.innerHTML = `<div class="box" style="max-width:640px"><div class="mh"><h2 style="margin:0;font-size:17px">${L2('Spintelių kūrėjo projektas', 'Cabinet builder project')}</h2><div style="flex:1"></div><button class="icon-btn" onclick="DBBuilderSync.close()">✕</button></div>
        <div class="mb"><p class="muted" style="margin:0 0 10px">${L2('Pasirinkite projektą — jo spintelės, medžiagos, briaunos ir furnitūra ateis čia ir atsinaujins, kai projektas keisis kūrėjuje.', 'Pick a project — its cabinets, materials, edges and fittings come here and update when the project changes in the builder.')}</p>
        ${list.length ? `<div class="bldlist">${list.map(x => `<button class="bldrow${S.bld && S.bld.pid === x.pid ? ' on' : ''}" onclick="DBBuilderSync.link('${esc(x.pid)}')"><b>${esc(x.name || x.pid)}</b><span class="muted">${x.n} ${L2('spint.', 'cab.')} · ${ago(x.at)}</span></button>`).join('')}</div>`
          : `<div class="emptyq">${loading ? L2('Ieškoma…', 'Looking…') : L2('Projektų nerasta. Atidarykite projektą Spintelių kūrėjuje (tame pačiame kompiuteryje arba prisijungę) — jis atsiras čia.', 'No projects found. Open a project in the cabinet builder (on this computer, or signed in) — it appears here.')}</div>`}
        ${loading ? `<p class="muted" style="font-size:12px">${L2('Ieškoma debesyje…', 'Looking in the cloud…')}</p>` : ''}</div></div>`;
    };
    draw([], signed());
    listCloud().then(cl => { if (m.classList.contains('on')) draw(cl, false); });
  };
  API.close = function () { const m = document.getElementById('bldModal'); if (m) m.classList.remove('on'); };

  function addButtons() {
    const head = document.querySelector('#p-cabinets .card > .head');
    if (head && !document.getElementById('bldBtn')) {
      const b = document.createElement('button'); b.className = 'btn sm'; b.id = 'bldBtn'; b.onclick = API.open;
      b.innerHTML = '🔗 ' + L2('Iš Spintelių kūrėjo', 'From the cabinet builder');
      const anchor = head.querySelector('.hspace'); head.insertBefore(b, anchor ? anchor.nextSibling : head.firstChild);
    }
    const eqb = document.querySelector('#cabEmpty .eqb');
    if (eqb && !document.getElementById('bldBtn2')) { const b = document.createElement('button'); b.className = 'btn sm'; b.id = 'bldBtn2'; b.onclick = API.open; b.innerHTML = '🔗 ' + L2('Iš Spintelių kūrėjo', 'From the cabinet builder'); eqb.insertBefore(b, eqb.firstChild); }
  }
  const css = document.createElement('style');
  css.textContent = `.bldbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:9px 12px;margin:0 0 12px;border:1px solid var(--line2);border-radius:10px;background:var(--bench);font-size:13px}
    .bldbar .hspace{flex:1}.bldlist{display:flex;flex-direction:column;gap:6px;max-height:60vh;overflow:auto}
    .bldrow{display:flex;justify-content:space-between;gap:10px;text-align:left;padding:10px 12px;border:1px solid var(--line2);border-radius:8px;background:transparent;color:inherit;font:inherit;cursor:pointer}
    .bldrow:hover,.bldrow.on{border-color:var(--accent,#2f54eb)}tr.bldnew td:first-child{font-weight:600}.imptbl .impflag{font-size:10.5px;font-weight:600;color:#b42318;background:#fef3f2;border:1px solid #fecdca;border-radius:8px;padding:1px 6px;margin-left:4px}tr.bldvis td{color:var(--accent,#2f54eb)}`;
  document.head.appendChild(css);
  const _lang = root.setLang;
  if (typeof _lang === 'function') root.setLang = function () { const r = _lang.apply(this, arguments); ['bldBtn', 'bldBtn2'].forEach(id => { const b = document.getElementById(id); if (b) b.innerHTML = '🔗 ' + L2('Iš Spintelių kūrėjo', 'From the cabinet builder'); }); return r; };

  /* ------------------------------------------------------------------ staying in step */
  window.addEventListener('storage', e => { if (e.key === FEED && S.bld) { const f = feedsLocal()[S.bld.pid]; if (f && f.sig !== S.bld.sig) apply(f, false); } });
  const wake = () => { if (document.visibilityState === 'visible' && S.bld) API.sync(false); };
  document.addEventListener('visibilitychange', wake); window.addEventListener('focus', wake);
  let lastS = null;
  setInterval(() => { if (S !== lastS) { lastS = S; if (S.bld) { API.sync(false); } root.renderCabinets && bar(); } }, 1500);   // an offer opened / switched
  setInterval(() => { if (S.bld && document.visibilityState === 'visible' && signed()) API.sync(false); }, 30000);

  root.DBBuilderSync = API;
  addButtons();
  try { root.renderCabinets(); root.recalc(); } catch (e) { console.error(e); }
})(typeof window !== 'undefined' ? window : globalThis);
