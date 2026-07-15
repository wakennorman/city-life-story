# 域E 经济/投资 R27 优化记录

## 轮次信息
- **轮次**: R27
- **日期**: 2026-07-15
- **域**: E（经济/投资）
- **commit**: `eb4a6ae4`
- **push**: ⚠️ 网络不可用，本地已提交

## 指令一：A类缺陷修复（2项）

| # | 文件 | 缺陷 | 修复 |
|---|------|------|------|
| 1 | `stock.js:400` | `renderKLine` 中 `history.map(h=>h.price)` 无防御，history 含 undefined 时崩溃 | 新增 `filter` 过滤 undefined + 空数组检查 |
| 2 | `investment.js:1347` | 投资里程碑缺少 ¥1000 起步档，早期投资无成就感 | 新增 `1000` 档（🌱千元持仓），更新消息文案 |

## 指令二：联动增强（3项）

| # | 事件ID | 联动 | 设计意图 |
|---|--------|------|----------|
| 1 | `invest_drawdown_moral` | E→B（经济→叙事） | 投资亏损≥10%触发割肉/死扛/学习三岔路，损失厌恶叙事化 |
| 2 | `npc_invest_tip` | E→D（经济→社交） | 已结识NPC推荐投资机会，70%正面/30%陷阱，社交反哺经济 |
| 3 | `corp_equity_decision` | E→H（经济→公司） | corporate阶段公司给期权，行权费¥5000，绑定利益共同体 |

## 设计心理学
- **损失厌恶**: 亏损事件提供割肉/死扛/学习三种应对，模拟真实投资者心理
- **社会比较**: NPC推荐事件利用"内部消息"诱惑，测试玩家判断力
- **峰终定律**: 公司期权事件创造"被信任"的峰值体验

## 验证
- `node --check` ✅ (economy_invest_linkage_events.js / investment.js / stock.js)
- `python build.py` ✅ → 8418.3 KB
- `git commit` ✅ → `eb4a6ae4`
- `git push` ⚠️ 网络不可用

## 后续建议
- 亏损事件 70/30 胜率待 playtest 调参
- NPC推荐事件需确认 applyAffinityChange 在所有剧本可用
- 公司期权事件行权费 ¥5000 待平衡验证
