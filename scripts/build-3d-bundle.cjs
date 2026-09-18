/**
 * 把 3D 场景层内核打包成旧管线可用的普通 JS
 *
 * 为什么需要这一步：
 *   3D 内核是 ESM + three.js 依赖（写在 src/app/3d/），
 *   而正式入口是 src/index.html + python build.py（纯 JS 串接，不认 import）。
 *   故先打成 IIFE，挂 window.Scene3D，再由普通 <script src> 引入。
 *
 * 与旧版脚本的差别：
 *   旧版打的是 src/app/scene3d/index.ts（硬编码模板那套，已废弃）。
 *   现在打的是 src/app/3d/（迁移自 experiments/3d 的成熟内核）。
 *
 * 用法：
 *   node scripts/build-3d-bundle.cjs              # 产出 src/js/scene3d.bundle.js
 *   node scripts/build-3d-bundle.cjs --out X.js   # 产出到指定路径（验证用）
 *   node scripts/build-3d-bundle.cjs --entry P.js # 换入口（隔离验证用，见下）
 *
 * ★ --entry 的用途：多 Agent 并行时，别人可能正在改 src/app/3d 下的**别的文件**
 *   （比如 materials.js），此时从默认入口构建会把别人的半成品一起打进来，
 *   于是自己的改动无法独立验证。--entry 可指向一棵隔离的源码树
 *   （复制 src/app/3d → .tmp-probe/xxx，只把别人的文件回退到 HEAD），
 *   从而把自己的改动与别人的进行中状态解耦。
 *
 * 产物：src/js/scene3d.bundle.js（会被 build.py 自动内联进 dist/app.js）
 */

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const entryArgIdx = process.argv.indexOf("--entry");
const ENTRY = entryArgIdx > -1
  ? path.resolve(ROOT, process.argv[entryArgIdx + 1])
  : path.join(ROOT, "src/app/3d/index.js");

const outArgIdx = process.argv.indexOf("--out");
const OUT = outArgIdx > -1
  ? path.resolve(ROOT, process.argv[outArgIdx + 1])
  : path.join(ROOT, "src/js/scene3d.bundle.js");

const result = esbuild.buildSync({
  entryPoints: [ENTRY],
  bundle: true,
  write: false,
  format: "iife",
  globalName: "Scene3D",
  platform: "browser",
  target: "es2020",
  minify: true,
  /* 必须显式设 utf8：esbuild 默认 charset='ascii'，会把中文转义成 \uXXXX，
     每个汉字从 3 字节膨胀到 6 字节（29 个地点的名称/描述/氛围文案量很大），
     而且产物里再也搜不到中文字面量，让"数据是否真的内联"无法自检。 */
  charset: "utf8",
  legalComments: "none",
  logLevel: "warning",
  loader: { ".json": "json" },
  banner: {
    js:
      "/* 自动生成，请勿手工编辑。\n" +
      "   源：src/app/3d/  构建：node scripts/build-3d-bundle.cjs\n" +
      "   数据：src/app/3d/gamedata.json（由 scripts/extract-3d-data.mjs 从游戏本体生成）\n" +
      "   改动请改源文件后重新构建，直接编辑本文件会在下次构建时被覆盖。 */",
  },
});

const code = result.outputFiles[0].text;
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, code, "utf8");

const kb = (code.length / 1024).toFixed(0);
console.log(`已产出 ${path.relative(ROOT, OUT)} (${kb} KB)`);

// ── 自检：产物必须能被旧管线安全加载 ──────────────────────────────────────
const problems = [];

if (/^\s*import\s/m.test(code)) {
  problems.push("产物含裸 import，旧管线（无模块解析）无法加载");
}
if (!/Scene3D\s*=/.test(code)) {
  problems.push("产物未暴露 Scene3D 全局");
}
// 数据内联检查：抽出个数应当与数据桥产出一致
const gd = JSON.parse(fs.readFileSync(path.join(ROOT, "src/app/3d/gamedata.json"), "utf8"));
const expect = Object.keys(gd.locations).length;
for (const probe of [gd.locations.slum ? gd.locations.slum.name : "", "城中村"]) {
  if (probe && !code.includes(probe)) {
    problems.push(`产物中找不到内联数据（探测串 "${probe}"），gamedata 可能未被打入`);
    break;
  }
}

if (problems.length) {
  console.error("❌ 自检未通过：");
  for (const p of problems) console.error("   · " + p);
  process.exit(1);
}

console.log(`自检通过：IIFE 格式 · 已暴露 window.Scene3D · 内联 ${expect} 个地点`);
