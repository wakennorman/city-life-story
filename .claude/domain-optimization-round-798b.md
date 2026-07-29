# R798b — 域H Phase2/公司 深审（本窗口自动化 2026-07-29 14:4x）

## 选域依据
- git log 实测本窗口深审 recency：H 上次深审 R712b，全域最陈旧（A=R770b 次之）。
- 并行在途 `domain_c_linkage_r798.js`（未提交新文件+挂载已入 HEAD 区域）→ 本轮 **b后缀 R798b** 避让；在途 `corporate_npc_events.js`(+1行) 一律不碰。

## A类修复（2处）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/core/domain_h_linkage_r795.js | `h795_corporate_legend_narrative` 读 `company.fundingRound`(单数)——全库不存在，真实字段为 `fundingRounds` 数组(startup.js:552/1601)；`_round` 恒兜底 "seed" → B轮传奇事件永不可达（死事件） | 改为 `Array.isArray(fundingRounds) && length>=2`（对齐 startup.js:1742-1750 轮次推导：>=2 即 B 轮） | A |
| src/js/phase2/startup.js（3处） | R795 补写 `startup.active=true` 后，三条退出路径（IPO 6345 / 被收购 6604 / 破产 6655）均未复位 → 公司清算/卖掉后 24+ 个门控 `st.startup.active` 的联动事件（r775/r789/r786 等只查 active 不查 company）仍触发"创业中"叙事 | 三处 `flags.exited=true` 后补 `startup.active=false`，生命周期闭环 | A |

## 审计净尽项（勿重复审）
- 死字段黑名单：域H全文件 grep=0。
- r713~r795 共14个并行H文件：挂载全1/phase全3=ids/技能键仅 management/accounting/social 全真实。
- r795/r787/r783/r773/r771 引用字段核验：valuation/fundingRounds/active/fame/mental/charm/intelligence/status.health/needs.fatigue 全真实（fundingRound 单数除外，已修）。
- STARTUP_FIELD_MAP 白名单含 revenue（R193 已补），startup_events effect 键无越界。
- startup.active=true 写入点唯一（startup.js:742，R795），本轮补齐 false 三写入点。

## 联动增强（3项，domain_h_linkage_events_r798b.js，3×corporate，已挂载 index.html:1563）
| 事件 | 联动 | 消费素材 | 设计意图 |
|---|---|---|---|
| h798b_routine_payoff | H→G | `_h698Sleep`/`_h698Focus` 全库首读 | 作息/专注承诺在尽调周兑现——峰终定律 |
| h798b_sprint_feedback | H→E | `_h712bSprintPlan` 全库首读 | 凌晨三点的KPI方案被董事会采纳，shareholderTrust/morale落地——付出被看见 |
| h798b_delegation_growth | H→D | `_h712bDelegated` 全库首读 | 授权文化开花：团队独立平舆情；employees.length≥2 门控+met铁律NPC联动——禀赋效应 |

域H写-only素材账（_h698Sleep/_h698Focus/_h712bSprintPlan/_h712bDelegated）本轮清零。

## 验证
- node --check ×3 全过。
- build：见 loop-state（吸入并行在途 corporate_npc_events.js → 按铁律 dist 不提交，由并行下次 build 闭合）。
- MC：见 loop-state 记录。

## 富矿留存（下轮可选）
- company.efficiency 仍事件层零引用（news_system/linkage 少量读，startup.js 无写方——先核写方再消费）。
- startup.flags.exitValue 仅 achievements/enterprise_fate 消费，事件层无"退出后的人生"叙事（B231 只做了倒闭回望）。
