---
name: action-sort-system
description: 行动选项分类排序系统 v1.7 — 分类分组+多层排序取代平铺
metadata:
  type: project
  project: city-life-story
---

为50+种游戏行动引入分类分组 + 多层排序机制，解决"其他行动"区平铺排列导航困难。

**核心文件**: `src/js/core/action_sort.js`（297行，独立IIFE模块）

**8个分类**（按显示顺序）:

| 分类     | ID        | 图标 | 顺序 |
| -------- | --------- | ---- | ---- |
| 生存必需 | survival  | 🌾   | 10   |
| 赚钱谋生 | work      | 💼   | 20   |
| 地点服务 | appliance | 🏪   | 25   |
| 购物装备 | shopping  | 🛒   | 30   |
| 学习提升 | education | 🎓   | 40   |
| 社交休闲 | social    | 🎭   | 50   |
| 金融理财 | finance   | 💳   | 60   |
| 职业发展 | career    | 🏢   | 70   |
| 其他     | other     | 📌   | 100  |

**排序层级**（优先级从高到低）:

1. 分类顺序（固定order值）
2. 同类内默认优先级（关键行动置顶，如 `eat:10`、`apply_job:10`）
3. 禁用项排同类末尾
4. 点击频次（高频优先，存 `state.stats.actionFreq`）
5. AP消耗（低消耗优先）
6. 名称拼音 `.localeCompare("zh-CN")` 保底

**分类映射策略**（三层）:

- 精确ID匹配（`EXACT_MAP`，如 `eat→survival`）> 前缀规则（`PREFIX_RULES`，如 `job_*→work`）> 兜底 `other`
- 前缀规则支持正则，如 `corp_(?!team_view$)` 排除特例

**修改文件**:

- `action_sort.js`(新建) — 分类定义、ID→分类映射、多层排序、分组函数
- `state.js`(修改) — 新增 `stats.actionFreq/actionFirstUse` + v1.7存档迁移
- `render.js`(修改) — `renderActionsTab()` 频次追踪 + 分类渲染逻辑
- `index.html`(修改) — 注册 `action_sort.js`（state.js之后）
- `style.css`(修改) — 新增 `.action-category-header` / `.cat-count` 样式

**参考**: 《大多数》(分类Tab)、《中国式家长》(功能区)、《Stardew Valley》(工具分类)

**Why**: 游戏行动从20+增长到50+种，平铺排列需要频繁滚动查找，缺乏导航结构。

**How to apply**: 新增行动时只需在 `EXACT_MAP` 或 `PREFIX_RULES` 中注册分类；需要同类置顶时在 `IN_CATEGORY_PRIORITY` 设值（数字小优先，默认50）。频次追踪由 `render.js` 自动处理。
