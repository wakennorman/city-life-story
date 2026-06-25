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

- 新 JS 模块 → 放在 `city-life-story/src/js/` 下
- 必须在 `city-life-story/src/index.html` 中注册加载

## 🔥 触发短语（极简快捷指令 — 跨 Hermes / Claude Code / 任意 agent）

收到以下短语时，**先去读对应 SOP 文件再执行**，不要凭印象做：

| 用户说                           | 自动加载                                | 用途                                                                 |
| -------------------------------- | --------------------------------------- | -------------------------------------------------------------------- |
| **"按 v3.0 审查改进"**           | `memory/review-improve-v3.0.md`         | 全方位评估+改进（代码/架构/机制/剧情/UI/留存），自动评分+落地+commit |
| **"按 v2.1 提示词继续内容扩充"** | `memory/content-expansion-v2.1.md`      | 成套添加地点/NPC/商品/事件                                           |
| **"按 1.4 标准检查"**            | `memory/1-4-standard-implementation.md` | 世界自洽性四维度审计                                                 |

**执行规约**：

- 看到触发短语→`Read` SOP 文件全文（每个 ≤8KB）→按其中流程执行
- 不要在没读 SOP 的情况下凭记忆做事
- 完成时引用所用 SOP 版本号写在 commit message 和 DEVELOPMENT.md

---

## 项目信息

- 入口: `src/index.html`（开发）/ `dist/index.html`（部署）
- **构建**: 每次修改 `src/` 后必须 `python build.py` 重新打包 `dist/`
- 开发文档: `src/DEVELOPMENT.md`（每次改动必须同步更新）
- 技术栈: 纯 HTML5 + CSS + Vanilla JS，零框架，无 npm 构建步骤
- **核心架构: 世界参数反馈环（v1.7）** — `src/js/core/world_params.js` 定义统一的 `_worldParams` 状态，将行业热度/市场情绪/财富等级纳入单一反馈闭环。行业热度由随机漂移+传导+新闻驱动（玩家个人不直接影响），财富反馈由玩家总资产决定，所有参数以 2%/天向基线衰减
- 所有 JS 文件通过 `<script src="...">` 在 index.html 中按序加载，**禁止改变 script 标签顺序**

## 当前状态

> 每次收工前覆盖更新本节（只留最新状态，不要追加历史）；详细变更历史在 `src/DEVELOPMENT.md`，不需要每次都读。

- **最新一次工作**：v3.7 P1改进中断保存（2026-06-25，Hermes Agent → 交Codex接力）
  - **已提交**（155da2b）：
    - P1-3 `scaleEventReward` — 事件奖励动态缩放（events_core.js）
    - P1-5 `rollEquipmentDrop` — 装备掉落系统（items.js，4来源×4品质）
    - 扩展 `social_network.js` — 社交网络骨架（朋友圈/微博/网红/舆论）
    - `inheritance_chain.js` — 文化遗产链扩充（+62行）
  - **回退**：moral_events.js 回退基线（上次扩充语法损坏）
  - **构建**：已 `python build.py`（4040.1 KB）
  - **待Codex接力**：↓ 下方「Codex接力清单」

## 🔁 Codex接力清单（未完成任务，按优先级排序）

### 第一阶段：P1改进（4项，~470行）

1. **P1-1 新闻→投资UI** — `phase2/investment.js` UI渲染中调用 `getNewsInvestmentSummary`，添加"今日市场驱动"板块
2. **P1-2 NPC好感链路** — `data/npcs.js` 为每个NPC增加 `affinityEvents`（30/60/80阈值），`phase1/npc_event_bridge.js` 增加 `checkNpcAffinityEvents` 函数
3. **P1-4 家庭系统** — `phase2/family_life.js` 实现结婚系统（好感≥80+资产≥¥200K→求婚）+ 生子/子女教育
4. **P1-6 35岁危机追访** — `core/events_core.js` 增加追访事件优先级（权重×3）

### 第二阶段：P2修复（2项，~100行）

5. **P2-4 道德事件扩充** — `data/moral_events.js` 重建18个新事件（极端生存困境：偷药救孩子/争食/举报同事/邻居借钱等），原扩充因语法结构损坏已回退基线
6. **main.js重构** — 已存在解耦方案但未实装

### 第三阶段：扩展系统（5项，需设计）

7. 社交网络UI（social_network.js已完成骨架→需UI集成）
8. 旅行系统
9. 医疗系统
10. 法律系统
11. 人生节点

*详细任务清单：`IMPLEMENTATION_TASK.txt`（需重建，之前的只列到P1）*

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
- 禁止 `git push`（只做本地修改）
- 禁止引入任何外部库或 npm 包
- 禁止在改到一半时停止（功能要完整可运行再停）

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
