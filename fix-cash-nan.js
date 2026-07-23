/**
 * Fix cash NaN vulnerabilities in cross_system_events.js and events_street_life.js
 *
 * Applies || 0 guards to all unguarded st.resources.cash accesses.
 *
 * Usage: node fix-cash-nan.js
 */

const fs = require('fs');
const path = require('path');

const files = [
  'D:\\Claude Code+DeepSeekV4\\city-life-story\\src\\js\\core\\cross_system_events.js',
  'D:\\Claude Code+DeepSeekV4\\city-life-story\\src\\js\\core\\events_street_life.js',
];

const COMMENT = '// [全系统自洽修复] 域B A类:cash NaN守卫';

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  let fixes = 0;

  // Track lines that already have || 0 guard or typeof guard
  // We'll skip those

  // 1. Fix st.resources.cash -= N (simple number subtraction, not scaleAmount)
  // Pattern: st.resources.cash -= <number>;
  // → st.resources.cash = Math.max(0, (st.resources.cash || 0) - <number>);
  // But NOT st.resources.cash -= scaleAmount(...)
  // Also NOT when already in a Math.max(0, ...) context
  content = content.replace(
    /(st\.resources\.cash)\s*-=\s*(\d+);/g,
    (match, cash, amount) => {
      // Check if already in a Math.max(0, ...) context
      // Look backwards to see if this line follows a Math.max pattern
      // We can't easily check context, so let's check if the line itself
      // is already part of a guarded pattern
      fixes++;
      return `${cash} = Math.max(0, (${cash} || 0) - ${amount}); ${COMMENT}`;
    }
  );

  // 2. Fix st.resources.cash += N (simple addition)
  // → st.resources.cash = (st.resources.cash || 0) + N
  content = content.replace(
    /(st\.resources\.cash)\s*\+=\s*(\d+);/g,
    (match, cash, amount) => {
      fixes++;
      return `${cash} = (${cash} || 0) + ${amount}; ${COMMENT}`;
    }
  );

  // 3. Fix st.resources.cash += earn/var (variable addition)
  content = content.replace(
    /(st\.resources\.cash)\s*\+=\s*(earn(?:2)?|profit|bonus|tip|windfall|amount|compensation|indoorPay|small|reward|pay|totalCashBack|earn\s*\*\s*1\.\d+|earn\s*\*\s*1\.\d)\s*;/g,
    (match, cash, varExpr) => {
      fixes++;
      return `${cash} = (${cash} || 0) + ${varExpr}; ${COMMENT}`;
    }
  );

  // 4. Fix if (st.resources.cash < N) → if ((st.resources.cash || 0) < N)
  content = content.replace(
    /if\s*\(\s*st\.resources\.cash\s*<\s*(\d+)\s*\)/g,
    (match, amount) => {
      fixes++;
      return `if ((st.resources.cash || 0) < ${amount}) ${COMMENT}`;
    }
  );

  // 5. Fix if (st.resources.cash >= N) → if ((st.resources.cash || 0) >= N)
  content = content.replace(
    /if\s*\(\s*st\.resources\.cash\s*>=\s*(\d+)\s*\)/g,
    (match, amount) => {
      fixes++;
      return `if ((st.resources.cash || 0) >= ${amount}) ${COMMENT}`;
    }
  );

  // 6. Fix Math.min(st.resources.cash, N) → Math.min(st.resources.cash || 0, N)
  content = content.replace(
    /Math\.min\(st\.resources\.cash\s*,\s*(\d+)\s*\)/g,
    (match, amount) => {
      fixes++;
      return `Math.min(st.resources.cash || 0, ${amount}) ${COMMENT}`;
    }
  );

  // 7. Fix Math.min(st.resources.cash * 0.3, N) → Math.min((st.resources.cash || 0) * 0.3, N)
  content = content.replace(
    /Math\.min\(st\.resources\.cash\s*\*\s*([\d.]+)\s*,\s*(\d+)\s*\)/g,
    (match, factor, amount) => {
      fixes++;
      return `Math.min((st.resources.cash || 0) * ${factor}, ${amount}) ${COMMENT}`;
    }
  );

  // 8. Fix Math.round(st.resources.cash * N) → Math.round((st.resources.cash || 0) * N)
  content = content.replace(
    /Math\.round\(st\.resources\.cash\s*\*\s*([\d.]+|rate)\)/g,
    (match, factor) => {
      fixes++;
      return `Math.round((st.resources.cash || 0) * ${factor}) ${COMMENT}`;
    }
  );

  // 9. Fix var refund = Math.min(st.resources.cash, 200);
  // This is a common pattern that should be handled by #6 above, but let's also catch
  // the var assignment pattern
  content = content.replace(
    /var\s+(refund|invest|charged|actualCost|loan)\s*=\s*Math\.min\(st\.resources\.cash\s*,\s*(\d+|cost)\)/g,
    (match, varName, amount) => {
      fixes++;
      return `var ${varName} = Math.min(st.resources.cash || 0, ${amount}) ${COMMENT}`;
    }
  );

  // 10. Fix var actualCost = st.resources.cash; (standalone assignment)
  content = content.replace(
    /var\s+(actualCost|charged)\s*=\s*st\.resources\.cash;/g,
    (match, varName) => {
      fixes++;
      return `var ${varName} = st.resources.cash || 0; ${COMMENT}`;
    }
  );

  // 11. Fix (10000 - st.resources.cash) in string context
  content = content.replace(
    /\(\s*\d+\s*-\s*st\.resources\.cash\s*\)/g,
    (match) => {
      fixes++;
      return `(${match.slice(1, -1).replace('st.resources.cash', '(st.resources.cash || 0)')})`;
    }
  );

  // 12. Fix st.resources.cash < 10000 in conditions (not if statements)
  // This handles the conditions function pattern
  content = content.replace(
    /st\.resources\.cash\s*<\s*(\d+)/g,
    (match, amount) => {
      // Skip if already guarded
      if (match.includes('|| 0')) return match;
      fixes++;
      return `(st.resources.cash || 0) < ${amount}`;
    }
  );

  // 13. Fix st.resources.cash >= 50000 in conditions (not if statements)
  content = content.replace(
    /st\.resources\.cash\s*>=\s*(\d+)/g,
    (match, amount) => {
      if (match.includes('|| 0')) return match;
      fixes++;
      return `(st.resources.cash || 0) >= ${amount}`;
    }
  );

  // 14. Fix st.resources.cash -= variable (not scaleAmount)
  content = content.replace(
    /(st\.resources\.cash)\s*-=\s*(saved|cheap|spend|invest|total|refund|actualCost|charged|loan)\s*;/g,
    (match, cash, varName) => {
      fixes++;
      return `${cash} = Math.max(0, (${cash} || 0) - ${varName}); ${COMMENT}`;
    }
  );

  // 15. Fix st.resources.cash += variable (other patterns not caught above)
  content = content.replace(
    /(st\.resources\.cash)\s*\+=\s*(amount|loan|invest|tip|compensation|bonus|indoorPay|pay|earn)\s*;/g,
    (match, cash, varName) => {
      fixes++;
      return `${cash} = (${cash} || 0) + ${varName}; ${COMMENT}`;
    }
  );

  console.log(`File: ${path.basename(filePath)} - ${fixes} fixes applied`);

  // Only write if changes were made
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  → File written`);
  } else {
    console.log(`  → No changes needed`);
  }
}

for (const file of files) {
  fixFile(file);
}

console.log('\nDone.');