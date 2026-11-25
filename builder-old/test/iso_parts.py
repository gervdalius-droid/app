# Partition joints in the 3D editor: every joint of a partition (bottom, top, rails) and the long rail joints have a line you can drop connectors on
import asyncio, json
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/parts_'
SEAMPT = """(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const i=st.seams.findIndex(s=>s.s.key===k); if(i<0) return null; const s=st.seams[i], f=0.62;
  return {x:svg.left+s.a[0]*(1-f)+s.b[0]*f, y:svg.top+s.a[1]*(1-f)+s.b[1]*f};}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.evaluate("()=>{document.querySelector('.top').style.position='static'}")
        await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.fill('#f-c-W','1000'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(250)
        await pg.click('[data-act=set][data-bind="c.cols"][data-v="2"]'); await pg.wait_for_timeout(350)
        keys = await pg.evaluate("()=>__dbk.S._info[1].r.joints.map(j=>j.key).join(' ')"); print('joints:', keys)
        seams = await pg.evaluate("()=>[...new Set(window.DBIso._state().C.seams.map(s=>s.s.key))].join(' ')"); print('3D lines:', seams)
        rows = await pg.evaluate("()=>[...document.querySelectorAll('.jrow .jl')].map(e=>e.textContent).join(' | ')"); print('table:', rows)
        await pg.locator('.iso3dwrap').scroll_into_view_if_needed(); await pg.evaluate('()=>window.scrollBy(0,-90)'); await pg.wait_for_timeout(150)
        for key in ['partB1','partF1','partR1']:
            pt = await pg.evaluate(SEAMPT, key)
            if not pt: print('NO LINE', key); continue
            before = await pg.evaluate("(k)=>JSON.stringify((__dbk.S._info[1].r.joints.find(j=>j.key===k)||{}).pos)", key)
            chip = await pg.locator('[data-chip=dowel]').bounding_box()
            await pg.mouse.move(chip['x']+40, chip['y']+chip['height']-40); await pg.mouse.down()
            await pg.mouse.move(pt['x'], pt['y'], steps=14); await pg.wait_for_timeout(60); await pg.mouse.up(); await pg.wait_for_timeout(300)
            j = await pg.evaluate("(k)=>JSON.stringify(__dbk.S.proj.cabinets[1].cnc.joints[k])", key)
            after = await pg.evaluate("(k)=>{const j=__dbk.S._info[1].r.joints.find(j=>j.key===k); return j.type+' '+JSON.stringify(j.pos)}", key)
            print(key, before, '→ saved', j, '→ engine', after)
        await pg.screenshot(path=OUT+'3d.png')
        # tap a line: inspector for that joint, no left/right tabs
        if await pg.locator('[data-iso=desel]').count(): await pg.click('[data-iso=desel]'); await pg.wait_for_timeout(200)
        await pg.click('[data-iso=sel][data-key=partB1]'); await pg.wait_for_timeout(250)
        ins = await pg.evaluate("()=>{const e=document.querySelector('.iso-ins'); return e? e.querySelector('b').textContent+' · side tabs:'+e.querySelectorAll('[data-iso=side]').length+' · rows:'+e.querySelectorAll('.iso-pr').length : 'none'}"); print('inspector:', ins)
        await pg.locator('.iso-ins').screenshot(path=OUT+'ins.png')
        print('warnings:', await pg.evaluate("()=>__dbk.S._info[1].warnings"))
        print('errors', errs); await b.close()
asyncio.run(main())
