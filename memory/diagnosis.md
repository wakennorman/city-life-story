# 城市浮生记 v3.8 断点续传审查：问题诊断

更新时间：2026-06-26

格式：问题描述 | 所属模块 | 路线 | 优先级 | 判断依据

4 大扩展系统缺少常驻玩家面板，新增玩法可玩但不可见 | 人生节点/医疗/旅行/法律 | 完善 | P0 | `life_nodes.js`/`medical.js`/`travel.js`/`legal.js` 均已有状态函数和弹窗，但 `src/index.html` Tab 中没有对应入口，玩家只能靠地点行动或管线触发
城市服务推荐函数已有但曝光弱 | bridge/UI | 完善 | P1 | `WebAppBridge.getRecommendedCityServices()` 已存在，旧入口缺少集中展示位，玩家不容易知道何时该用社保、信用、体检等服务
社区体检服务读写了错误的健康字段 | bridge/城市服务 | 完善 | P1 | 主游戏健康条来自 `state.status.health`，但 `community_health_check` 和体检推荐使用 `state.player.health`，会让推荐与效果失真
TS 数据目录多数未被 legacy 消费 | 新数据目录/bridge | 新增 | P1 | `src/app/data/index.ts` 中 events/jobs/items/diseases/legal 多为 `typed`，只有 cityServices 为 `playable`，travel/lifeNodes 为 `partial`
超大 legacy 文件继续累积维护风险 | 架构 | 完善 | P1 | `startup.js`、`events_street.js`、`render.js`、`main.js` 仍是大文件，新增系统经常要改 render/main 注册点
扩展系统之间缺少后果链 | 扩展系统 | 混合 | P1 | 医疗、旅行、法律、人生节点各自可运转，但医疗债务、旅行突发法律/医疗、败诉信用后果等交叉链还少
lifeNodes 触发节奏偏硬 | 人生节点 | 完善 | P2 | 高考/大学/退休为确定时间点，35 岁危机按日期取模触发，缺少“概率/提前提示/可回顾”打磨
装备品质系统玩家感知不足 | 装备系统 | 完善 | P2 | `equipment_quality.js`、`equipment_suites.js`、`equipment_durability.js` 已存在，但主 UI 中缺少清晰展示和获取引导
字段级 TS/legacy 对齐审计仍不完整 | 工具链 | 新增 | P2 | `check:ts-data` 只检查导出数组最低数量，未校验 TS 字段与 legacy 同名系统字段、触发入口和百科注册是否一致
项目入口文档分散 | 文档 | 完善 | P2 | 新人需要同时读 `CLAUDE.md`、`src/DEVELOPMENT.md`、`memory/*` 才能理解构建和双轨边界
