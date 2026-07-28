# R677b 域C(职业/成长) 优化轮记录（本窗口，b后缀避让并行同轮号）

日期：2026-07-28 19:4x ｜ 域：C 职业/成长 ｜ 选域依据：git log 实测 recency C=667 全局最薄弱（A=675/B=676/D=676在途/E=669/F=670/G=671/H=674）

## A类修复（2处，8个占位符点位）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/ui/career_dev.js:5673 + src/js/phase1/daily_pipeline.js | `_skillMasterTrainer` 培训班选项 hint 承诺"解锁被动收入+¥150/天"，但该 flag 全库零读取零兑现——玩家选了什么都得不到，且叙事称"前期投入大"却不扣钱 | apply 记录 `_skillMasterTrainerDay` 开班日+扣前期投入 min(2000,cash)；daily_pipeline 在 `_careerLegacyDueDay` 结算区后新增每日兑现接线：日+¥150（`_trainerScaleUp` 后 ¥250），`_trainerIncomeTotal` 累计，每7天汇总提示防刷屏 | A |
| src/js/ui/career_dev.js（6个事件story） | 渲染层（events_core.js R455 修复后）只调用 `text:function` 动态叙述，story 内 `{pathName}/{levelName}/{skillName}/{masterName}` 占位符原样泄漏给玩家：career_max_level_celebration / career_mentor_request / career_legacy_project / skill_max_level_mastery / skill_master_student / skill_master_visitor | 6事件各补 `text:function(st)` 动态叙述：pathName 走 `job.pathName→CAREER_PATHS[path].name→兜底`，levelName 遍历 pData.levels 匹配 levelId，skillName 走 `getSkillChineseName` typeof 守卫，visitor 用 conditions 已置的 `st._skillMasterVisitorSkill` | A |

复查项：jobs.js `_synergy_*` flag 全集 vs skill_synergy 真实 id 对齐（早前轮已修，本轮核验通过）；`addSkillXp("` 假键全库审计=0；死字段黑名单=0。

## 联动增强（3项，src/js/core/domain_c_linkage_r677b.js，已挂 src/index.html:1547）

| 事件 | 联动 | 设计意图 |
|---|---|---|
| c677b_legacy_investor | C→E | 首消费 career_dev.js:5576 死flag `_legacyProjectStarted`（遗产项目"全力投入"写后零读）→ 项目经历变现为顾问费¥2000-5000，职业高光的峰终回响 |
| c677b_watched_regret | C→B | 首消费 career_dev.js:5597 死flag `_legacyWatched`（观望选择写后零读）→ "别人做成了那个项目"社会比较+损失厌恶叙事，观望也有回响 |
| c677b_training_scale | C→E | 承接 A类#1：开班满30天口碑发酵 → 投¥3000扩班置 `_trainerScaleUp`（daily_pipeline 日收益150→250），禀赋效应+经营纵深 |

防御自检：全部 street phase / done-flag 或 excludeFlags 防重 / `||` 守卫 / Random·addSkillXp·StateManager typeof 守卫 / 无 NPC 引用（免 met 铁律负担）/ addSkillXp 仅用真实键 accounting·management。

## 验证
- node --check：career_dev.js / daily_pipeline.js / domain_c_linkage_r677b.js 全过。
- build：dist/app.js 12335.1KB，c677b_=6、"R677b A类"=10 入包。
- MC 10×500d：见 loop-state 补记（提交时在跑，结果附后）。

## 并行协同（竞态记录）
- 本窗口全部交付物（career_dev/daily_pipeline/linkage/index.html挂载+dist）在写完约3分钟内被并行窗口以 **[R677] a6b054b2** 名义扫入提交并推送（R658b 已见模式）；并行同提交内含其自己独立做的域C修复（applyJobhop守卫/skill_tree activateTalentNode守卫+3项自有联动）——同轮号同域双份产出，内容互补不冲突。
- 并行随即推进 R678 域D（60c24814，13个未挂载域D文件复活）并在途 R678 域E。
- CRLF 应对：career_dev.js（UTF-8 BOM+CRLF）与 daily_pipeline.js 均用 Python 字节级精准替换，diff 收敛为 67/12 行。
