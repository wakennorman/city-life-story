# Claude Code 配置开发文档

## ✅ 版本迁移完成通知：城市浮生记

> **2026-06-21：所有独特内容已从根 `src/` 迁移到 `city-life-story/src/`，旧版已清理。**
>
> 当前只有一个活跃版本：`city-life-story/src/`
> 详见 `VERSION_MAP.md` | `memory/待迁移内容清单.md`

---

## Windows 多 API 隔离启动方案

一个 Claude Code CLI 跑多套独立配置（不同服务商、不同 API key、不同模型）。

### 核心原理

配置优先级：**命令行参数**（`--model`）> **环境变量**（`ANTHROPIC_MODEL`、`ANTHROPIC_AUTH_TOKEN` 等）> **配置文件**（`settings.json` 的 env 节）。

隔离关键：每套配置用独立 `CLAUDE_CONFIG_DIR` 目录 + 独立 `settings.json` + 独立 bat 启动脚本。

---

## 桌面 Bat 命名规则（重要）

### 通用格式

```
Claude-<服务商>-<模型>[-api].bat
```

| 部分       | 要求                                          | 示例                                         |
| ---------- | --------------------------------------------- | -------------------------------------------- |
| `Claude-`  | 统一前缀，C 大写                              | 固定                                         |
| `<服务商>` | 英文小写，一眼识别                            | `volcano` `sensenova` `deepseek` `freemodel` |
| `<模型>`   | 短标识，统一缩写风格                          | `ds4f` `glm52` `sonnet46`                    |
| `[-api]`   | 有 `-api` = **官方直连**；无 = **第三方中转** | `deepseek-api-ds4f` vs `volcano-ds4f`        |

**禁止：** 中文、空格、下划线、点号、大小写混用（容易混淆、GBK 乱码）。

### 模型缩写对照表

| 完整模型名                 | 缩写       | 说明          |
| -------------------------- | ---------- | ------------- |
| `deepseek-v4-flash`        | `ds4f`     | 每段取首字母  |
| `glm-5.2`                  | `glm52`    | 去点号        |
| `claude-sonnet-4-6`        | `sonnet46` | 取关键名+版本 |
| `gpt-5-codex`              | `gpt5cx`   | 最简特征字母  |
| `sensenova-6.7-flash-lite` | `flash`    | 取特征词      |

### 本项目实际映射表

| 新命名（建议）                  | 旧命名（待废弃）                              | 服务商           | 业务          |
| ------------------------------- | --------------------------------------------- | ---------------- | ------------- |
| `Claude-deepseek-api-ds4f.bat`  | `Claude Code-DeepSeekAPI.bat`                 | DeepSeek 官方    | ✅ 直连       |
| `Claude-volcano-ds4f.bat`       | `Claude-DeepSeekV4-Flash.bat`                 | 火山引擎         | 第三方        |
| `Claude-volcano-glm52.bat`      | `Claude-火山GLM5.2.bat`                       | 火山引擎         | 第三方        |
| `Claude-sensenova-ds4f.bat`     | `Claude Code-sensenova-deepseek-v4-flash.bat` | SenseNova        | 第三方        |
| `Claude-sensenova-flash.bat`    | `Claude Code-sensenova-6.7-flash-lite.bat`    | SenseNova        | 第三方        |
| `Claude-sensenova-glm52.bat`    | `Claude Code-sensenova-glm5.2.bat`            | SenseNova(proxy) | 第三方        |
| `Claude-freemodel-sonnet46.bat` | `Claude Code - Freemodel.bat`                 | Freemodel        | 第三方        |
| `Claude-longcat-cat20.bat`      | —                                             | LongCat(美团)    | 第三方(proxy) |

> **一眼分辨**：`-api-` 出现 = 官方直连；服务商名出现 = 知道是谁提供的 API。

---

## 快速上手（四步）

### 1. 建独立目录

```
~/.claude-home-<服务商>-<模型>/   ← 会话状态 (.claude.json)
~/.claude-<服务商>-<模型>/        ← 配置 (settings.json)
```

### 2. 写 ps1 启动脚本

```ps1
$realUserProfile = [Environment]::GetFolderPath("UserProfile")
$claudeHome = Join-Path $realUserProfile ".claude-home-<服务商>-<模型>"
$claudeConfigDir = Join-Path $realUserProfile ".claude-<服务商>-<模型>"
$claude = Join-Path $env:APPDATA "npm\claude.cmd"

New-Item -ItemType Directory -Force -Path $claudeHome, $claudeConfigDir | Out-Null

$model = "<模型名>"
$apiKey = "<API Key>"
$baseUrl = "<Base URL>"

$settings = @"
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "$apiKey",
    "ANTHROPIC_BASE_URL": "$baseUrl",
    "ANTHROPIC_MODEL": "$model",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1",
    "SECURITY_GUIDANCE_DISABLE": "1",
    "ENABLE_STOP_REVIEW": "0",
    "MAX_STOP_HOOK_FIRINGS": "0"
  },
  "permissions": {"allow": ["Bash(*)", "Read(*)", "Write(*)", "Edit(*)"]},
  "theme": "auto", "autoMemoryEnabled": true
}
"@ | Set-Content -LiteralPath (Join-Path $claudeConfigDir "settings.json") -Encoding UTF8

'{"hasCompletedOnboarding":true}' | Set-Content -LiteralPath (Join-Path $claudeHome ".claude.json") -Encoding UTF8

$env:HOME = $claudeHome; $env:USERPROFILE = $claudeHome
$env:CLAUDE_CONFIG_DIR = $claudeConfigDir; $env:ANTHROPIC_API_KEY = ""

Set-Location $PSScriptRoot
& $claude --model $model @args
```

> 第三方 API 必须内置 `SECURITY_GUIDANCE_DISABLE` 三行防死循环。官方 API 去掉这三行才能用插件。

### 3. 写桌面 bat

```bat
@echo off
chcp 65001 > nul
title Claude Code <服务商>-<模型>
cd /d "<工作目录>"
powershell.exe -NoLogo -ExecutionPolicy Bypass -File "<ps1 完整路径>" %*
```

| 字段               | 说明                                                            |
| ------------------ | --------------------------------------------------------------- |
| `chcp 65001 > nul` | **必须第一行**，否则中文乱码闪退                                |
| `title`            | 纯 ASCII，避免 GBK 解码吞掉字符                                 |
| `cd /d`            | `/d` 跨盘符；含空格/中文加引号；工作目录不可有 `enabledPlugins` |
| `powershell -File` | 指向独立 ps1 脚本                                               |

### 4. 验证

- 双击 bat 启动
- 闪退诊断：`cmd /k "bat完整路径"` 或 `cmd //c "C:\路径\xxx.bat"`

---

## 踩坑备忘录

### 六大致命坑（按频率排序）

| #   | 现象                                       | 根因                                              | 解决                                          |
| --- | ------------------------------------------ | ------------------------------------------------- | --------------------------------------------- |
| 1   | 新 bat 启动后 key 被旧配置覆盖             | `CLAUDE_CONFIG_DIR` 不独立                        | 每套配置用不同目录                            |
| 2   | "There's an issue with the selected model" | settings 模型名 ≠ `--model` 参数                  | 用一个变量统一两处                            |
| 3   | key 和模型名都对，报 model not found       | Base URL 与模型名不匹配                           | 先 curl 验证端点                              |
| 4   | key 传进去但静默回落 `api.anthropic.com`   | `ANTHROPIC_API_KEY` 格式校验拒收非 `sk-ant-` 开头 | 用 `AUTH_TOKEN` 传 key，清空 `API_KEY`        |
| 5   | 双击闪退无提示                             | `chcp 65001` 没加 / title 含中文                  | bat 第一行 `chcp 65001 > nul`，title 纯 ASCII |
| 6   | 反复输出同一段话 → 死循环                  | 插件 Stop 钩子 + 第三方 API 不稳定                | settings.json 加三行禁用变量（见上）          |

### 工作目录三个隐形坑

1. 跨盘符不加 `/d` 切不过去
2. 路径含空格/`+`/中文不加引号被拆成多参数
3. 工作目录下 `.claude/settings.json` 若含 `enabledPlugins`，项目级配置反向覆盖独立配置

---

## Agent 配置 Checklist

用户给「服务商名 + API key」即可。agent 需自行：

- [ ] 确认 key 类型：Coding Plan（有 Anthropic 兼容协议） vs 通用 API（原生 OpenAI）
- [ ] 确认 Base URL（查文档的 API 端点章节，不是官网首页）
- [ ] 确认模型名在该端点下可用
- [ ] 按命名规则生成：bat 名 `Claude-<服务商>-<模型>[-api].bat`、目录 `~/.claude-<服务商>-<模型>`
- [ ] 写 ps1：统一 `$model` 变量；env 节带三行禁用变量
- [ ] 写 bat：chcp + ASCII title + cd /d + powershell -File
- [ ] 验证启动：`cmd /k "bat路径"`
- [ ] 记录到经验文档（更新本文件映射表）

---

## 剧本开局叙事重设计（2026-07-05）

> **全部 7 个剧本 + 沙盒的开局 description / startingMessage / startEvent 已按"抓人公式"重写。**
>
> 核心公式：**具体数字 × 人物关系 × 道德困境 × 倒计时 × 情感温度**（参考标杆：《大多数》）
>
> 变更文件：`city-life-story/src/js/data/scenarios.js` · `city-life-story/src/js/main.js`
>
> | 剧本         | 核心情感钩子                                                         |
> | ------------ | -------------------------------------------------------------------- |
> | 城市务工者   | 弟弟¥800学费语音，3%电量；四川大叔指出"工地六点招日工"（行动催化）   |
> | 下岗再就业者 | 老婆张梅「¥8500，下月15号截止」                                      |
> | 小镇做题家   | 父亲公示栏照片 vs 算不平的还款表                                     |
> | 外来打工者   | 妈妈手术费¥18000，三个月倒计时                                       |
> | 二代创业者   | 父亲说「败」而不是「搏」                                             |
> | 中年危机     | 纸箱+房贷扣款¥14500提醒同时到达                                      |
> | 应届毕业生   | 第三行收支算不下去，买了包榨菜                                       |
> | 沙盒模式     | 进入游戏前弹出"命运定锚"弹窗，动态显示资产/负债/年龄摘要，3个挑战选1 |
>
> **沙盒挑战选项**：💰百日攒¥50,000 / 📈打工人逆袭开公司 / 🚀自由探索
> 选择存入 `state.flags._sandboxChallenge`，开场消息体现承诺。
>
> **新剧本铁律**：开局设计必须遵守此公式，详见 `memory/opening-hook-design-prompt.md`
>
> ## 🐛 P0 BugFix（2026-07-06）
>
> | #   | Bug                                                              | 根因                                                      | 修复                                                                             |
> | --- | ---------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------- |
> | ①   | `renderMessageLog is not defined`（事件记录不显示+展开按钮消失） | v3.13 拆分 render.js 时函数丢弃（9调用/0定义）            | 重实现 `renderMessageLog`+`scrollMessageLogToBottom`，展开/关闭统一为单一 toggle |
> | ②   | 打车不能达全城+价格随机                                          | 打车分支用 `reachableList`（1-hop邻居），价格 Math.random | 新增 `getTaxiCost` 按跳数定价；打车分支改 `Object.keys(LOCATIONS)` 全城可达      |
> | ③   | 手机端UI溢出（地点栏/属性栏/地图）                               | 固定宽度元素在≤360px溢出                                  | 升级提示缩短+ellipsis、天气预报 170→110px、地图 330→240px、属性栏间距收紧        |
>
> 影响文件：`render.js`(+85)/`render_infra.js`/`render_core.js`/`locations.js`(+12)/`style.css` · commit `07636a1`
>
> ## v3.1 迭代进度（2026-07-06 起，5 项已完成）
>
> **迭代 prompt**：`*/10 * * * *` 循环 Job `fe93b04d`（`/loop` 调度）
>
> | #   | 模块                                                                                                                           | 状态        | commit    |
> | --- | ------------------------------------------------------------------------------------------------------------------------------ | ----------- | --------- |
> | ①   | `ui/daily_quest.js` 全剧本专属动态引导（7 分支 + 🎯 + 损失厌恶/禀赋效应抓手）                                                  | ✅ 已落本地 | `415717f` |
> | ②   | `data/side_hustle_events.js` + 新 `data/side_hustle_consequences.js` 链式 followUp × 2（修复死代码 + 接入 scheduleChainEvent） | ✅ 已落本地 | `ad34443` |
> | ③   | `tools/monte_carlo_runner.js` 增量写盘治 OOM（localStorage 分片 / 内存聚合 API 重构）                                          | ✅ 已落本地 | `49ba233` |
> | ④   | `data/scenarios.js` + `createDefaultState` difficulty 浮动参数（休闲/标准/困难，病率倍率接入 illness.js）                      | ✅ 已落本地 | `da0832c` |
> | ⑤a  | `events_core.js::showEventModal` eventPenaltyMultiplier 接入（难度系数 8/8 全接完）                                            | ✅ 已落本地 | `0edacac` |
> | ⑤b  | `ui/career_dev.js::renderCareerOverview` Phase1→Phase2 过渡仪式（峰终定律·最后一峰）                                           | ✅ 已落本地 | `8682d40` |
> | ⑥   | `data/npcs.js` 5 NPC 加 `monthlyIncome` + `ui/social_tab.js` 社会比较对比行                                                    | ✅ 已推     | `ca14d76` |
> | ⑦   | `ui/career_dev.js::renderCareerOverview` 智能建议剧本专属优先级 hook（损失厌恶 + 全剧本适配）                                  | ✅ 已推     | `6621d54` |
>
> **铁律**：每 patch ≤20 行 / 单文件单 commit / MC 30 trials × 1000 天回归（仅 ②④⑤a 触发）
> **进度**：①②③④⑤a⑤b⑥⑦ 全部落地 — v3.1 七子迭代完成 ✅；当前 HEAD 已推送到 origin/main

**v3.3 创业门槛+MC AI**：① 创业启动资金各剧本降低50%（经典¥30k→¥15k）+ MC AI grinder/corporate 健康底线 → 5/6策略通过 MC 验证 ✅（commit `9f6dccf`）

**v3.4 约定式自动归类**：① 行动自动归类（43行动添加category字段）+ ② 技能↔工作双向关联（工作百科新增相似工作推荐）+ ③ 证书工资加成确认（16证书已声明salaryBonus）→ 3/3完成 ✅（commit `88d33d2`）

**v3.5 事件触发条件数据化 POC**：① 新建 `trigger_registry.js`（12个触发槽+9个条件模板+冷却管理）+ ② `stray_dog_rain` 事件迁移示范 + ③ pipeline 步骤集成 → 基础设施就绪，全量迁移待后续 ✅（commit `389129e`）

**v3.6 约定式闭环 + 事件数据化提速**：① 修证书双叠加 bug（删 20 条 if-else + 补全 medical_license/professional_title_cert 2 动态证书 → 18 本全覆盖）+ ② 修 wiki.js var 提升残留（删 `_wikiDetailSkill` bug 段 + 在 `_wikiDetailJob` 末尾重建「🔗 需要同样技能的其他工作」交叉查询）+ ③ 注册 restore 分类（action_sort.js CATEGORIES 插入 id:"restore"）+ ④ 事件触发架构统一（evaluateTriggers 已内置 minNeeds/maxNeeds/phase/weather 字段；stray_dog_rain 已走数据对象式；daily_pipeline day<4 与 minDay 对齐；trigger_registry.js 顶部加双轨统一注释）+ ⑤ pipeline 接入 after_work + daily_end 触发槽 + 3 个 after_work 事件 + cooldown NaN 修复 + mc_verify_v3.6.cjs 验证 → 4/4完成 ✅（commits `a2929ea`+`70fdc22`+`1194740`+`0e5ab02`，本地待推）

> **MC 回归用法（v3.1 ③ 后）**：
>
> ```
> for (var i = 0; i < 30; i++) mc.run(1000);
> mc.report();            // 聚合首末+资产区间
> mc.listRuns();          // 列出全部 run 元数据
> mc.exportAll();         // 流式导出（chunk 分片）
> ```

---

## 欢迎页"六条路"nowrap 铁律（2026-07-06）

> `index.html` 欢迎页 `🏪 经商大亨 · ⭐ 城市名人 · 🎓 技能大师 · 💰 投资天才 · 🏢 职场巅峰 · 💵 财务自由` 每条路必须包 `<span class="goal-item">`，CSS `.goal-item { white-space: nowrap; }` 禁止路内断行。
>
> **换行只能发生在路间 `·` 分隔符处**，绝不能把 "🏢" 和 "职场巅峰" 拆开。`word-break: keep-all` 不够（只防 CJK 内部断行，不防 icon 与文字之间），必须用 `nowrap` span。
>
> **电脑端容器宽度**：`.welcome-subtitle { max-width: 560px; }`（2026-07-06 从 400px 放宽）。6 条路总宽约 500px，400px 不够装 → 路间被迫换行。移动端 ≤768px media query 单独覆盖 `min(92vw, 520px)`，不受影响。commit `289858e`。

## 移动端 UI 顶栏结构（2026-07-03 更新）

> 手机端主区顶栏（`renderMainArea` 注入 `#main`）从上到下：
>
> 1. 时间槽 `renderTimeSlot`：📅 第N天 | ☀️ 时段 ⚡ 行动力
> 2. 位置+背包行 `renderLocationBar`：🎒X/Y · 🌃住所💡升级提示（升级提示与住所名紧贴右对齐）
> 3. 常驻状态条 `renderStatsStrip`：2行×5细色带，标签**两字**（体质/智力/敏捷/心智/魅力、饥饿/疲劳/卫生/心情/健康）
> 4. 人生目标 `renderGoalStrip`
> 5. 活跃新闻 `renderActiveNews`
> 6. Tab 内容
>
> **侧栏底部** `.sidebar-version-footer`：显示「🏙️ 城市浮生记 v1.0」（仅移动端，桌面端 header 已有品牌）。
> ~~`renderTitleBar`~~ 已删除（品牌移至侧栏底部，重复的露宿街头紧急提示删除）。
>
> 阶段提示文案：`daily_quest.js` 的 `_dynamicNextDesc(stage, state)` 按实际债务动态生成"站稳脚跟"阶段的下一阶段描述（有债→"还清债务，攒到¥5000"，无债→"攒下¥5000启动资金"）。

## 游戏项目代码地图（降本关键：AI 少读文件 = 省 token）

> 本游戏是一个中文文字模拟经营游戏（类"人生重开"风格），单页 HTML + 原生 JS + CSS，无框架无构建。

### 项目结构一览

```
src/
├── index.html          # 入口页面
├── css/style.css       # 全部样式 (969 行)
└── js/
    ├── main.js         # 【核心】主循环 + 游戏引擎 (3238 行)
    ├── core/
    │   ├── events.js   # 事件系统
    │   ├── random.js   # 随机数/RNG
    │   ├── save.js     # 存档/读档
    │   └── state.js    # 游戏状态字段定义
    ├── data/           # 【所有配置数据都在这里】
    │   ├── achievements.js  # 成就系统
    │   ├── corp.js         # 公司/企业数据
    │   ├── diseases.js     # 16种疾病5大类 (580 行)
    │   ├── goods.js        # 商品数据
    │   ├── ingredients.js  # 23种食材16个配方 (522 行)
    │   ├── items.js        # 装备/道具 (80 行)
    │   ├── jobs.js         # 工作定义 (319 行)
    │   ├── locations.js    # 地点定义
    │   ├── moral_events.js # 道德事件 + MORAL_CONSEQUENCES 链（40+ followUp 已挂）
    │   ├── news.js         # 新闻事件
    │   ├── npcs.js         # NPC 定义
    │   ├── scenarios.js    # ⑦剧本定义（待 v3.1 ④ 注入 difficulty 参数）
    │   ├── side_hustle_events.js # 副业随机事件（v3.1 ② 已修复加载 + 接链）
    │   ├── side_hustle_consequences.js # v3.1 ② 新增 2 条 followUp 链事件
    │   └── skills.js       # 技能定义
    ├── phase1/         # 打工阶段逻辑
    │   ├── carry.js    # 搬运系统
    │   ├── needs.js    # 需求系统
    │   ├── pricing.js  # 定价系统
    │   ├── trade.js    # 交易系统
    │   └── weather.js  # 天气系统
    ├── phase2/         # 公司阶段逻辑
    │   ├── corp_ops.js # 公司运营
    │   ├── investment.js  # 投资系统
    │   ├── perf.js     # 绩效系统
    │   ├── promo.js    # 晋升/营销
    │   ├── stock.js    # 股票系统
    │   └── team.js     # 团队管理
    └── ui/
        ├── render.js   # 【主要 UI 渲染】侧边栏+主界面 (2001 行)
        └── corp_ui.js  # 公司 UI
```

### 关键文件速查

| 你要做什么         | 改哪个文件                                            |
| ------------------ | ----------------------------------------------------- |
| 调整游戏数值/平衡  | `data/` 下对应的 js 文件（不要改 main.js）            |
| 新增 UI 元素       | `ui/render.js`                                        |
| 新玩法逻辑         | 新建 `phase1/` 或 `phase2/` 下文件，在 `main.js` 注册 |
| 新增疾病/食材/装备 | `data/` 对应文件 + `ui/render.js` 加展示              |
| 存档格式           | `core/save.js`                                        |

### 核心设计理念

1. **全中文 UI**：所有玩家可见文本只用中文，无任何英文
2. **状态驱动**：游戏状态在 `state.js` 定义，各系统读取/修改 state
3. **两阶段**：Phase1 = 打工生存 → Phase2 = 开公司当老板
4. **data 目录** 只有纯数据定义，不包含逻辑

---

## 内容扩充快捷指令

用户说 **"按 v2.1 提示词继续内容扩充"** =
Read `D:\Claude Code+DeepSeekV4\memory\content-expansion-v2.1.md` 并执行其中的 SOP（20职业上限/行业代表制/成套添加/交叉验证/分批commit）

---

## 🛠️ 开发工作流铁律（2026-07-03 确立，07-03 修订）

> **"本地先验再推"** — 调试时先在本地 F5 验证，确认功能正常后再 commit + push。

### 调试流程（强制）

```
改代码 → 本地浏览器 F5 看效果 → 不满意 → 改代码 → F5 ...
                                       ↓ 满意了
                              git add + commit + push
```

**禁止：每个小改动都 push。**

### 本地预览（任选其一）

```powershell
# 方法1：开发服务器（推荐，热重载）
cd city-life-story
npm run dev    # http://localhost:5173

# 方法2：构建后简易服务器
cd city-life-story
python build.py
python -m http.server 8080  # http://localhost:8080
```

### Commit 质量标准

| 好的 commit         | 坏的 commit     |
| ------------------- | --------------- |
| 一个完整功能点      | "wip: 改了一半" |
| 一个 bug 的完整修复 | "test: 试试看"  |
| 本地验证通过        | 无意义提交信息  |
| 描述清楚改了什么    | "asdfgh"        |

### 为什么这很重要

| 事件                        | 根因                              | 后果                           |
| --------------------------- | --------------------------------- | ------------------------------ |
| 2026-07-03 Netlify 站点禁用 | build credits 烧完（带宽只用 3%） | 站点全部下线                   |
| 元凶                        | 频繁 push（调试期每天 20-50 次）  | 300 分钟/月 build credits 耗尽 |

**教训：切到 GitHub Pages 后不再有 build credits 墙（GitHub Actions 每月 2000 分钟，你单次构建 ~21 秒），但保持"本地先验再推"习惯能让提交历史干净、问题定位快速。**

---

## Agent 分身策略

**任务复杂时主动开分身**：当任务涉及多文件修改、多步骤并行、或需要独立探索/验证时，Claude 自行判断使用 `Agent` 工具创建子代理（如 `general-purpose`、`Plan`、`Explore` 等），无需用户额外提醒。
