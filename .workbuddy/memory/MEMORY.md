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

## 职业系统真实架构（2026-07-13 重要，防脱钩）

- 玩家职业线的**真实入口**是 `src/js/data/career_dev.js` 的 `CAREER_PATHS`（10 路径 × 42 职位，已含互联网/IT 线，终极目标 P5→P10）。
- **不要另起平行职业系统**：往 `SKILL_BRANCHES`(coding) 加职业分支、往 `STREET_JOBS` 加自由工作、往 `CORP_ACTIONS` 加公司行为、往 `cross_system_events.js` 加职业事件——这些会和 CAREER_PATHS 脱钩，变成孤儿内容（已踩过一次坑，见 2026-07-13 回滚）。
- 扩展职业内容应接入 `CAREER_PATHS` 体系，而非造第二套。
- 公司行为若复用 `corp.risk` 作 tech debt，须确认它落在 CAREER_PATHS 的公司职业链内。

## NPC/社交系统真实架构（2026-07-14 R8 域D，重要）

- 关系引擎入口 `src/js/core/npc_relationships.js`：`tickNpcRelationships` 由 `daily_pipeline.js` npc_relationships_tick slot 每日调用。含 14×14 关系矩阵 + 传播矩阵 + 好感衰减（7天无互动）。
- **R8 已修死代码**：`checkNpcRelationEventTriggers`（triangular_choice/old_friend_reaction 触发）此前无任何消费者→关系事件链永不触发，已接入 `runNpcRelationChainEvents`（tick 末尾，14天冷却）。
- **仍为死代码**：`getNpcRelationshipNetwork(state)`（社交 Tab 关系网渲染）无 caller，属域 F UI。R9 未接入此函数，而是直接在 `renderNpcRelationships` 追加「圈子归属感概览+激活进度」桥接 R8 机制（F→D）。该函数仍待接。
- **UI 安全区/动态视口（R9 域F，重要）**：根 `#app` 已 `100vh`→`100dvh`（地址栏遮挡修复）；`index.html` viewport 已加 `viewport-fit=cover`；`#tab-bar`/`#mobile-hud` 有 `padding-top: env(safe-area-inset-top)`；`.world-news-panel` 移动端有 `padding-bottom: env(safe-area-inset-bottom)`。改移动端 UI 勿回退这些。
- NPC id→中文名 helper：R8 新增 `getNpcDisplayName(npcId)`（读全局 `NPCS`）。禁止再用 `id.replace(/_/g," ")` 直显（输出 "aunt wang" 之类）。
- 守卫铁律：引用 NPC 须 `rel && rel.met && (rel.affinity||0)>=N`；只读 `state.relationships`，绝不读 `state.npcRelationships`。跨 NPC 传导用 `applyAffinityChange`（自动 clamp + 记 _lastInteractionDay）；message 需 `typeof StateManager !== "undefined"` 守卫。

## 「日常开发」/ scene#15 不是真实游戏内容（2026-07-13）

- 全代码库（含设计文档）搜不到「日常开发」一词；它是对 `@scene#15:"日常开发"` 指令的**误读**，并非游戏内场景或职业。
- 收到模糊 scene/主题指令时，**先 grep 确认它是否真实存在**，再动手；用户一句「无关」即最高优先级终止信号，立刻停手确认方向，不要辩解或继续。

## 提交纪律（v3.0 SOP）

- 只动 `loop/auto`：`git checkout -B loop/auto`（基于当前 HEAD）；绝不向 main 提交/推送。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。
- 改事件文件后必须 `python build.py` 使 dist/index.html 比源新；提交时 `git add dist/index.html`。
- 只 `git add` 本轮具体文件 + `.claude/last_known_head`；绝不 `-A`/`--amend`。
- 每次代码改动更新 `src/DEVELOPMENT.md` 顶部版本行。
- MC 验证：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`（默认 10×1000d 易 OOM；6×400d 足以验 0 异常）。
