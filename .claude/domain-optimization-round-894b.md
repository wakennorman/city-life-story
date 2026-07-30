# R894b 域G（核心机制/生命周期）深审轮 — 2026-07-30

窗口角色：权威 bookkeeping + MC 验证 + 深审A类 + 联动（b后缀避让并行 R881-R893 双编号轨）。
选域依据：git log 实测本窗口深审 recency —— G=R746b 最陈旧（> D=R757b > A=R770b；E/F 已被 R819b/R826b 刷新）。

## A类修复清单

| # | 文件 | 缺陷 | 修复 | 类别 |
|---|------|------|------|------|
| 1 | src/js/core/life_nodes.js | `retire_advisor` **inline effect** 漏设 `_pensionBase`——applyNodeChoice 中 inline 优先、switch兜底被 `_inlineApplied` 跳过（兜底路径:550 有设但永不执行），而 daily_pipeline:2014 养老金块要求 `_retired&&_pensionBase` 双真 → "返聘做顾问"承诺的养老金+50%顾问费永不发放，advisor=纯惩罚陷阱（对比 wealthy 正常领钱） | inline effect 与兜底对齐补 `_pensionBase = currentJob.salary \|\| 5000` | A |
| 2 | src/js/core/life_nodes.js | advisor effect `Object.keys(st.skills).reduce(fn)` 无初始值——skills 为空对象时抛 TypeError，被 applyNodeChoice:469 try/catch 吞掉 → advisor 全部效果静默丢失且 `_inlineApplied=true` 已置、兜底也不跑 | 补 `_skillKeys.length > 0` 守卫 | A |
| 3 | src/index.html | **47处行首杂散 `t` 字符**（`t<script ...>` / `t    <!-- ... -->`，并行窗口插入模板事故）——HTML 文本节点直接渲染，页面上出现可见的散落 "t" 字符（用户可见污染）；后又清并行 R881-R885 新引入 5 处，共 52 处 | Python 字节级批量剥离行首 t（保留 CRLF） | A |
| 4 | src/index.html | **14 个脚本双重挂载**（domain_a_r826/b_r250/b_r700/c_r373/c_r489/d_694/e_470/e_695/f_696/f_876/g_728/g_824/h_825/scenario_start_chains）——build.py 不去重，bundle 双份内联（体积膨胀）；13 个有加载守卫运行时安全，scenario_start_chains **无守卫 IIFE 双执行**（幂等覆盖未爆但裸奔） | 去重保留首个挂载（首挂均在 events_core:552 后，安全）；scenario_start_chains.js 补 `window._scenarioStartChainsLoaded` 幂等守卫 | A/B |

B类记录（不改）：`domain_g_linkage_r862.js` 内容为 "// placeholder" 但已挂载（死挂载，疑并行占位未填，不碰避免踩在途）。

## 联动增强清单（domain_g_linkage_events_r894b.js，3事件，street，均 done-flag 防重复）

| 事件 | 联动 | 设计意图 |
|------|------|----------|
| g894b_advisor_encore | G→E/H | A类#1修复的叙事闭环：advisor 领过养老金后老东家高价咨询单（1.5×基数封顶50K），退休≠退出经济系统（禀赋效应） |
| g894b_quality_score_echo | G→D | `_g824QualityScore` 全库首读（r824 写-only素材清零）：生活质量分≥70 被 met NPC 认可，applyAffinityChange 铁律（社会比较正向面） |
| g894b_career35_compound | G→C | `_career35Path`(transform/newpath) 二层回响（一层叙事 `_career35PathNarrated` 后触发）：转型远期技能复利 management/coding/sales 真实键（峰终定律） |

## 验证
- node --check ×3 过；build 见提交记录；MC 见提交记录。

## 竞态记录
- 本轮 index.html 清理（47t+14去重+r894b挂载）在 build 期间被并行 R881-R885 提交扫走（内容 IDENTICAL 入 HEAD，四项核验过）→ 本窗口只剩 life_nodes/scenario_start_chains/r894b 源文件未提交，另清并行新引入 5 个杂散 t。
- **新竞态形态：并行窗口的挂载模板持续产生 `t<script` 杂散前缀**（R881-R885 各1处），预计后续轮次会继续引入——后续轮开轮例行 `grep -cE "^t" src/index.html` 清扫。

## 下轮候选
D(R757b) > A(R770b) > B(R785b)。开轮必 git log 重算。
