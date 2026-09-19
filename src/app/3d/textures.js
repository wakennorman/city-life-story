/**
 * 外部 PBR 贴图集加载器（Poly Haven，CC0 1.0 · 可商用 · 无需署名）
 *
 * ── 为什么要有这个模块 ──────────────────────────────────────────────────────
 *   materials.js 是**程序化**贴图：它在运行时用 Canvas 画砖缝、裂缝、脏污。
 *   这条路的好处是零资产、可参数化；天花板也很明确 ——
 *   它画出来的"脏"是**我们想象的脏**（一堆高斯噪声 + 低对比斑块），
 *   而真实照片扫描贴图的"脏"是**真的脏**：骨料粒径分布、水泥泛碱的白华、
 *   砖面被雨水冲出的沟槽、几十年踩踏磨出的抛光带。
 *   这是程序化画不出来的，也是《大多数》地面质感的真正来源。
 *
 *   所以两者**并存**：真实贴图优先，程序化作兜底。
 *
 * ── 三条硬约束（都来自项目现状，不是随意选的）────────────────────────────
 *
 *   ① **必须能软降级**。部署形态是 dist/index.html + app.js 的离线分发，
 *      CSP 是 default-src 'self'。离线直开 file://、或 assets/ 没拷全时，
 *      贴图一定加载失败。**失败绝不能白屏**，只能静默退回程序化贴图。
 *      所以本模块对外只暴露同步的 bindTexture()，永不抛。
 *
 *   ② **热替换**。palette.js 的 buildPalette() 是**同步**的，而贴图是异步的。
 *      所以材质先按程序化建好，bindTexture() 把材质登记下来；
 *      贴图到位后再逐个换上，并置 needsUpdate 触发重编译。
 *      这样进场景**不会被贴图加载阻塞**（首屏不等网络）。
 *
 *   ③ **repeat 必须由贴图的真实米数反推**。Poly Haven 的 info 接口给了
 *      `dimensions`（毫米），gen-texture-manifest.cjs 把它写进清单的 `meters`。
 *      真实贴图是按真实尺寸扫描的 —— 贴到墙上时"一格覆盖多少米"就必须
 *      等于它的真实米数，否则砖在屏上的大小是错的。
 *      ★ 这一条是本项目反复强调的纪律（见 materials.js 文件头 P3-1）：
 *        人眼正是靠"砖有多大、缝有多宽"判断尺度的，尺寸不对，大脑读不出那是砖。
 *
 * ── arm 贴图的通道语义（★ 接错会得到一张"绿紫色的墙"）─────────────────────
 *   Poly Haven 的 `arm.jpg` 把三个通道打包在一张图里：
 *       R = AO      G = Roughness      B = Metalness
 *   three.js 的 roughnessMap 读**绿**通道 —— 源码 ShaderChunk/roughnessmap_fragment
 *   的注释原文就是：
 *     "reads channel G, compatible with a combined OcclusionRoughnessMetallic
 *      (RGB) texture"
 *   所以 arm 可以直接喂 roughnessMap，不需要拆通道。
 *   本模块**只**把它接到 roughnessMap；**不接 metalnessMap** ——
 *   项目有明确纪律（3D_ART_SPEC §6.2 / P0-2）：非金属的 metalness 必须归 0，
 *   半金属是最糟的取值。接了 metalnessMap 就等于把 metalness 交给贴图，
 *   而项目里那些"看起来像金属"的东西（灯杆/栏杆）本来就该是 0。
 *
 * ── 用法 ────────────────────────────────────────────────────────────────────
 *   import { bindTexture, warmTextures, textureStats } from './textures.js';
 *
 *   const mat = new THREE.MeshStandardMaterial({ map: 程序化贴图 });
 *   bindTexture(mat, 'wall-tile');   // 真实贴图到位后自动换上（异步，不阻塞首屏）
 *
 *   资产根路径跟随 assets.js 的 setAssetBase() —— 不另开一套，
 *   否则 dist 用 assets/、dev 预览用 src/assets/ 的分叉会漏掉贴图这一支。
 */

import * as THREE from 'three';
/* ★ 清单是 .js 模块而不是 .json —— 见 gen-texture-manifest.cjs 顶部注释：
   浏览器原生 ESM 不能导入裸 JSON，而 dev/_3dtest/textures.html 是直接
   以原生 ES 模块导入 materials.js 的，链式拉进 .json 会让**整个页面**加载失败。 */
import manifest from './polyhaven-textures.js';
/* ★ 从叶子模块拿资产根，**不要**从 assets.js 拿 —— assets.js 还拖着 GLTFLoader
   与三个 JSON 清单，而浏览器原生 ESM 不能导入裸 JSON：
   dev/_3dtest/textures.html 是直接以原生 ES 模块导入源码的，链式拉进来
   会让整个模块图加载失败（症状是门禁超时，像"贴图生成挂了"）。
   见 asset-base.js 顶注。 */
import { assetBase } from './asset-base.js';

/** 清单（由 scripts/gen-texture-manifest.cjs 生成，含真实米数 meters） */
export const TEX_ITEMS = manifest.items;
export const TEX_IDS = Object.keys(manifest.items);
export const TEX_LICENSE = {
  source: manifest.source,
  license: manifest.license,
  licenseUrl: manifest.licenseUrl,
  commercialUse: manifest.commercialUse,
  attributionRequired: manifest.attributionRequired,
};

/** 加载状态：pending（未开始）/ loading / ok / fail */
const _state = Object.create(null);
/** 已加载的**原始**贴图。★ 存的是 THREE.Texture（槽位名 → Texture），
 *  不是 Texture.image —— 因为 Texture 上还带着 colorSpace / wrap / anisotropy /
 *  filter 这些"该按哪套规则上传"的信息，applyTo 要照抄过去。
 *  （踩过：第一版直接把 Texture 对象赋给 t.image，three 拿它去调 texSubImage2D，
 *   浏览器报 "Overload resolution failed" —— 类型不对，且只有控制台能看见。） */
const _raw = Object.create(null);
/** 登记表：as → Set<{ mat }> */
const _bind = new Map();
/** 失败原因（验证脚本读） */
const _errors = [];
/** 槽位缺失记录：清单里有、但目标材质没有这个槽位 → 真实贴图挂不上去。
 *  ★ 这是**静默失效**的典型形态（不报错、画面照常），必须留读数。 */
const _slotMiss = [];
/** 尺寸变迁记录：换图时像素尺寸变了没有。★ 变了就有重分配风险 ——
 *  three 的 texStorage2D 只在首帧分配，之后走 texSubImage2D（尺寸必须一致）。
 *  记下来是为了**把"有没有风险"变成可读的数**，而不是靠肉眼盯着画面猜。 */
const _sizeChg = [];

const _loader = new THREE.TextureLoader();
/** 已经开始加载的 id（防重复；★ 与 `_state` 不同：pending 是"还没开始"） */
const _started = new Set();
let _reported = false;
let _enabled = true;

/* ══ 总开关 ══════════════════════════════════════════════════════════════════
   ★ 为什么需要它：真实贴图与程序化贴图是**两条可比的路线**，
     而"哪条更好"必须能 A/B 才能回答。有开关，取证脚本就能在同一台机器、
     同一个相机、同一帧光照下各出一张图 —— 否则两次跑的环境差异会把
     贴图差异淹没（这个项目已经吃过"改了参数但没对照"的亏）。

   ★ 关掉必须**真的退回去**，不能只是"以后不再绑"。
     第一版就是后者 —— 已经换上的 43 个材质一个都不动，A/B 拍出来两张图一模一样，
     而"两张图一样"会被误读成"真实贴图没效果"。所以 bindTexture() 在改之前
     先把每个槽位的原始状态（image / colorSpace / wrap / anisotropy / filter）
     存进登记记录，关开关时逐槽位还原（restoreTo）。

   ★ 尺度不在还原范围内，**也不需要**：repeat 是建世界时（world.js::tileMat）
     按 metersPerRepeat 算好写进克隆体的，之后再改这个字段不会重算。
     所以无论开关怎么拨，场景里的砖都是真实米数尺度 —— 两张图的唯一变量
     就是**贴图内容**。这正是 A/B 想要的效果。
   ══════════════════════════════════════════════════════════════════════════ */
export function setTextureEnabled(on) {
  _enabled = !!on;
  for (const [as] of _bind) {
    if (_enabled) { if (_state[as] === 'ok') swapGroup(as, true); }
    else swapGroup(as, false);
  }
}
export function textureEnabled() { return _enabled; }

/** 贴图集是否已落定。
 *  ★ 判据是「**已开始加载**的都落定了」而不是「清单里 15 项都 ok」——
 *    因为按需加载（bindTexture 触发）本来就不会加载没被任何材质用到的贴图，
 *    用后者会永远返回 false，验证脚本就会一直卡在"还没好"。 */
export function textureSettled() {
  return TEX_IDS.every((id) => !_started.has(id) || _state[id] === 'ok' || _state[id] === 'fail');
}

/** 某张贴图是否可用 */
export function texReady(as) { return _state[as] === 'ok'; }

/** 贴图的真实米数（= 一格覆盖多少米）。未接入时返回 null。 */
export function texMeters(as) {
  const it = manifest.items[as];
  return it && typeof it.meters === 'number' ? it.meters : null;
}

/* ── 加载 ─────────────────────────────────────────────────────────────── */

function loadOne(as) {
  if (_state[as] === 'ok' || _state[as] === 'loading') return Promise.resolve(_state[as]);
  const item = manifest.items[as];
  if (!item) { _state[as] = 'fail'; return Promise.resolve('fail'); }
  _state[as] = 'loading';

  const prefix = assetBase() + manifest.base.replace(/^assets\//, '') + '';
  const slots = Object.entries(item.files);   // [['map', rel], ['normalMap', rel], ...]

  return Promise.all(slots.map(([slot, rel]) => new Promise((resolve, reject) => {
    _loader.load(prefix + rel, (t) => {
      /* ★ colorSpace 必须分槽位设，这是最容易静默出错的一处：
           · 颜色贴图 → SRGBColorSpace（要解码到线性）
           · 法线 / 粗糙度 → NoColorSpace（本来就是线性数据）
         把法线设成 sRGB 会把方向做一次伽马解码，法线被扭曲 ——
         不报错、不崩溃，只是光照"看起来怪怪的"，极难定位。
         （materials.js 文件头对这条已有记录，这里是同一纪律的第二处。） */
      t.colorSpace = slot === 'map' ? THREE.SRGBColorSpace : THREE.NoColorSpace;
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.anisotropy = 8;
      t.userData.polyhaven = { as, slot, meters: item.meters };
      resolve([slot, t]);
    }, undefined, (e) => reject(new Error(`${as}/${slot}: ${e && e.message ? e.message : 'load failed'}`)));
  }))).then((pairs) => {
    _raw[as] = Object.fromEntries(pairs);
    _state[as] = 'ok';
    /* 把已登记、还在等这张图的材质补上。
       ★ 走 swapGroup（先整组 dispose 再整组换图），不能逐个 applyTo ——
         逐个换的话第一个换完，其余共享 Source 的克隆体 changed 判据就失效了，
         整组会一起停在程序化内容上（见 applyTo 上方长注）。 */
    swapGroup(as, true);
    return 'ok';
  }).catch((e) => {
    /* ★ 失败是**预期路径**，不是异常：离线分发时资产可能根本没拷。
       这里只记一笔，材质留在程序化贴图上，绝不向上抛。

       ★ 同时**还原** bindTexture() 改写的 metersPerRepeat ——
         那个值现在声明的是"真实贴图的米数"，但贴图没来，内容还是程序化的。
         不还原的话，程序化贴图会按真实贴图的尺寸铺，砖的大小是错的
         （而且错得很隐蔽：画面看着正常，只是砖大了三成）。 */
    _state[as] = 'fail';
    _errors.push(e.message);
    const set = _bind.get(as);
    if (set) {
      for (const rec of set) {
        const s = rec.mat.map && rec.mat.map.userData && rec.mat.map.userData.surface;
        if (s && s._procMetersPerRepeat !== undefined) s.metersPerRepeat = s._procMetersPerRepeat;
      }
    }
    return 'fail';
  });
}

/**
 * 预热。**幂等且增量**：可以反复调用，每次只补上还没开始的那些。
 *
 * ★ 为什么必须是增量的（第一版写错过）：
 *   第一版用 `if (!_warm) { _warm = Promise.all(list.map(loadOne)) }` ——
 *   而 bindTexture() 是**逐张**触发的（palette 建到哪个材质就绑哪张）。
 *   于是第一次调用把 _warm 锁死成"只加载那一张"，后续 14 张**永远不会开始**。
 *   实测证据：控制台打出「Poly Haven 贴图集：1/1 就绪」，而清单有 15 项 ——
 *   画面看起来"有些地方换上了真实贴图"，最容易当成"就是这样的"。
 *
 * @param {string[]} [list] 只预热这些 id；不传则预热清单里全部
 */
export function warmTextures(list) {
  if (!_enabled) return Promise.resolve([]);
  const ids = (list && list.length ? list : TEX_IDS).filter((id) => manifest.items[id]);
  const todo = ids.filter((id) => !_started.has(id));
  todo.forEach((id) => _started.add(id));
  if (!todo.length) return Promise.resolve([]);
  return Promise.all(todo.map(loadOne)).then((rs) => {
    if (textureSettled() && !_reported) {
      _reported = true;
      // eslint-disable-next-line no-console
      console.info(`[textures] Poly Haven 贴图集：${TEX_IDS.length - _errors.length}/${TEX_IDS.length} 就绪`
        + (_errors.length ? ` · ${_errors.length} 失败（已退回程序化贴图）` : ''));
    }
    return rs;
  });
}

/* ── 应用：**在 Source 层面换图**，而不是替换 material.map ───────────────
   ★ 为什么不能用"替换 mat.map"（第一版就是这样，实测**完全不生效**）：
     palette.js 建出来的是**原型材质**，真正渲染的是克隆体 ——
     world.js::tileMat() 会 `base.map.clone()` 给 190m 地面克隆一份，
     kit.js::fitRepeat() 给每一面墙克隆一份。克隆体**共享同一个 Source**，
     但各自的 repeat 不同。
     而克隆发生在**贴图加载之前**（资产是首帧之后才预热的，见 bridge.js:1271）。
     所以"把原型的 mat.map 换掉"只改到原型本身，场景里那些克隆体一个都不动 ——
     正是本项目最典型的"改了但没效果"。

   正确做法：只换 `texture.image`（等价于 `texture.source.data`）。
   所有克隆共享 Source，所以换一次图 **全部克隆同时生效**，
   而各自的 repeat 原封不动，GPU 上也仍然只有一份纹理。
   （three 源码：Texture 的 image setter 就是 `this.source.data = value`，
     needsUpdate setter 会 `version++` 且 `source.needsUpdate = true`。）

   ★ 为什么这里**不需要**再管 repeat：
     重复密度在**绑定时**就定好了 —— bindTexture() 会把贴图的真实米数
     写进程序化贴图的 userData.surface.metersPerRepeat，而 world.js::tileMat()
     本来就优先读这个字段（`tile || declared || 4.5`）。
     → "贴图没到"和"贴图到了"两种状态下，铺出来的**尺度是同一个值**，不会跳。
       这是刻意的：否则加载完成的一瞬间整条街的砖会突然变大或变小。

   ★ 为什么必须 `dispose()`，而且必须**先整组 dispose、再整组换图**（第三处坑，也是最深的）
     three r186 的 WebGLTextures.js::uploadTexture 只在**首次上传**时调
     `texStorage2D` 分配显存（`allocateMemory = (sourceProperties.__version === undefined)`，
     见源码 947~948 行），之后一律走 `texSubImage2D` 往已有分配里塞数据。
     而 texStorage2D 分配的是**不可变尺寸**的存储 —— 图片从 512 换成 1024 时，
     那条 texSubImage2D 会因尺寸不匹配失败，只留一条 GL_INVALID_VALUE
     （`glTexSubImage2DRobustANGLE: Offset overflows texture dimensions`），
     然后贴图**静静停在旧内容上**：JS 侧 map.image 是 <img>、swapped>0、无异常。

     要触发重新分配，必须让 three 把 `_sources` 里那条记录整个删掉，
     而那要求**同一个 Source 的所有贴图都 dispose 完**（usedTimes 归零）。

     ★★ 这里就是最难发现的一步：不能写成"image 变了才 dispose"。
       因为克隆体**共享 Source** —— `Texture.image` 的 setter 实现就是
        `this.source.data = value`（three 源码 Texture.js:420）。
        于是第一个 rec 换完图之后，其余 rec 的 `.image` getter **立刻读到新图**，
        `changed` 判据变成 false，它们就永远不被 dispose，
        usedTimes 停在 N-1 —— 重分配不发生，整组贴图一起停在旧内容上。
        实测症状极具迷惑性：**只有共享者 ≥2 的组会坏，且只坏 colorSpace 不变的那个槽位**
        （normalMap 从 sRGB 改成线性会顺带换掉 cacheKey，从而意外触发重分配；
         map 前后都是 sRGB，cacheKey 不变，就一定坏）。
        本项目踩到的是 wall-plaster / wall-concrete（8 个共享者 + concreteTex 是 512²，
        而 EXT 类墙贴图本来就是 1024²，同尺寸所以侥幸没事）。

     所以顺序是死的：**先 dispose 整组 → 再换图整组**。 */
function applyTo(mat, as) {
  const raw = _raw[as];
  if (!raw) return;
  for (const [slot, src] of Object.entries(raw)) {
    const t = mat[slot];
    /* ★ 槽位缺失要**记一笔**而不是默默跳过：真实贴图挂不上、画面照常，
       这正是本项目反复吃亏的那种静默失效。读数在 textureStats().slotMiss。 */
    if (!t) {
      const key = as + '/' + slot;
      if (!_slotMiss.includes(key)) _slotMiss.push(key);
      continue;
    }
    const img = src.image;   // ← 真正的图片（HTMLImageElement），不是 Texture 对象
    if (!img) continue;
    const changed = t.image !== img;

    /* 尺寸变迁读数（见 _sizeChg 注释）。 */
    if (changed) {
      const ow = (t.image && t.image.width) || 0;
      const oh = (t.image && t.image.height) || 0;
      if (ow !== img.width || oh !== img.height) {
        const key = `${as}/${slot} ${ow}x${oh}→${img.width}x${img.height}`;
        if (!_sizeChg.includes(key)) _sizeChg.push(key);
      }
    }

    /* 照抄"该按哪套规则上传"的元信息。★ colorSpace 分槽位：
       颜色图 sRGB、法线/粗糙度线性。把法线设成 sRGB 会做一次伽马解码、
       方向被扭曲 —— 不报错，只是光照"看起来怪怪的"，极难定位。 */
    t.colorSpace = src.colorSpace;
    t.wrapS = src.wrapS;
    t.wrapT = src.wrapT;
    t.anisotropy = src.anisotropy;
    t.minFilter = src.minFilter;
    t.magFilter = src.magFilter;
    t.generateMipmaps = src.generateMipmaps;
    t.image = img;            // ← 真正的换图，所有克隆共享此 Source
    t.needsUpdate = true;
  }
}

/** 整组 dispose —— **必须在换图之前**调用（原因见 applyTo 上方长注）。 */
function disposeGroup(as) {
  const set = _bind.get(as);
  const item = manifest.items[as];
  if (!set || !item) return;
  for (const rec of set) {
    for (const slot of Object.keys(item.files)) {
      const t = rec.mat[slot];
      /* 未上过 GPU 的贴图 dispose 是空操作（three 里 __webglInit 未定义就 early return），
         所以这里不需要判断"有没有渲染过"。 */
      if (t) t.dispose();
    }
  }
}

/** 把一组材质整体切到真实贴图 / 整体退回程序化。顺序不可交换。 */
function swapGroup(as, useReal) {
  const set = _bind.get(as);
  if (!set) return;
  disposeGroup(as);
  for (const rec of set) (useReal ? applyTo(rec.mat, as) : restoreTo(rec));
}

/** 记下槽位的**原始状态**（换图之前）。A/B 开关关掉时靠它还原。 */
function captureOrig(mat, rec) {
  const item = manifest.items[rec.as];
  if (!item || rec.orig) return;
  const o = {};
  for (const slot of Object.keys(item.files)) {
    const t = mat[slot];
    if (!t) continue;
    o[slot] = {
      image: t.image,
      colorSpace: t.colorSpace,
      wrapS: t.wrapS, wrapT: t.wrapT,
      anisotropy: t.anisotropy,
      minFilter: t.minFilter, magFilter: t.magFilter,
      generateMipmaps: t.generateMipmaps,
    };
  }
  rec.orig = o;
  rec.origRoughness = mat.roughness;
  const s = mat.map && mat.map.userData && mat.map.userData.surface;
  rec.origMeters = s ? s.metersPerRepeat : undefined;
}

/** 还原成程序化状态（A/B 的"关"那一侧）。★ 调用前必须已 disposeGroup（见 swapGroup）。 */
function restoreTo(rec) {
  const o = rec.orig;
  if (!o) return;
  for (const [slot, s] of Object.entries(o)) {
    const t = rec.mat[slot];
    if (!t) continue;
    t.colorSpace = s.colorSpace;
    t.wrapS = s.wrapS; t.wrapT = s.wrapT;
    t.anisotropy = s.anisotropy;
    t.minFilter = s.minFilter; t.magFilter = s.magFilter;
    t.generateMipmaps = s.generateMipmaps;
    t.image = s.image;
    t.needsUpdate = true;
  }
  /* ★ 粗糙度槽位必须**成对**还原。绑定时如果材质本来没有 roughnessMap，
     是我们塞了一张纯灰占位图（灰度 = 当时的 roughness）并把 roughness 顶成 1。
     只把 roughness 还原、却把占位图留在槽位上，乘积就成了 roughness²
     —— 画面明显更粗糙，而且不报错、不崩，属于最难查的那类。
     判据用占位图自己的标记，不靠猜（makeGreyTexture 里打的 polyhavenPlaceholder）。 */
  const rm = rec.mat.roughnessMap;
  if (rm && rm.userData && rm.userData.polyhavenPlaceholder === rec.as) {
    rec.mat.roughnessMap = null;
    rec.mat.needsUpdate = true;   // 槽位从有到无 → 着色器要重编译
  }
  if (typeof rec.origRoughness === 'number') rec.mat.roughness = rec.origRoughness;
  /* 尺度：见总开关上方的注释 —— 改这里不会重算已建好克隆体的 repeat，
     留一行是为了"如果将来有人把 repeat 改成渲染期计算"时语义仍然自洽。 */
  const s = rec.mat.map && rec.mat.map.userData && rec.mat.map.userData.surface;
  if (s && rec.origMeters !== undefined) s.metersPerRepeat = rec.origMeters;
}

/**
 * 把一张真实贴图绑定到材质上。**同步、永不抛。**
 *
 * @param {THREE.Material} mat 目标材质（可含程序化贴图，作为兜底）
 * @param {string} as 贴图 id（见 polyhaven-textures.json 的 items 键）
 * @returns {boolean} 是否**此刻**就已经换上了真实贴图
 */
export function bindTexture(mat, as) {
  if (!_enabled || !mat || !manifest.items[as]) return false;
  const meters = manifest.items[as].meters;

  /* ⓪ 先记下原始状态（A/B 还原用）。★ 必须在任何改动之前 ——
        第一版把它放在后面，结果"原值"记的是已经被我们改过的值，
        关开关时还原出来还是真实贴图，A/B 两边一样。 */
  const rec = { mat, as, orig: null, origRoughness: undefined, origMeters: undefined };
  captureOrig(mat, rec);

  /* ① 把**真实米数**写进程序化贴图的声明。
        world.js::tileMat() 读 `base.map.userData.surface.metersPerRepeat`
        来决定铺多密 —— 现在它读到的是真实尺寸，而不是程序化的 4.5m。
        这样地面在贴图到位前后是同一个尺度，不会加载完成时"砖突然变大"。
        （原值已在 captureOrig 里留了一份，还原时用。）
        ★ 注意这里有个**已知偏差**：world.js 是在建世界时读这个字段并写死
          repeat 的，所以离线失败时"还原 metersPerRepeat"其实改不动已建好的克隆体 ——
          程序化贴图会按真实米数铺（地面 3m 而非设计的 4.5m）。
          这是降级模式下的一点点尺度偏差，不影响正常路径，先记在这里不掩盖。 */
  if (mat.map && mat.map.userData && mat.map.userData.surface) {
    const s = mat.map.userData.surface;
    if (s._procMetersPerRepeat === undefined) s._procMetersPerRepeat = s.metersPerRepeat;
    s.metersPerRepeat = meters;
  }

  /* ② 粗糙度占位图。
        程序化那条路没有粗糙度贴图，而克隆必须成对（见 materials.js::fitRepeat
        的注释：漏一个槽位就会"颜色密度与粗糙度密度不一致"）。
        所以这里先塞一张**纯灰占位**，灰度 = 材质当前的 roughness ——
        于是加载前后**乘积完全相等**，画面不会闪。
        贴图到位后这张占位图会被 arm 换掉（同样走 Source 替换）。 */
  if (!mat.roughnessMap) {
    const ph = makeGreyTexture(mat.roughness);
    ph.userData.polyhavenPlaceholder = as;
    mat.roughnessMap = ph;
    mat.roughness = 1;   // 从此由贴图（绿通道）决定，占位图顶上原值
    mat.needsUpdate = true;   // 槽位从无到有 → 着色器要重编译
  }

  /* ③ 绑定信息写进 userData：fitRepeat() 靠它把 tile 尺度换成贴图真实米数。 */
  mat.userData = mat.userData || {};
  mat.userData.texBind = { as };

  let set = _bind.get(as);
  if (!set) { set = new Set(); _bind.set(as, set); }
  set.add(rec);

  if (_state[as] === 'ok') { applyTo(mat, as); return true; }
  /* 还没开始加载就顺手起一个（不 await）—— 调用方不需要记得预热。 */
  if (_state[as] === undefined) warmTextures([as]);
  return false;
}

/** 纯灰贴图（粗糙度占位）。每次新建独立 canvas —— 共用会让两张占位图
 *  在换图时互相污染（换了一张，另一张跟着变）。 */
function makeGreyTexture(v) {
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const g = Math.round(Math.min(1, Math.max(0, v || 0)) * 255);
  c.getContext('2d').fillStyle = `rgb(${g},${g},${g})`;
  c.getContext('2d').fillRect(0, 0, 1, 1);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.NoColorSpace;   // 粗糙度是线性数据
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/* ── 验证读数 ─────────────────────────────────────────────────────────── */

/** 给验证脚本的可观测读数。★ 项目历史教训：静默失效是常态，宁可多留读数。 */
export function textureStats() {
  const byState = { pending: 0, loading: 0, ok: 0, fail: 0 };
  for (const id of TEX_IDS) {
    /* pending = 尚未开始（按需加载下这是正常的，不是故障） */
    const s = _state[id];
    byState[s === undefined ? 'pending' : s]++;
  }
  const bound = {};
  let boundTotal = 0;
  for (const [as, set] of _bind) { bound[as] = set.size; boundTotal += set.size; }
  /* ★ swapped 实时算，不用累加计数器 —— 累加的会在 A/B 来回切时漂移
     （关掉开关后计数不清零，"链路是活的"这条断言就变成了假阳性）。 */
  let swapped = 0;
  for (const [, set] of _bind) {
    for (const rec of set) {
      if (!rec.orig) continue;
      for (const [slot, s] of Object.entries(rec.orig)) {
        const t = rec.mat[slot];
        if (t && t.image !== s.image) swapped++;
      }
    }
  }
  return {
    base: assetBase() + manifest.base.replace(/^assets\//, ''),
    enabled: _enabled,
    total: TEX_IDS.length,
    byState,
    ready: byState.ok,
    settled: textureSettled(),
    errors: _errors.slice(),
    /* ★ 已经**真的换过图**的槽位数。这条是"链路是活的"最硬的证据：
       "文件下下来了"(byState.ok) 和"贴图挂到材质上了"(swapped>0) 是两件事，
       而且后者不成立时前者照样是 15/15 —— 只有这个数会露馅。 */
    swapped: swapped,
    /* 清单里有、但目标材质缺该槽位 → 挂不上去。空数组才是正常。 */
    slotMiss: _slotMiss.slice(),
    /* 换图时像素尺寸变了的槽位（有重分配风险）。空数组才是正常。 */
    sizeChanges: _sizeChg.slice(),
    bound,
    boundTotal,
    /* 每张贴图的真实米数 —— 验证脚本靠它断言 repeat 是由真实尺寸反推的，
       而不是"加载成功了"（后者对"砖大了 3 倍"毫无察觉）。 */
    meters: Object.fromEntries(TEX_IDS.map((id) => [id, texMeters(id)])),
    slots: Object.fromEntries(TEX_IDS.map((id) => [id, Object.keys(manifest.items[id].files)])),
  };
}
