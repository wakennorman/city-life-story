# 城市浮生记 — 自主开发护栏规则

## 项目信息

- 入口: `src/index.html`
- 开发文档: `src/DEVELOPMENT.md`（每次改动必须同步更新）
- 技术栈: 纯 HTML5 + CSS + Vanilla JS，零框架，无 npm 构建步骤
- 所有 JS 文件通过 `<script src="...">` 在 index.html 中按序加载，**禁止改变 script 标签顺序**

## 当前状态

> 每次收工前覆盖更新本节（只留最新状态，不要追加历史）；详细变更历史在 `src/DEVELOPMENT.md`，不需要每次都读。

- **最近一次工作**：百科系统注册表化重构 — `MECHANICS / NARRATIVES / VICTORIES` 三大注册表 + 通用渲染器 `_renderWikiEntry` + 启动自检 `runMechanicsAudit`
  - 已迁移 23 条目（7 机制 + 8 叙事 + 8 胜利），调阈值 / 加新条目无需再碰 `wiki.js`
  - `VICTORIES.achievements` 直接读 `ACHIEVEMENTS.length` + 类别分布 → 加新成就百科自动 +1
  - audit 自动列出"未迁移条目"（当前 5 条 ℹ️：city_pulse / history / fame_vip / insider_trading / inventory），作为下一批迁移 TODO
- **待提交改动**：待 git add + commit（含 3 个新注册表文件 + wiki.js / main.js / index.html / phase1/critical.js / phase1/illness.js / CLAUDE.md / DEVELOPMENT.md）
- **P0/P1全优先级清单已完成**（累计280+项），事件总数202，新闻事件79，成就52
- **下一步方向（新）**：
  1. **继续迁移百科** — 按 audit ℹ️ 把剩余 ~15 条 mechanic（`_wikiDetailMechanic.pages` legacy 字典）搬进注册表
  2. **平衡调参** — amenity 价格 / illness 触发阈值 / 延期惩罚概率需实测后微调
  3. **自住房食材库存联动** — 深化"在家做饭"为实际食材消耗系统
  4. **疾病演化深化** — 胃溃疡→胃癌、抑郁→重度抑郁等多级演化分支
  5. **企业命运系统 Phase 2** — CEO人格化/公司历史书/多周目企业记忆深化

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

### 下一步方向

1. **平衡调参** — amenity 价格 / illness 触发阈值 / 延期惩罚概率需实测后微调
2. **自住房食材库存联动** — 当前简化版直接解锁"在家做饭"，可深化为消耗实际食材
3. **疾病演化深化** — 胃溃疡→胃癌、抑郁→重度抑郁等多级演化分支
4. **企业命运系统 Phase 2** — CEO人格化/公司历史书深化/多周目企业记忆

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
- 每完成 3 个功能点，执行一次 `git add -A && git commit -m "..."` 存档
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

## 改进参考（调研结论）

### 《大多数》经验迁移

- 打工→存钱→投资→阶级跃升 的清晰路径感（本游戏已有，需强化反馈）
- 每日"今日总结"：一句话总结这一天的高光/低谷时刻

### 《This War of Mine》经验迁移

- 道德困境：遇到乞丐给不给钱？看到邻居违规举不举报？选择影响后续事件链
- 角色有"故事"：NPC 死亡/离开有具体叙述，不只是数字变化

### 《Stardew Valley》经验迁移

- 每个 NPC 有生日，送生日礼物好感×2
- 季节性内容让玩家有"下一季我要..."的期待感

### 《Papers Please》经验迁移

- 隐藏的道德代价：某些"正确"选择长期来看有副作用
- 成就用来记录玩家走过的路，不是奖励而是叙事

### 《中国式家长》经验迁移

- 属性成长的可视化反馈让人有满足感
- "面子"系统：名气影响NPC态度和可用选项
