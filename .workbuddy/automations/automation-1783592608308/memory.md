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
