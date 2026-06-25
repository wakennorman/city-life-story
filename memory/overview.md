# 城市浮生记 v3.0 审查改进与扩展：现状摸底

更新时间：2026-06-25

## 核心系统与模块

- 项目形态：纯 HTML5 + CSS + Vanilla JS 单页游戏；入口为 `src/index.html`，构建由 `python build.py` 打包到 `dist/index.html`。没有 README，项目约定主要在 `CLAUDE.md`、`src/DEVELOPMENT.md` 与 `memory/review-improve-v3.0.md`。
- 加载方式：所有 JS 通过 `src/index.html` 中的 `<script>` 顺序加载；项目明确禁止随意改变 script 顺序。整体依赖全局函数/全局对象，不使用模块打包。
- 状态系统：`src/js/core/state.js` 是唯一状态源，`StateManager`/Proxy 脏标记驱动渲染。默认状态覆盖玩家、资源、需求、关系、投资、扩展系统等。
- 每日结算：`src/js/phase1/daily_pipeline.js` 用 `DAILY_PIPELINE` 声明式编排每日步骤，已接入需求衰减、财富开销、家庭、NPC、节日、新闻、故事章节、副业、人生节点、医疗、旅行、法律等 tick。
- 事件系统：`events_core.js` 提供事件队列与触发逻辑；`events_street.js`、`events_corp.js` 持有大量事件数据并自动推入 `RANDOM_EVENTS`。
- 内容数据：`data/` 存放地点、工作、商品、NPC、新闻、剧本、道德事件、注册表等。`mechanics_registry.js` / `narratives_registry.js` / `victories_registry.js` 支撑百科审计。
- UI 系统：`ui/render.js` 是主渲染调度器，`corp_ui.js`、`modal.js`、`wiki.js`、`social_tab.js`、`career_dev.js`、`daily_focus.js` 等负责专项页面或弹窗。
- 经济与成长：`phase2/investment.js`、`property_market.js`、`stock.js`、`startup.js`、`corp_ops.js`、`personal_growth.js`、`side_hustle.js` 负责投资、房产、创业、职场、副业等中后期玩法。
- 新扩展系统：`core/life_nodes.js`、`medical.js`、`travel.js`、`legal.js` 已完成 v1 数据/逻辑层；均暴露全局函数，并接入 `daily_pipeline.js`，部分在 `main.js` 初始化。
- 长期/留存系统：`inheritance_chain.js`、`multi_run_memory.js`、`heritage_coin.js`、`life_ribbon.js`、`story_chapters.js`、`enterprise_fate.js` 提供 NG+、传承币、缎带、章节、企业命运等长期目标。

## 当前完成度

- `IMPLEMENTATION_PROGRESS.md` 显示 v3.7 当前任务 0-7 全部标记完成：P0 副业/经济/开支/链式事件、P1 新闻投资 UI、NPC 好感、家庭系统、35 岁追访、P2 道德事件扩充、社交网络 UI、旅行/医疗/法律/人生节点扩展系统。
- `CLAUDE.md` 最新状态显示：v3.7 Expansion v1 已做本地 HTTP + Chrome DevTools 冒烟测试，桌面/移动首屏加载正常，入口按钮可进入游戏主界面；新增百科注册字段已修复并 `python build.py`。
- `src/DEVELOPMENT.md` 记录最近一次验证：`checkLifeNodes`、`tickMedical`、`tickTravel`、`tickLegal` 等新增函数存在，MECHANICS/NARRATIVES 注册通过；剩余 AudioContext 自动播放警告属于浏览器策略。
- 代码规模很大：`main.js` 4148 行、`ui/render.js` 6024 行、`events_street.js` 9827 行、`phase2/startup.js` 14277 行，是主要复杂度来源。新模块多数保持几百行，但部分旧核心仍高度集中。
- 当前项目不是“基础未完成”，而是“内容和系统很多，正在做深度联动、UI承载、平衡与长期留存打磨”的阶段。

## 初步薄弱、异常或缺失

- 架构薄弱点：`main.js`、`render.js`、`events_street.js`、`startup.js` 仍是超大文件，SOP 也明确把拆分/剥离列为已知问题；继续扩展时容易出现全局函数耦合和重复定义。
- UI承载风险：新增医疗、旅行、法律、人生节点等系统已接入每日管线，但独立面板/弹窗/玩家主动入口仍需要确认。`CLAUDE.md` 已点名医疗 UI、人生节点弹窗、旅行定制、法律事件链为待深化方向。
- 联动深度风险：很多系统已经能独立 tick，但跨系统因果链是否足够强还需诊断，例如法律败诉后果、医疗费用对经济压力、旅行与 NPC/事业/回忆、人生节点与长期路线。
- 数据平衡风险：经济系统已多轮调参，但投资、房产、创业、副业、后期开支、医疗/法律大额支出之间可能仍存在后期资金压力不足或单一策略过强。
- 体验风险：Tab 和侧栏内容越来越多，SOP 已提醒信息层级过载与“今天该做什么”视觉锚点；需要检查 `daily_focus.js` 是否足够显眼并覆盖新增系统。
- 文档状态风险：`CLAUDE.md` 的接力清单仍残留一些已完成 P1/P2 项，而 `IMPLEMENTATION_PROGRESS.md` 显示已完成；需要在实装后把当前状态整理成一致口径。
