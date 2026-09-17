# 全系统优化 Round 172 — 域 B / 事件·叙事(第九轮)

> 日期: 2026-07-23 | 提交: 2cac8c51 + fad3d220 | 已推 ✅

## 选域逻辑
B 域自 R164 后未再主审（与 A 并列最薄弱），本轮优先处理。

## 1. 修复清单（A 类，2项）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/core/events_street_life.js` | `Math.random()` 使用（应统一为 `Random.fromArray`） | 改为 `Random.fromArray(...)` | A |
| `src/js/core/skill_synergy.js` | `Math.random()` 使用（应统一为 `Random.fromArray`） | 改为 `Random.fromArray(...)` | A |

## 2. 增强清单（联动，4项）

| 新增 | 文件 | 联动域 | 设计意图 |
|---|---|---|---|
| `skill_breakthrough_narrative` | `domain_b_linkage_r172.js` | B→C | 技能达Lv.70触发突破叙事，奖励XP+心智，让成长有仪式感 |
| `market_volatility_invest_awakening` | `domain_b_linkage_r172.js` | B→E | 市场波动≥2次触发投资觉醒，奖励智力+会计XP |
| 极端天气事件权重×2.5 | `domain_b_linkage_r172.js` | B→G | 天气子系统首次被B域事件权重化，增强天气存在感 |
| 供需状态标签 | `domain_b_linkage_r172.js` | B→A | 市场供需数据首次被事件消费，闭合经济→叙事因果链 |

## 3. 格式修复（P0）

新建数据文件 `corporate_npc_events.js`/`corporate_team_events.js`/`performance_legacy_events.js` 使用不兼容事件格式（`getText()`/`getStory()` + 单一 `evt.apply(st, choiceId)`），引擎实际读取 `evt.story` + `choice.apply`。全部重写为标准格式（`story` 字符串 + 每个 choice 自带 `apply` 函数），并补充冷却 flag 防止每日重触发。

## 4. 验证
- `node --check` 全部新文件 ✅
- `python build.py` ✅ (8792.5 KB)
- 构建产物已提交

## 5. 提交
- `2cac8c51` feat: [域B] R172 A类修复(2项Math.random→Random)+联动增强(2项)
- `fad3d220` feat: [域B] R172 联动补提交(2项) — B→C技能突破+B→E市场波动
