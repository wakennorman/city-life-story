/**
 * 声望纯函数集 — TS↔vanilla 双向比对单测
 * 模式：esbuild(bundle) 转译 TS 端口 + vm 加载正在运行的 vanilla reputation.js，逐项比对
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const TS_ENTRY = path.join(ROOT, "src/app/core/reputation/index.ts");
const VANILLA = path.join(ROOT, "src/js/phase1/reputation.js");

// --- 加载 TS 端口（esbuild bundle → 临时 cjs → require） ---
const tsResult = esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  write: false,
  format: "cjs",
  platform: "node",
});
const tmpTs = path.join(os.tmpdir(), `rep_ts_${Date.now()}.cjs`);
fs.writeFileSync(tmpTs, tsResult.outputFiles[0].text);
const TS = require(tmpTs);

// --- 加载 vanilla reputation.js（vm 上下文，取函数定义，非 exports） ---
const vanillaSrc = fs.readFileSync(VANILLA, "utf8");
const ctx = { console, Math, Date, JSON, module: { exports: {} }, exports: {}, window: {} };
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);
const V = ctx; // 顶层 function 声明落在 ctx 上

let pass = 0,
  fail = 0;
function assert(cond, label) {
  if (cond) {
    pass++;
  } else {
    fail++;
    console.error("  ✗ FAIL: " + label);
  }
}
function eq(a, b, label) {
  assert(a === b, `${label} (got ${JSON.stringify(a)}, want ${JSON.stringify(b)})`);
}

// --- 测试场景：声望数值梯度 ---
const REP_VALUES = [undefined, "empty", -5, 0, 9, 10, 24, 25, 49, 50, 74, 75, 89, 90, 100, 150];
const LOC_PRESENT = "slum";
const LOC_MISSING = "nowhere";

function makeState(repRaw) {
  const reputation = {};
  if (repRaw === undefined) return { reputation: undefined }; // 缺失 reputation 字段
  if (repRaw === "empty") return { reputation: {} };
  reputation[LOC_PRESENT] = repRaw;
  return { reputation };
}

console.log(`比对声望纯函数集: TS ${Object.keys(TS).length} 导出 / vanilla ${typeof V.getReputation}`);

for (const repRaw of REP_VALUES) {
  const state = makeState(repRaw);
  for (const locKey of [LOC_PRESENT, LOC_MISSING]) {
    eq(TS.getReputation(state, locKey), V.getReputation(state, locKey), `getReputation rep=${repRaw} loc=${locKey}`);
    eq(TS.getRepLevel(state, locKey), V.getRepLevel(state, locKey), `getRepLevel rep=${repRaw} loc=${locKey}`);
    eq(TS.getRepTitle(state, locKey), V.getRepTitle(state, locKey), `getRepTitle rep=${repRaw} loc=${locKey}`);
    eq(TS.getRepDesc(state, locKey), V.getRepDesc(state, locKey), `getRepDesc rep=${repRaw} loc=${locKey}`);
    eq(
      TS.getRepPayMultiplier(state, locKey),
      V.getRepPayMultiplier(state, locKey),
      `getRepPayMultiplier rep=${repRaw} loc=${locKey}`
    );
  }
}

// --- 多地点独立验证（声望按 locKey 隔离） ---
const multiState = { reputation: { slum: 10, bank: 90, techPark: 50 } };
for (const [loc, expectLevel] of [["slum", 1], ["bank", 5], ["techPark", 3]]) {
  eq(TS.getRepLevel(multiState, loc), V.getRepLevel(multiState, loc), `multi getRepLevel loc=${loc}`);
  eq(TS.getReputation(multiState, loc), V.getReputation(multiState, loc), `multi getReputation loc=${loc}`);
}

fs.unlinkSync(tmpTs);

console.log(`\n声望比对结果: ${pass} passed, ${fail} failed`);
if (fail > 0) {
  console.error("❌ 存在不一致");
  process.exit(1);
} else {
  console.log("✅ TS 端口与 vanilla 完全等价");
}
