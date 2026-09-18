# 《城市浮生记》3D 化 —— 美术风格规格（调研 + 可执行清单）

> 调研对象：《大多数》(Nobody: The Turnaround)、inZOI
> 约束：Three.js 0.186 / 纯程序化几何 / 零外部模型资产
> 所有标注【查证】的条目附来源；标注【建议】的数值是工程推导，不是引用。
> 报告中同时给出了本项目 `src/app/3d/` 的实测体检结论（含行号）。

---

## 0. 先说结论（TL;DR）

1. **"偏灰暗、材质没区别"的第一号技术原因不是光照参数，是缺 IBL。**
   全项目 `grep` 不到 `scene.environment` / `envMap` / `PMREM`，但 palette 里有 10 处 `metalness` 0.18–0.6。
   没有环境贴图时，`metalness > 0` 会**削掉漫反射、换成一个无处可反射的镜面**——表面直接变暗变死。
   加一行 `scene.environment` 的收益大于后面所有调参的总和。
2. **"夜间过暗"是把曝光当成了亮度开关。** 全局降曝光 = 全场等比变暗 = 平。
   夜间应该是「主光极低 + 局部人工光源制造高对比」，不是「整体调暗」。
3. **"看不出砖/水泥/瓷砖"是因为 roughness 全被写成了 0.94–0.97。**
   白瓷砖是**上釉**的，真实 roughness ≈ 0.35–0.55。现在 0.95 等于把瓷砖做成了水泥。
   再加上没有法线贴图，三种材质的 BRDF 响应完全一样 → 必然分不出来。
4. **横穿画面的黑色粗线：三个候选，按概率排序见 §5。**
   我读代码后最可疑的是 `K.wire()` 的电线（`world.js:568/577/607`）——材质 `0x24262a` 近乎纯黑、
   横跨整条街宽、每 9m 一根，在没有 IBL 的情况下渲染出来就是黑线。
   附带发现一个确认的静默失效 bug：`P.common.trim` 不存在（见 §5.4）。
5. **inZOI 的写实靠 Nanite + Lumen + Virtual Shadow Maps + MetaHuman + 后期链，几乎全部不可复刻。**
   但其中**可复刻的部分正好是最重要的部分**：Lumen 的物理本质是 IBL + GI + 正确的材质响应，
   这三件事在 Three.js 里用 `PMREM + MeshStandardMaterial + GTAOPass` 能做出来七成。

---

## 1. 《大多数》美术与技术【查证】

### 1.1 引擎与团队
| 项 | 事实 | 来源 |
|---|---|---|
| 引擎 | **Unity Engine + UnityIL2CPP SDK**（SteamDB 检测到技术标签；Windows 产物 `Nobody.exe` + `Nobody_Data/`，macOS `Nobody.app`，含 Apple Silicon 原生） | https://steamdb.info/app/1810580/technologies/ |
| 团队规模 | **不到 10 人**（制作人"杂草"自述；工作室名 U.Ground / 有光游戏） | https://www.3dmgame.com/original/3743476.html |
| 开发周期 | 立项到"基础功能完备的 Demo"约一年多 | 同上 |
| 制作人背景 | 前商业游戏制作人，"跟导量卖量、刷榜氪金打了 10 多年交道" | 同上 |
| 发行 | 2022-11-16 EA 上线，国区简体中文评测"褒贬不一"(7744 篇 / 56% 好评) | https://store.steampowered.com/app/1810580/ |

### 1.2 美术怎么做的（可查证的部分）
- 制作人明确说：团队**做过实地考察**，"游戏的地图构成，参考了不少的实景元素"。参考书目是记录三和青年生存状态的社会学著作《岂不怀归》，工作室买了 5 本。【查证】3DM 采访
- 主线故事是编撰的，**周边内容"基本上来自新闻媒体或纪实频道的正向报道"**——即内容层是"纪实转译"，不是凭空设计。【查证】https://www.gamersky.com/news/202112/1443670.shtml
- 开发日志里提到场景建设按"玩法需求"批量建：**菜市场、4S 店、批发城**等，通过公交/买车到达；**夜间场景"重新布置了灯光"，夜晚关一些店铺、开一些摊位**。【查证】https://www.gamersky.com/news/202206/1487914.shtml
- 视角是**上帝视角**（俯视/斜俯视），制作人自述定位是"主要由数值玩法驱动的模拟养成类游戏"。【查证】3DM 采访

### 1.3 关于"它的贴图其实有真实感"这个观察 —— 我的判断
用户的观察方向是对的，但归因要修正：
- 上帝视角 = **相机距离远、单像素覆盖面积大** → 材质细节的"每米像素数"需求被大幅降低。
  这是低模 + 贴图能读作写实的关键前提，**不是"贴图好"单独造成的**。
- 可查证的**是**：它是 Unity 项目、地图参考实景、夜间重新布灯、场景按玩法批量建。
- **未能查证**：贴图来源（是否实拍/扫描）、贴图分辨率、是否外包美术、是否有专门的 TA 岗位。
  官方从未公开美术管线，我也没有找到任何第三方技术拆解。**不要把它当成"贴图流"的证据来引用。**

### 1.4 关于"交互对象只是一段动画" —— 未能查证
用户的原话是"有交互的共享单车和汽车也只是有一段动画就可以了，同理，其他的交互也只是动画"。
- 我查到的只有**玩法层**信息：摆摊要进货/选品/出摊（游侠、贴吧攻略）；载具可以坐公交、后期买车；有卖唱小哥支线。
- **未找到任何关于实现方式的官方说明或技术拆解。**
- 所以：**这句话既无法证实，也无法证伪。不要写进设计文档当依据。**
- 但可以给一个不依赖该说法的工程判断（见 §8 第 10 条）：在本项目里，**交互对象用"少量几何 + 一段 2–4 秒的变换动画 + 一个状态机"是完全够用的**，
  因为上帝视角下玩家对动画精度的容忍度远高于第一人称。这是视角带来的红利，不需要引用《大多数》来背书。

### 1.5 色彩调性 / 光照 / 场景密度（可观察，非官方数据）
- 低饱和、偏暖灰、脏、密度高——这与本项目 `palette.js` 里 tier1「贫困区：脏、旧、暖灰、密度高」的定位方向一致。
- 场景密度靠"按玩法批量铺地点"实现（菜市场/4S 店/批发城/夜市摊位），**密度来自地点数量而非单体细节量**。
  这对本项目是可直接借鉴的：29 个地点比 3 个精雕地点更接近它的观感。

---

## 2. inZOI 写实技术【查证】

### 2.1 引擎与技术栈
来源：https://thegameswiki.com/inzoi/wiki/unreal-engine-5

| 技术 | 说明（原文要点） |
|---|---|
| UE 版本 | 上线用 **UE 5.4**，2026 年迁移到 **UE 5.6**（3 月 beta，4 月正式） |
| **Nanite** | 虚拟化几何，像素级流式加载几何，消除 LOD pop-in；用于 Dowon / Bliss Bay 的密集城市与室内物件 |
| **Lumen** | 实时 GI + 反射。软件光追（Screen Tracing + Mesh Distance Fields + Global Distance Fields）+ 硬件光追两档 |
| **Virtual Shadow Maps** | 与 Nanite 配合的高分辨率阴影系统，"contact hardened shadows" |
| **MetaHuman** | 角色写实度的基础；UE5.6 起编辑器内置，支持体型生成 + 自动适配的 Outfit 系统 |
| World Partition | 大世界分块流式加载，无载入切换 |
| Chaos Physics | 物理、破坏、布娃娃 |
| PCG | 植被/地形细节程序化生成；5.6 起 GPU 加速 |

### 2.2 Lumen 的工程细节（这是"写实"的真正来源）
来源：https://pcoptimizedsettings.com/inzoi-optimization-guide-best-graphics-settings-for-pc/

- 默认走**软件光追**：Screen Tracing（屏幕空间，用于物体边界与缝隙，"作为更高质量 SSAO 的替代品"）+ Mesh Distance Fields（离线算的 3D 表示，ray marching 跳过空白）+ Global Distance Fields（合并所有 MDF 的抽象体积，**会被缓存**）。
- **Surface Cache 是 Lumen 的骨干**：存材质与光照数据（"cards"），**每网格最多 12 张 card**。
- 间接光用场景光照探针，**每 4×4 tile 一个**。
- Final Gather 走 Screen Space Radiance Cache，屏幕探针**1/16 分辨率**；World Radiance Cache **1/256 分辨率**用于远景。
- 光追用的是 **Hardware Lumen**：用 BVH 替代距离场、每帧重建，但作用在 **probes / surface cache texels / tiles** 上而不是像素上；还有 **Far Field traces**，把 GI 与反射覆盖延伸到**距相机 1km**。
- GI 档位：**Medium/Low 会回退成"距离场 AO（大尺度）+ SSAO（小尺度）的混合——无实际 GI**；Very Low 全禁。Ultra 比最低档慢约 20%，High 慢约 11%。
- 反射：屏幕空间做屏内反射，距离场做屏外反射，**屏外反射"often producing noisy reflections, inaccurate or missing detail"**。Ultra 用 MDF，High 回退到 GDF 后"大幅降低细节"。
- 阴影：**Ultra 与 High 表现与性能大致相同（约 15% 开销）**；Medium 降半影质量与 LOD（约 10%）；Low 换成块状代理（约 8%）。
- 后处理：motion blur、DOF、lens flare、chromatic aberration 等，"**doesn't notably impact performance or visuals**"。
- Shader Quality 控制的具体项：**parallax mapping、normal maps、blend、tessellation、皮肤/头发的 subsurface scattering**——总评"性能和视觉影响 subtle"。
- 上采样：仅 DLSS（3.5，可升 4），另有第二道时间滤波 AA；FSR 3 需改 `GameUserSettings.ini`。帧生成在 4K 下可带来 60% 提升。
- **VRAM：4K 最高画质含光追最多用 10 GB**；开 Smart Zoi 再加 2–4 GB，峰值 12.1 GB。

### 2.3 动态时间 / 天气的视觉表现
来源：https://thegameswiki.com/inzoi/wiki/weather

- **云量直接驱动环境光强度**："Reduces ambient light intensity and casts the environment in muted tones"；"heavier cloud cover darkens the environment more significantly"。
  Edit City 的云量滑块："Adjusts cloud density and ambient light level. Higher intensities darken the environment significantly."
- 雨：强度越高 → 屏幕雨滴越大越多；**中雨以上"puddles form on streets and paths"，街道"wet and reflective"**；Zoi 走过水洼有水花粒子。
- 雪：**有持续堆积**（地面/屋顶/车/户外家具），堆积量随降雪时长与强度增加，**"visually persistent until the season changes"**。
- 低温：窗户结霜、水面结冰（按温度而非降雪触发）；Zoi 户外**呼出白气**。
- 季节：**7 个游戏日一季，28 天一轮**；春樱花、秋橙红、冬落叶；Bliss Bay"seasons change the lighting"。
- 摄影向的光照描述（可作为目标参考）：
  - Overcast = "Soft, even lighting without harsh shadows... Muted color palette creates a moody atmosphere."
  - Sunny = "Bright, saturated colors with **strong directional shadows**"；**黄金时段（清晨/傍晚）配晴天是最受欢迎的截图**。
  - 大雨 + 夜间灯光 = 电影感截图。
- **未能查证**：该 Wiki 的天气页**明确没有覆盖昼夜循环的光照过渡**（仅出现 "golden hour" 与 "night-time lighting" 各一处）。
  所以"inZOI 的昼夜光照怎么做"这个问题，官方与 Wiki 层面都查不到，不要编。

---

## 3. inZOI → Three.js 可复刻性对照

| inZOI 手段 | 物理本质 | Three.js 能否复刻 | 怎么做 |
|---|---|---|---|
| Lumen GI | 环境光有方向、会互相弹 | **部分（七成）** | `PMREMGenerator` 生成 `scene.environment` + `GTAOPass` 补接触遮蔽。没有多次弹射，但"环境有方向"这一条最关键的性质能拿到 |
| Surface Cache / probes | 用探针代替逐像素 GI | **可以** | 手工在场景里放"光照探针"式参数：把场景分成几个区域，每个区域用不同的 `scene.environment` 强度或额外的 `HemisphereLight` 覆盖 |
| Lumen 反射 | 材质表面反射环境 | **可以** | `envMap` + `envMapIntensity`。**湿地面 + 夜间灯光反射是性价比最高的一个效果** |
| Virtual Shadow Maps | 高分辨率接触阴影 | **部分** | `PCFSoftShadowMap` + `shadow.radius` 2–4 + **让 shadow camera 跟随玩家**（关键） |
| Nanite | 微多边形几何 | **不需要** | 程序化几何本来面数就低；Nanite 解决的是 LOD pop-in，本项目 29 个独立场景根本不会 pop-in |
| MetaHuman | 扫描级角色 | **不能** | 角色就是胶囊体 + 方块，靠**尺度正确 + 接触阴影 + 简单布料色块**撑住，不要试图做脸 |
| PCG 植被 | 程序化撒点 | **可以** | 现有 `world.js` 的撒点逻辑已经是 PCG，缺的是"尺度与密度分布"的真实感（见 §8 第 6 条） |
| Shader Quality 里的 parallax / normal / tessellation / SSS | 表面细节 | **normal 可复刻** | 程序化法线贴图（Sobel）；parallax 和 tessellation 在程序化几何上收益低，跳过 |
| 天气：湿地面 / 积水 / 积雪 / 结霜 / 呼白气 | 状态叠加在材质上 | **可以** | 按天气状态切换 `roughness`（干 0.9 → 湿 0.3）+ `envMapIntensity`（1.0 → 1.8）；积雪用材质 `map` 混合白色 |
| 云量驱动环境光 | 环境光强度与色温联动 | **可以，且便宜** | 云量作为参数，同时驱动 `hemi.intensity`、`scene.environment` 的 PMREM 亮度、`fog.color` 与天空色 |
| 后期链（motion blur / DOF / CA / lens flare） | 镜头缺陷 | **部分** | Three.js 无内置 DOF/CA，可用 `UnrealBloomPass` + 自写 `ShaderPass`。**暗角 + 轻微色散 + 噪点**是最划算的三个 |
| DLSS / 帧生成 | 性能 | 不能（WebGL） | 降 `pixelRatio` 到 1.5、GTAO 半分辨率 |

---

## 4. 本项目实测体检（`src/app/3d/`）

| # | 发现 | 位置 | 影响 |
|---|---|---|---|
| 1 | **完全没有 IBL**：全目录无 `scene.environment` / `envMap` / `PMREM` | `bridge.js` 场景构建段 | 所有 `metalness > 0` 的材质失去反射，直接变暗。**"偏灰暗"的第一号原因** |
| 2 | **metalness 用得太高**：`metal 0.55`、`metalLight 0.5`、`curtain 0.4`、`curtainWall 0.42/0.4`、`glassPane 0.34`、`panel 0.28`、`窗棂 0.6`、`glass 0.25`、`accent(tier3) 0.25` | `palette.js:50/52/66/67/75/76/77/78/79/98`、`materials.js:173/197` | 与 #1 叠加 = 画面变灰变暗的主因 |
| 3 | **零后处理**：无 `EffectComposer` / `Bloom` / `AO` / `OutputPass` | 全目录 | 没有 AO、没有夜间灯光辉光、没有镜头特征 |
| 4 | **瓷砖外墙 roughness 0.94–0.95**（应为 0.35–0.55） | `palette.js:34/35/42/45` | "看不出瓷砖和水泥的区别"的直接原因 |
| 5 | **无任何法线贴图**：`materials.js` 只生成 albedo（`CanvasTexture` → `map`），无 `normalMap` | `materials.js` 全部 | 三种墙面的 BRDF 响应完全相同，肉眼必然分不出 |
| 6 | **纹理分辨率 256²，tile = 4.5m** | `materials.js:8`、`world.js:78` | 256px / 4.5m ≈ 1.7cm/px。砖缝（砖高 6cm）只有 3.5 像素，糊掉 |
| 7 | **所有 canvas 纹理被无脑设成 sRGB** | `materials.js:18`（`toTexture` 内） | 一旦开始加法线/粗糙度贴图，**必须**分开，否则法线会被 sRGB 曲线扭曲 |
| 8 | **雾密度 0.0155 过浓** | `bridge.js:34` | e^(−0.0155×100) = 0.21 → 100m 外只剩 21%，190m 场地在 80m 外全糊，远景层次被自己废掉 |
| 9 | **夜间环境光偏高、主光偏低**：夜间 `hemi 0.70 / amb 0.45 / sun 0.30 / exposure 0.90` | `bridge.js:55-57` | 用"全局降曝光"换暗 = 全平等比变暗 = 平。见 §6.3 |
| 10 | **阴影 frustum 固定 ±40m**，`streetLen` 最长 110m、地面 190m | `bridge.js:36`、`world.js:90/97` | 出 frustum 的建筑没阴影；且阴影贴图分辨率被浪费在固定区域 |
| 11 | 相机 `near 0.1 / far 400` | `bridge.js:157` | 深度精度过激（见 §5.3） |
| 12 | **确认的静默失效 bug**：`curb()` 写的是 `P.common.trim \|\| P.common.metalLight`，但 `P.common` 里**没有 `trim` 这个键**（`trim` 只存在于 `P.tiers[t].trim`） | `kit.js:1207` vs `palette.js:62-85` | `curb` 永远静默回退到 `metalLight`（metalness 0.5）。tier1 本该是暖灰 `0x9a9186` 的路缘石，实际全是冷灰金属。**这是"整体偏灰"的一个具体来源** |

---

## 5. 「横穿画面的黑色粗线」定位

我读了相关代码，按概率排序给出三个候选 + 一个 5 分钟定位法。**我没有看到实际画面，所以这是排序假设，不是结论。**

### 5.1 候选一（概率最高）：`K.wire()` 的电线
- `kit.js:732-738`：`TubeGeometry(curve, 20, 0.028, 5)` + `MeshStandardMaterial({ color: 0x24262a, roughness: 0.95 })`。
  `0x24262a` 是近乎纯黑；`metalness` 默认 0 → 纯漫反射；没有 IBL 补光 → 渲染结果就是纯黑。
- 调用点：
  - `world.js:606-607`（夜市串灯）：`a = (−half−0.3, 5.2, z)` → `b = (half+0.3, 5.2, z+…)`，**横跨整条街宽，高度 5.2m，每 9m 一根**。
  - `world.js:568-570`（电线杆飞线）：同侧杆间连线，y = 7.3 / 6.6，沿街方向。
  - `world.js:577-579`（跨街飞线）：两侧杆之间，y = 6.2–7.4。
- **为什么看起来是"横穿画面的粗线"**：上帝视角 pitch ≈ 0.76 rad（≈43.5°）俯视，一根横跨街宽、离地 5–7m 的水平线，在屏幕上投影出来就是一条**接近水平的黑线**；
  半径 0.028m（直径 5.6cm）在 5–10m 距离下约 7–14 像素 → 符合"粗线"的描述。
- **验证方法**：在控制台把所有 `K.wire()` 产生的 mesh 隐藏（或临时给 `wire()` 的材质换成 `MeshBasicMaterial({ color: 0xff0000 })`），看黑线是否变红/消失。
- **顺带说明**：这些 wire **没有 `castShadow`**，所以不是阴影造成的。

### 5.2 候选二：NaN / 退化顶点导致的全屏黑三角
这是"一条横穿画面的黑线"最经典的技术成因：**任何一个顶点坐标是 NaN 或极大值，都会产生一个退化三角形，光栅化后就是一道贯穿屏幕的黑色色带。**
- 风险点：`wire()` 用 `CatmullRomCurve3([a, mid, b])`。若 `a` 与 `b` 重合或 `mid` 退化，TubeGeometry 的 Frenet 帧会除零 → NaN 法线/位置。
- 风险点：`mergeStatics()`（`merge.js:95`）用 `mergeGeometries(geos, false)` 批量合并。**NaN 会被原样合并进去**，而且合并后你再也看不到是哪个物体出的问题——这会让排查难度暴涨。
- **验证方法**：遍历所有 mesh，检查 `geometry.attributes.position.array` 里是否存在 `!Number.isFinite(v)`；同时检查 `geometry.boundingSphere.radius` 是否为 `Infinity` 或 `NaN`。命中即定位。
- **建议的加固**：`mergeStatics()` 在 `normalize()` 后加一道 NaN 过滤（丢弃含非有限数的几何，并打日志）。

### 5.3 候选三：共面平面栈的深度冲突
`world.js` / `kit.js` 里有一整叠共面平面，y 值间隔只有 2–16mm：
`ground 0`（190m）→ `road 0.012` → `court 0.014` → `patch 0.016` → `lawn 0.018` → `sidewalk 0.02` → `crosswalk 0.028`。
配合 `camera near = 0.1 / far = 400`：
24 位深度缓冲下，精度约为 `z² / (near × 2²⁴)`——z = 100m 时约 6mm，z = 150m 时约 13.4mm。
**即 130m 以外，12mm 的路面/地面间隔已经小于深度精度 → 深色沥青与浅色地面开始 z-fighting**，表现为沿路面方向的一条**明暗交替的带状区域**。
- **修法**：`near` 提到 **0.5**（精度提升 5 倍），并把共面层的 y 间隔统一拉到 **≥ 50mm**（或给下层平面用 `polygonOffset`）。

### 5.4 附带发现（与本问题无关但必须修）
`kit.js:1207` 的 `P.common.trim || P.common.metalLight` —— `P.common` 里没有 `trim`，永远走 fallback。
这类"读的全局名在运行时不存在"的静默失效，本目录里可能不止一处，建议整体扫一遍 `P.common.*` 的引用与 `palette.js` 的键集合做差集。

### 5.5 五分钟定位法（通用）
1. 在 `scene.traverse` 里把每个 mesh 的材质临时替换成 `MeshBasicMaterial({ color: 按索引生成的纯色, depthTest: false })`，截图 → 黑线变成哪个纯色，就知道是哪一桶材质。
2. 已知材质桶后，逐个隐藏该桶的 mesh（二分）→ 锁定具体物体。
3. 若第 1 步发现"黑线没有任何颜色"（即不受材质替换影响），那它**不是几何体**，去查 canvas/CSS 层或 `depthTest`/`depthWrite` 相关的透明排序问题。

---

## 6. 可执行清单（按性价比排序）

性价比 = 视觉收益 ÷ 改动成本。**P0 三项做完，画面的改善会超过其余所有项的总和。**

### P0-1　加 IBL（环境贴图）—— 半天工作量，收益最大
- 做法（纯代码，无外部资产）：用 `PMREMGenerator` + `RoomEnvironment`（`three/addons/environments/RoomEnvironment.js`，官方 addon，内部用几何体和光源搭了一个房间，零贴图）；
  或者自己搭一个"天空场景"（大球 + 渐变 + 一个太阳盘）再 `fromScene` 生成 PMREM——后者更贴合户外城市，且能跟时段联动。
- 然后 `scene.environment = envMap`。所有 `MeshStandardMaterial` 立刻获得方向性环境光与反射。
- **时段联动**：换时段时重新生成 PMREM（或用 `scene.environmentIntensity` 调节强度，成本更低）。
- 参考：https://threejs.org.cn/docs/pages/RoomEnvironment.html 、https://threejs.org.cn/docs/pages/PMREMGenerator.html

### P0-2　把非金属的 metalness 归 0
- 现有 `metal 0.55 / metalLight 0.5 / glassPane 0.34 / curtain 0.4 / panel 0.28 / glass 0.25` → **全部改 0**（有 IBL 后也不要给非金属金属度）。
- 只保留真正的金属：灯杆、栏杆、卷帘门、车体 → `metalness 0.75–1.0` + `roughness 0.35–0.6`。
- 参考依据：three.js 官方文档 `metalness` 默认 0、"Non-metallic materials such as wood or stone use 0.0, metallic use 1.0, **with nothing (usually) in between**"。

### P0-3　夜间重做：从"降曝光"改成"低主光 + 局部光源 + 自发光"
见 §6.3 的数值表。

### P1-1　给所有材质补程序化法线贴图
- 在 `materials.js` 里，为每种纹理同时生成一张**高度图**（灰度的砖缝/瓷砖缝/裂缝），再用 Sobel 差分转成法线（纯 Canvas 运算，无外部资产）。
- `normalScale` 建议 **0.6–1.2**（砖/瓷砖 1.0，水泥 0.5，金属板 0.7）。
- **法线贴图的 `colorSpace` 必须是 `NoColorSpace`**（默认值），设成 sRGB 会扭曲法线。
- 参考：three.js 官方材质文档明确 `roughnessMap` 用 G 通道、`metalnessMap` 用 B 通道、`aoMap` 用 R 通道且需要第二套 UV。

### P1-2　修 roughness（让瓷砖、砖、水泥在 BRDF 上真正区分开）
见 §6.2 数值表。这是"看不出砖/水泥/瓷砖区别"的直接解法。

### P1-3　加 GTAOPass
- `three/addons/postprocessing/GTAOPass.js`（官方 addon）。
- 文档明确："`GTAOPass` provides better quality than `SSAOPass` but is also more expensive."
- 构造：`new GTAOPass(scene, camera, width, height, parameters, aoParameters, pdParameters)`，`width/height` 默认 512 → **传半分辨率即可大幅降本**。
- `output = GTAOPass.OUTPUT.Denoise`（含泊松降噪）；`blendIntensity` 默认 1。
- 兜底方案（若性能不够）：贴图内置 AO + 顶点色假 AO + 道具底部接触暗贴片（见 §8 第 3 条），能拿到约六成收益、零性能成本。

### P2-1　加 UnrealBloomPass（夜间灯光辉光）
- `strength 0.25–0.45 / radius 0.4 / threshold 0.85`（阈值要高，否则白天整个画面发灰）。
- 只在夜间时段启用，白天 `enabled = false`。

### P2-2　修雾
- 密度 0.0155 → **白天 0.006–0.009 / 夜间 0.010–0.013**。
- **雾色必须等于天空地平线色**（大气透视原理）。现在夜间 `fog 0x393f44` 太暗，远处会"变黑"而不是"变淡"。

### P2-3　阴影跟随 + 软化
- `sun.position` 与 `sun.target.position` 每帧跟随玩家（保持 ±40m frustum 跟着人走）→ 阴影密度翻倍且恒定。
- `shadow.radius = 2–4`（官方文档：默认 1，`PCFSoftShadowMap` 或 `VSMShadowMap` 下生效，2–5 是自然柔和的区间；过高会漏光/条带）。
- `mapSize` 2048 保持；若加了跟随，可考虑 4096。

### P2-4　相机与深度
- `near 0.1 → 0.5`，`far 400 → 250`。
- 共面层 y 间隔统一到 ≥ 50mm，或下层用 `polygonOffset`。

### P3-1　提高纹理分辨率 + 缩小 tile
- 外墙类（瓷砖/砖/幕墙）提到 **1024²**，tile 从 4.5m 缩到 **2.0–2.5m**。
- 性能提示：`materials.js:25` 的 `grain()` 是逐像素循环，1024² 会明显变慢。
  改法：用一张 64×64 的小噪点 canvas，`globalAlpha` + `drawImage` 放大叠上去，成本几乎为零。
- 噪声类材质（水泥）保持 512 即可，它本来就没有结构。

### P3-2　加镜头缺陷后处理
- 暗角 3–8%、轻微色散 0.5px、噪点 1–2%。用自写 `ShaderPass`，一次全屏 pass。

### P3-3　几何倒角（打破 90° 硬边）
- 建筑外角、窗框、门框、道具边 → 加 2–3cm 的细长条（Box 或 Cylinder）作为"压边"。
- 这是"建筑边缘硬"的直接解法，原理见 §8 第 2 条。

---

## 6.1 光照数值表（可直接抄）

### 白天（上午 / 下午）
| 参数 | 现值 | 建议值 | 理由 |
|---|---|---|---|
| `exposure` | 1.30 | **1.05–1.15** | 加了 IBL 后整体亮度上升，必须回调，否则过曝 |
| `sun.intensity` | 2.20 | **2.4–2.8** | 主光要"敢亮"，阴影才成立 |
| `hemi.intensity` | 1.4 | **0.55–0.75** | **补光职责从 hemi 转移到 IBL**。无方向的平光是立体感的头号杀手 |
| `hemi.sky / ground` | 0x7d8d96 / 0x42443c | **0x9db4c8 / 0x5a5346** | 天空冷、地面暖（反射地面光） |
| `ambient.intensity` | 0.85 | **0.10–0.20** | AmbientLight 是纯平光，几乎全删。它现在正在冲掉阴影 |
| `ambient.color` | 0x515861 | 0x3a4450 | 保留一点点冷色补光 |
| `fog.density` | 0.0155 | **0.006–0.009** | 见 P2-2 |
| `fog.color` | 0x555c55 | **= 天空地平线色**，如 0x93a2ab | 大气透视 |
| `skyColor` | 0x59615a | 0x8fa3b0 | 现在的灰绿太脏，会把整个画面的色彩往灰里拉 |
| `scene.environmentIntensity` | — | **0.8–1.2** | 新增项，微调 IBL 强度 |

### 夜间（重做）
| 参数 | 现值 | 建议值 | 理由 |
|---|---|---|---|
| `exposure` | 0.90 | **1.05** | 曝光不再承担"变暗"职责 |
| `sun.intensity` | 0.30 | **0.30–0.45** | 月光；色温 `0x8ac0e8` 冷蓝（人眼夜视偏蓝，这是对的，保留） |
| `sun.pos` | [0,40,0] | **[-18, 26, 14]** | 顶光没有明暗对比，要给个斜角 |
| `hemi.sky / ground` | 0x304050 / 0x2a3030 | **0x1e2a3a / 0x101216** | 压低，把"亮"让给人工光源 |
| `hemi.intensity` | 0.70 | **0.30–0.40** | |
| `ambient.intensity` | 0.45 | **0.06–0.12** | |
| `ambient.color` | 0x243648 | 0x1a2433 | |
| `fog.color` | 0x393f44 | **0x1c2430** | 夜间远处应是深蓝灰，不是黑 |
| `skyColor` | 0x2a3036 | 0x1a222e | |
| **路灯** `PointLight` | 无 | **color 0xffb066 / intensity 25–60 / distance 18–25 / decay 2** | 先给 40 试，效果不对就 ×1.5 或 ÷1.5 调 |
| **窗户自发光** | 无 | `emissive 0xffc98a`，`emissiveIntensity 0.8–1.6`，**随机 35%–55% 点亮** | 随机点亮比全亮真实得多 |
| **招牌自发光** | 无 | `emissiveIntensity 1.2–2.0` + Bloom | |
| **地面光池贴片** | 无 | 灯下半径 4–6m 的径向渐变面片，`AdditiveBlending`，不透明度 0.25–0.4 | 廉价替代真光源，见 §8 第 8 条 |

**物理单位提醒**：Three.js r155 起 `useLegacyLights` 默认为 `false`，光照按 SI 单位走。
`PointLight` / `SpotLight` 的 `intensity` 是坎德拉且 `decay = 2`（照度按 1/d² 衰减），
`DirectionalLight` / `AmbientLight` / `HemisphereLight` 的 `intensity` 是辐照度、不受 `decay` 影响。
所以**点光源的数值不能直接和方向光比较**：灯在 7m 高、要在地面产生与太阳 2.2 同量级的照度，需要 `intensity ≈ 2.2 × 49 ≈ 108`；
但你要的是"局部高光池"而不是"照亮全场"，所以 25–60 才是对的区间。
参考：https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733

---

## 6.2 材质数值表（可直接抄）

| 材质 | roughness | metalness | normalScale | 备注 |
|---|---|---|---|---|
| 白瓷砖外墙 | **0.35–0.55** | 0 | 1.0 | 上釉面。现值 0.94–0.95 **是错的** |
| 红砖墙 | 0.92–0.96 | 0 | 1.0–1.2 | 砖缝要有高度差 |
| 水泥 / 混凝土 | 0.90–0.97 | 0 | 0.4–0.6 | 有裂缝，无光泽 |
| 石材（干挂） | 0.65–0.80 | 0 | 0.8 | |
| 建筑玻璃 | **0.05–0.15** | 0 | — | 用 `envMapIntensity 1.2–1.6`，靠反射出彩。不要用 metalness 做玻璃 |
| 幕墙（玻璃+铝框） | 0.25–0.35 | 0 | 0.6 | |
| 沥青（干） | 0.88–0.94 | 0 | 0.6 | |
| 沥青（湿） | **0.25–0.45** | 0 | 0.6 | + `envMapIntensity 1.8`。**夜间最出效果的一项** |
| 人行道铺装 | 0.80–0.90 | 0 | 0.8 | |
| 金属（灯杆/栏杆） | 0.35–0.60 | **0.85–1.0** | 0.5 | |
| 金属漆（车体） | 0.30–0.40 | 0.5 | 0.4 | `MeshPhysicalMaterial`：`clearcoat 1.0 / clearcoatRoughness 0.05` |
| 木头 | 0.60–0.80 | 0 | 0.7 | |
| 帆布 / 雨棚 | 0.85–0.95 | 0 | 0.5 | |
| 轮胎 / 橡胶 | 0.95 | 0 | 0.6 | |
| 招牌（自发光） | 0.4–0.6 | 0 | 0.3 | + `emissiveMap` |

---

## 6.3 后处理链（顺序很重要）
```
RenderPass
  → GTAOPass        (output = Denoise, 半分辨率, blendIntensity 0.7–1.0)
  → UnrealBloomPass (仅夜间, strength 0.25–0.45, threshold 0.85)
  → 自写 ShaderPass (暗角 3–8% + 色散 0.5px + 噪点 1–2%)
  → OutputPass      (负责 tonemapping + sRGB 输出)
```
- **AO 与 Bloom 必须在 tonemapping 之前**（即在线性空间里做），`OutputPass` 放最后。
- `renderer.toneMapping` 仍要设成 `ACESFilmicToneMapping`，`OutputPass` 会读取它。
- `GTAOPass` 与 `SSAOPass` 都是官方 addon，需显式 import：
  `import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';`

---

## 7. 纯代码可做 vs 必须外部资产

### ✅ 纯代码可做（本项目当前约束内）
1. 程序化 albedo 贴图（已有，需提质）
2. **程序化法线贴图**（Sobel 从高度图推导）
3. **程序化粗糙度贴图**（把 albedo 的亮度反相 → 脏的地方更粗糙）
4. **IBL / 环境贴图**（`PMREMGenerator.fromScene` 自建天空场景，或官方 `RoomEnvironment`）
5. 光照重调、曝光重调、雾重调
6. **GTAOPass / SSAOPass**（官方 addon）
7. **UnrealBloomPass**（官方 addon）
8. 暗角 / 色散 / 噪点（自写 ShaderPass）
9. 顶点色假 AO、贴图内置 AO、道具底部接触暗贴片
10. 几何倒角、微观杂乱撒点、色相扰动
11. 阴影跟随相机、`shadow.radius`
12. 自发光材质、地面"光池"加法混合贴片
13. 天气状态机驱动材质参数（干/湿 roughness 切换、积雪贴图混合）
14. 交互对象的"状态机 + 变换动画"（不需要骨骼）

### ❌ 必须买 / 下载资产
1. 扫描级 PBR 贴图包（Substance / Quixel Megascans / ambientCG）—— 唯一能明显超过程序化贴图的路径
2. 真实模型：汽车、共享单车、三轮车、摊位货品、家具
3. 人物模型 + 骨骼动画（本项目角色是胶囊体 + 方块，做到"写实"是不可能的，只能做"风格化可接受"）
4. HDRI 天空贴图（严格说是资产，但**可以用程序化渐变天空 + PMREM 替代**，收益差约 15–20%）
5. 音效/环境音（不在本次范围，但对"真实感"的贡献常被低估）

---

## 8. 专项：只有程序化几何体，怎么显得写实？

**核心判断：写实感不来自面数，来自"光与材质的行为是否正确"以及"尺度与杂乱度是否符合经验"。**
以下 9 条，每条给出**视觉原理**。

### 1. IBL 优先于任何贴图
**原理**：人眼判断"这是什么材质"主要靠**高光的方向性与环境反射的一致性**——金属反射环境、玻璃反射天空、湿地面反射灯。
这些现象**只能由环境贴图产生**，恒定方向的补光（Ambient/Hemisphere）永远产生不了。
**做法**：`scene.environment = PMREM`。这一步的收益大于后面 8 条的总和。

### 2. 打破 90° 硬边（倒角 / 压边）
**原理**：真实物体的棱都是 R0.5–3mm 的圆角，会捕捉一条**细而亮的高光边**。
数学上完美的直角只产生一条生硬的明暗分界线——这是"CG 感"的第一来源，也是用户说的"建筑边缘硬"的真正原因。
**做法**：建筑外角、窗框、门框、屋檐加 2–3cm 的细长条（Box/Cylinder）。成本极低，观感提升极大。

### 3. 接触暗化（contact darkening）
**原理**：现实中物体与地面/墙面的交界处几乎总是最暗的（互相遮挡天空光）。
人眼把这层暗读成"这东西真的放在这儿"。
**做法**：所有立面贴图底部 0–0.6m 做渐变压暗（`materials.js` 的 `tileWallTex` 已经有这个思路，**要推广到每一种外墙贴图**）；每个道具底部加一圈径向渐变暗贴片。

### 4. 纹理密度一致 + 真实尺寸
**原理**：人眼靠"砖有多大、缝有多宽"来判断尺度。密度不一致（同一张纹理贴到 190m 底板和 12m 地块差 16 倍）会让大脑读不出尺度，直接判为"假"。
**做法**：`tile = 米` 的思路是对的，**要贯彻到所有材质**；并让砖缝/瓷砖缝的实际尺寸符合真实（标准砖 240×115mm、瓷砖 200×300mm、铺装砖 300×300mm）。
这是"能看出砖/水泥/瓷砖区别"的物理前提——**缝的尺寸不对，大脑就读不出那是砖**。

### 5. 色相与明度扰动
**原理**：真实城市没有两块完全一样的灰。均匀灰是最强的"程序化"信号。
**做法**：每栋楼的外墙在 HSV 上做 **±3% 明度 / ±2° 色相 / ±5% 饱和度**的扰动，并让相邻建筑刻意错开。

### 6. 微观杂乱（clutter）与不整齐
**原理**：真实环境的"信息熵"很高。人眼把"不整齐"读成"真实"。
**做法**：以 2–4m 的间距程序化撒小物件（空调外机、晾衣杆、雨棚、垃圾桶、电线、广告贴纸、水渍）；
给每个物件 **±3° 的随机旋转**和随机偏移；不要让任何一排东西完全对齐。

### 7. 单一主光 + 冷暖分区
**原理**：摄影的基本结构是"一个明确的主光方向 + 明确的冷暖对比"（暖阳光 vs 冷天空）。
全场景平光会让画面"塌"掉——这正是当前 `hemi 1.4 + ambient 0.85` 造成的结果。
**做法**：主光敢给强度，补光交给 IBL，把 Ambient 砍到 0.1 左右。

### 8. 光池贴片代替真光源
**原理**：人眼看到"地面上一圈亮"就会认定"这里有一盏灯"，**不需要真的算光照**。
**做法**：在灯下放一个半径 4–6m 的径向渐变面片，`AdditiveBlending`，不透明度 0.25–0.4。
把 `PointLight` 的真实光源限制在离玩家最近的 8–12 盏（WebGL 多光源会拖性能并触发着色器重编译）。

### 9. 大气透视（雾色 = 天空色）
**原理**：远处的物体对比度降低、色相向天空色偏移——这是人类判断"远近"的强线索。
**做法**：`fog.color` 必须等于天空地平线色。**雾色是黑色或脏灰，远处就会"变黑"而不是"变淡"，是典型的假**。

---

## 9. 需要纠正的流行说法

| 流行说法 | 判定 | 理由 |
|---|---|---|
| "低模一定不写实" | **错** | 《大多数》是 SteamDB 可查的 Unity 项目、上帝视角、低模，读作写实。写实感来自材质光响应 + 光照结构 + 纹理密度。反例：高模 + 均匀灰材质 = 泥塑 |
| "写实必须上 PBR 贴图包" | **错（但有上限）** | roughness/metalness 标量 + IBL 已给出约八成效果。贴图包带来的是"近距离的细节"，不是"真实感"。**诚实的边界**：程序化贴图在 1m 以内的近景确实比不上扫描贴图 |
| "夜间就是把曝光调低" | **错，且这正是当前 bug** | 全局降曝光 = 全场等比变暗 = 平。夜间正确做法是主光极低 + 局部光源制造高对比 |
| "AO 必须用 SSAO/GTAO" | **错** | 贴图内置 AO + 顶点色假 AO + 接触暗化能拿到约六成收益，且零性能成本。GTAO 是锦上添花，不是前提 |
| "metalness 设 0.5 是万能中间值" | **错** | three.js 官方默认 `metalness = 0`、`roughness = 1`（已查证官方文档）。非金属设 0.5 会砍掉一半漫反射、且在没有 envMap 时不产生任何反射——画面只会变暗。**部分中文教程写"metalness 默认 0.5"是错的** |
| "雾越浓越有电影感" | **半错** | 浓度要与可见距离匹配。0.0155 在 100m 处衰减到 21%，等于把 190m 的场地废掉一半 |
| "低模省钱所以可以不做贴图" | **错** | 低模 + 无贴图 = 纯色块。低模的正确搭档恰恰是**贴图 + 法线**，因为它们用极低成本补回了高频细节 |

---

## 10. 未能查证（明确列出，不要当成已知）

1. **《大多数》的美术制作流程**：贴图来源（是否实拍/扫描）、分辨率、是否外包、有无 TA 岗位——官方从未公开，也未找到第三方技术拆解。
2. **《大多数》交互对象（共享单车/汽车/摆摊）的实现方式**：无任何官方或技术层面的公开资料。
   用户"只是一段动画"的说法**无法证实也无法证伪**，不应作为设计依据引用。
3. **inZOI 的昼夜循环光照过渡实现**：官方 Wiki 的天气页明确**未覆盖**昼夜光照，仅有 "golden hour" 与 "night-time lighting" 各一处零散提及。
4. **inZOI 是否使用实景扫描/摄影测量材质**：未找到官方说明。
5. **Three.js 0.186 的具体 release notes**：只查到 r186 中文 API 文档站与 GitHub releases 列表页，未逐条读到 r186 的变更明细。
   本报告中所有 Three.js 行为依据的是**官方文档当前版本**（`MeshStandardMaterial` / `GTAOPass` / `RoomEnvironment` / `PMREMGenerator` / `EffectComposer`）与 r152（色彩管理）、r155（物理光照单位）的官方变更说明。

---

## 11. 来源清单

- SteamDB — 《大多数》技术检测（Unity + IL2CPP）：https://steamdb.info/app/1810580/technologies/
- Steam — 《大多数》商店页：https://store.steampowered.com/app/1810580/
- 3DM — 《大多数》制作人"杂草"专访（团队 <10 人、实地考察、参考《岂不怀归》）：https://www.3dmgame.com/original/3743476.html
- 游民星空 — 《大多数》工作室专访（内容来自媒体报道 + 实地探访）：https://www.gamersky.com/news/202112/1443670.shtml
- 游民星空 — 《大多数》第三期开发日志（菜市场/4S 店/批发城、夜间重新布灯）：https://www.gamersky.com/news/202206/1487914.shtml
- inZOI Wiki — Unreal Engine 5 技术总览：https://thegameswiki.com/inzoi/wiki/unreal-engine-5
- inZOI Wiki — 天气与季节系统：https://thegameswiki.com/inzoi/wiki/weather
- PC Optimized Settings — inZOI 图形设置逐项拆解（Lumen 内部结构、各档开销、VRAM）：https://pcoptimizedsettings.com/inzoi-optimization-guide-best-graphics-settings-for-pc/
- Three.js 官方文档 — MeshStandardMaterial（默认 roughness 1 / metalness 0、aoMap 红通道 + 第二套 UV）：https://threejs.org/docs/pages/MeshStandardMaterial.html
- Three.js 官方文档 — GTAOPass：https://threejs.org/docs/pages/GTAOPass.html
- Three.js 官方文档 — RoomEnvironment / PMREMGenerator：https://threejs.org.cn/docs/pages/RoomEnvironment.html
- Three.js 论坛 — r152 色彩管理变更（ColorManagement 默认开启）：https://discourse.threejs.org/t/updates-to-color-management-in-three-js-r152/50791
- Three.js 论坛 — r155 光照变更（useLegacyLights 默认 false、SI 单位）：https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733
- Three.js 论坛 — aoMap 与 UV 通道的历史变更：https://discourse.threejs.org/t/change-mesh-map-except-of-ao-map-which-has-two-uv-map/51671
