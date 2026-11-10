// Every connector bore in an edge must meet a hole in the face it is screwed into (same point in the cabinet),
// every connector hole in a face must meet an edge bore, cam bolts must reach their cam, and nothing overlaps.
// Also sweeps which configurations still leave a hole the machine cannot make.
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
let bad=0, nj=0, cabs=0; const B=m=>{bad++; if(bad<10) console.log(m);};
const cant={}; const note=(k)=>cant[k]=(cant[k]||0)+1;
const secsets=[
 [{kind:'drawers',fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}],
 [{kind:'doors',fill:true,nDoors:2,shelves:2,shelfAdj:false},{kind:'drawers',fill:false,height:180,nDrawers:1,hw:'BLUM TANDEM',rail:450}],
 [{kind:'drawers',fill:false,height:560,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'oven',fill:false,height:595,shelves:2},{kind:'doors',fill:true,nDoors:1,shelves:2}],
 [{kind:'open',fill:true,shelves:2,shelfAdj:false}],
];
const dims=[[600,720,560],[400,720,330],[600,2100,580]];
const railsets=[{front:'h',back:'h'},{front:'v',back:'v'},{front:'h',back:'hv',bottom:true},{front:'none',back:'h'},{front:'h',back:'none',bottom:true}];
const T3=['confirmat','cam','dowel'], keys=['bottom','top','railF','railB','railV','railBottom','back','shelf','oven'];
const jsets=[];  // mixed connectors per joint + custom counts / edge distances
for(let k=0;k<12;k++){ const js={}; keys.forEach((key,i)=>{ js[key]={type:T3[(k+i)%3]}; if(k%3===1) js[key].n=2+((k+i)%3); if(k%4===2) js[key].e=40+10*((k+i)%3); }); jsets.push(js); }
for(const joints of jsets) for(const joinery of ['confirmat']) for(const back of ['none','top','inside']) for(const backFix of ['confirmat']) for(const top of ['rails','full'])
for(const rails of (top==='rails'?railsets:[railsets[0]])) for(const ss of secsets) for(const [W,H,D] of dims){
  if(back!=='top' && backFix==='cam') continue;
  const c={name:'T',W,H,D,thick:18,cnc:{joinery,back,backFix,joints,top,rails,legs:true,hinges:true,pins:'shelf',topOverFacade:top==='full'},sections:JSON.parse(JSON.stringify(ss))};
  const r=E.buildCabinet(c,0,'P'); if(r.warnings.some(w=>/didesnė už fasadų zoną/.test(w))) continue; cabs++;
  const ps=r.panels; const flagged=r.warnings.some(w=>/persidengia/.test(w));
  // face-hole entry points (world) with the outward normal of that face
  const faceHoles=[]; ps.forEach(p=>p.holes.forEach(h=>{ if(h.mark||h.op||h.d===15||/FASADAS|DURYS/.test(p.role)) return;
     const n=p.place.n; const sides=h.through?['A','B']:[h.face];
     sides.forEach(f=>faceHoles.push({p,h,pt:f==='A'?P(p,h.x,h.y,0):P(p,h.x,h.y,p.T), n:f==='A'?n:n.map(v=>-v), used:false})); }));
  ps.forEach(p=>p.edges.forEach(e=>{ nj++;
    let a,b,out; const u=p.place.u, v=p.place.v;
    if(e.edge==='x0'){a=0;b=e.pos;out=u.map(x=>-x);} else if(e.edge==='x1'){a=p.L;b=e.pos;out=u;} else if(e.edge==='y0'){a=e.pos;b=0;out=v.map(x=>-x);} else {a=e.pos;b=p.W;out=v;}
    const pt=P(p,a,b,p.T/2);
    const m=faceHoles.find(f=>f.p!==p && dist(f.pt,pt)<0.6 && f.n.every((x,i)=>Math.abs(x+out[i])<1e-6));
    if(!m){ B('EDGE BORE MEETS NOTHING '+p.name+' '+JSON.stringify(e)+' '+JSON.stringify(c.cnc)+' '+W+'x'+H); return; }
    m.used=true;
    if(m.h.d!==e.d && !(m.h.through && e.d===5)) B('SIZE MISMATCH '+p.name+' edge d'+e.d+' face d'+m.h.d);
    if(e.d===8 && e.depth===34){ // cam bolt: a cam Ø15 on p at depth 34 along the bore axis
      const inward=out.map(x=>-x); const cpt=pt.map((x,i)=>x+34*inward[i]);
      const cam=p.holes.find(h=>h.d===15 && ['A','B'].some(f=>{ const q=f==='A'?P(p,h.x,h.y,0):P(p,h.x,h.y,p.T); const ax=P(p,h.x,h.y,p.T/2); return h.face===f && dist(ax,cpt)<0.6; }));
      if(!cam) B('CAM MISSING for bolt '+p.name+' '+JSON.stringify(e));
    }
  }));
  faceHoles.filter(f=>!f.used && !(f.h.through && faceHoles.some(g=>g!==f && g.h===f.h && g.used))).forEach(f=>B('FACE HOLE WITHOUT EDGE BORE '+f.p.name+' '+JSON.stringify(f.h)+' '+JSON.stringify(c.cnc)+' '+W+'x'+H));
  // holes on one face must not touch
  ps.forEach(p=>p.holes.forEach((h,i)=>p.holes.forEach((g,j)=>{ if(j<=i) return; if(!(g.face===h.face||g.through||h.through)) return;
    if(g.mark||h.mark) return; const lim=(g.d+h.d)/2+0.5; if(Math.hypot(g.x-h.x,g.y-h.y)<lim && !flagged) B('TOUCH '+p.name+' '+JSON.stringify(h)+' '+JSON.stringify(g)+' '+JSON.stringify(c.cnc)+' '+W+'x'+H); })));
  // overlaps between panels
  const box=p=>{const pts=[];for(const a of [0,p.L])for(const b of [0,p.W])for(const cc of [0,p.T])pts.push(P(p,a,b,cc));return [0,1,2].map(i=>[Math.min(...pts.map(q=>q[i])),Math.max(...pts.map(q=>q[i]))]);};
  const bx=ps.map(box);
  for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){ const vol=bx[i].reduce((a,ri,k)=>a*Math.max(0,Math.min(ri[1],bx[j][k][1])-Math.max(ri[0],bx[j][k][0])),1);
    if(vol>1e-3) B('OVERLAP '+ps[i].name+' '+ps[j].name+' '+JSON.stringify(c.cnc)+' '+W+'x'+H); }
  // what the machine still cannot do
  ps.forEach(p=>E.programs(p).warnings.filter(w=>/NEPROGRAMUOTA|netelpa/.test(w)).forEach(w=>note(w.replace(/^[^:]*_([A-Z_]+\d*): /,'$1: ').replace(/[\d.]+/g,'#')+'  ['+joinery+', back '+back+'/'+backFix+']')));
}
console.log(`${cabs} cabinets, ${nj} edge bores checked, ${bad} problems`);
console.log('still not machinable:'); Object.keys(cant).sort().forEach(k=>console.log('  '+cant[k]+'×  '+k));
process.exit(bad?1:0);
