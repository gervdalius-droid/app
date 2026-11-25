// More legs: every layout gives the right number of legs, each drilled as 4 marks on the bottom's underside exactly where it is drawn,
// inside the bottom, and no leg plate (Ø60) over a connector head on the underside unless the worker is warned.
const E=require('../src/engine.js');
const P=(p,a,b)=>{const q=p.place;return [0,1].map(i=>q.o[i]+a*q.u[i]+b*q.v[i]);};   // world x, y of a point on the bottom
let bad=0,cabs=0,legsN=0; const B=m=>{bad++; if(bad<12) console.log(m);};
const T3=['confirmat','cam','dowel'];
for(const cols of [1,2,3]) for(const W of [400,600,900,1200,1800]) for(const lx of [undefined,2,3,4,5,6,'parts']) for(const ly of [2,3]) for(const jt of T3) for(const D of [330,560]){
  if(cols>1 && W<600) continue;
  const c={name:'T',W,H:720,D,thick:18,cols,colW:null,legH:100,cnc:{joinery:jt,back:'none',backs:Array(cols).fill('none'),backMount:'top',joints:{},top:'rails',rails:{front:'h',back:'h'},legs:true,legsX:lx,legsY:ly,pins:'off'},
    sections:Array.from({length:cols},(_,k)=>({kind:'open',col:k,fill:true,shelves:1,shelfAdj:true}))};
  const r=E.buildCabinet(c,0,'P'); cabs++;
  const nx = lx==='parts' ? cols+1 : (lx||2), want = nx*ly; legsN+=r.legs.length;
  if(r.legs.length!==want) B('COUNT '+r.legs.length+' want '+want+' '+JSON.stringify({cols,W,lx,ly}));
  const bot=r.panels.find(p=>p.role==='DUGNAS'), marks=bot.holes.filter(h=>h.mark&&h.face==='B').map(h=>{const w=P(bot,h.x,h.y);return {x:w[0],y:w[1]};}), BW=r.dims.W, BD=Math.max(bot.L,bot.W)===BW?Math.min(bot.L,bot.W):Math.max(bot.L,bot.W);
  if(marks.length!==4*want) B('MARKS '+marks.length+' want '+4*want);
  const warned=r.warnings.some(w=>/kojelė .*uždengia/.test(w));
  r.legs.forEach(l=>{
    const m=marks.filter(h=>Math.abs(Math.abs(h.x-l.x)-14.85)<0.01&&Math.abs(Math.abs(h.y-l.y)-14.85)<0.01); if(m.length!==4) B('LEG NOT DRILLED '+JSON.stringify(l)+' '+JSON.stringify({cols,W,lx,ly,jt,D,bw:bot.W,bl:bot.L}));
    const bd=(bot.L===BW?bot.W:bot.L); if(l.x<35||l.x>W-35||l.y<30||l.y>bd-30) B('LEG OUTSIDE '+JSON.stringify(l)+' W'+W);
    const heads=bot.holes.filter(h=>!h.mark&&(h.through||h.face==='B')).map(h=>{const w=P(bot,h.x,h.y);return {x:w[0],y:w[1],d:h.d};}); if(!warned && heads.some(h=>Math.hypot(h.x-l.x,h.y-l.y)<30+h.d/2+4)) B('PLATE OVER HEAD '+JSON.stringify(l)+' '+jt+' cols'+cols);
  });
  const key=r.legs.map(l=>l.x.toFixed(1)+','+l.y.toFixed(1)); if(new Set(key).size!==key.length) B('TWO LEGS IN ONE PLACE '+JSON.stringify({cols,W,lx,ly}));
  const hw=r.hardware.find(h=>h.item==='Kojelės'); if(!hw||hw.qty!==want) B('HARDWARE COUNT '+(hw&&hw.qty));
}
console.log(`${cabs} cabinets, ${legsN} legs checked, ${bad} problems`); process.exit(bad?1:0);
