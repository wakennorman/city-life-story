/**
 * 外部 3D 资产（Kenney CC0 GLB）接入验证
 *
 * 为什么单独一个脚本，而不是塞进 verify-3d-shell：
 *   verify-3d-shell 断言的是"外壳形态"，它跑在生产布局（dist/）之外的 dev 预览页。
 *   而外部资产链有**自己独立的一串失败模式**，每一条都能"静默通过外观检查"：
 *     ① 路径不对 → 404 → 静默降级到程序化几何 → 画面正常，但外部资产一个没加载；
 *     ② CSP 拦了 → 同样静默降级；
 *     ③ GLB 载入但贴图没解析 → 模型是黑的/纯色的，肉眼很难一眼看出；
 *     ④ pumpAssets 时机错 → 兜底几何永远不被替换（画面也"正常"）。
 *   所以本脚本的每一条断言都必须能区分「真的用了 GLB」和「静静退回了兜底」。
 *
 * 用法：node scripts/verify-3d-assets.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const DIR = path.join(ROOT, "dev/_3dtest");
const OUT = path.join(DIR, "shots-assets");
const PORT = 8977;
const DOC = "/dev/_3dtest/assets-probe.html";
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

  // 先重建探针包（与 verify-3d-shell 同样的理由：页面加载的是构建产物）
  execFileSync(process.execPath,
    [path.join(__dirname, "build-3d-bundle.cjs"), "--out", "dev/_3dtest/bundle-probe.js"],
    { cwd: ROOT, stdio: "inherit" });

  /* ── 静态前置检查：资产文件确实在磁盘上 ──────────────────────────────
     这一层不依赖浏览器，跑在最前面 —— 如果资产压根没落盘，
     后面的浏览器断言再绿也没有意义。 */
  const assetDir = path.join(ROOT, "src/assets/kenney");
  check("资产目录存在", fs.existsSync(assetDir), assetDir);
  const manifest = JSON.parse(fs.readFileSync(path.join(assetDir, "manifest.json"), "utf8"));
  const total = Object.values(manifest).reduce((n, a) => n + a.length, 0);
  check("清单登记 173 个模型", total === 173, `实际 ${total}`);
  check("许可台账存在（CC0 登记）", fs.existsSync(path.join(assetDir, "LICENSE.md")));

  // 每个 kit 都必须有自己的 colormap —— 三份内容不同，混放会串色
  const cols = ["commercial", "industrial", "roads"].map((k) => {
    const p = path.join(assetDir, k, "Textures/colormap.png");
    return fs.existsSync(p) ? fs.readFileSync(p).length : 0;
  });
  check("三套 kit 各自带 colormap 且互不相同（混放会串色）",
    cols.every((c) => c > 0) && new Set(cols).size === 3, `字节数 ${cols.join(" / ")}`);

  /* ── 生产布局检查：build.py 是否会把资产复制到 dist/ ───────────────── */
  const distAssets = path.join(ROOT, "dist/assets/kenney");
  if (fs.existsSync(distAssets)) {
    const n = Object.values(manifest).reduce((acc, arr) => acc + arr.length, 0);
    const onDisk = ["commercial", "industrial", "roads"]
      .reduce((c, k) => c + fs.readdirSync(path.join(distAssets, k)).filter((f) => f.endsWith(".glb")).length, 0);
    check("dist/assets 里的 GLB 数与清单一致", onDisk === n, `${onDisk} / ${n}`);
  } else {
    check("dist/assets 存在（先跑 python build.py）", false, "未找到，跳过");
  }
  // CSP 必须放行同源 connect
  const headers = fs.readFileSync(path.join(ROOT, "dist/_headers"), "utf8");
  check("CSP 已放行 connect-src 'self'（否则 fetch GLB 被拦）",
    /connect-src\s+'self'/.test(headers));

  const own = await ensureServer({ root: ROOT, port: PORT, label: "3D 资产探针" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });

  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e.message || e)));
  /* ★ 记录所有 404 —— 这是"资产路径写错"的唯一可靠信号。
     只看画面是看不出来的：GLB 404 之后会静默降级到程序化几何。 */
  const notFound = [];
  page.on("response", (r) => { if (r.status() === 404) notFound.push(r.url()); });

  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 60000 });

  /* 把探针暴露的读取口准备好 */
  await page.waitForFunction(() => window.__assetProbe && window.__assetProbe.ready, { timeout: 30000 });

  const info = await page.evaluate(() => window.__assetProbe.snapshot());

  console.log("\n① 资产根路径");
  /* ★ 期望值在 2026-09-18 随"两源并存"改动而更新。
     原先是 `/src/assets/kenney` —— 那是只有 Kenney 一个源时的形状。
     现在 base 是**资产根** `src/assets/`，两个源各自在其下分支：
       kenney/…        （Kenney 三套 kit）
       polyhaven/…     （Poly Haven 模型/HDRI/贴图）
     所以断言应该查"根"，而不是查某个源的子目录 ——
     查子目录会让"再加一个源"永远触发假失败。 */
  check("探针指向资产根 src/assets（dev 布局覆盖生效）",
    /\/src\/assets\/?$/.test(info.base), info.base);

  console.log("\n② 真实网络请求（GLB 是不是真的被取下来了）");
  check("产生了 GLB 请求（不是全部走缓存/跳过）", info.requests.length > 0, `${info.requests.length} 个`);
  check("GLB 请求全部 2xx（没有 404 静默降级）",
    info.failed === 0, `失败 ${info.failed}`);
  /* ★ 排除降级自测自己发起的那个请求。
     探针会故意请求一个不存在的模型名来证明"失败时返回 null 而不是抛异常"，
     那个请求必然 404 —— 它是**被测行为的一部分**，不是缺陷。
     不过滤的话，这条断言会永久失败（把自证当成 bug）。 */
  const noGlb404 = notFound.filter(
    (u) => /\.glb(\?|$)/.test(u) && !/__definitely_missing_model__/.test(u));
  check("无 .glb 404（路径与 kit 子目录结构正确）",
    noGlb404.length === 0, noGlb404.slice(0, 3).join(" , ") || "0 条（已排除降级自测的故意 404）");

  console.log("\n③ 加载器运行态");
  check("加载器报告 ready > 0", info.report.ready > 0,
    `ready ${info.report.ready} / failed ${info.report.failed} / 请求 ${info.report.requested}`);
  check("加载失败数为 0", info.report.failed === 0,
    info.report.failures.map((f) => f.key + ": " + f.error).join(" ; ") || "0");

  console.log("\n④ 替换链路（兜底几何真的被 GLB 换掉了）");
  check("探针能拿到场景根（否则下面的统计都是空集）", info.sceneFound === true,
    `场景子节点 ${info.childGroups}：${(info.childNames || []).join(" , ")}`);
  check("pumpAssets 至少替换了 1 个实例", info.pumped > 0, `${info.pumped} 个`);
  check("被替换的包装 Group 带 ready 标记", info.wrapperFlagged > 0, `${info.wrapperFlagged} 个`);
  check("替换后场景里能找到真实 GLB 对象", info.glbMeshes > 0, `${info.glbMeshes} 个`);
  if (info.slumProbe) {
    console.log(`  ℹ️  slum 组内部：glb 标记 ${info.slumProbe.withGlbMark} / ready ${info.slumProbe.readyMark} / Mesh ${info.slumProbe.meshCount}`);
    console.log(`     样本：${info.slumProbe.sampleKeys.join(" | ")}`);
  }
  check("残留待替换数最终归零", info.pending === 0, `pending ${info.pending}`);
  check("兜底几何已被移除（不出现重影）", info.leftoverFallback === 0,
    `残留兜底 ${info.leftoverFallback} 个`);

  console.log("\n⑤ 贴图解析（GLB 引用的外部 colormap 真的加载了）");
  check("GLB 材质带贴图（不是纯色兜底）", info.texturedMaterials > 0,
    `${info.texturedMaterials} 个带 map 的材质`);
  check("贴图来自 colormap.png（kit 子目录相对路径解析成功）",
    info.textureNames.some((n) => /colormap/i.test(n)) || info.textureLoaded > 0,
    info.textureNames.slice(0, 3).join(" , ") || `递交给纹理 ${info.textureLoaded}`);

  console.log("\n⑤-b 尺寸换算（Kenney 的 1 单位 ≈ 8m，不换算会小到看不见且不报错）");
  /* ★ 这一条是本脚本最有价值的一条断言。
     模型"加载成功"与"尺寸正确"是两件事：Kenney 的模型按 1 单位 = 1 格建，
     直接放进以米为单位的场景里会变成几个像素大的小点 —— 没有报错、
     贴图正常、材质正常，只有尺寸错。靠肉眼在缩略图上几乎看不出来。 */
  check("GLB 实例被放大约 8 倍（已做单位换算）", info.glbScale > 1.5,
    `实测缩放 ${info.glbScale}`);
  check("缩放后单物件高度落在合理区间（0.5m ~ 30m）", info.glbMaxDim > 0.5 && info.glbMaxDim < 30,
    `最大尺寸 ${info.glbMaxDim}m`);

  console.log("\n⑥ 降级必须真的存在（不是「永不失败的假绿」）");
  check("基础路径错误时加载器返回 null 而非抛异常", info.degradeOk === true,
    info.degradeDetail);

  console.log("\n⑦ 截图取证");
  await page.screenshot({ path: path.join(OUT, "assets-01-loaded.png") });
  console.log(`  · assets-01-loaded.png`);

  console.log("\n=== 页面报错 ===");
  if (errors.length === 0) console.log("  （无）");
  else errors.forEach((e) => console.log("  ❌ " + e));
  check("无页面报错", errors.length === 0, `${errors.length} 条`);

  await browser.close();
  await closeServer(own);

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════`);
  console.log(`截图：${path.relative(ROOT, OUT)}`);
  process.exit(fail ? 1 : 0);
}

main().catch(async (e) => {
  console.error("验证脚本自身出错:", e);
  process.exit(2);
});
