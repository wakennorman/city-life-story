# 域优化轮次 R296 — 域G 核心机制/生命周期（第五轮循环）

日期：2026-07-26 ｜ 执行窗口：WorkBuddy 自动化 ｜ 账本轮次 R296（R294 编号被并行窗口占为域G联动、R295 为域H）

## 开轮核对
- loop-state 标 R284/next=F 严重滞后；git log 实况：并行已推进 R285(F)/R286(G)/R287(H)/R288(A)/R289(B)/R290(C)/R291(D)/R292(E)/R293(F)/R294(G)/R295(H)。
- 重算 recency（开轮时）：G=286 全局最薄弱 → 本轮域G。执行中并行又占 R294/R295 → 本轮账本记 R296。

## A类修复清单（1项 + 13项确证记录）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/phase1/carry.js:589 | hireTransport 运输随机事件与天气系统断链——weather.js:789 getWeatherTransportRiskMod（暴雨1.05×/台风1.5×/暴雪1.3×等风险倍率表）全库零调用方（死代码），恶劣天气从不影响货损/交通意外率 | 「货物损坏」「交通意外」掷骰乘天气倍率（偷窃与天气无关不乘）；typeof+isFinite 双守卫；Math.min(0.95) 防必然触发；mod>1 播报提示 | A |
| src/js/data/scenario_start_chains.js | 13个剧本死flag（写入后全库无读取）：_restaurantConnection/_sleptRoughThreeDays/_hasToolkit/_triedStall/_interviewPassed/_firstJobFound/_tookLanguageClass/_stickToFactory/_familyFundUsed/_marketResearchDone/_startupDirection/_consultedLawyer/_familyBudgetDone | 本轮联动首消费其中3个（_hasToolkit/_interviewPassed/_firstJobFound）；其余10个记录待后续轮次消费 | A(部分修)/C(记录) |
| weather.js:927 getWeatherEnhancedDesc | 死函数全库无调用方 | 由联动事件 g296_weather_survival_wisdom 成为全库首个调用方（try/catch 守卫） | A |

### B类（记录不修）
- life_nodes.js:205 retire_advisor 技能XP `*5||200`：health≤30 时 `0||200` 误给 200 XP（守卫使 NaN 不传播，逻辑误非崩溃）。
- scenarios.js uni_engineering 提示「医疗+10 维修+10」但 effect 仅给 repair。
- life_nodes.career35 与 story_chapters 35岁路线 flag 命名不一致（_career35Path vs _crisis35Path，各有读写方，设计分歧）。

## 联动增强清单（3项，domain_g_linkage_r296.js）
| 事件 | 联动 | 设计意图 |
|---|---|---|
| g296_weather_survival_wisdom（读懂天空的人） | G→B | 极端天气叙事包装：复活死函数 getWeatherEnhancedDesc（全库首个调用方），把天气机制变成生存智慧叙事 |
| g296_toolkit_neighbor_fix（工具箱派上用场） | G→D | 首消费剧本死flag _hasToolkit：开局买工具的选择在中期获得回报（峰终定律·禀赋效应）；好感走 applyAffinityChange 严守 rel.met 铁律 |
| g296_first_job_lookback（第一份工作的记忆） | G→C | 首消费剧本死flag _interviewPassed/_firstJobFound：corporate 阶段回望起点，Phase1剧本记忆→Phase2叙事继承 |

## 验证
- node --check：carry.js / domain_g_linkage_r296.js 通过。
- build.py：dist/app.js 9822.9KB，_domainGLinkageR296Loaded count=2 入 bundle。
- MC 6×400d：EXIT=0，0 代码异常（见提交信息）。

## 并发处置记录
- carry.js A类修复在本轮执行期间被并行窗口 `git add -A` 扫入 ada29372「chore: sync pending changes (R295)」已上 main——HEAD 版本与本轮最终版一致（含垃圾字符修正后版本），无需重提。
- 本窗口曾误覆盖并行已提交的 domain_g_linkage_r294.js（Write 前未察觉并行已占用 R294），已 `git checkout --` 完整恢复，本轮文件改名 r296，事件 id 前缀 g296_ 无冲突。

## 下轮
recency 基准（R296 后）：A=288/B=289/C=290/D=291/E=292/F=293/G=296/H=295 → 下轮 **A**（288 最薄弱）。
