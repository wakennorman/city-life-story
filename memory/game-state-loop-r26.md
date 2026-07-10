---
name: game-state-loop-r26
description: 城市浮生记 R26 系统状态总览 — 各维度完成度与待改进空间
metadata:
  type: reference
---

# 城市浮生记 · 系统状态总览（R26）

> 更新于 2026-07-10 | 当前 HEAD: `c6efeb5`（v3.79 loop R33: 事件自洽审查+5个联动事件）
> 并行窗口工作：R20-R119 rebase 超集 + 图书馆位置+借书行动 + v3.76 世界新闻选择面板重构

## 各维度完成度

| 维度                  | 完成度            | 最后更新                        | 备注                                                   |
| --------------------- | ----------------- | ------------------------------- | ------------------------------------------------------ |
| 🔗 跨系统联动事件     | ✅ 580+ 事件      | R33                             | +5个v3.77联动事件(老手特遇/台风天气×地点/NPC极致好感/道德分叉/多技能跨界) |
| 📜 叙事自洽性         | ✅ 0 A类缺陷      | R120（7轮全量扫描）             | 每次 events 变更后都跑 A/B/C 三类自洽扫描              |
| 🧑‍🤝‍🧑 NPC 系统           | ✅ 14/14 激活     | R32                             | 含情报系统全覆盖 + NPC关系矩阵深度互动事件×3            |
| 🎯 天赋系统           | ✅ 49天赋         | v3.57                           | 7剧本×7天赋，随机抽签                                  |
| 📖 游戏百科           | ✅ 注册表驱动     | v3.6                            | MECHANICS/NARRATIVES/VICTORIES 三注册表                 |
| 🎮 多剧本适配         | ✅ 7剧本          | v3.63b                          | 全剧本审计通过                                         |
| 📊 UI/UX              | ✅ 微动效+悬停    | v3.70                           | 触摸反馈/热招脉冲/收益浮动/CSS桌面悬停                 |
| 📍 地点覆盖           | ✅ 17地点         | v3.77                           | 新增图书馆(library)，全地点有事件                      |
| 📰 开局新闻选择       | ✅ 动态分类       | v3.76                           | 动态分类+去重+认知负荷3选项上限                        |
| ⚙️ 装备品质           | ✅ 3档化          | v3.0                            | 仅影响价格，无 effectMult（故意设计）                  |
| 📈 经济平衡           | ✅ 已调参         | v3.3                            | 4档难度+MC验证通过                                     |
| 🔄 每日习惯追踪       | ✅ 完整闭环       | v3.38                           | tickHabits → critical.js → events → illnesses          |
| 🏆 成就系统           | ✅ 167成就        | 长期                            | 含节日/职业/NPC/隐藏等分类                             |
| 🍳 烹饪/食材          | ✅ 已接入         | v3.6                            | ingredients.js + recipes + consumeCookingIngredients   |
| 🏥 疾病系统           | ✅ 16种5类        | v3.7                            | 4阶段演化+triggerHabit门控                             |
| 🏙️ 时代变迁           | ✅ 8里程碑        | v3.6                            | 含经济平衡滑条                                         |
| 📚 GDD 文档           | ✅ 575+事件       | R20-R119                        | memory/linkage-events-gdd.md                           |
| 📖 图书馆系统         | ✅ 已实装         | v3.77                           | 借书自学/读书会/读者证加成15%/城市生存指南8%加成      |

## 待改进空间（未覆盖/低优先级）

| 领域                | 当前状态    | 建议方向                             |
| ------------------- | ----------- | ------------------------------------ |
| 🎨 UI 微动效        | 🟡 开发中   | 并行窗口正在做（v3.70）              |
| 📦 装备品质接入价格 | ✅ 故意不接 | 仅价格倍数，不接收入计算（设计决策） |
| 🌐 多语言           | ❌ 未计划   | 全中文游戏，不支持国际化             |
| 🎵 音效/BGM         | ❌ 未计划   | 纯文字游戏，无音频                   |
| 🔌 插件/模组        | ❌ 未计划   | 单页 HTML 游戏，无插件架构           |
| 📱 移动端适配       | 🟡 基本可用 | 顶栏四行结构已稳定                   |

## 系统状态字段地图

关键状态字段及其用途：

- `state.flags._habits` — 7种习惯计数器（illness/events 消费）
- `state.flags._chainEventQueue` — 链式事件调度队列
- `state.flags._dailyHotJob` — 每日热招（稀缺性驱动）
- `state.flags._dailyTransactions` — 收支流水（用于可视化）
- `state.player.morality` — 道德值 0-100
- `state.reputation.{locKey}` — 按地点声望
- `state.skills.{skillName}.level/xp` — 技能等级
- `state.relationships.{npcId}.affinity/met` — NPC 关系
- `state._eraState.stageId` — 时代变迁阶段
- `state._worldParams` — 世界参数反馈环
- `state.family` — 家庭系统（父母健康/房贷/子女）

## 相关记忆

- [[review-improve-v3.1]] — 审查改进 SOP
- `memory/linkage-events-gdd.md` — 联动事件设计文档
