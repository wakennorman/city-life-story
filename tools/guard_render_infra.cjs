/**
 * 清理所有剩余的函数重定义：在 render_infra.js 中为与 render.js 重复的函数加条件守卫。
 * 加载顺序 render_core.js→render_infra.js→render.js，render.js 的版本应获胜。
 * render_core.js 已在上轮处理，本轮处理 render_infra.js。
 */
const fs = require('fs');

var files = [
  'src/js/ui/render_infra.js',
];

// 在 build.py 的 inline_js/bundle_js 中已检查每个文件语法，此处只加守卫
files.forEach(function(filePath) {
  var src = fs.readFileSync(filePath, 'utf8');

  // 查找所有顶层函数声明
  var re = /function\s+([a-zA-Z_$][\w$]*)\s*\(/g;
  var match;
  var funcNames = [];
  while ((match = re.exec(src)) !== null) {
    // 确认在行首
    var lineStart = src.lastIndexOf('\n', match.index);
    if (lineStart === -1) lineStart = 0;
    var line = src.substring(lineStart, match.index).trim();
    if (line === '' || line.endsWith(';') || line === '{' || line === '}') {
      funcNames.push(match[1]);
    }
  }

  // 对每个函数，检查是否也存在于 render.js 中
  var renderJS = fs.readFileSync('src/js/ui/render.js', 'utf8');

  // 需要加守卫的函数名
  var toGuard = [];
  funcNames.forEach(function(name) {
    var reRender = new RegExp('function\\s+' + name + '\\s*\\(', 'm');
    if (reRender.test(renderJS)) {
      toGuard.push(name);
    }
  });

  console.log(filePath + ': ' + funcNames.length + ' functions, ' + toGuard.length + ' shared with render.js');

  // 为每个共享函数加守卫
  var result = src;
  var modified = false;
  toGuard.forEach(function(name) {
    var searchStr = 'function ' + name + '(';
    var idx = result.indexOf(searchStr);
    while (idx !== -1) {
      if (idx === 0 || result[idx - 1] === '\n') {
        // 标记需要守卫
        // 把 'function name(...' 替换为 'if(typeof name==="undefined"){\nfunction name(...'
        // 并在函数结束后加 '}'
        // 找到函数体结束（匹配 }）
        var braceDepth = 0, inStr = false, strChar = '';
        var i = idx;
        while (i < result.length && result[i] !== '{') i++;
        if (i >= result.length) return;
        var bodyStart = i;
        braceDepth = 1; i++;
        while (i < result.length && braceDepth > 0) {
          var ch = result[i];
          if (ch === '"' || ch === "'" || ch === '`') {
            if (!inStr) { inStr = true; strChar = ch; }
            else if (ch === strChar && result[i-1] !== '\\') inStr = false;
          } else if (!inStr) {
            if (ch === '{') braceDepth++;
            else if (ch === '}') braceDepth--;
          }
          i++;
        }
        var funcEnd = i;
        var funcBody = result.substring(idx, funcEnd);
        var guarded = 'if(typeof ' + name + '==="undefined"){\n' + funcBody + '\n}';
        result = result.substring(0, idx) + guarded + result.substring(funcEnd);
        modified = true;
        break;
      }
      idx = result.indexOf(searchStr, idx + 1);
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, result, 'utf8');
    console.log('  Guarded ' + toGuard.length + ' functions');
  } else {
    console.log('  No changes needed');
  }
});