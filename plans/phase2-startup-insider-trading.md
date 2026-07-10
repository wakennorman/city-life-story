# Phase 2: 玩家创业系统 + 内幕交易风险

## Context

企业命运系统 Phase 1 已完成（零和博弈/3个新命运事件/真实合并/行业传导/季度报告）。Phase 2 聚焦玩家与商业世界的深度交互：

1. **玩家创业系统**：玩家不再只是打工/投资，而是可以注册公司、招聘团队、做项目、融资、最终IPO或被收购
2. **内幕交易风险**：玩家就职的公司发生命运事件前，可通过日常行动获知风声→提前调整持仓→但事后有合规审查风险

---

## 一、玩家创业系统

### 1.1 设计概述

**触发条件**：街头阶段 day > 200 且 cash > ¥500,000，或职场阶段 P7+ 且 cash > ¥1,000,000

**三阶段模型**：

| 阶段   | 名称      | 核心玩法                              | 退出方式                             |
| ------ | --------- | ------------------------------------- | ------------------------------------ |
| 种子期 | 从0到1    | 产品开发、找合伙人、申请创业基金/比赛 | 产品上线→进入成长期，或资金耗尽→破产 |
| 成长期 | 从1到10   | 招聘、融资(A轮/B轮)、市场扩张、做项目 | B轮后IPO，或被收购，或资金链断裂     |
| 退出期 | 收获/止损 | IPO上市交易 / 被大企业收购 / 破产清算 | 玩家获得回报（现金/股份/声誉）或归零 |

### 1.2 状态结构（state.js）

```javascript
startup: {
  // 创业状态：'none' | 'preparing' | 'seed' | 'growth' | 'ipo_preparing' | 'exited'
  status: 'none',

  // 公司基本信息
  company: {
    name: null,           // 玩家自定义公司名
    industry: null,       // '科技' | '消费' | '金融' | '医疗' | '教育' | '制造'
    description: '',      // 玩家描述
    foundedDay: null,     // 注册日
    valuation: 0,         // 当前估值
    equity: {             // 股权分配
      player: 100,        // 玩家持股比例
      coFounders: 0,      // 联合创始人
      employees: 0,       // 员工期权池
      investors: 0        // 投资人持股
    },
    phase: 'seed',        // 'seed' | 'growth' | 'ipo'
    fundingRounds: [],    // [{ round: 'seed'|'A'|'B', amount: 0, investors: [], day: 0, postValuation: 0 }]
    products: [],         // [{ id, name, category, developmentProgress: 0-100, launchDay: null }]
    revenue: 0,           // 当前季度收入
    expenses: 0,          // 当前季度支出
    cashReserve: 0,       // 公司现金储备
    burnRate: 0,          // 每月烧钱率
    monthsOfRunway: 0,    // 剩余运营月数
    employees: [],        // [{ id, name, role, salary, productivity, loyalty }]
    reputation: 0,        // 公司声誉 0-100
    technologyScore: 0,   // 技术实力 0-100
    marketScore: 0,       // 市场表现 0-100
  },

  // 创业相关标记
  flags: {
    registered: false,
    firstProductLaunched: false,
    hasInvestors: false,
    ipoFiled: false,
    exited: false,
    exitType: null,       // 'ipo' | 'acquired' | 'bankrupt'
    exitDay: null,
    exitValue: 0,         // 退出时玩家获得的价值
  },

  // 历史记忆（多周目继承）
  history: {
    foundedDay: null,
    exitedDay: null,
    exitType: null,
    exitValue: 0,
    peakValuation: 0,
    totalRevenue: 0,
    employeesHired: 0,
  }
}
```

### 1.3 文件结构

```
src/js/phase2/startup.js          # 创业系统核心引擎（新建）
src/js/core/state.js              # 新增 startup 状态块（修改）
src/js/main.js                    # 新增创业行动入口（修改）
src/js/ui/corp_ui.js              # 创业Tab UI（修改）
src/js/ui/render.js               # 创业状态渲染（修改）
src/js/ui/wiki.js                 # 百科创业章节（已有框架，补充详情）
src/js/data/events.js             # 创业相关随机事件（补充）
```

### 1.4 核心模块设计（startup.js）

#### 1.4.1 公司注册

```javascript
// 注册新公司
function registerStartup(state, name, industry, description) {
  // 检查触发条件
  // 生成公司名（如果玩家没输入）
  // 初始化公司状态
  // 生成联合创始人NPC（1-2个）
  // 设置初始产品（1个MVP）
  // 更新状态
}
```

**联合创始人系统**：

- 从现有NPC池或随机生成
- 每个联合创始人有：技能专长、性格特质、要求持股比例
- 性格特质影响公司命运事件权重（类似企业命运系统的CEO_TRAITS）

#### 1.4.2 产品开发

```javascript
// 创建新产品
function createProduct(state, name, category) {}

// 推进产品开发
function developProduct(state, productId, effort) {
  // effort: 1-3（消耗1-3点行动力/季度）
  // 开发进度 += 智力/10 + coding技能/20 + 团队技术分
  // 进度达100% → 可发布
}

// 发布产品
function launchProduct(state, productId) {
  // 计算市场反响：产品分 = 技术分×0.6 + 市场分×0.4
  // 影响公司估值、收入、声誉
}
```

#### 1.4.3 招聘系统

```javascript
// 招聘员工
function hireEmployee(state, role, salary) {}

// 员工类型
const EMPLOYEE_ROLES = {
  engineer: { baseSalary: 15000, baseProductivity: 1.0, skillFocus: "coding" },
  designer: { baseSalary: 12000, baseProductivity: 0.8, skillFocus: "design" },
  sales: { baseSalary: 10000, baseProductivity: 1.2, skillFocus: "sales" },
  marketing: {
    baseSalary: 12000,
    baseProductivity: 0.9,
    skillFocus: "marketing",
  },
  ops: { baseSalary: 8000, baseProductivity: 0.7, skillFocus: "management" },
};
```

#### 1.4.4 融资系统

```javascript
// 融资轮次
const FUNDING_ROUNDS = {
  seed: {
    minValuation: 500000,
    maxRaise: 500000,
    investorTypes: ["angel", "family_office"],
  },
  A: { minValuation: 3000000, maxRaise: 3000000, investorTypes: ["vc", "cvc"] },
  B: {
    minValuation: 15000000,
    maxRaise: 10000000,
    investorTypes: ["vc", "pe", "cvc"],
  },
  C: {
    minValuation: 50000000,
    maxRaise: 30000000,
    investorTypes: ["pe", "soe"],
  },
};

// 发起融资
function raiseFunding(state, round) {
  // 检查公司是否达标（估值、收入、团队规模）
  // 生成投资人谈判事件
  // 玩家选择条款（估值 vs 股权稀释 vs 对赌协议）
}
```

**投资人谈判**：

- 每个投资人有：投资风格（激进/保守）、行业偏好、附加条件
- 玩家谈判：接受条款 / 拒绝 / 反提议
- 对赌协议：达标则投资人放弃回购权，不达标则玩家需回购股份

#### 1.4.5 季度运营

```javascript
// 每季度公司自动运营
function tickStartup(state) {
  // 1. 收入计算：基于产品数、市场份额、行业景气度
  // 2. 支出计算：工资 + 办公租金 + 营销 + 研发
  // 3. 烧钱率 &  runway 更新
  // 4. 估值漂移：基于营收增长、产品进度、团队变化
  // 5. 随机事件触发（竞品出现/政策变化/团队离职）
  // 6. 破产检测：runway <= 0 且无法融资 → 破产
}
```

#### 1.4.6 退出机制

```javascript
// IPO
function prepareIPO(state) {
  // 检查条件：B轮后、估值>5亿、连续2季度盈利、合规审查通过
  // 提交IPO申请 → 监管审核（随机事件）→ 上市
}

// 被收购
function getAcquisitionOffer(state) {
  // 大企业可能发出收购要约
  // 玩家选择：接受 / 拒绝 / 谈判
}

// 破产清算
function bankrupt(state) {
  // 资产变卖、债务清偿、员工遣散
  // 玩家声誉损失、可能背负个人担保债务
}
```

### 1.5 创业行动（main.js 新增）

```javascript
// 创业阶段可选行动（按阶段显示不同）
const STARTUP_ACTIONS = [
  { id: "develop_product", name: "推进产品开发", apCost: 20, icon: "💻" },
  { id: "hire_employee", name: "招聘员工", apCost: 15, icon: "👥" },
  { id: "meet_investor", name: "见投资人", apCost: 15, icon: "💰" },
  { id: "marketing", name: "市场推广", apCost: 15, icon: "📢" },
  { id: "fundraising", name: "发起融资", apCost: 10, icon: "📈" },
  { id: "ipo_prep", name: "准备IPO", apCost: 20, icon: "🔔" },
  { id: "review_financials", name: "查看财报", apCost: 5, icon: "📊" },
  { id: "manage_team", name: "管理团队", apCost: 10, icon: "🎯" },
];
```

### 1.6 与企业命运系统的联动

- 玩家创业的公司进入 `enterpriseFate.companies`，与其他公司一起漂移
- 玩家公司的命运事件受玩家行为直接影响（不同于NPC公司）
- 行业传导：玩家公司与同板块NPC公司互相影响
- 合并：玩家公司可能被大企业收购，或收购小企业

---

## 二、内幕交易风险

### 2.1 设计概述

**核心逻辑**：

1. 玩家就职的公司发生命运事件前，有"风声期"（事件触发前3-5天）
2. 风声期通过日常行动（工作表现、NPC对话、随机事件）可感知
3. 玩家利用风声调整持仓 → 事件发生后获利
4. 但事后有随机合规审查风险 → 可能被处罚

### 2.2 状态结构（state.js 新增）

```javascript
insiderTrading: {
  // 当前风声
  activeRumor: null,  // { companyId, eventType, estimatedImpact, detectedDay, confidence: 0-100 }

  // 风声历史（用于审查）
  rumorHistory: [],   // [{ companyId, eventType, detectedDay, resolvedDay, playerTraded: bool, profit: 0 }]

  // 玩家持仓记录（用于审查）
  tradeLog: [],       // [{ day, symbol, action: 'buy'|'sell', shares, price, relatedRumorId: null }]

  // 审查记录
  audits: [],         // [{ day, companyId, triggeredBy: 'random'|'complaint'|'pattern',
                       //    findings: [], penalty: 0, bannedDays: 0 }]

  // 当前处罚
  currentPenalty: {
    tradingBanned: false,
    tradingBanEndDay: 0,
    fine: 0,
    reputationDamage: 0,
  }
}
```

### 2.3 核心模块设计

#### 2.3.1 风声感知（enterprise_fate.js 修改）

```javascript
// 在命运事件触发前，先生成"风声"
function generateRumor(state, companyId, eventType) {
  // 事件实际触发前3-5天，生成风声
  // 风声通过以下渠道传播：
  // 1. 工作表现好 → 听到管理层谈话
  // 2. 向上社交 → 获得内幕消息
  // 3. 随机事件 → NPC透露
  // 4. 新闻蛛丝马迹 → 需要玩家解读

  const rumor = {
    id: generateId(),
    companyId,
    eventType,
    detectedDay: state.player.day,
    confidence: 30 + Math.random() * 40, // 初始可信度30-70%
    channels: [], // 通过什么渠道感知
    estimatedImpact: estimateEventImpact(eventType), // 预估影响幅度
    resolvedDay: null,
    playerTraded: false,
    playerProfit: 0,
  };

  state.insiderTrading.activeRumor = rumor;
  state.insiderTrading.rumorHistory.push(rumor);
}

// 风声可信度提升
function updateRumorConfidence(state, rumorId, newInfo) {
  // 每获得一条新信息，可信度+10~20
  // 如果事件最终发生，可信度→100%
  // 如果事件未发生（误报），可信度→0%
}
```

#### 2.3.2 风声传播渠道

| 渠道         | 触发条件              | 可信度增量 | 频率        |
| ------------ | --------------------- | ---------- | ----------- |
| 工作表现     | 当日KPI>80 或 能力>70 | +10~15     | 每日        |
| 向上社交行动 | 职场行动"向上社交"    | +15~25     | 每季度限2次 |
| NPC对话      | 特定NPC好感度高       | +10~20     | 随机        |
| 新闻蛛丝马迹 | L1/L2新闻含关键词     | +5~10      | 随机        |
| 行业报告     | 消费"看手机-行业报告" | +5~8       | 每周限1次   |

#### 2.3.3 合规审查（investment.js 修改）

```javascript
// 每季度末进行合规审查
function auditInsiderTrading(state) {
  // 检查条件：
  // 1. 玩家在风声期+事件发生窗口内交易了相关股票
  // 2. 交易模式异常（短时间内大量买入/卖出）
  // 3. 获利超过阈值（>¥50,000）

  for (const rumor of state.insiderTrading.rumorHistory) {
    if (rumor.resolvedDay) continue; // 已处理

    const eventDay = rumor.resolvedDay || rumor.detectedDay + random(3, 5);
    const tradeWindow = [rumor.detectedDay, eventDay];

    // 检查交易记录
    const suspiciousTrades = state.insiderTrading.tradeLog.filter(
      (t) =>
        t.day >= tradeWindow[0] &&
        t.day <= tradeWindow[1] &&
        t.relatedRumorId === rumor.id,
    );

    if (suspiciousTrades.length > 0) {
      const profit = calculateProfit(suspiciousTrades);
      const auditResult = {
        day: state.player.day,
        companyId: rumor.companyId,
        findings: suspiciousTrades,
        profit,
        penalty: 0,
        bannedDays: 0,
      };

      // 判定概率：基于获利金额和交易频率
      const auditProb = 0.1 + Math.min(0.6, profit / 500000);
      if (Math.random() < auditProb) {
        // 触发处罚
        auditResult.penalty = profit * (1 + Math.random()); // 罚款=获利×1~2倍
        auditResult.bannedDays = 30 + Math.floor(Math.random() * 60); // 交易禁入30-90天
        applyPenalty(state, auditResult);
      }

      state.insiderTrading.audits.push(auditResult);
    }

    rumor.resolvedDay = state.player.day;
  }
}

function applyPenalty(state, auditResult) {
  state.insiderTrading.currentPenalty.tradingBanned = true;
  state.insiderTrading.currentPenalty.tradingBanEndDay =
    state.player.day + auditResult.bannedDays;
  state.insiderTrading.currentPenalty.fine = auditResult.penalty;
  state.insiderTrading.currentPenalty.reputationDamage =
    10 + Math.floor(Math.random() * 20);

  // 扣钱
  state.resources.cash = Math.max(
    0,
    state.resources.cash - auditResult.penalty,
  );

  // 通知玩家
  StateManager.addMessage(
    `⚖️ 合规审查：你因内幕交易被处罚 ¥${Math.round(auditResult.penalty)}，交易禁入 ${auditResult.bannedDays} 天`,
    "danger",
  );
}
```

#### 2.3.4 风声与事件的绑定

在 `enterprise_fate.js` 的 `rollFateEvent` 中：

```javascript
// 修改 rollFateEvent：先生成风声，再实际触发
function rollFateEvent(state) {
  // ... 原有逻辑找到要触发的事件 ...

  // Phase 2：先发布风声（3-5天后才实际触发）
  const rumorDelay = 3 + Math.floor(Math.random() * 3);  // 3-5天
  const pendingEvent = {
    companyId: cid,
    event: picked,
    triggerDay: state.player.day + rumorDelay,
    rumorId: generateRumor(state, cid, picked.id),
  };

  // 存入待触发队列
  if (!state.enterpriseFate.pendingEvents) {
    state.enterpriseFate.pendingEvents = [];
  }
  state.enterpriseFate.pendingEvents.push(pendingEvent);

  // 返回风声消息给玩家
  return { isRumor: true, ... };
}

// 每日结算时检查是否有 pending event 到期
function tickPendingEvents(state) {
  if (!state.enterpriseFate.pendingEvents) return;

  state.enterpriseFate.pendingEvents = state.enterpriseFate.pendingEvents.filter(event => {
    if (state.player.day >= event.triggerDay) {
      // 触发实际事件
      applyFateEvent(event.event, event.companyId, state);
      // 更新风声可信度为100%（事件确实发生了）
      updateRumorConfidenceToConfirmed(state, event.rumorId);
      return false;  // 移除
    }
    return true;  // 保留
  });
}
```

---

## 三、文件修改清单

### 3.1 新建文件

| 文件                       | 内容             | 预估行数 |
| -------------------------- | ---------------- | -------- |
| `src/js/phase2/startup.js` | 创业系统完整引擎 | ~800行   |

### 3.2 修改文件

| 文件                             | 改动                                                       | 优先级 |
| -------------------------------- | ---------------------------------------------------------- | ------ |
| `src/js/core/state.js`           | 新增 `startup` 和 `insiderTrading` 状态块 + v1.4→v1.5 迁移 | P0     |
| `src/js/phase2/investment.js`    | 内幕交易审查逻辑 + 交易日志记录                            | P0     |
| `src/js/core/enterprise_fate.js` | 风声生成 + pendingEvents 队列 + 风声可信度更新             | P0     |
| `src/js/main.js`                 | 创业行动入口 + 创业Tab切换                                 | P0     |
| `src/js/ui/corp_ui.js`           | 创业Tab UI + 公司详情面板                                  | P1     |
| `src/js/ui/render.js`            | 创业状态侧边栏渲染                                         | P1     |
| `src/js/ui/wiki.js`              | 创业系统详情 + 内幕交易章节                                | P1     |
| `src/js/data/events.js`          | 创业相关随机事件（融资谈判/团队离职/竞品出现等）           | P2     |
| `src/js/data/corp.js`            | CEO特质正式启用 + 创业触发条件                             | P2     |

### 3.3 加载顺序（index.html）

```html
<!-- 创业系统加载顺序 -->
<script src="js/phase2/startup.js"></script>
<!-- investment.js 需在 stock.js 之后 -->
<script src="js/phase2/stock.js"></script>
<script src="js/phase2/investment.js"></script>
<!-- enterprise_fate.js 需在 state.js 之后 -->
<script src="js/core/enterprise_fate.js"></script>
```

---

## 四、实现步骤

### Step 1: 状态层（state.js）

- [ ] 新增 `startup` 状态块
- [ ] 新增 `insiderTrading` 状态块
- [ ] 新增 v1.4→v1.5 存档迁移逻辑

### Step 2: 创业核心引擎（startup.js）

- [ ] 公司注册 `registerStartup()`
- [ ] 产品开发 `createProduct()` / `developProduct()` / `launchProduct()`
- [ ] 招聘系统 `hireEmployee()` / `fireEmployee()`
- [ ] 融资系统 `raiseFunding()` + 投资人谈判
- [ ] 季度运营 `tickStartup()`
- [ ] 退出机制 `prepareIPO()` / `getAcquisitionOffer()` / `bankrupt()`
- [ ] 联合创始人系统

### Step 3: 内幕交易核心（enterprise_fate.js + investment.js）

- [ ] 风声生成 `generateRumor()`
- [ ] Pending events 队列 + 到期触发
- [ ] 风声可信度更新
- [ ] 交易日志记录
- [ ] 合规审查 `auditInsiderTrading()`
- [ ] 处罚应用 `applyPenalty()`

### Step 4: UI层

- [ ] main.js 创业行动入口
- [ ] corp_ui.js 创业Tab渲染
- [ ] render.js 创业状态侧边栏
- [ ] wiki.js 百科详情

### Step 5: 事件与联动

- [ ] events.js 创业随机事件
- [ ] 企业命运联动（玩家公司进入命运系统）
- [ ] 多周目记忆（创业历史继承）

### Step 6: 测试与验证

- [ ] 语法检查（node --check）
- [ ] 构建验证（python build.py）
- [ ] 功能测试（新游戏→创业→完整流程）
- [ ] 存档兼容性测试

---

## 五、验证标准

### 创业系统

1. 满足条件后可在商业区选择"注册公司"
2. 输入公司名、行业、描述后公司创建成功
3. 创业Tab显示公司状态（估值、团队、产品、财务）
4. 可执行：开发产品、招聘、见投资人、融资、市场推广
5. 产品可开发→发布→产生收入
6. 融资轮次可推进（seed→A→B）
7. 季度运营自动计算收支
8. 退出方式可触发：IPO上市/被收购/破产
9. 退出后返回职场/街头，获得相应回报

### 内幕交易

1. 就职公司命运事件触发前3-5天，有风声提示
2. 风声可信度可通过多种渠道提升
3. 风声期交易相关股票可获利
4. 季末合规审查可能触发
5. 审查触发后：罚款 + 交易禁入
6. 处罚期间无法进行股票交易

---

## 六、设计决策

### 6.1 创业阶段行动力设计

创业阶段与职场阶段并行（不替换职场），玩家可同时打工+创业：

- 职场行动：每季度N次（按职级）
- 创业行动：每日可用（消耗AP）
- 平衡：创业行动AP消耗较高（15-20AP），防止同时双线最优

### 6.2 内幕交易风声不直接告诉玩家

风声是"模糊信息"：

- 不直接说"公司明天要发利好"
- 而是"听说公司在谈一个大项目，但不确定真假"
- 玩家需通过多渠道验证可信度
- 这模拟了真实世界的信息不对称

### 6.3 创业公司进入企业命运系统

玩家创业的公司与NPC公司同等对待：

- 同样参与零和博弈市场份额
- 同样受行业传导影响
- 同样可能合并/被收购/倒闭
- 但玩家公司的命运事件受玩家行为直接影响

---

## 七、参考数据

### 创业数值参考

| 项目               | 数值                                |
| ------------------ | ----------------------------------- |
| 注册启动资金       | ¥50,000（玩家自有资金）             |
| 种子轮融资         | ¥300,000~500,000（出让10-20%）      |
| A轮融资            | ¥2,000,000~3,000,000（出让15-25%）  |
| B轮融资            | ¥8,000,000~10,000,000（出让10-20%） |
| IPO估值门槛        | ≥¥500,000,000                       |
| 员工月薪（工程师） | ¥15,000~30,000                      |
| 办公租金           | ¥5,000~20,000/月（按团队规模）      |
| 产品月均收入       | ¥50,000~500,000（按产品分）         |

### 内幕交易处罚参考

| 获利金额         | 罚款倍数 | 禁入天数      |
| ---------------- | -------- | ------------- |
| <¥50,000         | 1x       | 30            |
| ¥50,000~200,000  | 1.5x     | 60            |
| ¥200,000~500,000 | 2x       | 90            |
| >¥500,000        | 3x       | 180 + 声誉-30 |
