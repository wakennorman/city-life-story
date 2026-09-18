/**
 * 数据桥：从游戏真实数据抽取地点 + 职业，输出 gamedata.json 供 3D 场景使用。
 *
 * 为什么不手抄：地点/职业数据会随游戏迭代变化（当前 R1052+）。
 * 手抄一次就永久过期。这里每次跑一遍就同步，是"系统化"而不是"打补丁"。
 *
 * 用法: node tools/extract-locations.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import vm from 'node:vm';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '../../../');           // city-life-story/
const out = resolve(here, '../src/gamedata.json');

/* ── 在一个隔离沙箱里求值游戏数据文件 ─────────────────────────────────────
   这些文件是"经典脚本"（非 ESM）：顶层 const 声明 + 少量 window 守卫。
   给一个假 window 就能安全求值，绝不需要手写 parser。
   ──────────────────────────────────────────────────────────────────────── */
/* 顶层 `const` 在 vm 里是词法绑定，不会挂到沙箱对象上。
   在同一脚本作用域内用 eval 把它们显式导出即可拿到。 */
const EXPORT_TAIL = `
;(function () {
  var names = ['LOCATIONS', 'LOCATION_FLAVOR', 'STREET_JOBS', 'JOBS', 'AMENITIES', 'GOODS',
               'LOCATION_EXTRA_ACTIONS', 'ITEMS', 'SKILLS'];
  var o = {};
  for (var i = 0; i < names.length; i++) {
    try { o[names[i]] = eval(names[i]); } catch (e) { /* 不存在就跳过 */ }
  }
  globalThis.__EXPORT__ = o;
})();`;

function evalDataFile(relPath, extraGlobals = {}) {
  const src = readFileSync(resolve(root, relPath), 'utf8') + EXPORT_TAIL;
  const fakeWindow = {};
  const sandbox = {
    window: fakeWindow,
    console,
    // 部分数据文件引用了这些运行时工具，求值时用不到，给个占位即可
    Random: { float: () => 0, int: () => 0, chance: () => false },
    Math, JSON, Date, Object, Array, String, Number, Boolean, isNaN, parseInt, parseFloat,
    ...extraGlobals,
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(src, ctx, { filename: relPath, timeout: 10000 });
  return { ctx, window: fakeWindow, data: sandbox.__EXPORT__ || {} };
}

/* ── 1. 地点 ────────────────────────────────────────────────────────────── */
const locFile = evalDataFile('src/js/data/locations.js');
const LOCATIONS = locFile.data.LOCATIONS;
if (!LOCATIONS) throw new Error('未取到 LOCATIONS');

/* ── 2. 氛围文案 ────────────────────────────────────────────────────────── */
let FLAVOR = {};
try {
  const flFile = evalDataFile('src/js/data/location_flavor.js');
  FLAVOR = flFile.data.LOCATION_FLAVOR || {};
} catch (e) {
  console.warn('[warn] location_flavor.js 求值失败，跳过：', e.message);
}

/* ── 3. 街头工作 ────────────────────────────────────────────────────────── */
let JOBS = [];
try {
  const jobFile = evalDataFile('src/js/data/jobs.js');
  JOBS = jobFile.data.STREET_JOBS || jobFile.data.JOBS || [];
} catch (e) {
  console.warn('[warn] jobs.js 求值失败，跳过：', e.message);
}

/* ── 3b. 服务设施（amenities）────────────────────────────────────────────
   政务大厅 / 法院 / 人才市场这类地点在 jobs.js 里是空的 —— 它们的玩法内容
   全在 amenities.js（食堂、澡堂、诊所、办事窗口……）。
   只抽 jobs 的话，这些地点在 3D 里会变成"什么都没有的地方"。 */
let AMENITIES = [];
try {
  const amFile = evalDataFile('src/js/data/amenities.js');
  AMENITIES = amFile.data.AMENITIES || [];
} catch (e) {
  console.warn('[warn] amenities.js 求值失败，跳过：', e.message);
}

/* ── 3c. 地点特色行动 ──────────────────────────────────────────────────── */
let EXTRA_ACTIONS = [];
try {
  // actions.js 顶层会往 MECHANICS 注册表登记，求值时给个空实现即可
  const acFile = evalDataFile('src/js/data/actions.js', {
    MECHANICS: { register: () => {}, get: () => null, all: () => [], list: () => [] },
    StateManager: { addMessage: () => {} },
  });
  EXTRA_ACTIONS = acFile.data.LOCATION_EXTRA_ACTIONS || [];
} catch (e) {
  console.warn('[warn] actions.js 求值失败，跳过：', e.message);
}

/* ── 3e. 地点行动门禁（actions_extra.js） ────────────────────────────────
   图书馆 / 娱乐城这类地点在 jobs.js、amenities.js、actions.js 里全是空的，
   它们的玩法写在 phase1/actions_extra.js 的 LOCATION_ACTION_RULES 里 ——
   这是一张"行动 id → 允许在哪些地点执行"的门禁表。
   不抽它，图书馆在 3D 里就是一片空地，但它在游戏里其实有 2 个专属行动。  */
let EXTRA_RULES = {};
let EXTRA_META = {};
try {
  const src = readFileSync(resolve(root, 'src/js/phase1/actions_extra.js'), 'utf8');

  /* 只取字面量：括号配平后单独 eval。
     整个文件 2400 行、满是 handler 闭包与 StateManager 调用，整体求值会炸。 */
  const litStart = src.indexOf('var LOCATION_ACTION_RULES');
  if (litStart >= 0) {
    const eq = src.indexOf('{', litStart);
    let depth = 0, end = -1, inStr = null;
    for (let i = eq; i < src.length; i++) {
      const ch = src[i];
      if (inStr) { if (ch === '\\') i++; else if (ch === inStr) inStr = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
      if (ch === '{') depth++;
      else if (ch === '}') { depth--; if (!depth) { end = i + 1; break; } }
    }
    if (end > 0) EXTRA_RULES = vm.runInNewContext('(' + src.slice(eq, end) + ')', {});
  }

  /* 行动名称/描述没有独立的表，它们散在 actions.push({...}) 里。
     按 "id: \"xxx\"," 定位后向后读一个窗口取字段 —— 与 payHint 同一套静态取字法。 */
  const re = /id:\s*["']([a-z0-9_]+)["']\s*,/g;
  let m;
  while ((m = re.exec(src))) {
    const block = src.slice(m.index, m.index + 700);
    const name = /name:\s*["']([^"']+)["']/.exec(block);
    if (!name) continue;
    const desc = /desc:\s*["']([^"']+)["']/.exec(block);
    const icon = /icon:\s*["']([^"']+)["']/.exec(block);
    const ap = /apCost:\s*(\d+)/.exec(block);
    const pay = /payEstimate:\s*["']([^"']+)["']/.exec(block);
    const cost = /costEstimate:\s*(\d+)/.exec(block);
    EXTRA_META[m[1]] = {
      id: m[1], name: name[1],
      desc: desc ? desc[1] : '',
      icon: icon ? icon[1] : '',
      apCost: ap ? Number(ap[1]) : 0,
      payEstimate: pay ? pay[1] : null,
      costEstimate: cost ? Number(cost[1]) : null,
    };
  }
  console.log(`[ok] 地点行动门禁 ${Object.keys(EXTRA_RULES).length} 条规则 / ${Object.keys(EXTRA_META).length} 条行动元数据`);
} catch (e) {
  console.warn('[warn] actions_extra.js 抽取失败，跳过：', e.message);
}

/* ── 3f. 违法行为（illegal_actions.js）──────────────────────────────────
   娱乐城 / 批发市场这类地点的"地下玩法"在这里：洗脚城灰服务、黑市倒卖……
   这张表自带 location 字段，是第六个源。                                    */
let ILLEGAL = [];
try {
  const src = readFileSync(resolve(root, 'src/js/core/illegal_actions.js'), 'utf8');
  const start = src.indexOf('var ILLEGAL_ACTIONS');
  if (start >= 0) {
    const lb = src.indexOf('[', start);
    let depth = 0, end = -1, inStr = null;
    for (let i = lb; i < src.length; i++) {
      const ch = src[i];
      if (inStr) { if (ch === '\\') i++; else if (ch === inStr) inStr = null; continue; }
      if (ch === '"' || ch === "'" || ch === '`') { inStr = ch; continue; }
      if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (!depth) { end = i + 1; break; } }
    }
    // 数组里全是纯字面量（无函数），可以安全求值
    if (end > 0) ILLEGAL = vm.runInNewContext(src.slice(lb, end), {});
  }
  console.log(`[ok] 违法行为 ${ILLEGAL.length} 条，覆盖 ${new Set(ILLEGAL.map(a => a.location)).size} 个地点`);
} catch (e) {
  console.warn('[warn] illegal_actions.js 抽取失败，跳过：', e.message);
}

const actionsExtraByLocation = {};
for (const [aid, rule] of Object.entries(EXTRA_RULES)) {
  if (!rule || !Array.isArray(rule.locations)) continue;
  const meta = EXTRA_META[aid] || { id: aid, name: aid, desc: '', icon: '', apCost: 0 };
  for (const loc of rule.locations) {
    (actionsExtraByLocation[loc] ||= []).push({ ...meta, hint: rule.hint || '' });
  }
}

const illegalByLocation = {};
for (const a of ILLEGAL) {
  if (!a || !a.location) continue;
  (illegalByLocation[a.location] ||= []).push({
    id: a.id, name: a.name, icon: a.icon || '',
    desc: a.desc || '',
    apCost: a.apCost ?? 0,
    rewardRange: a.rewardRange || null,
    catchProb: a.catchProb ?? null,
    moralityDelta: a.moralityDelta ?? null,
    penalty: a.penalty || null,
  });
}

/* ── 3g. 货品分类中文名（wiki.js::_goodCatLabel）─────────────────────────
   locations.js 的 specialties / priceMod 混用两种键：有的是货品 id（如 pork），
   有的是分类名（如 clothing）。界面上直接显示英文键很难看，
   所以把游戏自己的分类中文表也抽出来 —— 而不是在 3D 里另抄一份。        */
let CAT_LABELS = {};
try {
  const src = readFileSync(resolve(root, 'src/js/ui/wiki.js'), 'utf8');
  const at = src.indexOf('function _goodCatLabel');
  if (at >= 0) {
    const brace = src.indexOf('{', at);
    const close = src.indexOf('}', brace);
    const body = src.slice(brace, close + 1);
    for (const m of body.matchAll(/(\w+)\s*:\s*"([^"]+)"/g)) CAT_LABELS[m[1]] = m[2];
  }
  console.log(`[ok] 货品分类中文名 ${Object.keys(CAT_LABELS).length} 条:`, CAT_LABELS);
} catch (e) {
  console.warn('[warn] wiki.js 分类名抽取失败，跳过：', e.message);
}

/* 把 specialties / priceMod 的键解析成中文显示名：
   先当货品 id 查，查不到再当分类名查，都没有就原样保留。 */
function resolveKeys(keys) {
  return keys.map((k) => {
    const g = goodsById[k];
    return g ? g.name : CAT_LABELS[k] || k;
  });
}

/* ── 4. 组装输出 ────────────────────────────────────────────────────────── */
const jobsByLocation = {};
for (const j of JOBS) {
  if (!j || !j.location) continue;
  (jobsByLocation[j.location] ||= []).push({
    id: j.id,
    name: j.name,
    icon: j.icon || '',
    desc: j.desc || '',
    startupCost: j.startupCost ?? 0,
    risk: j.risk || null,
    payHint: payHint(j),
  });
}

const amenitiesByLocation = {};
for (const a of AMENITIES) {
  if (!a || !a.loc) continue;
  (amenitiesByLocation[a.loc] ||= []).push({
    id: a.id,
    name: a.name,
    icon: a.icon || '',
    type: a.type || 'misc',
    tier: a.tier ?? 2,
    cost: a.cost ?? 0,
    ap: a.ap ?? 0,
    desc: a.desc || '',
    primary: a.primary || {},
    junkFood: !!a.junkFood,
    lateNight: !!a.lateNight,
  });
}

/** 从 payCalc 源码里抠出数字范围，给 3D 场景做「收益提示」用。
 *  不执行函数（依赖运行时 state），只做静态字数提取。 */
function payHint(job) {
  if (typeof job.payCalc !== 'function') return null;
  const s = job.payCalc.toString();
  const nums = [...s.matchAll(/(\d+(?:\.\d+)?)/g)]
    .map(m => Number(m[1]))
    .filter(n => n >= 5 && n <= 2000);
  if (!nums.length) return null;
  return { min: Math.min(...nums), max: Math.max(...nums), text: s.slice(0, 220) };
}

const extraActionsByLocation = {};
for (const a of EXTRA_ACTIONS) {
  if (!a || !a.location) continue;
  (extraActionsByLocation[a.location] ||= []).push({
    id: a.id,
    name: a.name,
    icon: a.icon || '',
    desc: a.desc || '',
    apCost: a.apCost ?? 0,
    payEstimate: a.payEstimate || null,
  });
}

/* ── 3d. 货品（交易系统）────────────────────────────────────────────────── */
let GOODS = [];
try {
  const gFile = evalDataFile('src/js/data/goods.js');
  GOODS = gFile.data.GOODS || [];
} catch (e) {
  console.warn('[warn] goods.js 求值失败，跳过：', e.message);
}

const goodsById = {};
for (const g of GOODS) {
  if (!g || !g.id) continue;
  goodsById[g.id] = g;
}

const out9 = {};
const allLocations = [];
for (const [key, L] of Object.entries(LOCATIONS)) {
  if (!L || typeof L !== 'object' || !L.id) continue;
  const flavor = FLAVOR[key] || FLAVOR[L.id] || [];
  const jobs = jobsByLocation[L.id] || jobsByLocation[key] || [];
  const amenities = amenitiesByLocation[L.id] || amenitiesByLocation[key] || [];
  const actions = extraActionsByLocation[L.id] || extraActionsByLocation[key] || [];
  const actionsExtra = actionsExtraByLocation[L.id] || actionsExtraByLocation[key] || [];
  const illegal = illegalByLocation[L.id] || illegalByLocation[key] || [];

  /* 交易：把货品的 buyLocations/sellLocations 反查成"这个地点能买卖什么"，
     并用地点自带的 priceMod 算出本地价。这样菜市场/二手市场这类
     没有 jobs 的地点也能说出自己真正的用处。 */
  const priceMod = L.priceMod || {};
  const buy = [], sell = [];
  for (const g of GOODS) {
    if (!g || !g.id) continue;
    const mod = priceMod[g.id] ?? 1;
    const price = +(g.basePrice * mod).toFixed(1);
    const item = { id: g.id, name: g.name, unit: g.unit || '', price, category: g.category || '' };
    if (Array.isArray(g.buyLocations) && g.buyLocations.includes(L.id)) buy.push(item);
    if (Array.isArray(g.sellLocations) && g.sellLocations.includes(L.id)) sell.push(item);
  }
  buy.sort((a, b) => a.price - b.price);
  sell.sort((a, b) => b.price - a.price);

  out9[key] = {
    id: L.id,
    name: L.name,
    icon: L.icon || '',
    desc: L.desc || '',
    type: L.type || 'service',
    wealthTier: L.wealthTier ?? 2,
    footfall: L.footfall ?? 0.6,
    specialties: L.specialties || [],
    specialtyLabels: resolveKeys(L.specialties || []),
    /* priceMod 原样带出：有些地点（二手市场/郊区）声明了品种与价格系数，
       但 goods.js 里没有任何货品路由到它 —— 这是地点数据与货品数据脱节，
       带上 priceMod 才能在界面上把这件事说清楚，而不是显示成"什么都没有"。
       同时给出 [{key,label,value}] 形式，界面直接渲染，不用在 UI 层再查一次表。 */
    priceMod: L.priceMod || {},
    priceModList: Object.entries(L.priceMod || {}).map(([key, value]) => {
      const g = goodsById[key];
      return { key, value, label: g ? g.name : CAT_LABELS[key] || key };
    }),
    dailyProbability: L.dailyProbability ?? null,
    flavor,
    jobs,
    amenities,
    actions,
    actionsExtra,
    illegal,
    buy,
    sell,
    vendingNote: L.vendingNote || '',
  };
  allLocations.push(key);
}

const payload = {
  generatedAt: new Date().toISOString(),
  source: 'src/js/data/{locations,location_flavor,jobs,amenities,actions,goods}.js + src/js/phase1/actions_extra.js + src/js/core/illegal_actions.js',
  count: allLocations.length,
  categoryLabels: CAT_LABELS,
  locations: out9,
};

writeFileSync(out, JSON.stringify(payload, null, 2), 'utf8');

console.log(`[ok] 抽取 ${allLocations.length} 个地点 → ${out}`);
console.log(`[ok] 职业 ${JOBS.length} 条，覆盖 ${Object.keys(jobsByLocation).length} 个地点`);
console.log(`[ok] 服务设施 ${AMENITIES.length} 条，覆盖 ${Object.keys(amenitiesByLocation).length} 个地点`);
console.log(`[ok] 特色行动 ${EXTRA_ACTIONS.length} 条，覆盖 ${Object.keys(extraActionsByLocation).length} 个地点`);
console.log(`[ok] 氛围文案 ${Object.values(FLAVOR).reduce((a, v) => a + v.length, 0)} 条 / ${Object.keys(FLAVOR).length} 个地点`);
const types = {};
for (const v of Object.values(out9)) types[v.type] = (types[v.type] || 0) + 1;
console.log('[ok] 类型分布:', types);
const tiers = {};
for (const v of Object.values(out9)) tiers[v.wealthTier] = (tiers[v.wealthTier] || 0) + 1;
console.log('[ok] 财富层级分布:', tiers);
console.log(`[ok] 地点行动（actions_extra）${Object.values(actionsExtraByLocation).reduce((a, v) => a + v.length, 0)} 条，覆盖 ${Object.keys(actionsExtraByLocation).length} 个地点`);
console.log(`[ok] 违法行为（illegal_actions）${Object.values(illegalByLocation).reduce((a, v) => a + v.length, 0)} 条，覆盖 ${Object.keys(illegalByLocation).length} 个地点`);
const empty = Object.values(out9).filter(v =>
  !v.jobs.length && !v.amenities.length && !v.actions.length &&
  !v.actionsExtra.length && !v.illegal.length && !v.buy.length && !v.sell.length);
console.log(`[ok] 货品 ${GOODS.length} 条`);
const trade = Object.values(out9).filter(v => v.buy.length || v.sell.length).length;
console.log(`[ok] 可交易地点 ${trade} 个`);
console.log(`[ok] 无任何内容的空地: ${empty.length}${empty.length ? ' → ' + empty.map(v => v.name).join('/') : ''}`);
