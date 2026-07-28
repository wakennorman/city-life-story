# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-27 v2）

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log` 重算真实 recency（**勿信 loop-state，常严重滞后/被并行改写**）；`ls src/js/core/*r{N}*`+grep index.html 核对轮号未被占用。并行在途改动 `git stash push -- <文件>` 隔离，push 后 pop（若并行已自行提交新版则**勿 pop**，仅留作找回点）。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。⚠️同一窗口连续多笔提交：**每笔提交前都要重新同步**（第一笔落地后 HEAD 变化会拦截第二笔）。改源后必 `python build.py`（dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`。0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过；存活率<80% 多为既有 RNG 阈值。
- ⚠️ **MC "全策略0%存活+耗时<1s"=硬崩溃**→harness catch 加 e.stack 定位，立即热修复上 main。
- 新 linkage 文件必挂 `src/index.html` `<script>`（漏挂=悬空，build 静默剔除）。
- **push 前双向核对**：`git show HEAD:src/index.html | grep <近轮新文件>` + `git show HEAD:dist/app.js | grep -c <事件前缀>` vs 源文件存在性（悬空 dist 救援已成模式：并行常提交源+挂载但不重建 dist）。
- 本窗口 build 若含并行在途未提交源→**绝不提交 dist**（避免反向孤儿）；round doc 由本窗口补写（并行只写 commit message）。
- 会话被压缩后后台 MC task_id 会丢失→直接重跑。

## 竞态形态（并行窗口速度远快于本自动化）
- 本窗口角色偏「权威 bookkeeping + MC 验证 + 联动/偶发A类」；代码常在写完3分钟内被并行 `git add -A` 扫入其提交（多半 IDENTICAL，核验后即闭合勿改名）。
- ⚠️ **R658b 新形态：reset --hard 冲毁+staged 接管**——并行会 `reset: moving to HEAD` 直接冲掉本窗口已落盘未提交的源修改（不入 stash，无找回点）！随后它可能自行 staged 一份 IDENTICAL 重做版。对策：改完关键文件立即核验 `git status`；发现被冲掉先查 staged/HEAD 是否已含同内容（含则闭合勿重做），不含才重写。本窗口甚至整轮交付物会被并行以本窗口轮号（如 [R658b]）名义提交推送——核验 HEAD 完整性（源+挂载+dist+A类修复四项 grep）后即视为已 push。
- 并行同时跑多套编号（正常 R5xx/小编号 R7x-8x），**同轮号双域已成常态**；判 recency/占用一律 git log 提交时间序+内容为准。
- stash 历史堆积 27+条，旧隔离 stash 勿 pop（并行已提交新版），仅作找回点。
- CLAUDE.md 是 CRLF 且被并行持续重写——脚本改写须保留换行符；无法干净暂存时跳过迭代表，权威记录在 round doc+loop-state。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：MORAL_EVENTS+MORAL_CONSEQUENCES，`condition`(单数)。
- news.js：NEWS_EVENTS；followUpId 动态生成勿误报；effects 的 job id/symbol 必须真实存在。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`（player.happiness 死）；心智 `player.mental`；健康 `status.health`（needs.health/player.health 死）；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`；证书 `state.certificates`（certs 死）。
- `player.corporate.upward` 真实惰性字段(||50)；`corporate.team/jobOffer/company` 顶层真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility/trade）；`addSkillXp(skillKey,amount)` 全局读 state，假键静默丢弃。**例行审计：全库 grep `addSkillXp("` 核对键真实性**。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 仍 TODO→firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股持仓无 .price，价取 `corporate.stockMarket[sym].price`。
- 活跃 flag/计数器：`_dataInvestorMindset`/`_consecutiveWins`/`_totalInvestmentProfit`/`_bearMarketWitness`/`_eraState.inflationIndex`。
- **personalGrowth 结构**：`health.{physical{score},mental{score,stress,anxiety,depression},metabolic}`+`learning{booksRead,courses,certificates}`+`image{style,skincare,fitness,plastic}`。image四维已R426首消费；剩余零消费候选：depression 阈值叙事。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id（无 driving_accounting）。
- E：持仓写入前 Array.isArray 守卫；除数 isFinite+>0；股票 industry 必须在 WORLD_SECTORS。
- G/H：daily_pipeline 无 slot 注册→包装全局函数接线；UI 安全区(100dvh/safe-area)勿回退。
- 模糊指令先 grep 确认存在；用户「无关」=停手。

## A类净尽结论（勿重复审）
- 域A R14/22/197/242/251/258/267/277/331/387/431、域B R411(133处死字段大修)/426/472、域C R191/271/489、域E R246/260/284、域F R19/183/186/198/384/442、域G R20/192/197/199/296/311、域H R13/21/200/320 已净尽各自主隐患。
- 死字段黑名单(player.happiness/needs.health/player.health/certs) 全库 grep=0 活命中即诚实报 A类=0。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确；establishMentorship/takeMentee 有平行实现；setStopLoss 有真实调用方(r195)。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall 无 writer。
- ~~personal_growth 双结构分歧~~ **R649b 已专修**（NaN污染/体检TypeError崩溃/恒false 共6处，init 加 _normalizeHealthR649b 每日迁移，读写一律 `_pgHealthScoreR649b` 双形态安全读分）。残余 B类：pg.psychology 与 health.mental 双心理系统数据层仍不互通（render.js:6495 读 pg.psychology，events part2-8 读 health.mental）——R649b 仅叙事层弥合（a649b_depression_shadow shiftDepression 双写），彻底统一需动两侧消费者。

## 零消费素材账
- 域A/E 趋枯竭：trade 剩 lastPriceUpdate/_firstTradeDone(价值低)；E 剩 stopLossOrders 触发叙事/investFreq。
- 域C：~~_apprenticeList/_highSalaryHealthWarn~~ 已被 r515 消费（旧账过期勿再选）；R677b 后剩 `_legacyProjectDay`（时间戳深挖）/`_careerMonthlySnapshots`/`_burnoutWasHigh`。
- 域D 注意：R440(老陈)/R442(小薇) 并行已连做新NPC。

## 近况（R515-R738b）
- R738b 域E(本窗口自动化 07-29 05:1x-05:2x)：**重大A类**——investment.portfolio 全库零写入方，但 r443/r454/r493/r497/r501/r509/r520/r529/r710/r718/r726/r734/part7 共11+文件以其为 conditions 门槛/估值来源→r710系12事件恒false死事件+r443系 calcPortfolioValue 恒0。修复=investment.js 每日tick(_pv计算后)单点维护 inv.portfolio={stocks:{symbol:{shares,avgPrice,avgCost}},funds:{},totalValue:含股/房/BTC市值} 一次性复活全部读取方；②part7:4149 千万里程碑 st.bankBalance 死字段+Object.values(portfolio) 容器当持仓map→投资贡献恒0，改读 resources.bankBalance+totalValue。联动3(domain_e_linkage_r738b.js,3corporate)：_portfolioMilestone_100000 首读E→D/_portfolioPeakHistory 30日曲线首读E→G峰终/_portfolioMilestone_1000000 首读E→C。竞态新强度：并行10分钟内四笔提交、两套编号同时活跃(R714/R715小编号+R738/R739第五轮循环)，交付物被 [R714]6a246995(3源+挂载)+[R715]06f88e73(dist+round doc) 分两笔扫入，四项核验全过闭合。域E剩余素材：_portfolioMilestone_10000/50000/500000 中间三档仍零读取(阶梯叙事候选)/propertyPhaseStartDay/_propertyPolicyTightness 零事件。MC 10x500 196.1s 0代码异常/前7天死亡全0%(trader60/social70/corporate50既有RNG阈值)。
- R722b 域B(本窗口自动化 07-29 02:5x)：A类=0(四项审计净尽)。**B类双层修复**：events_core.js:717 tooltip直取story→全库782处{desc}占位符悬停泄漏→渲染层单点正则剥离+r700/r708/r715源头8处。联动3(domain_b_linkage_r722b.js)：_gratitudeLetterSent(R586写-only)B→H跨阶段首读/_b714PatternAnalyst+Storyteller B→C/E首读/_b714Resilient+Mindful B→G低健康窗口首读。竞态：并行~1.5轮/10分钟仍在加速(R714-R723)，R658b反向孤儿形态重现(dist+挂载入HEAD、4源漏add)由本轮闭合。C类：并行r715/r721 id前缀误用(b714_/h713_)全库唯一不改。push仍TLS阻断ahead16。
- R712b 域H(本窗口自动化 07-29 01:1x)：git log实测H=698全局最陈旧。A类=0（假键17命中全历史注释/占位符0/悬空0/effect白名单合规——四项例行审计净尽诚实报）。联动3(domain_h_linkage_r712b.js,3corporate)：boardPressureLevel≥2董事会阴影(H→D firstMetNpc铁律)/mediaRelations≥40+sentimentScore>0专访窗口期(H→B 写player.fame)/crisisLevel≥2危机深夜(H→G **_h698Fitness死flag首读**)。并行同期做R712域G(staged在途)——commit时机重估status，若并行r712仍staged会连带入本提交(挂载+文件成对无悬空,可接受)。构建13281.2KB。
- R677b 域C(本窗口)：A类2处——①_skillMasterTrainer 培训班承诺¥150/天零兑现→开班日+扣投入+daily_pipeline 每日兑现(150/扩班250,_trainerScaleUp 由联动事件置位)；②career_dev 6事件 story 占位符 {pathName}{levelName}{skillName}{masterName} 泄漏（渲染层只调 text()）→全部补 text() 动态叙述。联动3(domain_c_linkage_r677b.js)：_legacyProjectStarted/_legacyWatched 死flag首消费 + 培训班扩班。交付物被并行以 [R677] a6b054b2 扫入推送（并行同提交含其自有域C修复——同轮号同域双份互补新形态）。
- R658b 域B(本窗口)：news.js:452 _goodSleepToday 承诺零兑现 A类修复（_goodSleepDay 当日语义+就地兑现，CRLF 用 Python 精准替换）+ events_street_survival 三大承诺型写-only死flag首消费（_bulkSupplier→E/_liuPartner→C/_communityNetwork→D）。剩余域B素材：~~_gratitudeLetterSent~~ 已被R722b消费(B→H跨阶段感谢信回响)；新写-only候选:_b722bAnonymousGiver/_b714Sharer/_b714Listener/_b722bPatternCd系。
- R649b 域A(本窗口)：personal_growth 双结构分歧专修+健康素材激活（checkupHistory 首读/depression 首叙事/bmi 首写）。域A零消费素材更新：dental/vision score 仍零事件消费。
- 并行已推进至 R660 在途（7-28 17:30，~1.5分钟/轮，愈发快）。**同轮号冲突对策：本窗口一律 b后缀避让**；并行挂载先行/源先行两种半成品形态都有，均不碰。
- R640b 域H(本窗口)：正向孤儿救援 r601/r602/r623（源提交于 R586 但从未挂载=12死事件；r592≡r601 并行重复生成不挂）；联动3=morale写-only闭环首读/burnRate跑道警报/董事会shareholderTrust首引。
- **域H富矿（R712b后）**：boardPressureLevel/mediaRelations/sentimentScore/crisisLevel 已由 r712b 事件层首消费闭合；仅剩 company.efficiency 事件层薄弱（r602写+少量linkage读）；新写-only待读：_h698Sleep/_h698Focus/_h712bSprintPlan/_h712bDelegated。
- 域H结构速查：company 真实字段含 morale(惰性)/burnRate/cashReserve/monthsOfRunway/boardMembers[]/shareholderTrust/shareholderSatisfaction/revenue/valuation(52处消费)；corporate.colleagues=state.js:392真实；player.fame 真实。
- startup_events.js 在 **src/js/data/**（非core）；STARTUP_FIELD_MAP 白名单={cashReserve,reputation,marketScore,technologyScore,revenue}，effect键全集已核对无越界。
