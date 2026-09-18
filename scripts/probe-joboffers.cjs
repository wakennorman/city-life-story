/** 抽查：跳槽机会区块的渲染文案（含未达标原因） */
const puppeteer = require('puppeteer');
const { EDGE, attachErrorSink, boot } = require('./_boot.cjs');
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
  await boot(page, URL);

  const out = await page.evaluate(() => {
    var s = StateManager.getState();
    s.player.day = 40; s.player.actionPoints = 20;
    s.career = s.career || {};
    s.career.currentJob = { path: 'logistics', levelId: 'log_sorter', levelName: '仓储分拣工', salary: 4500, workDays: 25, performance: 50, startDay: 15, _lastJobhopDay: -999 };
    s.careerCapital = { burnout: 40, industryResources: 30, clientLeads: 20, reputation: 35 };
    s._careerTabSubTab = 'career_jobs';
    if (typeof switchTab === 'function') switchTab('career');
    if (typeof renderAll === 'function') renderAll();
    var ca = document.getElementById('content-area');
    var h3 = [...ca.querySelectorAll('h3')].find(function (h) { return (h.textContent || '').indexOf('跳槽机会') >= 0; });
    if (!h3) return { found: false };
    var wrap = h3.parentElement;
    var btns = [...wrap.querySelectorAll('button')];
    return {
      found: true,
      text: (wrap.innerText || '').replace(/\s+/g, ' ').slice(0, 700),
      buttons: btns.map(function (b) { return { text: (b.textContent || '').trim(), disabled: b.disabled === true, title: b.title || '' }; }),
    };
  });
  console.log(JSON.stringify(out, null, 2));
  console.log('\n错误: ' + [...new Set(errs)].filter((e) => !/36kr|CORS|ERR_FAILED|status of 4/.test(e)).length);
  await browser.close();
})();
