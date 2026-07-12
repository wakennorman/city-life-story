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
- **`st.reputation` 是按地点 key 的对象**：`{ slum:0-100, commercialDist:0-100, bank:0-100, techPark:0-100, ... }`，**不是标量**。判断口碑应写 `st.reputation && (st.reputation.slum||0) >= X`。它由 `phase1/reputation.js::initReputation` 在启动时初始化为 `{}`（+`slum:2`），**读档后必须再次调用 `initReputation`**（main.js 读档流程已补，仿 `兼容旧存档` 模式），否则旧存档读档后 `st.reputation` 为 undefined → 声誉事件崩溃。
- **NPC 关系**：`st.relationships[npcId] = { affinity:-100~100, met:bool, discovered:{} }`。活跃 NPC：aunt_wang/boss_li/sister_zhang/old_zhou/xiao_mei/chef_chen/uncle_chen_bank/sister_wu/brother_huang。**注意 `xiaoli`/`auntie_lin`/`master_zhao` 在 npcs.js 仍是 TODO 注释状态（未激活）**——引用它们的事件目前永不触发。
- **习惯 streak**：`st.flags._habits` 含 `lowHungerStreak`（连续 hunger<25）、`lowHygieneStreak`（连续 hygiene<30）、`lowHappinessStreak`（连续 happiness<20）、`highFatigueStreak`（连续 fatigue>80）。**注意**：没有 `lowMoodStreak`/`lowSleepStreak`——"连续低心情"事件应改用 `st.flags._habits.lowHappinessStreak`，"连续低睡眠"无对应 flag 改用 `st.needs.*` 阈值。
- **天气**：`st.weather.current` ∈ sunny/cloudy/rainy/stormy/heatwave/typhoon。天气叙述事件必须校验此字段（A类）。
- **压力/心理**：`stress` 在 **`st.personalGrowth.health.mental.stress`**（0-100），**不是** `st.player.stress`/`st.player.health.mental.stress`（前缀是 `personalGrowth` 不是 `player`）。`emotionalState` 在 `st.status.emotionalState`（stable|happy|sad|angry|stressed|depressed）。低心情阈值用 `st.needs.happiness < X` 或 `st.flags._habits.lowHappinessStreak`。
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

## 循环调度实测（2026-07-12 调查修正）

- **桌面 Claude Code `/cron` 配置实际不存在**：排查用户级 `~/.claude/settings.json`、项目级 `D:\Claude Code+DeepSeekV4\.claude\settings.json` 与 `settings.local.json`、`~/.claude.json`，**均无 cron/schedule/recurring 字段**。故早前"双10分钟策略含桌面 /cron 一路"的描述本轮已证伪——当前只有 WorkBuddy automation 一路在跑。
- **10分钟节奏来源**：即 `automation-1783592608308`（城市浮生记·日常开发循环）。其 `rrule` 字段显示 `FREQ=DAILY;BYHOUR=0;BYMINUTE=0`，但实际约每10分钟触发——**真实触发由 WorkBuddy 平台后台心跳驱动，rrule 字段不控制实际节奏**。
- **自动化接口不支持分钟级**：`automation_update` 设 `FREQ=MINUTELY;INTERVAL=3` 被后端拒绝（仅支持 DAILY/HOURLY/WEEKLY/MONTHLY/YEARLY）。故**无法把循环改成3分钟**；API 允许的最快可控粒度是 `HOURLY`（每小时），但 rrule 是否生效未知且会变慢，不推荐。
- **结论**：维持约10分钟现状为最优。每轮需读 ~48k 行事件 + node --check + python build.py（构建 7-8MB），10分钟间隔可避免上轮 build 未完成导致的截断事故（参考 52222a8）。用户想加速时直接下指令即可，不必等心跳。

## 已知设计缺口（2026-07-12 全系统优化审计）

- **阶段孤岛**：`cross_system_events.js` 共 670 事件，但 **corporate 阶段仅 10 个**（street 655）。两系统近乎无桥接，是确认的真实缺口。后续优化优先补 corporate 阶段 + street→corporate 跨阶段桥接事件（v3.96 已新增 `corp_reputation_headhunt` / `corp_skill_project_lead` 两个桥）。
- **NPC 覆盖误判陷阱**：用 `relationships["X"]` 正则代理统计 NPC 联动密度会漏报——`xiaochen`/`zhaojie` 实际已有事件（`xiaochen_night_market`、`zhaojie_shop_tip` + 3 事件链），只是不走 `relationships[]` 对象。统计 NPC 覆盖需结合 `grep -rn "id:"` + npc_relationships.js 综合判断，勿盲加。

## 全系统优化·域轮换循环（2026-07-12 新提示词生效）

用户更新 `/loop` 提示词：每10分钟一轮、无限循环、无结束目标；每轮从 **8 域** 选一个薄弱域，做完轮换下一域。

- **8 域**：A 数据/数值平衡(jobs/skills/items/goods/illnesses/pricing/trade/economy_v3.1) · B 事件/叙事 · C 职业/成长 · D NPC/社交 · E 经济/投资 · F UI/UX · G 核心机制/生命周期 · H Phase2/公司。
- **指令一**：审查+修 A类缺陷（数据域：引用id不存在/>3倍差价无解释/极端值崩溃；各域有专属判定）。每修加 `// [全系统自洽修复] 域X 修复:xxx`。
- **指令二**：联动增强 2-4 项（该域数据从未被引用→新事件 / 关键数值UI无展示→新UI / 跨阶段无继承→桥接 等）。需 `MC 10×500d` 冒烟测试。
- **每轮交付**：①修复清单 ②增强清单 ③更新 CLAUDE.md 迭代表 ④写 `domain-optimization-round-N.md`+更新 MEMORY.md ⑤更新 `.claude/loop-domain-state.json`（域+轮次）。
- **状态追踪文件**：`.claude/loop-domain-state.json`（currentRound/currentDomain/domainOrder/history）。

### R1 (2026-07-12, 域A) 关键结论

- **Domain A 结构性健康，0 A类缺陷**（job/item/goods/illness id 完整性 100%；economy_v3.1 守卫完备）。
- **隐形数据缺口已治愈**：economy_v3.1（财富税/市场饱和）与 pricing.js 市场事件此前"算而不显"（0 事件引用）。R1 新增 4 事件叙事化：`econ_wealth_tax_tier`(street+corporate) / `econ_market_saturation`(street) / `price_market_event_alert`(street)。commit `42528c0a`。
- **MC 10×500d 测试方法**（可复用）：Python 括号匹配提取目标事件对象 → 写入 `/tmp/_extracted_evts.js`（`module.exports=[...]`）→ node `.cjs` 脚本将 `StateManager`/`Random` 挂 `global` 后 `require` 并跑 10种子×500天随机 state。注意：项目 `package.json` 有 `"type":"module"`，node 脚本须用 `.cjs` 扩展名。
- **CROSS_EVENTS 结构陷阱**：文件实际为 `var CROSS_EVENTS = ([ ... ]);` —— 数组被**括号包裹**，尾部 `  });` 的 `)` 是包裹括号闭合（非 IIFE）。插入新事件时：上一事件 `  });` → `  },`（加逗号），并在 `// 注册结束` 与末尾 `})();`(IIFE) 之间补回 `  );`（数组包裹括号闭合）。漏逗号或丢 `)` 都会语法崩。
- **尾部事件须用裸 `{...},` 数组元素**（非 `RANDOM_EVENTS.push(...)`）：cross_system_events.js 末尾（line ~49997 之后）的事件是 `CROSS_EVENTS` 数组的字面量元素，由 line 5355 `for` 循环统一 `RANDOM_EVENTS.push(CROSS_EVENTS[i])` 注册。R2 初版误用 `RANDOM_EVENTS.push({...})` 致 `SyntaxError: missing )`，改为裸对象元素后通过。

### R2 (2026-07-11, 域B) 关键结论

- **Domain B 结构性健康，0 A类缺陷**。NPC `met` 守卫完备（217 处 `relationships[]` 引用全守卫，泛化角色叙事不算缺陷）；天气事件用 `weather.season`/`_nextDayForecast` 比 `weather.current` 更精确（非缺陷）；引擎 `queueRandomEvent` 同时支持 `triggers`(对象) 与 `trigger`(函数)，无"丢弃"。
- **联动增强 3 项 street→corporate 桥接**（治愈"阶段孤岛 655:10"）：`corp_street_roots_letter`(B×C×D 导师寄语) / `corp_street_skill_advantage`(B×C 硬技能立功) / `corp_npc_referral_from_street`(B×D 挚友人脉反哺)。code `edcb4bbf` + docs `ef90b87d`，事件总数 674→677，MC 10×500d 0 异常。
- **R2 新踩坑**：①尾部裸对象元素非 push；②build 后须立即 commit 避免 dist 新鲜度拦截；③commit 前 `echo <HEAD> > .claude/last_known_head` 同步。详见 `domain-optimization-round-2.md`。
