/**
 * 3D-first 外壳验证
 *
 * 验证目标形态（全屏 3D + HUD）真的跑得起来，而不是"看起来像"：
 *   ① 3D 铺满视口并渲染出三角面
 *   ② HUD 的顶栏/需求条/行动托盘都有真实内容
 *   ③ 按住左键拖动真的改变相机 yaw（这是之前的第 2 条抱怨）
 *   ④ 双击回正回到默认机位（R 键同理）
 *   ⑤ 点击行动条目真的驱动状态变化（AP 下降）
 *   ⑥ M 打开去处列表并能切地点
 *   ⑦ 无页面报错
 *
 * 用法：node scripts/verify-3d-shell.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "dev/_3dtest");
const OUT = path.join(DIR, "shots-shell");
const PORT = 8971;
/* 服务根必须是**项目根**而不是 dev/_3dtest：
   预览页要引用 /src/css/scene3d.css，根目录指错就 404，
   结果是页面半裸奔 —— 上一版就是这么翻车的（canvas 尺寸不对 + HUD 无样式）。 */
const DOC = "/dev/_3dtest/shell.html";
const URL = `http://127.0.0.1:${PORT}${DOC}`;
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let pass = 0, fail = 0;
const check = (name, ok, detail) => {
  console.log(`  ${ok ? "✅" : "❌"} ${name}${detail ? "  → " + detail : ""}`);
  ok ? pass++ : fail++;
};

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  /* ★ 先把探针包重建一遍再开测。
     页面加载的是 dev/_3dtest/bundle-probe.js —— 那是**构建产物**，不是源码。
     不重建的话，本脚本会在"src/app/3d 改了、探针还是旧的"的情况下
     拿旧代码验证新代码：断言全绿，但什么都没测到。
     这正是本项目的模式 14~17 那一家子 ——
     「验证脚本用的度量，与它想度量的东西不是同一个东西」。
     （verify-3d-bundle.cjs 已经会重建它，但单独跑本脚本时不会。）
     SCENE3D_ENTRY：并发编辑逃生口。多 Agent 并行时，别人可能正在改
     src/app/3d 下的**别的文件**，从默认入口构建会把别人的半成品打进来，
     于是本次改动无法独立验证。置该环境变量指向隔离源码树即可解耦。 */
  const bundleArgs = [
    path.join(__dirname, "build-3d-bundle.cjs"),
    "--out", "dev/_3dtest/bundle-probe.js",
  ];
  if (process.env.SCENE3D_ENTRY) {
    bundleArgs.push("--entry", process.env.SCENE3D_ENTRY);
    console.log(`ℹ️  SCENE3D_ENTRY=${process.env.SCENE3D_ENTRY}（隔离验证模式）`);
  }
  execFileSync(process.execPath, bundleArgs, { cwd: ROOT, stdio: "inherit" });

  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D-first 外壳预览" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

  const errors = [];
  const noise = [];
  page.on("pageerror", (e) => errors.push("[pageerror] " + String(e.message || e)));
  /* console 的 "Failed to load resource ... 404" **不带 URL**，
     无法在那条消息里判断是不是 favicon。所以：
       · 该条不在这里归类（避免与 response 事件重复计数）
       · 404 一律由下面的 response 处理器按 URL 判定
     这样"资源真的没加载"仍会被抓到（[404] 前缀），favicon 则进噪声。 */
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    const t = m.text();
    if (/Failed to load resource/i.test(t)) return;
    errors.push("[console] " + t);
  });
  page.on("response", (r) => {
    if (r.status() !== 404) return;
    const u = r.url();
    (/(favicon|\.ico)(\?|$)/i.test(u) ? noise : errors).push("[404] " + u);
  });
  page.on("requestfailed", (r) => {
    const u = r.url();
    (/(favicon|\.ico)(\?|$)/i.test(u) ? noise : errors).push("[reqfail] " + u);
  });

  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await page.waitForFunction(() => window.__shellReady === true, { timeout: 30000, polling: 200 });
  await sleep(2200);

  console.log("=== 3D-first 外壳验证 ===\n");

  console.log("① 3D 主视图");
  const s0 = await page.evaluate(() => window.__shell.debug);
  check("3D 已渲染出三角面", s0.tris > 1000, `${s0.tris} 三角面 / ${s0.calls} draw calls`);
  const fill = await page.evaluate(() => {
    const c = document.querySelector('.s3s3d-stage canvas');
    const r = c.getBoundingClientRect();
    return { w: Math.round(r.width), h: Math.round(r.height), vw: innerWidth, vh: innerHeight };
  });
  check("3D 铺满整个视口（不是塞在某个控件里）",
    fill.w >= fill.vw - 2 && fill.h >= fill.vh - 2,
    `canvas ${fill.w}x${fill.h} vs 视口 ${fill.vw}x${fill.vh}`);

  /* ── ①b 渲染管线（Agent A：P1-3 GTAO / P2-1 Bloom / P2-3 阴影 / P2-4 相机 / P3-2 镜头）──
   *
   * 为什么这一段的断言全都查「链长什么样」而不是「画面好不好看」：
   *   后处理类缺陷**不产生任何异常信号** —— pass 顺序反了、pass 没被加进去、
   *   Bloom 白天还开着、AO 悄悄回到全分辨率，画面只是"不太一样"，
   *   没有报错、没有崩溃、CI 全绿。所以必须把链本身暴露出来断言。
   *   身份判别用**独有属性**（gtaoMaterial / renderTargetBright / _toneMapping），
   *   不用 constructor.name —— esbuild minify 会把类名改掉，那种断言会假失败。 */
  console.log("\n①b 渲染管线（后处理链 / 阴影 / 相机深度）");
  const fx = s0.postFx;
  const EXPECT_CHAIN = ['render', 'gtao', 'bloom', 'grade', 'output'];
  check("后处理链已建立（5 个 pass）", !!fx && fx.count === 5 && fx.order.length === 5,
    fx ? `passes=${fx.count} · ${fx.order.join(' → ')}` : 'postFx 为 null（mini 模式或未创建）');
  check("链顺序 = Render → GTAO → Bloom → Grade → Output",
    !!fx && JSON.stringify(fx.order) === JSON.stringify(EXPECT_CHAIN),
    fx ? fx.order.join(' → ') : '');
  check("每个 pass 的身份正确（按独有属性判别，不看类名）",
    !!fx && Object.values(fx.shape).every(Boolean), fx ? JSON.stringify(fx.shape) : '');
  /* AO 半分辨率：拿 AO 缓冲与 canvas 绘制缓冲对比。
     这条断言防的是「composer.setSize 把 AO 又设回全分辨率」——
     顺序写反时它不报错，只是帧率掉一截。 */
  const aoHalf = !!fx && fx.aoSize && fx.canvasSize &&
    fx.aoSize[0] > 0 &&
    Math.abs(fx.aoSize[0] / fx.canvasSize[0] - fx.aoScale) < 0.02;
  check("AO 跑在半分辨率上（省掉 3/4 的 AO 像素）", aoHalf,
    fx ? `AO ${fx.aoSize && fx.aoSize.join('x')} vs canvas ${fx.canvasSize.join('x')}（目标比例 ${fx.aoScale}）` : '');
  check("Bloom 白天关闭（白天开着会让整个画面发灰）",
    !!fx && fx.bloomEnabled === false, fx ? `bloomEnabled=${fx.bloomEnabled}` : '');
  const cd = s0.cameraDepth;
  check("相机深度已收紧（near 0.5 / far 250）",
    !!cd && cd.near === 0.5 && cd.far === 250, cd ? `near ${cd.near} / far ${cd.far}` : '');
  check("阴影贴图每帧只更新一次（autoUpdate=false + 手动 needsUpdate）",
    !!s0.sun && s0.sun.autoUpdate === false,
    s0.sun ? `autoUpdate=${s0.sun.autoUpdate} · radius=${s0.sun.radius} · type=${s0.sun.type}` : '');
  check("阴影软化半径已设（PCF 的 shadowRadius 确实生效）",
    !!s0.sun && s0.sun.radius >= 2 && s0.sun.radius <= 4,
    s0.sun ? `radius=${s0.sun.radius}` : '');
  const sunDirDay = s0.sun ? s0.sun.dir : null;

  console.log("\n② HUD 内容");
  const hud = await page.evaluate(() => ({
    day: document.querySelector('[data-f="day"]').textContent,
    slot: document.querySelector('[data-f="slot"]').textContent,
    cash: document.querySelector('[data-f="cash"]').textContent,
    loc: document.querySelector('[data-f="locName"]').textContent,
    ap: document.querySelector('[data-f="apText"]').textContent,
    vitals: document.querySelectorAll('.s3h-vital').length,
    vitalNums: [...document.querySelectorAll('.s3h-vital-num')].map((e) => e.textContent),
    mentalNum: (document.querySelector('.s3h-mindset .s3h-vital-num') || {}).textContent || '',
    needKeys: [...document.querySelectorAll('.s3h-vital')].map((e) => e.dataset.k),
  }));
  check("顶栏有日期/时段/地点/现金", !!hud.day && !!hud.loc && !!hud.cash,
    `${hud.day} ${hud.slot} · ${hud.loc} · ${hud.cash}`);
  check("行动力条有数值", /\d+\s*\/\s*\d+/.test(hud.ap), hud.ap);
  /* 7 条 = 心态（派生生命线）+ 5 个生理需求 + 健康。
     对照《大多数》的状态体系，构成见 src/app/3d/hud.js 的 NEED_SPEC 注释。 */
  check("状态条 7 条且已填数", hud.vitals === 7 && hud.vitalNums.every((n) => n !== ""),
    `${hud.vitals} 条：${hud.vitalNums.join(" / ")}`);
  check("状态条字段齐全（心态 + 5 生理需求 + 健康）",
    ["mindset", "hunger", "hygiene", "clothing", "foodSatisfaction", "happiness", "health"]
      .every((k) => hud.needKeys.includes(k)),
    hud.needKeys.join(" / "));

  /* ★ 心态值不变式 —— 这条断言是为一次真实事故加的：
       hud.js 的回退公式曾经把 health 也算进平均，于是预览页显示 39、
       真实游戏里 computeMental 给 33，两个数字各自都对不上对方。
       当时的断言只查条数，完全没抓到 —— 「公式写两遍必然漂移」这句话
       写在注释里是拦不住的，必须变成可回归的断言。
     期望值用页面自己暴露的 needs 现算（不硬编码），避免引入第三份定义。 */
  const peekNeeds = await page.evaluate(() => window.__peek().needs);
  const expectMental = Math.round(
    (peekNeeds.hunger + peekNeeds.hygiene + peekNeeds.clothing +
      peekNeeds.foodSatisfaction + peekNeeds.happiness + (100 - peekNeeds.fatigue)) / 6,
  );
  check("心态 = 派生值（字段集不含 health）", Number(hud.mentalNum) === expectMental,
    `显示 ${hud.mentalNum}，期望 ${expectMental}`);

  // 展开行动托盘
  await page.keyboard.press("Tab");
  await sleep(500);
  const tray = await page.evaluate(() => ({
    open: document.querySelector('.s3h-tray').classList.contains('is-open'),
    acts: [...document.querySelectorAll('.s3h-act')].map((b) => ({
      name: b.querySelector('.s3h-act-name').textContent,
      off: b.classList.contains('is-off'),
    })),
  }));
  check("Tab 展开行动托盘", tray.open);
  check("托盘内是真实行动（来自 gamedata）", tray.acts.length > 0,
    `${tray.acts.length} 条：${tray.acts.slice(0, 4).map((a) => a.name).join(" / ")}`);
  await page.screenshot({ path: path.join(OUT, "1-shell-hud.png") });

  console.log("\n③ 左键拖拽转视角（原先的第 2 条抱怨）");
  const v0 = (await page.evaluate(() => window.__shell.debug)).view;
  await page.mouse.move(720, 420);
  await page.mouse.down();
  for (let i = 1; i <= 10; i++) { await page.mouse.move(720 + i * 18, 420 + i * 2); await sleep(24); }
  await page.mouse.up();
  await sleep(400);
  const v1 = (await page.evaluate(() => window.__shell.debug)).view;
  check("拖拽后 yaw 真的变了", Math.abs(v1.yaw - v0.yaw) > 0.1,
    `yaw ${v0.yaw.toFixed(3)} → ${v1.yaw.toFixed(3)}（Δ${(v1.yaw - v0.yaw).toFixed(3)}）`);
  await page.screenshot({ path: path.join(OUT, "2-rotated.png") });

  console.log("\n④ 视角回正");
  await page.keyboard.press("KeyR");
  await sleep(400);
  const v2 = (await page.evaluate(() => window.__shell.debug)).view;
  check("R 键回到默认机位", Math.abs(v2.yaw - 0.38) < 0.02 && Math.abs(v2.pitch - 0.76) < 0.02,
    `yaw ${v2.yaw.toFixed(3)} / pitch ${v2.pitch.toFixed(3)}`);

  console.log("\n⑤ 时段照明跟随（拟真,inZOI 的夕阳-暖在地那一挂）");
  const slot0 = await page.evaluate(() => window.__shell.debug.timeSlot);
  await page.keyboard.press("Space");
  await sleep(600);
  const slot1 = await page.evaluate(() => window.__shell.debug.timeSlot);
  await page.keyboard.press("Space");
  await page.keyboard.press("Space");
  await sleep(900);
  const slot2 = await page.evaluate(() => window.__shell.debug.timeSlot);
  check("时段照明跟随 slot 变化", slot0 !== slot1 && slot1 !== slot2,
    `${slot0} → ${slot1} → ${slot2}`);

  /* ★ 夜间路灯 —— P0-3 的核心：夜间靠**人工光源**而不是靠环境光。
     这条断言存在的意义是分清两种失败：「没找到灯锚点」与「找到了但太弱」——
     两者的修法完全不同（前者查 collectLamps/mergeStatics，后者调 intensity）。
     没有这个读数时，夜间太暗只能靠猜。 */
  const nightDbg = await page.evaluate(() => ({
    d: window.__shell.debug,
    scan: window.__shell.view3d ? window.__shell.view3d.stats.lampScan : null,
  }));
  check("夜间路灯已点亮（灯锚点已收集 + 光源已生成）",
    nightDbg.d.lampAnchors > 0 && nightDbg.d.lamps > 0,
    `灯锚点 ${nightDbg.d.lampAnchors} 个 · 点亮 ${nightDbg.d.lamps} 盏 · 遍历统计 ${JSON.stringify(nightDbg.scan)}`);
  await page.screenshot({ path: path.join(OUT, "4-time-dusk.png") });

  /* ★ 主光方向必须真的跟着时段变 —— 这条断言是为一个真实的「修了一半」加的：
       原先 loop() 每帧写死 sun.position = 玩家 + (16,22,-14)，
       把 applyTimeSlot 里 sun.position.set(...preset.sunPos) 每帧覆盖掉。
       于是 SLOT_PRESETS 的 sunPos（傍晚 [-26,10,20] 的斜阳）从来没生效过，
       只有 IBL 天空贴图用了它 ——「天空是夕阳、影子却是正午」。
       它不报错、不黑屏、画面也不难看，所以一直没被发现。
       断言方式：比较白天与夜间的光向读数（不硬编码具体方向，避免引入第二份定义）。 */
  const nightFx = await page.evaluate(() => window.__shell.debug);
  check("主光方向随时段变化（不再被每帧写死成正午）",
    !!sunDirDay && !!nightFx.sun && JSON.stringify(nightFx.sun.dir) !== JSON.stringify(sunDirDay),
    `白天 ${sunDirDay && sunDirDay.join(',')} → 夜间 ${nightFx.sun && nightFx.sun.dir.join(',')}`);
  check("主光位置仍是跟随玩家（方向 × 固定距离）",
    !!nightFx.sun && nightFx.sun.dist > 0 && nightFx.sun.dist < 110,
    `SUN_DIST=${nightFx.sun && nightFx.sun.dist}（须落在 shadow.camera 的 near 1 / far 110 之间）`);
  check("夜间 Bloom 已开启（路灯辉光）",
    !!nightFx.postFx && nightFx.postFx.bloomEnabled === true,
    `bloomEnabled=${nightFx.postFx && nightFx.postFx.bloomEnabled}`);

  console.log("\n⑥ 点击行动 → 状态变化");
  const before = await page.evaluate(() => document.querySelector('[data-f="apText"]').textContent);
  const clicked = await page.evaluate(() => {
    const b = [...document.querySelectorAll('.s3h-act')].find((x) => !x.classList.contains('is-off'));
    if (!b) return null;
    const name = b.querySelector('.s3h-act-name').textContent;
    b.click();
    return name;
  });
  await sleep(600);
  const after = await page.evaluate(() => document.querySelector('[data-f="apText"]').textContent);
  check("点击行动有真实反馈（AP 下降）", !!clicked && before !== after,
    `${clicked}：AP ${before} → ${after}`);

  console.log("\n⑦ 去处列表 + 切换地点");
  await page.keyboard.press("KeyM");
  await sleep(500);
  const mapOpen = await page.evaluate(() => !document.querySelector('[data-f="map"]').hidden);
  const locCount = await page.evaluate(() => document.querySelectorAll('.s3h-loc').length);
  check("M 打开去处列表", mapOpen, `${locCount} 个地点可选`);
  const beforeLoc = (await page.evaluate(() => window.__shell.debug)).locationId;
  const actsBefore = await page.evaluate(() =>
    [...document.querySelectorAll('.s3h-act-name')].map((e) => e.textContent));
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.s3h-loc')].find((x) => x.dataset.id !== window.__shell.debug.locationId);
    b.click();
  });
  await sleep(2400);
  const afterLoc = (await page.evaluate(() => window.__shell.debug)).locationId;
  const tris2 = (await page.evaluate(() => window.__shell.debug)).tris;
  check("切换地点后 3D 重建且 HUD 跟随", afterLoc !== beforeLoc && tris2 > 1000,
    `${beforeLoc} → ${afterLoc}（${tris2} 三角面）`);

  /* ★ 断言行动托盘跟着换 —— 这条是补上的。
     原先只查了地点名，于是漏掉一个真 bug：readActions 读的是页面本地的
     curId，travel 只更新了外壳的 locationId，行动托盘就一直停在旧地点的
     行动上，点下去执行的是别处的事。地点名对、行动列表错，断言全绿。 */
  const actsAfter = await page.evaluate(() =>
    [...document.querySelectorAll('.s3h-act-name')].map((e) => e.textContent));
  const same = actsBefore.length === actsAfter.length &&
    actsBefore.every((n, i) => n === actsAfter[i]);
  check("换地点后行动托盘同步换掉（不是停在旧地点）",
    actsBefore.length > 0 && actsAfter.length > 0 && !same,
    `${actsBefore.length} 条 → ${actsAfter.length} 条；` +
    `旧首条「${actsBefore[0]}」/ 新首条「${actsAfter[0]}」`);
  await page.screenshot({ path: path.join(OUT, "3-other-location.png") });

  /* ══════════════════════════════════════════════════════════════════════
     ⑧ 材质与几何（Agent B：P1-1 法线 / P3-1 分辨率+tile / P3-3 倒角）
     ══════════════════════════════════════════════════════════════════════
     为什么这一段的断言全都读「读数」而不是「画面好不好看」：
       这三项的失败模式**全部是静默的**，这是本项目最贵的一课（§4）：
         · 高度图生成了、但 palette 用的是裸 MeshStandardMaterial
           → 法线一张都没挂上，代码全对，画面只是"还是平的"
         · tile 改了、但消费方（kit.js/world.js）还写着 3.2
           → 密度没变，而"改过"的痕迹只在源码里
         · 参数改名（period → ribMM）、调用方没跟
           → 被静默忽略，退回默认值，连警告都没有
       所以断言必须查「法线贴图是否真的挂在材质上」「colorSpace 对不对」
       「tile 基准是多少」「倒角实体的数量」—— 这些读数变了才是真做了。 */

  console.log("\n⑧ 材质与几何（P1-1 / P3-1 / P3-3）");
  const mb = await page.evaluate(() => {
    const d = window.__matDebug;
    const seen = new Set(), walked = new Set();
    let withNormal = 0, total = 0, nsSet = 0, badCS = 0;
    const root = window.__shell.view3d && window.__shell.view3d.scene;
    let chamfers = 0, sills = 0, cgroups = 0;
    if (root) root.traverse((o) => {
      const mats = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : [];
      for (const m of mats) {
        if (!m || walked.has(m.uuid)) continue;
        walked.add(m.uuid); total++;
        if (m.normalMap) {
          withNormal++;
          if (m.normalScale) nsSet++;
          if (m.normalMap.colorSpace === 'srgb' || m.normalMap.colorSpace === 'SRGBColorSpace') badCS++;
          seen.add(m.normalMap.uuid);
        }
      }
      if (o.userData && o.userData.chamfers) { chamfers += o.userData.chamfers; cgroups++; }
      if (o.userData && o.userData.sills) sills += o.userData.sills;
    });
    const surfaces = d ? d.surfaces : [];
    const structural = surfaces.filter((s) => s.kind !== 'sign' && s.kind !== 'glass');
    return {
      tileM: d && d.tileM, ext: d && d.ext, noise: d && d.noise,
      normalsBuilt: d && d.normalMapsBuilt,
      matTotal: total, matWithNormal: withNormal, matNormalScaleSet: nsSet,
      uniqueNormals: seen.size, badColorSpace: badCS,
      covered: structural.filter((s) => s.hasHeight).length, structural: structural.length,
      res1024: [...new Set(surfaces.filter((s) => s.resolution === 1024).map((s) => s.kind))].sort(),
      feet: surfaces.filter((s) => s.metersPerRepeat === 2.4).length,
      chamfers, sills, chamferGroups: cgroups,
    };
  });

  check("程序化法线贴图已生成并**真的挂到材质上**（不是只生成了）",
    mb.normalsBuilt > 0 && mb.matWithNormal > 0,
    `生成 ${mb.normalsBuilt} 张 · 挂到 ${mb.matWithNormal}/${mb.matTotal} 个材质 · 去重 ${mb.uniqueNormals} 张`);
  check("法线贴图 colorSpace = NoColorSpace（写成 sRGB 会扭曲方向且不报错）",
    mb.badColorSpace === 0, `错误数 ${mb.badColorSpace}`);
  check("每个挂法线的材质都设了 normalScale（§6.2 分材质强弱）",
    mb.matWithNormal > 0 && mb.matNormalScaleSet === mb.matWithNormal,
    `${mb.matNormalScaleSet}/${mb.matWithNormal}`);
  /* 覆盖率断言：排除 sign / glass —— 招牌与玻璃是平面标识物，本来就不该有凹凸。
     把它们算进分母会让这条断言永远不可能 100%，反而失去意义。 */
  check("结构性材质 100% 覆盖法线贴图（排除平面标识物）",
    mb.structural > 0 && mb.covered === mb.structural,
    `${mb.covered}/${mb.structural}`);

  check("纹理分辨率：外墙类已提到 1024²（砖缝/瓷砖缝读得出来）",
    mb.ext === 1024 && mb.res1024.length >= 3,
    `EXT=${mb.ext} · 1024 材质类：${mb.res1024.join(', ') || '无'}`);
  check("无结构噪声类保持 512²（水泥/沥青/草地，省显存）",
    mb.noise === 512, `NOISE=${mb.noise}`);
  check("tile 密度降到真实尺度 2.4m（原 3.2~4.5m）",
    mb.tileM === 2.4 && mb.feet > 20, `TILE_M=${mb.tileM}m · 按此尺度生成的表面 ${mb.feet} 个`);

  /* 倒角数量的读数**必须在"有住宅楼的地点"取**：
     ⑧ 段跑在 ⑦ 切地点之后（当前是批发市场），那里主体是厂房(shed)/摊位，
     不走 lowRise/slabBlock/tower 这些带角棱条的工厂 ——
     于是同一套代码在 slum 数出 96 根、在批发市场只数出 16 根。
     这不是"倒角没了"，是**取样点选错了**（本项目第 14 类模式：
     「度量与想度量的东西不是同一个东西」）。
     所以这里显式切回 slum 再数 —— 并顺带断言"切回去之后确实变多"，
     这样断言本身就带上了对照，不依赖某个固定数字。 */
  await page.keyboard.press("KeyM");
  await sleep(400);
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.s3h-loc')].find((x) => x.dataset.id === 'slum');
    if (b) b.click();
  });
  await sleep(2400);
  const ch2 = await page.evaluate(() => {
    let chamfers = 0, groups = 0, sills = 0;
    const root = window.__shell.view3d && window.__shell.view3d.scene;
    if (root) root.traverse((o) => {
      if (o.userData && o.userData.chamfers) { chamfers += o.userData.chamfers; groups++; }
      if (o.userData && o.userData.sills) sills += o.userData.sills;
    });
    return { chamfers, groups, sills, loc: window.__shell.debug.locationId };
  });
  check("几何倒角：住宅类地点竖向压边数量（打破 90° 硬边）",
    ch2.chamfers > 40 && ch2.groups > 8,
    `${ch2.loc}:${ch2.chamfers} 根角棱条 / ${ch2.groups} 栋 · 洞口压边 ${ch2.sills} 条（批发市场同口径仅 ${mb.chamfers} 根）`);
  await page.screenshot({ path: path.join(OUT, "5-materials-geometry.png") });

  /* 单帧 draw call 上限 —— 倒角会把几何体数量抬上去（每栋多 2~4 个盒）。
     这条断言是**成本护栏**：如果以后有人把倒角写成"全包一圈"或给每个窗都补洞口边，
     draw call 会翻倍，而这一点在画面上看不出来（只是帧率掉了）。
     实测基线 ≈ 240；留 1.6 倍余量到 400。 */
  const dc = s0.calls;
  check("单帧 draw call 仍在护栏内（倒角没把成本抬爆）",
    dc > 0 && dc < 400, `${dc} 次（基线 ≈240，护栏 400）`);

  await page.screenshot({ path: path.join(OUT, "5-materials-geometry.png") });

  console.log("\n=== 页面报错 ===");
  if (errors.length) errors.slice(0, 6).forEach((e) => console.log("   ❌ " + e.slice(0, 150)));
  else console.log("   （无）");
  check("无页面报错", errors.length === 0, errors.length ? `${errors.length} 条` : "0 条");
  if (noise.length) console.log(`   ℹ️  已忽略 ${noise.length} 条浏览器自动请求噪声（favicon）`);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图：${path.relative(ROOT, OUT)}`);
  await browser.close();
  await closeServer(own);
  process.exit(fail ? 1 : 0);
}

main().catch((e) => { console.error("验证失败:", e); process.exit(1); });
