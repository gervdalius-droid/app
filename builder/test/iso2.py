import asyncio, json
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
JS_SEAM="""(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const i=st.seams.findIndex(s=>s.s.key===k.key&&s.s.side===k.side); const s=st.seams[i];
  return {a:[svg.left+s.a[0],svg.top+s.a[1]], b:[svg.left+s.b[0],svg.top+s.b[1]], w:s.s.w};}"""
async def drag(pg, x0,y0,x1,y1, steps=12):
    await pg.mouse.move(x0,y0); await pg.mouse.down(); await pg.mouse.move(x1,y1,steps=steps); await pg.wait_for_timeout(50); await pg.mouse.up(); await pg.wait_for_timeout(150)
def lerp(s,u): return (s['a'][0]+(s['b'][0]-s['a'][0])*u, s['a'][1]+(s['b'][1]-s['a'][1])*u)
async def joints(pg): return await pg.evaluate("()=>{const S=__dbk.S;return JSON.parse(JSON.stringify(S.proj.cabinets[S.sel].cnc.joints))}")
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page(viewport={'width':1440,'height':1000}); errs=[]
        pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(600); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.locator('.iso3dwrap').scroll_into_view_if_needed(); await pg.evaluate('()=>window.scrollBy(0,-90)')
        # 1) drag a cam chip onto the left bottom seam at ~40 % (between two confirmats) → adds + converts
        s = await pg.evaluate(JS_SEAM, {'key':'bottom','side':'L'})
        chip = await pg.locator('[data-chip=cam]').bounding_box()
        x,y = lerp(s,0.62)
        await pg.mouse.move(chip['x']+20, chip['y']+15); await pg.mouse.down(); await pg.mouse.move(x,y,steps=20); await pg.wait_for_timeout(80)
        await pg.locator('.iso3dwrap').screenshot(path=OUT+'iso_drag_add.png')
        await pg.mouse.up(); await pg.wait_for_timeout(250)
        print('after add', await joints(pg))
        # 2) move the first connector of the bottom seam (right side) toward the front
        s = await pg.evaluate(JS_SEAM, {'key':'bottom','side':'R'})
        j = (await joints(pg))['bottom']; w=s['w']
        x0,y0 = lerp(s, j['pos'][0]/w); x1,y1 = lerp(s, 120/w)
        await pg.mouse.move(x0,y0); await pg.mouse.down(); await pg.mouse.move(x1,y1,steps=15); await pg.wait_for_timeout(80)
        await pg.locator('.iso-stage').screenshot(path=OUT+'iso_drag_move.png')
        await pg.mouse.up(); await pg.wait_for_timeout(250)
        print('after move', await joints(pg))
        # 3) drag the last connector far away → removed
        s = await pg.evaluate(JS_SEAM, {'key':'bottom','side':'L'})
        j = (await joints(pg))['bottom']
        x0,y0 = lerp(s, j['pos'][-1]/w)
        await drag(pg, x0,y0, x0+10, y0-160)
        print('after remove', await joints(pg))
        # 4) undo restores it
        await pg.click('[data-iso=undo]'); await pg.wait_for_timeout(200)
        print('after undo', await joints(pg))
        # 5) orbit by dragging empty space
        st = await pg.locator('.iso-stage').bounding_box()
        th0 = await pg.evaluate("()=>DBIso.view.th")
        await drag(pg, st['x']+30, st['y']+30, st['x']+230, st['y']+60)
        print('orbit th', th0, '→', await pg.evaluate("()=>DBIso.view.th"))
        await pg.locator('.iso3dwrap').screenshot(path=OUT+'iso_after.png')
        # 6) keyboard: select joint marker via inspector input change, arrow keys
        await pg.click('[data-iso=home]')
        info = await pg.evaluate("()=>{const r=__dbk.S._info[__dbk.S.sel].r;return r.warnings}")
        print('warnings', info)
        # programs still build, and the bottom has cam bolts where the user put them
        pj = await pg.evaluate("()=>{const pj=__dbk.buildProjectAll();return pj.parts.filter(p=>p.cab===2).map(p=>p.short+':'+(p.progs||[]).length)}")
        print(pj)
        print('errors', errs); await b.close()
asyncio.run(main())
