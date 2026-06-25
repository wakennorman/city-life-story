# 城市浮生记 — Codex 接力任务

> 项目位置：`D:\Claude Code+DeepSeekV4\city-life-story\`
> （把上面的路径换成你的实际项目路径）

## 项目简介

纯 HTML5 + Vanilla JS 生存模拟游戏《城市浮生记》（City Life Story），类似《大多数》+《BitLife》风格。单文件部署（`dist/index.html`）。当前版本 v3.7。

## 当前进度

**已 git commit（155da2b）**：P0全部完成（4项）+ P1部分完成（2项）
**待完成**：P1剩余4项 + P2修复2项 + 扩展系统5项

详情见 `IMPLEMENTATION_PROGRESS.md` 和 `CLAUDE.md`。

## 接力任务（按优先级顺序执行）

### 第1步：P1-1 新闻→投资UI（~40行）
- 文件：`src/js/phase2/investment.js`
- 在 UI 渲染中调用 `getNewsInvestmentSummary`（来自 `core/news_investment_bridge.js`）
- 添加"今日市场驱动"板块显示当前活跃新闻对投资市场的影响

### 第2步：P1-2 NPC好感链路（~120行）
- 文件：`src/js/data/npcs.js` + `src/js/phase1/npc_event_bridge.js`
- 为每个NPC增加 `affinityEvents`（好感30/60/80阈值触发特殊事件）
- 在 npc_event_bridge.js 增加 `checkNpcAffinityEvents` 函数

### 第3步：P1-4 家庭系统（~200行）
- 创建/修改 `src/js/phase2/family_life.js`
- 结婚系统：NPC好感≥80 + 资产≥¥200K → 求婚选项
- 生子/子女教育：怀孕180天→生子→每月教育开支¥5K-20K

### 第4步：P1-6 35岁危机追访（~30行）
- 文件：`src/js/core/events_core.js`
- 将追访相关事件权重×3，提高触发概率

### 第5步：P2-4 道德事件扩充（~500行）
- 文件：`src/js/data/moral_events.js`
- ⚠️ 注意：之前尝试加18个新事件但语法结构损坏，已回退到基线版本
- **必须重新添加**极端生存困境类事件（偷药救孩子/争食/举报同事/邻居借钱/ATM拦骗子等）
- 建议每条事件：id/title/desc/minDay/condition/dailyChance/choices（3-4选项，含flag/score/immediate）

**每完成一个功能点，立即 `git add -A && git commit -m "..."`**

### 第6步：社交网络UI集成（~150行）
- `social_network.js` 骨架已创建（朋友圈/微博热搜/网红经济/舆论危机）
- 需要将对应函数挂载到 UI（render.js），添加社交Tab入口

### 第7步以后：main.js重构 + 扩展系统
- main.js已有解耦方案未实装
- 扩展系统：旅行/医疗/法律/人生节点（参考 `EXPANSION_DESIGN.md`）

## ⚙️ 关键规约

1. ✅ **每次改 `src/` 后必须 `python build.py`** 重新打包 `dist/`
2. ✅ 所有JS通过 `src/index.html` 的 `<script>` 按序加载，禁止改顺序
3. ✅ 新增JS文件→放 src/js/ →在 index.html 注册
4. ✅ 修改功能后同步更新百科（注册表驱动，不直接改 wiki.js）
5. ✅ **每完成1个功能点→git add+commit**
6. ✅ 更新 `CLAUDE.md` 和 `src/DEVELOPMENT.md`
7. ❌ 禁止删 .js/.html/.css，禁止改 build.py，禁止 `git push`
8. ❌ 纯HTML5+CSS+Vanilla JS，零框架，无npm

## 📄 参考文件

| 文件 | 说明 |
|------|------|
| CLAUDE.md | 完整项目状态+开发规约 |
| IMPLEMENTATION_PROGRESS.md | 进度交接清单 |
| src/DEVELOPMENT.md | 详细变更历史 |
| EXPANSION_DESIGN.md | 扩展系统设计方案 |
| IMPROVEMENT_PLAN.md | 改进方案 |
| src/js/data/moral_events.js | 道德事件（基线，待扩充） |
| src/js/core/social_network.js | 社交网络骨架（待UI集成） |

## 启动

1. 在 Codex Desktop 中设置工作目录到 `D:\Claude Code+DeepSeekV4\city-life-story\`
2. 先读 `CLAUDE.md` 了解完整项目结构
3. 从第1步开始执行
4. 每完成1步就 commit，方便回退
