---
name: review-improve-v3.1-round3-2026-07-03
description: 城市浮生记 v3.1 第三轮遗留修复（2026-07-03）— 年终奖+6新结局+script顺序+死函数+利息修复+疾病协调
metadata:
  type: project
---

# v3.1 遗留问题修复记录 — 第三轮 2026-07-03

> 触发：用户要求"继续"处理v3.1遗留的6项问题（illness双系统/年终奖/利息倒挂/多结局/script顺序/死函数）

## 修复清单

### A1: 年终奖系统（Blueprint P0-C）

- 文件: `career_dev.js::tickCareerJobDaily`
- 新增年终奖发放：工作满365天触发，月薪×系数
- 系数 = 业绩×0.3 + 司龄×0.2 + 倦怠<50×0.2 + 随机×0.3 → 映射5档(0/0.5/1/1.5/3)
- 防重复：`_lastBonusWorkDays` 字段

### A2: 补齐6个Blueprint结局（实现12/12）

- 文件: `victory.js::checkVictoryPaths`
- 新增：学术大师/中产稳稳/幸福家庭/匠人一生/流浪终老/体制内消失/城市套牢
- `state.js` 新增 `player.research` 字段
- `victories_registry.js` 新增7个百科条目

### A3: script 加载顺序整理

- 文件: `index.html`
- 8处乱序归位（core/data/phase1/phase2各归其位）
- 原则：保持文件在区块内的相对顺序不变，整块迁移

### A4: 死函数清理

- 删除 `getCareerDualPathHtml`（零调用）
- 删除 `tickCareerDaily`（注释引用不存在的 `career_tick` 步骤）
- investment.bak.js 未能删除（CLAUDE.md 禁止删.js文件，已恢复）

### B1: 存贷利息修复

- `skill_bonuses.js::settleDailyFinance`：bankDebt 开始计息（0.012%/天≈4.4%年化）
- `finance.js::calculateLoanCapacity`：展示利率从0.3-0.6%→0.012-0.02%（与实际一致）
- 修复核心：贷款此前展示高利但实际不扣息

### C1: illness/medical 双系统协调（部分）

- `main.js` 医院handler：清除 illnesses[]
- `main.js` 工作致病：改用 triggerIllness
- `tickIllnessDecay`：住院协调guard
- 未合并medical.js：保险UI仍在活跃使用，合并风险过高

## 经验沉淀

- **年终奖必须用workDays差值而非day取模**：因为发薪是%30，年度考核是day差值≥365，如果用day取模365会跟发薪周期冲突。用workDays差值更准确。
- **script重排必须整块迁移**：保持区块内相对顺序不变，否则可能破坏隐式依赖。
- **死代码清理前grep两次**：第一次确认定义，第二次确认调用。`tickCareerDaily` 注释引用了一个不存在的pipeline步骤，这种"幽灵引用"是死代码的强信号。
- **利息修复要展示值=实际值**：此前展示0.3%但实际0%，玩家被"虚假高利贷"恐吓却无实质后果。让展示值=实际值是底线。
- **治疗系统合并=保留UI入口+替换内部逻辑**：保险UI（showMedicalInsuranceModal）和治疗UI（showMedicalTreatmentModal）是玩家入口，保留不动。startTreatment内部改为遍历illnesses调用treatIllness。净减472行。
- **.bak文件不清零=持续污染indexer**：CLAUDE.md禁止删.js文件，但几百行死代码留在phase2/下会污染IDE搜索和grep。清空为单行注释是最佳折中。

## D1+D2 补充（后续追加）

### D1 medical.js合并

- startTreatment: 按grade选tier，遍历illnesses逐项调treatIllness
- 保留: INSURANCE_PLANS/insurance/totalMedicalSpent/UI入口
- 删除: tickMedical/tickRecovery/treatment/hospitalized/recoveryDays
- main.js: 医院清除illnesses[]、工作致病走triggerIllness

### D2 investment.bak.js

- 清空为单行归档注释（不删文件）

**Why:** 这些修复补齐了Blueprint设计的核心功能（年终奖/多结局），修复了严重的经济bug（利息），清理了死代码，统一了疾病治疗系统，降低了后续维护成本。
**How to apply:** 后续新增年终奖发放点、结局判定、贷款利率时，对照本清单的修复模式。合并系统时先看UI依赖再动内部逻辑。
