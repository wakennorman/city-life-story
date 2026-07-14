# 城市浮生记·全系统优化 Round 23 — 域B（事件/叙事，第二轮）

**日期**: 2026-07-14
**分支**: `loop/auto`（仅本分支提交，不 push / 不碰 main）
**版本**: v3.114（DEVELOPMENT.md 顶部）
**轮换序**: …→ A(R22) → **B(R23, 第二轮)** → C(next)

---

## 一、A 类缺陷审查与修复（1 项，经 grep 实证）

### 修复 1 — `company_linkage_events.js:95/107` 写死字段 `player.happiness`

- **原状**:
  ```js
  // 约挚友小聚倾诉（apply）
  st.player.happiness = (st.player.happiness || 50) + 4;
  // 自己扛着（apply）
  st.player.happiness = (st.player.happiness || 50) - 1;
  ```
- **根因**: `state.player.happiness` 是**死字段**。游戏唯一读取/渲染的幸福感字段是 `state.needs.happiness`——实证：`src/app/data/events/index.ts`（TS 事件系统，全部 `target:"needs.happiness"`）、`src/app/data/legal/index.ts`、`src/js/app_bridge/webapp_runtime_bridge.js:223/466`（读 `state.needs.happiness < 40` 阈值）、`DEVELOPMENT.md` 均记为规范路径。全库 `player.happiness` 仅 3 处写入（本文件 2 处 + `cross_system_events.js` 2 处），无任何读取点 → 写 `state.player.happiness` 是静默丢失。
- **后果**: 域H 联动事件 `company_linkage_events.js`（R12「创业朋友支持」分支）的幸福感加成（+4 / -1）从不生效。
- **修复**: 两处均改为 `st.needs.happiness = (st.needs.happiness || 50) + 4 / - 1`（`st.player.mental` 在同行是正确的，保留）。

> **误报排除 / 范围说明**：`cross_system_events.js:43090/43126` 同样写 `st.player.happiness`（死字段），但 `cross_system_events.js` 是禁改主库（SOP 不碰），属既有遗留；本轮不改动，仅记录于本报告。其余 linkage 文件（R11–R22）经 grep 确认无 `player.happiness/health/hygiene`、`state.portfolio`、`state.skills.writing/design`、`state.npcRelationships`、`addSkillXp("writing"/"design")` 等错链；`relationships[` 直写均位于 `applyAffinityChange` 不可用时（typeof 守卫）的安全兜底分支（与 R11–R22 统一模式），非缺陷。

> **关键契约核实**：`events_core.js:379` 为 `RANDOM_EVENTS.filter((e) => e.phase === phase)`——**事件无 `phase` 字段则永不发火**。本报告核实：全部 linkage 文件（含 R22 `data_linkage_events_r22.js`）的每个事件均正确设 `phase:"street"/"corporate"`，无死事件。（注：R22 报告散文曾误写"无 phase 即全阶段可发火"，代码本身正确，特此更正。）

---

## 二、联动增强（新建 `src/js/core/narrative_linkage_events.js`）

- **注入方式**: 独立 IIFE 文件，向全局 `RANDOM_EVENTS` push，注册于 `src/index.html`（紧跟 `data_linkage_events_r22.js` 之后）。
- **id 前缀**: `narr_*`（与既有各域 linkage 文件不冲突）。
- **契约合规**: 每个事件显式设 `phase`（"street"/"corporate"），引擎 `e.phase===phase` 过滤可发火；权重用 `probability`；无 `onResolved` 钩子。
- **防御**: 所有数值/字段读取均 `||` 兜底；占位数值标 `[PLACEHOLDER]`。

| id                    | 桥接  | 角度                           | 关键效果                                                                                    |
| --------------------- | ----- | ------------------------------ | ------------------------------------------------------------------------------------------- |
| `narr_old_town_story` | B → D | 市井旧事（听老街坊讲城市旧事） | 取偶遇已结识 NPC，`applyAffinityChange(npcId, +5)`（rel.met 守卫铁律）+ `needs.happiness+3` |
| `narr_craft_saga`     | B → C | 匠人传记（读传记被匠心触动）   | `addSkillXp("repair", 6)`（"repair" 为真实技能键，叙事语义一致）+ `needs.happiness+2`       |
| `narr_market_whisper` | B → E | 茶馆传闻（职场阶段听行业风声） | `bankBalance+[PLACEHOLDER]` + 复用 `_dataInvestorMindset` flag（跨轮投资者心态）            |

---

## 三、验证管道

- `node --check`：company_linkage_events.js / narrative_linkage_events.js 均通过。
- `python build.py`：dist/index.html 重建（8299.2 KB，比源新）。
- **MC 6×400d**：`node tests/monte_carlo.cjs --trials 6 --days 400` — **MC_EXIT=0，0 代码异常**（grep 确认无 TypeError/ReferenceError/NaN/Infinity 行；前 7 天死亡率全 0.0% < 10% 无早期死亡崩溃回归）。各策略存活率（balanced 100% / grinder 50% / skiller 83.3% / trader 50% / social 66.7% / corporate 83.3%）与 R19–R22 一致；trader/social 的 MC 判定 ❌ 为既有 RNG 平衡阈值波动（高风险路径阈值 ≥30% 均已达标），**非本轮代码异常**。

---

## 四、提交（SOP v3.0）

- 仅 `git add` 本轮文件（不含并行窗口改动）：
  - `src/js/core/company_linkage_events.js`
  - `src/js/core/narrative_linkage_events.js`
  - `src/index.html`
  - `dist/index.html`
  - `src/DEVELOPMENT.md`
  - `.claude/loop-domain-state.json`
  - `.claude/last_known_head`
- `git commit`（不 push）。
- `loop-domain-state.json`: round23 / B / nextDomain=**C**。
- 更新自动化记忆 + 当日日志。

---

## 五、下一轮

**Round 24 = 域C（职业/成长，第二轮）**。
