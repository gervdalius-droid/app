/* =====================================================================
   Offer app ← cabinet creator 3D: every cabinet card shows the builder's
   assembled 3D picture (DBAssembly on DBEngine parts); click it for the
   live viewer (orbit, zoom, Be fasadų / Priekis / 3D / Apačia, Išplėsti).
   ===================================================================== */
(function () {
  'use strict';
  if (typeof window === 'undefined' || typeof window.cabinetSVG !== 'function' || !window.DBAssembly || !window.DBOfferBuild) return;
  const A = window.DBOfferBuild, ASM = window.DBAssembly;
  const L2 = (lt, en) => (LANG === 'lt' ? lt : en);

  /* ---- styles: the builder's viewer CSS, scoped colours */
  const st = document.createElement('style');
  st.textContent = __AV_CSS__ + `
    .dbav{--panel:#ffffff;--sunk:#f5f6f3;--ink:#1b211e;--muted:#5f6a64;--line:#d6dbd5;--line2:#c3cac3;--accent:#315c50;--accent-ink:#fff;--accent-soft:#e8f0ec;--ok:#1f7a4a;--f-mono:"IBM Plex Mono",ui-monospace,Consolas,monospace;color:var(--ink)}
    .dbav [data-connectors],.dbav [data-boards]{display:none!important}
    .dbav button{font:inherit}
    #dbavOff{position:fixed;left:-20000px;top:0;width:420px;pointer-events:none;opacity:0}
    #dbavOff .av-stage{height:360px!important}
    .preview:has(.dbav-thumb){padding:0;background:none;border:0;min-height:0}
    .dbav-thumb{position:relative;width:100%;aspect-ratio:420/360;border-radius:10px;overflow:hidden;cursor:zoom-in;border:1px solid var(--line);background:radial-gradient(ellipse at 48% 30%,#fff,#eef0ee 85%)}
    .dbav-thumb img{width:100%;height:100%;object-fit:contain;display:block;transition:opacity .2s}
    .dbav-thumb.dbav-pending img{opacity:.5}
    .dbav-thumb .dbav-wait{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#7a857f;font-size:12px}
    .dbav-thumb .dbav-btn{position:absolute;right:8px;bottom:8px;font-size:11px;font-weight:600;background:#315c50;color:#fff;border-radius:7px;padding:3px 9px;opacity:.9}
    .dbav-thumb:hover .dbav-btn{opacity:1}
    .dbav-thumb.dbav-err{cursor:default}
    #dbavModal{position:fixed;inset:0;z-index:70;background:rgba(17,20,27,.55);display:flex;align-items:center;justify-content:center;padding:16px}
    #dbavModal .dbav-box{width:min(1040px,100%);max-height:calc(100vh - 32px);overflow:auto;border-radius:16px}
    #dbavModal .dbav-top{display:flex;align-items:center;gap:10px;background:#fff;border-radius:14px 14px 0 0;padding:10px 14px;border:1px solid var(--line);border-bottom:0}
    #dbavModal .dbav-top b{flex:1;font-size:15px}
    #dbavModal .dbav-top button{border:1px solid var(--line);background:#fff;border-radius:8px;padding:5px 10px;cursor:pointer}
    #dbavModal .av{border-radius:0 0 14px 14px}`;
  document.head.appendChild(st);

  /* ---- material names (for the builder's colours: balta, antracitas, ąžuolas …) */
  function matName(id, cat) {
    if (!id) return '';
    if (id === '__cheap__') { const m = window.cheapestNet ? window.cheapestNet(cat) : null; return m ? m.name : ''; }
    const m = (S.materials || []).find(x => x.id === id); return m ? m.name : '';
  }
  const facadeMatOf = c => c.defFacadeMat || ((c.sections || []).find(s => s.facadeMat) || {}).facadeMat || '';
  const prep = c => Object.assign({}, c, { defFacadeMat: facadeMatOf(c) });

  /* ---- thumbnails (cached by the cabinet's builder definition) */
  const cache = new Map(), last = new Map();
  let timer = 0, busy = false, modalOpen = false;
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  const sigOf = c => hash(JSON.stringify(A.toBuilder(prep(c), matName), (k, v) => (k === 'id' || k === 'name') ? undefined : v) + '|' + LANG);
  const DEF_VIEW = { px: 0, py: 0, yaw: .52, pitch: .32, zoom: 1, open: .65, mode: 'assembly', hardware: true, handles: false, dimensions: true, edit: false, full: false, boards: false };

  const _svg = window.cabinetSVG;
  window.cabinetSVG = function (c, r) {
    let sg; try { sg = sigOf(c); } catch (e) { return _svg.apply(this, arguments); }
    const url = cache.get(sg) || last.get(c.id);
    schedule();
    return `<div class="dbav-thumb${cache.has(sg) ? '' : ' dbav-pending'}" data-cab="${c.id}" data-sig="${sg}" onclick="DBRender.open('${c.id}')" title="${L2('Atidaryti 3D peržiūrą', 'Open 3D view')}">` +
      (url ? `<img src="${url}" alt="">` : `<div class="dbav-wait">${L2('Kuriamas 3D vaizdas…', 'Rendering 3D…')}</div>`) + `<span class="dbav-btn">⤢ 3D</span></div>`;
  };
  function schedule() { clearTimeout(timer); timer = setTimeout(pump, 120); }
  function fill(sg) {
    document.querySelectorAll(`.dbav-thumb[data-sig="${sg}"]`).forEach(e => {
      e.classList.remove('dbav-pending');
      let img = e.querySelector('img'); if (!img) { const w = e.querySelector('.dbav-wait'); if (w) w.remove(); img = document.createElement('img'); img.alt = ''; e.insertBefore(img, e.firstChild); }
      img.src = cache.get(sg);
    });
  }
  function renderThumb(c) {
    const { def, r } = A.build(prep(c), matName);
    let host = document.getElementById('dbavOff');
    if (!host) { host = document.createElement('div'); host.id = 'dbavOff'; host.className = 'dbav'; host.setAttribute('aria-hidden', 'true'); document.body.appendChild(host); }
    host.innerHTML = '<div></div>';
    const V = ASM.state, keep = V ? Object.assign({}, V) : null;
    if (V) Object.assign(V, DEF_VIEW);
    try { ASM.mount(host.firstChild, def, r, LANG, { toast: () => {} }); }
    finally { if (V) Object.assign(V, keep); }
    const cv = host.querySelector('canvas'); if (!cv || !cv.width) throw new Error('no canvas');
    const out = document.createElement('canvas'); out.width = 630; out.height = 540;           // 1.5× the 420×360 stage: sharp, small
    out.getContext('2d').drawImage(cv, 0, 0, out.width, out.height);
    host.innerHTML = '';
    return out.toDataURL('image/png');
  }
  function pump() {
    if (busy || modalOpen) return;
    const el = [...document.querySelectorAll('.dbav-thumb.dbav-pending')].find(e => e.isConnected); if (!el) return;
    const id = el.dataset.cab, sg = el.dataset.sig;
    if (cache.has(sg)) { fill(sg); setTimeout(pump, 0); return; }
    const c = (S.cabinets || []).find(x => x.id === id);
    if (!c) { el.classList.remove('dbav-pending'); setTimeout(pump, 0); return; }
    busy = true;
    try { const url = renderThumb(c); cache.set(sg, url); last.set(id, url); fill(sg); }
    catch (e) { console.warn('3D', e); el.classList.remove('dbav-pending'); el.classList.add('dbav-err'); if (!el.querySelector('img')) { const w = el.querySelector('.dbav-wait'); if (w) w.textContent = L2('3D vaizdo sukurti nepavyko', '3D view failed'); } }
    busy = false; setTimeout(pump, 0);
  }

  /* ---- live viewer */
  function close() { const m = document.getElementById('dbavModal'); if (m) m.remove(); modalOpen = false; document.removeEventListener('keydown', onKey, true); schedule(); }
  function onKey(e) { if (e.key === 'Escape' && !document.querySelector('#dbavModal .av.full')) { e.stopPropagation(); close(); } }
  function open(id) {
    const c = (S.cabinets || []).find(x => x.id === id); if (!c) return;
    let built; try { built = A.build(prep(c), matName); } catch (e) { console.error(e); toast(L2('3D vaizdo sukurti nepavyko', '3D view failed')); return; }
    close();
    const m = document.createElement('div'); m.id = 'dbavModal';
    m.innerHTML = `<div class="dbav-box dbav"><div class="dbav-top"><b>${escapeHtml(c.name || L2('Spintelė', 'Cabinet'))}</b><button type="button" data-close>✕ ${L2('Uždaryti', 'Close')}</button></div><div class="dbav-host"></div></div>`;
    m.addEventListener('click', e => { if (e.target === m || e.target.closest('[data-close]')) close(); });
    document.body.appendChild(m); modalOpen = true;
    document.addEventListener('keydown', onKey, true);
    ASM.mount(m.querySelector('.dbav-host'), built.def, built.r, LANG, { toast: msg => toast(msg) });
  }

  window.DBRender = { open, close, refresh: () => { cache.clear(); last.clear(); renderCabinets(); } };
  const _lang = window.setLang;
  if (typeof _lang === 'function') window.setLang = function () { const r = _lang.apply(this, arguments); schedule(); return r; };
  try { renderCabinets(); } catch (e) { console.error(e); }
})();
