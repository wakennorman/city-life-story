/**
 * 外部 3D 资产加载器（Kenney City Kit / Poly Haven，均 CC0）
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
 * ── 两个来源的差异（★ 接入前必读，两处都踩过） ──────────────────────────
 *
 *   | | Kenney | Poly Haven |
 *   |---|---|---|
 *   | 文件 | `<kit>/<name>.glb`（单文件，贴图内嵌） | `<as>/<原名>.gltf` + `.bin` + `textures/*.jpg`（**分离**） |
 *   | 坐标系 | **1 单位 ≈ 8m** | **1 单位 = 1m**（Blender 实尺导出） |
 *   | 测法 | 反推（三个物件交叉验证） | 直接读：卷帘门 2.40m、消防栓 0.80m、电杆 10.0m |
 *
 *   ★ 分离式 glTF 的陷阱：主 .gltf 用**相对路径**引用 `xxx.bin` 与
 *     `textures/xxx.jpg`。所以：
 *       · 下载时必须连附属文件一起下、且**保持目录结构**（见 fetch-polyhaven.cjs）
 *       · 加载时 URL 指到 .gltf 即可，GLTFLoader 会自己解析相对路径
 *     如果只下了主文件（我第一次就是这样），浏览器会**静默不显示模型** ——
 *     不报错、不 404（因为网络请求根本没发出去到正确路径），最难查。
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
/* Poly Haven 清单：由 scripts/gen-polyhaven-manifest.cjs 生成，
   数据来自 src/assets/polyhaven/manifest.json（下载脚本写的，含 md5 与来源 URL）。 */
import polyhavenManifest from './polyhaven-manifest.json';
/* AI 生成资产清单：由 scripts/ai-asset-pipeline.cjs 在每次产出后重写。
   尺寸是**预处理烘焙后**的米制实测值 —— 用于验证脚本断言"高度 = 目标值"，
   而不是只断言"加载成功了"（后者对"尺寸错了 10 倍"毫无察觉）。 */
import aiManifest from './ai-manifest.json';

/** 资产根路径。相对 app.js（位于 dist/ 根），与 dist/assets/ 对应。
 *
 *  ★ 语义是"**资产根**"，各源在它下面分自己的子目录（见 SRC_PATH）：
 *      <ASSET_BASE>/kenney/<kit>/<name>.glb
 *      <ASSET_BASE>/polyhaven/models/<as>/<x>.gltf
 *
 *  ⚠️ 历史包袱：这个常量原来叫"Kenney 根"，值是 'assets/kenney/'。
 *     引入 Poly Haven 后若沿用旧值，拼出来会是
 *     `assets/kenney/polyhaven/models/...` —— 静默 404（降级到兜底几何）。
 *     所以改为 'assets/'，并同步改探针/验证脚本传入的 base。
 */
const ASSET_BASE_DEFAULT = 'assets/';

/* ★ 为什么要可覆盖：
   生产（dist/）里资产在 dist/assets/ —— 与 app.js 同级，故相对路径即可。
   但 dev 预览页是**从项目根**提供服务的（见 scripts/lib/serve.cjs），
   那时 'assets/' 会指向项目根下已有的 assets/（只放 icons），是 404。
   dev 侧的真实位置是 src/assets/。故允许注入 base。 */
let ASSET_BASE = ASSET_BASE_DEFAULT;

/** 覆盖资产根路径（供 dev 预览/验证脚本调用）。 */
export function setAssetBase(base) {
  if (typeof base === 'string' && base) ASSET_BASE = base.endsWith('/') ? base : base + '/';
}

/** 当前资产根路径（验证脚本读） */
export function assetBase() { return ASSET_BASE; }

/** 已知 kit 白名单 —— 防拼错路径，也让验证脚本能枚举。 */
export const KITS = ['commercial', 'industrial', 'roads'];

/* ══════════════════════════════════════════════════════════════════════════
   两个资产源：Kenney（城市套件）与 Poly Haven（城中村细节）
   ══════════════════════════════════════════════════════════════════════════

   为什么要抽象出"源"这一层：
     两家的**文件布局**和**单位**都不同，但调用方不该关心这些。
     调用方只说"给我一个卷帘门"，由这里决定去哪个目录、乘几倍。

   源标识（source）：
     'kenney'      → assets/kenney/<kit>/<name>.glb      缩放 ×8（1单位≈8m）
     'polyhaven'   → assets/polyhaven/models/<as>/<x>.gltf  缩放 ×1（米制）

   ★ Poly Haven 的缩放是 **1.0**，不是 8。
     实测（读 glTF 的 POSITION accessor min/max）：
       卷帘门 2.40m 高 · 消防栓 0.80m · 电杆 10.0m · 消防梯 6.47m
     全部落在真实尺寸区间 —— 说明它是**按米导出的**。
     若误用 Kenney 的 8，这些物件会变成 19m 高的大门、6.4m 的消防栓，
     整条街的尺度会被毁掉（而且不报错，只是"东西大得离谱"）。
   ────────────────────────────────────────────────────────────────────────── */

/** 源标识常量 */
export const SRC = { KENNEY: 'kenney', POLYHAVEN: 'polyhaven', AI: 'ai' };

/** 各源的根路径（相对 app.js / 项目根；由 setAssetBase 注入绝对前缀） */
const SRC_PATH = {
  [SRC.KENNEY]: 'kenney',
  [SRC.POLYHAVEN]: 'polyhaven/models',
  [SRC.AI]: 'ai',
};

/** 各源的默认缩放（模型单位 → 米） */
const SRC_SCALE = {
  [SRC.KENNEY]: 8,     // 见下方 M_PER_UNIT 的长注释
  [SRC.POLYHAVEN]: 1,  // 米制，不换算
  /* ★ AI 源也是 1 —— 但**不是因为它天生是米制**，而是因为我们在上游烘焙过了。
     （2026-09-19 新增。这是本项目"差 N 倍且不报错"坑的第三例，务必读完。）

     混元 3D 直出的模型**不是任何物理单位**：它把包围球归一化到 ≈1.22，
     跟真实尺寸无关。所以"高度 0.89"的既可能是三层骑楼、也可能是个茶杯。
     此时无论乘几都是错的 —— 这正是与 Kenney(×8)/Poly Haven(×1) 的本质差别：
     那两家的偏差是**常量**，混元的偏差是**每模型一个未知数**。

     解法是把不可知的换算消掉：预处理脚本 prep_glb.py 按"目标真实高度"
     把顶点缩放到米制并烘焙进 BIN（同时底部对齐 y=0、XZ 居中），
     于是到达这里的每个模型都已经是米制 —— 与 Poly Haven 行为一致。
     所以这里填 1，且**不需要** SIZE_OVERRIDE 条目。

     ⚠️ 这意味着：往 src/assets/ai/ 里扔**未经 prep_glb.py 处理**的原始 GLB，
     它会以"外接球 1.22 米"的大小出现在场景里 —— 极小、且不报错。
     上游流水线见 scripts/ai-asset-pipeline.cjs。 */
  [SRC.AI]: 1,
};

/** ★ 导出各源的期望缩放（2026-09-19 新增）。
    用途只有一个：让验证脚本能断言"**观测到的**缩放 == **这个源应有的**缩放"，
    而不是把 8 / 1 / 1 这张表在脚本里再抄一遍。
    抄表的代价是真实存在的 —— 第四、第五个源接进来时，
    改了这里忘了改脚本，断言就从"守卫"退化成"噪音"。
    探针读数 = 实测，本函数 = 期望，两者比对才有意义。 */
export function allSourceScales() { return { ...SRC_SCALE }; }

/** 各源的文件扩展名 */
const SRC_EXT = {
  [SRC.KENNEY]: '.glb',
  /* ★ Poly Haven 也走 .glb —— 但**不是**下载来的原始格式。
     原始是分离式 glTF（.gltf + .bin + textures/），有一个致命问题：
       `.bin` 的 MIME 是 application/octet-stream，
       **下载管理器（IDM/迅雷/FDM）会把它抢走** —— 浏览器把响应当成
       "要下载的文件"交给外部程序，页面拿到空的 204，请求根本不到服务器。
       GLTFLoader 于是报 `Failed to load buffer`，模型静默消失。
     实测（装了 IDM 的机器）：fetch 那个 .bin → {status:204, bytes:0}。
     这不是个别环境问题：任何装了下载管理器的玩家都会中招。

     解法：scripts/pack-polyhaven-glb.cjs 把分离式 glTF 合并成单文件 GLB
     （JSON + BIN + 贴图全内嵌）。MIME 变成 model/gltf-binary，
     不在下载管理器的接管名单里；顺带每模型从 7 个请求降到 1 个。
     校验见 scripts/verify-glb-pack.cjs（52 项：容器/尺寸/内嵌/无外链）。 */
  [SRC.POLYHAVEN]: '.glb',
  /* AI 源也走 .glb —— 预处理脚本输出的单文件 GLB（JSON+BIN+贴图全内嵌）。
     与 Poly Haven 同样的理由：.bin 的 MIME 是 application/octet-stream，
     会被 IDM/迅雷抢走；单文件 GLB 的 model/gltf-binary 不在接管名单里。 */
  [SRC.AI]: '.glb',
};

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

/** ★ 单个物件最终会被施加的缩放 —— **唯一真源**（2026-09-19 抽出）。
    在抽出来之前，这个公式只写在 instance() 里，于是验证脚本无法知道
    "某个物件本来该多大"，只能退而写死一个阈值（如 >1.5）去猜。
    阈值猜法的毛病：它无法区分三种情况 ——
      ① 正确乘了 8；② 被人改成 5（同一个阈值内，看不出来）；
      ③ 走的是逐物件覆盖表。
    现在 instance() 与本函数共用同一行代码，验证脚本可以逐物件断言
    "实测 == 应有"，既没有魔法数，也不会因为新增覆盖条目而假失败。 */
export function effectiveScale(source, kit, name, explicit) {
  if (typeof explicit === 'number') return explicit;
  const target = SIZE_OVERRIDE[`${kit}/${name}`];
  return target || SRC_SCALE[source] || 1;
}

/* ── 为什么不用 DRACOLoader / KTX2Loader ────────────────────────────────
   Kenney 的 GLB 是未压缩的普通 glTF 2.0（几何走内嵌 BIN 缓冲，
   贴图是外部 PNG），既没有 Draco 压缩也没有 KTX2 纹理。
   引入这两个 loader 只会多出几 MB 的 wasm 解码器，白付成本。
   真要减面应当在上游做（Blender 批处理），而不是运行时解码。 */

/** 载入结果的三态：pending / ready / failed，给验证脚本读。 */
export const LOAD_STATE = { PENDING: 'pending', READY: 'ready', FAILED: 'failed' };

export function createAssetLoader() {
  const loader = new GLTFLoader();
  /** key = `${source}/${kit}/${name}` → { state, proto, error } */
  const cache = new Map();
  /** 某一批的等待者：warm 返回的 Promise 用得上 */
  const stats = { requested: 0, ready: 0, failed: 0 };

  /* ★ 兼容旧签名：原来只有 Kenney，调用方写 load(kit, name)。
     现在第一位是 source。为了让既有代码不改，做一次归一化：
     若第一个参数是已知源名，就当成省略了 source。 */
  const SOURCES = new Set([SRC.KENNEY, SRC.POLYHAVEN, SRC.AI]);
  function normSource(a, b) {
    if (SOURCES.has(a)) return { source: a, kit: b };
    return { source: SRC.KENNEY, kit: a, name: b };
  }

  const keyOf = (source, kit, name) => `${source}/${kit}/${name}`;

  function slot(source, kit, name) {
    const k = keyOf(source, kit, name);
    let s = cache.get(k);
    if (!s) {
      s = { state: LOAD_STATE.PENDING, proto: null, error: null, source, kit, name };
      cache.set(k, s);
    }
    return s;
  }

  /** 拼单个资产的 URL（不含 base）。
      Kenney 是 <kit>/<name>.glb；Poly Haven 是 <as>/<as>.glb（打包后的单文件）。 */
  function urlOf(source, kit, name) {
    if (source === SRC.POLYHAVEN) {
      /* ★ 用 <as>/<as>.glb 这个**规整命名**，而不是清单里记的原始
         gltf 文件名（如 fire_hydrant_1k.gltf）。
         为什么：打包脚本 pack-polyhaven-glb.cjs 输出的是统一命名，
         这样 URL 可预测、不依赖清单字段，也不会因为 Poly Haven
         改了原始文件名而失效。
         清单里的 `file` 字段保留着，用于**溯源**（哪个源文件打出来的）。 */
      return `${ASSET_BASE}${SRC_PATH[source]}/${kit}/${kit}.glb`;
    }
    return `${ASSET_BASE}${SRC_PATH[source]}/${kit}/${name}${SRC_EXT[source]}`;
  }

  /**
   * 载入一个模型（幂等：同一个 key 只真正加载一次）。
   * **永不 reject** —— 失败写进 cache 的 error，返回 null。
   *
   * 支持两种调用：
   *   load('commercial', 'building-a')        // 旧签名（Kenney）
   *   load(SRC.POLYHAVEN, 'detail', 'fire-hydrant')
   * @returns {Promise<THREE.Object3D|null>}
   */
  function load(a, b, c) {
    const n = normSource(a, b);
    const source = n.source;
    const kit = n.kit;
    const name = n.name !== undefined ? n.name : c;
    const s = slot(source, kit, name);
    if (s.state === LOAD_STATE.READY) return Promise.resolve(s.proto);
    if (s.state === LOAD_STATE.FAILED) return Promise.resolve(null);
    if (s._inflight) return s._inflight;

    stats.requested++;
    const url = urlOf(source, kit, name);

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
   * 预热一批资产的常用模型（不阻塞主流程）。
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

  /**
   * 预热一批 Poly Haven 资产（城中村细节）。
   * ★ 单独一个方法而不是塞进 warm：
   *   Poly Haven 的模型普遍带 1k 贴图（单个 2-17MB），全量预热会很重。
   *   分开调用便于按需预热 + 单独统计，也便于验证脚本区分两个源。
   * @param {Array<string>|string} keys  组名（如 'detail'）或 ['detail','signage'] 或具体的 as 名数组
   */
  function warmPolyHaven(keys = []) {
    const list = Array.isArray(keys) ? keys : [keys];
    const jobs = [];
    for (const k of list) jobs.push(load(SRC.POLYHAVEN, k, k));
    return Promise.all(jobs).then((rs) => rs.filter(Boolean).length);
  }

  /**
   * 预热一批 AI 生成资产（城中村标志物）。
   * ★ 与 Poly Haven 分开统计的理由相同，且这里更极端：
   *   每个 AI 模型 0.7~1.5MB（几何占大头），全量预热会明显拖慢启动。
   *   故按 <组>/<名> 精确预热，不提供"整组一把梭"。
   * @param {Array<[string,string]>} items  [[组, 名], ...]，如 [['hero','qilou']]
   */
  function warmAi(items = []) {
    const list = Array.isArray(items[0]) ? items : [items];
    const jobs = [];
    for (const it of list) {
      if (Array.isArray(it)) jobs.push(load(SRC.AI, it[0], it[1]));
    }
    return Promise.all(jobs).then((rs) => rs.filter(Boolean).length);
  }

  /**
   * 同步取一个资产（未载入或失败 → null）。调用方必须处理 null。
   *
   * 支持两种调用：
   *   get('commercial', 'building-a')                     // Kenney
   *   get(SRC.POLYHAVEN, 'detail', 'fire-hydrant')        // Poly Haven
   */
  function get(a, b, c) {
    const n = normSource(a, b);
    const name = n.name !== undefined ? n.name : c;
    const s = cache.get(keyOf(n.source, n.kit, name));
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
  function instance(a, b, c, poseArg) {
    const n = normSource(a, b);
    const source = n.source;
    const kit = n.kit;
    const name = n.name !== undefined ? n.name : c;
    const pose = (poseArg !== undefined ? poseArg : (n.name !== undefined ? c : poseArg)) || {};

    const proto = get(source, kit, name);
    if (!proto) return null;
    const obj = proto.clone(true);
    obj.position.set(pose.x || 0, pose.y || 0, pose.z || 0);
    if (typeof pose.rotY === 'number') obj.rotation.y = pose.rotY;
    /* ★ 尺寸换算：各源比例不同，见上方 SRC_SCALE 的说明。
       Kenney ×8（1单位≈8m）· Poly Haven ×1（米制）· AI ×1（上游已烘焙成米制）。
       pose.scale 若显式给出则优先（调用方可覆盖）。
       ★ 公式抽在 effectiveScale() 里，让验证脚本能读到"应有值"逐物件比对 ——
         别把公式再写一份在这里，否则两处会漂移。 */
    const s = effectiveScale(source, kit, name, pose.scale);
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
    const bySource = { kenney: 0, polyhaven: 0, ai: 0 };
    const failures = [];
    for (const [k, s] of cache) {
      byState[s.state]++;
      if (s.source) bySource[s.source] = (bySource[s.source] || 0) + 1;
      if (s.state === LOAD_STATE.FAILED) failures.push({ key: k, error: s.error });
    }
    return { ...stats, byState, bySource, failures, cached: cache.size };
  }

  return {
    load, warm, warmPolyHaven, warmAi, get, instance, report, cache,
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

/* ══════════════════════════════════════════════════════════════════════════
   Poly Haven 清单访问
   ══════════════════════════════════════════════════════════════════════════

   清单结构（由 scripts/gen-polyhaven-manifest.cjs 从下载脚本写的
   src/assets/polyhaven/manifest.json 转出）：
     {
       "hdri":   { "day-cloudy": {file, note}, ... },
       "groups": {
         "detail":   { note: "城中村/工业区标志细节", items: [
             { name, file, note, w, h, d }, ...   // w/h/d 是模型实测米制尺寸
         ]},
         ...
       }
     }
   ★ 为什么要带 w/h/d：验证脚本可以断言"卷帘门高 2.4m"，
     而不是只断言"加载成功了" —— 后者对"模型尺寸错了 8 倍"毫无察觉。
   ────────────────────────────────────────────────────────────────────────── */

/** 列出某个 Poly Haven 组里的条目。 */
export function polyHavenGroup(group) {
  return (polyhavenManifest && polyhavenManifest.groups && polyhavenManifest.groups[group] && polyhavenManifest.groups[group].items) || [];
}

/** 按 as 名在整个 Poly Haven 清单里找一条（跨组搜索）。 */
export function findPolyHaven(_group, name) {
  const gs = (polyhavenManifest && polyhavenManifest.groups) || {};
  for (const g of Object.keys(gs)) {
    const hit = (gs[g].items || []).find((e) => e.name === name);
    if (hit) return hit;
  }
  return null;
}

/** 列出全部 Poly Haven 模型条目（不分组的扁平视图）。 */
export function listPolyHaven() {
  const gs = (polyhavenManifest && polyhavenManifest.groups) || {};
  const out = [];
  for (const g of Object.keys(gs)) out.push(...(gs[g].items || []));
  return out;
}

/** 列出 HDRI 清单（供环境光照用）。 */
export function listHdri() {
  const h = (polyhavenManifest && polyhavenManifest.hdri) || {};
  return Object.keys(h).map((k) => ({ name: k, ...h[k] }));
}

/** HDRI 的 URL（未载入时不请求，只是拼路径）。 */
export function hdriUrl(name) {
  return `${ASSET_BASE}polyhaven/hdri/${name}.hdr`;
}

/* ══════════════════════════════════════════════════════════════════════════
   AI 生成资产清单访问（2026-09-19）
   ══════════════════════════════════════════════════════════════════════════

   清单结构（scripts/ai-asset-pipeline.cjs 写）：
     {
       "groups": {
         "hero":  { note, items: [{ name, file, w, h, d, faces, bytes }] },
         "stall": { ... }
       }
     }
   ★ w/h/d 是**预处理烘焙后**的米制实测 —— 这是本清单存在的核心理由：
     混元直出的物理尺寸未知，只有烘焙后的值才是可信的。
     验证脚本拿它断言"骑楼高 10.0m"，能抓到"忘记跑预处理"这类静默错误。
   ────────────────────────────────────────────────────────────────────────── */

/** 列出某个 AI 组里的条目。 */
export function aiGroup(group) {
  return (aiManifest && aiManifest.groups && aiManifest.groups[group] && aiManifest.groups[group].items) || [];
}

/** 找一条 AI 资产（跨组搜索，与 findPolyHaven 同语义）。 */
export function findAi(name) {
  const gs = (aiManifest && aiManifest.groups) || {};
  for (const g of Object.keys(gs)) {
    const hit = (gs[g].items || []).find((e) => e.name === name);
    if (hit) return hit;
  }
  return null;
}

/** 全部 AI 资产条目（扁平）。 */
export function listAi() {
  const gs = (aiManifest && aiManifest.groups) || {};
  const out = [];
  for (const g of Object.keys(gs)) out.push(...(gs[g].items || []));
  return out;
}
