import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{document.querySelector('.top').style.position='static'}")
        await pg.locator('.choices').screenshot(path=OUT+'ph_choices.png')
        await pg.locator('.iso-bar').screenshot(path=OUT+'ph_cards.png')
        await pg.locator('.iso3dwrap').scroll_into_view_if_needed()
        chip = await pg.locator('[data-chip=confirmat]').bounding_box(); st = await pg.locator('.iso-stage').bounding_box()
        await pg.mouse.move(chip['x']+100, chip['y']+60); await pg.mouse.down(); await pg.mouse.move(st['x']+st['width']*0.75, st['y']+120, steps=10); await pg.wait_for_timeout(80)
        await pg.screenshot(path=OUT+'ph_carry.png', clip={'x':st['x'],'y':st['y'],'width':st['width'],'height':300})
        await pg.mouse.up()
        await pg.click('[data-iso=sel][data-key=bottom]'); await pg.wait_for_timeout(150)
        await pg.locator('.iso-ins').screenshot(path=OUT+'ph_ins.png')
        ctx = await b.new_context(viewport={'width':390,'height':844}, color_scheme='dark', is_mobile=True, has_touch=True)
        pm = await ctx.new_page(); pm.on('pageerror', lambda e: errs.append(str(e)))
        await pm.add_init_script("try{localStorage.clear()}catch(e){}")
        await pm.goto('file:///home/claude/cabcreator/dist/index.html'); await pm.wait_for_timeout(500); await pm.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pm.wait_for_timeout(250)
        await pm.locator('.cab >> nth=0').tap(); await pm.wait_for_timeout(200)
        await pm.locator('.iso-bar').screenshot(path=OUT+'ph_mob.png')
        print('hscroll', await pm.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
