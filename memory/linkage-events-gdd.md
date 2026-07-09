# 跨系统联动事件 GDD（设计规格文档）

> 模块: `src/js/core/cross_system_events.js`
> 版本: v3.59 / v3.60 / loop-R1~~R3 / loop-R6~~R9 / loop-R11~~R13 / loop-R26~R29 累计 50 个联动事件
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
- **Dependencies**: NPC 关系、副业/收入系统。✅ `xiaoli` 已激活。

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

## 18. `repair_mgmt_outsource` — 维修外包队

- **Purpose**: 双技能协同——维修+管理双门槛触发「被小店老板推举牵头接单」，把个人手艺升级为微型团队经营。
- **Player Fantasy**: 我的手艺+排班脑子，被街坊当成能扛事的人。
- **Trigger**: `st.skills.repair.level >= 25 && st.skills.management.level >= 15`
- **Outputs**: 现金+(月分账 ¥1200) / 名声+4 / 隐性社区副业。
- **Edge Cases**: 仅满足单技能不触发；已在职时选项语义变为「兼职」。
- **Tuning Levers**: 双阈值、月分账额 `[PLACEHOLDER]`、名声增量。
- **Dependencies**: 技能系统、经济/副业系统。

## 19. `weld_elec_retrofit` — 设备改造单

- **Purpose**: 双技能协同——焊接+电工双门槛解锁「设备自动化改造」高客单机会。
- **Player Fantasy**: 我又会焊又会接电，这种改造单只有我能接。
- **Trigger**: `st.skills.welding.level >= 20 && st.skills.electrician.level >= 15`
- **Outputs**: 现金+(大额 ¥3500) / 名声+8。
- **Edge Cases**: 仅单技能不触发；`repeatable:false`(一次性改造，防刷钱)。
- **Tuning Levers**: 双阈值、改造费 `[PLACEHOLDER]`、名声增量。
- **Dependencies**: 技能系统、经济系统。

## 20. `account_sales_invoice` — 代记账客户

- **Purpose**: 双技能协同——会计+销售双门槛触发「代记账客户」稳定月入。
- **Player Fantasy**: 我懂账又懂客户，小老板们愿意把税务外包给我。
- **Trigger**: `st.skills.accounting.level >= 20 && st.skills.sales.level >= 10`
- **Outputs**: 现金+(月入 ¥900) / 名声+3。
- **Edge Cases**: 仅单技能不触发；与 repair_mgmt(维修+管理)为不同技能组合，不冲突。
- **Tuning Levers**: 双阈值、月费 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统、经济/副业系统。

## 21. `cash_low_community_gig` — 邻里零工 _(R7 新增)_

- **Purpose**: 需求阈值爆发——现金≤200 的财务危机转化为社区零工互助契机，填补「除饥饿外的 needs 阈值」空白。
- **Player Fantasy**: 最难的时候，邻里递来零活救急。
- **Trigger**: `st.resources.cash <= 200`
- **Outputs**: 现金+(小额 ¥260) / 名声+2。
- **Edge Cases**: 现金恰好 200 边界；`repeatable:true` 但门控(现金≤200)天然限流，不会无成本刷；叙事不点名具体 NPC，规避 A 类自洽缺陷。
- **Tuning Levers**: 现金阈值(200)、零工报酬 `[PLACEHOLDER]`。
- **Dependencies**: 经济系统、社区/needs 系统。

## 22. `sales_english_trade` — 外贸跟单 _(R7 新增)_

- **Purpose**: 更多双技能协同——销售+英语双门槛触发「外贸跟单」跨境副业，区别于已有的 coding+english(indie_dev)与 accounting+sales(代记账)。
- **Player Fantasy**: 我的嘴皮子+英语，能啃下跨境小单。
- **Trigger**: `st.skills.sales.level >= 15 && st.skills.english.level >= 25`
- **Outputs**: 现金+(佣金 ¥1100) / 名声+4。
- **Edge Cases**: 仅单技能不触发；与 indie_dev(coding+english)技能组合不同，不冲突。
- **Tuning Levers**: 双阈值、佣金 `[PLACEHOLDER]`。
- **Dependencies**: 技能系统、经济/副业系统。

## 23. `talent_sales_management_client` — 大客户介绍 _(R7 新增)_

- **Purpose**: 扩展天赋系统联动(此前 GDD 仅 cook_management)——`sales_management` 天赋节点激活后解锁「大客户年框」高价值资源。
- **Player Fantasy**: 我拿下销售管理天赋，圈子里开始把我当能扛盘的人。
- **Trigger**: `!!(st.talentNodes && st.talentNodes["sales_management"])`
- **Outputs**: 现金+(大额预付 ¥2600) / 名声+7(接单)或+3(仅建联)。
- **Edge Cases**: 天赋未激活则守卫拦截；与普通销售技能事件阶梯递进(天赋=更高阶回报)。
- **Tuning Levers**: 预付额 `[PLACEHOLDER]`、名声增量。
- **Dependencies**: 天赋系统(skill_tree)、经济系统。

---

## 24. `mood_low_letter_home` — 夜里的家 _(R8 新增)_

- **Purpose**: 填补 needs 阈值爆发空白区（除饥饿外）——极低心情(happiness<15)触发情绪低谷叙事分支，让心情系统产生玩法选择而非仅数值。
- **Player Fantasy**: 夜深人静时，我是会向家人伸手，还是一个人硬扛。
- **Trigger**: `st.needs.happiness < 15 && phase==street && day>=7 && 30天冷却`
- **Outputs**: 打电话→心情+12/现金-30；写信→心情+6；硬扛→心情-2/压力+3。
- **Edge Cases**: 心情≥15 守卫拦截；与 `hunger_streak_neighbor_meal` 形成 needs 双轴(饿/心情)互补。
- **Tuning Levers**: 阈值 15 `[PLACEHOLDER]`、冷却 30 天、通话花费 30。
- **Dependencies**: needs 系统、health.mental.stress。

## 25. `cooking_accounting_catering` — 盒饭生意 _(R8 新增)_

- **Purpose**: cooking+accounting 双技能协同空白区——会做饭+会算账解锁「盒饭副业」稳定收入路径。
- **Player Fantasy**: 我的手艺和算盘合起来，能养活一个小生意。
- **Trigger**: `cooking>=30 && accounting>=20 && day>=20 && !_cateringBizOn`
- **Outputs**: 接单→现金+180~~320/心情+5/开启_flag；帮衬→现金+40~~90。
- **Edge Cases**: 技能不足守卫拦截；与 `skill_synergy_restaurant_offer`(餐馆合伙)形成餐饮双路径。
- **Tuning Levers**: 收入区间、技能门槛(cooking30/acc20)。
- **Dependencies**: 技能系统、经济系统。

## 26. `coding_management_product` — 组队接外包 _(R8 新增)_

- **Purpose**: coding+management 双技能协同空白区——技术+管理双修解锁「带队接外包」高回报但有压力路径。
- **Player Fantasy**: 我不只是写代码的人，也是能把人张罗起来的人。
- **Trigger**: `coding>=30 && management>=15 && day>=25 && !_codingTeamDone`
- **Outputs**: 组队→现金+900~~1600/压力+10；solo→现金+350~~600。
- **Edge Cases**: 技能不足拦截；组队分支引入 stress 代价，形成风险/回报权衡。
- **Tuning Levers**: 收入区间、压力增量 10。
- **Dependencies**: 技能系统、health.mental.stress、经济。

## 27. `stress_high_breakdown` — 临界点 _(R8 新增)_

- **Purpose**: 填补 `health.mental.stress` 阈值空白区（此前 stress 字段存在但无事件引用）——压力≥80 触发职业倦怠临界点叙事。
- **Player Fantasy**: 我的身体在拉警报，我是停一下，还是继续冲。
- **Trigger**: `st.player.health.mental.stress >= 80 && day>=15 && 60天冷却`
- **Outputs**: 请假→压力-25/心情+5；硬扛→压力+5/physical.score-8。
- **Edge Cases**: stress<80 拦截；与 `mood_low_letter_home` 形成心理双轴(心情 vs 压力)。
- **Tuning Levers**: 阈值 80 `[PLACEHOLDER]`、压力增减量。
- **Dependencies**: health.mental 系统。

---

## 28. `era_inflation_rent_hike` — 通胀下的涨租 _(R9 新增)_

- **Purpose**: 填补时代变迁(era)联动空白区——并行窗口落地的 `era_transform.js` 已进入中后期(mature/decline)，物价工资明显变化，触发涨租抉择，让宏观系统产生微观玩法。
- **Player Fantasy**: 感受到「时代推着人走」的真实压力，做取舍。
- **Trigger**: `st._eraState.stageId === "mature" || "decline"`（约游戏 1.5 年后）。
- **Outputs**: 选项A 现金-、安稳+；选项B 现金+、fatigue+。
- **Edge Cases**: `_eraState` 未初始化时 `conditions` 返回 false（不触发）；早期阶段不出现。
- **Tuning Levers**: probability 0.04（日常插曲）、涨租差价比例 0.06、城郊补贴 80。
- **Dependencies**: era_transform 系统（读取 `_eraState`）、经济/资产、needs.fatigue。

## 29. `sister_zhang_market_tip` — 张姐的内推 _(R9 新增)_

- **Purpose**: NPC 深度好感「意外发现」空白区——张姐(sister_zhang)好感≥60 触发内推黄金摊位，把长期经营的关系变现。
- **Player Fantasy**: 关系积累到一定程度「开花结果」的惊喜。
- **Trigger**: `st.relationships.sister_zhang.met===true && affinity>=60`。
- **Outputs**: 选项A 现金+200、fame+、好感+5；选项B 好感+8、无消耗。
- **Edge Cases**: 未结识张姐不触发；好感<60 不触发。
- **Tuning Levers**: probability 0.03（稀有）、现金 200、好感增量。
- **Dependencies**: NPC 关系系统、声望/名声、经济。

## 30. `electrician_coding_smart_home` — 智能家居改装 _(R9 新增)_

- **Purpose**: 双技能协同空白区——电工≥20 + 编程≥20 解锁「智能家居改装」邻居副业，呼应「技能组合产生新机会」。
- **Player Fantasy**: 两个不相关技能突然有用武之地的「能力整合」快感。
- **Trigger**: `st.skills.electrician.level>=20 && st.skills.coding.level>=20`。
- **Outputs**: 选项A 现金+150、电工xp+25；选项B fame+、无消耗。
- **Edge Cases**: 单技能不足不触发；技能等级实时读取。
- **Tuning Levers**: probability 0.03、工钱 150、xp 25。
- **Dependencies**: 技能系统、经济、名声。

## 31. `reputation_top_influencer` — 商圈红人 _(R9 新增)_

- **Purpose**: 声望系统高阶分叉——商业区声望(`reputation.commercialDist`)≥80 触发「商圈红人」身份认同事件，给高声望玩家专属叙事。
- **Player Fantasy**: 被社区接纳、成为「自己人」的归属感。
- **Trigger**: `st.reputation.commercialDist >= 80`（注意 reputation 按地点 key 存，非标量）。
- **Outputs**: 选项A 牵头互助 fame+、商业区声望+3；选项B 低调无消耗。
- **Edge Cases**: 声望为标量旧字段时不触发（已确认新字段为 location-keyed）；未达 80 不触发。
- **Tuning Levers**: probability 0.03、fame 6、声望 3。
- **Dependencies**: 声望系统（location-keyed）、名声系统。

## 系统覆盖矩阵（验证「加强关联度」达成度）

| 次级系统  | 已联动事件数 | 事件 id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 道德系统  | 3            | morality_wallet_honest / keep / extreme_blacklist                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 技能系统  | 12           | coding_scam_spot / skill_synergy_restaurant_offer / talent_cook_management_class / skill_english_column / indie_dev_side_project / repair_mgmt_outsource / weld_elec_retrofit / account_sales_invoice / sales_english_trade / cooking_accounting_catering / coding_management_product / electrician_coding_smart_home                                                                                                                                                                                                                              |
| NPC 关系  | 8            | xiaoli_brand_deal / npc_oldzhou_toolloan / oldzhou_80_legacy / hunger_streak_neighbor_meal / weather_rainy_umbrella / sister_zhang_market_tip / snow_night_scrap_deal / oldzhou_affinity_max_heritage                                                                                                                                                                                                                                                                                                                                              |
| 天气系统  | 2            | weather_rainy_umbrella / snow_night_scrap_deal                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 声望系统  | 3            | reputation_high_callup / fame_high_interview / reputation_top_influencer                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| 经济/资产 | 21           | bank_vip_treatment / regular_customer_discount / coding_scam_spot / skill_synergy_restaurant_offer / xiaoli_brand_deal / reputation_high_callup / indie_dev_side_project / oldzhou_80_legacy / repair_mgmt_outsource / weld_elec_retrofit / account_sales_invoice / cash_low_community_gig / sales_english_trade / talent_sales_management_client / cooking_accounting_catering / coding_management_product / era_inflation_rent_hike / sister_zhang_market_tip / electrician_coding_smart_home / cert_first_job_bonus / trading_supply_demand_gap |
| 天赋系统  | 2            | talent_cook_management_class / talent_sales_management_client                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| 名声系统  | 7            | morality_wallet_honest / xiaoli_brand_deal / skill_english_column / fame_high_interview / sales_english_trade / talent_sales_management_client / sister_zhang_market_tip                                                                                                                                                                                                                                                                                                                                                                           |
| 心情/心理 | 2            | mood_low_letter_home / stress_high_breakdown                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 时代变迁  | 1            | era_inflation_rent_hike                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |

**空白区（待后续循环填补）**:

- 时代变迁(era)联动——**R9 已填**（`era_inflation_rent_hike`，依赖 `era_transform.js` 的 `st._eraState`）。
- 天气系统雪天联动——**R26 已填**（`snow_night_scrap_deal`，snow+废品站+老周）。
- 教育系统证书联动——**R26 已填**（`cert_first_job_bonus`，证书+应聘溢价+链式90天回报）。
- NPC好感100终极奖励——**R26 已填**（`oldzhou_affinity_max_heritage`，传家级人脉线）。
- 交易供需动态——**R26 已填**（`trading_supply_demand_gap`，信息差套利vs人情）。
- 更多双技能协同组合（welding+sales 报价、electrician+management 工程队 等）。
- `xiaoli`/`auntie_lin`/`master_zhao` 激活后，对应深度好感事件才真正生效。

### 指令一 A 类自洽修复记录（R8）

- **`suburb_storm_shelter`（A2 真实缺陷，已修）**：原 `conditions` 仅查 `trade.currentLocation==="suburb"`，未查天气；叙事为「豆大的雨点砸下来/暴雨庇护」，晴天在郊区也会触发，叙事断裂。已补 `st.weather.current === "rainy" || "stormy"` 门控，加 `// [自洽修复]` 注释。
- **全量扫描结论（6 文件 / 113 事件）**：A4=0（无单点 `trigger:` 绕过）；A3=0 真实（`zhou_channel_first_deal` 为 `_isChainEvent` 链式门控、`life_midcareer_reinvent` 中「老周」为过去式回忆 flavor）；A1=0 真实（14 个职业词候选逐条复核，均为技能门控/标志门控/场景 flavor/对方职业，无「玩家必须干此行才合理」前提）。

## 32. `dr_wang_health_warning` — 医生的忠告（loop-R11）

- **Purpose**: 医疗系统 + NPC 关系交叉——低健康状态触发王医生主动干预。
- **Player Fantasy**: 认识医生就是认识个健康守护者。
- **Trigger**: `st.relationships.dr_wang.met && health < 50`
- **Outputs**: 健康+10（配合治疗）/ 好感-2（硬扛）。
- **Edge Cases**: 王医生未结识不触发；dr_wang 已激活于 npcs.js。
- **Tuning Levers**: 健康阈值(50)、恢复量(10)。
- **Dependencies**: 医疗系统、NPC 关系。

## 33. `dr_wang_clinic_referral` — 便宜诊所推荐（loop-R11）

- **Purpose**: 好感积累解锁经济福利——医疗费用长期折扣。
- **Player Fantasy**: 有人脉，看病就是比普通人便宜。
- **Trigger**: `dr_wang.met && affinity >= 40`
- **Outputs**: 医疗费用-20%持续30天 / 保留机会。
- **Edge Cases**: 好感边界 40；折扣天数叠加逻辑。
- **Tuning Levers**: 好感阈值(40)、折扣率(20%)、持续天数(30)。
- **Dependencies**: NPC 关系、医疗经济系统。

## 34. `xiaochen_night_market` — 骑手的深夜食堂（loop-R12）

- **Purpose**: 小陈好感≥30触发社交剧情，填补xiaochen事件空白。
- **Player Fantasy**: 跑完单有骑手兄弟请宵夜。
- **Trigger**: `xiaochen.met && affinity >= 30`
- **Outputs**: 心情+12 / 饱食-25 / 好感+5 / 驾驶XP+15。
- **Edge Cases**: 未结识不触发；驾驶技能未初始化时跳过XP。
- **Tuning Levers**: 好感阈值(30)、恢复量。
- **Dependencies**: NPC 关系、技能系统、needs 系统。

## 35. `zhaojie_shop_tip` — 赵姐的内幕消息（loop-R12）

- **Purpose**: 赵姐好感≥50解锁商业情报，填补zhaojie事件空白。
- **Player Fantasy**: 有人脉就有信息差，信息差就是钱。
- **Trigger**: `zhaojie.met && affinity >= 50 && day >= 30`
- **Outputs**: 现金-100000解锁店面 / 或记下信息保留机会。
- **Edge Cases**: 现金不足时显示婉拒消息；已触发不重复。
- **Tuning Levers**: 好感阈值(50)、盘店价格(100000)。
- **Dependencies**: NPC 关系、财务系统、名声系统。

## 36. `chen_ge_connections` — 陈哥的人脉（loop-R13）

- **Purpose**: 填补chen_ge事件空白，好感≥35触发工地人脉推荐。
- **Player Fantasy**: 老江湖朋友给介绍活。
- **Trigger**: `chen_ge.met && affinity >= 35 && day >= 15`
- **Outputs**: 现金+280 / 名声+3 / 好感+5。
- **Edge Cases**: 未结识不触发；已触发不重复。
- **Tuning Levers**: 好感阈值(35)、工钱(280)。
- **Dependencies**: NPC 关系、财务系统、名声系统。

## 37. `ajie_side_project` — 阿杰的点子（loop-R13）

- **Purpose**: 填补ajie事件空白，好感≥40触发二手手机翻新副业。
- **Player Fantasy**: 老同学一起创业，搞副业赚钱。
- **Trigger**: `ajie.met && affinity >= 40 && day >= 20`
- **Outputs**: 现金+200~500 / 维修XP+20 / 好感+8。
- **Edge Cases**: 未结识不触发；repair技能未初始化时跳过XP。
- **Tuning Levers**: 好感阈值(40)、利润区间(200-500)。
- **Dependencies**: NPC 关系、技能系统、财务系统。

## 38. `snow_night_scrap_deal` — 雪夜废品站（loop-R26）

- **Purpose**: 填补snow天气事件空白，把"雪天+废品站地点+老周好感"三系统交联。
- **Player Fantasy**: 雪夜接手来路不明的货，靠眼力赚钱。
- **Trigger**: `weather.current === "sunny" && old_zhou.met && affinity >= 20 && trade.currentLocation === "wholesaleMarket"`
- **Outputs**: 选项A 现金+/好感+5；选项B 稳健小赚；选项C 道德+3。
- **Edge Cases**: 非雪天不触发（守卫 `weather.current === "snowy"`）；老周未结识不触发。
- **Tuning Levers**: probability 0.03、进货价 800/300、利润区间 400-1200。
- **Dependencies**: 天气系统、NPC 关系、交易系统。

## 39. `cert_first_job_bonus` — 证书的第一次兑现（loop-R26）

- **Purpose**: 教育系统×就业系统交联——持有证书时应聘触发薪资溢价事件。
- **Player Fantasy**: 考证花的那些时间，终于换回来真金白银。
- **Trigger**: `certificates.length > 0 && !employment.currentJob && day >= 10`
- **Outputs**: 选项A 现金+300~700 + 链式后续(90天后再发)；选项B 心情+10；选项C 心智+3。
- **Edge Cases**: 已在职不触发（`lookingForWork` 守卫）；无证书不触发。
- **Tuning Levers**: probability 0.04、薪资上浮 300-700、链式延迟 90 天。
- **Dependencies**: 证书系统、就业系统、经济系统。**链式后续 `cert_bonus_recurring`**。

## 40. `oldzhou_affinity_max_heritage` — 老周的信任（loop-R26）

- **Purpose**: 好感100终极奖励——深度关系兑现，解锁建材/物业/拆迁三条人脉线。
- **Player Fantasy**: 老朋友把半辈子积累的关系交给你。
- **Trigger**: `old_zhou.met && affinity >= 100 && day >= 60`
- **Outputs**: 选项A 三条商业人脉线 unlock + 名气+8 + 心情+12；选项B 感动封顶。
- **Edge Cases**: 好感恰好 100 边界；未封顶不触发。
- **Tuning Levers**: probability 0.035、人脉线数量(3)。
- **Dependencies**: NPC 关系、名声系统。

## 41. `trading_supply_demand_gap` — 市场缺货了（loop-R26）

- **Purpose**: 交易供需动态×道德分叉——低买高卖 vs 分享信息的人情。
- **Player Fantasy**: 信息差就是钱，但赚昧心钱还是赚人情由你选。
- **Trigger**: `tradeFreq 有记录 && day >= 15 && cash >= 200`
- **Outputs**: 选项A 现金+150~500 + 销售XP+15；选项B 道德+3 + 名气+2；选项C 心智+2。
- **Edge Cases**: 无交易经验不触发；现金不足 200 时第一个选项禁用（cost 门控）。
- **Tuning Levers**: probability 0.04、进货 200、利润 150-500。
- **Dependencies**: 交易统计、道德系统、名声系统。

## 42. `skill_absolute_mastery_capstone` — 一代宗匠（loop-R27）

- **Purpose**: 技能满级(level 100)的巅峰叙事，区别于≥80的「行家找上门」（被雇佣），本事件是「成为传奇被仰望」
- **Player Fantasy**: 我的手艺已经登峰造极，有人慕名而来求教。
- **Trigger**: `任一技能 level >= 100`（每技能触发一次）
- **Outputs**: 选项A 收徒（名气+10/心智+8/心情+12）；选项B 写心法（名气+15/道德+5）；选项C 淡然（心情+10）
- **Edge Cases**: 每个技能独立触发（`repeatable:true` + flag per-skill）；多技能满级可多次体验
- **Tuning Levers**: probability 0.04
- **Dependencies**: 技能系统、名声系统

## 43. `wealth_six_figure_milestone` — 六位数时刻（loop-R27）

- **Purpose**: 累计收入破¥100,000的情感里程碑（仅¥500有叙事事件）
- **Player Fantasy**: 从¥300到六位数，走过的路只有自己知道。
- **Trigger**: `totalEarned >= 100000`
- **Outputs**: 选项A 犒劳自己（心情+15）；选项B 存银行（心智+5）；选项C 报喜（心情+12/道德+2）
- **Edge Cases**: 一次性事件；与¥500的`first_earn_milestone`形成阶梯
- **Tuning Levers**: probability 0.045
- **Dependencies**: 经济系统、情感系统

## 44. `luxury_housing_new_life` — 新生活的气味（loop-R27）

- **Purpose**: 住房tier 5-6（别墅/豪宅）搬家后的里程碑叙事
- **Player Fantasy**: 从火车站的流浪汉到这扇窗前，走过了很长的路。
- **Trigger**: `housing.tier === 5 || 6` + `搬入后30天内`
- **Outputs**: 选项A 请客（心情+12/好友好感+）；选项B 独坐看夜景（心智+6/心情+8）；选项C 规划下一步（名气+3）
- **Edge Cases**: 搬入超过30天不触发；需`recordedDay`字段
- **Tuning Levers**: probability 0.04
- **Dependencies**: 住房系统、NPC关系、名声

## 45. `summer_night_market_boom` — 夏夜出摊黄金期（loop-R27）

- **Purpose**: 夏季季节叙事（填补天气有事件、季节无事件的空白）
- **Player Fantasy**: 夏天是旺季，一天顶三个月。
- **Trigger**: `weather.season === "summer"` + `day >= 30`
- **Outputs**: 选项A 出摊（收入300-700/疲劳+20）；选项B 吃喝（心情+15）；选项C 休息（疲劳-15）
- **Edge Cases**: 仅夏季触发；day<30不触发
- **Tuning Levers**: probability 0.045
- **Dependencies**: 天气季节系统、经济

## 46. `npc_reunion_auntzhou` — 巷口的老茶摊（loop-R28）

- **Purpose**: 让NPC关系网活起来——玩家目击王婶+老周（旧识关系）的私下互动，感受「NPC有自己的生活」
- **Player Fantasy**: 我在这个城市不是一个外人——连房东和废品老板认识二十年了。
- **Trigger**: `aunt_wang.met + affinity≥30 && old_zhou.met + affinity≥30`
- **Outputs**: 选项A 坐下（双好感+5/心情+8）；选项B 拍照（双好感+3/名气+3）；选项C 离开（心情+3）
- **Edge Cases**: 两NPC好感均需≥30；单次触发
- **Tuning Levers**: probability 0.035
- **Dependencies**: NPC关系矩阵（旧识关系）

## 47. `npc_competitor_clash` — 两边的火气（loop-R28）

- **Purpose**: 竞争关系→玩家被迫选边（损失厌恶·选择代价）
- **Player Fantasy**: 两个帮过我的人打架了，我只能帮一个。
- **Trigger**: `boss_li.met + aff≥20 && sister_zhang.met + aff≥20`
- **Outputs**: 选项A 帮李工头（¥500/李+8/张-5）；选项B 帮张姐（¥400/张+8/李-5）；选项C 折中（两边各¥200/疲劳+15）
- **Edge Cases**: 损失厌恶陷阱——无论怎么选都有代价；折中收入最高但疲劳代价
- **Tuning Levers**: probability 0.03
- **Dependencies**: NPC关系矩阵（竞争关系）、经济

## 48. `npc_classmate_endorsement` — 老同学的话（loop-R28）

- **Purpose**: 同窗纽带→圈内人引荐（社会认同·圈层归属感）
- **Player Fantasy**: 陈哥把我推荐给老同学——靠谱的人互相背书。
- **Trigger**: `chen_ge.met + aff≥40 && ajie.met + aff≥30`
- **Outputs**: 选项A 接受引荐（¥200-450/陈+5/阿杰+8）；选项B 观望（陈哥好感-3）；选项C 了解详情（心智+3）
- **Edge Cases**: 两人均需已结识；ajie_side_project事件的互斥分支
- **Tuning Levers**: probability 0.03
- **Dependencies**: NPC关系矩阵（同窗关系）

## 49. `health_crisis_slow_collapse` — 身体的账单（loop-R29）

- **Purpose**: 健康低于30时的慢性危机事件（区别于death事件，是预警性质）
- **Player Fantasy**: 身体在跟我算总账。
- **Trigger**: `health < 30 && health >= 5`
- **Outputs**: 选项A 看病（¥300→健康+12）；选项B 买药（¥50→健康+5）；选项C 硬扛（收入¥150-280但健康-8）
- **Edge Cases**: health<5时不触发（留给濒死事件）；损失厌恶·预警驱动
- **Tuning Levers**: probability 0.05
- **Dependencies**: 健康系统、经济

## 50. `health_near_death_reckoning` — 最后一次选择（loop-R29）

- **Purpose**: 濒死边缘(health<15)的紧急抉择（峰终定律·人生最低谷）
- **Player Fantasy**: 不干就没饭吃，干了可能没命。
- **Trigger**: `health < 15`
- **Outputs**: 选项A 打120（健康+20/负债¥1000-3000）；选项B 躺平（健康+8）；选项C 拼最后一次（50%成功否则健康-12）
- **Edge Cases**: 最负面时刻的紧张感；50%赌局制造情感冲击
- **Tuning Levers**: probability 0.06
- **Dependencies**: 健康系统、经济、债务

## 数值平衡备注（全部 `[PLACEHOLDER]`）

- 现金奖励区间建议：日常插曲 ¥200–800，稀有转折 ¥800–3000，长期合作月入 `[按难度曲线建模]`。
- 名声/好感增量建议：单次 +3~+10，封顶 100。
- 所有阈值(道德/技能/好感/资产/频次)为 v1 假设，需 Monte Carlo 跑通各玩家路径后定稿。
