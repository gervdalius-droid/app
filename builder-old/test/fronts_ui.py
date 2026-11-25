# Stacked fronts each with their own height: top drawer 150, the rest share what is left; the engine, sketch and render follow
import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/fronts_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250)   # cabinet 1: drawers ×3
        await pg.evaluate("()=>{document.querySelector('.top').style.position='static'}")
        fr="()=>__dbk.S._info[0].r.panels.filter(p=>p.role==='FASADAS').map(p=>Math.round(Math.min(p.L,p.W)*10)/10).join(' / ')"
        print('before', await pg.evaluate(fr), '· placeholders', await pg.evaluate("()=>[...document.querySelectorAll('.fh input')].map(i=>i.placeholder).join(' ')"))
        await pg.fill('#f-c-sections-0-frontH-0','150'); await pg.press('#f-c-sections-0-frontH-0','Tab'); await pg.wait_for_timeout(300)
        print('top 150', await pg.evaluate(fr), '· placeholders', await pg.evaluate("()=>[...document.querySelectorAll('.fh input')].map(i=>i.value||('('+i.placeholder+')')).join(' ')"))
        print('saved', await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[0].sections[0].frontH)"))
        await pg.locator('.sec').first.screenshot(path=OUT+'sec.png')
        await pg.locator('#colmap').screenshot(path=OUT+'render.png')
        await pg.fill('#f-c-sections-0-frontH-2','300'); await pg.press('#f-c-sections-0-frontH-2','Tab'); await pg.wait_for_timeout(300)
        print('top 150, bottom 300', await pg.evaluate(fr))
        await pg.fill('#f-c-sections-0-frontH-1','500'); await pg.press('#f-c-sections-0-frontH-1','Tab'); await pg.wait_for_timeout(300)
        print('all set, too big', await pg.evaluate(fr), '·', await pg.evaluate("()=>(document.querySelector('.fh-warn')||{}).textContent"))
        await pg.click('[data-act=fhreset]'); await pg.wait_for_timeout(300)
        print('equal again', await pg.evaluate(fr), await pg.evaluate("()=>JSON.stringify(__dbk.S.proj.cabinets[0].sections[0].frontH)"))
        print('errors', errs); await b.close()
asyncio.run(main())
