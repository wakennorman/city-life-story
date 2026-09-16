/**
 * 新闻商品价格效果 · 单元测试（P0-6 修复的回归网）
 *
 * 背景（2026-09-15）：
 *   src/js/data/news.js 的 53 条新闻里 46 条带 effects，其中 19 条带
 *   `effects.priceMod`（14 个是极端值，如 scrap_metal×2 / fruits×0.4），
 *   且 46 条都带 `effects.duration` —— 这些效果**本该是限时的**。
 *
 *   但 registerNewsEventsToPool()（events_core.js）转换时丢掉了整个 effects，
 *   而消费方读 `evt.newsEffects.priceMod` → 永远 undefined → 价格效果全部失效。
 *
 * 为什么不能只补一行：
 *   原消费方是 `price *= mul` 且不处理 duration、不做还原，而 NEWS_EVENTS 的
 *   dailyChance 全为 undefined（转换时统一 0.03/天），300 天里同一事件可触发约 9 次
 *   → ×2 连乘 9 次 = ×512，会摧毁经济。
 *
 * 所以本测试重点守住三条：
 *   ① 生效（价格确实被乘）
 *   ② 到期精确还原（除回去，不留残差）
 *   ③ 不可叠加（同商品同时只允许一条新闻效果生效，杜绝连乘失控）
 *
 * 运行：node tests/newsPriceMods.test.cjs
 */
const runner = require("./headless_runner.cjs");
const vm = require("vm");

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  const ok = actual === expected;
  if (ok) pass++;
  else fail++;
  console.log((ok ? "  ✅ " : "  ❌ ") + name +
    (ok ? "" : "  (实际 " + JSON.stringify(actual) + "，期望 " + JSON.stringify(expected) + ")"));
}
function checkTrue(cond, name) {
  check(!!cond, true, name);
}
function near(actual, expected, eps, name) {
  const ok = Math.abs(actual - expected) <= eps;
  if (ok) pass++;
  else fail++;
  console.log((ok ? "  ✅ " : "  ❌ ") + name +
    (ok ? "" : "  (实际 " + actual + "，期望 ≈" + expected + ")"));
}

/** 从真实 state 里挑一个存在的 (地点, 商品) 对 */
function pickGoods(state) {
  const prices = state.trade && state.trade.goodsPrices;
  if (!prices) return null;
  for (const loc of Object.keys(prices)) {
    const shelf = prices[loc];
    if (!shelf) continue;
    for (const gid of Object.keys(shelf)) {
      const v = Number(shelf[gid]);
      if (isFinite(v) && v > 0) return { loc, gid, value: v };
    }
  }
  return null;
}

(async () => {
  console.log("=".repeat(72));
  console.log("  新闻商品价格效果 · 单元测试");
  console.log("=".repeat(72));

  const ok = await runner.init({ seed: 12345 });
  if (!ok) {
    console.error("初始化失败");
    process.exit(1);
  }

  const state = runner.createState({});
  if (!state) {
    console.error("createState 失败");
    process.exit(1);
  }
  // 挂到 vm 上下文，供 runInThisContext 里的裸标识符访问
  globalThis.__tState = state;

  // 商品价格由 updateAllPrices(state) 填充（游戏里每 3 天一次），
  // 初始 state 的 goodsPrices 是空对象 {}，必须先跑一次才有可测商品。
  vm.runInThisContext("(function(){ if (typeof updateAllPrices === 'function') updateAllPrices(__tState); })()");

  // ---------- 0. 前置：被测函数存在 ----------
  console.log("\n[0] 前置检查");
  const fns = vm.runInThisContext(
    "(function(){return {a: typeof applyNewsPriceMods, e: typeof expireNewsPriceMods};})()"
  );
  check(fns.a, "function", "applyNewsPriceMods 已定义");
  check(fns.e, "function", "expireNewsPriceMods 已定义");

  const g0 = pickGoods(state);
  checkTrue(g0, "state.trade.goodsPrices 有可测商品");
  if (!g0) process.exit(1);

  // ---------- 1. 生效 ----------
  console.log("\n[1] 生效：applyNewsPriceMods 应把价格乘以 mul");
  state.player.day = 100;
  state.flags._newsPriceMods = [];
  const before = Number(state.trade.goodsPrices[g0.loc][g0.gid]);
  const n1 = vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {priceMod: {" +
      JSON.stringify(g0.gid) + ": 2}, duration: 5}, 100);})()"
  );
  checkTrue(n1 > 0, "返回生效条目数 > 0");
  const afterMul = Number(state.trade.goodsPrices[g0.loc][g0.gid]);
  near(afterMul, before * 2, 0.02, "价格被乘以 2");

  // ---------- 2. 不可叠加 ----------
  console.log("\n[2] 不可叠加：同商品生效期内再次施加应被跳过");
  const n2 = vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {priceMod: {" +
      JSON.stringify(g0.gid) + ": 2}, duration: 5}, 101);})()"
  );
  check(n2, 0, "第二次施加返回 0（被跳过）");
  near(Number(state.trade.goodsPrices[g0.loc][g0.gid]), before * 2, 0.02,
    "价格未被二次放大（仍是 ×2 而非 ×4）");

  // ---------- 3. 未到期不还原 ----------
  console.log("\n[3] 未到期：expireNewsPriceMods 不应还原");
  state.player.day = 104;
  vm.runInThisContext("expireNewsPriceMods(__tState)");
  near(Number(state.trade.goodsPrices[g0.loc][g0.gid]), before * 2, 0.02,
    "第 104 天（exp=105）价格仍为 ×2");

  // ---------- 4. 到期精确还原 ----------
  console.log("\n[4] 到期：应精确除回去，不留残差");
  state.player.day = 105;
  const restored = vm.runInThisContext("(function(){return expireNewsPriceMods(__tState);})()");
  checkTrue(restored > 0, "返回还原条目数 > 0");
  near(Number(state.trade.goodsPrices[g0.loc][g0.gid]), before, 0.02,
    "价格精确还原到施加前");
  check(state.flags._newsPriceMods.length, 0, "生效列表已清空");

  // ---------- 5. 边界 ----------
  console.log("\n[5] 边界：非法/无效输入应被忽略");
  const nBad = vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {priceMod: {" +
      JSON.stringify(g0.gid) + ": 1}}, 200);})()"
  );
  check(nBad, 0, "mul === 1 被忽略");
  const nBad2 = vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {priceMod: {" +
      JSON.stringify(g0.gid) + ": 0}}, 200);})()"
  );
  check(nBad2, 0, "mul === 0 被忽略");
  const nNone = vm.runInThisContext("(function(){return applyNewsPriceMods(__tState, null, 200);})()");
  check(nNone, 0, "effects 为 null 安全返回 0");
  const nNoPM = vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {investmentEffect: []}, 200);})()"
  );
  check(nNoPM, 0, "无 priceMod 字段安全返回 0");

  // ---------- 6. 缺省 duration ----------
  console.log("\n[6] 缺省 duration：缺 duration 时应回退到 5 天并仍能还原");
  state.player.day = 300;
  state.flags._newsPriceMods = [];
  const b2 = Number(state.trade.goodsPrices[g0.loc][g0.gid]);
  vm.runInThisContext(
    "(function(){return applyNewsPriceMods(__tState, {priceMod: {" +
      JSON.stringify(g0.gid) + ": 1.5}}, 300);})()"
  );
  near(Number(state.trade.goodsPrices[g0.loc][g0.gid]), b2 * 1.5, 0.02, "无 duration 也能生效");
  state.player.day = 305;
  vm.runInThisContext("expireNewsPriceMods(__tState)");
  near(Number(state.trade.goodsPrices[g0.loc][g0.gid]), b2, 0.02, "第 305 天（300+5）已还原");

  // ---------- 7. P0-6 本体：转换器必须带上 effects ----------
  console.log("\n[7] P0-6 本体：RANDOM_EVENTS 里的新闻条目必须带 newsEffects");
  const conv = vm.runInThisContext(`(function(){
    var newsCount = 0, withEffects = 0, withPM = 0;
    for (var i = 0; i < RANDOM_EVENTS.length; i++) {
      var e = RANDOM_EVENTS[i];
      if (e._converted !== "news") continue;
      newsCount++;
      if (e.newsEffects) {
        withEffects++;
        if (e.newsEffects.priceMod) withPM++;
      }
    }
    return { newsCount: newsCount, withEffects: withEffects, withPM: withPM };
  })()`);
  checkTrue(conv.newsCount > 0, "池中存在转换来的新闻事件（" + conv.newsCount + " 条）");
  checkTrue(conv.withEffects > 0, "带 newsEffects 的条目 > 0（" + conv.withEffects + " 条）");
  checkTrue(conv.withPM > 0, "带 newsEffects.priceMod 的条目 > 0（" + conv.withPM + " 条）");

  // ---------- 8. 投递路径：applyNewsPriceModsForEvent ----------
  console.log("\n[8] 投递路径：applyNewsPriceModsForEvent 应只对新闻条目生效");
  const fnExists = vm.runInThisContext("typeof applyNewsPriceModsForEvent");
  check(fnExists, "function", "applyNewsPriceModsForEvent 已定义");

  state.player.day = 500;
  state.flags._newsPriceMods = [];
  const g1 = pickGoods(state);
  const b3 = Number(state.trade.goodsPrices[g1.loc][g1.gid]);
  // 从池里挑一条真实带 priceMod 的新闻条目
  globalThis.__tGid = g1.gid;
  const nReal = vm.runInThisContext(`(function(){
    for (var i = 0; i < RANDOM_EVENTS.length; i++) {
      var e = RANDOM_EVENTS[i];
      if (e._converted === "news" && e.newsEffects && e.newsEffects.priceMod &&
          e.newsEffects.priceMod[__tGid] !== undefined) {
        return applyNewsPriceModsForEvent(__tState, e);
      }
    }
    return -1;
  })()`);
  if (nReal === -1) {
    console.log("  ⏭  池中无针对该商品的新闻，跳过（不算失败）");
  } else {
    checkTrue(nReal > 0, "真实新闻条目投递后生效（" + nReal + " 条）");
    checkTrue(
      Number(state.trade.goodsPrices[g1.loc][g1.gid]) !== b3,
      "价格确实发生变化",
    );
  }
  // 非新闻条目不应生效
  const nNonNews = vm.runInThisContext(
    "(function(){return applyNewsPriceModsForEvent(__tState, {_converted: 'moral', newsEffects: {priceMod: {" +
      JSON.stringify(g1.gid) + ": 3}}});})()"
  );
  check(nNonNews, 0, "非新闻条目（_converted 非 news）返回 0");
  const nNullEvt = vm.runInThisContext("(function(){return applyNewsPriceModsForEvent(__tState, null);})()");
  check(nNullEvt, 0, "evt 为 null 安全返回 0");

  // ---------- 9. 接线守卫：投递路径必须真的被调用 ----------
  // 这一类的原始 bug 就是"代码写好了但调用点永远不会触发"（死代码），
  // 所以这里直接对源码做接线守卫：一旦有人删掉调用，测试立刻红。
  console.log("\n[9] 接线守卫：events_core 的投递点必须调用 applyNewsPriceModsForEvent");
  const fs = require("fs");
  const path = require("path");
  const evtSrc = fs.readFileSync(
    path.join(__dirname, "../src/js/core/events_core.js"),
    "utf8",
  );
  checkTrue(
    evtSrc.indexOf("applyNewsPriceModsForEvent(state, evt)") >= 0,
    "events_core.js 中存在 applyNewsPriceModsForEvent(state, evt) 调用",
  );
  const pipeSrc = fs.readFileSync(
    path.join(__dirname, "../src/js/phase1/daily_pipeline.js"),
    "utf8",
  );
  checkTrue(
    pipeSrc.indexOf("expireNewsPriceMods(state)") >= 0,
    "daily_pipeline.js 中存在 expireNewsPriceMods(state) 调用",
  );
  // 旧死代码不应复活（它所在的是选项点击回调，新闻条目没有 choices）
  checkTrue(
    evtSrc.indexOf("evt.newsEffects.priceMod") < 0,
    "旧的死代码（evt.newsEffects.priceMod）已被移除",
  );

  console.log("\n" + "=".repeat(72));
  console.log("  通过 " + pass + " / 失败 " + fail);
  console.log("=".repeat(72));
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.error("测试异常:", e);
  process.exit(1);
});
