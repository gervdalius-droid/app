// Pėdutės: Ø15 buttons under the sides (and partitions, if chosen), one Ø8 × 10 hole each, rows 50 mm from the front and the back
// (+ a middle row). Bottom under the sides: holes in the bottom underside below the sides; bottom between the sides:
// holes in the sides' bottom edges. Every foot has its hole, in the program, clear of the joint holes.
const E=require(process.argv[2]||'../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-(c||0)*q.n[i]);};
let bad=0,n=0; const B=m=>{bad++; if(bad<10) console.log(m);};
for(const W of [400,600,900,1200]) for(const D of [330,560]) for(const ly of [2,3]) for(const lx of ['2','parts']) for(const [bot,hbz] of [['under',0],['inside',0],['inside',60]]) for(const cols of [1,2]) for(const jn of ['confirmat','cam','dowel']){
  if(cols>1&&W<600) continue;
  const c={W,H:720,D,thick:18,cols,cnc:{bottom:bot,bottomZ:hbz,joinery:jn,back:'none',top:'rails',rails:{front:'h',back:'h'},legs:true,feet:true,legsX:lx,legsY:ly},sections:Array.from({length:cols},(_,k)=>({kind:'open',col:k,fill:true,shelves:0}))};
  const r=E.buildCabinet(c,0,'P'), bo=r.panels.find(p=>p.role==='DUGNAS');
  const nPart=(lx==='parts'&&(bot==='under'||hbz===0))?cols-1:0, want=(2+nPart)*ly;
  if(r.legs.length!==want) B('COUNT '+r.legs.length+' want '+want+' '+JSON.stringify({W,D,ly,lx,bot,hbz,cols}));
  // every foot: a Ø8 × 10 hole straight above it
  r.legs.forEach(l=>{ n++; if(!l.feet||l.d!==15||l.h!==10) B('FOOT '+JSON.stringify(l));
    let ok=false;
    r.panels.forEach(p=>{ p.holes.forEach(h=>{ if(h.op!=='feet') return; const w=P(p,h.x,h.y,p.T); if(Math.hypot(w[0]-l.x,w[1]-l.y)<0.01&&Math.abs(w[2]-(r.visual.hb||0))<0.01&&h.d===8&&h.depth===10) ok=true; });
      p.edges.forEach(e=>{ if(!e.foot) return; const a=e.edge==='x0'?0:e.edge==='x1'?p.L:e.pos, b2=e.edge==='y0'?0:e.edge==='y1'?p.W:e.pos, w=P(p,a,b2,p.T/2); if(Math.hypot(w[0]-l.x,w[1]-l.y)<0.01&&Math.abs(w[2])<0.01&&e.d===8&&e.depth===10) ok=true; }); });
    if(!ok) B('FOOT WITHOUT HOLE '+JSON.stringify(l)+' '+JSON.stringify({bot,hbz,jn}));
    if(Math.abs(l.x-9)>0.01&&Math.abs(l.x-(W-9))>0.01&&!(cols>1&&lx==='parts')) B('NOT UNDER A SIDE '+l.x);
  });
  const ys=[...new Set(r.legs.map(l=>Math.round(l.y)))].sort((a,b)=>a-b); if(ys[0]>50+24.01||ys[ys.length-1]<D-50-24.01) B('ROWS '+ys+' D'+D);   // a foot may move up to 24 mm to clear a joint hole
  const hw=r.hardware.find(h=>/Pėdutės/.test(h.item)); if(!hw||hw.qty!==want) B('HARDWARE');
  // nothing meets: foot holes vs joint holes
  if(r.warnings.some(w=>/pėdutės skylė kliūna/.test(w))) B('CLASH '+JSON.stringify({W,D,ly,lx,bot,hbz,cols,jn}));
  const xxl=r.panels.map(p=>E.programs(p).files.map(f=>f.text).join('\n')).join('\n'); if((xxl.match(/Z=-10 D=8 N="P" F=[13]/g)||[]).length<want) B('NOT IN PROGRAMS '+(xxl.match(/Z=-10 D=8 N="P" F=[13]/g)||[]).length+'/'+want);
}
console.log(`${n} feet checked, ${bad} problems`); process.exit(bad?1:0);
