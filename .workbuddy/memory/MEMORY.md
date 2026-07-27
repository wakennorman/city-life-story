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
- R387 域A：**P0 热修复**（events_core.js rollStreetEvent 缺 `let mod` 声明→每日 ReferenceError 全策略100%死亡）。
- 域E零消费素材已用尽 btcFearGreed/_propertyPolicyTightness/tradeLog；剩余候选：stopLossOrders 触发叙事、investFreq。
- R411 域B（已推 3417ee8e+86c41686）：**A类大修133处** — cross_system_events_part2~8 死字段批量修复（st.player.health.*×109 state无此对象守卫永false→压力系统全链静默失效→st.personalGrowth.health.*；st.needs.health×21→st.status.health；part8数字型×2）+并行域H r410 孤儿挂载抢救。联动3(domain_b_linkage_r410.js·文件名保留r410因挂载行已被并行扫入main)：b410_stress_boilover(B→G 首个stress≥60消费)/b410_bookworm_return(B→C 激活 learning.booksRead 死字段)/b410_confide_pressure(B→D met∩affinity≥30倾诉)。MC 6×400d 0代码异常(91.9s)。构建10779.4KB。
- **personalGrowth 真实结构**：`health.{physical{score},mental{score,stress,anxiety,depression},metabolic}`+`learning{booksRead,courses,certificates}`+`image{style,skincare,fitness,plastic}`。stress→b410_stress_boilover；anxiety→pg_burnout_warning；**image 四维已被 R426 全部首消费**（b426_style_notice/b426_plastic_mirror/b426_gym_invest_chat）。剩余零消费候选：depression 单独阈值叙事。
- **phase2/personal_growth.js 双结构分歧（B类待专轮）**：state.js 默认 health.physical={score} 对象 vs phase2 数字比较恒 false（healthStatus 恒"需要关注"）；pg.psychology(phase2惰性写) 与 health.mental(事件读) 双心理系统不互通。R426 已修其 image NaN（688/1057 加||0）。
- **竞态双向教训(R411)**：并行 `git add -A` 把本窗口在途 index.html 编辑扫入其提交（js 文件在 main 悬空→提交该文件即闭合勿改名）；反之本窗口 stash index.html 卷走并行刚加的挂载行（其 js 成孤儿）。**push 前必双向核对：`git show HEAD:src/index.html | grep <近轮新文件>`**。
- stash@{0}"R411隔离"保留未删：含并行 news.js 旧改动（工作区已有新版冲突未pop；events_core.js 已 checkout 恢复）。并行丢改动可从此找回。
- R426 域B（本窗口）：A类3处/6点（domain_h_linkage_r170/r188 needs.health死字段→status.health，r188触发闸门健康分支此前永false；phase2/personal_growth.js image 缺字段 NaN→||0）。联动3=image四维首消费。工作区 loop-state 在途改动系 R425 正确账本（未随342aacb2提交），本轮一并闭合。
- **recency 基准(R426后)：A=423/B=426/C=424/D=419/E=420/F=421/G=422/H=425 → 下轮 D(419)最薄弱**。开轮必 git log 重算（loop-state 常滞后）。
