/**
 * 诊断：style.css 未闭合 @media (max-width:600px) 的实际吞并范围
 *
 * 静态检查发现不了它——因为第 2677 行多一个 `}`、第 5515 行少一个 `}`，
 * 两个错误在花括号配平上互相抵消，文件看起来是"平衡"的。
 * 浏览器不这么算：多余的 `}` 被当错误跳过，未闭合的 @media 自动延伸到 EOF。
 *
 * 本脚本用真实 CSSOM 取证：
 *   1) 打印那个 @media 规则的真实 conditionText 与内部顶层规则数
 *   2) 逐一回答"某选择器在桌面宽度(1280px)下到底能不能命中"
 *   3) 对比注入修正后，桌面端探测元素的 computed style 变化
 *
 * 用法：node scripts/diag-css-mediaswallow.cjs
 */

const path = require("path");
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = "http://127.0.0.1:8931/index.html";

/** 只应作用于移动端、但被错误吞并后桌面端也跟着丢样式的关键选择器 */
const PROBES = [
  ".guidance-bar",
  ".gb-row",
  ".gb-cell",
  ".gb-cell-title",
  ".gb-quest-inner",
  ".action-card:hover",
  ".quick-travel-btn",
  ".npc-rel-card",
  ".transit-btn",
];

async function main() {
  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--enable-unsafe-swiftshader"],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
  await new Promise((r) => setTimeout(r, 1200));

  const report = await page.evaluate((SELECTORS) => {
    const out = { sheets: [], mediaFindings: [], probeAnswers: [] };

    // ---------- 1) 遍历 CSSOM，找出"名义上≤600px 却吞了大量规则"的媒体块 ----------
    for (const sheet of Array.from(document.styleSheets)) {
      let href = sheet.href || "(inline)";
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (e) {
        out.sheets.push({ href, error: "CORS/不可读" });
        continue;
      }
      if (!rules) continue;

      let topLevel = 0;
      const media = [];
      for (const r of Array.from(rules)) {
        topLevel++;
        if (r.type === CSSRule.MEDIA_RULE) {
          media.push({
            conditionText: r.conditionText,
            childCount: r.cssRules.length,
            firstSelectors: Array.from(r.cssRules)
              .slice(0, 6)
              .map((c) => c.selectorText || c.conditionText || c.cssText.slice(0, 40)),
            lastSelectors: Array.from(r.cssRules)
              .slice(-4)
              .map((c) => c.selectorText || c.conditionText || c.cssText.slice(0, 40)),
            // 内部嵌套的媒体块（可与外层互斥 → 死规则）
            nestedMedia: Array.from(r.cssRules)
              .filter((c) => c.type === CSSRule.MEDIA_RULE)
              .map((c) => c.conditionText),
          });
        }
      }
      out.sheets.push({ href, topLevel, mediaCount: media.length });

      // 挑出"子规则异常多"的 ≤600px 块 —— 就是被吞的那个
      for (const m of media) {
        if (/600px/.test(m.conditionText) && m.childCount > 50) {
          out.mediaFindings.push({ href, ...m });
        }
      }
    }

    // ---------- 2) 逐选择器回答：桌面宽度下能否命中 ----------
    function matchesAtDesktop(sel) {
      try {
        // querySelector 会按当前视口的媒体查询结果真实求值
        return document.querySelector(sel) !== null;
      } catch (e) {
        // 形如 ".action-card:hover" 这类伪类选择器，querySelector 有限支持
        try {
          const base = sel.split(":")[0];
          return document.querySelector(base) !== null ? "base-present" : "base-absent";
        } catch (e2) {
          return "err";
        }
      }
    }

    // ---------- 3) 关键证据：探测元素在"当前CSS" vs "修正后CSS"下的 computed style ----------
    const probe = document.createElement("div");
    probe.className = "guidance-bar";
    probe.style.position = "absolute";
    probe.style.left = "-9999px";
    document.body.appendChild(probe);
    const before = getComputedStyle(probe).marginBottom;

    // 注入修正版：把漏掉的 `}` 补上，等效于"规则回到全局作用域"
    const patch = document.createElement("style");
    patch.textContent = ".guidance-bar { margin-bottom: 10px; }";
    document.head.appendChild(patch);
    const after = getComputedStyle(probe).marginBottom;

    probe.remove();

    out.probeAnswers = SELECTORS.map((s) => ({ selector: s, desktopHit: matchesAtDesktop(s) }));

    return { ...out, evidence: { guidanceBar_marginBottom_before: before, guidanceBar_marginBottom_after: after } };
  }, PROBES);

  // ---------- 输出 ----------
  console.log("=== 样式表清单 ===");
  for (const s of report.sheets) console.log("  ", JSON.stringify(s));

  console.log("\n=== 被吞的 ≤600px 媒体块（子规则数 > 50）===");
  for (const m of report.mediaFindings) {
    console.log(`  来源: ${m.href}`);
    console.log(`  conditionText : ${m.conditionText}`);
    console.log(`  内部顶层规则数 : ${m.childCount}`);
    console.log(`  开头: ${m.firstSelectors.join(" | ")}`);
    console.log(`  结尾: ${m.lastSelectors.join(" | ")}`);
    console.log(`  内部嵌套媒体块: ${m.nestedMedia.length ? m.nestedMedia.join(" , ") : "(无)"}`);
    const dead = m.nestedMedia.filter((c) => /min-width/.test(c));
    if (dead.length) console.log(`  !! 死规则（与外层≤600px 互斥，恒不成立）: ${dead.join(" , ")}`);
  }

  console.log("\n=== 桌面宽度(1280px)下这些选择器能否命中 ===");
  for (const p of report.probeAnswers) console.log(`   ${p.selector.padEnd(24)} → ${p.desktopHit}`);

  console.log("\n=== 决定性证据：.guidance-bar 的 margin-bottom ===");
  console.log(`  当前样式表            : ${report.evidence.guidanceBar_marginBottom_before}`);
  console.log(`  补上缺的 } 之后        : ${report.evidence.guidanceBar_marginBottom_after}`);

  await browser.close();
}

main().catch((e) => {
  console.error("诊断失败:", e);
  process.exit(1);
});
