---
name: loop-collision-protocol
description: 当多个 AI 编码窗口（Claude Code / WorkBuddy 等）并行运行同一段自动化循环（如 /loop 全系统优化）并共享同一 git 工作树与状态文件时，如何避免撞车、丢失更新、轮次号冲突与验证失真。提供防撞协议 + 单一驱动源统筹架构 + 24/7 外部调度方案。适用于任何"多窗口跑同一提示词翻新同一仓库"的场景。
---

# 多窗口并行 Loop 防撞协议与统筹架构

## 何时用本技能
- 项目里开了 ≥2 个 Claude Code / AI CLI 窗口，跑**同一段**自动化循环提示词（如"每10分钟全系统维度优化"），都要求每轮 commit+push。
- 出现以下任一症状：git 工作树被 `git checkout .` 冲掉未提交改动、轮次号（R171…）被多个窗口重复占用、`index.html`/`dist` 被未提交文件污染、pre-commit 漂移钩子互相卡死、MC 验证基线随其他窗口漂移无法归因。
- 用户问"怎么让多个 agent 24 小时协调工作" / "需要统筹你们的东西"。

## 核心认知（最重要）
> **并行是隐患根源，不是加速手段。** 对单一共享 git 树，N 个窗口并发写 = 无协调锁的并发写。MC 是吞吐量瓶颈，4 窗口约产出 1× 有效价值，却带来 4× 算力/费用/历史噪声与设计碎片化。
> 任何"统筹工具"要生效，前提是**先收敛到单一驱动源 + 串行执行**。

## 防撞协议（已被本项目验证可行）
1. **只保留一个自动驾驶循环**；其余窗口改为"按需帮手"，仅在被 @ 时动手。
2. **自己绝不 `git commit`/`git push`** 这类 loop 改动——改完源文件 + 新文件后，让唯一驱动窗口的 `git add -A` 顺带吸收（已验证零数据丢失，只是署名归它）。
3. **绝不碰共享状态文件**：`CLAUDE.md` 迭代表 / `loop-domain-state.json` / `last_known_head` 一律不动；只写**私有**记忆文件（如 `career-domain-optimization*.md`，文件名加域前缀避撞）。
4. **改 `index.html` 前先 `git status` 探热**：并行窗口有未提交 index.html 改动时，延后接线；只在稳定时插入，且插在脚本列表**尾部**低流量区。
5. **MC 验证用前台 + 长超时（不设 `run_in_background`）**：后台任务不跨会话持久化，会话重置后 `task_id` 丢失、结果取不回。前台跑（如 `timeout 300000` / Bash `timeout` 参数）结果必落在同一次调用。
6. **动笔前确认并行当轮域**，不碰它正编辑的源文件。

## 推荐统筹架构（单一驱动 + 串行域分片 + 外部 24/7）
```
[外部调度器: Windows 任务计划 / cron, 每10min, 单例锁]
        │  headless 调 claude CLI 或触发 WorkBuddy automation
        ▼
[单一 Orchestrator / "游戏总监" 窗口]  ← 独占 loop-domain-state.json + CLAUDE.md 表
        │  每轮: 选薄弱域 → 派发 1 个域worker → 等完成 → git commit → git push → 轮次+1
        ▼
[域 Worker（串行，一次一个域）]  ← 严格文件契约(见下)
```
- **Orchestrator 是唯一写者** of 轮次号/状态文件；worker 不写这些。
- **Worker 串行**：同一时刻只有一个域在改树，消除并发写。
- **事件 id / flag 命名空间**：各域强制前缀（`career_*` / `news_*` / `corp_*` …），Orchestrator 在接线 `index.html` 时做唯一性校验（grep 全仓），杜绝重名覆盖。
- **`index.html` 由 Orchestrator 独占维护**：worker 只产出新 `.js` 文件 + 声明"需要加 script 标签"，由总监统一插入并 build。

## 24/7 落地选项（按成本/收益排序）
1. **最推荐**：单 Orchestrator 窗口 + 内置子agent（Claude Code 的 Agent/Task 工具，或 WorkBuddy 的 TeamCreate+Agent）串行派发 + Windows 任务计划每10min 触发（带单例锁，前次未完则跳过）。真 24/7、10min 粒度、零并发撞车。
2. **最省事**：砍到单窗口，用 WorkBuddy HOURLY automation 当驱动（需 WorkBuddy 常开；粒度最低 HOURLY，平台不支持 MINUTELY）。
3. **真·多agent 并发且安全**：自研薄调度脚本，给每个域开 **git worktree** 隔离工作树（互不踩文件），总监定期 rebase/merge 回 main；配合事件 id 命名空间。比现成产品更贴合（市面无"专给 Claude Code 多窗口做 git 协调"的现成货）。

## 诚实提醒（设计层面）
- WorkBuddy / 我无法跨产品统管你的 Claude Code CLI 窗口——它们是不同应用、各自沙箱。**能统筹的前提是 agent 都在同一编排器/会话内。**
- 无人类在场的长时间自动循环，最大风险是**设计漂移 + 静默坏改动累积**：MC 只验存活率，不验"好不好玩"。建议设"每 N 轮人工 review 一次"的硬闸门。
- 24/7 需机器不关机 + 代理/API 可用（曾遇 127.0.0.1:3067 掉线致 push 全失败）。

## 验证清单（每轮收尾）
- [ ] git status 干净（仅含合法进行中改动）？
- [ ] 新事件 id 全仓唯一（grep 校验）？
- [ ] index.html 接线已加、build.py 通过、dist/app.js 含新 id？
- [ ] 前台 MC 6×400d 无新增 regression（区分经济/社交/公司域的既有阈值）？
- [ ] 私有记忆文件已写、共享状态文件未动？
