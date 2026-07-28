# 域轮换优化 R649b — 域A 数据/数值平衡（本窗口，并行同轮号避让b后缀）

日期：2026-07-28 | 域：A（recency 最薄弱，上次 R641）| 主题：personal_growth 双结构分歧专修（MEMORY 挂账 B类升格，实际含 A类崩溃）

## 背景

`state.js:426` 权威结构 `health.{physical:{score},mental:{score,stress,anxiety,depression},metabolic:{score,bmi}}`，
全事件系统（cross_system_events part2-8）与 render.js 均按对象结构消费；
而 `phase2/personal_growth.js` 内部按旧数字结构（physical:80）读写。
运行时 `initPersonalGrowth` 因 state.js 已创建容器（`!state.personalGrowth` 恒 false）永不覆盖 → 数字分支为死代码，
但函数体内所有数字形态读写在权威对象结构上产生真实缺陷。

## A类修复清单（均在 src/js/phase2/personal_growth.js）

| 位置 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| L641 applyHobbyBenefits | `对象+数字=NaN` 永久污染 physical | 双形态兼容写 score | A |
| L764-768 healthCheckup | 报告输出 `[object Object]-3` 垃圾文本；dental/vision undefined→NaN；issues 比较恒 false | `_pgHealthScoreR649b` 双形态安全读分 | A |
| L779-780 healthCheckup | 权威结构无 `checkupHistory` → `.push` TypeError **体检功能完全崩溃** | Array 守卫+初始化；>20 条 shift 防存档膨胀 | A |
| L1051-1055 summary | 对象 `>=70` 恒 false → healthStatus 恒"需要关注" | 安全读分 | A |
| L1069 summary | 顶层 lastCheckup undefined | physical.lastCheckup 双来源兼容 | A |
| initPersonalGrowth 末尾 | 双结构无迁移路径 | `_normalizeHealthR649b` 每日规范化（经 daily_pipeline:939→tick），旧存档数字形态自动迁移为对象 | A |

附带激活：体检现在写 `physical.lastCheckup` → render.js:5793 "上次体检"由恒"未体检"变真实数据。

## B类记录（不改）

- pg.psychology 与 health.mental 双心理系统数据层仍不互通（完全统一需动 render.js:6495 与 events part2-8 两侧消费者，工程量大）。本轮在叙事层弥合（见联动2 shiftDepression 双写同步）。

## 联动增强（3项，src/js/core/domain_a_linkage_r649b.js，phase:street）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| a649b_checkup_trend 体检报告的曲线 | A→G | checkupHistory（修复崩溃后）全库首个读者，两次体检对比趋势叙事（峰终定律） |
| a649b_depression_shadow 情绪的低气压 | A→B | depression 零消费字段（MEMORY 挂账候选）首次阈值叙事；选择效果双写同步弥合双心理系统（损失厌恶） |
| a649b_bmi_wakeup 体重的悄悄话 | A→F | metabolic.bmi 恒22死数据全库首个写入者，由 _habits.junkFoodMeals 驱动，激活 render.js:5803 既有 BMI 展示（禀赋效应） |

防御：scoreOf/depressionOf 双形态守卫、cash 不足分支、metabolic 对象类型检查、addSkillXp("cooking") 真键、Math.round(*10)/10 防浮点漂移。

## 并行竞态处置

- 并行窗口 R649 在途：源 domain_a_linkage_r649.js 已落盘未提交、挂载已写入共享 index.html → 按救援模式将其源一并提交防悬空（3事件语法OK已核）。
- 本轮验证：node --check ×3 通过；build 后 dist/app.js 含 a649b 8处；MC 10×500。
