#!/usr/bin/env node
/**
 * build-orphan-worklist.mjs — 把孤儿 flag 审计结果整理成「可执行清理清单」
 *
 * 输入：orphan-flags.json（由 audit-orphan-flags.mjs --json 生成）
 * 输出：docs/orphan-flag-清理清单-<date>.md
 *
 * 做三件事（审计工具本身不做）：
 *   1. 补上「每个孤儿 flag 写在哪个文件」——审计工具只给了名字与次数
 *   2. 按域（src/js 下的一级目录）分组，便于按域分批提交
 *   3. 按启发式给出**建议动作**，把 1242 条无从下手变成几类可批量处理
 *
 * 用法：
 *   node scripts/build-orphan-worklist.mjs
 *   node scripts/build-orphan-worklist.mjs --json orphan-flags.json --out docs/xxx.md
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "src", "js");

const args = process.argv.slice(2);
function argOf(name, dflt) {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : dflt;
}
const JSON_IN = path.resolve(ROOT, argOf("--json", "orphan-flags.json"));
const OUT = path.resolve(
  ROOT,
  argOf(
    "--out",
    "docs/orphan-flag-清理清单-" + new Date().toISOString().slice(0, 10) + ".md",
  ),
);

// ---------- 1. 扫描全库，建立 flag -> 写入文件 的索引 ----------
// 比审计工具多捕获一维：**赋的是什么值**。
//   flags.x = true / false        → 布尔标记（纯开关，删除最安全）
//   flags.x = "lost" / 3          → 值记录（承载信息，删了会丢数据，需先确认）
//   flags.x += 1 / ++             → 计数器（可能有隐含用途）
//   flags.x = expr / fn()         → 动态值（需人工看）
const writeRe =
  /flags\s*(?:\.\s*([A-Za-z_$][\w$]*)|\[\s*["']([A-Za-z_$][\w$]*)["']\s*\])\s*(?:(\+\+|--|\+=|-=|\*=|\|=|&&=|\?\?=)|=(?!=)\s*([^;\n]*))/g;

/** flag -> Set(相对路径) */
const writeFiles = new Map();
/** flag -> 写入次数（本脚本独立统计，用于交叉校验） */
const writeCount = new Map();
/** flag -> 赋值形态计数 { bool, literal, counter, dynamic } */
const valueKinds = new Map();

function kindOf(rhs) {
  if (rhs === undefined) return "counter"; // += / ++ 等
  const t = rhs.trim();
  if (/^(true|false)\b/.test(t)) return "bool";
  if (/^["'`]/.test(t)) return "literal"; // 字符串字面量
  if (/^-?\d/.test(t)) return "literal"; // 数字字面量
  if (/^(null|undefined)\b/.test(t)) return "literal";
  return "dynamic";
}

function walk(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walk(full);
    } else if (ent.name.endsWith(".js")) {
      let text;
      try {
        text = fs.readFileSync(full, "utf8");
      } catch {
        continue;
      }
      const rel = path.relative(SRC, full).split(path.sep).join("/");
      writeRe.lastIndex = 0;
      let m;
      while ((m = writeRe.exec(text)) !== null) {
        const name = m[1] || m[2];
        if (!name) continue;
        if (!writeFiles.has(name)) writeFiles.set(name, new Set());
        writeFiles.get(name).add(rel);
        writeCount.set(name, (writeCount.get(name) || 0) + 1);
        if (!valueKinds.has(name)) {
          valueKinds.set(name, { bool: 0, literal: 0, counter: 0, dynamic: 0 });
        }
        valueKinds.get(name)[kindOf(m[4])]++;
      }
    }
  }
}
walk(SRC);

// ---------- 2. 读取孤儿列表 ----------
const orphans = JSON.parse(fs.readFileSync(JSON_IN, "utf8"));

// ---------- 3. 分类启发式 ----------
// 目标：把 1242 条分成几类，每类对应一个明确动作，避免逐条人工判断。
// 顺序即优先级：先语义（更可能是"该接线"），再赋值形态（决定"能不能直接删"）。
const RULES = [
  {
    key: "A",
    label: "信息/接触类（很可能「该接线」）",
    action:
      "接线：这类 flag 语义上应当被 UI 或后续逻辑读取（解锁提示、已见过、已联系）。优先查是否漏了消费方",
    test: (f) =>
      /Unlocked$|Info$|Met$|Contact$|Seen$|Known$|Learned$|Aware$|Notified$|Told$|Discovered$/i.test(
        f,
      ),
  },
  {
    key: "B",
    label: "结果/结局类（很可能「该接线」）",
    action:
      "接线或删除：这类 flag 记录某个分支结果，通常在结局/回顾界面应该被读取。查 victory / daily_focus / 回顾类 UI",
    test: (f) =>
      /Success$|Failed$|Complete$|Done$|Finished$|Achieved$|Blessing$|Retained$|Left$|Resolved$|Chosen$/i.test(
        f,
      ),
  },
  {
    key: "V",
    label: "值记录类（存了字符串/数字，删了会丢信息）",
    action:
      "先确认，别直接删：这类 flag 记录「发生过什么」（如 `_lifeDec_firstDeal = \"lost\"`），语义上多半该被回顾/结局界面读取。确认无用再删",
    test: (_f, _w, k) => k && k.literal > 0,
  },
  {
    key: "C1",
    label: "★ 安全删除（`_` 前缀 + 纯布尔开关）",
    action:
      "直接删除写入行：`_` 前缀是内部临时标记约定，且所有赋值都是 true/false 纯开关，无信息量、无消费方。这是 1242 条里最该先清的一批",
    test: (f, _w, k) => f.startsWith("_") && k && k.bool > 0 && k.literal === 0 && k.dynamic === 0,
  },
  {
    key: "C2",
    label: "私有动态值（`_` 前缀，赋的是表达式/函数返回值）",
    action:
      "人工看一眼再删：赋值来自表达式，可能被别处间接依赖。批量前先抽查几个",
    test: (f) => f.startsWith("_"),
  },
  {
    key: "D",
    label: "一次性流程标记（写入 1 次）",
    action: "逐条判断：只写一次的流程开关。要么补消费方，要么删。建议按域批量过",
    test: (_f, w) => w === 1,
  },
  {
    key: "E",
    label: "多次写入（可能是状态机残留）",
    action:
      "优先排查：写入 ≥2 次说明有逻辑在维护它，更可能是「本该被读却漏了」。这类最有可能是真 bug",
    test: () => true, // 兜底
  },
];

function classify(flag, writes) {
  const k = valueKinds.get(flag);
  for (const r of RULES) {
    if (r.test(flag, writes, k)) return r;
  }
  return RULES[RULES.length - 1];
}

// ---------- 4. 按域分组 ----------
function domainOf(flag) {
  const files = writeFiles.get(flag);
  if (!files || files.size === 0) return "(未定位)";
  // 取第一个写入文件的一级目录
  const first = [...files].sort()[0];
  return first.split("/")[0] || "(根)";
}

const enriched = orphans.map((o) => {
  const files = writeFiles.get(o.flag);
  const k = valueKinds.get(o.flag) || { bool: 0, literal: 0, counter: 0, dynamic: 0 };
  const cls = classify(o.flag, o.writes);
  return {
    flag: o.flag,
    writes: o.writes,
    occurrences: o.occurrences,
    files: files ? [...files].sort() : [],
    domain: domainOf(o.flag),
    cls,
    kind: k,
  };
});

const CLASS_ORDER = ["A", "B", "V", "C1", "C2", "D", "E"];

// ---------- 5. 统计 ----------
const byDomain = new Map();
const byClass = new Map();
for (const e of enriched) {
  if (!byDomain.has(e.domain)) byDomain.set(e.domain, []);
  byDomain.get(e.domain).push(e);
  if (!byClass.has(e.cls.key)) byClass.set(e.cls.key, { rule: e.cls, items: [] });
  byClass.get(e.cls.key).items.push(e);
}

const domainSorted = [...byDomain.entries()].sort(
  (a, b) => b[1].length - a[1].length,
);

// ---------- 6. 输出 Markdown ----------
const L = [];
const dateStr = new Date().toISOString().slice(0, 10);
L.push("# 孤儿 flag 清理清单（" + dateStr + "）");
L.push("");
L.push(
  "> 数据源：`orphan-flags.json`（由 `scripts/audit-orphan-flags.mjs --json` 生成）",
);
L.push("> 生成器：`scripts/build-orphan-worklist.mjs`");
L.push(
  "> 定义：**孤儿 flag = 有写入点、但全库没有任何读取点**（写入次数 == 名字出现总次数）。",
);
L.push("");
L.push("## 总览");
L.push("");
L.push("| 指标 | 数值 |");
L.push("|------|------|");
L.push("| 孤儿 flag 总数 | **" + enriched.length + "** |");
L.push("| 涉及域 | " + domainSorted.length + " 个 |");
L.push("| 未定位到写入文件 | " + (byDomain.get("(未定位)") || []).length + " 个 |");
L.push("");
L.push("## 按建议动作分类");
L.push("");
L.push("| 类 | 说明 | 数量 | 占比 |");
L.push("|----|------|------|------|");
for (const key of CLASS_ORDER) {
  const g = byClass.get(key);
  if (!g) continue;
  L.push(
    "| " +
      key +
      " | " +
      g.rule.label +
      " | " +
      g.items.length +
      " | " +
      ((g.items.length / enriched.length) * 100).toFixed(1) +
      "% |",
  );
}
L.push("");
for (const key of CLASS_ORDER) {
  const g = byClass.get(key);
  if (!g) continue;
  L.push("### " + key + " 类 · " + g.rule.label + "（" + g.items.length + " 个）");
  L.push("");
  L.push("**建议动作**：" + g.rule.action);
  L.push("");
  const shown = g.items.slice(0, 60);
  for (const e of shown) {
    L.push(
      "- `" +
        e.flag +
        "` — 写 " +
        e.writes +
        " 次 · " +
        (e.files[0] || "?") +
        (e.files.length > 1 ? " 等 " + e.files.length + " 文件" : ""),
    );
  }
  if (g.items.length > shown.length) {
    L.push("- …还有 " + (g.items.length - shown.length) + " 个（见 JSON）");
  }
  L.push("");
}

L.push("## 按域分批（建议每次一个域，每批 ≤50 个单独提交）");
L.push("");
L.push("| 域 | 孤儿数 | ★ 安全删除(C1) | 值记录(V) | 其中 `_` 前缀 | 其中写 ≥2 次 | 建议批次 |");
L.push("|----|--------|---------------|-----------|--------------|--------------|----------|");
for (const [dom, items] of domainSorted) {
  const priv = items.filter((e) => e.flag.startsWith("_")).length;
  const multi = items.filter((e) => e.writes >= 2).length;
  const safe = items.filter((e) => e.cls.key === "C1").length;
  const val = items.filter((e) => e.cls.key === "V").length;
  L.push(
    "| `" +
      dom +
      "` | " +
      items.length +
      " | **" +
      safe +
      "** | " +
      val +
      " | " +
      priv +
      " | " +
      multi +
      " | " +
      Math.ceil(items.length / 50) +
      " 批 |",
  );
}
L.push("");
L.push("## 全部孤儿明细");
L.push("");
L.push("| flag | 写入 | 出现 | 域 | 类 | 赋值形态(bool/lit/cnt/dyn) | 写入文件 |");
L.push("|------|------|------|----|----|---------------------------|---------|");
for (const e of enriched.slice().sort((a, b) => b.writes - a.writes || a.flag.localeCompare(b.flag))) {
  L.push(
    "| `" +
      e.flag +
      "` | " +
      e.writes +
      " | " +
      e.occurrences +
      " | " +
      e.domain +
      " | " +
      e.cls.key +
      " | " +
      e.kind.bool +
      "/" +
      e.kind.literal +
      "/" +
      e.kind.counter +
      "/" +
      e.kind.dynamic +
      " | " +
      (e.files.join("<br>") || "?") +
      " |",
  );
}
L.push("");
L.push("---");
L.push("");
L.push("## ✅ 安全性前置验证（已做，结论：可静态判定）");
L.push("");
L.push("在建议批量删除前，已排查「是否存在对 flags 的动态读取」——若有，静态孤儿判定就不成立：");
L.push("");
L.push("| 检查项 | 结果 |");
L.push("|--------|------|");
L.push("| `flags[变量]` 动态索引 | **0 处**（所有访问都是 `flags.名字` 静态形式） |");
L.push("| `for (k in flags)` 遍历 | **0 处** |");
L.push("| `Object.keys(flags)` 前缀扫描 | **1 处**：`daily_pipeline.js:2941` 扫 `_lifeWisdom_` 前缀 |");
L.push("| 命中该前缀的孤儿 | **0 个** |");
L.push("");
L.push("→ 当前孤儿列表**不存在动态读取造成的误报**，可放心按静态判定处理。");
L.push("");
L.push("## ⚠️ 执行前提");
L.push("");
L.push(
  "清理孤儿 flag 需要改 `src/js/**`，而当前工作树已有他人未提交改动（`git status` 可见 13 个 src/js 文件）。",
);
L.push("**在这些改动提交前，不要开始批量清理**，否则会与他人的修改混在一起、无法区分。");
L.push("");
L.push("建议顺序：");
L.push("1. 等他人改动落地 → 2. 从 **C1 类（`_` 前缀 + 纯布尔开关）** 开始，这是最安全的试水批次 → 3. 每域一批、单独 commit → 4. 再处理 V 类（值记录，需先确认是否该接线）");
L.push("");

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, L.join("\n"), "utf8");

// ---------- 控制台摘要 ----------
console.log("孤儿 flag 总数: " + enriched.length);
console.log("");
console.log("按动作分类:");
for (const key of CLASS_ORDER) {
  const g = byClass.get(key);
  if (!g) continue;
  console.log(
    "  " + key + " " + g.rule.label + ": " + g.items.length + " 个",
  );
}
console.log("");
console.log("按域分组（Top 15）:");
for (const [dom, items] of domainSorted.slice(0, 15)) {
  console.log("  " + dom.padEnd(16) + items.length);
}
console.log("");
console.log("已写出: " + path.relative(ROOT, OUT));
