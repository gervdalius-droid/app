# New-user flow: start screen → new project → first cabinet → steps → check before CNC → fix → projects list; plus migration of old saved data
import asyncio, json
from playwright.async_api import async_playwright
OUT='/home/claude/cabcreator/scratch/ux_'
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); errs=[]
        ctx = await b.new_context(viewport={'width':1440,'height':900}, accept_downloads=True)
        pg = await ctx.new_page(); pg.on('pageerror', lambda e: errs.append(str(e)))
        await pg.goto('file:///home/claude/cabcreator/dist/index.html'); await pg.evaluate("()=>localStorage.clear()"); await pg.reload(); await pg.wait_for_timeout(400)
        await pg.screenshot(path=OUT+'1_home_empty.png')
        print('fresh: home shown', await pg.locator('.home').count()==1, '· tabs hidden', await pg.locator('.tabs').count()==0)
        await pg.click('[data-act=pcreate]'); await pg.wait_for_timeout(150)
        print('empty name blocked', await pg.locator('.home').count()==1, await pg.get_attribute('#np-name','aria-invalid'))
        await pg.fill('#np-name','VIRTUVE_JONAITIS'); await pg.press('#np-name','Enter'); await pg.wait_for_timeout(250)
        print('created → picker:', await pg.locator('.presets').count()==1, await pg.inner_text('.card h3'))
        await pg.click('.preset >> nth=1'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'2_editor.png')
        print('stepnav buttons', await pg.locator('.stepnav button').count(), '· need marks', await pg.locator('.stepnav button.need').count())
        await pg.click('.stepnav [data-v=st-mats]'); await pg.wait_for_timeout(700)
        print('active after goto', await pg.inner_text('.stepnav button.on'))
        await pg.screenshot(path=OUT+'3_goto.png')
        await pg.click('[data-act=tab][data-v=res]'); await pg.wait_for_timeout(250)
        await pg.screenshot(path=OUT+'4_ready.png')
        print('check bad', await pg.locator('.ready.bad').count()==1, '| items', await pg.locator('.ready li').count())
        await pg.click('.ready [data-act=fixcab]'); await pg.wait_for_timeout(700)
        print('fix → tab', await pg.evaluate("()=>__dbk.S.tab"), 'active step', await pg.inner_text('.stepnav button.on'))
        await pg.fill('#f-c-mat-carc', 'LMDP balta 18'); await pg.fill('#f-c-mat-facade', 'LMDP antracitas 18'); await pg.fill('#f-c-edge-carc', 'ABS balta 0.8'); await pg.wait_for_timeout(200)
        await pg.click('[data-act=tab][data-v=res]'); await pg.wait_for_timeout(250)
        print('after materials: check ok', await pg.locator('.ready.ok').count()==1)
        await pg.screenshot(path=OUT+'5_ready_ok.png')
        # header new project → home with focus; library lists the project, autosaved
        await pg.click('[data-act=pnew]'); await pg.wait_for_timeout(500)
        print('new → home, focus', await pg.evaluate("()=>document.activeElement.id"), '| projects in list', await pg.locator('.prow').count())
        await pg.screenshot(path=OUT+'6_home_list.png')
        await pg.click('[data-act=pdup] >> nth=0'); await pg.wait_for_timeout(150)
        print('after copy', await pg.locator('.prow').count())
        await pg.click('[data-act=pdel] >> nth=0'); await pg.wait_for_timeout(100); await pg.click('[data-act=pdel] >> nth=0'); await pg.wait_for_timeout(150)
        print('after delete', await pg.locator('.prow').count())
        await pg.click('.prow-open >> nth=0'); await pg.wait_for_timeout(250)
        print('opened', await pg.evaluate("()=>__dbk.S.proj.name+' '+__dbk.S.proj.cabinets.length+' cab, mat '+__dbk.S.proj.cabinets[0].mat.carc"))
        # reload keeps the open project
        await pg.reload(); await pg.wait_for_timeout(400)
        print('reload → editor', await pg.locator('.stepnav').count()==1, await pg.input_value('#projname'))
        # migration: old storage format
        old = await pg.evaluate("""()=>{const P=__dbk.fromPreset(__dbk.PRESETS[0]);localStorage.clear();
           localStorage.setItem('dbKurejas.current',JSON.stringify({app:'db-kurejas',v:1,id:'cur1',name:'SENAS_DABARTINIS',cabinets:[P]}));
           localStorage.setItem('dbKurejas.projects',JSON.stringify([{name:'SENAS_1',saved:'2026-10-10T10:00:00Z',data:{app:'db-kurejas',v:1,id:'old1',name:'SENAS_1',cabinets:[P,P]}}]))}""")
        await pg.reload(); await pg.wait_for_timeout(400)
        print('migration: opened', await pg.input_value('#projname'), '| library', await pg.evaluate("()=>JSON.parse(localStorage.getItem('dbKurejas.lib')).map(r=>r.name+':'+r.n).join(', ')"))
        # mobile
        m = await b.new_page(viewport={'width':390,'height':844}, is_mobile=True, has_touch=True)
        await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(400)
        await m.screenshot(path=OUT+'8_mob_home.png', full_page=True)
        await m.fill('#np-name','TEST'); await m.locator('[data-act=pcreate]').tap(); await m.wait_for_timeout(300)
        await m.locator('.preset >> nth=0').tap(); await m.wait_for_timeout(300)
        await m.screenshot(path=OUT+'7_mob_editor.png')
        print('mobile hscroll', await m.evaluate("()=>document.documentElement.scrollWidth>innerWidth"))
        print('errors', errs); await b.close()
asyncio.run(main())
