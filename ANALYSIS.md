# city-life-story (城市浮生记) — 架构与内容分析报告

> 版本 v3.5 | 92 个 JS 文件 | 单页 HTML5 应用（全部 JS 内联到 dist/index.html）

---

## 1. 游戏机制清单

### 核心生存机制
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 四维需求 | `phase1/needs.js` | 饥饱/疲劳/卫生/心情(0-100)每日衰减+交互恢复 | 中等 |
| 健康/伤病 | `phase1/illness.js`, `data/illnesses.js` | 22+种命名疾病，习惯触发，药店/医院两档治疗 | 复杂 |
| 属性成长 | `phase1/skill_bonuses.js`, `core/state.js` | 5主属性(体质/智力/敏捷/心智/颜值)+道德+名气 | 中等 |
| 行动力(AP) | `core/state.js` | 每日100AP，行动消耗AP，睡眠恢复 | 简单 |
| 极端状态检测 | `phase1/critical.js` | 需求归零触发昏迷/skip_day 短路管线 | 中等 |

### 经济系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 交易/摆摊 | `phase1/trade.js` | 买低卖高，24种商品，12个地点价差 | 复杂 |
| 价格波动 | `phase1/pricing.js` | 供需模型+新闻冲击+季节波动+节日促销 | 复杂 |
| 搬运系统 | `phase1/carry.js` | 重量/体积/易碎/容器/运输服务 | 中等 |
| 银行/债务 | `core/finance.js` | 银行存款生息+债务复利+中产税 | 中等 |
| 炒股 | `phase2/stock.js`, `phase2/investment.js` | 30+8只股票+比特币+贵金属+期货基金 | 复杂 |
| 房产投资 | `phase2/property_market.js` | 4阶段市场周期(boom/stable/cooling/bust) | 复杂 |
| 创业 | `phase2/startup.js` | 6行业+三阶段(种子/成长/退出)+融资+IPO | 极复杂 |

### 职业系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 街头工作 | `main.js` (doStreetJob) | 30+种临时工，依赖属性+技能+装备+新闻 | 复杂 |
| 职场(上班族) | `data/corp.js`, `ui/corp_ui.js` | 6路径×22职位，季度KPI+晋升+办公室政治 | 极复杂 |
| 技能培养 | `data/skills.js`, `core/skill_tree.js` | 10技能(0-100)，Lv30分支选择+天赋节点 | 复杂 |
| 技能协同 | `core/skill_synergy.js` | 8对双技能+4组三技能+3主题连携 | 复杂 |

### NPC 系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| NPC定义 | `data/npcs.js` | 6个核心NPC（好感0-100）+礼物/节日/对话 | 中等 |
| NPC位置关联 | `core/npc_location_bridge.js` | 5NPC×4时段日程→15活跃地点 | 中等 |
| NPC在场概率 | `data/npcs.js` | 确定性哈希判定(0.65-0.85) | 简单 |
| NPC技能双门槛 | `phase1/npc_event_bridge.js` | 好感80+技能40→解锁福利 | 中等 |
| NPC交易情报 | `phase1/npc_event_bridge.js` | NPC主动分享交易信息 | 简单 |

### 装备系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 装备品质 | `core/equipment_quality.js` | 4档(普通/稀有/史诗/传说)+随机附魔 | 中等 |
| 装备套装 | `core/equipment_suites.js` | 6套装×3档效果(2/3/4件) | 中等 |
| 装备耐久 | `core/equipment_durability.js` | 行动消耗耐久+修理系统 | 中等 |

### 世界系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 天气系统 | `core/weather.js` | 9种天气+4季+温度+户外影响 | 中等 |
| 天气预报 | `core/weather_forecast.js` | 次日预报70%准确+准备行动(伞/暖宝) | 简单 |
| 世界参数环 | `core/world_params.js` | 6行业热度+市场情绪+玩家反馈→事件权重 | 复杂 |
| 新闻系统 | `data/news.js`, `core/news_system.js` | 4层新闻生态(L1事件→L2→L3→L4)+价格冲击 | 复杂 |
| 节日系统 | `core/festivals.js` | 5节日+价格波动+春节7天活动+清明/中秋深度 | 复杂 |
| 城管系统 | `core/illegal_actions.js` (含) | 违法热度累积+城管突击 | 简单 |

### 元系统
| 机制 | 文件 | 说明 | 复杂度 |
|------|------|------|--------|
| 主线章节 | `core/story_chapters.js` | 第30/180/365天叙事检查点 | 简单 |
| 路线效应 | `core/route_effects.js` | 5条结局路线被动加成+周期性事件 | 中等 |
| 人生缎带 | `core/life_ribbon.js` | 12条缎带，从行为涌现，跨周目收集 | 中等 |
| 成就系统 | `core/achievements.js` | 40+成就(人生第一次/里程碑/道德/隐藏) | 中等 |
| 传承币 | `core/heritage_coin.js` | 6项NG+永久解锁(Hades风格互斥) | 中等 |
| 多周目继承 | `core/inheritance_chain.js` | 声誉徽章+NPC记忆+技能树保留+现金继承 | 中等 |
| 难度系统 | `core/difficulty_system.js` | 3档(休闲/标准/困难)+参数差异化 | 简单 |
| 梦想系统 | `core/dreams.js` | 开局选择人生目标，进度追踪 | 简单 |
| 违法行为 | `core/illegal_actions.js` | 8种违法+道德回响(良知反噬) | 中等 |

---

## 2. 系统清单（按目录分组）

### Core（核心引擎）— 28 文件
`state.js`, `world_params.js`, `events_core.js`, `events_corp.js`, `events_street.js`, 
`cross_system_events.js`, `story_chapters.js`, `route_effects.js`, `weather.js`,
`weather_forecast.js`, `festivals.js`, `life_ribbon.js`, `achievements.js`,
`heritage_coin.js`, `inheritance_chain.js`, `difficulty_system.js`, `dreams.js`,
`skill_synergy.js`, `skill_tree.js`, `skill_intel.js`, `equipment_suites.js`,
`equipment_quality.js`, `equipment_durability.js`, `durability.js`, `illegal_actions.js`,
`action_sort.js`, `sort_utils.js`, `random.js`, `save.js`, `sound.js`,
`company_spawner.js`, `enterprise_fate.js`, `npc_location_bridge.js`,
`review_improvements.js`, `multi_run_memory.js`, `news_event_bridge.js`,
`news_investment_bridge.js`, `news_system.js`, `cooking.js`, `finance.js`

### Data（数据层）— 14 文件
`npcs.js`, `news.js`, `goods.js`, `jobs.js`, `items.js`, `illnesses.js`,
`scenarios.js`, `scenario_start_chains.js`, `skills.js`, `locations.js`,
`location_flavor.js`, `moral_events.js`, `crisis35_followups.js`,
`narratives_registry.js`, `victories_registry.js`, `startup_competition.js`,
`startup_events.js`, `amenities.js`, `corp.js`, `mechanics_registry.js`

### UI（界面层）— 12 文件
`render.js` (5949行，最大), `modal.js`, `wiki.js`, `tutorial.js`, `victory.js`,
`corp_ui.js`, `career_dev.js`, `social_tab.js`, `daily_focus.js`, `daily_report.js`,
`data_viz.js`, `heritage_store.js`

### Phase1（街头玩法）— 12 文件
`daily_pipeline.js`, `actions_extra.js`, `carry.js`, `trade.js`, `pricing.js`,
`needs.js`, `illness.js`, `critical.js`, `interactions.js`, `skill_bonuses.js`,
`npc_event_bridge.js`, `trade_intel.js`, `extra_events.js`

### Phase2（进阶玩法）— 13 文件
`startup.js`, `investment.js`, `stock.js`, `property_market.js`, `investment_analysis.js`,
`corp_ops.js`, `family_life.js`, `workplace_social.js`, `personal_growth.js`,
`promo.js`, `team.js`, `startup_crisis.js`, `perf.js`

### Components — 1 文件
`companyHistory.js`

---

## 3. 事件系统清单

| 事件系统 | 文件 | 约计数 | 触发条件 | 后续连锁 |
|----------|------|--------|----------|----------|
| 街头随机事件 | `core/events_street.js` | ~80+ | 每日18%基础概率，健康/债务/心情修正 | 部分设flag |
| 职场随机事件 | `core/events_corp.js` | ~40+ | 每日22%基础概率 | 部分设flag |
| 链式/队列事件 | `core/events_core.js` | 统一池 | 优先检查心理危机(mental<20)/债务追讨 | 依赖flag队列 |
| 主线章节事件 | `core/story_chapters.js` | 3章×4-5分支 | 第30/180/365天强制弹窗 | 路线flag→route_effects |
| 跨系统联动 | `core/cross_system_events.js` | 17条 | NPC好感+行业热度+天气+季节+道德 | 有(flag链) |
| 道德事件 | `data/moral_events.js` | ~20条 | dailyChance触发+后果链 | 有(后果系统) |
| 35岁危机后续 | `data/crisis35_followups.js` | 8条 | 35岁后30-90天 | 有(3路径延伸) |
| 额外事件 | `phase1/extra_events.js` | 15条 | 季节/好感/天气条件 | 部分有 |
| 节假日事件 | `core/festivals.js` | 5节日+春节7天+清明/中秋 | 天对应日自动触发 | 有(NPC/道德联动) |
| 新闻事件 | `data/news.js` | ~30条+ | 每日roll新闻+4层传导链 | 有(L1→L2→L3→L4) |
| 创业事件 | `data/startup_events.js` | ~15条 | 创业阶段每日8%概率 | 有 |
| 体检异常二阶 | `core/review_improvements.js` | 2条 | 体检异常flag触发 | 有(二阶事件) |
| 路线专属事件 | `core/route_effects.js` | 5条 | 按间隔触发 | 单次 |

**示例事件链**：`保温杯泡枸杞(体检异常)→wt_recheck_diagnosis(去三甲复查/忽视/偏方)→wt_chronic_disease_lifestyle(调整生活方式/继续996)`

---

## 4. 模块间关联关系

### 每日管线步骤顺序（DAILY_PIPELINE — 42步）

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

### 经济系统反馈环

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

### NPC 系统×事件交叉引用

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

### 装备/技能/连携联动

```
装备品质(equipment_quality.js)
  ├─影响 durability.js 初始耐久值
  ├─影响 main.js estimateJobPayDetailed 收入乘数
  └─匹配 equipment_suites.js 套装检测
  
技能系统(skills.js + skill_tree.js)
  ├─skill_bonuses.js 技能→系统加成(做饭折扣/旅行AP/银行利率)
  ├─skill_synergy.js 双/三技能连携解锁新工作+被动收入
  └─skill_branches(天赋树) → 职场晋升门槛 career_dev.js

套裝+连携 → 每日管线最后3步检测 → 存入 state.equipmentSuites / state.skillSynergies
```

---

## 5. 内容覆盖率评估

| 维度 | 状态 | 说明 |
|------|------|------|
| **街头玩法** | ✅ 完善 | 30+工作、12地点、4季天气、交易系统完整 |
| **职业系统** | ✅ 完善 | 6路径×22职位、季度KPI、晋升/办公室政治完整 |
| **创业系统** | ✅ 完善 | 6行业、三阶段、融资/IPO/被收购/破产完整 |
| **NPC互动** | ✅ 完善 | 好感/礼物/日程/位置/在场/双门槛/情报分享全链路 |
| **装备系统** | ✅ 完善 | 品质/套装/耐久/附魔/修理全面实现 |
| **技能系统** | ✅ 完善 | 10技能+天赋树(分支选择+节点激活)+技能协同 |
| **房产投资** | ✅ 完善 | 4阶段市场周期+政策+新闻联动完整 |
| **股票投资** | ✅ 完善 | 38只股票+比特币+贵金属+K线图+量化指标 |
| **节日系统** | ✅ 完善 | 5节日+春节7天活动+清明/中秋深度事件 |
| **成就系统** | ✅ 完善 | 40+成就(含隐藏)+味觉叙事文本 |
| **主线叙事** | ✅ 完善 | 3章+5条结局路线+路线被动效应 |
| **道德系统** | ✅ 完善 | 20+道德事件+后果链+回响+中产税 |
| **多周目继承** | ✅ 完善 | 传承币+声誉徽章+NPC记忆+技能树保留 |
| **难度系统** | ✅ 完善 | 3档参数化(休闲/标准/困难) |
| **百科系统** | ⚠️ 有基础 | NPC信息隐藏(剧透保护)已实现，但缺少全面游戏机制百科 |
| **数据可视化** | ⚠️ 有基础 | 收入/支出历史快照已实现，雷达图+折线图功能有限 |
| **教程** | ✅ 完善 | 7步强制引导+waitForClick模式+跳过二次确认+高亮增强 |
| **天气系统** | ✅ 完善 | 9天气+预报+准备行动+疾病风险联动 |

### 可深化领域

1. **百科系统**：当前 `wiki.js` 主要展示NPC信息和隐藏成就，缺少完整的机制说明百科
2. **数据可视化**：`data_viz.js` 已有基础折线图，但缺少资产构成饼图、技能雷达对比图等
3. **多周目深度**：传承币6项解锁偏少，可扩展更多NG+内容
4. **多人/在线**：纯单机，无任何社交/排名系统

### 总体评估

**内容密度极高** — 一个92文件的纯前端HTML5游戏，覆盖了从街头生存到职场创业的完整人生模拟。核心经济闭环（交易→投资→创业）和生存压力闭环（需求→健康→金钱）都运转良好。模块化程度高（声明式管线+IIFE注入事件），扩展成本低。

**评分：8.5/10** — 功能完整、内容丰富，少数维度(百科/可视化/多周目)可进一步深化。