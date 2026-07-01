# 2026-07-01 改进方案（第五轮 — 3个留待项可执行方案）

## 执行顺序（关键节点优先：P1-4 是 P1-3 的信号源，先做）

### P1-4: 新闻→世界参数联动（关键节点）

对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
新闻不喂世界参数 | `src/js/data/news.js` | legacy 数据 | 1) 在 `applyNewsEffect` 末尾新增处理 `effects.sectorHeat`（{行业:delta}）与 `effects.marketMood`（直接调整情绪分）的分支，写 `state._worldParams.sectorHeat`；2) 为现有 NEWS_EVENTS 中行业特征明显的 ~~10 条（metal_boom/heatwave/crackdown/factory_boom/ev类/芯片/消费等）补 `sectorHeat` 字段，幅度 ±0.04~~±0.10（与 longtail trade_war_chip -0.08 / ev_subsidy +0.12 同量级） | ~60行 | 新闻即时改变行业热度与市场情绪，世界对新闻有可见反馈，并驱动下游 cross_system 事件 | 无UI变动

### P1-3: 创业/上班族行业周期事件链

对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
行业周期事件只有正向 | `src/js/core/cross_system_events.js` | legacy 事件 | 新增"行业寒冬"事件（sectorHeat<0.85 触发：降薪/裁员/求职难三选一，影响现金与就业）与"行业红利期"创业侧反馈（sectorHeat>1.15 且玩家有公司时：营收+15%持续数天）；复用现有 IIFE 注入 RANDOM_EVENTS 与 trigger/conditions/choices 结构 | ~120行 | 行业热度信号有正负双向消费方，职业体验更真实；与 P1-4 形成闭环 | 无UI变动，复用现有事件弹窗

### P1-2: 事件日志滚动稳态优化

对应问题 | 涉及文件 | 归属层 | 改法 | 估计行数 | 预期效果 | 移动端影响
展开时新消息强制拉回底部 | `src/js/main.js` | legacy JS | 在 `renderMessageLog` 渲染前记录 `content.scrollTop + content.clientHeight >= content.scrollHeight - 24`（近底部判断）；仅当近底部或日志条数变化时才自动滚动，否则保留用户阅读位置 | ~15行 | 用户上翻阅读历史不被打断，新消息到达仅在已贴底时跟随 | 正向改善，不影响移动端布局

## 互斥性

- P1-4 改 news.js；P1-3 改 cross_system_events.js；P1-2 改 main.js。三文件互不重叠，可串行独立 commit。
- P1-3 依赖 P1-4 的信号才有意义，故 P1-4 先提交。
