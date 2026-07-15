---
name: domain-optimization-round-20
description: R20 全系统优化 域G(核心机制/生命周期) — 5 A类修复+3联动增强（名气-社交跨域桥接/情绪健康叙事深度）
metadata:
  type: project
---

**R20 · 2026-07-15 · 域G 核心机制/生命周期（第四轮）**

背景：R12/R16/R17 后域G第四轮，继续巩固核心机制/生命周期层。

## 指令一：A类缺陷修复（6项）

| 文件:行号                  | 缺陷                                                                                                                 | 修复                                                                      |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| phase1/illness.js:324      | `state.needs.fatigue += 5` 未 clamp 至 100（其他症状均用 Math.min(100,...) 限幅）                                    | 加 `Math.min(100, ...)`                                                   |
| main.js:5024               | 创业目标条件 `!s.status && s.status !== "none"` 逻辑矛盾（default="none" 永假，6年未触发）                           | 改 `(!s.status \|\| s.status === "none")`                                 |
| main.js:855/1469/2550      | `capacity=[20,50,100,200][tier]` 4元素数组越界（tier 支持 0-6）→ tier≥4 时 capacity=undefined → 物品容量检查永久失效 | 扩建为 `[20,50,100,200,500,1000,2000]`                                    |
| phase1/needs.js:14-16      | `getDifficultyMultiplier` 返回 NaN 时 `Math.max(0, NaN)=NaN` 非 0；注释误以为 `\|\|0` 已兜底                         | decayMul isFinite 守卫 + clamp(0.1,5.0) + 需求补 `Math.min(100,...)` 上限 |
| core/state.js:441          | `_hypertensionMonthlyPaid` 死字段（illness.js 读写的是 `_chronicMonthlyPaid`，此字段从未被读取）                     | 删除死字段                                                                |
| core/story_chapters.js:364 | `bankLoan` 字段名不存在（state 定义为 `bankDebt` state.js:66），银行贷款不计入 checklist 债务显示                    | 改为 `bankDebt`                                                           |

## 指令二：联动增强（4项）

| 事件                       | 文件                                | 联动域 | 设计意图                                                         |
| -------------------------- | ----------------------------------- | ------ | ---------------------------------------------------------------- |
| fame_npc_gossip            | lifecycle_milestone_events.js（新） | G→D    | fame 子系统首次被 NPC 事件消费，名气+社交跨域桥接                |
| fame_npc_personal          | lifecycle_milestone_events.js（新） | G→D    | 名气+好感双门槛解锁深度互动（峰终定律·被熟人重新认识的顿悟时刻） |
| fame_corporate_recognition | lifecycle_milestone_events.js（新） | G→C    | 名气影响 corporate 阶段人气/评价（事业成长的软资产）             |
| story_chapters.js 章节感知 | story_chapters.js（改）             | G→G    | 情绪状态/健康子系统深度影响叙事走向（损失厌恶/峰终/情感温度）    |

验证：node --check 6 文件 PASS / build.py 8356.4KB PASS / mc_verify_v3.6.cjs ✅
