# 城市浮生记 v3.8 — 现状分析（子任务1）

> 分析时间：2026-06-26
> 分析者：子任务1 subagent（现状分析，禁止改代码）
> 项目位置：D:/Claude Code+DeepSeekV4/city-life-story/
> Git HEAD：a578e70（docs(legacy): record feedback fixes and verification）
> 工作树状态：干净（仅未跟踪文件：快捷方式/启动脚本）

---

## 一、项目结构扫描

### 1.1 整体布局

```
city-life-story/
├── index.html              # Vite Web App 调试壳入口（非正式入口）
├── package.json            # Vite + TypeScript 工程配置
├── vite.config.mjs         # Vite 构建配置
├── tsconfig.json           # TypeScript 配置
├── src/                    # 正式开发目录
│   ├── index.html          # 【正式游戏入口】玩家实际使用
│   ├── css/style.css       # 全部样式
│   ├── js/                 # 运行时 JS 模块
│   │   ├── main.js         # 主循环 + 游戏引擎（4,169 行）
│   │   ├── core/           # 核心系统（53 个文件，~1.4MB）
│   │   ├── data/           # 配置数据（24 个文件，~1.2MB）
│   │   ├── phase1/         # 打工阶段逻辑（14 个文件）
│   │   ├── phase2/         # 公司阶段逻辑（17 个文件）
│   │   ├── ui/             # UI 渲染（12 个文件）
│   │   ├── app_bridge/     # Web App 桥接层（1 个文件）
│   │   └── components/     # 独立 UI 组件（1 个文件）
│   ├── app/                # Vite + TypeScript 新架构
│   │   ├── core/           # typed facade（gameBridge/stateAccess/saveMigrations）
│   │   ├── data/           # 类型化内容目录（9 个子目录，93 条记录）
│   │   ├── types/          # TypeScript 类型定义
│   │   ├── ui/             # 调试面板
│   │   ├── debug/          # 健康检查
│   │   └── shell/          # 调试壳
│   └── DEVELOPMENT.md      # 开发文档（126KB，详细变更记录）
├── dist/                   # legacy 构建产物（index.html 4.3MB）
├── dist-webapp/            # Vite 构建产物
├── memory/                 # 记忆文档（13 个文件）
├── plans/                  # 执行计划（1 个文件）
├── scripts/                # 审计/构建脚本
├── CLAUDE.md               # 开发护栏规则（38KB）
├── IMPLEMENTATION_PROGRESS.md  # 进度总控（10KB）
└── subagent_result*.md     # 子任务产出（2-5 号，1 号缺失→本次补写）
```

### 1.2 关键文件体量

| 文件                               | 行数          | 说明                     |
| ---------------------------------- | ------------- | ------------------------ |
| src/js/phase2/startup.js           | 14,381        | 创业系统（最大单体文件） |
| src/js/ui/render.js                | 6,422         | 主 UI 渲染               |
| src/js/main.js                     | 4,169         | 游戏引擎主循环           |
| src/js/core/events_street.js       | ~9,827        | 街头事件定义             |
| src/js/ui/wiki.js                  | ~142,000 字节 | 百科系统                 |
| src/js/ui/modal.js                 | ~73,000 字节  | 弹窗系统                 |
| src/js/core/enterprise_fate.js     | ~81,607 字节  | 企业命运系统             |
| src/js/core/events_corp.js         | ~96,542 字节  | 公司事件                 |
| src/js/data/moral_events.js        | ~95,971 字节  | 道德事件                 |
| src/js/data/npcs.js                | ~130,649 字节 | NPC 定义                 |
| src/js/data/startup_competition.js | ~102,310 字节 | 创业竞争                 |

**总计**：legacy 运行时约 100+ 个 JS 文件，总代码量约 30,000+ 行。

---

## 二、现有机制清单

### 2.1 核心机制

| 机制           | 文件                 | 状态    | 说明                                        |
| -------------- | -------------------- | ------- | ------------------------------------------- |
| 游戏主循环     | main.js              | ✅ 完整 | 每日 tick → 管线步骤 → UI 渲染 → 存档       |
| 每日管线       | daily_pipeline.js    | ✅ 完整 | ~30 个步骤覆盖天气/事件/经济/健康/技能      |
| 世界参数反馈环 | world_params.js      | ✅ 完整 | 行业热度/市场情绪/财富等级，2%/天向基线衰减 |
| 存档/读档      | save.js              | ✅ 完整 | 含快照回忆功能                              |
| 随机数/RNG     | random.js            | ✅ 完整 | 确定性哈希，可复现                          |
| 难度系统       | difficulty_system.js | ✅ 完整 | 多难度曲线                                  |
| 胜利条件       | victory.js           | ✅ 完整 | 多结局判定                                  |

### 2.2 经济系统

| 机制         | 文件                               | 状态    | 说明                              |
| ------------ | ---------------------------------- | ------- | --------------------------------- |
| 街头交易     | trade.js + trade_intel.js          | ✅ 完整 | 商品买卖+价格情报                 |
| 定价系统     | pricing.js                         | ✅ 完整 | 节日/季节/天气价格修正            |
| 投资系统     | investment.js + stock.js           | ✅ 完整 | 股票/BTC/房产，新闻驱动           |
| 房产市场     | property_market.js                 | ✅ 完整 | 4 阶段周期（火爆/平稳/降温/萧条） |
| 金融系统     | finance.js                         | ✅ 完整 | 银行存款/贷款                     |
| 副业系统     | side_hustle.js + side_hustle_ui.js | ✅ 完整 | 6 类夜间经济，已接入管线          |
| 住房维护费   | daily_pipeline.js                  | ✅ 完整 | v3.8 新增                         |
| 社交圈维护费 | daily_pipeline.js                  | ✅ 完整 | v3.8 新增                         |

### 2.3 职业系统

| 机制     | 文件                            | 状态    | 说明              |
| -------- | ------------------------------- | ------- | ----------------- |
| 街头工作 | data/jobs.js + actions_extra.js | ✅ 完整 | 35+ 种街头工作    |
| 职业发展 | career_dev.js                   | ✅ 完整 | 6 路径×22 职位    |
| 晋升系统 | promo.js + perf.js              | ✅ 完整 | 绩效/晋升         |
| 技能树   | skill_tree.js + skills.js       | ✅ 完整 | 多技能分支        |
| 技能协同 | skill_synergy.js                | ✅ 完整 | 技能连携效果      |
| 技能情报 | skill_intel.js                  | ✅ 完整 | 技能获取指引      |
| 技能加成 | skill_bonuses.js                | ✅ 完整 | 装备/工作特定加成 |

### 2.4 NPC 系统

| 机制         | 文件                              | 状态    | 说明                        |
| ------------ | --------------------------------- | ------- | --------------------------- |
| NPC 定义     | data/npcs.js                      | ✅ 完整 | 12+ NPC，含好感度/生日/喜好 |
| NPC 事件桥接 | npc_event_bridge.js               | ✅ 完整 | 好感度×技能双门槛           |
| NPC 关系网   | npc_relationships.js              | ✅ 完整 | 9 NPC 关系链+蝴蝶效应       |
| NPC 位置日程 | npc_location_bridge.js            | ✅ 完整 | 5 核心 NPC 作息             |
| 社交网络     | social_network.js + social_tab.js | ✅ 完整 | 社交 Tab + 聊天             |
| NPC 在场概率 | data/npcs.js                      | ✅ 完整 | presenceChance 0.65~0.85    |

### 2.5 装备/道具系统

| 机制      | 文件                                    | 状态    | 说明                       |
| --------- | --------------------------------------- | ------- | -------------------------- |
| 装备/道具 | data/items.js                           | ✅ 完整 | 30+ 件装备/道具            |
| 装备品质  | equipment_quality.js                    | ⚠️ 框架 | 品质框架就绪，玩家感知不足 |
| 装备套装  | equipment_suites.js                     | ⚠️ 框架 | 套装效果存在但 UI 展示弱   |
| 装备耐久  | durability.js + equipment_durability.js | ✅ 完整 | 耐久消耗+维修              |

### 2.6 世界系统

| 机制         | 文件                             | 状态    | 说明                      |
| ------------ | -------------------------------- | ------- | ------------------------- |
| 地点         | data/locations.js                | ✅ 完整 | 12 个地点                 |
| 天气         | weather.js + weather_forecast.js | ✅ 完整 | 天气预报+摆摊影响         |
| 节日         | festivals.js                     | ✅ 完整 | 春节/中秋/劳动节/剁手节等 |
| 新闻         | news.js + news_system.js         | ✅ 完整 | 79 条新闻+快报弹窗        |
| 新闻投资桥接 | news_investment_bridge.js        | ✅ 完整 | 新闻→股价传导             |
| 新闻事件桥接 | news_event_bridge.js             | ✅ 完整 | 新闻→事件权重             |
| 时代变迁     | era_transform.js + era_events.js | ✅ 完整 | 8 个时间锚点              |

### 2.7 元系统

| 机制         | 文件                                 | 状态    | 说明                    |
| ------------ | ------------------------------------ | ------- | ----------------------- |
| 成就         | achievements.js                      | ✅ 完整 | 52+ 成就                |
| 人生缎带     | life_ribbon.js                       | ✅ 完整 | BitLife 风格 12 条缎带  |
| 主线章节     | story_chapters.js                    | ✅ 完整 | 3 章式人生主线          |
| 人生节点     | life_nodes.js                        | ✅ 完整 | 高考/大学/35岁危机/退休 |
| 人生回忆录   | life_memoir.js                       | ✅ 完整 | 8 章节跨周目收藏        |
| 多周目继承   | inheritance_chain.js                 | ✅ 完整 | 9 种声誉徽章/关系/物品  |
| 传承币       | heritage_coin.js + heritage_store.js | ✅ 完整 | Hades 风格传承币        |
| 梦想系统     | dreams.js                            | ✅ 完整 | 人生目标设定            |
| 违法行为     | illegal_actions.js                   | ✅ 完整 | 8 种违法+道德恢复       |
| 道德事件     | data/moral_events.js                 | ✅ 完整 | 18+ 极端生存困境        |
| 百科         | wiki.js                              | ✅ 完整 | 注册表驱动，19+ 条目    |
| 引导系统     | tutorial.js                          | ✅ 完整 | 7 步引导+waitForClick   |
| 人生事务面板 | render.js (life_systems)             | ✅ 完整 | v3.8 新增常驻 Tab       |

### 2.8 4 大扩展系统

| 系统     | 文件                    | 状态    | 说明                         |
| -------- | ----------------------- | ------- | ---------------------------- |
| 人生节点 | life_nodes.js           | ✅ 完整 | 4 大里程碑，有弹窗和状态函数 |
| 医疗深度 | medical.js + illness.js | ✅ 完整 | 4 级疾病+3 档医保            |
| 旅行系统 | travel.js               | ✅ 完整 | 5 个目的地+纪念品            |
| 法律系统 | legal.js                | ✅ 完整 | 4 种案件+4 级律师            |

### 2.9 创业系统（最复杂模块）

| 模块           | 状态 | 说明               |
| -------------- | ---- | ------------------ |
| 行业选择       | ✅   | 6 大行业           |
| 产品类别       | ✅   | 15+ 类别           |
| 功能模块       | ✅   | 15 个模块          |
| 员工系统       | ✅   | 6 种角色           |
| 融资轮次       | ✅   | 种子/A/B/C/IPO     |
| 投资人         | ✅   | 7 种类型           |
| 退出方式       | ✅   | IPO/被收购/破产    |
| 创业事件       | ✅   | 30+ 事件           |
| 竞争对手       | ✅   | 2-3 家同赛道       |
| 市场份额       | ✅   | 技术分+市场分+声誉 |
| 品牌等级       | ✅   | 6 级               |
| 市场情报       | ✅   | 3 档调研           |
| 办公地点       | ✅   | 5 级               |
| 企业文化       | ✅   | 3 种               |
| 创业成就       | ✅   | 17 个专属成就      |
| 倒闭遗产链     | ✅   | 1-3 个遗产事件     |
| 新公司自然生成 | ✅   | 每 180 天 50% 概率 |

---

## 三、模块关联关系图

### 3.1 数据流总览

```
                    ┌─────────────────────────────────────────┐
                    │              main.js (游戏引擎)            │
                    │  init() → dailyTick() → render() → save() │
                    └──────────────┬──────────────────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
        ┌─────────────────────┐        ┌─────────────────────┐
        │   daily_pipeline.js  │        │      render.js       │
        │   (每日管线 ~30步骤)  │        │   (UI 渲染 6422行)    │
        └──────────┬──────────┘        └──────────┬──────────┘
                   │                               │
    ┌──────────────┼──────────────┐        ┌──────┼──────┐
    ▼              ▼              ▼        ▼              ▼
┌─────────┐  ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐
│weather  │  │ events  │  │  economy│ │ sidebar │  │ content │
│_tick    │  │_street  │  │_tick    │ │ render  │  │ render  │
└─────────┘  └─────────┘  └─────────┘ └─────────┘  └─────────┘
    │              │              │           │              │
    ▼              ▼              ▼           ▼              ▼
┌─────────────────────────────────────────────────────────────┐
│                    state.js (全局状态)                        │
│  player / status / inventory / skills / npcs / companies    │
│  worldParams / incomeExpenseHistory / _webApp               │
└─────────────────────────────────────────────────────────────┘
    ▲              ▲              ▲           ▲              ▲
    │              │              │           │              │
┌─────────┐  ┌─────────┐  ┌─────────┐ ┌─────────┐  ┌─────────┐
│ illness │  │ career  │  │startup  │ │ wiki    │  │ tutorial│
│_tick    │  │_dev     │  │_tick    │ │ registry│  │_step    │
└─────────┘  └─────────┘  └─────────┘ └─────────┘  └─────────┘
```

### 3.2 关键调用链

**每日 Tick 流程**：

```
main.dailyTick()
  → daily_pipeline.run()
    → weather_tick → events_tick → economy_tick → illness_tick
    → skill_tick → career_tick → npc_event_tick → side_hustle_tick
    → life_node_check → medical_tick → travel_tick → legal_tick
    → webapp_city_services_tick → save_snapshot
  → render()
    → renderSidebar() → renderContentArea() → renderTabBar()
```

**事件触发链**：

```
rollStreetEvent()
  → 筛选满足条件的事件池（conditions 函数）
  → 加权随机选择（baseChance + 权重）
  → showEventModal() → 玩家选择 → 应用效果
  → 可能触发 chainEventQueue → 后续事件
```

**创业 Tick 链**：

```
startup.tickDaily()
  → 员工工资 → 运营成本 → 收入计算
  → 竞争对手演化 → 市场份额更新
  → 融资/投资事件检查
  → 企业命运事件（零和博弈/行业传导/季度报告）
```

### 3.3 Bridge 层架构

```
┌─────────────────────────────────────────────────────────┐
│                    legacy 正式入口                        │
│  src/index.html → 100+ script 顺序加载                   │
│  window.StateManager → 真实游戏状态                       │
└──────────────────┬──────────────────────────────────────┘
                   │
    ┌──────────────┴──────────────┐
    ▼                             ▼
┌──────────────────┐    ┌──────────────────┐
│ app_bridge/      │    │ actions_extra.js │
│ webapp_runtime   │    │ addWebAppBridge  │
│ _bridge.js       │    │ Actions()        │
│ (v0.3.0)         │    │                  │
│ · 7个城市服务     │    │ · 城市服务入口    │
│ · 推荐服务       │    │ · 寺庙行动       │
│ · TS目录摘要     │    │ · 位置特色行动    │
└────────┬─────────┘    └──────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────┐
│              Vite + TypeScript 新架构                     │
│  src/app/data/ → 9 个类型化内容目录（93 条记录）          │
│  src/app/types/ → game.ts 完整类型定义                   │
│  src/app/debug/ → healthCheck.ts 健康检查               │
│  dist-webapp/ → 调试壳产物                               │
└─────────────────────────────────────────────────────────┘
```

---

## 四、内容覆盖率评估

### 4.1 已完成内容统计

| 类别       | 数量                | 来源                                                       |
| ---------- | ------------------- | ---------------------------------------------------------- |
| 街头工作   | 35+                 | data/jobs.js                                               |
| 随机事件   | 202+                | events_street.js + events_corp.js + cross_system_events.js |
| 新闻事件   | 79                  | data/news.js                                               |
| 成就       | 52+                 | achievements.js                                            |
| NPC        | 12+                 | data/npcs.js                                               |
| 地点       | 12                  | data/locations.js                                          |
| 疾病       | 16 种×5 大类×4 阶段 | data/illnesses.js                                          |
| 装备/道具  | 30+                 | data/items.js                                              |
| 食材       | 23 种               | data/ingredients.js（在 cooking.js 中引用）                |
| 食谱       | 16 个               | cooking.js                                                 |
| 节日       | 6+                  | festivals.js                                               |
| 公司       | 5+                  | data/corp.js                                               |
| 行业       | 6                   | startup.js                                                 |
| 产品类别   | 15+                 | startup.js                                                 |
| 旅行目的地 | 5                   | travel.js                                                  |
| 法律案件   | 4 种                | legal.js                                                   |
| 人生节点   | 4                   | life_nodes.js                                              |
| 人生缎带   | 12                  | life_ribbon.js                                             |

### 4.2 TS 数据目录覆盖

| 目录         | 数量 | 接入状态 | 说明                           |
| ------------ | ---- | -------- | ------------------------------ |
| cityServices | 7    | playable | 已桥接到 legacy UI             |
| events       | 12   | typed    | 仅类型化，未接入 legacy 事件池 |
| jobs         | 12   | typed    | 仅类型化，未接入 legacy 职业池 |
| locations    | 14   | typed    | 仅类型化                       |
| items        | 17   | typed    | 仅类型化                       |
| diseases     | 12   | typed    | 仅类型化                       |
| legal        | 7    | typed    | 仅类型化                       |
| travel       | 8    | typed    | 仅类型化                       |
| lifeNodes    | 4    | partial  | 部分接入                       |

### 4.3 缺失/薄弱区域

| 区域             | 现状                          | 缺失程度                     |
| ---------------- | ----------------------------- | ---------------------------- |
| 家庭系统         | family_life.js 存在但内容单薄 | 缺结婚/生子/子女教育完整循环 |
| 装备品质 UI      | 框架就绪但玩家感知不足        | 缺 UI 展示和获取引导         |
| 副业系统         | 已接入管线                    | 基本完整                     |
| 装备套装 UI      | 逻辑完整但 UI 弱              | 缺独立套装/连携 Tab          |
| 新闻→投资 UI     | 因果链存在但不透明            | 缺今日市场驱动板块           |
| 4 大扩展系统面板 | v3.8 已新增人生事务Tab        | 已解决                       |
| 超大文件拆分     | startup.js(14381行) 等        | 待拆分                       |

---

## 五、与现有诊断/改进计划的对比

### 5.1 已有诊断文档

| 文档                       | 时间       | 内容                         | 状态       |
| -------------------------- | ---------- | ---------------------------- | ---------- |
| DIAGNOSIS_REPORT.md        | 2026-06-25 | 16 项 P0/P1/P2 问题          | 已部分修复 |
| memory/diagnosis.md        | 2026-06-26 | 16 项问题（v3.8 版）         | 最新       |
| memory/improvement_plan.md | 2026-06-26 | 6 项 P0+P1 方案              | 最新       |
| memory/overview.md         | 2026-06-26 | 双轨架构现状                 | 最新       |
| subagent_result2.md        | 2026-06-25 | v3.6 审查报告（评分 7.0/10） | 已过时     |
| subagent_result3.md        | 2026-06-25 | 深度问题诊断                 | 已过时     |
| subagent_result4.md        | 2026-06-25 | 内容完善方案                 | 已过时     |
| subagent_result5.md        | 2026-06-25 | 深度内容扩展方案             | 已过时     |

### 5.2 已修复 vs 仍待处理

**已修复（v3.7→v3.8 期间）**：

- ✅ TS 数据目录填充（events/jobs/locations/items/diseases/legal/travel/lifeNodes）
- ✅ 4 大扩展系统常驻面板（人生事务Tab）
- ✅ 城市服务推荐（7 项服务）
- ✅ 社区体检健康字段接线修复
- ✅ 沙盒姓名输入修复
- ✅ 每日收支假平衡修复
- ✅ 收入/支出曲线历史写入
- ✅ 创业注册资金口径统一
- ✅ 状态危机弹窗纵向换行
- ✅ 背包中文名兜底
- ✅ 天气准备入背包
- ✅ 人生目标移出行动列表
- ✅ 职业晋升读真实技能
- ✅ 新闻快报弹窗
- ✅ 位置/天气/住所/仓库压缩进顶部信息条

**仍待处理（来自 memory/diagnosis.md）**：

- P1: TS 数据目录多数未被 legacy 消费 → 仅 cityServices 为 playable
- P1: 超大 legacy 文件继续累积维护风险 → startup.js(14381行) 等
- P1: 扩展系统之间缺少后果链 → 医疗债务/旅行突发/败诉执行链
- P2: lifeNodes 触发节奏偏硬 → 确定时间点，缺概率/提前提示
- P2: 装备品质系统玩家感知不足 → 框架就绪但 UI 弱
- P2: 字段级 TS/legacy 对齐审计不完整
- P2: 项目入口文档分散

### 5.3 当前断点

根据 IMPLEMENTATION_PROGRESS.md 和 CLAUDE.md：

1. **P1 超大文件拆分** — startup.js(14381行)/events_street.js(9827行)/render.js(6422行) 按主题渐进拆分
2. **P1 4 大扩展系统深度联动** — 人生节点概率触发、医疗债务/保险纠纷、旅行行程定制、法律败诉连锁
3. **P2 装备品质系统激活** — 品质框架就绪但玩家无感知，需 UI 展示和获取渠道

---

## 六、关键风险点

| 风险                       | 严重度 | 说明                                      |
| -------------------------- | ------ | ----------------------------------------- |
| startup.js 14,381 行       | 高     | 单体最大文件，修改风险高                  |
| render.js 6,422 行         | 高     | UI 渲染集中，新增 Tab 需改此文件          |
| main.js 4,169 行           | 中     | 游戏引擎核心，改动需谨慎                  |
| events_street.js ~9,827 行 | 中     | 街头事件定义，新增事件需改此文件          |
| investment.bak.js 残留     | 低     | 备份文件，应清理                          |
| 双轨架构边界模糊           | 中     | legacy 和 Vite 壳的边界需清晰维护         |
| TS 数据目录接入率低        | 中     | 仅 cityServices 为 playable，其余为 typed |

---

## 七、结论

城市浮生记 v3.8 是一个**内容丰富度极高**的人生模拟游戏，核心机制完整，4 大扩展系统已实现基础玩法并有常驻面板。当前主要短板是：

1. **超大文件维护风险** — startup.js/render.js/main.js 需要渐进拆分
2. **TS 数据目录接入率低** — 9 个目录中仅 1 个为 playable
3. **扩展系统深度联动不足** — 医疗/旅行/法律/人生节点之间缺少后果链
4. **装备品质系统玩家感知不足** — 框架就绪但 UI 展示弱

项目文档体系完善（CLAUDE.md + DEVELOPMENT.md + memory/ + IMPLEMENTATION_PROGRESS.md），子任务交接机制清晰（subagent_result\*.md），开发护栏规则明确。整体处于**可玩但需持续打磨**的状态。

---

_分析完成。本文件为子任务1产出，供后续子任务读取。_
