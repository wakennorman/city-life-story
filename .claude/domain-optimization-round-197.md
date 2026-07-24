# 域优化 Round 197 — 域A 数据/数值平衡（第二轮循环续）

- 日期：2026-07-25
- 域：A（数据/数值平衡）— recency 189 最薄弱
- 父 HEAD：`30060fc1`（R231 域B 并行提交后）
- 工作区：仅本轮文件，无并行窗口在途改动需隔离

## 指令一：A类缺陷修复（1 类 / 4 个效果键）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/data/skills.js（:118/:128/:138/:212）＋ src/js/main.js（发证循环）＋ src/js/phase1/illness.js（:137）＋ src/js/main.js（:4598 疲劳计算） | 证书效果键 `healthBonus`/`mentalBonus`/`illnessRiskReduction`/`fatigueReduction` 全库无消费者——发证循环(main.js:3909-3944)仅处理 `*Xp`/intelligence/physique；`fatigueReduction` 仅从 job 技能/装备套装读取，不读证书。nursing_cert/health_manager/rehab_therapist/psychologist 四张证书 desc 宣称的"降低患病风险/健康+5/疲劳-3/心智+5"**全部静默失效**（A类#4 死效果键，grep 大小写不敏感确认仅定义处出现） | main.js 发证成功分支补 4 个消费：`healthBonus`→`state.status.health`(clamp100 即时) / `mentalBonus`→`state.player.mental`(即时) / `illnessRiskReduction`→累积 `state.flags._illnessRiskReduction`(clamp0.8)，phase1/illness.js:137 掷骰前 `ch*=1-min(0.8,cut)` 乘性下调患病触发概率 / `fatigueReduction`→累积 `state.flags._certFatigueReduction`，main.js:4598 工作疲劳计算叠加。每处加注释 `// [全系统自洽修复] 域A R197 修复:...` | A |

交叉验证（Explore + grep）确认已干净、不重复修：economy_v3.1（难度键/财富税/连续盈利衰减 R14/R18 已修）、finance.js（dailyTransactions/companyId R22 已修）、locations.js（specialties/priceMod R189）、skills.js 证书门槛（R189）、illnesses.js 演化计数器对齐（R189）、jobs.js payCalc 技能键全真实、goods.js 食材经"买菜"行动可购买（非误报）。

C类记录（不改）：items.js `skillStudy`/`skillXpBonus`/`skillStudyBonus`(:545/:792/:1162/:1189) 装备效果键无应用器；finance.js `hasStreetStall`/`hasScavengeRoute`(:71/:91) flag 从未写入（街头月收入兜底分支死代码，但主分支按流水估算，影响有限）。留待后续或副业系统合流后接入。

## 指令二：联动增强（3 项，新建 domain_a_linkage_r197.js）

| 新增事件 | 联动域 | 设计意图（一句话） |
|---|---|---|
| a197_health_baseline | A→G（核心机制/生命周期） | 给自己建健康档案基线，把身体当账本管→`state.status.health`+`state.player.mental`+置 `_healthBaselineKeeper`，呼应本轮证书健康效果修复 |
| a197_ledger_clarity | A→F（UI/UX） | 把一年收支做成一张明白账，混沌日子有了清晰形状→mental+`state.needs.happiness`+置 `_budgetClarityKeeper` |
| a197_data_driven_budget | A→H（公司/创业） | 例会用数据而非嗓门争回预算→`addSkillXp("management")`+cash 绩效落袋（corporate 语境守卫） |

- IIFE 注入全局 RANDOM_EVENTS，guard `_domainALinkageR197Loaded`；2 street + 1 corporate，显式 phase。
- 全字段 `||` 防御；数值一律 [PLACEHOLDER]；conditions 用 `_a197*Cooldown` 去重（双重拦截）。
- src/index.html 注册于 domain_c_linkage_r196.js 之后。

## 验证

- `node --check` src/js/main.js / phase1/illness.js / core/domain_a_linkage_r197.js 全通过。
- `python build.py`→dist app.js 9194.6KB（比源新；R197 标志 grep 命中 6 处入 bundle）。
- MC 6×400d **MC_EXIT=0·0 代码异常**（grep 无 TypeError/ReferenceError/NaN/Infinity/Cannot read；前7天死亡率全 0.0%<10% 无早期死亡回归）。存活率 balanced 50%/trader 66.7%<80% 为既有 RNG 平衡阈值波动（与 R195 一致，非本轮引入）；social 100%/corporate 83.3%/grinder·skiller≥30% 均达标。

## 提交

- 仅 `git add` 本轮文件：src/js/data/skills.js（无改，实际改在 main.js/illness.js）、src/js/main.js、src/js/phase1/illness.js、src/js/core/domain_a_linkage_r197.js、src/index.html、src/DEVELOPMENT.md、dist/app.js、dist/index.html、CLAUDE.md、.claude/loop-domain-state.json、.claude/last_known_head、.claude/domain-optimization-round-197.md、.workbuddy/memory 文件。不 `-A`/`--amend`/force。
- 提交前同步 last_known_head=当前 HEAD 过 pre-commit 漂移检查；push 前 `git pull --rebase origin main`。
- 下轮 → F（recency 186 最薄弱，UI/UX；A 已升至 197）。
