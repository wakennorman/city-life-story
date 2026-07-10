# 蒙特卡洛模拟系统指南

## 概述

城市浮生记拥有一个完整的蒙特卡洛模拟系统，用于验证游戏经济平衡、测试不同玩法的长期收益，并指导游戏平衡调参。

## 快速开始

```bash
# 运行全部6种策略（默认100次×1000天）
node tests/monte_carlo.cjs

# 快速测试（3次）
node tests/monte_carlo.cjs --trials 3

# 只跑一种策略
node tests/monte_carlo.cjs --strategy skiller

# 自定义天数
node tests/monte_carlo.cjs --days 500

# 输出到文件
node tests/monte_carlo.cjs --output report.json

# 详细输出
node tests/monte_carlo.cjs --verbose
```

## 系统架构

```
tests/
├── headless_runner.cjs    ← 无头游戏引擎（加载115+脚本，提供模拟API）
├── monte_carlo.cjs        ← 蒙特卡洛测试工具（CLI + 6策略）
└── mc_report.json         ← 原始模拟数据（可选输出）
```

## 6种策略

| 策略      | 函数                      | 模拟路线                            | 预期收入   |
| --------- | ------------------------- | ----------------------------------- | ---------- |
| grinder   | `createGrinderPolicy()`   | slum→factoryZone，纯体力            | ¥4,000     |
| balanced  | `createBalancedPolicy()`  | slum→commercialDist→techPark        | ¥6,000     |
| skiller   | `createSkillerPolicy()`   | slum→school→trainingCenter→techPark | ¥25,000    |
| trader    | `createTraderPolicy()`    | slum→wholesaleMarket→commercialDist | ¥70,000    |
| social    | `createSocialPolicy()`    | NPC关系解锁推荐工作                 | ¥45,000    |
| corporate | `createCorporatePolicy()` | 企业晋升P5→P10                      | ¥1,550,000 |

## 关键发现

### 1. NPC推荐工作溢价204%

NPC推荐的工作收入比普通工作高168-204%，是游戏中最被低估的经济策略。

### 2. 企业阶段是终极目标

进入企业阶段后收入提升383倍（P5→P10），是所有策略的终极目标。

### 3. 疲劳门控是生存关键

每天工作超过3-4次且不休息会导致疲劳积累→健康下降→死亡。所有策略使用`fatigue<60`门控确保生存。

### 4. 胜利条件原本不可达

MC发现原版胜利条件（经商¥500k/投资¥10M/财务自由¥20M）在1000天内全部不可达，已降低至合理范围。

## 游戏代码变动

所有MC发现已落地到游戏代码：

| MC发现             | 游戏代码                                | 轮次  |
| ------------------ | --------------------------------------- | ----- |
| 工作风险过高       | `jobs.js` 降低风险值                    | 3     |
| 住房升级无提示     | `daily_pipeline.js` 新增提示            | 2     |
| 企业仅智力门槛     | `main.js` 新增经验路径                  | 5     |
| 自学不涨智力       | `main.js` 新增10%概率+1                 | 11    |
| 套利利润不显       | `tutorial.js` 新增套利提示              | 9     |
| NPC关系价值        | `tutorial.js` + `wiki.js` 更新提示      | 15/27 |
| 胜利条件不可达     | `victory.js` 降低门槛                   | 20    |
| 证书效果未生效     | `career_dev.js` 修复calcActualSalary    | 23    |
| 职场社交函数未注册 | `workplace_social.js` + `career_dev.js` | 24/25 |
| Wiki注册费口径     | `wiki.js` 修正                          | 24    |
| NPC×交易联动       | `pricing.js` 新增人脉溢价               | 21    |

## 添加新策略

1. 在 `monte_carlo.cjs` 中编写 `createYourStrategy()` 函数
2. 在 `runStrategy` 的 `policies` 对象中注册
3. 在 `main()` 的 `strategies` 数组中添加
4. 运行测试

策略函数接收 `state` 参数，可直接修改状态。使用 `findJobAtLocation(state, loc)` 找工作和 `applyJobPay(state, job)` 执行工作。

## 技术细节

- **Random.js**: 种子化PRNG（LCG算法），`setSeed(seed)` 确保可复现
- **headless_runner**: 临时清空 `module` 变量模拟浏览器环境，避免 `module.exports` 干扰
- **StateManager**: 模拟中直接修改状态对象，绕过 `StateManager.getState()` 的初始化检查
