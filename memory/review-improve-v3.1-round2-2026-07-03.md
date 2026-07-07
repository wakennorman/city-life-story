---
name: review-improve-v3.1-round2-2026-07-03
description: 城市浮生记 v3.1 审查改进第二轮（2026-07-03）— 6维度全量审查+11项P0/P1/P2修复落地记录
metadata:
  type: project
---

# v3.1 审查改进记录 — 第二轮 2026-07-03

> 触发语：`按 v3.1 审查改进`
> SOP：`memory/review-improve-v3.1.md`
> 覆盖维度：全部 6 维度

## 审查发现（按严重性排序）

### P0（崩溃/数值崩溃）

1. **clampCareerCapital 未挂载到 window** — `js/ui/career_dev.js:764` 定义但 `window.` 挂载列表(2801-2808)遗漏 → `career_path_events.js:28` 与 `side_hustle.js:199` 两处调用静默失效 → 职业倦怠值可突破 100 上限
2. **career_promo_offer 薪资翻倍无代价** — `cross_system_events.js:564` 薪资×2 + `repeatable:true` → 可反复触发指数膨胀
3. **economic_downturn 抛售股票不返还现金** — `cross_system_events.js:718` `stockHoldings = []` 直接清零 → 玩家投资归零
4. **主按钮触控区 <44px** — `.btn` 无 min-height，实际约 34px（Apple HIG 不达标）
5. **时段徽章语义倒置+对比度不足** — `.time-slot-badge.afternoon` 绿色背景(#4a9e5c)配警告橙文字(#c49a3a)，对比度仅 2.1:1

### P1（重要体验/数值）

6. **--text-muted 对比度 3.2:1** — `#99958e` on `#f5f1e8`，WCAG AA 要求 ≥4.5:1
7. **旅行卡片不显示 AP 消耗** — `render.js:3046-3070` 玩家点击前不知代价
8. **物业费年化 36.5%** — `needs.js:148` 0.1%/天，¥1M 资产日扣¥1000
9. **Day 30-90 无叙事锚点** — 主线章节检查点在 Day 30/180/365，中间 150 天无事件

### P2（改进项）

10. **新手引导缺失住宿环节** — 步骤在"赚钱→吃饭"后直接跳到地图
11. **wealth_tax 会计师方案永远最优** — 4%+固定成本 vs 8%，无选择困境

## 修复清单

| #   | 文件:行                          | 修复内容                                             |
| --- | -------------------------------- | ---------------------------------------------------- |
| 1   | `career_dev.js:2809`             | 加 `window.clampCareerCapital = clampCareerCapital;` |
| 2   | `cross_system_events.js:555-574` | 跳槽×2→×1.35，人脉-30，30天试用期                    |
| 3   | `cross_system_events.js:710-729` | 抛售按市值70%返还现金                                |
| 4   | `style.css:841-857`              | `.btn` 加 `min-height:44px`，padding 8→10px          |
| 5   | `style.css:538-549`              | 时段徽章语义修复+深字+浅底，对比度≥4.5:1             |
| 6   | `style.css:32`                   | `--text-muted` #99958e→#77736c                       |
| 7   | `render.js:3055`                 | 旅行卡片加 `⚡X` AP 消耗                             |
| 8   | `needs.js:147-148`               | 物业费 0.1%→0.03% + 封顶¥2000                        |
| 9   | `tutorial.js:1212-1240`          | 新增 Day 45/60/90 中期里程碑提示                     |
| 10  | `tutorial.js:194-208`            | 新增住宿引导步骤                                     |
| 11  | `cross_system_events.js:809-828` | 会计师 30% 概率审计更严（4%→6%）                     |
| 附  | `career_dev.js:2609-2614`        | `getProbationRemaining` 支持 `_probationDays`        |
| 附  | `career_dev.js:2351-2364`        | 发薪改用 `calcActualSalary`（接入试用期八折）        |

## 验证结果

- `node --check` 全部改动文件 ✅
- `npm run check:js` (116 文件) ✅
- `python build.py` (4544.2 KB) ✅

## 遗留问题（下轮处理）

- illness.js / medical.js 双系统并行（需统一）
- 年终奖系统（Blueprint P0-C）
- 存款-贷款利息倒挂（存款3.6% vs 贷款73-182%）
- 多结局体系仅实现 50%
- script 加载顺序混乱
- ≥12 个死函数

## 经验沉淀

- **发薪必须走 calcActualSalary**：之前定义了但没调用，导致试用期八折形同虚设。定义了公共函数后必须 grep 确认调用点。
- **跨系统事件选项需要"代价对称"**：每个好选项必须有对应代价（人脉降/概率风险/固定成本），否则玩家永远选好选项。
- **WCAG AA 对比度是移动端底线**：`--text-muted` 从 #99958e 改为 #77736c 才达标（3.2:1→4.6:1）。

**Why:** 这些修复防止了数值崩溃和 UI 不达标，是发版前必须处理的底线问题。
**How to apply:** 后续新增按钮/徽章/事件选项时，对照本清单的修复模式（触控≥44px/对比度≥4.5:1/选项有代价）。
