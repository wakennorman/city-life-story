# 城市浮生记 v3.6 — 架构分析报告（第3部分：模块关联关系图）

> 扫描时间：2026-06-24 | 项目：city-life-story | JS文件：98个

---

## 3. 各模块间的关联关系图

### 3.1 每日管线步骤顺序（DAILY_PIPELINE — 42步）

```
day_increment → scenario_start_chain
  → needs_decay → status_interactions → sleep_recovery
  → rent → health_tick → habit_tick → illness_roll
  → illness_evolution → needs_check → critical_punish → extreme_check
  → emotion → finance → snapshot → price_update → pricing_market
  → investment_tick → startup_tick → enterprise_fate_tick
  → workplace_social_tick → family_daily → career_job_daily
  → personal_growth_daily → skill_tree_check
  → world_params_tick → npc_location_tick
  → weather → weather_daily_effects → weather_prep_mitigation
  → weather_illness_risk → festival → news
  → chengguan_decay → cleanup → age → reset_training
  → victory → lose → autosave → achievements → dream_check
  → npc_birthday → news_followup → hint_check → end_log
  → ingredient_perish → carry_perish → durability_wear
  → daily_report → npc_bridge → moral_consequences
  → review_improvements_tick → morality_echo → story_chapter_check
  → route_effects → equipment_suites_check → equipment_durability_tick
  → skill_synergy_check → news_bridge → npc_trade_info_share
```

### 3.2 经济系统反馈环

```
玩家行为(工作/交易/投资)
    ↓
world_params.js: sectorHeat↑/playerWealthLevel↑
    ↓  (每日 tickWorldParams)
investment.js: 股价趋势↗、波动率变
events_core.js: 事件权重偏移（行业热门→事件触发率↑）
news.js: 新闻概率调整
jobs.js: 工作收入乘数（世界参数→收入±15%）
    ↓
玩家收入变化 → 新一轮行为选择
```

### 3.3 NPC 系统×事件交叉引用

```
NPC定义(npcs.js)
  ├─好感度→cross_system_events.js 条件（好感≥30/40 解锁事件）
  ├─好感度→npc_event_bridge.js 技能双门槛解锁（好感80+技能40→福利）
  ├─好感度→wiki.js 百科剧透解锁（生日/礼物/委托故事）
  ├─位置日程→npc_location_bridge.js → 地点偶遇
  ├─在场概率→skill_bonuses.js getNpcPresenceBonus → 工作收入加成
  ├─节日对话→festivals.js 节日事件中NPC互动
  └─flag→inheritance_chain.js 多周目峰值好感继承
```

### 3.4 装备/技能/连携联动

```
装备品质(equipment_quality.js)
  ├─影响 durability.js 初始耐久值
  ├─影响 main.js estimateJobPayDetailed 收入乘数
  └─影响 equipment_suites.js 套装检测

装备套装(equipment_suites.js)
  ├─每日管线 equipment_suites_check 步骤
  └─输出到 state.equipmentSuites → UI 渲染

技能树(skill_tree.js)
  ├─分支选择 → skill_synergy.js 连携检测
  ├─天赋节点 → 工作收入加成/成本减免
  └─每日管线 skill_tree_check 步骤

技能协同(skill_synergy.js)
  ├─每日管线 skill_synergy_check 步骤
  └─输出到 state.skillSynergies → UI 渲染
```

### 3.5 天气×经济×事件联动

```
天气系统(weather.js)
  ├─outdoorMod → 街头工作收入（已修复，v3.6）
  ├─priceMod → 节日/季节价格（已修复，v3.6）
  ├─illnessRisk → 疾病概率
  └─极端天气 → 事件权重调整

节日系统(festivals.js)
  ├─节日价格浮动 → pricing.js 消费
  ├─节日事件链 → events_core.js 队列
  └─NPC节日对话 → npcs.js
```

### 3.6 新闻系统传导链

```
新闻系统(news_system.js)
  ├─L1国际新闻 → 60%概率触发L2（2-4日后）
  ├─L2国内政策 → 50%概率触发L3（1-3日后）
  ├─L3城市动态 → 40%概率触发L4（1-2日后）
  └─新闻影响 → investment.js 股价趋势
  └─新闻影响 → events_core.js 事件权重
  └─新闻影响 → world_params.js 行业热度
```

### 3.7 创业/职场/投资三线关系

```
创业(startup.js)
  ├─需要技能门槛（coding/management等）
  ├─员工招聘 → 需要NPC好感/社交
  ├─融资 → 受世界参数行业热度影响
  └─退出 → 与职场路线互斥（不能同时打工+创业）

职场(corp_ops.js)
  ├─季度KPI → 影响晋升
  ├─办公室政治 → 职场社交事件
  └─与创业互斥（不能同时）

投资(investment.js)
  ├─股票 → 受新闻/世界参数影响
  ├─房产 → 受市场周期影响
  ├─与创业/职场可并行（副业）
```

### 3.8 多周目继承链

```
多周目继承(inheritance_chain.js)
  ├─声誉徽章 → 新周目初始属性加成
  ├─NPC记忆 → 峰值好感继承
  ├─技能树保留 → 技能等级继承
  └─现金继承 → 传承币购买加成

传承币(heritage_coin.js)
  ├─6项NG+永久解锁
  └─互斥选择（Hades风格）
```

### 3.9 道德系统链路

```
道德事件(moral_events.js)
  ├─triggerMoralEvent → consumeAP中调用（8%概率）
  ├─pendingConsequences → 加入队列
  └─checkMoralConsequences → 每日管线 moral_consequences 步骤

违法行为(illegal_actions.js)
  ├─违法热度累积 → 城管突击
  └─道德回响 → 良知反噬
```

### 3.10 数据流总览

```
┌─────────────────────────────────────────────────────────────┐
│                     唯一状态源 (state.js)                     │
│  Proxy变更追踪 → dirty flag → render.js按需渲染              │
└─────────────────────────────────────────────────────────────┘
         ↓                      ↓                      ↓
   core/*.js            data/*.js               ui/*.js
  (逻辑处理)           (静态数据)               (界面渲染)
         ↓                      ↓                      ↓
   daily_pipeline.js    events_*.js           modal.js
  (每日管线)           (事件池)               (弹窗)
         ↓                      ↓                      ↓
   存档(save.js)        跨系统联动            数据可视化
```
