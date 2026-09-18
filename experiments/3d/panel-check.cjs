/**
 * 交互面板内容巡检
 *
 * 存在的理由：shots-all.cjs 只验证"场景建得起来、人走得动、有几个交互点"，
 * 但面板里的文字是另一条链路（world.js 打包 → main.js 渲染）。
 * 这里要的是「热点点开之后，屏幕上到底显示了什么」——
 * 不截图肉眼看一遍，就不知道数据源标注对不对、字段有没有渲染成 undefined。
 *
 * 用法: node panel-check.cjs [地点id,...]   （不传则抽查一批代表性地点的全部热点）
 */
const puppeteer = require('puppeteer');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const URL = 'http://127.0.0.1:8123/index.html';

// 每个地点交互点上限 5，代表性地点的全部热点都点一遍
const DEFAULT = [
  'library', 'entertainment', 'commercialDist', 'slum',
  'flea_market', 'suburb', 'court', 'job_market', 'gov_office',
  'night_market', 'vegetable_market', 'wholesaleMarket',
];
const list = process.argv.slice(2).filter(Boolean).length
  ? process.argv.slice(2).filter(Boolean)
  : DEFAULT;

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    args: [
      '--no-sandbox', '--enable-unsafe-swiftshader', '--use-gl=angle',
      '--use-angle=swiftshader', '--disable-gpu-sandbox',
      '--disable-background-timer-throttling',
      '--disable-backgrounding-occluded-windows',
      '--disable-renderer-backgrounding',
      '--disable-features=CalculateNativeWinOcclusion',
    ],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 720 });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });

  await page.goto(URL, { waitUntil: 'load', timeout: 90000 });
  await page.waitForFunction(() => window.__ready === true, { timeout: 90000, polling: 400 });
  await new Promise((r) => setTimeout(r, 2000));

  let total = 0;
  const problems = [];

  for (const id of list) {
    await page.evaluate((x) => window.__goto(x), id);
    await new Promise((r) => setTimeout(r, 260));

    /* 直接把每个热点搬到脚下逐个触发 —— 比"走过去按 E"快得多，
       而且不受软渲染帧率影响（走一步要等好几帧）。 */
    const spots = await page.evaluate(() => window.__spots());
    console.log(`\n═══ ${id}  (${spots.length} 个交互点)`);

    for (let i = 0; i < spots.length; i++) {
      const info = await page.evaluate((k) => window.__openPanel(k), i);
      if (!info) { console.log(`  (第 ${i} 个热点未返回面板)`); continue; }
      total++;
      const raw = info.rows || [];
      /* 注意别把已拼成字符串的 "键=值" 再解构一遍 —— 那拆出来的是字符串的前两个字符，
         校验会永远通过。必须拿原始 [k, v] 对去查。 */
      const bad = raw.filter(([, v]) => typeof v === 'string' && /undefined|NaN|\[object/.test(v));
      if (bad.length) problems.push(`${id}/${info.id}: ${bad.map(([k, v]) => `${k}=${v}`).join(' ; ')}`);
      console.log(`  ${String(info.kind).padEnd(8)} ${String(info.id).padEnd(26)} ${raw.map(([k, v]) => `${k}=${v}`).join(' | ')}`);
    }
  }

  console.log('\n' + '─'.repeat(90));
  console.log(`巡检 ${total} 个交互面板`);
  console.log(`渲染异常（undefined / NaN / [object]）: ${problems.length}`);
  problems.forEach((p) => console.log('  ✗ ' + p));
  console.log(`控制台错误: ${errs.length}`);
  errs.slice(0, 8).forEach((e) => console.log('  ! ' + e));

  await browser.close();
})();
