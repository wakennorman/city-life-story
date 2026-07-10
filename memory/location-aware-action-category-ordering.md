---
name: location-aware-action-category-ordering
description: 16个地点按功能优先级的行动分类重排系统
metadata:
  type: reference
---

## 地点感知行动分类重排系统（v3.12）

在 `action_sort.js` 中定义的 `LOCATION_CATEGORY_REORDER` 映射表，让玩家在16个地点看到的「行动」Tab 分类顺序与所在地点功能匹配。

### 核心设计

每个地点定义了8个分类的完整优先级数组（排除了「其他」）：

| 地点            | 置顶分类  | 完整顺序                                                         |
| --------------- | --------- | ---------------------------------------------------------------- |
| bank            | finance   | finance→survival→work→social→education→career→appliance→shopping |
| hospital        | survival  | survival→work→education→social→finance→career→appliance→shopping |
| school          | education | education→social→work→survival→finance→career→appliance→shopping |
| trainingCenter  | education | education→career→work→survival→finance→social→appliance→shopping |
| park            | social    | social→survival→work→education→finance→career→appliance→shopping |
| techPark        | career    | career→education→work→finance→survival→social→appliance→shopping |
| slum            | survival  | survival→work→shopping→education→social→finance→career→appliance |
| wholesaleMarket | shopping  | shopping→work→finance→survival→social→education→career→appliance |
| construction    | work      | work→survival→shopping→education→social→finance→career→appliance |
| factoryZone     | work      | work→survival→shopping→education→social→finance→career→appliance |
| commercialDist  | work      | work→shopping→social→survival→finance→education→career→appliance |
| entertainment   | social    | social→shopping→work→survival→finance→education→career→appliance |
| suburb          | survival  | survival→work→shopping→education→social→finance→career→appliance |
| gov_office      | appliance | appliance→finance→survival→work→social→education→career→shopping |
| temple          | social    | social→survival→education→work→finance→career→appliance→shopping |

### 实现方式

- `getCategoryOrder(categoryId, locationId)` — 可选地点参数，命中重排则返回重排索引
- `getLocationCategories(locationId)` — 返回按地点排序的 CATEGORIES 数组副本（供UI渲染）
- `getLocationCategoryHint(locationId)` — 返回6种幽默策略提示文案
- `sortActions(actions, state)` — 自动从 `state.trade.currentLocation` 提取地点

### 参考设计

- 《大多数》地点功能聚焦：不同地点功能入口不同
- 《Stardew Valley》场景感知UI：工具/行动随位置变化
- 《Material Design 3》自适应UI：场景驱动信息层级
- 《Apple HIG》情境感知：最相关内容最先呈现
