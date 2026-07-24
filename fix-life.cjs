/**
 * Fix life_decisions.js cash NaN vulnerabilities
 */
const fs = require('fs');
const path = require('path');
const fp = path.join(__dirname, 'src/js/core/life_decisions.js');
let c = fs.readFileSync(fp, 'utf8');
let f = 0;

// Math.max(0, state.resources.cash - X) → Math.max(0, (state.resources.cash || 0) - X)
c = c.replace(/Math\.max\(0,\s*state\.resources\.cash\s*-/g, () => { f++; return 'Math.max(0, (state.resources.cash || 0) -'; });

// state.resources.cash += X → (state.resources.cash || 0) + X
c = c.replace(/state\.resources\.cash\s*\+=/g, () => { f++; return 'state.resources.cash = (state.resources.cash || 0) +'; });

// state.resources.cash >= X → (state.resources.cash || 0) >= X
c = c.replace(/state\.resources\.cash\s*>=/g, () => { f++; return '(state.resources.cash || 0) >='; });

fs.writeFileSync(fp, c, 'utf8');
console.log(`Fixed ${f} patterns`);