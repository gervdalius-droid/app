import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/'
JS_SEAM="""(k)=>{const st=DBIso._state().C; const svg=document.querySelector('.iso-stage svg').getBoundingClientRect();
  const s=st.seams.find(s=>s.s.key===k.key&&s.s.side===k.side); return {a:[svg.left+s.a[0],svg.top+s.a[1]], b:[svg.left+s.b[0],svg.top+s.b[1]], w:s.s.w};}"""
J="()=>JSON.stringify(__dbk.S.proj.cabinets[__dbk.S.sel].cnc.joints)"
INFO="()=>__dbk.S._info[__dbk.S.sel].r.joints.map(j=>j.key+(j.split?' SPLIT':'')+' L='+j.sides.L.type+':'+j.sides.L.pos.join('/')+' R='+j.sides.R.type+':'+j.sides.R.pos.join('/')).join(' | ')"
def lerp(s,u): return (s['a'][0]+(s['b'][0]-s['a'][0])*u, s['a'][1]+(s['b'][1]-s['a'][1])*u)
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        pg = await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(500); await pg.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await pg.wait_for_timeout(250)
        await pg.click('.cab >> nth=0'); await pg.wait_for_timeout(200)
        await pg.locator('.iso3dwrap').scroll_into_view_if_needed(); await pg.evaluate('()=>window.scrollBy(0,-90)')
        await pg.click('[data-iso=mode][data-v=sep]'); await pg.wait_for_timeout(150)
        # 1) move the first bottom connector on the RIGHT side only
        s = await pg.evaluate(JS_SEAM, {'key':'bottom','side':'R'}); w=s['w']
        x0,y0 = lerp(s,70/w); x1,y1 = lerp(s,130/w)
        await pg.mouse.move(x0,y0); await pg.mouse.down(); await pg.mouse.move(x1,y1,steps=15); await pg.wait_for_timeout(60)
        await pg.locator('.iso-sw').screenshot(path=OUT+'iso_sep_move.png')
        await pg.mouse.up(); await pg.wait_for_timeout(250)
        print('1', await pg.evaluate(J)); print('  ', await pg.evaluate(INFO)); print('  xside', await pg.evaluate("()=>__dbk.S.xside"))
        # 2) drop a cam on the LEFT front rail connector → only the left end becomes cam
        hp = await pg.evaluate("""()=>{const C=DBIso._state().C;const r=document.querySelector('.iso-stage svg').getBoundingClientRect();
          const sp=C.seams.find(s=>s.s.key==='railF'&&s.s.side==='L');const P=(a)=>[sp.a[0]+(sp.b[0]-sp.a[0])*a/sp.s.w, sp.a[1]+(sp.b[1]-sp.a[1])*a/sp.s.w];
          const q=P(30);return [r.left+q[0], r.top+q[1]]}""")
        chip = await pg.locator('[data-chip=cam]').bounding_box()
        await pg.mouse.move(chip['x']+20, chip['y']+15); await pg.mouse.down(); await pg.mouse.move(hp[0],hp[1],steps=20); await pg.wait_for_timeout(60); await pg.mouse.up(); await pg.wait_for_timeout(250)
        print('2', await pg.evaluate(J)); print('  ', await pg.evaluate(INFO))
        await pg.locator('.iso3dwrap').screenshot(path=OUT+'iso_sep_after.png')
        # 3) "Both" mode: editing a joint that already differs still edits per side
        await pg.click('[data-iso=mode][data-v=both]'); await pg.wait_for_timeout(150)
        # 4) inspector copy to the other side
        await pg.click('[data-iso=desel]'); await pg.wait_for_timeout(100); await pg.click('[data-iso=sel][data-key=bottom]'); await pg.wait_for_timeout(150)
        await pg.locator('.iso-ins').screenshot(path=OUT+'iso_sep_ins.png')
        await pg.click('[data-iso=side][data-v=R]'); await pg.wait_for_timeout(150)
        await pg.click('[data-iso=copy]'); await pg.wait_for_timeout(200)
        print('4', await pg.evaluate(J))
        # 5) undo twice
        await pg.click('[data-iso=undo]'); await pg.wait_for_timeout(150)
        print('5', await pg.evaluate(J))
        await pg.locator('.jtable').screenshot(path=OUT+'iso_sep_table.png')
        # programs build, holes per side
        print(await pg.evaluate("""()=>{const r=__dbk.S._info[__dbk.S.sel].r;return ['KAIRE','DESINE','JUOSTA_PRIEKIS'].map(n=>{const p=r.panels.find(p=>p.role===n);return n+': '+p.holes.filter(h=>!h.mark&&!h.op).length+' holes, '+p.edges.length+' edge'}).join(' | ')}"""))
        print('errors', errs); await b.close()
asyncio.run(main())
