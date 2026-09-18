/**
 * 把 scene3d 核心打包成旧管线可用的普通 JS
 *
 * 为什么需要这一步：
 *   3D 核心写在 src/app/scene3d（TypeScript + three.js 依赖），
 *   而正式入口是 src/index.html + python build.py（纯 JS 串接，不认 TS/import）。
 *   故先打包成 IIFE，挂到 window.Scene3D，再由普通的 <script src> 引入。
 *
 * 产物：src/js/scene3d.bundle.js（会被 build.py 自动内联进 dist/app.js）
 */

const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const ENTRY = path.join(ROOT, "src/app/scene3d/index.ts");
const OUT = path.join(ROOT, "src/js/scene3d.bundle.js");

const result = esbuild.buildSync({
  entryPoints: [ENTRY],
  bundle: true,
  write: false,
  format: "iife",
  globalName: "Scene3D",
  platform: "browser",
  target: "es2020",
  minify: true,
  legalComments: "none",
  logLevel: "warning",
  banner: {
    js:
      "/* 自动生成，请勿手工编辑。\n" +
      "   源：src/app/scene3d/  构建：node scripts/build-scene3d-bundle.cjs\n" +
      "   改动请改源文件后重新构建，直接编辑本文件会在下次构建时被覆盖。 */",
  },
});

const code = result.outputFiles[0].text;
fs.writeFileSync(OUT, code, "utf8");

const kb = (code.length / 1024).toFixed(0);
console.log(`已产出 src/js/scene3d.bundle.js (${kb} KB)`);

// 自检：产物应为 IIFE 且不含裸 import（旧管线不做模块解析）
if (/^\s*import\s/m.test(code)) {
  console.error("❌ 产物含裸 import，旧管线无法加载");
  process.exit(1);
}
if (!/var Scene3D|Scene3D\s*=/.test(code)) {
  console.error("❌ 产物未暴露 Scene3D 全局");
  process.exit(1);
}
console.log("自检通过：IIFE 格式，已暴露 window.Scene3D");
