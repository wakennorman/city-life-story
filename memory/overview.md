# 2026-06-26 现状摸底：城市浮生记审查改进与扩展（第二轮）

## 双轨架构覆盖

### legacy 侧（正式入口 `src/index.html` → `python build.py` → `dist/index.html`）

- **数据层**（`src/js/data/`）：locations, jobs, goods, items, news, skills, npcs, scenarios, corp, amenities, illnesses, moral_events, crisis35_followups, mechanics_registry, narratives_registry, victories_registry
- **核心引擎**（`src/js/core/`）：events_street(9827行), events_corp, events_core, state, save, random, weather, festivals, dreams, achievements, skill_tree, social_network, npc_relationships, era_transform, cross_system_events, news_system, news_event_bridge, news_investment_bridge, world_params, life_nodes, medical, travel, legal, life_ribbon, story_chapters, inheritance_chain, enterprise_fate, company_spawner, multi_run_memory, equipment_quality/durability/suites, skill_synergy, action_sort, sound, sort_utils, route_effects, difficulty_system, review_improvements, finance, heritage_coin, illegal_actions, cooking
- **Phase1 阶段**：trade, needs, interactions, illness, critical, skill_bonuses, actions_extra, daily_pipeline, carry, pricing, npc_event_bridge, npc_location_bridge
- **Phase2 阶段**：perf, promo, team, stock, corp_ops, investment(3638行), property_market, startup(14443行), workplace_social, investment_analysis, startup_crisis, family_life, personal_growth, side_hustle
- **UI层**（`src/js/ui/`）：render(6431行), wiki(3760行), modal, corp_ui, heritage_store, tutorial, daily_focus, victory, wiki, daily_report, social_tab, career_dev, data_viz, side_hustle_ui, life_memoir
- **桥接层**：`src/js/app_bridge/webapp_runtime_bridge.js`（连接新数据目录到旧 UI）

### 新架构侧（根目录 `index.html` + `src/app/` + Vite/TypeScript）

- **数据目录**（`src/app/data/`）：events(12), jobs(12), locations(14), items(17), diseases(12), legal(7), travel(8), lifeNodes(4), cityServices(7)
- **桥接层**：`src/app/core/gameBridge.ts`, `src/app/core/stateAccess.ts`, `src/app/core/saveMigrations.ts`
- **调试**：`src/app/debug/healthCheck.ts`
- **UI壳**：`src/app/shell/appShell.ts`, `src/app/ui/panels.ts`

### 关键统计

- legacy JS 文件数：~75 个，总行数 ~85,000+
- TS 文件数：~15 个，总行数 ~2,200
- 双构建入口：`python build.py`（legacy）和 `npm run build`（Vite）

## 当前完成度

- **内容量**：事件 200+、职业 35+、地点 15、NPC 10、商品 20+、装备 30+、疾病 16 种、食材 23+、食谱 16、创业产品 15+、投资品 5 类
- **系统模块**：生存需求、天气、节日、技能树、装备品质/耐久/套装、NPC 好感、社交网络、比赛、投资(股票/BTC/贵金属/期货基金/房产/汽车)、创业(6行业/15产品/15模块/6员工/5轮融资/30+事件)、企业命运、时代变迁、多周目继承、人生节点、医疗深度、旅行、法律、副业、人生回忆录、成就(50+)
- **移动端**：底部抽屉侧栏、横向滚动 tab、单列行动卡片、事件记录可折叠；CSS 已追加两轮适配

## 初步薄弱点

### P0 级别

1. **投资系统数据口径不一致**：虚拟币买入走 `stockHoldings` 但汇总读旧 `btcHoldings`，导致虚拟币买了显示为0；虚拟币/贵金属/期货基金混入股票页"我的持仓"；总资产曲线漏算大部分投资品
2. **移动端 CSS 仍有隐藏逻辑**：第一段 `@media (max-width: 480px)` 仍隐藏 `#street-stats-section` 和 `#corp-stats-section`，后面虽被覆盖但存在时序冲突
3. **欢迎页胜利路线文案**：连续文本在手机端可能被浏览器拆词，需完整保护

### P1 级别

4. **投资分类 UI 不一致**：各资产子页持仓信息框不统一，部分只显示卡片内局部持仓
5. **生涯系统联动缺口**：创业触发从上班路径读取不够直观，事业建议可更丰富
6. **百科系统**：部分条目内容偏薄，缺少跨系统跳转
7. **事件记录移动端**：折叠/展开已有实现，但自动滚动到最新记录可改进

### P2 级别

8. **整体 UI 细节**：部分面板在移动端有微小溢出
9. **经济平衡**：中后期仍可能出现资金积累过度
10. **文档 vs 实况差距**：部分记忆文件内容落后于当前代码
