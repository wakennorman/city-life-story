# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-28 R631）

## 开轮流程（权威）
- recency 权威判定：`ls src/js/core/ | grep -oE "domain_[a-h]_linkage.*r[0-9]+"` 按域取最大轮号；**勿信 loop-state（常严重滞后）**。开轮再 `git log -5` + `git rev-parse HEAD origin/main` 核对并行进度与轮号占用；Write 新 linkage 前必查编号未被占用。⚠️R631教训：并行窗口可能同轮号提交不同域([R631]同时被域F/域G使用)，撞号不冲突但 round-N.md 文档命名须先查占用；开轮 git log 若见本轮号提交，先 git show 比对是否为本窗口内容被扫入(IDENTICAL 则直接进账本闭环，勿重做)。
- 假技能键回潮复查（每轮必跑）：`grep -rnE 'var skills? *= *\[' src/js | grep -E '"trade"|"finance"|"marketing"|"technology"' | grep -v 修复`。已四次回潮（R535/R554/R589 清剿），映射 marketing→social / technology→coding / trade→sales / finance→accounting。**strength 假键已三次同型回潮（r596→R621修、r611→R631修）→均改写 personalGrowth.image.fitness(||30守卫)；复查 grep 应加 strength|beauty|mental|fitness 直接调用形态**（数组形态 grep 抓不到单发调用）。
- 悬空/孤儿对账：挂载无源=逆向悬空（摘除挂载）；源无挂载=孤儿（复核后挂载复活）。R594 已全量清零一次。落库后 `git show HEAD:dist/app.js | grep -c <flag>` =2 核验闭合。**⚠️R621教训：对账必须同时扫 `src/js/core/`+`src/js/data/` 双目录**——index.html 有11个 domain_*(r173~r307) 挂在 js/data/ 路径，只扫 core 会全量误报悬空。recency 判定同理：`ls` 输出 grep 时注意 r598/r599 等被截断漏检，最终以 `sort -n` 全量对账为准。
- 并行在途改动 `git stash push -- <文件>` 隔离（或 mv 到 $TEMP+摘挂载，适合 untracked），push 后还原。并行常"集成提交"扫入本轮源码→开轮 `git show HEAD:<文件> | grep 本轮标记` 判实质是否已落库，勿重做源码。

## 提交纪律（自动化：直接提交+push main）
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。改源后必 `python build.py`（dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`（或10×500d）。0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过；存活率<80% 多为既有 RNG 阈值非回归。⚠️"全策略0%存活+耗时<1s"=硬崩溃→harness catch 加 e.stack 抓栈热修复。
- 新 linkage 文件必须挂 `src/index.html` `<script>`（漏挂=悬空被 build 静默剔除）；build 含并行在途未提交源时绝不提交 dist。
- 代理 127.0.0.1:3067 down 时 push 失败→改动累积本地下轮续推，勿 force。
- CLAUDE.md 是 CRLF，脚本改写须保留换行符。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：MORAL_EVENTS+MORAL_CONSEQUENCES，`condition`(单数)。
- news.js：NEWS_EVENTS；followUpId 动态生成勿误报。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`（player.happiness 死）；心智 `player.mental`；健康 `status.health`（needs.health/player.health 死）；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`；证书 `state.certificates`（certs 死）。
- skills 真实12键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social；`addSkillXp(skillKey,amount)` 假键静默丢弃。**`state.skills[key]` 是对象{level,xp}，等级须读 `.level`**（误当数值比较=condition 恒 false 死事件）。
- `player.corporate.upward` 真实惰性字段(||50)；`corporate.team/jobOffer/company` 顶层真实。reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 仍 TODO→用 firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股持仓无 .price，价取 `corporate.stockMarket[sym].price`。
- `_cashHistory` 条目{day,value}（daily_pipeline.js，90天滚动）；成就 `flags._unlockedAchievements`；personalGrowth：`health.{physical{score},mental{score,stress,...},metabolic}`+`learning{booksRead,courses,certificates}`+`image{style,skincare,fitness,plastic}`（phase2 双结构分歧为已知 B类待专轮）。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id。
- E：持仓写入前 Array.isArray 守卫；除数须 isFinite+>0；股票 industry 必须在 WORLD_SECTORS。
- G/H：daily_pipeline 无 slot 注册→用包装全局函数接线；UI 安全区(100dvh/safe-area)勿回退。

## 已消费 flag（勿重复"首消费"选题）
- 域B/moral：_elderJobLead/_stoppedScam/_wholesaleChannelTip(r594)。遗留7个写-only：_friendCheatWarned/_goodSleepToday/_moralAfterWorkLoaded/_neighborHasIOU/_neighborRefused/_scrapeCheckCamera/_scrapeLeftNote。
- 域C：_careerMonthlySnapshots/_crossPathJobhop+_careerPathsWorked/_careerMaxLevelCelebrated(c535)/_skillRespectNotified/_hasApprentice(c518)/_highSalaryInvestor/_burnoutSurvivor/_hasOccupationalDisease(c489)。skillBranches/talentNodes 已有消费者。
- 域E：_firstStockDay/_investCareerConfidence/_investSocialPerception(e589)/btcFearGreed/_propertyPolicyTightness/tradeLog(e406)/_bearMarketWitness(e260)/_consecutiveWins(e260)。**investFreq三维度已消费(e621:单标的深度/广度/总量)**，沉淀新写-only flag _e621BrokerContact/_e621TradeDiscipline 可作后续素材。域E零消费素材已耗尽，下次域E轮建议消费 e621 新flag或转向 startup/property 子系统对账。⚠️investFreq值=累计**股数**非次数(phase2/investment.js累加shares)。
- 域F：_unlockedAchievements/_cashHistory/_experiencedNarratives(f530)/rel._lastInteractionDay(f442)。
- 域G：_hairStyleBoost/_eraState.stageId/_eventEconomicImpact(g577)/_hasToolkit/_interviewPassed/_firstJobFound(r296)。
- 域G生存里程碑(R599+R631已消费)：_everDepressed/_everHadIllness/_chronicMonthlyPaid(r599)+_everBroke/_everHomeless/_everStarved(r631)。**仍写-only 12个**：_cleanRecord/_currentStoryChapter/_debtFree/_everCuredIllness/_everGotSick/_everInjured/_firstSkillUpgraded/_lifeNode_choice/_pensionBase/_sandboxChallenge/_streakMaster/_wasteRecyclingReady——下次域G轮优选。
- 域A：trade._routeUsage/_totalSpent/_tradeLearnedInvest(a431)。

## A类净尽结论（勿重复审）
- 各域历轮已净尽主隐患（域A×11轮/G×8/H×5/F×9/C×4/E×6/B×5，至 R599）。死字段黑名单(player.happiness/needs.health/player.health/certs) 全库 grep=0 活命中即诚实报 A类=0。
- **R599 域G 增量**：跨文件 A类6处（skills对象{level,xp}当数值相加=NaN 摧毁技能 3处→改 addSkillXp；假键 finance/beauty/mental 静默失效 3处→english/真实形象维度 skincare/真实字段 player.mental）；3联动首消费 _everDepressed/_everHadIllness/_chronicMonthlyPaid（needs.js/illness.js 零读取 flag）。**Edit 工具存 CRLF→LF 致整文件 diff 教训**：改 CRLF 源文件须用 Python 在 HEAD CRLF 内容上精准替换，勿用 Edit 直接写（否则 585KB 假 diff 与并行窗口冲突）。源码被并行 R570 `git add -A` 扫入提交（CRLF 保留），本窗口重建 dist 闭合 r599 悬空引用(flag 0→2)。
- 已修勿重复审：events_core 顶层死块/era_transform getEraEvents 接线/world_params cv 除零(g577)；stock.js avgPrice/finance.js dtI 守卫完好；setStopLoss 有真实调用方(r195)非死代码。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。
