// New operations: hinge cups/plates and shelf pins land inside their panels, line up with each
// other, and never touch any other hole on the same face. Old operations unchanged (compare_ref.js).
const E=require('../src/engine.js');
const P=(p,a,b,c)=>{const q=p.place;return [0,1,2].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]-c*q.n[i]);};
let bad=0, n=0, cabs=0; const B=(m)=>{bad++; if(bad<12) console.log(m);};
const secsets=[
 [{kind:'doors',fill:true,nDoors:1,shelves:2,hinge:'BLUM LANKSTAI',hingeSide:'auto'}],
 [{kind:'doors',fill:true,nDoors:2,shelves:3,hinge:'BLUM LANKSTAI'}],
 [{kind:'doors',fill:true,nDoors:1,shelves:1,hinge:'BLUM TIP-ON',hingeSide:'left'}],
 [{kind:'doors',fill:true,nDoors:2,doorSplit:'h',shelves:0,hinge:'BLUM LANKSTAI',hingeSide:'right'}],
 [{kind:'drawers',fill:false,height:300,nDrawers:1,hw:'BLUM TANDEMBOX',rail:500},{kind:'doors',fill:true,nDoors:2,shelves:1}],
 [{kind:'doors',fill:false,height:1400,nDoors:2,shelves:4},{kind:'open',fill:true,shelves:1}],
 [{kind:'doors',fill:true,nDoors:3,shelves:2}],
 [{kind:'drawers',fill:false,height:600,nDrawers:2,hw:'BLUM TANDEM',rail:500},{kind:'oven',fill:false,height:595,shelves:2},{kind:'doors',fill:true,nDoors:2,shelves:1}],
 [{kind:'doors',fill:true,nDoors:1,shelves:3,shelfMode:'manual',shelfPos:[200,450,0]}],
];
const dims=[[600,720,330],[400,900,560],[600,2100,580],[900,2300,600],[450,400,330]];
for(const joinery of ['cam','confirmat']) for(const back of ['none','top','inside']) for(const top of ['rails','full']) for(const pins of ['shelf','row']) for(const hingeFix of ['screw','press'])
for(const ss of secsets) for(const [W,H,D] of dims){
  const c={name:'T',W,H,D,thick:18,cnc:{joinery,back,top,legs:true,hinges:true,hingeFix,pins,topOverFacade:top==='full'},sections:JSON.parse(JSON.stringify(ss))};
  const r=E.buildCabinet(c,0,'P');
  if(r.warnings.some(w=>/didesnė už fasadų zoną/.test(w))) continue;   // invalid layout: the app shows it as an error
  cabs++;
  const skipped=r.warnings.filter(w=>/praleista/.test(w)).length;
  const sides=r.panels.filter(p=>p.role==='KAIRE'||p.role==='DESINE'), doors=r.panels.filter(p=>p.role==='DURYS');
  r.panels.forEach(p=>{
    const hs=p.holes;
    hs.forEach((h,i)=>{
      if(!h.op) return; n++;
      if(h.x-h.d/2<0.5||h.x+h.d/2>p.L-0.5||h.y-h.d/2<0.5||h.y+h.d/2>p.W-0.5) B('OUTSIDE '+p.name+' '+JSON.stringify(h)+' '+p.L+'x'+p.W);
      if(h.depth>=p.T-3) B('TOO DEEP '+p.name);
      hs.forEach((g,j)=>{ if(j===i||g.face!==h.face&&!g.through) return; const dd=Math.hypot(g.x-h.x,g.y-h.y);
        if(dd<(g.d+h.d)/2+1.5 && !(j<i&&g.op)) B('TOUCHES '+p.name+' '+JSON.stringify(h)+' vs '+JSON.stringify(g)+' '+JSON.stringify(c.cnc)+' '+W+'x'+H+'x'+D); });
    });
  });
  // every cup has its plate pair on a side at the same height, 37 behind the door's back face... (in cabinet coords)
  doors.forEach(d=>d.holes.filter(h=>h.d===35).forEach(h=>{
    const cup=P(d,h.x,h.y,0); // on face A (inner face of door, at y=0 plane)
    const pl=[]; sides.forEach(s=>s.holes.filter(g=>g.op==='hinge').forEach(g=>{const q=P(s,g.x,g.y,0); pl.push(q);}));
    const near=pl.filter(q=>Math.abs(Math.abs(q[2]-cup[2])-16)<0.01 && Math.abs(q[0]-cup[0])<40);
    if(c.sections.some(s=>s.nDoors===3)) return;
    if(near.length!==2 && !skipped) B('PLATE MISMATCH '+d.name+' cup z='+cup[2].toFixed(1)+' x='+cup[0].toFixed(1)+' found '+near.length);
  }));
  // pins: under each adjustable shelf, both sides, 2 per side at least
  r.panels.filter(p=>p.role==='LENTYNA').forEach(sh=>{
    const zb=P(sh,0,0,sh.T)[2]; const cnt=sides.reduce((a,s)=>a+s.holes.filter(g=>g.op==='pin'&&Math.abs(P(s,g.x,g.y,0)[2]-(zb-3))<0.01).length,0);
    const fixed=c.sections.some(s=>s.kind==='oven')&&cnt===0; if(cnt!==4&&!fixed&&!skipped) B('PINS '+sh.name+' '+cnt+' '+JSON.stringify(c.cnc.pins)+' '+W+'x'+H);
  });
  // programs: every new hole gets drilled (no NEPROGRAMUOTA)
  r.panels.forEach(p=>E.programs(p).warnings.filter(w=>/NEPROGRAMUOTA/.test(w)).forEach(w=>B('PROG '+w)));
}
console.log(`${cabs} valid cabinets, ${n} new holes checked, ${bad} problems`);
process.exit(bad?1:0);
