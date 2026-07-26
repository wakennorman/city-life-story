# MEMORY — 城市浮生记 8域轮换优化循环（压缩版 2026-07-27）

## 提交纪律（自动化：直接提交+push main）
- 开轮先 `git log` 重算真实 recency（**勿信 loop-state，常严重滞后**）；`ls src/js/core/*r{N}*`+grep index.html 核对轮号未被并行占用。并行在途改动先 `git stash push -- <文件>` 隔离，push 后 pop。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（须=当前HEAD 过 pre-commit 漂移检查）。改源后必 `python build.py`（dist 须比 src 新，pre-commit 会查）。只 add 本轮文件；绝不 `-A`/`--amend`/force。push 前 `git pull --rebase origin main`，冲突则中止报告绝不 force。
- MC：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`。存活率<80% 多为既有 RNG 阈值，0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0% 即过。
- ⚠️ **MC "全策略0%存活+耗时<1s"=硬崩溃**（非RNG阈值）→立即抓 stack 热修复上 main（harness catch 加 e.stack 定位到行）。
- 新 linkage 文件必须挂 `src/index.html` `<script>`（漏挂=悬空 build 静默剔除）。
- **并行窗口极活跃、速度远快于本自动化**：代码轮次常被并行 `git add -A` 扫入其提交并自行编号；本窗口角色偏「权威 bookkeeping + MC 验证 + 联动/偶发A类」，账本轮号以 git log 实况重算。判 recency 须同看 feat 与 chore(「sync pending changes」名义常藏某域轮次)。

## 事件系统（四套，全局 bundle 非 import）
- moral_events.js：MORAL_EVENTS+MORAL_CONSEQUENCES，`condition`(单数)。
- news.js：NEWS_EVENTS；followUpId 动态生成勿误报；effects 的 job id/symbol 必须真实存在。
- events_core.js：RANDOM_EVENTS；**无 `phase` 字段=死事件**，linkage 必须显式 phase:"street"/"corporate"；门控 `conditions`(函数)。
- startup_events.js：只认 `conditions:`(复数)；容器 `state.startup.company`；effect 走 STARTUP_FIELD_MAP 白名单。
- 严禁重建已删旧文件；`subsidy` 为故意删除勿还原。

## state.js 真实字段（写条件前必核）
- 幸福 `needs.happiness`（player.happiness 死字段）；心智 `player.mental`；健康 `status.health`（needs.health/player.health 死字段）；饥饿 `needs.hunger`；现金 `resources.cash`；存款 `resources.bankBalance`；流水 `flags._dailyTransactions`。
- 证书 `state.certificates`（certs 死）；`player.corporate.upward` 真实惰性字段(||50)；`corporate.team/jobOffer/company` 顶层真实。
- skills 真实键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social（无 writing/design/agility）；`addSkillXp(skillKey,amount)` 全局读 state（**非** (state,key,amt)），假键静默丢弃；`st.skills[k].level/.xp`。
- reputation 顶层按地点 key；relationships 可 undefined；xiaoli/auntie_lin/master_zhao 仍 TODO→用 firstMetNpc 遍历。
- investment：industry∈WORLD_SECTORS{科技,新能源,消费,金融,房地产,医药}；公司股持仓无 .price，价取 `corporate.stockMarket[sym].price`。
- 真实活跃 flag/计数器：`_dataInvestorMindset`/`_consecutiveWins`/`_totalInvestmentProfit`/`_bearMarketWitness`/`_eraState.inflationIndex`。

## 域铁律
- D：引用 NPC 须 `rel&&rel.met`；好感一律 `applyAffinityChange(state,npcId,change,reason)`（位置参数固定，误传顺序静默失效）；显名 getNpcDisplayName。
- C：职业线唯一入口 CAREER_PATHS(ui/career_dev.js)；jobs.js `requiredFlag:"_synergy_<id>"` 须精确匹配 skill_synergy 真实 id（driving_logistics/driving_logistics_accounting，无 driving_accounting）。
- E：持仓写入前 Array.isArray 守卫；除数(avgPrice/prev)须 isFinite+>0；股票 industry 必须在 WORLD_SECTORS。
- G/H：daily_pipeline 无 slot 注册→用包装全局函数接线（如 tickInvestmentDaily 重赋值）；UI 安全区(100dvh/safe-area)勿回退。
- 模糊指令先 grep 确认存在；用户「无关」=停手。

## A类净尽结论（勿重复审）
- 域A R14/R22/R197/R242/R251/R258/R267/R277/R331/R387、域G R20/R192/R197/R199/R296/R311、域H R13/R21/R200/R320、域F R19/R183/R186/R198/R384、域C R191/R271、域E R246/R260/R284 已净尽各自主隐患。
- 死字段黑名单(player.happiness/needs.health/player.health/certs) 全库定期 grep=0 命中即诚实报 A类=0。
- 误报勿修：webapp_runtime_bridge getPlayerHealth 主路径正确；establishMentorship/takeMentee 有平行实现。C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。

## 关键教训（历轮精华）
- CLAUDE.md 是 CRLF——脚本改写须保留换行符否则整文件 diff；并行常持续重写它致无法干净暂存，权威轮号以 loop-state.json + round doc 追踪，不伪造迭代表行。
- Write 新 linkage 前必查编号是否被并行占用（曾误覆盖已提交文件靠 git checkout -- 恢复）。
- build 后若并行又改了某 src 文件→pre-commit 报 dist 陈旧；须再 stash 该文件+重建+快速提交（原子链）beat the race。

## 近况与 recency 基准
- R387 域A：**P0 热修复**（events_core.js rollStreetEvent 缺 `let mod` 声明→每日抛 ReferenceError 全策略100%死亡）+A→B 价格叙事。
- R390 域F（本轮·已 push 1d4a0da2）：A类=0（Explore 18 UI文件确证死字段仅存修复注释、除零/空指针均守卫）+联动3(domain_f_linkage_r390.js：ui_r390_progress_review F→B进度回顾/ui_r390_relations_map F→D关系网问候守rel.met/ui_r390_data_pitch F→H一页看板)。构建 10554.3KB，MC 6×400d EXIT=0·0代码异常。并行在途 modal.js/render_core.js/domain_a/b_linkage_r389 全程 stash 隔离，push 后还原不碰。
- R406 域E（已 push c093b1f0+b103f0a9）：A类=0（Explore 审计7域E文件+5联动文件全干净；setStopLoss 经核有 R195 调用方系 Explore 误报勿修；C类记录 investment.js:3913 渲染循环无||[]但 initInvestment 保证）。联动3(domain_e_linkage_r406.js)：e406_fear_greed_mirror(E→G 首消费 btcFearGreed 极值≥80/≤20+btcHoldings门控)/e406_policy_pulse(E→A 首消费 _propertyPolicyTightness abs≥0.05)/e406_trade_journal_review(E→C 首消费 tradeLog≥8笔·corporate)。构建10730.2KB，MC 6×400d EXIT=0·0代码异常（corporate 16.7% 既有RNG阈值）。并行在途 jobs/carry/trade/trade_intel 全程 stash 隔离无损还原。
- 域E零消费素材已用尽 btcFearGreed/_propertyPolicyTightness/tradeLog；剩余候选：stopLossOrders 触发后叙事(R195 已部分)、investFreq 计数器。
- **recency 基准(R406后)：A=398/B=401/C=399/D=405/E=406/F=403/G=402/H=404 → 下轮 A(398)最薄弱**。开轮必 git log 重算。
