#!/usr/bin/env python3
"""XXL Ašių taisyklė — vietinis serveris.  http://localhost:8748/"""
import http.server, socketserver, os, sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8748
os.chdir(os.path.dirname(os.path.abspath(__file__)))

class H(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      '.xxl': 'text/plain', '.XXL': 'text/plain'}
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()
    def log_message(self, fmt, *a):
        pass

class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True

with Server(("127.0.0.1", PORT), H) as httpd:
    print(f"XXL Fix  ->  http://localhost:{PORT}/")
    print(f"testai   ->  http://localhost:{PORT}/test.html")
    httpd.serve_forever()
