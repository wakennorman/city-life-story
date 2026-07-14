# Round 20 — 域G（核心机制/生命周期）执行报告

> 自动化循环「城市浮生记·全系统8域轮换优化」· loop/auto · 2026-07-14
> 父 HEAD `465df2ba`（R19 已提交，树干净） → 本轮 `pending` 提交

## 指令一：A类缺陷审查与修复

### 扫描范围（域G 核心机制/生命周期）

经 Explore 子agent 对以下文件做 "very thorough" 扫描：
`events_core.js` / `life_ribbon.js` / `state.js` / `world_params.js` / `era_transform.js` /
`daily_pipeline.js` / `needs.js` / `interactions.js` / `phase1/critical.js` /
`phase1/corp_ops.js` / `phase2/property_market.js` / `phase2/trade_intel.js` /
`phase2/actions_extra.js`（及 lifecycle/game_state/time/init/turn/age_events/life_events 等
经核在仓库中不存在，已跳过）。

> 注：本轮是域G 第二轮（R12 已做过 events_core `stats.health→status.health`×3 / life_ribbon `illness→illnesses` / world_params `enterprise→startup` / tutorial `illness→illnesses` 的 A类修复）。本轮聚焦**核心生存机制运行期缺陷**，发现 1 项确证 A类。

### 确认 A类缺陷（1项）— `src/js/phase1/critical.js` 强制临界"延期"惩罚整套阶梯机制死代码

**现象**：游戏有"临界状态强制弹窗"（饥饿/疲劳/卫生/心情过低时阻断行动，玩家须选"立即处理"或"后续自己再去"）。设计意图是多次延期应**逐级加重**惩罚（第1次轻度→第2次中度/得病→第3次重度/饿晕送医→第4次+极端/强制住院负债）。但实测**所有升级惩罚永远不可达**，对"无限延期"零后果——核心生存玩法失效。

**根因（两处互相纠缠的真实缺陷，grep 全仓库已证）**：

1. **延期写入覆盖对象**（`critical.js` defer 回调）：玩家点"后续自己再去"时写
   `st.flags._deferred[need] = st.player.day;`（**纯数字 day**）。
   而结算函数 `applyDeferredCriticalPunishments` 期望 `_deferred[need]` 是
   `{count, lastDay}` 对象并据此递增 `count`。数字写入使每次延期都重置结构，count 无法累积。
2. **每晚清空延期标记**（`critical.js` `applyDeferredCriticalPunishments` 末尾）：
   `state.flags._deferred = {};` —— 把当天刚记录的延期标记整个清空，count 直接归零。

**失效链路**：

- 当天点延期 → `_deferred[need]=D`（数字）。
- 当日 `endDay` → `applyDeferredCriticalPunishments`：数字转 `{count:1,lastDay:D}`，
  同日守卫 `lastDay===day` 跳过（不罚），随后 `_deferred={}` 清空。
- 次日标记已空；若仍临界再次弹窗、再次写数字 D+1 → 再次被同日守卫跳过 → 再次清空。
- 结果：`_punishByNeed阶梯式(state, need, deferInfo.count)` 的 `count` 永远停在 1，
  第 2/3/4+ 次分支（得肠胃炎/饿晕街头/过劳晕倒/送医急救负债/强制住院等）**全部死代码**。

**修复**（3 处，使 count 在延期时递增、惩罚在每日结算按累计次数施加，消除清空与同日跳过的冲突）：

1. `findCriticalNeed`（同日跳过比较）：兼容 `{count,lastDay}` 对象与旧数字格式
   `var _dw=_deferred[k]; var _deferDay=(typeof _dw==="object"&&_dw)?_dw.lastDay:_dw; if(_deferDay===day)continue;`
2. **defer 回调**：累积 count —— 首次建 `{count:1,lastDay:day}`；后续 `count+1` 并更新 `lastDay`（不再覆盖为纯数字）。
3. **`applyDeferredCriticalPunishments`**：
   - 删除每晚 `_deferred={}` 清空（保留跨天持久化）；
   - 删除"同日跳过"守卫（避免再次吞掉惩罚）；
   - 新增 `lastPunishedDay===day` 防同日重复惩罚；
   - 临界已解除（`!isCriticalNeed`）即 `delete` 标记，不再留脏数据；
   - 保留旧数字格式兼容转换（老存档安全）；
   - 惩罚按 `deferInfo.count||1` 施加。
     `_punishByNeed阶梯式` 本身阶梯逻辑完好（1/2/3/4+ 分支均有真实效果 + 安全守卫：
     `addDailyTransaction` 有 `typeof` 守卫、`state.resources.bankDebt/villageDebt` 用 `||0`、
     `state.player.fame` 用 `||0`、调用 `_contractIllness`(已定义)），激活后不会崩溃。

**修复后行为**（已逐日推演）：

- 第1次延期 → 当日结算施**轻度**（健康-3 等）；
- 第2次延期 → 次日结算施**中度**（含概率得病）；
- 第3次 → **重度**（饿晕/过劳晕倒）；
- 第4次+ → **极端**（送医急救负债 / 强制住院）。
- 玩家中途真正处理该需求（eat/sleep/bath/fun 动作）或临界自然解除 → 自动清标记，不再惩罚。
- 完美贴合 `_punishByNeed阶梯式` 文档「第几次延期（1=轻度…4+=极端）」的设计意图。

**严重度**：死代码 / never-triggered（核心生存机制对无限延期零后果，无声错误，高影响）。

## 指令二：联动增强（3项）— `src/js/core/core_mechanics_linkage_events.js`（新建，IIFE→RANDOM_EVENTS）

沿用 R11–R19 已验证模式（2 street + 1 corporate，全 `||` 防御，数值 `[PLACEHOLDER]`，
引擎严格按 `e.phase` 过滤故显式设 phase；域D 桥接守 `rel.met` + `applyAffinityChange` 铁律）：

| 事件 id                 | 阶段      | 桥接         | 效果                                    |
| ----------------------- | --------- | ------------ | --------------------------------------- |
| `core_habit_foundation` | street    | G→A 习惯地基 | mental+5 · happiness+4                  |
| `core_wisdom_share`     | street    | G→D 人生体悟 | applyAffinityChange 好感+6（守域D铁律） |
| `core_exec_resilience`  | corporate | G→C 掌舵定力 | addSkillXp("management",8)              |

与 R12 `lifecycle_linkage_events.js`（life_city_anniversary/life_work_anniversary/life_estate_planning）id 不冲突。
`src/index.html` 在 `ui_linkage_events.js` 之后注册本文件。

## 验证

- `node --check` critical.js / core_mechanics_linkage_events.js：通过。
- `build.py` → dist/index.html 8272.5 KB（比 source 新，过 pre-commit 第三守卫）。
- Monte Carlo `node tests/monte_carlo.cjs --trials 6 --days 400`：**待执行（须 0 代码异常）**。
  （social 存活率 66.7%<80% 为既有平衡阈值 RNG 波动，历轮一致，非本轮引入；trader/corporate 通常 ≥80%。）

## 提交计划

- 仅 `git add` 本轮文件：`src/js/phase1/critical.js` / `src/js/core/core_mechanics_linkage_events.js` /
  `src/index.html` / `src/DEVELOPMENT.md` / `dist/index.html` / `.claude/loop-domain-state.json` /
  `.claude/last_known_head` + memory 文件。
- **不用 `-A`、不 push**（SOP）；提交前同步 `last_known_head=当前HEAD` 过 pre-commit 漂移检查。
- `DEVELOPMENT.md` → v3.111；`loop-domain-state.json` → round20/G/nextDomain=**H**。
- 下轮（Round 21）→ **域H（Phase2/公司）**。
