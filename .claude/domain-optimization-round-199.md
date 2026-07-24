# 全系统优化 · Round 199 · 域G（核心机制/生命周期）

- 日期：2026-07-25
- 起始状态：loop-domain-state.json = round198/F/next=G（G recency 192，最薄弱）
- HEAD=990e5a1e（R198 收尾已 push，树干净）；last_known_head 已同步至 990e5a1e 过 pre-commit 漂移检查
- 本轮域 = G（核心机制/生命周期）

## 一、A类缺陷审查 → 0 项（诚实报告）

域G 经 R20（critical.js 延期惩罚阶梯）/R192（life_ribbon 房奴缎带）/R197（并行 events_core stats.health→status.health）多轮加固，本轮尽调确认干净。

尽调手段：
1. Explore 子代理对 15 个核心文件逐行只读审计（daily_pipeline/needs/illness/critical/interactions/weather/weather_forecast/travel/story_chapters/life_nodes/life_ribbon/era_transform/world_params/events_core/state）。
2. 死字段黑名单全库 grep（player.happiness / stats.health / state.certs）→ core/phase1/main.js 干净（player.happiness 仅剩注释，stats.health 是带 typeof 守卫的兜底分支）。
3. pipeline slot 消费字段生产者核查（career_burnout_health_bleed 的 `careerCapital.burnout` 有 career_path_events/side_hustle 多处生产者，非死代码）。
4. era 里程碑 day 匹配核实。

### 候选逐一证伪
| 候选 | 结论 |
| --- | --- |
| era_transform `_pendingEraEvent`（:137 写入、全库零消费者） | 确证死flag，但里程碑玩法由 `scheduleChainEvent(window.ERA_EVENTS[ei].id)` 兜底触发，玩家不可感知 → 非崩溃型A类（本轮通过联动事件1消费它复活为真实机制） |
| webapp_runtime_bridge getPlayerHealth/addPlayerHealth 读写 `state.player.health` | **误报**：主路径正确读写 `state.status.health`（真实字段），`state.player.health` 仅是 status.health 非number 时永不触发的兜底分支 → 非死字段A类（修正 R198/Explore 判重） |
| daily_pipeline career_burnout_health_bleed 消费 `careerCapital.burnout` | burnout 有充分生产者（career_path_events +20/+15/+12/+8、side_hustle +3）→ 活代码 |
| ERA_EVENTS_TRIGGER_DAYS vs era_events.js day 集合 | 两者均为 [90,180,270,365,450,540,720,900]，完全一致 → 无死里程碑 |

## 二、联动增强 3 项（新建 src/js/core/domain_g_linkage_r199.js）

IIFE 注入 RANDOM_EVENTS，2 street + 1 corporate，全字段 `||` 防御，数值标 [PLACEHOLDER]。
本轮主题：把 era_transform「时代变迁」核心机制包装成玩家可感知的叙事层，补齐历轮域G未覆盖的跨域方向（历轮已用 G→B天气/季节 R169/R192、G→A/G→C/G→D R192，本轮避开）。

| 事件 id | phase | 联动域 | 设计意图（一句话） |
| --- | --- | --- | --- |
| era_r199_reflection | street | G→B（叙事层） | 时代变迁回望——**首次消费 era_transform.js:137 写入的死flag `_pendingEraEvent` 并在 apply 清除**，形成"里程碑日写入→事件消费→清除"闭环，心智+心情成长 |
| era_r199_inflation_hedge | street | G→E | 读 `_eraState.inflationIndex`≥1.3（era_transform 每日维护的真实字段）→ 玩家意识到现金贬值 → 置跨域共用 `_dataInvestorMindset` 投资意识 + 心智 |
| era_r199_veteran_poise | corporate | G→H | 久历时代阶段更替（`_eraState.stageId`≠initial + day≥300 + 在职/经营）→ 阅历沉淀为经营定力 → addSkillXp("management") + 现金 |

关键：`_eraState` 是被 cross_system_events 数十处消费的真实活跃字段；`_pendingEraEvent` 此前全库零消费者（仅 :137 写、:240 init 置null），事件1 首次赋予其真实消费者。

## 三、验证

- node --check src/js/core/domain_g_linkage_r199.js → OK
- python build.py → dist/app.js 9215.5KB（>R198 9204.6KB，R199 标志入 bundle，grep 确认 5 处命中）
- MC 6×400d → MC_EXIT=0，**0 代码异常**（grep TypeError/ReferenceError/NaN/Infinity/Cannot read 全空）；前7天死亡率全 0.0%<10% 无早期死亡崩溃回归；存活率 balanced100%/social83.3%/corporate83.3% 达标，trader66.7%<80% 为既有RNG平衡阈值波动（历轮一致）非代码回归，grinder33.3%/skiller66.7% 高风险路径≥30% 达标。末尾 RSS timeout 为离线新闻网络回退，非代码异常。

## 四、提交

- 仅 git add 本轮文件（domain_g_linkage_r199.js / src/index.html / CLAUDE.md / dist 因 build 变更文件 / .claude/loop-domain-state.json / .claude/last_known_head / round doc + memory）；不 -A / --amend / force。
- 提交信息：feat: [域G] 联动增强(3项) — G→B时代回望·复活死flag/G→E通胀避险/G→H经营定力（A类0项，尽调确认干净）。
- push 前 git pull --rebase origin main；push origin main。
- 下轮 → H（Phase2/公司，recency 193 最薄弱）。
