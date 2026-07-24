# 全系统优化循环 · Round 194 — 域D（NPC/社交）

> 日期: 2026-07-25 | 起始状态: loop-domain-state.json = round193/H/next=D（D recency 184 最薄弱）
> 本轮指派: **域D（NPC/社交）** | 当前 HEAD: 5b86989b（R193 已 push）

## 一、A类缺陷修复（2项，确证）

域D 子系统经多轮加固（R8/R17 及并行窗口）已较健壮，本次用精准 grep + Explore 只读扫描 12 个域D文件（npc_relationships / npc_activation_events / npc_linkage_r167 / npc_linkage_r174 / npc_location_bridge / social_network / workplace_social_events / corporate_npc_events / npc_social_linkage_r66 / phase1/npc_event_bridge / phase2/workplace_social / ui/social_tab）。确认两处确证 A类缺陷，均在已注册文件 `src/js/core/npc_linkage_r167.js`（index.html:669）中，会真实触发：

### A类1：`pickClosestNpcR167` 返回错误 NPC id（功能 bug / 静默加错好感）
- **位置**: `src/js/core/npc_linkage_r167.js:55`
- **根因**: `for (var id in st.relationships)` 遍历后，`id` 停在最后一次迭代值；函数却 `return best ? { id: id, ... }` —— 返回的是遍历尾变量，而非捕获到的最高好感 NPC `best`。调用方 `npc_social_mood_buffer` 用 `best.id` 调 `safeAffinityR167(st, best.id, 5, "低谷时的陪伴")`，导致好感 +5 加到**错误（往往未熟络）的 NPC** 身上。
- **修复**: `return best ? { id: best, affinity: bestAff } : null;`（返回捕获的 `best`）。`safeAffinityR167` 本就走 `applyAffinityChange`，修复后好感正确落到最高好感 NPC。

### A类2：`st.player.happiness` 死字段写入（数据自洽缺陷 / 静默丢失）
- **位置**: `src/js/core/npc_linkage_r167.js:237`
- **根因**: `st.player.happiness = Math.min(100, (st.player.happiness||50)+8)` 写入**死字段**（全库仅写入、无任何渲染读取；真实幸福感字段为 `st.needs.happiness`，已为 TS 事件系统 / webapp_runtime_bridge / DEVELOPMENT.md 实证）。事件承诺的「心情+8」被静默丢弃。
- **修复**: `st.needs.happiness = Math.min(100, (st.needs.happiness||50)+8);`
- **扫描附注**: 全库 `*.player.happiness =` 死写散布于 domain_b/c/e/g_linkage_*.js 及 cross_system_events.js（约40+处），但属各自域的历史遗留；按「只修本轮域D」纪律仅修 `npc_linkage_r167.js` 这一处（cross_system_events.js 为禁改主库，其余属其他域轮次范畴）。

### 已扫描但判定不改的项（避免范围蔓延/并行冲突）
- `npc_activation_events.js` / `corporate_npc_events.js` 大量「手动写 `relationships[x].affinity` 绕过 `applyAffinityChange`」——属域D铁律流程违例（不写 `_lastInteractionDay` → 衰减计时偏差），但**非崩溃**；R17 已同类放过，留后续域D轮次集中处理。
- `corporate_npc_events.js:26` `(st.skills.coding && st.skills.coding.level || 0) >= 35` 运算符优先级：经核实 `st.skills` 恒由 state.js 初始化，`|| 0` 已守卫，**非崩溃**（误报，排除）。
- `social_network.js` / `npc_location_bridge.js` / `workplace_social_events.js` / `npc_social_linkage_r66.js` / `npc_linkage_r174.js` 均已 `||` 防御、rel&&rel.met 守卫、phase 显式，无确证 A类。

## 二、联动增强（3项，新建 `src/js/core/domain_d_linkage_r194.js`）

IIFE 注入全局 `RANDOM_EVENTS`，`RANDOM_EVENTS._domainDLinkageR194Loaded` 防重。严守域D铁律：只读 `state.relationships`、守卫 `rel&&rel.met`、跨NPC好感传导走 `applyAffinityChange`；引擎按 `e.phase` 过滤故显式设 phase；数值标 `[PLACEHOLDER]`。辅助函数 `firstMetNpcD194`(遍历已结识NPC避免硬编码未激活id) / `bumpAffinityD194`(走 applyAffinityChange) / `topSkillKeyD194`(取真实最高技能键供 addSkillXp)。

| 事件 id | phase | 跨域 | 门槛 |  payoff |
|---|---|---|---|---|
| `npc_d_r194_budget_buddy` | street | D→A | 已结识NPC好感≥40 | intelligence+2, mental+3, 置 `_npcBudgetSense`(数据域可读) |
| `npc_d_r194_mentor_praise` | street | D→C | 已结识NPC好感≥50 | 最高技能 `addSkillXp(+10)`, mental+3 |
| `npc_d_r194_colleague_invest_tip` | corporate | D→E | `player.phase==="corporate"` ∧ 已结识NPC好感≥30 | 置 `_dataInvestorMindset`(复用工经域门控flag) + cash+1000 + mental+2 |

## 三、注册与文档
- `src/index.html:640` 在 `domain_h_linkage_r193.js` 之后注册 `domain_d_linkage_r194.js`。
- `src/DEVELOPMENT.md` 顶部版本行更新（域D R194 记录）。
- `CLAUDE.md` 迭代表追加 R194 行（提交后回填 commit hash）。
- `.claude/loop-domain-state.json` 更新：currentRound 193→194, currentDomain H→D, nextDomain D→E, domainRecency.D 184→194, history 尾加 R194, lastDomain/lastRound/lastDate 更新, lastCommit/PUSHED 提交后回填。
- 本文件 `.claude/domain-optimization-round-194.md`。

## 四、验证
- `node --check`：npc_linkage_r167.js / domain_d_linkage_r194.js 均通过。
- `python build.py`：重建 dist/index.html（须比 src 新，过 pre-commit 钩子）。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：目标 **0 代码异常**（TypeError/ReferenceError/NaN/Infinity 行均无）。存活率波动（grinder/trader 偏低）为既有 RNG 平衡阈值，非代码回归。

## 五、提交纪律
- 仅 `git add` 本轮文件 + `.claude/last_known_head`；绝不 `-A` / `--amend` / `--force`。
- 提交前 `git rev-parse HEAD > .claude/last_known_head`（过 pre-commit 漂移检查）。
- 并行在途 `src/js/phase2/investment.js` 已在开局 `git stash push` 隔离，构建提交后 `git stash pop` 无损还原。
- push 前 `git pull --rebase origin main`（冲突即中止不 force），然后 `git push origin main`。

## 六、下轮
- **R195 → 域E（经济/投资）**，recency 185 最薄弱。
