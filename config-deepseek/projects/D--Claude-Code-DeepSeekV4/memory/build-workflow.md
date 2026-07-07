---
name: build-workflow
description: src → build.py → dist — 每次修改源码后必须重新构建 dist 才能生效
metadata:
  node_type: memory
  type: reference
  project: city-life-story
  originSessionId: 71dc6608-cc48-42ef-a6dd-f97c0af934bc
---

# 构建工作流：src → build.py → dist

## 关键规则

项目使用 `build.py` 将 `src/` 目录下的多个文件（HTML + CSS + JS）内联打包为单个 `dist/index.html`。

- **`src/`** = 开发目录，存放多文件源码
- **`dist/index.html`** = 部署产物，浏览器打开的是这个文件
- **玩家/测试用打开 `dist/index.html`**，不是 `src/index.html`

## 必须执行的步骤

每次修改 `src/` 下的任何文件后，**必须运行**：

```bash
cd D:\Claude Code+DeepSeekV4\city-life-story && python build.py
```

否则浏览器打开 `dist/index.html` 看到的仍是旧版代码。

## 历史教训

2026-06-21：用户反馈 UI 修改没生效，排查发现改的是 `src/` 文件，但用户打开的是 `dist/index.html`。浪费了大量时间在旧版 dist 上做重复编辑，最终通过 `build.py` 重新构建解决。

## 相关

- [[development-doc]] — DEVELOPMENT.md 中的构建说明
