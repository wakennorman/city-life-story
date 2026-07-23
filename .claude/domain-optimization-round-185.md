# 全系统优化 · Round 185 · 域E（经济/投资）

> 日期：2026-07-24 · 分支：main · 起始 HEAD：afc06d7b · 上轮：R184 域D（08f225d1）

## 一、本轮域选取
loop-domain-state 标 nextDomain=E（recency=167，8 域中最薄弱）。currentRound 184→185，域 E。

## 二、A类缺陷修复清单

| # | 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|------|----------|----------|------|
| 1 | phase2/investment.js `initInvestment:1138` | `if(inv.btcPrice<=0)` 对 `undefined` 判定失效（`undefined<=0`===false）→ 旧存档 btcPrice 永不回填 | 改 `typeof!=="number"\|\|!isFinite\|\|<=0` 显式判定；并统一回填 stockHoldings/properties/cars/btcHoldings（读取路径均 `\|\|[]`，写入路径此前不一致） | A |
| 2 | phase2/investment.js `buyInvStock:1593` | sellInvStock 有 stockHoldings 守卫、buyInvStock 缺 → 旧档买股 `.find` TypeError | push 前 `if(!Array.isArray(inv.stockHoldings)) inv.stockHoldings=[]` | A |
| 3 | phase2/investment.js `buyProperty:1837`/`sellProperty:1864` | 写入路径缺 properties 守卫（tick/render 读取均 `\|\|[]`）→ 旧档买/卖房 TypeError | 各加 properties 数组守卫 | A |
| 4 | phase2/investment.js `buyCar:1916` | 写入路径缺 cars 守卫 → 旧档买车 TypeError | push 前加 cars 数组守卫 | A |
| 5 | phase2/investment.js `sellBtc:1785` | buyBtc 有 isNaN(cost) 守卫、sellBtc 缺 → btcPrice/btcHoldings 为 undefined 时 revenue=NaN 加进现金 → `state.resources.cash` 变 NaN，经济结算静默报废 | 补 inv/btcPrice/btcHoldings/revenue 的类型+isFinite 守卫 | A |
| 6 | phase2/investment.js `sellProperty:1879` | 自住房分支裸写 `state.housing.tier`/`state.inventory.capacity` → 缺失时 TypeError | 加 `state.housing && state.inventory` 守卫 | A |
| 7 | phase2/investment_analysis.js `checkStopLoss:595` | analyzePortfolio/setStopLoss 守卫 stockHoldings、checkStopLoss 缺 → 旧档+止损单时 `.find` TypeError；`:604/613` buyPrice/highSinceBuy=0 时除零得 Infinity 误触发止损 | 循环前 `if(!Array.isArray(inv.stockHoldings)) return`；buyPrice≤0 时 `continue` | A |
| 8 | phase2/investment.js `sellInvStock`/`sellBtc` | `_totalInvestmentProfit` 只被 R167/R96 联动事件**读取**、全代码从未写入 → 5 个跨域叙事事件（profit≤-5000/≥20000/≥10000 门槛）永久死事件 | 两处卖出结算累计已实现损益到 `_totalInvestmentProfit`，复活死事件 | A |

## 三、联动增强清单（3项，新建 domain_e_linkage_r185.js，IIFE→RANDOM_EVENTS）

| 新增内容 | phase | 联动域 | 设计意图（一句话） |
|----------|-------|--------|--------------------|
| `invest_r185_safety_net` 财务安全垫人生节点 | street | E→G | 把「存款+持仓」数字转化为「被动收入安全垫」的人生安全感节点，经济能力反哺核心生命体验 |
| `invest_r185_risk_guard` 盘感识风险劝阻朋友 | street | E→D | 投资盘感转化为社交资本——诚实劝阻朋友入高风险局，靠忠告而非花钱加深信任（走 applyAffinityChange，守 rel.met 铁律） |
| `invest_r185_data_instinct` 财报盘感迁移职场 | corporate | E→C | 投资练就的数据敏感度在职场兑现，避免投资收益与职业线脱钩（addSkillXp accounting） |

- 全事件显式设 phase（引擎按 e.phase 过滤）；数值 [PLACEHOLDER] 集中标注；全字段 `||` 防御；NPC 传导走 applyAffinityChange + rel.met 守卫。
- 触发门槛复用本轮起真实维护的 `_totalInvestmentProfit`，非死字段。

## 四、验证
- `node --check` investment.js / investment_analysis.js / domain_e_linkage_r185.js 全通过。
- `python build.py` → dist/index.html + app.js 8970.3KB（比源新）。
- 蒙特卡洛 10×500d：见 loop-domain-state.json pushStatus 与提交记录（0 代码异常）。

## 五、提交
- `fix: [域E] A类缺陷修复(8个)` + `feat: [域E] 联动增强(3项)`（或合并单提交）
- 仅 add 本轮文件 + dist + loop-state + last_known_head；pull --rebase 后 push origin main。
