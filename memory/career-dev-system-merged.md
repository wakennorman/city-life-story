---
name: career-dev-system-merged
description: 事业发展Tab设计（合并创业+上班族路径）+ 社交Tab（合并职场社交+家庭）+ 个人成长Tab（合并数据+成长）
metadata:
  type: project
---

## 事业发展系统设计总结 (v3.1)

### Tab重组方案

- **事业发展Tab** (`career_dev.js`): 合并了原"创业" + 新增"固定工作/职业路径"
  - 创业子面板：委托到原 `renderStartupTab`
  - 职业路径子面板：4条路径（技术/金融/销售/运营），每路径4级（助理→专员→高级→经理级）
  - 事业概览子面板：同时展示创业和工作的状态

- **社交Tab** (`social_tab.js`): 合并原"职场社交" + "家庭"
  - 子标签：家庭生活 / 职场社交 / 关系总览

- **个人成长Tab** (render.js `renderMergedPersonalGrowthTab`):
  - 子标签：数据（图表）/ 爱好 / 健康 / 目标
  - 合并了原数据可视化图表 + 原个人成长内容

### 创业难度调整

- 注册资金：¥50,000 → ¥200,000
- 月运营成本：增加水电/法律/杂项/社保公积金（约¥105/天基础 + 员工40%附加）
- 烧钱率：各行业提升50-75%
- 初始估值：降低30%

### 固定工作系统

- 晋升机制：技能检查 + 工作天数 + 社交关系
- 每月1日发薪自动结算
- 高级别职位需要≥3名信任同事才能晋升

**Key files**: `career_dev.js`, `social_tab.js`, `render.js` (renderMergedPersonalGrowthTab), `startup.js` (费用/门槛), `daily_pipeline.js` (career_job_daily), `index.html` (注册)
