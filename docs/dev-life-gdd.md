# 全栈人生线 GDD v1 — 城市浮生记·「日常开发」场景

> 模块：开发者人生线（自由接单 → 上班族程序员 → 技术创业）
> 版本：v1.0 ｜ 设计：GameDesigner(玩法师) ｜ 最后更新：2026-07-13
> 目的：「日常开发」全系统优化——把零散的 coding 技能 + techPark 接单，整合为一条有弧光、有抉择、有现实共鸣的程序员人生线。
> 所有数值均为 `[PLACEHOLDER]`，待 playtest 调参。

---

## 1. 设计支柱 (Design Pillars)

1. **技术成长有实感**：coding 从 0 到专精，每一步都有可感知反馈（XP、收入、解锁、分支），不让"练级"变成空转。
2. **技术债是真实的权衡**：快 vs 慢、KPI vs 技术债，永远在拉扯；没有"又猛又稳"的免费解。
3. **一条连贯的生涯弧**：自由接单 → 上班族 → 技术创业，三阶段的风险/回报/身份感截然不同，玩家能"看到自己人生的走向"。
4. **时代感（不沉重）**：AI 替代焦虑、35岁危机、开源红利——让程序员处境有现实共鸣，但用幽默与掌控感化解沉重的说教。
5. **涌现大于说教**：机制互相作用，玩家能"玩出"设计者没预期的人生分支（如接私活长成 SaaS）。

---

## 2. 核心循环 (Core Loop)

### Moment-to-Moment (0–30 秒)

- **Action**：接一个开发任务 / 写一个 PR / 修一个 bug
- **Feedback**：代码 XP↑、现金或 KPI 跳动、合并成功的提示音与弹窗
- **Reward**：coding 等级涨、技术债/风险数值变化、偶尔的"被认可"正向反馈

### Session Loop (5–30 分钟)

- **Goal**：完成一个迭代 / 接满今日单 / 攒够创业启动金 / 把技术债压回安全线
- **Tension**：AP 有限、疲劳累积、技术债逼近临界、办公室政治的暗流
- **Resolution**：升职 / 接私活 / 创业 / 摸鱼——每个选择都改写长期轨迹

### Long-Term Loop (hours–weeks)

- **Progression**：coding 分支专精（Lv.10/25/50 天赋节点）→ 职场 P5–P10 → 科技创业种子→A→B→IPO
- **Retention Hook**：35岁危机的抉择、开源走红、AI 焦虑转机、传承币（建议新增"程序员专属"传承项）

---

## 3. 三阶段机制规格 (Mechanic Specs)

### 阶段一：自由接单 (Freelance)

**Purpose**：让"会写代码"立刻能换钱，提供低门槛、高自由度的技术成长入口。
**Player Fantasy**：我靠手艺吃饭，时间我自己排。
**Entry**：coding 技能 ≥ 25 即出现 `open_source_bounty`；选 coding 分支后 techPark 解锁对应接单工作。
**Inputs**：选择工作 → 消耗 AP → 执行 `payCalc` → 获得现金 + codingXp + 分支加成。
**Outputs**：现金、coding XP、幸福感、少量智力 XP；分支加成随专精提升收入。
**Success**：单笔收入随 coding.level 线性增长，且分支天赋节点提供额外倍率。
**Failure State**：coding 等级不足 → 工作不解锁；疲劳过高 → 当日无法继续接单。
**Edge Cases**：

- 玩家未选任何 coding 分支 → 仅 `open_source_bounty` 可用（无 branchRequirement）。
- `open_source_bounty` 出现在 fullstack_dev 的 jobBonuses 中 → fullstack 分支额外加成，其余分支倍率 1.0。
  **Tuning Levers**：base / coeff / 随机区间 / 分支收入加成（见平衡表 §2）。
  **Dependencies**：coding 技能、skill_tree 分支、techPark 地点、getBranchJobBonus。

> 新增 4 个工作：`fullstack_project`(全栈) / `data_analysis_gig`(数据AI) / `app_dev`(移动) / `open_source_bounty`(无分支门槛)。

### 阶段二：上班族程序员 (Corp)

**Purpose**：把"在公司写代码"做成有晋升、有政治、有技术债管理的完整职场体验。
**Player Fantasy**：我是大厂工程师，KPI、晋升、团队都在我手里。
**Entry**：通过既有 corp 系统入职科技公司（如 `star_tech`，industry=AI/大模型），从 P5 起。
**复用**：既有 `CORP_RANKS`(P5–P10) 与 `CORP_ACTIONS`(project_work / take_risk / defuse_risk / side_project 等)。
**新增 3 个开发者行动**（深化技术语境）：

- `code_review` 代码评审：KPI+5 / 能力+4 / **技术债-8** / 疲劳+8 / 发-1（coding≥30）
- `on_call_firefight` 线上救火：KPI+10 / **技术债-6** / 疲劳+22 / 幸福-5 / 发-3（coding≥35）
- `agile_sprint` 迭代冲刺：KPI+18 / 能力+3 / **技术债+6** / 疲劳+16 / 发-4（P6+）
  **技术债 = `corp.risk`**：`take_risk`/`agile_sprint` 升高，`defuse_risk`/`code_review`/`on_call_firefight` 降低，`dev_tech_debt_explosion` 重构可清零。
  **Success**：KPI/能力达标 → 晋升（受分支 `promoAbilityReduction` 影响）。
  **Failure State**：技术债爆表 → 触发危机事件或既有 corp 危机接管。
  **Tuning Levers**：各行动 effect 数值、晋升阈值（平衡表 §3）。
  **Dependencies**：corp 系统、coding 分支、技术债(=risk)字段。

### 阶段三：技术创业 (Startup)

**Purpose**：让技术积累转化为"自己当老板"的高风险高回报终局。
**Player Fantasy**：我写的产品，养活一票人。
**Entry**：`dev_side_project_pivot` 事件（coding≥50、day>60、现金≥¥20,000）埋下种子 → 进入既有 `STARTUP_INDUSTRIES.tech`（互联网/软件/AI，keySkills 已含 coding）。
**复用**：既有创业系统（种子→A→B→IPO、融资、董事会、危机、PR），`tech` 行业天然契合。
**Success**：产品增长、估值上升、IPO / 退出。
**Failure State**：现金耗尽、产品失败、被收购。
**Edge Cases**：`dev_side_project_pivot` 仅设 `st.flags._devFoundedStartup` 叙事钩子；真正创业仍需走既有创业系统开启（叙事桥接，非自动开局）。
**Tuning Levers**：沿用 STARTUP 既有数值；建议后续为 `tech` 行业补充"技术债危机"专属事件（本版未新增行业，避免破坏既有引用）。
**Dependencies**：startup 系统、coding 技能、`tech` 行业。

---

## 4. 联动事件（6 个，全遵循 A 类自洽规则）

| 事件 id                      | 阶段   | 触发条件（守卫）                              | 联动系统          | 设计意图                           |
| ---------------------------- | ------ | --------------------------------------------- | ----------------- | ---------------------------------- |
| `dev_tech_debt_explosion`    | corp   | 在职 且 coding≥40                             | 技术债(risk)      | 把"埋雷"变成具象危机，制造重构抉择 |
| `dev_age35_crisis`           | corp   | age≥35 且 在职 且 coding≥30（一次性）         | 职场/创业/道德    | 程序员经典节点，三条分叉人生       |
| `dev_open_source_viral`      | street | coding≥35 且 day>30（一次性）                 | 名声/个人品牌     | 开源红利的"被看见"快感             |
| `dev_ai_replacement_anxiety` | street | coding≥20 且 day>20 且 sectorHeat.tech>1.0    | 世界参数/行业热度 | AI 替代焦虑 → 向上卷 or 转岗       |
| `dev_side_project_pivot`     | street | coding≥50 且 day>60 且 现金≥¥20,000（一次性） | 创业/经济         | 私活长成产品，连通创业线           |
| `dev_boss_spotlight`         | corp   | 在职 且 day>15                                | 向上管理/KPI/人缘 | 职场突袭，高光也是审判             |

> 全部用 `conditions(st)` 门控：技能/年龄/在职/世界参数守卫，无职业裸奔、无天气裸奔、无 NPC 名裸奔。`dev_age35_crisis` / `dev_open_source_viral` / `dev_side_project_pivot` 用 `st.flags._xxxDone` 做一次性守卫，避免重复刷屏。

---

## 5. 上手流程 (Onboarding Checklist)

- [x] 核心动词（写代码赚 XP/钱）在 coding≥25 即出现（`open_source_bounty` 零分支门槛）
- [x] 首个成功保证：`open_source_bounty` 低门槛、无风险、幸福+14，新手第一单必正反馈
- [x] 每个分支在安全、低风险上下文介绍（Lv.10 解锁第一节点）
- [x] 探索发现：开源赏金可由玩家自行认领，不靠文本教学
- [ ] 首 session 结束于钩子——建议接驳主线章节（第 30 天叙事检查点）做"第一份代码换来的第一桶金"里程碑

---

## 6. 系统交互矩阵 (System Interaction Matrix)

| 系统 A               | 系统 B                                       | 交互   | 定性 |
| -------------------- | -------------------------------------------- | ------ | ---- |
| coding ↔ corp        | 分支加成影响晋升能力与接单收入               | 预期   |
| coding ↔ 创业        | `tech` 行业 keySkills 含 coding              | 预期   |
| 技术债(risk) ↔ 事件  | `dev_tech_debt_explosion` 读/写 `corp.risk`  | 预期   |
| AI焦虑 ↔ worldParams | `sectorHeat.tech>1.0` 触发事件               | 预期   |
| 开源 ↔ 名声/个人品牌 | flag 钩子（`_ossInfluencer` 等，后续扩展）   | 可接受 |
| 私活 ↔ 创业          | `dev_side_project_pivot` 埋种子 → 连通创业线 | 预期   |

---

## 7. 已知平衡标记（待 playtest）

- ⚠️ **收入倍率误算（既有行为，全栈人生线沿用以保持一致）**：`getBranchJobBonus` 会把任何 key 含 `"Bonus"`/`"Income"` 的 talent 节点 effect 叠加进接单收入倍率。既有 `frontend_dev`/`backend_arch` 的 `abilityFlatBonus`（+10/+15）因此会被算作收入加成（×11/×16）。本版分支沿用同一约定（`abilityFlatBonus` + `*IncomeBonus`）。建议单独一轮统一修正该逻辑，避免接单收入膨胀。全栈人生线不单独"修"，以免与既有分支行为不一致。
- 所有 `*_Bonus` 数值、`payCalc` 的 base/coeff/随机区间、corp 行动 effect、`sectorHeat` 触发阈值均为 `[PLACEHOLDER]`。
- 创业阶段未新增 `tech` 行业（既有已覆盖），仅做叙事桥接事件；如需差异化科技创业危机，单列任务。

---

## 8. 实现落点（代码）

| 改动             | 文件                                                 | 内容                                                                         |
| ---------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------- |
| coding 分支 ×3   | `src/js/core/skill_tree.js`                          | `fullstack_dev` / `data_ai` / `mobile_dev`，各 3 天赋节点                    |
| 接单工作 ×4      | `src/js/data/jobs.js`                                | `fullstack_project` / `data_analysis_gig` / `app_dev` / `open_source_bounty` |
| 职场行动 ×3      | `src/js/data/corp.js`                                | `code_review` / `on_call_firefight` / `agile_sprint`                         |
| 联动事件 ×6      | `src/js/core/cross_system_events.js`                 | 见 §4                                                                        |
| 已复用（不改动） | `corp.js`(CORP_RANKS) / `startup_data.js`(tech 行业) | 上班族与技术创业阶段直接复用既有系统                                         |

> 校验：`node --check` 四文件全过；`build.py` 重新打包 dist/index.html（≈8.1 MB）成功；26 个新标识符已入包。
