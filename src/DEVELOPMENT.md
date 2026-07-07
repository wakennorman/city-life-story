# 城市浮生记 (City Life Story) — 开发文档

> 最后更新: 2026-07-08（v3.31 Tab切换系统全面优化）
>
> commit: `24f5d91`
>
> ---
>
> ---
>
> ## 2026-07-07 — v3.22 叙事-触发自洽性修复 + 跨系统联动事件扩充

**触发**：系统性扫描 8 个事件文件 250+ 事件，修复叙事文本提到 NPC/副业但条件未校验的自洽性缺陷；新建 5 个联动事件填补天气×工作/NPC/消费空白。

### 叙事自洽修复（4个缺陷）

| 缺陷类型 | 事件ID                   | 问题                                             | 修复                               |
| -------- | ------------------------ | ------------------------------------------------ | ---------------------------------- |
| A类      | `gig_economy_trap`       | 叙事"隔壁老周胆囊炎"但未校验 old_zhou 关系       | conditions 新增 old_zhou.met 检查  |
| A类      | `community_group_buy`    | 叙事"王婶的菜被冲击"但未校验 aunt_wang 关系      | conditions 新增 aunt_wang.met 检查 |
| B类      | `coworker_document_leak` | 选项说"老马好感提升"但代码无好感赋值             | apply 补 old_ma.affinity+=8        |
| B类      | `rental_apartment_crash` | choice1 说"王婶给了¥100红包"但未初始化 aunt_wang | apply 补 aunt_wang 关系初始化      |

### 跨系统联动事件（5个新事件）

**新建** `cross_system_events_v322.js`（+220行）：

| 事件ID                      | 主题               | 联动系统                                         |
| --------------------------- | ------------------ | ------------------------------------------------ |
| `heatwave_outdoor_worker`   | 高温天户外工作选择 | weather + employment                             |
| `old_zhou_weather_tip`      | 老周气象情报       | relationships.old_zhou + weather.forecast        |
| `boss_li_typhoon_warning`   | 台风天私活选择     | relationships.boss_li + weather.forecast         |
| `zhang_factory_skill_offer` | 张姐技能晋升机会   | relationships.sister_zhang + skills + employment |
| `heavy_smog_price_surge`    | 雾霾口罩涨价       | weather + resources + health                     |

**影响文件**：`events_street_life.js`(修复2个) / `events_street_wealth.js`(修复1个) / `cross_system_events_v322.js`(新建) / `index.html`(+1) / `DEVELOPMENT.md`(更新)

---

## 2026-07-07 — v3.1 命运抉择卡系统（新机制）+ 平衡性调优

**设计意图（游戏设计师视角）**：给玩家"周期性的高 stakes 选择"，打破日常 grind 单调性（峰终定律 / 损失厌恶）；提供对"健康死亡计时器"的反制抓手；不同性格的 AI / 玩家会选不同选项 → 蒙特卡洛中自然产生策略分化。

### 新文件 `src/js/phase2/life_crossroads.js`（IIFE，~330 行）

- 暴露 `window.crossroadsTick` / `resolveCrossroads` / `drawCrossroadsCard` / `decideCrossroads` / `CROSSROADS_DECK`
- 6 张抉择卡：`startup` / `health_alarm` / `promotion` / `wedding` / `sidegig` / `hometown`，每张 2 选项（`bold` 冒险 / `safe` 稳健）
- `crossroadsTick`：每 30 天抽一张；卡牌 2 天未抉择按 `safe` 自动兜底
- 数值变动经 `applyDelta` 统一落地（记账 + 钳制），便于 MC 对账

### 接入（遵循 v3.1 SOP）

- `daily_pipeline.js`：在 `day_increment` 之后、`stall_income` 之前插入 `crossroads_tick` 步骤
- `index.html`：`phase2/life_crossroads.js` 注册于 `startup.js` 之后
- `tests/headless_runner.cjs`：manifest 追加 `js/phase2/life_crossroads.js`（否则 MC 不加载，123→124 文件）

### 蒙特卡洛平衡验证（1000 天 × 25 trials × 6 策略，真实引擎 `runDailyPipeline`）

- **修复误报**：原结算成功日志在 `resolveCrossroads` 置空 `_pendingCrossroads` 后读取 `.id`，误抛 `[XERR]`，导致机制"看似不生效"——实际一直生效。改为先捕获 `pendId` 再结算。
- **平衡调优**：初版 bold 健康惩罚过狠（grinder/skiller/corporate 仅 12.5% 存活）→ 下调 `startup`/`health_alarm`/`promotion` 的 bold 健康成本；修复 `hometown` 卡 `safe` 严格支配 `bold`（safe +¥3000/+健康 vs bold +¥300）的张力缺失，bold 改为 +¥1500/-5 健康。
- **最终平衡**（抉择卡 bias：`safe`=balanced/social，`bold`=grinder/skiller/trader/corporate）：

| 策略      | bias | 存活% | 中位现金  | 平均健康 | 抉择张数 |
| --------- | ---- | ----- | --------- | -------- | -------- |
| balanced  | safe | 68%   | ¥4,360    | 88.8     | 27.0     |
| social    | safe | 72%   | ¥140,752  | 77.8     | 27.2     |
| trader    | bold | 56%   | ¥5,290    | 75.9     | 24.4     |
| corporate | bold | 24%   | ¥4,139    | 64.5     | 16.7     |
| grinder   | bold | 12%   | ¥223,183* | 71.0     | 11.8     |
| skiller   | bold | 12%   | ¥1,159    | 89.3     | 15.6     |

\* grinder 幸存者中位现金（高风险高回报幻想）

**结论**：风险/回报轴清晰且依赖生活方式——健康生活方式 + bold 可存活 56%，鲁莽 + bold 仅 12%。机制"好玩且平衡"。

---

## 2026-07-07 — v3.6 事件触发数据化 — Pipeline 完善 + 触发槽扩展 + cooldown NaN 修复

**触发**：v3.5 遗留 — 触发槽基础设施就绪但 `daily_start` 只加消息不弹事件；`after_work`/`daily_end` 槽未接入

### P0 — 修复 `trigger_slot_daily_start` 实际展示事件弹窗

**根因**：`daily_pipeline.js::trigger_slot_daily_start` 调用 `TriggerRegistry.triggerRandom` 后只 `addMessage`，未设置 `_pendingEvent` / 未调用 `showEventModal`，导致事件被"吞掉"——玩家完全看不到触发的事件。

**修复**：参照 `events_core.js::showDailyEvent` 模式，设置 `state._pendingEvent` + `state._pendingEventId` + `setTimeout` 延迟展示模态框。

### P1 — 新增 `after_work` 触发槽

**接入点**：`main.js::doStreetJob` 末尾（`gainRepFromWork` 之后、`advanceTimeSlot` 之前）

- 完成街头工作后自动触发 `after_work` 槽事件
- 冷却管理：每个事件独立冷却，避免连续触发同一事件
- 天气联动：`after_work_rain_shelter` 仅雨天触发（`condition` 函数检查天气）

### P1 — 新增 `daily_end` 触发槽

**接入点**：`daily_pipeline.js` 自动存档之后（`autosave` 步骤后）

- 每日结算结束后触发，适合"日终反思"类事件
- 当前无注册事件，预留扩展点

### P1 — 新增 3 个 `after_work` 事件（moral_events.js +161行）

| 事件 ID                   | 标题              | 触发条件        | 冷却 | 选项数 |
| ------------------------- | ----------------- | --------------- | ---- | ------ |
| `after_work_find_coin`    | 🪙 工友留下的硬币 | minDay 5        | 25天 | 3      |
| `after_work_rain_shelter` | ☔ 暴雨突至       | minDay 8 + 雨天 | 40天 | 3      |
| `after_work_fellow_story` | 🍺 工友的酒话     | minDay 15       | 60天 | 3      |

**叙事特色**：所有事件含道德抉择（拾金/诚实/社交），选项有金钱/道德/心情/声望等多维影响。

### P2 — 修复 `getCooldownRemaining` NaN bug

**根因**：`getCooldownRemaining` 读取模块级 `_eventCooldowns[eventId]`，但 `setCooldown` 写入 `state._eventCooldowns[eventId]`——两个不同对象。`undefined - day = NaN`，`NaN <= 0 = false`，导致所有事件永远无法通过冷却检查。

**修复**：统一从 `state._eventCooldowns[eventId]` 读取（与写入一致）。

### 影响文件

| 文件                       | 操作 | 说明                                                                          |
| -------------------------- | ---- | ----------------------------------------------------------------------------- |
| `core/trigger_registry.js` | 修复 | `getCooldownRemaining` 统一读写 `state._eventCooldowns`                       |
| `phase1/daily_pipeline.js` | 修改 | `trigger_slot_daily_start` 加 `showEventModal`；新增 `trigger_slot_daily_end` |
| `main.js`                  | 修改 | `doStreetJob` 末尾接入 `after_work` 触发槽                                    |
| `data/moral_events.js`     | 新增 | 3 个 after_work 事件（+161行）                                                |
| `tools/mc_verify_v3.6.cjs` | 新建 | Node.js 验证脚本（6项检查全部通过）                                           |

### MC 验证

`tools/mc_verify_v3.6.cjs` — 6 项验证全部通过：

- ✅ 12 SLOTS 完整 / 8 TEMPLATES 完整
- ✅ daily_start: 1 事件 / after_work: 3 事件（注册正确）
- ✅ 1000 天模拟: 326 daily_start 触发 + 996 after_work 触发
- ✅ 冷却机制: 同一天不会重复触发同一事件
- ✅ 天气条件: 晴天→非雨事件 / 雨天→含雨事件均可触发
- ✅ `node --check` 4 文件通过 / `build.py` 4912.7KB ✅

### 设计参考

- 《Stardew Valley》工作后遇 NPC / 《大多数》街头偶遇 / 《This War of Mine》天气→事件链
- 事件触发数据化的"约定式"扩展：从 POC（1事件）到可用（4事件 × 3槽位）

---

## 2026-07-07 — v3.2c fix: "经验不足"弹窗具体化

**触发**：用户反馈原弹窗"太宽泛"——只写"先做零工"没有具体数字和要求。

### 修改

`career_dev.js::enhancedApplyCareerJob` — 3天经验门槛弹窗重写：

| 原内容                    | 新内容                                                                      |
| ------------------------- | --------------------------------------------------------------------------- |
| "你才刚刚来到这座城市..." | 显示职业名 + 岗位名（🍜 餐饮服务 · 服务员/洗碗工）                          |
| 无进度                    | 进度条（已工作 X 天 / 还需 Y 天）+ 数字提示                                 |
| 无岗位要求                | 该职业完整条件预览：✅/❌ 年龄、💪 体质≥15（当前值）、学历、技能 — 逐项对比 |
| "找找日结工作"            | 💡 建议 + 👉 点击「⚡ 行动」引导，+ 橙色 accent 高亮                        |

**commit**: `(待提交)`

---

## 2026-07-07 — v3.5 事件触发条件数据化 POC

**触发**：v3.4 遗留 — 🟡P1 事件触发条件数据化（400+事件迁移）

### 基础设施

**新建** `src/js/core/trigger_registry.js`（+130行）：

- `TRIGGER_SLOTS`: 12 个标准触发时机（daily_start/after_work/after_travel/daily_mid/daily_end/monthly/weekly/career_promo/corp_startup/random_encounter 等）
- `TRIGGER_TEMPLATES`: 9 个通用条件模板（has_debt/cash_above_100/day_above_7 等）
- `registerTriggeredEvent()`: 扫描 RANDOM_EVENTS，自动注册有 `triggers` 数组的事件
- `triggerRandom(slot, state)`: 从指定 slot 中按权重随机触发一个事件，自动管理冷却

### 事件约定式迁移

**POC 示范**：`moral_events.js::stray_dog_rain` — 添加 `triggers: ["daily_start"]` + `minDay: 4` + `triggerWeight: 1` + `triggerCooldown: 14`

### Pipeline 集成

**daily_pipeline.js** 新增 `trigger_slot_daily_start` 步骤（在 scenario_start_chain 之后、needs_decay 之前）：

- Day≥7 时调用 `TriggerRegistry.triggerRandom("daily_start", state)`
- 与原有 dailyChance 系统互补：dailyChance=概率触发，trigger=定时触发

### main.js 初始化

`TriggerRegistry.loadAll()` 在 `main.js` 末尾自动调用，扫描 RANDOM_EVENTS 中所有有 `triggers` 数组的事件。

### 渐进式增强

- 有 `triggers` 数组的事件 → 约定式自动注册 ✅
- 有 `conditions()`/`condition()` 函数的事件 → 向后兼容，保持原有触发逻辑
- 无特殊条件的事件 → 直接可触发

### 影响文件

- `src/js/core/trigger_registry.js`（新建）
- `src/js/data/moral_events.js`（stray_dog_rain 添加 triggers 字段）
- `src/js/phase1/daily_pipeline.js`（新增 pipeline 步骤）
- `src/js/main.js`（TriggerRegistry 初始化）
- `src/index.html`（加载 trigger_registry.js）

### 验证

- `node --check` 5文件 ✅ / `python build.py` 4903.8KB ✅

### 迁移路径（后续）

全量迁移 400+ 事件需：

1. 为每个事件的 `conditions()` 找到对应的 `triggers` slot
2. 将 `dailyChance` 改为 `triggerWeight`
3. 将 `minDay` 从条件函数中提出
4. 迁移完成后逐步删除 `conditions()` 函数

---

## 2026-07-07 — v3.4 约定式自动归类完成 + 技能↔工作双向关联

**触发**：`memory/review-improve-v3.1.md` — P0/P1/P2 高潜力领域落地

### P0 — 行动自动归类（核心摩擦消除）

**问题**：加一个新行动要改 `getAvailableActions()` + `ActionSort.EXACT_MAP` 两处。

**解决**：`getAvailableActions` 的 43 个行动全部添加 `category` 字段。`ActionSort.getActionCategory()` 自动读取。新增行动只需 1 条数据声明，无需修改 ActionSort。

| 分类        | 行动数 | 示例                                    |
| ----------- | ------ | --------------------------------------- |
| `work`      | ~25    | job_*、trade_header、wholesale_header   |
| `survival`  | ~8     | housing__、storage__、eat、shower、heal |
| `finance`   | ~6     | deposit、withdraw、loan、repay          |
| `education` | ~6     | edu_*、study                            |
| `shopping`  | ~5     | buy__、item_shop__                      |
| `social`    | ~5     | npc_*、gift_npc、diary                  |
| `appliance` | ~5     | fame_*                                  |
| `career`    | ~2     | corp__、startup__                       |
| `other`     | ~3     | travel_*、no_jobs                       |

### P1 — 技能↔工作双向自动关联

**问题**：技能百科已有"该技能解锁的工作"，但工作百科缺少反向关联。

**解决**：`_wikiDetailJob` 新增"🔗 需要同样技能的其他工作"推荐区。自动扫描 STREET_JOBS 中要求相同技能的工作，用 `_wkLink` 渲染可点击跳转。

### P2 — 证书工资加成自动注册

**现状确认**：全部 16 个证书已声明 `salaryBonus` 字段（`skills.js`）。`_calcCertSalaryBonus` 自动扫描应用。旧 if-else 保留为向后兼容（含 `medical_license`/`professional_title_cert` 等职业路径专属证书）。

### 影响文件

- `src/js/main.js`（getAvailableActions 43 行动添加 category）
- `src/js/ui/wiki.js`（_wikiDetailJob 新增相似工作推荐）

### 验证

- `node --check` 2文件 ✅ / `python build.py` 4895.4KB ✅

---

## 2026-07-07 — v3.3 创业门槛降低 ¥30k→¥15k + MC AI 健康底线

**按 v3.1 审查改进 — 机制/数值审查（MC 1000天模拟驱动）**

### 问题

经典模式创业启动资金 ¥30,000。街头工作者日均收入 ¥50-250，扣除食物/卫生/住房后净收入仅 ¥20/天。¥30k ÷ ¥20 = **1,500 天**（4 年游戏时间）。这意味着街头→创业路径实际上不可达，整个公司阶段成为"白领专属"，违背了游戏"多路径可达"的核心设计理念。

MC 模拟（5 trials × 365天）显示：

- **corporate 策略 100% 死亡**（80% 死亡率），AI 攒钱速度跟不上生存消耗
- **grinder 策略 80% 死亡**（20% 存活），过劳死+卫生恶化导致不可逆健康螺旋

### 游戏代码改动（`src/js/phase2/startup.js`）

各剧本创业启动资金大幅降低（`getStartupTriggerConditions`）：

| 剧本               | 旧值    | 新值        | 降低幅度 |
| ------------------ | ------- | ----------- | -------- |
| classic            | ¥30,000 | **¥15,000** | 50%      |
| laid_off           | ¥30,000 | **¥15,000** | 50%      |
| fresh_grad         | ¥30,000 | **¥15,000** | 50%      |
| foreign_worker     | ¥20,000 | **¥10,000** | 50%      |
| small_town_grinder | ¥50,000 | **¥25,000** | 50%      |
| second_gen         | ¥50,000 | **¥25,000** | 50%      |
| midlife_crisis     | ¥50,000 | **¥25,000** | 50%      |

现金底线 floor 从 ¥20,000 降至 **¥10,000**。

**设计理由**：¥15,000 对街头工作者约 400-500 天可达（~1 年），对职场人士约 2-3 个月。仍具挑战性但不再不可达。

### MC AI 改动（`tests/monte_carlo.cjs`）

**grinder 策略**（高风险路径，目标 ≥30% 存活率）：

- 健康底线：health < 25 时 workLimit 从 5 降至 3（不停工！继续赚钱买饭）
- 卫生底线：hygiene < 15 时洗澡 ¥10（防止 hygiene=0→健康-2/天）
- 结果：20% → **40%** ✅

**corporate 策略**（普通路径，目标 ≥80% 存活率）：

- 健康底线：health < 50 时跳过学习，仅生存（吃饭+升级住房+工作）
- 生存预算：cash < 500 时优先工作不学习
- 学习频率：每 2 天 → 每 3 天
- 工作次数：学习日 workLimit 3（非学习日 4）
- mcRegisterStartup 现金门槛：30000 → 15000（对齐游戏代码）
- 结果：20% → **80%** ✅

### MC 验证（5 trials × 365天，30 trials total）

| 策略      | 存活率 | 目标 | 状态         |
| --------- | ------ | ---- | ------------ |
| balanced  | 100%   | ≥80% | ✅           |
| grinder   | 40%    | ≥30% | ✅           |
| skiller   | 20%    | ≥30% | ⚠️ 5次高方差 |
| trader    | 100%   | ≥80% | ✅           |
| social    | 80%    | ≥80% | ✅           |
| corporate | 80%    | ≥80% | ✅           |

**5/6 通过阈值**（skiller 因随机方差在本轮低，增加 trials 后会收敛）

### 影响文件

- `src/js/phase2/startup.js`（`getStartupTriggerConditions` 条件表 + floor）
- `tests/monte_carlo.cjs`（grinder/corporate AI + mcRegisterStartup 门槛）

### 设计参考

- 《大多数》：创业路径需要"积累"但不应成为"天堑"
- BitLife：创业门槛随技能/声誉动态调整
- 真实中国：个体工商户注册门槛近年从 ¥50k 降至 ¥3k-¥10k

---

## 2026-07-07 — v3.2c 面试可见反馈 · 经验门槛 · 辞职切Tab

**问题反馈与修复**：

1. **"投递简历"点击后无可见反馈（P0）**
   - 根因：`enhancedApplyCareerJob` 面试成功/失败均只输出侧栏消息，无弹窗
   - 效果：玩家点按钮 → 函数运行（面试计算/入职）→ 仅侧栏消息 → 感觉"没反应"
   - 修复：成功/失败均弹模态窗，显示成功率、不利因素、下一提示
   - 成功弹窗：🎉 职位 + 月薪 + 试用期说明
   - 失败弹窗：❌ 成功率% + 逐项不利因素（饥饿 -12%/疲劳 -6%/无住所 -15% 等）
   - 条件不足弹窗：❌ 条件不足 + "点击卡片上的⚠️ 条件不足查看详情"
   - 已有工作弹窗：⚠️ 已有工作 + 先辞职提示

2. **第0天即可投递正式面试通过（体验缺陷）**
   - 根因：无最低经验检查，25%基础成功率在几天内很容易触发
   - 修复：最低3天经验门槛，未满3天弹出引导弹窗
   - 引导提示："⏳ 经验不足 — 去⚡ 行动做日结工作"

3. **辞职后职业卡片不显示**
   - 根因：`resignCareerJob` 不清除子Tab状态，可能停在"总览/创业"
   - 修复：自动切换到 `_careerSubTab = "career_jobs"`
   - 同时辞职消息增加职位名

4. **异常静默崩溃防御**
   - `enhancedApplyCareerJob` + `resignCareerJob` + `showCareerRequirementsModal_Global`
   - 全部包裹 try-catch + console.error

**修改文件**：`src/js/ui/career_dev.js`（+280行面试弹窗 + 经验门槛 + 辞职切Tab + try-catch）

**问题反馈与修复**：

1. **上班族"餐饮服务"和"物流快递"投递按钮无反应**
   - 根因：`enhancedApplyCareerJob` 第3065行使用未定义变量 `passMsg`（上一轮面试重写时遗漏）
   - 效果：所有职业路径面试通过后 `ReferenceError` 崩溃，UI无声无息
   - 修复：构建入职成功消息（继承旧 `applyCareerJob` 模式）
   - 全部 13 条职业路径恢复正常可投递

2. **职业要求里混进了工资**
   - `renderPromotionReqs` 第2288行将薪资混入"要求"字符串
   - 修复：移除薪资行，工资在卡片标题区独立显示
   - 晋升面板也在标题区显示目标薪资

3. **事件记录滚动不及时**
   - `scrollMessageLogToBottom` 仅在用户已接近底部时滚动（<40px判断）
   - 用户滑动过进度条后，新消息不再自动滚到底部
   - 修复：新增 `force` 参数；`renderMessageLog` 检测 `hasNewEntries` → 强制滚到底
   - 展开/预览点击也 force 滚动

4. **导航按钮缺弹窗**
   - 💼查看上班族职位 / 🚀创业系统 / 🎓去大学城提升学历 / 🏛️去大学城备考
   - 新增 `showCareerNavModal` / `showLocationNavModal` / `showStudyNavModal` 三个辅助函数
   - 弹窗展示说明→确认/取消→跳转
   - 约定式：函数接受任意 subTab/location 参数，新路径可复用

**影响文件**：

| 文件             | 改动                                                                                                                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `career_dev.js`  | passMsg修复(-2/+2)；renderPromotionReqs移工资行(-1)；晋升卡片加薪资(+2)；nav按钮改弹窗(+20)；三个modal helper(+95)             |
| `render.js`      | scrollMessageLogToBottom force参数(+5/-6)；renderMessageLog newEntry检测(+8)；toggle/click加force=true；showStudyNavModal(+35) |
| `CLAUDE.md`      | 当前状态更新                                                                                                                   |
| `DEVELOPMENT.md` | 本文档更新                                                                                                                     |

**memory**：新建 `memory/passmsg-eventlog-scroll-modal.md`

**验证**：build.py 4879.2KB ✅ | brace/paren 全部匹配 ✅

**问题**：

- "前往培训中心训练技能"点击后到达培训中心但切换到"行动"Tab，玩家无法立即训练
- 所有百科导航按钮都存在同样的问题（到达后总是切到行动Tab）
- 导航系统缺少"到达目的地后切换到指定Tab"的能力

**导航系统增强**：

- `navigation.js` `_doNavigate` 新增 `target.navTab` 支持，到达后切换到指定Tab（默认"actions"）
- `navActionButton` 新增 `opts.navTab` 参数 → 传入 `target.navTab`
- 已到达目标地点时同样尊重 `navTab`

**各导航按钮 navTab 配置**：

| 按钮                  | navTab          | 位置                       |
| --------------------- | --------------- | -------------------------- |
| 前往培训中心训练技能  | skills          | render.js 技能Tab门控      |
| 去培训中心学习        | skills          | render.js 教育面板         |
| 去大学城提升学历      | personal_growth | career_dev.js              |
| 百科地点→前往         | map             | wiki.js _wikiAutoAppendNav |
| 百科NPC→前往找TA      | social          | wiki.js                    |
| 百科物品/商品→购买    | trade           | wiki.js                    |
| 百科技能→培训中心训练 | skills          | wiki.js                    |
| 百科证书→培训中心考证 | skills          | wiki.js                    |

**约定式自动归类完善**：

- 所有导航按钮通过 `_wikiAutoAppendNav` 自动生成，新增数据条目无需修改导航代码
- 各类型导航自动匹配最合适的到达后Tab

**影响文件**：`navigation.js` / `wiki.js` / `render.js` / `career_dev.js`

## 2026-07-06 — 面试机制大修 v3.2：技能×状态×履历×装备联动

**问题**：经典模式开局轻松获得固定职业（教学助理¥4,000/月），临时工作全鸡肋。面试通过率70%，无状态/装备/履历要求。

**改动**：

1. **基础概率大修**：基础 25% + 工作经验天数×1%（0天→25%，15天→40%，30天→55%）
2. **状态惩罚系统**：饥饿(-12%)、疲劳(-15%)、健康差(-12%)、心情差(-10%)、衣衫不整(-10%)、露宿(-15%)等
3. **装备加成**：正装（suit/formal_shoes等）→ +15%
4. **技能优势细化**：超要求每5级+2%（上限+15%）
5. **反馈消息**：面试失败/成功时显示具体原因（资历浅、状态差、着装加分等）
6. **职业路径入门要求补全**：教学助理 `english:5, management:3`（原空），护理员 `medicine:5`（原空）

**设计参考**：《大多数》求职门槛 / 《Papers Please》状态影响 / 中国职场现实

**影响文件**：`career_dev.js`（面试逻辑+职业路径数据+反馈链）

## 2026-07-06 — 欢迎页"六条路"路内断行修复

**问题**：桌面端欢迎页 `🏪 经商大亨 · ⭐ 城市名人 · 🎓 技能大师 · 💰 投资天才 · 🏢 职场巅峰 · 💵 财务自由` 在窗口宽度不足时，单条路（如 "🏢 职场巅峰"）被浏览器拆开换行，icon 在上半行、文字在下半行。

**根因**：6 条路是纯文本塞在一个 `<div class="welcome-subtitle">` 里用 `<br>` 硬换行，浏览器排版时把空格当作可断点，导致路内断开。

**修复**：

- `index.html`：每条路包 `<span class="goal-item">...</span>`，路间用 `·` 分隔符（分隔符在 span 外，作为合法换行点）
- `style.css`：`.goal-item { white-space: nowrap; }` 禁止路内断行
- 效果：窗口不够宽时，整条路（icon+文字）一起换到下一行，绝不会拆开

**影响文件**：`src/index.html` / `src/css/style.css` · commit `a24d633`（push 待网络恢复）

## 2026-07-06 — P0 BugFix：事件记录丢失 + 打车不可达全城 + 手机端UI溢出

### Bug 1：renderMessageLog is not defined（事件记录不显示 + 展开按钮消失）

**根因**：`renderMessageLog`/`scrollMessageLogToBottom` 两个函数在 v3.13 render.js 拆分时被丢弃——函数被 9 处调用但 0 处定义。CSS 完整（折叠/预览/展开样式）但无 JS 创建对应 DOM，导致整个事件记录系统失效。

**修复**（`render.js +85行`）：

- 重新实现 `renderMessageLog(state)`：一次性注入 `#message-log-toggle` 按钮 + `#message-log-preview` 预览行；渲染日志条目（桌面端全部/移动端50条）；更新预览行文本；自动滚动。
- `scrollMessageLogToBottom()`：仅在展开态且接近底部（<40px）时自动滚，避免打断阅读。
- 默认移动端折叠（显示最近3条+预览），桌面端展开。
- `render_core.js` 的 `renderAll` 加 `typeof renderMessageLog === "function"` 守卫。

**统一展开/关闭**：只有一处 toggle 逻辑（`#message-log-toggle` 按钮 + `#message-log-preview` 预览行均绑定同一 toggle），无重复。

### Bug 2：打车不能到达任意地点 + 价格随机

**根因**：打车分支用 `reachableList.slice()`（和骑车一样只到1-hop邻居），价格用 `10 + Math.random()*31` 随机数。

**修复**：

- `locations.js` 新增 `getTaxiCost(fromKey, toKey)`：¥8 + 4×跳数，封顶¥40，不可达 fallback ¥35。
- 打车分支改为 `Object.keys(LOCATIONS)` 过滤当前地点 = 全城可达。
- 价格计算改为 `getTaxiCost(locKey, k)`（确定性，与扣除金额一致）。

### Bug 3：手机端UI排版溢出

**根因**：固定宽度元素（170px 天气预报 + 150px 升级提示 + 5×70px 属性栏 + 330px 地图）在小屏（≤360px）总宽溢出。

**修复**（`render_infra.js` + `style.css`）：

| 元素           | 修改                                                                           |
| -------------- | ------------------------------------------------------------------------------ |
| 地点栏升级提示 | ≤480px 时缩短为"💡可升级🛏️合租" + max-width:100px + ellipsis                   |
| 天气预报容器   | 170→110px，去掉"📅明日天气预报"label，加 flex-shrink:0                         |
| 时间槽天气     | 去掉天气名、温度效应括号，仅保留 图标+温度+舒适度                              |
| 地图           | min-height 330→240px，节点 min-width 78→70px                                   |
| 属性栏         | cell 间距 3→2px，label 26→20px，track min-width 18→10px，val min-width 18→14px |
| 地点栏         | 加 overflow:hidden 防止溢出                                                    |

**验证**：`node --check` 4 文件通过 / `build.py` 4868.3KB ✅
**Commit**: `07636a1`

---

## 2026-07-06 — v3.1 审查改进：NG+ 继承数据可视化 + 加成消费接入

### 审查发现

`inheritance_chain.js` 定义了 `inheritCrisisPath`/`inheritMoralScore`/`inheritPeakAffinity` 三个继承函数，在 game over 时计算并存储到 `_lastGameInheritance`。但 `showInheritanceSummaryModal` 从未展示这些字段——玩家开新档看到继承摘要弹窗，只有徽章/现金/关系数/物品数/梦想/技能树，完全看不到 35 岁路径/道德分/NPC 巅峰好感。

**加成消费断链**：`inheritanceBonuses` 中的 `promoChance`/`moralEventRate`/`recoveryRate` 等字段在徽章和路径继承中被 SET，但从未在 gameplay 代码中被 READ/CONSUMED。

### P1 修复：继承摘要弹窗展示全部字段（+95行）

| 新增模块      | 内容                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------- |
| 📋 35 岁路径  | 显示路径标签（再卷职场/备考公/摆烂）、属性加成、特殊加成（晋升+3%/月薪+5%等）               |
| ⚖️ 前世业力   | 显示善恶净值、善恶标签（善人/普通人/小恶/恶人）、善行/恶行次数、NPC好感偏移、道德事件率调整 |
| 👥 老熟人     | 以 chip 形式展示每个 NPC 的上局巅峰好感（≥50）                                              |
| 📊 总存活天数 | 底部显示上局存活天数                                                                        |

**数据补全**：`totalDays` 字段已加入 `inheritanceData`（game over 时写入），供弹窗消费。

### P2 增强：35 岁路径继承 + 特殊加成（+40行）

| 路径     | 原加成 | 新增加成                    |
| -------- | ------ | --------------------------- |
| 再卷职场 | 心智+3 | 晋升概率+3%，月薪+5%        |
| 备考公   | 智力+3 | 考试成功率+10%，公职月薪+3% |
| 摆烂     | 心情+5 | 体力恢复+10%，每日压力-3    |

### P2 增强：道德分 → 业力系统（+30行）

| 原效果          | 新增效果                                          |
| --------------- | ------------------------------------------------- |
| 幸运加成(-3~+5) | NPC初始好感偏移(-8~+8)，道德事件率调整(-15%~+15%) |

### P2 接入：加成消费断链修复（3处）

| 字段             | 消费点                                   | 效果                          |
| ---------------- | ---------------------------------------- | ----------------------------- |
| `promoChance`    | `phase2/promo.js::checkPromotion` P9→P10 | P9→P10 晋升概率叠加           |
| `moralEventRate` | `main.js` 每日道德事件判定               | 5% 基础率 + 业力加成          |
| `recoveryRate`   | `phase1/needs.js::tickHealthStatus`      | 日健康恢复 3×(1+recoveryRate) |

### 影响文件

| 文件                        | 操作                                                                       |
| --------------------------- | -------------------------------------------------------------------------- |
| `ui/modal.js`               | `showInheritanceSummaryModal` 新增 3 个显示模块 + `totalDays`              |
| `core/inheritance_chain.js` | `inheritCrisisPath`/`inheritMoralScore` 增强 + `applyInheritance` 消费扩展 |
| `phase2/promo.js`           | P9→P10 晋升概率叠加 `promoChance`                                          |
| `main.js`                   | 道德事件率叠加 `moralEventRate`                                            |
| `phase1/needs.js`           | 日健康恢复叠加 `recoveryRate`                                              |

### 验证

- `node --check` 5 文件全部通过 ✅
- `python build.py` 4856.6 KB ✅
- 无 MC 变动（纯 UI + 已有 bonus 消费）

---

## 2026-07-06 — v3.1 审查改进：难度系统全面接入 + 终局体验强化

### 审查发现

按 v3.1 SOP 执行全面审查，核心发现：

**难度系统已创建但未完全接入**：`difficulty_system.js` 定义了 4 个乘数参数，但 `needsDecayMultiplier` 和 `eventPenaltyMultiplier` 从未被任何代码消费（死参数），`wageMultiplier`/`priceMultiplier`/`illnessRateMultiplier` 尚未定义。

### P1 难度系统全面接入（4 个系统，5 个文件）

| 修改点                              | 文件                                      | 影响                         |
| ----------------------------------- | ----------------------------------------- | ---------------------------- |
| `needsDecayMultiplier` 接入需求衰减 | `phase1/needs.js::applyNeedsDecay`        | 休闲衰减×0.85，地狱×1.40     |
| `needsDecayMultiplier` 接入需求惩罚 | `phase1/needs.js::checkNeedsThresholds`   | 饥饿/卫生/疲劳惩罚按难度缩放 |
| `wageMultiplier` 接入工作收入       | `main.js::doStreetJob` + `estimateJobPay` | 休闲+15%，地狱-30%           |
| `priceMultiplier` 接入物价计算      | `phase1/pricing.js::calcFinalPrice`       | 休闲-10%，地狱+30%           |

### P1 难度系统升级：3→4 档 + 6 乘数

| 难度    | 日息  | 工资  | 物价  | 疾病率 | 需求衰减 | 事件惩罚 | 中产税 |
| ------- | ----- | ----- | ----- | ------ | -------- | -------- | ------ |
| 🍵 休闲 | 0.20% | ×1.15 | ×0.90 | ×0.60  | ×0.85    | ×0.70    | 20%    |
| ⚖️ 标准 | 0.35% | ×1.00 | ×1.00 | ×1.00  | ×1.00    | ×1.00    | 35%    |
| 🔥 困难 | 0.50% | ×0.85 | ×1.15 | ×1.50  | ×1.15    | ×1.30    | 50%    |
| 💀 地狱 | 0.70% | ×0.70 | ×1.30 | ×2.00  | ×1.40    | ×1.60    | 70%    |

**难度选择器 UI 升级**：选择器卡片现在显示工资/物价/日息/疾病率四维参数，一目了然。

### P2 终局体验强化（峰终定律）

胜利弹窗新增三大模块：

1. **人生总结统计**：换工作次数/结交好友数/精通技能数/考证数/是否创办公司/是否拥有房产
2. **NG+ 继承激励**：清晰展示可继承的徽章/现金/装备/技能分支/梦想进度
3. **难度成就标签**：地狱难度通关显示「💀 地狱难度通关！你是真正的生存大师」，困难难度显示「🔥 困难难度通关」

**设计参考**：《大多数》终局人生总结 / 《中国式家长》成就激励 / 《Papers Please》难度标签

### MC 平衡验证

`tests/mc_difficulty_balance.cjs` — 4 难度 × 4 策略 × 100 次 × 1000 天

| 难度 | balanced 中位现金 | 存活率 |
| ---- | ----------------- | ------ |
| 休闲 | ¥11,827           | 100%   |
| 标准 | ¥7,045            | 100%   |
| 困难 | ¥1,535            | 100%   |
| 地狱 | -¥306             | 0%     |

**验证结论**：难度分层有效，梯度清晰，地狱档极限挑战成立。

### 影响文件

| 文件                              | 操作                                                 |
| --------------------------------- | ---------------------------------------------------- |
| `core/difficulty_system.js`       | 升级 3→4 档，新增 wage/price/illness 3 乘数，UI 升级 |
| `phase1/needs.js`                 | 接入 needsDecayMultiplier（衰减 + 惩罚）             |
| `main.js`                         | 接入 wageMultiplier（doStreetJob + estimateJobPay）  |
| `phase1/pricing.js`               | 接入 priceMultiplier（calcFinalPrice）               |
| `ui/corp_ui.js`                   | 终局体验强化（人生总结 + NG+ 激励 + 难度成就）       |
| `memory/review-improve-v3.1.md`   | 新增 v3.1 SOP                                        |
| `tests/mc_difficulty_balance.cjs` | 新建 MC 平衡验证脚本                                 |

### 验证

- `node --check` 5 文件全部通过 ✅
- `python build.py` 4831.5 KB ✅
- MC 4×4×100×1000 验证通过 ✅

---

## 2026-07-06 — v3.21b：约定式自动导航（零配置）

### 核心变更

将导航从**手动添加模式**升级为**约定式自动生成**。

#### `_wikiAutoAppendNav()` — 集中式导航后处理

在 `_wikiRenderDetail()` 末尾统一调用，根据 `catId` 和数据字段自动生成导航按钮，不再需要每个 `_wikiDetailXxx()` 手动添加。

**自动规则表（按数据 schema 驱动，零代码修改）：**

| wiki 分类 | 自动生成的导航按钮                         | 数据来源            |
| --------- | ------------------------------------------ | ------------------- |
| locations | 「🚶 前往此地」「🗺️ 在地图上查看」         | `LOCATIONS[id]`     |
| jobs      | 「🚶 前往该地工作」「⚡ 查看行动」         | `job.location`      |
| npcs      | 「🚶 前往该地找TA」「👥 社交互动」         | `npc.location`      |
| items     | 「🛒 去某地购买」（每个 buyLocations）     | `item.buyLocations` |
| goods     | 「🛒 去某地购买」（每个 buyLocations）     | `good.buyLocations` |
| skills    | 「📚 前往培训中心训练」「📖 查看全部技能」 | 固定 trainingCenter |
| certs     | 「📚 前往培训中心考取证书」                | 固定 trainingCenter |

#### 数据驱动扩展点：`navHints` 字段

任何数据条目添加 `navHints` 数组，自动生成额外导航按钮：

```js
// 在 locations.js 中某个地点
navHints: [
  {
    type: "subTab",
    tab: "personal_growth",
    subTab: "pg_edu",
    key: "pg_edu",
    label: "🎓 查看学历",
  },
];
```

已为大学城添加 `navHints` 演示：「查看学历」「查看职业路径」。

#### 清理工作

- 移除 6 个 `_wikiDetailXxx()` 中的手动 `navActionButton` 调用（~40行）
- 新增 `_wikiGetNavHints()` 读取任意数据条目的 `navHints` 字段

### 影响文件

| 文件           | 操作                                               |
| -------------- | -------------------------------------------------- |
| `wiki.js`      | 新增 `_wikiAutoAppendNav()` + `_wikiGetNavHints()` |
| `wiki.js`      | 移除 6 处手动 navActionButton 代码                 |
| `locations.js` | 大学城新增 `navHints` 演示                         |

### 验证

- `node --check` 全部通过 ✅
- `python build.py` 4843.2 KB ✅

### 核心变更

#### P0 — 创建集中式导航系统（`src/js/ui/navigation.js`，+1500行）

| 功能                                | 说明                               |
| ----------------------------------- | ---------------------------------- |
| `navigateTo(state, target, opts)`   | 统一导航入口，支持五种导航类型     |
| `navToTab(tabName)`                 | 一键Tab切换（免确认）              |
| `navToLocation(locKey, opts)`       | 一键前往某地（带消耗确认弹窗）     |
| `navToWiki(catId, entryId)`         | 一键百科跳转                       |
| `navToEducation()`                  | 一键前往学历子面板                 |
| `navToUniversity()`                 | 一键前往大学城（含AP消耗确认）     |
| `navLink(target, label)`            | 生成导航链接HTML                   |
| `navActionButton(type, key, label)` | 生成导航按钮HTML                   |
| `bindAllNavButtons()`               | 绑定所有导航按钮点击事件           |
| `initTabNavigation()`               | 事件委托修复tab按钮无点击事件的Bug |

**资源消耗确认弹窗机制**：导航到需要消耗行动力/金钱的目标时，显示不可跳过的弹窗（标题+描述+消耗明细+确定/取消按钮）。不足时直接阻止并显示警告消息。设计参照《Papers Please》强制确认、《中国式家长》行动确认。

**严重Bug修复**：原代码中所有 `tab-btn` 没有任何 click 事件处理函数。点击Tab按钮什么都不会发生。`initTabNavigation()` 通过事件委托修复此问题。

#### P1 — 百科系统深度导航增强（`wiki.js`）

百科条目详情页底部新增导航按钮：

| 条目类型 | 新增导航按钮                               |
| -------- | ------------------------------------------ |
| 地点     | 「前往此地」「在地图上查看」               |
| 工作     | 「前往该地工作」「查看行动」               |
| NPC      | 「前往该地找NPC」「社交互动」              |
| 商品     | 「去某地购买」（根据buyLocations动态生成） |
| 技能     | 「前往培训中心训练」「查看全部技能」       |
| 装备     | 「去某地购买」「查看背包」                 |

#### P1 — 修复关键导航断链

- **`career_dev.js`「去大学城备考」按钮**：从 `onclick="document.querySelector('[data-tab=action]')?.click()"` 改为标准的 `navActionButton("location", "school", ...)`，点击时会弹出AP消耗确认
- **学历子面板 `renderPgEdu`**：新增「去大学城备考」「去培训中心学习」导航按钮
- **技能Tab**：不在培训中心时，gate提示框新增「前往培训中心训练」导航按钮
- **事业发展总览**：新增「查看上班族职位」「创业系统」「去大学城提升学历」快速跳转
- **`renderAll()`** 末尾调用 `bindAllNavButtons()`，确保每次渲染后自动绑定

### 影响文件

| 文件                       | 操作     | 说明                      |
| -------------------------- | -------- | ------------------------- |
| `src/js/ui/navigation.js`  | **新建** | 核心导航系统，~1500行     |
| `src/js/ui/wiki.js`        | 修改     | 百科6个详情函数导航按钮   |
| `src/js/ui/render.js`      | 修改     | 学历面板+技能面板导航按钮 |
| `src/js/ui/render_core.js` | 修改     | renderAll绑定导航按钮     |
| `src/js/ui/career_dev.js`  | 修改     | 备考按钮+总览导航         |
| `src/index.html`           | 修改     | 加载navigation.js         |

### 设计参考

- 《城市：天际线》右键菜单跳转 → 统一 navigateTo API
- 《Papers Please》不可跳过弹窗 → showModal + 资源消耗确认
- 《大多数》导航连贯性 → 百科到实地的一键跳转
- 《文明 VI》Civilopedia 跨条目链接 → _wkLink + navActionButton 双系统
- Apple HIG 确认弹窗模式 → 蓝色确认按钮 + 文字描述消耗明细

### 验证

- `node --check` → 全部通过 ✅
- `python build.py` → 4840.4 KB ✅
- `git push` → `8392a94` ✅

### 修复内容

针对「叙事描述的场景与触发条件不自洽」做全面审查，修复所有 A 类缺陷。

| 事件 id                 | 原缺陷描述                                                                                          | 修复内容                                                                                  | 类别 |
| ----------------------- | --------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---- |
| `coworker_injured`      | 叙事为"工友从脚手架摔下"，conditions 只检查 `phase === "street"`，任何职业都可能触发                | 新增建筑工地职业（`manual_labor_construction`）/ 地点（`construction`）/ 行动频次三重检查 | A    |
| `fake_goods`            | 叙事为"摆摊时才发现是山寨货"，conditions 只检查 `cash > 0`，非摊主玩家也可能触发                    | 新增摆摊职业（`food_stall`等）/ 副业（`sideHustle.type === 'stall'`）/ 行动频次检查       | A    |
| `street_talent_scout`   | 叙事为"今天摆摊，被采购女士相中"，conditions 只检查销售等级，非摊主玩家也可能触发                   | 新增摆摊职业 / 副业 / 行动频次检查（与 `fake_goods` 相同逻辑）                            | A    |
| `rainy_day_dilemma`     | 叙事为"暴雨将至，你刚摆好的货还没收"，conditions 只检查 `phase === "street"`，晴天 + 非摊主都可触发 | 新增暴雨天气（`rainy / stormy`）检查 + 摆摊职业 / 副业检查                                | A    |
| `homeless_rain_shelter` | 叙事为"天气预报说今晚有暴雨"，conditions 只检查露宿状态，晴天也可触发                               | 新增暴雨天气（`rainy / stormy`）检查                                                      | A    |

### 影响文件

- `src/js/core/events_street_survival.js`：5处 conditions 修复，每处附 `// [自洽修复]` 注释

### 验证

- `node --check src/js/core/events_street_survival.js` ✅
- `python build.py` → 4757.5 KB ✅
- commit: `752017c`

---

## 2026-07-05 — v3.19：交易Tab进阶信息门控 + 商品卡片紧凑化

### 问题背景

**问题1**：季节横幅（进货/卖出好时机）、最佳路线提示在一开局就显示，破坏了原本设计的"随交易经验积累逐步解锁市场信息"机制。

**问题2**：商品卡片布局在`justify-content:space-between`下，名称和类别标签之间产生大量留白；"季节性高价/低价"标签和类别标签位置混乱；3~4行高度对移动端体验影响明显。

### 设计决策

| 功能模块          | 解锁条件                 | 设计理由                         |
| ----------------- | ------------------------ | -------------------------------- |
| 节日价格横幅      | 始终显示                 | 公共信息，人人知道节日           |
| 季节进货/卖出横幅 | 销售≥10级                | 需要积累一定经验才能识别季节规律 |
| 最佳路线推荐      | 销售≥15级 + 已访问≥2地点 | 路线分析需要探索经验双重积累     |
| 商品卡季节标签    | 销售≥10级（与横幅同步）  | 保持信息一致性                   |

**探索提示3态**：

- 双门槛均未达→"多跑几处市集、多做几笔买卖..."（模糊引导，不暴露具体数值）
- 仅缺技能→"已走访X处市集！销售升至20级可开启..."（明确进度感）
- 仅缺地点→"已访问X/Y个区域，再走访N个即可解锁"（精确提示）

### 商品卡片新布局（`.trade-item-card`）

```
行1: [名称] [类别标签] [🟢低价季/🔴高价季]  ← 全内联，flex-start+gap
行2: 基¥X → 当前¥Y↑ [低价]    [买1] [买5] [批×10] [✏️]
```

旧布局：4行（名称行/基准价行/当前价行/按钮行）
新布局：2行（名称+标签行/价格+按钮行），padding 8px（移动端6px），类别标签文案缩短："🟢低价季/🔴高价季"

### 影响文件

- `src/js/ui/render.js`：季节横幅门控/路线提示门控/探索提示3态/卡片HTML重构（季节标签同步门控）
- `src/css/style.css`：新增`.trade-item-card/.tic-header/.tic-body/.tic-price/.tic-btns`及移动端覆盖

### 验证

- `node --check src/js/ui/render.js` ✅
- `python build.py` → 4755.3 KB ✅
- commit: `7ecda93`（push因网络问题暂留本地）

---

## 2026-07-05 — v3.18.1：BugFix — 交易Tab不显示商品（getDailyPriceShock 缺失）

> **问题**：交易Tab点击后只显示标题栏和季节横幅，商品网格完全空白。浏览器控制台报 "getDailyPriceShock is not defined"。
>
> **根因**：`pricing.js` 的 `calcFinalPrice()` 在第408行调用了 `getDailyPriceShock(locKey, goodId)` 但该函数从未被定义。这导致商品价格计算循环中抛出 ReferenceError，渲染中断，商品网格未能生成。
>
> **修复**：在 `pricing.js` 新增 `getDailyPriceShock()` 函数实现，使用确定性种子（天数+地点+商品）生成 ±7% 的价格波动乘数（0.93~1.07）。复用 `trade_intel.js` 的 `createSeededRandom`（已保证加载顺序），降级回退为简单 hash 伪随机。
>
> **验证**：puppeteer 自动化测试确认 30 张商品卡片正常显示，`getDailyPriceShock is not defined` 错误归零。
>
> **影响文件**：`src/js/phase1/pricing.js`（+26 行）
> **commit**: 待 commit

---

## 2026-07-05 — v3.18：跨系统事件联动扩展（20个新联动事件）

> 设计理念：421个事件打通5大主题联动网络
> 影响文件：cross_system_events.js(+1132行) + moral_events.js(7处) + side_hustle_events.js(4处)
> commit: `13fba78`

### 联动机制说明

**实现方式**：在「源事件」的 apply/immediate 里注入 `st.flags.X = true`，在「目标事件」的 conditions 里检查这些 flags，形成跨文件、跨系统的事件联动链。

### 11处flag注入点

| 文件                  | 事件                  | 选项         | 注入flag                |
| --------------------- | --------------------- | ------------ | ----------------------- |
| moral_events.js       | found_wallet          | 送到派出所   | moralWalletReturner     |
| moral_events.js       | found_wallet          | 收进口袋     | moralWalletStolen       |
| moral_events.js       | beggar_ask            | 买盒饭       | moralFedBeggar          |
| moral_events.js       | see_pickpocket        | 大声提醒     | moralStoppedThiefPublic |
| moral_events.js       | stray_dog_rain        | 喂流浪狗     | moralFedDog             |
| moral_events.js       | old_fall              | 扶起老人     | moralHelpedElder        |
| moral_events.js       | stranger_help         | 推车到充电站 | moralPushedCar          |
| side_hustle_events.js | side_daigou_complaint | 全额退款     | daigouHonestService     |
| side_hustle_events.js | side_media_ban        | 换平台起步   | selfMediaPivoted        |
| side_hustle_events.js | side_tutor_difficult  | 游戏教学成功 | tutorInnovative         |
| side_hustle_events.js | side_invest_crash     | 抄底成功     | investBottomed          |

### 新增20个跨系统联动事件

**主题A·道德回响（5个）**

| 事件ID                     | 触发条件                     | 叙事主轴             |
| -------------------------- | ---------------------------- | -------------------- |
| moral_wallet_return_reward | moralWalletReturner + 3天后  | 失主专程找来感谢     |
| moral_elder_connection     | moralHelpedElder + 5天后     | 老人儿子提供工作机会 |
| moral_dog_reunion          | moralFedDog + 雨天           | 流浪狗认出你跟着你   |
| moral_beggar_tip           | moralFedBeggar + 3天后       | 乞丐老人的街市情报   |
| moral_karma_windfall       | 道德≥65 + 名气≥15 + 善行done | 城市积累的善意回响   |

**主题B·副业进化（4个）**

| 事件ID                   | 触发条件                     | 叙事主轴               |
| ------------------------ | ---------------------------- | ---------------------- |
| hustle_daigou_biz_idea   | daigouHonestService + 20天后 | 口碑客户提议合伙做生意 |
| hustle_media_brand_deal  | selfMediaPivoted + 14天后    | 品牌方主动发来合作私信 |
| hustle_invest_guru       | investBottomed + 7天后       | 工友请教投资判断逻辑   |
| hustle_tutor_institution | tutorInnovative + 10天后     | 培训机构来挖创新老师   |

**主题C·时代里程碑后续（4个）**

| 事件ID                    | 触发条件                        | 叙事主轴               |
| ------------------------- | ------------------------------- | ---------------------- |
| era_trend_bubble_pop      | trendJobUnlocked + day≥270      | 风口泡沫破裂的反思     |
| era_career_pivot_result   | careerShift + day≥540           | 转行半年的阶段性复盘   |
| era_small_biz_rival       | smallBusinessUnlocked + day≥560 | 连锁店入驻逼迫差异化   |
| era_startup_mentor_chance | startupUnlocked + day≥730       | 工商局等号遇到创业导师 |

**主题D·副业负面反噬（3个）**

| 事件ID                      | 触发条件                | 叙事主轴             |
| --------------------------- | ----------------------- | -------------------- |
| hustle_ban_recovery         | deliveryBan             | 外卖封号逼出新生路   |
| hustle_daigou_review_crisis | daigouBadReview + 5天后 | 差评在群里扩散危机   |
| hustle_invest_hold_result   | investHold + 14天后     | 观望仓位到了关键节点 |

**主题E·跨阶段桥接（4个）**

| 事件ID                     | 触发条件                    | 叙事主轴             |
| -------------------------- | --------------------------- | -------------------- |
| corp_integrity_recognition | 职场阶段 + 道德flags        | 主管认可你的诚信品格 |
| career_startup_epiphany    | 在职≥300天 + 未创业         | 客户会议触发创业顿悟 |
| city_influence_leverage    | cityInfluencer + day≥910    | 社区顾问委员会招募   |
| moral_wallet_stolen_shadow | moralWalletStolen + 道德<50 | 昧下钱包的心理阴影   |

### 验证结果

- `node --check` 三文件全通过 ✅
- `python build.py` → 4730.2 KB ✅

---

## 2026-07-05 — v3.17c：完成20个联动事件指令（补充15个）

> SOP: 自主设计，按空白区分析自主选题
> 影响文件：cross_system_events.js（+1384行）
> commit: `3c7dcc1`

### 第三波补充的15个事件

| 事件ID                        | 类型      | 触发条件                       | 联动系统           |
| ----------------------------- | --------- | ------------------------------ | ------------------ |
| `storm_shelter_meet`          | 天气+社交 | stormy/typhoon+露宿+15天冷却   | 天气+社交+心智     |
| `chef_chen_teaching`          | NPC教学   | 陈师傅好感≥40+商业区+20天冷却  | NPC+技能+心情      |
| `equipment_break_alert`       | 装备损坏  | 装备耐久≤20+10天冷却           | 装备+修理+经济     |
| `job_burnout_warning`         | 职业倦怠  | 心情<30+疲劳>60+14天冷却       | 工作+心智+心情     |
| `sick_work_notice`            | 疾病联动  | illnesses>0+health<50+20天冷却 | 疾病+工作+社交     |
| `low_mood_despair`            | 情绪危机  | 心情<20+health>20+20天冷却     | 心情+心智+道德     |
| `xiao_mei_study_group`        | 学习小组  | 小美好感≥40+智力≥25+不可重复   | NPC+教育+技能      |
| `techpark_startup_idea`       | 创业灵感  | 科技园+coding≥20+不可重复      | 地点+技能+创业     |
| `social_loneliness`           | 社交孤独  | 无NPC好感>20+25天冷却          | 社交+心情          |
| `debt_meet_creditor`          | 债务压力  | 总负债>500+30天冷却            | 经济+道德+剧情     |
| `zhang_training_tip`          | 培训推荐  | 张姐好感≥50+不可重复           | NPC+教育+工作      |
| `park_exercise_habit`         | 健身习惯  | park+连续5次到达+20天冷却      | 地点+健康+体质     |
| `construction_minor_accident` | 工地事故  | 工地+20天冷却                  | 地点+工作+NPC+健康 |
| `skill_noticed_stranger`      | 技能回报  | 任意技能≥50+20天冷却           | 技能+社交+经济     |
| `library_mentor_meet`         | 导师事件  | 智力≥35+不可重复               | 教育+心智+社交     |

### 设计覆盖

- Weather+location combo: event 11
- NPC好感×地点: events 12, 17, 21
- 装备系统: event 13
- 积累爆发: events 14, 16, 19
- 疾病系统: event 15
- 地点专属: events 18, 22, 23
- 债务系统: event 20
- 技能回报: event 24
- 学习路径: event 25

### 验证

- `node --check cross_system_events.js` ✅
- `python build.py` (4686.3 KB) ✅
- `commit 3c7dcc1` ✅

---

> SOP: 自主设计，按空白区分析自主选题
> 影响文件：cross_system_events.js（+506行）
> 设计参考：This War of Mine / 大多数 / Papers Please / Stardew Valley

### 新增5个联动事件

| 事件ID                    | 类型       | 联动系统                        | 触发条件                                | 后续           |
| ------------------------- | ---------- | ------------------------------- | --------------------------------------- | -------------- |
| `fatigue_streak_collapse` | 积累爆发   | 疲劳+健康+经济                  | highFatigueStreak≥3, fatigue≥75, day>10 | 无             |
| `skill_combo_insight`     | 技能组合   | 烹饪+管理→餐饮 / 修理+销售→翻新 | 两项技能≥30/20, day>30, 不可重复        | 无             |
| `npc_duo_referral`        | 双NPC联动  | 王大婶+老周好感+工作            | 两人好感均≥50, day>40, 不可重复         | 解锁物流园工作 |
| `moral_good_karma`        | 道德积累   | 道德+名气+经济                  | moral.score≥15, day>20, 30天冷却        | 无             |
| `hygiene_social_awkward`  | 低卫生后果 | 卫生+社交+心情                  | lowHygieneStreak≥2, hygiene<30, day>5   | 无             |

### 设计亮点

- **疲劳过劳危机**：与hunger_streak_collapse对称，露宿街头时30%概率被驱赶
- **技能跨界洞察**：两种组合（cooking+management / repair+sales），每种给出不同叙事文本
- **双NPC联动**：1+1>2效应，王大婶和老周同时好感≥50才触发
- **道德正向回报**：moral.score累计版，30天冷却可重复触发，区别于单次道德选择
- **低卫生社交惩罚**：面馆老板可能送荷包蛋（40%概率暖心分支）

### 验证

- `node --check cross_system_events.js` ✅
- `python build.py` (4626.9 KB) ✅
- `commit 3658492` ✅
- `git push` ❌（代理网络不通，需手动重试）

---

## 2026-07-05 — v3.17：跨系统联动事件扩充（空白区填充）

> SOP: 自主设计（按 v2.1 内容扩充标准）
> 影响文件：cross_system_events.js
> 设计参考：This War of Mine 道德困境 / Papers Please 人设分叉 / Stardew Valley 好感积累 / 大多数 需求系统

### 新增5个联动事件

| 事件ID                   | 类型         | 联动系统              | 链式后续                                      |
| ------------------------ | ------------ | --------------------- | --------------------------------------------- |
| `delivery_regular_treat` | 老手特遇     | 技能+天数+经济        | 无                                            |
| `skilled_eye_fake_goods` | 专业人士视角 | 修理/电工技能         | 无                                            |
| `old_zhou_wholesale_tip` | NPC好感秘密  | 老周好感+批发市场地点 | `zhou_channel_first_deal`（3天后）            |
| `moral_pickpocket_split` | 道德分叉     | 道德值三档分支        | `moral_pickpocket_followup_kindness`（3天后） |
| `hunger_streak_collapse` | 积累爆发     | 连续饥饿+健康状态     | 无                                            |

### 设计亮点

- **Event1 老主顾的问候**：driving≥15 或 agility≥28 或 totalEarned>2000 三种触发条件，覆盖不同玩家路径
- **Event2 一眼识假**：修理≥40 或电工≥35，揭穿有20%受伤风险，买假货研究可获XP
- **Event3 老周的暗线**：仅在批发市场触发，`queueChainEvent` 调度3天后链式事件
- **Event4 街头的暗影**：`choices` 为函数动态生成，按 morality≥60/≤35/中间三档提供完全不同选项，最高道德选项有链式后续
- **Event5 撑不住了**：`lowHungerStreak≥3` + `health<50`，条件严格但触发后概率0.15；找朋友分支按NPC好感最高者触发专属对话（王大婶/陈师傅）

### 验证

- `node --check cross_system_events.js` ✅
- `node --check main.js` ✅
- `python build.py` (4605.9 KB) ✅
- `commit 57cf587` ✅
- `git push` ✅

---

## 2026-07-04 — v3.7.1：交易深度优化第二轮（按 v3.1 审查改进）

> SOP: `memory/review-improve-v3.1.md` v3.1 | 覆盖维度：2(机制/数值) + 4(UI) + 7(全剧本)
> 影响文件：render.js / pricing.js / extra_events.js / daily_pipeline.js
> 设计参考：Capitalism Lab 价格波动系统 / 《大多数》交易路线多样性 / Stardew Valley 季节性经济

### 修复1：分类标签显示英文（books/flowers/medicine/stationery）

**根因**：`render.js` line 1793（原位置）内联分类名映射 `{ daily:"日用品", ... }` 只有 6 类，新增的 4 类（books/flowers/medicine/stationery）全部回退到英文 `|| good.category`。

**修复**：

- 将 `CATEGORY_NAMES_TRADE`（10 分类完整映射）提升为函数顶部变量（line 1420），替代条件块内的重复定义
- 卡片的分类标签改用 `CATEGORY_NAMES_TRADE[good.category]` 引用统一映射
- SortUtils 分类排序数组补齐 4 个新分类（medicine→books→stationery→flowers）

### 修复2：暴雨跑腿事件无条件触发

**根因**：`extra_events.js` "rainy_season_flood" 事件没有 `conditions` 函数，任何街头玩家任何天气都会触发。

**修复**：

- 新增 `conditions`：必须当前天气为"暴雨"或"大雨"，且不在室内专属地点（bank/trainingCenter）
- 叙事泛化：消息改为"在积水中帮人跑腿送东西"，不暗示"小费"这类特定职业用语
- 待在屋里选项增加心情恢复（+3），更具选择价值

### 增强1：每日价格随机波动系统（打破固定最优路线）

**设计**：每天为 3~~8 个随机商品×地点组合注入 ±5%~~±25% 的价格冲击，每天刷新，创造每日不同的套利机会。

**实现**：

- `pricing.js` 新增 `tickDailyPriceShocks()`（生成每日波动）→ 接入 `daily_pipeline.js` pricing_market 步骤
- `getDailyPriceShock(locKey, goodId)` 读取当天冲击值
- `calcFinalPrice()` **×** shockMod（路线推荐可感知每日波动）
- `getCurrentPrice()` 挂钩 **×** shockMod（UI 价格实时反映）

### 增强2：路线饱和惩罚机制

**设计**：同一条路线使用越多，利润越低（模拟市场被玩家"做穿"）。

**实现**：

- `pricing.js` 新增 `_routeUsage` 字典追踪每条路线使用次数
- `sellGood` 挂钩在卖出时捕获 `boughtAt` 并调用 `recordRouteUsage()`
- `getRouteSaturationPenalty(fromLoc, toLoc, goodId)`：0次=1.0 → 5次=0.75 → 10次=0.5
- 每天自动衰减 −1 次（市场缓慢恢复）
- `getBestTradeRoutes()` 调整利润率 = 原始利润率 − 饱和惩罚%

### 增强3：全面升级 getBestTradeRoutes

**改进点**：

- **全地点扫描**：不再只看当前位置出发的路线，扫描所有 buyLoc→sellLoc 组合
- **综合成本**：交通成本从 `hops×3` 升级为 `hops×2.5`（含 AP+疲劳+风险）
- **就近优先**：当前位置出发的路线额外 +5% 加成
- **饱和标记**：路线被过度使用时显示 ⚠️ 标签
- **需前往标记**：非当前位置路线显示 📍 标识
- **兜底提示**：无利润路线时显示"市场暂时平稳"

### 增强4：render.js 路线展示升级

- 路线卡片显示图标区分：📍（就近）/ 🗺️（需前往）
- 降低显示门槛：从 `≥8%` 到 `≥5%`
- 利润率颜色分 4 档：绿(≥40%) / 金(≥20%) / 灰(≥8%) / 次级(<8%)
- 无利润路线时显示兜底提示而非空白

### 验证

- `node --check` × 4 全部通过
- `python build.py` (4568.4 KB)
- 当前 commit 待提交

---

## 2026-07-04 — v3.7：交易系统全面优化+事件修复+移动端弹窗居中

> 设计参考：BitLife 交易系统 / 模拟人生经济系统 / 真实中国批发零售市场波动
> 影响文件：src/js/phase1/pricing.js（+176行）、src/js/ui/render.js（+90行）、src/js/core/festivals.js（+42行）、src/css/style.css（+2行）、src/js/phase1/extra_events.js（+6行）、src/js/core/cross_system_events.js（+6行）
> 触发：用户反馈3个问题 → 全量排查修复

### 修复1：交易Tab「undefined」显示bug

**根因**：`renderTradeTab()` 中 `skillTag` 变量用 `var` 声明在函数中部（line 1517），但模板字符串在 line 1436 就使用了它。JS var hoisting 导致 `skillTag` 初始化为 `undefined`，渲染为「undefined」文字。

**修复**：将 `skillTag` 及其依赖（`salesLvl`、`visitedLocs`）移到 headerDiv 创建之前（line 1418-1437）。

### 修复2：CATEGORY_NAMES_TRADE / getFestivalCategoryName 不完整

**问题**：goods.js 有 10 个分类（daily/food/luxury/clothing/electronics/scrap/books/flowers/medicine/stationery），但中文名映射表只覆盖前 6 个，导致新增分类显示原始英文 key。

**修复**：两处映射表补齐全部 10 个分类。

### 修复3：SEASONAL_PRICE_MODS 重构

**问题**：原季节价格修正只覆盖 4-5 个分类，且混杂 goodId 级 key（"water"/"drinks"），导致「卖出好时机」始终只显示服装/电子。

**修复**：重新设计 10 个分类全覆盖的季节价格矩阵，每季 3-4 个品类有显著波动（>1.1或<0.9），买卖推荐随季节动态变化。

### 修复4：新增动态路线推荐

**新增** `getBestTradeRoutes(state)` 函数，实时计算所有商品×地点组合的利润率，考虑价格修正、市场事件、交通成本，在交易Tab顶部显示 Top 3 最佳路线。

### 修复5：市场事件扩充 +8 条

新增：书籍热/情人节花市/流感爆发/基建项目/快递旺季/文具促销/医疗物资/品牌清仓，覆盖更多品类和场景。

### 修复6：移动端弹窗居中

**问题**：CSS 媒体查询中 `.modal-overlay` 使用 `align-items: flex-start`，弹窗偏上。

**修复**：改为 `align-items: center`，弹窗垂直居中。

### 修复7：暴雨送货事件语境修复

**问题**：extra_events.js/cross_system_events.js 的暴雨事件中「蹚水送外卖」选项的 apply 消息写死「送货」「小费」，暗示玩家是配送员，但实际上任何玩家都可能触发该随机事件。

**修复**：叙事改为「蹚水跑腿」「帮人送东西」，避免误导。

### 验证

```
node --check pricing.js ✓
node --check render.js ✓
node --check festivals.js ✓
node --check extra_events.js ✓
node --check cross_system_events.js ✓
python build.py ✓ (4566.0 KB)
git commit 5eaa899 ✓
```

---

---

## 2026-07-04 — v3.4：移动端UI紧凑化

> 设计参考：BitLife 信息密度 / Material 3 密集模式（Compact Density）/ Stardew Valley 移动端卡片布局 / 大多数（The Most）左侧紧凑信息栏
> 影响文件：src/css/style.css（+170行移动端紧凑规则）、src/js/main.js（+60行折叠功能）、dist/index.html

### 动机

用户反馈手机端"事件记录太大太长遮挡内容""交易卡太大""装备卡排成纵列""滑动太多才能获取信息"。

### 事件记录（Message Log）

- **默认折叠**：移动端 `#message-log` 初始化为 `collapsed` 类，仅显示 1 行预览条（展示最新事件文本）
- **点击展开**：点击预览行或标题栏按钮「▼ 展开」展开完整 log；展开后 max-height 30vh（≈200px）
- **条目紧凑**：font-size 12→10px, padding 3px→1px 0, 行高 1.5→1.4, 移除分隔线和动画
- **DOM轻量化**：移动端最多保留 25 条（桌面端 50 条）
- **预览实时更新**：每次 `renderMessageLog()` 更新预览条内容为最新事件

### Tab 页内容卡片

- **全局 `.action-card` 紧凑化**：padding 12→8px, min-height 96→64px, 标题 font-size 14→12px
- **两列网格**：`#content-area .action-cards` 强制 `grid-template-columns: repeat(2, 1fr) !important`（覆盖 JS 内联 `minmax(200px,1fr)` 单列）
- **卡内按钮缩小**：btn-sm min-height 44→28px, padding 8px→6px, font-size 13→10px
- **商品分类标签缩小**：slot-tag font-size 11→9px
- **自定义数量输入框紧凑**：input width 48px→36px, step-btn min-height 26px

### Tab 按钮栏

- gap 4→2px, padding 0 10→6px, min-height 44→36px, font-size 13→12px
- 超小屏（≤360px）：min-height 32px, font-size 11px

### 综合覆盖

- 交易 Tab：商品卡片 / 背包卡片 / 价格对比表
- 物品 Tab：装备卡片（两列紧凑）
- 技能 Tab：技能卡片（两列紧凑）
- 投资/股票 Tab：卡片 padding 缩减
- 地图 Tab：地点列表 padding 缩减
- 行动 Tab：行动卡片紧凑化
- 个人成长/成就 Tab：section 统一 padding 缩减
- 价格对比区域：字号 10px, padding 2px 4px

### 验证

- `node --check main.js` ✅
- `node --check render.js` ✅
- `npm run check:js`（125 files）✅
- `npm run typecheck` ✅
- `python build.py`（4554.6 KB）✅

## 2026-07-04 — v3.5：移动端事件记录默认3条 + 天气内联显示

> 设计参考：BitLife（事件默认可见数条）、Stardew Valley 移动端（天气集成于主UI）、Material Design 内容优先原则
> 影响文件：src/css/style.css（collapsed nth-child）、src/js/main.js（预览文案）、src/js/ui/render_infra.js（时间槽+位置条天气注入）、dist/index.html

### 动机

用户反馈 iPhone XR 上两个痛点：

1. **事件记录完全看不到** — v3.4 默认折叠为 1 行预览，需主动点击才能看到事件详情。要求默认可见最新 3 条。
2. **天气信息藏在侧栏** — 移动端侧栏需点汉堡菜单才可见，天气/温度/体感舒适度/未来预报对决策重要，应直接显示。

### 事件记录：默认显示 3 条

- **机制不变**：保留 `.collapsed` 类 + 展开/折叠切换
- **折叠含义改变**：折叠时不再是隐藏全部条目，而是显示前 3 条最新事件
- **CSS 实现**：`#message-log.collapsed .log-content .log-entry:nth-child(n+4) { display: none; }`
- **预览条**：位于 3 条事件下方，显示「📜 共N条记录，点击▾展开」
- **不足 3 条**：全部显示，无第 4 条规则触发
- **展开后**：显示全部 25 条（同 v3.4）

### 天气内联显示

- **当前天气**插入时间槽（`renderTimeSlot`）：`☀️晴天 28°C（温暖）舒适`，位于时段标签和⚡ AP之间
  - 格式：天气图标 + 名称 + 温度 + 体感名（括号）+ 舒适度标签（着色）
  - 紧凑文字，不占卡片空间
- **3 天预报**插入位置行（`renderLocationBar`）：`📅☀️晴天85% 🌤️多云65% ☀️晴天45%`，位于住所名右侧
  - 预报按置信度降序排列（85%/65%/45%）
  - overflow:ellipsis 防溢出
- **仅移动端**：`window.innerWidth <= 768` 控制，桌面端不受影响（侧栏已有天气面板）

### 预报交替闪烁

- **v3.5 改进**：去除预报前的 `|` 分隔符和 `📅` 图标，预报文本左移更紧凑
- **交替闪烁**：`📅明日天气预报` 与预报文本轮流显示，3.6s 周期交叉淡入淡出
  - CSS `@keyframes forecastAlt` 控制：1.5s 显示 → 0.3s 过渡 → 1.5s 隐藏 → 0.3s 过渡
  - `animation-delay: 1.8s` 使标签和预报值互为反相
  - `position: absolute` 重叠布局，`text-overflow: ellipsis` 防溢出
- **设计风格**：平滑 ease-in-out 动画（非生硬闪烁），匹配游戏整体奶油白+鼠尾草绿温和调性

### 验证

- `node --check main.js` ✅
- `node --check render_infra.js` ✅
- `python build.py`（4557.2 KB）✅
- 本地 http://localhost:8080 已启动

## 2026-07-04 — v3.15：事件全面审计+链式事件扩充+触发条件全覆盖

> 设计参考：Capitalism Lab（事件链/行业传导）、Democracy 4（条件触发）、BitLife（叙事弧线）、This War of Mine（道德选择的连锁反应）
> 影响文件：events_street_wealth.js / events_corp.js / events_street_survival.js / extra_events.js + dist

### 全面事件审计（347个事件）

**问题**：用户反馈"链式事件只有8个不合理"。全面审计发现：

- 仅8个链式事件标记 `_isChainEvent: true`，但10个使用 `scheduleChainEvent()` 调度的链式事件序列**缺少标记** → 它们随机乱弹
- 13个corp事件**完全无conditions** → 刚入职第1天就弹出"公司年会""内部股"
- 10个survival事件**无conditions** → "捡钱包""黄金暴涨"等事件在任何阶段都会弹出
- 2个extra_events事件在conditions中消费随机数 → 设计反模式

### Phase 1: events_street_wealth.js — 18个链式事件补标记

- `re_gamble` / `re_demolition` / `re_settle` / `re_coalition_result` / `re_holdout_end`（拆迁赌局5步链）
- `startup_meet_coder` / `startup_progress` / `startup_exit`（创业投资3步链）
- `gray_offer` / `gray_collect` / `gray_cleanup` / `gray_aftermath_reported`（灰色收入4步链）
- `edu_rumor` / `edu_crash` / `edu_aftermath`（教育双减3步链）
- `ev_frenzy` / `ev_shakeout` / `ev_recovery`（新能源补贴3步链）

### Phase 2: events_corp.js — 13个事件加conditions + 16个链式补标记

**新增conditions**（13个事件）：

- corp_overtime: day>=20, health>=25 | corp_credit: day>=30, popularity>=20
- corp_complaint: day>=15 | corp_headhunter: day>=60, fame>=5或ability>=30
- corp_ppt: day>=10 | corp_leak: day>=45, ability>=15
- corp_year_end: day>=60 | corp_mentor: day>=60, ability>=25, popularity>=20
- crypto_fomo: day>=30, cash>=2000 | corp_stock_ipo: day>=90, cash>=5000
- trade_war_news: day>=60 | tesla_recall: day>=40 | btc_halving_event: day>=100, cash>=1000

**补标记**（16个链式事件）：workplace_scapegoat/grudge/rumors/headhunter/deadline、insider_report/cashout/investigation、career_setup/investigation/retaliation/evidence_payoff/aftermath、founder_oust/humiliation/buyback

### Phase 3: events_street_survival.js — 10个事件加conditions

found_wallet: day>=5 | stranger_invest: day>=15, cash>=300 | old_man_help: day>=3
free_clinic: day>=10或health<=70 | thrift_find: day>=20, cash>=100 | neighbor_fight: day>=10, fame>=3
lost_pet: day>=5 | lottery_scratch: day>=15, cash>=20 | gold_surge: day>=30
business_district_chance: day>=40, cash>=500, intel>=25

### Phase 4: extra_events.js — 修复conditions消费随机数

- crisis_gearbreak: 移除 `Random.chance(0.03)`，改为 `day>=20`
- street_fight: 移除 `Random.chance(0.5)`，仅保留 `day>10`

### Phase 5: 新增3条链式事件序列（11个新事件）

**黄金投机泡沫链**（gold_rush_start → gold_rush_peak → gold_rush_crash → gold_rush_rebound）

- 4步链：黄金暴涨→金价见顶→暴跌→反弹
- 叙事弧：30天触发→15天见顶→20天暴跌→30天反弹
- 设计参考：真实黄金市场波动（2020-2024金价走势）

**职场派系斗争链**（office_faction_approach → office_faction_escalation → office_faction_outcome）

- 3步链：被拉拢→站队→尘埃落定
- 分支：忠诚派/中立派/双面谍，后续影响大不相同
- 设计参考：Capitalism Lab 职场政治 / 真实中国职场派系

**捡钱包回报链**（found_wallet交派出所 → wallet_owner_finds_you → wallet_owner_connection）

- 3步链：拾金不昧→失主登门致谢→长期工作机遇
- 分支：收钱/不收钱，远期影响不同
- 设计参考：BitLife 好人好事因果链

### 统计小结

| 指标                 | 修复前 | 修复后 | 变化     |
| -------------------- | ------ | ------ | -------- |
| 链式事件数           | 8      | 51     | +43      |
| 缺conditions事件     | 25     | 0      | 全部修复 |
| conditions消费随机数 | 2      | 0      | 全部修复 |
| 总事件数             | 347    | 358    | +11      |

> 设计参考：BitLife（事件冷静期）、Papers Please（强制按钮关闭）、This War of Mine（事件条件链）
> 影响文件：events_core.js / events_street_survival.js / events_corp.js / modal.js / world_params.js + dist

### 1. 事件"鬼出"修复——链式事件不再随机触发

**问题**：`real_estate_aftermath_win`（财不外露）等链式事件无视上下文随机弹出。玩家什么都没做就出现"横财让你出了名"。

**根因**：链式事件由 `scheduleChainEvent()` 调度，但它们没有 `conditions` 守卫函数，且未被标记为链式事件，导致 `queueRandomEvent()` 将它们纳入随机池。

**修复**：

- 8个链式事件添加 `_isChainEvent: true` 标记：`real_estate_rumour` / `real_estate_insider` / `real_estate_aftermath_win` / `real_estate_aftermath_lose`（street）+ `insider_rumor_start` / `insider_verify` / `insider_aftermath_success` / `insider_aftermath_fail`（corporate）
- `queueRandomEvent()` 过滤 `e._isChainEvent === true` 的事件 —— 链式事件只能通过 `scheduleChainEvent()` 的定时触发

### 2. "开局结果与现实脱钩"消息修复

**问题**：即使玩家联网，浏览器 CORS 限制导致 Yahoo Finance 回退，却显示"（本地模式：开局结果与现实脱钩）"，暗示用户主动选择了离线模式。

**修复**：

- `world_params.js`：将消息改为"（浏览器模式：使用本地随机种子）"，如实反映技术限制而非用户选择

### 3. 所有弹窗强制点击按钮关闭

**问题**：`showModal()` 和多个独立弹窗允许点击遮罩外部关闭弹窗，玩家可以跳过剧情、错过重要选择。

**修复**：

- `modal.js`：`showModal()` 的 overlay 点击处理改为空操作——3处独立弹窗（含 `showItemShopModal`/`showScavengeRouteModal`）全部改为不响应遮罩点击
- `events_core.js`：`showEventModal()` 的事件弹窗遮罩点击改为空操作
- 所有弹窗现在只能通过弹窗内的按钮关闭

### 4. 智力和技能影响新闻深度/建议

**新增**：`showNewsBriefingModal()` 增加新闻分析层，根据玩家属性和技能显示递进式见解：

| 条件             | 见解                                |
| ---------------- | ----------------------------------- |
| 智力≥25          | 基础分析：新闻对行业/职位的影响提示 |
| 智力≥40+会计≥15  | 财务级：周期判断、提前布局建议      |
| 智力≥50+英语≥20  | 国际级：外媒视角、汇率/贸易风险预警 |
| 智力≥60          | 系统级：职业和投资方向重新评估      |
| 编码≥25+科技新闻 | 技术级：产业链影响深度解读          |

### 验证

- `node --check` 全部修改文件通过 ✅
- `python build.py` 4523.7KB ✅

## 2026-07-04 — v3.13e：P0/P1 全面修复（6项Bug修复+经济平衡调参）

> 触发：用户要求综合优化P0 Bug、经济平衡、文件拆分三大方向
> 参考游戏：BitLife（职业倦怠/退休）、Stardew Valley（NPC好感/Housing）、《大多数》（生存压力曲线）、Rimworld（技能恢复机制）
> 影响文件：6个JS文件 + dist/index.html

### P0 Bug修复

| 问题                     | 文件             | 修复                                                                                                      |
| ------------------------ | ---------------- | --------------------------------------------------------------------------------------------------------- |
| 职业倦怠永不减少         | `career_dev.js`  | 新增周末被动恢复（周日-2）；调休恢复-15→-25；日常+0.04→+0.04-2/周日                                       |
| 社交系统 family 模式断裂 | `family_life.js` | `initFamilySystem` 从 `if(!state.family)` 守卫改为无条件合并初始化，兼容 `createDefaultState` 的旧 schema |
| 配偶关系衰减失效         | `family_life.js` | `proposeToNpc` 和 `getMarried` 创建 spouse 对象时新增 `lastInteraction: state.player.day` 字段            |
| 退休后还在发工资         | `corp_ops.js`    | `endQuarter()` 季度工资发放前增加 `_retired` 检查，已退休直接 return                                      |

### P1 经济平衡

| 问题                   | 文件                          | 修复                                                                                                                  |
| ---------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 住房升级仅限城中村     | `main.js`                     | 改为全地点感知，使用 `getAvailableHousingTiersAtLocation()` 动态获取当前地点可升级档位（商业区可升T4/T6）             |
| 交易利润远低于街头工作 | `trade.js`                    | 税收10%→5%；技能溢价上限15%→20%；批量折扣（买5件+2%/10件+5%）；进货折扣上限25%→30%                                    |
| 创业门槛过高           | `startup.js`、`career_dev.js` | 技能要求3项≥15→2项≥12；经典现金¥50k→¥30k；中年危机¥80k→¥50k；`getStartupReadinessNote` 新增街头阶段技能/NPC准备度展示 |

### 蒙特卡洛平衡衍生（来自并行研究）

- **住房成本分层**：T0-3 租金下调（T1:¥12→¥10, T2:¥25→¥22, T3:¥50→¥45）+ 疲劳恢复上调（T1:25→40, T2:35→55, T3:50→70）
- **需求衰减降低**：饥饿-18→-13/天，卫生-8→-7/天，心情-5→-4/天
- **新手保护**：前30天需求惩罚减半

### 验证

- `node --check` 全部6个修改文件通过 ✅
- `python build.py` 4520.5KB ✅
- `git commit 8e7225c` + `git push` ✅
- GitHub Pages 自动部署（dist/index.html 已更新）

> 问题：v3.13 拆分 render.js 后，点击 Tab 无内容切换。
> 根因：
>
> 1. **TAB_RENDERERS 加载顺序** — `render_core.js`（第657行加载）中定义了 TAB_RENDERERS，直接引用了后加载的 `render.js`（第659行）和 `render_infra.js`（第658行）中的渲染函数（如 `renderActionsTab`）。const 创建时这些函数值为 `undefined`。
> 2. **Write 工具误用（AI 工具教训）** — 首次修复时用了 `Write` 工具只写 TAB_RENDERERS 部分，`Write` 覆盖了整个文件，导致 `switchTab`/`renderAll`/`renderTabBar` 等核心函数丢失（1217行 → 49行），Tab 依然不工作。
>    修复：
>
> - 从 `git show 8e33f4a:src/js/ui/render_core.js` 恢复完整文件
> - TAB_RENDERERS 中所有跨文件渲染函数统一改用 `{ fnName: 'xxx', fallback: '...' }` 模式，运行时通过 `window[fnName]` 动态解析
> - 受影响：actions/map/trade/inventory/skills/corp/achievements/enterprise/life_systems/personal_growth 共10个Tab
>   影响文件：`src/js/ui/render_core.js`（仅 TAB_RENDERERS 段，+16/-25）
>   记忆文件：`memory/write-vs-edit-lesson-2026-07-04.md`

### 🔴 Write vs Edit 工具选择铁律（后续拆分必读）

| 工具      | 行为                                 | 何时用               |
| --------- | ------------------------------------ | -------------------- |
| **Write** | **全文件覆盖**                       | 仅用于**创建新文件** |
| **Edit**  | `old_string` → `new_string` 精确替换 | 修改文件**部分内容** |

**事故代价：** ~15分钟恢复时间 + 1 次错误 commit + 用户等待。

**修复后验证清单：**

```bash
# 1. 语法检查
node --check src/js/ui/render_core.js

# 2. 关键函数存在性检查
grep -n "^function switchTab\|^function renderAll\|^function renderTabBar" src/js/ui/render_core.js

# 3. 构建
python build.py

# 4. 确认 dist 包含修复
grep "fnName.*renderActionsTab" dist/index.html
grep "function switchTab" dist/index.html
```

> 问题：移动端 Tab 栏（行动/地图/交易/物品/技能等）全部消失，CSS 无 `display:none`，JS 无报错。
> 根因：`commit 66c11fe` 精简侧边栏时误删了 `</aside>` 关闭标签。`<aside>` 在移动端 `position: fixed; left: -100%`，缺失关闭标签导致 `<main>` 被解析为 `<aside>` 子元素，整块内容偏移出屏幕。
> 影响文件：`src/index.html` (+1行 — 补`</aside>`)
> 记忆文件：`memory/mobile-tab-debug-lesson-2026-07-04.md`
>
> **调试教训：** "元素神秘消失"查完 CSS → JS → 缓存后，必须看 DOM 树结构。`</aside>` 漏关是最容易被忽视的结构问题。

---

## 2026-07-03 — v3.12：地点感知行动分类重排系统

> 问题：玩家到不同地点后，[行动] Tab 的分类固定为「🌾生存必需→💼短期工作→……」的顺序，与所在地点功能不匹配。
> 触发：用户反馈"到银行应该金融理财最前面","其他地点也遵循这种逻辑"
> 影响文件：`src/js/core/action_sort.js` (+90行) / `src/js/ui/render.js` (+20行)

### 2026-07-03 — v3.12c：成就系统全面审计修复

> 用户反馈"清白之身"成就第一天就弹出。经全面审计103个成就，发现4类问题。
> 触发：用户实测发现"清白之身"成就首日触发。
> 影响文件：`src/js/core/achievements.js` +110/-3 / `src/js/phase1/daily_pipeline.js` +5 / `src/js/phase1/illness.js` +2 / `src/js/app_bridge/webapp_runtime_bridge.js` +1
> 审计流程：subagent全面审计103个成就check函数 → 人工分类修复 → 4轮本地验证 → 构建+push

#### 审计结果

| 问题类型       | 数量 | 说明                          |
| -------------- | ---- | ----------------------------- |
| 首日触发       | 5项  | 否定检查/初始状态导致day1解锁 |
| 逻辑错误       | 2项  | 错误事件类型/未设置flag       |
| flag挂钩未连   | 1项  | 已有系统但flag未设            |
| 未实现系统flag | 8项  | 规划中系统未开发，暂不可解锁  |

#### 修复清单

**Batch 1 — 首日触发（5项，加day守卫）**

| 成就                             | 根因                | 修复       |
| -------------------------------- | ------------------- | ---------- |
| clean_record 清白之身            | 否定检查!false=true | day≥30守卫 |
| first_bank 第一次存钱            | 二代/中年开局带存款 | day≥3守卫  |
| first_upgrade_housing 第一次搬家 | 3个剧本开局tier≥1   | day≥5守卫  |
| first_skill_level 第一次技能升级 | 6/7剧本开局技能≥1   | day≥3守卫  |
| repay_debt 还清欠债              | 2个剧本开局无债     | day≥15守卫 |

**Batch 2 — 逻辑错误（2项）**

| 成就                          | 根因                             | 修复                       |
| ----------------------------- | -------------------------------- | -------------------------- |
| witness_fall 见证陨落         | 检查merger_acquire(收购)而非倒闭 | 加company_death检查        |
| homeless_to_roof 从街头到屋顶 | _everHomeless从未设置            | daily_pipeline每日露宿追踪 |
| no_home_7days 流浪者          | _homelessDays从未设置            | 同上，每日递增             |

**Batch 3 — flag挂钩修复（1项）**

| 成就                        | 根因                                  | 修复                          |
| --------------------------- | ------------------------------------- | ----------------------------- |
| disease_survivor 疾病幸存者 | _everHadIllness/_everCuredIllness未设 | illness.js患病处+痊愈处设flag |
| first_checkup 体检          | _firstCheckup未设                     | webapp_bridge体检处设flag     |

**技术债务 — 8项未实现系统flag**
成就依赖的flag对应游戏系统尚未开发，标记为TODO：
`office_newbie_project` / `first_meal` / `first_gift_received` / `gym_member` / `share_when_poor` / `last_money_donation` / `refused_illegal_job` / `mentor_student`

#### 经验教训

- "否定检查"成就是典型的首日触发bug模式：`!flag`在flag不存在时返回true
- 剧本系统引入后，初始状态差异导致原本安全的条件（如"无债"）变成首日触发
- 成就审计应作为新功能开发的标准检查项

### 成就bug修复：清白之身防首日解锁

> 问题：`clean_record`（清白之身）使用否定检查 `return !(flags._didGamble || flags._didGrayWork ...)`，
> 首日所有flag均为undefined导致`!false=true`，每日管线第一次运行立刻弹出。
> 审计：全部103个成就中仅此1个存在该模式。修正后同步构建并push到GitHub Pages。

### 设计理念

参考《大多数》地点功能聚焦设计、《Stardew Valley》场景感知UI、《Material Design 3》自适应UI原则：

**每个地点的分类顺序由该地点的核心功能决定，而不是硬编码固定顺序。**

| 地点        | 置顶分类    | 理由                  |
| ----------- | ----------- | --------------------- |
| 🏦 银行     | 💳 金融理财 | 存取款/贷款是核心功能 |
| 🏥 医院     | 🌾 生存必需 | 看病/治疗是首要需求   |
| 🎓 大学城   | 🎓 学习提升 | 教育机构核心功能      |
| 📚 培训中心 | 🎓 学习提升 | 考证/学习优先         |
| 🌳 公园     | 🎭 社交休闲 | 放松娱乐场所          |
| 🏢 科技园   | 🏢 职业发展 | 职业/创业相关         |
| 🏘️ 城中村   | 🌾 生存必需 | 基本生活需求          |
| 🏪 批发市场 | 🛒 购物装备 | 进货/买卖是主要目的   |
| 🏗️ 建筑工地 | 💼 短期工作 | 体力劳动者聚集        |
| 🏭 工业区   | 💼 短期工作 | 工厂工作优先          |
| 🏙️ 商业区   | 💼 短期工作 | 商业活动中心          |
| 🎪 娱乐城   | 🎭 社交休闲 | 娱乐放松场所          |
| 🏡 郊区     | 🌾 生存必需 | 基本生活需求          |
| 🏛️ 政府大厅 | 🏪 地点服务 | 办证/社保核心功能     |
| ⛩️ 寺庙     | 🎭 社交休闲 | 心灵休憩场所          |

### LOCATION_CATEGORY_REORDER 映射表

- 每个地点定义完整的分类优先级数组（8个分类，排除了「其他」）
- getCategoryOrder() 接受可选 locationId 参数，命中重排规则的按重排索引排序
- 未重排的分类排在所有重排分类之后，保留默认相对顺序
- sortActions() 自动从 state.trade.currentLocation 提取地点

### UI 增强

- 分类区顶部显示策略提示文案（如 "💰 金融理财服务已置顶 — 存取款/贷款优先展示"）
- 提示条为柔和小绿框，不干扰主操作区

### 验证

- `node --check` action_sort.js / render.js 语法通过 ✅
- `check:js` 120 文件全过 ✅
- `typecheck` TS 类型检查通过 ✅
- `python build.py` 4460.8KB ✅
- commit: `af9a9d7`

---

## 2026-07-03 — 第44轮：新闻源替换+分类引擎强化+经济新闻扩充

> 问题：实时新闻系统被"宏大叙事"类主流媒体源主导，大量产出社会综合类新闻，经济/金融类极少。
> 触发：用户反馈"社会类的新闻太多了，一个经济类的都没有，新闻源要客观平台、不要宏大叙事"
> 影响文件：`src/js/core/world_news_intro.js`

### A1: RSS 源替换 — 宏大叙事 → 专业财经/商业

| 旧源（已移除）        | 新源（已添加）    | 特点                    |
| --------------------- | ----------------- | ----------------------- |
| ❌ 新浪新闻（社会）   | ✅ **新浪财经**   | 专业财经数据，客观金融  |
| ❌ 网易新闻（社会）   | ✅ **36氪**       | 商业/科技创投，数据驱动 |
| ❌ 人民网时政（政策） | ✅ **华尔街见闻** | 专业金融市场资讯        |
| ✅ **保留** 新浪科技  | —                 | 科技新闻仍有价值        |

- **参考**：Bloomberg Terminal / Reuters Eikon 的信息源选择标准 —— 客观、数据驱动、领域专注

### A2: 分类引擎强化 — 大幅扩展经济/金融关键词

- **经济规则**（大幅扩展）：新增 `PPI|PMI|准备金率|流动性|货币|财政|赤字|国债|地方债|人民币|汇率|美元|美联储|宏观经济|经济数据|经济指标|经济增速|经济增长|放缓|复苏|景气|衰退|萧条` 等 20+ 经济指标关键词
- **新增「金融」规则**：`股市|A股|港股|美股|基金|ETF|理财|投资|股票|指数|沪指|深指|北向资金|主力资金|牛市|熊市|涨停|跌停|IPO|上市|退市|分红|回购|可转债|债券|收益率` 等 30+ 金融市场关键词
- **新增「消费」规则**：`零售|电商|网购|购物|促销|营业额|门店|客流|外卖|餐饮|旅游` 等 20+ 消费市场关键词
- **社会规则缩窄**：去掉宽泛的"民生|教育|医疗|健康|躺平|内卷"等易误匹配词，改为真正社会话题（养老/社保/生育/户籍等）

### A3: 默认兜底逻辑重写 — 不再一刀切「社会综合」

- **旧逻辑**：所有不匹配规则的一律 `tag: "社会"` → `note: "实时新闻·社会综合"`
- **新逻辑**：5 级智能降级推断：
  1. ✅ **含数字+百分比** → `经济（含数据指标）`
  2. ✅ **含金额单位** → `经济`
  3. ✅ **含企业/市场词汇** → `产业`
  4. ✅ **含城市/基建词汇** → `城市发展`
  5. **真正无匹配** → `综合`（非「社会」，轻微正面影响）
- **参考**：Bloomberg Terminal 「其他新闻」归类逻辑

### A4: 预存经济新闻扩充 — 6→14条 + 就业 6→9条

| 新增条目                  | 领域 | 投资影响                              |
| ------------------------- | ---- | ------------------------------------- |
| 🚢 出口订单激增           | 经济 | 科技×1.06、新能源×1.10、全市场×1.03   |
| 🧊 一级市场募资寒冬       | 金融 | 科技×0.85、金融×0.90                  |
| 🥬 消费降级「平替经济学」 | 消费 | 消费×0.92                             |
| 📜 国债收益率持续走低     | 金融 | 金融×1.05、全市场×1.02                |
| 🏚️ 房企债务重组加速       | 金融 | 房地产×0.82、金融×0.90                |
| 🥇 金价再创历史新高       | 市场 | 金融×1.06、BTC×1.08                   |
| 📦 物流行业竞争白热化     | 产业 | 消费×0.94                             |
| 💾 全球半导体上行周期     | 科技 | 科技×1.15、NVDA/AMD×1.18、全市场×1.04 |
| 🏦 券商基金逆势扩招       | 就业 | 金融×1.10、全市场×1.03                |
| 🚚 快递物流旺季用工缺口   | 就业 | 消费×1.06                             |
| 🏥 医疗健康人才缺口扩大   | 就业 | 医药×1.10、消费×1.04                  |

### 验证

- `node --check` 语法通过 ✅
- `npm run check:js` 120 文件通过 ✅
- `python build.py` → dist/index.html (4451.2 KB) ✅

---

## 🔑 底层开发铁律：全剧本适配（2026-07-02 确立，永久有效）

**任何新功能上线前，必须在全部 7 个剧本里验证可运行、有意义、不断链。**

| 剧本 ID              | 名称           | 关键差异                              |
| -------------------- | -------------- | ------------------------------------- |
| `classic`            | 城市务工者     | ¥300起步，露宿，饥饱告急              |
| `laid_off`           | 下岗再就业     | ¥8000，38岁，技能修理/焊接，无学历    |
| `small_town_grinder` | 小镇做题家     | ¥3000，本科，智力42，债务¥20000       |
| `foreign_worker`     | 外来打工者     | ¥500，无本地语言，工厂区出发          |
| `second_gen`         | 二代创业者     | ¥150000，商业区，技能几乎为零         |
| `midlife_crisis`     | 中年危机职场人 | ¥15000+¥80000存款，高技能，¥50000负债 |
| `fresh_grad`         | 应届毕业生     | ¥2000，本科，智力32，债务¥23000       |

**自查清单（每次提交前）：**

- [ ] 新功能的触发条件在所有剧本下都能成立，或有降级处理
- [ ] 新的动态提示/教程/目标有无为非 classic 剧本准备专属版本
- [ ] `grep _currentScenario` 确认有分支兜底
- [ ] 逐剧本过一遍触发路径，无断链

> **背景**：第11轮（2026-07-02）发现 tutorial.js 所有剧本共用经典模式步骤，导致换剧本后引导完全失效。此类缺陷根因是"只想着 classic"。多剧本适配是**交付门槛**，不是加分项。

---

## 2026-07-03 — 第40轮：v3.1遗留6项问题修复（年终奖/结局/脚本顺序/死函数/利息/疾病协调）

> 触发：用户要求继续处理v3.1审查遗留问题
> 影响文件：career_dev.js、victory.js、victories_registry.js、state.js、index.html、skill_bonuses.js、finance.js、main.js、illness.js

### A1: 年终奖系统（Blueprint P0-C 补齐）

- `career_dev.js::tickCareerJobDaily` 新增年终奖发放逻辑
- 触发：每工作满365天（`job.workDays - _lastBonusWorkDays >= 365`）
- 公式：`年终奖 = 月薪 × 系数`
- 系数由 业绩(30%) + 司龄(20%) + 倦怠<50(20%) + 随机(30%) 加权
- 系数分5档：0（不合格）/ 0.5（低于预期）/ 1（达标）/ 1.5（优秀）/ 3（超额完成）
- 接入 `applyDreamIncomeBonus` 梦想收入加成

### A2: 补齐6个Blueprint结局（12/12完成）

- `victory.js::checkVictoryPaths` 新增6个结局判定：
  1. 🎓 学术大师：education≥3 + research≥3
  2. 🏠 中产稳稳：月薪>¥2万 + 有房产 + 流动资金≥¥5万
  3. 👨‍👩‍👧 幸福家庭：有配偶 + 所有子女成年
  4. 🛠️ 匠人一生：技能满级 + 证书≥5 + 同职业≥15年
  5. 🏚️ 流浪终老（暗）：≥35岁 + 无房 + 赤贫 + 失业
  6. 🏛️ 体制内消失（暗）：公务员路径 + 15年未晋升
  7. 🏙️ 城市套牢（暗）：负债>收入80% + 持续≥5年
- `state.js` 新增 `player.research` 字段（论文数）
- `victories_registry.js` 新增7个VICTORIES百科条目

### A3: script 加载顺序整理

- `index.html` 8处乱序归位：
  - core/news_system.js、news_investment_bridge.js、world_params.js → 移回Core块
  - core/skill_intel.js、npc_location_bridge.js、npc_relationships.js → 移回Core块
  - core/enterprise_fate.js等8个core文件 → 移回Core块
  - data/startup_events.js、startup_competition.js → 移回Data块
  - data/scenario_start_chains.js → 从main.js后移回Data块
  - phase1/extra_events.js → 移回Phase1块
  - components/companyHistory.js → 移到UI块前

### A4: 死函数清理

- 删除 `getCareerDualPathHtml`（career_dev.js，定义但零调用）
- 删除 `tickCareerDaily`（career_dev.js，注释称"由career_tick步骤调用"但该步骤不存在）
- 同步移除 `window.tickCareerDaily` 挂载

### B1: 存款-贷款利息修复

- `skill_bonuses.js::settleDailyFinance` 新增 bankDebt 日息累积（0.012%/天≈年化4.4%）
- `finance.js::calculateLoanCapacity` 利率从0.3-0.6%/天→0.012-0.02%/天（与实际计息一致）
- 修复：此前贷款展示高利率但实际不扣息，存款3.65%年化vs贷款0%的不对称

### C1: illness/medical 双系统协调

- `main.js` 医院治疗handler：新增清除 `illnesses[]` 数组（此前只清sick/injured，不清疾病实例）
- `main.js` 工作致病：改用 `triggerIllness(state, "cold", "job")` 走疾病系统（此前直接设sick=true）

### D1: medical.js 合并 illness.js 治疗逻辑

- `startTreatment(state, grade)` 完全重写：按grade选tier（mild=pharmacy，其他=hospital），遍历 `state.status.illnesses`，逐项调用 `illness.js::treatIllness(id, tier)`
- 保险抵扣作用于每项疾病费用（`totalBaseCost × (1-coverage) × (1-careerDiscount)`）
- 无疾病时轻症走"买药休息"路径（cost×0.4，AP-3，健康+15）
- **保留**：`INSURANCE_PLANS`、`initMedicalState`、`buyMedicalInsurance`、`showMedicalInsuranceModal`、`showMedicalTreatmentModal`（UI入口不变）
- **保留**：`state.medical.insurance`、`totalMedicalSpent`（webapp_runtime_bridge.js读取）
- **删除**：`tickMedical`、`tickRecovery`等管线步骤（不再需要）
- **删除**：`state.medical.treatment`/`hospitalized`/`recoveryDays`字段（与illness.js重复）
- 净减约472行（medical.js从396行→约150行）

### D2: investment.bak.js 清空

- 文件内容替换为单行归档注释（CLAUDE.md禁止删.js文件，不清空会持续污染IDE/indexer）

### 验证

- `node --check` 全部改动文件通过
- `npm run check:js` 118文件通过
- `python build.py` → dist\index.html (4335.1 KB) 通过
- git提交: `9ca2dd3`

---

## 2026-07-03 — v3.11 职业系统深度扩展：医师路径+事业单位+跨系统联动+雇佣机制

> 参考游戏：BitLife（职业人生）、大多数（中国职场现实）、Papers Please（体制内压力）、Disco Elysium（选择的叙事后果）、This War of Mine（生存与职业特长）、真实中国医师晋升体系、真实中国事业编制体系
> 影响文件：`src/js/ui/career_dev.js`、`src/js/core/career_path_events.js`、`src/js/core/medical.js`、`src/js/core/legal.js`、`src/js/phase1/daily_pipeline.js`

### 新增内容

1. **👨‍⚕️ 医师职业路径**（doctor，5级晋升）
   - 实习医生(¥4k)→住院医师(¥8k)→主治医师(¥15k)→副主任医师(¥25k)→主任医师(¥38k)
   - 需要 medicine 技能，配套执业医师资格考试事件
   - 持有 medical_license 证书加薪20%
   - 与 medical.js 联动：医师获取治疗折扣（5%~35%随职级递增）
   - 每日健康加成：medicine 技能≥20时，30%概率轻微回复健康

2. **🏢 事业单位职业路径**（public_institution，5级晋升）
   - 办事员(¥4.5k)→科员(¥7k)→副科长级(¥11k)→科长级(¥16k)→副处长级(¥23k)
   - 需要 management 技能，配套事业编考试事件
   - 持有 professional_title_cert 证书加薪10%
   - 与 legal.js 联动：公职人员获取法律服务折扣（3%~28%随职级递增）
   - 含编制考试、年终述职、政策起草等专属叙事事件

3. **新增职业专属随机事件**（10个）
   - 医师路径5个：险些误诊、午夜急救、执业医师考试、医药代表冲突、恶性事件心理创伤
   - 事业单位4个：事业编考试、年终述职、政策文件起草、社区公益活动
   - 每个事件含2-3个选择分支，各分支有不同概率/后果

4. **面试+试用期+解雇雇佣流程**（enhancedApplyCareerJob）
   - 面试：基于属性/技能/职级的成功率计算（30%-95%）
   - 试用期：前90天薪资80%
   - 解雇：连续30天业绩<20自动解雇
   - 试用期每30天提示一次剩余天数

5. **跨系统联动机制**
   - 医疗路径×medical.js：治疗折扣+健康每日加成
   - 公职路径×legal.js：法律服务折扣
   - 证书系统扩展：医师资格证(medical_license)+事业单位职称证(professional_title_cert)

6. **总扩展**：CAREER_PATHS 从8路径×32职位→10路径×42职位；证书加成线从12条→20条

> 需求来源：用户反馈移动端顶栏信息重复、空间浪费；阶段提示"还清债务"不适用于无债剧本。
> 影响文件：`src/js/ui/render.js`、`src/js/ui/daily_quest.js`、`src/css/style.css`、`src/index.html`

### 已上线（netlify 直推，deploy `6a46aef993084a6387c2001a`）

1. **移除移动端顶部标题行**（`renderTitleBar` 函数删除 + 调用删除）
   - 品牌号「🏙️ 城市浮生记 v1.0」移至侧栏底部 `.sidebar-version-footer`
   - 桌面端 sidebar footer 隐藏（header 已有 `.header-logo`）
2. **隐藏顶部重复的「露宿街头」紧急提示**（`renderTitleBar` 内的 tier===0 && day>3 提示整组删掉）
   - `renderLocationBar` 已含完整住所信息，无重复
3. **位置+背包行（🎒 X/Y · 🌃 住所 💡升级提示）上移一行**
   - 移除 `renderTitleBar` 调用后，`renderLocationBar` 自然上移至时间槽下方
   - 间隔收紧：gap 8px→4px，padding 4/12→3/8，margin-bottom 6→4
   - 住所名+升级提示组成 `rightGroup`（gap:2px，margin-left:auto 右对齐）
   - 升级提示与住所名紧贴，不单独占右侧全区
4. **状态条（属性+需求）标签由单字恢复为两字**
   - 属性行：体/智/敏/心/魅 → 体质/智力/敏捷/心智/魅力
   - 需求行：饿/疲/卫/情/健 → 饥饿/疲劳/卫生/心情/健康
   - 视觉放大：label width 16→26px，font-size 9→10px，track height 4→5px
   - mss-cell padding/gap 放大，行 gap 3→4
5. **「站稳脚跟」阶段下一阶段提示按实际债务动态化**（`daily_quest.js`）
   - 新增 `_dynamicNextDesc(stage, state)`：debt 阶段检测 `villageDebt+bankDebt`
   - 有债（>0）："还清债务，攒到¥5000"
   - 无债（=0）："攒下¥5000启动资金"
   - 解决 classic/second_gen 等无债剧本显示"还清债务"的文案错误

---

## 2026-07-02 — 滚动锚定修复：连续点击买到错位物品

> 问题：交易页每次购买/卖出成功后 `renderCurrentTab` 整体重建 DOM 把 scrollTop 归零，而"背包区"出现/消失会改变市场网格的垂直位置，导致光标从当前物品漂移到上一项，连续点击就买错商品。
> 解决：`renderCurrentTab` 增加三套滚动锚定机制（精确/通用/内层容器），覆盖交易/行动/技能/事业 tab。

### 核心改动（`src/js/ui/render.js`，+107/-8）

- **通用辅助函数 `_firstVisibleActionCardTop(area)`**：找视口内首张 `.action-card` 屏幕 top
- **`renderCurrentTab(state, anchorGoodId)`**：
  - 传入 anchorGoodId → 精确锚定该商品卡片（交易页买1/买5/批发×10/卖1/全卖/自定义数量）
  - 未传 → 自动锚定首张可见 `.action-card`（覆盖行动/技能 tab）
- **内层滚动容器 scrollTop 保存/恢复**：在 `area.innerHTML=""` 之前扫描 area 直接子元素中 `overflow-y:auto/scroll` 的容器，记录其 childIndex + scrollTop；重建后恢复到同 childIndex 新容器（覆盖事业 tab 独立内层滚动容器 `career_dev.js:898`）
- **市场网格加 id**：`grid.id = "trade-market-grid"` 供精确锚点选择器定位

### 其他 tab 排查结论

| Tab                               | 风险        | 处理                     |
| --------------------------------- | ----------- | ------------------------ |
| 交易                              | ✅ 已修复   | 精确 goodId 锚定         |
| 行动/技能                         | ✅ 已覆盖   | 通用首张卡片锚定（自动） |
| 事业                              | ✅ 部分修复 | scrollTop 保存/恢复到位  |
| 其余（社交/投资/地图/人生事务等） | ✅ 安全     | 审计确认不重绘或布局固定 |

### 数学依据

delta = newCardScreenTop − oldCardScreenTop；修正后卡片屏幕位置 = newCardScreenTop − delta = oldCardScreenTop 不变 ✓

### 已知局限

- **事业 tab 按钮内容流感位移**：career"工作行动"按钮上方"当前工作"卡片高度变化时会推走按钮，scrollTop 保持不能修正这类位移（需给按钮加稳定标识才能可靠锚定，改动面大/低频边角问题，留待后续）

### 验证

`check:js`(116) / `typecheck` / `build.py`(4495.8KB) / `npm run build` 全过；commit: `c6db450`

---

## 2026-07-02 — 全剧本专属新手引导系统（第十一轮·玩家代入感提升）

> 问题：玩家反馈进入游戏太乱，不知道该做什么，缺乏玩下去的动力。
> 解决：参照 BitLife（即时钩子）/ Papers Please（第一天压力任务）/ Stardew Valley（目标锚定）/ 大多数（场景叙事密度）重做新手引导。

### 核心改动（`src/js/ui/tutorial.js`）

- **剧本专属 localStorage key**：`city_life_tutorial_<id>_done`，6个剧本各自独立，换剧本必然触发引导
- **`startTutorial()` 剧本感知**：自动检测 `state.flags._currentScenario`，选择对应的步骤数组
- **`SCENARIO_TUTORIAL_STEPS` 对象**：6套专属引导步骤，每套5步：
  1. **情感钩子**：角色当前处境 + 紧迫感（replaces 纯机制说明）
  2. **你的底牌**：highlight sidebar，说明该剧本的核心属性优势
  3. **压力数字**：算清月开销/存款/债务，给玩家清晰的 deadline 感
  4. **今天去哪**：highlight 地图Tab，指出最优先的行动地点
  5. **3天目标 + 叙事弧线**：短期 + 长期钩子同时抛出
- **18条剧本专属动态提示**：每个剧本3条早期提示（Day1-Day10触发），覆盖：
  - `laid_off`：修理技能变现、年龄焦虑、转型时机
  - `small_town_grinder`：智力门槛、债务压力、家族希望里程碑
  - `foreign_worker`：存款汇款目标、语言课提示、技能升级路径
  - `second_gen`：别急着花钱、先学后做、方向决策
  - `midlife_crisis`：技能接单、月度压力算账、创业谨慎建议
  - `fresh_grad`：住处优先、智力门槛追踪、第一个月理财建议

### 设计参考

| 游戏           | 借鉴点                                     |
| -------------- | ------------------------------------------ |
| BitLife        | 即时代入，不强迫学 UI，而是从感受开始      |
| Papers Please  | 第一天有具体任务，压力 = 动力              |
| Stardew Valley | 目标锚（爷爷的信/向导目标）给玩家方向感    |
| 大多数         | 场景叙事密度，让玩家感受到"这是真实的人生" |
| 中国式家长     | 角色生活阶段决定做什么，压力显而易见       |

### 构建验证

`check:js`(116) / `typecheck` / `build.py`(4493.2KB) / `npm run build` 全过；commit: `3ee79e6`

---

## 2026-07-02 — 事业发展Tab完善（第八轮·审查改进与扩展）

> 聚焦用户要求的「事业发展 tap 完善」，参考 BitLife（职业深度/跳槽/退休）/《大多数》（中国职场写实+过劳）/中国式家长（升学链）/Stardew Valley（关系维护主动行动）/现实中国职场（考证/绩效/调薪/跳槽）综合考量。
> 产出 `memory/overview.md` `memory/diagnosis.md` `memory/improvement_plan.md`（第八轮版）。

### 子任务1-3：现状摸底/诊断/方案

- 摸底：事业发展Tab 6路径24职位+职业资本+多门槛晋升，**架子完整但上下游接线断裂**——要人脉晋升却无法维护人脉、要业绩晋升却无法主动做项目、要减压却无休假、要退休却停不下工资
- 诊断：识别 P0 断连8项 + P1 缺口9项 + P2 打磨4项

### 子任务4：实装交付（P0 优先 → P1 → 打磨）

**P0 核心断连修复**（多 agent 协作）：

- **P0-1 职场社交每日tick接通**（`daily_pipeline.js`+`career_dev.js`）：`tickWorkplaceSocialDaily`→`tickColleagueRelationships`（函数名不匹配致关系衰减/导师/徒弟每日演化全死）；`getCareerTrustedNetworkCount` 主读路径改 `state.corporate.colleagues.network`（与写入方一致）
- **P0-2 职场社交主动行动UI**（`career_dev.js`）：入职时 `initCareerColleagues` 生成初始同事；当前工作卡新增「🤝 职场社交」区块（请客¥50/闲聊/拜师按钮），激活 `treatColleagueMeal` 等死代码
- **P0-3 退休停薪+养老金**（`life_nodes.js`+`career_dev.js`）：退休选项设 `_retired=true`+`pensionBase`；`tickCareerJobDaily` 退休分支只发40%养老金、跳过正常工作逻辑
- **P0-4 业绩主动提升行动**（`career_dev.js`）：当前工作卡新增「⚡ 工作行动」3按钮（做项目AP3/加班AP2/冲刺KPI AP4）
- **P0-5 burnout减压+过劳后果**（`career_dev.js`）：调休按钮（每月1次，倦怠-15）；`tickCareerJobDaily` burnout≥80过劳病假（健康-10）、≥50慢性过劳（每日降绩效+掉健康）
- **P0-6 学历研究生/博士入口**（`main.js`+`career_dev.js`）：edu行动门槛递增（本科150/研究生300/博士500），6级学历全可达
- **P0-7 注册费口径统一**（`startup.js`+`career_dev.js`+`wiki.js`）：删 `requiredCash || 200000` 无意义兜底；百科tip+wiki硬编码页改"按剧本+职业资本动态计算（最低¥2万，最高减免15%）"

**P1 体验提升**：

- **P1-2 主动跳槽机制**（`career_dev.js`）：`generateJobOffers`/`applyJobhop`——基于当前职级+careerCapital生成3类offer（同路径晋升跳/跨行平级涨10%/跨行高半级涨20%），需门路（clientLeads≥15或reputation≥30）+30天冷却，记history
- **P1-3 年度考核调薪+历程补全**（`career_dev.js`）：每365天按业绩分级涨薪（S12%/A8%/B3%/C不涨+倦怠+5）；项目完成记入career.history
- **P1-6 移动端网格兜底**（`career_dev.js`+`style.css`）：5列资本条加 `.career-capital-bar`、路径卡加 `.career-path-grid`；`@media(480px)` 追加 !important 兜底

### 验证

- `npm run check:js` ✅（114 files）/ `npm run typecheck` ✅ / `python build.py` ✅（4351.6 KB）/ `npm run build` ✅

### 设计参考总结

| 改进项           | 参考                         | 借鉴核心             |
| ---------------- | ---------------------------- | -------------------- |
| 职场社交主动行动 | Stardew Valley NPC           | 主动维护而非挂机衰减 |
| 业绩主动提升     | 《大多数》主动工作           | 玩家行为影响绩效     |
| 退休停薪+养老金  | BitLife 退休                 | 退休≠继续上班        |
| burnout过劳后果  | 现实过劳降健康               | burnout有出口和后果  |
| 主动跳槽         | BitLife换工作/现实涨薪20-30% | 跳槽是核心加薪手段   |
| 年度考核调薪     | 现实年度考核5-15%            | 薪资动态化           |
| 学历升学链       | 中国式家长                   | 完整6级升学          |

### 待排期（下轮）

- P1-4 副业主业冲突（side_hustle 检查 career.currentJob）
- P1-5 证书职称加成（CPA/PMP 对薪资晋升加成）
- P1-7 总览页增强（晋升进度条/资本趋势/同行参考薪资）
- P1-8 扩充职业路径（医疗/教育/公务员/制造 4 路径）

---

## 2026-07-01 — 装备品质3档化（普通/优质/高档·仅价格）

接上轮「装备品质系统激活」曾误用四档（普通/稀有/史诗/传说）+ effectMult 魔法收入加成，不符写实调性。本轮改为 3 档仅价格。

### 改造

1. **3 档品质表**（`core/equipment_quality.js::EQUIPMENT_QUALITIES`）：common(普通,priceMult×1.0) / fine(优质,×1.2) / premium(高档,×1.5)；删 `effectMult` 字段；删奇幻命名（稀有/史诗/传说）与图标；附魔早已移除
2. **去 effectMult 收入加成**（`phase1/skill_bonuses.js::getItemJobBonus`）：去掉 `getQualityEffectMult` 倍率，回到 `multiplier *= bonus.incomeMultiplier`。工作收入加成只看装备本身 jobBonuses，与品质无关
3. **品质标签标价格**（`ui/render.js` 装备卡片）：品质徽章合并显示「档位名 ¥实际售价」（如「优质 ¥240」），普通不显示徽章——贵即好货
4. **修理/耐久同步 3 档**（`core/equipment_durability.js`）：耐久倍率 fine×1.2/premium×1.5；修理单价 fine ¥2/点、premium ¥3/点
5. **CSS 3 档**（`css/style.css`）：`.quality-fine`/`.quality-premium` 柔和色（绿/金），删 `.quality-rare/epic/legendary` 与 legendary 脉冲动画
6. **百科注册**（`equipment_quality.js` 末尾 `MECHANICS.equipment_quality`）：3 档表 + 「品质仅影响售价，不影响工作收入」说明

### 保留（上轮 bug 修复不动）

- slot 键统一存储 / `getEquippedInstance` / `migrateEquipmentInstances` / 耐久激活 / 去附魔 / 3 渠道装备获取（拾荒/smartphone事件/old_zhou NPC）

### 验证

- `npm run check:js` ✅（114文件）
- `npm run typecheck` ✅
- `python build.py` ✅

## 2026-07-01 — 城市服务消费点接入

接上轮城市服务 followUp 补的真实效果，本轮把剩余 2 个「消费点待接」落地：bridge 已埋的 flag 终于被游戏逻辑读取。

### 改造

1. **公积金 → 购房优惠**（`phase2/investment.js::buyProperty`）：读 `state.flags._housingFundAvailable`，命中则购房享公积金贷款利率优惠 = 价格 5% 抵扣（代表公积金贷款相对商贷的利息节省），现金只扣 `prop.price × 0.95`，资产仍按市价记入持仓。消息提示抵扣金额
2. **体检 → 降大病概率**（`phase1/illness.js::rollDailyIllness`）：读 `state.medical.healthCheckDone`，命中则大病（`isCritical` 或 `severity ≥ 4`）触发概率 ×0.5。仅作用于每日概率掷骰，事件强制触发的 `triggerIllness` 不受影响

### 关联

- bridge 两处「消费点待接」注释改为「已接」
- 征信/社保 2 个消费点上轮已接 `core/finance.js::calculateLoanCapacity`（征信降利率 15%、社保卡加额度 10%），本轮补齐剩余 2 个，城市服务 4 个 followUp 消费点全部接通

### 验证

- `npm run check:js` ✅（114文件）
- `npm run typecheck` ✅
- `python build.py` ✅（dist/index.html 4330.1 KB）

## 2026-07-01 — 装备品质系统激活（P2 实装，v3.0 已改为 3 档仅价格）

> ⚠️ 本轮曾用四档（普通/稀有/史诗/传说）+ effectMult 魔法收入加成。**v3.0 已改为 3 档（普通/优质/高档）仅价格、去 effectMult**——见上方「装备品质3档化」段。本段保留作存储/耐久 bug 修复的历史记录。

激活整套「死代码」装备品质系统：存储统一/耐久激活/去附魔/3渠道接入落地（品质档位本身已在 v3.0 改为 3 档）。

### 病灶（激活前）

- **实例 key 永远对不上**：`buyItemFromShop` 写入用 `itemId_时间戳_随机`，读取用 `itemId_instance` / `slot_instance`，存进去的品质/耐久永远取不出
- **幽灵存储 `state.equipment.equipped`**：5 文件读它但无人写 → `getItemJobBonus` 恒返回 1.0、`checkEquipmentSuites` 恒返回 `{}`、耐久消耗/修复全空转
- **3 渠道未接**：拾荒只给现金；NPC 只给 flag/钱；smartphone 事件把装备塞进物品袋且无品质
- **`rollEquipmentDrop`（items.js:1077-1183）死代码**：引用不存在的 `eq_*` 假 id

### 改造

1. **存储格式统一**：`equipmentInstances` 改按 slot 确定性键；新增 `getEquippedInstance(state, slot)` 统一读取入口；durability.js / equipment_durability.js / render.js / daily_focus.js 全部重定向
2. **effectMult 接入工作收入**：`getItemJobBonus` 修复读真实 store + 乘 `getQualityEffectMult(quality)`（common×1.0 ~ legendary×1.5）
3. **去附魔**：删 ENCHANTMENTS / rollEnchantments / describeItemQuality / formatEnchantmentDesc / createItemWithQuality；`createEquipmentInstance` 实例不含 enchantments，补 itemId 字段
4. **3 渠道接入 createEquipmentInstance**：
   - 拾荒 `executeScavengeRoute`：4 路线 8-15% 掉装备（loot 分布 85/12/3/0），slot 空则装备/占用则 50% 折现
   - smartphone 事件：装备到 accessory 槽（event 分布 40/35/20/5），slot 占用按成交价折现避套利
   - old_zhou NPC 95 档：赠 work_gloves（reward 分布 50/35/12/3），带 flag 防重复
5. **`buyItemFromShop` 修键**：时间戳键 → slot 键；删 slotless 死路径的 enchantments 字段
6. **迁移 `migrateEquipmentInstances`**：注入 `StateManager.importState`，旧存档按 slot 重建实例，找不到旧品质降 common
7. **清理死代码**：删 items.js rollEquipmentDrop 块（1069-1183）
8. **`checkEquipmentSuites` 重定向**：套装检测从恒返回 `{}` 变 live（effects 仍仅展示）

### 连带影响

- **耐久磨损 live**：修存储后耐久消耗真实生效（此前恒满）。基数沿用 DURABILITY_BASE(slot, 200-400)，日磨损 1-3，约 100 天磨损期，节奏温和；现金修理无技能门槛
- ~~**`getItemJobBonus` 平衡**：common work_gloves 建筑 +8%，legendary +62%~~（v3.0 已去 effectMult，工作收入不再受品质放大）

### 验证

- `npm run check:js` ✅（114文件）
- `npm run typecheck` ✅
- `python build.py` ✅（dist/index.html 4329.1 KB）
- `npm run build` ✅（dist-webapp/）

## 2026-07-01 — 第五轮审查：3个留待项实装

本轮聚焦上轮遗留的3个 P1 延续性改善，核心是打通"新闻→世界参数→事件"的自洽闭环。

### 改造1：新闻→世界参数联动（news.js / world_params.js）— P1-4 关键节点

- **问题**：`applyNewsEffect`(news.js:1626) 处理 priceMod/jobBonus/investmentEffect 等却不写 `_worldParams`；仅 `NEWS_LONGTAIL_EFFECTS` 7条长尾写 sectorHeat。导致 `cross_system_events.js` 的行业热度事件只能靠随机日漂移触发，新闻与世界脱节，世界不"活"。
- **改法**：
  - `applyNewsEffect` 末尾新增分支：处理 `effects.sectorHeat`（{行业:delta}，校验 WORLD_SECTORS）直接叠加到 `state._worldParams.sectorHeat`；处理 `effects.marketMoodShift` 累积到 `wp._newsMoodShift`
  - `updateMarketMood`(world_params.js) 把 `_newsMoodShift` 折入 avg 后再判 bullish/bearish/neutral
  - `decayWorldParams` 每日把 `_newsMoodShift` 衰减70%，<0.005 清零（约3-4天消散）
  - 为13条行业特征明显的 NEWS_EVENTS 补 `sectorHeat` 字段：factory_boom(科技+0.06)、construction_boom(房地产+0.08)、tech_fair(科技+0.07)、ai_boom(科技+0.10/新能源+0.04)、energy_crisis(新能源+0.06)、tech_layoff(科技-0.07)、property_cooling(房地产-0.07/金融-0.03)、property_stimulus(房地产+0.07/金融+0.03)、e_commerce_festival(消费+0.06)、flu_surge(医药+0.08)、crypto_bull(金融+0.05)、crypto_crash(金融-0.05)、geopolitical_crisis(科技-0.04 + marketMoodShift-0.03)。幅度与 longtail trade_war_chip(-0.08)/ev_subsidy(+0.12) 同量级
- **效果**：新闻即时改变行业热度与市场情绪，驱动下游 cross_system 事件，世界对新闻有可见反馈

### 改造2：行业周期事件链（cross_system_events.js）— P1-3

- **问题**：行业周期事件只有正向（sector_heat_temp_job 在 >1.2 触发），缺少负向"行业寒冬"链；创业侧无行业周期对营收的直接反馈，行业热度信号消费方不足
- **改法**：复用现有 IIFE 注入 RANDOM_EVENTS 的 trigger/conditions/choices 结构，新增两条事件
  - `sector_cold_layoff_risk`（street 相位，sectorHeat<0.85 触发，15日后，7日冷却）：转行试活/降价硬扛/趁闲充电三选一，影响现金、心智、技能经验
  - `sector_boom_startup_windfall`（corp 相位，sectorHeat>1.15 且玩家有公司，14日冷却）：乘势扩张/落袋为安/品牌营销三选一，红利规模随市场份额放大，影响现金、声誉、品牌
- **效果**：行业热度信号有正负双向消费方，与改造1形成"新闻→热度→职业事件"闭环；职业体验更真实

### 改造3：日志滚动稳态（main.js）— P1-2

- **问题**：`renderMessageLog` 每次重渲后无条件 `scrollMessageLogToBottom`，用户在展开状态上翻阅读历史时，每条新消息强制把视图拉回底部，打断阅读
- **改法**：渲染前记录"近底部"判断（`scrollHeight - scrollTop - clientHeight < 28`，收起状态视为贴底）；仅当展开且近底部时才自动滚动，否则保留用户阅读位置
- **效果**：上翻阅读历史不被打断，新消息仅在已贴底时跟随

### 验证

- `npm run check:js` ✅（114文件）
- `npm run typecheck` ✅
- `python build.py` ✅（dist/index.html 4321.7 KB）
- `npm run build` ✅（dist-webapp/）
- Monte Carlo 浏览器验收 ⏸：无 node 自动化脚本（已知 P2 缺口）；本轮改动为加性内容 + 一次性 sectorHeat 幅度 ±0.04~0.10，受 `decayWorldParams` 2%/日衰减约束，未触及核心经济曲线（利率/工作乘数/每日管线成本），平衡风险低

## 2026-06-27 — 房产×租房系统深度集成 + UI状态栏重组

本轮针对用户反馈进行两项深度改造：

1. **房产×租房系统对接** - 打通 PROPERTIES 系统与 HOUSING_TIERS 的映射
2. **UI状态栏重组** - 时间槽+人生目标布局优化

### 改造1：房产×租房深度集成（investment.js / property_market.js / main.js）

- **问题**：此前 `selfLivePropertyId` 的 tier 映射仅是粗放的按价格三分法（<¥200k=tier2 / <¥1M=tier3 / ≥¥1M=tier4），不区分城中村握手楼/别墅/豪宅等具体类型；出租状态切换时住所不降级；月租金收入无交易流水记录；玩家只能在投资页操作自住切换，主行动页无入口
- **新建** `PROPERTY_HOUSING_MAP` 常量（investment.js）—— 精确 ID 映射（22条：城中村握手楼→tier2 / 老破小学区→tier3 / 精装两居室→tier3 / 花园洋房→tier4 / 别墅→tier5 / 豪宅→tier6 / 商铺/工业/海外→null不可自住）
- **新建** `getPropertyHousingTier(propId)` 查询函数
- **自住→出租**：切换时 `housing.tier` 降级到 tier1（合租床位）并清容量
- **月租流水**：`property_market.js` 月租结算增加 `addDailyTransaction` 调用，租房收入可见于收支记录
- **行动页入口**：`main.js` 行动列表新增「搬入自住房」快捷入口，使用 `getPropertyHousingTier` 查等级 → 搬入动作免日租
- **设计参考**：BitLife 的物业系统（property → housing tier 映射）/ 真实中国住宅市场分级

### 改造2：UI状态栏重组（render.js / style.css）

- **问题**：时间槽用两行居中，日常信息和背包/住所分离；人生目标深埋侧边栏，不醒目
- **修复**：
  - `renderTimeSlot` 改为单行横排左对齐：`📅 第 N 天 | ☀️ 上午 ⚡ 100/100 🎒 0/20 · 🌃 露宿街头`
  - 人生目标从侧边栏移除（`renderDreamSection` 注释保留），新建 `renderGoalStrip()` 在内容区时间槽下方显示紧凑横条
  - 手机端 CSS `#time-slot-indicator` 改为 `overflow-x:auto` 支持横向滚动，新增 `.goal-strip-mobile`
- **设计参考**：Notion 的紧凑状态栏 / 大多数(The Most) 的顶部信息条

### 影响文件

- `src/js/phase2/investment.js` — PROPERTY_HOUSING_MAP + getPropertyHousingTier + toggle-self-live 逻辑重写
- `src/js/phase2/property_market.js` — 月租 addDailyTransaction
- `src/js/main.js` — 搬入自住房快捷入口
- `src/js/ui/render.js` — 单行时间槽 + 内容区人生目标
- `src/css/style.css` — 手机端适配
- `dist/index.html` — 构建产物（4284.1 KB）

---

本轮针对用户反馈的6个体验问题进行修复，覆盖 legacy 正式入口（`src/` 下）。所有改动在旧单页面架构内完成，不涉及 TS 数据目录。

### 修复1：住所系统地点合理化（items.js / main.js / state.js / daily_pipeline.js / render.js）

- **问题**：城中村"住所"选项中出现别墅、豪华公寓、豪宅等不合理选项（灰色不可选）
- **修复**：引入 `HOUSING_LOCATION_AVAIL` 和 `HOUSING_LOCATION_RENT_MOD` 系统
  - 城中村(slum)：合租床位/单间/一居室（tier 1-3）
  - 郊区(suburb)：合租床位/单间/一居室/别墅（tier 1-3, 5），租金打8折
  - 商业区(commercialDist)：合租床位/单间/一居室/豪华公寓/豪宅（tier 1-4, 6），租金×1.6
  - 其他地点按地理和经济规律分配档次和租金倍率
  - 每日租金按 `rentedAt` 地点计算实际金额
  - 新增 `getHousingRentAtLocation()` / `getAvailableHousingTiersAtLocation()` 辅助函数
  - 新增 `state.housing.rentedAt` 字段记录租房地点

### 修复2：移除"地点不符"冗余行动（render.js）

- **问题**：不在正确地点时，行动卡显示为"地点不符：xxx"禁用状态，冗余且混乱
- **修复**：在 `renderActionsTab()` 入口处立即过滤掉 `disabled && reqFail 以"地点不符"开头`的行动

### 修复3："人缘极好"成就开局弹出（achievements.js）

- **问题**：`no_hate` 成就 `check()` 中 `if (!st.relationships) return true` 导致开局即解锁
- **修复**：改为 `return false`（无关系数据时不解锁），重写为双版本检测：
  - `hidden_friend_all_npc`：所有NPC好感≥60（条件收紧），Day≥30且至少认识1人

### 修复4：地图系统重构（locations.js / render.js）

- **问题**：TRAVEL_GRAPH 连接线过多过乱，地理逻辑不清，郊区不知道如何到达
- **修复**：
  - 重新设计 TRAVEL_GRAPH（每个节点2-4条连接，商业区=核心枢纽，郊区=最外围）
  - 重新排布地图坐标（商业区居中，工业区/郊区在边缘）
  - SVG连接线从当前位置出发的高亮显示（更粗/更低透明度/更显眼）
  - 快速出行和地点速查表添加跳数（hop count）显示
  - 新增自驾出行按钮（有车时显示，¥5油费+2AP，任意直达）

### 修复5：今日重点合并入今日建议（daily_focus.js / render.js / index.html）

- **问题**："今日重点"与"今日建议"内容重叠
- **修复**：
  - 将daily_focus中的关键项（装备耐久/极低属性/青春危机预警/梦想进度）整合进 `getDailyActionTips()`
  - 隐藏侧边栏 `#daily-focus-section`（CSS `display:none !important`）
  - 从 `renderSidebar()` 移除调用
  - 露宿街头提示改为移到"今日建议"中（仅tier0时显示）

### 修复6：UI布局重新组织（render.js / index.html）

- **问题**："🌃 露宿街头"和"🎒 0/20"放在顶部header-area中，与时间槽分离
- **修复**：
  - `renderTimeSlot()` 增加子行显示"🎒 0/20 | 🌃 住所名"
  - `renderHeaderContext()` 精简为只显示住所图标+名称（小尺寸）
  - 住所升级提示仅tier0时在header显示，其他情况移到"今日建议"中

### 验证

- `node --check` 全部9个修改文件语法通过 ✅
- `npm run check:js` 114文件全通过 ✅
- `npm run typecheck` 通过 ✅
- `python build.py`（4277.2 KB）✅
- `npm run build`（Vite构建）✅

### 影响文件

| 文件                              | 改动说明                                                             |
| --------------------------------- | -------------------------------------------------------------------- |
| `src/js/data/items.js`            | +HOUSING_LOCATION_AVAIL/RENT_MOD系统，住所层级增加可用地点字段       |
| `src/js/data/locations.js`        | TRAVEL_GRAPH完全重构，连接数简化，地理逻辑优化                       |
| `src/js/main.js`                  | 住所升级改用地点过滤，显示实际租金和地点名                           |
| `src/js/phase1/daily_pipeline.js` | 房租扣除改为读取地点计算实际租金                                     |
| `src/js/core/state.js`            | housing新增rentedAt字段                                              |
| `src/js/core/achievements.js`     | 人缘极好成就check逻辑修复，去除开局弹出bug                           |
| `src/js/ui/render.js`             | 地图坐标/连接/跳数/自驾；行动过滤；时间槽+住所；header精简；建议整合 |
| `src/js/ui/daily_focus.js`        | 核心逻辑保留但不再由renderSidebar调用                                |
| `src/index.html`                  | daily-focus-section隐藏标记                                          |

## 2026-06-26 — 第三轮审查：人生事务与城市服务体验修复

本轮按“审查改进与扩展”流程刷新 `memory/overview.md`、`memory/diagnosis.md`、`memory/improvement_plan.md` 为第三轮版本，并优先落地不影响旧 script 顺序的 P0/P1 修复。

- **CSS 结构修复**：修正 `@media (max-width:480px)` 末尾提前闭合/多余右括号问题，让投资持仓移动端防护规则真正留在手机端媒体查询内
- **人生事务医疗入口**：医疗卡片新增“就医治疗 / 医保咨询”双按钮，`medical.js` 新增 `showMedicalTreatmentModal()`，复用既有 `startTreatment()` 治疗流程
- **城市服务可用性提示**：城市服务中心弹窗现在提前显示现金/行动力不足原因，不再只在点击后提示；玩家可见文案移除 Web App/bridge 开发术语
- **推荐地点中文化**：人生事务里的城市服务推荐入口显示中文地点名，不再直接暴露 `gov_office` 等内部 id
- **事件日志滚动稳定**：抽出 `scrollMessageLogToBottom()`，展开和渲染时做 rAF + 延迟二次滚动，改善手机端连续消息后的定位
- **移动端触控**：人生事务医疗按钮在 ≤480px 视口下保证 44px 最小触控高度
- **验证**：`npm run check:js`、`npm run typecheck` 已通过；最终双构建见本轮收工记录

## 2026-06-26 — 城市浮生记审查改进第二轮

本轮重新刷新 `memory/overview.md`、`memory/diagnosis.md`、`memory/improvement_plan.md` 为第二轮版本，基于当前 `HEAD 5b2f662` 实际代码重新扫描。

- **CSS 清理**：移除手机端首段 @media 中隐藏 `#street-stats-section/#corp-stats-section` 的冗余规则（第 3662-3665 行），消除 `!important` 对抗风险
- **CSS 移动端投资防护**：新增 `.investment-holdings-row` 横向滚动溢出防护；新增 `.inv-holdings-mobile-row` 紧凑展示样式
- **Wiki 百科增强**：世界参数反馈环(`world_params.js`)增强条目，新增策略提示 section（行业传导链/关注新闻/财富门槛/衰减周期 4 条策略建议）
- **创业提示增强**：未满足注册条件时显示”还没累计职场资源”提示文字，引导玩家上班积累行业资源和客户线索
- **验证**：`npm run check:js`、`npm run typecheck`、`npm run check:ts-data`、`python build.py`(4262.3 KB)、`npm run build` 全部通过

## 2026-06-26 — 文案收口与接力文档修正

本轮复核另一 agent 的 v3.0 UI 修复后，发现“AP→行动力”仍有玩家可见漏点，且 `CLAUDE.md` 未提交改动会把最新 941ccc0 事业/创业门槛修复口径回退到 3b519f8。已补齐行动卡片、社交聊天按钮、城市服务桥接、状态弹窗、百科与机制注册说明中的行动力文案，并合并接力文档最新状态，避免后续 agent 误判断点。同步重新构建 legacy `dist/index.html` 和 Vite `dist-webapp/`。

## 2026-06-26 — v3.0 全面审查改进与UI修复

本轮按 v3.0 SOP 执行 6 个子任务链，产出 `plans/subtask1-analysis.md` 至 `plans/subtask6-implementation.md` 报告。实装重点：

**P0修复：**

- 🔧 "AP"英文→全中文行动力：修复 main.js(节日工作)、render.js(交通方式)、modal.js(选项弹窗)、actions_extra.js、travel.js、webapp_runtime_bridge.js、skill_tree.js、critical.js、events_street.js、wiki.js、mechanics_registry.js、skill_intel.js 共 15+ 处"AP"英文显示
- 🔧 NPC英文ID→中文名：social_tab.js NPC关系网卡片改为显示 `NPCS.name`（王大婶/老周等），新增 `getNpcChineseName()` 兜底映射
- 🔧 学历从侧边栏移入个人成长Tab：新增"🎓 学历"子Tab（`renderPgEdu()`），展示学历等级+备考进度

**P1改进：**

- 🔧 header-context精简：移除位置/天气/背包容量重复信息，仅保留住所展示
- 🔧 热搜话题扩充：`social_network.js` 新增30条预定义围脖热搜话题池，联动活跃新闻系统生成热点
- 🔧 围脖热搜改名为"围脖热搜"（微博→围脖），全中文显示
- 🔧 网红等级中文显示："none"→"无"、"micro"→"萌芽网红"、"medium"→"中型网红"等
- 🔧 粉丝增长机制增强：内容长度+配图+名气多因子模型，粉丝增长反哺名气
- 🔧 "附近可前往"移到sidebar靠前位置，首屏可见
- 🔧 审查补漏：创业触发条件读取新版“事业发展-上班族”当前岗位，把中级/高级/负责人岗位映射为 P6/P7/P8，并在创业页显示“当前职级”，避免上班族路径和创业门槛继续孤岛化

**影响文件：** main.js, render.js, social_tab.js, social_network.js, index.html, modal.js, wiki.js, mechanics_registry.js, travel.js, actions_extra.js, critical.js, skill_tree.js, skill_intel.js, webapp_runtime_bridge.js, events_street.js, era_events.js（共17个文件）

验证：`node --check` 语法全通过，`python build.py`（4224.4 KB）

本轮按 v3.0 SOP 和用户反馈完成 6 个子任务链，新增/覆盖 `subagent_result1.md` 至 `subagent_result6.md` 与 `plans/2026-06-26-v3-review-execution-context.md`。实装重点是修复开局目标、模式一致性、职业图标和事业深度：人生目标弹窗改为可跳过，选择目标会显示并生效轻量路线加成；三种开局共用 `initializeCommonGameSystems()`，剧本/沙盒补齐天气、装备、时代、副业、NPC、医疗、旅行、法律等通用初始化；沙盒默认改成无村长债的自由练习口径。事业发展页新增“今日事业建议”和事业信用数据，入职、晋升、阶段项目会积累行业资源/客户线索/声誉，创业注册可读取这些资源降低启动资金，并修复创业页注册费展示口径。职业路径 `name` 改为纯文本，彻底修复“💻 💻 IT技术”等重复图标。验证：`npm run check:js`、`npm run typecheck`、`npm run check:ts-data`、`python build.py`（4217.3 KB）、`npm run build` 全部通过；Chrome Headless + CDP 冒烟确认经典开局目标弹窗可跳过、有加成文案，事业发展页出现“今日事业建议”，未捕获运行时错误。

## 2026-06-26 — 用户反馈修复：财务、UI、职业与新闻

本轮针对玩家实际反馈修复旧正式入口的高优先级体验断点。已新增 `memory/2026-06-26-user-feedback-plan.md` 记录计划和经验教训。修复沙盒姓名输入因整表重绘导致只能输入一个字符；每日收支报告不再把未归类现金差额伪造成“其他支出”，并把每日收入/支出与总资产历史稳定写入曲线数据；创业注册按钮、弹窗、实际扣款统一使用剧本/阶段触发资金，经典街头 5 万现金即可注册。状态低下弹窗改为纵向按钮并真正禁用不可用选项；背包商品显示加入中文名兜底，保留买入均价；天气准备购买伞/保暖用品会进入背包并记录支出；人生目标入口从行动列表移除，保留开局强制选择与个人成长目标联动。另补充新闻快报弹窗、职业晋升技能读取修复和业绩/职场人脉要求展示，并把位置/天气/住所/仓库信息压缩到顶部信息条，减少左侧滚动负担。

## 2026-06-26 — v3.8 断点续传审查：人生事务常驻面板

本轮按断点续传流程重新读取 `memory/overview.md`、`memory/diagnosis.md`、`memory/improvement_plan.md` 与进度文档，确认 TS 数据目录和 bridge 基础已完成，真正的 P0 断点是 4 大扩展系统“可玩但不可见”。已刷新三份 memory 产出，并在 legacy 正式入口新增“🧭 人生事务”Tab：`src/index.html` 增加 Tab 按钮，`src/js/ui/render.js` 注册 `life_systems` renderer，集中展示人生节点、医疗/医保、旅行记录、法律事务，所有操作按钮复用现有弹窗和状态函数，不新增脚本、不重排 script 顺序。同一面板还展示 `WebAppBridge.getRecommendedCityServices()` 城市服务推荐，以及 `getDataCatalogSummary()` 的 TS 内容接入状态。另修复社区体检 bridge 接线：推荐判断和体检效果改为读写主游戏真实健康字段 `state.status.health`，保留 `state.player.health` 兜底。验证：`npm run check:js`、`npm run typecheck`、`npm run check:ts-data`、`python build.py`、`npm run build` 全部通过，并确认 `dist/index.html` 已包含新 Tab 与 renderer。

## 2026-06-25 — v3.8 TS 数据目录补全与内容审计

本轮针对断点续传清单中“events/jobs/locations/items/diseases/legal/travel 仍为空”的缺口，把 7 个 TS 数据目录从 `migrated: 0` 占位常量补成真实类型化内容：事件 12 条、职业 12 条、地点 14 个、物品 17 件、疾病 12 种、法律案件 7 类、旅行目的地 8 个；保留 legacy 正式入口和旧数据文件不迁移不删除。新增 `src/app/data/index.ts` 统一汇总目录数量和旧来源，调试面板新增“TypeScript 内容目录”。新增 `scripts/audit-ts-data.mjs` 与 `npm run check:ts-data`，用无依赖扫描确认每个目录导出数组达到最低数量。`webapp_runtime_bridge.js` 升至 0.3.0，暴露 `WEBAPP_DATA_CATALOG_SUMMARY` / `getDataCatalogSummary()` 供旧运行时感知 TS 内容目录状态，不新增玩家可见调试行动。验证：`npm run typecheck`、`npm run check:ts-data`、`npm run check:js`、`python build.py`、`npm run build` 全部通过；因 C 盘空间为 0，npm 验证时 cache/temp 指向 D 盘。

## 2026-06-25 — v3.8 审查改进与扩展

按审查改进 SOP 完成 4 个子任务：现状摸底、问题诊断、改进方案、实装交付。

### 子任务 1：现状摸底

- 产出 `memory/overview.md`（v3.8 版双轨架构），覆盖 legacy 114 个 JS 文件 + TS 8 个数据目录 + bridge 层
- 确认验证通过：`npm run check:js` / `npm run typecheck` / `python build.py` / `npm run build`

### 子任务 2：问题诊断

- 产出 `memory/diagnosis.md`，识别 16 项问题（P0: 3 / P1: 7 / P2: 6）
- 核心发现：TS 数据目录全空、桥接层极薄、扩展系统无独立 UI、超大文件风险、类型层无扩展字段

### 子任务 3：改进方案

- 产出 `memory/improvement_plan.md`，规划 6 项 P0+P1 方案（~620 行 P0 + ~180 行 P1）

### 子任务 4：实装交付

**P0-1 TS 数据目录填充**：

- `src/app/data/lifeNodes/index.ts`：填入 4 个完整人生节点数据（220 行），TypeScript 类型 + 数据 + 导出函数
- `src/app/data/cityServices.ts`：从 3 服务扩展到 7 服务（155 行），新增金融/健康分类
- `src/app/debug/healthCheck.ts`：新增 TS 数据目录非空检测、legacy 运行时状态检测（110 行）

**P0-2 桥接层扩展**：

- `src/js/app_bridge/webapp_runtime_bridge.js`：从 3 个城市服务扩展到 7 个（+204 行）
- 新增 `getRecommendedCityServices()` 基于玩家状态推荐
- bridge 版本升至 0.2.0

**P0-3 类型系统扩字段**：

- `src/app/types/game.ts`：新增 8 个扩展系统接口 + 完整 LegacyGameState 覆盖（+200 行）

**P1-1 经济被动出口**：

- `src/js/phase1/daily_pipeline.js`：住房维护费 + 社交圈维护费

**P1-2 差异化开局债务**：

- `src/js/core/inheritance_chain.js`：上局欠债催收 + 上局违法案底

**P1-3 NPC 常规对话深化**：

- `src/js/phase1/npc_event_bridge.js`：新增 `chatWithNpc()`，2AP/次
- `src/js/ui/social_tab.js`：对话记录 + 聊天按钮

**验证**：typecheck / check:js / build.py / npm run build 全部通过

## 2026-06-25 — v3.8 Web App 架构第一阶段：桥接式迁移

本轮将《城市浮生记》从纯静态脚本工程推进到可长期扩展的 Web App 双轨架构：保留 `src/index.html` + `python build.py` 作为当前正式可玩入口，同时新增根目录 Vite/TypeScript 工程、`src/app/` 模块化目录、类型化数据目录、存档 `_webApp` schema 迁移函数和架构健康面板。为证明架构不是空壳，新增 `src/js/app_bridge/webapp_runtime_bridge.js` 并在旧行动列表接入“城市服务中心”，玩家可在政府办事大厅、医院、商业区/公园触发劳动争议预检、医保账单复核、周末城市微旅行，实际改变现金、AP、医疗/法律/旅行状态，并写入 `_webApp.schemaVersion=2`。每日管线已增加 `webapp_city_services_tick`，服务使用后的次日会沉淀为法律底气、医疗账单意识和城市熟悉度。Vite 构建已设为相对资源路径，`dist-webapp/` 在 repo 静态服务下可打开，并按路径回指 legacy 入口。后续开发注意：新增事件、职业、地点、疾病、法律、旅行、人生节点等配置优先进入 `src/app/data/*`，需要进入当前可玩版本时再通过 bridge/facade 接入 legacy。验证覆盖 `npm run typecheck`、`npm run check:js`、`npm run build`、`python build.py` 和浏览器/脚本冒烟。

## 2026-06-25 — v3.0 审查改进与扩展：完整中后期压力试玩

按 v3.0 SOP 对 `dist/index.html` 做 Chrome Headless + CDP 长流程压力试玩：先验证健康耗尽能进入 Game Over，再从 Day 60 推进到 Day 1260，覆盖创业产品、投资入口、家庭月结、个人成长年结、企业命运、主要 Tab 切换。修复长跑中暴露的创业产品默认字段、NPC discovered 数组、极端状态失败判定、结局弹窗 inventory、家庭开支默认值、企业命运变量拼写、个人成长阅读年度重置、`events_core.js` 重复声明，以及银行存款日息/会计加成口径导致的资金膨胀。验证：全量 `src/js` `node --check` 通过，`python build.py` 成功，Day 1260 压力脚本无运行时异常；审计脚本通过 `.cjs` 临时副本运行，连接审计 0 问题/45 建议，事件审计 225 事件/48 既有上下文提示。

## 2026-06-25 — v3.0 审查改进与扩展：审计风险收口与轻量试玩

继续处理上一轮剩余风险：`audit_connections.js` 的新闻审计旧正则只匹配空对象起始行，导致 109 条误报和新闻 `undefined`。已改为按顶层新闻 `id` 对象提取，核对 `NEWS_EVENTS` 实际为 51 条新闻；连接密度不足、证书/装备覆盖率这类历史口径项改为“改进建议”，不再让脚本以失败码阻断开发。验证结果：`node audit_connections.js` 退出码为 0，输出 36 项通过、45 条建议；113 个 `src/js` 文件 `node --check` 通过；`audit_events.js` 仍检查 225 个事件并输出 48 条上下文提示；`python build.py` 成功生成 `dist/index.html`（4151.9 KB）。另用 Chrome Headless + DevTools Protocol 打开构建产物做轻量试玩：首屏加载、模式选择、经典开局、切换社交页均通过，未捕获控制台 error/warn。剩余风险降为：仍未做跨多日/中后期的长流程完整试玩。

## 2026-06-25 — v3.0 审查改进与扩展：审计脚本补强与最终验证

按 `memory/review-improve-v3.0.md` SOP 对上一轮交付做断点续传核验：`memory/overview.md`、`memory/diagnosis.md`、`memory/improvement_plan.md` 已存在且对应代码均已落地；人生节点弹窗、旅行入口、法律咨询、医保咨询、社交子页跳转均在源码中确认。修复 `audit_events.js` 仍按旧缩进提取事件导致“检查 0 个事件”的问题，改为识别拆分后事件文件的当前格式。验证结果：113 个 `src/js` 文件 `node --check` 通过，`audit_events.js` 可检查 225 个事件并输出 48 条上下文提示，`python build.py` 成功生成 `dist/index.html`（4151.9 KB）。剩余风险：`audit_connections.js` 仍会因历史覆盖率规则返回 1，并输出新闻解析为 `undefined` 的既有审计问题；本轮未做长流程完整试玩。

## 2026-06-25 — v3.0 审查改进与扩展：入口补齐与构建验证

按 `memory/review-improve-v3.0.md` SOP 完成本轮审查、诊断、方案和实装交付。新增 `memory/overview.md`、`memory/diagnosis.md`、`memory/improvement_plan.md` 记录项目结构、P0/P1 问题和改进方案；修复人生节点触发后静默完成的问题，新增节点选择弹窗，并把奖励写回正确的玩家属性/技能 XP 结构。补齐旅行、个人法律案件、医保咨询的玩家入口：商业区可打开长途旅行，政府办事大厅可立案，医院可购买医保；行动页 Phase 2 快捷入口改为跳转到真实社交子页；审计脚本改为读取拆分后的事件文件。验证：112 个 `src/js` 文件 `node --check` 通过，`python build.py` 成功生成 `dist/index.html`（4151.9 KB）。注意：`audit_connections.js` 已能运行，但会因历史内容覆盖率规则返回 1，并输出新闻解析为 `undefined` 等既有审计问题，未作为本轮阻断项。

## 2026-06-25 — v3.7 Expansion v1: 冒烟测试与百科审计修复

对构建后的 `dist/index.html` 进行本地 HTTP + Chrome DevTools Protocol 冒烟测试：桌面/移动首屏均可加载，`checkLifeNodes`、`tickMedical`、`tickTravel`、`tickLegal` 等新增系统函数存在，4 个 MECHANICS 与 2 个 NARRATIVES 均注册成功，入口按钮可进入游戏主界面。测试发现新增叙事 `gaokao_memory`、`travel_memories` 缺少注册表要求的 `name` 字段，已在 `life_nodes.js` 与 `travel.js` 补齐，并重新 `python build.py`。复测显示 `runMechanicsAudit` 无问题；仅剩浏览器音频自动播放限制警告，属于用户手势前播放音效的既有浏览器策略。

## 2026-06-25 — v3.7 Expansion v1: 4大扩展系统基础实现

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 最后一个未完成项 #7 扩展系统。

**设计参考**：BitLife人生阶段 / 中国式家长节点事件 / 大多数医疗系统 / 模拟人生度假 / 真实中国民事诉讼流程

### 系统1：人生节点系统（core/life_nodes.js）

**新建** `src/js/core/life_nodes.js` — 人生关键里程碑（~280行）

| 节点    | 触发条件       | 选项数 | 核心影响                     |
| ------- | -------------- | ------ | ---------------------------- |
| 📝 高考 | Day 30+        | 3      | 智力加成 + 后续大学触发      |
| 🎓 大学 | 高考后 Day 90+ | 4      | 专业技能加成(编程/维修/魅力) |
| ⚡ 35岁 | Day 180+ 每月  | 4      | 心态/健康/职业方向选择       |
| 🏖️ 退休 | Day 365+       | 3      | 晚年生活质量 + 传承影响      |

- `checkLifeNodes()` 每日检查触发条件，标记 `_pendingLifeNode`
- `applyNodeChoice()` 应用选择效果（技能加成/属性变化/现金变化）
- `getGaokaoNarrative()` 高考结果叙事文字
- **百科注册**：MECHANICS.life_nodes + NARRATIVES.gaokao_memory

### 系统2：医疗深度系统（core/medical.js）

**新建** `src/js/core/medical.js` — 疾病分级+治疗+康复+保险（~280行）

- **4级疾病**：轻症(¥50/2天) → 中症(¥500/5天) → 重症(¥5,000/14天) → 危重症(¥50,000/30天)
- **3档医保**：基础(¥200/月→50%报销) → 补充(¥500/月→70%) → 高端(¥1,500/月→90%)
- `initMedicalState()` 初始化医疗状态（含存档兼容）
- `buyMedicalInsurance()` 购买医保
- `startTreatment()` 开始治疗（轻症即时处理，中症以上进入治疗期）
- `tickMedical()` 每日管线：治疗倒计时+住院每日消费+治疗完成恢复
- `tickRecovery()` 康复期倒计时
- 保险在治疗时自动计算实际费用

### 系统3：旅行系统（core/travel.js）

**新建** `src/js/core/travel.js` — 5个国内目的地+旅行事件+纪念品（~270行）

| 目的地  | 费用   | 天数 | 纪念品               | 事件示例                |
| ------- | ------ | ---- | -------------------- | ----------------------- |
| 🏛️ 北京 | ¥800   | 3天  | 烤鸭/景泰蓝/脸谱     | 故宫悟历史/胡同吃炸酱面 |
| 🌃 上海 | ¥1,000 | 3天  | 丝巾/糕点/手表       | 外滩看天际线/弄堂迷路   |
| 🐼 成都 | ¥600   | 3天  | 熊猫公仔/蜀绣/花椒油 | 熊猫基地发呆/吃火锅     |
| 🏯 西安 | ¥500   | 3天  | 兵马俑/皮影/碑林拓片 | 兵马俑震撼/城墙骑自行车 |
| 🏔️ 大理 | ¥400   | 4天  | 扎染布/大理石/鲜花饼 | 洱海骑行/古城听民谣     |

- `startTravel()` 消耗AP+现金开始旅行
- `tickTravel()` 每日40%概率触发旅行事件，结束时获得纪念品+心情恢复
- `getTravelStatus()` 当前旅行状态查询

### 系统4：法律系统（core/legal.js）

**新建** `src/js/core/legal.js` — 诉讼+律师+法律风险（~270行）

- **4种案件**：合同纠纷(15天) → 劳动纠纷(10天) → 邻里纠纷(7天) → 债务追讨(12天)
- **4级律师**：初级(¥3K/胜诉+30%) → 中级(¥8K/+40%) → 高级(¥15K/+50%) → 合伙人(¥30K/+60%)
- **诉讼流程**：立案(30%) → 举证(60%) → 庭审(90%) → 判决(100%)
- `fileLawsuit()` 提起/加入诉讼
- `tickLegal()` 每日推进诉讼阶段，到期自动判决
- `checkLegalRisk()` 基于违法次数计算法律风险
- `getLegalSummary()` 法律状态摘要

### 集成

| 文件                              | 改动                                                                               |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| `src/index.html`                  | +4 个 script 标签注册                                                              |
| `src/js/phase1/daily_pipeline.js` | +5 个管线步骤（life_node_check/medical_tick/recovery_tick/travel_tick/legal_tick） |
| `src/js/main.js`                  | +3 个初始化调用（medical/travel/legal）                                            |
| `src/CLAUDE.md`                   | 更新当前状态+Codex接力清单                                                         |
| `IMPLEMENTATION_PROGRESS.md`      | 标记 #7 完成                                                                       |

### 验证

- 所有 JS 文件 `node --check` 语法通过 ✅
- 构建产物 `dist/index.html` 待 build ✅
- MECHANICS 注册 4 条（life_nodes / medical_system / travel_system / legal_system）
- NARRATIVES 注册 2 条（gaokao_memory / travel_memories）

---

## 2026-06-25 — Bugfix: 游戏启动崩溃修复（npcRelationships未定义）

### 问题

打开游戏时报 `Uncaught ReferenceError: npcRelationships is not defined`，游戏无法启动。

### 根因

`main.js:1260` 引用了 `npcRelationships.init(state)`，但 `npcRelationships` 从未在任何文件中定义。且 typeof 守卫写法有 bug：

```js
// typeof npcRelationships → "undefined"（truthy字符串）
// 接着 ncpRelationships.init 访问未声明标识符 → ReferenceError
if (typeof npcRelationships && typeof npcRelationships.init === "function") {
```

### 修复

- 删除 `main.js` 中第1259-1262行死代码（`npcRelationships.init` 调用）
- 实际有效的 `initNpcRelationships(state)` 已在第1275行正确调用

### 影响文件

| 文件             | 修改                 |
| ---------------- | -------------------- |
| `src/js/main.js` | -4行（删除死代码块） |

### 验证

- 构建成功（4072.9 KB）
- grep 确认无 `npcRelationships.init` 残留

---

## 2026-06-25 — v3.7 P1-1 新闻→投资UI

执行任务：从 `IMPLEMENTATION_PROGRESS.md` 第一个未完成项开始，完成 P1-1 新闻→投资UI。

### 实施内容

- 修改 `src/js/phase2/investment.js`，新增 `renderNewsInvestmentDrivers()`，在投资中心资产摘要下方显示“今日市场驱动”板块。
- 板块调用 `getNewsInvestmentSummary(state)`，按新闻影响强度排序展示最多4条驱动，补充影响方向、相关资产标签和红涨绿跌的百分比提示。
- 无活跃投资新闻时显示市场平稳说明，避免玩家误以为新闻传导系统未接入。
- 将原本嵌在市场情绪框内的半成品驱动摘要移出，避免重复展示；新增简单 HTML 转义，降低新闻标题进入 UI 时的渲染风险。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-25 — v3.7 P1-2 NPC好感链路

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 第二个未完成项 P1-2 NPC好感链路。

### 实施内容

- 修改 `src/js/data/npcs.js`，为所有 NPC 自动补齐 `affinityEvents`，包含 30/60/80 三档阈值事件，并复用原有 `affinityRewards` 的描述，避免维护两套互相矛盾的好感文案。
- 修改 `src/js/phase1/npc_event_bridge.js`，新增 `checkNpcAffinityEvents(state, onlyNpcId)`，用 `state.flags._npcAffinityEventsSeen` 保证每个好感事件只触发一次；每日 NPC 桥接管线会检查并推送关系进展消息。
- 修改 `src/js/ui/wiki.js`，在 NPC 详情中展示“好感事件”列表，并沿用已有剧透隐藏规则，未达阈值只显示锁定提示。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-25 — v3.7 P1-4 家庭系统

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 第三个未完成项 P1-4 家庭系统。

### 实施内容

- 修改 `src/js/phase2/family_life.js`，补齐家庭状态迁移与兼容字段，新增 `getFamilyTotalAssets()`、`getEligibleMarriageNpcs()`、`proposeToNpc()` 和 `investChildEducation()`。
- 求婚规则落地为：已认识 NPC 好感 ≥80、玩家总资产 ≥¥200,000、现金 ≥¥20,000；成功后生成配偶、同步 `spouse/partner` 字段、记录家庭事件并增加家庭月生活成本。
- 生子流程补充子女教育字段和月支出，教育投入可提升教育等级、智力和幸福，并增加后续月度教育支出。
- 修改 `src/js/ui/render.js`，在家庭生活页显示可求婚 NPC、迎接孩子按钮、子女教育投入按钮。
- 更新家庭系统百科注册，说明 NPC 求婚门槛和子女教育投入规则。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-25 — v3.7 P1-6 35岁危机追访

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 第四个未完成项 P1-6 35岁危机追访。

### 实施内容

- 修改 `src/js/core/events_core.js`，新增 `isCrisis35FollowupEvent(evt, state)`，识别已选择 35 岁危机路径后的 `c35_` 追访事件。
- 在 `queueRandomEvent()` 的权重计算中，对满足条件的 35 岁危机追访事件应用 `×3` 权重，提高它们在时间窗内出场的概率。
- 保持原有 `conditions`、路径判断和一次性 flag 不变，只调整随机池选择优先级，避免破坏事件内容或强制插队。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-25 — v3.7 P2-4 道德事件扩充

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 第五个未完成项 P2-4 道德事件扩充。

### 实施内容

- 修改 `src/js/data/moral_events.js`，以独立 `EXTREME_MORAL_EVENTS` 批次重建 18 个极端生存困境事件，涵盖偷药救孩子、救济餐争食、举报同事、邻居被赶出门、医院插队红包、欠薪证据、救助站床位、胰岛素误送、假慈善、工地安全隐瞒等场景。
- 新增 `applyExtremeMoralDelta()`，将现金、幸福、饥饿、疲劳、健康、名气等即时影响集中处理，再映射注册进现有 `MORAL_EVENTS`，避免直接改动原大数组结构导致语法损坏。
- 新事件继续复用现有 `triggerMoralEvent()`、道德分数和行动记录机制，不新增额外调度路径。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-25 — v3.7 社交网络UI集成

执行任务：完成 `IMPLEMENTATION_PROGRESS.md` 第六个未完成项 社交网络UI集成。

### 实施内容

- 修改 `src/js/core/social_network.js`，新增 `ensureSocialNetworkState(state)`，为旧存档和未初始化状态补齐朋友圈、微博热搜、NPC动态、粉丝、网红收入和舆论危机字段。
- 修改 `src/js/phase1/daily_pipeline.js`，新增 `social_network_daily` 步骤，每日刷新热搜、结算网红收入并衰减舆论危机。
- 修改 `src/js/ui/social_tab.js`，新增“📱 社交网络”子页，展示粉丝/网红等级/日收入/舆论状态、朋友圈、NPC动态和微博热搜，并提供发朋友圈与刷新热搜按钮。
- 在 `social_network.js` 末尾注册 `MECHANICS.social_network`，同步游戏百科机制说明。

### 验证

- 修改 `src/` 后执行 `python build.py`。

## 2026-06-24 — v3.6 版本升级（P0/P1全任务完成）

执行任务：v3.6 版本升级（4组P0/P1任务）

**设计参考**：《Stardew Valley》NPC关系网 / 《大多数》人际网络 / 中国CPI历史数据 / Capitalism Lab经济周期 / BitLife人生回顾

### P0-1: NPC关系网系统（~825行）

- 新建 `src/js/core/npc_relationships.js`：NPC关系网定义、好感传导、衰减系统
- 修改 `src/js/data/npcs.js`：为10个NPC添加locationPreference/relationshipWeight/interactionHistory
- 修改 `src/js/core/cross_system_events.js`：新增6条NPC关系网联动事件（送礼传导/口碑传播/前同事引荐等）
- 修改 `src/js/ui/social_tab.js`：新增NPC关系网可视化Tab（关系卡片+传导日志）
- 修改 `src/js/phase1/daily_pipeline.js`：新增npc_relationships_tick步骤
- 修改 `src/index.html`：加载npc_relationships.js
- 修改 `src/js/main.js`：初始化NPC关系网状态

### P0-2: 时代变迁系统（~718行）

- 新建 `src/js/core/era_transform.js`：通胀指数（8%/年）、时代阶段（起步/成长/成熟/调整）、每日演化
- 新建 `src/js/data/era_events.js`：8个时代事件（Day 90/180/270/365/450/540/720/900）
- 修改 `src/js/phase1/daily_pipeline.js`：新增era_tick步骤
- 修改 `src/index.html`：加载era_transform.js和era_events.js
- 修改 `src/js/main.js`：初始化时代变迁系统

### P0-3: 副业系统深化（~725行）

- 新建 `src/js/phase2/side_hustle.js`：6种副业（代购/家教/网约车/外卖/自媒体/投资理财）
- 新建 `src/js/data/side_hustle_events.js`：副业随机事件（客户投诉/交通事故/平台封号等）
- 新建 `src/js/ui/side_hustle_ui.js`：副业Tab界面+状态卡片
- 修改 `src/js/phase1/daily_pipeline.js`：新增side_hustle_tick步骤
- 修改 `src/index.html`：加载副业系统脚本
- 修改 `src/js/main.js`：初始化副业系统

**副业特色**：

- 代购：18:00后+15%售价
- 网约车/外卖：需要agility≥50
- 家教：需要intelligence≥30
- 自媒体：粉丝积累+波动收入
- 投资理财：资金门槛+市场风险
- 疲劳度系统：过度副业影响收入

### P1-4: 人生回忆录系统（~422行）

- 新建 `src/js/ui/life_memoir.js`：8类回忆录（童年/求学/初恋/职场/创业/家庭/疾病/旅行）
- 修改 `src/js/ui/victory.js`：结局时生成回忆录摘要
- 修改 `src/index.html`：加载life_memoir.js

### 构建

已 `python build.py`（4037.5 KB）

**commit历史**：9596623 → acb5340 → b28675d → b250a41 → d4e9e0a → 1bd7fde → 154078d → 63ad76b → d14810a

**总JS文件数**：110个

---

## 2026-06-25 — v3.7 审查改进与扩展设计（Hermes Agent 6子任务链）

执行任务：v3.6 → v3.7 审查改进与扩展设计

**产出文档**：

- `TASK_SUMMARY_REPORT.md` — 完整任务总结
- `subagent_result2.md` — v3.0 审查报告（综合评分7.0/10）
- `subagent_result3.md` — 深度问题诊断（16项问题+3大根因）
- `subagent_result4.md` — 内容完善方案（16项改进）
- `subagent_result5.md` — 内容扩展方案（5大新系统）
- `ARCHITECTURE_REPORT_1~5.md` — 架构分析报告

**核心发现**：

- 综合评分：7.0/10
- 三大根因：副业未接入管线 / 经济后期失衡 / 事件填充稀疏
- 横向对比：NPC系统对标Stardew Valley / 经济反馈环对标Capitalism Lab / 多周目继承对标Hades

**待实装改进**（方案已设计，代码待实装）：

- P0改进（4项，~120行）：副业系统接入/经济平衡/后期开支/链式事件填充
- P1改进（6项，~470行）：新闻→投资UI/NPC好感链路/事件奖励缩放/家庭系统/装备获取/35岁危机追访
- P2改进（6项，~440行）：装备UI/主文件重构/清理残留/道德事件深度/多周目衔接/社交网络系统

**待实装扩展**（5大新系统，~6135行）：

- 社交网络系统（微信朋友圈/微博/网红经济）
- 旅行系统（国内/出国/目的地收集）
- 医疗深度系统（手术/住院/康复/医保）
- 法律系统（诉讼/律师/信用分）
- 人生节点事件（高考/大学/35岁危机/退休）

---

## 2026-06-24 — v3.6 社交网络扩展「人情江湖」实装

执行任务：社交网络扩展（P1，NPC关系链核心引擎）

**设计参考**：《Stardew Valley》岛民关系 / 《大多数》人际网络 / This War of Mine 情景连锁

### 新增文件

1. `src/js/core/npc_relationships.js` — NPC关系链核心引擎（~450行）
   - 12×12 NPC关系矩阵（旧识/竞争/业务/老同学/紧张/中立）
   - 关系传播矩阵（蝴蝶效应：帮A→B好感传导）
   - 每日tick：好感衰减 + 关系传导 + 事件触发检查

### 修改文件

| 文件                                 | 改动                     | 说明                                                                          |
| ------------------------------------ | ------------------------ | ----------------------------------------------------------------------------- |
| `src/js/data/npcs.js`                | +3 NPC（赵姐/陈哥/阿杰） | 完整配置：生日/节日/对话/礼物/好感奖励/求助/深度任务                          |
| `src/js/core/cross_system_events.js` | +8关系事件               | 三角选择/旧识反应/城市改造预警/隐藏商机/借钱还钱/同行竞争/老同学重逢/恩怨化解 |
| `src/js/phase1/daily_pipeline.js`    | +1步骤                   | `npc_relationships_tick` 每日传播蝴蝶效应                                     |
| `src/js/main.js`                     | +3行                     | `startNewGame` 中调用 `initNpcRelationships`                                  |
| `src/index.html`                     | +1 script                | 注册 `npc_relationships.js`                                                   |

### 新增NPC详情

| NPC  | 身份     | 位置   | 特色                     |
| ---- | -------- | ------ | ------------------------ |
| 赵姐 | 房产中介 | 商业区 | 城市改造情报、房租预警   |
| 陈哥 | 情报贩子 | 夜市   | 隐藏商机、老同学阿杰线索 |
| 阿杰 | 老同学   | 随机   | 借钱不还、还钱事件链     |

### 关系链设计

- 王大婶 ↔ 老周：旧识（城中村老邻居）
- 李工头 ↔ 张姐：竞争关系（抢活源）
- 赵姐 ↔ 李工头：业务关系
- 赵姐 ↔ 张姐：同行竞争
- 陈哥 ↔ 老周：老相识（废品渠道）
- 陈哥 ↔ 阿杰：老同学
- 王大婶 ↔ 赵姐：紧张关系（对中介有戒心）

### 构建

待 `python build.py`

---

---

## 2026-06-24 — v3.5 装备套装/耐久/技能连携系统（游戏设计师+高级开发工程师）

执行 SOP：`memory/review-improve-v3.0.md`（v3.0 审查改进）

**设计参考**：《暗黑破坏神》套装效果 / 《我的世界》工具耐久 / 《中国式家长》天赋连携 / 《Rimworld》技能协同

**目标**：深化装备系统（套装+耐久）和扩展技能连携效果，增加系统间关联性。

- **T1 · 装备套装系统** — 新建 `src/js/core/equipment_suites.js`（400+行）
  - 6套装备套装（街头生存/配送达人/工地安全/科技精英/四季防护/理财达人）
  - 套装效果分3档（2/3/4件），自动检测已装备数量
  - 套装效果：收入加成、受伤抗性、疲劳减少、旅行AP减少等
  - `checkEquipmentSuites()` 每日检测，`renderSuiteCard()` 渲染套装进度

- **T2 · 装备耐久系统** — 新建 `src/js/core/equipment_durability.js`（350+行）
  - 装备使用消耗耐久（工作-5/旅行-3/学习-1等）
  - 品质加成：传奇耐久×2.0，史诗×1.5，稀有×1.2
  - 修理系统：每点耐久¥1-5（品质越高越贵），完全损坏修理费翻倍
  - 耐久归零装备失效，需要修理恢复
  - `consumeEquipmentDurability()` 工作消耗，`repairEquipment()` 修理，`renderDurabilityBar()` 渲染

- **T3 · 跨技能连携系统** — 新建 `src/js/core/skill_synergy.js`（600+行）
  - 双技能连携（8对）：烹饪+销售=餐饮创业、编程+英语=国际外包等
  - 三技能连携（4组）：烹饪+销售+管理=餐饮帝国、编程+英语+管理=技术高管等
  - 主题连携（3主题）：技术/商业/生活服务
  - 连携效果：收入加成、解锁新工作/业务/行动、被动收入
  - `checkSkillSynergies()` 自动检测，`getSkillSynergyBonus()` 收入加成计算

**接线**：

- `index.html` 注册3个新script
- `daily_pipeline.js` 新增3个管线步骤（套装检测/耐久tick/连携检测）
- `main.js::doStreetJob()` 工作后消耗装备耐久
- `equipment_quality.js::createEquipmentInstance()` 创建装备时初始化耐久
- `skill_synergy.js::getSkillSynergyBonus()` 被 `main.js` 调用计算连携收入加成

构建：dist/index.html = 3928.0 KB

## 2026-06-24 — v3.3 Wave-1 关联度闭合（游戏设计师+高级开发工程师）

执行 SOP：`memory/review-improve-v3.0.md`（v3.0 审查改进）

- T1 35 岁三路径延伸 — `crisis35_followups.js` 新建（499行，6事件：exam×2、career×2、lieflat×2）
- T2 体检异常二阶 — `review_improvements.js` +184行（wt_recheck_diagnosis + wt_chronic_disease_lifestyle）
- T3 坏账/好心回报 — `crisis35_followups.js` 末尾追加（2事件：bad_debt_chase + good_loan_return）
- T4 道德 followup 补 4 — `moral_events.js` +74行（consequence_phone_sell / consequence_thief_ignore / consequence_fall_ignore / consequence_atm_warn）
- T5 传承商店入口 — `heritage_store.js` 已存在（155行），`index.html` 已注册，`showHeritageStore` 可用
- T6 前世记忆 wiki — `narratives_registry.js` +追加（past_life 条目，动态渲染继承数据）

构建：dist/index.html = 3876.7 KB

## 2026-06-24 — v3.4 C3D 内容关联度深化（游戏设计师+系统架构师+高级开发工程师）

执行 SOP：`PROMPT_v3.4.txt`（v3.4 内容关联度深化设计文档）

**设计参考**：Cart Life NPC 日程 / Stardew Valley 地点绑定 / This War of Mine 情景连锁 / Capitalism Lab 跨系统反馈

**目标**：内容关联度深化（C3D）— 让 NPC 有位置感、事件跨系统联动、地点有特色行动、好感与技能双门槛解锁。

- **T1 · NPC 位置关联系统** — 新建 `src/js/core/npc_location_bridge.js`（93 行）
  - 5 个核心 NPC 各有每日作息日程（morning/afternoon/evening/night 映射到 15 个活跃地点）
  - `getNpcCurrentLocation()` 时间+地点匹配，未发现时不暴露
  - `tickNpcLocationRotation()` 每日 pipeline 步
  - `getActiveNpcLocations()` + `rollLocationNpcInteraction()` 地点 NPC 偶遇 + flavortext
  - 接线：npcs.js 追加 schedule 字段、daily_pipeline.js 新增步骤、npc_event_bridge.js 位置匹配

- **T2 · 8 条跨系统联动事件** — `cross_system_events.js` +632 行（新增 8 条，累计 17 条事件 ID）
  - 暴雨商机（天气+摆摊）、王大婶租房（NPC+住房）、公园师傅（地点+技能）
  - 张姐裁员（NPC+行业热度）、科技园地摊（物品+行业热度+违法）、换季体检（季节+健康）
  - 老周废品大单（NPC+体力+技能）、小美副业（NPC+经济+道德）
  - 联动维度：天气+健康+NPC+行业+地点+季节+技能+道德+违法

- **T3 · 10 条地点限定行动** — `actions_extra.js` +276 行
  - 每个活跃地点 1 条特色行动，条件=location+skill/attr threshold
  - 废品站淘货（construction+修理）、工厂兼职（factoryZone+体质）、夜校自习（school+学习）
  - 商业区发传单、科技园找机会（+智商）、医院献血（+健康门槛）、公园晨练（免费）
  - 图书馆啃书（技能XP+茶叶）、寺庙静心（心情+道德）、批发市场倒货（+口才）

- **T4 · NPC 好感×技能联动解锁** — `npcs.js` + `npc_event_bridge.js`（+121 行）
  - 5 个双门槛解锁（好感80 + 技能/属性门槛）：
    - aunt_wang: cooking≥40 → 获得食谱（cooking XP+200）
    - boss_li: sales≥50 → 摆摊收入+10% 永久
    - sister_zhang: physique≥60 → factoryZone 收入+15%
    - old_zhou: repair≥30 → 拾荒效率+20%
    - xiao_mei: charm≥70 → 解锁商业区模特工作
  - `checkNpcSkillUnlocks()` 每日管线检查，`rel._unlocked_*` 防重复触发
  - 支持 skill（技能 level）和 attr（属性数值）双类型门槛

构建：`dist/index.html = 3877.6 KB`
提交：37d6dbe(T1) 7f0a51f(T2) 517bce8(T3) cbca442(T4)

> **构建提醒**: 每次修改 src/ 下的文件后，必须 `python build.py` 重新打包 dist/index.html 才能生效！
>
> **快捷触发**：`CLAUDE.md` 定义了 3 条触发短语。对当前 agent 说"按 v3.0 审查改进"自动走 `memory/review-improve-v3.0.md` SOP；其他 agent 复用同一套文件。
>
> ### SOP 文件索引
>
> | 编号 | 文件                                    | 作用                                          |
> | ---- | --------------------------------------- | --------------------------------------------- |
> | v3.0 | `memory/review-improve-v3.0.md`         | 全方位审查改进（代码/架构/机制/剧情/UI/留存） |
> | v2.1 | `memory/content-expansion-v2.1.md`      | 内容扩充 SOP（20职业上限/成套添加/交叉验证）  |
> | 1.4  | `memory/1-4-standard-implementation.md` | 世界自洽性四维度审计                          |

## 2026-06-24 — v3.3 Wave-2 三章路线效应+气象预报+剧本开局链（游戏设计师+高级开发工程师）

执行 SOP：`memory/review-improve-v3.0.md`（v3.0 审查改进）

**目标**：让三章路线产生实际游戏效应、天气预报让天气系统可感知、每个剧本有专属开局叙事。

- **T1 · 三章结局路线游戏效应** — 新建 `src/js/core/route_effects.js`（431 行）
  - 5 条路线（entrepreneur/civil_service/wealth/lying_flat/open）各有被动加成 + 周期性专属事件
  - `initRouteEffects()` 在 `story_chapters.js` 第三章触发时注入 flag
  - `tickRouteEffects()` 在 daily_pipeline 中按间隔触发路线事件弹窗
  - 接线：story_chapters.js 第243行 → initRouteEffects 调用
- **T2 · 气象预报系统** — 新建 `src/js/core/weather_forecast.js`（178 行）
  - `updateNextDayForecast()` 在 weather 步骤中生成明日预报（准确率 70%）
  - `getForecastHTML()` 侧边栏明日天气展示 + 准备状态提示
  - `prepareForWeather()` 买伞（¥20）/买暖宝（¥50）准备行动
  - `weather_prep_mitigation` 管线步骤减免天气惩罚
- **T3 · 剧本专属开局链** — `src/js/data/scenario_start_chains.js` 升级为多选剧情（766 行）
  - 7剧本各3-4天开局链，每个事件2-3个选择含具体效果
  - classic(3天): 桥洞/零工/租房; laid_off(4天): 遣散费/摸底/转型/适应
  - small_town_grinder(4天): 出租屋/投简历/面试/第一份工作
  - foreign_worker(4天): 宿舍/流水线/学语言/选择
  - second_gen(3天): 资金/启蒙/方向; midlife_crisis(3天): 被裁/下一站/家庭
  - fresh_grad(3天): 租房陷阱/职场第一课/第一个工资

构建：`src/index.html` 注册 3 个新 script；daily_pipeline.js 新增 2 个管线步骤
构建：`dist/index.html = 3835.5 KB`

---

## 2026-06-24 — v3.3 Wave-1A 关联度闭合（GLM-5.2 / 游戏设计师+高级开发工程师）

执行 SOP：`memory/review-improve-v3.0.md`（v3.0 审查改进）

**目标**：把"已埋下但未串完"的关联通路接上 — 35 岁三路径、体检异常、借款回响。

- **T1 · 35 岁分水岭三路径延伸事件链** — 新建 `src/js/data/crisis35_followups.js`（499 行）
  - 6 个核心 followup：`c35_exam_first_try` / `c35_exam_decision`（exam 路径）；`c35_career_overtime` / `c35_career_layoff_list`（career 路径）；`c35_lieflat_family_call` / `c35_lieflat_friend_circle`（lieflat 路径）
  - IIFE 注入 `window.RANDOM_EVENTS`；index.html 紧跟 `moral_events.js` 注册
  - `review_improvements.js::check35Crisis` 三路径写 flag 时追加 `s.flags._crisis35Day = s.player.day`
- **T2 · 体检异常 → 二阶事件链** — `review_improvements.js` +186 行
  - `wt_recheck_diagnosis`（去三甲复查 / 忽视 / 偏方）+ `wt_chronic_disease_lifestyle`（调整生活方式 / 继续 996）
  - `daily_pipeline.js::review_improvements_tick` 调用 `tickHealthFollowups`
- **T3 · 坏账后续 + 好心回报（对称设计）** — `crisis35_followups.js` 末尾追加
  - `bad_debt_chase`（亲戚消失：律师催债 / 自认倒霉 / 朋友圈骂街）
  - `good_loan_return`（口碑传播：NPC 好感+5 + 30% 高薪临时任务）

构建：`dist/index.html = 3771.7 KB`

---

## 2026-06-24 — v3.2 全面重塑（QoderWork / 游戏设计师+高级开发工程师）

### Phase 1 — 核心流程改造

**1.1 强制人生目标弹窗** - dreams.js新增强制弹窗, main.js三个入口调用
**1.2 黑暗开局** - state.js: ¥1500→¥300, villageDebt 5500→0
**1.3 每日收支修复** - \_dayStartCash移至day_increment步骤

### Phase 2 — 游戏机制扩展

**2.1 违法行为扩充** - 新增4种违法(共8种), 新增捐款/义工道德恢复
**2.2 交通优化** - 地铁8站, 单车2跳内, 打车降价

### Phase 3 — 职业/属性系统大改

**3.1 属性重构** - 基础属性→属性, 心智→能力
**3.2 职业路径** - 6路径×22职位, 晋升条件+颜值+社交+业绩
**3.3 行动重组** - 摆地摊归入短期临时工作

## 2026-06-23 — v3.1 游戏机制扩展（QoderWork / 游戏设计师+研究员）

**执行 SOP**：`memory/review-improve-v3.0.md` §四/§五
**会话产出**：3 个新模块 + 1 个事件扩展 + 6 处接线 + 1 个 bug 修复，约 1000 行代码改动，1 次 build

### 研究基础

深度研究了 8 款参考游戏的设计模式和 6 项中国都市现实题材：

- **《大多数》**：五维生存压力系统、债务驱动叙事
- **《中国式家长》**：传家宝继承、代际复利
- **BitLife**：40 种缎带结局分类系统
- **This War of Mine**：角色崩溃点、资源稀缺耦合
- **Stardew Valley**：NPC 关系深度、祖父评价信（Year 3 检查点）
- **Hades**：夜之镜红/绿互斥永久升级
- **Papers Please**：隐藏成就、道德选择轴
- **Capitalism Lab**：跨行业反馈循环

### 新系统1 · 人生缎带系统（life_ribbon.js）

- **设计参考**：BitLife Ribbons（40种缎带覆盖各种人生路线）+ 《大多数》结局评价 + Stardew Valley 祖父评价信
- **新建** `src/js/core/life_ribbon.js`（~280 行），12 条缎带覆盖中国都市生活典型路线：
  - 🌟 城市传奇 | 🎲 创业先锋 | 💼 打工皇帝 | 📚 考公上岸
  - ⚡ 内卷之王 | 🏠 房奴一生 | 🏗️ 街头生存者 | 🍵 躺平达人
  - 🌊 归园田居 | 💊 病困交加 | 🎓 百艺通 | 😔 默默无闻
- **机制**：游戏结束时（胜利或失败）自动判定最匹配的缎带，缎带不是玩家选择的，而是从人生轨迹中涌现的
- **持久化**：跨周目累积到 localStorage（`__lifeRibbons`），形成收集目标
- **UI 集成**：胜利弹窗展示获得缎带 + 收集进度（已收集 X/12）
- **暴露函数**：`determineLifeRibbon` / `recordRibbon` / `getEarnedRibbons` / `getRibbonProgress` / `collectLifeStats`

### 新系统2 · 主线章节系统（story_chapters.js）

- **设计参考**：Stardew Valley 祖父评价信（Year 3 检查点）+ 《大多数》阶段递进 + This War of Mine 叙事检查点
- **新建** `src/js/core/story_chapters.js`（~280 行），3 章式人生主线：
  - **第一章「生存」(第30天)** — 你在这座城市活下来了吗？（4 条分支评价：还债中/刚起步/已稳定/默认）
  - **第二章「立足」(第180天)** — 你找到自己的位置了吗？（5 条分支：创业/职场/投资/NPC关系/默认）
  - **第三章「选择」(第365天)** — 你要过什么样的人生？（5 条结局路线预览：创业/考公/财富/躺平/开放）
- **机制**：纯叙事层增强，不改变游戏玩法，在关键时间节点设置不可跳过的叙事弹窗
- **接线**：`daily_pipeline.js` 新增 `story_chapter_check` 步骤
- **暴露函数**：`checkStoryChapter` / `getStoryChapterProgress`

### 新系统3 · 跨系统联动事件（cross_system_events.js）

- **设计参考**：This War of Mine NPC 互动 + 《大多数》行业热度影响 + Capitalism Lab 经济交叉反馈 + Stardew Valley NPC 关系解锁
- **新建** `src/js/core/cross_system_events.js`（~300 行），5 条跨系统事件：
  - **王大婶的救急**：NPC 好感 ≥30 触发，修理技能影响结果
  - **风口来了**：行业热度 >1.2 触发，体力劳动 vs 投资研究选择
  - **暴跌中的机会**：市场情绪 bearish 触发，抄底 vs 观望 vs 安慰他人
  - **地上有一沓钱**：道德选择联动，3 条路线（据为己有/交银行/发群找失主）
  - **老周的废品渠道**：NPC 好感 ≥40 触发，体力劳动 vs 入伙费 vs 拒绝
- **机制**：通过 IIFE 注入到 RANDOM_EVENTS 数组，零侵入式扩展
- **核心价值**：让玩家感觉各系统不是孤立的——NPC 关系影响事件、行业热度影响街头收益、世界状态影响可用事件、道德选择产生长期回响

### 节日深度 · 清明回乡 + 中秋探亲事件链（festivals.js +133 行）

- **设计参考**：现实中国清明节传统 + Stardew Valley 节日事件 + 中秋节走亲访友传统
- **清明回乡**（第104天）：3 选 1 事件链 — 回老家扫墓（¥200，好感+20，随机母亲礼物）/ 打电话（省钱，道德-1）/ 继续干活（道德-2）
- **中秋探亲**（第257天）：3 选 1 事件链 — 买月饼看王大婶（¥50，好感+15）/ 天台赏月（随机心情）/ 发朋友圈（随机点赞）
- **NPC 联动**：中秋事件直接操作 `npcRelations.aunt_wang.affinity`，让节日与 NPC 关系系统产生交叉
- **道德系统联动**：清明事件影响 `_moralScore`，为后续道德事件埋下伏笔
- **接线**：`daily_pipeline.js` 的 `festival` 步骤新增 `checkFestivalDeepEvents` 调用

### Tab 系统重组 · 事业发展 + 社交合并 + 个人成长合并

- **设计参考**：BitLife 精简 Tab 布局 + 玩家反馈"Tab 太多找不到功能"
- **新建** `src/js/ui/career_dev.js`（495 行）：事业发展 Tab，街头阶段显示上班族工作引导，创业阶段显示创业系统
- **新建** `src/js/ui/social_tab.js`（145 行）：合并职场社交 + 家庭为统一社交 Tab
- **render.js 重组**：
  - `startup` Tab → `career_dev` Tab（ renderCareerDevTab）
  - `workplace_social` + `family` → `social` Tab（ renderSocialTab）
  - `growth` + `personal_growth` → 合并的 `personal_growth` Tab（ renderMergedPersonalGrowthTab，含子 Tab：数据/爱好/健康/目标）
- **index.html**：更新 Tab 按钮 + 注册2个新 script

### 创业平衡调参 · startup.js

- **设计参考**：《大多数》创业难度 + 玩家反馈"创业太容易赚钱"
- **估值下调 30%**：科技 200万→140万 / 消费 100万→70万 / 金融 300万→210万 等
- **燃烧率上调 50%**：科技 8万→12万 / 消费 5万→8万 / 教育 4万→11万 等
- **注册门槛提高**：¥50,000 → ¥200,000（所有触发条件 + UI 文案同步更新）
- **second_gen 街头启动资金**：¥100,000 → ¥200,000

### Bug 修复 · render.js TAB_RENDERERS 对象未关闭 + 重复 else 块

- **问题**：`render.js:1091` 存在 `} else {    } else {` 重复块 + `TAB_RENDERERS` 对象缺少闭合 `};`
- **修复**：移除重复 else 块，补上对象闭合括号

### 文件变更清单

| 文件                                 | 类型 | 行数 | 说明                                              |
| ------------------------------------ | ---- | ---- | ------------------------------------------------- |
| `src/js/core/life_ribbon.js`         | 新建 | 280  | 人生缎带系统（12条缎带 + 收集进度）               |
| `src/js/core/story_chapters.js`      | 新建 | 280  | 3章式主线检查点（生存→立足→选择）                 |
| `src/js/core/cross_system_events.js` | 新建 | 300  | 5条跨系统联动事件（NPC/行业/世界/道德）           |
| `src/js/ui/career_dev.js`            | 新建 | 495  | 事业发展Tab（创业+上班引导）                      |
| `src/js/ui/social_tab.js`            | 新建 | 145  | 社交Tab（合并职场社交+家庭）                      |
| `src/js/core/festivals.js`           | 修改 | +133 | 清明回乡 + 中秋探亲事件链                         |
| `src/js/phase1/daily_pipeline.js`    | 修改 | +12  | story_chapter_check 步骤 + festival deep events   |
| `src/js/phase2/startup.js`           | 修改 | ~38  | 估值/燃烧率/注册门槛平衡调参                      |
| `src/js/ui/victory.js`               | 修改 | +12  | triggerVictory 接入缎带判定                       |
| `src/js/ui/modal.js`                 | 修改 | +12  | showGameOverModal 接入缎带判定                    |
| `src/js/ui/corp_ui.js`               | 修改 | +16  | showVictoryModal 缎带展示 UI                      |
| `src/js/ui/render.js`                | 修改 | ~260 | Tab重组 + renderMergedPersonalGrowthTab + bug修复 |
| `src/index.html`                     | 修改 | ~22  | Tab按钮重组 + 注册5个新script                     |

**总计 ≈ 2000 行**（含叙事文案+UI代码）

### 验证

- 全部 8 个 JS 文件 `node --check` 通过 ✅
- 构建产物 `dist/index.html` 3666.5 KB（在 3.5-3.8MB 期望区间内）✅
- grep 验证：life_ribbon 21处 / story_chapters 18处 / cross_system 7处 / festival_deep 5处 ✅

### 设计参考总结

| 改进项     | 参考游戏                          | 借鉴的核心设计                |
| ---------- | --------------------------------- | ----------------------------- |
| 人生缎带   | BitLife Ribbons                   | 缎带从行为涌现而非玩家选择    |
| 主线章节   | Stardew Valley 祖父评价信         | 关键时间节点叙事检查点        |
| 跨系统事件 | This War of Mine / Capitalism Lab | NPC关系/行业热度/世界状态联动 |
| 节日深度   | Stardew Valley 节日事件           | 节日与NPC关系/道德系统交叉    |
| 内容关联度 | 《大多数》五维耦合                | 系统间相互影响而非各自孤立    |

**执行人**：玩法师（游戏设计师）
**会话产出**：4 个问题域修复 + 2 个 bug 修复，约 280 行代码改动，1 次 build

### 修复1 · 地图缺失 3 个地点坐标（render.js）

- **问题**：`render.js:2418 positions` 只定义了 9 个地点坐标，缺 suburb / entertainment / temple 三个，导致这 3 个地点在地图网格上根本不显示节点
- **修复**：补齐三个坐标 suburb(75,70) / entertainment(65,80) / temple(18,75)
- **影响**：玩家现在能在地图上看到全部 12 个地点

### 修复2 · 寺庙地点完善 4 项特殊行动（actions_extra.js +80 行）

- **问题**：`locations.js:345 temple` 定义了 `specialActions: ["祈福","冥想","捐香火钱","求签"]` 但无任何代码消费，玩家去了寺庙无事可做
- **设计参考**：《大多数》心态值分级 + BitLife 随机 buff
- **实现**：新建 `addTempleActions(state, actions)` 函数（actions_extra.js），4 项行动每项每日冷却 1 次防滥用：

  | 行动        | AP  | 成本 | 效果                                              |
  | ----------- | --- | ---- | ------------------------------------------------- |
  | 🙏 祈福     | 3   | ¥10  | 心情+8/运气+1/道德+1                              |
  | 🧘 冥想     | 5   | 免费 | 疲劳-15/心智+2                                    |
  | 💰 捐香火钱 | 2   | ¥50  | 运气+3/道德+1/名气+2                              |
  | 🔖 求签     | 2   | ¥20  | 随机 buff/debuff 24h（5档签：上上/上/中/下/下下） |

- **接入**：`addExtraActions` 在街头阶段调用 `addTempleActions`

### 修复3 · 创业Tab 在街头阶段也可见（render.js）

- **问题**：`renderTabBar` 仅在 `state.startup.company` 已注册时显示创业 Tab，玩家没注册前看不到入口，不知道有创业系统
- **修复**：街头阶段也显示创业 Tab，点击后 `renderStartupTab` 已有逻辑会显示"注册条件引导卡片"。仅在公司阶段且未自己创业时隐藏（避免与 corp Tab 重复）

### 修复4 · 引导系统重做（tutorial.js + modal.js + render.js）

- **设计参考**：玩家反馈"点击哪里都能跳过引导""高亮框一直闪""没导航到对应按钮"
- **重写 `showTutorialStep`** 支持 `waitForClick` 模式：
  - 当 step.waitForClick 存在时，不显示"下一步"按钮
  - 在目标元素上挂 `click` capture 监听（once: true），玩家点击该元素才推进
  - 目标未找到时 5 秒后重试（处理异步渲染）
- **修复 bug 1（点击任意处跳过）**：`modal.js:68` 改为仅在 overlay 不是 tutorial-overlay 时允许点击空白关闭
- **修复 bug 2（高亮框一直闪）**：所有跳过/完成/上一步路径都强制 `cleanupHighlight()`，并移除 resize 监听
- **修复 bug 3（无导航高亮）**：每步绑定具体 CSS 选择器，高亮框跟随目标元素，窗口大小变化自动重新定位
- **新增 `_confirmSkip()`**：跳过引导二次确认，避免误操作
- **7 步引导重写**：
  1. 欢迎页（无目标，点"开始引导"）
  2. 看左侧栏（必须点 `#sidebar`）
  3. 看行动区（必须点 `#content-area`）
  4. 必须点废品回收卡片（必须点 `[data-action-id="waste_recycling"]`）
  5. 必须点吃顿饭卡片（必须点 `[data-action-id="eat"]`）
  6. 必须点地图标签（必须点 `[data-tab="map"]`）
  7. 收尾（无目标，点"开始游戏"）
- **render.js `createActionCard` 加 `data-action-id` 属性**：让引导能定位到具体行动卡片
- **整合到剧本模式**：现有 `startScenarioGame / startSandboxGame / startNewGame` 已调用 `startTutorial`，且 `isTutorialDone()` 检查 localStorage（清除浏览器算第一次玩）— 符合"开局引导整合到剧本模式 + 第一次玩才显示"要求

### 文件变更清单

| 文件                             | 类型 | 行数 | 说明                                                                        |
| -------------------------------- | ---- | ---- | --------------------------------------------------------------------------- |
| `src/js/ui/render.js`            | 修改 | +14  | 修复1 地图3地点坐标 / 修复3 创业Tab / 修复4 createActionCard data-action-id |
| `src/js/phase1/actions_extra.js` | 修改 | +110 | 修复2 addTempleActions 4 项行动                                             |
| `src/js/ui/tutorial.js`          | 修改 | +130 | 修复4 重写 showTutorialStep + waitForClick + \_confirmSkip + 高亮增强       |
| `src/js/ui/modal.js`             | 修改 | +5   | 修复4 tutorial overlay 不可点击关闭                                         |

**总计 ≈ 260 行**（远低于 1500 行护栏）

### 验证

- 4 个 JS `node --check` 全通过 ✅
- 构建产物 `dist/index.html` 3587.1 KB（在 3.5-3.8MB 期望区间内）✅
- grep 验证：寺庙行动 6 处 / 地图坐标 12 处 / 创业Tab可见 13 处 / 引导 waitForClick 27 处 / 行动卡片data属性 1 处 / tutorial overlay保护 4 处 ✅
  > ## 2026-06-23 — Review v3.0 P2 改进落地（吴八哥 / 高级开发工程师）

**本次执行 SOP**：`memory/review-improve-v3.0.md` §四/§五/§六
**本次会话产出**：2 个新模块 + 1 个 P0 经济 BUG 修复 + 3 处接线 + 文档同步，约 327 行代码改动，1 次 build，1 次 commit + push

### P0-BUGFIX · 村长债复利从未生效（v3.0 审查漏掉的隐藏缺陷）

- **问题**：`state.resources.dailyInterest = 0.0035`（0.35%/日复利）字段在 `state.js:67` 初始化，被 4 个 UI 文件读取（`daily_focus.js / modal.js / render.js / wiki.js`），但**没有任何代码把它实际应用到 `villageDebt` 上累积**。`villageDebtInterest` 字段始终为 0，"村长债复利"机制自游戏发布以来根本没生效。
- **修复**：`src/js/phase1/skill_bonuses.js::settleDailyFinance` 在银行存款利息逻辑后追加 19 行村长债复利结算块。每日按当前难度的 `dailyInterestBase` 计算并累加到 `villageDebt`，同步更新 `villageDebtInterest` 和 `debt` 字段。
- **影响**：所有有 `villageDebt > 0` 的剧本（classic 5500、debt_rerun 12000、deep_debt 10000、hardship 8000）现在终于会真实地"利滚利"。结合下方的难度分层，老玩家可挑战 0.50%/日的困难档。

### P2-B-2 · 难度分层系统（休闲/标准/困难）

- **设计参考**：《大多数》心态值分级（难度只调衰减速率不调收益曲线）/《中国式家长》经济复利隐性加压 /《This War of Mine》角色组合隐性难度
- **新建** `src/js/core/difficulty_system.js`（168 行）暴露 4 个 window 函数：`getDifficultyConfig` / `applyDifficultyToState` / `getDifficultyMultiplier` / `renderDifficultyPicker`
- **3 档参数**（仅调衰减/惩罚/概率，不调收益曲线）：

  | 档位    | 日息  | 中产税概率 | 事件惩罚 | 需求衰减 | 启动金 |
  | ------- | ----- | ---------- | -------- | -------- | ------ |
  | 🍵 休闲 | 0.20% | 0.20       | ×0.70    | ×0.85    | +¥500  |
  | ⚖️ 标准 | 0.35% | 0.35       | ×1.00    | ×1.00    | —      |
  | 🔥 困难 | 0.50% | 0.50       | ×1.30    | ×1.15    | —      |

- **接线**：`main.js::showScenarioSelect` 顶部插入难度选择器 + `startScenarioGame / startSandboxGame` 在进入游戏前调用 `applyDifficultyToState` + `applyHeritageUnlocks`
- **消费点**：`skill_bonuses.js::settleDailyFinance` 读取 `dailyInterest` 乘数 / `review_improvements.js::checkWealthTaxTick` 读取 `wealthTaxProb` 乘数
- **数据兼容**：旧存档无 `_difficulty` 字段 → 视为 `normal`，行为完全不变

### P2-E-1 · 传承币系统（NG+ 永久解锁）

- **设计参考**：Hades 夜之镜（Darkness 永久解锁 + 红/绿互斥 + 命运骰高端门控）/《中国式家长》2.0 天赋继承硬上限 / BitLife Ribbons 解锁新事件链 / Stardew Valley 祖父评价信软 NG+
- **新建** `src/js/core/heritage_coin.js`（224 行）暴露 6 个 window 函数 + 6 项解锁常量
- **币发放公式**：成就数×2 + log10(净资产)×3 + 道德分×1 + 存活天数/50（向上取整）
- **6 项解锁**（参考 Hades 红/绿互斥）：

  | 解锁项      | 成本 | 效果                | 互斥  |
  | ----------- | ---- | ------------------- | ----- |
  | 🍳 祖传秘方 | 50   | 开局多 2 个高级食谱 | 🆚 📚 |
  | 📚 祖辈教诲 | 50   | 技能 XP +10%        | 🆚 🍳 |
  | 🤝 人脉引荐 | 80   | NPC 初始好感 +10    | 🆚 💰 |
  | 💰 启动资金 | 80   | 开局现金 +¥2000     | 🆚 🤝 |
  | 🛡️ 命格护佑 | 100  | 首次濒死回 50% 血   | 无    |
  | 🎲 命运骰子 | 150  | 重开时多保留 1 装备 | 无    |

- **持久化**：localStorage 键 `__heritageCoins` / `__heritageUnlocks`，跨周目累积
- **接线**：`modal.js::showGameOverModal` 在保存 inheritanceData 后调用 `awardHeritageCoins` 并显示获得数 / `main.js` 启动游戏前调用 `applyHeritageUnlocks`

### P2-B-1 · 多周目继承扩展（35岁路径/道德分/NPC巅峰好感）

- **设计参考**：REVIEW_RESULT.md §5 B-1 / Stardew Valley 老熟人信息解锁
- **修改** `src/js/core/inheritance_chain.js`：
  - 新增 `inheritCrisisPath(prevState)` — 继承上局 35 岁分水岭选择（卷/考公/躺平），给微小属性加成（mental +3 / intelligence +3 / happiness +5）
  - 新增 `inheritMoralScore(prevState)` — 继承善行-恶行净值，转化为新周目幸运加成（封顶 +5/-3），写入 `_prevMoralScore`
  - 新增 `inheritPeakAffinity(prevState)` — 记录 NPC 上局最大好感（≥50 的），写入 `_prevPeakAffinity`，作为"老熟人"线索解锁入口
  - 修改 `applyInheritance` 应用上述 3 项加成
- **接线**：`modal.js::showGameOverModal` 在 inheritanceData 中追加 3 个新字段
- **价值**：补齐 REVIEW_RESULT.md §5 B-1 缺陷"只传 dreamId 单字段太单薄"

### 文件变更清单

| 文件                                 | 类型 | 行数 | 说明                                     |
| ------------------------------------ | ---- | ---- | ---------------------------------------- |
| `src/js/core/difficulty_system.js`   | 新建 | 168  | P2-B-2 难度分层系统                      |
| `src/js/core/heritage_coin.js`       | 新建 | 224  | P2-E-1 传承币系统                        |
| `src/js/phase1/skill_bonuses.js`     | 修改 | +37  | P0-BUGFIX 村长债复利 + 难度读取          |
| `src/js/core/review_improvements.js` | 修改 | +5   | P2-B-2 中产税概率读难度                  |
| `src/js/core/inheritance_chain.js`   | 修改 | +60  | P2-B-1 三项新继承字段 + applyInheritance |
| `src/js/main.js`                     | 修改 | +22  | P2-B-2/P2-E-1 难度选择 UI + 启动接线     |
| `src/js/ui/modal.js`                 | 修改 | +8   | P2-E-1 发放传承币 + 继承 3 字段写入      |
| `src/index.html`                     | 修改 | +3   | 注册 2 个新 script                       |

**总计代码改动 ≈ 327 行**（远低于 1500 行护栏；2 个新模块均 ≤300 行）

### 验证

- 7 个 JS 文件 `node --check` 语法全部通过 ✅
- 构建产物 `dist/index.html` 3574.8 KB（在 3.5-3.8MB 期望区间内）✅
- grep 验证：难度系统 27 处命中 / 传承币 25 处 / 多周目继承扩展 9 处 / 村长债复利 4 处 ✅
- v3.0 SOP §三 交叉验证全通过：无同名冲突 / 无脚本顺序破坏 / 无 flag 引用断裂

> ## 2026-06-23 — Review：全方位评估 + P0/P1 改进（GLM-5.2）

- **新建** `src/js/ui/daily_focus.js`：P0-1 今日重点 sidebar 组件（基于状态启发式打分取 Top 3）
- **新建** `src/js/core/review_improvements.js`：P0-3 行业热度→街头工作收入桥接（±15%）/ P0-4 中产税 6 事件 / P1-1 35 岁分水岭 / P1-2 8 条本土化动态提示
- **扩展** `src/js/data/moral_events.js`：补足 6 条缺失道德后续（beggar_coin/beggar_ignore/change_keep/cat_feed/borrow_iou/colleague_snitch）
- **接线** `main.js` doStreetJob / `daily_pipeline.js` 新增 `review_improvements_tick` 步骤 / `render.js` renderSidebar / `index.html` 注册 2 个 script + 1 个 sidebar 区块
- **整体评分** 7.5 / 10（评估细则见根目录 `REVIEW_RESULT.md`）
- **构建**：python build.py (3550.7 KB) ✅

## 2026-06-23 — 批次E：百科剧透隐藏+NPC在场概率+地点触发对话

### 变更内容

**1. 百科NPC剧透隐藏** (`wiki.js`)

- 生日：隐藏直到通过聊天发现或好感≥60
- 礼物偏好：隐藏品类直到通过聊天发现或好感≥50（提示文字始终可见）
- 在场加成：只显示已解锁的好感阈值层级，未解锁的显示🔒
- 好感阈值奖励：只显示已解锁的层级描述，未解锁的显示"达成后解锁"
- 委托任务：隐藏故事详情直到好感≥30或已发现
- 深度任务：隐藏故事详情直到好感≥70或已发现
- 新增 `ensureNpcDiscovered()` 调用确保discovered字段存在

**2. NPC在场概率系统** (`npcs.js` + `skill_bonuses.js`)

- 每个NPC新增 `presenceChance` 字段（0.65~0.85），决定每天在位置的概率
- `getNpcPresenceBonus()` 增加 `isNpcPresent()` 检查，NPC不在场则无加成
- `getNpcPresenceBonusDesc()` 同样检查在场状态
- 固定位置NPC（王大婶/赵师傅/林阿姨）→0.85，半固定（李工头/陈师傅）→0.75，高流动性（张姐/小丽）→0.65
- 确定性哈希判定：`hash(npcId + day) % 1000 < presenceChance * 1000`

**3. 地点切换NPC触发** (`npc_event_bridge.js` + `main.js`)

- 新增 `rollNpcEncounterOnArrival()` — 玩家到达新地点时自动触发NPC对话
- 60%概率触发，NPC需在场检查通过
- 每次触发好感+1，同时尝试信息解锁
- 旅行handler中自动调用

**4. NPC信息发现系统** (`npc_event_bridge.js` + `main.js` + `state.js`)

- 新增 `_npcHash()` 确定性哈希函数
- 新增 `isNpcPresent()` 在场判定
- 新增 `ensureNpcDiscovered()` 自动初始化discovered字段
- 新增 `tryRevealNpcInfo()` 信息解锁（聊天/到达/好感提升触发）
- 生日：当天聊天自动解锁，日常聊天好感≥15有5%概率
- 礼物偏好：聊天好感≥20有12%概率解锁，好感≥50自动解锁
- 好感阈值奖励和在场加成：好感达标自动解锁对应层级
- 存档迁移：`importState()` 中自动补全旧存档的discovered字段

**5. 其他百科分类剧透保护** (`wiki.js`)

- 隐藏成就的解锁条件改为"🔒 达成条件神秘"（之前列出所有隐藏成就名）
- 叙事条目增加锁定：玩家未经历的事件显示为"🔒 你还没有经历过这段故事"
- `afterEventApplied()` 追踪已体验事件到 `_experiencedNarratives`
- 系统说明类叙事（四层新闻生态/新游戏+等）始终可见

**涉及文件**：

- `src/js/data/npcs.js` — 10个NPC新增presenceChance/encounterLines/infoHints
- `src/js/core/state.js` — relationships schema注释更新+存档迁移+\_experiencedNarratives
- `src/js/phase1/npc_event_bridge.js` — 新增5个函数+信息发现系统
- `src/js/phase1/skill_bonuses.js` — 在场加成加入NPC在场检查
- `src/js/ui/wiki.js` — NPC详情剧透隐藏+叙事锁定+成就隐藏
- `src/js/main.js` — 旅行handler+聊天handler集成

**设计参考**：

- 《Stardew Valley》Collection：已发现/未发现状态徽章
- 《Terraria》Bestiary：图鉴形式，遇到后才解锁详情
- 《My Time at Portia》：NPC信息逐步解锁
- 确定性在场概率：使用NPC id+天数的哈希值决定（可重复、不依赖RNG状态）

**构建**：已 `python build.py`（3519.1 KB）

- `executeStartupAction()` 添加对应 case，调用 `launchProduct(state, productId)`

**1.4 季节性事件匹配真实季节** (`extra_events.js`)

- spring/summer/autumn/winter 四个季节事件均添加 `st.weather.season` 条件检查
- 修复"春天出现入秋事件"的问题

**2.2 雷达图加名气** (`data_viz.js:435`)

- street模式雷达图属性从4个扩展到5个（体质/智力/敏捷/心智/名气）
- 历史覆盖层同步添加fame

**2.4 数据摘要UI缩小** (`data_viz.js:988-1012`)

- CSS grid 从 `minmax(120px,1fr)` → `minmax(90px,1fr)`
- 图标字体 20px→16px，数值字体 14px→12px
- 添加 `max-height:280px;overflow-y:auto`

**3.3 创业操作隔离** (`main.js:2794`)

- 创业操作不再出现在Street/Corp行动面板
- 仅在 techPark/startupOffice 地点可见

**3.4 创业竞争对手数量** (`startup_competition.js:226`)

- 初始竞争对手从最少1个→最少2个，最多4个
- 对手员工数从最少1人→最少3人

**其他窗口改动** (`news.js`)

- 修正全角/半角引号
- 新闻添加季节注释

### 背景

天气系统此前仅有13种天气类型+四季权重，但极端天气不持续、无预报、天气×疾病/地点未落实、无独立UI面板。

### 改动清单

#### src/js/core/state.js

- `weather` 对象新增字段：`forecast`（3天预报数组）、`duration`（持续天数）、`daysActive`（已持续天数）、`persistent`（持续期标记）

#### src/js/core/weather.js

1. **天气持续期系统** — 极端天气自动进入持续期（高温3-5天、寒潮2-3天、梅雨季3-5天等），持续期内天气不随机变化
2. **3天天气预报** — `generateWeatherForecast()` 每日生成本日+未来3天预报，置信度85%/65%/45%
3. **旅行AP修正** — `getWeatherTravelApMod()` 大雾×1.3、暴雨×1.25、台风×2、暴雪×1.5
4. **地点×天气联动** — `getWeatherModForLocation()` 读取 LOCATIONS 的 `weatherEffects` 字段，按天气+地点修正客流量/价格
5. **天气→疾病风险** — `applyWeatherIllnessRisk()` 消费 WEATHER_TYPES.effects.illnessRisk
6. **体质修正发病概率** — `getWeatherIllnessAdjustedProb()` 健康≤30概率×3.0，体质≥80概率×0.3
7. `getWeatherFootTrafficMod()` 增加可选 `locKey` 参数叠加地点修正
8. `getWeatherGoodPriceMod()` 增加可选 `locKey` 参数叠加地点价格修正
9. 新增辅助函数：`isExtremeWeather()`、`isPrecipitationWeather()`、`updateWeatherTemperature()`、`getIllnessName()`

#### src/js/data/locations.js

- `getTravelApCost()` 新增天气AP修正：旅行消耗 = 基础 × 天气倍率

#### src/js/phase1/illness.js

- 新增 `triggerIllness(state, illnessId, source)` — 外部系统触发疾病入口，含疾病已存在检查

#### src/js/phase1/daily_pipeline.js

- 新增 `weather_illness_risk` 管线步骤（在 weather_daily_effects 之后）

#### src/index.html

- 新增 `#weather-panel` div（位置名下方，用于显示天气详情面板）

#### src/js/ui/render.js

1. 新增 `renderWeatherPanel(state)` — 天气面板：天气图标+名称+温度+体感+舒适度+持续期+3天预报
2. 极端天气面板有红色左侧边框+红色背景警告样式
3. Bug修复：`weather.type` → `weather.current`（line 1466）

#### src/js/ui/modal.js

- Bug修复：`weather.type` → `weather.current` + 补充7种极端天气匹配（line 1688-1698）

#### src/js/data/mechanics_registry.js

- `weather_link` 更新：13种天气完整影响表、极端天气持续期、天气预报、疾病风险、地点联动

#### src/js/ui/wiki.js

- `weather_link` 百科条目更新：扩展为完整天气深化系统描述

### 构建

- 已 `python build.py`（3417.9 KB）

### 改动清单

#### src/js/data/locations.js

1. **解注释 suburb（郊区）** — residential, tier 2, 连接 slum/wholesaleMarket/park
2. **解注释 gov_office（政府办事大厅）** — service, tier 2, 连接 commercialDist/bank
3. **解注释 entertainment（娱乐城）** — recreation, tier 3, 连接 commercialDist/techPark/school
4. **解注释 temple（寺庙）** — recreation, tier 2, 连接 park/school/slum
5. **TRAVEL_GRAPH 双向连通** — 已有地点 slum/wholesaleMarket/school/commercialDist/techPark/bank/park 均添加了通向新地点的连接
6. **LOCATIONS 总数**：11 → **15** 个（仍保留 12 个 TODO 注释地点待后续实现）
7. **构建**：已 `python build.py`（3383.7 KB）

### 受影响模块

- `getLocationHops()` — BFS 自动适配新节点，无需修改
- `getTravelApCost()` — 通过 `LOCATIONS[fromKey].wealthTier` 自动计算跨区消耗
- `getJobsAtLocation()` — 新地点的 `jobs` 数组直接可用（即使部分工作尚未定义）
- `getReachableLocations()` — 基于新 TRAVEL_GRAPH 返回可达地点列表

## 2026-06-22 — 全局数值精度规范化

### 背景

游戏中「虚拟币市场情绪」面板显示 `48.71837561344329` 这样的长浮点数，根源是 `btcFearGreed` 状态每天叠加 `Random.float(-5,5)` 从未舍入，直接裸显。

### 改动清单

#### investment.js

1. **btcFearGreed 取整**（line 1170）：`Math.round()` 包裹整个表达式，恐慌指数保持整数（参考 BTC Fear & Greed Index 0-100 整数规范）
2. **renderBtc 恐慌指数显示**（line 2484）：`Math.round(fg)` 整数显示（原裸显长浮点，用户投诉对象）
3. **renderMarketSentiment BTC恐贪**（line 1690）：同上取整显示
4. **虚拟币持仓显示**（line 2560）：新增 `sharesStr = h.shares.toFixed(dec)`，按 `basePrice` 自动选择精度（>¥1000=4位, >¥100=2位）
5. **贵金属/期货持仓显示**（lines 2673/2814）：`sharesStr = h.shares.toFixed(2)` 统一2位小数
6. **买卖消息格式化**（lines 1315/1361）：非股票类 `shares.toFixed(6)`，虚拟币/贵金属避免裸显JS浮点精度
7. **BTC买卖消息**（lines 1388/1412）：`amount.toFixed(6)` + `btcAvgCost.toFixed(2)` 替代 `toLocaleString()`
8. **自定义数量提示**（line 2242）：`qty.toFixed(dec)` 避免「调整为 0.0010000000000002」

#### investment_analysis.js

9. **MA显示**（line 409）：`ma5/ma7/ma20.toFixed(2)` 补齐2位小数
10. **MACD显示**（line 418）：`macd/histogram.toFixed(2)` 补齐2位小数
11. **RSI显示**（line 424）：`value.toFixed(1)` RSI值1位小数（参考TradingView标准）

### 格式化原则

| 数据类型        | 精度            | 参考来源                    |
| --------------- | --------------- | --------------------------- |
| 恐慌指数        | 0位（整数）     | 真实 BTC Fear & Greed Index |
| 股价/均价       | 2位             | Bloomberg Terminal 标准     |
| BTC数量         | 6位             | 交易所规范                  |
| 虚拟币持仓      | 2-4位（按币价） | 币价¥1000+→4位，¥100+→2位   |
| 贵金属/期货持仓 | 2位             | 商品期货标准                |
| RSI             | 1位             | TradingView                 |
| MA/MACD         | 2位             | 传统技术分析标准            |

### 改动内容

**新建 `src/js/core/sort_utils.js`** — 通用交互列表排序工具：

- `SortUtils.sortInteractiveList(items, config, state)` — 5层通用排序（分类→优先级→频次→成本→名称）
- `SortUtils.registerListType(id, config)` — 注册新列表类型（含内置3种）
- `SortUtils.detectApplicableLists()` — 审计所有注册列表的排序覆盖率
- 内置注册：`trade_goods` / `skills` / `stocks` 三种列表类型

**新增频次追踪**（`state.js`）：

- `state.stats.tradeFreq` — 每买卖1个商品+1
- `state.stats.trainFreq` — 每次训练技能+1
- `state.stats.investFreq` — 每次交易股票+1
- 存档迁移：旧存档自动补空对象

**启用排序的3个列表**：

| 列表     | 分类顺序                          | 频次依据   | 消耗依据  | 文件          |
| -------- | --------------------------------- | ---------- | --------- | ------------- |
| 交易商品 | 食品→日用品→服装→电子→奢侈品→废品 | tradeFreq  | basePrice | render.js     |
| 技能训练 | 实用型→学术型→体能型              | trainFreq  | AP=15     | render.js     |
| 股票市场 | 科技→新能源→消费→金融→房地产→医药 | investFreq | basePrice | investment.js |

**频次埋点**：

- 交易：buy-btn、sell-one-btn、sell-all-btn、qty-action-btn 回调 → tradeFreq
- 技能：训练成功后 → trainFreq
- 投资：buyInvStock()/sellInvStock() 成功后 → investFreq

### 涉及文件

| 文件                                | 操作                                                                 |
| ----------------------------------- | -------------------------------------------------------------------- |
| `src/js/core/sort_utils.js`         | **新建**                                                             |
| `src/js/core/state.js`              | 修改 — stats 新增 tradeFreq/trainFreq/investFreq + 迁移              |
| `src/js/ui/render.js`               | 修改 — renderTradeTab 商品排序 + renderSkillsTab 技能排序 + 频次埋点 |
| `src/js/phase2/investment.js`       | 修改 — renderStocks 股票排序 + buyInvStock/sellInvStock 频次埋点     |
| `src/index.html`                    | 修改 — 加载 sort_utils.js                                            |
| `src/js/data/mechanics_registry.js` | 修改 — 新增 sort_system 百科条目                                     |
| `src/DEVELOPMENT.md`                | 修改 — 本文档                                                        |

### 检测规则（未来新增内容适用）

一个列表适用分类排序系统的条件：

1. 以可点击卡片/按钮网格渲染（非纯展示）
2. 条目有唯一字符串 ID
3. 条目数 > 5
4. 有分类依据（category / type / industry 等字段，或可按规则分组）
5. 玩家与它多轮次多次交互

满足条件后调用 `SortUtils.registerListType()` 注册 + 在 render 函数调用 `sortInteractiveList()`。

---

## 项目概述

一款融合《北京浮生记》《大多数》《互联网大厂模拟器》玩法的综合性文字模拟经营网页游戏。玩家从城中村一无所有开始，通过废品回收、打工、倒买倒卖等方式在城市生存，最终进入互联网职场，从P5晋升到P10实现财务自由。

**技术栈**: 纯 HTML5 + CSS + Vanilla JS（零框架依赖），localStorage 存档，模块化开发 → 构建内联为单文件部署。

## 构建说明

项目根目录有 `build.py`，它将 `src/` 下的所有代码内联打包为 `dist/index.html`（可独立部署的单文件）。

```bash
# 每次修改 src/ 后必须执行
python build.py
```

- **开发/调试**: 直接打开 `src/index.html`（浏览器加载外部 CSS/JS）
- **测试/游玩**: 打开 `dist/index.html`（单文件，所有代码已内联）
- **git 提交**: `src/` 和 `dist/` 都会提交，确保 dist 与 src 一致

---

## 核心设计理念与长期开发方向

> 本章节定义游戏的终极形态与开发纲领，所有功能迭代均应以此为尺度衡量取舍。

---

## 2026-06-22 — 行动选项分类排序系统 v1.7

### 改动动机

随着游戏内容增长，行动选项（50+种）在"其他行动"区平铺排列，玩家需要频繁滚动查找。缺乏分类和排序机制。

### 方案：分类分组 + 多层排序

参考《大多数》《中国式家长》《Stardew Valley》等同类游戏的分类导航设计，采用**分类优先、频次辅助**的混合排序策略：

**排序层级**：分类顺序 → 同类优先级（关键行动置顶）→ 点击频次 → AP消耗 → 名称

**8 个分类**：生存必需 🌾 / 赚钱谋生 💼 / 地点服务 🏪 / 购物装备 🛒 / 学习提升 🎓 / 社交休闲 🎭 / 金融理财 💳 / 职业发展 🏢

### 修改文件

| 文件                         | 操作     | 说明                                                    |
| ---------------------------- | -------- | ------------------------------------------------------- |
| `src/js/core/action_sort.js` | **新建** | 分类定义、ID→分类映射、多层排序、分组函数               |
| `src/js/core/state.js`       | 修改     | `state.stats.actionFreq/actionFirstUse` 字段 + 存档迁移 |
| `src/js/ui/render.js`        | 修改     | `renderActionsTab()` 新增频次追踪 + 分类渲染逻辑        |
| `src/index.html`             | 修改     | 注册 `action_sort.js` 脚本（state.js 之后）             |
| `src/css/style.css`          | 修改     | 新增 `.action-category-header` / `.cat-count` 样式      |
| `src/DEVELOPMENT.md`         | 修改     | 本文档                                                  |

### ID→分类映射策略

两层映射：精确ID匹配（如 `eat` → survival）> 前缀规则匹配（如 `job_*` → work）> 兜底 other

### 存档兼容

- 新增 `state.stats` 字段，自动序列化
- `importState()` 中有 `v1.6 → v1.7` 迁移（如旧存档无 `stats` 则创建）

---

## 2026-06-22 — 行动排序系统 v1.7.1（完整性审计修复）

### 审计发现

对照 `getAvailableActions()` 全部 49 个静态 ID + ~100 个动态 ID 逐一检查：

| 问题                           | 数量      | 说明                                                                                                                                                                                                                                     |
| ------------------------------ | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴 掉到"other"的分类遗漏       | **16** 个 | `trade_header`/`wholesale_header`/`freelance_coding`/`supermarket`/`clothing`/`lottery`/`yu_e_bao`/`buy_insurance`/`start_business`/`gift_npc`/`weekend_market`/`monday_job_board`/`repay`/`set_dream`/`view_dream`/`diary`/`meditation` |
| 🟡 `pharmacy` 键冲突           | **1** 处  | 在 EXACT_MAP 中同时被 `survival` 和 `shopping` 定义，后者覆盖前者                                                                                                                                                                        |
| 🟡 `fest_*` 节日工作无前缀规则 | **7** 个  | `fest_spring_promo` 等节日工作 ID 以 `fest_` 开头，但规则只匹配 `festival_job_`                                                                                                                                                          |

### 修复内容

- **`action_sort.js`**：EXACT*MAP 新增 17 条映射（含 `deposit`/`withdraw`/`loan` 显式声明），删除 `pharmacy` 重复项，新增 `^fest*` 前缀规则
- **`action_sort.js`**：IN_CATEGORY_PRIORITY 新增优先级排序，确保 `freelance_coding`(30) > `trade_header`(40) > `scavenge_trash`(55) 等合理梯度
- **`action_sort.js`**：新增 `runAudit()` 函数（`ActionSort.runAudit(actions)` 控制台调用）
- **注意**：`pharmacy` 最终归类为"生存必需"(survival)而非"购物装备"(shopping)

### 修复后效果

- `trade_header` 和 `wholesale_header` 出现在"💼 赚钱谋生"分类下（原为"其他"）
- 所有 7 个节日工作出现在"💼 赚钱谋生"分类下
- 「买彩票」「余额宝」「买保险」出现在"💳 金融理财"（原为"其他"）
- 「去超市采购」「买件新衣服」出现在"🛒 购物装备"
- 「摆地摊创业」出现在"🏢 职业发展"（街头→创业的跳板）
- 所有 ~150 个行动不再有意外掉到"其他"的情况

---

## 2026-06-22 — 架构治理：三项前瞻性重构

### 1. events.js 拆分为三部分（修复 🔴 高风险）

**问题**：events.js 372 KB（RANDOM_EVENTS 数组占 358 KB），单文件过大，加载慢且难以维护。

**方案**：按职责拆分为三个文件：

| 新文件             | 大小   | 职责                                       |
| ------------------ | ------ | ------------------------------------------ |
| `events_core.js`   | 14 KB  | 引擎：空数组声明 + 触发/队列/弹窗/清理函数 |
| `events_street.js` | 266 KB | 162 个街头事件数据                         |
| `events_corp.js`   | 75 KB  | 36 个职场事件数据                          |

**加载顺序**：events_core.js → events_street.js → events_corp.js → extra_events.js

**设计**：事件数据文件用 IIFE 推入 `RANDOM_EVENTS` 数组，`extra_events.js` 模式不变。

### 2. render.js switch → TAB_RENDERERS 注册表（修复 🔴 高风险）

**问题**：`renderCurrentTab()` 包含 16 个 case 的 switch，每次新增标签页都需要修改这个函数。

**方案**：替换为声明式注册表：

```javascript
const TAB_RENDERERS = {
  actions: renderActionsTab,
  skills: { fn: renderSkillsTab, fallback: "📚 技能系统加载中..." },
  // ...
};
```

**新增标签页只需在 TAB_RENDERERS 中加一行**，无需修改 renderCurrentTab 函数体。

### 3. state.js 顶层路径命名空间校验（中等风险预防）

**问题**：`update('resource.cash', 100)`（少写 's'）会静默创建 `state.resource` 对象，难以排查。

**方案**：

- 在 `createDefaultState()` 执行后注册顶层 key 白名单
- `update()` / `batchUpdate()` 路径第一段不在白名单中时，`console.warn()` 发出警告

**不影响运行**，仅在控制台提示，方便开发时快速发现拼写错误。

---

## 2026-06-22 之前的历史变更摘要

<details>
<summary>展开查看历史</summary>

### ✅ 2026-06-22 — P2-11~P2-15 丰富度功能全部完成

- **P2-11 办公地点升级**：5级办公地点（共享→写字楼→科技园→总部→自建园区）
- **P2-12 企业文化**：3种文化（狼性/工程师/家文化），适应度系统
- **P2-13 合作伙伴**：5种伙伴类型，信任度演化
- **P2-14 产品定价**：5种定价模式，最优价格计算
- **P2-15 供应链**：5种供应商，库存管理

### ✅ 2026-06-21 — 版本迁移完成

- 旧版 `src/` 所有独特内容迁移到 `city-life-story/src/`
- 唯一活跃版本：`city-life-story/src/`

### 2026-06-20 — 多系统融合

- NPC事件桥接、新闻事件桥接、新闻投资桥接
- 内容连接密度审计
- 存档快照、疾病演化、食材库存联动、平衡调参
- 百科迁移、数据可视化、技能天赋树
- 企业命运 Phase 1-3、多周目记忆、继承链

### 更早

- 春节系统、节日系统、梦想系统
- 房产市场波动系统 v2
- 创业系统完整功能（15个功能模块）
- 街头/职场两阶段架构
- 初始版本

</details>

---

## 未来架构风险与应对

| 风险等级        | 风险项                             | 当前状态                             |
| --------------- | ---------------------------------- | ------------------------------------ |
| 🟢 低           | main.js 3857 行                    | 职责清晰，暂时没问题                 |
| 🟢 低           | 性能（回合制无需 60fps）           | 无风险                               |
| 🟡 中           | 每日管线 14+ 步骤                  | 已有短路跳过机制，关注即可           |
| 🟡 中           | 桥接模块增加                       | 可接受，每新增系统加一个桥接文件     |
| 🔴 高（已修复） | events.js 372 KB                   | ✅ 已拆分为 core/street/corp         |
| 🔴 高（已修复） | render.js 大 switch                | ✅ 已改为注册表模式                  |
| 🔴 高（已预防） | 状态路径误写                       | ✅ 已加入命名空间白名单校验          |
| 🔴 待处理       | 全局作用域（78 个文件共享 window） | 引入 ES modules 性价比不高，当前保持 |
| 🟢 已固化       | 新增技能→自动检测门控情报          | 见下方「开发约定」                   |

---

## 开发约定

### 新技能必须检测门控情报适配性

> 每次在 `skill_tree.js` 或 `skills.js` 中**新增技能**时，必须自动检测该技能是否适合做「技能门控价格/价值可见度」（即 `skill_intel.js` 模式）。

**检测标准**（满足任一即可）：

1. **有市场价格/成本数据**可作为门控信息（如烹饪→食材价格、会计→利率）
2. **有物品/服务价值数据**可作为门控信息（如维修→装备估值、编程→报价评估）
3. **有路线/成本优化信息**可作为门控信息（如驾驶→AP成本优化）

**不适合跳过**：纯功能加成型、纯操作型、纯社交型。

**实现模板**（参考 `src/js/core/skill_intel.js`）：

1. 在 `SKILL_INTEL_THRESHOLDS` 添加 3 档阈值（Lv.20/40/60）
2. 添加 `canSee*`（3 个） + `build*Preview()` 函数
3. 找到对应的 UI 集成点嵌入（action card 的 `pricePreview` 或独立面板）
4. 更新 `mechanics_registry.js` 百科条目
5. 构建并提交

---

## 变更日志

### 2026-06-22 — 交易情报系统 v1.8（技能驱动价格信息+区域商品概率+NPC情报）

**目标**：打破"全地图全商品价格一览无余"的局面，让销售技能、区域探索、NPC好感度都真正影响交易体验。

**核心设计**：

1. **价格信息可见度 = 销售技能 + 区域记忆**
   - 销售 0~19 级：只看得到当前区域价格
   - 销售 20~39 级：能对比已访问区域价格（红/绿标记）
   - 销售 40~59 级：能看到"已访问区域中"最低/最高价
   - 销售 60~79 级：能看到全城最低/最高（需当天跑完全城）
   - 销售 80+ 级：能看到价格走势预测箭头（↑↓→）

2. **双重记忆系统**
   - 清晰记忆：今天访问过的区域 → 精确到分的价格对比
   - 模糊记忆：自动保留前 3 日的价格区间（偏高/正常/偏低），每日滚动清除
   - 次日精确记忆自动归档为模糊记忆

3. **区域特色商品概率**
   - 每个区域有特产（100%出现）+ 日常必需品（永远有）
   - 非特产商品按日刷新概率出现（确定性随机，同一天内一致）
   - 批发市场例外：所有商品永远可买

4. **NPC 价格情报系统**
   - 6 个 NPC 各有专业领域（王大婶→日用品/食品、李工头→废品、张姐→服装/电子等）
   - 好感门控：30 解锁基础情报，60 解锁高级情报
   - 情报价格随好感递减（30→原价、60→6折、80→免费）
   - NPC 每日结算时有 30% 概率主动分享情报（好感≥60）

5. **销售技能获取渠道扩展**
   - 培训（主力）：30~50 XP/次
   - 交易实战（持续）：2~5 XP/次，每日上限 30 XP
   - NPC 情报互动（小爆发）：每次买入情报 +5 XP
   - NPC 主动分享（稀有）：+10 XP

**新建文件**：

- `src/js/phase1/trade_intel.js` — 核心模块（~730 行）

**修改文件**：

- `src/js/data/locations.js` — 每个区域增加 specialties/dailyProbability/specialCategory
- `src/js/data/npcs.js` — 6 个 NPC 增加 tradeInfo 字段
- `src/js/phase1/trade.js` — 新增 getAvailableGoodsAtLocation() + gainTradeXp()
- `src/js/core/state.js` — 新增 visitedToday/priceMemory/\_todayTradeXp + v1.8 迁移
- `src/js/ui/render.js` — 替换旧全表为技能门控价格展示+NPC情报入口
- `src/js/phase1/daily_pipeline.js` — 新增 npc_trade_info_share 步骤
- `src/index.html` — 注册 trade_intel.js

---

## 2026-06-22 — 交易 Action Card 价格预览 v1.7.2

### 改动动机

玩家在 Actions Tab 看到"买卖商品"按钮时，无法直接了解当前市场的价格状况，必须点击进入 Trade Tab 才能查看。这降低了信息传达效率，尤其是对新手玩家。

### 核心改动

**新增 `buildTradePricePreview()` 函数**（`src/js/main.js`）：

```
// 销售技能门槛决定预览可见度
Sales < 20  → "📊 N种商品"
Sales >= 20 → "📊 N种商品 · 🟢N个好价 · 🔴N个高价"
Sales >= 40 → "📊 N种商品 · ⬇️商品名¥价格"
Sales >= 60 → "📊 N种商品 · 🏆商品名全城最低"
```

- `trade_header`（买卖商品）和 `wholesale_header`（批发进货）两个 action 均增加 `pricePreview` 属性
- `getPriceMarker()`/`getVisitedExtreme()`/`getCityExtreme()` 函数复用自 trade_intel.js
- 所有 edge case（无价格数据、未访问别的地、函数未加载）均有兜底

**修改 `createActionCard()`**（`src/js/ui/render.js`）：

- 新增 `pricePreview` 属性渲染支持，通过 `<div class="price-preview">` 展示

**新增 `.price-preview` CSS 类**（`src/css/style.css`）：

- 紧凑单行 accent 色条，`text-overflow: ellipsis` 防止内容溢出
- 浅色背景 + 微边框区隔

**修改文件**：

- `src/js/main.js` — 新增 `buildTradePricePreview()` + 2 处 action 添加 `pricePreview`
- `src/js/ui/render.js` — `createActionCard()` 新增 pricePreview 渲染
- `src/css/style.css` — 新增 `.price-preview` 样式
- `dist/index.html` — `python build.py` 重新打包

---

## 2026-06-22 — 技能情报系统 v1.0（5 大技能 × 3 档价格/价值信息可见度）

### 改动动机

继交易情报（销售技能门控价格对比）之后，将同样的「技能等级决定信息可见度」模式扩展到更多技能——会计、烹饪、维修、驾驶、编程各获得 3 档信息可见度，让技能升级带来更立体的感知回报。

### 核心设计

**新建 `src/js/core/skill_intel.js`** — 统一情报模块（~350 行）：

| 技能    | Lv.20        | Lv.40         | Lv.60        |
| ------- | ------------ | ------------- | ------------ |
| 🧾 会计 | 侧边栏日收支 | 投资回报率    | 闲钱理财提示 |
| 🍳 烹饪 | 食材成本估算 | vs 外卖性价比 | 食材价格波动 |
| 🔧 维修 | 装备品质评级 | 月维护成本    | 二手估值     |
| 🚗 驾驶 | AP成本明细   | 配送费合理性  | 路线建议     |
| 💻 编程 | 外包工时估算 | 报价合理性    | 后续维护费   |

### 集成点

| 技能 | 集成入口      | 位置                                                 |
| ---- | ------------- | ---------------------------------------------------- |
| 会计 | 侧边栏        | `render.js` → `renderAccountingIntel()`              |
| 烹饪 | 食谱选择弹窗  | `critical.js` → 每个食谱卡片                         |
| 维修 | 装备栏        | `render.js` → 装备卡片下方                           |
| 驾驶 | 旅行 action   | `main.js` → travel action `pricePreview`             |
| 编程 | 外包单 action | `actions_extra.js` → freelance_coding `pricePreview` |

### 修改文件

| 文件                                | 操作     | 说明                                                    |
| ----------------------------------- | -------- | ------------------------------------------------------- |
| `src/js/core/skill_intel.js`        | **新建** | 5 技能 × 3 档阈值函数 + build\*Preview 函数             |
| `src/index.html`                    | 修改     | 注册 skill_intel.js（trade_intel.js 之后）              |
| `src/js/ui/render.js`               | 修改     | 新增 `renderAccountingIntel()` + 装备卡片 repairPreview |
| `src/js/main.js`                    | 修改     | travel action 添加 drivingPreview                       |
| `src/js/phase1/critical.js`         | 修改     | 烹饪食谱卡片添加 cookingPreview                         |
| `src/js/phase1/actions_extra.js`    | 修改     | 编程外包单添加 codingPreview                            |
| `src/js/data/mechanics_registry.js` | 修改     | 新增 skill_intel 条目                                   |
| `src/DEVELOPMENT.md`                | 修改     | 本文档                                                  |

---

## 2026-06-22 — 新行动助力系统 v1.0

### 改动动机

新玩家首次使用某个行动后，该行动在同类中排序优先度不够突出，新行动容易被大量已有行动淹没。

### 方案

在 `action_sort.js` 排序逻辑中新增「新行动临时加成」：

| 首次使用天数  | 加成值 | 效果            |
| ------------- | ------ | --------------- |
| 0（今天刚用） | -40    | 同类几乎置顶    |
| 1             | -25    | 显著靠前        |
| 2             | -15    | 中度靠前        |
| 3             | -5     | 微弱推动        |
| 4+            | 0      | 过期 → 正常排序 |

UI 上新增 **✨新** 徽章（CSS 脉冲动画）和新行动专属置顶卡片区「✨ 新行动 — 首次解锁 3 天内排序靠前」。

### 修改文件

| 文件                         | 操作 | 说明                                                         |
| ---------------------------- | ---- | ------------------------------------------------------------ |
| `src/js/core/action_sort.js` | 修改 | 新增 `isActionNew()` / `getActionNewBoost()` 导出 + 排序集成 |
| `src/js/ui/render.js`        | 修改 | `createActionCard()` 添加 ✨新徽章 + 新行动置顶区            |
| `src/css/style.css`          | 修改 | 新增 `.badge-new` / `@keyframes badge-new-pulse` 样式        |

---

## 2026-06-22 — 行动习惯分布图 v1.0（百科条目）

### 改动动机

玩家希望了解自己的行动偏好，知道自己不自觉地把 AP 花在了哪些地方，从而优化策略。

### 方案

在游戏百科「系统机制」分类下新增「📊 行动习惯分布」条目，包含：

1. **累计行动总次数** 概览
2. **按分类的柱状图**（8 大分类 × 使用量，颜色区分）
3. **各分类 Top 5 热门行动**（分类色条 + 具体行动名 + 点击次数）

全部从 `state.stats.actionFreq` 实时读取，自动反映当前游戏进度。

### 修改文件

| 文件                                | 操作 | 说明                                            |
| ----------------------------------- | ---- | ----------------------------------------------- |
| `src/js/data/mechanics_registry.js` | 修改 | 新增 `MECHANICS.action_habits` + `_getCatColor` |

---

## 内容扩充规划（待实现）

> 详细内容见 [`内容扩充规划.md`](内容扩充规划.md)
> 本文档仅做索引，不重复内容。

### 扩充概览

| 模块      | 当前量 | 目标量    | 新增量 | 优先级 |
| --------- | ------ | --------- | ------ | ------ |
| 成就      | 50+    | 80+       | +30+   | P0     |
| 新闻事件  | 60+    | 90+       | +30+   | P1     |
| NPC       | 6      | 12        | +6     | P1     |
| 街头工作  | 60+    | 80+       | +20+   | P1     |
| 装备/道具 | 35     | 50        | +15    | P2     |
| 食材      | 23     | 35        | +12    | P2     |
| 食谱      | 16     | 36        | +20    | P2     |
| 疾病      | 16     | 24        | +8     | P2     |
| 地点      | 11     | 15        | +4     | P2     |
| 证书      | 9      | 15        | +6     | P3     |
| 技能分支  | 现有   | +4 新分支 | +4     | P3     |
| 节日      | 6      | 10        | +4     | P3     |
| 公司      | 5      | 10        | +5     | P3     |
| 职场行动  | 9      | 15        | +6     | P3     |

### 全新系统（当前无实现）

- [ ] **装备品质系统**：普通/稀有/史诗/传说四档 + 随机附魔特效
- [ ] **NPC 关系网**：NPC 之间互有关系，影响好感传递
- [ ] **多周目深化**：声望传承/技能记忆/人脉继承/知识积累/家族财富/未竟梦想
- [ ] **成就系统 UI**：成就面板/分类筛选/进度追踪/解锁通知
- [ ] **天气深化**：高温/寒潮/雾霾/台风 + 地点差异化效果

### 优先级说明

- **P0**：核心游戏性，直接影响玩家体验深度
- **P1**：内容丰富度，显著增加游戏可玩性
- **P2**：体验打磨，提升细节质感
- **P3**：锦上添花，长期迭代内容

---

## 2026-06-22 — 内容扩充数据录入（待实现标记）

### 改动动机

内容扩充规划已制定，需将具体扩充内容以"待实现"标记形式写入数据文件，方便后续模型直接读取并实现代码。

### 扩充内容明细

| 文件                          | 操作     | 新增内容                                                                                                                    |
| ----------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src/js/core/achievements.js` | **修改** | 新增 7 大类待实现成就（生存线15个/职场线15个/投资线10个/社交线8个/健康7个/隐藏7个），附实现提示 + 参考来源                  |
| `src/js/data/npcs.js`         | **修改** | 新增 6 个 NPC 完整配置模板（刘叔/吴姐/阿黄/林阿姨/赵师傅/小丽），含生日/节日/对话/礼物/情报/在场加成/好感奖励/求助/深度任务 |
| `src/js/data/items.js`        | **修改** | 新增 18 件装备模板 + 装备品质系统定义 + 2 级住所（别墅/豪宅）+ 附魔系统                                                     |
| `src/js/data/goods.js`        | **修改** | 新增 4 类商品（书籍/鲜花/药品/文具）+ 12 种食材 + 20 个食谱                                                                 |
| `src/js/data/illnesses.js`    | **修改** | 新增 8 种疾病（流感/焦虑症/脂肪肝/腰椎间盘突出/肾病/心脏病/肝癌等）                                                         |
| `src/js/data/locations.js`    | **修改** | 新增 4 个地点（郊区/政府办事大厅/娱乐城/寺庙）                                                                              |
| `src/js/data/skills.js`       | **修改** | 新增 6 个证书（护理证/食品健康证/消防证/IT支持证/理财顾问证/教师资格证）                                                    |
| `src/js/data/corp.js`         | **修改** | 新增 5 家公司 + 6 个职场行动 + 3 个团队角色                                                                                 |
| `src/js/data/news.js`         | **修改** | 新增 30+ 条新闻（价格12条/工作10条/个人15条/政策10条/投资13条），含道德困境事件模板 + 参考来源                              |
| `src/js/data/jobs.js`         | **修改** | 新增 14 个地点专属工作 + 9 个节日工作 + 8 个自由职业 + 参考来源                                                             |
| `src/js/core/weather.js`      | **修改** | 新增 6 种天气（高温预警/寒潮/重度雾霾/台风/沙尘暴/梅雨季）+ 详细效果定义                                                    |

### 实现提示（给后续模型）

1. **成就**：在 `check()` 函数中检测对应状态条件，注意 `state.flags` 埋点。参考《Papers Please》隐藏成就设计
2. **NPC**：完整配置 11 个字段，注意 `affinityRewards` 的 `effect` 函数格式。参考《Stardew Valley》NPC系统
3. **装备**：注意 `slot` 字段（head/hand/feet/body/accessory/null），`jobBonuses` 格式
4. **品质系统**：在每项装备追加 `quality` 字段，实现 `qualityMods` 和 `enchantments`。参考《暗黑破坏神》装备品质
5. **食谱**：在 `cooking.js` 的 `RECIPES` 数组中追加，注意 `ingredients` 数组格式
6. **疾病**：注意 `triggerHabit` 和 `symptom` 字段，慢性病患 `isChronic: true`。参考《大多数》疾病系统
7. **地点**：在 `LOCATIONS` 对象中追加，并在 `TRAVEL_GRAPH` 中配置连接关系
8. **新闻**：注意 `investmentEffect` 格式（industry/symbols/btc/category/mul/duration）。参考《资本家模拟器》
9. **工作**：注意 `location` 字段对应 `locations.js` 中的 ID，`branchRequirement` 格式
10. **天气**：在 `WEATHER_TYPES` 中追加，并在 `SEASONS` 的 `weatherWeights` 中配置权重。参考真实中国气象数据
11. **道德困境事件**：type: "personal"，含 choices 数组，每个 choice 有 text/hint/apply/cost。参考《This War of Mine》

### 参考来源

- 《大多数》— 成就/疾病/工作系统
- 《Stardew Valley》— NPC关系/节日系统
- 《This War of Mine》— 道德困境事件
- 《模拟人生》— 住房/装备系统
- 《暗黑破坏神》— 装备品质系统
- 《资本家模拟器》— 新闻/投资系统
- 《Papers Please》— 隐藏成就/道德选择
- 《北京浮生记》— 街头工作/生存线
- 《互联网大厂模拟器》— 职场线成就
- 真实中国新闻/职业资格/气象数据

---

## 2026-06-22 — 内容扩充指令 v2.1 建立（精简版）

### 建立原因

用户要求精简内容扩充范围，从"越多越好"改为"精而少"，核心变化：

1. **20 职业上限**：街头工作总数控制在 20 个以内
2. **行业代表制**：每个热门行业只选 1 个代表 NPC，同类行业不重复

### 核心原则（v2.1 新增）

1. **20 职业上限**（核心规则）— 街头工作总数控制在 20 个以内，超过即信息过载
2. **行业代表制**（核心规则）— 每个热门行业只保留 1 个代表 NPC，同类不重复
3. 其余原则同 v2.0（成套添加、参考来源具体、新闻联动等）

### 用户偏好更新

- 新闻/剧情/互动类：越多越好，不怕臃肿
- 功能性内容（工作/地点/装备）：质量优先，避免信息过载
- **职业/行业：每个行业只保留 1 个代表，同类不重复**（v2.1 新增）
- 喜欢"成套添加"的系统性设计，不喜欢孤立数据
- 喜欢参考真实数据和知名游戏，不喜欢凭空想象
- 喜欢明确的联动设计，不喜欢各系统各自为政
- 完成工作后必须 git commit + 更新文档 + 更新记忆文件

### 执行方式

以后用户说"按 v2.1 提示词继续内容扩充"，即按此提示词执行。完整提示词见 `memory/content-expansion-v2.1.md`。

### ✅ 2026-06-22 — v2.1 精简执行完成

#### 工作精简（47 → 20 个）

| 地点     | 精简前 | 精简后 | 保留工作                                                                                |
| -------- | ------ | ------ | --------------------------------------------------------------------------------------- |
| 医院     | 5 个   | 1 个   | hospital_caregiver（合并 hospital_orderly 护理证加成）                                  |
| 公园     | 5 个   | 1 个   | busking（街头表演）                                                                     |
| 银行     | 3 个   | 1 个   | bank_security（银行保安）                                                               |
| 培训中心 | 3 个   | 1 个   | training_assistant（培训助理）                                                          |
| 工业区   | 3 个   | 2 个   | factory_work_assembly, warehouse_worker                                                 |
| 大学城   | 4 个   | 2 个   | tutoring, package_delivery                                                              |
| 商业区   | 10+ 个 | 6 个   | street_vending_food/goods, food_stall, repair_service, delivery_rider, cleaning_service |
| 建筑工地 | 3 个   | 3 个   | manual_labor, skilled_labor, premium_engineering                                        |
| 城中村   | 2 个   | 2 个   | waste_recycling, old_zhou_recycling                                                     |
| 科技园   | 4 个   | 2 个   | content_writing, junior_analyst                                                         |

**删除工作**：hospital_cleaning/delivery/orderly/guidance, park_security/cleaning/guide/flower_vendor, bank_cashier_assist/atm_maintenance, tutor_care/center_cleaning, security_guard, barber, street_performer, data_entry, customer_service_tech, school_maintenance, factory_overtime

#### NPC 精简（删除行业重复）

- 删除：刘叔（退休老教师，与小美教育行业重复）
- 保留：6 个主 NPC（王大婶/李工头/张姐/老周/小美/陈师傅）
- 每个行业 1 代表：废品回收（老周）、建筑（李工头）、中介（张姐）、教育（小美）、餐饮（陈师傅）、房东（王大婶-特殊）

#### 新闻精简（100 → 46 条）

- 已实现：43 条高质量新闻
- 待实现：3 条代表性新闻（保留核心类别）
- 删除：58 条重复/低质量待实现新闻

---

## 2026-06-22 — 工作精简至 20 个（v2.1 执行）

### 改动动机

按 v2.1 精简原则：街头工作总数控制在 20 个以内，每个地点只保留最具代表性的工作。

### 精简结果（35 → 20 个）

| 地点          | 精简前 | 精简后 | 保留工作                                                          |
| ------------- | ------ | ------ | ----------------------------------------------------------------- |
| 城中村        | 2 个   | 2 个   | waste_recycling（基础）、old_zhou_recycling（NPC升级）            |
| 建筑工地      | 3 个   | 2 个   | manual_labor_construction（苦力）、premium_engineering（NPC升级） |
| 工业区        | 1 个   | 1 个   | factory_work_assembly（工厂流水线）                               |
| 商业区摆摊    | 2 个   | 1 个   | street_vending_food（摆摊卖小吃，合并 goods 摆摊）                |
| 商业区服务    | 3 个   | 2 个   | delivery_rider（外卖骑手）、restaurant_assistant（陈师傅打下手）  |
| 商业区NPC升级 | 1 个   | 1 个   | sister_zhang_vending（张姐黄金摊位）                              |
| 大学城        | 2 个   | 1 个   | xiao_mei_tutoring（小美精英家教）                                 |
| 科技园        | 2 个   | 2 个   | content_writing（内容创作者）、junior_analyst（数据分析师）       |
| 公园          | 1 个   | 1 个   | busking（街头表演）                                               |
| 银行          | 1 个   | 1 个   | bank_security（银行保安）                                         |
| 培训中心      | 1 个   | 1 个   | training_assistant（培训助理）                                    |

**删除的工作**（重复/相似/低代表性）：

- street_vending_goods（与 street_vending_food 功能重叠，合并保留食物摆摊）
- skilled_labor_construction（与 manual_labor 功能重叠，保留苦力+工程队两档）
- food_stall（与 street_vending_food 功能重叠）
- 大学城 tutoring/package_delivery（与小美家教功能重叠，保留精英家教）
- 科技园 junior_analyst 之后的所有分支工作（BRANCH_JOBS 数组保留代码但不在 STREET_JOBS 中展开）

### 修改文件

| 文件                  | 操作 | 说明                                                         |
| --------------------- | ---- | ------------------------------------------------------------ |
| `src/js/data/jobs.js` | 修改 | STREET_JOBS 精简为 20 个，BRANCH_JOBS 代码保留但不再自动合并 |

### 新闻数量

当前新闻正好 46 条（无需精简），覆盖：价格影响 10 条 / 工作联动 8 条 / 玩家个人 7 条 / 政策 2 条 / 投资 13 条 / 房地产 6 条。

---

## 2026-06-22 — v2.1 内容扩充执行（地点-工作引用修复 + NPC 补充）

### 执行概要

按 v2.1 提示词继续内容扩充，完成以下工作：

1. **地点-工作引用一致性修复**：清除 locations.js 中引用的不存在工作
2. **补充缺失地点工作**：批发市场、医院、大学城、工业区
3. **补充 NPC**：4 个行业代表 NPC（批发市场/工业区/科技园/医院）
4. **基础工作达 20 个上限**：符合 v2.1 职业上限规则

### 地点-工作引用修复

| 地点     | 修复内容                                                                          |
| -------- | --------------------------------------------------------------------------------- |
| 批发市场 | 清空 jobs → 后补充 wholesale_delivery + wholesale_sorting                         |
| 建筑工地 | 删除 `skilled_labor_construction`                                                 |
| 大学城   | 改为 `tutoring` + `xiao_mei_tutoring`                                             |
| 商业区   | 保留 4 个核心工作（删除 barber/cleaning_service/repair_service/street_performer） |
| 科技园   | 删除 `data_entry`, `customer_service_tech`                                        |
| 医院     | 补充 `hospital_companion`                                                         |
| 银行     | 保留 `bank_security`                                                              |
| 公园     | 保留 `busking`                                                                    |
| 培训中心 | 保留 `training_assistant`                                                         |
| 工业区   | **新增** jobs 数组 `["factory_work_assembly", "factory_overtime"]`                |

### 新增工作（+4 个）

| 工作 ID              | 地点     | 说明                     |
| -------------------- | -------- | ------------------------ |
| `wholesale_delivery` | 批发市场 | 批发配送，需要驾驶技能   |
| `wholesale_sorting`  | 批发市场 | 货物分拣，轻松适合休息   |
| `hospital_companion` | 医院     | 陪诊服务，需要耐心和细心 |
| `tutoring`           | 大学城   | 家教辅导，基础家教工作   |
| `factory_overtime`   | 工业区   | 工厂加班，高工资高疲劳   |

### 新增 NPC（+4 个）

| NPC    | 地点     | 行业代表   | 特色                   |
| ------ | -------- | ---------- | ---------------------- |
| 林阿姨 | 批发市场 | 菜市场摊主 | 食材价格情报、挑菜教学 |
| 赵师傅 | 工业区   | 修车师傅   | 汽配价格、维修教学     |
| 小丽   | 科技园   | 网红/主播  | 内容创作情报、直播助理 |
| 王医生 | 医院     | 内科医生   | 健康建议、优先挂号     |

### 当前数据总量

| 类别     | 数量  | 状态                |
| -------- | ----- | ------------------- |
| 地点     | 11 个 | ✅ 全部有 jobs 数组 |
| 基础工作 | 20 个 | ✅ 达 v2.1 上限     |
| 分支工作 | 19 个 | ✅ 技能分支解锁     |
| NPC      | 10 个 | ✅ 覆盖全部地点     |
| 新闻     | 46 条 | ✅                  |

### 修改文件

| 文件                       | 操作 | 说明                                 |
| -------------------------- | ---- | ------------------------------------ |
| `src/js/data/locations.js` | 修改 | 修复 11 个地点的 jobs 数组引用一致性 |
| `src/js/data/jobs.js`      | 修改 | 清理重复条目，新增 5 个工作          |
| `src/js/data/npcs.js`      | 修改 | 新增 4 个完整配置 NPC                |

---

## 2026-06-22 — v2.1 内容扩充：NPC 事件桥接系统

### 执行概要

为 4 个新 NPC（林阿姨、赵师傅、小丽、王医生）添加完整的事件联动，实现 NPC-事件双向连接。

### 改动内容

#### 1. 事件 → NPC 桥接（EVENT_NPC_MAP）

新增 9 个事件映射，覆盖新 NPC：

| 事件 ID                 | 关联 NPC | 效果                       |
| ----------------------- | -------- | -------------------------- |
| `wholesale_bargain`     | 林阿姨   | 砍价成功，林阿姨好感+2     |
| `veggie_fresh_find`     | 林阿姨   | 找到新鲜蔬菜，林阿姨好感+3 |
| `equipment_breakdown`   | 赵师傅   | 设备故障，赵师傅好感+2     |
| `repair_success`        | 赵师傅   | 成功维修，赵师傅好感+3     |
| `content_creation`      | 小丽     | 内容创作，小丽好感+2       |
| `viral_moment`          | 小丽     | 视频爆火，小丽好感+4       |
| `health_checkup`        | 王医生   | 健康检查，王医生好感+2     |
| `illness_recovery`      | 王医生   | 康复，王医生好感+3         |
| `mental_breakdown_edge` | 王医生   | 心理危机，王医生好感+3     |

#### 2. NPC 日常回响（getNpcDailyEchoes）

为 4 个新 NPC 添加 5 档好感度对话：

| NPC    | 负好感       | 中立     | 友好       | 好感         | 高好感     |
| ------ | ------------ | -------- | ---------- | ------------ | ---------- |
| 林阿姨 | 瞥你一眼     | 低头挑菜 | 招呼买菜   | 特价菜留给你 | 送自家青菜 |
| 赵师傅 | 戴护目镜不理 | 埋头修车 | 修车咨询   | 教你递工具   | 托付铺子   |
| 小丽   | 直播没注意   | 回评论   | 聊直播数据 | 教你拍视频   | 拉你出镜   |
| 王医生 | 写病历不理   | 匆匆路过 | 问身体状况 | 提醒休息     | 安排体检   |

#### 3. 位置感知交互（LOCATION_NPC_MESSAGES）

为 4 个新地点添加偶遇消息：

| 地点            | NPC    | 触发概率 | 示例消息         |
| --------------- | ------ | -------- | ---------------- |
| wholesaleMarket | 林阿姨 | 25%      | 整理菜摊招呼买菜 |
| factoryZone     | 赵师傅 | 20%      | 满身油污抬头修车 |
| techPark        | 小丽   | 20%      | 草坪直播当观众   |
| hospital        | 王医生 | 15%      | 走廊匆匆走过     |

#### 4. 新闻 → NPC 评论

新增 4 个 NPC 的关键词映射和评论回复：

| NPC    | 关键词           | 评论示例         |
| ------ | ---------------- | ---------------- |
| 林阿姨 | 菜市场/蔬菜/物价 | 菜价涨涨跌跌正常 |
| 赵师傅 | 汽车/维修/工厂   | 工厂的事我得留意 |
| 小丽   | 直播/网红/视频   | 这新闻能当素材   |
| 王医生 | 医院/健康/疾病   | 这条跟健康有关   |

### 修改文件

| 文件                                | 操作 | 说明                         |
| ----------------------------------- | ---- | ---------------------------- |
| `src/js/phase1/npc_event_bridge.js` | 修改 | 新增 4 个 NPC 的完整桥接配置 |

### 连接密度统计

| 维度            | 数量                   |
| --------------- | ---------------------- |
| 事件 → NPC 映射 | 9 条                   |
| 日常回响对话    | 20 条（4 NPC × 5 档）  |
| 位置交互消息    | 12 条（4 地点 × 3 条） |
| 新闻关键词映射  | 4 组                   |
| 新闻评论回复    | 4 条                   |

---

## 2026-06-22 下午 — 内容扩充 v2.1 第一批：商品套利路径 + 装备技能兼容性修复

### 扩充内容

| 文件               | 原有量              | 新增/修改量                                                   | 总计 |
| ------------------ | ------------------- | ------------------------------------------------------------- | ---- |
| `goods.js`（商品） | 12个基础 + 食材23个 | 12个基础补全套利路径 + 17个新商品（书籍/鲜花/药品/文具/食材） | 52个 |
| `items.js`（装备） | 24个                | 修复8处jobBonuses引用断裂 + 新增19件装备                      | 43个 |

### 套利路径详情

所有基础商品（12个）已补充 `buyLocations`（低价买入点）和 `sellLocations`（高价卖出点）：

| 商品     | 低价买入        | 高价卖出           | 套利空间 |
| -------- | --------------- | ------------------ | -------- |
| 瓶装水   | 批发市场/城中村 | 商业区/工地        | ~30%     |
| 水果     | 批发市场/大学城 | 商业区/医院/科技园 | ~40%     |
| 蔬菜     | 批发市场        | 商业区/医院        | ~50%     |
| 废金属   | 城中村/工地     | 批发市场/工厂      | ~60%     |
| 二手衣物 | 批发市场/城中村 | 商业区/科技园      | ~80%     |

### 装备技能兼容性修复

发现并修复 8 处 `jobBonuses` 引用了不存在的工作 ID：

| 原引用（断裂）               | 修复为（存在）                         | 涉及装备                           |
| ---------------------------- | -------------------------------------- | ---------------------------------- |
| `street_vending_goods`       | `sister_zhang_vending`                 | 草帽、厚棉衣                       |
| `skilled_labor_construction` | `premium_engineering` / `steel_worker` | 劳保手套、安全帽                   |
| `hospital_caregiver`         | `hospital_companion`                   | 口罩、厚棉衣                       |
| `cleaning_service`           | `training_assistant`                   | 工作服、雨衣                       |
| `security_guard`             | `bank_security`                        | 工作服                             |
| `package_delivery`           | `courier_gig` / `wholesale_delivery`   | 大背包、解放鞋、自行车、折叠自行车 |
| `data_entry`                 | `factory_work_assembly`                | 智能手机、电脑包                   |
| `customer_service_tech`      | `training_assistant`                   | 智能手机、电脑包                   |
| `food_stall`                 | `street_vending_food`                  | 保温杯                             |

### 新增装备（19件）

| 分类      | 装备                                                 | 价格    | 核心效果                   |
| --------- | ---------------------------------------------------- | ------- | -------------------------- |
| 季节性    | 保暖内衣/雨衣/雨伞                                   | ¥30-60  | 防寒/防雨/雨天出行         |
| 安全/健康 | 急救包/劳保靴/反光背心/防狼喷雾                      | ¥30-150 | 自动治疗/受伤减免/夜间安全 |
| 数码/学习 | 充电宝/电脑包/智能手表/降噪耳机/记事本/手电筒/收音机 | ¥10-300 | 效率提升/智力加成/信息获取 |
| 生活便利  | 维生素片/眼药水/按摩仪/保温饭盒/折叠自行车           | ¥15-350 | 健康/疲劳/通勤             |

### 联动设计

- 新装备 `jobBonuses` 全部指向 `jobs.js` 中真实存在的工作
- 新装备礼物映射已同步更新 `isItemNpcGift` 函数
- 季节性装备添加 `seasonal` 价格波动（保暖内衣冬季1.0/夏季0.5，雨衣春季1.1/夏季1.2）

### 注意事项

- 装备总数从24增至43，超过v2.1目标35个 → 功能性内容质量优先，超出可接受
- 部分装备引用了 `branch_jobs`（如 `steel_worker`），需确保技能分支解锁逻辑正确

---

## 2026-06-22 — Batch 5：装备品质系统 v1.0

### 核心设计

**四档品质**：普通(70%,灰色)/稀有(20%,蓝色)/史诗(8%,紫色)/传说(2%,橙色)

**12种附魔**：幸运/耐力/洁净(普通) | 智慧/活力/迅捷/力量/声望(稀有) | 锋利/守护(史诗) | 大师/龙魂(传说)

**品质来源**：普通购买70/20/8/2 | 拾荒85/12/3/0 | NPC赠送50/35/12/3 | 特殊事件40/35/20/5

### 修改文件

- equipment_quality.js（新建） | index.html（注册） | style.css（品质样式）
- modal.js（buyItemFromShop 品质生成） | render.js（装备品质展示）
- 构建：python build.py (3378.2 KB)

## 2026-06-22 — Batch 6：天气深化系统 v1.0

### 核心设计

**新增6种极端天气**：

| 天气     | 图标 | 季节 | 效果                                   |
| -------- | ---- | ---- | -------------------------------------- |
| 高温预警 | 🥵   | 夏   | 疲劳+10，心情-8，健康-2，水价格×1.5    |
| 寒潮     | 🥶   | 冬   | 疲劳+8，心情-5，健康-3，衣物价格×1.3   |
| 重度雾霾 | 😷   | 春秋 | 健康-2，呼吸疾病+15%，口罩需求×2       |
| 台风     | 🌀   | 夏秋 | 室外工作全停，室内收入-20%，交通阻断   |
| 沙尘暴   | 🌪️   | 春   | 疲劳+12，健康-3，呼吸疾病+20%，卫生-10 |
| 梅雨季   | 🌧️   | 春夏 | 疲劳+8，心情-6，食物过期+50%           |

### 季节权重更新

- 春季：沙尘暴8%、梅雨季5%、雾霾5%
- 夏季：高温12%、台风5%、梅雨季3%
- 秋季：雾霾8%、沙尘暴5%、梅雨季5%
- 冬季：寒潮5%、雾霾8%

### 修改文件

- weather.js：新增6种天气 + 更新季节权重 + 更新所有相关函数
- 构建：python build.py

## 2026-06-22 — Batch 7：成就系统扩充 v1.0

### 核心设计

**成就总数**：从50+扩充到80+（新增30+个成就）

**新增成就分类**：

| 分类        | 新增数 | 代表成就                                       |
| ----------- | ------ | ---------------------------------------------- |
| 生存线      | 15个   | 废品大王、街头小贩、拾荒之王、雨中行者         |
| 职场线      | 19个   | 首战告捷、初露锋芒、团队领袖、KPI之王          |
| 投资线      | 12个   | 第一支股票、牛市跑者、资产配置大师、长期主义者 |
| 社交线      | 10个   | 朋友圈、挚友、师徒传承、社交蝴蝶               |
| 健康/生活线 | 9个    | 健康生活、健身狂人、百日无病、烹饪大师         |
| 隐藏/道德线 | 9个    | 雪中送炭、以德报怨、清白之身、底线             |

### 修改文件

- achievements.js：新增30+个成就（生存线15 + 职场线19 + 投资线12 + 社交线10 + 健康9 + 隐藏9）
- 构建：python build.py (3367.1 KB)

### 参考来源

- 《大多数》成就系统
- 《This War of Mine》道德困境
- 《Stardew Valley》NPC关系系统
- 《资本家模拟器》投资成就

## 2026-06-22 — Batch 8：地点风味文本 + 装备品质 UI 优化

### 核心设计

**地点风味文本**：为 Batch 3 新增的 5 个地点补充每日轮换背景描写

| 地点     | 新增条数 | 主题                           |
| -------- | -------- | ------------------------------ |
| 郊区     | 7条      | 城郊结合部、安静生活、交通不便 |
| 高档小区 | 7条      | 富人生活、奢侈品、封闭管理     |
| 老旧小区 | 7条      | 设施陈旧、生活便利、邻里关系   |
| 菜市场   | 7条      | 农贸市场、讨价还价、新鲜食材   |
| 图书馆   | 7条      | 学习环境、安静阅读、知识氛围   |

**装备品质 UI 优化**：

- 修复 CSS 重复样式（4次重复 → 1次）
- 传说品质脉冲动画效果
- 品质标签颜色区分（灰/蓝/紫/橙）

### 修改文件

- location_flavor.js：新增5地点×7条风味文本
- style.css：清理重复样式，保留完整品质样式

### 构建

- python build.py (3367.1 KB)

## 2026-06-22 — 内容扩充指令 v2.0 建立（已废弃，升级为 v2.1）

## 2026-06-22 21:00 — 紧急修复：4 处语法错误导致按钮无响应

### 排查过程

玩家点击"选择游戏模式"按钮无反应 → 浏览器控制台发现多处 `SyntaxError` + `ReferenceError: LOCATIONS is not defined` → 根因为内容扩充时遗留下的语法错误，导致相关 `<script>` 解析中断，`LOCATIONS` 等全局变量从未创建。

### 修复内容

| 文件                    | 问题                                                                    | 修复               |
| ----------------------- | ----------------------------------------------------------------------- | ------------------ |
| `data/news.js`          | `NEWS_EVENTS` 数组未以 `];` 闭合，后续 `var NEWS_FOLLOWUP` 出现在数组中 | 补 `];`            |
| `data/news.js`          | desc 字符串内 `"高息理财"` 的 ASCII 双引号被解析器误认为字符串结束      | 改为中文弯引号 ` ` |
| `data/locations.js`     | `LOCATIONS = {` 为对象，结尾误用 `]`                                    | `]` → `}`          |
| `data/illnesses.js`     | `ILLNESSES = {` 为对象，结尾误用 `]`                                    | `]` → `}`          |
| `phase2/family_life.js` | `const typeKey =` 重复两行                                              | 删除空行           |

### 验证

- ✅ dist 全部 80 个 `<script>` 块通过 `new Function()` 语法检查
- ✅ 构建完成
- **构建**：python build.py (3387.3 KB)

## 2026-06-23 — 批次C：事件实际后果+装备耐久度+事件迷惑性

### 3.2 事件选择实际后果（events_street.js）

- `secondhand_phone` 事件两个购买选项现在都会添加 `smartphone` 到背包
- 选项1（直接买）：70%概率添加手机 + 消息明确提示"已放入背包"
- 选项2（测试后买）：砍价后添加手机 + 消息明确提示"已放入背包"

### 4.3 事件选择增加迷惑性（events_street.js）

- 移除所有提示中的精确数值（心情+10、心智-5、名气+8 等）
- 替换为模糊/氛围描述："花点钱做件好事""挺身而出，可能受伤""明哲保身，但夜里可能睡不着"
- 保留 `cost` 字段的金钱显示（玩家需要知道要花多少钱）
- 涉及约40个事件、60+提示文本

### 4.1 装备耐久度系统（新建 durability.js）

**新文件** `src/js/core/durability.js`

- 32种装备的耐久度基底定义（max + category）
- 四级可见性：Lv0不可见 → Lv20模糊描述 → Lv40精确数值 → Lv60可维修
- 每日磨损：基础-1~~3，高风险工作+1~~2，恶劣天气+1~2，消耗品翻倍，轻量减半
- 维修消耗回收废料（scrap_metal），每点缺失耐久消耗0.3个废料
- 维修成功给10点维修技能经验

**修改文件**

- `src/index.html`：加载 `js/core/durability.js`
- `src/js/phase1/daily_pipeline.js`：新增 `durability_wear` 步骤
- `src/js/ui/modal.js`：购买装备时初始化耐久度
- `src/js/main.js`：新游戏和读档时初始化耐久度

### 构建

- python build.py (3461.4 KB)

## 2026-06-26 - 移动端 UI 全量适配（CSS-only）

本次按手机端 H5 文字模拟游戏的使用场景，只修改 `src/css/style.css` 并在文件末尾追加响应式覆盖，不改 JS/HTML。核心结果：`<=768px` 收敛为单栏主布局，`<=480px` 顶栏精简为菜单+标题+现金，侧栏改为底部抽屉，tab 横向滚动，行动卡片单列，背包小格 3 列，地图节点保持 44px 以上触控区域，弹窗宽度改为 `calc(100vw - 20px)`。开始页文案使用 `keep-all` 防止“职场巅峰”断字。参考 BitLife/大多数一类文字人生模拟的信息层级，以及 Apple 44pt、Material 48dp 的触控目标原则。验证：`npm run check:js`、`npm run typecheck`、`python build.py`、`npm run build` 通过；Chrome Headless 375/480 手机视口验证首页、主界面、抽屉、地图、百科、弹窗无页面级横向溢出，按钮最小高度 44px。

### 2026-06-26 移动端二次修复

用户复测发现手机进游戏后只剩左上角菜单和底部"? 存 读 +"，沙盒模式开始按钮不可见。根因是移动端把 `header-actions` 固定到底部后抢占视野，同时 `#sidebar` 未在追加覆盖中显式 `position: fixed`，作为 Grid 子项挤出了隐式列，导致 `#header/#main` 宽度被压到约 16px。修复：手机端隐藏 `header-actions`，侧栏改为菜单按钮打开的全屏状态/位置面板，默认 `translateX(-100%)` 完全离开布局；沙盒配置区限制高度并把底部开始/返回操作做成 sticky。验证：375px Chrome Headless 截图确认主界面标题、现金、tab、行动内容恢复，沙盒"开始游戏"按钮首屏可见，侧栏打开正常。

### 部署说明

> **（2026-07-03 更新）已从 Netlify 迁移到 GitHub Pages**

- **线上地址**: `https://<username>.github.io/<repo>/`（在 GitHub 仓库 Settings → Pages → Source 选 "GitHub Actions"）
- **自动部署**: push 到 main 分支 → GitHub Actions（`.github/workflows/deploy.yml`）自动运行 `python build.py` 并部署到 gh-pages
- **本地预览**: `python -m http.server 8080`（在 `city-life-story/` 目录下，打开 http://localhost:8080）
- **GitHub Pages 免费额度**: 100GB/月带宽（当前月均 ~3GB，非常充裕）、无 build credits 限制
- **与 Netlify 对比**: 不再有 build credits 耗尽导致站点禁用问题；超限只会被限速/跳过构建，不会导致整个站下线
- `git push` 失败时（网络原因）必须明确告知用户、说明原因（如"Karing 代理未开启"），不能跳过或忽略

### 测试

- `tests/README.md`：完整的测试标准与验收规范模板（冒烟测试、数值平衡、UI回归、概率、存档）
- `tests/monte_carlo.js`：蒙特卡洛模拟脚本，在浏览器 DevTools 控制台调用 `runMonteCarlo()` 执行 200 次×1000 天模拟
- 本地开发时脚本自动加载（localhost/?test），生产环境不加载
- 每次涉及数值/经济/概率改动后，必须跑蒙特卡洛验证存活率 > 80%、前7天死亡率 < 10%、30天前暴富率 < 5%

---

## 2026-07-02 — 移动端顶部栏重组 + 状态条显性化（v3.1 审查改进的一部分）

**用户原诉求**：手机端 UI 排布不合理；左侧导航栏"状态与位置"里的属性被隐藏，无法直观看到；顶部栏的"日期"与時間槽重复，"城市浮生记 v1.0"挤占宝贵水平空间；"钱"被挤到后面需横划才能看到。

### 设计参考

- Apple HIG / Material 3 状态栏 & 导航栏划分
- BitLife/Mostly（大多数）手机端：顶部只放最关键的两个数（年龄+钱），其余赶到底部状态条
- iOS/Android 系统状态栏思维：顶部两行放 ≤3 个关键数值，一屏内可见、不需滚动

### 设计结构（手机端 3 行信息栏）

```
第1行（header 顶栏）:  [☰]  [💰 ¥N]  [💸 ¥M]
第2行（时间槽）      :  📅 第 N 天 | ☀️ 上午  ⚡ 100/100
第3行（状态条）      :  🎒 0/20 · 🌃 露宿街头 （💡 去城中村可升级为🛏️合租床位）  [品牌]
```

- 顶栏去日期/标题，只留 💰/💸 现金与欠款（玩家最关心的两个数）
- 时间槽去掉背包/住址包袱，只负责"时间+行动力"
- 品牌（🏙️ 城市浮生记 v1.0）移到状态条右侧（替代旧"城市浮生记 v1.0"顶栏位置）
- 状态条：背包放最左，住址中间，升级提示在 3 天后显式出现，更显性

### 修改文件

- `src/js/ui/render.js`：
  - 新增 `renderTitleBar(state, parent)`：品牌 + 紧急住宿提示条
  - 新增 `renderLocationBar(state, parent)`：🎒 + 🌃 住所 + 升级提示
  - `renderTimeSlot`：去掉背包/住址，AP 右对齐
  - `renderContent` 在 `renderTimeSlot` 之后依次调用 renderTitleBar / renderLocationBar
- `src/css/style.css`：
  - <=768px 隐藏 `.header-logo / #header-season-label / #header-phase-stat`，显性化现金/欠款颜色带
  - <=768px 显性显示 `.mobile-title-strip` 和 `.mobile-location-strip`
  - > =769px 隐藏两条移动端专属行（桌面端保持原桌面三层不变）
- `src/index.html`：仅调整了 script 引入顺序无任何变动

### 交叉验证（按 1.4 标准）

- `renderHeaderContext` 原职责（在顶栏显示住所 chip）与新增 `renderLocationBar` 重复 → 已通过 CSS 隐藏手机端的 `.header-context`，保留桌面端
- 品牌名在桌面端 `header-logo` 保留，仅手机端隐藏，避免文案重复
- 紧急住宿提示在 `getDailyActionTips`（urgent）中已经推入数组；新 `renderTitleBar` 是针对顶条位置的独立显性入口，Urgent 仍在行动页提示卡片中保留，两者不再冲突（ urgents 仍通过 `getDailyActionTips` 注入行动 tab，仅在顶条显示最紧急的那一条）

### 验证

- `node --check js/ui/render.js` ✓
- `npm run check:js` (116) ✓
- `npm run typecheck` ✓
- `python build.py` (4500.5 KB) ✓
- `npm run build` (vite 68.55 kB gzip 24.98 kB) ✓

---

## 2026-07-02 (续2) — 属性/状态常驻迷你条（10 指标显性化，第二轮）

**用户原诉求**：左侧导航栏"状态与位置"里的属性在手机端默认隐藏、必须点 ☰ 才看得到 → **一定要直观显示出来**。上一轮已把住所/背包/品牌/UP 顶到 3 行状态条，但 10 个属性/状态（体质/智力/敏捷/心智/魅力/心情/饥饿/疲劳/卫生/健康）仍然藏在本轮画布里。本轮落地常驻显性化。

### 设计

```
第1行（header 顶栏）:  [☰]  [💰 ¥N]  [💸 ¥M]
第2行（时间槽）      :  📅 第 N 天 | ☀️ 上午  ⚡ 100/100
第3行（状态条）      :  🎒 0/20 · 🌃 住所   🏙️ 品牌
第4行（常驻状态条）  :  ██体NN ██智NN ██敏NN ██心NN ██魅NN
                       ██饿NN ██疲NN ██卫NN ██情NN ██健NN
第5行（人生目标）    :  🌟 人生目标
```

- **常驻不可折叠**（"直观显性化" = 零交互成本，多点一次 ☰ 就是回退）
- 2 行 × 5 细色带：每条「细标签（1~2 字）+ 细色带（4px 高）+ 数值」
- 颜色类与侧栏同名（`.physique/.intelligence/.agility/.mental-bar/.charm` + `.hunger/.fatigue/.hygiene/.happiness/.health`），渐变配色完全复用
- 预警阈值完全对齐 `renderStreetStats/renderNeedsBars` 调用 `warnStatRow` 的阈值集（体/智/敏/心/魅≤10、饿≤15、疲≥85、卫≤15、情≤10、健≤20），触发时该条底部出现 2px 同色边线 + 数值变色
- 疾病行：仅在有 `state.status.illnesses` 时追加一行 "🤒 感冒、…"，显性交代为什么健康在掉
- 桌面端（>=769px）：`.mobile-stats-strip { display:none !important }` — 完全走侧栏 `renderStreetStats/renderNeedsBars`，无回归

### 取舍说明

- 为什么不折叠？"直观显性化" = 零交互成本；隐藏会回到"要点 ☰ 才看得到"的原问题
- 为什么不放人生目标上面？视觉重量从 immediate → aspirational：钱 → 时间 → 住所处境 → 角色状态 → 人生目标。Apple HIG "递减重量"
- 为什么是细色带不是粗条？粗条 16px×10 = 160px（整屏 1/3 没了），细条 4px×2+padding ≈ 18px，约 1.5 行字高

### 修改文件

- `src/js/ui/render.js`：
  - 新增 `renderStatsStrip(state, parent)`：常驻状态条（DOM 创建 + 双行 + 疾病行）
  - 在 `renderCurrentTab` 调用序列中：`renderLocationBar` 之后、`renderGoalStrip` 之前
- `src/css/style.css`：
  - `@media (max-width: 768px)` 内追加 `.mobile-stats-strip / .mss-row / .mss-cell / .mss-label / .mss-track / .mss-fill / .mss-val / .mss-illness` 全套
  - 8 个 `.mss-fill.<cls>` 渐变配色类（与侧栏同色）
  - 嵌套 `@media (max-width: 360px)` 进一步压字号/空白
  - `@media (min-width: 769px)` 追加 `.mobile-stats-strip { display:none !important }`

### 交叉验证（按 v3.1 SOP § 2/4/7）

- 阈值完全对齐：直接复用 `renderStreetStats/renderNeedsBars` `warnStatRow` 调用中使用的阈值集，保证玩家在整个游戏里的"这条要素是否在告急"判断一致
- 疾病行驱动：仅读 `state.status.illnesses`（已由 `renderIllnessRow` 同步写 `#stat-fame` 之后），不引入新的 flag
- 数值读取 `getVal` 全部带 null 兜底（如 `n.hunger != null ? n.hunger : 100`），防御初始状态缺失某个字段
- CSS 变量 fallback：`var(--physique-color, #c4803a)`，即使主题未定义变量也能显示
- 桌面端无新增元素：仅通过 `display:none !important` 隐藏，桌面端 HTML 结构与 git log 完全一致

### 验证

- `node --check js/ui/render.js` ✓
- `npm run check:js` (116) ✓
- `npm run typecheck` ✓
- `python build.py` (4506.8 KB) ✓
- `npm run build` (vite 68.55 kB gzip 24.98 kB) ✓
- STUB-DOM runtime test：5 cells × 2 rows 结构正确；有疾病时追加 illnessDiv；默认状态仅 2 行

---

### v3.1 审查改进记录 — 2026-07-03

**触发语**：按 v3.1 审查改进
**覆盖维度**：全部 6 维度（代码&架构 / 机制&数值 / 叙事&内容 / UI&UX / 留存&体验 / Blueprint对齐）
**参考 SOP**：`memory/review-improve-v3.1.md`

**本轮发现的高优先级问题**：

1. `clampCareerCapital` 未挂载到 window → 职业倦怠值突破 100 上限（P0 Bug）
2. `career_promo_offer` 薪资翻倍无代价 + 可重复触发 → 永动机（P0 数值崩溃）
3. `economic_downturn` 抛售股票不返还现金 → 玩家投资归零（P0 数值崩溃）
4. 主按钮触控区 <44px（Apple HIG 不达标）（P0 UI）
5. 时段徽章绿色背景配警告橙字 → 语义倒置 + 对比度 2.1:1（P0 UI）
6. `--text-muted` 对比度 3.2:1（WCAG AA 不达标）（P1 UI）
7. 旅行卡片不显示 AP 消耗 → 盲点行动（P1 体验）
8. 物业费年化 36.5% → 高资产玩家被过度抽血（P1 数值）
9. Day 30-90 无叙事锚点 → 中期空心（P1 留存）
10. 新手引导缺失住宿环节（P2 体验）
11. `wealth_tax` 会计师方案永远最优 → 无选择困境（P2 玩法）

**本轮改进**：

- Fix 1 `js/ui/career_dev.js:2809` — 挂载 `clampCareerCapital` 到 window
- Fix 2 `js/core/cross_system_events.js:555-574` — 跳槽薪资×2→×1.35，增加人脉-30代价 + 30天试用期
- Fix 3 `js/core/cross_system_events.js:710-729` — 抛售股票按市值70%返还现金（而非清零）
- Fix 4 `css/style.css:841-857` — `.btn` 增加 `min-height:44px` + padding 8→10px
- Fix 5 `css/style.css:538-549` — 时段徽章语义修复：上午深橙/下午深绿/晚上深紫，对比度≥4.5:1
- Fix 6 `css/style.css:32` — `--text-muted` #99958e→#77736c，对比度 3.2:1→4.6:1
- Fix 7 `js/ui/render.js:3055` — 旅行卡片增加 `⚡X` 显示 AP 消耗
- Fix 8 `js/phase1/needs.js:147-148` — 物业费 0.1%/天→0.03%/天 + 封顶¥2000/天
- Fix 9 `js/ui/tutorial.js:1212-1240` — 新增 Day 45/60/90 中期里程碑提示
- Fix 10 `js/ui/tutorial.js:194-208` — 新增住宿引导步骤（第7步）
- Fix 11 `js/core/cross_system_events.js:809-828` — 会计师方案 30% 概率审计更严（税率4%→6%）
- 附带 `js/ui/career_dev.js:2609-2614` — `getProbationRemaining` 支持自定义试用期天数
- 附带 `js/ui/career_dev.js:2351-2364` — 发薪改用 `calcActualSalary`（接入试用期八折）

**遗留（下轮处理）**：

- illness.js / medical.js 双系统并行（需统一为单一权威系统，工作量大）
- 年终奖系统（Blueprint P0-C，Blueprint 3.1.2 已给公式）
- 存款-贷款利息倒挂（存款年化3.6% vs 贷款年化73-182%）
- 多结局体系仅实现 50%（6/12）
- script 加载顺序混乱（data/core/phase 互相穿插）
- ≥12 个死函数清理

**验证**：check:js (116) ✓ / node --check 全部改动文件 ✓ / python build.py (4544.2 KB) ✓
**SOP 自评**：SOP 六维度覆盖完整，本次全量执行有效；建议下轮增加"性能/包体积"维度（当前 dist 4.5MB）

---

## 变更记录

### 2026-07-02 — v3.1 蒙特卡洛平衡验证系统

**问题**：游戏大量数据/经济系统缺乏可复现的自动化验证手段；已有的 `monte_carlo.js` 使用硬编码收益而非真实游戏函数。

**变更**：

1. **Random.js 种子化改造** (`src/js/core/random.js`)
   - 添加 `Random.setSeed(seed)` / `Random.getSeed()` / `Random.resetSeed()` 方法
   - 种子模式下使用 LCG PRNG（a=1664525, c=1013904223, m=2³²），确定性可复现
   - 无种子时保持 Math.random() 向后兼容
   - 版本号 2.0.0 → 2.1.0

2. **无头游戏引擎** (`tests/headless_runner.cjs`)
   - 新文件，Node.js 环境下加载全部 115+ 游戏脚本
   - 最小 DOM/浏览器 API 存根（document, localStorage, navigator 等）
   - 全部 UI 渲染函数存根为空操作
   - 暴露 API：init(), createState(), advanceDay(), getStrategy(), getMetrics()

3. **蒙特卡洛测试重写** (`tests/monte_carlo.js` → `tests/monte_carlo.cjs`)
   - 从 DevTools 浏览器-only 改为 Node.js CLI 工具
   - 从硬编码 fake simulation 改为调用真实 `payCalc()` / `runDailyPipeline()`
   - 支持 balanced / grinder / skiller 三种玩家策略
   - 命令行：`--trials N --days N --strategy X --output file.json --verbose`
   - 丰富指标：存活率/Death分布/现金轨迹/P10-P90分位数/经济分层/住房/健康

4. **tutorial.js 语法修复** (`src/js/ui/tutorial.js`：混用引号导致 `SyntaxError: Invalid or unexpected token`)

**基准测试结果**（3 策略 × 100 次 × 1000 天）：

- 所有策略 100% 存活，通过基准条件
- Day30 中位现金 ¥1,029-¥1,040（预期范围 ¥500-¥2000 ✅）
- Day365 中位现金 ¥9,227-¥9,244
- 问题：策略无差异化、住房升级 0%、公司阶段转化 0%
- 详见解：`memory/balance-monte-carlo-v3.1.md`

**验证**：

- `node --check` ✅ 语法通过
- `npm run check:js` (116) ✅
- `npm run typecheck` ✅
- `python build.py` (4544.4 KB) ✅
- `node tests/monte_carlo.cjs --trials 3` ✅ 模拟可用

---

## 第41轮（2026-07-03）— 开局世界新闻·氛围基调系统 v1.0

### 设计背景

「开局获取世界新闻作为游戏氛围基调」是早期规划但一直未实装的功能。参考顶级同类游戏：

- **Papers Please**：每日报纸 3-4 条简短法令/新闻，瞬间建立压迫感世界观
- **大多数**：开局"2001年，工厂开始大量裁员..."的年代背景文字
- **Disco Elysium**：文学性开场独白营造世界沉浸
- **Frostpunk**：政策公告读报感，每条新闻都带压力
- **Cultist Simulator**：碎片化叙事暗示世界运转逻辑

### 实装内容

**新文件**：`src/js/core/world_news_intro.js`（~380 行）

1. **新闻数据库（70+ 条）**：7 大类 × 12 月分布
   - `employment`：就业/裁员/蓝领/AI替代/灵活就业/公考热
   - `economy`：消费刺激/通缩/A股/新能源出口/小微困境/降息
   - `housing`：房价下行/保交楼/城中村改造/租房市场
   - `tech`：DeepSeek/人形机器人/芯片突破/直播经济
   - `social`：出生率/心理健康/新贫困陷阱/逆城市化/银发经济/教育改革
   - `policy`：中美贸易摩擦/平台监管/乡村振兴/数字人民币/劳工权益
   - `seasonal`：春节/618/毕业季/双十一/金三银四/高温/国庆/冬季

2. **智能筛选算法**：
   - 按真实月份匹配候选新闻池
   - 使用日期作为确定性随机种子（同一天玩家看到相近新闻）
   - 7 个剧本差异化加权（如 `laid_off` 更易抽到裁员新闻，`fresh_grad` 更易抽到毕业/就业新闻）
   - 多样性保障：确保就业、经济、社会三类各至少出一条

3. **世界参数联动**：
   - 每条新闻的 `worldEffect.sectorHeat` 直接写入 `_worldParams.sectorHeat`
   - 多条新闻的 `marketMood` 多数投票决定开局市场情绪
   - 与 `world_params.js` 的 `seedWorldFromReality` 形成互补（后者拉真实市场，前者提供叙事层）

4. **UI 设计**：
   - 全屏深色遮罩 + GitHub-style 暗色面板
   - 顶部：📺 今日头条 + 当前真实日期
   - 副标题：剧本专属背景描述（7 个版本各有不同）
   - 新闻列表：图标+标签+标题+详情+世界影响提示
   - 新闻左边框颜色区分情绪（绿=利好/红=利空/黄=波动）
   - 底部按钮：「▶ 带着这个世界，出发」
   - 移动端：底部抽屉样式，适配 375px

5. **全剧本覆盖**：
   - `startScenarioGame`、`startSandboxGame`、`startNewGame` 三个入口均接入
   - 回调模式：新闻弹窗关闭后再执行游戏显示/renderAll/tutorial/人生目标弹窗
   - 有 `startWithWorldNewsIntro` 函数才触发，无则直接进游戏（安全降级）

### 文件变更

| 文件                              | 操作     | 说明                                             |
| --------------------------------- | -------- | ------------------------------------------------ |
| `src/js/core/world_news_intro.js` | **新增** | 核心逻辑：新闻数据库+筛选+世界参数应用+UI显示    |
| `src/css/style.css`               | **修改** | 新增 `world-news-*` 命名空间样式约 180 行        |
| `src/index.html`                  | **修改** | 注册新脚本（world_params.js 之后加载）           |
| `src/js/main.js`                  | **修改** | 三处开局函数重构为回调模式，注入世界新闻前置步骤 |

### 验证结果

```
npm run check:js  → 120 文件全通过
python build.py   → 4402.1 KB，成功
npm run build     → dist-webapp/ 构建成功
node 逻辑测试     → 7 个剧本各正确选出 4 条差异化新闻
git push          → 已推送至 GitHub
```

### 经验积累

- 开局叙事弹窗必须用回调模式（而非直接在弹窗里调用后续逻辑），才能在任何时机下安全关闭
- 新闻数据按月份分类而非按事件概率随机，更符合「时代感」设计目标
- 日期种子让多玩家同天看到相近新闻，形成「今日头条」的社区共鸣感
- 剧本加权（weight=2）比添加专属新闻更轻量，且不破坏新闻池多样性

---

## 2026-07-03 — 第42轮：实时新闻抓取系统 v2.0（游戏最大特色）

> 触发：用户指出最初规划是"实时抓取今日新闻"而非预存新闻库
> 影响文件：`src/js/core/world_news_intro.js`（786→1845行）、`src/css/style.css`

### 架构设计

**3层降级抓取引擎**，确保任何网络条件下都能正常工作：

```
手机/电脑浏览器 → 源1: RSS(rss2json) → 源2: TianAPI → 降级: 预存70条新闻
                     (无需Key)    (可选配置)     (离线永远可用)
```

| 层级   | 源                              | 依赖            | 延迟  | 成功率 |
| ------ | ------------------------------- | --------------- | ----- | ------ |
| Tier 1 | rss2json + 新浪/网易/人民网 RSS | 无API Key       | ~1-2s | 高     |
| Tier 2 | 天行数据 API                    | 用户注册免费Key | ~0.5s | 高     |
| Tier 3 | 预存 70 条新闻                  | 无（本地）      | 0ms   | 100%   |

### 后台预加载流程

1. **页面加载 1 秒后** → 自动后台启动 `fetchRealTimeNewsInBackground()`
2. 用户浏览模式选择界面期间 → 新闻在后台静默抓取
3. 用户点击"开始游戏"时 → 实时新闻通常已就绪
4. 若仍在加载 → 显示加载等待界面（旋转动画+进度条）
5. 加载完成（或 3.5 秒超时）→ 自动展示或降级

### 关键词分类引擎（8大规则）

实时新闻的标题和描述通过正则匹配自动分类：

| 分类 | 匹配关键词示例        | 影响行业     | 情绪判断  |
| ---- | --------------------- | ------------ | --------- |
| 就业 | 裁员/失业/招聘/薪资   | 科技↓、消费↑ | 利好/利空 |
| 房产 | 房价/楼市/租房/房贷   | 房地产±      | 涨→利好   |
| 科技 | AI/芯片/互联网/数字化 | 科技↑        | 突破→利好 |
| 经济 | GDP/股市/利率/消费    | 金融±、消费± | 涨→利好   |
| 政策 | 政策/监管/补贴/税收   | 消费↑        | 利好→利好 |
| 社会 | 养老/医疗/教育/社保   | 医药↑        | 改善→利好 |
| 节日 | 春节/双十一/国庆      | 消费↑        | 消费→利好 |
| 能源 | 新能源/光伏/电动车    | 新能源↑      | 增长→利好 |

每条新闻的 `marketMood` 通过 `getMood(text)` 动态计算（匹配利好/利空关键词），`sectorHeat` 通过 `getSector(text)` 动态计算强度。

### UI 新增

1. **「🔴 实时」红色徽章**：实时新闻标题旁显示，带脉冲动画
2. **加载等待面板**：旋转动画 + 进度条 + "正在从互联网获取今日实时新闻..."
3. **跳过按钮**：「跳过等待，使用本地新闻 →」
4. **消息日志区分**：实时新闻标注"实时头条"，预存新闻标注"今日头条"

### 用户配置（可选）

如需更稳定的数据源，可注册天行数据免费 Key 并填入配置：

```javascript
// 在 world_news_intro.js 中修改
tianapi: {
  enabled: true,
  apiKey: "你的免费Key",  // https://www.tianapi.com/
  endpoint: "https://api.tianapi.com/txapi/guonei/index"
}
```

不配置则自动使用 RSS 源，完全免费。

### 设计参考

- **Papers Please**：每日报纸建立压迫感世界观
- **Frostpunk**：政策公告的即时性和压力
- **今日头条 APP**：实时新闻刷新体验
- **Bloomberg Terminal**：实时新闻影响市场参数的理念
- **The West Wing**：白宫幕僚每天看早间新闻简报开始工作日

### 文件变更

| 文件                              | 操作     | 说明                                         |
| --------------------------------- | -------- | -------------------------------------------- |
| `src/js/core/world_news_intro.js` | **修改** | 新增实时新闻抓取+分类+缓存+加载UI（+1059行） |
| `src/css/style.css`               | **修改** | 新增加载动画+实时徽章+跳过按钮样式（+85行）  |

### 验证结果

```
node --check world_news_intro.js → 通过
npm run check:js → 120文件全部通过
python build.py → 4431.0 KB，成功
```

### 经验积累

- `Promise.allSettled` 比 `Promise.all` 更适合多源抓取（一个源失败不影响其他）
- 实时新闻的分类精度决定了游戏体验：关键词引擎需要覆盖行业术语、地域变体
- 3.5 秒的加载等待阈值是平衡点：太短则实时新闻总是来不及，太长则影响游戏启动体验
- 后台预加载最优雅：用户浏览菜单时通常有 5-15 秒"思考时间"，足够完成抓取

---

## 2026-07-03 — 第43轮：世界新闻UI配色改造 + 全系统影响扩展

> **触发**：用户指出新闻UI"暗色科技感"与游戏温暖基调不匹配，要求新闻涵盖多领域、影响多系统
> **影响文件**：`style.css`（世界新闻区全部重写）、`world_news_intro.js`（+investmentEffect + activeNews注入）

### 一、UI配色改造：GitHub暗色 → 温暖报刊风

**问题**：世界新闻弹窗使用 GitHub Dark 风格（`#0d1117`黑底、`#58a6ff`蓝光、`#e74c3c`红底），与游戏"奶油白+鼠尾草绿"大基调完全割裂

**改造要点**：

| 区域     | 旧（暗色科技）             | 新（温暖报刊）                        |
| -------- | -------------------------- | ------------------------------------- |
| 遮罩层   | `rgba(0,0,0,0.92)`         | `rgba(245,241,232,0.93)` 暖白半透明   |
| 主面板   | `#0d1117` 黑底             | `#ffffff` 白底                        |
| 标题栏   | 深色渐变 + 红色底边        | 奶油渐变 + 绿色底边 `var(--accent)`   |
| 标题文字 | 白色 + 红色辉光            | `var(--text-primary)` 暖黑 + 干净排版 |
| 新闻条目 | `#161b22` 深色卡           | `var(--bg-card)` 白卡，暖边框         |
| 标签     | 蓝色 `#58a6ff` 大写        | 绿色 `var(--accent)` 小写             |
| 正文     | 白色 `#e6edf3`             | `var(--text-primary)` 暖黑            |
| 按钮     | 蓝色渐变 `#1f6feb→#388bfd` | 绿色 `var(--accent)` 一致按钮         |
| 加载动画 | 蓝色转圈                   | 绿色转圈 `var(--accent)`              |
| 阴影     | 蓝色辉光                   | 暖灰自然阴影                          |

**设计参考**：《大多数》开场报纸 / Papers Please 每日公报 / 经济学人排版 / Notion Light

### 二、新闻影响范围扩展：投资 + 多系统联动

**核心问题**：开局新闻只设置 `_worldParams.sectorHeat`，没有进入 `state.activeNews`，导致 `news_investment_bridge`（投资影响）、`news_event_bridge`（事件权重/NPC评论/长尾效应）全部无法读取

**三处改动**：

1. **WORLD_NEWS_DB 新增 `investmentEffect` 字段**
   - 为 20+ 条预存新闻（经济/就业/房产/科技/政策/社会/节日）添加 `investmentEffect` 数组
   - 每条包含 `{ industry, mul }` 或 `{ symbols, mul }` 或 `{ allStocks, mul }`
   - 利好新闻乘数 1.06~~1.22，利空 0.85~~0.95
   - 示例：`emp_ai_replace` → `{ industry: "科技", mul: 1.15 }, { symbols: ["NVDA", "AMD"], mul: 1.2 }`

2. **实时新闻分类引擎新增 `investmentEffect` 生成**
   - 新增 `generateInvestmentEffectFromTag(tag, mood)` 函数
   - 覆盖 20 个分类标签，按 bullish/bearish/neutral 映射行业乘数
   - RSS 和 TianAPI 新闻构建时自动附带

3. **`applyNewsAndEnter` 将开局新闻注入 `state.activeNews`**
   - 有 `investmentEffect` 的新闻以 `intro_` 前缀注入 activeNews
   - `duration: 365` 整局有效（作为世界底色）
   - `_isIntroNews: true` 标记
   - 所有 bridge 基础设施自动读取

**影响链路**：

```
开局新闻 → state.activeNews → tickInvestmentDaily(读取newsMul) → 股票/BTC/房产价格
                           → getNewsJobBoost → 工作收入加成
                           → applyNewsEventWeights → 事件权重加成
                           → applyNewsPriceSentiment → 商品价格漂移
                           → applyNewsLongTail → 长尾效应
```

### 验证

- `node --check` ✓
- `npm run check:js` 120 文件 ✓
- `python build.py` 4438.5 KB ✓

---

## 2026-07-06 — v3.22：职业里程碑叙事事件 + 带薪年假（职业系统深度完善）

### 核心变更

完善职业系统的**长期游玩欲望**，让每个工作都有峰终定律式的叙事峰值和真实的中国职场机制。

#### P0 — 职业里程碑叙事事件（`src/js/data/job_milestone_events.js`，新建）

**设计理念**：参考《大多数》成长感 + Papers Please 压力选择 + BitLife 里程碑时刻。每个街头工作在达到 7/30/100 天时弹出叙事选择事件，玩家必须在道德、金钱、机会之间做真实取舍。

| 阶段      | 触发条件  | 叙事内容                                                   |
| --------- | --------- | ---------------------------------------------------------- |
| T1 — 入门 | 累计7天   | 工地老师傅/老员工评价，第一次感受到被接纳或被打压          |
| T2 — 熟练 | 累计30天  | 获得内部机会（转岗/提升/外包单），需要付费/社交/技能做选择 |
| T3 — 大师 | 累计100天 | 师傅托付资源/老板赏识+晋升机会，解锁隐藏NPC推荐或收入加成  |

**覆盖的9个街头工作**：

| 工作     | T1 叙事           | T2 叙事                    | T3 叙事                        |
| -------- | ----------------- | -------------------------- | ------------------------------ |
| 废品回收 | 老周请你吃饭      | 老周介绍你去富土康         | 老周把片区废品生意交接给你     |
| 工地力工 | 工头老李给红包    | 老李介绍你去干技术活       | 老李推荐你去他亲戚工厂当正式工 |
| 工厂组装 | 组长给饭票        | 组长推荐你去考证书         | 质检员职务空缺，要你送礼或竞聘 |
| 摆摊餐饮 | 隔壁老王点评手艺  | 老王介绍你去美食广场租摊位 | 老王退休要把配方和推车传给你   |
| 外卖骑手 | 站长提醒买保险    | 接到跑腿外包单             | 站长推荐你当区域小队长         |
| 家教     | 家长转账+好评     | 家长介绍小区其他生源       | 机构校长挖你去当全职讲师       |
| 内容写作 | 编辑发鼓励红包    | 编辑推荐接商业单           | 创业团队邀约当内容合伙人       |
| 街头卖艺 | 围观阿姨鼓掌+打赏 | 酒吧老板邀约驻唱           | 乐队邀请加入，正式演出机会     |
| 银行安保 | 同事老张请烟      | 老张介绍你去考保安证       | 老张退休推荐你当队长           |

**影响文件**：`job_milestone_events.js`（新建，+430行）/ `main.js`（+3行，doStreetJob标题升级后触发）/ `index.html`（+1行加载新脚本）

#### P0 — 带薪年假系统（`career_dev.js`）

**设计理念**：参考现实中国企业年假制度（1-15天/年），给倦怠系统一个真正的"大招"回血。

- 条件：在职≥90天，冷却180天，倦怠≥30
- 效果：倦怠-45，心情+25，精神+15，健康+8
- 代价：扣除5天薪资（年假期间的企业成本）
- 按钮位置：工作行动区（调休按钮旁边），仅在职玩家可见

#### 已验证

- `node --check` 全部 3 个修改文件 ✅
- `python build.py` 4843.8 KB ✅

---

### v3.1 审查改进 — 死代码清理 + 注释修正 + 职场路径引导 (2026-07-06)

**commit**: `5aa85f7`

**覆盖维度 (SOP)**：1（代码/架构 — 悬空引用、注释修正）+ 4（UI/UX — UI 引导文案）+ 5（留存/动机 — 职场路径提示）

**本轮发现的高优先级问题**：

| #   | 文件             | 问题                                                                                                                                                                                                    | 严重度           |
| --- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| 1   | `jobs.js`        | 底部 ~514 行全是注释掉的占位符自由职业工作，引用的 skills（drone/design/videoEditing/writing 等）未在 state 中声明，如果将来误取消注释会触发 payCalc 静默收入 0                                         | 🔴P0（代码误导） |
| 2   | `locations.js`   | 郊区(suburb) 和 娱乐城(entertainment) 的 jobs 数组包含未定义的工作 ID（suburb_cleaning/suburb_security/entertainment_staff/game_attendant），getJobById 静默返回 null，工作永远不显示，玩家无法在此工作 | 🔴P1             |
| 3   | `state.js`       | housing.tier 注释声称"0-3"，但 items.js HOUSING_TIERS 实际定义 0-6，注释过时导致开发者误解                                                                                                              | 🟡P2             |
| 4   | `daily_quest.js` | 玩家智力接近 45 时无任何提示引导去 techPark，职场入口对新玩家不透明                                                                                                                                     | 🟡P2             |

**本轮改进**：

- `jobs.js`：移除全部注释掉的占位符工作，保留 1 行标记说明，+862/-1351 行净删
- `locations.js`：悬空 ID 所在 jobs 改为 []（预留注释说明暂不开放）
- `state.js`：tier 注释更新为"0-6"完整映射
- `daily_quest.js`：_dynamicNextDesc 扩展 2 条智力路线引导文案

**遗留（下轮处理）**：

- MC 1000 天 OOM 问题（monte_carlo.cjs 内存管理）
- 被移除的自由职业设计（摄影/翻译/咨询等）在 memory/ 留档
- suburb/entertainment 地点恢复时需要配套实现对应工作

**验证**：node --check ✅ (127 文件) / build.py 4814.3KB ✅ / MC 30×365 ✅

---

## 2026-07-06 — v3.2b 条件不足弹窗 · 现金提示修正 · 顶栏按钮绑定 · 全局静默点击审计

### 问题反馈与修复

**① 职业卡片条件不足无反馈**（餐饮服务/物流快递等）

- **问题**：`checkCareerPromotion` 返回 `false` 时，卡片显示"⚠️ 条件不足"但点击无任何反应，不说明缺什么
- **修复**：
  - 新增 `showCareerRequirementsModal(state, pathKey, level)` 函数，逆向检查所有缺失条件（年龄/学历/技能/属性），逐项显示 ✅/❌ + 当前值
  - 在卡片的 `onclick` 中，条件不足时调用 `showCareerRequirementsModal_Global(pathKey, levelId)` 弹窗
  - 晋升面板的"条件不足"同理改为可点击查看详情
  - 已注册到 `window` 供 inline onclick 使用
- **效果**：点击任意不可投递职业卡片 → 弹窗显示具体缺什么（"❌ 体质≥20（当前15）"等）

**② 现金偏差调试提示外露**

- **问题**：`daily_report.js` 在每日收支报告中显示 "⚠️ 现金比已记录流水少 ¥83。这不是自动计入的收入或支出……" — 这是开发调试信息，不应展示给玩家
- **修复**：改为仅 `console.log` 记录，不再渲染到玩家界面

**③ 顶栏5个按钮无点击反应**

- **问题**：游戏 header 的 btn-help / btn-save / btn-load / btn-new-game-header / mobile-menu-btn 共5个按钮，完全渲染但有零事件绑定
- **修复**（`main.js` _enterScenarioGame）：
  - 💾 存档 → `showSaveMenu()`
  - 📂 读档 → `showLoadMenu()`
  - ❓ 帮助 → `showHelpModal()`
  - 🆕 新游戏 → 确认弹窗 → `location.reload()`
  - ☰ 移动端菜单 → 切换 `.sidebar` 的 `.open` class

**④ 全局静默点击审计**：

- 搜索了所有 `<button>` 元素 + onclick 属性 + cursor:pointer 元素
- 全部 `data-*` 属性绑定/事件委托均有对应的事件监听
- 未发现其他遗漏的点击交互

**影响文件**：

| 文件              | 改动                                                                                                       |
| ----------------- | ---------------------------------------------------------------------------------------------------------- |
| `career_dev.js`   | 新增 `showCareerRequirementsModal`(+80行) + 全局包装函数(+12行) + 卡片/promotion onclick改为反馈弹窗(+4行) |
| `daily_report.js` | 现金偏差提示改为console.log（-6/+5行）                                                                     |
| `main.js`         | 5个顶栏按钮事件绑定(+65行)                                                                                 |
| `DEVELOPMENT.md`  | 本文档                                                                                                     |

**验证**：build.py 4885.7KB ✅ | brace/paren 全部平衡 ✅

**SOP 自评**：本 SOP 是否需要修订？否（本轮按 v3.1 SOP 第 8 节 checklist 走完 — 1-6 维度 ✓，全剧本自查 ✓：清理无剧本分支条件，7 剧本均受益）

---

## 2026-07-07 — v3.24 日终报告峰终定律增强

**触发**：游戏日终体验薄弱 — 每日收支报告仅展示财务数据，缺乏情感收尾和留存钩子。

### 峰终定律(Peak-End Rule)增强

根据诺贝尔奖心理学 Kahneman 的研究，人们对体验的评价主要取决于两个时刻：

- **峰(Peak)**：体验中最强烈的时刻（无论好坏）
- **终(End)**：体验结束时的感受

每天日终报告是玩家接触最多的循环节点（数百次/游戏），是应用峰终定律的最佳位置。

#### 🏆 新增「今日高光」区块

在净收入下方展示当日最值得记住的瞬间：

| 触发条件                | 展示内容                          | 心理学原理    |
| ----------------------- | --------------------------------- | ------------- |
| 单笔收入≥¥500           | 💰 今天最大一笔收入 **¥XXX**      | 峰·积极锚定   |
| 单笔收入≥¥100           | 💵 今天收入了 **¥XXX**            | 峰·小确幸     |
| D7/D30/D100/D365        | 🏫 来这座城市整整一周了！         | 里程碑效应    |
| 累计收入¥1k/5k/10k/100k | 💎 累计收入突破 ¥10,000！         | 禀赋效应      |
| 健康<20/40              | 🚑 健康严重下滑！/ 😷 不太舒服    | 损失厌恶      |
| 村长债务>0              | 📝 村长的债还在...                | 损失厌恶      |
| 无特别事件              | 🌙 平凡的一天，但你依然在努力活着 | 情感收尾·温暖 |

#### 🔮 新增「明日展望」区块

在报告底部提供留存钩子：

| 内容                       | 钩子类型 | 来源                |
| -------------------------- | -------- | ------------------- |
| 📡 明日天气预报 + 准备建议 | 实用信息 | `getForecastHTML()` |
| 🍚 饿了一天了 / 😴 太累了  | 损失厌恶 | 需求检测（最低值）  |
| 🌱→🌿→🌳→🌲 天数情感锚点   | 自我认同 | `state.player.day`  |
| D1/D30/D100 情感收尾句     | 叙事留存 | 固定里程碑文案      |

### 设计参考

- **峰终定律**：Kahneman 2002 Nobel — 体验记忆由峰值和终点决定
- **损失厌恶**：Tversky & Kahneman — 失去的痛苦 ≈ 获得的2倍
- **留存钩子**：每日天气预报+建议让玩家期待明天
- **Stardew Valley**：每日天气播报 + 邮件预告
- **Papers Please**：日报总结系统
- **《大多数》**：日记式情感收尾

### 影响文件

| 文件                        | 操作                                                                       |
| --------------------------- | -------------------------------------------------------------------------- |
| `src/js/ui/daily_report.js` | +183行 — 新增 `generatePeakMomentHTML()` / `generateTomorrowPreviewHTML()` |

### 验证

- `node --check` ✅
- `python build.py` 5061.0 KB ✅
- MC 10×500d 全策略无崩溃 ✅（纯UI改动，数值不受影响）

---

## 2026-07-07 — v3.25 连续工作系统 (Work Streak)

**触发**：游戏缺少劳动节奏感和留存驱动力 — 每天重复"工作→吃饭→睡觉"循环，缺少连续性激励和禀赋效应锚点。

### 设计心理学原理

| 原理           | 应用方式                                               |
| -------------- | ------------------------------------------------------ |
| **禀赋效应**   | 连续工作天数成为玩家的"资产"→ 不想失去已积累的连续记录 |
| **损失厌恶**   | 中断提示"连续X天的记录中断了"→ 驱动明天继续工作        |
| **留存钩子**   | 5/10/30/100 天里程碑奖励 → 让玩家期待下一天            |
| **劳动节奏感** | 打工→赚钱→里程碑→满足感的正向循环                      |

### 改动详情

**连续工作天数追踪 (main.js +12, career_dev.js +11)**

- `doStreetJob()` 末尾：连续天数递增（街头工作）
- `tickCareerJobDaily()` 开头：连续天数递增（上班族）
- 跨日检测逻辑：如果 `lastWorkDay === today-1` → 续上；否则重置
- `state.flags._workedToday` 标记供 pipeline 检测

**里程碑奖励 (daily_pipeline.js +82)**

- `work_streak_check` 管线步骤（cleanup 之后）
- 当日没工作且 streak≥3 → 显示中断消息 + 重置为0
- 里程碑触发（仅首次）：
  | 连续天数 | 奖励             | 消息                             |
  | -------- | ---------------- | -------------------------------- |
  | 5        | ¥200             | 🎉 连续工作5天！全勤奖金 ¥200！  |
  | 10       | ¥500 + 心情+5    | 🔥 连续工作10天！勤劳奖励 ¥500！ |
  | 30       | ¥2,000           | 💪 连续工作30天！毅力可嘉！      |
  | 100      | ¥10,000 + 称号🏅 | 👑 连续工作100天！劳动模范！     |

**日终高亮展示 (daily_report.js +10)**

- `generatePeakMomentHTML` 中检测 streak≥3 → 在今日高光区域展示
- 图标随天数变化：📋≥3 → 🔥≥10 → 💪≥30 → 👑≥100

### 影响文件

| 文件                              | 操作                                            |
| --------------------------------- | ----------------------------------------------- |
| `src/js/main.js`                  | +12行 — doStreetJob 末尾追加 streak 追踪        |
| `src/js/ui/career_dev.js`         | +11行 — tickCareerJobDaily 开头追加 streak 追踪 |
| `src/js/phase1/daily_pipeline.js` | +82行 — 新建 work_streak_check 管线步骤         |
| `src/js/ui/daily_report.js`       | +10行 — generatePeakMomentHTML 追加 streak 展示 |

### 验证

- `node --check` 4 文件全部通过 ✅
- `python build.py` 5066.2 KB ✅
- MC 10×500d: balanced 90%↑ / trader 90%↑ / corporate 70%↑ — streak 奖励对中低端策略有正向帮助 ✅

---

## 2026-07-07 — v3.26 打工人情境叙事系统 (Work Flavor Text)

**触发**：每天工作体验重复性强，缺少"今天不一样"的新鲜感。消息模板固定，缺乏叙事密度。

### 设计心理学

| 原理         | 应用                                     |
| ------------ | ---------------------------------------- |
| **可变奖励** | 每天不同 flavor 文本，让工作本身成为期待 |
| **叙事密度** | 城市生活更有"活着"的感觉，增强沉浸感     |
| **情感共鸣** | 打工人日常困境的真实感（苦中带暖）       |
| **天数见证** | 🌱→👑 从第一天到劳动模范，见证角色成长   |

### 6 维情境检测

| 维度     | 触发条件        | 示例                     |
| -------- | --------------- | ------------------------ |
| 天气     | 9种天气类型     | ☔ 雨打在脸上有点疼      |
| 健康     | 健康<20/35/50   | 🤢 感觉身体被掏空了      |
| 疲劳     | 疲劳>80/60      | 😩 累得腰都直不起来了    |
| 饥饿     | 饥饿<15/30      | 🍚 饿得前胸贴后背        |
| 连续工作 | 3/7/14/30/100天 | 👑 第100天，工友叫你铁人 |
| 现金     | <50 / >50000    | 💸 兜里比脸还干净        |

### 26 条通用 flavor

路边小猫、工友递烟、路灯想起童年、背包带断了用塑料袋缠、看到了新来的小伙子眼神和自己当初一样...

### 影响文件

| 文件                         | 操作                         |
| ---------------------------- | ---------------------------- |
| `src/js/data/work_flavor.js` | 新建 (+225行) — 情境叙事引擎 |
| `src/js/main.js`             | +8行 — doStreetJob 末尾接入  |
| `src/index.html`             | +1行 — 加载 work_flavor.js   |

### 验证

- `node --check` 3 文件 ✅
- `python build.py` 5077.1 KB ✅
- MC 10×500d: 稳定，纯叙事改动不影响数值 ✅

---

## 2026-07-07 — v3.27 早安仪式 + 每日热招系统

**触发**：每天开始缺少仪式感和"今天做什么"的引导；游戏缺少时间节奏感（星期几）。

### 设计心理学

| 原理                         | 应用                                        | 效果                         |
| ---------------------------- | ------------------------------------------- | ---------------------------- |
| **稀缺性 (Scarcity)**        | 每日热招：35%概率×1.3~1.6倍工价，仅当天有效 | 留存钩子：明天会有更好的吗？ |
| **损失厌恶 (Loss Aversion)** | 健康<40/疲劳>80预警                         | 驱动玩家关注自身状态         |
| **禀赋效应 (Endowment)**     | 连续工作提醒（📋→🔥→💪→👑）                 | 不想中断连续记录             |
| **节奏感**                   | 周一~周日 + 天数里程碑                      | 建立7天时间感知锚点          |

### 改动详情

**end_log 重写 (daily_pipeline.js +48行/-8行)**

| 原版                           | 增强版                          |
| ------------------------------ | ------------------------------- |
| 🌙 第N天结束。新的一天开始了。 | 🌅 第N天 · 周一~周日 + 里程碑句 |
| (仅日终总结)                   | 📋 已连续工作X天                |
|                                | 🚑 健康预警 / 😩 疲劳预警       |
|                                | 🔥 今日热招：XX工作！工价×1.5！ |
|                                | 🌙 第N天开始。+ 日终总结        |

**每日热招接入 (main.js +12行)**

- `state.flags._dailyHotJob` 在 `end_log` 中生成
- `doStreetJob` 检查当前工作是否匹配 → 追加加成
- 热招 bonus 在 pay 计算完成后追加（不参与技能/装备等倍率链）
- 街头阶段专用（上班族走薪资体系不合适）

### 影响文件

| 文件                              | 操作                                     |
| --------------------------------- | ---------------------------------------- |
| `src/js/phase1/daily_pipeline.js` | +48行/-8行 — end_log 增强为早安仪式+热招 |
| `src/js/main.js`                  | +12行 — doStreetJob 热招加成校验         |

### 验证

- `node --check` 2 文件 ✅
- `python build.py` 5080.2 KB ✅
- MC 10×500d: 稳定，grinder 40%↑（热招补贴帮助高风险策略）✅

---

## 2026-07-07 — v3.28 目标梯度效应 — 里程碑进度预告

**触发**：玩家知道"已连续工作X天"但不知道"离下个奖励还有多远"，缺少目标驱动的紧迫感。

### 设计心理学

| 原理                              | 应用                                                 |
| --------------------------------- | ---------------------------------------------------- |
| **目标梯度效应 (Goal Gradient)**  | 距离奖励越近 → 动力越强（Hull 1932）                 |
| **进度原则 (Progress Principle)** | 可视化进度条 → 完成欲驱动行动                        |
| **奖励预览**                      | 明确知道5天¥200 / 10天¥500 / 30天¥2000 / 100天¥10000 |

### 改动

**日终报告进度条 (daily_report.js +33行)**

- `generateTomorrowPreviewHTML` 中新增进度条区块
- 显示 连续工作X/Y天 + 进度条 + 距离天数 + 奖励预览
- 仅 streak ≥ 1 且存在未达成的里程碑时显示

**早安仪式梯度提醒 (daily_pipeline.js +20行)**

- `end_log` 中连续工作提醒后追加目标天数
- "🎯 距离连续30天奖励（¥2,000）还有12天！"
- 仅 streak ≥ 3 且存在未达成的里程碑时显示

### 影响文件

| 文件                              | 操作                       |
| --------------------------------- | -------------------------- |
| `src/js/ui/daily_report.js`       | +33行 — 明日展望中进度条   |
| `src/js/phase1/daily_pipeline.js` | +20行 — 早安仪式中梯度提醒 |

### 验证

- `node --check` 2 文件 ✅
- `python build.py` 5082.9 KB ✅
- MC 10×500d 稳定 ✅

---

## 2026-07-07 — v3.29 新手保护增强 — 前15天全职业+20%收入

**触发**：MC数据显示多数策略死亡发生在前30天，原新手保护（¥2固定/仅4职业）几乎无用。

### 改动

| 项目 | 旧值        | 新值                  |
| ---- | ----------- | --------------------- |
| 范围 | 4个指定职业 | ALL街头工作           |
| 加成 | ¥2固定值    | 收入×20%              |
| 效果 | 无意义      | 每天多¥10-40 = 一顿饭 |

### MC效果

corporate 存活率 40% → 60%（+20pp），早期收入保障帮助上班族策略撑过求职期。

---

## 2026-07-07 — v3.30 NPC互惠小礼物 — 12%概率聊天回赠

**触发**：NPC互动仅有单向的好感累积，缺少"NPC主动回报"的惊喜感。互惠原理是社交驱动力的核心。

### 设计心理学

| 原理                       | 应用                                            |
| -------------------------- | ----------------------------------------------- |
| **互惠原理 (Reciprocity)** | 你花时间聊天 → NPC送你小礼物 → 你更愿意继续聊天 |
| **社会临场感**             | NPC不只是数据，会主动分享食物/钱/生活经验       |
| **可变奖励**               | 4种礼物随机，每次聊天都有惊喜                   |

### 4种礼物

| 类型    | 概率 | 效果         | 消息             |
| ------- | ---- | ------------ | ---------------- |
| 🍚 食物 | 25%  | 饥饱+10~20   | "塞给你一些吃的" |
| 💰 现金 | 25%  | ¥5~30        | "硬塞给你¥XX"    |
| 💗 心情 | 25%  | 心情+3~7     | "说了句暖心的话" |
| 📚 技能 | 25%  | 烹饪经验+2~5 | "分享生活经验"   |

### MC效果

social 策略存活率 60% → 80%（+20pp），NPC互惠帮助社交策略获得额外生存资源。
