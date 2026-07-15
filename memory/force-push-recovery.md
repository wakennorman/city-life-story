---
name: force-push-recovery
description: 远程 force push 后无损恢复的统一流程（备份→推送→比对）
metadata:
  type: reference
---

# 远程 Force Push 恢复流程

## 场景

本地 `master` 与远程 `origin/master` 历史分岔（远程被 force push 重写历史），`git push` 被拒，`git pull --rebase` 也因无共同祖先/文件冲突失败。

## 处理流程（2026-07-15 验证通过）

### 第一步：诊断

```bash
# 检测远程是否被 force push
git fetch
git log --oneline origin/master..HEAD    # 本地独有 commit
git log --oneline master..origin/master  # 远程独有 commit
git merge-base master origin/master      # 返回空 = 无共同祖先

# 对比两边的文件结构
git ls-tree origin/master --name-only | head -20
git ls-tree master --name-only | head -20
```

### 第二步：备份远程独有内容

```bash
# 保存远程分支为本地备份（不会丢失）
git branch backup-remote origin/master
# 推送到远程以防万一
git push origin backup-remote
```

### 第三步：决定推哪边

**判断标准**：哪边的游戏代码更先进。

```bash
# 对比关键文件内容
for f in "src/js/main.js" "src/js/core/cross_system_events.js"; do
  git show backup-remote:$f | md5sum
  md5sum "city-life-story/$f"
done
# 如果子模块有相同的文件但路径不同，先找到子模块里的对应文件再 diff
```

### 第四步：强制推送（选定的版本）

```bash
# 推送本地版本覆盖远程
git push --force origin master
```

**保险机制**：`backup-remote` 分支已保存远程原始内容，任何时候都可以从中 cherry-pick。

### 第五步：合并远程独有内容

```bash
# 对比备份分支的文件内容是否已包含在本地版本中
git diff backup-remote:src/js/core/<file>.js city-life-story/src/js/core/<file>.js
```

### 第六步：不要忘记子模块

如果仓库使用了子模块（gitlink），子模块也需要单独推送：

```bash
cd <submodule-dir>
git remote set-url origin https://...  # 统一协议（SSH→HTTPS）
git push origin master --force
```

## 预防措施（避免再次发生）

| 做法 | 说明 |
|------|------|
| 禁止对共享分支（`master`/`main`）使用 `--force` | 除非是故意的架构调整且团队已知 |
| 开工前先 `git fetch && git status` | 发现远程有变化再决定策略 |
| 使用 `--force-with-lease` 而非裸 `--force` | 会检查远程是否被其他人更新过，安全性更高 |
| 多窗口协作时签出独立分支 | 每人用自己的 feature 分支，合入 master 走 PR/MR |
| 子模块 URL 统一使用 HTTPS | SSH 可能因密钥问题不可达 |

## 本次事件（2026-07-15）

- **根因**：远程被 force push 重构（子模块结构 flattened 为平铺结构），导致本地6个 commit 无共同祖先
- **处理结果**：本地版本推送到远程（含子模块 R20 修复），`backup-remote` 分支保存远程原内容
- **内容检查**：远程的 feat 内容完全包含在本地子模块中，无需额外合并