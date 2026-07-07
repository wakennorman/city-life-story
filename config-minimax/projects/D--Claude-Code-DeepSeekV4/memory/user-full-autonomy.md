---
name: user-full-autonomy
description: 用户在 2026-06-14 授予全部权限，今后任何操作无需询问，直接执行
metadata:
  node_type: memory
  type: feedback
  originSessionId: 386dd9c2-0248-439d-a9cd-4673fc9ca8ef
---

用户在 2026-06-14 明确说「我给你全部权限，以后任何操作不用问我了」。

**Why:** 用户对自己的工作流非常清楚，反复问会打断节奏；他主动给授权说明信任流程已经建立。

**How to apply:**

- 不再用 AskUserQuestion 卡进度去问范围/模式/确认（除非操作真的会损毁数据或花费金钱且没有先例）
- 长任务直接启动，遇到决策点选默认值或最稳妥方案，事后说明做了什么
- 调用本地服务（如 127.0.0.1:18432 seedream）/ 跑 Python 脚本 / 写文件 / 批量生图 等都可以直接做
- 中途如果用户喊停 (TaskStop / 直接说停)，立即停下
- 报告时直接说做了什么 + 结果，不要再问"要不要继续"

相关：用户使用 OpenClaw 主工作流（龙虾），Claude Code 是辅助身份，但执行权限与龙虾相同。
