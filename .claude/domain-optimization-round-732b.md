# 域C 职业/成长 优化轮次 R732b（第四轮循环收尾·本窗口自动化）

- 日期：2026-07-29
- 域：C 职业/成长
- 选域依据：git log 重算真实 recency。第四轮循环实测 C(R724)→D(R725)→E(R726)→F(R727)→G(R728)→H(R729)→A(R730)→B(R731) 已完整跑完，域C(R724) 成为最陈旧域（距 HEAD 8 轮），故本轮 R732b 锁域C。（loop-state 滞后指向 DOMAIN_A，已按铁律以真实 recency 覆盖。）
- 竞态后缀：`b` 后缀避让并行窗口（同轮号双域已成常态）。

## A类缺陷审计（4项例行，诚实报 = 0）

1. **连携工作门控（requiredFlag `_synergy_*`）**：jobs.js 8 个连携工作依赖 `state.flags._synergy_<id>`。核验 `skill_synergy.js:371/415` 在 `checkSkillSynergies` 中于技能达阈值时**动态置位** `state.flags["_synergy_"+synergyId]`；且 `daily_pipeline.js:2112` 每日常规调用 `checkSkillSynergies(state)` → 8 连携 flag 均可被满足，工作可达。非死工作。
2. **推荐 flag（oldZhouReferred/bossLiReferred/sisterZhangReferred/chefChenAssistant/_logisticsJobOffer/xiaoMeiReferred/xiaoWeiReferred）**：全部在 `job_milestone_events.js` / `npcs.js` 中有真实 setter，可达。
3. **职业满级叙事占位符泄漏**：career_dev.js:5411+ 等 6 处 `{pathName}/{levelName}/{skillName}/{masterName}` 模板，均配有 `text:function(st)` 动态叙述（R677b 修复），渲染层 `events_core` 仅调 `text()` → 不泄漏。
4. **死字段黑名单 / 假技能键 / 悬空**：player.happiness/needs.health/player.health/certs 全库 0 活命中；`addSkillXp("...")` 全库键均为真实技能键（management/accounting/social/coding/...）；index.html 挂载与源文件一一对应，无悬空。

**结论：A类 = 0 处。** 域C 经 R191/271/489/677b/709/716/724 多轮深审已净尽，本轮四项审计交叉验证确认仍净尽，诚实报 0。

## 追加核实（非A类，记录避免重复审）

- 职业晋升 XP 兑现：career_dev.js:3286-3294 晋升时 `addSkillXp(reqSkill, 20+floor(salary/1000))` 真实写技能，无零回报。
- 零消费素材账（MEMORY 挂账 `_legacyProjectDay`/`_careerMonthlySnapshots`/`_burnoutWasHigh`）经 grep 确认已被 R535/R677b/R685b/R724 在 `ui/career_dev.js` + `daily_pipeline.js` 消费，非孤儿——MEMORY 注记已过期。

## 联动增强 3 项（域C 作为触发源）

文件：`src/js/core/domain_c_linkage_r732b.js`（IIFE 注册 RANDOM_EVENTS，`_domainCLinkageR732bLoaded` 守卫，phase 显式 "street"，全 `||` 防御，addSkillXp try/catch，StateManager 存在性检查，done-flag 防重 + `excludeFlags` 冷却）。

1. **c732b_burnout_pivot（C→G 核心机制/生命周期）**
   - 门控：`st.career.currentJob` 存在（C域本体，正确用 `st.career` 而非 `st.employment`）+ 低幸福感(<35) / 高疲劳(>60) / 高心理压力(>50) 任一。
   - 抉择：调休（心情+10、疲劳-12、`personalGrowth.health.mental.stress` -25 双形态安全写）+ 冲刺（现金+800、疲劳+8、心情-3）。
   - 消费：真实职业状态 + G 域精力/心理字段。

2. **c732b_salary_leverage（C→A 数据/数值平衡）**
   - 门控：`st.career.currentJob` + 管理技能 Lv.≥40 + day≥200。
   - 抉择：谈判加薪（**持久调薪** `currentJob.salary += 600` + 即时现金+1000）/ 暂不谈薪（管理XP+8）。
   - 消费：管理技能 + 职业稳定性 → **持久提升 ongoing 月薪**（ genuine durable 跨域经济兑现，区别于 R724 的一次性智力/会计XP）。

3. **c732b_mentor_echo（C→B 事件/叙事）**
   - 门控：`st.career.currentJob` + `st.flags._careerPromotionCount >= 1`（career_dev.js:3270 真实写入的晋升计数）。
   - 抉择：回看来时路（心智+6、魅力+3）/ 传经验给后来者（社交XP+6）。
   - 消费：真实晋升计数 + 动态读取职业路径名（`text()` 动态叙述），叙事回报。

> 数值均标 `[PLACEHOLDER]` 注释标记可调配点（沿用 R724 落地惯例：具体保守数值 + 注释标记，确保 MC 可跑、不破坏平衡）。

## 验证

- `node --check src/js/core/domain_c_linkage_r732b.js` → SYNTAX_OK
- `python build.py` → dist/app.js 重建（13775KB），3 事件 `c732b_*` 各入包 2 次引用（定义+push）
- `node --check dist/app.js` → DIST_SYNTAX_OK
- Monte Carlo `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → 待结果（目标 0 代码异常 / 前7天死亡 0%）

## 提交与推送

- 提交文件：`src/js/core/domain_c_linkage_r732b.js` + `src/index.html`(挂载) + `dist/app.js` + 本轮 bookkeeping（CLAUDE.md 迭代表 / round doc / loop-state / last_known_head）。
- 提交信息：`feat: [R732b] 域C 联动增强3项(C→G倦怠拐点/C→A持久调薪/C→B晋升回声)` + `chore: [R732b] 域C账本 — CLAUDE.md迭代表+round-732b+loop-state+memory`。
- 推送前 `git pull --rebase origin main`；TLS 阻断则 LOCAL_ONLY 回填，不 force。
