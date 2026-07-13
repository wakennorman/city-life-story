---
name: convention-check-habit
description: 每次游戏项目互动后检查是否可归入约定式自动归类(CoC)系统
metadata:
  type: feedback
  established: 2026-07-13
---

# 约定式自动归类检查习惯

**用户要求**：以后每次关于 `city-life-story` 游戏项目的互动内容，在完成后都要检查该次优化是否能做，或者是否能归入"约定式自动归类"系统。

## 检查时机

每次对游戏项目做任何修改/优化/扩充后，commit 前执行一次 CoC 适用性检查。

## 检查清单

对照 [[convention-over-configuration-methodology]] 的核心信条：

- [ ] 新增数据是否可放在 `data/<system>.js` 并以标准格式导出？
- [ ] 新增 Tab 是否可通过 `TAB_RENDERERS` 声明而非修改 render.js 主体？
- [ ] 新增管线步骤是否只需在 `PIPELINE_STEPS` 加一行 ID？
- [ ] 新增百科条目是否可通过 `MECHANICS.<id>` 注册？
- [ ] 新增事件是否以数据对象式 `conditions/apply` 声明？
- [ ] **有没有"不得不改旧文件"的情况？如果有，说明框架约定有缺口，先修框架再交付。**

## 自指检查

CoC 对自身也生效——如果检查流程本身复杂，应将其自动化或工具化：
- 可考虑在 `memory/` 下维护 CoC 断链日志
- 可考虑在 commit-msg hook 中加自动提醒

## 为什么

用户明确要求：确保每次改动都经过 CoC 审视，防止系统性退化（不声明直接 if-else 打补丁）。
这也是 [[convention-over-config-v3.4]] 的核心理念——约定优于配置，数据声明优先。

**How to apply:** 每次 commit 前检查清单，若发现旧文件被修改则重新审视架构约定是否有缺口。