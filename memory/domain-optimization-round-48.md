# R48 域F UI/UX 优化记录（2026-07-19）

## 指令一：A类缺陷修复（2处）

| # | 文件 | 缺陷 | 修复 |
|---|------|------|------|
| 1 | `daily_report.js:818` | `generateDailyReportSummary` 中 `state.resources.cash` 裸访问，旧存档/初始化未完成时 `state.resources` 可能 undefined | 改为 `(state.resources && state.resources.cash) || 0` |
| 2 | `daily_report.js:886` | `showDailyReport` 中 `state.resources.cash` 裸访问 | 同上防御 |

## 指令二：联动增强（2项）

| # | 文件 | 新增内容 | 联动域 | 设计意图 |
|---|------|----------|--------|----------|
| 1 | `render_core.js:renderWeatherPanel` | 极温预警（>35°C🔥/ <-5°C❄️） | F→G（天气→核心机制） | 温度极端时显示红色/蓝色预警标签，配合已有 isExtremeWeather |
| 2 | `social_tab.js:renderSocialOverviewTab` | 可拜访NPC计数（冷却结束可互动人数） | F→D（UI→NPC社交） | 显示"已结识X人·可拜访Y人"，引导玩家主动社交 |

## 设计心理学
- 极温预警：损失厌恶（极端温度→健康风险暗示）
- 可拜访NPC计数：禀赋效应（已结识NPC=社交资产）+ 行动召唤（冷却结束→快去拜访）

## 验证
- `node --check` ✅ daily_report.js / render_core.js / social_tab.js
- `python build.py` ✅ 8448.3 KB
- `git push` ✅ main → 790a7039
