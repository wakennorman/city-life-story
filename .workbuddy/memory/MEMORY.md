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
8. **`git push` 由用户统一协调，loop 任务不主动 push**（CLAUDE.md §714 授权但用户已明确安排）：`remote origin` 已存在（`github.com/wakennorman/city-life-story.git`）。用户 2026-07-09 确认——后期会让其他 AI 把他做的 + 各并行窗口做的改动**一起推一次**；所以本 loop（含交互窗口与 `loop/auto` 自动化）只管本地 `commit`，**绝不主动 `git push`**、绝不每轮追问是否推送。物理上代理 `127.0.0.1:3067` 仍断（GitHub:443 不可达），但这已非主要约束——即便通了也按用户统一安排走。

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
- **同一 loop 任务多窗口并行会逐字撞车**：用户在桌面开多个 Claude Code CLI 窗口跑同一 `/loop`（如「日常开发」），会产生**事件 id 与 GDD 内容完全一致的重复提交**。遇 pre-commit 漂移拦截时，**先 `git diff <old_head>..<new_head>` 核对并行窗口改动**；若 identical，则 `git checkout -- <files>` 放弃本窗口重复改动 + 同步 `last_known_head`，**绝不强行合并**（否则事件 id 重复 / GDD 双重）。此流程在 2026-07-09 R7 实战验证有效。
- **循环自动化**：已建定时 automation `automation-1783592608308`「城市浮生记·日常开发循环」。**频率：`FREQ=MINUTELY;INTERVAL=10`（每 10 分钟一轮，2026-07-09 从 2 小时改 10 分钟）**。它跑在**独立分支 `loop/auto`**，**绝不碰 main、绝不 push**，与用户 3 个 CLI 窗口(桌面 .bat)并行不冲突。用户定期 `git merge loop/auto` 即可吸收。安全规则：只 `git add` 具体文件、绝不 `git add -A`/`--amend`、20 事件 id 存活校验。
- **双 10 分钟循环策略（2026-07-09 用户裁定 B 方案）**：用户的 Claude Code `/cron`(10 分钟,提交 `main`) + 本 WorkBuddy 自动化(10 分钟,提交 `loop/auto`)**并存**。用户明确接受「**合并后若出现重复事件 id 再统一整改**」，所以 loop 任务**不必规避生成、自由产出事件**，重复清理留到后期 merge 阶段。遇 pre-commit 漂移拦截仍按 line 47 流程核对，但不再因「怕撞车」而少生成。
- **新模块接入 SOP**：暴露 ≤4 个 `window.xxx` 函数；接 `daily_pipeline.js` 一个 step；`index.html` 注册 script 放 core/ 之后

## 事件编写字段约定（避免引用死字段 → 死事件/崩溃）

写 `cross_system_events.js` / `events_street_*.js` 事件条件前，**先核 `src/js/core/state.js`**：

- **`st.skills` 仅有**：cooking / repair / coding / english / driving / sales / management / accounting / electrician / welding。**没有 `writing`、`content`、`art` 等**——曾误用 `skills.writing` 导致整条事件永不触发（已改为 `skills.english`）。
- **`st.reputation` 是按地点 key 的对象**：`{ slum:0-100, commercialDist:0-100, bank:0-100, ... }`，**不是标量**。判断口碑应写 `st.reputation && (st.reputation.slum||0) >= X`。
- **NPC 关系**：`st.relationships[npcId] = { affinity:-100~100, met:bool, discovered:{} }`。活跃 NPC：aunt_wang/boss_li/sister_zhang/old_zhou/xiao_mei/chef_chen/uncle_chen_bank/sister_wu/brother_huang。**注意 `xiaoli`/`auntie_lin`/`master_zhao` 在 npcs.js 仍是 TODO 注释状态（未激活）**——引用它们的事件目前永不触发。
- **习惯 streak**：`st.flags._habits` 仅有 `lowHungerStreak`（连续 hunger<25 天数）。无 `lowMoodStreak`/`lowSleepStreak`——需要"连续低心情/低睡眠"事件时改用 `st.needs.*` 阈值而非 streak flag。
- **天气**：`st.weather.current` ∈ sunny/cloudy/rainy/stormy/heatwave/typhoon。天气叙述事件必须校验此字段（A类）。
- **压力/心理**：`stress` 在 **`st.player.health.mental.stress`**（0-100），**不是** `st.player.stress`。`emotionalState` 在 `st.status.emotionalState`（stable|happy|sad|angry|stressed|depressed）。低心情阈值用 `st.needs.happiness < X`（needs: hunger/fatigue/hygiene/happiness 均在 0-100）。R8 曾误以为 `st.player.stress` 实则不存在 → 死事件，已核实路径后修正。
- **自洽守卫惯例**：NPC 名事件条件须 `rel && rel.met && (rel.affinity||0) >= N`；职业叙述须查 `st.employment.currentJob`/`st.sideHustle.type`/`st.stats.actionFreq`；已有修复加 `// [自洽修复]` 注释。

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

## 循环模式行为规范（2026-07-09 新增）

**问题**：循环模式下回复被截断导致"假停机"——单次回复塞入过多内容（审查结论 + 写代码 + commit + push + 更新记忆 + 收工报告）导致被切断，且回复末尾无继续信号。

**规范**：

1. **单次回复内容控制在合理范围内**：优先写代码 + commit，记忆更新和收工报告可简化为一行；详细的收工报告写在 memory 文件中而非回复正文。
2. **回复末尾必须附带继续信号**：每次回复结尾加一行 `⏭ 继续下一轮` 或 `⏭ 等待下一轮触发`，让循环系统知道任务未完成。
3. **循环任务流程**：指令一审计（快速扫描，有缺陷则修复，无则一行记录）→ 指令二新增事件（3-5个）→ node --check → build.py → commit → 更新 memory → 结尾标注继续信号。
4. **遇到并行窗口提交漂移**：先 `git diff <old>..<new>` 核对，若 identical 则放弃重复 + 同步 last_known_head（不强行合并）。
5. **不主动 push**：由用户统一安排推送时机。
