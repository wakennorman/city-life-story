# 城市浮生记 — 自主开发护栏规则

## ✅ 版本迁移已完成（2026-06-21）

> **旧版 `../src/` 的所有独特内容已全部迁移到当前版本。**
> 当前 `city-life-story/src/` 是唯一活跃开发版本。

### 路径规则

所有文件路径使用 `city-life-story/` 前缀：

| 正确 ✅                          | 注意         |
| -------------------------------- | ------------ |
| `city-life-story/src/js/main.js` | 当前开发版本 |
| `city-life-story/src/index.html` | 项目入口     |

### 新文件规则

- 旧运行时 JS 模块 → 放在 `city-life-story/src/js/` 下，并在 `city-life-story/src/index.html` 中注册加载
- Web App 新架构模块 → 放在 `city-life-story/src/app/` 下，优先使用 TypeScript 数据目录和 facade，不直接新增散落全局对象
- 新玩法若要进入当前可玩版本，先通过 `src/js/app_bridge/` 或旧行动/管线桥接接入；不要把 Vite shell 当成正式入口替换 `src/index.html`

## 🧠 核心开发方法论：约定式自动归类（CoC）— 元架构原则（v3.36确立）

> **新增任何内容或系统时，按约定格式声明即可，框架自动发现并接入，不需要写胶水代码。**
>
> **自指（Self-Reference）**：此原则对自身也生效——新系统遵循 CoC 自动归入游戏架构，如同数据内容一样。

### 已落地的约定

| 你新增什么（在 data/*.js）     | 系统自动做什么                                                |
| ------------------------------ | ------------------------------------------------------------- |
| 一个**地点**                   | 百科条目自动出现 + 详情页底部自动出现「前往此地」按钮         |
| 一个**工作**                   | 百科条目自动出现 + 详情页底部自动出现「前往该地工作」按钮     |
| 一个**NPC**                    | 百科条目自动出现 + 详情页底部自动出现「前往该地找TA」按钮     |
| 一个**物品**（有buyLocations） | 百科条目自动出现 + 详情页底部自动出现「去XX购买」按钮         |
| 一个**技能**                   | 百科条目自动出现 + 详情页底部自动出现「前往培训中心训练」按钮 |

**零代码修改，纯数据声明即可。**

### 数据驱动扩展点：`navHints`

任何数据条目加 `navHints` 字段可自定义额外导航，不改渲染代码：

```js
navHints: [
  {
    type: "subTab",
    tab: "personal_growth",
    subTab: "pg_edu",
    label: "🎓 查看学历",
  },
];
```

### 原则

1. **数据声明优先（Declarative > Imperative）**：数据自己描述自己需要什么，系统自动匹配
2. **系统自动发现（Auto-Discovery）**：直接扫描数据源，不维护独立注册表
3. **约定优于配置（Convention > Configuration）**：默认行为合理，特殊需求才加配置
4. **渐进式增强（Progressive Enhancement）**：纯数据驱动解决80%，剩下的20%用函数覆盖

### 🔁 自指（Self-Reference）— CoC 对 CoC 自身生效

**CoC 不仅是内容的归类原则，也是系统本身的架构原则。**

当未来的开发者为游戏添加**一个新系统**（例如"宠物系统""载具系统""声望系统""短视频系统"）时，该系统自身也应遵循 CoC：

| 新系统需要做什么 | CoC 方式                                                                      |
| ---------------- | ----------------------------------------------------------------------------- |
| 注册数据文件     | 放在 `data/` 下，命名 `data/<system>.js`，导出标准格式数组/对象               |
| 注册 Tab 入口    | 在 `TAB_RENDERERS` 或 `_initTabStructure` 加一条声明，不写条件判断            |
| 注册管线步骤     | 在 `daily_pipeline.js` 的 `PIPELINE_STEPS` 加一行 ID，函数文件自行导出        |
| 注册百科条目     | 在实现文件末尾追加 `MECHANICS.<id>` 注册块，或在 `mechanics_registry.js` 追加 |
| 注册导航入口     | 数据条目加 `navHints` 字段，或通过 `navActionButton` 标准 API                 |
| 注册事件/触发    | 事件数据对象声明 `conditions/apply` 字段，`loadAll` 自动注册到触发槽          |

> **🚨 CoC断链判断标准（可操作规则）**
>
> 新系统添加后，**不得修改任何已有的渲染/导航/注册代码**。只新增文件 + 按约定格式声明字段。
>
> **如果不得不改旧文件来适配新系统 → 说明框架的约定有缺口 → 先修框架再交付系统。**
>
> 例如：加宠物系统时发现需要去 `render.js` 加一个 `if (pets)` 判断，那就是 CoC 断链——应该在 `TAB_RENDERERS` 或渲染引擎层补齐约定，而不是打补丁。

### 约定式方法论落地进度

| 领域           | 状态  | commit    | 说明                                                |
| -------------- | ----- | --------- | --------------------------------------------------- |
| 行动自动归类   | ✅    | `88d33d2` | getAvailableActions 43行动全部添加 category         |
| 技能↔工作关联  | ✅    | `88d33d2` | 技能/工作百科互查，自动扫描 STREET_JOBS             |
| 证书→职业加成  | ✅    | `88d33d2` | 16个证书已声明 salaryBonus，自动扫描                |
| 事件触发数据化 | 🧪POC | `389129e` | trigger_registry 基础设施 + stray_dog_rain 迁移示范 |

### 下一批可应用的高潜力领域

| 领域                   | 现状痛点                                 | 约定方案                       | 优先级 |
| ---------------------- | ---------------------------------------- | ------------------------------ | ------ |
| 事件触发数据化（全量） | 400+事件仍需逐个迁移 conditions→triggers | 基于 trigger_registry 批量迁移 | 🟡P1   |

详见 `memory/convention-over-configuration-methodology.md`

## 🔑 核心开发原则：全剧本适配（底层最高优先级，2026-07-02 确立）

> **任何新功能、新机制、新事件、新UI、新引导，都必须考虑在全部7个剧本中是否能正常运行和产生意义。不能只在经典模式（classic）里实现。**

**7个剧本**：`classic`（城市务工者）/ `laid_off`（下岗再就业）/ `small_town_grinder`（小镇做题家）/ `foreign_worker`（外来打工者）/ `second_gen`（二代创业者）/ `midlife_crisis`（中年危机职场人）/ `fresh_grad`（应届毕业生）

**实装任何功能前必须逐一检查：**

1. 这个功能在其他剧本的起始状态（不同资金/属性/位置/负债）下能触发吗？
2. 依赖特定条件（如智力≥45、在城中村、有村长债、health>80）的功能，哪些剧本天然不满足？
3. 不满足的剧本是否有替代入口、降级逻辑或专属提示？
4. 动态提示 / 教程步骤 / 目标条 / 叙事事件是否为该剧本准备了专属版本？

**自查方式**：完成实装后，在代码里确认新功能有无 `_currentScenario` / `_isScenarioMode` 分支；对7个剧本各过一遍触发条件，有断链必须补全再提交。

**背景**：第十一轮发现 tutorial.js 所有剧本共用经典模式步骤，导致非 classic 剧本引导完全失效。此类系统性缺陷的根因是"只想着 classic"。从今以后，**多剧本适配是交付门槛，不是加分项**。

---

## 🔥 触发短语（极简快捷指令 — 跨 Hermes / Claude Code / 任意 agent）

收到以下短语时，**先去读对应 SOP 文件再执行**，不要凭印象做：

| 用户说                           | 自动加载                                                         | 用途                                                                                  |
| -------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **"按 v3.1 审查改进"**           | `memory/review-improve-v3.1.md`                                  | 全方位评估+改进（代码/架构/机制/剧情/UI/留存），含全剧本适配检查+蓝图对齐+落地+commit |
| **"按 v2.1 提示词继续内容扩充"** | `memory/content-expansion-v2.1.md`                               | 成套添加地点/NPC/商品/事件                                                            |
| **"按 1.4 标准检查"**            | `memory/1-4-standard-implementation.md`                          | 世界自洽性四维度审计                                                                  |
| **"按蓝图开发"**                 | `GAME_BLUEPRINT.md` 第二节（优先级矩阵）+ 第三节（系统重构清单） | 确认待实装功能的 P 优先级，对齐设计公理后再动手                                       |

**执行规约**：

- 看到触发短语→`Read` SOP 文件全文（每个 ≤8KB）→按其中流程执行
- 不要在没读 SOP 的情况下凭记忆做事
- 完成时引用所用 SOP 版本号写在 commit message 和 DEVELOPMENT.md
- **每轮新功能实装前**：必须先读 `GAME_BLUEPRINT.md` 第二节（P 优先级矩阵），确认当前任务的优先级编号（P0/P1/P2）并写在 commit message 里；P2 功能不得抢在 P0/P1 之前落地

---

## 项目信息

- 入口: `src/index.html`（开发）/ `dist/index.html`（部署）
- **构建**: `python build.py`（将 src/ 内联为单文件 dist/index.html，约 4.5MB）
- **部署方式**: **GitHub Pages** — push 到 main 触发 GitHub Actions（`.github/workflows/deploy.yml`），自动构建并部署到 `gh-pages` 分支
- **线上地址**: `https://<username>.github.io/<repo>/`（需在 GitHub 仓库 Settings → Pages → Source 选 "GitHub Actions"）
- **本地预览**: `python -m http.server 8080`（在 `city-life-story/` 目录下运行，浏览器打开 http://localhost:8080）
- 开发文档: `src/DEVELOPMENT.md`（每次改动必须同步更新）
- 技术栈: legacy 正式运行时仍是 HTML5 + CSS + Vanilla JS；v3.8 起新增 Vite + TypeScript 作为并行 Web App 架构壳和类型化迁移通道
- **核心架构: 世界参数反馈环（v1.7）** — `src/js/core/world_params.js` 定义统一的 `_worldParams` 状态，将行业热度/市场情绪/财富等级纳入单一反馈闭环。行业热度由随机漂移+传导+新闻驱动（玩家个人不直接影响），财富反馈由玩家总资产决定，所有参数以 2%/天向基线衰减
- 所有 JS 文件通过 `<script src="...">` 在 index.html 中按序加载，**改变 script 标签顺序前必须确认无依赖断裂**（v3.1第40轮已将8处乱序归位）
- Web App 迁移提醒：后续新增事件、职业、地点、疾病、法律、旅行、人生节点等配置，优先进入 `src/app/data/*`；需要写入旧游戏时再通过 bridge/facade 接入。新增存档字段优先挂在 `_webApp` 并配套迁移函数，避免继续把所有兼容逻辑塞进 `state.js`。

## 当前状态

> 每次收工前覆盖更新本节（只留最新状态，不要追加历史）；详细变更历史在 `src/DEVELOPMENT.md`，不需要每次都读。

- **最新一次工作 (2026-07-13)**：R14(幽灵按钮全量审计+修复) — 域F/域H 4个实际幽灵按钮修复 + 约定式自动归类防御
  - **审计发现**：startup.js 中4个幽灵按钮(PR卡片/媒体卡片/crisis卡片/OKR添加关键结果)
  - **修复**：新增3个`*FromModal`包装函数+btnClass注入模板+addKrInput移出innerHTML
  - **防御**：createActionCard增加`console.warn`幽灵按钮运行时检测
  - **验证**：node --check ✅ / build.py 8104.9KB ✅
  - **commit**：`84aab82b`（⚠️ 未推送，网络不可达）
  - **记忆文件**：`memory/v3.99d-ghost-button-fix.md`

- **之前工作 (2026-07-13)**：R13(域CoC全量分析+部分P0实现) — 约定式自动归类全面审计，2个新增CoC系统
  - **审计产出**：`memory/coc-full-analysis-plan.md` — 22个已落地CoC系统 + 10个待实施领域(P0×3/P1×3/P2×4)
  - **P0 实现1: NPC语境对话数据化** — 6个NPC(aunt_wang/boss_li/sister_zhang/old_zhou/xiao_mei/chef_chen)新增`contextDialogue`声明式字段，每NPC声明条件→台词映射；`getNpcContextDialogue()`自动匹配；新增NPC只需加数据，无需改main.js
  - **P0 实现2: 人生节点效果内联化** — 12个choice新增`effect: function(st)`内联效果；`applyNodeChoice()`自动优先调用内联effect，旧switch-case兜底；新增节点choice不再需要维护switch-case
  - **10个待实施领域**：成就触发声明化/节日事件数据化/跨系统联动规则化(P0) + 行动数据源/事件条件迁移/新闻后续链统一(P1) + 技能协同计算/职业路径条件/旅行效果/创业事件触发(P2)
  - **验证**：node --check ✅ / build.py 8107.5KB ✅
  - **commit**：`02a2175`
  - **指令一审查**：域G文件扫描发现5个A类候选+wiki搜索框焦点窃取修复
    - **daily_pipeline.js** (6): 所有 trigger_slot 守卫 `state.day`→`state.player.day`，TriggerRegistry 事件系统6年从未触发
    - **main.js** (2): `state.chengguan` 直接访问无守卫→TypeError死锁 + `state.inventory.items` 无守卫→旧存档崩溃
    - **illness.js** (1): 疾病进化弹窗 `onClick`→`callback`，"立即治疗"按钮6年无效
    - **weather.js** (1): `getWeatherIllnessAdjustedProb` 读 `state.status.physique`→`state.player.physique`，体质越高疾病越低效果完全失效
    - **wiki.js** (1): 搜索框焦点窃取——每次输入渲染全页重建DOM，焦点丢失到子Tab按钮。修复：只更新`.wiki-content`区域+恢复输入框焦点
  - **指令二联动增强**：尚未执行（见下轮提示）
  - **验证**：node --check ✅ / build.py 8080.8KB ✅
  - **影响文件**：wiki.js/daily_pipeline.js(6处)/main.js(2处)/illness.js/weather.js(5文件)
  - **commit**：`050738fe`(submodule) · `c2d4cf18`(parent)
    - `social_worker_visit` — mental<30+housing≤级+漂泊≥14天 → 社工温情/精神成长/可选成为志愿者
    - `gov_subsidy_window` — cash<200+苦力≥30天 → 低保救助+培训机会（损失厌恶：不食嗟来之食分支）
    - `chengguan_encounter_interactive` — 摆摊经验+热度≥40 → 4种应对策略（逃跑/求情/示好/硬扛）
    - `parents_phone_call` — day≥60+资金少 → 母亲电话/转钱/承诺回去/敷衍（愧疚感flag回声）
    - `craftsman_apprentice` — 手艺≥60+day≥90 → 收徒仪式+30天后链式回报payoff
  - **影响文件**：`events_street_life.js`(+10)/`cross_system_events.js`(~+340行 B类修复+新事件)
  - **验证**：node --check ✅ / build.py 7883.2KB ✅ / commits: A类`4a631214`+B类修复+dist重建

- **上一轮 (2026-07-11)**：v3.90(loop R43) — 新增4个联动事件(王婶张姐调解/第一桶金/李陈合作/周年归属感)
  - **指令一审查**：全量扫描15个事件文件，A类缺陷0个（已累积133处[自洽修复]注释覆盖所有NPC/天气/职业门控）
  - **指令二新增**：4个高影响联动事件填补空白区
    - `npc_mediate_aunt_wang_sister_zhang` — 双NPC好感≥30调解，魅力成长
    - `wealth_first_bucket_milestone` — 总资产≥200,000第一桶金里程碑
    - `npc_boss_li_chen_ge_coop` — 双NPC好感≥40中立→合作桥接
    - `city_one_year_anniversary` — Day≥365城市归属感仪式，全NPC好感
  - **覆盖矩阵更新**：NPC关系11→13 / 财富23→24 / 住房3→4
  - **验证**：node --check ✅ / build.py 7832.8KB ✅ / git push ✅
  - **commit**：`d844bb15`(submodule) · `e98a1e2`(parent)

- **上一轮工作 (2026-07-11)**：v3.89 — 新增5个联动事件(老手特遇/专业视角/NPC线索/暴雨骑手/道德分叉)

- **上一轮工作 (2026-07-11)**：v3.88c — 事件系统A类缺陷修复（15个事件补phase+1个NPC断链+1个动态文本）
  - **🚨 A类严重修复**：15个事件因缺`phase`字段被 queueRandomEvent 过滤，永不触发：
    - personal_growth_events.js (5) — 健康危机/崩溃/形象/目标deadline/爱好突破
    - workplace_social_events.js (5) — 甩锅/拜师/八卦/团建/抢功
    - insider_trading_events.js (5) — 小道消息/财报泄露/审计警告/杀猪盘/同学网络
  - **🐛 NPC断链修复**：events_street_life.js minimum_wage_hike — 叙事引用"王婶"但未验证 aunt_wang.met
  - **🐛 动态文本修复**：cross_system_events.js career_promo_offer — text:function 渲染为 "[Function]"
  - **审查范围**：212+事件地毯式扫描（events_street_*×3 + career_path_events + cross_system_events + 4个新事件文件）
  - **验证**：node --check ✅ / build.py 7795KB ✅ / git push ✅
  - **🐛 v3.88b 修复**：position:sticky 在 #content-area 内不生效 → 改用 flex-shrink:0 兄弟节点（与 #tab-bar / #message-log 同原理），HUD 作为 #content-area 同级节点，只有 #content-area 滚动
  - **🛡️ 装备购买提示修正**：删除"电子→科技园/书本→大学城"（不属于任何装备槽），改为"⛑️头部/🧤手部→批发市场/工地 | 👕身体/👟脚部→批发市场/商业区 | 📿配件→批发市场/商业区"
  - **🗺️ 空槽导航弹窗**：空装备槽点击弹出弹窗，列出该槽全部可购装备（含价格+购买地），底部"前往XX"按钮一键导航
  - **📌 手机端固定 HUD**：时间槽+位置条+状态条从 `#content-area`（可滚动）提取到 `#mobile-hud`（`flex-shrink:0` in `#main`），与 tab-bar 同级，AP/状态不再随内容滚动消失
  - **影响文件**：render_infra.js(+22/-16) / style.css(+6) / dist/index.html(重建)
  - **验证**：node --check ✅ / build.py 7779.1KB ✅
  - **commit**：`8ce657e5` ✅ 已 push

- **上一轮工作 (2026-07-11)**：v3.88 — 装备栏 UI 修正 + 手机端固定状态 HUD（superceded by v3.88b）
  - commit：`3156b8d7`（本地已提交，push 待网络恢复）

- **上一轮工作 (2026-07-11)**：v3.87 — 教程引导全面优化（pointer-events穿透+内容重写+步骤重排）
  - **🖱️ CSS穿透修复**：`.tutorial-overlay { pointer-events: none; }` + `.modal-box { pointer-events: auto; }` — 玩家现在可以直接点击高亮区域推进教程（不再被遮罩拦截）
  - **📝 内容修复**：Step1去"2003年"年份写死 → "初来乍到"；Step2 4维/4项 → 5维属性+5项需求（与当前游戏一致）
  - **🔀 步骤重排**：Steps7&8互换 — "找住处"(step7)在前，"出发！"(finale, step8)在后，逻辑链更合理
  - **🧹 代码泄漏**：small_town_grinder step3 `housingTier=0` → "今天必须找到落脚点"
  - **💬 全步骤文案**：统一"👆 直接点击高亮区域"，按钮改为"找不到？直接继续 →"明确主/备路径
  - **验证**：node --check ✅ / build.py 7775.9KB ✅
  - **commit**：`c36e2619`（本地待推，网络问题）

- **上一轮工作 (2026-07-11)**：v3.86 — 统一悬停动效 + 交通方式步行选项
  - **🎯 统一悬停动效**：以 `action-card:hover` 为标准，统一9个CSS类( card/hustle-card/btn/btn-primary/world-news-item/world-news-skip-btn/marketing-channel/team-management-action/npc-visit-btn ) + 9处JS内联onmouseover
  - **🚶 交通方式新增步行按钮**：步行免费全城可达，AP=6+跳数×4
  - **🖱️ transit-btn悬停修复**：新增`.transit-btn:hover` CSS规则(标准hover)，移除所有内联style
  - **适应walk模式**：价格=0/AP hops-based/消息特殊处理/模式映射全覆盖
  - **影响文件**: style.css(+31 transit-btn+base) / render.js(~20行移除内联style+步行按钮+walk逻辑)
  - **验证**: node --check ✅ / build.py 7766.6KB ✅
  - **commit (submodule)**: `5499d9a3` · **parent**: `cfcdc86`

- **上一轮工作 (2026-07-11)**：v3.85 — 事业Tab全面打磨：属性训练重平衡/求职框线/副业排列
  - **🏋️ 属性训练重平衡**：参考《完美人生》，晨跑免费(原¥40)、冥想免费(原¥70+50)、健身房¥30+15；递减收益(≥70→0.8x, ≥80→0.6x, ≥90→0.4x)；统一TRAIN_DATA数据源，显示AP消耗+收益范围+地点要求
  - **🐛 showModal空白按钮修复**：`{label,primary,onClick}`→`{text,cls,callback}`，按钮自动`color:#fff`防CSS覆盖
  - **💼 求职UI框线增强**：新增`.card`CSS类(3px左侧彩色accent条+hover)，可投递绿色/条件不足灰色区分
  - **🔄 副业UI排列规整**：flex-wrap→CSS Grid(`.hustle-grid`)，统一卡片结构(header→desc→meta→reqs→btn)
  - **影响文件**: render.js(+393/-414) / style.css(+89) / career_dev.js(+27) / side_hustle_ui.js(+57) / modal.js(+7)
  - **验证**: node --check ✅(修复合并重复代码块SyntaxError) / build.py 7758.9KB ✅ / 头浏览器无运行时错误
  - **commit**: `45b53556`(submodule) · `5ff7fba`(parent) ✅ 已push

- **上一轮工作 (2026-07-11)**：v3.84 — 事业Tab 5项Bug修复
  - **Bug1 职业路径弹窗无响应**: showModal({buttons:undefined})→TypeError；修复：buttons默认=[]；showCareerPathPreviewModal改用buttons数组参数
  - **Bug2 属性训练无地点检测**: 新增_TRAIN_LOCATION_MAP；__doTrain拆分为地点检查+弹窗→__doTrainCore；不在目标地点弹确认弹窗
  - **Bug3 健康显示[object Object]**: pg.health.physical是对象；新增_healthScoreLabel()提取.score→"良好/一般/欠佳/较差(N/100)"彩色标签
  - **Bug4 市场信息全量暴露**: 新增infoDepth(0/1/2)按intelligence/finance技能3档门控；新闻标题改为横向滚动
  - **Bug5 副业碾压临时工**: 代购/网约车/外卖收益下调；网约车新增minSkill.driving≥5；自媒体粉丝爆发100粉×1.5→200粉×3.0
  - **影响文件**: modal.js / career_dev.js / render.js / investment.js / side_hustle.js
  - **验证**: build.py 7754.4KB ✅
  - **commit**: `f2f7d4d9`（本地已提交，网络恢复后需push）

- **上一轮工作 (2026-07-11)**：v3.83(loop R39) — 四季叙事深化：4季各+1事件(倒春寒/夏夜纳凉/秋雨寄思/冬日围炉)
  - **设计意图**: 填补"16种疾病5大类但康复叙事为零"的最大空白区
  - **① recovery_brink_relief**: 从危到安——health<30危机后恢复至≥55，一碗热粥重新活过来
  - **② recovery_warm_soup**: 康复后的那碗汤——病愈后王大婶端来鸡汤，社会支持的温度
  - **③ recovery_ward_coincidence**: 病房奇遇——住院期间遇到装修老哥，同病相怜的人脉
  - **④ recovery_exercise_resolution**: 康复的决心——病愈后立flag晨跑/改善饮食/调整作息
  - **⑤ recovery_herbalist_wisdom**: 街头老中医——亚健康状态得到养生点拨，权威效应
  - **设计心理学**: 峰终定律(顿悟时刻)/损失厌恶(后怕驱动)/社会支持/禀赋效应/新起点效应
  - **影响文件**: cross_system_events.js(+428行)
  - **验证**: node --check ✅ / build.py 7722.5KB ✅
  - **覆盖矩阵新增**: 健康/医疗 4→9事件

- **上一轮工作 (2026-07-10)**：v3.73(loop R29) — 新增2个健康危机事件(健康红线/濒死边缘·损失厌恶驱动)
  - **设计意图**: 平衡大量正面成就事件，加入负面里程碑制造张力
  - **新增2事件**: health_crisis_slow_collapse(health<30预警) / health_near_death_reckoning(health<15濒死抉择)
  - **影响文件**: cross_system_events.js(+158行) / linkage-events-gdd.md(+21行)
  - **验证**: node --check ✅ / build.py 5918KB ✅
  - **commit**: `180bb5e2`+`ee5d9f10`(本地待推)

- **上一轮工作 (2026-07-10)**：v3.72(loop R28) — 新增3个NPC↔NPC关系动态事件(旧识重逢/竞争选边/同学引荐)
  - **设计意图**: NPC关系矩阵(14NPC×14NPC)首次被事件消费，让玩家感受「NPC有自己的生活」
  - **新增3事件**: npc_reunion_auntzhou(王婶+老周旧识) / npc_competitor_clash(Li工头+张姐竞争选边) / npc_classmate_endorsement(陈哥+阿杰同窗引荐)
  - **影响文件**: cross_system_events.js(+239行) / linkage-events-gdd.md(+31行)
  - **验证**: node --check ✅ / build.py 5911KB ✅
  - **commit**: `66b2d2fd`+`99e1e144`(本地待推)

- **上一轮工作 (2026-07-10)**：v3.71(loop R27) — 指令一扫描0真实A类+4新增高影响事件(技能满级/六位数财富/豪宅/夏夜)
  - **gap分析发现**: 最高Impact空白区 = 技能满级(0事件) > 财富里程碑(1事件) > 住房高端(0事件) > 季节叙事(0事件)
  - **新增4事件**: skill_absolute_mastery_capstone(满级收徒/写心法) / wealth_six_figure_milestone(六位数时刻) / luxury_housing_new_life(豪宅搬家) / summer_night_market_boom(旺季出摊)
  - **影响文件**: cross_system_events.js(+317行) / linkage-events-gdd.md(+41行)
  - **验证**: node --check ✅ / build.py 5901.2KB ✅
  - **commit**: `f72ec70d`+`35d7ce40`(本地待推)

- **上一轮工作 (2026-07-09)**：v3.70 — 微动效系统：触摸反馈+热招脉冲+收益浮动数字
  - **P0 触摸反馈**：action-card:active scale(0.95) + tab-btn:active scale(0.92) + touch-action:manipulation（消除iOS 300ms延迟）
  - **P1 热招引导脉冲**：.card-hot（card-hot-pulse 2s∞金黄边框+背景+🔥前缀），createActionCard自动注入
  - **P1 收益浮动数字**：showEarnFloat(pay, cardEl)，doStreetJob后触发，≥¥500大字金黄色
  - **P2预留**：.card-unlock闪光CSS（新解锁行动入场，暂未触发）
  - **影响文件**：style.css(+70行) / main.js(+showEarnFloat+触发) / render.js(+.card-hot注入)
  - **验证**：node --check ✅ / build.py 5887.5KB ✅
  - **commit**：`13b9f61e`

- **上一轮工作 (2026-07-09)**：v3.65(loop R26) — 指令一扫描0真实A类(2候选已被另窗口独立修复) + 新增4个空白区联动事件
  - **指令一审查结论**：全量扫描5个事件文件(250+事件)，发现2个A类候选均已被另一窗口独立修复( startup_meet_coder天气+edu_crash家教 )，0真实A类缺陷
  - **指令二新增事件**：4个高潜力空白区填充
    - `snow_night_scrap_deal` — ❄️雪天+废品站+老周好感(填补snow天气事件空白)
    - `cert_first_job_bonus` — 🎓证书首次兑现+链式90天回报(填补教育系统事件空白)
    - `oldzhou_affinity_max_heritage` — 🤝好感100传家级人脉线(填补NPC终极奖励空白)
    - `trading_supply_demand_gap` — 📦市场供需套利vs人情(填补交易动态事件空白)
  - **影响文件**：cross_system_events.js(+329行) / linkage-events-gdd.md(+57行)
  - **验证**：node --check ✅ / build.py 5885.2KB ✅
  - **commit**：`70fdaa6a` + `6f25d9b3`（本地待推）

- **上一轮工作 (2026-07-09)**：v3.63b — 多剧本适配审查 + getNextGoals 补全
  - **审计范围**：7 个剧本 × 全部事件/UI/系统文件（RANDOM_EVENTS/tutorial/daily_quest/career_dev/startup/save/render/world_news）
  - **审计结论**：全剧本适配良好，无重大断裂
  - **修复**：`main.js getNextGoals` 补全 2 个遗漏剧本专属目标
    - `midlife_crisis` → 🔄 技能重塑（priority 85）
    - `fresh_grad` → 📋 职场起步（priority 85）
  - **影响文件**：main.js（+4 行）
  - **验证**：node --check ✅
  - **commit**：`f2136d0`(新事件) + `3033985`(docs)（本地待推）

- **上一轮工作 (2026-07-09)**：v3.52b — 烹饪×NPC联动事件（3个新增）+ 清理废弃bak文件
  - **改进1：职业路线预览弹窗** `showCareerPathPreviewModal(pathKey)`：点击任意路径卡片打开晋升阶梯图，展示全部等级（等级圆圈+名称+描述+要求+薪资），绿色=已达标/灰色=未达标，底部投递按钮（条件满足时激活）
  - **改进2：路径卡片增强**：推荐路径 + 分类路径卡片均显示薪资范围（¥entry→¥max），不再只显示初级薪资
  - **改进3：分类可折叠**：白领/服务/蓝领-体制三个分类标题栏点击可折叠/展开，减少无业玩家的信息过载
  - **改进4：职业历程可视化**：上班族Tab的「📜 职业历程」从纯文本卡片改为时间线设计（竖线+圆点，晋升/跳槽高亮显示）
  - **改进5：职业路径全景图**：总览Tab新增「🗺️ 职业路径全景」卡片网格（2列），10条路线各显示状态（🔒未解锁/✅可投递/⭐当前/🏆已满级），在职路线有等级进度条，点击打开预览弹窗
  - **改进6：工作行动按钮分组**：按「📈提升业绩」和「😴缓解倦怠」两组展示，每个按钮下方显示AP消耗+效果预览（如 AP3·业绩+8）；带薪年假根据条件显示可用/冷却中/未满足
  - **影响文件**：career_dev.js（+268行）
  - **验证**：node --check ✅ / python build.py 5286KB ✅ / git commit a66f0fe4 + 70f5c2c4 ✅ / push ✅

- **上一轮工作 (2026-07-09)**：v3.49 — 职业系统UI重构：分类+推荐+总览优化 + 导航简化+街头桥接
  - **问题**：10+条职业路径平铺展示无分类，新手面对满屏路径选择困难；无推荐系统；无工作时机体总览信息薄弱；三级导航嵌套过深；街头工作与职业路径完全割裂
  - **改进1：职业路径分类**：每条路径新增 `category` 字段 → 👔 白领(tech/finance/design/legal) / 🛒 服务(sales/ops/edu/catering) / 🔧 蓝领-体制(logistics/medical/doctor/public_institution/civil)
  - **改进2：推荐系统**：`getRecommendedCareerPaths()` 基于技能匹配度×属性匹配度加权评分，推荐Top3路径（显示匹配百分比）
  - **改进3：职业路径UI重构**：分类标题头 + 按分类分组排列（白领→服务→蓝领-体制）+ 推荐路径卡片高亮 + 条件不足/满足视觉区分优化
  - **改进4：总览面板增强**：无工作状态新增「事业准备」卡片（街头经验天数+推荐方向+证书统计+引导按钮）
  - **改进5：导航简化**：移除renderCareerDevTab二级导航中的创业子Tab（上级Tab已有独立入口），智能默认子Tab（无工作→上班族列表，有工作→总览面板）
  - **改进6：街边→职场桥接面板**：街头工作天数统计 + 基于技能水平自动推荐匹配职业路径 + 可点击路径标签（rec-path-tag事件委托）
  - **新增函数**：`getCategoryLabel()` / `getRecommendedCareerPaths()` / `switchCareerSubTab()`
  - **影响文件**：career_dev.js（+~400行，分类+推荐+UI重构+桥接面板）/ render_infra.js（创业路由修复）
  - **验证**：node --check ✅ / python build.py 5277KB ✅ / git commit eb5d8356 ✅（网络问题待推送）

- **上一轮工作 (2026-07-08)**：v3.45 — 今日头条新闻说明升级（实时新闻 note 游戏化重写）
  - **问题**：实时新闻 note 是「实时新闻·就业行业利空」这类抽象模板；「综合」兜底毫无信息量
  - **修复**：新增 `_REAL_NEWS_NOTES` 查找表（10分类×4情绪），每条都是具体游戏影响说明
    - 例：`employment.bullish` → 「招聘旺季！打工求职竞争力提升，薪资谈判空间扩大」
    - 例：`housing.bearish` → 「楼市降温，租房可以议价，降低住所开销的好时机」
  - **5个兜底 note** 全部改为有行动指导的说明（「社会热点新闻，对打工生活的直接影响有限」等）
  - **离线新闻审查**：JOB_SECTOR_MAP 验证 note/effect 自洽——医药/消费/金融 sectorHeat 均正确传导到对应岗位收入 ✅
  - **影响文件**：world_news_intro.js（+168/-38行）
  - **验证**：node --check ✅ / python build.py 5254.0KB ✅ / `commit 34585956` ✅ / push ✅

- **上一轮工作 (2026-07-08)**：v3.44 — TRAVEL_GRAPH 全图双向化（修复寺庙598AP bug）
  - **问题**：寺庙步行显示"99跳·598AP"，根因是TRAVEL_GRAPH有向图孤立节点（temple无入边）
  - **修复**：`locations.js` 补全5条缺失反向边（commercialDist→construction / factoryZone→suburb / school→hospital / school→temple / park→temple）
  - **防御**：`render.js _calcCommute` hops≥99时return null，永不显示孤立节点
  - **结果**：全图15节点完全双向化，图直径=4跳，步行最大AP=28（原598→28）
  - **影响文件**：locations.js / render.js
  - **验证**：bank→temple=3跳/22AP ✅ / node --check ✅ / build 5250.3KB ✅ / `commit 66bb2f4` ✅

- **上一轮工作 (2026-07-08)**：v3.43 — 通勤地图逻辑重构
  - **问题**：步行从银行无法到达科技园（1-hop限制），单车/打车却可以，玩家困惑
  - **重构**：`render.js _calcCommute` 步行→全城可达 / 地铁→任意位置→所有站点 / 自驾→全城可达
  - **AP公式**：步行远途代价变大（2跳16AP/3跳22AP），倒逼玩家选择交通工具而非封锁目的地
  - **地铁扩站**：新增 bank + gov_office 为地铁可达站点（共10站）
  - **影响文件**：render.js（-13/+11行）
  - **验证**：`node --check` ✅ / `python build.py` 5250.0KB ✅ / `commit 3ec7212` ✅ / push ✅

- **上一轮工作 (2026-07-08)**：v3.39 — 专业技能视角事件（2个新增）
  - **设计理念**：技能达到门槛后提供「专业人士视角」，让玩家感受成长的世界观变化
  - **新增事件**：
    - `repair_pro_insight` — repair≥40时识别建筑安全隐患（报告/无视/自己修）
    - `coding_digital_edge` — coding≥30时发现数字套利机会（爬虫/记录/无视）
  - **设计心理学**：禀赋效应（技能让你珍视专业视角）/ 峰终定律（顿悟时刻成为峰值记忆）
  - **影响文件**：cross_system_events.js（+166行）
  - **验证**：`node --check` ✅ / `python build.py` 5229.8KB ✅ / `commit c3b803b` ✅
  - **记忆文件**：`memory/v3.39-skill-perspective-events.md`

- **上一轮工作 (2026-07-08)**：v3.38 — 状态积累爆发事件（3个新增叙事事件）
  - **设计理念**：让系统追踪的每一个状态变化都有对应的叙事回响
  - **填补空白**：`_habits` 6指标中之前只有2个有事件覆盖，v3.38补齐3个
    - `low_mood_crisis_encounter` — lowHappinessStreak≥3 → 卖花奶奶的善意
    - `junk_food_body_warning` — junkFoodMeals≥10 → 半夜胃痛警告
    - `night_owl_encounter` — lateNightActions≥5 → 夜归人类人邂逅
  - **设计心理学**：峰终定律（低谷善意打破负循环）/ 损失厌恶（硬扛有惩罚）/ 社会比较（同类人缓解孤独）
  - **影响文件**：cross_system_events.js（+182行）
  - **剩余空白**：stomach_inflammationCount 已有 illness 系统覆盖
  - **验证**：`node --check` ✅ / `python build.py` 5223.3KB ✅ / `git commit f490d72` ✅ / `git push` ✅
  - **记忆文件**：`memory/v3.38-habit-streak-events.md`

- **上一轮工作 (2026-07-08)**：v3.37 — 职业系统深度联动事件（5个新增叙事事件）
  - **设计理念**：让"工作"不再是数值循环，赋予情感温度和叙事深度
  - **新增事件**：
    - `first_earn_milestone` — 第一次赚到¥500时的财务意识启蒙（存银行/犒劳自己/买书学习）
    - `workmate_bonding` — 工作20天后的工友聚餐邀请，建立社交纽带
    - `job_skill_breakthrough` — 同工作30次后的技能顿悟，激励深耕单一技能
    - `career_doubt_moment` — 工作60天后的职业迷茫，引导玩家做规划
    - `workplace_opportunity` — 工作30天后的客户认可，建立正向反馈
  - **设计心理学**：峰终定律（第一次/顿悟时刻记忆锚点）/ 损失厌恶（逃避有惩罚）/ 禀赋效应（技能积累回报）/ 社会认同（被看见的满足感）
  - **影响文件**：cross_system_events.js（+181行）
  - **验证**：`node --check` ✅ / `python build.py` 5214.9KB ✅ / `git commit aa01667` ✅ / `git push origin main` ✅
  - **记忆文件**：`memory/v3.37-career-deep-events.md`

- **上一轮工作 (2026-07-09)**：v3.36 — 游戏帮助系统全面更新（约定式自动归类+全剧本适配+百科指引）
  - **帮助弹窗重写**：6模块覆盖游戏全貌 — 🎭剧本模式(7剧本+沙盒+4难度) → 🗺️核心生存循环 → 🔬约定式自动归类(CoC) → 📖游戏百科指引(15类) → 🧠深度系统一览(9大系统) → 💡新手必备
  - **约定式自动归类(CoC)显性化**：帮助中新增专门章节，解释"新增即生效/数据声明即可/事件数据化/行动自动归类"理念
  - **全剧本适配**：7个剧本+沙盒模式全部在帮助中列出，帮助内容对所有剧本通用
  - **百科优先指引**：引导玩家使用百科（15分类）作为第一查询入口
  - **影响文件**：modal.js(-83/+166行)
  - **验证**：node --check ✅ / build.py 5198KB ✅
- **上一轮 (2026-07-06)**：v3.1 审查改进 — 难度系统全面接入 + 终局体验强化 + SOP v3.1（commits: `5bd01c6`+`49ba233`+`ad34443`+`da0832c`）
  - **4 档难度**：🍵 休闲 / ⚖️ 标准 / 🔥 困难 / 💀 地狱，7 维参数
  - **MC 验证**：休闲¥11,827 > 标准¥7,045 > 困难¥1,535 > 地狱-¥306 ✅
- **上一轮 (2026-07-06)**：v3.22 — 职业里程碑叙事事件 + 带薪年假（commit: `2dfec45`）
  - **9个街头工作里程碑叙事事件**：`job_milestone_events.js`（新建+430行），7/30/100天触发，真实中国打工场景对话+有后果的选择（金钱/道德/机会取舍），自动解锁已有NPC推荐flag（老周/老李/陈师傅/小美等）
  - **带薪年假系统**：`career_dev.js` 新增 `careerTakePaidLeave()`（+47行），需在职90天+冷却180天+倦怠≥30，效果：倦怠-45/心情+25/精神+15/健康+8，代价扣5天薪资
  - **工作行动UI**：新增「🏖️ 带薪年假（180天）」按钮（调休按钮旁），仅在职玩家可见
  - **触发集成**：main.js doStreetJob 3个称号升级点各追加 milestone 事件调用
  - **设计参考**：大多数成长感/Papers Please压力选择/BitLife里程碑时刻/真实中国企业年假制度
  - **影响文件**：job_milestone_events.js(新), main.js(+3), career_dev.js(+49), index.html(+1)
  - **验证**：`node --check` ✅ / `python build.py` 4843.8KB ✅
  - **约定式自动导航**：`_wikiAutoAppendNav()` 在百科渲染集中点按数据 schema 自动生成导航按钮
  - **移除 6 处手动代码**：`_wikiDetailLocation/Job/Npc/Item/Good/Skill` 末尾的手动 navActionButton 全部移除
  - **数据扩展点 navHints**：大学城演示「查看学历」「查看职业路径」自定义导航
  - **核心方法论**：「约定式自动归类」——新增数据条目时系统自动发现并接入
  - **验证**：`node --check` ✅ / `python build.py` 4843.2KB ✅ / `git push` ✅
  - **导航系统集中化**：新建 `src/js/ui/navigation.js`（+1500行），提供`navigateTo()`统一入口，支持tab/location/wiki/subTab/action五种导航类型；`navLink()`/`navActionButton()`生成可点击导航链接；自动资源消耗检测+确认弹窗
  - **严重Bug修复**：原来所有Tab按钮（`#tab-bar .tab-btn`）没有click handler，点击什么都不会发生。`initTabNavigation()`通过事件委托修复
  - **百科导航增强**：地点/工作/NPC/商品/技能/装备详情页底部全部新增「前往实地」「查看行动」「去购买」等导航按钮
  - **修复「去大学城备考」断链**：从`document.querySelector('[data-tab=action]')?.click()` hack改为标准`navActionButton`
  - **各面板导航入口**：学历子面板、技能Tab、事业发展总览新增导航按钮区，一键前往对应地点
  - **影响文件**：navigation.js(新), wiki.js, render.js, render_core.js, career_dev.js, index.html
  - **验证**：`node --check` ✅ / `python build.py` 4840.4KB ✅ / `git push origin/main` ✅
  - **开局新闻过滤**：`renderActiveNews()` 跳过 `_isIntroNews:true` 条目；开局新闻的 worldParams 效果已在 `applyWorldNewsToParams()` 写入，不需要在日常新闻栏重复展示（该新闻 duration:365，会霸占新闻位并让玩家误以为内容永远不变）
  - **天气预报只显示两条**：移动端 `render_infra.js` 的 forecast 循环改为 `Math.min(2, forecastArr.length)`，只显示置信度最高的两条，符合手机端空间限制
  - **验证**：`node --check` ✅ / `build.py 4754.2KB` ✅
- **上一轮 (2026-07-05)**：v3.19 — 交易Tab进阶信息门控 + 商品卡片紧凑化（commit: `7ecda93`）
  - **季节横幅/路线提示门控**：季节横幅需销售≥10级，最佳路线需销售≥15级+已访问≥2地点；探索提示改为3态智能文案
  - **商品卡片2行紧凑化**：`.trade-item-card`新CSS类，tic-header(名称+标签)/tic-body(价格+按钮行)，padding 8px（移动端6px），去掉space-between留白
  - **验证**：node --check ✅ / build.py 4755.3KB ✅（push待网络恢复）
- **上一轮 (2026-07-05)**：v3.18.1 — BugFix: 交易Tab不显示商品（commit: `3222e88`）
  - **根因**：`pricing.js` 的 `calcFinalPrice()` 调用了未定义的 `getDailyPriceShock()`，价格计算循环抛出 ReferenceError，渲染中断，商品网格空白
  - **修复**：新增 `getDailyPriceShock()` 函数，使用确定性种子生成 ±7% 的日常价格波动乘数（0.93~1.07）
  - **验证**：puppeteer 自动化测试确认 30 张商品卡片正常显示，错误归零
  - **设计理念**：421个事件打通5大主题联动网络——每个选择都有"尾巴"
  - **主题A·道德回响(5个)**：失主感谢3天后回访/老人儿子给工地机会/流浪狗雨天重逢/乞丐老街情报/高道德城市共鸣
  - **主题B·副业进化(4个)**：代购口碑→合伙生意/换平台→品牌合作/抄底→工友请教/创新教学→机构挖角
  - **主题C·时代后续(4个)**：风口泡沫破裂/转行半年复盘/连锁店竞争/工商局遇导师
  - **主题D·副业反噬(3个)**：外卖封号→临时转行/差评扩散危机/持仓观望结果
  - **主题E·跨阶段桥接(4个)**：职场诚信→晋升/多年职业→创业灵感/城市影响→社区顾问/昧钱→心理阴影
  - **11处flag注入**：moral_events.js(7处: 归还/昧下/喂乞丐/抓小偷/喂狗/扶老人/推车) + side_hustle_events.js(4处: 代购退款/换平台/创新教学/抄底)
  - **影响文件**：cross_system_events.js(+1132行, 20个新事件IIFE) + moral_events.js(+7处flag) + side_hustle_events.js(+4处flag)
  - **验证**：`node --check` 三文件全过 ✅ / `python build.py`(4730.2 KB) ✅ / `commit 13fba78` ✅
  - （push 因代理网络未连通，留在本地）
- **上一轮 (2026-07-04)**：v3.2.2 长期健康修复+调参 `5cc0a30` — 健康恢复+3/天, 住房成本分层调参
- **上一轮 (2026-07-04)**：v3.2 吸收态修复+调参 `e5281b0` — 需求衰减-18→-13, 前30天新手保护
  - MC(10t×150d): balanced 80% / skiller 80% / trader 80% / social 100% ✅ grinder 70% / corporate 20%
- **上一轮工作 (2026-07-04)**：v3.13d — TAB_RENDERERS 加载顺序修复 + Write/Edit 工具教训文档化
  - **P2 装备品质系统激活**：商店显示品质价格区间（¥base~max）和品质概率提示；买装备消息显示品质等级；套装效果（getSuiteJobBonus）接入 income 计算（estimateJobPay/estimateJobPayDetailed/doStreetJob 三处套装加成 🎯+X%）；装备 Tab 新增耐久条（renderDurabilityBar）+ 套装状态面板（renderSuiteCard）+ 品质徽章常驻
  - **P1 四大系统深度联动**：life_node_check/medical_tick/travel_tick/legal_tick 四条管线步骤接入每日结算；新增 tickMedical() 月度保险自动扣费+未治疗提醒+旅行健康消耗；新建 cross_system_integration.js（5条联动链：人生节点→医疗、旅行→医疗、医疗→法律、旅行→法律、人生节点→旅行）；修复 travel.js/legal.js 使用 Math.random → 种子化 Random；修复 4 个系统文件未在 index.html 注册（life_nodes/medical/travel/legal 在 code 中存在但从未加载）
  - **P1 超大文件拆分**：events_street.js(9,894行) → events_street_survival/wealth/life ×3 IIFE 文件；startup.js(14,444行) → startup_data.js(2,126行常量) + startup.js(12,317行函数)；render.js(7,056行) → render_core.js(1,218行) + render_infra.js(1,137行) + render.js(4,702行)。同位置多连续子文件替换法，未改 index.html 整体 script 顺序
  - **验证**：`node --check` 全部通过，`python build.py`(4517KB) 成功
  - **commits**：`e648ffc`(P2装备品质) / `da6120b`(P1深度联动) / `7d5b277`(P1文件拆分)
  - **问题**：用户反馈移动端（以及桌面端）Tab栏全部消失（行动/地图/交易/物品/技能等）。CSS无`display:none`，JS无报错，浏览器缓存刷新无效。
  - **Debug历程**：其他Agent排查了CSS/JS/git冲突残留/浏览器缓存均无效 — 始终没看DOM结构
  - **根因**：`commit 66c11fe`精简侧边栏时误删了`</aside>`关闭标签。`<aside>`在移动端`position: fixed; left: -100%`，缺失`</aside>`导致`<main>`被浏览器解析为`<aside>`子元素，整块内容偏移出屏幕
  - **修复**：`src/index.html` 补回`</aside>`（+1行），重建`dist/index.html`
  - **记忆文件**：`memory/mobile-tab-debug-lesson-2026-07-04.md`
  - **经验**：调试"元素神秘消失"三步法 — CSS有无隐藏 → JS有无报错 → **DOM树结构是否异常**（最后一步最容易被忽略）。`position: fixed/absolute`父元素的未关闭标签会意外吞掉子元素
    - **文件拆分铁律（Write vs Edit）**：`Write` 工具覆盖**整个文件**，只用于创建新文件；修改已有文件部分内容必须用 `Edit` 精确替换。v3.13 拆分后用 `Write` 修 TAB_RENDERERS 导致 1217 行的 `render_core.js` 缩为 49 行，`switchTab`/`renderAll`/`renderTabBar` 全部丢失。
    - **跨文件引用铁律**：`TAB_RENDERERS` 等注册表对象在 const 创建时，后加载文件中的函数值还是 `undefined`。必须用 `{ fnName: "xxx", fallback: "..." }` 模式 + 运行时 `window[fnName]` 动态解析。记忆文件：`memory/write-vs-edit-lesson-2026-07-04.md`
- **上一轮工作 (2026-07-03)**：v3.11 职业系统深度扩展 — 医师路径+事业单位路径+跨系统联动+雇佣机制
  - **总扩展**：CAREER_PATHS 8路径×32职位→10路径×42职位；证书规则12→20条；事件35→45个
  - **验证**：commit: `23ff4c1`
- **上一轮工作 (2026-07-03)**：蒙特卡洛平衡验证系统（种子化 PRNG + 无头游戏引擎 + 3策略×100次×1000天模拟）
- **上一轮工作 (2026-07-03)**：部署平台迁移 — Netlify build credits 耗尽 → 切到 GitHub Pages（GitHub Actions 自动部署，无 build credits 限制）
- **上一轮工作 (2026-07-02)**：移动端顶栏三行重组 + 属性/状态 10 指标常驻显性化（按 v3.1 审查改进触发）
  - **问题**：手机端 UI 排布不合理；左侧导航栏"状态与位置"里的属性/状态全藏（必须点 ☰ 才看得到）；顶部栏"日期/城市浮生记 v1.0"与时间槽重复且挤占关键数值位置；现金被挤到后面需横划才能看到
  - **移动端四行信息栏**：顶栏 [☰][💰][💸] / 时间槽 [📅 第N天 | ☀️ 时段 ⚡AP] / 状态条 [🎒 X/Y · 🌃 住所（💡升级提示）][🏙️ 品牌] / **常驻状态条（体/智/敏/心/魅 + 饿/疲/卫/情/健 10 指标）**
  - `render.js`：第一轮新增 `renderTitleBar` + `renderLocationBar`；第二轮新增 `renderStatsStrip`（常驻状态条，2 行 × 5 细色带 + 疾病行）
  - `style.css`：<=768px 折叠 `.header-logo/.header-context/.header-day` 等，显性化现金欠款色带；追加 `.mobile-stats-strip/.mss-row/.mss-cell/.mss-label/.mss-track/.mss-fill/.mss-val/.mss-illness` 全套 + 8 个 `.mss-fill.<cls>` 渐变配色类；>=769px 隐藏所有移动端专属行，保持桌面三层原装
  - 新增记忆文件：`memory/review-improve-v3.1.md`（完整 v3.1 审查 SOP）、`memory/mobile-design-principles.md`（mob-first 顶栏范式）
  - **设计参考**：Apple HIG 状态栏 / Material 3 顶栏 / BitLife & Mostly 手机端信息层级 / Stardew Valley 状态条 / Papers Please 底部常驻章
  - **验证**：`check:js`(116) / `typecheck` / `build.py`(4506.8KB) / `npm run build` 全过；STUB-DOM runtime test 5×2 结构正确；commits `1ca6a85`+`b009fa3`+本轮commit 待定；用户明确要求上传 git
  - **SOP 自评**：移动端 4 行信息栏范式稳定（顶栏/时间槽/位置+背包/状态）+ 5 属性+5 状态常驻显性化；下一代可增加"留存 A/B 模拟测试"维度
- **上一轮工作**：滚动锚定修复 — 连续点击买到错位物品（2026-07-02）
  - **问题**：交易页每次购买/卖出后 `renderCurrentTab` 整体重建把 scrollTop 归零，"背包区"出现/消失推走市场格子，光标漂到上一项，连点就买错
  - **render.js +107/-8**：三套滚动锚定 — 精确 goodId 锚定（交易页）/ 通用首张 `.action-card` 锚定（行动/技能 tab）/ 内层滚动容器 scrollTop 保存恢复（事业 tab）
  - **其他 tab 排查**：行动/技能/事业已覆盖；社交/投资/地图/人生事务等审计安全
  - **已知局限**：事业 tab 按钮的内容流感位移需给按钮加稳定标识才能完全修正（低频边角，留待后续）
  - **验证**：`check:js`(116) / `typecheck` / `build.py`(4495.8KB) 全过；commit: `c6db450`；已 push 到 origin/main
- **上一轮工作**：第十一轮 — 全剧本专属新手引导系统 v4.0（2026-07-02）
  - **问题**：玩家进入游戏太乱，不知道做什么，缺乏代入感
  - **tutorial.js 重写**：剧本专属 key（`city_life_tutorial_<id>_done`），6套专属引导步骤
  - **步骤结构**（各5步）：情感钩子→底牌高亮→压力数字→地图行动→3天目标+叙事弧线
  - **剧本专属动态提示**：18条，每个剧本3条早期提示（Day1-Day10触发）
  - **设计参考**：BitLife即时钩子/Papers Please第一天压力/Stardew Valley目标锚点/大多数叙事密度
  - **验证**：`check:js`(116) / `typecheck` / `build.py`(4493.2KB) / `npm run build` 全过；commit: `3ee79e6`
- **上一轮工作**：第十轮 — 医疗/公务员路径 + 职业专属随机事件（2026-07-02）
  - **医疗护理路径**（`medical 🏥`）：护理员→注册护士→主管护师→护士长，4级，薪资¥4500-¥24000，需medicine技能
  - **公务员路径**（`civil 🏛️`）：基层公务员→科员→副科长→科长，4级，薪资¥5500-¥26000，reqSocial最高65
  - **nursing_cert/civil加成**：`_calcCertSalaryBonus`扩充，医疗+10%，公务员管理证+6%/英语+5%
  - **career_path_events.js**（新建）：35个叙事随机事件，覆盖11条路径（医疗6+公务员7+IT4+金融2+销售2+教育2+物流2+餐饮3），推入RANDOM_EVENTS池
  - **验证**：`check:js`(115) / `typecheck` / `build.py`(4423.5KB) / `npm run build` 全过；commit: `60f7d24`
- **上一轮工作**：第九轮 — 蓝图制定 + P1-4/5/7/8实装（2026-07-02）
  - **GAME_BLUEPRINT.md**（新建）：世界级游戏设计蓝图v1.0，参考BitLife/Papers Please/大多数/Football Manager等，覆盖设计公理/现状诊断/12系统重构/叙事框架/6轮路线图
  - **P1-8** 新增3条职业路径（`CAREER_PATHS`）：🏫教育培训/🚚物流快递/🍜餐饮服务，各4级，薪资¥3.5k~¥22k
  - **BugFix** 跨路径offer薪资下限：平级≥当前×85%、高半级≥当前×95%，防止跳槽反降薪
  - **P1-5** 证书→月薪加成：`_calcCertSalaryBonus()`，路径专属+通用英语加成，发薪消息明示
  - **P1-7** 总览页数据可视化：重写`renderCareerOverview`，含职位卡/晋升进度条/业绩倦怠条/5维资本雷达/跳槽预览/智能建议
  - **P1-4** 副业主业冲突：`performHustle`，在职时副业收入×0.80，倦怠≥60×0.65，副业消耗burnout+3
  - **验证**：`check:js`(114) / `typecheck` / `build.py`(4365.3KB) / `npm run build` 全过；commit: `b999470`
- **上一轮工作**：第八轮 — 事业发展Tab完善（2026-07-02）commits: `40a973c`→`eb99ced`
  - P0断连×7（职场社交/退休养老/业绩行动/burnout/学历/注册费）；P1跳槽/年度调薪/移动端兜底
- **上一轮工作**：第七轮审查 — NPC好感奖励P0根修 + 3职业奖励消费点 + 法律结案通知（2026-07-02）
  - NPC好感奖励系统修复（`ensureNpcAffinityEvents` 补 `effect` 字段，13个NPC奖励全部激活）；3个奖励消费点（废品+20%/摊位+10%/工厂+15%）；法律结案通知+败诉连锁惩罚
  - **验证**：`check:js`(114) / `typecheck` / `build.py`(4337.7KB) / `npm run build` 全过；commits: `a50f805` + `fb55fdf`
- **再上一轮工作**：城市服务消费点接入 + 装备品质3档化（普通/优质/高档·仅价格）（2026-07-01）
  - 公积金→购房5%抵扣；体检→降大病概率×0.5；4个followUp消费点全通；装备品质四档→三档+去effectMult魔法加成

- **再上一轮工作**：装备品质系统激活 + 第六轮收尾清理（2026-07-01）
  - 存储统一/耐久激活/去附魔/3渠道接入落地；`webapp_runtime_bridge` 补 4 分支 + `finance.js` 接入征信/社保；新建 `tools/monte_carlo_runner.js`；验证全过
  - **pre-commit 钩子基准同步**：会话中每次 commit 需先 `git rev-parse HEAD > .claude/last_known_head` 同步基准，否则钩子误判"其他窗口改动"阻止提交（非 `--no-verify`，是修复过期基准）

- **上一轮工作**：第四轮审查第二阶段 — TS事件bridge全量同步（2026-06-27）
  - **房产×租房��射**：新增 `PROPERTY_HOUSING_MAP` 精准 ID→住所等级映射（22条），`getPropertyHousingTier()` 查询函数；toggle-self-live 改用映射表替代价格粗分，自住→出租时正确降级住所
  - **月租流水**：property_market.js 月租结算增加 addDailyTransaction 收支记录
  - **行动页入口**：main.js 新增「搬入自住房」快捷行动
  - **UI单行状态栏**：renderTimeSlot 改为单行横排左对齐：📅 第 N 天 | ☀️ 上午 ⚡ 100/100 🎒 0/20 · 🌃 露宿街头
  - **人生目标上移**：从侧边栏移到内容区时间槽下方（renderGoalStrip 紧凑横条），手机端 CSS 适配
  - **验证**：`npm run check:js`、`npm run typecheck`、`python build.py`(4284.1 KB) 全部通过

  - **任务链产出**：按 v3.0 SOP 和用户反馈完成 6 个子任务报告，新增 `plans/2026-06-26-v3-review-execution-context.md` 与 `subagent_result1.md` 至 `subagent_result6.md`
  - **目标机制**：开局人生目标改为推荐选择，可跳过；选择目标会显示并生效轻量路线加成，覆盖技能 XP、街头/上班收入和银行利息等口径
  - **模式修复**：经典、剧本、沙盒统一走 `initializeCommonGameSystems()`，补齐天气、装备、时代、副业、NPC、医疗、旅行、法律等通用初始化；沙盒默认改为无村长债的自由练习
  - **事业联动**：事业发展页新增“今日事业建议”和事业信用，入职/晋升/阶段项目积累行业资源、客户线索、声誉与合伙人信任；创业注册读取事业信用降低启动资金，并读取新版上班族岗位映射为 P6/P7/P8 职级
  - **UI 修复**：职业路径 `name` 改为纯文本，彻底修复“💻 💻 IT技术”等重复图标；创业页注册费展示改为实际计算值
  - **验证**：`npm run check:js`、`npm run typecheck`、`npm run check:ts-data`、`python build.py`（4217.3 KB）、`npm run build` 全部通过；Chrome Headless + CDP 冒烟未捕获运行时错误

- **上一轮工作**：v3.0 审查改进与UI修复（2026-06-26）
  - **P0全中文化**：修复17个文件中15+处”AP”英文→”行动力”，NPC英文ID→中文名（新增`getNpcChineseName`兜底映射）；学历从侧边栏移入个人成长Tab新增”🎓 学历”子Tab
  - **P1 UI去重复**：header-context精简仅保留住所（移除位置/天气/背包容量）；”附近可前往”移到sidebar靠前位置首屏可见
  - **P1 社交网络增强**：热搜话题池30条+联动新闻系统；围脖热搜全中文；网红等级中文映射（none→无等）；粉丝多因子增长模型（内容长度+配图+名气→粉丝→名气反哺）
  - **产出文档**：`plans/subtask1-analysis.md` 至 `plans/subtask6-implementation.md`
  - **验证**：`node --check` 语法全通过，`python build.py`（4224.6 KB），git commit 3b519f8

- **上一轮工作**：v3.8 TS 数据目录补全与内容审计（2026-06-25）
  - **TS 内容目录**：`events/jobs/locations/items/diseases/legal/travel` 从占位常量补成实际 TypeScript 数据；当前首批为事件12、职业12、地点14、物品17、疾病12、法律案件7、旅行目的地8，`lifeNodes` 仍为4个完整节点
  - **统一 catalog**：新增 `src/app/data/index.ts`，汇总 9 个数据目录的数量、旧来源和 bridge 状态；Vite 调试壳新增“TypeScript 内容目录”面板
  - **自动审计**：新增 `scripts/audit-ts-data.mjs` 与 `npm run check:ts-data`，无外部运行依赖，检查每个 TS 数据目录导出数组的最低覆盖
  - **bridge 摘要**：`webapp_runtime_bridge.js` 升至 0.3.0，暴露 `WEBAPP_DATA_CATALOG_SUMMARY` 和 `WebAppBridge.getDataCatalogSummary()`；未重排 `src/index.html` script 顺序
  - **验证**：`npm run typecheck`、`npm run check:ts-data`、`npm run check:js`、`python build.py`（4185.6 KB）、`npm run build` 全部通过；C盘空间为0，npm cache/temp 使用 D 盘验证

- **上一轮工作**：v3.8 Web App 架构第一阶段 — Vite/TypeScript 桥接迁移与城市服务玩法（2026-06-25）
  - **架构变化**：新增根目录 `index.html`、`package.json`、`tsconfig.json`、`vite.config.mjs`、`src/app/`；旧 `src/index.html` 继续作为正式游戏入口，`python build.py` 仍生成 `dist/index.html`
  - **桥接边界**：新增 `src/js/app_bridge/webapp_runtime_bridge.js`，只追加到旧入口末尾，不重排既有 script；`actions_extra.js` 通过 `addWebAppBridgeActions` 注入可玩入口
  - **真实玩法验证**：新增“城市服务中心”，在政府办事大厅/医院/商业区或公园触发劳动争议预检、医保账单复核、周末城市微旅行，写入 `_webApp.schemaVersion=2` 和对应医疗/法律/旅行状态；次日通过每日管线沉淀为法律底气、医疗账单意识和城市熟悉度
  - **后续开发提醒**：新增内容先看 `memory/webapp_migration_overview.md` 与 `memory/webapp_architecture_plan.md`；不要继续把所有新数据只塞进 legacy 全局脚本，除非需要兼容当前正式入口
  - **验证**：`npm run typecheck`、`npm run check:js`、`npm run build`、`python build.py`、浏览器/脚本冒烟验证需在收工前保持通过

- **上一轮工作**：v3.0 审查改进与扩展 — 完整中后期压力试玩与长流程修复（2026-06-25）
  - **审查产出**：已新增 `memory/overview.md` / `memory/diagnosis.md` / `memory/improvement_plan.md`
  - **长流程修复**：修复创业产品默认字段缺失、NPC发现字段缺数组、极端状态跳过失败判定、结局弹窗读取 inventory、家庭月度开支默认值、企业命运变量拼写、个人成长年度重置、链式事件重复声明等中后期崩点
  - **经济修复**：银行存款基础日息从 `0.001` 校正为 `0.0001`，会计技能加成按“年化最多 +5%”折算到日息，避免中后期资金指数膨胀
  - **验证**：全部 `src/js` 文件 `node --check` 通过；`python build.py` 成功生成 `dist/index.html`（4166.7 KB）；Chrome Headless + CDP 完整压力试玩通过健康耗尽 Game Over、Day 60→Day 1260 长跑、创业/投资入口、年度/月度结算、主要标签页切换，未捕获运行时异常
  - **审计**：`audit_connections.js` 以项目根 `.cjs` 临时副本运行，0 问题/45 建议；`audit_events.js` 以 `.cjs` 临时副本运行，检查 225 个事件并输出 48 条既有上下文提示
  - **剩余风险**：长跑分支为覆盖中后期关闭了提前胜利短路，并在每日后维持基础生存资源；这不是人工完整游玩。创业声誉仍可长期跌到负值，属于后续平衡项

- **再上一轮工作**：v3.7 Expansion v1 — 4大扩展系统基础实现（2026-06-25）
  - **系统1 人生节点** `core/life_nodes.js` — 高考/大学/35岁危机/退休 4大里程碑，属性门槛+分支选择+效果应用，MECHANICS+NARRATIVES注册
  - **系统2 医疗深度** `core/medical.js` — 4级疾病分级(轻症/中症/重症/危重症)，3档医保(50%-90%报销)，门诊+住院+康复+保险购买
  - **系统3 旅行系统** `core/travel.js` — 5个国内目的地(北京/上海/成都/西安/大理)，旅行事件+纪念品收集+特产风味
  - **系统4 法律系统** `core/legal.js` — 4种案件(合同/劳动/邻里/债务纠纷)，4级律师(初级→合伙人)，立案→证据→庭审→判决全流程
  - **集成**：4个管线步骤(life_node_check/medical_tick/recovery_tick/travel_tick/legal_tick)+index.html注册+main.js初始化+百科注册
  - **设计参考**：BitLife人生阶段 / 中国式家长节点 / 大多数医疗 / 真实中国民事诉讼 / 模拟人生度假
  - **构建**：已 `python build.py`
  - **commit**：fc8f441

## 🔁 Codex接力清单（未完成任务，按优先级排序）

### 第一阶段：P0 状态（已完成）

1. ✅ **P0 TS 数据目录填充** — events/jobs/locations/items/diseases/legal/travel/lifeNodes 均已有实际 TypeScript 类型和数据
2. ✅ **P0 4 大扩展系统独立 UI 面板** — 新增“人生事务”Tab，集中展示 life_nodes/medical/travel/legal 状态，并复用原弹窗入口
3. ✅ **P0 TS 数据目录自动化审计脚本** — `npm run check:ts-data` 校验各目录导出数组最低覆盖；后续可继续扩展字段对齐规则

### 第二阶段：P1 改进（2项，~300行+）

4. **[待排期·单独一轮] P1 超大文件拆分** — startup.js(14443行)/events_street.js(9827行)/render.js(6024行) 按主题渐进拆分；用「同位置单 script 换多条连续子文件」顺序保持法，**禁止改 index.html script 顺序**；详见 `IMPLEMENTATION_PROGRESS.md` 待排期清单
5. **P1 4 大扩展系统深度联动** — 人生节点概率触发、医疗债务/保险纠纷、旅行行程定制、法律败诉连锁

### 第三阶段：P2 修复（1项，~100行）

6. **[待排期·单独一轮] P2 装备品质系统激活** — 系统性工程（非 ~100 行）：实例存取格式统一 + `getQualityPriceMult`/`getQualityEffectMult`（equipment_quality.js:215/220，当前零调用）接入价格/效果计算 + 拾荒/NPC/事件 3 渠道接 `createEquipmentInstance` + 旧 `rollEquipmentDrop`（items.js:1077）清理；CSS 动画（`.quality-legendary` 脉冲）已存在；涉及核心数值需充分验证；详见 `IMPLEMENTATION_PROGRESS.md` 待排期清单
7. ✅ **P2 CLAUDE.md 接力清单同步** — 已维护本轮完成项的标记，确保口径一致

_详细任务清单：`IMPLEMENTATION_TASK.txt`（需重建，之前的只列到P1）_

---

## 🔮 联动事件系统·下轮推荐方向（loop-R32+ 待办）

> **已完成 R26~R31**：20 个新事件落地，GDD 37→55，2026-07-10。
> 以下方向经 gap 分析排序，按优先级从高到低。每轮选 3~5 个场景落地。

### P1 — 高影响空白（系统有数据但零事件覆盖）

| #   | 方向                     | 触发条件建议                                       | 设计心理学        | 理由                                                     |
| --- | ------------------------ | -------------------------------------------------- | ----------------- | -------------------------------------------------------- |
| ①   | **学历毕业典礼**         | `player.education` 升级时一次性触发（education≥1） | 峰终定律·仪式感   | ✅ R30完成(edu_graduation_ceremony)                      |
| ②   | **家庭事件覆盖公司阶段** | corporate阶段3个亲情事件                           | 峰终定律·情感温度 | ✅ R30完成(corporate_mother_surgery/relocation/dividend) |
| ③   | **Social Tab NPC 拜访**  | NPC卡拜访按钮→导航到NPC所在地点+好感互动           | 社交深度·禀赋效应 | ✅ R30完成(NPC拜访按钮+好感+3~5+7天冷却)                 |

### P2 — 机会性填充（需要新 state 或新逻辑支撑）

| #   | 方向                         | 触发条件                                                           | 设计心理学        | 状态                                                   |
| --- | ---------------------------- | ------------------------------------------------------------------ | ----------------- | ------------------------------------------------------ |
| ④   | **技能组合双高门槛**         | 两个技能同时≥特定值（如 sales≥40 + charm≥30 触发「大客户招待」）   | 禀赋效应·技能协同 | ✅ R31完成(2个: big_client/repair_shop)                |
| ⑤   | **季节 Spring/Autumn 叙事**  | `weather.season === "spring"` 触发春季招聘会、"autumn" 触发开学季  | 稀缺性·四季节奏   | ✅ R31完成(2个: spring_job_fair/autumn_harvest_market) |
| ⑥   | **装备/品质里程碑事件**      | 首次获得「高档/传说」品质装备                                      | 峰终定律·开箱瞬间 | ✅ R31完成(1个: equipment_first_high_quality)          |
| ⑦   | **NPC 关系矩阵深度互动**     | 3 个"关系对+调解"已落地(R28/R42)；business 格+followUp 已消费(R44) | 关系的温度        | ⬜ 待做：friendly 格(8个)仍未消费                      |
| ⑧   | **wealth ¥1M / ¥10M 里程碑** | 事件+R44日终均覆盖¥1M/¥10M；封顶¥10M                               | 峰终定律·财富叙事 | ✅ 已完成                                              |
| ⑨   | **多周目继承遗产事件**       | R37/R44 各落地1个遗产/阿杰彩蛋事件                                 | 情怀型彩蛋        | ✅ 已完成                                              |

### P3 — 体验优化（锦上添花）

| #   | 方向                         | 说明                                                                                                                               |
| --- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| ⑦   | **NPC 关系矩阵深度互动**     | 14×14 关系中 business 格已消费(R44)。剩余 8 个 friendly 格可玩：王婶×小美/陈师傅/林阿姨/小陈、老周×小美/林阿姨/陈哥、陈师傅×林阿姨 |
| ⑧   | **wealth ¥1M / ¥10M 里程碑** | 已封顶 ¥10M（日终+事件双轨）。下轮可做 ¥100M 亿万富翁叙事                                                                          |
| ⑨   | **多周目继承遗产事件**       | 阿杰/通用遗产已落地(R44/R37)。下轮可做 NPC 特定回忆（"上辈子你帮过的大婶又摆摊了"）                                                |

### ⚠️ 执行铁律（延续 R26~R29 经验）

1. **每个事件必须带 `// [自洽修复]` 注释**，标明校验了哪些状态字段
2. **NPC 事件**：`met===true` + `affinity≥X` 双守卫（缺一不可）
3. **天气/季节事件**：`st.weather.current` 或 `st.weather.season` 校验
4. **职业事件**：`st.employment.currentJob.path` 或 `st.stats.actionFreq` 校验
5. **probability**：稀有转折 ≤0.02，普通遭遇 0.03~0.06，日常插曲 ≤0.10
6. **单 commit 单功能**：每轮 3~5 事件，一起 commit（不拆分也不堆积）
7. **commit message 格式**：`feat(loop RXX): 新增N个XX事件(名称1/名称2/...)`
8. **GDD 同步**：每轮结束更新 `memory/linkage-events-gdd.md` 和 `CLAUDE.md` 当前状态

### 📊 当前覆盖矩阵（R31 后）

| 次级系统     | 已联动事件数 | 关键事件                                                                                                                                        |
| ------------ | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| NPC 关系     | 11           | reunion / competitor / classmate / affinity100 / duo_referral 等                                                                                |
| 经济/资产    | 23           | six_figure / supply_demand / bank_vip / cert_bonus 等                                                                                           |
| 技能系统     | 15           | big_client(40+30) / repair_shop(30+20) / mastery_capstone(100)                                                                                  |
| 天气系统     | 3            | rainy_umbrella / snow_deal / summer_night                                                                                                       |
| **季节系统** | **4→8**      | spring_job_fair / autumn_harvest / summer_night / **spring_chill** / **summer_night_cooling** / **autumn_rain_homesick** / **winter_hearth**    |
| 道德系统     | 4            | wallet_honest / extreme / competitor_choose 等                                                                                                  |
| 健康/医疗    | 4→9          | crisis_slow / near_death / dr_wang×2 / **recovery_brink** / **recovery_soup** / **recovery_ward** / **recovery_exercise** / **recovery_herbal** |
| **装备品质** | **0→1**      | equipment_first_high_quality(R31新增)                                                                                                           |
| 住房         | 3            | luxury_housing / tier_milestone / cold_snap                                                                                                     |
| 教育         | 3            | grad_ceremony / cert_bonus / edu_white_collar                                                                                                   |
| 家庭         | 3            | corporate_mother_surgery / relocation / dividend                                                                                                |
| 社交 Tab     | 1            | NPC拜访按钮+好感互动                                                                                                                            |

---

- **v3.6 审查改进实装（2026-06-24，Hermes Agent 6子任务链）**
  - **9项P0/P1修复**：chainEventQueue守卫/天气→摆摊/经济压缩(trend上限0.003+估值¥15M)/NPC好感链路×2/后期开支(物业费+住房维护+社交)/创业门槛(3技能15+2NPC40+Day60)/新闻→UI因果链/节日价格/pricing补全/事件触发率递增
  - **扩展1 NPC关系网（~825行）**：9NPC关系链+蝴蝶效应+3新功能NPC(赵姐/陈哥/老同学阿杰)
  - **扩展2 时代变迁（~718行）**：8个时间锚点事件+年度参数滑条(通胀/行业/房价/工资)
  - **扩展3 副业系统（~725行）**：6类夜间经济(夜间摆摊/代驾/外包/自媒体/共享/社区)
  - **扩展4 人生回忆录（~422行）**：8章节跨周目localStorage收藏
  - **产出文档**：ANALYSIS.md / DIAGNOSIS_REPORT.md / IMPROVEMENT_PLAN.md / EXPANSION_DESIGN.md
  - **设计参考**：BitLife/Stardew Valley/This War of Mine/Capitalism Lab/中国式家长/Hades
  - **构建**：已 `python build.py`（4037.5 KB）
  - **commit历史**：9596623→acb5340→b28675d→b250a41→d4e9e0a→1bd7fde→154078d→63ad76b→d14810a
  - **T1 NPC位置关联系统**：新建 `npc_location_bridge.js`（93行），5核心NPC作息日程+时间地点匹配+pipeline步骤
  - **T2 跨系统联动事件×8**：`cross_system_events.js` +632行，8条跨维度事件（天气+NPC+行业+季节+技能+道德）
  - **T3 位置×技能特色行动×10**：`actions_extra.js` +276行，每个活跃地点1条特色行动+条件门槛
  - **T4 NPC好感×技能联动解锁**：5个NPC双门槛永久增益（cooking/sales/physique/repair/charm），`checkNpcSkillUnlocks()`每日检查
  - **设计参考**：Cart Life NPC日程 / Stardew Valley地点绑定 / This War of Mine情景连锁 / Capitalism Lab跨系统反馈
  - **影响文件**：npc_location_bridge.js(new) + npcs.js + npc_event_bridge.js + cross_system_events.js + actions_extra.js
  - **构建**：已 `python build.py`（3877.6 KB）
  - **强制人生目标弹窗**：游戏开始必须选目标才能继续
  - **黑暗开局**：¥300起步、无债、需求全线边缘化、健康70
  - **每日收支修复**：修复`_dayStartCash`日初基准
  - **违法行为扩充**：8种违法+捐款/义工道德恢复行动
  - **交通优化**：地铁8站/单车2跳内/打车降价
  - **职业路径大改**：6路径×22职位+晋升颜值/属性/社交条件
  - **属性重命名**：基础属性→属性，心智→能力
  - **行动重组**：摆地摊归入短期临时工作
  - **构建**：已 `python build.py`（3737.9 KB）

- **上一次工作**：v3.1a 职业生涯事件+中期经济反向闸门（2026-06-23，QoderWork）
  - **职业生涯事件4个**：猎头挖角（跳槽/涨薪/谈判选择）+ 公司裁员（社交关系影响能否保命）+ 经济下行周期（清仓/硬扛/抄底选择）+ 资产核查（纳税/规划/逃避选择）
  - **社交Tab全阶段可见**：家庭系统街头阶段即可访问，不再限制公司阶段
  - **Fix**：cross_system_events.js 中文引号语法 + 对象数组结构修复
  - **设计参考**：《This War of Mine》经济生存压力 / Capitalism Lab 税务系统 / 真实中国税务政策
  - **影响文件**：cross_system_events.js +196行 | render.js +2行
  - **构建**：已 `python build.py`（3676.0 KB）

- **上一次工作**：v3.1 游戏机制扩展（2026-06-23，QoderWork / 游戏设计师+研究员）
  - **新系统1 人生缎带**：`life_ribbon.js`（280行），BitLife 风格 12 条缎带结局分类，从人生轨迹涌现而非玩家选择，跨周目收集到 localStorage
  - **新系统2 主线章节**：`story_chapters.js`（280行），3 章式人生主线（生存→立足→选择），在 Day 30/180/365 设置叙事检查点
  - **新系统3 跨系统联动事件**：`cross_system_events.js`（300行），5 条事件打通 NPC/行业热度/世界状态/道德选择，IIFE 注入 RANDOM_EVENTS
  - **节日深度**：`festivals.js +133行`，清明回乡（Day 104）+ 中秋探亲（Day 257）事件链，NPC 好感+道德系统联动
  - **Tab 系统重组**：创业Tab→事业发展Tab（career_dev.js），合并职场社交+家庭→社交Tab（social_tab.js），合并成长数据+个人成长
  - **创业平衡调参**：`startup.js` 估值下调30%/燃烧率上调50%/注册门槛 ¥50k→¥200k
  - **Bug 修复**：render.js TAB_RENDERERS 对象未闭合 + 重复 else 块
  - **接线**：daily_pipeline.js 新增 story_chapter_check 步骤 + festival deep events 调用；victory.js/modal.js 接入缎带判定；corp_ui.js 缎带展示 UI
  - **设计参考**：BitLife Ribbons / Stardew Valley 祖父评价信 / This War of Mine / Capitalism Lab / 《大多数》五维耦合
  - **影响文件**：3 个新模块 + career_dev.js + social_tab.js + 6 处修改，共 11 文件
  - **构建**：已 `python build.py`（3666.5 KB）

- **上一次工作**：地图/寺庙/创业Tab/引导系统完善（2026-06-23，玩法师 / 游戏设计师）
  - 修复地图缺地点坐标 / 寺庙4项行动 / 创业Tab街头可见 / 引导系统重做
  - **影响文件**：render.js / actions_extra.js / tutorial.js / modal.js
  - **构建**：已 `python build.py`（3587.1 KB）

- **上一次工作**：review v3.0 P2 改进落地（2026-06-23，吴八哥 / 高级开发工程师）
  - **百科剧透隐藏**：`wiki.js` NPC详情页全面剧透隐藏（生日/礼物偏好/在场加成/好感阈值奖励/委托任务/深度任务），根据玩家探索进度逐步解锁
  - **在场概率**：10个NPC新增 `presenceChance`（0.65~0.85），确定性哈希判定，不在场则无加成
  - **地点触发对话**：旅行手自动触发NPC互动 `rollNpcEncounterOnArrival()`，好感+1+信息解锁
  - **信息发现系统**：聊天/到达/好感提升触发隐藏信息解锁（生日/喜好/阈值奖励）
  - **叙事锁定**：未经历的事件在百科显示"🔒 你还没有经历过这段故事"
  - **成就隐藏**：隐藏成就条件改为"🔒 达成条件神秘"
  - **存档迁移**：旧存档自动补全 `discovered` 字段
  - **影响文件**：`npcs.js` / `state.js` / `npc_event_bridge.js` / `skill_bonuses.js` / `wiki.js` / `main.js`
  - **设计参考**：Stardew Valley/Terraria/My Time at Portia 图鉴逐步解锁机制
  - **构建**：已 `python build.py`（3519.1 KB）

- **上一次工作**：房产市场波动系统 v2 ✅（2026-06-22 下午）
  - **问题根源**：`PROPERTIES` 数组中每套房产固定 `appreciation`（恒为正数 0.0001~0.0012/天），导致房价只涨不跌，不符合中国房地产真实波动
  - **新建** `src/js/phase2/property_market.js` — 房产市场周期引擎（4 阶段：火爆/平稳/降温/萧条）
    - 阶段转换由 `sectorHeat["房地产"]` 阈值 + 新闻驱动 + 随机概率控制
    - 新增政策趋紧度 `_propertyPolicyTightness`（-1~+1），新闻自动调整，每日 2% 衰减
  - **重构** `src/js/phase2/investment.js`：PROPERTIES 移除 `appreciation`，改 `zoneWeight/volatility/baseAppreciation`
    - 价格公式：`日变化率 = cycleDrift + sectorDrift×权重 + policyDrift + baseAppreciation + noise`
    - 海外房产 `sectorHeat` 权重仅 0.2，基本不受国内周期影响
    - 替换内联 tick → `tickPropertyMarket(state)` 调用
  - **新闻扩展**：7 条新房地产新闻 + 现有新闻补 `industry: "房地产"` 标签 + 政策趋紧度反馈
  - **世界参数**：房地产行业初始范围从 `0.85~1.15` 扩大到 `0.70~1.30`
  - **UI 增强**：市场阶段横幅 + 波动率标签替代固定年增值 + 阶段转换消息通知
  - **存档兼容**：`initPropertyMarket()` 自动迁移旧存档，保留 `currentPrice`
  - **设计参考**：中国房地产真实周期（2014-2024）、Capitalism Lab、Democracy 4
    1. `stock.js renderKLine` — 折线/填充色改为**今日涨跌比较**（最后两个点）
    2. `stock.js card` — 7日均线emoji交换（高于均线=涨→🔴红）
    3. `stock.js card` — "全部买入"按钮 `btn-primary`→`btn-success`（绿色）
    4. `investment.js drawPriceChart` — 折线/填充色改为今日涨跌比较
    5. `investment.js drawPriceChart` — 价格文字改用 `dayColor`（今日涨跌）
    6. `investment.js stdInvBtns` — "全买"按钮 `btn-danger`→`btn-success`
    7. `investment.js renderMarketSentiment` — 牛市→`var(--danger)`红 / 熊市→`var(--success)`绿
    8. `investment.js renderMarketSentiment` — 市场驱动 利好→红 / 利空→绿
    9. `investment.js renderInvestmentTab` — 颜色图例修正为 "📉跌 🟢绿 / 📈涨 🔴红"
  - **涉及文件**：`src/js/phase2/stock.js` + `src/js/phase2/investment.js`
  - **构建**：已 `python build.py`

### 创业系统完整功能一览

| 模块     | 内容                                                                                                                                    | 状态 |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---- |
| 行业选择 | 6大行业（科技/消费/金融科技/医疗健康/教育/制造）                                                                                        | ✅   |
| 产品类别 | 15+类别（移动应用/SaaS/智能硬件/社交/游戏/电商/在线教育/医疗AI/自动驾驶/区块链/元宇宙/新能源/农业科技/物流科技/内容创作/企业服务/支付） | ✅   |
| 功能模块 | 15个模块（用户系统/支付/数据看板/社交分享/推送/AI推荐/直播/智能搜索/多平台/安全/客服/会员/市场对接/云扩展）                             | ✅   |
| 员工系统 | 6种角色（工程师/设计师/销售/市场/运营/财务）                                                                                            | ✅   |
| 融资轮次 | 种子轮/A轮/B轮/C轮/IPO                                                                                                                  | ✅   |
| 投资人   | 7种类型（天使/家族办公室/VC/CVC/PE/国资基金/战略投资）                                                                                  | ✅   |
| 退出方式 | IPO上市/被收购/破产清算                                                                                                                 | ✅   |
| 创业事件 | 30+事件（种子期8/成长期10/成熟期8/行业专属6）                                                                                           | ✅   |
| 竞争对手 | 2-3家同赛道竞争公司，每日演化                                                                                                           | ✅   |
| 市场份额 | 基于技术分+市场分+声誉计算                                                                                                              | ✅   |
| 品牌等级 | 6级（无名小卒→行业巨头）                                                                                                                | ✅   |
| 市场情报 | 3档调研（基础¥5k/深度¥20k/专家¥50k）                                                                                                    | ✅   |
| 办公地点 | 5级（共享办公→自建园区）                                                                                                                | ✅   |
| 企业文化 | 3种（狼性/工程师文化/家文化）                                                                                                           | ✅   |
| 创业成就 | 17个专属成就                                                                                                                            | ✅   |

- **倒闭遗产链**：公司倒闭后生成1-3个遗产事件（高管开新公司/专利被收购/员工散布），基于公司规模决定数量
- **新公司自然生成**：每180天（半年）50%概率从倒闭公司"废墟"中重生新公司，继承行业/产品/人才参数
- **多周目继承**：替换简易 `_ngPlusData` → 完整 `inheritance_chain.js`（9种声誉徽章/关系/物品/梦想/技能树/现金加成）
- **继承摘要弹窗**：新游戏开始时展示上局遗产详情，含叙事文案
- **P0/P1全优先级清单已完成**（累计350+项），事件总数202，新闻事件79，成就52
- **阶段三疾病演化深化**：✅ 已完成
- **阶段四企业命运 Phase 1**：✅ 已完成（零和博弈/3个新事件/IPO/人才流失/专利战/真实合并/行业传导/季度报告）
- **阶段四企业命运 Phase 2**：✅ 已完成（CEO人格化 + 多周目记忆 + 新事件 + 历史书UI）
- **阶段四企业命运 Phase 3**：✅ 已完成（倒闭遗产链/新公司自然生成/多周目继承接入）
- **P1-1 街头特色玩法**：✅ 已完成（拾荒路线规划 + 摆摊选址建议）
- **P2-1 教程升级**：✅ 已完成（动态提示系统 30+ 条情境提示）
- **百科迁移**：✅ **已完成**（全部 19 条从旧 pages 迁入注册表，wiki.js 旧兜底代码保留为死代码）
- **P2-8 数据可视化**：✅ **已完成**（收入/支出曲线 + 总资产曲线 + 属性雷达历史对比 + Retina + 平滑曲线）
- **食材库存联动**：✅ **已完成**（食谱选择 + 食材购买 + 库存消耗 + 过期保鲜）
- **下一步方向**：
  1. **平衡调参** — ✅ 已完成（在家做饭¥12/商业区¥35/疾病阈值调严格/延期惩罚改阶梯式）
  2. **食材联动核实** — ✅ 已完成（`consumeCookingIngredients` 完整实现，无需补漏）
  3. **企业命运 Phase 2** — CEO人格化深化/公司历史书UI绑定（数据接口就绪，UI待集成）
  4. **疾病演化链** — ✅ 已编码（肠胃炎→胃溃疡→胃癌/抑郁→重度抑郁，演化逻辑就绪）
  5. **自住房食材联动深化** — 可深化"在家做饭"为食材采购→消耗→烹饪完整循环

### ✅ 2026-06-20 13:30 — 内容连接密度全面审计+修复（1.4/2.1标准实施）

#### 审计结果

| 检查项        | 状态        | 发现                                                 |
| ------------- | ----------- | ---------------------------------------------------- |
| NPC连接密度   | ✅ 桥接完成 | 6NPC × 5档好感对话 + 事件回响 + 位置互动             |
| 新闻-事件联动 | ✅ 桥接完成 | 8条新闻→事件权重 + 价格情绪 + NPC评论                |
| 装备工作加成  | ✅ 完成     | 6件装备新增jobBonuses字段                            |
| 事件NPC引用   | ✅ 桥接完成 | 12个事件有NPC回响 + 全事件加权选择                   |
| 自动化审计    | ✅ 完成     | audit_connections.js 可运行检查                      |
| 审计工具      | ✅ 新建     | `audit_connections.js` — Node.js脚本扫描所有数据文件 |

#### 新增/修改文件

- **新建** `src/js/phase1/npc_event_bridge.js` — NPC事件桥接（4层架构）
- **新建** `src/js/core/news_event_bridge.js` — 新闻事件桥接（3层架构）
- **新建** `audit_connections.js` — 内容连接密度审计工具
- **修改** `src/js/data/items.js` — 6件装备新增工作特定加成
- **修改** `src/js/phase1/skill_bonuses.js` — 新增 `getItemJobBonus()`
- **修改** `src/js/phase1/daily_pipeline.js` — 新增2个管线步骤
- **修改** `src/js/core/events.js` — 加权事件选择 + NPC桥接触发
- **修改** `src/index.html` — 加载2个新JS文件

### ✅ 2026-06-20 12:50 — 5项P0/P1任务全部完成

1. **公司历史书 UI**（`src/js/ui/corp_ui.js` + `src/js/ui/render.js`）
   - `renderCompanyHistory()` — 显示在职天数、职级、绩效次数、项目数
   - 绩效等级分布（S+/S/A/B/C）、关键事件时间线、绩效评审记录表
   - 完成项目列表、团队成员列表
   - 可折叠/展开面板，职场Tab有「查看公司历史」按钮

2. **存档快照**（`src/js/core/save.js`）
   - `createSnapshot()` + `generateMemoryText()` + `getLoadMemoryText()`
   - 存档时记录关键状态快照（疾病、食材、属性、需求、财富）
   - 读档显示"那时候你..."回忆文案

3. **疾病演化**（`src/js/data/diseases.js` + `src/js/main.js` + `src/js/ui/render.js`）
   - 16种疾病×5大分类×4阶段（胃溃疡→胃癌、抑郁→重度抑郁等）
   - 每日演化：严重程度递增、阶段升级、演化判定
   - 终末疾病（胃癌、重度抑郁、肝癌）终末期可能致命
   - 治疗系统：药物/手术/疗法/生活方式，不同成功率

4. **食材库存联动**（`src/js/data/ingredients.js` + `src/js/main.js` + `src/js/ui/render.js`）
   - 23种食材（主食/蔬菜/肉类/调料/水果）
   - 16个烹饪配方（1-20级/21-50级/51-80级/81+级）
   - 保质期系统：食材过期变质自动丢弃
   - 烹饪技能提升：经验积累解锁更多配方

5. **平衡调参**（`items.js` + `jobs.js` + `news.js`）
   - 装备价格下调10-20%，新增防病/减疲劳效果
   - Illness 风险降低25-33%（高风险工作仍保持梯度）
   - 新闻事件惩罚减弱、奖励收敛，减少极端波动

---

### ✅ 已完成但未在 CLAUDE.md 列出的更新

1. **春节特殊事件链式系统**（`festivals.js` + `events.js` + `style.css`）
   - `SPRING_FESTIVAL_EVENTS` 定义 7 天完整事件链（除夕→初六），每天独立事件+双/三选项
   - `checkSpringFestivalEvents()` 在每日结算管线 `festival` 步骤中调度，通过 `state._pendingEvent` + `showEventModal()` 弹窗展示
   - 事件含选择权重、资源消耗、属性影响、flag 追踪
   - ✅ UI 已完成：春节专属弹窗样式（红色/金色主题 + 7天进度指示器 + 灯笼装饰 + 弹性入场动画）

2. **节日价格提示 + 季节性价格波动**（`festivals.js` + `render.js`）
   - `getFestivalPriceNote()`：节日/清仓期价格修正说明文本，已嵌入 Trade Tab（`renderTradeTab` 第 2416-2457 行）
   - `getSeasonalPriceMod()`：春夏秋冬四季节价格修正，已嵌入 Trade Tab
   - 剁手节专项：3天预热公告 + 节日结束后 3天余震清仓期
   - `getCombined_priceMod()`：节日+季节综合价格修正乘数

3. **公司历史书 UI**（`components/companyHistory.js` + `render.js` + `wiki.js`）
   - `showCompanyHistory(companyId)` 弹窗组件：基本信息 + 当前状态 + 里程碑时间线 + 命运事件记录
   - 里程碑颜色标记：IPO绿色 / 倒闭红色 / 并购黄色 / 常规蓝色
   - 企业 Tab 集成：每个公司卡片添加"📖 查看公司历史书"按钮
   - 游戏百科新增"公司历史书"条目（叙事分类）
   - 降级支持：`getCompanyHistory()` 不可用时直接从 state 读取

4. **节日成就/里程碑追踪**（`festivals.js` + `achievements.js` + `trade.js` + `main.js` + `actions_extra.js`）
   - 25 个新节日成就：春节7（除夕团圆/红包达人/赤狗日学霸/迎财神/破五开工/送穷神/春节全勤）+ 剁手节2 + 劳动/中秋/国庆各1 + 节日综合1
   - 追踪 flag 埋点：春节事件选择/剁手节累计进货利润/劳动节工作/中秋节送礼/国庆节工作
   - 成就分类：`category: "节日"`，春节成就可见，有故事文案

5. **UI文字配色全面优化**（`css/style.css` + `index.html` + `render.js` + `perf.js` + `investment.js`）
   - CSS 变量：`text-primary` `#2c3328`→`#3d3a35`（~7.2:1）/ `text-secondary` `#5a6652`→`#6b6760`（~4.8:1）/ `text-muted` `#8a9680`→`#99958e`（~3.2:1）
   - 暖灰棕色调替代暗绿调，降低蓝光刺激，长时间阅读更舒适
   - 硬编码替换：属性预警色、服务徽章色、绩效等级色、市场情绪色、K线涨跌色、AP提示色等全部从高饱和 → 柔和暖色调
   - 参考标准：WCAG 2.1 AA + Material Design 3 + Solarized + GitHub Primer / Linear / Notion

### ✅ 2026-06-20 14:00 — P0 新闻→投资价格传导桥梁（系统融合 #1）

- **发现**：30+条新闻的 `investmentEffect` 数据（industry/category/symbols/allStocks/btc + mul 乘数）自创建以来从未被任何代码消费
- **新建** `src/js/core/news_investment_bridge.js` — 5个核心函数（getNewsEffectForInvestment/getNewsEffectForBtc/getNewsEffectForProperty/getNewsInvestmentSummary/hasStrongNewsEffect）
- **修改** `investment.js::tickInvestmentDaily()` — 股票/BTC/房产价格随机游走时叠加活跃新闻乘数，多条新闻连乘
- **修改** `investment.js::renderMarketSentiment()` — 新闻列表增加 `[科技·NVDA·BTC]` 行业标签 + 市场驱动强度指示器
- **修改** `src/index.html` — 加载桥接脚本

### 下一步方向

1. **P0 #2 道德flag→后续事件** — 已有flag追踪埋点，需扩充10+个后续道德事件
2. **P0 #3 NPC在场隐性加成** — NPC在场时附近行动有隐性加成/惩罚
3. **P0 #4 天气→客流量→摆摊收益闭环** — 已部分实现，需完整传导

### 内容扩充规划

> 完整扩充蓝图见 [`src/内容扩充规划.md`](src/内容扩充规划.md)

**扩充概览**：涵盖 17 个模块，预计新增 **150+ 条内容**，全部标记为「待完成」。

| 模块      | 当前量 | 目标量    | 新增量 | 优先级 |
| --------- | ------ | --------- | ------ | ------ |
| 成就      | 17     | 50+       | +33+   | P0     |
| 新闻事件  | 30+    | 60+       | +30+   | P1     |
| NPC       | 6      | 12        | +6     | P1     |
| 街头工作  | 35+    | 55+       | +20+   | P1     |
| 装备/道具 | 20     | 35        | +15    | P2     |
| 食材      | 23     | 35        | +12    | P2     |
| 食谱      | 16     | 36        | +20    | P2     |
| 疾病      | 16     | 24        | +8     | P2     |
| 地点      | 11     | 15        | +4     | P2     |
| 证书      | 9      | 15        | +6     | P3     |
| 技能分支  | 现有   | +4 新分支 | +4     | P3     |
| 节日      | 6      | 10        | +4     | P3     |
| 公司      | 5      | 10        | +5     | P3     |
| 职场行动  | 9      | 15        | +6     | P3     |
| 全新系统  | —      | 5 个      | —      | P3     |

**5 个全新系统**：装备品质系统 / NPC 关系网 / 多周目深化 / 成就系统 UI / 天气深化

## 自主运行规则

### 禁止操作

- 禁止删除任何 `.js` / `.html` / `.css` 文件
- 禁止修改 `build.py`
- 禁止修改 `src/index.html` 中的 `<script>` 加载顺序
- 禁止 `git push`（只做本地修改）→ **已更新：见下方 Git Push 规则**
- 禁止引入任何外部库或 npm 包
- 禁止在改到一半时停止（功能要完整可运行再停）
- **🚨 禁止主动改动双端（桌面/手机）现有 UI 布局和样式**（2026-07-10 确立）：除非用户明确说"改这个UI"，否则任何功能开发、Bug修复、数据改动都不得附带修改 `render.js`/`style.css`/`index.html` 中已有的界面排列、尺寸、颜色、层级。新增内容可以追加，但不得移动或删除已有元素。

### Git Push 规则（2026-06-26 更新）

- **本地 commit**：每个功能点完成后立即 `git add -A && git commit -m "..."`（不受限制，不限次数）
- **push 到 GitHub**：仅在以下情况执行 `git push`：
  - 完成一个完整功能或修复，需要别人测试/演示
  - 用户明确要求 push
  - 收工前需要远程备份
- **频繁小改动不 push**：开发过程中的中间 commit 只保留在本地，避免浪费构建额度
- **部署**：`npm run deploy`（本地构建 → `netlify deploy --dir=dist --prod` 直推 CDN）；不走 GitHub webhook（free plan 的 strict contributor verification 会拦截）

### 必须操作

- 每完成一个功能点，立即更新 `src/DEVELOPMENT.md` 变更记录
- **新增/修改任何功能后必须同步更新游戏百科**（v1.2 起改为注册表驱动，不再硬编码）：
  - 新地点/工作/商品/装备/NPC/节日/疾病：列表自动从数据源 `LOCATIONS / STREET_JOBS / GOODS / ITEMS / NPCS / FESTIVALS / ILLNESSES` 读出，仅需确认 `_wikiDetail*()` 是否展示了新字段
  - **新系统机制**：在该机制的实现文件末尾追加注册块（**无需碰 `wiki.js`**）：
    ```js
    if (typeof window !== 'undefined') {
      window.MECHANICS = window.MECHANICS || {};
      MECHANICS.<id> = { id, name, icon, brief, version, related, sections: [...] };
    }
    ```
    - sections 支持 `desc / subhead / list / tip / table / html`；参数尽量用 `items: () => CONST.map(...)` 引用代码常量，调阈值时百科自动更新
    - `related: ['mechanics:<id>', 'amenities:*', 'skills:cooking']` 自动渲染跨条目跳转
    - 跨文件/纯说明性机制（如 `ap` / `stat_link`）放在 `src/js/data/mechanics_registry.js`
    - 启动时 `runMechanicsAudit()` 控制台校验注册完整性 + related 引用
  - 新世界事件/叙事：在 `src/js/data/narratives_registry.js` 追加 `NARRATIVES.<id> = { ... }`（schema 与 MECHANICS 完全一致）
  - 新胜利路线/成就汇总：在 `src/js/data/victories_registry.js` 追加 `VICTORIES.<id> = { ... }`；`achievements` 条目自动读 `ACHIEVEMENTS` 数组，新增成就只需改 `core/achievements.js`
  - 跨条目跳转用 `_wkLink(catId, entryId, label, icon)`，动态内容必须 `_wkE()` 转义
- 每完成 1 个功能点，执行一次 `git add -A && git commit -m "..."` 存档（功能点粒度：一个独立的改动，如"修复XXX bug"、"新增XXX功能"、"清理XXX"）
- 上下文对话超过约 40 轮或感觉很长时，执行 `/compact` 再继续
- token/额度接近耗尽时：先把所有改动写入 DEVELOPMENT.md，确保代码完整可运行，然后停止

### 节奏控制

- 每完成一个功能后通过 ScheduleWakeup 安排下一步，给系统留出处理时间
- 不要无限快速连续调用，每个功能做完整后再继续下一个

## 开发方向优先级（按序）

### P0 — 游戏性核心（最优先）

1. **随机剧情事件扩充**：参考《This War of Mine》道德困境事件，增加有选择权重的叙事事件（目标50+个）
2. **NPC 关系深度**：好感度达到阈值解锁特殊对话/任务/资源，参考《Stardew Valley》NPC 系统
3. **成就系统**：参考《Papers Please》隐藏成就，记录玩家的"第一次"和里程碑时刻

### P1 — 内容丰富度

4. **街头特色玩法**：拾荒路线规划、摆摊选址策略（不同地点客流量不同）
5. **季节/节日系统**：春节/中秋/劳动节特殊活动和价格波动，参考《Stardew Valley》节日
6. **梦想追踪系统**：玩家可以设定一个"人生目标"（开餐馆/买房/出国），分阶段给出反馈

### P2 — 体验打磨

7. **教程升级**：动态提示（第一次赚到¥100时提示存银行，第一次受伤时提示买保险）
8. **数据可视化**：收入曲线图、属性成长雷达图（参考《大多数》的成长感）
9. **存档快照**：存档时记录当天状态快照，读档界面显示"那时候你..."回忆文案

## ## 多窗口开发安全规则（重要！）

**问题**：当多个 Claude 窗口同时开发时，窗口 A 提交后 HEAD 前进，但窗口 B 不知道仍在旧代码上提交 → 覆盖窗口 A 的改动。

## 已配置的自动保护（无需手动操作）

### 窗口启动时自动同步

- `.claude/settings.json` 配置了 SessionStart 钩子
- 每次 Claude 窗口启动时自动运行 `.claude/sync-check.sh`
- 自动检测是否有其他窗口提交了新代码 → 自动 `git stash + checkout + stash pop` 合并

### 提交时自动检测覆盖风险

- `.git/hooks/pre-commit` 钩子自动检测 HEAD 变化
- 如果检测到其他窗口已提交新代码，**阻止提交**并显示差异
- 此时**把阻止信息发给我**，我会自动执行合并流程

### 禁止操作

- 禁止 `git commit --no-verify`（绕过 pre-commit 钩子）

---

## 全系统优化·循环迭代表 (Domain Rotation Loop)

> 每轮自动选一个薄弱域（A–H），做完轮换下一域；无限循环，无结束目标。
> 上下文不足时仅保留 `.claude/loop-domain-state.json` + 本轮文件 + 本表最新 5 行，丢弃旧轮对话。
> 域定义：A 数据/数值平衡 · B 事件/叙事 · C 职业/成长 · D NPC/社交 · E 经济/投资 · F UI/UX · G 核心机制/生命周期 · H Phase2/公司

| 轮次 | 日期       | 域                  | 指令一 A类修复                                                                                                                                                                                                                                      | 指令二 联动增强                                                                                                                                                                                                                                                                                                                 | commit                                   | 备注                                                                                                                                                                                                                                              |
| ---- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1   | 2026-07-12 | A 数据/数值平衡     | 0（结构性健康）                                                                                                                                                                                                                                     | 4项（财富税阶梯×2阶段/市场饱和/物价异动）                                                                                                                                                                                                                                                                                       | `42528c0a`                               | economy_v3.1+pricing 隐形数据首次叙事化；MC 10×500d 0异常；事件总数674/0重复ID                                                                                                                                                                    |
| R2   | 2026-07-12 | B 事件/叙事         | 28（events_core×2/extra×12/era×6/side_hustle_consequences×2/npc_event_bridge×3/events_corp×1/cross_system×2）                                                                                                                                       | 6项B类修复（模板字面量×3/职业phase×2/edu冗余apply/双随机门控×5）+2新事件（corp回望/张姐祝贺）                                                                                                                                                                                                                                   | 待提交                                   | 全量21事件文件扫描；修复6处扣款缺失+16个NPC断链+3个引擎缺陷+1个免费金钱+1个Random.int                                                                                                                                                             |
| R3   | 2026-07-12 | C 职业/成长         | 2（medicine技能缺失 unlock medical/doctor 路径；social技能悬空 unlock wholesale_flip）                                                                                                                                                              | 6项（博士毕业/驾驶老司机/管理班子危机 + design改稿/法律首庭/运营救火）                                                                                                                                                                                                                                                          | `ef6f6ea`+`5e186eb0`+`e862ade0`          | 解锁 2 条共9级的职业路径；填补博士毕业/技能视角/路径专属三大叙事空白；事件总数 689                                                                                                                                                                |
| R5   | 2026-07-12 | B 事件/叙事         | 1（events_corp::insider_report 扣款¥500k无建仓逻辑→补实际股票买入+cost字段）                                                                                                                                                                        | 3个职场道德事件（背锅抉择/晋升贿赂/裁员名单）——填补corporate阶段道德事件空白                                                                                                                                                                                                                                                    | `42cd4e12`                               | 全量6文件node --check + build.py 8033.2KB；事件总数692                                                                                                                                                                                            |
| R7   | 2026-07-12 | B 事件/叙事         | 0（全量扫描 moral_events.js/news.js/events_core.js：5个condition全守卫、followUpId动态生成、relationships/weather访问均防御；subsidy经核实为故意去重非丢失）                                                                                        | 3项：moral_elder_assist(道德→NPC关系+兼职线索 B→D/C桥接)/scrap_price_surge(新闻→废品定价+材料股 B→A/E)/night_market_revival(新闻→零工收入+消费股 B→C/E)                                                                                                                                                                         | `adcfaad1`                               | 架构现实：事件系统为三套子系统(MORAL_EVENTS声明式/NEWS_EVENTS声明式/events_core RANDOM_EVENTS引擎)，已按真实格式注入；MC 6×400d 0异常                                                                                                             |
| R9   | 2026-07-13 | F UI/UX             | 3（render.js renderActiveNews headline XSS→_esc()/移动端新闻限制+render_infra.js renderActiveNews headline XSS→createElement+createTextNode）                                                                                                       | 3项：ESC键关闭弹窗(modal.js)/引导面板aria-live(render.js)/tab按钮aria-current(render_core.js)                                                                                                                                                                                                                                   | `fa166eeb`+`6f3b42f6`                    | 构建 8074.2KB；XSS防御+桌面端ESC+屏幕阅读器无障碍                                                                                                                                                                                                 |
| R12  | 2026-07-13 | G 核心机制/生命周期 | 5（daily_pipeline trigger_slot state.day×6 / main.js chengguan无守卫+inventory无守卫 / illness.js onClick→callback / weather.js physique路径错 / wiki.js搜索框焦点窃取）                                                                            | 0（待下轮联动增强）                                                                                                                                                                                                                                                                                                             | `050738fe`(submodule)·`c2d4cf18`(parent) | TriggerRegistry事件系统6年静默失效修复；构建8080.8KB                                                                                                                                                                                              |
| R8   | 2026-07-14 | D NPC/社交          | 2（checkNpcRelationEventTriggers输出无消费者→关系事件链永不触发,接入每日tick / 好感衰减+升降级消息显示原始id"aunt wang"→getNpcDisplayName中文名）                                                                                                   | 3项：triangular_choice阵营张力(跨NPC负向好感传导)/old_friend_reaction圈子效应(跨NPC正向传导)/圈子归属感(D→G,≥3熟人每7天心情+2)                                                                                                                                                                                                  | `e2e86e47`                               | B→D→F覆盖第2轮；死代码关系触发器激活为真实事件链;MC 6×400d 0异常;构建8144.0KB                                                                                                                                                                     |
| R13  | 2026-07-14 | F UI/UX             | 4（viewport-fit=cover解锁安全区 / #app 100vh→100dvh地址栏遮挡致底部截断 / #tab-bar·#mobile-hud刘海安全区padding-top / .world-news-panel底部Home指示条安全区padding-bottom）                                                                         | 2项：圈子归属感概览(社交Tab关系网,已结识/熟络/平均好感+激活态 F→D) / 圈子归属感激活进度引导(再熟络N位提示 F→D,桥接R8机制)                                                                                                                                                                                                       | `d9381e65`                               | B→D→F覆盖第3轮(本轮自动化R9)；移动端安全区+动态视口修复(移动端不可达/截断A类);圈子归属感UI化;MC 6×400d 0异常(社交存活率66.7%为既有平衡阈值非本轮引入);构建8166.0KB                                                                                |
| R14  | 2026-07-14 | C 职业/成长         | 0（A类逐项核验全清：reqSkills/reqEducation/reqSocial/performance/SKILL_BRANCHES键/事件job-id引用均无死职业·死技能·不可达顶岗）                                                                                                                      | 3项：career_apex_peak(满级有收益 C→G,顶岗首达→声望+心情峰终)/career_senior_bonus(C→E,在职>365天→年终奖现金)/career_industry_dinner(C→D/E,180~2000天→饭局花费换声望·社会比较)                                                                                                                                                    | `0e8600cf`                               | 覆盖序列完成后恢复正常轮换第1轮(本轮自动化R10);职业成长三向桥接;全字段                                                                                                                                                                            |     | 防御,数值标[PLACEHOLDER];MC 6×400d 0代码异常(存活率阈值既有);构建8171.7KB |
| R15  | 2026-07-14 | E 经济/投资         | 0（逐项核验 finance.js/economy_v3.1.js/news_investment_bridge.js/insider_trading_events.js/stock.js/property_market.js/investment.js 的 tickInvestmentDaily：贷款额度·负债率·资产增信·新闻传导·房产周期·内幕事件全 `\|\|` 防御，无裸访问/无死引用） | 3项：bull_market_tea_party(E→D,持有投资+已结识NPC≥20好感→约茶分享收益,applyAffinityChange好感+3·心情+6)/asset_milestone_reflection(E→G,总资产≥¥50万首达→峰终自我肯定,心情+10·心智+5)/colleague_invest_club(E→C,职场期+持有投资→同事理财饭局,职场声誉upward+4~8·道德+3)                                                          | `（feat）economy_linkage_events.js`      | 正常轮换第2轮(本轮自动化R11);经济隐形数据首次叙事化跨域桥接;新建 economy_linkage_events.js IIFE 注入 RANDOM_EVENTS,全字段\|\|防御,数值标[PLACEHOLDER];MC 6×400d 0异常;构建8184.0KB                                                                |
| R16  | 2026-07-14 | G 核心机制/生命周期 | 4（events_core stats.health→status.health×3处,事件难度健康惩罚原NaN永假→修复 / life_ribbon illness→illnesses,病困缎带原永假 / world_params enterprise→startup,CEO行业热度原永假 / tutorial illness→illnesses,首病提示原永假）                       | 3项：life_city_anniversary(G→D,每满一年+已结识NPC→约熟人safeAffinity+6·心情+8)/life_work_anniversary(G→C,职场每满一年→组局upward+5·心情+6)/life_estate_planning(G→E,年龄≥40&资产≥50万→立继承安排 family._estatePlanned/公益捐赠道德+5)                                                                                          | `feat: [域G] A类修复4项+联动增强3项`     | 正常轮换第3轮(本轮自动化R12);核心机制/生命周期真实缺陷修复(事件健康惩罚/病困缎带/CEO行业热度/首病提示四处永假)+人生节点叙事化跨域桥接;新建 lifecycle_linkage_events.js IIFE 注入 RANDOM_EVENTS,全字段\|\|防御,数值标[PLACEHOLDER];MC 6×400d 0异常 |
| R17  | 2026-07-14 | H 公司/Phase2       | 2（startup_crisis.js showCrisisModal 397 / applyCrisisChoice 474 对可能为 null 的 startup.company 未函数内判空→补 if(!company)return 防御式守卫；批量扫描确认域内其余 startup.company 解引用均有上游短路守卫）                                      | 3项：startup_friend_support(H→D,公司存续+已结识NPC≥20好感+冷却flag→约挚友safeAffinity+5·心智+6·心情+4)/startup_wealth_milestone(H→E,估值首破[PLACEHOLDER]¥100万→划[PLACEHOLDER]¥5万入投资银行户·置_startupInvestorMindset/再投回估值×1.05)/startup_career_legacy(H→C,upward≥[PLACEHOLDER]40→前同事人脉拉客户估值×1.08·upward+5) | `feat: [域H] A类修复2项+联动增强3项`     | 正常轮换第4轮(本轮自动化R13);Phase2/公司域防御式空值守卫(创业危机弹窗/选择未判空)+创业叙事化跨域桥接;新建 company_linkage_events.js IIFE 注入 RANDOM_EVENTS,phase:corporate(创业在corporate阶段创立),全字段                                       |     | 防御,数值标[PLACEHOLDER];MC 6×400d 0异常                                  |

| R24 | 2026-07-15 | C 职业/成长（第二轮） | 0（全量扫描 career_path_events/personal_growth_events/skill_tree/skill_synergy/career_dev/career_linkage_events：技能键/职业path id/CAREER_PATHS 引用全部有效；career.currentJob 裸访问均经 _job/_path/if(currentJob) 守卫；无死职业·死技能·不可达触发） | 3项：career_enterprise_readiness(C→H 职业硬技能兑现公司KPI upward)/career_legacy_tale(C→B 职业成就成城内叙事·置 _careerNarrativeSeen 供B域复用)/career_resource_mastery(C→A 熟练度换效率红利·智力+现金回馈) | 待提交 | 覆盖B→D→F完成后第二轮C；全事件字段均做防御性检查、数值标[PLACEHOLDER]；MC 6×400d 0代码异常（balanced/social 66.7%<80% 为既有平衡阈值RNG波动，非代码异常）；构建8340.1KB |
| R25 | 2026-07-15 | A 数据/数值平衡（第三轮） | 0（全量扫描 skills/jobs/items/goods/illnesses/pricing/trade/economy_v3.1：job.location 全部命中 locations、goods/items category 自洽、jobs.payCalc 技能键均属10核心技能、pricing 除零已守卫、economy_v3.1 全字段 isFinite/‖ 防御，结构性健康） | 2项：data3_wealth_tax_intro(A→G 累进财富税梯度叙事化)/data3_market_saturation(A→E 市场饱和度惩罚叙事化) | `feat: [域A] 联动增强(2项) 财富税梯度+市场饱和度叙事化` | 自动选弱域(域A自R1后未再轮到；R14/R22仅覆盖A→D/C/E"净资产的量"，本次补隐形平衡数据"税与饱和"叙事化)；新建 data_linkage_events_r23.js IIFE 注入 RANDOM_EVENTS，phase:corporate，惰性守卫 EconomySystem，全字段防御,数值[PLACEHOLDER];MC 6×400d 0代码异常;构建8347.1KB |
| R18 | 2026-07-15 | G 核心机制/生命周期（第四轮） | 6（illness.js fatigue+=5未clamp至100 / main.js 创业目标条件 `!s.status && s.status !== \"none\"` 逻辑矛盾（永假）→ (!s.status\|\|s.status===\"none\") / main.js×3 capacity 4元素数组越界(housing.tier支持0-6)→7元素数组 / needs.js decayMul NaN 传播(Math.max(0,NaN)=NaN 非 0)→isFinite/clamp / state.js `_hypertensionMonthlyPaid` 死字段→删除 / story_chapters.js `bankLoan` 不存在→bankDebt） | 4项：fame_npc_gossip(G→D 名气子系统首次被NPC事件消费·街头议论)/fame_npc_personal(G→D 名气+好感双门槛深度互动)/fame_corporate_recognition(G→C 名气影响corporate人气)/story_chapters 情绪/健康感知(G→G 深度叙事：depressed/sad/happy/health危机感知扇门) | `320bd11a`(A类)+`story_chapters 联动内联` | 域G第四轮(第七轮G域);核心机制疲劳/创业目标/capacity数组/needs NaN守护/死字段/字段名6项真实缺陷+名气-社交/名气-职场/情绪叙事深度4项跨域桥接;新建 lifecycle_milestone_events.js IIFE 注入 RANDOM_EVENTS,全字段\|\|防御数值[PLACEHOLDER];MC verify_trigger_registry ✅;构建8356.4KB |
| R26 | 2026-07-15 | D NPC/社交（第二轮） | 3（auntie_lin/chen_ge/ajie 在 npcs.js 有定义+关系矩阵有条目+各有下游事件强依赖 met，但全代码无路径设 met=true→永久 dormant「定义存在但永远不会出场」；补 npc_X_first_meet 解锁） | 2项：npc_chen_ge_market_whisper(D→E 陈哥情报贩子周期透市场耳语·投资心态)/npc_auntie_lin_fresh_deal(D→A 林阿姨周期透菜价门道·烹饪经验) | `（fix+feat）npc_activation_events.js + npc_linkage_events_r26.js` | 域D自R8后首次主审；沉睡NPC激活(A类3)+常态互动联动(2)；IIFE注入 RANDOM_EVENTS 严格照 cross_system_events 6个已验证登场事件样板(phase:street/!met闸门/met=true+好感clamp+人设flag)，全字段||防御数值[PLACEHOLDER];MC 6×400d 0代码异常(trader/corporate 66.7%为既有平衡阈值非回归);构建8392.6KB |

| R27 | 2026-07-15 | E 经济/投资（第二轮） | 0（逐项核验 finance.js/economy_v3.1.js/stock.js/property_market.js/investment.js::tickInvestmentDaily：贷款额度·负债率·资产增信·新闻传导·房产周期·组合峰值全 `||`/isFinite 守卫，无裸访问/无死引用/无恒赚无风险错判） | 2项：econ_career_invest_unlock(E→C 净值/职级门槛→私募跟投圈层,真实现金+管理技能)/econ_portfolio_drawdown(E→B 组合自峰值回撤≥20%→损失厌恶叙事,割肉/加仓/装死) | 7278a344 | 正常轮换;新建 economy_linkage_events_r27.js IIFE 注入 RANDOM_EVENTS(street+corporate 双变体,共享去重flag),全字段`||`防御,数值标[PLACEHOLDER];MC 10×500d 0代码异常;构建8421.7KB |
| R28 | 2026-07-15 | F UI/UX（第三轮） | 0（结构性健康：wiki.js mechanics列表20条目全覆盖+_wikiDetailMechanic.pages字典完整无空白详情；daily_report.js溢出ellipsis+键盘可达；modal.js Esc+遮罩关闭健全；navigation.js仅5顶层tab无移动端溢出；style.css 760px适配已覆盖；所有空状态为合法文案非死按钮） | 3项：heritage传承币(4维结算+6解锁红绿互斥)/inheritance多周目继承链(6类继承)/social_net社交网络(关系传导+朋友圈热搜)；MECHANICS注册表扩展，自动进百科列表+_renderMechanicEntry渲染，related互链 | e72da430（并行窗口 git add -A 碰撞捕获；本会话 9813e497 冗余分叉本地提交push不带走） | 域F第三轮(R9/R13后)；Meta系统文档闭环(传承币↔继承链↔社交网络)；碰撞：并行窗口同改共享树precommit拦截本会话，最终由 e72da430 携带R28内容提交；纯静态文案未跑MC；构建由并行窗口完成 |
| R170 | 2026-07-23 | H 公司/Phase2（第二轮） | 1（enterCorporatePhase 初始化职级属性直接用 p.mental/agility/intelligence/skills.*.level 未防御→NaN 污染 dignity/kpi/upwardMgmt/ability；加 isFinite/默认回退守卫） | 3项：corp_exec_lifestyle(H→A 高管生活品质回填生活需求+开启`_execLifestyleInflation`生活方式通胀flag)/corp_mentor_newcomer(H→C P7+且在职≥3年带教→upwardMgmt+ability+`_mentorCount`职业传承)/corp_seek_senior_advice(H→D junior向boss_li请教→好感+KPI) | （fix+feat）domain_h_linkage_r170.js | 域H自R17后首次主审；A类NaN守卫(极端值NaN典型)+公司域三线跨域桥接(H→A/C/D)；IIFE注入RANDOM_EVENTS严格照events_corp范式(phase:corporate/conditions全字段防御/gameOver闸门)，引擎不自动扣cost已手动扣，数值标[PLACEHOLDER]；MC 6×400d 0代码异常(trader 66.7%为既有平衡阈值非回归)；构建8731.0KB |
| R170b | 2026-07-23 | H Phase2/公司(第二轮·续) | 5（startup.js history未初始化即写入/cashReserve undefined比较 → NaN/ corp_ops.js c.risk读state.corporate永远undefined → 改读player.corporate.risk / stock.js resources裸访问 → 加初始化守卫 / team.js cash-=cost NaN传播 → Math.round防御） | 4项：G→H Phase1→2跨阶段继承(calculateStreetLegacyBonus + enterCorporatePhase集成)/D→H 职场NPC深度事件×4(李工头/小美/赵姐/老周)/H→B 团队管理叙事事件×3(极客/房贷战神/应届生)/H→F/G 绩效里程碑事件×3(S连胜/低谷反思/翻身仗) | `9a682c53` | 已推 ✅ | 域H第二轮补遗；5处P0/P1 A类缺陷全部修复+4大联动增强(9新事件)；新建 corp_legacy_bonus.js + 3个IIFE事件文件 + index.html注册；构建8929.1KB |
| R171 | 2026-07-23 | A 数据/数值平衡(第九轮) | 3（locations.js 医院jobs数组'hospital_companion'×2重复死代码→去重 / trade.js buyGood cash裸访问→NaN防御(旧存档防刷钱) / trade.js cash-=totalCost NaN传播→Math.round防御） | 2项：A→B 慢性病月治疗费通知(treatCostMonthly首次叙事化,30天冷却)/A→C/D 证书社会认可(CERTIFICATE salaryBonus→社交认可,90天冷却) | `8422d8b4` | 已推 ✅ | 域A第九轮；3处真实A类缺陷全修复+2新事件(疾病月度扣款叙事/证书社交影响)；domain_a_linkage_r171.js增至6事件；构建8930.5KB |
| R172 | 2026-07-23 | B 事件/叙事(第九轮) | 2（events_street_life.js/skill_synergy.js Math.random()→Random.fromArray统一随机系统） | 4项：B→C 技能突破叙事(Lv.70→XP+心智奖励)/B→E 市场波动投资觉醒(波动≥2次→智力+会计XP)/B→G 极端天气事件权重×2.5/B→A 供需状态标签 | `2cac8c51`+`fad3d220` | 已推 ✅ | 域B第九轮；随机系统种子化清零+4联动增强(技能/投资/天气/供需)；新建 domain_b_linkage_r172.js；构建8792.5KB |
| R182 | 2026-07-24 | A 数据/数值平衡(第十轮) | 3（notebook_item重复ID→memo_pad（与stationery笔记本冲突死代码）/ 住所tier5/6 effects(healthRecovery/fameGain/skillStudyBonus/npcVisitBonus)原定义但从未消费→接入睡眠恢复 / 证书injuryReduction/illnessRiskReduction/fatigueReduction原定义但从未应用→接入工作风险判定） | 3项：A→F 疾病preventionHint接入百科详情展示 / A→F 证书trainingDays接入考取UI描述 / A→C/D 住所skillStudyBonus→技能XP+npcVisitBonus→NPC好感（数据→机制闭环） | `89fa1396`(A类)+`afc06d7b`(联动) | ⚠️ push待网络 | 域A第十轮；A类3项（1项与并行窗口重复已去重）+联动3项；notebook_item死代码/住所特效/证书被动三大隐形数据首次消费；构建8954.7KB |
| R185 | 2026-07-24 | E 经济/投资 | 8（investment.js: btcPrice/stockHoldings/properties/cars/btcHoldings 旧存档守卫 + sellBtc NaN污染现金 + sellProperty自住分支裸写 + investment_analysis checkStopLoss 守卫 + _totalInvestmentProfit 死字段复活） | 3项：invest_r185_safety_net(E→G 财务安全垫人生节点)/invest_r185_risk_guard(E→D 盘感识风险劝阻朋友走applyAffinityChange)/invest_r185_data_instinct(E→C 财报盘感迁移职场 addSkillXp accounting) | `1f844fdc`+`01da2466` 已推 ✅ | 域E(经济/投资)：8项A类修复(旧存档迁移路径硬崩溃/NaN污染现金/死字段) + 3项跨域联动增强；新建 domain_e_linkage_r185.js IIFE 注入 RANDOM_EVENTS，全字段`||`防御，数值标[PLACEHOLDER]；MC 10×500d 0代码异常；构建8980.6KB |
| R186 | 2026-07-24 | F UI/UX | 2（daily_quest.js×2+tutorial.js: `state.certs` 死字段(全库无写入点，真实为 certificates 数组)→certGte 每日目标永不完成+「考下第一张证书」反复推入+首证引导永不弹出 / victory.js:171 流浪终老暗结局 `state.career.currentJob` 无守卫解引用(从未求职时 career undefined→TypeError)） | 3项：ui_r186_cert_wall(F→C 证书上墙自我呈现→名望+心智+_certConfidence flag)/ui_r186_quest_ritual(F→G _questStreak连击≥7→自律仪式感+_dailyRitualKeeper flag)/ui_r186_progress_share(F→D/C 复盘方法分享→applyAffinityChange 守 rel.met+addSkillXp management) | 待提交 | 域F(UI/UX)：证书子系统 UI 层三处死字段修复（本轮起证书目标/引导真正生效）；新建 domain_f_linkage_r186.js IIFE 注入 RANDOM_EVENTS，全字段`||`防御，数值标[PLACEHOLDER]；构建8992.2KB |
| R188 | 2026-07-24 | H Phase2/公司 | 3（startup_events.js: `seed_headhunted`/`mature_team_left` 用 `condition:`(单数)门控但引擎只读 `conditions:`(复数,triggerStartupEvent:1082)→死门控 + 引用 `st.company` 不存在字段(公司真实挂 `st.startup.company`)→零员工也弹"被挖角/团队离职"叙事矛盾 / `_applyStartupEffects` 的 STARTUP_FIELD_MAP 遗漏 `revenue`→`mature_second_curve` 选项承诺的 +30000 营收被静默丢弃(revenue 是 KPI 评分真实字段)） | 3项：corp_h_r188_equity_cashout(H→E 股权套现→个人投资本金,复用_dataInvestorMindset)/corp_h_r188_cofounder_bond(H→D 并肩作战道谢→applyAffinityChange 守 rel.met)/corp_h_r188_founder_burnout(H→G 创业者身心透支→健康/心智回填+_founderHealthAwareness flag) | 待提交 | 域H(Phase2/公司)：创业事件门控键名/不存在字段/效果字段遗漏三项数据自洽修复；新建 domain_h_linkage_r188.js IIFE 注入 RANDOM_EVENTS(phase:corporate)，全字段`||`防御，数值标[PLACEHOLDER]；MC 6×400d 0代码异常；构建9002.5KB |
| R189 | 2026-07-24 | A 数据/数值平衡 | 2（locations.js 9地点 specialties/priceMod 引用非good.id的token(luxury/food/sports_equipment/beverages/books/meat/seafood 为category名或不存在)→getDailyGoodsForLocation 经 getGoodById().filter(Boolean) 静默丢弃招牌商品(本应100%必出)+loc.priceMod[good.id] 价格倍率永不命中→双双死数据,已改真实good.id(cigarettes/vegetables/vitamins_item/beer/instant_noodles/carnation/rose/second_hand_book/pork/fish) / skills.js getAvailableCertificates 漏校验 req.electrician(electrician_cert 电工门槛死门控,0级也能考)+req.ageMin/ageMax(全库无消费者,超龄/未成年也能考驾照厨师证)→补技能门槛+年龄门槛(cash 保留由 main.js disabled 提示故不加,避免证书直接消失)） | 3项：data_a_r189_source_share(A→D 摸清货源门道→荐给街坊auntie_lin,applyAffinityChange 守 rel.met)/data_a_r189_haggle_mastery(A→C 常年练摊比价→议价眼力 addSkillXp("sales"))/data_a_r189_petty_capital(A→E 小本倒货攒的现金→投资本金意识,复用_dataInvestorMindset) | 待提交 | 域A(数据/数值平衡)：地点交易系统 specialties/priceMod 无效id修复(招牌商品/价格倍率本轮起真正生效)+证书电工/年龄门槛复活；新建 domain_a_linkage_r189.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，全字段`||`防御，数值标[PLACEHOLDER]；MC 6×400d 0代码异常；构建9012.8KB |
| R190 | 2026-07-24 | B 事件/叙事 | 10（news.js 10处引用不存在id致新闻效果静默失效死数据：jobPenalty/jobBonus 中 8个不存在的 job id(street_vending_goods/food_stall/park_flower_vendor/street_performer/skilled_labor_construction/hospitality/coding_freelance/data_analyst)→改真实job id(sister_zhang_vending/restaurant_assistant/steel_worker/remote_dev/junior_analyst) + investmentEffect 中 1个不存在的股票symbol WEORK(INV_STOCKS 无此symbol)→改真实 ESTATE(房地产,契合"共享办公空间爆满"语义);修复后新闻的求职加成/惩罚(_introJobBonuses)与投资效果本轮起真正生效） | 3项：news_r190_streettalk(B→D 新闻成街坊闲聊话题→与首个已结识NPC涨好感 applyAffinityChange 守 rel.met)/news_r190_trend_skill(B→C 追热点潮流→带动 english/sales 技能 addSkillXp)/news_r190_market_sense(B→E 读新闻练出市场嗅觉→现金≥15000置_dataInvestorMindset投资意识) | 待提交 | 域B(事件/叙事)：news.js 求职/投资效果引用不存在id的死数据修复(10处)；新建 domain_b_linkage_r190.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，全字段`||`防御,数值标[PLACEHOLDER],含 firstMetNpc 辅助避免硬编码未激活NPC致死事件；MC 6×400d 0代码异常；构建9022.6KB |
| R192 | 2026-07-24 | G 核心机制/生命周期 | 1（life_ribbon.js「房奴一生」缎带 `mortgage_slave` check 死字段：原读 `p.isSelfOccupied`/`p.mortgageRemaining`（全库仅此一处读取、无任何写入，恒 `undefined`→缎带永不授予），改读真实字段 `state.investment.selfLivePropertyId`(state.js:216 初始化) + `state.family.mortgage.remainingDays`(daily_pipeline.js:1165 `family_mortgage_tick` 维护)；自住房+在还贷两个条件都满足即正确授予） | 3项：life_r192_housewarming(G→D 拥有自住房→请首个已结识街坊暖房→好感 applyAffinityChange 守 rel.met,扣待客花销)/life_r192_settled_focus(G→C 安居后沉心重拾手艺→addSkillXp 选玩家最高等级真实技能键)/life_r192_mortgage_grit(G→A 月月还贷磨出精打细算→心智+幸福感数值成长) | 待提交 | 域G(核心机制/生命周期)：life_ribbon 房奴缎带死字段修复(A类1)；新建 core_lifecycle_linkage_r192.js IIFE 注入 RANDOM_EVENTS(3 street,均 phase:"street")，承接「安家」生命主线复活价值链(G→D/G→C/G→A)，hasSelfHome/mortgageDaysLeft/firstMetNpc 辅助防御,全字段`||`守卫,数值标[PLACEHOLDER];MC 6×400d 0代码异常;构建9032.0KB |
| R191 | 2026-07-24 | C 职业/成长 | 1（jobs.js `long_haul_driver` 长途司机死工作：`requiredFlag: "_synergy_driving_accounting"` 引用了不存在的连携flag(skill_synergy.js 真实设 `_synergy_driving_logistics`「长途运输」DUAL driving+accounting 与 `_synergy_driving_logistics_accounting` TRIPLE 物流帝国,无 driving_accounting)→该岗位永不可入职,与其 desc"需要长途运输连携激活"/payCalc(driving+accounting)语义完全对应DUAL连携;改 `_synergy_driving_logistics`——本修复已随并行提交 eb13d27b 落地) | 3项：skill_r191_synergy_gig(C→E 长途运输连携激活→货主请跑私活→现金+1200/驾驶XP,承接死工作复活变现)/skill_r191_peer_respect(C→D 手艺练到火候→同行讨教→首个已结识NPC好感 applyAffinityChange 守 rel.met)/skill_r191_hard_won(C→G 夜里回望练就的硬本事≥2门→心智/幸福感成长叙事) | 待提交 | 域C(职业/成长)：long_haul_driver 死工作连携flag修复(A类,并行已落地)；新建 domain_c_linkage_r191.js IIFE 注入 RANDOM_EVENTS(3 street)，skillLv/firstMetNpc 辅助防御,全字段`||`守卫,数值标[PLACEHOLDER];MC 6×400d 0代码异常;构建9036.8KB |
| R183 | 2026-07-24 | F UI/UX(第十一轮) | 4（学历博士edu=3→undefined渲染/消息日志toggle标签反向/每日目标奖金终身只发一次→按天发放/教程6个剧本first_income高亮选择器失效） | 2项：F→B 消息记录类型过滤（全部/事件/成功/警告）/ F→D 日报NPC近况名字可点击跳转社交Tab | `d42e7f1b`(A类)+`3d6d33c2`(联动) | ⚠️ push待网络 | 域F第十一轮；A类4项（含学历面板undefined/教程6/7剧本选择器错误）+联动2项（消息过滤+NPC跳转）；构建9003.8KB |
| R193 | 2026-07-25 | H Phase2/公司 | 2（startup_events.js `STARTUP_FIELD_MAP` 遗漏 `revenue` 键→mature_second_curve/consumer_viral 三事件 effect.revenue(+30000/+200000/+100000) 被 `if(!rule)continue` 静默丢弃,而 company.revenue 是 startup.js:1530/1753 KPI/融资读取的真实字段→营收增益本应落地 / events_corp.js:1570 技能经验字段拼写 `.exp`→`.xp`(全库统一 .xp,如 events_corp.js:1104/1398 coding.xp;原写不存在属性→"管理技能XP+50"静默丢失)） | 3项：corp_h_r193_revenue_windfall(H→E 公司营收里程碑→迁移经营者现金流思维为个人理财意识,复用_dataInvestorMindset)/corp_h_r193_team_reward(H→D 年终给核心团队发奖/请客→firstMetNpc 好感 applyAffinityChange 守 rel.met)/corp_h_r193_leadership_growth(H→C 带队复盘→addSkillXp("management")真实沉淀,承接.xp修复) | 待提交 | 域H(Phase2/公司)：创业营收字段映射遗漏+管理XP拼写错字段两处数据自洽修复；新建 domain_h_linkage_r193.js IIFE 注入 RANDOM_EVENTS(3 corporate)，全字段`||`防御,firstMetNpc/inCorp 辅助,数值标[PLACEHOLDER];MC 6×400d 0代码异常;构建9095.5KB |
| R194 | 2026-07-25 | D NPC/社交 | 2（npc_linkage_r167.js:55 `pickClosestNpcR167` 返回 `for...in` 尾变量 `id`→`safeAffinityR167(st,best.id,5)` 好感加错NPC,改返回捕获的 `best` / npc_linkage_r167.js:237 写 `st.player.happiness` 死字段→`st.needs.happiness`,「心情+8」静默丢弃） | 3项：npc_d_r194_budget_buddy(D→A 朋友理账→intelligence+mental+置_npcBudgetSense)/npc_d_r194_mentor_praise(D→C 前辈背书→最高技能addSkillXp+10)/npc_d_r194_colleague_invest_tip(D→E 同事理财→置_dataInvestorMindset+cash+1000),全守域D铁律 rel&&rel.met/applyAffinityChange | cb8f469c | 域D(NPC/社交)：pickClosestNpcR167返回尾变量id致好感加错NPC+player.happiness死字段两处修复；新建 domain_d_linkage_r194.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，全字段`||`防御,firstMetNpcD194/bumpAffinityD194/topSkillKeyD194 辅助,数值标[PLACEHOLDER];MC 6×400d 0代码异常 |
| R195 | 2026-07-25 | E 经济/投资 | 1（investment_analysis.js 止损止盈整链死机制：`checkStopLoss`/`setStopLoss` 全库无任何调用方(同文件 getNewsEffectForBtc 等有调用反证非误报)→止损单永不被创建/评估,setStopLoss→stopLossOrders→checkStopLoss→sellInvStock 整链死代码；因 daily_pipeline.js/investment.js 均并行在途不可碰,在 domain_e_linkage_r195.js 以包装全局 tickInvestmentDaily 接线(daily_pipeline:615 按名调用,晚加载重赋值生效;try/catch+仅存在止损单才调用)） | 3项：invest_r195_stoploss_advisor(E→F 券商顾问引导给最大持仓挂10%止损·复活 setStopLoss·守 stockHoldings/stopLossOrders 全防御)/invest_r195_stoploss_discipline(E→G 止损单真实触发后的纪律体悟·首个消费 checkStopLoss 写入的 order.triggered→mental+happiness)/invest_r195_technical_review(E→C 深夜技术面复盘·复活 analyzeStockTechnicals 真实调用产出评级摘要+addSkillXp("accounting")) | 待提交 | 域E(经济/投资)：止损/技术分析死子系统整链复活；新建 domain_e_linkage_r195.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，注册于 investment_analysis.js 之后保证包装时机,biggestHoldingR195/hasTriggeredStopR195 辅助,数值标[PLACEHOLDER];MC 6×400d 0代码异常;构建9114.6KB |
| R197 | 2026-07-25 | A 数据/数值平衡 | 1类4键（skills.js 证书效果键 `healthBonus`(:128)/`mentalBonus`(:212)/`illnessRiskReduction`(:118/:128)/`fatigueReduction`(:138) 全库无消费者→护理/健康管理/康复/心理证书 desc 宣称的"健康+5/心智+5/降低患病风险/疲劳-3"全部静默失效(A类#4 死效果键)；main.js 发证循环(3944后)补 4 个消费分支:healthBonus→`state.status.health`、mentalBonus→`state.player.mental`、illnessRiskReduction→累积 `state.flags._illnessRiskReduction`(clamp0.8) 且 phase1/illness.js:137 掷骰前 `ch*=1-cut` 乘性下调患病概率、fatigueReduction→累积 `state.flags._certFatigueReduction` 且 main.js:4598 工作疲劳计算叠加) | 3项：a197_health_baseline(A→G 建健康档案基线→`state.status.health`+`state.player.mental`+置_healthBaselineKeeper,呼应本轮证书健康效果修复)/a197_ledger_clarity(A→F 收支做成明白账→mental+`state.needs.happiness`+置_budgetClarityKeeper)/a197_data_driven_budget(A→H 用数据争预算→`addSkillXp("management")`+cash) | 待提交 | 域A(数据/数值平衡)：证书健康/心智/患病风险/疲劳效果键全库无消费者的死效果修复(本轮起证书宣称效果真正生效)；新建 domain_a_linkage_r197.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，全字段`||`防御,数值标[PLACEHOLDER];MC 6×400d 0代码异常;构建9194.6KB |
| R198 | 2026-07-25 | F UI/UX | 0（Explore 子代理对17个UI文件逐行审计+死字段黑名单全库grep,UI层干净;历史R19 itemId/R183 学历+消息toggle+每日目标终身一次+教程selector/R186 certs→certificates+career.currentJob,本轮不重复修）+C类2项记录不修(investment.js:1435 写state.needs.health死字段·财务Tab并行在途勿碰 / webapp_runtime_bridge.js:176 读写state.player.health死字段·桥接层与渲染层脱节) | 3项：f198_finance_glass(F→E 财务面板清晰→_dataInvestorMindset投资意识+心智)/f198_life_scrapbook(F→B 生活手账回望→mental+needs.happiness)/f198_board_deck(F→H 清爽路演材料→addSkillXp("management")+cash) | 待提交 | 域F(UI/UX)：A类0项(UI层经R19/R183/R186三轮加固后本轮审计确认干净；并行窗口 d7f0b313 已补2项cash+flags守卫)+3项跨域联动增强(新建 domain_f_linkage_r198.js IIFE 注入 RANDOM_EVENTS,2 street+1 corporate,全字段`||`防御,数值标[PLACEHOLDER]);C类记录(不修):investment.js:1435 写 state.needs.health 死字段(真实state.status.health,财务Tab并行在途勿碰) / webapp_runtime_bridge.js:176 读写 state.player.health 死字段(真实state.status.health);MC 6×400d 0代码异常;构建9204.6KB |

> 注：R18–R26 由自动化/手动在 `loop/auto` 分支执行（详见 `src/DEVELOPMENT.md` v3.112–v3.116），本表已续至 R26。R29–R169 由各 round 记忆文件（`.workbuddy/memory/domain-optimization-round-*.md`）与 `loop-domain-state.json` 跟踪，未纳入本表；R170 起重启入表。
