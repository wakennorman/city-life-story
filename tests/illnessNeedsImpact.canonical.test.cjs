// 阶段3批次11 — getIllnessNeedsImpact TS↔vanilla 双向比对单测
// 范式：esbuild(bundle) 转译 TS + vm 加载 vanilla 运行时(illnesses.js+illness.js 拼为单脚本)
// 两者注入同一份 ILLNESSES 配置，逐项比对 needs/health 五维影响。
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const os = require("os");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const TS_SRC = path.join(ROOT, "src/app/core/illness/needsImpact.ts");
const VANILLA_DATA = path.join(ROOT, "src/js/data/illnesses.js");
const VANILLA_LOGIC = path.join(ROOT, "src/js/phase1/illness.js");

// ---- TS 侧：esbuild 转译 + 临时 cjs ----
const out = esbuild.buildSync({
  entryPoints: [TS_SRC],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmp = path.join(os.tmpdir(), "illness_needs_impact_" + Date.now() + ".cjs");
fs.writeFileSync(tmp, out.outputFiles[0].text);
const TS = require(tmp);
const getIllnessNeedsImpactTS = TS.getIllnessNeedsImpact;

// ---- vanilla 侧：illnesses.js + illness.js 拼为单脚本，捕获 ILLNESSES/getIllnessNeedsImpact ----
const dataSrc = fs.readFileSync(VANILLA_DATA, "utf8");
const logicSrc = fs.readFileSync(VANILLA_LOGIC, "utf8");
const combined =
  dataSrc + "\n" + logicSrc +
  "\n;({ILLNESSES: (typeof ILLNESSES!=='undefined'?ILLNESSES:null), getIllnessNeedsImpact: (typeof getIllnessNeedsImpact!=='undefined'?getIllnessNeedsImpact:null)});";
const sandbox = { Math, Date, console, JSON };
const ctx = vm.createContext(sandbox);
const captured = vm.runInContext(combined, ctx);
const ILLNESSES = captured.ILLNESSES;
const getIllnessNeedsImpactVanilla = captured.getIllnessNeedsImpact;

// ---- 断言工具 ----
let pass = 0, fail = 0;
function assertEq(name, got, exp) {
  const g = JSON.stringify(got);
  const e = JSON.stringify(exp);
  if (g === e) { pass++; }
  else { fail++; console.error(`FAIL ${name}\n  got=${g}\n  exp=${e}`); }
}

// ---- A. 真实 ILLNESSES + 真实疾病 id ----
const REAL = [
  { name: "empty", state: { status: { illnesses: [] } } },
  { name: "cold", state: { status: { illnesses: [{ id: "cold" }] } } },
  { name: "stomach", state: { status: { illnesses: [{ id: "stomach_inflammation" }] } } },
  { name: "malnutrition(no needs fields)", state: { status: { illnesses: [{ id: "malnutrition" }] } } },
  { name: "cold+stomach", state: { status: { illnesses: [{ id: "cold" }, { id: "stomach_inflammation" }] } } },
  { name: "cold x2(duplicate)", state: { status: { illnesses: [{ id: "cold" }, { id: "cold" }] } } },
  { name: "unknown_id", state: { status: { illnesses: [{ id: "zzz_no_such" }] } } },
  { name: "mixed real+unknown", state: { status: { illnesses: [{ id: "cold" }, { id: "nope" }, { id: "stomach_inflammation" }] } } },
  { name: "status but no illnesses", state: { status: {} } },
  { name: "entry without id", state: { status: { illnesses: [{ noid: 1 }, { id: "cold" }] } } },
];
const REAL_EXP = {
  "empty": { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 },
  "cold": { hunger: 0, fatigue: 5, hygiene: 0, happiness: 0, health: -1 },
  "stomach": { hunger: -3, fatigue: 0, hygiene: 0, happiness: 0, health: -2 },
  "malnutrition(no needs fields)": { hunger: 0, fatigue: 3, hygiene: 0, happiness: 0, health: 0 },
  "cold+stomach": { hunger: -3, fatigue: 5, hygiene: 0, happiness: 0, health: -3 },
  "cold x2(duplicate)": { hunger: 0, fatigue: 10, hygiene: 0, happiness: 0, health: -2 },
  "unknown_id": { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 },
  "mixed real+unknown": { hunger: -3, fatigue: 5, hygiene: 0, happiness: 0, health: -3 },
  "status but no illnesses": { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 },
  "entry without id": { hunger: 0, fatigue: 5, hygiene: 0, happiness: 0, health: -1 },
};
for (const c of REAL) {
  const ts = getIllnessNeedsImpactTS(c.state, ILLNESSES);
  const vl = getIllnessNeedsImpactVanilla(c.state);
  assertEq(`REAL[${c.name}] TS==Vanilla`, ts, vl);
  assertEq(`REAL[${c.name}] value`, ts, REAL_EXP[c.name]);
}

// ---- B. 合成配置（确定性逐项累加）----
const SYN = {
  a: { id: "a", symptom: { hunger: 2, hygiene: 4, happiness: -1, fatigue: 3, health: 1 } },
  b: { id: "b", symptom: { hunger: -5, happiness: 10 } },
  c: { id: "c", symptom: { fatigue: -2, health: -4, hygiene: 7 } },
};
const SYN_CONFIG = { a: SYN.a, b: SYN.b, c: SYN.c };
const SYN_CASES = [
  { name: "a", illnesses: [{ id: "a" }], exp: { hunger: 2, fatigue: 3, hygiene: 4, happiness: -1, health: 1 } },
  { name: "a+b", illnesses: [{ id: "a" }, { id: "b" }], exp: { hunger: -3, fatigue: 3, hygiene: 4, happiness: 9, health: 1 } },
  { name: "a+b+a", illnesses: [{ id: "a" }, { id: "b" }, { id: "a" }], exp: { hunger: -1, fatigue: 6, hygiene: 8, happiness: 8, health: 2 } },
  { name: "a+b+c", illnesses: [{ id: "a" }, { id: "b" }, { id: "c" }], exp: { hunger: -3, fatigue: 1, hygiene: 11, happiness: 9, health: -3 } },
  { name: "c only", illnesses: [{ id: "c" }], exp: { hunger: 0, fatigue: -2, hygiene: 7, happiness: 0, health: -4 } },
];
for (const c of SYN_CASES) {
  const state = { status: { illnesses: c.illnesses } };
  const ts = getIllnessNeedsImpactTS(state, SYN_CONFIG);
  const vl = getIllnessNeedsImpactVanilla(state); // vanilla 用全局 ILLNESSES，非 SYN_CONFIG -> 仅比对 TS 自身一致性
  assertEq(`SYN[${c.name}] TS value`, ts, c.exp);
  // vanilla 用真实 ILLNESSES，无法对应合成配置；仅校验 TS 端口确定性
}

// ---- C. 空配置（默认零影响，TS 侧防御性）----
assertEq("empty config TS", getIllnessNeedsImpactTS({ status: { illnesses: [{ id: "cold" }] } }, {}),
  { hunger: 0, fatigue: 0, hygiene: 0, happiness: 0, health: 0 });

// ---- 清理临时文件 ----
try { fs.unlinkSync(tmp); } catch (e) {}

console.log(`getIllnessNeedsImpact 双向比对: ${pass} passed, ${fail} failed`);
if (fail > 0) { console.error("❌ 存在失败用例"); process.exit(1); }
console.log("✅ TS 端口与 vanilla 严格等价 (getIllnessNeedsImpact)");
