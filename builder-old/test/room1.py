import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/rm_'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':950}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.evaluate("()=>localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(300)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250)
        await pg.click('[data-act=tab][data-v=room]'); await pg.wait_for_timeout(300)
        await pg.screenshot(path=OUT+'front.png')
        await pg.click('[data-rm=view][data-v=plan]'); await pg.wait_for_timeout(200); await pg.screenshot(path=OUT+'plan.png')
        await pg.click('[data-rm=view][data-v="3d"]'); await pg.wait_for_timeout(200); await pg.screenshot(path=OUT+'3d.png')
        print('layout', await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.layout)"))
        print('errors', errs); await b.close()
asyncio.run(main())
