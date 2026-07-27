# 城市浮生记 · 全系统8域轮换优化 — Round 577（域G 核心机制/生命周期）

> 执行窗口：自动化循环（hy3）。轮次号 R577 = 域G（全8域中按文件轮号最陈旧，r540 → 本轮 r577）。
> 前序轮次：R573(域B·本窗口中断轮，已随并行提交 d139e767 落地并 push) / R574(域C) / R575(sync state) / R576(域D·并行 in-flight)。
> 代理状态：已恢复（push 成功，origin/main 同步）。

## 一、A 类缺陷修复（3 个，均确证 · 核心机制断链/数值污染类）

| # | 文件:行 | 缺陷 | 修复 | 严重度 |
|---|---------|------|------|--------|
| A1 | `src/js/core/events_core.js:1504-1509`（原顶层死块） | 事件经济影响追踪块写在 `recordEventToHistory` 函数**体外**顶层作用域，`eventId` 在此恒 `undefined` → 整块 `if(eventId && state.investment)` 永不执行，`_eventEconomicImpact` 永不被写入（经济事件影响追踪机制完全死链） | 将该块**移入** `recordEventToHistory` 函数体内（形参已含 `eventId`），使其随每次事件记录生效；新增 `// [全系统自洽修复] 域G R577` 注释 | 中 |
| A2 | `src/js/core/era_transform.js:161` `getEraEvents()` | 纪元事件列表函数定义并 `window.eraTransform.getEvents` 导出，但**全库零调用方** → 8 个里程碑事件的数值/叙事效果（`物价+5%`/`工资+3%`…）永不应用到 state，仅 `_pendingEraEvent` 被 r199 消费做叙事，纪元「经济效果」维度静默失效 | 在 `eraTick` 里程碑分支调用 `getEraEvents()`，按 `day` 匹配后将 `title`/`story`/`effect` 作为**唯一数据源**写入 `state._pendingEraEvent`（消费端 r199 不变，数据更权威） | 中 |
| A3 | `src/js/core/world_params.js:188` 与 `:365` | 5 日波动率 `var cv = stddev / mean;` 无 `mean===0` 守卫 → 异常行情源（全 0 收盘价）时 `mean=0` → `cv=Infinity`，污染 `baseVolatility`/市场情绪，下游 NaN 风险 | 改为 `var cv = mean !== 0 ? stddev / mean : 0;`（两处同步修复），注释标注 R577 | 中 |

> 死字段黑名单（player.happiness / needs.health / player.health / certs / player.hygiene）全库 grep **0 活命中**；假技能键 `addSkillXp("marketing"/"technology"/"trade"/...)` 仅命中已是 `[全系统自洽修复]` 注释的历史修复行（**0 新增活缺陷**）。域G 经 R12/R20/R296/R311/R392/R554 多轮加固，本轮 A 类仅余 3 处核心机制断链/数值污染。

## 二、跨域联动增强（3 项 · IIFE → RANDOM_EVENTS · `domain_g_linkage_r577.js`）

选题：域G 三大**写-only / 欠消费核心机制 flag** 全库首事件消费闭环（A1 复活 `_eventEconomicImpact` 后使其可消费）。全 `||` 防御、显式 `phase:"street"`、冷却 `excludeFlags`、id 全库唯一（`g577_*` grep 0 冲突）。

| 事件 id | 跨域 | 消费 flag / 机制 | 效果 |
|---------|------|------------------|------|
| `g577_fresh_look_confidence` | G→D | `_hairStyleBoost`（actions_extra.js:356 写-only 死flag）+ `_hairStyleLastDay` 新鲜期≤20天 | 街坊赞新造型 → `applyAffinityChange(npcId, +5, "新造型获赞")`（守 `rel.met` 铁律，firstMetNpcR577 取首个结识 NPC）；心情+4 |
| `g577_era_ride` | G→E | `_eraState.stageId`（growth/mature 经济扩张期） | 顺势布局 → `_dataInvestorMindset` + 现金+600 + 心智+4 |
| `g577_eventwise_acumen` | G→A | `_eventEconomicImpact`（A1 修复后 `recordEventToHistory` 实时累积，≥3 个经济相关事件键） | 经济敏锐度 → `intelligence+5` + `mental+4` + `happiness+3` |

> 刻意避开 R199 已用 G→B/G→E(通胀)/G→H，本轮选 G→D/G→E(时代顺风)/G→A 三个机制维度，全部首消费真实核心机制 flag。

## 三、验证

- `node --check`：events_core.js / era_transform.js / world_params.js / domain_g_linkage_r577.js 全过。
- `python build.py` → dist/app.js **11969.6KB**（r577 标志入 bundle count=2；全库假键数组残留 grep=0）。
- **Monte Carlo 6×400d**：`MC_EXIT=0 · 0 代码异常`（TypeError/ReferenceError/NaN/Infinity grep=0；前7天死亡率全 0.0% < 10% 无早期死亡崩溃回归）。存活率 balanced 83.3%/social 83.3%/skiller 50% ≥ 阈值；grinder 16.7%(<30% 高风险路径阈值)/trader 66.7%/corporate 66.7%(<80% 既有 RNG 平衡阈值，非代码回归)。36氪/澎湃/TianAPI RSS timeout = 离线新闻回退，非代码异常。

## 四、提交与推送

- 提交纪律：仅 `git add` 本轮文件 + dist + 文档/状态；并行 in-flight `domain_f_linkage_r580.js` 全程 `git stash` 隔离，push 后 `pop` 无损还原；绝不 `-A`/`--amend`/`--force`。
- 提交：`fix: [域G] A类缺陷修复(3个)` + `feat: [域G] 联动增强(3项)` + `chore: [R577] 账本闭环`。
- 推送前 `git pull --rebase origin main`（并行 HEAD 已演进至 fa6b9ac8，rebase 集成）；冲突则中止绝不 force。随后 `git push origin main`。
- 下轮：域H（recency 基准 r568 最陈旧，其次 E r570）→ 开轮必 `git log` 重算真实 recency。

## 五、遗留 / 待续

- `_hairStyleBoost` 衰减机制（actions_extra.js 写后无每日 tick 递减 `charm`）本轮未做 A 类衰减（避免侵入 daily_pipeline 与并行争改）；其「首消费者」已由 `g577_fresh_look_confidence` 事件闭环，写-only 死 flag 性质已消解。
- 域G 双结构分歧（phase2/personal_growth health.physical 对象 vs 数字 / psychology vs mental）仍为已知 B 类待专轮。
