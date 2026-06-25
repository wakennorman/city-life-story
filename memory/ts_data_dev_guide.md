# 城市浮生记 — TypeScript 数据目录开发指南

> 适用于 v3.8+ 桥接式 Web App 架构
> 最后更新：2026-06-25

---

## 一、架构概览

```
你写的数据               桥接层                      玩家看到的
───────────────   ────────────────────   ──────────────────────────
src/app/data/      webapp_runtime_bridge.js    旧游戏 actions + UI
  ├── events/      (window 全局函数)
  ├── jobs/               │
  ├── locations/          │ (调用 StateManager / showModal / renderAll)
  ├── items/              v
  ├── diseases/    actions_extra.js    → 注入行动列表
  ├── legal/        daily_pipeline.js  → 每日后续反馈
  ├── travel/
  └── lifeNodes/
```

**核心原则**：数据写在 TypeScript 里，桥接注册在 legacy JS 里，玩家在旧游戏中触发。

---

## 二、各目录标准数据格式

### 2.1 事件 (events/)

```typescript
// src/app/data/events/index.ts
export interface GameEvent {
  id: string; // 唯一 ID，如 "street_robbery"
  name: string; // 显示名称
  icon: string; // 图标 emoji
  description: string; // 事件描述
  trigger: {
    type: "random" | "chain" | "timed" | "location";
    dayMin: number; // 最早触发天数
    dayMax?: number; // 最晚触发天数
    weight: number; // 权重（相对概率）
    prerequisites?: string[]; // 前置条件（flag 或布尔表达式）
    location?: string; // 触发地点（location 类型时）
  };
  choices: Array<{
    id: string;
    text: string;
    hint: string;
    effects: Array<{
      target: string; // 状态路径，如 "player.health"
      op: "add" | "set" | "mul";
      value: number;
    }>;
    requirement?: { field: string; min?: number; max?: number };
  }>;
  narrativeBefore: string;
  narrativeAfter: (choiceId: string) => string;
  followUp?: string; // 可选的链式事件 ID
  tags: string[]; // 分类标签，如 ["crime", "street", "daytime"]
}

export const EVENTS: GameEvent[] = [
  // ...在这里添加事件
];
```

参考范例：`src/app/data/lifeNodes/index.ts`（数据结构类似）

### 2.2 职业 (jobs/)

```typescript
// src/app/data/jobs/index.ts
export interface Job {
  id: string;
  name: string;
  icon: string;
  category: "street" | "corporate" | "freelance" | "public";
  requirements: Array<{ field: string; min?: number }>;
  baseSalary: number;
  salaryGrowth: number; // 每级涨幅
  maxLevel: number;
  skills: string[]; // 关联技能
  stressPerDay: number; // 日常压力
  description: string;
  unlockDescription: string; // 解锁条件文案
  events?: string[]; // 关联事件 ID（引用 events/）
}

export const JOBS: Job[] = [
  // ...
];
```

### 2.3 地点 (locations/)

```typescript
// src/app/data/locations/index.ts
export interface Location {
  id: string;
  name: string;
  icon: string;
  category: "work" | "life" | "gov" | "entertainment" | "service";
  description: string;
  requires?: string[]; // 解锁条件
  availableActions: Array<{
    id: string; // 关联的行动 ID
    name: string;
    apCost: number;
    minDay?: number;
  }>;
  services?: string[]; // 关联的城市服务 ID
  npcs?: string[]; // 关联的 NPC ID
}

export const LOCATIONS: Location[] = [
  // ...
];
```

### 2.4 物品 (items/)

```typescript
// src/app/data/items/index.ts
export interface Item {
  id: string;
  name: string;
  icon: string;
  category: "tool" | "consumable" | "equipment" | "souvenir" | "special";
  description: string;
  value: number; // 基础价值
  rarity: "common" | "uncommon" | "rare" | "legendary";
  obtainFrom: string[]; // 获取途径说明
  useEffect?: Array<{ target: string; op: string; value: number }>;
  durability?: number;
  wikiEntry: string; // 百科展示字段
  tags: string[];
}

export const ITEMS: Item[] = [
  // ...
];
```

### 2.5 疾病 (diseases/)

```typescript
// src/app/data/diseases/index.ts
export interface Disease {
  id: string;
  name: string;
  icon: string;
  severity: "minor" | "moderate" | "severe" | "critical";
  triggerConditions: {
    healthBelow?: number;
    season?: string;
    exposure?: string; // 暴露途径
    probability: number;
  };
  symptoms: string[]; // 症状描述
  treatment: {
    type: "rest" | "medicine" | "surgery";
    cost: number;
    duration: number; // 治疗天数
    effectPerDay: number; // 每天恢复量
  };
  insuranceCoverage: number; // 医保比例 0-1
  complications?: string[]; // 并发症疾病 ID
}

export const DISEASES: Disease[] = [
  // ...
];
```

### 2.6 法律 (legal/)

```typescript
// src/app/data/legal/index.ts
export interface LegalCase {
  id: string;
  name: string;
  icon: string;
  category: "labor" | "civil" | "criminal" | "administrative";
  triggerCondition: string; // 触发条件描述
  stages: Array<{
    name: string; // "立案" | "证据" | "审理" | "判决"
    duration: number;
    actions: string[]; // 可采取的行动
  }>;
  outcomes: Array<{
    condition: string; // 判决条件
    result: string; // 结果描述
    effects: Array<{ target: string; op: string; value: number }>;
    fine?: number;
    jailDays?: number;
  }>;
  lawyerDifficulty: number; // 1-10
  defaultJudgment: string; // 默认判决
}

export const LEGAL_CASES: LegalCase[] = [
  // ...
];
```

### 2.7 旅行 (travel/)

```typescript
// src/app/data/travel/index.ts
export interface TravelDestination {
  id: string;
  name: string;
  icon: string;
  region: string; // 区域分类
  cost: number;
  duration: number; // 旅行天数
  apCost: number;
  requirements: Array<{ field: string; min?: number }>;
  events: string[]; // 旅行中可能触发的事件
  souvenirs: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  effects: Array<{
    target: string;
    op: "add" | "set" | "mul";
    value: number;
  }>;
  description: string;
}

export const TRAVEL_DESTINATIONS: TravelDestination[] = [
  // ...
];
```

### 2.8 人生节点 (lifeNodes/) ✅ 已填充

已有完整类型和 4 个节点数据（高考/大学/35岁危机/退休），参考 `src/app/data/lifeNodes/index.ts`。新增节点直接追加到 `LIFE_NODES` 数组。

---

## 三、完善现有内容（不改架构，只改进已有内容）

> 适用场景：调数值平衡、修 bug、改文案、优化现有事件/职业/物品逻辑。
> **不改目录结构、不新建文件、不迁移旧数据到 TS**，只在现存代码上做改进。

### 3.1 先判断：该走哪条路？

```
当前游戏有什么需要改？
│
├─ 平衡性（经济/技能/事件触发率/支出收入比）
├─ Bug 修复（事件不触发/UI 显示错误/存档异常）
├─ 文本打磨（事件文案不通顺/NPC 对话生硬/UI 提示不清）
├─ 现有功能优化（流程不合理/触发条件错误/反馈展示不够）
│   └─ → 走【完善路线】，直接改旧文件
│
├─ 新增一种新事件/新职业/新物品/新疾病/新法律案件
│   └─ → 走【新增路线 → 进 src/app/data/ TS 目录】
│
├─ 已有事件/职业/物品内容太少，要扩充数量（不改机制只加内容）
│   └─ → 看情况：
│        ├─ 时间紧、改动小 → 在旧文件中追加（完善路线）
│        └─ 有充足时间、想规范化 → 迁移到 TS 目录（新增路线）
│
└─ 不确定 → 先走【完善路线】做小改动，
              同时把数据迁移到 TS 目录作为单独的下一步计划
```

### 3.2 定位：问题在哪个文件？

完善现有内容的第一步：**找到要改的文件在哪**。

| 你想改什么        | 大概率在哪个文件                                            | 文件大小 |
| ----------------- | ----------------------------------------------------------- | -------- |
| 随机事件内容/权重 | `src/js/core/events_street.js`                              | 超大     |
| 公司事件/晋升事件 | `src/js/core/events_corp.js`                                | 大       |
| 道德事件内容      | `src/js/data/moral_events.js`                               | 中       |
| 事件触发管线      | `src/js/core/events_core.js`                                | 中       |
| 街头发起式事件    | `src/js/data/events_street_data.js`                         | 中       |
| 职业薪资/等级     | `src/js/data/jobs.js`                                       | 小       |
| 物品/商品数据     | `src/js/data/items.js` + `goods.js`                         | 中       |
| 地点数据          | `src/js/data/locations.js`                                  | 小       |
| 疾病数据          | `src/js/data/illnesses.js`                                  | 小       |
| 法律系统          | `src/js/core/legal.js`                                      | 小       |
| 医疗系统          | `src/js/core/medical.js`                                    | 小       |
| 旅行系统          | `src/js/core/travel.js`                                     | 中       |
| NPC 数据/好感     | `src/js/data/npcs.js` + `src/js/phase1/npc_event_bridge.js` | 中       |
| 经济数值/创业     | `src/js/phase2/startup.js`                                  | 大       |
| 投资/股票         | `src/js/ui/investment.js`                                   | 中       |
| 每日管线          | `src/js/phase1/daily_pipeline.js`                           | 大       |
| 行动列表生成      | `src/js/core/main.js`（getAvailableActions 部分）           | 超大     |
| 主 UI 渲染        | `src/js/ui/render.js`                                       | 超大     |
| 状态对象/存档     | `src/js/core/state.js` + `save.js`                          | 中       |
| 城市服务 bridge   | `src/js/app_bridge/webapp_runtime_bridge.js`                | 大       |
| TS 数据目录       | `src/app/data/*/index.ts`                                   | 极小     |

> **技巧**：不确定文件在哪？用 `grep -rn "要找的关键词" src/js/` 搜索。

### 3.3 改前准备

改任何文件前，先看它的结构和风格：

```
# 读文件头 30-50 行了解模块职责
# 读相关函数/数据块确认修改点
```

### 3.4 修改 → 验证循环

```
改完一个功能点
    │
    ├─ 只改了旧 JS →   npm run check:js
    │                       │
    │                  python build.py
    │                       │
    │                  打开游戏确认效果
    │
    ├─ 改了旧 JS + TS →  npm run typecheck
    │                       │
    │                  npm run check:js
    │                       │
    │                  npm run build + python build.py
    │                       │
    │                  打开游戏确认效果
    │
    └─ 只改了 TS →    npm run typecheck
                          │
                     npm run build
                          │
                     打开 Vite shell 或旧游戏确认
```

**验证原则（按优先级）**：

1. **语法通过** — typecheck / check:js 不能报错（这是底线）
2. **构建通过** — build.py / npm run build 不能报错
3. **手动冒烟** — 开游戏，走一遍涉及的功能流程，确认改对了
4. **边界检查** — 改数值时确认不会溢出（如 cash 不能负、AP 不能超上限）

### 3.5 提交规范

```
git add 涉及的文件
git commit -m "fix(系统名): 具体改了啥"

# 例子：
# fix(economy): 压缩后期摆摊收入，上限从 ¥5000 降为 ¥800
# fix(events): 修复邻居纠纷事件的触发位置错误
# fix(ui): 优化城市服务弹窗的按钮排列
```

**一个功能点一个 commit**，不要攒一堆不同类的修改放在一个 commit 里。

### 3.6 完善 vs 迁移的决策时机

当你在完善的过程中发现：

- 某个模块的旧数据量已经很大（>200行连续数据）
- 你想加很多新内容到这个模块
- 旧数据的结构已经不统一（同一个字段在不同位置格式不同）

→ **考虑把它迁移到 `src/app/data/` 目录**，但**不要一次全迁**。
做法：新建对应的 TS 目录，copy-on-write，旧数据保持原样，
新内容走 TS 目录，bridge 接入。

详见第 2 节各目录的标准数据格式。

---

## 四、完整开发流程（写新数据 → 接入游戏）

以**新增一个事件**为例，走完全流程：

### 步骤 1：在 TS 目录写数据

```typescript
// src/app/data/events/index.ts
export const EVENTS: GameEvent[] = [
  {
    id: "neighbor_dispute",
    name: "邻居纠纷",
    icon: "🏢",
    description: "楼上邻居深夜聚会，噪音扰民。",
    trigger: { type: "random", dayMin: 10, dayMax: 365, weight: 15 },
    choices: [
      {
        id: "complain",
        text: "上门理论",
        hint: "魅力-2，可能和解也可能激化",
        effects: [
          { target: "player.charm", op: "add", value: -2 },
          { target: "needs.happiness", op: "add", value: -5 },
        ],
      },
      {
        id: "call_police",
        text: "报警",
        hint: "解决问题但社会关系受损",
        effects: [
          { target: "player.fame", op: "add", value: -1 },
          { target: "needs.happiness", op: "add", value: 3 },
        ],
      },
      {
        id: "ignore",
        text: "忍了",
        hint: "心情持续受影响",
        effects: [
          { target: "needs.happiness", op: "add", value: -10 },
          { target: "player.mental", op: "add", value: -2 },
        ],
      },
    ],
    narrativeBefore: "已经快 12 点了，楼上的音乐声和笑声让你无法入睡。",
    narrativeAfter: (choiceId) =>
      ({
        complain: "你敲开了邻居的门，对方态度恶劣。你后悔自己太冲动。",
        call_police: "民警来了之后调解了纠纷。邻居以后应该会注意。",
        ignore: "你戴上耳机，翻了个身。这个世界不太安静。",
      })[choiceId] || "这件事就这么过去了。",
    tags: ["life", "neighborhood", "random"],
  },
];
```

### 步骤 2：验证 TypeScript

```bash
npm run typecheck
```

### 步骤 3：注册 bridge（接入旧游戏）

打开 `src/js/app_bridge/webapp_runtime_bridge.js`：

**(a) 在 `applyCityService()` 函数中添加事件触发逻辑（如需直接修改状态）**

```javascript
// 在 applyCityService 的 if-else 链中新增
} else if (action.id === "neighbor_dispute") {
  // ...实际状态变化逻辑
}
```

**(b) 如果要注入到行动列表，在 `addWebAppBridgeActions()` 中添加**

```javascript
actions.push({
  id: "neighbor_dispute",
  name: "邻居纠纷",
  desc: "处理邻里关系问题",
  icon: "🏢",
  category: "生活",
  apCost: 3,
  handler: function () {
    /* ... */
  },
});
```

> **或者**：如果新数据是通过 modal 选择触发的（像城市服务中心那样），只需在 `showCityServiceModal()` 式的函数中引用数据即可。

### 步骤 4：注册到行动注入点

打开 `src/js/phase1/actions_extra.js`：

```javascript
// 在 action 生成函数中调用 bridge
if (typeof addWebAppBridgeActions === "function") {
  addWebAppBridgeActions(state, actions);
}
```

（如果是在已有的事件触发管线中，可能需要改 `events_core.js` 中的触发逻辑）

### 步骤 5：注册每日后续（可选）

如果新内容有「第二天产生后续效果」：

打开 `src/js/phase1/daily_pipeline.js`，在 `DAILY_PIPELINE` 数组末尾追加：

```javascript
{
  name: "my_new_system_tick",
  fn: function (state) {
    if (typeof WebAppBridge !== "undefined" && WebAppBridge) {
      WebAppBridge.myNewTick(state);
    }
  },
},
```

### 步骤 6：注册脚本加载

打开 `src/index.html`，在**末尾**（最后一个 `<script>` 之后）追加：

```html
<script src="js/app_bridge/webapp_runtime_bridge.js"></script>
```

⚠️ **禁止**：重排或删除已有 `<script>` 标签顺序。

### 步骤 7：全量验证

```bash
npm run typecheck      # TS 类型检查，必须通过
npm run check:js       # legacy JS 语法检查，必须通过
npm run build          # Vite 构建到 dist-webapp/
python build.py        # 旧构建到 dist/index.html，必须通过
```

### 步骤 8：提交

```bash
git add -A
git commit -m "feat(data): 新增邻居纠纷事件（TS 目录 + bridge 注册）"
```

---

## 五、已有例子的对照

| 你想做什么                    | 参考文件                                                          | 类型                  | 行数      |
| ----------------------------- | ----------------------------------------------------------------- | --------------------- | --------- |
| 写配置化数据 + 对接旧行动列表 | `src/app/data/cityServices.ts` + bridge 中的 `applyCityService()` | 完整范例              | 187 + 510 |
| 写带选择的人生节点            | `src/app/data/lifeNodes/index.ts`                                 | 纯数据（无需 bridge） | 271       |
| 写桥接脚本注入旧游戏          | `src/js/app_bridge/webapp_runtime_bridge.js`                      | 纯 JS bridge          | 510       |
| 通过 modal 展示给玩家         | `showCityServiceModal()` 函数                                     | bridge 中实现         | ~46       |
| 在 action 列表注入入口        | `actions_extra.js` 中的 `addWebAppBridgeActions` 调用             | 单行调用              | 1         |
| 每日后续反馈                  | `daily_pipeline.js` 中的 `webapp_city_services_tick`              | 单行注册              | 12        |
| 在 Vite 调试面板展示          | `src/app/ui/panels.ts` 的 `renderCityServicesPanel`               | 调试面板              | 53        |
| 完善现有数值/文案/bug         | 见第 3 节"完善现有内容"                                           | 完整工作流            | —         |

---

## 六、注意事项（陷阱清单）

### ❌ 不要做的事

1. **不要重排 `src/index.html` 的已有 script 顺序** — 只允许末尾追加
2. **不要移动旧数据文件** — 旧 `events_street.js`、`jobs.js`、`items.js` 等继续承载现有内容，TS 目录只接管**新内容**
3. **不要删除 `python build.py`** — 正式构建入口在可预见的未来仍是它
4. **不要引入 npm 运行时依赖** — 新系统继续零第三方依赖（Vite/TypeScript 只是开发工具）

### ✅ 应该做的事

1. **新增内容 → 默认走 `src/app/data/` TS 目录**，除非时间紧或改动极少
2. **写数据时带上 `tags`** — 方便后续按标签筛选和检索
3. **每写完一个目录就更新 `IMPLEMENTATION_PROGRESS.md`**
4. **新增 bridge 功能后更新 `memory/webapp_migration_overview.md`**
5. **每个功能点一个 commit**，不要攒一大坨一起提交

### 🛠️ 验证命令速查

```bash
npm run typecheck         # TS 类型检查
npm run check:js          # legacy JS 语法检查（对所有 src/js/**/*.js 跑 node --check）
npm run build             # Vite 构建（输出到 dist-webapp/）
python build.py           # 旧构建（输出到 dist/index.html）
```

---

## 七、还有几步迁移到完全 Web App？

参考 `memory/webapp_architecture_plan.md` 的 5 阶段：

| 阶段                             | 状态          | 说明                                                   |
| -------------------------------- | ------------- | ------------------------------------------------------ |
| **阶段 1：桥接式 Web App 化**    | ✅ **已完成** | Vite/TS 工程 + bridge + 城市服务验证                   |
| **阶段 2：稳定服务层**           | ⬜ 未开始     | 封装 StateManager 访问、消息、AP、现金为服务           |
| **阶段 3：数据目录接管新增内容** | ⬜ 部分开始   | lifeNodes ✅ / cityServices ✅ / 其余 7 个目录等待填充 |
| **阶段 4：UI 面板渐进组件化**    | ⬜ 未开始     | 先迁移医疗/法律/旅行等独立面板                         |
| **阶段 5：正式入口切换评估**     | ⬜ 未开始     | 当 src/app 能承载核心流程后评估                        |

当前最该做的就是**阶段 3**：把 `events/`、`jobs/`、`locations/`、`items/`、`diseases/`、`legal/`、`travel/` 填起来。
