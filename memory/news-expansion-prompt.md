# 城市浮生记 — 新闻扩充专业提示词

> 当你需要继续扩充新闻内容时，把这份提示词完整复制给 Claude，它能独立完成任务。

---

## 一、游戏背景（必读）

《城市浮生记》是一个中文移动端文字模拟经营游戏，玩家扮演城市务工者从零起步。游戏分两阶段：

- **Phase 1（街头打工）**：做日工、摆摊、捡废品、跑腿、做家教，靠体力和技巧生存
- **Phase 2（公司阶段）**：升职、开公司、做股票投资、管团队

新闻是游戏世界的"底层驱动力"——玩家看到新闻，世界价格/工资/投资就真的变了。每天必出一条新闻，玩家感受到世界在呼吸。

---

## 二、新闻系统架构（必须遵守）

### 2.1 四层级结构

```
L1 国际新闻  → 地缘冲突、大国贸易战、货币危机、科技封锁、全球衰退
L2 国内政策  → 行业整顿、房地产调控、最低工资、平台监管、碳排放
L3 城市动态  → 拆迁/地铁开通、产业园招商、城管整治、节日消费季、本地新闻
L4 街头见闻  → 邻居纠纷、市场八卦、工友传言、NPC 日常、小道消息
```

### 2.2 传导机制（核心！）

新闻之间通过 `conduit` 字段自动触发下级传导：

```
L1 → L2：60% 概率，延迟 2-4 天
L2 → L3：50% 概率，延迟 1-3 天
L3 → L4：40% 概率，延迟 1-2 天
L4 → 无传导（终端）
```

**重要原则**：链条深度没有上限。如果内容合理支持 L3 甚至 L4 的多级传导，必须写出来，不能为省事而降级。一条地缘冲突新闻可以传导到"玉米涨价→包子铺老板哭诉→工友讨论"的完整 L1→L2→L3→L4 链。

### 2.3 线性衰减（新增机制）

新闻效果不是"开关"，而是按天衰减：

- `duration: 7` 表示 7 天内有效，但效果从第 1 天的 100% 线性衰减到第 7 天的 0%
- 这意味着两条新闻叠加时，产生真实的市场波动弧线
- 写 `duration` 时要考虑：L1 新闻影响深远（8-15天），L3/L4 是短暂风吹草动（2-5天）

---

## 三、代码格式（必须严格遵守）

所有新闻写入 `NEWS_L1_L4` 数组，格式如下：

```js
{
  id: "unique_snake_case_id",           // 全局唯一，snake_case
  headline: "📰 标题（30字内，有情绪、有冲突感）",
  level: "L1",                          // L1/L2/L3/L4
  type: "price",                        // price/job/policy/investment/social/weather
  seasons: ["spring", "summer"],        // 可选：限定触发季节
  effects: {
    // ──── 商品价格影响 ────
    priceMod: {
      water: 1.3,          // 商品 ID（见下方列表）: 倍率（1.0=不变）
      food: 0.8,
    },

    // ──── 工作收入影响 ────
    jobBonus: ["delivery_rider", "courier_gig"],   // 受益工作 ID 列表
    jobPenalty: ["street_vending_food"],            // 受损工作 ID 列表
    jobMultiplier: 1.3,                             // 倍率（jobBonus 和 jobPenalty 共用）

    // ──── 全职工资影响 ────
    allJobsBonus: 1.05,    // 所有工作工资倍率

    // ──── 投资市场影响 ────
    investmentEffect: [
      { allStocks: true, mul: 1.08 },              // 全市场
      { btc: true, mul: 0.85 },                    // 比特币
      { category: "贵金属", mul: 1.15 },           // 分类
      { industry: "科技", mul: 0.92 },             // 行业
      { symbols: ["NVDA", "ESTATE"], mul: 1.2 },  // 具体股票代码
      { sectorHeat: { 科技: -0.05, 房地产: 0.03 } }, // 行业热度
    ],

    // ──── 现金直接增减 ────
    cashBonus: 500,        // 获得现金
    cashLoss: 200,         // 损失现金

    // ──── 需求系统影响 ────
    hungerBonus: 10,       // 饱食度 +10
    fatigueBonus: 15,      // 疲劳恢复 +15
    fatiguePenalty: 10,    // 疲劳增加
    happinessBonus: 5,     // 心情提升

    // ──── 其他 ────
    skillXp: 10,           // 随机技能经验
    marketMoodShift: -0.03, // 市场情绪偏移（±0.1范围）

    duration: 7,           // 效果持续天数（线性衰减，L1: 8-15, L2: 5-12, L3: 3-7, L4: 1-3）
  },

  conduit: {
    targetLevel: "L2",         // 传导到哪一层
    delayRange: [2, 4],        // 多少天后触发
    chance: 0.6,               // 触发概率 0-1
  },
},
```

---

## 四、有效 ID 参考表

### 商品 ID（priceMod 的 key）

```
water, instant_noodles, snacks, daily_use, fruits, vegetables, beer, cigarettes,
clothing, electronics, scrap_metal, scrap_paper, scrap_plastic,
rice, flour, noodles, potato, bok_choy, cabbage, radish, tomato, cucumber,
pork, beef, chicken, fish, salt, soy_sauce, cooking_oil, sugar
```

### 工作 ID（jobBonus / jobPenalty 的元素）

```
waste_recycling, manual_labor_construction, premium_engineering, factory_work_assembly,
street_vending_food, delivery_rider, restaurant_assistant, content_writing, junior_analyst,
busking, bank_security, training_assistant, hospital_companion, tutoring, factory_overtime,
cafeteria_worker, instrument_repair, phone_modding, web_designer, server_ops,
network_monitor, foreign_trade_assistant, document_translator, taxi_driver,
truck_assistant, shop_assistant, procurement_clerk, project_coordinator,
audit_assistant, factory_electrician, steel_worker, courier_gig,
wholesale_delivery, wholesale_sorting
```

### 投资分类 / 行业（investmentEffect 的 category / industry）

```
分类：贵金属, 虚拟币, 期货
行业：科技, 房地产, 金融, 医药, 新能源, 消费, 制造
股票代码：NVDA, HUAW, SMIC, BABA, TCEHY, ESTATE, CL, NG, COPPER, ALUM, BTC
```

---

## 五、内容质量标准

### 5.1 标题写作原则

- **有具体数字**："涨价30%"比"价格上涨"好
- **有冲突感**："暴涨"、"重挫"、"危机"、"骤降"
- **30字以内**，移动端显示不换行
- **emoji 开头**，帮助视觉快速分类（L1 全球感、L2 政策感、L3 城市感、L4 邻里感）

### 5.2 效果设计原则

- **单条新闻影响 1-3 个系统**（价格 + 工资、或投资 + 价格，不要四五个全占）
- **倍率合理范围**：普通事件 0.85-1.15，重大事件 0.7-1.4，极端事件（黑天鹅）0.5-1.8
- **L1 影响广，L4 影响小且具体**：L4 只影响 1 个商品或 1 个工作
- **正反平衡**：有价格上涨必有价格下跌，有工资加成必有工资惩罚

### 5.3 中国城市生活真实感

- 每种类型都要覆盖：粮食/能源/季节商品/节日消费/城管执法/打工心态
- L3/L4 特别要有接地气的语言和场景：包子涨价、早高峰堵车、菜市场被查、包工头欠薪
- 季节性新闻要真实：夏季高温→饮料涨价、冬季供暖→煤气涨、梅雨→蔬菜减产

### 5.4 链条设计的正确姿势

好的链条：**事件有因果逻辑**，下级新闻是上级新闻的自然结果

```
L1: ⚔️ 中东战争升级，原油期货暴涨25%
  → L2: 🚗 国内成品油价格上调，出租车起步价提高
    → L3: 🚕 本市出租车司机集体停运，打车难
      → L4: 👷 工友抱怨：上班迟到被扣钱，老板不讲理
```

坏的链条：**机械拼凑，无逻辑**

```
L1: 贸易战
  → L2: 教育改革（无关）
    → L3: 城管查摊（更无关）
```

---

## 六、分批输出格式

每批输出 30-50 条，格式为可直接复制追加到 `NEWS_L1_L4` 数组的 JS 片段：

```js
// ====== 批次 N：XXX 主题 ======
  {
    id: "...",
    headline: "...",
    level: "L1",
    type: "...",
    effects: { ... },
    conduit: { ... },
  },
  // ... 更多条目
```

每批附上：

- 本批新增条数
- 累计总条数
- 覆盖了哪些 type（避免某类型积压过多）
- 下一批建议优先填充的类型

---

## 七、质检清单（每批自查）

- [ ] 所有 `id` 全局唯一，无重复
- [ ] `priceMod` 的 key 都在有效商品 ID 列表里
- [ ] `jobBonus`/`jobPenalty` 的元素都在有效工作 ID 列表里
- [ ] `investmentEffect` 的 category/industry/symbols 都在有效列表里
- [ ] L1 必须有 `conduit` 指向 L2；L2 指向 L3；L3 指向 L4
- [ ] L4 无 `conduit`（终端）
- [ ] `duration` 符合层级范围（L1: 8-15, L2: 5-12, L3: 3-7, L4: 1-3）
- [ ] 标题 ≤30 字，emoji 开头
- [ ] 同一类型不超过本批 60%

---

## 八、当前新闻系统现状（续写时参考）

- `news.js` 中 `NEWS_EVENTS`：约 56 条（含 `NEWS_FOLLOWUP`）
- `news_system.js` 中 `NEWS_L1_L4`：约 34 条
- **目标总量：500 条**（含 echo/followup），全部写入 `NEWS_L1_L4`
- 当前已有比例：L1 约 8条，L2 约 10条，L3 约 10条，L4 约 6条
- **最需要补充**：L4 街头见闻（接地气，小范围影响）、weather 类、social 类

---

## 九、启动指令

```
请按照以上提示词，为《城市浮生记》生成第 N 批新闻扩充内容（约 40 条）。
本批重点：[类型/主题]
避免重复已有：[已有的 id 列表或描述]
```
