const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
let bad=0,n=0,cabs=0;const B=m=>{bad++;if(bad<8)console.log(m);};
const secsets=[[{kind:'doors',fill:true,nDoors:1,shelves:2,hinge:'BLUM LANKSTAI'}],[{kind:'doors',fill:true,nDoors:2,shelves:3}],[{kind:'drawers',fill:false,height:300,nDrawers:1,hw:'BLUM TANDEMBOX',rail:500},{kind:'doors',fill:true,nDoors:2,shelves:1}],[{kind:'doors',fill:false,height:1400,nDoors:2,shelves:4},{kind:'open',fill:true,shelves:1}],[{kind:'doors',fill:true,nDoors:2,doorSplit:'h',hingeSide:'right'}]];
for(const joinery of ['cam','confirmat']) for(const back of ['none','top','inside']) for(const top of ['rails','full']) for(const pins of ['shelf','row']) for(const hingeFix of ['screw','press']) for(const rails of [{front:'h',back:'h'},{front:'v',back:'hv',bottom:true}])
for(const ss of secsets) for(const [W,H,D] of [[600,720,330],[400,900,560],[600,2100,580],[900,2300,600]]){
  const c={W,H,D,cnc:{joinery,back,top,rails,hinges:true,hingeFix,pins},sections:JSON.parse(JSON.stringify(ss))};
  const r=E.buildCabinet(c,0,'P'); if(r.warnings.some(w=>/didesnė už/.test(w))) continue; cabs++;
  const skipped=r.warnings.some(w=>/praleista/.test(w));
  const sides=r.panels.filter(p=>/KAIRE|DESINE/.test(p.role));
  r.panels.forEach(p=>p.holes.forEach((h,i)=>{ if(!h.op) return; n++;
    if(h.x-h.d/2<0.5||h.x+h.d/2>p.L-0.5||h.y-h.d/2<0.5||h.y+h.d/2>p.W-0.5) B('OUTSIDE '+p.name);
    p.holes.forEach((g,j)=>{ if(j===i||!(g.face===h.face||g.through)) return; if(Math.hypot(g.x-h.x,g.y-h.y)<(g.d+h.d)/2+1.5&&!(j<i&&g.op)) B('TOUCH '+p.name+JSON.stringify(h)+JSON.stringify(g)); }); }));
  r.panels.filter(p=>p.role==='DURYS').forEach(d=>d.holes.filter(h=>h.d===35).forEach(h=>{ const cup=P(d,h.x,h.y,0);
    const near=[]; sides.forEach(s=>s.holes.filter(g=>g.op==='hinge').forEach(g=>{const q=P(s,g.x,g.y,0); if(Math.abs(Math.abs(q[2]-cup[2])-16)<0.01&&Math.abs(q[0]-cup[0])<40) near.push(q);}));
    if(near.length!==2&&!skipped) B('PLATE '+d.name); }));
}
console.log(`${cabs} cabinets, ${n} hinge/pin holes, ${bad} problems`); process.exit(bad?1:0);
