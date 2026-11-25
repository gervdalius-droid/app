// Cabinets with partitions (2–3 columns) and a back per column: geometry and joints must close up.
//  every edge bore meets a face hole of the right size and every face connector hole meets an edge bore,
//  no two parts take the same space, fronts stay inside the cabinet and do not overlap,
//  holes on one face do not touch unless the engine says so, blind holes from both faces of a partition do not meet unless warned.
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const K={}; let bad=0,cabs=0,nb=0,parts=0; const B=m=>{bad++; if(bad<12) console.log(m); K[m.split(" ").slice(0,5).join(" ").replace(/a=.*/,"")]=(K[m.split(" ").slice(0,5).join(" ").replace(/a=.*/,"")]||0)+1;};
const T3=['confirmat','cam','dowel'];
const secsets=[
 (n)=>Array.from({length:n},(_,k)=>({kind:k%2?'drawers':'doors',col:k,fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500,nDoors:1,hinge:'BLUM LANKSTAI',hingeSide:k%2?'right':'left',shelves:2,shelfAdj:true})),
 (n)=>Array.from({length:n},(_,k)=>({kind:'doors',col:k,fill:true,nDoors:2,hinge:'BLUM LANKSTAI',shelves:2,shelfAdj:k===0})),
 (n)=>Array.from({length:n},(_,k)=>({kind:'open',col:k,fill:true,shelves:k+1,shelfAdj:k%2===1})),
 (n)=>[{kind:'drawers',col:0,fill:false,height:560,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'oven',col:0,fill:false,height:595,shelves:2},{kind:'doors',col:0,fill:true,nDoors:1,shelves:2}].concat(Array.from({length:n-1},(_,k)=>({kind:'doors',col:k+1,fill:true,nDoors:1,hingeSide:'left',shelves:4,shelfAdj:false}))),
];
const backsets=[['none','none','none'],['hdf','hdf','hdf'],['solid','solid','solid'],['solid','hdf','none'],['hdf','solid','hdf'],['none','solid','solid']];
const dims=[[900,720,560],[1200,720,560],[800,720,330],[1200,2100,600]];
const railsets=[{front:'h',back:'h'},{front:'v',back:'v'},{front:'h',back:'hv',bottom:true}];
let seed=11; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;}; let pts=0;
for(const cols of [2,3]) for(const [W,H,D] of dims) for(const ss of secsets) for(const backs of backsets) for(const mount of ['top','inside']) for(const top of ['rails','full'])
for(const rails of (top==='rails'?railsets:[railsets[0]])) for(const jt of [0,1,2,3]){
  const colW = jt===1 ? null : Array.from({length:cols},(_,k)=>k===0?W*0.45:W*0.55/(cols-1));
  const joints={}; ['bottom','top','shelf','back','oven','railF','railB','railVH','railBotB'].concat([1,2].flatMap(n=>['partB','partT','partF','partR','backP'].map(b=>b+n))).forEach((k,i)=>{
    joints[k]={type:T3[(jt+i)%3]};
    if(jt===3){ const L=/^part[FR]|^rail[FB]$/.test(k)?100:/^rail(VH|BotB)$/.test(k)?W:/^backP/.test(k)?H:D, n=Math.floor(rnd()*5); joints[k].pos=Array.from({length:n},()=>Math.round(rnd()*L)); } });   // jt 3: hand-placed, random
  const c={name:'T',W,H,D,thick:18,cols,colW,cnc:{joinery:'confirmat',back:'none',backs:backs.slice(0,cols),backMount:mount,joints,top,rails,legs:true,hinges:true,pins:'row',runnerMarks:true,topOverFacade:top==='full'},sections:secsets.indexOf(ss)>=0?ss(cols):[]};
  const r=E.buildCabinet(c,0,'P');
  if(r.warnings.some(w=>/didesnė už fasadų zoną|per siaura/.test(w))) continue; cabs++;
  const ps=r.panels, flagged=r.warnings.some(w=>/persidengia|susitinka/.test(w));
  parts+=ps.length;
  ps.forEach(p=>{ if(!(p.L>0&&p.W>0&&p.T>0)) B('BAD SIZE '+p.name); });
  // edge bores ↔ face holes
  const faceHoles=[]; ps.forEach(p=>p.holes.forEach(h=>{ if(h.mark||h.op||h.d===15||/FASADAS|DURYS/.test(p.role)) return;
     const n=p.place.n; (h.through?['A','B']:[h.face]).forEach(f=>faceHoles.push({p,h,pt:f==='A'?P(p,h.x,h.y,0):P(p,h.x,h.y,p.T),n:f==='A'?n:n.map(v=>-v),used:false})); }));
  ps.forEach(p=>p.edges.forEach(e=>{ nb++; let a,b,out; const u=p.place.u,v=p.place.v;
    if(e.edge==='x0'){a=0;b=e.pos;out=u.map(x=>-x);} else if(e.edge==='x1'){a=p.L;b=e.pos;out=u;} else if(e.edge==='y0'){a=e.pos;b=0;out=v.map(x=>-x);} else {a=e.pos;b=p.W;out=v;}
    const pt=P(p,a,b,p.T/2); const m=faceHoles.find(f=>f.p!==p&&dist(f.pt,pt)<0.6&&f.n.every((x,i)=>Math.abs(x+out[i])<1e-6));
    if(!m) B('EDGE BORE MEETS NOTHING '+p.name+' '+JSON.stringify(e)+' cols'+cols+' '+JSON.stringify(backs)+' '+mount+' '+top+' '+JSON.stringify(rails)+' '+W+'x'+H+' jt'+jt);
    else { m.used=true; if(m.h.d!==e.d && !(m.h.through && e.d===5)) B('SIZE MISMATCH '+p.name+' '+e.d+'/'+m.h.d); } }));
  faceHoles.filter(f=>!f.used && !(f.h.through && faceHoles.some(g=>g!==f&&g.h===f.h&&g.used))).forEach(f=>B('FACE HOLE WITHOUT EDGE BORE '+f.p.name+' '+JSON.stringify(f.h)+' cols'+cols+' '+top+' '+JSON.stringify(rails)+' jt'+jt));
  // every connector the 3D editor draws on a seam is drilled
  const spots=[]; ps.forEach(sp=>{ sp.edges.forEach(e=>{ let a,b; if(e.edge==='x0'){a=0;b=e.pos;} else if(e.edge==='x1'){a=sp.L;b=e.pos;} else if(e.edge==='y0'){a=e.pos;b=0;} else {a=e.pos;b=sp.W;} spots.push(P(sp,a,b,sp.T/2)); });
    sp.holes.forEach(h=>{ if(!h.mark&&!h.op) spots.push(P(sp,h.x,h.y,0),P(sp,h.x,h.y,sp.T)); }); });
  const skipped=r.warnings.some(w=>/už pertvaros ribų/.test(w));
  r.seams.forEach(sm=>{ const j0=r.joints.find(x=>x.key===sm.key); if(!j0){B('SEAM WITHOUT JOINT '+sm.key);return;} const j=sm.at||(j0.sides?j0.sides[sm.side]:j0);
    j.pos.concat(j.dowels||[]).forEach(a=>{ pts++; const q=sm.o.map((v,i)=>v+a*sm.d[i]); if(!spots.some(s=>dist(s,q)<0.6) && !(skipped&&/^part[FR]/.test(sm.key))) B('SEAM POINT NOT DRILLED '+sm.key+' a='+a+' cols'+cols+' '+top+' '+JSON.stringify(rails)+' jt'+jt+' '+W+'x'+H+' ss'+secsets.indexOf(ss)+' '+JSON.stringify(backs)+mount+' '+sm.side+JSON.stringify(sm.o)); }); });
  ['partB1','partT1','partF1','partR1','railVH','railBotB','backP1'].forEach(k=>{ if(r.joints.some(x=>x.key===k) && !r.seams.some(x=>x.key===k)) B('JOINT WITHOUT SEAM '+k); });
  // parts do not take the same space
  const box=p=>{const pts=[];for(const a of [0,p.L])for(const b of [0,p.W])for(const cc of [0,p.T])pts.push(P(p,a,b,cc));return [0,1,2].map(i=>[Math.min(...pts.map(q=>q[i])),Math.max(...pts.map(q=>q[i]))]);};
  const bx=ps.map(box);
  for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){ const vol=bx[i].reduce((a,ri,k)=>a*Math.max(0,Math.min(ri[1],bx[j][k][1])-Math.max(ri[0],bx[j][k][0])),1);
    if(vol>1e-3) B('OVERLAP '+ps[i].name+' '+ps[j].name+' cols'+cols+' '+JSON.stringify(backs)+' '+mount+' '+top+' '+JSON.stringify(rails)+' '+W+'x'+H); }
  // everything inside the cabinet box (fronts may sit in front of it)
  bx.forEach((b,i)=>{ if(b[0][0]<-0.01||b[0][1]>W+0.01||b[2][0]<-0.01||b[2][1]>H+0.01||b[1][1]>D+0.01) B('OUTSIDE '+ps[i].name+' '+JSON.stringify(b)); });
  // touching holes on a face
  ps.forEach(p=>p.holes.forEach((h,i)=>p.holes.forEach((g,k)=>{ if(k<=i||g.mark||h.mark) return; if(!(g.face===h.face||g.through||h.through)) return;
    if(Math.hypot(g.x-h.x,g.y-h.y)<(g.d+h.d)/2+0.5 && !flagged) B('TOUCH '+p.name+' '+JSON.stringify(h)+' '+JSON.stringify(g)); })));
  // partitions present and counted right
  const np=ps.filter(p=>p.role==='PERTVARA').length; if(np!==cols-1) B('PARTITIONS '+np+' for cols '+cols);
}
console.log(`${cabs} cabinets with partitions, ${parts} parts, ${nb} edge bores, ${pts} seam points checked, ${bad} problems`);
if(bad) console.log(K);
process.exit(bad?1:0);

