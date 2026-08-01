# R1018b · 域A（数据/数值平衡）全系统自洽优化

> 日期：2026-07-31
>
> 选域依据：git log 重算 recency（loop-state 滞后惯例）。`git log --oneline -40` 逐域最近接触：A=R1009（343af508）、C=R1011、D=R1012、E=R1013、F=R1014、G=R1015、B=R1016b、H=R1017b → 域A 距今最陈旧，本轮选 A。
>
> 轮号：1018b（b 后缀避让并行窗口：index.html 注册区/迭代表由多窗口共享，禁独占）。
>
> 开轮体检：`tests/syntax_sweep.cjs` 全量体检 1 处错误 → 本轮修复（r1014 中文双引号嵌套）→ 归零；`_export_audit_r1017b.cjs` 1162 文件 / 10 处良性 `true` 裸引用（无缺陷）。

## 一、A类缺陷修复清单（1 项，52 处引用一次迁移）

| # | 文件 | 缺陷简述 | 修复内容 | 类别 |
| --- | --- | --- | --- | --- |
| A1 | `src/js/data/job_milestone_events.js`（写入点：t1:t24-27 / t3:t89-92 / t13:t387-390 等）← 消费点：`src/js/main.js`（发薪 :265-266 / 新闻 :306-307 / 基线快照 :342-343 / 快照恢复 :4520-4521） | 18 处职业里程碑奖励写入 `state.flags._jobMultipliers`（死路径，全库零读取），而 main.js 4 处读者读的是活路径 `state._jobMultipliers` → 废品回收+10%/+35%、摆摊+10% 等永久收入增幅×1.05~×1.4 此前全部静默失效 | 全库 52 处 `state.flags._jobMultipliers` → `state._jobMultipliers` 批量迁移重连；迁移后死路径 0 引用、活路径 52 引用，承诺（老张废品×1.35 / 跑腿×1.1 等）从此真正生效 | A类（死路径迁移） |

> 附带善后（非本域文件，仅修复未提交）：`domain_e_linkage_r1014.js:8` 字符串内嵌 ASCII 双引号 `"这次不一样"` 包裹中文 → 改为全角「这次不一样」，消除开轮体检语法错误。文件属 E 窗口（untracked），修复保留但不在本域提交。

## 二、联动增强（2 项，全部首次消费写-only 数据）

> 背景：全库 grep 确认两个写入方持续产出却无人消费的数据，本轮让它们首次产生玩法回报。

| # | 事件 id | 联动方向 | 消费数据（写入方） | 效果 |
| --- | --- | --- | --- | --- |
| L1 | `a1018b_econ_health` | A→E | `state.flags._econHealth`（economy_v3.1.js:207 每月经济健康度快照，原零消费者） | 经济健康度报告事件：数据觉醒（会计+8/心智+2/`_dataInvestorMindset` flag，高税负/饱和时给守成警告）vs 稳健存钱（心智+1/心情+3） |
| L2 | `a1018b_waste_recycling_handoff` | A→E/G | `state.flags._wasteRecyclingReady`（daily_pipeline.js:2006 老张废品承包权重报，原零消费者） | 老周带话承包权事件：¥3000 接手 → 写活路径 `state._jobMultipliers.waste_recycling ×1.35` + `oldZhouReferred`/`zhouScrapBonus` flags + 老周好感+8 + 心情+5；钱不够/观望走延期分支 |

- 写入点核对：`_econHealth` 只写不读（economy_v3.1.js:205-214）；`_wasteRecyclingReady` 只写不读（daily_pipeline.js:2000-2007）→ 两个事件均为真实首消费。
- 防御：done-flag 防重 / `||` 守卫 / `isFinite` / 显式 `phase:"street"` / `addSkillXp` 真实键（accounting/management）/ 真实字段（`_econHealth` / `_wasteRecyclingReady` / `state._jobMultipliers` / `resources.cash` / `old_zhou` 关系）。
- 挂载：`src/index.html:2363` 在 `domain_h_linkage_events_r1017b.js` 后注入 `domain_a_linkage_events_r1018b.js`；文件用 IIFE + `RANDOM_EVENTS._domainALinkageR1018bLoaded` 防重复加载。

## 三、开轮体检与交付

| 体检项 | 结果 |
| --- | --- |
| `node --check` r1018b / job_milestone_events.js / r1014 | ✅ 全部通过 |
| `tests/syntax_sweep.cjs` | ✅ 本轮文件零错误（全库 1162 文件现 1 处错误 `domain_f_linkage_r1015.js`，属 F 窗口并行文件，未触碰） |
| `_export_audit_r1017b.cjs` | ✅ 1162 文件 / 10 处良性裸引用 |
| 提交范围 | ✅ 仅本域 2 文件：`job_milestone_events.js`（A1）+ `domain_a_linkage_events_r1018b.js`（L1/L2） |

## 四、Git 状态

- 本地提交（`fix` / `feat` / `chore` 三分段），index.html 因并行窗口共享不提交（注册行 :2363 留待集成）。
- Push 阻断：gh CLI token 失效（Connection reset），沿用 R1016b/R1017b 惯例记录 ahead 数，待 token 恢复后推送。
