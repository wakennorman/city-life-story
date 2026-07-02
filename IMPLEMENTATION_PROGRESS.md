# v3.7 进度总控

> 每完成一步，把 ❌ 改成 ✅
> 下个 Agent 读这个就知道从哪继续

## 2026-07-02 第八轮：事业发展Tab完善（审查改进与扩展）

| #   | 任务                       | 状态 | 说明                                                                                         |
| --- | -------------------------- | ---- | -------------------------------------------------------------------------------------------- |
| 1   | 现状摸底/诊断/方案         | ✅   | memory/overview.md, diagnosis.md, improvement_plan.md 第八轮版                               |
| 2   | P0-1 职场社交每日tick接通  | ✅   | daily_pipeline 函数名 tickWorkplaceSocialDaily→tickColleagueRelationships + 路径改 corporate |
| 3   | P0-2 职场社交主动行动UI    | ✅   | 入职生成同事 + 请客/闲聊/拜师按钮，激活死代码                                                |
| 4   | P0-3 退休停薪+养老金       | ✅   | _retired+pensionBase，tickCareerJobDaily 退休分支发40%养老金                                 |
| 5   | P0-4 业绩主动提升行动      | ✅   | 做项目/加班/冲刺KPI 按钮                                                                     |
| 6   | P0-5 burnout减压+过劳后果  | ✅   | 调休按钮 + 过劳病假 + 慢性过劳                                                               |
| 7   | P0-6 学历研究生/博士入口   | ✅   | edu门槛递增（本科150/研究生300/博士500），6级全可达                                          |
| 8   | P0-7 注册费口径统一        | ✅   | 删 \|\|200000 兜底 + 百科/wiki 改动态计算说明                                                |
| 9   | P1-2 主动跳槽机制          | ✅   | generateJobOffers/applyJobhop，3类offer+门路门槛+30天冷却                                    |
| 10  | P1-3 年度考核调薪+历程补全 | ✅   | 每365天 S12%/A8%/B3%/C不涨 + 项目完成记history                                               |
| 11  | P1-6 移动端网格兜底        | ✅   | career-capital-bar/career-path-grid @media480px !important 覆盖                              |
| 12  | 验证                       | ✅   | check:js(114)/typecheck/build.py(4351KB)/build 全过                                          |

### 待排期（下轮）

- [x] **P1-4 副业主业冲突** ✅ `side_hustle.js::performHustle`：主业在职→副业收入×0.80，倦怠≥60时×0.65，同时副业消耗burnout+3
- [x] **P1-5 证书职称加成** ✅ `career_dev.js::_calcCertSalaryBonus`：月发薪时独立计算证书加成，IT+5%/金融+8%/餐饮+10%/英语通用+3%等
- [x] **P1-7 总览页增强** ✅ `career_dev.js::renderCareerOverview` 全量重写：职位卡/晋升进度条/业绩倦怠条/5维资本雷达/跳槽机会/智能建议
- [x] **P1-8 扩充职业路径** ✅ 新增3路径：🏫 教育培训(4级)、🚚 物流快递(4级)、🍜 餐饮服务(4级)；医疗/公务员下轮

## 2026-07-02 第九轮：蓝图制定 + P1-4/5/7/8实装

| #   | 任务                                        | 状态 | commit  |
| --- | ------------------------------------------- | ---- | ------- |
| 1   | 撰写GAME_BLUEPRINT.md                       | ✅   | b999470 |
| 2   | P1-8 教育/物流/餐饮3条职业路径              | ✅   | b999470 |
| 3   | BugFix 跨路径offer薪资下限                  | ✅   | b999470 |
| 4   | P1-5 证书→月薪加成                          | ✅   | b999470 |
| 5   | P1-7 总览页数据可视化                       | ✅   | b999470 |
| 6   | P1-4 副业主业时间冲突惩罚                   | ✅   | b999470 |
| 7   | 验证 check:js(114)/build.py/typecheck/build | ✅   | 全通过  |

### 待排期（第十轮）

- [x] **医疗/公务员 2路径** ✅ `career_dev.js`：医疗护理🏥(4级¥4500-¥24000) + 公务员🏛️(4级¥5500-¥26000)；commit 60f7d24
- [x] **职业专属随机事件** ✅ `career_path_events.js`：35个叙事事件覆盖11条路径，接入RANDOM_EVENTS；commit 60f7d24
- [ ] **startup.js拆分**（14443行，系统性工程，禁止改index.html顺序）
- [ ] **装备品质系统激活**（实例格式统一+effectMult接入+3渠道+旧系统清理）
- [ ] **城市服务层3消费点**（公积金→buyProperty利率分支；体检→降大病概率）

## 2026-07-02 第十轮：医疗/公务员路径 + 职业专属随机事件

| #   | 任务                                        | 状态 | commit  |
| --- | ------------------------------------------- | ---- | ------- |
| 1   | 医疗护理路径(medical，4级)                  | ✅   | 60f7d24 |
| 2   | 公务员路径(civil，4级)                      | ✅   | 60f7d24 |
| 3   | _calcCertSalaryBonus 新路径加成             | ✅   | 60f7d24 |
| 4   | career_path_events.js（35事件）             | ✅   | 60f7d24 |
| 5   | index.html注册新文件                        | ✅   | 60f7d24 |
| 6   | 验证 check:js(115)/typecheck/build.py/build | ✅   | 全通过  |

### 待排期（第十一轮）

> 蓝图对应见 `GAME_BLUEPRINT.md` 第二节。每轮实装前先读蓝图确认 P 优先级。

- [ ] **NPC角色深化**（关键NPC专属事件链 × 3人）— 蓝图 P1-C（NPC关系影响跳槽/系统交叠）
- [ ] **城市服务层3消费点**（公积金→buyProperty；体检→降大病概率）— 蓝图 P1-D（系统间后果联动）
- [ ] **装备品质系统激活**（effectMult接入+3渠道）— 蓝图 P1-E
- [ ] **startup.js拆分**（14443行，系统性工程，架构债）— 蓝图 P2（技术债，不阻断玩法）

## 2026-07-01 第六轮：收尾清理 + 城市服务真实效果 + Monte Carlo 最小补丁

| #   | 任务                   | 状态 | 说明                                                                                                                                          |
| --- | ---------------------- | ---- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | 工作树清理             | ✅   | 删 nul（tasklist 误产生）；15 个 Prettier 格式化单独 chore 提交（已逐一核实零逻辑）                                                           |
| B   | 城市服务占位补真实效果 | ✅   | bridge.js followUp 补 4 分支：征信→_creditInfoReady / 社保≥3次→_socialCardReady / 公积金→_housingFundAvailable / 体检→medical.healthCheckDone |
| C   | 城市服务消费点接入     | ◑    | finance.js calculateLoanCapacity：征信降利率15% + 社保卡加额度10%；公积金/体检消费点待接（见待排期清单）                                      |
| D   | Monte Carlo 浏览器脚本 | ✅   | tools/monte_carlo_runner.js + README：拦截 showModal + 循环 endDay + 事件频率采样；P2 缺口最小补丁，限制见 README                             |
| E   | 装备品质激活           | ⏸    | 探查后发现是系统性工程（实例格式不一致 + 数值乘数零调用 + 3 渠道未接 + 旧 rollEquipmentDrop 并存），推迟单独排期（见待排期清单）              |
| F   | TODO 提醒落档          | ✅   | 见下方「待排期清单」                                                                                                                          |
| G   | 验证 + push            | ⏳   | 待 Bash 稳定：check:js / typecheck / build.py / build 全通过 + git push origin main                                                           |

### 本轮落地

| #   | 项目                       | 文件                                             |
| --- | -------------------------- | ------------------------------------------------ |
| 1   | 城市服务 followUp 4 分支   | `src/js/app_bridge/webapp_runtime_bridge.js`     |
| 2   | 贷款利率/额度接入征信+社保 | `src/js/core/finance.js`                         |
| 3   | Monte Carlo 跑分工具       | `tools/monte_carlo_runner.js`, `tools/README.md` |
| 4   | nul 清理 + Prettier chore  | （git commit）                                   |

### 待排期清单（防遗忘·单独一轮集中做）

- [ ] **startup.js 拆分**（`src/js/phase2/startup.js`，488KB/14443行/57章节/7大块）：单独一轮集中做，用「同位置单 script 换多条连续子文件」顺序保持法，全量验证。**禁止改 index.html script 顺序**。
- [ ] **events_street.js 拆分**（9827 行）+ **render.js 拆分**（6024 行）：CLAUDE.md 接力清单原列 3 大文件，与 startup 同等处理。
- [ ] **装备品质系统激活**（系统性工程，单独一轮，涉及核心数值需充分验证）：
  - 实例存取格式统一：`createEquipmentInstance`（equipment_quality.js:325）生成 `instanceId=id_timestamp_random`，但 `buyItemFromShop`（modal.js:1044）读取用 `id+"_instance"`，不一致需统一
  - `getQualityPriceMult` / `getQualityEffectMult`（equipment_quality.js:215/220）**零调用**，需接入价格计算与装备效果计算（jobBonuses 应用点）
  - 获取渠道单一（仅 `modal.js::buyItemFromShop`）：拾荒 / NPC好感奖励 / 事件掉落需接 `createEquipmentInstance`
  - 旧 `rollEquipmentDrop`（items.js:1077，自带 `rollEquipmentQuality`，零调用）与新系统并存，需清理或迁移
  - CSS 动画（`.quality-legendary` 脉冲，style.css:738-755）**已存在**，无需做
- [ ] **城市服务层3消费点**：公积金 `_housingFundAvailable` → `investment.js::buyProperty` 房贷加公积金利率分支；体检 `medical.healthCheckDone` → 疾病触发函数（定位在 main.js/diseases.js，非 medical.js）降大病概率
- [ ] **Monte Carlo 增强**：智能行动模拟（`getAvailableActions(state)[0].handler`）+ 多策略对比 + 自动事件选择（见 `tools/README.md`「后续增强方向」）

## 2026-07-01 第五轮审查：3个留待项实装（新闻→世界参数 / 行业周期事件 / 日志滚动）

| #   | 任务                   | 状态 | 说明                                                                                                |
| --- | ---------------------- | ---- | --------------------------------------------------------------------------------------------------- |
| A   | 现状摸底（刷新）       | ✅   | memory/overview.md 刷新；确认3个留待项的源码实况                                                    |
| B   | 问题诊断（刷新）       | ✅   | memory/diagnosis.md；定位关键瓶颈=applyNewsEffect 不写 _worldParams                                 |
| C   | 改进方案（刷新）       | ✅   | memory/improvement_plan.md；P1-4 为关键节点（P1-3 的信号源）                                        |
| D   | P1-4 新闻→世界参数联动 | ✅   | applyNewsEffect 处理 effects.sectorHeat/marketMoodShift；13条NEWS_EVENTS 改装 sectorHeat 字段       |
| E   | P1-4 世界参数消费      | ✅   | updateMarketMood 折入 _newsMoodShift；decayWorldParams 每日衰减70%                                  |
| F   | P1-3 行业周期事件链    | ✅   | cross_system_events.js 新增"行业寒冬"(sectorHeat<0.85)+"行业红利期·创业侧"(>1.15 且有公司) 双向事件 |
| G   | P1-2 日志滚动稳态      | ✅   | renderMessageLog 加"近底部判断"，上翻阅读时不被新消息强制拉回                                       |
| H   | 验证                   | ✅   | check:js(114) / typecheck / python build.py(4321.7KB) / npm run build 全通过                        |
| I   | Monte Carlo 浏览器验收 | ⏸    | 无自动化node脚本（P2已知缺口）；改动为加性+一次幅±0.04~0.10且受2%/日衰减约束，风险低，留待浏览器跑  |

### 本轮落地

| #   | 项目                                       | 文件                                 | 验证 |
| --- | ------------------------------------------ | ------------------------------------ | ---- |
| 1   | applyNewsEffect 写世界参数                 | `src/js/data/news.js`                | ✅   |
| 2   | 13条新闻补 sectorHeat/marketMoodShift 字段 | `src/js/data/news.js`                | ✅   |
| 3   | updateMarketMood/decayWorldParams 消费偏移 | `src/js/core/world_params.js`        | ✅   |
| 4   | 行业寒冬 + 行业红利期·创业侧 事件          | `src/js/core/cross_system_events.js` | ✅   |
| 5   | 日志滚动近底部判断                         | `src/js/main.js`                     | ✅   |
| 6   | memory三件套刷新                           | `memory/overview.md` 等              | ✅   |

## 2026-06-27 第四轮审查第二阶段：TS事件bridge全量同步

| #   | 任务                       | 状态 | 说明                                                                    |
| --- | -------------------------- | ---- | ----------------------------------------------------------------------- |
| A   | 现状摸底（刷新）           | ✅   | 读取memory三件套，确认上轮P0问题已全部修复                              |
| B   | P0已验证：城市服务按钮灰显 | ✅   | showCityServiceModal() 已用 canPay() 全量实装                           |
| C   | P0已验证：医疗面板双入口   | ✅   | _renderMedicalPanel() 已有就医治疗+医保咨询双按钮                       |
| D   | P0已验证：地点推荐中文化   | ✅   | _lifeSystemsLocationNames() 从 LOCATIONS 映射中文                       |
| E   | P1 TS事件bridge全量同步    | ✅   | bridge池从11→19个事件（+8同步自TS目录），19个全部注入RANDOM_EVENTS      |
| F   | memory文档对齐             | ✅   | overview/diagnosis/improvement_plan 全部刷新                            |
| G   | 验证                       | ✅   | `check:js` / `typecheck` / `python build.py` / `npm run build` 全部通过 |

### 本轮落地

| #   | 项目                      | 文件                                                        | 验证 |
| --- | ------------------------- | ----------------------------------------------------------- | ---- |
| 1   | memory三件套刷新          | `memory/overview.md`, `diagnosis.md`, `improvement_plan.md` | ✅   |
| 2   | TS事件bridge全量同步(8个) | `src/js/app_bridge/webapp_runtime_bridge.js`                | ✅   |
| 3   | 数据目录计数更新          | `src/js/app_bridge/webapp_runtime_bridge.js`                | ✅   |
| 4   | CLAUDE.md 当前状态更新    | `CLAUDE.md`                                                 | ✅   |

## 2026-06-26 城市浮生记审查改进与扩展

| #   | 任务             | 状态 | 说明                                          |
| --- | ---------------- | ---- | --------------------------------------------- |
| A   | 现状摸底         | ✅   | 已刷新为第二轮诊断                            |
| B   | 问题诊断         | ✅   | 已刷新为第二轮诊断                            |
| C   | 改进方案         | ✅   | 已刷新为第二轮诊断                            |
| D   | CSS 清理与移动端 | ✅   | 移除隐藏冗余，新增投资溢出防护、紧凑样式      |
| E   | Wiki 百科增强    | ✅   | world_params 新增策略提示 section             |
| F   | 创业提示增强     | ✅   | 无职场资源时显示引导提示文字                  |
| G   | 文档与验证       | ✅   | 更新 CLAUDE.md/DEVELOPMENT.md，commit 21d2d00 |

## 2026-06-26 用户反馈修复：财务/UI/职业/新闻

| #   | 任务               | 状态 | 说明                                                                                         |
| --- | ------------------ | ---- | -------------------------------------------------------------------------------------------- |
| A   | 完善计划与经验教训 | ✅   | 新增 `memory/2026-06-26-user-feedback-plan.md` 与 `memory/long_term_lessons.md`              |
| B   | P0 财务与输入修复  | ✅   | 修复沙盒姓名输入、每日收支假平衡、曲线历史写入、创业注册资金口径                             |
| C   | P0 UI 与显示修复   | ✅   | 状态危机弹窗纵向换行、禁用按钮真实禁用、背包中文名兜底、天气准备入背包                       |
| D   | P1 入口与联动修复  | ✅   | 人生目标移出行动列表，保留开局强制弹窗与个人成长目标联动                                     |
| E   | P1 职业/新闻/左栏  | ✅   | 职业晋升读真实技能，展示业绩/人脉条件；新闻新增快报弹窗；位置/天气/住所/仓库压缩进顶部信息条 |
| F   | 验证               | ✅   | `npm run check:js`、`npm run typecheck`、`python build.py`、`npm run build` 均通过           |

## 2026-06-26 v3.8 断点续传审查：人生事务常驻面板

| #   | 任务     | 状态 | 说明                                                                             |
| --- | -------- | ---- | -------------------------------------------------------------------------------- |
| A   | 现状摸底 | ✅   | 刷新 `memory/overview.md`，确认 TS 数据目录已填充，当前断点是扩展系统缺常驻 UI   |
| B   | 问题诊断 | ✅   | 刷新 `memory/diagnosis.md`，按一行一项记录 P0/P1/P2 问题                         |
| C   | 改进方案 | ✅   | 刷新 `memory/improvement_plan.md`，本轮实装前 3 条可验证方案                     |
| D   | 实装交付 | ✅   | `src/index.html` + `src/js/ui/render.js` 新增“人生事务”Tab                       |
| E   | 验证     | ✅   | `check:js` / `typecheck` / `check:ts-data` / `build.py` / `npm run build` 均通过 |

### 本轮落地

| #   | 项目                     | 文件                                         | 验证 |
| --- | ------------------------ | -------------------------------------------- | ---- |
| 1   | 4 大扩展系统常驻面板     | `src/index.html`、`src/js/ui/render.js`      | ✅   |
| 2   | 城市服务推荐玩家可见     | `src/js/ui/render.js`                        | ✅   |
| 3   | TS 内容目录接入状态展示  | `src/js/ui/render.js`                        | ✅   |
| 4   | 社区体检健康字段接线修复 | `src/js/app_bridge/webapp_runtime_bridge.js` | ✅   |

## 2026-06-25 v3.8 Web App 架构第一阶段

| #   | 任务           | 状态 | 说明                                                                                                                                     |
| --- | -------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| A   | 现状复盘       | ✅   | `memory/webapp_migration_overview.md`，确认 legacy 入口、全局状态、存档键和不可立即重写模块                                              |
| B   | 架构方案       | ✅   | `memory/webapp_architecture_plan.md`，确定 Vite + TypeScript + 原生 DOM 的桥接式迁移路线                                                 |
| C   | Web App 架构壳 | ✅   | 根目录 `index.html` + `package.json` + `src/app/`，Vite 构建输出到 `dist-webapp/`                                                        |
| D   | legacy 桥接层  | ✅   | `src/js/app_bridge/webapp_runtime_bridge.js` + `actions_extra.js` + `daily_pipeline.js` 注入入口和次日反馈，不替换 `src/index.html`      |
| E   | 真实玩法验证   | ✅   | 城市服务中心：劳动争议预检、医保账单复核、周末城市微旅行，写入 `_webApp.schemaVersion=2`，并产生法律底气/医疗账单意识/城市熟悉度后续状态 |
| F   | 后续开发提醒   | ✅   | `CLAUDE.md` / `src/DEVELOPMENT.md` / migration docs 记录新架构边界和新增内容路径                                                         |
| G   | 验证           | ✅   | `npm run typecheck`、`npm run check:js`、`npm run build`、`python build.py` 通过；Chrome Headless 验证正式游戏和 `dist-webapp` 架构壳    |

## 2026-07-02 v3.8 第二轮 — NPC好感P0根修 + 法律结案通知

| #   | 任务     | 状态 | 说明                                                                    |
| --- | -------- | ---- | ----------------------------------------------------------------------- |
| A   | 现状摸底 | ✅   | `memory/overview.md`（v3.8 第7轮，双轨架构，NPC好感奖励链路全量审查）   |
| B   | 问题诊断 | ✅   | `memory/diagnosis.md`（P0: NPC effect 字段缺失；P1: 奖励flag/法律通知） |
| C   | 改进方案 | ✅   | `memory/improvement_plan.md`（3项P0+P1方案）                            |
| D   | 实装交付 | ✅   | 见以下详细清单                                                          |

### P0 改进（已实装）

| #   | 项目                          | 文件                  | 说明                                                                                             | 验证 |
| --- | ----------------------------- | --------------------- | ------------------------------------------------------------------------------------------------ | ---- |
| 1   | NPC好感奖励effect字段缺失修复 | `src/js/data/npcs.js` | `ensureNpcAffinityEvents` 生成对象补 `effect` 字段；13个NPC/5个限定职业/王大妈免餐等效果全部激活 | ✅   |

### P1 改进（已实装）

| #   | 项目                  | 文件                   | 说明                                                                           | 验证 |
| --- | --------------------- | ---------------------- | ------------------------------------------------------------------------------ | ---- |
| 2   | 废品回收奖励消费点    | `src/js/data/jobs.js`  | `waste_recycling` payCalc：`zhouScrapBonus` flag → +20%                        | ✅   |
| 3   | 街头摊位奖励消费点    | `src/js/data/jobs.js`  | `street_vending_food` payCalc：`bossLiStallBonus` flag → +10%                  | ✅   |
| 4   | 工厂组装奖励消费点    | `src/js/data/jobs.js`  | `factory_work_assembly` payCalc：`zhangFactoryBonus` flag → +15%               | ✅   |
| 5   | 法律结案通知+败诉连锁 | `src/js/core/legal.js` | `tickLegal` 判决后 `addMessage()`；败诉：幸福-10、精神-8、追加律师尾款(费×20%) | ✅   |

### 提交记录

- `a50f805` — fix(npc): P0修复 NPC好感奖励效果从未触发 + P1补全3个奖励消费点
- `fb55fdf` — feat(legal): P1 法律结案通知 + 败诉连锁惩罚

---

## 2026-06-25 v3.8 审查改进与扩展

| #   | 任务     | 状态 | 说明                                                        |
| --- | -------- | ---- | ----------------------------------------------------------- |
| A   | 现状摸底 | ✅   | `memory/overview.md`（v3.8 版，双轨架构覆盖新 TS 数据目录） |
| B   | 问题诊断 | ✅   | `memory/diagnosis.md`（16 项 P0/P1/P2 问题）                |
| C   | 改进方案 | ✅   | `memory/improvement_plan.md`（6 项 P0+P1 方案）             |
| D   | 实装交付 | ✅   | 见以下详细清单                                              |

### P0 改进（已实装）

| #   | 项目                                                              | 文件                                                                  | 行数  | 验证 |
| --- | ----------------------------------------------------------------- | --------------------------------------------------------------------- | ----- | ---- |
| 1   | lifeNodes TS 数据目录填充                                         | `src/app/data/lifeNodes/index.ts`                                     | ~220  | ✅   |
| 2   | cityServices TS 数据扩展                                          | `src/app/data/cityServices.ts`                                        | ~155  | ✅   |
| 3   | healthCheck.ts 拓展                                               | `src/app/debug/healthCheck.ts`                                        | ~100  | ✅   |
| 4   | 桥接层扩展（3→7 服务）                                            | `src/js/app_bridge/webapp_runtime_bridge.js`                          | ~510  | ✅   |
| 5   | bridge 自动推荐                                                   | `src/js/app_bridge/webapp_runtime_bridge.js`                          | ~50   | ✅   |
| 6   | TS typed facade 扩系统字段                                        | `src/app/types/game.ts`                                               | ~200  | ✅   |
| 7   | events/jobs/locations/items/diseases/legal/travel TS 数据目录补全 | `src/app/data/*/index.ts` + `src/app/data/index.ts`                   | ~1200 | ✅   |
| 8   | TS 数据目录审计脚本                                               | `scripts/audit-ts-data.mjs` + `package.json`                          | ~120  | ✅   |
| 9   | Vite 内容目录面板 + bridge 摘要                                   | `src/app/ui/panels.ts` + `src/js/app_bridge/webapp_runtime_bridge.js` | ~90   | ✅   |

### P1 改进（已实装）

| #   | 项目             | 文件                                                            | 行数 | 验证 |
| --- | ---------------- | --------------------------------------------------------------- | ---- | ---- |
| 7   | 住房维护费       | `src/js/phase1/daily_pipeline.js`                               | ~35  | ✅   |
| 8   | 社交圈维护费     | `src/js/phase1/daily_pipeline.js`                               | ~40  | ✅   |
| 9   | 差异化开局债务   | `src/js/core/inheritance_chain.js`                              | ~35  | ✅   |
| 10  | NPC 常规对话深化 | `src/js/phase1/npc_event_bridge.js` + `src/js/ui/social_tab.js` | ~180 | ✅   |

### v3.8 后续阶段

- 阶段 2：抽出 StateManager facade、消息/AP/现金服务和统一 action runner。
- 阶段 3：✅ 首批完成。events/jobs/locations/items/diseases/legal/travel/lifeNodes 均已有实际 TS 数据；`npm run check:ts-data` 可审计最低覆盖。
- 阶段 4：✅ 已迈出第一步。旧入口新增“人生事务”Tab，医疗、法律、旅行、人生节点已有常驻状态面板；更深的数据迁移仍按目录逐步推进。
- 阶段 5：当 `src/app` 能稳定承载核心状态、存档、数据和主要 UI 后，再评估正式入口切换。

## 2026-06-25 v3.0 审查改进与扩展

| #   | 任务     | 状态 | 说明                                                                                                                                                                |
| --- | -------- | ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | 现状摸底 | ✅   | `memory/overview.md`                                                                                                                                                |
| B   | 问题诊断 | ✅   | `memory/diagnosis.md`                                                                                                                                               |
| C   | 改进方案 | ✅   | `memory/improvement_plan.md`                                                                                                                                        |
| D   | 实装交付 | ✅   | 人生节点弹窗/旅行入口/法律入口/医保入口/Phase 2 跳转/审计脚本路径；`audit_events.js` 已恢复真实事件扫描                                                             |
| E   | 验证     | ✅   | 全量 `src/js` 语法通过；`audit_events.js` 检查 225 个事件；`audit_connections.js` 0 问题/45 建议；`python build.py` 成功；Chrome Headless 完整压力试玩通过 Day 1260 |

| #   | 任务                          | 状态 | 说明                                                   |
| --- | ----------------------------- | ---- | ------------------------------------------------------ |
| 0   | P0（副业/经济/开支/链式事件） | ✅   | commit a33af08                                         |
| 1   | P1-1 新闻→投资UI              | ✅   | investment.js：今日市场驱动板块                        |
| 2   | P1-2 NPC好感链路              | ✅   | npcs.js + npc_event_bridge.js：affinityEvents 30/60/80 |
| 3   | P1-4 家庭系统                 | ✅   | family_life.js：NPC求婚 + 生子/子女教育                |
| 4   | P1-6 35岁危机追访             | ✅   | events*core.js：c35*追访权重×3                         |
| 5   | P2-4 道德事件扩充             | ✅   | moral_events.js：基线重建18个极端生存事件              |
| 6   | 社交网络UI集成                | ✅   | social_network.js → social_tab.js                      |
| 7   | 扩展系统                      | ✅   | 旅行/医疗/法律/人生节点 v1 基础实现 + main.js集成      |

## 已提交

- 155da2b — P1-3 scaleEventReward + P1-5 rollEquipmentDrop + social_network.js骨架
- 1bb3a22 — 进度文档
- 本次提交 — P1-1 新闻→投资UI：今日市场驱动板块
- 本次提交 — P1-2 NPC好感链路：affinityEvents + checkNpcAffinityEvents
- 本次提交 — P1-4 家庭系统：NPC求婚 + 生子/子女教育
- 本次提交 — P1-6 35岁危机追访：追访事件权重×3
- 本次提交 — P2-4 道德事件扩充：18个极端生存困境
- 本次提交 — 社交网络UI集成：社交Tab子页 + 每日tick
