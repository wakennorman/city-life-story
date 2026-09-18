/**
 * 状态体系单测 —— 《大多数》式「心态 + 生理需求」
 *
 * 覆盖四件事，每件都对应一个**真实踩过或极易踩**的坑：
 *   ① 老存档兼容：新增的 clothing / foodSatisfaction 缺失时必须补默认值，
 *      **不能当 0** —— 否则老玩家一进游戏就触发阈值惩罚（凭空挨罚）。
 *   ② 衰减数值：两个新需求确实在衰减（否则"加了字段但没接线"，
 *      症状是 HUD 上那两条永远不动）。
 *   ③ 心态公式：字段集**不含 health**。这里曾经出过一次真实事故 ——
 *      hud.js 的回退公式把 health 也算进平均，预览页显示 39、真实游戏 33。
 *   ④ 阈值因果：clothing/foodSatisfaction 过低时扣的是**情绪**，不是健康
 *      （《大多数》的因果链：体面与满足的缺失先伤情绪，再由情绪拖累心态）。
 *
 * 加载方式沿用 needsDecay.canonical.test.cjs：vm 跑 vanilla 源，
 * 注入 getDifficultyMultiplier 与 StateManager 桩。
 */

const path = require("path");
const fs = require("fs");
const vm = require("vm");

const ROOT = path.resolve(__dirname, "..");
const NEEDS_SRC = fs.readFileSync(path.join(ROOT, "src/js/phase1/needs.js"), "utf8");

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✅ ${name}${detail ? "  → " + detail : ""}`); }
  else { fail++; console.log(`  ❌ ${name}${detail ? "  → " + detail : ""}`); }
}

/** 造一个跑 needs.js 的沙箱 */
function makeSandbox() {
  const messages = [];
  const sandbox = {
    console,
    isFinite,
    isNaN,
    Math,
    // needs.js 里的两个外部依赖：难度乘数（默认 1.0）与消息出口
    getDifficultyMultiplier: () => 1.0,
    StateManager: { addMessage: (m, k) => messages.push({ m, k }) },
  };
  sandbox.window = sandbox;
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  vm.runInContext(NEEDS_SRC, sandbox, { filename: "needs.js" });
  return { sandbox, messages };
}

/** 最小可用的 state（只含被测路径需要的字段） */
function baseState(needs, over) {
  return Object.assign(
    {
      needs: Object.assign({ hunger: 80, fatigue: 20, hygiene: 80, happiness: 80 }, needs),
      status: { health: 90, illnesses: [] },
      player: { day: 100 },
      flags: {},
      relationships: {},
    },
    over || {},
  );
}

console.log("\n=== 状态体系单测（《大多数》式：心态 + 生理需求）===\n");

/* ── ① 老存档兼容 ───────────────────────────────────────────────────────── */
console.log("① 老存档兼容（新增键缺失时补默认值，不能当 0）");
{
  const { sandbox } = makeSandbox();
  const st = baseState({}); // 老存档：没有 clothing / foodSatisfaction
  delete st.needs.clothing;
  delete st.needs.foodSatisfaction;

  sandbox.applyNeedsDecay(st);
  check("applyNeedsDecay 后 clothing 已补默认值 45（不是 0）",
    st.needs.clothing === 42, `实际 ${st.needs.clothing}（45 - 3 = 42）`);
  check("applyNeedsDecay 后 foodSatisfaction 已补默认值 30（不是 0）",
    st.needs.foodSatisfaction === 25, `实际 ${st.needs.foodSatisfaction}（30 - 5 = 25）`);

  const st2 = baseState({});
  delete st2.needs.clothing;
  delete st2.needs.foodSatisfaction;
  sandbox.checkNeedsThresholds(st2);
  check("checkNeedsThresholds 后两键也已补齐（否则惩罚会静默失效）",
    typeof st2.needs.clothing === "number" && typeof st2.needs.foodSatisfaction === "number",
    `clothing=${st2.needs.clothing} foodSatisfaction=${st2.needs.foodSatisfaction}`);
}

/* ── ② 衰减确实在跑 ─────────────────────────────────────────────────────── */
console.log("\n② 衰减（加了字段但没接线时，症状是这两条永远不动）");
{
  const { sandbox } = makeSandbox();
  const st = baseState({ clothing: 50, foodSatisfaction: 50 });
  sandbox.applyNeedsDecay(st);
  check("clothing 每日 -3", st.needs.clothing === 47, `50 → ${st.needs.clothing}`);
  check("foodSatisfaction 每日 -5", st.needs.foodSatisfaction === 45, `50 → ${st.needs.foodSatisfaction}`);

  const stFloor = baseState({ clothing: 1, foodSatisfaction: 2 });
  sandbox.applyNeedsDecay(stFloor);
  check("不会跌破 0", stFloor.needs.clothing === 0 && stFloor.needs.foodSatisfaction === 0,
    `clothing=${stFloor.needs.clothing} foodSatisfaction=${stFloor.needs.foodSatisfaction}`);

  const stZero = baseState({ clothing: 0, foodSatisfaction: 0 });
  sandbox.applyNeedsDecay(stZero);
  check("★ 值为 0 时不会因默认值而回升（这就是不能用 `|| 0` 的镜像陷阱）",
    stZero.needs.clothing === 0 && stZero.needs.foodSatisfaction === 0,
    `clothing=${stZero.needs.clothing} foodSatisfaction=${stZero.needs.foodSatisfaction}`);
}

/* ── ③ 心态公式 ─────────────────────────────────────────────────────────── */
console.log("\n③ 心态公式（字段集不含 health —— 这里出过一次真实事故）");
{
  const { sandbox } = makeSandbox();
  const needs = { hunger: 25, hygiene: 30, clothing: 45, foodSatisfaction: 30, happiness: 20, fatigue: 50 };
  const got = sandbox.computeMindset({ needs });

  const expectNoHealth = Math.round(
    (needs.hunger + needs.hygiene + needs.clothing + needs.foodSatisfaction +
      needs.happiness + (100 - needs.fatigue)) / 6,
  );
  const expectWithHealth = Math.round(
    (needs.hunger + needs.hygiene + needs.clothing + needs.foodSatisfaction +
      needs.happiness + (100 - needs.fatigue) + 90) / 7,
  );

  check("等于「5 需求 + (100−疲劳)」的均值", got === expectNoHealth,
    `实际 ${got}，期望 ${expectNoHealth}`);
  check("★ 不等于把 health 也算进去的均值", got !== expectWithHealth,
    `含 health 会是 ${expectWithHealth}`);
  check("疲劳越高心态越低", sandbox.computeMindset({ needs: Object.assign({}, needs, { fatigue: 100 }) })
    < sandbox.computeMindset({ needs: Object.assign({}, needs, { fatigue: 0 }) }));
  check("全满 → 100", sandbox.computeMindset({
    needs: { hunger: 100, hygiene: 100, clothing: 100, foodSatisfaction: 100, happiness: 100, fatigue: 0 },
  }) === 100);
  check("全空 → 0", sandbox.computeMindset({
    needs: { hunger: 0, hygiene: 0, clothing: 0, foodSatisfaction: 0, happiness: 0, fatigue: 100 },
  }) === 0);
}

/* ── ④ 阈值因果：扣情绪，不扣健康 ───────────────────────────────────────── */
console.log("\n④ 阈值因果（体面与满足的缺失先伤情绪，不直接掉血）");
{
  const { sandbox } = makeSandbox();
  const st = baseState({ clothing: 5, foodSatisfaction: 5, happiness: 80 });
  const healthBefore = st.status.health;
  const happyBefore = st.needs.happiness;
  sandbox.checkNeedsThresholds(st);
  check("clothing<20 扣的是情绪", st.needs.happiness < happyBefore,
    `happiness ${happyBefore} → ${st.needs.happiness}`);
  check("foodSatisfaction<20 也扣情绪（两条叠加）",
    st.needs.happiness <= happyBefore - 2, `实际扣了 ${happyBefore - st.needs.happiness}`);
  check("健康不受这两个阈值影响", st.status.health === healthBefore,
    `health ${healthBefore} → ${st.status.health}`);

  const stHigh = baseState({ clothing: 80, foodSatisfaction: 80, happiness: 80 });
  const before = stHigh.needs.happiness;
  sandbox.checkNeedsThresholds(stHigh);
  check("两值充足时不扣情绪（阴性对照）", stHigh.needs.happiness === before,
    `happiness 保持 ${stHigh.needs.happiness}`);
}

console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════\n`);
process.exit(fail === 0 ? 0 : 1);
