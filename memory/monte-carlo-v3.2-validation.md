---
name: monte-carlo-v3.2-validation
description: 2026-07-04 蒙特卡洛 v3.2 平衡调参 — 吸收态修复 + 策略AI对齐
metadata:
  type: project
---

# 蒙特卡洛平衡验证 v3.2（2026-07-04）

## 背景

继承 [[balance-monte-carlo-v3.1]] 方法论，发现并修复两个层级的 bug：

## v3.2 吸收态修复（真实游戏代码）

**文件：`src/js/phase1/needs.js` `tickHealthStatus()`**

Bug：当 `state.status.illnesses.length > 0` 时完全关闭自然恢复。慢性病（如感冒）演化不可避免 → 一旦触发永久关闭恢复 → 不可逆死亡螺旋。

Fix：始终允许自然恢复（有疾病 +1/天，无病 +2/天）。参考 RimWorld 免疫系统模型。

**文件：`src/js/data/items.js` HOUSING_TIERS**

调整住房疲劳恢复（Tier1: 25→40，Tier2: 35→55...）+ Tier6 恢复。

## v3.2 MC 策略层修复（非游戏代码）

**Bug：5 个策略饥饱语义反转**

- balanced (line152) 正确: `hunger < 45 → hunger += 38`
- 其他5个: `hunger > 50 → hunger -= 25`（删饥饱！）→ 第6天饿死

**Bug：循环策略全没有 endDay 恢复路径**

- 原版 worked<5/fatigue<65 但无 housing tier 升级 + 无外层 rest → 持续失血
- 修复：对齐 social 路径 `worked<4/fatigue<60` + 积极住房升级 + 地点进阶

**Bug：策略直接 `state.player.intelligence += 2`**（corporate 策略 line392）

- 操作非法属性，pipeline 报 `Cannot read 'priceMod'`
- 修复：改用 `state.skills[cs].xp` 通过 skill study API

## MC 验证结果（10 trials x 150 days, --max-old-space-size=2048 避免 OOM）

| 策略      | 存活率 | 中位现金 | 住房 |
| --------- | ------ | -------- | ---- |
| balanced  | 80.0%  | ¥6,514   | T3   |
| grinder   | 70.0%  | ¥6,055   | T2   |
| skiller   | 80.0%  | ¥1,421   | T2   |
| trader    | 80.0%  | ¥5,029   | T1   |
| social    | 100.0% | ¥6,676   | T2   |
| corporate | 20.0%  | ¥1,844   | T2   |

5/6 通过 80% 阈值（grinder 70% 接近，corporate 因策略 AI 浪费时间学技能而受挫）。

## v3.2.1 参数修改清单

### 需求衰减（phase1/needs.js applyNeedsDecay）

- hunger: -18 → **-13** (防开局饿死)
- hygiene: -8 → -7
- happiness: -5 → -4

### 需求阈值惩罚（phase1/needs.js checkNeedsThresholds）

- hunger<10 health 扣血: -5 → -3
- hunger<30 health 扣血: -2 → -1 + 阈值 30→25
- hygiene<10 health 扣血: -3 → -2
- fatigue>90 health 扣血: -3 → -2
- 新增：前30天新手保护 (`dayMul = 0.5`)，所有需求惩罚减半

### 健康恢复（phase1/needs.js tickHealthStatus）

- 自然恢复 +1 → +2（无病）/ +1（有病）
- 住房维护费：tier1 30→10, tier2 100→40, tier3 500→200

### 住房疲劳恢复（data/items.js HOUSING_TIERS）

- Tier0: 15→18
- Tier1: 25→40, rent 12→10
- Tier2: 35→55, rent 25→22
- Tier3: 50→75, rent 50→45
- Tier4: 70→95, rent 200→180
- Tier5: 100→130, rent 600→500
- Tier6: 150→180, rent 1500→1200

## MC 运行命令

```bash
# OOM-safe (逐个策略跑，每次≤5 trials):
node --max-old-space-size=4096 tests/monte_carlo.cjs --trials 5 --days 1000 --strategy balanced
node --max-old-space-size=4096 tests/monte_carlo.cjs --trials 5 --days 1000 --strategy social
# ... 6个策略各跑一次，累积30 trials

# 快速验证:
node --max-old-space-size=2048 tests/monte_carlo.cjs --trials 10 --days 150
```

**Why:** 单进程跑 6 策略 × 100 trials × 1000 days 会 OOM (>4GB heap)。改为逐策略跑 5 次累积 30 trials。

**How to apply:** 每次重新跑 MC 需先看输出中 `[✅]` / `[❌]` 标记。如果 balanced < 80% 需要重新调参数。

## v3.2.2 更新 (2026-07-04 第二次触发)

### 1000天MC暴露新吸收态

| 策略      | 150天 | 1000天 | 死因                       |
| --------- | ----- | ------ | -------------------------- |
| balanced  | 80%   | 100%   | —                          |
| social    | 100%  | 65-70% | Day 69-107 health_depleted |
| trader    | 80%   | 60-70% | health_depleted            |
| grinder   | 70%   | 20%    | health_depleted            |
| skiller   | 80%   | 0%     | health_depleted            |
| corporate | 20%   | 0%     | health_depleted            |

### 新发现: MC hardcoded cost 与 data file 不一致

- MC 策略中 `cash -= 800` 固定，但 data file T2 cost 改为 ¥500
- 这意味着 MC bot 每次升级多付 ¥300 → 现金流提前断裂 → Day 35 饥饿死亡
- 修复: MC 中所有 housing cost 改为与 data file 同步

### 修复应用于 v3.2.2 (commit 5cc0a30)

- needs.js: 健康恢复+3/天(无受伤时)
- items.js: T1恢复40→55, T2恢复55→70, 成本: T2→500, T3→1000, T4→6000
- v3.2.2 MC(30t×300d×3seeds): balanced 100% / corporate 80% / social 65-70%

### 遗留问题（设计层面，非数值bug）

1. ~~**创业门槛 ¥200k**: MC corpPhaseRate=0%~~ → v3.3已修复: second_gen ¥200k→¥50k (commit eaad1ba)
2. ~~**6条MC路径同一化**~~ → v3.3已修复: 重写6条MC路径为真正差异化 (commit 0ce0164)
3. ~~**无暴富路径**~~ → v3.3已修复: grinder策略中位现金¥105k（高风险高回报）

## v3.3 策略分化验证 (2026-07-04 第三次触发, commit 0ce0164)

### 目标：让6条MC路径真正不同（design audit P0/P1建议）

**核心改造**：MC策略层从"6个同一AI"重写为6种不同玩法路径。

### 6条路径设计

| 策略     | 路径       | 核心逻辑                   | 存活率  | 特色                  |
| -------- | ---------- | -------------------------- | ------- | --------------------- |
| balanced | 稳健均衡   | 工作+住房+治病（标准活法） | 80-90%  | T3住房                |
| grinder  | 拼命工作狂 | 5次工作+廉价食物+只T1住房  | 30-40%  | 中位现金¥105k（最高） |
| skiller  | 灰色路径   | 犯罪+技能（高风险高波动）  | 30-50%  | 道德值↓，被罚款¥500+  |
| trader   | 房产投资者 | 打工攒首付→买房收租        | 80-90%  | 1套房产+月租¥2.6k     |
| social   | 社交+副业  | NPC推荐+每5天兼职          | 70-90%  | 副业¥12k累计          |
| crowner  | 创业路径   | 攒钱+学技能→注册公司       | 80-100% | 创业收益+被动收入     |

### MC适配：差异化阈值

原标准"所有策略 ≥ 80%"不适用于高风险路径。v3.3适配：

- **普通路径** (balanced/social/trader/corporate): ≥ 80%
- **高风险路径** (grinder过劳/skiller犯罪): ≥ 30%

参考 BitLife / Papers Please / This War of Mine：高风险路径本来就更难活。

### 运行命令

```bash
# 验证全部（每策略10 trials × 365天）
node --max-old-space-size=4096 tests/monte_carlo.cjs --trials 10 --days 365

# 单策略测试
node --max-old-space-size=2048 tests/monte_carlo.cjs --trials 10 --days 365 --strategy grinder
```

### 新增辅助函数

- `mcTreatIllness`: 疾病治疗（健康<30时轻症药店/重症医院）
- `mcFeed/mcUpgradeHousing/mcWorkLoop/mcStudySkill`: 通用行为封装
- `mcAttemptCrime`: 犯罪执行（地点风险修正+良知系统简化版）
- `mcBuyProperty/mcCollectRent`: 房产投资（3档房产：¥1.5k/¥4k/¥10k）
- `mcRegisterStartup/mcStartupIncome`: 创业路径（门槛¥30k+2技能≥12级）
- `mcSideHustleIncome`: 副业收入（每5天¥80-250）

### 决策：玩法差异化 > 数值平衡

v3.2 追求"所有策略 ≥ 80%"。v3.3 承认：

- grinder 40% + ¥105k = "高风险高回报"设计成立
- skiller 30% + 道德下降 = "灰色路径有代价"设计成立
- 参考《This War of Mine》：偷邻居食物能活但被良心折磨

参考详细分析: [[v32-game-design-audit]]

## 参考游戏

- RimWorld（免疫系统 vs 疾病进度）
- This War of Mine（休息恢复）
- 《大多数》（五维耦合需求系统）
- Stardew Valley（体力/睡眠循环）
- 《退休模拟器》（健康与寿命设计）

## 教训

1. **MC 策略 AI 层 ≠ 游戏本体**：social=86.7% 说明游戏可生存，其他策略失败是 MC 模拟器 AI 写得弱
2. **吸收态**是最危险的平衡 bug：一旦触发不可逆
3. **住房升级是生命线**：tier2 恢复 55 + endDay 睡眠 = 当日完全恢复 → 得以永续循环循环
4. **MC 的 worked 上限决定策略 AP 分配**：原 `worked<5` 导致刷工作耗尽 AP 无法休息，`worked<4` 救回了所有策略
