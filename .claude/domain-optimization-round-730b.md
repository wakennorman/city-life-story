# R730b 域D（NPC/社交）— 好感奖励承诺兑现专轮（本窗口自动化，b后缀避让并行R730）

日期：2026-07-29 03:5x ~ 04:0x
选域依据：git log 实测 recency A=722/B=723/C=724/D=725/E=726b/F=727/G=728/H=729（并行第三轮循环全刷过，差距<7轮）；
决胜依据：本窗口权威 A类净尽账中域D是唯一从未深审过的域（并行 D 轮次均为浅层联动）→ R730b 域D。

## 核心发现（本轮主题：好感积累零回报=域D A类原型缺陷）

npcs.js affinityRewards 系统性审计：78个NPC / 103个奖励flag，其中 **27个flag写入后全库零读取**。
其中5个承诺**具体数值收益**却零兑现（伤害玩家信任最深，A类）；其余为解锁型/叙事型（B/C类记账）。

## A类修复清单（5 flag × 3文件）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/data/jobs.js (delivery_rider payCalc) | huangPriorityOrders承诺"配送收入+10%"/huangEbike"+15%"/xiaochenDeliveryTips"+10%"，flag写后全库零读取 | payCalc 内 `state.flags||{}` 守卫后乘性兑现 ×1.10/×1.15/×1.10 | A |
| src/js/data/jobs.js (package_delivery payCalc) | 同上三flag对"快递配送"职业同样零兑现 | 同样乘性兑现 | A |
| src/js/phase1/illness.js:142后 | wangHealthTips（王医生好感30）承诺"生病概率-5%"零兑现 | 证书减免锚点后 `ch *= 0.95`（在0.95 clamp之前，安全） | A |
| src/js/phase1/actions_extra.js:1932前 | linCheapVeg（林阿姨好感30）承诺"食材价格-10%"零兑现 | priceMod ×0.9 单点兑现（该price同时供显示与按钮实付传参，显示实付同源） | A |

技法：jobs.js（CRLF混合）/illness.js（BOM）均 Python 字节级正则替换（行尾无关模式），diff 收敛 21 行。

## 联动增强清单（3项，src/js/core/domain_d_linkage_r730b.js，均street，maxRepeats:1+done-flag防重）

| 事件 | 联动 | 消费的写-only flag | 设计意图 |
|---|---|---|---|
| d730b_chen_ge_intel 陈哥的内部消息 | D→E | chenGeInfoAccess/chenGeExclusiveInfo/chenGeTrusted（好感60/80/95）首读 | 禀赋效应：人脉兑现为低买高卖现金收益，trusted层级双倍兑现好感95承诺 |
| d730b_wang_free_checkup 王医生的免费体检 | D→G | wangFreeCheckup（好感80）首读 | 峰终定律：兑现为 medical.healthCheckDone 健康基线，接入 illness.js 既有消费点（大病概率×0.5真实机制收益） |
| d730b_zhaojie_renewal 赵姐的改造内幕 | D→E | zhaojieUrbanRenewal（好感80，承诺"避免被动涨租"）首读 | 损失厌恶：把"避免损失"做实为锁租省钱；housing.tier>0 条件保证叙事成立 |

防御自检：met检查全过（chen_ge/dr_wang/zhaojie）；好感走 applyAffinityChange；显名 getNpcDisplayName；
randInt 走 Random.int（缺失回退Math.random）；现金 resources.cash / 幸福 needs.happiness 真实字段；
conditions 全 false 时事件不触发，叙事无悬空。挂载 src/index.html:1820。

## B/C类记账（不改，留后续轮次）

- B类：wuBeautyClients/wuBeautyShop 承诺"美容工作/美容院"，但全库不存在任何美容职业（承诺解锁不存在的内容）→ 需新建职业，超本轮范围。
- B类：huangStationManager(管理岗)/xiaochenNightDelivery(夜间配送)/xiaochenDispatcher(物流工作→logistics_driver已存在但用_logisticsJobOffer不同flag,可桥接)/linVegStand(菜摊)/zhaoApprentice(汽修)/xiaoliAssistant+xiaoliOwnAccount(直播)/chenSideJob(银行兼职)——解锁型承诺零兑现共约10个。
- C类：linVegTips/wangPriority(医院AP-2)/wangFreeCheckup已消费/zhaojiePriorityViewing/chenBankInfo/bossLiLoan/xiaomeiModelJob/chenGeSearchingAjie/ajieGivenExtension/ajieMovedOn/chefChenWillOpen/zhaojieWillOpenStore 等叙事型。
- 域D素材账（下轮候选富矿）：上述解锁型flag桥接既有职业（xiaochenDispatcher→_logisticsJobOffer 一行桥）价值最高。

## 验证

- node --check：jobs.js/illness.js/actions_extra.js/domain_d_linkage_r730b.js 全过。
- build.py：dist/app.js 13436.1KB，d730b×18 / R730b×7 入包。
- MC 10×500d：见提交信息（0代码异常/前7天死亡率0%达标）。
