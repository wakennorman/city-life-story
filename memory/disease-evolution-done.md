---
name: disease-evolution-done
description: 疾病演化系统已实现
metadata:
  type: project
---

**疾病演化** — ✅ 已完成

**实现内容：**

1. `src/js/data/diseases.js` — 疾病定义文件（16种疾病，5大分类）
2. `src/js/main.js` — 疾病演化引擎（触发、演化、治疗、每日结算）
3. `src/js/ui/render.js` — 疾病状态UI显示
4. `src/js/core/state.js` — 疾病状态字段

**疾病分类与演化路径：**

| 分类     | 演化路径                           |
| -------- | ---------------------------------- |
| 消化系统 | 胃溃疡 → 胃出血 → 胃癌             |
| 呼吸系统 | 普通感冒 → 支气管炎 → 肺炎         |
| 心理健康 | 焦虑 → 抑郁 → 重度抑郁             |
| 骨骼肌肉 | 颈椎病 → 腰椎间盘突出 → 坐骨神经痛 |
| 肝脏     | 脂肪肝 → 肝硬化 → 肝癌             |

**疾病分级：** 轻微 → 中度 → 重度 → 危重（4级）

**核心功能：**

- `addDisease(state, diseaseId)` — 添加/加重疾病
- `tickDiseaseEvolution(state)` — 每日演化处理
- `applyDiseaseEffects(state, disease, def)` — 应用疾病效果
- `treatDisease(state, diseaseId)` — 治疗疾病
- `getDiseaseSummary(state)` — 获取疾病摘要

**触发机制：**

- 工作风险触发：根据工作类型触发不同疾病
- 天气触发：极端天气导致生病
- 需求恶化：疲劳/卫生/幸福度过低可能诱发

**终末疾病：** 胃癌、重度抑郁、肝癌（终末期可能致命）

**UI显示：** 侧边栏显示当前疾病列表（图标/名称/阶段/严重程度/患病天数）

**下一步：** 继续执行第4项「食材库存联动」
