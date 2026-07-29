# R770b — 域A（数据/数值平衡）高价住房死数据兑现专轮

日期：2026-07-29 10:5x（本窗口自动化）
选域依据：git log 实测本窗口深审 recency 域A 最陈旧（R649b 后未深审）；轮号 b 后缀避让并行 R770（域G，sensenova-exp 第三轮循环，本轮开轮期间刚提交 14c85c73）。

## A类修复清单

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/core/domain_c_linkage_r366.js:125 | `addSkillXp("health",3)` 假技能键（真实12键无health，XP静默丢弃），消息承诺"健康XP+3"落空 | 改写真实字段 `st.status.health` +3（上限100守卫），消息同步改"健康+3"（同R621/R631先例） | A |
| src/js/data/items.js HOUSING_TIERS tier5/6 | `effects` 四键（healthRecovery 5/10、skillStudyBonus 0.1/0.2、npcVisitBonus 0.1/0.2、fameGain 0.1）**全库零应用器**；`extraFeatures`（canHostNPC/party/garden/view/staff）全库零引用——¥50000别墅/¥200000豪宅高价承诺全部静默失效 | 分三路接线：①skillStudyBonus→main.js addSkillXp 单点乘 `(1+bonus)`（clamp 0~0.5，isFinite守卫）；②healthRecovery→r770b 包装 runDailyPipeline 每日兑现（day防重+100上限+20clamp+首次提示；daily_pipeline 并行在途不碰，走包装全局函数铁律，wrapper 保存 `_origRunDailyPipeline` 绝不自引用）；③npcVisitBonus/fameGain/canHostNPC/party/view→事件层首消费（下表联动3项）；items.js 加接线注释防未来误判 | A |

净尽项（例行审计诚实报）：死字段黑名单全库0活命中（bridge主路径正确/其余为注释与已修点）；假技能键 addSkillXp 全库扫描仅 r366 一处活代码（其余全为历史修复注释）；goods.js 53条目0极端价；illnesses.js 29 id正常；jobs.js 无 requiredCert 悬空引用；items.js skillStudy:545 维持既有C类记录不改。

## 联动增强清单

新文件 `src/js/core/domain_a_linkage_events_r770b.js`（IIFE，注册 RANDOM_EVENTS，3事件全显式 phase:"street"，done-flag/冷却防重，||守卫全过）：

| 事件 | 联动域 | 设计意图 |
|---|---|---|
| a770b_villa_study 书房的深夜（tier≥5,14天冷却,管理/编程/休息三选） | A→C | 别墅书房卖点叙事兑现，XP走main.js接线自然放大——禀赋效应（花的钱看得见回报） |
| a770b_mansion_party 顶层豪宅的家宴（tier6,¥800,≥1 met NPC,30天冷却） | A→D | canHostNPC/party 死数据首兑现；npcVisitBonus 首消费放大好感(4×1.2=5)；met铁律+applyAffinityChange四参+getNpcDisplayName兜底——社会比较 |
| a770b_view_interview 江景窗前的专访（tier6,fame≥30,一次性,接受/婉拒双支线） | A→B/G | view:"panoramic"/fameGain 首消费(6×1.1=7)，写 player.fame 真实字段——峰终定律 |

## 竞态记录
- 开轮时工作区有并行在途 M index.html/M daily_pipeline.js/?? r770×2，审计期间并行提交 R770(14c85c73) 后仅剩 `?? domain_e_linkage_r770.js` = **反向孤儿**（HEAD index.html:1837 已挂载 + dist 已含其内容 + node --check 过）→ 本轮顺带救援提交（R757b 救援 c374 先例）。
- daily_pipeline.js 并行在途期间被识别为不可碰 → healthRecovery 采用包装 runDailyPipeline 方案（域G/H"无slot注册→包装全局函数接线"铁律）。

## 验证
- node --check ×4 全过（r770b/main/items/r366）+ e770 救援文件过。
- python build.py 重建 dist。
- MC 见提交信息（10x500 或回退 6x400，0 代码异常）。
