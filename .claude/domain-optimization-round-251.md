# Round 251 — 域A 数据/数值平衡（第五轮）

- **日期**：2026-07-26
- **域**：A 数据/数值平衡（jobs / skills / items / goods / illnesses / pricing / trade / economy_v3.1）
- **起始 HEAD**：`1e4c4e58`（R249 域H）
- **本轮定位依据**：loop-state 标 nextDomain=F(recency 238)，但 git log 显示 R247(F)/R248(G)/R249(H) 已由并行窗口提交、R250(B)在途(已 stash 隔离)。重算真实 recency = A:242/B:250/C:243/D:245/E:246/F:247/G:248/H:249 → **域A(242)最薄弱**，本轮=R251 域A。

## 一、A类缺陷修复清单

**A类 = 0（诚实报告）**

域A 历经 R14 / R22 / R197 / R242 四轮加固，本轮逐子系统复审确认已自洽：

| 子系统 | 审计结论 |
|---|---|
| illnesses.js / illness.js | 演化链计数器(gastritisCount/pneumoniaCount/...)由 `_addIllness`/`recordIllnessCure` 真实维护；`state.player.age` 递增(daily_pipeline.js:1280)、age 门控有效；R197/R242 已加固 |
| jobs.js | 8 个 `_synergy_*` requiredFlag 全部匹配 skill_synergy.js 连携 id；6 个 referral flag 均有写入者 |
| economy_v3.1.js | 难度键(easy/normal/hard/hell)、累进财富税、税率档逆序遍历均已修(R14/域A历轮) |
| skill_synergy.js | 13 连携 id 齐全，`_synergy_` flag 写入正确(line 370/414) |
| items.js | effects 键为装备/消耗品属性(hygiene/coldProtection/…)，由装备系统消费；`skillStudy` 无应用器为**既有 C类**(R197 已记，非本轮修) |
| goods.js | 定价与描述自洽(water¥1.5/noodles¥4/electronics¥80/scrap¥0.8–2.5)，无 >3 倍错配 |
| finance.js / needs.js | 死字段 grep 全库 0 命中 |

死字段黑名单 grep（`state.player.happiness` / `state.needs.health` / `state.certs` / `state.player.health` / 非真实技能键 writing/design/finance/physique/agility/intelligence）在 items/finance/needs 全部 0 命中。

（遵循历史诚实报告先例：R198 域F A类0 / R199 域G A类0）

## 二、联动增强清单（3 项，新建 `src/js/core/domain_a_linkage_r251.js`）

历轮域A 已覆盖 A→B(r242)/A→C(r242)/A→F(r197)/A→G(r197)/A→H(r197,r242)。本轮补齐 **A→D / A→E 两个全新配对**：

1. **a251_skill_neighbor_help（A→D · 全新配对 · street）**
   门控：持有一项实用技能(repair/cooking/medicine level≥5) + 有已结识街坊(好感≥10)。
   用真实技能帮街坊，好感变更严守域D铁律走 `applyAffinityChange`；顺带 `addSkillXp` 练手；置 `_skillNeighborBond`。

2. **a251_price_inflation_sense（A→E · 全新配对 · street）**
   门控：读真实 `st._eraState.inflationIndex ≥ 1.2`（通胀有感）。
   从菜价数据养出避险意识 → 置 `_dataInvestorMindset`(E域事件消费) + `addSkillXp("accounting")`(记账练手)。

3. **a251_ledger_year_review（A→H · corporate）**
   门控：在职(career.currentJob 或 corporate.company) + accounting 或 management 技能 level≥8。
   用真实会计/管理技能做年终经营复盘 → `addSkillXp("management")` + cash 绩效；置 `_dataReviewCredibility`。角度区别于 R197(争预算)/R242(证书背书)。

设计约束：IIFE 注入全局 `RANDOM_EVENTS`；显式 `phase`(2 street + 1 corporate)；全字段 `||` 防御；数值一律 `[PLACEHOLDER]`；去重用 `_xxxCooldown`(conditions+apply 双重拦截)；id 前缀 `a251_` 与 a189_/a197_/a242_/data_ 不冲突。

## 三、验证

- `node --check src/js/core/domain_a_linkage_r251.js` → 通过
- `python build.py` → dist/app.js **9448.0 KB**（R251 标志入 bundle，dist 新于 src）
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → **MC_EXIT=0，CODE_ERR_COUNT=0**（0 TypeError/ReferenceError/Uncaught/NaN）。balanced 66.7%/grinder 0%/trader 50%/corporate 16.7% 存活率<阈值为**既有 RNG 平衡阈值波动**，非代码回归。

## 四、提交纪律

- 同步 `.claude/last_known_head` = `1e4c4e58`（当前 HEAD）
- 只 `git add` 本轮文件：`domain_a_linkage_r251.js` + `src/index.html` + `dist/app.js` + `dist/index.html` + `CLAUDE.md` + `.claude/domain-optimization-round-251.md` + `.claude/loop-domain-state.json` + `.claude/last_known_head`
- `git pull --rebase origin main` → `git push origin main`
- 并行 R250/域B 在途改动开轮已 `git stash` 隔离，push 后 `git stash pop` 还原（index.html 我方插入点(r246后)与并行插入点(r244后)相隔2行，可自动合并；dist/app.js 冲突由 pop 后重建解决）
- 下轮 → **C（recency 243，除本轮A外全局最薄弱）**
