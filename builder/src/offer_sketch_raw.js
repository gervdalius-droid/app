const FAC="#2f54eb"; // facade wireframe (accent)
const FRONT_TINT='fill-opacity="0.06"'; // fronts read as surfaces, interior still visible
function cabinetSVG(c,r){
  const t_=num(c.thick)||18,H=num(c.H);
  const D=Math.max(60,num(c.D)||100);
  const W=c.dishwasher?(num(c.dishWidth)||600):num(c.W);
  if(!(W>0&&H>0))return `<div class="muted" style="padding:30px;text-align:center">${t('reqInfo')}</div>`;
  const A=Math.PI/6, cs=Math.cos(A), sn=Math.sin(A);           // 30° isometric
  const hSpan=0.5*W+H+0.5*D, wSpan=cs*(W+D);
  let k=Math.min(290/hSpan, 250/wSpan); if(!isFinite(k)||k<=0)k=0.05;
  const padL=38,padR=14,padT=16,padB=26;
  const ddx=k*cs*D, ddy=-k*sn*D;                              // depth offset (back = front + d)
  const rawX=w=>k*cs*w, rawY=(w,h)=>k*(sn*w-h);
  const syArr=[rawY(0,0),rawY(W,0),rawY(0,H),rawY(W,H),rawY(0,0)+ddy,rawY(W,0)+ddy,rawY(0,H)+ddy,rawY(W,H)+ddy];
  const symin=Math.min.apply(null,syArr), symax=Math.max.apply(null,syArr);
  const sxmax=k*cs*W+ddx, ox=padL, oy=padT-symin;
  const svgW=sxmax+padL+padR, svgH=(symax-symin)+padT+padB;
  const FP=(w,h)=>[ox+rawX(w),oy+rawY(w,h)];                  // front face point (depth 0)
  const BP=(w,h)=>[ox+rawX(w)+ddx,oy+rawY(w,h)+ddy];          // back face point (depth D)
  const P=a=>a.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const poly=(pts,fill,stroke,sw,extra)=>`<polygon points="${P(pts)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" ${extra||''}/>`;
  let s=`<svg viewBox="0 0 ${svgW.toFixed(0)} ${svgH.toFixed(0)}" width="100%" style="max-width:${Math.min(330,svgW).toFixed(0)}px" xmlns="http://www.w3.org/2000/svg" font-family="ui-monospace,monospace">`;
  // full 3D projector and a panel-slab drawer (3 visible faces => thickness is shown on every panel)
  const Q=(x,y,z)=>[ox+k*cs*(x+z), oy+k*(sn*x - sn*z - y)];
  // a panel = its three visible isometric faces, drawn as edges only (9 unique lines)
  const slab=(x0,y0,z0,x1,y1,z1,stroke,sw,extra)=>
      poly([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],"none",stroke,sw,extra)   // front (z0)
    + poly([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x0,y1,z1)],"none",stroke,sw,extra)   // top (y1)
    + poly([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x1,y0,z1)],"none",stroke,sw,extra);  // right (x1)
  const FC=(w,h)=>Q(w,h,0);
  // wireframe line hierarchy: shell reads strongest, internals mid, back faintest
  const CK="#26303d", PK="#727f90", BACKC="#aab5c4", DRW="#8a97a8", FIT="#78859a";
  const W_SHELL="1.5", W_PART="1.05", W_SHELF="0.95", W_BACK="0.8", W_DRW="0.9";
  const HID='stroke-dasharray="3.5 2.6"';   // hidden/behind-the-facade edges, drafting convention
  const segL=(p,q,col,w,extra)=>`<line x1="${p[0].toFixed(1)}" y1="${p[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${q[1].toFixed(1)}" stroke="${col}" stroke-width="${w}" stroke-linecap="round" ${extra||''}/>`;
  // labels sit on top of the wireframe, so they carry a white halo to stay readable
  const lbl=(x,y,anc,txt,col,fs)=>`<text x="${x.toFixed(0)}" y="${y.toFixed(0)}" font-size="${fs||9.5}" fill="${col||'#1b1e26'}" text-anchor="${anc}" paint-order="stroke" stroke="#ffffff" stroke-width="3.2" stroke-linejoin="round">${txt}</text>`;
  // drawer: a single tray wireframe set back behind the facade, plus its runners
  // ---- hardware & fronts (drawn as real parts, not symbols) ----
  const sOf=v=>Number(v).toFixed(2);
  // filled panel: its three visible faces (front z0, top y1, right x1), each with its own fill
  const slabF=(x0,y0,z0,x1,y1,z1,fF,fT,fR,stroke,sw,extra)=>{
    const f=(pts,fill)=>`<polygon points="${P(pts)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" ${extra||''}/>`;
    return f([Q(x0,y0,z0),Q(x1,y0,z0),Q(x1,y1,z0),Q(x0,y1,z0)],fF)
      +f([Q(x0,y1,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x0,y1,z1)],fT)
      +f([Q(x1,y0,z0),Q(x1,y1,z0),Q(x1,y1,z1),Q(x1,y0,z1)],fR);};
  const MET=["#cdd3db","#e6e9ee","#b5bdc8","#6f7b8a"], BRD=["#edf0f4","#f7f8fa","#dce1e7","#98a3b2"];
  const FT=t_;                                   // facade thickness: fronts overlay the carcass, proud of it
  const GAP=Math.max(3,1.8/k);                   // reveal between fronts (≥3 mm, always visible on screen)
  // overlay front panel: semi-opaque so the interior still reads through it, edges show its thickness
  function frontPanel(x0,y0,x1,y1){
    const g=GAP/2; x0+=g;x1-=g;y0+=g;y1-=g; if(x1-x0<4||y1-y0<4)return "";
    return slabF(x0,y0,-FT,x1,y1,0,"#f7f8ff","#c9d3fb","#b7c4f8",FAC,"1.3",'fill-opacity="0.6"')
      +poly([Q(x0,y0,-FT),Q(x1,y0,-FT),Q(x1,y1,-FT),Q(x0,y1,-FT)],"none",FAC,"1.5");
  }
  // bar handle on the front face: two standoffs + bar
  function handleBar(xa,ya,xb,yb){
    const a=Q(xa,ya,-FT),b=Q(xb,yb,-FT),a2=Q(xa,ya,-FT-26),b2=Q(xb,yb,-FT-26);
    return segL(a,a2,"#56606d","1.6")+segL(b,b2,"#56606d","1.6")+segL(a2,b2,"#3d4550","3.4")+segL(a2,b2,"#aeb7c2","1.1");
  }
  // drawer box behind the front. Tandembox: metal sides + board bottom/back; others: full board box
  const SYS_H=[68,83,115,167,199];
  function drawerBox3D(x0,x1,yb,yt,dep,hw,inner){
    const fh=yt-yb, metal=eq(hw,'BLUM TANDEMBOX');
    let sh=metal?(SYS_H.filter(h=>h<=fh-30).pop()||Math.max(40,fh-24)):Math.max(50,Math.min(260,fh-45));
    const a=yb+Math.min(14,fh*0.1), st=metal?15:16, ins=metal?5:13;
    const bx0=x0+ins, bx1=x1-ins, z0=inner?3:4, z1=Math.max(z0+80,dep);
    if(bx1-bx0<3*st||sh<30)return "";
    const C=metal?MET:BRD, B=BRD, sw="0.7";
    let o="";
    o+=slabF(bx0+st,a+12,z1-16,bx1-st,a+sh-(metal?14:0),z1,B[0],B[1],B[2],B[3],sw);            // back
    o+=slabF(bx0+st,a,z0,bx1-st,a+12,z1-16,B[0],B[1],B[2],B[3],sw);                                // bottom
    o+=slabF(bx0,a,z0,bx0+st,a+sh,z1,C[0],C[1],C[2],C[3],sw);                                      // left side
    o+=slabF(bx1-st,a,z0,bx1,a+sh,z1,C[0],C[1],C[2],C[3],sw);                                      // right side
    if(!metal||inner) o+=slabF(bx0+st,a+12,z0,bx1-st,a+sh-(metal?8:0),z0+16,B[0],B[1],B[2],B[3],sw); // sub-front / inner front
    return o;
  }
  // concealed hinge behind the door: 35 mm cup in the door, arm, mounting plate on the side/partition
  const HS=Math.max(1,Math.min(1.8,0.34/k));   // small sketches: draw hinges a bit larger so they stay readable
  // concealed clip hinge (Blum style), door closed, seen through the door:
  // cross mounting plate on the side panel, arm with 2 adjustment screws, link, 35 mm cup with screwed flange in the door
  const PLc=["#e2e6eb","#f1f3f6","#c8ced6","#4a5462"], ARc=["#c3cad3","#e3e7ec","#a7b0bc","#3f4855"], KNc=["#aeb7c2","#d2d8de","#939eab","#3f4855"];
  const ell=(pts,fill,stroke,sw)=>`<polygon points="${P(pts)}" fill="${fill}" stroke="${stroke||'none'}" stroke-width="${sw||0}"/>`;
  const circX=(x,cy,cz,r)=>{const p=[];for(let q=0;q<16;q++){const u=q/16*2*Math.PI;p.push(Q(x,cy+r*Math.cos(u),cz+r*Math.sin(u)));}return p;};
  const screwX=(x,cy,cz,r)=>ell(circX(x,cy,cz,r),"#f4f6f8","#4a5462","0.6")+ell(circX(x,cy,cz,r*0.35),"#4a5462");
  const screwZ=(cx,cy,z,r)=>ell(circF(cx,cy,r,z),"#f4f6f8","#4a5462","0.6")+ell(circF(cx,cy,r*0.35,z),"#4a5462");
  function hinge3D(xEdge,dir,yy,plateX){
    const X=u=>xEdge+dir*u, h=HS;
    const bx=(u0,u1,y0,y1,z0,z1,c)=>{const a=X(u0),b=X(u1);return slabF(Math.min(a,b),y0,z0,Math.max(a,b),y1,z1,c[0],c[1],c[2],c[3],"0.7");};
    const R=17.5*h, uc=Math.max(22.5,R+3);           // cup radius, cup centre from the door edge
    let o="";
    if(plateX!=null){
      const us=Math.abs(plateX-xEdge), pt=3*h, at=11*h, zc=8+32*h;   // side face, plate thickness, arm thickness, plate centre depth
      // cross mounting plate on the side panel
      o+=bx(us,us+pt,yy-26*h,yy+26*h,zc-8*h,zc+8*h,PLc);                // vertical bar (screw wings)
      o+=bx(us,us+pt,yy-9*h,yy+9*h,zc-22*h,zc+22*h,PLc);                // body along the depth
      o+=screwX(X(us+pt),yy-19*h,zc,3.4*h)+screwX(X(us+pt),yy+19*h,zc,3.4*h);
      // arm clipped onto the plate, running back from the cup
      const a0=Math.max(us+pt,uc-at/2), a1=a0+at, z0=6*h, z1=zc+30*h;
      o+=bx(a0,a1,yy-11*h,yy+11*h,z0,z1,ARc);
      o+=bx(a0,a1,yy-11*h,yy+11*h,z1-6*h,z1,KNc);                        // clip end
      const fu=dir>0?a1:a0;                                              // face looking into the cabinet
      o+=screwX(X(fu),yy,zc-13*h,3.2*h)+screwX(X(fu),yy,zc+9*h,3.2*h);
      // link from the cup into the arm
      o+=bx(uc-6*h,uc+6*h,yy-8*h,yy+8*h,0,z0+4*h,KNc);
    }
    // cup set in the door, with its flange screwed to the door
    o+=ell(circF(X(uc),yy,R,0),"#e8ebef","#4a5462","0.9");
    o+=ell(circF(X(uc),yy,R*0.72,0),"#c9d0d8","#7d8896","0.6");
    o+=fillPoly(rectF(X(uc)-dir*7*h,yy-28*h,X(uc)+dir*7*h,yy+28*h,-0.5),"#dfe3e8","#4a5462","0.8");
    o+=screwZ(X(uc),yy-21*h,-0.6,3.2*h)+screwZ(X(uc),yy+21*h,-0.6,3.2*h);
    return o;
  }
  // hinge heights for a leaf: same count the price uses, outer ones ~100 mm from the ends
  const hingeCount=h=>h<=900?2:h<=1500?3:h<=2000?4:5;
  function hingeYs(y0,y1){const h=y1-y0,n=hingeCount(h),e=Math.min(100,h*0.18),ys=[];for(let q=0;q<n;q++)ys.push(y0+e+(h-2*e)*q/(n-1));return ys;}
  // filled shape on any plane (points already projected)
  const fillPoly=(pts,fill,stroke,sw,extra)=>`<polygon points="${P(pts)}" fill="${fill}" stroke="${stroke||'none'}" stroke-width="${sw||0}" stroke-linejoin="round" ${extra||''}/>`;
  const rectF=(x0,y0,x1,y1,z)=>[Q(x0,y0,z),Q(x1,y0,z),Q(x1,y1,z),Q(x0,y1,z)];   // rectangle on the front plane
  const circF=(cx,cy,r,z)=>{const p=[];for(let a=0;a<20;a++){const u=a/20*2*Math.PI;p.push(Q(cx+r*Math.cos(u),cy+r*Math.sin(u),z));}return p;};
  // built-in oven: support shelves at niche bottom/top, appliance body, black-glass front,
  // control strip (2 knobs + display), bar handle, door window
  function ovenIso(x0,x1,yb,yt,nSup){
    let o="";
    const botShelf=nSup>=1&&yb>=t_, topShelf=nSup>=2&&yt<=H-t_;
    if(botShelf) o+=slab(x0,yb,0,x1,yb+t_,D,PK,W_SHELF);
    if(topShelf) o+=slab(x0,yt-t_,0,x1,yt,D,PK,W_SHELF);
    for(let q=2;q<nSup;q++){const hh=yb+(yt-yb)*(q-1)/(nSup-1);o+=slab(x0,hh-t_/2,0,x1,hh+t_/2,D,PK,W_SHELF);}  // unusual extra shelves
    const oy0=(yb<t_)?t_:(botShelf?yb+t_:yb)+1, oyTop=(topShelf?yt-t_:yt)-2;
    if(oyTop-oy0<120||x1-x0<150) return o;
    const oy1=oy0+Math.min(oyTop-oy0,597);                       // 595-ish tall appliance, sits on its support
    const xm=(x0+x1)/2, fw=Math.min(x1-x0+2*t_-6,597), ox0=xm-fw/2, ox1=xm+fw/2, fh=oy1-oy0;
    const bx0=x0+2, bx1=x1-2, bd=Math.max(80,Math.min(D-30,550));  // body sits inside the opening
    o+=fillPoly([Q(bx0,oy1,0),Q(bx1,oy1,0),Q(bx1,oy1,bd),Q(bx0,oy1,bd)],"#c9d0d9","#8995a4","0.7",'fill-opacity="0.45"');   // body top
    o+=poly([Q(bx1,oy0,0),Q(bx1,oy1,0),Q(bx1,oy1,bd),Q(bx1,oy0,bd)],"none","#9aa5b4","0.8",HID);       // body side (hidden)
    o+=fillPoly(rectF(ox0,oy0,ox1,oy1,0),"#2a313b","#141920","1.2");                                    // glass front
    const ps=Math.max(48,Math.min(100,fh*0.16)), sy0=oy1-ps, sy1=oy1-ps*0.12, scy=(sy0+sy1)/2;
    o+=fillPoly(rectF(ox0+fw*0.03,sy0,ox1-fw*0.03,sy1,0),"#454e5b");                                    // control strip
    const kr=Math.min(ps*0.24,22);
    [ox0+fw*0.14,ox1-fw*0.14].forEach(kx=>{o+=fillPoly(circF(kx,scy,kr,0),"#cfd5dd","#8b95a3","0.8");o+=fillPoly(circF(kx,scy,kr*0.35,0),"#8b95a3");});
    o+=fillPoly(rectF(xm-fw*0.11,scy-ps*0.17,xm+fw*0.11,scy+ps*0.17,0),"#7cc4f2");                    // display
    const hy=sy0-Math.max(22,fh*0.055);                                                                 // handle
    const ha=Q(ox0+fw*0.12,hy,0),hb=Q(ox1-fw*0.12,hy,0);
    o+=segL(ha,hb,"#7f8a98","4.2")+segL(ha,hb,"#e6eaef","2.2");
    const wy1=hy-Math.max(22,fh*0.05), wy0=oy0+fh*0.12;                                               // door window
    if(wy1-wy0>40){
      o+=fillPoly(rectF(ox0+fw*0.13,wy0,ox1-fw*0.13,wy1,0),"#12161c","#5c6673","1");
      const rw=fw*0.74, rh=wy1-wy0;                                                                    // glass reflection
      o+=fillPoly([Q(ox0+fw*0.13+rw*0.08,wy0,0),Q(ox0+fw*0.13+rw*0.30,wy0,0),Q(ox0+fw*0.13+rw*0.58,wy1,0),Q(ox0+fw*0.13+rw*0.36,wy1,0)],"#ffffff",null,0,'fill-opacity="0.07"');
      o+=fillPoly(rectF(ox0+fw*0.17,wy0+rh*0.10,ox1-fw*0.17,wy0+rh*0.13,0),"#3a4350");               // oven rack hint
    }
    return o;
  }
  // ---- DISHWASHER: top shelf slab + see-through facade ----
  if(r.dish){
    s+=slab(0,H-t_,0,W,H,D,PK,W_SHELF);                                         // top shelf (with thickness)
    const db0=Math.min(110,H*0.14), dbd=Math.max(80,D-40);                      // appliance body on its feet, behind the decor front
    s+=slab(6,db0,22,W-6,H-t_-4,dbd,FIT,"0.9",HID);
    s+=poly([Q(0,0,0),Q(W,0,0),Q(W,H,0),Q(0,H,0)],FAC,FAC,"1.8",FRONT_TINT);     // decor front
    const a=FC(0.30*W,0.86*H),b=FC(0.70*W,0.86*H);
    s+=segL(a,b,FAC,"2");
    const cc=FC(W/2,0.45*H);
    s+=lbl(cc[0],cc[1]+12,'middle',(LANG==='lt'?'indaplovė':'dishwasher'),'#8792a4',9);
  } else {
    // carcass panels, each a slab of board thickness t (visible sides tinted as facade)
    s+=slab(0,0,0,t_,H,D,(c.visLeft?FAC:CK),W_SHELL);     // left side
    s+=slab(W-t_,0,0,W,H,D,(c.visRight?FAC:CK),W_SHELL);  // right side
    s+=slab(t_,0,0,W-t_,t_,D,CK,W_SHELL);        // bottom
    s+=slab(t_,H-t_,0,W-t_,H,D,CK,W_SHELL);      // top
    if(c.hasBack!==false){const bt=Math.max(3,t_*0.5);const bc=(c.backType==='facade')?FAC:BACKC;s+=slab(t_,t_,D-bt,W-t_,H-t_,D,bc,W_BACK,HID);} // back panel
    // columns & partitions
    const cols=Math.max(1,r.cols||1);
    const colW=(r.colW&&r.colW.length===cols)?r.colW:Array(cols).fill(W/cols);
    const bnd=[0]; for(let k=0;k<cols;k++)bnd.push(bnd[k]+colW[k]); bnd[cols]=W;
    for(let k=1;k<cols;k++){s+=slab(bnd[k]-t_/2,t_,0,bnd[k]+t_/2,H-t_,D,PK,W_PART);} // partitions
    // sections per column (bottom -> top within each column)
    for(let k=0;k<cols;k++){
      const fx0=(k===0)?t_:bnd[k]+t_/2, fx1=(k===cols-1)?W-t_:bnd[k+1]-t_/2, cw=fx1-fx0;
      const Xc0=(k===0)?0:bnd[k], Xc1=(k===cols-1)?W:bnd[k+1];   // overlay fronts cover the carcass edges
      let mm=0;
      (r.secOut||[]).forEach((so,idx)=>{
        if((so.col||0)!==k)return; const secH=so.secH; if(secH<=0){return;}
        const hB=mm,hT=mm+secH,sec=c.sections[idx];
        if(so.kind==='open'){
          shelfYs(sec,secH).forEach(off=>{const hh=hB+Math.max(t_,Math.min(secH-t_,off));s+=slab(fx0,hh-t_/2,0,fx1,hh+t_/2,D,PK,W_SHELF);});
        } else if(so.kind==='oven'){
          s+=ovenIso(fx0,fx1,hB,hT,Math.max(0,Math.round(num(sec.shelves))));
        } else if(so.kind==='drawers'){const n=Math.max(1,num(sec.nDrawers));
          const dep=Math.max(40,Math.min(D-t_,num(sec.rail)||D));
          for(let d=0;d<n;d++){const y0=hB+secH*d/n,y1=hB+secH*(d+1)/n;s+=drawerBox3D(fx0,fx1,y0,y1,dep,sec.hw,false);}
          for(let d=0;d<n;d++){const y0=hB+secH*d/n,y1=hB+secH*(d+1)/n,fh=y1-y0;
            s+=frontPanel(Xc0,y0,Xc1,y1);
            const L=Math.max(96,Math.min(320,(Xc1-Xc0)*0.36)), hy=fh>260?y1-70:(y0+y1)/2, xm=(Xc0+Xc1)/2;
            s+=handleBar(xm-L/2,hy,xm+L/2,hy);}
        } else if(so.kind==='doors'){const n=Math.max(1,num(sec.nDoors));
          const idn=Math.max(0,Math.floor(num(sec.innerDrawers))), pos=sec.innerPos||'bottom';
          const zoneH=idn>0?((num(sec.innerH)>0)?Math.min(num(sec.innerH),secH):secH):0;
          const shBot=(idn>0&&pos==='bottom')?hB+zoneH:hB, shTop=(idn>0&&pos==='top')?hT-zoneH:hT;
          const sh=num(sec.shelves);
          for(let q=1;q<=sh;q++){const hh=shBot+(shTop-shBot)*q/(sh+1);s+=slab(fx0,hh-t_/2,0,fx1,hh+t_/2,D,PK,W_SHELF);}
          if(idn>0){const z0=(pos==='top')?hT-zoneH:hB, dep=Math.max(40,Math.min(D-t_,num(sec.innerRail)||D));
            for(let d=0;d<idn;d++){const y0=z0+zoneH*d/idn,y1=z0+zoneH*(d+1)/idn;s+=drawerBox3D(fx0,fx1,y0,y1,dep,sec.innerHw,true);}}
          const hinged=!eq(sec.hinge,'BE FURNITŪROS'), tipOn=/TIP-ON/i.test(String(sec.hinge||''));
          const hsV=sec.hingeSide||'auto';
          // one leaf: hinges on hingeLeft side, handle on the opening edge (none for TIP-ON)
          const leaf=(x0,y0,x1,y1,hingeLeft,handleY)=>{
            const g=GAP/2, xe=hingeLeft?x0+g:x1-g, dir=hingeLeft?1:-1;
            const plate=hingeLeft?(Math.abs(x0-Xc0)<1?fx0:null):(Math.abs(x1-Xc1)<1?fx1:null);
            let o="";
            o+=frontPanel(x0,y0,x1,y1);
            if(hinged) hingeYs(y0+g,y1-g).forEach(yy=>{o+=`<g opacity="0.95">${hinge3D(xe,dir,yy,plate)}</g>`;});   // seen through the door
            if(!tipOn){const L=Math.max(96,Math.min(256,(y1-y0)*0.16)), hx=hingeLeft?x1-g-42:x0+g+42;
              const cy=Math.max(y0+g+60+L/2,Math.min(y1-g-60-L/2,handleY));
              o+=handleBar(hx,cy-L/2,hx,cy+L/2);}
            return o;};
          const wall=eq(c.type,'PAKABINAMOS');
          const handleAt=(y0,y1,lowerLeaf,upperLeaf)=>wall?y0:(upperLeaf?y0:lowerLeaf?y1:Math.min(1050,y1));
          if(sec.doorSplit==='h'){
            const hL=hsV!=='right';
            for(let d=0;d<n;d++){const y0=hB+secH*d/n,y1=hB+secH*(d+1)/n;
              s+=leaf(Xc0,y0,Xc1,y1,hL,handleAt(y0,y1,n>1&&d<n-1,n>1&&d===n-1));}
          } else {
            for(let d=0;d<n;d++){const x0=Xc0+(Xc1-Xc0)*d/n,x1=Xc0+(Xc1-Xc0)*(d+1)/n;
              // auto = pair opens from the middle; left/right forces every leaf the same way
              const hingeLeft=(hsV==='left')?true:(hsV==='right')?false:(d<n-1);
              s+=leaf(x0,hB,x1,hT,hingeLeft,handleAt(hB,hT,false,false));}
          }
        }
        mm+=secH;
      });
    }
  }
  // dimension labels
  const wM=FP(W/2,0), hM=FP(0,H/2), dM=[(FP(W,0)[0]+BP(W,0)[0])/2,(FP(W,0)[1]+BP(W,0)[1])/2];
  s+=lbl(wM[0],wM[1]+14,'middle',Math.round(W));
  s+=lbl(hM[0]-7,hM[1]+3,'end',Math.round(H));
  s+=lbl(dM[0]+7,dM[1]-5,'start',Math.round(D),'#667085',9);
  s+=`</svg>`; return s;
}

