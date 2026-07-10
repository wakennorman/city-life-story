---
name: mobile-tab-debug-lesson-2026-07-04
description: 移动端Tab栏消失的调试教训 — 缺失`</aside>`标签导致布局偏移
metadata:
  type: reference
---

## 问题

移动端顶部 Tab 栏（行动/地图/交易/物品/技能/职场/投资等）全部消失，CSS 无任何 `display:none`，JS 无报错。

## 根因

`src/index.html` 中 `<aside id="sidebar">` 缺少 `</aside>` 关闭标签（在 commit `66c11fe` 精简侧边栏时被误删）。

- `<aside>` 在移动端是 `position: fixed; left: -100%`（隐藏在屏幕左侧外）
- 缺少 `</aside>` → 后续的 `<main>` 被某些浏览器解析为 `<aside>` 的子元素
- `<main>` 继承父元素定位 → 整个内容区（含 `#tab-bar`）被推到屏幕外

## 为什么其他 Agent 没找到

| 排查方向                                           | 结果     | 谁做了          |
| -------------------------------------------------- | -------- | --------------- |
| CSS `display:none`?                                | 无       | ✅ 查了         |
| JS 报错?                                           | 无       | ✅ 查了         |
| git 冲突残留?                                      | 清过     | ✅ 查了         |
| **DOM 结构 → 看 `<main>` 是不是在 `<aside>` 里面** | **是！** | ❌ **都没想到** |

核心教训：**调试"元素消失"时，先看 DOM 树结构，再查 CSS/JS。** 尤其要注意 `position: fixed/absolute` 的父元素——未关闭的标签会让子元素意外继承定位。

## 修复

```diff
        </div>
+      </aside>

       <!-- Main Content -->
       <main id="main">
```

**Why:** 补回 `</aside>` 后 `<main>` 正确成为 `#app` CSS Grid 的直接子代，不再被 `<aside>` 的 `left: -100%` 带偏。

**How to apply:** 在 `index.html` 中搜索 `<aside id="sidebar">`，确认它有关闭标签。对于类似"神秘消失"的布局问题，F12 → Elements 面板看 DOM 嵌套关系是最直接的排查手段。

## 相关经验

- [[long_term_lessons]] — 移动端 UI 调试注意事项
- [[deploy-netlify-to-github-pages-2026-07-03]] — 部署相关

## 相关文件

- `src/index.html` — `<aside>` 第 239 行打开，`</aside>` 第 439 行关闭
- `src/css/style.css` — 移动端 `#sidebar` 定位规则（第 3320-3333 行）
