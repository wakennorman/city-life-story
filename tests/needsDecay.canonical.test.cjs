/**
 * needsDecay 双向比对单测 — TS 端口 vs vanilla applyNeedsDecay 严格等价
 *
 * 比对策略（端到端）：
 * - vanilla: vm 加载 needs.js，注入 getDifficultyMultiplier，clone state 调 applyNeedsDecay，读 state.needs
 * - TS:       computeNeedsDecay(state.needs, getNeedsDecayMultiplier(state, getDifficultyMultiplier))
 * 两者用同一 getDifficultyMultiplier 实现 → 同一 decayMul → 同一衰减结果。
 */
const path = require("path");
const fs = require("fs");
const vm = require("vm");
const os = require("os");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const TS_SRC = path.join(ROOT, "src/app/core/needs/needsDecay.ts");
const VANILLA = path.join(ROOT, "src/js/phase1/needs.js");

// --- TS side: esbuild bundle -> temp cjs ---
const out = esbuild.buildSync({
  entryPoints: [TS_SRC],
  bundle: true,
  format: "cjs",
  platform: "node",
  write: false,
});
const tmp = path.join(os.tmpdir(), "needsDecay_" + Date.now() + ".cjs");
fs.writeFileSync(tmp, out.outputFiles[0].text);
const TS = require(tmp);

// --- vanilla side: vm load needs.js (inject getDifficultyMultiplier) ---
const vanillaCode = fs.readFileSync(VANILLA, "utf8");
function loadVanilla(getDifficultyMultiplier) {
  const ctx = {
    Math, JSON, isFinite, isNaN, console,
    getDifficultyMultiplier, // injected
    StateManager: { addMessage() {} },
    Random: { chance: () => false },
    window: undefined,
  };
  ctx.global = ctx;
  vm.createContext(ctx);
  vm.runInContext(vanillaCode, ctx);
  return ctx;
}

let pass = 0, fail = 0;
const fails = [];

// decay specs: [label, rawValue | "NO_INJECT"]
const decaySpecs = [
  ["0.1", 0.1], ["0.5", 0.5], ["1.0", 1.0], ["1.5", 1.5], ["2.0", 2.0],
  ["3.0", 3.0], ["5.0", 5.0],
  ["0.05->clamp0.1", 0.05], ["10->clamp5.0", 10],
  ["NaN->clamp1.0", NaN], ["Infinity->clamp5.0", Infinity],
  ["undefined-ret->clamp1.0", undefined],
  ["no-inject->1.0", "NO_INJECT"],
];

const needVals = [0, 50, 100];

// [新增 · 2026-09-15] 关系维度：vanilla 的 happiness 衰减受「社交支持」影响
//   （每个「已见过 且 好感 ≥50」的 NPC 减 0.5 点衰减，最多 -2）
// 原测试的样本状态**不含 relationships**，所以这条分支从未被比对过——
// 端口漏掉整段逻辑也没被发现。现在把它纳入。
const relSpecs = [
  ["no-relationships", undefined],
  ["1 high-affinity", { npcA: { met: true, affinity: 60 } }],
  ["2 high-affinity", { npcA: { met: true, affinity: 60 }, npcB: { met: true, affinity: 80 } }],
  ["4 high-affinity(封顶-2)", {
    npcA: { met: true, affinity: 60 }, npcB: { met: true, affinity: 80 },
    npcC: { met: true, affinity: 50 }, npcD: { met: true, affinity: 95 },
  }],
  ["affinity 49(门槛下)", { npcA: { met: true, affinity: 49 } }],
  ["met=false(不算)", { npcA: { met: false, affinity: 90 } }],
];

for (const [relLabel, relationships] of relSpecs) {
  for (const [label, raw] of decaySpecs) {
    const getFn = raw === "NO_INJECT" ? undefined : (s, k) => raw;
    const vanillaCtx = loadVanilla(getFn);
    const sampleState = { needs: { hunger: 50, hygiene: 50, happiness: 50 }, relationships };
    const tsMul = TS.getNeedsDecayMultiplier(sampleState, getFn);
    const tsSocial = TS.computeSocialSupportBonus(relationships);

    for (const h of needVals) {
      for (const hy of needVals) {
        for (const hp of needVals) {
          const needs = { hunger: h, hygiene: hy, happiness: hp };
          // vanilla: clone, mutate（relationships 也要带上，否则社交加成路径不生效）
          const vState = { needs: { ...needs }, relationships };
          vanillaCtx.applyNeedsDecay(vState);
          const vRes = vState.needs;
          // TS: pure compute
          const tRes = TS.computeNeedsDecay(needs, tsMul, tsSocial);
          const ok =
            vRes.hunger === tRes.hunger &&
            vRes.hygiene === tRes.hygiene &&
            vRes.happiness === tRes.happiness;
          if (ok) pass++;
          else {
            fail++;
            if (fails.length < 10) {
              fails.push(
                `[${label} / ${relLabel}] needs=${JSON.stringify(needs)} vanilla=${JSON.stringify(vRes)} ts=${JSON.stringify(tRes)}`,
              );
            }
          }
        }
      }
    }
  }
}

console.log(`needsDecay canonical: ${pass} passed, ${fail} failed`);
if (fails.length) console.log(fails.join("\n"));
fs.unlinkSync(tmp);
process.exit(fail ? 1 : 0);
