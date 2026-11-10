# Prices of the same two cabinets in the offer app (../offer/index.html) and here; run with playwright.
import asyncio, json
from playwright.async_api import async_playwright
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); errs=[]
        pg=await b.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file:///home/claude/gervdalius-droid/offer/index.html'); await pg.wait_for_timeout(800)
        res=await pg.evaluate("""()=>{const out={};
          const mk=(kind,o)=>Object.assign(newCabinet(),{W:600,H:720,D:560,type:'PASTATOMOS',carcPrice:8,defFacadePrice:29,hasBack:false,sections:[Object.assign(newSection(kind),Object.assign({fill:true},o))]});
          const cabs={drawers:mk('drawers',{nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}),doors:mk('doors',{nDoors:2,hinge:'BLUM LANKSTAI',shelves:1,shelfAdj:true})};
          for(const k in cabs){S.cabinets=[cabs[k]];S.boards=[];S.quote.acc=Object.fromEntries(Object.keys(S.quote.acc).map(x=>[x,0]));S.quote.extras=[];const r=calcCabinet(cabs[k]);const Q=computeQuote();out[k]={direct:r.withHw,m2:r.carcM2+r.facadeM2+r.drawerM2,full:Q.fullCost,offer:Q.offer,hw:r.hwCost};}
          return out;}""")
        print('offer app', json.dumps(res))
        pg2=await b.new_page(); pg2.on('pageerror',lambda e:errs.append(str(e)))
        await pg2.goto('file:///home/claude/builder/index.html'); await pg2.wait_for_timeout(600)
        await pg2.evaluate("()=>localStorage.clear()"); await pg2.reload(); await pg2.wait_for_timeout(500)
        await pg2.click('[data-act=psample]'); await pg2.wait_for_timeout(300)
        res2=await pg2.evaluate("""()=>{const S=__dbk.S;const P0=__dbk.fromPreset(__dbk.PRESETS[0]),P1=__dbk.fromPreset(__dbk.PRESETS[1]);
          P1.sections[0].nDoors=2;P1.sections[0].shelves=1;[P0,P1].forEach(c=>{c.mat={carc:'',facade:'',back:''};c.edge={carc:'ABS',facade:'ABS F'};c.cnc.backs=['none'];});
          S.proj.cabinets=[P0,P1];__dbk.render();return S.proj.cabinets.map((c,i)=>{const o=__dbk.priceCabinet(c,S._info[i].r);return {direct:o.direct,m2:o.basisM2,full:o.full,offer:o.offer,hw:o.hwCost,missing:o.missing};});}""")
        print('builder', json.dumps(res2))
        print(errs); await b.close()
asyncio.run(main())
