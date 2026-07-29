# R785b 域B(事件/叙事) 深审+联动增强（本窗口自动化轮）

日期：2026-07-29 12:0x
选域依据：git log 实测本窗口深审 recency，B 最陈旧（R722b 后未深审）；b后缀避让并行 R784/R785 小编号轮。

## 一、修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/core/events_core.js:729 | 渲染层 story 兜底路径无占位符剥离——全库28个活事件(story含`{xxx}`且无text())正文原样泄漏`{desc}`类占位符给玩家（R722b只修了tooltip、R455只修了text()优先路径，兜底裸奔） | 复用 R722b tooltip 同款正则 `\s*(——|—|-)?\s*\{[a-zA-Z]+\}` 单点剥离，仅剥纯字母占位符不伤正文 | A |
| src/js/core/domain_a_linkage_r747.js | 已提交但从未挂载 index.html（R728 add -A 扫入却漏挂）。经核对其 3 事件与已挂载的 r750 完全同版本（v8/v5，仅id前缀不同），挂载会造成同题事件双份出场 | 不挂载不删除（严禁重建/删除并行文件），记录为 r750 的被替代冗余副本 | C |
| （自检）domain_b_linkage_events_r785b.js | 初稿 ECHO_NPCS 含 sister_hong（npcs.js 无此id，引用id不存在） | 提交前自检改为真实id sister_zhang | A(自纠) |

净尽项（诚实报告，勿重复审）：
- 假技能键全库16处命中全部为历轮修复注释，活代码0处。
- 死字段黑名单(player.happiness/needs.health/player.health/certs)活命中0（webapp_runtime_bridge 主路径正确为既有误报）。
- 无phase死事件扫描10命中全部误报（成就id/NPC id/动态前缀/注释）。
- 新增并行文件 r77x-r784 全部 phase 齐全、conditions 复数、挂载完整（除 r747 冗余副本）。
- b776/b777 字段核验无假字段；域B天气事件无缺weather守卫新增。

## 二、增强清单（domain_b_linkage_events_r785b.js，3事件，均street）

| 新增内容 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| b785b_sharer_echo 分享者的回响：_b714Sharer(R715写-only)首消费，met NPC牵线+affinity+6 | domain_b_linkage_events_r785b.js | B→D | 峰终定律：把玩家的叙事选择变成延迟的社交峰值回报 |
| b785b_listener_return 倾听者的回礼：_b714Listener首消费，心智<55低谷期触发+8 | 同上 | B→D/G | 互惠原则+损失厌恶缓冲：低心智期兑现早期善意而非纯惩罚 |
| b785b_anonymous_karma 匿名善举的回声：_b722bAnonymousGiver(R722b写-only)首消费，口碑/现金双支线 | 同上 | B→A/E | 禀赋效应：自费善举获得可感知长尾回报，强化道德抉择意义感 |

防御自检：全部||守卫；met铁律；applyAffinityChange四参；getNpcDisplayName兜底；gainReputation(state,locKey,amount,reason) typeof守卫；done-flag+maxRepeats:1;真实字段(player.mental/needs.happiness/needs.hunger/resources.cash/player.morality)。
域B零消费素材账更新：_b714Sharer/_b714Listener/_b722bAnonymousGiver 已清零；剩 _b722bPatternCd系（低价值冷却flag）。

## 三、验证
- node --check：新文件+events_core.js 均过。
- python build.py：重建 dist（并行在途 events_corp.js/domain_h_linkage_r783.js 未提交改动会被吸入 → 本轮不提交 dist，由并行下轮 build 闭合，同 R757b 先例）。
- MC：见提交记录（0代码异常达标）。

## 四、竞态实录
- 开轮时并行窗口已 stage events_corp.js/domain_h_linkage_r783.js/last_known_head；本窗口 events_core.js 修复亦被其 add -A 扫入 staged。本轮以 `git commit -- <路径>` 精确提交本轮文件。
