# 城市浮生记 v3.7 — 内容完善方案

> 基于 subagent_result3.md 的问题诊断结果
> 改进原则：保留现有核心玩法框架，修复不合理之处，增强系统关联性

---

## 一、P0 问题改进方案（4项）

### P0-1: 副业系统接入每日管线

**现状**：`phase2/side_hustle.js`（~725行）已实现6类夜间经济，但未接入 `daily_pipeline.js`。

**修改点**：
1. **`phase1/daily_pipeline.js`** — 在 `night_activities` 步骤后添加 `side_hustle_tick` 步骤
   ```javascript
   // daily_pipeline.js 约 L530 处，在 night_activities 后添加：
   step(32, "side_hustle_tick", function () {
     if (typeof tickSideHustle === "function") {
       tickSideHustle(state);
     }
   });
   ```
2. **`index.html`** — 确保 `side_hustle.js` 在 `daily_pipeline.js` 之后加载
   ```html
   <script src="js/phase2/side_hustle.js"></script>
   ```
3. **`core/state.js`** — 初始化 `state.sideHustle` 字段
   ```javascript
   state.sideHustle = {
     active: false,
     type: null,  // 'stall' | 'driving' | 'freelance' | 'content' | 'sharing' | 'community'
     fatigue: 0,  // 副业疲劳度（影响次日主业效率）
     income: 0,   // 当日副业收入
     reputation: 0  // 副业口碑
   };
   ```

**预期效果**：
- 玩家可以在白天上班/创业之余，晚上从事副业
- 副业疲劳度影响次日主业KPI（疲劳度>50 → KPI -15%）
- 副业收入受天气、行业热度、技能等级影响

**修复成本**：~20行

**风险与回滚**：
- 风险：副业疲劳度计算可能影响主线平衡
- 回滚：删除 `daily_pipeline.js` 的 `side_hustle_tick` 步骤，恢复 `state.js` 原字段

---

### P0-2: 经济平衡 — 压缩创业收益 / 提升打工吸引力

**现状**：创业月入¥200K+，打工P10月薪¥80K，差距2.5倍。

**方案A：压缩创业收益**
1. **`phase2/startup.js`** — 降低 growth 阶段月入
   ```javascript
   // startup.js L325+ 处
   // 原：growth月入 = baseRevenue * 2.5
   // 新：growth月入 = baseRevenue * 1.8
   var growthMultiplier = 1.8;  // 原 2.5
   ```
2. **`phase2/startup.js`** — 增加运营成本
   ```javascript
   // startup.js L340+ 处
   // 原：monthlyCost = employeeCount * 8000
   // 新：monthlyCost = employeeCount * 12000 + officeRent
   var monthlyCost = state.startup.employeeCount * 12000 + state.startup.officeRent;
   ```

**方案B：提升打工吸引力**
1. **`data/corp.js`** — 提升P10月薪
   ```javascript
   // corp.js L200+ 处
   // 原：P10月薪 = 80000
   // 新：P10月薪 = 100000 + 期权价值
   var p10Salary = 100000;
   var stockOptions = Math.floor(player.skillLevel * 500);  // 技能加成
   ```
2. **`ui/corp_ui.js`** — 增加职场福利展示
   ```javascript
   // corp_ui.js 新增福利Tab
   renderCorpBenefits: function (state) {
     var benefits = [
       { name: "五险一金", value: "公司全额缴纳" },
       { name: "年终奖", value: "2-4个月薪资" },
       { name: "股票期权", value: "P8以上可获" },
       { name: "补充医疗", value: "覆盖家属" }
     ];
     // 渲染福利列表
   }
   ```

**推荐**：方案A + 方案B 组合，创业月入压缩至¥150K，打工P10月薪提升至¥100K+期权。

**预期效果**：
- 创业与打工的吸引力差距从2.5倍降至1.5倍
- 玩家有更多职业选择，不再"最优解锁定"

**修复成本**：~40行

**风险与回滚**：
- 风险：创业收益过低可能导致玩家放弃创业路线
- 回滚：恢复 `startup.js` 和 `corp.js` 原数值

---

### P0-3: 后期"钱太多没事做" — 增加维持性开支

**现状**：`daily_pipeline.js` 已有 `wealth_overhead` 步骤，但开支数值偏低。

**修改点**：
1. **`phase1/needs.js`** — 增加维持性开支函数
   ```javascript
   /**
    * 根据玩家财富等级计算维持性开支
    * 资产¥50W+ → 月度开支¥10K-30K
    * 资产¥1M+ → 月度开支¥30K-80K
    * 资产¥5M+ → 月度开支¥80K-200K（含社交应酬、子女教育、健康管理）
    */
   function applyWealthBasedOverhead(state) {
     var assets = state.player.cash + state.player.bankBalance;
     var monthlyOverhead = 0;

     if (assets >= 5000000) {
       monthlyOverhead = 80000 + Math.random() * 120000;  // ¥80K-200K
     } else if (assets >= 1000000) {
       monthlyOverhead = 30000 + Math.random() * 50000;   // ¥30K-80K
     } else if (assets >= 500000) {
       monthlyOverhead = 10000 + Math.random() * 20000;   // ¥10K-30K
     }

     // 开支类型：物业管理、子女教育、社交应酬、健康管理、保险
     var overheadTypes = ["物业费", "子女教育", "社交应酬", "健康管理", "商业保险"];
     var overheadType = overheadTypes[Math.floor(Math.random() * overheadTypes.length)];

     state.player.cash -= monthlyOverhead;
     state.player.monthlyOverhead = monthlyOverhead;
     state.player.lastOverheadType = overheadType;

     return monthlyOverhead;
   }
   ```
2. **`phase1/daily_pipeline.js`** — 在 `wealth_overhead` 步骤调用
   ```javascript
   // daily_pipeline.js L34-39 处，增强现有逻辑
   step(25, "wealth_overhead", function () {
     if (typeof applyWealthBasedOverhead === "function") {
       applyWealthBasedOverhead(state);
     }
   });
   ```

**预期效果**：
- 资产¥50W+ 玩家每月有¥10K-30K 固定开支
- 资产¥5M+ 玩家每月有¥80K-200K 固定开支
- 后期玩家仍有经济压力，避免"钱太多没事做"

**修复成本**：~60行

**风险与回滚**：
- 风险：开支过高可能导致玩家破产
- 回滚：恢复 `needs.js` 原 `applyWealthBasedOverhead` 函数

---

### P0-4: 链式事件队列填充稀疏

**现状**：`checkChainEventQueue` 函数存在，但 `queueChainEvent` 调用稀疏。

**修改点**：
1. **`core/events_core.js`** — 增加更多事件的链式注册
   ```javascript
   /**
    * 注册链式事件
    * @param {string} eventId - 事件ID
    * @param {number} delayDays - 延迟天数
    * @param {object} conditions - 触发条件
    */
   function queueChainEvent(state, eventId, delayDays, conditions) {
     if (!state.player.chainEventQueue) {
       state.player.chainEventQueue = [];
     }
     state.player.chainEventQueue.push({
       eventId: eventId,
       triggerDay: state.player.day + delayDays,
       conditions: conditions,
       triggered: false
     });
   }

   // 在以下事件中调用 queueChainEvent：
   // 1. 街头事件：found_wallet → 失主寻找（3天后）
   // 2. 街头事件：stranger_invest → 后续投资（7天后）
   // 3. 职场事件：猎头挖角 → 入职谈判（5天后）
   // 4. 职场事件：公司裁员 → 再就业困难（10天后）
   // 5. 创业事件：融资成功 → 团队扩张（14天后）
   // 6. 创业事件：创业危机 → 资金链断裂风险（21天后）
   // 7. NPC事件：好感≥60 → 深度对话（3天后）
   // 8. NPC事件：好感≥80 → 合作机会（7天后）
   ```
2. **`core/events_core.js`** — 在 `checkChainEventQueue` 中增加事件质量检查
   ```javascript
   // events_core.js L388-430 处，增强逻辑
   function checkChainEventQueue(state, phase) {
     if (!state.player.chainEventQueue || state.player.chainEventQueue.length === 0) {
       return false;
     }

     var today = state.player.day;
     var triggered = false;

     for (var i = 0; i < state.player.chainEventQueue.length; i++) {
       var event = state.player.chainEventQueue[i];
       if (event.triggerDay <= today && !event.triggered) {
         // 检查条件
         if (checkEventConditions(event.conditions, state)) {
           triggerChainEvent(state, event.eventId);
           event.triggered = true;
           triggered = true;
         } else {
           // 条件不满足，延迟1天再检查
           event.triggerDay = today + 1;
         }
       }
     }

     // 移除已触发的事件
     state.player.chainEventQueue = state.player.chainEventQueue.filter(function (e) {
       return !e.triggered;
     });

     return triggered;
   }
   ```

**预期效果**：
- 链式事件队列填充率从<30%提升至≥60%
- 玩家体验更连贯的事件链，而非孤立事件

**修复成本**：~80行

**风险与回滚**：
- 风险：事件链过多可能导致弹窗疲劳
- 回滚：减少 `queueChainEvent` 调用点，恢复原逻辑

---

## 二、P1 问题改进方案（6项）

### P1-1: 新闻→投资UI透明化

**修改点**：
1. **`phase2/investment.js`** — 在投资Tab渲染中调用 `getNewsInvestmentSummary`
   ```javascript
   // investment.js UI渲染处
   function renderInvestmentTab(state) {
     // ... 现有渲染逻辑

     // 新增：今日市场驱动板块
     if (typeof getNewsInvestmentSummary === "function") {
       var newsDrivers = getNewsInvestmentSummary(state);
       renderNewsDriversPanel(newsDrivers);
     }
   }

   function renderNewsDriversPanel(drivers) {
     if (!drivers || drivers.length === 0) return;

     var html = '<div class="news-drivers-panel">';
     html += '<h4>📰 今日市场驱动</h4>';
     drivers.forEach(function (d) {
       html += '<div class="news-driver">';
       html += '<span class="news-title">' + d.newsTitle + '</span>';
       html += '<span class="news-impact ' + d.impactType + '">';
       html += d.impactType === 'positive' ? '↑' : '↓';
       html += ' ' + d.impactValue + '%</span>';
       html += '</div>';
     });
     html += '</div>';

     document.getElementById('investment-tab').insertAdjacentHTML('beforeend', html);
   }
   ```

**预期效果**：
- 玩家可以看到"科技股因为XX新闻上涨3%"的因果链
- 新闻系统与股市的关联变得透明

**修复成本**：~50行

---

### P1-2: NPC好感→事件/装备/技能链路增强

**修改点**：
1. **`data/npcs.js`** — 为每个NPC增加好感门控事件
   ```javascript
   // npcs.js 每个NPC定义中增加 affinityEvents
   var npcs = {
     aunt_wang: {
       // ... 现有定义
       affinityEvents: [
         { threshold: 30, event: "aunt_wang_plumber", desc: "水管维修优惠" },
         { threshold: 60, event: "aunt_wang_introduce", desc: "介绍新客户" },
         { threshold: 80, event: "aunt_wang_invest", desc: "共同投资小生意" }
       ]
     },
     old_zhou: {
       // ... 现有定义
       affinityEvents: [
         { threshold: 30, event: "old_zhou_tips", desc: "提供交易情报" },
         { threshold: 60, event: "old_zhou_introduce", desc: "介绍供应商" },
         { threshold: 80, event: "old_zhou_partnership", desc: "合伙做生意" }
       ]
     },
     // ... 其他NPC
   };
   ```
2. **`phase1/npc_event_bridge.js`** — 增加好感事件检查
   ```javascript
   function checkNpcAffinityEvents(state) {
     for (var npcId in npcs) {
       var npc = npcs[npcId];
       var affinity = state.player.npcAffinity[npcId] || 0;
       var affinityEvents = npc.affinityEvents || [];

       affinityEvents.forEach(function (event) {
         if (affinity >= event.threshold && !state.player.npcEventUnlocked[npcId + event.event]) {
           // 解锁事件
           state.player.npcEventUnlocked[npcId + event.event] = true;
           queueChainEvent(state, event.event, 1, { npcId: npcId });
         }
       });
     }
   }
   ```

**预期效果**：
- 每个NPC有3条好感门控事件（30/60/80阈值）
- NPC好感度与事件解锁、装备获取、技能连携形成完整链路

**修复成本**：~100行

---

### P1-3: 事件奖励动态缩放

**修改点**：
1. **`core/events_core.js`** — 增加事件奖励缩放函数
   ```javascript
   /**
    * 根据玩家财富等级缩放事件奖励
    * 财富等级 = floor(log10(player.cash + 1))
    * 奖励缩放 = 1 + 财富等级 * 0.5
    */
   function scaleEventReward(baseReward, state) {
     var wealthLevel = Math.floor(Math.log10(state.player.cash + 1));
     var scale = 1 + wealthLevel * 0.5;
     return Math.floor(baseReward * scale);
   }

   // 在事件触发处调用：
   // found_wallet: scaleEventReward(80 + Math.random() * 200, state)
   // stranger_invest: scaleEventReward(300 + Math.random() * 400, state)
   ```

**预期效果**：
- Day1 事件奖励¥80-280
- Day100（资产¥50K）事件奖励¥120-420
- Day365（资产¥500K）事件奖励¥200-700
- 事件奖励与玩家财富等级匹配

**修复成本**：~30行

---

### P1-4: 家庭系统深化

**修改点**：
1. **`phase2/family_life.js`** — 实现结婚系统
   ```javascript
   /**
    * 结婚条件：
    * 1. 好感≥80的NPC（配偶候选人）
    * 2. 特定事件（求婚成功）
    * 3. 资产≥¥200K（购房/婚礼预算）
    */
   function checkMarriageEligibility(state) {
     for (var npcId in npcs) {
       var npc = npcs[npcId];
       var affinity = state.player.npcAffinity[npcId] || 0;
       if (affinity >= 80 && npc.canMarry && !state.player.spouse) {
         // 求婚事件可触发
         queueChainEvent(state, "marriage_proposal", 3, { npcId: npcId });
       }
     }
   }

   function triggerMarriage(state, npcId) {
     state.player.spouse = npcId;
     state.player.marriageDay = state.player.day;
     // 婚礼开支
     var weddingCost = 100000 + Math.random() * 100000;  // ¥100K-200K
     state.player.cash -= weddingCost;
     // 配偶加成
     state.player.spouseBonus = {
       happiness: 5,  // 心情加成
       income: 0.05   // 收入加成5%
     };
   }
   ```
2. **`phase2/family_life.js`** — 实现生子/子女教育
   ```javascript
   function triggerPregnancy(state) {
     // 结婚后30-180天随机触发
     state.player.pregnancyDay = state.player.day;
     state.player.pregnancyDuration = 180;  // 6个月
   }

   function triggerChildbirth(state) {
     state.player.child = {
       name: generateChildName(state.player.spouse),
       birthDay: state.player.day,
       age: 0,
       attributes: {
        体质: Math.floor(Math.random() * 50) + 30,
         智力: Math.floor(Math.random() * 50) + 30,
         敏捷: Math.floor(Math.random() * 50) + 30,
         心智: Math.floor(Math.random() * 50) + 30
       },
       education: {
         level: "幼儿园",
         school: null,
         expenses: 0
       }
     };
     // 子女教育开支
     state.player.childExpenses = 5000;  // 每月¥5K
   }
   ```

**预期效果**：
- 结婚系统：好感≥80 + 资产≥¥200K → 求婚 → 婚礼
- 生子系统：结婚后随机触发怀孕 → 6个月后生子
- 子女教育：每月开支¥5K-20K（随教育阶段递增）

**修复成本**：~200行

---

### P1-5: 装备获取来源

**修改点**：
1. **`core/equipment_suites.js`** — 增加装备掉落逻辑
   ```javascript
   /**
    * 装备掉落来源：
    * 1. 街头事件：拾荒/废品交易 → 随机装备
    * 2. 职场奖励：晋升/优秀员工 → 职场装备
    * 3. 创业成就：融资成功/IPO → 创业装备
    * 4. NPC赠送：好感≥80 → 特定装备
    * 5. 商城购买：使用游戏内货币购买
    */
   function rollEquipmentDrop(state, source) {
     var equipmentPool = getEquipmentPoolBySource(source);
     if (!equipmentPool || equipmentPool.length === 0) return null;

     var equipment = equipmentPool[Math.floor(Math.random() * equipmentPool.length)];
     var quality = rollEquipmentQuality();  // 普通/稀有/史诗/传说
     var enchant = rollEnchantment(quality);

     return {
       id: equipment.id,
       name: equipment.name,
       quality: quality,
       enchant: enchant,
       durability: equipment.maxDurability,
       source: source
     };
   }
   ```
2. **`data/items.js`** — 增加装备掉落表
   ```javascript
   var equipmentDrops = {
     street: [
       { id: "eq_wrench", name: "多功能扳手", quality: "common", maxDurability: 50 },
       { id: "eq_flashlight", name: "强光手电筒", quality: "common", maxDurability: 80 },
       { id: "eq_work_gloves", name: "劳保手套", quality: "common", maxDurability: 100 }
     ],
     corporate: [
       { id: "eq_laptop", name: "商务笔记本", quality: "rare", maxDurability: 200 },
       { id: "eq_suit", name: "定制西装", quality: "rare", maxDurability: 150 }
     ],
     startup: [
       { id: "eq_smartwatch", name: "智能手表", quality: "epic", maxDurability: 300 },
       { id: "eq_nfc_card", name: "NFC门禁卡", quality: "epic", maxDurability: 500 }
     ]
   };
   ```

**预期效果**：
- 装备有明确获取来源（掉落/购买/制作/NPC赠送）
- 玩家有动力参与街头/职场/创业活动以获取装备

**修复成本**：~80行

---

### P1-6: 35岁危机追访链稳定性

**修改点**：
1. **`core/events_core.js`** — 增加追访事件优先级
   ```javascript
   /**
    * 追访事件优先级提升：
    * 1. 在特定天范围内（35岁危机：Day340-370），追访事件权重×3
    * 2. 追访事件独立于RANDOM_EVENTS池，单独抽选
    */
   function rollStreetEvent(state) {
     // 检查是否有追访事件待触发
     var crisisFollowups = getCrisisFollowups(state);
     if (crisisFollowups.length > 0) {
       // 追访事件独立抽选，权重×3
       var followupWeight = 3;
       var totalWeight = followupWeight * crisisFollowups.length + getNormalEventWeight(state);
       var roll = Math.random() * totalWeight;

       if (roll < followupWeight * crisisFollowups.length) {
         // 触发追访事件
         var followup = crisisFollowups[Math.floor(Math.random() * crisisFollowups.length)];
         triggerEvent(followup);
         return true;
       }
     }

     // 正常事件抽选
     // ...
   }
   ```

**预期效果**：
- 35岁危机追访事件在特定天范围内触发率提升至≥80%
- 追访事件不会被其他事件挤掉

**修复成本**：~40行

---

## 三、P2 问题改进方案（6项）

### P2-1: 装备/技能连携UI反馈

**修改点**：
1. **`ui/render.js`** — 新增装备套装Tab
   ```javascript
   // render.js 新增装备套装Tab
   function renderEquipmentSuitesTab(state) {
     var suites = state.equipmentSuites || [];
     if (suites.length === 0) {
       return '<div class="empty-state">暂无装备套装</div>';
     }

     var html = '<div class="equipment-suites-tab">';
     suites.forEach(function (suite) {
       html += '<div class="suite-card">';
       html += '<h4>' + suite.name + '</h4>';
       html += '<div class="suite-items">';
       suite.items.forEach(function (item) {
         html += '<span class="item-badge">' + item.name + '</span>';
       });
       html += '</div>';
       html += '<div class="suite-bonus">';
       html += '<strong>套装效果：</strong>' + suite.bonus;
       html += '</div>';
       html += '</div>';
     });
     html += '</div>';

     return html;
   }
   ```

**预期成本**：~80行

---

### P2-2: main.js 模块化重构

**修改点**：
1. 拆出 `main_events.js`（事件相关函数）
2. 拆出 `main_actions.js`（行动相关函数）
3. 拆出 `main_ui.js`（UI相关函数）

**预期成本**：~200行（分阶段进行）

---

### P2-3: investment.bak.js 清理

**修改点**：
1. **`index.html`** — 移除 `investment.bak.js` script 标签

**预期成本**：1行

---

### P2-4: 道德事件链深度

**修改点**：
1. **`data/moral_events.js`** — 增加极端生存困境事件
   ```javascript
   var moralEvents = [
     // ... 现有事件
     {
       id: "moral_steal_medicine",
       title: "偷药救孩子",
       desc: "孩子病重，需要¥5000的药，但你只有¥500。药店老板不在，你可以偷药。",
       choices: [
         { text: "偷药", consequence: "moral_steal_medicine_steal" },
         { text: "不偷", consequence: "moral_steal_medicine_not" },
         { text: "借钱", consequence: "moral_steal_medicine_borrow" }
       ]
     }
   ];
   ```

**预期成本**：~100行

---

### P2-5: 多周目继承衔接

**修改点**：
1. **`core/inheritance_chain.js`** — 单周目结束时显示"传承潜力评估"
   ```javascript
   function showInheritancePotential(state) {
     var potential = calculateInheritancePotential(state);
     // 显示评估结果：声誉徽章、NPC记忆、技能树保留、现金继承
     // 引导玩家做出有意义的传承币选择
   }
   ```

**预期成本**：~60行

---

### P2-6: 社交网络系统

**修改点**：
1. 新建 `core/social_network.js`（微信朋友圈/微博机制）
2. NPC通过社交网络传递信息
3. "热搜"事件影响世界参数

**预期成本**：~300行

---

## 四、修复验证清单

| 检查项 | 验证方法 | 预期结果 |
|--------|----------|----------|
| 副业系统接入 | 测试 Day>60 后能否在白天上班+晚上摆摊 | 副业Tab可见，疲劳度影响次日KPI |
| 经济平衡 | 创业月入≤¥150K 或 打工P10月薪≥¥100K | 创业与打工吸引力差距≤1.5倍 |
| 后期开支 | 资产¥50W+后每月开支≥¥10K | 维持性开支消耗富余现金 |
| 链式事件填充 | 队列填充率≥60% | 事件链连贯性提升 |
| 新闻→投资UI | 投资Tab展示"今日市场驱动"板块 | 可见新闻→股价因果链 |
| NPC好感事件 | 每个NPC至少2条好感门控事件 | 好感≥30/60/80触发对应事件 |
| 事件奖励缩放 | Day365事件奖励≥¥200 | 奖励与财富等级匹配 |
| 家庭系统 | 结婚/生子/子女教育完整循环 | 家庭开支影响经济 |
| 装备获取 | 装备有明确来源 | 玩家有动力参与活动 |
| 35岁危机追访 | 特定天范围内触发率≥80% | 追访事件不被挤掉 |

---

## 五、开发节奏建议

| 周期 | 任务 | 估时 |
|------|------|------|
| **第1周** | P0-1 副业系统接入 + P0-3 后期开支 | 4h |
| **第2周** | P0-2 经济平衡 + P0-4 链式事件填充 | 4h |
| **第3周** | P1-1 新闻→投资UI + P1-2 NPC好感链路 + P1-3 事件奖励 | 4h |
| **第4周** | P1-4 家庭系统 + P1-5 装备获取 + P1-6 35岁危机 | 6h |
| **第5-6周** | P2问题（装备UI/主文件重构/道德事件/多周目/社交网络） | 10h |

**总计**：~28小时（约3-4周）

---

*方案生成：Hermes Agent | 基于 subagent_result3.md | 版本：v3.7*
