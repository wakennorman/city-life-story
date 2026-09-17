#!/usr/bin/env node
/**
 * audit-domain-recency.mjs — 开轮前重算各域 recency
 *
 * 背景（报告第 46 节）：
 *   `.claude/loop-domain-state.json` 的 `domainRecency` **不可用**。
 *   它在 2026-07-31 之后从未回填，且内部与 CLAUDE.md 的 R1017b/R1018b
 *   记录互相矛盾。开轮时必须以本脚本的读数为准。
 *
 * 三个必须避开的坑：
 *   1. 轮次号是**全局共享**计数器，不是每域独立。
 *      `domain_h_linkage_r1011.js` 与 `domain_c_linkage_r1011.js` 同时存在，
 *      是因为 R1011 那一轮域 C 在深审、域 H 并行做联动 —— 不是"域H的R1011轮"。
 *   2. 中文经 shell 管道（git log | while read）会被转成 GBK 乱码，
 *      `域` 字丢失导致匹配全失败。**必须先落盘 UTF-8 再读**（本脚本用 execFileSync）。
 *   3. 轮次号有 2 位（r44/r76）也有 3~4 位（r1011）。正则不要写死位数。
 *
 * 用法：
 *   node scripts/audit-domain-recency.mjs
 *   node scripts/audit-domain-recency.mjs --json      # 机器可读
 *
 * 口径说明（脚本同时给三个口径，看它们是否收敛）：
 *   口径一：每域 linkage 文件的**最大编号**（仅供参考，编号是全局的）
 *   口径二：每域**最近一次带域标签的完整轮次记录**（git log）
 *   口径三：每域**最近一次 A 类深审轮次**（git log 过滤 A类缺陷修复）
 *
 * 判据：若三个口径的「最陈旧域」排序一致 → 结论稳健，可据此开轮。
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CORE = path.join(ROOT, "src", "js", "core");

const DOMS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const jsonOut = process.argv.includes("--json");

// ── 口径一：linkage 文件最大编号（不含 2 位陷阱：用宽松正则） ──────────────
const diskFiles = fs.readdirSync(CORE);
const maxNum = {};
for (const d of DOMS) {
  const re = new RegExp(`^domain_${d.toLowerCase()}_linkage(?:_events)?_r(\\d+)([a-z]?)\\.js$`);
  let best = null;
  for (const f of diskFiles) {
    const m = f.match(re);
    if (!m) continue;
    const num = parseInt(m[1], 10);
    if (!best || num > best.num || (num === best.num && m[2] && !best.suf)) {
      best = { num, suf: m[2] || "", txt: "R" + num + (m[2] || "") };
    }
  }
  maxNum[d] = best ? best.txt : "(无)";
}

// ── 口径二/三：git log（落盘 UTF-8，避开 shell 编码污染） ──────────────────
function gitSubjectHistory() {
  try {
    // -z 用 NUL 分隔，避免换行/编码问题；再转 UTF-8 字符串
    const out = execFileSync(
      "git",
      ["log", "--format=%h%x1f%ad%x1f%s%x1e", "--date=short", "-n", "3000"],
      { cwd: ROOT, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
    );
    return out
      .split("\x1e")
      .map((r) => r.trim())
      .filter(Boolean)
      .map((r) => {
        const [hash, date, subj] = r.split("\x1f");
        return { hash, date, subj: subj || "" };
      });
  } catch (e) {
    console.error("git log 失败:", e.message);
    return [];
  }
}

const history = gitSubjectHistory();

// 每域最近一次「带域标签的完整轮次记录」；以及最近一次「A类深审」
const lastRound = {};
const lastDeep = {};

for (const { hash, date, subj } of history) {
  // 域标签：支持 "[域E]" / "域E " / "R1013 域E" / "域G~域H"
  const domsHit = new Set();
  for (const d of DOMS) {
    if (new RegExp(`域${d}(?![A-Za-z])`).test(subj)) domsHit.add(d);
  }
  if (/域G~域H/.test(subj)) { domsHit.add("G"); domsHit.add("H"); }
  if (domsHit.size === 0) continue;

  const roundM = [...subj.matchAll(/R(\d+)([a-z]?)/g)]
    .map((m) => ({ num: parseInt(m[1], 10), suf: m[2] || "", txt: "R" + m[1] + (m[2] || "") }))
    .sort((a, b) => b.num - a.num || (b.suf ? 1 : 0) - (a.suf ? 1 : 0));
  const round = roundM[0] ? roundM[0].txt : "";
  // 「深审」= 该轮做了 A 类审计动作。写法有多种，不要只认一种措辞：
  //   "A类缺陷修复(4个)"  "0项A类+3项联动增强"  "A类=0诚实报"  "A类3项/本循环史上最大范围"
  // 只匹配 "A类缺陷修复" 会漏掉大量 "0项A类" 的轮次 → 会得出"域E停在R246"这种错误读数。
  // （这是陷阱 21/22 在本次落地脚本里的又一次复现，故此处放宽为「含 A类 二字」）
  const isDeep = /A类/.test(subj);
  const summary = subj.slice(0, 58);

  for (const d of domsHit) {
    if (!lastRound[d]) lastRound[d] = { hash, date, round, summary };
    if (isDeep && !lastDeep[d]) lastDeep[d] = { hash, date, round, summary };
  }
}

// 补轮次号：同一轮的 A 类修复提交常不带轮次号
// （如 "fix: [域H] A类缺陷修复(7个)"），其 chore 收尾提交才带（"…R1017b 回填…"）。
// 因此：若某域最近一次深审记录的 round 为空，用**同域后续记录**里的轮次号补上。
// 注意只补 round，不替换整条记录 —— 否则会把"最近一次"退回到更早的轮次。
for (const d of DOMS) {
  const rec = lastDeep[d];
  if (!rec || rec.round) continue;
  const filler = history.find(
    (h) => new RegExp(`域${d}(?![A-Za-z])`).test(h.subj) && /R\d+/.test(h.subj)
  );
  if (filler) {
    const m = filler.subj.match(/R(\d+)([a-z]?)/);
    if (m) rec.round = "R" + m[1] + (m[2] || "");
  }
}

if (jsonOut) {
  console.log(JSON.stringify({ maxNum, lastRound, lastDeep }, null, 2));
  process.exit(0);
}

// ── 输出 ──────────────────────────────────────────────────────────────────
const pad = (s, n) => String(s).padEnd(n);
const parseRound = (s) => {
  const m = String(s).match(/^R(\d+)([a-z]?)$/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return parseInt(m[1], 10) + (m[2] ? 0.5 : 0);
};

console.log("════════ 口径一：linkage 文件最大编号（仅参考）════════");
console.log("  注意：轮次号是全局共享的，此列不是「该域第 N 轮深审」。\n");
for (const d of DOMS) console.log(`  域 ${d}: ${maxNum[d]}`);

console.log("\n════════ 口径二：最近一次带域标签的完整轮次记录 ════════\n");
const r2 = DOMS.map((d) => ({ dom: d, ...(lastRound[d] || {}) }));
for (const r of r2) {
  console.log(`  域 ${r.dom}: ${pad(r.round || "?", 8)} ${r.date || "-"}  ${r.hash || ""}`);
  if (r.summary) console.log(`           ${r.summary}`);
}
const sorted2 = [...r2].sort((a, b) => parseRound(a.round) - parseRound(b.round));
console.log(`\n  ★ 最陈旧: 域 ${sorted2[0].dom} ${sorted2[0].round}`);

console.log("\n════════ 口径三：最近一次 A 类深审 ════════\n");
const r3 = DOMS.map((d) => ({ dom: d, ...(lastDeep[d] || {}) }));
for (const r of r3) {
  console.log(`  域 ${r.dom}: ${pad(r.round || "?", 8)} ${r.date || "-"}  ${r.hash || ""}`);
  if (r.summary) console.log(`           ${r.summary}`);
}
const withDeep = r3.filter((r) => r.round);
const sorted3 = [...withDeep].sort((a, b) => parseRound(a.round) - parseRound(b.round));
if (sorted3.length) console.log(`\n  ★ 最陈旧: 域 ${sorted3[0].dom} ${sorted3[0].round}`);

console.log("\n════════ 收敛判定 ════════");
if (sorted3.length && sorted2.length) {
  const c1 = sorted3[0].dom;
  const c2 = sorted2[0].dom;
  if (c1 === c2) {
    console.log(`  ✓ 口径二与口径三收敛于「域 ${c1}」—— 结论稳健，可据此开轮。`);
  } else {
    console.log(`  ✗ 口径二指向「域 ${c2}」，口径三指向「域 ${c1}」—— 不收敛。`);
    console.log("    不要取平均或投票。检查哪个口径的假设更弱（见 skill 陷阱 21/22）。");
  }
}
console.log(
  "\n  提示：.claude/loop-domain-state.json 的 domainRecency 不可用（见报告第 46 节），\n" +
  "        开轮须以本脚本读数为准。"
);
