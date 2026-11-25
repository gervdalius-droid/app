# The drawing sheet shows a back only in the columns that have one
import asyncio
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1440,'height':1000})
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250); await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        cnt="()=>[...document.querySelectorAll('#sketch svg [stroke=\"#aab5c4\"]')].length"
        print('1 col, no back:', await pg.evaluate(cnt))
        await pg.click('[data-act=set][data-bind="c.cols"][data-v="3"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=set][data-bind="c.cnc.backs.0"][data-v=solid]'); await pg.wait_for_timeout(300)
        a=await pg.evaluate(cnt)
        for k in (1,2):
            await pg.click('[data-act=colsel][data-v="%d"]'%k); await pg.wait_for_timeout(150)
            await pg.click('[data-act=set][data-bind="c.cnc.backs.%d"][data-v=solid]'%k); await pg.wait_for_timeout(250)
        print('back polygons: left only', a, '· all three', await pg.evaluate(cnt))
        await b.close()
asyncio.run(main())
