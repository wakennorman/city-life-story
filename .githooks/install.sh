#!/bin/sh
# ──────────────────────────────────────────────────────────────────────────────
# 安装 git 钩子（把 .githooks/ 挂到当前仓库）
#
# 用法（在仓库根目录执行一次）：
#     sh .githooks/install.sh
#
# [为什么需要这个脚本]
# `core.hooksPath` 是**本地 git 配置**，存在 .git/config 里，**不会随仓库
# 分发**。也就是说：即使 .githooks/ 里的钩子已纳入版本控制，新 clone 或
# 换机器后 git 仍然不会使用它 —— 必须显式配置一次。
#
# 这个脚本把"配置一次"的动作固化下来，避免每次都靠记忆敲命令，
# 也让新加入的人有一条明确路径可走。
#
# [它做什么]
#   git config core.hooksPath .githooks
#
# [它是幂等的]
# 重复执行无副作用，可以随时重跑。
# ──────────────────────────────────────────────────────────────────────────────

set -e

# 切到仓库根目录（本脚本位于 <root>/.githooks/ 下）
SCRIPT_DIR=$(cd "$(dirname "$0")" && pwd)
REPO_ROOT=$(cd "$SCRIPT_DIR/.." && pwd)
cd "$REPO_ROOT"

# 前置检查：确认在 git 仓库内
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "❌ 当前位置不是 git 仓库，无法安装钩子。"
  exit 1
fi

# 前置检查：确认 .githooks 目录存在且含钩子文件
if [ ! -d ".githooks" ]; then
  echo "❌ 找不到 .githooks 目录。"
  exit 1
fi

HOOK_COUNT=0
for hook in pre-commit post-commit; do
  if [ -f ".githooks/$hook" ]; then
    HOOK_COUNT=$((HOOK_COUNT + 1))
  else
    echo "⚠️  缺少 .githooks/$hook"
  fi
done

if [ "$HOOK_COUNT" -eq 0 ]; then
  echo "❌ .githooks/ 下没有任何钩子文件，中止。"
  exit 1
fi

# 设置 hooksPath
git config core.hooksPath .githooks

# 确保钩子有可执行权限（Windows 上 git checkout 可能不保留该位）
chmod +x .githooks/* 2>/dev/null || true

echo "✅ git 钩子已安装"
echo "   core.hooksPath = $(git config --get core.hooksPath)"
echo "   已启用 $HOOK_COUNT 个钩子:"
for hook in .githooks/*; do
  [ -f "$hook" ] && case "$hook" in
    *.sh) ;;
    *) echo "     - $(basename "$hook")" ;;
  esac
done
echo ""
echo "如需卸载：git config --unset core.hooksPath"
