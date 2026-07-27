# R489 域C（职业/成长）第十八轮 — 0 A类 + 3项联动（死flag首消费专题）

日期：2026-07-27 | 提交：`1285e69f`（feat）+ `5541dc9f`(chore) | 状态：PUSHED ✅

## 一、A类审查结论（0项，诚实报告）

| 审查项 | 方法 | 结论 |
|---|---|---|
| addSkillXp 假技能键 | 全库 grep `addSkillXp("` 逐键比对真实 skills 列表 | 14种键全真实；finance/physique 仅存于 R243 修复注释，0 活跃命中 |
| jobs.js requiredFlag ↔ synergy id | `_synergy_*` 全量比对 skill_synergy.js 真实 id | 全匹配；旧假 flag(_synergy_driving_accounting/_synergy_accounting_management) 均已历史轮修复、仅存注释 |
| payCalc/effects 技能键 | grep `skills.*` 于 jobs/career_dev/skill_tree | 全部为真实键 |
| 死字段黑名单 | player.happiness/needs.health/player.health/certs. | 0 命中（career_dev certs 为局部变量，源自真实 state.certificates） |
| skillBranches/talentNodes 消费 | 全库文件级 | 消费充分，无死数据 |

## 二、联动增强（3项）— `src/js/core/domain_c_linkage_r489.js`

选题：career_dev.js 写入但**全库零事件消费**的三个真实 flag 首消费：

| 事件 | 联动 | 素材 | 设计意图 |
|---|---|---|---|
| c489_salary_alloc | C→E | `flags._highSalaryInvestor`（月薪≥2万置位，写后零读=死flag） | 高薪→资产配置觉醒，接入 `_dataInvestorMindset` 真实活跃flag，职业收益与投资域闭环 |
| c489_burnout_share | C→D | `flags._burnoutSurvivor`（倦怠恢复置位，此前仅成就读） | 倦怠幸存者向 met∩好感≥30 好友分享，applyAffinityChange(st,nid,5,reason) 位置参数 |
| c489_occu_health_wakeup | C→G | `flags._hasOccupationalDisease`（职业病置位，此前仅成就读） | 职业代价→健康管理叙事闭环，status.health 真实路径 + medicine 真实键 |

防御：met遍历(不依赖具名NPC)/status.health真实路径/一次性cooldown flag/全 || 守卫/phase 显式。

## 三、验证

- node --check：c489 + h487(救援核验) 均 OK
- build.py：dist 11456.5KB，c489_=12 / h487_=6 / g487_=6（**顺带闭合上一 HEAD 的 g487 悬空 dist**）
- MC 6×400d：见执行记录（0 代码异常达标）

## 四、竞态记录（重要）

- 本轮 c489 源码+挂载在写完 3 分钟内被并行窗口 `git add -A` 扫入其提交 `1285e69f` 并自行配文档 `5541dc9f`、重建 dist、push——**内容与本窗口完全一致，无需返工**，本窗口职责转为验证+补 round doc。
- 并行同时在途：`domain_a_linkage_r489.js`（同轮号异域！其源码未提交但已挂载 index.html 且写入 loop-state），本窗口 dist 构建产物含 a489_ 故**不提交 dist**，避免反向孤儿。
- ⚠️ 出现**同轮号双域**新形态（R489=域C(本窗口)+域A(并行)），后续判 recency 只看 git log 提交内容，轮号仅作弱参考。
