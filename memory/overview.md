# 城市浮生记 — 现状摸底（第八轮，2026-07-02）

> 本轮聚焦：**事业发展 Tab 完善审查**。基于 HEAD `00946e8`（2026-07-01 城市服务消费点接入 + 装备品质3档化）实际代码扫描。

## 断点续传定位

- 第七轮（2026-07-01）已完成：装备品质3档化（普通/优质/高档·仅价格）+ 城市服务 4 个 followUp 消费点全通（公积金→buyProperty 5%抵扣 / 体检→rollDailyIllness ×0.5大病概率）
- 当前验证基线：check:js(114 files) / typecheck / python build.py(4327KB) / npm run build — 全部通过
- 本轮主题：用户要求"事业发展 tap 完善"，参考市面优秀游戏 + 现实中国职场综合考量

## 一、双轨架构各自覆盖

| 层                  | 路径                                         | 覆盖系统                           | 当前状态                                               |
| ------------------- | -------------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| **legacy 正式入口** | `src/index.html` + `src/js/**`               | 全部玩家可见玩法（114 个 JS 文件） | 唯一可玩入口，`python build.py` → `dist/index.html`    |
| **TS WebApp 壳**    | `index.html` + `src/app/**` + Vite           | 类型化数据目录 + facade + 调试面板 | 迁移通道，`npm run build` → `dist-webapp/`，非玩家入口 |
| **bridge 桥接层**   | `src/js/app_bridge/webapp_runtime_bridge.js` | 城市服务 7 项 + TS 目录摘要        | v0.3.0，只追加不重排 script                            |

## 二、事业发展 Tab 现状（核心审查对象）

**入口链**：`src/index.html:471-478` Tab 按钮（初始 `display:none`，`renderTabBar` 切换）→ `render.js:1157` `TAB_RENDERERS.career_dev` → `career_dev.js:565 renderCareerDevTab`。

**显示条件**（render.js:1107-1116）：街头阶段恒显；公司阶段仅当已创业时显示。街头阶段即可见，用于"上班族引导 + 创业准备度"。

**三个子 Tab**（career_dev.js:569-573）：

1. 🚀 创业 — 委托 `renderStartupTab`（startup.js:11404）+ 顶部"今日事业建议"
2. 💼 上班族 — 6 路径×4 级 = 24 职位（IT/金融/销售/运营/设计/法律），晋升/辞职/职业历程
3. 📊 总览 — 双路径卡片 + 学历展示 + 创业/职业摘要 + 静态建议

**职业资本系统**（career_dev.js:314-356）：5 字段 `industryResources/clientLeads/reputation/partnerTrust/burnout`，懒初始化 + clamp 0~~100。消费方仅 2 处：career_dev 内部（入职/晋升/每日/展示）+ startup.js 注册费折扣（0~~15%）。**未接入跳槽/晋升门槛/副业**。

**每日管线**（daily_pipeline.js:488 `career_job_daily`）：`tickCareerJobDaily` 已接通 — 每月1日发薪、workDays++、每20天项目+5业绩+资本累积、burnout 每日+0.04。

**晋升条件**（career_dev.js:859-923）：年龄+学历+技能+属性(体质/智力/敏捷/心智/魅力)+工作天数+业绩+社交人脉，逻辑完整。

## 三、当前完成度

- **已落地**：6 路径 24 职位、职业资本、晋升多门槛、创业折扣联动、每日发薪/项目、百科注册（MECHANICS.career_dev）、街头可见引导
- **上轮成果**（2026-07-01）：城市服务 4 个 followUp 消费点全通；装备品质 3 档化
- **历史成果**：人生缎带/主线章节/跨系统事件/节日深度/NPC关系网/时代变迁/副业/医疗/法律/旅行/人生节点/传承币/难度分层

## 四、薄弱/异常/断连（重点）

### P0 级断连（核心功能断裂）

1. **职场社交每日 tick 函数名不匹配** — `daily_pipeline.js:460` 调 `tickWorkplaceSocialDaily`，但 `workplace_social.js` 实际函数名是 `tickColleagueRelationships`（:436）→ 关系衰减/导师/徒弟每日演化**全部死掉**。而晋升高阶职位需要"职场人脉≥X人"（career_dev.js:914），人脉数据靠 fallback 兜底但永不再生/衰减。
2. **职场社交所有主动行动是死代码** — `treatColleagueMeal/chatWithColleague/establishMentorship/takeMentee/triggerOfficePoliticsEvent` 全定义齐全但**零调用者**。玩家无法主动维护同事关系，却要用人脉晋升 → 高阶晋升路径被堵。
3. **`state.workplaceSocial.colleagues` vs `state.corporate.colleagues` 路径不一致** — career_dev.js:944 优先读前者，写入方（initColleagueNetwork）写后者 → 主路径永远空。
4. **退休节点不清空 currentJob / 不停发薪** — life_nodes.js 退休选项只设 `_retirementType` flag，`tickCareerJobDaily` 照常发全额月薪，退休 = 继续上班。

### P0 内容/体验断点

5. **业绩 performance 无主动提升途径** — 玩家只能挂机每20天+5；建议文案"优先做项目、补技能"是空头支票。
6. **职业倦怠 burnout 只增不减** — 每日+0.04、每20天+2，**无任何减少机制**（无休假/调休/健身减压），长玩必爆表，且爆表后无后果（数字飘在那里）。
7. **学历提升只支持 0→1（初中→本科）** — `getCareerEducationHtml` 列了 6 级（到博士），但 main.js 行动入口 edu≥1 后直接禁用，研究生/博士**无入口**，展示与实装不符。
8. **创业注册费口径三处不一致** — career_dev 注册块写 ¥200k、startup.js 实际是动态 `Math.max(20000, baseCash×(1-discount))`、wiki.js 硬编码页写 ¥50k。且 `startup.js:2273 || 200000` 兜底永不命中。

### P1 体验缺口

9. **事业发展 Tab 在手机端被挤到首屏外** — 11 个可见 Tab，事业发展排第 7，375px 视口需左滑才见，可达性差。
10. **无主动跳槽机制** — 只能晋升或辞职；现实中国职场跳槽是核心加薪手段（cross_system 有猎头挖角随机事件但非玩家主动）。
11. **职业历程颗粒度粗** — 只记入职/晋升/辞职/跳槽 4 类；项目完成/年度考核/加薪无记录。
12. **无年度调薪/薪资谈判** — 月薪固定，只晋升时变。
13. **副业与主业不冲突** — side_hustle 不检查 career.currentJob，无"上班日不能跑副业"逻辑，疲劳独立计数，副业收入不受职业资本影响。
14. **无职称/证书加成** — 证书系统只给技能 XP，不给职业薪资/晋升加成。
15. **career_dev 行内网格移动端无 `!important` 兜底** — 5 列资本条在 375px 偏挤。
16. **总览页太单薄** — 只有摘要 + 静态建议，无职业资本趋势/晋升进度条。
17. **职业路径只 6 条** — 缺医疗/教育/公务员/科研/制造/物流/餐饮/传媒等现实常见职业。

## 五、初步感觉

事业发展 Tab **架子搭得好但血肉不足**：6 路径 24 职位 + 职业资本 + 多门槛晋升的设计很完整，但**上下游接线断裂**让玩家体验断裂——要人脉晋升却无法维护人脉（社交死代码）、要业绩晋升却无法主动做项目、要减压却无休假、要退休却停不下工资。优先修断连（P0），再补内容深度（P1），最后打磨（P2）。

参考方向：BitLife（职业路径深度+跳槽+退休）、大多数（中国职场写实+35岁危机）、中国式家长（考试升学链）、Stardew Valley（关系维护主动行动）、现实中国职场（考证/绩效/调薪/跳槽/副业冲突）。
