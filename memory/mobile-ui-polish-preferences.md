---
name: mobile-ui-polish-preferences
description: 用户确认的移动端 UI 改进偏好 — 位置栏高度/☰菜单/事件记录自动滚动与折叠/框动效
metadata:
  type: feedback
  source: 2026-07-10 用户反馈确认
---

## 用户确认的 UI 偏好

### 1. 位置栏高度（非扁平）

- 手机端位置栏（背包/住所行）必须有足够高度，不扁不塌
- 基准：`padding:6px 10px; min-height:32px; font-size:12px`
- 窄屏降级：`<480px` → `padding:5px 8px; min-height:34px`, `<360px` → `padding:4px 6px; min-height:30px`
- 内容溢出用 `overflow: hidden; text-overflow: ellipsis` 处理，不换行
- **Why**: 文字阅读舒适度，手指触控面积足够
- **How to apply**: 新增位置栏元素时确保 `min-height` 不低于 30px，`padding` 垂直方向不低于 4px

### 2. ☰ 侧栏菜单必须可靠打开

- 使用 `onclick="toggleSidebar()"` + 独立全局函数，而非 inline IIFE
- 同时由 JS `bindHeaderButtons` 绑定事件兜底
- 点击侧栏外部区域自动关闭
- **Why**: inline IIFE 在部分环境/浏览器下 onclick 不生效
- **How to apply**: 任何新按钮都使用 `onclick="函数名()"` 而非 `onclick="(function(){...})()"` 模式

### 3. 事件记录自动滚动到最新

- 每次渲染事件记录后，自动 `scrollToTop`（最新事件在最上方，逆序渲染）
- 桌面端和移动端均需此行为
- **Why**: 用户查看事件记录时默认看到最新事件，减少操作步骤
- **How to apply**: `renderMessageLog` 末尾必须调用 `scrollMessageLogToTop()`

### 4. 移动端事件记录默认折叠，可展开/收起

- 移动端（<=768px）事件记录首次渲染默认折叠 🟰 只显示前 3 条
- 折叠状态显示"📌 展开"按钮 + 最新一条预览行
- 展开后显示全部，按钮变为"📌 收起"
- 点击预览行也可展开
- **Why**: 手机屏幕空间有限，聊天式日志应默认精简
- **How to apply**: 新增 `/ui/render.js` 的 `renderMessageLog` 已实现，直接复用，无需额外调整

### 5. 框的动效好，保持

- 用户明确表示卡片/按钮的微动效（触摸反馈 scale、脉冲边框等）效果很好，不需修改
- 具体包括：`action-card:active scale(0.95)`、`tab-btn:active scale(0.92)`、`.card-hot-pulse` 脉冲边框等
- **Why**: 微动效提供触觉反馈，提升操作确定感
- **How to apply**: 新增交互元素时参照 `style.css` 中已有的 `:active` 和动效 class 模式

### 关联文件

- `src/js/ui/render.js` → `renderMessageLog` + `scrollMessageLogToTop`
- `src/js/ui/render_infra.js` → `renderCurrentTab` 中调用 `renderLocationBar`
- `src/css/style.css` → `.mobile-location-strip` / `#message-log.collapsed` / `:active scale` 动效
- `src/index.html` → `toggleSidebar()` 函数 + 点击外部关闭
