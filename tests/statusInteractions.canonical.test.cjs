/**
 * 状态互联纯函数 TS↔vanilla 双向比对单测
 * 覆盖: getEffectiveStats / getApCostMultiplier
 *
 * 方法: esbuild 转译 TS 规范源 + vm 加载正在运行的 vanilla interactions.js，
 * 对每个状态矩阵逐项比对，证明 TS 端口与线上 vanilla 行为严格一致。
 *
 * 覆盖策略: 单维边界（其余取中性值 50）+ 少量组合极值 + 疾病注入子集。
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const TS_PATH = path.join(ROOT, "src/app/core/stats/statusInteractions.ts");
const VANILLA_PATH = path.join(ROOT, "src/js/phase1/interactions.js");

// 1) esbuild 转译 TS 规范源
const out = esbuild.buildSync({
  entryPoints: [TS_PATH],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tsModule = { exports: {} };
const tsFn = new Function("module", "exports", "require", out.outputFiles[0].text);
tsFn(tsModule, tsModule.exports, require);
const TS = tsModule.exports;

// 2) vm 加载 vanilla 运行时模块
function loadVanilla(illnessDebuffs) {
  const sandbox = {
    Math,
    console,
    isFinite,
    getIllnessAttrDebuffs: illnessDebuffs,
    Random: { chance: () => false },
    StateManager: { addMessage: () => {} },
  };
  const script = new vm.Script(fs.readFileSync(VANILLA_PATH, "utf8"));
  script.runInNewContext(sandbox);
  return sandbox;
}

// 中性基准 state
function baseState(over = {}) {
  return Object.assign(
    {
      needs: { hunger: 50, fatigue: 50, hygiene: 50, happiness: 50 },
      status: { health: 50, sick: false, injured: false },
      player: { physique: 50, intelligence: 50, agility: 50, mental: 50 },
      weather: { current: "sunny" },
    },
    over,
  );
}

let cases = 0;
let failed = 0;

function assertEqual(label, a, b) {
  const astr = JSON.stringify(a);
  const bstr = JSON.stringify(b);
  if (astr !== bstr) {
    failed++;
    if (failed <= 12) {
      console.error(`  ✗ ${label}`);
      console.error(`    TS  : ${astr}`);
      console.error(`    VAN : ${bstr}`);
    }
    return false;
  }
  return true;
}

// 3) 无疾病路径：TS(无注入) vs vanilla(全局未定义) —— 单维边界覆盖
const vanNo = loadVanilla(undefined);

const HUNGER = [0, 5, 15, 30, 50, 100];
const FATIGUE = [0, 50, 70, 85, 95, 100];
const HEALTH = [0, 15, 30, 50, 100];
const HAPPY = [0, 10, 20, 50, 100];
const WEATHER = [undefined, "heatwave", "coldwave", "storm", "snow", "sunny"];

for (const h of HUNGER) {
  const st = baseState({ needs: { hunger: h, fatigue: 50, hygiene: 50, happiness: 50 } });
  cases++;
  assertEqual(`eff hunger=${h}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
  cases++;
  assertEqual(`ap hunger=${h}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
}
for (const f of FATIGUE) {
  const st = baseState({ needs: { hunger: 50, fatigue: f, hygiene: 50, happiness: 50 } });
  cases++;
  assertEqual(`eff fatigue=${f}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
  cases++;
  assertEqual(`ap fatigue=${f}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
}
for (const hl of HEALTH) {
  const st = baseState({ status: { health: hl, sick: false, injured: false } });
  cases++;
  assertEqual(`eff health=${hl}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
  cases++;
  assertEqual(`ap health=${hl}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
}
for (const hp of HAPPY) {
  const st = baseState({ needs: { hunger: 50, fatigue: 50, hygiene: 50, happiness: hp } });
  cases++;
  assertEqual(`eff happy=${hp}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
  cases++;
  assertEqual(`ap happy=${hp}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
}
for (const w of WEATHER) {
  const st = baseState({ weather: w ? { current: w } : undefined });
  cases++;
  assertEqual(`ap weather=${w}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
  cases++;
  assertEqual(`eff weather=${w}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
}

// sick / injured 维度
for (const sick of [false, true]) {
  for (const injured of [false, true]) {
    const st = baseState({ status: { health: 50, sick, injured } });
    cases++;
    assertEqual(`eff sick=${sick} inj=${injured}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
    cases++;
    assertEqual(`ap sick=${sick} inj=${injured}`, TS.getApCostMultiplier(st), vanNo.getApCostMultiplier(st));
  }
}

// 基础属性正向反馈边界 (physique>60 / agility>50,>75 / mental>50 / intelligence>50)
const B_P = [0, 50, 60, 75, 100];
const B_A = [0, 50, 75, 100];
const B_M = [0, 50, 100];
const B_I = [0, 50, 100];
for (const phy of B_P)
  for (const agi of B_A)
    for (const men of B_M)
      for (const int of B_I) {
        const st = baseState({ player: { physique: phy, intelligence: int, agility: agi, mental: men } });
        cases++;
        assertEqual(`eff P${phy} A${agi} M${men} I${int}`, TS.getEffectiveStats(st), vanNo.getEffectiveStats(st));
      }

// 组合极值
const extremes = [
  { label: "全差", st: baseState({ needs: { hunger: 0, fatigue: 100, hygiene: 0, happiness: 0 }, status: { health: 0, sick: true, injured: true }, player: { physique: 0, intelligence: 0, agility: 0, mental: 0 } }) },
  { label: "全好", st: baseState({ needs: { hunger: 100, fatigue: 0, hygiene: 100, happiness: 100 }, status: { health: 100, sick: false, injured: false }, player: { physique: 100, intelligence: 100, agility: 100, mental: 100 } }) },
  { label: "极端疲劳+病", st: baseState({ needs: { hunger: 50, fatigue: 100, hygiene: 50, happiness: 10 }, status: { health: 10, sick: true, injured: false } }) },
  { label: "暴风+伤", st: baseState({ weather: { current: "storm" }, status: { health: 50, sick: false, injured: true } }) },
];
for (const e of extremes) {
  cases++;
  assertEqual(`eff ${e.label}`, TS.getEffectiveStats(e.st), vanNo.getEffectiveStats(e.st));
  cases++;
  assertEqual(`ap ${e.label}`, TS.getApCostMultiplier(e.st), vanNo.getApCostMultiplier(e.st));
}

// 4) 疾病注入路径：TS(illnessDebuffs) vs vanilla(全局同实现)
const stubDebuffs = () => ({ physique: 12, intelligence: 8, agility: 20, mental: 15, apMult: 0.3 });
const vanYes = loadVanilla(stubDebuffs);
for (const h of [5, 30, 50])
  for (const f of [50, 85, 100])
    for (const hl of [10, 50, 100])
      for (const sick of [false, true])
        for (const injured of [false, true])
          for (const phy of [10, 60])
            for (const agi of [40, 80])
              for (const w of [undefined, "storm"]) {
                const st = baseState({
                  needs: { hunger: h, fatigue: f, hygiene: 50, happiness: 50 },
                  status: { health: hl, sick, injured },
                  player: { physique: phy, intelligence: 50, agility: agi, mental: 50 },
                  weather: w ? { current: w } : undefined,
                });
                cases++;
                assertEqual(`eff+ill H${h} F${f} Hl${hl} sick${sick} inj${injured} P${phy} A${agi} W${w}`, TS.getEffectiveStats(st, stubDebuffs), vanYes.getEffectiveStats(st));
                cases++;
                assertEqual(`ap+ill H${h} F${f} Hl${hl} sick${sick} inj${injured} A${agi} W${w}`, TS.getApCostMultiplier(st, stubDebuffs), vanYes.getApCostMultiplier(st));
              }

console.log(`状态互联比对: ${cases} 用例, 失败 ${failed}`);
if (failed > 0) {
  console.error(`❌ ${failed} 个用例 TS 与 vanilla 不一致`);
  process.exit(1);
} else {
  console.log("✅ 全部用例 TS↔vanilla 严格一致 (getEffectiveStats + getApCostMultiplier)");
}
