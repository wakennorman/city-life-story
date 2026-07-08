---
name: window-coordination
description: 多窗口协作协议 — 事前分工 + 文件锁定 + 冲突预防 + 事后追溯
metadata:
  type: protocol
  version: v1.0
---

# 多窗口协作协议（Window Coordination Protocol）

> **核心目标：从"事后修复冲突"升级为"事前避免冲突"**
>
> 本协议适用于多个 Claude Code 窗口同时开发 `city-life-story` 子模块的场景。
>
> **适用前提**：所有窗口共享同一个 Git 仓库 + 同一套记忆文件 + 同一份开发文档。

---

## 一、协议总纲（必读第一条）

### 铁律 0：开工前必做三件事

```
1. git pull origin master          ← 确保本地是最新
2. Read memory/window-coordination.md  ← 加载本文件
3. Read memory/file-lock.json          ← 查看当前锁定状态
```

### 铁律 1：先登记，后动手

在修改任何代码文件之前，必须在 `memory/file-lock.json` 中登记：

- **谁**（窗口标识）
- **改什么**（文件路径）
- **为什么**（关联的 version/id）

### 铁律 2：一人一文件，绝不重叠

同一时刻，**同一个文件只能被一个窗口锁定**。如果文件已被锁定：

- ✅ 可以读（只读不冲突）
- ❌ 不能写（等待释放或协商拆分）

### 铁律 3：小步提交，及时释放

每个 commit 后立即释放锁。禁止"锁着一个文件改半天不 commit"。

### 铁律 4：冲突发生时，后到者优先

如果两个窗口同时修改同一文件：

1. 先到者的 commit 先合并
2. 后到者 pull 最新代码
3. 后到者重新评估修改范围，必要时拆分

---

## 二、文件锁定机制

### 锁定文件

位置：`memory/file-lock.json`

格式：

```json
{
  "_meta": {
    "version": "1.0",
    "last_updated": "2026-07-09T02:30:00+08:00",
    "active_windows": 2
  },
  "locks": [...],
  "history": [...]
}
```

### 锁定状态说明

| 字段     | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| `window` | 窗口标识，格式 `window-{序号}` 或自定义名                    |
| `files`  | 被锁定的文件列表（相对路径，相对于 city-life-story/src/）    |
| `reason` | 为什么要锁，关联的版本/功能                                  |
| `status` | `active`（使用中）/ `reserved`（预留）/ `released`（已释放） |

### 锁定生命周期

```
[扫描当前锁定] → [确定要改的文件] → [检查是否冲突]
  ↓无冲突                              ↓有冲突
[获取锁]                        [拆分任务/协商]
  ↓                                  ↓
[开始修改]                   [重新评估或等待]
  ↓
[完成修改]
  ↓
[git commit]
  ↓
[释放锁]
  ↓
[更新 file-lock.json]
```

---

## 三、窗口角色分工模板

### 推荐的角色划分（根据项目结构）

| 角色            | 负责模块                 | 典型文件                                          |
| --------------- | ------------------------ | ------------------------------------------------- |
| **🎨 UI 窗口**  | 渲染、样式、HTML 结构    | `ui/render.js`, `css/style.css`, `index.html`     |
| **📊 数据窗口** | 数据定义、配置、枚举     | `data/jobs.js`, `data/npcs.js`, `data/skills.js`  |
| **⚙️ 逻辑窗口** | 核心逻辑、系统交互       | `main.js`, `core/events.js`, `daily_pipeline.js`  |
| **🎭 事件窗口** | 事件定义、触发条件、叙事 | `data/*_events.js`, `core/cross_system_events.js` |
| **🔧 基建窗口** | 框架、工具、基础设施     | `core/state.js`, `core/save.js`, `tools/`         |

### 分工原则

1. **UI 窗口** 和 **数据窗口** 通常不冲突（改不同文件）
2. **逻辑窗口** 和 **事件窗口** 可能在 `main.js` / `events_core.js` 重叠 → 需要协调
3. **基建窗口** 改动影响面大 → 建议其他窗口暂停，基建窗口独占

---

## 四、事前协调流程

### Step 1: 扫描当前状态（每个窗口启动时）

```
1. Read memory/file-lock.json → 查看哪些文件被锁定
2. Read CLAUDE.md → 了解当前最新版本和正在进行的工作
3. Read memory/MEMORY.md → 查看记忆文件索引
4. git log --oneline -10 → 确认本地是最新的
```

### Step 2: 声明意图（在对话开始时）

每个窗口在开始工作前，应在对话中明确声明：

```
"我是 window-X，我负责 [模块]，预计修改 [文件列表]，
 关联版本 [v3.xx]，预计耗时 [X commits]。"
```

### Step 3: 检查冲突

对照 `file-lock.json` 中的 `locks` 数组：

- 如果要改的文件**未被锁定** → 直接获取锁
- 如果要改的文件**已被锁定** → 联系另一窗口协商拆分
- 如果要改的文件**不在锁定列表中但相邻** → 评估风险，必要时也获取锁

### Step 4: 获取锁

在 `file-lock.json` 中添加新的 lock 条目，`status: "active"`。

### Step 5: 开始工作

按正常流程修改代码 → 本地验证 → commit。

---

## 五、冲突预防策略

### 5.1 文件级拆分

当两个窗口都需要修改同一个大文件时：

| 大文件      | 窗口 A 负责          | 窗口 B 负责          |
| ----------- | -------------------- | -------------------- |
| `render.js` | 职业系统 UI 渲染函数 | 新闻系统 UI 渲染函数 |
| `main.js`   | 事件调度逻辑         | 日常管线逻辑         |
| `state.js`  | 新增字段定义         | 迁移逻辑             |

**拆分规则**：

- 按**函数/代码块**拆分，不按行号拆分
- 每个窗口只修改自己负责的部分
- 在文件顶部加注释标注"本段由 window-X 维护"

### 5.2 时间级错峰

| 窗口     | 工作时间段  | 说明                         |
| -------- | ----------- | ---------------------------- |
| window-A | 上午/第一轮 | 先改数据层，再改逻辑层       |
| window-B | 下午/第二轮 | 先 pull 最新代码，再改 UI 层 |

**错峰原则**：

- 数据层 → 逻辑层 → UI 层，依次推进
- 每个层级完成后 push，下一层 pull 后再开始

### 5.3 分支隔离

对于大型改动（影响 >3 个文件）：

```
master (主分支，只接受已验证的 commit)
  ├─ feature/window-a-career-ui (窗口 A 的分支)
  └─ feature/window-b-events   (窗口 B 的分支)
```

合并流程：

1. 每个窗口在自己的分支上开发
2. 开发完成后 pull master 再 rebase
3. 解决可能的冲突
4. 合并到 master 并 push

---

## 六、事后追溯机制

### 6.1 版本记忆文件

每个版本完成后，更新对应的记忆文件：

- `memory/v3.xx-<功能描述>.md`
- 记录：新增了什么、改了哪些文件、关联的 commit hash
- 在 `memory/MEMORY.md` 中添加索引行

### 6.2 窗口活动日志

在 `file-lock.json` 中维护 `history` 数组，记录每个 lock 的完整生命周期。

### 6.3 冲突复盘模板

当发生冲突时，在 `memory/conflict-reports/` 下创建复盘文件：

```
memory/conflict-reports/YYYY-MM-DD-<描述>.md
```

内容：

- 冲突原因
- 涉及窗口
- 如何解决的
- 如何预防下次再发生

---

## 七、快速参考卡片

### 每个窗口开工前的 Checklist

```
□ 1. git pull origin master
□ 2. Read memory/file-lock.json
□ 3. 声明自己的角色和要改的文件
□ 4. 检查是否有文件冲突
□ 5. 在 file-lock.json 中获取锁
□ 6. 开始工作
□ 7. 每个 commit 后释放锁
□ 8. 完成后更新版本记忆文件
□ 9. 更新 MEMORY.md 索引
```

### 每个窗口收工前的 Checklist

```
□ 1. 确保所有改动已 commit
□ 2. 释放 file-lock.json 中的锁
□ 3. 更新 memory/v3.xx-<功能>.md
□ 4. 在 MEMORY.md 中添加/更新索引
□ 5. git push origin master
```

### 文件归属速查表

| 文件类别         | 推荐窗口    | 可交叉修改场景 |
| ---------------- | ----------- | -------------- |
| `data/*.js`      | 📊 数据窗口 | UI 窗口只读    |
| `ui/render.js`   | 🎨 UI 窗口  | 逻辑窗口只读   |
| `core/events.js` | 🎭 事件窗口 | 逻辑窗口协作   |
| `core/main.js`   | ⚙️ 逻辑窗口 | 所有窗口只读   |
| `core/state.js`  | 🔧 基建窗口 | 数据窗口协作   |
| `css/style.css`  | 🎨 UI 窗口  | 独立，不冲突   |
| `index.html`     | 🎨 UI 窗口  | 独立，不冲突   |

---

## 八、与现有协议的集成

### 与 CoC（约定式自动归类）的关系

- CoC 规定"只新增、不改旧" → 减少了文件冲突的概率
- 本协议在 CoC 基础上，进一步规定"谁在什么时候改哪个文件"
- 两者互补：CoC 管架构，本协议管协作

### 与"本地先验再推"的关系

- 本地验证 → commit → push → 释放锁
- 释放锁必须在 push 之后，确保其他窗口 pull 的是已验证的代码

### 与内容扩充 v2.1 SOP 的关系

- v2.1 的"每次聚焦 1-2 个文件，每完成一文件一 commit" → 天然适合本协议
- v2.1 的"交叉验证" → 本协议的"检查冲突"步骤

---

## 九、示例场景

### 场景 1：两个窗口同时开发职业系统

```
Window A: "我是 window-A，负责 v3.49 职业系统 UI 重构。
          修改文件：ui/render.js (career_dev 相关函数)、
                   css/style.css (职业系统样式)
          预计 3 commits。"

Window B: "我是 window-B，负责 v3.49 职业系统推荐算法。
          修改文件：data/jobs.js (新增推荐字段)、
                   core/events.js (职业事件条件)
          预计 2 commits。"

检查：两个窗口修改的文件不重叠 → ✅ 可以并行
file-lock.json 更新：
  - window-A 锁定 ui/render.js, css/style.css
  - window-B 锁定 data/jobs.js, core/events.js
```

### 场景 2：两个窗口都需要同改 main.js

```
Window A: "我要改 main.js 的事件调度部分（第 1200-1400 行）"
Window B: "我要改 main.js 的日常管线部分（第 200-500 行）"

冲突！→ 协商拆分：
  方案 1：A 负责 1200-1400 行，B 负责 200-500 行
          中间部分（500-1200 行）暂不动
  方案 2：A 先做，commit 后再由 B 做
  方案 3：B 先做，commit 后再由 A 做

推荐方案 2 或 3（时间级错峰），因为 main.js 行号漂移风险高。
```

### 场景 3：窗口 A 发现窗口 B 的锁没释放

```
Window A 读取 file-lock.json 发现：
  - window-B 的锁 status 仍是 "active"
  - 但最近的 commit 已经是 2 小时前

Action：
  1. 检查 window-B 的 commit 是否已 push
  2. 如果已 push → 手动释放锁（或等 window-B 自己释放）
  3. 如果未 push → 等 window-B 完成
```

---

## 十、协议版本历史

| 版本 | 日期       | 变更                         |
| ---- | ---------- | ---------------------------- |
| v1.0 | 2026-07-09 | 初始版本，建立多窗口协作协议 |
