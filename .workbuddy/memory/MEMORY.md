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
- **R198 C类记录(不修)**：investment.js:1435 写 `state.needs.health` 死字段(真实 `state.status.health`)——每日经济焦虑静默扣永不渲染的健康值;webapp_runtime_bridge.js:176-188 读写 `state.player.health` 死字段(真实 `state.status.health`),桥接层血量永远与渲染层脱节。财务Tab并行在途+桥接层敏感,留后续 E/H 或桥接层轮次处理(勿在域F轮次碰投资.js)。

## 域F/G/H 要点
- UI 安全区：#app 100dvh / viewport-fit=cover / tab-bar+mobile-hud safe-area padding，勿回退。
- critical.js 延期惩罚阶梯、startup_crisis 危机链均已接线复活（R20/R21）；events_corp `.exp`→`.xp`（全库统一 .xp）。
- daily_pipeline 无通用外部 slot 注册机制（静态数组）；接线新逻辑用包装全局函数模式。

## 模糊指令处理
- 收到模糊 scene/主题指令先 grep 确认真实存在；用户一句「无关」=最高优先级停手信号。
