---
name: ui-status-bar-reorg
description: UI状态栏从两行居中改为单行左对齐，人生目标从侧边栏移至内容区
metadata:
  node_type: memory
  type: reference
  originSessionId: 2ae4661c-9b05-4b05-b3b9-e684f8cf72d1
---

**改动**：

1. `renderTimeSlot()` 从 `flex-direction:column` 两行布局改为单行 `display:flex;align-items:center` 横排左对齐
   - 格式：`📅 第 N 天 | ☀️ 上午 ⚡ 100/100 🎒 0/20 · 🌃 露宿街头`
   - 低AP闪烁警告保持，但改为紧凑的 ⚠ 图标
2. 人生目标从侧边栏（`renderDreamSection`）移至内容区时间槽下方
   - 新建 `renderGoalStrip()` 函数：紧凑横条，带进度条和称号
   - 侧边栏 renderDreamSection 注释保留（`// 人生目标已移到内容区`）
3. 手机端 CSS 适配：`#time-slot-indicator` 改为 `overflow-x:auto` 支持横向滚动

**改动文件**：

- `render.js` — renderTimeSlot + renderGoalStrip + renderSidebar
- `style.css` — 手机端 media query

**Why**: 用户反馈两行居中占用空间大且不直观，人生目标深埋侧边栏不可见。参考 Notion 紧凑状态栏和《大多数》顶部信息条。

**关联**：[[property-housing-integration]]
