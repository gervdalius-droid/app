/* ============================================================
   Dienos planas — the planning engine (no DOM; also runs in Node for tests).

   What it does, in the order a production manager thinks:
     1. Review   — what actually happened on the last working day
                   (finished steps, hours on the floor plan, new blocks,
                   and — if a plan was confirmed for that day — how much of it got done)
     2. Readiness— what will stop work before it starts: missing handles,
                   worktops, hardware, appliance models, blocked steps,
                   engineering not handed over. Each one becomes an office action
                   with the date it is needed by.
     3. Plan     — next working day, per person: finish what is started,
                   then the most urgent ready work (critical ratio: days left to
                   the due date ÷ days of work left), never more than the
                   plannable share of the shift; idle people help elsewhere.
     4. Forecast — the same planning run forward over the next weeks, so every
                   project gets a projected finish date and a "late by" warning.
     5. Adjust   — manager's comments become adjustments (absent, arrived,
                   missing, priority, hold, assign, hours, installation) and the
                   plan is simply run again.

   Plain ES5 on purpose (old workshop tablets).
   ============================================================ */
(function (root) {
  "use strict";

  /* ---------------- small helpers ---------------- */
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function ymd(d) { d = new Date(d); return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function toDate(s) { var p = String(s).split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function addDays(s, n) { var d = toDate(s); d.setDate(d.getDate() + n); return ymd(d); }
  function dayStart(s) { return toDate(s).getTime(); }
  function norm(v) { return String(v == null ? "" : v).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim(); }
  function mins(hhmm) { var x = String(hhmm || "").split(":"); return (+x[0] || 0) * 60 + (+x[1] || 0); }
  function arr(x) { return Array.isArray(x) ? x : []; }
  function r1(x) { return Math.round(x * 10) / 10; }
  function median(a) { if (!a.length) return 0; a = a.slice().sort(function (x, y) { return x - y; }); var m = a.length >> 1; return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2; }
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function daysBetween(a, b) { return Math.round((dayStart(b) - dayStart(a)) / 864e5); }

  /* ---------------- calendar: Lithuanian public holidays ---------------- */
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451),
      mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, mo - 1, da);
  }
  var HOL = {};
  function holidays(y) {
    if (HOL[y]) return HOL[y];
    var s = {};
    ["01-01", "02-16", "03-11", "05-01", "06-24", "07-06", "08-15", "11-01", "11-02", "12-24", "12-25", "12-26"].forEach(function (md) { s[y + "-" + md] = 1; });
    var e = easter(y); s[ymd(e)] = 1; e.setDate(e.getDate() + 1); s[ymd(e)] = 1;
    return (HOL[y] = s);
  }
  function isWorkday(day, shift) {
    var d = toDate(day), wd = d.getDay(), days = arr(shift && shift.days).length ? shift.days : [1, 2, 3, 4, 5];
    return days.indexOf(wd) >= 0 && !holidays(d.getFullYear())[day];
  }
  function nextWorkday(day, shift, n) { n = n || 1; var d = day; while (n > 0) { d = addDays(d, 1); if (isWorkday(d, shift)) n--; } return d; }
  function prevWorkday(day, shift) { var d = addDays(day, -1), g = 0; while (!isWorkday(d, shift) && g++ < 20) d = addDays(d, -1); return d; }
  function lastWorkdayAtOrBefore(day, shift) { return isWorkday(day, shift) ? day : prevWorkday(day, shift); }
  function workdaysBetween(a, b, shift) {   /* working days from a (excl.) to b (incl.); negative if b < a */
    if (a === b) return 0; var s = a < b ? 1 : -1, d = a, n = 0, g = 0;
    while (d !== b && g++ < 400) { d = addDays(d, s); if (isWorkday(d, shift)) n += s; }
    return n;
  }
  function shiftMinutes(shift) {
    var s = shift || {}, a = mins(s.start || "08:00"), b = mins(s.end || "17:00"), br = 0;
    arr(s.breaks).forEach(function (k) { if (k && k.from && k.to) br += Math.max(0, mins(k.to) - mins(k.from)); });
    return Math.max(60, b - a - br);
  }

  /* ---------------- steps ---------------- */
  var KEYS = {
    cut: { lt: "Pjovimas", en: "Cutting", seq: 1 }, edge: { lt: "Briaunavimas", en: "Edge banding", seq: 2 }, drill: { lt: "Gręžimas", en: "Drilling", seq: 3 },
    asm: { lt: "Surinkimas", en: "Assembly", seq: 4 }, fin: { lt: "Apdaila", en: "Finishing", seq: 5 }, qc: { lt: "Išstatymas / KK", en: "Set-up / QC", seq: 6 },
    pack: { lt: "Pakavimas", en: "Packing", seq: 7 }, inst: { lt: "Montavimas", en: "Installation", seq: 8 },
    brief: { lt: "Projekto info", en: "Project brief", seq: 1, eng: true }, sketch: { lt: "Eskizas", en: "Sketch", seq: 2, eng: true },
    draw: { lt: "Brėžiniai", en: "Drawings", seq: 3, eng: true }, cam: { lt: "CAM / Nesting", en: "CAM / Nesting", seq: 4, eng: true },
    hand: { lt: "Perdavimas į gamybą", en: "Handover", seq: 5, eng: true }, other: { lt: "Kita", en: "Other", seq: 5 }
  };
  function stKey(name) {
    var n = norm(name);
    if (/pjov|cut|saw/.test(n)) return "cut";
    if (/briaun|edge/.test(n)) return "edge";
    if (/grez|drill/.test(n)) return "drill";
    if (/surink|assem/.test(n)) return "asm";
    if (/apdail|finish|dazy|slif/.test(n)) return "fin";
    if (/isstat|\bkk\b|qc|patikr/.test(n)) return "qc";
    if (/pakav|pack/.test(n)) return "pack";
    if (/montav|install/.test(n)) return "inst";
    if (/idej|info|brief/.test(n)) return "brief";
    if (/eskiz|sketch/.test(n)) return "sketch";
    if (/perdav|handover/.test(n)) return "hand";
    if (/\bcam\b|nesting/.test(n)) return "cam";
    if (/brezin|model|drawing/.test(n)) return "draw";
    return "other";
  }
  /* which floor-plan place does which step */
  var PLACE_KEY = { altendorf: "cut", felder: "cut", volter: "cut", olimpic: "edge", startech: "drill", vitap: "drill", blum: "drill", booth: "fin" };
  function placeKey(item, id) {
    var t = item && item.t || id;
    if (t === "desk") return /slif|apdirb|apdail|dazy/.test(norm(item && item.n)) ? "fin" : "asm";
    return PLACE_KEY[t] || null;
  }
  /* what a missing thing holds up: the first step (in route order) that cannot be done without it */
  var CATS = {
    material: { lt: "Plokštės / medžiagos", en: "Boards / material", gate: "cut" },
    fronts: { lt: "Fasadai", en: "Fronts", gate: "asm" },
    hardware: { lt: "Furnitūra", en: "Hardware", gate: "asm" },
    lighting: { lt: "Apšvietimas", en: "Lighting", gate: "asm" },
    handles: { lt: "Rankenėlės", en: "Handles", gate: "qc" },
    worktop: { lt: "Stalviršis", en: "Worktop", gate: "inst" },
    sink: { lt: "Kriauklė ir maišytuvas", en: "Sink & tap", gate: "inst" },
    appliances: { lt: "Buitinė technika", en: "Appliances", gate: "draw" },
    other: { lt: "Kita", en: "Other", gate: "next" }
  };

  /* ---------------- building the model from ShopFlow & friends ---------------- */
  /* input: {orders, stations, members, shift, sessions, layout, requests, nest, nasCfg, saved, now} */
  function build(input) {
    var now = input.now || Date.now(), today = ymd(now), shift = input.shift || {};
    var stations = {}; arr(input.stations).forEach(function (s) { if (s && s.id) stations[s.id] = s; });
    var members = arr(input.members).filter(function (m) { return m && m.id && m.name; });
    var mById = {}; members.forEach(function (m) { mById[m.id] = m; });
    var lanes = members.filter(function (m) { return m.role === "worker" || m.role === "engineer"; });
    var N = root.Nasumas, ncfg = N && N.cfgOf ? N.cfgOf(input.nasCfg || null) : null;
    var open = arr(input.orders).filter(function (o) { return o && !o.archived && !o.shipped && arr(o.ops).length; });
    var byId = {}; arr(input.orders).forEach(function (o) { if (o && o.id) byId[o.id] = o; });
    var withParts = N && N.attachNesting ? N.attachNesting(open, arr(input.nest), ncfg && ncfg.links) : open;
    var labelOf = function (o) { return [o.num, o.product].filter(Boolean).join(" · "); };
    var items = (input.layout && input.layout.items) || {};

    /* floor-plan stretches → {n, key, order, a, b, ms} */
    var sessions = arr(input.sessions).filter(function (x) { return x && !x.del && +x.b > +x.a && x.n; }).map(function (x) {
      var pr = String(x.pr || ""), num = (pr.match(/^\s*((?:WO|ENG)-\d+)/i) || [])[1], o = null;
      if (num) o = arr(input.orders).filter(function (q) { return q && String(q.num).toUpperCase() === num.toUpperCase(); })[0] || null;
      return { n: String(x.n), key: placeKey(items[x.s], x.s), place: x.sn || x.s || "", pr: pr, order: o, a: +x.a, b: +x.b, ms: +x.b - +x.a, nt: String(x.nt || "") };
    });

    /* experience: real hours a step took on finished work (floor plan, last months) */
    var hist = {}, perOrderKey = {};
    sessions.forEach(function (s) { if (!s.order || !s.key) return; var k = s.order.id + "|" + s.key; perOrderKey[k] = (perOrderKey[k] || 0) + s.ms; });
    Object.keys(perOrderKey).forEach(function (k) {
      var p = k.split("|"), o = byId[p[0]], key = p[1]; if (!o) return;
      var done = arr(o.ops).filter(function (op) { return stKey((stations[op.stationId] || {}).name) === key; }).every(function (op) { return op.status === "done"; });
      var h = perOrderKey[k] / 36e5; if (done && h >= 0.5) (hist[key] = hist[key] || []).push(h);
    });
    var histH = {}; Object.keys(hist).forEach(function (k) { if (hist[k].length >= 3) histH[k] = { h: median(hist[k]), n: hist[k].length }; });

    function partsFor(o, op, nk) {
      var wp = withParts.filter(function (x) { return x.id === o.id; })[0] || o, parts = arr(wp.parts);
      if (!parts.length || !N) return null;
      var own = parts.filter(function (p) { return p && p.itemId === op.itemId; });
      var sameKey = arr(o.ops).filter(function (q) { return stKey((stations[q.stationId] || {}).name) === stKey((stations[op.stationId] || {}).name); }).length;
      var use = own.length ? own : (nk === "sur" || wp.nest || sameKey === 1 ? parts : []);
      var q = 0; use.forEach(function (p) { q += N.partQty(p)[nk] || 0; });
      return q > 0 ? N.stdH(ncfg, nk, q) : null;
    }
    var NK = { cut: "pjov", edge: "briaun", drill: "grez", asm: "sur" };

    var orders = open.map(function (o) {
      var ops = arr(o.ops).map(function (op, i) {
        var st = stations[op.stationId] || {}, key = stKey(st.name || op.stationId);
        var est = null, src = "";
        if (NK[key]) { var nh = partsFor(o, op, NK[key]); if (nh) { est = nh; src = "norm"; } }
        if (est == null && histH[key]) { est = histH[key].h; src = "hist"; }
        if (est == null) { est = (+op.estMins || +st.estMins || 60) / 60; src = "est"; }
        est = Math.max(0.25, Math.min(40, est));
        var logged = +op.loggedMs || 0;
        if (op.status === "running" || op.status === "paused") {
          var since = +op.startedAt || 0, s2 = 0;
          sessions.forEach(function (s) { if (s.order && s.order.id === o.id && s.key === key && s.b > since - 36e5 * 24 * 14) s2 += s.ms; });
          logged = Math.max(logged, s2);
        }
        return {
          id: op.id, i: i, itemId: op.itemId || "_", stationId: op.stationId, station: st.name || "?", key: key, seq: (KEYS[key] || KEYS.other).seq,
          status: op.status || "queued", blockNote: op.blockNote || "", blockedAt: +op.blockedAt || 0, completedAt: +op.completedAt || 0, completedBy: op.completedBy || null,
          startedAt: +op.startedAt || 0, assignees: arr(op.assigneeIds).length ? op.assigneeIds.slice() : (op.assigneeId ? [op.assigneeId] : []),
          est: est, src: src, logged: logged, remain: (op.status === "running" || op.status === "paused") ? Math.max(est * 0.2, est - logged / 36e5) : est
        };
      });
      return {
        id: o.id, num: o.num || "", type: o.type === "eng" ? "eng" : "prod", client: o.client || "", product: o.product || "", label: labelOf(o),
        due: typeof o.due === "number" ? ymd(o.due) : null, priority: o.priority || "normal", ops: ops,
        details: arr(o.details), appliances: arr(o.appliances), fromEngId: o.fromEngId || null, comments: arr(o.comments),
        hasParts: arr((withParts.filter(function (x) { return x.id === o.id; })[0] || o).parts).length > 0
      };
    });

    /* leave from Prašymai, matched to ShopFlow names */
    function memberFor(full) {
      var w = norm(full).split(" "), first = w[0] || "", sur = w[1] || "";
      var c = members.filter(function (m) { return norm(m.name).split(" ")[0] === first; });
      if (c.length <= 1) return c[0] || null;
      var withInit = c.filter(function (m) { var x = norm(m.name).split(" "); return x[1] && sur && sur.indexOf(x[1].replace(/\./g, "")) === 0; });
      if (withInit.length) return withInit[0];
      return c.filter(function (m) { return norm(m.name).split(" ").length === 1; })[0] || c[0];
    }
    var leave = [];
    var reqs = input.requests || {};
    Object.keys(reqs).forEach(function (k) {
      var r = reqs[k]; if (!r || !r.from) return;
      if (/atmest|atsauk|reject|cancel/.test(norm(r.status))) return;
      var m = memberFor(r.employee); if (!m) return;
      leave.push({ m: m.id, from: r.from, to: r.to || r.from, type: r.type || "atostogos", ok: /patvirt|approv/.test(norm(r.status)) });
    });

    return {
      now: now, today: today, shift: shift, shiftMin: shiftMinutes(shift), stations: stations, members: members, mById: mById, lanes: lanes,
      orders: orders, sessions: sessions, leave: leave, histH: histH, saved: input.saved || {}, activity: arr(input.activity)
    };
  }

  /* ---------------- readiness: what holds each order up ---------------- */
  /* returns gates [{o, cat, label, state, due, gateKey, gateOp, needBy, late, source, detailId}] */
  function gatesFor(M, o, adj, day) {
    var g = [], A = adjFor(adj, o.id);
    var arrived = {}; A.filter(function (a) { return a.k === "arrived"; }).forEach(function (a) { arrived[a.cat || "*"] = a; });
    o.details.forEach(function (d) {
      if (!d || !(d.state === "need" || d.state === "ordered" || d.state === "client")) return;
      if (arrived[d.cat] || arrived["*"] || arrived["id:" + d.id]) return;
      g.push({ cat: CATS[d.cat] ? d.cat : "other", label: d.label || d.value || "", state: d.state, due: d.due ? ymd(d.due) : null, source: "sf", detailId: d.id });
    });
    if (o.type === "eng") {
      var miss = o.appliances.filter(function (a) { return a && !String(a.model || "").trim(); });
      if (miss.length && !arrived.appliances) g.push({ cat: "appliances", label: miss.map(function (a) { return a.type; }).join(", "), state: "need", due: null, source: "sf" });
    }
    A.filter(function (a) { return a.k === "missing"; }).forEach(function (a) {
      if (arrived[a.cat] && arrived[a.cat].at > a.at) return;
      g.push({ cat: CATS[a.cat] ? a.cat : "other", label: a.label || "", state: a.until ? "ordered" : "need", due: a.until || null, source: "adj", adjId: a.id });
    });
    /* production order made from an engineering project that is not handed over yet */
    if (o.type === "prod" && o.fromEngId) {
      var eo = M.orders.filter(function (x) { return x.id === o.fromEngId; })[0];
      if (eo && eo.ops.some(function (op) { return op.status !== "done" && op.key !== "hand"; }))
        g.push({ cat: "eng", label: eo.num, state: "need", due: null, source: "eng", gateKey: "cut" });
    }
    g.forEach(function (x) {
      x.gateKey = x.gateKey || (x.cat === "eng" ? "cut" : (CATS[x.cat] || CATS.other).gate);
      var rest = o.ops.filter(function (op) { return op.status !== "done"; });
      var gate = x.gateKey === "next" ? rest[0] : rest.filter(function (op) { return op.seq >= KEYS[x.gateKey].seq; })[0];
      x.gateOp = gate ? gate.id : null;
      x.gateSeq = gate ? gate.seq : 99;
      x.blocking = x.state !== "client";
      x.late = x.state === "ordered" && x.due && x.due < day;
    });
    return g;
  }
  /* is the gate lifted on day d (forecast assumes ordered things arrive on their date) */
  function gateOpen(x, d, M, day0) {
    if (!x.blocking) return true;
    if (x.state === "ordered" && x.due) {
      if (x.due >= M.today) return x.due < d;          // usable the working day after it comes
      return d > nextWorkday(day0, M.shift, 1);         // already late: assume ~2 days in the forecast, never for the plan day
    }
    return false;
  }

  /* ---------------- adjustments ---------------- */
  function adjFor(adj, oid) { return arr(adj).filter(function (a) { return a && a.o === oid; }); }
  function activeAdj(adj, day) {
    return arr(adj).filter(function (a) {
      if (!a || a.off) return false;
      if (a.k === "absent" || a.k === "avail") return (a.to || a.day) >= day;
      if (a.k === "hold" && a.until && a.until < day) return false;
      return true;
    });
  }

  /* ---------------- scoring ---------------- */
  var PLANNABLE = 0.85;
  function orderRemainH(o) { var h = 0; o.ops.forEach(function (op) { if (op.status !== "done" && op.key !== "inst") h += op.remain; }); return h; }

  /* ---------------- the planner ---------------- */
  /* plan(M, day0, adj, opts) → {days:[…], forecast:{oid:{finish, late}}, …} */
  function plan(M, day0, adjIn, opts) {
    opts = opts || {};
    var factor = +((M.saved.cfg || {}).factor) || PLANNABLE, horizon = opts.horizon || 15, dayCap = M.shiftMin * factor;
    var adj = activeAdj(adjIn, M.today);
    var st = {}; /* simulated op state: remain, done, doneDay */
    M.orders.forEach(function (o) { o.ops.forEach(function (op) { st[op.id] = { remain: op.remain, done: op.status === "done", status: op.status }; }); });
    /* manual hour estimates */
    adj.filter(function (a) { return a.k === "hours" && a.o && a.h > 0; }).forEach(function (a) {
      var o = M.orders.filter(function (x) { return x.id === a.o; })[0]; if (!o) return;
      o.ops.forEach(function (op) { if ((!a.key || op.key === a.key) && !st[op.id].done) { st[op.id].remain = a.key ? a.h : a.h / Math.max(1, o.ops.filter(function (q) { return !st[q.id].done; }).length); st[op.id].manualH = true; } });
    });
    var gates = {}; M.orders.forEach(function (o) { gates[o.id] = gatesFor(M, o, adj, day0); });
    var unblocked = {}; adj.filter(function (a) { return a.k === "unblock"; }).forEach(function (a) { unblocked[a.o] = 1; });
    var days = [], forecast = {}, d = day0;
    for (var di = 0; di < horizon; di++) {
      days.push(runDay(d, di === 0));
      d = nextWorkday(d, M.shift, 1);
    }
    M.orders.forEach(function (o) {
      var left = o.ops.filter(function (op) { return op.key !== "inst" && !st[op.id].done; });
      var fin = null; o.ops.forEach(function (op) { if (op.key !== "inst" && st[op.id].doneDay && (!fin || st[op.id].doneDay > fin)) fin = st[op.id].doneDay; });
      var f = { finish: left.length ? null : (fin || "done"), late: null, stuck: [] };
      if (f.finish && f.finish !== "done" && o.due) f.late = workdaysBetween(o.due, f.finish, M.shift);
      if (f.finish === "done" && o.due && o.due < M.today) f.late = 0;
      if (left.length) {
        gates[o.id].forEach(function (g) { if (g.blocking && left.some(function (op) { return op.id === g.gateOp; }) && !gateOpen(g, d, M, day0)) f.stuck.push(g); });
        left.forEach(function (op) { if (op.status === "blocked" && !unblocked[o.id]) f.stuck.push({ cat: "block", label: op.blockNote, gateKey: op.key }); });
      }
      forecast[o.id] = f;
    });
    return { day0: day0, days: days, forecast: forecast, gates: gates, dayCap: dayCap, factor: factor, adj: adj, st: st };

    function laneCap(m, d) {
      if (!isWorkday(d, M.shift)) return 0;
      var cap = dayCap, why = null;
      M.leave.forEach(function (l) { if (l.m === m.id && l.from <= d && l.to >= d) { cap = 0; why = { k: "leave", type: l.type, ok: l.ok }; } });
      adj.forEach(function (a) {
        if (a.m !== m.id) return;
        var on = a.day <= d && (a.to || a.day) >= d;
        if (a.k === "absent" && on) { cap = 0; why = { k: "absent", adj: a.id }; }
        if (a.k === "avail" && on) { cap = Math.min(dayCap, a.h * 60 * factor); why = { k: "avail", h: a.h, adj: a.id }; }
      });
      return { cap: cap, why: why };
    }
    function candidates(o, op) {
      var A = adjFor(adj, o.id).filter(function (a) { return a.k === "assign" && a.m && (!a.key || a.key === op.key); });
      if (A.length) return { ids: [A[A.length - 1].m], fixed: true };
      var lanes = M.lanes.map(function (m) { return m.id; }), out = [];
      function add(id) { if (id && lanes.indexOf(id) >= 0 && out.indexOf(id) < 0) out.push(id); }
      op.assignees.forEach(add);
      var s = M.stations[op.stationId] || {};
      (arr(s.defaultAssigneeIds).length ? s.defaultAssigneeIds : [s.defaultAssigneeId]).forEach(add);
      M.lanes.forEach(function (m) { if (m.station === op.stationId) add(m.id); });
      var office = op.assignees.length && op.assignees.every(function (id) { return lanes.indexOf(id) < 0 && M.mById[id]; });
      return { ids: out, office: office && !out.length };
    }
    function score(o, d) {
      var rem = orderRemainH2(o), daysNeed = rem / (dayCap / 60), slack = o.due ? workdaysBetween(d, o.due, M.shift) - daysNeed : 30;
      var s = slack;
      if (o.priority === "rush") s -= 5; else if (o.priority === "high") s -= 2;
      var A = adjFor(adj, o.id);
      if (A.some(function (a) { return a.k === "prio" && a.level === "top"; })) s -= 100;
      if (A.some(function (a) { return a.k === "prio" && a.level === "down"; })) s += 100;
      if (rem <= 4) s -= 1;
      return s;
    }
    function orderRemainH2(o) { var h = 0; o.ops.forEach(function (op) { if (!st[op.id].done && op.key !== "inst") h += st[op.id].remain; }); return h; }

    function runDay(d, detail) {
      var L = {}, lanes = M.lanes.map(function (m) { var c = laneCap(m, d); return (L[m.id] = { m: m, cap: c.cap, why: c.why, t: 0, tasks: [] }); });
      var finishAt = {};   /* op id → minute it finishes today */
      var skipped = [], seen = {}, holdOrders = {};
      adj.forEach(function (a) { if (a.k === "hold" && a.o && (!a.until || a.until >= d) && (!a.day || a.day <= d)) holdOrders[a.o] = a; });
      /* installations booked by the manager take that person's whole day */
      adj.filter(function (a) { return a.k === "install" && a.day === d && a.o; }).forEach(function (a) {
        var o = M.orders.filter(function (x) { return x.id === a.o; })[0]; if (!o) return;
        var op = o.ops.filter(function (q) { return q.key === "inst" && !st[q.id].done; })[0];
        (a.ms && a.ms.length ? a.ms : [a.m]).forEach(function (mid) {
          var ln = L[mid]; if (!ln || ln.cap <= 0) return;
          ln.tasks.push({ o: o, op: op || null, key: "inst", h: ln.cap / 60, start: 0, end: ln.cap, inst: true, why: [] });
          ln.t = ln.cap;
        });
        if (op) { st[op.id].done = true; st[op.id].doneDay = d; }
      });
      var ordered = M.orders.filter(function (o) { return !holdOrders[o.id]; }).map(function (o) { return { o: o, s: score(o, d) }; })
        .sort(function (a, b) { return a.s - b.s || ((a.o.due || "9") < (b.o.due || "9") ? -1 : 1); });
      if (detail) M.orders.forEach(function (o) { if (holdOrders[o.id]) skipped.push({ o: o, op: null, reason: "hold", until: holdOrders[o.id].until || null }); });
      var changed = true, pass = 0;
      while (changed && pass++ < 12) {
        changed = false;
        /* 1st: what is already started; 2nd: everything by urgency */
        [true, false].forEach(function (startedOnly) {
          ordered.forEach(function (x) {
            var o = x.o;
            o.ops.forEach(function (op) {
              var s = st[op.id];
              if (s.done || s.planned === d && s.remain <= 0.01) return;
              if (startedOnly && !(op.status === "running" || op.status === "paused")) return;
              if (op.key === "inst") { if (detail && ready(o, op, d) !== false) note(o, op, "install"); return; }
              var r = ready(o, op, d);
              if (r !== true) { if (detail && r && r.reason !== "wait") note(o, op, r.reason, r); return; }
              var c = candidates(o, op);
              if (!c.ids.length) { if (detail) note(o, op, c.office ? "office" : "nobody"); return; }
              var earliest = predFinish(o, op);
              var best = null;
              c.ids.forEach(function (id) { var ln = L[id]; if (!ln || ln.cap - Math.max(ln.t, earliest) < 20) return; var t0 = Math.max(ln.t, earliest); if (!best || t0 < best.t0) best = { ln: ln, t0: t0 }; });
              if (!best) {
                if (detail) {
                  var allOff = c.ids.every(function (id) { return !L[id] || L[id].cap <= 0; });
                  note(o, op, allOff ? "away" : "full", { who: c.ids });
                }
                return;
              }
              place(best.ln, o, op, best.t0, false, c.fixed);
              changed = true;
            });
          });
        });
      }
      /* idle people help: anything ready they could do, most urgent first (not the CNC unless it is their station) */
      lanes.forEach(function (ln) {
        if (ln.cap - ln.t < 60 || ln.m.role === "engineer") return;
        ordered.forEach(function (x) {
          if (ln.cap - ln.t < 60) return;
          x.o.ops.forEach(function (op) {
            if (ln.cap - ln.t < 60 || st[op.id].done || op.key === "inst" || KEYS[op.key].eng || x.o.type === "eng") return;
            if (st[op.id].planned === d && st[op.id].remain <= 0.01) return;
            if (ready(x.o, op, d) !== true) return;
            if (op.key === "cut" && ln.m.station !== op.stationId && candidates(x.o, op).ids.indexOf(ln.m.id) < 0) return;
            var t0 = Math.max(ln.t, predFinish(x.o, op)); if (ln.cap - t0 < 45) return;
            place(ln, x.o, op, t0, true, false);
          });
        });
      });
      if (detail) {
        /* remove planned ops from the "not planned" list, keep the reason for the rest */
        skipped = skipped.filter(function (s) { return !s.op || !(st[s.op.id].planned === d); });
      }
      return { day: d, lanes: lanes, skipped: detail ? skipped : null, cap: dayCap };

      function note(o, op, reason, extra) {
        var k = o.id + "|" + (op ? op.id : "") + "|" + reason; if (seen[k]) return; seen[k] = 1;
        skipped.push({ o: o, op: op, reason: reason, gate: extra && extra.gate, who: extra && extra.who, until: extra && extra.until });
      }
      function ready(o, op, d) {
        if (op.status === "blocked" && !unblocked[o.id]) return { reason: "blocked" };
        /* earlier steps of the same item */
        var prev = o.ops.filter(function (q) { return q.itemId === op.itemId && q.i < op.i && !st[q.id].done; });
        var prevBlocked = prev.filter(function (q) { return q.status === "blocked" && !unblocked[o.id]; });
        if (prevBlocked.length) return { reason: "wait" };
        if (prev.some(function (q) { return !(st[q.id].planned === d && st[q.id].remain <= 0.01); })) return { reason: "wait" };
        var g = gates[o.id].filter(function (x) { return x.blocking && x.gateSeq <= op.seq && !gateOpen(x, d, M, day0); });
        if (g.length) return { reason: "missing", gate: g[0] };
        return true;
      }
      function predFinish(o, op) {
        var t = 0; o.ops.forEach(function (q) { if (q.itemId === op.itemId && q.i < op.i && finishAt[q.id] != null) t = Math.max(t, finishAt[q.id]); });
        return t;
      }
      function place(ln, o, op, t0, help, fixed) {
        var s = st[op.id], need = s.remain * 60, can = ln.cap - t0, dur = Math.min(need, can);
        ln.tasks.push({ o: o, op: op, key: op.key, h: dur / 60, start: t0, end: t0 + dur, partial: dur < need - 1, cont: op.status === "running" || op.status === "paused" || s.touched, help: help, fixed: fixed, left: (need - dur) / 60, est: op.est, src: s.manualH ? "manual" : op.src });
        ln.t = t0 + dur; s.remain = Math.max(0, s.remain - dur / 60); s.planned = d; s.touched = true;
        if (s.remain <= 0.01) { s.done = true; s.doneDay = d; finishAt[op.id] = t0 + dur; }
      }
    }
  }

  /* ---------------- review of a past day ---------------- */
  function review(M, day, savedPlan) {
    var a = dayStart(day), b = a + 864e5;
    var done = [], blocks = [];
    M.orders.forEach(function (o) { o.ops.forEach(function (op) {
      if (op.completedAt >= a && op.completedAt < b) done.push({ o: o, op: op, by: op.completedBy });
      if (op.status === "blocked" && op.blockedAt >= a && op.blockedAt < b) blocks.push({ o: o, op: op });
    }); });
    /* closed (shipped/archived) orders do not live in M.orders, so finished steps come from the activity log too */
    var actDone = M.activity.filter(function (x) { return x && +x.ts >= a && +x.ts < b && /^completed /.test(String(x.text || "")); });
    var people = {};
    M.lanes.forEach(function (m) { people[m.id] = { m: m, ms: 0, noProj: 0, projects: {}, steps: 0 }; });
    M.sessions.forEach(function (s) {
      var ov = Math.min(b, s.b) - Math.max(a, s.a); if (ov <= 0) return;
      var m = M.members.filter(function (x) { return norm(x.name) === norm(s.n); })[0]; if (!m || !people[m.id]) return;
      var p = people[m.id]; p.ms += ov;
      if (!s.pr) p.noProj += ov; else { var k = s.order ? s.order.num : s.pr; p.projects[k] = (p.projects[k] || 0) + ov; }
    });
    done.forEach(function (x) { var id = x.by || x.op.assignees[0]; if (people[id]) people[id].steps++; });
    var adherence = null;
    if (savedPlan && arr(savedPlan.tasks).length) {
      var ok = 0, miss = [];
      savedPlan.tasks.forEach(function (t) {
        var o = M.orders.filter(function (x) { return x.id === t.o; })[0], op = o && o.ops.filter(function (q) { return q.id === t.op; })[0];
        var good = !o || !op /* order closed meanwhile */ || op.status === "done" || (op.startedAt && op.startedAt < b) || (op.logged > 0 && op.status !== "queued");
        if (good) ok++; else miss.push({ t: t, o: o, op: op });
      });
      adherence = { total: savedPlan.tasks.length, ok: ok, pct: Math.round(ok / savedPlan.tasks.length * 100), miss: miss, at: savedPlan.at, by: savedPlan.by };
    }
    return { day: day, done: done, actDone: actDone, blocks: blocks, people: people, adherence: adherence };
  }

  /* ---------------- insights & office actions ---------------- */
  function analyse(M, P, R) {
    var day0 = P.day0, acts = [], ins = [];
    /* 1. missing things, by the date they are needed */
    M.orders.forEach(function (o) {
      P.gates[o.id].forEach(function (g) {
        var needBy = null;
        P.days.forEach(function (D) { if (needBy) return; D.skipped && D.skipped.forEach(function (s) { if (s.o === o && s.gate === g) needBy = D.day; }); });
        if (!needBy) {
          /* when would the gated step be reached if the thing were here */
          var gop = o.ops.filter(function (op) { return op.id === g.gateOp; })[0];
          if (gop) { var prevLeft = 0; o.ops.forEach(function (q) { if (q.itemId === gop.itemId && q.i < gop.i && P.st[q.id] && !(q.status === "done")) prevLeft += q.remain; });
            needBy = prevLeft <= 0.01 ? day0 : nextWorkday(M.today, M.shift, Math.max(1, Math.ceil(prevLeft / (P.dayCap / 60)))); }
          else { var ff = P.forecast[o.id].finish; needBy = ff && ff !== "done" ? ff : null; g.forEnd = true; }
        }
        acts.push({ kind: "missing", o: o, g: g, needBy: needBy, urgent: needBy && needBy <= nextWorkday(day0, M.shift, 2), late: g.late });
      });
      o.ops.forEach(function (op) { if (op.status === "blocked") acts.push({ kind: "blocked", o: o, op: op, urgent: true }); });
    });
    /* 2. ready for installation / finished but still open */
    M.orders.forEach(function (o) {
      var left = o.ops.filter(function (op) { return op.status !== "done"; });
      if (o.type === "prod" && left.length && left.every(function (op) { return op.key === "inst"; })) acts.push({ kind: "install", o: o, urgent: o.due && o.due <= day0 });
      if (!left.length) acts.push({ kind: "close", o: o });
    });
    /* 3. steps nobody can take */
    var d0 = P.days[0];
    d0.skipped.forEach(function (s) { if (s.reason === "nobody" || s.reason === "office") acts.push({ kind: s.reason, o: s.o, op: s.op }); });
    var rankA = { blocked: 0, missing: 1, install: 2, office: 3, nobody: 4, close: 6 };
    acts.sort(function (a, b) { return (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0) || rankA[a.kind] - rankA[b.kind] || String(a.needBy || a.o.due || "9").localeCompare(String(b.needBy || b.o.due || "9")); });

    /* bottleneck: queued ready-or-soon hours per step vs. people who do it */
    var load = {};
    M.orders.forEach(function (o) { o.ops.forEach(function (op) { if (op.status !== "done" && op.key !== "inst" && !KEYS[op.key].eng) load[op.key] = (load[op.key] || 0) + op.remain; }); });
    var keys = Object.keys(load).sort(function (a, b) { return load[b] - load[a]; });
    var plannedBy = {}; d0.lanes.forEach(function (ln) { ln.tasks.forEach(function (t) { plannedBy[t.key] = (plannedBy[t.key] || 0) + t.h; }); });
    if (keys.length) ins.push({ k: "bottleneck", key: keys[0], h: load[keys[0]], days: load[keys[0]] / (P.dayCap / 60), planned: plannedBy[keys[0]] || 0 });

    /* idle capacity tomorrow */
    d0.lanes.forEach(function (ln) { if (ln.cap > 0 && ln.cap - ln.t >= 90) ins.push({ k: "idle", m: ln.m, h: (ln.cap - ln.t) / 60 }); });
    /* lateness */
    var late = M.orders.filter(function (o) { var f = P.forecast[o.id]; return o.due && ((f.late != null && f.late > 0) || (!f.finish && o.due < day0)); });
    if (late.length) ins.push({ k: "late", n: late.length, list: late });
    var stuck = M.orders.filter(function (o) { return P.forecast[o.id].stuck.length; });
    if (stuck.length) ins.push({ k: "stuck", n: stuck.length, list: stuck });
    /* yesterday */
    if (R) {
      var noProj = 0, present = 0; Object.keys(R.people).forEach(function (k) { noProj += R.people[k].noProj; present += R.people[k].ms; });
      if (noProj >= 36e5) ins.push({ k: "noproj", h: noProj / 36e5, of: present / 36e5 });
      if (R.adherence) ins.push({ k: "adherence", pct: R.adherence.pct, miss: R.adherence.miss.length });
    }
    return { actions: acts, insights: ins, late: late };
  }

  /* ---------------- reading the manager's comments (LT + EN) ---------------- */
  var WD_LT = ["sekmad", "pirmad", "antrad", "treciad", "ketvirtad", "penktad", "sestad"], WD_EN = ["sunday|sun\\b", "monday|mon\\b", "tuesday|tue\\b", "wednesday|wed\\b", "thursday|thu\\b", "friday|fri\\b", "saturday|sat\\b"];
  function parseDay(t, ctx, after) {
    var d = parseDay0(t, ctx, after), g = 0;
    if (d && ctx.shift) while (!isWorkday(d, ctx.shift) && g++ < 10) d = addDays(d, 1);   /* "rytoj" said on a Friday means Monday */
    return d;
  }
  function parseDay0(t, ctx, after) {
    var base = ctx.today, m;
    if ((m = t.match(/\b(20\d\d)-(\d{1,2})-(\d{1,2})\b/))) return m[1] + "-" + pad(+m[2]) + "-" + pad(+m[3]);
    if ((m = t.match(/\b(\d{1,2})-(\d{1,2})\b/)) && +m[1] <= 12 && +m[2] <= 31) { var y = +base.slice(0, 4), s = y + "-" + pad(+m[1]) + "-" + pad(+m[2]); if (s < base) s = (y + 1) + s.slice(4); return s; }
    if ((m = t.match(/\b(\d{1,2})\.(\d{1,2})\b/)) && +m[2] <= 12) { var y2 = +base.slice(0, 4), s2 = y2 + "-" + pad(+m[2]) + "-" + pad(+m[1]); if (s2 < base) s2 = (y2 + 1) + s2.slice(4); return s2; }
    if (/\bporyt|day after tomorrow/.test(t)) return addDays(base, 2);
    if (/\brytoj|\btomorrow/.test(t)) return addDays(base, 1);
    if (/\bsiandien|\btoday/.test(t)) return base;
    if (/kit(a|os) savait|next week|po savait/.test(t)) { var d = toDate(base); d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); return ymd(d); }
    for (var i = 0; i < 7; i++) {
      var re = new RegExp("\\b(" + WD_LT[i] + "|" + WD_EN[i] + ")");
      if (re.test(t)) { var x = toDate(base), k = 0; do { x.setDate(x.getDate() + 1); k++; } while (x.getDay() !== i && k < 8); return ymd(x); }
    }
    return after || null;
  }
  function findOrders(t, raw, ctx) {
    var out = [], m, re = /\b(wo|eng)[\s-]?(\d{3,5})\b/g;
    while ((m = re.exec(t))) { var num = (m[1] + "-" + m[2]).toUpperCase(); ctx.orders.forEach(function (o) { if (o.num.toUpperCase() === num && out.indexOf(o) < 0) out.push(o); }); }
    if (out.length) return out;
    var nums = t.match(/\b\d{4}\b/g) || [];
    nums.forEach(function (n) { ctx.orders.forEach(function (o) { if (o.num.replace(/\D/g, "") === n && out.indexOf(o) < 0) out.push(o); }); });
    if (out.length) return out;
    /* by client / product words */
    var words = t.split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 3 && !STOP[w] && !/^\d+$/.test(w); });
    var best = [], bs = 0, digits = t.split(/[^a-z0-9]+/).filter(function (w) { return /^\d{1,2}$/.test(w); });
    ctx.orders.forEach(function (o) {
      var raw2 = String(o.client + " " + o.product).replace(/([a-zà-ſ])([A-Z])/g, "$1 $2");
      var all = norm(o.client + " " + o.product + " " + raw2.replace(/([A-Za-z])(\d)/g, "$1 $2")).split(/[^a-z0-9]+/);
      var toks = all.filter(function (w) { return w.length >= 3; });
      var s = 0;
      digits.forEach(function (n) { if (all.indexOf(n) >= 0) s += 0.5; });
      /* every word of the comment counts once: "Gelumbausko koridorius" = 2 words found, not 1 word found twice */
      words.forEach(function (w) {
        var hit = toks.some(function (k) {
          if (w === k) return true;
          if (k.length === 3) return w.length >= 5 && w.indexOf(k) === 0;
          return k.length >= 4 && w.length >= 4 && (w.indexOf(k.slice(0, Math.max(4, k.length - 2))) === 0 || k.indexOf(w.slice(0, Math.max(4, w.length - 2))) === 0);
        });
        if (hit) s += WEAK[w] ? 0.5 : 1;
      });
      if (s > bs + 1e-9) { bs = s; best = [o]; } else if (s && Math.abs(s - bs) < 1e-9) best.push(o);
    });
    if (best.length > 1) {
      /* same score: the one with work left, then the one with something open on its list */
      var live = best.filter(function (o) { return o.ops && o.ops.some(function (op) { return op.status !== "done"; }); });
      if (live.length) best = live;
      var withDet = best.filter(function (o) { return (o.details || []).some(function (d) { return d && (d.state === "need" || d.state === "ordered"); }); });
      if (withDet.length && /atvyk|gaut|gavo|truks|nera|lauk|arriv|receiv|missing|wait/.test(t)) best = withDet;
    }
    if (bs >= 1) {
      /* "virtuvė" or "spinta" alone should not decide — prefer production unless the text is about design */
      var eng = /projekt|eskiz|brezin|design|drawing|sketch/.test(t);
      var pick = best.filter(function (o) { return eng ? o.type === "eng" : o.type === "prod"; });
      return pick.length ? pick : best;
    }
    return [];
  }
  var WEAK = { "virtuve": 1, "virtuvei": 1, "virtuves": 1, "virt": 1, "spinta": 1, "spintos": 1, "spintai": 1, "lova": 1, "lovai": 1, "vonia": 1, "voniai": 1, "kitchen": 1, "wardrobe": 1 };
  var STOP = { "nera": 1, "yra": 1, "bus": 1, "dar": 1, "tik": 1, "kad": 1, "the": 1, "and": 1, "for": 1, "not": 1, "dirba": 1, "rytoj": 1, "atvyko": 1, "atvyks": 1, "gautas": 1, "gauta": 1, "gautos": 1, "surinkimas": 1, "surinkima": 1, "pjovimas": 1, "pjovima": 1, "briaunavimas": 1, "grezimas": 1, "apdaila": 1, "pakavimas": 1, "montavimas": 1, "montavima": 1, "prioritetas": 1, "skubu": 1, "arrived": 1, "missing": 1, "handles": 1, "worktop": 1, "rankeneles": 1, "stalvirsis": 1, "stalvirsio": 1, "client": 1, "klientas": 1, "klientu": 1, "klientui": 1, "trecia": 1, "dienos": 1, "puse": 1, "truksta": 1, "reikia": 1, "laukiam": 1, "laukiame": 1, "darys": 1, "daro": 1, "valandu": 1, "val": 1 };
  function findMembers(t, ctx) {
    var out = [], words = t.split(/[^a-z0-9]+/);
    ctx.members.forEach(function (m) {
      var w = norm(m.name).split(" "), first = w[0], stem = first.slice(0, Math.max(4, first.length - 2));
      for (var i = 0; i < words.length; i++) {
        if (words[i].indexOf(stem) !== 0) continue;
        if (w[1]) { if (words[i + 1] === w[1].replace(/\./g, "") || /projektuot|inzinier|engineer/.test(t)) { out.push(m); return; } continue; }
        /* plain "Mantas" must not also be "Mantas T" */
        if (ctx.members.some(function (o) { var x = norm(o.name).split(" "); return o !== m && x[0] === first && x[1] && (words[i + 1] === x[1].replace(/\./g, "")); })) continue;
        out.push(m); return;
      }
    });
    return out;
  }
  function findKey(t) {
    var K = [["cut", /pjov|supjaut|piov|\bcut|\bsaw|volter|\bcnc/], ["edge", /briaun|klijuot|\bedge/], ["drill", /grez|\bdrill|startech/], ["asm", /surink|assembl/],
      ["fin", /apdail|dazy|slifav|finish|paint/], ["qc", /isstat|\bkk\b|patikr|\bqc\b|\bcheck/], ["pack", /pakav|\bpack/], ["inst", /montav|sumontuot|install/],
      ["sketch", /eskiz|sketch/], ["draw", /brezin|drawing/], ["cam", /\bcam\b|nesting/]];
    for (var i = 0; i < K.length; i++) if (K[i][1].test(t)) return K[i][0];
    return null;
  }
  function findCat(t) {
    var C = [["handles", /ranken|handle/], ["worktop", /stalvir|worktop|countertop|counter top/], ["sink", /kriaukl|maisytuv|\bsink|\btap\b/],
      ["lighting", /\bled\b|apsviet|light/], ["fronts", /fasad|\bfront|dureles|durel/], ["hardware", /furnitur|lankst|begel|\bhinge|runner|\bblum|tandem|merivo|hardware|stalciu begel/],
      ["appliances", /buitin|technik|orkait|gartrauk|kaitlent|appliance|\boven|\bhob\b/], ["material", /plokst|medziag|\bboard|material|fanera|faner|mdf|hdf|lmdp/]];
    for (var i = 0; i < C.length; i++) if (C[i][1].test(t)) return C[i][0];
    return null;
  }
  /* text → [adjustment]; ctx = {today, planDay, orders, members} */
  function parse(text, ctx) {
    var raw = String(text || "").trim(), t = norm(raw); if (!t) return [];
    var sentences = t.split(/[.;!\n]+|\s(?:ir|bet|and|but)\s(?=[a-z]+ (?:nedirb|serga|atostog|dirb|nebus))/).map(function (s) { return s.trim(); }).filter(Boolean);
    var out = [];
    sentences.forEach(function (s) { out = out.concat(parseOne(s, raw, ctx)); });
    return out;
  }
  function parseOne(t, raw, ctx) {
    var os = ctx.force ? [ctx.force] : findOrders(t, raw, ctx), ms = findMembers(t, ctx), key = findKey(t), cat = findCat(t);
    var t0 = t.replace(/\b(?:iki|until|till)\s+[a-z0-9.\-]+(?:\s[a-z0-9.\-]+)?/g, " ");
    var day = parseDay(t0, ctx, ctx.planDay), until = null, m;
    if ((m = t.match(/\biki\s+([a-z0-9.\-]+(?:\s[a-z0-9.\-]+)?)/)) || (m = t.match(/\buntil\s+([a-z0-9.\-]+(?:\s[a-z0-9.\-]+)?)/))) until = parseDay(m[1], ctx, null);
    var hm = t.match(/(\d+(?:[.,]\d+)?)\s*(?:val|h\b|hours?|valand)/), H = hm ? parseFloat(hm[1].replace(",", ".")) : null;
    var A = [], now = Date.now();
    function push(a) { a.id = uid(); a.at = now; a.src = raw; A.push(a); }
    var ABS = /nedirb|nebus|serga|susirg|atostog|laisv|isleid|neatei|\bsick|\babsent|vacation|day off|\boff\b|not (?:working|coming|in)|away/;
    var HALF = /puse dienos|pusdien|half (?:a )?day|iki pietu|po pietu|nuo pietu/;
    var ARR = /atvyko|atvykus|atvykusi|atveze\b|atvezti|atvezte|atkeliavo|gavom|gavome|gauta|gautos|gautas|gavo\b|jau yra|turim|turime|arrived|received|delivered|came|is here|are here|in stock/;
    var MISS = /truksta|truks|nera |nebus|laukiam|laukiame|laukia|neatvyk|vel(uoja|avo) pristat|nepristat|missing|waiting for|not (?:arrived|here|delivered)|\bno\b|out of stock|reikia (?:uzsakyt|gaut)|reik gaut|reik uzsak/;
    var HOLD = /atidet|atidek|ne rytoj|nedaryt|nedarom|palaukt|sustabdyt|pristabd|veliau|\blater\b|postpone|\bhold\b|not tomorrow|skip|stop/;
    var TOP = /skub|prioritet|pirmiausia|pirma eile|svarbiausia|svarbu|\burgent|\brush|\bfirst\b|priority|asap|kuo greiciau/;
    var DOWN = /neskubu|neskub|nebeskub|not urgent|low priority|ne prioritet/;
    var UNB = /atblok|issprest|isspresta|sutvarkyt|unblock|resolved|fixed|solved|padarytos|pasigamin/;
    var INST = /montav|sumontuot|install/;
    var ASSIGN = /\bdaro\b|\bdarys\b|tegul|duok|priskirt|perduot|padarys|imsis|\bassign|\bgive\b|will do|\bdoes\b|\bto\b/;
    /* people first: absence / availability */
    if (ms.length && !os.length && (ABS.test(t) || HALF.test(t) || (H != null && /dirb|\bwork/.test(t)))) {
      ms.forEach(function (mm) {
        if (HALF.test(t)) push({ k: "avail", m: mm.id, day: day, to: until || day, h: shiftHalf(ctx) });
        else if (H != null && !ABS.test(t)) push({ k: "avail", m: mm.id, day: day, to: until || day, h: H });
        else push({ k: "absent", m: mm.id, day: day, to: until && until >= day ? until : day });
      });
      return A;
    }
    if (os.length) {
      os.forEach(function (o) {
        if (UNB.test(t) && !cat) return push({ k: "unblock", o: o.id });
        if (MISS.test(t) && cat) return push({ k: "missing", o: o.id, cat: cat, label: raw.slice(0, 120), until: until || (/(?:atvyks|bus|ateis|atvez|arrive|comes|coming)/.test(t) ? parseDay(t, ctx, null) : null) });
        if (ARR.test(t) && !/neatvyk|not arrived/.test(t)) { var dt = pickDetail(o, cat, t); return push({ k: "arrived", o: o.id, cat: dt ? "id:" + dt.id : (cat || "*"), label: dt ? dt.label : "" }); }
        if (INST.test(t) && (ms.length || /rytoj|tomorrow|\d|pirmad|antrad|treciad|ketvirtad|penktad|mon|tue|wed|thu|fri/.test(t)) && !HOLD.test(t))
          return push({ k: "install", o: o.id, day: day, m: ms[0] ? ms[0].id : null, ms: ms.map(function (x) { return x.id; }) });
        if (DOWN.test(t)) return push({ k: "prio", o: o.id, level: "down" });
        if (HOLD.test(t)) return push({ k: "hold", o: o.id, until: until || (/rytoj|tomorrow/.test(t) ? null : null), day: /ne rytoj|not tomorrow/.test(t) ? ctx.planDay : null, oneDay: /ne rytoj|not tomorrow/.test(t) && !until });
        if (TOP.test(t)) return push({ k: "prio", o: o.id, level: "top" });
        if (ms.length && (ASSIGN.test(t) || key)) return push({ k: "assign", o: o.id, m: ms[0].id, key: key });
        if (H != null) return push({ k: "hours", o: o.id, key: key, h: H });
        if (MISS.test(t)) return push({ k: "missing", o: o.id, cat: "other", label: raw.slice(0, 120), until: until });
      });
      A.forEach(function (a) { if (a.k === "hold" && a.oneDay) { a.until = ctx.planDay; delete a.oneDay; } });
      if (A.length) return A;
    }
    if (ms.length && ABS.test(t)) { ms.forEach(function (mm) { push({ k: "absent", m: mm.id, day: day, to: until && until >= day ? until : day }); }); return A; }
    push({ k: "note", text: raw.slice(0, 400) });
    return A;
  }
  function pickDetail(o, cat, t) {
    var open = (o.details || []).filter(function (d) { return d && (d.state === "need" || d.state === "ordered" || d.state === "client"); });
    if (!open.length) return null;
    var words = t.split(/[^a-z0-9]+/).filter(function (w) { return w.length >= 4; }), best = null, bs = 0;
    open.forEach(function (d) {
      var s = d.cat === cat ? 2 : 0, lw = norm(d.label + " " + (d.value || "")).split(/[^a-z0-9]+/);
      words.forEach(function (w) { if (lw.some(function (k) { return k.length >= 4 && (k.indexOf(w.slice(0, 5)) === 0 || w.indexOf(k.slice(0, 5)) === 0); })) s += 1; });
      if (s > bs) { bs = s; best = d; }
    });
    return best || (open.length === 1 ? open[0] : null);
  }
  function shiftHalf(ctx) { return Math.round((ctx.shiftMin || 465) / 60 / 2 * 2) / 2; }

  /* ---------------- words ---------------- */
  function keyName(k, lang) { var x = KEYS[k] || KEYS.other; return lang === "en" ? x.en : x.lt; }
  function catName(c, lang) { var x = CATS[c] || (c === "eng" ? { lt: "Projektavimas", en: "Engineering" } : c === "block" ? { lt: "Užblokuota", en: "Blocked" } : CATS.other); return lang === "en" ? x.en : x.lt; }

  root.Planas = {
    build: build, plan: plan, review: review, analyse: analyse, parse: parse,
    ymd: ymd, addDays: addDays, toDate: toDate, isWorkday: isWorkday, nextWorkday: nextWorkday, prevWorkday: prevWorkday,
    lastWorkdayAtOrBefore: lastWorkdayAtOrBefore, workdaysBetween: workdaysBetween, daysBetween: daysBetween, shiftMinutes: shiftMinutes,
    stKey: stKey, KEYS: KEYS, CATS: CATS, keyName: keyName, catName: catName, norm: norm, r1: r1, uid: uid, orderRemainH: orderRemainH, activeAdj: activeAdj
  };
})(typeof window !== "undefined" ? window : globalThis);
