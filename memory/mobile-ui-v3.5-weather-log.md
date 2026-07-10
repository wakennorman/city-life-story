---
name: mobile-ui-v3.5-weather-log
description: 移动端事件记录默认3条 + 天气内联显示 + 预报交替闪烁
metadata:
  type: project
---

## v3.5 移动端优化（2026-07-04）

### 事件记录默认 3 条

使用 CSS `nth-child(n+4)` 纯方案：折叠时显示前 3 条，不足 3 条全部显示。保留 `.collapsed` 类展开/折叠机制不变。

### 天气内联显示

- **当前天气**：时间槽（时段↔AP之间）—— `☀️晴天 28°C（温暖）舒适`
- **未来预报**：位置行（住所名右侧）—— `📅☀️晴天85% 🌤️多云65%`

仅移动端 `window.innerWidth <= 768` 生效。

### 预报交替闪烁

去除 `|` 分隔符和 `📅` 图标后，`📅明日天气预报` 与预报文本交替闪烁：

- CSS `@keyframes forecastAlt`：3.6s 周期，ease-in-out 交叉淡入淡出
- `.f-label` 和 `.f-value` 互为反相（`animation-delay: 1.8s`）
- `position: absolute` + `text-overflow: ellipsis` 重叠防溢出

### 影响文件

| 文件                        | 改动                               |
| --------------------------- | ---------------------------------- |
| `src/css/style.css`         | collapsed nth-child + 交替闪烁动画 |
| `src/js/main.js`            | 预览文案更新                       |
| `src/js/ui/render_infra.js` | 时间槽天气 + 位置行预报交替        |

### 验证

- `node --check render_infra.js` ✅
- `node --check main.js` ✅
- `python build.py` (4558.4 KB) ✅
- commit: `aed977a`

**Why:** iPhone XR 用户看不到事件记录 + 天气藏在侧栏无法快速参考。
**How to apply:** 后续移动端 UI 改动保持 `window.innerWidth <= 768` 守卫，CSS 动画优先于 JS 控制。
