#!/usr/bin/env node
/**
 * run-baseline.cjs — 跑 MC 平衡基线，并**自校验可复现性**
 *
 * 为什么要自校验：2026-09-15 之前，本项目的 MC 跑分因「共享新闻池被就地改写」
 * 而不可复现（同种子两次结果不同），历史数字无法互相比较。
 * 基线脚本必须自己证明"这次跑出来的数字是可复现的"，否则不能当基线用。
 *
 * 做法：同参数跑两次 → 排除墙钟噪音后逐行对比 → 一致才算通过。
 *
 * 用法：
 *   node scripts/run-baseline.cjs                          # 默认 7 策略 × 10 局 × 300 天
 *   node scripts/run-baseline.cjs --trials 20 --days 500
 *   node scripts/run-baseline.cjs --answer-events           # 代玩家作答（会改变基线）
 *   node scripts/run-baseline.cjs --skip-verify             # 只跑一次（不校验）
 *   node scripts/run-baseline.cjs --check-only              # 只做可复现性校验，不落档（CI 用）
 *
 * 环境变量：
 *   CLS_AB=<a,b,...>  透传给 MC 的 A/B 开关（no-yield / no-news / no-trigger /
 *                     no-passive / fix-fatigue-rest / fix-fatigue-rest2 /
 *                     legacy-health-branch / fix-health-branch / no-health-branch /
 *                     legacy-job-cost / legacy-startup-threshold）。
 *                     **A/B 结果不是基线**，只用于归因，请勿用 A/B 输出覆盖
 *                     docs/baseline/ 里的文件。
 *                     ⚠️ 注意：低血分支的**默认行为**已于 2026-09-16 改为「去诊所挂水」
 *                     （见 monte_carlo.cjs 开关声明处）。`legacy-health-branch` 可复现
 *                     改动前的旧默认（存活率 77.4%），用于和 09-15 基线做对照。
 *
 *   ⚠️ **`exp-*` 三个开关已于 2026-09-16 第十八轮彻底移除** —— 它们自第十五轮起
 *      就是死参数（所篡改的 `mcStartupIncome` 已删除，那个「估值×利润率」模型游戏里
 *      不存在）。传入不再有任何效果。要改创业难度请直接改 `src/js/phase2/startup.js`。
 *
 *   ✅ **2026-09-16 第十一轮：两处口径修复已转正为默认**（不再需要显式开启）：
 *     · `real-job-cost`（打工成本：AP 33 / 真实疲劳·卫生字段）—— 默认开启；
 *     · `fix-startup-threshold`（创业门槛按剧本取真实值 classic→¥15,000）—— 默认开启。
 *     → **默认输出 = "夹具记准账"的形态**：策略收益跨度 **31.7 倍**（t24 实测；
 *       旧口径 144 倍、仅转正单价的过渡态 a7 为 36.5 倍）、
 *       corporate 创业率 **69.6%**（旧口径 30.4%）。
 *     要用**旧（已知错误）口径**对照时，显式传 `legacy-job-cost,legacy-startup-threshold`
 *     —— 此时脚本会打印"🔁 旧口径对照模式"警告，**其产物绝不能当基线**。
 *     详见报告第二十七节。
 */
"use strict";
const path = require("path");
const fs = require("fs");
const { spawnSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const MC = path.join(ROOT, "tests", "monte_carlo.cjs");

const argv = process.argv.slice(2);
function argNum(n, d) {
  const i = argv.indexOf("--" + n);
  return i >= 0 && Number.isFinite(Number(argv[i + 1])) ? Number(argv[i + 1]) : d;
}
const TRIALS = argNum("trials", 10);
const DAYS = argNum("days", 300);
const SEED = argNum("seed", 20260915);
const ANSWER = argv.includes("--answer-events");
const SKIP_VERIFY = argv.includes("--skip-verify");
const CHECK_ONLY = argv.includes("--check-only");

// 墙钟噪音：每次跑都会变，与游戏逻辑无关，对比时必须排除
const WALLCLOCK = /加载:|总耗时:|次, [0-9.]+\)|^\s*20\d\d-\d\d-\d\d \d\d:\d\d:\d\d\s*$/;
function stripWallClock(text) {
  return text
    .split("\n")
    .filter((l) => !WALLCLOCK.test(l))
    .join("\n");
}

function runMc(tag) {
  const args = [MC, "--trials", String(TRIALS), "--days", String(DAYS), "--seed", String(SEED)];
  if (ANSWER) args.push("--answer-events");
  const t0 = Date.now();
  process.stdout.write("  · 运行 " + tag + " ... ");
  const r = spawnSync(process.execPath, args, {
    encoding: "utf8",
    maxBuffer: 256 * 1024 * 1024,
    timeout: 3600000,
    cwd: ROOT,
  });
  const out = (r.stdout || "") + (r.stderr || "");
  console.log(((Date.now() - t0) / 1000).toFixed(1) + "s");
  return out;
}

console.log("=".repeat(72));
console.log("  MC 平衡基线（含可复现性自校验）");
console.log("=".repeat(72));
console.log("  参数: 策略=all, " + TRIALS + " 局 × " + DAYS + " 天, seed=" + SEED +
  (ANSWER ? ", 作答=开" : ", 作答=关"));
console.log("");

console.log("跑第 1 次：");
const a = runMc("A");

let b = null;
let reproducible = null;
if (!SKIP_VERIFY) {
  console.log("跑第 2 次（校验可复现性）：");
  b = runMc("B");
  const sa = stripWallClock(a);
  const sb = stripWallClock(b);
  reproducible = sa === sb;
  if (reproducible) {
    console.log("\n✅ 可复现性校验通过：两次输出排除墙钟后逐字节一致");
  } else {
    console.log("\n❌ 可复现性校验失败：两次输出存在非墙钟差异");
    const la = sa.split("\n");
    const lb = sb.split("\n");
    const n = Math.max(la.length, lb.length);
    let shown = 0;
    for (let i = 0; i < n && shown < 12; i++) {
      if (la[i] !== lb[i]) {
        console.log("   第 " + (i + 1) + " 行：");
        console.log("     A = " + String(la[i]).slice(0, 120));
        console.log("     B = " + String(lb[i]).slice(0, 120));
        shown++;
      }
    }
    console.log("\n⚠️  本次数字**不可当基线**。请先排查跨局污染（见 scripts/trace-divergence.cjs）。");
  }
} else {
  console.log("\n（--skip-verify：未做可复现性校验，本次数字不建议当基线）");
}

// —— 落档 ——
if (CHECK_ONLY) {
  console.log("\n（--check-only：只做可复现性校验，未落档）");
  process.exit(reproducible === false ? 1 : 0);
}
const dir = path.join(ROOT, "docs", "baseline");
fs.mkdirSync(dir, { recursive: true });
const stamp = new Date().toISOString().slice(0, 10);
const tag = "mc-" + stamp + "-t" + TRIALS + "d" + DAYS + "-seed" + SEED + (ANSWER ? "-answered" : "");
const outFile = path.join(dir, tag + ".txt");
const header = [
  "MC 平衡基线",
  "生成时间: " + new Date().toISOString(),
  "参数: 策略=all, " + TRIALS + " 局 × " + DAYS + " 天, seed=" + SEED,
  "作答: " + (ANSWER ? "开（--answer-events）" : "关"),
  "可复现性校验: " + (reproducible === null ? "未做" : reproducible ? "✅ 通过" : "❌ 失败"),
  "复现命令: node tests/monte_carlo.cjs --trials " + TRIALS + " --days " + DAYS + " --seed " + SEED +
    (ANSWER ? " --answer-events" : ""),
  "=".repeat(72),
  "",
].join("\n");
fs.writeFileSync(outFile, header + a, "utf8");
console.log("\n基线已落档: " + path.relative(ROOT, outFile).replace(/\\/g, "/"));

process.exit(reproducible === false ? 1 : 0);
