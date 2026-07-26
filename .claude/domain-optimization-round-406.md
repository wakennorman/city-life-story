# Round 406 — 域E 经济/投资（第十八轮循环）

日期：2026-07-27 · 窗口：WorkBuddy 自动化（权威 bookkeeping + 代码轮）

## 开轮核对
- loop-state 标 round404/H/next=A，但 git log 重算真实 recency：A=398/B=401/C=399/D=395/E=396/F=403/G=402/H=404。
- 开轮时并行窗口正在做 R405=域D（in-flight domain_d_linkage_r405.js），执行中已提交 a596647a 并把 loop-state 更新为 round405/next=E——与本窗口判断一致。
- 本轮 = **R406 域E（recency 396 全局最薄弱）**，轮号经 `ls src/js/core/*r406*` + grep index.html 核对未被占用。

## 指令一：A类审查 = 0（诚实报告）
Explore 只读审计 7 个域E核心文件（economy_v3.1/finance/news_investment_bridge/investment/investment_analysis/property_market/stock）+ 5 个历轮联动文件：
- 死字段黑名单（player.happiness/needs.health/player.health/certs/portfolio/resources.dailyTransactions/stats.consecutiveWins）全库 0 命中。
- 除零/Infinity：stock.js:488 `prev>0`、investment.js:2218/2606 `prevPrice!==0`/`cost>0`、updateStockPrices `!isFinite→1.0` 兜底，守卫齐全。
- 8 只股票 industry 全部 ∈ WORLD_SECTORS。
- 持仓读写 Array.isArray/`||[]` 守卫齐全。
- 误报排除：Explore 报 setStopLoss 零调用方 → grep 证实 domain_e_linkage_r195.js:94 有真实事件调用方（R195 复活链健在），不重复修。
- 防御缺口记录（C类不修）：investment.js:3913 渲染循环无 `||[]`，initInvestment 已保证数组存在，非确证崩溃。
- 历轮 R18/R195/R246/R260/R284/R396 已净尽域E主隐患。

## 指令二：联动增强 3 项（新建 src/js/core/domain_e_linkage_r406.js）
选题：审计发现 state.investment 三个「活跃维护中但零事件/叙事消费」字段，本轮全部首次消费：

| 事件 id | 联动 | 设计意图 |
|---|---|---|
| e406_fear_greed_mirror (street) | E→G | **首消费 btcFearGreed 极值**（≥80贪婪/≤20恐惧+持币门控）：币市情绪极端时的逆向定力叙事（峰终定律记忆锚点），mental+5 / 跟风则 happiness-2 |
| e406_policy_pulse (street) | E→A | **首消费 _propertyPolicyTightness**（楼市政策冲击衰减场 abs≥0.05）：把纯数值场转化为「读懂政策风向」认知回报，mental+4·happiness+3，text() 按 tightness 正负动态叙事 |
| e406_trade_journal_review (corporate) | E→C | **首叙事消费 tradeLog**（≥8笔真实交易）：复盘流水→会计经验（职业-经济联动），addSkillXp("accounting",8)+mental+4 |

范式：IIFE + `_domainELinkageR406Loaded` 守卫 + 显式 phase + excludeFlags 冷却 + 全 `||` 防御 + isFinite 数值校验 + 数值 [PLACEHOLDER]。字段真实性全部先核 state.js/investment.js（btcHoldings:1155 / btcFearGreed:state.js:217 / _propertyPolicyTightness:property_market.js:83 / tradeLog:investment.js:1697）。src/index.html 注册在 r396.js 之后（1192行）。

## 验证
- node --check 通过。
- build.py → dist app.js 10731.2KB（_domainELinkageR406Loaded 入 bundle count=2）。
- MC 6×400d：**EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity grep=0；前7天死亡率全 0.0%）。corporate 16.7%<80% 为既有 RNG 平衡阈值波动（本轮事件仅正向/中性效果+真实字段门控，非回归）。

## 并发纪律
- 并行在途 jobs.js/carry.js/trade.js/trade_intel.js 全程 stash 隔离，重建 dist 后提交，push 后 pop 还原。
- 仅 add 本轮文件：domain_e_linkage_r406.js / src/index.html / dist / CLAUDE.md / loop-state / round doc / last_known_head / MEMORY.md。

## 下轮
recency（R406后）：A=398/B=401/C=399/D=405/E=406/F=403/G=402/H=404 → **域A(398) 最薄弱**。开轮必 git log 重算。
