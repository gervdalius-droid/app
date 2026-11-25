# More legs in the Operations step: legs in a row, rows, under partitions; plan view and count follow the engine
import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/legs_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(viewport={'width':1440,'height':1000}); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(250); await pg.click('.cab >> nth=1'); await pg.wait_for_timeout(200)
        await pg.evaluate("()=>{document.querySelector('.top').style.position='static'}")
        await pg.fill('#f-c-W','1200'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(200)
        cnt="()=>__dbk.S._info[1].r.legs.length+' legs · plan dots '+document.querySelectorAll('.legplan .lp-leg').length+' · caption '+document.querySelector('.legplan figcaption b').textContent"
        print('default', await pg.evaluate(cnt))
        await pg.click('[data-act=set][data-bind="c.cnc.legsX"][data-v="3"]'); await pg.wait_for_timeout(250); print('3 in a row', await pg.evaluate(cnt))
        await pg.click('[data-act=set][data-bind="c.cnc.legsY"][data-v="3"]'); await pg.wait_for_timeout(250); print('+ middle row', await pg.evaluate(cnt))
        await pg.click('[data-act=set][data-bind="c.cols"][data-v="3"]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=set][data-bind="c.cnc.legsX"][data-v="parts"]'); await pg.wait_for_timeout(250); print('under partitions', await pg.evaluate(cnt), await pg.evaluate("()=>__dbk.S._info[1].r.legs.filter((l,i,a)=>l.y===a[0].y).map(l=>Math.round(l.x)).join(' ')"))
        print('marks', await pg.evaluate("()=>__dbk.S._info[1].r.panels.find(p=>p.role==='DUGNAS').holes.filter(h=>h.mark&&h.face==='B').length"))
        print('hardware', await pg.evaluate("()=>JSON.stringify(__dbk.S._info[1].r.hardware.find(h=>h.item==='Kojelės'))"))
        await pg.locator('.op', has_text='Kojelės').first.screenshot(path=OUT+'op.png')
        await pg.fill('#f-c-W','400'); await pg.press('#f-c-W','Tab'); await pg.wait_for_timeout(250)
        print('narrow: disabled options', await pg.evaluate("()=>[...document.querySelectorAll('[data-bind=\"c.cnc.legsX\"]:disabled')].map(b=>b.dataset.v).join(',')"))
        print('errors', errs); await b.close()
asyncio.run(main())
