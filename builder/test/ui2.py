import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1440,'height':1000}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(600); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        step3 = pg.locator('.card.step').nth(2); await step3.screenshot(path=OUT+'step3.png')
        # standing back + bottom rail
        await pg.click('[data-bind="c.cnc.rails.back"][data-v="hv"]'); await pg.click('#f-c-cnc-rails-bottom'); await pg.wait_for_timeout(200)
        await pg.locator('.card.step').nth(2).screenshot(path=OUT+'step3b.png')
        # extras
        await pg.click('[data-act=addx][data-v=plinth]'); await pg.click('[data-act=addx][data-v=part]'); await pg.wait_for_timeout(200)
        await pg.fill('#f-x-1-name','Šoninė apdaila'); await pg.fill('#f-x-1-L','720'); await pg.press('#f-x-1-L','Tab'); await pg.fill('#f-x-1-W','560'); await pg.press('#f-x-1-W','Tab')
        await pg.locator('.card.step').nth(5).screenshot(path=OUT+'step6.png')
        await pg.click('[data-act=tab][data-v=res]'); await pg.wait_for_timeout(300)
        await pg.click('tr.part >> nth=0'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=OUT+'res2.png', full_page=True)
        info = await pg.evaluate("""() => { const k=window.__dbk; const pj=k.buildProjectAll(); return {parts:pj.parts.length, files:pj.files.length, extras:pj.parts.filter(p=>p.src==='loose').map(p=>[p.name,p.short,p.cab,p.L,p.W,p.eb]), rot:pj.parts.filter(p=>(p.progs||[]).some(f=>f.kind==='rot')).map(p=>p.short), warn:pj.warnings}; }""")
        print(info)
        await pg.click('[data-act=tab][data-v=set]'); await pg.wait_for_timeout(200); await pg.screenshot(path=OUT+'set2.png', full_page=True)
        m = await b.new_page(viewport={'width':390,'height':844}); await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(500); await m.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await m.wait_for_timeout(250)
        print('mobile', await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"))
        await m.locator('.card.step').nth(2).screenshot(path=OUT+'m_step3.png')
        print('errors', errs); await b.close()
asyncio.run(main())
