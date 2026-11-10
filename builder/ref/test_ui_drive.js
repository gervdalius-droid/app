// Drives the real dialog (dialog.html + app.js) in jsdom with a fake window.sketchup.
const {JSDOM}=require('jsdom'), fs=require('fs'), path=require('path');
const html=path.resolve(__dirname,'../src/dedes_baldai/ui/dialog.html');
async function open(){
  const calls=[];
  const dom=await JSDOM.fromFile(html,{runScripts:'dangerously',resources:'usable',pretendToBeVisual:true,
    beforeParse(w){ w.sketchup=new Proxy({},{get:(_,n)=>(arg)=>calls.push([n,arg])}); w.console.log=()=>{}; }});
  await new Promise(r=>dom.window.addEventListener('load',r));
  const errs=[]; dom.window.addEventListener('error',e=>errs.push(e.message));
  return {w:dom.window, d:dom.window.document, calls, errs};
}
const click=(d,sel)=>{ const el=d.querySelector(sel); if(!el) throw new Error('no element '+sel); el.dispatchEvent(new d.defaultView.MouseEvent('click',{bubbles:true})); };
const setv=(d,sel,v)=>{ const el=d.querySelector(sel); if(!el) throw new Error('no element '+sel); if(el.type==='checkbox') el.checked=v; else el.value=v; el.dispatchEvent(new d.defaultView.Event('input',{bubbles:true})); el.dispatchEvent(new d.defaultView.Event('change',{bubbles:true})); };
(async()=>{
  const stage=process.argv[2];
  const {w,d,calls,errs}=await open();
  if(calls[0][0]!=='ready') throw new Error('ready not sent first');
  w.DB.init({version:'0.1.0',settings:{lang:'lt',mats:{carc:'LMDP 18 Balta W980\nLMDP 18 Pilka',facade:'LMDP 18 Ąžuolas H1180',edge:'ABS 0.8 Balta\nABS 1 Ąžuolas'},
    defaults:{carc:'LMDP 18 Balta W980',facade:'LMDP 18 Ąžuolas H1180',edgeCarc:'ABS 0.8 Balta',edgeFacade:'ABS 1 Ąžuolas'}}});
  if(stage==='build'){
    const out=[]; let nr=1;
    const sel=()=>({nextNr:nr,panels:[],project:'Virtuve Petraiciai',cabinet:null,count:0});
    w.DB.state({mode:'new',sel:sel()});
    const plan=[['baseDr',c=>{ setv(d,'[data-bind=name]','Stalčių'); setv(d,'[data-bind=W]',600); }],
                ['sample',null],
                ['tall',c=>{ setv(d,'[data-bind="cnc.joinery"]','cam'); }],
                ['wall',c=>{ setv(d,'[data-bind="sec.0.nDoors"]',2); setv(d,'[data-bind="sec.0.shelves"]',2); }],
                ['baseDoor',c=>{ click(d,'[data-act="secAdd:drawers"]'); setv(d,'[data-bind="sec.1.fill"]',false); setv(d,'[data-bind="sec.1.height"]',180); setv(d,'[data-bind="sec.1.nDrawers"]',1); }],
                ['dish',null]];
    for(const [p,fn] of plan){
      if(nr>1) click(d,'[data-act="new"]');
      click(d,`[data-act="preset:${p}"]`); if(fn) fn();
      if(!d.querySelector('#sketch svg')) throw new Error('no sketch for '+p);
      const before=calls.length; click(d,'[data-act=build]');
      const c=calls.slice(before).find(x=>x[0]==='build'); if(!c) throw new Error('no build call for '+p);
      out.push(JSON.parse(c[1]));
      w.DB.built({uid:'u'+nr,nr}); nr++; w.DB.state({mode:null,sel:sel()});
    }
    // edit flow: select cabinet 1 in model, click Edit, change height, update
    w.DB.state({mode:null,sel:Object.assign(sel(),{cabinet:{uid:'u1',nr:1,def:out[0].def}})});
    click(d,'[data-act=editSel]'); setv(d,'[data-bind=H]',760);
    const b=calls.length; click(d,'[data-act=build]'); const up=JSON.parse(calls.slice(b).find(x=>x[0]==='build')[1]);
    if(up.uid!=='u1'||up.def.H!==760) throw new Error('edit/update payload wrong');
    // language toggle + every tab renders
    click(d,'[data-lang=en]'); for(const tb of ['panel','export','settings','cab']) click(d,`[data-act="tab:${tb}"]`);
    if(!/Place|Update/.test(d.querySelector('[data-act=build]').textContent)) throw new Error('EN labels missing');
    fs.writeFileSync('payloads.json',JSON.stringify(out));
    console.log('UI build stage ok:',out.length,'payloads; panels per cabinet:',out.map(o=>o.geo.panels.length).join(','),'; edit payload ok; errors:',errs.length);
  } else if(stage==='export'){
    const col=JSON.parse(fs.readFileSync('collected.json','utf8'));
    w.DB.state({mode:'export',sel:{nextNr:9,panels:[],project:col.project}});
    w.DB.collected(col);
    const nRows=d.querySelectorAll('.tblwrap tbody tr').length;
    const before=calls.length; click(d,'[data-act="write:all"]');
    if(!calls.slice(before).some(x=>x[0]==='collect')) throw new Error('write did not refresh from model first');
    w.DB.collected(col);
    const wr=calls.slice(before).find(x=>x[0]==='write_all'); if(!wr) throw new Error('no write_all');
    fs.writeFileSync('write_all.json',wr[1]);
    const p=JSON.parse(wr[1]);
    console.log('UI export stage ok: table rows',nRows,'; workbook entries',p.entries.length,'; programs',p.files.length,'; warnings shown',d.querySelectorAll('.warns li').length,'; errors:',errs.length);
    // panel tab with a selected loose panel
    w.DB.state({mode:'panel',sel:{nextNr:9,project:col.project,panels:[{name:'Lentyna',mat:'',paint:'LMDP 18 Pilka',eb:{},skip:false,builder:false,dims:[800,250,18]}]}});
    setv(d,'[data-pf=mat]','LMDP 18 Balta W980'); setv(d,'[data-pf=e1]',true);
    const b2=calls.length; click(d,'[data-act=applyPanel]');
    const sp=JSON.parse(calls.slice(b2).find(x=>x[0]==='set_panel')[1]);
    if(sp.mat!=='LMDP 18 Balta W980'||sp.eb.eb1!=='ABS 0.8 Balta'||sp.name!=='Lentyna') throw new Error('set_panel payload wrong '+JSON.stringify(sp));
    console.log('UI panel stage ok:',JSON.stringify(sp));
  }
  if(errs.length){ console.log(errs); process.exit(1); }
  process.exit(0);
})().catch(e=>{ console.error('FAIL',e); process.exit(1); });
