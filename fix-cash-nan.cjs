/**
 * Batch fix cash NaN vulnerabilities in event files
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/js/core/cross_system_events.js',
  'src/js/core/events_street_life.js',
  'src/js/core/events_street_survival.js',
  'src/js/core/events_street_wealth.js',
  'src/js/core/events_corp.js',
  'src/js/core/career_path_events.js',
  'src/js/data/moral_events.js',
  'src/js/data/side_hustle_events.js',
  'src/js/core/family_events.js',
];

let totalFixed = 0;

for (const file of files) {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP ${file}: not found`);
    continue;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  let fileFixed = 0;

  // 1. Fix st.resources.cash += N
  content = content.replace(
    /st\.resources\.cash\s*\+=/g,
    () => { count++; return 'st.resources.cash = (st.resources.cash || 0) +'; }
  );
  if (count > 0) { fileFixed += count; console.log(`  ${file}: cash += ${count}`); count = 0; }

  // 2. Fix st.resources.cash -= numeric
  content = content.replace(
    /st\.resources\.cash\s*-=\s*(\d+);/g,
    (match, num) => { count++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${num});`; }
  );
  if (count > 0) { fileFixed += count; console.log(`  ${file}: cash -= numeric ${count}`); count = 0; }

  // 3. Fix st.resources.cash -= variable
  content = content.replace(
    /st\.resources\.cash\s*-=\s*([a-zA-Z_]+(\.[a-zA-Z_]+)*);/g,
    (match, varName) => { count++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${varName});`; }
  );
  if (count > 0) { fileFixed += count; console.log(`  ${file}: cash -= variable ${count}`); count = 0; }

  // 4. Fix st.resources.cash >= N
  content = content.replace(
    /st\.resources\.cash\s*>=/g,
    () => { count++; return '(st.resources.cash || 0) >='; }
  );
  if (count > 0) { fileFixed += count; console.log(`  ${file}: cash >= ${count}`); count = 0; }

  // 5. Fix st.resources.cash < N (not Math.max context)
  content = content.replace(
    /(?<!Math\.max\()(?<!Math\.min\()st\.resources\.cash\s*</g,
    () => { count++; return '(st.resources.cash || 0) <'; }
  );
  if (count > 0) { fileFixed += count; console.log(`  ${file}: cash < ${count}`); count = 0; }

  if (fileFixed > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    totalFixed += fileFixed;
    console.log(`  => ${fileFixed} fixes in ${file}`);
  }
}

console.log(`\nTotal: ${totalFixed} fixes across all files`);