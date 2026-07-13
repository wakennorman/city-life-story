# Round 12 域 G（核心机制/生命周期）— 已提交 ✅

**提交**: `b4fe5180`（loop/auto，未 push） · 11 文件 · 622 增 / 29 删
**验证**: `node --check` 5 文件全过 · `python build.py` → dist 8196.0 KB · MC 6×400d **EXIT=0 / 0 代码异常**

---

## 指令一：A类缺陷修复 4 项（写错字段名致功能永假）

| # | 文件 | 修复 | 原后果 |
|---|------|------|--------|
| 1 | `events_core.js` (×3, 行624/653/655) | `state.stats.health` → `state.status.health` | 事件难度健康惩罚 `_preEvtHealth` 恒0 → `dHealth=NaN` → `NaN<0` 永假，**负向健康惩罚从未生效** |
| 2 | `life_ribbon.js` (160) | `status.illness` → `status.illnesses` | 「病困交加」缎带患病≥3 分支**永假** |
| 3 | `world_params.js` (556-560) | `state.enterprise` → `state.startup` | CEO 公司行业热度计算**永不触发** |
| 4 | `tutorial.js` (1063) | `status.illness` → `status.illnesses` | 首病提示**永不触发** |

## 指令二：联动增强 3 项（新建 `lifecycle_linkage_events.js`，IIFE 注入 `RANDOM_EVENTS`）

全字段 `||` 防御，数值标 `[PLACEHOLDER]`，`safeAffinity` 优先 `applyAffinityChange` 回退自建 relationships 条目。

| 事件 | 桥接 | 触发条件 | 抉择效果 |
|------|------|----------|----------|
| `life_city_anniversary` | G→D | 每满一整年 + 已结识 NPC | 约熟人(好感+6/心情+8) / 独处(心智+5) |
| `life_work_anniversary` | G→C | 职场期每满一入职年 | 组局(职场声誉upward+5/心情+6) / 复盘(心智+8) |
| `life_estate_planning` | G→E | 年龄≥40 & 资产≥¥50万 | 立继承安排(标记 family._estatePlanned) / 公益捐赠(道德+5/心智+3) |

## 提交纪律（SOP v3.0）
- ✅ 仅 `git add` 11 个域G 文件 + `dist/index.html` + `loop-domain-state.json` + `last_known_head`
- ✅ 排除并行窗口进行中改动：`career_path_events.js` / `economy_linkage_events.js` / `social_tab.js` / `personal_growth_events.js`
- ✅ `last_known_head` 同步新 HEAD `b4fe5180`（漂移检查通过）
- ✅ 未 push（仅 loop/auto）
- ✅ `CLAUDE.md` 迭代表补 R16 行；`loop-domain-state.json` → round 12 / G / nextDomain=**H**

## 下轮
域 **H（Phase2/公司）** — 正常轮换第 4 轮（本轮自动化 R13）。
