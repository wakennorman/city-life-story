---
name: domain-a-optimization-round-14
description: 全系统优化R14 域A(数据/数值平衡) — 3个A类修复+2项联动增强
metadata:
  type: project
  focus: "2026-07-14 loop R14(域A)"
---

# 全系统优化 R14 — 域A 数据/数值平衡（2026-07-14）

**用户排除项**：illnesses.js 4 TODO / locations.js 8 TODO / 条件迁移

## 指令一：A类缺陷修复（3项）

| #   | 文件                       | 缺陷                                                                                                                                    | 修复                                                                                                                                 |
| --- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `skill_bonuses.js:757-762` | 村长债利率只用固定难度利率，economy_v3.1.getDynamicLoanRate 是死代码从未被调用                                                          | 接入 getDynamicLoanRate：基于总资产阶梯递增利率（¥0→0.20% ~ ¥3M+→1.00%），难度利率为保底下限 `Math.max(difficultyRate, dynamicRate)` |
| 2   | `main.js:1493`             | 沙盒模式描述硬编码"日息0.35%"与实际难度利率不一致                                                                                       | 改为按 `cfg.difficulty` 显示难度对应利率                                                                                             |
| 3   | `pricing.js:624`           | 增强版 getCurrentPrice 中 `good` 变量在声明前使用（第624行引用，第630行 var 声明）。var 提升导致 good=undefined，条件不成立但有隐式 bug | 移除节日修正节（原始 getCurrentPrice 已处理节日修正，增强版不应重复叠加）                                                            |

## 指令二：联动增强（2项）

| #   | 文件                      | 增强                         | 说明                                                     |
| --- | ------------------------- | ---------------------------- | -------------------------------------------------------- |
| 1   | `daily_report.js:466-472` | 债务高光处显示动态利率       | 当利率>0.5%时展示具体百分比日息，让玩家感知资产→利率关联 |
| 2   | `daily_focus.js:76-81`    | 还款建议提示使用动态利率文案 | 用 EconomySystem.getDynamicLoanRate 替换静态文案         |

## 验证

- `node --check` 全部5文件通过 ✅
- `python build.py` 8129.2 KB ✅
- commit `be4b28a6` → git push origin main ✅

## 下一轮推荐

域B（事件/叙事）或域D（NPC/社交）—— economy_v3.1.getConsecutiveWinDecay/getMarketSaturationPenalty 仍有死代码待集成
