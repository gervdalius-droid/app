// Connectors placed one by one (3D editor): random positions per joint. Checks
//  1) every seam point the editor draws is a real connector of the side (edge bore or face hole at that spot), both sides;
//  2) every edge bore still meets its face hole and nothing touches (same rules as align_mixed);
//  3) positions come back as given (inside the limits) and the engine reports what it changed.
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
let bad=0,cabs=0,pts=0; const B=m=>{bad++; if(bad<12) console.log(m);};
let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
const T3=['confirmat','cam','dowel'], keys=['bottom','top','railF','railB','railV','railBottom','back','shelf','oven'];
const secsets=[
 [{kind:'drawers',fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}],
 [{kind:'doors',fill:true,nDoors:2,shelves:2,shelfAdj:false}],
 [{kind:'drawers',fill:false,height:560,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'oven',fill:false,height:595,shelves:2},{kind:'doors',fill:true,nDoors:1,shelves:1,shelfAdj:false}],
];
const railsets=[{front:'h',back:'h'},{front:'v',back:'v'},{front:'h',back:'hv',bottom:true}];
for(let it=0;it<1500;it++){
  const ss=secsets[it%3], rails=railsets[Math.floor(it/3)%3], top=it%7===0?'full':'rails', back=['none','top','inside'][Math.floor(it/9)%3];
  const [W,H,D]=it%3===2?[600,2100,580]:[[600,720,560],[400,720,330],[900,720,600]][Math.floor(it/27)%3];
  const mk=(k)=>{ const ty=T3[Math.floor(rnd()*3)], n=Math.floor(rnd()*5); const L=k.indexOf('rail')===0?100:k==='back'?H:D;
    const r=rnd(); return r<0.2?{type:ty}:{type:ty,pos:Array.from({length:n},()=>Math.round(rnd()*L))}; };
  const joints={}; keys.forEach(k=>{ joints[k]= it%2 ? {L:mk(k),R:mk(k)} : mk(k); }); ['railVH','railBotB'].forEach(k=>{ const ty=T3[Math.floor(rnd()*3)], n=Math.floor(rnd()*5); joints[k]={type:ty,pos:Array.from({length:n},()=>Math.round(rnd()*W))}; });   // long rail joints: one line   // every other cabinet: left and right sides differ
  const c={name:'T',W,H,D,thick:18,cnc:{joinery:'confirmat',back,backFix:'confirmat',joints,top,rails,legs:true,hinges:true,pins:'shelf',topOverFacade:false},sections:JSON.parse(JSON.stringify(ss))};
  const r=E.buildCabinet(c,0,'P'); if(r.warnings.some(w=>/didesnė už fasadų zoną/.test(w))) continue; cabs++;
  const ps=r.panels, flagged=r.warnings.some(w=>/persidengia/.test(w));
  const side={L:ps.find(p=>p.role==='KAIRE'),R:ps.find(p=>p.role==='DESINE')};
  // 1) seams ↔ side connectors
  r.seams.forEach(sm=>{ const j0=r.joints.find(x=>x.key===sm.key); if(!j0){B('seam without joint '+sm.key);return;} const j=Object.assign({w:j0.w},j0.sides[sm.side]);
    const spots=[]; (keys.includes(sm.key)?[side[sm.side]]:ps).forEach(sp=>{   // side joints: that side; the rest (rails, partitions): any part
    sp.edges.forEach(e=>{ let a,b; if(e.edge==='x0'){a=0;b=e.pos;} else if(e.edge==='x1'){a=sp.L;b=e.pos;} else if(e.edge==='y0'){a=e.pos;b=0;} else {a=e.pos;b=sp.W;} spots.push(P(sp,a,b,sp.T/2)); });
    sp.holes.forEach(h=>{ if(!h.mark&&!h.op) spots.push(P(sp,h.x,h.y,0)); }); });
    j.pos.concat(j.dowels).forEach(a=>{ pts++; const q=sm.o.map((v,i)=>v+a*sm.d[i]); if(!spots.some(s=>dist(s,q)<0.6)) B('SEAM POINT NOT DRILLED '+sm.key+' '+sm.side+' a='+a+' '+JSON.stringify(q)+' '+JSON.stringify(c.cnc.rails)+' back '+back+' '+top); });
    // 3) given positions survive when inside limits and far enough apart
    if(!joints[sm.key]) return; const spec=joints[sm.key].L?joints[sm.key][sm.side]:joints[sm.key]; if(!spec.pos) return;
    const given=spec.pos.map(Number).sort((a,b)=>a-b);
    const ok=given.every(a=>a>=j.minEdge&&a<=j.w-j.minEdge) && given.every((a,i)=>i===0||a-given[i-1]>=j.minGap);
    if(ok && JSON.stringify(given)!==JSON.stringify(j.pos)) B('POSITIONS CHANGED '+sm.key+' '+given+' → '+j.pos);
    if(!given.length && !r.warnings.some(w=>/nesurištas/.test(w))) B('NO WARNING for empty joint '+sm.key);
  });
  // 2) edge bore ↔ face hole, no touching
  const faceHoles=[]; ps.forEach(p=>p.holes.forEach(h=>{ if(h.mark||h.op||h.d===15||/FASADAS|DURYS/.test(p.role)) return;
     const n=p.place.n; (h.through?['A','B']:[h.face]).forEach(f=>faceHoles.push({p,h,pt:f==='A'?P(p,h.x,h.y,0):P(p,h.x,h.y,p.T), n:f==='A'?n:n.map(v=>-v)})); }));
  ps.forEach(p=>p.edges.forEach(e=>{ let a,b,out; const u=p.place.u,v=p.place.v;
    if(e.edge==='x0'){a=0;b=e.pos;out=u.map(x=>-x);} else if(e.edge==='x1'){a=p.L;b=e.pos;out=u;} else if(e.edge==='y0'){a=e.pos;b=0;out=v.map(x=>-x);} else {a=e.pos;b=p.W;out=v;}
    const pt=P(p,a,b,p.T/2); const m=faceHoles.find(f=>f.p!==p&&dist(f.pt,pt)<0.6&&f.n.every((x,i)=>Math.abs(x+out[i])<1e-6));
    if(!m) B('EDGE BORE MEETS NOTHING '+p.name+' '+JSON.stringify(e)); else { m.used=true; if(m.h.d!==e.d && !(m.h.through && e.d===5)) B('SIZE MISMATCH '+p.name); } }));
  faceHoles.filter(f=>!f.used && !(f.h.through && faceHoles.some(g=>g!==f && g.h===f.h && g.used))).forEach(f=>B('FACE HOLE WITHOUT EDGE BORE '+f.p.name+' '+JSON.stringify(f.h)));
  ps.forEach(p=>p.holes.forEach((h,i)=>p.holes.forEach((g,k)=>{ if(k<=i||g.mark||h.mark) return; if(!(g.face===h.face||g.through||h.through)) return;
    if(Math.hypot(g.x-h.x,g.y-h.y)<(g.d+h.d)/2+0.5 && !flagged) B('TOUCH unflagged '+p.name); })));
}
console.log(`${cabs} cabinets with hand-placed connectors, ${pts} seam points checked, ${bad} problems`);
process.exit(bad?1:0);
