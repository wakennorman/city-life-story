# 域优化轮次 R457（联动文件名保留r455——挂载行已被并行64b98ff3扫入main） — 域D (NPC/社交) 第N轮

日期：2026-07-27 · 窗口：WorkBuddy 自动化 · 上一轮基准：R456(域G, 64b98ff3)。同轮救援孤儿 domain_e_linkage_r453.js(挂载在main文件缺失)+集成并行c448假键修复(technology→coding)

## 一、A类缺陷修复清单（6处）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/core/domain_d_linkage_r440.js | 老陈(lao_chen)3事件只写flag、从不置met/好感 → NPC定义存在但永不进关系图谱（好感积累零回报） | 5个choice全部接入 applyAffinityChange(st,"lao_chen",N,reason) 正规入口 | A |
| src/js/core/domain_b_linkage_r442.js | 小薇(xiao_wei)事件同样只写 _xiaoWeiMet flag 不接好感系统 | 2个choice接入 applyAffinityChange(st,"xiao_wei",N,reason) | A |
| src/js/core/npc_relationships.js | lao_chen/xiao_wei 不在 NPC_RELATION_MATRIX → initNpcRelationships 不建条目，关系链/传播/图谱/生日全忽略（R245 old_ma 同款缺陷） | 矩阵补2条目（含社区/夜市社交圈定位：老陈↔王姨friendly/老周old_acquaintance；小薇↔陈师傅friendly/李老板business）+ RELATION_PROPAGATION 补2条目 | A |
| src/js/core/events_core.js:717 | **29个联动文件**采用 `text: function(st)` 动态叙述惯例，但渲染层只读 `evt.story` 从不调用 text() → story 中 `{desc}` 占位符**原样泄漏给玩家**（UI文案破损，波及 r420~r454 几乎全部近期联动事件） | showEventModal 渲染处优先调用 evt.text(state)，try/catch 失败回退 story（一处修复全局复活动态叙述） | A |
| src/js/core/domain_f_linkage_r442.js | 3处 story 含 `{desc}`（渲染层修复前泄漏；修复后作为 fallback 仍不自足） | story 改写为自足文案（text() 优先生效，story 成干净兜底） | A |
| src/js/core/npc_relationships.js checkNpcRelationEventTriggers | npcA 只查 affinity 无 met 守卫（npcB 有）——初始好感溢出(体质/魅力加成最高6)理论上不会到30，但防御性不一致 | 补齐 npcA met 守卫，与 npcB 对称 | B(顺手) |

## 二、联动增强清单（3项，src/js/core/domain_d_linkage_r455.js）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| d455_fans_micro_fame | D→E/F | **playerFans 全库首事件消费**——粉丝破100微网红时刻，接推广变现（现金+掉粉代价）vs 保持真实（心智+涨粉），给网红经济新玩法加引导 |
| d455_crisis_ally | D→G | **舆论危机全库首事件层消费**（此前仅daily_pipeline静默tick）——好感≥60的NPC公开声援降低severity，社交资本兑现，峰终定律的"终"时刻 |
| d455_npc_feed_comment | D→B | **npcFeeds 全库首事件消费**——深夜刷到已结识NPC动态，走心评论/点赞→线上互动反哺线下好感（met铁律+applyAffinityChange正规入口） |

防御自检：st.socialNetwork/舆论危机/npcFeeds 全部存在性守卫；Array.isArray；met铁律；applyAffinityChange位置参数正确；数值[PLACEHOLDER]；conditions全false（无社交网络状态）时事件不出场，叙事自洽；repeatable:false+excludeFlags冷却。

## 三、验证
- node --check 6文件全过
- python build.py → dist/app.js 11082.8KB（d455_×N、lao_chen矩阵条目均在dist）
- MC 6×400d：见提交信息（要求0代码异常）

## 四、素材账本（供后续轮次）
- 社交网络零消费字段仍剩：weiboPosts（声明后全库零读写，纯死字段，建议删除或接发博玩法）、playerFollowers（同）、npcRelationshipLog.decayDay（低危死字段）
- weiboHotlist 已有消费者；playerFans/舆论危机/npcFeeds 本轮已首消费
- 并行窗口速度极快（R450→R454 一小时内5轮），本轮开工时为R451、提交前已被占到R454 → 改号R455。判 recency 只看 git log。
