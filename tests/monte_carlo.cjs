#!/usr/bin/env node
/**
 * 蒙特卡洛模拟 — 城市浮生记数值平衡测试 v3.1
 *
 * 使用 headless_runner.cjs 加载真实游戏引擎，
 * 运行 N 次 × 1000 天模拟，检测经济平衡问题。
 *
 * 用法:
 *   node tests/monte_carlo.cjs                        # 默认: 100次 × 1000天
 *   node tests/monte_carlo.cjs --trials 50            # 快速测试
 *   node tests/monte_carlo.cjs --days 500             # 500天
 *   node tests/monte_carlo.cjs --verbose              # 详细输出
 *   node tests/monte_carlo.cjs --strategy balanced    # 只跑平衡策略
 *   node tests/monte_carlo.cjs --output report.json   # 输出到文件
 *   node tests/monte_carlo.cjs --answer-events        # 代玩家作答（事件效果进入平衡）
 *
 * ⚠️ 事件层口径（重要，读平衡数据前必看）
 *   默认（不加 --answer-events）只清空 `_pendingEvent`、不执行事件效果，目的是保持
 *   经济基线纯净、便于历史对比。但副作用是：**优先通道事件**（心理危机 / 村长债务）
 *   的触发条件不会因作答而解除，于是每天重复入队，把随机事件池彻底饿死。
 *   实测（400 天，balanced）：入队 398 次里 `mental_therapy_chance` 独占 375 次（94%），
 *   唯一事件仅 17 个 → 随机池实际出镜率被压到约 1/7。
 *   因此默认口径下：
 *     · 「总事件触发」= 队列活动度，**不代表**内容触达；
 *     · 平衡结论是在「几乎无随机事件」的前提下得出的，属于乐观估计。
 *   需要真实触达时加 `--answer-events`（执行 choice[0]，与 audit-event-coverage.cjs 一致，
 *   实测 ≈0.35 次/天、唯一事件 320+），但作答会改变存活率与资产基线。
 *   做事件覆盖率请用 `scripts/audit-event-coverage.cjs`，它才是为此设计的。
 *
 * 通过条件（v3.3 策略分化）：
 *   - 普通路径(balanced/social/trader/corporate/specialist)存活率 ≥ 80%
 *   - 高风险路径(grinder过劳/skiller犯罪)存活率 ≥ 30%（设计意图：高风险高回报）
 *   - 前 30 天死亡率 < 15%
 *   - 中位现金 Day 30: ¥500~¥2000
 *   - 中位现金 Day 100: ¥2000~¥10000
 *   - 中位现金 Day 365: ¥10000~¥50000
 *   - 疾病/受伤率 < 30%
 *   - 经济分层：> 50% 玩家 Day 100 后进入温饱 (cash > ¥2000)
 *
 * [连携覆盖 · 2026-09-16] 新增 `specialist`（技能专精）策略。
 *   原 6 策略有 `mcStudySkill` 的"每 4 天一次"节流 + 短 preferList，
 *   实测 300 天下**最高技能仅 25 级**，而 DUAL 连携门槛是 30~60 → **连携系统全灭**：
 *   8 DUAL + 4 TRIPLE + 3 THEME + 5 个被动收入键 + 8 个连携解锁工作
 *   在整个夹具里从未被激活过（基线文件里每策略都打印"单局峰值均值 0.0 DUAL"可自查）。
 *   `specialist` 把 100 AP/天 大部分投入 9 门技能（每次 15 AP），
 *   峰值可达 8 DUAL / 4 TRIPLE / 3 THEME，让连携进入可测范围。
 *   ★ 新增策略**不改变**其余 6 策略的种子与代码路径，它们的数字保持逐字不变。
 *
 * [资源利用率 · 2026-09-16] 新增「AP 利用率」指标 + 策略对比表新增该列。
 *   每日 AP 预算 = `maxActionPoints`（100，由 daily_pipeline 每日重置），
 *   而 `mcWorkLoop` 上限是「4 份工 × 14 AP = 56 AP」——**用不掉的 AP 当日作废**。
 *   实测（2 局 × 60 天冒烟）7 条策略的 AP 利用率：
 *     balanced 36% / skiller 59% / corporate 58% / social 61% / trader 64%
 *     / grinder 87% / specialist 91%
 *   → **「策略 A 比策略 B 赚得多」有两种解释**：① A 效率更高；② B 在浪费资源。
 *   不量出这个比例就无法判断「拉平策略收益」该调谁（见报告第二十三节）。
 *   ★ 该指标为纯观测，不改变任何策略行为。
 *
 * [AP 去向拆分 · 2026-09-16] ★ 上面的「AP 利用率」**本身会误导**，本轮已拆成四桶：
 *   `AP 利用率 ＝ 工作 X% + 疲劳休息 Y% + 低血就诊 Z% + 其他(学习/社交等) W%`。
 *   只有「工作」那半是真产出，另三桶都是**非产出消耗**。
 *   起因：`CLS_AB=fix-fatigue-rest` 的 A/B（24 局 ×300 天）显示总利用率 **7/7 上升**，
 *   看着像「修好了」，但同一批数据里**打工份数 5 降 2 升** —— 因为休息也计入总利用率。
 *   拆开后真相是：**利用率上升来自休息，不是更多产出**。
 *   ★ 典型误读修正：round 7 曾把「grinder 利用率 85%」读成「它用满了资源」，
 *   拆开后是 **工作 45.3% + 疲劳休息 4.6% + 低血就诊 31.4%** —— grinder 的工作占比
 *   反而**低于** balanced / trader / corporate，它的"高利用率"是**濒死空转**。
 *   ★ 同时修一个口径坑：`avgWorksPerDay`（除以 `daysPerTrial`）是**全期均摊口径**，
 *   存活率一变就被摊薄，**不能用来比较两组配置**；新增 `avgWorksPerAliveDay`
 *   （总打工次数 / 总存活天数）作为比较用的存活期口径。
 *   ⚠️ `sumOf()` 返回的是**每局平均值**不是总和，拿它当分子除跨局总和会差一个局数倍。
 *   ★ 仍为纯观测，不改变任何策略行为。
 *
 * [低血分支转正 · 2026-09-16] ★★ 本轮最重要的一处修改：**改变了夹具默认行为**。
 *   `mcWorkLoop` 原有一条 `if (health < 25 && ap >= 15) { needs.fatigue -= 15 }`
 *   ——**判定看 health、改的却是 fatigue**（疑似复制粘贴漏改）→ 健康跌破 25 后
 *   夹具**永远拉不回来** → 死亡螺旋，每天空转 15~45 AP。
 *   五档对照（24 局 ×300 天）证明**存活率跨度 44 个百分点全由这一行怎么写决定**：
 *     `no-health-branch` 56.0% ← 原实现 77.4% → `fix-fatigue-rest` v1 73.8%
 *     → v2 75.6% → `fix-health-branch`（白嫖 +8）100.0%
 *   → **此前所有基于「存活率」的策略比较都不可信**。
 *   现默认改为**去诊所挂水**（对齐 `cross_system_events.js:3038`：¥300、疲劳 −30、
 *   健康 +10、不足转负债）——这是游戏里**唯一的玩家主动回血途径**。
 *   实测默认档存活率均值 **99.4%**、工作 AP **53.3%**（原 46.1%）、低血就诊 **0.9%**（原 12.3%）。
 *   ⚠️ **存活率因此不再有区分度（7/7 策略 ≈100%）** → 策略差异请改看**中位现金 /
 *   工作 AP 占比 / 打工强度**，不要再用存活率排序（见报告第二十六节）。
 *   ⚠️ 保留两个对照开关：`legacy-health-branch`（原空转，77.4%）、
 *   `fix-health-branch`（白嫖，100%）、`no-health-branch`（带病硬撑，56.0%）。
 *
 * [A/B 归因] 环境变量 `CLS_AB` 支持（逗号分隔）：
 *   no-yield / no-news / no-trigger / no-passive / fix-fatigue-rest / fix-fatigue-rest2
 *   / legacy-health-branch / fix-health-branch / no-health-branch
 *   / legacy-job-cost / legacy-startup-threshold
 *
 *   ⚠️ **第十一轮起，两个口径修复已转正为默认**：
 *     · `real-job-cost`（AP 33 / 真实疲劳·卫生字段）—— 默认**开启**；
 *       回切旧口径用 `legacy-job-cost`。
 *     · `fix-startup-threshold`（创业门槛按剧本取真实值 ¥15,000）—— 默认**开启**；
 *       回切旧口径用 `legacy-startup-threshold`。
 *   → **默认档 = "夹具记准账" 的形态**。上述两个 `legacy-*` 开关**仅供对照，
 *     产物绝不能当基线**（它们跑的是已知错误的口径）。
 *
 *   `fix-fatigue-rest` 修的是 mcWorkLoop 的**不可达休息分支**：
 *   入口守卫 `fatigue < fatigueLimit` 与循环内休息条件 `fatigue > 60` 在
 *   fatigueLimit=60 时互斥（7 条策略里 6 条用 60）→ 休息分支恒不可达，
 *   疲劳一到 60 就退出循环、当日剩余 AP 全部作废。**默认关闭**。
 *   `fix-fatigue-rest2` 是同一处的更保守修法，同样**默认关闭**
 *   （两者都会让存活率下降 1.8~3.6pt，详见报告第二十五节 E）。
 *
 * [🧪 已移除：`exp-*` 三个开关（第十八轮）] `exp-short-window` /
 *   `exp-rich-profit` / `exp-high-valuation` 原本用于**量化未采纳的设计提案**
 *   （第 4 点：`corporate` 前期纯付出期）：
 *     · exp-short-window   创业无收入空窗 6 月 → 2 月
 *     · exp-rich-profit    月利润率 0.5%~2% → 2%~5%
 *     · exp-high-valuation 估值 ¥100k~250k → ¥300k~600k
 *   第十五轮起它们篡改的 `mcStartupIncome`（"月利润 = 估值 × 利润率"）**被删除** ——
 *   因为那个模型**在游戏里根本不存在**（游戏是产品驱动的现金流，没有"月利润率"
 *   也没有"月份空窗"，见报告第二十八/二十九节）。此后三个变量声明后无人读取。
 *   第十八轮**彻底移除**（声明 + `void` 全部删掉）。
 *   → 若要改创业难度，**请直接改 `src/js/phase2/startup.js` 的数值**，
 *     夹具会自动跟随（这正是第十五轮对齐的意义）。
 *
 * [R1019 夹具对齐 · 第十五轮 · 2026-09-16] 创业夹具已从「凭空捏造」改为
 * 「驱动真实游戏函数」，详见 `mcStartupTick` / `mcRegisterStartup` 上方注释块。
 * 关键变化：
 *   · `mcStartupIncome`（估算值×利润率）→ **删除**
 *   · `mcStartupTick`（新）→ 调真 `developProduct` / `launchProduct` / `tickStartup`
 *   · `mcVisitNpcs`（新）→ 补上原本完全缺失的「NPC 好感 ≥40」社交门
 *   · `runTrial` 补调 `initNpcRelationships`（原只在 `main.js` 里调，夹具里 relationships 恒空）
 */

(function () {
  "use strict";

  var runner;
  var fs = require("fs");
  var path = require("path");

  // ============ 配置 ============
  var CONFIG = {
    trials: 100,
    daysPerTrial: 1000,
    verbose: false,
    strategy: "all",
    outputFile: "",
    seed: 42,
    // [事件口径修正] 默认不代玩家作答（保持经济基线可对比），但此时
    // 「心理危机」等优先通道事件会因条件不解除而每天重复入队，
    // 导致事件计数严重失真（实测单个 mental_therapy_chance 占 94%）。
    // 加 --answer-events 后改为执行 choice[0]，事件密度回到真实水平
    // （≈0.35 次/天）。注意：作答会改变存活率与资产基线。
    answerEvents: false,
  };

  // ============ A/B 归因开关（仅用于平衡实验，默认全关，不影响正常跑分）============
  // 用途：定位「某次修复是否 / 多大程度改变了平衡」。做法是**只关掉该修复**，
  // 其余保持不变，跑同一批种子，对比存活率与事件密度。
  //
  //   用法: CLS_AB="no-yield,no-news,no-trigger" node tests/monte_carlo.cjs ...
  //
  //   no-yield   事件槽让位闸：每天清空 state.flags._yieldEventSlotToPool
  //              → 强制通道重新独占每一天，等价于修复前（随机池投递恒为 0）
  //   no-news    P0-6 新闻价格效果：把 applyNewsPriceModsForEvent 覆盖为 no-op
  //   no-trigger 触发槽注册链：把 TriggerRegistry.triggerRandom 覆盖为恒返回 null
  //              → 等价于修复前（loadAllTriggers 早退，12 槽全空）
  //   no-passive 连携被动收入：摘掉 TRIPLE 的 4 个 passive 键（只剩 DUAL 的 50）
  //              → 等价于「补齐前」。**只有 specialist 策略测得到**，
  //              其余 6 策略 300 天最高技能仅 25 级，够不到 DUAL 门槛 30。
  //
  // 注意：这三项都是「运行时模拟」，不改源码。它们只能用于**归因**，
  // 不能用来判断「修复是否正确」——正确性由 tests/*.test.cjs 负责。
  var AB = (process.env.CLS_AB || "")
    .split(",")
    .map(function (s) {
      return s.trim();
    })
    .filter(Boolean);
  function abOn(name) {
    return AB.indexOf(name) >= 0;
  }
  var AB_NO_YIELD = abOn("no-yield");
  var AB_NO_NEWS = abOn("no-news");
  var AB_NO_TRIGGER = abOn("no-trigger");
  //   no-passive 连携被动收入：把 TRIPLE 的 4 个 passive 键从 effects 里摘掉，
  //              等价于「补齐前」状态（只剩 DUAL 的 passiveInvestmentIncome: 50）。
  //              用于量化 ¥900/天 对平衡的影响（需要 specialist 策略才测得到）。
  var AB_NO_PASSIVE = abOn("no-passive");
  var _abPassivePatched = false;
  //   fix-fatigue-rest 工作循环的休息分支可达性修复。
  //              mcWorkLoop 的入口守卫是 `needs.fatigue < fatigueLimit`，而循环内
  //              休息分支的条件是硬编码的 `needs.fatigue > 60` —— 当 fatigueLimit
  //              **等于 60**（7 条策略里 6 条如此）时两者互斥，**休息分支恒不可达**：
  //              疲劳一到 60 就直接退出循环，当日剩余 AP（通常 40~64%）全部作废。
  //              开启本开关把休息阈值改为随 fatigueLimit 缩放（fatigueLimit-10），
  //              让「累了先休息再干活」这条本意路径真正可达。
  //              默认关闭 → 既有基线的数字逐字节不变。
  //              ⚠️ 2026-09-16 实测结论：**这个 v1 修法不该转正**。24 局 ×300 天 A/B 显示
  //              总利用率 7/7 上升，但拆开 AP 去向才发现上升全在**休息**上（休息 12~15 AP/次
  //              却不产出现金），打工份数 5 降 2 升、存活率均值 77.5%→73.8%。
  //              → 它只是把"闲置 AP"换成"烧在休息上的 AP"，不是产出提升。
  //              保留该开关仅供归因对照，不要当修复用。见 v2。
  var AB_FIX_FATIGUE_REST = abOn("fix-fatigue-rest");

  //   fix-fatigue-rest2 工作循环休息分支的**正确**修法（v2）。
  //              与 v1 的区别：v1 是「疲劳 > 阈值就休息」（不管你还想不想干、会不会被卡住），
  //              于是干完活也会去休息、白烧 AP。v2 只在**真正会卡住下一次工作**时才休息：
  //                  needs.fatigue + 单份工疲劳 >= fatigueLimit  → 下一份干不了
  //                  且 worked < maxWorked（还想继续干）且 AP 够「休息 + 一份工」
  //              这才对应注释里写的本意「累了先休息再干活」。
  var AB_FIX_FATIGUE_REST2 = abOn("fix-fatigue-rest2");

  //   no-health-branch 低血分支的**极端下端点**对照：整条分支不生效（带病继续工作）。
  //              实测存活率 **56.0%**（7 策略均值，24 局 ×300 天），其中 grinder **0.0%**、
  //              corporate **12.5%** —— 而它们的工作 AP 反而全场最高（61% / 62%）：
  //              **干得最狠、死得最快**，是「没有回血手段 = 死亡螺旋」的直接证据。
  //              留作对照的价值：它给出"存活率"这个指标的下界，让人一眼看出
  //              **存活率跨度 44pt 全由低血分支怎么写决定**（56.0% ← 77.4% → 100.0%）。
  var AB_NO_HEALTH_BRANCH = abOn("no-health-branch");

  //   legacy-health-branch 低血分支的**原始实现**（2026-09-16 判定为缺陷，降级为对照）。
  //              `if (state.status.health < 25 && ap >= 15) { needs.fatigue -= 15 }`
  //              ——**判定看 health、改的却是 fatigue**（疑似复制粘贴漏改）。
  //              后果：健康 <25 时每天烧 15~45 AP，却一点血都回不了 → 死亡螺旋。
  //              实测（24 局 ×300 天）：grinder 的「AP 利用率 85%」里 **31.4% 是这条分支**
  //              （social 16.7% / corporate 21.3%）——round 7 曾把 grinder 的高利用率
  //              读成「它用满了资源」，实际是**濒死空转**。
  var AB_LEGACY_HEALTH_BRANCH = abOn("legacy-health-branch");

  //   fix-health-branch 白嫖对照档（**区间上端点**）：`health += 8`（15 AP 换 8 血，不花钱）。
  //              取值依据：游戏内自然恢复 **+3/天**（`needs.js:136`，注释写明平衡围绕它调），
  //              所以 15% 的日 AP 预算换 ~2.7 天自然恢复量是合理量级。
  //              ⚠️ 但它**不符合游戏机制**（游戏里没有任何免费回血动作），
  //              实测也让 7/7 策略存活率撞到 **100%**，因此**不是默认**，只作上端点对照。
  var AB_FIX_HEALTH_BRANCH = abOn("fix-health-branch");

  //   ★ 默认行为：**去诊所挂水**（证据版，2026-09-16 转正）。
  //              对齐游戏内真实动作 `src/js/core/cross_system_events.js:3038`
  //              「🏥 去诊所挂水」：疲劳 ≥75 触发、¥200~400 → **疲劳 −30、健康 +10**，
  //              现金不足时**转为负债**（`resources.debt += 差额`）而不是不执行。
  //              这是游戏里**唯一的玩家主动回血途径**（`data/amenities.js` 里
  //              做饭/洗澡/娱乐/健身全都不回 health），自然回血只有 +3/天。
  //              本档按该事件建模：¥300（取区间中值，避免引入额外 RNG 消耗）、
  //              疲劳 −30、健康 +10、不足转负债。
  //              ⚠️ **刻意不调 `addDailyTransaction`**：`mcWorkLoop` 在 `policyFn` 里执行，
  //              位置在 `runDailyPipeline` **之前**（见本文件日循环），即**在对账窗口之外**。
  //              给它记账会让「跟踪」含该笔、而「实际」不含 → **凭空制造对账告警**
  //              （实测 1165 → 3314 条）。这与 `mcFeed` 直接改 `resources.cash` 不记账
  //              是同一个惯例，也与第八轮「命运抉择窗口错位」是同一类错误。
  //              为什么转正它：白嫖档撞 100% 天花板、原实现是死亡螺旋，
  //              只有带成本的诊所档既符合机制、又把存活率拉回可比较区间。
  //              实测（24 局 ×300 天）：存活率均值 **99.4%**、工作 AP 46.1%→**53.3%**、
  //              低血空转 12.3%→**0.9%**。
  //              ⚠️ 遗留：真实事件的触发条件是**疲劳 ≥75**（不是健康 <25），
  //              本档改以健康为条件，是为了让夹具在"快死时"能自救；
  //              语义差异已记录，不影响本次转正（两者都指向同一个回血动作）。

  //   real-job-cost ✅ **已转正为默认**（2026-09-16 第十一轮）。
  //              下面读的是「关闭开关」的旧口径，仅供对照回切。
  //              三处与游戏 `doStreetJob`（`main.js:4489~4836`）不一致：
  //                ① **AP**：夹具按 **14 AP/份** 记账；游戏是 **33 AP**
  //                   （`main.js:2585` UI 守卫 + `main.js:4493` 函数内守卫，两处都是 33）。
  //                   → 游戏里 100 AP 只够 **3 份工/日**；夹具却允许 4 份 ×14 = 56 AP，
  //                     **其余 44 AP 当日作废** —— 这正是 round 7「6/7 策略每天扔掉
  //                     14~44 AP」的真因，**不是策略在浪费，是夹具把单价记错了**。
  //                ② **疲劳**：夹具读 `job.fatigueCost || 8`，但 `STREET_JOBS`
  //                   （`data/jobs.js`）**根本没有 `fatigueCost` 字段**（只有
  //                   `side_hustle.js` 的副业才有），真实字段是 `effects.fatigue`
  //                   （8~40，典型 10~22）→ 夹具**永远走 fallback 8**，低估了劳动强度。
  //                ③ **卫生**：夹具读 `job.hygieneCost || 5`（同样不存在），
  //                   而且**符号反了** —— 游戏里 `effects.hygiene` 是**负数**
  //                   （干活让人变脏，`main.js:4832` 原样相加），夹具却 `+5`（越干越干净）。
  //              ✅ 转正后的实测影响（24 局 ×300 天）：策略中位现金跨度
  //                 **144 倍 → 36.5 倍**（−75%）；详见报告第二十七节。
  //              🔁 **回切旧口径**：`CLS_AB=legacy-job-cost`（对照用，勿当基线）。
  //              ⚠️ 未覆盖的差距（另一类问题，留待后续）：游戏还会应用
  //              `effects.happiness / mental / fame` 与各技能 XP（`main.js:4837~4854`），
  //              夹具完全不建模 —— 那是"覆盖缺口"，不是"记错账"。
  //              ⚠️ 参数化提示：字符串名与旧名不同（`legacy-` 前缀），
  //              是为了让"旧口径"变成**显式请求**，防止误以为默认还是旧口径。
  var AB_LEGACY_JOB_COST = abOn("legacy-job-cost");
  var AB_REAL_JOB_COST = !AB_LEGACY_JOB_COST;

  //   fix-startup-threshold ✅ **已转正为默认**（2026-09-16 第十一轮）。
  //              夹具此前 `mcRegisterStartup` 要求 `cash >= 15000 + 10000 = ¥25,000`，
  //              但那 **¥10,000 是夹具自加的、游戏里不存在**：
  //                · 游戏 `src/js/phase2/startup.js:99` `classic.street.cash = 15000`
  //                  （夹具正是 `scenario: "classic"`，见本文件 `runner.createState`）；
  //                · `getStartupRegistrationCost()` 返回 `cashRequired`（经典 = ¥15,000）；
  //                · 注册守卫 `if (cash < registerCost)` —— **硬判定，无任何缓冲**。
  //              另有剧本用 ¥25,000（`small_town_grinder` / `second_gen` / `midlife_crisis`），
  //              **但夹具用的不是这些**。
  //              为什么原来没暴露：14 AP 时代 corporate 在 day 90 就有 ¥27,906，
  //              虚高门槛被轻松跨过；33 AP 下 day 90 只剩 ¥4,571，
  //              转公司被推迟到 day 257 → **才第一次咬人**。
  //              ✅ 转正后的实测影响（24 局 ×300 天，配合 real-job-cost）：
  //                 创业率 **30.4% → 69.6%**、平均转公司天数 257 → **190**，
  //                 **其余 6 条策略逐项不变**（外科手术式）。
  //              📐 **门槛按剧本取真实值**（不再留恒为 0 的缓冲常量）：
  //                 见下方 `STARTUP_CASH_THRESHOLD_BY_SCENARIO`，夹具用 classic → ¥15,000。
  //                 刻意不留 `_buffer`，避免下一个人又把它当"安全边际"加回来。
  //              📐 创业率 69.6% **不是 100%**，且**换长窗口（600 天）会到 100%** ——
  //                 这是窗口截断的产物，不是"30% 的局注定失败"。详见报告 27.11c。
  //              🔁 **回切旧口径**：`CLS_AB=legacy-startup-threshold`（对照用，勿当基线）。
  var AB_LEGACY_STARTUP_THRESHOLD = abOn("legacy-startup-threshold");
  var AB_FIX_STARTUP_THRESHOLD = !AB_LEGACY_STARTUP_THRESHOLD;

  // [第十八轮清理 · 2026-09-16] 原 `exp-*` 三个开关（exp-short-window /
  //   exp-rich-profit / exp-high-valuation）**已彻底移除**。
  //   它们第十五轮起就是死参数 —— 原先篡改的 `mcStartupIncome`（"估值×利润率"）
  //   已被删除，因为那个模型游戏里根本不存在。此后三个变量被声明、`void` 掉、
  //   无人读取，纯粹是噪声。
  //   → 若要改创业难度，**直接改 `src/js/phase2/startup.js` 的数值**，
  //     夹具会自动跟随（这正是第十五轮对齐的意义）。


  // [v2 修订 · 2026-09-16] 第一版用 `疲劳 + 单份工疲劳 >= 上限`（= 提前一份工就休息），
  // 实测**反而害了策略**（balanced 1 局 300 天存活率 0%，65 天就死；休息吃掉 41.7% 的 AP，
  // 挤掉了喂饭的 AP）。原因：原循环的入口守卫是 `疲劳 < 上限`，
  // 即「只要疲劳低于上限就允许干，不管干完会不会超」——
  // 所以休息的正确触发条件就是**门已经被关上**（`疲劳 >= 上限`），
  // 而不是「下一份工会撞线」。前者只在该停时才停，后者会白白少干一份工。
  // 单份工疲劳增量（`job.fatigueCost || 8`）因此不再需要，保留常量仅作记录。
  var MC_JOB_FATIGUE = 8;

  // [fix-startup-threshold] 创业现金门槛——**按剧本取游戏真实值**（2026-09-16 第十一轮转正）。
  //   来源：`src/js/phase2/startup.js:97~127` 的 `conditions[scenarioId][phase].cash`。
  //   ⚠️ **刻意做成"查表"而不是"常量 + 缓冲"**：
  //      旧实现是 `threshold + 10000`（夹具自加，游戏里没有），已在第十轮拆掉。
  //      这里用表，是为了让"门槛随剧本变化"这件事**在代码里可见**，
  //      并且**没有任何可再加边距的余地**（想加就得显式改表里的数字）。
  var STARTUP_CASH_THRESHOLD_BY_SCENARIO = {
    classic: 15000,
    laid_off: 15000,
    small_town_grinder: 25000,
    foreign_worker: 10000,
    second_gen: 25000,
    midlife_crisis: 25000,
    fresh_grad: 15000,
  };
  // 夹具实际使用的剧本（`runner.createState({ scenario: "classic" })`，见本文件下半部）。
  var MC_SCENARIO = "classic";

  // v3.1 新机制：各策略的性格倾向（决定命运抉择卡的 bold/safe 选择）
  var CROSSROADS_BIAS = {
    balanced: "safe",
    grinder: "bold",
    skiller: "bold",
    trader: "bold",
    social: "safe",
    corporate: "bold",
    // 技能专精：长期人力资本投资，对钱保守
    specialist: "safe",
  };

  function parseArgs() {
    var args = process.argv.slice(2);
    for (var i = 0; i < args.length; i++) {
      if (args[i] === "--trials" && i + 1 < args.length)
        CONFIG.trials = parseInt(args[++i], 10) || 100;
      else if (args[i] === "--days" && i + 1 < args.length)
        CONFIG.daysPerTrial = parseInt(args[++i], 10) || 1000;
      else if (args[i] === "--verbose") CONFIG.verbose = true;
      else if (args[i] === "--strategy" && i + 1 < args.length)
        CONFIG.strategy = args[++i];
      else if (args[i] === "--output" && i + 1 < args.length)
        CONFIG.outputFile = args[++i];
      else if (args[i] === "--seed" && i + 1 < args.length)
        CONFIG.seed = parseInt(args[++i], 10) || 42;
      else if (args[i] === "--answer-events") CONFIG.answerEvents = true;
    }
  }

  function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // ====== 策略工厂 ======

  function applyJobPay(state, job) {
    var pay = 0;
    try {
      if (job && typeof job.payCalc === "function") {
        pay = job.payCalc(state);
      }
    } catch (e) {}
    if (pay > 0) {
      state.resources.cash += pay;
      state.resources.totalEarned = (state.resources.totalEarned || 0) + pay;
      // v3.1 第39轮：工作获得街坊声望
      if (
        typeof gainReputation === "function" &&
        state.trade &&
        state.trade.currentLocation
      ) {
        gainReputation(state, state.trade.currentLocation, 1, "工作(MC)");
      }
      // [real-job-cost] 真实字段是 `job.effects.fatigue`（8~40），
      // 而 `job.fatigueCost` 在 STREET_JOBS 里根本不存在 → 原实现永远走 fallback 8。
      var _fatigueCost = AB_REAL_JOB_COST
        ? (job.effects && job.effects.fatigue) || 8
        : job.fatigueCost || 8;
      state.needs.fatigue = Math.min(
        100,
        (state.needs.fatigue || 0) + _fatigueCost,
      );
      // [real-job-cost] 同上：真实字段是 `job.effects.hygiene`，且**是负数**
      //（干活让人变脏）。原实现读不存在的 `job.hygieneCost || 5` 且符号反了。
      var _hygieneCost = AB_REAL_JOB_COST
        ? (job.effects && job.effects.hygiene) || 0
        : job.hygieneCost || 5;
      state.needs.hygiene = Math.max(
        0,
        Math.min(100, (state.needs.hygiene || 0) + _hygieneCost),
      );
      if (job.risk) {
        var riskMod = Random.chance(0.3) ? 0.8 : 1.0;
        if (
          job.risk.injury &&
          Random.chance(Math.min(1, job.risk.injury * riskMod))
        ) {
          state.status.health = Math.max(0, (state.status.health || 70) - 15);
          state.status.injured = true;
          state._mcInjuries = (state._mcInjuries || 0) + 1;
        }
        if (
          job.risk.illness &&
          Random.chance(Math.min(1, (job.risk.illness || 0) * riskMod))
        ) {
          state.status.health = Math.max(0, (state.status.health || 70) - 10);
          state.status.sick = true;
          state._mcIllnesses = (state._mcIllnesses || 0) + 1;
        }
      }
    } else {
      state.resources.cash += 15 + Math.floor(Math.random() * 20);
      state.needs.fatigue = Math.min(100, (state.needs.fatigue || 0) + 8);
    }
  }

  function findJobAtLocation(state, location) {
    if (
      typeof STREET_JOBS === "undefined" ||
      typeof checkJobRequirements === "undefined"
    )
      return null;
    var avail = [];
    for (var ji = 0; ji < STREET_JOBS.length; ji++) {
      var jj = STREET_JOBS[ji];
      if (!jj.location || jj.location === location) {
        try {
          if (typeof checkJobRequirements(jj, state) !== "string") {
            avail.push({
              job: jj,
              pay: typeof jj.payCalc === "function" ? jj.payCalc(state) : 0,
            });
          }
        } catch (e) {}
      }
    }
    if (avail.length === 0) return null;
    avail.sort(function (a, b) {
      return b.pay - a.pay;
    });
    return avail[0].job;
  }

  // ============ 策略辅助函数（v3.3 策略分化） ============

  /**
   * 疾病治疗（所有策略共用）
   * v3.3: 仅健康<30且现金>¥500时治疗，轻症依赖pipeline的+3/天自然恢复
   */
  function mcTreatIllness(state) {
    if (!state.status.illnesses || state.status.illnesses.length === 0) return;
    if (state.status.health > 30) return;
    if (state.resources.cash < 500) return;
    var ILL = typeof ILLNESSES !== "undefined" ? ILLNESSES : null;
    if (!ILL) return;
    var worst = null,
      worstSev = 0;
    for (var i = 0; i < state.status.illnesses.length; i++) {
      var inst = state.status.illnesses[i];
      var ill = ILL[inst.id];
      if (!ill || !ill.treatCost) continue;
      var sev =
        ill.severity === "critical"
          ? 4
          : ill.severity === "severe"
            ? 3
            : ill.severity === "moderate"
              ? 2
              : 1;
      if (sev > worstSev) {
        worstSev = sev;
        worst = { inst: inst, ill: ill };
      }
    }
    if (!worst) return;
    var tier = null,
      cost = 0;
    if (worst.ill.treatCost.pharmacy > 0) {
      tier = "pharmacy";
      cost = worst.ill.treatCost.pharmacy;
    }
    if (
      worstSev >= 3 &&
      worst.ill.treatCost.hospital > 0 &&
      state.resources.cash > worst.ill.treatCost.hospital + 200
    ) {
      tier = "hospital";
      cost = worst.ill.treatCost.hospital;
    }
    if (!tier || state.resources.cash < cost + 200) return;
    state.resources.cash -= cost;
    state._mcMedicalSpent = (state._mcMedicalSpent || 0) + cost;
    if (tier === "hospital") {
      for (var j = 0; j < state.status.illnesses.length; j++) {
        if (state.status.illnesses[j].id === worst.inst.id) {
          state.status.illnesses.splice(j, 1);
          break;
        }
      }
    } else {
      worst.inst.treated = true;
    }
  }

  /** 通用吃饭：低饱即吃 */
  function mcFeed(state, threshold, recover, cost) {
    var ap = state.player.actionPoints;
    if (
      state.needs.hunger < threshold &&
      state.resources.cash >= cost &&
      ap >= 10
    ) {
      state.resources.cash = Math.max(0, state.resources.cash - cost);
      state.needs.hunger = Math.min(100, state.needs.hunger + recover);
      state.needs.happiness = Math.min(100, state.needs.happiness + 3);
      state.player.actionPoints = ap - 10;
      return true;
    }
    return false;
  }

  /** 通用住房升级 */
  function mcUpgradeHousing(state) {
    var ht = state.housing ? state.housing.tier : 0;
    var day = state.player.day;
    var cash = state.resources.cash;
    // [cost, dayMin, minReserve]
    var tbl = [
      {},
      { c: 300, d: 3, r: 300 },
      { c: 500, d: 15, r: 500 },
      { c: 1000, d: 45, r: 800 },
      { c: 6000, d: 120, r: 2000 },
      { c: 20000, d: 250, r: 5000 },
    ];
    var up = tbl[ht + 1];
    if (up && day >= up.d && cash >= up.c + up.r) {
      state.resources.cash -= up.c;
      state.housing.tier = ht + 1;
      state.housing.rentedDay = day;
      state._mcHousingUpgrades = (state._mcHousingUpgrades || 0) + 1;
    }
  }

  /** 通用工作循环（含工作前疲劳检查） */
  // [reserveAp · 2026-09-16 第十一轮] 可选第 5 参数：**"给我留 N AP 做别的事"**。
  //
  // 为什么需要它：`mcWorkLoop` 是**贪心循环**（`while (ap >= 单价 && ...)`），
  // 只要 AP 够就一直干。所以"半工半读"里的"留 AP 给学习"**只能靠显式喊停**表达。
  // 此前 `specialist` 是靠 `maxWorked=2`（每天最多 2 份工）间接表达的，
  // 但那个参数在真实单价下有**断崖**：
  //     2 份 → 花 66 AP，剩 34 AP 够学 2 轮 → 技能线活（70 级 / 4 TRIPLE / ¥99,155）
  //     3 份 → 花 99 AP，剩  1 AP 学不了   → 技能线断（65 级 / 1 TRIPLE / ¥35,294）
  // **2↔3 之间 2.8 倍跳变**，而传 3 与传 4 逐项相同（AP 本身才是上限）。
  // 一个"多打一份工就崩"的参数是脆的：单价一改（14→33）、疲劳一调、
  // 门槛一变，悬崖位置就漂移，而代码里完全看不出来。
  //
  // `reserveAp` 把意图**直接说出来**："给学习留 34 AP"。
  // 剩下的让它自己算能打几份 —— 单价变了、疲劳变了都不会失稳。
  // 也不再用 `maxWorked` 传信号（`maxWorked` 保留为**硬上限**语义，防呆用）。
  //
  // ⚠️ 与 `maxWorked` 的语义区分：
  //   · `maxWorked`  = "**最多**干几份"（上限，防御性）
  //   · `reserveAp`  = "**至少**留多少 AP"（保留，表达意图）
  //   两者同时给时会**共同约束**（哪个先到就停哪个）。
  //   `null`/`undefined` = 不保留（退化为原行为）。
  function mcWorkLoop(state, loc, maxWorked, fatigueLimit, reserveAp) {
    var ap = state.player.actionPoints;
    var needs = state.needs;
    var reserve = typeof reserveAp === "number" ? reserveAp : 0;
    // [A/B · CLS_AB=fix-fatigue-rest] 见顶部开关说明。
    // 默认路径（restAt=60 + 入口守卫 `fatigue < fatigueLimit`）与原实现逐字一致；
    // 开启后 restAt 随 fatigueLimit 缩放，且入口守卫额外放行「需要休息」的情形，
    // 使循环内那条原本不可达的休息分支真正生效。
    var restAt = AB_FIX_FATIGUE_REST ? fatigueLimit - 10 : 60;
    // [AP 去向拆分 · 2026-09-16] 原来的「AP 利用率」把**非产出 AP**也算成「用满资源」，
    // 于是会出现「利用率上升但打工变少」的误读。这里精确记录每笔 AP 的去向：
    //   work        工作 14 AP/份（有产出）—— ⚠️ 单价已改为随 `AB_REAL_JOB_COST` 自适应
    //               （14 或 **33**，见 `_jobAp`），此处保留 14 是历史描述。
    //   restFatigue 疲劳休息 12 AP/次（只降疲劳）
    //   restHealth  低血就诊 15 AP/次（只回血）
    // ★ 一开始只分了「工作 / 休息」两桶，结果 41% 的"休息"里其实大半是**回血** ——
    //   把「濒死策略被迫回血」误读成「策略在休息」。桶太粗 = 结论错，所以拆到三桶。
    // 这三条分支本来就在函数里（不是新增行为），只是原来没人分开数。
    function spend(n, kind) {
      ap -= n;
      if (kind === "work") state._mcApWork = (state._mcApWork || 0) + n;
      else if (kind === "restHealth")
        state._mcApHealth = (state._mcApHealth || 0) + n;
      else state._mcApRest = (state._mcApRest || 0) + n;
    }
    // 工作前先检查疲劳（原版social金色路径：fatigue>70先休息）
    if (needs.fatigue > 70 && ap >= 15) {
      needs.fatigue = Math.max(0, needs.fatigue - 25);
      spend(15, "restFatigue");
    }
    var worked = 0;
    // [real-job-cost] 单份工的 AP 单价：夹具历史值 14，游戏 `doStreetJob` 实际是 **33**
    // （`main.js:2585` UI 守卫 + `main.js:4493` 函数内守卫）。
    // 注意：改成 33 后，`maxWorked`（4/5）不再起约束作用 —— **AP 本身成为唯一上限**
    // （100 / 33 = 3 份/日），这与游戏一致（游戏里也没有每日打工次数上限）。
    var _jobAp = AB_REAL_JOB_COST ? 33 : 14;
    // [v2 · 2026-09-16] 把「该不该休息」和「能不能进循环」拆成两个判定，方便三档对照：
    //   默认  ：gate=`疲劳 < 上限`，rest=`疲劳 > 60`      → 原实现，休息分支不可达
    //   v1    ：gate 额外放行，rest=`疲劳 > 上限-10`       → 可达，但"干完活也休息"、白烧 AP
    //   v2    ：gate 恒开，rest=`疲劳 + 单份工疲劳 >= 上限` → 只在**真会卡住下一份工**时休息
    // 注意：默认档下两个函数与改写前的字面条件逐字等价，故默认路径行为不变（已验证 diff=0）。
    function shouldRest() {
      // v2：只在**门被关上**（疲劳已达上限、下一份工干不了）时才休息。
      // 不要写成 `疲劳 + 8 >= 上限` —— 那会提前一份工就休息，实测反而害了策略。
      if (AB_FIX_FATIGUE_REST2) return needs.fatigue >= fatigueLimit;
      return needs.fatigue > restAt;
    }
    function gateOpen() {
      if (AB_FIX_FATIGUE_REST2) return true; // v2 由 shouldRest 决定何时停，不再靠疲劳卡门
      if (AB_FIX_FATIGUE_REST)
        return needs.fatigue < fatigueLimit || needs.fatigue > restAt;
      return needs.fatigue < fatigueLimit;
    }
    // [reserveAp] 循环多一个"保留"守卫：干完这一份后剩余 AP 不得低于 reserve。
    //   等价于 `ap - _jobAp >= reserve`，即"这一份必须用保留额度之外的 AP 来付"。
    //   reserve=0 时退化为 `ap >= _jobAp`，与原实现逐字等价（默认路径不受影响）。
    while (
      ap - _jobAp >= reserve &&
      worked < maxWorked &&
      gateOpen()
    ) {
      if (shouldRest() && ap >= 12) {
        needs.fatigue = Math.max(0, needs.fatigue - 25);
        spend(12, "restFatigue");
        continue;
      }
      if (state.status.health < 25 && ap >= 15 && !AB_NO_HEALTH_BRANCH) {
        // [低血分支 · 2026-09-16 转正] 原实现判定 health、却只减 fatigue（疑似复制粘贴漏改）→
        // 健康 <25 时每天空转 15~45 AP 却回不了血 → 死亡螺旋。
        // 三档（CLS_AB 可切换，默认 = 诊所）：
        //   legacy-health-branch → 原空转行为（对照，存活率 77.4%）
        //   fix-health-branch    → 白嫖 +8（对照上端点，存活率 100%）
        //   默认（无开关）        → 去诊所挂水：¥300（不足转负债），疲劳 −30、健康 +10
        //                          （对齐 cross_system_events.js:3038）
        if (AB_LEGACY_HEALTH_BRANCH) {
          needs.fatigue = Math.max(0, needs.fatigue - 15);
        } else if (AB_FIX_HEALTH_BRANCH) {
          state.status.health = Math.min(100, state.status.health + 8);
        } else {
          var _clinicCost = 300;
          var _clinicPaid = Math.min(_clinicCost, state.resources.cash || 0);
          state.resources.cash = (state.resources.cash || 0) - _clinicPaid;
          if (_clinicPaid < _clinicCost) {
            state.resources.debt =
              (state.resources.debt || 0) + (_clinicCost - _clinicPaid);
          }
          needs.fatigue = Math.max(0, needs.fatigue - 30);
          state.status.health = Math.min(
            100,
            (state.status.health || 0) + 10,
          );
          // 刻意不记账：本动作在 runDailyPipeline 之前执行，位于对账窗口之外，
          // 记账会凭空制造告警（详见本文件开关声明处注释）。
        }
        spend(15, "restHealth");
        continue;
      }
      applyJobPay(state, findJobAtLocation(state, loc));
      state._mcWorks = (state._mcWorks || 0) + 1;
      spend(_jobAp, "work");
      worked++;
    }
    state.player.actionPoints = ap;
  }

  /**
   * 技能学习（每4天一次）
   * v3.3: 每次+100 XP = 1级（模拟真实游戏中工作/事件/学习多渠道XP获取的累积效果）
   * 真实游戏中技能升级更快（工作给XP、事件给XP），MC仅模拟学习单一渠道，故加速
   */
  function mcStudySkill(state, preferList) {
    var ap = state.player.actionPoints;
    var day = state.player.day;
    if (day <= 10 || day % 4 !== 0 || !state.skills || ap < 18) return false;
    if (state.needs.fatigue > 50) return false;
    var skids = Object.keys(state.skills);
    // 在偏好列表中选等级最低的（平衡提升多个技能，满足创业"2技能≥12"门槛）
    var cs = null,
      csLvl = 999;
    for (var i = 0; i < skids.length; i++) {
      for (var j = 0; j < preferList.length; j++) {
        if (skids[i] === preferList[j]) {
          var lvl = state.skills[skids[i]].level || 0;
          if (lvl < csLvl) {
            cs = skids[i];
            csLvl = lvl;
          }
          break;
        }
      }
    }
    if (!cs) cs = skids[0];
    if (state.skills[cs].level < 60) {
      // 每次直接+1级（100 XP），模拟多渠道XP累积
      state.skills[cs].level = Math.min(100, state.skills[cs].level + 1);
      state.skills[cs].xp = 0;
      state.player.actionPoints = ap - 15;
      state.needs.fatigue = Math.min(100, state.needs.fatigue + 3);
      state._mcSkillUps = (state._mcSkillUps || 0) + 1;
      return true;
    }
    return false;
  }

  /**
   * 技能专精策略专用：不受 mcStudySkill 的"每 4 天一次"节流，只要 AP 够就 +1 级。
   *
   * [为什么需要它] 原 mcStudySkill 有 `day % 4 !== 0` 闸门 + 只在短 preferList 里
   * 挑最低项，实测 **300 天下全策略最高技能仅 25 级** —— 而 DUAL 连携门槛是 30~60、
   * TRIPLE 是 40~70。结果是**整个连携系统（8 DUAL + 4 TRIPLE + 3 THEME + 被动收入 +
   * 8 个连携解锁工作）在 MC 里从未被激活过**，任何连携相关改动都测不出来。
   * 本函数让夹具能真正触达这些阈值。
   *
   * @param {object} state
   * @param {string[]} preferList - 专精目标技能（按需扩到 50~70）
   * @param {number} cap - 该技能上限（TRIPLE 最高门槛 70）
   */
  function mcStudySkillBurst(state, preferList, cap) {
    var ap = state.player.actionPoints;
    if (!state.skills || ap < 15) return false;
    cap = cap || 70;
    var skids = Object.keys(state.skills);
    var cs = null,
      csLvl = 999;
    for (var i = 0; i < skids.length; i++) {
      for (var j = 0; j < preferList.length; j++) {
        if (skids[i] === preferList[j]) {
          var lvl = state.skills[skids[i]].level || 0;
          if (lvl < csLvl) {
            cs = skids[i];
            csLvl = lvl;
          }
          break;
        }
      }
    }
    if (!cs) return false;
    if (csLvl >= cap) return false; // 目标技能已全部达标 → 停止
    state.skills[cs].level = Math.min(100, csLvl + 1);
    state.skills[cs].xp = 0;
    state.player.actionPoints = ap - 15;
    state.needs.fatigue = Math.min(100, state.needs.fatigue + 2);
    state._mcSkillUps = (state._mcSkillUps || 0) + 1;
    return true;
  }

  /** 犯罪执行（skiller策略专属） */
  function mcAttemptCrime(state, actionId) {
    if (typeof state.flags._mcMorality !== "number")
      state.flags._mcMorality = 50;
    var CRIMES = {
      steal_battery: {
        loc: "slum",
        reward: [150, 300],
        catchRate: 0.35,
        morality: 15,
        fine: 500,
        healthDmg: 5,
        name: "偷电瓶",
      },
      pickpocket: {
        loc: "commercialDist",
        reward: [80, 200],
        catchRate: 0.3,
        morality: 12,
        fine: 300,
        healthDmg: 3,
        name: "扒窃",
      },
      blackmarket: {
        loc: "wholesaleMarket",
        reward: [300, 600],
        catchRate: 0.4,
        morality: 20,
        fine: 1000,
        healthDmg: 8,
        name: "黑市倒卖",
      },
      shop_theft: {
        loc: "commercialDist",
        reward: [200, 500],
        catchRate: 0.4,
        morality: 18,
        fine: 800,
        healthDmg: 6,
        name: "盗窃店铺",
      },
      scam: {
        loc: "commercialDist",
        reward: [100, 300],
        catchRate: 0.45,
        morality: 15,
        fine: 500,
        healthDmg: 4,
        name: "碰瓷",
      },
    };
    var crime = CRIMES[actionId];
    if (!crime) return false;
    state._mcCrimeAttempts = (state._mcCrimeAttempts || 0) + 1;
    // 地点风险修正
    var locKey = state.trade.currentLocation || "slum";
    var locMul = 1.0;
    if (locKey === "bank" || locKey === "government") locMul = 1.3;
    if (locKey === "slum") locMul = 0.9;
    var effCatch = Math.min(0.95, crime.catchRate * locMul);
    if (Random.chance(effCatch)) {
      // 被抓
      state.resources.cash = Math.max(0, state.resources.cash - crime.fine);
      state.flags._mcMorality = Math.max(0, state.flags._mcMorality - 5);
      state._mcCrimeCaught = (state._mcCrimeCaught || 0) + 1;
      state.status.health = Math.max(0, state.status.health - crime.healthDmg);
      state.needs.happiness = Math.max(0, state.needs.happiness - 10);
      return false;
    } else {
      var reward =
        crime.reward[0] +
        Math.floor(Math.random() * (crime.reward[1] - crime.reward[0]));
      state.resources.cash += reward;
      state.resources.totalEarned = (state.resources.totalEarned || 0) + reward;
      state.flags._mcMorality = Math.max(
        0,
        state.flags._mcMorality - crime.morality,
      );
      state._mcCrimeSuccess = (state._mcCrimeSuccess || 0) + 1;
      state.needs.happiness = Math.min(100, state.needs.happiness + 3);
      return true;
    }
  }

  /** 房产购买（trader策略专属） */
  var MC_PROPERTIES = [
    { id: "room_rent", price: 1500, rent: 250, dayMin: 15 },
    { id: "studio_small", price: 4000, rent: 500, dayMin: 70 },
    { id: "apt_one_bed", price: 10000, rent: 900, dayMin: 180 },
  ];
  function mcBuyProperty(state) {
    var day = state.player.day;
    for (var i = 0; i < MC_PROPERTIES.length; i++) {
      var p = MC_PROPERTIES[i];
      // 是否已拥有
      var owned =
        state.investments && state.investments.properties
          ? state.investments.properties.some(function (pr) {
              return pr.id === p.id;
            })
          : false;
      if (owned) continue;
      if (day >= p.dayMin && state.resources.cash >= p.price + 3000) {
        state.resources.cash -= p.price;
        if (!state.investments) state.investments = {};
        if (!state.investments.properties) state.investments.properties = [];
        state.investments.properties.push({
          id: p.id,
          buyPrice: p.price,
          currentPrice: p.price,
          rent: p.rent,
          selfLive: false,
          boughtDay: day,
        });
        state._mcPropertyCount = (state._mcPropertyCount || 0) + 1;
        return true;
      }
    }
    return false;
  }

  /** 月度房租收入（trader策略，在runDailyPipeline月结算之外MC主动模拟） */
  function mcCollectRent(state) {
    var props = state.investments && state.investments.properties;
    if (!props || props.length === 0) return;
    var day = state.player.day;
    if (day % 30 !== 0) return;
    var totalRent = 0;
    for (var i = 0; i < props.length; i++) {
      if (!props[i].selfLive) totalRent += props[i].rent;
    }
    if (totalRent > 0) {
      state.resources.cash += totalRent;
      state._mcTotalRentEarned = (state._mcTotalRentEarned || 0) + totalRent;
    }
  }

  // ==========================================================================
  // [R1019 夹具对齐 · 2026-09-16 第十五轮] 创业夹具从「凭空捏造」改为「驱动真实游戏」
  // ==========================================================================
  // 背景（详见 `docs/完善评估报告-2026-09-15.md` 第二十八、二十九节）：
  //   旧实现的 `mcStartupIncome` 假设「月利润 = 估值 × (0.5%~2%)，前 6 月无收入」——
  //   **游戏里根本不存在这两个旋钮**：`src/js/phase2/startup.js` 的真实收入是
  //     「产品驱动」的完整现金流（`tickStartup` 每日结算：产品收入 − 支出 − 破产）。
  //   后果：跑分长期反映一个**不存在的游戏**（创业 = 躺着涨的估值游戏，
  //   而真实游戏是「必须做出产品、且做出来也可能亏」）。
  //
  // 新实现原则：**能调真函数就调真函数**，夹具只负责「玩家决策 + AP 记账」。
  //   · 注册     → `registerStartup()`（真）
  //   · 建/开发/上线 → `createProduct()` / `developProduct()` / `launchProduct()`（真）
  //   · 每日结算 → `tickStartup(state, "daily")`（真：产品收入/租金/研发/破产全在里面）
  //   这样**游戏侧任何数值改动都会自动反映到跑分**，不再需要手工同步夹具。
  //
  // 三条与真实游戏的差异（刻意保留，已在报告中标注）：
  //   ⚠️ 1. **不调用 `bankrupt()`**：真实引擎里 `tickStartup` 破产会把公司清算、
  //        玩家声誉/心理扣分。夹具只标记 `state._mcStartupBankrupt` 并停止注资，
  //        避免"跑分中途被清算"污染其他指标的统计口径。
  //   ⚠️ 2. **无员工、不融资**：夹具不做 `hireEmployee` / 融资轮，
  //        代表"单人自力更生"的最小创业路径（也是玩家的默认起点）。
  //   ⚠️ 3. **AP 用占位值**：夹具不精确建模"每天花几个 AP 开发"，
  //        而是按「每日推进 1 次开发」的节奏推进进度——与真实玩家的
  //        高频低强度打法一致（见报告 29.2：effort=1 单位性价比最优）。
  // ==========================================================================

  /**
   * [R1019 夹具对齐 第十五轮] 社交拜访 —— 建模「为了让创业门槛过线而去社交」的玩家
   *
   * 动机：真实 `registerStartup` 有三道门，夹具原来只建模了「技能 + 现金 + Day」，
   *   **完全没建模「至少 2 位 NPC 好感 ≥ 40」**（`startup.js:313~319`）。
   *   实测：corporate 策略跑 300 天，`state.relationships` 的**已结识条目数始终为 0**
   *   → 注册率 **0.0%**。这道门在真实游戏里靠「拜访」（`social_tab.js:423~462`，
   *   好感 +3~5、**每个 NPC 7 天冷却**）爬升，从初始 0~6 爬到 40 需 ~8~13 次拜访
   *   ⇒ 单个 NPC 就要 56~91 天。**所以必须从早期就开始社交，否则 day 60 时必然不够。**
   *
   * 建模口径（与真实 UI 动作同构）：
   *   · 每次拜访 `applyAffinityChange(state, npcId, +3~5, "拜访")`（真实函数）
   *   · 尊重 **7 天冷却**（写 `rel._lastVisit`，与 `social_tab.js:445` 同字段）
   *   · **AP 成本按 0 计**：真实拜访是 UI 点击、不耗 AP（`social_tab.js` 里无 AP 扣减）。
   *     但它占玩家注意力 —— 夹具用「每次最多拜访 N 人」近似，避免一天刷满全场。
   *   · 只拜访「还没到 40」的 NPC，达线即停（模拟玩家的目标导向行为）。
   *
   * @param {object} state
   * @param {number} maxTargets 本次最多拜访几个 NPC（注意力上限）
   * @returns {number} 本次实际拜访次数
   */
  function mcVisitNpcs(state, maxTargets) {
    if (!state.relationships) return 0;
    if (typeof applyAffinityChange !== "function") return 0;
    var day = state.player.day;
    var visited = 0;
    var ids = Object.keys(state.relationships);
    for (var i = 0; i < ids.length && visited < maxTargets; i++) {
      var id = ids[i];
      var rel = state.relationships[id];
      if (!rel) continue;
      // 只拜访还没达线的（达线即停 = 目标导向）
      if ((rel.affinity || 0) >= 40) continue;
      // 7 天冷却（与 social_tab.js:445 同字段、同阈值）
      if (rel._lastVisit && day - rel._lastVisit < 7) continue;
      var gain = Random.chance(0.5) ? 3 : 5;
      try {
        applyAffinityChange(state, id, gain, "拜访");
      } catch (e) {
        continue;
      }
      rel = state.relationships[id];
      if (rel) rel._lastVisit = day;
      visited++;
      state._mcNpcVisits = (state._mcNpcVisits || 0) + 1;
    }
    return visited;
  }

  /** 统计当前「好感 ≥ 40」的 NPC 数（与 startup.js:313~319 同口径） */
  function mcCountHighAffinityNpcs(state) {
    var n = 0;
    var rels = state.relationships || {};
    for (var id in rels) {
      if (rels[id] && (rels[id].affinity || 0) >= 40) n++;
    }
    return n;
  }

  /** 创业注册（corporate策略专属）—— 调用真实 `registerStartup` */
  function mcRegisterStartup(state) {
    if (state._mcStartup) return false; // 已注册
    if (state._mcStartupBankrupt) return false; // 已破产过，不再尝试
    var day = state.player.day;
    if (day < 60) return false;
    if (typeof registerStartup !== "function") return false;

    // 前置条件**不再由夹具自行判断** —— 直接交给真实 `registerStartup`，
    // 它的返回体 `{success, message}` 就是权威裁决（含技能/NPC/现金/Day 全部校验）。
    // 这样夹具不会与游戏校验规则漂移。
    var res = null;
    try {
      res = registerStartup(state, "MC创业公司", "tech", "");
    } catch (e) {
      return false;
    }
    if (!res || !res.success) return false;

    var company = state.startup && state.startup.company;
    if (!company) return false;

    // [第十五轮修正] **不要**再调 `createProduct` —— `registerStartup` 内部
    //   已经自动创建了一个初始 MVP 产品（`startup.js:690~705`，status="developing"）。
    //   原先这里额外调一次，导致公司有 **2 个产品**，而 `mcStartupTick` 只推进
    //   `products[0]` → 第二个永远卡在 developing，白白烧 `DAILY_RD × 1` 的日费，
    //   还让上线时间翻倍。实测（MC_DEBUG_STARTUP 注入）nprod=2、日支出 ¥203、
    //   注册后 17 天就破产 —— 全部源于这个重复建产品。
    //
    //   若 createProduct 未被 registerStartup 调用（未来版本改动），这里兜底建一个。
    if (!Array.isArray(company.products) || company.products.length === 0) {
      try {
        createProduct(state, "MC产品", "app");
      } catch (e) {
        /* 产品创建失败：仍标记已创业，后续 tick 会因无产品而持续烧钱 —— 真实后果 */
      }
    }

    state._mcStartup = {
      foundedDay: day,
      company: company,
      industry: "tech",
      // 兼容旧字段（报告/统计脚本里读的 valuation、phase）
      valuation: company.valuation,
      phase: "seed",
      bankrolled: state.resources.cash, // 记录注资额用于统计
    };
    // [第十五轮] 持久字段：破产清空 `_mcStartup` 后仍能统计「是否创业过」
    state._mcStartupFoundedDay = day;
    state.player.phase = "corporate";
    return true;
  }

  /**
   * 创业每日推进（corporate策略）—— 驱动真实 `developProduct` + `tickStartup`
   *
   * @param {object} state
   * @param {number} effort 本次开发力度（1~3），默认 1（单位性价比最优，见报告 29.2）
   */
  function mcStartupTick(state, effort) {
    if (!state._mcStartup) return;
    if (state._mcStartupBankrupt) return;
    var startup = state.startup;
    var company = startup && startup.company;
    if (!company) {
      // 公司已被真实引擎清算（bankrupt 路径）
      state._mcStartupBankrupt = true;
      state._mcStartupBankruptDay = state.player.day;
      return;
    }
    effort = effort || 1;

    // 1. 玩家决策：若有产品在开发中，推进一步
    if (Array.isArray(company.products)) {
      for (var i = 0; i < company.products.length; i++) {
        var p = company.products[i];
        if (p.status === "developing" && typeof developProduct === "function") {
          try {
            var _r = developProduct(state, p.id, effort);
            if (_r && _r.success) {
              state._mcStartupDevCount = (state._mcStartupDevCount || 0) + 1;
            }
          } catch (e) {
            /* 开发失败（如现金不足）—— 真实后果，不打断 */
          }
        }
        // 2. 玩家决策：开发完成则上线
        if (p.status === "ready_to_launch" && typeof launchProduct === "function") {
          try {
            launchProduct(state, p.id);
            if (p.status === "launched") {
              state._mcStartupLaunchDay = state.player.day;
            }
          } catch (e) {
            /* 上线失败——真实后果 */
          }
        }
      }
    }

    // 3. 真实每日结算（收入/租金/研发/营销/破产 全在内部）
    if (typeof tickStartup === "function") {
      try {
        tickStartup(state, "daily");
      } catch (e) {
        /* 结算异常不中断跑分 */
      }
    }

    // 4. 破产检测（引擎已清掉 company 字段则视为破产）
    if (!state.startup.company) {
      state._mcStartupBankrupt = true;
      state._mcStartupBankruptDay = state.player.day;
      state._mcStartup = null;
      return;
    }

    // 5. 统计：累计公司净现金流（正=赚，负=烧）
    var co = state.startup.company;
    var net = (co.revenue || 0) - (co.expenses || 0);
    state._mcTotalStartupProfit = (state._mcTotalStartupProfit || 0) + net;
    // 同步估值到 _mcStartup（供报告读取）
    if (state._mcStartup) state._mcStartup.valuation = co.valuation;
  }

  /** 副业收入（social策略专属） */
  function mcSideHustleIncome(state) {
    var day = state.player.day;
    if (day % 5 !== 0) return; // 每5天一次
    // 副业收益：¥80-250（简化模拟 side_hustle.js 的兼职系统）
    var amt = 80 + Math.floor(Math.random() * 170);
    state.resources.cash += amt;
    state._mcSideHustleEarned = (state._mcSideHustleEarned || 0) + amt;
  }

  // ============ 策略工厂（v3.3 分化版） ============

  /**
   * 策略1: balanced（稳健均衡型）
   * 路径: 工作+住房+治病 — 最安全的活法
   * 特点: 平衡支出与储蓄，升级住房优先
   */
  function createBalancedPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 50, 38, 10);
      mcTreatIllness(state);
      mcUpgradeHousing(state);
      var day = state.player.day;
      var loc =
        day > 50 && cash >= 4000
          ? "techPark"
          : day > 18 && cash >= 1200
            ? "commercialDist"
            : "slum";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略2: grinder（拼命工作狂）
   * 路径: 高强度工作换取现金流，牺牲生活质量
   * 特点: worked<6, fatigue<75，极少休息，不升级住房（省租金）
   * 风险: 高受伤率，但现金积累最快
   */
  function createGrinderPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      var health = state.status ? state.status.health : 100;
      var hygiene = needs ? needs.hygiene : 50;
      if (!needs) return;

      // 健康底线：health<25 时降低工作次数（但不停工！继续赚钱买饭）
      var workLimit = health < 25 ? 3 : 5;
      // 健康差时多买点吃的
      var foodBudget = health < 40 ? 12 : 8;
      var feedThreshold = health < 40 ? 48 : 42;

      // 节俭吃饭：降阈值+便宜食物，省下每一分钱（grinder的"赤贫美学"）
      mcFeed(state, feedThreshold, 30, foodBudget);

      // 卫生底线：hygiene<15时洗澡一次（¥10），防止hygiene=0→健康-2/天
      if (hygiene < 15 && cash >= 15) {
        needs.hygiene = Math.min(100, hygiene + 40);
        state.resources.cash -= 10;
      }

      mcTreatIllness(state); // 健康<30才治
      // 住房：只升T1（最便宜），不追求更高等级
      var ht = state.housing ? state.housing.tier : 0;
      var day = state.player.day;
      if (ht === 0 && cash >= 600 && day > 5) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = day;
      }
      var loc = "slum";
      if (day > 30 && cash >= 2000) loc = "factoryZone";
      if (day > 70 && cash >= 6000) loc = "commercialDist";
      state.trade.currentLocation = loc;
      // 核心区别：workLimit 随健康动态调整
      mcWorkLoop(state, loc, workLimit, 70);
    };
  }

  /**
   * 策略3: skiller（灰色路径）
   * 路径: 技能学习 + 犯罪（高风险高回报）
   * 特点: 高风险，现金波动大，道德值下降
   * 风险: 被抓 → 罚款+健康扣血
   */
  function createSkillerPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 8);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;
      var ap = state.player.actionPoints;

      // 犯罪：仅现金极度紧张且道德未破产时铤而走险（每14天最多一次）
      if (typeof state.flags._mcMorality !== "number")
        state.flags._mcMorality = 50;
      var desperate = cash < 400 && state.flags._mcMorality > 20;
      var opportunistic =
        day > 30 &&
        day % 14 === 0 &&
        state.resources.cash < 3000 &&
        state.flags._mcMorality > 30;
      if (desperate || opportunistic) {
        // 根据地点选择犯罪类型
        var locKey = state.trade.currentLocation || "slum";
        var crimeId = null;
        if (locKey === "slum") crimeId = "steal_battery";
        else if (locKey === "wholesaleMarket") crimeId = "blackmarket";
        else if (locKey === "commercialDist")
          crimeId = Random.chance(0.5) ? "pickpocket" : "scam";
        if (crimeId) {
          mcAttemptCrime(state, crimeId);
          ap = state.player.actionPoints;
        }
      }

      // 偶尔学技能（不抢占犯罪/工作AP）
      mcStudySkill(state, ["coding", "english", "management"]);

      var loc = "slum";
      if (day > 25 && cash >= 1500) loc = "commercialDist";
      if (day > 50 && cash >= 3000) loc = "techPark";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略7: specialist（技能专精）
   * 路径: 打零工保底 → 把 100 AP/天 的大部分投入技能 → 触达 DUAL/TRIPLE/THEME 连携阈值
   * 特点: 前期现金流极紧（少打工），中期技能达标后靠连携加成 + 连携解锁工作翻身
   * 目标: 让夹具**真正覆盖连携系统**（原 6 策略 300 天最高技能仅 25 级，连携全灭）
   *
   * 设计说明（为什么是"专精 9 门到 70"而不是"随便练练"）：
   * - DUAL 门槛 30~60、TRIPLE 门槛 40~70、THEME 门槛 40（2 门）
   * - 只练到 30 只能碰 DUAL；要覆盖 TRIPLE 必须把 3 门推过 60~70
   * - 9 门 = 4 个 TRIPLE 覆盖到的全部技能并集
   */
  function createSpecialistPolicy() {
    var SPEC = [
      "cooking",
      "sales",
      "management",
      "coding",
      "english",
      "repair",
      "electrician",
      "driving",
      "accounting",
    ];
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 8);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;
      var loc = "slum";
      if (day > 25 && cash >= 1500) loc = "commercialDist";
      if (day > 50 && cash >= 3000) loc = "techPark";
      state.trade.currentLocation = loc;

      // [reserveAp · 2026-09-16 第十一轮] **显式声明"留 AP 给学习"**，取代原来的
      // `maxWorked=2` 间接表达（见 `mcWorkLoop` 的 reserveAp 参数说明）。
      //
      // 设计意图：每天留 **34 AP** 给学习（= 2 轮 `mcStudySkillBurst`，每轮 15 AP）。
      //   100 AP 预算下：干 2 份工花 66 AP，剩 34 AP → 正好够 2 轮学习。
      //
      // ★ 与旧 `maxWorked=2` 的关系（实测，8 局 ×300 天，同 seed）：
      //   技能线**完全一致**：最高 70 级、3.5 TRIPLE、被动累计 ¥99,994（旧约 ¥99,155）。
      //   ⚠️ 但**打工略少**（1.37 vs 1.64 份/存活日）—— **这是修正，不是回归**：
      //     差异只在「预循环疲劳休息触发」的场合。`mcWorkLoop` 开头有一条
      //     `if (fatigue > 70 && ap >= 15)` 的休息（花 15 AP）→ 循环起点变 85 AP。
      //       旧 `maxWorked=2`   → 仍打 2 份，把学习预算烧到只剩 19 AP（**挤占学习**）
      //       新 `reserveAp=34`  → 只打 1 份，保住 52 AP（**真正守住了"留 AP 给学习"**）
      //     → 旧写法在疲劳高时会**偷偷破坏自己的设计意图**；新写法不会。
      //   `maxWorked` 仍传 4 作为**硬上限**（防呆：万一 reserve 算错也不至于打满 7 份）。
      mcWorkLoop(state, loc, 4, 60, 34);

      // 再把剩余 AP 全部投入专精（每次 15 AP，上限 8 次/天）
      var guard = 0;
      while (guard++ < 8) {
        if (!mcStudySkillBurst(state, SPEC, 70)) break;
      }
    };
  }

  /**
   * 策略4: trader（房产投资者）
   * 路径: 打工攒首付 → 买房收租 → 积累被动收入
   * 特点: 中期现金流紧张，后期被动收入稳定
   * 目标: 拥有2-3套房产，每月固定租金收入
   */
  function createTraderPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      mcUpgradeHousing(state);

      var day = state.player.day;

      // 核心：攒钱买房
      mcBuyProperty(state);
      // 收房租（月度）
      mcCollectRent(state);

      var loc = "slum";
      if (day > 20 && cash >= 1200) loc = "commercialDist";
      if (day > 60 && cash >= 5000) loc = "techPark";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略5: social（社交+副业型）
   * 路径: NPC关系 + 副业兼职 — 靠人脉赚钱
   * 特点: 稳定副业收入，NPC推荐解锁高薪工作
   */
  function createSocialPolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      if (!needs) return;
      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      // social: 仅升T1+T2（不追T3+，高维护费吃副业收入）
      var htS = state.housing ? state.housing.tier : 0;
      var day = state.player.day;
      var cashS = state.resources.cash;
      if (htS === 0 && cashS >= 600 && day > 7) {
        state.resources.cash -= 300;
        state.housing.tier = 1;
        state.housing.rentedDay = day;
      } else if (htS === 1 && cashS >= 1500 && day > 40) {
        state.resources.cash -= 500;
        state.housing.tier = 2;
        state.housing.rentedDay = day;
      }

      // 核心：副业收入
      mcSideHustleIncome(state);
      // NPC推荐（解锁高薪工作）
      if (day > 15) state.flags.oldZhouReferred = true;
      if (day > 25) state.flags.bossLiReferred = true;
      if (day > 20) state.flags.sisterZhangReferred = true;
      if (day > 20) state.flags.chefChenAssistant = true;
      if (day > 30 && state.player.intelligence >= 25)
        state.flags.xiaoMeiReferred = true;

      var loc = "slum";
      if (day > 20 && cash >= 400) loc = "construction";
      if (day > 35 && cash >= 800) loc = "commercialDist";
      if (day > 60 && cash >= 3000 && state.player.intelligence >= 30)
        loc = "school";
      state.trade.currentLocation = loc;
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  /**
   * 策略6: crowner（创业路径）
   * 路径: 攒钱+学技能 → 注册公司 → 被动创业收入
   * 特点: 前60天攒钱+学技能，之后创业获取被动收入
   * 目标: Day 60+ 注册公司
   * v3.3 修复: 健康底线(health<50停学)+ 生存预算(cash<500先工作)+ 降学频(每3天一次)
   */
  function createCorporatePolicy() {
    return function (state) {
      var cash = state.resources ? state.resources.cash : 0;
      var needs = state.needs;
      var health = state.status ? state.status.health : 100;
      if (!needs) return;

      // 健康底线：health<50 时跳过学习，只生存
      if (health < 50) {
        mcFeed(state, 50, 35, 12);
        mcTreatIllness(state);
        mcUpgradeHousing(state);
        var loc = "slum";
        if (cash >= 1200) loc = "commercialDist";
        state.trade.currentLocation = loc;
        mcWorkLoop(state, loc, 5, 60);
        return;
      }

      mcFeed(state, 45, 30, 10);
      mcTreatIllness(state);
      // [corporate 夹具修复 · 2026-09-15] 创业前把住房封顶在 T3：
      // T4 一次性 ¥6,000 + 更高房租会直接吃掉创业本金（实测 day120 现金 ¥9,142 → ¥2,746），
      // 使 corporate 策略永远够不到 mcRegisterStartup 的门槛 → 公司阶段转化率恒为 0%
      // → 585 个 corporate 事件从未被验证过。
      if (state._mcStartup || (state.housing ? state.housing.tier : 0) < 3) {
        mcUpgradeHousing(state);
      }

      var day = state.player.day;

      // [corporate 夹具修复 · 2026-09-15] 技能达标情况提前算一次（学习窗口与工作强度都要用）。
      // 达标线对齐真实游戏：src/js/phase2/startup.js:309「至少 2 项技能达到 12 级」。
      var _skillsReady = 0;
      for (var _skk in state.skills) {
        if (state.skills[_skk] && state.skills[_skk].level >= 12) _skillsReady++;
      }

      // 核心：攒钱+学技能+社交 → 创业
      if (!state._mcStartup) {
        // [R1019 夹具对齐 第十五轮] 先处理「社交门」——
        //   真实注册需要 2 位 NPC 好感 ≥40，靠「拜访」爬升（+3~5/次，7 天冷却/NPC）。
        //   实测（`scripts/_diag-social.cjs`）：初始 0，每 3 天左右 +4，
        //   单个 NPC 从 0 爬到 40 需要 **约 80 天**；而 Day≥60 只是**下限**不是截止。
        //   目标导向的玩家会把闲暇铺到多个 NPC 上（并行爬升），
        //   所以这里放宽到「每天最多拜访 8 人」—— 取 20 个 NPC 的 40%，
        //   近似"记得住顺路去看的几个熟人"，而非"整城刷满"。
        //   ⚠️ 若把上限压到 3，注册要到 Day 80+ 才发生，会把 corporate 的
        //      「创业率」压到接近 0 —— 那是**夹具的行为假设**，不是游戏的性质。
        if (mcCountHighAffinityNpcs(state) < 2) {
          mcVisitNpcs(state, 8);
        }

        // v3.3 修复: 生存预算 — cash<500时优先工作不学习
        var studying = false;
        if (cash >= 500) {
          // 每3天学一次，专攻2个技能
          // [corporate 夹具修复 · 2026-09-15] 原条件是 `day <= 120` 硬上限，结果技能
          // 在 day120 停在 11/10 级 —— 差 1 级永远跨不过「2 项技能 ≥12」的门，
          // 于是公司阶段转化率恒为 0%。改为「只要还没达标就继续学」，不再按天数截断。
          if (
            _skillsReady < 2 &&
            day > 10 &&
            day % 3 === 0 &&
            state.player.actionPoints >= 18
          ) {
            var skids2 = Object.keys(state.skills);
            var cs2 = null,
              csLvl2 = 999;
            var prefers = ["coding", "english"];
            for (var si = 0; si < skids2.length; si++) {
              for (var pi = 0; pi < prefers.length; pi++) {
                if (skids2[si] === prefers[pi]) {
                  var lv = state.skills[skids2[si]].level || 0;
                  if (lv < csLvl2) {
                    cs2 = skids2[si];
                    csLvl2 = lv;
                  }
                  break;
                }
              }
            }
            if (
              cs2 &&
              state.skills[cs2].level < 60 &&
              state.needs.fatigue < 50
            ) {
              state.skills[cs2].level = Math.min(
                100,
                state.skills[cs2].level + 1,
              );
              state.skills[cs2].xp = 0;
              state.player.actionPoints -= 15;
              state.needs.fatigue = Math.min(100, state.needs.fatigue + 3);
              state._mcSkillUps = (state._mcSkillUps || 0) + 1;
              studying = true;
            }
          }
        }
        // 尝试注册
        mcRegisterStartup(state);
      } else {
        // [R1019 夹具对齐 第十五轮] 驱动真实 tickStartup 而非凭空算利润
        //   effort=1 是单位进度成本最优档（报告 29.2），代表玩家的合理打法。
        mcStartupTick(state, 1);
      }

      // [corporate 夹具修复 · 2026-09-15] 原实现硬编码 loc="techPark"，但 techPark 的高薪职位
      // （foreign_company_staff ¥452 / finance_analyst ¥432）都要求「年满 22 岁」，而玩家起始
      // 20 岁、300 天只长到 20.8 岁 → 这些职位永远不可用；techPark 当日可用的只剩低薪/无地点
      // 职位（≈¥48/次），反而比 commercialDist 的 delivery_rider（¥112/次）更差。
      // findJobAtLocation 是按 location 过滤的，人被"困"在 techPark 就够不到别处的高薪工作
      // —— 这是 corporate 策略日薪被压到 ≈¥48 的直接原因。
      // 修法：在候选地点中选「当日最高可用日薪」的那个，而不是硬编码。
      var loc = "slum";
      var _candLocs = ["slum", "commercialDist", "techPark"];
      var _bestPay = -1;
      for (var _ci = 0; _ci < _candLocs.length; _ci++) {
        var _cj = findJobAtLocation(state, _candLocs[_ci]);
        var _cp = 0;
        try {
          _cp = _cj && typeof _cj.payCalc === "function" ? _cj.payCalc(state) : 0;
        } catch (e) {
          _cp = 0;
        }
        if (_cp > _bestPay) {
          _bestPay = _cp;
          loc = _candLocs[_ci];
        }
      }
      state.trade.currentLocation = loc;
      // [corporate 参数重标定 · 2026-09-16 第十一轮]
      // ⚠️ 历史包袱已清：原注释的整套推理建立在「每次工作仅耗 14 AP」上
      //   （"AP 长期剩余 90~100"、"瓶颈是疲劳"、"放开到 7"），
      //   而游戏真实单价是 **33 AP**（`main.js:2585` / `4493`）→ 前提全部失效：
      //     · 100 AP 只够 3 份工 → "AP 剩余 90~100" 不成立
      //     · "瓶颈是疲劳" → **反了**，瓶颈变回 AP
      //     · "放开到 7" → **物理不可能**（7 × 33 = 231 > 100），`7` 是死参数
      //   第十轮曾把创业率崩塌（100% → 30%）归因于此，**第十轮续已更正**：
      //   真凶是 `mcRegisterStartup` 自加的 ¥10,000 缓冲（已转正修掉），
      //   `workLimit` 传 4 传 7 **都不起约束**（33 AP 下 AP 才是唯一上限）。
      // → 因此**不再需要按技能阶段切换次数**：两阶段都给 4（= 防呆硬上限，
      //   实际永远打不到，被 AP 挡住）。这样 `workLimit` 不再是"调参"，回到纯防呆。
      //   `_skillsReady` 仍用于决定**是否去学习**（下方的学习门），只是不再影响工作次数。
      mcWorkLoop(state, loc, 4, 60);
    };
  }

  function runTrial(baseState, policyFn, seed, strategyName) {
    // [内存治理] DOM 存根是 init() 时创建一次的全局单例，document.body.children
    // 会被 UI 函数持续 appendChild 且永不清理。多局连跑时 children 单调增长，
    // 且这些元素上的闭包会持有每局 state → 旧局对象无法回收 → 堆线性增长直至 OOM
    // （实测 20 局 × 500 天 × 6 策略会打满 4GB）。开局前重置即可恢复可回收性。
    if (typeof runner.resetDom === "function") runner.resetDom();

    // [可复现性] 浏览器里「重开一局」= 整页重载，模块级全局随页面销毁；
    // headless 不重载，游戏侧的模块级单例会跨局残留，使同种子两局跑出不同结果。
    // 已确认残留源：共享新闻池 NEWS_L1_L4 的 _appliedDay/_conduitChecked
    // （残留会让下一局跳过新闻传导链 → 少消耗随机数 → PRNG 错位 → 全盘分叉），
    // 以及 localStorage 里的回忆录/自动存档。
    // 开局前清掉，夹具才等价于「整页重载」。游戏侧的真 bug 仍需单独修。
    if (typeof runner.resetSharedState === "function") runner.resetSharedState();

    var state = deepClone(baseState);
    state.player.day = 1;
    state.flags.gameOver = false;
    state.flags.gameOverReason = "";
    state.status.health = baseState.status.health;
    if (typeof Random !== "undefined" && Random.setSeed) Random.setSeed(seed);

    // [R1019 夹具对齐 第十五轮] NPC 关系初始化。
    //   真实开新局的入口是 `main.js:1751` → `initNpcRelationships(state)`，
    //   它把 `state.relationships` 填成「全部 NPC、affinity=0~6、met=false」。
    //   而 headless 夹具只克隆 baseState —— baseState 里 relationships 是 **空对象 {}**
    //   （`state.js:157` 的默认值），于是：
    //     · 任何依赖 `relationships` 的玩法（社交、NPC 连携、**创业的 NPC 好感门**）
    //       在夹具里**全部失效**；
    //     · `registerStartup` 的「至少 2 位 NPC 好感 ≥40」永远不过 → 创业率恒 0%。
    //   这里补上初始化，使夹具与「浏览器里开一局」等价。
    if (typeof initNpcRelationships === "function") {
      initNpcRelationships(state);
    }

    // [A/B 归因] 一次性钩子：模拟「修复前」的模块级状态。
    // 注意这些覆盖是全局的、不可逆的 —— 所以只在显式设置 CLS_AB 时执行。
    if (AB_NO_NEWS) {
      try {
        globalThis.applyNewsPriceModsForEvent = function () {};
      } catch (e) {}
    }
    if (AB_NO_TRIGGER) {
      try {
        if (typeof window !== "undefined" && window.TriggerRegistry) {
          // 注意：调用点走的是 triggerRandom()（内部 fireTrigger），
          // **不经过** getEventsForSlot() —— 只覆盖后者是无效的。
          // 覆盖 triggerRandom 返回 null，等价于修复前「12 槽全空」。
          window.TriggerRegistry.triggerRandom = function () {
            return null;
          };
          window.TriggerRegistry.getEventsForSlot = function () {
            return [];
          };
          window.TriggerRegistry.fire = function () {
            return null;
          };
        }
      } catch (e) {}
    }
    // [A/B 归因] no-passive：摘掉 TRIPLE 的 4 个 passive 键 → 等价于补齐前。
    // 为什么改 checkSkillSynergies 而不是直接改数据表：
    // SKILL_SYNERGY_TRIPLE 是顶层 `const`，**不挂 window/globalThis**
    // （本项目已验证过的坑），从 MC 模块根本取不到。
    // 而消费端只读 `state.skillSynergies.effects`，所以在返回值上删键等价。
    if (AB_NO_PASSIVE && !_abPassivePatched) {
      _abPassivePatched = true;
      try {
        var _origCheck = globalThis.checkSkillSynergies;
        if (typeof _origCheck === "function") {
          globalThis.checkSkillSynergies = function (st) {
            var r = _origCheck(st);
            if (r && r.effects) {
              delete r.effects.passiveRestaurantIncome;
              delete r.effects.passiveStockIncome;
              delete r.effects.passiveSmartHomeIncome;
              delete r.effects.passiveLogisticsIncome;
            }
            return r;
          };
        }
      } catch (e) {}
    }

    return _runTrialInner(state, policyFn, strategyName);
  }

  function _runTrialInner(state, policyFn, strategyName) {
    var snaps = [],
      sick = 0,
      hurt = 0,
      diedOn = -1,
      deathCause = "",
      isVictory = false,
      victoryDay = -1,
      dayCash = [],
      dayHealth = [],
      dayHunger = [],
      dayFatigue = [],
      // [资源利用率 · 2026-09-16] 每日 AP 预算 = maxActionPoints（100），
      // 但 mcWorkLoop 上限是「4 份工 × 14 AP = 56 AP」——**用不掉的 AP 当日作废**。
      // 于是「某策略收益高」有两种完全不同的解释：
      //   ① 它效率更高；② 别的策略在浪费资源（AP 只用了一半）。
      // 不量出这个比例，就无法判断「拉平策略收益」该调谁。
      apBudget = 0,
      apSpent = 0,
      // [AP 去向拆分 · 2026-09-16] 精确区分「产出 AP」与「休息 AP」。
      // 起因：`fix-fatigue-rest` 的 A/B 显示 AP 利用率 7/7 上升，但打工份数 5 降 2 升 ——
      // 因为休息也烧 AP。只看总利用率会得出「修好了」的错误结论。
      // 这两个值由 mcWorkLoop 内的 spend() 累加（工作 14/份，休息或回血 12~15/次）。
      apWork = 0,
      apRest = 0,
      apHealth = 0,
      // [口径修正 · 2026-09-16] 「打工份数/日」原来除以 `daysPerTrial`（全期均摊口径），
      // 早死局会被摊薄 → 存活率一变，这个数字就跟着动，无法用来比较两组配置。
      // 改为同时给出「存活期口径」：总打工次数 / 总存活天数。
      aliveDays = 0,
      // 原 `jobsWorked = {}` 声明后**从未被写入**（死变量，2026-09-16 审计发现）；
      // `totalWorks` 同样从未累加 → 改为在 mcWorkLoop 里写 state._mcWorks 后回填。
      totalWorks = 0,
      phaseTransitionDay = -1,
      maxHousingTier = 0,
      housingUpgradeDays = [],
      rentPaid = 0,
      foodSpent = 0,
      amenityUsed = 0,
      eventsTriggered = 0,
      // [连携覆盖] 技能连携系统的可观测指标 —— 原夹具完全测不到它
      // （最高技能 25 级 < DUAL 门槛 30，连携恒不激活）。
      peakDual = 0,
      peakTriple = 0,
      peakTheme = 0,
      synergyDays = 0,
      passiveDays = 0,
      passiveTotal = 0,
      maxSkillLv = 0,
      skillUps = 0;

    // [事件计数修复] 原实现统计 _dailyTransactions 里 type:"event" 的条目，
    // 但全库没有任何代码写入该字段 → 计数恒为 0，事件层等于从未被覆盖。
    // 改为在 state 上挂 _pendingEvent setter，捕获所有入队通道
    // （随机池 / 心理危机优先 / 村长债务优先 / 链式队列 / 管线触发槽 / 节日）。
    var _mcPe = null;
    var _mcPeCount = 0;
    var _mcPeIds = new Set(); // 唯一事件 id —— 避免被重复入队的同一事件灌水
    var _mcPeTopRepeat = 0; // 单个事件最大重复次数，用于暴露"卡住"的优先通道事件
    var _mcPeTopRepeatId = ""; // 重复最多的那个事件的 id
    var _mcPeRepeatCount = {};
    try {
      Object.defineProperty(state, "_pendingEvent", {
        configurable: true,
        get: function () {
          return _mcPe;
        },
        set: function (v) {
          _mcPe = v;
          if (v && v.id) {
            _mcPeCount++;
            _mcPeIds.add(v.id);
            _mcPeRepeatCount[v.id] = (_mcPeRepeatCount[v.id] || 0) + 1;
            if (_mcPeRepeatCount[v.id] > _mcPeTopRepeat) {
              _mcPeTopRepeat = _mcPeRepeatCount[v.id];
              _mcPeTopRepeatId = v.id;
            }
          }
        },
      });
    } catch (e) {
      // 定义失败则退回原计数口径
    }

    var snapDays = [30, 90, 365];
    var dayCashWindow = [];
    var recentCash = [];

    for (var d = 0; d < CONFIG.daysPerTrial; d++) {
      // [A/B 归因] 每天清空让位标记 → 强制通道重新独占当天唯一名额，
      // 等价于「事件槽让位闸」修复前（随机池投递恒为 0）。
      if (AB_NO_YIELD && state.flags) state.flags._yieldEventSlotToPool = false;

      var startHealth = state.status.health;
      var startCash = state.resources.cash;

      // [资源利用率] 量出策略实际消耗的当日 AP（预算 = maxActionPoints）。
      // 所有策略辅助函数都只减不增 AP（mcFeed/mcWorkLoop/mcStudySkillBurst/
      // mcStudySkill/mcAttemptCrime 全部为 `ap -= n`），故差值即消耗量。
      var _apBefore = state.player.actionPoints || 0;
      try {
        policyFn(state);
      } catch (e) {}
      var _apAfter = state.player.actionPoints || 0;
      if (_apBefore > 0) {
        apBudget += _apBefore;
        apSpent += Math.max(0, _apBefore - _apAfter);
        aliveDays++;
      }
      // v3.1 新机制：结算上一日抽到的命运抉择卡（按策略性格选 bold/safe）
      try {
        if (
          state._pendingCrossroads &&
          typeof resolveCrossroads === "function"
        ) {
          var bias = CROSSROADS_BIAS[strategyName] || "safe";
          var opt =
            typeof decideCrossroads === "function"
              ? decideCrossroads(state, bias)
              : 0;
          if (opt < 0) opt = 0;
          var pendId = state._pendingCrossroads.id;
          resolveCrossroads(state, pendId, opt);
        }
      } catch (e) {}
      try {
        state.player.actionPoints = 0;
        state.player.timeSlot = "evening";
        var prePipelineHealth = state.status.health;
        if (typeof runDailyPipeline === "function") runDailyPipeline(state);
      } catch (e) {
        if (state.flags) state.flags.gameOver = true;
        state.flags.gameOverReason = "pipeline_error: " + e.message;
      }

      // [连携覆盖] 记录技能连携系统的实际激活情况（原夹具完全测不到）
      try {
        var sy = state.skillSynergies;
        if (sy) {
          var nd = sy.dual ? Object.keys(sy.dual).length : 0;
          var nt = sy.triple ? Object.keys(sy.triple).length : 0;
          var nh = sy.theme ? Object.keys(sy.theme).length : 0;
          if (nd > peakDual) peakDual = nd;
          if (nt > peakTriple) peakTriple = nt;
          if (nh > peakTheme) peakTheme = nh;
          if (nd + nt + nh > 0) synergyDays++;
          var psum = 0;
          if (sy.effects) {
            for (var _pk in sy.effects) {
              if (
                _pk.indexOf("passive") === 0 &&
                typeof sy.effects[_pk] === "number" &&
                sy.effects[_pk] > 0
              ) {
                psum += sy.effects[_pk];
              }
            }
          }
          if (psum > 0) {
            passiveDays++;
            passiveTotal += psum;
          }
        }
        if (state.skills) {
          for (var _sk in state.skills) {
            var _lv = state.skills[_sk] ? state.skills[_sk].level || 0 : 0;
            if (_lv > maxSkillLv) maxSkillLv = _lv;
          }
        }
        if (state._mcSkillUps) skillUps = state._mcSkillUps;
      } catch (e) {}

      // [弹窗阻塞修复] headless 下 showEventModal 不会真正关闭弹窗，_pendingEvent
      // 一旦被写入就永久占用；rollStreetEvent / rollCorporateEvent 开头的
      // `if (state._pendingEvent) return` 会让后续所有天数再也抽不到事件。
      // 每天结束清空，模拟玩家关掉弹窗。
      //
      // [事件口径修正] 默认只清空、不代玩家作答 —— 保持与修复前一致的经济口径，
      // 便于历史数据对比。但这样会让「优先通道」事件（心理危机 / 村长债务）
      // 因触发条件不解除而**每天重复入队**，把随机池彻底饿死：
      // 实测 400 天内 mental_therapy_chance 独占 375 次（94%），唯一事件仅 17 个。
      // 因此默认口径下的事件计数只能当作「队列活动度」，不能当作「内容触达度」。
      // 加 --answer-events 改为执行 choice[0]（与 scripts/audit-event-coverage.cjs 一致），
      // 事件密度回到真实水平 ≈0.35 次/天、唯一事件 320+。作答会改变存活/资产基线。
      if (CONFIG.answerEvents && state._pendingEvent) {
        try {
          var _mcEvt = state._pendingEvent;
          var _mcChoice = _mcEvt.choices && _mcEvt.choices[0];
          if (_mcChoice && typeof _mcChoice.apply === "function")
            _mcChoice.apply(state);
          else if (_mcChoice && typeof _mcChoice.effect === "function")
            _mcChoice.effect(state);
        } catch (e) {}
      }
      state._pendingEvent = null;
      state._pendingEventId = null;

      // Track phase transition
      if (
        phaseTransitionDay < 0 &&
        state.player.phase === "corporate" &&
        d > 0
      ) {
        phaseTransitionDay = d + 1;
      }

      // Track housing upgrades
      var curTier = state.housing ? state.housing.tier : 0;
      if (curTier > maxHousingTier) {
        if (
          housingUpgradeDays.length === 0 ||
          housingUpgradeDays[housingUpgradeDays.length - 1] !== curTier
        ) {
          housingUpgradeDays.push({ tier: curTier, day: d + 1 });
        }
        maxHousingTier = curTier;
      }

      // Death detection with cause
      if (state.flags.gameOver || state.status.health <= 0) {
        // [通关/死亡区分 · 2026-09-15] triggerVictory()（src/js/ui/victory.js:278）
        // 会设 flags.gameOver = true，但**不设** flags.gameOverReason
        // ——它设的是 victoryTitle / victoryDesc。
        // 原实现因此把「通关」误判成「死亡（unknown）」：
        //   实测 --answer-events 模式下 balanced 3/3 局在第 44 天左右"死亡"，
        //   死因全是 unknown，其实三局都是 zen_master（连续7天极佳状态）通关。
        // 后果：存活率恒为 0%、死亡分布与死因统计全部失真，
        //       任何「该策略能不能活」的结论都不可信。
        // 修法：先判通关，通关不计入死亡、不记 diedOnDay，单独统计通关率。
        if (state.flags.victory) {
          isVictory = true;
          victoryDay = d + 1;
          deathCause = "victory";
          break;
        }
        diedOn = d + 1;
        deathCause = state.flags.gameOverReason || "";
        if (!deathCause) {
          if (state.status.health <= 0) deathCause = "health_depleted";
          else if (
            (state.resources.debt || 0) + (state.resources.villageDebt || 0) >
            50000
          )
            deathCause = "debt_over_50000";
          else deathCause = "unknown";
        }
        break;
      }

      // Count illness/injury
      if (
        state.flags._dailyTransactions &&
        Array.isArray(state.flags._dailyTransactions)
      ) {
        for (var ti = 0; ti < state.flags._dailyTransactions.length; ti++) {
          var t = state.flags._dailyTransactions[ti];
          if (
            t.type === "illness" ||
            (t.category && t.category.indexOf("illness") >= 0)
          )
            sick++;
          if (
            t.type === "injury" ||
            (t.category && t.category.indexOf("injury") >= 0)
          )
            hurt++;
          if (t.category === "rent") rentPaid += t.amount || 0;
          if (t.category === "food" || t.category === "amenity_food")
            foodSpent += t.amount || 0;
          if (t.type === "event") eventsTriggered++;
        }
      }

      // v3.3 差异化指标在 trial 结束时统一读取（state字段为累积计数器）

      // [内存治理] 当日流水在真实游戏里由 daily_report 清空；headless 无该步骤，
      // 会在整局内无界累积。必须放在上面疾病/受伤/租金/食物统计【之后】清，
      // 否则会清掉本日待统计的数据。
      if (state.flags && Array.isArray(state.flags._dailyTransactions)) {
        state.flags._dailyTransactions = [];
      }

      if (snapDays.indexOf(d + 1) >= 0) {
        snaps.push({
          d: d + 1,
          c: state.resources.cash,
          h: state.status.health,
          ht: state.housing ? state.housing.tier : 0,
          p: state.player.phase,
        });
      }
    }

    // [事件计数修复] 用 _pendingEvent setter 的真实计数覆盖原口径。
    // 原口径统计 _dailyTransactions 里 type:"event" 的条目，而全库无任何写入方，
    // 所以历史上这个指标恒为 0，事件层从未被真正度量。
    eventsTriggered = _mcPeCount;
    var eventsUnique = _mcPeIds.size;
    var eventsTopRepeat = _mcPeTopRepeat;
    var eventsTopRepeatId = _mcPeTopRepeatId;

    // [AP 去向拆分] mcWorkLoop 里累加在 state 上，这里回填到本局结果。
    apWork = state._mcApWork || 0;
    apRest = state._mcApRest || 0;
    apHealth = state._mcApHealth || 0;

    var survived = diedOn === -1;
    return {
      survived: survived,
      victory: isVictory,
      victoryDay: victoryDay,
      victoryTitle: state.flags.victoryTitle || "",
      diedOnDay: diedOn,
      deathCause: deathCause,
      finalCash: state.resources.cash,
      finalBank: state.resources.bankBalance || 0,
      finalDebt:
        (state.resources.debt || 0) + (state.resources.villageDebt || 0),
      finalHealth: state.status.health,
      finalHousingTierMax: maxHousingTier,
      // [连携覆盖] 见 _runTrialInner 顶部说明
      peakDual: peakDual,
      peakTriple: peakTriple,
      peakTheme: peakTheme,
      synergyDays: synergyDays,
      passiveDays: passiveDays,
      passiveTotal: passiveTotal,
      maxSkillLv: maxSkillLv,
      skillUps: skillUps,
      // [资源利用率] 见 _runTrialInner 顶部说明
      apBudget: apBudget,
      apSpent: apSpent,
      apWork: apWork,
      apRest: apRest,
      apHealth: apHealth,
      aliveDays: aliveDays,
      totalWorks: state._mcWorks || 0,
      finalHousingTier: state.housing ? state.housing.tier : 0,
      totalEarned: state.resources.totalEarned || 0,
      illnessCount: sick,
      injuryCount: hurt,
      snapshots: snaps,
      finalPhase: state.player.phase,
      phaseTransitionDay: phaseTransitionDay,
      housingUpgradeDays: housingUpgradeDays,
      rentPaid: rentPaid,
      foodSpent: foodSpent,
      eventsTriggered: eventsTriggered,
      eventsUnique: eventsUnique,
      eventsTopRepeat: eventsTopRepeat,
      eventsTopRepeatId: eventsTopRepeatId,
      // v3.3 差异化指标
      medicalSpent: state._mcMedicalSpent || 0,
      crimeAttempts: state._mcCrimeAttempts || 0,
      crimeSuccess: state._mcCrimeSuccess || 0,
      crimeCaught: state._mcCrimeCaught || 0,
      propertyCount: state._mcPropertyCount || 0,
      totalRentEarned: state._mcTotalRentEarned || 0,
      totalStartupProfit: state._mcTotalStartupProfit || 0,
      sideHustleEarned: state._mcSideHustleEarned || 0,
      housingUpgrades: state._mcHousingUpgrades || 0,
      // [重复键清理 · 2026-09-16] 此处原有 `skillUps: state._mcSkillUps || 0`，
      // 与上方 `skillUps: skillUps` 同键 → 后者恒被覆盖（值相同，故无行为差异）。
      // 保留上方那一处即可，避免日后改一处忘另一处。
      // [R1019 夹具对齐 第十五轮] 改读 `_mcStartupFoundedDay`（持久字段）。
      //   原读 `state._mcStartup.foundedDay`，而新夹具在**破产时会清空 `_mcStartup`**
      //   （见 mcStartupTick 第 4 步）→ 破产的创业者被记成「未创业」，
      //   `startupFounderRate` 恒 0%，掩盖了「其实注册了、只是后来倒了」的真实情况。
      //   「创业率」应衡量**是否走到注册这一步**，「创业后是否存活」是另一个指标。
      startupFoundedDay: state._mcStartupFoundedDay || -1,
      finalMorality: state.flags._mcMorality || 50,
      crossroadsTaken: state._mcCrossroadsTaken || 0,
    };
  }

  function runStrategy(strategyName, baseState) {
    var policies = {
      balanced: createBalancedPolicy(),
      grinder: createGrinderPolicy(),
      skiller: createSkillerPolicy(),
      trader: createTraderPolicy(),
      social: createSocialPolicy(),
      corporate: createCorporatePolicy(),
      specialist: createSpecialistPolicy(),
    };
    var policy = policies[strategyName];
    if (!policy) {
      console.error("  ❌ 未知策略: " + strategyName);
      return null;
    }

    var results = [],
      start = Date.now();
    for (var i = 0; i < CONFIG.trials; i++) {
      results.push(
        runTrial(
          baseState,
          policy,
          CONFIG.seed + i * 1000 + strategyName.length,
          strategyName,
        ),
      );
      if (CONFIG.verbose && (i + 1) % 25 === 0)
        process.stderr.write("    ..." + (i + 1) + "/" + CONFIG.trials + "\n");
    }
    return analyzeResults(
      strategyName,
      results,
      ((Date.now() - start) / 1000).toFixed(1),
    );
  }

  function analyzeResults(name, results, elapsed) {
    var n = results.length,
      alive = results.filter(function (r) {
        return r.survived;
      }),
      victories = results.filter(function (r) {
        return r.victory;
      }),
      dead = results.filter(function (r) {
        return !r.survived;
      });
    var sr = (alive.length / n) * 100;
    // [通关统计 · 2026-09-15] 通关（victory）现在计入 survived，不再混进 dead。
    // 单独统计通关率与平均通关天数，避免「44天通关」被读成「44天死亡」。
    var vr = (victories.length / n) * 100;
    var avgVictoryDay =
      victories.length > 0
        ? victories.reduce(function (s, r) {
            return s + (r.victoryDay || 0);
          }, 0) / victories.length
        : -1;
    var victoryTitles = {};
    for (var vi = 0; vi < victories.length; vi++) {
      var vt = victories[vi].victoryTitle || "unknown";
      victoryTitles[vt] = (victoryTitles[vt] || 0) + 1;
    }
    var d1 = dead.filter(function (r) {
      return r.diedOnDay <= 7;
    }).length;
    var d2 = dead.filter(function (r) {
      return r.diedOnDay > 7 && r.diedOnDay <= 30;
    }).length;
    var d3 = dead.filter(function (r) {
      return r.diedOnDay > 30 && r.diedOnDay <= 90;
    }).length;
    var d4 = dead.filter(function (r) {
      return r.diedOnDay > 90;
    }).length;
    var add =
      dead.length > 0
        ? dead.reduce(function (s, r) {
            return s + r.diedOnDay;
          }, 0) / dead.length
        : -1;

    var ca = alive.map(function (r) {
      return r.finalCash;
    });
    ca.sort(function (a, b) {
      return a - b;
    });
    var pct = function (arr, p) {
      return arr[Math.min(Math.floor((arr.length * p) / 100), arr.length - 1)];
    };
    var avgCash =
      alive.length > 0
        ? ca.reduce(function (s, v) {
            return s + v;
          }, 0) / alive.length
        : 0;
    var avgHe =
      alive.reduce(function (s, r) {
        return s + r.finalHealth;
      }, 0) / Math.max(1, alive.length);
    var poor = alive.filter(function (r) {
      return r.finalCash < 500;
    }).length;
    var sub = alive.filter(function (r) {
      return r.finalCash >= 500 && r.finalCash < 5000;
    }).length;
    var com = alive.filter(function (r) {
      return r.finalCash >= 5000 && r.finalCash < 50000;
    }).length;
    var ric = alive.filter(function (r) {
      return r.finalCash >= 50000;
    }).length;
    var snapData = {};
    [30, 90, 365].forEach(function (sd) {
      var vals = results
        .filter(function (r) {
          return r.snapshots.some(function (s) {
            return s.d === sd;
          });
        })
        .map(function (r) {
          var s = r.snapshots.filter(function (x) {
            return x.d === sd;
          })[0];
          return s ? s.c : null;
        })
        .filter(function (c) {
          return c !== null;
        });
      if (vals.length > 0) {
        vals.sort(function (a, b) {
          return a - b;
        });
        snapData[sd] = {
          n: vals.length,
          median: pct(vals, 50),
          p25: pct(vals, 25),
          p75: pct(vals, 75),
          min: vals[0],
          max: vals[vals.length - 1],
        };
      }
    });
    var avgIl =
      alive.reduce(function (s, r) {
        return s + r.illnessCount;
      }, 0) / Math.max(1, alive.length);
    var avgIn =
      alive.reduce(function (s, r) {
        return s + r.injuryCount;
      }, 0) / Math.max(1, alive.length);
    var avgHo =
      alive.reduce(function (s, r) {
        return s + (r.finalHousingTierMax || r.finalHousingTier);
      }, 0) / Math.max(1, alive.length);
    var corp3 = alive.filter(function (r) {
      return r.finalPhase === "corporate";
    }).length;
    var avgFood =
      alive.reduce(function (s, r) {
        return s + (r.foodSpent || 0);
      }, 0) / Math.max(1, alive.length);
    // 事件指标统一用**全部局数 n** 做分母（原实现用 alive.length，会让高死亡率策略
    // 错误地显示 0 个事件）。触发次数=队列活动度（含重复入队）；唯一事件数=真实内容触达。
    var avgEvt =
      results.reduce(function (s, r) {
        return s + (r.eventsTriggered || 0);
      }, 0) / Math.max(1, n);
    var avgEvtUnique =
      results.reduce(function (s, r) {
        return s + (r.eventsUnique || 0);
      }, 0) / Math.max(1, n);
    var maxEvtRepeat = results.reduce(function (s, r) {
      return Math.max(s, r.eventsTopRepeat || 0);
    }, 0);
    var maxEvtRepeatId = results.reduce(function (s, r) {
      return (r.eventsTopRepeat || 0) === maxEvtRepeat && r.eventsTopRepeatId
        ? r.eventsTopRepeatId
        : s;
    }, "");
    // [连携覆盖] 连携系统的可达性指标（跨局平均 / 峰值）
    var sumOf = function (key) {
      return (
        results.reduce(function (s, r) {
          return s + (r[key] || 0);
        }, 0) / Math.max(1, n)
      );
    };
    var peakOf = function (key) {
      return results.reduce(function (s, r) {
        return Math.max(s, r[key] || 0);
      }, 0);
    };
    var avgPeakDual = sumOf("peakDual");
    var avgPeakTriple = sumOf("peakTriple");
    var avgPeakTheme = sumOf("peakTheme");
    var avgSynergyDays = sumOf("synergyDays");
    var avgPassiveDays = sumOf("passiveDays");
    var avgPassiveTotal = sumOf("passiveTotal");
    var maxSkillLv = peakOf("maxSkillLv");
    // [死变量修复 · 2026-09-16] 此处原有 `var avgSkillUps = sumOf("skillUps")`，
    // 但下方 v3.3 区块又用 alive 口径声明了同名变量 → 本行恒被覆盖，是死代码。
    // 已删除，保留 alive 口径那一处。
    // [资源利用率] 跨局合计口径：ratio 天然归一，不会被「早死局 AP 少」拉偏。
    var apBudgetSum = results.reduce(function (s, r) {
      return s + (r.apBudget || 0);
    }, 0);
    var apSpentSum = results.reduce(function (s, r) {
      return s + (r.apSpent || 0);
    }, 0);
    var avgApUtilPct = apBudgetSum > 0 ? (apSpentSum / apBudgetSum) * 100 : 0;
    // [AP 去向拆分 · 2026-09-16] 把上面那个「利用率」拆成**产出**与**休息**两半。
    // 为什么必须拆：`fix-fatigue-rest` 的 A/B 里总利用率 7/7 上升，看着像"修好了"，
    // 但同一批数据里打工份数 5 降 2 升 —— 因为休息（12~15 AP/次）也计入总利用率。
    // 不拆开就会把"把闲置 AP 烧在休息上"误读成"资源用得更满"。
    var apWorkSum = results.reduce(function (s, r) {
      return s + (r.apWork || 0);
    }, 0);
    var apRestSum = results.reduce(function (s, r) {
      return s + (r.apRest || 0);
    }, 0);
    var apHealthSum = results.reduce(function (s, r) {
      return s + (r.apHealth || 0);
    }, 0);
    var avgApWorkPct = apBudgetSum > 0 ? (apWorkSum / apBudgetSum) * 100 : 0;
    var avgApRestPct = apBudgetSum > 0 ? (apRestSum / apBudgetSum) * 100 : 0;
    var avgApHealthPct = apBudgetSum > 0 ? (apHealthSum / apBudgetSum) * 100 : 0;
    // 三去向必须都写出来：`mcWorkLoop` 只覆盖「工作/休息」两条，
    // 差额是**学习、社交、犯罪**等 policyFn 里的其他 AP 消耗。
    // 只写前两项会让读者以为它们相加等于总利用率（specialist 就有 35% 是学习）。
    var avgApOtherPct = Math.max(
      0,
      avgApUtilPct - avgApWorkPct - avgApRestPct - avgApHealthPct,
    );
    // 口径说明（重要，本项目已在"指标口径"上踩过两次坑，见报告第十/十四节）：
    //   · avgApUtilPct  = **存活期口径**（apBudget 只累计存活天数）→ 决策看这个
    //   · avgApSpentPerDayAmortized = **全期均摊口径**（总消耗摊到 daysPerTrial 天，
    //     早死局会把分母撑大、把数值拉低）→ 仅作参考，**不可与上面的百分比并列展示**
    var avgApSpentPerDayAmortized = sumOf("apSpent") / CONFIG.daysPerTrial;
    var avgWorksPerDay = sumOf("totalWorks") / CONFIG.daysPerTrial;
    // [口径修正 · 2026-09-16] 上面那个 `avgWorksPerDay` 是**全期均摊口径**，
    // 存活率一变它就被摊薄 —— 而 A/B 对照里存活率恰恰会变，于是它无法用来比较两组配置。
    // 这里补一个**存活期口径**的版本：总打工次数 / 总存活天数。比较配置必须看这个。
    // ★ 注意 `sumOf()` 返回的是**每局平均值**（内部除以了局数），不是总和。
    //   第一版直接 `sumOf("totalWorks") / aliveDaysSum` 就踩了坑：分子是"每局平均"、
    //   分母是"跨局总和" → 算出来 0.43 份/存活日（真值约 3.4），差了一个局数倍。
    //   必须先把分子还原成总和再除。
    var aliveDaysSum = results.reduce(function (s, r) {
      return s + (r.aliveDays || 0);
    }, 0);
    var avgWorksPerAliveDay =
      aliveDaysSum > 0
        ? (sumOf("totalWorks") * Math.max(1, n)) / aliveDaysSum
        : 0;
    // v3.3 差异化指标
    var avgMedical =
      alive.reduce(function (s, r) {
        return s + (r.medicalSpent || 0);
      }, 0) / Math.max(1, alive.length);
    var avgCrime =
      alive.reduce(function (s, r) {
        return s + (r.crimeAttempts || 0);
      }, 0) / Math.max(1, alive.length);
    var avgCrimeSucc =
      alive.reduce(function (s, r) {
        return s + (r.crimeSuccess || 0);
      }, 0) / Math.max(1, alive.length);
    var avgProperty =
      alive.reduce(function (s, r) {
        return s + (r.propertyCount || 0);
      }, 0) / Math.max(1, alive.length);
    var avgRent =
      alive.reduce(function (s, r) {
        return s + (r.totalRentEarned || 0);
      }, 0) / Math.max(1, alive.length);
    var avgStartupP =
      alive.reduce(function (s, r) {
        return s + (r.totalStartupProfit || 0);
      }, 0) / Math.max(1, alive.length);
    var avgSideHustle =
      alive.reduce(function (s, r) {
        return s + (r.sideHustleEarned || 0);
      }, 0) / Math.max(1, alive.length);
    var avgSkillUps =
      alive.reduce(function (s, r) {
        return s + (r.skillUps || 0);
      }, 0) / Math.max(1, alive.length);
    var startupFounders = alive.filter(function (r) {
      return r.startupFoundedDay > 0;
    });
    var avgStartupDay =
      startupFounders.length > 0
        ? startupFounders.reduce(function (s, r) {
            return s + r.startupFoundedDay;
          }, 0) / startupFounders.length
        : -1;
    var transitioned2 = alive.filter(function (r) {
      return r.phaseTransitionDay > 0;
    });
    var avgPhaseDay2 =
      transitioned2.length > 0
        ? transitioned2.reduce(function (s, r) {
            return s + r.phaseTransitionDay;
          }, 0) / transitioned2.length
        : -1;

    // Housing tier distribution
    var housingTiers = {};
    for (var hi3 = 0; hi3 < alive.length; hi3++) {
      var ht3 = alive[hi3].finalHousingTierMax || alive[hi3].finalHousingTier;
      housingTiers[ht3] = (housingTiers[ht3] || 0) + 1;
    }
    // Death cause breakdown
    var deathCauses = {};
    for (var di3 = 0; di3 < dead.length; di3++) {
      var cause3 = dead[di3].deathCause || "unknown";
      deathCauses[cause3] = (deathCauses[cause3] || 0) + 1;
    }
    var avgCr =
      results.reduce(function (s, r) {
        return s + (r.crossroadsTaken || 0);
      }, 0) / Math.max(1, n);

    return {
      strategy: name,
      trials: n,
      elapsed: elapsed,
      survivalRate: sr,
      victoryCount: victories.length,
      victoryRate: vr,
      avgVictoryDay: avgVictoryDay,
      victoryTitles: victoryTitles,
      died1_7: (d1 / n) * 100,
      died8_30: (d2 / n) * 100,
      died31_90: (d3 / n) * 100,
      died91plus: (d4 / n) * 100,
      avgDeathDay: add,
      deathCauses: deathCauses,
      avgCash: avgCash,
      medianCash: alive.length > 0 ? pct(ca, 50) : 0,
      p10Cash: alive.length > 0 ? pct(ca, 10) : 0,
      p90Cash: alive.length > 0 ? pct(ca, 90) : 0,
      minCash: alive.length > 0 ? ca[0] : 0,
      maxCash: alive.length > 0 ? ca[ca.length - 1] : 0,
      avgHealth: avgHe,
      avgIllness: avgIl,
      avgInjury: avgIn,
      avgHousing: avgHo,
      avgCrossroadsTaken: avgCr,
      housingTiersReached: housingTiers,
      avgFoodSpentTotal: avgFood,
      avgEventsTriggered: avgEvt,
      avgEventsUnique: avgEvtUnique,
      maxEventRepeat: maxEvtRepeat,
      maxEventRepeatId: maxEvtRepeatId,
      // [连携覆盖] 连携系统可达性
      avgPeakDual: avgPeakDual,
      avgPeakTriple: avgPeakTriple,
      avgPeakTheme: avgPeakTheme,
      avgSynergyDays: avgSynergyDays,
      avgPassiveDays: avgPassiveDays,
      avgPassiveTotal: avgPassiveTotal,
      maxSkillLv: maxSkillLv,
      avgSkillUps: avgSkillUps,
      // [资源利用率]
      avgApUtilPct: avgApUtilPct,
      avgApSpentPerDayAmortized: avgApSpentPerDayAmortized,
      avgWorksPerDay: avgWorksPerDay,
      // [AP 去向拆分 · 2026-09-16]
      avgApWorkPct: avgApWorkPct,
      avgApRestPct: avgApRestPct,
      avgApHealthPct: avgApHealthPct,
      avgApOtherPct: avgApOtherPct,
      avgWorksPerAliveDay: avgWorksPerAliveDay,
      // 注意分母是 `results.length`（全部局数）而不是 `alive.length` ——
      // 用 alive.length 的话，「全灭」的组会算出 0.0（看起来像没跑），实际是分母守卫用错了。
      avgAliveDays: results.length > 0 ? aliveDaysSum / results.length : 0,
      corpPhaseRate: (corp3 / Math.max(1, alive.length)) * 100,
      avgPhaseTransitionDay: isNaN(avgPhaseDay2) ? -1 : avgPhaseDay2,
      // v3.3 差异化指标
      avgMedicalSpent: avgMedical,
      avgCrimeAttempts: avgCrime,
      avgCrimeSuccess: avgCrimeSucc,
      avgPropertyCount: avgProperty,
      avgRentEarned: avgRent,
      avgStartupProfit: avgStartupP,
      avgSideHustleEarned: avgSideHustle,
      avgSkillUps: avgSkillUps,
      startupFounderRate:
        (startupFounders.length / Math.max(1, alive.length)) * 100,
      avgStartupFoundDay: avgStartupDay,
      economicLayers: {
        poor: poor,
        subsistence: sub,
        comfortable: com,
        rich: ric,
      },
      snapshots: snapData,
    };
  }

  function printReport(allStats) {
    var L = "=".repeat(72);
    var fmt = function (n) {
      return Math.round(n).toLocaleString();
    };
    var pc = function (n) {
      return n.toFixed(1);
    };

    console.log("\n" + L);
    console.log("  城市浮生记 v3.2 — 蒙特卡洛平衡测试报告");
    console.log(
      "  " + new Date().toISOString().replace("T", " ").substring(0, 19),
    );
    console.log(L);
    console.log(
      "  配置: " +
        allStats.length +
        " 策略 x " +
        CONFIG.trials +
        " 次 x " +
        CONFIG.daysPerTrial +
        " 天",
    );
    if (AB.length > 0) {
      // [deprecated-name · 2026-09-16 第十一轮] 转正后有两类"名存实亡"的开关名：
      //   · `real-job-cost` / `fix-startup-threshold` —— 转正前是"开启修复"，
      //     转正后修复已默认，这两个名字**变成空操作**。
      //   · 若调用方还按旧文档传它们，会看到"已关闭对应修复"的横幅，
      //     但**实际什么都没关** —— 是误导。这里显式报 deprecated 并给出新名。
      var AB_DEPRECATED = {
        "real-job-cost": "legacy-job-cost",
        "fix-startup-threshold": "legacy-startup-threshold",
      };
      var _deprecatedUsed = AB.filter(function (n) {
        return Object.prototype.hasOwnProperty.call(AB_DEPRECATED, n);
      });
      if (_deprecatedUsed.length > 0) {
        console.log("");
        console.log(
          "  ⛔ **已废弃的开关名**（转正后变成空操作，什么都关不掉）: " +
            _deprecatedUsed.join(", "),
        );
        _deprecatedUsed.forEach(function (n) {
          console.log(
            "     · `" + n + "` → 修复已转正为默认；要回切旧口径请用 `" +
              AB_DEPRECATED[n] + "`",
          );
        });
        console.log(
          "     （本次仍按**默认（修复后）口径**运行 —— 上面这条不改变任何行为）",
        );
      }
      var _legacyOnly = AB.every(function (n) {
        return n.indexOf("legacy-") === 0;
      });
      // [第十八轮] `exp-*` 三个选项**已从开关集中彻底移除**，这里不再需要
      //   单独的「已失效实验」横幅分支 —— 若有人仍传 `exp-*`，`abOn()` 只会
      //   得到一个「未知参数」提示，不会进入 A/B 归因分支。
      var _banner = _legacyOnly
        ? "🔁  旧口径对照模式: "
        : "⚠️  A/B 归因模式: ";
      var _note = _legacyOnly
        ? " —— 已**故意回切到已知错误的口径**，仅供对比，绝不能当基线"
        : " —— 已关闭对应修复，仅供归因对比，不可当作真实基线";
      console.log("  " + _banner + AB.join(",") + _note);
    }

    for (var si = 0; si < allStats.length; si++) {
      var s = allStats[si];
      console.log("\n" + "-".repeat(72));
      console.log(
        "  📊 策略: " +
          s.strategy +
          " (" +
          s.trials +
          " 次, " +
          s.elapsed +
          ")",
      );
      console.log("-".repeat(72));

      console.log("\n  📈 存活统计");
      console.log(
        "    存活率:      " +
          (s.survivalRate >= 80 ? "" : "⚠️ ") +
          pc(s.survivalRate) +
          "%" +
          (s.survivalRate >= 80 ? " ✅" : " ❌"),
      );
      // [通关统计 · 2026-09-15] 通关不再是「死亡」，单独列出，
      // 否则「44 天通关」会被误读成「44 天暴毙」。
      if (s.victoryCount > 0) {
        console.log(
          "    通关率:      " +
            pc(s.victoryRate) +
            "%  (" +
            s.victoryCount +
            "/" +
            s.trials +
            " 局)" +
            (s.avgVictoryDay > 0
              ? " · 平均第 " + s.avgVictoryDay.toFixed(0) + " 天"
              : ""),
        );
        var vtKeys = Object.keys(s.victoryTitles || {});
        for (var vk = 0; vk < vtKeys.length; vk++) {
          console.log(
            "      " + vtKeys[vk] + ": " + s.victoryTitles[vtKeys[vk]] + " 局",
          );
        }
      }
      console.log("    死亡分布:");
      console.log(
        "      Day 1-7:   " +
          (s.died1_7 >= 10 ? "⚠️ " : "   ") +
          pc(s.died1_7) +
          "%" +
          (s.died1_7 < 10 ? " ✅" : " ❌"),
      );
      console.log("      Day 8-30:  " + pc(s.died8_30) + "%");
      console.log("      Day 31-90: " + pc(s.died31_90) + "%");
      console.log("      Day 91+:   " + pc(s.died91plus) + "%");
      if (s.avgDeathDay > 0) {
        console.log("    死亡平均天数: " + s.avgDeathDay.toFixed(1) + " 天");
        // Death causes
        var causeKeys = Object.keys(s.deathCauses || {});
        if (causeKeys.length > 0) {
          console.log("    死亡原因:");
          for (var dc = 0; dc < causeKeys.length; dc++) {
            console.log(
              "      " + causeKeys[dc] + ": " + s.deathCauses[causeKeys[dc]],
            );
          }
        }
      }

      console.log("\n  🎴 命运抉择卡（v3.1 新机制）");
      console.log(
        "    平均结算张数: " + s.avgCrossroadsTaken.toFixed(1) + " 张 / 1000天",
      );

      console.log("\n  💰 经济统计（存活玩家）");
      console.log("    平均现金:    ¥" + fmt(s.avgCash));
      console.log("    中位现金:    ¥" + fmt(s.medianCash));
      console.log("    P10现金:     ¥" + fmt(s.p10Cash));
      console.log("    P90现金:     ¥" + fmt(s.p90Cash));
      console.log("    最小现金:    ¥" + fmt(s.minCash));
      console.log("    最大现金:    ¥" + fmt(s.maxCash));

      var tl =
        s.economicLayers.poor +
        s.economicLayers.subsistence +
        s.economicLayers.comfortable +
        s.economicLayers.rich;
      console.log("\n  🏠 经济分层（存活玩家）");
      console.log(
        "    赤贫(<¥500):    " +
          s.economicLayers.poor +
          " (" +
          ((s.economicLayers.poor / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    温饱(¥500~5k):  " +
          s.economicLayers.subsistence +
          " (" +
          ((s.economicLayers.subsistence / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    小康(¥5k~50k):  " +
          s.economicLayers.comfortable +
          " (" +
          ((s.economicLayers.comfortable / tl) * 100).toFixed(1) +
          "%)",
      );
      console.log(
        "    富裕(>¥50k):   " +
          s.economicLayers.rich +
          " (" +
          ((s.economicLayers.rich / tl) * 100).toFixed(1) +
          "%)",
      );

      console.log("\n  📅 里程碑现金中位数");
      [30, 90, 365].forEach(function (sd) {
        if (s.snapshots[sd]) {
          var sp = s.snapshots[sd];
          console.log(
            "    Day " +
              sd +
              ": ¥" +
              fmt(sp.median) +
              " [P25:¥" +
              fmt(sp.p25) +
              "  P75:¥" +
              fmt(sp.p75) +
              "] (n=" +
              sp.n +
              ")",
          );
        }
      });

      console.log("\n  🏥 健康统计（存活玩家）");
      console.log("    平均健康:    " + s.avgHealth.toFixed(1));
      console.log("    平均疾病次数: " + s.avgIllness.toFixed(1));
      console.log("    平均受伤次数: " + s.avgInjury.toFixed(1));

      // Housing tier distribution
      var htKeys = Object.keys(s.housingTiersReached || {}).sort();
      if (htKeys.length > 0) {
        var htStr = htKeys
          .map(function (k) {
            return "T" + k + ":" + s.housingTiersReached[k];
          })
          .join(" ");
        console.log("    住房等级分布: " + htStr);
      }
      console.log("    公司阶段转化率: " + s.corpPhaseRate.toFixed(1) + "%");
      if (s.avgPhaseTransitionDay > 0)
        console.log(
          "    平均转公司阶段天: " + s.avgPhaseTransitionDay.toFixed(0),
        );
      console.log("    总食品花费:   ¥" + fmt(s.avgFoodSpentTotal || 0));
      console.log(
        "    总事件触发:   " +
          (s.avgEventsTriggered || 0).toFixed(1) +
          "次（队列活动度）",
      );
      console.log(
        "    唯一事件数:   " + (s.avgEventsUnique || 0).toFixed(1) + "个（真实内容触达）",
      );
      // [连携覆盖] 连携系统可达性 —— 若全为 0，说明本策略根本没触达连携阈值，
      // 任何连携相关改动在本策略上都测不出差异（不要误读成"连携无价值"）。
      console.log(
        "    技能连携:     单局峰值均值 " +
          (s.avgPeakDual || 0).toFixed(1) +
          " DUAL / " +
          (s.avgPeakTriple || 0).toFixed(1) +
          " TRIPLE / " +
          (s.avgPeakTheme || 0).toFixed(1) +
          " THEME；激活天数 " +
          (s.avgSynergyDays || 0).toFixed(1) +
          " 天；最高技能 " +
          (s.maxSkillLv || 0) +
          " 级（技能点 " +
          (s.avgSkillUps || 0).toFixed(0) +
          "）",
      );
      console.log(
        "    连携被动收入: " +
          (s.avgPassiveDays || 0).toFixed(1) +
          " 天发放，累计 ¥" +
          (s.avgPassiveTotal || 0).toFixed(0),
      );
      // [资源利用率] 每日 AP 预算 100，用不掉的当日作废。
      // 若本行 < 100%，则「收益低」可能只是「AP 没用完」，不一定是策略弱。
      // 括号内刻意只用**存活期口径**（= 本行百分比），避免与全期均摊口径并列造成误读。
      // [AP 去向拆分 · 2026-09-16] 括号里再拆「工作 / 休息 / 其他」三去向。
      // 只看总数会误读：休息（12~15 AP/次）也计入利用率，于是可能出现
      // 「利用率上升但打工变少」（`fix-fatigue-rest` 的 A/B 正是如此）。
      // 打工份数同时给出**存活期口径**（份/存活日），比较两组配置只能看这个 ——
      // 另一个「份/日」是全期均摊口径，存活率一变就被摊薄。
      console.log(
        "    资源利用率:   AP " +
          (s.avgApUtilPct || 0).toFixed(1) +
          "%（" +
          Math.round(s.avgApUtilPct || 0) +
          "/100 每日，存活期口径）＝ 工作 " +
          (s.avgApWorkPct || 0).toFixed(1) +
          "% + 疲劳休息 " +
          (s.avgApRestPct || 0).toFixed(1) +
          "% + 低血就诊 " +
          (s.avgApHealthPct || 0).toFixed(1) +
          "% + 其他(学习/社交等) " +
          (s.avgApOtherPct || 0).toFixed(1) +
          "%",
      );
      console.log(
        "    打工强度:     " +
          (s.avgWorksPerAliveDay || 0).toFixed(2) +
          " 份/存活日（存活期口径，比较配置看这个）· 全期均摊 " +
          (s.avgWorksPerDay || 0).toFixed(2) +
          " 份/日 · 平均存活 " +
          (s.avgAliveDays || 0).toFixed(1) +
          " 天",
      );
      if (!CONFIG.answerEvents) {
        console.log(
          "    ⚠️ 未作答口径：唯一事件数远小于触发次数，且最高单事件重复 " +
            (s.maxEventRepeat || 0) +
            " 次（" +
            (s.maxEventRepeatId || "?") +
            "）—— 优先通道事件因触发条件不解除而重复入队。",
        );
        console.log(
          "       此口径下「总事件触发」只能当队列活动度，不代表内容触达；加 --answer-events 可测得真实触达。",
        );
      }

      // v3.3 差异化路径摘要（每个策略展示其独特路径指标）
      console.log("\n  🎯 路径特征（v3.3 策略分化）");
      if (s.strategy === "skiller") {
        console.log(
          "    平均犯罪尝试: " + s.avgCrimeAttempts.toFixed(1) + "次",
        );
        console.log("    平均犯罪成功: " + s.avgCrimeSuccess.toFixed(1) + "次");
      } else if (s.strategy === "trader") {
        console.log(
          "    平均房产数量: " + s.avgPropertyCount.toFixed(1) + "套",
        );
        console.log("    累计租金收入: ¥" + fmt(s.avgRentEarned));
      } else if (s.strategy === "crowner" || s.strategy === "corporate") {
        console.log(
          "    创业成功率:   " + s.startupFounderRate.toFixed(1) + "%",
        );
        console.log(
          "    平均创业天:   " +
            (s.avgStartupFoundDay > 0
              ? s.avgStartupFoundDay.toFixed(0)
              : "未创业"),
        );
        console.log("    累计创业收益: ¥" + fmt(s.avgStartupProfit));
      } else if (s.strategy === "social") {
        console.log("    累计副业收入: ¥" + fmt(s.avgSideHustleEarned));
      } else if (s.strategy === "grinder") {
        console.log("    累计医疗支出: ¥" + fmt(s.avgMedicalSpent));
      }
    }

    if (allStats.length > 1) {
      console.log("\n" + L);
      console.log("  📋 策略对比摘要（v3.3 分化）");
      console.log(L);
      var hdr = ["策略", "存活率", "中位现金", "AP利用率", "工作", "回血", "打工/存活日", "特征指标"];
      console.log("  " + hdr.join("\t"));
      for (var si2 = 0; si2 < allStats.length; si2++) {
        var s2 = allStats[si2];
        var feature = "";
        if (s2.strategy === "skiller")
          feature = "犯罪" + s2.avgCrimeSuccess.toFixed(0) + "次";
        else if (s2.strategy === "trader")
          feature =
            "房产" +
            s2.avgPropertyCount.toFixed(1) +
            "套/租¥" +
            fmt(s2.avgRentEarned);
        else if (s2.strategy === "social")
          feature = "副业¥" + fmt(s2.avgSideHustleEarned);
        else if (s2.strategy === "grinder") feature = "住房T1/低消费";
        else if (s2.strategy === "corporate" || s2.strategy === "crowner")
          feature = "创业" + s2.startupFounderRate.toFixed(0) + "%";
        else if (s2.strategy === "specialist")
          feature =
            "技能" +
            (s2.maxSkillLv || 0) +
            "级/" +
            (s2.avgPeakTriple || 0).toFixed(0) +
            "TRIPLE/被动¥" +
            fmt(s2.avgPassiveTotal);
        else feature = "均衡";
        console.log(
          "  " +
            [
              s2.strategy,
              pc(s2.survivalRate) + "%",
              "¥" + fmt(s2.medianCash),
              (s2.avgApUtilPct || 0).toFixed(0) + "%",
              // [AP 去向拆分] 只有「工作」那半是真产出。
              // 「低血就诊」列是关键：它高说明这条策略在濒死急救，不是在用满资源 ——
              // grinder 的 85% 利用率里约 35% 是这个（round 7 曾误读成"它用满了资源"）。
              (s2.avgApWorkPct || 0).toFixed(0) + "%",
              (s2.avgApHealthPct || 0).toFixed(0) + "%",
              (s2.avgWorksPerAliveDay || 0).toFixed(2),
              feature,
            ].join("\t"),
        );
      }
    }

    console.log("\n" + L);
    console.log("  ✅ 判定");
    console.log(L);
    var passed = true;
    var HIGH_RISK = { grinder: true, skiller: true };
    // [门禁更新 · 2026-09-16] 低血分支转正后，存活率 **7/7 都 ≈100%**（实测均值 99.4%），
    // 已**不再是区分指标** —— 它现在只当**回归绊线**用（掉下来就说明有东西坏了），
    // 策略差异要看下面两条新增断言：
    //   ① **工作 AP 占比** —— 唯一有产出的桶。偏低 = 把预算烧在非产出动作上
    //      （这正是本轮修掉的那个缺陷形态）。基准 t24：40%~69%（最低 specialist，它把
    //      35% 花在学习上，属合理），故下限取 **25%**。
    //   ② **低血就诊 AP 占比** —— 偏高 = 回到"濒死空转"。基准 t24：0%~2%，
    //      而缺陷态（legacy）是 4%~35%、均值 12.3%，故上限取 **10%**。
    // 阈值是**绊线不是质量线**：留了足够余量，只在结构性回归时才响。
    // ★ 反向对照（证明断言不恒真，3 局 ×60 天）：
    //   `CLS_AB=legacy-health-branch` 下 ② 准确报红 4 条 ——
    //   grinder 39.5% / trader 29.1% / social 18.5% / corporate 25.0%。
    //   ⚠️ ① 至今**在任何已测配置下都未触发过**（缺陷态最低的工作占比仍是 social 36.1%）——
    //   它是防"AP 全烧在非产出动作上"这类灾难性回归的兜底，不是常用判据。
    var WORK_AP_FLOOR = 25;
    var HEALTH_AP_CEIL = 10;
    for (var si3 = 0; si3 < allStats.length; si3++) {
      var s3 = allStats[si3],
        sn = s3.strategy,
        threshold = HIGH_RISK[sn] ? 30 : 80;
      if (s3.survivalRate < threshold) {
        console.log(
          "  ❌ [" +
            sn +
            "] 存活率 " +
            pc(s3.survivalRate) +
            "% < " +
            threshold +
            "%",
        );
        passed = false;
      } else if (HIGH_RISK[sn]) {
        console.log(
          "  ✅ [" +
            sn +
            "] 存活率 " +
            pc(s3.survivalRate) +
            "% ≥ " +
            threshold +
            "%（高风险路径·回归绊线）",
        );
      } else {
        console.log(
          "  ✅ [" +
            sn +
            "] 存活率 " +
            pc(s3.survivalRate) +
            "% ≥ 80%（回归绊线）",
        );
      }
      // ① 工作 AP 占比（唯一有产出的桶）
      if ((s3.avgApWorkPct || 0) < WORK_AP_FLOOR) {
        console.log(
          "  ❌ [" +
            sn +
            "] 工作 AP 占比 " +
            (s3.avgApWorkPct || 0).toFixed(1) +
            "% < " +
            WORK_AP_FLOOR +
            "%（预算烧在非产出动作上）",
        );
        passed = false;
      } else {
        console.log(
          "  ✅ [" +
            sn +
            "] 工作 AP 占比 " +
            (s3.avgApWorkPct || 0).toFixed(1) +
            "% ≥ " +
            WORK_AP_FLOOR +
            "%",
        );
      }
      // ② 低血就诊 AP 占比（回到"濒死空转"的回归网）
      if ((s3.avgApHealthPct || 0) > HEALTH_AP_CEIL) {
        console.log(
          "  ❌ [" +
            sn +
            "] 低血就诊占比 " +
            (s3.avgApHealthPct || 0).toFixed(1) +
            "% > " +
            HEALTH_AP_CEIL +
            "%（疑似回到濒死空转）",
        );
        passed = false;
      } else {
        console.log(
          "  ✅ [" +
            sn +
            "] 低血就诊占比 " +
            (s3.avgApHealthPct || 0).toFixed(1) +
            "% ≤ " +
            HEALTH_AP_CEIL +
            "%",
        );
      }
      if (s3.died1_7 >= 10) {
        console.log(
          "  ❌ [" + sn + "] 前7天死亡率 " + pc(s3.died1_7) + "% ≥ 10%",
        );
        passed = false;
      } else {
        console.log(
          "  ✅ [" + sn + "] 前7天死亡率 " + pc(s3.died1_7) + "% < 10%",
        );
      }
      if (s3.snapshots[30]) {
        var m30 = s3.snapshots[30].median;
        if (m30 < 500 || m30 > 20000) {
          console.log(
            "  ⚠️  [" + sn + "] Day30 ¥" + fmt(m30) + " 偏离 [¥500~¥20000]",
          );
        } else {
          console.log("  ✅ [" + sn + "] Day30 ¥" + fmt(m30) + " 合理");
        }
      }
    }
    console.log(
      "\n  " +
        (passed ? "🎉 总体通过" : "🔧 需要调整") +
        ": " +
        (passed ? "all pass" : "fix needed"),
    );
    console.log(L + "\n");
  }

  function outputToFile(allStats) {
    if (!CONFIG.outputFile) return;
    fs.writeFileSync(
      CONFIG.outputFile,
      JSON.stringify(
        {
          config: CONFIG,
          timestamp: new Date().toISOString(),
          results: allStats,
        },
        null,
        2,
      ),
      "utf8",
    );
    console.log("  📝 保存: " + CONFIG.outputFile);
  }

  function main() {
    parseArgs();
    console.log("\n🧪 城市浮生记 v3.1 — 蒙特卡洛平衡测试\n   加载游戏引擎...");
    var t0 = Date.now();

    try {
      runner = require("./headless_runner.cjs");
    } catch (e) {
      console.error("  ❌ " + e.message);
      process.exit(1);
    }
    var ok = runner.init({ strict: false });
    if (!ok) {
      console.error("  ❌ init 失败");
      process.exit(1);
    }

    console.log(
      "   加载: " +
        (Date.now() - t0) +
        "ms, 错误: " +
        runner.getLoadErrors().length,
    );
    console.log(
      "   引擎: JOBS=" +
        (typeof STREET_JOBS !== "undefined" ? STREET_JOBS.length : "?") +
        " LOCS=" +
        (typeof LOCATIONS !== "undefined"
          ? Object.keys(LOCATIONS).length
          : "?") +
        " NPCs=" +
        (typeof NPCS !== "undefined" ? NPCS.length : "?"),
    );

    var bs = runner.createState({ seed: CONFIG.seed, scenario: "classic" });
    if (!bs) {
      process.exit(1);
    }
    console.log("   初始: ¥" + bs.resources.cash + " 健康:" + bs.status.health);

    var strategies =
      CONFIG.strategy === "all"
        ? [
            "balanced",
            "grinder",
            "skiller",
            "trader",
            "social",
            "corporate",
            "specialist",
          ]
        : [CONFIG.strategy];
    var allStats = [];
    for (var i = 0; i < strategies.length; i++) {
      var stats = runStrategy(strategies[i], bs);
      if (stats) allStats.push(stats);
    }
    printReport(allStats);
    outputToFile(allStats);
    console.log("   总耗时: " + ((Date.now() - t0) / 1000).toFixed(1) + " 秒");
  }

  if (typeof require !== "undefined" && require.main === module) {
    main();
  }
})();
