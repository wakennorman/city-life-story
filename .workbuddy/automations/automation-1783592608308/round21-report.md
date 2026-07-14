# Round 21 — 域H（Phase2/公司）执行报告

> 自动化循环「城市浮生记·全系统8域轮换优化」第 21 轮 = 域H（创业/公司）。
> 这是 8 域完整循环（R14→R20 跑完 A~H 一轮）后的**第二轮起点**。
> 提交不 push；仅改 `loop/auto` 分支。

## 一、A类缺陷审查与修复（3项，全部确证）

### A-1（CRASH + 死代码）`events_corp.js` — `corporateorate` 拼写错误（9处）

- **根因**：顶层 `state.corporate`（state.js:189）持有玩家职场雇佣状态，含 `.team:[]`、`.company`、`jobOffer` 等真实字段（被 `team.js`/`main.js`/`perf.js`/`events_core.js`/`enterprise_fate.js` 大量使用）。但本文件 9 处误写成 `st.corporateorate`（从未初始化的对象）。
- **崩溃点**：
  - L433 `st.corporateorate.team.length` → 读未定义对象 `.team` → TypeError
  - L649 `st.corporateorate.jobOffer = {...}` → 写未定义对象 → TypeError
  - L1689 `!st.corporateorate.company`、L1691 `st.corporateorate.company.id` → `conditions` 在每日事件匹配时被调用（events_core.js），phase==="corporate" 时必崩
  - L2108-2110 / L2179-2180 `if (st.corporateorate) { ...重置 }` → 守卫恒假 → `state.corporate.team` 永不清、`jobOffer` 永不置空（离职/跳槽时死代码）
- **修复**：9 处 `corporateorate` → `corporate`（顶层 `state.corporate`）。`node --check` 通过。
- **核实要点**：我曾怀疑是否漏 `player.` 前缀（同 handler 内用了 `st.player.corporate` 绩效对象），但 grep 证实 `state.corporate.team`(team.js/main.js/perf.js)、`state.corporate.jobOffer`(events_core.js:690/718)、`state.corporate.company`(enterprise_fate.js:832/1110/1800) 均为真实字段——确认是顶层 `state.corporate`，原 agent 结论正确。

### A-2（NaN→UI）`startup.js` — `improveEmployeeSatisfaction` 空团队除零

- **位置**：`improveEmployeeSatisfaction`(L4542)。L4595 先扣现金 `company.cashReserve -= act.cost`，L4600 遍历 `company.employees`（初创期可为 `[]`），L4634 `totalSatisfactionGain / company.employees.length` 在空团队时为 `0/0 = NaN`，L4639 显示「全员满意度提升至平均**NaN**分」。
- **修复**：循环前加守卫 `if (!company.employees || company.employees.length === 0) return { success:false, message:"团队还没有成员，无法开展团队活动" };`，既防白扣现金又防 NaN。`node --check` 通过。

### A-3（死代码 / 永不触发）`startup_crisis.js` — 整创业危机子系统无调用方

- **根因**：`checkStartupCrises`/`showCrisisModal`/`handleCrisisChoice`/`applyCrisisChoice`/`getCrisisSummary` 全库**无任何外部调用**（仅文件内自引用 + `window.MECHANICS.startup_crisis` 注册），玩家永不遭遇任何创业危机，尽管代码与百科条目都存在。
- **修复**：在 `tickStartup`(startup.js:2396) 季度分支接入，仅当 `state.startup.company` 存在时调用：
  ```js
  if (tickType === "quarterly" && typeof checkStartupCrises === "function") {
    try {
      const _crisis = checkStartupCrises(state);
      if (_crisis && typeof showCrisisModal === "function")
        showCrisisModal(state, _crisis.crisisId, _crisis.crisis);
    } catch (e) {
      /* 危机展示失败不应中断每日结算 */
    }
  }
  ```
  - `checkStartupCrises` 自身只读真实字段、设 `lastCrisisDay` 冷却（30天）并返回危机对象，无 DOM 依赖；
  - `showCrisisModal` 含 DOM 构建，headless MC 下若 `showModal` 抛错被 `try/catch` 吞掉，不中断每日结算；
  - `handleCrisisChoice`（用户点选）内的 `document.querySelector` 仅在真实浏览器点选时触发，tick 流程不触及。
  - `node --check` 通过。

## 二、联动增强（3项）— 新建 `src/js/core/company_linkage_events_r21.js`

IIFE 注入全局 `RANDOM_EVENTS`（2 street + 1 corporate），全 `||` 防御，`[PLACEHOLDER]` 数值；id 前缀 `company_h_*` 与 R12 `company_linkage_events.js` 的 `startup_*` 不冲突：

- `company_h_foundation_discipline`（H→A，street）：创业纪律感 → `mental+5` / `心情+4`
- `company_h_team_warmth`（H→D，street）：带队温度 → `applyAffinityChange` 好感+6（守域D铁律 `rel.met`）
- `company_h_business_acumen`（H→C，corporate）：经营眼界 → `addSkillXp("management",8)`

已注册于 `src/index.html`（core_mechanics_linkage_events.js 之后）。

## 三、验证

- `node --check` 三改动文件（events_corp.js / startup.js / company_linkage_events_r21.js）全部通过。
- `build.py` 重建 `dist/index.html` → **8281.8 KB**（比 src 新）。
- Monte Carlo 6×400d：运行中，须 **0 代码异常**（待完成提交）。

## 四、提交

- 计划：仅 `git add` 域H 文件（events_corp.js / startup.js / company_linkage_events_r21.js / src/index.html / DEVELOPMENT.md / dist/index.html / loop-domain-state.json / last_known_head），不 `-A`、不 push。
- `DEVELOPMENT.md` → v3.112；`loop-domain-state.json` → round21/H/nextDomain=**A**（第二轮循环起点）。
- 下轮 → **域A（数据/数值平衡）**（新一轮）。
