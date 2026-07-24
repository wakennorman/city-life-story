# 城市浮生记 (City Life Story) — 开发文档

> 最后更新: 2026-07-25（域F R198：A类0项——Explore 子代理对 17 个 UI 文件逐行审计 + 死字段黑名单全库 grep，UI 层干净(历史 R19/R183/R186 已修 itemId/学历/消息toggle/每日目标终身一次/教程selector/certs→certificates/career.currentJob)，本轮不重复修；专注 3 项跨域联动增强(新建 domain_f_linkage_r198.js: F→E 财务面板清晰→_dataInvestorMindset投资意识+心智/F→B 生活手账回望→mental+needs.happiness/F→H 清爽路演材料→addSkillXp("management")+cash)，均 2 street+1 corporate、全字段`||`防御、数值标[PLACEHOLDER]；C类记录(不修，域外/并行在途): investment.js:1435 写 `state.needs.health` 死字段(真实 `state.status.health`,财务Tab并行在途勿碰) / webapp_runtime_bridge.js:176 读写 `state.player.health` 死字段(真实 `state.status.health`,桥接层与渲染层脱节)）
> 历史更新: 2026-07-25（域C R196·pivot自F：A类0项——域C A类缺陷已由并行窗口覆盖：career_dev.js:3376 在职里程碑健康加成死字段 `state.needs.health`→`state.status.health`（9b8ddfa2 同源修复）、career_dev.js totalEarned NaN 守卫×2（f1ba9549）、reqSocial 晋升检查+caregiverXp 孤儿 effect+5项技能检查（9b8ddfa2）；本窗口仅补 3 项跨域联动增强(C→B 手艺成街坊美谈→`state.player.fame`/C→F 执业沉淀作品集→mental+`state.needs.happiness`/C→H 前辈点名带新人→`addSkillXp("management")`+cash)，新建 domain_c_linkage_r196.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，全字段`||`防御,数值标[PLACEHOLDER]；并修正并行 f1ba9549 在 src/index.html 误注册的缺失文件 `domain_f_linkage_r196.js` 为 `domain_c_linkage_r196.js`（消除悬空引用)）

> R194（域D）：A类2项——① npc_linkage_r167.js:55 `pickClosestNpcR167` 返回 `for...in` 尾次迭代变量 `id` 而非捕获的最高好感NPC `best`,致 `safeAffinityR167(st,best.id,5)` 把好感+5 加错NPC,改返回 `best` / ② npc_linkage_r167.js:237 写 `st.player.happiness` 死字段(全库仅写入、无任何渲染读取,真实幸福感字段为 `st.needs.happiness`)→「心情+8」被静默丢弃,改 `st.needs.happiness` + 3 项跨域联动增强(D→A朋友理账数据素养intelligence+mental/D→C前辈背书技能XP成长/D→E同事理财意识_dataInvestorMindset+cash落袋)；新建 domain_d_linkage_r194.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)，严守域D铁律 rel&&rel.met/applyAffinityChange）

> R192（域G）：life_ribbon.js「房奴一生」缎带死字段修复——check 原读 p.isSelfOccupied/p.mortgageRemaining(全库仅此一处读取、无任何写入,恒 undefined→缎带永不授予),改读真实字段 st.investment.selfLivePropertyId(state.js:216)+st.family.mortgage.remainingDays(daily_pipeline.js:1165 维护) + 3 项跨域联动增强(G→D暖房请街坊涨好感/G→C安居后重拾手艺加技能/G→A还贷精算换心智成长)；新建 core_lifecycle_linkage_r192.js IIFE 注入 RANDOM_EVENTS(3 street)，承接安家里程碑复活价值链

> R190（域B）：news.js 在 jobPenalty/jobBonus 引用 8 个不存在的 job id(street_vending_goods/food_stall/park_flower_vendor/street_performer/skilled_labor_construction/coding_freelance/data_analyst/hospitality)+1 个不存在的股票 symbol(WEORK) 共 10 处→存入 _introJobBonuses/investmentEffect 后永不匹配真实标的致惩罚/加成/投资效果静默失效(死数据),全部改同主题真实 id(sister_zhang_vending/restaurant_assistant/steel_worker/remote_dev/junior_analyst/ESTATE) + 3 项跨域联动增强(B→D新闻闲话涨好感/B→C顺风向补本事/B→E新闻盘感投资意识)；新建 domain_b_linkage_r190.js IIFE 注入 RANDOM_EVENTS(2 street+1 corporate)）

> R189（域A）：locations.js 9地点 specialties/priceMod 引用非good.id token→招牌商品+价格倍率双双死数据,改真实good.id + skills.js getAvailableCertificates 补 electrician技能门槛+ageMin/ageMax年龄门槛(原死门控) + 3 项跨域联动增强(A→D/A→C/A→E)；构建 9012.8KB

> 前置批次16：技能连携纯函数 checkSkillSynergies / getSkillSynergyBonus 迁 src/app/core/skills/synergy.ts TS 规范源（数据表 SKILL_SYNERGY_DUAL/TRIPLE/THEME 提至 synergyData.ts 规范源）；双连携激活时写入 state.flags['_synergy_'+id]=true 副作用与 vanilla 一致，data/jobs.js 以 requiredFlag 依赖该标记解锁连携工作；新增 TS↔vanilla 双向比对单测 40025/40025（数据表3保真 + 静态16 + 2500 随机种子×16 断言，覆盖 dual/triple/theme 全分支 + flags 副作用 + getSkillSynergyBonus 工作特定 incomeMultiplier）；src/js 端零改动、加载序不变）
> 前置批次15：地点旅行 AP 消耗纯函数 getTravelApCost 迁 src/app/core/travel/apCost.ts（独立模块规避 travel.ts 回滚），TRAVEL_GRAPH/LOCATIONS 注入参数传入，13248/13248 等价单测。
> 历史流水账已归档到 `docs/changelog/`，本文件仅保留活文档。

---

# 🔬 全局系统审查报告（2026-07-16 · 游戏设计权威视角）

> 本节是一次**跨架构+内容**的系统性体检，按轻重缓急（P0 立即 / P1 近期 / P2 中期 / P3 长期）排序。
> 与既有 8 域轮换 loop 的关系：loop 擅长**局部 A 类缺陷修复 + 联动事件增强**，但对**结构性/宏观债务**无能为力（loop 铁律明令"不得改动既有 UI/加载顺序"）。本报告专收 loop 覆盖不到的系统级问题。
> **量化事实底座（2026-07-16 实测）**：244,583 行 JS · 158 个全局 `<script>` · 单文件 dist **8.3 MB**（gzip 1.93 MB）· `cross_system_events.js` **单文件 52,319 行** · 事件对象约 1,238 个 · NPC 75 · 工作 49 · 70 个全局 `window.*` 命名空间。

## P0 — 立即（阻碍可持续开发 / 影响真实玩家体验）

| # | 问题 | 证据 | 影响 | 建议 |
| - | ---- | ---- | ---- | ---- |
| P0-1 | **首屏加载体积失控** | dist 单文件 8.3 MB（未压缩），移动端 4G 首开需数秒白屏；全部 158 脚本同步内联无 defer/懒加载 | 短视频时代注意力经济下，**首屏 >3s 流失率陡增**；这是留存的头号杀手，比任何新事件都重要 | 拆分「首屏必需（引擎+UI+开局剧本）」与「懒加载（事件库/百科/Phase2）」；事件库改为运行时按 phase 动态注入；目标首屏 payload <1.5 MB |
| P0-2 | **`cross_system_events.js` 5.2 万行单文件** | 占全库 21%，是第二大文件的 1.8 倍；R28 已记录"并行窗口同改此文件 pre-commit 碰撞" | 任何人碰它都 diff 爆炸、合并冲突、AI 读取烧 token；多窗口协作直接锁死 | 按联动主题（NPC/经济/健康/道德/季节…）物理拆成 8~10 个 `cross_*.js`，每个 ≤3k 行；纯机械拆分 + IIFE 注入不变，风险低收益高 |
| P0-3 | **存档无版本迁移机制** | `save.js:827` 仅 `if(!data.version||!data.player)` 一道校验，无逐版本 migrate 链 | 244k 行代码每轮都在改 state 字段（历史记录里"旧存档崩溃"反复出现）；老玩家更新即存档报废 = **硬核流失** | 建立 `SAVE_VERSION` + `migrations[]` 管线，每次加字段配一个迁移函数（CLAUDE.md 已提"挂 `_webApp` 配迁移"但未系统化） |
| P0-4 | **零自动化行为测试** | `tests/` 仅蒙特卡洛经济模拟；日常验证只有 `node --check`（语法）+ 人工 F5 | 语法通过 ≠ 事件能触发（历史上"15 事件缺 phase 永不触发""TriggerRegistry 6 年静默失效"都是语法正确的死代码） | 加一层 headless 冒烟：开局→跑 100 天→断言"事件触发数>0/无 undefined 崩溃/关键 tab 可渲染"，接入 pre-commit |

## P1 — 近期（技术债 + 核心体验短板）

| # | 问题 | 证据 | 影响 | 建议 |
| - | ---- | ---- | ---- | ---- |
| P1-1 | **事件系统三套并行子系统** | MORAL_EVENTS（声明式）/ NEWS_EVENTS（声明式）/ events_core RANDOM_EVENTS（引擎）+ trigger_registry（POC 未全量迁移），R7 已明确记录 | 同一"事件"概念四种格式，新人/AI 极易写错格式产死代码；触发条件 `conditions` vs `triggers` 双轨并存 | 收敛为**单一事件 schema + 单一注册入口**，trigger_registry 从 POC 提为唯一触发层，其余格式写适配器 |
| P1-2 | **70 个全局 `window.*` 命名空间无边界** | 全局 var/function 挂载，`TAB_RENDERERS` 靠"运行时 `window[fnName]` 动态解析"绕过加载顺序问题 | 加载顺序脆弱（CLAUDE.md 明令"禁止改 script 顺序"本身就是债务的症状）；任何重命名都是地雷 | 中期向 CLAUDE.md 已铺的 Vite/TS 通道迁移；短期至少给全局对象加 `CLS.` 单一命名空间收口 |
| P1-3 | **`_r21`~`_r27` 碎片文件** | 6 个 `*_linkage_events_r*.js`（146~304 行），按"第几轮 loop"而非按领域命名 | 领域内容散落多文件，找"经济联动"要翻 economy_linkage + economy_invest + economy_r27 三处 | 按领域合并（economy 系一个文件），文件名去掉轮次编号 |
| P1-4 | **内容广度 vs 深度失衡** | 1,238 事件里绝大多数是**一次性触发的单点叙事**（loop 每轮 +3~5 个"联动事件"，30+ 轮累积） | 玩家感知是"事件很多但互不影响"；缺**跨事件的长线因果链**（选择 A→30 天后果→再分叉）。真正的留存来自"我的选择塑造了独特轨迹"，而非事件数量 | 下一阶段重心从"加事件数量"转向"加事件链深度"：建 3~5 条贯穿全周目的主线因果树（参考《This War of Mine》结局分支） |
| P1-5 | **新手前 10 分钟信息过载** | 移动端顶栏 10 指标常驻 + 引导 + 新闻 + 多 tab；历史反复调"认知负荷"却是打补丁 | 认知负荷（你最懂的心理学维度）在开局阶段爆表；峰终定律的"始"没做好 | 做**渐进式揭示**：开局只露 3 个核心指标（钱/健康/今日目标），其余随进度解锁 |

## P2 — 中期（架构健康 + 设计纵深）

| # | 问题 | 建议 |
| - | ---- | ---- |
| P2-1 | **59"剧本"数疑为统计噪声**（grep 59 但实际 SCENARIOS 仅 8 条：7 剧本+沙盒） | 已核实：scenarios.js 中 SCENARIOS 数组含 8 项（classic/laid_off/small_town_grinder/foreign_worker/second_gen/midlife_crisis/fresh_grad + scenario_mode 沙盒模式），与 CLAUDE.md 的"7 剧本+沙盒"一致。59 为全库 `scenario` 关键词匹配噪声。无需清理。 |
| P2-2 | **build.py 纯字符串内联，无 tree-shaking/压缩** | JS 未 minify（dist 8.3MB 里大量空白+注释+中文全量）；引入轻量压缩即可省 30%+ |
| P2-3 | **两套架构长期并存**（legacy 全局 JS + Vite/TS 壳只是"通道"） | 已明确：短期保持双架构（新数据优先入 `src/app/data/` TS 化）；中期逐子系统迁移（数据→事件→UI）；长期 legacy 退休。CLS（P1-2）提供过渡入口。 |
| P2-4 | **DEVELOPMENT.md 6800 行 + CLAUDE.md 极长** | 文档本身成为 token 黑洞；历史流水账应归档到 `docs/changelog/`，主文档只留活文档 |
| P2-5 | **数值平衡靠 MC 但存活率长期偏低**（balanced 策略~8天, 旧报告0%） | v3.2 后 balanced 策略存活~8天(clean gameOver, seed依赖)。已定位根因：前期健康衰减过快+收入不足覆盖基本需求。建议：① 健康衰减曲线缓坡（前30天减半速）；② 开局保证最低收入（日结保底¥20）；③ corporate 策略加健康底线守卫。 |

## P3 — 长期（愿景 / 差异化）

- **P3-1 情感记忆的收束**：1,238 事件缺一个"人生回望"的收束仪式把散点串成故事。已有 life_ribbon/life_memoir，但应升级为**周目结束时自动生成"你的城市故事"图文长图**（短视频时代的天然分享物料，兼做拉新）。
- **P3-2 社会比较的显性化**：NPC 有 monthlyIncome 但仅零星对比。可做常驻"同龄人进度"锚点（你最擅长的社会比较心理），制造持续的向上驱动力。
- **P3-3 差异化定位**：当前是"人生重开+大多数"的融合体，需要一个**独占记忆点**（如某个别家没有的核心机制），否则在品类里难被记住。

---

> **执行建议**：P0 四项应各起一个独立专项分支处理（不塞进 8 域 loop，因 loop 铁律禁止动结构/加载顺序）。P0-2（拆大文件）风险最低、收益最直接，可作为第一刀。

---

# 🛠️ P0 根治 + P1–P3 落地路线（2026-07-16）

> 本节把上方体检报告转成**可执行路线**。P0 四项本轮全部落地（各独立 commit、可独立回滚）；P1–P3 逐项给出建议方案与验收口径，后续按项认领。

## P0 落地状态（本轮全做）

| # | 方案 | 关键改动 | 验收口径 | 状态 |
| - | ---- | ---- | ---- | ---- |
| P0-1 | 首屏 **defer 外部化 bundle** | `build.py` 的 `inline_js`→`bundle_js`：所有 `<script src>` 按 index.html 出现序串接进单个外部 `dist/app.js`，首标签替换为 `<script defer src="app.js">`，其余删除；两段内联脚本（错误边界 / boot）保留内联；boot 的 `showWelcome()` 包进 `DOMContentLoaded`（defer 时序安全）；`verify-deploy.mjs` 渲染标记/体积断言迁到 app.js | `python build.py` 生成瘦身 index.html（~126 KB）+ app.js（~8.3 MB，GitHub Pages 自动 gzip）；`verify:deploy` 全绿；浏览器双端（src 直开 / dist 起 http-server）无 ReferenceError、欢迎屏先渲染 | ✅ 已实现 |
| P0-2 | 巨型文件**物理拆分**（前置完成） | `cross_system_events.js` 52,319→6,399 行，析出 `cross_system_events_part1..8.js`（各含 guard-IIFE，字节级重构验证一致，运行时 `RANDOM_EVENTS.length` 前后相等） | node --check 全过 + push 数与 runtime length 双验证 | ✅ commit `16d07dc8` |
| P0-3 | 存档**深合并默认值 + SAVE_VERSION + 迁移注册表** | `state.js`：新增 `deepMergeDefaults`（saved 覆盖 defaults、数组整替、含 null 保留、跳过原型键）+ `SAVE_VERSION="2.0.0"` + 有序 `SAVE_MIGRATIONS`（历史 30+ 条 `if(!s.x)` 整体归入 to:"2.0.0" 步）；`importState` 重写为三段式 merge→migrate→stamp（次序不可反）；migration-only 容器（企业 Phase1 字段 / `_experiencedNarratives`）补入 createDefaultState 使各存档形态统一；`save.js` 放宽 `importSave` 无版本硬拒 | 缺字段被回填、`version==="2.0.0"`、fame/npcRelations 搬移正确、有效存档数值不变 | ✅ 已实现 |
| P0-4 | 行为测试**断言层**（复用 headless runner） | `tests/lib/script_manifest.cjs`（解析 index.html 根除 `getScriptOrder` 漂移，runner 改为调用它、留内置回退）；`tests/events_integrity.cjs`（id 唯一 / 可达性 phase∈{street,corporate}∨`_isChainEvent`∨`triggers` / 可施效 / 类型正确 / TriggerRegistry 槽注册>0）；`tests/smoke_sim.cjs`（seed×300 天，断言无异常/health∈[0,100]/cash·needs 非 NaN/day 单调）；`package.json` 加 `check:events` + `test` | 三 cjs 逐一跑通；events_integrity 首跑若红=揪出存量死事件（单列 P1，不放宽不变式） | ✅ 已实现 |

### P0-4 首跑已发现的存量疑点（转 P1 修复项，不阻塞框架）

- **`TriggerRegistry.loadAll()` 读 `window.RANDOM_EVENTS`**（`trigger_registry.js:167`），而 `RANDOM_EVENTS` 是顶层 `const`，浏览器中**不挂 `window`**。`main.js:5171` 的初始化 IIFE 也走 `window.TriggerRegistry.loadAll()`。若 `RANDOM_EVENTS` 未被显式桥接到 `window`，约定式 `triggers` 事件将**全部注册失败**（正是 P0-4 要抓的"静默失效"类）。→ 建议 P1 核实并加一行 `window.RANDOM_EVENTS = RANDOM_EVENTS` 桥接或改读顶层引用。events_integrity 已内置桥接后再断言以避免误报。

## P1 落地路线（近期）

- **P1-1 事件四套格式收敛**：MORAL_EVENTS / NEWS_EVENTS / RANDOM_EVENTS / TriggerRegistry 统一到「数据对象 schema + 中央 loader + 单一触发层」。迁移正确性由 P0-4 的 `events_integrity` 守门（每步迁移后跑，不变式不许放宽）。验收：四套注册路径归一，`events_integrity` 保持全绿，事件总数不减。
- **P1-2 `window.*` 命名空间收口**：先给全局对象加 `CLS.` 单一命名空间（`CLS.RANDOM_EVENTS` 等），分批把裸全局迁入；中期接 Vite/TS 通道。验收：`window.*` 顶层数显著下降，加载顺序不再脆弱（P0-4 smoke 全绿）。
- **P1-3 `_r21~_r27` 碎片文件按领域合并**：`economy_linkage_events{,_r27}.js` 等按领域并入主题文件，去轮次编号。纯移动 + IIFE 注入不变。验收：文件数减少、`events_integrity` id 唯一性不破、runtime 事件数不变。
- **P1-4 内容深度（长线因果链）**：重心从"加事件数"转向"加事件链"。建 3~5 条贯穿全周目主线因果树（选择 A→N 天后果→再分叉），复用现有 `_chainEventQueue` / `scheduleChainEvent`。验收：主线链可端到端跑通（smoke 加一条链完成断言）。
- **P1-5 新手认知过载**：渐进式揭示——开局只露 3 个核心指标（钱/健康/今日目标），其余随进度解锁。验收：首日可见指标数 ≤3，后续按里程碑解锁。
- **P1-6 事件叙事门控体系（Layer 1-6）**：从技术层到选择均衡层的完整门控框架（规范源 `memory/event-gate-layer-system.md`，本轮补全）。Layer 1（技术层）✅ 已全覆盖；Layer 2（NPC自洽）🔶 部分覆盖（[Layer2] 待系统铺开）；Layer 3（玩家状态自洽）✅ 全覆盖（99 处门控 / 19 文件，a35defbf 2026-07-22 18:18）；Layer 4（时间线逻辑）🔴 进行中（L4-A gameOver 泄漏门控累计 130 处（street 全覆盖 125：survival 49 + wealth 54 + life 22）：首过 5 处 chengguan_events.js + events_corp.js 链式事件 + 续扫 125 处 street 事件 conditions；**gameOver 字段一致性专项已完成**（根级 gameOver 真正写入 → 130 处 L4-A 门控正式生效）；L4-B phase-less 死事件 114 候选逐条人工复核；L4-C/D/E 待做）；Layer 5（经济缩放）✅（loop eb57efb3：scaleAmount + 41 处硬编码金额动态化）；Layer 6（选择均衡）⏳。验收：Layer 3 修复后 events_integrity 全绿 + 叙事穿帮事件 conditions 补全率 100%；Layer 4 验收 = gameOver 后无叙事事件 apply + 100% 事件含 `phase` 字段。

## P2 / P3 落地路线（中长期）

- **P2-2 build 压缩**：已落地（esbuild minify: 8.3→6.25MB, -25%）。验收: build ✅ / smoke ✅。
- **P2-3 双架构终局**：已明确——短期双架构并存（新数据入 `src/app/data/` TS化），中期逐子系统迁移（数据→事件→UI），长期 legacy 退休。
- **P2-4 文档 token 治理**：已落地（DEVELOPMENT.md 6916→95行, 归档到 docs/changelog/）。
- **P2-5 MC 存活率偏低**（balanced ~8天）：根因——前期健康衰减过快+收入不足以覆盖基本需求。建议：① 健康衰减前30天减半速；② 开局日结保底¥20；③ corporate 策略加健康底线守卫。
- **P3-1 周目收束仪式**：升级 life_ribbon/life_memoir 为周目结束自动生成"你的城市故事"图文长图。
- **P3-2 社会比较显性化**：NPC `monthlyIncome` 做常驻"同龄人进度"锚点。
- **P3-3 差异化记忆点**：确立"城市记忆网络"（City Memory Network）为独占核心机制——NPC 记得你做过的事、会在彼此间口耳相传，创造一个"活着的城市"。已实现：NPC 关系追踪+社交网络传播。增强：侧栏添加"🧠 城市记忆"指示器（已结识NPC数/总数），强化"被记住"的归属感。


---
> 历史 loop 轮次记录已归档到 `docs/changelog/loop-records.md`。
> 版本日志请见 `docs/changelog/version-history.md`。
