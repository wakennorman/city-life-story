# R712b 域H(Phase2/公司) 优化记录 — 2026-07-29 01:1x（自动化窗口）

## 选域依据
git log 实测 recency（勿信 loop-state，其停留在 R685b）：E=710b > D=709b > C=709 > B=708 > A=707 > G=705(并行在途R712) > F=704(并行R711刚交付) > **H=698 全局最薄弱** → 域H。轮号 R712b（b后缀避让并行同期 R712 域G）。

## 指令一：A类审查 = 0（诚实报，四项例行审计全净尽）
| 审计项 | 结果 |
|---|---|
| addSkillXp 假键（finance/trade/technology/strength/physique）| 17处命中全为历史修复注释，活代码 0 |
| 死字段黑名单（player.happiness/needs.health/player.health/certs）| 0 活命中（bridge 为已知误报）|
| 事件占位符泄漏（events_corp/corporate_*/startup_events/company_linkage）| 0 |
| index.html 悬空挂载（双向：挂载无文件 / linkage文件未挂载）| 0 / 0 |
| startup_events effect 键 vs STARTUP_FIELD_MAP 白名单 | 合规（cashReserve/marketScore/reputation/technologyScore）|

## 指令二：联动增强 3 项（domain_h_linkage_r712b.js，3事件均 phase:"corporate"，done-flag防重，全||防御）
| 事件 | 联动 | 内容 |
|---|---|---|
| h712b_board_pressure_talk | H→D | **boardPressureLevel(P1-6大系统) 事件层首消费**。压力≥2级触发；倾诉支线 firstMetNpc 遍历+rel&&rel.met+applyAffinityChange 铁律；冲刺支线写 shareholderTrust。设计：损失厌恶——把仪表盘压力具象成走廊脚步声 |
| h712b_media_spotlight | H→B | **mediaRelations+sentimentScore(P1-7公关系统) 事件层首消费**。关系≥40且情绪分>0"窗口期"触发；专访支线写回 mediaRelations/sentimentScore/player.fame(真实字段,state.js:594)。设计：社会比较——家族群转发 |
| h712b_crisis_night | H→G | **crisisLevel 事件层首消费 + _h698Fitness 死flag首读**（R698健康计划在危机夜兑现回报=禀赋效应）；熬夜支线 crisisLevel-1 换 health-5；授权支线沉淀 _h712bDelegated。设计：峰终定律——危机夜是记忆峰值 |

字段真实性核对：boardPressureLevel(startup.js:575, 0-4)/mediaRelations(586, 0-100)/crisisLevel(592, 0-4)/sentimentScore(600, -100~100)/shareholderTrust(580)/player.fame(state.js:594 惰性初始化)——全部 `state.startup.company` 容器 + ||守卫。

## 验证
- node --check：r712b OK；并行在途 domain_g_linkage_r712.js 亦 OK（无半成品语法风险）。
- build.py 重建 dist（含并行在途 staged 源——dist 提交策略见竞态记录）。
- MC 10×500d：见 CLAUDE.md 本轮行。

## 竞态记录
- 开轮时并行 staged：index.html(MM)+domain_g_linkage_r712.js(A)，另有 r360 文件 data→core 迁移（worktree 未staged，不碰）。
- index.html 挂载用 Python 字节级追加单行（锚点 r712 行后），不触碰并行改动。
- 提交时机重估 git status：若并行 r712 仍 staged，`git commit` 会连带其入本提交（挂载+文件成对，无悬空，可接受——同轮号双域互补先例）。

## 遗留素材（域H 富矿账更新）
- 已消费：boardPressureLevel/mediaRelations/sentimentScore/crisisLevel（本轮全部打通事件层首引用）。
- 仍零消费：company.efficiency 事件层仍薄（仅 r602 写+少量读）；_h698Sleep/_h698Focus/_h712bSprintPlan/_h712bDelegated 新写入待未来轮首读。
