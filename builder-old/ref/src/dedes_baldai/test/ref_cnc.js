// Reference: offer app cnc-module.js v0.1 engine (as delivered 1 Oct 2026, incl. final patches) — used only to prove the port is identical.
"use strict";
const R = {
  cam:   { cam:{d:15, depth:15, fromEdge:34, fromFront:50}, bolt:{d:8, depthFace:15}, dowel:{d:8, depthEdge:27, depthFace:12, offset:32}, backFix:{d:8, fromEdge:50} },
  confirmat: { d:8, pilot:{d:5, depth:32}, fromFront:70, railFromEdge:[30,70], railAlong:50 },
  rail: 100,
  legs: { fromSide:55, fromFront:95, fromBack:55, markD:5, markDepth:2, markOff:14.85 },
  runner: {
    "BLUM TANDEM":    { marks:[37,165,229],          up:37, facade:null },
    "BLUM TANDEMBOX": { marks:[19,28,37,261,293,453], up:33, facade:{d:10, depth:12, fromSide:32, ys:[65.5,97.5], yGallery:225.5} },
  },
  facade: { sideGap:3, gap:3, zoneGapRails:2 },
  through_extra: 6.559,
  drills: { top:[5,8,10,15,35], through:[5,8], xEnds:[5,8], yEdges:[8], edgeMax:35 },
};
function panel(name, role, L, W, T, note){ return {name, role, L, W, T, note:note||"", holes:[], edges:[], warnings:[]}; }
function hole(p, face, x, y, d, depth, opts){ p.holes.push(Object.assign({face,x,y,d,depth:depth||0}, opts||{})); }
function edge(p, e, pos, d, depth){ p.edges.push({edge:e, pos, d, depth}); }
function legMarks(p, face, cx, cy){ const o=R.legs.markOff; [[-o,-o],[-o,o],[o,-o],[o,o]].forEach(([a,b])=>hole(p,face,cx+a,cy+b,R.legs.markD,R.legs.markDepth,{mark:true})); }
function orient(p){
  if(p.L>=p.W) return p;
  const L=p.L;
  p.holes.forEach(h=>{ const x=h.x, y=h.y; h.x=y; h.y=L-x; });
  const map={x0:'y1', x1:'y0', y0:'x0', y1:'x1'};
  p.edges.forEach(e=>{ e.edge=map[e.edge]; });
  p.edges.forEach(e=>{ if(e.edge==='x0'||e.edge==='x1') e.pos = L - e.pos; });
  [p.L,p.W]=[p.W,p.L];
  return p;
}
function cncDefaults(c){ c.cnc = Object.assign({joinery:'confirmat', back:'none', top:'rails', legs:true, topOverFacade:false, facadeT:18}, c.cnc||{}); return c.cnc; }
function buildCabinet(c, idx, projName){
  const o=cncDefaults(c); const t=+c.thick||18, W=+c.W, H=+c.H, D=+c.D;
  const base=(projName||'PROJ').replace(/[^\w\-]+/g,'_')+'_'+(idx+1)+(c.name?'_'+String(c.name).replace(/[^\w\-]+/g,'_'):'');
  const nm=role=>base+'_'+role;
  const out=[], warn=[];
  if(c.dishwasher){ warn.push('dish'); return {panels:out, warnings:warn}; }
  const cols=Math.max(1,Math.floor(+c.cols||1)); if(cols>1) warn.push('cols');
  const tb = o.back==='top' ? t : 0;
  const topFull = o.top==='full';
  const Dside = D - tb;
  const Lside = topFull ? H-2*t : H-t;
  const fT = +o.facadeT||18;
  const secs=(c.sections||[]).filter(s=>Math.floor(+s.col||0)===0);
  const Hz = H - (topFull&&o.topOverFacade ? t : (topFull ? 0 : R.facade.zoneGapRails));
  let sumExp=0,nFill=0; secs.forEach(s=>{ if(s.fill)nFill++; else sumExp+=Math.max(0,+s.height||0); });
  const fillH=nFill>0?Math.max(0,Hz-sumExp)/nFill:0;
  const runners=[]; const facades=[]; let yCur=0;
  secs.forEach((s,si)=>{
    const secH=s.fill?fillH:Math.max(0,+s.height||0);
    if(s.kind==='drawers'){
      const n=Math.max(1,Math.round(+s.nDrawers||1)); const fh=secH/n;
      const rt=R.runner[s.hw]; if(!rt) warn.push('hw');
      for(let j=0;j<n;j++){ const fb=yCur+j*fh; facades.push({w:W-2*R.facade.sideGap, h:fh-R.facade.gap, bottom:fb, hw:s.hw, sec:si, idx:j}); if(rt) runners.push({fb, type:s.hw}); }
    }
    yCur+=secH;
  });
  const mkSide=(role,right)=>{
    const p=panel(nm(role), role, Lside, Dside, t, 'vidinė pusė viršuje, apatinis kraštas X=0, priekis '+(right?'Y=DY':'Y=0'));
    const Y=y=>right?Dside-y:y;
    if(o.joinery==='cam'){
      const cr=R.cam.cam, ys=[cr.fromFront, Dside/2, Dside-cr.fromFront];
      ys.forEach(y=>{ hole(p,'A',cr.fromEdge,Y(y),cr.d,cr.depth); edge(p,'x0',Y(y),R.cam.bolt.d,cr.fromEdge);
                      if(topFull){ hole(p,'A',Lside-cr.fromEdge,Y(y),cr.d,cr.depth); edge(p,'x1',Y(y),R.cam.bolt.d,cr.fromEdge); } });
      [cr.fromFront+R.cam.dowel.offset, Dside-cr.fromFront-R.cam.dowel.offset].forEach(y=>{ edge(p,'x0',Y(y),R.cam.dowel.d,R.cam.dowel.depthEdge); if(topFull) edge(p,'x1',Y(y),R.cam.dowel.d,R.cam.dowel.depthEdge); });
    } else {
      const cf=R.confirmat, ys=[cf.fromFront, Dside/2, Dside-cf.fromFront];
      ys.forEach(y=>{ edge(p,'x0',Y(y),cf.pilot.d,cf.pilot.depth); if(topFull) edge(p,'x1',Y(y),cf.pilot.d,cf.pilot.depth); });
      if(!topFull){
        cf.railFromEdge.forEach(a=>{ hole(p,'A',Lside-t/2,Y(a),cf.d,0,{through:true}); hole(p,'A',Lside-t/2,Y(Dside-tb- a),cf.d,0,{through:true});
                                      hole(p,'A',Lside-t-R.rail+a,Y(Dside-t/2),cf.d,0,{through:true}); hole(p,'A',a,Y(Dside-t/2),cf.d,0,{through:true}); });
      }
    }
    if(o.back==='top') p.warnings.push('back5');
    runners.forEach(r=>{ const rt=R.runner[r.type]; const x=Math.max(rt.up, r.fb+rt.up-t); rt.marks.forEach(m=>hole(p,'A',x,Y(m),R.legs.markD,R.legs.markDepth,{mark:true})); });
    return p;
  };
  out.push(mkSide('KAIRE',false)); out.push(mkSide('DESINE',true));
  { const p=panel(nm('DUGNAS'),'DUGNAS',W,Dside,t,'viršus viršuje, priekis Y=0');
    const ys = o.joinery==='cam' ? [R.cam.cam.fromFront, Dside/2, Dside-R.cam.cam.fromFront] : [R.confirmat.fromFront, Dside/2, Dside-R.confirmat.fromFront];
    [t/2, W-t/2].forEach(x=>ys.forEach(y=>{ if(o.joinery==='cam') hole(p,'A',x,y,R.cam.bolt.d,R.cam.bolt.depthFace); else hole(p,'A',x,y,R.confirmat.d,0,{through:true}); }));
    if(o.joinery==='cam') [t/2,W-t/2].forEach(x=>[R.cam.cam.fromFront+R.cam.dowel.offset, Dside-R.cam.cam.fromFront-R.cam.dowel.offset].forEach(y=>hole(p,'A',x,y,R.cam.dowel.d,R.cam.dowel.depthFace)));
    if(o.joinery==='confirmat' && !topFull) [t+R.confirmat.railAlong, W/2, W-t-R.confirmat.railAlong].forEach(x=>hole(p,'A',x,Dside-t/2,R.confirmat.d,0,{through:true}));
    if(o.legs){ [R.legs.fromSide, W-R.legs.fromSide].forEach(x=>[R.legs.fromFront, Dside-R.legs.fromBack].forEach(y=>legMarks(p,'B',x,y))); }
    out.push(p); }
  if(topFull){
    const Dtop = Dside + (o.topOverFacade?fT:0) + tb, off = o.topOverFacade?fT:0;
    const p=panel(nm('VIRSUS'),'VIRSUS',W,Dtop,t,'apačia viršuje (gręžiama iš apačios), priekis Y=0');
    const ys = o.joinery==='cam' ? [R.cam.cam.fromFront, Dside/2, Dside-R.cam.cam.fromFront] : [R.confirmat.fromFront, Dside/2, Dside-R.confirmat.fromFront];
    [t/2, W-t/2].forEach(x=>ys.forEach(y=>{ if(o.joinery==='cam') hole(p,'B',x,y+off,R.cam.bolt.d,R.cam.bolt.depthFace); else hole(p,'B',x,y+off,R.confirmat.d,0,{through:true}); }));
    if(o.joinery==='cam') [t/2,W-t/2].forEach(x=>[R.cam.cam.fromFront+R.cam.dowel.offset, Dside-R.cam.cam.fromFront-R.cam.dowel.offset].forEach(y=>hole(p,'B',x,y+off,R.cam.dowel.d,R.cam.dowel.depthFace)));
    out.push(p);
  } else {
    const Lr=W-2*t, cf=R.confirmat;
    const mk=(role,note)=>{ const p=panel(nm(role),role,Lr,R.rail,t,note); if(o.joinery==='confirmat') cf.railFromEdge.forEach(a=>{edge(p,'x0',a,cf.pilot.d,cf.pilot.depth); edge(p,'x1',a,cf.pilot.d,cf.pilot.depth);}); return p; };
    const pf=mk('JUOSTA_PRIEKIS','horizontali, išorinis (priekinis) kraštas Y=0'); out.push(pf);
    const pb=mk('JUOSTA_GALAS_H','horizontali, išorinis (galinis) kraštas Y=0');
    if(o.joinery==='confirmat'&&o.back!=='inside') [cf.railAlong, Lr/2, Lr-cf.railAlong].forEach(x=>hole(pb,'A',x,t/2,cf.d,0,{through:true}));
    out.push(pb);
    const pv=mk('JUOSTA_GALAS_V','vertikali viršuje, apatinis kraštas Y=0'); out.push(pv);
    out.push(mk('JUOSTA_APACIA_V','vertikali apačioje, apatinis kraštas Y=0'));
  }
  if(o.back==='top'){
    const Hb = topFull ? H-t : H;
    const p=panel(nm('NUGARA'),'NUGARA',W,Hb,t,'išorė viršuje, apatinis kraštas Y=0');
    const ys=[R.cam.backFix.fromEdge, Lside/2, Lside-R.cam.backFix.fromEdge].map(y=>y+t);
    [t/2,W-t/2].forEach(x=>ys.forEach(y=>hole(p,'A',x,y,R.cam.backFix.d,0,{through:true})));
    out.push(p);
  } else if(o.back==='inside'){
    const p=panel(nm('NUGARA'),'NUGARA',W-2*t,topFull?H-2*t:H-t,t,'nugara tarp šonų'); out.push(p);
  }
  facades.forEach((f,i)=>{
    const p=panel(nm('FASADAS'+(i+1)),'FASADAS',f.w,f.h,fT,'galinė (vidinė) pusė viršuje, apatinis kraštas Y=0');
    const rt=R.runner[f.hw];
    if(rt&&rt.facade){ const fc=rt.facade; [fc.fromSide, f.w-fc.fromSide].forEach(x=>{ fc.ys.forEach(y=>hole(p,'A',x,y,fc.d,fc.depth)); if(f.h>=250) hole(p,'A',x,fc.yGallery,fc.d,fc.depth); }); }
    out.push(p);
  });
  out.forEach(orient);
  return {panels:out, warnings:warn};
}
const num=v=>{ v=Math.round(v*1e6)/1e6; return Number.isInteger(v)?String(v):String(v).replace(/0+$/,''); };
function programs(p){
  const DX=p.L, DY=p.W, DZ=p.T; const w=[];
  const cnt=f=>p.holes.filter(h=>h.face===f&&!h.through).length;
  const up1 = cnt('B')>cnt('A') ? 'B' : 'A';
  const need2 = cnt(up1==='A'?'B':'A')>0;
  const mach=(h,up)=>({x:h.x, y:(up==='A')?h.y:DY-h.y});
  const bores=(up)=>{
    const out=[];
    p.holes.forEach(h=>{
      const isUp = h.face===up;
      if(!(h.through && up===up1) && !isUp) return;
      const m = mach(h,up);
      if(!R.drills.top.includes(h.d)){ w.push('nodrill'); return; }
      out.push({F:1, X:m.x, Y:m.y, Z: h.through?-(DZ+R.through_extra):-h.depth, D:h.d, N:(h.through||h.mark)?'L':'P', sx:m.x});
    });
    if(up===up1) p.edges.forEach(e=>{
      let F,X,Y,sx;
      const yUp = y => (up==='A')?y:DY-y;
      if(e.edge==='x0'){ F=3; X=DZ/2; Y=yUp(e.pos); sx=e.depth; }
      else if(e.edge==='x1'){ F=2; X=DZ/2; Y=yUp(e.pos); sx=DX-e.depth; }
      else { F=(e.edge==='y0')===(up==='A')?4:5; X=e.pos; Y=DZ/2; sx=e.pos; }
      const ok = (F===2||F===3) ? R.drills.xEnds.includes(e.d) : R.drills.yEdges.includes(e.d);
      if(!ok){ w.push('noedge'); return; }
      out.push({F, X, Y, Z:-e.depth, D:e.d, N:'P', sx});
    });
    out.sort((a,b)=>(a.sx-b.sx)||(a.Y-b.Y)||(a.X-b.X));
    return out;
  };
  const xbo=bl=>bl.map(b=>` XBO X=${num(b.X)} Y=${num(b.Y)} Z=${num(b.Z)} D=${num(b.D)} N="${b.N}" F=${b.F} R=1#`);
  const b1=bores(up1); const res=[];
  const b2=need2?bores(up1==='A'?'B':'A'):[];
  const head=`H DX=${num(DX)} DY=${num(DY)} DZ=${num(DZ)} BX=0 BY=0 BZ=21 -EH T=0 *MM /"DEF" R=1 V=0`;
  if(b1.length) res.push({file:p.name+'_1OP.XXL', head, xbo:xbo(b1), up:up1});
  if(b2.length) res.push({file:p.name+'_2OP.XXL', head, xbo:xbo(b2), up:up1==='A'?'B':'A'});
  return {files:res};
}
module.exports={buildCabinet, programs, R};
