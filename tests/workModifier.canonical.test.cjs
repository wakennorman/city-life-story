/**
 * 情绪工作修正纯函数 —— TS 规范源 ↔ 运行中 vanilla 双向比对
 *
 * 模式同 batch1-6:
 *   (1) esbuild(bundle) 把 src/app TS 端口打进 CJS 后加载
 *   (2) vm 加载 src/js/phase1/needs.js 运行时，提取全局 getEmotionWorkModifier
 *   (3) 对每个情绪状态（含 2 个回退态），比对 TS 输出对象 == vanilla 输出对象
 * 任一字段偏差即判"端口不等价"，强制暴露迁移回归。
 *
 * 本函数零外部依赖，是纯映射查表，故 vm 上下文无需 StateManager 等全局。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

const EPS = 1e-9;
let passed = 0;
let failed = 0;

const KEYS = ["pay", "injury", "skillXp"];

function checkObj(name, tsVal, vanillaVal) {
  if (!tsVal || !vanillaVal) {
    const ok = tsVal === undefined && vanillaVal === undefined;
    if (ok) {
      passed++;
    } else {
      failed++;
      console.error(`  ✗ ${name}: TS=${JSON.stringify(tsVal)} vanilla=${JSON.stringify(vanillaVal)}`);
    }
    return;
  }
  let ok = true;
  for (const k of KEYS) {
    if (Math.abs((tsVal[k] || 0) - (vanillaVal[k] || 0)) >= EPS) ok = false;
  }
  if (ok) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ ${name}: TS=${JSON.stringify(tsVal)} vanilla=${JSON.stringify(vanillaVal)}`);
  }
}

// ===== 1) TS 规范源端口 (bundle 含相对依赖) =====
const tsEntry = path.join(__dirname, "../src/app/core/emotion/workModifier.ts");
const bundleOut = esbuild.buildSync({
  entryPoints: [tsEntry],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpTs = path.join(os.tmpdir(), "cls_emo_" + Date.now() + ".cjs");
fs.writeFileSync(tmpTs, bundleOut.outputFiles[0].text);
const ts = require(tmpTs);
fs.unlinkSync(tmpTs);

// ===== 2) vanilla 运行时 (vm 加载，提取全局函数) =====
const vanillaPath = path.join(__dirname, "../src/js/phase1/needs.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const ctx = { Math, console, module: { exports: {} }, exports: {}, window: {} };
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);

// ===== 3) 双向比对 =====
// 6 个合法情绪状态 + 2 个回退态 (缺失/未知 → stable)
const states = [
  { status: { emotionalState: "depressed" } },
  { status: { emotionalState: "sad" } },
  { status: { emotionalState: "stressed" } },
  { status: { emotionalState: "stable" } },
  { status: { emotionalState: "happy" } },
  { status: { emotionalState: "elated" } },
  { status: {} }, // emotionalState 缺失 → stable
  { status: { emotionalState: "unknown_value" } }, // 未知 → stable
];

const tsFn = ts.getEmotionWorkModifier;
const vanillaFn = ctx.getEmotionWorkModifier;
if (typeof tsFn !== "function" || typeof vanillaFn !== "function") {
  failed++;
  console.error(`  ✗ getEmotionWorkModifier: 函数缺失 (ts=${typeof tsFn}, vanilla=${typeof vanillaFn})`);
} else {
  for (let i = 0; i < states.length; i++) {
    const st = states[i];
    const label = st.status.emotionalState || (st.status.hasOwnProperty("emotionalState") ? "undefined" : "missing");
    checkObj(`getEmotionWorkModifier(${label})`, tsFn(st), vanillaFn(st));
  }
}

// ===== 结果 =====
const total = passed + failed;
console.log(`情绪工作修正 TS↔vanilla 比对: ${passed}/${total} 通过`);
if (failed > 0) {
  console.error(`❌ ${failed} 项不等价`);
  process.exit(1);
} else {
  console.log("✅ 全部等价");
}
