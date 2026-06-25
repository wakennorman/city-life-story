# 城市浮生记 v3.7 — 接力任务

项目：`D:\Claude Code+DeepSeekV4\city-life-story\`
入口：先读 `CLAUDE.md`（项目全貌）+ `IMPLEMENTATION_PROGRESS.md`（进度清单）

## 工作流

```
1. 读 CLAUDE.md 了解项目
2. 按下方步骤依次执行
3. 每完成一步 → git commit + 更新 IMPLEMENTATION_PROGRESS.md 状态为 ✅
4. 额度/时间不够 → commit 当前进度即可，下个 Agent 从 IMPLEMENTATION_PROGRESS.md 继续
```

## 步骤

### 1. P1-1 新闻→投资UI（investment.js）
- 调用 `getNewsInvestmentSummary()` 渲染"今日市场驱动"板块
- ✅ 完成标志：UI 显示活跃新闻对投资的影响

### 2. P1-2 NPC好感链路（npcs.js + npc_event_bridge.js）
- 每个 NPC 加 `affinityEvents`（30/60/80 好感阈值事件）
- `checkNpcAffinityEvents()` 每日检查
- ✅ 完成标志：好感达标后触发 NPC 特殊对话/任务

### 3. P1-4 家庭系统（family_life.js）
- 结婚（好感≥80+资产≥200K→求婚）、生子（孕180天）、教育开支¥5K-20K/月
- ✅ 完成标志：可以在游戏中结婚生子

### 4. P1-6 35岁危机追访（events_core.js）
- 追访事件权重×3
- ✅ 完成标志：35岁相关事件触发率明显提升

### 5. P2-4 道德事件扩充（moral_events.js）
- **注意**：上次加18个新事件语法损坏已回退基线，需要重新加
- 建议事件：偷药救孩子/争食/举报同事/邻居借钱/ATM拦骗子等，每事件3-4选项
- ✅ 完成标志：直接 `python build.py` 通过

### 6. 社交网络UI集成（social_network.js → UI）
- 骨架已有（朋友圈/微博/网红/舆论），需挂载到 render.js
- ✅ 完成标志：游戏内可发布朋友圈、刷微博

### 7. 扩展系统（main.js重构/旅行/医疗/法律/人生节点）
- 参考 `EXPANSION_DESIGN.md`
- ✅ 完成标志：每个扩展独立可用

## 规约（5条就够了）

1. ✅ 改 src/ 后 `python build.py`
2. ✅ 新 JS → `src/js/` + 在 index.html 注册 script 标签
3. ✅ 每完成1步 `git add -A && git commit -m "step N: xxx"`
4. ✅ 更新 `IMPLEMENTATION_PROGRESS.md`（改状态为✅即可）
5. ❌ 禁止 npm / git push / 删文件

## 如果本次做不完

- 做完几步算几步，commit 后把进度写在 IMPLEMENTATION_PROGRESS.md
- 下个 Agent 直接读那个文件就能继续
