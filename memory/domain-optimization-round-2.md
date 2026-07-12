---
name: domain-optimization-round-2
description: 全系统优化 域B(事件/叙事) — 28个A类缺陷修复 + 6项B类修复 + 2新增联动事件
metadata:
  type: project
---

## 域B 事件/叙事 — 全系统优化第二轮 (v3.97)

**日期**: 2026-07-12
**域**: B (事件/叙事)
**轮次**: R2 (继域A之后)

### 指令一：A类缺陷修复（28个）

| 文件                        | A类 | 修复内容                                                                                                                                                                                                      |
| --------------------------- | --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| events_core.js              | 2   | ① showEventModal空choices数组卡死(添加Array.isArray+length守卫) ② checkChainEventQueue splice正向遍历跳过元素(添加i--)                                                                                        |
| extra_events.js             | 12  | ① 6处扣款缺失(phone_stolen报警/买二手/crisis_debt_collector/old_friend_borrow×2/neighbor_gift) ② 5个NPC断链(aunt_wang/boss_li/sister_zhang/old_zhou/chef_chen加met门控) ③ 1个Random.int二次调用修复(变量复用) |
| era_events.js               | 6   | 6个NPC断链(era_180/270/450/540/720/900均缺sister_zhang/aunt_wang/boss_li/xiao_mei/old_zhou/sister_zhang met门控)                                                                                              |
| side_hustle_consequences.js | 2   | side_daigou_referral/side_tutor_recruit缺_isChainEvent标志，可被随机选取发放免费金钱                                                                                                                          |
| npc_event_bridge.js         | 3   | ① chatWithNpc使用state.npcRelationships不存在字段(应state.relationships)完全失效 ② EVENT_NPC_MAP中wholesale_bargain重复键 ③ mental_breakdown_edge重复键                                                       |
| events_corp.js              | 1   | insider_report买入¥500,000股票从未扣款                                                                                                                                                                        |
| cross_system_events.js      | 2   | npc_rescue_aunt_wang/npc_synergy_old_zhou_deal缺met门控                                                                                                                                                       |

### 指令二：联动增强（6项B类修复+2新增事件）

**B类修复**:

- 3处模板字面量bug(cross_system_events.js: market_crash_opportunity/moral_finding_money/npc_synergy_old_zhou_deal `" + profit + "`→`${profit}`)
- 2个职业事件phase修正(career_promo_offer/career_layoff phase:"street"→"corporate")
- edu_graduation_ceremony冗余顶层apply删除
- workplace_social_events 5处双随机门控清除(conditions内Random.chance删除)

**新增事件**:

- `corporate_first_quarter_reflection` — corporate≥180天+在职→职场回望/老周叙事闭环/朋友圈/继续干活三选一
- `npc_sister_zhang_corp_congrats` — corporate≥150天+张姐已认识好感≥20→跨阶段NPC祝贺/请客/忙改天

**why**: 事件文件经过多轮patch已累积大量自洽修复注释，但仍有旧格式/遗漏。本轮地毯式覆盖全部21个事件文件，原以为A类不多但发现28个，大多数是"cost未扣款"和"NPC断链"两类。

**how to apply**: 本轮的A类修复集中在conditions加met门控、apply加cash扣减、event engine加防御性检查。下轮域C(职业/成长)建议检查技能树和career_dev的数值断裂。
