# 2026-06-26 问题诊断（第三轮 — 基于当前源码实况）

CSS 移动端媒体查询提前闭合且存在多余右括号 | 移动端/CSS | P0 | `src/css/style.css` 3907 行结束 `@media (max-width:480px)` 后，3909-3932 行移动端投资规则落在媒体查询外，3933 行还有额外 `}`，会破坏 CSS 解析和构建稳定性
TS typed 数据目录多数未进入 legacy 正式入口 | 双轨桥接/数据 | P0 | `src/app/data/events/jobs/items/diseases/legal/travel` 已有数据，但 `webapp_runtime_bridge.js` 只接城市服务和 catalog 摘要；玩家入口不会消费这些 TS 内容
城市服务弹窗按钮不显示不可用原因 | bridge 桥接层/UI | P0 | `showCityServiceModal()` 所有当前地点服务都生成可点击按钮；现金/行动力不足只在 `applyCityService()` 点击后提示，不符合“不满足条件灰显+提示”的长期规则
医疗人生事务入口只打开医保咨询 | 扩展系统/UI | P0 | `_renderMedicalPanel()` 生病时提示建议看病，但按钮 `openLifeSystemsMedical()` 只调用 `showMedicalInsuranceModal()`；`startTreatment()` 没有玩家同屏入口，医疗卡片行动语义断裂
人生事务页与城市服务行动仍暴露开发术语 | legacy UI/bridge | P0 | `renderLifeSystemsTab()` 文案写“Web App 桥接进来的城市服务”，`addWebAppBridgeActions()` desc 写“Web App 新架构接入”；正式入口玩家会看到内部架构词
事件记录展开后的滚动只执行单次 | 移动端体验 | P1 | `toggleMessageLog()` 展开后只 `requestAnimationFrame` 设置一次 `scrollTop`；每日结算连续写消息或图片/字体迟到时可能仍停在倒数几条
TS 数据目录数量仍偏首批样本 | 内容/数据 | P1 | events 12、jobs 12、diseases 12、legal 7、travel 8 对比 legacy 内容量仍少，作为迁移目标覆盖率不足，但已有审计脚本和 catalog
职业/创业双路径提示有基础但缺注册费减免明细 | 事业发展 UI | P1 | `getStartupReadinessNote()` 只汇总折扣百分比和资源值；玩家不知道行业资源、客户线索、声誉、合伙人信任分别差多少能减免
城市服务推荐入口显示内部地点 id | bridge/UI | P1 | `_renderBridgeRecommendations()` 使用 `(action.locationIds || []).join(' / ')`，玩家看到 `gov_office / park` 这类内部 id 而非中文地点名
医疗/法律/旅行 TS 数据与 legacy 常量重复维护 | 双轨数据 | P1 | TS 目录有 `LEGAL_CASES/TRAVEL_DESTINATIONS/DISEASES`，legacy 也有 `LEGAL_CASES/TRAVEL_DESTINATIONS/ILLNESS_GRADES` 等，字段不完全一致，后续容易分叉
投资持仓移动端规则命名不一致 | 投资 UI/CSS | P1 | CSS 同时出现 `.investment-holding-*` 和 `.investment-holdings-row`，移动端防护覆盖范围依赖具体 HTML 命名，容易漏子页
人生事务 Tab 卡片按钮触控高度偏小 | 移动端 UI | P1 | 卡片内使用 `btn btn-sm`，新增界面按钮未显式保证 44px 最小触控高度；在 ≤480px 视口需要统一覆盖
记忆文件与实际源码多次漂移 | 文档/接力 | P2 | 上轮 memory 仍保留已修复项或将已实装项列为方案，后续 agent 容易重复工作
超大文件仍是维护风险 | 代码结构 | P2 | `startup.js`、`events_street.js`、`render.js` 行数巨大，功能耦合高，但当前不是阻断运行的问题
经济后期仍可能膨胀 | 数值/经济 | P2 | 创业/投资后期收益叠加后可能资金过快积累；需 Monte Carlo 后再谨慎加出口，当前不是本轮 P0
