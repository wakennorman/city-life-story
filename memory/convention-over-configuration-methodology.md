---
name: convention-over-configuration-methodology
description: 约定式自动归类(CoC)元架构原则 — 自指：CoC对自身也生效，新系统按约定自动归入
metadata:
  type: project
  project: city-life-story
---

## 约定式自动归类 — 元架构原则（v3.36 确立）

**CoC 不仅是内容的归类原则，也是系统本身的架构原则。**

### 核心信条

1. **数据声明优先（Declarative > Imperative）**：数据自己描述自己需要什么，系统自动匹配
2. **系统自动发现（Auto-Discovery）**：直接扫描数据源，不维护独立注册表
3. **约定优于配置（Convention > Configuration）**：默认行为合理，特殊需求才加配置
4. **渐进式增强（Progressive Enhancement）**：纯数据驱动解决80%，剩下的20%用函数覆盖

### 自指（Self-Reference）

> CoC 对自身也生效。

当开发者添加**一个新系统**时，该系统自身也应遵循 CoC 自动归入游戏架构，无需修改已有代码：

| 新系统需要做什么 | CoC 方式                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| 注册数据文件     | 放在 `data/` 下，命名 `data/<system>.js`，导出标准格式数组/对象               |
| 注册 Tab 入口    | 在 `TAB_RENDERERS` 或 `_initTabStructure` 加一条声明，不写条件判断            |
| 注册管线步骤     | 在 `daily_pipeline.js` 的 `PIPELINE_STEPS` 加一行 ID，函数文件自行导出        |
| 注册百科条目     | 在实现文件末尾追加 `MECHANICS.<id>` 注册块，或在 `mechanics_registry.js` 追加 |
| 注册导航入口     | 数据条目加 `navHints` 字段，或通过 `navActionButton` 标准 API                 |
| 注册事件/触发    | 事件数据对象声明 `conditions/apply` 字段，`loadAll` 自动注册到触发槽          |

### 判断标准

新系统添加后，**不需要修改任何已有的渲染/导航/注册代码**。只新增文件 + 按约定格式声明字段。

如果不得不改旧文件来适配新系统，说明 CoC 链路有断点，需要先补齐约定再交付。

### 链接记忆

- [[action-sort-system]] — 行动加 category 字段即自动分组
- [[help-system-v3.36]] — 帮助弹窗中 CoC 显性化展示
