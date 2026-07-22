# 域 Layer 4 · 轮次记录 4（gameOver 字段一致性专项 — 激活 130 处 L4-A 门控）

- **日期**: 2026-07-22
- **父提交**: `3202ca5c`（Layer 4 文档/状态更新，round 166，L4-A street 全覆盖）
- **本轮回提交**: `f2326f22`（fix: [Layer4] gameOver 字段一致性 — 根级 gameOver 真正写入，激活 130 处 L4-A 门控）

## 1. 根因（关键反转）
L4-A 收尾后（round 166，130 处 `if (st.gameOver) return false;` 门控已落地），复检发现：
- `state.js:443` 定义根级 `gameOver: false`（设计意图字段）。
- 但**全部 7 处 gameOver 触发仅写 `state.flags.gameOver = true`**：
  critical.js×2、corp_ui.js×4、victory.js×1。
- 根级 `gameOver` **永不被置 true** → 130 处 L4-A 守卫读根级 `st.gameOver` 实为 **no-op**，
  死亡/破产后街头叙事事件仍会 fire。
- 反直觉点：festivals/life_decisions/story_chapters/critical 自身门控读的正是
  `state.flags.gameOver`（活字段）→ 它们**本来就是正确的**，并非此前以为的 no-op。

## 2. 修复（Option C 一致性桥接，最小爆破面）
- 在 7 处触发点同步写入根级 `state.gameOver = true`（及 `state.gameOverReason` 镜像，
  4 处带 reason 的站点：critical 763/775、corp_ui 273/286），保留原 `state.flags.gameOver` 写入。
- 所有 `flags.gameOver` 读取方（festivals / life_decisions / story_chapters / critical
  自身门控 / daily_report / victory / modal 的 gameOverReason 渲染）**代码不变** → 零 UI 回归。
- 正则按原缩进插入：`(\s*)state.flags.gameOver = true;` →
  `state.gameOver = true;
state.flags.gameOver = true;`（reason 同理）。
- 效果：根级 `gameOver` 现在真实反映结局状态，**130 处 L4-A 门控正式生效**。

## 3. 验证
- node --check critical/corp_ui/victory：均 OK
- 根级写入计数 = 7（critical 2 + corp_ui 4 + victory 1），flags 写入仍 = 7（无丢失）
- dist/app.js 含 7 处根级 `state.gameOver = true;`
- f2326f22 为 main HEAD 祖先，安全

## 4. 取舍说明
未选 Option A（改 130 处 L4-A 守卫读 `flags.gameOver`）——虽更"纯"，但 130 行改动爆破面大、
且与 state.js 设计意图（根级 gameOver）相悖；未选 Option B（改 7 写+4读全部迁根级）——
触及 victory/modal UI 渲染，回归风险高。Option C 以 7 处小改动激活既有门控，风险最低。

## 5. 下一子步
1. **L4-B 人工复核**：114 个 phase-less 候选逐条判定是否真 RANDOM_EVENTS 死事件
   （禁批量自动补，以免破坏 MORAL_EVENTS / company 阶段子系统）。
2. **L4-C/D/E**：era 错配 / 链式顺序 / 生涯阶段·天数门控。
3. **Layer 6（选择均衡）**：⏳ 后续（loop 尚未做）。
4. 考虑后续清理：根级 `gameOver` 已激活，可规划废弃 `flags.gameOver` 双写（独立专项，不在本轮）。
