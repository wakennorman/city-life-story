# Round 8 — 域 D（NPC/社交）· B→D→F 覆盖第 2 轮

- **日期**: 2026-07-14
- **分支/提交**: loop/auto @ 父 HEAD a61c9c28 → 提交 `e2e86e47`（feat，A类修复2+联动增强3）
- **文件**: `src/js/core/npc_relationships.js`（核心改动）+ `src/DEVELOPMENT.md` + `dist/index.html` + `.claude/last_known_head`

## A 类修复（2）

1. **关系事件链永不触发**（死代码）：`checkNpcRelationEventTriggers()` 返回 `triangular_choice` / `old_friend_reaction` 触发，但全代码库无任何消费者（grep 确认 src/ 内 0 caller）→ 关系链定义存在却永远不会出场。修复：新增 `runNpcRelationChainEvents(state, day)`，在 `tickNpcRelationships` 每日 tick 末尾调用，真正消费触发并落地为消息+好感传导。
2. **消息显示原始 id**：好感衰减消息用 `_npcId.replace(/_/g," ")` 显示成 "aunt wang"；`applyAffinityChange` 升降级消息直接拼 `npcId`（如 "boss_li"）。修复：新增 `getNpcDisplayName(npcId)`（遍历全局 `NPCS` 取 `.name` 中文名，兜底 replace），两处消息改用之。

## 联动增强（3，均 `||` 防御，数值标 [PLACEHOLDER]）

1. **triangular_choice 阵营张力**（D 内跨 NPC 负向好感传导）：玩家同时讨好一对竞争 NPC（affA≥50 ∩ affB≥30）→ 双方各 -1，叙事逼玩家站队。14 天冷却。
2. **old_friend_reaction 圈子效应**（跨 NPC 正向传导）：老邻居对（如王大婶↔老周，affA≥60 ∩ affB≥20）互相提起玩家 → 双方各 +1，温情叙事。14 天冷却。
3. **圈子归属感**（D→G，社会比较/归属感桥接）：拥有 ≥3 个熟人（met ∧ affinity≥30）时，每 7 天 `needs.happiness +2` 并附归属感叙事。

## 关键事实（下轮续接）

- NPC 关系引擎真实入口：`src/js/core/npc_relationships.js`。`tickNpcRelationships` 由 `daily_pipeline.js:1381`（npc_relationships_tick slot）调用。
- NPC id→中文名 **无全局 helper**，本轮新增 `getNpcDisplayName`（读 `NPCS`，const 全局-lexical 跨 script 标签共享，tick 运行时 NPCS 已初始化，安全）。全 14 个矩阵 id 在 npcs.js 均有 name 条目（master_zhao/xiaoli/auntie_lin 已非 TODO，有 name）。
- 仍为死代码待接：`getNpcRelationshipNetwork(state)`（社交 Tab 关系网渲染，属域 F UI，本轮未动，记为 C 类跨域）。
- 只读 `state.relationships`，未读 `state.npcRelationships`（守卫合规）。
- MC `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → all pass，0 异常（RSS timeout 为网络非代码）。

## 下一轮

- 域 **F（UI/UX）**，B→D→F 覆盖第 3 轮（最后一轮），之后恢复 C→E→G→H→A。
- F 候选：把死代码 `getNpcRelationshipNetwork` 接入社交 Tab 渲染（关系网可视化）——正好衔接本轮 D 的关系链。
