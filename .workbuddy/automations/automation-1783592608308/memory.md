# 日常开发循环 — 执行记忆

> 自动任务：加强多方关联度 / 补充不足 / 删除冗余（v3.1 审查改进框架）
> 分支策略：每轮 `git checkout -B loop/auto`（基于当前 HEAD），只 `git add` 本轮改动文件，绝不 `-A`/绝不 push。
> 安全：提交前同步 `.claude/last_known_head` = `git rev-parse HEAD`；20 关键事件 id 每次改完 cross_system_events.js 后 grep 校验。

## 最近执行（2026-07-09 23:55）

- **提交**: `bb03721b`（loop/auto）
- **本轮产出**:
  1. 自洽审计 424 事件 → A类 0 / B类 0 / C类 id重复 1→0
  2. 修复 `cold_snap_housing_crisis` id 冲突：第二处重命名为 `cold_weather_shelter_tier`（独立 flag `_coldWeatherShelterSeen`）
  3. 新增 3 联动事件：`moral_extreme_crossroads`(极端道德分叉) / `weld_sales_contract`(焊接+销售双技能) / `npc_deep_affinity_legacy`(NPC深度好感)
  4. GDD 累计 41→44，补 3 条目
- **20 关键事件 id**: 全部存在且唯一 ✓
- **注意**: 并行窗口（loop R27, commit `decbccba`）已含相同 id 修复+3 事件，本次对 cross_system_events.js 实质 no-op，仅净增 GDD + 同步 last_known_head。端态正确。

## 已知事实（写条件前已核 state.js）

- `skills` 无 `writing`；有 cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding
- `reputation` 按地点 key 存（如 `reputation.commercialDist` / `.slum` / `.bank` / `.wholesaleMarket`），事件内需 `if (!st.reputation) return false` 守卫
- `_habits` 含 lowHungerStreak / lowHygieneStreak / highFatigueStreak / junkFoodMeals / stomach_inflammationCount / lateNightActions（累积状态字段均被每日管线维护）
- `xiaoli` / `auntie_lin` / `master_zhao` 在 npcs.js 仍是 TODO → 新 NPC 事件用通用 `st.relationships[nid].affinity` 遍历，避免依赖未实现 NPC
- `weather.current` 合法值含：sunny/rainy/stormy/snowy/plum_rain/cold_snap/heatwave/foggy 等（cold_snap 是真实天气 id）

## 审计脚本

- 路径: `.workbuddy/automations/automation-1783592608308/ascan.py`
- 用法: `python .workbuddy/automations/automation-1783592608308/ascan.py`
- 输出: 各文件事件数 / B类(单数trigger) / A类候选(职业/天气/NPC无守卫) / C类(跨文件id重复)

## 待续空白区（下一轮可选）

- 更多双技能：welding+sales 已做；可加 electrician+management(工程队) / cooking+accounting(餐饮核算)
- `xiaoli`/`auntie_lin`/`master_zhao` 激活后的深度好感事件
- 行动频次「老手特遇」（需先确认 `actionFreq` 的具体 actionId 枚举，避免死事件）
- 时代变迁联动（era_transform）可再扩充微观抉择

## 最近执行（2026-07-10 23:55）

- **提交**: `9a8d0915`（loop/auto，基于 HEAD `582c9af8`）
- **本轮产出**:
  1. 自洽审计 812 事件（events_core 0 + cross_system 600 + street_life 57 + street_survival 59 + street_wealth 61 + career 35）→ A类 0 / B类（单数trigger）0 / C类（跨文件id重复）0。如实报告，无编造修复。
  2. 新增 3 联动事件（写条件前均先核 state.js 字段真实存在）：
     - `habit_stomach_breakout`（累积状态爆发：flags._habits.stomach_inflammationCount≥3，首个消费该累积字段的事件）
     - `elec_mgmt_contract`（双技能协同 electrician≥20 ∩ management≥15 → 街道改造工程承包）
     - `weather_heatwave_market`（天气×地点×声望：weather.current==="heatwave" ∩ reputation.wholesaleMarket≥30）
  3. GDD 累计 387→390，补 3 条目（#388/#389/#390）
  4. node --check 通过；python build.py 重建 dist/index.html（被 pre-commit 钩子一并纳入提交）
- **20 关键事件 id**: 全部存在且唯一 ✓
- **附注**: 工作区 main 有并行窗口未提交改动（dist/index.html / world_news_intro.js / cross_system_events.js 16行 / last_known_head）。本轮仅 `git add` 自身文件（cross_system_events.js + linkage-events-gdd.md + 钩子带入的 dist），未触碰 world_news_intro.js，未 push。last_known_head 已同步为本轮 HEAD `582c9af8` 以过 pre-commit 漂移检查。

## 已知事实补充（写条件前已核 state.js / 既有事件）

- `health` 真实路径为 `st.status.health`（非 `st.player.health`）；`hunger`→`st.needs.hunger`；`happiness`→`st.needs.happiness`；`fame`/`mental`/`morality`→`st.player.*`
- `_habits` 位于 `st.flags._habits`，含 lowHungerStreak/lowHygieneStreak/highFatigueStreak/junkFoodMeals/stomach_inflammationCount/lateNightActions（每日管线维护）
- `stomach_inflammationCount` 此前无任何事件消费，本轮 `habit_stomach_breakout` 为首个消费者
- 双技能矩阵已覆盖：welding+sales / cooking+sales / accounting+sales / electrician+management；仍空白：electrician+trade、cooking+accounting、driving+management

## 最近执行（2026-07-12 00:58）

- **提交**: `c25a8cb0`（loop/auto，基于 HEAD `3dd164e`）
- **本轮产出**:
  1. 自洽审计 880 事件（events_core 0 + cross_system 668 + street_life 57 + street_survival 59 + street_wealth 61 + career 35）→ A类 0 / B类（单数trigger）0 / C类（跨文件id重复）0。如实报告，无编造修复。
  2. 新增 3 联动事件（写条件前均先核 state.js 字段真实存在）：
     - `cook_account_consult`（双技能协同 cooking≥20 ∩ accounting≥15 → 餐饮核算掌勺+对账）
     - `drive_mgmt_fleet`（双技能协同 driving≥20 ∩ management≥15 → 车队调度开车+排班）
     - `pro_view_electrician`（技能门槛专业视角 electrician≥30 → 一眼看穿电路隐患内行叙事）
  3. GDD 累计 394→397，补 3 条目（#395/#396/#397）
  4. node --check 通过；python build.py 重建 dist/index.html（钩子一并纳入提交）
- **20 关键事件 id**: 全部存在且唯一 ✓
- **附注**: 仅 `git add` 本轮 4 文件（cross_system_events.js + linkage-events-gdd.md + dist/index.html + last_known_head），未触碰其他文件、未 push。last_known_head 已同步为本轮父 HEAD `3dd164e` 以过 pre-commit 漂移检查。

## 已知事实补充（写条件前已核 state.js / 既有事件）

- 双技能矩阵已覆盖：welding+sales / cooking+sales / accounting+sales / electrician+management / cooking+accounting / driving+management；仍空白：electrician+trade（供电合同）
- 技能门槛专业视角已做：electrician≥30（pro_view_electrician）；可补：repair≥35 / coding≥40 / welding≥35 等内行视角
- `reputation` 确认为顶层按地点 key 对象（commercialDist/bank/wholesaleMarket…）；`resources` 含 cash/totalEarned

## 待续空白区（下一轮可选）

- 更多双技能：electrician+trade（供电合同，空白）
- 技能门槛专业视角：repair≥35 / coding≥40 / welding≥35 的内行视角叙事（electrician 已做）
- xiaoli/auntie_lin/master_zhao 激活后的深度好感事件（npcs.js 仍为 TODO，暂用通用 relationships 遍历）
- 行动频次「老手特遇」（需先确认 actionFreq 的具体 actionId 枚举，避免死事件）
- 时代变迁联动（era_transform）可再扩充微观抉择

## 最近执行（2026-07-14，域 F UI/UX，B→D→F 覆盖第3轮·最后一轮）

- **分支**: loop/auto @ 父 89295378(并行窗口R15 B域) → `d9381e65`(feat 修复4+增强2) + `d3bfc4b5`(docs R13迭代表+loop状态)。未 push（SOP）。
- **A类4**: viewport-fit=cover 解锁安全区 / #app 100vh→100dvh 地址栏遮挡 / #tab-bar+#mobile-hud 刘海安全区 / .world-news-panel 底部Home指示条安全区（移动端不可达/截断）。
- **增强2(F→D)**: 社交Tab关系网圈子归属感概览(已结识/熟络/平均好感+激活态)+激活进度引导(再熟络N位)，桥接R8 D域机制，全守卫。
- **验证**: build 8166.0KB；MC 6×400d 0异常（社交存活率66.7%为既有平衡阈值非本轮引入）。
- **覆盖序列完成** → nextDomain=**C**，恢复轮换 C→E→G→H→A。CLAUDE.md 用 R13（R9 已被并行窗口占用）。

## 最近执行（2026-07-14，Round 8 域 D，覆盖指令 B→D→F 第2轮）

- **分支**: loop/auto @ 父 a61c9c28 → `e2e86e47`(feat 修复2+增强3) + `300d859c`(docs 迭代表+状态)。未 push（SOP）。
- **A类2**: checkNpcRelationEventTriggers 死代码（关系事件链无消费者→永不触发）接入 tick；NPC 消息原始 id→getNpcDisplayName 中文名。
- **增强3**: triangular_choice 阵营张力 / old_friend_reaction 圈子效应（跨NPC双向好感传导）/ 圈子归属感（D→G）。
- **验证**: build 8144.0KB；MC 6×400d all pass 0异常。核心事件 id 未受影响（未改事件文件）。
- **下轮**: 域 F（UI/UX），覆盖第3轮。候选：接入死代码 getNpcRelationshipNetwork 到社交Tab。

## 历史执行（2026-07-12，Round 7 域 B，覆盖指令 B→D→F 第1轮）

- **分支**: loop/auto @ d8030a29 → 提交 `adcfaad1`(feat) + `227a6ef8`(docs 迭代表)
- **A 类扫描**: 0 缺陷（全量扫描 moral_events.js / news.js / events_core.js）。5 个 condition 全守卫；followUpId 为动态生成非缺失；relationships/weather 访问均防御；`s.trade` 恒初始化。
- **联动增强 3 项**（均 `||` 防御）:
  1. `moral_elder_assist`（MORAL_EVENTS，B→D/C）：帮老人→建立 `relationships.elderNeighbor{met,affinity}`，配套 `MORAL_CONSEQUENCES.moral_elder_helped` 延迟 +置 `flags._elderJobLead`（兼职线索 flag）。
  2. `scrap_price_surge`（NEWS_EVENTS，B→A/E）：`priceMod:{scrap_metal:1.6,scrap_plastic:1.4}` + `investmentEffect` 贵金属/COPPER/ALUM + followUp。
  3. `night_market_revival`（NEWS_EVENTS，B→C/E）：`jobMultiplier:1.25` + 消费股 + seasons 限定。
- **关键事实（已写入 MEMORY.md / domain-optimization-round-7.md）**:
  - 覆盖指令描述的「events.js + {cond,apply} 三文件模型」已过期；真实为三套子系统（MORAL_EVENTS 声明式 / NEWS_EVENTS 声明式 / events_core RANDOM_EVENTS 引擎），注入须用真实格式。
  - `subsidy` 经 `git show c87666ce` 核实为**故意去重**（注释指向 training_subsidy），按设计缺失，**不还原**。32 锚定 id 中 31 存活、subsidy 缺失即正确。
- **MC 验证**: `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` 完成，**0 异常**（完整 10×500d 因 harness 内存上限 OOM，非本代码问题）。[balanced] 存活率 66.7%<80% 为既有平衡阈值，非本轮引入。
- **下一轮**: 域 D（NPC/社交），B→D→F 第 2 轮。

## 最近执行（2026-07-14 凌晨，Round 12 域 G — 已提交 b4fe5180）
- 域G 在本分支 loop/auto 正式落地并提交 `b4fe5180`（11文件/622增/29删，未push）。此前深夜轮因并行窗口并发竞态未提交、仅验证+解除漂移；本轮树稳定后重新实现并提交。
- A类4（MC 0异常）：events_core stats.health→status.health×3 / life_ribbon illness→illnesses / world_params enterprise→startup / tutorial illness→illnesses。
- 联动3（lifecycle_linkage_events.js IIFE→RANDOM_EVENTS）：life_city_anniversary(G→D)/life_work_anniversary(G→C)/life_estate_planning(G→E)，全||防御，数值[PLACEHOLDER]。
- 提交纪律：仅 git add 11个域G文件+dist+loop-domain-state.json+last_known_head；排除并行窗口进行中改动(career_path_events/economy_linkage_events/social_tab/personal_growth_events)。CLAUDE.md 补 R16 行；loop-domain-state 更新 round12/G/nextDomain=H。last_known_head 同步新HEAD=b4fe5180。
- 下轮：域H(Phase2/公司)，正常轮换第4轮(自动化R13)。

## 最近执行（2026-07-14 凌晨，Round 13 域 H — 已提交 1ded2071）
- 域H(Phase2/公司) 在本分支 loop/auto 正式落地并提交 `1ded2071`（7文件/492增/102删，未push）。
- A类2（防御式空值守卫）：startup_crisis.js showCrisisModal(397)/applyCrisisChoice(474) 对可能为null的 startup.company 补 if(!company)return。批量扫描(guard_check.py 对 phase2/* + company_spawner/enterprise_fate/events_corp 共18文件)确认域内其余 startup.company 解引用均有上游短路守卫，此2处为仅存隐患。
- 联动3（新建 company_linkage_events.js IIFE→RANDOM_EVENTS，phase:"corporate"因创业在corporate阶段创立，全||防御，数值[PLACEHOLDER]）：startup_friend_support(H→D)/startup_wealth_milestone(H→E)/startup_career_legacy(H→C)。
- 关键发现：state.player.corporate.upward(默认||50) 是真实懒惰字段(多事件共用)，非 upwardMgmt；state.player.day 是引擎 minDay 读取的规范日字段。
- 提交流程严格遵守SOP：仅 git add 7个域H文件+dist+loop状态+last_known_head；排除并行窗口进行中改动(career_path_events/economy_linkage_events/family_events/personal_growth_events/social_tab)。CLAUDE.md 迭代表 R17 行因并行窗口持续重写该文件(2081行差异)无法干净暂存，本轮跳过(权威轮次记录已在 loop-domain-state.json + DEVELOPMENT.md)。下轮→A。
