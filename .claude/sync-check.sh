#!/bin/bash
# 多窗口同步检查：每次 Claude 窗口启动时自动运行
# 如果其他窗口已提交了新代码，自动合并后再开始工作

cd "$(dirname "$0")/.." 2>/dev/null || exit 0

LAST_KNOWN_FILE=".claude/last_known_head"
CURRENT_HEAD=$(git rev-parse HEAD 2>/dev/null)

if [ -f "$LAST_KNOWN_FILE" ]; then
  LAST_KNOWN=$(cat "$LAST_KNOWN_FILE" 2>/dev/null)
  if [ "$LAST_KNOWN" != "$CURRENT_HEAD" ]; then
    echo "🔔 检测到其他窗口已提交了新代码，正在同步..."
    git stash 2>/dev/null
    git checkout . 2>/dev/null
    git stash pop 2>/dev/null
    echo "✅ 同步完成"
  fi
fi

# 更新记录文件
echo "$CURRENT_HEAD" > "$LAST_KNOWN_FILE"