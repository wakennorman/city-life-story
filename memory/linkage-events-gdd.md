# 跨系统联动事件 GDD（设计规格文档）

> 模块: `src/js/core/cross_system_events.js`
> 版本: v3.59 / v3.60 / loop-R1 / loop-R2 / loop-R3 累计 17 个联动事件
> 最后更新: 2026-07-09
> 目的: 落实「日常开发」循环目标——**加强多方关联度**。每个事件都把至少一个次级系统(天赋/技能/NPC关系/天气/声望/道德/名声/经济)与随机事件系统连接,制造涌现式玩法。

设计原则（贯穿全部 17 个事件）:

- 全部用 `conditions(st)` 函数门控，规避 A 类自洽缺陷（NPC 事件带 `met`+`affinity` 守卫；天气事件校验 `st.weather.current`；无职业/天气裸奔叙述）。
- `probability` 稀有转折 ≤0.02，普通遭遇 0.03–0.06，日常插曲 ≤0.10。
- 数值均为 `[PLACEHOLDER]`，待 playtest 调参。
- 链式后续（如有）用 `queueChainEvent(st, followUpId, delayDays)`。

---

## 1. `morality_wallet_honest` — 捡到钱包（诚信侧）

- **Purpose**: 让高道德玩家的「善」在随机事件中产生正反馈，强化道德→长期回响闭环。
- **Player Fantasy**: 我是个老实人，做对的事会有好报。
- **Trigger**: `st.player.morality >= 70`
- **Outputs**: 现金小幅 + / 名声 + / 某 NPC 好感 +(归还对象)
- **Edge Cases**: 道德恰好 70 边界；已触发过（`repeatable:false`）。
- **Tuning Levers**: 道德阈值、回报现金量 `[PLACEHOLDER]`、名声增量。
- **Dependencies**: 道德系统、名声系统、NPC 关系。

## 2. `morality_wallet_keep` — 捡到钱包（利己侧）

- **Purpose**: 与 honest 侧成对，低道德玩家走利己分叉，制造人设差异。
- **Player Fantasy**: 穷怕了，这钱我先花了。
- **Trigger**: `st.player.morality <= 30`
- **Outputs**: 现金中 + / 道德 - / 潜在后续「失主寻来」负事件钩子。
- **Edge Cases**: 道德边界 30；与 honest 互斥（同条件区间不重叠）。
- **Tuning Levers**: 现金量、道德惩罚值。
- **Dependencies**: 道德系统、后续链事件。

## 3. `hunger_streak_neighbor_meal` — 邻居的一碗饭

- **Purpose**: 把「连续低饱食」的负面状态转化为温情时刻，奖励逆境坚持。
- **Player Fantasy**: 最难的时候，有人递了碗热饭。
- **Trigger**: `st.flags._habits.lowHungerStreak >= 3`（连续 3 天饥饿<阈值）
- **Outputs**: 饱食 + / 某邻居 NPC 好感 +(首次结识则 `met=true`)
- **Edge Cases**: streak 计数与每日管线重置逻辑的时序；好感溢出封顶。
- **Tuning Levers**: streak 阈值(3)、饱食回复量 `[PLACEHOLDER]`。
- **Dependencies**: needs 系统、NPC 关系、每日管线(streak 累加)。

## 4. `coding_scam_spot` — 识破骗局

- **Purpose**: 技能门槛解锁「专业人士视角」——coding 够高时能识别打着技术幌子的骗局。
- **Player Fantasy**: 我是懂行的，这种套路骗不到我。
- **Trigger**: `st.skills.coding.level >= 40`
- **Outputs**: 避免现金损失 / 名声 +(识破) / 可选反制获利。
- **Edge Cases**: coding 恰好 40；玩家已负债时避免损失的相对价值更高。
- **Tuning Levers**: 技能阈值(40)、潜在骗局损失额 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统、财务系统。

## 5. `xiaoli_brand_deal` — 小丽的品牌单

- **Purpose**: NPC 深度好感(≥60)解锁隐藏商机，奖励长期经营关系。
- **Player Fantasy**: 靠谱的朋友把赚钱机会介绍给我。
- **Trigger**: `st.relationships.xiaoli.met && affinity >= 60`
- **Outputs**: 长期代运营收入机会 / 名声 + / 好感 +。
- **Edge Cases**: xiaoli 未结识（守卫拦截）；好感边界 60。
- **Tuning Levers**: 好感阈值(60)、合同月收入 `[PLACEHOLDER]`。
- **Dependencies**: NPC 关系、副业/收入系统。⚠️ `xiaoli` 当前在 npcs.js 仍为 TODO 未激活——事件已就位，待 NPC 激活后生效。

## 6. `skill_synergy_restaurant_offer` — 餐馆合伙邀约

- **Purpose**: 多技能协同——烹饪+销售双门槛触发「被看见」的职业机会。
- **Player Fantasy**: 我的手艺+嘴皮子，被人看中了。
- **Trigger**: `st.skills.cooking.level >= 20 && st.skills.sales.level >= 10`
- **Outputs**: 餐馆合伙选项 / 现金流改善 / 可选入股。
- **Edge Cases**: 仅满足单技能不触发；已在职时选项变为「兼职」。
- **Tuning Levers**: 双阈值、合伙分红 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统、职业/收入系统。

## 7. `bank_vip_treatment` — 银行VIP待遇

- **Purpose**: 资产累积解锁地点(银行)深度交互，把「存钱」变成身份。
- **Player Fantasy**: 存款够了，柜员开始叫我先生。
- **Trigger**: `st.resources.cash >= 5000`（或存款总额）
- **Outputs**: 理财费率优惠 / 专属额度 / 好感(老陈)。
- **Edge Cases**: 现金刚过 5000；负债时永不触发。
- **Tuning Levers**: 资产阈值(5000)、优惠幅度 `[PLACEHOLDER]`。
- **Dependencies**: 财务系统、地点(银行)系统、NPC 老陈。

## 8. `regular_customer_discount` — 熟客折扣

- **Purpose**: 行动频次累积→熟客经济，奖励重复行为（行为经济学：承诺一致性）。
- **Player Fantasy**: 老板记得我，给我老价钱。
- **Trigger**: `st.stats.actionFreq >= 10`（某类行动累计次数）
- **Outputs**: 日常消费折扣 / 好感 +。
- **Edge Cases**: 频次统计口径（按地点 or 按行动类型）；折扣后现金流改善幅度。
- **Tuning Levers**: 频次阈值(10)、折扣率 `[PLACEHOLDER]`。
- **Dependencies**: 行为统计系统、经济系统、NPC。

## 9. `talent_cook_management_class` — 社区厨艺课

- **Purpose**: 天赋系统↔社区副业经济。点亮「厨艺管理」天赋后，被社区邀请开课。
- **Player Fantasy**: 我的天赋被社会需要，变成了副业。
- **Trigger**: `st.talentNodes['cook_management']` 已点亮
- **Outputs**: 稳定课酬 / 名声 + / 好感(社区)。
- **Edge Cases**: 天赋未点亮（守卫拦截）；天赋重置时事件沉寂。
- **Tuning Levers**: 课酬 `[PLACEHOLDER]`、开课频率。
- **Dependencies**: 天赋树系统(skill_tree.js)、副业经济、社区地点。

## 10. `skill_english_column` — 外文专栏

- **Purpose**: 修复原死事件(`skill_writing_column` 引用了 state.js 不存在的 `skills.writing`)。改用真实技能 `english`，连接技能→内容变现。
- **Player Fantasy**: 我的外语能力，让我能接外媒约稿。
- **Trigger**: `st.skills.english.level >= 30`
- **Outputs**: 稿费现金 + / 名声 +。
- **Edge Cases**: english 恰好 30；与 coding 路线形成不同变现轴。
- **Tuning Levers**: 技能阈值(30)、稿费 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统、名声系统、财务。
- **⚠️ 修复记录**: 原 `skill_writing_column` 因 `skills.writing` 不存在而**永不触发**(死事件)，v3.1-loop-R3 改为 `english` 并重命名。

## 11. `npc_oldzhou_toolloan` — 老周借工具

- **Purpose**: NPC 中阶好感(≥55)解锁实物资源援助，奖励关系经营。
- **Player Fantasy**: 熟人乐意把家伙借我，省一笔。
- **Trigger**: `st.relationships.old_zhou.met && affinity >= 55`
- **Outputs**: 免费/低价获得工具（资产+）/ 好感 +。
- **Edge Cases**: 老周未结识（守卫）；好感边界 55；重复触发需冷却。
- **Tuning Levers**: 好感阈值(55)、工具价值 `[PLACEHOLDER]`。
- **Dependencies**: NPC 关系、资产系统。

## 12. `morality_extreme_blacklist` — 极端利己的回响

- **Purpose**: 道德≤15 的极端分叉长期回响，与 high 侧(`morality_wallet_honest`)形成完整道德光谱闭环。
- **Player Fantasy**: 我一路损人利己，终于被列入「不方便来往」名单。
- **Trigger**: `st.player.morality <= 15`
- **Outputs**: 某渠道关闭 / 机会成本 / 可选「洗白」救赎支线钩子。
- **Edge Cases**: 与 `morality_wallet_keep`(≤30) 区间重叠——用更严苛阈值(15)区分「一般利己」与「极端」；洗白支线需单独事件。
- **Tuning Levers**: 道德阈值(15)、封锁强度 `[PLACEHOLDER]`。
- **Dependencies**: 道德系统、机会/渠道系统、后续链事件。

## 13. `weather_rainy_umbrella` — 雨天的偶遇

- **Purpose**: 天气系统↔情境事件。雨天触发偶遇/心情变化，增加世界鲜活感。
- **Player Fantasy**: 一把伞，串起一段缘分或一丝暖意。
- **Trigger**: `st.weather.current === 'rainy'`（或 stormy）
- **Outputs**: 心情 + / 偶遇 NPC 好感 +(首次则 met) / 可选物资。
- **Edge Cases**: 天气系统未初始化（守卫 `st.weather &&`）；非雨天不触发。
- **Tuning Levers**: 触发天气类型、心情增量 `[PLACEHOLDER]`。
- **Dependencies**: 天气系统、needs 系统、NPC 关系。

## 14. `fame_high_interview` — 媒体曝光

- **Purpose**: 名声系统爆发点。名声≥60 触发媒体采访，把声望转化为杠杆。
- **Player Fantasy**: 我有点名气了，媒体来找我。
- **Trigger**: `st.player.fame >= 60`
- **Outputs**: 名声大 + / 现金(采访费) / 可选话题选择分支。
- **Edge Cases**: 名声边界 60；负面名声路径不触发（需另设）。
- **Tuning Levers**: 名声阈值(60)、采访费 `[PLACEHOLDER]`。
- **Dependencies**: 名声系统、财务、叙事分支。

## 15. `reputation_high_callup` — 老客户回头

- **Purpose**: 声望系统↔职业/收入。某地点副业口碑(按地点 key)≥50 触发老客户长期合作。
- **Player Fantasy**: 口碑传开了，老主顾主动找上门。
- **Trigger**: `st.reputation[locKey] >= 50`（locKey 为当前/常用地点）
- **Outputs**: 长期合作收入 / 名声 + / 好感(客户)。
- **Edge Cases**: `st.reputation` 是**按地点 key 的对象**(非标量)——条件须指定具体 locKey；地点无口碑记录时守卫 `st.reputation && st.reputation[locKey]`。
- **Tuning Levers**: 口碑阈值(50)、合作单价 `[PLACEHOLDER]`。
- **Dependencies**: 声望系统(地点维度)、职业/收入、NPC。
- **⚠️ 字段约定**: `st.reputation` 为 `{[locKey]: 0..100}`，写条件前必须确认 locKey 存在。

## 16. `indie_dev_side_project` — 独立开发副业

- **Purpose**: 双技能协同↔被动收入。coding≥30 且 english≥25 解锁独立开发(接海外单/做产品)。
- **Player Fantasy**: 两个硬技能叠起来，我能在业余做出能卖的东西。
- **Trigger**: `st.skills.coding.level >= 30 && st.skills.english.level >= 25`
- **Outputs**: 被动/副业收入 / 名声 + / 可选产品上线分支。
- **Edge Cases**: 仅满足单技能不触发；与 `skill_english_column`(纯写作变现)形成技能路线差异。
- **Tuning Levers**: 双阈值、副业月收入 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统(双轴)、财务、名声。

## 17. `oldzhou_80_legacy` — 老周的传家渠道

- **Purpose**: NPC 顶层好感(挚友级 ≥80)解锁高价回收/稀缺渠道，奖励极致关系经营。
- **Player Fantasy**: 老周把我当自己人，给了别人拿不到的门路。
- **Trigger**: `st.relationships.old_zhou.met && affinity >= 80`
- **Outputs**: 高价回收渠道 / 稀缺物资获取 / 好感 +。
- **Edge Cases**: 与 `npc_oldzhou_toolloan`(≥55) 阶梯递进——80 为挚友级额外解锁；好感边界 80。
- **Tuning Levers**: 好感阈值(80)、渠道溢价 `[PLACEHOLDER]`。
- **Dependencies**: NPC 关系(分层)、经济/资产系统。

---

## 系统覆盖矩阵（验证「加强关联度」达成度）

| 次级系统  | 已联动事件数 | 事件 id                                                                                                                                                              |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 道德系统  | 4            | morality_wallet_honest / keep / extreme_blacklist (+ high 侧闭环)                                                                                                    |
| 技能系统  | 7            | coding_scam_spot / skill_synergy_restaurant_offer / skill_english_column / talent_cook_management_class / indie_dev_side_project / (cooking/sales/english/coding 轴) |
| NPC 关系  | 5            | xiaoli_brand_deal / npc_oldzhou_toolloan / oldzhou_80_legacy / hunger_streak_neighbor_meal / weather_rainy_umbrella                                                  |
| 天气系统  | 1            | weather_rainy_umbrella                                                                                                                                               |
| 声望系统  | 2            | reputation_high_callup / fame_high_interview                                                                                                                         |
| 经济/资产 | 5            | bank_vip_treatment / regular_customer_discount / oldzhou_80_legacy / indie_dev_side_project / xiaoli_brand_deal                                                      |
| 天赋系统  | 1            | talent_cook_management_class                                                                                                                                         |
| 名声系统  | 3            | morality_wallet_honest / skill_english_column / fame_high_interview                                                                                                  |

**空白区（待后续循环填补）**:

- 时代变迁(era)联动——`state.js` 无 `era*` 字段，需先在状态层落地。
- needs 阈值爆发（除饥饿外：连续低心情/低睡眠）。
- 更多双技能协同组合（repair+management、sales+accounting 等）。
- `xiaoli`/`auntie_lin`/`master_zhao` 激活后，对应深度好感事件才真正生效。

## 数值平衡备注（全部 `[PLACEHOLDER]`）

- 现金奖励区间建议：日常插曲 ¥200–800，稀有转折 ¥800–3000，长期合作月入 `[按难度曲线建模]`。
- 名声/好感增量建议：单次 +3~+10，封顶 100。
- 所有阈值(道德/技能/好感/资产/频次)为 v1 假设，需 Monte Carlo 跑通各玩家路径后定稿。
