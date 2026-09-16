#!/usr/bin/env node
/**
 * probe-industry-profit.cjs — 6 行业盈利矩阵固化验证（报告第三十二节）
 *
 * 背景：
 *   第三十一节诊断出「上线即死」—— 首产品上线后收入（¥70/天）远盖不住支出
 *   （¥318/天），且有 2 个行业即使分数打满也**数学上无盈利解**。第三十二节实施
 *   三项修正：
 *     1. 收入公式  `techMod × marketMod` → `(techMod + marketMod) / 2`
 *     2. `DAILY_BASE_REVENUE` 180 → 480
 *     3. `DAILY_MARKETING_BASE` 120 → 60
 *   本脚本把这套验证**固化**：对 6 个行业各跑一遍「注册 → 开发 → 上线 → 稳态运营」，
 *   输出日收入 / 日支出 / 日净，并断言**所有行业均盈利**。
 *
 * 为什么必须固化：
 *   这是唯一一个能一次性捕获「某个行业无盈利解」这种回归的检查。单行业探针
 *   （probe-post-launch.cjs）只能看见一个行业；MC 夹具的生存率对此**不敏感**
 *   （公司破产前玩家已存活、天数为 0 也只是少赚），所以这个矩阵是**独立观测点**。
 *
 * 退出码：
 *   0 = 6 行业全部盈利（通过）
 *   1 = 有行业亏损（失败，可用于门禁）
 *
 * 用法：
 *   node scripts/probe-industry-profit.cjs
 *   node scripts/probe-industry-profit.cjs --tech 54 --market 30   # 自定义分数口径
 *   node scripts/probe-industry-profit.cjs --quiet                 # 只输出判定（门禁用）
 */
"use strict";

const path = require("path");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

const argv = process.argv.slice(2);
function argNum(name, def) {
  const i = argv.indexOf("--" + name);
  if (i < 0) return def;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) ? v : def;
}
function argFlag(name) {
  return argv.indexOf("--" + name) >= 0;
}

// 现实分数口径：技术型创始人在 138 天创业准备期后的典型值
//   techScore = 30 + company.techScore + coding×0.3 ≈ 54
//   marketScore = 20 + company.marketScore + sales×0.3 ≈ 30
const TECH_SCORE = argNum("tech", 54);
const MARKET_SCORE = argNum("market", 30);
const STEADY_DAYS = argNum("steady", 30); // 上线后观察的天数（跳过随机波动影响）
const CODING_LV = argNum("coding", 16);
const QUIET = argFlag("quiet");

// 稳态窗口：取上线后第 6~30 天（跳过头几天的 Random 抖动与 stage 切换）
const SETTLE_SKIP = 5;

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(1);
}

const INDUSTRIES = ["manufacturing", "consumer", "education", "tech", "healthcare", "finance"];

/**
 * 跑一个行业，返回 { industry, revAvg, expAvg, netAvg, launchDay, broke }
 */
function runIndustry(industry, seed) {
  const state = runner.createState({ seed: seed, scenario: "classic" });
  state.player.day = 61;
  state.resources.cash = 15000;
  state.player.phase = "corporate";
  state.skills = state.skills || {};
  state.skills.coding = { level: CODING_LV, xp: 0 };
  state.skills.english = { level: 16, xp: 0 };

  // 社交门：直接给两位 NPC 好感 50（等价于「已经拜访够」）
  if (!state.relationships) state.relationships = {};
  ["aunt_wang", "old_zhou"].forEach((id) => {
    state.relationships[id] = { affinity: 50, met: true, discovered: {} };
  });

  const reg = registerStartup(state, "行业验证公司", industry, "");
  if (!reg || !reg.success) {
    return { industry, error: (reg && reg.message) || "注册失败" };
  }

  const company = state.startup.company;
  // ⚠️ 不要额外 createProduct —— registerStartup 内部已自动创建初始 MVP 产品
  //    （startup.js:690~705）。重复创建会让第二个产品永远卡在 developing，
  //    白烧 DAILY_RD 日费并拖慢上线（报告 32.3 记录了这个 bug）。
  const product = company.products[0];
  if (!product) return { industry, error: "registerStartup 未创建产品" };

  // 把分数直接钉到目标口径（等价于「创始人已具备该水平」），
  // 避免技能成长/公司属性带来的行业间不可比。
  // 注意：只能在**上线时**影响 —— launchProduct 会按 tech/marketScore 写入产品。
  if (typeof company.techScore === "number") company.techScore = TECH_SCORE - 30;
  if (typeof company.marketScore === "number") company.marketScore = MARKET_SCORE - 20;

  // ---- 开发到上线 ----
  let guard = 0;
  while (product.status !== "launched" && guard < 400) {
    if (product.status === "developing") {
      try {
        developProduct(state, product.id, 1);
      } catch (e) {
        break;
      }
    } else if (product.status === "ready_to_launch") {
      try {
        launchProduct(state, product.id);
      } catch (e) {
        break;
      }
    }
    state.player.day += 1;
    try {
      tickStartup(state, "daily");
    } catch (e) {
      /* ignore */
    }
    if (!state.startup.company) return { industry, broke: true, brokeDay: state.player.day };
    guard++;
  }

  if (product.status !== "launched") {
    return { industry, error: `未能上线（卡在 ${product.status}）` };
  }

  const launchDay = state.player.day;

  // 把产品分数钉到目标口径（等价于「产品就是这个水平」）
  product.technologyScore = TECH_SCORE;
  product.marketScore = MARKET_SCORE;

  // ---- 稳态观察 ----
  const revs = [];
  const exps = [];
  for (let i = 0; i < STEADY_DAYS; i++) {
    state.player.day += 1;
    try {
      tickStartup(state, "daily");
    } catch (e) {
      break;
    }
    const c = state.startup.company;
    if (!c) return { industry, broke: true, brokeDay: state.player.day, launchDay };
    if (i >= SETTLE_SKIP) {
      revs.push(c.revenue || 0);
      exps.push(c.expenses || 0);
    }
  }

  const avg = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : 0);
  const revAvg = avg(revs);
  const expAvg = avg(exps);
  return { industry, revAvg, expAvg, netAvg: revAvg - expAvg, launchDay };
}

// ====== 主流程 ======
if (!QUIET) {
  console.log("=".repeat(74));
  console.log("  6 行业盈利矩阵 — 固化验证（报告第三十二节）");
  console.log("=".repeat(74));
  console.log(
    `  分数口径: techScore=${TECH_SCORE}  marketScore=${MARKET_SCORE}  ` +
      `coding=${CODING_LV}  稳态窗口=第${SETTLE_SKIP + 1}~${STEADY_DAYS}天`,
  );
  console.log("");
}

const results = [];
// 行业顺序固定（按 industryMod 升序），seed 固定 → 可复现
INDUSTRIES.forEach((ind, i) => {
  const r = runIndustry(ind, 20260916 + i * 7);
  results.push(r);
});

if (!QUIET) {
  console.log(
    "  " +
      "行业".padEnd(14) +
      "日收入".padStart(10) +
      "日支出".padStart(10) +
      "日净".padStart(11) +
      "上线天".padStart(8) +
      "   判定",
  );
  console.log("  " + "-".repeat(66));
}

let allProfit = true;
const failed = [];

results.forEach((r) => {
  if (r.error || r.broke) {
    allProfit = false;
    failed.push(r.industry);
    const why = r.error ? r.error : `第 ${r.brokeDay} 天破产`;
    if (!QUIET) {
      console.log("  " + r.industry.padEnd(14) + "—".padStart(10) + "  ❌ " + why);
    }
    return;
  }
  const pass = r.netAvg > 0;
  if (!pass) {
    allProfit = false;
    failed.push(r.industry);
  }
  if (!QUIET) {
    console.log(
      "  " +
        r.industry.padEnd(14) +
        ("¥" + r.revAvg.toFixed(1)).padStart(10) +
        ("¥" + r.expAvg.toFixed(1)).padStart(10) +
        ((r.netAvg >= 0 ? "+¥" : "-¥") + Math.abs(r.netAvg).toFixed(1)).padStart(11) +
        String(r.launchDay).padStart(8) +
        "   " +
        (pass ? "✅ 盈利" : "❌ 亏损"),
    );
  }
});

if (!QUIET) {
  console.log("  " + "-".repeat(66));
  const profits = results.filter((r) => !r.error && !r.broke).map((r) => r.netAvg);
  if (profits.length) {
    const min = Math.min(...profits);
    const max = Math.max(...profits);
    const weakest = results.find((r) => r.netAvg === min);
    console.log(
      `  区间: ¥${min.toFixed(1)} ~ ¥${max.toFixed(1)}` +
        `   （最薄: ${weakest ? weakest.industry : "-"}）`,
    );
  }
  console.log("");
  if (allProfit) {
    console.log(`  ✅ 全部 ${INDUSTRIES.length} 个行业均可在现实分数下盈利`);
  } else {
    console.log(`  ❌ 有行业亏损/失败: ${failed.join(", ")}`);
  }
  console.log("=".repeat(74));
} else {
  // 门禁模式：单行紧凑输出
  console.log(
    `[industry-profit] ${allProfit ? "PASS" : "FAIL"} ` +
      results
        .map((r) =>
          r.error || r.broke
            ? `${r.industry}=ERR`
            : `${r.industry}=${r.netAvg >= 0 ? "+" : ""}${r.netAvg.toFixed(0)}`,
        )
        .join(" "),
  );
}

process.exit(allProfit ? 0 : 1);
