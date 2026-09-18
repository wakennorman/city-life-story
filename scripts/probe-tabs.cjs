/**
 * 探测：各 tab 的 #content-area 到底渲染了什么
 * 用法: node scripts/probe-tabs.cjs
 */
const puppeteer = require('puppeteer');
const { EDGE, attachErrorSink, boot, dismissModals } = require('./_boot.cjs');
const URL = 'http://127.0.0.1:8899/src/index.html';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new', protocolTimeout: 25000,
    args: ['--no-sandbox', '--disable-background-timer-throttling'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = attachErrorSink(page);
  page.on('dialog', async (d) => { try { await d.accept(); } catch (e) {} });

  const b = await boot(page, URL);
  console.log('boot:', JSON.stringify(b));

  const res = await page.evaluate(() => {
    const out = [];
    const tabs = ['actions', 'city', 'me', 'career', 'wiki'];
    for (const t of tabs) {
      try { switchTab(t); } catch (e) { out.push({ tab: t, err: 'switchTab: ' + e.message }); continue; }
      const ca = document.getElementById('content-area');
      const kids = ca ? ca.children.length : -1;
      const btns = ca ? ca.querySelectorAll('button, .btn, [onclick], [role=button]').length : -1;
      const wired = ca ? [...ca.querySelectorAll('button, .btn, [role=button]')].filter((e) => typeof e.onclick === 'function' || e.hasAttribute('onclick')).length : -1;
      out.push({
        tab: t,
        htmlLen: ca ? ca.innerHTML.length : -1,
        kids,
        clickables: btns,
        wired,
        textStart: ca ? (ca.innerText || '').replace(/\s+/g, ' ').slice(0, 120) : '',
        elIds: ca ? [...ca.children].map((c) => c.tagName + '#' + (c.id || '') + '.' + String(c.className || '').slice(0, 20)).slice(0, 6) : [],
      });
    }
    return out;
  });

  console.log('\n=== 各 Tab 渲染结果 ===');
  res.forEach((r) => {
    console.log('\n── ' + r.tab + ' ──');
    console.log('   htmlLen=' + r.htmlLen + '  children=' + r.kids + '  可点=' + r.clickables + '  已接线=' + r.wired);
    console.log('   文字: ' + r.textStart);
    if (r.elIds && r.elIds.length) console.log('   子元素: ' + r.elIds.join('  '));
    if (r.err) console.log('   ★ ' + r.err);
  });

  console.log('\n=== 错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 12).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
