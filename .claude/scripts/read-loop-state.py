#!/usr/bin/env python3
"""读取 .claude/loop-domain-state.json 并打印循环优化状态摘要。

[为什么存在这个脚本]
原先这段逻辑以内联方式写在 .github/workflows/loop-optimize.yml 的
`run: |` 块里，存在两处独立缺陷：

1. **YAML 层**：内联 Python 的顶格行（如 `import json`）会提前终止
   YAML 块标量，导致整个 workflow 文件解析失败：

       ScannerError: while scanning a simple key
         line 33, column 1 — could not find expected ':'

   GitHub 侧表现为 jobs: 0、0 秒、结论 failure，报
   "This run likely failed because of a workflow file issue"。

2. **逻辑层**：原脚本读取的字段与状态文件实际结构不符——
   `currentRound` / `currentDomain` / `lastDomain` 三个字段在当前
   文件中**根本不存在**，而 `lastRound` 的值是字符串 "1017b"，
   `int("1017b")` 会抛 ValueError。即使绕过缺陷 1，运行时仍会崩。

抽成独立文件后，YAML 里只剩一行普通命令（无缩进歧义），
且本脚本按状态文件的**真实结构**取值，缺失字段一律优雅降级。
"""

import json
import os
import sys

STATE_PATH = os.path.join(".claude", "loop-domain-state.json")


def main() -> int:
    try:
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            st = json.load(f)
    except FileNotFoundError:
        print(f"[read-loop-state] 找不到状态文件: {STATE_PATH}")
        print("MESSAGE=⚠️ 状态文件缺失，无法读取轮次信息。")
        return 0
    except json.JSONDecodeError as e:
        print(f"[read-loop-state] 状态文件 JSON 解析失败: {e}")
        print("MESSAGE=⚠️ 状态文件格式异常，无法读取轮次信息。")
        return 0

    last_round = st.get("lastRound", "?")
    last_direction = st.get("lastDirection", "?")
    last_date = st.get("lastDate", "?")
    last_commit = st.get("lastCommit", "?")
    next_direction = st.get("nextDirection", "?")
    push_status = st.get("pushStatus", "?")

    print(f"Last round: {last_round} ({last_date})")
    print(f"Last direction: {last_direction}")
    print(f"Last commit: {last_commit}")
    print(f"Next direction: {next_direction}")
    print(f"Push status: {push_status}")

    print(
        f"MESSAGE=🔄 Last round {last_round} ({last_date}), "
        f"direction \"{last_direction}\". Next: \"{next_direction}\"."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
