# 城市浮生记·全系统优化 Round 22 — 域A（数据/数值平衡，第二轮）

**日期**: 2026-07-14
**分支**: `loop/auto`（仅本分支提交，不 push / 不碰 main）
**版本**: v3.113（DEVELOPMENT.md 顶部）
**轮换序**: …→ H(R21) → **A(R22, 第二轮)** → B(next)

---

## 一、A 类缺陷审查与修复（3 项，均经 grep 实证）

### 修复 1 — `finance.js` 街头阶段月收入误读不存在字段
- **位置**: `src/js/core/finance.js` `calculateMonthlyIncome()`
- **原状**:
  ```js
  const transactions = state.resources?.dailyTransactions || [];
  ```
- **根因**: `state.resources` 无 `dailyTransactions` 字段（真实为 `state.flags._dailyTransactions`）。`|| []` 兜底为空数组 → `totalIncome` 恒为 0。
- **后果**: 街头阶段玩家"月收入"恒为 0，影响 `calculateWealthTax`、贷款审批（`evaluateLoanApplication` 用月收入估偿还力）几乎必拒；连续盈利衰减机制（R 类）也因此拿不到真实收入。
- **修复**:
  ```js
  const transactions = state.flags?._dailyTransactions || [];
  ```

### 修复 2 — `finance.js` 职场阶段取当前公司用错字段（薪资修正恒失效）
- **位置**: `src/js/core/finance.js` `calculateMonthlyIncome()`（职场分支）
- **原状**:
  ```js
  const companyId = state.corporate?.companyId;
  if (companyId && state.startup?.companies) {
    const company = state.startup.companies.find((c) => c.id === companyId);
    ...
  }
  ```
- **根因**: 两处字段均不存在：
  - `state.corporate.companyId` 不存在 → 真实当前公司是对象 `state.corporate.company`（corp_ops.js:302 `COMPANIES.find(...)`，含 `.id`/`.name`）。
  - `state.startup.companies` 不存在 → 真实企业库为 `state.enterpriseFate.companies`（对象，按公司 id 字符串为 key；enterprise_fate.js:832、companyHistory.js:36、startup.js:726 实证）。
- **后果**: `companyId` 恒为空 → `if` 永假 → `salaryMod` 恒为 `1.0`，公司薪资修正（加班/绩效系数）完全失效。
- **修复**:
  ```js
  const company = state.corporate?.company;
  let salaryMod = 1.0;
  if (company && company.id && state.enterpriseFate?.companies) {
    const comp = state.enterpriseFate.companies[company.id];
    if (comp) {
      salaryMod = comp.salaryMod || 1.0;
    }
  }
  ```

### 修复 3 — `data_linkage_events.js` 写死字段 `player.happiness`
- **位置**: `src/js/core/data_linkage_events.js`（R14 "分享安稳" 分支）
- **原状**:
  ```js
  if (st.player) {
    st.player.happiness = (st.player.happiness || 50) + 3;
    st.player.mental = (st.player.mental || 50) + 2;
  }
  ```
- **根因**: `state.player` 无 `happiness` 字段（真实幸福感在 `state.needs.happiness`；`mental` 在 `state.player.mental` 是对的）。写 `st.player.happiness` 是往不存在字段赋值，静默丢失。
- **后果**: A→D 联动"分享安稳"的幸福感加成从不生效。
- **修复**:
  ```js
  if (st.needs) {
    st.needs.happiness = (st.needs.happiness || 50) + 3;
  }
  if (st.player) {
    st.player.mental = (st.player.mental || 50) + 2;
  }
  ```

> **误报排除**: Explore agent 曾报 `data_linkage_events.js:149` 的 `st.player.corporate.upward` 为错字段。经全仓 grep 证实 `st.player.corporate.upward` 是真实惰性字段（约 10 个事件文件读写同一 key），与 `upwardMgmt`（corp KPI，promo/perf/corp_ops 用）是**两个不同字段**。R13 记忆结论正确，**未改动**。

---

## 二、联动增强（新建 `src/js/core/data_linkage_events_r22.js`）

- **注入方式**: 独立 IIFE 文件，向全局 `RANDOM_EVENTS` push，注册于 `src/index.html`（紧接 `data_linkage_events.js` 之后）。
- **id 前缀**: `data2_*`（与 R14 `data_*` 不冲突）。
- **契约合规**: 无 `phase` 字段（引擎 `e.phase===phase` 过滤——无 phase 即全阶段可发火，符合联动事件定位）；权重用 `probability`；无 `onResolved` 钩子。
- **防御**: 所有数值/字段读取均 `||` 兜底；占位数值标 `[PLACEHOLDER]`。

| id | 桥接 | 角度 | 关键效果 |
|----|------|------|----------|
| `data2_lean_budget` | A → D | 现金缓冲→邀好友小聚 | 现金≥`[PLACEHOLDER]` 时 `applyAffinityChange(state, nid, +2)`（NPC 须 `rel.met` 守卫） |
| `data2_skill_ledger` | A → C | 技能复盘落真实技能 | `addSkillXp("coding", [PLACEHOLDER])`（key 真实，静默容错） |
| `data2_capital_reserve` | A → E | 资本储备腾出投资本金 | 复用私有 `_dataInvestorMindset` 标志位；`state.investment` 本金 +`[PLACEHOLDER]` |

---

## 三、验证管道

- `node --check`：finance.js / data_linkage_events.js / data_linkage_events_r22.js 均通过。
- `python build.py`：dist/index.html 重建（8290.4 KB，比源新）。
- **MC 6×400d**：`node tests/monte_carlo.cjs --trials 6 --days 400` — **[MC 结果待回填：0 代码异常 / 平衡率达标]**。

---

## 四、提交（SOP v3.0）

- 仅 `git add` 本轮文件（不含并行窗口改动）：
  - `src/js/core/finance.js`
  - `src/js/core/data_linkage_events.js`
  - `src/js/core/data_linkage_events_r22.js`
  - `src/index.html`
  - `dist/index.html`
  - `src/DEVELOPMENT.md`
  - `.claude/loop-domain-state.json`
  - `.claude/last_known_head`
- `git commit`（不 push）。
- `loop-domain-state.json`: round22 / A / nextDomain=**B**。
- 更新自动化记忆 + 当日日志。

---

## 五、下一轮

**Round 23 = 域B（事件/叙事，第二轮）**。
