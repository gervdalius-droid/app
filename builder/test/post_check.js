// Programs follow Dalius's SolidWorks → XXL post (step2xxl, same as SWOOD CAM):
//  every marking (drawer runners, hinge plates, legs, front-fixing marks) is  XBO … Z=-2 D=5 N="L" F=1,
//  a cam bolt bore in a part's edge stops at Z=-31.906 (never -34), and no horizontal bore goes deeper (konfirmat pilots too),
//  holes are listed left end (F=3) first, then the top face by X, then the right end (F=2),
//  and every part's machine frame is right-handed (X × Y = the face that is up), so nothing comes out mirrored.
const E=require('../src/engine.js');
let bad=0,progs=0,marks=0,cams=0; const B=m=>{bad++; if(bad<12) console.log(m);};
const xbo=l=>{const m=/ XBO X=([-\d.]+) Y=([-\d.]+) Z=([-\d.]+) D=([\d.]+) N="(\w)" F=(\d)/.exec(l); return m&&{X:+m[1],Y:+m[2],Z:+m[3],D:+m[4],N:m[5],F:+m[6]};};
const sec=[[{kind:'drawers',fill:false,height:300,nDrawers:2,hw:'BLUM TANDEMBOX',rail:500},{kind:'doors',fill:true,nDoors:2,hinge:'BLUM LANKSTAI',shelves:2,shelfAdj:true}],
           [{kind:'drawers',fill:true,nDrawers:3,hw:'BLUM TANDEM',rail:400}],
           [{kind:'doors',fill:true,nDoors:1,hinge:'BLUM LANKSTAI',hingeSide:'left',shelves:3,shelfAdj:false}]];
for(const joinery of ['cam','confirmat']) for(const top of ['rails','full']) for(const back of ['none','top','inside']) for(const cols of [1,2]) for(const ss of sec) for(const tb of ['mark','hole']) for(const hf of ['screw','press']){
  const c={W:cols>1?900:600,H:720,D:560,thick:18,cols,legH:100,cnc:{joinery,back,backs:Array(cols).fill(back==='none'?'none':'solid'),backMount:back==='inside'?'inside':'top',top,rails:{front:'h',back:'hv',bottom:true},legs:true,legsX:cols>1?'parts':3,hinges:true,hingeFix:hf,pins:'shelf',runnerMarks:true,tbFront:tb},
    sections:JSON.parse(JSON.stringify(ss)).map(s=>Object.assign(s,{col:0})).concat(cols>1?[{kind:'doors',col:1,fill:true,nDoors:1,hinge:'BLUM LANKSTAI',shelves:1}]:[])};
  const r=E.buildCabinet(c,0,'P');
  r.panels.forEach(p=>{ const q=p.place, c3=[q.u[1]*q.v[2]-q.u[2]*q.v[1],q.u[2]*q.v[0]-q.u[0]*q.v[2],q.u[0]*q.v[1]-q.u[1]*q.v[0]];
    if(c3[0]*q.n[0]+c3[1]*q.n[1]+c3[2]*q.n[2]<=0) B('MIRRORED MACHINE FRAME (X × Y ≠ up) '+p.name);   // the machine would drill it mirrored
    const pr=E.programs(p);
    const nMarks=p.holes.filter(h=>h.mark).length, nCamEdges=p.edges.filter(e=>e.d===8&&Math.abs(e.depth-31.906)<1e-6).length;
    let gotMarks=0, gotCams=0;
    pr.files.forEach(f=>{ progs++; const L=f.text.split('\r\n').map(xbo).filter(Boolean);
      L.forEach(b=>{
        if(b.F===1&&b.Z===-2){ if(b.D!==5||b.N!=='L') B('MARK NOT AS POST '+p.name+' '+JSON.stringify(b)); else gotMarks++; }
        if(b.F>1&&b.Z<-31.906-1e-6) B('EDGE BORE DEEPER THAN 31.906 '+p.name+' '+JSON.stringify(b));
        if(b.F>1&&b.D===8&&Math.abs(b.Z+31.906)<1e-6) gotCams++;
        if(b.Z===-34) B('Z=-34 '+p.name);
      });
      if(f.kind!=='rot'){ const fs=L.map(b=>b.F), i3=fs.lastIndexOf(3), i2=fs.indexOf(2), iMid=fs.findIndex(x=>x!==3&&x!==2);
        if(i3>=0&&iMid>=0&&i3>iMid) B('F=3 NOT FIRST '+f.file);
        if(i2>=0&&fs.slice(i2).some(x=>x!==2)) B('F=2 NOT LAST '+f.file);
        const mid=L.filter(b=>b.F!==3&&b.F!==2); for(let i=1;i<mid.length;i++) if(mid[i].X<mid[i-1].X-1e-9) { B('NOT BY X '+f.file); break; } }
    });
    if(gotMarks!==nMarks) B('MARKS '+p.name+' '+gotMarks+'/'+nMarks);
    if(gotCams<nCamEdges && !pr.warnings.some(w=>/NEPROGRAMUOTA/.test(w))) B('CAM EDGE BORES '+p.name+' '+gotCams+'/'+nCamEdges);
    marks+=gotMarks; cams+=gotCams;
  });
}
console.log(`${progs} programs, ${marks} markings as Ø5×2 "L", ${cams} cam bolt bores at Z=-31.906, ${bad} problems`); process.exit(bad?1:0);
