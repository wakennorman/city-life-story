# 城市浮生记 (City Life Story) — 开发文档

> 最后更新: 2026-06-22（新行动助力系统 + 行动习惯分布百科图）
> **构建提醒**: 每次修改 src/ 下的文件后，必须 `python build.py` 重新打包 dist/index.html 才能生效！

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
