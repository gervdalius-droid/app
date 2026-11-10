import asyncio, base64, json
from playwright.async_api import async_playwright
offer = {"v":2,"projectName":"GEL VIRT","materials":[{"id":"m1","name":"Egger W1000 18","cat":"KARKASAS"},{"id":"m2","name":"Egger U999 18","cat":"FASADAS"}],
 "cabinets":[
  {"id":"a","name":"P1","W":600,"D":560,"H":720,"type":"PASTATOMOS","thick":18,"cols":1,"carcMat":"m1","defFacadeMat":"m2","sections":[{"id":"s","kind":"drawers","col":0,"fill":True,"height":700,"nDrawers":3,"hw":"BLUM TANDEMBOX","rail":500}]},
  {"id":"b","name":"V2","W":800,"D":330,"H":720,"type":"PAKABINAMOS","thick":18,"cols":1,"carcMat":"m1","defFacadeMat":"m2","sections":[{"id":"s","kind":"doors","col":0,"fill":True,"nDoors":2,"hinge":"BLUM TIP-ON","doorSplit":"v","hingeSide":"auto","shelves":2,"shelfAdj":True,"shelfMode":"manual","shelfPos":[250,500]}]},
  {"id":"c","name":"Indaplove","W":600,"D":560,"H":720,"type":"PASTATOMOS","dishwasher":True,"dishWidth":600,"sections":[]}
 ],"rates":{},"quote":{}}
open('/home/claude/cabcreator/scratch/offer_export.json','w').write(json.dumps(offer))
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); a = await b.new_page(viewport={'width':1300,'height':900}); errs=[]
        a.on('pageerror', lambda e: errs.append(str(e)))
        await a.goto('file:///home/claude/cabcreator/dist/index.html'); await a.wait_for_timeout(400); await a.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await a.wait_for_timeout(250)
        await a.click('[data-act=drawer]'); await a.set_input_files('#f-import','/home/claude/cabcreator/scratch/offer_export.json'); await a.wait_for_timeout(500)
        info = await a.evaluate("""() => { const k=window.__dbk, S=k.S; const pj=k.buildProjectAll();
          const u=k.zipAll(pj); let s=''; for (let i=0;i<u.length;i++) s+=String.fromCharCode(u[i]);
          return {name:S.proj.name, cabs:S.proj.cabinets.map(c=>[c.name,c.type,c.cnc.top,c.cnc.back,c.mat.carc,c.dishwasher]), parts:pj.parts.length, files:pj.files.length, zip:btoa(s), warn:pj.warnings}; }""")
        open('/home/claude/cabcreator/scratch/all.zip','wb').write(base64.b64decode(info.pop('zip')))
        print(json.dumps(info, ensure_ascii=False, indent=0)[:2500]); print('errors', errs)
        await a.click('.cab >> nth=1'); await a.wait_for_timeout(200); await a.screenshot(path='/home/claude/cabcreator/scratch/offerimp.png')
        m = await b.new_page(viewport={'width':390,'height':844}); await m.goto('file:///home/claude/cabcreator/dist/index.html'); await m.wait_for_timeout(400); await m.evaluate("()=>{const b=document.querySelector('[data-act=psample]'); if(b) b.click()}"); await m.wait_for_timeout(250)
        print('mobile', await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"))
        await m.click('[data-act=tab][data-v=res]'); await m.wait_for_timeout(200); print('mobile res', await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"))
        await m.click('[data-act=tab][data-v=set]'); await m.wait_for_timeout(200); print('mobile set', await m.evaluate("[document.documentElement.scrollWidth, innerWidth]"))
        await b.close()
asyncio.run(main())
