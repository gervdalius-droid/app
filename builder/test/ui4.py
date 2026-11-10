import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1440,'height':1000}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(600); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)   # drawer + doors
        await pg.locator('figure.xsec').screenshot(path=OUT+'xL.png')
        await pg.click('[data-act=xside][data-v=R]'); await pg.wait_for_timeout(200)
        await pg.locator('figure.xsec').screenshot(path=OUT+'xR.png')
        await pg.fill('#f-c-D','400'); await pg.wait_for_timeout(200)
        await pg.locator('figure.xsec').screenshot(path=OUT+'xR2.png')
        print('errors', errs); await b.close()
asyncio.run(main())
