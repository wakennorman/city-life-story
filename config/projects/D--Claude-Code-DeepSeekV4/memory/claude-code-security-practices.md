---
name: claude-code-security-practices
description: Claude Code 安全使用最佳实践
metadata:
  node_type: memory
  type: reference
  originSessionId: 8fad3eb2-5c11-4881-ba4a-a526cc83d9ea
---

# 安全最佳实践

**Why:** 保护本地文件、账号和数据安全。

**下载安全：**

- 下载 skill/插件尽量从官方或可信源（Clawhub、Claude Code 官方 marketplace）
- 安装前用 skill-vetter 进行安全扫描（如果有的话）

**权限限制：**

- 对部分工具按需关闭权限，尤其注意：
  - 浏览器自动化工具权限过高，能用 WebFetch/WebSearch 就不用 browser
  - 网关/消息工具连接外部，可能形成信息外泄链路
- 在 `.claude/settings.json` 中用 `permissions.deny` 限制危险操作

**沙箱隔离：**

- 敏感文件建议使用沙箱（Docker）隔离
- 让 Claude Code 所有操作都在工作区完成，不要触碰工作区外的真实环境

**账号安全：**

- 不要把自己的社交媒体、浏览器登录等私人账号共享给 AI
- 可以单独申请一个测试账号

**How to apply:**

- `.claude/settings.json` 中配置 `permissions.deny` 限制危险工具
- 使用 `extraKnownMarketplaces` 时只添加可信源
- 敏感操作前确认权限提示
