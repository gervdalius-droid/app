// Builds a sample project as the plugin would and writes the workbook entries + programs as JSON.
const E=require('../src/dedes_baldai/ui/engine.js'), X=require('../src/dedes_baldai/ui/export.js');
const tandem={name:'Stalčiai',W:400,H:580,D:438,thick:18,mat:{carc:'LMDP 18 Balta W980',facade:'LMDP 18 Ąžuolas H1180'},edge:{carc:'ABS 0.8 Balta',facade:'ABS 1 Ąžuolas'},legH:100,
  cnc:{joinery:'cam',back:'top',top:'full',legs:true,topOverFacade:true,facadeT:18},sections:[{kind:'drawers',fill:true,nDrawers:4,hw:'BLUM TANDEM',rail:400}]};
const tbox={name:'',W:600,H:800,D:600,thick:18,mat:{carc:'LMDP 18 Balta W980'},edge:{carc:'ABS 0.8 Balta'},
  cnc:{joinery:'confirmat',back:'none',top:'rails',legs:true},sections:[{kind:'drawers',fill:true,nDrawers:3,hw:'BLUM TANDEMBOX',rail:500}]};
const tall={name:'Aukšta',W:600,H:2000,D:580,thick:18,mat:{carc:'LMDP 18 Balta W980',facade:'MDF 19 dažytas'},edge:{carc:'ABS 0.8 Balta'},
  cnc:{joinery:'confirmat',back:'top',top:'full',legs:true,facadeT:19},sections:[{kind:'drawers',fill:false,height:700,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'doors',fill:true,nDoors:2,shelves:3,hinge:'BLUM LANKSTAI'}]};
const col={cabinets:[{nr:1,def:tandem},{nr:2,def:tbox},{nr:3,def:tall,scaled:true}],
  loose:[{name:'Stalviršis',mat:'',L:2400,W:600,T:38,qty:1},{name:'Lentyna_sienai',mat:'LMDP 18 Balta W980',L:800,W:250,T:18,eb:{eb1:'ABS 0.8 Balta'}},{name:'Lentyna_sienai',mat:'LMDP 18 Balta W980',L:800,W:250,T:18,eb:{eb1:'ABS 0.8 Balta'}}]};
const pj=X.buildProject(col,{project:'BANDYMAS',date:'2026-10-08'});
const entries=X.workbookEntries(X.sheets(pj));
require('fs').writeFileSync('sample_entries.json', JSON.stringify(Object.entries(entries)));
console.log('parts',pj.parts.length,'programs',pj.files.length,'warnings',pj.warnings.length);
pj.warnings.slice(0,40).forEach(w=>console.log('  !',w));
console.log(pj.hardware);
