# 域F UI/UX 优化循环 — R397（全系统 8 域轮换优化）

> 自动化轮次：R397 = 域F（UI/UX）。承接 R393(H)→R394(B清理)→R395(D,2b2e4f20)→R396(E,353f13aa)→R398(A,1d09737a) 并行推进后，本窗口独立推进 R397=F。

## 1. 选域与基线

- 开轮 `git log` 重算真实 recency（并行窗口速度远快于本自动化，loop-state 严重滞后）：
  - 并行已 push：R395(D,2b2e4f20) → R396(E,353f13aa)。
  - 并行 in-flight/已提交：R398(A,1d09737a，本地未 push)。
  - 各域最新 round：A=398 / B=394 / C=391 / D=395 / E=396 / F=390 / G=392 / H=393。
- 最薄弱域 = A(389)，但并行即将做 R397/R398=A → 本窗口**避碰选 F(390，次薄弱)**，避免与并行 R398=A 撞车（文件不冲突：domain_f_linkage_r397.js vs domain_a_linkage_r398.js）。
- 轮次号取 R397（接续并行 R396 之后）。

## 2. A类缺陷审计

### 2.1 域F 本域审计（诚实报告：A类=0）
- 全域扫描 17 个 UI 文件（render/render_core/render_infra/daily_quest/daily_focus/daily_report/modal/navigation/data_viz/tutorial/victory/life_memoir/heritage_store/wiki/side_hustle_ui/corp_ui/career_dev）。
- 死字段黑名单（player.happiness / needs.health / player.health / certs）全库 grep：仅命中**历史修复注释行**（daily_quest.js:158/232、daily_report.js:776、tutorial.js:1495 均为 `[全系统自洽修复]...certs→certificates` 注释），**无活代码死写**。
- 除零候选：daily_focus/data_viz/modal 中除法均带 `isFinite`/前置于 `if(>0)` 守卫，无裸除。
- 结论：域F 经 R19/R183/R186/R198/R384/R390 多轮加固，本域 A类净尽 → **A类=0（诚实报告）**。

### 2.2 跨域自洽修复（A类=1）：孤儿文件 domain_h_linkage_r83.js
- 全 linkage 文件注册审计发现 `domain_h_linkage_r83.js` **存在但未在 src/index.html 挂载** → build.py 按 script 序串接时静默跳过 → 其 2 个 corporate 事件（`company_milestone_10_employees` / `corporate_npc_congratulation`）**永久丢失**。
- 根因：R83 时代该文件未被注册，遗留至今（与 R393 修复的「悬空引用」是同一类 build.py 自洽缺陷，方向相反：一为引用缺失文件，一为文件未引用）。
- 修复：src/index.html 在 r393.js 后补注册 `domain_h_linkage_r83.js`（注释 `[全系统自洽修复] 域H R83`）。
- 安全核验：r83.js 为规范 IIFE（`RANDOM_EVENTS` 守卫 + `phase:"corporate"` + 全部 state 访问 `||` 防御 + 真实字段 player.mental/intelligence/fame + `applyAffinityChange`/`StateManager.addMessage` 守卫），事件 id 全库唯一（grep 确认无重复）→ 注册无回归风险。
- **该修复被并行窗口 `git add -A` 一并扫入 R398(A,1d09737a) 提交上 main**（src/index.html 的 r83 注册在 1d09737a 中已含）。

## 3. 跨域联动增强（3 项，domain_f_linkage_r397.js）

IIFE 注入 RANDOM_EVENTS，守卫 `_domainFLinkageR397Loaded`，全 `||` 防御，数值 `[PLACEHOLDER]`，显式 `phase`，id 前缀 `f397_` 唯一。优先命中当前最薄弱域（A/C/G）：

| 事件 id | 相位 | 桥接 | 效果 |
|---|---|---|---|
| `f397_panel_clarity` | street | F→A 面板掌控 | 心智+5 / 幸福感+4（needs.happiness 真实字段），置冷却 |
| `f397_skill_showcase` | street | F→C 成果展示 | addSkillXp("management",8) + 心智+3，需技能≥10 |
| `f397_life_review_ui` | corporate | F→G 季度复盘 | 心智+5，创业阶段回望人生阶段，置冷却 |

## 4. 验证

- `node --check domain_f_linkage_r397.js` / `domain_h_linkage_r83.js` → 均 OK。
- `python build.py` → dist/app.js **10678.1KB**，比 src 新。
- dist bundle 标志计数：`_domainFLinkageR397Loaded`=2 / `_domainHLinkageR83`=2 / `_domainALinkageR398Loaded`=2（**全齐**；修正了并行 R398 提交中 dist 漏打 r398 的不一致）。
- **蒙特卡洛 6×400d**：`MC_EXIT=0` · **0 代码异常**（TypeError/ReferenceError/Uncaught/NaN/Infinity grep 全空）；**前7天死亡率全 0.0% < 10%**（无早期死亡崩溃回归）；存活率 balanced 50.0% / grinder 33.3%≥30% / skiller 83.3% / trader 83.3%≥80% / social 83.3%≥80% / corporate 66.7%——balanced/corporate<80% 为既有 RNG 平衡阈值（harness 标「🔧 需要调整」非代码回归），非本轮引入；36氪/澎湃/TianAPI RSS timeout 为离线新闻网络回退，非代码异常。

## 5. 并发说明

- 并行窗口在轮次进行中连续推进：R395(D)→R396(E)→R398(A,1d09737a 本地未 push)，速度远快于本自动化。
- 本窗口 `git stash -u` 隔离并行 in-flight 后独立做 R397=F（域F，避碰并行 R398=A）。
- 并行窗口以 `git add -A` 把本窗口 src/index.html 的 r83(孤儿修复)+r397(联动)注册**扫入 R398(A,1d09737a)** 一并提交；但并行该次 dist 构建漏打 r398（flag=0），本窗口重建 dist 补齐 r398（flag=2）→ dist 一致性已修正。
- 本窗口最终提交仅含：domain_f_linkage_r397.js（源文件，并行未扫入）+ 重建 dist（含 r398，修正并行不一致）+ loop-state/last_known_head/round-doc。src/index.html 已在 1d09737a 中（含全部注册），不重复提交。

## 6. 下轮

- recency（R397 后）：A=398 / B=394 / C=391 / D=395 / E=396 / F=397 / G=392 / H=393 → **A(398) 仍最薄弱**（并行 R398 已占位，实际下一最薄弱为 G=392 或 C=391）。
- 并行将持续推进；开轮必 `git log` 重算真实 recency（并行速度远快于本自动化）。
