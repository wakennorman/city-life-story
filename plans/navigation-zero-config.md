# 导航零配置方案：按数据约定自动生成

## 问题

现在每个 `_wikiDetailXxx()` 函数末尾都手动加了 `navActionButton(...)`，新增一个地点/工作/NPC/物品类型时，开发者必须记得手动加导航链接。这违反 DRY 原则，也不可持续。

## 方案：约定式自动导航（Convention-Based Auto-Navigation）

### 核心思想

**导航链路由数据 schema 驱动，而不是由每个渲染函数手动编码。**
在 wiki 的集中渲染点 `_wikiRenderDetail()` 添加一个后处理步骤，根据 `_wikiState.catId` 和条目数据自动生成导航按钮。

### 自动规则表

| catId       | 自动生成什么                               | 数据来源                  |
| ----------- | ------------------------------------------ | ------------------------- |
| `locations` | 「🚶 前往此地」「🗺️ 在地图上查看」         | LOCATIONS[id]             |
| `jobs`      | 「🚶 前往该地工作」（跳转到 job.location） | getJobById(id).location   |
| `npcs`      | 「🚶 前往该地找TA」（跳转到 npc.location） | NPCS.find(id).location    |
| `items`     | 「🛒 去XX购买」（每个 buyLocations）       | item.buyLocations         |
| `goods`     | 「🛒 去XX购买」（每个 buyLocations）       | good.buyLocations         |
| `skills`    | 「📚 前往培训中心训练」                    | 固定 trainingCenter       |
| `certs`     | 「📚 查看关联技能」                        | certificate.skillRequired |
| 其他        | 无自动导航                                 | —                         |

### 移除手动 navActionButton 调用

清理 wiki.js 中 6 个 `_wikiDetailXxx()` 函数末尾的手动 navActionButton 代码（约 40 行），改为统一的 `_wikiAutoAppendNav()` 调用。

### 数据驱动的扩展点：`navHints` 字段

任何数据条目可添加 `navHints` 数组，自动生成额外导航按钮（不修改 wiki 渲染代码）：

```js
// 在 locations.js 中某个地点
{
  id: "school",
  name: "大学城",
  navHints: [
    { type: "tab", name: "personal_growth", subTab: "pg_edu", label: "🎓 查看学历" }
  ]
}
```

自动导航函数会：**自动导航 + navHints 合并**。

### 函数设计

```js
function _wikiAutoAppendNav(catId, entryId, detailEl, state) {
  // 1. 根据 catId 查规则表 → 自动生成导航按钮
  // 2. 查数据条目是否有 navHints → 合并额外按钮
  // 3. 如果有任何按钮，在 detailEl 尾部插入导航区
}
```

### 影响文件

| 文件             | 变更                                                         |
| ---------------- | ------------------------------------------------------------ |
| `wiki.js`        | 新增 `_wikiAutoAppendNav()`，在 `_wikiRenderDetail` 末尾调用 |
| `wiki.js`        | 移除 6 个 `_wikiDetailXxx()` 中手动 navActionButton 代码     |
| `navigation.js`  | 新增 `_autoNavRules` 注册表，可动态注册新规则                |
| 数据文件（可选） | 个别数据可加 `navHints` 字段                                 |

### 验证

- `node --check` 所有文件 ✅
- `python build.py` 成功 ✅
- 百科中查看地点/工作/NPC/物品/技能，底部自动出现导航按钮
- 新增一个位置（如给已有 NPC 新加 location），不用改 wiki 代码，导航自动出现
