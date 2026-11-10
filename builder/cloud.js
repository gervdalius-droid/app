/* ============================================================
   Spintelių kūrėjas — cloud save (workshop database)

   The app stays local-first: everything still saves instantly in this
   browser. When someone is signed in (workshop-auth.js — the same login as
   Nesting and ShopFlow), this also keeps three things in the cloud so they
   are on every computer and survive a cleared browser:
     • projects          → table builder_projects (one row each, deletes as tombstones)
     • cabinet library   → workspaces row 'builder-cablib'
     • settings / rules  → workspaces row 'builder-settings'
   Merging: per project, newest `updated` wins; library and settings, newest
   save wins. The open project is never replaced under the user's hands.

   The app calls window.__dbkOnStore(key) after every localStorage write and
   exposes what this file needs on window.__dbk — so any write to those keys
   schedules a push, without the app knowing anything about the cloud.
   ============================================================ */
(function () {
  "use strict";
  var W = window.WorkshopAuth, D = window.__dbk;
  if (!W || !D || !D.store) return;
  var S = D.S, lib = D.lib, libRec = D.libRec, render = D.render, toast = D.toast,
      defSettings = D.defSettings, applyRules = D.applyRules;
  var LIB = "dbKurejas.lib", CL = "dbKurejas.cablib", SET = "dbKurejas.settings", META = "dbKurejas.cloud";
  var DOC_CL = "builder-cablib", DOC_SET = "builder-settings";
  var lt = function () { return !S || S.lang !== "en"; };
  var _store = D.store, applying = false, timer = null, busy = false, again = false;
  var state = "off";                       // off | sync | ok | err
  var meta = _store(META) || {};
  meta.pushed = meta.pushed || {};         // project id → `updated` last pushed / pulled
  meta.clAt = meta.clAt || 0; meta.setAt = meta.setAt || 0;
  function saveMeta() { try { localStorage.setItem(META, JSON.stringify(meta)); } catch (e) {} }
  function ms(x) { var v = Date.parse(x || ""); return isNaN(v) ? 0 : v; }
  function nowIso() { return new Date().toISOString(); }

  /* ---- hook: local writes schedule a push ---- */
  window.__dbkOnStore = function (k) {
    if (applying || (k !== LIB && k !== CL && k !== SET)) return;
    if (k === CL) meta.clAt = Date.now();
    else if (k === SET) meta.setAt = Date.now();
    if (k !== LIB) saveMeta();
    schedule(1500);
  };
  function schedule(delay) { clearTimeout(timer); timer = setTimeout(sync, delay || 0); }

  /* ---- status chip ---- */
  var chip = document.createElement("button");
  chip.type = "button";
  chip.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:900;border:1px solid rgba(0,0,0,.15);border-radius:999px;padding:5px 11px;font:12px system-ui,sans-serif;background:#fff;color:#2b302c;box-shadow:0 2px 8px rgba(0,0,0,.12);cursor:pointer";
  chip.onclick = function () {
    if (!W.signedIn()) return signIn();
    if (confirm(lt() ? "Atsijungti nuo debesies? Projektai liks šioje naršyklėje." : "Sign out of the cloud? Projects stay in this browser.")) { W.logout(); paint(); }
  };
  function paint() {
    var on = W.signedIn();
    var L = lt() ? { off: "☁ Prisijungti — saugoti debesyje", sync: "☁ Sinchronizuojama…", ok: "☁ Išsaugota debesyje", err: "☁ Nepavyko sinchronizuoti" }
                 : { off: "☁ Sign in — save to cloud", sync: "☁ Syncing…", ok: "☁ Saved in the cloud", err: "☁ Sync failed" };
    var st = on ? state : "off";
    chip.textContent = L[st] || L.off;
    chip.style.color = st === "err" ? "#a33" : st === "ok" ? "#2c6b3c" : "#2b302c";
    if (!chip.parentNode && document.body) document.body.appendChild(chip);
  }
  function set(st) { state = st; paint(); }

  /* ---- sync: pull, merge, push ---- */
  function sync() {
    if (!W.signedIn()) { set("off"); return Promise.resolve(); }
    if (busy) { again = true; return Promise.resolve(); }
    busy = true; set("sync");
    return pullProjects().then(pushProjects).then(syncDoc.bind(null, DOC_CL)).then(syncDoc.bind(null, DOC_SET))
      .then(function () { set("ok"); }, function (e) {
        console.warn("[cloud]", e && e.message || e);
        if (e && e.status === 401) { set("off"); return; }
        set("err");
      })
      .then(function () { busy = false; if (again) { again = false; schedule(500); } });
  }

  function pullProjects() {
    return W.rest("builder_projects?select=id,name,n,updated_at,deleted").then(function (rows) {
      var local = lib(), byId = {}, need = [], changed = false;
      local.forEach(function (r) { byId[r.id] = r; });
      (rows || []).forEach(function (row) {
        var l = byId[row.id], rAt = ms(row.updated_at);
        if (row.deleted) {
          if (l && ms(l.updated) <= rAt && !(S.proj && S.proj.id === row.id)) { delete byId[row.id]; changed = true; }
          delete meta.pushed[row.id];
          return;
        }
        if (!l && meta.pushed[row.id]) return;           // deleted in this browser → the push sends the tombstone
        if (!l || ms(l.updated) < rAt) need.push(row.id);
        else if (ms(l.updated) === rAt) meta.pushed[row.id] = l.updated;
      });
      if (!need.length) return changed ? apply(byId, local) : null;
      // fetch full data only for the projects that are newer in the cloud
      var chunks = [];
      for (var i = 0; i < need.length; i += 25) chunks.push(need.slice(i, i + 25));
      return chunks.reduce(function (p, ids) {
        return p.then(function () {
          return W.rest("builder_projects?select=id,name,n,data,updated_at&id=in.(" + ids.map(encodeURIComponent).join(",") + ")")
            .then(function (full) {
              (full || []).forEach(function (row) {
                if (!row.data || (S.proj && S.proj.id === row.id && !S.home)) return;   // leave the open project alone
                var d = row.data; d.id = row.id; d.updated = row.updated_at;
                byId[row.id] = libRec(d); meta.pushed[row.id] = byId[row.id].updated; changed = true;
              });
            });
        });
      }, Promise.resolve()).then(function () { if (changed) apply(byId, local); });
    });
  }
  function apply(byId, local) {
    var order = local.map(function (r) { return r.id; });
    Object.keys(byId).forEach(function (id) { if (order.indexOf(id) < 0) order.push(id); });
    var merged = order.filter(function (id) { return byId[id]; }).map(function (id) { return byId[id]; });
    merged.sort(function (a, b) { return ms(b.updated) - ms(a.updated); });
    applying = true; try { _store(LIB, merged); } finally { applying = false; }
    saveMeta();
    if (S.home) render();
  }

  function pushProjects() {
    var local = lib(), seen = {}, rows = [];
    local.forEach(function (r) {
      seen[r.id] = 1;
      if (meta.pushed[r.id] === r.updated) return;
      rows.push({ id: r.id, name: r.name || "", n: r.n || 0, data: r.data, deleted: false, updated_at: r.updated || nowIso() });
    });
    Object.keys(meta.pushed).forEach(function (id) {   // gone from this browser since the last sync → deleted here
      if (!seen[id]) rows.push({ id: id, name: "", n: 0, data: null, deleted: true, updated_at: nowIso() });
    });
    if (!rows.length) return Promise.resolve();
    var batches = [];
    for (var i = 0; i < rows.length; i += 10) batches.push(rows.slice(i, i + 10));
    return batches.reduce(function (p, b) {
      return p.then(function () {
        return W.rest("builder_projects?on_conflict=id", {
          method: "POST", body: JSON.stringify(b), headers: { Prefer: "resolution=merge-duplicates,return=minimal" }
        }).then(function () {
          b.forEach(function (r) { if (r.deleted) delete meta.pushed[r.id]; else meta.pushed[r.id] = r.updated_at; });
          saveMeta();
        });
      });
    }, Promise.resolve());
  }

  // library / settings: one document each, newest save wins
  function syncDoc(id) {
    var key = id === DOC_CL ? CL : SET, atKey = id === DOC_CL ? "clAt" : "setAt";
    return W.rest("workspaces?select=data&id=eq." + id).then(function (rows) {
      var remote = rows && rows[0] && rows[0].data, rAt = remote ? +remote.at || 0 : 0;
      var localV = _store(key), lAt = meta[atKey] || 0;
      if (remote && rAt > lAt) {                         // cloud is newer → take it
        applying = true;
        try {
          if (id === DOC_SET) { S.settings = Object.assign(defSettings(), remote.v || {}); _store(SET, S.settings); applyRules(); }
          else _store(CL, remote.v);
        } finally { applying = false; }
        meta[atKey] = rAt; saveMeta();
        render();
        return;
      }
      if (localV && (!remote || lAt > rAt)) {             // this browser is newer → push
        var at = lAt || Date.now();
        return W.rest("workspaces?on_conflict=id", {
          method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
          body: JSON.stringify({ id: id, data: { at: at, v: localV }, updated_by: "builder" })
        }).then(function () { meta[atKey] = at; saveMeta(); });
      }
    });
  }

  /* ---- sign-in ---- */
  function signIn() {
    return W.gate({ lang: lt() ? "lt" : "en", allowSkip: true,
                    title: lt() ? "Projektai bus saugomi debesyje ir matomi kituose kompiuteriuose." : "Projects will be saved to the cloud and visible on other computers." })
      .then(function (me) { paint(); if (me) { toast(lt() ? "Prisijungta: " + me.display_name : "Signed in: " + me.display_name); return sync(); } });
  }

  /* ---- start ---- */
  W.onChange(function () { paint(); });
  function start() {
    paint();
    if (W.signedIn()) sync();
    else {
      var asked = false; try { asked = sessionStorage.getItem("dbKurejas.cloudAsked") === "1"; sessionStorage.setItem("dbKurejas.cloudAsked", "1"); } catch (e) {}
      if (!asked) signIn();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
  setInterval(function () { if (W.signedIn() && !document.hidden) sync(); }, 60000);
  window.addEventListener("focus", function () { if (W.signedIn()) schedule(300); });
  window.addEventListener("online", function () { if (W.signedIn()) schedule(300); });
  window.BuilderCloud = { sync: sync, signIn: signIn };
})();
