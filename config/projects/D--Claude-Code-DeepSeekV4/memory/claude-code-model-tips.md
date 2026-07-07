---
name: claude-code-model-tips
description: Claude Code 模型选择和混搭策略
metadata:
  node_type: memory
  type: reference
  originSessionId: 8fad3eb2-5c11-4881-ba4a-a526cc83d9ea
---

# 模型混搭策略

**Why:** 不同任务需要不同能力的模型，全部用最强模型成本高。

**模型列表查看：** `/model` 命令可以查看和切换可用模型。

**定时任务用便宜模型：** Cron 定时任务不需要强模型，可以用便宜/本地模型处理。

**不同会话切换不同模型：** 在对话中使用 `/model <model-name>` 切换模型。

**子 agent 用中档模型：** 将简单、重复、机械性的任务拆分给子 agent，用便宜模型处理。主 agent 保留好模型做复杂决策。

**模型路由：** 根据任务复杂度自动选择最适合的模型（参考 model-router skill 的思路）。

**How to apply:**

- 用 `/model` 命令在不同会话切换模型
- Cron 定时任务用便宜模型
- 子 agent 用中档模型，主 agent 用强模型
