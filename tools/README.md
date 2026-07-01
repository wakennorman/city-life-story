# tools/ — 开发辅助工具

本目录存放不进入游戏运行时的开发辅助脚本（不加载进 `src/index.html`，不参与 `build.py` 打包）。

## monte_carlo_runner.js — Monte Carlo 浏览器端跑分

**背景**：`IMPLEMENTATION_PROGRESS.md` 的第五轮审查把「Monte Carlo 浏览器验收」列为 P2 已知缺口（无 node 自动化脚本），第五轮改动（新闻→世界参数联动 / 行业周期事件链）受 2%/日衰减约束、风险低，留待浏览器跑验收。本脚本是该缺口的最小补丁。

### 用法

1. 用 `dist/index.html` 或 `src/index.html` 正常开局进入游戏（选好模式/剧本/沙盒，确保 `StateManager` 已有 state）。
2. 打开浏览器 DevTools Console。
3. 粘贴 `tools/monte_carlo_runner.js` 全文回车（或通过书签/油猴注入）。
4. 执行：
   - `mc.run(365)` — 跑 365 天
   - `mc.report()` — 重新打印统计
   - `mc.export()` — 导出完整 snapshots JSON 到控制台
   - 也可访问页面时带 `?mc=365`，1 秒后自动开跑。

### 它测什么

- 每日总资产/现金/健康/心情/疲劳/阶段/名气的演化曲线
- 行业热度 `state._worldParams.sectorHeat` 的末值（验收新闻→世界参数传导）
- 消息计数（按 type + 关键词粗分类：新闻/医疗/事件/危机）

### 限制（重要）

- `showModal` 被拦截为 **noop**：不显示弹窗、不执行按钮 callback。因此：
  - **不模拟玩家主动行动**（不工作/不消费/不选事件），只测被动演化。
  - 跳过事件选择的 effects、每日报告的"继续"逻辑；`endDay` 管线（`daily_pipeline.js::runDailyPipeline`）自推进。
- 不调用玩家行动 handler（避免 DOM 依赖与链式弹窗）。
- 因此经济曲线是"不工作只支出/利息/维持成本"的衰减演化，**不是完整玩法曲线**。
- 智能行动模拟、多策略对比、自动事件选择留作后续增强。

### 后续增强方向（TODO）

- 智能行动模拟：取 `getAvailableActions(state)` 第一个可用行动，调用其 handler 消耗 AP，AP 耗尽再 `endDay()`。
- 多策略对比：跑 N 局不同行动策略，对比资产曲线。
- 自动事件选择：拦截 `showModal` 时按策略选按钮 callback（而非 noop）。
- 与 `audit_connections.js` / `audit_events.js` 联动，输出事件覆盖率报告。
