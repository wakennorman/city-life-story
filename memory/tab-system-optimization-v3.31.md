---
name: tab-system-optimization-v3.31
description: Tab切换系统全面优化 — 子Tab内容积累/社交返回/装备导航/全局审计
metadata:
  type: feedback
---

# Tab切换系统全面优化（v3.31，commit 24f5d91）

## 核心修复

### (1) 子Tab内容积累 → 按钮无响应

**根因**：`renderCityTab/renderMeTab/renderCareerTab/renderWikiTab` 不清理 `parent.innerHTML`，
子Tab点击直接附加新内容而不清除旧内容，导致内容堆积、旧按钮被遮盖。

**修复**：每个Tab渲染器开头加 `parent.innerHTML = ""`。

### (2) 百科Tab「社交」无法返回

**根因**：`renderWikiTab` 中 `wiki_social` 分支直接调用 `renderSocialTab(state, parent)`，
该函数 `parent.innerHTML = ""` 清除了百科子Tab导航按钮（百科/社交），导致无法返回。

**修复**：创建 `socialContainer` 子容器，`renderSocialTab` 在其中渲染，百科导航按钮保留在外层。

### (3) 我Tab「装备」导航缺失

**添加**：空装备槽位显示「🔗 去购买」按钮 → navigateTo确认弹窗 → 跳转购买地点。
**添加**：「🏪 装备采购入口」汇总区 → 按地点分组显示可购买装备种类。

### (4) 全局子容器化审计

Me/Career Tab全部子Tab改用独立子容器，防止子渲染器（renderInventoryTab/renderSkillsTab/renderCareerDevTab等）
的内层 `parent.innerHTML = ""` 清空外层子Tab导航。

**涉及渲染器**：renderInventoryTab / renderSkillsTab / renderMergedPersonalGrowthTab / renderLifeSystemsTab
renderInvestmentTab / renderAchievementsTab / renderCareerDevTab / renderSideHustleTab

### 设计参考

- Papers Please：确认弹窗模式
- Cities Skylines：右键菜单快速跳转
- 大多数（The Most）：路径引导 + 商店导航
- Stardew Valley：NPC/物品来源可追溯

## 影响文件

- `render_infra.js`：City/Me/Career Tab + 子容器化
- `render.js`：InventoryTab 装备购买导航
- `wiki.js`：SocialTab子容器 + parent.innerHTML清空
