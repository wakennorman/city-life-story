# MEMORY.md — 城市浮生记项目长期记忆

> 项目路径：`D:\Claude Code+DeepSeekV4\city-life-story\`
> 关键 SOP：`memory/review-improve-v3.0.md` / `memory/content-expansion-v2.1.md` / `memory/1-4-standard-implementation.md`

## 触发短语

| 用户说                       | 自动加载                                |
| ---------------------------- | --------------------------------------- |
| "按 v3.0 审查改进"           | `memory/review-improve-v3.0.md`         |
| "按 v2.1 提示词继续内容扩充" | `memory/content-expansion-v2.1.md`      |
| "按 1.4 标准检查"            | `memory/1-4-standard-implementation.md` |

## v3.0 SOP 硬约束（绝不可违反）

1. 不 cat 整文件（main.js 4000行/events_street.js 9800行/render.js 5200行）→ 只用 grep + 范围 Read（≤80 行/次）
2. 每次改动 ≤20 行；新模块 ≤300 行
3. 不反复 build — 全部改完后最后一次 `python build.py`
4. 街头工作 ≤20 个；行业代表制（每行业 1 NPC）；空地点禁止
5. 任何改动结束必须更新 `src/DEVELOPMENT.md` 顶部
6. 不删文件只改文件；新文件必须论证
7. 不修改 `build.py` / 不改 `src/index.html` 的 `<script>` 加载顺序 / 不引入外部库
8. **`git push` 由用户统一协调，loop 任务不主动 push**（只管本地 commit）

## v3.0 SOP 已知即时缺陷清单

| 优先级    | 缺陷                                          | 状态               |
| --------- | --------------------------------------------- | ------------------ |
| P0-BUGFIX | 村长债复利未生效(dailyInterest 读未用)        | ✅ 2026-06-23 修复 |
| P2-B-2    | 难度曲线分层                                  | ✅ 已实施          |
| P2-E-1    | 传承币系统(NG+永久解锁)                       | ✅ API完整,UI待加  |
| P2-B-1    | 多周目继承扩展                                | ✅ 已实施          |
| P1        | main.js getInvestmentContextLine(86行) 剥离   | 待办               |
| P1        | main.js startNewGame → core/game_lifecycle.js | 待办               |
| P1        | events_street.js 9827行拆分                   | 待办               |
| P2-C-1    | 主线/副本 fork(3章式结局)                     | 待办               |
| P2-C-2    | 节日深度(清明/中秋)                           | 待办               |
| P2-D-1    | 主界面折叠 12 tabs→3 组                       | 待办               |

## 项目架构要点

- 入口：`src/index.html`(开发)/`dist/index.html`(部署, `python build.py` 打包)
- 技术栈：纯 HTML5+CSS+Vanilla JS，零框架，无 npm 构建
- 核心架构：世界参数反馈环 v1.7 — `core/world_params.js` 定义 `_worldParams`
- script 加载顺序：`src/index.html` 按序加载，**禁止改变**
- 多窗口开发：`.claude/last_known_head` 跟踪 HEAD，pre-commit 钩子检测漂移
- 同一 loop 多窗口并行会逐字撞车：遇漂移拦截先 `git diff <old>..<new>` 核对；若 identical 则 `git checkout -- <files>` + 同步 last_known_head，**绝不强行合并**

## 事件编写字段约定（避免死字段→死事件/崩溃）

写 `cross_system_events.js`/`events_street_*.js` 条件前先核 `src/js/core/state.js`：

- **`st.skills` 仅有**：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding。**无 writing/content/art**
- **`st.reputation` 是按地点 key 的对象**（`{slum,commercialDist,bank,techPark,...}`），非标量。读档后须再 `initReputation`
- **NPC 关系**：`st.relationships[npcId]={affinity:-100~100,met:bool,discovered:{}}`。活跃：aunt_wang/boss_li/sister_zhang/old_zhou/xiao_mei/chef_chen/uncle_chen_bank/sister_wu/brother_huang。**`xiaoli`/`auntie_lin`/`master_zhao` 在 npcs.js 仍 TODO（未激活）**——引用它们的事件永不触发
- **习惯 streak**：`st.flags._habits` 含 lowHungerStreak/lowHygieneStreak/lowHappinessStreak/highFatigueStreak。**无 lowMoodStreak/lowSleepStreak**
- **天气**：`st.weather.current` ∈ sunny/cloudy/rainy/stormy/heatwave/typhoon
- **压力**：`st.personalGrowth.health.mental.stress`(0-100)，非 `st.player.*`。`emotionalState`=`st.status.emotionalState`
- **自洽守卫惯例**：NPC 事件须 `rel && rel.met && (rel.affinity||0)>=N`；职业须查 `st.employment.currentJob`/`st.sideHustle.type`；修复加 `// [自洽修复]`

## 设计参考库

- 难度分层：《大多数》/《中国式家长》/ This War of Mine
- NG+：Stardew Valley / 《中国式家长》2.0 / The Sims 4
- 传承币：Hades 夜之镜 / BitLife Ribbons
- 本土化：996/考公/35岁/户口/催婚/内卷/躺平/返乡
- NPC：Stardew Valley 级（最大亮点）；道德：This War of Mine 善行余韵

## 关键文件位置

- 主分发器 `src/js/main.js`(4003行,待拆) · 每日管线 `phase1/daily_pipeline.js`(906行)
- 财务 `phase1/skill_bonuses.js::settleDailyFinance` · 难度 `core/difficulty_system.js`(168)
- 传承币 `core/heritage_coin.js`(224) · 多周目 `core/inheritance_chain.js`(580)
- v3.0 改进 `core/review_improvements.js`(509) · 剧本 `data/scenarios.js`(10)

## 循环模式行为规范（2026-07-09）

1. 单次回复控量：优先写代码+commit，报告写 memory 文件
2. 回复末尾加继续信号 `⏭ 继续下一轮` / `⏭ 等待下一轮触发`
3. 流程：指令一审计→指令二新增事件→node --check→build.py→commit→更新 memory
4. 并行漂移：先 `git diff` 核对，identical 则放弃重复+同步 last_known_head
5. 不主动 push

## 循环调度实测（2026-07-12）

- **桌面 Claude Code `/cron` 配置实际不存在**——排查各 settings.json 均无 cron 字段。当前只有 WorkBuddy automation 一路在跑
- 10分钟节奏来源：`automation-1783592608308`。其 `rrule` 显示 DAILY;BYHOUR=0，但实际由平台心跳约每10分钟触发（rrule 不控制实际节奏）
- 自动化接口不支持分钟级（FREQ=MINUTELY;INTERVAL=3 被拒），最快可控 HOURLY，不推荐改
- 每轮读 ~48k 行事件 + node --check + build.py(7-8MB)，10分钟间隔避免 build 截断

## 已知设计缺口（2026-07-12 全系统优化审计）

- **阶段孤岛**：`cross_system_events.js` 共 670+ 事件，corporate 阶段仅 10 个(street 655+)。已补 `corp_reputation_headhunt`/`corp_skill_project_lead` + R2 三个桥接
- **NPC 覆盖误判陷阱**：用 `relationships["X"]` 正则会漏报 `xiaochen`/`zhaojie`（走事件链非 relationships）。统计需结合 `grep -rn "id:"` + npc_relationships.js

## 全系统优化·域轮换循环（8 域新版提示词）

- **已落地为 `automation-1783592608308` 正式 prompt（2026-07-12 用户确认升级）**：名字「城市浮生记·全系统8域轮换优化」，跑在 `loop/auto` 分支，每约10分钟一轮、无限循环。旧版 v3.1 框架 prompt 已弃用。
- **8 域**：A 数据/数值平衡 · B 事件/叙事 · C 职业/成长 · D NPC/社交 · E 经济/投资 · F UI/UX · G 核心机制/生命周期 · H Phase2/公司
- **指令一**：审查+修 A类缺陷（引用不存在id/裸访问崩溃/conditions应守未守），每修加 `// [全系统自洽修复] 域X 修复:xxx`
- **指令二**：联动增强 2-4 项，MC 10×500d 冒烟
- **每轮交付**：①修复清单 ②增强清单 ③CLAUDE.md 迭代表 ④`domain-optimization-round-N.md`+MEMORY ⑤`.claude/loop-domain-state.json`
- **状态**：`.claude/loop-domain-state.json`（currentRound/currentDomain/domainOrder/history）。2026-07-15 实测进度：自动化已跑至 **R24**（R23=B事件/叙事·R24=C职业，见 `src/DEVELOPMENT.md` v3.115）；本回合手动补 R18(F UI遗漏提交 `0cb5f277`)+R25(A数据 `38da9e52`，A类0缺陷+2联动：隐形财富税/市场饱和叙事化)。**Tracker 曾严重漂移**（loop-state 记 R17、CLAUDE.md 表续至 R17、DEVELOPMENT.md 却到 v3.115）→ 已对账，R18-R24 细节以 DEVELOPMENT.md 为准。⚠️ **git push 因本地代理 127.0.0.1:3067 未起全部失败**，本地 commit 正常，需用户起代理后协调推送。本回合(D域第二轮) **R26**：A类3项(`auntie_lin`/`chen_ge`/`ajie` 永久 dormant 激活，补齐 met 路径)+联动2项(`npc_chen_ge_market_whisper` D→E 经济门路边语 / `npc_auntie_lin_fresh_deal` D→A 菜价门道)，MC 6×400d 0 代码异常。用户指示：**先不 push，本地 commit 干净即可**。

### 关键陷阱（R1/R2 实测，详见 domain-optimization-round-1/2.md）

- **CROSS_EVENTS 结构**：`var CROSS_EVENTS = ([ ... ]);` 数组被括号包裹。插入新事件：上一事件 `  });`→`  },`（加逗号），末尾 `// 注册结束` 与 `})();` 间补回 `  );`
- **尾部事件须用裸 `{...},` 数组元素**（非 `RANDOM_EVENTS.push(...)`）：由 line ~5355 `for` 循环统一 push 注册。误用 push 致 SyntaxError
- **MC 10×500d 测试法**：Python 括号匹配提取事件→`/tmp/_extracted_evts.js`(`module.exports=[...]`)→node `.cjs`(项目 package.json 有 type:module，须 .cjs) 将 `StateManager`/`Random` 挂 global 后 require 跑 10种子×500天
- **提交顺序**：build.py 后立即 commit（dist 新鲜度）；commit 前 `echo <HEAD> > .claude/last_known_head` 同步避免漂移拦截
