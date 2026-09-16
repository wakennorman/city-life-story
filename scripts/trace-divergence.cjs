#!/usr/bin/env node
/**
 * trace-divergence.cjs — 定位「同种子两次跑分从第几天开始分叉，分叉在哪个字段」
 *
 * 设计要点：
 *   必须在**独立进程**里各跑一次，否则无法区分
 *     (a) 真·非确定性（同进程内代码路径本身不确定）
 *     (b) 跨局污染（模块级全局状态在两局之间残留）
 *   两者都是「不可复现」，但根因和修法完全不同。
 *
 * 用法：
 *   node scripts/trace-divergence.cjs                    # 驱动：spawn 两个独立进程并对比
 *   node scripts/trace-divergence.cjs --single           # 单跑，输出逐日哈希（供外部对比）
 *   node scripts/trace-divergence.cjs --inproc           # 同进程跑两次（暴露跨局污染）
 *   node scripts/trace-divergence.cjs --days 120 --seed 12345 --strategy balanced
 */
"use strict";
const path = require("path");
const crypto = require("crypto");
const { spawnSync } = require("child_process");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

const argv = process.argv.slice(2);
function argNum(n, d) {
  const i = argv.indexOf("--" + n);
  return i >= 0 && Number.isFinite(Number(argv[i + 1])) ? Number(argv[i + 1]) : d;
}
function argStr(n, d) {
  const i = argv.indexOf("--" + n);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : d;
}
const DAYS = argNum("days", 120);
const SEED = argNum("seed", 12345);
const STRATEGY = argStr("strategy", "balanced");

// 易变字段：真实时钟写入的时间戳，与模拟逻辑无关，参与哈希会掩盖真信号
const VOLATILE = new Set(["createdAt", "lastPlayedAt", "savedAt", "updatedAt", "timestamp"]);

// —— 规范化序列化：跳过函数/DOM/循环引用，key 排序保证稳定 ——
function canon(v, seen, depth) {
  seen = seen || new WeakSet();
  depth = depth || 0;
  if (depth > 8) return "[deep]";
  if (v === null) return "null";
  const t = typeof v;
  if (t === "number") return Number.isFinite(v) ? String(v) : "NONFINITE";
  if (t === "string") return JSON.stringify(v);
  if (t === "boolean") return String(v);
  if (t === "undefined") return "undef";
  if (t === "function") return "[fn]";
  if (t === "symbol") return "[sym]";
  if (t === "bigint") return String(v);
  if (seen.has(v)) return "[circ]";
  seen.add(v);
  if (Array.isArray(v)) return "[" + v.map((x) => canon(x, seen, depth + 1)).join(",") + "]";
  const keys = Object.keys(v).sort();
  const parts = [];
  for (const k of keys) {
    if (k.startsWith("__")) continue;
    if (VOLATILE.has(k)) continue;
    let val;
    try {
      val = v[k];
    } catch {
      continue;
    }
    parts.push(JSON.stringify(k) + ":" + canon(val, seen, depth + 1));
  }
  return "{" + parts.join(",") + "}";
}
function hashOf(st) {
  return crypto.createHash("sha1").update(canon(st)).digest("hex").slice(0, 12);
}

// —— 逐字段扁平化，用于 diff ——
function flatten(v, prefix, out, depth) {
  out = out || {};
  depth = depth || 0;
  if (depth > 6) return out;
  const t = typeof v;
  if (v === null || t === "number" || t === "string" || t === "boolean" || t === "undefined") {
    out[prefix] = t === "string" && v.length > 80 ? v.slice(0, 80) + "…" : v;
    return out;
  }
  if (t === "function") return out;
  if (Array.isArray(v)) {
    if (v.length > 30) out[prefix + ".length"] = v.length;
    const lim = Math.min(v.length, 30);
    for (let i = 0; i < lim; i++) flatten(v[i], prefix + "[" + i + "]", out, depth + 1);
    return out;
  }
  for (const k of Object.keys(v)) {
    if (k.startsWith("__")) continue;
    let val;
    try {
      val = v[k];
    } catch {
      continue;
    }
    flatten(val, prefix ? prefix + "." + k : k, out, depth + 1);
  }
  return out;
}

const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}
const policy = runner.getStrategy(STRATEGY);

/** 跑一局；onDay(day, state) 每天回调；返回 {state, days} */
function runOnce(onDay, stopAtDay) {
  const state = runner.createState({ seed: SEED, scenario: "classic" });
  if (!state) return { state: null, days: 0 };
  let days = 0;
  for (let d = 0; d < DAYS; d++) {
    try {
      if (typeof policy === "function") policy(state);
    } catch {
      /* ignore */
    }
    try {
      state.player.actionPoints = 0;
      state.player.timeSlot = "evening";
      if (typeof runDailyPipeline === "function") runDailyPipeline(state);
    } catch {
      break;
    }
    days++;
    if (state._pendingEvent) {
      const c = state._pendingEvent.choices && state._pendingEvent.choices[0];
      try {
        if (c && typeof c.apply === "function") c.apply(state);
      } catch {
        /* ignore */
      }
    }
    if (onDay) onDay(days, state);
    if (stopAtDay && days >= stopAtDay) break;
  }
  return { state, days };
}

// ================= 全局变量泄漏模式 =================
// 跑一局前后，对比 globalThis 上所有自身属性的值。
// 任何「跑完一局后值变了」的模块级全局，都是跨局污染的嫌疑源。
if (argv.includes("--globaldiff")) {
  console.log("=== 跑一局前后的全局变量对比（定位跨局污染源） ===");
  const SKIP = new Set([
    "global", "globalThis", "process", "console", "Buffer", "setTimeout", "clearTimeout",
    "setInterval", "clearInterval", "setImmediate", "clearImmediate", "queueMicrotask",
    "structuredClone", "atob", "btoa", "performance", "fetch", "crypto", "URL", "URLSearchParams",
  ]);
  function snapshotGlobals() {
    const out = {};
    for (const k of Object.getOwnPropertyNames(globalThis)) {
      if (SKIP.has(k)) continue;
      if (k.startsWith("__")) continue;
      let v;
      try {
        v = globalThis[k];
      } catch {
        continue;
      }
      const t = typeof v;
      if (t === "function" || t === "symbol") continue;
      try {
        out[k] = canon(v);
      } catch {
        out[k] = "[err]";
      }
    }
    return out;
  }
  const before = snapshotGlobals();
  const r1 = runOnce(null, null);
  const after = snapshotGlobals();
  const changed = [];
  for (const k of Object.keys(after)) {
    if (!(k in before)) {
      changed.push({ k, kind: "新增", before: "(不存在)", after: after[k] });
    } else if (before[k] !== after[k]) {
      changed.push({ k, kind: "变化", before: before[k], after: after[k] });
    }
  }
  for (const k of Object.keys(before)) {
    if (!(k in after)) changed.push({ k, kind: "消失", before: before[k], after: "(不存在)" });
  }
  console.log("跑一局后发生变化的全局变量数:", changed.length, "（第 1 局天数 " + r1.days + "）");
  changed.forEach((c) => {
    console.log("\n  [" + c.kind + "] " + c.k);
    console.log("     跑之前: " + String(c.before).slice(0, 150));
    console.log("     跑之后: " + String(c.after).slice(0, 150));
  });
  process.exit(0);
}

// ================= PRNG 抽取序列追踪模式 =================
// 包装 Random 的公开方法，记录每一次抽取。同进程跑两局，对比抽取序列，
// 找出**第一个不同的调用** —— 那就是分支分叉的精确位置。
if (argv.includes("--drawtrace")) {
  const R = globalThis.Random;
  if (!R) {
    console.error("找不到全局 Random");
    process.exit(1);
  }
  const METHODS = [
    "chance", "int", "float", "fromArray", "pickN", "shuffle",
    "weighted", "multichance", "gaussian", "d", "percent", "trials", "simulate",
  ];
  let trace = null;
  let curDay = 0;
  const originals = {};

  // 紧凑签名：对「参数被就地改写」敏感（对象额外多出 key 会被检出），但不会打印整棵数组
  function sig(v, depth) {
    depth = depth || 0;
    if (v === null) return "null";
    const t = typeof v;
    if (t === "number" || t === "boolean" || t === "undefined") return String(v);
    if (t === "string") return v.length > 40 ? "s:" + v.slice(0, 40) : "s:" + v;
    if (t === "function") return "fn";
    if (depth > 2) return "…";
    if (Array.isArray(v)) {
      const head = v.slice(0, 6).map((x) => sig(x, depth + 1)).join(",");
      return "arr(" + v.length + ")[" + head + (v.length > 6 ? ",…" : "") + "]";
    }
    // 对象：用 id + 自身 key 列表表示，多出 _xxx 簿记字段会被检出
    const ks = Object.keys(v).sort();
    const id = typeof v.id === "string" ? v.id : "";
    return "obj(" + id + "){" + ks.join(",") + "}";
  }

  for (const m of METHODS) {
    if (typeof R[m] !== "function") continue;
    originals[m] = R[m];
    R[m] = (function (name, fn) {
      return function () {
        const r = fn.apply(R, arguments);
        if (trace) {
          const args = Array.prototype.slice.call(arguments);
          const rsig = typeof r === "object" && r !== null ? (r.id || "[obj]") : String(r);
          trace.push(curDay + "|" + name + "|" + sig(args) + "=>" + rsig);
        }
        return r;
      };
    })(m, R[m]);
  }
  console.log("已包装 Random 方法:", Object.keys(originals).join(", "));

  // 两局之间清理共享新闻池（隔离已确证的成因，逼出剩余成因）
  const vm = require("vm");
  const CLEAN =
    "(function(){var n=0;for(var i=0;i<NEWS_L1_L4.length;i++){var x=NEWS_L1_L4[i];" +
    "if(x._appliedDay!==undefined){delete x._appliedDay;n++;}" +
    "if(x._conduitChecked!==undefined){delete x._conduitChecked;n++;}}return n;})()";
  function cleanPools() {
    try {
      return vm.runInThisContext(CLEAN);
    } catch {
      return 0;
    }
  }

  function capture() {
    cleanPools();
    const t = [];
    trace = t;
    curDay = 0;
    runOnce((d) => {
      curDay = d;
    });
    trace = null;
    return t;
  }

  const t1 = capture();
  const t2 = capture();
  console.log("第 1 局抽取次数:", t1.length, " 第 2 局抽取次数:", t2.length);
  const n = Math.min(t1.length, t2.length);
  let idx = -1;
  for (let i = 0; i < n; i++) {
    if (t1[i] !== t2[i]) {
      idx = i;
      break;
    }
  }
  if (idx < 0 && t1.length === t2.length) {
    console.log("✅ 两局抽取序列完全一致");
  } else if (idx < 0) {
    console.log("❌ 前 " + n + " 次抽取一致，之后第 1 局多了 " + (t1.length - n) + " 次、第 2 局多了 " + (t2.length - n) + " 次");
    console.log("   第 1 局第 " + (n + 1) + " 次: " + t1[n]);
    console.log("   第 2 局第 " + (n + 1) + " 次: " + t2[n]);
  } else {
    console.log("❌ 第 " + (idx + 1) + " 次抽取开始分叉（前 " + idx + " 次完全一致）");
    console.log("   第 1 局: " + t1[idx]);
    console.log("   第 2 局: " + t2[idx]);
    console.log("\n   —— 分叉点上下文（第 1 局）——");
    for (let i = Math.max(0, idx - 6); i <= Math.min(t1.length - 1, idx + 3); i++) {
      console.log("   " + (i === idx ? "★" : " ") + " #" + (i + 1) + " " + t1[i]);
    }
    console.log("\n   —— 分叉点上下文（第 2 局）——");
    for (let i = Math.max(0, idx - 6); i <= Math.min(t2.length - 1, idx + 3); i++) {
      console.log("   " + (i === idx ? "★" : " ") + " #" + (i + 1) + " " + t2[i]);
    }
  }
  process.exit(0);
}

// ================= 污染清除确证实验 =================
// 假设：共享新闻池 NEWS_L1_L4 的对象被写入 _appliedDay / _conduitChecked，
//       导致跨局污染（第 2 局跳过传导链 → 少消耗随机数 → PRNG 错位）。
// 验证：每局开始前把这些字段从共享池上抹掉，看同进程两局是否恢复一致。
//
// 注意：NEWS_L1_L4 是顶层 const，在 vm.runInThisContext 的上下文中
//       不挂到 globalThis，只能通过「同上下文再执行一段脚本」用裸标识符访问。
if (argv.includes("--unpollute")) {
  const vm = require("vm");
  const POLLUTED_COUNT =
    "(function(){var n=0;for(var i=0;i<NEWS_L1_L4.length;i++){var x=NEWS_L1_L4[i];" +
    "if(x._appliedDay!==undefined||x._conduitChecked!==undefined)n++;}return n;})()";
  const CLEAN =
    "(function(){var n=0;for(var i=0;i<NEWS_L1_L4.length;i++){var x=NEWS_L1_L4[i];" +
    "if(x._appliedDay!==undefined){delete x._appliedDay;n++;}" +
    "if(x._conduitChecked!==undefined){delete x._conduitChecked;n++;}}return n;})()";

  function polluteCount() {
    try {
      return vm.runInThisContext(POLLUTED_COUNT);
    } catch (e) {
      return "ERR:" + e.message;
    }
  }
  function clean() {
    try {
      return vm.runInThisContext(CLEAN);
    } catch (e) {
      return "ERR:" + e.message;
    }
  }

  console.log("=== 污染清除确证实验（共享新闻池 NEWS_L1_L4） ===");
  console.log("开局污染字段数:", polluteCount());

  const ha = [];
  const hb = [];
  runOnce((d, st) => ha.push(hashOf(st)));
  console.log("第 1 局跑完后，共享池污染字段数:", polluteCount());
  console.log("清理字段数:", clean());
  console.log("清理后污染字段数:", polluteCount());
  runOnce((d, st) => hb.push(hashOf(st)));

  console.log("第 1 局天数:", ha.length, " 第 2 局天数:", hb.length);
  const n = Math.min(ha.length, hb.length);
  let fd = -1;
  for (let i = 0; i < n; i++) {
    if (ha[i] !== hb[i]) {
      fd = i + 1;
      break;
    }
  }
  if (fd < 0 && ha.length === hb.length) {
    console.log("✅ 清理共享新闻池后同进程两局完全一致 → 根因确证：共享新闻对象被就地改写");
  } else {
    console.log("❌ 仍分叉于第 " + (fd < 0 ? "(天数不同)" : fd) + " 天 → 共享新闻池不是唯一成因");
    // 重跑到分叉日，dump 字段级差异
    if (fd > 0) {
      console.log("\n=== 在第 " + fd + " 天 dump 字段级差异 ===");
      let sa = null;
      let sb = null;
      clean();
      runOnce((d, st) => {
        if (d === fd) sa = flatten(st);
      }, fd);
      clean();
      runOnce((d, st) => {
        if (d === fd) sb = flatten(st);
      }, fd);
      if (sa && sb) {
        const keys = new Set([...Object.keys(sa), ...Object.keys(sb)]);
        const diffs = [];
        for (const k of keys) {
          if (VOLATILE.has(k.split(".").pop())) continue;
          if (String(sa[k]) !== String(sb[k])) diffs.push({ k, va: sa[k], vb: sb[k] });
        }
        console.log("差异字段数:", diffs.length, " / 总字段数:", keys.size);
        diffs.slice(0, 40).forEach((d) => {
          console.log("  · " + d.k + "\n      A = " + String(d.va).slice(0, 110) + "\n      B = " + String(d.vb).slice(0, 110));
        });
        if (diffs.length > 40) console.log("  …还有 " + (diffs.length - 40) + " 个");
      }
    }
  }
  process.exit(0);
}

// ================= 共享池污染扫描 =================
// 跑 N 天后，逐个候选共享池统计「被写入的簿记字段」。
// 用于发现除 NEWS_L1_L4 之外的其他跨局污染源。
if (argv.includes("--poolscan")) {
  const vm = require("vm");
  const POOLS = [
    "NEWS_L1_L4",
    "NEWS_EVENTS",
    "NEWS_FOLLOWUP",
    "NEWS_TRIGGERED_EVENTS",
    "NEWS_LONGTAIL_EFFECTS",
    "FATE_EVENTS",
    "ALL_STARTUP_EVENTS",
    "RANDOM_EVENTS",
    "STREET_JOBS",
    "LOCATIONS",
  ];
  // 疑似「运行时被写上去的簿记字段」
  const SUSPECT = [
    "_appliedDay",
    "_conduitChecked",
    "_effectiveWeight",
    "_dead",
    "_isChainEvent",
    "_lastTriggered",
    "_cooldown",
    "_seenCount",
    "_appliedCount",
  ];
  const probeExpr = (name, fields) => {
    const f = JSON.stringify(fields);
    return (
      "(function(){try{" +
      "var P=" + name + ";if(!P)return 'missing';" +
      "var arr=Array.isArray(P)?P:null;" +
      "if(!arr){arr=[];for(var k in P){if(Array.isArray(P[k]))arr=arr.concat(P[k]);}}" +
      "var out={total:arr.length,byField:{},sample:null};" +
      "var F=" + f + ";" +
      "for(var i=0;i<arr.length;i++){var o=arr[i];if(!o||typeof o!=='object')continue;" +
      "for(var j=0;j<F.length;j++){if(o[F[j]]!==undefined){out.byField[F[j]]=(out.byField[F[j]]||0)+1;" +
      "if(!out.sample)out.sample=JSON.stringify({id:o.id,field:F[j],val:o[F[j]]});}}}" +
      "return JSON.stringify(out);" +
      "}catch(e){return 'ERR:'+e.message;}})()"
    );
  };

  function scan(tag) {
    console.log("\n--- " + tag + " ---");
    for (const p of POOLS) {
      let raw;
      try {
        raw = vm.runInThisContext(probeExpr(p, SUSPECT));
      } catch (e) {
        raw = "ERR:" + e.message;
      }
      if (raw === "missing") continue;
      let r;
      try {
        r = JSON.parse(raw);
      } catch {
        console.log("  " + p + " → " + raw);
        continue;
      }
      const fields = Object.keys(r.byField);
      if (fields.length === 0) continue;
      console.log("  " + p + "（共 " + r.total + " 条）:");
      fields.forEach((f) => console.log("      " + f + " × " + r.byField[f]));
      if (r.sample) console.log("      样例: " + r.sample);
    }
  }

  console.log("=== 共享池污染扫描（跑 " + DAYS + " 天前后对比）===");
  scan("跑局之前");
  const r1 = runOnce(null, null);
  console.log("\n第 1 局天数:", r1.days);
  scan("跑完 1 局之后");
  process.exit(0);
}

// ================= 初始化对比模式 =================
// 直接回答：第 2 次 createState 给出的开局状态，和第 1 次是否完全一样？
// 若不一样 → 模块级全局状态在两次 createState 之间发生了残留（跨局污染）。
if (argv.includes("--initcmp")) {
  console.log("=== 连续两次 createState 的开局状态对比（跨局污染探针） ===");
  const s1 = runner.createState({ seed: SEED, scenario: "classic" });
  const f1 = flatten(s1);
  const s2 = runner.createState({ seed: SEED, scenario: "classic" });
  const f2 = flatten(s2);
  const keys = new Set([...Object.keys(f1), ...Object.keys(f2)]);
  const diffs = [];
  for (const k of keys) {
    if (VOLATILE.has(k.split(".").pop())) continue;
    if (String(f1[k]) !== String(f2[k])) diffs.push({ k, va: f1[k], vb: f2[k] });
  }
  console.log("开局状态差异字段数:", diffs.length, " / 总字段数:", keys.size);
  if (diffs.length === 0) {
    console.log("✅ 两次开局状态完全一致 → createState 无跨局污染");
  } else {
    console.log("❌ 第 2 次 createState 的开局状态已被第 1 次污染：");
    diffs.slice(0, 50).forEach((d) => {
      console.log("  · " + d.k + "\n      第1次 = " + String(d.va).slice(0, 110) + "\n      第2次 = " + String(d.vb).slice(0, 110));
    });
    if (diffs.length > 50) console.log("  …还有 " + (diffs.length - 50) + " 个");
  }
  // 再对比 PRNG 状态
  if (typeof Random !== "undefined") {
    console.log("\nPRNG 状态：_seed =", Random._seed, " _useSeed =", Random._useSeed, " _state =", Random._state);
  }
  process.exit(0);
}

// ================= 单跑模式 =================
if (argv.includes("--single")) {
  const hashes = [];
  let last = null;
  const r = runOnce((d, st) => {
    hashes.push(hashOf(st));
    last = st;
  });
  console.log("HASHES:" + hashes.join(","));
  console.log("DAYS:" + r.days);
  console.log("FINAL:" + JSON.stringify(flatten(last)));
  process.exit(0);
}

// ================= 同进程模式 =================
if (argv.includes("--inproc")) {
  console.log("=== 同进程连跑两次（暴露跨局污染） ===");
  const ha = [];
  const hb = [];
  const daysA = [];
  const daysB = [];
  runOnce((d, st) => {
    ha.push(hashOf(st));
    daysA.push(flatten(st));
  });
  runOnce((d, st) => {
    hb.push(hashOf(st));
    daysB.push(flatten(st));
  });
  console.log("第 1 局天数:", ha.length, " 第 2 局天数:", hb.length);
  const n = Math.min(ha.length, hb.length);
  let fd = -1;
  for (let i = 0; i < n; i++) {
    if (ha[i] !== hb[i]) {
      fd = i + 1;
      break;
    }
  }
  if (fd < 0 && ha.length === hb.length) {
    console.log("✅ 同进程两局完全一致");
  } else {
    console.log("❌ 同进程分叉日:", fd < 0 ? "(天数不同)" : "第 " + fd + " 天");
  }

  // 分叉前一天（干净）与分叉日（已分叉）各 diff 一次，用于对照
  function diffDay(label, idx) {
    const a = daysA[idx];
    const b = daysB[idx];
    if (!a || !b) return;
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const diffs = [];
    for (const k of keys) {
      if (VOLATILE.has(k.split(".").pop())) continue;
      if (String(a[k]) !== String(b[k])) diffs.push({ k, va: a[k], vb: b[k] });
    }
    console.log("\n=== " + label + "（第 " + (idx + 1) + " 天）逐字段 diff ===");
    console.log("差异字段数:", diffs.length, " / 总字段数:", keys.size);
    diffs.slice(0, 60).forEach((d) => {
      console.log("  · " + d.k + "\n      第1局 = " + String(d.va).slice(0, 110) + "\n      第2局 = " + String(d.vb).slice(0, 110));
    });
    if (diffs.length > 60) console.log("  …还有 " + (diffs.length - 60) + " 个");
  }
  if (fd > 1) diffDay("分叉前一天（应完全一致）", fd - 2);
  if (fd >= 1) diffDay("★ 分叉日", fd - 1);
  process.exit(0);
}

// ================= 驱动模式：spawn 两个独立进程 =================
function runInChild() {
  const r = spawnSync(
    process.execPath,
    [__filename, "--single", "--days", String(DAYS), "--seed", String(SEED), "--strategy", STRATEGY],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 900000 }
  );
  const txt = r.stdout || "";
  const mh = txt.match(/^HASHES:(.*)$/m);
  const md = txt.match(/^DAYS:(\d+)$/m);
  const mf = txt.match(/^FINAL:(.*)$/m);
  if (!mh) {
    console.error("子进程未产出哈希。stderr 尾部：\n" + (r.stderr || "").slice(-800));
    return null;
  }
  return {
    hashes: mh[1] ? mh[1].split(",") : [],
    days: md ? Number(md[1]) : 0,
    final: mf ? JSON.parse(mf[1]) : {},
  };
}

console.log("=== 跨进程对比 (seed=" + SEED + ", strategy=" + STRATEGY + ", days=" + DAYS + ") ===");
const A = runInChild();
const B = runInChild();
if (!A || !B) process.exit(1);

console.log("进程 A 天数:", A.days, " 进程 B 天数:", B.days);
const n = Math.min(A.hashes.length, B.hashes.length);
let firstDiv = -1;
for (let i = 0; i < n; i++) {
  if (A.hashes[i] !== B.hashes[i]) {
    firstDiv = i + 1;
    break;
  }
}

if (firstDiv < 0 && A.days === B.days) {
  console.log("✅ 两个独立进程全程哈希一致 —— 模拟可复现");
} else {
  if (firstDiv === 1) {
    console.log("❌ 第 1 天就分叉 → 非确定性发生在开局初始化 / 首日管线");
  } else if (firstDiv > 1) {
    console.log("❌ 第一个分叉日: 第 " + firstDiv + " 天（前 " + (firstDiv - 1) + " 天完全一致）");
    console.log("   → 非确定性发生在「第 " + firstDiv + " 天的推进过程」中，不是开局初始化");
  } else {
    console.log("❌ 天数不同（A=" + A.days + ", B=" + B.days + "），无共同前缀可对比");
  }
}

// —— 字段级差异 ——
console.log("\n=== 终局字段级差异 ===");
const keys = new Set([...Object.keys(A.final), ...Object.keys(B.final)]);
const diffs = [];
for (const k of keys) {
  if (String(A.final[k]) !== String(B.final[k])) diffs.push({ k, va: A.final[k], vb: B.final[k] });
}
console.log("差异字段数:", diffs.length, " / 总字段数:", keys.size);
diffs.slice(0, 40).forEach((d) => {
  console.log("  · " + d.k + "\n      A = " + String(d.va).slice(0, 110) + "\n      B = " + String(d.vb).slice(0, 110));
});
if (diffs.length > 40) console.log("  …还有 " + (diffs.length - 40) + " 个差异字段");
