// L4-B phase-value scanner: flag RANDOM_EVENTS.push entries with phase != street|corporate
const fs = require('fs');
const path = require('path');
const ROOT = process.argv[2] || '.';
const files = [];
function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory()){if(!/node_modules|\.git|dist/.test(p))walk(p);}else if(e.name.endsWith('.js'))files.push(p);}}
walk(path.join(ROOT,'src/js'));
const SPECIAL=new Set(['mental_breakdown_edge','mental_therapy_chance','mental_recovery_milestone','village_chief_warning','village_chief_pressure','village_chief_final']);
function extract(src,startIdx){let i=src.indexOf('(',startIdx);if(i<0)return null;i++;while(i<src.length&&/\s/.test(src[i]))i++;if(src[i]!=='{')return null;let depth=0,started=false;for(let j=i;j<src.length;j++){const c=src[j];if(c==='{'){depth++;started=true;}else if(c==='}'){depth--;if(started&&depth===0)return src.slice(i,j+1);}else if(c==="'"||c==='"'||c==='`'){const q=c;let k=j+1;while(k<src.length){if(src[k]==='\\'){k+=2;continue;}if(src[k]===q)break;k++;}j=k;}}return null;}
const bad=[],computed=[];
for(const f of files){const src=fs.readFileSync(f,'utf8');let idx=0;while((idx=src.indexOf('RANDOM_EVENTS.push(',idx))>=0){const obj=extract(src,idx);idx+='RANDOM_EVENTS.push('.length;if(!obj)continue;const idM=obj.match(/id:\s*["'`]([^"'`]+)["'`]/);const id=idM?idM[1]:'(no-id)';const pm=obj.match(/phase:\s*["'`]([^"'`]+)["'`]/);const line=src.slice(0,src.indexOf(obj)).split('\n').length;if(pm){if(pm[1]!=='street'&&pm[1]!=='corporate')bad.push({f:path.relative(ROOT,f),id,phase:pm[1],line});}else if(/phase:\s*[\w.]+\s*(\|\||\))/.test(obj)||/phase:\s*careerEvent|phase:\s*\(/.test(obj)){computed.push({f:path.relative(ROOT,f),id,line});}else if(!/_isChainEvent:\s*true/.test(obj)&&!SPECIAL.has(id)&&!/故意不设 phase/.test(obj)){/* phase-less but not chain/special/intentional-after_work -> would be dead, but already known handled */}}}
console.log('=== BAD PHASE VALUE (dead via mismatch):',bad.length,'===');
for(const d of bad)console.log(`  ${d.f}:${d.line} id="${d.id}" phase="${d.phase}"`);
console.log('\n=== COMPUTED PHASE (defaulted, likely OK):',computed.length,'===');
for(const d of computed.slice(0,20))console.log(`  ${d.f}:${d.line} id="${d.id}"`);
