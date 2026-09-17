# 全系统优化 Round 171 — 域 A / 数据·数值平衡(第九轮)

> 日期: 2026-07-23 | 提交: 88be9f36(联动) + 516781a1(A类补提交) | 已推 ✅

## 选域逻辑
A 域自 R156 后未再主审（最久未轮到），本轮作为"薄弱域"优先处理。

## 1. 修复清单（A 类，2项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/data/locations.js` | 医院地点 jobs 数组 `"hospital_companion"`×2 重复死代码 | 去重为单个，删除冗余数组元素 | A |
| `src/js/phase1/trade.js` | `buyGood` 现金裸访问 `state.resources.cash < totalCost` 无 NaN 防御，旧存档可能导致无限刷钱 | 改为 `(Number(state.resources.cash) \|\| 0) < totalCost` + 扣款 `Math.round((cash \|\| 0) - totalCost)` | A |

## 2. 增强清单（联动，2项）

| 新增 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| 经济日报(财富等级叙事化) | `domain_a_linkage_r171.js` | A→G | 财富等级变化触发峰终叙事，让数字成长有情感温度 |
| NPC财富感知(总资产→NPC态度) | `domain_a_linkage_r171.js` | A→D | 总资产阈值影响NPC对话态度，闭合经济→社交因果链 |

## 3. 验证
- `node --check` locations.js / trade.js / domain_a_linkage_r171.js ✅
- `python build.py` ✅ (8792.7 KB)
- 构建产物已提交

## 4. 提交
- `88be9f36` feat: [域A] R171 联动增强(2项) — A→G/A→D
- `516781a1` fix: [域A] R171 A类补提交(2项) — 医院jobs去重+buyGood现金NaN防御
