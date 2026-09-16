/**
 * 命名映射族 TS 规范源 ↔ 正在运行的 vanilla 模块 双向比对
 * 用 esbuild buildSync({ bundle: true }) 转译 TS 端口（解析相对 import），
 * 用 vm 加载 src/js/phase1/skill_bonuses.js 运行时，逐项断言等价。
 * 任一偏差即判端口不等价。
 */
const fs = require("fs");
const path = require("path");
const os = require("os");
const vm = require("vm");
const esbuild = require("esbuild");

let pass = 0;
let fail = 0;
function check(actual, expected, label) {
  const a = String(actual);
  const e = String(expected);
  if (a === e) {
    pass++;
  } else {
    fail++;
    console.error(
      `✘ ${label}\n   expected: ${JSON.stringify(e)}\n   actual:   ${JSON.stringify(a)}`
    );
  }
}

// ===== 1) TS 规范源端口（bundle 解析相对依赖）=====
const tsPath = path.join(__dirname, "../src/app/core/naming/nameMaps.ts");
const result = esbuild.buildSync({
  entryPoints: [tsPath],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmpFile = path.join(os.tmpdir(), "cls_naming_" + Date.now() + ".cjs");
fs.writeFileSync(tmpFile, result.outputFiles[0].text);
const ts = require(tmpFile);
fs.unlinkSync(tmpFile);

// ===== 2) 正在运行的 vanilla 模块（vm 加载）=====
// [修复 · 2026-09-15] 原实现只加载 skill_bonuses.js，然后断言
//   vanilla.getSkillChineseName(...)
// 但 getSkillChineseName **并不在 skill_bonuses.js 里** ——
//   它定义在 src/js/core/skill_tree.js:1296，由该文件的 IIFE 挂到 window；
//   skill_bonuses.js:585 的注释也写着「由 skill_tree.js 全局提供」。
// 于是这个测试从写下来就是坏的：vanilla.getSkillChineseName 恒为 undefined，
// 一跑就 TypeError → **`npm run test:unit` 从来跑不完**。
// 修法：两个文件都加载，并让 window 自引用（skill_tree.js 的 IIFE 写 window.*）。
const vanillaPath = path.join(__dirname, "../src/js/phase1/skill_bonuses.js");
const skillTreePath = path.join(__dirname, "../src/js/core/skill_tree.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const skillTreeSrc = fs.readFileSync(skillTreePath, "utf8");
const ctx = {};
ctx.window = ctx; // skill_tree.js 是 IIFE，靠 window.X = X 导出
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);
vm.runInContext(skillTreeSrc, ctx);
const vanilla = ctx;

// 前置守卫：三个被比对的对象都必须真的存在，否则后面的断言毫无意义
// （这正是原测试缺失的一环——它没有先确认 vanilla 侧到底有没有这个函数）
for (const fnName of ["getSkillTierName", "getSkillChineseName", "getStatChineseName"]) {
  if (typeof vanilla[fnName] !== "function") {
    console.error(
      `✘ 前置检查失败：vanilla 侧缺少 ${fnName} —— 加载的源文件不对，断言结果无意义。`
    );
    process.exit(1);
  }
}

// ===== 3) 逐项比对 =====
const levels = [0, 1, 9, 10, 11, 29, 30, 31, 49, 50, 51, 69, 70, 71, 99, 100, 101, -5, 1000];
for (const lv of levels) {
  check(ts.getSkillTierName(lv), vanilla.getSkillTierName(lv), `getSkillTierName(${lv})`);
}

const skills = [
  "cooking", "repair", "coding", "english", "driving", "sales",
  "management", "accounting", "electrician", "welding",
  // [2026-09-15] 补上运行时已支持但此前未纳入比对的两项。
  // 它们曾让 TS 端口与 vanilla 静默分叉（TS 缺 medicine/social）。
  "medicine", "social",
  "unknown_xyz",
];
for (const s of skills) {
  check(ts.getSkillChineseName(s), vanilla.getSkillChineseName(s), `getSkillChineseName(${s})`);
}

const stats = [
  "physique", "intelligence", "agility", "mental", "health", "hunger",
  "fatigue", "hygiene", "happiness", "fame", "unknown_key",
];
for (const k of stats) {
  check(ts.getStatChineseName(k), vanilla.getStatChineseName(k), `getStatChineseName(${k})`);
}

console.log(`\n命名映射 TS↔vanilla 比对: ${pass} 一致, ${fail} 不一致`);
if (fail > 0) {
  console.error("FAIL");
  process.exit(1);
} else {
  console.log("ALL GREEN ✔");
}
