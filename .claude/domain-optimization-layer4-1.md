# 全系统优化 · Layer 4 时间线逻辑门控 — 首过（L4-A gameOver 泄漏）

> 轮次：Layer 4 第一过（接续 R163 域H + Layer 3 全覆盖 a35defbf）
> 日期：2026-07-22
> 触发：手动「继续」（loop 自驱至 R163/Layer3 后，本会话接管推进 Layer 4）
> 标记：`// [Layer4-L4A]`

## 一、背景与定位
8 域轮换 loop 自驱完成 12 整轮（R1–R163）后，进入「事件叙事门控体系 Layer 1-6」专项
（P1-6，DEVELOPMENT.md）。Layer 1（技术层）✅、Layer 3（玩家状态自洽）✅ 全覆盖
（a35defbf，99 处门控/19 文件）。**Layer 4（时间线逻辑）为下一目标**。

> 关键发现：DEVELOPMENT.md 原引用的 `memory/event-gate-layer-system.md` **不存在**（悬空引用）。
> 本轮补全该规范源，定义 Layer 1-6 全文 + Layer 4 缺陷分类（L4-A~L4-E）+ 标记约定 + 验收口径。

## 二、本轮修复清单（A 类/Layer 缺陷 = 5 处，均为 L4-A gameOver 泄漏）

| 文件 | 事件 | 缺陷 | 修复 | 类别 |
| --- | --- | --- | --- | --- |
| `src/js/core/chengguan_events.js` | `chengguan_raid_panic` | 玩家死亡/破产后仍触发「城管来了」街头惊魂 | `conditions` 顶部加 `if (st.gameOver) return false;` | L4-A |
| `src/js/core/events_corp.js` | `insider_verify` | 链式内幕事件（前序 `insider_rumor_start` 调度）在 gameOver 后触发 | 同上 | L4-A |
| `src/js/core/events_corp.js` | `founder_humiliation` | 前创始人羞辱链在 gameOver 后触发 | 同上 | L4-A |
| `src/js/core/events_corp.js` | `founder_buyback` | 回购链在 gameOver 后触发 | 同上 | L4-A |
| `src/js/core/events_corp.js` | `workplace_boss_grudge` | 穿小鞋链在 gameOver 后触发 | 同上 | L4-A |

**引擎事实底座**（决定 L4-A 必要性）：
- `events_core.js:400` `queueRandomEvent` 仅按 `e.phase === phase` 过滤，**无 gameOver 门控**。
- 每日管线 `daily_pipeline.js` 对 `gameOver` **零检查** → 同日后续事件/链式事件可在 gameOver 置位后继续触发。
- 故叙事事件在死亡/破产后仍可能 fire（尤其 `scheduleChainEvent` 调度的后续链），L4-A 门控为有效且必要修复。

## 三、审计发现（待后续子步处理，本轮未改）

1. **L4-B phase-less 死事件**：程序扫描 25 个事件文件得 114 个「缺顶层 `phase` 字段」候选。
   但**绝大多数为误报**：`moral_events.js` 的 MORAL_EVENTS 是独立声明式子系统（不走 street/corporate phase 过滤）；
   `startup_events.js` 的 `growth`/`mature` 为公司阶段（非玩家 street/corporate）；`cross_system_events.js` 的
   `aunt_wang`/`old_zhou` 走 `triggers` 而非 `phase`。**自动补 `phase` 会破坏这些子系统** → 须逐条人工复核，本轮不动。
2. **`st.gameOver` vs `st.flags.gameOver` 不一致 BUG**：`state.js:443` 将 `gameOver` 存在**根级**（`st.gameOver`）；
   但 `festivals.js:1364`/`life_decisions.js:497`/`story_chapters.js:250`/`critical.js` 多处检查 `state.flags.gameOver`
   （恒为 undefined→falsy）→ **这些 gameOver 门控实为 no-op**。属独立缺陷，建议另起专项修复（不在本 Layer 4 范围，标记待办）。
3. **L4-C/D/E 未做**：era 错配、链式顺序、生涯阶段/天数 —— 待 L4-A/B 扫清后推进。

## 四、配套交付
- 新增 `memory/event-gate-layer-system.md`（Layer 1-6 规范源，补全 DEVELOPMENT.md 悬空引用）。
- `src/DEVELOPMENT.md`：顶部「最后更新」+ P1-6 行更新（Layer 3 → ✅ 全覆盖；Layer 4 → 🔴 进行中）。
- `dist/app.js` 随 `python build.py` 重建（含 5 处 `[Layer4-L4A]` 标记）。

## 五、验证
- `node --check` 全过（chengguan_events.js / events_corp.js 语法 OK）。
- `[Layer4-L4A]` 标记计数 = 5（src）+ 5（dist/app.js）。
- 未跑 MC（纯 conditions 守卫插入，零副作用当 `st.gameOver===false`）。

## 六、下一子步（建议）
- **L4-A 续扫**：street 事件文件（events_street_life/survival/wealth 各 18/49/54 个 conditions，共 121 处）+
  其余 corporate 链式事件（部分无 `conditions` 函数，须 engine/apply 级门控）。
- **L4-B 人工复核**：114 候选逐条判定是否真死事件，仅对确属 RANDOM_EVENTS 且缺 phase 者补字段。
- **gameOver 字段一致性专项**：统一 `st.gameOver` 访问（修 festivals/life_decisions/story_chapters/critical 的 `flags.gameOver` 误用）。
