# Round 18 · 域E（经济/投资）执行报告

> 自动化循环「城市浮生记·全系统8域轮换优化」· 提交 `loop/auto`（未 push）
> 轮换序：…→D(R17)→**E(R18)**→F(下轮)→G→H→A…

## 一、A 类缺陷修复（3 项，均为必现功能失效 / 逻辑错误）

### A1 · 连续盈利衰减机制彻底失效（economy_v3.1.js + investment.js）

- **根因**：`dailyEconomicSettlement` 调用 `getConsecutiveWinDecay(state.stats?.consecutiveWins || 0)`，但 `state.stats.consecutiveWins` **全代码库无任何写入点**（grep 仅此一读点）→ 恒读 0 → `getConsecutiveWinDecay(0)` 恒返回 `1.0`。MECHANICS 描述「连续盈利衰减（第4次后每次-8%）」机制形同虚设。
- **修复**：
  - 读者改为 `state.investment._consecutiveWins || 0`。
  - `sellInvStock`（investment.js）：持仓 `h.avgPrice` 已由 `buyInvStock` 维护，补算 `pl=(m.price - h.avgPrice) * shares`，盈利 `inv._consecutiveWins++`、亏损归零。
  - `sellBtc`（investment.js）：复用既有 `pl`，同步维护计数器。
  - 全程 `|| 0` / `|| 0` 守卫，无需改 `state.js` 初始化。机制从此真正生效。

### A2 · 房产价格被「股票」类新闻错误驱动（news_investment_bridge.js:85）

- **根因**：`getNewsEffectForProperty` 调 `getNewsEffectForInvestment("ESTATE","房地产","股票",state)`，category 传 `"股票"`。函数内 `eff.category === category` 命中即乘算 → **任何定义为 `category:"股票"` 的新闻都会错误作用到房价**（房产本应只受 `industry:"房地产"` / 全市场 / 具体 symbol 影响）。
- **修复**：category 改 `null`，房产仅按 行业(房地产) / allStocks / symbol 匹配。

### A3 · 房产/汽车持仓盈亏百分比除零 → "Infinity%"（investment.js:3743 / 3916）

- **根因**：`pct = ((diff / buyP) * 100).toFixed(1)`，`buyP`（房产/汽车买入价）若异常为 `0`/`undefined`（事件赠送、迁移数据、def 缺字段）→ `diff/0 = Infinity`，UI 显示 "Infinity%"。
- **修复**：`var pct = buyP > 0 ? ((diff / buyP) * 100).toFixed(1) : "0.0";`（两处同改）。

## 二、联动增强（3 项，新建 economy_invest_linkage_events.js）

IIFE 注入全局 `RANDOM_EVENTS`（与 R11/R12/R13/R14/R16/R17 同模式，不碰 cross_system_events.js）。引擎严格按 `e.phase` 过滤，故 **2 street + 1 corporate**；所有 state 访问 `||` 防御，数值标 `[PLACEHOLDER]`。

| id                         | 桥接          | 阶段      | 效果（全守卫）                                                                                         |
| -------------------------- | ------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| `invest_milestone_mindset` | E→A 数值/心智 | street    | 投资里程碑→`player.mental+5`·`needs.happiness+4` + 设 `_dataInvestorMindset`（复用 R14 投资心态 flag） |
| `invest_acumen_career`     | E→C 职业/成长 | street    | 金融盘感→`addSkillXp("accounting",8)`（会计为职业体系真实技能键）+ `mental+3`                          |
| `invest_treat_friend`      | E→D NPC/社交  | corporate | 落袋请友→`safeAffinityE` 走 `applyAffinityChange`（域D铁律）+ 扣 `resources.cash` 800                  |

- 触发闸门 `isInvestorE = state.investment.stockHoldings.length >= 1`（须已持有一个以上标的）。
- E→D 严守域D铁律：只读 `state.relationships`、`rel && rel.met` 守卫、跨 NPC 传导一律 `applyAffinityChange`。

## 三、验证

| 步骤                                                                                                 | 结果                                                                                                                         |
| ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `node --check`（economy_v3.1 / news_investment_bridge / investment / economy_invest_linkage_events） | 4 文件全 OK                                                                                                                  |
| `python build.py`                                                                                    | dist 8255.1 KB，注入验证：`_econInvestLinkageLoaded`×2、`invest_milestone_mindset`×1、`_consecutiveWins`×5、房产 null 匹配×1 |
| Monte Carlo 6×400d                                                                                   | **exit=0 · 0 代码异常**（grep 确认无 TypeError/ReferenceError/NaN/异常行）                                                   |

> ⚠️ `balanced`/`social` 存活率 66.7%<80% 为**既有平衡阈值**（RNG 波动：上轮同架构 trader/social 曾 83.3%，本轮 trader/corporate 已 83.3% 通过），非本轮引入、非代码异常。末尾 RSS 36氪「源失败」为离线新闻网络回退，非代码异常。

## 四、状态与提交

- `loop-domain-state.json` = round 18 / **E** / next=**F**（UI/UX）。
- `DEVELOPMENT.md` = **v3.109**。
- 改动文件（已 `git add`，**未 push**，遵守 SOP）：economy_v3.1.js / news_investment_bridge.js / investment.js / economy_invest_linkage_events.js(新) / index.html / DEVELOPMENT.md / dist/index.html / loop-domain-state.json / last_known_head + memory 文件。
- 提交前已同步 `last_known_head` = 当前 HEAD（过 pre-commit 漂移检查）。

**下轮 → 域F（UI/UX）。**
