/**
 * 外部 3D 资产加载器（Kenney City Kit / CC0）
 *
 * 为什么单独一个模块：
 *   3D 内置几何（kit.js）是同步的、随包内的 —— 而外部 GLB 是**异步**的，
 *   且会失败（路径错、CSP 拦、离线直开 file://）。把这两种东西混在一起写，
 *   任何一处 await 失败都会变成白屏。
 *   所以这里把「异步」与「失败」两件事全部关在本模块内：
 *     对外只暴露一个同步可用的 get()，拿不到就返回 null，绝不抛。
 *
 * 设计约束（来自项目架构，不是随意选的）：
 *   ① 部署形态是 dist/index.html + dist/app.js 的离线分发，资产以
 *      `src/assets/` → `dist/assets/` 复制的方式自托管（路线 B）。
 *   ② CSP 是 default-src 'self'，所以运行时**只能 fetch 同源路径**。
 *   ③ 三套 kit 的 `Textures/colormap.png` 同名但内容不同（见 LICENSE.md），
 *      所以每个 GLB 必须从它自己 kit 的子目录加载，贴图才能解析对。
 *   ④ 加载失败必须能降级：调用方拿到 null 后回退到程序化几何。
 *
 * 用法：
 *   const assets = createAssetLoader();
 *   assets.warm(['commercial', 'roads']);        // 预热（不阻塞）
 *   const proto = assets.get('commercial', 'building-a');  // 同步取，可能为 null
 *   const inst  = assets.instance('roads', 'light-square', { x: 1, z: 2 });
 */

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
/* 清单随包内联（与 gamedata.json 同机制，走 esbuild 的 json loader）。
   这样 warm('commercial') 能枚举该 kit 的模型名，且不额外发请求。 */
import kenneyManifest from './kenney-manifest.json';

/** 资产根路径。相对 app.js（位于 dist/ 根），与 dist/assets/ 对应。 */
const ASSET_BASE_DEFAULT = 'assets/kenney/';

/* ★ 为什么要可覆盖：
   生产（dist/）里资产在 dist/assets/kenney/ —— 与 app.js 同级，故相对路径即可。
   但 dev 预览页是**从项目根**提供服务的（见 scripts/lib/serve.cjs），
   那时 'assets/kenney/' 会指向项目根下已有的 assets/（只放 icons），是 404。
   dev 侧的真实位置是 src/assets/kenney/。故允许注入 base。
   这样一套代码在两种布局下都成立，不必为了 dev 复制一份 8.5MB 资产。 */
let ASSET_BASE = ASSET_BASE_DEFAULT;

/** 覆盖资产根路径（供 dev 预览/验证脚本调用）。 */
export function setAssetBase(base) {
  if (typeof base === 'string' && base) ASSET_BASE = base.endsWith('/') ? base : base + '/';
}

/** 当前资产根路径（验证脚本读） */
export function assetBase() { return ASSET_BASE; }

/** 已知 kit 白名单 —— 防拼错路径，也让验证脚本能枚举。 */
export const KITS = ['commercial', 'industrial', 'roads'];

/* ── 单位换算：Kenney 模型的"1 单位"不是 1 米 ────────────────────────────────
   ★ 这是接入外部资产时最容易搞错、且症状最隐蔽的一点：
     模型看起来"加载成功了"，但尺寸小得几乎看不见 —— 画面里只有几个小点，
     不会有任何报错。实测（脚本读 GLB 的 POSITION accessor min/max）：

       物件              模型尺寸(单位)   真实应有尺寸   反推 m/unit
       road-crossroad    1.0 × 1.0        路口约 8m       ≈ 8
       construction-cone 0.094            锥约 0.7m       ≈ 7.4
       construction-barrier 0.225(长边)   围挡约 2.0m     ≈ 8.9
       building-a        0.884 宽         楼约 7-9m       ≈ 8-10

     三处独立物件一致指向 **≈ 8 m/unit**。故统一按 8 换算，
     再用逐物件微调表覆盖个别偏差（如路灯在 Kenney 里偏矮）。
   ─────────────────────────────────────────────────────────────────────── */
export const M_PER_UNIT = 8;

/** 逐物件缩放（等效"米/单位"）。为 null 者用 M_PER_UNIT 默认值。
    值由"模型实测尺寸 × 换算"与真实世界尺寸对齐后取定（见各条注释）。 */
const SIZE_OVERRIDE = {
  // 模型高 0.525 单位 → ×11 = 5.8m。城市电杆真实 6-9m，取 11 偏矮但协调（场景里是巷子小杆）。
  'roads/electricity-pole': 11,
  // 路灯模型高 0.6 → ×9.5 = 5.7m。街灯真实 5-8m，合适。
  'roads/light-square': 9.5,
  'roads/light-square-double': 9.5,
  'roads/light-curved': 9.5,
  // 垃圾箱模型 0.377 宽 → ×5 ≈ 1.9m。大型工业垃圾箱真实 1.5-2m，合适。
  'roads/dumpster': 5,
  /* 工业件要特别压：模型本身"格子比例"偏大，
     按 8 换算会得到 21m 烟囱 / 27m 水塔 / 24m 集装箱 —— 全部失真是"巨型化"。
     这些实物尺寸：烟囱 12-18m、水塔 10-15m、集装箱 6m。
     故按目标尺寸反推系数。 */
  'industrial/chimney-medium': 7,     // 1.925 × 7 ≈ 13.5m
  'industrial/chimney-large': 8,      // 更高大的型号
  'industrial/water-tower': 5.5,      // 2.278 × 5.5 ≈ 12.5m
  'industrial/shipping-container-a': 1.9,  // 3.047 × 1.9 ≈ 5.8m（标准 6m 集装箱）
  'industrial/shipping-container-b': 1.9,
  'industrial/shipping-container-c': 1.9,
  'industrial/detail-tank': 3.2,      // 0.415 × 3.2 ≈ 1.3m 直径的储罐
  'industrial/detail-tank-large': 4.4,
};

/* ── 为什么不用 DRACOLoader / KTX2Loader ────────────────────────────────
   Kenney 的 GLB 是未压缩的普通 glTF 2.0（几何走内嵌 BIN 缓冲，
   贴图是外部 PNG），既没有 Draco 压缩也没有 KTX2 纹理。
   引入这两个 loader 只会多出几 MB 的 wasm 解码器，白付成本。
   真要减面应当在上游做（Blender 批处理），而不是运行时解码。 */

/** 载入结果的三态：pending / ready / failed，给验证脚本读。 */
export const LOAD_STATE = { PENDING: 'pending', READY: 'ready', FAILED: 'failed' };

export function createAssetLoader() {
  const loader = new GLTFLoader();
  /** key = `${kit}/${name}` → { state, proto, error } */
  const cache = new Map();
  /** 某一批的等待者：warm 返回的 Promise 用得上 */
  const stats = { requested: 0, ready: 0, failed: 0 };

  const keyOf = (kit, name) => `${kit}/${name}`;

  function slot(kit, name) {
    const k = keyOf(kit, name);
    let s = cache.get(k);
    if (!s) {
      s = { state: LOAD_STATE.PENDING, proto: null, error: null };
      cache.set(k, s);
    }
    return s;
  }

  /**
   * 载入一个 GLB（幂等：同一个 key 只真正加载一次）。
   * **永不 reject** —— 失败写进 cache 的 error，返回 null。
   * @returns {Promise<THREE.Object3D|null>}
   */
  function load(kit, name) {
    const s = slot(kit, name);
    if (s.state === LOAD_STATE.READY) return Promise.resolve(s.proto);
    if (s.state === LOAD_STATE.FAILED) return Promise.resolve(null);
    if (s._inflight) return s._inflight;

    stats.requested++;
    const url = `${ASSET_BASE}${kit}/${name}.glb`;

    s._inflight = new Promise((resolve) => {
      loader.load(
        url,
        (gltf) => {
          s.state = LOAD_STATE.READY;
          s.proto = gltf.scene;
          stats.ready++;
          resolve(s.proto);
        },
        undefined,
        (err) => {
          s.state = LOAD_STATE.FAILED;
          s.error = (err && err.message) || String(err);
          stats.failed++;
          /* ★ 这里刻意 console.warn 而不是 throw：
             单个模型缺失不该让整个 3D 场景挂掉 —— 调用方会降级到程序化几何。 */
          console.warn(`[assets] 载入失败 ${url}: ${s.error}`);
          resolve(null);
        }
      );
    });
    return s._inflight;
  }

  /**
   * 预热一批 kit 的常用模型（不阻塞主流程）。
   * @param {Array<[string,string]|string>} items  [kit,name] 或 kit 名（kit 名表示整个 kit）
   * @returns {Promise<number>} 成功载入数
   */
  function warm(items = []) {
    const jobs = [];
    for (const it of items) {
      if (Array.isArray(it)) jobs.push(load(it[0], it[1]));
      else if (typeof it === 'string') {
        // kit 名：载入该 kit 的清单（清单是随包 JSON，不走网络）
        for (const e of listOf(it)) jobs.push(load(it, e.name));
      }
    }
    return Promise.all(jobs).then((rs) => rs.filter(Boolean).length);
  }

  /** 同步取原型（未载入或失败 → null）。调用方必须处理 null。 */
  function get(kit, name) {
    const s = cache.get(keyOf(kit, name));
    return s && s.state === LOAD_STATE.READY ? s.proto : null;
  }

  /**
   * 克隆一个实例并摆位。原型未就绪时返回 null（调用方降级）。
   *
   * ★ 用 clone() 而不是每次 load：
   *   GLB 解析出的 scene 可被复用，clone 只复制 Object3D 树与材质引用，
   *   几何（BufferGeometry）默认**共享**，所以 29 个地点里放 50 个同款路灯
   *   不会带来 50 份顶点数据。
   * @param {object} pose {x,y,z,rotY,scale}
   * @returns {THREE.Object3D|null}
   */
  function instance(kit, name, pose = {}) {
    const proto = get(kit, name);
    if (!proto) return null;
    const obj = proto.clone(true);
    obj.position.set(pose.x || 0, pose.y || 0, pose.z || 0);
    if (typeof pose.rotY === 'number') obj.rotation.y = pose.rotY;
    /* ★ 尺寸换算（见上方 M_PER_UNIT 的长注释）：
       Kenney 的 1 单位 ≈ 8m。不换算的话模型会小到几乎看不见，
       而且**不报错** —— 只是画面里多了几个小点。
       pose.scale 若显式给出则优先（调用方可覆盖）。 */
    const target = SIZE_OVERRIDE[`${kit}/${name}`];
    const s = typeof pose.scale === 'number' ? pose.scale : (target ? target : M_PER_UNIT);
    obj.scale.setScalar(s);
    obj.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        /* ★ 标记来源：GLB 的几何是**缓存共享**的（clone 只复制 Object3D 树，
           几何默认共享同一份 BufferGeometry）。disposeWorld 靠这个标记
           跳过它们 —— 否则切一次地点就会把缓存原型的几何 dispose 掉，
           之后所有实例都渲染成空白（而且不报错，只是"东西不见了"）。 */
        o.userData.glbSourced = true;
      }
    });
    return obj;
  }

  /** 供验证脚本与调试面板读取的运行态快照。 */
  function report() {
    const byState = { pending: 0, ready: 0, failed: 0 };
    const failures = [];
    for (const [k, s] of cache) {
      byState[s.state]++;
      if (s.state === LOAD_STATE.FAILED) failures.push({ key: k, error: s.error });
    }
    return { ...stats, byState, failures, cached: cache.size };
  }

  return {
    load, warm, get, instance, report, cache,
    /** 覆盖本实例的资产根路径（dev 布局用）。 */
    setBase(base) { setAssetBase(base); },
  };
}

/* ── 清单：随包内联，避免运行时再发一次请求 ──────────────────────────────
   源文件 src/assets/kenney/manifest.json，构建期复制为
   src/app/3d/kenney-manifest.json 并被 esbuild 内联（同 gamedata.json）。
   清单缺失也不致命 —— 上层 import 会直接报错暴露问题，故这里不再兜底。 */

/** 列出某 kit 的模型条目（来自清单）。 */
export function listOf(kit) {
  return (kenneyManifest && kenneyManifest[kit]) || [];
}

/**
 * 按 kit 生成"该地点用哪些模型"的确定性选取。
 * ★ 用确定性哈希而不是 Math.random：
 *   同一地点每次进入必须是同一批楼，否则玩家会觉得场景在"跳"；
 *   而且验证脚本无法复现断言。
 * @param {string} kit
 * @param {string} seed  地点 id（同 id 同结果）
 * @param {number} n     要几个
 * @returns {Array} 条目数组
 */
export function pickFor(kit, seed, n) {
  const all = listOf(kit);
  if (!all.length) return [];
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const out = [];
  for (let i = 0; i < n; i++) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    out.push(all[Math.abs(h) % all.length]);
  }
  return out;
}
