/**
 * 资产根路径 —— **叶子模块**，零依赖。
 *
 * ── 为什么要从 assets.js 里拆出来（2026-09-19）──────────────────────────────
 *   assets.js 是个"上帝模块"：它同时装着①一个全局字符串（资产根）、
 *   ②GLTFLoader、③三个 JSON 清单（kenney / polyhaven / ai）。
 *   于是任何"只想知道资产根"的模块，一 import 就把整个世界拖了进来。
 *
 *   实测代价：`textures.js` 只需要 `assetBase()`，链式拉进 assets.js 之后
 *   `dev/_3dtest/textures.html`（**直接以原生 ES 模块导入源码**的接触表页）
 *   整个模块图加载失败 —— 因为浏览器原生 ESM 不能导入裸 JSON：
 *       Failed to load module script: Expected a JavaScript-or-Wasm module script
 *       but the server responded with a MIME type of "application/json"
 *   症状极具迷惑性：`__texSheetDone` 永不置位 → 门禁 30 秒超时，
 *   看起来像"贴图生成挂了"，实际上**一行代码都没跑到**。
 *
 *   拆开之后依赖方向是干净的：assets.js → asset-base.js（单向，无环），
 *   而 textures.js 只依赖叶子。以后再有"只要根路径"的模块，
 *   直接 import 这里，不要再从 assets.js 抄一份默认值
 *   （抄一份就多一个真源，dev 与 dist 的分叉会漏掉其中一支）。
 *
 * ★ 语义是"**资产根**"，各源在它下面分自己的子目录：
 *     <ASSET_BASE>/kenney/<kit>/<name>.glb
 *     <ASSET_BASE>/polyhaven/models/<as>/<x>.gltf
 *
 * ⚠️ 历史包袱：这个常量原来叫"Kenney 根"，值是 'assets/kenney/'。
 *   引入 Poly Haven 后若沿用旧值，拼出来会是
 *   `assets/kenney/polyhaven/models/...` —— 静默 404（降级到兜底几何）。
 *   所以改为 'assets/'，并同步改探针/验证脚本传入的 base。
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
