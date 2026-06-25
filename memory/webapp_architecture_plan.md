# 城市浮生记 v3.0+ Web App 目标架构方案

更新时间：2026-06-25

## 当前实施状态

第一阶段已按桥接式方案落地：Vite/TypeScript 工程已建立，`src/app/` 已包含 shell、typed data、bridge facade、save migration 和 health check；legacy 侧新增 `src/js/app_bridge/webapp_runtime_bridge.js`，并通过 `actions_extra.js` 注入“城市服务中心”，通过 `daily_pipeline.js` 注入城市服务次日反馈。正式可玩入口仍是 `src/index.html` / `dist/index.html`，新架构 shell 是并行开发与验证入口，不负责替代旧入口。

## 推荐技术栈

- 第一阶段采用 Vite + TypeScript + 原生 DOM，不引入 React、Phaser 或其他运行时框架。
- 理由：当前游戏是文字/面板型城市人生模拟，核心价值在状态、事件、文本、选择和经济反馈，不需要重型渲染引擎；React 可作为后续 UI 重构候选，但现在直接迁移会扩大风险并迫使重写大量 DOM UI。
- 保留 `python build.py` 作为正式单文件构建，新增 Vite 作为开发、类型检查、模块化演进和未来桌面/移动打包基础。
- 新依赖仅限开发工具：Vite、TypeScript。运行时继续零第三方依赖。

## 目标目录结构

```text
city-life-story/
  index.html                    # Vite 开发 shell，不替代旧入口
  package.json
  tsconfig.json
  vite.config.mjs
  src/
    index.html                  # 旧正式入口，继续被 build.py 使用
    app/
      main.ts                   # Vite app mount
      shell/
        appShell.ts
      core/
        gameBridge.ts           # 封装 window.StateManager / renderAll / showModal
        stateAccess.ts          # typed facade，不复制真实 state
        saveMigrations.ts       # 新 schema 版本与迁移表
        eventBus.ts             # 未来事件派发边界
      data/
        events/
        jobs/
        locations/
        items/
        diseases/
        legal/
        travel/
        lifeNodes/
        cityServices.ts         # 第一阶段验证用真实玩法数据
      ui/
        panels.ts
      debug/
        healthCheck.ts
      types/
        game.ts
    js/
      app_bridge/
        webapp_runtime_bridge.js # 旧游戏可加载的桥接脚本
```

## 分层边界

- 游戏逻辑层：只处理状态转移、条件判断、奖励/惩罚、每日 tick。不得直接操作 DOM。
- 数据层：保存配置化玩法数据，字段包含 `id/name/entry/requirements/cost/effects/feedback/tags`；后续事件、职业、地点、疾病、法律、旅行、人生节点都按同一思路沉淀。
- UI 层：负责挂载面板、按钮、弹窗和玩家反馈；旧 UI 继续使用 `showModal` / `renderAll`，新 UI 先在 Vite shell 中展示架构面板。
- 存档层：只读写可序列化状态；新迁移函数以 `APP_SAVE_SCHEMA_VERSION` 为入口，先在 bridge 中幂等补字段，不改旧 localStorage 键。
- 事件层：长期目标是把随机事件、链式后续、系统 tick 事件统一成可注册目录；第一阶段只新增 city service action pack 验证入口。
- 调试层：集中提供 health check、数据目录统计、bridge ready 状态和 legacy runtime 探针，不进入玩家存档。

## 旧框架删除评估

结论：第一阶段不删除 legacy 框架。

原因：

- `src/index.html`、`src/js/**` 和 `python build.py -> dist/index.html` 仍承载正式可玩游戏、存档读写、主 UI、行动系统、每日管线、百科注册和大量已验证内容。
- `src/app/` 目前是并行 Web App 架构壳和新增内容承载层，还没有完整替代开局、存档、多 Tab、经济、创业、社交、结局等主流程。
- 直接删除 legacy 会破坏项目文档中的强约束：正式入口、单文件构建、script 顺序和存档兼容。

处理方式：

- 保留 legacy 正式入口，禁止重排既有 script；只允许在末尾追加 bridge 或在明确位置加入小型 facade 调用。
- 后续若某个系统迁移完成，必须满足：新数据源可枚举、新 service 可测试、legacy 入口仍可触发、旧字段有迁移函数、构建与浏览器冒烟通过，才能删除对应旧模块。
- 生成产物 `dist/index.html` 不和源码功能混提；每次 `python build.py` 后单独确认差异只来自当前源码，再提交。

## 存档兼容策略

1. 不改 localStorage 键：继续使用 `city_life_story_slot_N`、`city_life_story_autosave`、`city_life_story_index`。
2. 不删除旧 `StateManager.importState()` 迁移：第一阶段新增 `ensureWebAppSaveMeta(state)`，只补充 `_webApp` 元数据和新增系统状态。
3. 新增 `APP_SAVE_SCHEMA_VERSION`，用于记录新架构字段迁移进度。
4. 迁移函数必须幂等：重复运行不改变已存在的玩家选择、现金、关系、物品。
5. 旧存档未包含新字段时，在新系统入口打开或读档后自动补齐。

## 数据配置化策略

- 所有新数据必须可枚举、可审计、可测试，不再只把文案写进 UI 函数。
- 第一阶段先建立目录和类型：`events`、`jobs`、`locations`、`items`、`diseases`、`legal`、`travel`、`lifeNodes`。
- 新内容采用小型 action pack 验证：一组城市服务事件同时覆盖医疗、法律、旅行/生活成本，并在旧游戏行动列表中可触发。
- 后续迁移现有数据时采用 copy-on-write：旧数据保持原样，新目录逐步接管新增内容和已稳定模块。

## 构建和验证策略

- 旧正式构建：`python build.py`，生成 `dist/index.html`。
- Vite 构建：`npm run build`，生成 `dist-webapp/`，不覆盖旧 `dist/`。
- Vite 构建路径：`vite.config.mjs` 使用 `base: "./"`；`src/app/shell/appShell.ts` 在 `dist-webapp/` 下用相对路径回指 `../src/index.html`，避免静态预览时资源或 legacy iframe 404。
- 类型检查：`npm run typecheck`。
- JS 语法检查：对 `src/js/**/*.js` 运行 `node --check`。
- 玩法验证：打开旧游戏，检查首页/开局/存档/至少一个城市行动/新增桥接入口；打开 Vite shell，检查架构面板和 health check。

## 分阶段迁移顺序

### 阶段 1：桥接式 Web App 化

- 新增 Vite/TS 工程文件和 `src/app`。
- 新增 bridge facade、save migration、typed data catalog。
- 在旧入口追加一个 bridge script，不重排既有 script。
- 在行动列表接入一个真实新系统入口，验证状态变化、消息反馈和存档元数据。
- 风险：新增 dev tool 链路与旧构建并行，可能造成命令混淆。
- 回滚：删除 `index.html`、`package.json`、`tsconfig.json`、`vite.config.ts`、`src/app/`、`src/js/app_bridge/`，移除旧入口追加 script 和行动注入。

### 阶段 2：稳定服务层

- 将 `StateManager` 访问、消息、AP、现金、flag、modal 封装成服务。
- 把新增系统全部通过服务读写状态。
- 风险：服务层如果过度抽象会遮蔽旧逻辑。
- 回滚：服务保持纯 facade，不迁移旧调用即可停用。

### 阶段 3：数据目录接管新增内容

- 新增事件、职业、地点、疾病、法律、旅行、人生节点默认进入 `src/app/data`。
- 编写数据审计脚本检查 id、入口、百科、daily pipeline 关联。
- 风险：TS 数据和 legacy 数据出现短期双轨。
- 回滚：bridge 仍可读 legacy JS 数据，TS 数据不参与正式构建。

### 阶段 4：UI 面板渐进组件化

- 先迁移独立面板：医疗、法律、旅行、生活服务、调试面板。
- 保留主布局和 Tab，不做大视觉重写。
- 风险：新旧 UI 样式不一致。
- 回滚：每个面板仍通过旧 `showModal` 或独立挂载点接入，可单独撤回。

### 阶段 5：正式入口切换评估

- 当 `src/app` 能直接加载核心状态、存档、数据和主要 UI 后，再评估是否让 Vite 产物成为主入口。
- 风险：单文件离线部署能力下降。
- 回滚：保留 `python build.py` 到新入口稳定后再退休。

## 第一阶段验收标准

- `src/index.html` 旧游戏仍能打开并进入核心流程。
- `npm run build` 可构建 Vite shell。
- 新增数据和 bridge action 至少让玩家触发 2-3 个真实状态变化。
- 存档状态出现 `_webApp.schemaVersion=2`，旧档不报错。
- `python build.py` 成功，`node --check` 通过新增/修改 JS。
- 文档记录已迁移/未迁移边界和下一阶段风险。
