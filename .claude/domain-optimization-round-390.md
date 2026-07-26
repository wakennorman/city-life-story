# 域优化循环 · Round 390 · 域F(UI/UX) · 第十七轮循环

日期：2026-07-27
起始 HEAD：9ad7c0e3（origin/main 同步）
选域依据：git log 重算 recency A=387/B=389/C=389/D=389/E=389/F=384/G=385/H=386 → **F(384) 全局最薄弱**（loop-state 标 next=C 已滞后，C 已到 R389）。

## 指令一：A类缺陷审查 —— A类=0（诚实报告）

Explore 子代理只读审计 18 个域F UI 文件（render/render_core/render_infra/daily_quest/daily_focus/daily_report/data_viz/modal/navigation/tutorial/victory/life_memoir/heritage_store/wiki/side_hustle_ui/corp_ui/career_dev/social_tab）：

| 类别 | 结论 |
|---|---|
| #1 未声明变量(ReferenceError) | 干净。裸标识符全核验(_sum/_rel/_sgReq/reqv/curAttr/_wkE 等)均已声明，无缺陷 |
| #2 死字段读写 | 干净。四种死字段(player.happiness/needs.health/player.health/certs)仅见于历轮修复注释；真实代码用正确字段(career_dev.js:3452 status.health / daily_quest.js:159 certificates / daily_report.js:777 status.health) |
| #3 空指针解引用 | 抽查安全，`.company` 均有 `&&`/`?.` 守卫 |
| #4 除零/NaN | render_core.js:549、render.js:1896 除零点均有前置守卫 |

历轮已净尽域F主隐患：R19(itemId ReferenceError) / R183(学历+消息toggle+每日目标终身一次+教程selector) / R186(certs→certificates) / R198(F层确证0) / R384(render 整容失败旧存档 status/needs 守卫)。本轮不重复修，如实报告 A类=0。

## 指令二：联动增强 3 项

新建 `src/js/core/domain_f_linkage_r390.js`（IIFE→RANDOM_EVENTS，2 street + 1 corporate，全 `||` 防御，数值 `[PLACEHOLDER]`，id 前缀 `ui_r390_` 全库唯一）。设计主题：好界面降低认知负荷，让玩家"看见"人生（峰终定律：一次清晰回顾=一个情绪峰值）。

| 新增事件 | 文件 | 联动域 | 设计意图(一句话) |
|---|---|---|---|
| ui_r390_progress_review | domain_f_linkage_r390.js | F→B(叙事) | 翻看进度页=人生回望，心智/幸福峰值 + 置 `_lifeReviewHabit` 印记 |
| ui_r390_relations_map | domain_f_linkage_r390.js | F→D(社交) | 整理关系网→主动问候最熟的人，applyAffinityChange 好感+（守 rel.met 铁律） |
| ui_r390_data_pitch | domain_f_linkage_r390.js | F→H(公司) | 一页看板做季度汇报，管理经验+现金+晋升势能（信息越少力量越大） |

选向刻意避开 r376(F→C/D/G)、r384(F→E/A)，补齐 F→B/D/H 组合差异化。F→D 严守域D铁律（只读 state.relationships、rel.met 守卫、跨NPC传导走 applyAffinityChange）。注册于 src/index.html r376.js 之后。

## 验证

- node --check `domain_f_linkage_r390.js` 通过
- python build.py → dist/app.js **10554.3KB**（比 src 新，`_domainFLinkageR390Loaded` 入 bundle count=2）
- MC 6×400d **EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity grep=0；前7天死亡率全 0.0%<10% 无早期死亡回归；balanced 83.3%✅ / grinder 33.3%(≥30%高风险)✅ / skiller 66.7%(≥30%)✅ / trader 50%·social 50%·corporate 33.3%<80% 为既有 RNG 平衡阈值波动，历轮一致非代码回归）

## 下轮

域G（核心机制/生命周期，recency 385 最薄弱）。开轮必 git log 重算真实 recency（并行窗口速度远快于本自动化）。
