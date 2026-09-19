/**
 * 出行方式规则门禁（travel_rules.js 单一事实源）
 *
 * 存在理由 —— 三个已在线上被玩家撞到 / 评审发现的缺陷：
 *   ① 「坐地铁到不了银行」：原 METRO_STATIONS 是 render.js 内的局部常量，
 *      8 个站里**漏了 bank**，而银行是金融区核心。
 *   ② 「地图说能去、点下去却弹『不在地铁沿线』」：节点渲染期判一次可达性，
 *      点击回调里**又判一次**，两处口径分叉。
 *   ③ 「交通费不进日报」：UI 直接 `cash -= price`，不走 addDailyTransaction，
 *      钱扣了但日报「今日收支明细」「净收入」都看不到 → 账实不符。
 *
 * 修法是把规则下沉为 `src/js/data/travel_rules.js`，UI 只调用不重算。
 * 本门禁守住三件事：
 *   A 地铁沿线表必须包含金融/政务等主干站点（反向对照：喂旧 8 站表必须报出）
 *   B resolveTransit 必须**纯函数**且判据自洽（反向对照：喂越界跳数必须拦）
 *   C payTransitFee 必须真的调用 addDailyTransaction（反向对照：把账本调用
 *     拆掉，检测器必须报出来 —— 否则它就是个恒绿门禁）
 *
 * ★ 本文件的每条正向断言都配一条反向对照。没有反向对照的门禁不算门禁：
 *   你会得到一个"永远绿"的假门禁，比没有门禁更危险（它给你虚假的安全感）。
 */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const TRAVEL_JS = path.join(ROOT, "src/js/data/travel_rules.js");
const LOCATIONS_JS = path.join(ROOT, "src/js/data/locations.js");
const RENDER_JS = path.join(ROOT, "src/js/ui/render.js");
const INDEX_HTML = path.join(ROOT, "src/index.html");

let PASS = 0;
let FAIL = 0;
const FAILURES = [];

function ok(name, cond, detail) {
  if (cond) {
    PASS++;
    console.log("  ✅ " + name + (detail ? " — " + detail : ""));
  } else {
    FAIL++;
    FAILURES.push(name);
    console.log("  ❌ " + name + (detail ? " — " + detail : ""));
  }
}

/**
 * 在干净的沙箱里加载 travel_rules.js，返回其导出的全局。
 * 这样测试不依赖浏览器环境，也不会污染 node 全局。
 */
function loadTravelRules() {
  const src = fs.readFileSync(TRAVEL_JS, "utf8");
  const sandbox = {
    window: {},
    console,
    Math,
    // getLocationHops 由 locations.js 提供，这里给一个可控桩，
    // 保证 resolveTransit 的跳数分支可被独立验证（见 B 组）。
    getLocationHops: (from, to) => (to === "farAway" ? 99 : to === "nearby" ? 1 : 2),
    addDailyTransaction: null,
    Random: { int: (a, b) => Math.floor((a + b) / 2) },
  };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: "travel_rules.js" });
  return sandbox.window;
}

console.log("════ 出行方式规则门禁 ════\n");

const G = loadTravelRules();

/* ─────────── A. 地铁沿线表 ─────────── */
console.log("A. 地铁沿线站点");

ok("A1 METRO_STATIONS 已导出", Array.isArray(G.METRO_STATIONS), G.METRO_STATIONS ? G.METRO_STATIONS.length + " 站" : "缺失");

const stations = G.METRO_STATIONS || [];
// 这些是「城区主干线」必须覆盖的站点。判据见 travel_rules.js 注释：
// 市中心 / 金融 / 政务 / 大型公共服务 / 两大人口集散地。
const MUST_HAVE = [
  ["bank", "银行（金融区核心）"],
  ["commercialDist", "市中心"],
  ["gov_office", "政务区"],
  ["hospital", "医院"],
  ["school", "大学城"],
  ["techPark", "科技园"],
  ["entertainment", "娱乐城"],
  ["slum", "城中村"],
  ["wholesaleMarket", "批发市场"],
];
MUST_HAVE.forEach(([id, label]) => {
  ok(
    "A2 沿线含 " + id + "（" + label + "）",
    stations.indexOf(id) >= 0,
    stations.indexOf(id) >= 0 ? "" : "★ 这就是玩家反馈的『坐地铁到不了" + label + "』",
  );
});

// 反向对照：旧表（8 站，无 bank）必须被检出「缺 bank」。
// 做法：直接检查断言逻辑本身 —— 对旧表跑同一套 MUST_HAVE，必须失败。
const OLD_8 = [
  "techPark", "commercialDist", "hospital", "school",
  "trainingCenter", "entertainment", "slum", "wholesaleMarket",
];
const oldMissingBank = MUST_HAVE.some(([id]) => OLD_8.indexOf(id) < 0);
ok(
  "A3 反向对照：旧 8 站表会被本断言判失败",
  oldMissingBank === true,
  oldMissingBank ? "（旧表确实缺 bank 等，说明断言有效）" : "★ 断言恒真，失去检测能力",
);

// 郊区/工业区刻意不在线上 —— 守住地铁的覆盖边界，否则出行方式没有取舍意义。
const OUT_OF_LINE = ["suburb", "factoryZone", "logistics_park", "auto_city"];
const anyOutIn = OUT_OF_LINE.filter((id) => stations.indexOf(id) >= 0);
ok(
  "A4 郊区/工业区不在地铁线上（保留取舍边界）",
  anyOutIn.length === 0,
  anyOutIn.length ? "误入：" + anyOutIn.join(", ") : OUT_OF_LINE.join("/") + " 均不在线上",
);

/* ─────────── B. resolveTransit 纯函数与判据 ─────────── */
console.log("\nB. resolveTransit 判据");

const hasResolve = typeof G.resolveTransit === "function";
ok("B1 resolveTransit 已导出", hasResolve);

if (hasResolve) {
  const mkState = (cars) => ({
    investment: { cars: cars ? [{}] : [] },
    resources: { cash: 1000 },
  });

  // B2 地铁到银行现在应该可行（核心修复）
  const toBank = G.resolveTransit("metro", "commercialDist", "bank", mkState(false));
  ok(
    "B2 地铁可从市中心到银行",
    toBank.ok === true,
    toBank.ok ? "AP=" + toBank.ap + " ¥" + toBank.price : "被拦：" + toBank.reason,
  );

  // B3 地铁到郊区应被拦，且**必须给出理由**（不能静默失败）
  const toSuburb = G.resolveTransit("metro", "commercialDist", "suburb", mkState(false));
  ok(
    "B3 地铁到郊区被拦且附带理由",
    toSuburb.ok === false && !!toSuburb.reason,
    toSuburb.ok ? "★ 不该可达" : "理由：" + toSuburb.reason,
  );

  // B4 无车时自驾必须被拦
  const carNo = G.resolveTransit("car", "commercialDist", "bank", mkState(false));
  ok("B4 无车时自驾被拦", carNo.ok === false, carNo.ok ? "★ 不该可达" : carNo.reason);
  // 对照：有车时自驾应放行
  const carYes = G.resolveTransit("car", "commercialDist", "bank", mkState(true));
  ok("B4b 有车时自驾放行（对照）", carYes.ok === true, carYes.ok ? "¥" + carYes.price : carYes.reason);

  // B5 单车跳数上限：getLocationHops 桩对 'farAway' 返回 99（不可达哨兵）
  const bikeFar = G.resolveTransit("bike", "commercialDist", "farAway", mkState(false));
  ok(
    "B5 单车超跳数被拦",
    bikeFar.ok === false,
    bikeFar.ok ? "★ 不该可达" : "理由：" + bikeFar.reason,
  );
  // ★ B5 的文案必须**不含 99** —— getLocationHops 不可达时返回 99 哨兵，
  //   若直接把 99 拼进文案会产出"骑车太远了（99个地段）"这种怪话。
  ok(
    "B5b 不可达文案不泄露 99 哨兵",
    bikeFar.reason && bikeFar.reason.indexOf("99") < 0,
    bikeFar.reason || "",
  );
  // 反向对照：近处骑车应放行
  const bikeNear = G.resolveTransit("bike", "commercialDist", "nearby", mkState(false));
  ok("B5c 反向对照：近处骑车放行", bikeNear.ok === true, bikeNear.ok ? "¥" + bikeNear.price : bikeNear.reason);

  // B6 纯函数：调用前后 state 不变
  const st = mkState(false);
  const snapshot = JSON.stringify(st);
  G.resolveTransit("taxi", "commercialDist", "bank", st);
  G.resolveTransit("metro", "commercialDist", "suburb", st);
  ok(
    "B6 resolveTransit 是纯函数（不改 state）",
    JSON.stringify(st) === snapshot,
    JSON.stringify(st) === snapshot ? "调用前后 state 一致" : "★ 产生了副作用",
  );

  // B7 同一 from==to 应被拦
  const same = G.resolveTransit("walk", "bank", "bank", mkState(false));
  ok("B7 原地不动被拦", same.ok === false, same.reason || "");
}

/* ─────────── C. 交通费记账 ─────────── */
console.log("\nC. 交通费记账");

const hasPay = typeof G.payTransitFee === "function";
ok("C1 payTransitFee 已导出", hasPay);

if (hasPay) {
  // 在沙箱里重新加载，这次给 addDailyTransaction 装一个探针
  const sandbox = {
    window: {},
    console,
    Math,
    getLocationHops: () => 1,
    addDailyTransaction: null,
    Random: { int: () => 0 },
  };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(TRAVEL_JS, "utf8"), sandbox, { filename: "travel_rules.js" });

  const calls = [];
  sandbox.addDailyTransaction = function (st, type, cat, amount, desc) {
    calls.push({ type, cat, amount, desc });
  };

  const st = { resources: { cash: 100 }, flags: {} };
  const r = sandbox.window.payTransitFee(st, 4, "🚇 地铁", "银行");

  ok("C2 扣款金额正确", st.resources.cash === 96, "现金 100 → " + st.resources.cash);
  ok("C3 确实调用了账本", calls.length === 1, calls.length + " 次");
  ok(
    "C4 账本条目为 expense/transit",
    calls[0] && calls[0].type === "expense" && calls[0].cat === "transit",
    calls[0] ? calls[0].type + "/" + calls[0].cat + " ¥" + calls[0].amount : "无",
  );

  // ★ C5 反向对照（**真实注入**，不是自证）：
  //   把 travel_rules.js 源里的 `addDailyTransaction(` 调用临时抹掉，
  //   在沙箱里重新加载并复跑同一段检测，**必须**从 1 次变成 0 次。
  //   这才证明 C3 真的在测东西 —— 第一版 C5 是自己造了个空数组去断言"它是空的"，
  //   那是自证式断言（恒真），等于没测。
  {
    const raw = fs.readFileSync(TRAVEL_JS, "utf8");
    const mutated = raw.replace(
      /if \(typeof addDailyTransaction === "function"\) \{[\s\S]*?\n  \}/,
      "/* [反向对照] 账本调用被摘除 */",
    );
    const injected = mutated !== raw;
    ok(
      "C5a 反向对照注入成功（账本调用已被摘除）",
      injected,
      injected ? "源已变形" : "★ 注入失败，无法验证",
    );

    let callsInjected = 0;
    const sb = {
      window: {},
      console,
      Math,
      getLocationHops: () => 1,
      addDailyTransaction: function () { callsInjected++; },
      Random: { int: () => 0 },
    };
    vm.createContext(sb);
    vm.runInContext(mutated, sb, { filename: "travel_rules.mutated.js" });
    const stx = { resources: { cash: 100 }, flags: {} };
    sb.window.payTransitFee(stx, 4, "🚇 地铁", "银行");

    ok(
      "C5b 摘除账本后 C3 型检测会失败（证明检测有效）",
      callsInjected === 0 && stx.resources.cash === 96,
      "注入版账本调用 " + callsInjected + " 次（应为 0），现金 " + stx.resources.cash,
    );
  }

  // C6 现金不足时不得扣款、且给理由
  const stPoor = { resources: { cash: 2 }, flags: {} };
  const calls3 = [];
  sandbox.addDailyTransaction = function () { calls3.push(1); };
  const r2 = sandbox.window.payTransitFee(stPoor, 4, "🚇 地铁", "银行");
  ok(
    "C6 现金不足时不扣款且给理由",
    r2.ok === false && stPoor.resources.cash === 2 && calls3.length === 0,
    r2.reason || "",
  );
}

/* ─────────── D. 挂载与去重（防悬空/防遮蔽） ─────────── */
console.log("\nD. 挂载与去重");

const indexHtml = fs.readFileSync(INDEX_HTML, "utf8");
const renderSrc = fs.readFileSync(RENDER_JS, "utf8");

ok(
  "D1 travel_rules.js 已在 index.html 挂载",
  indexHtml.indexOf("js/data/travel_rules.js") >= 0,
  indexHtml.indexOf("js/data/travel_rules.js") >= 0 ? "" : "★ 漏挂 = build 静默剔除",
);

// 必须在 locations.js 之后（依赖 getLocationHops）
const posLoc = indexHtml.indexOf("js/data/locations.js");
const posTravel = indexHtml.indexOf("js/data/travel_rules.js");
ok(
  "D2 travel_rules.js 在 locations.js 之后加载",
  posLoc >= 0 && posTravel > posLoc,
  "locations@" + posLoc + " < travel@" + posTravel,
);

// 防遮蔽：render.js 里不得再有局部 const TRANSIT_MODES（会遮蔽全局同名对象表）
ok(
  "D3 render.js 无局部 TRANSIT_MODES 遮蔽",
  !/const\s+TRANSIT_MODES\s*=/.test(renderSrc),
  /const\s+TRANSIT_MODES\s*=/.test(renderSrc) ? "★ 会遮蔽 travel_rules 的全局表" : "",
);

// 防回退：render.js 里不得再出现局部 METRO_STATIONS 定义
ok(
  "D4 render.js 无局部 METRO_STATIONS 定义",
  !/const\s+METRO_STATIONS\s*=\s*\[/.test(renderSrc),
  /const\s+METRO_STATIONS\s*=\s*\[/.test(renderSrc) ? "★ 又出现局部副本" : "",
);

// ★ D5 的教训：第一版写成「全文件搜 `resources.cash = (...) - price`」，
//   结果误伤了 6308 行的**属性训练**收费（`t.basePrice`）—— 那是另一码事。
//   断言必须**限定在交通费的代码区域内**，否则它会一直红，
//   然后被人当作"噪音"关掉，门禁就废了（这是门禁最常见的死法）。
//
// 做法：先定位 `resolveTransit` 所在的地图点击处理块，只在那一块里搜直写。
const mapClickStart = renderSrc.indexOf("node.addEventListener(\"click\", () => {");
const mapClickEnd = renderSrc.indexOf("mapGrid.appendChild(node);", mapClickStart);
const mapBlock =
  mapClickStart >= 0 && mapClickEnd > mapClickStart
    ? renderSrc.slice(mapClickStart, mapClickEnd)
    : "";
ok(
  "D5 已定位地图点击处理块（断言作用域正确）",
  mapBlock.length > 0,
  mapBlock.length + " 字符",
);
const directCash = /resources\.cash\s*=\s*\(?\s*state\.resources\.cash\s*\|\|\s*0\s*\)?\s*-\s*price/.test(
  mapBlock,
);
ok(
  "D5b 地图交通费不再直写 cash（走 payTransitFee）",
  !directCash,
  directCash ? "★ 绕过了账本，日报看不到这笔支出" : "",
);
ok(
  "D5c 地图块内确实调用了 payTransitFee",
  mapBlock.indexOf("payTransitFee(") >= 0,
  mapBlock.indexOf("payTransitFee(") >= 0 ? "" : "★ 未接入统一结算入口",
);

// D6 render.js 确实用上了下沉函数
ok("D6 render.js 调用了 resolveTransit", renderSrc.indexOf("resolveTransit(") >= 0);
ok("D7 render.js 调用了 payTransitFee", renderSrc.indexOf("payTransitFee(") >= 0);

/* ─────────── 汇总 ─────────── */
console.log("\n════ 结果: " + PASS + " 通过 / " + FAIL + " 失败 ════");
if (FAIL > 0) {
  console.log("失败项：");
  FAILURES.forEach((f) => console.log("  · " + f));
  process.exit(1);
}
process.exit(0);
