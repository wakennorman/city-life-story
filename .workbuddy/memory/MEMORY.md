# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-31 v4）

## 提交纪律
- 开轮先 `git log` 重算 recency（**loop-state 常严重滞后，勿信**）；轮号被占则 **b 后缀避让**；并行在途改动不碰。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（同窗口每笔提交前都重同步）。改源后必 `python build.py`（约 3 分钟，dist 须比 src 新）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突即中止。
- 竞态窗口建议 `git commit -- <本轮路径>`，否则会吸入并行刚 staged 的文件。
- pre-commit 报 dist 过期（并行 touch src）→`git diff HEAD --stat` 核内容一致后 touch dist 重试，勿盲目重 build。
- 新 linkage 必挂 `src/index.html` `<script>`（漏挂=悬空，build 静默剔除）。push 前双向核对 `git show HEAD:src/index.html | grep <文件>` + `git show HEAD:dist/app.js | grep -c <事件前缀>`。
- ⚠️ **window 导出严禁 wrapper**：经典脚本顶层函数声明本身即全局绑定，`window.f=function(){return f(...)}` 会无限递归爆栈。一律 `window.f = f`。
- push 常因本地代理 3067 未起（TLS）失败；本地 ahead 属正常，任一窗口网络恢复后 push 即闭合。

## 验证
- **语法体检（R1016b 起纳入例行）**：单进程 `vm.Script` 全量扫 `src/js/**/*.js`（1151 文件约 2 秒）。逐文件 spawn `node --check` >3min 不可用。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 10 --days 500`（OOM 回退 6x400）。判过：0 TypeError/ReferenceError/NaN/Infinity + 前 7 天死亡率 0%。存活率 <80%（trader60/social70/corporate50）、grinder 500d 可低至 0% 均为既有 RNG 严苛度，非崩溃。**"全策略 0% 存活 + 耗时 <1s" = 硬崩溃** → harness catch 打 e.stack 定位。
- 开轮例行 `grep -cE '^t' src/index.html` 清扫杂散 t 字符（并行挂载模板会产病）。

## 竞态形态
- 本窗口角色 =「权威 bookkeeping + MC 验证 + 深审 A 类 + 联动」。代码常在写完 3 分钟内被并行 `git add -A` 扫走（多半 IDENTICAL）→ 四项核验（源/挂载/dist/A类修复 grep）通过即闭合，勿重做。
- 并行会 `reset --hard` 冲掉未提交落盘改动 → 改完关键文件立即 `git status` 核验。
- 悬空双形态：提交源+挂载不重建 dist（悬空 dist）/ 提交 dist+挂载漏 add 源（反向孤儿）→ 本窗口负责闭合。
- CLAUDE.md 为 CRLF 且被并行持续重写 → Python 字节级替换保留换行；无法干净暂存则跳过迭代表，权威在 round doc + loop-state。旧 stash（27+ 条）勿 pop。

## 事件系统（四套，全局 bundle 非 import）
- `moral_events.js`：`condition`（单数）。`news.js`：NEWS_EVENTS，effects 的 job id/symbol 必须真实存在。
- `events_core.js`：RANDOM_EVENTS；**无 `phase` 字段 = 死事件**，linkage 必须显式 `phase:"street"/"corporate"`；门控 `conditions`（函数）。唯一事件入库单点 `recordEventToHistory()`。
- `startup_events.js`（在 **src/js/data/** 非 core）：只认 `conditions:`（复数）；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单 = {cashReserve,reputation,marketScore,technologyScore,revenue}。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。
- 价格刷新唯一单点：`src/js/phase1/trade.js` → `updateAllPrices(state)`（daily_pipeline 每 3 天调用）。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`；心智 `player.mental`；健康 `status.health`；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`；证书 `state.certificates`。**死字段黑名单**：player.happiness / needs.health / player.health / certs。
- `player.corporate.upward` 惰性(||50)；`corporate.team/jobOffer/company/colleagues` 顶层真实；`player.fame` 真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility/trade）。`addSkillXp(假键)` 静默丢弃。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 无档案 → firstMetNpc 遍历。
- investment：industry ∈ WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股价 `corporate.stockMarket[sym].price`；`inv.portfolio` 由 investment.js 每日 tick 单点维护（R738b）。
- personalGrowth：`health.{physical{score},mental{score,stress,anxiety,depression},metabolic}` + learning + image；读分一律 `_pgHealthScoreR649b` 双形态安全读。
- 域H company：morale(惰性)/burnRate/cashReserve/monthsOfRunway/boardMembers[]/shareholderTrust/shareholderSatisfaction/revenue/valuation/boardPressureLevel/mediaRelations/sentimentScore/crisisLevel。

## 域铁律
- **D**：引用 NPC 须 `rel && rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`；显名 `getNpcDisplayName`。
- **C**：职业线唯一入口 `CAREER_PATHS`(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id。
- **E**：持仓写入前 `Array.isArray` 守卫；除数 `isFinite` + >0。
- **G/H**：daily_pipeline 无 slot 注册 → 包装全局函数接线；UI 安全区(100dvh/safe-area)勿回退。
- 模糊指令先 grep 确认存在；用户「无关」= 停手。

## A类净尽结论（勿重复审）
最近深审轮：**A=R903b · B=R1016b · C=R792b · D=R900b · E=R819b · F=R826b · G=R894b · H=R798b**。
下轮最陈旧：**H(R798b) > E(R819b) > F(R826b)**。

- 域A(R903b)：CERTIFICATES 18 证 effects 已逐项对账，driver_license.agility / bicycle.fatigue_reduction / warm_coat.comfort 三处死数据已接入 daily_pipeline。construction_safety.injuryReduction 硬编码 0.5 已兑现，非死数据勿修。dental/vision score 不存在（误报已清）。
- 域B(R1016b)：详见下方"近况"。story 占位符泄漏三层已全闭合（R455 text()优先 / R722b tooltip 剥离 / R785b story 兜底剥离），勿重复审。
- 域C(R792b)：假技能键全库活代码=0；synergy requiredFlag 8 处全匹配；CAREER_PATHS 无缺 job id；`_jobMultipliers` 在 main.js 有真实消费方。
- 域D(R900b)：social_network.js 全链已通（发朋友圈按钮解锁+visibility 改 public / triggerPublicOpinionCrisis 接线 / npcPostFeed 接线）。visibility 合法枚举仅 'public'/'friends'/'private'。affinityRewards 引擎只认数组格式。
- 域F：`pg.psychology` 为 personal_growth.js 真实活结构（render.js 读它正确）；navigation.js:761 programmer 为 JSDoc 示例勿改。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确；establishMentorship/takeMentee 平行实现；setStopLoss 有调用方。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall 无 writer；并行 r715/r721 id 前缀误用。
- 残余 B类：`pg.psychology` 与 `health.mental` 双心理系统数据层不互通（render.js 读前者，events part2-8 读后者）。
- 死字段黑名单全库 grep=0 即诚实报 A类=0（R712b 域H 先例）。

## 零消费素材账
- 域A/E：trade 剩 lastPriceUpdate/_firstTradeDone（低价值）。_portfolioMilestone 全档已消费。propertyPhaseStartDay / _propertyPolicyTightness / stopLossOrders 待接叙事。
- 域B：R1016b 后清零，剩 `_b722bPatternCd`（冷却 flag，低价值）。
- 域C：job_milestone 写-only 剩 _buskingVenue/_constructionCertPath/_factoryReskilling/_gaokaoTutoring/_laoGuanFriend/_tutoringReputation/_vendingLoyalty/_wasteRecyclingContract（均有即时收益，非 A 类）。
- 域H：company.efficiency 事件层薄弱；写-only 待读 _h698Sleep/_h698Focus/_h712bSprintPlan/_h712bDelegated。

## 近况
- **R1016b 域B(07-31)**：史上最大范围 A 类。①**全库 22 个已挂载 linkage 文件 SyntaxError**（三形态：`story":"` 键名残缺引号 24 处 / r932 字符串内嵌未转义双引号 / `catch(e){return""})()` 缺函数体闭合 `}` 6 处）→ 整 IIFE 永不执行 + 阻断全站 build，跨 A/B/C/D/E/F/G/H 八域，已全修，全库语法错误归零。②**6 个计数器全库零写入方门控 35 事件**（_priceVolatilityCount 30 / _priceEventCount 2 / _eventsExperienced 2 / _economicEventCount 1 / _managementEventCount 1 / _majorChoiceCount 1）→ 在 trade.js `updateAllPrices` 与 events_core.js `recordEventToHistory`+选项结算点两处单点补写。③r840/r848 域A 悬空 6 事件补挂载。联动 3（b1016b_volatility_veteran B→A / b1016b_decision_weight B→G / b1016b_story_teller B→D）。
- R894b 域G：retire_advisor 漏设 _pensionBase（inline 优先兜底被 _inlineApplied 跳过）/ 空 skills.reduce 无初始值 / 杂散 t 字符 54 处 / 14 脚本双挂载去重。
- R792b 域C：job_milestone 承诺零兑现 4 处 → daily_pipeline 月度兑现。**承诺零兑现审计法**：grep 里程碑事件写入 flag → 全库读取扫描 → desc/hint 承诺 vs apply 实效逐项对照。
- R757b 域D：新 NPC 好感承诺零兑现 2 处。R738b 域E：investment.portfolio 零写入致 ≈20 死事件 → tick 单点维护复活。
