# R757b — 域D（NPC/社交）深审轮（本窗口自动化 2026-07-29 08:4x）

## 选域依据
git log 实测本窗口深审 recency：D 最陈旧（上次深审为并行 R440/R442 加新NPC老陈/小薇，但从未对其集成质量深审）。b 后缀避让并行 R756/R757（并行同刻正在做 R757 域H）。

## 一、A类修复清单

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/data/npcs.js | lao_chen_60 好感奖励"老陈介绍社区资源"只写 `_laoChenCommunityHelp`，全库零读取、无消息无收益 → 好感60承诺零兑现 | 补即时收益：gainReputation(community_center,+10)+消息反馈；flag 由 r757b 联动事件首消费 | A |
| src/js/data/npcs.js | xiao_wei_60 "摊位折扣" `_xiaoWeiDiscount` 全库零读取 → 折扣从未兑现 | 补 flags 守卫+注释；折扣由 r757b 夜市半价用餐事件真实兑现 | A |
| src/js/data/npcs.js | xiao_wei_30 effect 缺 `if(!st.flags)` 守卫（同文件 lao_chen 均有） | 补守卫 | B |

净尽项（审过无缺陷）：死字段黑名单 0 命中；新NPC已入关系矩阵(R455修)；好感衰减机制存在(7天无互动)；`xiaoWeiReferred`→jobs.js:814 夜市帮工消费正常；community_center/night_market 地点已定义；r753 并行文件防御完整（{desc}占位符由 R722b 渲染层剥离，非泄漏）。

## 二、联动增强清单（3项）

新文件 `src/js/core/domain_d_linkage_events_r757b.js`（IIFE 注册 RANDOM_EVENTS，显式 phase:"street"，已挂 src/index.html）：

| 事件 | 联动 | 消费素材 | 设计意图 |
|---|---|---|---|
| d757b_laochen_community_intro | D→C | `_laoChenCommunityHelp` 首读 | 社区讲座→管理/社交XP，承诺兑现（互惠原则） |
| d757b_xiaowei_discount_meal | D→E | `_xiaoWeiDiscount` 首读 | 半价烧烤经济兑现；"按原价付"支线好感+4（禀赋效应+互惠升级） |
| d757b_laochen_mentor_guidance | D→C | `_laoChenMentorship` 首读 | 80好感人生导师深谈→管理XP+心智（峰终定律高光时刻） |

防御自检：met铁律(rel&&rel.met)✓ / done-flag防重✓ / ||守卫✓ / applyAffinityChange四参✓ / getNpcDisplayName兜底✓ / cash下限0守卫✓ / conditions全false时叙事无泄漏✓。

## 三、验证
- node --check ×2 过
- python build.py：见提交记录（dist 新于 src）
- MC：见提交记录

## 四、竞态记录
- 开轮时 index.html 有并行在途 M，写挂载前 diff 已被并行扫走。
- 并行同刻 staged domain_h_linkage_r757.js（R757 域H 在途）→ 本轮 dist 提交策略按"不吸入在途源"铁律执行。
