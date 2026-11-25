# kitchen editor: move along a wall, add from the palette, second wall + corner snap in plan, fill gap, width, 3D select, undo
import asyncio, json
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/rm_'
L="()=>JSON.stringify(__dbk.S.proj.layout.items)"
async def cabxy(pg, i):
    return await pg.evaluate("(i)=>{const g=document.querySelector('.rm-stage svg [data-cab=\"'+i+'\"]');const r=g.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2,r.width]}", i)
async def drag(pg,a,b,steps=14):
    await pg.mouse.move(*a); await pg.mouse.down(); await pg.mouse.move(*b, steps=steps); await pg.wait_for_timeout(60); await pg.mouse.up(); await pg.wait_for_timeout(250)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':950}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.evaluate("()=>localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(300)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250)
        await pg.click('[data-act=tab][data-v=room]'); await pg.wait_for_timeout(300)
        ids = await pg.evaluate("()=>__dbk.S.proj.cabinets.map(c=>c.id)")
        # 1) drag cabinet 2 to the right by ~400 mm
        c2 = await cabxy(pg, 1); k = await pg.evaluate("()=>DBRoom._state().C.fr.k")
        await drag(pg, (c2[0], c2[1]), (c2[0]+400*k, c2[1]))
        it = json.loads(await pg.evaluate(L)); print('1 move →', it[ids[1]])
        # 2) drag it back near cabinet 1: snaps to the neighbour at x=600
        c2 = await cabxy(pg, 1); await drag(pg, (c2[0], c2[1]), (c2[0]-385*k, c2[1]))
        it = json.loads(await pg.evaluate(L)); print('2 snap back →', it[ids[1]])
        # 3) drag a drawer cabinet from the palette next to it
        chip = await pg.locator('.rm-chip >> nth=0').bounding_box(); c2 = await cabxy(pg, 1)
        await pg.mouse.move(chip['x']+60, chip['y']+20); await pg.mouse.down(); await pg.mouse.move(c2[0]+620*k, c2[1], steps=16); await pg.wait_for_timeout(80)
        await pg.screenshot(path=OUT+'add_drag.png'); await pg.mouse.up(); await pg.wait_for_timeout(300)
        n = await pg.evaluate("()=>__dbk.S.proj.cabinets.length"); it = json.loads(await pg.evaluate(L)); newid = await pg.evaluate("()=>__dbk.S.proj.cabinets[__dbk.S.proj.cabinets.length-1].id")
        print('3 add →', n, 'cabinets; new at', it[newid], '· selected', await pg.evaluate("()=>__dbk.S.roomSel"))
        # 4) add wall B, go to plan, drag cabinet 4 onto wall B near the corner → snaps after the corner depth
        await pg.click('[data-rm=desel]'); await pg.wait_for_timeout(100)
        await pg.click('[data-rm=wadd]'); await pg.wait_for_timeout(200)
        await pg.click('[data-rm=view][data-v=plan]'); await pg.wait_for_timeout(200)
        pl = await pg.evaluate("()=>{const C=DBRoom._state().C;return {k:C.pl.k,ox:C.pl.ox,x0:C.pl.x0,y0:C.pl.y0}}")
        svg = await pg.locator('.rm-stage svg').bounding_box()
        def P(x,y): return (svg['x']+pl['ox']+(x-pl['x0'])*pl['k'], svg['y']+10+(y-pl['y0'])*pl['k'])
        c4 = await cabxy(pg, 3)
        await drag(pg, (c4[0], c4[1]), P(2400-300, 650))   # wall B starts at (2400,0) and runs down; interior to the left
        it = json.loads(await pg.evaluate(L)); print('4 to wall B →', it[newid])
        await pg.screenshot(path=OUT+'plan2.png')
        # 5) select cabinet 1, fill gap button / width change
        await pg.click('[data-rm=view][data-v=front]'); await pg.wait_for_timeout(200)
        c1 = await cabxy(pg, 0); await pg.mouse.click(c1[0], c1[1]); await pg.wait_for_timeout(200)
        await pg.fill('#rm-w', '450'); await pg.press('#rm-w', 'Tab'); await pg.wait_for_timeout(250)
        print('5 width →', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].W"), '· fill button:', await pg.locator('[data-rm=fill]').count())
        if await pg.locator('[data-rm=fill]').count():
            await pg.click('[data-rm=fill]'); await pg.wait_for_timeout(250)
            print('  after fill →', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].W"), json.loads(await pg.evaluate(L))[ids[0]])
        await pg.screenshot(path=OUT+'front2.png')
        # 6) undo restores width
        await pg.click('[data-rm=undo]'); await pg.wait_for_timeout(250)
        print('6 undo → W', await pg.evaluate("()=>__dbk.S.proj.cabinets[0].W"))
        # 7) 3D: click a cabinet selects it
        await pg.click('[data-rm=view][data-v="3d"]'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'3d2.png')
        f = await pg.evaluate("()=>{const e=[...document.querySelectorAll('.rm-stage [data-cab=\"1\"]')].pop();const r=e.getBoundingClientRect();return [r.left+r.width/2,r.top+r.height/2]}")
        await pg.mouse.click(f[0], f[1]); await pg.wait_for_timeout(200)
        print('7 3D click selects', await pg.evaluate("()=>__dbk.S.roomSel"))
        # 8) parts / programs still build for the new cabinet
        print('8 parts', await pg.evaluate("()=>__dbk.buildProjectAll().parts.length"))
        print('errors', errs); await b.close()
asyncio.run(main())
