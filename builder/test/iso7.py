# UX shots: carrying a connector (targets + ghost), full screen, mobile, dark
import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
JS_SEAM="""(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const s=st.seams.find(s=>s.s.key===k.key&&s.s.side===k.side); return {a:[svg.left+s.a[0],svg.top+s.a[1]], b:[svg.left+s.b[0],svg.top+s.b[1]], w:s.s.w};}"""
J="()=>JSON.stringify(__dbk.S.proj.cabinets[__dbk.S.sel].cnc.joints)"
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.locator('.iso3dwrap').scroll_into_view_if_needed(); await pg.evaluate('()=>window.scrollBy(0,-90)')
        chip = await pg.locator('[data-chip=dowel]').bounding_box(); st = await pg.locator('.iso-stage').bounding_box()
        await pg.mouse.move(chip['x']+100, chip['y']+60); await pg.mouse.down(); await pg.mouse.move(st['x']+st['width']*0.8, st['y']+90, steps=12); await pg.wait_for_timeout(80)
        await pg.screenshot(path=OUT+'ux_carry.png')
        s = await pg.evaluate(JS_SEAM, {'key':'bottom','side':'R'})
        x=s['a'][0]+(s['b'][0]-s['a'][0])*0.62; y=s['a'][1]+(s['b'][1]-s['a'][1])*0.62-22   # 22 px off the line: still snaps
        await pg.mouse.move(x,y,steps=10); await pg.wait_for_timeout(80)
        await pg.screenshot(path=OUT+'ux_snap.png')
        await pg.mouse.up(); await pg.wait_for_timeout(200)
        print('drop 30px off line →', await pg.evaluate(J))
        # full screen
        await pg.click('[data-iso=full]'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'ux_full.png')
        print('full', await pg.evaluate("()=>[DBIso.full(), document.querySelector('.iso3d').classList.contains('full'), document.querySelector('.iso-stage svg').getAttribute('height')]"))
        await pg.keyboard.press('Escape'); await pg.wait_for_timeout(150)
        print('after esc', await pg.evaluate("()=>DBIso.full()"))
        # mobile dark
        ctx = await b.new_context(viewport={'width':390,'height':844}, color_scheme='dark', has_touch=True, is_mobile=True)
        pm = await ctx.new_page(); pm.on('pageerror', lambda e: errs.append(str(e)))
        await pm.add_init_script("try{localStorage.clear()}catch(e){}")
        await pm.goto('file:///home/claude/cabcreator/dist/index.html'); await pm.wait_for_timeout(500); await pm.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pm.wait_for_timeout(250)
        await pm.locator('.cab >> nth=0').tap(); await pm.wait_for_timeout(200)
        await pm.locator('.iso3dwrap').scroll_into_view_if_needed()
        await pm.screenshot(path=OUT+'ux_mob.png')
        # touch drag with the finger below the line: the connector is carried 56 px above the finger
        s = await pm.evaluate(JS_SEAM, {'key':'bottom','side':'L'})
        chip = await pm.locator('[data-chip=cam]').bounding_box()
        cdp = await ctx.new_cdp_session(pm)
        tx=s['a'][0]+(s['b'][0]-s['a'][0])*0.62; ty=s['a'][1]+(s['b'][1]-s['a'][1])*0.62+56
        pts=[(chip['x']+50+(tx-chip['x']-50)*k/12, chip['y']+40+(ty-chip['y']-40)*k/12) for k in range(13)]
        await cdp.send('Input.dispatchTouchEvent', {'type':'touchStart','touchPoints':[{'x':pts[0][0],'y':pts[0][1]}]})
        for q in pts[1:]: await cdp.send('Input.dispatchTouchEvent', {'type':'touchMove','touchPoints':[{'x':q[0],'y':q[1]}]}); await pm.wait_for_timeout(16)
        await pm.screenshot(path=OUT+'ux_mob_drag.png')
        await cdp.send('Input.dispatchTouchEvent', {'type':'touchEnd','touchPoints':[]}); await pm.wait_for_timeout(250)
        print('touch drag →', await pm.evaluate(J))
        print('hscroll', await pm.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
