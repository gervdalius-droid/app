import asyncio
from playwright.async_api import async_playwright
S='/home/claude/cabcreator/scratch/'
async def run(b, vp, tag, dark=False):
    errs=[]; ctx=await b.new_context(viewport=vp, color_scheme='dark' if dark else 'light'); pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    await pg.add_init_script("try{localStorage.clear()}catch(e){}")
    await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(400)
    await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250)
    await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
    await pg.fill('#f-c-W','1000'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=set][data-bind="c.cols"][data-v="3"]'); await pg.wait_for_timeout(300)
    await pg.click('[data-act=set][data-bind="c.cnc.backs.0"][data-v=solid]'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=colsel][data-v="1"]'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=addsec][data-v=drawers][data-i="1"]'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=set][data-bind="c.cnc.backs.1"][data-v=hdf]'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=colsel][data-v="2"]'); await pg.wait_for_timeout(200)
    await pg.click('[data-act=addsec][data-v=open][data-i="2"]'); await pg.wait_for_timeout(200)
    print(tag,'backs', await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[1].cnc.backs)"), 'secs', await pg.evaluate("()=>__dbk.S.proj.cabinets[1].sections.map(s=>s.kind+'@'+s.col).join(' ')"))
    print(tag,'backs drawn in sketch', await pg.evaluate("()=>document.querySelectorAll('#sketch svg *').length"))
    await pg.evaluate("()=>{document.querySelector('.top').style.position='static'}")
    await pg.locator('#st-secs').screenshot(path=S+tag+'_secs.png')
    await pg.locator('.paper').first.screenshot(path=S+tag+'_sketch.png')
    # remove + undo
    n0 = await pg.evaluate("()=>__dbk.S.proj.cabinets[1].sections.length")
    await pg.click('.sec .xbtn'); await pg.wait_for_timeout(200)
    n1 = await pg.evaluate("()=>__dbk.S.proj.cabinets[1].sections.length")
    await pg.screenshot(path=S+tag+'_toast.png')
    await pg.click('.toast-act'); await pg.wait_for_timeout(200)
    n2 = await pg.evaluate("()=>__dbk.S.proj.cabinets[1].sections.length")
    print(tag,'remove/undo', n0, n1, n2, 'hscroll', await pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth"), errs)
    await ctx.close()
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        await run(b,{'width':1440,'height':1000},'desk')
        await run(b,{'width':390,'height':844},'mob',True)
        await b.close()
asyncio.run(main())
