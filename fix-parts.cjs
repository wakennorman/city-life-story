/**
 * Batch fix cash NaN in cross_system_events_part*.js files
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/js/core/cross_system_events_part1.js',
  'src/js/core/cross_system_events_part2.js',
  'src/js/core/cross_system_events_part3.js',
  'src/js/core/cross_system_events_part4.js',
  'src/js/core/cross_system_events_part5.js',
  'src/js/core/cross_system_events_part6.js',
  'src/js/core/cross_system_events_part7.js',
  'src/js/core/cross_system_events_part8.js',
];

let total = 0;

for (const file of files) {
  const fp = path.join(__dirname, file);
  if (!fs.existsSync(fp)) { console.log(`SKIP ${file}`); continue; }
  let c = fs.readFileSync(fp, 'utf8');
  let f = 0;

  // cash +=
  c = c.replace(/st\.resources\.cash\s*\+=/g, () => { f++; return 'st.resources.cash = (st.resources.cash || 0) +'; });
  // cash -= numeric
  c = c.replace(/st\.resources\.cash\s*-=\s*(\d+);/g, (m, n) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${n});`; });
  // cash -= variable
  c = c.replace(/st\.resources\.cash\s*-=\s*([a-zA-Z_]+(\.[a-zA-Z_]+)*);/g, (m, v) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${v});`; });
  // cash >=
  c = c.replace(/st\.resources\.cash\s*>=/g, () => { f++; return '(st.resources.cash || 0) >='; });
  // cash < (not Math.max context)
  c = c.replace(/(?<!Math\.max\()(?<!Math\.min\()st\.resources\.cash\s*</g, () => { f++; return '(st.resources.cash || 0) <'; });

  if (f > 0) {
    fs.writeFileSync(fp, c, 'utf8');
    total += f;
    console.log(`${file}: ${f} fixes`);
  } else {
    console.log(`${file}: clean`);
  }
}
console.log(`\nTotal: ${total} fixes`);