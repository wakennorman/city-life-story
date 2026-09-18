/**
 * 真实游戏浏览器探针（侦察阶段）
 *
 * 为什么需要它：项目的验证栈全是 node vm 无头跑逻辑 ——
 * check:js 验语法、check:events 验数值、test:unit 验端口，
 * 但**从来没有人点过一个按钮**。整个 DOM 交互层是零覆盖的盲区，
 * 所以「点击调休没反应」这类问题可以在绿灯门禁下长期存活。
 *
 * 这个脚本先只做侦察：把游戏加载起来，看它停在哪一步、要按什么才能进主界面。
 *
 * 用法: node scripts/ui-recon.cjs
 */
const puppeteer = require('puppeteer');
const URL = 'http://127.0.0.1:8899/src/index.html';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle',
           '--use-angle=swiftshader', '--disable-gpu-sandbox',
           '--disable-background-timer-throttling',
           '--disable-backgrounding-occluded-windows',
           '--disable-renderer-backgrounding'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push('CONSOLE: ' + m.text().slice(0, 200)); });
  page.on('requestfailed', (r) => errs.push('REQFAIL: ' + r.url().split('/').pop() + ' ' + (r.failure() || {}).errorText));

  console.log('加载', URL);
  await page.goto(URL, { waitUntil: 'load', timeout: 120000 });
  await new Promise((r) => setTimeout(r, 6000));

  const info = await page.evaluate(() => {
    const vis = (el) => {
      const s = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
    };
    const btns = [...document.querySelectorAll('button, [role=button], .btn, .tab-btn')]
      .filter(vis)
      .slice(0, 60)
      .map((b) => ({
        tag: b.tagName, cls: (b.className || '').toString().slice(0, 40),
        id: b.id || '', text: (b.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 40),
        onclick: b.getAttribute('onclick') || '',
      }));
    return {
      title: document.title,
      hasState: typeof StateManager !== 'undefined',
      hasLocalSave: (() => { try { return !!localStorage.getItem('cityLifeSave'); } catch (e) { return 'n/a'; } })(),
      activeEls: document.querySelectorAll('#app *, .screen, [id]').length,
      visibleTop: [...document.body.children].map((c) => c.id || c.className || c.tagName).slice(0, 20),
      overlayCount: document.querySelectorAll('.modal-overlay').length,
      btns,
      bodyTextStart: (document.body.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 300),
    };
  });

  console.log('\n=== 页面状态 ===');
  console.log('title        :', info.title);
  console.log('StateManager :', info.hasState);
  console.log('modal overlay:', info.overlayCount);
  console.log('body 首段文字:', info.bodyTextStart);
  console.log('\n可见按钮 (' + info.btns.length + ')');
  info.btns.forEach((b) => {
    console.log(`  [${b.tag}${b.id ? '#' + b.id : ''}] ${b.text.padEnd(30)} onclick=${b.onclick.slice(0, 50)}`);
  });

  console.log('\n=== 错误 (' + errs.length + ') ===');
  [...new Set(errs)].slice(0, 20).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
