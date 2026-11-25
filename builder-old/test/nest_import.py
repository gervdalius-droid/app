# Generate the full sample project's .xlsm with the app's own code, then import it into the real nesting app.
import asyncio, base64
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        a = await b.new_page()
        await a.goto('file:///home/claude/cabcreator/dist/index.html'); await a.wait_for_timeout(500); await a.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await a.wait_for_timeout(250)
        b64 = await a.evaluate("""() => { const k=window.__dbk; const pj=k.buildProjectAll(); const u=k.xlsmBytes(pj);
            let s=''; for (let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]); return [btoa(s), pj.parts.length, pj.parts.filter(x=>x.op1).length]; }""")
        open('/home/claude/cabcreator/scratch/PAVYZDYS_ReportLists_to_Excel.xlsm','wb').write(base64.b64decode(b64[0]))
        print('creator: parts', b64[1], 'with CNC', b64[2])
        n = await b.new_page(); errs=[]; n.on('pageerror', lambda e: errs.append(str(e)))
        await n.goto('file:///home/claude/gervdalius-droid/nesting/index.html'); await n.wait_for_timeout(1500)
        await n.set_input_files('#fin', '/home/claude/cabcreator/scratch/PAVYZDYS_ReportLists_to_Excel.xlsm'); await n.wait_for_timeout(2500)
        res = await n.evaluate("""() => ({ n: parts.length, cnc: parts.filter(p=>p.hasCNC).length, mats:[...new Set(parts.map(p=>p.mat))],
             ex: parts.slice(0,3).map(p=>({name:p.name, orig:p.origName, l:p.l, w:p.w, t:p.thick, eb:p.eb, op1:p.op1, op2:p.op2})),
             noop: parts.filter(p=>!p.op1).map(p=>p.origName) })""")
        st = await n.evaluate("(()=>{const e=[...document.querySelectorAll('*')].find(x=>x.children.length===0&&/parts ·/.test(x.textContent));return e&&e.textContent})()")
        print('nesting status:', st); print(res); print('errors', errs[:3])
        await b.close()
asyncio.run(main())
