#!/usr/bin/env python3
"""Serve the whole shop system from ONE origin, the way production does.

In production every app sits under app.dedesbaldai.lt/<app>/, so they
share an origin — one localStorage, one Cache API, and iframes that can talk to
each other directly. Running each app on its own port during development breaks
all of that, and the bugs it hides only appear once deployed.

So this mounts them at the same paths GitHub Pages uses:

    /            → ~/github/hub          (this app)
    /shopflow/   → ~/shopflow
    /offer/      → ~/github/offer
    /invoices/   → ~/github/invoices

    python3 serve.py [port]        default 8750
"""
import http.server
import os
import posixpath
import socketserver
import sys
from urllib.parse import unquote

HERE = os.path.dirname(os.path.abspath(__file__))
HOME = os.path.expanduser("~")

# The hub is mounted at /hub/, not at /, on purpose: in production it is one
# repo among several, and the apps reach its core.js as ../hub/core.js. Serving
# it from the root would resolve that to /hub/core.js and quietly 404, so the
# bridge would be dead locally and alive only once deployed.
MOUNTS = [
    ("/hub/", HERE),
    # ShopFlow is published from a repo called shopflow-app, so that is the
    # folder the hub links to; /shopflow/ stays as an alias for convenience.
    ("/shopflow-app/", os.path.join(HOME, "shopflow")),
    ("/shopflow/", os.path.join(HOME, "shopflow")),
    ("/offer/", os.path.join(HOME, "github", "offer")),
    ("/invoices/", os.path.join(HOME, "github", "invoices")),
]


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ("/", ""):
            self.send_response(302)
            self.send_header("Location", "/hub/")
            self.end_headers()
            return
        return super().do_GET()

    def translate_path(self, path):
        path = unquote(path.split("?", 1)[0].split("#", 1)[0])
        path = posixpath.normpath(path)

        root, rel = HERE, path        # anything unmatched falls back to the hub
        for prefix, target in MOUNTS:
            if path == prefix.rstrip("/") or path.startswith(prefix):
                root = target
                rel = path[len(prefix.rstrip("/")):]
                break

        # join safely: refuse anything that climbs out of its mount
        parts = [p for p in rel.split("/") if p and p not in (".", "..")]
        full = os.path.join(root, *parts)
        if not os.path.abspath(full).startswith(os.path.abspath(root)):
            return root
        return full

    def end_headers(self):
        # a stale bundle during development is never what you want to debug
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def log_message(self, fmt, *args):
        if "404" in (fmt % args):
            sys.stderr.write("  404 %s\n" % (args[0] if args else ""))


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8750
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), Handler) as httpd:
        print(f"Shop system on http://localhost:{port}/hub/")
        for prefix, target in MOUNTS:
            mark = "" if os.path.isdir(target) else "   (missing)"
            print(f"   {prefix:<12} → {target}{mark}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")
