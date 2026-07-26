# MEMORY — 城市浮生记 优化循环（压缩版 2026-07-26）

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log` + `ls *linkage_r{N}*` 核对轮次未被并行窗口占用；并行在途改动先 `git stash push -- <文件>` 隔离，push 后 pop。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（须为当前 HEAD）。改源后必须 `python build.py`（dist 须比 src 新）并 add dist 变更。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`。
- 每次代码改动更新 `src/DEVELOPMENT.md` 顶部版本行。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`。存活率<80% 多为既有 RNG 阈值，0 TypeError/ReferenceError/NaN/Infinity 即过。
- 新 linkage 文件必须挂 `src/index.html` `<script>`（漏挂=悬空，build 重建即静默消失）。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：MORAL_EVENTS+MORAL_CONSEQUENCES，`condition`(单数)。
- news.js：NEWS_EVENTS；followUpId 动态生成勿误报；effects 的 job id/symbol 必须真实存在。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`（player.happiness 死字段）；心智 `player.mental`；健康 `status.health`；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`。
- 证书 `state.certificates`（certs 死）；`player.corporate.upward` 真实惰性字段；`corporate.team/jobOffer/company` 顶层真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility）；addSkillXp 假键静默丢弃；`st.skills[k].level/.xp`。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 仍 TODO→用 firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；symbol 以 INV_STOCKS 为准。locations specialties/priceMod 键=good.id。
- `_eraState.inflationIndex`(≥1.2/1.3 活跃)/`.stageId`；`_dataInvestorMindset`/`_consecutiveWins`/`_totalInvestmentProfit` 为真实活跃 flag/计数器。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met&&(rel.affinity||0)>=N`；好感一律 applyAffinityChange；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js,10×42)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy id（真实 driving_logistics/driving_logistics_accounting）。
- E：持仓写入前 Array.isArray 守卫；除数(avgPrice/prev)须 isFinite+>0；公司股持仓无 .price，价取 `corporate.stockMarket[sym].price`；股票 industry 必须在 WORLD_SECTORS。
- G/H：daily_pipeline 无 slot 注册机制→用包装全局函数接线（如 tickInvestmentDaily 重赋值）；UI 安全区(100dvh/safe-area)勿回退。
- 模糊指令先 grep 确认存在；用户「无关」=停手。

## A类净尽结论（勿重复审）
- 域A R14/R22/R197/R242/R251/R258/R267/R277、域G R20/R192/R197/R199/R311、域H R13/R21/R200、域F R19/R183/R186/R198 已净尽主隐患（域G R311 为后续补充的 Yahoo 财经解析器 prevClose 护栏）。
- 已知误报勿修：webapp_runtime_bridge getPlayerHealth（主路径正确）；establishMentorship/takeMentee 有平行实现。
- 既有 C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。

## 近况（R260-R271）
- R260 域E：stock.js renderStockCard 双除0守卫 + e260_*（消费 _bearMarketWitness/_consecutiveWins）。
- R271 域C（代码文件 domain_c_linkage_r269.js，R269/R270 编号被并行占为域E/域F）：修 skill_synergy.js getActiveSynergiesCount 字段错链（读 activeSynergies/activeThemes 从未写入，真实键 dual/triple/theme→技能Tab连携数恒0）+ c269_*（C→F消费修复计数/C→E首消费死flag _investReviewHabit/C→H复合技能变现）。
- 教训：CLAUDE.md 是 CRLF——脚本改写须保留原换行符，否则整文件 diff；并行窗口会 add -A 扫走本轮源码并自行编号，账本轮次以 git log 实况为准重算。
- R277 域A（第二轮第十一次）：loop-state 曾严重滞后（标R271/next=G），并行已推进 R272-R276→据 git log 重算 recency 取 A(最新R267)为最薄弱→R277。A类=0 诚实报告（死字段黑名单全库0命中）+ a277_*（A→C识货砍价/A→D街坊团购守rel.met/A→H成本控制报告）。构建9670.3KB。recency 基准(账本R278后·R277编号被并行占为域F)：A=278/B=274/C=272/D=275/E=276/F=277/G=271/H=273 → 下轮 G(最薄弱)。
- recency 基准(R271 后)：A=267/B=266/C=271/D=268/E=269/F=270/G=264/H=265 → 下轮 G。
- R284 域E（第四轮·账本R284）：A类1 = investment.js buyBtc 不对称守卫缺口（!inv 守卫+amount 校验+btcPrice 有限性）。联动3 e284_*。源码被并行 f21054e3 扫入上 main。
- R296 域G（第五轮·账本R296）：A类1 = carry.js hireTransport 与天气断链——weather.js:789 getWeatherTransportRiskMod 全库零调用方死代码→货损/交通意外掷骰乘天气倍率接线（偷窃不乘，isFinite+cap0.95）。确证 scenario_start_chains.js 13个剧本死flag（写入无读取），r296 消费3个（_hasToolkit/_interviewPassed/_firstJobFound），余10个待后续消费：_restaurantConnection/_sleptRoughThreeDays/_triedStall/_tookLanguageClass/_stickToFactory/_familyFundUsed/_marketResearchDone/_startupDirection/_consultedLawyer/_familyBudgetDone。weather.js:927 getWeatherEnhancedDesc 由 g296_weather_survival_wisdom 首调复活。域G B类记录：life_nodes.js:205 `*5||200` 误给200XP / uni_engineering 提示与effect不符。
- ⚠️ 教训(R296)：新建 linkage 文件前必须先 `ls src/js/core/*r{N}*` + grep index.html——并行窗口会预先占用编号并提交同名文件，Write 会静默覆盖已提交文件（本轮误覆盖 r294 后靠 git checkout -- 恢复）。
- recency 基准(账本R296后)：A=288/B=289/C=290/D=291/E=292/F=293/G=296/H=295 → 下轮 A(最薄弱)。
- R311 域G（第七轮循环·账本R311）：开轮 loop-state 严重滞后(标R296/next=A)，git log 重算并行已推进 R297(B)-R310(F)→各域最新 A=304/B=305/C=307/D=308/E=309/F=310/G=302/H=303 → G(302)全局最薄弱→本轮域G。A类1 = world_params.js 两处 Yahoo 财经解析器(parseYahooFinanceResponse/同步XHR版)未守卫 prevClose（与腾讯/新浪解析器护栏不一致）→prevClose=0/NaN 时 changePercent=Infinity/NaN 污染 world_params 市场情绪与增长假设（A类#3 极端值崩溃），补齐一致护栏。联动3(domain_g_linkage_r311.js 由并行窗口预建并注册 src/index.html:965：G→E life_wealth_milestone_v2 总资产≥50万/G→H life_company_anniversary_v2 startup满730天/G→A life_data_comprehensive day≥500，全||防御)。构建9949.3KB；MC 6×400d 0代码异常。
- R312 域H（第七轮循环完成!·由并行窗口推进并 push origin/main 9bd4532d/3ff50622）：本窗口未参与代码（domain_h_linkage_r312.js 由并行预建并提交），仅回填 recency+bookkeeping。域H 第七轮循环收官。
- recency 基准(账本R312后)：A=304/B=305/C=307/D=308/E=309/F=310/G=311/H=312 → 下轮 A(最薄弱)。
- R320 域H（第八轮循环完成!·账本R320）：开轮 loop-state 严重滞后(标R312/next=A)，git log 重算并行已推进 R313(A)-R319(G)，**⚠️域B第八轮以 chore「sync pending changes R314」提交 domain_b_linkage_r314.js 落地→feat grep 会漏判(误显示 B=305)，实际 B=314**。真实 recency A=313/B=314/C=315/D=316/E=317/F=318/G=319/H=312 → H(312)全局最薄弱→本轮域H。A类1 = startup.js:1894 `_calculateQuarterlyKPIScore` B轮董事会 KPI 除零/NaN崩溃：`BOARD_KPI_REQUIREMENTS.B.profitability.target=0.0`(盈亏平衡)命中 `target<=0` 分支时分母 `target*valuation*2=0`→`netCash/0`(>0恒满分1.0无梯度/<0恒0/**=0时0/0=NaN污染 totalWeightedScore→finalScore=NaN→董事会评分崩溃**)。改比例式 `min(1,max(0,1+netCash/max(1,|valuation|*0.05)))`+正目标分支补 denom>0 守卫+isFinite兜底。本窗口独立定位+修复→被并行 add-A 扫入 8f270dc7(R321) push。联动 domain_h_linkage_r320.js(H→A数据面板v2/H→G创始人健康v2/H→B公司历史书)由并行 1803127b 完成push。MC 6×400d 0代码异常。
- ⚠️ 教训(R320)：判定 recency 必须同时看 feat 与 chore/文件落盘——并行窗口常以 chore「sync pending changes」名义提交某域轮次(如域B R314)，纯 `grep '[域X R]'` feat 会漏判该域最新轮次。
- recency 基准(账本R320后)：A=313/B=314/C=315/D=316/E=317/F=318/G=319/H=320 → 下轮 A(recency 313 最薄弱,第九轮起点)。
- recency 基准(对账轮R324·真实 git log 重算): A=321/B=323/C=315/D=316/E=317/F=318/G=319/H=320 → 下轮 C(recency 315 最薄弱, 第九轮 R325)。注: 并行 loop-state 滞后 R320, 本窗口已修正为 R324; 域B R323 由并行 4b547ae4 提交(B 314→323), 域A R321 由 c4f49757 提交(A 313→321)。本窗口角色=权威 bookkeeping+MC验证+偶发A类定位, 不抢并行在途代码轮次。
- R331 域A（第十轮循环起点·代码被并行 add-A 扫入 feat 2d18fa43/chore 3b4ebcd9 并 push origin main）: A类1 = phase1/illness.js jobRiskMap 三死 job id(skilled_labor_construction/customer_service_tech/food_stall 全库0命中)→ steel_worker 复活 + 2 死键删除。联动3(domain_a_linkage_r331.js, A→G/A→D/A→H)。误报排除: jobs.js payCalc 读 state.skills.X.level 无可选链——state.js 全12键恒初始化非崩溃(B类防御一致性)。
- ⚠️ 辅助函数签名确认(写 linkage 必守): `addSkillXp(skillKey,amount)` 全局读 state, **非** (state,key,amt); `applyAffinityChange(state,npcId,change,reason)`@npc_relationships.js —— 位置参数顺序固定, 误传 state 作首参会静默失效/崩。
- recency 基准(R331后): A=331/B=323/C=324/D=325/E=326/F=327/G=329/H=330 → B(323)全局最薄弱, 下轮 R332=域B。
