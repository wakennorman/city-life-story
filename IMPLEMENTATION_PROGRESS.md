# v3.7 进度总控

> 每完成一步，把 ❌ 改成 ✅
> 下个 Agent 读这个就知道从哪继续

## 2026-06-25 v3.8 Web App 架构第一阶段

| #   | 任务           | 状态 | 说明                                                                                                                                     |
| --- | -------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A   | 现状复盘       | ✅   | `memory/webapp_migration_overview.md`，确认 legacy 入口、全局状态、存档键和不可立即重写模块                                              |
| B   | 架构方案       | ✅   | `memory/webapp_architecture_plan.md`，确定 Vite + TypeScript + 原生 DOM 的桥接式迁移路线                                                 |
| C   | Web App 架构壳 | ✅   | 根目录 `index.html` + `package.json` + `src/app/`，Vite 构建输出到 `dist-webapp/`                                                        |
| D   | legacy 桥接层  | ✅   | `src/js/app_bridge/webapp_runtime_bridge.js` + `actions_extra.js` + `daily_pipeline.js` 注入入口和次日反馈，不替换 `src/index.html`      |
| E   | 真实玩法验证   | ✅   | 城市服务中心：劳动争议预检、医保账单复核、周末城市微旅行，写入 `_webApp.schemaVersion=2`，并产生法律底气/医疗账单意识/城市熟悉度后续状态 |
| F   | 后续开发提醒   | ✅   | `CLAUDE.md` / `src/DEVELOPMENT.md` / migration docs 记录新架构边界和新增内容路径                                                         |
| G   | 验证           | ✅   | `npm run typecheck`、`npm run check:js`、`npm run build`、`python build.py` 通过；Chrome Headless 验证正式游戏和 `dist-webapp` 架构壳    |

## 2026-06-25 v3.8 审查改进与扩展

| #   | 任务     | 状态 | 说明                                                        |
| --- | -------- | ---- | ----------------------------------------------------------- |
| A   | 现状摸底 | ✅   | `memory/overview.md`（v3.8 版，双轨架构覆盖新 TS 数据目录） |
| B   | 问题诊断 | ✅   | `memory/diagnosis.md`（16 项 P0/P1/P2 问题）                |
| C   | 改进方案 | ✅   | `memory/improvement_plan.md`（6 项 P0+P1 方案）             |
| D   | 实装交付 | ✅   | 见以下详细清单                                              |

### P0 改进（已实装）

| #   | 项目                       | 文件                                         | 行数 | 验证 |
| --- | -------------------------- | -------------------------------------------- | ---- | ---- |
| 1   | lifeNodes TS 数据目录填充  | `src/app/data/lifeNodes/index.ts`            | ~220 | ✅   |
| 2   | cityServices TS 数据扩展   | `src/app/data/cityServices.ts`               | ~155 | ✅   |
| 3   | healthCheck.ts 拓展        | `src/app/debug/healthCheck.ts`               | ~100 | ✅   |
| 4   | 桥接层扩展（3→7 服务）     | `src/js/app_bridge/webapp_runtime_bridge.js` | ~510 | ✅   |
| 5   | bridge 自动推荐            | `src/js/app_bridge/webapp_runtime_bridge.js` | ~50  | ✅   |
| 6   | TS typed facade 扩系统字段 | `src/app/types/game.ts`                      | ~200 | ✅   |
| 7   | events/jobs/locations/items/diseases/legal/travel TS 数据目录补全 | `src/app/data/*/index.ts` + `src/app/data/index.ts` | ~1200 | ✅   |
| 8   | TS 数据目录审计脚本        | `scripts/audit-ts-data.mjs` + `package.json` | ~120 | ✅   |
| 9   | Vite 内容目录面板 + bridge 摘要 | `src/app/ui/panels.ts` + `src/js/app_bridge/webapp_runtime_bridge.js` | ~90 | ✅   |

### P1 改进（已实装）

| #   | 项目             | 文件                                                            | 行数 | 验证 |
| --- | ---------------- | --------------------------------------------------------------- | ---- | ---- |
| 7   | 住房维护费       | `src/js/phase1/daily_pipeline.js`                               | ~35  | ✅   |
| 8   | 社交圈维护费     | `src/js/phase1/daily_pipeline.js`                               | ~40  | ✅   |
| 9   | 差异化开局债务   | `src/js/core/inheritance_chain.js`                              | ~35  | ✅   |
| 10  | NPC 常规对话深化 | `src/js/phase1/npc_event_bridge.js` + `src/js/ui/social_tab.js` | ~180 | ✅   |

### v3.8 后续阶段

- 阶段 2：抽出 StateManager facade、消息/AP/现金服务和统一 action runner。
- 阶段 3：✅ 首批完成。events/jobs/locations/items/diseases/legal/travel/lifeNodes 均已有实际 TS 数据；`npm run check:ts-data` 可审计最低覆盖。
- 阶段 4：逐步迁移医疗、法律、旅行、生活服务等独立面板，主布局暂不重写。
- 阶段 5：当 `src/app` 能稳定承载核心状态、存档、数据和主要 UI 后，再评估正式入口切换。

## 2026-06-25 v3.0 审查改进与扩展

| #   | 任务     | 状态 | 说明                                                                                                                                                                |
| --- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | 现状摸底 | ✅   | `memory/overview.md`                                                                                                                                                |
| B   | 问题诊断 | ✅   | `memory/diagnosis.md`                                                                                                                                               |
| C   | 改进方案 | ✅   | `memory/improvement_plan.md`                                                                                                                                        |
| D   | 实装交付 | ✅   | 人生节点弹窗/旅行入口/法律入口/医保入口/Phase 2 跳转/审计脚本路径；`audit_events.js` 已恢复真实事件扫描                                                             |
| E   | 验证     | ✅   | 全量 `src/js` 语法通过；`audit_events.js` 检查 225 个事件；`audit_connections.js` 0 问题/45 建议；`python build.py` 成功；Chrome Headless 完整压力试玩通过 Day 1260 |

| #   | 任务                          | 状态 | 说明                                                   |
| --- | ----------------------------- | ---- | ------------------------------------------------------ |
| 0   | P0（副业/经济/开支/链式事件） | ✅   | commit a33af08                                         |
| 1   | P1-1 新闻→投资UI              | ✅   | investment.js：今日市场驱动板块                        |
| 2   | P1-2 NPC好感链路              | ✅   | npcs.js + npc_event_bridge.js：affinityEvents 30/60/80 |
| 3   | P1-4 家庭系统                 | ✅   | family_life.js：NPC求婚 + 生子/子女教育                |
| 4   | P1-6 35岁危机追访             | ✅   | events*core.js：c35*追访权重×3                         |
| 5   | P2-4 道德事件扩充             | ✅   | moral_events.js：基线重建18个极端生存事件              |
| 6   | 社交网络UI集成                | ✅   | social_network.js → social_tab.js                      |
| 7   | 扩展系统                      | ✅   | 旅行/医疗/法律/人生节点 v1 基础实现 + main.js集成      |

## 已提交

- 155da2b — P1-3 scaleEventReward + P1-5 rollEquipmentDrop + social_network.js骨架
- 1bb3a22 — 进度文档
- 本次提交 — P1-1 新闻→投资UI：今日市场驱动板块
- 本次提交 — P1-2 NPC好感链路：affinityEvents + checkNpcAffinityEvents
- 本次提交 — P1-4 家庭系统：NPC求婚 + 生子/子女教育
- 本次提交 — P1-6 35岁危机追访：追访事件权重×3
- 本次提交 — P2-4 道德事件扩充：18个极端生存困境
- 本次提交 — 社交网络UI集成：社交Tab子页 + 每日tick
