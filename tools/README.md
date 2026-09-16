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

> **状态更新**：上述 TODO 已在 Node 侧的 `tests/monte_carlo.cjs` 落地（智能行动模拟 / 6 策略对比 / 自动事件选择），
> 本浏览器端脚本保留作为「真实 DOM 环境下的轻量验收」用途。

## mem_probe.cjs — 无头运行器内存 / 泄漏诊断工具集

**背景**：`tests/monte_carlo.cjs` 曾在大参数（`20 局 × 500 天`）下 OOM。
定位过程发现真凶是 `headless_runner.cjs` 的 **DOM 存根单例跨局累积**
（`document.body.children` 只 push 不清理，每局约 +120 个元素）。
本工具把当时的 5 个一次性探针固化为可复用子命令。

### 用法

```bash
node --expose-gc tools/mem_probe.cjs <子命令> [--trials N] [--days N] [--strategy <名>]
```

| 子命令 | 作用 | 典型判读 |
|--------|------|----------|
| `gc`   | 强制 GC 后采样堆增长 | gc 后仍线性增长 = **真泄漏**；增长消失 = 仅堆压力 |
| `ref`  | WeakRef 检验旧局 state 是否被回收 | 有存活 = 存在引用持有者；全回收 = 泄漏在运行器侧 |
| `deep` | 递归扫描 state 容器增长 Top 25 | 定位无上限容器（如 `_newsPopupSeen` / `rumorHistory`） |
| `dom`  | 两阶段对照 body.children 累积 | A 阶段升 / B 阶段稳 = `resetDom()` 生效 |
| `save` | 存档 JSON 体积 + 无上限容器计数 | 存档 9 倍膨胀类问题的量化 |
| `all`  | 依次跑 `gc` / `ref` / `dom` | 常规体检 |

**注意**：`gc` / `ref` / `dom` 的判定依赖 `--expose-gc`，不加则结论不可用（工具会提示）。
`deep` / `save` 为单局长跑，观察同一 state 内的累积，不需要 GC。
