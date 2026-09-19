/**
 * 浏览器探针共享 boot —— 把游戏推进到「#app 已显示、存档已初始化」的可交互状态
 *
 * 【为什么必须共享】
 * 只做 `#title-screen 隐藏 + newGame()` 是**不够**的：
 *   index.html 里 `#app` 是 `display:none` 内联样式，
 *   真实流程（main.js:1986）会同时把 `#welcome-screen` 藏掉、把 `#app` 显出来。
 * 漏掉这步 → `#main` 高度为 0 → 所有 getBoundingClientRect 全是 0，
 * 于是「消息日志不可见」「按钮在视口外」这类结论全是**探针伪影**，不是游戏问题。
 */
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

/** 给 page 装好错误收集 */
function attachErrorSink(page) {
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + String(e.message).slice(0, 220)));
  page.on('console', (m) => {
    if (m.type() === 'error') {
      const t = m.text();
      /* 静态服务下的噪声，与被测逻辑无关，滤掉降噪。
         ★ 2026-09-19 扩了过滤范围：原来只滤 4xx，实测还会出现 500
         （本地服务没有的路由/资源），以及 CORS、ERR_FAILED。
         不过滤的话，每个脚本的"无报错"断言都得自己写白名单，
         而且报出来的"失败"其实是环境问题 —— 属于**误导性红灯**，
         比漏报更浪费时间（会让人去查根本不存在的 bug）。 */
      if (/36kr|CORS policy|net::ERR_|status of \d\d\d/i.test(t)) return;
      errs.push('CONSOLE: ' + t.slice(0, 220));
    }
  });
  return errs;
}

/** 页面内执行的 boot 片段（字符串，供 page.evaluate 用） */
const BOOT_SNIPPET = `(function () {
  var log = [];
  function step(name, fn) { try { fn(); } catch (e) { log.push(name + ': ' + e.message); } }
  step('welcome', function () { var w = document.getElementById('welcome-screen'); if (w) w.style.display = 'none'; });
  step('app', function () { var a = document.getElementById('app'); if (a) a.style.display = ''; });
  step('newGame', function () { StateManager.newGame(); });
  step('prices', function () { if (typeof initializePrices === 'function') initializePrices(); });
  step('social', function () { if (typeof ensureSocialNetworkState === 'function') ensureSocialNetworkState(StateManager.getState()); });
  step('reputation', function () { if (typeof initReputation === 'function') initReputation(StateManager.getState()); });
  step('render', function () { if (typeof renderAll === 'function') renderAll(); });
  try { if (typeof gameStarted !== 'undefined') gameStarted = true; } catch (e) {}
  // 布局自检：这一步能立刻暴露 boot 是否成功
  var m = document.getElementById('main');
  return { log: log, mainH: m ? Math.round(m.getBoundingClientRect().height) : -1,
           appDisplay: (document.getElementById('app') || {}).style ? document.getElementById('app').style.display : null };
})()`;

/** 关闭所有弹窗（用按钮文案优先，兜底直接移除） */
async function dismissModals(page, max = 8) {
  for (let i = 0; i < max; i++) {
    const n = await page.evaluate(() => document.querySelectorAll('.modal-overlay').length);
    if (!n) break;
    await page.evaluate(() => {
      const ov = document.querySelector('.modal-overlay');
      if (!ov) return;
      const btns = [...ov.querySelectorAll('button')];
      const hit = btns.find((b) => /知道了|确定|关闭|跳过|取消|好的|OK|继续/.test(b.textContent || '')) || btns[btns.length - 1];
      if (hit) hit.click(); else ov.remove();
    });
    await new Promise((r) => setTimeout(r, 500));
  }
}

/** 完整 boot：加载 → 初始化 → 校验布局高度 */
async function boot(page, url) {
  await page.goto(url, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));
  const r = await page.evaluate(BOOT_SNIPPET);
  await new Promise((r2) => setTimeout(r2, 1200));
  await dismissModals(page);
  if (r.mainH <= 0) {
    /* 注意：3D 模式下这条警告是**正常的** —— 主视图让位后 #main 本就该是 0。
       只有 2D 模式下的 0 才意味着 boot 失败。 */
    const is3d = await page.evaluate(() => !!document.getElementById('scene3d-first'));
    if (!is3d) console.log('★ 警告：boot 后 #main 高度为 ' + r.mainH + '，布局探针结果不可信');
  }
  return r;
}

/**
 * 把所有 CSS 动画推到终态。
 *
 * ★★ 为什么必须有这个（2026-09-19 踩的坑）：
 *   **无头浏览器里页面若不可见，CSS 动画不会推进。**
 *   游戏的 `.modal-overlay` 带 `animation: fadeIn 0.2s`，
 *   实测它会永远停在 `playState: "running"` 且 `opacity: 0`。
 *   于是任何"弹窗是否可见"的断言都**恒假** ——
 *   看起来像真 bug（"弹窗被藏了"），实际是测试环境伪影。
 *   我为这一条白查了一轮：改对了 CSS 却以为没生效。
 *
 *   凡是断言"某个带动画的元素可见"的脚本，测之前都该先调它。
 *   副作用：动画被强制结束（真实用户会看到 0.2s 的淡入，不影响断言意图）。
 */
async function finishAnimations(page, selector = '*') {
  await page.evaluate((sel) => {
    let els = [];
    try { els = [...document.querySelectorAll(sel)]; } catch (e) { els = []; }
    for (const el of els) {
      if (!el.getAnimations) continue;
      for (const a of el.getAnimations()) { try { a.finish(); } catch (e) { /* 已结束的会抛，忽略 */ } }
    }
  }, selector);
}

module.exports = {
  EDGE,
  attachErrorSink,
  BOOT_SNIPPET,
  boot,
  dismissModals,
  finishAnimations,
};
