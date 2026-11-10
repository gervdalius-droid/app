#!/usr/bin/env python3
"""Braižyklė — vietinis serveris.  python3 serve.py [port]   (default 8752)"""
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8752
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, '.dxf': 'text/plain'}
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()
    def log_message(self, fmt, *a):
        pass

class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

with Server(("127.0.0.1", PORT), H) as httpd:
    print(f"Braizykle  ->  http://localhost:{PORT}/")
    print(f"testai     ->  http://localhost:{PORT}/test.html")
    httpd.serve_forever()
