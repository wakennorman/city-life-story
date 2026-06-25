# 城市浮生记 v3.7 进度交接文档

> 最后更新：2026-06-25 02:12 | 交接给：Codex Desktop
> 提交：155da2b | 构建：4040.1 KB

---

## ✅ 已完成（P0全部 + P1部分）

| 优先级 | 项目 | 文件 | 状态 |
|--------|------|------|------|
| P0-1 | 副业系统接入每日管线 | daily_pipeline.js, state.js | ✅ 已提交 |
| P0-2 | 经济平衡（成长降速/P10月薪） | startup.js, corp.js | ✅ 已提交 |
| P0-3 | 后期开支（财富分层开支） | needs.js, daily_pipeline.js | ✅ 已提交 |
| P0-4 | 链式事件填充 | events_core.js | ✅ 已提交 |
| P1-3 | 事件奖励动态缩放 | events_core.js | ✅ 已提交 |
| P1-5 | 装备掉落系统 | items.js | ✅ 已提交 |
| 扩展 | 社交网络骨架 | social_network.js | ✅ 已提交 |
| 扩充 | 文化遗产链扩充 | inheritance_chain.js | ✅ 已提交 |

## ❌ 待完成（Codex接力）

### 第一阶段：P1改进（建议优先，~470行）

| # | 项目 | 具体内容 | 涉及文件 |
|---|------|---------|---------|
| 1 | 新闻→投资UI | 调用 `getNewsInvestmentSummary`，添加"今日市场驱动"板块 | phase2/investment.js |
| 2 | NPC好感链路 | 每个NPC增加 `affinityEvents`（30/60/80阈值），`checkNpcAffinityEvents` | data/npcs.js, phase1/npc_event_bridge.js |
| 3 | 家庭系统 | 结婚系统（好感≥80+资产≥¥200K→求婚）+ 生子/子女教育 | phase2/family_life.js |
| 4 | 35岁危机追访 | 追访事件优先级权重×3 | core/events_core.js |

### 第二阶段：P2修复（~100行）

| # | 项目 | 具体内容 | 涉及文件 | 注意 |
|---|------|---------|---------|------|
| 5 | 道德事件扩充 | 重建18个新事件（极端生存困境类） | data/moral_events.js | ⚠️ 上次扩充语法损坏已回退基线 |
| 6 | main.js重构 | 已有解耦方案但未实装 | main.js | |

### 第三阶段：扩展系统（5项，需设计后实施）

| # | 项目 | 前置条件 |
|---|------|---------|
| 7 | 社交网络UI | social_network.js 骨架已完成，需集成到UI |
| 8 | 旅行系统 | 需设计 |
| 9 | 医疗系统 | 需设计 |
| 10 | 法律系统 | 需设计 |
| 11 | 人生节点系统 | 需设计 |

---

## ⚙️ 开发规约（必须遵守）

1. **每次改 `src/` 后必须 `python build.py`** 重新打包 `dist/`
2. **所有JS文件通过 `src/index.html` 的 `<script>` 标签按序加载**，禁止改变script顺序
3. **新增JS文件 → 放 `src/js/` 下 → 在 index.html 注册**
4. **修改任何功能后同步更新游戏百科**（注册表驱动，不直接改 wiki.js）
5. **每完成1个功能点 → `git add -A && git commit -m "..."`**
6. **更新 `CLAUDE.md` 和 `src/DEVELOPMENT.md`** 变更记录
7. 禁止删 `.js/.html/.css`，禁止改 `build.py`，禁止 `git push`
8. 纯 HTML5 + CSS + Vanilla JS，零框架，无 npm

## 🔧 技术栈

- 入口：`src/index.html`（开发）/ `dist/index.html`（部署）
- 构建：`python build.py`
- 核心架构：世界参数反馈环（world_params.js）
- 道德系统：`src/js/data/moral_events.js`（已回退基线）

## 📂 关键文件索引

| 文件 | 说明 |
|------|------|
| CLAUDE.md | 完整项目状态 + 开发规约 |
| src/DEVELOPMENT.md | 详细变更历史 |
| src/js/data/moral_events.js | 道德事件（基线，待扩充） |
| src/js/core/social_network.js | 社交网络骨架（待UI集成） |
| src/js/core/events_core.js | 含 scaleEventReward + queueChainEvent |
| src/js/data/items.js | 含 rollEquipmentDrop 装备掉落系统 |
