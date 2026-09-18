#!/usr/bin/env node
/**
 * CSS 结构守卫 —— 拦截"花括号错误互相抵消"这类静默损坏
 *
 * 起因（2026-09-18 实测）：
 *   style.css:2687 有一段被错误编辑切断的 linear-gradient 残片，多出一个孤立 `}`；
 *   style.css:5662 的 @media (max-width:600px) 又漏了闭合 `}`。
 *   两者在花括号计数上互相抵消 → 全文件"看起来平衡"，
 *   所有静态检查（含 ESLint / 构建）全部放行。
 *
 *   但浏览器不按计数走：多余 `}` 被当解析错误忽略，未闭合的 @media 自动延伸到 EOF，
 *   于是 5662 之后的 78 条规则（引导面板 .gb-*、行动卡 :hover/:active、NPC 关系卡、
 *   快捷旅行、交通按钮…）全部被吞进「≤600px」条件，桌面端彻底失效。
 *   实测影响：1280×900 下 23.18% 的像素与修复后不同，引导面板高度 496px → 120px。
 *
 * 本脚本检查三项（均为可判定的硬事实，无阈值猜测）：
 *   ① 块未闭合（剥离注释与字符串后逐字符统计，并对多余 `}` 做浏览器式错误恢复）
 *   ② 孤立的多余右括号
 *   ③ 相互矛盾无法同时成立的嵌套媒体查询（min-width 嵌在 max-width 里 → 死规则）
 *
 * 曾尝试的「媒体块子规则数超过阈值 = 吞并」启发式已移除：
 *   本项目存在合法的大型移动端适配段（@media (max-width:480px) 内含 172 条规则），
 *   与被吞块的 83 条量级重叠，阈值无法区分真假，只会持续误报。
 *
 * 用法：node scripts/check-css-structure.mjs [目录或文件...]
 *   默认扫描 src/css
 */

import fs from "node:fs";
import path from "node:path";

const DEFAULT_ROOTS = ["src/css"];

/** 剥离注释与字符串，保留换行以便定位行号 */
function stripCommentsAndStrings(src) {
  const out = [];
  let i = 0;
  const n = src.length;
  while (i < n) {
    if (src.startsWith("/*", i)) {
      const j = src.indexOf("*/", i + 2);
      const end = j === -1 ? n : j + 2;
      out.push("\n".repeat(src.slice(i, end).split("\n").length - 1));
      i = end;
    } else if (src[i] === '"' || src[i] === "'") {
      const q = src[i];
      let j = i + 1;
      while (j < n && src[j] !== q) {
        if (src[j] === "\\") j++;
        j++;
      }
      out.push(" ".repeat(Math.min(j + 1 - i, 200)));
      i = j + 1;
    } else {
      out.push(src[i]);
      i++;
    }
  }
  return out.join("");
}

function collectFiles(roots) {
  const files = [];
  for (const r of roots) {
    if (!fs.existsSync(r)) continue;
    const st = fs.statSync(r);
    if (st.isFile()) {
      if (r.endsWith(".css")) files.push(r);
    } else {
      for (const f of fs.readdirSync(r)) {
        const p = path.join(r, f);
        if (fs.statSync(p).isFile() && p.endsWith(".css")) files.push(p);
      }
    }
  }
  return files;
}

/**
 * 逐字符走一遍，返回：
 *   depthAtEof / strayCloses[] / mediaBlocks[]（含子规则数）
 */
function analyze(raw) {
  const clean = stripCommentsAndStrings(raw);
  const cleanLines = clean.split("\n");
  const rawLines = raw.split("\n");

  let depth = 0;
  const strayCloses = [];
  const mediaBlocks = [];
  const openStack = []; // { line, kind, childCountFrom }

  for (let ln = 0; ln < cleanLines.length; ln++) {
    const line = cleanLines[ln];
    for (let c = 0; c < line.length; c++) {
      const ch = line[c];
      if (ch === "{") {
        const head = rawLines[ln] || "";
        const isMedia = /@media/i.test(head);
        // 父块子规则数 +1（只统计"直接子规则"，即深度 1 处的开括号）
        if (openStack.length >= 1) {
          const parent = openStack[openStack.length - 1];
          if (depth === openStack.length) parent.childCount++;
        }
        depth++;
        openStack.push({
          line: ln + 1,
          isMedia,
          childCount: 0,
          condition: isMedia ? (head.match(/@media[^{]*/i) || [""])[0].trim() : "",
          parentCondition: isMedia && openStack.some((o) => o.isMedia)
            ? openStack.filter((o) => o.isMedia).map((o) => o.condition).join(" & ")
            : "",
        });
      } else if (ch === "}") {
        depth--;
        if (depth < 0) {
          strayCloses.push(ln + 1);
          depth = 0;
          openStack.length = 0;
        } else {
          const blk = openStack.pop();
          if (blk && blk.isMedia) mediaBlocks.push(blk);
        }
      }
    }
  }

  return { depthAtEof: depth, strayCloses, mediaBlocks, unclosed: openStack };
}

/** 判断两个媒体条件是否互斥（如 min-width:769px 嵌在 max-width:600px 内） */
function mutuallyExclusive(outer, inner) {
  const omin = outer.match(/min-width:\s*(\d+)/i);
  const omax = outer.match(/max-width:\s*(\d+)/i);
  const imin = inner.match(/min-width:\s*(\d+)/i);
  const imax = inner.match(/max-width:\s*(\d+)/i);
  if (omax && imin && Number(imin[1]) > Number(omax[1])) return `${outer} 内嵌 ${inner}`;
  if (omin && imax && Number(imax[1]) < Number(omin[1])) return `${outer} 内嵌 ${inner}`;
  return null;
}

function main() {
  const roots = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT_ROOTS;
  const files = collectFiles(roots);
  if (!files.length) {
    console.error(`未找到 CSS 文件（扫描路径: ${roots.join(", ")}）`);
    process.exit(1);
  }

  const problems = [];
  const largest = [];
  let totalMediaChecked = 0;

  for (const f of files) {
    const raw = fs.readFileSync(f, "utf8");
    const r = analyze(raw);

    if (r.depthAtEof !== 0) {
      const last = r.unclosed.length ? r.unclosed[r.unclosed.length - 1] : null;
      problems.push({
        file: f,
        level: "FATAL",
        msg: `有 ${r.depthAtEof} 个块未闭合${last ? `（最后一个开括号在行 ${last.line}: ${(last.condition || "(普通规则)")}）` : ""}`,
        detail: "未闭合的媒体块会把其后所有规则吞进该条件，桌面端静默失效",
      });
    }

    for (const ln of r.strayCloses) {
      problems.push({
        file: f,
        level: "FATAL",
        msg: `行 ${ln}: 多余的右括号（浏览器当解析错误忽略）`,
        detail: "常见于被错误编辑切断的声明残片，可能抵消别处漏掉的括号",
      });
    }

    for (const m of r.mediaBlocks) {
      totalMediaChecked++;
      // 仅作 INFO：本项目存在合法的大段移动端适配，子规则数无法用于判断吞并
      largest.push({ file: f, line: m.line, condition: m.condition, childCount: m.childCount });
    }

    // 嵌套媒体查询互斥检测
    for (const m of r.mediaBlocks) {
      if (!m.parentCondition) continue;
      const outer = m.parentCondition.split(" & ")[0];
      const hit = mutuallyExclusive(outer, m.condition);
      if (hit) {
        problems.push({
          file: f,
          level: "WARN",
          msg: `行 ${m.line}: 嵌套媒体查询恒不成立 —— ${hit}`,
          detail: "该块内所有规则永远不会生效（死规则）",
        });
      }
    }
  }

  console.log(`CSS 结构守卫：扫描 ${files.length} 个文件，检查 ${totalMediaChecked} 个媒体块`);

  // INFO：最大的几个媒体块（仅供人工瞄一眼，不作为失败依据）
  largest.sort((a, b) => b.childCount - a.childCount);
  if (largest.length) {
    console.log("\n最大的媒体块（INFO，仅供参考）:");
    for (const b of largest.slice(0, 5)) {
      console.log(`  ${b.condition}  —  ${b.childCount} 条  (${b.file}:${b.line})`);
    }
  }

  if (!problems.length) {
    console.log("\n✅ 全部通过：无未闭合块、无孤立括号、无互斥嵌套");
    process.exit(0);
  }

  const fatals = problems.filter((p) => p.level === "FATAL");
  const warns = problems.filter((p) => p.level === "WARN");
  console.log(`\n发现 ${fatals.length} 项 FATAL、${warns.length} 项 WARN：\n`);
  for (const p of problems) {
    console.log(`  [${p.level}] ${p.file} — ${p.msg}`);
    if (p.detail) console.log(`           ${p.detail}`);
  }
  process.exit(fatals.length ? 1 : 0);
}

main();
