const R=require('../../src/report.js'), fs=require('fs');
(async()=>{ const pj=JSON.parse(fs.readFileSync(__dirname+'/ref_parts.json','utf8'));
  const out=await R.buildReport(fs.readFileSync(__dirname+'/../../tpl/ReportLists_template.xlsm'), pj, {version:'v18'});
  fs.writeFileSync(__dirname+'/rebuilt.xlsm', out); console.log('written', out.length); })().catch(e=>{console.error(e);process.exit(1)});
