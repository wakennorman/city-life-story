#!/usr/bin/env node
/**
 * 诊断（第三版）：按「日」粒度定位漏账来源
 *
 * 前两版的问题：
 *   ① v1 在 setter 触发瞬间判断「未记账」，但记账调用在现金写入之后
 *      （news.js 的 cashLoss：先改 cash 再 addDailyTransaction）→ 误报
 *   ② v2 在 advanceDay 结束后读 _dailyTransactions，但 daily_report
 *      已在日终把它清空（daily_report.js:1242）→ 账本Δ 恒为 0
 *
 * v3 思路：直接包裹 addDailyTransaction，累计**当日全部记账额**，
 * 与现金实际变化比对，得到真实漏账。再对漏账日的现金写入定位调用栈。
 */

const path = require("path");

async function main() {
  const runner = require(path.resolve(__dirname, "..", "tests", "headless_runner.cjs"));
  runner.init();
  const state = runner.createState();

  // ── 拦截 addDailyTransaction 累计当日记账额 ──────────────────────
  let bookTotal = 0;
  const origAdd = globalThis.addDailyTransaction;
  if (typeof origAdd !== "function") {
    console.log("⚠️ addDailyTransaction 不是全局函数，无法拦截");
  } else {
    globalThis.addDailyTransaction = function (st, type, category, amount, desc) {
      bookTotal += type === "income" ? amount : -amount;
      return origAdd.apply(this, arguments);
    };
  }

  // ── 拦截现金写入，记录栈 ────────────────────────────────────────
  let cashValue = state.resources.cash;
  let writes = [];
  Object.defineProperty(state.resources, "cash", {
    configurable: true,
    enumerable: true,
    get() {
      return cashValue;
    },
    set(v) {
      const prev = cashValue;
      cashValue = v;
      writes.push({
        diff: v - prev,
        stack: new Error().stack.split("\n").slice(2, 12).join("\n"),
      });
    },
  });

  const strategy = runner.getStrategy ? runner.getStrategy("balanced") : null;

  console.log("=== 逐日对账（20 天）===");
  console.log("日 | 日初现金 | 日末现金 | 实际Δ | 记账Δ | 漏账");

  const leaks = [];

  for (let d = 0; d < 20; d++) {
    const cashBefore = state.resources.cash;
    bookTotal = 0;
    writes = [];

    const ok = runner.advanceDay(state, strategy);
    if (ok === false) {
      console.log("（游戏结束）");
      break;
    }

    const cashAfter = state.resources.cash;
    const actualDelta = cashAfter - cashBefore;
    const leak = Math.round((actualDelta - bookTotal) * 100) / 100;

    console.log(
      `${String(state.player.day).padStart(2)} | ${String(Math.round(cashBefore)).padStart(7)} | ${String(Math.round(cashAfter)).padStart(7)} | ${String(Math.round(actualDelta)).padStart(6)} | ${String(Math.round(bookTotal)).padStart(6)} | ${leak === 0 ? "0" : "¥" + leak}`
    );

    if (Math.abs(leak) > 1) {
      leaks.push({ day: state.player.day, leak, actualDelta, bookTotal, writes: writes.slice() });
    }
  }

  console.log(`\n=== 有漏账的天数: ${leaks.length} / 20 ===`);

  if (leaks.length) {
    const frameCounter = new Map();
    for (const l of leaks) {
      for (const w of l.writes) {
        const frames = w.stack.split("\n");
        const srcFrame = frames.find((f) => /[\\/]src[\\/]/.test(f));
        if (srcFrame) {
          const key = srcFrame.trim().replace(/:\d+:\d+\)?$/, "");
          frameCounter.set(key, (frameCounter.get(key) || 0) + 1);
        }
      }
    }
    console.log("\n=== 漏账日中的现金写入来源（按次数）===");
    [...frameCounter.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .forEach(([k, n]) => console.log(`  ${String(n).padStart(4)} × ${k}`));

    const first = leaks[0];
    console.log(`\n=== 首个漏账日（第 ${first.day} 天）的写入明细 ===`);
    console.log(`漏账 ¥${first.leak}（实际Δ ${first.actualDelta} / 记账Δ ${first.bookTotal}）`);
    for (const w of first.writes) {
      const frames = w.stack.split("\n");
      const srcFrames = frames.filter((f) => /[\\/]src[\\/]/.test(f)).slice(0, 3);
      console.log(`\n  写入 ¥${w.diff}`);
      srcFrames.forEach((f) => console.log("    " + f.trim()));
      if (!srcFrames.length) console.log("    （无 src/ 帧 — 来自夹具策略或引擎外）");
    }
  }
}

main().catch((e) => {
  console.error("探针失败:", e && e.message);
  console.error(e && e.stack);
  process.exit(1);
});
