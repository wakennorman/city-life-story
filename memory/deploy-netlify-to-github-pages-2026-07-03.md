---
name: deploy-netlify-to-github-pages-2026-07-03
description: 2026-07-03 城市浮生记从 Netlify 迁移到 GitHub Pages — 原因、做法、工作流优化
metadata:
  type: project
---

# 从 Netlify 迁移到 GitHub Pages（2026-07-03）

## 根因（重要 — 避免重蹈覆辙）

**网幅说"Account credit exceeded"指的是 build credits，不是 bandwidth。**

| 额度          | Netlify 免费版 | 实际用量             | 结论                      |
| ------------- | -------------- | -------------------- | ------------------------- |
| Build credits | 300 分钟/月    | **耗尽**             | 🔴 这是导致站点禁用的元凶 |
| Bandwidth     | 100 GB/月      | ~95 MB/天 (~3 GB/月) | 🟢 只用了 3%              |

### 为什么 build credits 耗尽？

- 每次 push 触发一次构建
- 本项目构建耗时 5-15 分钟（python build.py + 验证）
- 调试期频繁 push → 每天 20-50 次 → 月 build credits 耗尽
- 耗尽后站点**全部禁用**（不只是带宽受限）

## 切换后对比

| 对比项     | Netlify 免费版  | GitHub Pages 免费版        |
| ---------- | --------------- | -------------------------- |
| Build 限制 | 300 分钟/月 ❌  | **无构建限制** ✅          |
| 带宽限制   | 100 GB/月       | 100 GB/月                  |
| 超限后果   | 站点全部禁用 ❌ | 限速/跳过构建，不会宕机 ✅ |
| 大陆访问   | 一般            | 大部分地区直连 ✅          |
| 自定义域名 | ✅              | ✅                         |

## 切换步骤

1. 仓库创建 `.github/workflows/deploy.yml`（GitHub Actions 自动部署）
2. push 到 main 触发首次构建
3. GitHub 仓库 Settings → Pages → Source 选 "GitHub Actions"
4. 线上地址：`https://<username>.github.io/<repo>/`

## 工作流优化（本地先验再推）

### 核心原则

> **本地验过再推** — 一次改动从"几十次 push"变成"一次精准 push"

### 本地预览方法（任选其一）

```powershell
# 方法1：直接启动开发服务器（推荐，有热重载）
cd city-life-story
npm run dev    # 浏览器打开 http://localhost:5173

# 方法2：构建后用 Python 简易服务器预览
cd city-life-story
python build.py
python -m http.server 8080  # 浏览器打开 http://localhost:8080

# 方法3：直接双击 dist/index.html 打开（最粗暴）
```

### 推荐调试流程

```
改代码 → 本地浏览器 F5 看效果 → 满意 → git add/commit/push
    ↑
每天推 0-2 次，而不是 20-50 次
```

### 养成习惯

1. 改代码前：先在本地启动服务器跑起来
2. 改动过程中：用 F5 反复看效果，不 push
3. 满意后再：一次性 add + commit + push
4. 复杂的改动：分阶段 commit，但**每个阶段都在本地验证通过后再推**

---

**Why:** 频繁 push 烧完了 Netlify build credits 导致站点禁用。切到 GitHub Pages 后 build 不再受限，但养成"本地先验再推"的习惯可以一招解决未来所有平台的 build credits 问题。

**How to apply:** 每次调试新功能时，先用 `python -m http.server 8080` 或 `npm run dev` 本地跑起来，确认功能正常再 push。详见 [[long_term_lessons]]
