# Round 431 — 域A 数据/数值平衡（第二十一轮循环·第十一次域A）

日期：2026-07-27 | 执行窗口：自动化（权威 bookkeeping + 代码轮）| 基线 HEAD：51e55ec1

## 开轮 recency 重算（git log 实况，勿信 loop-state）

按提交时间序（新→旧）：B/H/E(并行 R415-417 标签窗口+R427-429)刚推进 → G(R422)/F(R421)/D(R427)/C(R424)/**A(R423, ae3c54a8) 最旧** → 本轮=域A。轮号：R430 已被 chore 占用，R431 未被占用（ls src/js/core + git log 双核对）。

## 指令一：A类审查 = 0处（诚实报告）

Explore 定向只读审计 + 手工 grep 双确认：
- jobs.js payCalc：全部 s.skills.<key> 为真实技能键，纯乘加无除法，无 NaN 风险；effects.*Xp 在 main.js:4837-4876 全有消费者。
- jobs.js requiredFlag：`_synergy_*` 全部与 skill_synergy.js 真实 id 匹配（cooking_sales/coding_english/repair_electrician/sales_management 等）。
- goods.js↔phase1/pricing.js↔phase1/trade.js：goodId 引用链完整；calcFinalPrice 下限钳 basePrice*0.2；calcTradeProfitRate 守卫 fromPrice===0；无负价/除零。
- illnesses.js：treatCost>0；单日 health 最大扣 -8；无 naturalCureDays 矛盾（R245 已删）。
- economy_v3.1.js：难度键 easy/normal/hard/hell 对齐；_consecutiveWins/_difficulty 读取带守卫，无新错链。
- 死字段黑名单（player.happiness/needs.health/player.health/certs）全库 grep：仅命中 webapp_runtime_bridge.js 已知误报（主路径正确，勿修）。

历轮净尽记录追加：R431 → 域A 连续第十一轮确认 A类=0 或即修即清。

## 指令二：联动增强 3 项（domain_a_linkage_r431.js）

设计主题：**激活 trade 子系统三个「系统真实维护但零事件消费」的数据维度**（Explore 审计确认写入点与零消费证据）：

| 事件 id | 方向 | 素材（首消费） | 设计意图 |
|---|---|---|---|
| a431_route_regular | A→D (street) | `state.trade._routeUsage`（phase1/trade.js:311 写入，daily_pipeline:725 每3天衰减） | 路线熟练度≥3 → 沿途摊主结缘，禀赋效应叙事；守 rel.met 铁律 + applyAffinityChange 正规入口 |
| a431_bulk_buyer_sense | A→E (street) | `state.trade._totalSpent`（phase1/trade.js:113 累计进货额） | ≥8000[PLACEHOLDER] → 价格周期盘感，复用 _dataInvestorMindset 真实活跃 flag，为投资域后续事件铺垫 |
| a431_ledger_to_career | A→C (corporate) | `flags._tradeLearnedInvest`（phase1/trade.js:235 写后零读取死flag） | 街头记账功夫跨阶段继承 → addSkillXp("accounting",8) + player.corporate.upward+2（真实惰性字段） |

防御自检：✓ IIFE + `_domainALinkageR431Loaded` 守卫 ✓ 显式 phase ✓ 全 || 守卫（trade/relationships/flags 可 undefined）✓ excludeFlags 一次性冷却 ✓ applyAffinityChange 位置参数 (state,npcId,change,reason) ✓ addSkillXp 真实键 accounting ✓ id/flag 前缀 a431_ 全库唯一 ✓ conditions 全 false 时叙事不出场仍自洽。

挂载：src/index.html:600（domain_b_linkage_r429.js 之后），已核 build 后 dist/app.js 含 a431_（漏挂=悬空剔除教训）。

## 验证

- node --check：domain_a_linkage_r431.js 通过。
- python build.py：dist/index.html 158.4KB + app.js 10934.6KB（比 src 新，a431_ 入 bundle）。
- MC `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：结果见 MEMORY.md 本轮条目（要求 0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率 0%）。

## 并发纪律

- 开轮工作区在途（并行 MC_VERIFY 方向）：.claude/loop-domain-state.json / dist/app.js / src/js/ui/career_dev.js —— 全程不碰；提交前 stash 隔离 career_dev.js 与并行 loop-state 改动，push 后 pop。
- 提交：只 add 本轮文件（r431.js / src/index.html / dist / CLAUDE.md / round doc / loop-state / last_known_head / MEMORY.md）。
- push 前：git pull --rebase origin main + 双向核对 `git show HEAD:src/index.html | grep r431`。

## 下轮

⚠️ 并行存在 R48-50 小编号轮与 R415-418 滞后标签轮，数字 recency 已失真——**必须按提交时间序重算**。时间序（新→旧）：A(R431)/C(R418标签)/B/H/E 刚触碰 → G(R49)/F(R48) → **D(56452adc R427) 最旧 = 下轮域D**。开轮必 git log 重算。

## 竞态后记

执行中（MC 运行期）并行窗口将本轮全部源码（r431.js+index.html+dist+loop-state+last_known_head）`git add -A` 扫入 `5f8bd210`「feat: [域A R431]」并已 push origin/main。双向核验完整：HEAD index.html 挂载 r431=1、dist a431_=6、无悬空引用、提交信息正确标记 R431。本窗口仅补账本（CLAUDE.md 迭代表 R431 行 + 本 round doc + loop-state 权威校正 + MEMORY.md）。MC 6×400d EXIT=0·0代码异常·前7天死亡率全 0.0%（balanced 33.3%/corporate 66.7% 为既有 RNG 阈值非回归）。
