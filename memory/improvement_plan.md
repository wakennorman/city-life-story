# 城市浮生记：审查改进与扩展方案

更新时间：2026-06-26

格式：对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果

状态栏缺失 | `src/index.html`、`src/js/ui/render.js` | legacy UI | 移除状态容器隐藏或在 `renderNeedsBars()` 强制显示；“饥饱”改为“饥饿”并调整说明文案 | ~10 行 | 状态栏重新出现在左侧，命名更合理
附近可前往重复 | `src/index.html`、`src/js/ui/render.js`、`src/js/phase1/actions_extra.js` | legacy UI/行动 | 从侧栏移除 `nearby-section`，把可前往地点作为行动分组“出行 — 点击前往其他地点”渲染，行动页首屏可见 | ~80 行 | 出行入口集中，第一页能看到，不再重复
顶部住所/仓库/升级提示 | `src/js/ui/render.js` | legacy UI | `renderHeaderContext()` 改为住所 chip + 仓库 chip；升级提示显示在住所下方并按下一档住所位置动态文案，顶级住所隐藏 | ~70 行 | 顶部信息更清楚，侧栏减少重复
左侧魅力属性 | `src/index.html`、`src/js/ui/render.js`、`src/js/core/state.js` | legacy UI/状态 | 在属性栏增加魅力行，`renderStreetStats()` 更新 `stat-charm`；将 UI 文案从颜值改为魅力/发型设计 | ~60 行 | 魅力成为正式属性，发型和整容语义分离
村长债务模式显示 | `src/js/ui/render.js`、`src/js/main.js` | legacy UI/行动 | 债务只在 `villageDebt > 0` 时显示；保留还村长钱行动的债务条件；侧栏债务收敛避免和顶部重复 | ~20 行 | 剧本/沙盒无村长债时不出现村长相关 UI
地点差异化行动 | `src/js/phase1/actions_extra.js` | legacy 行动 | 增加地点规则 helper，把学习/健身/电影/KTV/药房/超市等改为按地点可用；不可用时灰显并红字提示要去哪里 | ~220 行 | 每个地点行动更符合现实和游戏逻辑
住所与仓储分组 | `src/js/phase1/actions_extra.js` | legacy 行动 | 新增“住所 & 仓储 — 提升生活质量”行动组：回住所、住所设施、可升级提示、租仓入口按条件显示 | ~90 行 | 住所和仓储不再堆砌，玩家知道在哪提升生活质量
技能培训地点原则 | `src/js/ui/render.js` | legacy UI | 技能页在非培训中心时禁用学习/训练按钮，并显示红字“前往培训中心”；写入文档和长期记忆 | ~80 行 | 条件不符时灰显但保留引导，不让玩家误点
个人成长入口精简 | `src/index.html`、`src/js/ui/render.js`、`src/js/phase1/actions_extra.js` | legacy UI/行动 | 主 Tab 隐藏个人成长；保留 renderer 兼容旧入口；跑步/冥想/发型设计作为地点行动，整容在医院，学习在图书馆/培训中心 | ~140 行 | 成长行为回到具体地点，主界面更贴近生活模拟
天气物品耐久 | `src/js/phase1/actions_extra.js`、`src/js/core/weather.js` 或每日管线 | legacy 天气/物品 | `_weatherPrep` 记录 umbrellaUses/warmPackUses；极端天气触发时扣次数，耗尽提示重新购买 | ~80 行 | 天气准备从一次性 flag 变成可消耗装备
偷电瓶风险联动地点 | `src/js/core/illegal_actions.js`、`src/js/data/locations.js` | legacy 行动 | 根据地点 `type/footfall/services` 推算监管系数，繁华商业/机构区风险高，郊区/工地低 | ~60 行 | 违法行动风险更符合地点差异
事业发展增强 | `src/js/ui/career_dev.js`、`src/js/phase2/startup.js` | legacy 事业 | 增加上班族/创业双路径摘要、今日建议、下一门槛和资源缺口提示；不改创业核心计算 | ~120 行 | 职业系统更清楚，玩家知道下一步怎么发展
文档和断点续传 | `IMPLEMENTATION_PROGRESS.md`、`CLAUDE.md`、`src/DEVELOPMENT.md`、`memory/long_term_lessons.md` | 文档 | 更新本轮完成项、原则和验证结果 | ~120 行 | 下一个执行者可接上，不会重复踩坑
