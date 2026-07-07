---
name: claude-code-context-optimization
description: Claude Code 上下文瘦身和 token 优化技巧
metadata:
  node_type: memory
  type: reference
  originSessionId: 8fad3eb2-5c11-4881-ba4a-a526cc83d9ea
---

# Claude Code 上下文优化技巧

**Why:** 随着对话轮次增多，上下文变长，token 消耗显著增加。需要定期瘦身。

**瘦全身（工具/记忆/skill 定期体检）：**

- 定期检查哪些 skill/memory 是真正需要的，停用/删除不常用的
- 可以用 Cron 定时任务，每周做一次审查，把结果汇总给用户

**瘦肚子（减少不必要的上下文加载）：**

- 如果某些 skill 不常用，可以设置 `skillOverrides` 为 `"user-invocable-only"` 或 `"off"`
- 浏览器自动化操作（browser 工具）token 消耗大，优先用 WebFetch/WebSearch 替代

**瘦大腿（心跳/定时任务优化）：**

- 心跳机制可能每天产生大量无意义 token 消耗
- 用 Cron 定时任务替代，一天一次的触发频率更省 token

**瘦手臂（会话管理）：**

- 对话过长时用 `/compact` 压缩上下文，减少 token 损耗
- 不同任务在不同会话中做，保持记忆隔离

**How to apply:**

- 使用 `/compact` 手动压缩长对话
- 使用 `skillOverrides` 控制 skill 加载级别
- 用 CronCreate 工具替代高频心跳任务
