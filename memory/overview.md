# 2026-06-26 现状摸底：城市浮生记审查改进与扩展（第三轮）

## 双轨架构覆盖

### legacy 侧（正式玩家入口）

- **入口与构建**：`src/index.html` 仍是正式可玩入口，按 `<script>` 顺序加载约 80+ 个 legacy 脚本；`python build.py` 打包到 `dist/index.html`。
- **数据层**：`src/js/data/` 继续承载旧正式入口的主要运行数据，包括地点、职业、商品、装备、新闻、技能、NPC、场景、公司、设施、疾病、道德事件、机制/叙事/胜利注册表等。
- **核心层**：`src/js/core/` 承载状态、存档、事件、天气、节日、梦想、成就、技能树、社交网络、NPC 关系、时代变迁、世界参数、人生节点、医疗、旅行、法律、企业命运、多周目继承、装备品质/耐久/套装等。
- **Phase1/Phase2**：`phase1/` 负责行动、交易、需求、疾病、每日管线、地点行动、NPC 桥接；`phase2/` 负责职场、投资、房产、创业、家庭、个人成长、副业等。
- **UI 层**：`src/js/ui/render.js` 是主 UI 与 Tab 注册中心；`career_dev.js`、`social_tab.js`、`daily_report.js`、`wiki.js`、`modal.js` 等分担子页面和弹窗。
- **bridge 层**：`src/js/app_bridge/webapp_runtime_bridge.js` 在 `src/index.html` 末尾追加加载，向 legacy 行动列表注入城市服务中心，并写入 `_webApp.schemaVersion=2` 元数据。

### Vite + TypeScript 新架构侧

- **入口与构建**：根目录 `index.html` + `src/app/main.ts` + `vite.config.mjs`，`npm run build` 输出 `dist-webapp/`。默认重定向到 legacy 玩家入口，只有 `?debug=1` / `#debug` 显示开发调试壳。
- **Shell/UI**：`src/app/shell/appShell.ts` 渲染调试面板和 iframe；`src/app/ui/panels.ts` 显示架构健康、内容目录和城市服务。
- **Facade**：`src/app/core/gameBridge.ts`、`stateAccess.ts`、`saveMigrations.ts` 只封装读取和迁移，不复制真实状态；真实状态仍来自 `window.StateManager`。
- **TS 数据目录**：`src/app/data/` 已有 cityServices(7)、events(12)、jobs(12)、locations(14)、items(17)、diseases(12)、legal(7)、travel(8)、lifeNodes(4)，并由 `src/app/data/index.ts` 汇总 catalog。

## 当前完成度

- **已完成**：v3.8 双轨架构壳已存在；legacy 四大扩展系统（人生节点/医疗/旅行/法律）有每日管线和人生事务 Tab；城市服务 bridge 可在政府/医院/商业区/公园/银行等地点触发并产生后续反馈；TS 数据目录不再是空壳；`npm run check:ts-data` 可审计最低覆盖。
- **仍在迁移中**：TS 目录多数是类型化内容池，真正进入旧游戏的只有城市服务和部分摘要；事件、职业、物品、疾病、法律、旅行的 TS 数据没有统一执行器或同步生成流程，仍需手动在 legacy 层维护一套。
- **UI 状态**：移动端底部抽屉、横向 Tab、事件记录收起预览已经落地；人生事务 Tab 已可见，但部分措辞仍暴露 Web App/bridge 开发概念。
- **文档状态**：`CLAUDE.md` 与 `src/DEVELOPMENT.md` 记录了第二轮审查和最新验证；memory 三件套存在但部分内容已落后于当前源码。

## 初步薄弱点/异常

1. **CSS 存在结构性错误**：`src/css/style.css` 约 3907 行提前闭合 `@media (max-width: 480px)`，后续投资持仓移动端规则缩进在媒体查询外，且 3933 行出现多余 `}`；这会影响 `npm run build` / CSS 解析稳定性，属于当前最明显 P0。
2. **TS 内容目录与 legacy 大量断连**：`events/jobs/items/diseases/legal/travel` 多为 typed catalog，旧游戏正式入口不会自动消费；新增内容若只写 TS 目录，玩家不可见。
3. **城市服务弹窗按钮未预先禁用**：`showCityServiceModal()` 展示服务列表，但按钮不显示现金/行动力不足原因，点击后才提示；和“不可用行动灰显并显示条件”的长期规则不一致。
4. **医疗入口窄**：人生事务医疗卡按钮实际只打开医保购买，`startTreatment()` 没有同一入口；生病时卡片提示“建议看病”，但按钮文案是“医保咨询”，容易断裂。
5. **开发术语残留**：人生事务说明和城市服务行动描述仍出现 “Web App / bridge / 新架构”等开发术语，不适合正式玩家入口。
6. **移动端事件日志滚动仍可加强**：已用 `requestAnimationFrame` 滚动一次，但连续消息批量写入后只在 render 时赋值 `scrollTop`，没有稳态二次滚动或复用函数。
