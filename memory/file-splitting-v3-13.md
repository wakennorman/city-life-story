---
name: file-splitting-v3-13
description: P1 超大文件按主题拆分 — events_street/startup/render 三组拆分
metadata:
  type: reference
---

## 文件拆分架构（v3.13, 2026-07-04）

拆分原则：**同位置多连续子文件替换** — 不更改 index.html 整体 script 顺序，单行变多行。

### events_street.js (9,894 行 → 0 行)

原文件为单一 IIFE 推入 `RANDOM_EVENTS` 数组，拆为 3 个独立 IIFE 文件：

| 文件                        | 行数  | 主题                                   |
| --------------------------- | ----- | -------------------------------------- |
| `events_street_survival.js` | 3,271 | 生存/日常事件（拾荒/盗窃/求助/摆摊）   |
| `events_street_wealth.js`   | 3,355 | 财富/商机事件（房地产/投资/批发/赌博） |
| `events_street_life.js`     | 3,287 | 社会/人生事件（人情/社区/人生节点）    |

index.html 位置：`js/core/` 段（原第525行）

### started.js (14,444 行 → 12,317 行)

| 文件                 | 行数   | 内容                                                            |
| -------------------- | ------ | --------------------------------------------------------------- |
| `startup_data.js`    | 2,126  | 全部数据常量（行业/员工/融资/投资人/董事会/公关/法律/产品类别） |
| `startup.js`（重写） | 12,317 | 核心逻辑函数（注册/研发/招聘/融资/运营/UI）                     |

index.html 位置：`js/phase2/` 段（原第637行）

### render.js (7,056 行 → 4,702 行)

| 文件                | 行数  | 内容                                                                |
| ------------------- | ----- | ------------------------------------------------------------------- |
| `render_core.js`    | 1,218 | 核心渲染（utils/header/sidebar/tabBar）                             |
| `render_infra.js`   | 1,137 | 中间层（scrollAnchor/renderCurrentTab/LifeSystems/Stats/Time/Goal） |
| `render.js`（重写） | 4,702 | Tab 渲染器（Actions/Map/Trade/Inventory/Skills/Corp）               |

index.html 位置：`js/ui/` 段（原第652行）

### 下一步优化方向

- **startup.js 仍 12,317 行** — 可进一步拆分为 `startup_core.js`（注册/产品/招聘/融资）+ `startup_ops.js`（董事会/法律/公关/危机）+ `startup_market.js`（市场份额/竞争对手）
- **render.js 仍 4,702 行** — Trade Tab 独占大量篇幅（~800行），可单独提取
