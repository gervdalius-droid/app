import asyncio, json
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/cols_'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':950}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.evaluate("()=>localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(300)
        await pg.fill('#np-name','PERTVAROS'); await pg.press('#np-name','Enter'); await pg.wait_for_timeout(250)
        await pg.click('.preset >> nth=1'); await pg.wait_for_timeout(250)   # door cabinet
        await pg.fill('#f-c-W','1200'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(250)
        # two partitions → three columns
        await pg.click('[data-act=set][data-bind="c.cols"][data-v="3"]'); await pg.wait_for_timeout(300)
        c = await pg.evaluate("()=>JSON.stringify({cols:__dbk.S.proj.cabinets[0].cols,colW:__dbk.S.proj.cabinets[0].colW,backs:__dbk.S.proj.cabinets[0].cnc.backs})"); print('3 cols:', c)
        # left column width 500 → last takes the rest
        await pg.fill('#f-c-colW-0','500'); await pg.press('#f-c-colW-0','Tab'); await pg.wait_for_timeout(300)
        print('widths:', await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[0].colW)"))
        # add drawers to the middle column, open shelves to the right
        await pg.click('[data-act=colsel][data-v="1"]'); await pg.wait_for_timeout(200)
        await pg.click('[data-act=addsec][data-v=drawers][data-i="1"]'); await pg.wait_for_timeout(250)
        await pg.click('[data-act=colsel][data-v="2"]'); await pg.wait_for_timeout(200)
        await pg.click('[data-act=addsec][data-v=open][data-i="2"]'); await pg.wait_for_timeout(250)
        # backs: left plaušas, middle none, right solid
        for k,v in [(0,'hdf'),(1,'none'),(2,'solid')]:
            await pg.click('[data-act=colsel][data-v="%d"]'%k); await pg.wait_for_timeout(150)
            await pg.click('[data-act=set][data-bind="c.cnc.backs.%d"][data-v=%s]'%(k,v)); await pg.wait_for_timeout(200)
        print('backs:', await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[0].cnc.backs)"), 'sections:', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].sections.map(s=>s.kind+'@'+s.col).join(' ')"))
        parts = await pg.evaluate("()=>__dbk.S._info[0].r.panels.map(p=>p.role+' '+Math.round(p.L)+'x'+Math.round(p.W)+'x'+p.T).join(' | ')")
        print('parts:', parts)
        print('warnings:', await pg.evaluate("()=>__dbk.S._info[0].warnings"))
        await pg.locator('#st-secs').screenshot(path=OUT+'secs.png')
        await pg.screenshot(path=OUT+'top.png')
        await pg.click('[data-act=tab][data-v=room]'); await pg.wait_for_timeout(300)
        await pg.click('[data-rm=view][data-v="3d"]'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'3d.png')
        await pg.click('[data-act=tab][data-v=res]'); await pg.wait_for_timeout(300)
        print('progs:', await pg.evaluate("()=>__dbk.buildProjectAll().parts.map(p=>p.short+':'+p.progs.length).join(' ')"))
        print('errors', errs); await b.close()
asyncio.run(main())
