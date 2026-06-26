# 2026-06-27 改进方案（第四轮 — P0/P1 可执行方案）

## 执行顺序（P0→P1，互斥文件串行）

### P0-1: 城市服务按钮灰显与条件提示
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
城市服务按钮不显示不可用原因 | `src/js/app_bridge/webapp_runtime_bridge.js` | bridge桥接层 | 在`showCityServiceModal()`渲染每个服务卡片时调用`canPay(state, action)`；现金/行动力不足用非主按钮样式+红字提示原因；可用按钮保持原逻辑 | ~40行 | 玩家打开弹窗即可知缺什么，减少无效点击 | 按钮继续`modal.js`，自适应换行

### P0-2: 医疗面板补"就医治疗/医保"双入口
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
医疗面板缺治疗入口 | `src/js/ui/render.js`, `src/js/core/medical.js` | legacy UI+核心 | `_renderMedicalPanel()` 按钮组改为"就医治疗"+"医保咨询"双按钮；新增`showMedicalTreatmentModal()`列出疾病/伤势等级的三种治疗方案(轻/中/重)，调既有`startTreatment()` | ~70行 | 生病时能从人生事务直接治疗 | 按钮组flex-wrap，≤480px自动换行，min-height:44px

### P0-3: 桥接层/城市服务文案收口
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
推荐地点显示内部id | `src/js/app_bridge/webapp_runtime_bridge.js`, `src/js/ui/render.js` | legacy UI+bridge | `_renderBridgeRecommendations()`中 `locationIds` 映射中文地名（查 `LOCATIONS` 或兜底翻译表）；城市服务explainer文案批量检查替换 | ~25行 | 玩家不再看到开发内部id | 纯文本，无布局影响

### P0-4: 地点推荐映射中文化
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
推荐地点显示内部id | `src/js/ui/render.js` | legacy UI | 新增 `_lifeSystemsLocationNames(ids)` 函数，从 `LOCATIONS` 映射中文名，兜底清除内部id | ~20行 | 推荐入口对玩家可读 | 纯文本自适应

### P1-1: TS事件bridge池扩充（第二波）
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
bridge事件池不够深 | `src/js/app_bridge/webapp_runtime_bridge.js`, `src/app/data/events/index.ts` | bridge+TS目录 | 从TS目录再选5-10个城市生存事件同步到bridge池；已有去重保护机制 | ~80行 | 事件池翻倍，更多城市场景进游戏 | 无UI变动

### P1-2: 事件日志稳态滚动
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
事件日志展开滚动不稳 | `src/js/main.js` | legacy JS | 抽`scrollMessageLogToBottom()`函数，展开时rAF+setTimeout二次滚动；可用`scrollTo({top:scrollHeight,behavior:'smooth'})`兜底 | ~25行 | 连续消息后展开稳定到最新 | 正向改善

### P1-3: 创业/上班族内容深化（事件链+行业周期）
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
职业内容可继续深化 | `src/js/data/` 或 `src/js/core/` | legacy | 新增上班族阶段事件（如P8晋升瓶颈、行业裁员潮、职场政治事件）与创业crisis事件；创业阶段引入行业周期波动影响 | ~150行 | 职业体验更丰富，行业反馈更真实 | 无UI变动或复用现有弹窗

### P1-4: 世界观自洽性增强
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
城市不够"活" | `src/js/core/world_params.js`, `src/js/data/news.js` | legacy核心+数据 | 城市新闻反馈到世界参数（如新闻事件影响行业热度/治安），联动NPC对话和环境叙事；天气系统与事件联动 | ~100行 | 玩家行为影响城市环境，世界反馈更强 | 无UI变动

### P1-5: 经济后期限流（Monte Carlo验证后）
对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
经济后期资金膨胀 | `src/js/phase1/daily_pipeline.js` 或投资系统 | legacy | 增加被动消费（物业税、社交维持费、健康检查开支），平衡后期收支曲线 | ~30行 | 后期资金不过度积累 | 仅数值，无UI变动
