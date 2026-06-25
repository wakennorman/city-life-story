# 城市浮生记 v3.8 审查改进与扩展：改进方案

更新时间：2026-06-25

## 实装顺序（P0 优先 → P1 其次，P2 随缘）

> 每条方案标注：对应诊断问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果

---

## P0 改进（3 项，~620 行）

### P0-1: TS 数据目录填充（让双轨不再是空壳）

**对应问题**：TS 数据目录全部为空，双轨架构有名无实
**归属层**：新数据目录（src/app/data/）
**当前状态**：✅ 已扩展完成首批。除 lifeNodes/cityServices 外，events/jobs/locations/items/diseases/legal/travel 也已填入实际 TS 类型和数据，并由 `src/app/data/index.ts` 统一汇总。

#### 1a: lifeNodes 数据目录填入真实数据

- **涉及文件**：`src/app/data/lifeNodes/index.ts`
- **改法**：定义 TypeScript 类型 `LifeNodeConfig`，填入 4 个节点（高考/大学/35岁/退休）的数据配置，类型包括 id/name/triggerDay/requirements/choices/effects。再用导出的常量供 bridge 消费
- **估计行数**：~120 行
- **预期效果**：TS 侧有了第一个非空数据目录，后续新增人生节点优先写这里

#### 1b: 补城市服务 TS 数据

- **涉及文件**：`src/app/data/cityServices.ts`
- **改法**：从今日 3 个服务扩张到 7 个服务，定义 TypeScript 接口 `CityServiceConfig`，每个服务含 id/title/icon/category/locationIds/cost/apCost/brief/effect 字段
- **估计行数**：~120 行
- **预期效果**：TS 侧有了完整的城市服务数据目录

#### 1c: healthCheck.ts 拓展

- **涉及文件**：`src/app/debug/healthCheck.ts`
- **改法**：增加对 TS 数据目录的非空检测（遍历所有 data/\* 目录检查 exported data 是否存在）、bridge 状态检测（check if WebAppBridge is exposed）、legacy state 字段对齐检测
- **估计行数**：~60 行
- **预期效果**：`npm run build` 产出包含架构健康面板，能检测 TS 侧是否真的有数据

#### 1d: TS 数据目录审计与内容面板

- **涉及文件**：`scripts/audit-ts-data.mjs`、`package.json`、`src/app/data/index.ts`、`src/app/ui/panels.ts`
- **改法**：新增无依赖审计脚本，检查 8 个 TS 数据目录导出数组达到最低数量；调试壳展示各目录数量、旧来源和 bridge 状态
- **估计行数**：~200 行
- **预期效果**：下个 Agent 能一眼确认 TS 数据目录不再是空壳，验证命令可阻止回退

### P0-2: 桥接层扩展（从 3 个动作 → 7 个动作）

**对应问题**：桥接层仅 3 个城市服务动作，面积极薄
**归属层**：桥接层（src/js/app_bridge/）

#### 2a: 新增 4 个城市服务动作

- **涉及文件**：`src/js/app_bridge/webapp_runtime_bridge.js`
- **改法**：新增 4 个城市服务动作：（1）社保缴纳查询（gov_office, ¥0, 社会信用+基本信息）；（2）个人信用报告（bank, ¥20, 解锁贷款额度利率信息）；（3）公积金提取咨询（gov_office, ¥0, 住房改善信息）；（4）社区体检预约（hospital, ¥50, 免费基础体检）。更新 `applyCityService` 和 `tickWebAppCityServices` 覆盖新服务
- **估计行数**：~150 行
- **预期效果**：桥接层从 3 个可玩动作扩展到 7 个，覆盖更多生活场景

#### 2b: bridge 自动推荐

- **涉及文件**：`src/js/app_bridge/webapp_runtime_bridge.js`
- **改法**：新增 `getRecommendedCityServices(state)` 函数，基于玩家状态（缺钱→推荐社保/信用报告、健康低→推荐体检、法律事件→推荐劳动预检）返回推荐服务列表，暴露到 `window.WebAppBridge`。在 `daily_focus.js` 中可选集成
- **估计行数**：~60 行
- **预期效果**：玩家在合适时机能看到"推荐使用"的桥接服务，不是被动等地点触发

### P0-3: TS typed facade 补充扩展系统字段

**对应问题**：TS typed facade 不支持扩展系统字段
**归属层**：新架构（src/app/）

#### 3a: 补全 LegacyGameState 类型

- **涉及文件**：`src/app/types/game.ts`
- **改法**：新增 `SideHustleState`、`LegalState`、`MedicalState`、`TravelState`、`NpcRelationshipsState`、`StartupState`、`EraState`、`WeatherState` 等接口，映射到 `LegacyGameState` 的可选字段。增加状态版本号约束
- **估计行数**：~100 行
- **预期效果**：TS 侧类型覆盖实际运行的全部扩展系统，不再需要 `any` cast

---

## P1 改进（3 项，~180 行）

### P1-1: 后期经济被动输出口

**对应问题**：经济系统后期缺失对投资/贸易的被动抽取出口
**归属层**：legacy 层（src/js/phase1/daily_pipeline.js + src/js/phase2/family_life.js）

#### 4a: 住房维护费 + 物业管理费

- **涉及文件**：`src/js/phase1/daily_pipeline.js`
- **改法**：在现有住房开支步骤中，按住房等级增加月度维护费（城中村¥0 → 老旧小区¥300 → 高档小区¥800 → 管家服务¥2,000/mo），每月第 1 天结算
- **估计行数**：~30 行
- **预期效果**：后期玩家持有高等级住房时有持续现金消耗

#### 4b: 社交圈维护费

- **涉及文件**：`src/js/phase1/daily_pipeline.js` + `src/js/data/npcs.js`
- **改法**：每月初基于 NPC 好感总值按比例消耗（每 100 好感 = ¥50/mo），反映"人情往来"开销。好感 <10 的 NPC 不计费
- **估计行数**：~30 行
- **预期效果**：后期 NPC 关系网大时产生持续的"人情成本"

### P1-2: 两阶段间债务轮回出口

**对应问题**：lifecycle 游戏内角色死亡/破产后缺少"债务轮回"出口
**归属层**：legacy 层（src/js/core/inheritance_chain.js）

#### 5a: 差异化开局债务

- **涉及文件**：`src/js/core/inheritance_chain.js`
- **改法**：在 `applyInheritance` 中增加判断：如果上局欠债未还（`villageDebt > 0`），新周目开局触发"催收上门"事件（开局-¥500~¥2000 现金，根据上局债务按比例扣除）；如果上局违法多（`_arrestCount > 3`），新周目减益（\_criminalRecord = true，找工作受限制）
- **估计行数**：~50 行
- **预期效果**：玩家行为在新周目产生差异化后果，不再是"人死账烂"

### P1-3: NPC 常规对话深化

**对应问题**：社交系统的 NPC 深度交互仍不够
**归属层**：legacy 层（src/js/phase1/npc_event_bridge.js + src/js/ui/render.js）

#### 6a: NPC 对话历史面板

- **涉及文件**：`src/js/ui/render.js` + `src/js/phase1/npc_event_bridge.js`
- **改法**：在社交 Tab 的 NPC 详情区域增加"对话记录"子区域，显示最近 5-10 条对话摘要（从 `interactionHistory` 字段读取），包含对话日期、好感变化摘要。增加"深入聊天"按钮（AP=2），触发 `chatWithNpc` 并有概率解锁新对话
- **估计行数**：~70 行
- **预期效果**：NPC 交互更有实质感，玩家能看到关系进展
