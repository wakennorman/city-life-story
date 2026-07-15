# 仓库结构重构（2026-07-15）— 双仓库分离

> 本文件记录 2026-07-15 的仓库结构迁移结果 + **不可再犯的铁律**。详见根仓库 `CLAUDE.md`「📦 仓库结构」章节。

## 为什么迁移

迁移前：根 repo（`D:\Claude Code+DeepSeekV4`）与子模块（`city-life-story`）的 `origin` **指向同一个 GitHub 仓库** `wakennorman/city-life-story.git`。
结果：两者都把各自 tree 当作仓库根推到同一远程 → 产生两棵**无共同祖先**的 tree → 必须 force-push 才能调和 → 这就是此前"force push 重写历史、丢失/冲突"灾难的真正根因（"子模块 vs 扁平根"只是症状）。

## 迁移后结构（已磁盘验证 2026-07-15 19:33）

| 仓库 | 路径 | origin 远程 | 分支 | 内容 |
|------|------|------------|------|------|
| 根 repo | `D:\Claude Code+DeepSeekV4` | `wakennorman/claude-config.git` | `master` | 仅配置/脚本/记忆（123 文件） |
| 子模块 | `D:\Claude Code+DeepSeekV4\city-life-story` | `wakennorman/city-life-story.git` | **`main`**（非 master） | 游戏代码 |

- 根 repo 额外保留只读 `game-remote` = 旧 `city-life-story.git`（参考用，勿推）。
- 子模块已由 `.gitmodules` **正式注册**（path=`city-life-story`, url=`city-life-story.git`）。
- 旧根历史保存在本地分支 `old-root-history`，随时可查。
- ✅ 验证：`root.origin ≠ sub.origin` → 根因已消除。

## 🚨 铁律（再犯即灾难）

1. **子模块 `origin` 永远 ≠ 根 repo `origin`。** 两者必须指向不同 GitHub 仓库。
2. **游戏代码只推子模块的 `main`**：`cd city-life-story && git push origin main`。
3. **配置/记忆只推根 repo 的 `master`**：`cd /d/Claude\ Code+DeepSeekV4 && git push origin master`。
4. **绝不让子模块远程指回 `claude-config`，也绝不让根 repo 推到 `city-life-story`。**
5. 游戏分支是 **`main`**（不是 `master`）——推送前确认当前分支。

## 日常操作

```bash
# 改游戏 → 在子模块
cd city-life-story
git pull origin main
# ...改代码...
git push origin main        # ← main 分支

# 改配置/记忆 → 在根 repo
cd /d/Claude\ Code+DeepSeekV4
git pull origin master
# ...改配置...
git push origin master      # ← master 分支
```

## 关联约定（来自项目 SOP）

- 代理 `127.0.0.1:3067` 曾不可用；**push 由用户统一协调**，loop 自动化只本地 commit、不主动 push。
- 多窗口并行开发同一 checkout 仍会"逐字撞车"——与远程分叉无关，靠分支纪律另解。
- 根仓库 `CLAUDE.md` 第 596 行已加注：「2026-07-15 后根 repo 已切换远程到 claude-config，以下流程仅适用于 city-life-story 子模块。」
