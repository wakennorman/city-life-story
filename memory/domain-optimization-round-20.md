---
name: domain-optimization-round-20
description: "R20: 全系统优化 域B(事件/叙事) — 1项A类+1项B类修复+2项联动增强（季节初体验/失业空窗期）"
metadata:
  type: project
---

# R20 (parent loop) — 域B 事件/叙事（2026-07-15）

## 指令一：A类+ B类缺陷修复

### A类修复（1项）

| 文件 | 事件 | 缺陷 | 修复 |
|------|------|------|------|
| lifecycle_linkage_events.js | life_estate_planning | "划拨一笔做公益捐赠"choice 描述捐钱但 apply 未扣现金 | 加入 `donation = min(¥20k, 现金15%)` 动态扣款 |

### B类修复（1项）

| 文件 | 事件 | 缺陷 | 修复 |
|------|------|------|------|
| events_street_wealth.js | subsidy_war_crash | choice 文本"需¥500"但实际 cost=200 | 文本修正为"需¥200" |

## 指令二：联动增强（2项）

| 新增事件 | 文件 | 联动域 | 设计意图 |
|----------|------|--------|----------|
| season_first_weather_echo | lifecycle_linkage_events.js | G→B | 季节初体验·峰终定律：首雪/首雨/首高温等季节特征天气首次出现时触发叙事回响，情绪+4，心智+2 |
| jobless_identity_moment | lifecycle_linkage_events.js | G→C | 失业空窗期·损失厌恶：曾有工作后首次失业时触发身份重构叙事，按存款分三档不同叙事，心情-3，心智+2~5 |

## 修复心理学依据

- **season_first_weather_echo**：峰终定律 — 第一次总是最深刻
- **jobless_identity_moment**：损失厌恶 — 失去工作不仅是收入归零，更是社会坐标的迷失

## 验证

- [x] node --check: 全部通过
- [x] python build.py: 8444.2 KB
- [x] git commit (子模块 7278a344 + 父仓库)
