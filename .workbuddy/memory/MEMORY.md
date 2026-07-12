# MEMORY — 城市浮生记 全系统优化循环

## 事件系统真实架构（覆盖指令描述的 3 文件模型已过期，勿盲从）

事件系统实际为 **三套子系统**，格式互不相同，均经全局 bundle 注入（非 ES import）：

- `src/js/data/moral_events.js` → `MORAL_EVENTS` 数组 + `MORAL_CONSEQUENCES` 对象
  - 事件: `{id,title,desc,minDay,dailyChance,condition?,choices:[{text,flag,score,immediate}]}`
  - 后果(按 flag key): `{id,title,delay:[min,max],desc,apply}`
  - 引擎 `triggerMoralEvent` 用 `evt.condition`(函数) 门控；未定义 condition 即不过滤。
- `src/js/data/news.js` → `NEWS_EVENTS` 数组，由 `news_system.js` 消费
  - `{id,headline,effects:{priceMod,investmentEffect,jobPenalty,jobMultiplier,duration},type,seasons?,followUpId?,followUpDelay?}`
  - `followUpId` 为**动态生成** id（news_system.js:1974 `id: news.followUpId`），非静态条目，勿当"缺失 id"误报。
- `src/js/core/events_core.js` → RANDOM_EVENTS 引擎（street/corporate 阶段事件）
  - 用 `triggers`(数据对象)/`conditions`(函数)/`trigger`(函数) 门控；`e.evaluateTriggers` 实现 minDay/minCash/minSkill/weather/phase 等。

## 覆盖指令关键事实（2026-07-12，最高优先级）

- 优先序 **B→D→F** 连续三轮，之后恢复 C→E→G→H→A…（覆盖"选薄弱域"逻辑）。
- 覆盖指令称"events.js/moral_events.js/news.js 三文件、旧文件已删"——**与现状不符**：旧文件（cross_system_events.js 等）仍存在，且真实格式非 `{id,title,desc,cond?,apply}`。注入新事件须用上述真实格式。
- 严禁重建已删除旧文件（cross_system_events.js 等）；旧 670 事件 id 不可从 git 还原。

## subsidy 专项结论（重要，勿反复尝试）

- `subsidy` 在 `c87666ce` 被**故意删除**（注释："与 training_subsidy 重复，保留 training_subsidy（效果更完整）"）。`training_subsidy` 当前存活。
- 32 锚定核心 id 中 `subsidy` 按设计缺失即正确；**不应还原**。
- 32 锚定 id 存活校验应以 moral_events.js + news.js 为准。

## 已确认的防御性字段（state.js）

- `s.trade` 恒初始化（state.js:156 + 修复 :722）；`s.relationships` 可能为空对象/undefined（访问须 `if(!s.relationships)`）。
- `reputation` 为顶层按地点 key 对象；`skills` 无 `writing`；`xiaoli/auntie_lin/master_zhao` 在 npcs.js 仍为 TODO。
- 有效 goods id 示例：water/snacks/vegetables/beer/scrap_metal/scrap_plastic/rice。
- 有效 investment：industry ∈ {科技,新能源,消费,金融,房地产,医药}；category ∈ {股票,贵金属,期货,虚拟币}；symbols 含 COPPER/NICKEL/ALUM/CL/NG。
- 有效 seasons：spring/summer/autumn/winter。

## 提交纪律（v3.0 SOP）

- 只动 `loop/auto`：`git checkout -B loop/auto`（基于当前 HEAD）；绝不向 main 提交/推送。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。
- 改事件文件后必须 `python build.py` 使 dist/index.html 比源新；提交时 `git add dist/index.html`。
- 只 `git add` 本轮具体文件 + `.claude/last_known_head`；绝不 `-A`/`--amend`。
- 每次代码改动更新 `src/DEVELOPMENT.md` 顶部版本行。
- MC 验证：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`（默认 10×1000d 易 OOM；6×400d 足以验 0 异常）。
