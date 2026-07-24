/**
 * Fix news.js cash NaN vulnerabilities
 */
const fs = require('fs');
const path = require('path');
const fp = path.join(__dirname, 'src/js/data/news.js');
let c = fs.readFileSync(fp, 'utf8');
let f = 0;

// cash +=
c = c.replace(/st\.resources\.cash\s*\+=/g, () => { f++; return 'st.resources.cash = (st.resources.cash || 0) +'; });
c = c.replace(/state\.resources\.cash\s*\+=/g, () => { f++; return 'state.resources.cash = (state.resources.cash || 0) +'; });

// cash -= numeric
c = c.replace(/st\.resources\.cash\s*-=\s*(\d+);/g, (m, n) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${n});`; });

// cash -= variable
c = c.replace(/st\.resources\.cash\s*-=\s*([a-zA-Z_]+);/g, (m, v) => { f++; return `st.resources.cash = Math.max(0, (st.resources.cash || 0) - ${v});`; });
c = c.replace(/state\.resources\.cash\s*-=\s*([a-zA-Z_]+);/g, (m, v) => { f++; return `state.resources.cash = Math.max(0, (state.resources.cash || 0) - ${v});`; });

// Math.max(0, cash - X) → Math.max(0, (cash || 0) - X)
c = c.replace(/Math\.max\(0,\s*st\.resources\.cash\s*-/g, () => { f++; return 'Math.max(0, (st.resources.cash || 0) -'; });
c = c.replace(/Math\.max\(0,\s*state\.resources\.cash\s*-/g, () => { f++; return 'Math.max(0, (state.resources.cash || 0) -'; });

// cash <
c = c.replace(/(?<!Math\.max\()(?<!Math\.min\()st\.resources\.cash\s*</g, () => { f++; return '(st.resources.cash || 0) <'; });

fs.writeFileSync(fp, c, 'utf8');
console.log(`Fixed ${f} patterns`);