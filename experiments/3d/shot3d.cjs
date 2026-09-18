const puppeteer = require('puppeteer');
const path = require('path');

const URL = 'http://127.0.0.1:8123/index.html';
const OUT = __dirname;
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    args: [
      '--no-sandbox',
      '--enable-unsafe-swiftshader',
      '--use-gl=angle',
      '--use-angle=swiftshader',
      '--disable-gpu-sandbox'
    ]
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });

  const errs = [];
  page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));

  await page.goto(URL, { waitUntil: 'load', timeout: 60000 });

  // 等 3D 初始化完成（__probe 存在且有渲染数据）
  try {
    await page.waitForFunction(
      () => window.__probe && window.__probe().calls > 0,
      { timeout: 60000, polling: 500 }
    );
  } catch (e) {
    errs.push('WAIT_TIMEOUT: 3D 未在 60s 内完成首帧 — ' + e.message);
  }
  await new Promise(r => setTimeout(r, 2500));

  const shots = [];
  const shot = async (name) => {
    const p = path.join(OUT, `shot3d-${name}.png`);
    await page.screenshot({ path: p });
    const probe = await page.evaluate(() => window.__probe ? window.__probe() : null);
    shots.push({ name, probe });
  };

  await shot('01-spawn');

  // 走动测试：按 W 前进 1.6 秒，验证位置真的变了
  const before = await page.evaluate(() => window.__probe().pos);
  await page.evaluate(() => window.__key('KeyW', true));
  await new Promise(r => setTimeout(r, 1600));
  await page.evaluate(() => window.__key('KeyW', false));
  await new Promise(r => setTimeout(r, 900));
  const after = await page.evaluate(() => window.__probe().pos);
  await shot('02-walk');

  // 视角拉近，看建筑细节
  await page.evaluate(() => { for (let i = 0; i < 26; i++) window.dispatchEvent(new WheelEvent('wheel', { deltaY: -10 })); });
  await new Promise(r => setTimeout(r, 1400));
  await shot('03-closeup');

  // 巷子中段另一处
  await page.evaluate(() => window.__teleport(0, -8));
  await new Promise(r => setTimeout(r, 1600));
  await shot('04-mid');

  // 抬头看楼（拉远）
  await page.evaluate(() => { for (let i = 0; i < 34; i++) window.dispatchEvent(new WheelEvent('wheel', { deltaY: 10 })); });
  await new Promise(r => setTimeout(r, 1400));
  await shot('05-wide');

  console.log(JSON.stringify({
    walkTest: { before, after, moved: +Math.hypot(after.x - before.x, after.z - before.z).toFixed(2) },
    shots,
    errors: errs
  }, null, 1));

  await browser.close();
})();
