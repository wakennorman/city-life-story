/**
 * 清理 render.js 中与 render_core.js 完全一致的重复函数定义。
 * 使用字符级 brace 计数器（支持嵌套/字符串/同一行多 brace）。
 */
const fs = require('fs');

const src = fs.readFileSync('src/js/ui/render.js', 'utf8');

const safeToRemove = [
  'formatIdAsDisplayName', 'getUiDisplayName', 'renderHeader', 'renderFundsHeader',
  'renderDebtHeader', 'initCashCarousel', 'renderSidebar', 'renderAccountingIntel',
  'renderEduSection', 'renderDreamSection', 'renderDebtInfo', 'renderCorporateStats',
  'renderNeedsBars', 'renderHeaderContext', 'getHousingUpgradeTip', 'appendLocationServicesStrip',
];

// 从 src 中删除从 startIdx 开始到匹配 } 的完整函数体
function removeFunction(src, startIdx) {
  var braceDepth = 0;
  var inStr = false;
  var strChar = '';
  var i = startIdx;

  // 找到第一个 {
  while (i < src.length && src[i] !== '{') { i++; }
  if (i >= src.length) return null;

  braceDepth = 1;
  i++;

  while (i < src.length && braceDepth > 0) {
    var ch = src[i];
    if (ch === '"' || ch === "'" || ch === '`') {
      if (!inStr) { inStr = true; strChar = ch; }
      else if (ch === strChar && src[i-1] !== '\\') { inStr = false; }
    } else if (!inStr) {
      if (ch === '{') braceDepth++;
      else if (ch === '}') braceDepth--;
    }
    i++;
  }

  // 从 "function name(" 到匹配的 }
  var endIdx = i;
  return src.substring(0, startIdx) + src.substring(endIdx);
}

var result = src;
safeToRemove.forEach(function(name) {
  // 查找 "function name(" 的起始位置
  var searchStr = 'function ' + name + '(';
  var idx = result.indexOf(searchStr);
  while (idx !== -1) {
    // 检查是否在行首（或前一个字符是换行）
    if (idx === 0 || result[idx - 1] === '\n') {
      var newResult = removeFunction(result, idx);
      if (newResult !== null) {
        result = newResult;
        break;
      }
    }
    idx = result.indexOf(searchStr, idx + 1);
  }
});

fs.writeFileSync('src/js/ui/render.js', result, 'utf8');
console.log('Cleaned render.js: ' + (src.length / 1024).toFixed(1) + ' KB -> ' + (result.length / 1024).toFixed(1) + ' KB');
console.log('Removed ' + safeToRemove.length + ' duplicate functions.');