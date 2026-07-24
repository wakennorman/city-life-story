/**
 * Fix remaining domain H A类 defects
 * - st.flags && guards in conditions functions
 * - st.player.corporate guards in apply functions
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/js/core/events_corp.js');
let content = fs.readFileSync(filePath, 'utf8');

// Fix st.flags._xxx in conditions (add st.flags && guard)
// Pattern: if (st.flags._xxx) or if (st.flags._xxx && ...)
// But NOT if already guarded: if (st.flags && st.flags._xxx)
let count = 0;
content = content.replace(
  /if\s*\(\s*st\.flags\._([a-zA-Z_]+)\s*([^)]*)\)\s*\{/g,
  (match, flagName, rest) => {
    // Skip if already guarded
    if (match.includes('st.flags &&')) return match;
    count++;
    if (rest && rest.trim()) {
      return `if (st.flags && st.flags._${flagName} ${rest.trim()}) {`;
    }
    return `if (st.flags && st.flags._${flagName}) {`;
  }
);
console.log(`Fixed ${count} st.flags && guards`);

// Fix st.player.corporate.xxx access (but not if already guarded)
count = 0;
// Replace st.player.corporate.xxx when it's used in apply functions
// This is a rough pattern - we check for st.player.corporate access without a prior guard
// We add a guard before the first access in each apply function
// For simplicity, we handle the common pattern: st.player.corporate.xxx = ...
// by adding a default guard at the function level
content = content.replace(
  /st\.player\.corporate\.ability\b/g,
  () => { count++; return '(st.player.corporate || {}).ability'; }
);
console.log(`Fixed ${count} st.player.corporate.ability`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.kpi\b/g,
  () => { count++; return '(st.player.corporate || {}).kpi'; }
);
console.log(`Fixed ${count} st.player.corporate.kpi`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.upwardMgmt\b/g,
  () => { count++; return '(st.player.corporate || {}).upwardMgmt'; }
);
console.log(`Fixed ${count} st.player.corporate.upwardMgmt`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.popularity\b/g,
  () => { count++; return '(st.player.corporate || {}).popularity'; }
);
console.log(`Fixed ${count} st.player.corporate.popularity`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.dignity\b/g,
  () => { count++; return '(st.player.corporate || {}).dignity'; }
);
console.log(`Fixed ${count} st.player.corporate.dignity`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.risk\b/g,
  () => { count++; return '(st.player.corporate || {}).risk'; }
);
console.log(`Fixed ${count} st.player.corporate.risk`);

count = 0;
content = content.replace(
  /st\.player\.corporate\.hair\b/g,
  () => { count++; return '(st.player.corporate || {}).hair'; }
);
console.log(`Fixed ${count} st.player.corporate.hair`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');