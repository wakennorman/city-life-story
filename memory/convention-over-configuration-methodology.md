---
name: convention-over-configuration-methodology
description: 约定式自动归类的核心方法论——新增内容时零配置，系统自动发现与接入
metadata:
  type: reference
---

# 约定式自动归类方法论（Convention Over Configuration）

## 核心思想

**"数据声明什么，系统就自动做什么。不需要写胶水代码。"**

当你要新增一个地点/工作/NPC/物品/技能时，你只需要填写它的数据字段（在对应的 `data/*.js` 文件里加一条）。剩下的——百科条目、导航按钮、关联跳转、分类排序——全部由系统自动完成。

## 已落地的约定

### 1. 百科自动导航（v3.21b，`wiki.js`）

| 你新增了什么                         | 系统自动做了什么                                     |
| ------------------------------------ | ---------------------------------------------------- |
| 一个**地点**（加在 `locations.js`）  | 百科详情页底部自动出现「🚶前往此地」「🗺️在地图查看」 |
| 一个**工作**（加在 `jobs.js`）       | 百科详情页底部自动出现「🚶前往该地工作」             |
| 一个**NPC**（加在 `npcs.js`）        | 百科详情页底部自动出现「🚶前往该地找TA」             |
| 一个**物品**（有`buyLocations`字段） | 百科详情页底部自动出现「🛒去XX购买」                 |
| 一个**技能**（加在 `skills.js`）     | 百科详情页底部自动出现「📚前往培训中心训练」         |

**背后机制**：`_wikiAutoAppendNav()` 在 `_wikiRenderDetail()` 末尾扫描 `catId` + 数据条目字段，按内置规则表自动生成导航按钮。

### 2. 百科条目自动注册

| 数据文件                | 百科自动出现了什么         |
| ----------------------- | -------------------------- |
| `locations.js` 新增地点 | 百科「地点」分类自动多一条 |
| `jobs.js` 新增工作      | 百科「工作」分类自动多一条 |
| `goods.js` 新增商品     | 百科「商品」分类自动多一条 |
| `items.js` 新增装备     | 百科「装备」分类自动多一条 |
| `npcs.js` 新增NPC       | 百科「居民」分类自动多一条 |

**背后机制**：`_wikiListEntries()` 直接扫描数据全局变量（`LOCATIONS`/`STREET_JOBS`/`GOODS` 等）。

### 3. 数据驱动的扩展点：`navHints`

任何数据条目加个字段，不用改渲染代码：

```js
// 在 locations.js/school 里加上：
navHints: [
  {
    type: "subTab",
    tab: "personal_growth",
    subTab: "pg_edu",
    label: "🎓 查看学历",
  },
];
```

百科该条目底部自动多出这个导航按钮。

## 还可应用的领域（高潜力）

### 1. 🔴 P0 — 行动自动归类（Action Auto-Categorization）

**现状**：每个 `action` 对象里的 `id` 是手写的字符串（如 `"study_exam"`），然后在 `ActionSort.CATEGORIES` 里手动配置 `getLocationCategories()` 把它归到某个分类。新增一个行动需要改至少2个文件。

**约定方案**：行动对象加一个 `category` 字段：

```js
// 原来的行动结构
{ id: "study_exam", name: "参加考试", handler: ..., apCost: 30 }

// 改为带分类信息
{ id: "study_exam", name: "参加考试", handler: ..., apCost: 30, category: "edu" }
```

`ActionSort` 自动按 `action.category` 分类，不用再手动配 `CATEGORIES` 和 `getLocationCategories()`。

**节省**：新增一个行动从"改2个文件" → "只用写1条数据"。

### 2. 🟡 P1 — 事件触发条件数据化

**现状**：每个随机事件（`events_street.js`/`cross_system_events.js` 等）的 `conditions` 是一个手写的函数，用 if-else 检查地点/时间/属性/flag。新增事件需要写大量样板条件代码。

**约定方案**：事件声明一个 `triggers` 数据对象：

```js
// 原来的事件
{ id: "street_robbery", conditions: function(state) {
  return state.trade.currentLocation === "slum" && state.player.day > 5 && state.status.health > 30;
}, ... }

// 改为数据声明
{ id: "street_robbery", triggers: {
  locations: ["slum"],
  minDay: 5,
  maxHealth: 100,
  minHealth: 30,
}, ... }
```

事件系统自动匹配 `triggers`，无需手写 `conditions` 函数。不满足数据驱动条件的场景再 fallback 到函数。

**节省**：~80% 的事件条件代码变成纯数据。

### 3. 🟡 P1 — 商品/装备自动价格修正

**现状**：`locations.js` 里每个地点的 `priceMod` 是手动写的（如 `water: 0.8`）。新增商品时需要检查所有地点是否需要加 priceMod。

**约定方案**：商品声明自身的价格特性：

```js
// goods.js
{ id: "water", name: "矿泉水", basePrice: 3, priceAffinity: { slum: 0.9, commercialDist: 1.1 } }
```

系统自动合并商品声明的地点价格修正和地点的全局价格修正。

### 4. 🟡 P1 — 技能→工作解锁自动关联

**现状**：`skills.js` 的技能和 `jobs.js` 的工作通过 `requirements.skillLevel` 手动关联，但百科中没有自动显示"这个技能解锁哪些工作"。现在的新增技能也要手动查工作列表。

**约定方案**：在 `_wikiDetailSkill()` 和 `_wikiDetailJob()` 中自动交叉查询——技能详情显示"该技能可解锁的工作列表"，工作详情显示"需要的技能列表"。数据已是声明式的，只是交叉引用没有自动化。

**节省**：0 行额外代码，全是展示层面的自动化。

### 5. 🟢 P2 — 证书→职业加成自动注册

**现状**：`cert.js` 的证书和 `CAREER_PATHS` 的职业路径通过 `_calcCertSalaryBonus()` 手动 if-else 关联。新增证书要改 salary 计算函数。

**约定方案**：证书加 `salaryBonus` 字段：

```js
{ id: "accounting_cert", name: "会计从业资格证", salaryBonus: { finance: 0.08, all: 0.03 } }
```

`_calcCertSalaryBonus()` 自动扫描所有 `state.certificates` 匹配 `salaryBonus` 规则。

## 方法论原则

### 1. 数据声明优先（Declarative > Imperative）

先问"这个数据能不能自己描述自己需要什么"，而不是"我该在哪里写代码接入它"。

反例：写一个 if-else 检查当前地点 `if (loc === "slum")`
正例：在数据上加一个 `locations: ["slum"]` 字段，让系统自动匹配

### 2. 系统自动发现（Auto-Discovery）

系统定期扫描数据源，而不是靠手动注册。就像 `_wikiListEntries()` 直接读 `LOCATIONS` 全局变量，而不是维护一个独立的"百科条目列表"。

### 3. 约定优于配置（Convention > Configuration）

默认行为是合理的，特殊需求才需要写配置。例如"所有技能→百科自动出现"是约定，"特定技能需要定制导航"才需要加 `navHints`。

### 4. 渐进式增强（Progressive Enhancement）

纯数据驱动能解决 80% 的场景，剩下的 20% 用函数/配置来覆盖。不要为了消灭所有手动代码而引入过度复杂的抽象。

## 相关记忆

参考 [[navigation-system-v1]]（当前约定的实现基础）
参考 [[v2.1-内容扩充执行]]（大规模内容扩充的经验教训）
