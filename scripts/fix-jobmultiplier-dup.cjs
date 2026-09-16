#!/usr/bin/env node
/**
 * 修复 news_system.js 中 jobMultiplier 重复键问题
 *
 * 背景：
 *   NEWS_L1_L4 里 67 个事件对象同时写了两个 `jobMultiplier` 键：
 *       jobPenalty: [...],
 *       jobMultiplier: 0.X,   // 意图：惩罚组系数
 *       jobBonus: [...],
 *       jobMultiplier: 1.Y,   // 意图：奖励组系数  ← 覆盖了上面
 *
 *   JS 语义下后者覆盖前者，导致：
 *     · 惩罚组的 0.X 被丢弃 → 本该受损的工作收入里在涨
 *     · 唯一生效的 1.Y 同时作用于两组 → 叙事反转
 *
 * 修复：
 *   把「同一对象内的第二个及之后的 jobMultiplier」改名为 jobBonusMultiplier。
 *   消费方 src/js/data/news.js:2241 已经支持该字段：
 *       if (eff.jobBonus && (eff.jobMultiplier || eff.jobBonusMultiplier)) {
 *         var bonusMul = 1 + ((eff.jobBonusMultiplier || eff.jobMultiplier) - 1) * decay;
 *   因此无需改动任何逻辑代码。
 *
 * 安全性：
 *   只改「effects 对象内重复出现的 jobMultiplier」，不动唯一出现的那些。
 *   通过「同一对象内计数，第 2 次及以后出现才改名」实现。
 */

const fs = require("fs");
const path = require("path");

const FILE = path.resolve(__dirname, "..", "src", "js", "core", "news_system.js");
const src = fs.readFileSync(FILE, "utf8");
const lines = src.split("\n");

// ── 第 1 步：找出每个 jobMultiplier 属于哪个 effects 对象 ──────────────
// 策略：逐行扫描，维护「当前处于几层花括号」，以及 effects 对象的起始行。
// 更稳妥的做法：用 ESLint 报出的行号 + 向上找最近的 `effects: {`。

// ESLint 报出的重复键行号（第二个定义）
const DUP_LINES = [
  1133, 1482, 2662, 4417, 5690, 6347, 6387, 6715, 7208, 7270, 7883, 8788,
  9034, 9567, 9692, 10102, 10667, 11015, 11376, 11461, 11665, 11695, 11777,
  12029, 12061, 12111, 12402, 12451, 12483, 12720, 12738, 12769, 13065, 13130,
  13179, 13211, 13476, 13507, 13529, 13543, 13796, 13828, 14174, 14197, 14211,
  14244, 14529, 14560, 14594, 14826, 14860, 14878, 14928, 15914, 16698, 17126,
  17152, 17422, 17453, 17788, 18786, 19706, 21230, 22749, 25493, 27813, 28962,
];

console.log(`待修复的重复键数量: ${DUP_LINES.length}`);

// ── 第 2 步：逐个校验该行确实是 jobMultiplier 的第二次出现 ──────────────
const problems = [];
const targets = [];

for (const ln of DUP_LINES) {
  const idx = ln - 1;
  const cur = lines[idx];
  if (!cur || !/jobMultiplier\s*:/.test(cur)) {
    problems.push(`第 ${ln} 行不是 jobMultiplier 定义: ${cur}`);
    continue;
  }

  // 从当前行往上找，直到遇到 `effects: {`，其间统计 jobMultiplier 出现次数
  let count = 0;
  let effectsLine = -1;
  let depth = 0;
  for (let i = idx; i >= 0 && i > idx - 40; i--) {
    const text = lines[i];
    if (/jobMultiplier\s*:/.test(text)) count++;
    if (/effects\s*:\s*\{/.test(text)) {
      effectsLine = i + 1;
      break;
    }
  }

  if (effectsLine === -1) {
    problems.push(`第 ${ln} 行向上 40 行内未找到 effects: {`);
    continue;
  }
  if (count < 2) {
    problems.push(
      `第 ${ln} 行在 effects(第${effectsLine}行) 内只出现 ${count} 次，不该改名`
    );
    continue;
  }

  targets.push({ ln, idx, effectsLine, count });
}

if (problems.length) {
  console.error("\n❌ 校验未通过，未做任何修改：");
  problems.forEach((p) => console.error("  - " + p));
  process.exit(1);
}

console.log(`✅ 校验通过：${targets.length} 处均为 effects 内的第 2+ 次定义`);

// ── 第 3 步：执行改名 ─────────────────────────────────────────────────
let changed = 0;
for (const t of targets) {
  const before = lines[t.idx];
  const after = before.replace(/jobMultiplier\s*:/, "jobBonusMultiplier:");
  if (before === after) {
    console.error(`❌ 第 ${t.ln} 行替换失败`);
    process.exit(1);
  }
  lines[t.idx] = after;
  changed++;
}

fs.writeFileSync(FILE, lines.join("\n"), "utf8");
console.log(`✅ 已改名 ${changed} 处 jobMultiplier → jobBonusMultiplier`);
console.log(`   文件已写入: ${FILE}`);
