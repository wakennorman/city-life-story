---
name: world-news-intro-v1
description: 第41轮 — 开局世界新闻·氛围基调系统 v1.0
metadata:
  type: reference
---

# 开局世界新闻·氛围基调系统 v1.0

**2026-07-03 实装（第41轮）** — 游戏开局时展示当日世界新闻，建立时代氛围基调。

## 设计参考

Papers Please 每日报纸 / 大多数 年代背景文字 / Disco Elysium 文学性开场 / Frostpunk 政策公告 / Cultist Simulator 碎片化叙事

## 核心内容

**新文件**：`src/js/core/world_news_intro.js`（首版 ~380 行）

### 新闻数据库（70+ 条）

7 大类 × 12 月分布：

- `employment`：就业/裁员/蓝领/AI替代/灵活就业/公考热
- `economy`：消费刺激/通缩/A股/新能源出口/小微困境/降息
- `housing`：房价下行/保交楼/城中村改造/租房市场
- `tech`：DeepSeek/人形机器人/芯片突破/直播经济
- `social`：出生率/心理健康/新贫困陷阱/逆城市化/银发经济/教育改革
- `policy`：中美贸易摩擦/平台监管/乡村振兴/数字人民币/劳工权益
- `seasonal`：春节/618/毕业季/双十一/金三银四/高温/国庆/冬季

### 智能筛选算法

- 按真实月份匹配候选新闻池
- 日期作为确定性随机种子（同一天玩家看到相近新闻）
- 7剧本差异化加权（laid_off 更易抽到裁员，fresh_grad 更易抽到毕业新闻）
- 多样性保障：就业/经济/社会三类各至少出一条

### 世界参数联动

- 每条新闻的 `worldEffect.sectorHeat` 直接写入 `_worldParams.sectorHeat`
- 多数投票决定开局市场情绪
- 与 `world_params.js` 的 `seedWorldFromReality` 形成互补

### UI 设计

- 全屏深色遮罩 + GitHub-style 暗色面板（**第43轮改为温暖报刊风**）
- 剧本专属背景描述 7 版本
- 左边框颜色区分情绪（绿=利好/红=利空/黄=波动）

### 全剧本覆盖

`startScenarioGame`、`startSandboxGame`、`startNewGame` 三个入口均接入，回调模式，安全降级。

## 后续演进

- **第42轮** → 实时新闻抓取系统 v2.0（详见 [[real-time-news-v2]]）
- **第43轮** → UI配色改造 + 全系统影响扩展（详见 [[news-ui-and-source-expansion]]）
- **第44轮** → 新闻源替换 + 分类引擎强化 + 经济扩充（详见 [[news-ui-and-source-expansion]]）

## 验证

- `npm run check:js` → 120 文件通过
- `python build.py` → 4402.1 KB
- 7个剧本各正确选出 4 条差异化新闻
