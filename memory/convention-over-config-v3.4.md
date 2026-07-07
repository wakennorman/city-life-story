---
name: convention-over-config-v3.4
description: 2026-07-07 约定式自动归类P0/P1/P2全部落地 — commit 88d33d2 → v3.5 POC — commit 389129e
metadata:
  type: reference
  commit: 389129e
---

# 约定式自动归类 v3.4 + v3.5 落地记录

## v3.4（commit 88d33d2）

### P0 — 行动自动归类（main.js 43行动）
- getAvailableActions 全部行动添加 `category` 字段
- ActionSort.getActionCategory() 自动读取，不再需要 EXACT_MAP/PREFIX_RULES 手动映射
- 新增行动从改2个文件→1条数据声明

### P1 — 技能↔工作双向关联（wiki.js）
- 技能百科已有"该技能解锁的工作"（已有）
- 工作百科新增"🔗 需要同样技能的其他工作"推荐区
- 自动扫描 STREET_JOBS 中要求相同技能的工作

### P2 — 证书工资加成确认
- 全部16个证书已声明 salaryBonus 字段
- _calcCertSalaryBonus 自动扫描应用
- 旧 if-else 保留为向后兼容（含 medical_license/professional_title_cert）

## v3.5 POC（commit 389129e）

### 事件触发条件数据化

**基础设施**：`trigger_registry.js`（130行）
- 12 个 TRIGGER_SLOTS（daily_start/after_work/after_travel/monthly/weekly 等）
- 9 个 TRIGGER_TEMPLATES（has_debt/cash_above_100/day_above_7 等）
- `registerTriggeredEvent()` / `triggerRandom(slot, state)` / `checkTrigger()` / 冷却管理

**POC 示范**：`stray_dog_rain` 事件添加 `triggers: ["daily_start"]` + `minDay: 4` + `triggerWeight: 1` + `triggerCooldown: 14`

**Pipeline 集成**：`daily_pipeline.js` 新增 `trigger_slot_daily_start` 步骤

**渐进式增强**：有 `triggers` 数组 → 约定式自动注册；有 `conditions()` → 向后兼容保持原有逻辑

### 迁移路径（后续全量 400+ 事件）
1. 为每个事件的 `conditions()` 找到对应 `triggers` slot
2. 将 `dailyChance` 改为 `triggerWeight`
3. 将 `minDay` 从条件函数中提出
4. 迁移完成后逐步删除 `conditions()` 函数

## 关联
[[review-improve-v3.1]], [[convention-over-configuration-methodology]], [[v3.3-startup-threshold-mc-fix]]