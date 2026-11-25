import asyncio
from playwright.async_api import async_playwright
D='/tmp/claude-0/-home-claude/6860c036-5f19-5ff9-b10b-c159d9b544e1/scratchpad/wt_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1366,'height':900}); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/builder/index.html'); await pg.wait_for_timeout(600)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(300)
        # cabinet 1: worktop on
        await pg.click('[data-act=goto][data-v=st-mats]'); await pg.wait_for_timeout(400)
        await pg.click('[data-bind="c.worktop.on"][data-v="true"]'); await pg.wait_for_timeout(400)
        await pg.fill('#f-c-worktop-mat','Stalviršis Egger F244 38'); await pg.press('#f-c-worktop-mat','Tab'); await pg.wait_for_timeout(300)
        await pg.fill('#f-wt-left','30'); await pg.press('#f-wt-left','Tab'); await pg.wait_for_timeout(400)
        print('wt cab1', await pg.evaluate("()=>JSON.stringify(__dbk.S._info[0].r.worktop)"))
        await pg.locator('#st-mats').screenshot(path=D+'mats.png'); await pg.locator('#assembly-preview').screenshot(path=D+'3dwt.png')
        print('preview has worktop', await pg.evaluate("()=>[...document.querySelectorAll('.fr-svg rect')].some(r=>r.getAttribute('height')==='38')"))
        await pg.locator('.fr-svg').first.screenshot(path=D+'preview.png')
        # cabinet 2: inherits nothing (sample), turn on with same material
        await pg.click('[data-act=sel][data-i="1"]'); await pg.wait_for_timeout(400); await pg.click('[data-act=goto][data-v=st-mats]'); await pg.wait_for_timeout(300)
        await pg.click('[data-bind="c.worktop.on"][data-v="true"]'); await pg.wait_for_timeout(300)
        await pg.fill('#f-c-worktop-mat','Stalviršis Egger F244 38'); await pg.press('#f-c-worktop-mat','Tab'); await pg.wait_for_timeout(300)
        # cabinet 2 drawers → undermount
        await pg.click('[data-act=sel][data-i="0"]'); await pg.wait_for_timeout(400); await pg.click('[data-act=goto][data-v=st-secs]'); await pg.wait_for_timeout(400)
        await pg.select_option('#f-c-sections-0-hw','DTC PASLĖPTI'); await pg.wait_for_timeout(500)
        print('rail options', await pg.evaluate("()=>[...document.querySelectorAll('#f-c-sections-0-rail option')].map(o=>o.value).join(',')"), 'value', await pg.evaluate("()=>document.querySelector('#f-c-sections-0-rail').value"))
        print(await pg.evaluate("()=>{const r=__dbk.S._info[0].r;return r.panels.filter(p=>p.drawerOf).slice(0,5).map(p=>p.short+' '+p.L+'x'+p.W+'x'+p.T).join(', ')+' | hw '+JSON.stringify(r.hardware.filter(h=>/DTC/.test(h.item)))}"))
        await pg.locator('#assembly-preview').screenshot(path=D+'3d.png')
        # parts: unplaced → two pieces
        res=await pg.evaluate("()=>__dbk.buildProjectAll().parts.filter(p=>/STALV/.test(p.name)).map(p=>p.short+' '+p.L+'x'+p.W+'x'+p.T+' '+p.mat+' '+JSON.stringify(p.eb))")
        print('parts unplaced', res)
        # place both side by side in the layout
        await pg.evaluate("""()=>{const S=__dbk.S, P=S.proj; P.layout={walls:[{len:3600}],wallZ:1450,roomH:2600,worktop:true,items:{}}; P.layout.items[P.cabinets[0].id]={wall:0,x:0}; P.layout.items[P.cabinets[1].id]={wall:0,x:600}; __dbk.render();}""")
        await pg.wait_for_timeout(400)
        print('parts placed', await pg.evaluate("()=>{const r=__dbk.buildProjectAll();return r.parts.filter(p=>/STALV/.test(p.name)).map(p=>p.short+' '+p.L+'x'+p.W+'x'+p.T+' '+JSON.stringify(p.eb)).join(' ; ')+' | warn '+r.warnings.filter(w=>/stalvir/i.test(w))}"))
        # pricing
        print('price', await pg.evaluate("()=>{const o=__dbk.priceCabinet(__dbk.S.proj.cabinets[0],__dbk.S._info[0].r);return JSON.stringify(Object.values(o.boards).map(g=>[g.name,g.kind,Math.round(g.m2*1000)/1000,g.price]))+' drawers '+o.drawers.n+' hw '+JSON.stringify(o.hw.filter(h=>/DTC/.test(h.item)))}"))
        # room view
        await pg.click('[data-act=tab][data-v=room]'); await pg.wait_for_timeout(800)
        await pg.screenshot(path=D+'room.png')
        # drawings
        await pg.click('[data-act=tab][data-v=drw]'); await pg.wait_for_timeout(900)
        svg=await pg.evaluate("()=>__dbk.S._drw.find(x=>x.id==='c0').svg"); open(D+'sheet.svg','w').write(svg)
        print('sheet lists worktop', 'Stalviršis<' in svg)
        await pg.click('[data-act=tab][data-v=set]'); await pg.wait_for_timeout(400)
        await pg.locator('.card', has_text='D-Motion').first.screenshot(path=D+'set.png')
        await pg.fill('#f-s-under-marks','37, 165, 261'); await pg.press('#f-s-under-marks','Tab'); await pg.wait_for_timeout(300)
        print('under marks applied', await pg.evaluate("()=>DBEngine.R.under.marks"))
        print('errors', errs); await b.close()
asyncio.run(main())
