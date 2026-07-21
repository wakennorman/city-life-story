// 阶段3批次16 — 技能连携纯函数 TS↔vanilla 双向比对
// 验证 src/app/core/skills/synergy.ts 的 checkSkillSynergies / getSkillSynergyBonus
// 与 vanilla src/js/core/skill_synergy.js 行为严格一致（含 dual 的 flags 副作用与数据表保真）。
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");
const os = require("os");

const ROOT = path.resolve(__dirname, "..");
const VANILLA_FILE = path.join(ROOT, "src/js/core/skill_synergy.js");
const TS_ENTRY = path.join(ROOT, "src/app/core/skills/synergy.ts");

let pass = 0,
  fail = 0;
const fails = [];
function eq(actual, expect, name) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expect);
  if (a === e) {
    pass++;
  } else {
    fail++;
    fails.push(`${name}\n  expected: ${e}\n  actual:   ${a}`);
  }
}

// 递归排序键，消除对象键序差异（仅比对结构/值）
function norm(v) {
  if (Array.isArray(v)) return v.map(norm);
  if (v && typeof v === "object") {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = norm(v[k]);
    return out;
  }
  return v;
}

// ---- vanilla 端：vm 加载 skill_synergy.js ----
const vanillaSrc = fs.readFileSync(VANILLA_FILE, "utf8");
const ctx = {
  console,
  Math,
  JSON,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Set,
  setTimeout,
  clearTimeout,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
  RegExp,
};
vm.createContext(ctx);
// 让 window 指向 vm 全局本身，使 script 中 `window.X = ...; X = ...` 与裸全局 X 解析到同一对象
// （vanilla skill_synergy.js 的 MECHANICS 注册块使用裸 MECHANICS 全局）
ctx.window = ctx;
vm.runInContext(vanillaSrc, ctx, { filename: VANILLA_FILE });
// const 声明不挂到 vm 全局对象，显式取出数据表用于数据保真断言
vm.runInContext(
  "globalThis.SKILL_SYNERGY_DUAL = SKILL_SYNERGY_DUAL;" +
    "globalThis.SKILL_SYNERGY_TRIPLE = SKILL_SYNERGY_TRIPLE;" +
    "globalThis.SKILL_SYNERGY_THEME = SKILL_SYNERGY_THEME;",
  ctx,
);
if (typeof ctx.checkSkillSynergies !== "function") {
  console.error("FAIL: ctx.checkSkillSynergies 未取到");
  process.exit(1);
}

// ---- TS 端：esbuild 转译后 require ----
const out = path.join(os.tmpdir(), `skill_synergy_${Date.now()}.cjs`);
esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile: out,
  logLevel: "silent",
});
const T = require(out);

// ---- 数据保真：TS 数据表 == vanilla 数据表 ----
eq(norm(T.SKILL_SYNERGY_DUAL), norm(ctx.SKILL_SYNERGY_DUAL), "数据 DUAL 一致");
eq(norm(T.SKILL_SYNERGY_TRIPLE), norm(ctx.SKILL_SYNERGY_TRIPLE), "数据 TRIPLE 一致");
eq(norm(T.SKILL_SYNERGY_THEME), norm(ctx.SKILL_SYNERGY_THEME), "数据 THEME 一致");

// ---- 静态确定性用例（手工核对触发路径）----
function mkSkills(map) {
  // map: { skill: level } -> 随机形态由调用方决定；此处固定为 {level:N}
  const o = {};
  for (const k in map) o[k] = { level: map[k] };
  return o;
}
const staticCases = [
  { name: "全满触发所有连携", skills: mkSkills({ cooking: 100, repair: 100, coding: 100, english: 100, driving: 100, sales: 100, management: 100, accounting: 100, electrician: 100, welding: 100 }) },
  { name: "仅 cooking_sales", skills: mkSkills({ cooking: 40, sales: 40 }) },
  { name: "仅 coding_english", skills: mkSkills({ coding: 50, english: 50 }) },
  { name: "仅 tech_theme(2门达阈)", skills: mkSkills({ coding: 40, electrician: 50 }) },
  { name: "空技能", skills: mkSkills({}) },
  { name: "数字形态全满", skills: { cooking: 100, repair: 100, coding: 100, english: 100, driving: 100, sales: 100, management: 100, accounting: 100, electrician: 100 } },
];
for (const c of staticCases) {
  const sV = { skills: JSON.parse(JSON.stringify(c.skills)), flags: {} };
  const sT = { skills: JSON.parse(JSON.stringify(c.skills)), flags: {} };
  const vR = ctx.checkSkillSynergies(sV);
  const tR = T.checkSkillSynergies(sT);
  eq(norm(vR), norm(tR), `checkSkillSynergies[${c.name}]`);
  eq(norm(sV.flags), norm(sT.flags), `flags[${c.name}]`);
  // 无 flags 形态也应一致（vanilla 的 if(state.flags) 跳过）
  const sV2 = { skills: JSON.parse(JSON.stringify(c.skills)) };
  const sT2 = { skills: JSON.parse(JSON.stringify(c.skills)) };
  const vR2 = ctx.checkSkillSynergies(sV2);
  const tR2 = T.checkSkillSynergies(sT2);
  eq(norm(vR2), norm(tR2), `checkSkillSynergies[${c.name}]-noFlags`);
}

// 边界：undefined / null / {} / {skills:{}}
for (const edge of [undefined, null, {}, { skills: {} }]) {
  const vR = ctx.checkSkillSynergies(edge);
  const tR = T.checkSkillSynergies(edge);
  eq(norm(vR), norm(tR), `checkSkillSynergies edge=${JSON.stringify(edge)}`);
}

// ---- 受测试的工作ID（覆盖 dual 工作特定 incomeMultiplier 键 + 无关键）----
const JOB_IDS = [
  "street_vending_food", "sister_zhang_vending", "coding", "freelance_writing",
  "content_writing", "instrument_repair", "electronics_repair", "factory_electrician",
  "shop_assistant", "promoter", "truck_assistant", "warehouse_logistics",
  "wholesale_delivery", "nonexistent_job",
];

// ---- 随机种子扫描（seeded PRNG，2500 种子）----
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const ALL_SKILLS = ["cooking", "repair", "coding", "english", "driving", "sales", "management", "accounting", "electrician", "welding"];
const SEEDS = 2500;
let checked = 0;
for (let s = 0; s < SEEDS; s++) {
  const rng = mulberry32(s + 1);
  const map = {};
  for (const sk of ALL_SKILLS) {
    if (rng() < 0.15) continue; // 随机缺失技能
    const lvl = Math.floor(rng() * 101); // 0..100
    // 随机形态：数字 或 {level:N}
    map[sk] = rng() < 0.5 ? lvl : { level: lvl };
  }
  const sV = { skills: JSON.parse(JSON.stringify(map)), flags: {} };
  const sT = { skills: JSON.parse(JSON.stringify(map)), flags: {} };
  const vR = ctx.checkSkillSynergies(sV);
  const tR = T.checkSkillSynergies(sT);
  eq(norm(vR), norm(tR), `check seed=${s}`);
  eq(norm(sV.flags), norm(sT.flags), `flags seed=${s}`);
  // getSkillSynergyBonus 比对
  for (const jobId of JOB_IDS) {
    const vB = ctx.getSkillSynergyBonus(jobId, { skillSynergies: vR });
    const tB = T.getSkillSynergyBonus(jobId, { skillSynergies: tR });
    eq(vB, tB, `bonus job=${jobId} seed=${s}`);
  }
  checked++;
}

// ---- 汇总 ----
try {
  fs.unlinkSync(out);
} catch (_) {}
console.log(
  `skillSynergy canonical: ${pass} passed, ${fail} failed ` +
    `(数据表3 + 静态${staticCases.length * 2 + 4} + 随机${SEEDS}×${1 + 1 + JOB_IDS.length} 断言)`,
);
if (fail > 0) {
  console.log("\n失败用例:\n" + fails.slice(0, 20).join("\n"));
  process.exit(1);
}
