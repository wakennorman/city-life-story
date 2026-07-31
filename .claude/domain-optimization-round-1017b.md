# R1017b · 域H（Phase2/公司）全系统自洽优化

- 日期：2026-07-31
- 选域依据：`git log` 重算 recency（loop-state 滞后惯例），八域深审最陈旧 = **H(R798b)** > E(R819b) > F(R826b)
- 轮号：1017b（b 后缀避让并行窗口）
- 开轮体检：`tests/syntax_sweep.cjs` 全量 1151 文件语法错误 = 0；`src/index.html` 杂散 t 字符 = 0

---

## 一、A类缺陷修复清单（7 项）

| # | 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|---|
| A1 | `src/js/phase2/stock.js`（消费点）← `src/js/phase2/corp_ops.js:477/479`（写入点） | **承诺零兑现**：corp_ops 在季末按绩效等级写 `_corpPerfStockBoost`（S/S+）/ `_corpPerfStockDrag`（C），注释白纸黑字写着「绩效影响股价（H→E）」，但**全库零消费方**——玩家拿 S+ 与拿 C，对自家公司股价的影响完全相同（都是 0）。且 `corp.js COMPANIES` 与 `STOCK_LIST` 之间**从来没有任何 id/名称映射**，这条联动在数据层就无处落地 | 新增 `_employerStockSymbolR1017b(state)` 三级映射（公司全名精确 → 名称前缀互含「安信金融科技 ⊃ 安信金融」→ 行业板块兜底），在唯一的股价刷新入口 `updateStockPrices` 消费并清除标记：利好 ×1.06 / 利空 ×0.95，附带涨跌播报 | A |
| A2 | `src/js/phase2/startup.js:1609`（写入点）← `src/js/core/events_corp.js:1455`（读取点） | **门控断链**：`founder_oust`（投资人要换团队）以 `st.flags._acceptedVCFunding` 作为「接受过 VC 投资」的主门控，该 flag **全库零写入方**——真正拿过融资的创始人反而永远进不去主路径，只能靠 `kpi>70 && day>200` 的模拟兜底触发 | 在唯一的融资成功点（`company.fundingRounds.push` 之后）补写 `_acceptedVCFunding = true` 与轮次计数 `_vcFundingRoundsR1017b`，把「拿了 VC 的钱」→「被投资人换掉」的因果闭环接上 | A |
| A3 | `src/js/phase2/team.js` + `src/js/ui/corp_ui.js` | **数值与描述不符（3.5 倍差价无解释）**：`TEAM_MEMBERS[].salary` 从 8000（应届生）到 28000（房贷战神），招聘面板逐个展示「薪资:¥28,000」，实际**一律只收固定 ¥10,000**，salary 字段全库零消费——「便宜能干活」「高压输出」的定价叙事完全不兑现 | 新增 `getTeamHireCost(template)` 单点定价（月薪 × 0.6，下限 8000），`hireTeamMember` 与招聘 UI **共用同一口径**杜绝「显示价 ≠ 实收价」；按钮改为逐成员真实报价，卡片补展示专长；招聘成功消息附成本与月薪 | A |
| A4 | `src/js/phase2/corp_ops.js`（endQuarter） | **死数据**：`TEAM_MEMBERS[].skill`（coding / politics / endurance / learning / general）**全库零消费方**——6 种成员 desc 承诺的「技术能力极强」「向上管理一流」「加班到死的高压输出」在机制上毫无区别，招谁都只是 productivity/loyalty 两个数字 | 在季度结算按团队专长做差异化兑现（每种专长每季度只结一次，防叠加膨胀）：coding→`addSkillXp("coding",25)`；politics→`upwardMgmt+2`；endurance→`kpi+2`；learning→`intelligence+1`；general→`ability+1`，附季度播报 | A |

| A5 | `src/js/ui/career_dev.js:5488/5492` | **【全站级】文件尾部执行中断**：文件末尾 `window.getSkillHealthBonus = getSkillHealthBonus;` 与 `window.getSkillMarketPricingInsight = ...` 引用了**全库根本不存在**的函数。经典脚本顶层求值时抛 `ReferenceError`，**该文件第 5488 行之后的 1172 行代码（含 16 个 window 导出：`showCareerNavModal` / `showLocationNavModal` / `switchCareerSubTab` / `enhancedApplyCareerJob` / `clampCareerCapital` 等）全部不执行** | 两处改为 `typeof X !== "undefined"` 守卫，保留导出意图的同时消除中断 | A |
| A6 | `src/js/core/festivals.js:1395` | 同型：`window.getFestivalWorkMod = getFestivalWorkMod;` 引用全库无定义函数 → 抛 ReferenceError（该导出块位于文件末尾，损伤范围小但仍为真实运行时异常） | `typeof` 守卫 | A |
| A7 | `src/js/data/actions.js:342` + `src/js/main.js`（补真实导出） | **导出误位**：`getAvailableActions` 真实定义在 `main.js:2501`，导出语句却写在加载序更靠前的 `actions.js` → 求值时函数尚未声明，抛 ReferenceError，且**该函数实际从未成功挂到 window** | actions.js 侧加 `typeof` 守卫；在定义所在的 `main.js` 导出块补 `window.getAvailableActions = getAvailableActions;` 让导出真正生效 | A |

> **A5–A7 说明**：这三项由本轮蒙特卡洛 harness 的 `[HEADLESS] LOAD ERROR` 暴露（加载错误 3 → 0）。虽不属域H，但与 R1016b「22 文件 SyntaxError」同为**跨域全站型阻断**，按既有先例在本轮一并闭合。审计脚本沉淀为 `.claude/_export_audit_r1017b.cjs`（全库扫 `window.X = X;` 中本文件未定义的裸引用，1152 文件约 1 秒），建议纳入开轮例行体检。

### B类（记录，本轮未改）
- `src/js/data/news.js:2246/2247`：`getRandomNewsByLevel`（定义于 news_system.js）/ `rollDailyNews`（定义于 events_core.js）为**跨文件裸引用**，当前加载序侥幸可用（未报 LOAD ERROR），但一旦 index.html 挂载顺序调整即变成 A5 同型中断 → 本轮预防性加 `typeof` 守卫。
- `_founderStressLevel`（corp_ops.js:655）写-only，仅有一句提示语 → 本轮改由联动事件 ① 消费，已闭环。
- 七个季度快照 flag（`_lastCorpQuarter*` / `_startupQuarter*`）写-only → 本轮改由联动事件 ② 消费，已闭环。

### C类（记录，不修）
- `events_corp.js` 中约 35 个 `_insider*` / `_founder*` / `_siege*` / `_blameGame*` / `_layoff*` 分支 flag 写-only：它们是选项留痕，即时收益已在 apply 内结算，非承诺失效，属叙事存档位，留待后续轮次做「回响事件」素材。

---

## 二、联动增强清单（3 项）

新增文件：`src/js/core/domain_h_linkage_events_r1017b.js`（IIFE 注册 RANDOM_EVENTS，全部显式 `phase:"corporate"`，done-flag 防重，数值 [PLACEHOLDER]）

| 新增内容 | 事件 id | 联动域 | 设计意图 |
|---|---|---|---|
| 体检报告上的那行小字 | `h1017b_founder_stress_checkup` | **H→G** | `_founderStressLevel` 的首个真实消费方——把「压力指数 x/10」从一句提示语变成健康/心智的真实代价与回报，且选项会写回源 flag 改变后续基线 |
| 把公司的账，读成自己的账 | `h1017b_quarter_ledger_review` | **H→E** | 七个季度快照 flag 的首个真实消费方——公司账算得清、自己账一笔糊涂，认知失调驱动个人理财意识（`_dataInvestorMindset`） |
| 你付过的那笔招聘费 | `h1017b_headhunter_pricing` | **H→C** | 承接 A类#3：玩家第一次亲手为「一个人值多少钱」付账，反身投射到自己的市场标价（禀赋效应 → 自我定价重估） |

---

## 三、验证

- `node --check`：stock.js / startup.js / team.js / corp_ops.js / corp_ui.js / 新联动文件 / career_dev.js / festivals.js / actions.js / main.js / news.js 全过
- `tests/syntax_sweep.cjs`：1152 文件语法错误 = 0；残缺引号键名 = 0
- `.claude/_export_audit_r1017b.cjs`：真实无定义裸引用 = 0（剩余 10 条为 `window.X = true;` / 形参 `level` 字面量误报）
- 无头加载错误：**3 → 0**（`加载: 1515ms, 错误: 0`）
- `python build.py`：dist 重建，dist 时间戳新于全部 src
- 蒙特卡洛：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 10 --days 500` — 242.1 秒完成（非秒退，无硬崩溃），前 7 天死亡率全策略 0%，无 TypeError / ReferenceError。balanced/corporate 存活率 60% 属既有 RNG 严苛度（非本轮回归）

## 四、深审 recency 更新

`A=R903b · B=R1016b · C=R792b · D=R900b · E=R819b · F=R826b · G=R894b · H=R1017b`
下轮候选：**E(R819b) > F(R826b) > C(R792b)**（开轮必 `git log` 重算）
