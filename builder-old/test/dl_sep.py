# separate .XXL downloads: one program, one part, one cabinet, all — names and bytes as in the ZIP
import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        ctx = await b.new_context(viewport={'width':1440,'height':1000}, accept_downloads=True)
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('[data-act=tab][data-v=res]'); await pg.wait_for_timeout(200)
        files = await pg.evaluate("()=>{const m={};__dbk.buildProjectAll().files.forEach(f=>m[f.name]=f.text);return m}")
        got=[]
        pg.on('download', lambda d: got.append(d))
        # 1) badge in the part list
        await pg.locator('button.prog.dlp >> nth=0').click(); await pg.wait_for_timeout(600)
        print('badge:', [d.suggested_filename for d in got], 'part view opened:', await pg.evaluate("()=>__dbk.S.part"))
        d=got[0]; path=await d.path(); txt=open(path,encoding='utf-8',newline='').read(); print('  same as zip text:', txt==files[d.suggested_filename])
        # 2) part view buttons
        got.clear(); await pg.click('tr.part >> nth=5'); await pg.wait_for_timeout(200)
        await pg.click('.pdl [data-act=dlprog]'); await pg.wait_for_timeout(500)
        print('part view:', [d.suggested_filename for d in got])
        # 3) a part with 2 programs → "all of this part"
        name = await pg.evaluate("()=>__dbk.buildProjectAll().parts.find(p=>p.progs.length>1).name")
        await pg.evaluate("(n)=>{__dbk.S.part=n;__dbk.render()}", name); await pg.wait_for_timeout(200)
        got.clear(); await pg.click('[data-act=dlpart]'); await pg.wait_for_timeout(1500)
        print('part (2 progs):', [d.suggested_filename for d in got])
        # 4) one cabinet
        got.clear(); await pg.click('[data-act=dlcab][data-v="3"]'); await pg.wait_for_timeout(4000)
        n3 = await pg.evaluate("()=>__dbk.buildProjectAll().parts.filter(p=>p.cab===3).reduce((a,p)=>a+p.progs.length,0)")
        print('cabinet 3:', len(got), 'of', n3)
        # 5) all
        got.clear(); await pg.click('.dl [data-act=dlall]'); await pg.wait_for_timeout(len(files)*320+1500)
        names=[d.suggested_filename for d in got]
        print('all:', len(names), 'of', len(files), '· all .XXL:', all(n.endswith('.XXL') for n in names), '· unique:', len(set(names))==len(names))
        ok=True
        for d in got:
            if open(await d.path(),encoding='utf-8',newline='').read()!=files[d.suggested_filename]: ok=False
        print('  bytes identical to ZIP contents:', ok)
        await pg.locator('#proglist').screenshot(path=OUT+'proglist.png')
        await pg.locator('aside.pview').screenshot(path=OUT+'pview.png')
        print('errors', errs); await b.close()
asyncio.run(main())
