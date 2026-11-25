/* =====================================================================
   sketch.js — the offer app's cabinet sketch (gervdalius-droid/offer,
   cabinetSVG), copied verbatim between the markers below so the creator
   draws exactly the same picture. Only the small helpers it needs and the
   section layout (the offer app's calcCabinet → secOut) are added here.
   ===================================================================== */
(function (root) {
"use strict";
let LANG = 'lt';
const num=v=>{
  if(typeof v==='number')return isFinite(v)?v:0;
  if(v==null||v==='')return 0;
  const s=String(v).replace(/\s+/g,'').replace(/,/g,'.');
  if(/^[-+]?(\d+\.?\d*|\.\d+)$/.test(s))return parseFloat(s);
  const n=parseFloat(s);return isFinite(n)?n:0;};
const eq=(a,b)=>String(a||"").trim().toUpperCase()===String(b||"").trim().toUpperCase();
const t=k=>({reqInfo:LANG==='lt'?'Įveskite matmenis':'Enter dimensions'})[k]||k;
function shelfYs(sec,secH){
  const sh=Math.max(0,Math.round(num(sec.shelves)));
  if(sec&&sec.shelfMode==='manual'&&Array.isArray(sec.shelfPos)){
    const ys=[];for(let q=0;q<sh;q++){const v=num(sec.shelfPos[q]);ys.push(isFinite(v)&&v>0?v:secH*(q+1)/(sh+1));}return ys;
  }
  const ys=[];for(let q=1;q<=sh;q++)ys.push(secH*q/(sh+1));return ys;
}
/* section heights per column — same arithmetic as the offer app's calcCabinet */
function layout(c){
  const H=num(c.H), W=c.dishwasher?(num(c.dishWidth)||600):num(c.W);
  if(c.dishwasher) return {secOut:[],cols:1,colW:[W],dish:true};
  const secs=c.sections||[], cols=Math.max(1,Math.floor(num(c.cols)||1));
  let colW=(Array.isArray(c.colW)&&c.colW.length===cols&&c.colW.every(w=>num(w)>0))?c.colW.map(num):Array(cols).fill(W/cols);
  const sumCW=colW.reduce((a,b)=>a+b,0); if(sumCW>0){const kk=W/sumCW; colW=colW.map(w=>w*kk);}
  const colOf=s=>Math.min(cols-1,Math.max(0,Math.floor(num(s.col)||0)));
  const secOut=new Array(secs.length);
  for(let k=0;k<cols;k++){
    const idxs=[]; secs.forEach((s,i)=>{ if(colOf(s)===k) idxs.push(i); });
    let sumExplicit=0,nFill=0; idxs.forEach(i=>{const s=secs[i]; if(s.fill)nFill++; else sumExplicit+=Math.max(0,num(s.height));});
    const fillH=nFill>0?Math.max(0,H-sumExplicit)/nFill:0;
    idxs.forEach(i=>{const s=secs[i]; secOut[i]={kind:s.kind,secH:s.fill?fillH:Math.max(0,num(s.height)),col:k};});
  }
  return {secOut,cols,colW,dish:false};
}
/* ---------------- verbatim from the offer app ---------------- */
