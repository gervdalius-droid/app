// LED grooves must not open into a hole: random cabinets with LED grooves in the bottom, top or sides;
// after the engine moved a groove, no connector bore, cam, hinge-plate or runner hole / mark may reach it
// (2 mm wall), unless the engine warned that there was no room.  node led_check.js [engine.js] [seed] [n]
const E=require(process.argv[2]||'../src/engine.js');
let seed=+(process.argv[3]||3); const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647, pick=a=>a[Math.floor(rnd()*a.length)];
const N=+(process.argv[4]||2000); let bad=0, moved=0, noRoom=0, n=0;
for(let i=0;i<N;i++){
  const type=pick(['PASTATOMOS','PAKABINAMOS']), hung=type==='PAKABINAMOS';
  const c=E.newCabinet(); Object.assign(c,{type,W:pick([300,400,600,800,900]),H:hung?pick([720,780,900]):pick([720,780]),D:hung?pick([300,330,350]):pick([560,580]),thick:pick([18,16])});
  c.cnc=Object.assign(E.cncDefaults(c),{joinery:pick(['cam','confirmat']),bottom:pick(['under','inside']),top:pick(['full','rails']),legs:!hung,camOut:{bottom:rnd()<0.5,top:rnd()<0.5}});
  c.mat={carc:'K',facade:'F'}; c.edge={carc:'E'};
  c.sections=[Object.assign(E.newSection(pick(['doors','drawers','open'])),{fill:true,nDoors:pick([1,2]),shelves:pick([0,1,2]),nDrawers:pick([2,3]),hw:pick(['BLUM TANDEMBOX','BLUM MERIVOBOX','GTV KULKINIAI H45'])})];
  c.leds=[{at:pick(['bottom','top','L','R']),side:pick(['in','out']),from:pick([20,30,37,50,60]),w:16,depth:8,ends:pick(['open','closed'])}];
  const r=E.buildCabinet(c,0,'T'); n++;
  const w=r.warnings.join(' | '); if(/perkeltas/.test(w)) moved++; if(/perkelti nėra kur/.test(w)){noRoom++; continue;}
  r.panels.forEach(p=>(p.grooves||[]).filter(g=>g.led).forEach(g=>{
    const T=p.T, z0=g.face==='A'?T-g.depth:0, z1=g.face==='A'?T:g.depth, m=1.9, hit=(x0,x1,y0,y1,a,b)=>x1>g.x0-m&&x0<g.x1+m&&y1>g.y0-m&&y0<g.y1+m&&b>z0-m&&a<z1+m;
    p.holes.forEach(h=>{const r2=h.d/2,a=h.through?0:h.face==='A'?T-h.depth:0,b=h.through?T:h.face==='A'?T:h.depth; if(hit(h.x-r2,h.x+r2,h.y-r2,h.y+r2,a,b)){bad++; if(bad<6)console.log('HOLE IN GROOVE',p.role,JSON.stringify(h),JSON.stringify(g));}});
    (p.edges||[]).forEach(e=>{const r2=e.d/2,zc=T/2,d=e.depth,bx=e.edge==='x0'?[0,d,e.pos-r2,e.pos+r2]:e.edge==='x1'?[p.L-d,p.L,e.pos-r2,e.pos+r2]:e.edge==='y0'?[e.pos-r2,e.pos+r2,0,d]:[e.pos-r2,e.pos+r2,p.W-d,p.W];
      if(hit(bx[0],bx[1],bx[2],bx[3],zc-r2,zc+r2)){bad++; if(bad<6)console.log('BORE IN GROOVE',p.role,JSON.stringify(e),JSON.stringify(g));}});
  }));
}
console.log(`${n} cabinets with an LED groove, ${moved} grooves moved off holes, ${noRoom} without room (warned), ${bad} problems`);
process.exit(bad?1:0);
