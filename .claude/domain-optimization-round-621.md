# 域优化轮次 R621 — 域E 经济/投资

日期：2026-07-28 | 执行：WorkBuddy 自动化轮 | 域选择依据：recency A602/B619/C620/D597/E598/F599/G610/H601 → E 最陈旧（开轮 grep 曾漏检 r598/f599，已用全量对账修正）

## 一、修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/core/domain_c_linkage_r596.js:168 | `addSkillXp("strength")` 假技能键（真实12键无strength），玩家花¥500办健身卡承诺的"体质XP+10"静默丢弃 | 改写真实形象维度 `personalGrowth.image.fitness`（+10，含结构守卫，同R599修复先例） | A |
| src/js/core/state.js:89 | `investFreq` 注释写"累计交易次数"，但 phase2/investment.js 买卖时实际累加 shares（股数），语义误导后续开发 | 修正注释为"累计交易股数"并标注实际写入方 | B |
| src/index.html（核查） | 疑似11处悬空挂载（js/data/ 路径 domain_*_r173~r307） | **误报撤回**：文件实际存在于 `src/js/data/`（对账脚本只扫了 js/core/），非悬空，零改动。教训：悬空对账必须同时扫 core+data 两目录 | — |

域E核心文件（investment/stock/finance/property_market/startup）经6轮净尽，死字段黑名单全库 grep 0 活命中；假技能键回潮第五次复查 0 命中。本轮 A类=1（跨文件）。

## 二、增强清单（domain_e_linkage_r621.js，3项）

主题：`stats.investFreq`（{symbol: 累计交易股数}）**全库首事件消费**——该行为统计定义以来仅被 sort_utils 排序与一处"非空"判断使用，三大维度从未进入叙事层。

| 新增内容 | 事件id | 联动域 | 设计意图 |
|---|---|---|---|
| 营业部的熟面孔（单标的深度≥300股→券商客户经理递名片，接受人脉 vs 保持独立） | e621_heavy_trader_regular | E→D | 交易深度兑现为社交资本，沉淀 `_e621BrokerContact` 供后续消费（禀赋效应+人脉叙事） |
| 不把鸡蛋放一个篮子（标的广度≥4只→分散心得变职场复盘方法论，corporate） | e621_diversify_lesson | E→C | 投资纪律迁移为职业能力（管理/会计XP），复用 `_dataInvestorMindset` 生态 |
| 手痒的代价（交易总量≥1500股→频繁交易自省，冷静期 vs 继续做T） | e621_trade_addiction_check | E→G | 损失厌恶教学+心智生命回响，沉淀 `_e621TradeDiscipline`（行为金融学：过度交易） |

防御自检：全||守卫、snapInvestFreq 统一快照（isFinite+>0过滤）、conditions 全 false 时叙事仍合理、maxRepeats:1+excludeFlags 冷却、2 street+1 corporate、无假技能键（sales/accounting/management 均真实）。

## 三、验证

- node --check：r621/r596/state.js 全过
- build.py：dist/app.js 12277.1KB，r621 flag bundle grep=2 闭合
- 蒙特卡洛：见提交信息（0 TypeError/ReferenceError/NaN/Infinity 为过关线）

## 四、并行协同记录

本轮执行期间并行窗口连推3提交（R620域D/R599域F/sync），并把本窗口 r596+state.js 修复以"集成提交"扫入 e9659fee——开轮 MEMORY.md 预期场景，`git show HEAD` 核实实质已落库，未重做源码。本轮独立提交仅含：r621 新文件+挂载+dist重建+账本。
