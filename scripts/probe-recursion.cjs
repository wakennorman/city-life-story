/**
 * 抓 showCareerRequirementsModal_Global 的无限递归调用栈
 * 用法: node scripts/probe-recursion.cjs
 */
const puppeteer = require('puppeteer');
const URL = 'http://127.0.0.1:8899/src/index.html';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new',
    args: ['--no-sandbox', '--disable-background-timer-throttling'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));

  const out = await page.evaluate(() => {
    const t = document.getElementById('title-screen');
    if (t) t.style.display = 'none';
    StateManager.newGame();
    if (typeof initializePrices === 'function') initializePrices();
    if (typeof renderAll === 'function') renderAll();

    const report = { callChain: [], stack: null, errName: null, errMsg: null };

    // 1) 记录调用链：包装候选函数，看谁被反复调用
    const watch = ['showCareerRequirementsModal_Global', 'showCareerRequirementsModal',
                   'checkCareerPromotionDetailed', 'checkCareerPromotion',
                   '_renderCondRows', 'renderPromotionReqs'];
    const counts = {};
    watch.forEach((n) => {
      const f = window[n] || (typeof eval === 'function' ? (function () { try { return eval(n); } catch (e) { return undefined; } })() : undefined);
      if (typeof f !== 'function') { counts[n] = 'not-global'; return; }
      counts[n] = 0;
      window[n] = function () {
        counts[n]++;
        if (counts[n] > 50 && report.callChain.length < 40) {
          report.callChain.push(n + ' #' + counts[n]);
        }
        return f.apply(this, arguments);
      };
    });
    report.counts = counts;

    // 2) 捕获 Error 对象本体，拿 stack
    const origErr = console.error;
    console.error = function () {
      const args = [...arguments];
      args.forEach((a) => {
        if (a && a.stack && !report.stack) {
          report.errName = a.name;
          report.errMsg = a.message;
          report.stack = String(a.stack).split('\n').slice(0, 45);
        }
      });
      return origErr.apply(console, args);
    };

    // 3) 触发
    try {
      window.showCareerRequirementsModal_Global('logistics', 'log_courier');
      report.triggered = 'ok';
    } catch (e) {
      report.triggered = 'THROW: ' + e.name + ' ' + e.message;
      report.stack = String(e.stack).split('\n').slice(0, 45);
    }
    console.error = origErr;
    return report;
  });

  console.log('=== 触发结果 ===');
  console.log('triggered:', out.triggered);
  console.log('errName  :', out.errName);
  console.log('errMsg   :', out.errMsg);
  console.log('\n=== 候选函数被调用次数 ===');
  console.log(JSON.stringify(out.counts, null, 2));
  console.log('\n=== 超频调用链（>50 次）===');
  (out.callChain || []).slice(0, 40).forEach((c) => console.log('  ' + c));
  console.log('\n=== 调用栈 ===');
  (out.stack || []).forEach((s) => console.log('  ' + s));

  await browser.close();
})();
