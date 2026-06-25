# 城市浮生记 v3.8 断点续传审查：改进方案

更新时间：2026-06-26

格式：对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果

4 大扩展系统缺少常驻玩家面板 | `src/index.html`、`src/js/ui/render.js` | legacy 层 | 新增“人生事务”Tab，注册 `life_systems` renderer，复用 `getLifeNodeStatus`/`getMedicalSummary`/`getTravelStatus`/`getLegalSummary` 展示四块状态，并提供打开现有弹窗的按钮 | ~190 行 | 玩家可在旧正式入口主动查看人生节点、医保、旅行、法律状态，P0 可见性断点闭合
城市服务推荐函数已有但曝光弱 | `src/js/ui/render.js` | bridge + legacy 层 | 在“人生事务”Tab 内读取 `WebAppBridge.getRecommendedCityServices(state)`，展示推荐城市服务、费用/AP/入口地点；若没有推荐则显示当前 bridge 目录摘要 | ~45 行 | 现有 bridge 推荐能力变成玩家可见信息，不再只埋在 window API
TS 数据目录多数未被 legacy 消费 | `src/js/ui/render.js`、后续 `src/js/app_bridge/` | 混合 | 本轮先在“人生事务”Tab 显示 `WebAppBridge.getDataCatalogSummary()`，明确 playable/partial/typed 状态；后续再按目录逐个接入事件或行动池 | ~35 行 | 玩家入口和开发者都能看到 TS 目录接入状态，避免误以为所有 TS 内容已可玩
超大 legacy 文件继续累积维护风险 | `src/js/ui/render.js` | 完善 | 本轮只做最小插入：一个 renderer + 一个 Tab 注册，不拆 `render.js`，把大拆分保留为单独任务 | ~0 行额外 | 降低本轮风险，避免把 P0 可见性修复扩大成架构重构
扩展系统之间缺少后果链 | `src/js/core/medical.js`、`src/js/core/legal.js`、`src/js/core/travel.js` | 混合 | 本轮不落地深度链，先通过新面板暴露状态和入口；后续再加医疗债务/旅行突发/败诉执行链 | 待拆分 | 有了统一面板后，后续联动有稳定反馈位置

本轮实装范围：前 3 条。第 4 条是约束，第 5 条作为后续规划，不在本轮混入。
