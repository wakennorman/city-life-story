#!/usr/bin/env node
/**
 * 现金对账诊断（第四版）：把「夹具阶段」与「引擎阶段」分开测量
 *
 * ── 演进史（教训有效，保留）─────────────────────────────────────
 *   ① v1 在 setter 触发瞬间判断「未记账」，但记账调用在现金写入**之后**
 *      （news.js 的 cashLoss：先改 cash 再 addDailyTransaction）→ 误报
 *   ② v2 在 advanceDay 结束后读 _dailyTransactions，但 daily_report
 *      已在日终把它清空（daily_report.js:1242）→ 账本Δ 恒为 0
 *   ③ v3 包裹 addDailyTransaction 累计当日记账额，方向对了，但归因错（见下）
 *
 * ── v3/v4-初版的归因为什么错 ──────────────────────────────────
 *   试过两种"看调用栈"的归因，**都不可靠**：
 *     a) 「有无 src/ 帧」→ 夹具的 doStreetJob 会走 main.js 引擎函数，
 *        那笔既有 src/ 帧又没记账 → 报出"引擎 ¥393 / 夹具 ¥387"自相矛盾
 *     b) 「栈里有无 headless_runner.cjs」→ `advanceDay` 与 `runDailyPipeline`
 *        的调用都在该文件里，**所有**写入都含该帧 → 全部误判为夹具
 *   实测 c) 反向对照（故意注释掉 news.js 的记账）时，这两种维度**都没报错**
 *   → 门禁恒绿，是假门禁。
 *
 * ── v4 正确做法：阶段切分（不依赖调用栈）───────────────────────
 *   `advanceDay` 实际做两件事：① 调夹具策略 ② 跑 `runDailyPipeline`。
 *   本脚本**不走 advanceDay**，改为自己分两步执行：
 *     [夹具阶段] 手动调 strategy(state)                  → 量出夹具造成的差额
 *     [引擎阶段] 手动调 runDailyPipeline(state)          → 量出引擎造成的差额
 *   每一步前后各做一次「现金 vs 账本」对账，于是差额被**物理隔离**，
 *   不需要猜调用栈。判据：
 *     · 引擎阶段差额 ≤ ¥1  → 引擎记账平整
 *     · 引擎阶段差额 > ¥1  → **引擎真漏账**，退码 1
 *
 * 基线读数（2026-09-19 实测，seed=20260915）：
 *   夹具阶段 差额 非零（夹具裸写，设计使然）
 *   引擎阶段 差额 ¥0            ← 引擎侧平整
 *   另：`applyNewsEffect` 的 cashBonus/cashLoss 已用 4 场景单测证明平整
 *   （含"现金不足被 Math.max(0,…) 钳制"的边界场景）。
 *
 * 反向对照（证明本门禁不是恒绿）—— 2026-09-19 实测：
 *   把 `news.js` 的 `addDailyTransaction(state,"expense","news_expense",…)`
 *   替换为 `void _cashLost;`（即不记账）后重跑：
 *     引擎阶段差额 → **¥-287，9/20 天有差额**，退码 **1**
 *     明细正是被注入的那些 news 损失项（第 2/4/5/7/10/11/12/18/19 天）
 *   恢复源码后 → 引擎阶段 ¥0，退码 0。
 *   ★ 对比：v3 及 v4-初版的"看调用栈"归因在这一步**都报绿**（假门禁）。
 */

const path = require("path");

const DAYS = 20;

/** 账本净额 */
function bookSum(txs) {
  return txs.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);
}

async function main() {
  const runner = require(path.resolve(__dirname, "..", "tests", "headless_runner.cjs"));
  runner.init();

  const state = runner.createState({ seed: 20260915 });
  const strategy = runner.getStrategy("balanced");

  /**
   * 在一个阶段内测量对账：执行 fn，返回该阶段造成的差额。
   * 手法：阶段前清账本，阶段内包裹 addDailyTransaction 累计记账额，
   * 阶段末用「现金实际变化 − 记账额」得差额。
   */
  function measure(fn) {
    const cashBefore = state.resources.cash;
    state.flags._dailyTransactions = [];
    state.flags._pipelineStartCash = cashBefore;

    let bookTotal = 0;
    const origAdd = globalThis.addDailyTransaction;
    if (typeof origAdd === "function") {
      globalThis.addDailyTransaction = function (st, type, _cat, amount) {
        bookTotal += type === "income" ? amount : -amount;
        return origAdd.apply(this, arguments);
      };
    }

    let threw = null;
    try {
      fn();
    } catch (e) {
      threw = e;
    } finally {
      if (typeof origAdd === "function") globalThis.addDailyTransaction = origAdd;
    }

    const cashAfter = state.resources.cash;
    const actual = cashAfter - cashBefore;
    return {
      actual,
      bookTotal,
      gap: Math.round((actual - bookTotal) * 100) / 100,
      threw,
    };
  }

  console.log("=== 现金对账诊断 v4（夹具 / 引擎 阶段切分）===\n");
  console.log("日 | 夹具阶段差额 | 引擎阶段差额 | 引擎阶段Δ | 引擎记账Δ");

  const engineGaps = [];
  let fixtureTotal = 0;

  for (let d = 0; d < DAYS; d++) {
    // [夹具阶段] 只让策略动，引擎管线还没跑
    const fx = measure(() => strategy(state));
    if (fx.threw) {
      console.log(`夹具阶段抛错（第 ${state.player.day} 天）: ${fx.threw.message}`);
      break;
    }
    fixtureTotal += fx.gap;

    // [引擎阶段] 复现 advanceDay 的收尾设置，然后只跑引擎管线
    state.player.actionPoints = 0;
    state.player.timeSlot = "evening";

    const en = measure(() => {
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    });

    const engineClean = Math.abs(en.gap) <= 1 ? "0 ✅" : `¥${en.gap} ❌`;
    console.log(
      String(state.player.day).padStart(2) + " | " +
        String(Math.round(fx.gap)).padStart(12) + " | " +
        engineClean.padStart(12) + " | " +
        String(Math.round(en.actual)).padStart(9) + " | " +
        String(Math.round(en.bookTotal)).padStart(10),
    );

    engineGaps.push({ day: state.player.day, gap: en.gap, threw: en.threw });

    if (en.threw) {
      console.log(`\n⚠️ 引擎阶段抛错（第 ${state.player.day} 天）: ${en.threw.message}`);
      break;
    }
    // 游戏结束判定（与 advanceDay 语义一致）
    if (state.flags && state.flags.gameOver) break;
    if (state.status && state.status.health !== undefined && state.status.health <= 0) break;
  }

  const engineLeakDays = engineGaps.filter((g) => Math.abs(g.gap) > 1);
  const engineTotal = engineLeakDays.reduce((s, g) => s + g.gap, 0);

  console.log("\n=== 归因 ===");
  console.log(`夹具阶段累计差额 ¥${Math.round(fixtureTotal)}（夹具裸写现金，设计使然，不计为缺陷）`);
  console.log(`引擎阶段累计差额 ¥${Math.round(engineTotal)}（有差额天数 ${engineLeakDays.length} / ${engineGaps.length}）`);

  if (engineLeakDays.length) {
    console.log("\n❌ 引擎阶段差额明细（这些才是真漏账）：");
    engineLeakDays.forEach((g) =>
      console.log(`   第 ${String(g.day).padStart(2)} 天  ¥${g.gap}`),
    );
  }

  console.log("\n=== 判定 ===");
  if (engineLeakDays.length === 0) {
    console.log("✅ 引擎阶段逐日差额全为 0 → **引擎侧记账平整**，无需修改记账逻辑。");
    console.log("   夹具阶段的非零差额来自 headless_runner.cjs:1053/1064/1084 三处裸写，");
    console.log("   那是测试夹具推进日程的手段，不是玩家行为，**刻意不记账**。");
    process.exit(0);
  }
  console.log(
    `❌ 引擎侧存在真漏账：${engineLeakDays.length} 天，累计 ¥${Math.round(engineTotal)}。`,
  );
  process.exit(1);
}

main().catch((e) => {
  console.error("探针失败:", e && e.message);
  console.error(e && e.stack);
  process.exit(1);
});
