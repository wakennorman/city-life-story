# R47 域E 经济/投资 优化记录（2026-07-19）

## 指令一：A类缺陷修复（2处）

| # | 文件 | 缺陷 | 修复 |
|---|------|------|------|
| 1 | `startup.js:8215` | `showLegalResponseModal` 裸访问 `state.startup.company`，Phase1玩家或无公司时 `state.startup` 可能为 undefined → TypeError | 前置守卫 `if (!state || !state.startup || !state.startup.company) return` |
| 2 | `startup.js:8284` | `showCompetitorDefenseModal` 同样裸访问 `state.startup.company` | 前置守卫 + 返回 `{ success: false, message: "没有公司" }` |

## 指令二：联动增强（3项）

| # | 事件ID | 联动方向 | 触发条件 | 设计意图 |
|---|--------|----------|----------|----------|
| 1 | `investment_profit_npc_attention` | E→D 投资→社交 | 持仓+已结识NPC好感≥10+Day90 | 投资盈利溢出到社交：NPC注意到玩家变化，请客/低调两种选择 |
| 2 | `investment_loss_anxiety` | E→G 投资→核心机制 | 浮亏>¥10000+Day60 | 巨额亏损触发心理事件：接受/学习/装死三种应对 |
| 3 | `wealth_tax_npc_conversation` | E→D 经济→社交 | 财富税>0+corporate阶段+Day180 | 财富税触发同事间经济话题：税务筹划/资产配置讨论 |

## 设计心理学
- 峰终定律：投资盈利/亏损的峰值时刻赋予叙事意义
- 损失厌恶：巨额浮亏的焦虑感驱动玩家学习/决策
- 社会比较：财富税→"你已经是富人了"的身份转变叙事
- 禀赋效应：投资盈利后请客→社交关系加深→更多机会

## 验证
- `node --check` ✅ startup.js / economy_linkage_events.js
- `python build.py` ✅ 8446.5 KB
- `git push` ✅ main → 7c300e8f

## 覆盖矩阵更新
| 次级系统 | 之前 | 之后 |
|----------|------|------|
| 投资盈利叙事 | 3 | 4 |
| 投资亏损叙事 | 2 | 3 |
| 财富税叙事 | 0 | 1 |
| NPC经济话题 | 1 | 2 |
