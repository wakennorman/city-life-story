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
      // 外部新闻源在静态服务下必然 CORS 失败，与被测逻辑无关，滤掉降噪
      if (/36kr|CORS policy|net::ERR_FAILED|status of 4\d\d/.test(t)) return;
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
    console.log('★ 警告：boot 后 #main 高度为 ' + r.mainH + '，布局探针结果不可信');
  }
  return r;
}

module.exports = { EDGE, attachErrorSink, BOOT_SNIPPET, boot, dismissModals };
