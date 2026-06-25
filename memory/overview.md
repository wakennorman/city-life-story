# 城市浮生记 v3.8 审查改进与扩展：现状摸底

更新时间：2026-06-25

## 双轨架构状态

### 旧架构（legacy，正式可玩入口）

- **入口**：`src/index.html` → `python build.py` → `dist/index.html`
- **运行时**：114 个 `.js` 文件通过 100+ `<script>` 标签顺序加载，全局变量（window.\*）共享
- **状态来源**：`window.StateManager`（Proxy + dirty flag 驱动渲染）
- **数据层**：`src/js/data/` — 10 个数据文件（locations/603行, jobs/1342行, goods/593行, items/1131行, news/1870行, npcs/3150行, illnesses/460行, skills/244行 等）
- **核心引擎**：main.js(4148行) / render.js(6024行) / events_street.js(9827行) / startup.js(14277行)
- **经济系统**：trade(套利), investment(股票+房产+BTC+贵金属), startup(完整创业), property_market(波动), stock(K线)
- **社交系统**：10 NPC (npc_relationships + npc_event_bridge + npc_location_bridge), social_network(社交网络/网红), social_tab(合并Tab)
- **扩展系统**：life_nodes(人生节点带弹窗), medical(医疗/医保/康复), travel(5目的地+旅行事件), legal(4种案件+诉讼)
- **长期留存**：inheritance_chain(多周目继承), heritage_coin(传承币), life_ribbon(12条缎带), story_chapters(3章主线), enterprise_fate(企业命运)
- **每日管线**：daily_pipeline.js — 15+ 步骤（需求/工资/住房/NPC/节日/新闻/人生节点/医疗/旅行/法律/副业/webapp等）
- **百科系统**：mechanics_registry / narratives_registry / victories_registry 三注册表驱动

### 新架构（Vite + TypeScript，并行开发壳）

- **入口**：根目录 `index.html` + `package.json` + `tsconfig.json` + `vite.config.mjs`
- **产物**：`dist-webapp/`（不重叠 `dist/`）
- **TS 数据目录**：`src/app/data/` 下 8 个子目录已进入首批可用状态：events(12) / jobs(12) / locations(14) / items(17) / diseases(12) / legal(7) / travel(8) / lifeNodes(4)，另有 cityServices(7)
- **核心服务**：gameBridge.ts / stateAccess.ts / saveMigrations.ts — typed facade，不复制实际状态
- **UI**：panels.ts / appShell.ts — 基础架构面板
- **调试**：healthCheck.ts — 架构健康检查

### 桥接层（bridge，连接双轨）

- **文件**：`src/js/app_bridge/webapp_runtime_bridge.js`（0.3.0）
- **暴露**：`window.WebAppBridge` 含 ensureSaveMeta / showCityServiceModal / applyCityService / tickCityServices / getRecommendedCityServices / getDataCatalogSummary
- **注入玩法**：7 个城市服务（劳动争议预检/医保账单复核/周末城市微旅行/社保查询/信用报告/公积金咨询/社区体检）→ 写入 `_webApp.schemaVersion=2`
- **内容感知**：`WEBAPP_DATA_CATALOG_SUMMARY` 暴露 TS 数据目录首批数量，供旧运行时和调试面板读取
- **管线集成**：`daily_pipeline.js` 末尾有 `webapp_city_services_tick` 步骤
- **行动集成**：`actions_extra.js` 中通过 `addWebAppBridgeActions` 注入

## 验证状态

- ✅ `npm run check:js` — 114 文件通过
- ✅ `npm run typecheck` — 零错误
- ✅ `npm run check:ts-data` — 8 个 TS 数据目录通过最低覆盖审计
- ✅ `python build.py` — 构建成功（4185.6 KB）
- ✅ `npm run build` — Vite 构建成功（dist-webapp/）

## 当前完成度

### 已就绪 ✅

- 完整的两阶段游戏（街头生存 → 公司/创业）
- 丰富的事件系统（163+街头 + 36职场 + 19跨系统 + 93道德 + 8时代事件）
- 完整的经济系统（工作/交易/投资/房产/股票/BTC/创业/副业）
- 10 NPC 好感/位置/事件联动网络
- 4 大扩展系统（人生节点+医疗+旅行+法律）基础实现，均已接入管线且有 UI
- 长期留存体系（多周目/传承币/缎带/回忆录/企业命运）
- 多窗口开发保护（git hooks + sessionStart 同步检查）
- Web App 桥接架构已落地（Vite/TS 壳 + bridge 注入真实玩法）

### 薄弱 / 待完成 ⚠️

- **TS 数据目录已补首批，但 legacy 未全面消费**：当前 TS 侧有 93 条内容目录记录；除城市服务和部分旅行/人生节点外，多数仍处于 typed 数据源阶段，未全部进入旧游戏行动/事件池
- **桥接层仍偏薄**：城市服务已扩到 7 个动作并暴露数据目录摘要，但事件/职业/物品等还未形成自动注册到 legacy 的通用 bridge
- **超大文件风险**：startup.js(14277行) / events_street.js(9827行) / render.js(6024行) / main.js(4148行) — global 耦合持续累积
- **main.js 重构未做**：CLAUDE.md 接力清单中唯一未完成的项
- **4 扩展系统待深化**：人生节点概率弹窗UI、医疗系统独立Tab、旅行行程定制、法律案件事件链、各系统深度联动
- **后期经济平衡**：创业后期资金是否仍有溢出、单一策略是否过强需验证
- **启动屏幕/UI信息层级**：Tab 和侧栏内容越来越多，需要检查信息过载
- **文档同步**：CLAUDE.md 的接力清单部分项已完成但未更新标记

### 缺失 / 未探索 ❌

- 装备品质系统（框架就绪但未完全激活）
- 实战平衡验证（长跑脚本已验证到 Day 1260，但非人工完整游玩）
- TS 数据目录与 legacy JS 的字段级对齐审计（当前已有最低数量审计，尚未做字段一一对齐）
