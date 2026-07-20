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
const vanillaPath = path.join(__dirname, "../src/js/phase1/skill_bonuses.js");
const vanillaSrc = fs.readFileSync(vanillaPath, "utf8");
const ctx = {};
vm.createContext(ctx);
vm.runInContext(vanillaSrc, ctx);
const vanilla = ctx;

// ===== 3) 逐项比对 =====
const levels = [0, 1, 9, 10, 11, 29, 30, 31, 49, 50, 51, 69, 70, 71, 99, 100, 101, -5, 1000];
for (const lv of levels) {
  check(ts.getSkillTierName(lv), vanilla.getSkillTierName(lv), `getSkillTierName(${lv})`);
}

const skills = [
  "cooking", "repair", "coding", "english", "driving", "sales",
  "management", "accounting", "electrician", "welding", "unknown_xyz",
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
