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
