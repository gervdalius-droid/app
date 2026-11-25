// 3D construction (c.kind 'box'): random boards on/off, set-in boards, who-covers-whom, partitions and shelves,
// every connector type, counts, edge distances and hand-placed connectors. Checks:
//  no two parts take the same space; everything inside the outer box; corners filled exactly once (or warned);
//  every edge bore meets a face hole of another part (same point, facing it, right size) and every face connector
//  hole meets an edge bore; every cam sits on its bolt; every seam point the 3D editor draws is drilled;
//  holes stay inside their part and do not run into each other unless warned; programs come out without "NEPROGRAMUOTA"
//  except for parts too big for the machine.
// usage: node test/box_check.js [engine.js]
const E=require(process.argv[2]||'../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const dist=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1],a[2]-b[2]);
const K={}; let bad=0,cabs=0,nb=0,parts=0,pts=0,warned=0; const B=m=>{bad++; if(bad<15) console.log(m); const k=m.split(' ').slice(0,3).join(' '); K[k]=(K[k]||0)+1;};
let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;}; const pick=a=>a[Math.floor(rnd()*a.length)];
const IDS=E.BOX_IDS, T3=['confirmat','cam','dowel'];
for(let run=0;run<6000;run++){
  const W=pick([300,450,600,900,1200]),H=pick([300,720,900,2100]),D=pick([330,560,600]),t=pick([18,18,18,16,25]);
  const boards={}; IDS.forEach(id=>{ boards[id]={on:rnd()<(id==='front'?0.3:0.85),inset:rnd()<0.15?pick([20,50,100]):0,T:rnd()<0.1?pick([8,12,22]):''}; });
  const cover={}; IDS.forEach((a,i)=>IDS.forEach((b,k)=>{ if(k>i && rnd()<0.5) cover[E.boxPair(a,b)]=pick([a,b]); }));
  const inner=[]; let id=1; const np=Math.floor(rnd()*3);
  for(let k=0;k<np;k++) inner.push({id:id++,kind:'part',x:Math.round(W*(k+1)/(np+1)+(rnd()-0.5)*60)});
  const ns=Math.floor(rnd()*4); for(let k=0;k<ns;k++) inner.push({id:id++,kind:'shelf',z:Math.round(80+rnd()*(H-200)),col:Math.floor(rnd()*(np+1)),adj:rnd()<0.5});
  const jt=Math.floor(rnd()*4), joints={};
  const c={kind:'box',name:'B',W,H,D,thick:t,cnc:{joinery:pick(['confirmat','cam']),joints},box:{boards,cover,inner,pinRow:rnd()<0.3},mat:{carc:'M'},edge:{carc:'E'}};
  // pass 1 to learn the joints, then give them random settings
  let r=E.buildCabinet(JSON.parse(JSON.stringify(c)),0,'P');
  r.joints.forEach(j=>{ if(jt===0) return; const o={type:pick(T3)}; if(jt===2){ if(rnd()<0.5) o.n=1+Math.floor(rnd()*5); if(rnd()<0.5) o.e=Math.round(10+rnd()*120); }
    if(jt===3) o.pos=Array.from({length:Math.floor(rnd()*5)},()=>Math.round(rnd()*j.w)); joints[j.key]=o; });
  r=E.buildCabinet(c,0,'P'); cabs++;
  const ps=r.panels; parts+=ps.length;
  const flagged=r.warnings.some(w=>/kertasi|persidengia|nepavyko/.test(w)); if(flagged) warned++;
  const cornerWarn=r.warnings.some(w=>/^kampas/.test(w));
  ps.forEach(p=>{ if(!(p.L>0&&p.W>0&&p.T>0)) B('BAD SIZE '+p.name+' '+p.L+'x'+p.W); });
  // boxes
  const box=p=>{const q=[];for(const a of [0,p.L])for(const b of [0,p.W])for(const cc of [0,p.T])q.push(P(p,a,b,cc));return [0,1,2].map(i=>[Math.min(...q.map(v=>v[i])),Math.max(...q.map(v=>v[i]))]);};
  const bx=ps.map(box);
  for(let i=0;i<bx.length;i++)for(let j=i+1;j<bx.length;j++){ const vol=bx[i].reduce((a,ri,k)=>a*Math.max(0,Math.min(ri[1],bx[j][k][1])-Math.max(ri[0],bx[j][k][0])),1);
    if(vol>1e-3 && !cornerWarn) B('OVERLAP '+ps[i].name+' '+ps[j].name+' '+JSON.stringify(boards)); }
  bx.forEach((b,i)=>{ if(b[0][0]<-0.01||b[0][1]>W+0.01||b[1][0]<-0.01||b[1][1]>D+0.01||b[2][0]<-0.01||b[2][1]>H+0.01) B('OUTSIDE '+ps[i].name+' '+JSON.stringify(b)); });
  // the T of every part is what was asked
  r.box.boards.forEach(bd=>{ const p=ps.find(q=>q.name===bd.name); if(!p) B('BOARD WITHOUT PART '+bd.id); else if(Math.abs(p.T-bd.T)>1e-6) B('THICKNESS '+bd.id); });
  // face holes (world) and edge bores
  const faceHoles=[]; ps.forEach(p=>p.holes.forEach(h=>{
    if(h.x<-0.01||h.x>p.L+0.01||h.y<-0.01||h.y>p.W+0.01) B('HOLE OUTSIDE PART '+p.name+' '+JSON.stringify(h));
    if(h.mark||h.op||h.d===15) return; const n=p.place.n;
    (h.through?['A','B']:[h.face]).forEach(f=>faceHoles.push({p,h,pt:f==='A'?P(p,h.x,h.y,0):P(p,h.x,h.y,p.T),n:f==='A'?n:n.map(v=>-v),used:false})); }));
  ps.forEach(p=>p.edges.forEach(e=>{ nb++; let a,b,out; const u=p.place.u,v=p.place.v;
    if(e.edge==='x0'){a=0;b=e.pos;out=u.map(x=>-x);} else if(e.edge==='x1'){a=p.L;b=e.pos;out=u;} else if(e.edge==='y0'){a=e.pos;b=0;out=v.map(x=>-x);} else {a=e.pos;b=p.W;out=v;}
    const len=(e.edge[0]==='x')?p.W:p.L; if(e.pos<0||e.pos>len) B('EDGE BORE OFF THE EDGE '+p.name);
    const pt=P(p,a,b,p.T/2); const m=faceHoles.find(f=>f.p!==p&&dist(f.pt,pt)<0.6&&f.n.every((x,i)=>Math.abs(x+out[i])<1e-6));
    if(!m) B('EDGE BORE MEETS NOTHING '+p.name+' '+JSON.stringify(e)+' '+JSON.stringify(boards));
    else { m.used=true; const want=e.d===5?8:e.d; if(m.h.d!==want || (e.d===5)!==!!m.h.through) B('SIZE MISMATCH '+p.name+' '+e.d+'/'+m.h.d); } }));
  faceHoles.filter(f=>!f.used && !(f.h.through && faceHoles.some(g=>g!==f&&g.h===f.h&&g.used))).forEach(f=>B('FACE HOLE WITHOUT EDGE BORE '+f.p.name+' '+JSON.stringify(f.h)));
  // cams sit 34 from an edge on their bolt
  ps.forEach(p=>p.holes.filter(h=>h.d===15&&!h.mark).forEach(h=>{ const ce=E.R.cam.cam.fromEdge;
    const ok=p.edges.some(e=>e.d===8&&Math.abs(e.depth-E.R.cam.bolt.depthEdge)<1e-6&&((e.edge==='x0'&&Math.abs(h.x-ce)<0.01&&Math.abs(h.y-e.pos)<0.01)||(e.edge==='x1'&&Math.abs(h.x-(p.L-ce))<0.01&&Math.abs(h.y-e.pos)<0.01)||(e.edge==='y0'&&Math.abs(h.y-ce)<0.01&&Math.abs(h.x-e.pos)<0.01)||(e.edge==='y1'&&Math.abs(h.y-(p.W-ce))<0.01&&Math.abs(h.x-e.pos)<0.01)));
    if(!ok) B('CAM WITHOUT BOLT '+p.name); }));
  // seam points drilled
  const spots=[]; ps.forEach(sp=>{ sp.edges.forEach(e=>{ let a,b; if(e.edge==='x0'){a=0;b=e.pos;} else if(e.edge==='x1'){a=sp.L;b=e.pos;} else if(e.edge==='y0'){a=e.pos;b=0;} else {a=e.pos;b=sp.W;} spots.push(P(sp,a,b,sp.T/2)); }); });
  r.seams.forEach(sm=>{ const j=r.joints.find(x=>x.key===sm.key); if(!j){B('SEAM WITHOUT JOINT');return;}
    j.pos.concat(j.dowels||[]).forEach(a=>{ pts++; const q=sm.o.map((v,i)=>v+a*sm.d[i]); if(!spots.some(s=>dist(s,q)<0.6)) B('SEAM POINT NOT DRILLED '+sm.key+' a='+a); }); });
  // holes on one face / edge bores do not run into each other unless the engine said so
  ps.forEach(p=>{ p.holes.forEach((h,i)=>p.holes.forEach((g,k)=>{ if(k<=i||g.mark||h.mark) return;
      const same=g.face===h.face||g.through||h.through||(g.depth+h.depth>p.T-0.5);
      if(same&&Math.hypot(g.x-h.x,g.y-h.y)<(g.d+h.d)/2+0.5&&!flagged) B('TOUCH '+p.name+' '+JSON.stringify(h)+' '+JSON.stringify(g)); }));
    p.edges.forEach((e,i)=>p.edges.forEach((f,k)=>{ if(k<=i) return; if(e.edge===f.edge&&Math.abs(e.pos-f.pos)<(e.d+f.d)/2+0.5&&!flagged) B('EDGE TOUCH '+p.name); })); });
  // programs
  ps.forEach(p=>{ const pr=E.programs(p); pr.warnings.forEach(w=>{ if(/NEPROGRAMUOTA/.test(w)&&!/netelpa|pasukti 90/.test(w)) B('PROGRAM '+w); }); });
  // corners: three boards at the outer face, filled once — unless a corner was warned
  if(!cornerWarn){ const bxs=bx; [0,1].forEach(hx=>[0,1].forEach(hy=>[0,1].forEach(hz=>{ const ids=[hx?'right':'left',hy?'back':'front',hz?'top':'bottom'];
    if(!ids.every(id=>boards[id].on&&!boards[id].inset)) return; const ts=ids.map(id=>+boards[id].T>0?+boards[id].T:t);
    const q=[hx?W-ts[0]/2:ts[0]/2,hy?D-ts[1]/2:ts[1]/2,hz?H-ts[2]/2:ts[2]/2]; const n=bxs.filter(b=>b.every((r2,k)=>q[k]>r2[0]&&q[k]<r2[1])).length;
    if(n!==1) B('CORNER '+n+' '+ids.join('-')); }))); }
}
console.log(`${cabs} 3D constructions, ${parts} parts, ${nb} edge bores, ${pts} seam points, ${warned} with a hole-clash warning, ${bad} problems`);
if(bad) console.log(K);
process.exit(bad?1:0);
