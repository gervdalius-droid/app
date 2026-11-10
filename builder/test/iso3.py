import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
JS_SEAM="""(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const s=st.seams.find(s=>s.s.key===k.key&&s.s.side===k.side); return {a:[svg.left+s.a[0],svg.top+s.a[1]], b:[svg.left+s.b[0],svg.top+s.b[1]], w:s.s.w};}"""
async def run(pg, tag):
    await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(600); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
    await pg.click('.cab >> nth=2'); await pg.wait_for_timeout(200)
    await pg.locator('.iso3dwrap').scroll_into_view_if_needed()
    s = await pg.evaluate(JS_SEAM, {'key':'back','side':'R'})
    x=(s['a'][0]+s['b'][0])/2+3; y=(s['a'][1]+s['b'][1])/2
    # click on the seam line between connectors → selects the joint
    await pg.mouse.click(x,y); await pg.wait_for_timeout(200)
    if tag=='desk': await pg.locator('.iso3dwrap').screenshot(path=OUT+'iso_sel_'+tag+'.png')
    # click a connector → selected connector; then arrow keys
    st = await pg.evaluate("()=>{const C=DBIso._state().C;const r=document.querySelector('.iso-stage svg').getBoundingClientRect();const h=[...document.querySelectorAll('.iso-hit')].find(e=>e.dataset.key==='top');return [r.left+ +h.getAttribute('cx'), r.top+ +h.getAttribute('cy')]}")
    await pg.mouse.click(st[0],st[1]); await pg.wait_for_timeout(150)
    for _ in range(3): await pg.keyboard.press('Shift+ArrowRight'); await pg.wait_for_timeout(80)
    print(tag, await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[2].cnc.joints)+' sel '+JSON.stringify(__dbk.S.iso)"))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await run(pg,'desk')
        ctx = await b.new_context(viewport={'width':390,'height':844}, color_scheme='dark', has_touch=True, is_mobile=True)
        pm = await ctx.new_page(); pm.on('pageerror', lambda e: errs.append(str(e)))
        await pm.add_init_script("try{localStorage.clear()}catch(e){}")
        await run(pm,'mob')
        print('hscroll', await pm.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
