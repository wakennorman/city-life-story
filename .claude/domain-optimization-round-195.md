# 全系统优化 Round 195 — 域E（经济/投资）

日期：2026-07-25 · 自动化触发 · nextDomain=E（recency 185 最薄弱）

## 一、修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/phase2/investment_analysis.js（接线于 domain_e_linkage_r195.js） | 止损止盈整链死机制：`checkStopLoss`/`setStopLoss`/`analyzeStockTechnicals`/`analyzePortfolio`/`calculateSharpeRatio`/`getMarketSentimentIndicator` 六函数全库无调用方（同文件 getNewsEffectForBtc 等有调用，反证非误报）。止损单 `inv.stopLossOrders` 永不被创建/评估，setStopLoss→stopLossOrders→checkStopLoss→sellInvStock 整链死代码 | 因 daily_pipeline.js / investment.js 均为并行在途文件（财务Tab开发中）不可碰，在新文件以**包装全局 `tickInvestmentDaily`** 方式接线：每日投资 tick 后、且仅当存在止损单时调用 `checkStopLoss(state)`；try/catch 保证异常不中断每日结算。`setStopLoss`/`analyzeStockTechnicals` 经联动事件复活（见下）。`analyzePortfolio` 等 3 个纯 UI 分析函数待域F轮接入投资Tab（C类记录，本轮不碰在途 UI 文件） | A |

C类记录（不改）：`analyzePortfolio`/`calculateSharpeRatio`/`getMarketSentimentIndicator` 仍无 UI 渲染入口——接入点在投资 Tab（render/investment.js，并行在途），留待域F轮或财务Tab合流后处理。

## 二、增强清单

| 新增内容 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| `invest_r195_stoploss_advisor` 券商客户经理回访电话，引导给最大持仓挂 10% 固定止损单（真实调用 setStopLoss，threshold 取 STOP_LOSS_STRATEGIES 合法档位） | domain_e_linkage_r195.js (street) | E→F | 新玩法引导：复活 setStopLoss 唯一入口，损失厌恶心理学包装 |
| `invest_r195_stoploss_discipline` 止损单真实触发后复盘，「亏损不与自己较劲」纪律体悟（mental+5/happiness+3） | domain_e_linkage_r195.js (street) | E→G | 峰终定律：把止损的痛点转化为成长叙事；首个消费 checkStopLoss 写入的 order.triggered |
| `invest_r195_technical_review` 深夜技术面复盘，真实调用 analyzeStockTechnicals 产出「趋势+评级」摘要 + addSkillXp("accounting",8) | domain_e_linkage_r195.js (corporate) | E→C | 复活技术分析死函数并让投资经验反哺职业技能 |

## 三、验证

- `node --check` domain_e_linkage_r195.js 通过。
- `python build.py` → dist/app.js 9114.6KB，`_domainELinkageR195Loaded` 已入 bundle。
- MC `--trials 6 --days 400`：0 代码异常（见提交信息）。

## 四、工程要点（可复用模式）

- **包装全局函数接线**：daily_pipeline.js:615 `tickInvestmentDaily(state)` 按名解析全局绑定 → 晚加载文件 `tickInvestmentDaily = wrapper` 即生效，无需改在途文件。注册序须在 investment_analysis.js(:836) 之后。
- 并行在途文件（index.html 财务Tab按钮/investment.js tradeLog/render*/state.js 等 11 文件）以 `git stash push -- <paths>` 隔离，push 后 pop 还原。
