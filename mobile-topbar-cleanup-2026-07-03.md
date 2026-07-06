---
name: mobile-topbar-cleanup-2026-07-03
description: 2026-07-03 移动端顶栏精简 + 阶段文案动态化改动记录
metadata:
  type: project
---

2026-07-03 完成移动端顶栏精简（commit `d0e6501` + `2f90da4`，netlify deploy `6a46aef993084a6387c2001a`）。

**改动要点**：

1. 删除 `renderTitleBar` 函数（render.js:1978）及其调用（render.js:1262）
2. 品牌号「🏙️ 城市浮生记 v1.0」移至侧栏底部 `.sidebar-version-footer`（index.html 内 `<aside>` 末尾）
3. 隐藏顶部重复的露宿街头紧急提示（整组删掉，locationBar 已含住所信息）
4. 位置+背包行（🎒X/Y · 🌃住所💡升级提示）上移一行，间隔收紧（gap 8→4，padding 4/12→3/8）
5. 住所名+升级提示组成 `rightGroup`（gap:2px，margin-left:auto 右对齐）
6. 状态条标签由单字恢复为两字（体质/智力/敏捷/心智/魅力、饥饿/疲劳/卫生/心情/健康）
7. 视觉放大：label width 16→26px，font-size 9→10px，track height 4→5px
8. `daily_quest.js` 新增 `_dynamicNextDesc(stage, state)`：debt 阶段按实际债务动态生成文案

**Why:** 用户反馈顶栏信息重复、空间浪费；"还清债务"文案不适用于无债剧本（classic/second_gen）。

**How to apply:** 移动端顶栏结构已稳定为 时间槽 / 位置背包 / 状态条 / 目标 / 新闻 / Tab 内容。未来改动不要恢复 `renderTitleBar`，品牌号在侧栏底部维护。阶段提示文案走 `_dynamicNextDesc` 函数，新增阶段时记得加分支。

相关：[[mobile-design-principles]]
