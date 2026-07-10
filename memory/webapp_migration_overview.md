# 城市浮生记 v3.0+ Web App 迁移现状复盘

更新时间：2026-06-25

## 第一阶段落地状态

- 已新增根目录 Vite/TypeScript 工程：`index.html`、`package.json`、`tsconfig.json`、`vite.config.mjs`，Vite 产物输出到 `dist-webapp/`，不覆盖 legacy `dist/`。
- 已新增 `src/app/`：包含 app shell、typed data catalogs、bridge facade、save migration、health check 和 UI panel。
- 已新增 legacy bridge：`src/js/app_bridge/webapp_runtime_bridge.js`，并在 `src/index.html` 末尾追加脚本；未重排旧 script。
- 已通过 `actions_extra.js` 接入“城市服务中心”，提供劳动争议预检、医保账单复核、周末城市微旅行 3 个真实状态变化。
- 已通过 `daily_pipeline.js` 接入 `webapp_city_services_tick`，服务使用后的次日会沉淀为 `legal.caseConfidence`、`medical.costAwareness`、`travel.localFamiliarity` 等后续状态。
- 已新增 `_webApp.schemaVersion` 存档元数据；当前版本为 `2`，作为新架构迁移字段的独立边界。

后续开发提醒：新增内容优先进入 `src/app/data/*` 和对应 service/facade；只有需要立刻进入当前可玩 legacy 版本时，才在 `src/js/app_bridge/` 或旧行动/管线中接线。不要把 Vite shell 直接替换为正式入口。

## 目标和边界

本轮目标不是把现有网页包一层新壳，而是为长期扩展建立可验证、可逐步迁移的 Web Simulation Game / SPA Web Game 架构。现阶段必须保留 `src/index.html`、既有全局脚本加载、`python build.py` 单文件构建、已有存档格式和当前可玩体验；新增 Vite/TypeScript 作为并行开发链路，先用桥接方式接入真实游戏功能。

## 当前核心系统清单

- 状态系统：`src/js/core/state.js` 提供 `createDefaultState()` 与 `StateManager` 单例，使用 Proxy/dirty flag 驱动渲染；存档导入时在 `StateManager.importState()` 内执行大量兼容迁移。
- 存档系统：`src/js/core/save.js` 基于 localStorage，多槽位键为 `city_life_story_slot_N`，自动档为 `city_life_story_autosave`，索引为 `city_life_story_index`；存档数据是完整 state JSON。
- 每日管线：`src/js/phase1/daily_pipeline.js` 用 `DAILY_PIPELINE` 编排每日 tick，已接入需求、住房、健康、新闻、节日、NPC、家庭、副业、人生节点、医疗、旅行、法律等系统。
- 事件系统：`events_core.js` 负责事件队列和触发，`events_street.js` / `events_corp.js` 持有大量事件数据，`moral_events.js` 等数据文件继续扩展叙事池。
- 城市与行动系统：`locations.js`、`jobs.js`、`actions_extra.js`、`main.js::getAvailableActions` 共同决定地点、工作、生活行动和玩家入口。
- UI 系统：`ui/render.js` 是主渲染器和 Tab 注册中心，`modal.js`、`corp_ui.js`、`social_tab.js`、`career_dev.js`、`wiki.js` 等承担专项 UI。
- 经济成长系统：投资、房产、股票、创业、职场、副业、个人成长、企业命运、多周目继承均已存在，且多个文件体量很大。
- 百科注册表：`mechanics_registry.js` / `narratives_registry.js` / `victories_registry.js` 是新增机制的文档和自检入口。

## 当前入口、构建、脚本加载方式

- 开发入口：`src/index.html`。
- 部署/分发入口：`dist/index.html`，由 `python build.py` 将 CSS/JS 内联生成。
- 脚本加载：全部通过 `src/index.html` 中 `<script src="...">` 按顺序加载。项目文档明确禁止改变既有 script 顺序。
- v3.8 起已有根目录 `package.json`，用于 Vite/TypeScript 开发链路；仍没有根目录 README / AGENTS.md。项目规则主要在 `CLAUDE.md`、`IMPLEMENTATION_PROGRESS.md`、`src/DEVELOPMENT.md` 和 `memory/`。

## 当前全局对象和状态来源

- 状态入口：`window.StateManager`。
- 存档入口：`saveGame`、`loadGame`、`autoSave`、`importSave` 等挂到 `window`。
- UI/流程入口：`startClassicGame`、`startNewGame`、`switchTab`、`renderAll`、`showModal` 等全局函数。
- 数据入口：`LOCATIONS`、`STREET_JOBS`、`GOODS`、`ITEMS`、`NPCS`、`MECHANICS`、`NARRATIVES` 等全局常量。
- 风险点：全局函数和数据之间没有 import/export 边界，新增内容需要同时记住数据、入口、管线、百科和 script 注册，入口遗漏风险高。

## 当前存档结构和兼容风险

- 当前默认 state 版本为 `1.1.0`，导入后会被迁移到 `1.9.0`。
- 迁移逻辑集中在 `StateManager.importState()`，包括关系、疾病、创业、内幕交易、企业命运、链式事件、世界参数、交易情报、NPC 发现字段等。
- 风险一：后续迁移继续塞进 `state.js` 会让状态层越来越难审计。
- 风险二：新增系统常直接写 `state.<feature>`，如果缺少统一迁移函数，旧档读入时容易出现 undefined。
- 风险三：存档版本号只记录 state 版本，没有独立的 app/schema 版本和可测试迁移表。

## 当前最适合先迁移的模块

- 状态访问层：先封装 `StateManager.getState()`、消息、渲染、行动注册，不改变旧状态对象。
- 存档版本层：新增独立 save schema 版本和迁移函数，先作为桥接服务运行，不立即移动旧迁移。
- 数据配置层：先从 events / jobs / locations / items / diseases / legal / travel / lifeNodes 建立 TypeScript 数据目录和校验脚本。
- 新增系统入口层：通过 legacy bridge 向旧行动列表注入真实可点击行动，验证新数据和旧 UI/状态能协作。
- 调试/验证层：增加轻量 health check、类型检查、构建脚本，不改变 `python build.py` 的正式产物。

## 当前不宜立刻重写的模块

- `src/js/main.js`：承担新游戏、剧本、沙盒、行动生成、AP 消耗、日终流程等多职能；直接搬迁风险太高。
- `src/js/ui/render.js`：Tab、主 UI、库存、交易、成长、家庭、职场等高度集中；先只接新入口，不做视觉大改。
- `src/js/core/events_street.js` 与 `src/js/phase2/startup.js`：体量超大，适合后续按主题渐进拆分，不适合本轮整体迁移。
- `src/index.html` 既有 script 顺序：只能追加桥接脚本，不重排旧脚本。
- 已有 localStorage 存档键：必须继续兼容，不改键名、不改旧档读写路径。

## 参考研究落地结论

- BitLife 的价值在“每个选择叠加到人生结果”，对应本项目应强化事件后果链、存档快照和人生节点选择，而不是只堆事件数量。参考：[BitLife Google Play](https://play.google.com/store/apps/details?hl=en_US&id=com.candywriter.bitlife)。
- 《中国式家长》的价值在“阶段节点、考试压力、活动分配、关系成长”，对应本项目应把人生节点和技能树纳入统一 milestone 数据。参考：[Chinese Parents App Store](https://apps.apple.com/fr/app/chinese-parents/id1471107490?l=en-GB)。
- 《This War of Mine》和《Papers, Please》的价值在“资源短缺下没有纯好选项”，对应本项目应在医疗、法律、债务、工作压力中建立可追踪的代价。参考：[Papers, Please](https://papersplea.se/) 与 [This War of Mine 研究摘要](https://journals.sagepub.com/doi/10.1177/1555412017725996)。
- Game Dev Tycoon / Startup Company 的价值在“成长曲线和资金出口”，对应创业系统应保留现金流、员工、技术债、服务器/产品效率这类长期消耗。参考：[Game Dev Tycoon](https://www.greenheartgames.com/app/game-dev-tycoon/) 与 [Startup Company](https://www.startupcompanygame.com/)。
- 现实系统侧，职业、医疗、法律、住房都适合被抽象成“资格/成本/风险/保障/后果”五字段。参考：[BLS Occupational Outlook Handbook](https://www.bls.gov/ooh/)、[HealthCare.gov 总医疗成本](https://www.healthcare.gov/choose-a-plan/your-total-costs/)、[USA.gov legal aid](https://www.usa.gov/legal-aid)、[CFPB housing budget](https://www.consumerfinance.gov/owning-a-home/prepare/figure-out-how-much-you-want-to-spend/)。

## Web App 目标架构草图

```text
Vite dev shell / src/app
  app shell
  ui panels
  game services
  typed data catalogs
  debug checks
      |
      | bridge adapter
      v
Legacy runtime / src/index.html
  global StateManager
  existing data globals
  existing render/modal/actions
  python build.py -> dist/index.html
```

第一阶段只新增并行架构和桥接层：新系统从 `src/app` 建模与验证，旧游戏仍负责正式渲染和存档；桥接层只把已验证的新玩法入口接入旧行动列表。
