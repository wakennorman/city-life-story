# R747b 域F(UI/UX) 优化轮 — 2026-07-29 07:4x（本窗口自动化）

## 选域依据
- git log 实测本窗口深审 recency：F=R442 全局最陈旧（G 刚被 R746b 深审完毕），D 次之。
- b 后缀避让：并行两套编号（R72x 第三轮小编号 + R74x 第五轮循环）同时活跃，R747 未被占用。

## 指令一：A类=0（诚实报，六项审计全净尽）
| 审计项 | 结果 |
|---|---|
| 死字段黑名单(player.happiness/needs.health/player.health/certs) UI 全文件 | 0 活命中（仅历史修复注释） |
| 假技能键 addSkillXp 全库 | 全部为12个真实键 |
| onclick 悬空函数 UI 23 个唯一函数 | 全部有定义（alert/if 为正则误报） |
| window 导出 wrapper 反模式(R746b 新铁律) | UI+域F linkage 0 命中 |
| tutorial.js 目标 DOM(content-area/tutorial-highlight/tutorial-skip-hint) | 均存在 |
| daily_report/daily_quest 全部 flags 读取 | 22 个 flag 全有写入方 |

不改项（有意）：
- `pg.psychology`（render.js:6494-6502）为 personal_growth.js 持续写入的真实活结构，与 health.mental 双心理系统不互通维持既有 B类记录（彻底统一需动事件层+渲染层两侧，非本轮范围）。
- navigation.js:761 `entry:'programmer'` 为 JSDoc 注释示例，非运行时引用，不改。

## 指令二：联动增强 3 项（domain_f_linkage_r747b.js，3 street，已挂载 src/index.html）
| 事件 | 联动 | 素材（此前事件层零消费） | 设计意图 |
|---|---|---|---|
| f747b_peak_day_echo | F→B | `_maxEarnedMilestone`(daily_report 日收入峰值档1000/5000/10000) | 峰终定律：三档动态 text 深夜复盘，智力/幸福二选一 |
| f747b_milestone_gathering | F→D | `_milestoneEarned100K/500K/1M`(daily_report 累计里程碑) | 社会比较：met 铁律 + applyAffinityChange，请客/低调二选一 |
| f747b_streak_reputation | F→C | `_streakMaster`(daily_pipeline 连续工作100天永久称号) | 禀赋效应：称号变职业资产，管理/销售XP 或 心智/幸福 |

防御自检：全部 || 守卫；done-flag 防重（excludeFlags+conditions 双保险）；NPC 一律 rel&&rel.met；好感走 applyAffinityChange(state,npcId,change,reason)；显名 getNpcDisplayName try/catch 兜底；无 window 导出（纯 IIFE push，规避 wrapper 爆栈铁律）；conditions 全 false 时静默不触发。

## 验证
- node --check：domain_f_linkage_r747b.js 通过。
- build：13614.6KB，f747b×24 入包，dist(07:47) 新于 src(07:45)。
- MC 10x500：见提交信息（0 代码异常 + 前7天死亡率0% 达标线）。

## 素材账更新
- 域F 零消费素材本轮清零（_maxEarnedMilestone/_milestoneEarned系/_streakMaster 全部首消费）。
- 下轮本窗口深审候选：D（并行 R440/R442 做过新 NPC 后未再深审）> A。
