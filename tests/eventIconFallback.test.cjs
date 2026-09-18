/**
 * 事件弹框图标兜底 —— 回归网
 *
 * 背景：事件对象有两种 icon 写法（独立字段 / emoji 写在 title 开头）。
 * 弹框原来原样渲染 `${evt.icon}`，遇到第二种就字面输出 "undefined"，
 * 变成「undefined 🚲 路边一辆没锁的共享单车」。
 *
 * 为什么必须建回归网：这个问题**一直存在**，只是那 101 条事件此前从没被触发过。
 * §57/§60/§61 那几轮审计把大量从未触发的事件接回触发链后，它才一起冒出来。
 * 也就是说 —— 它属于「修好一个哑管道会打出一批旧债」这一类，
 * 只要触发链继续被修复，就还会有新事件涌进这个渲染点。守不住就会复发。
 *
 * 断言分三层：
 *   A 源码守卫：渲染点不能再裸写 ${evt.icon}
 *   B 行为断言：拿 data/moral_events.js 的真实 title 全量跑一遍，逐条查
 *      —— 图标不为 "undefined"、不为空、不是中文正文字符，且「图标+标题」拼回去
 *         必须逐字等于原标题（不丢字、不多字）
 *   C 反向对照：故意拿一条坏数据喂进去，断言检测器会报红（防断言恒真）
 *
 * 用法: node tests/eventIconFallback.test.cjs
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');

let pass = 0;
const fails = [];
function ok(name, cond, detail) {
  if (cond) { pass++; return; }
  fails.push(name + (detail ? '  → ' + detail : ''));
}

/* ── 取出被测函数：events_core.js 是经典脚本，整体求值会炸，
      按括号配平切出函数源码单独求值 ─────────────────────────── */
const SRC = read('src/js/core/events_core.js');

function extractFn(src, name) {
  const at = src.indexOf('function ' + name + '(');
  if (at < 0) return null;
  const brace = src.indexOf('{', at);
  let depth = 0, inStr = null, end = -1, inRe = false, prev = '';
  for (let i = brace; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (ch === '\\') { i++; continue; }
      if (ch === inStr) inStr = null;
      continue;
    }
    if (inRe) {
      if (ch === '\\') { i++; continue; }
      if (ch === '/') inRe = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; prev = ch; continue; }
    if (ch === '/' && prev !== '/') {
      const nx = src[i + 1];
      if (nx !== '/' && nx !== '*') { inRe = true; prev = ch; continue; }
    }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (!depth) { end = i + 1; break; } }
    prev = ch;
  }
  return end > 0 ? src.slice(at, end) : null;
}

const fnSrc = extractFn(SRC, 'splitEventIcon');
ok('A1 events_core.js 中存在 splitEventIcon 定义', !!fnSrc);

let splitEventIcon = null;
if (fnSrc) {
  const ctx = vm.createContext({});
  vm.runInContext(fnSrc + '\n;globalThis.__f = splitEventIcon;', ctx);
  splitEventIcon = ctx.__f;
  ok('A2 splitEventIcon 可独立求值', typeof splitEventIcon === 'function');
}

/* A3 渲染点不能裸写 ${evt.icon} */
const bare = /\$\{evt\.icon\}/.test(SRC);
ok('A3 渲染点未裸写 ${evt.icon}', !bare, bare ? '发现裸写，undefined 会直接渲染到界面' : '');
ok('A4 渲染点已改用兜底后的变量', /const _evtHead = splitEventIcon\(evt\)/.test(SRC));

/* ── B 行为断言：拿真实数据全量跑 ───────────────────────── */
const moralSrc = read('src/js/data/moral_events.js');
const titles = [...moralSrc.matchAll(/^\s*title:\s*(["'])((?:\\.|(?!\1).)*)\1/gm)]
  .map((m) => m[2].replace(/\\"/g, '"').replace(/\\'/g, "'"));

ok('B0 从 moral_events.js 抽到 title', titles.length > 50, `实抽 ${titles.length} 条`);

let undefCount = 0, emptyIcon = 0, cjkIcon = 0, lossy = 0, hoisted = 0, fallback = 0;
const samples = [];
for (const t of titles) {
  const r = splitEventIcon({ title: t });
  if (r.icon === 'undefined' || String(r.icon).indexOf('undefined') >= 0) undefCount++;
  if (!r.icon) emptyIcon++;
  // 图标位不该是中文正文（说明没提出 emoji，而是把正文切了一块）
  if (/[\u4e00-\u9fff]/.test(r.icon)) cjkIcon++;
  // 不丢字断言：忽略空白差异后，「图标+标题」必须逐字覆盖原标题。
  // （不能直接比 icon+title === t —— 原文 emoji 后面那个空格是有意去掉的，
  //   图标已经进了独立图标位，中间由 flex gap 负责间隔。）
  if ((r.icon + r.title).replace(/\s+/g, '') !== t.replace(/\s+/g, '')) lossy++;
  if (r.icon === '📜') fallback++; else hoisted++;
  if (samples.length < 4) samples.push(`${r.icon} | ${r.title}`);
}

ok('B1 无一条渲染成 undefined', undefCount === 0, `${undefCount}/${titles.length} 条命中`);
ok('B2 图标位不为空', emptyIcon === 0, `${emptyIcon} 条为空`);
ok('B3 图标位不含中文正文', cjkIcon === 0, `${cjkIcon} 条把正文切进了图标位`);
ok('B4 「图标+标题」拼回后不丢字', lossy === 0, `${lossy} 条对不上`);
ok('B5 确实从 title 头部提到了 emoji（不是全部退化为 📜）',
  hoisted > titles.length * 0.5, `提到 ${hoisted} 条 / 退化 ${fallback} 条`);

console.log('  样本：');
samples.forEach((s) => console.log('    ' + s));
console.log(`  emoji 上提 ${hoisted} 条 / 兜底 📜 ${fallback} 条 / 合计 ${titles.length} 条`);

/* 组合 emoji（零宽连接符序列）不能被拆散 */
const combo = splitEventIcon({ title: '👨‍👩‍👧‍👦 一家人' });
ok('B6 组合 emoji 零宽连接符序列完整',
  combo.icon === '👨‍👩‍👧‍👦', `实得 "${combo.icon}"`);
ok('B6b 组合 emoji 后面的标题被正确剥离', combo.title === '一家人', `实得 "${combo.title}"`);

/* 独立 icon 字段优先 */
const pref = splitEventIcon({ icon: '🎯', title: '🚲 这个 emoji 不该被用' });
ok('B7 有独立 icon 字段时优先用它', pref.icon === '🎯', `实得 "${pref.icon}"`);
ok('B7b 有独立 icon 时不改动 title', pref.title === '🚲 这个 emoji 不该被用');

/* ── C 反向对照：坏数据必须被判红 ───────────────────────── */
function wouldDetect(r) {
  return r.icon === 'undefined' || String(r.icon).indexOf('undefined') >= 0 ||
    !r.icon || /[\u4e00-\u9fff]/.test(r.icon);
}
const badRuns = [
  { icon: undefined, title: 'undefined 🚲 路边一辆没锁的共享单车' },
  { icon: '的', title: '的标题' },
  { icon: '', title: '' },
];
// 把坏数据直接当"旧实现"喂给检测器
const oldImpl = (evt) => ({ icon: String(evt.icon), title: evt.title });
const detected = badRuns.filter((b) => wouldDetect(oldImpl(b))).length;
ok('C1 检测器对旧实现判红（断言不恒真）', detected === badRuns.length,
  `仅 ${detected}/${badRuns.length} 条被判红`);

/* ── 汇总 ─────────────────────────────────────────────── */
console.log('');
if (fails.length) {
  console.log(`✗ eventIconFallback: ${pass} passed / ${fails.length} FAILED`);
  fails.forEach((f) => console.log('   ✗ ' + f));
  process.exit(1);
}
console.log(`✓ eventIconFallback: ${pass} passed / 0 failed`);
