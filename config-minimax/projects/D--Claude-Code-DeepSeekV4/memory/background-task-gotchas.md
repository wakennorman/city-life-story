---
name: background-task-gotchas
description: Claude Code 后台任务的两个 Windows / Python 特有坑：&、stdout 缓冲
metadata:
  node_type: memory
  type: feedback
  originSessionId: 386dd9c2-0248-439d-a9cd-4673fc9ca8ef
---

## 坑 1：`&` 后台符 + `run_in_background: true` 会孤儿化进程

错误：

```bash
# 我写了
cd "D:/path" && python long_job.py 2>&1 | tail -100 &
sleep 2
echo "===启动==="
```

配 `run_in_background: true` 提交。

发生了什么：整个命令行已经被 Bash 工具放到后台了。我又在里面加 `&` → python 进程被 fork 进**孤儿后台**。`sleep 2 && echo` 跑完后**外层 shell 退出**，孤儿被杀。结果：进程跑了 ≤2 秒就被 kill，输出文件只有 `===启动===` 这一行。

**修正**：用 `run_in_background: true` 时**不要**在命令里加 `&`：

```bash
cd "D:/path" && python long_job.py 2>&1
```

## 坑 2：Python `print()` 在重定向时 line-buffered，输出文件 30 秒都是空的

后台跑 Python 时，stdout 不连 TTY，`print` 改为 block-buffered（4KB 一刷），用户看输出文件半分钟还是空的。

**修正**：

```bash
python -u long_job.py 2>&1    # -u 强制 unbuffered
```

或在脚本里 `print(..., flush=True)`。

## 坑 3：Bash 工具有 10 分钟硬超时

`sleep 600` 等检查会被 Bash 工具自己的 timeout 杀掉（exit code 143）。

**修正**：长任务用 `run_in_background: true` 启动，靠 task-notification 回来；中间想看进度就发新的短 Bash（`sleep 30 && tail file`）。或者监控外部状态文件（缓存 / 进度文件）而不是 print 输出。

## 坑 4：调外部脚本传 prompt 时 Windows 路径用 `\\` 易出错

我 Python 里给路径用 `r"C:\..."` raw string，但写嵌入 Python `-c '...'` 里时反斜杠转义混乱。
**修正**：用 `/` 或 `os.path.join`，不要在 inline `-c` 里硬塞 Windows 路径。

相关：[[user-full-autonomy]]
