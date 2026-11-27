/* Dienos planas — the page. Reads ShopFlow & friends, runs engine.js, shows the outcome,
   takes the manager's comments and runs it again. Saved state lives in workspaces row "dedes-planas"
   (office only): adjustments, comment log, confirmed plans, settings. */
(function () {
  "use strict";
  var W = window.WorkshopAuth, P = window.Planas, ME = null;
  var DOC_ID = "dedes-planas", SF = "dedes-baldai";
  var S = { M: null, plan: null, R: null, A: null, doc: { adj: [], log: [], plans: {}, cfg: {} }, day0: null, revDay: null, pinned: false,
            ai: null, reply: null, loaded: null, raw: null, busy: false };
  var COLORS = ["#2f55c8", "#127c52", "#c27c00", "#7a4ab8", "#c4321c", "#0f7c8c", "#8a5a2b", "#55606a"];

  /* ---------------- words ---------------- */
  var LANG = "both"; try { LANG = localStorage.getItem("planas.lang") || "both"; } catch (e) {}
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function T(lt, en) { return '<span class="il"><span class="lt">' + lt + '</span><span class="en">' + en + '</span></span>'; }
  function B(lt, en) { return '<span class="bl"><span class="lt">' + lt + '</span><span class="en">' + en + '</span></span>'; }
  function num(x, lang) { var s = (Math.round(x * 10) / 10).toFixed(Math.abs(x) < 10 && x % 1 ? 1 : (x % 1 ? 1 : 0)); return lang === "en" ? s : s.replace(".", ","); }
  function H(h) { return T(num(h, "lt") + " h", num(h, "en") + " h"); }
  function pl(n, one, few, many) { var a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 9 && (b < 11 || b > 19) ? few : many; }
  var WD = { lt: ["sekmadienis", "pirmadienis", "antradienis", "trečiadienis", "ketvirtadienis", "penktadienis", "šeštadienis"], en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] };
  var WDA = ["sekmadienį", "pirmadienį", "antradienį", "trečiadienį", "ketvirtadienį", "penktadienį", "šeštadienį"];
  function md(day) { return day ? day.slice(5) : ""; }
  function dName(day, lang) { var d = P.toDate(day).getDay(); return lang === "en" ? WD.en[d] + " " + md(day) : WD.lt[d] + " " + md(day); }
  function dWhen(day, lang) {   /* "rytoj", "pirmadienį 11-30" */
    if (!day) return lang === "en" ? "later" : "vėliau";
    var t = S.M ? S.M.today : P.ymd(Date.now()), n = P.daysBetween(t, day);
    if (n === 0) return lang === "en" ? "today" : "šiandien";
    if (n === 1) return lang === "en" ? "tomorrow" : "rytoj";
    if (n < 0) return lang === "en" ? md(day) + " (" + (-n) + " d ago)" : md(day) + " (prieš " + (-n) + " d.)";
    var wd = P.toDate(day).getDay();
    return n < 7 ? (lang === "en" ? WD.en[wd] + " " + md(day) : WDA[wd] + " " + md(day)) : md(day);
  }
  /* the project as the team named it in ShopFlow: number · name (client) */
  function ttl(o) { return o ? [o.num, o.product].filter(Boolean).join(" · ") : ""; }
  function ttlC(o) { return ttl(o) + (o && o.client && P.norm(o.client) !== P.norm(o.product) ? " (" + o.client + ")" : ""); }
  function pj(o) { return '<span class="pj">' + esc(ttl(o)) + (o.client && P.norm(o.client) !== P.norm(o.product) ? '<small>' + esc(o.client) + '</small>' : '') + '</span>'; }
  function kn(k) { return T(esc(P.keyName(k, "lt")), esc(P.keyName(k, "en"))); }
  function cn(c) { return T(esc(P.catName(c, "lt")), esc(P.catName(c, "en"))); }
  function mName(id) { var m = S.M && S.M.mById[id]; return m ? m.name : "?"; }
  function oById(id) { return S.M ? S.M.orders.filter(function (o) { return o.id === id; })[0] : null; }
  function thing(g, lang) { return g.cat === "other" && g.label ? (g.label.length > 48 ? g.label.slice(0, 46) + "…" : g.label) : P.catName(g.cat, lang).toLowerCase(); }
  function stateTxt(g, lang) {
    var en = lang === "en";
    if (g.state === "client") return en ? "client takes care of it" : "rūpinasi klientas";
    if (g.state === "ordered") return g.due ? (g.late ? (en ? "ordered, was due " + md(g.due) + " — late" : "užsakyta, turėjo atvykti " + md(g.due) + " — vėluoja") : (en ? "ordered, arrives " + md(g.due) : "užsakyta, atvyks " + md(g.due))) : (en ? "ordered, no date" : "užsakyta, data nežinoma");
    if (g.source === "eng") return en ? "engineering not handed over" : "projektavimas neperduotas";
    return en ? "not ordered yet" : "dar neužsakyta";
  }

  /* ---------------- data ---------------- */
  function monKey(d) { return d.getFullYear() + "-" + (d.getMonth() < 9 ? "0" : "") + (d.getMonth() + 1); }
  function load(quiet) {
    if (S.busy) return Promise.resolve(); S.busy = true;
    var mons = [], x = new Date(); x.setDate(1); for (var i = 0; i < 3; i++) { mons.push("dedes-cechas-log-" + monKey(x)); x.setMonth(x.getMonth() - 1); }
    var soft = function (p) { return p.catch(function () { return []; }); };
    return Promise.all([
      W.rest("workspaces?id=eq." + SF + "&select=orders:data->orders,members:data->members,stations:data->stations,shift:data->shift,activity:data->activity"),
      soft(W.rest("workspaces?id=eq.dedes-cechas&select=layout:data->layout")),
      soft(W.rest("workspaces?id=in.(" + mons.join(",") + ")&select=data")),
      soft(W.rest("workspaces?id=eq.dedes-prasymai&select=requests:data->requests")),
      soft(W.rest("workspaces?id=eq.dedes-cechas-nasumas&select=data")),
      soft(W.rest("fabflow_projects?select=name,parts:data->parts&updated_at=gte." + new Date(Date.now() - 200 * 864e5).toISOString() + "&order=updated_at.desc")),
      soft(W.rest("workspaces?id=eq." + DOC_ID + "&select=data")),
      soft(W.rest("workspaces?id=eq.dedes-apzvalga&select=data"))
    ]).then(function (r) {
      var sf = (r[0] || [])[0]; if (!sf) throw new Error("no shopflow");
      var sess = []; (r[2] || []).forEach(function (row) { var s = row && row.data && row.data.s; if (s) Object.keys(s).forEach(function (k) { sess.push(s[k]); }); });
      S.raw = {
        orders: sf.orders || [], members: sf.members || [], stations: sf.stations || [], shift: sf.shift || {}, activity: sf.activity || [],
        layout: ((r[1] || [])[0] || {}).layout || {}, sessions: sess, requests: ((r[3] || [])[0] || {}).requests || {},
        nasCfg: ((r[4] || [])[0] || {}).data || null, apzNotes: (((r[7] || [])[0] || {}).data || {}).notes || {}, nest: (r[5] || []).filter(function (n) { return n && n.name && Array.isArray(n.parts) && n.parts.length; })
      };
      S.doc = fixDoc(((r[6] || [])[0] || {}).data);
      S.loaded = new Date();
      compute();
    }).catch(function (e) {
      console.error(e);
      if (!quiet) document.getElementById("main").innerHTML = '<div class="state">' + B("Nepavyko įkelti ShopFlow duomenų. Patikrinkite ryšį ir atnaujinkite puslapį.", "Could not load ShopFlow data. Check the connection and reload.") + '</div>';
      document.getElementById("src").textContent = "Nėra ryšio / Offline";
    }).then(function () { S.busy = false; });
  }
  function fixDoc(d) { d = d && typeof d === "object" ? d : {}; return { adj: d.adj || [], log: d.log || [], plans: d.plans || {}, cfg: d.cfg || {} }; }
  /* the office's shared state: re-read, change, write back (merging by id, so two managers don't overwrite each other) */
  function saveDoc(mut) {
    return W.rest("workspaces?id=eq." + DOC_ID + "&select=data").then(function (rows) {
      var cur = fixDoc(((rows || [])[0] || {}).data);
      mut(cur);
      var cutoff = P.addDays(S.M.today, -45);
      cur.adj = cur.adj.filter(function (a) { return a && (a.to || a.day || a.until || P.ymd(a.at || Date.now())) >= cutoff; }).slice(-400);
      cur.log = cur.log.slice(-300);
      Object.keys(cur.plans).forEach(function (k) { if (k < cutoff) delete cur.plans[k]; });
      return W.rest("workspaces?on_conflict=id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({ id: DOC_ID, data: cur, updated_by: ME ? ME.display_name : "planas" }) }).then(function () { S.doc = cur; });
    });
  }
  function addAdj(list, text) {
    var by = ME ? ME.display_name : "";
    list.forEach(function (a) { a.by = by; if (!a.id) a.id = P.uid(); if (!a.at) a.at = Date.now(); });
    return saveDoc(function (d) {
      list.forEach(function (a) { d.adj.push(a); });
      if (text) d.log.push({ id: P.uid(), t: text, at: Date.now(), by: by, adj: list.map(function (a) { return a.id; }), day: S.day0 });
    }).then(compute);
  }
  function removeAdj(id) { return saveDoc(function (d) { d.adj.forEach(function (a) { if (a.id === id) a.off = Date.now(); }); }).then(compute); }

  /* ---------------- compute ---------------- */
  function compute() {
    if (!S.raw) return;
    var r = S.raw;
    S.M = P.build({ orders: r.orders, stations: r.stations, members: r.members, shift: r.shift, sessions: r.sessions, layout: r.layout, requests: r.requests,
      activity: r.activity, nest: r.nest, nasCfg: r.nasCfg, saved: S.doc, now: Date.now() });
    var M = S.M, hr = new Date().getHours();
    if (!S.pinned) {
      S.day0 = P.nextWorkday(M.today, M.shift, 1);
      /* afternoon: today is (almost) over, review it; morning: review the last full working day */
      S.revDay = hr >= 13 && P.isWorkday(M.today, M.shift) ? M.today : P.prevWorkday(M.today, M.shift);
    } else S.revDay = P.prevWorkday(S.day0, M.shift) > M.today ? M.today : P.prevWorkday(S.day0, M.shift);
    if (S.revDay > M.today) S.revDay = M.today;
    var adj = S.doc.adj.filter(function (a) { return !a.off; });
    /* "Ko trūksta?" notes from Projektų apžvalga: a missing thing written there holds the plan back too */
    S.apz = [];
    Object.keys(r.apzNotes || {}).forEach(function (oid) {
      var n = r.apzNotes[oid], o = M.orders.filter(function (x) { return x.id === oid; })[0]; if (!o || !n || !n.t) return;
      var got = P.parse(n.t, { force: o, today: M.today, planDay: S.day0, orders: [o], members: M.members, shiftMin: M.shiftMin, shift: M.shift }).filter(function (a) { return a.k === "missing" || a.k === "hold"; });
      var later = adj.some(function (a) { return a.o === oid && a.k === "arrived" && a.at > (n.at || 0); });
      got.forEach(function (a, i) { a.id = "apz-" + oid + "-" + i; a.at = n.at || 0; a.by = n.by; a.apz = true; if (a.k === "missing") a.label = n.t; });
      if (!later) { adj = adj.concat(got); S.apz = S.apz.concat(got); }
    });
    S.plan = P.plan(M, S.day0, adj, { horizon: 15 });
    S.R = P.review(M, S.revDay, S.doc.plans[S.revDay]);
    S.A = P.analyse(M, S.plan, S.R);
    render();
  }

  /* ---------------- describing an adjustment ---------------- */
  function describe(a) {
    var o = a.o ? oById(a.o) : null, on = o ? esc(ttl(o)) : (a.o ? "?" : ""), m = a.m ? esc(mName(a.m)) : "";
    var rng = function (lang) { return a.to && a.to !== a.day ? dWhen(a.day, lang) + " – " + dWhen(a.to, lang) : dWhen(a.day, lang); };
    switch (a.k) {
      case "absent": return T(m + " nedirba " + rng("lt"), m + " is off " + rng("en"));
      case "avail": return T(m + " dirba tik " + num(a.h, "lt") + " h " + rng("lt"), m + " works only " + num(a.h, "en") + " h " + rng("en"));
      case "arrived":
        var lbl = a.label, isId = a.cat && a.cat.indexOf("id:") === 0;
        if (isId && o) { var dt = o.details.filter(function (x) { return "id:" + x.id === a.cat; })[0]; if (dt) lbl = dt.cat && dt.cat !== "other" ? P.catName(dt.cat, "lt") : dt.label; }
        return T(on + ": atvyko – " + esc(lbl || (a.cat && a.cat !== "*" && !isId ? P.catName(a.cat, "lt") : "viskas, ko laukta")), on + ": arrived – " + esc(lbl || (a.cat && a.cat !== "*" && !isId ? P.catName(a.cat, "en") : "everything waited for")));
      case "missing": return T(on + ": trūksta – " + esc(P.catName(a.cat, "lt")) + (a.until ? ", atvyks " + md(a.until) : ""), on + ": missing – " + esc(P.catName(a.cat, "en")) + (a.until ? ", arrives " + md(a.until) : ""));
      case "eta": return T(on + ": " + esc(a.label || "") + " atvyks " + md(a.until), on + ": " + esc(a.label || "") + " arrives " + md(a.until));
      case "prio": return a.level === "top" ? T(on + " – pirmiausia", on + " – first priority") : T(on + " – neskubus", on + " – not urgent");
      case "hold": return T(on + " – atidėta" + (a.until ? " iki " + md(a.until) + " imtinai" : ""), on + " – on hold" + (a.until ? " until " + md(a.until) : ""));
      case "unblock": return T(on + " – kliūtis išspręsta", on + " – block solved");
      case "assign": return T(on + (a.key ? " · " + esc(P.keyName(a.key, "lt")) : "") + " → " + m, on + (a.key ? " · " + esc(P.keyName(a.key, "en")) : "") + " → " + m);
      case "hours": return T(on + (a.key ? " · " + esc(P.keyName(a.key, "lt")) : "") + ": liko " + num(a.h, "lt") + " h", on + (a.key ? " · " + esc(P.keyName(a.key, "en")) : "") + ": " + num(a.h, "en") + " h left");
      case "install": var who = (a.ms && a.ms.length ? a.ms : a.m ? [a.m] : []).map(mName).join(", ");
        return T(on + ": montavimas " + dWhen(a.day, "lt") + (who ? " – " + esc(who) : ""), on + ": installation " + dWhen(a.day, "en") + (who ? " – " + esc(who) : ""));
      case "note": return '<span class="free">' + esc(a.text) + '</span>';
    }
    return esc(a.k);
  }
  var KIND = { absent: ["Nedirba", "Off"], avail: ["Valandos", "Hours"], arrived: ["Atvyko", "Arrived"], missing: ["Trūksta", "Missing"], eta: ["Atvyks", "ETA"], prio: ["Prioritetas", "Priority"],
    hold: ["Atidėta", "Hold"], unblock: ["Išspręsta", "Solved"], assign: ["Priskirta", "Assigned"], hours: ["Trukmė", "Duration"], install: ["Montavimas", "Install"], note: ["Pastaba", "Note"] };

  /* ---------------- render ---------------- */
  function render() {
    var M = S.M, Pl = S.plan, D = Pl.days[0], A = S.A, h = "";
    head();
    var urg = A.actions.filter(function (a) { return a.urgent; }).length;
    document.getElementById("jump").innerHTML = [
      ["s-sum", "Santrauka", "Summary", ""], ["s-talk", "Pastabos", "Comments", ""], ["s-act", "Ko trūksta", "Blockers", urg ? "<b>" + urg + "</b>" : ""],
      ["s-plan", "Planas", "Plan", ""], ["s-rev", "Kas padaryta", "What was done", ""], ["s-fc", "Prognozė", "Forecast", ""]
    ].map(function (x) { return '<a href="#' + x[0] + '">' + T(x[1], x[2]) + x[3] + '</a>'; }).join("");
    h += secSummary(M, Pl, D, A);
    h += secTalk();
    h += secActions(A);
    h += secPlan(D);
    h += secReview(S.R);
    h += secForecast(M, Pl);
    document.getElementById("main").innerHTML = h;
    wire();
  }
  function head() {
    var M = S.M;
    document.getElementById("title").innerHTML = 'Dienos planas<small>' + T("Planas: " + dName(S.day0, "lt"), "Plan for " + dName(S.day0, "en")) + '</small>';
    document.getElementById("dLbl").textContent = md(S.day0);
    document.getElementById("src").innerHTML = "ShopFlow · " + T("atnaujinta ", "updated ") + "<b>" + hm(S.loaded) + "</b>" + (S.doc.plans[S.day0] ? " · " + T("patvirtinta ", "confirmed ") + esc(S.doc.plans[S.day0].by || "") + " " + hm(new Date(S.doc.plans[S.day0].at)) : "");
    document.getElementById("who").innerHTML = ME ? esc(ME.display_name) + '<button type="button" id="out">Atsijungti</button>' : "";
    var o = document.getElementById("out"); if (o) o.onclick = function () { W.logout(); location.reload(); };
    var c = document.getElementById("confirm"); c.innerHTML = S.doc.plans[S.day0] ? T("Patvirtinti iš naujo", "Confirm again") : T("Patvirtinti planą", "Confirm plan");
  }
  function hm(d) { return d ? String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0") : ""; }

  /* --- 1. what the agent says --- */
  function secSummary(M, Pl, D, A) {
    var cap = 0, used = 0, people = 0, tasks = 0;
    var shop = D.lanes.filter(function (ln) { return !ln.m.eng; }), eng = D.lanes.filter(function (ln) { return ln.m.eng; });
    shop.forEach(function (ln) { if (ln.cap > 0) { people++; cap += ln.cap; used += ln.t; tasks += ln.tasks.length; } });
    var util = cap ? Math.round(used / cap * 100) : 0, lines = [];
    var miss = A.actions.filter(function (a) { return a.kind === "missing" && a.g.blocking; }), missSoon = miss.filter(function (a) { return a.urgent; });
    var blocked = A.actions.filter(function (a) { return a.kind === "blocked"; });
    var I = {}; A.insights.forEach(function (i) { I[i.k] = I[i.k] || i; });
    var off = shop.filter(function (ln) { return ln.cap <= 0; });
    lines.push(["blu", B(dName(S.day0, "lt").replace(/^./, function (c) { return c.toUpperCase(); }) + ": cechui suplanuota " + num(used / 60, "lt") + " h darbo " + people + " iš " + shop.length + " " + pl(shop.length, "darbuotojo", "darbuotojų", "darbuotojų") + " (" + tasks + " " + pl(tasks, "darbas", "darbai", "darbų") + ", užimtumas " + util + " %)." + (off.length ? " Nedirba: " + off.map(function (l) { return esc(l.m.name); }).join(", ") + "." : ""),
      dName(S.day0, "en") + ": " + num(used / 60, "en") + " h of workshop work planned for " + people + " of " + shop.length + " people (" + tasks + " jobs, " + util + " % loaded)." + (off.length ? " Off: " + off.map(function (l) { return esc(l.m.name); }).join(", ") + "." : ""))]);
    if (missSoon.length) {
      var lt = missSoon.slice(0, 3).map(function (a) { return "„" + esc(thing(a.g, "lt")) + "“ (" + esc(ttl(a.o)) + ", reikia " + dWhen(a.needBy, "lt") + ")"; }).join("; ");
      var en = missSoon.slice(0, 3).map(function (a) { return "“" + esc(thing(a.g, "en")) + "” (" + esc(ttl(a.o)) + ", needed " + dWhen(a.needBy, "en") + ")"; }).join("; ");
      lines.push(["red", B("Svarbiausia vadybai: " + missSoon.length + " " + pl(missSoon.length, "dalykas", "dalykai", "dalykų") + " sustabdys darbą, jei neatsiras laiku – " + lt + ".", "Most important for the office: " + missSoon.length + " missing thing" + (missSoon.length === 1 ? "" : "s") + " will stop work if not here in time – " + en + ".")]);
    } else if (miss.length) lines.push(["amb", B("Laukiama " + miss.length + " " + pl(miss.length, "dalyko", "dalykų", "dalykų") + ", bet artimiausiom dienom jie darbo dar nestabdo.", miss.length + " thing" + (miss.length === 1 ? " is" : "s are") + " still awaited, but they do not stop work in the next days.")]);
    if (blocked.length) lines.push(["red", B(blocked.length + " " + pl(blocked.length, "etapas užblokuotas", "etapai užblokuoti", "etapų užblokuota") + ": " + blocked.slice(0, 3).map(function (a) { return esc(ttl(a.o)) + " – „" + esc(a.op.blockNote || "be priežasties") + "“"; }).join("; ") + ".",
      blocked.length + " step" + (blocked.length === 1 ? " is" : "s are") + " blocked: " + blocked.slice(0, 3).map(function (a) { return esc(ttl(a.o)) + " – “" + esc(a.op.blockNote || "no reason") + "”"; }).join("; ") + ".")]);
    if (I.bottleneck) {
      var b = I.bottleneck;
      lines.push(["amb", B("Siauriausia vieta – " + esc(P.keyName(b.key, "lt")).toLowerCase() + ": eilėje " + num(b.h, "lt") + " h (~" + num(b.days, "lt") + " žmogaus d.), " + dWhen(S.day0, "lt") + " suplanuota " + num(b.planned, "lt") + " h. Čia verta skirti daugiau rankų.",
        "Tightest step – " + esc(P.keyName(b.key, "en")).toLowerCase() + ": " + num(b.h, "en") + " h queued (~" + num(b.days, "en") + " person-days), " + num(b.planned, "en") + " h planned " + dWhen(S.day0, "en") + ". Worth putting more hands here.")]);
    }
    if (I.late) {
      var worst = I.late.list.map(function (o) { var f = Pl.forecast[o.id]; return { o: o, d: f.late != null ? f.late : P.workdaysBetween(o.due, S.day0, M.shift) }; }).sort(function (a, b) { return b.d - a.d; });
      lines.push(["red", B(I.late.n + " " + pl(I.late.n, "projektas vėluoja", "projektai vėluoja", "projektų vėluoja") + " arba vėluos. Labiausiai: " + worst.slice(0, 3).map(function (x) { return esc(ttl(x.o)) + " (" + x.d + " d.d.)"; }).join(", ") + ".",
        I.late.n + " project" + (I.late.n === 1 ? " is" : "s are") + " or will be late. Worst: " + worst.slice(0, 3).map(function (x) { return esc(ttl(x.o)) + " (" + x.d + " work days)"; }).join(", ") + ".")]);
    }
    A.insights.filter(function (i) { return i.k === "idle"; }).forEach(function (i) {
      lines.push(["amb", B(esc(i.m.name) + " turi " + num(i.h, "lt") + " h laisvo laiko – nėra paruoštų darbų jo etapams. Priskirkite jam ką nors pastaba (pvz. „WO-… surinkimą daro " + esc(i.m.name) + "“).",
        esc(i.m.name) + " has " + num(i.h, "en") + " h free – nothing ready for their steps. Give them something with a comment (e.g. “WO-… assembly to " + esc(i.m.name) + "”).")]);
    });
    if (I.noproj) lines.push(["amb", B("Kas padaryta: " + num(I.noproj.h, "lt") + " h iš " + num(I.noproj.of, "lt") + " h cecho plane pažymėta be projekto – šio laiko negalima priskirti darbams.", "What was done: " + num(I.noproj.h, "en") + " h of " + num(I.noproj.of, "en") + " h on the floor plan had no project – that time cannot be credited to any job.")]);
    var R = S.R, steps = R.done.length || R.actDone.length;
    lines.push(["grn", B(dName(S.revDay, "lt").replace(/^./, function (c) { return c.toUpperCase(); }) + (S.revDay === M.today ? " (iki " + hm(new Date()) + ")" : "") + ": atlikta " + steps + " " + pl(steps, "etapas", "etapai", "etapų") + (R.adherence ? ", plano įvykdymas " + R.adherence.pct + " %" : "") + ".",
      dName(S.revDay, "en") + (S.revDay === M.today ? " (until " + hm(new Date()) + ")" : "") + ": " + steps + " step" + (steps === 1 ? "" : "s") + " finished" + (R.adherence ? ", " + R.adherence.pct + " % of the plan done" : "") + ".")]);
    var k = '<div class="kpis">' +
      kpi(num(used / 60, "lt") + " h", T("suplanuota", "planned")) + kpi(util + " %", T("užimtumas", "loaded")) +
      kpi(missSoon.length + blocked.length, T("stabdo darbą", "stopping work")) + kpi(I.late ? I.late.n : 0, T("vėluoja", "late")) + kpi(steps, T("atlikta etapų", "steps done")) + '</div>';
    return '<section id="s-sum"><h2>' + T("Agentas sako", "The agent says") + '</h2>' + k + '<div class="card says"><ul>' + lines.map(function (l) { return '<li><i class="' + l[0] + '"></i><div>' + l[1] + '</div></li>'; }).join("") + '</ul></div></section>';
  }
  function kpi(v, l) { return '<div><b>' + v + '</b><small>' + l + '</small></div>'; }

  /* --- 2. comments --- */
  function secTalk() {
    var day = S.day0, act = S.doc.adj.filter(function (a) { return !a.off && !a.hidden && relevant(a); }).sort(function (a, b) { return b.at - a.at; });
    var ex = [["Donatas rytoj nedirba", "Donatas is off tomorrow"], ["Rankenėlės WO-1024 atvyko", "Handles for WO-1024 arrived"], ["WO-1042 trūksta stalviršio, atvyks 12-03", "WO-1042 worktop missing, arrives 12-03"],
      ["Kazlai skubu", "Kazlai is urgent"], ["WO-1046 pjovimą daro Donatas", "WO-1046 cutting to Donatas"], ["WO-1039 montavimas rytoj Dainius ir Mantas", "WO-1039 installation tomorrow Dainius and Mantas"]];
    var h = '<section id="s-talk"><h2>' + T("Pastabos ir pakeitimai", "Comments and changes") + '<span class="n">' + act.length + '</span></h2>' +
      '<p class="sub">' + T("Parašykite, ko ShopFlow nežino – planas persiskaičiuos iškart. Galima lietuviškai arba angliškai.", "Write what ShopFlow doesn't know – the plan is redone at once. Lithuanian or English.") + '</p>' +
      '<div class="card talk"><form id="tform"><textarea id="tin" maxlength="600" placeholder="pvz. Mantas pirmadienį nedirba · rankenėlės DiG atvyko · WO-1046 skubu / e.g. Mantas is off on Monday"></textarea>' +
      '<div style="display:flex;flex-direction:column;gap:6px"><button type="submit" class="btn pri" id="tsend">' + T("Pritaikyti", "Apply") + '</button><button type="button" class="btn" id="task">' + T("Klausti agento", "Ask the agent") + '</button></div></form>' +
      '<div class="ex">' + ex.map(function (e) { return '<button type="button" data-ex="' + esc(LANG === "en" ? e[1] : e[0]) + '">' + esc(LANG === "en" ? e[1] : e[0]) + '</button>'; }).join("") + '</div>' +
      (S.reply ? '<div class="reply' + (S.reply.err ? " err" : "") + '">' + S.reply.html + '</div>' : '') +
      (act.length ? '<div class="chips">' + act.map(function (a) {
        return '<div class="chip' + (a.k === "note" ? " note" : "") + '"><span class="k">' + T(KIND[a.k][0], KIND[a.k][1]) + '</span><div class="tx">' + describe(a) +
          '<div class="by">' + esc([a.by, a.at ? md(P.ymd(a.at)) + " " + hm(new Date(a.at)) : "", a.ai ? "AI" : ""].filter(Boolean).join(" · ")) + (a.src && a.k !== "note" ? ' · „' + esc(a.src.slice(0, 80)) + '“' : '') + '</div></div>' +
          '<button type="button" class="x" data-rm="' + esc(a.id) + '" aria-label="Pašalinti / Remove" title="Pašalinti / Remove">×</button></div>';
      }).join("") + '</div>' : '') + '</div></section>';
    return h;
    function relevant(a) {
      if (a.k === "absent" || a.k === "avail" || a.k === "install") return (a.to || a.day) >= S.M.today;
      if (a.k === "hold") return !a.until || a.until >= S.M.today;
      if (a.k === "note") return (a.day || P.ymd(a.at)) >= P.addDays(S.M.today, -3);
      return !a.o || !!oById(a.o);
    }
  }

  /* --- 3. office actions --- */
  function secActions(A) {
    var main = A.actions.filter(function (a) { return a.kind !== "close" && !(a.kind === "missing" && !a.g.blocking && !a.urgent); });
    var rest = A.actions.filter(function (a) { return main.indexOf(a) < 0; });
    var h = '<section id="s-act"><h2>' + T("Ko trūksta – vadybai", "What's missing – for the office") + '<span class="n">' + main.length + '</span></h2>' +
      '<p class="sub">' + T("Pirmiausia tai, kas sustabdys darbą artimiausiom dienom. Data – kada to reikės pagal planą.", "First what will stop work in the next days. The date is when the plan needs it.") + '</p>';
    if (!main.length) h += '<div class="state">' + T("Nieko nestabdo – visi reikalingi dalykai yra arba dar nereikalingi.", "Nothing is in the way – everything needed is here or not needed yet.") + '</div>';
    h += '<div class="acts">' + main.map(act).join("") + '</div>';
    if (rest.length) h += '<details class="more"><summary>' + T("Kita (" + rest.length + "): informacija ir tvarkymas", "Other (" + rest.length + "): info and housekeeping") + '</summary><div class="acts" style="margin-top:8px">' + rest.map(act).join("") + '</div></details>';
    return h + '</section>';
    function act(a) {
      var o = a.o, cls = a.urgent ? "urg" : a.kind === "install" ? "grn" : a.kind === "close" ? "" : "amb", ic, t, bt = "";
      if (a.kind === "missing") {
        var g = a.g, gk = P.KEYS[g.gateKey] ? g.gateKey : null;
        ic = T(esc(P.catName(g.cat, "lt")), esc(P.catName(g.cat, "en")));
        t = '<b>' + esc(ttlC(o)) + '</b>' + (g.label ? ' – „' + esc(g.label) + '“' : '') +
          '<div class="m">' + T((a.needBy ? "Reikės " + dWhen(a.needBy, "lt") : "Reikės vėliau") + (gk && g.gateOp ? " (" + esc(P.keyName(gk, "lt")) + ")" : g.forEnd ? " (projekto pabaigai)" : "") + " · " + stateTxt(g, "lt"),
            (a.needBy ? "Needed " + dWhen(a.needBy, "en") : "Needed later") + (gk && g.gateOp ? " (" + esc(P.keyName(gk, "en")) + ")" : g.forEnd ? " (to finish the project)" : "") + " · " + stateTxt(g, "en")) + '</div>';
        bt = '<button type="button" class="btn sm" data-arr="' + esc(o.id) + '" data-det="' + esc(g.detailId || "") + '" data-cat="' + esc(g.cat) + '" data-adj="' + esc(g.adjId || "") + '">✓ ' + T("Atvyko", "Arrived") + '</button>' +
          (g.state !== "client" ? '<button type="button" class="btn sm" data-eta="' + esc(o.id) + '" data-det="' + esc(g.detailId || "") + '" data-cat="' + esc(g.cat) + '" data-lbl="' + esc(g.label || "") + '">📅 ' + T("Atvyks…", "Arrives…") + '</button>' : '');
      } else if (a.kind === "blocked") {
        ic = T("Užblokuota", "Blocked");
        t = '<b>' + esc(ttlC(o)) + '</b> · ' + kn(a.op.key) + '<div class="m">„' + esc(a.op.blockNote || "–") + '“' + (a.op.blockedAt ? " · " + T("nuo " + md(P.ymd(a.op.blockedAt)), "since " + md(P.ymd(a.op.blockedAt))) : "") + '</div>';
        bt = '<button type="button" class="btn sm" data-unb="' + esc(o.id) + '">✓ ' + T("Išspręsta", "Solved") + '</button>';
      } else if (a.kind === "install") {
        ic = T("Montavimas", "Install");
        t = '<b>' + esc(ttlC(o)) + '</b><div class="m">' + T("Pagaminta – liko montavimas. Suderinkite datą su klientu" + (o.due ? " (terminas " + md(o.due) + ")" : "") + ".", "Made – only installation left. Agree the date with the client" + (o.due ? " (due " + md(o.due) + ")" : "") + ".") + '</div>';
        bt = '<button type="button" class="btn sm" data-inst="' + esc(o.id) + '">📅 ' + T("Suplanuoti", "Schedule") + '</button>';
      } else if (a.kind === "office" || a.kind === "nobody") {
        ic = a.kind === "office" ? T("Vadybai", "Office") : T("Niekam", "Nobody");
        t = '<b>' + esc(ttlC(o)) + '</b> · ' + kn(a.op.key) + '<div class="m">' + (a.kind === "office" ? T("Etapas priskirtas vadybai (" + esc(a.op.assignees.map(mName).join(", ")) + ") – atlikite arba pažymėkite ShopFlow.", "The step is on the office (" + esc(a.op.assignees.map(mName).join(", ")) + ") – do it or mark it in ShopFlow.") : T("Etapui niekas nepriskirtas – priskirkite ShopFlow arba pastaba.", "Nobody is assigned – assign in ShopFlow or with a comment.")) + '</div>';
      } else {
        ic = T("Baigta", "Done");
        t = '<b>' + esc(ttlC(o)) + '</b><div class="m">' + (o.type === "eng" ? T("Visi projektavimo etapai atlikti – jei gamybos užsakymas jau sukurtas, uždarykite ShopFlow.", "All design steps done – if the production order exists, close it in ShopFlow.") : T("Visi etapai atlikti – pažymėkite išsiųstu / uždarykite ShopFlow.", "All steps done – mark as shipped / close in ShopFlow.")) + '</div>';
      }
      if (o && a.kind !== "close") bt += '<button type="button" class="btn sm" data-hold="' + esc(o.id) + '">' + T("Atidėti", "Hold") + '</button>';
      return '<div class="act ' + cls + '"><span class="ic">' + ic + '</span><div class="t">' + t + '</div><div class="bt">' + bt + '</div></div>';
    }
  }

  /* --- 4. the plan --- */
  function clock(t) {   /* plannable minutes → clock time (the plan is spread over the whole shift, breaks skipped) */
    var M = S.M, sh = M.shift || {}, f = S.plan.factor, m = mins(sh.start || "08:00") + t / f;
    (sh.breaks || []).slice().sort(function (a, b) { return mins(a.from) - mins(b.from); }).forEach(function (b) { if (m > mins(b.from)) m += mins(b.to) - mins(b.from); });
    m = Math.min(m, mins(sh.end || "17:00")); m = Math.round(m / 5) * 5;
    return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
  }
  function mins(x) { var p = String(x || "").split(":"); return (+p[0] || 0) * 60 + (+p[1] || 0); }
  function secPlan(D) {
    var M = S.M, Pl = S.plan;
    var h = '<section id="s-plan"><h2>' + T("Planas", "Plan") + ' <em>' + T(esc(dName(D.day, "lt")), esc(dName(D.day, "en"))) + '</em><span class="n">' + T("planuojama " + Math.round(Pl.factor * 100) + " % pamainos", Math.round(Pl.factor * 100) + " % of the shift planned") + '</span></h2>' +
      '<p class="sub">' + T("Laikai apytiksliai. „Tęsiama“ – pradėta anksčiau; „dalis“ – nebaigs per dieną; „padeda“ – laisvas laikas kitame etape.", "Times are approximate. “Continuing” – started before; “part” – won't finish in a day; “helping” – free time on another step.") + '</p>';
    var shopL = D.lanes.filter(function (ln) { return !ln.m.eng; }), engL = D.lanes.filter(function (ln) { return ln.m.eng; });
    [[shopL, T("Cechas", "Workshop")], [engL, T("Projektavimas", "Engineering")]].forEach(function (G) {
    if (!G[0].length) return;
    var gu = 0, gc = 0; G[0].forEach(function (ln) { gu += ln.t; gc += ln.cap; });
    h += '<h3 class="lg">' + G[1] + ' <span class="mono">' + G[0].length + ' · ' + H(gu / 60) + ' / ' + H(gc / 60) + '</span></h3><div class="lanes">';
    G[0].forEach(function (ln) {
      var m = ln.m, col = COLORS[(+m.color || 0) % COLORS.length], off = ln.cap <= 0;
      var w = ln.why, whyT = !w ? "" : w.k === "leave" ? T(({ atostogos: "atostogos", tevadienis: "tėvadienis", mamadienis: "mamadienis" })[w.type] || "atostogos", w.type === "tevadienis" ? "father's day off" : w.type === "mamadienis" ? "mother's day off" : "leave") + (w.ok ? "" : " " + T("(nepatvirtinta)", "(not approved)")) : w.k === "absent" ? T("nedirba (pastaba)", "off (comment)") : T("tik " + num(w.h, "lt") + " h", "only " + num(w.h, "en") + " h");
      h += '<div class="lane' + (off ? " off" : "") + '"><div class="lh"><span class="av" style="background:' + col + '">' + esc(m.name.charAt(0)) + '</span><div class="nm"><b>' + esc(m.name) + '</b><small>' + esc(m.role === "engineer" ? "Projektavimas" : (M.stations[m.station] || {}).name || "Gamyba") + '</small></div>' + (whyT ? '<span class="tag ' + (off ? "red" : "amb") + '">' + whyT + '</span>' : '') + '</div>';
      if (!off) {
        var helpM = 0; ln.tasks.forEach(function (t) { if (t.help) helpM += t.end - t.start; });
        h += '<div class="cap"><div class="bar"><span style="width:' + Math.min(100, (ln.t - helpM) / ln.cap * 100) + '%"></span><span class="h" style="width:' + Math.min(100, helpM / ln.cap * 100) + '%"></span></div><div class="capt"><span>' + H(ln.t / 60) + ' / ' + H(ln.cap / 60) + '</span><span>' + (ln.cap - ln.t >= 30 ? T("laisva " + num((ln.cap - ln.t) / 60, "lt") + " h", num((ln.cap - ln.t) / 60, "en") + " h free") : T("pilna", "full")) + '</span></div></div>';
        h += ln.tasks.length ? '<div class="tasks">' + ln.tasks.map(function (t) { return task(t, ln); }).join("") + '</div>' : '<div class="empty">' + T("Nėra paruoštų darbų šiam žmogui.", "Nothing ready for this person.") + '</div>';
      } else h += '<div class="offm">' + T("Šią dieną neplanuojama.", "Not planned this day.") + '</div>';
      h += '<div class="lb">' + (off ? '<button type="button" class="btn sm" data-on="' + esc(m.id) + '">' + T("Dirbs", "Will work") + '</button>' : '<button type="button" class="btn sm" data-off="' + esc(m.id) + '">' + T("Nedirba", "Off") + '</button><button type="button" class="btn sm" data-hrs="' + esc(m.id) + '">' + T("Valandos…", "Hours…") + '</button>') + '</div></div>';
    });
    h += '</div>';
    });
    /* what did not make it */
    var sk = (D.skipped || []).filter(function (s) { return s.reason !== "install" && s.reason !== "office" && s.reason !== "nobody"; });
    var grp = { full: [], away: [], missing: [], blocked: [], hold: [] };
    sk.forEach(function (s) { (grp[s.reason] = grp[s.reason] || []).push(s); });
    var RS = { full: ["Neužteko laiko – kitą dieną", "Not enough time – next day"], away: ["Žmogus nedirba", "The person is off"], missing: ["Laukia, ko trūksta", "Waiting for something missing"], blocked: ["Užblokuota", "Blocked"], hold: ["Atidėta", "On hold"] };
    var any = Object.keys(grp).some(function (k) { return grp[k].length; });
    if (any) {
      h += '<details class="more"><summary>' + T("Nepateko į planą (" + sk.length + ")", "Not in the plan (" + sk.length + ")") + '</summary><table class="tbl" style="margin-top:8px"><thead><tr><th>' + T("Projektas", "Project") + '</th><th>' + T("Etapas", "Step") + '</th><th>' + T("Kodėl", "Why") + '</th><th class="r hide-s">' + T("Terminas", "Due") + '</th></tr></thead><tbody>';
      Object.keys(grp).forEach(function (k) { grp[k].forEach(function (s) {
        var why = T(RS[k][0], RS[k][1]);
        if (k === "missing" && s.gate) why = T("Laukia: " + esc(P.catName(s.gate.cat, "lt")), "Waiting for: " + esc(P.catName(s.gate.cat, "en")));
        if (k === "blocked" && s.op) why = T("Užblokuota: „" + esc(s.op.blockNote || "") + "“", "Blocked: “" + esc(s.op.blockNote || "") + "”");
        if (k === "away" && s.who) why = T(esc(s.who.map(mName).join(", ")) + " nedirba", esc(s.who.map(mName).join(", ")) + " off");
        if (k === "hold" && s.until) why = T("Atidėta iki " + md(s.until), "On hold until " + md(s.until));
        h += '<tr><td class="pj"><b>' + esc(ttl(s.o)) + '</b><small>' + esc(s.o.client) + '</small></td><td>' + (s.op ? kn(s.op.key) : "–") + '</td><td>' + why + '</td><td class="r hide-s">' + esc(md(s.o.due)) + '</td></tr>';
      }); });
      h += '</tbody></table></details>';
    }
    return h + '</section>';
  }
  function task(t, ln) {
    var o = t.o, M = S.M, f = S.plan.forecast[o.id], tg = [], late = o.due ? P.workdaysBetween(o.due, S.day0, M.shift) : 0;
    if (t.inst) tg.push('<span class="tag grn">' + T("montavimas", "installation") + '</span>');
    if (t.cont) tg.push('<span class="tag blu">' + T("tęsiama", "continuing") + '</span>');
    if (t.partial) tg.push('<span class="tag">' + T("dalis – liks " + num(t.left, "lt") + " h", "part – " + num(t.left, "en") + " h left") + '</span>');
    if (t.help) tg.push('<span class="tag amb">' + T("padeda", "helping") + '</span>');
    if (t.fixed) tg.push('<span class="tag">' + T("priskirta", "assigned") + '</span>');
    if (o.priority === "rush") tg.push('<span class="tag red">' + T("skubus", "rush") + '</span>'); else if (o.priority === "high") tg.push('<span class="tag amb">' + T("svarbus", "high") + '</span>');
    if (o.due && late > 0) tg.push('<span class="tag red">' + T("vėluoja " + late + " d.d.", late + " work days late") + '</span>');
    else if (o.due) tg.push('<span class="tag">' + T("terminas " + md(o.due), "due " + md(o.due)) + '</span>');
    if (t.src === "norm") tg.push('<span class="tag" title="Pagal Našumo normas / From the Našumas norms">' + T("pagal normas", "by norms") + '</span>');
    else if (t.src === "hist") tg.push('<span class="tag" title="Tipinė trukmė iš cecho plano / Typical time from the floor plan">' + T("pagal patirtį", "by experience") + '</span>');
    else if (t.src === "manual") tg.push('<span class="tag">' + T("jūsų trukmė", "your estimate") + '</span>');
    var others = S.M.lanes.filter(function (m) { return m.id !== ln.m.id; });
    var ta = t.inst ? '' : '<div class="ta"><button type="button" data-top="' + esc(o.id) + '" title="Pirmiausia / First">⬆ ' + T("Pirmiausia", "First") + '</button><button type="button" data-skip="' + esc(o.id) + '">' + T("Ne šią dieną", "Not this day") + '</button>' +
      '<select data-to="' + esc(o.id) + '" data-key="' + esc(t.key) + '" aria-label="Kitam žmogui / To someone else"><option value="">' + (LANG === "en" ? "To someone else…" : "Kitam žmogui…") + '</option>' + others.map(function (m) { return '<option value="' + esc(m.id) + '">' + esc(m.name) + '</option>'; }).join("") + '</select>' +
      '<button type="button" data-dur="' + esc(o.id) + '" data-key="' + esc(t.key) + '">' + T("Trukmė…", "Duration…") + '</button></div>';
    return '<div class="task"><div class="tm"><b>' + clock(t.start) + '</b>' + clock(t.end) + '</div><div>' + pj(o) + '<div class="st">' + kn(t.key) + ' · ' + H(t.h) + '</div><div class="tg">' + tg.join("") + '</div></div>' + ta + '</div>';
  }

  /* --- 5. what was done --- */
  function secReview(R) {
    var M = S.M, h = '<section id="s-rev"><h2>' + T("Kas padaryta", "What was done") + ' <em>' + T(esc(dName(R.day, "lt")) + (R.day === M.today ? " (iki " + hm(new Date()) + ")" : ""), esc(dName(R.day, "en")) + (R.day === M.today ? " (until " + hm(new Date()) + ")" : "")) + '</em></h2>';
    h += '<div class="ppl">' + Object.keys(R.people).map(function (k) {
      var p = R.people[k], pr = Object.keys(p.projects).sort(function (a, b) { return p.projects[b] - p.projects[a]; });
      var names = pr.map(function (x) { var o = M.orders.filter(function (q) { return q.num === x; })[0]; return esc(o ? ttl(o) : x) + " · " + num(p.projects[x] / 36e5, LANG === "en" ? "en" : "lt") + " h"; });
      return '<div class="card"><b>' + esc(p.m.name) + '</b><span class="mono">' + T(num(p.ms / 36e5, "lt") + " h cecho plane · " + p.steps + " " + pl(p.steps, "etapas", "etapai", "etapų"), num(p.ms / 36e5, "en") + " h on the floor plan · " + p.steps + " step" + (p.steps === 1 ? "" : "s")) + '</span>' +
        (names.length ? '<div style="font-size:13.5px">' + names.join("<br>") + '</div>' : '<div style="font-size:13.5px;color:var(--faint)">' + T("Cecho plane nepažymėta", "Nothing on the floor plan") + '</div>') +
        (p.noProj >= 18e5 ? '<span class="tag amb">' + T(num(p.noProj / 36e5, "lt") + " h be projekto", num(p.noProj / 36e5, "en") + " h without project") + '</span>' : '') + '</div>';
    }).join("") + '</div>';
    var by = {}; R.done.forEach(function (x) { (by[x.o.id] = by[x.o.id] || { o: x.o, k: [] }).k.push(x.op.key); });
    var rows = Object.keys(by).map(function (k) { return by[k]; });
    var closed = R.actDone.filter(function (a) { var m = String(a.text).match(/on ((?:WO|ENG)-\d+)/); return m && !M.orders.some(function (o) { return o.num === m[1]; }); });
    if (rows.length || closed.length) {
      h += '<table class="tbl"><thead><tr><th>' + T("Projektas", "Project") + '</th><th>' + T("Atlikti etapai", "Steps finished") + '</th></tr></thead><tbody>' + rows.map(function (r) {
        return '<tr><td class="pj"><b>' + esc(ttl(r.o)) + '</b><small>' + esc(r.o.client) + '</small></td><td>' + r.k.map(kn).join(", ") + '</td></tr>';
      }).join("") + closed.map(function (a) { return '<tr><td colspan="2">' + esc(String(a.text).replace(/\*\*/g, "")) + ' <span class="tag grn">' + T("uždaryta", "closed") + '</span></td></tr>'; }).join("") + '</tbody></table>';
    } else h += '<div class="state">' + T("Šią dieną ShopFlow neužbaigtas nė vienas etapas.", "No step was finished in ShopFlow that day.") + '</div>';
    if (R.blocks.length) h += '<div class="card"><b>' + T("Nauji užblokavimai", "New blocks") + '</b>' + R.blocks.map(function (b) { return '<div>' + esc(ttl(b.o)) + ' · ' + kn(b.op.key) + ' – „' + esc(b.op.blockNote) + '“</div>'; }).join("") + '</div>';
    if (R.adherence) {
      var a = R.adherence;
      h += '<div class="card"><b>' + T("Plano įvykdymas: " + a.pct + " % (" + a.ok + " iš " + a.total + ")", "Plan done: " + a.pct + " % (" + a.ok + " of " + a.total + ")") + '</b>' +
        (a.miss.length ? '<div style="font-size:14px">' + T("Nepradėta:", "Not started:") + ' ' + a.miss.map(function (x) { return esc((x.o ? ttl(x.o) : x.t.num) + " · " + P.keyName(x.t.key, LANG === "en" ? "en" : "lt") + " (" + mName(x.t.m) + ")"); }).join("; ") + '</div>' : '') + '</div>';
    } else h += '<p class="sub">' + T("Šiai dienai patvirtinto plano nebuvo – patvirtinus planą, rytoj matysite, kiek jo įvykdyta.", "No plan was confirmed for this day – confirm today's plan to see tomorrow how much of it got done.") + '</p>';
    return h + '</section>';
  }

  /* --- 6. forecast --- */
  function secForecast(M, Pl) {
    var rows = M.orders.map(function (o) { var f = Pl.forecast[o.id]; return { o: o, f: f, rem: P.orderRemainH(o) }; }).filter(function (x) { return x.f.finish !== "done" || x.o.type === "prod"; });
    function rank(x) { return x.f.stuck.length ? 0 : x.f.late > 0 ? 1 : !x.f.finish ? 2 : x.f.finish === "done" ? 4 : 3; }
    rows.sort(function (a, b) { return rank(a) - rank(b) || (b.f.late || 0) - (a.f.late || 0) || String(a.o.due || "9").localeCompare(String(b.o.due || "9")); });
    var h = '<section id="s-fc"><h2>' + T("Prognozė", "Forecast") + ' <em>' + T("kada bus baigta", "when it will be done") + '</em><span class="n">' + rows.length + '</span></h2>' +
      '<p class="sub">' + T("Tas pats planavimas, pratęstas 3 savaitėms į priekį. Montavimas neįskaičiuotas.", "The same planning run 3 weeks ahead. Installation not included.") + '</p>' +
      '<table class="tbl"><thead><tr><th>' + T("Projektas", "Project") + '</th><th class="r">' + T("Terminas", "Due") + '</th><th class="r">' + T("Bus baigta", "Done by") + '</th><th class="r hide-s">' + T("Liko", "Left") + '</th><th>' + T("Būsena", "Status") + '</th></tr></thead><tbody>';
    rows.forEach(function (x) {
      var f = x.f, st;
      if (f.finish === "done") st = '<span class="tag grn">' + T("pagaminta", "made") + '</span>';
      else if (f.stuck.length) st = '<span class="tag red">' + T("stovi: ", "stuck: ") + f.stuck.map(function (s) { return s.cat === "block" ? T("užblokuota", "blocked") : cn(s.cat); }).join(", ") + '</span>';
      else if (!f.finish) st = '<span class="tag amb">' + T("> 3 sav.", "> 3 weeks") + '</span>';
      else if (f.late > 0) st = '<span class="tag red">' + T("vėluos " + f.late + " d.d.", f.late + " work days late") + '</span>';
      else st = '<span class="tag grn">' + T("laiku" + (f.late < 0 ? " (rezervas " + (-f.late) + " d.d.)" : ""), "on time" + (f.late < 0 ? " (" + (-f.late) + " days spare)" : "")) + '</span>';
      h += '<tr><td class="pj"><b>' + esc(ttl(x.o)) + '</b><small>' + esc(x.o.client) + (x.o.type === "eng" ? " · " + (LANG === "en" ? "engineering" : "projektavimas") : "") + '</small></td><td class="r">' + esc(md(x.o.due)) + '</td><td class="r">' + (f.finish && f.finish !== "done" ? esc(md(f.finish)) : "–") + '</td><td class="r hide-s">' + (x.rem ? H(x.rem) : "–") + '</td><td>' + st + '</td></tr>';
    });
    return h + '</tbody></table></section>';
  }

  /* ---------------- interaction ---------------- */
  function wire() {
    var f = document.getElementById("tform"), tin = document.getElementById("tin");
    if (f) f.onsubmit = function (e) { e.preventDefault(); submit(tin.value); };
    if (tin) tin.onkeydown = function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { e.preventDefault(); submit(tin.value); } };
    var ask = document.getElementById("task"); if (ask) ask.onclick = function () { askAgent(tin.value); };
    document.querySelectorAll("[data-ex]").forEach(function (b) { b.onclick = function () { tin.value = b.dataset.ex; tin.focus(); }; });
    document.querySelectorAll("[data-rm]").forEach(function (b) { b.onclick = function () { removeAdj(b.dataset.rm).then(function () { toast("Pašalinta / Removed"); }); }; });
    var day = S.day0;
    on("[data-arr]", function (b) {
      var o = b.dataset.arr, det = b.dataset.det, adjId = b.dataset.adj;
      if (adjId && adjId.indexOf("apz-") === 0) return addAdj([{ k: "arrived", o: o, cat: b.dataset.cat }], null);
      if (adjId) return saveDoc(function (d) { d.adj.forEach(function (a) { if (a.id === adjId) a.off = Date.now(); }); }).then(compute);
      return addAdj([{ k: "arrived", o: o, cat: det ? "id:" + det : b.dataset.cat }], null);
    });
    on("[data-unb]", function (b) { return addAdj([{ k: "unblock", o: b.dataset.unb }], null); });
    on("[data-hold]", function (b) {
      return pickDate(T("Atidėti iki (imtinai)", "Hold until (inclusive)"), P.nextWorkday(day, S.M.shift, 4)).then(function (d) { if (d) return addAdj([{ k: "hold", o: b.dataset.hold, until: d }], null); });
    });
    on("[data-eta]", function (b) {
      return pickDate(T("Kada atvyks?", "When will it arrive?"), P.nextWorkday(S.M.today, S.M.shift, 2)).then(function (d) {
        if (!d) return;
        var det = b.dataset.det;
        if (det) return addAdj([{ k: "arrived", o: b.dataset.eta, cat: "id:" + det, hidden: true }, { k: "missing", o: b.dataset.eta, cat: b.dataset.cat, label: b.dataset.lbl, until: d }], null);
        return addAdj([{ k: "missing", o: b.dataset.eta, cat: b.dataset.cat, label: b.dataset.lbl, until: d }], null);
      });
    });
    on("[data-inst]", function (b) { return pickInstall(b.dataset.inst); });
    on("[data-top]", function (b) { return addAdj([{ k: "prio", o: b.dataset.top, level: "top" }], null); });
    on("[data-skip]", function (b) { return addAdj([{ k: "hold", o: b.dataset.skip, until: day, day: day }], null); });
    on("[data-off]", function (b) { return addAdj([{ k: "absent", m: b.dataset.off, day: day, to: day }], null); });
    on("[data-on]", function (b) {
      var id = b.dataset.on, mine = S.doc.adj.filter(function (a) { return !a.off && a.m === id && (a.k === "absent" || a.k === "avail") && a.day <= day && (a.to || a.day) >= day; });
      if (mine.length) return saveDoc(function (d) { d.adj.forEach(function (a) { if (mine.some(function (x) { return x.id === a.id; })) a.off = Date.now(); }); }).then(compute);
      return addAdj([{ k: "avail", m: id, day: day, to: day, h: S.M.shiftMin / 60 }], null);   /* overrides leave from Prašymai */
    });
    on("[data-hrs]", function (b) { return pickNum(T("Kiek valandų dirbs?", "How many hours will they work?"), 4).then(function (h) { if (h != null) return addAdj([{ k: "avail", m: b.dataset.hrs, day: day, to: day, h: h }], null); }); });
    on("[data-dur]", function (b) { return pickNum(T("Kiek valandų liko šiam etapui?", "How many hours are left for this step?"), 4).then(function (h) { if (h != null) return addAdj([{ k: "hours", o: b.dataset.dur, key: b.dataset.key, h: h }], null); }); });
    document.querySelectorAll("[data-to]").forEach(function (s) { s.onchange = function () { if (s.value) addAdj([{ k: "assign", o: s.dataset.to, m: s.value, key: s.dataset.key }], null).then(function () { toast("Perskaičiuota / Replanned"); }); }; });
  }
  function on(sel, fn) { document.querySelectorAll(sel).forEach(function (b) { b.onclick = function () { b.disabled = true; Promise.resolve(fn(b)).then(function () { toast("Perskaičiuota / Replanned"); }, function (e) { b.disabled = false; toast("Nepavyko / Failed"); console.error(e); }); }; }); }

  function ctx() { return { today: S.M.today, planDay: S.day0, orders: S.M.orders, members: S.M.members, shiftMin: S.M.shiftMin, shift: S.M.shift }; }
  function submit(text) {
    text = String(text || "").trim(); if (!text) return;
    var list = P.parse(text, ctx()), understood = list.filter(function (a) { return a.k !== "note"; });
    var btn = document.getElementById("tsend"); if (btn) btn.disabled = true;
    var go = understood.length || !aiOn() ? Promise.resolve(list) : aiParse(text).then(function (ai) { return ai && ai.length ? ai : list; }, function () { return list; });
    return go.then(function (adj) {
      var u = adj.filter(function (a) { return a.k !== "note"; });
      S.reply = { html: u.length ? T("Supratau:", "Got it:") + " " + adj.map(describe).join(" · ") : T("Neatpažinau komandos – išsaugojau kaip pastabą." + (aiOn() ? "" : " (AI agentas neprijungtas – ⚙ nustatymuose.)"), "Didn't recognise a command – saved as a note." + (aiOn() ? "" : " (AI agent not connected – see ⚙ settings.)")) };
      adj.forEach(function (a) { if (a.k === "note") a.day = S.day0; });
      return addAdj(adj, text);
    }).then(function () { var t = document.getElementById("tin"); if (t) t.value = ""; toast("Perskaičiuota / Replanned"); }, function (e) { console.error(e); S.reply = { err: true, html: T("Nepavyko išsaugoti.", "Could not save.") }; render(); });
  }

  /* ---------------- AI agent (optional, via the planas-ai server function) ---------------- */
  function aiOn() { return !!(S.ai && (S.ai.has.claude || S.ai.has.gemini)); }
  function fn(body) {
    return W.token().then(function (tok) {
      return fetch(W.cfg.url + "/functions/v1/planas-ai", { method: "POST", headers: W.headers(tok), body: JSON.stringify(body) });
    }).then(function (r) { return r.json().then(function (d) { if (!r.ok) { var e = new Error((d && (d.error && d.error.message || d.error)) || ("HTTP " + r.status)); throw e; } return d; }); });
  }
  function aiMe() { return fn({ op: "me" }).then(function (d) { S.ai = d; }, function () { S.ai = null; }); }
  function lists() {
    var M = S.M;
    return "PEOPLE (id: name, role):\n" + M.members.map(function (m) { return m.id + ": " + m.name + " (" + (m.role || "") + ")"; }).join("\n") +
      "\n\nPROJECTS (id: number · name · client · type · due):\n" + M.orders.map(function (o) { return o.id + ": " + ttl(o) + " · " + o.client + " · " + o.type + " · " + (o.due || "-"); }).join("\n");
  }
  function aiParse(text) {
    var sys = "You turn a furniture workshop manager's comment (Lithuanian or English) into planning adjustments. Reply with JSON only: {\"adjustments\":[...]}. " +
      "Kinds: absent{m,day,to} · avail{m,day,to,h} · arrived{o,cat} · missing{o,cat,label,until} · prio{o,level:'top'|'down'} · hold{o,until} · unblock{o} · assign{o,m,key} · hours{o,key,h} · install{o,day,ms:[member ids]} · note{text}. " +
      "m = person id, o = project id from the lists. cat one of: material, fronts, hardware, lighting, handles, worktop, sink, appliances, other. key one of: cut, edge, drill, asm, fin, qc, pack, inst, sketch, draw, cam. " +
      "Dates YYYY-MM-DD; only working days. If nothing fits, return one note. Never invent ids.";
    var prompt = "Today: " + S.M.today + ". Plan day (\"tomorrow\"): " + S.day0 + ".\n\n" + lists() + "\n\nCOMMENT:\n" + text;
    return fn({ op: "ask", system: sys, prompt: prompt, json: true, max: 800 }).then(function (d) {
      var t = String(d.text || "").replace(/^```(?:json)?|```$/g, "").trim(), j = JSON.parse(t.slice(t.indexOf("{"), t.lastIndexOf("}") + 1));
      var M = S.M, ok = [];
      (j.adjustments || []).forEach(function (a) {
        if (!a || !KIND[a.k]) return;
        if (a.o && !M.orders.some(function (o) { return o.id === a.o; })) return;
        if (a.m && !M.mById[a.m]) return;
        if (a.ms) a.ms = a.ms.filter(function (x) { return M.mById[x]; });
        if ((a.k === "absent" || a.k === "avail" || a.k === "install") && !a.day) a.day = S.day0;
        if ((a.k === "absent" || a.k === "avail") && !a.to) a.to = a.day;
        if (a.k === "install" && !a.m && a.ms && a.ms.length) a.m = a.ms[0];
        a.id = P.uid(); a.at = Date.now(); a.src = text; a.ai = true; ok.push(a);
      });
      return ok;
    });
  }
  function summaryText(lang) {
    var M = S.M, D = S.plan.days[0], L = lang === "en", out = [];
    out.push((L ? "PLAN " : "PLANAS ") + dName(D.day, lang));
    D.lanes.forEach(function (ln) {
      out.push("");
      out.push(ln.m.name + (ln.cap <= 0 ? (L ? " — off" : " — nedirba") : " — " + num(ln.t / 60, lang) + " / " + num(ln.cap / 60, lang) + " h"));
      ln.tasks.forEach(function (t) { out.push("  " + clock(t.start) + "–" + clock(t.end) + "  " + ttl(t.o) + " · " + P.keyName(t.key, lang) + " · " + num(t.h, lang) + " h" + (t.partial ? (L ? " (part)" : " (dalis)") : "") + (t.help ? (L ? " (helping)" : " (padeda)") : "")); });
    });
    return out.join("\n");
  }
  function contextText() {
    var M = S.M, A = S.A, Pl = S.plan, out = [summaryText("en"), "", "BLOCKERS / OFFICE ACTIONS:"];
    A.actions.forEach(function (a) {
      if (a.kind === "missing") out.push("- missing " + a.g.cat + " for " + ttlC(a.o) + (a.g.label ? " (" + a.g.label + ")" : "") + ", needed " + (a.needBy || "later") + ", state " + a.g.state + (a.g.due ? " eta " + a.g.due : ""));
      else if (a.kind === "blocked") out.push("- blocked " + ttlC(a.o) + " at " + a.op.station + ": " + a.op.blockNote);
      else out.push("- " + a.kind + " " + ttlC(a.o));
    });
    out.push("", "FORECAST (project: due → projected finish, late work days, stuck):");
    M.orders.forEach(function (o) { var f = Pl.forecast[o.id]; out.push("- " + ttlC(o) + ": " + (o.due || "-") + " → " + (f.finish || "none in 3 weeks") + (f.late != null ? ", late " + f.late : "") + (f.stuck.length ? ", stuck: " + f.stuck.map(function (s) { return s.cat; }).join("/") : "") + ", " + P.r1(P.orderRemainH(o)) + " h left"); });
    out.push("", "INSIGHTS: " + JSON.stringify(A.insights.map(function (i) { return { k: i.k, key: i.key, h: i.h && P.r1(i.h), n: i.n, m: i.m && i.m.name, pct: i.pct }; })));
    var R = S.R; out.push("", "LAST DAY " + R.day + ": steps finished " + R.done.map(function (x) { return x.o.num + " " + x.op.station; }).join(", "));
    Object.keys(R.people).forEach(function (k) { var p = R.people[k]; out.push("- " + p.m.name + ": " + P.r1(p.ms / 36e5) + " h on floor plan, " + P.r1(p.noProj / 36e5) + " h without project"); });
    var notes = S.doc.adj.filter(function (a) { return !a.off; }).map(function (a) { return "- " + a.k + ": " + (a.src || a.text || ""); });
    if (notes.length) out.push("", "MANAGER COMMENTS IN EFFECT:", notes.slice(-30).join("\n"));
    return out.join("\n");
  }
  function askAgent(q) {
    q = String(q || "").trim();
    if (!q) q = LANG === "en" ? "What are the three most important things I should do today so production runs smoothly tomorrow?" : "Kokie trys svarbiausi dalykai, kuriuos turiu padaryti šiandien, kad rytoj gamyba vyktų sklandžiai?";
    if (!aiOn()) { S.reply = { err: true, html: T("AI agentas dar neprijungtas. ⚙ nustatymuose įrašykite Claude arba Gemini raktą (tą patį, kaip Reklamos Studijoje).", "The AI agent is not connected yet. Add a Claude or Gemini key in ⚙ settings (the same as in Reklamos Studija).") }; render(); return; }
    S.reply = { html: '<span class="spin"></span> ' + T("Agentas galvoja…", "The agent is thinking…") }; render();
    var sys = "You are the daily production-planning agent of Dėdės Baldai, a small bespoke furniture workshop in Lithuania. You get the computed plan, blockers, forecast and yesterday's results. " +
      "Answer the manager briefly and concretely (max ~150 words), in the language of the question (Lithuanian or English). Always name projects as 'NUMBER · name' exactly as given. Think like an experienced production manager: protect the bottleneck, finish started work, get missing items ordered before they stop work, keep people busy. Do not invent facts that are not in the data.";
    fn({ op: "ask", system: sys, prompt: "DATA (today " + S.M.today + "):\n" + contextText() + "\n\nQUESTION:\n" + q, max: 900 }).then(function (d) {
      S.reply = { html: esc(d.text || "").replace(/\*\*(.+?)\*\*/g, "<b>$1</b>") + '<div class="mono" style="margin-top:6px">' + esc(d.provider + " · " + d.model) + '</div>' }; render();
      var t = document.getElementById("tin"); if (t) t.value = "";
    }, function (e) { S.reply = { err: true, html: esc(T("Agentas neatsakė: ", "The agent did not answer: ")) + esc(e.message) }; render(); });
  }

  /* ---------------- small dialogs ---------------- */
  var dlg = document.getElementById("dlg");
  function dialog(html, read) {
    return new Promise(function (res) {
      dlg.innerHTML = '<form method="dialog">' + html + '<div class="row"><button type="button" class="btn" value="x">' + T("Atšaukti", "Cancel") + '</button><button class="btn pri" value="ok">OK</button></div></form>';
      var f = dlg.querySelector("form");
      f.querySelector('[value="x"]').onclick = function () { dlg.close(); res(null); };
      f.onsubmit = function (e) { e.preventDefault(); var v = read(f); dlg.close(); res(v); };
      dlg.showModal(); var i = f.querySelector("input,select"); if (i) i.focus();
    });
  }
  function pickDate(title, def) { return dialog('<h3>' + title + '</h3><label><input type="date" name="d" value="' + def + '" required></label>', function (f) { return f.elements.d.value || null; }); }
  function pickNum(title, def) { return dialog('<h3>' + title + '</h3><label><input type="number" name="n" min="0" max="12" step="0.5" value="' + def + '" required></label>', function (f) { var v = parseFloat(f.elements.n.value); return isNaN(v) ? null : v; }); }
  function pickInstall(oid) {
    var o = oById(oid);
    return dialog('<h3>' + T("Montavimas", "Installation") + ': ' + esc(ttl(o)) + '</h3><label>' + T("Diena", "Day") + '<input type="date" name="d" value="' + S.day0 + '" required></label><div class="checks">' +
      S.M.lanes.filter(function (m) { return m.role === "worker"; }).map(function (m) { return '<label><input type="checkbox" name="m" value="' + esc(m.id) + '"> ' + esc(m.name) + '</label>'; }).join("") + '</div>',
      function (f) { var ms = [].slice.call(f.querySelectorAll("[name=m]:checked")).map(function (x) { return x.value; }); return { d: f.elements.d.value, ms: ms }; })
      .then(function (v) { if (v && v.d) return addAdj([{ k: "install", o: oid, day: v.d, ms: v.ms, m: v.ms[0] || null }], null); });
  }
  function settings() {
    var c = S.doc.cfg || {}, has = S.ai && S.ai.has || {};
    dialog('<h3>' + T("Nustatymai", "Settings") + '</h3>' +
      '<label>' + T("Kiek pamainos planuoti (%) – likusi dalis rezervui: trukdžiams, pagalbai, tvarkymui", "Share of the shift to plan (%) – the rest is buffer for interruptions, help, tidying") + '<input type="number" name="f" min="50" max="100" step="5" value="' + Math.round((+c.factor || 0.85) * 100) + '"></label>' +
      '<label>Claude API ' + T("raktas", "key") + (has.claude ? ' <span class="tag grn">' + T("įrašytas", "saved") + '</span>' : '') + '<input type="password" name="claude" autocomplete="off" placeholder="' + (has.claude ? "••••••  (" + (LANG === "en" ? "leave empty to keep" : "palikite tuščią – liks") + ")" : "sk-ant-…") + '"></label>' +
      '<label>Gemini API ' + T("raktas", "key") + (has.gemini ? ' <span class="tag grn">' + T("įrašytas", "saved") + '</span>' : '') + '<input type="password" name="gemini" autocomplete="off" placeholder="' + (has.gemini ? "••••••" : "AIza…") + '"></label>' +
      '<p class="sub" style="margin:0 0 6px">' + T("Raktai saugomi serveryje (tie patys kaip Reklamos Studijoje) ir į naršyklę negrįžta. Be rakto agentas supranta pagrindines komandas, bet neatsako į klausimus.", "Keys are stored on the server (shared with Reklamos Studija) and never come back to the browser. Without a key the agent understands the basic commands but cannot answer questions.") + '</p>',
      function (f) { return { f: +f.elements.f.value, claude: f.elements.claude.value.trim(), gemini: f.elements.gemini.value.trim() }; })
      .then(function (v) {
        if (!v) return;
        var jobs = [];
        if (v.f >= 50 && v.f <= 100) jobs.push(saveDoc(function (d) { d.cfg.factor = v.f / 100; }));
        if (v.claude) jobs.push(fn({ op: "setkey", name: "claude", value: v.claude }));
        if (v.gemini) jobs.push(fn({ op: "setkey", name: "gemini", value: v.gemini }));
        return Promise.all(jobs).then(aiMe).then(function () { compute(); toast("Išsaugota / Saved"); }, function (e) { toast("Nepavyko / Failed: " + e.message); });
      });
  }
  function toast(t) { var el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(function () { el.classList.remove("on"); }, 2200); }

  /* ---------------- confirm, copy, send ---------------- */
  function confirmPlan() {
    var D = S.plan.days[0], tasks = [];
    D.lanes.forEach(function (ln) { ln.tasks.forEach(function (t) { tasks.push({ o: t.o.id, num: t.o.num, name: t.o.product, op: t.op ? t.op.id : null, key: t.key, m: ln.m.id, h: Math.round(t.h * 100) / 100 }); }); });
    var sendable = D.lanes.filter(function (ln) { return ln.tasks.length && ln.cap > 0; });
    return dialog('<h3>' + T("Patvirtinti planą: " + esc(dName(D.day, "lt")), "Confirm the plan for " + esc(dName(D.day, "en"))) + '</h3><p class="sub" style="margin:0 0 10px">' +
      T("Planas bus išsaugotas – kitą dieną matysite, kiek jo įvykdyta.", "The plan is saved – the next day you will see how much of it got done.") + '</p>' +
      '<div class="checks"><label><input type="checkbox" name="send" checked> ' + T("Išsiųsti kiekvienam jo darbų sąrašą pranešimu (ShopFlow / telefonas)", "Send each person their list as a notice (ShopFlow / phone)") + '</label></div>' +
      '<p class="mono" style="margin:8px 0 0">' + esc(sendable.map(function (l) { return l.m.name + " (" + l.tasks.length + ")"; }).join(", ")) + '</p>',
      function (f) { return { send: f.elements.send.checked }; }).then(function (v) {
        if (!v) return;
        var by = ME ? ME.display_name : "";
        return saveDoc(function (d) { d.plans[D.day] = { at: Date.now(), by: by, tasks: tasks }; }).then(function () {
          if (!v.send) return;
          var at = new Date(P.toDate(D.day).getTime() + (mins((S.M.shift || {}).start || "08:00") - 30) * 6e4);
          if (at < new Date()) at = new Date();
          var rows = sendable.map(function (ln) {
            var lt = ln.tasks.map(function (t) { return clock(t.start) + "–" + clock(t.end) + "  " + ttl(t.o) + " · " + P.keyName(t.key, "lt") + " (" + num(t.h, "lt") + " h)" + (t.partial ? " – dalis" : ""); }).join("\n");
            return { kind: "notice", title: "Darbų planas " + md(D.day) + " (" + WD.lt[P.toDate(D.day).getDay()] + "): " + ln.tasks.length + " " + pl(ln.tasks.length, "darbas", "darbai", "darbų"), body: lt.slice(0, 3900), from_name: by,
              audience: "member", target_member: ln.m.id, target_name: ln.m.name, deliver_at: at.toISOString(), url: "/shopflow-app/", source_key: "planas:" + D.day + ":" + ln.m.id + ":" + Date.now() };
          });
          return W.rest("notices", { method: "POST", body: JSON.stringify(rows), headers: { Prefer: "return=minimal" } }).then(function () {
            W.token().then(function (t) { if (t) fetch(W.cfg.url + "/functions/v1/notices-dispatch", { method: "POST", headers: W.headers(t), body: "{}" }).catch(function () {}); });
          });
        }).then(function () { compute(); toast(v.send ? "Patvirtinta ir išsiųsta / Confirmed and sent" : "Patvirtinta / Confirmed"); }, function (e) { console.error(e); toast("Nepavyko / Failed"); });
      });
  }
  function plainAll() {
    var langs = LANG === "both" ? ["lt", "en"] : [LANG], out = [];
    langs.forEach(function (lg) {
      out.push(summaryText(lg));
      var acts = S.A.actions.filter(function (a) { return a.urgent; });
      if (acts.length) {
        out.push("", lg === "en" ? "NEEDED SOON:" : "REIKIA NETRUKUS:");
        acts.forEach(function (a) {
          if (a.kind === "missing") out.push("• " + P.catName(a.g.cat, lg) + " – " + ttlC(a.o) + (a.g.label ? " (" + a.g.label + ")" : "") + ", " + (lg === "en" ? "needed " : "reikės ") + dWhen(a.needBy, lg));
          else if (a.kind === "blocked") out.push("• " + ttlC(a.o) + " – " + (lg === "en" ? "blocked: " : "užblokuota: ") + a.op.blockNote);
          else if (a.kind === "install") out.push("• " + ttlC(a.o) + " – " + (lg === "en" ? "ready to install" : "paruošta montavimui"));
        });
      }
      out.push("");
    });
    return out.join("\n").trim();
  }

  /* ---------------- boot ---------------- */
  function setLang(l) { LANG = l; document.body.classList.remove("both", "lang-lt", "lang-en"); document.body.classList.add(l === "both" ? "both" : "lang-" + l);
    document.querySelectorAll("[data-lang]").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === l)); }); try { localStorage.setItem("planas.lang", l); } catch (e) {} }
  setLang(LANG);
  document.querySelector(".seg").addEventListener("click", function (e) { var b = e.target.closest("[data-lang]"); if (b) { setLang(b.dataset.lang); if (S.M) render(); } });
  document.getElementById("dPrev").onclick = function () { if (!S.M) return; var d = P.prevWorkday(S.day0, S.M.shift); if (d < S.M.today) return toast("Planuoti galima nuo šiandien / Plans start today"); S.day0 = d; S.pinned = true; S.reply = null; compute(); };
  document.getElementById("dNext").onclick = function () { if (!S.M) return; S.day0 = P.nextWorkday(S.day0, S.M.shift, 1); S.pinned = true; S.reply = null; compute(); };
  document.getElementById("print").onclick = function () { window.print(); };
  document.getElementById("cfgB").onclick = settings;
  document.getElementById("confirm").onclick = function () { if (S.M) confirmPlan(); };
  document.getElementById("copy").onclick = function () {
    if (!S.M) return; var txt = plainAll();
    try { navigator.clipboard.writeText(txt).then(function () { toast("Nukopijuota / Copied"); }, fb); } catch (e) { fb(); }
    function fb() { var ta = document.createElement("textarea"); ta.value = txt; ta.style.position = "fixed"; ta.style.left = "-9999px"; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); toast("Nukopijuota / Copied"); } catch (e) {} ta.remove(); }
  };
  W.requireArea("planas", { title: "Dienos planas" }).then(function (me) {
    ME = me;
    load().then(aiMe).then(function () { if (S.M) render(); });
    setInterval(function () { if (!document.hidden && !dlg.open && !(document.activeElement && document.activeElement.id === "tin" && document.activeElement.value)) load(true); }, 120000);
  });
})();
