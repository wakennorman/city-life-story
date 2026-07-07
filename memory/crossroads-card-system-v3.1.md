# 命运抉择卡系统（v3.1 新机制）

> 游戏设计师提案的"周期性高 stakes 选择"机制，打破日常 grind 单调性（峰终定律 / 损失厌恶），并提供对"健康死亡计时器"的反制抓手。

## 文件与接入
- `src/js/phase2/life_crossroads.js`（IIFE，~330 行）— 暴露 `window.crossroadsTick` / `resolveCrossroads` / `drawCrossroadsCard` / `decideCrossroads` / `CROSSROADS_DECK`
- `daily_pipeline.js` 在 `day_increment` 之后、`stall_income` 之前插入 `crossroads_tick` 步骤
- `index.html` 注册于 `startup.js` 之后
- `tests/headless_runner.cjs` manifest 追加 `js/phase2/life_crossroads.js`（否则 MC 不加载）
- `tests/monte_carlo.cjs`：`CROSSROADS_BIAS` 映射（safe=balanced/social，bold=grinder/skiller/trader/corporate）；trial 循环在 `runDailyPipeline` 之前结算 pending 卡

## 卡牌（6 张，每张 bold/safe 两选项）
| 卡 | bold 选项 | safe 选项 |
| --- | --- | --- |
| startup | All-in 创业：R.int(-2500,9000)，健康-3 | 婉拒：+¥200 |
| health_alarm | 硬撑加班：+¥400，健康-6 | 回乡养病：-¥500，健康+20，疲劳-25 |
| promotion | 内卷抢功：+¥900，健康-4，疲劳+10 | 躺平：健康+12，幸福+10 |
| wedding | 借口不去：幸福-3 | 随份子：-¥400，社交资本+1 |
| sidegig | 接副业：+¥50~250，健康-2，疲劳+15 | 早睡：健康+3，疲劳-12 |
| hometown | 留城继续卷：+¥1500，健康-5 | 返乡分红：+¥3000，健康+8，幸福+15 |

- `crossroadsTick`：每 30 天抽一张；卡牌 2 天未抉择按 safe 自动兜底
- 数值变动经 `applyDelta` 统一落地（记账 + 钳制），便于 MC 对账

## 蒙特卡洛平衡验证（1000天 × 25 trials × 6 策略，真实引擎）
- safe（balanced/social）：68% / 72% 存活，中位现金 ¥4,360 / ¥140,752，平均健康 88.8 / 77.8
- bold 依赖生活方式：
  - trader（健康 lifestyle + bold）：56% 存活，¥5,290，健康 75.9
  - corporate（bold）：24% 存活，¥4,139，健康 64.5
  - grinder（鲁莽 + bold）：12% 存活，幸存者中位 ¥223,183，健康 71.0
  - skiller（bold）：12% 存活，¥1,159，健康 89.3
- 所有死亡均为 `health_depleted`
- 结论：风险/回报轴清晰且依赖生活方式；bold 是"生活方式乘数"而非开关

## 实现注意
- 结算顺序：trial 循环先 `if(state._pendingCrossroads && resolveCrossroads)` 再 `runDailyPipeline`（后者抽新卡）；`resolveCrossroads` 会置空 `_pendingCrossroads`，日志须在置空前捕获 `pendId`
- 调试误报坑：`resolveCrossroads` 内部已 `state._pendingCrossroads=null`，原成功日志在其后读 `.id` → 误报 `[XERR] "Cannot read properties of null"`
- 引擎 policy 用未播种 `Math.random`，验证需 ≥25 trials 才稳
