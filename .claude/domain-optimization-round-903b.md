# 域A（数据/数值平衡）深审轮 · R903b

> 自动化 8 域轮换优化循环 · 本轮选域依据：`git log` 重算 recency → 域A 上次深审 R770b（全库最陈旧深审），轮号 R895 亦为 8 域最旧 → 选 A。
> 本窗口编号 `b` 后缀避让并行窗口（并行已同时推 R901 域G / R902 域H / 在途 R903 域A，故本轮 `r903b` 文件全名独立，零碰撞）。

## 一、A 类缺陷修复（3 处，均为「数据/数值承诺静默失效」）

| # | 文件 | 缺陷 | 修复 |
|---|---|---|---|
| A1 | `src/js/main.js`（培训中心考证 handler ~L3920） | `driver_license` 证书 `effects.agility:1` 全库零消费者——主应用开关只处理 `physique`，无 `cert.effects.agility` 分支，驾照 desc「可以开车」之外的「+1敏捷」承诺永不发生 | 补齐 `if (cert.effects.agility) state.player.agility += cert.effects.agility`（agility 为真实玩家属性，被 `req.agility` 等多项门控消费） |
| A2 | `src/js/phase1/daily_pipeline.js`（每日恢复 fn ~L198） | `bicycle` 物品 `effects.fatigue_reduction:10` 全库零消费者——骑行减疲劳承诺静默失效 | 接入每日疲劳恢复：库存 + 已装备双源遍历 `effects.fatigue_reduction` 求和，叠加进 `recovery`（与 R306 injuryReduction 同构，cap 20） |
| A3 | `src/js/phase1/daily_pipeline.js`（同上 fn） | `warm_coat` 物品 `effects.comfort:5` 全库零消费者——weather.js 的 `comfort` 为住房派生量非物品字段，厚棉衣「舒适度」承诺静默失效 | 同 fn 内求和物品 `effects.comfort`（cap 10），每日注入 `needs.happiness`（comfort→幸福感，最接近真实字段的语义落点） |

### 审计方法（承诺审计法）
- `skills.js` CERTIFICATES 全 18 证 `effects` 逐一比对 `main.js` 考证应用 allowlist（R197/R242 已补 caregiverXp/healthBonus/illnessRiskReduction 等）→ 仅 `driver_license.agility` 漏网。
- `items.js` 物品 `effects` 比对全库消费者：bicycle `fatigue_reduction`、warm_coat `comfort` 经 broad grep 0 命中（coldProtection 已被 weather.js 消费，非死数据，已排除）。
- `construction_safety.injuryReduction:0.5` 初判疑似死数据，经核实 `main.js:5106` **硬编码 `certReduction=0.5`** 已兑现承诺 → 非 A 类，按「误报勿修」原则跳过（仅魔数代码味，记 C 类不接线）。

## 二、联动增强（3 项，A→E，IIFE `domain_a_linkage_events_r903b.js`）

发现 `phase2/investment.js:1410` 动态写入 `_portfolioMilestone_<value>` 三档（10000/50000/500000）自 R738b 消费 100000/1000000 后**全库零读取**——纯写-only 死 flag。本轮以「域A·数据素养视角」对其做首消费：

| 事件 | 方向 | 消费 flag | 设计 |
|---|---|---|---|
| `a903b_portfolio_first_seed` | A→E | `_portfolioMilestone_10000` | ¥1万首破——数据觉醒；复盘(智力+2/管理XP+5) vs 庆祝(幸福+4) |
| `a903b_portfolio_steady_growth` | A→E | `_portfolioMilestone_50000` | ¥5万站上——复利直觉；加仓逻辑(会计XP+8/智力+1) vs 落袋为安(存款+¥3000) |
| `a903b_portfolio_half_million` | A→E | `_portfolioMilestone_500000` | ¥50万冲破——财富坐标；长期配置(管理XP+10/心智+3) vs 安全垫(存款+¥8000/幸福+3) |

防御：done-flag 防重 / `\|\|` 守卫 / isFinite / 显式 `phase:"street"` / `addSkillXp` 真实键 / 真实字段（`resources.bankBalance`/`player.intelligence`/`player.mental`/`needs.happiness`）。

## 三、验证
- `node --check`：main.js / daily_pipeline.js / r903b linkage 均通过。
- `python build.py`：dist/app.js 15553.2KB（含 a903b×3、_itemFatigueCut×6、cert.effects.agility×3），新于 src。
- `index.html`：挂载 `js/core/domain_a_linkage_events_r903b.js`；例行清扫并行「杂散 t」4 处（2115/2151/2153/2205 行首 `t<script`）→ 0 残留。
- Monte Carlo `10×500`：待回填（后台运行）。

## 四、竞态说明
并行在途 R903 域A 与本窗口 r903b 同名不同文件（后缀 b），源改动锚点稳定、互不覆盖；四项核验（源+挂载+dist+A类修复 grep）通过即闭合。push 受代理 3067 未起阻断则置 `LOCAL_ONLY_TLS`，网络恢复任一窗口 push 即闭合。
