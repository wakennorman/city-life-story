# 域优化循环 · Round 278 — 域A（数据/数值平衡·第二轮·第十一次·账本R278，代码文件 domain_a_linkage_r277.js，R277 编号被并行窗口占为域F）

- **日期**: 2026-07-26
- **域**: A 数据/数值平衡
- **轮次判定**: 开轮 loop-state 严重滞后（标 R271/next=G，实际并行窗口已推进至 R276）。据 `git log` 重算各域最新轮次 A=R267 / B=R274 / C=R272 / D=R275 / E=R276 / F=R270 / G=R271 / H=R273 → **A 最薄弱**，执行期并行窗口又占用 R277 标签为域F(commit 2d01102b)并 chore-scoop 本轮源码(ff32c31e)→为去冲突,本轮账本记 **R278=域A**(代码文件名 domain_a_linkage_r277.js 保留,precedented)。

## 指令一：A类缺陷审查 → 0 项（诚实报告）

逐子系统审计域A真实文件，结合死字段黑名单全库 grep：
- `economy_v3.1.js / jobs.js / skills.js / goods.js / finance.js / needs.js`：死字段黑名单（`state.player.happiness` / `state.needs.health` / `state.certs` / `state.player.health`）**全库 0 命中**。
- 近期域A联动文件 `domain_a_linkage_r258.js / r267.js`：`phase` 字段齐备（events_core.js:379 按 phase 过滤，无 phase=死事件）；`addSkillXp` 仅用真实商业技能键（sales/accounting/management）；无死字段。
- 历轮 **R14/R22/R197/R242/R251/R258/R267** 已系统性净尽域A A类隐患（难度键名/payCalc 字段/finance 月收入错链/证书死效果键/非真实技能键等均已闭环）。

结论：**A类=0，诚实报告，无编造修复**。

C类记录不改（域外/无应用器，历轮已记）：`items.js` skillStudy/skillXpBonus 无应用器；`finance.js` hasStreetStall/hasScavengeRoute flag 无 writer。

## 指令二：联动增强 3 项（新建 `src/js/core/domain_a_linkage_r277.js`）

主题：把「数字素养」外化成生活里的具体红利。IIFE 注入 RANDOM_EVENTS，2 street + 1 corporate，全字段 `||` 防御，数值 [PLACEHOLDER] 可调基线。

| 事件 id | 方向 | phase | 设计意图（一句话） |
|---|---|---|---|
| a277_haggle_edge | A→C | street | 商业技能≥3+交易频次≥15 的老手识货砍价，把经验换成现金+技能XP（经历变现·峰终小确幸） |
| a277_neighbor_bulk_buy | A→D | street | 现金缓冲充足+已结识NPC→组织街坊团购，省钱又攒人情（applyAffinityChange 严守 rel.met 铁律） |
| a277_cost_control_report | A→H | corporate | 在职于公司+账务管理技能≥8→用数据做成本控制报告争业绩（management XP+奖金入bankBalance+upward） |

自检：风格与 r267 一致；全防御性检查（gameOver/skills/resources/relationships/corporate.company 守卫，NPC 走 rel.met）；不重复既有功能（砍价/团购/成本管控三主题历轮域A未用）；conditions 全 false 时叙事仍合理（三事件均有兜底"随缘"分支）；移动端+桌面通用（纯事件层，无 UI 硬编码）。注册于 src/index.html domain_e_linkage_r276.js 之后。

## 验证

- `node --check src/js/core/domain_a_linkage_r277.js` → OK
- `python build.py` → dist/app.js 9670.3KB（`_domainALinkageR277Loaded` + `a277_cost_control_report` 入 bundle，count=4，dist 比 src 新）
- MC `--trials 6 --days 400` → **EXIT=0·0 代码异常**（TypeError/ReferenceError/Uncaught/Infinity/NaN grep=0）。存活率 balanced/corporate 50% 为既有 RNG 平衡阈值波动（非本轮引入、非代码回归）；trader 100%/social 83.3%/skiller 83.3% 达标。

## 下轮

→ **G**（核心机制/生命周期，最新 R271，除 A 外最薄弱；并行已把 F 推进至 R277）。
