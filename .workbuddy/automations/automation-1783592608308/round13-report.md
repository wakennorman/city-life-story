# Round 13（域 H · Phase2/公司）— 已提交 ✅

**提交**: `1ded2071` · 分支 `loop/auto` · 未 push · 7 文件 / 492 增 / 102 删

## 指令一 · A类缺陷修复 2 项（防御式空值守卫）

均为「对可能为空对象未函数内判空的直接解引用」——`startup.company` 在 `status==="none"` 时为 `null`，若被独立入口调用即抛 TypeError。

| 文件                              | 位置                          | 修复                                                                  |
| --------------------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `src/js/phase2/startup_crisis.js` | `showCrisisModal` (397)       | `const company = state.startup.company;` 后补 `if (!company) return;` |
| `src/js/phase2/startup_crisis.js` | `applyCrisisChoice` (474-475) | `const company = startup.company;` 后补 `if (!company) return;`       |

> 用 `guard_check.py` 对 phase2/* + company_spawner/enterprise_fate/events_corp 共 **18 文件**批量扫描，确认域内其余 `startup.company.X` 直接解引用**均已由上游短路守卫**；此 2 处为「本函数内未判空、依赖调用链上游守卫」的仅存隐患，已补自防御。

## 指令二 · 联动增强 3 项（新建 `src/js/core/company_linkage_events.js`）

IIFE 注入全局 `RANDOM_EVENTS`，全字段 `||` 防御，数值标 `[PLACEHOLDER]`，统一 `phase:"corporate"`（创业子系统在 `corporate` 阶段被创立，`startup.js:89` 要求 `player.phase==="corporate"`），并以 `conditions` 守卫 `st.startup.company` 存在：

| 事件                       | 桥接             | 触发条件                                              | 效果                                                                            |
| -------------------------- | ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------- |
| `startup_friend_support`   | H→D（社交/NPC）  | 公司存续 + 已结识好感≥20 的 NPC + 冷却 flag           | 约挚友倾诉 `safeAffinity`+5·心智+6·心情+4 / 独自硬扛 心智-2                     |
| `startup_wealth_milestone` | H→E（经济/投资） | 估值首破 [PLACEHOLDER]¥100万 + 未触发                 | 划 [PLACEHOLDER]¥5万入投资银行户·置 `_startupInvestorMindset` / 再投回估值×1.05 |
| `startup_career_legacy`    | H→C（职业/成长） | 公司存续 + 职场声誉 `upward`≥[PLACEHOLDER]40 + 未触发 | 前同事人脉拉客户 估值×1.08·`upward`+5 / 独立开拓                                |

## 验证

- `node --check` 2 文件全过 ✅
- `python build.py` 重建 dist（8205.5 KB，已含 3 新事件 + 守卫）✅
- **蒙特卡洛 6×400d：EXIT=0，0 代码异常** ✅（仅 `[trader] 存活率 66.7%` 为既有平衡阈值，非本轮引入；沙箱无网络致离线新闻拉取失败，均非代码异常）

## 提交纪律

- 仅 `git add` 7 个域H文件 + dist + loop状态 + `last_known_head`；**排除**并行窗口进行中改动（`career_path_events.js` / `economy_linkage_events.js` / `family_events.js` / `personal_growth_events.js` / `social_tab.js`）。
- `loop-domain-state.json` 更新为 round 13 / H / **nextDomain=A**；`DEVELOPMENT.md` 补 v3.105 章节。
- `last_known_head` 已同步新 HEAD `1ded2071`（漂移检查通过）。

## 备注：CLAUDE.md 迭代表 R17 行本轮跳过

`CLAUDE.md` 被并行窗口持续重写（单次 diff 达 2081 行），即使「checkout→插入→暂存」原子化仍被覆盖，无法干净暂存仅含 R17 行的版本。本轮**未提交 CLAUDE.md**，权威轮次记录已在 `loop-domain-state.json` + `DEVELOPMENT.md` 中完整保留。建议后续由单一协调窗口统一同步迭代表（避免多 agent 抢写该共享文档）。

## 下轮

**域 A（数据/数值平衡）** — 正常轮换第 5 轮（自动化 R14）。
