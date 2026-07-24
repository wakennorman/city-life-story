# 全系统自洽优化 — Round 192（域G 核心机制/生命周期）

- **日期**: 2026-07-24
- **域**: G 核心机制/生命周期（recency 180，8 域中最薄弱）
- **起始 HEAD**: `6cfccab6`（last_known_head 陈旧 `1f22991b`，提交前已同步）
- **并行窗口**: 工作区有域H在途未提交改动（main.js/events_corp.js/render.js/startup_competition.js/dist/app.js + fix-h2.cjs/fix-h3.cjs），本轮**全程不碰**，仅处理自建/自改文件。

## 指令一：A类缺陷修复（1 项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|------|----------|----------|------|
| `src/js/core/life_ribbon.js` (mortgage_slave check, ~L100) | 「房奴一生」缎带死字段——`check` 读 `p.isSelfOccupied` / `p.mortgageRemaining`；全代码库 grep 证实二者**仅此一处读取、无任何写入处** → 恒 `undefined` → `undefined && …` 恒 `false` → `props.some(...)` 永远 `false` → 玩家即便自住且背负房贷也永不获授该缎带（生命周期成就死代码） | 改读真实字段：自住房 `st.investment.selfLivePropertyId != null`（state.js:216 初始化为 null，investment.js:1299/4278 等维护）；家庭房贷 `st.family.mortgage.remainingDays > 0`（daily_pipeline.js:1165 `family_mortgage_tick` slot 每日维护）。二者皆满足才授予，语义与缎带描述「大半辈子还房贷、终于有自己的家」完全吻合。全防御（`&&`/`||`） | **A** |

**字段核实证据**（写修复前 grep 全库）：
- `isSelfOccupied` / `mortgageRemaining`：仅 life_ribbon.js:103 一处引用，零写入 → 确证死字段。
- `selfLivePropertyId`：amenities.js:413 / daily_pipeline.js:260 / investment.js(多处) / property_market.js:164 / state.js:216 均使用，为真实自住房标记。
- `state.family.mortgage.remainingDays`：daily_pipeline.js:1160-1180 `family_mortgage_tick` 递减维护；房贷数据挂在 `state.family.mortgage`（非逐房产字段，investment.js 内 grep `mortgage` 零命中）。

## 指令二：联动增强（3 项，承接 A 类修复「安家里程碑」复活价值链）

新建 `src/js/core/core_lifecycle_linkage_r192.js`（IIFE 注入 `RANDOM_EVENTS`，3 事件均 `phase:"street"`，全字段 `||`/`&&` 防御，数值 `[PLACEHOLDER]`，含 `hasSelfHome`/`mortgageDaysLeft`/`firstMetNpc` 辅助函数）。src/index.html 注册在 `domain_c_linkage_r191.js` 之后（第 634 行）。

| 新增事件 | 联动域 | 设计意图（一句话） |
|----------|--------|--------------------|
| `life_r192_housewarming` | **G→D** | 有了自住房→请首个已结识街坊来暖房→好感 `applyAffinityChange`（守 rel.met 域D铁律），把「安家」大事接入社交回响 |
| `life_r192_settled_focus` | **G→C** | 安居后心气回稳→沉心重拾看家本事→`addSkillXp` 自动挑玩家最高等级的真实技能键，体现「安居而后乐业」 |
| `life_r192_mortgage_grit` | **G→A** | 月月还贷磨出精打细算→心智+幸福感的数值成长（区别于纯金钱奖励），把还贷压力升华为个人成长 |

**联动主题一致性**：三事件与本轮 A 类修复共享同一条「自住房 / 房贷」生命主线——修复让该主线在结算时（缎带）复活，联动让它在游戏过程中（社交/职业/成长）有叙事回响，价值链闭合。三事件条件复用已核实字段 `selfLivePropertyId` / `family.mortgage.remainingDays`，低风险。

## 验证

- `node --check` life_ribbon.js + core_lifecycle_linkage_r192.js → 全通过。
- `python build.py` → dist/index.html 133.9KB + app.js 9032.0KB（`_domainGLinkageR192Loaded` 与 3 事件 id 均确认入 bundle）。
- MC `--trials 6 --days 400`：见提交记录（须 0 代码异常）。**MC 从 src/index.html 脚本序直接加载 src（headless_runner.cjs:649），本轮 src 改动在测试覆盖内。**

## 提交纪律

- 提交前同步 `.claude/last_known_head = git rev-parse HEAD`。
- 仅 `git add` 本轮文件：life_ribbon.js / core_lifecycle_linkage_r192.js / src/index.html / src/DEVELOPMENT.md / CLAUDE.md / .claude/loop-domain-state.json / .claude/last_known_head / .claude/domain-optimization-round-192.md / .workbuddy/memory/*。
- **不 stage `dist/app.js`**：它已被并行窗口（域H）的未提交 src 改动污染，staging 会把并行窗口在途工作烘进本轮提交；dist 是派生产物，待并行窗口连同其 src 一起重建提交即自愈。
- `git pull --rebase origin main` → 冲突则中止报告、绝不 force → `git push origin main`。

## 下轮

→ 域 H（Phase2/公司，recency 188）——但注意域H正被并行窗口占用，实际下轮取 recency 最小的可用域。
