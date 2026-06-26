# 2026-06-27 现状摸底（第四轮 — 基于最新源码）

## 项目双轨架构

### legacy 侧（正式玩家入口 — src/index.html → python build.py → dist/）
- **入口/构建**：`src/index.html` ~80+ script 按序加载；`python build.py` 打包到 `dist/`
- **数据**：`src/js/data/` 地点/职业/商品/新闻/NPC/道德事件/胜利注册表等
- **核心**：`src/js/core/` 状态/存档/事件/世界参数/成就/技能树/天气/节日/时代/旅行/医疗/法律等
- **Phase1**：日常行动/交易/疾病/每日管线/NPC桥接
- **Phase2**：职场/投资/房产/创业/家庭/个人成长/副业
- **UI**：`render.js` 主UI+Tab注册；`modal.js` 弹窗；`wiki.js` 百科；`career_dev.js` 事业页
- **bridge**：`webapp_runtime_bridge.js` 末尾加载，向行动列表注入城市服务（7个），写入 `_webApp.schemaVersion=2`

### Vite + TypeScript 新架构侧（根目录 index.html → npm run build → dist-webapp/）
- 重定向到 legacy，仅 `?debug=1` 显示调试壳
- **Shell/UI**：`src/app/shell/` 调试面板
- **Facade**：`src/app/core/gameBridge.ts` 只读封装，不复制真实状态
- **TS 数据目录**：events(19), jobs(12), locations(14), items(17), diseases(12), legal(7), travel(8), lifeNodes(4), cityServices(7)
- **审计**：`npm run check:ts-data` 可审计覆盖率、`audit-ts-data.mjs`

## 当前完成度（第四轮审查后）
- ✅ CSS P0 媒体查询闭合修复已完成
- ✅ TS事件bridge首批接入（10个事件推入 RANDOM_EVENTS 池）
- ✅ TS事件目录从12扩充至19个（+7城市生存场景）
- ✅ 创业减免明细四维权重展示（行业资源/客户线索/声誉/合伙人信任）
- ✅ 房产×租房深度集成（PROPERTY_HOUSING_MAP 22条映射）
- ✅ 月租流水记录、行动页搬入入口
- ✅ 单行状态栏重组、人生目标横条上移
- ✅ 三大模式统一通用初始化、沙盒自由练习默认
- ✅ 全中文化修复（API→行动力、NPC中文名兜底）
- ✅ 构建验证全部通过

## 已知薄弱点（本轮可做方向）
1. **TS事件bridge池还不够深**：10个事件 vs legacy 数百事件，覆盖率低
2. **城市服务按钮灰显与条件提示**：上次列为P0但本次仍未实装
3. **医疗面板只有医保入口，缺少直接治疗入口**
4. **人生事务/城市服务仍有开发术语残留**（部分已修复但桥接文案仍可能暴露内部id）
5. **TS数据目录与legacy大量断连**：events/jobs/items/diseases/legal/travel内容仅为typed catalog，旧入口不会自动消费
6. **创业/上班双路径内容还可以深化**：更多上班族事件、创业crisis、行业周期联动
7. **投资持仓移动端仍有命名不一致风险**
8. **事件日志稳态滚动仍可改善**
9. **memory 文件几次漂移未与最新源码完全同步**
