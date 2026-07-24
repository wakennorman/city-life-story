/**
 * Final batch fix for remaining cash NaN vulnerabilities
 */
const fs = require('fs');
const path = require('path');

const files = [
  'src/js/core/insider_trading_events.js',
  'src/js/phase1/actions_extra.js',
];

let total = 0;

for (const file of files) {
  const fp = path.join(__dirname, file);
  if (!fs.existsSync(fp)) { console.log(`SKIP ${file}`); continue; }
  let c = fs.readFileSync(fp, 'utf8');
  let f = 0;

  // cash +=
  c = c.replace(/st\.resources\.cash\s*\+=/g, () => { f++; return 'st.resources.cash = (st.resources.cash || 0) +'; });
  c = c.replace(/state\.resources\.cash\s*\+=/g, () => { f++; return 'state.resources.cash = (state.resources.cash || 0) +'; });

  // cash -= numeric
  c = c.replace(/st\.resources\.cash\s*-=\s*(\d+);/g, (m, n) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${n});`; });
  c = c.replace(/state\.resources\.cash\s*-=\s*(\d+);/g, (m, n) => { f++; return `state.resources.cash = Math.max(0, (state.resources.cash || 0) - ${n});`; });

  // cash -= variable
  c = c.replace(/st\.resources\.cash\s*-=\s*([a-zA-Z_]+(\.[a-zA-Z_]+)*);/g, (m, v) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${v});`; });
  c = c.replace(/state\.resources\.cash\s*-=\s*([a-zA-Z_]+(\.[a-zA-Z_]+)*);/g, (m, v) => { f++; return `state.resources.cash = Math.max(0, (state.resources.cash || 0) - ${v});`; });

  // Math.max(0, cash - X) → Math.max(0, (cash || 0) - X)
  c = c.replace(/Math\.max\(0,\s*st\.resources\.cash\s*-/g, () => { f++; return 'Math.max(0, (st.resources.cash || 0) -'; });

  // cash >=
  c = c.replace(/st\.resources\.cash\s*>=/g, () => { f++; return '(st.resources.cash || 0) >='; });
  c = c.replace(/state\.resources\.cash\s*>=/g, () => { f++; return '(state.resources.cash || 0) >='; });

  // cash < (not Math.max context)
  c = c.replace(/(?<!Math\.max\()(?<!Math\.min\()st\.resources\.cash\s*</g, () => { f++; return '(st.resources.cash || 0) <'; });
  c = c.replace(/(?<!Math\.max\()(?<!Math\.min\()state\.resources\.cash\s*</g, () => { f++; return '(state.resources.cash || 0) <'; });

  // .toLocaleString() on cash
  c = c.replace(/state\.resources\.cash\.toLocaleString\(\)/g, () => { f++; return '(state.resources.cash || 0).toLocaleString()'; });

  // Math.min(st.resources.cash, X) → Math.min(st.resources.cash || 0, X)
  c = c.replace(/Math\.min\(st\.resources\.cash,/g, () => { f++; return 'Math.min((st.resources.cash || 0),'; });
  c = c.replace(/Math\.min\(state\.resources\.cash,/g, () => { f++; return 'Math.min((state.resources.cash || 0),'; });

  if (f > 0) {
    fs.writeFileSync(fp, c, 'utf8');
    total += f;
    console.log(`${file}: ${f} fixes`);
  }
}
console.log(`\nTotal: ${total} fixes`);