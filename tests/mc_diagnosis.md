# 城市浮生记 v3.2 — 蒙特卡洛平衡诊断报告

**日期**: 2026-07-04
**代码状态**: 未提交数值修改（饥饱衰减降低 + 新手保护期等，显著改善但仍存在系统性缺陷）
**测试配置**: 100 trials x 1000 天 x 6 策略

---

## 1. MC 运行结果摘要

| 策略         | 存活率   | Day1-7死亡 | Day31-90死亡 | 中位死亡日 | 死亡原因             | 中位现金(Day30) |
| ------------ | -------- | ---------- | ------------ | ---------- | -------------------- | --------------- |
| **balanced** | **0.0%** | 0.0%       | 69.0%        | 82.7 天    | 健康耗尽 100%        | ¥2,927 (存活者) |
| grinder      | 0.0%     | 100.0%     | 0.0%         | 6.0 天     | health_depleted 100% | (无快照)        |
| skiller      | 0.0%     | 100.0%     | 0.0%         | 5.9 天     | health_depleted 100% | (无快照)        |
| trader       | 0.0%     | 100.0%     | 0.0%         | 6.0 天     | health_depleted 100% | (无快照)        |
| social       | 0.0%     | 100.0%     | 0.0%         | 6.0 天     | health_depleted 100% | (无快照)        |
| corporate    | 0.0%     | 100.0%     | 0.0%         | 5.9 天     | health_depleted 100% | (无快照)        |

> 注：尽管经济层面数据正常（balanced 策略 Day30 中位现金 ¥2,927，Day60 ¥8,240，Day90 ¥13,086，Day180 ¥26,743），但所有玩家最终都死于健康耗尽。经济系统没问题 —— 问题在健康系统。

---

## 2. 发现的问题（按严重程度排列）

### 问题 P0：4 个策略存在"饥饱方向反转" Bug（立即致命）

**现象**: grinder、skiller、trader、social、corporate 5 个策略 100% 在前 7 天死亡（平均第 6 天），死因 health_depleted。

**根因**: 这些策略代码中的饥饱语义与游戏设计相反:

```javascript
// 游戏设计：hunger=0 表示饿，hunger=100 表示饱
// checkNeedsThresholds 中: hunger < 10 减血, hunger < 25 减血

// 但这些策略写的却是：
if (needs.hunger > 50 && cash >= 8) {
  // 错误：饥饿值高才吃饭
  needs.hunger = Math.max(0, needs.hunger - 25); // 错误：减饥饱（应该加！）
}
```

玩家起始 hunger=25，各策略检查阈值都 > 50，所以 **永远不吃饭**。饥饱衰减 -13/天 → 第 3 天降到 0 → 第 6 天 health 掉光。

**注**: balanced 策略已适用修正版 `(hunger < 45; hunger += 38)`，所以 balanced 活得远长于其他 5 个。

**建议修改**: 统一所有策略的饥饱语义 —— 饥饱 < 45 触发吃饭，hunger += foodRecover（增加值）。
**涉及文件**: `tests/monte_carlo.cjs` 的 `createGrinderPolicy/SkillerPolicy/TraderPolicy/SocialPolicy/CorporatePolicy` 函数。

---

### 问题 P1：健康恢复机制被慢性病完全抵消（中期死亡螺旋）

**现象**: balanced 策略虽然不饿死，但 100% 在 Day31-90（平均 82.7 天）健康耗尽死亡。

**根因链条**:

1. `tickHealthStatus` 的自然恢复条件 —— 仅当 `!state.status.injured && state.status.illnesses.length === 0 && health < 100` 时才 +2/天。
2. 游戏中存在低严重度慢性病（rollDailyIllness 每日掷骰），一旦感染就 `illnesses.length > 0`，自然恢复永久关闭。
3. 慢性病没有治疗路径（MC 环境中玩家无法主动治疗，玩家没有治疗行动）。
4. MC 策略每工作一次额外扣 health（自写模拟 injury 5%→-15）+ checkNeedsThresholds 的饥饿/卫生惩罚 + 事件伤害(-13每轮) = 每天净 +2（已无病）vs 净 -1（有慢性病例 +2 被关闭）。
5. 此外，`determineEmotionalState` 在 happiness<40 + fatigue>60 + hunger<40 时几乎必然进入 `depressed`（心理分数 < 15），而 depressed 仅影响工作产出和受伤率 —— 不直接扣血。但 health<30 时再触发 -20 加速。

**量化**: 追踪 seed=50 的 Trial 0 试验：健康从 Day30 的 85 持续下降到 Day82 归零，平均每 5 天掉 ~13 血（来自事件 / 工作 injury / 需求惩罚），而恢复始终为 0（存在慢性病）。

**建议修改**:

- `tickHealthStatus` 改为：即使存在慢性病，只要健康 < 50 就提供少量恢复（如 +1/天）。
- 增加 MC 策略中的"治疗"行动（如果 illnesses.length > 0 && cash > 50 → 支出 30 治病）。
- 或降低 rollDailyIllness 的慢性病让健康降到 0 的概率。
  **涉及文件**: `src/js/phase1/needs.js` (tickHealthStatus:54), `tests/monte_carlo.cjs` (balanced policy manageHealth),
  `src/js/phase1/illness.js` (rollDailyIllness:83).

---

### 问题 P2：MC 策略生活质量"无底洞"陷阱

**现象**: 从 Day60 开始，疲劳(fatigue)长期在 70-90 之间，工作循环（疲劳<65 时工作）几乎从不触发，导致 MC balanced 策略玩家在模拟中实际上"无法工作赚钱"。

**根因**:

- 住房 tier 2 的疲劳恢复在 MC 中未实现（MC 策略直接使用 `fatigue -= 28`，而不是依赖住房疲劳恢复）。
- MC balanced 策略工作赚钱计算方式为 `15 + Math.random()*20`（低估值），而住房/食物花费固定（40+38=78/day），Day 10 起玩家现金流极紧。
- 住房升级条件 `cash >= 1500 && day > 15` 触发时现金骤降至接近 0，无力覆盖后续维护费。

**建议修改**:

- MC 策略需要更精细的住房+工资循环：工资应该足够覆盖 housing + food 并仍有结余。
- 或者: 降低 housing cost 使早期升级不至于清空现金（tier 2 cost 1500→300，rent 40→15）。
  **涉及文件**: `tests/monte_carlo.cjs` work loop; `src/js/data/items.js` HOUSING_TIERS.

---

### 问题 P3：缺乏"公司阶段"转换的测试覆盖

**现象**: 即使输入智商 ≥ 45 条件 + day > 60，balanced/skiller 策略也未触发 corporate phase transition（转化率 = 0%）。

**根因**: MC 策略中使用的是 `state.player.phase = "corporate"` 强赋值，但实际需要净资产门槛或创业资金 + NPC 关系。当前 main.js 的 corporate phase 转换条件比 MC 策略假设的更复杂。

**建议修改**:

- MC skiller/corporate 策略需要模拟创业资金积累（如 cash > 50000 时才 phase = corporate），与真实游戏逻辑对齐。
  **涉及文件**: `tests/monte_carlo.cjs`; `src/js/main.js` phase transition logic.

---

### 问题 P4：快照数据与"实际可玩"脱节

**现象**: 从 Day 60 起，存活 n 迅速缩减（Day60 n=51, Day90 n=31, Day180 n=8），但"仍然在世"的玩家的中位现金仍在增长。

**根因**: 幸存者偏差 —— 只有少数天赋异禀的人能活到 Day180（他们 cash 很高），大量玩家已死亡被剔除出样本。这掩盖了"典型玩家早亡"的严重问题。

**建议修改**:

- MC 报告应该显示"全体玩家的 cash 分布"（含死亡玩家 cash=0），而非"存活玩家的 cash 分布"。
- 这样能一眼看出 Day30 有 69% 玩家 cash=0（已死），Day60 有 8% 玩家 cash=0。
  **涉及文件**: `tests/monte_carlo.cjs` analyzeResults statistical function.

---

### 问题 P5：情绪系统 → 工作产出 → 经济崩溃的联合效应

**现象**: 玩家从 Day 10 起情绪即固定在 `depressed`（心情 < 40 + 疲劳 > 60 + 饥饿波动），`getEmotionWorkModifier(depressed).pay = 0.45`（工资打 4.5 折）。

**根因**:

- MC 策略很少回复心情（仅当 happiness < 30，一次性 +20），但疲劳很快推回 60 以下、饥饿波动导致心情再次下降。
- 进入 depressed 后工资打 4.5 折 → 更少现金 → 吃饭/洗澡更困难 → 心情更低，形成循环。

**建议修改**:

- 策略应优先确保 happiness 稳定在 50+（不触发 depression）。
- 或降低 depressed 的工资折扣幅度（pay: 0.45 → 0.65）。
  **涉及文件**: `tests/monte_carlo.cjs` policy happiness management; `src/js/phase1/needs.js` getEmotionWorkModifier:122.

---

### 问题 P6：随机事件伤害缺乏恢复缓冲

**现象**: 健康日志显示每隔 ~5 天出现一次 ΔH=-13（事件负面效果），没有恢复缓冲。

**根因**: random events 的负面效果（如事故、冲突等 -13 health 事件）没有对应恢复缓冲。在一个慢性病锁死健康恢复的系统里，这些事件伤害不可逆。

**建议修改**:

- 引入 event_cooldown：事件负面效果后 30 天内不再触发同类事件。
- 或对 low-health 玩家提供 event 免疫（health < 30 时跳过高伤害随机事件）。
  **涉及文件**: `src/js/core/events.js` event queue; `src/js/core/events_street_*.js` event pool.

---

## 3. 建议的数值调整（待下一轮 MC 验证）

| 参数                  | 当前值                    | 建议新值              | 理由                 |
| --------------------- | ------------------------- | --------------------- | -------------------- |
| 策略吃饭触发阈值      | hunger > 50               | hunger < 45           | 反转语义 Bug         |
| 策略吃饭效果          | hunger -= 25              | hunger += 38          | 反转语义 Bug         |
| 自然恢复条件          | illnesses.length==0 才 +2 | 始终 +1（或使用衰减） | 慢性病锁死恢复       |
| housing tier 2 rent   | ¥40/天                    | ¥20/天                | 中期维护费过重       |
| housing tier 3 rent   | ¥200/天                   | ¥80/天                | 同上                 |
| depressed 工资折扣    | 0.45                      | 0.6                   | 减少焦虑螺旋         |
| MC 工作收入           | 15+random*20              | 30+random*30          | 低级工作仍需足够生存 |
| rollDailyIllness 概率 | 原值                      | ×0.5                  | 慢性病感染率过高     |
| 事件负面伤害          | -13                       | -5~8                  | 惩罚过重无法恢复     |
| 新手保护期            | day ≤ 30                  | day ≤ 45              | 新手阶段死亡事件太多 |

---

## 4. 高风险结构性问题

**健康系统的"吸收态"**: 一旦 health < 30 且存在慢性病 → 永久无法恢复 + 情绪 depressed → 效率降低 → 更少收入 → 更少食物 → 更多饥饿惩罚 → 健康持续下降 → 必然死亡。**这是一个无逃脱的吸收态** —— 真实玩家也会一旦被卡住就绝对死亡。

**修复优先级**:

1. **立即修复** P0（策略逻辑反转 bug，4 行代码 → 先让 5 个策略活下来）。
2. **高优修复** P1（健康恢复底线，tickHealthStatus 改 1 行）。
3. **中优修复** P2/P5（经济螺旋，修改策略花费优先级）。
4. **低优修复** P6（事件冷却，需要修改事件系统）。

---

## 5. 结论与下一步

本轮 MC 验证暴露的核心问题是 **健康系统不可逆 + 策略吃饭语义反转**，而非经济数值问题。经济系统在新的 housing_maintenance 数值下运转正常（中位现金稳步增长），但在健康吸收态面前毫无意义。

**建议的实装顺序**:

1. **紧急**: 修复 5 个 MC 策略的饥饱语义（monte_carlo.cjs）。
2. **紧急**: `tickHealthStatus` 添加 low-health 恢复底线。
3. **验证**: 重新跑 MC，确认 balanced 策略存活率回升到 >90%。
4. **调参**: 根据新版 MC 结果微调 housing rent / illness 概率。
5. **扩展**: 增加 MC 策略的"治疗"和"工作循环"逻辑。
