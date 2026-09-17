# 职业域(C) 优化记录 — SeniorDeveloper 驱动（隔离于并行窗口）

> 日期: 2026-07-23 | 驱动: 我（仅职业域，按用户"只做职业部分"指令以避撞车）
> 关联: 并行窗口同期在跑全 8 域 /loop（已推进至 R172 域B，HEAD=fad3d220）

## 背景与碰撞现实
- 用户最终指令："为了尽可能防止撞车，你只做职业部分（域 C）的优化"。
- 但并行窗口是**全 8 域**自主驱动，迟早也会碰职业域；且二者共享同一 git 树 + 同一
  `.claude/loop-domain-state.json` + 同一 `CLAUDE.md` 迭代表 + 同一 `index.html`。
- 已发生的碰撞：
  1. **轮次号撞车**：CLAUDE.md 与 loop-domain-state.json 里的 `R171` 被并行窗口用于
     **域A（数据/数值平衡第九轮）**。我的职业工作从未拿到 R171 记录。
  2. **改动被吸收**：并行窗口循环用 `git add -A` 一类的全量暂存，把我当时未自行提交的
     职业源文件改动（skill_synergy.js / jobs.js）一并提交进它的域A/域B提交里。
     → 我的 A 类修复**已落库、是活的**，但提交信息归属并行窗口。
  3. **孤儿事件**：我新建的 `domain_c_linkage_r171.js`（2 个职业联动事件）虽被提交进 HEAD，
     但**未接入 index.html**，故不在打包产物中、永不触发，是死文件。

## 本轮所做（职业域 C）

### A 类缺陷修复（3 项，已随并行窗口提交落库，文件已含 [全系统自洽修复] 域C 标记）
| 文件 | 缺陷 | 修复 |
|---|---|---|
| `src/js/core/skill_synergy.js` | TRIPLE（三连携）不设 `_synergy_<id>` 标记，但 2 个连携解锁工作 `long_haul_driver`/`smart_home_tech` 用 `requiredFlag:"_synergy_xxx"` 等待该标记 → **永不解锁（死工作）** | TRIPLE 连携分支也写 `_synergy_<id>` 标记，与 DUAL 一致 |
| `src/js/data/jobs.js` | `finance_analyst` 的 `requiredFlag:"_synergy_accounting_management"` 指向不存在的连携 id（实际为 `accounting_investment`）→ **永不解锁（死工作）** | 改为 `_synergy_accounting_investment` |
| `src/js/core/skill_synergy.js` | MECHANICS 百科文案宣称 4 个三连携有"被动收入+¥X"，但 effects 里**根本没有 passiveIncome 字段**（每日被动收入 key 列表也无通用项）→ 叙事与机制不符 | 删除虚假被动收入文案，改为真实 effect（餐饮收入%/员工效率/品牌成长等） |

### 联动增强（2 项，`src/js/core/domain_c_linkage_r171.js`，本轮由我接入 index.html 并独立提交）
| 新增事件 | 联动域 | 设计意图 |
|---|---|---|
| `career_synergy_milestone`（连携里程碑引导） | C→F(UI/叙事) | 首次达成双/三连携时弹引导叙事，解释"连携=职业流派成型"，给新手职业成长正反馈（峰终+禀赋效应） |
| `career_mentor_path`（前辈指点职业联动） | C→D(NPC/社交) | 在职 N 年且技能达阈值时，由已结识 NPC（如 mentor 类）给出职业路径指点，闭合职业→社交因果链 |

- 严格照 `events_corp.js` IIFE + `RANDOM_EVENTS.push` 范式；`phase:"street"`；含 `st.gameOver` 闸门、conditions 全字段防御。
- 自检：风格一致 ✅ / 防御性 ✅ / 不重复已有功能 ✅ / conditions 全 false 时叙事仍合理 ✅ / 移动端+桌面适配（纯文本事件，引擎统一渲染）✅。

## 交付状态（诚实记录）
- ✅ 源修复：已落库（被并行窗口提交吸收）。
- ✅ 联动事件：已接入 `index.html`（本轮）+ 重新 `build.py` + 验证 `dist/app.js` 含 2 事件 id。
- ⚠️ CLAUDE.md 迭代表：未由我更新（R171 已被并行窗口域A 占用，且并行窗口正进行中改 CLAUDE.md，我再改会撞）。
- ⚠️ `.claude/loop-domain-state.json`：未由我更新（同上，单一共享文件，轮次号已撞车）。
- ⚠️ 提交：本轮仅独立提交 index.html 接线 + dist 重建产物；源修复的 commit 归属并行窗口。

## 结论与建议（给用户）
双驱动共享单一 git 树 + 单一状态/文档文件，**轮次号与共享文件无法被两个驱动同时干净维护**。
推荐三选一：
1. 单一驱动：停掉并行窗口，只让我跑（或反之），/loop 才有连续轮次号与干净交付。
2. 分区：我**只准备**职业源文件改动（含新事件文件 + index.html 接线），**不碰** CLAUDE.md/状态文件，
   由并行窗口在其轮次里 `git add` 我的职业文件并提交（需它放弃 `git add -A`，改精确 add）。
3. 接受现状：职业改动靠并行窗口的 `git add -A` 顺手提交，CLAUDE.md/状态由并行窗口统一记，
   我侧只维护独立记忆文件（本文件），不再追求独立轮次号。

> 数值一律 `[PLACEHOLDER]` 待平衡。
