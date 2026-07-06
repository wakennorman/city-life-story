# 城市浮生记 — 开发文档

> 新 agent 接手项目时，请先阅读本文件了解全貌。

## 🚨 核心原则：全中文

> **游戏中给玩家显示的所有元素必须只能是中文，不能包含任何其他语言（英文、日文、韩文等）。这是游戏的最高优先级设计原则。**

### 全中文范围（包括但不限于）

| 类别                | 说明                                                                     | 示例                                                                     |
| ------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| **页面标题**        | `<title>` 标签                                                           | ✅ `城市浮生记` ❌ `City Life Story`                                     |
| **游戏标题**        | 欢迎界面、Header 中的游戏名                                              | ✅ `城市浮生记`                                                          |
| **Tab/按钮标签**    | 所有 Tab 名称、按钮文字                                                  | ✅ `行动` `交易` `物品` `技能` `职场`                                    |
| **属性/需求名称**   | 侧边栏所有属性条、需求条                                                 | ✅ `体质` `智力` `敏捷` `心智` `饥饱` `疲劳` `卫生` `心情` `健康` `名气` |
| **职场属性**        | 职场阶段属性                                                             | ✅ `发量` `尊严` `KPI` `能力` `向上管理` `人缘` `风险`                   |
| **工作名称/描述**   | 所有工作定义                                                             | ✅ `废品回收` `摆摊卖小吃` `工厂流水线`                                  |
| **商品名称**        | 所有商品定义                                                             | ✅ `瓶装水` `方便面` `零食`                                              |
| **地点名称/描述**   | 所有地点定义                                                             | ✅ `城中村` `批发市场` `商业区`                                          |
| **技能名称**        | 所有技能                                                                 | ✅ `烹饪` `维修` `编程` `英语` `驾驶` `销售`                             |
| **证书名称**        | 所有证书                                                                 | ✅ `建筑安全证` `驾照` `英语四级证书`                                    |
| **NPC名称/对话**    | 所有 NPC                                                                 | ✅ `王大婶` `李工头` `张姐`                                              |
| **新闻标题**        | 所有新闻事件                                                             | ✅ `国际金属价格暴涨！`                                                  |
| **模态框标题/按钮** | 所有弹窗                                                                 | ✅ `保存游戏` `读取存档` `开始新游戏`                                    |
| **游戏结束/胜利**   | 结局文案                                                                 | ✅ `登峰造极！` `财务自由！`                                             |
| **消息提示**        | `StateManager.addMessage()` 所有消息                                     | ✅ `购买了5瓶瓶装水`                                                     |
| **装备名称/效果**   | 所有装备                                                                 | ✅ `草帽` `劳保手套` `安全帽`                                            |
| **住所名称**        | 住所层级                                                                 | ✅ `露宿街头` `合租床位` `单间` `一居室`                                 |
| **仓库名称**        | 仓库选项                                                                 | ✅ `小仓库` `大仓库`                                                     |
| **背包名称**        | 背包升级                                                                 | ✅ `帆布背包` `大号旅行包` `专业登山包`                                  |
| **公司/职级**       | 职场数据                                                                 | ✅ `星辰科技` `P5初级工程师`                                             |
| **团队角色**        | 团队成员                                                                 | ✅ `技术极客` `老黄牛` `房贷战神`                                        |
| **股票名称**        | 股票代码对应名称                                                         | ✅ `星辰科技` `字节龙`                                                   |
| **时段标签**        | 时间槽                                                                   | ✅ `上午` `下午` `晚上`                                                  |
| **好感度标签**      | NPC关系                                                                  | ✅ `挚友` `好友` `熟人` `初识` `冷淡` `厌恶`                             |
| **CSS 样式指令**    | 避免使用 `text-transform: uppercase` 等可能影响中文显示的英文 CSS 属性值 | —                                                                        |

### 全中文检查清单

每次修改代码后，必须逐项检查：

- [ ] 页面 `<title>` 是纯中文
- [ ] 欢迎界面所有文字是中文
- [ ] 顶部栏所有标签是中文
- [ ] 侧边栏所有属性名是中文
- [ ] 所有 Tab 按钮标签是中文
- [ ] 所有行动卡片标题和描述是中文
- [ ] 所有模态框标题和按钮是中文
- [ ] 所有消息提示是中文
- [ ] 所有数据定义（工作/商品/地点/NPC/技能/证书/装备/公司/股票）中的 `name` 字段是中文
- [ ] 所有 `StateManager.addMessage()` 调用中的文本是中文
- [ ] 所有 `showModal()` 调用中的 `title` 和 `buttons[].text` 是中文

### 注意事项

- **代码注释和变量名可以是英文**（如 `basePrice`、`physique`），这些是开发内部使用的，玩家不可见
- **emoji 可以保留**（如 `📅` `💰` `🎂`），它们是图标而非文字
- **货币符号 `¥` 可以保留**，这是中国人民币的标准符号
- **数字可以保留**（如天数、年龄、金额）
- **CSS 类名、JS 变量名可以是英文**，玩家不可见
- **修改完成后，用 Ctrl+Shift+R 强制刷新浏览器测试**

---

## 架构

### 核心模式

- **StateManager 单例**：唯一状态源，Proxy 实现脏标记驱动渲染
- **renderAll() 调度**：脏标记触发 → 按需更新 DOM
- **函数覆盖桥接**：trade.js 中 `typeof buyGoodV2 === "function"` 检测，自动路由到新版函数

### 文件结构与加载顺序

```
index.html
├── js/core/
│   ├── state.js      — 唯一状态源（createDefaultState / importState / _deepMerge）
│   ├── save.js       — 存档系统（localStorage）
│   └── events.js     — 事件系统
├── js/data/
│   ├── locations.js  — 11个地点 + TRAVEL_GRAPH + AP_COSTS + getReachableLocations()
│   ├── jobs.js       — 工作定义
│   ├── goods.js      — 商品定义（GOODS 数组 + getGoodById()）
│   ├── items.js      — 装备定义（ITEMS 数组）
│   ├── news.js       — 新闻数据
│   ├── skills.js     — 技能定义
│   ├── npcs.js       — NPC 数据
│   └── corp.js       — 职场数据
├── js/phase1/        — 街头阶段系统
│   ├── trade.js      — 买卖逻辑 + getCurrentPrice() + getAvgBuyPrice()
│   ├── needs.js      — 需求衰减
│   ├── carry.js      — 背包/运输系统（V2函数）
│   ├── weather.js    — 天气/气候系统
│   └── pricing.js    — 地区差价/供需/市场事件
├── js/phase2/        — 职场阶段系统
│   ├── perf.js       — 绩效
│   ├── promo.js      — 晋升
│   ├── team.js       — 团队
│   ├── stock.js      — 废弃（仅31行迁移注释，功能已迁移到 investment.js）
│   ├── investment.js — 投资系统（8只行业股 + 比特币 + 5种房产 + 3种汽车）
│   └── corp_ops.js   — 职场操作
├── js/ui/
│   ├── render.js     — 主渲染调度器（所有 UI 渲染函数）
│   └── corp_ui.js    — 职场 UI
└── js/main.js        — 主入口（初始化 + 事件绑定 + 行动生成 + endDay结算）
```

**加载顺序**（在 index.html 中）：Core → Data → Phase1 → Phase2 → UI → Main

---

## 状态数据结构

### state.player

```js
{
  name: "无名",
  gender: "male",
  age: 20,
  birthday: { month: 6, day: 15 },
  // 街头4维属性 (0-100)
  physique: 22,      // 体质（影响负重上限）
  intelligence: 20,
  agility: 24,
  mental: 26,
  // 职场7维属性（进入职场后初始化）
  corporate: { hair, dignity, upwardMgmt, kpi, ability, risk, popularity },
  // 时间
  phase: "street",        // 'street' | 'corporate'
  day: 1,
  timeSlot: "morning",    // 'morning' | 'afternoon' | 'evening'
  actionPoints: 100,      // 0-100，AP耗尽自动推进时段恢复40AP，每日满恢复
  maxActionPoints: 100,   // AP上限（可被住所/汽车加成）
}
```

### state.weather

```js
{
  weatherId: "sunny",     // 天气类型ID，对应 WEATHER_TYPES
  temperature: 20,        // 摄氏度
  season: "spring",       // spring/summer/autumn/winter
  seasonDay: 1,           // 季节内天数 1-30
  year: 1,                // 年份
  weatherDef: {},         // 天气类型定义缓存
  tempEffect: {},         // 温度体感效果缓存
}
```

### state.inventory

```js
{
  items: [],              // [{ id, qty, avgBuyPrice, buyDay }]
  capacity: 20,           // 旧版兼容，新版用 calcEncumbrance
  containers: [],         // [{ containerId, slot }] 装备的容器
  storage: {},            // { locationKey: [{ id, qty, avgBuyPrice }] } 各地暂存仓库
  equipment: { head, body, feet, hand, accessory },
}
```

### state.trade

```js
{
  currentLocation: "slum",
  goodsPrices: {},        // { locationKey: { goodId: price } }
  priceTrends: {},
  lastPriceUpdate: 0,
  supplyDemand: {},       // { locationKey: { goodId: number } } 供需记录（±50）
  marketEvents: [],       // [{ id, name, goodId, priceMod, remaining, desc }]
}
```

### state.status

```js
{
  health: 100,
  fame: 0,
  comfort: 50,            // 舒适度（住所+衣物+天气+卫生）
  emotionalState: "stable",
  sick: false,
  injured: false,
}
```

### state.housing

```js
{ tier: 0, rentedDay: 0, storageRented: false, storageCapacity: 0 }
// tier: 0=露宿, 1=合租床位, 2=单间, 3=一居室
```

### state.investment

投资系统完整字段，详见 `js/phase2/investment.js` 中的 `createDefaultInvestmentState()`。

### importState 深度合并

`_deepMerge(defaults, saved)` 递归合并，saved 覆盖 defaults 已有字段，缺失字段用 defaults 补齐。解决旧存档缺少新字段导致渲染崩溃的问题。

---

## 系统详细设计

### 1. AP行动力系统

- 范围 0-100，每个行动消耗不同 AP（定义在 `AP_COSTS`）
- AP 耗尽自动推进时段并恢复 40AP
- 每日（endDay）满恢复至 maxActionPoints
- 旅行 AP = 基础距离消耗 + 负重惩罚 + 天气惩罚
- 汽车提供 AP 上限加成（5/10/15）

### 2. 背包/运输系统（carry.js）

**商品物理属性**（GOOD_PHYSICS）：

| 商品   | 重量(kg) | 体积(L) | 易腐 | 保质期(天) | 易碎 | 温感 |
| ------ | -------- | ------- | ---- | ---------- | ---- | ---- |
| 水果   | 0.5      | 0.6     | 是   | 5          | 是   | 是   |
| 蔬菜   | 0.4      | 0.5     | 是   | 4          | 是   | 否   |
| 零食   | 0.15     | 0.2     | 是   | 60         | 否   | 否   |
| 废金属 | 2.0      | 0.8     | 否   | -          | 否   | 否   |
| 废纸板 | 0.3      | 1.0     | 否   | -          | 否   | 是   |
| 电子   | 0.8      | 0.4     | 否   | -          | 是   | 否   |

**容器系统**（CONTAINER_TYPES）：

| 容器     | 槽位 | 容量(kg) | 体积(L) | 减负 | 价格 |
| -------- | ---- | -------- | ------- | ---- | ---- |
| 塑料袋   | 手持 | 5        | 8       | 50%  | ¥1   |
| 帆布袋   | 手持 | 10       | 12      | 70%  | ¥15  |
| 小双肩包 | 背部 | 20       | 18      | 80%  | ¥40  |
| 登山包   | 背部 | 30       | 25      | 90%  | ¥80  |
| 旅行包   | 背部 | 40       | 35      | 85%  | ¥120 |
| 腰包     | 腰部 | 4        | 3       | 95%  | ¥15  |
| 工具箱   | 手持 | 15       | 10      | 60%  | ¥30  |
| 小推车   | 手持 | 60       | 40      | 0%   | ¥120 |

**负重等级**（ENCUMBRANCE_TIERS）：

| 等级 | 负重比  | 名称 | 移速惩罚 | AP惩罚 |
| ---- | ------- | ---- | -------- | ------ |
| 轻装 | <0.5    | 轻装 | 0        | 0      |
| 正常 | 0.5-0.8 | 正常 | 0        | 0      |
| 沉重 | 0.8-1.0 | 沉重 | 0.2      | +1     |
| 超载 | 1.0-1.3 | 超载 | 0.4      | +2     |
| 极限 | 1.3-1.6 | 极限 | 0.6      | +3     |
| 崩溃 | >1.6    | 崩溃 | 0.8      | +5     |

**负重上限计算**：`15 + 体质×0.3 + 容器减负加成`

**雇佣运输**（TRANSPORT_SERVICES）：

| 服务     | 容量  | 费用 | 偷窃率 | 损坏率 | 特殊事件 |
| -------- | ----- | ---- | ------ | ------ | -------- |
| 力工     | 30kg  | ¥50  | 5%     | 3%     | 纠纷10%  |
| 快递员   | 60kg  | ¥120 | 2%     | 2%     | 无       |
| 搬家公司 | 200kg | ¥300 | 0.5%   | 1%     | 无       |

**关键函数**：

- `calcEncumbrance(state)` → { totalWeight, maxCarry, ratio, tier, totalVolume, maxVolume }
- `canCarryMore(state, goodId, qty)` → { weightOk, volumeOk, overLimit }
- `buyGoodV2(goodId, qty)` / `sellGoodV2(goodId, qty)` — V2版买卖（重量/体积检查）
- `hireTransport(serviceId, goods, destKey)` — 雇佣运输（含随机事件）
- `tickPerishableGoods(state)` — 每日变质检查
- `buyContainer(containerId)` — 购买装备容器
- `retrieveFromStorage(goodId, qty)` — 从当地仓库取货

**桥接模式**：trade.js 的 buyGood/sellGood/buyWholesale 开头加了 `if (typeof buyGoodV2 === "function") return buyGoodV2(...)` 判断，自动路由到新版。

### 3. 天气/气候系统（weather.js）

**四季循环**：春→夏→秋→冬，每季30天，120天=1年

```js
getSeason(day); // 根据天数获取当前季节
getSeasonDay(day); // 季节内天数 (1-30)
getYear(day); // 年份
```

**14种天气类型**（WEATHER_TYPES）：

| 天气 | AP惩罚 | 价格修正 | 运输风险 | 心情 | 可出行 |
| ---- | ------ | -------- | -------- | ---- | ------ |
| 晴   | 0      | 1.0      | 1.0      | +3   | 是     |
| 小雨 | +2     | 0.95     | 1.05     | -3   | 是     |
| 大雨 | +5     | 0.9      | 1.15     | -5   | 是     |
| 雷暴 | +10    | 0.85     | 1.3      | -8   | **否** |
| 暴雪 | +15    | 1.2      | 1.6      | -10  | **否** |
| 台风 | +20    | 0.8      | 1.8      | -15  | **否** |
| 热浪 | +5     | 1.1      | 1.05     | -5   | 是     |
| 寒潮 | +8     | 1.15     | 1.2      | -6   | **否** |

**温度体感7级**（TEMP_EFFECTS）：酷热/炎热/温暖/凉爽/寒冷/严寒/极寒

**天气生成规则**：

- 每日根据季节概率表随机生成
- 30%概率延续昨日天气（连续性）
- 时段微调温度（上午+1, 下午+3, 晚上-2）

**天气对商品的特殊影响**：

- 热浪：水/啤酒 +20%，水果 +10%
- 寒潮/暴雪：衣物 +20%，泡面 +15%
- 大雨/台风：日用品 +15%

**关键函数**：

- `initWeatherState(state)` — 生成新天气
- `applyWeatherDailyEffects(state)` — 每日天气效果结算
- `isWeatherTravelBlocked(state)` — 极端天气阻止出行
- `getWeatherTravelAPPenalty(state)` — 天气AP惩罚
- `getWeatherGoodPriceMod(state, goodId)` — 天气对商品价格修正

### 4. 地区差价系统（pricing.js）

**区域特产标签**（LOCATION_GOODS_TAGS）：

| 地点     | 特产（便宜85折）   | 稀缺（贵+20%）   |
| -------- | ------------------ | ---------------- |
| 城中村   | 日用品、香烟、泡面 | 电子、衣物、水果 |
| 批发市场 | 几乎所有商品       | 废品             |
| 建筑工地 | 废金属、水         | 水果、衣物、电子 |
| 大学城   | 零食、泡面、水     | 香烟、啤酒、电子 |
| 商业区   | 无                 | 废品             |
| 科技园   | 电子、衣物         | 废品、蔬菜       |

**供需动态**：

- 买入推高当地价格，卖出压低当地价格
- 每点影响 0.5%，最多 ±25%
- 每日衰减 20%（回归均值）

**市场事件**（MARKET_EVENTS，8种）：

| 事件       | 商品   | 价格修正 | 持续 | 季节  |
| ---------- | ------ | -------- | ---- | ----- |
| 水果短缺   | 水果   | ×1.8     | 3天  | 春/秋 |
| 蔬菜丰收   | 蔬菜   | ×0.5     | 2天  | 夏/秋 |
| 数码热销   | 电子   | ×1.5     | 2天  | 全季  |
| 废金属涨价 | 废金属 | ×1.6     | 3天  | 春    |
| 啤酒节     | 啤酒   | ×1.4     | 2天  | 夏    |
| 换季清仓   | 衣物   | ×0.6     | 3天  | 春/秋 |
| 供水紧张   | 水     | ×2.0     | 2天  | 夏    |
| 烟草加税   | 香烟   | ×1.3     | 5天  | 全季  |

**技能影响**：

- 销售技能每级降低 0.3% 买入价，提高 0.3% 卖出价（最多 30%）
- 销售等级 ≥10：知道当前是贵还是便宜
- 销售等级 ≥25：知道哪里便宜/贵
- 销售等级 ≥50：完整信息（全城最低/最高+利润预估）

**综合定价引擎**（calcFinalPrice）：

1. 商品基准价
2. × 地点基础修正（locations.js 的 priceMod）
3. × 特产/稀缺标签修正
4. × 供需修正
5. × 市场事件修正
6. × 天气修正
7. 限制在基准价的 20%-600%

**关键函数**：

- `calcFinalPrice(state, locKey, goodId)` — 综合定价
- `recordLocalPurchase(state, locKey, goodId, qty)` — 记录买入
- `recordLocalSale(state, locKey, goodId, qty)` — 记录卖出
- `checkMarketEvents(state)` — 检查并触发市场事件
- `decaySupplyDemand(state)` — 每日供需衰减

### 5. 舒适度系统（weather.js 中 applyComfortEffects）

舒适度计算：`基础50 + 住所加成(0/10/20/35) + 衣物加成 + 天气影响(±30) + 卫生影响`

| 温度体感  | 舒适度影响 |
| --------- | ---------- |
| 温暖      | +10        |
| 凉爽      | +5         |
| 炎热      | -10        |
| 寒冷      | -10        |
| 酷热/严寒 | -20        |
| 极寒      | -30        |

舒适度对心情的影响：

- <20：心情-5/天
- <40：心情-2/天
- > 80：心情+2/天

### 6. 衣物与天气互动

装备可提供防寒/防暑保护值（items.js 中 effects.coldProtection / effects.heatProtection），抵消极端天气的健康损失。

### 7. 投资系统（investment.js）

- 8只行业股（含趋势/波动/新闻）
- 比特币（恐慌贪婪指数/减半周期）
- 5种房产（月收租+升值）
- 3种汽车（AP加成 5/10/15，月贬值+保养费）

---

## endDay 每日结算流程

1. 需求衰减（applyNeedsDecay）
2. 睡眠恢复 + 住所效果
3. 房租/仓库租金扣除
4. 伤病结算（tickHealthStatus）
5. 需求阈值检查（checkNeedsThresholds）
6. 情绪判定（determineEmotionalState）
7. 易腐商品变质检查（tickPerishableGoods）
8. 天气系统更新 + 效果结算（initWeatherState + applyWeatherDailyEffects）
9. 供需衰减 + 市场事件（decaySupplyDemand + checkMarketEvents）
10. 投资市场每日更新（tickInvestmentDaily）
11. 同步旧版股票数据（syncStockToInvestment）
12. 贷款利息 + 银行存款利息
13. 年龄增长检查
14. 保存游戏

---

## UI 渲染结构

### Tab 系统

- `actions` — 行动（工作/旅行/日常/社交）
- `trade` — 交易（买卖商品+负重+市场事件+地区差价提示）
- `inventory` — 背包（负重状态栏+商品卡片+容器+仓库+运输+装备）
- `invest` — 投资（股票/比特币/房产/汽车）
- `skills` — 技能
- `jobs` — 工作

### 关键渲染函数

| 函数                              | 职责                                   |
| --------------------------------- | -------------------------------------- |
| renderAll()                       | 主渲染入口，调度所有子渲染             |
| renderHeader(state)               | 顶部栏（天数/年龄/阶段/现金/AP）       |
| renderTimeSlot(state, parent)     | 时段+AP+天气+温度                      |
| renderSidebar(state)              | 侧边栏（属性条+需求条+住所+负重+位置） |
| renderInventoryTab(state, parent) | 背包Tab（全部背包UI）                  |
| renderTradeTab(state, parent)     | 交易Tab（商品+市场事件+差价）          |
| renderInvestTab(state, parent)    | 投资Tab                                |

---

## 技术债务

- bat 脚本编码问题（中文在 Windows cmd 乱码），避免在 bat 中用中文
- 旧 stock.js 已废弃（31行迁移注释），不再有功能代码
- actions_extra.js 中的扩展行动可能缺少 AP 消耗
- corp_ops.js 中职场阶段股票交易可能仍引用旧系统

---

## 变更日志

### 2026-06-16

- 新增背包/运输系统（carry.js）
- 新增天气/气候系统（weather.js）
- 新增地区差价系统（pricing.js）
- 新增舒适度属性 + 衣物天气互动
- 修复投资板块不显示bug（importState深度合并）
- 全中文检查（EXP→经验，移除英文标题）
- 修复买卖不消耗AP导致时间不推进（每笔交易3AP）
- 修复容器购买替换旧版背包（所有地点可买容器）
- 所有地点添加 priceMod 和摆摊工作
- **摆地摊创业改造**：背包有货时摆摊自动卖出，偏好商品卖出更多，固定收入+卖货收入互补
  - `doStreetJob()` 中摆摊类工作触发背包卖货
  - `getVendingPreferredGoods()` 定义各摆摊类型的偏好商品
  - `estimateJobPay()` 收入预估包含卖货收入
  - 天气恶劣时摆摊收入受影响并提示
- **天气可视化面板**：点击时间栏天气区域展开详情
  - 季节信息+进度条、温度体感
  - 天气影响列表（AP/价格/运输/健康/心情）
  - 衣物防护展示、舒适度来源拆解

### 2026-06-16 (第二轮)

- **修复核心bug**：
  - 时间流逝：`consumeAP()` AP不足时自动推进时段+恢复40AP，不再阻止操作
  - 买入函数 `buyGoodV2()` 检查 consumeAP 返回值
  - 天气初始化：`startNewGame()` 和 `loadExistingGame()` 中调用 `initWeatherState()`
  - 随机事件：`endDay()` 新闻概率提升至25%，新增 `triggerMidDayEvent()` 时段转换随机事件
  - 投资标签：CSS添加 `overflow-x: auto` 支持移动端滚动
- **城管系统**：
  - `CHENGGUAN_RISK` 各地点巡查风险（商业区最高0.35，工地0）
  - `checkChengguan()` 摆摊时城管巡查 → 全部没收/部分没收/警告
  - 城管关系影响巡查概率（每10点好感-5%风险）
  - `bribeChengguan()` 行贿城管改善关系
  - 名气提高巡查风险
- **关系系统**：
  - `state.relationships.chengguan/landlord/wholesaler/neighbors`
  - 批发商关系：和批发商套近乎行动，降低进货价（最高-15%）
  - `getCurrentPrice()` 集成供需/市场事件/批发商关系修正
- **恋爱/婚姻/共同财产系统**：
  - `state.romance` 完整数据结构（partner/relationship/sharedCash/children）
  - 交易时5%概率邂逅 → 约会 → 好感≥60恋爱 → 好感≥80求婚 → 结婚
  - 结婚后配偶每日收入50-200进入共同财产
  - 好感<20可能离婚+财产分割
  - 结婚365天后可能生子
  - 侧边栏显示恋爱/婚姻/子女状态
- **买卖影响状态/属性**：
  - `applyTradeEffects()` 每次交易：疲劳+1~3，心情±2，卫生-2，敏捷/智力微量+
  - 销售经验微量增长
- **技能挂钩**：
  - 学习效率受智力加成（`1 + intelligence * 0.005`）和疲劳惩罚
  - 夜校1.5倍效率（仅晚上可用）
  - 批发商关系降低进货价
  - 工作技能要求已在 `checkJobRequirements()` 中
- **时间相关行动**：
  - 夜校仅晚上可用（`timeSlot === "evening"`）
  - 银行晚上关门（存款/取款/贷款/还债不可用）
  - 公园晚上行动变化（夜散步）

### 2026-06-17 凌晨（NPC系统 + 事件扩充 + 叙事体验）

**NPC 系统**：

- NPC 生日系统：每个 NPC 有生日，当日送礼好感×2，错过有冷落惩罚，游戏内弹窗提醒
- NPC 生日对话：生日当天有专属对话分支
- NPC 解锁 flag：好感达阈值后 NPC 解锁特定玩法（工作推荐/批发渠道/关系特权）
- NPC 委托任务：6 个 NPC 各有一次特殊请求（帮买东西/跑腿/介绍人脉），完成后好感+奖励
- NPC 阈值奖励：好感达到特定值时触发一次性奖励

**事件系统**：

- 随机事件扩充至 51 个
- 节日系统：法定节假日影响商品价格、行动收益和 NPC 对话
- 道德后果事件：过去的道德选择影响后续随机事件概率与走向
- 周末节奏系统：周六/周日有专属行动选项和收益变化
- 人生里程碑章节事件：达到特定资产/年龄/阶段时触发剧情性章节事件

**叙事与体验**：

- 梦想追踪系统：玩家可设定人生目标，里程碑进度有专属叙事文案
- 每日今日总结：每天结算后生成一句话高光叙事（"今天你..."）
- 存档快照回忆文案：读取旧存档时显示"那时候你..."回忆段落
- 地点氛围文字：进入各地点时有动态描述性文案
- 今日智能建议：根据当前状态（库存/天气/NPC生日/市场事件）推送行动建议

**玩法机制**：

- 摆摊选址策略：不同地点客流量不同，影响摆摊固定收益
- 成就档案系统：解锁成就记录在存档，可在档案页查看
- 动态教程提示：新手前几天根据当前状态推送操作引导
- 成长数据可视化：时间线图表展示属性/资产增长曲线

---

## 概率系统设计（v2.0 核心设定）

### 设计哲学：独立真随机（True Random）

游戏的核心概率系统追求数学上纯净的「真随机」——每一次掷骰完全独立，不存在任何形式的伪随机分布（PRD）、保底机制或隐藏修正。

| 特性                | 真随机（本游戏） | PRD（Dota 2） | 保底（Gacha） |
| ------------------- | :--------------: | :-----------: | :-----------: |
| 每次概率独立        |        ✅        |    ❌ 递增    |    ❌ 累计    |
| 数学期望 = 标称概率 |     ✅ 严格      |  ❌ 调低初始  |    ❌ 偏高    |
| 极端连续失败可能    |     ✅ 允许      |    ✅ 减少    |    ❌ 禁止    |
| 可预测/可垫刀       |     ❌ 不可      |     ✅ 可     |     ✅ 可     |
| 真实感              |    ✅ 如现实     |   ❌ 游戏化   |   ❌ 商业化   |

### 为什么选择真随机？

1. **数学纯净** —— 50% 就是 50%，不骗玩家
2. **不可预测** —— 无法通过任何方式操纵随机序列
3. **策略深度** —— 真正的风险管理：备选方案比概率修正更有意义
4. **主题契合** —— 城市浮生记的主题是「生活的不确定性」，真随机最贴合

### 真随机的游戏设计补偿（不修正概率，只提供选择）

- **多路径容错**：重要行动失败时，总有其他方式达成目标
- **信息透明**：玩家看到真实的概率值
- **渐进式难度**：通过多个小成功累积大成果，而非单次判定决定一切

### 科学累积系统（不与概率系统冲突）

以下系统使用自然累积/渐进模型，不涉及概率修正：

| 系统          | 累积方式                 | 科学依据                   |
| ------------- | ------------------------ | -------------------------- |
| 技能熟练度    | 每次实践 +XP             | 神经科学：重复→髓鞘化→熟练 |
| 疾病恶化/康复 | severity 随时间累积/递减 | 病理学：自然病程           |
| 天气连续性    | 30% 概率延续昨日         | 气象学：大气状态马尔可夫链 |
| 市场趋势      | 动量+均值回归            | 金融学：趋势与波动         |
| 疲劳累积      | 随时间增加，休息减少     | 生理学：代谢产物累积       |
| NPC 好感度    | 多次互动累积             | 心理学：信任累积           |
| 投资复利      | 本息累积                 | 金融学：复利效应           |
| 职场绩效      | 季度持续表现累积         | 管理学：持续输出           |

### Random 模块 API

位于 `js/core/random.js`，加载顺序在 state.js 之前。

```js
// 核心真随机判定（所有概率检查使用）
Random.chance(0.3); // 30% 概率 true

// 随机值生成
Random.int(1, 6); // 骰子 1-6
Random.float(0.5, 1.5); // 浮点数 0.5~1.5
Random.gaussian(50, 10); // 正态分布（均值50，标准差10）

// 随机选择
Random.fromArray(arr); // 随机选一个
Random.pickN(arr, 3); // 随机选 N 个不重复
Random.weighted(items, w); // 加权随机
Random.shuffle(arr); // Fisher-Yates 洗牌

// 多分支概率
Random.multichance([0.3, 0.2, 0.1]); // 返回0/1/2/-1

// 去重控制（非概率修正，仅防重复触发）
Random.canTriggerToday(state, key, maxPerDay);

// 模拟测试
Random.simulate(0.3, 10000); // 返回 {trials, successes, actualRate, expectedRate, deviation}
```

### 已替换为 Random 模块的文件

- `js/core/events.js` ✅
- `js/data/news.js` ✅
- `js/data/jobs.js` ✅
- `js/phase1/*.js` ✅
- `js/phase2/*.js` ✅
- `js/main.js` ✅

> **规则**：任何新增的 `Math.random()` 概率判定必须使用 `Random.*()` 替代。
