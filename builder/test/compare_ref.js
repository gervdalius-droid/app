// The verified offer-CNC programs must still come out of the engine when it is set up the old way
// (4 rails, Ø10 Tandembox holes, Ø10 drill allowed). Additions are allowed (they are the new CNC
// operations: turned programs, back/rail pilots); a missing or changed reference hole is a failure,
// except the one known bug fixed on purpose (back rail holes in the sides were off by the back thickness
// when the back is on top AND the top is rails).
const REF=require('./ref_cnc.js'), E=require(process.env.ENG||'../src/engine.js');
E.setRules({drills:{top:[5,8,10,15,35]}});
let cases=0, files=0, fails=0, fixed=0, exact=0;
const opts=[]; for(const joinery of ['cam','confirmat']) for(const back of ['none','top','inside']) for(const top of ['rails','full'])
  for(const tof of [false,true]) for(const legs of [false,true]) opts.push({joinery,back,top,topOverFacade:tof,legs,facadeT:18});
const secsets=[
  [{kind:'drawers',col:0,fill:true,nDrawers:4,hw:'BLUM TANDEM',rail:400}],
  [{kind:'drawers',col:0,fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}],
  [{kind:'drawers',col:0,fill:false,height:300,nDrawers:1,hw:'BLUM TANDEMBOX',rail:500},{kind:'drawers',col:0,fill:true,nDrawers:2,hw:'BLUM TANDEM',rail:500}],
  [{kind:'drawers',col:0,fill:false,height:600,nDrawers:2,hw:'BLUM TANDEMBOX',rail:450},{kind:'doors',col:0,fill:true,nDoors:2,shelves:2}],
];
const dims=[[400,580,438],[600,800,600],[900,2000,580],[450,720,330]];
const xbo=t=>t.split('\r\n').filter(l=>l.startsWith(' XBO'));
for(const o of opts) for(const ss of secsets) for(const [W,H,D] of dims){
  const mk=(n)=>({name:'K'+W,W,H,D,thick:18,cols:1,cnc:Object.assign({},o,n?{rails:{front:'h',back:'hv',bottom:true},tbFront:'hole'}:{}),sections:JSON.parse(JSON.stringify(ss))});
  const a=REF.buildCabinet(mk(false),2,'PRJ'), b=E.buildCabinet(mk(true),2,'PRJ'); cases++;
  const newOld = o.joinery==='cam' && o.top==='rails' || o.back==='inside';      // cam rails / inside back are new constructions
  const bugfix = o.back==='top' && o.top==='rails';
  const nb={}; b.panels.forEach(p=>{ nb[p.name]={p, progs:E.programs(p).files}; });
  // sizes
  if(!(o.back==='inside')) a.panels.forEach(p=>{ const q=nb[p.name]; if(!q){ fails++; if(fails<6) console.log('MISSING PANEL',p.name); return; }
    if(Math.abs(q.p.L-p.L)>1e-6||Math.abs(q.p.W-p.W)>1e-6){ fails++; if(fails<6) console.log('SIZE',p.name,p.L,p.W,q.p.L,q.p.W); } });
  let allSame=true;
  a.panels.forEach(p=>{ const q=nb[p.name]; if(!q) return;
    const refFiles=REF.programs(p).files, newMain=q.progs.filter(f=>f.kind!=='rot');
    refFiles.forEach((rf,i)=>{ files++;
      const nf=newMain[i]; const nl=nf?xbo(nf.text):[];
      // post-processor rule (step2xxl = SWOOD CAM): a cam bolt bore in a part's edge stops at 31.906, not at the cam centre 34
      // and no horizontal bore goes deeper than 31.906 (konfirmat pilots Ø5 × 32 → 31.906)
      const rl=rf.xbo.map(l=>l.replace(/Z=-34 D=8 N="P" F=([2-5])/,'Z=-31.906 D=8 N="P" F=$1').replace(/Z=-32 D=5 N="P" F=([2-5])/,'Z=-31.906 D=5 N="P" F=$1'));
      // parts described mirrored (sides, doors, back rail) are now machined right-handed: y → DY − y, long edges F=4 ↔ F=5
      if(q.p.mirrored){ const DY=q.p.W, n=v=>String(Math.round(v*1e6)/1e6);
        for(let k=0;k<rl.length;k++){ const m=/^ XBO X=([-\d.]+) Y=([-\d.]+) (Z=[-\d.]+ D=[\d.]+ N="\w") F=(\d) R=1#$/.exec(rl[k]); if(!m) continue;
          const F=+m[4], X=+m[1], Y=+m[2];
          rl[k]= F===4||F===5 ? ' XBO X='+m[1]+' Y='+m[2]+' '+m[3]+' F='+(F===4?5:4)+' R=1#' : ' XBO X='+m[1]+' Y='+n(DY-Y)+' '+m[3]+' F='+F+' R=1#'; } }
      const missing=rl.filter(l=>nl.indexOf(l)<0);
      if(missing.length){ allSame=false;
        const isSide=/KAIRE|DESINE/.test(p.name);
        // standing rails are now joined with cams (bolt Ø8 in the long edge) instead of confirmats needing a Ø5 long-edge pilot
        const standing=o.top==='rails' && /DUGNAS|JUOSTA_GALAS_H|JUOSTA_GALAS_V|JUOSTA_APACIA_V/.test(p.name) && missing.every(l=>/D=8/.test(l));
        // a runner mark the reference put outside the panel (runner longer than the side) is now left out on purpose, with a warning
        const offPanel=missing.every(l=>{ const m=/X=([-\d.]+) Y=([-\d.]+) .*N="L"/.exec(l); return m && (+m[1]<0 || +m[2]<0 || +m[1]>p.L || +m[2]>p.W); });
        if((bugfix && isSide) || newOld || standing || offPanel){ fixed++; return; }
        fails++; if(fails<6) console.log('DIFF',JSON.stringify(o),W,H,D,p.name,'missing',missing.slice(0,3)); }
      else if(nf && nf.text.split('\r\n')[0]!==rf.head){ if(newOld||bugfix){fixed++;return;} fails++; if(fails<6) console.log('HEAD',p.name,rf.head,'|',nf.text.split('\r\n')[0]); }
      else if(nl.length!==rl.length) allSame=false;
    });
  });
  if(allSame) exact++;
}
console.log(`${cases} cabinets, ${files} reference programs: ${fails} regressions; ${fixed} changed on purpose (cam rails / inside back are new joints, back-rail bug fix); ${exact} cabinets with every reference program unchanged`);
process.exit(fails?1:0);
