---
name: property-market-v2-fluctuation
description: 房产市场波动系统 v2 — 替代固定增值，引入市场周期、政策趋紧度、行业热度联动
metadata:
  type: project
---

# 房产市场 v2 — 波动系统改造

## 改动内容

房产价格不再固定增值，改为受**市场周期阶段 + 行业热度 + 政策趋紧度 + 新闻 + 随机噪声**驱动的真实波动系统。

### 核心机制

- **4 个市场阶段**：火爆(boom)、平稳(stable)、降温(cooling)、萧条(bust)
- **阶段转换**：每阶段持续 10-60 天，通过 sectorHeat 阈值/新闻/随机概率转换
- **政策趋紧度** `_propertyPolicyTightness`：-1~+1，受利空/利好新闻推动，每日 2% 向 0 衰减
- **每套房产价格公式**：
  ```
  日变化率 = cycleDrift + sectorDrift × zoneWeight + policyDrift + baseAppreciation + noise
  新价格 = 当前价格 × (1 + 日变化率) × newsMul
  ```
- **海外房产** `zoneWeight.sectorHeat=0.2`，基本不受中国房地产周期影响

### 联动的系统

- **新闻系统**：7 条新房地产新闻 + 原有 `property_cooling/stimulus` 补上 `industry: "房地产"` 标签
- **世界参数**：`sectorHeat["房地产"]` 初始范围扩大到 0.70~1.30（波动更大）
- **政策反馈**：新闻→政策趋紧度自动反馈（`news_investment_bridge.js`）

### 涉及文件

- `src/js/core/state.js` — 新增 `propertyMarketPhase/phaseStartDay/phaseDuration/_propertyPolicyTightness/_propertySystemV2`
- `src/js/phase2/property_market.js` — **新建**：市场引擎
- `src/js/phase2/investment.js` — PROPERTIES 重构 + tick 替换 + buyProperty 增强 + UI 横幅
- `src/js/data/news.js` — 7 条新房地产新闻 + 现有新闻补标签
- `src/js/core/news_investment_bridge.js` — 新闻→政策趋紧度反馈
- `src/js/core/world_params.js` — 房地产行业初始范围扩大
- `src/index.html` — 注册 `property_market.js`

**Why:** 房产固定增值不真实，中国近几年房地产多样性说明价格会随市场、政策、新闻波动。

**How to apply:**

- 新游戏/加载旧存档自动初始化（`initPropertyMarket` 在 `initInvestment` 末尾触发）
- 旧存档已持有房产保留 `currentPrice`，补上 v2 字段后开始波动
- 市场阶段转换时展示消息通知
