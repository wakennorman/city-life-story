# 域 Layer 4 · 轮次记录 2（L4-A 续扫：street 事件 gameOver 门控）

- **日期**: 2026-07-22
- **父提交**: `640df20b`（Layer 4 首过 L4-A：chengguan/events_corp 5 处）
- **本轮回提交**: `09b56b3`（fix: [Layer4] 时间线逻辑门控 L4-A 续扫 — street 事件 gameOver 泄漏门控 103 处，已落库且为 loop 77b652383 的祖先）

## 1. 背景
Layer 4（时间线逻辑）门控体系：L4-A = gameOver 泄漏门控。引擎 `events_core.js:400`
`queueRandomEvent(state, phase)` 仅按 `phase` 过滤、无 gameOver 检查，每日管线 `daily_pipeline.js`
对 `gameOver` 零检查 → 玩家死亡/破产后街头叙事事件仍可 fire（含 `scheduleChainEvent` 调度的后续链）。

## 2. 本轮修复清单（L4-A 续扫）
| 文件 | conditions 数 | 加门控数 | 备注 |
|------|--------------|----------|------|
| `events_street_survival.js` | 49 | 49 | 含 3 单行 conditions（已安全转多行） |
| `events_street_wealth.js` | 54 | 54 | 全多行，直接加 |
| `events_street_life.js` | 21 | 0（跳过） | 并行 loop 占用该文件（77b652383 已落库其寒潮互助等增强），留待后续轮次 |

门控模板（conditions 首行）：
  if (st.gameOver) return false; // [Layer4-L4A] 玩家死亡/破产后不再触发街头叙事事件

累计 L4-A：5（首过）+ 103（本轮）= **108 处**，dist/app.js 含 108 处守卫。

## 3. 关键坑（已解决）
### 3.1 单行 conditions 的 `//` 注释吞体 bug
初版把 `// [Layer4-L4A] …` 注释放在守卫之后、原条件体之前的同一行，导致 `//` 吞掉原条件体
+ 闭合 `}` → 函数永不被关闭（body 恒 return true 且缺 `}`）。症状：`node --check` 报
`Unexpected token '}'`（括号计数仍平衡）。修复：单行一律转多行，原条件体推到独立缩进行。

### 3.2 并行 loop 的 reset/clean 擦除未提交改动
并行 loop 每个周期 `git reset --hard` + `git clean -fd`，擦除所有未提交改动（含未跟踪的轮次记录）。
处置（沿用 merge 安全协议）：改动即紧窗口提交；index 仅含本轮回文件，绝不 `git add -A` 误带
loop 的 events_street_life.js / moral_events.js；提交前同步 last_known_head 以过 drift 钩子。

## 4. 验证
- node --check survival/wealth：均 OK
- 单行转换样本：原条件体 + `}` 完整保留
- python build.py：dist 8662.8 KB，含 108 处 L4-A 守卫
- 09b56b3 为 loop 77b652383 的祖先 → 代码安全

## 5. 下一子步
1. events_street_life.js（21 conditions）：待 loop 让出后补 L4-A，闭环 street 全覆盖。
2. L4-B 人工复核：114 phase-less 候选逐条判定是否真 RANDOM_EVENTS 死事件（禁批量自动补）。
3. gameOver 字段一致性专项：st.gameOver（根级）vs st.flags.gameOver（festivals/life_decisions/
   story_chapters/critical 误用，恒 falsy → no-op 门控）。
4. L4-C/D/E：era 错配 / 链式顺序 / 生涯阶段·天数门控。
5. Layer 5（经济缩放）/ Layer 6（选择均衡）：⏳ 后续。
