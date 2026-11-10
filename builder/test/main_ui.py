import asyncio
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/6860c036-5f19-5ff9-b10b-c159d9b544e1/scratchpad/main_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1366,'height':1000}); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/builder/index.html'); await pg.wait_for_timeout(600)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(300)
        await pg.click('[data-bind="c.cnc.backs.0"][data-v="solid"]'); await pg.wait_for_timeout(400)
        await pg.click('[data-bind="c.cnc.backMount"][data-v="inside"]'); await pg.wait_for_timeout(400)
        print('mount', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].cnc.backMount+' '+__dbk.S._info[0].r.panels.filter(p=>p.role==='NUGARA').map(p=>p.L+'x'+p.W).join()"))
        await pg.click('[data-bind="c.cnc.backMount"][data-v="top"]'); await pg.wait_for_timeout(400)
        print('mount', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].cnc.backMount+' '+__dbk.S._info[0].r.panels.filter(p=>p.role==='NUGARA').map(p=>p.L+'x'+p.W).join()"))
        await pg.click('[data-bind="c.worktop.on"][data-v="true"]'); await pg.wait_for_timeout(400)
        await pg.locator('#st-dims').screenshot(path=D+'dims.png')
        print('step2 has back seg', await pg.evaluate("()=>!!document.querySelector('#st-secs [data-bind^=\"c.cnc.backs\"]')"))
        # 2 columns
        await pg.click('[data-bind="c.cols"][data-v="2"]'); await pg.wait_for_timeout(400)
        await pg.click('[data-bind="c.cnc.backs.1"][data-v="hdf"]'); await pg.wait_for_timeout(400)
        await pg.locator('#st-dims').screenshot(path=D+'dims2.png')
        await pg.set_viewport_size({'width':390,'height':900}); await pg.wait_for_timeout(400)
        await pg.locator('#st-dims').screenshot(path=D+'mob.png')
        print('hscroll', await pg.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
