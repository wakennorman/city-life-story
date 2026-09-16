#!/usr/bin/env node
/**
 * audit-event-reachability.cjs — 「为什么这些事件从未触发」审计
 *
 * 背景：audit-event-coverage.cjs 测出 574/4276 = 13.4% 覆盖，3702 个事件从未触发。
 * 但它只回答了「有多少」，没回答「为什么」。本脚本补上后者，把 3702 个拆成：
 *
 *   DEAD_FLAG  —— conditions 引用了「全库从未写入」的 flag → 结构性不可达，确定是缺陷
 *   NEVER_TRUE —— conditions 在 720 个真实状态快照里从未为 true → 门槛（数值/关系/阶段）从未达成
 *   RARE       —— conditions 曾为 true 却没被抽中 → 只是概率/竞争问题，不是缺陷
 *   FIRED      —— 本次跑到了
 *
 * 用法：
 *   node scripts/audit-event-reachability.cjs
 *   node scripts/audit-event-reachability.cjs --trials 6 --days 400 --strategy all
 *   node scripts/audit-event-reachability.cjs --json reachability-report.json
 *
 * 实现要点：
 *   1. 事件用 `conditions: function(st)` 定义，静态分析有限 → 必须动态求值。
 *   2. 求值必须在**深拷贝**上做：conditions 绝大多数是纯谓词，但万一有副作用会污染
 *      模拟轨迹，让"没触发"的结论自我实现。拷贝只在检查点做，用完即弃。
 *   3. 早停：某事件一旦被判为 true，后续检查点不再求值。3702 → 迅速收敛。
 *   4. flag 引用从 `conditions.toString()` 正则提取，与「全库写入的 flag 集合」对账。
 */
"use strict";

const path = require("path");
const fs = require("fs");
const runner = require(path.join(__dirname, "..", "tests", "headless_runner.cjs"));

const argv = process.argv.slice(2);
function argNum(name, def) {
  const i = argv.indexOf("--" + name);
  if (i < 0) return def;
  const v = Number(argv[i + 1]);
  return Number.isFinite(v) ? v : def;
}
function argStr(name, def) {
  const i = argv.indexOf("--" + name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
}

const TRIALS = argNum("trials", 6);
const DAYS = argNum("days", 400);
const STRATEGY = argStr("strategy", "all");
const CHECKPOINT = argNum("checkpoint", 20); // 每 N 天取一次快照
const JSON_OUT = argStr("json", "");
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src", "js");

// ── 加载引擎 ──────────────────────────────────────────────────
const ok = runner.init({ strict: false });
if (!ok) {
  console.error("引擎加载失败");
  process.exit(0);
}
const ALL_EVENTS = typeof RANDOM_EVENTS !== "undefined" ? RANDOM_EVENTS : [];
if (!Array.isArray(ALL_EVENTS) || ALL_EVENTS.length === 0) {
  console.error("RANDOM_EVENTS 不可用");
  process.exit(0);
}

// ── 1. 扫描全库，收集「被写入过的 flag」集合 ──────────────────
const WRITE_RE =
  /flags\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*["']([A-Za-z_$][\w$]*)["']\s*\])\s*(?:(\+\+|--|\+=|-=|\*=|\|=|&&=|\?\?=)|=(?!=))/g;
const writtenFlags = new Set();
function scanWrites(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      scanWrites(full);
    } else if (ent.name.endsWith(".js")) {
      let text;
      try {
        text = fs.readFileSync(full, "utf8");
      } catch {
        continue;
      }
      WRITE_RE.lastIndex = 0;
      let m;
      while ((m = WRITE_RE.exec(text)) !== null) {
        const name = m[1] || m[2];
        if (name) writtenFlags.add(name);
      }
    }
  }
}
scanWrites(SRC);

// ── 2. 建 id 索引 + 提取每个事件引用的 flag ───────────────────
const byId = new Map();
for (const e of ALL_EVENTS) {
  if (e && e.id && !byId.has(e.id)) byId.set(e.id, e);
}

/** 从函数/对象源码里提取 `flags.名字` 与 `flags["名字"]` 形式的引用 */
const FLAG_REF_RE = /flags\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*["']([A-Za-z_$][\w$]*)["']\s*\])/g;
function extractFlagRefs(fn) {
  if (typeof fn !== "function") return [];
  let src;
  try {
    src = fn.toString();
  } catch {
    return [];
  }
  const out = new Set();
  FLAG_REF_RE.lastIndex = 0;
  let m;
  while ((m = FLAG_REF_RE.exec(src)) !== null) {
    const name = m[1] || m[2];
    if (name) out.add(name);
  }
  return [...out];
}

const meta = new Map(); // id -> { condRefs, missingFlags, phase, probability, minDay, ... }
for (const [id, e] of byId) {
  const flagRefs = [
    ...new Set([
      ...extractFlagRefs(e.conditions),
      ...extractFlagRefs(e.apply),
      ...(Array.isArray(e.choices)
        ? e.choices.flatMap((c) => [
            ...extractFlagRefs(c && c.apply),
            ...extractFlagRefs(c && c.effect),
          ])
        : []),
    ]),
  ];
  // 只看 conditions 里引用的 flag —— 那才是"门槛"；apply/choices 里的 flag 是"产出"，
  // 产出 flag 没被写过是正常的（本次跑没走到），不能据此判死。
  const condRefs = extractFlagRefs(e.conditions);
  meta.set(id, {
    flagRefs,
    condRefs,
    missingFlags: condRefs.filter((f) => !writtenFlags.has(f)),
    phase: e.phase || null,
    probability: typeof e.probability === "number" ? e.probability : null,
    minDay: e.triggers && typeof e.triggers.minDay === "number" ? e.triggers.minDay : null,
    maxDay: e.triggers && typeof e.triggers.maxDay === "number" ? e.triggers.maxDay : null,
    hasCond: typeof e.conditions === "function",
    hasChoices: Array.isArray(e.choices) && e.choices.length > 0,
    hasTriggers: !!e.triggers && typeof e.triggers === "object",
    isChain: e._isChainEvent === true,
    isDead: e._dead === true,
    maxCash: typeof e.maxCash === "number" ? e.maxCash : null,
    minCash: typeof e.minCash === "number" ? e.minCash : null,
  });
}

// ── 2b. 复刻 queueRandomEvent 的筛选谓词 ──────────────────────
// 原函数（events_core.js:475+）按以下顺序筛：phase → _dead → _isChainEvent →
// evaluateTriggers → conditions → trigger(fn) → maxCash → minCash。
// 这里逐条复刻，任何一条不过就记下原因，便于定位"卡在哪一关"。
function evalEligibility(e, snap) {
  if (!e.phase) return "no_phase";
  if (e._dead) return "_dead";
  if (e._isChainEvent) return "_isChainEvent";
  if (e.triggers && typeof e.triggers === "object") {
    if (typeof evaluateTriggers === "function" && !evaluateTriggers(e.triggers, snap))
      return "triggers";
  }
  if (typeof e.conditions === "function") {
    if (!e.conditions(snap)) return "conditions";
  }
  if (typeof e.trigger === "function" && !e.trigger(snap)) return "trigger_fn";
  const cash =
    ((snap.resources && snap.resources.cash) || 0) +
    ((snap.resources && snap.resources.bankBalance) || 0);
  if (typeof e.maxCash === "number" && cash > e.maxCash) return "maxCash";
  if (typeof e.minCash === "number" && cash < e.minCash) return "minCash";
  return null; // 通过
}

// ── 3. 跑模拟：记录触发 + 在检查点求值 conditions ─────────────
const fired = new Set();
const firedCount = new Map();
const condTrue = new Set(); // 曾在某个快照上通过全部闸门
const condThrew = new Set(); // 求值抛异常
const evalCount = new Map();
const blockReason = new Map(); // id -> 最后一次卡住的闸门名

// 拦截所有入队通道
function attachPendingCounter(state) {
  let pe = null;
  try {
    Object.defineProperty(state, "_pendingEvent", {
      configurable: true,
      get() {
        return pe;
      },
      set(v) {
        pe = v;
        if (v && v.id) {
          fired.add(v.id);
          firedCount.set(v.id, (firedCount.get(v.id) || 0) + 1);
        }
      },
    });
  } catch {
    /* ignore */
  }
}

function answerEvent(state, evt) {
  if (!evt) return;
  const choices = evt.choices;
  if (!Array.isArray(choices) || choices.length === 0) {
    if (typeof evt.apply === "function") {
      try {
        evt.apply(state);
      } catch {
        /* ignore */
      }
    }
    return;
  }
  const c = choices[0];
  try {
    if (c && typeof c.apply === "function") c.apply(state);
    else if (c && typeof c.effect === "function") c.effect(state);
  } catch {
    /* ignore */
  }
}

const strategies =
  STRATEGY === "all"
    ? ["balanced", "grinder", "skiller", "trader", "social", "corporate"]
    : [STRATEGY];

console.log("事件可达性审计");
console.log(
  "  种子数: " + TRIALS + "  每次天数: " + DAYS + "  策略: " + strategies.join(","),
);
console.log("  检查点间隔: " + CHECKPOINT + " 天");
console.log("  全库写入过的 flag: " + writtenFlags.size);
console.log("  事件池唯一 id: " + byId.size);
console.log("");

let snapshots = 0;
let daysSimulated = 0;
let totalEvals = 0;

/** 待判定的候选：只关心"本次没触发"的，触发过的没必要求值 */
const pending = new Set();
for (const id of byId.keys()) pending.add(id);

const t0 = Date.now();
for (const st of strategies) {
  for (let t = 0; t < TRIALS; t++) {
    const seed = 1000 + t * 7919;
    let state;
    try {
      state = runner.createState({ seed, scenario: "classic" });
    } catch {
      continue;
    }
    if (!state) continue;
    attachPendingCounter(state);
    const policy = runner.getStrategy(st);

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
      daysSimulated++;

      if (state._pendingEvent) answerEvent(state, state._pendingEvent);
      state._pendingEvent = null;
      state._pendingEventId = null;
      if (state.flags && Array.isArray(state.flags._dailyTransactions)) {
        state.flags._dailyTransactions = [];
      }

      // ── 检查点：在深拷贝上求值，避免污染模拟轨迹 ──
      if (d % CHECKPOINT === 0 && pending.size > 0) {
        let snap = null;
        try {
          snap = JSON.parse(JSON.stringify(state));
        } catch {
          snap = null;
        }
        if (snap) {
          snapshots++;
          for (const id of [...pending]) {
            const e = byId.get(id);
            if (!e) {
              pending.delete(id);
              continue;
            }
            totalEvals++;
            evalCount.set(id, (evalCount.get(id) || 0) + 1);
            let reason;
            try {
              reason = evalEligibility(e, snap);
            } catch (err) {
              condThrew.add(id);
              pending.delete(id);
              continue;
            }
            if (reason === null) {
              // 通过全部闸门 → 事件是"可被抽中"的
              condTrue.add(id);
              pending.delete(id); // 早停
            } else {
              // 记录卡住的原因（后面的检查点若通过会被覆盖）
              blockReason.set(id, reason);
            }
          }
        }
      }

      if (state.flags && state.flags.gameOver) break;
      if (state.status && state.status.health <= 0) break;
    }
  }
}
const elapsed = ((Date.now() - t0) / 1000).toFixed(1);

// ── 4. 分类 ───────────────────────────────────────────────────
const results = [];
for (const [id, e] of byId) {
  const m = meta.get(id);
  const br = blockReason.get(id) || null;
  let verdict;
  if (fired.has(id)) {
    verdict = "FIRED";
  } else if (m.isChain) {
    // 链式事件本就不走随机池，由 scheduleChainEvent 触发，不在本次口径内
    verdict = "CHAIN_ONLY";
  } else if (m.isDead) {
    verdict = "DEAD_MARKED";
  } else if (!m.phase) {
    verdict = "NO_PHASE"; // queueRandomEvent 会直接跳过
  } else if (condTrue.has(id)) {
    verdict = "RARE"; // 通过过全部闸门，只是没被抽中
  } else if (condThrew.has(id)) {
    verdict = "COND_ERROR";
  } else if (br === "conditions" && m.missingFlags.length > 0) {
    verdict = "DEAD_FLAG"; // 条件要求一个全库从未写入的 flag
  } else if (br === "triggers") {
    verdict = "BLOCK_TRIGGERS";
  } else if (br === "conditions") {
    verdict = "BLOCK_CONDITIONS";
  } else if (br === "maxCash" || br === "minCash") {
    verdict = "BLOCK_CASH";
  } else if (br === "trigger_fn") {
    verdict = "BLOCK_TRIGGER_FN";
  } else {
    verdict = "NEVER_EVALUATED"; // 检查点太少，一次都没轮到
  }
  results.push({ id, verdict, blockReason: br, ...m });
}

const byVerdict = new Map();
for (const r of results) {
  if (!byVerdict.has(r.verdict)) byVerdict.set(r.verdict, []);
  byVerdict.get(r.verdict).push(r);
}

const ORDER = [
  "FIRED",
  "RARE",
  "CHAIN_ONLY",
  "DEAD_FLAG",
  "BLOCK_CONDITIONS",
  "BLOCK_TRIGGERS",
  "BLOCK_CASH",
  "BLOCK_TRIGGER_FN",
  "NO_PHASE",
  "DEAD_MARKED",
  "COND_ERROR",
  "NEVER_EVALUATED",
];
const LABEL = {
  FIRED: "本次触发过",
  RARE: "通过全部闸门但没抽中（概率问题，非缺陷）",
  CHAIN_ONLY: "链式事件（本就不走随机池）",
  DEAD_FLAG: "★★ conditions 引用从未写入的 flag（结构性不可达）",
  BLOCK_CONDITIONS: "★ conditions 从未成立（门槛未达）",
  BLOCK_TRIGGERS: "★ triggers 门槛从未达成（天数/现金/属性/技能）",
  BLOCK_CASH: "被 maxCash/minCash 挡住",
  BLOCK_TRIGGER_FN: "被 trigger() 函数挡住",
  NO_PHASE: "无 phase（queueRandomEvent 直接跳过）",
  DEAD_MARKED: "标记为 _dead",
  COND_ERROR: "求值抛异常",
  NEVER_EVALUATED: "检查点未覆盖（提高 --trials/--days 再测）",
};

console.log("");
console.log("=".repeat(72));
console.log("  耗时 " + elapsed + " 秒 · 模拟 " + daysSimulated + " 天 · 快照 " + snapshots + " 个 · 求值 " + totalEvals + " 次");
console.log("=".repeat(72));
console.log("");
console.log("| 判定 | 含义 | 数量 | 占池比 |");
console.log("|------|------|------|--------|");
for (const v of ORDER) {
  const g = byVerdict.get(v) || [];
  console.log(
    "| " + v + " | " + LABEL[v] + " | " + g.length + " | " + ((g.length / byId.size) * 100).toFixed(1) + "% |",
  );
}

// ── 5. DEAD_FLAG 明细（最硬的一类） ───────────────────────────
const deadFlag = byVerdict.get("DEAD_FLAG") || [];
console.log("");
console.log("─".repeat(72));
console.log("★★ DEAD_FLAG 明细（conditions 要求一个全库从未写入的 flag）");
console.log("─".repeat(72));
const byMissing = new Map();
for (const r of deadFlag) {
  for (const f of r.missingFlags) {
    if (!byMissing.has(f)) byMissing.set(f, []);
    byMissing.get(f).push(r.id);
  }
}
const missingSorted = [...byMissing.entries()].sort((a, b) => b[1].length - a[1].length);
console.log("涉及 " + deadFlag.length + " 个事件 / " + missingSorted.length + " 个从未写入的 flag");
console.log("");
console.log("Top 25 缺失 flag（被多少个事件依赖）:");
for (const [f, ids] of missingSorted.slice(0, 25)) {
  console.log("  " + String(ids.length).padStart(4) + " 个事件依赖 flags." + f);
}

// ── 6. 被闸门挡住的明细 ───────────────────────────────────────
const blocked = ["BLOCK_CONDITIONS", "BLOCK_TRIGGERS", "BLOCK_TRIGGER_FN", "BLOCK_CASH"]
  .flatMap((v) => byVerdict.get(v) || []);
console.log("");
console.log("─".repeat(72));
console.log("★ 被闸门挡住、从未通过（共 " + blocked.length + " 个）");
console.log("─".repeat(72));
const byPhase = new Map();
for (const r of blocked) {
  const p = r.phase || "(无 phase)";
  byPhase.set(p, (byPhase.get(p) || 0) + 1);
}
console.log("按 phase 分布:");
for (const [p, n] of [...byPhase.entries()].sort((a, b) => b[1] - a[1])) {
  console.log("  " + p.padEnd(14) + n);
}
const minDays = new Map();
for (const r of blocked) {
  const k = r.minDay === null ? "(无 minDay)" : "minDay=" + r.minDay;
  minDays.set(k, (minDays.get(k) || 0) + 1);
}
console.log("");
console.log("按 minDay 分布（Top 10）:");
for (const [k, n] of [...minDays.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10)) {
  console.log("  " + k.padEnd(18) + n);
}
console.log("");
console.log("示例（前 25 个）:");
for (const r of blocked.slice(0, 25)) {
  const e = byId.get(r.id);
  console.log(
    "  " + r.id.padEnd(40) +
      " " + r.verdict.replace("BLOCK_", "").padEnd(11) +
      " phase=" + String(r.phase).padEnd(10) +
      " p=" + (r.probability === null ? "-" : r.probability) +
      " minDay=" + (r.minDay === null ? "-" : r.minDay) +
      "  " + String((e && e.title) || "").slice(0, 16),
  );
}

// ── 7. RARE 明细（说明不是缺陷） ──────────────────────────────
const rare = byVerdict.get("RARE") || [];
console.log("");
console.log("─".repeat(72));
console.log("RARE（通过闸门、只是没抽中）: " + rare.length + " 个 —— 这类不算缺陷");
console.log("─".repeat(72));
const rareLowProb = rare.filter((r) => r.probability !== null && r.probability <= 0.02);
console.log("  其中 probability ≤ 0.02 的: " + rareLowProb.length + " 个（概率过低，建议提概率而非改条件）");

// ── 8. 输出 JSON ──────────────────────────────────────────────
if (JSON_OUT) {
  const out = {
    params: { trials: TRIALS, days: DAYS, strategies, checkpoint: CHECKPOINT },
    daysSimulated,
    snapshots,
    totalEvals,
    elapsedSec: Number(elapsed),
    poolSize: byId.size,
    writtenFlagsCount: writtenFlags.size,
    verdictCounts: Object.fromEntries(ORDER.map((v) => [v, (byVerdict.get(v) || []).length])),
    missingFlags: Object.fromEntries(missingSorted.map(([f, ids]) => [f, ids])),
    byVerdict: Object.fromEntries(
      ORDER.map((v) => [v, (byVerdict.get(v) || []).map((r) => r.id)]),
    ),
    details: results.map((r) => ({
      id: r.id,
      verdict: r.verdict,
      blockReason: r.blockReason,
      phase: r.phase,
      probability: r.probability,
      minDay: r.minDay,
      maxDay: r.maxDay,
      minCash: r.minCash,
      maxCash: r.maxCash,
      isChain: r.isChain,
      hasCond: r.hasCond,
      hasTriggers: r.hasTriggers,
      missingFlags: r.missingFlags,
    })),
  };
  fs.writeFileSync(path.join(ROOT, JSON_OUT), JSON.stringify(out, null, 2), "utf8");
  console.log("");
  console.log("已写出 JSON: " + JSON_OUT);
}
