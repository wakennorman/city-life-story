#!/usr/bin/env node
/**
 * ab-attribution.cjs — 把「平衡数字变化」归因到具体修复
 *
 * 背景：2026-09-15 第三轮修了 5 处静默失效。修完重跑基线，发现存活率下降、
 * 唯一事件数大幅上升。问题是：**哪一处修复导致了存活率下降？**
 *
 * 难点：任何修复只要改变了 Random 的调用次数 / 顺序，整条 PRNG 流就全变了，
 * 所有数字都会跟着变 —— 所以「修复前后对比」本身无法归因，只能看出「变了」。
 *
 * 做法：**只关掉一处修复，其余保持不变**，跑同一批种子，看差异有多大。
 * 关闭是运行时模拟（见 tests/monte_carlo.cjs 的 CLS_AB 开关），不改源码。
 *
 * 用法：
 *   node scripts/ab-attribution.cjs                              # 5 组 × 20 局 × 300 天
 *   node scripts/ab-attribution.cjs --trials 40 --days 300
 *   node scripts/ab-attribution.cjs --groups baseline,no-yield   # 只跑指定组
 *   node scripts/ab-attribution.cjs --json                       # 只输出 JSON
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
function argStr(n, d) {
  const i = argv.indexOf("--" + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
}

const TRIALS = argNum("trials", 20);
const DAYS = argNum("days", 300);
const SEED = argNum("seed", 20260915);
const JSON_ONLY = argv.includes("--json");

// 每组 = 一个「关闭了哪些修复」的组合。key 必须与 MC 的 CLS_AB 值一致。
const ALL_GROUPS = [
  { key: "baseline", env: "", label: "全部修复（真实基线）" },
  { key: "no-yield", env: "no-yield", label: "关闭：事件槽让位闸" },
  { key: "no-trigger", env: "no-trigger", label: "关闭：触发槽注册链" },
  { key: "no-news", env: "no-news", label: "关闭：P0-6 新闻价格效果" },
  { key: "all-off", env: "no-yield,no-trigger,no-news", label: "全部关闭（≈修复前）" },
];
const want = argStr("groups", "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const GROUPS = want.length ? ALL_GROUPS.filter((g) => want.indexOf(g.key) >= 0) : ALL_GROUPS;

// —— 解析 MC 输出 ——
// 每策略段以 "  📊 策略: <name> (<n> 次, <秒>)" 开头
function parse(out) {
  const res = {};
  const blocks = out.split(/📊 策略: /).slice(1);
  for (const b of blocks) {
    const nm = b.match(/^(\w+)/);
    if (!nm) continue;
    const name = nm[1];
    const surv = b.match(/存活率:\s+[^\d\n]*([\d.]+)%/);
    const deathDay = b.match(/死亡平均天数:\s*([\d.]+)/);
    const uniq = b.match(/唯一事件数:\s*([\d.]+)/);
    const total = b.match(/总事件触发:\s*([\d.]+)/);
    const topRepeat = b.match(/最高单事件重复\s*(\d+)\s*次（([\w]+)）/);
    // 死亡原因：抓 "    <原因>: <n>" 行（在「死亡原因:」之后）
    const causes = {};
    const causeBlock = b.match(/死亡原因:\n([\s\S]*?)(?:\n\s*\n|$)/);
    if (causeBlock) {
      for (const line of causeBlock[1].split("\n")) {
        const m = line.match(/^\s{4,}(.+?):\s*(\d+)\s*$/);
        if (m) causes[m[1].trim()] = +m[2];
      }
    }
    res[name] = {
      survival: surv ? +surv[1] : null,
      deathDay: deathDay ? +deathDay[1] : null,
      uniqueEvents: uniq ? +uniq[1] : null,
      totalEvents: total ? +total[1] : null,
      topRepeat: topRepeat ? { n: +topRepeat[1], id: topRepeat[2] } : null,
      causes,
    };
  }
  return res;
}

function runGroup(g) {
  const env = Object.assign({}, process.env);
  if (g.env) env.CLS_AB = g.env;
  else delete env.CLS_AB;
  const t0 = Date.now();
  const r = spawnSync(
    process.execPath,
    [MC, "--trials", String(TRIALS), "--days", String(DAYS), "--seed", String(SEED)],
    { cwd: ROOT, env, encoding: "utf8", maxBuffer: 256 * 1024 * 1024 },
  );
  const sec = ((Date.now() - t0) / 1000).toFixed(1);
  if (r.status !== 0) {
    return { key: g.key, label: g.label, env: g.env, error: "exit " + r.status, sec };
  }
  return {
    key: g.key,
    label: g.label,
    env: g.env,
    sec,
    stats: parse(r.stdout || ""),
  };
}

function main() {
  if (!JSON_ONLY) {
    console.log("=".repeat(76));
    console.log("  A/B 归因实验 — 逐项关闭修复，看平衡数字各变化多少");
    console.log(
      "  参数: " +
        GROUPS.length +
        " 组 × " +
        TRIALS +
        " 局 × " +
        DAYS +
        " 天, seed=" +
        SEED,
    );
    console.log("=".repeat(76));
  }

  const results = [];
  for (const g of GROUPS) {
    if (!JSON_ONLY) process.stdout.write("  跑 " + g.key.padEnd(12) + " ... ");
    const r = runGroup(g);
    results.push(r);
    if (!JSON_ONLY) {
      console.log(r.error ? "❌ " + r.error : "✅ " + r.sec + "s");
    }
  }

  if (JSON_ONLY) {
    console.log(JSON.stringify({ trials: TRIALS, days: DAYS, seed: SEED, results }, null, 2));
    return;
  }

  // —— 策略顺序 ——
  const strategies = [];
  for (const r of results) {
    if (!r.stats) continue;
    for (const k of Object.keys(r.stats)) if (strategies.indexOf(k) < 0) strategies.push(k);
  }

  // —— 存活率对比表 ——
  console.log("\n" + "=".repeat(76));
  console.log("  📈 存活率对比（行=策略，列=组）");
  console.log("=".repeat(76));
  const w = 12;
  let hdr = "  策略".padEnd(w);
  for (const r of results) hdr += r.key.padEnd(w);
  console.log(hdr);
  console.log("  " + "-".repeat(w * (results.length + 1)));
  for (const s of strategies) {
    let line = "  " + s.padEnd(w - 2);
    for (const r of results) {
      const v = r.stats && r.stats[s] ? r.stats[s].survival : null;
      line += (v === null || v === undefined ? "—" : v.toFixed(1) + "%").padEnd(w);
    }
    console.log(line);
  }

  // —— 唯一事件数对比表 ——
  console.log("\n" + "=".repeat(76));
  console.log("  📰 唯一事件数对比（真实内容触达）");
  console.log("=".repeat(76));
  console.log(hdr);
  console.log("  " + "-".repeat(w * (results.length + 1)));
  for (const s of strategies) {
    let line = "  " + s.padEnd(w - 2);
    for (const r of results) {
      const v = r.stats && r.stats[s] ? r.stats[s].uniqueEvents : null;
      line += (v === null || v === undefined ? "—" : v.toFixed(1)).padEnd(w);
    }
    console.log(line);
  }

  // —— 相对基线的差值（只在有 baseline 时给出）——
  const base = results.find((r) => r.key === "baseline" && r.stats);
  if (base) {
    console.log("\n" + "=".repeat(76));
    console.log("  🔍 相对「全部修复」的差值（存活率百分点 / 唯一事件数）");
    console.log("=".repeat(76));
    for (const r of results) {
      if (r.key === "baseline" || !r.stats) continue;
      console.log("\n  【" + r.key + "】" + r.label);
      for (const s of strategies) {
        const b = base.stats[s];
        const c = r.stats[s];
        if (!b || !c) continue;
        const ds = c.survival !== null && b.survival !== null ? c.survival - b.survival : null;
        const de =
          c.uniqueEvents !== null && b.uniqueEvents !== null
            ? c.uniqueEvents - b.uniqueEvents
            : null;
        const sign = (x) => (x > 0 ? "+" : "") + x.toFixed(1);
        console.log(
          "    " +
            s.padEnd(12) +
            "存活 " +
            (ds === null ? "—" : sign(ds) + "pt") +
            " ｜ 唯一事件 " +
            (de === null ? "—" : sign(de)),
        );
      }
    }
  }

  // —— 落档 ——
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").substring(0, 19);
  const outDir = path.join(ROOT, "docs", "baseline");
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(
    outDir,
    "ab-" + stamp + "-t" + TRIALS + "d" + DAYS + "-seed" + SEED + ".json",
  );
  fs.writeFileSync(outFile, JSON.stringify({ trials: TRIALS, days: DAYS, seed: SEED, results }, null, 2));
  console.log("\n  已落档: " + path.relative(ROOT, outFile));
  console.log("=".repeat(76) + "\n");
}

main();
