/**
 * Fix remaining investment.js cash NaN in division patterns
 */
const fs = require('fs');
const path = require('path');

const fp = path.join(__dirname, 'src/js/phase2/investment.js');
let c = fs.readFileSync(fp, 'utf8');
let f = 0;

// Fix s.resources.cash / price
c = c.replace(/s\.resources\.cash\s*\/\s*mkt\.price/g, () => { f++; return '(s.resources.cash || 0) / mkt.price'; });
c = c.replace(/s\.resources\.cash\s*\/\s*price/g, () => { f++; return '(s.resources.cash || 0) / price'; });

// Fix StateManager.getState().resources.cash / price
c = c.replace(/StateManager\.getState\(\)\.resources\.cash\s*\/\s*price/g, () => { f++; return '(StateManager.getState().resources.cash || 0) / price'; });

fs.writeFileSync(fp, c, 'utf8');
console.log(`Fixed ${f} patterns`);
console.log('Done!');