# 2026-07-01 问题诊断（第五轮 — 聚焦3个留待项）

## 上轮 P1 已落地确认

- ✅ TS事件bridge全量同步 11→19（commit f7d36c5）
- ✅ memory 三件套对齐
- 城市服务占位反馈、Monte Carlo 自动化仍为 P2，本轮不动。

## 本轮 3 项留待的精确诊断

新闻不喂世界参数 → 世界自洽性断裂 | 世界参数系统 | P1 | applyNewsEffect(news.js:1626) 处理 priceMod/job/investmentEffect 等但不写 _worldParams；仅 NEWS_LONGTAIL_EFFECTS 7条长尾写 sectorHeat，覆盖面窄；导致 cross_system_events.js 的行业热度事件只能靠随机漂移触发，新闻与世界脱节
行业周期事件只有正向无负向 | 事件系统/内容 | P1 | cross_system_events.js 仅有 sectorHeat>1.2 的人才缺口推送，缺少 sectorHeat<0.85 的"行业寒冬"链；创业侧无行业周期对营收的直接反馈，行业热度信号消费方不足
事件日志展开时新消息强制拉回底部 | UI/体验 | P1 | renderMessageLog 每次重渲后无条件 scrollMessageLogToBottom，用户上翻阅读历史时被每条新消息打断；缺少"近底部才自动滚动"判断

## 非留待项的轻量观察（本轮不实装，仅记录）

- startup.js 488KB 超大文件拆分仍欠（P1，跨轮大工程，不在本轮范围）
- 装备品质系统未激活（P2，跨轮）
