---
name: review-improve-v3.1-2026-07-06
description: v3.1 审查改进（第二轮）发现 — jobs/locations 悬空引用、jobs.js ~514 行死代码、state housing 注释错误、职场路径引导
metadata:
  type: reference
---

# v3.1 审查改进记录 — 2026-07-06

> commit: `5aa85f7`（city-life-story 子仓库）

---

## 本轮覆盖维度

- ✅ 维度 1（代码/架构 — 悬空引用 + 注释修正）
- ✅ 维度 4（UI/UX — 职场路径引导提示）
- ✅ 维度 5（留存/动机 — 玩家智力接近 45 时给 techPark 方向）
- ⏭️ 维度 2/3 略过（本轮无数值/叙事改动）
- ✅ 维度 6（Blueprint 对齐 — 清理死代码属于 P0 基础质量）
- ✅ 全剧本适配自查（清理无分支条件，所有剧本受益）

---

## 发现的问题

| 文件             | 问题                                                    | 严重度              |
| ---------------- | ------------------------------------------------------- | ------------------- |
| `jobs.js`        | 底部 514 行全是注释掉的占位符工作，引用的 skills 不存在 | 🔴P0 代码误导       |
| `locations.js`   | suburb/entertainment 的 jobs 数组包含未定义 ID          | 🔴P1 静默失败       |
| `state.js`       | housing.tier 注释"0-3"但实际是"0-6"                     | 🟡P2 注释过期       |
| `daily_quest.js` | 智力接近 45 时缺乏 techPark 引导                        | 🟡P2 玩家路径不透明 |

---

## 改进

| 维度         | 文件           | 改动                                   |
| ------------ | -------------- | -------------------------------------- |
| 死代码清理   | jobs.js        | 移除 ~514 行注释占位符 → 1348→834 行   |
| 悬空引用消除 | locations.js   | suburb.jobs=[] / entertainment.jobs=[] |
| 注释修正     | state.js       | housing.tier 注释更新为"0-6"           |
| 玩家引导     | daily_quest.js | _dynamicNextDesc 扩展智力路线提示      |

---

## 全剧本适配自查

| 剧本              | 本次改动会触发吗？                               | 降级/替代？ |
| ----------------- | ------------------------------------------------ | ----------- |
| classic           | ✅（提示显示）                                   | —           |
| laid_off          | ✅                                               | —           |
| small_town_grader | ✅（智力路线提示最直接利好此剧本，因起始智力高） | —           |
| foreign_worker    | ✅                                               | —           |
| second_gen        | ✅                                               | —           |
| midlife_crisis    | ✅                                               | —           |
| fresh_grad        | ✅（智力路线提示）                               | —           |

**结论**：全部 7 个剧本受益，无断链。

---

## 验证

- 127 个 JS 文件 node --check 通过
- python build.py → 4814.3KB（从历史 4843KB 减少 ~30KB）
- MC 30 trials × 365 days 通过（平衡性无回归）
- MC 1000 天 OOM（旧版问题，非本次引入）

---

## 遗留（下轮处理）

1. MC 内存问题修复
2. 被移除的自由职业设计（摄影/翻译/咨询等）留在 memory 留档或 v2.1 内容扩充时复用
3. suburb / entertainment 地点恢复工作需要配套新开工作

---

## 设计范式沉淀（本次新发现）

### 悬空数据引用扫描范式

在 jobs/locations/npcs 等数据文件中：

1. 用 `grep -E 'id: "X"' data/jobs.js` 验证每份 locations.jobs 数组里的 ID 是否都在 STREET_JOBS 里注册
2. 加入 pre-commit hook：`node scripts/audit_data_refs.cjs` 交叉验证 `locations.*.jobs` ⊆ STREET_JOBS ID 集合

### 职场路径渐进引导范式

玩家智力 35-48 阶段是最关键的"决策窗口"：

- 智力 < 30：不提职场（太远）
- 智力 30-35：weak hint（"智力高了可以考虑职场"）
- 智力 35-44：具体距离提示（"再提升 N 点就去科技园"）
- 智力 ≥ 45：行动召唤（"去科技园应聘！"）

参考：BitLife 职业解锁过程 / Stardew Valley 社区中心渐进提示 / Papers Please 每天新增规则的信息过载管控

---

## 关联

- [[review-improve-v3.1]] — v3.1 审查改进 SOP（第一轮 2026-07-03 制定）
- [[v2.1-内容扩充执行]] — 内容扩充 SOP（被移除的职业可作为未来扩充输入）
- [[city-life-story-project-status]] — 项目状态记忆
