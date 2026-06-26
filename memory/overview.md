# 2026-06-26 现状摸底：城市浮生记审查改进与扩展

## 双轨架构覆盖

- `src/index.html` 是当前正式可玩入口，使用原生 HTML/CSS/Vanilla JS，依赖 `python build.py` 生成 `dist/index.html`。主 UI、存档、行动、交易、投资、事业、社交、人生事务等玩家实际流程仍由 legacy 脚本驱动。
- 根目录 `index.html` + `src/app/` + Vite/TypeScript 是 v3.8 并行架构壳，默认作为调试和迁移通道，不替代正式入口。`src/app/shell/appShell.ts` 只挂载调试面板和 legacy iframe。
- `src/app/data/*` 已有事件、职业、地点、物品、疾病、法律、旅行、人生节点和城市服务等类型化目录；当前多数目录仍是 typed 数据源，真正可玩接入主要靠 `src/js/app_bridge/webapp_runtime_bridge.js` 的城市服务桥接。
- `StateManager` 仍是唯一真实状态来源。TS facade 只读写 legacy 全局状态，不复制存档结构；存档键继续兼容旧版。

## 当前完成度

- legacy 内容量很大：投资系统已经拥有股票、虚拟币、贵金属、期货/基金、房产、汽车数据和交易入口；人生事务面板也已接入医疗、旅行、法律、人生节点。
- 移动端 CSS 已在 `src/css/style.css` 文件末尾追加过适配，但上一轮为“减少遮挡”隐藏了部分 header/sidebar 内容，违反本轮“手机端不阉割任何电脑端 UI，只允许折叠或滑动收纳”的原则。
- 开始页胜利路线文案仍是普通连续文本，`word-break: keep-all` 不能保证“职场巅峰”这类词组不被浏览器在狭窄宽度中硬断。
- 投资系统的交易层共用 `investment.stockHoldings`，但汇总层仍把虚拟币按旧 `btcHoldings` 统计，股票页持仓也未按类别过滤，导致买虚拟币后投资中心为 0、虚拟币出现在股票持仓。

## 初步薄弱点

- P0：投资资产缺少统一估值/盈亏口径，`renderInvestmentTab`、各子页、总资产曲线/简报各自计算，容易漏掉虚拟币、贵金属、期货基金、汽车。
- P0：移动端“不可隐藏 UI 内容”的产品原则未文档化，CSS 仍隐藏 `header-actions`、街头属性、职场属性等核心内容。
- P0：事件记录在手机端固定底部阅读体验差，最底部记录需要手按屏幕维持滚动，应改为可折叠/展开且展开后内部滚动。
- P1：人生事务页把“TypeScript 内容接入状态”展示给玩家，属于开发态信息泄漏，应从 legacy 玩家 UI 移除。
- P1：双轨架构接入状态已有 TS 调试面板可看，不应在正式 legacy 面板重复暴露。
