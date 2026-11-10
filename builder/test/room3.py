import asyncio
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/rm_'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        ctx = await b.new_context(viewport={'width':390,'height':844}, color_scheme='dark', is_mobile=True, has_touch=True)
        m = await ctx.new_page(); m.on('pageerror', lambda e: errs.append(str(e)))
        await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(300)
        await m.locator('[data-act=psample]').tap(); await m.wait_for_timeout(250)
        await m.locator('[data-act=tab][data-v=room]').tap(); await m.wait_for_timeout(300)
        await m.screenshot(path=OUT+'mob.png', full_page=True)
        # tap a palette card adds a cabinet after the last one
        n0 = await m.evaluate("()=>__dbk.S.proj.cabinets.length")
        await m.locator('.rm-chip >> nth=1').tap(); await m.wait_for_timeout(300)
        print('tap add', n0, '→', await m.evaluate("()=>__dbk.S.proj.cabinets.length"), await m.evaluate("()=>JSON.stringify(__dbk.S.proj.layout.items[__dbk.S.proj.cabinets.at(-1).id])"))
        print('hscroll', await m.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
