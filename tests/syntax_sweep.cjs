// 全量语法体检（单进程 vm.Script，1151 文件约 2 秒）
// 用法: node tests/syntax_sweep.cjs   （仏在仓库根目录执行）
// 背景: R1016b 发现全库 22 个【已挂载】linkage 文件存在 SyntaxError，
//       整个 IIFE 永不执行（注册事件全部不入池）且直接阻断 python build.py。
//       逐文件 spawn  >3min 不可用，改单进程解析。
// 建议纳入开轮例行体检。
const fs = require('fs'), vm = require('vm'), path = require('path');
function walk(d, out = []) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p, out); else if (e.name.endsWith('.js')) out.push(p);
  }
  return out;
}
const files = walk('src/js');
const html = fs.readFileSync('src/index.html', 'utf8');
const broken = [];
for (const f of files) {
  const src = fs.readFileSync(f, 'utf8');
  try { new vm.Script(src, { filename: f }); }
  catch (e) {
    const mounted = html.includes(path.basename(f));
    broken.push({ f, msg: e.message, line: (e.stack.split('\n')[0] || ''), mounted });
  }
}
console.log('总文件', files.length, '语法错误', broken.length);
for (const b of broken) console.log((b.mounted ? '[已挂载] ' : '[未挂载] ') + b.f + ' → ' + b.msg);
// 归纳 typo 模式
const pat = {};
for (const b of broken) {
  const src = fs.readFileSync(b.f, 'utf8');
  for (const m of src.matchAll(/(^|[^"'\w])([a-zA-Z_][a-zA-Z0-9_]*)":"/gm)) pat[m[2]] = (pat[m[2]] || 0) + 1;
}
console.log('\n残缺引号键名统计:', JSON.stringify(pat));
