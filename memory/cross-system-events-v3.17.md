---
name: cross-system-events-v3.17
description: 5个跨系统联动事件+2个链式后续的完整说明（2026-07-05）
metadata:
  type: reference
---

## v3.17 跨系统联动事件扩充

### 新增事件清单

| 事件id                   | 触发条件摘要                                   | 联动系统       | 链式后续                                      |
| ------------------------ | ---------------------------------------------- | -------------- | --------------------------------------------- |
| `delivery_regular_treat` | day>30, driving≥15/agility≥28/totalEarned>2000 | 技能+天数+经济 | 无                                            |
| `skilled_eye_fake_goods` | day>15, repair≥40/electrician≥35               | 修理/电工技能  | 无                                            |
| `old_zhou_wholesale_tip` | day>40, old_zhou好感≥60, 在wholesaleMarket     | NPC好感+地点   | `zhou_channel_first_deal`（3天后）            |
| `moral_pickpocket_split` | day>10, 不重复                                 | 道德值三档分支 | `moral_pickpocket_followup_kindness`（3天后） |
| `hunger_streak_collapse` | day>10, lowHungerStreak≥3, health<50           | 需求积累+健康  | 无                                            |

### 设计意图

- **Event1**：长期劳动的玩家感受"城市开始认识你"
- **Event2**：高技能玩家在日常生活中获得实际回报
- **Event3**：NPC好感积累的实质性渠道解锁
- **Event4**：道德值不再是数字，真正影响体验
- **Event5**：需求系统不再只是数字，忽视有真实后果

### 寻找位置

所有事件在 `src/js/core/cross_system_events.js` 的 CROSS_EVENTS 数组末尾追加。链式事件追加在文件末尾（_isChainEvent: true）。

**Why:** 这批事件填补了5个明确的联动空白区：老手特遇、专业人士视角、NPC好感秘密、道德分叉、积累爆发。
**How to apply:** 后续新增类似事件继续追加到 CROSS_EVENTS 数组末尾。链式事件用 `queueChainEvent(st, eventId, delayDays)` 调度。
