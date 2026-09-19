import * as THREE from 'three';
import {
  signTex, makeWindow, makeACUnit, metalPanelTex, concreteTex, roofTex,
  fitRepeat, surfaceMat as surf, TILE_M,
} from './materials.js';
import { palette, tierOf } from './palette.js';

/* ══ 建筑与道具工具箱 ═══════════════════════════════════════════════════════
   29 个地点的全部可见物都从这里取。每个工厂都接收 tier（财富档位）并自己
   去调色板取材质——这样"同一个原型换个档位就是另一个地方"。

   约定：每个建筑 Group 都写 userData.footprint = {w,d,h}，用于生成碰撞盒。
   ═══════════════════════════════════════════════════════════════════════════ */

const rnd = (a, b) => a + Math.random() * (b - a);
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

/* ── P3-3 几何倒角 ──────────────────────────────────────────────────────
   ★ 为什么需要：真实建筑的转角**没有一个是 90° 的硬边**。
     施工必然留倒角/压条，阳光扫过时那条 2~3cm 的窄面会形成一道高光细线。
     人眼靠这道线判断"这是实体，不是贴图"—— 3D_ART_SPEC.md §8.2 的原话是
     "倒角是打破 90° 硬边的唯一低成本手段"。

   实现要点（这里踩过坑）：
   ① **不能用 Box(d+2t, w+2t, d+2t) 包一圈** —— 那样棱条会横穿墙面，
      在墙上留下一条 2cm 的凸棱，近看极假。
   ② 正确做法是**只覆盖竖棱**：每根棱柱截面 2t × 2t，放在角点，
      在 x/z 方向各外扩 t，于是它只包住"角"，不碰面。
   ③ 单元尺寸必须**随建筑尺寸自适应**，所以按 (w+h+d) 做一个台阶函数。
      用小尺寸时 1 个盒 vs 3 个盒的差距 —— 23 个地点的总盒数要控住。 */

/** 2~3cm 倒角条的实际尺寸（米）。§8.2 指定 0.02~0.03。 */
const CHAMFER = 0.025;

/** 建筑竖向倒角的截面尺寸：随建筑体量自适应。
    ★ 关键：**0.02 是下限，不是目标**。
      一根 2cm 的柱子在 20m 外只占 1~2 像素，直接掉进 mipmap 里消失；
      而 AO/法线都补不回来 —— 所以大楼要用大一点的倒角，才读得出来。
      实测：4m 以下的小楼 0.02（近看才有）+ 1 个角，
            8~18m 0.025 + 2 个角，18m 以上 0.03 + 4 个角（上限，控成本）。 */
function bevelSize(w, h, d) {
  const s = Math.max(w, d) + h;
  if (s < 8) return 0.02;
  if (s < 26) return 0.025;
  return 0.03;
}

/**
 * 给一个矩形建筑体量加**竖向压边**（四角倒角）。
 * @param {THREE.Group} g      目标组（棱柱直接加进去）
 * @param {number} w,d,h       体量尺寸（米）
 * @param {number} yBase       底标高（局部坐标）
 * @param {THREE.Material} mat 压边材质（一般用 tier 的 trim/浅色石材）
 * @param {number} maxCorners  最多做几个角（默认 2，见上）
 * @returns {number} 实际加了几根 —— 给验证脚本读数用
 */
function addVerticalChamfers(g, w, d, h, yBase, mat, maxCorners = 2) {
  const t = bevelSize(w, h, d);
  const corners = [
    [w / 2 + t / 2, d / 2 + t / 2],
    [-w / 2 - t / 2, d / 2 + t / 2],
    [w / 2 + t / 2, -d / 2 - t / 2],
    [-w / 2 - t / 2, -d / 2 - t / 2],
  ].slice(0, Math.max(1, Math.min(4, maxCorners)));

  /* 棱柱几何**共享**（同一个建筑里尺寸相同），只有位置不同。
     23 个地点 × 每栋 2~4 根 = 几十个盒 —— 共享几何 + 共享材质后，
     draw call 会由 three 的合批处理，成本可忽略。 */
  const geo = new THREE.BoxGeometry(t, h, t);
  for (const [x, z] of corners) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, yBase + h / 2, z);
    m.castShadow = true;
    g.add(m);
  }
  g.userData.chamfers = (g.userData.chamfers || 0) + corners.length;
  return corners.length;
}

/** 给外露的窗/门洞口加一圈 2cm 压边。
    ★ 注意：**窗框的压边不在这里** —— 那是 makeWindow() 的事（四边 2.2cm 细条，
      已实现在 materials.js，因为窗是复用构件、压边必须跟着窗一起生成）。
      这里只补"洞口"级别的压边：门洞、卷帘门洞口、大窗带的外框。

    只有**最外圈**需要 —— 中间被别的洞口挤住的那条边看不见。 */
function addSill(g, w, h, x, y, z, ry, mat) {
  const t = 0.02;
  const geo = new THREE.BoxGeometry(w + t * 2, t, 0.05);
  for (const dy of [h / 2 + t / 2, -h / 2 - t / 2]) {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y + dy, z);
    if (ry) m.rotation.y = ry;
    m.userData.bevel = 'opening-sill';
    g.add(m);
  }
  g.userData.sills = (g.userData.sills || 0) + 2;
  return 2;
}

let P = null;
export function initKit(pal) { P = pal; }

/* ══ 外部资产（Kenney CC0 GLB）工厂 ═════════════════════════════════════════
   为什么要在 kit.js 里引入外部模型：
     纯程序化几何能表达"结构"（体量、层数、开窗），但表达不了"物件"
     （一根电线杆、一个变电箱、一排护栏）—— 这些细节的形状语言太特殊，
     用 Box/Cylinder 拼出来永远是"方块的堆叠感"。
     而 29 个地点的"城市味"恰恰来自这些路边件。

   关键约束（三条，来自 assets.js 与 LICENSE.md）：
     ① 外部资产是**异步**的，而 kit.js 的工厂全是同步的。
        故这里统一返回「包装 Group」：几何同步可用（程序化兜底），
        GLB 就绪后再把自己挂进去。这样调用方完全不用改。
     ② 拿不到 GLB 时必须有兜底，否则白屏 —— 每个工厂都写 fallback 分支。
     ③ 每个 GLB 必须从它自己 kit 的子目录加载（三套 colormap 不同名同内容），
        故 kit 名是必填参数。

   用法：const g = K.glbProp('roads','electricity-pole', () => 程序化兜底());
        K.pumpAssets();   // 由 bridge.js 在启动时调用，把所有已登记项灌进场景
   ═════════════════════════════════════════════════════════════════════════ */

/** 登记表：GLB 就绪后要回填的包装 Group。因为异步，故两段式。 */
const _pendingGlb = [];
let _assetLoader = null;

/** 注入资产加载器（由 bridge.js 在启动时调用一次）。传 null 表示禁用外部资产。 */
export function setAssetLoader(loader) { _assetLoader = loader; }

/**
 * 生成一个"占位 + 异步替换"的物件。
 *
 * @param {string} kit        kit 名：'commercial'|'industrial'|'roads'
 * @param {string} name       GLB 名（不含 .glb）
 * @param {Function} fallback 同步兜底工厂：() => THREE.Object3D（可为 null）
 * @param {object} opt        { y: 底标高, scale, rotY, footprint }
 * @returns {THREE.Group} 包装 Group（同步返回，立即可放进场景）
 */
export function glbProp(kit, name, fallback, opt = {}) {
  const wrap = new THREE.Group();
  wrap.userData.glb = { kit, name, ready: false };

  /* ★ 必须标记 noMerge —— 这是本模块最容易踩的坑：
     mergeStatics 会把静态 Mesh 烘焙进合批、并从树上**摘掉原对象**。
     如果不排除，会发生两件事：
       ① 兜底几何被合并走了，包装 Group 变成空壳，
          warm 完成后 pumpAssets 即使替换成功，画面也**看不出变化**
          （兜底已经变成合批网格留在场景里了）；
       ② 于是"替换"永远只体现在计数器上，是真真正正的假通过。
     标记 noMerge 的代价是这些物件各占一个 draw call，
     但它们数量有限（每地点十几个），换来的是"可替换"这个前提成立。 */
  wrap.userData.noMerge = true;

  /* ① 先上兜底几何 —— 保证"任何时候都有东西可看"。
        这是本设计的关键：GLB 加载失败/未完成都不会留下空洞。 */
  if (typeof fallback === 'function') {
    const fb = fallback();
    if (fb) { fb.userData.isFallback = true; wrap.add(fb); }
  }

  if (opt.y) wrap.position.y = opt.y;
  if (opt.rotY) wrap.rotation.y = opt.rotY;
  if (opt.scale) wrap.scale.setScalar(opt.scale);
  if (opt.footprint) wrap.userData.footprint = opt.footprint;

  /* ② 登记待回填。若资产已就绪，pumpAssets 会立刻（同一帧内）替换。
     ★ owner 显式记下"这次登记属于哪个地点组"。
       为什么不能只靠祖先链判断（见 dropPendingAssets 的注释）：
       ctx.place() 把包装 Group 挂进地点组，但**登记发生在 place 之前**，
       而且在 world 被 dispose 的那一刻，祖先链可能已经被拆开 ——
       那时按祖先找就找不到，登记项会永远滞留在表里（pending 永不为 0）。
       显式记 owner 与祖先链双保险，两条路任一命中即清。 */
  _pendingGlb.push({ wrap, kit, name, opt, owner: _currentOwner });
  return wrap;
}

/* ★ 当前正在构建的地点组。
   由 buildLocation 在开始/结束时设置（见 world.js 的 withAssetScope）。
   这里是模块级可变状态 —— 因为 glbProp 是同步工厂，没有更好的传参路径
   （要传就得改 29 个地点的几十处调用点，改动面远大于收益）。 */
let _currentOwner = null;

/** 设定"当前构建的地点组"，返回一个恢复函数（配合 try/finally 用）。 */
export function setAssetOwner(group) {
  const prev = _currentOwner;
  _currentOwner = group || null;
  return () => { _currentOwner = prev; };
}

/**
 * 把所有登记项尝试替换为真实 GLB。
 * 由 bridge.js 在资产预热完成后调用；可重复调用（幂等）。
 * @returns {number} 本次成功替换的个数（供验证脚本读数）
 */
export function pumpAssets() {
  if (!_assetLoader) return 0;
  let done = 0;
  for (let i = _pendingGlb.length - 1; i >= 0; i--) {
    const it = _pendingGlb[i];
    const inst = _assetLoader.instance(it.kit, it.name, it.opt);
    if (!inst) continue; // 尚未就绪或已失败 → 保留兜底，等下次
    /* 先清空兜底再挂真模型：两者不能同时在树里，否则会看到"重影"
       （程序化方块与 GLB 叠在一起）。 */
    for (let k = it.wrap.children.length - 1; k >= 0; k--) {
      const c = it.wrap.children[k];
      if (c.userData.isFallback) it.wrap.remove(c);
    }
    it.wrap.add(inst);
    it.wrap.userData.glb.ready = true;
    _pendingGlb.splice(i, 1);
    done++;
  }
  return done;
}

/** 待回填数量（0 表示全部已就绪或已放弃）—— 验证脚本用它做收敛断言。 */
export function pendingAssetCount() { return _pendingGlb.length; }

/**
 * 场景被销毁/重建时，丢弃指向已死对象的登记项。
 *
 * ★ 为什么必须有这个函数（这是本模块最隐蔽的一个坑）：
 *   glbProp 登记的是"场景里的包装 Group"。但地点切换会 disposeWorld()，
 *   把旧 group 从场景摘掉并 dispose 其中所有几何。
 *   如果登记表还留着那些旧对象，warm 完成后的 pumpAssets 会：
 *     ① 往一个**已经不在场景里**的 group 上挂 GLB —— 画面毫无变化，
 *        但计数器显示"替换成功"（典型的假通过）；
 *     ② 更糟：disposeWorld 遍历旧 group 时会把 GLB 的共享几何也 dispose 掉，
 *        而缓存里的原型还在用它 —— 之后所有实例都会渲染成空白。
 *   所以场景回收时必须同步清表。传 group 则只清该 group 下的登记项。
 * @param {THREE.Object3D|null} group 被销毁的根；null 表示清空全部。
 * @returns {number} 清掉的登记项数
 */
export function dropPendingAssets(group = null) {
  const before = _pendingGlb.length;
  if (!group) {
    _pendingGlb.length = 0;
    return before;
  }
  for (let i = _pendingGlb.length - 1; i >= 0; i--) {
    const it = _pendingGlb[i];
    /* 两条判据，任一命中即视为属于该被销毁的地点：
       ① owner 显式匹配 —— 最可靠，不依赖树结构此刻是否完整；
       ② 祖先链里出现 group —— 兜底（比如 owner 未设置时的旧路径）。 */
    let hit = it.owner === group;
    if (!hit) {
      let p = it.wrap;
      while (p) { if (p === group) { hit = true; break; } p = p.parent; }
    }
    if (hit) _pendingGlb.splice(i, 1);
  }
  return before - _pendingGlb.length;
}

/* ── 具体的外部资产工厂 ────────────────────────────────────────────────
   只挑"形状语言最特殊、程序化最难仿"的路边件。
   刻意**不**替换建筑主体：现有 lowRise/slabBlock/tower 已经带完整
   材质链（法线、粗糙、倒角、贴图重复），换成 GLB 反而丢掉 P0-P3 的成果。

   ★ 模型名全部经 ls 核对存在（见 src/assets/kenney/manifest.json）：
     roads:      light-square / light-square-double / light-curved /
                 construction-barrier / construction-cone / dumpster /
                 electricity-pole / bridge-pillar
     industrial: detail-tank / detail-tank-large / chimney-medium /
                 solar-panel-landscape / water-tower / shipping-container-a
     commercial: detail-awning / detail-parasol-a / detail-overhang */

/** 变电箱 / 储罐（工业 kit）—— 程序化拼不出那个罐体+管口的形。 */
export function tankProp({ large = false, tier = 2 } = {}) {
  const name = large ? 'detail-tank-large' : 'detail-tank';
  return glbProp('industrial', name, () => {
    const g = new THREE.Group();
    const r = large ? 1.1 : 0.8, h = large ? 2.2 : 1.6;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 14), P.common.metal);
    body.position.y = h / 2; body.castShadow = true; g.add(body);
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.55, r * 0.55, 0.22, 12), P.common.metalLight);
    cap.position.y = h + 0.11; g.add(cap);
    g.userData.footprint = { w: r * 2, d: r * 2, h: h + 0.3 };
    return g;
  }, { footprint: { w: large ? 2.2 : 1.6, d: large ? 2.2 : 1.6, h: large ? 2.5 : 1.9 } });
}

/** 烟囱（工业 kit）—— 厂区的天际线标志物。 */
export function chimneyProp({ kind = 'medium' } = {}) {
  return glbProp('industrial', `chimney-${kind}`, null, {
    footprint: { w: 1.2, d: 1.2, h: 8 },
  });
}

/** 水塔（工业 kit）—— 老厂区/城中村边上的典型构筑物。 */
export function waterTowerProp() {
  return glbProp('industrial', 'water-tower', null, {
    footprint: { w: 2.4, d: 2.4, h: 9 },
  });
}

/** 太阳能板（工业 kit）—— 用于新区/园区，提示"这是个有规划的片区"。 */
export function solarPanelProp({ landscape = true } = {}) {
  return glbProp('industrial', landscape ? 'solar-panel-landscape' : 'solar-panel-portrait', null, {
    footprint: { w: 2.0, d: 1.2, h: 1.6 },
  });
}

/** 集装箱（工业 kit）—— 堆场/工地/临时住人的标志。 */
export function shippingContainerProp({ variant = 'a' } = {}) {
  return glbProp('industrial', `shipping-container-${variant}`, () => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(6, 2.6, 2.4), P.common.metal || P.common.metalLight);
    b.position.y = 1.3; b.castShadow = true; g.add(b);
    g.userData.footprint = { w: 6, d: 2.4, h: 2.6 };
    return g;
  }, { footprint: { w: 6, d: 2.4, h: 2.6 } });
}

/** 市政路灯（roads kit）—— 比程序化圆柱杆更有"市政设施"的形。 */
export function cityLamp({ kind = null } = {}) {
  const name = kind || pick(['light-square', 'light-square-double', 'light-curved']);
  return glbProp('roads', name, null, {
    footprint: { w: 0.6, d: 0.6, h: 7 },
  });
}

/** 施工围挡（roads kit）—— 成本极低但信息量大（"这里在施工"）。 */
export function siteBarrier() {
  return glbProp('roads', 'construction-barrier', () => {
    const g = new THREE.Group();
    const b = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.9, 0.16), P.common.metalLight);
    b.position.y = 0.65; b.castShadow = true; g.add(b);
    g.userData.footprint = { w: 2.0, d: 0.2, h: 1.1 };
    return g;
  }, { footprint: { w: 2.0, d: 0.2, h: 1.1 } });
}

/** 交通锥（roads kit）—— 单模型面数极低，可大量散布。 */
export function trafficCone() {
  return glbProp('roads', 'construction-cone', null, {
    footprint: { w: 0.4, d: 0.4, h: 0.6 },
  });
}

/** 大垃圾箱（roads kit 的 dumpster，比程序化圆桶更有街面感）。 */
export function dumpster() {
  return glbProp('roads', 'dumpster', null, {
    footprint: { w: 1.6, d: 0.9, h: 1.2 },
  });
}

/** 电线杆（roads kit）—— 城中村巷子的标志物。 */
export function utilityPole() {
  return glbProp('roads', 'electricity-pole', null, {
    footprint: { w: 0.4, d: 0.4, h: 8 },
  });
}

/** 遮阳篷（商业 kit）—— 挂在店铺门脸上方，把"小卖部"变成"有生活气的铺子"。 */
export function awningProp({ wide = false } = {}) {
  return glbProp('commercial', wide ? 'detail-awning-wide' : 'detail-awning', null, {
    footprint: { w: wide ? 5 : 3, d: 0.9, h: 0.4 },
  });
}

/** 遮阳伞（商业 kit）—— 广场/露天摊位的道具。 */
export function parasolProp({ variant = 'a' } = {}) {
  return glbProp('commercial', `detail-parasol-${variant}`, null, {
    footprint: { w: 1.6, d: 1.6, h: 2.4 },
  });
}


/* ── 招牌材质缓存：同文只画一次 canvas ─────────────────────────────────── */
const _signCache = new Map();
function signMat(text, opt = {}) {
  const key = text + JSON.stringify(opt);
  if (_signCache.has(key)) return _signCache.get(key);
  const m = new THREE.MeshStandardMaterial({ map: signTex(text, opt), roughness: 0.85 });
  _signCache.set(key, m);
  return m;
}

/* ── 文字贴图（非招牌：门牌、横幅、标语、告示）────────────────────────── */
const _labelCache = new Map();
function labelMat(text, opt = {}) {
  const {
    bg = '#e8e4d8', fg = '#2a2a28', w = 512, h = 128,
    font = '700 62px "Microsoft YaHei","PingFang SC",sans-serif',
  } = opt;
  const key = `${text}|${bg}|${fg}|${w}|${h}|${font}`;
  if (_labelCache.has(key)) return _labelCache.get(key);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = fg;
  ctx.font = font;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const lines = String(text).split('\n');
  const lh = h / (lines.length + 0.6);
  lines.forEach((ln, i) => ctx.fillText(ln, w / 2, lh * (i + 0.9)));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  const m = new THREE.MeshStandardMaterial({ map: t, roughness: 0.9 });
  _labelCache.set(key, m);
  return m;
}

/* ══ 结构 ═══════════════════════════════════════════════════════════════ */

/** 城中村自建房：瓷砖外墙 + 窗 + 空调 + 晾衣杆 + 水箱 */
export function lowRise({ w, d, floors, floorH = 2.9, tier = 1, windows = true }) {
  const T = tierOf(tier);
  const g = new THREE.Group();
  const h = floors * floorH;
  const wallMat = pick(T.walls);

  const geo = new THREE.BoxGeometry(w, h, d);
  /* ★ [P3-1] 原来手写 `mat.map = wallMat.map.clone(); mat.map.repeat.set(w/3.2, h/3.2)`。
     两个问题：① 密度 3.2m 比真实砖格大 1/3；② **只克隆了 map，normalMap 共用**
     → 凹凸密度在所有楼上都一样（表现为"近看纹理全糊"），而且不报错。
     fitRepeat() 成对克隆并统一走 TILE_M。 */
  const mat = fitRepeat(wallMat, w, h);
  const body = new THREE.Mesh(geo, mat);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 竖向压边：城中村自建房的四角是砖砌抹灰的硬角，加一道压边就有实体感
  addVerticalChamfers(g, w, d, h, 0, T.trim, 2);

  if (windows) {
    const cols = Math.max(2, Math.round(w / 2.6));
    for (let f = 0; f < floors; f++) {
      const y = f * floorH + floorH * 0.56;
      for (let c = 0; c < cols; c++) {
        const x = -w / 2 + (c + 0.5) * (w / cols);
        for (const side of [1, -1]) {
          const win = makeWindow(0.88, 1.24);
          win.position.set(x, y, side * (d / 2 + 0.05));
          if (side < 0) win.rotation.y = Math.PI;
          g.add(win);
        }
      }
    }
  }

  // 空调外机
  for (let i = 0, n = rndInt(2, tier === 1 ? 7 : 4); i < n; i++) {
    const ac = makeACUnit();
    const side = chance(0.5) ? 1 : -1;
    ac.position.set(rnd(-w / 2 + 0.7, w / 2 - 0.7), rnd(floorH * 1.2, h - 0.9), side * (d / 2 + 0.19));
    if (side < 0) ac.rotation.y = Math.PI;
    g.add(ac);
  }

  // 晾衣杆（城中村最标志性的生活痕迹）
  if (tier <= 2) {
    for (let i = 0, n = rndInt(0, tier === 1 ? 4 : 2); i < n; i++) {
      const y = rnd(floorH * 1.6, h - 0.6);
      const side = chance(0.5) ? 1 : -1;
      const len = rnd(1.4, 2.3);
      const x = rnd(-w / 2 + 1.2, w / 2 - 1.2);
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, len, 6), P.common.metal);
      rod.rotation.z = Math.PI / 2;
      rod.position.set(x, y, side * (d / 2 + 0.5));
      g.add(rod);
      const clothes = rndInt(1, 3);
      for (let c = 0; c < clothes; c++) {
        const cw = rnd(0.32, 0.55), ch = rnd(0.6, 1.0);
        const cloth = new THREE.Mesh(new THREE.PlaneGeometry(cw, ch), pick(P.common.cloth));
        cloth.position.set(x - len / 2 + (c + 1) * (len / (clothes + 1)), y - ch / 2 - 0.03, side * (d / 2 + 0.5));
        cloth.castShadow = true;
        g.add(cloth);
      }
    }
  }

  // 女儿墙 + 水箱 / 铁皮棚
  const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.16, 0.5, d + 0.16), wallMat);
  parapet.position.y = h + 0.25;
  parapet.castShadow = true;
  g.add(parapet);

  if (chance(tier === 1 ? 0.75 : 0.4)) {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.62, 0.62, 1.15, 14),
      new THREE.MeshStandardMaterial({ color: 0x9aa39c, roughness: 0.6, metalness: 0.35 }));
    tank.position.set(rnd(-w / 4, w / 4), h + 1.1, rnd(-d / 4, d / 4));
    tank.castShadow = true;
    g.add(tank);
  }
  if (chance(0.5)) {
    const shed = new THREE.Mesh(new THREE.BoxGeometry(rnd(2, 3.4), 0.12, rnd(1.6, 2.6)),
      surf(roofTex(), { roughness: 0.9 }));
    shed.position.set(rnd(-w / 4, w / 4), h + 0.9, rnd(-d / 4, d / 4));
    shed.rotation.z = rnd(-0.1, 0.1);
    shed.castShadow = true;
    g.add(shed);
  }
  g.userData.footprint = { w, d, h };
  return g;
}

/** 板楼：老小区 / 郊区的主力，长条 + 连排阳台 + 单元门 */
export function slabBlock({ w, d, floors, floorH = 2.85, tier = 2, balcony = true, units = null }) {
  const T = tierOf(tier);
  const g = new THREE.Group();
  const h = floors * floorH;
  const wallMat = pick(T.walls);

  const mat = fitRepeat(wallMat, w, h);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 板楼体量长 → 四个角都做压边（长边的角最容易被看到）
  addVerticalChamfers(g, w, d, h, 0, T.trim, 4);

  const n = units || Math.max(2, Math.round(w / 3.6));
  const unitW = w / n;

  for (let f = 0; f < floors; f++) {
    const y = f * floorH + floorH * 0.42;
    for (let u = 0; u < n; u++) {
      const cx = -w / 2 + (u + 0.5) * unitW;
      // 单元正面的窗
      for (const side of [1, -1]) {
        const win = makeWindow(1.05, 1.35);
        win.position.set(cx, y + 0.5, side * (d / 2 + 0.05));
        if (side < 0) win.rotation.y = Math.PI;
        g.add(win);
      }
      // 阳台：外挑的板 + 栏杆
      if (balcony && f > 0) {
        for (const side of [1, -1]) {
          const bw = unitW * 0.78;
          const slab = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.12, 1.05), T.trim);
          slab.position.set(cx, y + 1.5, side * (d / 2 + 0.55));
          slab.castShadow = true;
          slab.receiveShadow = true;
          g.add(slab);
          const rail = new THREE.Mesh(new THREE.BoxGeometry(bw, 0.9, 0.06), P.common.metalLight);
          rail.position.set(cx, y + 1.95, side * (d / 2 + 1.06));
          g.add(rail);
          // 有些阳台封起来（老小区常见）
          if (chance(0.35)) {
            const enc = new THREE.Mesh(new THREE.PlaneGeometry(bw, 0.92), P.common.glassPane);
            enc.position.set(cx, y + 1.95, side * (d / 2 + 1.07));
            if (side < 0) enc.rotation.y = Math.PI;
            g.add(enc);
          }
        }
      }
    }
  }

  // 单元门 + 门牌
  for (let u = 0; u < n; u++) {
    const cx = -w / 2 + (u + 0.5) * unitW;
    const doorMat = tier <= 1 ? P.common.dark : P.common.metalLight;
    const door = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.1, 0.1), doorMat);
    door.position.set(cx, 1.05, d / 2 + 0.06);
    g.add(door);
    // ★ [P3-3] 单元门洞压边
    addSill(g, 1.1, 2.1, cx, 1.05, d / 2 + 0.07, 0, T.trim);
    if (chance(0.6)) {
      const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.3),
        labelMat(`${rndInt(1, 9)}栋`, { bg: '#c8c4b8', fg: '#3a3a36', w: 256, h: 180, font: '700 96px "Microsoft YaHei",sans-serif' }));
      plate.position.set(cx + 0.85, 1.75, d / 2 + 0.07);
      g.add(plate);
    }
  }

  const parapet = new THREE.Mesh(new THREE.BoxGeometry(w + 0.14, 0.46, d + 0.14), wallMat);
  parapet.position.y = h + 0.23;
  parapet.castShadow = true;
  g.add(parapet);

  g.userData.footprint = { w, d, h };
  return g;
}

/** 高层塔楼：幕墙 + 裙楼 + 顶部设备层 */
export function tower({ w, d, floors, floorH = 3.4, tier = 3, podium = true, crown = true }) {
  const T = tierOf(tier);
  const g = new THREE.Group();
  const h = floors * floorH;
  /* ★ [P3-1] 幕墙原来 4.2m/格 —— 而 curtainWallTex 按 1200mm 分格画，
     一乘就是「一格玻璃 4.2m × 每格 4 块」→ 单块玻璃 1.05m，勉强；
     但整片幕墙的框线密度明显偏稀。统一走 fitRepeat + TILE_M。 */
  const curtain = fitRepeat(P.common.curtain, w, h);

  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), curtain);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 塔楼四角竖向压边 —— 大楼的角线是最抢眼的"实体感"信号
  addVerticalChamfers(g, w, d, h, 0, T.trim, 4);

  // 楼层横向分隔线：给高楼"层"的尺度感
  const bandMat = T.trim;
  for (let f = 1; f < floors; f++) {
    const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.12, 0.14, d + 0.12), bandMat);
    band.position.y = f * floorH;
    g.add(band);
  }

  // 裙楼
  if (podium) {
    const ph = 4.6, pw = w + 3.2, pd = d + 3.2;
    const podMat = tier >= 3
      ? surf(concreteTex({ base: '#9c9a92', wet: 0 }), { roughness: 0.66 })
      : T.wall;
    const pod = new THREE.Mesh(new THREE.BoxGeometry(pw, ph, pd), podMat);
    pod.position.y = ph / 2;
    pod.castShadow = true; pod.receiveShadow = true;
    g.add(pod);
    // ★ [P3-3] 裙楼的角也要压边（裙楼比塔楼大一圈，它的角才是贴着人的那个）
    addVerticalChamfers(g, pw, pd, ph, 0, T.trim, 4);
    // 裙楼玻璃
    for (const side of [1, -1]) {
      const gl = new THREE.Mesh(new THREE.PlaneGeometry(pw * 0.86, 2.6), P.common.glassPane);
      gl.position.set(0, 1.9, side * (pd / 2 + 0.03));
      if (side < 0) gl.rotation.y = Math.PI;
      g.add(gl);
    }
    // 入口雨棚
    const canopy = new THREE.Mesh(new THREE.BoxGeometry(Math.min(pw * 0.5, 6), 0.22, 2.4), P.common.dark);
    canopy.position.set(0, 3.3, pd / 2 + 1.0);
    canopy.castShadow = true;
    g.add(canopy);
  }

  // 顶部设备层 / 冠部
  if (crown) {
    const cr = new THREE.Mesh(new THREE.BoxGeometry(w * 0.62, 1.6, d * 0.62), T.trim);
    cr.position.y = h + 0.8;
    cr.castShadow = true;
    g.add(cr);
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.6, 6), P.common.metal);
    mast.position.y = h + 2.9;
    g.add(mast);
  }

  g.userData.footprint = { w, d, h };
  return g;
}

/** 沿街商铺单元：卷帘门 + 雨棚 + 招牌 + 灯箱 */
export function shopUnit({ width = 5, sign = '小卖部', tier = 2, height = 3.4, open = true, signColor = null }) {
  const T = tierOf(tier);
  const g = new THREE.Group();

  const frame = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.3), T.wall);
  frame.position.set(0, height / 2, -0.15);
  frame.castShadow = true; frame.receiveShadow = true;
  g.add(frame);

  /* ★ [P3-3] 铺面的外框压边 —— 沿街商铺是"人贴着脸看"的尺度，
     门框/雨棚边这类 2cm 细条在这个距离上是**真能看清**的，
     所以这里用 4 根全做（跟大楼不同：大楼的角 2cm 会掉进 mipmap）。 */
  addVerticalChamfers(g, width, 0.3, height, 0, T.trim, 4);

  // 卷帘门 / 玻璃门
  if (open) {
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.74, height * 0.7), P.common.glassPane);
    pane.position.set(0, height * 0.36, 0.02);
    g.add(pane);
    const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, 0.12, 0.08), P.common.metalLight);
    doorFrame.position.set(width * 0.39, height * 0.36, 0.04);
    g.add(doorFrame);
    // ★ [P3-3] 门洞上下压边
    addSill(g, width * 0.74, height * 0.7, 0, height * 0.36, 0.03, 0, T.trim);
  } else {
    const shutter = new THREE.Mesh(new THREE.BoxGeometry(width * 0.78, height * 0.72, 0.1),
      surf(metalPanelTex({ base: '#6b6f6a', ribMM: 75 }), { roughness: 0.86 }));
    shutter.position.set(0, height * 0.37, 0.02);
    g.add(shutter);
    // ★ [P3-3] 卷帘门洞口压边（卷帘门框是最典型的"包边"结构）
    addSill(g, width * 0.78, height * 0.72, 0, height * 0.37, 0.03, 0, T.trim);
  }

  // 雨棚
  const awning = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, 1.15), T.awning);
  awning.position.set(0, height * 0.8, 0.6);
  awning.rotation.x = -0.12;
  awning.castShadow = true;
  g.add(awning);

  // 招牌
  const signBox = new THREE.Mesh(new THREE.BoxGeometry(width * 0.96, 0.8, 0.18),
    signColor ? new THREE.MeshStandardMaterial({ color: signColor, roughness: 0.85 }) : T.accent);
  signBox.position.set(0, height * 0.98, 0.06);
  g.add(signBox);
  const signPl = new THREE.Mesh(new THREE.PlaneGeometry(width * 0.92, 0.72), signMat(sign));
  signPl.position.set(0, height * 0.98, 0.16);
  g.add(signPl);

  g.userData.footprint = { w: width, d: 0.6, h: height };
  return g;
}

/** 厂房 / 仓库：彩钢板 + 锯齿天窗 + 卷帘大门 */
export function shed({ w, d, h = 6.5, tier = 2, sawtooth = true, doors = 2, panel = null }) {
  const g = new THREE.Group();
  const mat = panel || (tier <= 1 ? P.common.panelRust : P.common.panel);
  const m = fitRepeat(mat, w, h);

  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 厂房的角（钢结构必有角钢包边）
  addVerticalChamfers(g, w, d, h, 0, P.common.metalLight, 4);

  // 锯齿屋顶（老厂房典型）
  if (sawtooth) {
    const n = Math.max(2, Math.round(d / 4));
    for (let i = 0; i < n; i++) {
      const z = -d / 2 + (i + 0.5) * (d / n);
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(w * 0.98, 0.1, d / n * 0.86), P.common.panel);
      tooth.position.set(0, h + 0.55, z);
      tooth.rotation.x = -0.5;
      tooth.castShadow = true;
      g.add(tooth);
      const glass = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.9, d / n * 0.66), P.common.glassPane);
      glass.position.set(0, h + 0.42, z + 0.5);
      glass.rotation.x = Math.PI / 2 - 0.9;
      g.add(glass);
    }
  } else {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.3, 0.18, d + 0.3), P.common.panel);
    roof.position.y = h + 0.1;
    roof.castShadow = true;
    g.add(roof);
  }

  // 卷帘大门
  for (let i = 0; i < doors; i++) {
    const dw = Math.min(4.2, w / (doors + 0.6));
    const x = doors === 1 ? 0 : -w / 2 + (i + 0.5) * (w / doors);
    const door = new THREE.Mesh(new THREE.BoxGeometry(dw, h * 0.62, 0.16),
      surf(metalPanelTex({ base: '#7a7f78', ribMM: 90 }), { roughness: 0.84 }));
    door.position.set(x, h * 0.31, d / 2 + 0.09);
    g.add(door);
    // ★ [P3-3] 厂房大门洞口的包边（工业门必有门套）
    addSill(g, dw, h * 0.62, x, h * 0.31, d / 2 + 0.11, 0, P.common.metalLight);
  }

  // 墙面通风管 / 配电箱
  if (chance(0.7)) {
    const duct = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, h * 0.8, 10), P.common.metal);
    duct.position.set(-w / 2 - 0.4, h * 0.45, rnd(-d / 3, d / 3));
    duct.castShadow = true;
    g.add(duct);
  }
  for (let i = 0, n = rndInt(1, 3); i < n; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.7, 0.3), P.common.metalLight);
    box.position.set(rnd(-w / 2 + 1, w / 2 - 1), rnd(2, 3.4), d / 2 + 0.2);
    g.add(box);
  }

  g.userData.footprint = { w, d, h };
  return g;
}

/** 机构大楼：政府 / 法院 / 银行 / 医院 —— 对称、台阶、柱廊、旗杆 */
export function hall({ w, d, h = 11, tier = 2, steps = true, columns = true, roofStyle = 'flat' }) {
  const T = tierOf(tier);
  const g = new THREE.Group();
  const wallMat = tier >= 3
    ? P.common.stone
    : surf(concreteTex({ base: tier <= 1 ? '#8f8c84' : '#a5a29a', wet: 0.1, crack: 8 }), { roughness: 0.9 });

  const wm = fitRepeat(wallMat, w, h);

  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), wm);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 机构大楼的角柱 —— 政务/银行建筑的转角本来就有石材角柱，正好对上
  addVerticalChamfers(g, w, d, h, 0, P.common.stone, 4);

  // 竖向窗带（官方建筑的秩序感）
  const cols = Math.max(3, Math.round(w / 2.4));
  for (let f = 0; f < Math.max(1, Math.floor(h / 3.2)); f++) {
    const y = 1.9 + f * 3.2;
    if (y > h - 1.2) break;
    for (let c = 0; c < cols; c++) {
      const x = -w / 2 + (c + 0.5) * (w / cols);
      const win = new THREE.Mesh(new THREE.PlaneGeometry(w / cols * 0.6, 1.7), P.common.glassPane);
      win.position.set(x, y, d / 2 + 0.04);
      g.add(win);
    }
  }

  // 台阶
  if (steps) {
    const sw = Math.min(w * 0.62, 12);
    for (let i = 0; i < 4; i++) {
      const st = new THREE.Mesh(new THREE.BoxGeometry(sw, 0.22, 0.9), P.common.stone);
      st.position.set(0, 0.11 + i * 0.22, d / 2 + 2.4 - i * 0.9);
      st.receiveShadow = true;
      g.add(st);
    }
  }

  // 柱廊
  if (columns) {
    const n = Math.max(3, Math.round(w / 3.4));
    for (let i = 0; i < n; i++) {
      const x = -w / 2 + (i + 0.5) * (w / n);
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.38, h * 0.34, 14), P.common.stone);
      col.position.set(x, h * 0.17, d / 2 + 1.7);
      col.castShadow = true;
      g.add(col);
    }
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(w, 0.7, 2.6), P.common.stone);
    lintel.position.set(0, h * 0.36, d / 2 + 1.7);
    lintel.castShadow = true;
    g.add(lintel);
  }

  // 屋顶样式
  if (roofStyle === 'hip') {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(w * 0.78, 2.6, 4), P.common.dark);
    cone.rotation.y = Math.PI / 4;
    cone.position.y = h + 1.3;
    cone.castShadow = true;
    g.add(cone);
  } else {
    const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 0.4, 0.5, d + 0.4), T.trim);
    roof.position.y = h + 0.25;
    roof.castShadow = true;
    g.add(roof);
  }

  g.userData.footprint = { w, d, h };
  return g;
}

/** 教学楼：长条 + 大窗 + 外廊（南方学校的连廊） */
export function teachingBlock({ w, d, floors = 4, floorH = 3.6, tier = 2, corridor = true }) {
  const T = tierOf(tier);
  const g = new THREE.Group();
  const h = floors * floorH;

  const wallMat = pick(T.walls);
  const mat = fitRepeat(wallMat, w, h);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);

  // ★ [P3-3] 教学楼的角
  addVerticalChamfers(g, w, d, h, 0, T.trim, 4);

  const cols = Math.max(4, Math.round(w / 3.0));
  for (let f = 1; f <= floors; f++) {
    const y = (f - 0.5) * floorH;
    for (let c = 0; c < cols; c++) {
      const x = -w / 2 + (c + 0.5) * (w / cols);
      // 大窗（教学楼的窗比住宅大得多）
      const win = new THREE.Mesh(new THREE.PlaneGeometry(w / cols * 0.72, floorH * 0.52), P.common.glassPane);
      win.position.set(x, y, d / 2 + 0.04);
      g.add(win);
      if (corridor) {
        const win2 = win.clone();
        win2.position.z = -(d / 2 + 0.04);
        win2.rotation.y = Math.PI;
        g.add(win2);
      }
    }
    // 外廊板 + 栏杆
    if (corridor) {
      const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.14, 1.5), T.trim);
      slab.position.set(0, (f - 1) * floorH + floorH * 0.06, d / 2 + 0.8);
      slab.receiveShadow = true;
      g.add(slab);
      const rail = new THREE.Mesh(new THREE.BoxGeometry(w, 1.0, 0.07), P.common.metalLight);
      rail.position.set(0, (f - 1) * floorH + floorH * 0.06 + 0.55, d / 2 + 1.52);
      g.add(rail);
    }
    const band = new THREE.Mesh(new THREE.BoxGeometry(w + 0.1, 0.16, d + 0.1), T.trim);
    band.position.y = f * floorH;
    g.add(band);
  }

  g.userData.footprint = { w, d, h };
  return g;
}

/** 摊位：折叠棚 + 台面 + 货箱（菜市场 / 夜市 / 二手市场） */
export function stall({ w = 2.4, d = 1.2, tier = 2, colors = null, goods = true, box = false }) {
  const g = new THREE.Group();
  const cw = w, cd = d;

  // 台面
  const top = new THREE.Mesh(new THREE.BoxGeometry(cw, 0.1, cd), P.common.wood);
  top.position.y = 0.9;
  top.castShadow = true; top.receiveShadow = true;
  g.add(top);
  for (const sx of [-1, 1]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.9, cd * 0.9), P.common.metal);
    leg.position.set(sx * (cw / 2 - 0.14), 0.45, 0);
    g.add(leg);
  }

  // 折叠棚（彩色防雨布）
  const palette4 = colors || [0x6b4a44, 0x44525a, 0x5a5a44, 0x4a4450];
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(cw * 1.12, 0.08, cd * 1.5),
    new THREE.MeshStandardMaterial({ color: pick(palette4), roughness: 0.95, side: THREE.DoubleSide }));
  canopy.position.set(0, 2.2, 0);
  canopy.rotation.x = -0.05;
  canopy.castShadow = true;
  g.add(canopy);
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 2.2, 6), P.common.metal);
      post.position.set(sx * (cw / 2 - 0.06), 1.1, sz * (cd * 0.66));
      g.add(post);
    }
  }

  // 台上货物
  if (goods) {
    const n = rndInt(3, 6);
    for (let i = 0; i < n; i++) {
      const gw = rnd(0.18, 0.34), gh = rnd(0.12, 0.3);
      const item = new THREE.Mesh(
        Math.random() < 0.5 ? new THREE.BoxGeometry(gw, gh, gw * 0.8) : new THREE.CylinderGeometry(gw * 0.4, gw * 0.42, gh, 8),
        new THREE.MeshStandardMaterial({ color: pick([0x6a7a4a, 0x8a6a3a, 0x7a5a4a, 0x5a6a6a, 0x8a8a5a, 0xa08a5a]), roughness: 0.9 }));
      item.position.set(rnd(-cw / 2 + 0.3, cw / 2 - 0.3), 0.97 + gh / 2, rnd(-cd / 2 + 0.25, cd / 2 - 0.25));
      item.castShadow = true;
      g.add(item);
    }
  }

  // 台下的货箱 / 泡沫箱
  if (box) {
    for (let i = 0, n = rndInt(1, 3); i < n; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(rnd(0.5, 0.8), rnd(0.3, 0.5), rnd(0.4, 0.6)),
        new THREE.MeshStandardMaterial({ color: pick([0xd8d4c8, 0x8a6a4a]), roughness: 0.92 }));
      b.position.set(rnd(-cw / 2 + 0.4, cw / 2 - 0.4), 0.22, rnd(-cd / 2, cd / 2) - 0.3);
      b.castShadow = true;
      g.add(b);
    }
  }

  g.userData.footprint = { w: cw, d: cd, h: 2.2 };
  return g;
}

/** 集装箱 */
export function container({ w = 6, d = 2.4, h = 2.6, color = 0x3f5a6a }) {
  const g = new THREE.Group();
  /* ★ [P1-1 顺带修复] 原来传的是 `period: 12` —— 而 metalPanelTex 的参数名
     早已是 `ribMM`。多传的参数被静默忽略 → 所有集装箱的波纹肋距都退回默认
     150mm，跟"12"这个意图完全无关。这就是本项目第 4 类缺陷
     「参数改名但调用方没跟」的标准样本：不报错、不崩、就是不对。
     另外 metalness 0.24 属 P0-2 点名的"半金属"最差值，集装箱是**涂漆钢**，
     漆面是非金属，归 0 才对（真金属感靠 IBL 反射，不靠 metalness）。 */
  const m = surf(metalPanelTex({ base: '#3f5a6a', ribMM: 120 }), {
    roughness: 0.82, metalness: 0,
  });
  m.color = new THREE.Color(color);
  const body = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
  body.position.y = h / 2;
  body.castShadow = true; body.receiveShadow = true;
  g.add(body);
  // 端部棱纹
  for (const sx of [-1, 1]) {
    const end = new THREE.Mesh(new THREE.BoxGeometry(0.08, h * 0.94, d * 0.94), P.common.dark);
    end.position.set(sx * (w / 2 + 0.04), h / 2, 0);
    g.add(end);
  }
  g.userData.footprint = { w, d, h };
  return g;
}

/** 凉亭：寺庙 / 公园 */
export function pavilion({ r = 2.2, h = 3.4, tier = 2 } = {}) {
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.3, 6), P.common.stone);
  base.position.y = 0.15;
  base.receiveShadow = true;
  g.add(base);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const col = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, h, 8),
      tier >= 3 ? P.common.stone : new THREE.MeshStandardMaterial({ color: 0x7a3f36, roughness: 0.88 }));
    col.position.set(Math.cos(a) * r * 0.82, h / 2 + 0.3, Math.sin(a) * r * 0.82);
    col.castShadow = true;
    g.add(col);
  }
  const roof = new THREE.Mesh(new THREE.ConeGeometry(r * 1.35, 1.5, 6), P.common.dark);
  roof.position.y = h + 1.0;
  roof.castShadow = true;
  g.add(roof);
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), P.common.accent || P.common.metal);
  finial.position.y = h + 1.85;
  g.add(finial);
  g.userData.footprint = { w: r * 1.4, d: r * 1.4, h: h + 1.5 };
  return g;
}

/** 牌坊 / 大门 */
export function archway({ w = 7, h = 5.2, text = '城中村' }) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x6a4038, roughness: 0.88 });
  for (const sx of [-1, 1]) {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.6), mat);
    p.position.set(sx * (w / 2 - 0.3), h / 2, 0);
    p.castShadow = true;
    g.add(p);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(w, 0.95, 0.7), mat);
  beam.position.y = h - 0.5;
  beam.castShadow = true;
  g.add(beam);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.28, 1.4), P.common.dark);
  roof.position.y = h + 0.05;
  roof.castShadow = true;
  g.add(roof);
  const pl = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.62, 0.72), labelMat(text, { bg: '#5a3630', fg: '#e8dcc0', font: '700 74px "Microsoft YaHei",sans-serif' }));
  pl.position.set(0, h - 0.5, 0.37);
  g.add(pl);
  const pl2 = pl.clone(); pl2.position.z = -0.37; pl2.rotation.y = Math.PI; g.add(pl2);
  return g;
}

/** 围墙 / 围挡 */
export function fenceWall({ len, h = 2.4, tier = 2, kind = 'brick' }) {
  const g = new THREE.Group();
  let mat;
  if (kind === 'hoarding') {
    // ★ 同 container：period → ribMM；metalness 0.15（半金属）→ 0
    mat = surf(metalPanelTex({ base: '#4d6a78', ribMM: 200 }), { roughness: 0.85, metalness: 0 });
  } else if (kind === 'railing') {
    mat = null;
  } else {
    mat = surf(concreteTex({ base: tier <= 1 ? '#84827a' : '#9a9890', wet: 0.15, crack: 10 }), { roughness: 0.94 });
  }

  if (kind === 'railing') {
    const n = Math.max(2, Math.round(len / 2.2));
    for (let i = 0; i <= n; i++) {
      const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, h, 0.1), P.common.metal);
      p.position.set(-len / 2 + (i * len) / n, h / 2, 0);
      g.add(p);
    }
    for (let k = 0; k < 3; k++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.06), P.common.metal);
      bar.position.set(0, 0.35 + k * (h - 0.5) / 2, 0);
      g.add(bar);
    }
  } else {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.26), mat);
    wall.position.y = h / 2;
    wall.castShadow = true; wall.receiveShadow = true;
    g.add(wall);
    const cap = new THREE.Mesh(new THREE.BoxGeometry(len + 0.1, 0.12, 0.36), P.common.trim || P.common.metalLight);
    cap.position.y = h + 0.06;
    g.add(cap);
  }
  g.userData.footprint = { w: len, d: 0.3, h };
  return g;
}

/** 广告牌 / 宣传栏 / 指示牌 */
export function billboard({ w = 3.6, h = 2.2, y = 2.6, text = '招工', bg = '#3a4a58', fg = '#e8e4d8', legs = true }) {
  const g = new THREE.Group();
  const panel = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.12), P.common.dark);
  panel.position.y = y;
  panel.castShadow = true;
  g.add(panel);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(w * 0.94, h * 0.88),
    labelMat(text, { bg, fg, w: 512, h: Math.round(512 * h / w) }));
  face.position.set(0, y, 0.07);
  g.add(face);
  if (legs) {
    for (const sx of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, y - h / 2, 8), P.common.metal);
      leg.position.set(sx * w * 0.34, (y - h / 2) / 2, 0);
      g.add(leg);
    }
  }
  return g;
}

/* ══ 道具 ═══════════════════════════════════════════════════════════════ */

/** 电线杆 */
export function pole({ h = 9, arms = 3 } = {}) {
  const g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.19, h, 10),
    surf(concreteTex({ base: '#8b8a80', wet: 0, crack: 8 }), { roughness: 0.95 }));
  p.position.y = h / 2;
  p.castShadow = true;
  g.add(p);
  for (let i = 0; i < arms; i++) {
    const arm = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.09, 0.09), P.common.metal);
    arm.position.y = h - 1.6 + i * 0.75;
    arm.castShadow = true;
    g.add(arm);
  }
  return g;
}

/** 电线：下垂曲线 */
export function wire(a, b, sag = 0.9) {
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  mid.y -= sag;
  const curve = new THREE.CatmullRomCurve3([a, mid, b]);
  /* [2026-09-18 美术] 半径 0.028 → 0.022、色 0x24262a → 0x3a3f45。
     原色近乎纯黑、又粗，在浅色天空下会变成一条横穿画面的黑杠（曾被误判为渲染 bug）。
     真实电线的逆光剪影确实偏暗，但不该是纯黑 —— 有 IBL 之后给一点环境反射即可。 */
  const geo = new THREE.TubeGeometry(curve, 20, 0.022, 5, false);
  return new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x3a3f45, roughness: 0.85 }));
}

/** 路灯 */
export function streetLamp({ h = 7, tier = 2 } = {}) {
  const g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.13, h, 10), P.common.metal);
  p.position.y = h / 2; p.castShadow = true; g.add(p);
  const arm = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.09, 0.09), P.common.metal);
  arm.position.set(0.7, h - 0.1, 0); arm.rotation.z = 0.16; g.add(arm);
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.14, 0.34), P.common.metalLight);
  head.position.set(1.4, h - 0.24, 0); g.add(head);
  // 灯罩下的微光（晦暗调里唯一的高光点）
  const bulb = new THREE.Mesh(new THREE.PlaneGeometry(0.6, 0.28),
    new THREE.MeshBasicMaterial({ color: tier >= 3 ? 0xfff0c8 : 0xe8d8a8, transparent: true, opacity: 0.5 }));
  bulb.rotation.x = Math.PI / 2;
  bulb.position.set(1.4, h - 0.33, 0);
  /* 标记 noMerge：mergeStatics 会合并静态网格并把原 Mesh 从树上摘掉，
     而夜间要**动态调整**这盏灯罩的透明度/颜色（见 bridge.js::applyNightLights）。
     被合并掉的话材质引用还在、但已经不在渲染树里，改了也看不见。
     代价是每盏灯多一个 draw call —— 路灯总数有限，可接受。 */
  bulb.userData.noMerge = true;
  g.add(bulb);

  /* ★ [2026-09-18 美术 P0-3] 给夜间点光源留一个"锚点"。
     为什么要在这里打标记、而不是让 bridge.js 自己遍历找灯头：
     灯头位置依赖 h（灯杆高度），只有本函数知道；bridge 遍历场景时
     只能拿到网格的世界坐标，没法区分"这根杆的灯头在哪"。
     所以把**相对灯杆原点的偏移**存进 userData，由 bridge 换算世界坐标。 */
  g.userData.lampHead = { x: 1.4, y: h - 0.35, z: 0 };
  g.userData.lampBulb = bulb; // 夜间要把它调亮（白天只是个淡淡的罩子）
  return g;
}

/** 树 */
export function tree({ h = 5.2, kind = 'broad', tier = 2 } = {}) {
  const g = new THREE.Group();
  const bark = new THREE.MeshStandardMaterial({ color: 0x4a3f34, roughness: 0.95 });
  const leafColors = tier >= 3 ? [0x46603a, 0x3e5636, 0x506844] : [0x3c4a34, 0x44503a, 0x36442e];

  const trunkH = h * (kind === 'palm' ? 0.82 : 0.46);
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(h * 0.035, h * 0.055, trunkH, 7), bark);
  trunk.position.y = trunkH / 2;
  trunk.castShadow = true;
  g.add(trunk);

  if (kind === 'palm') {
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const frond = new THREE.Mesh(new THREE.PlaneGeometry(h * 0.55, h * 0.14),
        new THREE.MeshStandardMaterial({ color: pick(leafColors), roughness: 0.9, side: THREE.DoubleSide }));
      frond.position.set(Math.cos(a) * h * 0.24, trunkH + 0.2, Math.sin(a) * h * 0.24);
      frond.rotation.set(-0.5, -a, 0.2);
      g.add(frond);
    }
  } else {
    const blobs = rndInt(3, 4);
    for (let i = 0; i < blobs; i++) {
      const r = h * rnd(0.24, 0.34);
      const blob = new THREE.Mesh(new THREE.IcosahedronGeometry(r, 1),
        new THREE.MeshStandardMaterial({ color: pick(leafColors), roughness: 0.97, flatShading: true }));
      blob.position.set(rnd(-h * 0.16, h * 0.16), trunkH + r * rnd(0.5, 1.1), rnd(-h * 0.16, h * 0.16));
      blob.castShadow = true;
      g.add(blob);
    }
  }
  g.userData.footprint = { w: 0.5, d: 0.5, h };
  return g;
}

/** 绿篱 */
export function hedge({ len, h = 0.9, w = 0.8 }) {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.BoxGeometry(len, h, w),
    new THREE.MeshStandardMaterial({ color: 0x38462e, roughness: 0.98, flatShading: true }));
  b.position.y = h / 2;
  b.castShadow = true; b.receiveShadow = true;
  g.add(b);
  return g;
}

/** 花坛 */
export function planter({ w = 1.6, d = 1.6, h = 0.5 }) {
  const g = new THREE.Group();
  const box = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), P.common.stone);
  box.position.y = h / 2; box.castShadow = true; box.receiveShadow = true; g.add(box);
  const soil = new THREE.Mesh(new THREE.BoxGeometry(w * 0.86, 0.1, d * 0.86),
    new THREE.MeshStandardMaterial({ color: 0x3a3128, roughness: 1 }));
  soil.position.y = h + 0.02; g.add(soil);
  for (let i = 0, n = rndInt(3, 6); i < n; i++) {
    const bush = new THREE.Mesh(new THREE.IcosahedronGeometry(rnd(0.14, 0.26), 0),
      new THREE.MeshStandardMaterial({ color: pick([0x40522e, 0x4a5c34, 0x5a4a3a, 0x6a5a44]), roughness: 0.98, flatShading: true }));
    bush.position.set(rnd(-w / 3, w / 3), h + 0.16, rnd(-d / 3, d / 3));
    bush.castShadow = true;
    g.add(bush);
  }
  return g;
}

/** 路障 / 隔离墩 / 锥筒 */
export function barrier({ len = 2.2, h = 1.0, kind = 'fence' }) {
  const g = new THREE.Group();
  if (kind === 'cone') {
    const c = new THREE.Mesh(new THREE.ConeGeometry(0.26, 0.62, 10),
      new THREE.MeshStandardMaterial({ color: 0x9a4a34, roughness: 0.85 }));
    c.position.y = 0.31; c.castShadow = true; g.add(c);
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.05, 0.46), P.common.dark);
    base.position.y = 0.025; g.add(base);
  } else if (kind === 'stone') {
    const s = new THREE.Mesh(new THREE.SphereGeometry(0.3, 12, 8), P.common.stone);
    s.scale.y = 0.85; s.position.y = 0.24; s.castShadow = true; g.add(s);
  } else {
    const bar = new THREE.Mesh(new THREE.BoxGeometry(len, 0.08, 0.08), P.common.metalLight);
    bar.position.y = h; bar.castShadow = true; g.add(bar);
    const bar2 = bar.clone(); bar2.position.y = h * 0.55; g.add(bar2);
    for (let i = 0; i <= 2; i++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, h, 8), P.common.metalLight);
      p.position.set(-len / 2 + (i * len) / 2, h / 2, 0);
      g.add(p);
    }
  }
  return g;
}

/** 脚手架 */
export function scaffold({ w = 8, h = 9, d = 1.2 }) {
  const g = new THREE.Group();
  const mat = P.common.metalLight;
  const nb = Math.max(2, Math.round(w / 1.8));
  for (let i = 0; i <= nb; i++) {
    const x = -w / 2 + (i * w) / nb;
    for (const sz of [-1, 1]) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, h, 8), mat);
      p.position.set(x, h / 2, sz * d / 2);
      g.add(p);
    }
  }
  const levels = Math.max(2, Math.round(h / 2.2));
  for (let l = 1; l <= levels; l++) {
    const y = (l * h) / (levels + 1);
    for (const sz of [-1, 1]) {
      const led = new THREE.Mesh(new THREE.BoxGeometry(w, 0.07, 0.07), mat);
      led.position.set(0, y, sz * d / 2);
      g.add(led);
    }
    const plank = new THREE.Mesh(new THREE.BoxGeometry(w, 0.08, d * 0.92), P.common.wood);
    plank.position.set(0, y, 0);
    plank.receiveShadow = true;
    g.add(plank);
  }
  // 绿色防尘网
  const net = new THREE.Mesh(new THREE.PlaneGeometry(w, h * 0.95),
    new THREE.MeshStandardMaterial({ color: 0x2f4a3a, roughness: 0.98, transparent: true, opacity: 0.82, side: THREE.DoubleSide }));
  net.position.set(0, h / 2, d / 2 + 0.03);
  g.add(net);
  g.userData.footprint = { w, d, h };
  return g;
}

/** 塔吊 */
export function crane({ h = 26, jib = 20 }) {
  const g = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color: 0x8a6a3a, roughness: 0.72, metalness: 0.35 });
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.6, 3.2), P.common.dark);
  base.position.y = 0.3; base.castShadow = true; g.add(base);
  const mast = new THREE.Mesh(new THREE.BoxGeometry(1.1, h, 1.1), mat);
  mast.position.y = h / 2 + 0.6; mast.castShadow = true; g.add(mast);
  const jibArm = new THREE.Mesh(new THREE.BoxGeometry(jib, 0.42, 0.5), mat);
  jibArm.position.set(jib / 2 - 2, h + 0.9, 0);
  jibArm.castShadow = true; g.add(jibArm);
  const counter = new THREE.Mesh(new THREE.BoxGeometry(jib * 0.3, 0.7, 0.9), P.common.dark);
  counter.position.set(-jib * 0.18 - 2, h + 0.9, 0);
  g.add(counter);
  const cab = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.2, 1.4), P.common.metalLight);
  cab.position.set(1.4, h + 0.2, 0.5);
  g.add(cab);
  const hook = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5, 6), P.common.metal);
  hook.position.set(jib * 0.4, h - 1.6, 0);
  g.add(hook);
  g.userData.footprint = { w: 3.4, d: 3.4, h };
  return g;
}

/** 轿车 / 货车 */
export function car({ color = 0x3a4148, kind = 'sedan' } = {}) {
  const g = new THREE.Group();
  const bodyMat = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.42 });
  if (kind === 'truck') {
    const cab = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.0, 2.4), bodyMat);
    cab.position.set(0, 1.5, 2.6); cab.castShadow = true; g.add(cab);
    const box = new THREE.Mesh(new THREE.BoxGeometry(2.5, 2.6, 5.4),
      surf(metalPanelTex({ base: '#7a7f78', ribMM: 110 }), { roughness: 0.82 }));
    box.position.set(0, 1.9, -1.6); box.castShadow = true; g.add(box);
    const wheelGeo = new THREE.CylinderGeometry(0.62, 0.62, 0.4, 12);
    for (const x of [-1.2, 1.2]) for (const z of [3.0, -1.0, -3.4]) {
      const w = new THREE.Mesh(wheelGeo, P.common.rubber);
      w.rotation.z = Math.PI / 2; w.position.set(x, 0.62, z); g.add(w);
    }
    g.userData.footprint = { w: 2.6, d: 8.8, h: 3.2 };
  } else {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.86, 0.7, 4.4), bodyMat);
    body.position.y = 0.72; body.castShadow = true; g.add(body);
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.62, 2.2), P.common.glassPane);
    cabin.position.set(0, 1.32, -0.15); cabin.castShadow = true; g.add(cabin);
    const wheelGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.26, 12);
    for (const x of [-0.86, 0.86]) for (const z of [1.45, -1.45]) {
      const w = new THREE.Mesh(wheelGeo, P.common.rubber);
      w.rotation.z = Math.PI / 2; w.position.set(x, 0.34, z); g.add(w);
    }
    g.userData.footprint = { w: 2.0, d: 4.6, h: 1.7 };
  }
  return g;
}

/** 三轮车 / 电动车 / 自行车 */
export function twoWheeler({ kind = 'scooter', color = 0x2f3a44 } = {}) {
  const g = new THREE.Group();
  const wheelGeo = new THREE.CylinderGeometry(kind === 'bike' ? 0.34 : 0.27, kind === 'bike' ? 0.34 : 0.27, kind === 'bike' ? 0.05 : 0.1, 14);
  if (kind === 'tricycle') {
    const bed = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.5, 2.0),
      surf(metalPanelTex({ base: '#6a5a4a' }), { roughness: 0.88 }));
    bed.position.set(0, 0.62, -0.9); bed.castShadow = true; g.add(bed);
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 0.9), new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.3 }));
    head.position.set(0, 0.75, 1.0); g.add(head);
    const w2 = new THREE.CylinderGeometry(0.28, 0.28, 0.1, 12);
    for (const x of [-0.7, 0.7]) {
      const w = new THREE.Mesh(w2, P.common.rubber); w.rotation.z = Math.PI / 2; w.position.set(x, 0.28, -1.3); g.add(w);
    }
    const wf = new THREE.Mesh(w2, P.common.rubber); wf.rotation.z = Math.PI / 2; wf.position.set(0, 0.28, 1.35); g.add(wf);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.06, 0.06), P.common.metal); bar.position.set(0, 1.2, 1.1); g.add(bar);
    g.userData.footprint = { w: 1.5, d: 3.0, h: 1.3 };
  } else if (kind === 'bike') {
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.5, 1.1), new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.4 }));
    frame.position.set(0, 0.66, 0); frame.rotation.x = 0.1; g.add(frame);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.05, 0.05), P.common.metal);
    bar.position.set(0, 1.02, 0.52); g.add(bar);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.09, 0.36), P.common.dark);
    seat.position.set(0, 0.94, -0.34); g.add(seat);
    for (const z of [0.56, -0.56]) {
      const w = new THREE.Mesh(wheelGeo, P.common.rubber);
      w.rotation.z = Math.PI / 2; w.position.set(0, 0.34, z); g.add(w);
    }
    g.userData.footprint = { w: 0.6, d: 1.6, h: 1.1 };
  } else {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.36, 1.5),
      new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.35 }));
    body.position.y = 0.62; body.castShadow = true; g.add(body);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.16, 0.7), P.common.dark);
    seat.position.set(0, 0.86, -0.16); g.add(seat);
    for (const z of [0.62, -0.62]) {
      const w = new THREE.Mesh(wheelGeo, P.common.rubber);
      w.rotation.z = Math.PI / 2; w.position.set(0, 0.27, z); g.add(w);
    }
    const bar = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.06, 0.06), P.common.metal);
    bar.position.set(0, 1.06, 0.58); g.add(bar);
    g.userData.footprint = { w: 0.7, d: 1.7, h: 1.2 };
  }
  return g;
}

/** 垃圾桶 / 大垃圾箱 */
export function bin({ color = 0x8a7a3a, large = false } = {}) {
  const g = new THREE.Group();
  if (large) {
    const b = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 1.0),
      new THREE.MeshStandardMaterial({ color: pick([0x3a5a4a, 0x4a5a6a, 0x5a5548]), roughness: 0.82, metalness: 0.2 }));
    b.position.y = 0.55; b.castShadow = true; g.add(b);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.66, 0.1, 1.06), P.common.dark);
    lid.position.y = 1.14; lid.rotation.x = -0.12; g.add(lid);
    const wheelGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.1, 10);
    for (const x of [-0.66, 0.66]) for (const z of [-0.4, 0.4]) {
      const w = new THREE.Mesh(wheelGeo, P.common.rubber);
      w.rotation.z = Math.PI / 2; w.position.set(x, 0.16, z); g.add(w);
    }
    g.userData.footprint = { w: 1.7, d: 1.1, h: 1.2 };
  } else {
    const b = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.3, 0.92, 12),
      new THREE.MeshStandardMaterial({ color, roughness: 0.75 }));
    b.position.y = 0.46; b.castShadow = true; g.add(b);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.08, 12), P.common.dark);
    lid.position.y = 0.94; g.add(lid);
    g.userData.footprint = { w: 0.8, d: 0.8, h: 1.0 };
  }
  return g;
}

/** 长椅 */
export function bench() {
  const g = new THREE.Group();
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.09, 0.48), P.common.wood);
  seat.position.y = 0.46; seat.castShadow = true; g.add(seat);
  const back = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.4, 0.08), P.common.wood);
  back.position.set(0, 0.72, -0.2); g.add(back);
  for (const sx of [-0.7, 0.7]) {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.46, 0.44), P.common.metal);
    leg.position.set(sx, 0.23, 0); g.add(leg);
  }
  return g;
}

/** 公交站台 */
export function busShelter() {
  const g = new THREE.Group();
  const roof = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.14, 1.6), P.common.metalLight);
  roof.position.y = 2.6; roof.castShadow = true; g.add(roof);
  for (const sx of [-2.1, 2.1]) {
    const p = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 2.6, 8), P.common.metal);
    p.position.set(sx, 1.3, -0.6); g.add(p);
  }
  const backdrop = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 1.7), P.common.glassPane);
  backdrop.position.set(0, 1.7, -0.72); g.add(backdrop);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.09, 0.4), P.common.dark);
  seat.position.set(0, 0.55, -0.5); g.add(seat);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 1.0),
    labelMat('公交\n站', { bg: '#2f3f52', fg: '#d8dce0', w: 256, h: 380 }));
  sign.position.set(2.5, 2.0, 0);
  g.add(sign);
  return g;
}

/** 自动售货机 / 快递柜 */
export function vendingMachine({ kind = 'drink' } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.9, 0.7),
    new THREE.MeshStandardMaterial({ color: kind === 'drink' ? 0x7a3a34 : 0x3a5a6a, roughness: 0.7, metalness: 0.25 }));
  body.position.y = 0.95; body.castShadow = true; g.add(body);
  const face = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.4),
    labelMat(kind === 'drink' ? '饮料' : '快递柜', { bg: kind === 'drink' ? '#c8c4b8' : '#4a5a68', fg: kind === 'drink' ? '#3a3a36' : '#d8dce0', w: 256, h: 400 }));
  face.position.set(0, 1.05, 0.36); g.add(face);
  g.userData.footprint = { w: 1.2, d: 0.8, h: 1.9 };
  return g;
}

/** 报刊亭 / 岗亭 */
export function kiosk({ kind = 'news', text = '报刊亭' } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.5, 2.0),
    new THREE.MeshStandardMaterial({ color: kind === 'guard' ? 0x53606a : 0x4a5a4a, roughness: 0.85 }));
  body.position.y = 1.25; body.castShadow = true; body.receiveShadow = true; g.add(body);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.16, 2.4), P.common.metalLight);
  roof.position.y = 2.6; roof.castShadow = true; g.add(roof);
  const win = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1.0), P.common.glassPane);
  win.position.set(0, 1.5, 1.02); g.add(win);
  const sign = new THREE.Mesh(new THREE.PlaneGeometry(1.9, 0.5),
    labelMat(text, { bg: kind === 'guard' ? '#3a4a58' : '#5a4a3a', fg: '#e8e4d8', w: 512, h: 128 }));
  sign.position.set(0, 2.3, 1.05); g.add(sign);
  g.userData.footprint = { w: 2.4, d: 2.2, h: 2.7 };
  return g;
}

/** 喷泉 / 水池 */
export function fountain({ r = 2.4 } = {}) {
  const g = new THREE.Group();
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(r, r * 1.05, 0.6, 24), P.common.stone);
  basin.position.y = 0.3; basin.receiveShadow = true; g.add(basin);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.92, r * 0.92, 0.1, 24),
    new THREE.MeshStandardMaterial({ color: 0x2a3a42, roughness: 0.14, metalness: 0.5 }));
  water.position.y = 0.58; g.add(water);
  const jet = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.3, 1.2, 12),
    new THREE.MeshStandardMaterial({ color: 0x5a6a72, roughness: 0.3, metalness: 0.4, transparent: true, opacity: 0.6 }));
  jet.position.y = 1.2; g.add(jet);
  g.userData.footprint = { w: r * 2.2, d: r * 2.2, h: 0.7 };
  return g;
}

/** 旗杆 */
export function flagPole({ h = 9, color = 0x8a2a22 } = {}) {
  const g = new THREE.Group();
  const p = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, h, 8), P.common.metalLight);
  p.position.y = h / 2; g.add(p);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 1.2),
    new THREE.MeshStandardMaterial({ color, roughness: 0.9, side: THREE.DoubleSide }));
  flag.position.set(0.9, h - 0.85, 0); g.add(flag);
  return g;
}

/** 排队护栏（蛇形栏杆） */
export function queueRail({ len = 6, rows = 3, gap = 1.1 } = {}) {
  const g = new THREE.Group();
  for (let i = 0; i < rows; i++) {
    const r = new THREE.Mesh(new THREE.BoxGeometry(len, 0.06, 0.06), P.common.metalLight);
    r.position.set(0, 0.9, -i * gap);
    g.add(r);
    const r2 = r.clone(); r2.position.y = 0.55; g.add(r2);
    for (let k = 0; k <= 4; k++) {
      const p = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.95, 6), P.common.metalLight);
      p.position.set(-len / 2 + (k * len) / 4, 0.48, -i * gap);
      g.add(p);
    }
  }
  return g;
}

/** 交互点：地面光圈 + 悬浮图标（角色走近后可交互） */
export function hotspot({ icon = '❓', label = '', color = 0xd8b45a, y = 0 }) {
  const g = new THREE.Group();
  const c = document.createElement('canvas');
  c.width = 256; c.height = 256;
  const ctx = c.getContext('2d');
  // 外圈
  ctx.strokeStyle = 'rgba(232,214,150,0.95)';
  ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(128, 128, 104, 0, Math.PI * 2); ctx.stroke();
  // 内渐隐
  const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 100);
  grad.addColorStop(0, 'rgba(232,214,150,0.42)');
  grad.addColorStop(1, 'rgba(232,214,150,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.arc(128, 128, 100, 0, Math.PI * 2); ctx.fill();

  const ring = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 2.4),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false })
  );
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = 0.06 + y;
  g.add(ring);

  // 悬浮图标牌
  const lc = document.createElement('canvas');
  lc.width = 256; lc.height = 128;
  const lx = lc.getContext('2d');
  lx.fillStyle = 'rgba(24,28,30,0.82)';
  lx.beginPath();
  lx.roundRect(6, 6, 244, 116, 16);
  lx.fill();
  lx.fillStyle = '#f0e8d0';
  lx.font = '700 76px "Microsoft YaHei","PingFang SC",sans-serif';
  lx.textAlign = 'center'; lx.textBaseline = 'middle';
  lx.fillText(icon || '?', 128, 66);
  const sprite = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 0.75),
    new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc), transparent: true, depthWrite: false })
  );
  sprite.position.y = 2.15;
  g.add(sprite);

  g.userData.hotspot = { icon, label, color, sprite, ring };
  void color;
  return g;
}

/* ══ 场地 ═══════════════════════════════════════════════════════════════ */

/** 地面：整块场地底板 */
export function groundPlane({ size = 140, tier = 2, mat = null }) {
  const m = mat || tierOf(tier).ground;
  const p = new THREE.Mesh(new THREE.PlaneGeometry(size, size), m);
  p.rotation.x = -Math.PI / 2;
  p.receiveShadow = true;
  return p;
}

/** 路面：铺一条沥青路（沿 z 轴）。mat 可换成水泥/铺装等 */
export function road({ len = 140, w = 12, x = 0, z = 0, mat = null }) {
  const base = mat || P.common.asphalt;
  /* ★ [P3-1] 原来写死 3.4m/格 —— 而沥青纹理按 GROUND_TILE_M(4.5) 画骨料，
     3.4 会让骨料偏粗。这里统一走 fitRepeat，tile 取纹理自带的尺度。 */
  const tileM = (base.map && base.map.userData && base.map.userData.surface)
    ? base.map.userData.surface.metersPerRepeat : TILE_M;
  const m = fitRepeat(base, w, len, tileM);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, len), m);
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, 0.012, z);
  p.receiveShadow = true;
  return p;
}

/** 人行道（一侧铺装带） */
export function sidewalk({ len = 140, w = 3.4, x = 0, z = 0 }) {
  /* ★ [P3-1] 原来是 1.8m/格 —— 一张铺装纹理里画的是 **4 行 300mm 方砖**，
     1.8m 一格 → 实际显示出来一块方砖只有 112mm，是真人行道砖的 1/2.7。
     这就是"地面像贴纸"的直接来源。改用纹理自带的 GROUND_TILE_M。 */
  const tileM = (P.common.paver.map && P.common.paver.map.userData
    && P.common.paver.map.userData.surface)
    ? P.common.paver.map.userData.surface.metersPerRepeat : TILE_M;
  const m = fitRepeat(P.common.paver, w, len, tileM);
  const p = new THREE.Mesh(new THREE.PlaneGeometry(w, len), m);
  p.rotation.x = -Math.PI / 2;
  p.position.set(x, 0.02, z);
  p.receiveShadow = true;
  return p;
}

/** 路缘石 */
export function curb({ len = 140, x = 0, z = 0, h = 0.16 }) {
  const p = new THREE.Mesh(new THREE.BoxGeometry(0.22, h, len), P.common.trim || P.common.metalLight);
  p.position.set(x, h / 2, z);
  p.receiveShadow = true;
  return p;
}

/** 斑马线 */
export function crosswalk({ len = 12, x = 0, z = 0, stripes = 7 }) {
  const g = new THREE.Group();
  for (let i = 0; i < stripes; i++) {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(len, 0.52),
      new THREE.MeshStandardMaterial({ color: 0xb8b6ac, roughness: 0.94 }));
    s.rotation.x = -Math.PI / 2;
    s.position.set(x, 0.028, z - ((stripes - 1) * 1.0) / 2 + i * 1.0);
    s.receiveShadow = true;
    g.add(s);
  }
  return g;
}
