// 3-D sanity: panels don't overlap; connector holes point into the mating panel.
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const box=p=>{const pts=[];for(const a of [0,p.L])for(const b of [0,p.W])for(const c of [0,p.T])pts.push(P(p,a,b,c));
  return [0,1,2].map(i=>[Math.min(...pts.map(q=>q[i])),Math.max(...pts.map(q=>q[i]))]);};
const inside=(bx,pt,eps=1e-6)=>bx.every((r,i)=>pt[i]>r[0]+eps&&pt[i]<r[1]-eps);
let bad=0, checked=0, cabs=0;
const opts=[]; for(const joinery of ['cam','confirmat']) for(const back of ['none','top','inside']) for(const top of ['rails','full']) for(const tof of [false,true]) opts.push({joinery,back,top,topOverFacade:tof,legs:true,facadeT:18});
for(const o of opts) for(const [W,H,D] of [[400,580,438],[600,800,600],[900,2000,580]]){
  const c={name:'T',W,H,D,thick:18,cnc:o,sections:[{kind:'drawers',fill:false,height:500,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'doors',fill:true,nDoors:2,shelves:2}]};
  const r=E.buildCabinet(c,0,'P'); cabs++;
  const bx=r.panels.map(box);
  // overlaps
  for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){
    const v=bx[i].reduce((acc,ri,k)=>acc*Math.max(0,Math.min(ri[1],bx[j][k][1])-Math.max(ri[0],bx[j][k][0])),1);
    if(v>1e-3 && !(o.back==='inside'&&o.top==='rails')){ bad++; if(bad<6) console.log('OVERLAP',JSON.stringify(o),W,r.panels[i].name,r.panels[j].name,v); }
  }
  const others=(i,pt)=>bx.some((b,j)=>j!==i&&inside(b,pt));
  r.panels.forEach((p,i)=>{
    p.edges.forEach(e=>{ let pt;
      if(e.edge==='x0') pt=P(p,-1,e.pos,p.T/2); else if(e.edge==='x1') pt=P(p,p.L+1,e.pos,p.T/2);
      else if(e.edge==='y0') pt=P(p,e.pos,-1,p.T/2); else pt=P(p,e.pos,p.W+1,p.T/2);
      checked++; if(!others(i,pt)){ bad++; if(bad<6) console.log('EDGE HOLE INTO AIR',JSON.stringify(o),p.name,e); } });
    p.holes.forEach(h=>{ if(h.mark||h.d===15||p.role==='FASADAS') return;
      checked++;
      const a=P(p,h.x,h.y,-1), b=P(p,h.x,h.y,p.T+1);   // just outside face A / face B
      const ok = h.through ? (others(i,a)||others(i,b)) : others(i, h.face==='A'?a:b);
      if(!ok){ bad++; if(bad<6) console.log('HOLE INTO AIR',JSON.stringify(o),p.name,h); } });
  });
}
console.log(`${cabs} cabinets, ${checked} connector holes checked, ${bad} problems`);
process.exit(bad?1:0);
