# 全系统优化·循环 Round 7 — 域 B 事件/叙事

- 日期: 2026-07-12
- 分支: loop/auto @ d8030a29 → 提交 `adcfaad1`(feat) + `227a6ef8`(docs)
- 覆盖指令: 用户指定 B→D→F 优先序第 1 轮（域 B）

## 指令一 · A 类扫描结果：0 缺陷（如实报告，无伪造修复）

全量扫描三文件（按覆盖指令范围，但已适配真实架构）：

- `src/js/data/moral_events.js`（MORAL_EVENTS 声明式数组，99 事件）
  - 5 个 `condition` 函数全部守卫：phase/cash 直接访问安全；`s.trade.currentLocation` 因 state.js:156 + 修复(:722) 保证 `trade` 恒初始化，安全；`s.weather &&` 守卫；`s.employment/sideHustle/stats` 均 `&&` 守卫。
  - `immediate`/`apply` 中 relationships/reputation/weather 访问均带 `s.relationships &&` 或 `s.weather &&` 守卫。
  - 1 处 `triggers:["after_work"]` 死配置（rain 事件），但已有 `dailyChance`+`condition` 兜底触发，非崩溃，已在 v3.22 注释说明，未改动（避免行为变更）。
- `src/js/data/news.js`（NEWS_EVENTS 声明式数组，56 事件）
  - `followUpId`（metal_boom_echo 等 17 个）全部为动态生成（news_system.js:1974 `id: news.followUpId`），非静态 id，属正常设计，非 A 类。
  - `effects` 为声明式（priceMod/investmentEffect/jobPenalty/jobMultiplier），由 news_system 消费，无裸访问。
- `src/js/core/events_core.js`（RANDOM_EVENTS 引擎）
  - 引用 mental_breakdown_edge / village_chief_* 等经 `RANDOM_EVENTS.find(...)` 查找，未找到则 `if (mce && ...)` 跳过，不崩溃。

## 指令二 · 联动增强 3 项（均 `||` 防御，无未知字段崩溃）

1. `moral_elder_assist`（MORAL_EVENTS，B→D/C 桥接）
   - 帮独居老人→ `s.relationships.elderNeighbor = {met:true, affinity:+18}`（带 `if(!s.relationships)` 守卫）+ fame/happiness。
   - 配套 `MORAL_CONSEQUENCES.moral_elder_helped` 延迟后果：再 +6 affinity，置 `s.flags._elderJobLead=true`（求职/职业系统可消费）。
   - 设计意图：道德事件首次产出可被子系统消费的 NPC 关系 + 兼职线索 flag。
2. `scrap_price_surge`（NEWS_EVENTS，B→A/E 桥接）
   - `priceMod:{scrap_metal:1.6, scrap_plastic:1.4}`（goods.js 已确认有效）+ `investmentEffect:[{category:"贵金属",mul:1.12},{symbols:["COPPER","ALUM"],mul:1.1}]` + `followUpId`。
   - 设计意图：新闻联动废品回收经济定价 + 材料股投资。
3. `night_market_revival`（NEWS_EVENTS，B→C/E 桥接）
   - `jobMultiplier:1.25` + `investmentEffect:[{industry:"消费",mul:1.06}]` + `seasons:["spring","summer","autumn"]`（weather.js 已确认有效）。
   - 设计意图：新闻联动零工日结收入 + 消费股。

## 关键事实（写条件前已核 state.js / 既有代码）

- 真实架构 = 三套事件子系统，格式互不相同，覆盖指令描述的 `{id,title,desc,cond?,apply}` 与实际不符：
  - MORAL_EVENTS：`{id,title,desc,minDay,dailyChance,condition?,choices:[{text,flag,score,immediate}]}` + MORAL_CONSEQUENCES 对象（按 flag key）。
  - NEWS_EVENTS：`{id,headline,effects:{priceMod,investmentEffect,jobPenalty,jobMultiplier,duration},type,seasons?,followUpId?,followUpDelay?}`。
  - events_core.js RANDOM_EVENTS 引擎：用 `triggers`(数据对象)+`conditions`(函数)+`trigger`(函数)。
  - 三文件均经全局 bundle 注入（非 ES import），build.py 通配打包。
- `subsidy` 经 `git show c87666ce:news.js` 核实为**故意删除**（注释："与 training_subsidy 重复，保留 training_subsidy（效果更完整）"）。`training_subsidy` 当前存活。故**不还原 subsidy**（避免复活重复事件）。未来轮次勿再尝试还原。
- 32 锚定核心 id：31 存活，`subsidy` 按设计缺失，核心事件集完好。
- MC 验证：`node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` 完成，**0 异常**；完整 10×500d 因 harness 内存上限 OOM（非本代码异常）。[balanced] 存活率 66.7%<80% 为既有平衡阈值，非本轮引入。

## 下轮：域 D（NPC/社交），优先序 B→D→F 第 2 轮
