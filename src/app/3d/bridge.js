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
import { mergeStatics, countScene } from './merge.js';
import { Player, IsoCamera } from './player.js';

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
const SLOT_PRESETS = {
  上午: {
    sunColor: 0xf4e8cc, sunPos: [20, 24, -12], sunIntensity: 2.60,
    hemSky: 0x9db4c8, hemGround: 0x5a5346, hemIntensity: 0.65,
    fogColor: 0x93a2ab, fogDensity: 0.0075,
    ambColor: 0x3a4450, ambIntensity: 0.15,
    exposure: 1.10, skyColor: 0x8fa3b0,
    env: { zenith: 0x6f8fa8, horizon: 0x93a2ab, ground: 0x4a453c, groundHorizon: 0x7a7568, intensity: 1.0 },
  },
  下午: {
    sunColor: 0xf6d8a8, sunPos: [-16, 20, 14], sunIntensity: 2.65,
    hemSky: 0xa8bcc8, hemGround: 0x5c5344, hemIntensity: 0.70,
    fogColor: 0x9aa3a0, fogDensity: 0.0075,
    ambColor: 0x40484e, ambIntensity: 0.14,
    exposure: 1.08, skyColor: 0x97a5aa,
    env: { zenith: 0x7a9ab0, horizon: 0xa8a898, ground: 0x4a4238, groundHorizon: 0x8a8070, intensity: 1.0 },
  },
  傍晚: {
    sunColor: 0xd67f3f, sunPos: [-26, 10, 20], sunIntensity: 2.80,
    hemSky: 0x8b9fc0, hemGround: 0x4a4a3c, hemIntensity: 0.55,
    fogColor: 0x8a7a72, fogDensity: 0.0090,
    ambColor: 0x4a4a58, ambIntensity: 0.12,
    exposure: 1.05, skyColor: 0x8a7f80,
    env: { zenith: 0x4a5a78, horizon: 0xd88a50, ground: 0x3a3630, groundHorizon: 0x8a6a4a, intensity: 0.9 },
  },
  夜间: {
    sunColor: 0x8ac0e8, sunPos: [-18, 26, 14], sunIntensity: 0.38,
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
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.domElement.style.display = 'block';
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

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
  scene.add(sun);
  scene.add(sun.target);

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
  }
  /* 第一次一定要把时段照明跑一遍，否则后面 setTimeSlot 出来的时候默认值可能不一致 */
  applyTimeSlot(DEFAULT_SLOT);

  initMaterials();
  buildPalette();

  /* ── 角色 / 相机 ────────────────────────────────────────────────────── */
  const player = new Player(scene, [], new THREE.Vector3(0, 0, 10));
  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 400);
  const cam = new IsoCamera(camera, player.pos, []);

  let world = null;
  let currentId = null;
  let focused = null;
  let running = false;
  let rafId = 0;
  let last = 0;

  const keys = new Set();

  /* ── 尺寸 ───────────────────────────────────────────────────────────── */
  function resize() {
    const w = container.clientWidth || 1;
    const h = container.clientHeight || 1;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
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

  /* ── 地点加载 ───────────────────────────────────────────────────────── */
  function disposeWorld(w) {
    if (!w) return;
    w.group.traverse((o) => { if (o.isMesh && o.geometry) o.geometry.dispose(); });
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

    player.update(dt, keys, cam.yaw);
    cam.update(dt, player.pos);

    // 主光跟随角色，保证阴影贴图始终覆盖视野中心
    sun.position.set(player.pos.x + 16, 22, player.pos.z - 14);
    sun.target.position.copy(player.pos);
    sun.target.updateMatrixWorld();

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

    renderer.render(scene, camera);
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
  }
  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
    keys.clear();
  }
  function dispose() {
    stop();
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
    stats: { fps: 0, calls: 0, triangles: 0, build: null },
    scene: null, camera: null,
  };
}

export { palette };
