# R722b · 域B 事件/叙事（本窗口自动化轮 2026-07-29 02:3x）

## 选域依据
- git log 实测 recency：A=714(并行R722域A在途avoid)/B=715/C=716/D=717/E=718/F=719/G=720/H=721。
- 并行八连发 R714-R721（01:33-02:23 全域扫荡）后 B=715 为可选最陈旧（A 名义最陈旧但 `domain_a_linkage_r722.js` 02:31 刚落盘=并行在途）→ 本窗口取域B、轮号 **722b** 避让。

## A类审计 = 0（四项例行审计，诚实报告）
| 审计项 | 结果 |
|---|---|
| 假技能键 addSkillXp | 16命中(finance6/trade4/technology3/strength2/physique1)全为历史修复注释,0活代码 |
| 死字段黑名单(player.happiness/needs.health/player.health/certs) | 全库0活命中(webapp_runtime_bridge为已知误报勿修) |
| RANDOM_EVENTS无phase死事件 | 14候选全误报(achievement id/choice id/子对象id) |
| 并行R714-721八连发双向核对 | 挂载/tracked/dist入包三项全成对,无悬空 |

## B类顺手修（1项・双层修复）
| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| events_core.js:717 | 事件标题tooltip直取story原文→全库782处`{desc}`类占位符悬停泄漏给玩家 | 渲染层单点正则剥离`——{xxx}`占位符(一行清除全部泄漏面) | B |
| domain_b_linkage_r700/r708/r715.js | story字段含`{desc}`(2+3+3=8处) | 改为干净回退句(text()仍为主叙述) | B |

## C类记录（不改）
- 并行R715/R721事件id前缀误用：`b714_`(r715文件)/`h713_`(r721文件)——复制模板未改轮号,但6个id全库唯一无覆盖冲突,仅命名不一致。
- r721 与 r713 同前缀 h713_ 但 id 带 v2/v3 后缀区分,无碰撞。

## 联动增强 3 项（domain_b_linkage_r722b.js, 2 street + 1 corporate）
| 事件 | 联动 | 设计意图 |
|---|---|---|
| b722b_gratitude_echo | B→H 跨阶段 | `_gratitudeLetterSent`(street_survival:3853,R586以来写-only)Phase2首读——Phase1感谢信在公司阶段收到回音,峰终定律情感峰值;met守卫+applyAffinityChange+getNpcDisplayName 全铁律 |
| b722b_pattern_dividend | B→C/E | 并行R715刚写入的`_b714PatternAnalyst/_b714Storyteller`写-only首读——身份标签兑现为现金/会计XP/社交XP,禀赋效应 |
| b722b_resilience_proof | B→G | `_b714Resilient/_b714Mindful`写-only首读——低健康(<60)窗口韧性兑现恢复加成,损失厌恶缓冲;st.status.health真实字段+typeof number守卫 |

## 竞态处理
- `domain_a_linkage_r722.js`：并行在途(未tracked未挂载→随后并行又自行挂载进src/index.html在途行)。node --check过、3 id(a722_*)全库唯一→按R712b先例**成对连带提交**(源+挂载),不留悬空。
- push积压：ahead 11(TLS 3067代理未起,并行同推不出),本轮提交后再试push。

## 验证
- node --check：r722b/r700/r708/r715/events_core/r722(并行) 全过。
- build：13363.5KB→(events_core修复后重建),b722b_×6 入包。
- MC 10×500d：见下方回填。
