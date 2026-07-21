/**
 * 情绪元数据双向比对单测 (TS↔vanilla)
 * 验证 src/app/core/emotion/meta.ts 的 getEmotionIcon/getEmotionName
 * 与 src/js/phase1/needs.js 实现逐结果等价。
 *
 * 模式同 batch7: esbuild(bundle) 打 TS 端口 → require(临时文件);
 * vm 加载 needs.js 运行时，从 ctx 提取全局函数比对。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

let passed = 0;
let failed = 0;

// ===== 1) TS 规范源端口 (bundle 含相对依赖) =====
const tsEntry = path.join(__dirname, "../src/app/core/emotion/meta.ts");
const bundleOut = esbuild.buildSync({
  entryPoints: [tsEntry],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpTs = path.join(os.tmpdir(), "cls_emometa_" + Date.now() + ".cjs");
fs.writeFileSync(tmpTs, bundleOut.outputFiles[0].text);
const ts = require(tmpTs);
fs.unlinkSync(tmpTs);

// ===== 2) vanilla 运行时 (vm 加载，从 ctx 提取全局函数) =====
const vanillaPath = path.join(__dirname, "../src/js/phase1/needs.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const ctx = { Math, console, module: { exports: {} }, exports: {}, window: {} };
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);

// ===== 3) 双向比对 =====
const EMOTIONS = [
  "depressed", "sad", "stressed", "stable", "happy", "elated",
  "angry", "unknown_value", "", // 未知字符串 + 空串回退
];
const states = EMOTIONS.map((e) => ({ status: { emotionalState: e } }));
// 额外: emotionalState 缺失
states.push({ status: {} });
states.push({ status: { emotionalState: undefined } });

const tsIcon = ts.getEmotionIcon;
const vIcon = ctx.getEmotionIcon;
const tsName = ts.getEmotionName;
const vName = ctx.getEmotionName;

if (
  typeof tsIcon !== "function" || typeof vIcon !== "function" ||
  typeof tsName !== "function" || typeof vName !== "function"
) {
  failed++;
  console.error(`✗ 函数缺失 (tsIcon=${typeof tsIcon}, vIcon=${typeof vIcon}, tsName=${typeof tsName}, vName=${typeof vName})`);
} else {
  for (const st of states) {
    const label = st.status.emotionalState === undefined
      ? (st.status.hasOwnProperty("emotionalState") ? "undefined" : "missing")
      : JSON.stringify(st.status.emotionalState);
    const ti = tsIcon(st);
    const vi = vIcon(st);
    if (ti === vi) passed++;
    else { failed++; console.error(`✗ ICON(${label}): TS=${ti} vanilla=${vi}`); }
    const tn = tsName(st);
    const vn = vName(st);
    if (tn === vn) passed++;
    else { failed++; console.error(`✗ NAME(${label}): TS=${tn} vanilla=${vn}`); }
  }
}

const total = passed + failed;
console.log(`情绪元数据 TS↔vanilla 比对: ${passed}/${total} 通过`);
if (failed > 0) {
  console.error(`❌ ${failed} 项不等价`);
  process.exit(1);
} else {
  console.log("✅ 全部等价");
}
