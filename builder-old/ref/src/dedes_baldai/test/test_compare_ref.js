// Proves the plugin engine writes exactly the programs of the verified offer CNC engine.
const REF=require('./ref_cnc.js'), E=require('../ui/engine.js');
let cases=0, fails=0, files=0;
const opts=[]; for(const joinery of ['cam','confirmat']) for(const back of ['none','top','inside']) for(const top of ['rails','full'])
  for(const tof of [false,true]) for(const legs of [false,true]) opts.push({joinery,back,top,topOverFacade:tof,legs,facadeT:18});
const secsets=[
  [{kind:'drawers',col:0,fill:true,nDrawers:4,hw:'BLUM TANDEM',rail:400}],
  [{kind:'drawers',col:0,fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}],
  [{kind:'drawers',col:0,fill:false,height:300,nDrawers:1,hw:'BLUM TANDEMBOX',rail:500},{kind:'drawers',col:0,fill:true,nDrawers:2,hw:'BLUM TANDEM',rail:500}],
  [{kind:'drawers',col:0,fill:false,height:600,nDrawers:2,hw:'BLUM TANDEMBOX',rail:450},{kind:'doors',col:0,fill:true,nDoors:2,shelves:2}],
];
const dims=[[400,580,438],[600,800,600],[900,2000,580],[450,720,330]];
for(const o of opts) for(const ss of secsets) for(const [W,H,D] of dims){
  const mk=()=>({name:'K'+W,W,H,D,thick:18,cols:1,cnc:Object.assign({},o),sections:JSON.parse(JSON.stringify(ss))});
  const a=REF.buildCabinet(mk(),2,'PRJ'), b=E.buildCabinet(mk(),2,'PRJ');
  const progA={}, progB={};
  a.panels.forEach(p=>REF.programs(p).files.forEach(f=>progA[f.file]=[f.head].concat(f.xbo).join('\n')));
  b.panels.forEach(p=>E.programs(p).files.forEach(f=>{ const L=f.text.split('\r\n'); progB[f.file]=[L[0]].concat(L.filter(l=>l.startsWith(' XBO'))).join('\n'); }));
  cases++;
  const ka=Object.keys(progA).sort().join(), kb=Object.keys(progB).sort().join();
  if(ka!==kb){ fails++; if(fails<4) console.log('FILES DIFFER',JSON.stringify(o),W,H,D,'\n ref:',ka,'\n new:',kb); continue; }
  for(const k in progA){ files++; if(progA[k]!==progB[k]){ fails++; if(fails<4) console.log('DIFF',k,'\n',progA[k],'\n---\n',progB[k]); } }
  // sizes of every ref panel must match
  const sz=x=>x.panels.map(p=>p.name+':'+p.L+'x'+p.W+'x'+p.T);
  const sb=new Set(sz(b)); sz(a).forEach(s=>{ if(!sb.has(s)){ fails++; if(fails<4) console.log('SIZE',s); } });
}
console.log(`${cases} cabinets, ${files} programs compared, ${fails} differences`);
process.exit(fails?1:0);
