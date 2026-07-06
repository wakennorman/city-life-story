# Overview — 城市浮生记 v3.0 玩法师批次完善

> 执行者：玩法师（游戏设计师）
> 日期：2026-06-23
> Git commit：`99904e8`
> 上一批次：`a449020`（review v3.0 P2 改进落地）

## 本次完成 4 项修复 + 2 个 bug 修复（约 260 行代码）

### 修复1 · 地图缺失 3 个地点坐标

**问题**：`render.js:2418 positions` 只定义了 9 个地点坐标，缺 suburb / entertainment / temple 三个，导致这 3 个地点在地图网格上根本不显示节点。

**修复**：补齐三个坐标

| 地点                 | 坐标     | 类型 |
| -------------------- | -------- | ---- |
| suburb 居住区        | (75, 70) | 右下 |
| entertainment 娱乐区 | (65, 80) | 中下 |
| temple 寺庙          | (18, 75) | 左下 |

**影响**：玩家现在能在地图上看到全部 12 个地点。

### 修复2 · 寺庙地点完善 4 项特殊行动

**问题**：`locations.js:345 temple` 定义了 `specialActions: ["祈福","冥想","捐香火钱","求签"]` 但无任何代码消费，玩家去了寺庙无事可做。

**设计参考**：《大多数》心态值分级 + BitLife 随机 buff

**实现**：新建 `addTempleActions(state, actions)` 函数（actions_extra.js +110 行），4 项行动每项每日冷却 1 次防滥用：

| 行动        | AP  | 成本 | 效果                                              |
| ----------- | --- | ---- | ------------------------------------------------- |
| 🙏 祈福     | 3   | ¥10  | 心情+8 / 运气+1 / 道德+1                          |
| 🧘 冥想     | 5   | 免费 | 疲劳-15 / 心智+2                                  |
| 💰 捐香火钱 | 2   | ¥50  | 运气+3 / 道德+1 / 名气+2                          |
| 🔖 求签     | 2   | ¥20  | 随机 buff/debuff 24h（5档签：上上/上/中/下/下下） |

**接入**：`addExtraActions` 在街头阶段调用 `addTempleActions`。

### 修复3 · 创业Tab 在街头阶段也可见

**问题**：`renderTabBar` 仅在 `state.startup.company` 已注册时显示创业 Tab，玩家没注册前看不到入口，不知道有创业系统。

**修复**：街头阶段也显示创业 Tab，点击后 `renderStartupTab` 已有逻辑会显示"注册条件引导卡片"。仅在公司阶段且未自己创业时隐藏（避免与 corp Tab 重复）。

### 修复4 · 引导系统重做（核心改造）

**用户反馈**：点击哪里都能跳过引导、高亮框一直闪、没导航到对应按钮/卡片高亮。

**重写 `showTutorialStep` 支持 `waitForClick` 模式**：

- 当 step.waitForClick 存在时，不显示"下一步"按钮
- 在目标元素上挂 `click` capture 监听（once: true），玩家点击该元素才推进
- 目标未找到时 5 秒后重试（处理异步渲染）

**Bug修复**：

1. **点击任意处跳过**：`modal.js:68` 改为仅在 overlay 不是 tutorial-overlay 时允许点击空白关闭
2. **高亮框一直闪**：所有跳过/完成/上一步路径都强制 `cleanupHighlight()`，并移除 resize 监听
3. **无导航高亮**：每步绑定具体 CSS 选择器，高亮框跟随目标元素，窗口大小变化自动重新定位

**7 步引导重写**（每步绑定必点元素）：

| 步骤 | 标题             | 必须点击的元素                                    |
| ---- | ---------------- | ------------------------------------------------- |
| 1    | 欢迎页           | （无目标，点"开始引导"）                          |
| 2    | 看左侧状态面板   | `#sidebar`                                        |
| 3    | 看行动区         | `#content-area`                                   |
| 4    | 试试第一次赚钱   | `[data-action-id="waste_recycling"]` 废品回收卡片 |
| 5    | 吃饱了才有力气   | `[data-action-id="eat"]` 吃顿饭卡片               |
| 6    | 查看地图探索城市 | `[data-tab="map"]` 地图标签                       |
| 7    | 你准备好了       | （无目标，点"开始游戏"）                          |

**新增 `_confirmSkip()`**：跳过引导二次确认，避免误操作。

**render.js `createActionCard` 加 `data-action-id` 属性**：让引导能定位到具体行动卡片。

**整合到剧本模式**：现有 `startScenarioGame / startSandboxGame / startNewGame` 都调用 `startTutorial`，且 `isTutorialDone()` 检查 localStorage（清除浏览器算第一次玩）— 符合"开局引导整合到剧本模式 + 第一次玩才显示"要求。新剧本将来添加时也会自动接入（因为 startTutorial 调用已在统一入口）。

## 文件变更清单

| 文件                             | 类型 | 行数 | 说明                                                                        |
| -------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| `src/js/ui/render.js`            | 修改 | +14  | 修复1 地图3地点坐标 / 修复3 创业Tab / 修复4 createActionCard data-action-id |
| `src/js/phase1/actions_extra.js` | 修改 | +110 | 修复2 addTempleActions 4 项行动                                             |
| `src/js/ui/tutorial.js`          | 修改 | +130 | 修复4 重写 showTutorialStep + waitForClick + \_confirmSkip + 高亮增强       |
| `src/js/ui/modal.js`             | 修改 | +5   | 修复4 tutorial overlay 不可点击关闭                                         |

**总计 ≈ 260 行**（远低于 1500 行护栏）

## 验证

- ✅ 4 个 JS `node --check` 全通过
- ✅ 构建产物 `dist/index.html` 3587.1 KB（在 3.5-3.8MB 期望区间内）
- ✅ grep 验证：
  - 寺庙行动 6 处
  - 地图坐标 12 处
  - 创业Tab可见 13 处
  - 引导 waitForClick 27 处
  - 行动卡片data属性 1 处
  - tutorial overlay保护 4 处

## Git

- commit `99904e8` 已落地
- 项目无 git remote 配置（CLAUDE.md 规则"禁止 git push"）

## 测试建议

1. 清除浏览器 localStorage（或新开无痕窗口）→ 选剧本 → 应触发7步引导
2. 第4步必须真的点击废品回收卡片才推进（点其他地方无效）
3. 引导完成后高亮框应消失（不再闪）
4. 进入游戏后切换到地图Tab → 应能看到全部12个地点节点（含 suburb/entertainment/temple）
5. 点击寺庙节点前往 → 行动卡片应有🙏祈福/🧘冥想/💰捐香火钱/🔖求签4项
6. 街头阶段切换Tab → 应能看到🚀创业Tab（即便未注册公司）
