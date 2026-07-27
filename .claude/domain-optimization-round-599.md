# 域G 核心机制/生命周期 联动增强 R599

> 自动化 8 域轮换优化循环 · 2026-07-28

## 选域
- 起始：并行窗口已将 HEAD 推进至 R577(域A)；linkage recency 重算 G(r599) 本轮候选（H592 更旧，在下轮）。
- 本轮 = 域G R599（domain_g_linkage_r599.js）。

## A类6处（跨文件·假技能键/对象误用修复，全库确证）
`state.skills[key]` 是对象{level,xp}，被当数值相加→Math.min=NaN 摧毁技能；假键(finance/beauty/mental)静默失效。修复：
1. cross_system_events_part2.js:3061 `st.skills.repair=Math.min(...,+5)` → `addSkillXp("repair",5)`
2. domain_c_linkage_r172.js:114 `st.skills.management=...` → `addSkillXp("management",2)`
3. economy_linkage_events.js:540 `st.skills.management=...` → `addSkillXp("management",3)`
4. cross_system_events.js:5933 `st.skills.mental={...};.xp+=20` → `st.player.mental=Math.min(100,(mental||50)+2)`（"mental"非真实键，改写真实字段）
5. npcs.js:1825 `st.skills.beauty={...};.xp+=30` → `st.personalGrowth.image.skincare=Math.min(100,(skincare||0)+6)`（"beauty"非真实键→真实形象维度）
6. domain_e_linkage_r597.js:64 假键数组 `"finance"` → `"english"`（addSkillXp 静默丢弃）

⚠️ 关键坑：Edit 工具将 CRLF 源文件存为 LF 致整文件 diff（585KB）；已用 Python 在 HEAD CRLF 内容上做精准字符串替换，diff 收敛为单行修复，与项目 CRLF 约定一致、避免与并行窗口冲突。

## 联动3项（domain_g_linkage_r599.js，IIFE→RANDOM_EVENTS，全||防御，数值[PLACEHOLDER]）
- g599_shadow_behind (G→D) 首消费 `_everDepressed`(needs.js:228 写入·全库零读取)：情绪低谷后向老友坦诚 → 好感+6 / 心智+5
- g599_survivor_lesson (G→C) 首消费 `_everHadIllness`(illness.js:150 写入)：病愈健康觉醒 → 医疗XP+8 / 心智+4
- g599_chronic_ledger (G→E) 首消费 `_chronicMonthlyPaid`(illness.js 月付记账)：慢病账单倒逼记账 → 会计XP+6 / 设医疗应急金
- 严守域D铁律：firstMetNpcG599 遍历(不硬编码 TODO NPC) + bumpAffinityG599→applyAffinityChange + rel&&rel.met 守卫。

## 验证
- node --check 7文件全过；build dist app.js 12143.1KB（r599 flag 入 bundle count=2）；MC 6×400d EXIT=0·0代码异常·前7天死亡率全0.0%（balanced/corporate 66.7%<80% 为既有RNG平衡阈值非回归；RSS timeout=离线新闻回退）。

## 并发
- 源码(6 A类修复 + r599.js + index.html 挂载)被并行窗口 `git add -A` 扫入 R570 提交（内容 IDENTICAL，CRLF 保留）。
- 并行提交时 dist 未含 r599(flag=0)=悬空引用；本窗口重建 dist 闭合（r599 flag 0→2）。
- 下轮：DOMAIN_H（recency H592 全局最薄弱）。开轮必 git log 重算真实 recency。
