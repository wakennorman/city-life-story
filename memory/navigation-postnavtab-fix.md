---
name: navigation-postnavtab-fix
description: 导航系统修复 - 添加 navTab 支持，培训中心导航直达技能Tab
metadata:
  type: reference
---

## 修复内容（2026-07-06）

### 问题
- "前往培训中心训练技能"导航按钮点击后，到达培训中心却切换到"行动"Tab，玩家无法立即训练技能
- "前往培训中心"系列导航都存在同样的问题
- 导航系统缺少"到达目的地后切换到指定Tab"的能力

### 修复方案
1. **`navigation.js` `_doNavigate`**: 新增 `target.navTab` 字段支持，到达后切换到指定Tab（默认"actions"）
2. **`navActionButton`**: 新增 `opts.navTab` 参数传入 `target.navTab`
3. **`render.js`**: 技能训练门控按钮 → `{ navTab: "skills" }`
4. **`wiki.js` `_wikiAutoAppendNav`**: 所有类别导航按钮添加 `navTab` 字段
   - locations → `navTab: "map"`
   - npcs → `navTab: "social"`
   - items/goods → `navTab: "trade"`
   - skills/certs → `navTab: "skills"`
5. **`career_dev.js`**: 大学城提升学历 → `{ navTab: "personal_growth" }`

### 约定式自动归类原则
所有导航按钮通过 `_wikiAutoAppendNav` 自动生成，新增数据条目无需修改导航代码：
- 技能/证书 → 自动导航到培训中心 + 技能Tab
- 商品/物品 → 自动导航到购买地点 + 交易Tab
- 地点 → 自动导航到该地点 + 地图Tab
- NPC → 自动导航到NPC所在位置 + 社交Tab
- 地点/工作/NPC/物品的 `navHints` 字段支持自定义导航

**关联记忆**: [[convention-over-configuration-methodology]]