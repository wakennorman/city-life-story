# 域优化轮次 R589 — 域E 经济/投资

日期：2026-07-28 | 域：E（经济/投资）| 依据：linkage 轮号 recency，E(r578) 全域最陈旧

## 轮号说明
- 开轮时 loop-state 标 lastRound=587/next=E；扫描发现并行窗口在途活轮 R588（domain_e_linkage_r588.js 已 staged + 挂载），按"在途活轮不占用"原则本轮顺延为 R589。
- 对并行在途 r588 仅做一处假键防回潮修复（finance→english），未动其事件逻辑。

## 指令一：A类修复（22处 / 19文件）— 假技能键第四次回潮全库清剿
真实12键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social。
假键 marketing/technology/trade/finance 传入 addSkillXp 会静默丢弃XP（UI提示获得XP但实际未加）= A类"死技能"。

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| domain_a_linkage_r583.js:96,102 | 6键假数组(marketing/technology/trade)×2 | →["accounting","management","social","coding","sales"] | A |
| domain_c_linkage_r574.js:46,107 | 同上×2 | 同上 | A |
| domain_c_linkage_r586.js:48 | 同上×1 | 同上 | A |
| domain_a_linkage_r468.js:94 | 数组含"trade" | trade→social | A |
| domain_a_linkage_r482.js:94 | 同上 | 同上 | A |
| domain_b_linkage_r483.js:95 | 同上 | 同上 | A |
| domain_b_linkage_r490.js:94 | 同上 | 同上 | A |
| domain_d_linkage_r479.js:128 | 同上 | 同上 | A |
| domain_f_linkage_r471.js:91 | 同上 | 同上 | A |
| domain_f_linkage_r477.js:96 | 同上 | 同上 | A |
| domain_f_linkage_r485.js:90 | 同上 | 同上 | A |
| domain_f_linkage_r486.js:94 | 同上 | 同上 | A |
| domain_g_linkage_r472.js:36 | 同上 | 同上 | A |
| domain_g_linkage_r478.js:89 | 同上 | 同上 | A |
| domain_g_linkage_r487.js:65,97 | 同上×2 | 同上 | A |
| domain_e_linkage_r570.js:64 | 数组含"finance" | finance→english(accounting已在数组防重复) | A |
| domain_e_linkage_r577.js:64 | 同上 | 同上 | A |
| domain_e_linkage_r588.js:64(并行在途) | 同上 | 同上（防落库回潮） | A |
| domain_b_linkage_r584.js:67 | addSkillXp("technology",5)直接调用 | →coding | A |

修复后全库 grep 假键数组/直接调用 = 0 活命中（仅存修复注释）。

域E核心文件复查（investment/stock/property_market/startup/finance）：
- stock.js avgPrice 除零已有守卫（前轮修）；finance.js dtI 除法上游有 monthlyIncome<=0 早退守卫 → 无新A类。
- B类0 / C类0 新增记录。

## 指令二：联动增强（3项）— domain_e_linkage_r589.js
| 事件 | 联动 | 首消费flag | 设计意图 |
|---|---|---|---|
| e589_first_stock_anniversary 股龄满月 | E→B | _firstStockDay(investment.js:1752,此前全库零读取) | 峰终定律：给"第一次买股"补记忆锚点，30天后复盘/纪念分叉 |
| e589_confidence_to_raise 底气变现 | E→C | _investCareerConfidence(investment.js:1415,此前仅一次性消息) | 禀赋效应→行动转化：资产底气兑现为职场谈判行动，phase:corporate |
| e589_wealth_circle_invite 理财请教 | E→D | _investSocialPerception(investment.js:1428,此前仅一次性好感) | 社会比较双面性：熟人求荐股的社交抉择，met守卫+applyAffinityChange |

防御：全部 || 守卫、typeof 检查、firstMetNpc met 遍历、getNpcDisplayName 显名、excludeFlags 冷却、maxRepeats:1、显式 phase。

## 验证
- node --check：20文件全过
- build：dist/app.js 12051.6KB，_domainELinkageR589Loaded=2（闭合）
- MC：见 CLAUDE.md 本轮行
