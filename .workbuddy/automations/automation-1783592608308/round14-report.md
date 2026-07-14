# Round 14 · 域A（数据/数值平衡）执行报告

> 时间：2026-07-14 · 分支 loop/auto · 8域轮换第5轮（本循环首轮覆盖A）
> 提交：`c00d48f0`（被并行窗口 `git add -A` 一并提交，含本轮回合A改动）

## 一、A类缺陷修复（2项，均必现平衡性bug）

### A1 · economy_v3.1.js 难度键名与 state._difficulty 不匹配

- **根因**：`DIFFICULTY_TAX_MULTIPLIER` / `DIFFICULTY_INCOME_CURVE` / `getMarketSaturationPenalty` 用键 `casual`，但 `difficulty_system.js` 写入 `state._difficulty` 的真实取值为 `easy/normal/hard/hell`。`casual` 为孤儿键 → 休闲(easy)档税率乘数恒回落 `1.0`、收益曲线恒用 normal；且 `hell` 档无任何专属经济调节。
- **修复**：`casual`→`easy`，并补 `hell`（税率乘数 1.6 / 收益曲线更陡 / 市场饱和阈值 0.1）。与难度系统四档对齐。

### A2 · jobs.js 工资公式读取错误字段

- **根因**：`premium_housekeeper` 的 `payCalc` 读 `state.player.hygiene`，但清洁度真实路径为 `state.needs.hygiene` → 该加成恒为 `undefined`→`||0` → 永远 0。
- **修复**：`state.player.hygiene`→`state.needs.hygiene`。

## 二、联动增强（3项，新建 data_linkage_events.js，IIFE 注入 RANDOM_EVENTS）

| 事件 id                  | 源→目标     | 机制                                                   |
| ------------------------ | ----------- | ------------------------------------------------------ |
| `data_balanced_living`   | A→D（社交） | 核心状态(健康/清洁/心情/心态)均达均衡线 → 挚友好感+5   |
| `data_skill_efficiency`  | A→C（职业） | 任一技能≥30 → 职场声誉 upward+5                        |
| `data_savings_milestone` | A→E（经济） | 净资产≥¥20万里程碑 → 释放¥3万可投资资金 + 投资心态flag |

- 引擎严格按 `e.phase` 过滤（仅 `street`/`corporate` 二选一），故 2 street + 1 corporate 以覆盖两种人生阶段。
- 全部 `||` 防御；数值标 `[PLACEHOLDER]` 待数值组校准；里程碑用 `flags._xxxDone` 去重。

## 三、验证

- `node --check` 3 文件：通过
- `python build.py` → dist 8225.6 KB
- Monte Carlo 6×400d：**0 代码异常**
  - trader 50% / corporate 66.7% 存活率 <80% 为既有平衡阈值（非本轮引入）；A1 仅影响 easy/hell 档，默认 normal 的 MC 未触达，无回归。

## 四、状态

- `loop-domain-state.json` = round 14 / domain A / nextDomain **C**（C→E→G→H→A 单轮覆盖完成，下轮重启于C）
- `DEVELOPMENT.md` = v3.106
- 下轮 → **域C（职业/成长）**
