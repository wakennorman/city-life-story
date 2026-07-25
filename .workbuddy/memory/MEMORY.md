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
- 域A R14/R22/R197/R242/R251、域G R20/R192/R197/R199、域H R13/R21/R200、域F R19/R183/R186/R198 已净尽主隐患。
- 已知误报勿修：webapp_runtime_bridge getPlayerHealth（主路径正确）；establishMentorship/takeMentee 有平行实现。
- 既有 C类不修：items.js skillStudy 无应用器；finance.js hasStreetStall flag 无 writer。

## 近况（R260-R268）
- R260 域E：stock.js renderStockCard 双除0守卫 + e260_*（消费 _bearMarketWitness/_consecutiveWins）。
- 并行窗口已推进 R261-R268：R263(F)/R264(G)/R265(H)/R266(B)/R267(A)/R268(D)；C 最后一轮为 R252 → R269=域C。
