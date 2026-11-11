/* ============================================================
   project-files.js — emails and attachments on the project sheet,
   the project document (PDF) and its copy in the project's OneDrive folder.

   Written with plain Promises (no async/await, no ?.) because this file is
   loaded on the older shop tablets too, and a syntax error here would stop
   the whole app there. The heavy parts — the PDF engine, the Outlook .msg
   reader and the Microsoft sign-in — are fetched only when first used.
   ============================================================ */
"use strict";

function _pfLt(en, lt) {
  return typeof I18N !== "undefined" && I18N.lang === "lt" ? lt : en;
}
function _pfLoadScript(src) {
  return new Promise(function (resolve, reject) {
    if (document.querySelector('script[data-src="' + src + '"]')) {
      var wait = function (n) {
        var el = document.querySelector('script[data-src="' + src + '"]');
        if (el && el.dataset.ok) return resolve();
        if (n > 200) return reject(new Error("Could not load " + src));
        setTimeout(function () { wait(n + 1); }, 50);
      };
      return wait(0);
    }
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.dataset.src = src;
    s.onload = function () { s.dataset.ok = "1"; resolve(); };
    s.onerror = function () { reject(new Error("Could not load " + src.split("/").slice(-1)[0] + " — check the internet connection")); };
    document.head.appendChild(s);
  });
}
function _pfBlobToDataUrl(blob) {
  return new Promise(function (resolve) {
    var r = new FileReader();
    r.onload = function () { resolve(r.result); };
    r.onerror = function () { resolve(null); };
    r.readAsDataURL(blob);
  });
}
function _pfBlobToBuffer(blob) {
  if (blob.arrayBuffer) return blob.arrayBuffer();
  return new Promise(function (resolve, reject) {
    var r = new FileReader();
    r.onload = function () { resolve(r.result); };
    r.onerror = function () { reject(r.error); };
    r.readAsArrayBuffer(blob);
  });
}
function _pfFmtDateTime(ts) {
  if (!ts) return "—";
  var d = new Date(ts);
  var p = function (n) { return (n < 10 ? "0" : "") + n; };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes());
}
function _pfFmtDate(ts) {
  return ts ? _pfFmtDateTime(ts).slice(0, 10) : "—";
}
function _pfSize(n) {
  if (!n && n !== 0) return "";
  if (n < 1024) return n + " B";
  if (n < 1048576) return Math.round(n / 1024) + " KB";
  return (n / 1048576).toFixed(1).replace(".0", "") + " MB";
}

/* ============================================================
   Mail — reads .eml (any mail program, "Save as" / download in Outlook web)
   and .msg (Outlook for Windows: drag the mail to the desktop, then here).
   ============================================================ */
var Mail = {
  MSG_LIB: "https://cdn.jsdelivr.net/npm/@kenjiuno/msgreader@1.29.0/+esm",
  isMailFile(file) {
    var n = String(file && file.name || "").toLowerCase();
    var t = String(file && file.type || "").toLowerCase();
    return /\.(eml|msg)$/.test(n) || t === "message/rfc822" || t === "application/vnd.ms-outlook";
  },
  parse(blob, name) {
    var isMsg = /\.msg$/i.test(name || "") || blob.type === "application/vnd.ms-outlook";
    return _pfBlobToBuffer(blob).then(buf => isMsg ? this._msg(buf) : this._eml(new Uint8Array(buf)));
  },
  /* ---------- .eml (RFC 822 / MIME) ---------- */
  _bin(bytes) {
    var out = "";
    for (var i = 0; i < bytes.length; i += 8192) out += String.fromCharCode.apply(null, bytes.subarray(i, i + 8192));
    return out;
  },
  _bytes(bin) {
    var a = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i) & 255;
    return a;
  },
  _decode(bytes, charset) {
    var cs = String(charset || "utf-8").toLowerCase().replace(/^"|"$/g, "");
    try { return new TextDecoder(cs).decode(bytes); } catch (e) {
      try { return new TextDecoder("utf-8").decode(bytes); } catch (e2) { return this._bin(bytes); }
    }
  },
  _qp(bin) {
    return bin.replace(/=\r?\n/g, "").replace(/=([0-9A-Fa-f]{2})/g, (m, h) => String.fromCharCode(parseInt(h, 16)));
  },
  _b64(bin) {
    try { return atob(bin.replace(/[^A-Za-z0-9+/=]/g, "")); } catch (e) { return ""; }
  },
  /* =?utf-8?B?...?= and =?iso-8859-13?Q?...?= in headers */
  _words(s) {
    return String(s || "").replace(/\?=\s+=\?/g, "?==?").replace(/=\?([^?]+)\?([bBqQ])\?([^?]*)\?=/g, (m, cs, enc, txt) => {
      var bin = enc.toUpperCase() === "B" ? this._b64(txt) : this._qp(txt.replace(/_/g, " "));
      return this._decode(this._bytes(bin), cs);
    });
  },
  _headers(block) {
    var h = {};
    var lines = block.replace(/\r?\n[ \t]+/g, " ").split(/\r?\n/);
    for (var i = 0; i < lines.length; i++) {
      var k = lines[i].indexOf(":");
      if (k < 1) continue;
      var key = lines[i].slice(0, k).trim().toLowerCase();
      if (!(key in h)) h[key] = lines[i].slice(k + 1).trim();
    }
    return h;
  },
  _param(v, name) {
    var m = new RegExp("(?:^|;)\\s*" + name + "\\*?=\\s*(\"([^\"]*)\"|([^;]*))", "i").exec(String(v || ""));
    if (!m) return "";
    var val = (m[2] != null ? m[2] : m[3] || "").trim();
    var ext = /^([^']*)'[^']*'(.*)$/.exec(val); // RFC 2231: utf-8''name%C4%85.pdf
    if (ext) { try { return decodeURIComponent(ext[2]); } catch (e) { return ext[2]; } }
    return this._words(val);
  },
  _part(bin, out) {
    var cut = bin.search(/\r?\n\r?\n/);
    var head = cut < 0 ? bin : bin.slice(0, cut);
    var body = cut < 0 ? "" : bin.slice(cut).replace(/^\r?\n\r?\n/, "");
    var h = this._headers(head);
    var ct = h["content-type"] || "text/plain";
    var type = ct.split(";")[0].trim().toLowerCase();
    if (/^multipart\//.test(type)) {
      var b = this._param(ct, "boundary");
      if (b) {
        var pieces = body.split("--" + b);
        for (var i = 1; i < pieces.length; i++) {
          if (/^--/.test(pieces[i])) break;
          this._part(pieces[i].replace(/^\r?\n/, ""), out);
        }
      }
      return h;
    }
    var cte = String(h["content-transfer-encoding"] || "").toLowerCase();
    var raw = cte === "base64" ? this._b64(body) : cte === "quoted-printable" ? this._qp(body) : body;
    var disp = String(h["content-disposition"] || "");
    var fname = this._param(disp, "filename") || this._param(ct, "name");
    var cid = String(h["content-id"] || "").replace(/[<>]/g, "");
    var isAtt = /^attachment/i.test(disp) || (fname && !/^text\/(plain|html)$/.test(type)) || (!/^text\//.test(type) && type !== "message/rfc822");
    if (type === "message/rfc822" && !fname) fname = "forwarded.eml";
    if (isAtt || type === "message/rfc822") {
      var bytes = this._bytes(raw);
      out.atts.push({ name: fname || "attachment", type: type, size: bytes.length, cid: cid, blob: new Blob([bytes], { type: type }) });
    } else if (type === "text/html" && !out.html) {
      out.html = this._decode(this._bytes(raw), this._param(ct, "charset"));
    } else if (type === "text/plain" && !out.text) {
      out.text = this._decode(this._bytes(raw), this._param(ct, "charset"));
    }
    return h;
  },
  _eml(bytes) {
    var out = { text: "", html: "", atts: [] };
    var h = this._part(this._bin(bytes), out);
    var date = Date.parse(h.date || "");
    return Promise.resolve({
      subject: this._words(h.subject || ""),
      from: this._words(h.from || ""),
      to: this._words(h.to || ""),
      cc: this._words(h.cc || ""),
      date: isNaN(date) ? null : date,
      text: out.text,
      html: out.html,
      atts: out.atts
    });
  },
  /* ---------- .msg (Outlook) ---------- */
  _msg(buf) {
    return import(this.MSG_LIB).then(mod => {
      var Reader = mod.default && mod.default.default || mod.default || mod.MSGReader;
      var r = new Reader(buf);
      var d = r.getFileData();
      if (d.error) throw new Error(d.error);
      var who = (x, e) => x && e && x !== e ? x + " <" + e + ">" : x || e || "";
      var rec = (d.recipients || []);
      var list = kind => rec.filter(x => (x.recipType || "to") === kind).map(x => who(x.name, x.smtpAddress || x.email)).join(", ");
      var html = d.bodyHtml || "";
      if (!html && d.html) { try { html = new TextDecoder("utf-8").decode(d.html); } catch (e) {} }
      var atts = (d.attachments || []).filter(a => !a.attachmentHidden).map(a => {
        var c = r.getAttachment(a);
        return { name: c.fileName || a.fileName || "attachment", type: a.attachMimeTag || "application/octet-stream", size: c.content ? c.content.length : 0, cid: a.pidContentId || "", blob: new Blob([c.content || new Uint8Array(0)], { type: a.attachMimeTag || "application/octet-stream" }) };
      });
      var date = Date.parse(d.messageDeliveryTime || d.clientSubmitTime || d.creationTime || "");
      return {
        subject: d.subject || "",
        from: who(d.senderName, d.senderSmtpAddress || d.senderEmail),
        to: list("to"),
        cc: list("cc"),
        date: isNaN(date) ? null : date,
        text: d.body || "",
        html: html,
        atts: atts
      };
    });
  },
  /* what the list shows without opening the file */
  summary(m) {
    var txt = m.text || String(m.html || "").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
    txt = txt.replace(/\s+/g, " ").trim();
    return {
      subject: m.subject || _pfLt("(no subject)", "(be temos)"),
      from: m.from || "",
      to: m.to || "",
      date: m.date || null,
      snippet: txt.slice(0, 400),
      atts: m.atts.filter(a => !a.cid || !/^image\//.test(a.type)).map(a => a.name).slice(0, 20)
    };
  },
  /* a pasted email becomes a real .eml, so it opens in Outlook from OneDrive too */
  buildEml(f) {
    var enc = s => "=?utf-8?B?" + btoa(unescape(encodeURIComponent(s))) + "?=";
    var body = btoa(unescape(encodeURIComponent(f.text || ""))).replace(/(.{76})/g, "$1\r\n");
    var d = f.date ? new Date(f.date) : new Date();
    return [
      "From: " + enc(f.from || ""),
      "To: " + enc(f.to || ""),
      "Subject: " + enc(f.subject || ""),
      "Date: " + d.toUTCString().replace("GMT", "+0000"),
      "MIME-Version: 1.0",
      "Content-Type: text/plain; charset=utf-8",
      "Content-Transfer-Encoding: base64",
      "",
      body
    ].join("\r\n");
  },
  /* ---------- attach to a project ---------- */
  attach(file, orderId, byId) {
    var self = this;
    return Files.attach(file, { orderId: orderId }, byId).then(meta => {
      if (!meta) return meta;
      return self.parse(file, file.name).then(m => {
        meta.email = self.summary(m);
        meta.kind = "email";
        Store.save();
        return meta;
      }).catch(() => {
        meta.kind = "email";
        meta.email = { subject: file.name, from: "", date: null, snippet: _pfLt("Could not read this email — it can still be downloaded.", "Nepavyko perskaityti laiško — jį vis tiek galima atsisiųsti."), atts: [] };
        Store.save();
        return meta;
      });
    });
  },
  pasteModal(orderId, onDone) {
    var now = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    Modal.open(`
      <header><h2>Paste an email</h2><button class="icon-btn" data-close>${icon("x", 15)}</button></header>
      <div class="modal-body">
        <div class="t-caption">Copy the email in Outlook or Gmail and paste it here. It is saved as a real email file (.eml) on the project.</div>
        <div class="field"><label>Subject</label><input class="input" id="pm-subj" placeholder="e.g. Virtuvės brėžinių pataisymai"></div>
        <div class="form-row">
          <div class="field"><label>From</label><input class="input" id="pm-from" placeholder="Name <email>"></div>
          <div class="field"><label>Date</label><input class="input" id="pm-date" type="datetime-local" value="${now}"></div>
        </div>
        <div class="field"><label>Text</label><textarea class="input" id="pm-text" rows="10" placeholder="Paste the email text…"></textarea></div>
      </div>
      <footer>
        <button class="btn ghost" data-close>Cancel</button>
        <button class="btn primary" id="pm-save">Save email</button>
      </footer>`, modal => {
      $$("[data-close]", modal).forEach(b => b.onclick = () => { Modal.close(); if (onDone) onDone(false); });
      $("#pm-text", modal).addEventListener("paste", () => {
        setTimeout(() => {
          var t = $("#pm-text", modal).value;
          var subj = /^(?:Subject|Tema|Dalykas):\s*(.+)$/im.exec(t);
          var from = /^(?:From|Nuo|Siuntėjas):\s*(.+)$/im.exec(t);
          if (subj && !$("#pm-subj", modal).value) $("#pm-subj", modal).value = subj[1].trim();
          if (from && !$("#pm-from", modal).value) $("#pm-from", modal).value = from[1].trim();
        }, 0);
      });
      $("#pm-save", modal).onclick = () => {
        var text = $("#pm-text", modal).value.trim();
        var subject = $("#pm-subj", modal).value.trim();
        if (!text && !subject) { $("#pm-text", modal).focus(); return; }
        var dv = $("#pm-date", modal).value;
        var eml = this.buildEml({ subject: subject, from: $("#pm-from", modal).value.trim(), date: dv ? Date.parse(dv) : Date.now(), text: text });
        var safe = (subject || "laiskas").replace(/[\\/:*?"<>|#%]+/g, "").slice(0, 60).trim() || "laiskas";
        var file = new File([eml], safe + ".eml", { type: "message/rfc822" });
        $("#pm-save", modal).disabled = true;
        this.attach(file, orderId, App.me.id).then(() => {
          Modal.close(true);
          Toast.show(_pfLt("Email saved", "Laiškas išsaugotas"), { emoji: "check" });
          if (onDone) onDone(true);
        }).catch(e => {
          $("#pm-save", modal).disabled = false;
          Toast.show(e.message || String(e), { emoji: "alert", ms: 5000 });
        });
      };
      setTimeout(() => $("#pm-subj", modal).focus(), 60);
    });
  },
  /* ---------- reading one ---------- */
  view(fileId, onClose) {
    var f = D.file(fileId);
    if (!f) return;
    var root = $("#modal-root");
    var e = f.email || {};
    var close = () => { root.innerHTML = ""; if (onClose) onClose(); };
    root.innerHTML = `<div class="file-view mail-view" id="file-view">
      <div class="fv-bar">
        <span class="mail-ico">${icon("send", 15)}</span>
        <b>${esc(e.subject || f.name)}</b>
        <span class="grow"></span>
        <a class="btn ghost" id="fv-dl" download="${esc(f.name)}">${icon("import", 13)} <span>Download</span></a>
        <button class="icon-btn" id="fv-close">${icon("x", 17)}</button>
      </div>
      <div class="mail-sheet" id="mail-sheet"><div class="sync-spinner"></div></div>
    </div>`;
    if (typeof I18N !== "undefined") I18N.translate(root);
    $("#fv-close", root).onclick = close;
    $("#file-view", root).onclick = ev => { if (ev.target.id === "file-view") close(); };
    var urls = [];
    Files.url(fileId).then(url => {
      var box = $("#mail-sheet", root);
      if (!box) return;
      if (!url) {
        box.innerHTML = `<div class="fv-missing">${icon("cloud-off", 26)}<b>The email file is not on this device yet</b></div>`;
        return;
      }
      $("#fv-dl", root).href = url;
      return fetch(url).then(r => r.blob()).then(blob => this.parse(blob, f.name)).then(m => {
        var cidMap = {};
        m.atts.forEach(a => { if (a.cid) { var u = URL.createObjectURL(a.blob); urls.push(u); cidMap[a.cid] = u; } });
        var shown = m.atts.filter(a => !(a.cid && /^image\//.test(a.type) && m.html && m.html.indexOf("cid:" + a.cid) >= 0));
        box.innerHTML = `
          <div class="mail-head">
            <h2>${esc(m.subject || e.subject || f.name)}</h2>
            <div class="mail-meta">
              <div><span>From</span><b>${esc(m.from || "—")}</b></div>
              ${m.to ? `<div><span>To</span><b>${esc(m.to)}</b></div>` : ""}
              ${m.cc ? `<div><span>Cc</span><b>${esc(m.cc)}</b></div>` : ""}
              <div><span>Date</span><b>${esc(_pfFmtDateTime(m.date))}</b></div>
            </div>
            ${shown.length ? `<div class="mail-atts">${shown.map((a, i) => `<span class="mail-att">${icon(/^image\//.test(a.type) ? "image" : "box", 13)}<span>${esc(a.name)}</span><small>${_pfSize(a.size)}</small>
              <button class="mini-act" data-ma-dl="${i}">Download</button>
              ${App.can("orders.edit") ? `<button class="mini-act" data-ma-add="${i}">Add to project</button>` : ""}</span>`).join("")}</div>` : ""}
          </div>
          ${m.html ? `<iframe class="mail-body" sandbox="allow-popups allow-popups-to-escape-sandbox" id="mail-frame"></iframe>` : `<pre class="mail-text">${esc(m.text || "")}</pre>`}`;
        if (typeof I18N !== "undefined") I18N.translate(box);
        var fr = $("#mail-frame", box);
        if (fr) {
          var html = m.html.replace(/cid:([^"'\s)>]+)/g, (x, c) => cidMap[c] || x);
          fr.srcdoc = `<base target="_blank"><style>body{font:14px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;color:#1d1d1f;margin:16px;word-wrap:break-word}img{max-width:100%;height:auto}</style>` + html;
        }
        $$("[data-ma-dl]", box).forEach(b => b.onclick = () => {
          var a = shown[+b.dataset.maDl];
          var u = URL.createObjectURL(a.blob);
          urls.push(u);
          var l = document.createElement("a");
          l.href = u; l.download = a.name; l.click();
        });
        $$("[data-ma-add]", box).forEach(b => b.onclick = () => {
          var a = shown[+b.dataset.maAdd];
          b.disabled = true;
          var file = new File([a.blob], a.name, { type: a.type });
          (this.isMailFile(file) ? this.attach(file, f.orderId, App.me.id) : Files.attach(file, { orderId: f.orderId }, App.me.id)).then(() => {
            b.textContent = "✓";
            Toast.show(`${a.name} ✓`, { emoji: "check" });
          }).catch(err => { b.disabled = false; Toast.show(err.message, { emoji: "alert", ms: 5000 }); });
        });
      });
    }).catch(err => {
      var box = $("#mail-sheet", root);
      if (box) box.innerHTML = `<div class="fv-missing">${icon("alert", 26)}<b>${esc(err && err.message || "Could not read this email")}</b><span>Download it and open it in Outlook.</span></div>`;
    });
  }
};

/* ============================================================
   The project's emails & attachments panel (on the project sheet)
   ============================================================ */
var ProjectFiles = {
  ACCEPT: "",
  emails(orderId) {
    return D.filesFor({ orderId: orderId }).filter(f => f.kind === "email").sort((a, b) => ((b.email && b.email.date) || b.at) - ((a.email && a.email.date) || a.at));
  },
  others(orderId) {
    return D.filesFor({ orderId: orderId }).filter(f => f.kind !== "email");
  },
  html(o, canEdit) {
    var mails = this.emails(o.id);
    var rest = this.others(o.id);
    return `<div class="pf-panel">
      <div class="t-label pf-title"><span class="grow">Emails &amp; attachments</span>${mails.length + rest.length ? `<span class="t-caption">${mails.length + rest.length}</span>` : ""}</div>
      ${mails.length ? `<div class="pf-mails">${mails.map(f => {
        var e = f.email || {};
        return `<button class="pf-mail" data-mail="${f.id}">
          <span class="pf-mail-ico">${icon("send", 14)}</span>
          <span class="grow">
            <span class="pf-mail-top"><b>${esc(e.subject || f.name)}</b><span class="when">${e.date ? fmtDate(e.date) : ""}</span></span>
            <span class="pf-mail-from">${esc(e.from || "")}${e.atts && e.atts.length ? ` · 📎 ${e.atts.length}` : ""}</span>
            ${e.snippet ? `<span class="pf-mail-snip">${esc(e.snippet.slice(0, 160))}</span>` : ""}
          </span>
          ${canEdit ? `<span class="rm" data-file-rm="${f.id}" title="Remove">${icon("x", 11)}</span>` : ""}
        </button>`;
      }).join("")}</div>` : ""}
      <div class="od-files">
        ${rest.length ? Files.chipsHtml(rest, { canEdit: canEdit }) : mails.length ? "" : `<span class="t-caption">Nothing attached yet</span>`}
      </div>
      ${canEdit ? `<div class="file-drop pf-drop" data-drop="pf-in">
          <span class="ico">${icon("import", 17)}</span>
          <span><b>Add emails or files</b><span class="t-caption">Drop .msg / .eml emails, PDFs, drawings, photos, any file — or click to choose</span></span>
          <input type="file" id="pf-in" multiple hidden>
        </div>
        <div class="pf-actions"><button class="add-inline" id="pf-paste">${icon("send", 12)} Paste an email…</button></div>` : ""}
    </div>`;
  },
  add(o, files) {
    var list = [].slice.call(files || []);
    var done = 0;
    var errs = [];
    var next = () => {
      if (!list.length) return Promise.resolve();
      var f = list.shift();
      var p = Mail.isMailFile(f) ? Mail.attach(f, o.id, App.me.id) : Files.attach(f, { orderId: o.id }, App.me.id);
      return p.then(() => { done++; }).catch(e => { errs.push(e.message || String(e)); }).then(next);
    };
    return next().then(() => {
      if (errs.length) Toast.show(errs[0], { emoji: "alert", ms: 6000 });
      else if (done) Toast.show(done === 1 ? _pfLt("Added", "Pridėta") : _pfLt(done + " files added", "Pridėta failų: " + done), { emoji: "check" });
      return done;
    });
  },
  bind(root, o, redraw) {
    var self = this;
    $$("[data-mail]", root).forEach(b => b.onclick = ev => {
      if (ev.target.closest("[data-file-rm]")) return;
      Mail.view(b.dataset.mail, () => { if (typeof OrderDetail !== "undefined") OrderDetail.sheetModal(o.id); });
    });
    $$(".pf-mail [data-file-rm]", root).forEach(b => b.onclick = ev => {
      ev.stopPropagation();
      var f = D.file(b.dataset.fileRm);
      if (!f || !confirm(_pfLt("Remove ", "Pašalinti ") + ((f.email && f.email.subject) || f.name) + "?")) return;
      Files.remove(f.id, App.me.id).then(() => { App.render(); redraw(); });
    });
    var zone = $('[data-drop="pf-in"]', root),
      input = $("#pf-in", root);
    if (zone && input) {
      zone.onclick = () => input.click();
      zone.ondragover = e => { e.preventDefault(); zone.classList.add("over"); };
      zone.ondragleave = () => zone.classList.remove("over");
      zone.ondrop = e => {
        e.preventDefault();
        zone.classList.remove("over");
        if (e.dataTransfer.files.length) self.add(o, e.dataTransfer.files).then(() => { App.render(); Drawer.refresh(); redraw(); });
      };
      input.onchange = () => {
        var fl = [].slice.call(input.files);
        input.value = "";
        if (fl.length) self.add(o, fl).then(() => { App.render(); Drawer.refresh(); redraw(); });
      };
    }
    var paste = $("#pf-paste", root);
    if (paste) paste.onclick = () => Mail.pasteModal(o.id, () => { App.render(); redraw(); });
  }
};

/* ============================================================
   ProjectDoc — the whole project as one clear A4 PDF.
   The same file is shown in the app and written to OneDrive.
   ============================================================ */
var ProjectDoc = {
  LIB: "https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/pdfmake.min.js",
  FONTS: "https://cdn.jsdelivr.net/npm/pdfmake@0.2.10/build/vfs_fonts.js",
  ACCENT: "#0a66d6",
  _logo: null,
  load() {
    if (window.pdfMake && window.pdfMake.vfs) return Promise.resolve(window.pdfMake);
    return _pfLoadScript(this.LIB).then(() => _pfLoadScript(this.FONTS)).then(() => window.pdfMake);
  },
  fileName(o) {
    return (o.num + " " + _pfLt("Project sheet", "Projekto kortele")).replace(/[\\/:*?"<>|#%]+/g, "") + ".pdf";
  },
  _t(s) {
    var x = typeof I18N !== "undefined" && I18N.t ? I18N.t(String(s || "")) : String(s || "");
    /* the PDF font has no arrows or emoji */
    return x.replace(/\*\*/g, "").replace(/→/g, "->").replace(/←/g, "<-").replace(/[\u2190-\u21FF\u2600-\u27BF]|[\uD83C-\uDBFF][\uDC00-\uDFFF]/g, "");
  },
  _logoData() {
    if (this._logo !== null) return Promise.resolve(this._logo);
    return fetch("icons/icon-192.png").then(r => r.ok ? r.blob() : null).then(b => b ? _pfBlobToDataUrl(b) : "").catch(() => "").then(d => { this._logo = d || ""; return this._logo; });
  },
  /* photos and drawings, shrunk so the PDF stays small */
  _image(f) {
    return Files.url(f.id).then(u => {
      if (!u) return f.thumb || null;
      return new Promise(resolve => {
        var img = new Image();
        img.onload = () => {
          var max = 1400, w = img.naturalWidth, h = img.naturalHeight;
          var k = Math.min(1, max / Math.max(w, h));
          var c = document.createElement("canvas");
          c.width = Math.round(w * k); c.height = Math.round(h * k);
          var ctx = c.getContext("2d");
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
          ctx.drawImage(img, 0, 0, c.width, c.height);
          resolve(c.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => resolve(f.thumb || null);
        img.src = u;
      });
    }).catch(() => f.thumb || null);
  },
  definition(orderId) {
    var o = D.order(orderId);
    if (!o) return Promise.reject(new Error("No such project"));
    var files = D.filesFor({ orderId: o.id });
    var imgs = files.filter(f => Files.isImage(f.type) && f.kind !== "email");
    var tasks = [this._logoData()];
    for (var i = 0; i < imgs.length; i++) tasks.push(this._image(imgs[i]));
    return Promise.all(tasks).then(res => this._build(o, files, imgs, res[0], res.slice(1)));
  },
  _build(o, files, imgs, logo, imgData) {
    var L = _pfLt;
    var A = this.ACCENT;
    var isEng = o.type === "eng";
    var st = D.orderStatus(o);
    var p = D.progress(o);
    var cur = D.currentOp(o);
    var crew = D.orderResponsible(o).map(id => D.member(id)).filter(Boolean);
    var pf = o.portfolioId ? D.portfolio(o.portfolioId) : null;
    var link = D.projectLink(o);
    var now = Date.now();
    var gray = "#6e6e73";
    var c = [];
    var section = (title, count) => {
      c.push({ margin: [0, 16, 0, 6], table: { widths: ["*"], body: [[{ text: [{ text: title.toUpperCase(), bold: true, color: A, fontSize: 9.5, characterSpacing: 0.6 }, count != null ? { text: "   " + count, color: gray, fontSize: 9 } : ""], border: [false, false, false, true], borderColor: [null, null, null, "#d2d2d7"], margin: [0, 0, 0, 3] }]] }, layout: { hLineColor: () => "#d2d2d7", hLineWidth: (i) => i === 1 ? 0.8 : 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0 } });
    };
    var empty = t => c.push({ text: t, color: gray, italics: true, fontSize: 9, margin: [0, 0, 0, 2] });
    var table = (widths, head, rows) => {
      c.push({
        table: { headerRows: 1, widths: widths, body: [head.map(h => ({ text: h, bold: true, fontSize: 8.5, color: gray, fillColor: "#f5f5f7" }))].concat(rows) },
        layout: { hLineWidth: (i, n) => i === 0 || i === n.table.body.length ? 0 : 0.5, hLineColor: () => "#e5e5ea", vLineWidth: () => 0, paddingTop: () => 4, paddingBottom: () => 4, paddingLeft: (i) => i === 0 ? 6 : 5, paddingRight: () => 5 },
        fontSize: 9.5
      });
    };

    /* ---- header ---- */
    c.push({
      columns: [
        { width: "*", columns: [logo ? { image: logo, width: 30, margin: [0, 0, 8, 0] } : { text: "" }, { width: "*", stack: [{ text: "DĖDĖS BALDAI", bold: true, fontSize: 11, characterSpacing: 1 }, { text: L("Project sheet", "Projekto kortelė"), color: gray, fontSize: 9 }], margin: [0, 3, 0, 0] }], columnGap: 0 },
        { width: "auto", stack: [{ text: o.num, bold: true, fontSize: 12, alignment: "right" }, { text: L("Updated ", "Atnaujinta ") + _pfFmtDateTime(now), fontSize: 8.5, color: gray, alignment: "right" }] }
      ],
      margin: [0, 0, 0, 14]
    });
    c.push({ text: o.product || o.num, fontSize: 22, bold: true, margin: [0, 0, 0, 2] });
    if (o.client && o.client !== o.product) c.push({ text: o.client, fontSize: 12, color: gray, margin: [0, 0, 0, 10] });
    else c.push({ text: "", margin: [0, 0, 0, 8] });

    /* ---- facts ---- */
    var facts = [
      [L("Client", "Klientas"), o.client || "—"],
      [L("Portfolio", "Portfelis"), pf ? pf.name : "—"],
      [L("Status", "Būsena"), this._t(D.statusLabelFor ? D.statusLabelFor(o, st) : D.statusLabel[st])],
      [isEng ? L("Stage", "Etapas") : L("Now at", "Dabar"), cur ? (D.station(cur.stationId) || {}).name || "—" : "—"],
      [L("Due", "Terminas"), _pfFmtDate(o.due)],
      [L("Priority", "Prioritetas"), this._t({ rush: "Rush", high: "High", low: "Low" }[o.priority] || "Normal")],
      [L("Progress", "Eiga"), p.done + " / " + p.total + L(" tasks", " užduočių")],
      [L("Responsible", "Atsakingi"), crew.map(m => m.name).join(", ") || "—"],
      [L("Created", "Sukurta"), _pfFmtDate(o.createdAt)],
      [L("Type", "Tipas"), isEng ? L("Engineering", "Projektavimas") : L("Production", "Gamyba")]
    ];
    var fbody = [];
    for (var i = 0; i < facts.length; i += 2) {
      var row = [];
      for (var j = 0; j < 2; j++) {
        var f = facts[i + j];
        row.push(f ? { stack: [{ text: f[0].toUpperCase(), fontSize: 7, color: gray, bold: true, characterSpacing: 0.4 }, { text: f[1], fontSize: 10.5, bold: true, margin: [0, 1, 0, 0] }], fillColor: "#f5f5f7" } : { text: "", fillColor: "#f5f5f7" });
      }
      fbody.push(row);
    }
    c.push({ table: { widths: ["*", "*"], body: fbody }, layout: { hLineWidth: () => 2, vLineWidth: () => 2, hLineColor: () => "#ffffff", vLineColor: () => "#ffffff", paddingTop: () => 6, paddingBottom: () => 6, paddingLeft: () => 9 } });
    if (link) c.push({ text: [{ text: "OneDrive: ", color: gray }, { text: link, link: link, color: A, decoration: "underline" }], fontSize: 8.5, margin: [0, 6, 0, 0] });

    /* ---- appliances ---- */
    var aps = D.appliances(o);
    section(L("Appliances", "Buitinė technika"), aps.length || null);
    if (aps.length) table([95, "*", 62, "*"], [L("Type", "Tipas"), L("Model", "Modelis"), L("Supplied by", "Tiekia"), L("Notes", "Pastaba")], aps.map(a => [
      { text: a.type, bold: true },
      a.model ? (a.link ? { text: a.model, link: a.link, color: A } : a.model) : { text: L("model not known yet", "modelis dar nežinomas"), color: "#c25e00", italics: true },
      a.by === "us" ? L("We order", "Užsakome mes") : L("Client", "Klientas"),
      { text: a.note || "", color: "#3a3a3c" }
    ]));
    else empty(L("No appliances noted", "Buitinė technika neįrašyta"));

    /* ---- steps ---- */
    section(isEng ? L("Stages", "Etapai") : L("Production steps", "Gamybos etapai"), p.done + "/" + p.total);
    var stLabel = { queued: L("Waiting", "Laukia"), running: L("In progress", "Vykdoma"), paused: L("Paused", "Pristabdyta"), blocked: L("Problem", "Problema"), done: L("Done", "Atlikta") };
    var stColor = { done: "#1e8e3e", running: A, blocked: "#d70015", paused: "#c25e00" };
    table(["*", 120, 70, 70], [L("Step", "Etapas"), L("Who", "Kas"), L("Status", "Būsena"), L("Finished", "Užbaigta")], o.ops.map(op => {
      var s = D.station(op.stationId) || { name: op.stationId };
      var item = D.item(o, op.itemId);
      var who = (D.opAssignees ? D.opAssignees(op) : []).map(m => m.name).join(", ");
      return [
        { text: [{ text: s.name, bold: true }, item && o.items.length > 1 ? { text: "  " + item.name + (op.group ? " · " + op.group : ""), color: gray, fontSize: 8.5 } : op.group ? { text: "  " + op.group, color: gray, fontSize: 8.5 } : ""] },
        who || "—",
        { text: stLabel[op.status] || op.status, color: stColor[op.status] || "#3a3a3c", bold: op.status !== "queued" },
        op.completedAt ? _pfFmtDate(op.completedAt) : ""
      ];
    }));
    var blocked = o.ops.filter(op => op.status === "blocked" && op.blockNote);
    blocked.forEach(op => c.push({ text: [{ text: "! " + ((D.station(op.stationId) || {}).name || "") + ": ", bold: true, color: "#d70015" }, op.blockNote], fontSize: 9, margin: [0, 4, 0, 0] }));

    /* ---- details ---- */
    var dets = D.details(o);
    section(L("Details — ordered and missing", "Detalės — kas užsakyta, ko trūksta"), dets.length || null);
    if (dets.length) {
      var drows = [];
      D.detailsByCategory(o).forEach(g => g.rows.forEach(d => drows.push([
        { text: this._t(g.label), color: gray },
        { text: d.label, bold: true },
        { text: this._t(D.DETAIL_LABEL[d.state] || d.state), color: d.state === "here" ? "#1e8e3e" : D.detailLate(d) ? "#d70015" : "#3a3a3c" },
        d.value || "",
        d.state === "ordered" && d.due ? _pfFmtDate(d.due) : ""
      ])));
      table([75, "*", 62, "*", 62], [L("Category", "Kategorija"), L("What", "Kas"), L("Status", "Būsena"), L("Supplier / code", "Tiekėjas / kodas"), L("Expected", "Laukiama iki")], drows);
    } else empty(L("Nothing noted", "Nieko neįrašyta"));

    /* ---- materials ---- */
    var mats = (o.materials || []).filter(l => D.material(l.materialId));
    if (mats.length) {
      section(L("Materials", "Medžiagos"), mats.length);
      table(["*", 80, 80], [L("Material", "Medžiaga"), L("Quantity", "Kiekis"), L("Used", "Sunaudota")], mats.map(l => {
        var m = D.material(l.materialId);
        return [{ text: m.name, bold: true }, l.qty + " " + (m.unit || ""), l.consumed ? L("yes", "taip") : ""];
      }));
    }

    /* ---- remarks & notes ---- */
    var rem = o.comments || [];
    section(L("Remarks", "Pastabos"), rem.length || null);
    if (rem.length) rem.forEach(r => {
      var m = D.member(r.by);
      c.push({ stack: [{ text: [{ text: m ? m.name : "?", bold: true }, { text: "   " + _pfFmtDateTime(r.ts), color: gray, fontSize: 8.5 }], fontSize: 9.5 }, { text: r.text, fontSize: 9.5, margin: [0, 1, 0, 0] }], margin: [0, 0, 0, 7] });
    });
    else empty(L("No remarks", "Pastabų nėra"));
    if (o.notes) {
      section(L("Notes", "Užrašai"));
      c.push({ text: o.notes, fontSize: 9.5 });
    }

    /* ---- emails ---- */
    var mails = files.filter(f => f.kind === "email").sort((a, b) => ((a.email && a.email.date) || a.at) - ((b.email && b.email.date) || b.at));
    section(L("Emails", "Laiškai"), mails.length || null);
    if (mails.length) mails.forEach(f => {
      var e = f.email || {};
      c.push({
        table: { widths: ["*"], body: [[{ stack: [
          { columns: [{ text: e.subject || f.name, bold: true, fontSize: 10 }, { text: _pfFmtDateTime(e.date || f.at), width: "auto", fontSize: 8.5, color: gray }] },
          { text: e.from || "", fontSize: 8.5, color: gray, margin: [0, 1, 0, 3] },
          e.snippet ? { text: e.snippet.length > 380 ? e.snippet.slice(0, 380) + "…" : e.snippet, fontSize: 9, color: "#3a3a3c" } : { text: "" },
          e.atts && e.atts.length ? { text: L("Attachments: ", "Priedai: ") + e.atts.join(", "), fontSize: 8.5, color: gray, margin: [0, 3, 0, 0] } : { text: "" },
          { text: L("File: ", "Failas: ") + f.name, fontSize: 7.5, color: "#aeaeb2", margin: [0, 3, 0, 0] }
        ] }]] },
        layout: { hLineWidth: () => 0.6, vLineWidth: (i) => i === 0 ? 2.5 : 0.6, vLineColor: (i) => i === 0 ? A : "#e5e5ea", hLineColor: () => "#e5e5ea", paddingLeft: () => 9, paddingTop: () => 6, paddingBottom: () => 6 },
        margin: [0, 0, 0, 6],
        unbreakable: true
      });
    });
    else empty(L("No emails attached", "Laiškų nėra"));

    /* ---- attachments ---- */
    var other = files.filter(f => f.kind !== "email");
    section(L("Attachments", "Priedai"), other.length || null);
    if (other.length) table(["*", 55, 100, 62], [L("File", "Failas"), L("Size", "Dydis"), L("Added by", "Pridėjo"), L("Date", "Data")], other.map(f => [{ text: f.name, bold: true }, _pfSize(f.size), (D.member(f.by) || {}).name || "", _pfFmtDate(f.at)]));
    else empty(L("No attachments", "Priedų nėra"));

    /* ---- pictures ---- */
    var pics = [];
    imgs.forEach((f, i) => { if (imgData[i]) pics.push({ f: f, d: imgData[i] }); });
    if (pics.length) {
      section(L("Drawings & photos", "Brėžiniai ir nuotraukos"), pics.length);
      for (var k = 0; k < pics.length; k += 2) {
        var cols = [];
        for (var q = 0; q < 2; q++) {
          var it = pics[k + q];
          cols.push(it ? { width: "*", stack: [{ image: it.d, fit: [250, 230], alignment: "center" }, { text: it.f.name, fontSize: 8, color: gray, alignment: "center", margin: [0, 3, 0, 0] }] } : { width: "*", text: "" });
        }
        c.push({ columns: cols, columnGap: 14, margin: [0, 0, 0, 12], unbreakable: true });
      }
    }

    /* ---- history ---- */
    var hist = D.orderHistory(o.id).slice(0, 40);
    if (hist.length) {
      section(L("History", "Istorija"), hist.length);
      table([70, 80, "*"], [L("When", "Kada"), L("Who", "Kas"), L("What", "Kas padaryta")], hist.map(a => [{ text: _pfFmtDateTime(a.ts), color: gray, fontSize: 8.5 }, { text: (D.member(a.who) || {}).name || "", fontSize: 8.5 }, { text: this._t(a.text).replace(/<[^>]+>/g, ""), fontSize: 8.5 }]));
    }

    var title = o.num + " · " + (o.product || "");
    return {
      pageSize: "A4",
      pageMargins: [40, 36, 40, 44],
      info: { title: title, author: "Dėdės Baldai — ShopFlow", subject: L("Project sheet", "Projekto kortelė") },
      defaultStyle: { font: "Roboto", fontSize: 10, color: "#1d1d1f", lineHeight: 1.18 },
      footer: (page, pages) => ({ columns: [{ text: title, fontSize: 7.5, color: "#aeaeb2" }, { text: L("Page ", "Psl. ") + page + " / " + pages, alignment: "right", fontSize: 7.5, color: "#aeaeb2" }], margin: [40, 14, 40, 0] }),
      content: c
    };
  },
  blob(orderId) {
    return Promise.all([this.load(), this.definition(orderId)]).then(r => new Promise((resolve, reject) => {
      try { r[0].createPdf(r[1]).getBlob(b => resolve(b)); } catch (e) { reject(e); }
    }));
  },
  /* the document, on screen, with Download / Print */
  show(orderId, onClose) {
    var o = D.order(orderId);
    if (!o) return;
    var root = $("#modal-root");
    var close = () => { root.innerHTML = ""; if (onClose) onClose(); };
    root.innerHTML = `<div class="file-view" id="file-view">
      <div class="fv-bar">
        <b>${esc(this.fileName(o))}</b>
        <span class="grow"></span>
        <a class="btn ghost" id="fv-dl" download="${esc(this.fileName(o))}">${icon("import", 13)} <span>Download</span></a>
        <button class="icon-btn" id="fv-close">${icon("x", 17)}</button>
      </div>
      <div class="fv-body" id="fv-body"><div class="sync-spinner"></div></div>
    </div>`;
    if (typeof I18N !== "undefined") I18N.translate(root);
    $("#fv-close", root).onclick = close;
    this.blob(orderId).then(b => {
      var body = $("#fv-body", root);
      if (!body) return;
      var u = URL.createObjectURL(b);
      $("#fv-dl", root).href = u;
      body.innerHTML = `<iframe src="${u}" title="PDF"></iframe>`;
    }).catch(e => {
      var body = $("#fv-body", root);
      if (body) body.innerHTML = `<div class="fv-missing">${icon("alert", 26)}<b>${esc(e && e.message || "Could not build the document")}</b></div>`;
    });
  }
};

/* ============================================================
   OneDrive — keeps a "Projekto kortelė" folder inside each project's
   OneDrive folder: the PDF, the .xlsx and every email/attachment.

   Writing to OneDrive needs a Microsoft sign-in, made once per computer
   (Nustatymai → OneDrive). Whichever signed-in computer has ShopFlow open
   rewrites the folder a little after something on the project changes —
   including changes made on the shop tablets, which arrive through sync.
   ============================================================ */
var OneDrive = {
  MSAL: "https://cdn.jsdelivr.net/npm/@azure/msal-browser@3.28.1/lib/msal-browser.min.js",
  GRAPH: "https://graph.microsoft.com/v1.0",
  SCOPES: ["Files.ReadWrite.All", "User.Read"],
  SUB: "Projekto kortelė",
  ATT: "Priedai",
  KEY: "shopflow.od.account",
  WAIT_MS: 20000,
  _app: null,
  _acct: null,
  _busy: false,
  _timer: null,
  _status: {},
  cfg() {
    return Store.state.oneDrive || {};
  },
  clientId() {
    return String(this.cfg().clientId || "").trim();
  },
  /* cheap check, so devices that never signed in never load the library */
  signedIn() {
    try { return !!localStorage.getItem(this.KEY) && !!this.clientId(); } catch (e) { return false; }
  },
  accountName() {
    try { return localStorage.getItem(this.KEY) || ""; } catch (e) { return ""; }
  },
  _redirect() {
    return location.origin + location.pathname.replace(/[^/]*$/, "") + "ms-auth.html";
  },
  ready() {
    if (this._app) return Promise.resolve(this._app);
    if (!this.clientId()) return Promise.reject(new Error(_pfLt("Add the Microsoft app ID in Settings → OneDrive first", "Pirmiausia įrašykite Microsoft programos ID: Nustatymai → OneDrive")));
    return _pfLoadScript(this.MSAL).then(() => {
      var app = new msal.PublicClientApplication({
        auth: { clientId: this.clientId(), authority: "https://login.microsoftonline.com/common", redirectUri: this._redirect() },
        cache: { cacheLocation: "localStorage" }
      });
      return app.initialize().then(() => app.handleRedirectPromise().catch(() => null)).then(() => {
        this._app = app;
        var all = app.getAllAccounts();
        this._acct = all[0] || null;
        return app;
      });
    });
  },
  signIn() {
    return this.ready().then(app => app.loginPopup({ scopes: this.SCOPES, prompt: "select_account", redirectUri: this._redirect() })).then(r => {
      this._acct = r.account;
      try { localStorage.setItem(this.KEY, r.account.username || r.account.name || "Microsoft"); } catch (e) {}
      this.start();
      return r.account;
    });
  },
  signOut() {
    try { localStorage.removeItem(this.KEY); } catch (e) {}
    var acct = this._acct;
    this._acct = null;
    if (this._app && acct) return this._app.logoutPopup({ account: acct, mainWindowRedirectUri: location.href }).catch(() => {});
    return Promise.resolve();
  },
  token(interactive) {
    return this.ready().then(app => {
      var acct = this._acct || app.getAllAccounts()[0];
      if (!acct) throw new Error(_pfLt("Not signed in to Microsoft", "Neprisijungta prie Microsoft"));
      this._acct = acct;
      return app.acquireTokenSilent({ scopes: this.SCOPES, account: acct }).catch(e => {
        if (!interactive) throw new Error(_pfLt("Microsoft sign-in expired — sign in again in Settings → OneDrive", "Baigėsi Microsoft prisijungimas — prisijunkite iš naujo: Nustatymai → OneDrive"));
        return app.acquireTokenPopup({ scopes: this.SCOPES, account: acct });
      });
    }).then(r => r.accessToken);
  },
  api(method, path, body, headers, interactive) {
    return this.token(interactive).then(tok => {
      var h = { Authorization: "Bearer " + tok };
      if (headers) for (var k in headers) h[k] = headers[k];
      if (body && !(body instanceof Blob) && typeof body === "object") { h["Content-Type"] = "application/json"; body = JSON.stringify(body); }
      return fetch(/^https:/.test(path) ? path : this.GRAPH + path, { method: method, headers: h, body: body || undefined });
    }).then(r => {
      if (r.status === 204) return null;
      return r.text().then(t => {
        var j = null;
        try { j = t ? JSON.parse(t) : null; } catch (e) {}
        if (!r.ok) {
          var err = new Error(j && j.error && j.error.message || ("OneDrive " + r.status));
          err.status = r.status;
          throw err;
        }
        return j;
      });
    });
  },
  /* ---------- finding the project's folder from the link people paste ---------- */
  _shareId(link) {
    var b = btoa(unescape(encodeURIComponent(link))).replace(/=+$/, "").replace(/\//g, "_").replace(/\+/g, "-");
    return "u!" + b;
  },
  resolve(link, interactive) {
    link = String(link || "").trim();
    if (!/^https?:\/\//i.test(link)) return Promise.reject(new Error(_pfLt("The OneDrive link is not a web address", "OneDrive nuoroda nėra interneto adresas")));
    var u;
    try { u = new URL(link); } catch (e) { return Promise.reject(new Error("Bad link")); }
    var q = u.searchParams;
    var asItem = j => ({ driveId: j.parentReference ? j.parentReference.driveId : j.driveId, id: j.id, webUrl: j.webUrl, name: j.name });
    /* onedrive.live.com/?id=ABC!123&cid=ABC — the address bar of personal OneDrive */
    if (/onedrive\.live\.com$/i.test(u.hostname) && q.get("id") && (q.get("cid") || /!/.test(q.get("id")))) {
      var cid = q.get("cid") || q.get("id").split("!")[0];
      return this.api("GET", "/drives/" + encodeURIComponent(cid) + "/items/" + encodeURIComponent(q.get("id")), null, null, interactive).then(asItem);
    }
    /* SharePoint / OneDrive for Business address bar: …/my?id=/personal/x/Documents/Projektai/ENG-1 */
    var spPath = q.get("id");
    if (/sharepoint\.com$/i.test(u.hostname) && spPath && /\/Documents\//i.test(spPath) && !/:f:|:u:/.test(u.pathname)) {
      var rel = spPath.replace(/^.*?\/Documents\//i, "");
      return this.api("GET", "/me/drive/root:/" + rel.split("/").map(encodeURIComponent).join("/"), null, null, interactive).then(asItem);
    }
    /* any "Share → Copy link" link: 1drv.ms, …sharepoint.com/:f:/… */
    return this.api("GET", "/shares/" + this._shareId(link) + "/driveItem", null, { Prefer: "redeemSharingLink" }, interactive).then(asItem);
  },
  child(driveId, parentId, name, create) {
    return this.api("GET", "/drives/" + driveId + "/items/" + parentId + ":/" + encodeURIComponent(name)).catch(e => {
      if (e.status !== 404 || !create) throw e;
      return this.api("POST", "/drives/" + driveId + "/items/" + parentId + "/children", { name: name, folder: {}, "@microsoft.graph.conflictBehavior": "replace" });
    }).then(j => ({ driveId: driveId, id: j.id, webUrl: j.webUrl, name: j.name }));
  },
  put(driveId, parentId, name, blob) {
    var path = "/drives/" + driveId + "/items/" + parentId + ":/" + encodeURIComponent(name) + ":";
    if (blob.size < 3.5 * 1048576) return this.api("PUT", path + "/content", blob, { "Content-Type": blob.type || "application/octet-stream" });
    return this.api("POST", path + "/createUploadSession", { item: { "@microsoft.graph.conflictBehavior": "replace" } }).then(s => {
      var CH = 5 * 327680 * 2; // ~3.2 MB, a multiple of 320 KB as Graph asks
      var off = 0;
      var next = () => {
        var end = Math.min(off + CH, blob.size);
        return fetch(s.uploadUrl, { method: "PUT", headers: { "Content-Range": "bytes " + off + "-" + (end - 1) + "/" + blob.size }, body: blob.slice(off, end) }).then(r => {
          if (!r.ok && r.status !== 202) throw new Error("Upload failed (" + r.status + ")");
          off = end;
          return off < blob.size ? next() : r.json();
        });
      };
      return next();
    });
  },
  /* the project folder: its own link, or a folder named by its code inside the shared base */
  folderFor(o, interactive) {
    var own = String(o.oneDriveUrl || "").trim();
    if (own) return this.resolve(own, interactive);
    var base = String(this.cfg().baseShare || "").trim();
    if (!base) return Promise.reject(new Error(_pfLt("This project has no OneDrive link", "Šis projektas neturi OneDrive nuorodos")));
    var name = D.slug(o.num);
    return this.resolve(base, interactive).then(b => this.child(b.driveId, b.id, name, true));
  },
  can(o) {
    return !!(o && (String(o.oneDriveUrl || "").trim() || String(this.cfg().baseShare || "").trim()));
  },
  /* what counts as "the project changed" */
  hash(o) {
    var files = D.filesFor({ orderId: o.id }).map(f => f.id + ":" + f.name + ":" + f.size + ":" + (f.store || "")).join("|");
    var json = JSON.stringify([o.num, o.product, o.client, o.customerId, o.portfolioId, o.priority, o.due, o.notes, o.oneDriveUrl, o.type, o.clientApproved,
      (o.ops || []).map(op => [op.stationId, op.status, op.completedAt, op.assigneeId, op.assigneeIds, op.blockNote]),
      o.appliances || [], o.details || [], o.materials || [], (o.comments || []).map(c => [c.id, c.text]), files]);
    var h = 5381;
    for (var i = 0; i < json.length; i++) h = (h * 33 ^ json.charCodeAt(i)) >>> 0;
    return h.toString(36);
  },
  state(o) {
    return this._status[o.id] || null;
  },
  _uniqueName(name, used) {
    if (!used[name.toLowerCase()]) { used[name.toLowerCase()] = 1; return name; }
    var m = /^(.*?)(\.[^.]*)?$/.exec(name);
    var n = 2;
    while (used[(m[1] + " (" + n + ")" + (m[2] || "")).toLowerCase()]) n++;
    var out = m[1] + " (" + n + ")" + (m[2] || "");
    used[out.toLowerCase()] = 1;
    return out;
  },
  /* write (or rewrite) the whole "Projekto kortelė" folder for one project */
  exportOrder(orderId, interactive) {
    var o = D.order(orderId);
    if (!o) return Promise.resolve(null);
    var h = this.hash(o);
    var prev = o.odSync || {};
    this._status[o.id] = { busy: true };
    var folder, sub, att;
    var mapped = Object.assign({}, prev.files || {});
    return this.folderFor(o, interactive).then(f => {
      folder = f;
      return this.child(f.driveId, f.id, this.SUB, true);
    }).then(s => {
      sub = s;
      return ProjectDoc.blob(o.id);
    }).then(pdf => this.put(sub.driveId, sub.id, ProjectDoc.fileName(o), new Blob([pdf], { type: "application/pdf" }))).then(() => {
      var x = typeof SheetExport !== "undefined" ? SheetExport.blob(o.id) : null;
      return x ? this.put(sub.driveId, sub.id, ProjectDoc.fileName(o).replace(/\.pdf$/, ".xlsx"), x) : null;
    }).then(() => {
      var files = D.filesFor({ orderId: o.id });
      var todo = files.filter(f => !mapped[f.id]);
      var gone = Object.keys(mapped).filter(id => !files.some(f => f.id === id));
      var chain = Promise.resolve();
      if (todo.length || gone.length) chain = this.child(sub.driveId, sub.id, this.ATT, true).then(a => { att = a; });
      var used = {};
      files.forEach(f => { if (mapped[f.id] && mapped[f.id].name) used[mapped[f.id].name.toLowerCase()] = 1; });
      todo.forEach(f => {
        chain = chain.then(() => Files.url(f.id)).then(u => {
          if (!u) return null; // not on this device and not in storage yet — next time
          return fetch(u).then(r => r.blob()).then(b => {
            var nm = this._uniqueName(f.name, used);
            return this.put(att.driveId, att.id, nm, new Blob([b], { type: f.type || b.type })).then(j => { mapped[f.id] = { id: j.id, name: nm }; });
          });
        }).catch(e => { console.warn("[onedrive] attachment", f.name, e); });
      });
      gone.forEach(id => {
        chain = chain.then(() => this.api("DELETE", "/drives/" + sub.driveId + "/items/" + mapped[id].id).catch(() => null)).then(() => { delete mapped[id]; });
      });
      return chain;
    }).then(() => {
      var all = D.filesFor({ orderId: o.id }).every(f => mapped[f.id]);
      o.odSync = { hash: all ? h : "partial", at: Date.now(), by: App.me ? App.me.id : null, folderUrl: sub.webUrl, projectUrl: folder.webUrl, files: mapped, err: null };
      Store.save();
      this._status[o.id] = null;
      this._repaint(o.id);
      return o.odSync;
    }).catch(e => {
      o.odSync = Object.assign({}, prev, { err: e && e.message || String(e), errAt: Date.now(), hash: prev.hash || null });
      Store.save();
      this._status[o.id] = null;
      this._repaint(o.id);
      throw e;
    });
  },
  _repaint(orderId) {
    if (typeof OrderDetail !== "undefined" && OrderDetail._sheetId === orderId) OrderDetail.refreshSheet();
  },
  /* ---------- automatic rewrite ---------- */
  start() {
    if (this._timer || !this.signedIn()) return;
    this._seen = {};
    this._timer = setInterval(() => this.tick(), 7000);
    setTimeout(() => this.tick(), 3000);
  },
  tick() {
    if (this._busy || !this.signedIn() || this.cfg().auto === false || !navigator.onLine) return;
    var now = Date.now();
    var list = Store.state.orders || [];
    var due = null;
    for (var i = 0; i < list.length; i++) {
      var o = list[i];
      if (!this.can(o)) continue;
      if (o.archived && !(o.archivedAt && now - o.archivedAt < 2 * 86400000)) continue;
      var sync = o.odSync || {};
      var own = !!String(o.oneDriveUrl || "").trim();
      if (sync.err && sync.errAt && now - sync.errAt < 10 * 60000) continue;
      var h = this.hash(o);
      if (h === sync.hash) continue;
      var s = this._seen[o.id];
      if (!s) { this._seen[o.id] = { h: h, t: now, first: h }; continue; }
      /* a project found only through the shared base folder is first written
         when it changes — not all at once the day this is switched on */
      if (!own && !sync.at && h === s.first) continue;
      /* wait until it has been quiet for a moment, so ten quick edits are one upload */
      if (s.h !== h) { s.h = h; s.t = now; continue; }
      if (now - s.t < this.WAIT_MS) continue;
      due = o;
      break;
    }
    if (!due) return;
    this._busy = true;
    this.exportOrder(due.id, false).catch(e => console.warn("[onedrive]", due.num, e)).then(() => { this._busy = false; });
  },
  /* ---------- the line on the project sheet ---------- */
  sheetHtml(o) {
    if (!this.can(o) && !this.signedIn()) return "";
    var s = o.odSync || {};
    var st = this.state(o);
    var txt, cls = "";
    if (!this.can(o)) { txt = _pfLt("Add the project's OneDrive link to keep a copy of this card there", "Pridėkite projekto OneDrive nuorodą — kortelės kopija bus saugoma ten"); cls = "muted"; }
    else if (!this.clientId()) { txt = _pfLt("OneDrive copy is not set up — Settings → OneDrive", "OneDrive kopija nenustatyta — Nustatymai → OneDrive"); cls = "muted"; }
    else if (st && st.busy) txt = _pfLt("Writing to OneDrive…", "Rašoma į OneDrive…");
    else if (s.err) { txt = _pfLt("OneDrive: ", "OneDrive: ") + s.err; cls = "bad"; }
    else if (s.at) txt = _pfLt("Copy in OneDrive updated ", "Kopija OneDrive atnaujinta ") + fmtAgo(s.at) + (s.hash === this.hash(o) ? "" : _pfLt(" — changes waiting", " — laukia pakeitimų"));
    else txt = _pfLt("Not written to OneDrive yet", "Į OneDrive dar neįrašyta");
    return `<div class="od-sync ${cls}">
      <span class="od-sync-ico">${icon("cloud", 14)}</span>
      <span class="grow">${esc(txt)}${!this.signedIn() && this.can(o) && this.clientId() ? ` <span class="t-caption">· ${esc(_pfLt("this computer is not signed in to Microsoft", "šis kompiuteris neprisijungęs prie Microsoft"))}</span>` : ""}</span>
      ${s.folderUrl ? `<a class="mini-act" href="${esc(s.folderUrl)}" target="_blank" rel="noopener">${icon("external", 12)} ${esc(_pfLt("Open folder", "Atidaryti aplanką"))}</a>` : ""}
      ${this.can(o) && this.clientId() ? `<button class="mini-act" id="od-sync-now" ${st && st.busy ? "disabled" : ""}>${esc(this.signedIn() ? _pfLt("Update now", "Atnaujinti dabar") : _pfLt("Sign in & write", "Prisijungti ir įrašyti"))}</button>` : ""}
    </div>`;
  },
  bindSheet(root, o) {
    var b = $("#od-sync-now", root);
    if (!b) return;
    b.onclick = () => {
      b.disabled = true;
      var go = () => {
        this._status[o.id] = { busy: true };
        this._repaint(o.id);
        return this.exportOrder(o.id, true);
      };
      (this.signedIn() ? go() : this.signIn().then(go)).then(r => {
        if (r) Toast.show(_pfLt("Written to OneDrive", "Įrašyta į OneDrive"), { emoji: "cloud", ms: 4000 });
      }).catch(e => {
        Toast.show(e && e.message || String(e), { emoji: "alert", ms: 7000 });
        this._repaint(o.id);
      });
    };
  }
};
if (typeof window !== "undefined") window.addEventListener("load", () => setTimeout(() => { try { OneDrive.start(); } catch (e) {} }, 4000));
