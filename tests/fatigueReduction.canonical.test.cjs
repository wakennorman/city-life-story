/**
 * 技能-疲劳减免纯函数 —— TS 规范源 ↔ 运行中 vanilla 双向比对
 *
 * 模式同 skillBonuses.canonical.test.cjs（esbuild bundle + vm 加载 vanilla）：
 *   (1) 用本地 esbuild(bundle) 把 src/app TS 端口打进 CJS 后加载
 *   (2) 用 vm 加载 src/js/phase1/skill_bonuses.js 运行时
 *   (3) 对每个 jobId × 多档 skillLevel，比对 TS 输出 == vanilla 输出（epsilon 容差）
 * 任一偏差即判"端口不等价"，强制暴露迁移回归。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

const EPS = 1e-9;
let passed = 0;
let failed = 0;
function check(name, tsVal, vanillaVal) {
  const ok = Math.abs(tsVal - vanillaVal) < EPS;
  if (ok) {
    passed++;
  } else {
    failed++;
    console.error(`  ✗ ${name}: TS=${tsVal}  vanilla=${vanillaVal}`);
  }
}

// ===== 1) TS 规范源端口（bundle 含相对依赖） =====
const tsEntry = path.join(__dirname, "../src/app/core/skills/fatigueReduction.ts");
const bundleOut = esbuild.buildSync({
  entryPoints: [tsEntry],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpTs = path.join(os.tmpdir(), "cls_fatigue_" + Date.now() + ".cjs");
fs.writeFileSync(tmpTs, bundleOut.outputFiles[0].text);
const ts = require(tmpTs);
fs.unlinkSync(tmpTs);

// ===== 2) vanilla 运行时（vm 加载，提取全局函数） =====
const vanillaPath = path.join(__dirname, "../src/js/phase1/skill_bonuses.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const ctx = { Math, console, module: { exports: {} }, exports: {}, window: {} };
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);

// ===== 3) 双向比对 =====
function makeState(skillLevels) {
  const skills = {};
  for (const k in skillLevels) skills[k] = { level: skillLevels[k] };
  return { skills };
}

// jobId 覆盖各技能分支 + 未映射（应直接返回 0）
const cases = [
  { jobId: "street_vending_food", skill: "cooking" },
  { jobId: "repair_service", skill: "repair" },
  { jobId: "delivery_rider", skill: "driving" },
  { jobId: "shop_assistant", skill: "sales" },
  { jobId: "content_writing", skill: "coding" },
  { jobId: "factory_work_assembly", skill: "electrician" },
  { jobId: "manual_labor_construction", skill: "welding" },
  { jobId: "project_coordinator", skill: "management" },
  { jobId: "audit_assistant", skill: "accounting" },
  { jobId: "unknown_job_xyz", skill: null },
];

// skillLevel 覆盖阈值边界：0/9/10/29/30/31/49/50/51/69/70/71/100/150
const levels = [0, 9, 10, 29, 30, 31, 49, 50, 51, 69, 70, 71, 100, 150];

const fn = "getSkillFatigueReduction";
const tsFn = ts[fn];
const vanillaFn = ctx[fn];
if (typeof tsFn !== "function" || typeof vanillaFn !== "function") {
  failed++;
  console.error(`  ✗ ${fn}: 函数缺失 (ts=${typeof tsFn}, vanilla=${typeof vanillaFn})`);
} else {
  for (const c of cases) {
    for (const lv of levels) {
      const state = c.skill ? makeState({ [c.skill]: lv }) : { skills: {} };
      check(`${fn}(${c.jobId},lv=${lv})`, tsFn(c.jobId, state), vanillaFn(c.jobId, state));
    }
  }
}

// ===== 结果 =====
const total = passed + failed;
console.log(`技能疲劳减免 TS↔vanilla 比对: ${passed}/${total} 通过`);
if (failed > 0) {
  console.error(`❌ ${failed} 项不等价`);
  process.exit(1);
} else {
  console.log("✅ 全部等价");
}
