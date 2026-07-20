# 城市浮生记 · 团队代码质量标准与评审清单

> 维护者：资深开发工程师（Senior Developer）
> 目的：把"代码质量把控"从口头要求变成**可执行的门禁 + 可复用的评审清单 + 可落地的团队成长节奏**。
> 适用范围：`src/js`（运行时 vanilla JS）、`src/app`（TypeScript webapp）、`tests/`、`build.py`。
> 设计原则：**增量采纳（incremental adoption）**——先建门禁、不阻断现有优化循环；新代码从严，旧代码逐步收敛。

---

## 0. 为什么需要这份文档

团队技术能力提升，不靠"写更多代码"，而靠三件事：

1. **统一标准** —— 每个人对"好代码"的判断一致，review 不靠感觉。
2. **自动门禁** —— 机器拦住低级错误，人只审业务逻辑与设计。
3. **反馈闭环** —— 每次提交都是一次学习机会（评审 + 反例 + 正例）。

本仓库现状（已实测，2026-07-20）：

| 维度 | 实测数据 | 结论 |
|---|---|---|
| ESLint | 配置存在但 `rules: {}`，`eslint:recommended` 被注释；eslint 甚至未安装 | 唯一的质量门禁是**空转**的 |
| 变量声明风格 | `var` 9934 处 / `let` 244 / `const` 2717（~78% 仍用 `var`） | 团队未建立 ES6 作用域习惯，是教学首要靶点 |
| 全局耦合 | 508 处 `window.*`、288 个加载序敏感全局 | 启动脆弱、不可单测、易合并冲突 |
| 巨型文件 | `news_system.js`≈985KB、`render.js`≈242KB、`cross_system_events*.js` 机械拆分 | 不可维护、知识孤岛、SOP 已记录并行编辑"撞车"风险 |
| 测试 | 仅事件完整性 + 冒烟模拟；核心逻辑（finance/state/save）**无单测** | 没有安全网 → 不敢重构 → 技术债滚雪球 |
| 双代码库 | `src/js`（vanilla）与 `src/app`（TS strict）并存 | 团队对"哪份是真相"认知混乱，缺迁移路线 |

**结论**：问题不在"人不行"，而在于**缺少工具与标准**。补上这两样，团队水平会自然抬升。

---

## 1. 代码质量标准（落地版）

以下标准**新代码立即执行**；旧代码按第 3 节节奏渐进。

### 1.1 语言与语法
- **禁止 `var`**。一律 `const` / `let`（ESLint `no-var`）。能用 `const` 就用 `const`（`prefer-const`）。
- **全等比较**：`===` / `!==`，不用 `==`（`eqeqeq`）。
- **块级作用域必带花括号**：`if/for/while` 主体即使一行也加 `{}`（`curly`），避免 dangling-else 事故。
- **禁止 `debugger`**；`console.log` 仅限调试且提交前清理（`no-console` 设为 warn）。

### 1.2 模块化与全局
- **新模块用 ES Module**（`import`/`export`），不再往 `window` 上挂新全局。
- 旧的 `window.X` 全局**冻结**：不新增、不改名、不删除（避免破坏加载序）；迁移通过"新模块 import 旧全局"单向依赖完成。
- **单一职责**：单文件 > 400 行即触发重构评审（见第 4 节）。

### 1.3 健壮性与自洽
- **所有跨模块字段访问先核对 `state.js` 的真实结构**（这是本项目最常见的崩溃源，见 SOP 自洽守卫惯例）。
- **数值入 DOM 前防 `NaN`/`undefined`**（参考 `main.js::setStatBar` 的写法）。
- 事件 `conditions` 必须守卫 `rel && rel.met && (rel.affinity||0) >= N`，职业须查 `employment.currentJob` / `sideHustle.type`。
- 引用不存在的 NPC id（`xiaoli`/`auntie_lin` 等未激活项）→ 永不触发，提交前用 `grep` 核对。

### 1.4 命名与可读性
- 函数/变量 **camelCase**；常量/配置 **UPPER_SNAKE**；事件 id 语义化（`corp_reputation_headhunt` 风格）。
- 魔法数字提取为具名常量（如 `MAX_DAILY_AP = 100`）。
- 复杂分支用**数据驱动**替代硬编码 if-else 链（✅ 正例：`main.js::getNpcContextDialogue` 用 `contextDialogue[].condition` 数组替代长 if-else）。

### 1.5 注释与提交
- 注释解释 **why**，不翻译 what。崩溃修复加 `// [全系统自洽修复] 域X 修复:…`（沿用现有约定）。
- 提交信息遵循现有格式：`fix: [域X] A类缺陷修复(N项)+联动增强(M项) — 简述`。

---

## 2. 代码评审清单（PR 门禁 / Definition of Done）

每个 PR 必须满足（自检 + 评审人勾选）：

**A. 正确性**
- [ ] 没有引入不存在的字段 / NPC id / 全局（已 `grep` 核对 `state.js`）
- [ ] 数值写入 DOM 前做 `NaN`/`undefined` 防御
- [ ] 事件条件守卫完整（关系 / 职业 / 阶段）
- [ ] 未改变 `src/index.html` 的脚本加载顺序

**B. 风格（机器已拦，人只需确认无新增 error 级告警）**
- [ ] 无新增 `var`（`no-var`）
- [ ] 无 `==`（`eqeqeq`）
- [ ] 无 `debugger`；`console.log` 已清理或必要
- [ ] 新文件 ≤ 300 行；改动单次 ≤ 20 行（遵循 v3.0 SOP）

**C. 安全与性能**
- [ ] 未引入运行时外部库 / CDN（SOP 硬约束）
- [ ] 未改 `build.py` 核心逻辑
- [ ] 长循环无同步阻塞；动画 60fps 意识

**D. 测试**
- [ ] 改了核心逻辑（finance/state/save）→ 补/改对应单测
- [ ] `npm test`（JS 语法 + 事件完整性）通过
- [ ] `npm run typecheck`（TS 侧）通过

**E. 评审文化**
- [ ] 至少 1 名评审人；评审意见分"必须改 / 建议改"
- [ ] 每轮优化/重构附带一条"学到了什么"注释或 memory 记录

**F. 架构合规（依据 `CLAUDE.md` L20/L21/L153 — 既有铁律，强制）**
- [ ] 新增配置/数据（事件/职业/地点/疾病/法律/旅行/人生节点等）**优先进入 `src/app/data/*`**，不新增到 `src/js/data/*` 散落全局
- [ ] 新模块放 `src/app/`，用 TypeScript + facade，**不直接新增 `window.*` 全局对象**
- [ ] 需写入旧游戏时走 `src/js/app_bridge/` 或 bridge/facade，**不替换 `src/index.html` 为 Vite shell**
- [ ] 新存档字段挂 `_webApp` 并配套迁移函数（不继续塞进 `state.js`）

---

## 3. 团队成长路线（分阶段）

> 原则：先建门禁（不阻断），再收紧（error 级），最后攻克架构债。

### 阶段 0 — 立门禁（本周，低风险）
- ✅ 启用 ESLint（`no-var`/`prefer-const`/`eqeqeq`/`no-unused-vars` 全部 **warn**，旧代码不阻断）。
- ✅ 发布本标准文档 + 评审清单。
- ✅ 给团队一个**正例**学习：`getNpcContextDialogue` 的数据驱动重构。

### 阶段 1 — 进 CI（确认后）
- 在 pre-commit / CI 跑：`lint`（旧=warn）+ `typecheck` + `npm test`（事件完整性）。
- 旧代码告警数只减不增；新代码告警 = error。

### 阶段 2 — 补安全网（确认后）
- 用现有 `tests/` 基建为 `finance` / `state` / `save` 加**单测**（纯函数优先）。
- 目标：重构 god file 时有人兜底。

### 阶段 3 — 攻架构债（方向已定，做执行）
> 方向无需再辩：`CLAUDE.md` L20/L21/L153 已定 **`src/app`(TS) 为未来真相，`src/js` 为 legacy 经 bridge 接入**。阶段3 = 强制 + 渐进抽取，不大爆炸、不冻结活跃循环。
- **强制**：新 PR 必须过评审清单 F（架构合规）；违者打回。
- **渐进抽取**：先把"纯逻辑"（finance/state/save，已有单测覆盖的优先）抽成 `src/app` 下 TS 模块，旧侧用 shim/重新导出过渡，**保持加载序与现有调用不变**。
- **巨型文件**：用"童子军规则"（碰到才拆、单文件 < 400 行），不一次性重写；`src/index.html` 加载序红线不动。

---

## 4. 给团队的"教学反例 → 正例"

| 反例（现状） | 正例（目标） | 教学点 |
|---|---|---|
| `var x = ...` 9934 处 | `const x = ...` / `let x = ...` | 块级作用域、TDZ、免 hoisting 坑 |
| `if(a == b)` | `if(a === b)` | 类型强制的隐性 bug |
| 长 `if/else if` 链匹配 NPC 台词 | `contextDialogue[].condition` 数据驱动 | 开闭原则、可配置、可测 |
| `bar.style.width = value + "%"`（value 可能 NaN） | 先 `if(!isFinite(value)) value=0` | 防御式编程、自洽 |
| 288 个 `window.*` 全局互相依赖 | 新模块 ES Module 单向依赖 | 可测试、可.tree-shake |
| 985KB 单文件 | 按职责拆分 < 400 行 | 可维护性、减少合并冲突 |

---

## 5. 资深开发者的工作方式（对团队承诺）

- **不替你写业务**，但帮你把"为什么这样写更好"讲清楚。
- 每次优化/重构后留下**可复用模式**（如数据驱动、防御式守卫）。
- 评审聚焦**设计决策与自洽性**，低级错误交给 ESLint。
- 遇到 SOP 硬约束（不动加载序 / 不改 build.py / 不引运行时库）一律遵守，与现有优化循环共存而非冲突。

---

*本文件随团队成长迭代。下一版更新触发：阶段 1 门禁上线、或核心逻辑单测覆盖率 > 30%。*
