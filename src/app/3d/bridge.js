/**
 * 3D 场景层 · 游戏接入桥
 *
 * 迁移自 experiments/3d/src/main.js（2026-09-18）。
 * 原文件是「独立页面外壳」：自带 HUD、地点列表、只读信息面板。
 * 这里保留它的渲染内核与交互几何，把外壳换成**游戏接入面**：
 *
 *   保留（原封不动沿用其参数与算法）
 *     · 晦暗调光照：低角度斜射主光 + 冷天光 + 暖地面反射 + 指数雾
 *     · 渲染器：ACESFilmic 色调映射 / exposure 1.30 / PCFSoft 阴影
 *     · 等轴测跟随相机（IsoCamera 自带两级遮挡回避）
 *     · 角色行走与碰撞（Player）
 *     · 热点呼吸动画、按距离取最近热点
 *
 *   改造（这是接入游戏的关键差异）
 *     · 原 interact() 只弹一个只读面板，玩家在 3D 里干不了任何事。
 *       现在 interact() 把热点交给 onInteract 回调 → 由游戏执行真实行动。
 *     · DOM 外壳（#loc-name / #panel / 地点列表）全部去掉，改由游戏 UI 承担。
 *     · 数据由参数传入，不再 fetch —— 打包时内联，离线可用。
 *
 * 对游戏只暴露一个工厂函数，3D 与 36 万行逻辑层保持解耦。
 */

import * as THREE from 'three';
import { initMaterials } from './materials.js';
import { buildPalette, palette } from './palette.js';
import { buildLocation } from './world.js';
import { setAssetLoader, pumpAssets, pendingAssetCount, dropPendingAssets } from './kit.js';
import { createAssetLoader, polyHavenGroup, listPolyHaven, listHdri, SRC } from './assets.js';
import { mergeStatics, countScene } from './merge.js';
import { Player, IsoCamera } from './player.js';
/* 后处理（three/addons → examples/jsm，见 three 的 exports 映射）。
   顺序在下面 POST 注释里说明，改顺序会让画面全错。 */
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { GTAOPass } from 'three/addons/postprocessing/GTAOPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

/** 晦暗调常量 —— 作为初始值；实际值由 SLOT_PRESETS 按时段覆盖 */
const TONE = {
  sky: 0x8fa3b0,
  fog: { color: 0x93a2ab, density: 0.0075 },
  hemi: { sky: 0x9db4c8, ground: 0x5a5346, intensity: 0.65 },
  sun: { color: 0xd8caa8, intensity: 2.60, pos: [16, 20, -14], shadowSize: 2048, frustum: 40 },
  ambient: { color: 0x3a4450, intensity: 0.15 },
  exposure: 1.10,
};

/** 时段预设 —— 恒稳要求往 inZOI 的「夕阳-暖在地」拟真方向靠。
   光有冷暖对比就不会变成灰色块。预设按 HUD 的四个时段定：
   上午=晨光暖偏白，下午=下午更暖，傍晚=夕阳橙偏冷天，夜间=月色冷偏暗。

   ★ [2026-09-18 美术 P0 重做] 依据 `3D_ART_SPEC.md` §6.1 的数值表。三处关键变化：
     1. **补光职责从 hemi/ambient 转移到 IBL**（见 buildSkyEnv）。
        无方向的平光是立体感的头号杀手 —— hemi 1.4→0.65、ambient 0.85→0.15。
     2. **exposure 从 1.30 回落到 1.05~1.10**：加了 IBL 后整体亮度上升，
        不回调就会过曝。曝光不再承担"调明暗"的职责。
     3. **雾密度 0.0155 → 0.0075（白天）/ 0.011（夜间）**，且
        **雾色必须等于天空地平线色**（大气透视）—— 原来夜间 fog 0x393f44 太暗，
        远处会"变黑"而不是"变淡"。

   env 字段是给 IBL 用的天空/地面色（详见 buildSkyEnv）。 */
/* ★ [2026-09-18 主光方向修正] sunPos 现在**真的**决定光向，所以必须按"打光好看"标定。
 *
 *   背景：这个字段原先只被 buildSkyEnv 用来画天空里的太阳盘（只影响 IBL 反射分布），
 *   真正的方向光位置被 loop() 每帧覆盖成「玩家 + (16,22,-14)」——
 *   于是四个时段的**实际光向完全相同**，而天空却按各自 sunPos 画太阳。
 *   修好机制之后，这些从未参与过打光的方位值立刻决定画面，实测：
 *     · 傍晚整体亮度 61.81 → 50.37（−18.5%），且暖调几乎消失
 *     · 夜间 25.16 → 21.28（−15.4%）
 *   原因不是"值错了"，而是**它们从没被按打光调过**：
 *   预设里的 [-26,10,20] 相对默认等轴测机位（yaw 0.38，相机位于玩家 +x+z 侧）
 *   是**顺光位**——它照亮的是背对镜头的那几面，正面全是暗的。
 *
 *   标定规则（三次实测后定下来的，前两次都调坏了）：
 *     1. **地面受光只取决于高度角**。等轴测俯视下街面占画面约一半，
 *        街面法线朝上 → 照度 ∝ sin(高度角)。所以"低斜阳"在这种机位下
 *        不是"好看的长影"，而是"整个街面发黑"。高度角因此守在 35°~49°。
 *     2. **方位角不要动** —— 这条是踩坑踩出来的。等轴测视角只能看到两组朝向的墙，
 *        把光挪到 −x−z 侧会让**两面墙同时落进阴影**，画面反而更冷更暗：
 *        实测下午整体亮度 99.97 → 81.69（−18%）、暖调全失（墙只剩冷天光）。
 *        所以四个时段统一沿用修复前 loop() 里那个方位（+x−z 侧），
 *        与"修复前实际在用的方向"一致 → 观感不倒退。
 *     3. 于是四段之间**只差高度角与颜色**：晨 46.8° / 午 48.4° / 暮 35.7° / 夜 48.9°。
 *        ★ 这样"晨午几乎一样"是**已知且有意**的：修复前它们本来就完全一样，
 *          现在机制是活的，后续想拉开差异只需改 sunPos —— 改了就真的生效。
 *
 *   实测（整体亮度，与修复前对比）：上午 +1.2% · 下午 ~0% · 傍晚 −19%（地面照度 0.81×，
 *   "黄昏本来就该更暗"）· 夜间 ~0%（后处理再 +9% 的 Bloom 补回一部分）。 */
const SLOT_PRESETS = {
  上午: {
    /* 高度角 46.8°（修复前写死的是 46.0°）→ 白天观感几乎不变。 */
    sunColor: 0xf4e8cc, sunPos: [20, 26, -14], sunIntensity: 2.60,
    hemSky: 0x9db4c8, hemGround: 0x5a5346, hemIntensity: 0.65,
    fogColor: 0x93a2ab, fogDensity: 0.0075,
    ambColor: 0x3a4450, ambIntensity: 0.15,
    exposure: 1.10, skyColor: 0x8fa3b0,
    env: { zenith: 0x6f8fa8, horizon: 0x93a2ab, ground: 0x4a453c, groundHorizon: 0x7a7568, intensity: 1.0 },
  },
  下午: {
    /* 高度角 48.4°，方位同上午。想要"下午的光从另一边来"，
       请连同 world.js 的布局一起调 —— 单独挪光会让可见的两面墙同时入影。 */
    sunColor: 0xf6d8a8, sunPos: [18, 25, -13], sunIntensity: 2.65,
    hemSky: 0xa8bcc8, hemGround: 0x5c5344, hemIntensity: 0.70,
    fogColor: 0x9aa3a0, fogDensity: 0.0075,
    ambColor: 0x40484e, ambIntensity: 0.14,
    exposure: 1.08, skyColor: 0x97a5aa,
    env: { zenith: 0x7a9ab0, horizon: 0xa8a898, ground: 0x4a4238, groundHorizon: 0x8a8070, intensity: 1.0 },
  },
  傍晚: {
    /* 高度角 35.7° 的"黄金时刻"。
       预设原本是 17°（几乎贴地）—— 那是按"天空里的太阳盘"挑的，从没参与过打光；
       一旦真的打光，17° 会让街面照度只剩 0.4×，整个画面发黑。
       35.7° 仍有约 1.4 倍物高的长影与暖色，但街面还看得见。 */
    sunColor: 0xd67f3f, sunPos: [17, 15, -12], sunIntensity: 3.00,
    hemSky: 0x8b9fc0, hemGround: 0x4a4a3c, hemIntensity: 0.55,
    fogColor: 0x8a7a72, fogDensity: 0.0090,
    ambColor: 0x4a4a58, ambIntensity: 0.12,
    exposure: 1.05, skyColor: 0x8a7f80,
    env: { zenith: 0x4a5a78, horizon: 0xd88a50, ground: 0x3a3630, groundHorizon: 0x8a6a4a, intensity: 0.9 },
  },
  夜间: {
    /* 高度角 48.9°（修复前是 46.0°），强度保持 0.38 —— **不需要补偿**。
       ★ 教训：中间有一版把强度从 0.38 提到 0.52 想"补回夜间变暗"，那是错的：
         变暗的真正来源是高度角（以及方位造成的阴影），用强度去补
         只会把墙照成白天。改对高度角之后，强度回到原值，夜间亮度也就回到原值。 */
    sunColor: 0x8ac0e8, sunPos: [15, 22, -12], sunIntensity: 0.38,
    hemSky: 0x1e2a3a, hemGround: 0x101216, hemIntensity: 0.35,
    fogColor: 0x1c2430, fogDensity: 0.0110,
    ambColor: 0x1a2433, ambIntensity: 0.09,
    exposure: 1.05, skyColor: 0x1a222e,
    env: { zenith: 0x0e1620, horizon: 0x1c2430, ground: 0x0a0c10, groundHorizon: 0x141a22, intensity: 0.5 },
  },
};
/* ── IBL（环境贴图）────────────────────────────────────────────────────────
 *
 * ★ 为什么这是美术 P0 的第一项（依据 3D_ART_SPEC.md 的实测体检）：
 *   palette.js 里有 10 处 metalness 0.18~0.6，但**全项目没有任何环境贴图**
 *   （grep 不到 scene.environment / envMap / PMREM）。
 *   没有环境贴图时，metalness > 0 会**削掉漫反射**、换成一个无处可反射的镜面
 *   → 表面直接变暗变死。**这才是"整体偏灰暗"的真正根因 —— 不是光照参数。**
 *
 * ★ 做法：自己搭一张 equirect 天空图（Canvas 画渐变 + 太阳盘），
 *   交给 PMREMGenerator 烘成环境贴图。比 three 官方的 RoomEnvironment
 *   更贴合户外城市，而且能跟时段联动。
 *
 * ★ 缓存：PMREM 生成约几十毫秒，四个时段各烘一次就够，不必每次切时段重烘。
 */
const _envCache = new Map();

function hexCss(hex) {
  return "#" + (hex & 0xffffff).toString(16).padStart(6, "0");
}

function buildSkyEnv(renderer, slotName, preset) {
  const cached = _envCache.get(slotName);
  if (cached) return cached;
  const e = preset.env;
  if (!e) return null;

  const W = 256;
  const H = 128;
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d");

  // 上半：天空（天顶 → 地平线）
  const gSky = ctx.createLinearGradient(0, 0, 0, H * 0.5);
  gSky.addColorStop(0, hexCss(e.zenith));
  gSky.addColorStop(1, hexCss(e.horizon));
  ctx.fillStyle = gSky;
  ctx.fillRect(0, 0, W, H * 0.5);

  // 下半：地面反射（地平线 → 天底）。地面色偏暖，模拟地面反光。
  const gGround = ctx.createLinearGradient(0, H * 0.5, 0, H);
  gGround.addColorStop(0, hexCss(e.groundHorizon));
  gGround.addColorStop(1, hexCss(e.ground));
  ctx.fillStyle = gGround;
  ctx.fillRect(0, H * 0.5, W, H * 0.5);

  /* 太阳/月亮光斑 —— 给 IBL 一个**方向性**高光。
     没有它，环境光完全无方向，金属表面会像塑料一样没有明暗变化。
     位置按 sunPos 的方位角与高度角折算到 equirect 坐标上。 */
  const sunAzimuth = Math.atan2(preset.sunPos[2], preset.sunPos[0]);
  const sx = (sunAzimuth / (Math.PI * 2) + 0.5) * W;
  const sy = H * 0.5 - (preset.sunPos[1] / 40) * H * 0.42;
  const sunCss = hexCss(preset.sunColor);
  const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, W * 0.16);
  glow.addColorStop(0, sunCss);
  glow.addColorStop(0.35, sunCss + "80"); // 8 位 hex 带 alpha
  glow.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  const tex = new THREE.CanvasTexture(cv);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const rt = pmrem.fromEquirectangular(tex);
  pmrem.dispose();
  tex.dispose();

  _envCache.set(slotName, rt.texture);
  return rt.texture;
}

/* ── 后处理参数（3D_ART_SPEC.md P1-3 / P2-1 / P3-2）───────────────────────
 *
 * ★ 顺序固定，不可调换：
 *     RenderPass → GTAOPass → UnrealBloomPass(仅夜间) → Grade → OutputPass
 *
 *   为什么 AO 与 Bloom 必须在 OutputPass 之前：
 *     RenderPass 渲染到 render target 时，three **不会**应用色调映射
 *     （WebGLPrograms 里 `toneMapping: renderTarget === null ? renderer.toneMapping : NoToneMapping`），
 *     所以缓冲里是**线性 HDR**。AO 是线性空间的光照遮蔽、Bloom 的 threshold
 *     也是对着 HDR 亮度判的 —— 两者都必须在线性空间做，否则阈值含义全变。
 *     OutputPass 放最后，统一做 ACES 色调映射 + sRGB 传输（它读 renderer 上的设置）。
 *
 * ★ 一个差点照抄进代码的错误：
 *   GTAOPass 官方示例写 `output = GTAOPass.OUTPUT.Denoise`，那是**调试用法**。
 *   查 GTAOPass.render() 的 switch 可见，Denoise 分支只是
 *   `copyMaterial.tDiffuse = pdRenderTarget.texture` 直接写进缓冲 ——
 *   **场景颜色被整个丢掉**，画面会变成一张灰白 AO 图。
 *   生产要用 OUTPUT.Default(=0)：先拷场景色，再按 blendIntensity 叠 AO。
 */
const AO_SCALE = 0.5;          // AO 半分辨率：GTAO 有两次全场景预渲染，全分辨率太贵
const AO_BLEND = 0.70;         // AO 混合强度。1.0 = 全量，城市场景会明显发脏
const BLOOM_STRENGTH = 0.35;   // 报告区间 0.25~0.45
const BLOOM_RADIUS = 0.40;
const BLOOM_THRESHOLD = 0.85;  // 只让「比白还亮」的东西溢出（路灯灯头、月光边缘）
const VIGNETTE = 0.06;         // 暗角：角落衰减 6%（报告区间 3~8%）
const ABERRATION = 0.5;        // 色散：画面角落约 0.5px，中心为 0
const GRAIN = 0.015;           // 胶片颗粒：±0.0075，约 1.5%（报告区间 1~2%）

/** 镜头缺陷 pass —— 暗角 + 横向色散 + 胶片颗粒，一次全屏 pass 解决。
 *  三项都很轻：这是「让画面像镜头拍的」而不是「让画面有特效」。
 *
 *  ★ GLSL 注释一律用 ASCII。着色器源码里的非 ASCII 字节在部分 ANGLE/驱动上
 *    会被拒绝编译，而失败表现是"pass 静默不生效"甚至整块黑屏 —— 又是那种
 *    不产生明确信号的失效。所以中文解释留在 JS 侧，不进 shader 字符串。 */
const GradeShader = {
  name: 'GradeShader',
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
    uVignette: { value: VIGNETTE },
    uAberration: { value: ABERRATION },
    uGrain: { value: GRAIN },
  },
  vertexShader: [
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = uv;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}',
  ].join('\n'),
  /* 三项的语义：
       · 色散 —— 偏移量 ∝ r2（中心 0 / 四角 0.5），画面正中完全没有。
         除以分辨率是为了让 uAberration 的单位是**像素**，
         否则同一组参数在 1440p 与 720p 上会呈现成两个不同的效果。
       · 暗角 —— 角落衰减量恰好等于 uVignette，中心为 0；
         pow(...,1.5) 让衰减集中在外圈，不压中间主体。
       · 颗粒 —— 加在**线性空间**（本 pass 在 tonemapping 之前），
         于是暗部比亮部明显，这正是胶片的行为，不需要额外补偿。 */
  fragmentShader: [
    'uniform sampler2D tDiffuse;',
    'uniform float uTime, uVignette, uAberration, uGrain;',
    'uniform vec2 uResolution;',
    'varying vec2 vUv;',
    '',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);',
    '}',
    '',
    'void main() {',
    '  vec2 d = vUv - 0.5;',
    '  float r2 = dot(d, d);',
    '',
    '  float k = uAberration * r2 * 2.0 / max(uResolution.x, 1.0);',
    '  vec3 col;',
    '  col.r = texture2D(tDiffuse, vUv + d * k).r;',
    '  col.g = texture2D(tDiffuse, vUv).g;',
    '  col.b = texture2D(tDiffuse, vUv - d * k).b;',
    '',
    '  col *= 1.0 - uVignette * pow(r2 * 2.0, 1.5);',
    '',
    '  col += (hash(vUv * uResolution + fract(uTime) * 137.0) - 0.5) * uGrain;',
    '',
    '  gl_FragColor = vec4(col, 1.0);',
    '}',
  ].join('\n'),
};

const DEFAULT_SLOT = "上午";

/** 默认机位（IsoCamera 构造值）。双击回正时回到这里。 */
const DEFAULT_YAW = 0.38;
const DEFAULT_PITCH = 0.76;

/**
 * @param {object} opts
 * @param {HTMLElement} opts.container  承载 canvas 的容器
 * @param {object}      opts.data       gamedata（打包时内联的 gamedata.json）
 * @param {'full'|'mini'} [opts.mode]   full=可走动（默认）；mini=侧栏缩略景，不接管键盘
 * @param {(h:object)=>void} [opts.onInteract] 按 E / 点热点时触发，参数为热点对象
 * @param {(h:object|null)=>void} [opts.onFocus] 最近热点变化时触发（用于显示提示）
 * @param {(info:object)=>void} [opts.onBuild]   每次地点构建后回调（含性能指标）
 * @param {(e:Error)=>void} [opts.onError]       WebGL/构建失败时回调
 */
export function createGame3D(opts) {
  const { container, data } = opts;
  if (!container) throw new Error('createGame3D: 缺少 container');
  if (!data || !data.locations) throw new Error('createGame3D: 缺少 gamedata');
  /* mini 模式（侧栏缩略景）不接管键盘：
     否则玩家在游戏里打字/按 WASD 会同时驱动缩略景里的小人乱走。 */
  const wantsKeyboard = opts.mode !== 'mini';

  /* ── 渲染器 ─────────────────────────────────────────────────────────── */
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  } catch (err) {
    opts.onError?.(err instanceof Error ? err : new Error(String(err)));
    return unavailableHandle();
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TONE.exposure;
  renderer.shadowMap.enabled = true;
  /* ★ 不要再写 PCFSoftShadowMap —— 它在 r186 已被移除。
     写它会命中 WebGLShadowMap.render() 开头的一个降级分支：
       warn('WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead.')
       this.type = PCFShadowMap;
     即「代码说自己是软阴影、实际拿到硬 PCF」，而这条 warn 在门禁里**完全不可见**
     （verify-3d-shell.cjs 只收 console.error，warn 不收）。
     软化阴影现在靠 shadow.radius —— 查 shadowmap_pars_fragment.glsl 可见
     PCF 分支确实使用 shadowRadius（`float radius = shadowRadius * texelSize.x`）。 */
  renderer.shadowMap.type = THREE.PCFShadowMap;
  /* 每帧只更新一次阴影贴图。
     后处理链会让 renderer.render() 在一帧里被调用两次
     （RenderPass 一次 + GTAOPass 的法线预渲染一次），autoUpdate=true 时
     阴影贴图会跟着重算两遍 —— 2048² 的 shadow map 白白多画一遍。
     改成手动：loop 里每帧置一次 needsUpdate，由第一次 render 消费掉
     （WebGLShadowMap.render 末尾会把它复位）。 */
  renderer.shadowMap.autoUpdate = false;
  /* ★ renderer.info 默认在**每次** renderer.render() 时自动清零。
     接上后处理链之后，一帧里有多次 renderer.render：
       RenderPass 一次 + GTAOPass 的法线预渲染一次 + 每个全屏 pass 各一次。
     于是 info.render.triangles 只剩**最后一个全屏 pass** 的数字 ——
     实测从 5860 掉到 1，而画面完全正常、没有任何报错。
     这正是本项目模式 14~17 的那句话：「度量与想度量的东西不是同一个东西」；
     既有断言 `tris > 1000` 会立刻假失败（它是对的，是读数变了）。
     改成手动清零（每帧开头 reset 一次），读数即**整帧合计** ——
     既修好断言，也让这个数字更有意义（把后处理开销算进去）。 */
  renderer.info.autoReset = false;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  /* 后处理对象：**先声明、后创建**。
     applyTimeSlot 在相机创建之前就会被调用一次（初始化跑默认时段），
     而它要引用 bloomPass 来同步「夜间才开辉光」——
     把声明放到 composer 创建处（相机之后）会直接踩 TDZ。
     （这个顺序坑在"时段切换 = 换光照 + 换夜间光源"那次已经踩过一次，
       注释里写着原因，这里同样遵守。） */
  let composer = null;
  let gtaoPass = null;
  let bloomPass = null;
  let gradePass = null;

  /* ── 场景与晦暗调光照 ───────────────────────────────────────────────── */
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(TONE.sky);
  scene.fog = new THREE.FogExp2(TONE.fog.color, TONE.fog.density);

  const hemi = new THREE.HemisphereLight(TONE.hemi.sky, TONE.hemi.ground, TONE.hemi.intensity);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(TONE.sun.color, TONE.sun.intensity);
  sun.position.set(...TONE.sun.pos);
  sun.castShadow = true;
  sun.shadow.mapSize.set(TONE.sun.shadowSize, TONE.sun.shadowSize);
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 110;
  const S = TONE.sun.frustum;
  sun.shadow.camera.left = -S; sun.shadow.camera.right = S;
  sun.shadow.camera.top = S; sun.shadow.camera.bottom = -S;
  sun.shadow.bias = -0.0009;
  sun.shadow.normalBias = 0.022;
  /* 阴影边缘软化（P2-3）。PCF 分支按 shadowRadius 扩采样半径：
     0 = 硬边（锯齿明显），2~4 = 边缘有过渡但不糊。
     城市场景全是方盒子，硬边会显得像"贴上去的"，3 是性价比点。 */
  sun.shadow.radius = 3;
  scene.add(sun);
  scene.add(sun.target);

  /* ★ 主光方向必须随时段走 —— 这是修一个真实的"修了一半"：
     原先 loop() 每帧写死 sun.position = 玩家 + (16,22,-14)，
     于是 applyTimeSlot 里 sun.position.set(...preset.sunPos) **每帧被覆盖**，
     SLOT_PRESETS 的 sunPos（傍晚的 [-26,10,20] 低角度夕阳）从来没生效过。
     只有 buildSkyEnv 用了它 —— 于是「天空是夕阳、影子却是正午」，
     而且因为不报错、画面也不黑，这个 bug 一直没被发现。
     现在改成：**时段只决定方向，位置 = 玩家 + 方向 × 距离**。 */
  const sunDir = new THREE.Vector3(TONE.sun.pos[0], TONE.sun.pos[1], TONE.sun.pos[2]).normalize();
  /* 34 恰好落在 shadow.camera 的 near 1 / far 110 中段，且大于默认 frustum 的一半，
     保证 ±40m 的阴影相机能把玩家周围罩满。 */
  const SUN_DIST = 34;

  const ambLight = new THREE.AmbientLight(TONE.ambient.color, TONE.ambient.intensity);
  scene.add(ambLight);

  /* ── 时段照明（拟真，恒稳点名要 inZOI 的夕阳/暮色那一挂）────────────
     每换一个时段，只调整光的参数，不动场景。哪天把这个函数放回一个
     光学编辑器里（即「locate 光照」到某个 slot，并曝光/雾同时追平）
     一律从这里读环境。 */
  let currentSlot = DEFAULT_SLOT;
  function applyTimeSlot(slot) {
    if (!slot) return;
    const preset = SLOT_PRESETS[slot];
    if (!preset) return;
    currentSlot = slot;
    sun.color.set(preset.sunColor);
    sun.position.set(...preset.sunPos);
    /* 时段只决定**方向**。loop 每帧会用 sunDir × SUN_DIST 重算位置，
       所以上面那行 set 只是让"还没进 loop 时"的方向也是对的。 */
    sunDir.set(preset.sunPos[0], preset.sunPos[1], preset.sunPos[2]).normalize();
    sun.intensity = preset.sunIntensity;
    ambLight.color.set(preset.ambColor);
    ambLight.intensity = preset.ambIntensity;
    hemi.color.set(preset.hemSky);
    hemi.groundColor.set(preset.hemGround);
    hemi.intensity = preset.hemIntensity;
    scene.fog.color.set(preset.fogColor);
    scene.fog.density = preset.fogDensity; // ← 雾密度改为按时段（原来全局一个值）
    scene.background = new THREE.Color(preset.skyColor);
    renderer.toneMappingExposure = preset.exposure;

    /* IBL —— 见 buildSkyEnv 的注释。这一步是「整体偏灰暗」的解药：
       没有它，所有 metalness>0 的材质都在拿一个无处可反射的镜面换掉漫反射。 */
    const envTex = buildSkyEnv(renderer, slot, preset);
    if (envTex) {
      scene.environment = envTex;
      scene.environmentIntensity = preset.env ? preset.env.intensity : 1.0;
    }

    /* 辉光只在夜间开。
       ★ 白天开着会让整个画面发灰 —— 阈值以上的亮部被整体抬亮，
         而白天到处都是"比阈值亮"的地方，等于给全屏加了一层柔光罩。
       ★ 这里用 if 守卫而不是直接赋值：applyTimeSlot 在相机之前就会被调用一次
         （初始化跑默认时段），那时 bloomPass 还是 null。 */
    if (bloomPass) bloomPass.enabled = (slot === "夜间");
  }
  /* 第一次一定要把时段照明跑一遍，否则后面 setTimeSlot 出来的时候默认值可能不一致 */
  applyTimeSlot(DEFAULT_SLOT);

  initMaterials();
  buildPalette();

  /* ── 外部资产（Kenney CC0 GLB，路线 B 自托管）─────────────────────────────
     初始化时序很重要，三层：
       ① 这里只**建加载器 + 注入 kit**，不发起请求（首屏不能被 8.5MB 资产拖住）。
       ② 预热放在首帧之后（见下面 raf 循环外的 scheduleWarm），让玩家先看到场景。
       ③ 每次 buildLocation 之后调 pumpAssets()，把"已就绪"的 GLB
          替换掉 kit 里的程序化兜底。
     ★ 资产整条链是**尽力而为**：加载失败时 kit 保留兜底几何，
       场景照常可用 —— 这保证离线直开 / CSP 意外收紧 / 路径变更都不会白屏。 */
  const assets = createAssetLoader();
  setAssetLoader(assets);
  /* ★ 调试口：给验证脚本断言"资产真的载入了"用。
     ── 为什么必须是**无条件**挂，而不是藏在 SCENE3D_DEBUG 后面：
        验证脚本无法保证那个 flag 被设置（它是构建期/启动期的事），
        一旦没设，脚本会走 `if (!L) return {err}` 那条路 ——
        于是**所有资产断言被静默跳过，脚本仍然报绿**。
        这正是本项目反复警告的"假通过"。宁可留一个只读全局，
        也不能让"没测到"伪装成"测过了"。
     ── 为什么安全：暴露的是 loader 本身（同步 get/instance），
        它当作只读用；即便被恶意改写，也只是影响这一次会话的渲染，
        不涉及存档与网络。 */
  if (typeof window !== 'undefined') {
    window.__assetLoader = assets;
  }
  /* 只预热"路边件"所在的 roads/industrial/commercial 常用子集，
     而不是 173 个全量 —— 避免首屏后立刻打 173 个请求。 */
    const WARM_LIST = [
      ['roads', 'light-square'], ['roads', 'light-square-double'], ['roads', 'light-curved'],
      ['roads', 'construction-barrier'], ['roads', 'construction-cone'],
      ['roads', 'dumpster'], ['roads', 'electricity-pole'],
      ['industrial', 'detail-tank'], ['industrial', 'detail-tank-large'],
      ['industrial', 'chimney-medium'], ['industrial', 'water-tower'],
      ['industrial', 'shipping-container-a'],
      ['commercial', 'detail-awning'], ['commercial', 'detail-awning-wide'],
      ['commercial', 'detail-parasol-a'],
    ];

  /* ★ Poly Haven 预热清单（2026-09-18 接入）。
     为什么单独一份而不是并进 WARM_LIST：
       · 两源的参数形状不同（Poly Haven 的 id 既是 kit 也是 name，
         见 assets.js::urlOf），并进去会让那份清单的语义变得含混；
       · 更要紧的是**体积**：Poly Haven 单件带 1k 贴图 2-17MB，
         与 Kenney 那 15 件（合计几百 KB）不是一个量级。
         分开便于单独统计与单独失败，也便于验证脚本按源断言。
     ★ 只预热"必然会被摆进场景"的那些 id —— 预热不摆 = 白下载。
       清单与 world.js 里实际调用的 phProp 一一对应，改动要同步。 */
  const WARM_LIST_PH = [
    'rollershutter-door', 'rollershutter-window-1',
    'fire-hydrant', 'metal-gutter',
    'fire-escape', 'electricity-poles', 'chainlink-fence',
    'road-barrier', 'road-barrier-2',
  ];

  /* ── 角色 / 相机 ────────────────────────────────────────────────────── */
  const player = new Player(scene, [], new THREE.Vector3(0, 0, 10));
  /* ★ 相机深度（P2-4）：near 0.1 → 0.5、far 400 → 250。
     · near 抬高是为了**深度精度**：0.1 与 250 的比值 2500:1，深度缓冲在远处
       几乎全是同一个值（z-fighting / 远处的 AO 与阴影会抖）。0.5 与 250 是 500:1。
       等轴测相机离玩家约 18~32，抬到 0.5 完全不会切到角色。
     · far 压到 250 是因为雾：白天雾密度 0.0075 → 约 133m 外已完全被雾吃掉，
       再远的几何画了也看不见。这一刀同时也帮 GTAOPass 省了远处像素。 */
  const camera = new THREE.PerspectiveCamera(46, 1, 0.5, 250);
  const cam = new IsoCamera(camera, player.pos, []);

  /* ── 后处理链（P1-3 / P2-1 / P3-2）────────────────────────────────────
   * 顺序见文件顶部 POST 常量注释：AO 与 Bloom 必须在线性空间（OutputPass 之前）。
   * mini 缩略景（侧栏 ~230px）不跑后处理：GTAO 有两次全场景预渲染，
   * 在那个尺寸上纯属浪费，而且 229px 宽的画面上根本看不出 AO。
   */
  const wantsPostFx = wantsKeyboard;
  /* 已加入 composer 的 pass 清单 —— 用于把「真实链顺序」暴露给验证脚本。
     ★ 不用 pass.constructor.name：esbuild minify 会把类名改掉（GTAOPass → vs），
       那种断言会在"构建方式变了"的时候假失败。 */
  const postPasses = [];
  function addPost(kind, pass) {
    composer.addPass(pass);
    postPasses.push({ kind, pass });
    return pass;
  }
  if (wantsPostFx) {
    composer = new EffectComposer(renderer);
    addPost('render', new RenderPass(scene, camera));

    gtaoPass = addPost('gtao', new GTAOPass(scene, camera, 1, 1));
    /* ★ OUTPUT.Default 而不是官方示例里的 Denoise —— 见文件顶部注释，
       Denoise 只输出 AO 图本身，会把场景颜色整个丢掉。 */
    gtaoPass.output = GTAOPass.OUTPUT.Default;
    gtaoPass.blendIntensity = AO_BLEND;

    bloomPass = addPost('bloom', new UnrealBloomPass(
      new THREE.Vector2(1, 1), BLOOM_STRENGTH, BLOOM_RADIUS, BLOOM_THRESHOLD));
    bloomPass.enabled = false;

    gradePass = addPost('grade', new ShaderPass(GradeShader));
    /* 色调映射统一由 OutputPass 做。ShaderPass 用的是 ShaderMaterial，
       渲染到屏幕时 three 会往里注入 tone mapping —— 显式关掉，避免双重映射。
       （当前 grade 不是最后一个 pass，本来就不会被注入；这行是防止将来
       有人把 OutputPass 拿掉时的静默变亮。） */
    gradePass.material.toneMapped = false;

    addPost('output', new OutputPass());

    bloomPass.enabled = (currentSlot === "夜间");
  }

  let world = null;
  let currentId = null;
  let focused = null;
  let running = false;
  let rafId = 0;
  let last = 0;
  /** 外部资产只预热一次（多次 start/stop 不重复请求）。 */
  let assetsWarmed = false;
  /** 累计成功替换的 GLB 实例数（两处 pump 相加；验证脚本断言 > 0）。 */
  let assetsReplacedTotal = 0;

  const keys = new Set();

  /* ── 尺寸 ───────────────────────────────────────────────────────────── */
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
    if (composer) {
      composer.setSize(w, h);
      /* ★ composer.setSize 会把**每一个** pass 的尺寸都设成全分辨率
         （EffectComposer.setSize 里对 passes 逐个调用 pass.setSize），
         所以半分辨率的 AO 必须在它**之后**重新压回去。
         顺序反了不会报错，只是 AO 悄悄变回全分辨率、帧率掉一截。 */
      const pr = renderer.getPixelRatio();
      gtaoPass.setSize(
        Math.max(1, Math.floor(w * pr * AO_SCALE)),
        Math.max(1, Math.floor(h * pr * AO_SCALE)),
      );
      /* 色散按像素给量，必须知道真实像素宽度（含 devicePixelRatio） */
      gradePass.uniforms.uResolution.value.set(w * pr, h * pr);
    }
  }
  const ro = typeof ResizeObserver !== 'undefined'
    ? new ResizeObserver(() => resize())
    : null;
  ro?.observe(container);
  window.addEventListener('resize', resize);

  /* ── 键盘 ───────────────────────────────────────────────────────────
     绑到 window 而非 container：游戏里 canvas 未必持有焦点，
     但玩家按 WASD 时预期角色就该动。输入框内不拦截。
     ──────────────────────────────────────────────────────────────────── */
  function isTyping(e) {
    const t = e.target;
    if (!t || !t.tagName) return false;
    const tag = t.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select' || t.isContentEditable;
  }
  function onKeyDown(e) {
    if (isTyping(e)) return;
    if (!running || !wantsKeyboard) return;
    keys.add(e.code);
    if (e.code.startsWith('Arrow') || e.code === 'Space') e.preventDefault();
    if (e.code === 'KeyE') { e.preventDefault(); interact(); }
    if (e.code === 'Escape') { /* 交给游戏处理 */ }
  }
  function onKeyUp(e) { keys.delete(e.code); }
  function onBlur() { keys.clear(); }
  if (wantsKeyboard) {
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', onBlur);
  }

  /* ── 鼠标/触摸拖拽转视角 ────────────────────────────────────────────────
     原型的相机是"固定视角"（《大多数》的取向：方位永远一致，不迷失）。
     但固定视角在 3D 里会让人失去"我在看一个三维空间"的实感 ——
     所以补上自由旋转，同时保留一个"回正"入口（双击）。
     实现要点：
       · 用 Pointer Events 统一鼠标/触摸/笔，一套代码通吃。
       · setPointerCapture：拖到窗口外也不会丢事件（否则手感会"断"）。
       · 拖拽阈值 4px 内不旋转 —— 否则"想点交互点"会顺手把视角拧歪。
       · pitch 夹在 0.25~1.35 rad：再小会穿到地平线下，再大变成垂直俯视。
     ─────────────────────────────────────────────────────────────────────── */
  const DRAG_THRESHOLD = 4;
  const PITCH_MIN = 0.25, PITCH_MAX = 1.35;
  let dragging = false, dragId = null, dragMoved = 0;
  let lastX = 0, lastY = 0;
  let tapCandidate = null;   // 未超过阈值就松手 → 视为"点击"，用于点选交互点

  function onPointerDown(e) {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    dragging = true; dragId = e.pointerId; dragMoved = 0;
    lastX = e.clientX; lastY = e.clientY;
    tapCandidate = { x: e.clientX, y: e.clientY };
    container.setPointerCapture?.(e.pointerId);
    container.classList.add('is-dragging');
  }
  function onPointerMove(e) {
    if (!dragging || e.pointerId !== dragId) return;
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    dragMoved += Math.abs(dx) + Math.abs(dy);
    lastX = e.clientX; lastY = e.clientY;
    if (dragMoved < DRAG_THRESHOLD) return;
    tapCandidate = null;
    cam.yaw -= dx * 0.006;
    cam.pitch = Math.max(PITCH_MIN, Math.min(PITCH_MAX, cam.pitch + dy * 0.004));
  }
  function onPointerUp(e) {
    if (e.pointerId !== dragId) return;
    dragging = false; dragId = null;
    container.releasePointerCapture?.(e.pointerId);
    container.classList.remove('is-dragging');
    if (tapCandidate) {
      // 未拖动 → 当作点击：射线选中附近的交互点并触发（点选也能交互，不必非得走过去）
      const hit = pickHotspotAt(tapCandidate.x, tapCandidate.y);
      tapCandidate = null;
      if (hit) { focused = hit; opts.onInteract?.(hit); }
    }
  }
  function onDblClick() { cam.yaw = DEFAULT_YAW; cam.pitch = DEFAULT_PITCH; }

  if (wantsKeyboard) {
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);
    container.addEventListener('dblclick', onDblClick);
  }

  /** 屏幕坐标 → 最近的交互点（屏幕空间距离阈值，省掉一条射线求交） */
  const _v = new THREE.Vector3();
  function pickHotspotAt(clientX, clientY) {
    if (!world) return null;
    const r = container.getBoundingClientRect();
    const px = clientX - r.left, py = clientY - r.top;
    let best = null, bestD = 46;   // 46px 命中半径：手感上"差不多点到了"就行
    for (const h of world.hotspots) {
      _v.set(h.x, 1.4, h.z).project(camera);
      if (_v.z > 1) continue;      // 在相机背后
      const sx = (_v.x * 0.5 + 0.5) * r.width;
      const sy = (-_v.y * 0.5 + 0.5) * r.height;
      const d = Math.hypot(sx - px, sy - py);
      if (d < bestD) { bestD = d; best = h; }
    }
    return best;
  }

  /* ★ 收敛定时器：反复 pump 直到没有待回填项，或到上限。
     为什么这个函数是整个资产链的**关键**（2026-09-18 实测缺陷）：
       资产是 24 个独立请求，完成顺序完全不确定。
       任何"在某个 Promise.then 里 pump 一次"的方案，都只能覆盖
       那一刻已就绪的子集 —— 真实症状就是
       「9 个模型全部 ready，场景里只换上了 3 个，其余永远 pending」。
       把"何时换上"与"哪个请求先完成"解耦，是唯一稳的做法：
       幂等、零成本、必然收敛（每次只做"就绪即替换"）。
     ★ 单例：重复调用先清掉旧的定时器，避免切地点时堆积多个计时器。
     ★ 上限 40 tick（10s）：够覆盖慢网下的大 GLB，又不会永久占用定时器。 */
  let pumpTimer = null;
  function pumpUntilSettled() {
    if (pumpTimer) clearInterval(pumpTimer);
    let ticks = 0;
    pumpTimer = setInterval(() => {
      const n = pumpAssets();
      assetsReplacedTotal += n;
      ticks++;
      /* 收敛判据用 pendingAssetCount()===0：全部换上或已被清理。
         注意 pumpAssets 内部会剔除"包装已脱离场景"的孤儿项 ——
         那是**清理**不是**替换**，所以另记 dropped 数以便区分
         （见 kit.js::lastDroppedAssets）。 */
      if (pendingAssetCount() === 0 || ticks >= 40) {
        clearInterval(pumpTimer);
        pumpTimer = null;
      }
    }, 250);
  }

  /* ── 地点加载 ───────────────────────────────────────────────────────── */
  function disposeWorld(w) {    if (!w) return;
    /* ★ 先把指向本世界的待回填登记清掉（见 kit.js::dropPendingAssets 的长注释）。
       必须在 traverse/dispose **之前**：否则那些包装 Group 会被连带 dispose，
       而登记表仍留着它们，之后 pump 会往死对象上挂模型（假通过），
       并且可能把缓存原型的共享几何一起 dispose 掉。 */
    dropPendingAssets(w.group);
    /* ★ GLB 的几何是**缓存共享**的（见 assets.js::instance 的 clone 说明）：
       原型一份，所有实例共用同一批 BufferGeometry。
       所以这里不能无差别 dispose —— 会把缓存原型也毁掉。
       标记 glbSourced 的网格跳过（它们的生命周期归资产缓存管）。
       兜底几何是我们自己 new 的，照常释放。 */
    w.group.traverse((o) => {
      if (o.isMesh && o.geometry && !o.userData.glbSourced) o.geometry.dispose();
    });
    scene.remove(w.group);
  }

  /* ── 夜间人工光源 ─────────────────────────────────────────────────────────
   *
   * ★ 为什么必须做（3D_ART_SPEC.md P0-3）：夜间的正确做法**不是「把曝光调低」**，
   *   而是「低主光 + 局部光源 + 自发光」。只降曝光的结果是一片黑 —— 已实测：
   *   exposure 0.90 时夜间近乎全黑，什么都看不见。
   *   夜间真正的「亮」来自路灯，而不是来自环境光。
   *
   * ★ 为什么要从场景里收集灯位：光源要跟着**时段**开关，
   *   而 world.js 只负责构建静态几何（构建期并不知道当前时段）。
   *   kit.streetLamp() 因此在灯杆 group 上留了 userData.lampHead 锚点。
   *
   * ★ 为什么要限量：PointLight 每个都要参与逐片元着色，29 个地点的路灯全开
   *   会明显拖帧。只取离镜头最近的 MAX_NIGHT_LIGHTS 个 —— 视野内够用即可。
   */
  const MAX_NIGHT_LIGHTS = 14;
  let lampAnchors = [];
  let nightLights = [];
  let lampScan = { total: 0, groups: 0, meshes: 0 };

  function collectLamps(root) {
    lampAnchors = [];
    lampScan = { total: 0, groups: 0, meshes: 0 };
    if (!root) return;
    root.updateMatrixWorld(true);
    const v = new THREE.Vector3();
    root.traverse((o) => {
      lampScan.total++;
      if (o.isGroup) lampScan.groups++;
      if (o.isMesh) lampScan.meshes++;
      const a = o.userData && o.userData.lampHead;
      if (!a) return;
      v.set(a.x, a.y, a.z);
      o.localToWorld(v);
      lampAnchors.push({ x: v.x, y: v.y, z: v.z, bulb: o.userData.lampBulb || null });
    });
  }

  function applyNightLights(on, focus) {
    for (const l of nightLights) scene.remove(l);
    nightLights = [];

    // 灯罩微光：夜间调亮、偏暖；白天压回「淡淡的罩子」
    for (const a of lampAnchors) {
      if (a.bulb && a.bulb.material) {
        a.bulb.material.opacity = on ? 0.95 : 0.5;
        a.bulb.material.color.set(on ? 0xffc98a : 0xe8d8a8);
      }
    }
    if (!on || !lampAnchors.length) return;

    const list = lampAnchors.slice();
    if (focus) {
      const d2 = (p) => (p.x - focus.x) * (p.x - focus.x) + (p.z - focus.z) * (p.z - focus.z);
      list.sort((p, q) => d2(p) - d2(q));
    }
    /* intensity 24 / distance 18 / decay 2。
       ★ 第一版用的是 40 / 22，实测**过亮** —— 12 盏灯同时照，累积照度把整个
         画面染成暖橙，夜晚的冷调对比全没了，看起来像室内暖光而不像夜街。
       ★ 报告给的区间是 25~60（那是"单盏灯"的量级）；这里的场景一盏挨一盏，
         必须按**同时可见的盏数**折算。调到 24 之后冷（月光/天空）暖（路灯）才分得开。
       ★ 数值依据 3D_ART_SPEC.md §6.1：r155 起光照按 SI 单位，点光源 intensity
         不能与方向光直接比较 —— 要的是"局部光池"而不是"照亮全场"。 */
    for (const a of list.slice(0, MAX_NIGHT_LIGHTS)) {
      const pl = new THREE.PointLight(0xffb066, 24, 18, 2);
      pl.position.set(a.x, a.y, a.z);
      scene.add(pl);
      nightLights.push(pl);
    }
  }

  function loadLocation(id) {
    if (!data.locations[id]) {
      opts.onError?.(new Error(`未知地点: ${id}`));
      return null;
    }
    const t0 = performance.now();
    disposeWorld(world);

    world = buildLocation(scene, data, id);

    /* 把已就绪的外部资产回填进本次构建的场景。
       ★ 必须在 mergeStatics **之前**：GLB 是静态几何，越早挂上去，
         越能一起被合并进合批，少一批 draw call。
       ★ 这里只能换上"此刻已就绪"的那部分；剩下的交给 pumpUntilSettled()
         （下面立刻启动）在后续若干帧里补齐。 */
    const assetReplaced = pumpAssets();
    assetsReplacedTotal += assetReplaced;
    /* ★ 每次构建都重启一次收敛定时器（见 pumpUntilSettled 的说明）。
       为什么要"每次"而不是只在 warm 完成时跑一次：
       用户切地点时注册的是**新一批**包装，而 warm 的定时器早就跑完并停了
       （它有 40 tick 上限，防止永久占用）。若不在构建时重启，
       切地点后新登记的项就再也不会被 pump —— 表现为
       "第一次进有细节，切一次地点细节全没了"。
       （实测：重载后 pending 卡在 7，正是这个原因。） */
    pumpUntilSettled();

    /* ★ collectLamps 必须跑在 mergeStatics **之前**。
       mergeStatics 会把静态 Mesh 烘焙合并、并从树上摘掉原对象；
       灯锚点所在的 group 一旦被清空就再也找不到。
       （这正是第一版夜间路灯 0 盏的原因 —— 顺序反了，而它不报错，只是"不亮"。） */
    collectLamps(world.group);

    const mergeStat = mergeStatics(world.group);
    const counts = countScene(world.group);

    applyNightLights(currentSlot === "夜间", cam.cur);

    player.setWorld({ colliders: world.colliders, spawn: world.spawn, bounds: world.bounds });
    cam.setWorld({ colliders: world.blockers, target: world.spawn, ...world.camera });
    cam.cur.copy(world.spawn);
    cam.apply(cam.cur);
    /* mini 缩略景容器很窄（侧栏 ~230px），照搬布局预设的机位会贴脸 ——
       拉远一档，让它呈现"整条街"的轮廓而不是一堵墙。 */
    if (!wantsKeyboard) {
      cam.dist = Math.min(34, cam.dist + 9);
      cam.apply(cam.cur);
    }

    // 出生点体检：直接判断出生点是否落在碰撞盒内。
    // 比"走两步看位移"可靠 —— 位移受帧率影响，低帧率下分不清"卡住"还是"走得慢"。
    const sp = world.spawn, r = player.radius;
    const spawnBlocked = world.colliders.filter((c) =>
      sp.x > c.minX - r && sp.x < c.maxX + r && sp.z > c.minZ - r && sp.z < c.maxZ + r).length;

    focused = null;
    opts.onFocus?.(null);
    currentId = id;

    const ms = Math.round(performance.now() - t0);
    const info = {
      id, ms, tris: counts.tris, spawnBlocked,
      meshes: { before: mergeStat.before, after: mergeStat.after },
      hotspots: world.hotspots.length,
      colliders: world.colliders.length,
      /* 外部资产运行态：给人看（调试面板）也给验证脚本断言用。 */
      assets: { replaced: assetReplaced, pending: pendingAssetCount(), report: assets.report() },
    };
    opts.onBuild?.(info);
    lastBuild = info;
    return world;
  }

  let lastBuild = null;

  /* ── 交互 ───────────────────────────────────────────────────────────── */
  function nearestHotspot() {
    if (!world) return null;
    let best = null, bestD = Infinity;
    for (const h of world.hotspots) {
      const d = Math.hypot(player.pos.x - h.x, player.pos.z - h.z);
      if (d < h.radius && d < bestD) { bestD = d; best = h; }
    }
    return best;
  }

  /** 触发当前聚焦的热点 —— 交给游戏执行，3D 层不自作主张 */
  function interact() {
    if (focused) opts.onInteract?.(focused);
  }

  /** 供外部（鼠标点击）指定热点后触发 */
  function interactHotspot(index) {
    const h = world?.hotspots[index];
    if (h) { focused = h; opts.onInteract?.(h); }
  }

  /* ── 主循环 ─────────────────────────────────────────────────────────── */
  function loop(now) {
    if (!running) return;
    rafId = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    /* 整帧合计的计数器：手动清零，让下面所有 render 累加在一起
       （见 renderer.info.autoReset 的注释）。 */
    renderer.info.reset();

    player.update(dt, keys, cam.yaw);
    cam.update(dt, player.pos);

    /* 主光跟随角色：**时段只决定方向，位置 = 玩家 + 方向 × 距离**。
       这样 ±40m 的阴影 frustum 始终罩住视野中心（跟人走），
       同时夕阳的低角度不会被写死成正午 —— 见 sunDir 的注释。 */
    sun.position.set(
      player.pos.x + sunDir.x * SUN_DIST,
      sunDir.y * SUN_DIST,
      player.pos.z + sunDir.z * SUN_DIST,
    );
    sun.target.position.set(player.pos.x, 0, player.pos.z);
    sun.target.updateMatrixWorld();

    // 颗粒要动起来才是"胶片"而不是"脏屏幕"
    if (gradePass) gradePass.uniforms.uTime.value = now * 0.001;

    // 最近热点变化 → 通知外部（游戏据此显示"按 E"提示）
    const near = nearestHotspot();
    if (near !== focused) {
      focused = near;
      opts.onFocus?.(focused || null);
    }

    // 热点呼吸动画
    if (world) {
      const t = now * 0.0016;
      for (const h of world.hotspots) {
        const hu = h.object?.userData?.hotspot;
        if (!hu) continue;
        const isFocus = h === focused;
        const s = (isFocus ? 1.18 : 1) + Math.sin(t * 2 + h.x) * 0.05;
        hu.ring?.scale.setScalar(s);
        if (hu.sprite) {
          hu.sprite.position.y = 2.15 + Math.sin(t * 1.7 + h.z) * 0.09;
          hu.sprite.material.opacity = isFocus ? 1 : 0.72;
        }
      }
    }

    /* 阴影贴图每帧只算一次：手动置 needsUpdate，由下面第一次 renderer.render
       消费掉；GTAO 的法线预渲染那次就不会再算一遍（见 renderer.shadowMap.autoUpdate）。 */
    renderer.shadowMap.needsUpdate = true;
    if (composer) composer.render();
    else renderer.render(scene, camera);
    frames++;
    const elapsed = (now - fpsT0) / 1000;
    if (elapsed >= 0.5) {
      fps = Math.round(frames / elapsed);
      fpsT0 = now; frames = 0;
    }
  }

  let fps = 0, frames = 0, fpsT0 = 0;

  /* ── 生命周期 ───────────────────────────────────────────────────────── */
  function start() {
    if (running) return;
    running = true;
    resize();
    last = performance.now();
    fpsT0 = last; frames = 0;
    rafId = requestAnimationFrame(loop);

    /* 首帧之后再预热外部资产。
       ★ 为什么不在构造时预热：构造发生在 3D 被打开的那一刻，
         8.5MB 资产哪怕异步也会抢带宽、推高首帧时间（用户先看到的应该是场景，不是加载条）。
         放到这里，"看到场景"与"载入细节"就分成了两件事。
       ★ warm 完成后调 pumpAssets()，把已就绪的 GLB 换掉场景里的程序化兜底。
         这是**真正生效的那一次 pump** —— 因为 warm 是异步的，
         而 loadLocation 里的那次 pump 通常跑在资产回来之前（那时全是未就绪）。
         （这两次调用都要保留：前者管"切地点时命中缓存"，后者管"首次加载完成后回填"。）
       ★ 回填后必须重算三角面计数：stats.build.tris 是构建时快照的数字，
         GLB 换上之后不再准确，验证脚本会读到过期的面数。 */
    if (!assetsWarmed) {
      assetsWarmed = true;
      /* 两源并行预热。用 Promise.all 而不是等第一个完再起第二个：
         它们是独立的网络请求，串行只会让首屏细节到位的时间翻倍。 */
      const kWarm = assets.warm(WARM_LIST);
      const phWarm = typeof assets.warmPolyHaven === 'function'
        ? assets.warmPolyHaven(WARM_LIST_PH)
        : Promise.resolve(0);

      /* ★ 每源各自完成时**立刻** pump 一次，而不是等 Promise.all。
         为什么（2026-09-18 实测缺陷）：
           Kenney 那 15 件合计几百 KB，Poly Haven 那 9 件 2–17MB。
           两者耗时差一个数量级。若只在 Promise.all 之后 pump 一次，
           先到的一批要空等最慢的那个模型（首屏会"什么都没有"好几秒）；
           更糟的是如果那期间用户切了地点，早先登记的包装会跟着旧世界一起
           被 drop —— 于是"资产明明 ready，场景里却没有"（本次的真实缺陷）。
           分源 pump 让每一批就位就立刻换上。 */
      const pumpNow = (tag, n) => {
        const replaced = pumpAssets();
        assetsReplacedTotal += replaced;
        const counts = world ? countScene(world.group) : null;
        if (counts && lastBuild) lastBuild.tris = counts.tris;
        opts.onAssets?.({
          loaded: n, replaced, report: assets.report(), source: tag,
        });
        return replaced;
      };
      kWarm.then((nk) => pumpNow('kenney', nk));
      phWarm.then((nph) => pumpNow('polyhaven', nph));

      /* ★ 再挂上收敛定时器兜底 —— 分源 pump 只管"某一批全到"那一刻，
         而 24 个请求是陆续到的，中间态必须靠定时器补齐。 */
      pumpUntilSettled();
    }
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    keys.clear();
  }
  function dispose() {
    stop();
    /* ★ 关掉收敛定时器。不清会怎样：场景销毁后计时器还在跑，
       每 250ms 对一张空表 pump 一次 —— 不致命，但属于资源泄漏，
       而且在"反复创建/销毁预览"的场景下会累积多个计时器。 */
    if (pumpTimer) { clearInterval(pumpTimer); pumpTimer = null; }
    disposeWorld(world);
    ro?.disconnect();
    window.removeEventListener('resize', resize);
    if (wantsKeyboard) {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', onBlur);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
      container.removeEventListener('dblclick', onDblClick);
      container.classList.remove('is-dragging');
    }
    renderer.dispose();
    renderer.domElement.remove();
    /* EffectComposer.dispose() 只释放它自己的两个缓冲与 copyPass，
       不碰各 pass 自己的 render target / material —— 必须逐个释放，
       否则反复开关 3D 视图会持续泄漏显存（而且不报错）。 */
    gtaoPass?.dispose();
    bloomPass?.dispose();
    gradePass?.dispose();
    composer?.dispose();
    composer = null; gtaoPass = null; bloomPass = null; gradePass = null;
    postPasses.length = 0;
  }

  return {
    loadLocation,
    start,
    stop,
    dispose,
    resize,
    interact,
    interactHotspot,
    zoom: (d) => cam.zoom(d),
    /** 视角回正（默认机位）。双击画布也会触发。 */
    resetView() { cam.yaw = DEFAULT_YAW; cam.pitch = DEFAULT_PITCH; cam.apply(cam.cur); },
    /** 只读当前机位，供 UI 显示或测试断言 */
    get view() { return { yaw: cam.yaw, pitch: cam.pitch, dist: cam.dist }; },
    /** 时段照明（上午/下午/傍晚/夜间）。HUD 切 slot 时调，光照跟着走。 */
    /* 时段切换 = 换光照 + 换夜间人工光源。
       为什么灯光不放在 applyTimeSlot 里：那个函数在相机创建**之前**就被调用过一次
       （初始化跑默认时段），在那里引用 cam 会踩 TDZ。放在接口层就没有这个时序问题。 */
    setTimeSlot(slot) { applyTimeSlot(slot); applyNightLights(slot === "夜间", cam.cur); },
    /** 只读当前时段（验证脚本用） */
    get timeSlot() { return currentSlot; },
    /* ── 外部资产运行态（Kenney + Poly Haven，均 CC0）────────────────────
       给验证脚本断言"GLB 真的被加载/替换了"，也给调试面板看失败原因。
       只读快照，不暴露 cache 内部对象。

       ★ 这里额外暴露 loader 的**清单查询**能力（polyHavenGroup / listHdri）。
         为什么必须走 bridge 而不是让脚本去摸 window：
         验证脚本要断言"清单里有哪些模型、尺寸多少"，
         若靠 window 上的临时全局，谁重命名一下就断了（静默失效）。
         走正式 API 则改错了 TS/构建就会报错。 */
    get assets() {
      return {
        pending: pendingAssetCount(),
        replacedTotal: assetsReplacedTotal,
        report: assets.report(),
        warmList: WARM_LIST.length,
        warmListPolyHaven: WARM_LIST_PH.length,
        polyHavenGroups: () => {
          /* 清单里的组名。polyHavenGroup('__probe__') 返回空数组，
             用它反查组名太绕 —— 直接从清单对象取 keys 更直接。 */
          const all = listPolyHaven();
          const m = new Map();
          for (const e of all) m.set(e.name, true);
          return ['detail', 'structure', 'road', 'facade'].filter((g) => polyHavenGroup(g).length > 0);
        },
        polyHavenGroup: (g) => polyHavenGroup(g),
        listPolyHaven: () => listPolyHaven(),
        listHdri: () => listHdri(),
      };
    },
    /* ── 只读状态 ── */
    get locationId() { return currentId; },
    get hotspot() { return focused; },
    get hotspots() { return world ? world.hotspots : []; },
    get playerPos() { return { x: player.pos.x, z: player.pos.z }; },
    get stats() {
      return {
        fps,
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        build: lastBuild,
        /* ★ 夜间灯光的可观测性 —— 加这两个数是因为夜间"还是太暗"时，
           必须先分清是「没找到灯锚点」还是「灯找到了但太弱」。
           没有这个读数就只能靠猜（而这两者的修法完全不同）。 */
        lampAnchors: lampAnchors.length,
        lamps: nightLights.length,
        lampScan,
        /* ★ 后处理链的可观测读数。
           为什么必须暴露：AO/Bloom 这类效果的失败方式是**没有信号**的 ——
           参数写错、顺序错了、pass 没被加进去，画面只是"不太一样"，
           而断言如果只查"没报错"就什么都抓不到。
           order 是 pass 真正被 addPass 的顺序（= composer 的渲染顺序）；
           shape 是问对象本身"你是不是那个 pass"，不依赖我给它的标签，
           也不依赖 constructor.name（minify 会改掉类名）。 */
        postFx: composer ? {
          order: postPasses.map((p) => p.kind),
          count: composer.passes.length,
          aoScale: AO_SCALE,
          bloomEnabled: !!(bloomPass && bloomPass.enabled),
          /* AO 缓冲的真实尺寸 —— 与 renderer 的绘制缓冲对比即可证明是半分辨率 */
          aoSize: gtaoPass ? [gtaoPass.width, gtaoPass.height] : null,
          canvasSize: [renderer.domElement.width, renderer.domElement.height],
          shape: {
            gtao: !!(gtaoPass && gtaoPass.gtaoMaterial),
            bloom: !!(bloomPass && bloomPass.renderTargetBright),
            grade: !!(gradePass && gradePass.uniforms && gradePass.uniforms.uVignette),
            output: composer.passes.some((p) => p && '_toneMapping' in p),
          },
        } : null,
        /* 阴影跟随的读数（P2-3）。dir 让"时段有没有真的改变光向"可断言 ——
           原先那个 bug 正是「时段改了、光向没改」，而画面看不出异常。 */
        sun: {
          dir: [
            Number(sunDir.x.toFixed(4)),
            Number(sunDir.y.toFixed(4)),
            Number(sunDir.z.toFixed(4)),
          ],
          dist: SUN_DIST,
          radius: sun.shadow.radius,
          autoUpdate: renderer.shadowMap.autoUpdate,
          type: renderer.shadowMap.type,
        },
      };
    },
    /** 测试钩子：直接瞬移（软渲染下逐个热点巡检太慢，必须能跳） */
    teleport(x, z) { player.pos.set(x, 0, z); cam.cur.set(x, 0, z); cam.apply(cam.cur); },
    /** 测试钩子：模拟按键。语义与真实 keydown 一致 —— KeyE 即触发交互，
     *  否则测试里按 E 没反应，会误判成"热点交互坏了"。 */
    key(code, down = true) {
      if (code === 'KeyE' && down) { interact(); return; }
      down ? keys.add(code) : keys.delete(code);
    },
    get scene() { return scene; },
    get camera() { return camera; },
  };
}

function unavailableHandle() {
  const noop = () => {};
  return {
    loadLocation: () => null, start: noop, stop: noop, dispose: noop, resize: noop,
    interact: noop, interactHotspot: noop, zoom: noop, teleport: noop, key: noop,
    resetView: noop, view: { yaw: 0, pitch: 0, dist: 0 },
    locationId: null, hotspot: null, hotspots: [], playerPos: { x: 0, z: 0 },
    stats: { fps: 0, calls: 0, triangles: 0, build: null, postFx: null, sun: null },
    scene: null, camera: null,
  };
}

export { palette };
