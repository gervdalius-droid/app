/* ============================================================
   Našumas — results by norms. One calculation shared by the managers'
   page (/hub/nasumas/) and the plan's "Dienos šaunuolis".

   What it joins:
     • ShopFlow orders that have a report list (parts with sizes and edges)
       and their steps (done / not done, who is assigned, timer)
     • the norms: how much one person makes in a working day at each step
     • the plan's work stretches: who was where, on which project, how long

   A finished step is worth its normed hours (quantity ÷ norm × day).
   They go to the people who marked time on that project at a matching
   place, split by their time; with no marked time they go to the person
   assigned to the step in ShopFlow, then to the default person
   (Startech → Donatas, Volter → Nerijus unless changed).
   Performance = normed hours ÷ hours actually marked on those steps.
   Plain ES5 — it also runs on the TV box and the older tablets.
   ============================================================ */
(function (root) {
  "use strict";
  var DEF = {
    dayHours: 8, hourCost: 12.5, minShoutH: 2,
    ops: {
      pjov: { lt: "Pjovimas", en: "Cutting", unit: "m²", perDay: 92, sale: 3.6 },
      briaun: { lt: "Briaunavimas", en: "Edge banding", unit: "m", perDay: 333.33, sale: 1 },
      grez: { lt: "Gręžimas", en: "Drilling", unit: "m²", perDay: 100, sale: 2 },
      sur: { lt: "Surinkimas", en: "Assembly", unit: "m²", perDay: 20, sale: 10 }
    },
    /* who gets a step when nobody marked time and ShopFlow has no one assigned */
    def: { pjov: "Nerijus", briaun: "", grez: "Donatas", sur: "" }
  };
  var ORDER = ["pjov", "briaun", "grez", "sur"];
  var CAT_RE = { pjov: /pjov|piov|cut|saw/i, briaun: /briaun|edge|band/i, grez: /gr[eęė][zž]|drill|cnc/i, sur: /surink|assem/i };
  /* which steps a place on the plan can do */
  var PLACE = { altendorf: ["pjov"], felder: ["pjov"], olimpic: ["briaun"], startech: ["grez"], vitap: ["grez"], blum: ["grez"], volter: ["pjov"] };
  function norm(v) { return String(v == null ? "" : v).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function isObj(x) { return !!x && typeof x === "object" && !Array.isArray(x); }
  function cfgOf(saved) {
    var c = JSON.parse(JSON.stringify(DEF)), s = isObj(saved) ? saved : {};
    if (+s.dayHours > 0) c.dayHours = +s.dayHours;
    if (+s.hourCost >= 0 && s.hourCost != null) c.hourCost = +s.hourCost;
    ORDER.forEach(function (k) {
      var o = isObj(s.ops) && isObj(s.ops[k]) ? s.ops[k] : {};
      if (+o.perDay > 0) c.ops[k].perDay = +o.perDay;
      if (o.sale != null && +o.sale >= 0) c.ops[k].sale = +o.sale;
      if (isObj(s.def) && typeof s.def[k] === "string") c.def[k] = s.def[k];
    });
    return c;
  }
  function catOfStation(name) { for (var i = 0; i < ORDER.length; i++) if (CAT_RE[ORDER[i]].test(String(name || ""))) return ORDER[i]; return null; }
  function placeCats(it) {
    if (!it) return [];
    if (it.t === "desk") return /[sš]lif|apdirb|apdail|da[zž]y/i.test(String(it.n || "")) ? [] : ["sur"];
    return PLACE[it.t] || [];
  }
  function isTop(p) { return /stalvir/i.test(norm(p.name) + " " + norm(p.board)); }
  function isBack(p) { return /plaus|hdf|\b3 ?mm/i.test(norm(p.board)); }
  function edgeOn(e, i) { return Array.isArray(e) ? !!String(e[i] == null ? "" : e[i]).trim() : false; }
  /* one part's quantities, all pieces */
  function partQty(p) {
    var l = +p.l || 0, w = +p.w || 0, q = Math.max(1, +p.qty || 1), a = l * w * q / 1e6, e = p.edges;
    var m = ((edgeOn(e, 0) ? l : 0) + (edgeOn(e, 1) ? l : 0) + (edgeOn(e, 2) ? w : 0) + (edgeOn(e, 3) ? w : 0)) * q / 1000;
    return { pjov: a, briaun: m, grez: isTop(p) || isBack(p) ? 0 : a, sur: isTop(p) ? 0 : a };
  }
  function sumQty(parts, cat) { var s = 0; for (var i = 0; i < parts.length; i++) s += partQty(parts[i])[cat]; return s; }
  function stdH(cfg, cat, qty) { var o = cfg.ops[cat]; return o && o.perDay > 0 ? qty / o.perDay * cfg.dayHours : 0; }
  function label(o) { return [o.num, o.product].filter(Boolean).join(" · "); }
  function prMatches(pr, o) {
    var p = norm(pr); if (!p) return false;
    var num = norm(o.num), prod = norm(o.product);
    return p === norm(label(o)) || (num && (p === num || p.indexOf(num + " ") === 0)) || (prod && p === prod);
  }
  /* time between a and b with the breaks taken out */
  function netMs(a, b, breaks) {
    if (!(b > a)) return 0; var ms = b - a;
    var mm = function (v) { var x = String(v || "").split(":"); return (+x[0] || 0) * 60 + (+x[1] || 0); };
    var d = new Date(a); d.setHours(0, 0, 0, 0);
    for (; d.getTime() < b; d.setDate(d.getDate() + 1)) {
      var d0 = d.getTime();
      for (var i = 0; i < (breaks || []).length; i++) { var k = breaks[i]; if (!k || !k.f || !k.t) continue; var s0 = d0 + mm(k.f) * 6e4, s1 = d0 + mm(k.t) * 6e4; ms -= Math.max(0, Math.min(b, s1) - Math.max(a, s0)); }
    }
    return Math.max(0, ms);
  }
  function dayOf(ms) { var d = new Date(ms), p = function (x) { return (x < 10 ? "0" : "") + x; }; return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()); }
  function endOfDay(ms) { var d = new Date(ms); d.setHours(23, 59, 59, 999); return d.getTime(); }

  /* ---- the steps of every order that has a report list, grouped per order and step kind ---- */
  function groups(orders, stations, cfg) {
    var stName = {}; (stations || []).forEach(function (s) { if (s && s.id) stName[s.id] = s.name || s.id; });
    var out = [];
    (orders || []).forEach(function (o) {
      if (!o || o.type === "eng" || !Array.isArray(o.parts) || !o.parts.length) return;
      var by = {};
      (o.ops || []).forEach(function (op) {
        if (!op) return; var cat = catOfStation(stName[op.stationId] || op.stationId); if (!cat) return;
        var own = o.parts.filter(function (p) { return p && p.itemId === op.itemId; });
        var parts = own.length ? own : (cat === "sur" ? o.parts : []);
        var qty = sumQty(parts, cat); if (!(qty > 0)) return;
        var g = by[cat] = by[cat] || { order: o, label: label(o), cat: cat, ops: [], qty: 0, stdH: 0, doneQty: 0, doneH: 0, at: 0, allDone: true };
        var h = stdH(cfg, cat, qty), done = op.status === "done";
        g.ops.push({ qty: qty, stdH: h, done: done, at: +op.completedAt || 0, who: (Array.isArray(op.assigneeIds) && op.assigneeIds.length ? op.assigneeIds : (op.assigneeId ? [op.assigneeId] : [])), logged: +op.loggedMs || 0 });
        g.qty += qty; g.stdH += h;
        if (done) { g.doneQty += qty; g.doneH += h; g.at = Math.max(g.at, +op.completedAt || 0); } else g.allDone = false;
      });
      ORDER.forEach(function (c) { if (by[c]) out.push(by[c]); });
    });
    return out;
  }

  /* ---- everything: opts = {orders, stations, members, sessions, items, breaks, cfg, from, to} ---- */
  function compute(opts) {
    var cfg = opts.cfg || cfgOf(null), breaks = opts.breaks || [], items = opts.items || {}, from = opts.from, to = opts.to;
    var memName = {}; (opts.members || []).forEach(function (m) { if (m && m.id) memName[m.id] = m.name || ""; });
    var sess = (opts.sessions || []).filter(function (x) { return x && !x.del && +x.b > +x.a && x.n; }).map(function (x) {
      return { n: String(x.n), s: x.s, sn: x.sn || "", pr: x.pr || "", a: +x.a, b: +x.b, ms: netMs(+x.a, +x.b, breaks), cats: placeCats(items[x.s]) };
    });
    var G = groups(opts.orders, opts.stations, cfg), credits = [], jobs = [];
    G.forEach(function (g) {
      var job = { label: g.label, cat: g.cat, qty: g.qty, stdH: g.stdH, doneQty: g.doneQty, doneH: g.doneH, allDone: g.allDone, at: g.at, actualMs: 0, people: [], measured: false, started: false };
      var lim = g.allDone && g.at ? endOfDay(g.at) : Infinity;
      var mine = sess.filter(function (x) { return x.cats.indexOf(g.cat) >= 0 && prMatches(x.pr, g.order) && x.a <= lim; });
      var tot = 0; mine.forEach(function (x) { tot += x.ms; });
      job.started = tot > 0 || g.doneH > 0; job.actualMs = tot;
      if (g.doneH > 0 && tot >= 6e5) {
        job.measured = true;
        mine.forEach(function (x) {
          var f = x.ms / tot;
          credits.push({ n: x.n, t: x.a, cat: g.cat, label: g.label, h: g.doneH * f, qty: g.doneQty * f, ms: x.ms, measured: true, open: !g.allDone });
          if (job.people.indexOf(x.n) < 0) job.people.push(x.n);
        });
      } else if (g.doneH > 0) {
        g.ops.forEach(function (op) {
          if (!op.done) return;
          var who = op.who.map(function (id) { return memName[id]; }).filter(Boolean);
          if (!who.length && cfg.def[g.cat]) who = [cfg.def[g.cat]];
          if (!who.length) return;
          var timed = op.logged >= 3e5;
          who.forEach(function (n) {
            credits.push({ n: n, t: op.at || g.at, cat: g.cat, label: g.label, h: op.stdH / who.length, qty: op.qty / who.length, ms: timed ? op.logged / who.length : 0, measured: timed, open: !g.allDone });
            if (job.people.indexOf(n) < 0) job.people.push(n);
          });
          if (timed) { job.actualMs += op.logged; job.measured = true; }
        });
      }
      job.eff = job.measured && job.actualMs > 0 ? job.doneH / (job.actualMs / 36e5) : null;
      jobs.push(job);
    });
    /* per person, inside the period */
    var P = {};
    function person(n) { var k = norm(n); return P[k] = P[k] || { n: n, presentMs: 0, normedMs: 0, earnedH: 0, measuredH: 0, looseH: 0, value: 0, byOp: {}, days: {} }; }
    (opts.members || []).forEach(function (m) { if (m && m.name && (m.role === "worker" || !m.role)) person(m.name); });
    sess.forEach(function (x) {
      var a = Math.max(x.a, from), b = Math.min(x.b, to); if (!(b > a)) return;
      var ms = netMs(a, b, breaks), p = person(x.n); p.presentMs += ms;
      var d = dayOf(a); (p.days[d] = p.days[d] || { presentMs: 0, normedMs: 0, measuredH: 0, earnedH: 0 }).presentMs += ms;
    });
    credits.forEach(function (c) {
      if (!(c.t >= from && c.t < to)) return;
      var p = person(c.n), d = dayOf(c.t), day = p.days[d] = p.days[d] || { presentMs: 0, normedMs: 0, measuredH: 0, earnedH: 0 };
      p.earnedH += c.h; day.earnedH += c.h; p.value += c.qty * (cfg.ops[c.cat].sale || 0);
      p.byOp[c.cat] = (p.byOp[c.cat] || 0) + c.qty;
      if (c.measured) { p.measuredH += c.h; p.normedMs += c.ms; day.measuredH += c.h; day.normedMs += c.ms; } else p.looseH += c.h;
    });
    var people = Object.keys(P).map(function (k) { var p = P[k]; p.perf = p.normedMs >= 6e5 ? p.measuredH / (p.normedMs / 36e5) : null; return p; });
    var T = { presentMs: 0, normedMs: 0, earnedH: 0, measuredH: 0, looseH: 0, value: 0 };
    people.forEach(function (p) { T.presentMs += p.presentMs; T.normedMs += p.normedMs; T.earnedH += p.earnedH; T.measuredH += p.measuredH; T.looseH += p.looseH; T.value += p.value; });
    T.perf = T.normedMs >= 6e5 ? T.measuredH / (T.normedMs / 36e5) : null; T.cost = T.presentMs / 36e5 * cfg.hourCost;
    return { people: people, team: T, jobs: jobs, groups: G, cfg: cfg };
  }
  /* today's best by norms: people with enough normed time today, best first; [] when the norms say nothing yet */
  function best(opts) {
    var r = compute(opts), min = (r.cfg.minShoutH || 2) * 36e5;
    return r.people.filter(function (p) { return p.perf != null && p.normedMs >= min; }).sort(function (a, b) { return b.perf - a.perf; });
  }
  root.Nasumas = { DEF: DEF, ORDER: ORDER, cfgOf: cfgOf, compute: compute, best: best, groups: groups, partQty: partQty, stdH: stdH, netMs: netMs, dayOf: dayOf, norm: norm, placeCats: placeCats, catOfStation: catOfStation };
})(typeof window !== "undefined" ? window : globalThis);
