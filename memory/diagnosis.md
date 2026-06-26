# 2026-06-26 问题诊断（第二轮 — 基于当前代码的实际扫描）

> 注意：上轮诊断中"虚拟币汇总为0""股票页串仓""投资中心缺少统一口径"等已在 `getInvestmentAssetSnapshot` 和 `renderStocks` 筛选逻辑中修复。本轮基于当前 `HEAD 5b2f662` 重新扫描。

## P0（不做则核心体验断裂）

### 1. 移动端 CSS 存在冗余隐藏 → 虽然被后续覆盖但仍为风险

- **文件**: `src/css/style.css` 第 3662-3665 行
- **判断**: `#street-stats-section` 和 `#corp-stats-section` 在第一段 `@media (max-width: 480px)` 中被 `display: none !important` 隐藏，第二段(第 4060 行)才用 `!important` 覆盖回来。虽然当前生效的是后者，但 `!important` 对抗本身是脆弱设计，CSS 顺序依赖过强
- **位置**: CSS 行 3662-3665 vs 4060-4062

### 2. 欢迎页胜利路线手机端拆词风险

- **文件**: `src/index.html` 第 142-149 行
- **判断**: 胜利路线使用 `<span class="victory-paths">` 包含多个 `<span>`，虽然 CSS 已有 `inline-flex` + `flex-wrap`，但"职场巅峰"这类 4 字词在极端窄屏下仍可能因 min-width 不够被拆开
- **位置**: index.html:142-149, style.css:3923-3931

### 3. 人生事务页展示开发态信息

- **文件**: `src/js/ui/render.js` 第 1458-1490 行
- **判断**: `_renderDataCatalogBridgeStatus()` 在 `renderLifeSystemsTab()` 中被调用（第 1511 行），玩家可见的"TypeScript 内容接入状态"不应出现在正式游戏入口
- **位置**: render.js:1458-1490

### 4. 事件记录手机端自动滚动不稳定

- **文件**: `src/js/main.js`
- **判断**: 事件记录展开后虽然已有 `requestAnimationFrame` 滚动，但在连续快速事件（如每日结算）中可能出现滚动不到位
- **位置**: mobile features 实现

## P1（体验明显提升）

### 5. 各投资子页持仓信息框不统一

- **文件**: `src/js/phase2/investment.js`
- **判断**: 贵金属(`renderPrecious`)和期货基金(`renderFutures`)使用了 `renderInvestmentHoldingPanel` 统一持仓框；但虚拟币页面没有独立的持仓汇总框，汽车页面持仓汇总与购买列表混合
- **位置**: investment.js:3015 (precious), 3141 (futures), 3530 (cars)

### 6. 百科部分条目偏薄

- **文件**: `src/js/ui/wiki.js`
- **判断**: 职业、地点等动态条目内容依赖数据源自动生成，但部分系统机制条目仍只有简要描述，缺少深度联动说明和玩家策略提示
- **位置**: wiki.js 第 3760 行

### 7. 创业/上班族事业入口仍不够直观

- **文件**: `src/js/ui/career_dev.js`, `src/js/ui/render.js`
- **判断**: "事业发展"Tab 已引入上班族+创业双路径，但创业门槛中"注册费减免条件"等关联未在界面上主动提示玩家
- **位置**: career_dev.js

### 8. 移动端投资卡片溢出

- **文件**: `src/js/phase2/investment.js`
- **判断**: 持仓行使用大量 `inline min-width` 固定值，在 320px 以下宽度可能横向溢出
- **位置**: investment.js 第 2687-2697 行（stock holdings row）

### 9. 总资产曲线数据仅记录当日汇总

- **文件**: `src/js/phase1/daily_pipeline.js` 第 336-349 行
- **判断**: `_cashHistory` 每天记录一次 snapshot，但只记录 `totalAssets`，缺少单个投资品类的分项历史数据来支撑"品类资产走势图"
- **位置**: daily_pipeline.js:336-349

## P2（锦上添花）

### 10. CSS 媒体查询重复冲突

- **文件**: `src/css/style.css`
- **判断**: 有 3 段 `@media (max-width: 480px)`，分散在第 3581/3923/3988 行，部分选择器在不同段中被重复覆盖，维护性差

### 11. 记忆文件与代码实况差距

- **文件**: `memory/overview.md`, `memory/diagnosis.md`, `memory/improvement_plan.md`
- **判断**: 上轮部分问题已被修复但 memory 文件未及时更新，导致后续工具可能做重复工作

### 12. 经济后期膨胀

- **文件**: `src/js/core/world_params.js`
- **判断**: 虽然已有 2%/天衰减和行业热度传导，但创业/投资后期仍可能出现资金滚动积累过快的场景
