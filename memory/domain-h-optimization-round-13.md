---
name: domain-h-optimization-round-13
description: 全系统优化R13 — 域H(Phase2/公司) 5A类修复+3联动增强
metadata:
  type: project
  focus: "2026-07-13 loop R13(域H)"
---

# 全系统优化 R13 — 域H Phase2/公司（2026-07-13）

## 指令一：A类缺陷全量扫描（5个bug修复，5文件）

| #   | 文件                          | 缺陷                                                              | 修复                                                                  |
| --- | ----------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1   | `corp_ops.js:69`              | doCorporateAction 未处理 effects.cash → "接私活"不给钱            | 新增 `if (effects.cash)` 现金效果处理，与其它效果一致的 Math.max 守卫 |
| 2   | `startup_competition.js:3012` | getPartnerSummary 用 `new Date().getDate()`（真实日期）而非游戏天 | 改为 `StateManager.getState()` 获取 `state.player.day`                |
| 3   | `company_spawner.js:394`      | generateCeoBio 固定 aggressive 数组，4/5 特质数组死代码           | 随机从5个特质键中选一个                                               |
| 4   | `startup_competition.js:2520` | improveCultureAdoption conflictReduced 恒 false                   | 新增 `oldConflict` 缓存，比较 decrement 前后值                        |
| 5   | `startup_competition.js:2510` | cultureConflictLevel decrement 后缺失 oldValue 比较（与A4同根因） | 同上                                                                  |

## 指令二：联动增强（3项，3文件）

| #   | 文件              | 增强                      | 说明                                                                                |
| --- | ----------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| 1   | `corp_ops.js:254` | Phase1→2过渡叙事闭环      | 入职公司时追加"从街头到写字楼，用了N天，攒下¥X"叙事消息                             |
| 2   | `startup.js:521`  | 街头技能→创业初始属性联动 | coding→technologyScore, sales→marketScore, mgmt→reputation, accounting→burnRate折扣 |
| 3   | `corp_ui.js:277`  | 职场降级叙事增强          | 被开除回街头时显示"职场N年，完成M个项目"历练总结                                    |

## 指令三：约定式自动归类(CoC)适用性检查

对照 [[convention-check-habit]] 清单：

- [x] 所有改动仅新增字段处理和数据联动，未修改渲染/导航/注册代码
- [x] 所有修复合规：纯函数扩展、`Random.*` API、`Math.max/min` 守卫
- [x] A1 修复了 CoC 缺口（效果声明了 `cash` 字段但 dispatch 未处理——现补齐）
- [x] 无"不得不改旧文件"的断链情况

**结论：CoC 链路完整 ✅**

## 验证

- node --check 全部5文件通过 ✅
- build.py 8113.1 KB ✅

## 下一轮推荐

域A（数据/数值平衡）—— jobs/skills/items/goods/pricing 仍有大量旧数据可关联 CoC 系统
