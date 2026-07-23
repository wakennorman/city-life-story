# 域D优化 R184 — NPC/社交 第四轮

## 修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
| --- | --- | --- | --- |
| `npcs.js` (ajie) | `location:"random"` 使位置偶遇系统无法定位(NPC定义存在但永不触发) | schedule 改为实际地点(slum/commercialDist/entertainment) | A类 |
| `social_tab.js` | `_bindVisitBtns` 嵌套在 `renderSocialNetworkTab` 内, 仅 social_network 子Tab生效 | 提升为模块级函数, social_npc 和 social_network 子Tab均调用 | A类 |
| `npc_event_bridge.js` | `chatWithNpc` 不调用 `contextDialogue` 动态台词(字段白写不消费) | 对话时优先匹配 contextDialogue 条件, 命中则覆盖固定台词 | A类 |
| `npcs.js` (uncle_chen_bank) | deepTask choices[0] 缺少 `_npcDeepTask_uncle_chen_bank` flag, 与所有NPC不一致 | 补全 flag 初始化 + 防御性 `if(!st.flags) st.flags={}` | A类 |

## 增强清单

| 新增内容 | 文件 | 联动域 | 设计意图 |
| --- | --- | --- | --- |
| npc_chief_blood_drive | npc_linkage_r174.js | D→G | 血库告急慈善事件,已结识NPC集体广播好感+2 |
| npc_business_tipping | npc_linkage_r174.js | D→E | 高好感NPC圈分享赚钱门道,cash或skillXP收益 |
| npc_mentor_skills | npc_linkage_r174.js | D→C | 技能导师NPC私教课,花费¥100兑换顶级技能XP |

## 验证

- node --check ✅
- python build.py → dist/index.html 132.5KB + app.js 8933.4KB ✅
- git push origin/main ✅
