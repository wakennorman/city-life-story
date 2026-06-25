# 城市浮生记 v3.8 断点续传审查：现状摸底

更新时间：2026-06-26

## 双轨架构覆盖范围

### legacy 正式入口

- 入口仍是 `src/index.html`，由 `python build.py` 生成 `dist/index.html`。这是当前玩家真正使用的版本。
- 运行时依赖 `src/index.html` 中 100+ 个 script 顺序加载，`src/js/app_bridge/webapp_runtime_bridge.js` 仍位于末尾，未重排旧脚本顺序。
- 真实状态来源是 `window.StateManager`。人生节点、医疗、旅行、法律、副业、社交网络、投资、创业、百科等核心系统仍在 `src/js/` 下运行。
- 旧核心体量很大：`startup.js`、`events_street.js`、`render.js`、`main.js`、`wiki.js` 仍是主要维护风险点。

### Vite + TypeScript 新架构

- 根目录 `index.html` + `package.json` + `vite.config.mjs` 构成并行 Web App 调试壳，产物输出到 `dist-webapp/`，不覆盖 legacy `dist/`。
- `src/app/core/` 只做 typed facade：`gameBridge.ts`、`stateAccess.ts`、`saveMigrations.ts` 不复制真实状态，只读写 legacy runtime。
- `src/app/data/` 已从占位目录变为真实类型化内容：cityServices、events、jobs、locations、items、diseases、legal、travel、lifeNodes 共 93 条目录记录。
- `src/app/ui/panels.ts` 和 `src/app/debug/healthCheck.ts` 只服务开发调试壳，玩家默认入口不会看到。

### bridge 层

- `src/js/app_bridge/webapp_runtime_bridge.js` 当前版本为 0.3.0，已暴露 `WebAppBridge`、7 个城市服务、推荐服务、TS 数据目录摘要和 `_webApp.schemaVersion=2` 存档元数据。
- `actions_extra.js` 通过 `addWebAppBridgeActions` 注入城市服务入口，`daily_pipeline.js` 通过 `webapp_city_services_tick` 处理次日反馈。
- bridge 仍未提供事件/职业/物品等 TS 数据自动注册到 legacy 的通用机制；当前主要承担城市服务与目录状态展示。

## 当前完成度

### 已完成

- TS 数据目录最低可用性已完成，并有 `npm run check:ts-data` 防止回退为空目录。
- 城市服务中心已从 3 项扩展到 7 项，并能写入 `_webApp` 后续状态。
- 4 大扩展系统基础玩法已在 legacy 中实现：人生节点有弹窗，医疗有医保和治疗摘要，旅行有 5 个目的地，法律有案件和律师流程。
- 旧入口仍保持可构建，脚本顺序边界清晰。

### 仍薄弱

- 4 大扩展系统没有常驻玩家面板。玩家只能通过地点行动或每日管线看到弹窗，无法主动查看人生节点、医保状态、旅行记录和案件进度。
- TS 数据目录虽然已填充，但大多数仍只是 typed source，没有进入旧游戏事件池或行动列表。
- bridge 的推荐能力没有足够玩家可见的承载面，`getRecommendedCityServices()` 已存在但曝光弱。
- 超大 legacy 文件仍未拆分，本轮不直接大拆，避免把 UI 可见性修复和架构重构混在一起。

## 初步判断

当前不是“项目不可用”，而是“新增系统可玩但不可见”。最优先的止血点是为人生节点、医疗、旅行、法律建立一个独立 Tab 面板，复用已有状态查询和弹窗入口，不迁移核心逻辑，不新建加载脚本，不触碰既有 script 顺序。这样能马上让玩家在旧正式入口看到新系统，同时为后续 TS 数据接入留下稳定展示位。
