# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-27 R535）

## R535 增量要点
- 域C三大零消费career flag已全部打通首消费：`_careerMonthlySnapshots`(c535,{day,salary,cash,bankBalance}×24滚动,career_dev.js:3415)/`_crossPathJobhop`+`_careerPathsWorked`(c535)/`_careerMaxLevelCelebrated`(c535)——勿重复选题。
- **假技能键模板污染已全库清零**：并行chore轮反复复制 `["accounting","management","marketing","technology","social","trade"]` 数组（3假键静默丢弃XP）。开域C轮建议 grep `marketing.*technology` 复查防再犯。真实12键见下方state.js节。
- `state.skillBranches={skillKey:branchId}`、`state.talentNodes={"skill_branch_node":true}` 已有消费者(r260/r391/r416+cross_system)，非零消费源。
- 开轮 stash 报"No local changes"=并行窗口已自提交在途改动（本轮R138-R145），直接干净构建即可。

## R554 增量要点（域G 联动文件）
- **假技能键污染会回潮**：domain_g_linkage_r554.js 在 R535「全库清零」之后**再次引入**数组 `["accounting","management","marketing","technology","social","trade"]`（marketing/technology/trade 非真实键→XP 静默丢弃）。教训：**任何新/在途 linkage 文件落库前必 grep 假键数组**复核真实12键，否则清零会回潮。已修复映射 marketing→social / technology→coding / trade→sales。
- r554.js 已挂 src/index.html:1352 但源文件曾 untracked（悬空引用风险）→ 落库后 `git show HEAD:dist/app.js | grep -c _domainGLinkageR554Loaded` 核验 bundle 含=2 闭合悬空。
- MC 6×400d EXIT=0·0硬异常·前7天死亡0%；grinder/trader/corporate 存活率<阈值为既有RNG平衡波动非回归。源码+dist+loop-state 由并行窗口 R555「sync state」(e16b2689) 一并扫入提交，本窗口仅补 bookkeeping。

## R530 增量要点
- 域F三大只读可视化数据源已全部打通事件首消费：`_unlockedAchievements`(f530)/`_cashHistory`(f530)/`_experiencedNarratives`(f530)——后续勿重复"首消费"选题。
- **在途源隔离模式**（比 stash 更稳）：`mv` 在途 linkage 文件到 $TEMP + Edit 摘除其 index.html 挂载行 → build 干净 dist → 提交后 mv 回+挂载还原（不再 build）。适用于 untracked 在途文件污染 bundle 场景。
- `_cashHistory` 条目结构 `{day,value}`（daily_pipeline.js:629，90天滚动）；成就数组 `flags._unlockedAchievements`（achievements.js:2087）。

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log origin/main..HEAD` + `git log -N` 重算真实 recency（**勿信 loop-state，常严重滞后**）；`ls src/js/core/*r{N}*`+grep index.html 核对轮号未被并行占用。并行在途改动先 `git stash push -- <文件>` 隔离，push 后 pop。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（须=当前HEAD 过 pre-commit 漂移检查）。改源后必 `python build.py`（dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止报告绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`。0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过；存活率<80% 多为既有 RNG 阈值。
- ⚠️ MC "全策略0%存活+耗时<1s"=硬崩溃→立即抓 stack 热修复上 main（harness catch 加 e.stack）。
- 新 linkage 文件必须挂 `src/index.html` `<script>`（漏挂=悬空 build 静默剔除）。
- **代理常 down**：`git push` 因 127.0.0.1:3067 未起常失败→本轮改动累积本地、下轮继续；勿 force。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：MORAL_EVENTS+MORAL_CONSEQUENCES，`condition`(单数)。
- news.js：NEWS_EVENTS；followUpId 动态生成勿误报。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`（player.happiness 死）；心智 `player.mental`；健康 `status.health`（needs.health/player.health 死）；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`。
- 证书 `state.certificates`（certs 死）；`player.corporate.upward` 真实惰性字段(||50)；`corporate.team/jobOffer/company` 顶层真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility/trade/technology）；`addSkillXp(skillKey,amount)` 全局读 state，假键静默丢弃。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 仍 TODO→用 firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股持仓无 .price，价取 `corporate.stockMarket[sym].price`。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`（位置参数固定）；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id（driving_logistics/driving_logistics_accounting，无 driving_accounting）。
- E：持仓写入前 Array.isArray 守卫；除数(avgPrice/prev)须 isFinite+>0；股票 industry 必须在 WORLD_SECTORS。
- G/H：daily_pipeline 无 slot 注册→用包装全局函数接线；UI 安全区(100dvh/safe-area)勿回退。

## A类净尽结论（勿重复审）
- 域A R14/R22/R197/R242/R251/R258/R267/R277/R331/R387/R431、域G R20/R192/R197/R199/R296/R311/R392、域H R13/R21/R200/R320/R393、域F R19/R183/R186/R198/R384/R390/R397/R442、域C R191/R271/R489、域E R246/R260/R284/R406/R472、域B R411/R426/R472/R489 已净尽各自主隐患。
- 死字段黑名单(player.happiness/needs.health/player.health/certs) 全库定期 grep=0 命中即诚实报 A类=0。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。

## 关键教训
- CLAUDE.md 是 CRLF——脚本改写须保留换行符否则整文件 diff；并行常持续重写它，权威轮号以 loop-state.json + round doc 追踪。
- Write 新 linkage 前必查编号是否被并行占用（曾误覆盖已提交文件靠 git checkout -- 恢复）。
- **悬空 dist 救援模式**：并行提交源+挂载但不重建 dist→开轮 `git show HEAD:dist/app.js | grep -c <近轮前缀>` 核验，缺失则 rebuild。
- **同轮号双域/并行扫入**：判 recency/轮号占用一律 git log 内容为准，loop-state 仅弱参考；build 含并行在途未提交源→绝不提交 dist。
- **personalGrowth 真实结构**：`health.{physical{score},mental{score,stress,anxiety,depression},metabolic}`+`learning{booksRead,courses,certificates}`+`image{style,skincare,fitness,plastic}`。phase2/personal_growth.js 双结构分歧(health.physical对象 vs 数字/psychology vs mental)为已知 B类待专轮。
