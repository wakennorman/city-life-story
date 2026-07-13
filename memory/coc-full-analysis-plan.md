# 约定式自动归类 (CoC) 全量分析及实施计划

## 背景

约定式自动归类 (Convention-over-Configuration, CoC) 是城市浮生记的元架构原则：
**数据自己描述自己，系统自动发现并接入，不写胶水代码。**

新增任何内容时按约定格式声明即可，框架自动发现并接入，不需要写 if-else 或注册代码。

---

## 一、已落地的 CoC 系统（22 个）

### 第一层：已成熟稳定

| #   | 系统                  | 约定字段                                                    | 自动效果                                                       | 实现文件                |
| --- | --------------------- | ----------------------------------------------------------- | -------------------------------------------------------------- | ----------------------- |
| 1   | **行动自动归类**      | `category` (生存必需/工作/购物等)                           | 按地点感知重排分类顺序，同类内按频次/AP排序                    | `action_sort.js`        |
| 2   | **百科注册表**        | MECHANICS/NARRATIVES/VICTORIES 三个注册表                   | `_wikiRenderDetail()` 自动渲染，列表+详情全自动                | `mechanics_registry.js` |
| 3   | **每日管线**          | DAILY_PIPELINE 数组，每步声明 `name` + `fn`                 | `endDay()` 按序执行，极端状态短路跳过                          | `daily_pipeline.js`     |
| 4   | **商品分类/买卖地点** | `category` + `buyLocations`/`sellLocations`                 | 百科自动生成分类标签和导航按钮                                 | `goods.js`              |
| 5   | **装备槽归类**        | `slot` (head/hand/feet/body/accessory)                      | 百科按槽位展示，背包按槽分类                                   | `items.js`              |
| 6   | **疾病触发/演化**     | `triggerHabit` + `evolvesTo`                                | 疾病自触发（习惯阈值）、自演化（链式升级）                     | `illnesses.js`          |
| 7   | **场所过滤**          | `loc` + `type` + `tier`                                     | `getAmenitiesAtLoc()/getNearestAmenitiesByType()` 自动过滤     | `amenities.js`          |
| 8   | **证书工资加成**      | `salaryBonus` (路径ID→倍率)                                 | `_calcCertSalaryBonus()` 自动扫描累加                          | `skills.js`             |
| 9   | **工作地点关联**      | `location` + `requirements` + `requiredFlag`                | 百科自动生成"前往工作"导航，条件自动展示                       | `jobs.js`               |
| 10  | **地点分类**          | `type` (residential/commercial/industrial等) + `wealthTier` | 百科按类展示，位置Tab按类分组                                  | `locations.js`          |
| 11  | **NPC好感奖励**       | `affinityRewards` (30/60/80三档) + `favor` + `deepTask`     | `ensureNpcAffinityEvents()` 自动检测触发                       | `npcs.js`               |
| 12  | **技能分支**          | SKILL_BRANCHES 数据声明                                     | 30级自动解锁分支选择，天赋节点树状解锁                         | `skill_tree.js`         |
| 13  | **新闻效果/投资联动** | `effects.priceMod/jobBonus/investmentEffect` 数据对象       | `applyNewsEffect()` 自动解析，`news_investment_bridge.js` 消费 | `news.js`               |
| 14  | **条件系统**          | `ConditionSystem.register(context, checkFn)`                | `renderRows()/showModal()` 统一渲染                            | `condition_system.js`   |
| 15  | **排序系统**          | `SortUtils.registerListType(id, config)`                    | 5层排序（分类→优先级→频次→价格→拼音）                          | `sort_utils.js`         |
| 16  | **世界参数行业定义**  | WORLD_SECTORS 数组                                          | 行业热度随机漂移+传导+新闻驱动                                 | `world_params.js`       |
| 17  | **技能连携效果**      | SKILL_SYNERGY_DUAL/TRIPLE/THEME 数据声明                    | `checkSkillSynergies()` 自动检测+合并效果                      | `skill_synergy.js`      |
| 18  | **剧本声明**          | SCENARIOS 数组 + `category`                                 | 欢迎页自动列出，`startNewGame()` 读取参数                      | `scenarios.js`          |
| 19  | **事件触发槽位**      | TRIGGER_SLOTS + TRIGGER_TEMPLATES                           | `triggerRandom()` 按时机+模板自动匹配事件                      | `trigger_registry.js`   |
| 20  | **事件数据条件**      | `triggers: {minDay, minCash, ...}` 数据对象                 | `evaluateTriggers()` 通用检查                                  | `events_core.js`        |

### 第二层：本轮新增（2026-07-13）

| #   | 系统                  | 约定字段                                       | 自动效果                                                       | 实现文件              |
| --- | --------------------- | ---------------------------------------------- | -------------------------------------------------------------- | --------------------- |
| 21  | **NPC语境对话** ⭐新  | NPC声明 `contextDialogue: [{condition, line}]` | `getNpcContextDialogue()` 自动匹配条件→台词，新增NPC只需加数据 | `npcs.js` + `main.js` |
| 22  | **人生节点效果** ⭐新 | Choice声明 `effect: function(st)` 内联         | `applyNodeChoice()` 自动调用内联效果，无需维护switch-case      | `life_nodes.js`       |

---

## 二、下一步可 CoC 化的领域（10 个，按优先级排列）

### P0 — 高影响，可立即开始 ✅ 已全部完成（2026-07-13）

#### 领域 1：成就触发条件声明化 `achievements.js` ✅

**现状**：每个成就有 `check: function(st)` 函数，40+个独立函数。

**目标**：常见模式（flag检查、阈值检查、天数检查）声明为数据字段，系统自动判定。

```js
// 当前
{ id: "first_earn", check: function(st) { return (st.resources.totalEarned || 0) > 0; } }

// 目标
{ id: "first_earn", triggers: { minTotalEarned: 1 } }
```

**方案**：在 `achievements.js` 中新增 `TRIGGER_DISPATCH` 映射表，将常见触发模式（`minTotalEarned`, `flagsMet`, `minDay`, `skillLevel` 等）映射到通用检查函数。`check` 函数保留为escape hatch。

**工作量**：~80 行新增（TRIGGER_DISPATCH），40+ 成就逐步迁移
**风险**：低（向后兼容，check 函数仍可运行）

---

#### 领域 2：节日事件数据声明化 `festivals.js` ✅

**现状**：SPRING_FESTIVAL_EVENTS 7天事件链手写 choice.effect 函数，无统一schema。

**目标**：标准化节日事件数据结构，使新增节日只需添加数据。

```js
{ dayOffset: 0, title: "...", icon: "...", desc: "...",
  choices: [{ text, hint, cost, effect, condition }],  // 已有，但 effect 格式不统一
  effects: { happiness: 20, fatigue: -10 },            // 新增声明式效果
  flags: { _springFestivalHome: true }                  // 新增声明式flag
}
```

**方案**：在 existing choice 结构中叠加声明式 `effects/flags` 字段，`cost` 已声明式；定时检查自动消费。

**工作量**：~50 行统一消费函数 + 7 天事件保持现状（文件已内联 effect 函数，可逐步迁移）
**风险**：低

---

#### 领域 3：跨系统联动规则声明化 `cross_system_integration.js` ✅

**现状**：6个硬编码函数（`checkLifeNodeMedicalEvents` 等），每个内含特定 if-else 检查特定 flag + 触发特定消息。

**目标**：声明式 LINKAGE_RULES 数组

```js
LINKAGE_RULES = [
  {
    trigger: {
      flag: "_lifeNode_career35_done",
      notFlag: "_midlifeHealthWarning",
    },
    condition: { stat: "health", op: "<", value: 60 },
    action: {
      type: "message",
      level: "warning",
      textFn: function (st) {
        return "...";
      },
    },
  },
];
```

**工作量**：~150 行（规则引擎 + 通用消费函数），~200 行删除（6个函数的 if-else 大部分可消除）
**风险**：中（需要细致提取每条规则）

---

### P1 — 中等影响，可在下一轮实施

#### 领域 4：行动数据源定义 `data/actions.js`（新建）

**现状**：`getAvailableActions()` 在 `main.js` 中 800+ 行，手写创建行动对象并混入渲染逻辑。`actions_extra.js` 用 `addStreetExtras()` 函数手工注入行动。

**目标**：统一行动数据源 `ACTIONS` 数组，每个行动声明式定义：

```js
{ id, category, name, icon, desc, locations[], conditions, handler, cost/ap/requirements... }
```

**方案**：创建 `data/actions.js`，第一阶段只提取 `actions_extra.js` 中 10+ 个固定行动（澡堂/网吧/公园等地点特色行动）为声明式数据。第二阶段逐步减少 `getAvailableActions()` 中的手工创建。

**工作量**：~200 行（第一阶段的行动数据），后续逐步迁移
**风险**：中高（`getAvailableActions` 高度耦合，需要分期迁移）

---

#### 领域 5：事件 conditions 函数迁移

**现状**：400+ 事件使用 `conditions: function(st) { ... }` 自定义函数。`evaluateTriggers` 支持数据对象式条件但覆盖率不足 5%（仅有 `stray_dog_rain` 等示范）。

**目标**：逐步将常见条件模式 (NPC好感/flag/天数/属性阈值) 迁移到数据对象式：

```js
// 当前
conditions: function(st) { return st.relationships.aunt_wang && st.relationships.aunt_wang.met; }

// 目标
conditions: { relationships: { aunt_wang: { met: true } } }
```

**方案**：扩展 `evaluateTriggers` 支持更多字段类型（relationships, flags, skills 等）。每次处理事件文件时顺手迁移。

**工作量**：~100 行扩展 + 400+ 事件逐步迁移
**风险**：低（向后兼容，function 仍走旧路径）

---

#### 领域 6：新闻后续链统一声明 `news.js`

**现状**：`followUpId` + `followUpDelay` 与 `NEWS_FOLLOWUP` 数组分处两个数据源，异步调度逻辑散落在 `news_system.js` 和 `main.js`。

**目标**：后续事件数据直接嵌套在新闻定义中，系统自动调度：

```js
{ id: "metal_boom", ..., followUp: { delay: 4, effects: {...}, headline: "..." } }
```

**方案**：在 news 数据中支持内联 `followUp` 对象，`NEWS_FOLLOWUP` 保留为独立条目兼容。

**工作量**：~60 行消费函数
**风险**：低

---

### P2 — 锦上添花，计划未来轮次

#### 领域 7：技能协同收入计算（`skill_synergy.js` `getSkillSynergyBonus`）

**现状**：`getSkillSynergyBonus()` 显式检查 10 个 `incomeBonus` 字段（`streetIncomeBonus`, `deliveryIncomeBonus`, `techIncomeBonus` 等），每个 bonux 字段名都硬编码在 3 个循环中（双/三/主题连携各复制一次）。

**目标**：自动合并所有 `.*Bonus`/`.*Multiplier` 字段，消除显式 if-else。

**方案**：在 effects 合并时自动收集所有以 `IncomeBonus`/`Multiplier` 结尾的字段名，用动态 key 循环而非显式检查。

```js
for (var key in synergy.effects) {
  if (/Bonus|Multiplier$/.test(key) || key.match(jobId)) {
    totalBonus += synergy.effects[key] - 1;
  }
}
```

**工作量**：~20 行修改
**风险**：低

---

#### 领域 8：职业路径条件检查（`career_dev.js`）

**现状**：54 个 else-if 手动检查属性/技能/年龄条件。

**目标**：注册到 ConditionSystem，统一渲染。

**工作量**：~150 行
**风险**：中（career_dev.js 是 UI 代码，条件检查与渲染混在一起）

---

#### 领域 9：旅行效果数据化（`travel.js`）

**现状**：旅行目的地效果硬编码在 tick 函数中。

**目标**：旅行数据声明效果（健康/心情/属性变化，触发事件等）。

**工作量**：~80 行
**风险**：低

---

#### 领域 10：创业事件触发（`startup_events.js`）

**现状**：25+ 手动 `triggerStartupEvent()` 过滤+行业匹配。

**目标**：注册到 `trigger_registry` 的 `corp_startup` 槽。

**工作量**：~50 行（注册适配）
**风险**：低

---

## 三、CoC 落地铁律

### 新增内容时的决策树

```
新增数据/系统 → 现有 CoC 系统能描述它吗？
  ├─ 能 → 按约定格式声明（零额外代码）
  ├─ 不能但有相近模式 → 扩展现有 CoC 系统（先修框架再交付系统）
  └─ 全新领域 → 先在本文档注册新的 CoC 系统，再实现
```

### 完成标准

一个 CoC 系统完成的标准：

1. **数据声明**：新增内容只需在数据文件中声明字段
2. **自动发现**：消费端自动扫描数据，无需注册步骤
3. **零 if-else**：该领域原有的 if-else 链已消除或大幅缩减
4. **向后兼容**：旧数据格式仍可工作

### 优先级策略

- **P0**：消除已有的大 if-else 热点（render.js 47处 / career_dev.js 54处 / startup.js 60处）
- **P1**：扩展现有 CoC 系统的覆盖率（events 条件/新闻链/成就触发）
- **P2**：新建 CoC 系统覆盖新领域（旅行/创业/装备品质）

---

## 四、本轮实现总结

### ✅ 已完成（2026-07-13）

1. **NPC语境对话数据化**（P0）
   - 6个NPC (aunt_wang/boss_li/sister_zhang/old_zhou/xiao_mei/chef_chen) 添加 `contextDialogue` 字段
   - 新建 `getNpcContextDialogue()` 替代 80 行 if-else 链
   - 影响文件：`npcs.js`(+~80行)、`main.js`(-82行/+20行)
   - 效果：新增NPC只需添加 `contextDialogue` 数据，无需修改 `main.js`

2. **人生节点效果内联化**（P0）
   - 12个choice添加 `effect: function(st)` 内联效果
   - `applyNodeChoice()` 优先检测内联effect，旧switch-case兜底
   - 影响文件：`life_nodes.js`(+~120行)
   - 效果：新增节点choice只需添加 `effect` 字段，无需维护switch-case

3. **成就触发条件声明化** ✅（P0，2026-07-13）
   - 新增 `TRIGGER_DISPATCH` 调度表（20种触发器类型：flagMet, minTotalEarned, minDay, minCounter, minAllSkillLevel, startupFlag 等）
   - 新增 `evaluateTriggersDispatch()` 通用判定函数
   - `checkAchievements()` 支持 `triggers` 优先，`check` 函数兜底
   - 迁移 60+ 成就为声明式 triggers，保留 ~20 个复杂成就的 check 函数
   - 影响文件：`achievements.js`（+TRIGGER_DISPATCH ~120行，60+ 成就迁移）
   - 效果：新增简单成就只需声明 triggers 字段，无需写 check 函数

4. **节日事件数据声明化** ✅（P0，2026-07-13）
   - `events_core.js` 新增声明式 `effects`/`flags` 自动应用逻辑
   - 10+ 节日 choice 添加 `effects`（需求/属性变化）和 `flags`（持久标记）字段
   - effect 函数专注随机逻辑和消息返回，声明式数据接管状态变更
   - 影响文件：`events_core.js`（+~25行）、`festivals.js`（+~15行）
   - 效果：新增节日 choice 只需声明 effects/flags，无需手写完整 effect 函数

5. **跨系统联动规则声明化** ✅（P0，2026-07-13）
   - 新增 `LINKAGE_RULES` 声明式规则数组（12条规则覆盖全部6个旧函数）
   - 新增 `_checkLinkageTrigger()` + `processLinkageRules()` 通用引擎
   - 6个旧函数保留为兼容包装（委托到 processLinkageRules）
   - 支持 flag检查/状态阈值/旅行活跃度/随机概率/天数间隔等多种触发条件
   - 影响文件：`cross_system_integration.js`（+~200行 LINKAGE_RULES / ~-180行旧代码）
   - 效果：新增联动只需在 LINKAGE_RULES 中添加一条声明，无需手写函数

### 📋 待后续轮次实施

全部 10 个领域已详细记录在第二节（P0x3 + P1x3 + P2x4）。
下一轮推荐：**领域 1（成就触发声明化）+ 领域 3（跨系统联动规则声明化）**。
