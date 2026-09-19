import * as THREE from 'three';
/* ★ [2026-09-19] 外部真实扫描贴图（Poly Haven CC0）。本文件是**程序化**贴图，
   两者并存：真实贴图优先、程序化作兜底。只在这里读它的读数与绑定接口 ——
   依赖是单向的（materials → textures），textures 不反向依赖本文件。 */
import { bindTexture, texMeters } from './textures.js';

/** 材质上所有**带 repeat 的贴图槽位**。
    ★ 单一真源：fitRepeat() 与任何"成对克隆"的地方都遍历它。
      历史事故：只克隆 map 不克隆 normalMap → 颜色密度与凹凸密度差十几倍，
      表现为"远处还行、走近纹理全乱"，不报错。后来加了 roughnessMap（arm），
      同一个坑会再踩一次 —— 所以改成名单驱动。 */
const TEXTURE_SLOTS = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'emissiveMap', 'bumpMap', 'displacementMap'];

/** 导出给 palette.js / 验证脚本用 —— 名单必须只有一份（单一真源）。 */
export { TEXTURE_SLOTS };

/* ── Canvas 程序化纹理 ─────────────────────────────────────────────────────
   全部在运行时生成，无外部图片依赖。这样 29 个地点可以参数化扩展，
   不需要为每栋楼单独出图，风格也不会散。

   ══ [2026-09-18 美术 P1-1 / P3-1] 本次三项改动 ══════════════════════════

   【P1-1 程序化法线贴图】这是"看不出砖 / 水泥 / 瓷砖区别"的第二大原因
   （第一大是 roughness，已由 aed88a0b 修）。没有法线贴图时所有表面在光照下
   都是平的 —— 砖缝只表现为颜色深浅，不产生任何明暗起伏。
   做法：每种纹理同时画一张**高度图**（缝 = 暗、砖面 = 亮），
   再用 Sobel 差分转成法线贴图。纯 Canvas 运算，零外部资产。

   ★ 法线贴图的 colorSpace 必须是 NoColorSpace（默认值）。
     设成 SRGBColorSpace 会把法线做一次 sRGB 解码，方向被扭曲 ——
     这个错误很隐蔽：不报错、不崩溃，只是光照"看起来怪怪的"，极难定位。

   【P3-1 纹理分辨率 + tile 密度】
   外墙类提到 1024²。更关键的是 tile 的真实米数：原来一个纹理格覆盖
   3.2~4.5m，一块"砖"在屏幕上占的面积过大 —— 看起来像贴纸而不是砖墙。
   现在统一按 §8.4「真实构件尺寸」反推像素数：
       标准砖 240×115mm（灰缝 10mm）· 瓷砖 200×300mm
       铺装砖 300×300mm · 幕墙分格 1200mm · 卷帘门片 75mm
   人眼正是靠"砖有多大、缝有多宽"来判断尺度的 —— 尺寸不对，大脑读不出那是砖。

   ★ 无缝接缝：先取**整数格数**，再由 `pitch = texPx / count` 反推像素步长。
     若直接取整像素步长，`count × pitch ≠ texPx`，RepeatWrapping 的接缝处
     会错位成一道明显的接缝线。

   【性能】原来的 grain() 是逐像素 getImageData 循环。256² 时无所谓，
   1024² 是 16 倍像素量，而每个地点都要重建一遍纹理 —— 会明显卡住首次进入。
   现改成一张 256×256 噪点图 + createPattern 平铺填充，一次 fillRect 搞定。
   ──────────────────────────────────────────────────────────────────────── */

/** 一个纹理格覆盖的真实米数 —— 全部材质的密度基准。
    ★ 这个值必须和消费方（kit.js 的 fitRepeat / world.js 的 tileMat）一致。
    原来消费方写死 3.2~4.5m，比真实尺寸大近 2 倍，是"像贴纸"的主因。 */
export const TILE_M = 2.4;

/** 分辨率分档：
    EXT  —— 有结构的外墙类（砖缝 / 瓷砖缝 / 幕墙框），要读得出缝，必须 1024
    NOISE —— 噪声主导、没有结构可读的（水泥 / 沥青 / 草地），512 足够 */
const EXT = 1024;
const NOISE = 512;

/** 真实尺寸（毫米）→ 像素步长。
    tileM 是"这一格纹理覆盖多少米"——同一张砖纹，铺在 2.4m 一格的立面上
    与铺在 4.5m 一格的地面上，砖的**真实大小**必须一致，所以步长要跟着 tileM 变。 */
const px = (realMm, texPx = EXT, tileM = TILE_M) => (realMm / 1000 / tileM) * texPx;

/** 真实尺寸 → **能整除纹理尺寸**的格数。
    先定格数再反推步长，接缝才不会错位（见文件头说明）。
    even=true 用于需要半砖错缝的图案：行数为偶数，错缝才是周期性的。 */
function gridCount(realMm, texPx, even = false, tileM = TILE_M) {
  let n = Math.max(2, Math.round(texPx / px(realMm, texPx, tileM)));
  if (even && n % 2) n += 1;
  // 兜底：别让格数超过纹理像素数（会导致步长 < 1px）
  return Math.min(n, texPx);
}

/* ── 消费方的 tile 尺度（**必须与调用方一致**）─────────────────────────────
   ★ 项目现状：平铺密度由**消费方**决定，不是纹理自己决定。
     · kit.js 立面 → fitRepeat(w, h)，tile = TILE_M(2.4)
     · world.js 地面 → tileMat(base, w, l, **4.5**)，草地显式传 3.0
   所以"给地面用的纹理"必须按 4.5m 去画图案，否则 300mm 的铺装砖
   在屏上会显示成 562mm —— 这正是"贴纸感"的一半来源。
   [待协调] world.js:78 的 4.5 建议改为 TILE_M 统一入口（B 无权改该文件）。 */
export const GROUND_TILE_M = 4.5;   // world.js::tileMat 默认值
export const GRASS_TILE_M = 3.0;    // world.js 显式传的值

/* ── 底层工具 ──────────────────────────────────────────────────────────── */

function canvas(w = NOISE, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

/* 纹理元数据登记表 —— 给验证脚本一个可观测读数。
   ★ 项目的历史教训（3D_ART_SPEC §4）：**静默失效是常态**。
     "路灯的生成代码写死在 if (kind === 'avenue') 里，于是城中村从来没有路灯，
      而逐行看代码全都对。" —— 所以宁可多留读数，也不要靠反复调参数去猜。 */
const _surfaces = [];
let _normalCount = 0;
/* 平面标识物：本来就是平的、不该有凹凸 —— 覆盖率统计要排除它们。
   ★ 下面这份名单是**单一真源**：验证脚本必须消费 `normalCoverage` 读数，
     不要自己再抄一份。2026-09-19 踩过 —— 脚本侧抄了一份旧名单，
     新增三个平面 kind 后源码侧已 100%、脚本侧却报 81/103 假红。 */
const PLANAR_KINDS = ['sign', 'glass', 'poster', 'flyer', 'banner'];

const _matDebug = {
  tileM: TILE_M, ext: EXT, noise: NOISE,
  surfaces: _surfaces,
  get normalMapsBuilt() { return _normalCount; },
  /** 法线贴图覆盖率：非平面类表面中，有高度图（= 能生成法线）的比例。
      必须用 getter —— `_surfaces` 随世界构建持续增长，快照会过期。
      ★ 挂在这里而不是只写在 materialDebug() 里：验证脚本读的是
        `window.__matDebug`，函数返回值它拿不到。 */
  get normalCoverage() {
    const shouldn = _surfaces.filter((s) => !PLANAR_KINDS.includes(s.kind));
    return {
      expected: shouldn.length,
      withHeight: shouldn.filter((s) => s.hasHeight).length,
    };
  },
};
if (typeof window !== 'undefined') window.__matDebug = _matDebug;

/* 供 world.js 占位引用 —— 该文件 `palette().common.stone` 被当成院子水泥地底用了 */
export const groundKinds = ['concrete', 'asphalt', 'paver', 'stone', 'grass', 'slab'];

function toTexture(c, opt = {}) {
  const {
    normalScale = 1, kind = 'tex', metersPerRepeat = TILE_M,
    height = null, clamp = false, repeat = null,
  } = opt;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;   // 颜色贴图走 sRGB
  t.wrapS = t.wrapT = clamp ? THREE.ClampToEdgeWrapping : THREE.RepeatWrapping;
  if (repeat) t.repeat.set(repeat[0], repeat[1]);
  t.anisotropy = 8;
  const groundFriendly = groundKinds.includes(kind);   // 用给地面也不违和
  t.userData.surface = {
    kind, resolution: c.width, metersPerRepeat, normalScale,
    hasHeight: !!height, height, groundFriendly,
  };
  _surfaces.push({
    kind, resolution: c.width, heightResolution: height ? height.width : 0,
    metersPerRepeat, normalScale, hasHeight: !!height, groundFriendly,
  });
  return t;
}

/* ── 噪点：一次 fillRect 代替逐像素循环 ──────────────────────────────────
   原实现是 `getImageData` + `for (i += 4) d[i] += n` 的逐像素循环。
   1024² = 100 万像素 × 4 通道，每个地点重建一次 → 首次进入明显卡顿。
   换成 256×256 噪点图 + createPattern 平铺：**保留高频**（不像放大 64² 那样
   变成模糊的斑块），成本从 100 万次运算降到 1 次 fillRect。 */
let _noiseTile = null;
function noiseTile() {
  if (_noiseTile) return _noiseTile;
  const s = 256;
  const c = canvas(s, s), ctx = c.getContext('2d');
  const img = ctx.createImageData(s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  _noiseTile = c;
  return c;
}

/** 颗粒。amount 越大越粗（沿用原来的量纲，0~30 左右）。
    overlay 混合：>128 提亮、<128 压暗 —— 正是颗粒该有的行为。 */
function grain(ctx, w, h, amount) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(0.85, amount / 60);
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(noiseTile(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function blotch(ctx, w, h, count, color, maxR = 26) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = color(Math.random());
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, 4 + Math.random() * maxR, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ── 高度图 → 法线贴图（Sobel 差分）──────────────────────────────────────
   N = (-dH/du, -dH/dv, 1) 归一化后映射到 [0,1] 存 RGB。
   Sobel 核的正权重和为 4，故除以 4 把梯度归一到 [-1,1]，再乘一个固定强度。
   分材质的强弱由材质上的 `normalScale` 调（见 3D_ART_SPEC.md §6.2），
   不放在这里 —— 同一个高度图可能被多处复用，缓存才成立。 */
const SOBEL_STRENGTH = 1.9;

/* ★ 2026-09-19 导出：面部法线贴图（actors.js::faceNormal）要复用同一份实现。
   复制一份 Sobel 到 actors.js 的代价不是"多十几行"，而是**两处的强度、
   v 轴方向约定会各自漂移** —— 那正是本项目反复踩的"同一件事两份定义"。
   （调用方拿到后需要自己改 wrapS/T 为 ClampToEdge：这里是给**可平铺**的
     墙面/地面用的，脸只画一圈、不能环绕。） */
export function normalFromHeight(hc) {
  const w = hc.width, h = hc.height;
  const src = hc.getContext('2d').getImageData(0, 0, w, h).data;

  const out = canvas(w, h);
  const octx = out.getContext('2d');
  const dst = octx.createImageData(w, h);

  /* 环绕取样：纹理是 RepeatWrapping，边缘必须 wrap 到对侧，
     否则每张纹理的四条边会出现一条接缝（法线在边界处突变）。 */
  const H = (x, y) => {
    const xi = ((x % w) + w) % w, yi = ((y % h) + h) % h;
    return src[(yi * w + xi) * 4] / 255;
  };

  const k = SOBEL_STRENGTH / 4;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const tl = H(x - 1, y - 1), t = H(x, y - 1), tr = H(x + 1, y - 1);
      const l = H(x - 1, y), r = H(x + 1, y);
      const bl = H(x - 1, y + 1), b = H(x, y + 1), br = H(x + 1, y + 1);
      const dX = (tr + 2 * r + br) - (tl + 2 * l + bl);
      const dY = (bl + 2 * b + br) - (tl + 2 * t + tr);

      /* v 轴方向：CanvasTexture 默认 flipY=true，画布的下边缘对应 uv.y=0，
         故 dH/d(uv.y) = -dH/dy画布，于是 ny = -dH/d(uv.y) = +dY。 */
      let nx = -dX * k, ny = dY * k, nz = 1;
      const len = Math.hypot(nx, ny, nz) || 1;
      nx /= len; ny /= len; nz /= len;

      const i = (y * w + x) * 4;
      dst.data[i] = (nx * 0.5 + 0.5) * 255;
      dst.data[i + 1] = (ny * 0.5 + 0.5) * 255;
      dst.data[i + 2] = (nz * 0.5 + 0.5) * 255;
      dst.data[i + 3] = 255;
    }
  }
  octx.putImageData(dst, 0, 0);

  const t = new THREE.CanvasTexture(out);
  t.colorSpace = THREE.NoColorSpace;   // ★★ 法线不是颜色。写成 sRGB 会扭曲方向且不报错。
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  t.name = 'normal';
  _normalCount++;
  return t;
}

/* 一张高度图只转一次法线（WeakMap 跟着 canvas 生命周期回收）。 */
const _normalCache = new WeakMap();
function normalFor(hc) {
  if (!hc) return null;
  let t = _normalCache.get(hc);
  if (!t) { t = normalFromHeight(hc); _normalCache.set(hc, t); }
  return t;
}

/** 灰度画笔：往高度图上画。v=255 最高（凸），v=0 最低（缝）。 */
function hPen(ctx) {
  return (v, alpha = 1) => {
    ctx.fillStyle = `rgba(${v},${v},${v},${alpha})`;
  };
}

/* ── 供 palette.js / kit.js 用的材质工厂 ──────────────────────────────── */

/**
 * 建一个带 map + 法线贴图的 MeshStandardMaterial。
 * normalScale 优先取显式传参，否则取纹理自带的建议值（§6.2）。
 * @param {THREE.Texture} tex  纹理生成器的返回值
 * @param {object} opts        roughness / metalness / color / envMapIntensity 等
 */
export function surfaceMat(tex, opts = {}) {
  const { normalScale, ...rest } = opts;
  const mat = new THREE.MeshStandardMaterial({ map: tex, ...rest });
  const surf = tex && tex.userData ? tex.userData.surface : null;
  const ns = normalScale != null ? normalScale : (surf ? surf.normalScale : 0);
  const nm = normalFor(surf && surf.height);
  if (nm) {
    mat.normalMap = nm;
    mat.normalScale.set(ns, ns);
  }
  return mat;
}

/**
 * 按真实尺寸把一个材质铺到立面上 —— **同时同步 map 与 normalMap 的 repeat**。
 *
 * ★ 为什么必须有这个函数：原来 kit.js 是手写
 *     `mat.map = wallMat.map.clone(); mat.map.repeat.set(w/3.2, h/3.2);`
 *   只克隆了 map。加了法线贴图之后，克隆出来的材质会**共用**同一张
 *   normalMap（repeat 停在 1,1）→ 颜色密度与凹凸密度差十几倍，
 *   表现是"远处看着还行，走近纹理全糊/全乱"，而且不报错。
 *   所以克隆必须成对，这里把它封成一个函数，避免以后再漏。
 *
 * @param {THREE.MeshStandardMaterial} base 基准材质（含 map / normalMap 原型）
 * @param {number} wM 立面真实宽（米）
 * @param {number} hM 立面真实高（米）
 * @param {number} [tileM] 一个纹理格多少米（默认 TILE_M）
 */
export function fitRepeat(base, wM, hM, tileM = TILE_M) {
  const mat = base.clone();

  /* ★ [2026-09-19] 真实贴图优先：贴了扫描贴图的材质，一格**必须**换成
       贴图的真实米数。扫描贴图是按真实尺寸扫的（Poly Haven 的 dimensions），
       继续按程序化的 TILE_M 铺，砖在屏上就大了或小了几成 ——
       而人眼正是靠"砖有多大"判断尺度的（见文件头 P3-1）。

       ★ 这里**刻意不看加载状态**（`texReady`）：尺度必须在建世界时就定死。
         若改成"加载好了才用真实米数"，贴图到位的那一瞬间整条街的砖会突然
         缩放一下 —— 比一直用错尺寸更显眼，而且截图取证时会对不上。
         代价：贴图**加载失败**时，程序化内容会按真实米数铺（略偏小）。
         那个代价可以接受：失败路径下画面本来就已经退化了。 */
  const bind = base.userData && base.userData.texBind;
  const tm = bind ? (texMeters(bind.as) || tileM) : tileM;
  const rx = Math.max(1e-4, wM / tm);
  const ry = Math.max(1e-4, hM / tm);

  /* ★ 克隆必须**遍历全部贴图槽位**，不能只克隆 map 与 normalMap。
       本函数原来的注释已经记过一次同类事故（只克隆 map 导致法线密度差十几倍），
       现在槽位又多了一个 roughnessMap（真实贴图的 arm）——
       漏掉它，颜色密度与粗糙度密度就会不一致，表现是"有的地方反光糊成一片"，
       而且不报错。所以这里改成按名单遍历，新增槽位不用再改这个函数。 */
  for (const slot of TEXTURE_SLOTS) {
    if (!base[slot]) continue;
    mat[slot] = base[slot].clone();
    mat[slot].needsUpdate = true;
    mat[slot].repeat.set(rx, ry);
  }

  /* ★ 克隆体也要继承绑定。否则热替换只换到基准材质，
       真正贴在墙上的克隆体还停在程序化贴图上 ——
       正是本项目最典型的"改了但没效果"。 */
  if (bind) bindTexture(mat, bind.as);
  return mat;
}

/**
 * 把材质的 normalMap.repeat 对齐到 map.repeat。
 *
 * ★ 这个函数存在的唯一理由是**跨文件协作**：
 *   `world.js::tileMat()` 只克隆 map 并设 repeat：
 *       const m = base.clone();
 *       m.map = base.map.clone();
 *       m.map.repeat.set(w/tile, l/tile);   // ← 没有 normalMap
 *   于是地面材质的凹凸密度停在 1×1，而颜色密度是 40×40 —— 走近看就是
 *   "颜色是大砖、凹凸是整面糊的"，不报错。
 *
 *   B 无权改 world.js，所以这里提供一行可调用的补丁：
 *   在 tileMat 的 return 前加 `syncNormalRepeat(m);` 即可。
 *   （Agent A 若看到本条，请在接真游戏时顺手加上；不加也不会崩，
 *     只是地面法线退化 —— 已在验证脚本里作为**已知偏差**单独记录。）
 */
export function syncNormalRepeat(mat) {
  /* ★ [2026-09-19] 从"只管 normalMap"改成**遍历全部贴图槽位**。
     原来只同步 map 与 normalMap，而真实扫描贴图引入了第三个槽位
     roughnessMap（arm）—— 漏掉它，颜色密度与粗糙度密度就会不一致，
     表现是"有些区域反光糊成一片"，而且不报错。
     改成名单驱动之后，以后再新增槽位不用回来改这个函数。 */
  if (mat && mat.map) {
    for (const slot of TEXTURE_SLOTS) {
      if (slot === 'map' || !mat[slot]) continue;
      mat[slot].repeat.copy(mat.map.repeat);
      mat[slot].needsUpdate = true;
    }
  }
  return mat;
}

/* ══ 纹理生成器 ═══════════════════════════════════════════════════════════
   每个生成器画两张图：
     ① 颜色图（彩色，走 sRGB）
     ② 高度图（灰度，只有"结构"——缝、裂纹、棱）
   高度图刻意只画结构而不画脏污/水渍：那些是颜色变化，不该有高度。
   ══════════════════════════════════════════════════════════════════════ */

/* 瓷砖外墙：城中村最常见的白瓷砖，发霉发黑。
   真实规格 200×300mm 长方形砖 —— 用**矩形**而不是正方形，
   因为"长方形 + 灰缝"才是大脑认出瓷砖的关键特征。 */
export function tileWallTex(opt = {}) {
  const {
    base = '#c9c6bc', grout = '#9c9a90',
    tileWMM = 200, tileHMM = 300, water = 16, metersPerRepeat = TILE_M,
  } = opt;
  const N = EXT;
  const cols = gridCount(tileWMM, N, false, metersPerRepeat);
  const rows = gridCount(tileHMM, N, false, metersPerRepeat);
  const tw = N / cols, th = N / rows;

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');
  const h = hPen(hctx);

  // 高度图：先整面"砖面"（凸），再把灰缝画成凹槽
  hctx.fillStyle = '#e8e8e8'; hctx.fillRect(0, 0, N, N);
  h(70);
  for (let x = 0; x <= N; x += tw) hctx.fillRect(x - 1, 0, 2.4, N);
  for (let y = 0; y <= N; y += th) hctx.fillRect(0, y - 1, N, 2.4);

  // 颜色图
  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  ctx.strokeStyle = grout; ctx.lineWidth = 2.2;
  for (let x = 0; x <= N; x += tw) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, N); ctx.stroke(); }
  for (let y = 0; y <= N; y += th) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(N, y); ctx.stroke(); }

  // 每块砖的明度微扰 —— 真实瓷砖不会是同一个白
  for (let r = 0; r < rows; r++) {
    for (let q = 0; q < cols; q++) {
      const v = 0.92 + Math.random() * 0.16;
      ctx.fillStyle = `rgba(255,255,255,${(v - 1) * 0.35})`;
      ctx.fillRect(q * tw + 1.6, r * th + 1.6, tw - 3.2, th - 3.2);
    }
  }

  // 流挂水渍（城中村墙面最标志性的脏）
  for (let i = 0; i < water; i++) {
    const x = Math.random() * N;
    const g = ctx.createLinearGradient(x, 0, x, N);
    g.addColorStop(0, `rgba(74,78,68,${0.10 + Math.random() * 0.18})`);
    g.addColorStop(1, 'rgba(74,78,68,0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, 0, 12 + Math.random() * 34, N);
  }
  blotch(ctx, N, N, 90, a => `rgba(62,66,58,${0.03 + a * 0.07})`, 60);

  /* §8.3 接触暗化：立面底部压暗（物体与地面交界处最暗，互相遮挡天空光）。
     人眼把这层暗读成"这东西真的放在这儿"。 */
  const g2 = ctx.createLinearGradient(0, N * 0.72, 0, N);
  g2.addColorStop(0, 'rgba(56,60,50,0)');
  g2.addColorStop(1, 'rgba(56,60,50,0.42)');
  ctx.fillStyle = g2; ctx.fillRect(0, N * 0.72, N, N * 0.28);

  grain(ctx, N, N, 14);
  return toTexture(c, { kind: 'tileWall', normalScale: 1.0, height: hc, metersPerRepeat });
}

/* 水泥 / 混凝土：湿、脏、有裂缝。
   §6.2：normalScale 0.4~0.6。噪声主导、无结构可读 → 保持 512（P3-1 明确）。 */
export function concreteTex(opt = {}) {
  const { base = '#7e8078', crack = 18, wet = 0.35, metersPerRepeat = TILE_M } = opt;
  const N = NOISE;
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');
  const h = hPen(hctx);

  hctx.fillStyle = '#b4b4b4'; hctx.fillRect(0, 0, N, N);

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  blotch(ctx, N, N, 60, a => `rgba(52,55,50,${0.02 + a * 0.06})`, 34);
  blotch(ctx, N, N, 30, a => `rgba(150,150,142,${0.015 + a * 0.04})`, 22);

  // 裂缝：颜色上是一条暗线，高度上是一条凹槽 —— 两者必须同一位置
  ctx.strokeStyle = 'rgba(42,45,40,0.5)';
  h(58);
  for (let i = 0; i < crack; i++) {
    const lw = 0.6 + Math.random() * 1.3;
    ctx.lineWidth = lw;
    hctx.lineWidth = lw + 0.6;
    const pts = [];
    let x = Math.random() * N, y = Math.random() * N;
    pts.push([x, y]);
    for (let s = 0; s < 5; s++) {
      x += (Math.random() - 0.5) * 46;
      y += (Math.random() - 0.5) * 46;
      pts.push([x, y]);
    }
    /* ★ 画两遍：原位置 + 右移一整格（N）。
       纹理是 RepeatWrapping，跨边界的裂缝如果只画一次，右边那条边会"断头"。
       注意这里是「两条折线」，不是「一个点数组」——
       早先写成 `for (const [px_, py] of [path, shifted])` 是错的：
       那会把"折线数组"当成"坐标点"来解构，于是 px_ 拿到一个点、py 拿到下一个点，
       点少的时候 py 直接是 undefined → 运行时报 "number is not iterable"。
       正确写法就是下面这样，直接对两条折线各来一遍。 */
    for (const line of [pts, pts.map(([a, b]) => [a + N, b])]) {
      ctx.beginPath(); hctx.beginPath();
      line.forEach(([a, b], i2) => { if (i2) { ctx.lineTo(a, b); hctx.lineTo(a, b); } else { ctx.moveTo(a, b); hctx.moveTo(a, b); } });
      ctx.stroke(); hctx.stroke();
    }
  }

  if (wet > 0) {
    for (let i = 0; i < 10; i++) {
      const g = ctx.createRadialGradient(
        Math.random() * N, Math.random() * N, 2,
        Math.random() * N, Math.random() * N, 30 + Math.random() * 50);
      g.addColorStop(0, `rgba(38,44,46,${wet * 0.5})`);
      g.addColorStop(1, 'rgba(38,44,46,0)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, N, N);
    }
  }
  grain(ctx, N, N, 26);
  grain(hctx, N, N, 18);
  return toTexture(c, { kind: 'concrete', normalScale: 0.5, height: hc, metersPerRepeat });
}

/* 大块水泥板 / 石板地面 —— 对齐《大多数》的地面。
   [2026-09-19] 为什么要新增一种，而不是调 concreteTex 的参数：

     ① concreteTex 是**给墙面**设计的 —— 裂缝是墙的特征，不是地面的。
        拿它铺地面时，22 条裂缝按 2.4m 平铺 → 每 2.4m 重复一簇裂纹，
        在 190m 的地面上就是一片**规律重复的龟裂纹**，一眼假。
        （实测证据：角色取证截图 1-street-lane-day.png 里，整条街的
          X 形裂纹在屏幕上整齐地重复了十几遍。）
     ② 参照《大多数》的实机画面，它的地面是**约 1m 见方的大板材**：
        板缝清晰、板与板之间有明度差、偶有水渍油渍 —— 几乎没有裂缝。

     所以这是一次「换成对的结构」，不是调参。

   ★ 板缝必须是**清晰的直线网格**。人眼正是靠这个网格读出地面的尺度与远近；
     板缝一糊，地面就变成"一大片灰"，空间关系整个塌掉 ——
     这比"纹理不好看"严重得多。 */
export function slabTex(opt = {}) {
  const {
    base = '#7b786e', slabMM = 900, jointMM = 14,
    metersPerRepeat = GROUND_TILE_M, stain = 6, tone = 0.11, crack = 2,
  } = opt;
  const N = EXT;
  const n = gridCount(slabMM, N, false, metersPerRepeat);
  const cell = N / n;
  const joint = Math.max(2, px(jointMM, N, metersPerRepeat));

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  // 高度图：板面平（凸），板缝凹下去
  hctx.fillStyle = '#dedede'; hctx.fillRect(0, 0, N, N);

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);

  /* ① 每块板一个独立的明度 —— 真实水泥板没有两块是同一个色。
        ★ 这是"看起来像铺装"而不是"一块印了格子的布"的关键。

        ★★ 幅度与分布**都**要对（这一条踩过坑，别退回去）：
           第一版写成 `d = (Math.random()-0.5)*tone`，tone=0.16，再乘 1.7
           放大 —— 相邻两块板可以一个 -17% 一个 +17%，平铺出来是**棋盘格**，
           而且是"拼贴花砖"那种棋盘格，比原来的裂纹更假。
           实测证据：dev/_3dtest/slabtex-probe.png（三块贴图并排看），
           以及角色取证截图 1-street-lane-day.png 的地面。

           对照《大多数》实机（ss3.jpg 人行道）：相邻板只差 3~5%，
           大多数板**接近同一个底色**，只有少数几块明显偏深/偏浅。
           所以这里用 pow(2.2) 把分布压成"绝大多数接近 0、少数拉开"，
           并且 alpha 不再额外放大。tone 是**上限**，不是典型值。 */
  for (let r = 0; r < n; r++) {
    for (let q = 0; q < n; q++) {
      const t = (Math.random() - 0.5) * 2;                       // -1..1
      const d = Math.sign(t) * Math.pow(Math.abs(t), 2.2) * tone; // 偏向 0
      ctx.fillStyle = d > 0 ? `rgba(255,255,255,${d})` : `rgba(0,0,0,${-d})`;
      ctx.fillRect(q * cell, r * cell, cell, cell);
    }
  }

  /* ② 板缝。
        ★ 先铺一条**更宽的暗晕**再压清晰的缝线：真实的缝里积灰，
          缝两侧各有一条 5~8mm 的过渡带。没有这条晕，缝就只是
          "用尺子画上去的直线"，板面像一整块贴纸。 */
  const vline = (x, w, color, tgt) => {
    tgt.fillStyle = color;
    for (const dx of [-N, 0, N]) tgt.fillRect(x + dx - w / 2, 0, w, N);
  };
  const hline = (y, w, color, tgt) => {
    tgt.fillStyle = color;
    for (const dy of [-N, 0, N]) tgt.fillRect(0, y + dy - w / 2, N, w);
  };
  const halo = Math.max(joint * 3, 4);
  for (let i = 0; i < n; i++) {
    vline(i * cell, halo, 'rgba(40,42,38,0.10)', ctx);
    hline(i * cell, halo, 'rgba(40,42,38,0.10)', ctx);
  }

  /* ★ 必须画三遍（x-N / x / x+N）——
        纹理是 RepeatWrapping，只在 x=0 画一次的话左边缘那条缝
        只有一半宽度，接缝处会出现一道**粗细不均的缝**。 */
  for (let i = 0; i < n; i++) {
    vline(i * cell, joint, 'rgba(36,38,34,0.44)', ctx);
    vline(i * cell, joint, '#565656', hctx);
    hline(i * cell, joint, 'rgba(36,38,34,0.44)', ctx);
    hline(i * cell, joint, '#565656', hctx);
    /* 缝的受光侧提亮一线 —— 板边被磨圆的倒角会捕到一条细高光，
       没有它，缝就只是"画上去的两条黑线"。 */
    vline(i * cell + joint * 0.75, 2, 'rgba(255,255,255,0.10)', ctx);
    hline(i * cell + joint * 0.75, 2, 'rgba(255,255,255,0.10)', ctx);
  }

  /* ③ 水渍 / 油渍：**少而大**。多而小会变成"麻子"。
        集中在少数几块板上，位置随机但块内连续 —— 这才像渗出来的。 */
  for (let i = 0; i < stain; i++) {
    const q = (Math.random() * n) | 0, r = (Math.random() * n) | 0;
    const x = (q + 0.5) * cell + (Math.random() - 0.5) * cell * 0.6;
    const y = (r + 0.5) * cell + (Math.random() - 0.5) * cell * 0.6;
    /* ★ 七成是深渍（油/水），三成是浅渍（浮灰/水泥浆）。
       全画深的会让地面越铺越黑，而且一眼能看出"只有一种斑"。 */
    const light = Math.random() < 0.3;
    const a = 0.10 + Math.random() * 0.14;
    const g = ctx.createRadialGradient(x, y, 2, x, y, cell * (0.5 + Math.random() * 0.8));
    g.addColorStop(0, light ? `rgba(226,226,220,${a * 0.8})` : `rgba(40,44,42,${a})`);
    g.addColorStop(1, light ? 'rgba(226,226,220,0)' : 'rgba(40,44,42,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, cell * 1.4, 0, Math.PI * 2); ctx.fill();
  }

  /* ③-b 低频大块脏污 —— **这一层才是"像被人踩过的地"的关键**。
        ★ 量化依据（scripts/_diag-slabstat.cjs）：
          参考《大多数》ss3.jpg 里，**连没有板的沥青马路**块级
          离散度 CV 都有 7.5%，而我们带板的地面只有 5.4%。
          说明它地面的"信息量"主要来自脏污与杂物，不是板间色差。
          所以补脏，而不是继续加大板间色差（那只会得到棋盘格）。 */
  for (let i = 0; i < Math.max(3, n); i++) {
    const x = Math.random() * N, y = Math.random() * N;
    const rad = cell * (1.2 + Math.random() * 2.0);
    const light = Math.random() < 0.35;
    const a = 0.035 + Math.random() * 0.055;
    const g = ctx.createRadialGradient(x, y, rad * 0.15, x, y, rad);
    g.addColorStop(0, light ? `rgba(232,230,222,${a})` : `rgba(46,48,44,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }

  /* ③-c 沙砾 / 碎屑。★ 必须**很细很淡**：颗粒一大就变成"麻子脸"，
       比没有还难看。直径 1~2px（≈1~2cm）· alpha ≤0.16。 */
  for (let i = 0; i < 260; i++) {
    const x = Math.random() * N, y = Math.random() * N;
    const s = 0.7 + Math.random() * 1.4;
    const light = Math.random() < 0.45;
    ctx.fillStyle = light
      ? `rgba(236,234,226,${0.05 + Math.random() * 0.10})`
      : `rgba(38,40,36,${0.05 + Math.random() * 0.11})`;
    ctx.fillRect(x, y, s, s);
  }

  /* ④ 裂缝：0~2 条，且**必须落在同一块板内**。
        跨板的裂缝会在平铺时被切断成一条条短线（因为裂缝不会跟着 tile 走），
        看起来像"地上有一排断掉的短线"，比没有裂缝更假。 */
  for (let i = 0; i < crack; i++) {
    const q = (Math.random() * n) | 0, r = (Math.random() * n) | 0;
    let x = (q + 0.3) * cell, y = (r + 0.3) * cell;
    ctx.strokeStyle = 'rgba(30,32,30,0.42)';
    hctx.strokeStyle = '#4a4a4a';
    ctx.lineWidth = 1 + Math.random() * 0.8;
    hctx.lineWidth = ctx.lineWidth + 0.8;
    ctx.beginPath(); hctx.beginPath();
    ctx.moveTo(x, y); hctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) {
      x += (Math.random() - 0.5) * cell * 0.28;
      y += (Math.random() - 0.5) * cell * 0.28;
      x = Math.min((q + 1) * cell - 2, Math.max(q * cell + 2, x));
      y = Math.min((r + 1) * cell - 2, Math.max(r * cell + 2, y));
      ctx.lineTo(x, y); hctx.lineTo(x, y);
    }
    ctx.stroke(); hctx.stroke();
  }

  grain(ctx, N, N, 20);
  grain(hctx, N, N, 12);
  return toTexture(c, { kind: 'slab', normalScale: 0.55, height: hc, metersPerRepeat });
}

/* 卷帘门：横向条纹。真实帘片节距约 75mm。 */
export function shutterTex() {
  const N = NOISE;
  const pitch = N / gridCount(75, N);
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = '#6b6f6a'; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#b0b0b0'; hctx.fillRect(0, 0, N, N);

  /* 每片：上缘一道凹槽、下缘一道亮边 —— 高度图上做成锯齿，法线才会形成
     "一片压一片"的分明棱线。 */
  for (let y = 0; y < N; y += pitch) {
    ctx.fillStyle = 'rgba(30,34,32,0.42)'; ctx.fillRect(0, y, N, pitch * 0.34);
    ctx.fillStyle = 'rgba(150,154,146,0.16)'; ctx.fillRect(0, y + pitch * 0.34, N, pitch * 0.16);
    const gg = hctx.createLinearGradient(0, y, 0, y + pitch);
    gg.addColorStop(0, '#2e2e2e');
    gg.addColorStop(0.34, '#4a4a4a');
    gg.addColorStop(0.55, '#f0f0f0');
    gg.addColorStop(1, '#9a9a9a');
    hctx.fillStyle = gg; hctx.fillRect(0, y, N, pitch);
  }
  blotch(ctx, N, N, 24, a => `rgba(120,80,50,${0.05 + a * 0.14})`, 18);
  grain(ctx, N, N, 16);
  return toTexture(c, { kind: 'shutter', normalScale: 0.7, height: hc });
}

/* ══ 内容层：招牌 / 海报 / 横幅 / 牛皮癣 ══════════════════════════════════
   [2026-09-19] 目标：解决"一条街的招牌、门脸全一个样"。

   根因有两处，**都不是贴图能力问题**：
     ① **配色只有一个**。signTex 的默认色（暗红底米白字）是全项目唯一的
        招牌配色，而 kit.js 的 signMat() 调用时又没传 opt —— 于是街上
        所有招牌都是同一个颜色。真实街头是"几套标准印刷色"的组合。
     ② **店名池太小**。SHOP_NAMES 每类只有 3~8 个固定名，一条街几十家店
        必然反复出现同一个名字。改用「前缀 × 主体」组合（见 world.js）。

   另补三类街头密度最高的"内容"：
     posterTex  海报 / 灯箱广告   —— 墙面上成片的彩色块
     flyerTex   牛皮癣小广告       —— 白纸黑字 + 电话号码
     bannerTex  横幅标语           —— 红底黄字，横跨门脸
   这三样是"有没有生活气"的分水岭：几何再准，缺了它们街面就是空的。

   ★ 为什么不去找真实照片贴图：低模城市里，海报在屏幕上的高度往往只有
     二三十像素，**视觉上它就是"饱和色块 + 大字 + 数字"**。用几何色块合成
     成本为零、无授权风险、可无限变体；换成照片反而要处理分辨率、色彩空间、
     包体积三件事，收益不成比例。
   ──────────────────────────────────────────────────────────────────────── */

/** 招牌配色池 —— 按中国街头实际观察归纳（餐饮红黄 / 五金电信蓝白 /
    药店水果绿白 / 便利店黄红 / 理发白红 / 金店黑金 …）。
    ★ 招牌是工业印刷品，颜色是**几套标准色**而非连续分布 ——
      所以用离散色池，不做浮点漂移。 */
export const SIGN_STYLES = [
  { bg: '#b0342a', fg: '#f2efe6', edge: '#7d1f18' }, // 暗红 / 米白
  { bg: '#c0392b', fg: '#f2d06b', edge: '#8e2418' }, // 大红 / 亮黄
  { bg: '#1e5b8a', fg: '#eef2f5', edge: '#123c5e' }, // 中蓝 / 白
  { bg: '#1f6f4a', fg: '#eef5ef', edge: '#12452e' }, // 墨绿 / 白
  { bg: '#e8b93a', fg: '#a03020', edge: '#b08a20' }, // 明黄 / 砖红
  { bg: '#ece8dc', fg: '#b0342a', edge: '#c4bda8' }, // 米白 / 砖红
  { bg: '#2a2a28', fg: '#d9b45a', edge: '#111110' }, // 近黑 / 金
  { bg: '#c9601f', fg: '#f7f1e6', edge: '#8f4212' }, // 橙   / 米白
  { bg: '#243a5e', fg: '#e8c86a', edge: '#14243c' }, // 藏青 / 浅金
  { bg: '#2d4a3e', fg: '#e4ddc8', edge: '#1a2e26' }, // 墨绿灰 / 米
  { bg: '#a83a6a', fg: '#f5eef2', edge: '#78264a' }, // 品红 / 白
  { bg: '#4a5a68', fg: '#dfe4e8', edge: '#2d3a45' }, // 灰蓝 / 白
];

/** 字体池 —— 招牌以黑体为主，其次宋体与中宋（隶书渲染不可靠，不列） */
export const SIGN_FONTS = [
  '"Microsoft YaHei","PingFang SC",sans-serif',
  '"SimHei","Microsoft YaHei",sans-serif',
  '"SimSun","Songti SC",serif',
  '"STZhongsong","SimSun",serif',
];

/** 招牌。平面标识物，不需要法线（本来就是平的）。
    ★ 向后兼容：`signTex('小卖部')` 的行为与改造前完全一致
      （暗红底米白字 + 压边），新能力全部走可选参数。 */
export function signTex(text, opt = {}) {
  const {
    w = 512, h = 128,
    style = null,          // SIGN_STYLES 的一项
    layout = 'h',          // 'h' 横排 | 'v' 竖排 | 'stack' 主副双行
    sub = '',              // layout='stack' 的副标题
    font = SIGN_FONTS[0],
    frame = true,          // 周边压边（亚克力灯箱 / 铝塑板的典型结构）
    distress = 14,         // 做旧强度
  } = opt;
  const bg = opt.bg ?? (style ? style.bg : '#b0342a');
  const fg = opt.fg ?? (style ? style.fg : '#f2efe6');
  const edge = opt.edge ?? (style ? style.edge : null);

  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  if (layout === 'v') {
    /* 竖排侧招：逐字向下，按字数自适应字距，整串尽量占满高度 */
    const chars = [...String(text)];
    const size = Math.min(w * 0.6, (h * 0.88) / Math.max(chars.length, 1));
    ctx.font = `700 ${size}px ${font}`;
    const step = h / (chars.length + 0.35);
    chars.forEach((ch, i) => ctx.fillText(ch, w / 2, step * (i + 0.68)));
  } else if (layout === 'stack' && sub) {
    /* 主副双行：主名占上部，副标题小字在下（"老李烧烤 / 啤酒 炒粉"） */
    const s1 = Math.min(h * 0.46, (w * 0.88) / Math.max(String(text).length, 1));
    ctx.font = `700 ${s1}px ${font}`;
    ctx.fillText(text, w / 2, h * 0.37);
    const s2 = Math.min(h * 0.22, (w * 0.7) / Math.max(String(sub).length, 1));
    ctx.globalAlpha = 0.88;
    ctx.font = `400 ${s2}px ${font}`;
    ctx.fillText(sub, w / 2, h * 0.74);
    ctx.globalAlpha = 1;
  } else {
    /* 横排单行（默认，也是改造前的原有行为） */
    const size = Math.min(h * 0.62, (w * 0.86) / Math.max(String(text).length, 1));
    ctx.font = `700 ${size}px ${font}`;
    ctx.fillText(text, w / 2, h * 0.54);
  }

  if (frame) {
    ctx.strokeStyle = edge || 'rgba(30,26,22,0.5)';
    ctx.lineWidth = 5;
    ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  }

  blotch(ctx, w, h, 16, a => `rgba(40,34,28,${0.04 + a * 0.12})`, 26);
  if (distress) grain(ctx, w, h, distress);
  return toTexture(c, { kind: 'sign', normalScale: 0.3, clamp: true });
}

/** 海报 / 灯箱广告：饱和色块 + 大字 + 价格。
    上部 62% 是主视觉（色块 + 斜带或圆形装饰），下部是信息区。 */
export function posterTex(opt = {}) {
  const {
    w = 384, h = 512,
    style = null, title = '特价', sub = '', price = '', note = '',
    motif = 'band',        // 'band' 斜色带 | 'circle' 圆形 | 'none'
    font = SIGN_FONTS[0],
  } = opt;
  const bg = opt.bg ?? (style ? style.bg : '#c0392b');
  const fg = opt.fg ?? (style ? style.fg : '#f7f1e6');

  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = '#efe9dc'; ctx.fillRect(0, 0, w, h);      // 纸底
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h * 0.62);      // 主视觉底

  if (motif !== 'none') {
    ctx.save();
    ctx.globalAlpha = 0.2; ctx.fillStyle = '#ffffff';
    if (motif === 'band') {
      ctx.translate(w * 0.5, h * 0.31); ctx.rotate(-0.5);
      ctx.fillRect(-w, -h * 0.085, w * 2, h * 0.17);
      ctx.rotate(1.0);
      ctx.fillRect(-w, -h * 0.045, w * 2, h * 0.09);
    } else {
      ctx.beginPath(); ctx.arc(w * 0.5, h * 0.31, w * 0.27, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  ctx.fillStyle = fg; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const s1 = Math.min(h * 0.16, (w * 0.8) / Math.max([...String(title)].length, 1));
  ctx.font = `700 ${s1}px ${font}`;
  ctx.fillText(title, w / 2, h * 0.22);

  if (price) {
    ctx.font = `700 ${h * 0.155}px ${font}`;
    ctx.fillText(price, w / 2, h * 0.47);
  }

  ctx.fillStyle = '#3a352c';
  if (sub) {
    const s3 = Math.min(h * 0.062, (w * 0.72) / Math.max([...String(sub)].length, 1));
    ctx.font = `500 ${s3}px ${font}`;
    ctx.fillText(sub, w / 2, h * 0.72);
  }
  if (note) {
    ctx.fillStyle = '#6a6356';
    const s4 = Math.min(h * 0.044, (w * 0.76) / Math.max([...String(note)].length, 1));
    ctx.font = `400 ${s4}px ${font}`;
    ctx.fillText(note, w / 2, h * 0.82);
  }
  ctx.fillStyle = bg; ctx.fillRect(0, h * 0.9, w, h * 0.1);

  blotch(ctx, w, h, 14, a => `rgba(60,52,40,${0.03 + a * 0.1})`, 30);
  grain(ctx, w, h, 12);
  return toTexture(c, { kind: 'poster', normalScale: 0.25, clamp: true });
}

/** 牛皮癣小广告的服务池 —— 内容取自城中村墙面的真实类型 */
export const FLYER_SERVICES = [
  { t: '疏通下水道', n: '138 0013 8000' },
  { t: '专业开锁换锁芯', n: '159 2048 7761' },
  { t: '搬家拉货长短途', n: '137 5520 3312' },
  { t: '空调拆装加雪种', n: '186 7734 0912' },
  { t: '老中医专治腰腿', n: '135 6091 4428' },
  { t: '高价回收旧家电', n: '158 3376 2205' },
  { t: '水电安装防水补漏', n: '139 8812 6640' },
  { t: '出租单间带空调', n: '133 2468 1573' },
];

/** 牛皮癣小广告（A4 比例 0.21×0.297m）。
    价值不在好看，而在**看似随机、随贴随掉**——它是"这面墙有人用过"的证据。 */
export function flyerTex(opt = {}) {
  const { w = 256, h = 362, seed = 0, aged = true } = opt;
  const s = FLYER_SERVICES[Math.abs(seed | 0) % FLYER_SERVICES.length];
  const c = canvas(w, h), ctx = c.getContext('2d');

  ctx.fillStyle = aged ? '#f0ead8' : '#fbfaf6';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#241f1a';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';

  /* 标题按 7 字折行 —— 不折行的话长文案会被压成一行看不清的小字 */
  const chars = [...s.t];
  const lines = chars.length > 7
    ? [chars.slice(0, Math.ceil(chars.length / 2)).join(''), chars.slice(Math.ceil(chars.length / 2)).join('')]
    : [s.t, ''];
  const size = Math.min(w * 0.17, (w * 0.86) / Math.max(...lines.map(l => l.length), 1));
  ctx.font = `700 ${size}px "SimHei","Microsoft YaHei",sans-serif`;
  lines.forEach((ln, i) => { if (ln) ctx.fillText(ln, w / 2, h * (0.29 + i * 0.155)); });

  ctx.font = `700 ${w * 0.115}px Arial,sans-serif`;
  ctx.fillText(s.n, w / 2, h * 0.65);

  ctx.strokeStyle = 'rgba(36,31,26,0.5)'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.75); ctx.lineTo(w * 0.85, h * 0.75); ctx.stroke();

  blotch(ctx, w, h, 10, a => `rgba(120,100,70,${0.04 + a * 0.1})`, 22);
  grain(ctx, w, h, 10);
  return toTexture(c, { kind: 'flyer', normalScale: 0.15, clamp: true });
}

/** 横幅标语文本池 */
export const BANNER_TEXTS = [
  '热烈庆祝开业大吉', '创建文明城市 共建美好家园', '此处严禁倒垃圾',
  '安全生产 人人有责', '全民反诈 你我同行', '依法经营 诚信为本',
  '消防安全 重于泰山', '保持通道畅通 严禁堆放杂物',
];

/** 横幅标语：红底黄字，约 8:1 长条 */
export function bannerTex(opt = {}) {
  const { w = 1024, h = 128, text = null, seed = 0 } = opt;
  const t = text || BANNER_TEXTS[Math.abs(seed | 0) % BANNER_TEXTS.length];
  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = '#c0392b'; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#f5d76e';
  const size = Math.min(h * 0.6, (w * 0.9) / Math.max([...t].length, 1));
  ctx.font = `700 ${size}px "STZhongsong","SimSun",serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(t, w / 2, h * 0.53);
  blotch(ctx, w, h, 12, a => `rgba(70,20,14,${0.04 + a * 0.1})`, 26);
  grain(ctx, w, h, 10);
  return toTexture(c, { kind: 'banner', normalScale: 0.2, clamp: true });
}

/* 屋顶：铁皮 / 防水油毡 */
export function roofTex() {
  const N = NOISE;
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = '#5c6058'; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#c0c0c0'; hctx.fillRect(0, 0, N, N);

  // 铁皮搭接缝
  const pitch = N / gridCount(600, N);
  for (let x = 0; x < N; x += pitch) {
    ctx.fillStyle = `rgba(28,32,30,${0.2 + Math.random() * 0.2})`;
    ctx.fillRect(x, 0, 3, N);
    hctx.fillStyle = '#5a5a5a';
    hctx.fillRect(x - 1.5, 0, 4.5, N);
  }
  blotch(ctx, N, N, 40, a => `rgba(92,64,40,${0.05 + a * 0.18})`, 30);
  grain(ctx, N, N, 22);
  grain(hctx, N, N, 14);
  return toTexture(c, { kind: 'roof', normalScale: 0.6, height: hc });
}

/* 窗玻璃：暗、脏、映天光。平面 + 靠反射出彩 → 不要法线。 */
export function glassTex() {
  const N = 128;
  const c = canvas(N, N), ctx = c.getContext('2d');
  const g = ctx.createLinearGradient(0, 0, 0, N);
  g.addColorStop(0, '#4a5560');
  g.addColorStop(0.5, '#333b44');
  g.addColorStop(1, '#242a31');
  ctx.fillStyle = g; ctx.fillRect(0, 0, N, N);
  grain(ctx, N, N, 12);
  return toTexture(c, { kind: 'glass', normalScale: 0, clamp: true });
}

/* ── 共享材质 ─────────────────────────────────────────────────────────────
   窗口/空调是复用率最高的构件（一栋楼几十个）。如果每次调用都 new 一个材质，
   全场景会产生上千个材质实例，后面的静态几何合并就彻底失效——
   合并是按材质分组的，材质不共享 = 合并不了 = draw call 爆炸。
   所以这里把它们提到模块级，惰性创建一次。
   ──────────────────────────────────────────────────────────────────────── */
let _winFrameMat = null, _winBarMat = null, _acBodyMat = null, _acFanMat = null;

/* 立面：窗框、铁栅。
   ★ [2026-09-18] 窗框原来 metalness 0.15：铝合金窗框的**阳极氧化面**确实偏金属，
     但 0.15 属"半金属"—— 按 P0-2 的口径（要么 0 要么 0.85+），这是最糟的取值：
     既削掉漫反射、又给不出清晰镜面反射。窗框是铝合金，归真金属档 0.85 更对。 */
export function makeWindow(w = 0.9, h = 1.2) {
  if (!_winFrameMat) {
    _winFrameMat = new THREE.MeshStandardMaterial({ color: 0x9aa09a, roughness: 0.58, metalness: 0.85 });
    _winBarMat = new THREE.MeshStandardMaterial({ color: 0x4a4d48, roughness: 0.5, metalness: 0.9 });
  }
  const g = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), _winFrameMat);
  g.add(frame);

  /* §8.2 窗框压边：框外侧加一圈 2cm 的凸边。
     窗框与墙面的直角交界是最容易看出"CG 感"的地方之一，
     一圈细凸边就能在受光时形成一道连续的高光轮廓。 */
  const lip = 0.022;
  const lipMat = _winFrameMat;
  for (const [lw, lh, lx, ly] of [
    [w + lip * 2, lip, 0, h / 2 + lip / 2],
    [w + lip * 2, lip, 0, -h / 2 - lip / 2],
    [lip, h + lip * 2, w / 2 + lip / 2, 0],
    [lip, h + lip * 2, -w / 2 - lip / 2, 0],
  ]) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(lw, lh, 0.1), lipMat);
    m.position.set(lx, ly, 0.012);
    m.userData.bevel = 'window-lip';   // ← 给验证脚本数倒角用
    g.add(m);
  }
  g.userData.bevels = (g.userData.bevels || 0) + 4;

  const glass = new THREE.Mesh(
    new THREE.PlaneGeometry(w * 0.82, h * 0.82),
    _glassMat());
  glass.position.z = 0.045;
  g.add(glass);
  for (let i = 1; i <= 4; i++) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(0.025, h * 0.94, 0.025), _winBarMat);
    b.position.set(-w / 2 + (w * i) / 5, 0, 0.06);
    g.add(b);
  }
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, 0.025, 0.025), _winBarMat);
  b2.position.set(0, 0, 0.06);
  g.add(b2);
  return g;
}

let _glass = null;
function _glassMat() {
  if (!_glassMat._m) {
    /* 玻璃：metalness 0 + 低 roughness + envMapIntensity —— 靠反射出彩（§6.2）。 */
    _glassMat._m = new THREE.MeshStandardMaterial({
      map: _glass, roughness: 0.12, metalness: 0, envMapIntensity: 1.5,
    });
  }
  return _glassMat._m;
}

export function initMaterials() {
  _glass = glassTex();
}

/* ── 以下为「全量地点」扩展所需的材质 ─────────────────────────────────────
   29 个地点跨越住宅/商业/工业/教育/政务/园林，只有瓷砖一种外墙撑不住。
   每种材质都保持低饱和，避免破坏晦暗调。
   ──────────────────────────────────────────────────────────────────────── */

/* 红砖墙：老旧小区 / 厂房 / 围墙。
   真实规格：标准砖 240×115mm + 灰缝 10mm → 节距 250×125mm（§8.4）。
   原来 brickW=34/rowH=16（256 纹理）→ 一块砖在 3.2m 的一格里占 425mm，
   几乎是真实砖的 1.8 倍 —— 这就是"看起来像贴纸而不是砖墙"的来源。 */
export function brickTex(opt = {}) {
  const { base = '#8a5f4a', mortar = '#6f6a60', brickWMM = 250, rowHMM = 125, metersPerRepeat = TILE_M } = opt;
  const N = EXT;
  // 错缝需要行数为偶数，图案才是周期性的（否则接缝处砖缝对不上）
  const cols = gridCount(brickWMM, N, true, metersPerRepeat);
  const rows = gridCount(rowHMM, N, true, metersPerRepeat);
  const bw = N / cols, rh = N / rows;
  const joint = Math.max(1.6, rh * 0.09);

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  hctx.fillStyle = '#d2d2d2'; hctx.fillRect(0, 0, N, N);   // 砖面：凸
  ctx.fillStyle = mortar; ctx.fillRect(0, 0, N, N);

  for (let r = 0; r < rows; r++) {
    const y = r * rh;
    const off = (r % 2) * (bw / 2);
    // 水平灰缝
    hctx.fillRect(0, y - joint / 2, N, joint);
    for (let q = -1; q <= cols; q++) {
      const x = q * bw + off;
      // 竖向灰缝
      hctx.fillRect(x - joint / 2, y, joint, rh);
      // 砖面：颜色上每块砖明度微扰（真实砖没有两块一样）
      const v = 0.82 + Math.random() * 0.36;
      ctx.fillStyle = `rgb(${Math.round(138 * v)},${Math.round(95 * v)},${Math.round(74 * v)})`;
      ctx.fillRect(x + joint / 2, y + joint / 2, bw - joint, rh - joint);
    }
  }
  blotch(ctx, N, N, 40, a => `rgba(40,36,32,${0.03 + a * 0.10})`, 30);
  grain(ctx, N, N, 22);
  grain(hctx, N, N, 16);
  void base;
  return toTexture(c, { kind: 'brick', normalScale: 1.1, height: hc, metersPerRepeat });
}

/* 彩钢板 / 波纹铁皮：厂房、围挡、集装箱。
   真实波纹板肋距约 75mm。 */
export function metalPanelTex(opt = {}) {
  const { base = '#6d7370', ribMM = 150, vertical = false } = opt;
  const N = NOISE;
  const pitch = N / gridCount(ribMM, N);

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#808080'; hctx.fillRect(0, 0, N, N);

  /* 波纹：颜色上是明暗带，高度上是正弦波。
     高度用正弦（而不是方波）—— 真实压型板的肋是圆弧过渡的。 */
  for (let i = 0; i < N; i += pitch) {
    const g = ctx.createLinearGradient(i, 0, i + pitch, 0);
    g.addColorStop(0, 'rgba(255,255,255,0.15)');
    g.addColorStop(0.5, 'rgba(0,0,0,0.22)');
    g.addColorStop(1, 'rgba(255,255,255,0.08)');
    ctx.fillStyle = g;
    if (vertical) ctx.fillRect(i, 0, pitch, N); else ctx.fillRect(0, i, N, pitch);

    for (let k = 0; k < pitch; k++) {
      const ph = (k / pitch) * Math.PI * 2;
      const v = Math.round(128 + Math.sin(ph) * 100);
      hctx.fillStyle = `rgb(${v},${v},${v})`;
      if (vertical) hctx.fillRect(i + k, 0, 1, N); else hctx.fillRect(0, i + k, N, 1);
    }
  }
  blotch(ctx, N, N, 34, a => `rgba(96,64,40,${0.04 + a * 0.16})`, 26);
  grain(ctx, N, N, 18);
  return toTexture(c, { kind: 'metalPanel', normalScale: 0.7, height: hc });
}

/* 玻璃幕墙：写字楼 / 科技园 / 商场。
   真实分格约 1200mm（§8.4 用真实尺寸，而不是为了好看把格子缩小）。 */
export function curtainWallTex(opt = {}) {
  const { base = '#46525c', mullion = '#2c3238', cellMM = 1200, metersPerRepeat = TILE_M } = opt;
  const N = EXT;
  const n = gridCount(cellMM, N, false, metersPerRepeat);
  const cell = N / n;

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  // 高度：玻璃面平、框凹下去
  hctx.fillStyle = '#dcdcdc'; hctx.fillRect(0, 0, N, N);

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  for (let y = 0; y < N; y += cell) {
    hctx.fillRect(0, y - 2, N, 4);
    for (let x = 0; x < N; x += cell) {
      hctx.fillRect(x - 2, y, 4, cell);
      // 每格玻璃反射天空的角度不同 → 明暗差
      const v = 0.78 + Math.random() * 0.5;
      ctx.fillStyle = `rgba(${Math.round(96 * v)},${Math.round(112 * v)},${Math.round(124 * v)},0.85)`;
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
      const g = ctx.createLinearGradient(x, y, x + cell, y + cell);
      g.addColorStop(0, 'rgba(190,205,215,0.16)');
      g.addColorStop(0.5, 'rgba(0,0,0,0)');
      g.addColorStop(1, 'rgba(20,26,30,0.22)');
      ctx.fillStyle = g;
      ctx.fillRect(x + 2, y + 2, cell - 4, cell - 4);
    }
  }
  ctx.strokeStyle = mullion; ctx.lineWidth = 4;
  for (let i = 0; i <= N; i += cell) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, N); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(N, i); ctx.stroke();
  }
  grain(ctx, N, N, 10);
  grain(hctx, N, N, 8);
  return toTexture(c, { kind: 'curtainWall', normalScale: 0.6, height: hc, metersPerRepeat });
}

/* 沥青路面。§6.2：干 0.88~0.94 / 湿 0.25~0.45 + envMapIntensity 1.8。 */
export function asphaltTex(opt = {}) {
  const { metersPerRepeat = GROUND_TILE_M } = opt;
  const N = NOISE;
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = '#4a4c4a'; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#a8a8a8'; hctx.fillRect(0, 0, N, N);

  blotch(ctx, N, N, 70, a => `rgba(30,32,33,${0.05 + a * 0.14})`, 40);
  blotch(ctx, N, N, 40, a => `rgba(120,122,118,${0.02 + a * 0.05})`, 18);

  // 骨料颗粒：颜色带微亮、高度带微凸
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * N, y = Math.random() * N, r = 0.6 + Math.random() * 1.7;
    const v = 0.7 + Math.random() * 0.6;
    ctx.fillStyle = `rgba(${Math.round(130 * v)},${Math.round(132 * v)},${Math.round(128 * v)},0.5)`;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    hctx.fillStyle = `rgba(255,255,255,${0.25 + Math.random() * 0.5})`;
    hctx.beginPath(); hctx.arc(x, y, r, 0, Math.PI * 2); hctx.fill();
  }

  for (let i = 0; i < 6; i++) {   // 裂缝
    ctx.strokeStyle = 'rgba(26,28,28,0.6)'; ctx.lineWidth = 1 + Math.random();
    hctx.strokeStyle = '#4a4a4a'; hctx.lineWidth = 1.6 + Math.random();
    ctx.beginPath(); hctx.beginPath();
    let x = Math.random() * N, y = Math.random() * N;
    ctx.moveTo(x, y); hctx.moveTo(x, y);
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * 60; y += (Math.random() - 0.5) * 60;
      ctx.lineTo(x, y); hctx.lineTo(x, y);
    }
    ctx.stroke(); hctx.stroke();
  }
  grain(ctx, N, N, 30);
  grain(hctx, N, N, 22);
  return toTexture(c, { kind: 'asphalt', normalScale: 0.6, height: hc, metersPerRepeat });
}

/* 人行道铺装：方砖。真实规格 300×300mm。 */
export function paverTex(opt = {}) {
  const { gap = '#706f68', tileMM = 300, metersPerRepeat = GROUND_TILE_M } = opt;
  const N = EXT;
  const n = gridCount(tileMM, N, false, metersPerRepeat);
  const tile = N / n;
  const joint = Math.max(2, tile * 0.035);

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  hctx.fillStyle = '#d0d0d0'; hctx.fillRect(0, 0, N, N);
  ctx.fillStyle = gap; ctx.fillRect(0, 0, N, N);

  for (let y = 0; y < N; y += tile) {
    hctx.fillStyle = '#5c5c5c';
    hctx.fillRect(0, y - joint / 2, N, joint);
    for (let x = 0; x < N; x += tile) {
      hctx.fillStyle = '#5c5c5c';
      hctx.fillRect(x - joint / 2, y, joint, tile);

      /* ★ 每块砖的明度：**分布**比幅度更重要（这一条踩过坑，别退回去）。
         原来写的是 `v = 0.86 + Math.random()*0.28` —— 均匀分布，
         相邻两块砖最多能差 28%。在 1024 里是 15×15 块小砖，铺出来就是
         **一片像素噪点**，比 slabTex 那次的棋盘格更明显。
         实测证据：取证截图 6-street-lane-plain.png 右侧人行道，
         以及 dev/_3dtest/shots-textures/ground.paver.png。
         现改成"绝大多数接近同一色、极少数明显偏深"，与真实砖场一致：
         砖是同一窑出的，色差本来就很小，偶尔混进几块次品。 */
      const t = (Math.random() - 0.5) * 2;
      const v = 1 + Math.sign(t) * Math.pow(Math.abs(t), 2.4) * 0.055;
      /* 另有约 4% 的砖明显偏深（次品 / 被油污浸过）——
         没有这几块，整片砖会"太干净"，反而不像被人踩过。 */
      const stained = Math.random() < 0.04 ? 0.86 : 1;
      const k = v * stained;
      ctx.fillStyle = `rgb(${Math.round(155 * k)},${Math.round(154 * k)},${Math.round(146 * k)})`;
      ctx.fillRect(x + joint / 2, y + joint / 2, tile - joint, tile - joint);
    }
  }
  /* 缝里积灰：宽而淡的一条，压在砖面之上。没有它，缝只是一条色带。 */
  for (let y = 0; y < N; y += tile) {
    ctx.fillStyle = 'rgba(52,54,50,0.10)';
    ctx.fillRect(0, y - joint, N, joint * 2);
  }
  blotch(ctx, N, N, 46, a => `rgba(60,62,58,${0.03 + a * 0.08})`, 34);
  grain(ctx, N, N, 16);
  grain(hctx, N, N, 12);
  return toTexture(c, { kind: 'paver', normalScale: 0.8, height: hc, metersPerRepeat });
}

/* 草地：公园 / 高档小区 / 校园
   刻意做得很"灰绿"——饱和的草绿在晦暗调里会像贴纸一样跳出来。
   草没有可读结构 → 512 + 低 normalScale。 */
export function grassTex(opt = {}) {
  const { base = '#454b3e', metersPerRepeat = GRASS_TILE_M } = opt;
  const N = NOISE;
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#909090'; hctx.fillRect(0, 0, N, N);

  const blades = 5200;
  for (let i = 0; i < blades; i++) {
    const v = 0.6 + Math.random() * 0.9;
    const x = Math.random() * N, y = Math.random() * N;
    const dx = (Math.random() - 0.5) * 4;
    const dy = -3 - Math.random() * 5;
    ctx.strokeStyle = `rgba(${Math.round(72 * v)},${Math.round(80 * v)},${Math.round(58 * v)},0.8)`;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + dx, y + dy); ctx.stroke();
    hctx.strokeStyle = v > 0.95 ? 'rgba(240,240,240,0.5)' : 'rgba(150,150,150,0.35)';
    hctx.lineWidth = 1;
    hctx.beginPath(); hctx.moveTo(x, y); hctx.lineTo(x + dx, y + dy); hctx.stroke();
  }
  blotch(ctx, N, N, 30, a => `rgba(38,42,32,${0.05 + a * 0.14})`, 34);
  grain(ctx, N, N, 14);
  grain(hctx, N, N, 20);
  return toTexture(c, { kind: 'grass', normalScale: 0.5, height: hc, metersPerRepeat });
}

/* 石材（干挂）：政务、银行、高档场所的台阶与地面。
   真实干挂石材板约 800×800mm。低对比 → 512 足够。 */
/* 石材铺装 / 石材墙面（tier3 地面 + 两档外墙）。

   ★ [2026-09-19 对齐《大多数》] 这个函数原来是**画面里最大的一块纯色**：
     · 尺寸只有 512（NOISE），而它铺的是"富人区广场 + 高层外墙"这种
       占屏幕面积最大的面 —— 分辨率不够，缝和脉络全糊在一起；
     · 脉络 alpha 0.06~0.18、斑块 alpha 0.03~0.10，两者叠起来仍然接近纯色。
     实测读数：块级明度离散度 **CV 0.47%**（见 scripts/shot-textures.cjs）——
     等于一块死色。取证截图 6-street-lane-plain.png 里，画面左侧那片发白的
     墙和广场就是它，是全图最"一眼假"的一处。

     修法与 slabTex 同一套：提到 EXT(1024) → 低频云斑 → 板间明度微扰 →
     缝（暗晕+细线+倒角）→ 脉络 → 沙砾。

   ★ 云斑必须画在**切板之前**：石材的纹理是整块荒料切出来的，
     先切板再打斑会变成"每块板一个斑"，那正是最典型的"贴纸"读法。
     板缝叠在云斑之上，才读得出"这是被切开的一整块石头"。 */
export function stoneTex(opt = {}) {
  const {
    base = '#8f8b84', slabMM = 800, jointMM = 10,
    metersPerRepeat = GROUND_TILE_M, tone = 0.09,
  } = opt;
  const N = EXT;
  const n = gridCount(slabMM, N, false, metersPerRepeat);
  const cell = N / n;
  const joint = Math.max(2, px(jointMM, N, metersPerRepeat));

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#e0e0e0'; hctx.fillRect(0, 0, N, N);

  /* ① 低频云斑（跨板）。石材是微晶集合体，明暗是大面积渐变的，
        不是颗粒 —— 这一层决定"像不像石头"。

        ★ 尺寸与浓度都要克制（第一版踩过）：26 个、半径最大 3.5 格、
          浓度到 0.13 —— 铺出来是一片**水彩晕染**，而且因为深色斑比浅色斑多，
          整体还暗了 30%（均值 164 → 115）。现在：斑更小更多、深浅各半，
          让它读成"石头的云纹"而不是"一块洇湿的纸"。 */
  for (let i = 0; i < 34; i++) {
    const x = Math.random() * N, y = Math.random() * N;
    const rad = cell * (0.45 + Math.random() * 1.15);
    const light = Math.random() < 0.5;
    const a = 0.030 + Math.random() * 0.045;
    const g = ctx.createRadialGradient(x, y, rad * 0.12, x, y, rad);
    g.addColorStop(0, light ? `rgba(236,234,228,${a})` : `rgba(66,62,58,${a})`);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }

  /* ①-b 细云斑。只有大斑会让石面读成"平滑塑料" —— 石材在近处是有
        微米级结晶颗粒感的。这一层补的就是它，半径小、数量多。

        ★ 数量要够多、浓度要够低：90 个 @0.075 时能**数出一颗颗圆斑**，
          反而变成"起泡"。130 个 @0.04 就糊成连续的斑驳。 */
  for (let i = 0; i < 130; i++) {
    const x = Math.random() * N, y = Math.random() * N;
    const rad = cell * (0.06 + Math.random() * 0.22);
    const light = Math.random() < 0.5;
    const a = 0.020 + Math.random() * 0.040;
    ctx.fillStyle = light ? `rgba(240,238,232,${a})` : `rgba(58,54,50,${a})`;
    ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }

  /* ② 每块板一个独立的明度。分布与 slabTex 同款（pow 压向 0），
        理由见 slabTex 顶部：均匀随机会铺出棋盘格。 */
  for (let r = 0; r < n; r++) {
    for (let q = 0; q < n; q++) {
      const t = (Math.random() - 0.5) * 2;
      const d = Math.sign(t) * Math.pow(Math.abs(t), 2.2) * tone;
      ctx.fillStyle = d > 0 ? `rgba(255,255,255,${d})` : `rgba(0,0,0,${-d})`;
      ctx.fillRect(q * cell, r * cell, cell, cell);
    }
  }

  /* ③ 板缝：暗晕 → 细线 → 受光倒角。
        ★ 缝必须画三遍（-N/0/+N），理由同 slabTex：RepeatWrapping 下
          只在 x=0 画一次，左右边缘各留半条缝，平铺后粗细不均。 */
  const vline = (x, w, color, tgt) => {
    tgt.fillStyle = color;
    for (const dx of [-N, 0, N]) tgt.fillRect(x + dx - w / 2, 0, w, N);
  };
  const hline = (y, w, color, tgt) => {
    tgt.fillStyle = color;
    for (const dy of [-N, 0, N]) tgt.fillRect(0, y + dy - w / 2, N, w);
  };
  for (let i = 0; i < n; i++) {
    vline(i * cell, Math.max(joint * 3, 5), 'rgba(58,54,50,0.12)', ctx);
    hline(i * cell, Math.max(joint * 3, 5), 'rgba(58,54,50,0.12)', ctx);
  }
  for (let i = 0; i < n; i++) {
    vline(i * cell, joint, 'rgba(70,66,62,0.44)', ctx);
    vline(i * cell, joint, '#585858', hctx);
    hline(i * cell, joint, 'rgba(70,66,62,0.44)', ctx);
    hline(i * cell, joint, '#585858', hctx);
    vline(i * cell + joint * 0.8, 2, 'rgba(255,255,255,0.12)', ctx);
    hline(i * cell + joint * 0.8, 2, 'rgba(255,255,255,0.12)', ctx);
  }

  /* ④ 脉络（石材特有的细纹）。★ 要有**浅色**脉络 —— 只画深色会让
        石材读成"脏水泥"，浅色脉是石英/方解石脉，是石材的身份特征。 */
  for (let i = 0; i < 46; i++) {
    const light = Math.random() < 0.35;
    ctx.strokeStyle = light
      ? `rgba(238,236,230,${0.10 + Math.random() * 0.16})`
      : `rgba(58,54,50,${0.08 + Math.random() * 0.16})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.7;
    ctx.beginPath();
    let x = Math.random() * N, y = Math.random() * N;
    ctx.moveTo(x, y);
    /* 脉络走向要**有主方向**（沉积岩是层状的），纯随机游走会变成蜘蛛网。 */
    const dirX = (Math.random() - 0.5) * 2, dirY = (Math.random() - 0.5) * 0.7;
    for (let s = 0; s < 5; s++) {
      x += dirX * (40 + Math.random() * 90);
      y += dirY * (40 + Math.random() * 90) + (Math.random() - 0.5) * 30;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  /* ⑤ 沙砾。细而淡，理由同 slabTex：颗粒一大就成"麻子脸"。 */
  for (let i = 0; i < 300; i++) {
    const light = Math.random() < 0.5;
    ctx.fillStyle = light
      ? `rgba(240,238,232,${0.05 + Math.random() * 0.10})`
      : `rgba(52,48,44,${0.05 + Math.random() * 0.10})`;
    ctx.fillRect(Math.random() * N, Math.random() * N, 0.7 + Math.random() * 1.3, 0.7 + Math.random() * 1.3);
  }

  grain(ctx, N, N, 12);
  grain(hctx, N, N, 10);
  return toTexture(c, { kind: 'stone', normalScale: 0.8, height: hc, metersPerRepeat });
}

/* 木纹：寺庙、图书馆、客栈的门窗与梁柱 */
export function woodTex(opt = {}) {
  const { base = '#6b4f38', metersPerRepeat = TILE_M } = opt;
  const N = NOISE;
  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#b8b8b8'; hctx.fillRect(0, 0, N, N);

  for (let i = 0; i < 120; i++) {
    const dark = `rgba(${40 + Math.random() * 60},${28 + Math.random() * 40},${18 + Math.random() * 30},${0.12 + Math.random() * 0.22})`;
    const lw = 0.7 + Math.random() * 2.4;
    ctx.strokeStyle = dark; ctx.lineWidth = lw;
    // 木纹在高度上是浅沟 —— 只给一部分纹路加，避免整面都在起伏
    const ridge = Math.random() < 0.45;
    if (ridge) { hctx.strokeStyle = 'rgba(88,88,88,0.55)'; hctx.lineWidth = lw * 0.8; }
    let y = Math.random() * N;
    ctx.beginPath(); hctx.beginPath();
    ctx.moveTo(0, y); hctx.moveTo(0, y);
    for (let x = 0; x <= N; x += 32) {
      y += (Math.random() - 0.5) * 5;
      ctx.lineTo(x, y); hctx.lineTo(x, y);
    }
    ctx.stroke();
    if (ridge) hctx.stroke();
  }
  grain(ctx, N, N, 16);
  return toTexture(c, { kind: 'wood', normalScale: 0.7, height: hc, metersPerRepeat });
}

/* 空调外机 */
export function makeACUnit() {
  if (!_acBodyMat) {
    _acBodyMat = new THREE.MeshStandardMaterial({ color: 0xa8a89e, roughness: 0.72, metalness: 0.25 });
    _acFanMat = new THREE.MeshStandardMaterial({ color: 0x5a5c56, roughness: 0.62, metalness: 0.5 });
  }
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.54, 0.32), _acBodyMat);
  g.add(body);
  /* 外壳压边：空调外机的钣金折边 —— 一道细凸边就能让"一个盒子"变成"一台机器" */
  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.03, 0.34), _acBodyMat);
  lip.position.y = 0.27;
  g.add(lip);
  const fan = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.04, 16), _acFanMat);
  fan.rotation.x = Math.PI / 2;
  fan.position.z = 0.17;
  g.add(fan);
  return g;
}

/** 供验证脚本读取 —— 统计已登记的表面。
    验证脚本用它做**读数**而不是靠调参数猜（见文件头 §4 静默失效教训）。 */
export function materialDebug() {
  return {
    tileM: _matDebug.tileM, ext: _matDebug.ext, noise: _matDebug.noise,
    surfaces: _surfaces.slice(),
    normalMapsBuilt: _normalCount,
    /* 法线贴图覆盖率 —— 直接复用 _matDebug 上那份**单一真源**，
       不在这里再算一遍（同名两份实现必然漂移，这是刚踩过的坑）。 */
    normalCoverage: _matDebug.normalCoverage,
  };
}
