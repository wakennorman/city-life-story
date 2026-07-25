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
- 域A R14/R22/R197/R242/R251/R258/R267/R277、域G R20/R192/R197/R199、域H R13/R21/R200、域F R19/R183/R186/R198 已净尽主隐患。
- 已知误报勿修：webapp_runtime_bridge getPlayerHealth（主路径正确）；establishMentorship/takeMentee 有平行实现。
- 既有 C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。

## 近况（R260-R271）
- R260 域E：stock.js renderStockCard 双除0守卫 + e260_*（消费 _bearMarketWitness/_consecutiveWins）。
- R271 域C（代码文件 domain_c_linkage_r269.js，R269/R270 编号被并行占为域E/域F）：修 skill_synergy.js getActiveSynergiesCount 字段错链（读 activeSynergies/activeThemes 从未写入，真实键 dual/triple/theme→技能Tab连携数恒0）+ c269_*（C→F消费修复计数/C→E首消费死flag _investReviewHabit/C→H复合技能变现）。
- 教训：CLAUDE.md 是 CRLF——脚本改写须保留原换行符，否则整文件 diff；并行窗口会 add -A 扫走本轮源码并自行编号，账本轮次以 git log 实况为准重算。
- R277 域A（第二轮第十一次）：loop-state 曾严重滞后（标R271/next=G），并行已推进 R272-R276→据 git log 重算 recency 取 A(最新R267)为最薄弱→R277。A类=0 诚实报告（死字段黑名单全库0命中）+ a277_*（A→C识货砍价/A→D街坊团购守rel.met/A→H成本控制报告）。构建9670.3KB。recency 基准(账本R278后·R277编号被并行占为域F)：A=278/B=274/C=272/D=275/E=276/F=277/G=271/H=273 → 下轮 G(最薄弱)。
- recency 基准(R271 后)：A=267/B=266/C=271/D=268/E=269/F=270/G=264/H=265 → 下轮 G。
- R284 域E（第四轮·账本R284）：A类1 = investment.js buyBtc 与 sellBtc/buyInvStock 不对称守卫缺口（缺 `if(!inv)return`→旧档 state.investment 未初始化时 `inv.btcPrice` 抛 TypeError 崩溃 / 缺 amount 校验→负数增币经济漏洞 / 补 btcPrice 有限性判定）。联动3 domain_e_linkage_r284.js（E→G btc_cold_wallet 置_assetSecurityMindset / E→A dip_buying_nerve 置_marketDisciplineForged / E→H seed_from_gains 收益→management XP+upward）。源码被并行 f21054e3「feat[域E R284]」扫入上 main，本窗口补账本 085c1c30+回填 35694a98。recency 基准(账本R284后)：A=280/B=281/C=282/D=283/E=284/F=277/G=278/H=279 → 下轮 F(最薄弱)。
