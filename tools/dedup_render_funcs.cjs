/**
 * 清理 render.js 中与 render_core.js / render_infra.js 重复的函数定义。
 * v3.13 拆分 render.js 时，函数被复制到新文件但未从原文件删除。
 *
 * 使用方式: node tools/dedup_render_funcs.js
 * 安全策略: 只删除函数体完全一致的重复定义，否则报错退出。
 */

const fs = require('fs');

const renderJS = fs.readFileSync('src/js/ui/render.js', 'utf8');
const renderCore = fs.readFileSync('src/js/ui/render_core.js', 'utf8');
const renderInfra = fs.readFileSync('src/js/ui/render_infra.js', 'utf8');

/**
 * 从源码中提取从 startIdx 开始到匹配的 } 结束的完整函数体。
 * 正确处理嵌套 {}、字符串、正则表达式。
 */
function extractFunctionBody(source, startIdx) {
  var braceDepth = 0;
  var inStr = false;
  var strChar = '';
  var inRegex = false;
  var i = startIdx;

  while (i < source.length) {
    var ch = source[i];
    var prev = i > 0 ? source[i - 1] : '';

    if (inStr) {
      if (ch === '\\' && i + 1 < source.length) { i += 2; continue; }
      if (ch === strChar) inStr = false;
    } else if (inRegex) {
      if (ch === '\\' && i + 1 < source.length) { i += 2; continue; }
      if (ch === '/') inRegex = false;
    } else {
      if (ch === "'" || ch === '"' || ch === '`') { inStr = true; strChar = ch; }
      else if (ch === '/' && prev !== ' ' && prev !== '(' && prev !== ',') { /* skip regex */ }
      else if (ch === '{') braceDepth++;
      else if (ch === '}') {
        braceDepth--;
        if (braceDepth === 0) {
          return source.substring(startIdx, i + 1);
        }
      }
    }
    i++;
  }
  return null;
}

/**
 * 从源码中搜索顶层函数声明 'function name('
 * 返回 { name, body, start, end } 或 null
 */
function findNextFunction(source, startIdx) {
  var re = /^function\s+([a-zA-Z_$][\w$]*)\s*\(/gm;
  re.lastIndex = startIdx;
  var m = re.exec(source);
  if (!m) return null;

  var name = m[1];
  var funcStart = m.index;

  // 从 function 声明行找到 { 的位置
  var openBrace = source.indexOf('{', m.index);
  if (openBrace === -1 || openBrace > source.indexOf('\n', m.index) + 500) return null;

  var body = extractFunctionBody(source, openBrace);
  if (!body) return null;

  // 完整函数声明 = 从 function 关键字到闭合 }
  var fullFunc = source.substring(funcStart, openBrace) + body;
  var endIdx = openBrace + body.length;

  return { name: name, body: fullFunc, start: funcStart, end: endIdx };
}

/**
 * 收集文件中所有顶层函数定义
 */
function collectFunctions(source) {
  var funcs = {};
  var pos = 0;
  while (pos < source.length) {
    var f = findNextFunction(source, pos);
    if (!f) break;
    funcs[f.name] = f;
    pos = f.end;
  }
  return funcs;
}

// 收集三个文件的函数
var rFuncs = collectFunctions(renderJS);
var rcFuncs = collectFunctions(renderCore);
var riFuncs = collectFunctions(renderInfra);

// 合并 render_core 和 render_infra 的函数名集合
var canonicalNames = {};
Object.keys(rcFuncs).forEach(function(k) { canonicalNames[k] = 'render_core.js'; });
Object.keys(riFuncs).forEach(function(k) { canonicalNames[k] = 'render_infra.js'; });

// 检查重复
var removable = []; // { name, source, canonical }
var conflicts = [];

Object.keys(rFuncs).forEach(function(name) {
  if (!canonicalNames[name]) return;

  var rFunc = rFuncs[name];
  var canonicalFile = canonicalNames[name];
  var cFunc = rcFuncs[name] || riFuncs[name];

  if (rFunc.body === cFunc.body) {
    removable.push({ name: name, start: rFunc.start, end: rFunc.end, source: 'render.js', canonical: canonicalFile });
  } else {
    conflicts.push(name + ' — body differs between render.js and ' + canonicalFile);
  }
});

// 报告
console.log('=== render.js 重复函数清理 ===\n');
console.log('render.js 函数总数: ' + Object.keys(rFuncs).length);
console.log('render_core.js 函数总数: ' + Object.keys(rcFuncs).length);
console.log('render_infra.js 函数总数: ' + Object.keys(riFuncs).length);
console.log('');
console.log('可安全删除（body 完全一致）: ' + removable.length);
removable.forEach(function(r) { console.log('  ✅ ' + r.name + ' (→' + r.canonical + ')'); });
console.log('');
console.log('需人工审查（body 不一致）: ' + conflicts.length);
conflicts.forEach(function(c) { console.log('  ⚠️ ' + c); });

// 无冲突 → 执行删除
if (conflicts.length > 0) {
  console.log('\n❌ 存在不一致的重复定义，请人工审查后再执行。');
  process.exit(1);
}

if (removable.length === 0) {
  console.log('\n没有可删除的重复定义。');
  process.exit(0);
}

// 从 render.js 中删除（从后往前删，避免偏移）
var newRenderJS = renderJS;
var sorted = removable.slice().sort(function(a, b) { return b.start - a.start; });
sorted.forEach(function(r) {
  newRenderJS = newRenderJS.substring(0, r.start) + newRenderJS.substring(r.end);
});

// 输出
fs.writeFileSync('src/js/ui/render.js', newRenderJS, 'utf8');
console.log('\n✅ 已从 render.js 中删除 ' + removable.length + ' 个重复函数定义。');
console.log('   render.js 大小: ' + (renderJS.length / 1024).toFixed(1) + ' KB → ' + (newRenderJS.length / 1024).toFixed(1) + ' KB');

// 验证
var verifyFuncs = collectFunctions(newRenderJS);
console.log('   render.js 函数数: ' + Object.keys(rFuncs).length + ' → ' + Object.keys(verifyFuncs).length);