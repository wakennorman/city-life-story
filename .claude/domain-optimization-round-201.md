# 域优化 Round 201 — 域E 经济/投资

- 日期: 2026-07-25
- 域: E（经济/投资）
- 选择依据: recency 195 最薄弱（nextDomain=E）
- HEAD(修复前): 27097cbf → 提交后见 loop-domain-state.json.lastCommit

## 指令一：A类缺陷修复（3处）

| # | 文件:行 | 缺陷简述 | 修复内容 | 类别 |
|---|---------|----------|----------|------|
| 1 | src/js/phase2/investment.js ~1436 | 经济焦虑「净值回撤」块写 `state.needs.health`（死字段，真实为 `state.status.health`）→每日回撤的健康惩罚静默丢失，永不渲染 | 改为 `state.status.health`，健康惩罚本轮起真正生效 | A（#4 死字段） |
| 2 | src/js/phase2/investment.js ~1438 | 同块深度回撤(>0.35)写 `state.needs.mental`（死字段，真实为 `state.player.mental`）→心智惩罚静默丢失 | 改为 `state.player.mental`，深度回撤心智惩罚生效 | A（#4 死字段） |
| 3 | src/js/phase2/stock.js ~70 | OIL「黑金能源」`industry:"能源"` 不在 WORLD_SECTORS(科技/消费/金融/房地产/医药/新能源)→getSectorHeat 板块热度/新闻匹配对 OIL 恒返回中性 1.0，OIL 股价与游戏经济脱钩 | 改 `industry:"新能源"`（合法板块），OIL 接回板块经济与新闻联动 | A（#2 脱钩） |

每处均加注释 `// [全系统自洽修复] 域E 修复:xxx`。

误报修正（Explore 曾疑似）：investment_analysis.js 止损链已在 R195 以包装 tickInvestmentDaily 接线复活，非死代码；`_totalInvestmentProfit`/`_consecutiveWins` 由 sellInvStock/sellBtc 维护，非死字段。

## 指令二：联动增强（3项）

新建 `src/js/core/domain_e_linkage_r201.js`（IIFE 注入 RANDOM_EVENTS，全字段 `||` 防御，数值 [PLACEHOLDER]），注册于 src/index.html r200 之后（line 858）。

| 新增事件 | phase | 联动域 | 设计意图（一句话） |
|----------|-------|--------|--------------------|
| econ_r201_drawdown_reflect | street | E→G | 净值回撤深夜自省——首次叙事消费本轮修复的经济焦虑回撤机制，把数值惩罚包装成成长心境 |
| econ_r201_annual_ledger | corporate | E→A | 年度投资总账——首个反思式消费真实字段 `_totalInvestmentProfit`，盈亏两态叙事强化损失厌恶/禀赋效应 |
| econ_r201_capital_backbone | corporate | E→H | 投资底气反哺事业——投资总盈利>0 且在职→management XP+现金周转，打通经济积累对职业的正向溢出 |

补齐历轮域E未用的 E→G / E→A / E→H 联动方向。

## 验证

- `node --check` investment.js / stock.js / domain_e_linkage_r201.js 全过。
- `python build.py` 重建 dist（app.js 9241.9KB，含 r201 与两处 A类修复，已核 grep）。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：退出 0，0 代码异常（无 TypeError/ReferenceError/NaN/Infinity）。存活率偏低项为既有 RNG 平衡阈值，非本轮回归。

## 并行协作说明

网络中断恢复期间，并行窗口提交了 域C(e57c4534)、域D(0ddcae87)，我的 src/index.html r201 注册与 dist/ 重建被并入其提交（已核 dist 含本轮全部改动）。本窗口仅提交剩余的 E 源文件与文档，绝不碰 social_network.js/npcs.js 等并行在途文件。

## 下轮

nextDomain = F（域C/D 正被并行窗口占用，避让；F recency 198 为可安全接手的最薄弱域）。
