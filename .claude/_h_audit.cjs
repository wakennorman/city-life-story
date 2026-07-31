const fs=require('fs'),path=require('path');
function walk(d,out=[]){for(const f of fs.readdirSync(d)){const p=path.join(d,f);const s=fs.statSync(p);if(s.isDirectory())walk(p,out);else if(f.endsWith('.js'))out.push(p);}return out;}
const all=walk('src/js');
const texts={};for(const f of all)texts[f]=fs.readFileSync(f,'utf8');
const H=all.filter(f=>/phase2[\\/](corp_ops|team|promo|startup|startup_crisis|startup_data|corp_legacy_bonus|perf)\.js$/.test(f)
  ||/core[\\/](company_spawner|events_corp|company_linkage_events|corporate_npc_events)\.js$/.test(f)
  ||/data[\\/](corp|startup_events)\.js$/.test(f));
console.log('H files:',H.map(f=>path.basename(f)).join(','));

// ---- A. flags written in H vs read anywhere ----
const wr={},rd={};
for(const f of all){const t=texts[f];
  for(const m of t.matchAll(/flags\.(_[A-Za-z0-9_]+)\s*(=[^=]|\+=|-=|\|\|=)/g)){(wr[m[1]]=wr[m[1]]||new Set()).add(f);}
  for(const m of t.matchAll(/flags\.(_[A-Za-z0-9_]+)/g)){(rd[m[1]]=rd[m[1]]||new Set()).add(f);}
}
// write-only flags whose only writer is an H file
const writeOnly=[];
for(const k in wr){
  const writers=[...wr[k]];
  const readerFiles=[...(rd[k]||[])].filter(f=>{
    const t=texts[f];
    // a "read" = occurrence not immediately followed by assignment
    const re=new RegExp('flags\\.'+k+'\\s*(?!=[^=]|\\+=|-=|\\|\\|=)','g');
    let mm;while((mm=re.exec(t))){ const after=t.slice(mm.index+('flags.'+k).length, mm.index+('flags.'+k).length+3);
      if(!/^\s*(=[^=]|\+=|-=|\|\|=)/.test(after)) return true; }
    return false;
  });
  if(readerFiles.length===0 && writers.some(w=>H.includes(w))) writeOnly.push([k,writers.map(f=>path.basename(f)).join('|')]);
}
console.log('\n=== [H] 写-only flags (无任何读取方) ===');
writeOnly.forEach(([k,w])=>console.log('  ',k,'<-',w));

// ---- B. flags READ in H but never written anywhere (永不开门的门控) ----
const neverWritten=[];
for(const k in rd){
  const readers=[...rd[k]];
  if(!readers.some(f=>H.includes(f))) continue;
  if(!wr[k]) neverWritten.push([k, readers.length, readers.map(f=>path.basename(f)).slice(0,4).join('|')]);
}
console.log('\n=== [H] 被读但全库零写入方 flags ===');
neverWritten.forEach(a=>console.log('  ',a[0],'读者文件数',a[1],':',a[2]));

// ---- C. company.<field> 读写对账 ----
const cw={},cr={};
for(const f of all){const t=texts[f];
  for(const m of t.matchAll(/company\.([A-Za-z0-9_]+)\s*(=[^=]|\+=|-=)/g)){(cw[m[1]]=cw[m[1]]||new Set()).add(f);}
  for(const m of t.matchAll(/company\.([A-Za-z0-9_]+)/g)){(cr[m[1]]=cr[m[1]]||new Set()).add(f);}
}
const noWriter=Object.keys(cr).filter(k=>!cw[k]);
console.log('\n=== company.<field> 有读无写 ===');
noWriter.forEach(k=>console.log('  company.'+k,'  files:',[...cr[k]].map(f=>path.basename(f)).slice(0,5).join('|')));
