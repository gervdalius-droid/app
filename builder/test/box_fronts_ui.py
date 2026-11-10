import asyncio
from playwright.async_api import async_playwright
S='/tmp/claude-0/-home-claude/6860c036-5f19-5ff9-b10b-c159d9b544e1/scratchpad/bxf_'
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        ctx=await b.new_context(viewport={'width':1366,'height':900}); pg=await ctx.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.add_init_script("try{localStorage.clear()}catch(e){}")
        await pg.goto('file:///home/claude/builder/index.html'); await pg.wait_for_timeout(600)
        await pg.click('[data-act=psample]'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=pick]'); n=await pg.evaluate("()=>document.querySelectorAll('[data-act=preset]').length")
        await pg.click(f'[data-act=preset][data-i="{n-1}"]'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=boxadd][data-v=shelf]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=boxadd][data-v=part]'); await pg.wait_for_timeout(300)
        await pg.click('[data-act=boxfadd][data-v=drawers]'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=boxfadd][data-v=doors]'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=boxfadd][data-v=doors]'); await pg.wait_for_timeout(400)
        st="()=>{const i=__dbk.S.sel,r=__dbk.S._info[i].r;return JSON.stringify(__dbk.S.proj.cabinets[i].box.fronts.map(f=>[f.kind,f.col,f.cell]))+' | '+r.panels.filter(p=>/FASADAS|DURYS|STALC/.test(p.role)).map(p=>p.short+' '+p.L+'x'+p.W).join(', ')+' | hw '+JSON.stringify(r.hardware)+' | '+JSON.stringify(__dbk.S._info[i].warnings)}"
        print(await pg.evaluate(st))
        await pg.select_option('#f-c-box-fronts-0-hw','DTC PASLĖPTI'); await pg.wait_for_timeout(400)
        await pg.click('[data-act=set][data-bind="c.box.fronts.1.inset"][data-v=true]'); await pg.wait_for_timeout(400)
        print(await pg.evaluate(st))
        await pg.locator('#st-fronts').screenshot(path=S+'step.png')
        await pg.locator('#assembly-preview').screenshot(path=S+'3d.png')
        await pg.evaluate("()=>{const sv=document.querySelector('.sheet .fr-svg, .fr-svg');}")
        await pg.screenshot(path=S+'full.png', full_page=False)
        await pg.click('[data-act=tab][data-v=drw]'); await pg.wait_for_timeout(900)
        sid=await pg.evaluate("()=>__dbk.S._drw.map(x=>x.id).join(',')"); print('sheets', sid)
        svg=await pg.evaluate("()=>{const i=__dbk.S.proj.cabinets.length-1;const s=__dbk.S._drw.find(x=>x.cab===i);return s?s.svg:''}"); open(S+'sheet.svg','w').write(svg)
        await pg.click('[data-act=tab][data-v=parts]') if await pg.locator('[data-act=tab][data-v=parts]').count() else None
        print('errors', errs); await b.close()
asyncio.run(main())
