/* ============================================================
   hub.js — one shell over the shop's four apps

   The modules keep their own bundles and their own state; they collide on
   half a dozen global names (S, D, L, I, LANG, TABS), so merging them into
   one page was never the cheap option. They do share an origin, though, and
   that is enough: one localStorage, one Cache API, and iframes that can see
   each other. The hub supplies what none of them had — the customer, the
   document index that links a quote to its order to its invoice, and a
   dashboard that reads across all three.
   ============================================================ */
"use strict";

const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => [...(r || document).querySelectorAll(s)];

/* core.js keeps its helpers on Core, because it is also loaded into apps that
   already declare esc()/uid()/fmtDate() of their own. The hub has no such
   clash, so it aliases them for readability. */
const esc = Core.esc, eur = Core.eur, fmtDate = Core.fmtDate, deacc = Core.deacc;
const REG = Core.REG;

/* Where each module lives. Paths are relative so the same build works on
   localhost (serve.py mounts them here) and on GitHub Pages, where the repo
   name decides the folder — hence the override. */
const PATHS = Object.assign({
  offer: "../offer/",
  shopflow: "../shopflow-app/",   // the repo is shopflow-app; the folder follows it
  invoices: "../invoices/",
}, window.HUB_PATHS || {});

/* ---------- language: the same key Offer and Invoices already use ---------- */
const LT = {
  "Overview": "Apžvalga", "Customers": "Klientai", "Quotes": "Pasiūlymai",
  "Production": "Gamyba", "Invoices": "Sąskaitos",
  "One system": "Viena sistema",
  "Search customers…": "Ieškoti klientų…",
  "New customer": "Naujas klientas", "Edit customer": "Redaguoti klientą",
  "Name": "Pavadinimas", "Company code": "Įmonės kodas", "VAT number": "PVM kodas",
  "Address": "Adresas", "Email": "El. paštas", "Phone": "Telefonas",
  "Contact person": "Kontaktinis asmuo", "Payment term (days)": "Apmokėjimo terminas (d.)",
  "Notes": "Pastabos", "Save": "Išsaugoti", "Cancel": "Atšaukti", "Close": "Uždaryti",
  "Delete": "Ištrinti", "Company": "Įmonė", "Person": "Fizinis asmuo",
  "Look up in the company registry": "Ieškoti Registrų centre",
  "Type a company name or code…": "Įveskite pavadinimą arba kodą…",
  "Loading the registry…": "Kraunamas registras…",
  "Documents": "Dokumentai", "No documents yet": "Dokumentų dar nėra",
  "Quote": "Pasiūlymas", "Design": "Projektas", "Order": "Užsakymas", "Invoice": "Sąskaita", "Waybill": "Važtaraštis",
  "Pipeline": "Darbų eiga", "Recent": "Paskutiniai",
  "Needs attention": "Reikia dėmesio",
  "Import from the apps": "Importuoti iš programų",
  "Connect": "Prisijungti", "Sign out": "Atsijungti", "Sync now": "Sinchronizuoti",
  "Working offline": "Dirbama vietoje", "Synced": "Sinchronizuota", "Syncing…": "Sinchronizuojama…",
  "Sync error": "Sinchronizavimo klaida",
  "Shop password": "Parduotuvės slaptažodis",
  "customers": "klientų", "documents": "dokumentų",
  "No customers yet": "Klientų dar nėra",
  "Nothing to import": "Nėra ką importuoti",
  "Total invoiced": "Išrašyta", "Unpaid": "Neapmokėta", "In production": "Gamyboje",
  "Open quotes": "Atviri pasiūlymai",
};
let LANG = (() => { try { return localStorage.getItem("fab_lang") || "lt"; } catch (_) { return "lt"; } })();
const t = (s) => (LANG === "lt" && LT[s]) || s;

const ICONS = {
  dash: '<path d="M3 3h7.5v9H3zM13.5 3H21v5.5h-7.5zM13.5 12H21v9h-7.5zM3 15.5h7.5V21H3z"/>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.6"/><path d="M22 21v-2a4 4 0 0 0-3-3.85"/>',
  quote: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 13h8M8 17h5"/>',
  factory: '<path d="M2 20h20"/><path d="M4 20V9l6 4V9l6 4V6l4 2v12"/>',
  invoice: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h4"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.5-4.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  cloud: '<path d="M7 18a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.5 1.6A3.75 3.75 0 0 1 17.5 18Z"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
  down: '<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 21h16"/>',
  alert: '<path d="M10.3 3.8 1.9 18a2 2 0 0 0 1.7 3h16.8a2 2 0 0 0 1.7-3L13.7 3.8a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
};
const icon = (n, size = 16, sw = 1.8) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[n] || ""}</svg>`;

/* ============================================================
   Hub
   ============================================================ */
const Hub = {
  view: "dash",
  crmSearch: "",
  _framesLoaded: {},

  MODULES: [
    { id: "dash", label: "Overview", ico: "dash" },
    { id: "crm", label: "Customers", ico: "users" },
    { id: "offer", label: "Quotes", ico: "quote", src: PATHS.offer },
    { id: "shopflow", label: "Production", ico: "factory", src: PATHS.shopflow },
    { id: "invoices", label: "Invoices", ico: "invoice", src: PATHS.invoices },
  ],

  boot() {
    Core.boot();
    Core.cloud.load();
    this.applyTheme(localStorage.getItem("hub.theme") || "auto");
    Core.on("change", () => { if (this.view === "dash" || this.view === "crm") this.paint(); });
    Core.on("cloud", () => this.paintSync());
    this.view = (location.hash || "#dash").slice(1).split("/")[0] || "dash";
    if (!this.MODULES.some(m => m.id === this.view)) this.view = "dash";
    this.render();
    window.addEventListener("hashchange", () => {
      const v = (location.hash || "#dash").slice(1).split("/")[0];
      if (this.MODULES.some(m => m.id === v) && v !== this.view) { this.view = v; this.show(); }
    });
    if (Core.cloud.on()) { Core.sync(); Core.startPolling(); }
    REG.loadIfCached();
  },

  applyTheme(mode) {
    localStorage.setItem("hub.theme", mode);
    const root = document.documentElement;
    if (mode === "auto") root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", mode);
  },

  /* ---------- shell ---------- */
  render() {
    $("#app").innerHTML = `
      <div class="shell">
        <div class="topbar">
          <div class="brand"><span class="mark">🪑</span><span>Northwood Furniture</span></div>
          <div class="modtabs" id="modtabs">
            ${this.MODULES.map(m => `<button data-mod="${m.id}" class="${m.id === this.view ? "active" : ""}">${t(m.label)}</button>`).join("")}
          </div>
          <div class="grow"></div>
          <button class="sync-chip" id="sync-chip"></button>
          <button class="icon-btn" id="theme-btn" title="Tema">${icon("moon", 16)}</button>
        </div>
        <div class="main" id="main">
          <div class="pane pad" id="pane-dash"></div>
          <div class="pane pad" id="pane-crm" hidden></div>
          ${this.MODULES.filter(m => m.src).map(m =>
            `<div class="pane" id="pane-${m.id}" hidden></div>`).join("")}
        </div>
      </div>`;

    $$("#modtabs button").forEach(b => b.onclick = () => this.go(b.dataset.mod));
    $("#theme-btn").onclick = () => {
      const cur = localStorage.getItem("hub.theme") || "auto";
      this.applyTheme(cur === "dark" ? "light" : cur === "light" ? "auto" : "dark");
    };
    $("#sync-chip").onclick = () => this.connectModal();
    this.show();
    this.paintSync();
  },

  go(view) {
    if (this.view === view) return;
    this.view = view;
    location.hash = "#" + view;
    this.show();
  },

  /* Panes are hidden, never destroyed: a module keeps its scroll position and
     whatever the user had half-typed when they step away and come back. */
  show() {
    $$("#modtabs button").forEach(b => b.classList.toggle("active", b.dataset.mod === this.view));
    for (const m of this.MODULES) {
      const pane = $("#pane-" + m.id);
      if (!pane) continue;
      pane.hidden = m.id !== this.view;
      if (m.id === this.view && m.src && !this._framesLoaded[m.id]) {
        this._framesLoaded[m.id] = true;
        pane.innerHTML = `<iframe src="${m.src}" title="${esc(t(m.label))}"></iframe>`;
      }
    }
    this.paint();
  },

  paint() {
    if (this.view === "dash") this.paintDash();
    if (this.view === "crm") this.paintCrm();
  },

  paintSync() {
    const el = $("#sync-chip");
    if (!el) return;
    const c = Core.cloud;
    const label = !c.on() ? t("Working offline")
      : c.status === "syncing" ? t("Syncing…")
      : c.status === "error" || c.status === "offline" ? t("Sync error")
      : t("Synced");
    el.className = "sync-chip " + (c.on() ? c.status : "");
    el.innerHTML = `<span class="dot"></span><span>${esc(label)}</span>`;
    el.title = c.msg || label;
  },

  /* ============================================================
     Overview — the one screen that reads across all three apps
     ============================================================ */
  paintDash() {
    const quotes = Core.docs({ kind: "quote" });
    const orders = Core.docs({ kind: "order" });
    const invoices = Core.docs({ kind: "invoice" });
    const sum = (list) => list.reduce((n, d) => n + (Number(d.amount) || 0), 0);
    const openQuotes = quotes.filter(d => !["won", "lost", "done"].includes(d.status));
    const liveOrders = orders.filter(d => d.status !== "done" && d.status !== "cancelled");
    const unpaid = invoices.filter(d => d.status && d.status !== "paid" && d.status !== "draft");

    const recent = [...Core.docs()].slice(0, 12);
    const total = Core.customers().length;

    $("#pane-dash").innerHTML = `
      <div class="view-title">${t("Overview")}</div>
      <div class="view-sub">${total} ${t("customers")} · ${Core.docs().length} ${t("documents")}</div>

      <div class="kpis">
        <div class="kpi"><span class="val">${openQuotes.length}</span><span class="lbl">${t("Open quotes")}</span>
          <span class="sub">${eur(sum(openQuotes))}</span></div>
        <div class="kpi"><span class="val">${liveOrders.length}</span><span class="lbl">${t("In production")}</span>
          <span class="sub">${orders.length} ${LANG === "lt" ? "iš viso" : "in total"}</span></div>
        <div class="kpi"><span class="val">${eur(sum(invoices)).replace(" €", "")}</span><span class="lbl">${t("Total invoiced")}</span>
          <span class="sub">${invoices.length} ${LANG === "lt" ? "sąskaitų" : "invoices"}</span></div>
        <div class="kpi ${unpaid.length ? "warn" : "ok"}"><span class="val">${eur(sum(unpaid)).replace(" €", "")}</span>
          <span class="lbl">${t("Unpaid")}</span><span class="sub">${unpaid.length} ${LANG === "lt" ? "sąskaitų" : "invoices"}</span></div>
      </div>

      <div class="panel">
        <header><h2>${icon("dash", 15)} ${t("Pipeline")}</h2></header>
        <div class="pipe">
          ${this.pipeStep("quote", t("Quote"), quotes, "var(--purple)")}
          ${this.pipeStep("order", t("Order"), orders, "var(--blue)")}
          ${this.pipeStep("invoice", t("Invoice"), invoices, "var(--green)")}
        </div>
      </div>

      <div class="cols2">
        <div class="panel">
          <header><h2>${t("Recent")}</h2></header>
          ${recent.length ? `<div class="table-wrap"><table class="rows">
            <tbody>${recent.map(d => this.docRow(d)).join("")}</tbody>
          </table></div>` : this.empty("quote", t("No documents yet"),
            LANG === "lt" ? "Importuokite iš esamų programų, kad pamatytumėte visą eigą."
                          : "Import from the apps to see the whole pipeline here.")}
        </div>
        <div class="panel">
          <header><h2>${icon("alert", 15)} ${t("Needs attention")}</h2></header>
          ${unpaid.length ? `<div class="table-wrap"><table class="rows"><tbody>
            ${unpaid.slice(0, 8).map(d => this.docRow(d, true)).join("")}
          </tbody></table></div>` : `<div class="empty" style="padding:26px"><span class="big">✓</span>
            ${LANG === "lt" ? "Neapmokėtų sąskaitų nėra" : "Nothing unpaid"}</div>`}
        </div>
      </div>

      <div class="toolbar" style="margin-top:4px">
        <button class="btn" id="import-btn">${icon("down", 13)} ${t("Import from the apps")}</button>
      </div>`;

    $("#import-btn").onclick = () => this.importModal();
    $$("#pane-dash tr[data-open]").forEach(tr => tr.onclick = () => this.openDoc(tr.dataset.open));
  },

  pipeStep(kind, label, list, color) {
    /* ShopFlow does not carry money, so an order has no amount. Summing that
       to "0,00 €" would read as work worth nothing — say how many instead. */
    const priced = list.filter(d => d.amount != null);
    const total = priced.reduce((n, d) => n + Number(d.amount), 0);
    const max = Math.max(1, Core.docs().length);
    const sub = priced.length ? eur(total)
      : list.length ? (LANG === "lt" ? "suma nesekama" : "no amounts tracked") : "";
    return `<div class="pipe-step">
      <div class="n">${list.length}</div>
      <div class="k">${esc(label)}</div>
      <div class="m">${esc(sub)}</div>
      <div class="bar" style="background:${color};width:${Math.max(8, list.length / max * 100)}%"></div>
    </div>`;
  },

  docRow(d, showDue) {
    const c = d.customerId ? Core.customer(d.customerId) : null;
    return `<tr data-open="${d.id}">
      <td style="width:1%"><span class="pill ${d.kind}">${esc(t(d.kind[0].toUpperCase() + d.kind.slice(1)))}</span></td>
      <td><span class="cell-main"><b>${esc(d.num || d.title || "—")}</b>
        <span>${esc(c ? c.name : (d.title || ""))}</span></span></td>
      <td class="num right">${d.amount != null ? eur(d.amount) : ""}</td>
      <td class="num right" style="color:var(--text-3)">${fmtDate(d.date)}</td>
    </tr>`;
  },

  /* Jump to the module that owns a document. */
  openDoc(id) {
    const d = Core.doc(id);
    if (!d) return;
    if (d.app === "invoices") this.go("invoices");
    else if (d.app === "shopflow") this.go("shopflow");
    else if (d.app === "offer") this.go("offer");
  },

  empty(ico, title, body) {
    return `<div class="empty"><span class="big">${icon(ico, 34)}</span><h3>${esc(title)}</h3><p>${esc(body || "")}</p></div>`;
  },

  /* ============================================================
     Customers — the record the three apps never shared
     ============================================================ */
  paintCrm() {
    const q = this.crmSearch.trim().toLowerCase();
    let list = Core.customers();
    if (q) {
      const nq = deacc(q);
      list = list.filter(c => deacc((c.name + " " + c.code + " " + c.vat + " " + (c.contact || "")).toLowerCase()).includes(nq));
    }

    $("#pane-crm").innerHTML = `
      <div class="view-title">${t("Customers")}</div>
      <div class="view-sub">${Core.customers().length} ${t("customers")}</div>
      <div class="toolbar">
        <div class="search-box" style="max-width:340px">${icon("search", 14)}
          <input id="crm-q" placeholder="${esc(t("Search customers…"))}" value="${esc(this.crmSearch)}"></div>
        <div class="grow"></div>
        <button class="btn primary" id="crm-add">${icon("plus", 13)} ${t("New customer")}</button>
      </div>
      <div class="panel">
        ${list.length ? `<div class="table-wrap"><table class="rows">
          <thead><tr>
            <th>${t("Name")}</th><th>${t("Company code")}</th><th>${t("VAT number")}</th>
            <th>${t("Contact person")}</th><th class="right">${t("Documents")}</th>
          </tr></thead>
          <tbody>${list.map(c => {
            const docs = Core.docs({ customerId: c.id });
            return `<tr data-open="${c.id}">
              <td><span class="cell-main"><b>${esc(c.name)}</b>
                <span>${esc(c.address || c.email || "")}</span></span></td>
              <td class="num">${esc(c.code || "—")}</td>
              <td class="num">${esc(c.vat || "—")}</td>
              <td>${esc(c.contact || c.phone || "—")}</td>
              <td class="right">${docs.length ? `<span class="tag">${docs.length}</span>` : ""}</td>
            </tr>`;
          }).join("")}</tbody>
        </table></div>` : this.empty("users", t("No customers yet"),
          LANG === "lt" ? "Pridėkite klientą arba importuokite iš esamų programų."
                        : "Add one, or import what the apps already hold.")}
      </div>`;

    const inp = $("#crm-q");
    inp.oninput = () => {
      this.crmSearch = inp.value;
      const pos = inp.selectionStart;
      this.paintCrm();
      const again = $("#crm-q");
      if (again) { again.focus(); again.setSelectionRange(pos, pos); }
    };
    $("#crm-add").onclick = () => this.customerModal();
    $$("#pane-crm tr[data-open]").forEach(tr => tr.onclick = () => this.customerModal(tr.dataset.open));
  },

  customerModal(id) {
    const c = id ? Core.customer(id) : null;
    const docs = c ? Core.docs({ customerId: c.id }) : [];
    const f = (k) => esc(c ? (c[k] ?? "") : "");

    Modal.open(`
      <header><h2>${c ? esc(c.name) || t("Edit customer") : t("New customer")}</h2>
        <button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="form-row">
          <div class="field" style="flex:1 1 100%">
            <label>${t("Look up in the company registry")}</label>
            <input class="input" id="reg-q" placeholder="${esc(t("Type a company name or code…"))}" autocomplete="off">
          </div>
        </div>
        <div id="reg-out" style="margin:-4px 0 10px"></div>

        <div class="form-row">
          <div class="field" style="flex:2 1 260px"><label>${t("Name")}</label>
            <input class="input" id="c-name" value="${f("name")}"></div>
          <div class="field" style="flex:0 1 150px"><label>&nbsp;</label>
            <select class="select" id="c-kind">
              <option value="company" ${!c || c.kind !== "person" ? "selected" : ""}>${t("Company")}</option>
              <option value="person" ${c && c.kind === "person" ? "selected" : ""}>${t("Person")}</option>
            </select></div>
        </div>
        <div class="form-row">
          <div class="field"><label>${t("Company code")}</label><input class="input" id="c-code" value="${f("code")}"></div>
          <div class="field"><label>${t("VAT number")}</label><input class="input" id="c-vat" value="${f("vat")}"></div>
        </div>
        <div class="form-row">
          <div class="field" style="flex:1 1 100%"><label>${t("Address")}</label>
            <input class="input" id="c-address" value="${f("address")}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>${t("Email")}</label><input class="input" id="c-email" type="email" value="${f("email")}"></div>
          <div class="field"><label>${t("Phone")}</label><input class="input" id="c-phone" value="${f("phone")}"></div>
        </div>
        <div class="form-row">
          <div class="field"><label>${t("Contact person")}</label><input class="input" id="c-contact" value="${f("contact")}"></div>
          <div class="field" style="flex:0 1 170px"><label>${t("Payment term (days)")}</label>
            <input class="input" id="c-term" type="number" min="0" value="${f("term")}"></div>
        </div>
        <div class="form-row">
          <div class="field" style="flex:1 1 100%"><label>${t("Notes")}</label>
            <textarea class="input" id="c-note" rows="2">${f("note")}</textarea></div>
        </div>

        ${c ? `<div style="margin-top:6px">
          <label style="font-size:12px;font-weight:600;color:var(--text-2)">${t("Documents")}</label>
          ${docs.length ? `<div class="table-wrap" style="margin-top:6px;border:1px solid var(--border);border-radius:var(--r-sm)">
            <table class="rows"><tbody>${docs.map(d => this.docRow(d)).join("")}</tbody></table></div>`
            : `<div style="font-size:12.5px;color:var(--text-3);margin-top:4px">${t("No documents yet")}</div>`}
        </div>` : ""}
      </div>
      <footer>
        ${c ? `<button class="btn danger" id="c-del">${t("Delete")}</button>` : ""}
        <div class="grow"></div>
        <button class="btn ghost" data-close>${t("Cancel")}</button>
        <button class="btn primary" id="c-save">${t("Save")}</button>
      </footer>`, (modal) => {
      this.bindRegistry(modal);
      $("#c-save", modal).onclick = () => {
        const name = $("#c-name", modal).value.trim();
        if (!name) { $("#c-name", modal).focus(); return; }
        Core.upsertCustomer({
          id: c ? c.id : undefined,
          kind: $("#c-kind", modal).value,
          name, code: $("#c-code", modal).value.trim(), vat: $("#c-vat", modal).value.trim(),
          address: $("#c-address", modal).value.trim(), email: $("#c-email", modal).value.trim(),
          phone: $("#c-phone", modal).value.trim(), contact: $("#c-contact", modal).value.trim(),
          term: $("#c-term", modal).value.trim(), note: $("#c-note", modal).value.trim(),
        });
        Modal.close(); this.paintCrm();
        Toast.show(LANG === "lt" ? "Klientas išsaugotas" : "Customer saved");
      };
      const del = $("#c-del", modal);
      if (del) del.onclick = () => {
        const n = Core.docs({ customerId: c.id }).length;
        const msg = n ? (LANG === "lt"
          ? `Ištrinti ${c.name}? ${n} dokument(ai) liks, bet be kliento.`
          : `Delete ${c.name}? ${n} document(s) stay, but lose their customer.`)
          : (LANG === "lt" ? `Ištrinti ${c.name}?` : `Delete ${c.name}?`);
        if (!confirm(msg)) return;
        Core.deleteCustomer(c.id);
        Modal.close(); this.paintCrm();
      };
      $$("tr[data-open]", modal).forEach(tr => tr.onclick = () => { Modal.close(); this.openDoc(tr.dataset.open); });
    });
  },

  /* The registry is 6.4 MB, so it is fetched on first use rather than on boot,
     and cached afterwards — the invoices app fills the same cache. */
  bindRegistry(modal) {
    const q = $("#reg-q", modal), out = $("#reg-out", modal);
    let timer = null;
    const render = () => {
      const v = q.value.trim();
      if (v.length < 3) { out.innerHTML = ""; return; }
      if (REG.state === "error") { out.innerHTML = `<div class="tag">${esc(LANG === "lt" ? "Registro nepavyko įkelti" : "Registry unavailable")}</div>`; return; }
      if (REG.state !== "ready") {
        out.innerHTML = `<div class="tag">${esc(t("Loading the registry…"))}</div>`;
        REG.load().then(ok => { if (ok) render(); else out.innerHTML = ""; });
        return;
      }
      const hits = REG.search(v, 8);
      out.innerHTML = hits.length ? `<div class="reg-results">${hits.map((r, i) => `
        <button class="reg-row" data-reg="${i}">
          <b>${esc(r.name)}</b>
          <span>${esc(r.code)}${r.vat ? ` · <span class="vat">${esc(r.vat)}</span>` : ""}${r.address ? " · " + esc(r.address) : ""}</span>
        </button>`).join("")}</div>` : "";
      $$("[data-reg]", out).forEach(b => b.onclick = () => {
        const r = hits[+b.dataset.reg];
        $("#c-name", modal).value = r.name;
        $("#c-code", modal).value = r.code;
        $("#c-vat", modal).value = r.vat || "";
        if (r.address) $("#c-address", modal).value = r.address;
        out.innerHTML = ""; q.value = "";
        $("#c-name", modal).focus();
      });
    };
    q.oninput = () => { clearTimeout(timer); timer = setTimeout(render, 180); };
  },

  /* ============================================================
     Import — read what the apps already hold, on this same origin
     ============================================================ */
  /* `read` is injectable so tests never have to write to localStorage: the hub
     shares an origin with the real apps, and a test fixture written there
     would be the shop's actual invoice book. */
  scanApps(read) {
    read = read || ((k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch (_) { return null; } });
    const found = { customers: [], docs: [] };

    /* Invoices: real customer records and every issued document. */
    const inv = read("inv_state_v1");
    if (inv) {
      for (const c of inv.customers || []) {
        found.customers.push({ src: "invoices", srcId: c.id, kind: c.kind || "company",
          name: c.name, code: c.code, vat: c.vat, address: c.address,
          email: c.email, phone: c.phone, contact: c.contact, term: c.term, note: c.note });
      }
      const lineNet = (l) => Math.round((Number(l.qty) || 0) * (Number(l.price) || 0) * (1 - (Number(l.disc) || 0) / 100) * 100) / 100;
      const totalOf = (d) => {
        let net = 0, vat = 0;
        for (const l of d.lines || []) { const n = lineNet(l); net += n; vat += n * (Number(l.vat) || 0) / 100; }
        return Math.round((net + vat) * 100) / 100;
      };
      const paidOf = (d) => (d.payments || []).reduce((s, p) => s + (Number(p.amount) || 0), 0);
      for (const d of inv.invoices || []) {
        const total = totalOf(d);
        const paid = paidOf(d);
        found.docs.push({
          app: "invoices", ref: d.id, kind: "invoice", num: d.no,
          title: (d.buyer && d.buyer.name) || "", srcCustomer: d.customerId,
          buyer: d.buyer || null,
          status: d.status === "draft" ? "draft" : paid >= total - 0.005 ? "paid" : "unpaid",
          amount: total, date: d.date ? Date.parse(d.date + "T12:00:00") : Date.now(),
        });
      }
      for (const w of inv.waybills || []) {
        found.docs.push({ app: "invoices", ref: w.id, kind: "waybill", num: w.no || "",
          title: (w.receiver && w.receiver.name) || "", status: w.status || "",
          amount: null, date: w.date ? Date.parse(w.date + "T12:00:00") : Date.now() });
      }
    }

    /* Offer: the client lives on each saved quote, not in a list of its own. */
    const projects = read("northwoodFurniture.projects.v1");
    if (projects) {
      for (const [name, p] of Object.entries(projects)) {
        const cl = (p && p.data && p.data.client) || {};
        if (cl.name) {
          found.customers.push({ src: "offer", srcId: null, kind: "company",
            name: cl.name, code: "", vat: cl.vat, address: cl.address,
            email: cl.email, phone: cl.phone, contact: cl.contact });
        }
        const q = (p && p.data && p.data.quote) || {};
        const amount = Number(q.total ?? q.grand ?? q.sum);
        found.docs.push({ app: "offer", ref: name, kind: "quote", num: name,
          title: name, clientName: cl.name || "", status: "open",
          amount: isNaN(amount) ? null : amount, date: (p && p.savedAt) || Date.now() });
      }
    }

    /* ShopFlow: the client is only ever a name on the order.
       Its document moved to IndexedDB — too big for the 5 MB every app on this
       domain shares — so it leaves a small index behind for exactly this. The
       old key is still read for a tablet that has not updated yet. */
    const sf = read("shopflow.index") || read("shopflow.v1");
    if (sf) {
      for (const o of sf.orders || []) {
        if (o.client) found.customers.push({ src: "shopflow", srcId: null, kind: "company", name: o.client });
        found.docs.push({ app: "shopflow", ref: o.id, kind: "order", num: o.num,
          title: o.product || "", clientName: o.client || "",
          status: o.shipped ? "done" : o.archived ? "done" : "active",
          amount: null, date: o.createdAt || Date.now() });
      }
    }
    return found;
  },

  importModal() {
    const found = this.scanApps();
    // how many of the scanned customers are genuinely new
    const seen = new Set();
    let fresh = 0;
    for (const c of found.customers) {
      const key = Core.normName(c.name) + "|" + String(c.code || "").replace(/\D/g, "");
      if (seen.has(key)) continue;
      seen.add(key);
      if (!Core.matchCustomer(c)) fresh++;
    }
    const newDocs = found.docs.filter(d => !Core.docByRef(d.app, d.ref)).length;
    const per = (app) => found.docs.filter(d => d.app === app).length;

    Modal.open(`
      <header><h2>${t("Import from the apps")}</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <p style="font-size:13.5px;color:var(--text-2);margin-bottom:14px">
          ${LANG === "lt"
            ? "Nuskaitomos šioje naršyklėje esančios programos. Klientai sujungiami pagal įmonės kodą, PVM kodą arba pavadinimą — pakartotinis importas nieko nedubliuoja."
            : "Reads the apps as they are on this device. Customers are matched on company code, VAT number or name, so importing twice changes nothing."}
        </p>
        <div class="kpis" style="margin-bottom:8px">
          <div class="kpi"><span class="val">${found.customers.length}</span><span class="lbl">${t("Customers")}</span>
            <span class="sub">${fresh} ${LANG === "lt" ? "naujų" : "new"}</span></div>
          <div class="kpi"><span class="val">${found.docs.length}</span><span class="lbl">${t("Documents")}</span>
            <span class="sub">${newDocs} ${LANG === "lt" ? "naujų" : "new"}</span></div>
        </div>
        <div style="font-size:12.5px;color:var(--text-3)">
          ${t("Quotes")}: ${per("offer")} · ${t("Production")}: ${per("shopflow")} · ${t("Invoices")}: ${per("invoices")}
        </div>
      </div>
      <footer>
        <div class="grow"></div>
        <button class="btn ghost" data-close>${t("Cancel")}</button>
        <button class="btn primary" id="imp-run" ${found.customers.length || found.docs.length ? "" : "disabled"}>
          ${found.customers.length || found.docs.length ? t("Import from the apps") : t("Nothing to import")}</button>
      </footer>`, (modal) => {
      $("#imp-run", modal).onclick = () => {
        const res = this.runImport(found);
        Modal.close();
        this.paint();
        Toast.show(LANG === "lt"
          ? `Importuota: ${res.customers} klientų, ${res.docs} dokumentų`
          : `Imported ${res.customers} customers and ${res.docs} documents`);
      };
    });
  },

  runImport(found) {
    let customers = 0, docs = 0;
    const bySrc = new Map();     // invoices' own customer id → shared record

    for (const c of found.customers) {
      if (!c.name) continue;
      const before = Core.matchCustomer(c);
      const rec = Core.resolveCustomer(c);
      if (!rec) continue;
      if (!before) customers++;
      if (c.src === "invoices" && c.srcId) bySrc.set(c.srcId, rec.id);
    }

    for (const d of found.docs) {
      let customerId = null;
      if (d.srcCustomer && bySrc.has(d.srcCustomer)) customerId = bySrc.get(d.srcCustomer);
      if (!customerId && d.buyer) {
        const rec = Core.resolveCustomer({
          name: d.buyer.name, code: d.buyer.code, vat: d.buyer.vat,
          address: d.buyer.address, email: d.buyer.email, phone: d.buyer.phone,
        });
        if (rec) customerId = rec.id;
      }
      if (!customerId && d.clientName) {
        const m = Core.matchCustomer({ name: d.clientName });
        if (m) customerId = m.customer.id;
      }
      if (!Core.docByRef(d.app, d.ref)) docs++;
      Core.linkDoc({
        app: d.app, ref: d.ref, kind: d.kind, num: d.num, customerId,
        title: d.title, status: d.status, amount: d.amount, date: d.date,
      });
    }
    return { customers, docs };
  },

  /* ============================================================
     Connect — one sign-in for the shared store
     ============================================================ */
  connectModal() {
    const c = Core.cloud;
    const d = c.defaults();
    const on = c.on();

    Modal.open(`
      <header><h2>${icon("cloud", 17)} ${on ? t("Synced") : t("Connect")}</h2>
        <button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        ${on ? `<p style="font-size:13.5px;color:var(--text-2)">
            ${esc(c.cfg.email)} · <span class="tag">${esc(c.cfg.workspace)}</span></p>
          ${c.msg ? `<p style="font-size:13px;color:var(--orange);margin-top:8px">${esc(c.msg)}</p>` : ""}
          <p style="font-size:12.5px;color:var(--text-3);margin-top:12px">
            ${LANG === "lt"
              ? "Klientai ir dokumentų sąsajos keliauja tarp įrenginių. Kiekvienas įrašas turi savo laiką, todėl dvi programos gali rašyti vienu metu ir niekas nedingsta."
              : "Customers and document links travel between devices. Every record carries its own timestamp, so two apps can write at once and nothing is lost."}</p>`
        : `<p style="font-size:13.5px;color:var(--text-2);margin-bottom:14px">
            ${LANG === "lt"
              ? "Viskas veikia ir be prisijungimo — duomenys lieka šioje naršyklėje. Prisijunkite, kad jie pasiektų kitus įrenginius."
              : "Everything works signed out; the data stays in this browser. Sign in to carry it to other devices."}</p>
          <div class="form-row">
            <div class="field"><label>${t("Email")}</label>
              <input class="input" id="cl-email" value="${esc(d.email)}" ${d.email ? "readonly" : ""}></div>
            <div class="field"><label>${t("Shop password")}</label>
              <input class="input" id="cl-pass" type="password" autocomplete="current-password"></div>
          </div>
          ${d.url ? "" : `<div class="form-row">
            <div class="field"><label>Supabase URL</label><input class="input" id="cl-url" value=""></div>
            <div class="field"><label>anon key</label><input class="input" id="cl-key" value=""></div></div>`}
          <div id="cl-err" style="font-size:13px;color:var(--red)"></div>`}
      </div>
      <footer>
        ${on ? `<button class="btn danger" id="cl-out">${t("Sign out")}</button>` : ""}
        <div class="grow"></div>
        <button class="btn ghost" data-close>${t("Close")}</button>
        ${on ? `<button class="btn primary" id="cl-sync">${t("Sync now")}</button>`
             : `<button class="btn primary" id="cl-in">${t("Connect")}</button>`}
      </footer>`, (modal) => {
      const inBtn = $("#cl-in", modal);
      if (inBtn) inBtn.onclick = async () => {
        const err = $("#cl-err", modal);
        const url = $("#cl-url", modal) ? $("#cl-url", modal).value.trim() : d.url;
        const key = $("#cl-key", modal) ? $("#cl-key", modal).value.trim() : d.key;
        const email = $("#cl-email", modal).value.trim();
        const pass = $("#cl-pass", modal).value;
        if (!url || !key || !email || !pass) { err.textContent = LANG === "lt" ? "Užpildykite laukus" : "Fill in the fields"; return; }
        inBtn.disabled = true; err.textContent = "";
        try {
          await Core.cloud.signIn(url, key, email, pass, d.workspace, d.table);
          await Core.sync();
          Core.startPolling();
          Modal.close(); this.paintSync(); this.paint();
          Toast.show(t("Synced"));
        } catch (e) {
          err.textContent = (e && e.message) || "error";
          inBtn.disabled = false;
        }
      };
      const sync = $("#cl-sync", modal);
      if (sync) sync.onclick = async () => {
        sync.disabled = true;
        const r = await Core.sync();
        sync.disabled = false;
        Toast.show(r.ok ? t("Synced") : (Core.cloud.msg || t("Sync error")));
        this.paint();
      };
      const out = $("#cl-out", modal);
      if (out) out.onclick = () => { Core.cloud.signOut(); Modal.close(); this.paintSync(); };
    });
  },
};

/* ============================================================
   Modal + Toast
   ============================================================ */
const Modal = {
  open(html, bind) {
    const root = $("#modal-root");
    root.innerHTML = `<div class="modal-scrim"><div class="modal">${html}</div></div>`;
    /* The backdrop does not close the dialog: a customer being edited is work
       in progress, and a stray click beside it used to discard the lot. Every
       modal has a visible Cancel, and Escape still works. */
    $$("[data-close]", root).forEach(b => b.onclick = () => this.close());
    if (bind) bind($(".modal", root));
    const first = $(".modal input:not([readonly]), .modal select", root);
    if (first) setTimeout(() => first.focus(), 60);
  },
  close() { $("#modal-root").innerHTML = ""; },
  isOpen() { return !!$(".modal-scrim"); },
};

const Toast = {
  show(msg, ms = 3200) {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    $("#toast-root").appendChild(el);
    setTimeout(() => { el.classList.add("leaving"); setTimeout(() => el.remove(), 300); }, ms);
  },
};

document.addEventListener("keydown", (e) => { if (e.key === "Escape" && Modal.isOpen()) Modal.close(); });
