/* ============================================================
   legacy-polyfills.js — what an older tablet's engine is missing

   Babel lowers SYNTAX; it does not add METHODS. These are the handful the
   app calls that arrived after the browsers this build targets, written so
   they parse on those browsers too (var, no arrows, no template literals).

   Every one is guarded: on a current browser this file does nothing.
   ============================================================ */
(function () {
  "use strict";

  if (!Object.entries) {
    Object.entries = function (o) {
      var ks = Object.keys(o),
        out = [],
        i;
      for (i = 0; i < ks.length; i++) out.push([ks[i], o[ks[i]]]);
      return out;
    };
  }
  if (!Object.values) {
    Object.values = function (o) {
      var ks = Object.keys(o),
        out = [],
        i;
      for (i = 0; i < ks.length; i++) out.push(o[ks[i]]);
      return out;
    };
  }
  if (!Object.fromEntries) {
    Object.fromEntries = function (list) {
      var out = {},
        i,
        p;
      for (i = 0; i < list.length; i++) {
        p = list[i];
        out[p[0]] = p[1];
      }
      return out;
    };
  }
  if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {
      var d = depth === undefined ? 1 : depth;
      return this.reduce(function (acc, v) {
        return acc.concat(Array.isArray(v) && d > 1 ? v.flat(d - 1) : v);
      }, []);
    };
  }
  if (!Array.prototype.flatMap) {
    Array.prototype.flatMap = function (fn, thisArg) {
      return this.map(fn, thisArg).flat();
    };
  }
  if (!String.prototype.padStart) {
    String.prototype.padStart = function (len, pad) {
      var s = String(this),
        p = pad === undefined ? " " : String(pad);
      if (s.length >= len || !p) return s;
      var fill = "";
      while (fill.length < len - s.length) fill += p;
      return fill.slice(0, len - s.length) + s;
    };
  }
  if (!String.prototype.padEnd) {
    String.prototype.padEnd = function (len, pad) {
      var s = String(this),
        p = pad === undefined ? " " : String(pad);
      if (s.length >= len || !p) return s;
      var fill = "";
      while (fill.length < len - s.length) fill += p;
      return s + fill.slice(0, len - s.length);
    };
  }
  if (!String.prototype.trimEnd) {
    String.prototype.trimEnd = function () {
      return String(this).replace(/\s+$/, "");
    };
  }
  if (!String.prototype.trimStart) {
    String.prototype.trimStart = function () {
      return String(this).replace(/^\s+/, "");
    };
  }
  if (typeof Promise !== "undefined" && !Promise.allSettled) {
    Promise.allSettled = function (list) {
      return Promise.all(Array.prototype.map.call(list, function (p) {
        return Promise.resolve(p).then(function (value) {
          return {
            status: "fulfilled",
            value: value
          };
        }, function (reason) {
          return {
            status: "rejected",
            reason: reason
          };
        });
      }));
    };
  }

  /* used to walk up from an event target all over the app */
  if (typeof Element !== "undefined" && !Element.prototype.closest) {
    var matches = Element.prototype.matches || Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    Element.prototype.matches = matches;
    Element.prototype.closest = function (sel) {
      var el = this;
      while (el && el.nodeType === 1) {
        if (matches.call(el, sel)) return el;
        el = el.parentElement || el.parentNode;
      }
      return null;
    };
  }
  if (typeof NodeList !== "undefined" && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = Array.prototype.forEach;
  }
})();