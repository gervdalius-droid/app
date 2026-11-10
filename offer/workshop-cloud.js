/* ============================================================
   Offer (Pasiūlymai) — workshop database + managers-only access

   Loads after the app's own script and replaces its cloud "seams"
   (cloudOn / cloudHeaders / cloudBase / cloudList / cloudSave /
   cloudDelete / renderCloudStatus). Nothing else in the calculator changed.

   • The page opens only for a signed-in MANAGER (or admin). Workers see a
     notice instead; the database refuses them too (0002_managers.sql).
   • Offers are saved in the workshop database (table quote_projects), with
     the same login as Nesting, Builder and ShopFlow — no URL or key to paste.
   • First sign-in in a browser copies that browser's offers into the cloud:
     its locally saved projects, and the offers from the cloud project it was
     connected to before (if any). Nothing is deleted anywhere.
   ============================================================ */
(function () {
  "use strict";
  var W = window.WorkshopAuth;
  if (!W) return;
  var lt = function () { return typeof LANG === "undefined" || LANG === "lt"; };
  var OLD = "dedesBaldai.cloud", MIGRATED = "dedesBaldai.cloudMigrated";
  var who = null;

  /* ---- seams ---- */
  window.cloudOn = function () { return W.signedIn() && !!who; };
  window.cloudCfg = function () { return { url: W.cfg.url, key: W.cfg.key }; };
  window.cloudHeaders = function () { return W.headers(W.tokenNow()); };
  window.cloudBase = function () { return W.cfg.url + "/rest/v1/quote_projects"; };
  var _list = cloudList, _save = cloudSave, _del = cloudDelete;
  window.cloudList = function () { return W.token().then(function () { return _list(); }); };
  window.cloudSave = function (n, d) { return W.token().then(function () { return _save(n, d); }); };
  window.cloudDelete = function (n, ts) { return W.token().then(function () { return _del(n, ts); }); };
  window.saveCloudCfg = window.testCloud = function () { return syncNow(); };
  window.disconnectCloud = function () {
    if (!confirm(lt() ? "Atsijungti? Tada šiame kompiuteryje galės prisijungti kitas žmogus." : "Sign out? Someone else can then sign in on this computer.")) return;
    W.logout(); location.reload();
  };
  window.renderCloudStatus = function () {
    var s = document.getElementById("cloudStatus");
    if (s) s.textContent = who
      ? (lt() ? "Prisijungta: " + who.display_name + " · pasiūlymai saugomi dirbtuvės debesyje" : "Signed in: " + who.display_name + " · offers saved in the workshop cloud")
      : (lt() ? "Neprisijungta" : "Not signed in");
  };

  /* ---- the old URL/key panel becomes a status + sign-out ---- */
  function tidyPanel() {
    ["cloudUrl", "cloudKey"].forEach(function (id) {
      var el = document.getElementById(id); if (el && el.closest("label")) el.closest("label").style.display = "none";
    });
    var bar = document.getElementById("cloudStatus") && document.getElementById("cloudStatus").parentNode.querySelector(".addbar");
    if (bar) bar.innerHTML = '<button class="btn sm" type="button" onclick="testCloud()">' + (lt() ? "Sinchronizuoti" : "Sync now") + "</button>" +
      '<button class="btn sm" type="button" onclick="disconnectCloud()">' + (lt() ? "Atsijungti" : "Sign out") + "</button>";
    var sum = document.querySelector("#cloudStatus") && document.querySelector("#cloudStatus").parentNode.querySelector("summary");
    if (sum) sum.textContent = lt() ? "☁ Debesis — dirbtuvės duomenų bazė" : "☁ Cloud — workshop database";
  }

  function syncNow() {
    return cloudList().then(function (rows) { cloudCache = rows; renderCloudStatus(); if (typeof renderProjects === "function") renderProjects(); })
      .catch(function (e) { if (typeof toast === "function") toast((lt() ? "Debesio klaida: " : "Cloud error: ") + e.message); });
  }

  /* ---- first sign-in in this browser: bring its offers along ---- */
  function migrate() {
    try { if (localStorage.getItem(MIGRATED) === "1") return Promise.resolve(0); } catch (e) {}
    var copied = 0;
    return cloudList().then(function (rows) {
      cloudCache = rows;
      var have = {}; rows.forEach(function (r) { have[r.name] = 1; });
      var todo = [];
      // a) projects saved in this browser
      var local = {}; try { local = JSON.parse(localStorage.getItem("dedesBaldai.projects.v1") || "{}"); } catch (e) {}
      Object.keys(local).forEach(function (n) { if (!have[n] && local[n] && local[n].data) { todo.push([n, local[n].data]); have[n] = 1; } });
      // b) offers in the cloud project this browser used before (URL + key pasted earlier)
      var old = null; try { old = JSON.parse(localStorage.getItem(OLD) || "null"); } catch (e) {}
      var fromOld = (old && old.url && old.key && old.url.indexOf(W.cfg.url) < 0)
        ? fetch(old.url.replace(/\/+$/, "") + "/rest/v1/quote_projects?select=name,data,updated_at&order=updated_at.desc",
                { headers: { apikey: old.key, Authorization: "Bearer " + old.key } })
            .then(function (r) { return r.ok ? r.json() : []; }).catch(function () { return []; })
        : Promise.resolve([]);
      return fromOld.then(function (oldRows) {
        (oldRows || []).forEach(function (r) { if (!have[r.name] && r.data) { todo.push([r.name, r.data]); have[r.name] = 1; } });
        return todo.reduce(function (p, it) {
          return p.then(function () { return _save(it[0], it[1]).then(function () { copied++; }); });
        }, Promise.resolve());
      });
    }).then(function () {
      try { localStorage.setItem(MIGRATED, "1"); } catch (e) {}
      return copied;
    });
  }

  /* ---- start: managers only ---- */
  function start() {
    tidyPanel();
    W.requireArea("offers", { lang: lt() ? "lt" : "en", title: lt() ? "Pasiūlymai" : "Offers" })
      .then(function (me) {
        who = me; renderCloudStatus();
        return W.token().then(migrate).then(function (n) {
          if (n && typeof toast === "function") toast(lt() ? "Į debesį perkelta pasiūlymų: " + n : "Offers moved to the cloud: " + n);
          return syncNow();
        });
      });
  }
  W.onChange(function (s) { if (!s && who) location.reload(); });   // signed out in another app → lock this one too
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();
