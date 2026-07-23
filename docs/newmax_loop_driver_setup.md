# NewMax 作为「城市浮生记」全系统 Loop 单驱动 + 24/7 配置指南

> 适用场景：用户希望用一个能统筹 agent、且 24 小时不间断工作的工具来跑 `/loop` 全系统维度优化。
> 结论先行：**NewMax 是「单驱动 + 24/7 本地自动化」的优选方案**，但它本质是「一个驱动」，不是「多窗口协调器」。

---

## 一、newmax.cc 到底是什么（已实拉官网确认）

NewMax 是**本地优先（local-first）的 AI 工作台**，桌面应用（macOS / Windows / Linux，**个人版免费**）。核心能力：

| 能力 | 对 loop 的意义 |
|---|---|
| 本地工作区绑定文件夹，直接读写文件 + 执行终端命令 | 能直接跑 `/loop` 提示词、改 `src/`、跑 `build.py` |
| Skill 系统（侧栏安装、斜杠命令、可绑定项目/定时任务） | 我的 `loop-collision-protocol` 技能可直接导入复用 |
| 定时任务 / 自动任务（按时间或依赖执行、推送完成通知） | 24/7 触发 loop 的载体 |
| 权限模式 + 命令白名单 + 审批条 | `git commit`/`build` 等关键操作可控，不会失控 |
| 多模型路由（Claude / OpenAI / DeepSeek / 本地模型…） | 可挑性价比模型跑长循环 |
| 浏览器自动化（本机 Chrome） | 如需截图回归/可视化验收可用 |

---

## 二、它能做你的「统筹 + 24/7」吗？—— 诚实判定

### ✅ 能做的部分（正是我上一轮推荐的「单一驱动源 + 24/7」形态）

NewMax 作为**唯一的 loop 驱动**，比你现在开 N 个 Claude Code CLI 窗口强在多：
- **单进程 = 单写者**，从根上消灭「多窗口并发写同一 git 树 + 同一状态文件」的撞车；
- **内置定时任务**，不用你手写 Windows 任务计划脚本（我上一轮给的方案）；
- **Skill 导入**，我的 `loop-collision-protocol` 技能一键复用，防撞纪律不用每次重讲；
- **权限/白名单**，长时间无人值守时关键命令可控。

### ⚠️ 它做不到的部分（必须认清的边界）

1. **它不能「统管」你已有的 N 个 Claude Code CLI 窗口。**
   NewMax 是一个独立桌面应用、一个进程。它管不了那些散落在各 CLI 窗口里的并行 `/loop`。
   → 正确用法是：**关掉那 N 个窗口的 `/loop`，让 NewMax 当唯一驱动**。这本身就把撞车根因消除了，而不是「加一个统筹层去协调还在互撞的窗口」。

2. **定时任务粒度待实测。**
   官网 FAQ 写的是「按天、按周或指定时间自动跑一次工作流」。是否支持 **≤10 分钟**粒度，需要你在 NewMax 里实测确认（这跟 WorkBuddy automation 最低 HOURLY 是同一类限制）。若只到「天/周/指定时刻」，10 分钟一轮得用外部调度器兜底。

3. **24/7 依赖「机器不关机 + app 在跑」。**
   NewMax 是 GUI 桌面应用，是否支持无桌面 headless 常驻未知。真·always-on 仍需机器常开。

4. **设计漂移仍需人工闸门。**
   无人在场长跑，MC 只验存活率不验「好不好玩」。建议设「每 N 轮必须人工 review 一次再放行」。

---

## 三、落地步骤（单驱动版）

1. **下载 NewMax**，新建工作区，**绑定文件夹指向 `city-life-story`**（含 `.git` 的仓库根）。
2. **导入碰撞协议技能**：把本仓 `.workbuddy/skills/loop-collision-protocol/` 作为本地 Skill 文件夹安装进 NewMax（若其格式略不同，照 `SKILL.md` 内容复制即可）。
3. **收敛驱动源**：停掉其他 Claude Code CLI 窗口里的 `/loop`，只留 NewMax 一个驱动。
4. **建定时任务**：在 NewMax 里建一个自动任务，触发周期按你机器能承受的最小粒度（实测后定），任务内容贴下方「单驱动 Loop 提示词」。
5. **加人工 review 闸门**：在提示词里保留「每 8 轮暂停等人工确认」的硬条件。

---

## 四、给 NewMax 的单驱动 Loop 提示词（已含防撞纪律，可直接用）

```
你是「城市浮生记」全系统维度优化的唯一自动驾驶驱动。无限循环，无结束目标。

⚡ 铁律：每轮优化完必须立即 git commit + git push，绝不允许未 commit 改动留在工作区。

8 域（每次选一个薄弱域轮换）：
A 数据/数值平衡  B 事件/叙事  C 职业/成长  D NPC/社交
E 经济/投资      F UI/UX      G 核心机制   H Phase2/公司

指令一：审查 + 修复 A 类缺陷（对照各域 A 类判定，直接修不确认）
  每修一处加注释：// [全系统自洽修复] 域X 修复:xxx
  完成：node --check → python build.py → git commit -m "fix: [域X] A类缺陷修复(N个)" → git push

指令二：联动增强（2-4 项，通用联动方向选题）
  完成：node --check → python build.py → MC 6×400d →
        git commit -m "feat: [域X] 联动增强(N项)" → git push

每轮交付：① 修复清单 ② 增强清单 ③ 更新 CLAUDE.md 迭代表
        ④ 写记忆文件 ⑤ 更新 .claude/loop-domain-state.json

【防撞纪律（单驱动也必须遵守）】
1. 我是唯一写者；CLAUDE.md 表 / loop-domain-state.json / last_known_head 只由我改。
2. 改 src/index.html 前先 git status 探热；若有其他未提交改动涉及该文件，先 git stash 或等其稳定。
3. 新事件文件必须先在 src/index.html 加 <script> 标签再 build，否则是孤儿。
4. build.py 按 src/index.html 的 <script> 顺序打包——新增 JS 务必登记。
5. 数值一律标 [PLACEHOLDER] 待平衡。
6. 【人工闸门】每完成 8 轮，停止自动循环，输出本轮总结等人工确认后再继续。
7. MC 验证用前台长超时执行（node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400），不丢结果。
```

---

## 五、与我（WorkBuddy 会话）的关系

- 我**无法跨产品控制 NewMax**——它是独立桌面应用，我伸不过去。
- 我的角色收敛为：**按需帮手**。你 @我「做职业域下一批」时，我按既有防撞协议只准备源文件 + 记忆，不抢提交。
- 已为你备好的资产：`loop-collision-protocol` 技能（防撞 6 条 + 单一驱动架构 + 验证清单）+ 本指南。
