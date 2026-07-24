/**
 * Fix startup_competition.js cashReserve NaN guards
 */
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/js/data/startup_competition.js');
let content = fs.readFileSync(filePath, 'utf8');
let count = 0;

// Fix company.cashReserve < X → (company.cashReserve || 0) < X
content = content.replace(
  /company\.cashReserve\s*</g,
  () => { count++; return '(company.cashReserve || 0) <'; }
);
console.log(`Fixed ${count} cashReserve <`);

// Fix company.cashReserve >= X → (company.cashReserve || 0) >= X
count = 0;
content = content.replace(
  /company\.cashReserve\s*>=\s*/g,
  () => { count++; return '(company.cashReserve || 0) >= '; }
);
console.log(`Fixed ${count} cashReserve >=`);

// Fix company.cashReserve -= X → Math.max(0, (company.cashReserve || 0) - X)
count = 0;
content = content.replace(
  /company\.cashReserve\s*-=\s*(\d+);/g,
  (match, num) => { count++; return `company.cashReserve = Math.max(0, (company.cashReserve || 0) - ${num});`; }
);
console.log(`Fixed ${count} cashReserve -= numeric`);

count = 0;
content = content.replace(
  /company\.cashReserve\s*-=\s*([a-zA-Z_]+);/g,
  (match, varName) => { count++; return `company.cashReserve = Math.max(0, (company.cashReserve || 0) - ${varName});`; }
);
console.log(`Fixed ${count} cashReserve -= variable`);

// Fix company.cashReserve += X → (company.cashReserve || 0) + X
count = 0;
content = content.replace(
  /company\.cashReserve\s*\+=\s*([a-zA-Z_]+)/g,
  (match, varName) => { count++; return `company.cashReserve = (company.cashReserve || 0) + ${varName}`; }
);
console.log(`Fixed ${count} cashReserve +=`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done!');