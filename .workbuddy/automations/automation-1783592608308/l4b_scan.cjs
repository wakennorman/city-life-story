// L4-B dead-event scanner: find RANDOM_EVENTS.push({...}) entries lacking phase
const fs = require('fs');
const path = require('path');

const ROOT = process.argv[2] || '.';
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (!/node_modules|\.git|dist/.test(p)) walk(p); }
    else if (e.name.endsWith('.js')) files.push(p);
  }
}
walk(path.join(ROOT, 'src/js'));

// special find-by-id lookup lists (fire without phase)
const SPECIAL = new Set([
  'mental_breakdown_edge','mental_therapy_chance','mental_recovery_milestone',
  'village_chief_warning','village_chief_pressure','village_chief_final'
]);

function extractObjects(src, startIdx) {
  // from char after 'RANDOM_EVENTS.push(' find matching brace
  let i = src.indexOf('(', startIdx);
  if (i < 0) return null;
  i++; // past (
  // skip whitespace
  while (i < src.length && /\s/.test(src[i])) i++;
  if (src[i] !== '{') {
    // maybe push(var) — skip
    return null;
  }
  let depth = 0, started = false;
  for (let j = i; j < src.length; j++) {
    const c = src[j];
    if (c === '{') { depth++; started = true; }
    else if (c === '}') { depth--; if (started && depth === 0) return src.slice(i, j + 1); }
    else if (c === "'" || c === '"' || c === '`') {
      // skip strings to avoid brace mismatch inside
      const q = c; let k = j + 1;
      while (k < src.length) {
        if (src[k] === '\\') { k += 2; continue; }
        if (src[k] === q) { break; }
        k++;
      }
      j = k;
    }
  }
  return null;
}

const dead = [];
const chain = [];
const ok = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  let idx = 0;
  while ((idx = src.indexOf('RANDOM_EVENTS.push(', idx)) >= 0) {
    const obj = extractObjects(src, idx);
    idx += 'RANDOM_EVENTS.push('.length;
    if (!obj) continue;
    const idM = obj.match(/id:\s*["'`]([^"'`]+)["'`]/);
    const id = idM ? idM[1] : '(no-id)';
    const hasPhase = /phase:\s*["'`]/.test(obj) || /phase:\s*['"`]?(street|corporate|all)['"`]?/.test(obj);
    const isChain = /_isChainEvent:\s*true/.test(obj);
    if (hasPhase) { ok.push({ f, id }); }
    else if (isChain) { chain.push({ f, id }); }
    else if (SPECIAL.has(id)) { chain.push({ f, id, special: true }); }
    else { dead.push({ f: path.relative(ROOT, f), id, line: src.slice(0, src.indexOf(obj)).split('\n').length }); }
  }
}

console.log('=== PHASE-LESS NON-CHAIN (DEAD) CANDIDATES:', dead.length, '===');
for (const d of dead) console.log(`  ${d.f}:${d.line}  id="${d.id}"`);
console.log('\n=== CHAIN / SPECIAL (phase-less but OK):', chain.length, '===');
console.log('=== OK (has phase):', ok.length, '===');
