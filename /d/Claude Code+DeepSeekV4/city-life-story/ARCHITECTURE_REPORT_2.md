# 城市浮生记 v3.6 — 架构分析报告（第2部分：系统清单与目录结构）

> 扫描时间：2026-06-24 | 项目：city-life-story | JS文件：98个

---

## 2. 系统清单（按目录分组）

### 2.1 Core（核心引擎）— 38 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `state.js` | ~796 | 唯一状态源，Proxy变更追踪 |
| `world_params.js` | ~350 | 世界参数反馈环，行业热度/市场情绪 |
| `events_core.js` | ~430 | 事件引擎核心，队列管理，弹窗UI |
| `events_corp.js` | ~200 | 职场事件池 |
| `events_street.js` | ~400 | 街头事件池 |
| `cross_system_events.js` | ~632 | 跨系统联动事件（v3.6扩展） |
| `npc_location_bridge.js` | ~93 | NPC位置日程关联（v3.6扩展） |
| `story_chapters.js` | ~280 | 主线章节（v3.1） |
| `route_effects.js` | ~150 | 路线效应 |
| `weather.js` | ~700 | 天气系统，9种天气+极端天气 |
| `weather_forecast.js` | ~150 | 天气预报 |
| `festivals.js` | ~800 | 节日系统，春节7天+清明/中秋 |
| `life_ribbon.js` | ~280 | 人生缎带（v3.1） |
| `achievements.js` | ~400 | 成就系统 |
| `heritage_coin.js` | ~300 | 传承币系统 |
| `inheritance_chain.js` | ~350 | 多周目继承 |
| `difficulty_system.js` | ~150 | 难度系统 |
| `dreams.js` | ~200 | 梦想系统 |
| `skill_synergy.js` | ~200 | 技能协同 |
| `skill_tree.js` | ~350 | 技能天赋树 |
| `skill_intel.js` | ~100 | 技能情报 |
| `equipment_suites.js` | ~250 | 装备套装 |
| `equipment_quality.js` | ~200 | 装备品质 |
| `equipment_durability.js` | ~150 | 装备耐久 |
| `durability.js` | ~100 | 耐久通用 |
| `illegal_actions.js` | ~200 | 违法行为 |
| `action_sort.js` | ~150 | 行动排序 |
| `sort_utils.js` | ~80 | 排序工具 |
| `random.js` | ~100 | 随机数 |
| `save.js` | ~300 | 存档系统 |
| `sound.js` | ~100 | 音效 |
| `company_spawner.js` | ~150 | 公司生成 |
| `enterprise_fate.js` | ~100 | 企业命运 |
| `review_improvements.js` | ~200 | 审查改进事件 |
| `multi_run_memory.js` | ~150 | 多周目记忆 |
| `news_event_bridge.js` | ~100 | 新闻事件桥接 |
| `news_investment_bridge.js` | ~150 | 新闻投资桥接 |
| `news_system.js` | ~400 | 新闻生态系统 |
| `cooking.js` | ~150 | 烹饪系统 |
| `finance.js` | ~200 | 金融系统 |

### 2.2 Data（数据层）— 20 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `npcs.js` | ~800 | NPC定义+好感+技能双门槛 |
| `news.js` | ~300 | 新闻数据 |
| `goods.js` | ~250 | 交易商品定义 |
| `jobs.js` | ~600 | 街头工作定义 |
| `items.js` | ~200 | 物品定义 |
| `illnesses.js` | ~300 | 疾病定义 |
| `scenarios.js` | ~200 | 剧本定义 |
| `scenario_start_chains.js` | ~150 | 剧本开局链 |
| `skills.js` | ~400 | 技能定义 |
| `locations.js` | ~350 | 地图地点数据 |
| `location_flavor.js` | ~150 | 地点风味文本 |
| `moral_events.js` | ~2100 | 道德事件+后果链 |
| `crisis35_followups.js` | ~500 | 35岁危机后续 |
| `narratives_registry.js` | ~200 | 叙事注册表 |
| `victories_registry.js` | ~150 | 胜利注册表 |
| `startup_competition.js` | ~150 | 创业竞赛 |
| `startup_events.js` | ~200 | 创业事件 |
| `amenities.js` | ~100 | 设施定义 |
| `corp.js` | ~500 | 职场数据 |
| `mechanics_registry.js` | ~100 | 机制注册表 |

### 2.3 UI（界面层）— 12 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `render.js` | ~5958 | 主渲染调度器（最大文件） |
| `modal.js` | ~400 | 模态框系统 |
| `wiki.js` | ~350 | 百科系统 |
| `tutorial.js` | ~300 | 引导系统 |
| `victory.js` | ~250 | 胜利结算 |
| `corp_ui.js` | ~350 | 职场UI |
| `career_dev.js` | ~300 | 职业发展UI |
| `social_tab.js` | ~250 | 社交Tab UI |
| `daily_focus.js` | ~200 | 每日聚焦 |
| `daily_report.js` | ~150 | 每日报告 |
| `data_viz.js` | ~200 | 数据可视化 |
| `heritage_store.js` | ~150 | 传承商店UI |

### 2.4 Phase1（街头玩法）— 13 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `daily_pipeline.js` | ~900 | 每日结算管线（42步） |
| `actions_extra.js` | ~276 | 位置×技能特色行动（v3.6扩展） |
| `carry.js` | ~200 | 搬运系统 |
| `trade.js` | ~400 | 交易系统 |
| `pricing.js` | ~250 | 价格波动 |
| `needs.js` | ~200 | 需求衰减 |
| `illness.js` | ~250 | 疾病处理 |
| `critical.js` | ~150 | 极端状态 |
| `interactions.js` | ~150 | 状态交叉影响 |
| `skill_bonuses.js` | ~200 | 技能加成 |
| `npc_event_bridge.js` | ~200 | NPC事件桥接 |
| `trade_intel.js` | ~100 | 交易情报 |
| `extra_events.js` | ~150 | 额外事件 |

### 2.5 Phase2（进阶玩法）— 13 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `startup.js` | ~600 | 创业系统 |
| `investment.js` | ~450 | 投资系统 |
| `stock.js` | ~300 | 股票交易 |
| `property_market.js` | ~250 | 房产市场 |
| `investment_analysis.js` | ~150 | 投资分析 |
| `corp_ops.js` | ~350 | 职场操作 |
| `family_life.js` | ~200 | 家庭生活 |
| `workplace_social.js` | ~150 | 职场社交 |
| `personal_growth.js` | ~150 | 个人成长 |
| `promo.js` | ~100 | 推广 |
| `team.js` | ~150 | 团队 |
| `startup_crisis.js` | ~150 | 创业危机 |
| `perf.js` | ~100 | 性能 |

### 2.6 Components — 1 文件

| 文件 | 行数(约) | 功能 |
|------|----------|------|
| `companyHistory.js` | ~100 | 公司历史 |
