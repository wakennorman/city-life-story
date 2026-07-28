# 域轮换优化回合 R685b · 域C 职业/成长（跨域占位符收口 + 孤儿死flag首消费）

> 日期：2026-07-28 ｜ 窗口：本自动化（R685b，b后缀避让并行 R685）｜ 分支：main（本地提交，未推送）

## 一、选域与背景

- git recency（R686 后）：A=R683 / B=R684 / C=R685 / D=R686 / E=R679 / F=R680 / G=R681 / H=R682。
- 本回合聚焦 **域C**，但 A类修复实为**跨域占位符泄漏收口**（域C/D/A/B 文件均有），联动仍为域C。
- 竞态背景：并行自动化窗口已本地提交 R682–R686（未推送，网络 TLS 中断），并正在途编辑 R687（域E）：
  `src/index.html` 新增 r687 挂载、`domain_e_linkage_r637.js` 修改、`domain_e_linkage_r687.js` 未跟踪。
- **本窗口策略**：只提交自己的 5 A类源文件 + r685b.js 源；**不碰并行在途文件、不重建 dist**（避免混入 r687）。

## 二、A类缺陷修复（5处，跨域 story 占位符泄漏 → text() 动态叙述）

根因：`events_core.js` 渲染层自 R455 起只调用 `evt.text(state)`，不再调用 `evt.story` / `evt.renderStory`；
凡使用 `renderStory` 或缺失 `text()` 的事件，其 `{占位符}` 会原样泄漏给玩家。本次收口 6 个事件：

| 文件 | 事件 | 泄漏占位符 / 问题 | 修复 |
|---|---|---|---|
| `src/js/ui/career_dev.js` | `career_legacy_reflection` | `{firstJob}{currentJob}{workYears}` 原样泄漏 + 文案"到现在现在的"重复 | 补 `text:function(st)` 动态叙述 + 回退，修正重复 |
| `src/js/core/domain_c_linkage_r243.js` | `skill_branch_recognition` / `cert_life_shortcut` | `{skill}{branchName}` / `{certName}`；`renderStory` 死接口 | `renderStory`→`text()` 带回退 |
| `src/js/core/domain_a_linkage_r245.js` | `quantified_life` | `{netWorth}{growthPct}` | `renderStory`→`text()` |
| `src/js/core/domain_b_linkage_r244.js` | `npc_long_absence_reunion` | `{npcName}{days}` | `renderStory`→`text()` |
| `src/js/core/domain_d_linkage_r246.js` | 社交事件 | `{metCount}{totalAff}` | `renderStory`→`text()` |

全部 `node --check` 通过；`text()` 均带 `|| '回退文案'` 防御。

## 三、联动增强（3项，IIFE → RANDOM_EVENTS，全 || 防御，done-flag 防重）

文件：`src/js/core/domain_c_linkage_r685b.js`（此前未跟踪 = index.html 挂载悬空引用，本回合补回源消除 phantom-mount A类）

1. `c685b_legacy_anniversary`（C→G）：首消费写-only 死flag `_legacyProjectDay`，职业里程碑回望叙事。
2. `c685b_trainer_milestone`（C→E）：事件层首消费 `_trainerIncomeTotal`（培训班累计收益），职业→投资方法论。
3. `c685b_data_consult`（C→E/D）：首消费 `_skillDataAnalysis`（数据分析技能），职场数据咨询变现。

`[PLACEHOLDER]` 用于估值常量，待后续回合按平衡值回填。

## 四、提交

- `5465e851` fix: [域C] A类缺陷修复(5处) story占位符泄漏→text()动态叙述
- `72ca54be` feat: [域C] 联动增强(3项) 孤儿写-only死flag首消费

> 两项均为**本地提交**，因 origin/main 推送遭遇 TLS 中断未能 push（见下）。

## 五、未决 / 风险

- **网络中断**：`git push origin main` 报 `TLS connect error: unexpected eof`。origin/main 仍停在 R681（ded0b5a0）；
  本地 HEAD = 72ca54be，领先 origin/main 多个提交（含并行 R682–R686）。待网络恢复后由协调窗口统一 pull --rebase + push。
- **并行 R687 在途**：未提交（index.html/r637/r687）。本窗口未触碰；dist 重建交由并行 R687 接管（其 build 会纳入本回合已提交的 src 修复）。
- **dist 未重建**：本回合不提交 dist（避免混入并行 r687 源），遵循"build 含并行在途未提交源→绝不提交 dist"铁律。

## 六、下轮建议

recency（R686 后）最陈旧为 **域E（R679）** → 下轮 `nextDirection = DOMAIN_E`。
