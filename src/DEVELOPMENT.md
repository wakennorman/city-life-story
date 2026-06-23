# 城市浮生记 (City Life Story) — 开发文档

> 最后更新: 2026-06-23（批次E：百科剧透隐藏+NPC在场概率+地点触发对话）
> **构建提醒**: 每次修改 src/ 下的文件后，必须 `python build.py` 重新打包 dist/index.html 才能生效！

## 2026-06-23 — 批次E：百科剧透隐藏+NPC在场概率+地点触发对话

### 变更内容

**1. 百科NPC剧透隐藏** (`wiki.js`)

- 生日：隐藏直到通过聊天发现或好感≥60
- 礼物偏好：隐藏品类直到通过聊天发现或好感≥50（提示文字始终可见）
- 在场加成：只显示已解锁的好感阈值层级，未解锁的显示🔒
- 好感阈值奖励：只显示已解锁的层级描述，未解锁的显示"达成后解锁"
- 委托任务：隐藏故事详情直到好感≥30或已发现
- 深度任务：隐藏故事详情直到好感≥70或已发现
- 新增 `ensureNpcDiscovered()` 调用确保discovered字段存在

**2. NPC在场概率系统** (`npcs.js` + `skill_bonuses.js`)

- 每个NPC新增 `presenceChance` 字段（0.65~0.85），决定每天在位置的概率
- `getNpcPresenceBonus()` 增加 `isNpcPresent()` 检查，NPC不在场则无加成
- `getNpcPresenceBonusDesc()` 同样检查在场状态
- 固定位置NPC（王大婶/赵师傅/林阿姨）→0.85，半固定（李工头/陈师傅）→0.75，高流动性（张姐/小丽）→0.65
- 确定性哈希判定：`hash(npcId + day) % 1000 < presenceChance * 1000`

**3. 地点切换NPC触发** (`npc_event_bridge.js` + `main.js`)

- 新增 `rollNpcEncounterOnArrival()` — 玩家到达新地点时自动触发NPC对话
- 60%概率触发，NPC需在场检查通过
- 每次触发好感+1，同时尝试信息解锁
- 旅行handler中自动调用

**4. NPC信息发现系统** (`npc_event_bridge.js` + `main.js` + `state.js`)

- 新增 `_npcHash()` 确定性哈希函数
- 新增 `isNpcPresent()` 在场判定
- 新增 `ensureNpcDiscovered()` 自动初始化discovered字段
- 新增 `tryRevealNpcInfo()` 信息解锁（聊天/到达/好感提升触发）
- 生日：当天聊天自动解锁，日常聊天好感≥15有5%概率
- 礼物偏好：聊天好感≥20有12%概率解锁，好感≥50自动解锁
- 好感阈值奖励和在场加成：好感达标自动解锁对应层级
- 存档迁移：`importState()` 中自动补全旧存档的discovered字段

**5. 其他百科分类剧透保护** (`wiki.js`)

- 隐藏成就的解锁条件改为"🔒 达成条件神秘"（之前列出所有隐藏成就名）
- 叙事条目增加锁定：玩家未经历的事件显示为"🔒 你还没有经历过这段故事"
- `afterEventApplied()` 追踪已体验事件到 `_experiencedNarratives`
- 系统说明类叙事（四层新闻生态/新游戏+等）始终可见

**涉及文件**：

- `src/js/data/npcs.js` — 10个NPC新增presenceChance/encounterLines/infoHints
- `src/js/core/state.js` — relationships schema注释更新+存档迁移+\_experiencedNarratives
- `src/js/phase1/npc_event_bridge.js` — 新增5个函数+信息发现系统
- `src/js/phase1/skill_bonuses.js` — 在场加成加入NPC在场检查
- `src/js/ui/wiki.js` — NPC详情剧透隐藏+叙事锁定+成就隐藏
- `src/js/main.js` — 旅行handler+聊天handler集成

**设计参考**：

- 《Stardew Valley》Collection：已发现/未发现状态徽章
- 《Terraria》Bestiary：图鉴形式，遇到后才解锁详情
- 《My Time at Portia》：NPC信息逐步解锁
- 确定性在场概率：使用NPC id+天数的哈希值决定（可重复、不依赖RNG状态）

**构建**：已 `python build.py`（3519.1 KB）

- `executeStartupAction()` 添加对应 case，调用 `launchProduct(state, productId)`

**1.4 季节性事件匹配真实季节** (`extra_events.js`)

- spring/summer/autumn/winter 四个季节事件均添加 `st.weather.season` 条件检查
- 修复"春天出现入秋事件"的问题

**2.2 雷达图加名气** (`data_viz.js:435`)

- street模式雷达图属性从4个扩展到5个（体质/智力/敏捷/心智/名气）
- 历史覆盖层同步添加fame

**2.4 数据摘要UI缩小** (`data_viz.js:988-1012`)

- CSS grid 从 `minmax(120px,1fr)` → `minmax(90px,1fr)`
- 图标字体 20px→16px，数值字体 14px→12px
- 添加 `max-height:280px;overflow-y:auto`

**3.3 创业操作隔离** (`main.js:2794`)

- 创业操作不再出现在Street/Corp行动面板
- 仅在 techPark/startupOffice 地点可见

**3.4 创业竞争对手数量** (`startup_competition.js:226`)

- 初始竞争对手从最少1个→最少2个，最多4个
- 对手员工数从最少1人→最少3人

**其他窗口改动** (`news.js`)

- 修正全角/半角引号
- 新闻添加季节注释

### 背景

天气系统此前仅有13种天气类型+四季权重，但极端天气不持续、无预报、天气×疾病/地点未落实、无独立UI面板。

### 改动清单

#### src/js/core/state.js

- `weather` 对象新增字段：`forecast`（3天预报数组）、`duration`（持续天数）、`daysActive`（已持续天数）、`persistent`（持续期标记）

#### src/js/core/weather.js

1. **天气持续期系统** — 极端天气自动进入持续期（高温3-5天、寒潮2-3天、梅雨季3-5天等），持续期内天气不随机变化
2. **3天天气预报** — `generateWeatherForecast()` 每日生成本日+未来3天预报，置信度85%/65%/45%
3. **旅行AP修正** — `getWeatherTravelApMod()` 大雾×1.3、暴雨×1.25、台风×2、暴雪×1.5
4. **地点×天气联动** — `getWeatherModForLocation()` 读取 LOCATIONS 的 `weatherEffects` 字段，按天气+地点修正客流量/价格
5. **天气→疾病风险** — `applyWeatherIllnessRisk()` 消费 WEATHER_TYPES.effects.illnessRisk
6. **体质修正发病概率** — `getWeatherIllnessAdjustedProb()` 健康≤30概率×3.0，体质≥80概率×0.3
7. `getWeatherFootTrafficMod()` 增加可选 `locKey` 参数叠加地点修正
8. `getWeatherGoodPriceMod()` 增加可选 `locKey` 参数叠加地点价格修正
9. 新增辅助函数：`isExtremeWeather()`、`isPrecipitationWeather()`、`updateWeatherTemperature()`、`getIllnessName()`

#### src/js/data/locations.js

- `getTravelApCost()` 新增天气AP修正：旅行消耗 = 基础 × 天气倍率

#### src/js/phase1/illness.js

- 新增 `triggerIllness(state, illnessId, source)` — 外部系统触发疾病入口，含疾病已存在检查

#### src/js/phase1/daily_pipeline.js

- 新增 `weather_illness_risk` 管线步骤（在 weather_daily_effects 之后）

#### src/index.html

- 新增 `#weather-panel` div（位置名下方，用于显示天气详情面板）

#### src/js/ui/render.js

1. 新增 `renderWeatherPanel(state)` — 天气面板：天气图标+名称+温度+体感+舒适度+持续期+3天预报
2. 极端天气面板有红色左侧边框+红色背景警告样式
3. Bug修复：`weather.type` → `weather.current`（line 1466）

#### src/js/ui/modal.js

- Bug修复：`weather.type` → `weather.current` + 补充7种极端天气匹配（line 1688-1698）

#### src/js/data/mechanics_registry.js

- `weather_link` 更新：13种天气完整影响表、极端天气持续期、天气预报、疾病风险、地点联动

#### src/js/ui/wiki.js

- `weather_link` 百科条目更新：扩展为完整天气深化系统描述

### 构建

- 已 `python build.py`（3417.9 KB）

### 改动清单

#### src/js/data/locations.js

1. **解注释 suburb（郊区）** — residential, tier 2, 连接 slum/wholesaleMarket/park
2. **解注释 gov_office（政府办事大厅）** — service, tier 2, 连接 commercialDist/bank
3. **解注释 entertainment（娱乐城）** — recreation, tier 3, 连接 commercialDist/techPark/school
4. **解注释 temple（寺庙）** — recreation, tier 2, 连接 park/school/slum
5. **TRAVEL_GRAPH 双向连通** — 已有地点 slum/wholesaleMarket/school/commercialDist/techPark/bank/park 均添加了通向新地点的连接
6. **LOCATIONS 总数**：11 → **15** 个（仍保留 12 个 TODO 注释地点待后续实现）
7. **构建**：已 `python build.py`（3383.7 KB）

### 受影响模块

- `getLocationHops()` — BFS 自动适配新节点，无需修改
- `getTravelApCost()` — 通过 `LOCATIONS[fromKey].wealthTier` 自动计算跨区消耗
- `getJobsAtLocation()` — 新地点的 `jobs` 数组直接可用（即使部分工作尚未定义）
- `getReachableLocations()` — 基于新 TRAVEL_GRAPH 返回可达地点列表

## 2026-06-22 — 全局数值精度规范化

### 背景

游戏中「虚拟币市场情绪」面板显示 `48.71837561344329` 这样的长浮点数，根源是 `btcFearGreed` 状态每天叠加 `Random.float(-5,5)` 从未舍入，直接裸显。

### 改动清单

#### investment.js

1. **btcFearGreed 取整**（line 1170）：`Math.round()` 包裹整个表达式，恐慌指数保持整数（参考 BTC Fear & Greed Index 0-100 整数规范）
2. **renderBtc 恐慌指数显示**（line 2484）：`Math.round(fg)` 整数显示（原裸显长浮点，用户投诉对象）
3. **renderMarketSentiment BTC恐贪**（line 1690）：同上取整显示
4. **虚拟币持仓显示**（line 2560）：新增 `sharesStr = h.shares.toFixed(dec)`，按 `basePrice` 自动选择精度（>¥1000=4位, >¥100=2位）
5. **贵金属/期货持仓显示**（lines 2673/2814）：`sharesStr = h.shares.toFixed(2)` 统一2位小数
6. **买卖消息格式化**（lines 1315/1361）：非股票类 `shares.toFixed(6)`，虚拟币/贵金属避免裸显JS浮点精度
7. **BTC买卖消息**（lines 1388/1412）：`amount.toFixed(6)` + `btcAvgCost.toFixed(2)` 替代 `toLocaleString()`
8. **自定义数量提示**（line 2242）：`qty.toFixed(dec)` 避免「调整为 0.0010000000000002」

#### investment_analysis.js

9. **MA显示**（line 409）：`ma5/ma7/ma20.toFixed(2)` 补齐2位小数
10. **MACD显示**（line 418）：`macd/histogram.toFixed(2)` 补齐2位小数
11. **RSI显示**（line 424）：`value.toFixed(1)` RSI值1位小数（参考TradingView标准）

### 格式化原则

| 数据类型        | 精度            | 参考来源                    |
| --------------- | --------------- | --------------------------- |
| 恐慌指数        | 0位（整数）     | 真实 BTC Fear & Greed Index |
| 股价/均价       | 2位             | Bloomberg Terminal 标准     |
| BTC数量         | 6位             | 交易所规范                  |
| 虚拟币持仓      | 2-4位（按币价） | 币价¥1000+→4位，¥100+→2位   |
| 贵金属/期货持仓 | 2位             | 商品期货标准                |
| RSI             | 1位             | TradingView                 |
| MA/MACD         | 2位             | 传统技术分析标准            |

### 改动内容

**新建 `src/js/core/sort_utils.js`** — 通用交互列表排序工具：

- `SortUtils.sortInteractiveList(items, config, state)` — 5层通用排序（分类→优先级→频次→成本→名称）
- `SortUtils.registerListType(id, config)` — 注册新列表类型（含内置3种）
- `SortUtils.detectApplicableLists()` — 审计所有注册列表的排序覆盖率
- 内置注册：`trade_goods` / `skills` / `stocks` 三种列表类型

**新增频次追踪**（`state.js`）：

- `state.stats.tradeFreq` — 每买卖1个商品+1
- `state.stats.trainFreq` — 每次训练技能+1
- `state.stats.investFreq` — 每次交易股票+1
- 存档迁移：旧存档自动补空对象

**启用排序的3个列表**：

| 列表     | 分类顺序                          | 频次依据   | 消耗依据  | 文件          |
| -------- | --------------------------------- | ---------- | --------- | ------------- |
| 交易商品 | 食品→日用品→服装→电子→奢侈品→废品 | tradeFreq  | basePrice | render.js     |
| 技能训练 | 实用型→学术型→体能型              | trainFreq  | AP=15     | render.js     |
| 股票市场 | 科技→新能源→消费→金融→房地产→医药 | investFreq | basePrice | investment.js |

**频次埋点**：

- 交易：buy-btn、sell-one-btn、sell-all-btn、qty-action-btn 回调 → tradeFreq
- 技能：训练成功后 → trainFreq
- 投资：buyInvStock()/sellInvStock() 成功后 → investFreq

### 涉及文件

| 文件                                | 操作                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- |
| `src/js/core/sort_utils.js`         | **新建**                                                             |
| `src/js/core/state.js`              | 修改 — stats 新增 tradeFreq/trainFreq/investFreq + 迁移              |
| `src/js/ui/render.js`               | 修改 — renderTradeTab 商品排序 + renderSkillsTab 技能排序 + 频次埋点 |
| `src/js/phase2/investment.js`       | 修改 — renderStocks 股票排序 + buyInvStock/sellInvStock 频次埋点     |
| `src/index.html`                    | 修改 — 加载 sort_utils.js                                            |
| `src/js/data/mechanics_registry.js` | 修改 — 新增 sort_system 百科条目                                     |
| `src/DEVELOPMENT.md`                | 修改 — 本文档                                                        |

### 检测规则（未来新增内容适用）

一个列表适用分类排序系统的条件：

1. 以可点击卡片/按钮网格渲染（非纯展示）
2. 条目有唯一字符串 ID
3. 条目数 > 5
4. 有分类依据（category / type / industry 等字段，或可按规则分组）
5. 玩家与它多轮次多次交互

满足条件后调用 `SortUtils.registerListType()` 注册 + 在 render 函数调用 `sortInteractiveList()`。

---

## 项目概述

一款融合《北京浮生记》《大多数》《互联网大厂模拟器》玩法的综合性文字模拟经营网页游戏。玩家从城中村一无所有开始，通过废品回收、打工、倒买倒卖等方式在城市生存，最终进入互联网职场，从P5晋升到P10实现财务自由。

**技术栈**: 纯 HTML5 + CSS + Vanilla JS（零框架依赖），localStorage 存档，模块化开发 → 构建内联为单文件部署。

## 构建说明

项目根目录有 `build.py`，它将 `src/` 下的所有代码内联打包为 `dist/index.html`（可独立部署的单文件）。

```bash
# 每次修改 src/ 后必须执行
python build.py
```

- **开发/调试**: 直接打开 `src/index.html`（浏览器加载外部 CSS/JS）
- **测试/游玩**: 打开 `dist/index.html`（单文件，所有代码已内联）
- **git 提交**: `src/` 和 `dist/` 都会提交，确保 dist 与 src 一致

---

## 核心设计理念与长期开发方向

> 本章节定义游戏的终极形态与开发纲领，所有功能迭代均应以此为尺度衡量取舍。

---

## 2026-06-22 — 行动选项分类排序系统 v1.7

### 改动动机

随着游戏内容增长，行动选项（50+种）在"其他行动"区平铺排列，玩家需要频繁滚动查找。缺乏分类和排序机制。

### 方案：分类分组 + 多层排序

参考《大多数》《中国式家长》《Stardew Valley》等同类游戏的分类导航设计，采用**分类优先、频次辅助**的混合排序策略：

**排序层级**：分类顺序 → 同类优先级（关键行动置顶）→ 点击频次 → AP消耗 → 名称

**8 个分类**：生存必需 🌾 / 赚钱谋生 💼 / 地点服务 🏪 / 购物装备 🛒 / 学习提升 🎓 / 社交休闲 🎭 / 金融理财 💳 / 职业发展 🏢

### 修改文件

| 文件                         | 操作     | 说明                                                    |
| ---------------------------- | -------- | ------------------------------------------------------- |
| `src/js/core/action_sort.js` | **新建** | 分类定义、ID→分类映射、多层排序、分组函数               |
| `src/js/core/state.js`       | 修改     | `state.stats.actionFreq/actionFirstUse` 字段 + 存档迁移 |
| `src/js/ui/render.js`        | 修改     | `renderActionsTab()` 新增频次追踪 + 分类渲染逻辑        |
| `src/index.html`             | 修改     | 注册 `action_sort.js` 脚本（state.js 之后）             |
| `src/css/style.css`          | 修改     | 新增 `.action-category-header` / `.cat-count` 样式      |
| `src/DEVELOPMENT.md`         | 修改     | 本文档                                                  |

### ID→分类映射策略

两层映射：精确ID匹配（如 `eat` → survival）> 前缀规则匹配（如 `job_*` → work）> 兜底 other

### 存档兼容

- 新增 `state.stats` 字段，自动序列化
- `importState()` 中有 `v1.6 → v1.7` 迁移（如旧存档无 `stats` 则创建）

---

## 2026-06-22 — 行动排序系统 v1.7.1（完整性审计修复）

### 审计发现

对照 `getAvailableActions()` 全部 49 个静态 ID + ~100 个动态 ID 逐一检查：

| 问题                           | 数量      | 说明                                                                                                                                                                                                                                     |
| ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 掉到"other"的分类遗漏       | **16** 个 | `trade_header`/`wholesale_header`/`freelance_coding`/`supermarket`/`clothing`/`lottery`/`yu_e_bao`/`buy_insurance`/`start_business`/`gift_npc`/`weekend_market`/`monday_job_board`/`repay`/`set_dream`/`view_dream`/`diary`/`meditation` |
| 🟡 `pharmacy` 键冲突           | **1** 处  | 在 EXACT_MAP 中同时被 `survival` 和 `shopping` 定义，后者覆盖前者                                                                                                                                                                        |
| 🟡 `fest_*` 节日工作无前缀规则 | **7** 个  | `fest_spring_promo` 等节日工作 ID 以 `fest_` 开头，但规则只匹配 `festival_job_`                                                                                                                                                          |

### 修复内容

- **`action_sort.js`**：EXACT*MAP 新增 17 条映射（含 `deposit`/`withdraw`/`loan` 显式声明），删除 `pharmacy` 重复项，新增 `^fest*` 前缀规则
- **`action_sort.js`**：IN_CATEGORY_PRIORITY 新增优先级排序，确保 `freelance_coding`(30) > `trade_header`(40) > `scavenge_trash`(55) 等合理梯度
- **`action_sort.js`**：新增 `runAudit()` 函数（`ActionSort.runAudit(actions)` 控制台调用）
- **注意**：`pharmacy` 最终归类为"生存必需"(survival)而非"购物装备"(shopping)

### 修复后效果

- `trade_header` 和 `wholesale_header` 出现在"💼 赚钱谋生"分类下（原为"其他"）
- 所有 7 个节日工作出现在"💼 赚钱谋生"分类下
- 「买彩票」「余额宝」「买保险」出现在"💳 金融理财"（原为"其他"）
- 「去超市采购」「买件新衣服」出现在"🛒 购物装备"
- 「摆地摊创业」出现在"🏢 职业发展"（街头→创业的跳板）
- 所有 ~150 个行动不再有意外掉到"其他"的情况

---

## 2026-06-22 — 架构治理：三项前瞻性重构

### 1. events.js 拆分为三部分（修复 🔴 高风险）

**问题**：events.js 372 KB（RANDOM_EVENTS 数组占 358 KB），单文件过大，加载慢且难以维护。

**方案**：按职责拆分为三个文件：

| 新文件             | 大小   | 职责                                       |
| ------------------ | ------ | ------------------------------------------ |
| `events_core.js`   | 14 KB  | 引擎：空数组声明 + 触发/队列/弹窗/清理函数 |
| `events_street.js` | 266 KB | 162 个街头事件数据                         |
| `events_corp.js`   | 75 KB  | 36 个职场事件数据                          |

**加载顺序**：events_core.js → events_street.js → events_corp.js → extra_events.js

**设计**：事件数据文件用 IIFE 推入 `RANDOM_EVENTS` 数组，`extra_events.js` 模式不变。

### 2. render.js switch → TAB_RENDERERS 注册表（修复 🔴 高风险）

**问题**：`renderCurrentTab()` 包含 16 个 case 的 switch，每次新增标签页都需要修改这个函数。

**方案**：替换为声明式注册表：

```javascript
const TAB_RENDERERS = {
  actions: renderActionsTab,
  skills: { fn: renderSkillsTab, fallback: "📚 技能系统加载中..." },
  // ...
};
```

**新增标签页只需在 TAB_RENDERERS 中加一行**，无需修改 renderCurrentTab 函数体。

### 3. state.js 顶层路径命名空间校验（中等风险预防）

**问题**：`update('resource.cash', 100)`（少写 's'）会静默创建 `state.resource` 对象，难以排查。

**方案**：

- 在 `createDefaultState()` 执行后注册顶层 key 白名单
- `update()` / `batchUpdate()` 路径第一段不在白名单中时，`console.warn()` 发出警告

**不影响运行**，仅在控制台提示，方便开发时快速发现拼写错误。

---

## 2026-06-22 之前的历史变更摘要

<details>
<summary>展开查看历史</summary>

### ✅ 2026-06-22 — P2-11~P2-15 丰富度功能全部完成

- **P2-11 办公地点升级**：5级办公地点（共享→写字楼→科技园→总部→自建园区）
- **P2-12 企业文化**：3种文化（狼性/工程师/家文化），适应度系统
- **P2-13 合作伙伴**：5种伙伴类型，信任度演化
- **P2-14 产品定价**：5种定价模式，最优价格计算
- **P2-15 供应链**：5种供应商，库存管理

### ✅ 2026-06-21 — 版本迁移完成

- 旧版 `src/` 所有独特内容迁移到 `city-life-story/src/`
- 唯一活跃版本：`city-life-story/src/`

### 2026-06-20 — 多系统融合

- NPC事件桥接、新闻事件桥接、新闻投资桥接
- 内容连接密度审计
- 存档快照、疾病演化、食材库存联动、平衡调参
- 百科迁移、数据可视化、技能天赋树
- 企业命运 Phase 1-3、多周目记忆、继承链

### 更早

- 春节系统、节日系统、梦想系统
- 房产市场波动系统 v2
- 创业系统完整功能（15个功能模块）
- 街头/职场两阶段架构
- 初始版本

</details>

---

## 未来架构风险与应对

| 风险等级        | 风险项                             | 当前状态                             |
| --------------- | ---------------------------------- | ------------------------------------ |
| 🟢 低           | main.js 3857 行                    | 职责清晰，暂时没问题                 |
| 🟢 低           | 性能（回合制无需 60fps）           | 无风险                               |
| 🟡 中           | 每日管线 14+ 步骤                  | 已有短路跳过机制，关注即可           |
| 🟡 中           | 桥接模块增加                       | 可接受，每新增系统加一个桥接文件     |
| 🔴 高（已修复） | events.js 372 KB                   | ✅ 已拆分为 core/street/corp         |
| 🔴 高（已修复） | render.js 大 switch                | ✅ 已改为注册表模式                  |
| 🔴 高（已预防） | 状态路径误写                       | ✅ 已加入命名空间白名单校验          |
| 🔴 待处理       | 全局作用域（78 个文件共享 window） | 引入 ES modules 性价比不高，当前保持 |
| 🟢 已固化       | 新增技能→自动检测门控情报          | 见下方「开发约定」                   |

---

## 开发约定

### 新技能必须检测门控情报适配性

> 每次在 `skill_tree.js` 或 `skills.js` 中**新增技能**时，必须自动检测该技能是否适合做「技能门控价格/价值可见度」（即 `skill_intel.js` 模式）。

**检测标准**（满足任一即可）：

1. **有市场价格/成本数据**可作为门控信息（如烹饪→食材价格、会计→利率）
2. **有物品/服务价值数据**可作为门控信息（如维修→装备估值、编程→报价评估）
3. **有路线/成本优化信息**可作为门控信息（如驾驶→AP成本优化）

**不适合跳过**：纯功能加成型、纯操作型、纯社交型。

**实现模板**（参考 `src/js/core/skill_intel.js`）：

1. 在 `SKILL_INTEL_THRESHOLDS` 添加 3 档阈值（Lv.20/40/60）
2. 添加 `canSee*`（3 个） + `build*Preview()` 函数
3. 找到对应的 UI 集成点嵌入（action card 的 `pricePreview` 或独立面板）
4. 更新 `mechanics_registry.js` 百科条目
5. 构建并提交

---

## 变更日志

### 2026-06-22 — 交易情报系统 v1.8（技能驱动价格信息+区域商品概率+NPC情报）

**目标**：打破"全地图全商品价格一览无余"的局面，让销售技能、区域探索、NPC好感度都真正影响交易体验。

**核心设计**：

1. **价格信息可见度 = 销售技能 + 区域记忆**
   - 销售 0~19 级：只看得到当前区域价格
   - 销售 20~39 级：能对比已访问区域价格（红/绿标记）
   - 销售 40~59 级：能看到"已访问区域中"最低/最高价
   - 销售 60~79 级：能看到全城最低/最高（需当天跑完全城）
   - 销售 80+ 级：能看到价格走势预测箭头（↑↓→）

2. **双重记忆系统**
   - 清晰记忆：今天访问过的区域 → 精确到分的价格对比
   - 模糊记忆：自动保留前 3 日的价格区间（偏高/正常/偏低），每日滚动清除
   - 次日精确记忆自动归档为模糊记忆

3. **区域特色商品概率**
   - 每个区域有特产（100%出现）+ 日常必需品（永远有）
   - 非特产商品按日刷新概率出现（确定性随机，同一天内一致）
   - 批发市场例外：所有商品永远可买

4. **NPC 价格情报系统**
   - 6 个 NPC 各有专业领域（王大婶→日用品/食品、李工头→废品、张姐→服装/电子等）
   - 好感门控：30 解锁基础情报，60 解锁高级情报
   - 情报价格随好感递减（30→原价、60→6折、80→免费）
   - NPC 每日结算时有 30% 概率主动分享情报（好感≥60）

5. **销售技能获取渠道扩展**
   - 培训（主力）：30~50 XP/次
   - 交易实战（持续）：2~5 XP/次，每日上限 30 XP
   - NPC 情报互动（小爆发）：每次买入情报 +5 XP
   - NPC 主动分享（稀有）：+10 XP

**新建文件**：

- `src/js/phase1/trade_intel.js` — 核心模块（~730 行）

**修改文件**：

- `src/js/data/locations.js` — 每个区域增加 specialties/dailyProbability/specialCategory
- `src/js/data/npcs.js` — 6 个 NPC 增加 tradeInfo 字段
- `src/js/phase1/trade.js` — 新增 getAvailableGoodsAtLocation() + gainTradeXp()
- `src/js/core/state.js` — 新增 visitedToday/priceMemory/\_todayTradeXp + v1.8 迁移
- `src/js/ui/render.js` — 替换旧全表为技能门控价格展示+NPC情报入口
- `src/js/phase1/daily_pipeline.js` — 新增 npc_trade_info_share 步骤
- `src/index.html` — 注册 trade_intel.js

---

## 2026-06-22 — 交易 Action Card 价格预览 v1.7.2

### 改动动机

玩家在 Actions Tab 看到"买卖商品"按钮时，无法直接了解当前市场的价格状况，必须点击进入 Trade Tab 才能查看。这降低了信息传达效率，尤其是对新手玩家。

### 核心改动

**新增 `buildTradePricePreview()` 函数**（`src/js/main.js`）：

```
// 销售技能门槛决定预览可见度
Sales < 20  → "📊 N种商品"
Sales >= 20 → "📊 N种商品 · 🟢N个好价 · 🔴N个高价"
Sales >= 40 → "📊 N种商品 · ⬇️商品名¥价格"
Sales >= 60 → "📊 N种商品 · 🏆商品名全城最低"
```

- `trade_header`（买卖商品）和 `wholesale_header`（批发进货）两个 action 均增加 `pricePreview` 属性
- `getPriceMarker()`/`getVisitedExtreme()`/`getCityExtreme()` 函数复用自 trade_intel.js
- 所有 edge case（无价格数据、未访问别的地、函数未加载）均有兜底

**修改 `createActionCard()`**（`src/js/ui/render.js`）：

- 新增 `pricePreview` 属性渲染支持，通过 `<div class="price-preview">` 展示

**新增 `.price-preview` CSS 类**（`src/css/style.css`）：

- 紧凑单行 accent 色条，`text-overflow: ellipsis` 防止内容溢出
- 浅色背景 + 微边框区隔

**修改文件**：

- `src/js/main.js` — 新增 `buildTradePricePreview()` + 2 处 action 添加 `pricePreview`
- `src/js/ui/render.js` — `createActionCard()` 新增 pricePreview 渲染
- `src/css/style.css` — 新增 `.price-preview` 样式
- `dist/index.html` — `python build.py` 重新打包

---

## 2026-06-22 — 技能情报系统 v1.0（5 大技能 × 3 档价格/价值信息可见度）

### 改动动机

继交易情报（销售技能门控价格对比）之后，将同样的「技能等级决定信息可见度」模式扩展到更多技能——会计、烹饪、维修、驾驶、编程各获得 3 档信息可见度，让技能升级带来更立体的感知回报。

### 核心设计

**新建 `src/js/core/skill_intel.js`** — 统一情报模块（~350 行）：

| 技能    | Lv.20        | Lv.40         | Lv.60        |
| ------- | ------------ | ------------- | ------------ |
| 🧾 会计 | 侧边栏日收支 | 投资回报率    | 闲钱理财提示 |
| 🍳 烹饪 | 食材成本估算 | vs 外卖性价比 | 食材价格波动 |
| 🔧 维修 | 装备品质评级 | 月维护成本    | 二手估值     |
| 🚗 驾驶 | AP成本明细   | 配送费合理性  | 路线建议     |
| 💻 编程 | 外包工时估算 | 报价合理性    | 后续维护费   |

### 集成点

| 技能 | 集成入口      | 位置                                                 |
| ---- | ------------- | ---------------------------------------------------- |
| 会计 | 侧边栏        | `render.js` → `renderAccountingIntel()`              |
| 烹饪 | 食谱选择弹窗  | `critical.js` → 每个食谱卡片                         |
| 维修 | 装备栏        | `render.js` → 装备卡片下方                           |
| 驾驶 | 旅行 action   | `main.js` → travel action `pricePreview`             |
| 编程 | 外包单 action | `actions_extra.js` → freelance_coding `pricePreview` |

### 修改文件

| 文件                                | 操作     | 说明                                                    |
| ----------------------------------- | -------- | ------------------------------------------------------- |
| `src/js/core/skill_intel.js`        | **新建** | 5 技能 × 3 档阈值函数 + build\*Preview 函数             |
| `src/index.html`                    | 修改     | 注册 skill_intel.js（trade_intel.js 之后）              |
| `src/js/ui/render.js`               | 修改     | 新增 `renderAccountingIntel()` + 装备卡片 repairPreview |
| `src/js/main.js`                    | 修改     | travel action 添加 drivingPreview                       |
| `src/js/phase1/critical.js`         | 修改     | 烹饪食谱卡片添加 cookingPreview                         |
| `src/js/phase1/actions_extra.js`    | 修改     | 编程外包单添加 codingPreview                            |
| `src/js/data/mechanics_registry.js` | 修改     | 新增 skill_intel 条目                                   |
| `src/DEVELOPMENT.md`                | 修改     | 本文档                                                  |

---

## 2026-06-22 — 新行动助力系统 v1.0

### 改动动机

新玩家首次使用某个行动后，该行动在同类中排序优先度不够突出，新行动容易被大量已有行动淹没。

### 方案

在 `action_sort.js` 排序逻辑中新增「新行动临时加成」：

| 首次使用天数  | 加成值 | 效果            |
| ------------- | ------ | --------------- |
| 0（今天刚用） | -40    | 同类几乎置顶    |
| 1             | -25    | 显著靠前        |
| 2             | -15    | 中度靠前        |
| 3             | -5     | 微弱推动        |
| 4+            | 0      | 过期 → 正常排序 |

UI 上新增 **✨新** 徽章（CSS 脉冲动画）和新行动专属置顶卡片区「✨ 新行动 — 首次解锁 3 天内排序靠前」。

### 修改文件

| 文件                         | 操作 | 说明                                                         |
| ---------------------------- | ---- | ------------------------------------------------------------ |
| `src/js/core/action_sort.js` | 修改 | 新增 `isActionNew()` / `getActionNewBoost()` 导出 + 排序集成 |
| `src/js/ui/render.js`        | 修改 | `createActionCard()` 添加 ✨新徽章 + 新行动置顶区            |
| `src/css/style.css`          | 修改 | 新增 `.badge-new` / `@keyframes badge-new-pulse` 样式        |

---

## 2026-06-22 — 行动习惯分布图 v1.0（百科条目）

### 改动动机

玩家希望了解自己的行动偏好，知道自己不自觉地把 AP 花在了哪些地方，从而优化策略。

### 方案

在游戏百科「系统机制」分类下新增「📊 行动习惯分布」条目，包含：

1. **累计行动总次数** 概览
2. **按分类的柱状图**（8 大分类 × 使用量，颜色区分）
3. **各分类 Top 5 热门行动**（分类色条 + 具体行动名 + 点击次数）

全部从 `state.stats.actionFreq` 实时读取，自动反映当前游戏进度。

### 修改文件

| 文件                                | 操作 | 说明                                            |
| ----------------------------------- | ---- | ----------------------------------------------- |
| `src/js/data/mechanics_registry.js` | 修改 | 新增 `MECHANICS.action_habits` + `_getCatColor` |

---

## 内容扩充规划（待实现）

> 详细内容见 [`内容扩充规划.md`](内容扩充规划.md)
> 本文档仅做索引，不重复内容。

### 扩充概览

| 模块      | 当前量 | 目标量    | 新增量 | 优先级 |
| --------- | ------ | --------- | ------ | ------ |
| 成就      | 50+    | 80+       | +30+   | P0     |
| 新闻事件  | 60+    | 90+       | +30+   | P1     |
| NPC       | 6      | 12        | +6     | P1     |
| 街头工作  | 60+    | 80+       | +20+   | P1     |
| 装备/道具 | 35     | 50        | +15    | P2     |
| 食材      | 23     | 35        | +12    | P2     |
| 食谱      | 16     | 36        | +20    | P2     |
| 疾病      | 16     | 24        | +8     | P2     |
| 地点      | 11     | 15        | +4     | P2     |
| 证书      | 9      | 15        | +6     | P3     |
| 技能分支  | 现有   | +4 新分支 | +4     | P3     |
| 节日      | 6      | 10        | +4     | P3     |
| 公司      | 5      | 10        | +5     | P3     |
| 职场行动  | 9      | 15        | +6     | P3     |

### 全新系统（当前无实现）

- [ ] **装备品质系统**：普通/稀有/史诗/传说四档 + 随机附魔特效
- [ ] **NPC 关系网**：NPC 之间互有关系，影响好感传递
- [ ] **多周目深化**：声望传承/技能记忆/人脉继承/知识积累/家族财富/未竟梦想
- [ ] **成就系统 UI**：成就面板/分类筛选/进度追踪/解锁通知
- [ ] **天气深化**：高温/寒潮/雾霾/台风 + 地点差异化效果

### 优先级说明

- **P0**：核心游戏性，直接影响玩家体验深度
- **P1**：内容丰富度，显著增加游戏可玩性
- **P2**：体验打磨，提升细节质感
- **P3**：锦上添花，长期迭代内容

---

## 2026-06-22 — 内容扩充数据录入（待实现标记）

### 改动动机

内容扩充规划已制定，需将具体扩充内容以"待实现"标记形式写入数据文件，方便后续模型直接读取并实现代码。

### 扩充内容明细

| 文件                          | 操作     | 新增内容                                                                                                                    |
| ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/js/core/achievements.js` | **修改** | 新增 7 大类待实现成就（生存线15个/职场线15个/投资线10个/社交线8个/健康7个/隐藏7个），附实现提示 + 参考来源                  |
| `src/js/data/npcs.js`         | **修改** | 新增 6 个 NPC 完整配置模板（刘叔/吴姐/阿黄/林阿姨/赵师傅/小丽），含生日/节日/对话/礼物/情报/在场加成/好感奖励/求助/深度任务 |
| `src/js/data/items.js`        | **修改** | 新增 18 件装备模板 + 装备品质系统定义 + 2 级住所（别墅/豪宅）+ 附魔系统                                                     |
| `src/js/data/goods.js`        | **修改** | 新增 4 类商品（书籍/鲜花/药品/文具）+ 12 种食材 + 20 个食谱                                                                 |
| `src/js/data/illnesses.js`    | **修改** | 新增 8 种疾病（流感/焦虑症/脂肪肝/腰椎间盘突出/肾病/心脏病/肝癌等）                                                         |
| `src/js/data/locations.js`    | **修改** | 新增 4 个地点（郊区/政府办事大厅/娱乐城/寺庙）                                                                              |
| `src/js/data/skills.js`       | **修改** | 新增 6 个证书（护理证/食品健康证/消防证/IT支持证/理财顾问证/教师资格证）                                                    |
| `src/js/data/corp.js`         | **修改** | 新增 5 家公司 + 6 个职场行动 + 3 个团队角色                                                                                 |
| `src/js/data/news.js`         | **修改** | 新增 30+ 条新闻（价格12条/工作10条/个人15条/政策10条/投资13条），含道德困境事件模板 + 参考来源                              |
| `src/js/data/jobs.js`         | **修改** | 新增 14 个地点专属工作 + 9 个节日工作 + 8 个自由职业 + 参考来源                                                             |
| `src/js/core/weather.js`      | **修改** | 新增 6 种天气（高温预警/寒潮/重度雾霾/台风/沙尘暴/梅雨季）+ 详细效果定义                                                    |

### 实现提示（给后续模型）

1. **成就**：在 `check()` 函数中检测对应状态条件，注意 `state.flags` 埋点。参考《Papers Please》隐藏成就设计
2. **NPC**：完整配置 11 个字段，注意 `affinityRewards` 的 `effect` 函数格式。参考《Stardew Valley》NPC系统
3. **装备**：注意 `slot` 字段（head/hand/feet/body/accessory/null），`jobBonuses` 格式
4. **品质系统**：在每项装备追加 `quality` 字段，实现 `qualityMods` 和 `enchantments`。参考《暗黑破坏神》装备品质
5. **食谱**：在 `cooking.js` 的 `RECIPES` 数组中追加，注意 `ingredients` 数组格式
6. **疾病**：注意 `triggerHabit` 和 `symptom` 字段，慢性病患 `isChronic: true`。参考《大多数》疾病系统
7. **地点**：在 `LOCATIONS` 对象中追加，并在 `TRAVEL_GRAPH` 中配置连接关系
8. **新闻**：注意 `investmentEffect` 格式（industry/symbols/btc/category/mul/duration）。参考《资本家模拟器》
9. **工作**：注意 `location` 字段对应 `locations.js` 中的 ID，`branchRequirement` 格式
10. **天气**：在 `WEATHER_TYPES` 中追加，并在 `SEASONS` 的 `weatherWeights` 中配置权重。参考真实中国气象数据
11. **道德困境事件**：type: "personal"，含 choices 数组，每个 choice 有 text/hint/apply/cost。参考《This War of Mine》

### 参考来源

- 《大多数》— 成就/疾病/工作系统
- 《Stardew Valley》— NPC关系/节日系统
- 《This War of Mine》— 道德困境事件
- 《模拟人生》— 住房/装备系统
- 《暗黑破坏神》— 装备品质系统
- 《资本家模拟器》— 新闻/投资系统
- 《Papers Please》— 隐藏成就/道德选择
- 《北京浮生记》— 街头工作/生存线
- 《互联网大厂模拟器》— 职场线成就
- 真实中国新闻/职业资格/气象数据

---

## 2026-06-22 — 内容扩充指令 v2.1 建立（精简版）

### 建立原因

用户要求精简内容扩充范围，从"越多越好"改为"精而少"，核心变化：

1. **20 职业上限**：街头工作总数控制在 20 个以内
2. **行业代表制**：每个热门行业只选 1 个代表 NPC，同类行业不重复

### 核心原则（v2.1 新增）

1. **20 职业上限**（核心规则）— 街头工作总数控制在 20 个以内，超过即信息过载
2. **行业代表制**（核心规则）— 每个热门行业只保留 1 个代表 NPC，同类不重复
3. 其余原则同 v2.0（成套添加、参考来源具体、新闻联动等）

### 用户偏好更新

- 新闻/剧情/互动类：越多越好，不怕臃肿
- 功能性内容（工作/地点/装备）：质量优先，避免信息过载
- **职业/行业：每个行业只保留 1 个代表，同类不重复**（v2.1 新增）
- 喜欢"成套添加"的系统性设计，不喜欢孤立数据
- 喜欢参考真实数据和知名游戏，不喜欢凭空想象
- 喜欢明确的联动设计，不喜欢各系统各自为政
- 完成工作后必须 git commit + 更新文档 + 更新记忆文件

### 执行方式

以后用户说"按 v2.1 提示词继续内容扩充"，即按此提示词执行。完整提示词见 `memory/content-expansion-v2.1.md`。

### ✅ 2026-06-22 — v2.1 精简执行完成

#### 工作精简（47 → 20 个）

| 地点     | 精简前 | 精简后 | 保留工作                                                                                |
| -------- | ------ | ------ | --------------------------------------------------------------------------------------- |
| 医院     | 5 个   | 1 个   | hospital_caregiver（合并 hospital_orderly 护理证加成）                                  |
| 公园     | 5 个   | 1 个   | busking（街头表演）                                                                     |
| 银行     | 3 个   | 1 个   | bank_security（银行保安）                                                               |
| 培训中心 | 3 个   | 1 个   | training_assistant（培训助理）                                                          |
| 工业区   | 3 个   | 2 个   | factory_work_assembly, warehouse_worker                                                 |
| 大学城   | 4 个   | 2 个   | tutoring, package_delivery                                                              |
| 商业区   | 10+ 个 | 6 个   | street_vending_food/goods, food_stall, repair_service, delivery_rider, cleaning_service |
| 建筑工地 | 3 个   | 3 个   | manual_labor, skilled_labor, premium_engineering                                        |
| 城中村   | 2 个   | 2 个   | waste_recycling, old_zhou_recycling                                                     |
| 科技园   | 4 个   | 2 个   | content_writing, junior_analyst                                                         |

**删除工作**：hospital_cleaning/delivery/orderly/guidance, park_security/cleaning/guide/flower_vendor, bank_cashier_assist/atm_maintenance, tutor_care/center_cleaning, security_guard, barber, street_performer, data_entry, customer_service_tech, school_maintenance, factory_overtime

#### NPC 精简（删除行业重复）

- 删除：刘叔（退休老教师，与小美教育行业重复）
- 保留：6 个主 NPC（王大婶/李工头/张姐/老周/小美/陈师傅）
- 每个行业 1 代表：废品回收（老周）、建筑（李工头）、中介（张姐）、教育（小美）、餐饮（陈师傅）、房东（王大婶-特殊）

#### 新闻精简（100 → 46 条）

- 已实现：43 条高质量新闻
- 待实现：3 条代表性新闻（保留核心类别）
- 删除：58 条重复/低质量待实现新闻

---

## 2026-06-22 — 工作精简至 20 个（v2.1 执行）

### 改动动机

按 v2.1 精简原则：街头工作总数控制在 20 个以内，每个地点只保留最具代表性的工作。

### 精简结果（35 → 20 个）

| 地点          | 精简前 | 精简后 | 保留工作                                                          |
| ------------- | ------ | ------ | ----------------------------------------------------------------- |
| 城中村        | 2 个   | 2 个   | waste_recycling（基础）、old_zhou_recycling（NPC升级）            |
| 建筑工地      | 3 个   | 2 个   | manual_labor_construction（苦力）、premium_engineering（NPC升级） |
| 工业区        | 1 个   | 1 个   | factory_work_assembly（工厂流水线）                               |
| 商业区摆摊    | 2 个   | 1 个   | street_vending_food（摆摊卖小吃，合并 goods 摆摊）                |
| 商业区服务    | 3 个   | 2 个   | delivery_rider（外卖骑手）、restaurant_assistant（陈师傅打下手）  |
| 商业区NPC升级 | 1 个   | 1 个   | sister_zhang_vending（张姐黄金摊位）                              |
| 大学城        | 2 个   | 1 个   | xiao_mei_tutoring（小美精英家教）                                 |
| 科技园        | 2 个   | 2 个   | content_writing（内容创作者）、junior_analyst（数据分析师）       |
| 公园          | 1 个   | 1 个   | busking（街头表演）                                               |
| 银行          | 1 个   | 1 个   | bank_security（银行保安）                                         |
| 培训中心      | 1 个   | 1 个   | training_assistant（培训助理）                                    |

**删除的工作**（重复/相似/低代表性）：

- street_vending_goods（与 street_vending_food 功能重叠，合并保留食物摆摊）
- skilled_labor_construction（与 manual_labor 功能重叠，保留苦力+工程队两档）
- food_stall（与 street_vending_food 功能重叠）
- 大学城 tutoring/package_delivery（与小美家教功能重叠，保留精英家教）
- 科技园 junior_analyst 之后的所有分支工作（BRANCH_JOBS 数组保留代码但不在 STREET_JOBS 中展开）

### 修改文件

| 文件                  | 操作 | 说明                                                         |
| --------------------- | ---- | ------------------------------------------------------------ |
| `src/js/data/jobs.js` | 修改 | STREET_JOBS 精简为 20 个，BRANCH_JOBS 代码保留但不再自动合并 |

### 新闻数量

当前新闻正好 46 条（无需精简），覆盖：价格影响 10 条 / 工作联动 8 条 / 玩家个人 7 条 / 政策 2 条 / 投资 13 条 / 房地产 6 条。

---

## 2026-06-22 — v2.1 内容扩充执行（地点-工作引用修复 + NPC 补充）

### 执行概要

按 v2.1 提示词继续内容扩充，完成以下工作：

1. **地点-工作引用一致性修复**：清除 locations.js 中引用的不存在工作
2. **补充缺失地点工作**：批发市场、医院、大学城、工业区
3. **补充 NPC**：4 个行业代表 NPC（批发市场/工业区/科技园/医院）
4. **基础工作达 20 个上限**：符合 v2.1 职业上限规则

### 地点-工作引用修复

| 地点     | 修复内容                                                                          |
| -------- | --------------------------------------------------------------------------------- |
| 批发市场 | 清空 jobs → 后补充 wholesale_delivery + wholesale_sorting                         |
| 建筑工地 | 删除 `skilled_labor_construction`                                                 |
| 大学城   | 改为 `tutoring` + `xiao_mei_tutoring`                                             |
| 商业区   | 保留 4 个核心工作（删除 barber/cleaning_service/repair_service/street_performer） |
| 科技园   | 删除 `data_entry`, `customer_service_tech`                                        |
| 医院     | 补充 `hospital_companion`                                                         |
| 银行     | 保留 `bank_security`                                                              |
| 公园     | 保留 `busking`                                                                    |
| 培训中心 | 保留 `training_assistant`                                                         |
| 工业区   | **新增** jobs 数组 `["factory_work_assembly", "factory_overtime"]`                |

### 新增工作（+4 个）

| 工作 ID              | 地点     | 说明                     |
| -------------------- | -------- | ------------------------ |
| `wholesale_delivery` | 批发市场 | 批发配送，需要驾驶技能   |
| `wholesale_sorting`  | 批发市场 | 货物分拣，轻松适合休息   |
| `hospital_companion` | 医院     | 陪诊服务，需要耐心和细心 |
| `tutoring`           | 大学城   | 家教辅导，基础家教工作   |
| `factory_overtime`   | 工业区   | 工厂加班，高工资高疲劳   |

### 新增 NPC（+4 个）

| NPC    | 地点     | 行业代表   | 特色                   |
| ------ | -------- | ---------- | ---------------------- |
| 林阿姨 | 批发市场 | 菜市场摊主 | 食材价格情报、挑菜教学 |
| 赵师傅 | 工业区   | 修车师傅   | 汽配价格、维修教学     |
| 小丽   | 科技园   | 网红/主播  | 内容创作情报、直播助理 |
| 王医生 | 医院     | 内科医生   | 健康建议、优先挂号     |

### 当前数据总量

| 类别     | 数量  | 状态                |
| -------- | ----- | ------------------- |
| 地点     | 11 个 | ✅ 全部有 jobs 数组 |
| 基础工作 | 20 个 | ✅ 达 v2.1 上限     |
| 分支工作 | 19 个 | ✅ 技能分支解锁     |
| NPC      | 10 个 | ✅ 覆盖全部地点     |
| 新闻     | 46 条 | ✅                  |

### 修改文件

| 文件                       | 操作 | 说明                                 |
| -------------------------- | ---- | ------------------------------------ |
| `src/js/data/locations.js` | 修改 | 修复 11 个地点的 jobs 数组引用一致性 |
| `src/js/data/jobs.js`      | 修改 | 清理重复条目，新增 5 个工作          |
| `src/js/data/npcs.js`      | 修改 | 新增 4 个完整配置 NPC                |

---

## 2026-06-22 — v2.1 内容扩充：NPC 事件桥接系统

### 执行概要

为 4 个新 NPC（林阿姨、赵师傅、小丽、王医生）添加完整的事件联动，实现 NPC-事件双向连接。

### 改动内容

#### 1. 事件 → NPC 桥接（EVENT_NPC_MAP）

新增 9 个事件映射，覆盖新 NPC：

| 事件 ID                 | 关联 NPC | 效果                       |
| ----------------------- | -------- | -------------------------- |
| `wholesale_bargain`     | 林阿姨   | 砍价成功，林阿姨好感+2     |
| `veggie_fresh_find`     | 林阿姨   | 找到新鲜蔬菜，林阿姨好感+3 |
| `equipment_breakdown`   | 赵师傅   | 设备故障，赵师傅好感+2     |
| `repair_success`        | 赵师傅   | 成功维修，赵师傅好感+3     |
| `content_creation`      | 小丽     | 内容创作，小丽好感+2       |
| `viral_moment`          | 小丽     | 视频爆火，小丽好感+4       |
| `health_checkup`        | 王医生   | 健康检查，王医生好感+2     |
| `illness_recovery`      | 王医生   | 康复，王医生好感+3         |
| `mental_breakdown_edge` | 王医生   | 心理危机，王医生好感+3     |

#### 2. NPC 日常回响（getNpcDailyEchoes）

为 4 个新 NPC 添加 5 档好感度对话：

| NPC    | 负好感       | 中立     | 友好       | 好感         | 高好感     |
| ------ | ------------ | -------- | ---------- | ------------ | ---------- |
| 林阿姨 | 瞥你一眼     | 低头挑菜 | 招呼买菜   | 特价菜留给你 | 送自家青菜 |
| 赵师傅 | 戴护目镜不理 | 埋头修车 | 修车咨询   | 教你递工具   | 托付铺子   |
| 小丽   | 直播没注意   | 回评论   | 聊直播数据 | 教你拍视频   | 拉你出镜   |
| 王医生 | 写病历不理   | 匆匆路过 | 问身体状况 | 提醒休息     | 安排体检   |

#### 3. 位置感知交互（LOCATION_NPC_MESSAGES）

为 4 个新地点添加偶遇消息：

| 地点            | NPC    | 触发概率 | 示例消息         |
| --------------- | ------ | -------- | ---------------- |
| wholesaleMarket | 林阿姨 | 25%      | 整理菜摊招呼买菜 |
| factoryZone     | 赵师傅 | 20%      | 满身油污抬头修车 |
| techPark        | 小丽   | 20%      | 草坪直播当观众   |
| hospital        | 王医生 | 15%      | 走廊匆匆走过     |

#### 4. 新闻 → NPC 评论

新增 4 个 NPC 的关键词映射和评论回复：

| NPC    | 关键词           | 评论示例         |
| ------ | ---------------- | ---------------- |
| 林阿姨 | 菜市场/蔬菜/物价 | 菜价涨涨跌跌正常 |
| 赵师傅 | 汽车/维修/工厂   | 工厂的事我得留意 |
| 小丽   | 直播/网红/视频   | 这新闻能当素材   |
| 王医生 | 医院/健康/疾病   | 这条跟健康有关   |

### 修改文件

| 文件                                | 操作 | 说明                         |
| ----------------------------------- | ---- | ---------------------------- |
| `src/js/phase1/npc_event_bridge.js` | 修改 | 新增 4 个 NPC 的完整桥接配置 |

### 连接密度统计

| 维度            | 数量                   |
| --------------- | ---------------------- |
| 事件 → NPC 映射 | 9 条                   |
| 日常回响对话    | 20 条（4 NPC × 5 档）  |
| 位置交互消息    | 12 条（4 地点 × 3 条） |
| 新闻关键词映射  | 4 组                   |
| 新闻评论回复    | 4 条                   |

---

## 2026-06-22 下午 — 内容扩充 v2.1 第一批：商品套利路径 + 装备技能兼容性修复

### 扩充内容

| 文件               | 原有量              | 新增/修改量                                                   | 总计 |
| ------------------ | ------------------- | ------------------------------------------------------------- | ---- |
| `goods.js`（商品） | 12个基础 + 食材23个 | 12个基础补全套利路径 + 17个新商品（书籍/鲜花/药品/文具/食材） | 52个 |
| `items.js`（装备） | 24个                | 修复8处jobBonuses引用断裂 + 新增19件装备                      | 43个 |

### 套利路径详情

所有基础商品（12个）已补充 `buyLocations`（低价买入点）和 `sellLocations`（高价卖出点）：

| 商品     | 低价买入        | 高价卖出           | 套利空间 |
| -------- | --------------- | ------------------ | -------- |
| 瓶装水   | 批发市场/城中村 | 商业区/工地        | ~30%     |
| 水果     | 批发市场/大学城 | 商业区/医院/科技园 | ~40%     |
| 蔬菜     | 批发市场        | 商业区/医院        | ~50%     |
| 废金属   | 城中村/工地     | 批发市场/工厂      | ~60%     |
| 二手衣物 | 批发市场/城中村 | 商业区/科技园      | ~80%     |

### 装备技能兼容性修复

发现并修复 8 处 `jobBonuses` 引用了不存在的工作 ID：

| 原引用（断裂）               | 修复为（存在）                         | 涉及装备                           |
| ---------------------------- | -------------------------------------- | ---------------------------------- |
| `street_vending_goods`       | `sister_zhang_vending`                 | 草帽、厚棉衣                       |
| `skilled_labor_construction` | `premium_engineering` / `steel_worker` | 劳保手套、安全帽                   |
| `hospital_caregiver`         | `hospital_companion`                   | 口罩、厚棉衣                       |
| `cleaning_service`           | `training_assistant`                   | 工作服、雨衣                       |
| `security_guard`             | `bank_security`                        | 工作服                             |
| `package_delivery`           | `courier_gig` / `wholesale_delivery`   | 大背包、解放鞋、自行车、折叠自行车 |
| `data_entry`                 | `factory_work_assembly`                | 智能手机、电脑包                   |
| `customer_service_tech`      | `training_assistant`                   | 智能手机、电脑包                   |
| `food_stall`                 | `street_vending_food`                  | 保温杯                             |

### 新增装备（19件）

| 分类      | 装备                                                 | 价格    | 核心效果                   |
| --------- | ---------------------------------------------------- | ------- | -------------------------- |
| 季节性    | 保暖内衣/雨衣/雨伞                                   | ¥30-60  | 防寒/防雨/雨天出行         |
| 安全/健康 | 急救包/劳保靴/反光背心/防狼喷雾                      | ¥30-150 | 自动治疗/受伤减免/夜间安全 |
| 数码/学习 | 充电宝/电脑包/智能手表/降噪耳机/记事本/手电筒/收音机 | ¥10-300 | 效率提升/智力加成/信息获取 |
| 生活便利  | 维生素片/眼药水/按摩仪/保温饭盒/折叠自行车           | ¥15-350 | 健康/疲劳/通勤             |

### 联动设计

- 新装备 `jobBonuses` 全部指向 `jobs.js` 中真实存在的工作
- 新装备礼物映射已同步更新 `isItemNpcGift` 函数
- 季节性装备添加 `seasonal` 价格波动（保暖内衣冬季1.0/夏季0.5，雨衣春季1.1/夏季1.2）

### 注意事项

- 装备总数从24增至43，超过v2.1目标35个 → 功能性内容质量优先，超出可接受
- 部分装备引用了 `branch_jobs`（如 `steel_worker`），需确保技能分支解锁逻辑正确

---

## 2026-06-22 — Batch 5：装备品质系统 v1.0

### 核心设计

**四档品质**：普通(70%,灰色)/稀有(20%,蓝色)/史诗(8%,紫色)/传说(2%,橙色)

**12种附魔**：幸运/耐力/洁净(普通) | 智慧/活力/迅捷/力量/声望(稀有) | 锋利/守护(史诗) | 大师/龙魂(传说)

**品质来源**：普通购买70/20/8/2 | 拾荒85/12/3/0 | NPC赠送50/35/12/3 | 特殊事件40/35/20/5

### 修改文件

- equipment_quality.js（新建） | index.html（注册） | style.css（品质样式）
- modal.js（buyItemFromShop 品质生成） | render.js（装备品质展示）
- 构建：python build.py (3378.2 KB)

## 2026-06-22 — Batch 6：天气深化系统 v1.0

### 核心设计

**新增6种极端天气**：

| 天气     | 图标 | 季节 | 效果                                   |
| -------- | ---- | ---- | -------------------------------------- |
| 高温预警 | 🥵   | 夏   | 疲劳+10，心情-8，健康-2，水价格×1.5    |
| 寒潮     | 🥶   | 冬   | 疲劳+8，心情-5，健康-3，衣物价格×1.3   |
| 重度雾霾 | 😷   | 春秋 | 健康-2，呼吸疾病+15%，口罩需求×2       |
| 台风     | 🌀   | 夏秋 | 室外工作全停，室内收入-20%，交通阻断   |
| 沙尘暴   | 🌪️   | 春   | 疲劳+12，健康-3，呼吸疾病+20%，卫生-10 |
| 梅雨季   | 🌧️   | 春夏 | 疲劳+8，心情-6，食物过期+50%           |

### 季节权重更新

- 春季：沙尘暴8%、梅雨季5%、雾霾5%
- 夏季：高温12%、台风5%、梅雨季3%
- 秋季：雾霾8%、沙尘暴5%、梅雨季5%
- 冬季：寒潮5%、雾霾8%

### 修改文件

- weather.js：新增6种天气 + 更新季节权重 + 更新所有相关函数
- 构建：python build.py

## 2026-06-22 — Batch 7：成就系统扩充 v1.0

### 核心设计

**成就总数**：从50+扩充到80+（新增30+个成就）

**新增成就分类**：

| 分类        | 新增数 | 代表成就                                       |
| ----------- | ------ | ---------------------------------------------- |
| 生存线      | 15个   | 废品大王、街头小贩、拾荒之王、雨中行者         |
| 职场线      | 19个   | 首战告捷、初露锋芒、团队领袖、KPI之王          |
| 投资线      | 12个   | 第一支股票、牛市跑者、资产配置大师、长期主义者 |
| 社交线      | 10个   | 朋友圈、挚友、师徒传承、社交蝴蝶               |
| 健康/生活线 | 9个    | 健康生活、健身狂人、百日无病、烹饪大师         |
| 隐藏/道德线 | 9个    | 雪中送炭、以德报怨、清白之身、底线             |

### 修改文件

- achievements.js：新增30+个成就（生存线15 + 职场线19 + 投资线12 + 社交线10 + 健康9 + 隐藏9）
- 构建：python build.py (3367.1 KB)

### 参考来源

- 《大多数》成就系统
- 《This War of Mine》道德困境
- 《Stardew Valley》NPC关系系统
- 《资本家模拟器》投资成就

## 2026-06-22 — Batch 8：地点风味文本 + 装备品质 UI 优化

### 核心设计

**地点风味文本**：为 Batch 3 新增的 5 个地点补充每日轮换背景描写

| 地点     | 新增条数 | 主题                           |
| -------- | -------- | ------------------------------ |
| 郊区     | 7条      | 城郊结合部、安静生活、交通不便 |
| 高档小区 | 7条      | 富人生活、奢侈品、封闭管理     |
| 老旧小区 | 7条      | 设施陈旧、生活便利、邻里关系   |
| 菜市场   | 7条      | 农贸市场、讨价还价、新鲜食材   |
| 图书馆   | 7条      | 学习环境、安静阅读、知识氛围   |

**装备品质 UI 优化**：

- 修复 CSS 重复样式（4次重复 → 1次）
- 传说品质脉冲动画效果
- 品质标签颜色区分（灰/蓝/紫/橙）

### 修改文件

- location_flavor.js：新增5地点×7条风味文本
- style.css：清理重复样式，保留完整品质样式

### 构建

- python build.py (3367.1 KB)

## 2026-06-22 — 内容扩充指令 v2.0 建立（已废弃，升级为 v2.1）

## 2026-06-22 21:00 — 紧急修复：4 处语法错误导致按钮无响应

### 排查过程

玩家点击"选择游戏模式"按钮无反应 → 浏览器控制台发现多处 `SyntaxError` + `ReferenceError: LOCATIONS is not defined` → 根因为内容扩充时遗留下的语法错误，导致相关 `<script>` 解析中断，`LOCATIONS` 等全局变量从未创建。

### 修复内容

| 文件                    | 问题                                                                    | 修复               |
| ----------------------- | ----------------------------------------------------------------------- | ------------------ |
| `data/news.js`          | `NEWS_EVENTS` 数组未以 `];` 闭合，后续 `var NEWS_FOLLOWUP` 出现在数组中 | 补 `];`            |
| `data/news.js`          | desc 字符串内 `"高息理财"` 的 ASCII 双引号被解析器误认为字符串结束      | 改为中文弯引号 ` ` |
| `data/locations.js`     | `LOCATIONS = {` 为对象，结尾误用 `]`                                    | `]` → `}`          |
| `data/illnesses.js`     | `ILLNESSES = {` 为对象，结尾误用 `]`                                    | `]` → `}`          |
| `phase2/family_life.js` | `const typeKey =` 重复两行                                              | 删除空行           |

### 验证

- ✅ dist 全部 80 个 `<script>` 块通过 `new Function()` 语法检查
- ✅ 构建完成
- **构建**：python build.py (3387.3 KB)

## 2026-06-23 — 批次C：事件实际后果+装备耐久度+事件迷惑性

### 3.2 事件选择实际后果（events_street.js）

- `secondhand_phone` 事件两个购买选项现在都会添加 `smartphone` 到背包
- 选项1（直接买）：70%概率添加手机 + 消息明确提示"已放入背包"
- 选项2（测试后买）：砍价后添加手机 + 消息明确提示"已放入背包"

### 4.3 事件选择增加迷惑性（events_street.js）

- 移除所有提示中的精确数值（心情+10、心智-5、名气+8 等）
- 替换为模糊/氛围描述："花点钱做件好事""挺身而出，可能受伤""明哲保身，但夜里可能睡不着"
- 保留 `cost` 字段的金钱显示（玩家需要知道要花多少钱）
- 涉及约40个事件、60+提示文本

### 4.1 装备耐久度系统（新建 durability.js）

**新文件** `src/js/core/durability.js`

- 32种装备的耐久度基底定义（max + category）
- 四级可见性：Lv0不可见 → Lv20模糊描述 → Lv40精确数值 → Lv60可维修
- 每日磨损：基础-1~3，高风险工作+1~2，恶劣天气+1~2，消耗品翻倍，轻量减半
- 维修消耗回收废料（scrap_metal），每点缺失耐久消耗0.3个废料
- 维修成功给10点维修技能经验

**修改文件**

- `src/index.html`：加载 `js/core/durability.js`
- `src/js/phase1/daily_pipeline.js`：新增 `durability_wear` 步骤
- `src/js/ui/modal.js`：购买装备时初始化耐久度
- `src/js/main.js`：新游戏和读档时初始化耐久度

### 构建

- python build.py (3461.4 KB)
