#!/bin/bash
# ──────────────────────────────────────────────────────────────────────────────
# 多窗口同步检查：每次会话启动时自动运行
#
# 作用：检测「其他窗口是否已提交了新代码」，并在**绝对安全**的前提下
#       自动同步；不安全时只**报告**，不做任何改动。
#
# [2026-09-17 安全重写 —— 务必先读这段再改这个文件]
#
# 旧版实现（已废弃）存在一处**静默数据销毁**风险：
#
#     git stash 2>/dev/null
#     git checkout . 2>/dev/null      # ★ 危险
#     git stash pop 2>/dev/null
#
# 三个问题叠加：
#
# 1. **逻辑无效**：这三步的净效果是「什么都没做」。`git stash` 执行后
#    工作树已清空，此时 `git checkout .` 无事可做；`stash pop` 又把改动
#    原样恢复。已用沙箱实验证实：执行前后 `git status` 与文件内容完全一致。
#    更关键的是 —— **它根本没有 `git pull` / `git merge`**，
#    所以「同步其他窗口的代码」这个宣称的功能**从未真正实现过**。
#
# 2. **异常路径会销毁数据**：三条命令全部 `2>/dev/null` 且无 `set -e`，
#    任一失败静默继续。若 `git stash` 失败（多窗口并发时 index.lock
#    竞争、存在冲突状态、权限异常都可能触发），工作树改动仍然在，
#    紧接着的 `git checkout .` 就会**不可恢复地丢弃所有已跟踪文件的改动**。
#    已用沙箱实验证实：追加到已跟踪文件中的内容被彻底抹除。
#    —— 讽刺的是，本脚本的存在目的就是服务多窗口场景，
#    而多窗口恰恰是 `git stash` 最容易失败的环境。
#
# 3. **失败仍标记为已同步**：末尾无条件写入当前 HEAD，即使前面全部失败，
#    下次启动也不会再检查，问题被彻底掩埋。
#
# 新版设计原则：**宁可不同步，绝不丢改动。**
#   - 只有工作树完全干净时才自动 `git pull --rebase`
#   - 工作树有改动时，只提示，绝不触碰
#   - 所有异常显式报告，不再静默
#   - 不修改任何本地文件（除必要时的 last_known_head）
# ──────────────────────────────────────────────────────────────────────────────

# 注意：这里刻意**不加** set -e —— 本脚本用显式返回值处理各类失败，
# 需要继续执行以给出完整诊断信息。

cd "$(dirname "$0")/.." 2>/dev/null || {
  echo "⚠️ [sync-check] 无法切换到仓库根目录，跳过检查"
  exit 0
}

LAST_KNOWN_FILE=".claude/last_known_head"

# 基础前置检查：不是 git 仓库就静默退出（不影响会话启动）
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  exit 0
fi

CURRENT_HEAD=$(git rev-parse HEAD 2>/dev/null)
if [ -z "$CURRENT_HEAD" ]; then
  echo "⚠️ [sync-check] 无法读取 HEAD，跳过检查"
  exit 0
fi

# ── 判断是否需要检查 ──────────────────────────────────────────────────────────
NEED_CHECK=0
if [ -f "$LAST_KNOWN_FILE" ]; then
  LAST_KNOWN=$(cat "$LAST_KNOWN_FILE" 2>/dev/null)
  if [ "$LAST_KNOWN" != "$CURRENT_HEAD" ]; then
    NEED_CHECK=1
  fi
else
  # 首次运行，没有基线，只建立基线不做同步
  NEED_CHECK=0
fi

if [ "$NEED_CHECK" -eq 0 ]; then
  echo "$CURRENT_HEAD" > "$LAST_KNOWN_FILE" 2>/dev/null
  exit 0
fi

# ── 检测到 HEAD 变化 ──────────────────────────────────────────────────────────
# 注意：HEAD 变化**未必**来自其他窗口 —— 也可能是本窗口刚提交完（此时
# post-commit 钩子通常会同步记录文件，但因钩子可能未安装/失效而漏掉）。
# 因此这里不做「一定是其他窗口」的判断，只如实描述事实。

echo "🔔 [sync-check] 检测到 HEAD 与上次记录不一致"
echo "   记录: ${LAST_KNOWN:0:8}"
echo "   当前: ${CURRENT_HEAD:0:8}"

# ── 安全性检查 1：工作树是否有未提交改动 ──────────────────────────────────────
# 这是最关键的一道闸门。有改动时**绝不执行任何可能触碰工作树的 git 命令**。
DIRTY=$(git status --porcelain 2>/dev/null)
if [ -n "$DIRTY" ]; then
  DIRTY_COUNT=$(printf '%s\n' "$DIRTY" | wc -l | tr -d ' ')
  echo "⚠️ [sync-check] 工作树有 $DIRTY_COUNT 项未提交改动 —— 出于安全考虑，本次不自动同步。"
  echo "   请手动确认后执行（本脚本不会替你做决定）："
  echo "     git status                 # 查看改动"
  echo "     git pull --rebase origin main   # 确认无误后同步"
  echo "   （不自动执行的原因：自动 stash/pop 在并发场景下可能丢失改动）"
  # 不更新记录文件 —— 让下次启动重新检查，避免问题被掩埋
  exit 0
fi

# ── 安全性检查 2：是否处于 merge/rebase 中间态 ────────────────────────────────
GIT_DIR=$(git rev-parse --git-dir 2>/dev/null)
if [ -d "$GIT_DIR/rebase-merge" ] || [ -d "$GIT_DIR/rebase-apply" ] || [ -f "$GIT_DIR/MERGE_HEAD" ]; then
  echo "⚠️ [sync-check] 仓库正处于 merge/rebase 中间态 —— 不自动同步。"
  echo "   请先完成或中止当前操作（git merge --abort / git rebase --abort）。"
  exit 0
fi

# ── 安全性检查 3：远程可达性 ──────────────────────────────────────────────────
# 探测上游分支而非字面量 "HEAD"。两个实测踩过的坑：
#
#   坑 1：若远程仓库 HEAD 指向 master 而实际分支是 main，
#         `git ls-remote --exit-code origin HEAD` 返回 2（no matching refs），
#         把"可达但 HEAD 引用未对齐"误判为"不可达"。
#   坑 2：`git rev-parse --abbrev-ref @{u}` 返回的是 **origin/main**
#         （带远程名前缀），直接传给 ls-remote 会变成 origin/origin/main，
#         引用不存在。必须剥掉远程名前缀。
UPSTREAM_REF=$(git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null)
if [ -z "$UPSTREAM_REF" ]; then
  echo "ℹ️ [sync-check] 当前分支未设置上游（@{u}），跳过同步检查。"
  exit 0
fi

REMOTE_NAME="${UPSTREAM_REF%%/*}"          # origin
UPSTREAM_BRANCH="${UPSTREAM_REF#*/}"       # main

if ! git ls-remote --exit-code "$REMOTE_NAME" "refs/heads/$UPSTREAM_BRANCH" >/dev/null 2>&1; then
  echo "ℹ️ [sync-check] 远程不可达（离线或网络受限），跳过同步检查。"
  exit 0
fi

# ── 检查本地与远程的领先/落后关系 ────────────────────────────────────────────
BEHIND=$(git rev-list --count HEAD..@{u} 2>/dev/null)
AHEAD=$(git rev-list --count @{u}..HEAD 2>/dev/null)

# 归一化：git rev-list --count 失败时会返回空串
[ -z "$BEHIND" ] && BEHIND=0
[ -z "$AHEAD" ] && AHEAD=0

if [ "$BEHIND" -eq 0 ]; then
  if [ "$AHEAD" -eq 0 ]; then
    echo "✅ [sync-check] 本地与远程一致，无需同步。"
  else
    echo "✅ [sync-check] 本地领先远程 $AHEAD 个提交（待推送），无需同步。"
  fi
  echo "$CURRENT_HEAD" > "$LAST_KNOWN_FILE" 2>/dev/null
  exit 0
fi

# 分叉检测：本地有远程没有的提交，且远程也有本地没有的提交。
# 此时 --ff-only 必然失败，直接跳过并给出准确指引，不必等 pull 报错。
if [ "$AHEAD" -gt 0 ]; then
  echo "⚠️ [sync-check] 本地与远程已分叉（本地独有 $AHEAD 个，远程独有 $BEHIND 个）。"
  echo "   不自动处理 —— 分叉合并可能产生冲突，需人工判断。"
  echo "   建议：git log --oneline @{u}..HEAD    # 看本地独有提交"
  echo "         git rebase @{u}                 # 确认后变基到远程"
  exit 0
fi

echo "🔔 [sync-check] 本地落后远程 $BEHIND 个提交，工作树干净 —— 执行自动同步"

# ── 执行同步 ──────────────────────────────────────────────────────────────────
# 此时已确认：工作树干净、无中间态、远程可达、本地无独有提交（可快进）。
#
# ★ 注意这里的写法：**不能用 `if git pull ... | sed ...`**
#   管道的退出码取自最后一个命令（sed），而 sed 几乎永远成功，
#   于是 `if` 恒为真 —— 即使 pull 失败也会被报告成"同步完成"。
#   这个坑已在开发本脚本时真实踩到一次（pull 报 fatal 却输出 ✅），
#   故改用临时文件承接输出、直接检查 git 自己的退出码。
PULL_LOG=$(mktemp 2>/dev/null) || PULL_LOG=""
if [ -n "$PULL_LOG" ]; then
  git pull --ff-only > "$PULL_LOG" 2>&1
  PULL_STATUS=$?
  sed 's/^/   /' "$PULL_LOG"
  rm -f "$PULL_LOG"
else
  # mktemp 不可用时退化为直接输出（此时仅失去缩进，仍能正确取退出码）
  git pull --ff-only 2>&1
  PULL_STATUS=$?
fi

if [ "$PULL_STATUS" -eq 0 ]; then
  NEW_HEAD=$(git rev-parse HEAD 2>/dev/null)
  echo "✅ [sync-check] 同步完成，当前 HEAD: ${NEW_HEAD:0:8}"
  echo "$NEW_HEAD" > "$LAST_KNOWN_FILE" 2>/dev/null
else
  echo "⚠️ [sync-check] 自动同步失败（git 退出码 $PULL_STATUS）。"
  echo "   请手动处理：git pull --rebase"
  # 不更新记录文件，下次启动会重试
  exit 0
fi
