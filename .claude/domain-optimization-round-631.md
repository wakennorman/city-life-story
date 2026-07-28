# R631 域G(核心机制/生命周期) 优化轮记录

日期：2026-07-28 | 域：G（linkage recency r622 全局最陈旧）| 轮号：R631

## 选域依据
recency 权威判定（ls src/js/core/+src/js/data/ 双目录）：g622 < h623 < a624 < b625 < c626 < d627 < e629 < f630 → 域G 最薄弱。r631 编号开轮时未被占用（并行窗口同期以 [R631] 提交域F/域G，见"并行协同"）。

## 修复清单
| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/core/domain_g_linkage_r611.js:126 | addSkillXp("strength") 假技能键（真实12键无strength）→XP静默丢弃，hint"体质XP+5"承诺落空 | 改写真实形象维度 personalGrowth.image.fitness(||30守卫,+5,上限100)，同 R599/R621 修复先例；这是 strength 假键第3次同型出现（r596→R621修、r611→本轮修），直接调用形态 grep 复查规则再次验证有效 | A |

死字段黑名单(player.happiness/needs.health/player.health/certs)全库 grep=0 活命中；skills 对象误用扫描=0；域G 经 R192~R622 多轮加固，本轮增量 A类=1（回潮型）。

## 增强清单
| 新增内容 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| g631_rock_bottom_wisdom 谷底翻身（首消费 flags._everBroke，cash≥3000 触发） | domain_g_linkage_r631.js | G→E | 峰终定律：现金归零的低谷在翻身后回放为叙事峰值，应急基金/记账/挥霍三抉择，沉淀 _g631EmergencyFund |
| g631_street_night_memory 桥洞下的身影（首消费 flags._everHomeless，housing.tier≥1 触发） | 同上 | G→D | 损失厌恶+共情：曾露宿者遇露宿者，联动 _homelessDays 计数入叙事文本 |
| g631_hunger_never_again 饥饿的教训（首消费 flags._everStarved，hunger≥50 触发） | 同上 | G→C | 曾挨饿驱动厨艺技能动机（addSkillXp("cooking") 真实键） |

三事件均 street phase、IIFE 注册 RANDOM_EVENTS、maxRepeats:1、全||防御、无 NPC 引用（泛化路人不触 rel.met）。已挂载 src/index.html:1460。

## 验证
- node --check：r631.js / r611.js 全过；全部挂载 JS 并行扫描 0 语法错误（build 期一次瞬态 SyntaxError 为并行窗口在途写文件被撞，复扫已消失）。
- build：dist 由并行窗口以相同源重建提交（HEAD dist grep r631 flag=8 闭合）。
- MC 10×500d：0 TypeError/ReferenceError/NaN/Infinity，前7天死亡率 0%（存活率<80% 为既有 RNG 阈值非回归）。

## 并行协同
本轮全部源码改动（r631.js+index.html 挂载+r611 修复）内容 IDENTICAL 被并行窗口连同 dist 重建扫入 33d00557 并推送 origin/main（其提交信息即本轮设计的三事件描述）。并行另有 203746e5 以 [R631] 提交域F（domain_f_linkage_r631.js，编号撞用但域不同、文件不同、无冲突）。本窗口仅补账本闭环提交。last_known_head 已由并行窗口对齐 33d00557。

## 遗留素材（下轮域G勿重复）
已消费：_everBroke/_everHomeless/_everStarved（本轮）+_everDepressed/_everHadIllness/_chronicMonthlyPaid（R599）。
仍写-only 12个：_cleanRecord/_currentStoryChapter/_debtFree/_everCuredIllness/_everGotSick/_everInjured/_firstSkillUpgraded/_lifeNode_choice/_pensionBase/_sandboxChallenge/_streakMaster/_wasteRecyclingReady。
