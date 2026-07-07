---
name: nav-button-binding-fix-v3.32
description: 导航死按钮修复 + 交通AP按距离×方式动态计算
metadata:
  type: feedback
---

# 导航按钮绑定修复 + 交通AP重设计（v3.32）

## 修复：导航按钮无响应

### 根因

所有子Tab（`renderMeTab`/`renderCareerTab`/`renderCityTab`）的 `onclick` 直接调用父渲染函数（如 `renderMeTab(state, parent)`），**不经过 `renderAll()`**，导致 `bindAllNavButtons()` 从未执行。新创建的 `.nav-action-btn` 元素有正确的 HTML 属性但没有 click 事件监听器。

### 修复

1. 三个主Tab的子Tab `onclick` 末尾追加 `bindAllNavButtons()` 调用
2. 每个Tab渲染函数末尾追加 `bindAllNavButtons()` 调用（防御性兜底）
3. `_doNavigate` 的 LOCATION 分支增加 `target.subTab` 支持：到达后设置子Tab状态
4. `navActionButton` 增加 `opts.subTab` 传递到 target
5. `renderSkillsTab` 的 `navTab: "skills"` → `{ navTab: "me", subTab: "me_skills" }`（修复不存在的Tab名）
6. 百科 `skills`/`certs` 条目导航增加 `subTab: "me_skills"`
7. `showLocationNavModal` 增加 `subTab` 参数，教育导航增加 `subTab: "me_growth"`
8. wiki.js `_wikiAutoAppendNav` 传递 `subTab` 到 `navActionButton`

### 影响文件

- `render_infra.js`：City/Me/Career Tab 子Tab onclick + 防御性 bindAllNavButtons
- `navigation.js`：_doNavigate subTab 支持 + navActionButton subTab 传递
- `render.js`：renderSkillsTab navTab 修复
- `wiki.js`：百科技能/证书 subTab 传递
- `career_dev.js`：showLocationNavModal subTab 参数 + 教育导航 subTab

## 设计：交通AP按距离×方式动态计算

### 旧系统

所有交通方式AP消耗固定值，与距离无关：步行15AP、单车6AP、地铁5AP、打车3AP、自驾2AP。

### 新系统（v3.32）

| 方式     | AP公式                              | 示例                   | 现金   | 说明                     |
| -------- | ----------------------------------- | ---------------------- | ------ | ------------------------ |
| 步行     | `getTravelApCost()` = 12+(hops-1)×4 | 1跳=12, 2跳=16, 4跳=24 | ¥0     | 距离越远越贵，鼓励用交通 |
| 共享单车 | 3+hops×2, 封顶7                     | 1跳=5, 2跳=7           | ¥3     | 短途高效，2跳内          |
| 地铁     | 固定5                               | 固定5                  | ¥4     | 站间高效，覆盖8站        |
| 打车     | 3+hops×1, 封顶8                     | 1跳=4, 4跳=7           | ¥10-40 | AP最省但现金最贵         |
| 自驾     | 2+hops×1                            | 1跳=3, 2跳=4           | ¥5     | 需有车，最省AP           |

### 设计原则

- **距离×方式**：相同距离不同方式有明确的AP差异
- **方式相同距离不同**：远距离步行24AP vs 近距离12AP
- **距离相同方式不同**：4跳距离→步行24AP vs 打车7AP vs 地铁5AP
- **经济模型**：AP省=现金贵（打车AP最省但现金最贵）
- **车辆价值**：自驾是唯一AP<5的方式，让购车有实质意义

### 影响文件

- `render.js`：transit-go-btn AP动态计算 + quick-travel-btn 改用 getTravelApCost + 快速出行卡片显示AP

**Why:** 行动力是游戏最核心数值，交通方式消耗无差异化导致玩家没有选择动机。新系统让每种交通方式有明确的AP/现金权衡，距离越远差异越大，引导玩家合理规划出行。

**How to apply:** 后续新增交通方式（如电动车、网约车）按此模型：AP公式 = 基础值 + hops×递增值，封顶设上限。确保每种方式在AP/现金坐标系中有不重叠的定位。
