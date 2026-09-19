/**
 * 3D 场景层 · 打包入口
 *
 * 只做两件事：把桥接工厂与内联数据聚合起来，交给 esbuild 打成 IIFE。
 *
 * 为什么内联 gamedata 而不是 fetch：
 *   游戏是单文件 dist/index.html + dist/app.js 的离线分发形态（GitHub Pages / 本地直开），
 *   多一个运行时 fetch 就多一个失败点（路径、CORS、file:// 协议）。
 *   数据由 scripts/extract-3d-data.mjs 从游戏本体生成，构建期固化即可。
 */

import { createGame3D } from './bridge.js';
import { create3DShell } from './shell.js';
import { createHUD } from './hud.js';
import gamedata from './gamedata.json';

export { createGame3D, create3DShell, createHUD, gamedata };
export { buildLocation, SPECS, LAYOUT_KIND } from './world.js';
export { palette } from './palette.js';

export * from './assets.js';
/* 外部资产工厂（kit.js 的 GLB 部分）。暴露出来是为了让验证脚本能直接
   构造单个 glbProp 断言"兜底 → 替换"这条链路，而不必去翻整个场景树。 */
export {
  glbProp, pumpAssets, pendingAssetCount, setAssetLoader, lastDroppedAssets,
  cityLamp, utilityPole, siteBarrier, trafficCone, dumpster,
  tankProp, chimneyProp, waterTowerProp, solarPanelProp, shippingContainerProp,
  awningProp, parasolProp,
  /* Poly Haven（CC0，米制，单文件 GLB）—— 2026-09-18 接入 */
  shutterDoorProp, shutterWindowProp, hydrantProp, gutterProp,
  fireEscapeProp, powerPoleProp, chainlinkProp,
  roadBarrierProp, apartmentsFacadeProp, factoryFacadeProp,
} from './kit.js';
