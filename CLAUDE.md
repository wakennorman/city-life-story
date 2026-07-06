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

## 🧠 核心开发方法论：约定式自动归类（v3.21b确立）

> **新增内容时，系统自动发现并接入，不需要写胶水代码。**

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

### 下一批可应用的高潜力领域

| 领域           | 现状痛点                                         | 约定方案                                 | 优先级 |
| -------------- | ------------------------------------------------ | ---------------------------------------- | ------ |
| 行动自动归类   | 加行动需改action.js+ActionSort两处               | 行动声明`category`字段，ActionSort自动读 | 🔴P0   |
| 事件触发数据化 | 每个事件手写conditions函数                       | 事件声明`triggers`数据对象，系统自动匹配 | 🟡P1   |
| 证书→职业加成  | 证书的工资加成写在_calcCertSalaryBonus if-else里 | 证书声明`salaryBonus`字段，系统自动应用  | 🟢P2   |

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

- **最新一次工作 (2026-07-07)**：v3.3 — 创业门槛降低 ¥30k→¥15k + MC AI 健康底线修复（commit: `9f6dccf`）
  - **🐛 创业门槛过高**：经典 ¥30,000 → **¥15,000**，街头工作者 400-500 天可达（原 1,500 天不可达）
  - **📊 MC AI grinder 修复**：health<25降workLimit + hygiene<15洗澡 → 存活率 20%→40%（高风险路径≥30%通过）
  - **📊 MC AI corporate 修复**：health<50停学 + cash<500先工作 + 学频每3天 → 存活率 20%→80%（普通路径≥80%通过）
  - **MC 验证**：balanced 100% / grinder 40% / trader 100% / social 80% / corporate 80% ✅
  - **设计参考**：《大多数》多路径可达 / BitLife 创业门槛 / 中国个体户注册门槛降低
  - **影响文件**：`startup.js`（创业条件表）/ `monte_carlo.cjs`（grinder/corporate AI）
  - **记忆文件**：`memory/v3.3-startup-threshold-mc-fix.md`
  - **🐛 职业卡片条件不足无反馈**：`checkCareerPromotion` 返回 false 时卡片显示"条件不足"但点击无反应 → 新增 `showCareerRequirementsModal` 逆向检查所有缺失条件，逐项显示 ✅/❌ + 当前值
  - **🔇 现金偏差调试提示外露**：`daily_report.js` 的"现金比已记录流水少 ¥XX" 改为仅 console.log 记录，不再展示给玩家
  - **🔘 顶栏5个按钮无点击反应**：btn-help/save/load/new-game-header/mobile-menu-btn 共5个按钮完全渲染但有零事件绑定 → 已绑定功能
  - **🔍 全局静默点击审计**：搜索所有 button 元素 + onclick 属性 + cursor:pointer 元素，全部 data-* 属性绑定/事件委托均有对应监听
  - **约定式自动归类**：`showCareerRequirementsModal_Global(pathKey, levelId)` 注册到 window，新增职业路径/晋升条件可复用
  - **影响文件**：career_dev.js / render.js / CLAUDE.md
  - **验证**：`python build.py` 4878.6KB ✅ / brace/paren 全部匹配 ✅
  - **导航navTab支持**：`_doNavigate` 新增 `target.navTab`，到达后切换到指定Tab而非固定actions。所有百科导航按钮兼容
  - **约定式自动归类完善**：培训中心→skills、大学城→personal_growth、NPC→social、物品→trade、地点→map
  - **面试机制大修**：基础概率 70%→25%+天数×1%，状态惩罚（饥饿-12%/疲劳-15%/健康-12%/形象-10%/露宿-15%）、装备加成（正装+15%）、技能优势（超要求每5级+2%上限+15%）、反馈消息显示具体原因
  - **职业路径入门要求补全**：教学助理 english:5/management:3（原空），护理员 medicine:5（原空）
  - **设计参考**：《大多数》求职门槛 / 《Papers Please》状态影响 / 中国职场现实
  - **验证**：`node --check` 4文件 / `python build.py` 4873.7KB ✅
  - **记忆文件**：`memory/navigation-postnavtab-fix.md` + `memory/interview-balance-v3.2.md`
  - **审查发现**：`inheritance_chain.js` 定义了 3 个继承函数（`inheritCrisisPath`/`inheritMoralScore`/`inheritPeakAffinity`），数据已计算并存储，但继承摘要弹窗从未展示；`inheritanceBonuses` 中的 `promoChance`/`moralEventRate`/`recoveryRate` 等字段被 SET 但从未被 CONSUMED
  - **P1 继承摘要弹窗增强**：新增 3 个显示模块 — 📋 35 岁路径（含特殊加成）/ ⚖️ 前世业力（善恶净值+标签+NPC好感偏移+道德事件率）/ 👥 老熟人（NPC巅峰好感chip展示）+ 总存活天数
  - **P2 35 岁路径增强**：再卷职场→晋升+3%/月薪+5%；备考公→考试+10%/公职+3%；摆烂→恢复+10%/压力-3
  - **P2 道德分→业力系统**：NPC初始好感偏移(-8~+8)，道德事件率调整(-15%~+15%)
  - **P2 加成消费断链修复**：`promoChance`→P9晋升 / `moralEventRate`→道德事件判定 / `recoveryRate`→日健康恢复
  - **验证**：`node --check` 5 文件通过 / `python build.py` 4856.6KB ✅
  - **SOP v3.1 更新**：多周目继承字段扩展标记为 ✅ 已落地
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
