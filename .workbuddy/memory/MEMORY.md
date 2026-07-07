# MEMORY.md — 城市浮生记项目长期记忆

> 项目路径：`D:\Claude Code+DeepSeekV4\city-life-story\`
> 关键 SOP 文件：`memory/review-improve-v3.0.md`（v3.0 审查改进）/ `memory/content-expansion-v2.1.md`（内容扩充）/ `memory/1-4-standard-implementation.md`（1.4 标准审计）

## 触发短语

| 用户说                       | 自动加载的 SOP                          |
| ---------------------------- | --------------------------------------- |
| "按 v3.0 审查改进"           | `memory/review-improve-v3.0.md`         |
| "按 v2.1 提示词继续内容扩充" | `memory/content-expansion-v2.1.md`      |
| "按 1.4 标准检查"            | `memory/1-4-standard-implementation.md` |

## v3.0 SOP 硬约束（绝不可违反）

1. 不 cat 整文件（main.js 4000 行、events_street.js 9800 行、render.js 5200 行）→ 只用 grep + 范围 Read（≤80 行/次）
2. 每次改动 ≤20 行；新模块 ≤300 行
3. 不反复 build — 全部改完后最后一次 `python build.py`
4. 街头工作 ≤20 个；行业代表制（每行业 1 NPC）；空地点禁止
5. 任何改动结束必须更新 `src/DEVELOPMENT.md` 顶部
6. 不删文件只改文件；新文件必须论证为什么不能放现有模块
7. 不修改 `build.py` / 不改 `src/index.html` 的 `<script>` 加载顺序 / 不引入外部库
8. **禁止 `git push`**（CLAUDE.md 规则）— 项目无 remote 配置

## v3.0 SOP 已知即时缺陷清单（按下表优先级实施）

| 优先级    | 缺陷                                                | 状态                                      |
| --------- | --------------------------------------------------- | ----------------------------------------- |
| P0-BUGFIX | 村长债复利从未生效（dailyInterest 字段被读未用）    | ✅ 2026-06-23 已修复                      |
| P2-B-2    | 难度曲线分层（休闲/标准/困难）                      | ✅ 2026-06-23 已实施                      |
| P2-E-1    | 传承币系统（NG+ 永久解锁）                          | ✅ 2026-06-23 已实施（API 完整，UI 待加） |
| P2-B-1    | 多周目继承扩展（35岁路径/道德分/NPC巅峰好感）       | ✅ 2026-06-23 已实施                      |
| P1        | main.js 可剥离函数 86 行 `getInvestmentContextLine` | 待办                                      |
| P1        | main.js `startNewGame` → `core/game_lifecycle.js`   | 待办                                      |
| P1        | events_street.js 9827 行拆分（5-6 主题文件）        | 待办                                      |
| P2-C-1    | 主线/副本 fork（3 章式结局路线）                    | 待办                                      |
| P2-C-2    | 节日深度（清明回乡/中秋探亲）                       | 待办                                      |
| P2-D-1    | 主界面折叠 12 tabs → 3 大组                         | 待办                                      |

## 项目架构要点

- **入口**：`src/index.html`（开发）/ `dist/index.html`（部署，由 `python build.py` 打包）
- **技术栈**：纯 HTML5 + CSS + Vanilla JS，零框架，无 npm 构建
- **核心架构**：世界参数反馈环 v1.7 — `src/js/core/world_params.js` 定义 `_worldParams`，行业热度/市场情绪/财富等级统一反馈闭环
- **script 加载顺序**：`src/index.html` 中按序加载，**禁止改变**
- **多窗口开发**：`.claude/last_known_head` 跟踪 HEAD，pre-commit 钩子检测漂移
- **新模块接入 SOP**：暴露 ≤4 个 `window.xxx` 函数；接 `daily_pipeline.js` 一个 step；`index.html` 注册 script 放 core/ 之后

## 设计参考库（已用过的同类游戏）

- **难度分层**：《大多数》心态值分级 / 《中国式家长》经济复利 / This War of Mine 角色组合
- **NG+ 多周目**：Stardew Valley 祖父评价信 / 《中国式家长》2.0 天赋继承硬上限 / The Sims 4 Royalty
- **传承币/meta progression**：Hades 夜之镜红/绿互斥 + 命运骰 / BitLife Ribbons 解锁新事件链
- **本土化叙事**：996/考公/35岁/户口/催婚/内卷/躺平/返乡（已散落在 events_street.js / moral_events.js）
- **NPC 系统**：Stardew Valley（参考已达 Stardew Valley 级，是本项目最大亮点）
- **道德困境**：This War of Mine 善行余韵 + 长期回报

## 关键文件位置

- 主分发器：`src/js/main.js`（4003 行，待拆）
- 每日管线：`src/js/phase1/daily_pipeline.js`（906 行，声明式步骤编排）
- 财务结算：`src/js/phase1/skill_bonuses.js::settleDailyFinance`（银行利息 + 村长债复利）
- 难度系统：`src/js/core/difficulty_system.js`（168 行）
- 传承币：`src/js/core/heritage_coin.js`（224 行）
- 多周目继承：`src/js/core/inheritance_chain.js`（501 → 580 行）
- v3.0 改进模块：`src/js/core/review_improvements.js`（509 行）
- 剧本定义：`src/js/data/scenarios.js`（10 个剧本，difficulty 字段为展示用，不影响玩法）
- 旧版兜底死代码：`src/js/ui/wiki.js`（百科迁移完成后保留）
