#!/usr/bin/env python3
"""Local static server that mimics Vercel's cleanUrls: /portfolio serves portfolio.html.
Usage: python3 scripts/dev-server.py [port]"""
import http.server, os, sys

class Handler(http.server.SimpleHTTPRequestHandler):
    def translate_path(self, path):
        p = super().translate_path(path)
        if not os.path.exists(p) and os.path.exists(p + '.html'):
            return p + '.html'
        return p

port = int(sys.argv[1]) if len(sys.argv) > 1 else 4321
os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
http.server.ThreadingHTTPServer(('', port), Handler).serve_forever()
