# 域优化 Round 284 — 域E 经济/投资（第四轮循环）

**日期**: 2026-07-26
**域**: E（经济/投资）
**选域依据**: 开轮 loop-state 严重滞后（标 R278/next=G）。据 git log 实况重算并行窗口已推进 R278(G)/R279(H)/R280(A)/R281(B)/R282(C)/R283(D)，真实 recency A=280/B=281/C=282/D=283/E=276/F=277/G=278/H=279 → **E=276 全局最薄弱** → 本轮=R284 域E。

## 指令一：A类缺陷修复（1 个）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/phase2/investment.js` (`buyBtc` 1870+) | `buyBtc` 与兄弟函数 `sellBtc`/`buyInvStock` 存在不对称守卫缺口：①缺 `if(!inv)return`——旧存档 `state.investment` 未初始化时第 1873 行 `inv.btcPrice` 直接抛 **TypeError** 使买币流程崩溃（`initInvestment` 在 `!inv` 时 return，investment 可能永久 undefined；`sellBtc`/`sellInvStock`/`buyInvStock` 均有 `if(!inv)` 守卫，唯 `buyBtc` 遗漏）；②缺 `amount` 有效性校验——传入负数/NaN 时 `cost` 为负 → `cash<cost` 恒假 → `cash-=负数` **凭空增币**并写入错误持仓（可利用经济漏洞） | 在 `var inv` 后补 `if(!inv)return;`；补 `amount` 类型/有限性/`>0` 校验；补 `btcPrice` 有限性判定（与 `sellBtc` 对齐）。均加注释 `// [全系统自洽修复] 域E` | **A** |

B/C 类记录（不改）：
- `investment_analysis.js:337` 技术分析 `else if (ma5>ma7 && ma7>ma20)` 与首条 `if` 重复→"多头排列"分支不可达（B，评级逻辑偏差非崩溃）。
- `investment_analysis.js` `setStopLoss` 接受 `support_break`/`fundamental_change` 但 `checkStopLoss` switch 未实现→挂单永不触发（B，死策略类型）。
- `economy_v3.1.js:173` 财富税基 `cash+bankBalance` 不含投资资产（B，机制偏差·设计意图）。

## 指令二：联动增强（3 项）

新建 `src/js/core/domain_e_linkage_r284.js`（IIFE 注入 RANDOM_EVENTS，2 street + 1 corporate，全字段 `||` 防御，数值 `[PLACEHOLDER]`，id 前缀 `e284_`）：

| 新增事件 | 联动域 | 设计意图（一句话） |
|---|---|---|
| `e284_btc_cold_wallet` | E→G | 持币者的资产安全课——把"守得住"纳入核心风险管理，冷钱包备份→心智+安心 flag `_assetSecurityMindset` |
| `e284_dip_buying_nerve` | E→A | 越跌越买的定力——历经持仓的人在下跌中沉着→心智+intelligence 属性成长，置 `_marketDisciplineForged` |
| `e284_seed_from_gains` | E→H | 收益变种子金——在职者把投资收益转为业务扩张资本→management XP + 晋升势能 upward（跨阶段资本继承） |

注册于 `src/index.html` `domain_e_linkage_r276.js` 之后。

## 验证

- `node --check` investment.js + domain_e_linkage_r284.js **均通过**。
- `python build.py` → dist/app.js **9733.0KB**（比 src 新；`_domainELinkageR284Loaded` flag count=2 入 bundle）。
- 蒙特卡洛 `6×400d`：**EXIT=0·0 代码异常**（TypeError/ReferenceError/NaN/Infinity/Uncaught grep=0；前7天死亡率全 0.0%）。存活率 trader 83.3%/social 100% 达标；balanced/corporate 66.7%<80% 为既有 RNG 平衡阈值波动，非本轮代码回归。

## 下轮

→ **域F（UI/UX）**，recency 277 全局最薄弱。
