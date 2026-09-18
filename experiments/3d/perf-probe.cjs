/**
 * 性能归因：区分"填充率瓶颈（软件光栅化）"与"CPU/几何瓶颈"。
 *
 * 做法：同一场景分别在 320×180 与 1280×720 下测帧率。
 *   分辨率降 16 倍后帧率大幅提升 → 瓶颈在像素填充 → 真实 GPU 上不是问题
 *   分辨率几乎不影响帧率       → 瓶颈在 CPU/提交批次 → 需要优化场景结构
 */
const puppeteer = require('puppeteer');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://127.0.0.1:8123/index.html';
const LOC = process.argv[2] || 'slum';

async function measure(browser, w, h, shadows) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await page.waitForFunction(() => window.__ready === true, { timeout: 90000, polling: 300 });
  await page.evaluate((x) => window.__goto(x), LOC);
  await new Promise((r) => setTimeout(r, 2600));

  const res = await page.evaluate(async (withShadow) => {
    // 直接改渲染器与光源开关，做同场景对照
    const r = window.__renderer, s = window.__scene;
    if (r) { r.shadowMap.enabled = withShadow; r.shadowMap.needsUpdate = true; }
    if (s) s.traverse(o => { if (o.isLight && o.castShadow !== undefined) o.castShadow = withShadow; });
    const samples = [];
    for (let i = 0; i < 4; i++) {
      const t0 = performance.now();
      let n = 0;
      await new Promise(res => {
        const tick = () => { n++; (performance.now() - t0 < 1200) ? requestAnimationFrame(tick) : res(); };
        requestAnimationFrame(tick);
      });
      samples.push(n / ((performance.now() - t0) / 1000));
    }
    samples.sort((a, b) => a - b);
    return { med: +samples[Math.floor(samples.length / 2)].toFixed(1), probe: window.__probe() };
  }, shadows);

  await page.close();
  return res;
}

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    args: ['--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader',
      '--disable-gpu-sandbox', '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows', '--disable-renderer-backgrounding'],
  });

  const rows = [];
  for (const [w, h, sh] of [[320, 180, true], [640, 360, true], [1280, 720, true], [1280, 720, false]]) {
    const r = await measure(browser, w, h, sh);
    rows.push({ res: `${w}x${h}`, shadows: sh, fps: r.med, calls: r.probe.calls, tris: r.probe.triangles });
    console.log(`${w}x${h}  阴影${sh ? '开' : '关'}  → ${r.med} FPS   ${r.probe.calls} calls  ${r.probe.triangles} tris`);
  }
  console.log('\n' + JSON.stringify({ loc: LOC, rows }, null, 1));
  await browser.close();
})();
