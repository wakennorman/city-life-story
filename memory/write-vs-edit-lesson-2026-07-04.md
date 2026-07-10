---
name: write-vs-edit-lesson-2026-07-04
description: 误用 Write 覆盖整个文件导致 switchTab 等核心函数丢失的调试教训
metadata:
  type: feedback
---

## 事故：2026-07-04 TAB_RENDERERS 修复中误删 switchTab

**现象：** 修复 TAB_RENDERERS 后，Tab 点击依然不工作。

**根因：** 使用 `Write` 工具只写了 TAB_RENDERERS 内容，但 `Write` **覆盖了整个文件**，导致 `render_core.js` 从 1217 行变为 49 行。`switchTab`、`renderAll`、`renderTabBar`、`renderHeader`、`renderSidebar` 等核心函数全部丢失。

**教训：**

- `Write` = 全文件覆盖。只适合**创建新文件**。
- `Edit` = 精确替换。适合**修改文件部分内容**。`old_string` 必须唯一匹配。
- 涉及文件拆分/大范围移动时优先用 `Edit` + 精确匹配。

**事后验证步骤：**

1. 修复后必须验证关键函数存在：`switchTab`、`renderAll` 等
2. `node --check` 语法检查
3. `python build.py` 构建验证
4. grep 确认 dist 中包含修复后的代码

**修复耗时：** ~15分钟（从 git 恢复 + 重新 Edit + 构建 + 推送）
