# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-29 v3）

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log` 重算真实 recency（**勿信 loop-state，常严重滞后**）；核对轮号未被占用，本窗口一律 **b后缀避让**。并行在途改动一律不碰。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`；**同窗口连续多笔提交每笔前都要重新同步**。改源后必 `python build.py`（dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 10 --days 500`（OOM 回退 6x400）。0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过；存活率<80%（trader60/social70/corporate50）为既有 RNG 阈值；grinder 500d 可低至 0%（400d 恢复 16.7-50%）亦属 RNG 严苛度非崩溃。**"全策略0%存活+耗时<1s"=硬崩溃**→harness catch 加 e.stack 定位热修复。
- 新 linkage 文件必挂 `src/index.html` `<script>`（漏挂=悬空，build 静默剔除）。
- ⚠️ **window 导出严禁 wrapper**：经典脚本顶层函数声明本身即全局绑定，`window.f=function(){return f(...)}` 会让 f 解析到 wrapper 自身→无限递归爆栈（R746b MC 全策略0%实锤）。一律直接 `window.f = f`。push 前双向核对：`git show HEAD:src/index.html | grep <新文件>` + `git show HEAD:dist/app.js | grep -c <事件前缀>`。
- 本窗口 build 若吸入并行在途未提交源→**绝不提交 dist**。会话压缩后后台 MC task_id 丢失→直接重跑。
- pre-commit 坑：dist mtime 早于 src（并行 touch）→先 `git diff HEAD --stat` 核内容一致后 touch dist 重试，勿盲目重 build。

## 竞态形态（并行远快于本自动化，~1.5分钟/轮，两套编号 R7xx小编号+R7xx循环号同时活跃）
- 本窗口角色=「权威 bookkeeping + MC 验证 + 深审A类 + 联动」；代码常在写完3分钟内被并行 `git add -A` 扫走（多半 IDENTICAL，四项核验 HEAD 完整性——源+挂载+dist+A类修复 grep——通过即闭合勿重做）。
- ⚠️ 并行会 `reset --hard` 冲掉本窗口未提交落盘改动（无找回点）→改完关键文件立即 `git status` 核验；被冲掉先查 staged/HEAD 是否已含同内容。
- 悬空救援双形态都出现过：并行提交源+挂载不重建 dist（悬空 dist）/提交 dist+挂载漏 add 源（反向孤儿）→本窗口负责闭合。
- 同轮号双域/同轮号同域双份互补均已常态。旧 stash（27+条）勿 pop。
- CLAUDE.md 是 CRLF 且被并行持续重写——Python 字节级替换保留换行；无法干净暂存则跳过迭代表，权威在 round doc+loop-state。
- push 常因 TLS(本地代理3067未起)受阻——本地 ahead 属正常，网络恢复任一窗口 push 即闭合；也可能 remote 已被并行代推（fetch 核验 HEAD==origin/main 即闭合）。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：`condition`(单数)。news.js：NEWS_EVENTS，effects 的 job id/symbol 必须真实存在。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js（在 **src/js/data/** 非core）：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单={cashReserve,reputation,marketScore,technologyScore,revenue}。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`；心智 `player.mental`；健康 `status.health`；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`；证书 `state.certificates`。死字段黑名单：player.happiness/needs.health/player.health/certs。
- `player.corporate.upward` 惰性(||50)；`corporate.team/jobOffer/company/colleagues` 顶层真实；`player.fame` 真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility/trade）；`addSkillXp(skillKey,amount)` 假键静默丢弃，例行全库 grep 审计。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 无档案→firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股价取 `corporate.stockMarket[sym].price`；**inv.portfolio={stocks,funds,totalValue} 由 R738b 起 investment.js 每日tick单点维护**。
- personalGrowth：`health.{physical{score},mental{score,stress,anxiety,depression},metabolic}`+`learning`+`image`；读分一律 `_pgHealthScoreR649b` 双形态安全读。
- 域H company 真实字段：morale(惰性)/burnRate/cashReserve/monthsOfRunway/boardMembers[]/shareholderTrust/shareholderSatisfaction/revenue/valuation/boardPressureLevel/mediaRelations/sentimentScore/crisisLevel。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id。
- E：持仓写入前 Array.isArray 守卫；除数 isFinite+>0。
- G/H：daily_pipeline 无 slot 注册→包装全局函数接线；UI 安全区(100dvh/safe-area)勿回退。
- 模糊指令先 grep 确认存在；用户「无关」=停手。

## A类净尽结论（勿重复审）
- 深审净尽轮：A=R649b、B=R722b(前R658b/R411大修)、C=R677b、D=R757b(新NPC集成专审)、E=R738b、F=R747b(A类=0,六项审计净尽)、G=R746b、H=R712b。下轮最陈旧：**A(R649b) > B**。
- 域D 附注(R757b净尽项)：新NPC关系矩阵R455已入/好感衰减存在/xiaoWeiReferred有jobs.js:814消费/night_market+community_center地点已定义；affinityRewards引擎只认数组格式(R694/R532修)。
- 域F 附注：pg.psychology 为 personal_growth.js 真实活结构（render.js 读它正确，维持 B类双心理系统记录）；navigation.js:761 programmer 为 JSDoc 示例勿改。
- 死字段黑名单全库 grep=0 活命中即诚实报 A类=0（R712b 域H 即如此）。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确；establishMentorship/takeMentee 平行实现；setStopLoss 有调用方。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall 无 writer；并行 r715/r721 id前缀误用全库唯一不改。
- personal_growth 双结构已 R649b 专修；残余 B类：pg.psychology 与 health.mental 双心理系统数据层不互通（render.js 读前者，events part2-8 读后者），彻底统一需动两侧。
- 事件 story 占位符泄漏已 R722b 渲染层单点正则剥离+源头8处修复。

## 零消费素材账
- 域A：dental/vision score 零事件。域A/E trade 剩 lastPriceUpdate/_firstTradeDone(价值低)。
- 域B：_b722bAnonymousGiver/_b714Sharer/_b714Listener/_b722bPatternCd系。
- 域C：_legacyProjectDay/_careerMonthlySnapshots/_burnoutWasHigh。
- 域E：_portfolioMilestone_10000/50000/500000 三档零读取/propertyPhaseStartDay/_propertyPolicyTightness/stopLossOrders 触发叙事。
- 域H：company.efficiency 事件层薄弱；写-only待读 _h698Sleep/_h698Focus/_h712bSprintPlan/_h712bDelegated。

## 近况摘要（详情见 round doc + automation memory）
- R738b 域E(07-29)：investment.portfolio 全库零写入方致≈20死事件→tick 单点维护复活；part7 千万里程碑死字段修复。联动3(E→D/G/C)。
- R722b 域B：{desc}占位符泄漏双层修复；_gratitudeLetterSent B→H 首读。
- R712b 域H：A类=0 诚实报；boardPressureLevel/mediaRelations/sentimentScore/crisisLevel 事件层全部打通。
- R677b 域C：培训班承诺零兑现+6事件占位符泄漏修复；_legacyProjectStarted/_legacyWatched 首消费。
- R649b 域A：personal_growth 双结构专修。R658b 域B：_goodSleepToday 承诺兑现。R640b 域H：孤儿救援 r601/r602/r623。
- R747b 域F(07-29 07:5x)：A类=0 诚实报；联动3 消费 _maxEarnedMilestone/_milestoneEarned系/_streakMaster（域F零消费清零）。
- R757b 域D(07-29 08:4x-09:0x)：A类2处=新NPC好感承诺零兑现（lao_chen_60社区资源/xiao_wei_60摊位折扣，flag全库零读取）→npcs.js补即时收益+domain_d_linkage_events_r757b.js 3事件首消费(_laoChenCommunityHelp/_xiaoWeiDiscount/_laoChenMentorship)；救援反向孤儿c374(HEAD挂载源未提交)。提交dac2b81d+ec092dfa 均已PUSH（TLS已恢复，push通了）；dist由并行R758闭合。⚠️新坑：`git commit`不带路径吸入并行刚staged文件(接管r758)→竞态窗口建议`git commit -- <本轮路径>`；pre-commit "dist过期"若因并行touch src且内容一致→touch dist重试即过。
- 本窗口深审下轮候选（07-29 09:0x 时点）：**A > B**。
