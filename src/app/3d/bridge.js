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

/** 晦暗调常量 —— 与 experiments/3d/src/main.js 保持一致，勿随意调整 */
const TONE = {
  sky: 0x59615a,
  fog: { color: 0x555c55, density: 0.0155 },
  hemi: { sky: 0x7d8d96, ground: 0x42443c, intensity: 1.5 },
  sun: { color: 0xd8caa8, intensity: 2.15, pos: [16, 20, -14], shadowSize: 2048, frustum: 40 },
  ambient: { color: 0x515861, intensity: 0.9 },
  exposure: 1.3,
};

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

  scene.add(new THREE.AmbientLight(TONE.ambient.color, TONE.ambient.intensity));

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

  /* ── 地点加载 ───────────────────────────────────────────────────────── */
  function disposeWorld(w) {
    if (!w) return;
    w.group.traverse((o) => { if (o.isMesh && o.geometry) o.geometry.dispose(); });
    scene.remove(w.group);
  }

  function loadLocation(id) {
    if (!data.locations[id]) {
      opts.onError?.(new Error(`未知地点: ${id}`));
      return null;
    }
    const t0 = performance.now();
    disposeWorld(world);

    world = buildLocation(scene, data, id);
    const mergeStat = mergeStatics(world.group);
    const counts = countScene(world.group);

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
    locationId: null, hotspot: null, hotspots: [], playerPos: { x: 0, z: 0 },
    stats: { fps: 0, calls: 0, triangles: 0, build: null },
    scene: null, camera: null,
  };
}

export { palette };
