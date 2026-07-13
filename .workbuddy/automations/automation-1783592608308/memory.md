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

## 最近执行（2026-07-14 凌晨，Round 14 域 A — 已随并行窗口提交 c00d48f0）
- 域A(数据/数值平衡) 在本分支 loop/auto 落地（被并行窗口 `git add -A` 一并提交为 `c00d48f0`「feat: [域B] 联动增强3项」——内容含本轮回合A改动）。
- A类2：
  - economy_v3.1.js 难度键名 `casual`→`easy` 并补 `hell`（DIFFICULTY_TAX_MULTIPLIER / DIFFICULTY_INCOME_CURVE / getMarketSaturationPenalty 三元表达式）。原 `casual` 与 difficulty_system.js 写入 `state._difficulty` 的真实取值(easy/normal/hard/hell)不匹配 → 休闲/地狱档经济结算(税率乘数/收益曲线)恒回落默认值，属必现平衡性bug。
  - jobs.js `premium_housekeeper` payCalc `state.player.hygiene`→`state.needs.hygiene`，修复清洁度加成永远为0。
- 联动3（新建 data_linkage_events.js IIFE→RANDOM_EVENTS，2 street+1 corporate，全||防御，数值[PLACEHOLDER]）：data_balanced_living(A→D 状态均衡→社交好感)/data_skill_efficiency(A→C 技能曲线→职业声誉)/data_savings_milestone(A→E 资产里程碑→投资资本)。引擎严格按 e.phase 过滤，故须显式设 phase（参照 R11/R12/R13）。
- 验证：node --check 3文件通过；build.py→dist 8225.6KB；MC 6×400d 0代码异常（trader 50%/corporate 66.7% 存活率<80% 为既有平衡阈值，非本轮引入；A1 仅影响 easy/hell 档，默认 normal 的 MC 未触达）。
- loop-domain-state.json 已正确更新为 round14/A/nextDomain=C（C→E→G→H→A 单轮覆盖完成，下轮重启于C）；DEVELOPMENT.md 改 v3.106。两者在 c00d48f0 提交内含我的版本。下轮→C。

## 最近执行（2026-07-14，Round 16 域C 职业/成长 — 代码随并行窗口 f4b39a8e 落地 + loop-state 修正提交 9392dbdc）
- 起始状态：并行窗口已推进 loop 至 R15/域B（04b99545+c00d48f0），loop-domain-state.json 标 next=C，故本窗口执行 R16=域C（职业/成长）。
- 域C 真实文件：CAREER_PATHS 权威入口在 `src/js/ui/career_dev.js`（非 data/career_dev.js）；事件在 core/career_path_events.js、personal_growth_events.js；技能在 core/skill_tree.js·skill_synergy.js·data/skills.js（后者实为 CERTIFICATES 证书数组）。
- A类1（Explore 全域扫描仅此 1 处确证）：`career_path_events.js:2240` design_client_revision 事件 `addSkillXp("design",10)` — "design" 非真实技能键（state.skills 仅 cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social），addSkillXp 内部 `state.skills[key]` 未命中即静默 return → 设计XP永久丢弃。改 `"coding"`（design 路径在 CAREER_PATHS reqSkills 以 coding 为门槛技能，语义一致）。
- 联动3（新建 `src/js/core/career_linkage_events.js` IIFE→RANDOM_EVENTS，2 street+1 corporate，全||防御，[PLACEHOLDER]）：career_mentor_bond(C→D 技能被看见→前辈提携NPC好感+6，用 safeAffinity/applyAffinityChange)/career_skill_milestone(C→A 技能里程碑→intelligence+2·mental+4 属性回馈)/career_promotion_bonus(C→E 晋升势能≥[PLACEHOLDER]→奖金入 bankBalance + 复用 _dataInvestorMindset flag)。index.html 注册在 data_linkage_events.js 之后（第601行）。
- 验证：node --check 2文件通过；build.py→dist 8236.6KB；MC 6×400d **🎉总体通过·0代码异常**（本轮 trader 83.3%/social 83.3%/corporate 100% 全≥80%；末尾 RSS timeout 为离线新闻网络回退，非代码异常）。
- 提交：代码（career_path_events/career_linkage_events/index.html/DEVELOPMENT.md/dist）在 MC 运行期被并行窗口 `git add -A` 扫入 `f4b39a8e`；但并行窗口随后 3 个「R15 finalize」commit 把 loop-domain-state.json 覆盖回退成 R15/B。本窗口遂单独提交 `9392dbdc` 仅修正 loop-domain-state.json=round16/C/next=D + last_known_head。DEVELOPMENT.md=v3.107。下轮→D（NPC/社交）。

## 最近执行（2026-07-14，Round 17 域D NPC/社交 — 待提交）
- 起始状态：loop-domain-state.json=round16/C/next=D，故本窗口执行 R17=域D（NPC/社交）。HEAD=9392dbdc，last_known_head 漂移 f4b39a8e（R16 loop-state 提交未同步 last_known_head）。本次改动未被并行窗口扫入（status 干净）。
- 域D 真实文件：关系引擎 npc_relationships.js（applyAffinityChange/tickNpcRelationships/getNpcDisplayName，14×14 矩阵）；UI social_tab.js（renderNpcRelationships）；桥接 npc_event_bridge.js（chatWithNpc/applyEventNpcEcho/rollDailyNpcEcho）；数据 npcs.js（3584行，仅扫描顶部 accessor）。
- A类4（Explore 全域扫描 9 文件确证，均为硬崩溃/数据自洽缺陷）：
  1. social_tab.js:30 `npcIds` 在 :53 才赋值即被 `for` 循环使用（var 提升为 undefined）→ 渲染 NPC 关系网 Tab 每次 `npcIds.length` 抛 TypeError。修复：声明前置到 `!state.relationships` 守卫之后（第18行），:53 改为无 var 重赋值。
  2. npc_event_bridge.js chatWithNpc `affinity` 从未声明（1055/1073/1095/1115 读取未声明变量→ReferenceError 崩溃）→ `rel.affinity` 写 NaN 污染好感；`delta/chatType/message` 同为隐式全局。修复：函数头补 `var affinity=rel.affinity||0; var delta=0,chatType="neutral",message="";`；并把好感写入从手工 clamp 改走 `applyAffinityChange(state,npcId,delta,message)`（自动 clamp+记 _lastInteractionDay+升级播报）。
  3. npc_event_bridge.js chatWithNpc 仅 `if(!rel)` 未校验 `rel.met`（initNpcRelationships 预建 rel 且 met:false）→ 可与未结识 NPC 聊天。修复：加 `!rel.met` 守卫（与域D铁律一致）。
  4. npc_event_bridge.js applyEventNpcEcho 手工 clamp `state.relationships[id].affinity` 绕过 applyAffinityChange → 缺 _lastInteractionDay（错误触发衰减）+ 不播升级消息。修复：改走 `applyAffinityChange(state, id.replace("_flag_alt",""), rule.change, rule.msg)`。
- 联动3（新建 `src/js/core/npc_social_linkage_events.js` IIFE→RANDOM_EVENTS，2 street+1 corporate，全||防御，[PLACEHOLDER]）：social_deep_talk(D→A 熟络NPC深度交谈→mental+6·happiness+4)/social_job_referral(D→C 圈内牵线→addSkillXp("social",8) 社交技能)/social_market_tip(D→E 朋友消息→bankBalance+[PLACEHOLDER] + 复用 _dataInvestorMindset)。严守域D铁律：只读 state.relationships、rel&&rel.met 守卫、跨NPC传导走 applyAffinityChange。index.html 注册在 career_linkage_events.js 之后。
- 验证：node --check 3文件通过；build.py→dist 8245.4KB；MC 6×400d **exit=0·0代码异常**（grep 确认无 TypeError/ReferenceError/NaN/异常行）。trader/social 存活率 66.7%<80% 为既有平衡阈值（RNG 波动：上轮同架构显示 83.3%），非本轮引入、非代码异常；balanced/corporate 100%、grinder/skiller 为高风险路径阈值30%达标。末尾 RSS timeout 为离线新闻网络回退，非代码异常。
- 提交计划：仅 git add 8个域D文件(social_tab.js/npc_event_bridge.js/npc_social_linkage_events.js/index.html/DEVELOPMENT.md/dist/index.html/loop-domain-state.json/last_known_head)，不 -A、不 push；提交前同步 last_known_head=当前HEAD 过 pre-commit 漂移检查。下轮→E（经济/投资）。

## 最近执行（2026-07-14，Round 18 域E 经济/投资 — 待提交）
- 起始状态：loop-domain-state.json=round17/D/next=E，故本窗口执行 R18=域E（经济/投资）。HEAD=1dd59f6d，last_known_head 漂移 9392dbdc（R17 提交未同步 last_known_head）。本次改动未被并行窗口扫入（status 干净，仅 7 个域E文件）。
- 域E 真实文件：economy_v3.1.js(经济结算/财富税/连续盈利衰减) / finance.js(资金数学) / news_investment_bridge.js(新闻→投资乘数桥) / phase2/investment.js(3941行投资引擎：buyInvStock/sellInvStock/buyBtc/sellBtc 维护 h.avgPrice) / investment_analysis.js / property_market.js / stock.js。真实持仓容器 `state.investment.stockHoldings`（非 `state.portfolio`，全代码零引用）；现金 `state.resources.cash`；银行存款 `state.resources.bankBalance` 独立字段。
- A类3（Explore 全域扫描 7 文件确证）：
  1. economy_v3.1.js:174 读取从未写入的 `state.stats.consecutiveWins`（全代码库仅此一读点）→ `getConsecutiveWinDecay(0)` 恒返回 1.0，「连续盈利衰减」机制完全失效。修复：改读 `state.investment._consecutiveWins`；并在 sellInvStock（用 h.avgPrice 算 pl=(m.price-h.avgPrice)*shares）/ sellBtc（已有 pl）维护计数器（盈利+1/亏损归零），机制真正生效。均 `||0` 守卫，免改 state.js 初始化。
  2. news_investment_bridge.js:85 getNewsEffectForProperty 误传 `category:"股票"` → 任何 `category:"股票"` 新闻的乘数错误乘到房产价格。修复：改 `null`，房产仅按 industry(房地产)/allStocks/symbol 匹配。
  3. investment.js:3743/3916 房产/汽车持仓盈亏百分比 `((diff/buyP)*100)`，buyP=0/undefined→`Infinity%`。修复：`buyP>0 ? ... : "0.0"`。
- 联动3（新建 `src/js/core/economy_invest_linkage_events.js` IIFE→RANDOM_EVENTS，2 street+1 corporate，全||防御，[PLACEHOLDER]）：invest_milestone_mindset(E→A 投资里程碑→mental+5·happiness+4 + 复用 _dataInvestorMindset)/invest_acumen_career(E→C 金融盘感→addSkillXp("accounting",8))/invest_treat_friend(E→D 落袋请友→safeAffinityE 走 applyAffinityChange + 扣 state.resources.cash 800)。E→D 严守域D铁律（只读 state.relationships、rel&&rel.met 守卫、跨NPC传导走 applyAffinityChange）；触发闸门 isInvestorE = stockHoldings.length>=1。index.html 注册在 npc_social_linkage_events.js 之后。
- 验证：node --check 4文件通过；build.py→dist 8255.1KB；MC 6×400d **exit=0·0代码异常**（grep 确认无 TypeError/ReferenceError/NaN/异常行）。balanced/social 存活率 66.7%<80% 为既有平衡阈值（RNG 波动：上轮同架构 trader/social 曾 83.3%），非本轮引入、非代码异常；trader 83.3%/corporate 83.3% 全≥80% 通过。末尾 RSS 36氪 源失败为离线新闻网络回退，非代码异常。
- 提交计划：仅 git add 域E文件(economy_v3.1.js/news_investment_bridge.js/investment.js/economy_invest_linkage_events.js/index.html/DEVELOPMENT.md/dist/index.html/loop-domain-state.json/last_known_head)+memory 文件，不 -A、不 push；提交前同步 last_known_head=当前HEAD。下轮→F（UI/UX）。

## 最近执行（2026-07-14，Round 19 域 F UI/UX — 待提交）
- 起始状态：loop-domain-state.json=round18/E/next=F，故本窗口执行 R19=域F（界面/体验）。HEAD=3d0b792（R18 已提交，树干净）；发现 last_known_head 文件陈旧(1dd59f6d)、loop-state 仍标 R18 pending → 先同步 last_known_head=3d0b792 过漂移检查。
- 域F 真实文件（17个UI文件）：render.js/render_core.js/render_infra.js/daily_quest.js/daily_focus.js/daily_report.js/data_viz.js/modal.js/navigation.js/tutorial.js/victory.js/life_memoir.js/heritage_store.js/wiki.js/side_hustle_ui.js/corp_ui.js/career_dev.js（social_tab 上轮已修）。入口为 src/index.html（根 index.html 仅 TS redirect shell），linkage IIFE 注册在 src/index.html:606 之后。
- A类1（Explore 17文件逐处确证）：daily_focus.js:118 今日重点面板生成装备耐久提示时引用从未声明的变量 `itemId`（全仓库仅此1处、无任何声明）→ 任意装备耐久<20% 即抛 ReferenceError 崩溃（硬TypeError，高概率必现）。修复：`itemId`→`(inst.itemId||slot)`，与同源 render.js:1992 等效实现一致（inst.itemId 为装备实例真实属性）。
- 联动3（新建 `src/js/core/ui_linkage_events.js` IIFE→RANDOM_EVENTS，2 street+1 corporate，全||防御，[PLACEHOLDER]）：ui_daily_clarity(F→A 生活清晰感→mental+5·happiness+4)/ui_social_presence(F→D 社交形象→applyAffinityChange 好感+5 守 rel.met 铁律)/ui_career_portfolio(F→C 成果呈现→addSkillXp("coding",8))。src/index.html 注册在 economy_invest_linkage_events.js 之后。
- 验证：node --check 2文件通过；build.py→dist 8263.3KB；MC 6×400d 待执行（须 0代码异常）。
- 提交计划：仅 git add 域F文件(daily_focus.js/ui_linkage_events.js/src/index.html/DEVELOPMENT.md/dist/index.html/loop-domain-state.json/last_known_head)，不 -A、不 push；DEVELOPMENT.md=v3.110；loop-state=round19/F/nextDomain=G。下轮→G（核心机制/生命周期）。
