/* ============================================================
   core.js — the shared spine of the shop system

   Offer quotes a job, ShopFlow builds it, Invoices bills it. Until now each
   app kept its own idea of the customer: ShopFlow stored a plain string,
   Offer copied a handful of client fields onto every quote, and only
   Invoices had a real record. So the same customer existed three times, in
   three shapes, and nothing tied a quote to the order to the invoice.

   This owns the two things they all need:
     • CUSTOMERS — one record, Invoices' shape (it was the good one)
     • DOCUMENTS — an index of every quote / order / invoice, with the links
       between them, so a job can be followed end to end

   WHERE IT LIVES. All four apps are served from one origin — in production
   app.dedesbaldai.lt/<app>/, and serve.py mounts them the same way
   for development — so they share one localStorage and one Cache API. The
   shared state is therefore a local key that every app can read instantly,
   with Supabase as the copy that travels between devices.

   HOW WRITES MERGE. Several apps can write at once, and the whole shared
   state is one jsonb document, so a blind overwrite would silently lose the
   other app's edit. Every record instead carries `updatedAt` and a `deleted`
   tombstone, and merging is per record: union by id, newest wins. Pushing is
   always pull → merge → put. Nothing is ever clobbered, and a device that
   was offline for a day still merges cleanly when it comes back.
   ============================================================ */
"use strict";

const Core = {
  KEY: "shop.core.v1",        // shared across the origin: every app reads this
  AUTH_KEY: "shop.auth.v1",   // sign in once, in any app, for all of them
  VERSION: 1,

  state: null,
  _saveTimer: null,
  _pushTimer: null,
  _listeners: [],

  /* ---------- lifecycle ---------- */

  boot() {
    this.load();
    // Another app on this origin saved: adopt it. This is what makes adding a
    // customer in Invoices show up in the hub without a round trip.
    window.addEventListener("storage", (e) => {
      if (e.key !== this.KEY || !e.newValue) return;
      try { this.state = this.migrate(JSON.parse(e.newValue)); } catch (_) { return; }
      this.emit("change", { remote: true });
    });
    return this.state;
  },

  blank() {
    return { v: this.VERSION, customers: [], docs: [], seq: {}, updatedAt: 0 };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.state = raw ? this.migrate(JSON.parse(raw)) : this.blank();
    } catch (_) {
      this.state = this.blank();
    }
    return this.state;
  },

  migrate(s) {
    if (!s || typeof s !== "object") return this.blank();
    if (!Array.isArray(s.customers)) s.customers = [];
    if (!Array.isArray(s.docs)) s.docs = [];
    if (!s.seq) s.seq = {};
    s.v = this.VERSION;
    return s;
  },

  save({ push = true } = {}) {
    this.state.updatedAt = Date.now();
    try { localStorage.setItem(this.KEY, JSON.stringify(this.state)); }
    catch (e) { console.warn("[core] save failed:", e && e.message); }
    this.emit("change", { remote: false });
    if (push) this.markDirty();
  },

  on(ev, fn) { this._listeners.push([ev, fn]); },
  emit(ev, arg) { for (const [e, fn] of this._listeners) if (e === ev) { try { fn(arg); } catch (err) { console.warn(err); } } },

  /* ---------- customers ---------- */

  /* Invoices' buyer shape, plus the bookkeeping a shared record needs. */
  blankCustomer() {
    return {
      id: Core.uid("c"), kind: "company",
      name: "", code: "", vat: "", address: "", email: "", phone: "", contact: "",
      term: "", note: "", tags: [],
      createdAt: Date.now(), updatedAt: Date.now(), deleted: false,
    };
  },

  customers() {
    return this.state.customers.filter(c => !c.deleted)
      .sort((a, b) => a.name.localeCompare(b.name, "lt"));
  },
  customer(id) { return this.state.customers.find(c => c.id === id && !c.deleted) || null; },

  upsertCustomer(patch) {
    let c = patch.id ? this.state.customers.find(x => x.id === patch.id) : null;
    if (!c) { c = this.blankCustomer(); if (patch.id) c.id = patch.id; this.state.customers.push(c); }
    Object.assign(c, patch, { updatedAt: Date.now(), deleted: false });
    this.save();
    return c;
  },

  /* A tombstone, not a splice: a plain delete would come back on the next
     merge from a device that still holds the record. */
  deleteCustomer(id) {
    const c = this.state.customers.find(x => x.id === id);
    if (!c) return false;
    c.deleted = true; c.updatedAt = Date.now();
    this.save();
    return true;
  },

  /* Matching is what makes importing three apps' worth of clients possible.
     A company code is proof; a VAT number nearly so; a name only suggests. */
  normName: (s) => Core.deacc(String(s || "").toLowerCase())
    .replace(/\b(uab|mb|ab|ib|vsi|všį|iį|ii|ltd|llc|as|ou|sia)\b/g, "")
    .replace(/[^a-z0-9]+/g, " ").trim(),

  matchCustomer({ name, code, vat } = {}) {
    const live = this.state.customers.filter(c => !c.deleted);
    const digits = (s) => String(s || "").replace(/\D/g, "");
    if (code && digits(code)) {
      const hit = live.find(c => digits(c.code) === digits(code));
      if (hit) return { customer: hit, on: "code" };
    }
    if (vat) {
      const v = String(vat).toUpperCase().replace(/\s/g, "");
      const hit = live.find(c => String(c.vat || "").toUpperCase().replace(/\s/g, "") === v);
      if (hit) return { customer: hit, on: "vat" };
    }
    if (name) {
      const n = this.normName(name);
      if (n.length > 2) {
        const hit = live.find(c => this.normName(c.name) === n);
        if (hit) return { customer: hit, on: "name" };
      }
    }
    return null;
  },

  /* Find or create — the call an importing app actually wants. */
  resolveCustomer(fields) {
    const m = this.matchCustomer(fields);
    if (m) {
      // fill in blanks from the incoming record without overwriting what is held
      const fill = {};
      for (const k of ["code", "vat", "address", "email", "phone", "contact"])
        if (!m.customer[k] && fields[k]) fill[k] = fields[k];
      if (Object.keys(fill).length) this.upsertCustomer({ id: m.customer.id, ...fill });
      return m.customer;
    }
    if (!fields.name) return null;
    return this.upsertCustomer({
      kind: fields.kind || "company",
      name: fields.name, code: fields.code || "", vat: fields.vat || "",
      address: fields.address || "", email: fields.email || "",
      phone: fields.phone || "", contact: fields.contact || "",
    });
  },

  /* ---------- the document index ----------
     Each app keeps its own documents; this is only the spine that says a
     document exists, who it is for, and what it came from. `app` + `ref`
     point back at the record in its own app, so nothing is duplicated. */

  /* An engineering project is not an order — the shop treats designing a
     kitchen and building one as different work, so the index does too. */
  DOC_KINDS: ["quote", "design", "order", "invoice", "waybill"],

  docs({ kind, customerId, app } = {}) {
    return this.state.docs.filter(d => !d.deleted
      && (!kind || d.kind === kind)
      && (!customerId || d.customerId === customerId)
      && (!app || d.app === app))
      .sort((a, b) => (b.date || 0) - (a.date || 0));
  },
  doc(id) { return this.state.docs.find(d => d.id === id && !d.deleted) || null; },
  docByRef(app, ref) { return this.state.docs.find(d => d.app === app && d.ref === String(ref) && !d.deleted) || null; },

  /* Idempotent: an app calls this whenever its document changes, and the
     index updates in place rather than growing a duplicate. */
  linkDoc({ app, ref, kind, num, customerId, title, status, amount, date, fromId }) {
    if (!app || !ref || !kind) return null;
    let d = this.state.docs.find(x => x.app === app && x.ref === String(ref));
    if (!d) {
      d = { id: Core.uid("d"), app, ref: String(ref), createdAt: Date.now() };
      this.state.docs.push(d);
    }
    Object.assign(d, {
      kind, num: num || d.num || "", customerId: customerId ?? d.customerId ?? null,
      title: title ?? d.title ?? "", status: status ?? d.status ?? "",
      amount: amount ?? d.amount ?? null, date: date ?? d.date ?? Date.now(),
      fromId: fromId ?? d.fromId ?? null,
      updatedAt: Date.now(), deleted: false,
    });
    this.save();
    return d;
  },

  unlinkDoc(app, ref) {
    const d = this.state.docs.find(x => x.app === app && x.ref === String(ref));
    if (!d) return false;
    d.deleted = true; d.updatedAt = Date.now();
    this.save();
    return true;
  },

  /* The job, followed end to end: quote → order → invoice. */
  chain(docId) {
    const out = [];
    let d = this.doc(docId);
    while (d && !out.includes(d)) { out.unshift(d); d = d.fromId ? this.doc(d.fromId) : null; }
    const forward = (parent) => {
      for (const k of this.state.docs.filter(x => !x.deleted && x.fromId === parent.id)) {
        out.push(k); forward(k);
      }
    };
    if (out.length) forward(out[out.length - 1]);
    return out;
  },

  /* ---------- merging ----------
     Union by id, newest updatedAt wins, tombstones respected. Order does not
     matter and applying the same remote twice changes nothing, which is what
     lets any app push at any time without coordination. */
  mergeInto(target, incoming) {
    let changed = 0;
    const byId = new Map(target.map(r => [r.id, r]));
    for (const r of incoming || []) {
      if (!r || !r.id) continue;
      const held = byId.get(r.id);
      if (!held) { target.push(r); byId.set(r.id, r); changed++; continue; }
      if ((r.updatedAt || 0) > (held.updatedAt || 0)) { Object.assign(held, r); changed++; }
    }
    return changed;
  },

  merge(remote) {
    if (!remote || typeof remote !== "object") return 0;
    let n = 0;
    n += this.mergeInto(this.state.customers, remote.customers);
    n += this.mergeInto(this.state.docs, remote.docs);
    return n;
  },

  /* ---------- cloud ----------
     The same Supabase project and `workspaces` table the other apps use, under
     its own row id, so this needed no new table and no SQL. */

  cloud: {
    status: "off",     // off | idle | syncing | error | offline
    msg: "",
    cfg: null,

    defaults() {
      const c = window.CLOUD_CONFIG || {};
      return {
        url: c.url || "", key: c.key || c.anonKey || "", email: c.email || c.shopEmail || "",
        workspace: c.coreWorkspace || "northwood-crm", table: c.table || "workspaces",
      };
    },
    preset() { return !!(window.CLOUD_CONFIG && window.CLOUD_CONFIG.url); },

    load() {
      try { this.cfg = JSON.parse(localStorage.getItem(Core.AUTH_KEY) || "null"); } catch (_) { this.cfg = null; }
      if (!this.cfg) this.adopt();
      if (this.cfg) this.status = "idle";
      return this.cfg;
    },

    /* Sign in once, anywhere on this origin. The invoices app keeps its session
       under its own key, against the same Supabase project and the same user,
       so its refresh token is good for the shared row too — there is no reason
       to ask for the shop password a second time. */
    ADOPT_FROM: ["inv_cloud"],
    adopt() {
      const d = this.defaults();
      for (const key of this.ADOPT_FROM) {
        let c = null;
        try { c = JSON.parse(localStorage.getItem(key) || "null"); } catch (_) { continue; }
        if (!c || !c.url || !c.key || !c.refresh) continue;
        this.save({
          url: c.url, key: c.key, email: c.email || d.email,
          workspace: d.workspace,                 // our own row, not theirs
          table: c.table || d.table,
          token: c.token || null, refresh: c.refresh, exp: c.exp || 0,
          adopted: key,
        });
        return true;
      }
      return false;
    },
    save(c) { this.cfg = c; try { localStorage.setItem(Core.AUTH_KEY, JSON.stringify(c)); } catch (_) {} },
    on() { return !!(this.cfg && this.cfg.url && this.cfg.key && this.cfg.refresh); },
    base() { return String(this.cfg.url || "").replace(/\/+$/, ""); },

    async signIn(url, key, email, password, workspace, table) {
      url = String(url || "").replace(/\/+$/, "");
      const r = await fetch(url + "/auth/v1/token?grant_type=password", {
        method: "POST", headers: { apikey: key, "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error_description || j.msg || j.error || ("HTTP " + r.status));
      const d = this.defaults();
      this.save({
        url, key, email, workspace: workspace || d.workspace, table: table || d.table,
        token: j.access_token, refresh: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000,
      });
      this.status = "idle"; this.msg = "";
      return true;
    },

    async token() {
      if (!this.cfg) throw new Error("not signed in");
      if (this.cfg.token && Date.now() < this.cfg.exp - 60000) return this.cfg.token;
      const r = await fetch(this.base() + "/auth/v1/token?grant_type=refresh_token", {
        method: "POST", headers: { apikey: this.cfg.key, "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: this.cfg.refresh }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error_description || j.msg || ("HTTP " + r.status));
      this.cfg.token = j.access_token;
      this.cfg.refresh = j.refresh_token || this.cfg.refresh;
      this.cfg.exp = Date.now() + (j.expires_in || 3600) * 1000;
      this.save(this.cfg);
      return this.cfg.token;
    },

    signOut() {
      this.cfg = null; this.status = "off"; this.msg = "";
      try { localStorage.removeItem(Core.AUTH_KEY); } catch (_) {}
      Core.emit("cloud");
    },

    async rest(path, opts) {
      const tok = await this.token();
      const o = Object.assign({}, opts || {});
      o.headers = Object.assign({
        apikey: this.cfg.key, Authorization: "Bearer " + tok, "Content-Type": "application/json",
      }, o.headers || {});
      const r = await fetch(this.base() + "/rest/v1/" + path, o);
      if (!r.ok) throw new Error("HTTP " + r.status + " " + (await r.text()).slice(0, 180));
      const txt = await r.text();
      return txt ? JSON.parse(txt) : null;
    },

    row() { return this.cfg.table + "?id=eq." + encodeURIComponent(this.cfg.workspace); },

    async fetchRemote() {
      const rows = await this.rest(this.row() + "&select=id,data,updated_at,updated_by");
      return (rows && rows[0]) || null;
    },
  },

  /* Pull, merge, and only then write back — so a push can never drop what
     another app wrote while this one was away. */
  async sync() {
    const c = this.cloud;
    if (!c.on()) return { ok: false, reason: "offline" };
    if (this._syncing) return this._syncing;
    this._syncing = (async () => {
      c.status = "syncing"; this.emit("cloud");
      try {
        const row = await c.fetchRemote();
        const merged = this.merge(row && row.data);
        const now = new Date().toISOString();
        await c.rest(c.cfg.table, {
          method: "POST",
          headers: { Prefer: "resolution=merge-duplicates,return=representation" },
          body: JSON.stringify({
            id: c.cfg.workspace, data: this.state, updated_at: now,
            updated_by: (c.cfg.email || "").split("@")[0] || "device",
          }),
        });
        this._dirty = false;
        c.status = "idle"; c.msg = "";
        if (merged) this.save({ push: false });
        this.emit("cloud");
        return { ok: true, merged };
      } catch (e) {
        c.status = navigator.onLine === false ? "offline" : "error";
        c.msg = (e && e.message) || "sync failed";
        this.emit("cloud");
        return { ok: false, error: c.msg };
      } finally {
        this._syncing = null;
      }
    })();
    return this._syncing;
  },

  markDirty() {
    if (!this.cloud.on()) return;
    this._dirty = true;
    clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => this.sync(), 1800);
  },

  startPolling(ms = 60000) {
    clearInterval(this._poll);
    this._poll = setInterval(() => { if (this.cloud.on()) this.sync(); }, ms);
  },
};

/* ============================================================
   Shared helpers

   These hang off Core rather than standing as top-level functions: this file
   is loaded INTO apps that already declare esc(), Core.uid() and fmtDate() of
   their own, and a duplicate top-level const is a SyntaxError that takes the
   whole app down. Nothing here may claim a bare global.
   ============================================================ */

Core.uid = function (p) { return (p || "") + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-3); };

/* Length-preserving, so a match index into the folded copy still points at
   the same character in the original. The registry search depends on it. */
Core.deacc = function (s) {
  return String(s)
    .replace(/[ąĄ]/g, "a").replace(/[čČ]/g, "c").replace(/[ęėĘĖ]/g, "e")
    .replace(/[įĮ]/g, "i").replace(/[šŠ]/g, "s").replace(/[ųūŲŪ]/g, "u")
    .replace(/[žŽ]/g, "z")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

Core.esc = function (v) {
  return String(v ?? "").replace(/[&<>"']/g, m => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
};

Core.eur = function (n) {
  if (n === null || n === undefined || isNaN(n)) return "—";
  return Number(n).toLocaleString("lt-LT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";
};

Core.fmtDate = function (ts) {
  if (!ts) return "—";
  return new Date(ts).toLocaleDateString("lt-LT", { year: "numeric", month: "short", day: "numeric" });
};

/* ============================================================
   REG — the Lithuanian company registry, offline

   233k registered entities in a 6.4 MB gzip, built by the invoices app's
   tools from Registrų centras + VMI open data. Neither source sends CORS
   headers, which is why it is prebuilt rather than queried live. Served from
   the invoices app's own folder — same origin, so one copy serves everything.
   ============================================================ */
Core.REG = {
  url: "../invoices/data/lt-registry.txt.gz",
  cacheName: "inv-registry-v1",           // the same cache the invoices app fills
  state: "idle",                          // idle | loading | ready | error
  text: "", norm: "", offT: null, offN: null, lines: 0,
  _p: null,

  async cached() {
    if (!("caches" in window)) return null;
    try { const c = await caches.open(this.cacheName); return await c.match(this.url); } catch (_) { return null; }
  },
  /* Only load what is already downloaded, so opening the app never triggers a
     surprise 6 MB fetch on a phone. */
  async loadIfCached() { return (await this.cached()) ? this.load() : false; },

  load(onProgress) {
    if (this.state === "ready") return Promise.resolve(true);
    if (this._p) return this._p;
    this.state = "loading";
    this._p = (async () => {
      try {
        let res = await this.cached();
        if (!res) {
          res = await fetch(this.url);
          if (!res.ok) throw new Error("HTTP " + res.status);
          if ("caches" in window) {
            try { const c = await caches.open(this.cacheName); await c.put(this.url, res.clone()); } catch (_) {}
          }
        }
        const buf = await res.blob();
        onProgress && onProgress(0.9);
        /* Some hosts send Content-Encoding: gzip, in which case the browser has
           already inflated it and inflating again throws — fall back to plain. */
        let text = null;
        if (typeof DecompressionStream === "function") {
          try {
            const ds = new DecompressionStream("gzip");
            text = await new Response(buf.stream().pipeThrough(ds)).text();
          } catch (_) { text = null; }
        }
        if (text == null) text = await buf.text();
        if (!/^\d+\t/.test(text)) throw new Error("registry payload not recognised");
        this.text = text;
        this.norm = Core.deacc(text.toLowerCase());
        this.offT = this._offsets(this.text);
        this.offN = this._offsets(this.norm);
        this.lines = this.offT.length - 1;
        this.state = "ready";
        onProgress && onProgress(1);
        return true;
      } catch (e) {
        console.warn("[reg] load failed", e);
        this.state = "error"; this._p = null;
        return false;
      }
    })();
    return this._p;
  },

  _offsets(s) {
    const out = [0];
    for (let i = s.indexOf("\n"); i >= 0; i = s.indexOf("\n", i + 1)) out.push(i + 1);
    out.push(s.length + 1);
    return Int32Array.from(out);
  },
  _lineAt(off, pos) {
    let lo = 0, hi = off.length - 2;
    while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (off[mid] <= pos) lo = mid; else hi = mid - 1; }
    return lo;
  },
  row(i) {
    const a = this.offT[i], b = this.offT[i + 1] - 1;
    const p = this.text.slice(a, Math.min(b, this.text.length)).split("\t");
    return { code: p[0] || "", name: p[1] || "", address: p[2] || "", vat: p[3] || "", form: p[4] || "", status: p[5] || "" };
  },

  search(q, limit) {
    limit = limit || 20;
    if (this.state !== "ready") return [];
    const nq = Core.deacc(String(q || "").toLowerCase()).trim();
    if (nq.length < 3) return [];
    const isCode = /^\d{5,}$/.test(nq);
    const SCAN = 600;
    const seen = new Set(), hits = [];
    let pos = 0;
    while (hits.length < SCAN) {
      const i = this.norm.indexOf(nq, pos);
      if (i < 0) break;
      pos = i + nq.length;
      const ln = this._lineAt(this.offN, i);
      if (seen.has(ln)) continue;
      seen.add(ln);
      hits.push({ ln, at: i - this.offN[ln] });
    }
    return hits.map(h => {
      const r = this.row(h.ln);
      const nameStart = r.code.length + 1;
      const nameEnd = nameStart + r.name.length;
      let score;
      if (h.at === 0) score = isCode && r.code === nq ? 100 : 70;
      else if (h.at === nameStart) score = 60;
      else if (h.at < nameEnd) score = 40 - Math.min(20, h.at - nameStart) / 2;
      else score = 10;
      if (r.status) score -= 15;                 // struck off or in liquidation
      if (r.vat) score += 4;
      return { ...r, score };
    }).sort((a, b) => b.score - a.score).slice(0, limit);
  },
};
