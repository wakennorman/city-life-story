/**
 * 出生点体检（秒级）：只切场景、不做走动，直接检查出生点是否被碰撞盒压住。
 * 29 个地点一次跑完，用来在批量截图前快速发现"一出生就被卡住"的地点。
 *
 * 用法: node spawn-check.cjs
 */
const puppeteer = require('puppeteer');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://127.0.0.1:8123/index.html';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
      '--disable-gpu-sandbox', '--disable-background-timer-throttling', '--disable-renderer-backgrounding'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 400, height: 240, deviceScaleFactor: 1 });
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await page.waitForFunction(() => window.__ready === true, { timeout: 90000, polling: 300 });

  const ids = await page.evaluate(() => window.__list());
  let bad = 0;
  const kinds = {};
  for (const id of ids) {
    const r = await page.evaluate((x) => {
      window.__goto(x);
      const b = window.__lastBuild;
      return { id: x, blocked: b.spawnBlocked, ms: b.ms, before: b.before, after: b.after, tris: b.tris, board: window.__board() };
    }, id);
    const ok = r.blocked === 0;
    if (!ok) bad++;
    for (const e of r.board) kinds[e.split(':')[0]] = (kinds[e.split(':')[0]] || 0) + 1;
    const board = r.board.map(s => s.split(':')[1]).join(' / ');
    console.log(`${ok ? '✓' : '✗'} ${id.padEnd(19)} 遮挡${r.blocked} ${String(r.before).padStart(5)}→${String(r.after).padStart(4)}网格  ${board}`);
  }
  console.log(`\n合计 ${ids.length} 个地点，出生点被压住 ${bad} 个；控制台错误 ${errs.length} 条`);
  console.log('交互点类型分布:', kinds);
  if (errs.length) console.log(errs.slice(0, 6).join('\n'));
  await browser.close();
})();
