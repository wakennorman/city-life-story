/**
 * 从 render_infra.js 删除与 render.js 重复的函数声明。
 * 按位置从高到低删除（防止索引漂移）。
 */
const fs = require('fs');

var infra = fs.readFileSync('src/js/ui/render_infra.js', 'utf8');
var renderJS = fs.readFileSync('src/js/ui/render.js', 'utf8');

// 找到 render_infra.js 中所有顶层函数的位置和名称
var funcs = [];
var re = /^function\s+([a-zA-Z_$][\w$]*)\s*\(/gm;
var m;
while ((m = re.exec(infra)) !== null) {
  funcs.push({ name: m[1], start: m.index });
}

// 筛选只在 render.js 中也存在的函数
var toRemove = funcs.filter(function(f) {
  return new RegExp('^function\\s+' + f.name + '\\s*\\(', 'm').test(renderJS);
});

console.log('render_infra.js 函数总数: ' + funcs.length);
console.log('与 render.js 共享（待删除）: ' + toRemove.length);
toRemove.forEach(function(f) { console.log('  ' + f.name + ' @ ' + f.start); });

// 从高到低排序
toRemove.sort(function(a, b) { return b.start - a.start; });

var result = infra;
toRemove.forEach(function(f) {
  var idx = result.indexOf('function ' + f.name + '(');
  // 确认在行首
  if (idx > 0 && result[idx - 1] !== '\n') {
    // 尝试查找精确位置
    idx = f.start;
  }
  // 找闭合 }
  var braceDepth = 0, inStr = false, strChar = '';
  var i = idx;
  while (i < result.length && result[i] !== '{') i++;
  if (i >= result.length) { console.log('ERROR no brace for ' + f.name); return; }
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
  result = result.substring(0, idx) + result.substring(i);
});

// 清理多余空行
result = result.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync('src/js/ui/render_infra.js', result, 'utf8');
console.log('已删除 ' + toRemove.length + ' 个重复函数');
console.log('大小: ' + (infra.length/1024).toFixed(1) + ' KB → ' + (result.length/1024).toFixed(1) + ' KB');