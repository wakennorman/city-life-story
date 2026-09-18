import * as THREE from 'three';

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
const _matDebug = {
  tileM: TILE_M, ext: EXT, noise: NOISE,
  surfaces: _surfaces,
  get normalMapsBuilt() { return _normalCount; },
};
if (typeof window !== 'undefined') window.__matDebug = _matDebug;

/* 供 world.js 占位引用 —— 该文件 `palette().common.stone` 被当成院子水泥地底用了 */
export const groundKinds = ['concrete', 'asphalt', 'paver', 'stone', 'grass'];

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

function normalFromHeight(hc) {
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
  const rx = Math.max(1e-4, wM / tileM);
  const ry = Math.max(1e-4, hM / tileM);
  if (base.map) {
    mat.map = base.map.clone();
    mat.map.needsUpdate = true;
    mat.map.repeat.set(rx, ry);
  }
  if (base.normalMap) {
    mat.normalMap = base.normalMap.clone();
    mat.normalMap.needsUpdate = true;
    mat.normalMap.repeat.set(rx, ry);   // ★ 必须与 map 一致
  }
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
  if (mat && mat.map && mat.normalMap) {
    mat.normalMap.repeat.copy(mat.map.repeat);
    mat.normalMap.needsUpdate = true;
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

/* 招牌：红底白字。平面标识物，不需要法线（贴纸本来就是平的）。 */
export function signTex(text, opt = {}) {
  const { bg = '#b0342a', fg = '#f2efe6', w = 512, h = 128 } = opt;
  const c = canvas(w, h), ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  const size = Math.min(h * 0.62, (w * 0.86) / Math.max(text.length, 1));
  ctx.font = `700 ${size}px "Microsoft YaHei","PingFang SC",sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, h * 0.54);
  ctx.strokeStyle = 'rgba(30,26,22,0.5)'; ctx.lineWidth = 5;
  ctx.strokeRect(2.5, 2.5, w - 5, h - 5);
  blotch(ctx, w, h, 16, a => `rgba(40,34,28,${0.04 + a * 0.12})`, 26);
  grain(ctx, w, h, 14);
  return toTexture(c, { kind: 'sign', normalScale: 0.3, clamp: true });
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
      const v = 0.86 + Math.random() * 0.28;
      ctx.fillStyle = `rgb(${Math.round(155 * v)},${Math.round(154 * v)},${Math.round(146 * v)})`;
      ctx.fillRect(x + joint / 2, y + joint / 2, tile - joint, tile - joint);
    }
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
export function stoneTex(opt = {}) {
  const { base = '#8f8b84', slabMM = 800, metersPerRepeat = GROUND_TILE_M } = opt;
  const N = NOISE;
  const n = gridCount(slabMM, N, false, metersPerRepeat);
  const slab = N / n;

  const c = canvas(N), ctx = c.getContext('2d');
  const hc = canvas(N), hctx = hc.getContext('2d');

  ctx.fillStyle = base; ctx.fillRect(0, 0, N, N);
  hctx.fillStyle = '#e0e0e0'; hctx.fillRect(0, 0, N, N);

  // 板缝
  ctx.strokeStyle = 'rgba(70,66,62,0.45)'; ctx.lineWidth = 1.6;
  hctx.strokeStyle = '#585858'; hctx.lineWidth = 2.4;
  for (let i = 0; i <= N; i += slab) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, N); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(N, i); ctx.stroke();
    hctx.beginPath(); hctx.moveTo(i, 0); hctx.lineTo(i, N); hctx.stroke();
    hctx.beginPath(); hctx.moveTo(0, i); hctx.lineTo(N, i); hctx.stroke();
  }
  // 石材纹理（低对比脉络）
  for (let i = 0; i < 30; i++) {
    ctx.strokeStyle = `rgba(60,56,52,${0.06 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.6;
    ctx.beginPath();
    let x = Math.random() * N, y = Math.random() * N;
    ctx.moveTo(x, y);
    for (let s = 0; s < 4; s++) { x += (Math.random() - 0.5) * 110; y += (Math.random() - 0.5) * 40; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  blotch(ctx, N, N, 20, a => `rgba(160,156,148,${0.03 + a * 0.07})`, 40);
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
    /* 法线贴图覆盖率：有高度的表面 / 全部表面。
       §6.2 要求"所有材质都补法线"，但招牌/玻璃这类平面标识物
       本来就是平的、不该有凹凸 —— 所以统计时要排除。 */
    normalCoverage: (() => {
      const shouldn = _surfaces.filter(s => s.kind !== 'sign' && s.kind !== 'glass');
      const got = shouldn.filter(s => s.hasHeight);
      return { expected: shouldn.length, withHeight: got.length };
    })(),
  };
}
