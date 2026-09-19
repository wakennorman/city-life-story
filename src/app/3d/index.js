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
export { palette, buildPalette } from './palette.js';

export * from './assets.js';
/* 动态角色系统（人流/车流/动物）。暴露各个 build* 是为了让验证与取证脚本能
   直接检查"长什么样"：人形有没有五官/手脚、车/狗/猫/鸟的形态对不对，
   而不必去几十个移动目标里碰运气。 */
export {
  ActorSystem, ACTOR_KIND,
  buildHuman, buildCar, buildBike, buildDog, buildCat, buildBird,
  /* ★ faceTexture / faceX / faceY 是给**验证脚本**用的：
     脸的方位（脸是不是长在 +Z）无法靠数网格判断 ——
     五官现在是贴图，网格数永远对。只能把贴图本身取出来，
     按球面 UV 反查"眼睛那个方向上的像素是不是深色"。
     这与暴露 buildHuman 是同一个理由：让"长什么样"可被独立检查。 */
  faceTexture, faceX, faceY,
  /* ★ KIND_R 以 ACTOR_R 之名导出：**碰撞半径的唯一真源**。
     验证脚本判"角色有没有落在碰撞盒里"用的必须是这一份 ——
     脚本里再抄一份 `{ped:0.26,...}`，改一处忘一处，护栏就会
     用错的半径去量墙（宽了假红、窄了假绿），且不报任何错。 */
  KIND_R as ACTOR_R,
  /* ★ 任务系统（2026-09-19 引入，见 actors.js 顶部的任务系统长注）。
     导出给验证脚本的原因：**"高优先级槽能抢占主任务、且被抢占的主任务
     会恢复"是这次改造唯一的目的** —— 没有可执行断言，就等于没做。
     脚本用 WaitTask 作探针（无副作用、不依赖玩家位置）做抢占实验。
     TASK_SLOT 也一并导出：脚本里写 `slots[1]` 是魔数，写
     `TASK_SLOT.EVENT_TEMP` 才是可读的断言。 */
  Task, ComplexTask, WaitTask, YieldTask, ShopVisitTask,
  TASK_SLOT, TASK_SLOT_COUNT,
} from './actors.js';
/* 角色贴图（衣物 / 皮肤 / 车 / 毛皮）—— 2026-09-19 新建。
   ★ 暴露给验证脚本的理由与 faceTexture 完全一样：
     "贴图生成了"和"贴图真的挂到材质上了"是两件事，而且两者都不报错。
     脚本必须能直接读到纹理清单、实测尺寸、以及车身 UV 重映射的结果，
     否则只能靠盯着截图猜 —— 而截图里"贴图没挂上"和"贴图很淡"长得一样。 */
export {
  topMat, sleeveMat, pantsMat, skinMat, hairMat, carBodyMat, furMat,
  remapCarUV, charSkinDebug, TOP_KINDS, CAR_RECT,
} from './charskin.js';
/* 外部资产工厂（kit.js 的 GLB 部分）。暴露出来是为了让验证脚本能直接
   构造单个 glbProp 断言"兜底 → 替换"这条链路，而不必去翻整个场景树。 */
export {
  glbProp, pumpAssets, pendingAssetCount, setAssetLoader, lastDroppedAssets,
  /* ★ initKit：把 palette 对象注入 kit 的模块级 P。
     游戏里由 world.js::buildLocation 惰性调用（`if (!_paletteReady) K.initKit(palette())`），
     所以"不建地点、只用工厂"的调用方（试看台、取证脚本）必须自己调一次 ——
     否则工厂里的 P 是 null，报 "Cannot read properties of null (reading 'common')"。
     这是**顺序依赖**，不是可选步骤。 */
  initKit,
  cityLamp, utilityPole, siteBarrier, trafficCone, dumpster,
  tankProp, chimneyProp, waterTowerProp, solarPanelProp, shippingContainerProp,
  awningProp, parasolProp,
  /* Poly Haven（CC0，米制，单文件 GLB）—— 2026-09-18 接入 */
  shutterDoorProp, shutterWindowProp, hydrantProp, gutterProp,
  fireEscapeProp, powerPoleProp, chainlinkProp,
  roadBarrierProp, apartmentsFacadeProp, factoryFacadeProp,
  /* AI 源（混元 3D，上游已烘焙成米制）—— 2026-09-19 接入。
     暴露出来有两个用处：① 取证脚本能直接构造单个 AI 包装断言"兜底 → 替换"；
     ② 试看台（dev/_3dtest/models.html）直接复用**游戏内同一工厂**，
        于是看到的就是游戏里真会摆出来的东西（含真实尺度与 footprint），
        而不是另写一份加载逻辑 —— 另写一份必然与游戏行为漂移。 */
  AI_GROUP, AI_HEROES,
  qilouProp, oldApartmentProp, lingnanTempleProp, dapaidangProp, marketStallProp,
} from './kit.js';
/* ★ 这里**故意不** `export * as THREE`。
   试过：那样能让试看台直接拿到 three，但会挡住 esbuild 的摇树 ——
   整个 three 命名空间无法按需裁剪，包体 865KB → 1010KB（+145KB），
   而收益只是"dev 页面少写一行 import"。离线单文件分发不该付这个代价。
   试看台因此改用 dev/_3dtest/viewer-entry.js 单独打一份包
   （见该文件注释），主包保持瘦身。 */
