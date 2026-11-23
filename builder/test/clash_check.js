const E=require(process.argv[2]); if(process.argv[3]) E.R.confirmat.fromFront=+process.argv[3];
let seed=5; const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647, pick=a=>a[Math.floor(rnd()*a.length)];
const stat={}; let n=0;
for(let i=0;i<3000;i++){
  const type=pick(['PASTATOMOS','PAKABINAMOS','ŪKINĖ']), hung=type==='PAKABINAMOS';
  const c=E.newCabinet(); Object.assign(c,{type,W:pick([300,400,600,800,900]),H:hung?pick([720,780,900]):type==='ŪKINĖ'?2100:pick([720,780]),D:hung?pick([300,330,350]):pick([560,580]),thick:pick([18,16])});
  c.cnc=Object.assign(E.cncDefaults(c),{joinery:pick(['cam','confirmat']),bottom:pick(['under','inside']),top:pick(['full','rails']),legs:!hung,back:pick(['none','top','groove','inside']),hinges:true,runnerMarks:true});
  c.mat={carc:'K',facade:'F'}; c.edge={carc:'E'};
  c.sections=[Object.assign(E.newSection(pick(['doors','drawers','open'])),{fill:true,nDoors:pick([1,2]),shelves:pick([0,1,2]),shelfAdj:rnd()<0.6,nDrawers:pick([2,3]),hw:pick(['BLUM TANDEMBOX','BLUM MERIVOBOX','GTV KULKINIAI H45','BLUM TANDEM'])})];
  let r; try{r=E.buildCabinet(c,0,'T');}catch(e){continue;} n++;
  r.panels.forEach(p=>{const T=p.T, hs=p.holes.filter(h=>!h.mark);
    const zr=h=>h.through?[0,T]:h.face==='A'?[T-h.depth,T]:[0,h.depth];
    for(let a=0;a<hs.length;a++)for(let b=a+1;b<hs.length;b++){const A=hs[a],B=hs[b],d=Math.hypot(A.x-B.x,A.y-B.y); if(d<0.05)continue; const za=zr(A),zb=zr(B);
      if(d<(A.d+B.d)/2+1&&za[1]>zb[0]&&zb[1]>za[0]){const k=p.role+' face d'+Math.min(A.d,B.d)+'/d'+Math.max(A.d,B.d); stat[k]=(stat[k]||0)+1;}}
    (p.edges||[]).forEach(e=>{const r2=e.d/2,zc=T/2; hs.forEach(h=>{const z=zr(h); if(!(z[1]>zc-r2-1&&z[0]<zc+r2+1))return; const hr=h.d/2+1;
      const bx=e.edge==='x0'?[0,e.depth,e.pos-r2,e.pos+r2]:e.edge==='x1'?[p.L-e.depth,p.L,e.pos-r2,e.pos+r2]:e.edge==='y0'?[e.pos-r2,e.pos+r2,0,e.depth]:[e.pos-r2,e.pos+r2,p.W-e.depth,p.W];
      if(h.x+hr>bx[0]&&h.x-hr<bx[1]&&h.y+hr>bx[2]&&h.y-hr<bx[3]){ // own cam/bolt pairs meet on purpose: same line
        if(Math.abs((e.edge[0]==='x'?h.y:h.x)-e.pos)<0.6) return; const k=p.role+' edge-bore vs d'+h.d; stat[k]=(stat[k]||0)+1;}});});
  });
}
console.log(n, stat);
