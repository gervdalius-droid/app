import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1440,'height':1000}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(600); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=2'); await pg.wait_for_timeout(200)     # wall cabinet: full top + back
        await pg.locator('.card.step').nth(2).screenshot(path=OUT+'j1.png')
        # change back to cams, top to dowels with 4 pcs
        await pg.click('[data-bind="c.cnc.joints.back.type"][data-v="cam"]'); await pg.wait_for_timeout(150)
        await pg.click('[data-bind="c.cnc.joints.top.type"][data-v="dowel"]'); await pg.wait_for_timeout(150)
        await pg.fill('#f-j-top-n','4'); await pg.press('#f-j-top-n','Tab'); await pg.wait_for_timeout(250)
        await pg.locator('.card.step').nth(2).screenshot(path=OUT+'j2.png')
        v = await pg.evaluate("JSON.stringify(window.__dbk.S.proj.cabinets[2].cnc.joints)"); print(v)
        await pg.click('[data-act=jreset][data-v=top]'); await pg.wait_for_timeout(150)
        print(await pg.evaluate("JSON.stringify(window.__dbk.S.proj.cabinets[2].cnc.joints)"))
        m = await b.new_page(viewport={'width':390,'height':844}); await m.add_init_script("try{localStorage.clear()}catch(e){}"); await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(500); await m.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await m.wait_for_timeout(250)
        print('mobile', await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"))
        await m.locator('.card.step').nth(2).screenshot(path=OUT+'mj.png')
        print('errors', errs); await b.close()
asyncio.run(main())
