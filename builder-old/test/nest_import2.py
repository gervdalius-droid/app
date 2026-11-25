import asyncio, base64, sys
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); a = await b.new_page(); errs=[]
        a.on('pageerror', lambda e: errs.append(str(e)))
        a.on('console', lambda m: errs.append('console '+m.text) if m.type=='error' and 'fonts' not in m.text else None)
        await a.add_init_script("try{localStorage.clear()}catch(e){}")
        jz=open('/home/claude/cabcreator/node_modules/jszip/dist/jszip.min.js').read()
        await a.route('**/jszip.min.js', lambda route: route.fulfill(status=200, content_type='application/javascript', body=jz))
        await a.goto('file:///home/claude/cabcreator/dist/index.html'); await a.wait_for_timeout(1500); await a.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await a.wait_for_timeout(250)
        print('JSZip loaded:', await a.evaluate("!!window.JSZip"))
        b64 = await a.evaluate("""async () => { const k=window.__dbk; const pj=k.buildProjectAll(); const u=await k.xlsmBytes(pj);
            let s=''; for (let i=0;i<u.length;i+=0x8000) s+=String.fromCharCode.apply(null,u.subarray(i,i+0x8000)); return btoa(s); }""")
        open('/home/claude/cabcreator/scratch/PAVYZDYS_ReportLists_to_Excel.xlsm','wb').write(base64.b64decode(b64))
        n = await b.new_page(); n.on('pageerror', lambda e: errs.append('nest '+str(e)))
        await n.goto('file:///home/claude/gervdalius-droid/nesting/index.html'); await n.wait_for_timeout(1500)
        await n.set_input_files('#fin', '/home/claude/cabcreator/scratch/PAVYZDYS_ReportLists_to_Excel.xlsm'); await n.wait_for_timeout(2500)
        st = await n.evaluate("(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&/parts ·/.test(x.textContent));return e&&e.textContent})()")
        res = await n.evaluate("""() => ({ n: parts.length, cnc: parts.filter(p=>p.hasCNC).length, two: parts.filter(p=>p.op2).map(p=>p.op2),
             ex: parts.slice(0,2).map(p=>({name:p.name, orig:p.origName, l:p.l, w:p.w, t:p.thick, eb:p.eb, op1:p.op1})) })""")
        print('nesting status:', st); print(res); print('errors', errs[:5])
        await b.close()
asyncio.run(main())
