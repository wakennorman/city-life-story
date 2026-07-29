# R792b 域C（职业/成长）深审报告 — 2026-07-29 13:2x

## 选域依据
git log 实测本窗口深审 recency：C 上次深审 R677b，全 8 域最陈旧（H=R712b 次之）。b 后缀避让并行 R791/R792（并行第四轮循环活跃，R788-R791 已入 HEAD）。

## 一、A类缺陷修复（4处）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/data/job_milestone_events.js:139 | `_constructionForeman` 选项 desc 承诺"人脉+1"但 apply 零兑现 | 魅力+1 + addSkillXp("social",15)（真实键）+ 消息同步 | A |
| src/js/data/job_milestone_events.js:565 | `_deliveryStationManager` desc 承诺"底薪¥5500+管理奖金"但 apply 无任何收入变化——拒绝支线反而+15%，选晋升纯亏（损失厌恶反噬） | `_jobMultipliers["delivery_rider"] ×1.3`（高于拒绝支线1.15，兑现"更高位置"；main.js 有真实消费方） | A |
| src/js/phase1/daily_pipeline.js（养老金块后） | `_contentPlatformSigned` 承诺"保底每月¥2000"只发首月一次，flag 全库零读取 | 月度兑现 day%30，条件仍从事 content_writing（离职即停），isFinite 守卫，`_contentSalaryTotal` 累计 | A |
| src/js/phase1/daily_pipeline.js（同块） | `_mcnEmployee` 承诺"月薪¥6000"只发一次性买断，flag 全库零读取 | 同块兑现：MCN 优先发 6000（独家买断后平台保底不叠加），同上守卫 | A |

## 二、净尽项（审过=干净，勿重复审）
- 假技能键 addSkillXp 全库 grep：finance/trade/technology/strength/intelligence/physique/health 全部命中皆为历史修复注释，活代码=0。
- jobs.js `requiredFlag:"_synergy_*"` 8 处全部精确匹配 skill_synergy.js 真实 id。
- 死字段黑名单（player.happiness/needs.health/player.health/certs）域C近期文件 grep=0。
- 并行新增 domain_c_linkage r685~r790 共15文件：phase 全有 + 挂载全有。
- r777/r779/r790 字段引用（player.charm/intelligence/education、needs.fatigue）经 state.js 核验全部真实。
- career_dev.js CAREER_PATHS 引用 job id 无缺失。
- ⚠️ MEMORY 素材账过时已纠：_legacyProjectDay 已被 R685b 消费/_careerMonthlySnapshots 已被 R535 消费/_burnoutWasHigh 在 career_dev.js:3846 有自读——域C旧素材账全部失效。

## 三、新发现零消费素材（本轮部分消费）
job_milestone_events.js 写-only flag 10 个：_buskingVenue/_constructionCertPath/_constructionForeman(✔本轮消费)/_contentPlatformSigned(✔pipeline读)/_deliveryStationManager(✔本轮消费)/_factoryReskilling/_gaokaoTutoring/_laoGuanFriend/_mcnEmployee(✔pipeline读)/_tutoringReputation/_vendingLoyalty/_wasteRecyclingContract。
剩余待消费：_buskingVenue/_constructionCertPath/_factoryReskilling/_gaokaoTutoring/_laoGuanFriend/_tutoringReputation/_vendingLoyalty/_wasteRecyclingContract（均有即时收益非A类，联动素材）。

## 四、联动增强（3项）

| 事件 id | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| c792b_foreman_gratitude | src/js/core/domain_c_linkage_events_r792b.js | C→D | 工地带新人的人脉投资获得回报闭环（峰终定律：被感谢的瞬间） |
| c792b_content_salary_check | 同上 | C→E | 本轮新增 _contentSalaryTotal 首读：签约收入累计破2万→储蓄/理财课双支线（职业收入→经济决策） |
| c792b_station_pressure | 同上 | C→G | 站长管理20骑手的裁决时刻：管理XP+疲劳代价 vs 人情台阶（晋升双面性，损失厌恶取舍） |

防御自检：met铁律(firstMetNpc)/applyAffinityChange四参/getNpcDisplayName兜底/done-flag防重/全||守卫/isFinite/显式phase:"street"/window导出无wrapper(纯IIFE+RANDOM_EVENTS.push)。

## 五、验证
- node --check ×3 全过。
- python build.py 重建 dist（见提交时数值）。
- MC 见提交记录（0 代码异常为过线标准）。

## 六、下轮候选
H(R712b) > A(R770b)。开轮必 git log 重算。
