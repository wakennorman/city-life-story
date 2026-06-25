# 子任务1：现状分析报告

## 一、项目概览

- **项目名**: 城市浮生记 (City Life Story)
- **入口**: `src/index.html` → 构建为 `dist/index.html`（单文件，4217 KB）
- **技术栈**: 纯 HTML5 + CSS + Vanilla JS，localStorage 存档
- **当前版本**: v3.0（2026-06-26 最新工作）
- **JS 文件数**: ~114 个（legacy）+ ~20 个 TS 数据目录

## 二、游戏机制清单

### 核心系统

| 系统       | 文件                       | 状态               |
| ---------- | -------------------------- | ------------------ |
| 状态管理器 | `core/state.js`            | ✅ 稳定            |
| 每日管线   | `phase1/daily_pipeline.js` | ✅ 稳定（14+步骤） |
| 事件引擎   | `core/events_core.js`      | ✅ 稳定            |
| 技能系统   | `core/skill_tree.js`       | ✅ 稳定            |
| 存档系统   | `core/save.js`             | ✅ 稳定            |
| 天气系统   | `core/weather.js`          | ✅ 稳定            |
| 行动排序   | `core/action_sort.js`      | ✅ 稳定            |

### 玩法系统（Phase 1 - 街头生存）

| 系统                 | 文件                          | 状态    |
| -------------------- | ----------------------------- | ------- |
| 街头工作（20个上限） | `data/jobs.js`                | ✅ 稳定 |
| 交易/商品套利        | `phase1/trade.js`             | ✅ 稳定 |
| 交易情报系统         | `phase1/trade_intel.js`       | ✅ 稳定 |
| 技能情报系统         | `core/skill_intel.js`         | ✅ 稳定 |
| 装备系统（43件）     | `data/items.js`               | ✅ 稳定 |
| 疾病系统（16种）     | `data/illnesses.js`           | ✅ 稳定 |
| 烹饪系统             | `core/cooking.js`             | ✅ 稳定 |
| 需求系统             | `phase1/needs.js`             | ✅ 稳定 |
| 道德事件系统         | `data/moral_events.js`        | ✅ 稳定 |
| 违法行为系统         | `core/illegal_actions.js`     | ✅ 稳定 |
| NPC位置桥接          | `core/npc_location_bridge.js` | ✅ 稳定 |

### 玩法系统（Phase 2 - 职场/创业）

| 系统     | 文件                        | 状态    |
| -------- | --------------------------- | ------- |
| 公司运营 | `phase2/corp_ops.js`        | ✅ 稳定 |
| 投资股票 | `phase2/investment.js`      | ✅ 稳定 |
| 房产市场 | `phase2/property_market.js` | ✅ 稳定 |
| 创业系统 | `phase2/startup.js`         | ✅ 稳定 |
| 副业系统 | `phase2/side_hustle.js`     | ✅ 稳定 |
| 企业命运 | `core/enterprise_fate.js`   | ✅ 稳定 |
| 家庭生活 | `phase2/family_life.js`     | ✅ 稳定 |
| 个人成长 | `phase2/personal_growth.js` | ✅ 稳定 |
| 事业发展 | `ui/career_dev.js`          | ✅ 稳定 |

### 扩展系统（v3.7+）

| 系统      | 文件                        | 状态                |
| --------- | --------------------------- | ------------------- |
| 人生节点  | `core/life_nodes.js`        | ✅ 可玩             |
| 医疗深度  | `core/medical.js`           | ✅ 可玩             |
| 旅行系统  | `core/travel.js`            | ✅ 可玩             |
| 法律系统  | `core/legal.js`             | ✅ 可玩             |
| 社交网络  | `core/social_network.js`    | ⚠️ 框架化（内容薄） |
| NPC关系网 | `core/npc_relationships.js` | ✅ 稳定             |
| 时代变迁  | `core/era_transform.js`     | ✅ 稳定             |
| 装备套装  | `core/equipment_suites.js`  | ✅ 稳定             |
| 技能连携  | `core/skill_synergy.js`     | ✅ 稳定             |
| 人生缎带  | `core/life_ribbon.js`       | ✅ 稳定             |

### UI 系统

| 功能        | 文件                         | 状态               |
| ----------- | ---------------------------- | ------------------ |
| 主渲染器    | `ui/render.js`               | ✅ 稳定（2000+行） |
| 社交Tab     | `ui/social_tab.js`           | ✅ 稳定            |
| 事业发展Tab | `ui/career_dev.js`           | ✅ 稳定            |
| 百科系统    | `ui/wiki.js`                 | ✅ 稳定            |
| 数据可视化  | `ui/data_viz.js`             | ✅ 稳定            |
| 游戏百科    | `data/mechanics_registry.js` | ✅ 稳定            |

## 三、事件清单

| 事件类型   | 文件                     | 数量              | 说明          |
| ---------- | ------------------------ | ----------------- | ------------- |
| 街头事件   | `events_street.js`       | 162               | 核心事件池    |
| 职场事件   | `events_corp.js`         | 36                | 职场阶段事件  |
| 额外事件   | `extra_events.js`        | -                 | 补充事件      |
| 道德事件   | `moral_events.js`        | 18                | 极端生存困境  |
| 跨系统事件 | `cross_system_events.js` | 17                | 跨维度联动    |
| 节日事件   | `festivals.js`           | 春节7天+清明+中秋 | 节日叙事      |
| 连锁事件   | `crisis35_followups.js`  | 6                 | 35岁路径延伸  |
| 新闻事件   | `news.js`                | 51                | 市场/社会影响 |
| 时代事件   | `era_events.js`          | 8                 | 时代节点      |

## 四、当前内容覆盖率评估

| 维度     | 覆盖率 | 说明                             |
| -------- | ------ | -------------------------------- |
| 街头生存 | ★★★★★  | 成熟完整，20个工作、交易、烹饪等 |
| 职场发展 | ★★★★☆  | 完整但缺少深度职场事件           |
| 投资系统 | ★★★★☆  | 股票/BTC/房产/贵金属齐全         |
| 创业系统 | ★★★★★  | 15+模块，30+事件，完整生命周期   |
| NPC系统  | ★★★★☆  | 10个NPC，好感+求助+深度任务      |
| 装备系统 | ★★★★★  | 43件装备，品质/耐久/套装         |
| 医疗系统 | ★★★☆☆  | 疾病16种，但治疗深度可加强       |
| 旅行系统 | ★★☆☆☆  | 5个目的地，事件重复              |
| 法律系统 | ★★☆☆☆  | 4种案件，缺乏日常法律场景        |
| 社交网络 | ★☆☆☆☆  | 框架化，内容严重缺乏             |
| UI/UX    | ★★★☆☆  | 信息过载，重复/英文问题需修      |
