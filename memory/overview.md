# 2026-07-01 现状摸底（第五轮 — 聚焦3个留待项）

## 断点续传定位

- 第四轮（2026-06-27）已全部 ✅：TS事件bridge全量同步 11→19、城市服务灰显/医疗双入口/地点中文化均已落地。
- 本轮用户明确给出 3 个留待项（均为 P1 延续性改善）：
  1. 事件日志滚动优化
  2. 创业/上班族内容深化（事件链扩张）
  3. 世界观自洽性增强（新闻→世界参数联动）

## 双轨架构现状（无变化，仅确认）

- legacy 侧：`src/index.html` ~80+ script 顺序加载；`python build.py` → `dist/`
- TS 侧：`src/app/data/*` typed catalog（events 19 / jobs 12 / locations 14 / items 17 / diseases 12 / legal 7 / travel 8 / lifeNodes 4 / cityServices 7）；`npm run build` → `dist-webapp/`
- bridge：`src/js/app_bridge/webapp_runtime_bridge.js` 末尾注入城市服务，`_webApp.schemaVersion=2`

## 三项留待的源码实况核查

### 1. 事件日志滚动（main.js:4055）

- `scrollMessageLogToBottom(content, smooth)` 已存在：rAF + setTimeout(80ms) 二次滚动 + scrollTo smooth 兜底。
- `renderMessageLog` 每次重渲 innerHTML 后，仅在展开状态滚动到底。
- **缺口**：无"近底部"判断——用户在展开状态上翻阅读历史时，每条新消息会强制把视图拉回底部，打断阅读。这是真正的延续性痛点。

### 2. 创业/上班族内容（已有量很大）

- `startup_events.js` 40KB、`startup_crisis.js` 19KB、`workplace_social.js` 23KB、`events_corp.js` 96KB、`crisis35_followups.js` 18KB、`cross_system_events.js` 50KB。
- `cross_system_events.js` 已有"行业热度联动事件"（sectorHeat>1.2 触发人才缺口推送）与"公司裁员风波"。
- **缺口**：行业周期事件覆盖不全——只有高温正向事件，缺少"行业寒冬"（sectorHeat<0.85）负向链；创业侧缺少行业周期对营收的直接反馈。

### 3. 世界观自洽性（关键瓶颈在此）

- `world_params.js`（670行）系统完整：`tickWorldParams` → applyWealthFeedback / applySectorFeedback / applyMarketFeedback / decayWorldParams / updateMarketMood。WORLD_SECTORS = ["科技","消费","金融","房地产","医药","新能源"]。
- **`applyNewsEffect`（news.js:1626）处理 priceMod/jobBonus/jobPenalty/cashBonus/needs/skillXp/investmentEffect/followUp，但不写 `_worldParams`。** grep 全文件 0 处 sectorHeat/marketMood 引用。
- 仅有 `news_event_bridge.js` 的 `NEWS_LONGTAIL_EFFECTS`（7条：min_wage/rate_cut/rate_hike/property_tax_pilot/trade_war_chip/ev_subsidy/crackdown）写世界参数，覆盖面窄。
- **后果**：`cross_system_events.js` 的行业热度事件几乎只能靠 `applySectorFeedback` 的随机日漂移触发，新闻不喂热度 → 世界不"活" → 自洽性断裂。

## 初步判断

- 三项留待中，**P1-4 新闻→世界参数联动是关键节点**：打通后既补齐世界观自洽性，又让 P1-3 的新增行业周期事件有信号可消费，两项互相强化。
- P1-2 滚动只需小改（加近底部判断）。
- 不存在新的 P0 问题，本轮纯 P1 打磨。
