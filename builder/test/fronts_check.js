// Stacked fronts with their own heights (section.frontH, top down; empty = share the rest), drawers and stacked doors:
// front heights come out as typed when they fit, fronts fill the section with the 3 mm gap and never overlap,
// and every drawer's runner marks sit at the same height above its own front's bottom.
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
const box=p=>{const pts=[];for(const a of [0,p.L])for(const b of [0,p.W])for(const c of [0,p.T])pts.push(P(p,a,b,c));return [0,1,2].map(i=>[Math.min(...pts.map(q=>q[i])),Math.max(...pts.map(q=>q[i]))]);};
let bad=0,cabs=0,fr=0; const B=m=>{bad++; if(bad<12) console.log(m);};
let seed=5; const rnd=()=>{seed=(seed*16807)%2147483647; return seed/2147483647;};
for(let it=0;it<3000;it++){
  const n=2+Math.floor(rnd()*4), kind=it%3===2?'doors':'drawers', H=[720,900,2100][it%3===2?2:Math.floor(rnd()*2)];
  const fh={}; for(let q=0;q<n;q++) if(rnd()<0.45) fh[q]=Math.round(80+rnd()*300);
  const sec=kind==='drawers'?{kind,fill:true,nDrawers:n,hw:'BLUM TANDEMBOX',rail:500,frontH:fh}:{kind,fill:true,nDoors:n,doorSplit:'h',hinge:'BLUM LANKSTAI',shelves:0,frontH:fh};
  const c={W:600,H,D:560,thick:18,cnc:{joinery:'confirmat',back:'none',top:'rails',rails:{front:'h',back:'h'},legs:true,hinges:true,pins:'off',runnerMarks:true},sections:[sec]};
  const r=E.buildCabinet(c,0,'P'); cabs++;
  const fronts=r.panels.filter(p=>/FASADAS|DURYS/.test(p.role)).map(p=>{const b=box(p);return {z0:b[2][0],z1:b[2][1]};}).sort((a,b)=>b.z1-a.z1);   // top first
  if(fronts.length!==n){B('COUNT '+fronts.length+'/'+n);continue;} fr+=n;
  const noted=r.warnings.some(w=>/fasadų aukšči|netelpa/.test(w));
  const Hz=H-2, secH=Hz;
  const sum=fronts.reduce((a,f)=>a+(f.z1-f.z0)+3,0); if(Math.abs(sum-secH)>0.05) B('SUM '+sum.toFixed(2)+' vs '+secH);
  for(let q=1;q<n;q++){ const g=fronts[q-1].z0-fronts[q].z1; if(Math.abs(g-3)>0.05) B('GAP '+g.toFixed(2)); }
  if(!noted) for(let q=0;q<n;q++) if(fh[q]>0 && Math.abs((fronts[q].z1-fronts[q].z0)-fh[q])>0.05) B('HEIGHT '+q+' '+(fronts[q].z1-fronts[q].z0).toFixed(1)+' typed '+fh[q]+' '+JSON.stringify(fh));
  if(noted && Object.keys(fh).length<n && fronts.some(f=>Math.abs((f.z1-f.z0)-(fronts[0].z1-fronts[0].z0))>0.05)) B('NOT EQUAL AFTER NOTE');
  if(kind==='drawers'){ const side=r.panels.find(p=>p.role==='KAIRE'), marks=side.holes.filter(h=>h.mark&&h.d===5).map(h=>P(side,h.x,h.y,0)[2]);
    const offs=fronts.map(f=>{ const own=marks.filter(z=>z>=f.z0-25&&z<f.z1+3); return own.length?Math.min(...own)-f.z0:null; });
    if(offs.some(o=>o===null)) B('DRAWER WITHOUT RUNNER MARKS '+JSON.stringify(offs));
    else if(offs.slice(0,-1).some(o=>Math.abs(o-offs[0])>0.05)) B('RUNNER OFFSET DIFFERS '+JSON.stringify(offs)); }
}
console.log(`${cabs} cabinets, ${fr} stacked fronts checked, ${bad} problems`); process.exit(bad?1:0);
