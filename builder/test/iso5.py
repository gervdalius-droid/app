import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.evaluate("()=>{const c=__dbk.S.proj.cabinets[0];c.cnc.joints={bottom:{type:'cam',pos:[50,200,360,510]},railF:{type:'confirmat',pos:[25,75]}};__dbk.render()}")
        await pg.wait_for_timeout(200)
        await pg.click('[data-act=isosel][data-v=bottom]'); await pg.wait_for_timeout(500)
        card = pg.locator('.card.step >> nth=2')
        await card.screenshot(path=OUT+'iso_step3.png')
        print('errors', errs); await b.close()
asyncio.run(main())
