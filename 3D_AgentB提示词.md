# 发给 Agent B 的提示词（直接复制下面整段）

---

你是《城市浮生记》3D 化项目的**材质与几何**负责人。有另一个 agent 正在同时改这个仓库，
你的分工是「材质与几何细节」，**不要碰渲染管线**（硬规则见下）。

## 项目背景

《城市浮生记》是一个人生模拟游戏。它的 3D 表现层在
`D:\Claude Code+DeepSeekV4\city-life-story\src\app\3d\`，用 **Three.js 0.186** 从零
**程序化生成**，**没有任何外部模型资产** —— 29 个地点（城中村、批发市场、图书馆、
公园、废品回收站等）全部由代码用 BoxGeometry / CylinderGeometry / PlaneGeometry
拼出来，配 Canvas 生成的贴图和程序化材质。

打包方式：`src/app/3d/` 是 ESM + three 依赖，用
`node scripts/build-3d-bundle.cjs` 打成 IIFE（挂 `window.Scene3D`），
产出 `src/js/scene3d.bundle.js`，再由 `python build.py` 内联进 `dist/app.js`。

**已完成、不要重做的部分**：IBL（`scene.environment`）、非金属 metalness 归 0、
夜间路灯点光源、roughness 分级、雾重做 —— 提交 `aed88a0b`。

## 你的任务（三项，全部出自 `3D_ART_SPEC.md`）

### 1. P1-1 程序化法线贴图 —— 收益最大的一项

现状：**完全没有法线贴图**，所有表面在光照下都是"平的"。
这是「看不出砖 / 水泥 / 瓷砖区别」的第二大原因（第一大是 roughness，已修）。

做法（纯 Canvas 运算，无外部资产）：
- 在 `materials.js` 里，为每种纹理**同时生成一张高度图** ——
  把砖缝、瓷砖缝、裂缝画成灰度（缝 = 暗、砖面 = 亮）
- 用 Sobel 差分把高度图转成法线贴图
  （`nx = -dH/dx`、`ny = -dH/dy`、`nz = 1`，归一化后映射到 [0,1] 存成 RGB）
- 结果设为材质的 `normalMap`

`normalScale` 建议值（依据报告 §6.2）：

| 材质 | normalScale |
|---|---|
| 砖墙 | 1.0~1.2 |
| 瓷砖外墙 | 1.0 |
| 水泥 / 混凝土 | 0.4~0.6 |
| 金属板 | 0.7 |
| 石材 | 0.8 |

★ **必须注意**：法线贴图的 `colorSpace` 要保持**默认的 `NoColorSpace`**。
设成 `SRGBColorSpace` 会扭曲法线方向 —— 这个错误很隐蔽：不报错，
只是光照看起来"怪怪的"，很难定位。

### 2. P3-1 纹理分辨率 + tile 密度

- 外墙类（瓷砖 / 砖 / 幕墙）分辨率 **512 → 1024²**
- tile 对应的实际米数从 **4.5m 缩到 2.0~2.5m** ——
  现在 tile 太大，一块砖在屏幕上占的面积过大，看起来像"贴纸"而不是砖墙

★ **性能陷阱**：`materials.js:25` 附近的 `grain()` 是**逐像素循环**，
1024² 会让它慢 4 倍以上。改法：用一张 **64×64 的小噪点 canvas**，
配 `globalAlpha` + `drawImage` 放大叠上去，成本几乎为零。

★ 水泥这类**没有结构**的噪声材质保持 512 即可，不必提分辨率。

### 3. P3-3 几何倒角 —— "建筑边缘硬"的直接解法

现状：所有建筑都是纯 90° 直角，边缘在光照下是一条死硬的线。
真实建筑的边角总有一点倒角或压边，会在边缘形成一道**细高光**。

做法：给建筑外角、窗框、门框、道具边加 **2~3cm 的细长条**
（Box 或 Cylinder 都行）作为"压边"，材质用同色但略亮或略糙的一档。

注意：`kit.js` 里的建筑是参数化的（`lowRise` / `slabBlock` / `tower` / `shopUnit` …），
倒角要加在这些函数**内部**，不是在调用处。

## 硬规则（违反会直接冲突）

1. **你只能改这三个文件**：
   - `src/app/3d/materials.js`
   - `src/app/3d/palette.js`
   - `src/app/3d/kit.js`

   **绝对不要改 `src/app/3d/bridge.js`** —— 另一个 agent 正在里面做后处理链。
   需要渲染侧配合（改光照、调 `envMapIntensity`、加后处理）时，
   在提交信息里写清楚，由对方处理。

2. `scripts/verify-3d-shell.cjs` 可以加断言，但**只追加你自己的段落**，
   不要重排或修改已有断言。

3. **提交前必须重建产物**（否则 git 钩子会拦）：
   ```bash
   node scripts/build-3d-bundle.cjs
   python build.py
   ```
   `git push` 被拒（对方先推了）时，**不要手工合并产物冲突**：
   ```bash
   git pull --rebase
   node scripts/build-3d-bundle.cjs && python build.py
   git add src/js/scene3d.bundle.js dist/
   git rebase --continue
   ```

## 验证要求（说"完成"之前必须有证据）

1. 跑 `node scripts/verify-3d-shell.cjs` —— 当前 **18 项**，你做完不能少于这个数
2. **必须出截图对比**（脚本会自动存到 `dev/_3dtest/shots-shell/`）——
   参数改了但没截图，等于没验证
3. 如果加了新断言（比如"法线贴图已挂载到 N 个材质"），一并加进去

## 常用命令

```bash
# 单独重建 3D 包（快，只打 src/app/3d/）
node scripts/build-3d-bundle.cjs

# 打到指定路径（给验证页用）
node scripts/build-3d-bundle.cjs --out dev/_3dtest/bundle-probe.js

# 跑外壳验证（自起服务 + Edge，约 40 秒，会出截图）
node scripts/verify-3d-shell.cjs

# 本地预览（三入口首页）
node scripts/serve-dev.cjs        # → http://127.0.0.1:8977/
#   短入口：/s = 3D 外壳 · /g = 地点画廊 · /d = 正式游戏

# 完整门禁
npm test
```

## 这个项目已知的坑（都是真实踩过的，别再踩）

1. **静默失效是常态**。典型例子：路灯的生成代码写死在 `if (kind === 'avenue')`
   分支里，而城中村是 `lane` 布局 —— 于是城中村从来没有路灯，
   而逐行看代码**全都对**。症状是"灯不亮"，很容易被误判成"灯太弱"而去调参数。
   → **加可观测读数**（数量、计数）比反复调参数有效得多。

2. **别用 `|| 0` 兜底新字段**：玩家真跌到 0 时，`|| 默认值` 会让他凭空回升。
   正确写法是 `== null ? 默认值 : 值`。

3. **`git diff` 会报"整文件变更"，`git diff -w` 才是真实改动量**（行尾符问题）。

4. 改 `src/` 后不重建就提交，会被 `.githooks` 拦（它比较 dist 与 src 的 mtime）。

5. 临时文件放 `.tmp-probe/`（已 gitignore）。**不要 `--amend` / `--force`。**

## 交付

- 提交信息用中文，说明「问题—根因—修复—验证」
- 长提交信息写到 `.tmp-probe/commitXX.txt` 再 `git commit -F`
  （直接 heredoc 会被 shell 截断）
- 完成后汇报：改了哪三个文件、截图在哪、验证跑了几项
