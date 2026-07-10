# 城市浮生记 v3.0 审查改进与扩展 - 本轮执行上下文

## 任务目标

在保留现有核心玩法框架的前提下，完成一次可落地的 v3.0 审查、诊断、设计与实装。优先处理用户明确反馈：

1. 开局不再强制选择人生目标；改为可跳过，但选择目标应提供清晰诱惑和加成。
2. 剧本模式、沙盒模式需要按经典模式对照审查并修复不合理逻辑。
3. 检查并优化 UI 布局，尤其各 Tab 和小类是否冗余、是否能合并。
4. 修复职业方向选择里重复图标现象，例如“💻 💻 IT技术”，并检查其他 Tab/子 Tab/小 Tab。
5. 继续完善事业发展系统，重点覆盖创业与上班族，增加玩法深度、现实逻辑和跨系统联动。

## 必读项目规则

- 先读 `city-life-story/CLAUDE.md`。
- 触发 v3.0 标准时必须读 `city-life-story/memory/review-improve-v3.0.md`。
- 正式游戏入口仍是 `city-life-story/src/index.html`，不要用 Vite 壳替代旧入口。
- 修改 `src/` 后必须最终执行 `python build.py`。
- 完成代码改动后更新 `city-life-story/src/DEVELOPMENT.md` 顶部。
- 本轮还要更新 `city-life-story/memory/long_term_lessons.md`，只记录真实踩坑、规则、常用命令和后续有用信息，不捏造。
- 不要回滚用户既有未提交改动；当前已有若干桌面快捷方式/启动脚本类未跟踪文件和 `.gitignore` 改动，非本轮目标不要碰。
- 如需搜索，`rg` 在当前环境可能无法执行，可用 PowerShell `Select-String` / `Get-ChildItem` 替代。

## 参考游戏和设计启发

本轮横向对比可参考以下市面作品的公开页面信息：

- BitLife: 选择驱动的人生模拟，教育、职业、关系、健康、幸福和结局受玩家选择影响；强调多人生、随机事件和后果。
  - https://apps.apple.com/us/app/bitlife-life-simulator/id1374403536
  - https://play.google.com/store/apps/details?id=com.candywriter.bitlife
- Big Ambitions: 角色扮演式商业/城市生活模拟，从小公寓、第一份工作逐步到创业、开店、雇人、库存、物流、地产和生活需求。
  - https://store.steampowered.com/app/1331550/Big_Ambitions/
- Software Inc.: 公司经营、员工技能/满意度、产品研发、市场竞争、团队协作和随机市场历史。
  - https://store.steampowered.com/app/362620/Software_Inc/
- Chinese Parents: 中国语境人生阶段、学习/属性成长、社交、家庭期待、高考、代际继承和大量职业结局。
  - https://store.steampowered.com/app/736190/Chinese_Parents/

设计取舍：不要照搬题材或内容；只吸收“可选目标带加成”“人生阶段目标感”“事业路径反馈”“公司经营链路”“本土现实压力”和“跨周目/长期留存”的设计思路。

## 子任务交接规则

每个子任务都作为独立上下文执行。后续子任务必须读取前一子任务产出文件作为 `context`：

- 子任务1输出：`city-life-story/subagent_result1.md`
- 子任务2输出：`city-life-story/subagent_result2.md`
- 子任务3输出：`city-life-story/subagent_result3.md`
- 子任务4输出：`city-life-story/subagent_result4.md`
- 子任务5输出：`city-life-story/subagent_result5.md`
- 子任务6输出：`city-life-story/subagent_result6.md`

输出文档应简洁但要可供下一步直接使用。分析子任务不要改代码。只有子任务6可以改代码、构建、提交。

## 实装优先级

优先保证核心体验深度，不追求堆数量：

- P0: 人生目标可跳过但有加成；修复重复图标；剧本/沙盒明显逻辑错误；事业发展入口和关键数据不崩。
- P1: 上班族和创业形成更清晰的选择、反馈、风险、联动；UI 分类更清爽。
- P2: 新增少量高质量事件/文案/提示，让系统之间更有机。

## 验证标准

最终至少运行：

- `npm run check:js`
- `npm run typecheck`
- `python build.py`
- 视修改范围运行 `npm run build` 或补充轻量脚本检查。

如果有无法验证的内容，必须在 `subagent_result6.md` 和最终汇报中说明原因和风险。
