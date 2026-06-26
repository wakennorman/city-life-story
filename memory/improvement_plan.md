# 2026-06-26 改进方案

开始页词组断裂 | `src/index.html`, `src/css/style.css` | legacy UI + CSS | 将胜利路线改成独立 `.victory-paths`/`.victory-path` 片段，CSS 用 inline-flex/flex-wrap 让整条路线作为不可拆词组换行 | ~35行 | “职场巅峰”整体换行，不再拆字 | <=480px 两列/单列自然换行，首屏文案更稳定
投资统一估值口径 | `src/js/phase2/investment.js` | legacy 投资层 | 新增 `getInvestmentAssetSnapshot()`、`getInvestmentHoldingCategory()`、`renderInvestmentHoldingPanel()`，统一计算各类资产市值、成本、数量、盈亏 | ~180行 | 虚拟币/贵金属/期货基金/股票/房产/汽车都用同一套统计 | 持仓信息框添加 class，手机端可横向滚动不溢出页面
修复投资中心汇总 | `src/js/phase2/investment.js` | legacy 投资 UI | `renderInvestmentTab()` 改读统一 snapshot，标题显示投资资产总市值、总盈亏、纳入现金存款后的总资产 | ~40行 | 分类数量、市值、盈亏和整体盈亏准确 | 小卡片 flex-wrap，<=480px 自动两列/单列
修复股票页串仓 | `src/js/phase2/investment.js` | legacy 投资 UI | `renderStocks()` 只显示 `category === "股票"` 的持仓；虚拟币/贵金属/期货基金页分别插入自身持仓信息框 | ~60行 | 买虚拟币不会出现在股票持仓，其他品类也能看到自己的明细 | 明细框内部滚动，按钮保留 44px 触控
补全总资产统计 | `src/js/phase1/daily_pipeline.js`, `src/js/ui/render.js`, `src/js/ui/data_viz.js`, `src/js/core/life_ribbon.js` | legacy 共享统计 | 有 `getInvestmentAssetSnapshot` 时纳入全部投资资产，否则保留旧现金/存款兜底 | ~50行 | 成长页、曲线、人生结算总资产不再漏投资品 | 无额外 UI，仅数值更准确
事件记录折叠 | `src/index.html`, `src/js/main.js`, `src/css/style.css` | legacy UI + CSS | 给事件记录标题加按钮，新增 `toggleMessageLog()`；手机端默认折叠，展开后限制高度并内部滚动，桌面默认展开 | ~70行 | 手机端不用拖住屏幕看最后一条记录 | <=480px 有明确“展开/收起”按钮，日志不压住主内容
移动端不阉割 UI | `src/css/style.css` | CSS | 追加覆盖：手机端不隐藏属性/今日重点/header-actions/header-context/mode-stat；改为横向滚动、抽屉内分组和紧凑排版 | ~90行 | 手机端和桌面端信息一致，只是折叠/滚动收纳 | <=480px 无横向页面溢出，侧栏内容可完整滚动
隐藏玩家不可见开发状态 | `src/js/ui/render.js` | legacy UI | `renderLifeSystemsTab()` 移除 `_renderDataCatalogBridgeStatus()` 调用，保留 TS 调试面板在 Vite 壳中 | ~1行 | 人生事务不再出现 TypeScript 接入状态 | 无移动端风险
文档和记忆更新 | `IMPLEMENTATION_PROGRESS.md`, `CLAUDE.md`, `src/DEVELOPMENT.md`, `memory/long_term_lessons.md` | 文档 | 记录本轮修复、核心原则和验证命令 | ~80行 | 下个接手者知道移动端不能删 UI、投资统计口径统一 | 明确后续 CSS 只追加不破坏已有布局
