# R594 域B 事件/叙事 — 悬空/孤儿全量对账 + 道德flag延迟回报闭环

日期：2026-07-28 03:2x｜域选择：linkage 轮号权威重算 B(r584) 全局最陈旧（B584<C586<D587<E589<F590<G591<H592<A593）

## A类修复清单（20处）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/index.html | 19 处悬空挂载：r543/r558/r561(A)、r559/r563(B)、r536/r547/r560/r567(C)、r548(D)、r538/r550(E)、r554/r565/r566(G)、r532/r541/r556/r559(H) 十九个 linkage 文件经 git log --all 逐一核查**从未创建**（并行"先写挂载、源未建"模式批量堆积）→ build.py 静默跳过 | 移除 19 行挂载，0 功能损失（dist 中亦无残留事件码可救援） | A |
| src/index.html | 孤儿文件 domain_a_linkage_r571.js：源已提交(R338期间)但从未挂载 → 3 个 a571_* 事件从未进 bundle | 全文审校（字段全真实/phase显式/id全库唯一）后挂载于 r593 之后，复活 3 事件 | A |

- 死字段黑名单（player.happiness/needs.health/player.health/certs）全库 grep 仅剩 webapp_runtime_bridge 已知误报 → 经典A类=0。
- 假技能键数组升级版复查命令 0 命中（R589 清剿未回潮）。

## 联动增强清单（3项，domain_b_linkage_r594.js）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| b594_elder_job_lead | B→C | 首消费 `_elderJobLead`（R7 moral_elder_assist 写入后零读取）：老人牵线社区兼职，善意延迟变现为职业机会（峰终定律） |
| b594_scam_stopper_fame | B→D | 首消费 `_stoppedScam`：被拦下骗局的街坊上门道谢，义举换街坊情谊（met 守卫 + applyAffinityChange 铁律） |
| b594_wholesale_channel | B→E | 首消费 `_wholesaleChannelTip`：批发渠道情报变现差价+会计XP（cash≥500 门槛防无本进货） |

全 IIFE→RANDOM_EVENTS，phase:"street"，maxRepeats:1 + interval:999 + excludeFlags 三重防重复，全 || 防御，数值 [PLACEHOLDER] 注释。

## 验证
- node --check：r594/r571 均通过。
- build.py：dist app.js 12097.9KB（r594/r571 flag 各=2；悬空引用 dist grep=0）。
- MC：见提交记录（要求 0 TypeError/ReferenceError/NaN/Infinity + 前7天死亡率0%）。

## 遗留
- moral_events 仍有 7 个写-only flag 未消费：_friendCheatWarned/_goodSleepToday/_moralAfterWorkLoaded/_neighborHasIOU/_neighborRefused/_scrapeCheckCamera/_scrapeLeftNote → 下次域B轮选题。
- 下轮：域C(r586) 与 B 之后并列陈旧带（C586<D587<E589…）。
