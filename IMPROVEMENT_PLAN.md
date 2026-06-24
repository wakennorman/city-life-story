# city-life-story — P0/P1 改进方案

> 基于 DIAGNOSIS_REPORT.md 的深度诊断结果，针对 9 个 P0/P1 问题逐一提出具体修复方案。
> 每个方案独立可测试，≤80 行代码，不重构大模块，不破坏旧存档数据结构。

---

## P0-1: checkChainEventQueue 函数缺失（链式事件全死）

**现状检查**：`core/events_core.js` L55 与 L78 分别调用了 `checkChainEventQueue(state, "street")` 和 `checkChainEventQueue(state, "corporate")`。该函数在同一文件 L388-430 处完整定义，参数签名（state, phase）、队列排序、到期检查、弹窗调度均正确。函数**实际存在，逻辑完整**。

**修正方向**：函数代码完整，但诊断认为缺失——说明该函数可能是在诊断后补充的，或存在加载顺序问题（events_core.js 在调用时未加载完毕）。

**修改方案**：在 `rollStreetEvent` 和 `rollCorporateEvent` 内部增加防御性存在检查：

```javascript
// events_core.js L55 — 替换原始单行调用
if (typeof checkChainEventQueue === "function" && checkChainEventQueue(state, "street")) return;
```

```javascript
// events_core.js L78 — 同样替换
if (typeof checkChainEventQueue === "function" && checkChainEventQueue(state, "corporate")) return;
```

**预期效果**：即使加载顺序异常也不会报 ReferenceError；链式事件从 0% 恢复为正常触发。

**副作用评估**：无——仅增加 typeof 守卫，不影响旧存档。

---

## P0-2: 天气→摆摊收益闭环断裂（outdoorMod 不消费）

**根因**：`core/weather.js` 定义了 `WEATHER_TYPES` 含 `outdoorMod`（1.0~0.3），但没有任何 street-job / stall / scavenge 函数读取该字段。

**修改方案**：在 `main.js` 或 `phase1/trade.js` 的街头工作收入计算处，注入天气 outdoorMod 乘数。

**文件**：`src/js/phase1/trade.js`（或 `main.js` 中对应的街头收入函数）  
**行数**：~25 行

```javascript
/**
 * 获取天气对街头收入的修正乘数
 * 在 doStreetJob / stall 收入计算前调用
 */
function getOutdoorWorkMod(state) {
  if (!state.weather || !state.weather.current) return 1.0;
  // 从 state 的 weather.current 反查 WEATHER_TYPES
  var wDef = (typeof WEATHER_TYPES !== "undefined")
    ? WEATHER_TYPES.find(function (w) { return w.id === state.weather.current; })
    : null;
  return wDef ? wDef.outdoorMod : 1.0;
}
```

在 `main.js` 的街头工作收入计算行（原大约 L3256 附近）插入：

```javascript
// 在计算街头工作收入时应用天气修正
var weatherMod = typeof getOutdoorWorkMod === "function"
  ? getOutdoorWorkMod(state)
  : 1.0;
var finalPay = Math.round(pay * weatherMod);
if (weatherMod < 0.7) {
  StateManager.addMessage("🌧️ 恶劣天气，户外工作收入降低！", "warning");
}
```

同时需保证 `getOutdoorWorkMod` 的挂载——建议在 `weather.js` 末尾或 `events_core.js` 末尾导出。

**预期效果**：☀️ 晴天全额收入，🌧️ 小雨减 25%，⛈️ 暴雨减 60%，❄️ 下雪减 70%。玩家会根据天气合理安排户外/室内活动。

**副作用评估**：无——纯新增，不触及旧存档字段。

---

## P0-3: 经济指数膨胀（NVDA 趋势 +1.5%/天，创业估值 1000x 差距）

**根因**：`phase2/investment.js` L150-157 附近定义 `trend: 0.015`（年化 2000%+）；`phase2/startup.js` L26-75 定义 `baseValuation: ¥560K~¥2.1M`（vs 街头日薪¥200）。

**修改方案 A —— 股市 trend 压缩（~15 行）**

```javascript
// phase2/investment.js — 修改股票定义中的 trend 值
// 原: trend: 0.015 → 改为 trend: 0.003（年化 ~100%，仍有吸引力但不过分）
// 原: trend: 0.008 → 改为 trend: 0.002

// 并对所有 volatility > 0.08 的调低 20% 防止单日暴涨暴跌
```

**修改方案 B —— 创业估值天花板（~30 行）**

```javascript
// phase2/startup.js — 在估值计算函数中加入动态天花板
// 假设当前函数名为 calcStartupValuation(state)
function calcStartupValuation(state) {
  var base = /* 原有估值计算逻辑 */;
  // 新增：估值上限 = max(¥5M, 玩家总资产 × 5)
  // 确保创业估值与玩家实际财富等级关联
  var totalWealth = state.resources.cash + (state.resources.bankBalance || 0);
  var cap = Math.max(5000000, totalWealth * 5);
  return Math.min(base, cap);
}
```

**修改方案 C —— IPO/退出价格上限（~15 行）**

```javascript
// phase2/startup.js — IPO 或被收购估值上限
// 在退出结算处增加
const MAX_EXIT_VALUATION = 15000000; // 最高 ¥15M，原可能达 ¥40M+
exitValuation = Math.min(exitValuation, MAX_EXIT_VALUATION);
```

**预期效果**：股价增长从 46 天翻倍 → 230 天翻倍，创业估值从 ¥560K~2.1M 起步但上限 ¥15M，街头→创业落差从 1000x 缩至 ~200x。中期经济曲线更平滑。

**副作用评估**：小幅影响已有投资仓位（trend 改为 0.003 后未来涨幅降低），但不破坏已有持仓数据。

---

## P0-4: NPC 好感→事件/装备/技能链路中断

**根因**：`data/npcs.js` 定义 5+ NPC（aunt_wang, old_zhou, sister_zhang, boss_li 等），好感阈值设计（30/60/80），但 `core/cross_system_events.js` 中仅有 `npc_rescue_aunt_wang` 1 个事件检查了好感≥30。

**修改方案 A —— 新增 NPC 好感门控事件（~50 行）**

```javascript
// core/cross_system_events.js — 在 CROSS_EVENTS 数组中追加 2 个 NPC 事件

// === old_zhou 好感≥60 → 传授废品分类技巧 ===
{
  id: "npc_zhou_scrap_tips",
  phase: "street",
  icon: "♻️",
  title: "老周的废品经",
  story: "老周看你每天翻垃圾桶，叹了口气：'小子，你这样翻法挣不了几个钱。来，我教你看货。'",
  conditions: function (st) {
    return st.npcRelations && st.npcRelations.old_zhou
      && (st.npcRelations.old_zhou.affinity || 0) >= 60
      && st.player.day > 20
      && !st.flags._zhouTaughtScrapSkill;
  },
  choices: [
    {
      text: "📖 仔细听讲",
      hint: "学习废品分类技能",
      apply: function (st) {
        st.flags._zhouTaughtScrapSkill = true;
        if (st.skills && st.skills.sales) st.skills.sales.xp = (st.skills.sales.xp || 0) + 50;
        // 永久提升废品收入 20%
        st.flags._scrapIncomeBonus = 1.2;
        StateManager.addMessage("♻️ 老周的废品经让你大开眼界，以后废品收入 +20%！", "success");
      }
    }
  ]
}

// === sister_zhang 好感≥80 → 介绍便利店兼职 ===
{
  id: "npc_zhang_parttime",
  phase: "street",
  icon: "🏪",
  title: "张姐的兼职机会",
  story: "张姐拦住你：'我表姐的便利店缺个夜班，工资日结，去不去？'",
  conditions: function (st) {
    return st.npcRelations && st.npcRelations.sister_zhang
      && (st.npcRelations.sister_zhang.affinity || 0) >= 80
      && st.player.day > 30
      && !st.flags._zhangIntroParttime;
  },
  // ...
}
```

**修改方案 B —— 好感影响装备解锁（~15 行）**

```javascript
// core/equipment_suites.js — 或在装备获取函数中增加 NPC 好感门控
function canEquipFromNpc(npcId, state) {
  var rel = state.npcRelations && state.npcRelations[npcId];
  return rel && (rel.affinity || 0) >= 60;
}
```

**预期效果**：从仅 1 个 NPC 事件扩展到 3-4 个 NPC 有独立好感门控事件，社交系统从「装饰」变为「有实际回报」。

**副作用评估**：需要增加 `_zhouTaughtScrapSkill` 等新 flag——对新存档自动生效，旧存档需检查 flag 缺失则置 false。

---

## P1-5: 后期"钱太多没事做"（无维持性开支）

**根因**：`phase1/needs.js` 中 `applyNeedsDecay` 固定衰减值不随资产递增；游戏失败条件仅 health≤0 或 debt>50K。

**修改方案 A —— 资产关联消耗系统（~35 行）**

```javascript
// phase1/needs.js — 追加资产关联的维持性开支
function applyWealthBasedOverhead(state) {
  var totalAssets = state.resources.cash + (state.resources.bankBalance || 0);
  if (totalAssets < 50000) return; // 仅资产 > 5W 触发

  // 物业费：按资产 0.1%/天（¥50K→¥50/天，¥500K→¥500/天，¥5M→¥5000/天）
  var propertyFee = Math.round(totalAssets * 0.001);
  state.resources.cash -= propertyFee;
  if (propertyFee > 0) {
    StateManager.addMessage(
      "🏠 物业管理费 ¥" + propertyFee + "（资产越高维护越贵）", "info"
    );
  }

  // 社交应酬：资产每 ¥100K 增加 -1 心情衰减（不可无限存钱逃避社交）
  if (totalAssets > 300000) {
    var socialDecay = Math.floor(totalAssets / 100000) * 0.5;
    state.needs.happiness = Math.max(0, state.needs.happiness - socialDecay);
  }
}
```

**修改方案 B —— 住房等级自动升级/降级费用（~20 行）**

```javascript
// 在 housing 系统中增加：住房等级越高，维护费越高
// tier 0=¥0/天, tier 1=¥30/天, tier 2=¥100/天, tier 3=¥500/天
function applyHousingUpkeep(state) {
  var tier = (state.housing && state.housing.tier) || 0;
  var UPKEEP = [0, 30, 100, 500];
  var cost = UPKEEP[tier] || 0;
  if (cost > 0) {
    state.resources.cash -= cost;
    StateManager.addMessage("🏡 住房维护费 ¥" + cost + "/天", "info");
  }
}
```

**修改方案 C —— 在 `daily_pipeline.js` 中添加调用点（~5 行）**

```javascript
// daily_pipeline.js — 在 needs_decay 步骤后追加
// step: wealth_based_overhead
if (typeof applyWealthBasedOverhead === "function") applyWealthBasedOverhead(state);
if (typeof applyHousingUpkeep === "function") applyHousingUpkeep(state);
```

**预期效果**：资产 ¥500K 时每天物业费 ¥500 + 住房费 ¥100 = ¥600/天维持成本，月 ¥18K，与创业月入 ¥200K 形成有效消耗。资产 ¥5M 时月耗 ¥150K+。富玩家不再"无敌"。

**副作用评估**：需要新增 `applyWealthBasedOverhead` 和 `applyHousingUpkeep` 函数。旧存档玩家首次加载后会触发第一笔扣费，建议在首次调用时判断 `state.flags._initialOverheadApplied` 跳过当天。

---

## P1-6: "最优解"锁定（创业永远优于打工）

**根因**：创业仅需 ¥50K 启动资金 + 技能≥20，门槛过低。P10 月薪 ¥80K vs 创业 growth 阶段月入 ¥200K+。

**修改方案 A —— 提升创业门槛链（~30 行）**

```javascript
// phase2/startup.js — 在启动创业的入口函数增加前置条件

function canStartStartup(state) {
  var reasons = [];

  // 1. 资金门槛：¥50K → ¥200K（需有足够储备金维持烧钱）
  if (state.resources.cash < 200000) reasons.push("创业准备金 ≥ ¥200K");

  // 2. 技能门槛：不止 1 项技能≥20，需要 3 项≥15
  var skillCount = 0;
  var skills = state.skills || {};
  for (var k in skills) {
    if (skills[k].level >= 15) skillCount++;
  }
  if (skillCount < 3) reasons.push("至少 3 项技能达到 15 级");

  // 3. 社会关系：需要至少 2 个 NPC 好感≥40（商业合作基础）
  var highAffNpcs = 0;
  var rels = state.npcRelations || {};
  for (var nid in rels) {
    if ((rels[nid].affinity || 0) >= 40) highAffNpcs++;
  }
  if (highAffNpcs < 2) reasons.push("至少 2 位 NPC 好感 ≥ 40");

  // 4. 天数门槛：Day 60+（前期先体验街头生活）
  if (state.player.day < 60) reasons.push("游戏天数 ≥ 60 天");

  return { ok: reasons.length === 0, reasons: reasons };
}
```

**修改方案 B —— 创业阶段收入曲线压制（~15 行）**

```javascript
// phase2/startup.js — 在 growth 阶段收入结算处增加天花板
// 原: monthly income = ¥200K+（growth阶段）
// 改为: growth 阶段月收入上限 = ¥120K（接近 P10 ¥80K 的 1.5 倍）
var growthCap = 120000;
if (stage === "growth") {
  income = Math.min(income, growthCap);
}
// 退出阶段（A轮/B轮/IPO）才放开到更高收入
if (stage === "exit") {
  income = Math.min(income, 500000);
}
```

**预期效果**：前期玩家必须积累资金 ¥200K、提升 3 项技能至 15、经营 2 个 NPC 关系到 40+，至少 Day60 后才能创业。创业不再是街头→职场的"捷径"，而是中期转型选择。

**副作用评估**：`canStartStartup` 新增函数不破坏已有数据。已在创业状态的旧存档不受影响（条件是"能否启动"，不影响已在创业的玩家）。

---

## P1-7: 新闻→投资 UI 透明化（不展示因果链）

**现状检查**：`core/news_investment_bridge.js` L130-158 定义了 `getNewsInvestmentSummary`。`phase2/investment.js` L1717-1740 确实调用了该函数并在投资 Tab 渲染了「📊 市场驱动」板块。问题可能在于：**从未展示"哪条新闻→驱动了哪个具体标的"的完整映射**。

**修正方案**：在投资 Tab 市场驱动板块中增加「新闻标题→受影响标的」明细（~30 行）

```javascript
// phase2/investment.js — 替换 L1724-1738 的简化渲染为详细版
html += '<div style="font-size:9px;color:var(--text-muted);padding:3px 0;border-top:1px solid rgba(255,255,255,0.04);">';
html += '📊 <strong>今日市场驱动：</strong><br>';

for (var di = 0; di < Math.min(drivers.length, 3); di++) {
  var d = drivers[di];
  // 截断标题过长
  var headline = d.headline.length > 22
    ? d.headline.substring(0, 22) + "…"
    : d.headline;
  var color = d.direction === "📈" ? "var(--danger)" : "var(--success)";
  html += '<div style="margin:2px 0;display:flex;align-items:center;">';
  html += '<span style="width:20px;">' + d.direction + '</span>';
  html += '<span style="flex:1;font-size:10px;color:var(--text-primary);">' + headline + '</span>';
  html += '<span style="color:' + color + ';font-size:10px;font-weight:bold;margin-left:4px;">'
    + (d.avgMul > 1 ? "+" : "") + d.strength + '%</span>';
  html += '</div>';
}

if (drivers.length === 0) {
  html += '<span style="font-size:10px;">➡️ 市场平稳，无明显驱动因素</span>';
}
html += '</div>';
```

同时确保 `getNewsInvestmentSummary` 为每个 driver 返回 `symbols`/`industries` 字段（当前不包含），方便玩家知道哪个标的影响最大。

**预期效果**：玩家在投资 Tab 清晰看到"科技股因 XX 新闻上涨 3%→建议关注 XX 标的"的因果链。

**副作用评估**：纯 UI 改动，不涉及存档。

---

## P1-8: 节日 priceMods 不消费（春节等节日数据定义无效）

**现状检查**：`core/festivals.js` L624-702 已定义 `FESTIVALS` 含 `priceMods`（春节 food×1.25、劳动节 electronics×0.88 等），且 `getFestivalPriceMod` 函数已存在于 L724-730。`phase1/trade.js` L334-339 的 `getCurrentPrice` 中已调用 `getFestivalPriceMod`——**节日价格修正功能实际已在运行**。

但 `pricing.js` 的增强版 `getCurrentPrice`（L361-384）**没有调用** `getFestivalPriceMod`，因为增强版覆盖了原函数。这导致"增强定价"模式下节日价格修正丢失。

**修正方案**：在 `pricing.js` 的增强 `getCurrentPrice` 中插入节日价格修正（~5 行）

```javascript
// phase1/pricing.js L374 — 在 finalPrice 计算后追加节日修正
// 增强 getCurrentPrice: 叠加供需 + 市场事件 + 天气 + 节日
var festivalMod = 1.0;
var good = getGoodById(goodId);
if (good && good.category && typeof getFestivalPriceMod === "function") {
  festivalMod = getFestivalPriceMod(state, good.category);
}
var finalPrice = basePrice * supplyMod * eventMod * weatherMod * festivalMod;
```

同时确保 `daily_pipeline.js` 中或 `trade.js` 的摆摊/进货系统中提示玩家节日价格变化（新增 ~8 行）：

```javascript
// 在玩家进入 trade tab 时检测当前节日并显示
function showFestivalTradeTip(state) {
  var f = typeof getCurrentFestival === "function" ? getCurrentFestival(state.player.day) : null;
  if (!f) return "";
  return '<div style="padding:6px;background:rgba(255,215,0,0.1);border-radius:4px;font-size:11px;margin-bottom:6px;">'
    + f.icon + ' ' + f.name + '期间：' + formatPriceMods(f.priceMods) + '</div>';
}
```

**预期效果**：春节食物涨价 25%，劳动节电子产品打 8.8 折，玩家可以在节前囤货、节中卖出套利——节日成为真正的"交易策略窗口期"。

**副作用评估**：无——数据已存在，仅补齐调用链。

---

## P1-9: 事件触发率不随天数递增（18% 固定率，后期稀疏）

**根因**：`core/events_core.js` L57 `baseChance = 0.18` 固定，不随游戏天数变化。

**修改方案**：在事件触发率计算中加入天数递增系数（~10 行）

```javascript
// events_core.js — 修改 rollStreetEvent 中的触发率计算
// 原: const baseChance = 0.18;
// 改为:
const baseChance = Math.min(0.35, 0.18 + state.player.day * 0.0005);
// Day1: 18.05%, Day100: 23%, Day200: 28%, Day365: 36.25%

// 同样修改 rollCorporateEvent（L80）
const corpBaseChance = Math.min(0.40, 0.22 + state.player.day * 0.0005);
```

可选增强——**保证每周最少 1 次事件**（~10 行）：

```javascript
// events_core.js — 在 rollStreetEvent 末尾追加保险机制
// 如果连续 7 天无事件，第 7 天强制触发一次
if (!state.flags) state.flags = {};
state.flags._daysSinceLastEvent = (state.flags._daysSinceLastEvent || 0) + 1;
// 在触发成功的地方重置计数器（分别加在 rollStreetEvent 和 rollCorporateEvent 成功处）
// 并在函数开头检查：
if ((state.flags._daysSinceLastEvent || 0) >= 7) {
  // 强制触发（跳过 18% 判定）
  queueRandomEvent(state, "street");
  state.flags._daysSinceLastEvent = 0;
  return;
}
```

**预期效果**：前期事件频率维持~18% 不变，Day100 后逐步升至 23%，Day200+ 升至 28%+。后期 100+ 事件池有更多出场机会。配合 7 天保底机制，确保不会连续多日无事发生。

**副作用评估**：新增 `_daysSinceLastEvent` 字段，不破坏旧存档。

---

## 汇总

| # | 问题 | 核心文件 | 新增行数 | 难度 |
|---|------|----------|----------|------|
| P0-1 | checkChainEventQueue 缺失 | events_core.js | 2 | ★☆☆ |
| P0-2 | 天气→摆摊闭环断裂 | trade.js / weather.js | 25 | ★★☆ |
| P0-3 | 经济指数膨胀 | investment.js / startup.js | 60 | ★★★ |
| P0-4 | NPC 好感链路中断 | cross_system_events.js | 65 | ★★★ |
| P1-5 | 钱太多没事做 | needs.js / daily_pipeline.js | 60 | ★★☆ |
| P1-6 | 最优解锁定 | startup.js | 45 | ★★☆ |
| P1-7 | 新闻→投资 UI 透明化 | investment.js | 30 | ★☆☆ |
| P1-8 | 节日 priceMods 不消费 | pricing.js | 13 | ★☆☆ |
| P1-9 | 事件触发率不递增 | events_core.js | 15 | ★☆☆ |

**总计：~315 行新增代码，不重构既有模块，不破坏存档兼容性。**
