/**
 * 为 render_core.js 中 7 个与 render.js 不一致的函数加条件守卫。
 * 由于 render.js 版本是"新"的（拆分后修改），render_core.js 版本是"旧"的，
 * 在浏览器中 render.js 版本应覆盖 render_core.js 版本。
 * 我们包裹 render_core.js 版本为条件定义，使得 bundle 中不报重定义错误。
 */
const fs = require('fs');

var path = 'src/js/ui/render_core.js';
var src = fs.readFileSync(path, 'utf8');

// 7 个函数名，render_core.js 中需加守卫
var funcs = ['warnStatRow', 'renderLocation', 'renderStreetStats', 'renderWeatherPanel',
             'renderMoralStatus', 'renderReputationBadge', 'getLocationServiceBadges'];

funcs.forEach(function(name) {
  var searchStr = 'function ' + name + '(';
  var idx = src.indexOf(searchStr);
  while (idx !== -1) {
    if (idx === 0 || src[idx - 1] === '\n') {
      // 找到函数体结束
      var braceDepth = 0;
      var inStr = false;
      var strChar = '';
      var i = idx;
      // 找到第一个 {
      while (i < src.length && src[i] !== '{') { i++; }
      if (i >= src.length) { console.log('ERROR: ' + name + ' no brace'); return; }
      braceDepth = 1; i++;
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
      var funcBody = src.substring(idx, i);
      var guarded = 'if(typeof ' + name + '==="undefined"){\n' + funcBody + '\n}';
      src = src.substring(0, idx) + guarded + src.substring(i);
      console.log('Guarded: ' + name);
      break;
    }
    idx = src.indexOf(searchStr, idx + 1);
  }
});

fs.writeFileSync(path, src, 'utf8');
console.log('Done. Updated render_core.js');