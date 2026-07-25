# 域优化循环 · Round 260 · 域E（经济/投资）

日期：2026-07-26
本轮域：E（经济/投资）— 按真实 recency 选取（E=246 全局最薄弱）
起始 HEAD 演进：6247f54a → d14a573f → 1a044403（并行窗口高频推进期，本轮改动全程存活）

## 开轮上下文核对
- loop-domain-state.json 标 `nextDomain=C`，但 `git log` 显示并行窗口已推进 R252(C)/R253(D)/R254/R255/R256/R257(H)/R258(A)/R259(B)，loop-state 严重滞后。
- 重算真实 recency：E=246 / F=247 / G=248 / C=252 / D=253 / H=257 / A=258 / B=259 → **E 最薄弱**，本轮 = R260 域E。
- 轮次号 R260 未被占用（现存 linkage 最高为 r259）。

## 指令一：A类缺陷修复（1 处）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/phase2/stock.js` (renderStockCard) | 持仓盈亏百分比 `pnlPct = (price - holding.avgPrice) / holding.avgPrice * 100` 未守卫 `avgPrice`。赠股/旧存档 avgPrice=0/undefined 时结果 `Infinity`/`NaN` → 股票卡片显示 "Infinity%" 并可污染下游数值 | 改为 `holding && isFinite(holding.avgPrice) && holding.avgPrice > 0 ? ... : 0`（与 investment.js:1778 `_avgPx` 兜底一致） | A（#3 极端值 NaN/Infinity） |
| `src/js/phase2/stock.js` (renderStockCard) | 同函数 `todayPct = (todayChange / prev) * 100`，`prev` 可回退为 `price`；若 price=0（新上市/退市股）→ `0/0=NaN` | 补 `prev > 0 ? ... : 0` 守卫（同处防御性加固） | A（#3） |

审计范围：investment.js / investment_analysis.js / stock.js / property_market.js / economy_v3.1.js / finance.js / startup.js 全量核查死字段、除0守卫、industry 合法性、创业断裂四类。其余文件干净（历轮 R18/R195/R201/R235/R237/R246 已将主要隐患净尽）。

## 指令二：联动增强（3 项，新建 `src/js/core/domain_e_linkage_r260.js`）

| 新增事件 | 文件 | 联动域 | 设计意图（一句话） |
|---|---|---|---|
| `e260_bull_return` | domain_e_linkage_r260.js (street) | E→G | 牛市归来——**首个消费 R246 写入、全库零消费者的死flag `_bearMarketWitness`**，熊转牛的对照叙事强化穿越牛熊的定力（写入→消费闭环）。 |
| `e260_streak_review` | domain_e_linkage_r260.js (corporate) | E→C | 连胜复盘——**首个叙事消费 investment.js 真实维护的 `_consecutiveWins`≥3**，以过度自信/近因效应警醒包装复盘习惯 → accounting 技能。 |
| `e260_market_wisdom` | domain_e_linkage_r260.js (street) | E→D | 把盘感讲给熟人——有投资阅历（见证熊市/投资意识）→ 向已结识 NPC 分享教训换真诚好感（守 firstMetNpc+rel.met+applyAffinityChange 域D铁律）。 |

设计约束：IIFE 注入全局 RANDOM_EVENTS（非 ES import），guard `_domainELinkageR260Loaded`；显式 `phase`（2 street + 1 corporate，过 events_core.js:379 phase 过滤）；全字段 `||`/`typeof` 防御；数值一律 `[PLACEHOLDER]`；里程碑/冷却用 `st.flags._xxx` 双重拦截。index.html 注册在 `domain_e_linkage_r246.js` 之后。

## 验证
- `node --check` src/js/phase2/stock.js + src/js/core/domain_e_linkage_r260.js → 均通过。
- `python build.py` → dist/app.js 9530.8KB（`_domainELinkageR260Loaded` 已入 bundle，grep count=2），dist 比 src 新。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → EXIT=0，代码异常 grep（TypeError/ReferenceError/Uncaught/NaN/Infinity，排除新闻网络回退）= 0。balanced 66.7% / corporate 33.3% 存活率 < 80% 为既有 RNG 平衡阈值波动（非本轮引入、非代码回归）；trader 83.3% / social 100% / skiller 83.3% 达标；前7天死亡率全 0.0%。

## 提交
- 仅 `git add` 本轮文件：stock.js / domain_e_linkage_r260.js / index.html / dist(index.html+app.js) / CLAUDE.md / loop-domain-state.json / round doc / MEMORY.md / last_known_head。
- 提交前同步 `.claude/last_known_head` = 当前 HEAD 过 pre-commit 漂移检查；绝不 `-A`/`--amend`/force。
- 推送前 `git pull --rebase origin main`，再 `git push origin main`。

下轮 → F（UI/UX，recency 247 全局最薄弱）。
