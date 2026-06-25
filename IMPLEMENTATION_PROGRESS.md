# v3.7 进度总控

> 每完成一步，把 ❌ 改成 ✅
> 下个 Agent 读这个就知道从哪继续

| # | 任务 | 状态 | 说明 |
|---|------|------|------|
| 0 | P0（副业/经济/开支/链式事件） | ✅ | commit a33af08 |
| 1 | P1-1 新闻→投资UI | ✅ | investment.js：今日市场驱动板块 |
| 2 | P1-2 NPC好感链路 | ✅ | npcs.js + npc_event_bridge.js：affinityEvents 30/60/80 |
| 3 | P1-4 家庭系统 | ✅ | family_life.js：NPC求婚 + 生子/子女教育 |
| 4 | P1-6 35岁危机追访 | ✅ | events_core.js：c35_追访权重×3 |
| 5 | P2-4 道德事件扩充 | ✅ | moral_events.js：基线重建18个极端生存事件 |
| 6 | 社交网络UI集成 | ❌ | social_network.js → render.js |
| 7 | 扩展系统 | ❌ | 旅行/医疗/法律/人生节点 + main.js重构 |

## 已提交

- 155da2b — P1-3 scaleEventReward + P1-5 rollEquipmentDrop + social_network.js骨架
- 1bb3a22 — 进度文档
- 本次提交 — P1-1 新闻→投资UI：今日市场驱动板块
- 本次提交 — P1-2 NPC好感链路：affinityEvents + checkNpcAffinityEvents
- 本次提交 — P1-4 家庭系统：NPC求婚 + 生子/子女教育
- 本次提交 — P1-6 35岁危机追访：追访事件权重×3
- 本次提交 — P2-4 道德事件扩充：18个极端生存困境
