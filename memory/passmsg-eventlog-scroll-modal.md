---
name: passmsg-eventlog-scroll-modal
description: v3.2a+b 修复 — passMsg/工资分离/事件滚动/弹窗/条件不足弹窗/现金提示/顶栏按钮
metadata:
  type: project
---

## v3.2a 四项修复（2026-07-06）

### 1. passMsg 未定义 → 面试崩溃（P0）
所有职业路径的"投递简历（含面试）"按钮点击后无声无息，console 抛出 `ReferenceError: passMsg is not defined`。修复后构建入职成功消息文字。

### 2. 工资混在要求中
`renderPromotionReqs` 把薪资当"要求"显示。移除后工资在卡片标题区独立展示。

### 3. 事件记录不自动滚动
`scrollMessageLogToBottom` 只在用户已接近底部时滚动。`renderMessageLog` 加入新条目检测（对比 `_prevEntryCount`），有新条目时 `force=true` 强制滚到底。

### 4. 导航按钮弹窗
`showCareerNavModal` / `showLocationNavModal` / `showStudyNavModal` 三个辅助函数，接受任意 subTab/location 参数实现约定式复用。

## v3.2b 四项修复（2026-07-06）

### 5. 职业卡片条件不足无反馈
`checkCareerPromotion` 返回 false 时卡片显示"条件不足"但点击无反应。新增 `showCareerRequirementsModal` 逆向检查所有缺失条件（年龄/学历/技能/属性），逐项显示 ✅/❌ + 当前值。已注册到 window 供 inline onclick 使用。

### 6. 现金偏差调试提示外露
`daily_report.js` 的 "现金比已记录流水少 ¥XX" 是开发调试信息，改为仅 console.log 记录，不再展示给玩家。

### 7. 顶栏5个按钮无点击反应
btn-help/save/load/new-game-header/mobile-menu-btn 共5个按钮完全渲染但有零事件绑定。已绑定：save→showSaveMenu(), load→showLoadMenu(), help→showHelpModal(), new-game→confirm+location.reload(), mobile-menu→toggle sidebar.

### 8. 全局静默点击审计
搜索所有 button 元素 + onclick 属性 + cursor:pointer 元素，全部 data-* 属性绑定/事件委托均有对应监听，未发现其他遗漏的点击交互。

**关联记忆**: [[interview-balance-v3.2]], [[navigation-postnavtab-fix]], [[city-life-story-project-status]]

## v3.2c 三项修复（2026-07-07）

### 9. 投递简历无可见反馈（P0）
所有职业路径的"📄 投递简历（含面试）"点击后仅有侧栏消息，玩家看不到任何弹窗提示 → 感觉"没反应"。
**根因**：`enhancedApplyCareerJob` 面试成功/失败均只调用 `StateManager.addMessage`。
**修复**：面试成功/失败各弹模态窗，显示面试成功率、不利因素列表、下一提示。
- 失败弹窗：❌ 图标 + 成功率% + 逐项不利因素（饥饿 -12%/疲劳 -6%/无固定住所 -15% 等）
- 成功弹窗：🎉 图标 + 职位 + 月薪 + 试用期说明 + 成功率%

### 10. 刚开局即可投递正式工作（体验缺陷）
第0天就能投递仓储分拣/服务员等正式工作，25%基础成功率 → 有时"马上面试成功"。
**修复**：新增最低3天经验门槛，未满3天弹出引导弹窗"⏳ 经验不足"，建议去"⚡ 行动"做日结工作。

### 11. 辞职后不自动切回求职面板
`resignCareerJob` 清空 `currentJob` 后只调 `renderAll()`，但子Tab可能停在"总览/创业"而非"上班族" → 玩家看不到职业卡片。
**修复**：辞职后自动设置 `state._careerSubTab = "career_jobs"`，面板立刻显示可投递列表。

**额外防御**：`enhancedApplyCareerJob`/`resignCareerJob`/`showCareerRequirementsModal_Global` 均包裹 try-catch 避免静默崩溃。

**关联记忆**: [[city-life-story-project-status]]