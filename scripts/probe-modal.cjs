/**
 * 定点探针：为什么 showCareerPathPreviewModal 点了没反应？
 * 用法: node scripts/probe-modal.cjs
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
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message.slice(0, 300)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 300)); });

  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 4000));

  await page.evaluate(() => {
    const t = document.getElementById('title-screen');
    if (t) t.style.display = 'none';
    StateManager.newGame();
    if (typeof initializePrices === 'function') initializePrices();
    if (typeof renderAll === 'function') renderAll();
    // 埋点：记录每次 showModal 调用与返回
    window.__mdLog = [];
    const orig = window.showModal;
    window.showModal = function () {
      const existing = document.querySelectorAll('.modal-overlay').length;
      window.__mdLog.push({ phase: 'call', existing, title: (arguments[0] && arguments[0].title) || String(arguments[0]).slice(0, 40) });
      let r;
      try { r = orig.apply(this, arguments); }
      catch (e) { window.__mdLog.push({ phase: 'throw', err: e.message }); throw e; }
      window.__mdLog.push({ phase: 'return', after: document.querySelectorAll('.modal-overlay').length, ret: typeof r });
      return r;
    };
  });
  await new Promise((r) => setTimeout(r, 1200));

  // 清掉引导弹窗
  for (let i = 0; i < 8; i++) {
    const n = await page.evaluate(() => document.querySelectorAll('.modal-overlay').length);
    if (!n) break;
    await page.evaluate(() => {
      const ov = document.querySelector('.modal-overlay');
      const b = [...ov.querySelectorAll('button')].find((x) => /知道了|确定|关闭|跳过|取消/.test(x.textContent || ''));
      if (b) b.click(); else ov.remove();
    });
    await new Promise((r) => setTimeout(r, 600));
  }

  await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('career'); });
  await new Promise((r) => setTimeout(r, 1000));

  const info = await page.evaluate(() => ({
    fnType: typeof showCareerPathPreviewModal,
    fnTypeNav: typeof showCareerNavModal,
    fnTypeReq: typeof showCareerRequirementsModal_Global,
    condSys: typeof ConditionSystem,
    condSysModal: typeof (window.ConditionSystem && ConditionSystem.showModal),
    CAREER_PATHS_keys: typeof CAREER_PATHS !== 'undefined' ? Object.keys(CAREER_PATHS).slice(0, 15) : 'undefined',
    overlays: document.querySelectorAll('.modal-overlay').length,
    bodyModalish: [...document.body.children].map((c) => c.id || c.className).filter((c) => /modal|overlay|toast|dialog/i.test(String(c))),
  }));
  console.log('=== 环境 ===');
  console.log(JSON.stringify(info, null, 2));

  // 直接调用
  console.log('\n=== A. 直接调用 showCareerPathPreviewModal("logistics") ===');
  await page.evaluate(() => { window.__mdLog = []; });
  const rA = await page.evaluate(() => {
    try { showCareerPathPreviewModal('logistics'); return 'called'; }
    catch (e) { return 'THROW: ' + e.message; }
  });
  await new Promise((r) => setTimeout(r, 500));
  const mdA = await page.evaluate(() => window.__mdLog);
  const ovA = await page.evaluate(() => document.querySelectorAll('.modal-overlay').length);
  console.log('  返回: ' + rA + ' | 弹窗数: ' + ovA);
  console.log('  showModal 埋点: ' + JSON.stringify(mdA));

  // 清干净
  await page.evaluate(() => { document.querySelectorAll('.modal-overlay').forEach((o) => o.remove()); });

  // 真实点击 DOM 元素
  console.log('\n=== B. 真实点击 DOM 元素（onclick 属性）===');
  await page.evaluate(() => { window.__mdLog = []; });
  const rB = await page.evaluate(() => {
    const el = [...document.querySelectorAll('#content-area [onclick]')]
      .find((e) => (e.getAttribute('onclick') || '').includes("showCareerPathPreviewModal('logistics')"));
    if (!el) return 'NOT FOUND';
    el.click();
    return 'clicked ' + el.tagName + '.' + el.className;
  });
  await new Promise((r) => setTimeout(r, 600));
  const mdB = await page.evaluate(() => window.__mdLog);
  const ovB = await page.evaluate(() => document.querySelectorAll('.modal-overlay').length);
  console.log('  点击: ' + rB + ' | 弹窗数: ' + ovB);
  console.log('  showModal 埋点: ' + JSON.stringify(mdB));

  // 检查 showCareerRequirementsModal_Global
  console.log('\n=== C. showCareerRequirementsModal_Global("logistics","log_courier") ===');
  await page.evaluate(() => { document.querySelectorAll('.modal-overlay').forEach((o) => o.remove()); window.__mdLog = []; });
  const rC = await page.evaluate(() => {
    try { showCareerRequirementsModal_Global('logistics', 'log_courier'); return 'called'; }
    catch (e) { return 'THROW: ' + e.message; }
  });
  await new Promise((r) => setTimeout(r, 500));
  const mdC = await page.evaluate(() => window.__mdLog);
  const ovC = await page.evaluate(() => document.querySelectorAll('.modal-overlay').length);
  console.log('  返回: ' + rC + ' | 弹窗数: ' + ovC);
  console.log('  showModal 埋点: ' + JSON.stringify(mdC));

  console.log('\n=== 错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 8).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
