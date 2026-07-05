---
name: navigation-system-v1
description: 全游戏统一导航系统 (navigation.js) 的设计原则和API
metadata:
  type: reference
---

# 全游戏导航系统 (navigation.js) 设计文档

## 核心API

所有导航通过 `navigateTo(state, target, opts)` 统一入口，自动处理：
1. 目标可达性检查（阶段限制、资源检查）
2. 资源消耗确认弹窗（行动力/金钱不足自动阻止）
3. 实际执行导航（tab切换 / 地点旅行 / wiki跳转 / 子Tab导航）

## 导航类型

| `target.type` | 说明 | 必填字段 |
|---------------|------|----------|
| `tab` | 切换到指定Tab | `name` (tab名) |
| `location` | 前往某地点（含AP消耗） | `key` (地点key) |
| `wiki` | 百科条目跳转 | `cat`, `entry` |
| `subTab` | 子Tab导航 | `tab`, `subTab` |
| `action` | 执行游戏行动 | `actionId` |

## 快捷函数

- `navToTab(tabName)` — 免确认Tab切换
- `navToLocation(locKey, opts)` — 地点旅行（带确认弹窗）
- `navToWiki(catId, entryId)` — 百科跳转
- `navToEducation()` — 学历子面板
- `navToUniversity()` — 去大学城备考

## 链接生成器

- `navLink(target, label)` — 生成内联导航链接
- `navActionButton(type, key, label, opts)` — 生成按钮
- `navQuickLinks([{target, label}, ...])` — 生成快速跳转区域

## 重要修复

**Tab按钮无点击事件**：原代码中所有 `#tab-bar .tab-btn` 没有 click handler。`initTabNavigation()` 通过事件委托修复（在 navigation.js 底部自动执行）。

**导航断链修复**：`career_dev.js` 的 "去大学城备考" 按钮原使用 `document.querySelector('[data-tab=action]')?.click()` hack，改为 `navActionButton("location", "school", ...)`。

## 设计原则

1. **一站式入口**：所有导航最终调用 `navigateTo()`，方便添加日志/分析/限制
2. **先检后行**：检查可达性 → 检查资源 → 确认弹窗 → 执行
3. **不可跳过的弹窗**：showModal 不允许点击外部关闭，强制玩家选择
4. **精确消耗显示**：弹窗中显示AP/现金具体消耗数值

## 相关记忆

参考 [[city-life-story-wiki-update-rule]]（百科更新规则）