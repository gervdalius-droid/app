import os
# ---- SAFETY GUARD (added 2026-11-09) -------------------------------------
# index.html in the repo root is the LIVE app and is edited directly. The src/
# folder is an older copy: it lacks the realistic view, the cabinet library and
# cloud save. Building from it would silently replace the live app with that
# old version. So this script refuses to run unless you say you mean it:
#     python3 build.py --i-know-src-is-current
import sys
if '--i-know-src-is-current' not in sys.argv:
    sys.exit("build.py stopped: src/ is older than the live index.html (see the note at the top of build.py).")
# ---------------------------------------------------------------------------
R=os.path.dirname(os.path.abspath(__file__)); S=R+'/src/'
rd=lambda f: open(S+f,encoding='utf-8').read()
js='<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>\n'+''.join('<script>\n'+rd(f)+'\n</script>\n' for f in ['engine.js','export.js','zip.js','sketch.js','front.js','photos.js','art.js','iso.js','room.js','report_tpl.js','report.js','app.js'])
body=rd('shell_head.html')+'<style>\n'+rd('style.css')+'\n</style>\n<div id="app"></div>\n<div id="toast" class="toast" hidden></div>\n'+js
os.makedirs(R+'/dist',exist_ok=True)
open(R+'/dist/spinteliu-kurejas.html','w',encoding='utf-8').write(body)   # artifact (skeleton added on publish)
full='<!doctype html>\n<html lang="lt">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'+rd('shell_head.html')+'<style>\n'+rd('style.css')+'\n</style>\n</head>\n<body>\n<div id="app"></div>\n<div id="toast" class="toast" hidden></div>\n'+js+'</body>\n</html>\n'
open(R+'/dist/index.html','w',encoding='utf-8').write(full)
open(R+'/index.html','w',encoding='utf-8').write(full)   # GitHub Pages serves the repo root
print(len(body), len(full))
