/**
 * 布局诊断：消息日志是否真的可见 + 事业面板数据来源
 * 用法: node scripts/probe-layout.cjs
 */
const puppeteer = require('puppeteer');
const { EDGE, attachErrorSink, boot, dismissModals } = require('./_boot.cjs');

const URL = 'http://127.0.0.1:8899/src/index.html';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: 'new',
    args: ['--no-sandbox', '--disable-background-timer-throttling'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });
  const errs = attachErrorSink(page);

  const b = await boot(page, URL);
  console.log('boot:', JSON.stringify(b));

  const info = await page.evaluate(() => {
    const desc = (e) => {
      if (!e) return null;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      return { display: cs.display, overflow: cs.overflow, flex: cs.flex,
               maxHeight: cs.maxHeight,
               rect: { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height) } };
    };
    const log = document.getElementById('message-log');
    return {
      win: { w: innerWidth, h: innerHeight },
      app: desc(document.getElementById('app')),
      main: desc(document.getElementById('main')),
      contentArea: desc(document.getElementById('content-area')),
      messageLog: desc(log),
      logContent: desc(log && log.querySelector('.log-content')),
      logEntries: log ? log.querySelectorAll('.log-entry').length : -1,
      logPreview: log ? (log.querySelector('#message-log-preview') || {}).textContent : null,
      logFirstEntries: log ? [...log.querySelectorAll('.log-entry')].slice(0, 4).map((e) => e.textContent.replace(/\s+/g, ' ').slice(0, 50)) : [],
      hasToggle: !!(log && log.querySelector('#message-log-toggle')),
      hasFilter: !!(log && log.querySelector('#message-log-filter')),
      collapsed: log ? log.classList.contains('collapsed') : null,
      bodyScrollH: document.body.scrollHeight,
    };
  });
  console.log('\n=== 布局诊断 ===');
  console.log(JSON.stringify(info, null, 2));

  const dash = await page.evaluate(() => {
    var s = StateManager.getState();
    s.career = s.career || {};
    s.career.currentJob = { path: 'logistics', levelId: 'log_sorter', levelName: '仓储分拣工', salary: 4500, workDays: 25, performance: 50, startDay: 15 };
    s._careerTabSubTab = 'career_overview';
    if (typeof renderAll === 'function') renderAll();
    var txt = (document.getElementById('content-area') || {}).innerText || '';
    return {
      careerCapital_displayed: s.careerCapital ? JSON.parse(JSON.stringify(s.careerCapital)) : 'undefined',
      career_dot_capital: s.career.capital ? JSON.parse(JSON.stringify(s.career.capital)) : 'undefined',
      hasColleagues: !!(s.corporate && s.corporate.colleagues && s.corporate.colleagues.network && s.corporate.colleagues.network.length),
      textHasClient: txt.indexOf('客户') >= 0,
      textHasTrust: txt.indexOf('信任') >= 0,
      snippet: txt.replace(/\s+/g, ' ').slice(0, 500),
    };
  });
  console.log('\n=== 事业总览数据来源 ===');
  console.log(JSON.stringify(dash, null, 2));

  console.log('\n=== 错误 (' + new Set(errs).size + ') ===');
  [...new Set(errs)].slice(0, 10).forEach((e) => console.log('  ' + e));

  await browser.close();
})();
