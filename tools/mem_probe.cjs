#!/usr/bin/env node
/**
 * mem_probe.cjs — 无头运行器内存/泄漏诊断工具集
 *
 * 背景：monte_carlo.cjs 曾在大参数（20 局 × 500 天）下 OOM。
 * 定位过程沉淀为 5 个子探针，本工具将其固化，供后续性能问题复用。
 *
 * 用法：
 *   node tools/mem_probe.cjs gc    [--trials 12] [--days 300] [--strategy grinder]
 *   node tools/mem_probe.cjs ref   [--trials 8]  [--days 200] [--strategy grinder]
 *   node tools/mem_probe.cjs deep  [--days 400]  [--strategy skiller]
 *   node tools/mem_probe.cjs dom   [--trials 8]  [--days 120] [--strategy grinder]
 *   node tools/mem_probe.cjs save  [--days 400]  [--strategy skiller]
 *   node tools/mem_probe.cjs all   [--trials 8]  [--days 200]
 *
 * 子命令说明：
 *   gc   — 强制 GC 后采样堆增长，区分【真泄漏】与【未回收垃圾】。需 --expose-gc。
 *   ref  — 用 WeakRef 判断旧局 state 是否真的被回收（存在引用持有者 = 泄漏在 state 上）。
 *   deep — 递归扫描 state 全图，找出跨天增长最大的容器（无上限容器的定位手段）。
 *   dom  — 检查 DOM 存根 document.body.children 是否跨局累积（历史真凶）。
 *   save — 量化无上限容器对存档 JSON 体积的影响。
 *   all  — 依次跑 gc / ref / dom（不含 deep/save，它们耗时更长）。
 *
 * 典型结论判读：
 *   - gc 后仍线性增长 → 真泄漏，继续用 ref 确认 state 是否存活，再用 deep 定位容器。
 *   - dom 子命令的 bodyChildren 单调上升 → DOM 存根单例未清理，需在 runTrial 开头调 runner.resetDom()。
 */
"use strict";

const path = require("path");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

// ---------- 参数解析 ----------
const argv = process.argv.slice(2);
const sub = argv[0] && !argv[0].startsWith("--") ? argv[0] : "all";
function argNum(name, dflt) {
  const i = argv.indexOf("--" + name);
  if (i < 0) return dflt;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) ? v : dflt;
}
function argStr(name, dflt) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : dflt;
}

const mb = (n) => (n / 1024 / 1024).toFixed(1);
const kb = (n) => (n / 1024).toFixed(1);

// ---------- 公共：跑一局 ----------
function runTrial(t, days, strategyName, opts) {
  opts = opts || {};
  if (opts.resetDom && typeof runner.resetDom === "function") runner.resetDom();
  const state = runner.createState({ seed: 1000 + t * 7919, scenario: "classic" });
  const policy = runner.getStrategy(strategyName);
  let ran = 0;
  for (let d = 0; d < days; d++) {
    try {
      if (typeof policy === "function") policy(state);
    } catch (e) {}
    try {
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    } catch (e) {
      break;
    }
    ran++;
    if (opts.clearPending) {
      state._pendingEvent = null;
      state._pendingEventId = null;
    }
    if (state.flags && state.flags.gameOver) break;
    if (state.status && state.status.health <= 0) break;
  }
  return { state, ran };
}

// ---------- 子命令：gc ----------
function probeGc() {
  const TRIALS = argNum("trials", 12);
  const DAYS = argNum("days", 300);
  const STRAT = argStr("strategy", "grinder");
  const hasGc = typeof global.gc === "function";

  console.log("=== [gc] GC 对照探针 ===");
  console.log("策略=" + STRAT + "  局数=" + TRIALS + "  天数=" + DAYS + "  gc 可用: " + hasGc);
  if (!hasGc) console.log("提示：未启用 --expose-gc，gc 后堆 == 采样前堆，结论不可用。");
  console.log("");
  console.log("局 | 天数 | 采样前heap | gc后heap | rss");

  const rows = [];
  for (let t = 0; t < TRIALS; t++) {
    const { ran } = runTrial(t, DAYS, STRAT);
    const before = process.memoryUsage().heapUsed;
    if (hasGc) {
      global.gc();
      global.gc();
    }
    const after = process.memoryUsage().heapUsed;
    const rss = process.memoryUsage().rss;
    rows.push({ t: t + 1, ran, before, after });
    console.log(
      String(t + 1).padStart(2) +
        " | " +
        String(ran).padStart(4) +
        " | " +
        mb(before).padStart(9) +
        "MB | " +
        mb(after).padStart(8) +
        "MB | " +
        mb(rss).padStart(7) +
        "MB"
    );
  }

  const a = rows[0];
  const b = rows[rows.length - 1];
  const span = Math.max(1, b.t - a.t);
  const perBefore = (b.before - a.before) / span / 1024;
  const perAfter = (b.after - a.after) / span / 1024;

  console.log("\n--- 结论 ---");
  console.log("采样前堆: " + mb(a.before) + " → " + mb(b.before) + "  (+" + mb(b.before - a.before) + "MB / " + span + " 局)");
  console.log("gc 后堆 : " + mb(a.after) + " → " + mb(b.after) + "  (+" + mb(b.after - a.after) + "MB / " + span + " 局)");
  console.log("每局增长  采样前: " + perBefore.toFixed(1) + " KB/局   gc后: " + perAfter.toFixed(1) + " KB/局");
  if (!hasGc) {
    console.log("→ 需要 --expose-gc 才能判定。");
  } else if (perAfter < perBefore * 0.2) {
    console.log("→ gc 后增长基本消失 = 【不是真泄漏】，OOM 是堆压力/GC 时机问题。");
  } else {
    console.log("→ gc 后仍在增长 = 【真泄漏】。下一步：ref 确认 state 存活，再 deep 定位容器。");
  }
  return perAfter;
}

// ---------- 子命令：ref ----------
function probeRef() {
  const TRIALS = argNum("trials", 8);
  const DAYS = argNum("days", 200);
  const STRAT = argStr("strategy", "grinder");

  console.log("=== [ref] 旧局 state 回收检验（WeakRef）===");
  if (typeof global.gc !== "function") {
    console.log("警告：未启用 --expose-gc，WeakRef 结果不可靠。请用 node --expose-gc 运行。\n");
  }
  const refs = [];
  for (let t = 0; t < TRIALS; t++) {
    const { state } = runTrial(t, DAYS, STRAT);
    refs.push(new WeakRef(state));
    if (typeof global.gc === "function") {
      global.gc();
      global.gc();
      global.gc();
    }
    const alive = refs.map((r, i) => (r.deref() ? i + 1 : null)).filter(Boolean);
    console.log(
      "第 " +
        String(t + 1).padStart(2) +
        " 局后 | heap=" +
        mb(process.memoryUsage().heapUsed).padStart(6) +
        "MB | 仍存活的历史 state 局号: " +
        (alive.join(",") || "（全部已回收）")
    );
  }
  const aliveCount = refs.filter((r) => r.deref()).length;
  console.log("\n存活数量: " + aliveCount + " / " + refs.length);
  console.log(
    aliveCount > 0
      ? "→ 旧局 state 未被回收 = 存在明确引用持有者（全局单例/闭包/未清理容器）。"
      : "→ 旧局 state 全部回收 = 泄漏不在 state 对象上，检查 DOM 存根等运行器侧单例。"
  );
}

// ---------- 子命令：dom ----------
function probeDom() {
  const TRIALS = argNum("trials", 8);
  const DAYS = argNum("days", 120);
  const STRAT = argStr("strategy", "grinder");
  const bodyChildren = () => {
    const d = globalThis.document;
    return d && d.body && d.body.children ? d.body.children.length : -1;
  };

  console.log("=== [dom] DOM 存根跨局累积探针 ===");
  console.log("策略=" + STRAT + "  每阶段局数=" + TRIALS + "  天数=" + DAYS);
  console.log("说明：headless_runner 的 document 存根是 init() 时创建的单例，");
  console.log("      appendChild 只 push 不清理 → 跨局累积（历史真凶）。");
  console.log("两阶段对照：A 阶段不 resetDom，B 阶段每局前 resetDom。\n");

  function phase(label, doReset) {
    console.log("--- 阶段 " + label + "（resetDom=" + (doReset ? "是" : "否") + "）---");
    console.log("局 | 天数 | bodyChildren | heap(gc后)");
    const series = [];
    for (let t = 0; t < TRIALS; t++) {
      const { ran } = runTrial(t, DAYS, STRAT, { resetDom: doReset });
      if (typeof global.gc === "function") {
        global.gc();
        global.gc();
      }
      const bc = bodyChildren();
      series.push({ t: t + 1, bc });
      console.log(
        String(t + 1).padStart(2) +
          " | " +
          String(ran).padStart(4) +
          " | " +
          String(bc).padStart(12) +
          " | " +
          mb(process.memoryUsage().heapUsed).padStart(9) +
          "MB"
      );
    }
    console.log("");
    return series;
  }

  const noReset = phase("A 不重置", false);
  const withReset = phase("B 每局重置", true);

  console.log("--- 结论 ---");
  const aFirst = noReset[0].bc;
  const aLast = noReset[noReset.length - 1].bc;
  const bFirst = withReset[0].bc;
  const bLast = withReset[withReset.length - 1].bc;
  const aSlope = (aLast - aFirst) / Math.max(1, noReset.length - 1);
  const bSlope = (bLast - bFirst) / Math.max(1, withReset.length - 1);
  console.log("A 不重置: bodyChildren " + aFirst + " → " + aLast + "  (斜率 " + aSlope.toFixed(0) + "/局)");
  console.log("B 每局重置: bodyChildren " + bFirst + " → " + bLast + "  (斜率 " + bSlope.toFixed(0) + "/局)");
  if (aSlope > 20 && bSlope < aSlope * 0.3) {
    console.log("→ 【确认】未重置会线性累积，resetDom 已生效，DOM 存根不再是跨局泄漏源。");
  } else if (bSlope >= aSlope * 0.3 && bSlope > 20) {
    console.log("→ 【异常】resetDom 未生效或存根仍有其它累积路径，检查 headless_runner._resetDom()。");
  } else {
    console.log("→ 【无累积】当前参数下 DOM 存根未表现跨局增长，无需处理。");
  }
}

// ---------- 子命令：deep ----------
function probeDeep() {
  const DAYS = argNum("days", 400);
  const STRAT = argStr("strategy", "skiller");

  console.log("=== [deep] state 容器跨天增长扫描 ===");
  console.log("策略=" + STRAT + "  天数=" + DAYS + "\n");

  function walk(root, cb) {
    const seen = new WeakSet();
    const stack = [["", root]];
    while (stack.length) {
      const item = stack.pop();
      const pathStr = item[0];
      const v = item[1];
      if (!v || typeof v !== "object") continue;
      if (seen.has(v)) continue;
      seen.add(v);
      cb(pathStr, v);
      if (Array.isArray(v)) {
        for (let i = 0; i < Math.min(v.length, 30); i++) stack.push([pathStr + "[" + i + "]", v[i]]);
      } else {
        let ks;
        try {
          ks = Object.keys(v);
        } catch (e) {
          continue;
        }
        for (const k of ks) {
          if (k === "_pendingEvent") continue;
          stack.push([pathStr ? pathStr + "." + k : k, v[k]]);
        }
      }
    }
  }

  function snapshot(state) {
    const out = {};
    walk(state, (p, v) => {
      if (Array.isArray(v)) {
        if (v.length >= 20) out[p] = "arr:" + v.length;
      } else {
        let n = 0;
        try {
          n = Object.keys(v).length;
        } catch (e) {}
        if (n >= 40) out[p] = "obj:" + n;
      }
    });
    return out;
  }

  const state = runner.createState({ seed: 1000, scenario: "classic" });
  const policy = runner.getStrategy(STRAT);
  let sMid = null;
  let midDay = Math.floor(DAYS / 8);
  for (let d = 0; d < DAYS; d++) {
    try {
      policy(state);
    } catch (e) {}
    try {
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    } catch (e) {
      break;
    }
    state._pendingEvent = null;
    state._pendingEventId = null;
    if (d === midDay - 1) sMid = snapshot(state);
    if (state.flags && state.flags.gameOver) {
      console.log("gameOver day " + (d + 1));
      break;
    }
    if (state.status && state.status.health <= 0) {
      console.log("健康归零 day " + (d + 1));
      break;
    }
  }
  const sEnd = snapshot(state);
  console.log("最终 day:", state.player.day);

  const keys = new Set([].concat(Object.keys(sMid || {}), Object.keys(sEnd)));
  const rows = [];
  keys.forEach((k) => {
    const a = sMid ? sMid[k] : undefined;
    const b = sEnd[k];
    const na = a ? Number(a.split(":")[1]) : 0;
    const nb = b ? Number(b.split(":")[1]) : 0;
    if (nb > na) rows.push({ k, a, b, d: nb - na });
  });
  rows.sort((x, y) => y.d - x.d);

  console.log("\n--- day" + midDay + " → 末日 的增长容器 Top 25 ---");
  if (!rows.length) console.log("（无增长）");
  rows.slice(0, 25).forEach((r) => console.log("  +" + String(r.d).padStart(6) + "  " + r.k + "   " + r.a + " → " + r.b));

  console.log("\n--- 末日最大的容器 Top 20 ---");
  Object.entries(sEnd)
    .map(([k, v]) => ({ k, n: Number(v.split(":")[1]), t: v.split(":")[0] }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 20)
    .forEach((r) => console.log("  " + r.t + " " + String(r.n).padStart(6) + "  " + r.k));
}

// ---------- 子命令：save ----------
function probeSave() {
  const DAYS = argNum("days", 400);
  const STRAT = argStr("strategy", "skiller");

  console.log("=== [save] 存档体积 / 无上限容器增长 ===");
  console.log("策略=" + STRAT + "  天数=" + DAYS + "\n");
  const state = runner.createState({ seed: 1000, scenario: "classic" });
  const policy = runner.getStrategy(STRAT);
  console.log("day  | 存档JSON | _newsPopupSeen | rumorHistory | messageLog | _priceIndexHistory");
  for (let d = 0; d < DAYS; d++) {
    try {
      policy(state);
    } catch (e) {}
    try {
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    } catch (e) {
      break;
    }
    state._pendingEvent = null;
    state._pendingEventId = null;
    if (d % 50 === 0 || d === DAYS - 1) {
      const f = state.flags || {};
      const nps = f._newsPopupSeen ? Object.keys(f._newsPopupSeen).length : 0;
      const rh = state.insiderTrading && state.insiderTrading.rumorHistory ? state.insiderTrading.rumorHistory.length : 0;
      const pi = f._priceIndexHistory ? f._priceIndexHistory.length : 0;
      let json = "";
      try {
        json = JSON.stringify(state);
      } catch (e) {
        json = "ERR";
      }
      console.log(
        String(state.player.day).padStart(4) +
          " | " +
          kb(json.length).padStart(9) +
          " | " +
          String(nps).padStart(6) +
          " | " +
          String(rh).padStart(5) +
          " | " +
          String((state.messageLog || []).length).padStart(5) +
          " | " +
          String(pi).padStart(5)
      );
    }
    if (state.flags && state.flags.gameOver) {
      console.log("gameOver day " + state.player.day);
      break;
    }
    if (state.status && state.status.health <= 0) {
      console.log("健康归零 day " + state.player.day);
      break;
    }
  }
}

// ---------- 调度 ----------
const USAGE = [
  "mem_probe.cjs — 无头运行器内存/泄漏诊断工具集",
  "",
  "用法: node [--expose-gc] tools/mem_probe.cjs <子命令> [选项]",
  "",
  "子命令:",
  "  gc     强制 GC 后采样堆增长（区分真泄漏 vs 未回收垃圾）",
  "  ref    WeakRef 检验旧局 state 是否被回收",
  "  deep   递归扫描 state 容器增长（定位无上限容器）",
  "  dom    检查 DOM 存根 body.children 跨局累积",
  "  save   存档体积 / 无上限容器增长",
  "  all    依次跑 gc / ref / dom",
  "",
  "选项: --trials N --days N --strategy <balanced|grinder|skiller|trader|social|corporate>",
].join("\n");

function main() {
  if (sub === "help" || sub === "-h" || sub === "--help") {
    console.log(USAGE);
    return;
  }
  // deep/save 需要单局长跑，不需要 resetDom（同一 state 内累积正是观察对象）
  const tasks = {
    gc: probeGc,
    ref: probeRef,
    dom: probeDom,
    deep: probeDeep,
    save: probeSave,
    all: function () {
      probeGc();
      console.log("\n" + "=".repeat(60) + "\n");
      probeRef();
      console.log("\n" + "=".repeat(60) + "\n");
      probeDom();
    },
  };
  const fn = tasks[sub];
  if (!fn) {
    console.log("未知子命令: " + sub + "\n");
    console.log(USAGE);
    process.exitCode = 1;
    return;
  }
  runner.init({ strict: false });
  fn();
}

main();
