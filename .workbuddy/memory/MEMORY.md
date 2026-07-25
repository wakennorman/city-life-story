# MEMORY — 城市浮生记 全系统优化循环（精简版 2026-07-25）

## 提交纪律（自动化 v3.2：直接提交+push main）
- 每轮：只处理本轮文件；并行窗口在途改动**先 `git stash push -- <文件>` 隔离，push 后 pop 还原**（R193/194/195 验证无损）。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（须为**当前 HEAD**，否则 pre-commit 拦截）。
- 改源后必须 `python build.py`（dist 须比 src 新），`git add dist/` 变更文件。只 add 本轮文件；绝不 `-A`/`--amend`/force push。push 前 `git pull --rebase origin main`。
- 每次代码改动更新 `src/DEVELOPMENT.md` 顶部版本行。
- MC 验证：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`（10×500d 易 OOM）。存活率<80% 的 ❌ 多为既有 RNG 平衡阈值，只要 0 TypeError/ReferenceError/NaN/Infinity 即过。
- 轮次号协调：开轮先 git log + ls linkage_r{N} 核对轮次是否被并行窗口占用。

## 事件系统真实架构（四套子系统，全局 bundle 注入非 ES import）
- `data/moral_events.js` → MORAL_EVENTS 数组 + MORAL_CONSEQUENCES 对象；`evt.condition`(单数函数) 门控。
- `data/news.js` → NEWS_EVENTS，news_system.js 消费；`followUpId` 为动态生成 id 勿误报缺失。effects 里 job id/symbol 必须真实存在（R190 修 10 处死引用）。
- `core/events_core.js` → RANDOM_EVENTS 引擎；**:379 `filter(e=>e.phase===phase)` → 无 phase 字段=死事件**，linkage 事件必须显式 `phase:"street"/"corporate"`；门控用 `conditions`(函数)。
- `data/startup_events.js` → ALL_STARTUP_EVENTS（seed/growth/mature）；**只认 `conditions:`(复数)**，单数=死门控；容器是 `state.startup.company`（非 state.company）；选项 effect 走 STARTUP_FIELD_MAP(:1104) 白名单，不在表内静默丢弃（revenue 由 R193 补入）。
- 严禁重建已删除旧文件（cross_system_events.js 旧 670 事件不可还原）；`subsidy` 事件为故意删除（与 training_subsidy 去重），勿还原。

## state.js 真实字段基准（写条件前必核）
- 幸福感 `state.needs.happiness`（**`state.player.happiness` 是死字段**，历轮已修多处）；心智 `state.player.mental`；健康 `state.status.health`；饥饿 `state.needs.hunger`。
- 现金 `state.resources.cash`；存款 `state.resources.bankBalance`；每日流水 `state.flags._dailyTransactions`。
- `state.career` 动态字段（可 undefined）；证书 `state.certificates`（`state.certs` 死字段）；`st.player.corporate.upward` 是真实惰性字段（非错误）；`state.corporate.team/jobOffer/company` 为顶层真实字段。
- `skills` 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design）；addSkillXp 传假键静默丢弃。
- `reputation` 顶层按地点 key；`relationships` 可能 undefined；`xiaoli/auntie_lin/master_zhao` 在 npcs.js 仍 TODO——NPC 事件用 firstMetNpc 遍历，勿硬编码。
- investment 合法值：industry∈{科技,新能源,消费,金融,房地产,医药}；category∈{股票,贵金属,期货,虚拟币,基金,汽车}；symbol 以 INV_STOCKS 为准（含 COPPER/NICKEL/ALUM/CL/NG/ESTATE/HUAW/NVDA/TSMC/LITH）。
- locations.js `specialties`/`priceMod` 键必须是 **good.id** 非分类名（R189 修 9 地点）；无效 id 被静默丢弃。

## 域D NPC/社交铁律
- 引用 NPC 须 `rel && rel.met && (rel.affinity||0)>=N`；只读 `state.relationships`；跨 NPC 好感一律 `applyAffinityChange`（自动 clamp+记 _lastInteractionDay）；显名用 `getNpcDisplayName`；StateManager 调用前 typeof 守卫。
- 关系引擎 npc_relationships.js（14×14 矩阵，daily_pipeline slot 每日 tick）；`getNpcRelationshipNetwork` 仍死代码待接。

## 域C 职业铁律
- 职业线唯一入口 `CAREER_PATHS`（ui/career_dev.js，10路径×42职位）；勿另起平行职业系统（踩过坑）。
- jobs.js `requiredFlag:"_synergy_<id>"` 必须精确等于 skill_synergy.js 连携 id（真实：`driving_logistics`/`driving_logistics_accounting`，无 driving_accounting；R191 修 long_haul_driver 死工作）。

## 域E 经济/投资
- A类多藏于 investment.js(3941行)/investment_analysis.js 的旧存档迁移路径；持仓 `state.investment.stockHoldings/properties/cars` 写入前须 `Array.isArray` 守卫；btc 字段须 typeof+isFinite 显式判定防 cash NaN。
- `_totalInvestmentProfit`/`_consecutiveWins` 由 sellInvStock/sellBtc 维护（历轮已接，非死字段）。
- **R195**：investment_analysis.js 止损链（setStopLoss→stopLossOrders→checkStopLoss→sellInvStock）曾全库无调用方=死机制；R195 在 domain_e_linkage_r195.js 以**包装 tickInvestmentDaily** 方式接线（daily_pipeline:615 按名调用全局绑定，晚加载文件重赋值即生效——此模式可复用于"在途文件不可碰"时的接线）；analyzeStockTechnicals 由 invest_r195_technical_review 事件复活。注册序：该文件须在 investment_analysis.js(:836) 之后。
- 并行窗口正开发「财务Tab」（index.html tab按钮/investment.js tradeLog/render*/state.js 等在途），勿碰勿回退。
- **R201 修复(闭合 R198 C类)**：investment.js 经济焦虑「净值回撤」块曾写 `state.needs.health`+`state.needs.mental` 两处死字段(每日回撤的健康/心智惩罚静默丢失)——R201 已改为真实 `state.status.health`/`state.player.mental`(A类#4,本轮起生效)。`webapp_runtime_bridge.js:172-189` getPlayerHealth/addPlayerHealth 经 R199 核实主路径正确读 `state.status.health`(player.health 仅永不触发兜底)——**非死字段,勿误修**。
- **R201 脱钩修复**：stock.js OIL「黑金能源」`industry` 合法值须在 **WORLD_SECTORS**(科技/消费/金融/房地产/医药/**新能源**)内——原写 `"能源"` 不在表→getSectorHeat/新闻板块匹配对 OIL 恒返回中性、股价脱钩,R201 改 `"新能源"`。写股票 industry 前务必核 WORLD_SECTORS。
- **R201 联动**：domain_e_linkage_r201.js(1 street+2 corporate,注册于 index.html r200 之后):econ_r201_drawdown_reflect(E→G·首次叙事消费本轮经济焦虑回撤机制)/econ_r201_annual_ledger(E→A·首个反思式消费 `_totalInvestmentProfit`·盈亏两态)/econ_r201_capital_backbone(E→H·_totalInvestmentProfit>0+在职→management XP+cash)。
- **R246 域E 修复·双重复活+悬空注册补挂**：①净资产计算 `if(_s&&_s.shares>0&&_s.price)`——公司股持仓**无 .price 字段**(建仓仅 `{symbol,name,shares,avgPrice}`,stock.js:305 实证),恒假→改 `st.corporate.stockMarket[_s.symbol].price` 权威取法(stock.js:570 持仓概览同源)+`avgPrice` 回退+`isFinite` 守卫;`domain_e_linkage_r235.js` 内导出 `window._getMarketTrendR235`/`window._calcNetWorthR235` 供联动复用。②同文件 `_downPct` 声明滞后(var 提升恒 undefined→bear 分支死)→前置 `var _upPct=...; var _downPct=...;` 声明。③`_wealthSocialBonus`(≥3) 由 `e246_wealth_treat_neighbors` 首次消费(复活死flag)。④开轮必查：并行窗口新建 linkage 文件可能忘挂 `src/index.html` `<script>`(R244 漏注册踩坑)——build.py 按 index.html script 序串接,漏挂=悬空文件=重建后内容静默消失,dist 中临时手改内容会在下次 build 被剔除必现回归。

## 域A 数据/数值平衡
- 三证书 cooking_cert/repair_cert/sales_cert 的 effects `cookingXpBonus/repairXpBonus/salesXpBonus/chefJobIncomeBonus/repairJobIncomeBonus/salesJobIncomeBonus` 曾全库零消费者(R242 修)：main.js 发证循环累积 `state.flags._certSkillXpBonus`(按 skill 键取最高)→addSkillXp 接证书 XP 乘区；`state.flags._certJobIncomeBonus`(按 job.effects 主技能匹配取最高)→`getCertJobIncomeMultiplier(job,state)` 接工资链(estimateJobPay/estimateJobPayRange/doStreetJob 实发三处)。
- doStreetJob 旧有三处 `addSkillXp("agility"/"physique"/"intelligence")` 是非真实技能键(`state.skills` 仅 cooking/repair/coding/.../social)→静默丢弃；agility/physique/intelligence 是 `state.player` 属性，已由「状态经验转化」块承接(R242 移除死调用)。
- 证书健康/心智/患病风险/疲劳效果键由 R197 接(healthBonus→status.health / mentalBonus→player.mental / illnessRiskReduction→_illnessRiskReduction / fatigueReduction→_certFatigueReduction)，已记录于 域E 段之上。
- **R251 域A(第五轮)诚实报告 A类=0**：逐审 illnesses/illness/jobs/economy_v3.1/skill_synergy/items/finance/needs/goods——死字段黑名单grep全库0命中、8个`_synergy_`flag全匹配连携id、6个referral flag均有writer、goods定价自洽无>3倍错配、items `skillStudy` 无应用器为既有C类(R197已记不修)、演化链计数器/age门控经R197/R242加固均真工作。历轮R14/R22/R197/R242 已净尽。联动新建 domain_a_linkage_r251.js(a251_ 前缀,补齐历轮域A**全新配对 A→D/A→E**): a251_skill_neighbor_help(A→D 真实技能level≥5+applyAffinityChange域D铁律)/a251_price_inflation_sense(A→E 读真实`_eraState.inflationIndex`≥1.2置`_dataInvestorMindset`)/a251_ledger_year_review(A→H accounting/management≥8+在职→management XP)。真实字段确认:`st.skills[key].level/.xp`、`st._eraState.inflationIndex`(阈值1.2/1.3真实活跃)、`_dataInvestorMindset`(E域真实消费flag)。

## 域F/G/H 要点
- UI 安全区：#app 100dvh / viewport-fit=cover / tab-bar+mobile-hud safe-area padding，勿回退。
- critical.js 延期惩罚阶梯、startup_crisis 危机链均已接线复活（R20/R21）；events_corp `.exp`→`.xp`（全库统一 .xp）。
- daily_pipeline 无通用外部 slot 注册机制（静态数组）；接线新逻辑用包装全局函数模式。
- **域G 时代变迁(era_transform)**：`ERA_EVENTS_TRIGGER_DAYS=[90,180,270,365,450,540,720,900]` 与 era_events.js day 集合完全一致(无死里程碑)；`state._eraState`(真实活跃字段,被 cross_system 数十处消费)含 `.inflationIndex`(基准1.0,1.3为通胀显著阈值)与 `.stageId`(≠"initial" 表已入周期)。`state._pendingEraEvent` 是**确证的死flag**(仅 era_transform.js:137 写入/:240 init 置null,全库零消费者,scheduleChainEvent 有兜底)——**R199 事件 `era_r199_reflection` 首次消费并在 apply 置 null,形成"写入→消费→清除"闭环,复活该叙事层**。
- **域G 多轮加固结论(R20/R192/R197/R199)**：A类已净尽。R199 再审计15核心文件+死字段黑名单grep+pipeline slot生产者核查+era day匹配,候选(`_pendingEraEvent`/`webapp_runtime_bridge`/`career_burnout`/`ERA_EVENTS_TRIGGER_DAYS`)逐一证伪,诚实报告 A类0项。联动3项(新建 domain_g_linkage_r199.js,已 push main 862a993f): G→B时代回望·复活死flag _pendingEraEvent / G→E通胀避险·读 _eraState.inflationIndex≥1.3→置 _dataInvestorMindset / G→H久历周期经营定力·_eraState.stageId≠initial+在职→addSkillXp management+cash。下轮→H(recency 193 最薄弱)。
- **域H 多轮修复结论(R13/R21/R200)**：A类已净尽(R13 修 startup 空员工 NaN+startup_crisis 危机链死代码 / R21 修 events_corp `corporateorate` 9处拼写+startup.js 空员工 NaN+startup_crisis 接线复活)。R200 域H 第三轮再修3项(A类)：①corp_ops.js `doCorporateAction` 行动结算后接线办公室政治互动事件死机制——`triggerOfficePoliticsEvent`+`OFFICE_POLITICS_EVENTS`(5事件)全库零调用方,R200 在结算后 `typeof showModal` 守卫接线;②career_dev.js 导师关系死路——`endMentorship` 零调用方(全库无解除入口),R200 补「👋解除师徒」按钮+`careerSocialAction("unmentor")` 分支复活;③workplace_social.js 徒弟出师死循环——`mentee.progress` 卡100每日刷屏+零回报+永占3席,R200 改一次性回报(人缘+5/关系+10+毕业移除)。`decreaseColleagueRelationship` 死函数经 R200 事件 `corp_r200_colleague_thaw`(H→D)复活。
- **域H 误报修正(R200)**：`establishMentorship`(拜师)有 career_dev.js `careerSocialAction("mentor")` 平行实现、`takeMentee`(收徒)有 workplace_social_events.js 平行实现——**非死机制,勿误修**;真死路是"解除师徒无入口"(endMentorship 零调用方)。`mentorship.level` 每日+0.5 但无 gameplay 消费(死数据),R200 事件 `corp_r200_mentor_wisdom`(H→B,level≥90门槛)首次使其有叙事回报。

## 模糊指令处理
- 收到模糊 scene/主题指令先 grep 确认真实存在；用户一句「无关」=最高优先级停手信号。
