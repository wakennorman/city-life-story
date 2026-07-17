/**
 * 为剩余 4 个不同 body 的重复函数加条件守卫
 */
const fs = require('fs');

function guardFunction(filePath, funcName) {
  var src = fs.readFileSync(filePath, 'utf8');
  var search = 'function ' + funcName + '(';
  var idx = src.indexOf(search);
  if (idx === -1) { console.log(funcName + ': not found in ' + filePath); return false; }
  if (idx > 0 && src[idx - 1] !== '\n') { console.log(funcName + ': not at line start'); return false; }

  var braceDepth = 0, inStr = false, strChar = '';
  var i = idx;
  while (i < src.length && src[i] !== '{') i++;
  if (i >= src.length) { console.log(funcName + ': no brace'); return false; }

  braceDepth = 1; i++;
  while (i < src.length && braceDepth > 0) {
    var ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      if (!inStr) { inStr = true; strChar = ch; }
      else if (ch === strChar && src[i - 1] !== '\\') inStr = false;
    } else if (!inStr) {
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
    }
    i++;
  }

  var func = src.substring(idx, i);
  var guarded = 'if (typeof ' + funcName + ' === "undefined") {\n' + func + '\n}';
  var result = src.substring(0, idx) + guarded + src.substring(i);
  fs.writeFileSync(filePath, result, 'utf8');
  console.log('Guarded: ' + funcName + ' in ' + filePath + ' (' + func.length + 'B)');
  return true;
}

var pairs = [
  ['src/js/core/multi_run_memory.js', 'getDeceasedCompanies'],
  ['src/js/ui/corp_ui.js', 'getCompanyIndustryById'],
  ['src/js/phase2/startup_crisis.js', 'getCrisisSummary'],
  ['src/js/ui/daily_report.js', 'getCategoryLabel'],
];

pairs.forEach(function(p) {
  guardFunction(p[0], p[1]);
});

console.log('Done.');