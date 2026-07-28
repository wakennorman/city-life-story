# R746b 域G（核心机制/生命周期）优化记录

日期：2026-07-29 06:2x（本窗口自动化）
选域依据：git log 实测本窗口深审 recency G=R311 全局最陈旧（F=R442 次之）；并行两套编号 R721/R745 活跃至 06:23，b后缀避让。

## A类修复（2处）

| 文件 | 缺陷 | 修复 | 类别 |
|---|---|---|---|
| src/js/phase1/daily_pipeline.js | 退休节点记录 `_pensionBase`（life_nodes.js 3处引用全为写入）但全库零读取零发放；且 `_retired=true` 封锁副业(side_hustle:314)/职业(career_dev:3427)收入=选退休纯亏无兑现 | 结算区新增月度养老金兑现：每30天发放 min(基数,5万)×60%（isFinite守卫），advisor 型加发50%顾问费，`_pensionTotal` 累计 | A |
| src/js/core/story_chapters.js + daily_pipeline.js | R720 的 `getLifeStageNarrativeEvent` 定义后从未被调用/未导出/8个 `_lifeNarrative_XX` flag 全库零写入=18/20/25/30/35/40/50/60 八个年龄节点叙事恒不触发（pipeline断链） | 补 `LIFE_STAGE_NARRATIVES_R746B` 8段叙事+`runLifeStageNarrative` 兑现函数（置flag+心智+2）+window导出+story_chapter_check slot 接线 | A |

C类记录不改：`_lifeNode_choice` 此前 life_nodes 自写自读（本轮联动3已将其升级为跨文件消费）。

## 联动增强（3项，domain_g_linkage_r746b.js，全street，done-flag防重+||防御）

| 事件 | 联动 | 素材 | 设计意图 |
|---|---|---|---|
| g746b_pension_planning | G→E | `_pensionTotal`（本轮A类#1新增）首个事件层读取 | 禀赋效应——养老金是"自己挣来的底气"，存款/社交двойной选择 |
| g746b_life_narrative_echo | G→B | `_lifeNarrative_30/35/40/50`（本轮A类#2复活）首个事件层读取 | 峰终定律——年龄刻度深夜回响，动态text按最高已达节点分层 |
| g746b_node_choice_legacy | G→C | `_lifeNode_choice` 首个跨文件读取 | 人生选择的复利——按gaokao/c35/retire前缀分叙事，management真实键XP |

## 验证
- node --check ×3 过；build 13592.1KB（g746b×6/R746b×12/runLifeStageNarrative×4 入包）；工作区无并行在途源→dist 可提交。
- MC 10x500：见提交信息（0代码异常/前7天死亡率0%要求）。

## 竞态备注
- 开轮时工作区干净（仅 last_known_head 漂移后被并行复位）；R746 编号未被 core 占用。
