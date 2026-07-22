# 事件叙事门控体系 — Layer 1-6 规范源

> 本文件是 `src/DEVELOPMENT.md` P1-6 的权威定义。8 域轮换 loop 完成 12 轮（R1–R163）后，
> 进入「事件叙事门控体系」专项，逐层消除叙事穿帮（叙事说的事与玩家真实状态/时间线不符）。
> 每层用独立注释标记：`// [LayerN]`（+ 可选子标签如 `// [Layer4-L4A]`），便于 grep 统计与回滚。

## 设计意图（玩家心理学视角）
叙事穿帮 = 事件讲了一个与玩家处境矛盾的故事（"你一直在干的活"但玩家失业、"你走进市场"但已破产）。
这是**认知失调**的源头，直接破坏沉浸与「我的选择塑造轨迹」的留存核心。门控体系让每个事件在触发前
自证其叙事前提成立，从技术层到选择均衡层逐步收敛穿帮。

## Layer 1 — 技术层（Technical）✅ 已全覆盖
- 缺陷：引用不存在的 id / 裸访问未定义属性导致崩溃 / conditions 应守未守。
- 标记：`// [全系统自洽修复]`（8 域 loop 早期约定，与 Layer 标记并存）。
- 验收：`node --check` 全过 + `tests/events_integrity.cjs` id 唯一/可达性。

## Layer 2 — NPC 自洽（NPC Self-Consistency）🔶 部分覆盖
- 缺陷：NPC 事件在 NPC 未结识（!met）或好感不足时触发，叙事直接称呼其名却素未谋面。
- 守卫惯例：`rel && rel.met && (rel.affinity||0) >= N`。
- 标记：`// [Layer2]`（当前库内尚未系统铺开，需补）。

## Layer 3 — 玩家状态自洽（Player-State Self-Consistency）✅ 全覆盖
- 缺陷：叙事前提（有工作/在商业区/结识某人/有某种经历）与玩家真实状态不符。
- 守卫：`conditions` 内 `if (!<precondition>) return false; // [Layer3]`。
- 验收：a35defbf（99 处门控 / 19 文件，2026-07-22 18:18 完成）。

## Layer 4 — 时间线逻辑（Timeline Logic）🔴 进行中（本轮目标）
事件触发必须符合游戏的**时间线与生命周期**，不止于「状态匹配」。
### 缺陷分类（L4-A ~ L4-E）
- **L4-A gameOver 泄漏**：玩家已死亡/破产（`st.gameOver === true`）后仍触发叙事事件。
  引擎主随机池在 gameOver 后停止，但**链式事件（`_chainEventQueue`）/ trigger_registry / 每日管线**可能仍触发。
  守卫：`conditions` 顶部 `if (st.gameOver) return false; // [Layer4-L4A]`（gameOver 为 false 时零副作用）。
- **L4-B phase 歧义**：事件**缺失顶层 `phase` 字段** → 引擎 `filter(e => e.phase === phase)` 不收录 → 永不触发（死事件），
  或字段写错（street 事件误标 corporate）导致在不该出现的 phase 触发。
  守卫：每个事件必须显式 `phase: "street" | "corporate"`；双 phase 事件须在 conditions 内按 `st.player.phase` 分流。
- **L4-C era 错配**：叙事绑定特定时代（如「疫情封城」「互联网泡沫」）却在其它 era 触发。
  守卫：事件有 `era` 字段时 `if (st.era !== "<era>") return false; // [Layer4-L4C]`。
- **L4-D 链式顺序**：续章事件在母事件未触发前 firing。
  守卫：`if (!st.flags._chain_<parentId>) return false; // [Layer4-L4D]`。
- **L4-E 生涯阶段/天数**：叙事暗示「已工作多年」「职场老人」却在 day 1 触发。
  守卫：`if (st.player.day < N) return false;` 或 `st.career.tenure < N`（引擎已有 `triggers.minDay` 声明式入口，优先用 triggers）。
### 标记与验收
- 标记：`// [Layer4]` / `// [Layer4-L4A]` 等。
- 验收：`events_integrity.cjs` 断言 100% 事件含 `phase` 字段；MC 10×500d 断言 gameOver 后无叙事事件 apply。

## Layer 5 — 经济缩放（Economy Scaling）⏳
事件奖惩须随玩家经济层级缩放（穷人 ¥50 痛、富人无感）。守卫：奖励 = base × f(netWorthTier)。
防「固定大额奖励让穷人一步登天」破坏经济曲线。

## Layer 6 — 选择均衡（Choice Balance）⏳
每个事件的选项须无主导策略、权衡有意义（参考峰终定律+损失厌恶）。
验收：MC 跑 N 种子，统计各选项选取分布，识别 >90% 集中度的「伪选择」并重构。

---
## 执行纪律（沿用 loop 铁律）
- 每修一处加对应 `// [LayerN]` 标记；不引入 magic number（天数/阈值给 rationale）。
- 改动后 `node --check` → `python build.py` → `tests/events_integrity.cjs` → MC 冒烟 → commit（不 push）。
- 提交前 in-progress 守卫（CHERRY_PICK_HEAD 等五标记）＋ index 仅含本轮回文件 ＋ 同步 `last_known_head`。
- 多窗口并行：本体系由 loop 自动化与手动「继续」并发驱动，严格遵守 merge 安全协议（见 MEMORY.md）。
