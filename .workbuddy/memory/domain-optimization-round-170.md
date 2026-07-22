# 全系统优化 Round 170 — 域 H / Phase2·公司

> 日期: 2026-07-23 | 提交: main | pushStatus: LOCAL（代理 127.0.0.1:3067 挂）

## 选域逻辑
H 域自 R17 后未再主审（最久未轮到），本轮作为"薄弱域"优先处理。

## 1. 修复清单（A 类）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/phase2/corp_ops.js` `enterCorporatePhase` | 初始化职级属性直接用 `p.mental`/`p.agility`/`p.intelligence`/`state.skills.sales.level`/`state.skills.coding.level`，字段缺失时产出 `NaN` 的 `dignity/kpi/upwardMgmt/ability`（极端值NaN典型） | 提取 `_mental/_agility/_intel/_salesLv/_codingLv/_fame` 并 `isFinite`+默认回退，杜绝 NaN 污染 | A |

> 说明：H 域 `team.js`/`promo.js`/`company_spawner.js`/`corp_ops.js`/`events_corp.js` 历史轮次（R17/R83 等）已重度加固守卫与 gameOver 闸门，本次逐项复查无新增死引用/脱钩；唯一真实 A 类为上述 NaN 初始化缺陷。

## 2. 增强清单（联动，2–4 项）

| 新增 | 文件 | 联动域 | 设计意图（一句话） |
|---|---|---|---|
| `corp_exec_lifestyle`（P8+ 高管） | `domain_h_linkage_r170.js` | H→A | 高薪回填生活需求（happiness/health），并置 `_execLifestyleInflation` 待 A 域消费系统读取，闭合公司收益→生活品质 |
| `corp_mentor_newcomer`（P7+ 在职≥3年） | 同上 | H→C | 带教新人反哺职业成长（upwardMgmt/ability + `_mentorCount` 职业传承标记） |
| `corp_seek_senior_advice`（P5/P6 junior） | 同上 | H→D | 向前辈 boss_li 请教→好感+KPI，激活职场社交主动线 |

- 注入范式：照 `events_corp.js` IIFE（`phase:"corporate"`、`RANDOM_EVENTS` 守卫、`conditions` 全字段防御、`st.gameOver` 闸门）。
- 引擎**不自动扣 `cost`**（仅禁用按钮），生活品质选项在 `apply` 内手动 `cash -= 5000`，无双重扣费。
- 数值标 `[PLACEHOLDER]`（消费门槛 5000 / 理财分红 2000）待平衡。
- 防御：`st.resources.cash||0`、needs 字段 `||50` 兜底、NPC 用 `applyAffinityChange` + met 守卫。

## 3. 验证
- `node --check` corp_ops.js / domain_h_linkage_r170.js ✅
- `python build.py` ✅（dist/index.html 比源新；esbuild `jobMultiplier` 重复键为既有警告，非本轮引入）
- `MC 6×400d`：**0 代码异常**（Exit 0）。`[trader] 66.7% < 80%` 为既有平衡阈值（多轮历史值，非回归）；corporate 83.3% 通过。

## 4. 提交
- `fix: [域H] A类缺陷修复(1个 NaN守卫)+联动增强(3项)`
- 改动文件：`src/js/phase2/corp_ops.js`、`src/js/core/domain_h_linkage_r170.js`、`dist/index.html`
- 状态：`CLAUDE.md` 迭代表补 R170（并注 R29–R169 由记忆文件跟踪）、`src/DEVELOPMENT.md` 版本行、`.claude/loop-domain-state.json`、`.claude/last_round`、`.workbuddy/memory/domain-optimization-round-170.md`

## 5. 循环机制变更（本轮外）
- 新建 WorkBuddy automation `automation-1784740078428`（HOURLY 驱动，提交到 main）：因平台不支持 MINUTELY，10 分钟粒度无法实现，改为每小时一轮。真·10 分钟需用户外部调度器。
- 既有 `automation-1783592608308` 为每日0点扫描器（L4-B 审计），未动。
