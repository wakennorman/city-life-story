# 域 Layer 4 · 轮次记录 3（L4-A 收尾：events_street_life.js 22 处 gameOver 门控 → street 全覆盖）

- **日期**: 2026-07-22
- **父提交**: `fcc0467e`（Layer 4 文档/状态更新，round 165）
- **本轮回提交**: `8dc2e70`（fix: [Layer4] 时间线逻辑门控 L4-A 收尾 — events_street_life.js 22 处，已落库）

## 1. 背景
L4-A = gameOver 泄漏门控。引擎 `queueRandomEvent(state, phase)`（`events_core.js:400`）仅按
`phase` 过滤、无 gameOver 检查，每日管线 `daily_pipeline.js` 对 `gameOver` 零检查 →
玩家死亡/破产后街头叙事事件仍会触发。前两轮已覆盖：首过 5 处（chengguan/events_corp 链式）
+ street 续扫 survival 49 + wealth 54（life 21 预估、实际 22，因并行 loop 占用被跳过）。

## 2. 本轮修复清单（L4-A 收尾）
| 文件 | conditions 数 | 加门控 | 备注 |
|------|--------------|--------|------|
| `events_street_life.js` | 22 | 22 | 含 10 个**单行** conditions（已安全转多行，保留原 body + 闭合 `}` + `// [Layer3]` 尾注） |

门控模板（conditions 首行）：
  if (st.gameOver) return false; // [Layer4-L4A] 玩家死亡/破产后不再触发街头叙事事件

**street 三件套全覆盖**：survival 49 + wealth 54 + life 22 = **125 处**。
**L4-A 全局累计**：首过 5 处 + street 125 处 = **130 处** gameOver 门控（dist/app.js 含 130 守卫）。

## 3. 关键坑（已解决）
### 3.1 单行 conditions 的尾注吞体风险
life.js 有 10 个单行 conditions，格式为
`conditions: function (st) { if(...) return false; return true; }, // [Layer3]`——
行尾带 `}, // [Layer3]`。初版 one-liner 正则要求 `}` 在行末（`\s*\}\s*$`），匹配不到这些带尾注的行，
仅加了 12 个多行 conditions。修复：one-liner 正则捕获 `{(.+)}(\s*,?\s*//.*)?$`，
将 body 推到独立缩进行，闭合 `}` 后**保留原尾注**（`, // [Layer3]`），避免注释/结构丢失。

### 3.2 并行 loop reset/clean 擦除（沿用协议）
并行 loop 每周期 `git reset --hard` + `git clean -fd`，擦除未提交改动（含未跟踪轮次记录）。
处置：本轮代码提交 `8dc2e70` 在单条 Bash 内 apply→node --check→build→stage→commit 原子完成；
文档提交同样原子。index 仅含本轮回文件，绝不 `git add -A` 误带 loop 的 moral_events.js。

## 4. 验证
- node --check life.js：OK；guards=22（匹配 conditions 数）
- 单行转换样本（215-218）：原 body + `}, // [Layer3]` 完整保留
- python build.py：dist 重建含 130 处 L4-A 守卫
- 8dc2e70 为 main HEAD，安全

## 5. 下一子步
1. **L4-B 人工复核**：114 个 phase-less 候选逐条判定是否真 RANDOM_EVENTS 死事件
   （禁批量自动补，以免破坏 MORAL_EVENTS / company 阶段子系统）。
2. **gameOver 字段一致性专项**：`st.gameOver`（根级）vs `st.flags.gameOver`
   （festivals/life_decisions/story_chapters/critical 误用，恒 falsy → no-op 门控）。
3. **L4-C/D/E**：era 错配 / 链式顺序 / 生涯阶段·天数门控。
4. **Layer 5（经济缩放）/ Layer 6（选择均衡）**：⏳ 后续。
