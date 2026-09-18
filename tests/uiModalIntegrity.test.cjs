/**
 * UI 弹窗与职业面板完整性 —— 回归网
 *
 * 守三类会被静默复发的结构性问题（修之前它们都能在 check:js / check:events /
 * test:unit 全绿的情况下长期存活，因为三层门禁都是 node vm 无头跑逻辑，
 * **整个 DOM 交互层零覆盖**）：
 *
 *  ① ConditionSystem.showModal 无限自递归
 *     condition_system.js 被 IIFE 包裹，内部声明了 `function showModal(results, options)`。
 *     这个声明在 IIFE 作用域里**遮蔽**了 modal.js 的全局 window.showModal，
 *     于是原代码的守卫 `if (typeof showModal !== "function") return;` 判断的是它自己（恒真），
 *     末尾的 `showModal({...})` 调用也是它自己 → RangeError: Maximum call stack size exceeded。
 *     表现：玩家点「⚠️ 条件不足，点击查看详情」毫无反应。
 *
 *  ② modal.js 在「已有弹窗」时静默丢弃新弹窗
 *     按钮处理器是「先跑 callback、后移除 overlay」的顺序，
 *     所以任何「弹窗里点按钮 → 开另一个弹窗」的流程，新弹窗必然在旧 overlay
 *     仍存在时发起 → 被静默 return 吞掉：不报错、不留消息、不改状态。
 *     表现：饥饿临界框点「🍳 在家做饭」，彻底无反应。
 *     修复方式：改为排队，当前弹窗关闭后自动补显示。
 *
 *  ③ 职业面板按钮的数值文案与实现不符 / 门槛藏在函数内部
 *     加班副标题写「业绩+3」实现给 +5；调休写「倦怠-8」实现给 -25；
 *     调休门槛（在职≥20天 / 每30天1次）藏在 careerTakeBreak 内部 early-return，
 *     按钮恒为可点 → 点了只弹一条易忽略的消息 → 玩家记为「点击调休没反应」。
 *
 * 断言分四层：
 *   A 行为断言：真跑一遍 condition_system.js（vm 沙箱），断言全局 showModal 被调用
 *     —— 自递归会在这里以 RangeError 暴露，是真正的行为检测而非字符串匹配
 *   B 反向对照：故意把「旧写法」喂给同一个检测器，断言它会报红（防断言恒真）
 *   C 源码守卫：modal.js 必须入队而非静默丢弃
 *   D 文案守卫：职业面板按钮的数值必须与实现一致、门槛必须显式渲染
 *
 * 用法: node tests/uiModalIntegrity.test.cjs
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

/* ══════════════════════════════════════════════════════════════
   A. 行为断言 —— 在 vm 沙箱里真跑 condition_system.js
   ══════════════════════════════════════════════════════════════ */

/** 用同一套沙箱形状求值一段源码，返回 { showModalCalls, error, ctx } */
function runConditionSystem(src) {
  const calls = [];
  const sandbox = {
    console: { log() {}, warn() {}, error() {} },
    window: {},
    StateManager: { addMessage() {} },
    // 这个 sandbox 里的 showModal 扮演 modal.js 的真弹窗
    showModal: function (opts) { calls.push(opts); },
  };
  sandbox.window.showModal = sandbox.showModal;
  const ctx = vm.createContext(sandbox);
  let error = null;
  try {
    vm.runInContext(src, ctx, { filename: 'condition_system.js' });
  } catch (e) {
    error = e;
  }
  return { calls, error, ctx, sandbox };
}

const CS_SRC = read('src/js/core/condition_system.js');
const csRun = runConditionSystem(CS_SRC);
ok('A1 condition_system.js 能被求值（无语法/引用错误）', csRun.error === null,
  csRun.error && csRun.error.message);
ok('A2 window.ConditionSystem 已导出', !!(csRun.ctx && csRun.ctx.window && csRun.ctx.window.ConditionSystem));

if (!csRun.error && csRun.ctx.window && csRun.ctx.window.ConditionSystem) {
  const CS = csRun.ctx.window.ConditionSystem;
  ok('A3 ConditionSystem.showModal 是函数', typeof CS.showModal === 'function');
  ok('A4 ConditionSystem.showModal 与全局 showModal 不是同一个函数（遮蔽隐患的前提）',
    CS.showModal !== csRun.sandbox.showModal);

  const results = [
    { label: '体质≥50', ok: false, current: 42, required: 50 },
    { label: '智力≥30', ok: true, current: 40, required: 30 },
  ];
  let callErr = null;
  try {
    CS.showModal(results, { icon: '🚚', subtitle: '物流快递 — 快递员', passText: 'p', failText: 'f' });
  } catch (e) {
    callErr = e;
  }
  ok('A5 调用 ConditionSystem.showModal 不抛异常（自递归会抛 RangeError）',
    callErr === null, callErr && callErr.name + ': ' + callErr.message);
  ok('A6 真弹窗（全局 showModal）恰好被调用 1 次', csRun.calls.length === 1,
    '实际 ' + csRun.calls.length + ' 次 —— 0 次说明被吞/早退，>1 次说明递归');
  const arg = csRun.calls[0];
  ok('A7 传给真弹窗的是新式 {title, body, buttons} 对象',
    !!arg && typeof arg === 'object' && typeof arg.title === 'string' && typeof arg.body === 'string' &&
    Array.isArray(arg.buttons),
    JSON.stringify(arg && Object.keys(arg)));
  ok('A8 条件不足时标题为「❌ 条件不足」', !!arg && arg.title.indexOf('条件不足') >= 0,
    arg && arg.title);
  ok('A9 body 里包含两条条件行', !!arg && arg.body.indexOf('体质') >= 0 && arg.body.indexOf('智力') >= 0);
  ok('A10 全部满足时标题为「✅ 条件检查」', (function () {
    csRun.calls.length = 0;
    CS.showModal([{ label: 'a', ok: true, current: 1, required: 1 }], {});
    return csRun.calls.length === 1 && csRun.calls[0].title.indexOf('条件检查') >= 0;
  })());
}

/* ── B. 反向对照：把「旧写法」喂给同一检测器，必须报红 ── */
const LEGACY_RECURSIVE = `
(function () {
  "use strict";
  function showModal(results, options) {
    if (typeof showModal !== "function") return;
    options = options || {};
    var title = options.title || "T";
    var body = "<div>" + results.length + "</div>";
    showModal({ title: title, body: body, buttons: [] });
  }
  window.ConditionSystem = { showModal: showModal };
})();
`;
const legacyRun = runConditionSystem(LEGACY_RECURSIVE);
let legacyCaught = false;
try {
  legacyRun.ctx.window.ConditionSystem.showModal([{ label: 'x', ok: false }], {});
} catch (e) {
  legacyCaught = e && (e instanceof RangeError || /call stack/i.test(e.message));
}
ok('B1 反向对照：旧的递归写法确实会爆栈（证明 A5 不是恒真）', legacyCaught);
ok('B2 反向对照：旧的递归写法下真弹窗 0 次调用', legacyRun.calls.length === 0,
  '实际 ' + legacyRun.calls.length);

/* ══════════════════════════════════════════════════════════════
   C. modal.js —— 已有弹窗时必须排队，不得静默丢弃
   ══════════════════════════════════════════════════════════════ */

/**
 * 检测器：返回问题清单（空数组 = 通过）
 * 抽成函数是为了能用「旧的坏源码」做反向对照，防止断言恒真。
 */
function checkModalQueue(src) {
  const problems = [];
  if (src.indexOf('function showModalImpl(') < 0) {
    problems.push('找不到 showModalImpl');
    return problems;
  }
  // 1) 静默丢弃的原始形态：existingOverlay 分支里只有 return
  const anchor = 'const existingOverlay = document.querySelector(".modal-overlay");';
  const at = src.indexOf(anchor);
  if (at < 0) {
    problems.push('找不到 existingOverlay 判定');
  } else {
    const tail = src.slice(at, at + 900);
    const braceAt = tail.indexOf('{');
    let depth = 0, end = -1;
    for (let i = braceAt; i < tail.length; i++) {
      if (tail[i] === '{') depth++;
      else if (tail[i] === '}') { depth--; if (depth === 0) { end = i; break; } }
    }
    const block = end > 0 ? tail.slice(braceAt, end + 1) : tail.slice(0, 300);
    if (block.indexOf('_modalQueue.push') < 0) {
      problems.push('existingOverlay 分支里没有入队（_modalQueue.push）');
    }
    if (/^\{\s*return;\s*\}$/.test(block.replace(/\s+/g, ' ').replace(') {', '){').trim()) ||
        /^\{return;\}$/.test(block.replace(/\s+/g, ''))) {
      problems.push('existingOverlay 分支是纯 return（静默丢弃回归）');
    }
  }
  // 2) 队列基础设施
  if (src.indexOf('function _flushModalQueue(') < 0) problems.push('缺少 _flushModalQueue');
  if (src.indexOf('var _modalQueue = [];') < 0) problems.push('缺少 _modalQueue 声明');
  // 3) 必须在 overlay 被移除后触发补显示（否则排队的弹窗永远不出现）
  if (src.indexOf('MutationObserver') < 0) problems.push('缺少 MutationObserver（无法感知 overlay 移除）');
  if (src.indexOf('"modal-overlay"') < 0 && src.indexOf("'modal-overlay'") < 0) {
    problems.push('MutationObserver 未监听 modal-overlay');
  }
  // 4) 必须有上限与过期，防止陈旧弹窗事后突然弹出
  if (src.indexOf('_MODAL_QUEUE_MAX') < 0) problems.push('缺少队列长度上限');
  if (src.indexOf('_MODAL_QUEUE_TTL') < 0) problems.push('缺少队列过期时间');
  if (src.indexOf('_queuedAt') < 0) problems.push('缺少入队时间戳');
  return problems;
}

const MODAL_SRC = read('src/js/ui/modal.js');
const modalProblems = checkModalQueue(MODAL_SRC);
ok('C1 modal.js 的弹窗队列实现完整', modalProblems.length === 0, modalProblems.join(' | '));

// 反向对照：把旧的静默丢弃写法喂进去，检测器必须报红
const LEGACY_SILENT = `
function showModalImpl({ title, body, buttons = [] }) {
  title = title || "提示";
  body = body || "";
  const existingOverlay = document.querySelector(".modal-overlay");
  if (existingOverlay) {
    return;
  }
}
`;
const legacyProblems = checkModalQueue(LEGACY_SILENT);
ok('C2 反向对照：旧的静默丢弃写法会被检测器报红', legacyProblems.length > 0,
  '检测器没报红 —— 断言可能恒真');

/* ══════════════════════════════════════════════════════════════
   D. 职业面板 —— 数值文案与实现一致 + 门槛显式渲染
   ══════════════════════════════════════════════════════════════ */

const CAREER_SRC = read('src/js/ui/career_dev.js');

/** 取 careerWorkAction('类型') 按钮附近的一段源码窗口 */
function nearAction(src, type, span = 420) {
  const key = "careerWorkAction(\\'" + type + "\\')";
  let at = src.indexOf(key);
  if (at < 0) at = src.indexOf("careerWorkAction('" + type + "')");
  if (at < 0) return '';
  return src.slice(Math.max(0, at - span), at + span);
}

// 加班：实现给 业绩+5（原副标题错写 +3）
const overtimeWin = nearAction(CAREER_SRC, 'overtime');
ok('D1 加班按钮标注「业绩+5」（与 careerWorkAction 实现一致）',
  overtimeWin.indexOf('业绩+5') >= 0, '未找到 业绩+5');
ok('D2 加班按钮不再标注错误值「业绩+3」',
  overtimeWin.indexOf('业绩+3') < 0, '仍存在 业绩+3');
ok('D3 加班按钮披露副作用「倦怠+5」与「健康-2」',
  overtimeWin.indexOf('倦怠+5') >= 0 && overtimeWin.indexOf('健康-2') >= 0);

// 做项目：实现给 倦怠+3
const projectWin = nearAction(CAREER_SRC, 'project');
ok('D4 做项目按钮披露「倦怠+3」', projectWin.indexOf('倦怠+3') >= 0);

// 冲刺KPI：实现给 倦怠+6 / 资源+5 / 声誉+3
const kpiWin = nearAction(CAREER_SRC, 'kpi');
ok('D5 冲刺KPI按钮披露「倦怠+6」「行业资源+5」「声誉+3」',
  kpiWin.indexOf('倦怠+6') >= 0 && kpiWin.indexOf('行业资源+5') >= 0 && kpiWin.indexOf('声誉+3') >= 0);

// 调休：实现给 倦怠-25 / 心情+5 / 业绩-2（原副标题错写 -8）
const breakAt = CAREER_SRC.indexOf('onclick="careerTakeBreak()"');
const breakWin = breakAt >= 0 ? CAREER_SRC.slice(Math.max(0, breakAt - 500), breakAt + 200) : '';
ok('D6 调休按钮标注「倦怠-25」（与 careerTakeBreak 实现一致）',
  breakWin.indexOf('倦怠-25') >= 0, breakWin ? '未找到 倦怠-25' : '未找到调休按钮');
ok('D7 调休按钮不再标注错误值「倦怠-8」', breakWin.indexOf('倦怠-8') < 0);
ok('D8 调休按钮披露代价「业绩-2」', breakWin.indexOf('业绩-2') >= 0);

// 门槛透明化：不满足时必须 disabled + 写明原因，而不是恒可点后 early-return
ok('D9 调休按门槛渲染（存在 disabled 分支）',
  CAREER_SRC.indexOf('调休需在职≥20天') >= 0,
  '未找到「调休需在职≥20天」的门槛文案');
ok('D10 调休门槛文案写明所需天数',
  CAREER_SRC.indexOf('需在职20天') >= 0);
ok('D11 调休冷却也显式渲染（「还需N天」）',
  CAREER_SRC.indexOf('还需') >= 0 && CAREER_SRC.indexOf('_breakCooldownLeft') >= 0);

/* ══════════════════════════════════════════════════════════════
   E. 跳槽机会门槛 + 在职天数格式
   ══════════════════════════════════════════════════════════════ */

// E1~E3 源码守卫：跳槽机会必须先自查门槛，不达标的按钮禁用并写明原因
const OFFER_AT = CAREER_SRC.indexOf('🔍 跳槽机会');
const OFFER_WIN = OFFER_AT >= 0 ? CAREER_SRC.slice(OFFER_AT, OFFER_AT + 2600) : '';
ok('E1 跳槽机会区块存在', OFFER_AT >= 0);
ok('E2 跳槽机会渲染前自查门槛（checkCareerPromotion）',
  OFFER_WIN.indexOf('checkCareerPromotion') >= 0, '未找到门槛自查');
ok('E3 未达标 offer 的接受按钮为 disabled',
  OFFER_WIN.indexOf('disabled title="不满足该职位门槛') >= 0);
ok('E4 未达标 offer 列出缺哪些条件（renderPromotionReqs）',
  OFFER_WIN.indexOf('renderPromotionReqs') >= 0);

/* E5 行为断言：_fmtCareerDays 对任何非零输入都不能格式化成 0
   —— 这是原 bug 的本质（180天→「0年」、25天→「0个月」） */
function extractFn(src, name) {
  const at = src.indexOf('function ' + name + '(');
  if (at < 0) return null;
  const brace = src.indexOf('{', at);
  if (brace < 0) return null;
  let depth = 0, inStr = null, esc = false, end = -1;
  for (let i = brace; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === inStr) inStr = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inStr = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) { end = i; break; } }
  }
  if (end < 0) return null;
  return src.slice(at, end + 1);
}

const fmtSrc = extractFn(CAREER_SRC, '_fmtCareerDays');
ok('E5 _fmtCareerDays 函数存在', !!fmtSrc);
if (fmtSrc) {
  const ctx = vm.createContext({});
  vm.runInContext(fmtSrc + '\nthis.__fmt = _fmtCareerDays;', ctx);
  const fmt = ctx.__fmt;
  ok('E6 _fmtCareerDays 可调用', typeof fmt === 'function');
  if (typeof fmt === 'function') {
    ok('E7 180天 → 6个月（不是「0年」）', fmt(180) === '6个月', fmt(180));
    ok('E8 25天 → 25天（不是「0个月」）', fmt(25) === '25天', fmt(25));
    ok('E9 365天 → 1年', fmt(365) === '1年', fmt(365));
    ok('E10 1095天 → 3年', fmt(1095) === '3年', fmt(1095));
    ok('E11 1825天 → 5年', fmt(1825) === '5年', fmt(1825));
    ok('E12 0 / undefined → 0天', fmt(0) === '0天' && fmt(undefined) === '0天');

    // 不变量：源码里每个真实 reqWorkDays 都不能被格式化成 0 开头
    const allReq = (CAREER_SRC.match(/reqWorkDays:\s*(\d+)/g) || [])
      .map((s) => parseInt(s.replace(/\D/g, ''), 10))
      .filter((n) => n > 0);
    const zeroed = allReq.filter((n) => /^0/.test(fmt(n)));
    ok('E13 所有 reqWorkDays（' + allReq.length + ' 个）都不会被格式化成 0 开头',
      zeroed.length === 0, '塌成 0 的有: ' + zeroed.join(','));

    // 反向对照：旧实现必然塌零（证明 E13 不是恒真）
    const legacyFmt = (d) => Math.floor(d / 365) + '年';
    ok('E14 反向对照：旧实现「Math.floor(d/365)+年」对 180 确实塌成 0年',
      legacyFmt(180) === '0年', legacyFmt(180));
  }
}

// E15 旧的「写死年」显示写法不得回归
ok('E15 晋升详情不再写死「Math.floor(reqWorkDays / 365) + "年"」',
  CAREER_SRC.indexOf('Math.floor(level.reqWorkDays / 365) + "年"') < 0);
ok('E16 职业路线预览不再写死「Math.floor(lv.reqWorkDays / 365) + "年"」',
  CAREER_SRC.indexOf('Math.floor(lv.reqWorkDays / 365) + "年"') < 0);

/* ── 结果 ── */
console.log('通过 ' + pass + ' / 失败 ' + fails.length);
if (fails.length) {
  console.log('\n失败项：');
  fails.forEach((f) => console.log('  ❌ ' + f));
  process.exit(1);
}
