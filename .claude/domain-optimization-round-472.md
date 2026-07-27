# Round 472 — 域B 事件/叙事（跨域 linkage 审计轮）

日期：2026-07-27 | 窗口：自动化（权威 bookkeeping + A类定位 + MC 验证）

## 开轮重算（git log 时间序，勿信 loop-state）
- 开轮 recency：A=468/H=467/C=466/D=465/G=464/F=463/E=462/B=461 → B 最薄弱。
- 执行中并行连推 R469(B)/R470(E,扫入本窗口联动)/R471(F)，本轮账本记 R472。

## 修复清单（A类 4处）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| domain_a_linkage_r459.js:40 | `addSkillXp("trade",4)` 假技能键（state.skills 无 trade，XP 静默丢弃） | 改真实键 `"sales"` + hint/消息同步 | A |
| domain_b_linkage_r460.js:30 | 同上（假键 trade） | 同上 | A |
| domain_d_linkage_r453.js:100 | 同上（假键 trade） | 同上 | A |
| domain_a_linkage_r446.js:105 | 同上（假键 trade） | 同上 | A |
| dist/app.js（HEAD 悬空） | 并行 f2457cbd 提交 r470 源+挂载但 dist 缺 e470_（=0）→运行时事件不注册 | python build.py 重建，e470_=12 闭合 | A(悬空) |

审计范围：R453-R468 期间新增 15 个 linkage 文件——挂载完整性 15/15 ✓、悬空引用 0、死字段黑名单全库 0 活命中、phase 字段 3/3 全齐、applyAffinityChange 位置参数全对。假键 trade 为唯一 A 类模式（4处）。

## 增强清单（联动 3 项，domain_e_linkage_r470.js，已随并行 f2457cbd 上 main）
| 事件 | 联动 | 设计意图 |
|---|---|---|
| e470_car_depreciation_lesson | E→G | 首消费 cars.currentPrice<buyPrice 折旧对照——损失厌恶教学，置 _dataInvestorMindset |
| e470_car_road_trip | E→D | 首消费 travelBonus 叙事维度——载友兜风涨好感（met 铁律+applyAffinityChange） |
| e470_car_ledger | E→C | 首消费 maintenance 叙事维度——养车成本台账→accounting XP（corporate） |

背景：inv.cars 此前仅被净资产求和消费，三个叙事子维度全库零事件消费（禀赋效应空白）。

## 验证
- node --check 5 文件全过；build dist app.js 11254.5KB（e470+f471=18 入 bundle，假键 trade=0）。
- MC 6×400d EXIT=0 · 0 代码异常（TypeError/ReferenceError/NaN/Infinity grep=0）· 前7天死亡率全 0%。grinder 33.3%/skiller·social·corporate 66.7% 为既有 RNG 平衡阈值非回归。

## 竞态记录
- 并行 f2457cbd「R470 域E」提交信息描述 e470_invest_*，实际扫入的是本窗口 e470_car_*（信息与代码不符，代码无损）。
- 并行在途 domain_e_linkage_r453.js 重写 + npc_relationships.js/social_tab.js（R472+ in-flight）全程 stash 隔离，push 后 pop。
