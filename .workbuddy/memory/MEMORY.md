# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-27 v2）

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log` 重算真实 recency（**勿信 loop-state，常严重滞后/被并行改写**）；`ls src/js/core/*r{N}*`+grep index.html 核对轮号未被占用。并行在途改动 `git stash push -- <文件>` 隔离，push 后 pop（若并行已自行提交新版则**勿 pop**，仅留作找回点）。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。改源后必 `python build.py`（dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`。0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过；存活率<80% 多为既有 RNG 阈值。
- ⚠️ **MC "全策略0%存活+耗时<1s"=硬崩溃**→harness catch 加 e.stack 定位，立即热修复上 main。
- 新 linkage 文件必挂 `src/index.html` `<script>`（漏挂=悬空，build 静默剔除）。
- **push 前双向核对**：`git show HEAD:src/index.html | grep <近轮新文件>` + `git show HEAD:dist/app.js | grep -c <事件前缀>` vs 源文件存在性（悬空 dist 救援已成模式：并行常提交源+挂载但不重建 dist）。
- 本窗口 build 若含并行在途未提交源→**绝不提交 dist**（避免反向孤儿）；round doc 由本窗口补写（并行只写 commit message）。
- 会话被压缩后后台 MC task_id 会丢失→直接重跑。

## 竞态形态（并行窗口速度远快于本自动化）
- 本窗口角色偏「权威 bookkeeping + MC 验证 + 联动/偶发A类」；代码常在写完3分钟内被并行 `git add -A` 扫入其提交（多半 IDENTICAL，核验后即闭合勿改名）。
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
- 域C 剩：`_apprenticeList`/`_highSalaryHealthWarn`。
- 域D 注意：R440(老陈)/R442(小薇) 并行已连做新NPC。

## 近况（R515-R649b）
- R649b 域A(本窗口)：personal_growth 双结构分歧专修+健康素材激活（checkupHistory 首读/depression 首叙事/bmi 首写）。**新救援形态：并行在途源已落盘未提交+挂载已写共享 index.html→本窗口提交 index.html 时必须连带提交该源防悬空**（r649 即此例）。域A零消费素材更新：bmi/checkupHistory 已激活；dental/vision score 仍零事件消费。
- 并行已推进至 R639（7-28 14:51，~5分钟/轮）。**同轮号冲突新形态：并行挂载先行、源未落盘**（R640 index.html:1473 挂 r640.js 无源文件）→本窗口同轮号时改 **b后缀**（r640b）避让，勿删并行在途挂载行。
- R640b 域H(本窗口)：正向孤儿救援 r601/r602/r623（源提交于 R586 但从未挂载=12死事件；r592≡r601 并行重复生成不挂）；联动3=morale写-only闭环首读/burnRate跑道警报/董事会shareholderTrust首引。
- **域H富矿**：company.efficiency（r602写入无读者）/boardPressureLevel/mediaRelations/sentimentScore/crisisLevel（P1-6/P1-7大系统事件层零引用）。
- 域H结构速查：company 真实字段含 morale(惰性)/burnRate/cashReserve/monthsOfRunway/boardMembers[]/shareholderTrust/shareholderSatisfaction/revenue/valuation(52处消费)；corporate.colleagues=state.js:392真实；player.fame 真实。
- startup_events.js 在 **src/js/data/**（非core）；STARTUP_FIELD_MAP 白名单={cashReserve,reputation,marketScore,technologyScore,revenue}，effect键全集已核对无越界。
