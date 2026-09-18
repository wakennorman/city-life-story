/**
 * 全地点批量验证：对 29 个地点逐个切场景 → 走两步 → 截图 → 采集指标。
 *
 * 为什么必须批量：单看"城中村"好看不代表 29 个地点都成立。
 * 每个布局都有各自翻车的可能（广场太空、院区被墙卡死、厂区道具穿模）。
 *
 * 用法: node shots-all.cjs [地点id,地点id,...]   （不传则全跑）
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const URL = 'http://127.0.0.1:8123/index.html';
const OUT = path.join(__dirname, 'shots');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

const ALL = [
  'slum', 'old_community', 'luxury_community', 'suburb',
  'commercialDist', 'night_market', 'vegetable_market', 'flea_market',
  'wholesaleMarket', 'flower_bird_market', 'auto_city', 'entertainment', 'bank',
  'trainingCenter', 'school', 'library', 'gym',
  'factoryZone', 'logistics_park', 'construction',
  'hospital', 'gov_office', 'court', 'job_market', 'community_center',
  'techPark', 'park', 'temple', 'internet_cafe',
];

const wanted = process.argv.slice(2).filter(Boolean);
const list = wanted.length ? wanted : ALL;

(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    args: [
      '--no-sandbox',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--disable-gpu-sandbox',
      // headless 默认会把不可见页面的 rAF / 定时器降频，
      // 降频后"按 W 走 1.3 秒"实际只走了十来帧，测出来的位移完全不可信。
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=CalculateNativeWinOcclusion',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

  const errs = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errs.push(m.text());
    if (m.text().startsWith('[loc]')) console.log('  ' + m.text());
  });
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));

  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  try {
    await page.waitForFunction(() => window.__ready === true, { timeout: 90000, polling: 400 });
  } catch (e) {
    errs.push('WAIT_TIMEOUT: 未就绪 — ' + e.message);
    console.log(JSON.stringify({ errors: errs }, null, 1));
    await browser.close();
    return;
  }
  await new Promise((r) => setTimeout(r, 2200));

  const rows = [];

  for (const id of list) {
    // 切场景并等构建完成
    await page.evaluate((x) => window.__goto(x), id);
    await new Promise((r) => setTimeout(r, 260));

    // 走两步：既验证碰撞没把人卡死，也让画面里出现"探索中"的构图
    const before = await page.evaluate(() => window.__probe().pos);
    await page.evaluate(() => window.__key('KeyW', true));
    await new Promise((r) => setTimeout(r, 2600));
    await page.evaluate(() => window.__key('KeyW', false));
    await new Promise((r) => setTimeout(r, 700));
    const after = await page.evaluate(() => window.__probe().pos);

    const probe = await page.evaluate(() => window.__probe());
    const moved = +Math.hypot(after.x - before.x, after.z - before.z).toFixed(2);

    await page.screenshot({ path: path.join(OUT, `${id}.png`) });

    rows.push({
      id,
      loc: probe.loc,
      moved,
      colliders: probe.colliders,
      hotspots: probe.hotspots,
      fps: probe.fps,
      calls: probe.calls,
      tris: probe.triangles,
      build: probe.build,
    });
    // 移动量只是"输入有没有到达角色"的粗查。软件渲染下帧率只有 3-5 FPS，
    // 位移必然远小于理论值，所以阈值放得很松；真正严格的检查是出生点遮挡检测。
    const stuck = moved < 0.3 && probe.build.spawnBlocked === 0;
    const flag = stuck ? '  ⚠ 疑似卡住' : '';
    console.log(`  ${probe.loc === id ? '✓' : '✗'} ${id.padEnd(19)} 移动${String(moved).padStart(5)}m  遮挡${probe.build.spawnBlocked}  交互点${String(probe.hotspots).padStart(2)}  ${String(probe.calls).padStart(3)} calls  ${String(probe.fps).padStart(2)} FPS${flag}`);
  }

  console.log('\n' + JSON.stringify({ rows, errors: errs }, null, 1));
  fs.writeFileSync(path.join(OUT, 'report.json'), JSON.stringify({ rows, errors: errs }, null, 1));
  await browser.close();
})();
