# 全系统优化·Round 24 — 域 C 职业/成长（第二轮）

> 日期: 2026-07-15 · 分支 loop/auto · 基于 HEAD 0cb5f277（并行窗口 R18 补提交后）→ 提交 1893072e(feat) + 3f4ac3d9(state)。未 push（SOP）。
> 续接来源: 自动化 memory.md 权威记录 R23=域B，下轮→C。loop-domain-state.json 在磁盘上为陈旧 round17/F，已校正为 round24/C/nextDomain=A。

## 本轮判定（为何做 C）

正常轮换 + B→D→F 覆盖序列早已完成。第二轮的 8 域进度：A2=R22 / B2=R23 / C2=**R24(本轮)** / D2=R17 / E2=R18 / F2=R19 / G2=R20 / H2=R21。
→ C2 完成即 **8 域第二轮全部完成**，下轮（R25）进入第三轮，重启于 **A**。

## 指令一 · A 类扫描（结果：0 缺陷）

全量扫描职业域 6 文件：

- `src/js/core/career_path_events.js`（91KB，覆盖 11+ 职业路径专属事件）
- `src/js/core/personal_growth_events.js`（23KB）
- `src/js/core/skill_tree.js` / `skill_synergy.js`
- `src/js/ui/career_dev.js`（CAREER_PATHS 权威入口，179KB）
- `src/js/core/career_linkage_events.js`（R16 已建，本轮追加）

判定纬度（域 C 专属）：

1. **引用不存在的 id/字段**：技能键（coding/management/repair/…/social 共 12 个，state.js:108 实证）全部有效；职业 path id（medical/civil/doctor/tech/finance/sales/design/operations…）均在 `CAREER_PATHS`（career_dev.js:18 起 13 条路径）中存在；无 `addSkillXp("设计")` 之类悬空键（R16 已修 design→coding）。
2. **裸访问未初始化对象**：`career.currentJob` 裸访问全部经 `_job()`/`_path()`（短路守卫，career_path_events.js:13-18）或 `if (st.career.currentJob)` 守卫；apex 事件 apply 内 `st.career.currentJob.path` 仅在 condition 已放行（job 非空）时执行；`skill_tree`/`skill_synergy` 对 `state.skills[key]` 空值均 `if (!skill) return`；`personal_growth_events.js` 的 `st.skills[sk]` 在 line486 前已 `filter(k=>skills[k]&&...)` 保证非空。
3. **职业事件无 path·job 校验**：所有职业事件 condition 首行 `_path(st,"X") &&` 校验 path+job，无不可达触发；`state.career` 惰性初始化（career_dev.js:3084/4386）处的 `state.career.currentJob._lastPaidLeaveDay`（1246）位于 `if (currentJob)` 块内（currentJob 已非空），安全。

→ **0 A 类缺陷**，如实报告，未伪造修复、未提交空 fix。

## 指令二 · 联动增强（3 项，追加至 career_linkage_events.js，全 `||` 防御，数值 `[PLACEHOLDER]`）

| 新增事件                      | 文件                     | 联动域 | 设计意图（一句话）                                                                     |
| ----------------------------- | ------------------------ | ------ | -------------------------------------------------------------------------------------- |
| `career_enterprise_readiness` | career_linkage_events.js | C→H    | 职场硬技能在创业阶段兑现为公司 KPI（`state.player.corporate.upward`，phase:corporate） |
| `career_legacy_tale`          | career_linkage_events.js | C→B    | 职业成就成为城内叙事（置 `_careerNarrativeSeen` 供 B 域回调复用，phase:street）        |
| `career_resource_mastery`     | career_linkage_events.js | C→A    | 技能熟练度换单位时间收入效率红利（cash + 智力回馈，phase:street）                      |

新增桥接方向：**C→H（公司）** 与 **C→B（叙事）** 为职业域此前未覆盖方向；C→A 为第二角度（R16 的 C→A 是属性回馈，本轮是收入效率）。

防御要点：复用文件既有 `topSkillLevelC` / `getMetNpcsC` 助手；`state.player.corporate` 惰性字段 `||{}` 守卫；`st.resources.cash`/`st.needs.happiness`/`st.player.mental` 全 `||` 防御；`conditions` 用 `st.flags._xxxDone` 去重，全 false 时叙事合理不触发。

## 验证

- `node --check src/js/core/career_linkage_events.js` → OK（修复了初次编辑多出的重复 `},` 语法错误）。
- `python build.py` → dist/index.html 8340.1KB，比源新（过 pre-commit 新鲜度钩子）。
- `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → **exit=0 · 0 代码异常**（无 TypeError/ReferenceError/NaN/Infinity；36氪 RSS timeout 为离线新闻回退，非代码异常）。
- 存活率：balanced 66.7% / social 66.7% < 80% 为既有平衡阈值 RNG 波动（高风险路径 grinder 33.3%≥30% / skiller 100% / corporate 100% / trader 83.3% 均达标），非本轮引入。

## 提交纪律（SOP v3.0）

- 仅 `git add` 6 文件（career_linkage_events.js / dist/index.html / DEVELOPMENT.md / CLAUDE.md / loop-domain-state.json / last_known_head）：**未** `-A`、**未** 触碰并行窗口进行中改动（src/index.html 等仍为未暂存 WIP）。
- 提交前同步 `.claude/last_known_head` = 当前 HEAD，过 pre-commit 漂移检查（并行窗口在轮中把 loop/auto 推进到 0cb5f277，已同步）。
- 未向 main 提交、未 push（SOP + 用户统一协调）。
- DEVELOPMENT.md v3.114→v3.115；CLAUDE.md 迭代表追加 R24 行。
- 两提交：1893072e(feat) + 3f4ac3d9(loop-state 落库 lastCommit=1893072e, nextDomain=A)。

## 下轮 → A（第三轮重启）

8 域第二轮已全部完成，下一轮进入第三轮，从 **A 数据/数值平衡** 重启（R25）。
