import asyncio, json, sys
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        pg = await b.new_page(viewport={'width':1440,'height':1000})
        errs=[]; pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('console', lambda m: errs.append('console:'+m.text) if m.type=='error' else None)
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(800); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'cab1.png', full_page=True)
        # select cabinet 2 (drawer+doors) and toggle things
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.click('button.choice >> nth=1')            # cams
        await pg.fill('#f-c-W', '800-18'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(200)
        w = await pg.evaluate("window.__dbk.S.proj.cabinets[1].W"); print('W stored', w)
        await pg.screenshot(path=OUT+'cab2.png', full_page=True)
        # results tab
        await pg.click('[data-act=tab][data-v=res] >> nth=0'); await pg.wait_for_timeout(300)
        await pg.click('tr.part >> nth=0'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=OUT+'res.png', full_page=True)
        await pg.click('[data-act=tab][data-v=set]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=OUT+'set.png', full_page=True)
        # new cabinet via preset (tall)
        await pg.click('[data-act=tab][data-v=cab]'); await pg.click('[data-act=pick]'); await pg.wait_for_timeout(100)
        await pg.screenshot(path=OUT+'pick.png')
        await pg.click('[data-act=preset][data-i="4"]'); await pg.wait_for_timeout(200)
        await pg.screenshot(path=OUT+'tall.png', full_page=True)
        # mobile
        m = await b.new_page(viewport={'width':390,'height':844})
        m.on('pageerror', lambda e: errs.append('m:'+str(e)))
        await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(600); await m.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await m.wait_for_timeout(250)
        sw = await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"); print('mobile scrollWidth', sw)
        await m.screenshot(path=OUT+'mobile.png', full_page=True)
        await m.emulate_media(color_scheme='dark'); await m.wait_for_timeout(100)
        await m.screenshot(path=OUT+'mobile_dark.png')
        print('errors', errs)
        await b.close()
asyncio.run(main())
