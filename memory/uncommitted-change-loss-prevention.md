---
name: uncommitted-change-loss-prevention
description: 本地未commit改动因分支切换丢失的教训及防护措施
metadata:
  type: reference
---

## 教训：未commit的改动在分支切换时丢失

**2026-07-12**：用户在 `main` 分支上做了"出行→城市地图整合"的本地修改，但未commit。优化循环切换到了 `master`/`loop/auto` 分支后，该修改丢失。

### 根因

1. **未commit的改动没有 git 保护**——分支切换时 git 要么拒绝（有冲突），要么覆盖（无冲突的新文件）
2. **优化循环使用了独立分支**（`master`，与 `main` 无共同祖先），切换时丢失了 `main` 的未跟踪文件
3. **`src/` 目录在 `master` 分支上从未被跟踪**——切换后文件虽然留在磁盘上，但变成了 untracked 状态

### 防护措施

#### 1. 任何时候开始重大修改前先 commit（铁律）

```bash
git add <文件> && git commit -m "wip: 描述"
```

即使改动未完成也要 commit 一个 WIP，后续用 `git commit --amend` 完善。

#### 2. 优化循环不准切换分支

优化循环/loop 必须始终在 `main` 分支上工作，直接 commit 到 `main`，**禁止**创建：

- 与主线无共同祖先的孤儿分支（如 `master`）
- 长期存在的并行分支（如 `loop/auto`）

需要实验性改动？→ 在 `main` 上 commit，不满意再 reset。

#### 3. 分支切换前自动检查

在 `.claude/hooks/` 或 settings.json 的 `hooks` 中注册：

- `before-checkout` → 检查是否有未跟踪/修改的工作区文件，有则自动 stash
- `before-commit` → 已有（last_known_head 检查），保护多窗口冲突

#### 4. 频繁的 git status 检查

每次 /loop 轮次开始时，先 `git status --short` 确认工作区干净，有未commit改动则先 stash。

#### 5. 快捷方式 / bat 文件版本锁定

桌面快捷方式应指向固定路径的 bat 文件，bat 文件本身应纳入版本控制（不要是 untracked 文件），避免因文件被删除导致快捷方式失效。

### 恢复步骤（如果再次发生）

1. `git fsck --lost-found` 查找 dangling commit
2. 检查 `git stash list` 的所有 stash
3. 用 `git reflog` 回溯 HEAD 历史
4. 如果能找到未commit的改动，用 `git stash` 或 `git checkout` 恢复

**关联：** [[multi-agent-conflict-boot-loss]] · [[multi-window-sync]]
