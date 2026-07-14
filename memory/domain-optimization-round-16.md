---
name: domain-optimization-round-16
description: 域D NPC/社交 A类修复(5项)+联动增强(3项)
metadata:
  type: project
  domain: D
  round: 16
  date: 2026-07-14
---

# 全系统优化 R16 — 域D NPC/社交

## 本轮焦点

用户反馈"🔗 NPC关系网"显示英文ID → 全系统优化启动，选择域D（NPC/社交）

## A类缺陷修复清单

| # | 文件 | 缺陷 | 修复内容 |
|---|---|---|---|
| A5 | `social_tab.js` | 拜访按钮无事件绑定 | 将 `_bindVisitBtns` 提升为公共函数，`social_npc`/`social_network` 子Tab共享调用 |
| A4 | `social_tab.js` | 拜访冷却消息英文ID | NPC中文名查找提前到冷却检查前，冷却消息使用中文名 |
| A5 | `social_tab.js` | 拜访绕过 `applyAffinityChange` | 改为调用 `applyAffinityChange` 使衰减系统识别拜访行为 |
| A4 | `social_tab.js` | NPC关系矩阵显示英文ID | 矩阵区改用 `NPCS.find` 查中文名；关系类型/传导类型加中译映射表 |
| A3 | `npc_relationships.js` | 好感衰减速率弱7倍 | 衰减率对齐注释值：0.2/0.35/0.56/0.84（每7天） |
| A6 | `npcs.js` | 4个NPC深度任务缺完成标记 | auntie_lin/master_zhao/xiaoli/dr_wang 各choice添加 `_npcDeepTask_xxx = true` |

## 联动增强清单

| 增强 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| 3个缺失NPC加入矩阵 | `npc_relationships.js` | NPC_RELATION_MATRIX + RELATION_PROPAGATION | uncle_chen_bank / sister_wu / brother_huang 补齐关系网，可参与蝴蝶效应传播 |
| 衰减倒计时UI | `social_tab.js` | NPC关系卡片+衰减 | 玩家可看到"X天后好感将衰减"或"已衰减X"，驱动维护关系行为 |
| NPC动态显示中文名 | `social_tab.js` | NPC动态渲染 | social_network子tab NPC动态前加NPC名称前缀 |

## Commit 记录

- `2f9ac00e` — fix: [域D] NPC关系网显示英文ID→中译修复
- `edeb101b` — fix: [域D] A类缺陷修复(5项)+NPC关系网中译
- `9a2659ea` — feat: [域D] 联动增强(3项)