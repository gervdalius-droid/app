import asyncio
from playwright.async_api import async_playwright
SP='/tmp/claude-0/-home-claude/6860c036-5f19-5ff9-b10b-c159d9b544e1/scratchpad/'
html='''<!doctype html><meta charset=utf-8><body style="margin:0;background:#e6e4de;display:flex;gap:20px;padding:20px;align-items:flex-end;flex-wrap:wrap">
<script src="file:///home/claude/cabcreator/src/engine.js"></script><script src="file:///home/claude/cabcreator/src/front.js"></script>
<script>
const E=window.DBEngine;
function draw(c,legH){ const r=E.buildCabinet(c,0,'P'); const n=c.cols||1; const cw=c.colW&&c.colW.length?c.colW:[c.W]; const bnd=[0]; cw.forEach((w,k)=>bnd.push(bnd[k]+w)); bnd[n]=c.W;
  const ovens=[]; let zc=0; c.sections.filter(s=>(s.col||0)===0).forEach(s=>{ const h=s.fill?(c.H-5-c.sections.filter(q=>(q.col||0)===0&&!q.fill).reduce((a,q)=>a+q.height,0)):s.height; if(s.kind==='oven') ovens.push({x0:18,x1:(n>1?bnd[1]-9:c.W-18),z0:zc,z1:zc+h}); zc+=h; });
  const d=document.createElement('div'); d.style.width=Math.round(380*c.W/(c.H+legH+14))+'px'; d.innerHTML=DBFront.svg(c,r,{bnd,sel:0,legs:c.cnc.legs,legH,type:c.type,ovens}); document.body.appendChild(d); }
const base=(o)=>Object.assign({name:'T',thick:18,cnc:{joinery:'confirmat',back:'none',backs:['solid'],backMount:'top',joints:{},top:'rails',rails:{front:'h',back:'h'},legs:true,hinges:true,pins:'row',facadeT:18}},o);
draw(base({W:600,H:720,D:560,mat:{carc:'LMDP balta',facade:'LMDP balta matinė'},sections:[{kind:'drawers',fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}]}),100);
draw(base({W:800,H:720,D:560,mat:{carc:'LMDP balta',facade:'Ąžuolas natūralus'},sections:[{kind:'doors',fill:true,nDoors:2,hinge:'BLUM LANKSTAI',shelves:1,shelfAdj:true}]}),100);
draw(base({type:'ŪKINĖ',W:600,H:2100,D:580,mat:{carc:'LMDP balta',facade:'Kašmyras'},cnc:Object.assign(base({}).cnc,{top:'full'}),sections:[{kind:'drawers',fill:false,height:560,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'oven',fill:false,height:595,shelves:2},{kind:'doors',fill:true,nDoors:1,hinge:'BLUM LANKSTAI',shelves:2}]}),100);
const w=base({type:'PAKABINAMOS',W:800,H:720,D:330,mat:{carc:'Pilka',facade:'Mėlyna'},sections:[{kind:'doors',fill:true,nDoors:2,hinge:'BLUM LANKSTAI',shelves:2,shelfAdj:true}]}); w.cnc.legs=false; w.cnc.top='full'; draw(w,0);
</script>'''
open(SP+'fr.html','w').write(html)
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1400,'height':900}); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
        await pg.goto('file://'+SP+'fr.html'); await pg.wait_for_timeout(400); await pg.screenshot(path=SP+'fr.png', full_page=True); print(errs); await b.close()
asyncio.run(main())
