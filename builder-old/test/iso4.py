import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
JS_SEAM="""(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const s=st.seams.find(s=>s.s.key===k.key&&s.s.side===k.side); return {a:[svg.left+s.a[0],svg.top+s.a[1]], b:[svg.left+s.b[0],svg.top+s.b[1]], w:s.s.w};}"""
J="()=>JSON.stringify(__dbk.S.proj.cabinets[__dbk.S.sel].cnc.joints)"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        ctx = await b.new_context(viewport={'width':390,'height':844}, has_touch=True, is_mobile=True)
        pm = await ctx.new_page(); pm.on('pageerror', lambda e: errs.append(str(e)))
        await pm.add_init_script("try{localStorage.clear()}catch(e){}")
        await pm.goto('file:///home/claude/cabcreator/dist/index.html'); await pm.wait_for_timeout(600); await pm.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pm.wait_for_timeout(250)
        await pm.locator('.cab >> nth=0').tap(); await pm.wait_for_timeout(200)
        await pm.locator('.iso3dwrap').scroll_into_view_if_needed(); await pm.evaluate('()=>window.scrollBy(0,-90)')
        await pm.locator('[data-chip=dowel]').tap(); await pm.wait_for_timeout(150)
        await pm.locator('.iso3dwrap').screenshot(path=OUT+'iso_armed.png')
        s = await pm.evaluate(JS_SEAM, {'key':'bottom','side':'L'})
        x=s['a'][0]+(s['b'][0]-s['a'][0])*0.3; y=s['a'][1]+(s['b'][1]-s['a'][1])*0.3
        await pm.touchscreen.tap(x,y); await pm.wait_for_timeout(250)
        print('tap add', await pm.evaluate(J), 'armed chip', await pm.locator('.iso-chip.on').count())
        await pm.locator('.iso3dwrap').screenshot(path=OUT+'iso_tapadd.png')
        # desktop: tall cabinet, drop confirmat chip on an oven-support connector → convert type
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.evaluate("()=>{__dbk.S.proj.cabinets.push(__dbk.fromPreset(__dbk.PRESETS[4]));__dbk.S.sel=__dbk.S.proj.cabinets.length-1;__dbk.render()}")
        await pg.wait_for_timeout(200); await pg.locator('.iso3dwrap').scroll_into_view_if_needed(); await pg.evaluate('()=>window.scrollBy(0,-90)')
        await pg.locator('.iso3dwrap').screenshot(path=OUT+'iso_tall.png')
        print('tall joints', await pg.evaluate("()=>__dbk.S._info[__dbk.S.sel].r.joints.map(j=>j.key+':'+j.type+':'+j.pos.join('/'))"))
        hp = await pg.evaluate("()=>{const r=document.querySelector('.iso-stage svg').getBoundingClientRect();const h=[...document.querySelectorAll('.iso-hit')].find(e=>e.dataset.key==='oven');return [r.left+ +h.getAttribute('cx'), r.top+ +h.getAttribute('cy')]}")
        chip = await pg.locator('[data-chip=confirmat]').bounding_box()
        await pg.mouse.move(chip['x']+20, chip['y']+15); await pg.mouse.down(); await pg.mouse.move(hp[0],hp[1],steps=20); await pg.wait_for_timeout(60)
        await pg.locator('.iso-sw').screenshot(path=OUT+'iso_conv.png')
        await pg.mouse.up(); await pg.wait_for_timeout(250)
        print('convert', await pg.evaluate(J))
        print('errors', errs); await b.close()
asyncio.run(main())
