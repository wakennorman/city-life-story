# R738b 域E（经济/投资）— 本窗口自动化轮

日期：2026-07-29 05:1x　|　b后缀避让并行R738（并行第五轮循环在途，R737=05:02域H）

## 选域依据
git log 实测：并行 R730-R737 第四轮循环刚把8域全刷一遍（均为联动3项，无深审）。本窗口深审 recency：A=R649b / B=R722b / C=R677b / D=R730b / H=R712b，**E 自 R284 时代后未深审**（F=R442/G=R311 均更老但 MEMORY 记 E 有素材账且并行 E 轮刚暴露 portfolio 恒false 群），定 E。

## A类修复（2处，实际影响≈20个死事件）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/phase2/investment.js | **investment.portfolio 全库零写入方**，但 11+ 文件（r443/r454/r493/r497/r501/r509/r520/r529/r710/r718/r726/r734/part7）以其为 conditions 门槛或估值来源 → r710/r718/r726/r734 全部12事件恒false死事件；r443系 calcPortfolioValue 恒0 → 高门槛事件同死 | 每日tick在 _pv 计算后单点维护 `inv.portfolio = {stocks:{symbol:{shares,avgPrice,avgCost}}, funds:{}, totalValue:含股/房/BTC市值}`，try/catch 隔离，一次性复活全部读取方 | A |
| src/js/core/cross_system_events_part7.js:4149 | 千万里程碑事件 `st.bankBalance` 死字段（真实 resources.bankBalance）漏算存款 + `Object.values(portfolio)` 把容器当持仓map遍历（h.shares恒undefined→投资贡献恒0）→ 数值与叙事严重不符 | 改读 `st.resources.bankBalance` + `portfolio.totalValue`（isFinite守卫） | A |

四项例行审计：假键17命中全为历史修复注释（活代码0）/死字段黑名单仅 webapp_runtime_bridge 已知误报/index.html 双向悬空0/近轮E文件无 industry 越界。

## 联动增强（3项，domain_e_linkage_r738b.js，3×corporate，均为零读取素材首消费）
| 事件 | 联动 | 素材 | 设计意图 |
|---|---|---|---|
| e738b_milestone_mentor | E→D | `_portfolioMilestone_100000` flag 首读 | 10万里程碑的社交回响：已结识NPC上门请教（met铁律+applyAffinityChange），财不露白 vs 分享心得 |
| e738b_curve_reflection | E→G | `_portfolioPeakHistory` 30日曲线首读（写入方注释自称"供可视化"却零读取） | 峰终定律：让玩家回顾曲线形状而非终点数字，涨/跌/横盘三态叙事 |
| e738b_million_gravity | E→C | `_portfolioMilestone_1000000` flag 首读 | 百万资产→职业谈判底气（损失厌恶反向：有退路才敢冒险），管理XP+智力 |

防御自检：全部||守卫；peakHistory Array.isArray+length>=15；除法 isFinite+fv>0；NPC met铁律；done-flag防重；phase 显式 corporate；conditions 全false 时（无里程碑/无曲线）事件自然不触发无叙事漏洞。

## 验证
- node --check：investment.js / part7 / r738b / (index.html非js) 全过
- build：13518.6KB，e738b×6 + R738b注释×7 入包
- MC 10x500：见提交信息（0代码异常达标）

## 新增写-only（供后续轮消费）
_e738bMentorGave / _e738bCurveZen / _e738bMillionBold

## 素材账更新
- ~~_portfolioMilestone_100000/1000000~~ ~~_portfolioPeakHistory~~ 本轮已消费
- 域E剩余零消费：_portfolioMilestone_10000/50000/500000（中间三档仍零读取，可做阶梯叙事）/propertyPhaseStartDay/_propertyPolicyTightness（政策趋紧度零事件）
