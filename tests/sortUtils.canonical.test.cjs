/**
 * 分类排序工具 规范源比对单测 (canonical comparison)
 *
 * 策略：
 *   1. vm 加载 vanilla src/js/core/sort_utils.js → window.SortUtils（sortInteractiveList / getListDef / getSkillCategory）
 *   2. esbuild 打包 TS src/app/core/sort/sortUtils.ts → 规范源 T
 *   3. 对每个内置列表类型，用同一组 items + freq state 分别跑 vanilla(getListDef) 与 TS(BUILTIN_LIST_CONFIGS)，
 *      比对角落（深比较排序后数组，元素为同一引用 → 顺序敏感）
 *   4. 比 getSkillCategory 全部技能 id（含未知）及 SKILL_CATEGORY_MAP 数据保真
 *
 * 不修改 vanilla 端，加载序不变；纯比对。
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");
const esbuild = require("esbuild");

const VANILLA_FILE = "src/js/core/sort_utils.js";
const TS_ENTRY = "src/app/core/sort/sortUtils.ts";

// ---------- 加载 vanilla ----------
const vanillaSrc = fs.readFileSync(VANILLA_FILE, "utf8");
const ctx = {
  console,
  Math,
  JSON,
  Date,
  Array,
  Object,
  String,
  Number,
  Boolean,
  Set,
  RegExp,
  parseInt,
  parseFloat,
  isNaN,
  isFinite,
};
vm.createContext(ctx);
ctx.window = ctx; // window.SortUtils = ... → ctx.SortUtils
vm.runInContext(vanillaSrc, ctx, { filename: VANILLA_FILE });

const Vanilla = ctx.SortUtils;
if (!Vanilla || typeof Vanilla.sortInteractiveList !== "function") {
  console.error("FAIL: vanilla SortUtils.sortInteractiveList not loaded");
  process.exit(1);
}

// ---------- 打包 TS 规范源 ----------
const outfile = path.join(
  require("os").tmpdir(),
  "sortUtils_canonical_" + Date.now() + ".cjs"
);
esbuild.buildSync({
  entryPoints: [TS_ENTRY],
  bundle: true,
  format: "cjs",
  platform: "node",
  outfile,
  logLevel: "silent",
});
const T = require(outfile);
if (
  typeof T.sortInteractiveList !== "function" ||
  typeof T.getSkillCategory !== "function" ||
  !T.SKILL_CATEGORY_MAP ||
  !T.BUILTIN_LIST_CONFIGS
) {
  console.error(
    "FAIL: TS bundle missing exports:",
    Object.keys(T)
  );
  process.exit(1);
}

// ---------- seeded PRNG (mulberry32) ----------
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let passed = 0;
function check(cond, msg) {
  assert.ok(cond, msg);
  passed++;
}

// ---------- 数据池 ----------
const TRADE_CATS = [
  "food",
  "daily",
  "clothing",
  "electronics",
  "luxury",
  "scrap",
];
const TRADE_IDS = [
  "water",
  "rice",
  "vegetables",
  "fruits",
  "noodles",
  "pork",
  "beef",
  "chicken",
  "fish",
  "egg",
  "milk",
  "daily_use",
  "snack",
  "drink",
];
const SKILL_IDS = [
  "cooking",
  "repair",
  "electrician",
  "welding",
  "coding",
  "english",
  "accounting",
  "driving",
  "sales",
  "management",
  "fishing",
  "singing",
];
const STOCK_INDUSTRIES = ["科技", "新能源", "消费", "金融", "房地产", "医药"];
const STOCK_SYMBOLS = [
  "A001",
  "A002",
  "B103",
  "C205",
  "D307",
  "E409",
  "F501",
  "G602",
  "H703",
  "J804",
];

function randItem(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

// 生成单个列表类型的随机 items + 对应的 freq state
function genTradeGoods(rng, n) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const id = randItem(rng, TRADE_IDS) + "_" + i;
    items.push({
      id,
      name: id,
      category: rng() < 0.15 ? "other" : randItem(rng, TRADE_CATS),
      basePrice: Math.floor(rng() * 1000) + 1,
    });
  }
  return items;
}
function genSkills(rng, n) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const id = randItem(rng, SKILL_IDS);
    items.push({ id, name: id });
  }
  return items;
}
function genStocks(rng, n) {
  const items = [];
  for (let i = 0; i < n; i++) {
    const symbol = randItem(rng, STOCK_SYMBOLS) + (i % 5);
    items.push({
      symbol,
      name: symbol,
      industry: rng() < 0.15 ? "其他" : randItem(rng, STOCK_INDUSTRIES),
      basePrice: Math.floor(rng() * 500) + 1,
    });
  }
  return items;
}

// 根据列表类型构造 freq state
function buildState(rng, listType, items) {
  const stats = {};
  if (listType === "trade_goods") {
    const m = {};
    items.forEach((it) => (m[it.id] = Math.floor(rng() * 50)));
    stats.tradeFreq = m;
  } else if (listType === "skills") {
    const m = {};
    items.forEach((it) => (m[it.id] = Math.floor(rng() * 50)));
    stats.trainFreq = m;
  } else if (listType === "stocks") {
    const m = {};
    items.forEach((it) => (m[it.symbol] = Math.floor(rng() * 50)));
    stats.investFreq = m;
  }
  return { stats };
}

// ---------- 静态分层用例（逐层验证） ----------
const STATIC_CASES = [
  {
    name: "L1 分类顺序",
    listType: "trade_goods",
    items: [
      { id: "s1", name: "s1", category: "scrap" },
      { id: "s2", name: "s2", category: "food" },
      { id: "s3", name: "s3", category: "luxury" },
    ],
    state: { stats: {} },
    expectIds: ["s2", "s3", "s1"],
  },
  {
    name: "L2 同类内优先级",
    listType: "trade_goods",
    items: [
      { id: "rice", name: "rice", category: "food" },
      { id: "water", name: "water", category: "food" },
    ],
    state: { stats: {} },
    expectIds: ["water", "rice"],
  },
  {
    name: "L3 频次优先",
    listType: "trade_goods",
    items: [
      { id: "x", name: "x", category: "food" },
      { id: "y", name: "y", category: "food" },
    ],
    state: { stats: { tradeFreq: { x: 3, y: 9 } } },
    expectIds: ["y", "x"],
  },
  {
    name: "L4 成本升序",
    listType: "trade_goods",
    items: [
      { id: "a", name: "a", category: "food", basePrice: 80 },
      { id: "b", name: "b", category: "food", basePrice: 20 },
    ],
    state: { stats: { tradeFreq: {} } },
    expectIds: ["b", "a"],
  },
  {
    name: "L5 名称拼音保底",
    listType: "trade_goods",
    items: [
      { id: "m", name: "香蕉", category: "food" },
      { id: "n", name: "苹果", category: "food" },
    ],
    state: { stats: { tradeFreq: {} } },
    expectIds_like: true, // 仅验证 vanilla==TS 一致，不硬编码顺序
  },
  {
    name: "空数组",
    listType: "skills",
    items: [],
    state: { stats: {} },
    expectEmpty: true,
  },
  {
    name: "单元素",
    listType: "stocks",
    items: [{ symbol: "A001", name: "A001", industry: "科技", basePrice: 10 }],
    state: { stats: { investFreq: {} } },
    expectIds: ["A001"],
  },
];

// ---------- 执行比对 ----------
function compareList(listType, items, state, caseName) {
  const vConfig = Vanilla.getListDef(listType);
  const tConfig = T.BUILTIN_LIST_CONFIGS[listType];
  if (!vConfig || !tConfig) {
    throw new Error("missing config for " + listType);
  }
  const vSorted = Vanilla.sortInteractiveList(items, vConfig, state);
  const tSorted = T.sortInteractiveList(items, tConfig, state);
  assert.deepStrictEqual(
    tSorted,
    vSorted,
    `[${caseName}] ${listType} 排序结果不一致\nvanilla=${JSON.stringify(
      vSorted.map((x) => x.id || x.symbol)
    )}\nTS=${JSON.stringify(tSorted.map((x) => x.id || x.symbol))}`
  );
  passed++;
}

// 静态用例
for (const c of STATIC_CASES) {
  const vConfig = Vanilla.getListDef(c.listType);
  const tConfig = T.BUILTIN_LIST_CONFIGS[c.listType];
  const vSorted = Vanilla.sortInteractiveList(c.items, vConfig, c.state);
  const tSorted = T.sortInteractiveList(c.items, tConfig, c.state);
  if (c.expectEmpty) {
    check(Array.isArray(tSorted) && tSorted.length === 0, c.name + ": 空数组");
    continue;
  }
  if (c.expectIds) {
    const vIds = vSorted.map((x) => x.id || x.symbol);
    assert.deepStrictEqual(
      vIds,
      c.expectIds,
      `[${c.name}] vanilla 期望顺序不符: ${JSON.stringify(vIds)}`
    );
  }
  assert.deepStrictEqual(
    tSorted,
    vSorted,
    `[${c.name}] vanilla 与 TS 排序不一致`
  );
  passed++;
}

// 随机用例：每个列表类型 400 组，尺寸 0..18
const SEEDS_PER_TYPE = 400;
for (const listType of ["trade_goods", "skills", "stocks"]) {
  const gen =
    listType === "trade_goods"
      ? genTradeGoods
      : listType === "skills"
      ? genSkills
      : genStocks;
  for (let s = 0; s < SEEDS_PER_TYPE; s++) {
    const rng = mulberry32(1000 + listType.length * 7919 + s);
    const n = Math.floor(rng() * 19); // 0..18
    const items = gen(rng, n);
    const state = buildState(rng, listType, items);
    compareList(listType, items, state, "random:" + listType + "#" + s);
  }
}

// null / undefined 入参
check(
  Array.isArray(T.sortInteractiveList(null, T.BUILTIN_LIST_CONFIGS.skills, {})) &&
    T.sortInteractiveList(null, T.BUILTIN_LIST_CONFIGS.skills, {}).length === 0,
  "null 入参返回空数组"
);
check(
  Array.isArray(
    T.sortInteractiveList(undefined, T.BUILTIN_LIST_CONFIGS.skills, {})
  ) && T.sortInteractiveList(undefined, T.BUILTIN_LIST_CONFIGS.skills, {}).length === 0,
  "undefined 入参返回空数组"
);

// ---------- getSkillCategory 比对 ----------
const ALL_SKILL_IDS = Object.keys(T.SKILL_CATEGORY_MAP).concat([
  "unknown_skill_x",
  "y",
  "fishing",
  "singing",
]);
for (const id of ALL_SKILL_IDS) {
  const v = Vanilla.getSkillCategory(id);
  const t = T.getSkillCategory(id);
  assert.strictEqual(
    t,
    v,
    `getSkillCategory(${id}) 不一致: TS=${t} vanilla=${v}`
  );
  passed++;
}

// ---------- SKILL_CATEGORY_MAP 数据保真 ----------
const vMap = {};
for (const id of Object.keys(T.SKILL_CATEGORY_MAP)) {
  vMap[id] = Vanilla.getSkillCategory(id);
}
assert.deepStrictEqual(
  T.SKILL_CATEGORY_MAP,
  vMap,
  "SKILL_CATEGORY_MAP 数据保真失败"
);
passed++;

// ---------- 汇总 ----------
console.log(`sortUtils canonical: ${passed} passed, 0 failed`);
