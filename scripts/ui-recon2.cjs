/**
 * 真实游戏浏览器驱动 —— 钻进主界面（第二步侦察）
 * 用法: node scripts/ui-recon2.cjs
 */
const puppeteer = require('puppeteer');
const URL = 'http://127.0.0.1:8899/src/index.html';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const dumpVisible = () => {
  const vis = (el) => {
    const s = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  const btns = [...document.querySelectorAll('button, [role=button], .btn, .tab-btn, [onclick]')]
    .filter(vis).slice(0, 50)
    .map((b) => `[${b.id || b.className.toString().slice(0, 22)}] ${(b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 34)}${b.getAttribute('onclick') ? '  oc=' + b.getAttribute('onclick').slice(0, 34) : ''}`);
  return {
    modalCount: document.querySelectorAll('.modal-overlay').length,
    text: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 500),
    btns,
    day: (typeof StateManager !== 'undefined' && StateManager.getState && StateManager.getState())
      ? (StateManager.getState().player || {}).day : null,
  };
};

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new',
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
           '--disable-gpu-sandbox', '--disable-background-timer-throttling',
           '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message.slice(0, 240)));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 160)); });

  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 5000));

  const clickByText = async (txt) => {
    const r = await page.evaluate((t) => {
      const vis = (el) => { const s = getComputedStyle(el); const b = el.getBoundingClientRect(); return s.display !== 'none' && b.width > 0 && b.height > 0; };
      const el = [...document.querySelectorAll('button, [role=button], .btn, [onclick]')]
        .filter(vis).find((b) => (b.textContent || '').indexOf(t) >= 0);
      if (!el) return null;
      el.click();
      return (el.textContent || '').trim().slice(0, 30);
    }, txt);
    return r;
  };

  const step = async (label, txt, wait = 2500) => {
    const hit = await clickByText(txt);
    console.log(`\n── ${label}  点击「${txt}」 → ${hit ? '命中: ' + hit : '★ 没找到'}`);
    await new Promise((r) => setTimeout(r, wait));
    const d = await page.evaluate(dumpVisible);
    console.log('   day=' + d.day + '  modal=' + d.modalCount);
    console.log('   文字: ' + d.text.slice(0, 260));
    console.log('   按钮:');
    d.btns.slice(0, 18).forEach((b) => console.log('     ' + b));
    return d;
  };

  await step('① 跳过引导', '跳过引导');
  if ((await page.evaluate(() => document.querySelectorAll('.modal-overlay').length)) > 0) {
    await step('②a 处理弹窗', '确定');
    await step('②b 处理弹窗', '开始');
  }
  await step('③ 找主界面', '继续');
  await step('④ 存档', '读取');

  console.log('\n=== 错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 12).forEach((e) => console.log('  ' + e));
  await browser.close();
})();
