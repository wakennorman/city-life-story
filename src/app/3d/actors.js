import * as THREE from 'three';
/* ★ hashSeed / mulberry32 移到 rng.js 共用（原来 world.js / kit.js / 这里各写一份）。
   只取这两个纯函数，**不取 rng**：本文件里 1099 行有个局部变量也叫 `rng`，
   导入会撞名（局部遮蔽导入，不报错但极易看错）。 */
import { hashSeed, mulberry32 } from './rng.js';
/* ★ 街道横断面（车/人/道具的 x 占位）统一从 road.js 取 —— 见该文件顶注：
   原来 world.js 与 actors.js 各写一份，于是垃圾桶被撒到车道中央把车拦死。 */
import { carLane, bikeLane, pedBandX, CAR_R } from './road.js';
/* ★ 角色贴图（衣物 / 皮肤 / 车 / 毛皮）。全部程序化 Canvas，无外部资产。
   与 faceTexture 的分工：脸归本文件，身体归 charskin.js ——
   两边都遵循"灰度贴图 + 材质 color 相乘"，所以 8 种上衣色只花 1 张图。
   ★ 这些材质是**模块级共享、永不 dispose** 的，见 charskin.js 文件头。 */
import {
  topMat, sleeveMat, pantsMat, skinMat, hairMat, carBodyMat, furMat,
  remapCarUV, TOP_KINDS,
} from './charskin.js';

/* ══ 动态角色系统：NPC · 人流 · 车流 · 动物 ═══════════════════════════════════
   2026-09-19 新建。此前场景里**只有玩家一个活物** —— 街道是静止的布景。

   ── 为什么单独一个模块，而不是塞进 world.js ──────────────────────────────
   world.js 产出的是**静态几何**，构建完就交给 mergeStatics 合批。
   动态角色必须每帧移动，一旦混进 world.group 就会被合批"焊死"。
   所以这里自带一个 Group，由 bridge 直接挂在 scene 上（与 Player 同款做法），
   生命周期跟着地点切换走（setWorld / dispose）。

   ── 坐标约定（来自 world.js 的路面生成，改之前先看那边）────────────────────
     街道沿 **Z 轴**延伸，路面中心在 x = 0。
       roadW      路面宽度（lane 9.5 · avenue 15 · 视 SPECS 而定）
       laneHalf   lane 布局 = roadW/2（没有独立人行道，路即街）
                  avenue 布局 = roadW/2 + 3.8（含两侧人行道）
     街长 z ∈ [-streetLen/2, +streetLen/2]

   ★ 靠右行驶（中国大陆）—— 这条必须算对，否则车流会"逆行"：
     面向 +Z 前进时，"右"是这个坐标系里的 **-X**
     （右手系：right = forward × up，(0,0,1)×(0,1,0) = (-1,0,0)）。
     故：+Z 方向的车上半道在 x < 0，-Z 方向的车在 x > 0。
     验证方法：把相机转到俯视，两个方向的车应各占半边、互不侵入。
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── 巷弄的横断面（lane 布局，half = 路宽/2）─────────────────────────────
   ★ 恒稳反馈「街道上很乱」的根子在这里：原来**五类东西全挤在同一个 x 区间**。
     现在把横断面分段定死，每一段只放一类东西：

        x:  -half ────── -1.5 ──── 0 ──── +1.5 ────── +half
                 墙根│电动车│摊位│ 行人 │ 车流 │ 行人 │摊位│电动车│墙根
                                     带         带
        （图中 ±1.5 只是示意；实际值见下面各常量）

     · 行人带   ±(half - 2.7) ~ ±(half - 2.1)   贴车道边缘走，绝不越 half
     · 车流     ±min(roadW/4, half - 3.4)       靠右行驶
     · 摊位     ±(half - 1.5)                   贴路沿内侧（world.js STALL_INSET）
     · 电动车   ±(half - 0.9)                   紧贴墙根（world.js MOPED_INSET）
     · 电线杆   ±(half - 1.05)                  横担 0.95，必须比它更大（POLE_INSET）

   ★ 这张表里的数是**互相挤出来的**，单独调一个必然压到另一个 ——
     所以 2026-09-19 把公式与常量全部收进 **road.js**（车/人/道具三方唯一的真源）。
     本文件只留这张"给人看"的示意图；**改数请改 road.js**。
     否则又回到"同一横断面两份定义"的老路 —— 那次的结局是垃圾桶落进车道、
     把车拦死（car#1 Δ0.00 停驶 1.8s），而两条公式各自看都"没错"。
     改任何一项都要重跑 verify:actors 的「行人不在碰撞盒内 / 车道走廊无碰撞盒」
     断言 —— 那两条断言才是这张表真正的守卫，注释只是给人看的。 */

/* ── 可复现随机：同一地点每次生成的角色布置应一致 ─────────────────────────
   为什么不用 Math.random：验证脚本要断言"某地点有 N 个行人/几辆车"，
   纯随机会让断言变成薛定谔的绿灯。用地点名做种子 → 同地点稳定、异地不同。
   （实现已抽到 rng.js，与世界布局共用同一套；此处仅保留说明。） */

/* ── 共享几何/材质缓存 ─────────────────────────────────────────────────────
   几十个角色各自 new 几何会让显存与 draw call 双爆。
   所有基础体只建一次，角色之间共享（clone 只复制 Object3D 树，几何仍共享）。
   ★ 与 assets.js 同一条纪律：共享几何**不可 dispose** ——
     释放了会连带毁掉其它活着的实例（而且不报错，只是"人不见了"）。 */
const G = {
  head: null, torso: null, neck: null, arm: null, leg: null,
  hand: null, foot: null, nose: null,
  hairCap: null, carBody: null, carRoof: null, wheel: null,
  dogBody: null, dogHead: null, catBody: null, catHead: null,
  tail: null, birdBody: null, wing: null, insect: null,
};
function geomInit() {
  if (G.head) return;
  /* 分段数从 14×10 提到 20×14：脸改成贴图之后，头球的**轮廓**也要跟得上 ——
     14 段的球在近景下是明显的多面体，贴一张精致的脸反而更露怯。 */
  G.head = new THREE.SphereGeometry(0.105, 20, 14);
  /* ★★ 躯干必须带 thetaStart = π（2026-09-19 加上，改之前先读这段）。
     CylinderGeometry 默认 thetaStart = 0 → u = 0 落在 **+Z**，也就是正面。
     而 u = 0 同时是画布接缝（u=1 与 u=0 是同一条线）——
     于是贴在胸口的门襟与领口会被**劈成两半**甩到左右两侧，
     中间反而什么都没有。而代码逐行看全对，属于最难发现的一类错。
     转 π 之后：u = 0.5 → theta = 2π → (x,z) = (0, +r) = **+Z = 正面**，
     正面落在画布正中，接缝转到背后（背后本来就没有结构，看不出来）。
     ★ 段数 9 → 16：贴图有了领口/门襟之后，9 段的多面体轮廓开始显眼 ——
       近景下躯干会出现明显的直棱，反而比纯色时更露怯。 */
  G.torso = new THREE.CylinderGeometry(0.155, 0.135, 0.56, 16, 1, false, Math.PI);
  G.neck = new THREE.CylinderGeometry(0.045, 0.05, 0.09, 7);
  G.arm = new THREE.CapsuleGeometry(0.043, 0.42, 4, 7);
  G.leg = new THREE.CapsuleGeometry(0.072, 0.62, 4, 8);
  G.hand = new THREE.SphereGeometry(0.05, 8, 6);
  G.foot = new THREE.BoxGeometry(0.105, 0.055, 0.225);
  /* 鼻锥：现在不再当"鼻子"用（鼻子进了脸贴图），
     但它仍是**猫耳朵**与**鸟喙**的唯一几何来源，不能删。 */
  G.nose = new THREE.ConeGeometry(0.021, 0.05, 6);
  /* ★★ 头发帽必须**在正面开口**（2026-09-19 找到的真正病根）：
     原参数是 SphereGeometry(0.112, 14, 10, 0, 2π, 0, 0.62π) ——
     整个球从顶极点往下包到 1.948 rad（世界 y=1.564）。
     而头心在 y=1.60、半径 0.105，于是这顶"帽子"把 y∈[1.564, 1.717]
     之间的**整圈**都罩住了 —— 眼睛(y=1.622)、鼻子(y=1.587)全在罩内，
     且它们到帽心的距离都 < 0.112，被**完整包在头发里面**。
     所以之前的五官代码其实一行都没失效，是**被头发盖住了**：
     远看就是一个戴黑头套的无脸球 —— 恒稳说的"人脸还是没有做出来"。
     （只剩唇线 y=1.556 恰好在 1.564 之下，所以唯一露出来的是嘴 ——
       这也解释了为什么之前"似乎有一点点东西"却怎么都不像脸。）
     修法：给 phi 开一个正面缺口（phistart/phiLength），
     让帽子只包**颅顶 + 两侧 + 后脑**，正面那条脸的弧段留空。
     缺口 = phi ∈ (π/2 ± 0.85)，而脸的绘制区是 u∈(0.125,0.375)
     → phi∈(0.785, 2.356)，完全落在缺口里，不会有一根头发丝压到眼上。 */
  G.hairCap = new THREE.SphereGeometry(
    0.112, 18, 10,
    Math.PI / 2 + 0.85, Math.PI * 2 - 1.7,   // phi：正面留缺口
    0, Math.PI * 0.62,                        // theta：颅顶包到 1.948 rad
  );
  G.carBody = new THREE.BoxGeometry(1.78, 0.62, 4.05);
  /* ★ 车身六面重映射到一张图集（车门缝 / 门把手 / 腰线 / 裙边 / 格栅 / 车牌）。
     BoxGeometry 六个面的 uv 默认全是 0..1 —— 不重映射的话六个面只能贴同一张图，
     于是车头上也会长出车门缝。用图集 + 重映射可以**一个材质、一次 draw call**
     就让六面各不相同（比"材质数组"省 5 次 draw call × 每辆车）。
     ★ 必须在 geomInit 里做一次就够：几何是模块级共享的，
       remapCarUV 内部有幂等保护（见 charskin.js）。 */
  remapCarUV(G.carBody);
  G.carRoof = new THREE.BoxGeometry(1.62, 0.55, 2.15);
  G.wheel = new THREE.CylinderGeometry(0.31, 0.31, 0.2, 12);
  G.dogBody = new THREE.CapsuleGeometry(0.145, 0.34, 4, 8);
  G.dogHead = new THREE.BoxGeometry(0.16, 0.15, 0.24);
  G.catBody = new THREE.CapsuleGeometry(0.105, 0.26, 4, 8);
  G.catHead = new THREE.SphereGeometry(0.085, 10, 8);
  G.tail = new THREE.CapsuleGeometry(0.022, 0.24, 3, 6);
  G.birdBody = new THREE.SphereGeometry(0.075, 9, 7);
  G.wing = new THREE.BoxGeometry(0.19, 0.016, 0.09);
  G.insect = new THREE.SphereGeometry(0.012, 6, 5);
}

const M = {};
function matInit() {
  /* ★ 幂等哨兵改用 M.dark：原来守的是 M.skin，而 2026-09-19 把皮肤/头发
     并进 charskin.js 之后 M.skin / M.hair 已无任何引用 ——
     哨兵留在一个"已经不建"的键上，matInit 会**每次都重建一遍全部材质**。
     不会报错，只是每进一次地点就多漏一批材质。 */
  if (M.dark) return;
  /* ★ 2026-09-19：原来的 M.skin / M.hair 两份**平色**材质已删。
     皮肤现在走 charskin::skinMat（灰度斑驳图 × 肤色），
     头发走 charskin::hairMat（按发色缓存，5 份而不是每人一份）。
     留着的死材质不会报错，但下次有人照着它们写新代码时，
     会以为"皮肤还是平色的"，然后把整套逻辑再实现一遍 —— 与之前
     删掉 eyeW/eyeD/mouth 是同一个理由。 */
  M.dark = new THREE.MeshStandardMaterial({ color: 0x2b2f34, roughness: 0.85 });
  /* ★ 2026-09-19：原先还有 eyeW / eyeD / mouth 三份材质，供眼球与唇线的
     网格使用。五官并进头贴图后它们没有任何引用 —— 已删。
     （留着的死材质不会报错，但下次有人照着它们写新代码时，
       会以为"五官还是用网格拼的"，然后把整套逻辑再实现一遍。） */
  M.metal = new THREE.MeshStandardMaterial({ color: 0x8a9098, roughness: 0.45, metalness: 0.55 });
  M.glass = new THREE.MeshStandardMaterial({ color: 0x2a3a48, roughness: 0.22, metalness: 0.35 });
  M.lamp = new THREE.MeshStandardMaterial({ color: 0xf0e0b0, roughness: 0.35, emissive: 0x201800 });
  /* 刹车灯：与车头灯共用几何（G.lamp），只换材质 —— 所以必须单列一份，
     否则"刹车"会把车头灯也一起染红（几何共享时材质是按 mesh 存的，
     但两者的材质引用会互相覆盖）。 */
  M.lampBrake = new THREE.MeshStandardMaterial({ color: 0xd04030, roughness: 0.4, emissive: 0x501008 });
  M.birdBody = new THREE.MeshStandardMaterial({ color: 0x4a4640, roughness: 0.85 });
  M.insect = new THREE.MeshStandardMaterial({ color: 0x22262a, roughness: 0.6 });
  M.tailDark = new THREE.MeshStandardMaterial({ color: 0x2a2622, roughness: 0.9 });
}

/* ── 人脸贴图 ─────────────────────────────────────────────────────────────
   ★ 为什么改成贴图（2026-09-19 恒稳反馈「人脸还是没有做出来」）：
     原实现是有五官的 —— 2 白眼 + 2 黑眼 + 鼻锥 + 唇线，共 6 个网格。
     但它有两个致命问题：
       ① **被头发盖住**（主因，见 geomInit 里 hairCap 的注释）：
          帽子从顶极点一路包到 y=1.564，而眼睛在 1.622 → 眼睛在头发里面。
          所以"做了"和"没做"在屏幕上完全一样，这就是"我不是让你做了吗"的由来。
       ② 即使露出来也太小：眼球半径 0.019m，在 5~15m 的跟随视距下
          只占 1~2 像素，且**眉毛完全没有** —— 而远距离识别人脸靠的正是眉毛。
     贴图一次性解决两件事：眉毛、眼窝阴影、鼻孔、唇线都能画上去，
     而且**净减少 6 个网格/人**（17 个行人省约 102 个网格）。

   ★ 球面 UV 的方位必须算对，否则脸会长在后脑勺：
     THREE.SphereGeometry（phiStart=0）在 u=0.25 处对应 **+Z**。
     推导：x = -r·cos(phi)·sin(theta)，z = r·sin(phi)·sin(theta)，u = phi/2π。
     phi=π/2 时 x=0、z=+r·sin(theta) → 正是 +Z，而模型的面朝方向就是 +Z
     （见 _updPed 的 rotation.y 约定）。故脸画在画布 x = 0.25·W 处。

   ★ v 方向：three 的球面 uv.y = 1 - theta/π，且贴图 flipY 默认为真，
     所以画布行号 y = (theta/π)·H —— theta=0（顶极点）在画布最上方。
     本文件里所有五官都用 yAt(worldY) 换算，不要手写像素值。

   ★ 皮肤色走材质 color、贴图只画**明暗与五官**（底色为纯白）：
     4 张脸型 × 5 种肤色若都烘进贴图 = 20 张；底色留白 + color 相乘
     只需 4 张 —— 省 5 倍显存，画面完全一样。 */
const FACE_W = 512, FACE_H = 256;
const HEAD_R = 0.105, HEAD_CY = 1.60;
const _faceCache = [];
const clamp1 = (v) => Math.max(-1, Math.min(1, v));

/** 世界 y（头心为原点，米）→ 贴图画布行号 */
function faceY(worldY) {
  return (Math.acos(clamp1((worldY - HEAD_CY) / HEAD_R)) / Math.PI) * FACE_H;
}
/** 世界 x（头心为原点，米）+ 该点高度 → 贴图画布列号（仅对前半球有效） */
function faceX(worldX, worldY) {
  const theta = Math.acos(clamp1((worldY - HEAD_CY) / HEAD_R));
  const sinT = Math.max(1e-6, Math.sin(theta));
  const phi = Math.acos(clamp1(-worldX / (HEAD_R * sinT)));
  return (phi / (Math.PI * 2)) * FACE_W;
}

/**
 * 生成（并缓存）一张人脸贴图。
 * @param {number} variant 0~3，四种脸型（眉形/眼型/嘴形/表情各不同）
 */
function faceTexture(variant) {
  const v = ((variant | 0) % 4 + 4) % 4;
  if (_faceCache[v]) return _faceCache[v];

  const c = document.createElement('canvas');
  c.width = FACE_W; c.height = FACE_H;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, FACE_W, FACE_H);

  const EX = 0.040;                       // 瞳距的一半（世界米）
  const Y_EYE = 1.622, Y_BROW = 1.652, Y_NOSE = 1.587, Y_MOUTH = 1.556;
  const eyeW = [13, 15, 11, 14][v];       // 半宽（px）
  const eyeH = [7.5, 6.5, 8.5, 7][v];
  const browD = [0, -2.5, 1.5, -4][v];    // 眉毛抬高量（px）
  const browTh = [5, 6.5, 4, 5.5][v];

  /* ① 眼窝：一片柔和的暗部。没有它，眼睛会像贴上去的两个点。 */
  for (const s of [-1, 1]) {
    const cx = faceX(s * EX, Y_EYE), cy = faceY(Y_EYE);
    const rg = g.createRadialGradient(cx, cy, 1, cx, cy, 17);
    rg.addColorStop(0, 'rgba(96,76,64,0.50)');
    rg.addColorStop(1, 'rgba(96,76,64,0)');
    g.fillStyle = rg;
    g.beginPath(); g.arc(cx, cy, 17, 0, Math.PI * 2); g.fill();
  }

  /* ② 眉毛 —— 远距离认脸最有效的一笔，原来完全没有。 */
  g.strokeStyle = '#4a4038';
  g.lineCap = 'round';
  for (const s of [-1, 1]) {
    const x0 = faceX(s * 0.014, Y_BROW), x1 = faceX(s * 0.070, Y_BROW);
    const y0 = faceY(Y_BROW) + browD + 1.5, y1 = faceY(Y_BROW) + browD - 1.5;
    g.lineWidth = browTh;
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo((x0 + x1) / 2, Math.min(y0, y1) - 3.5, x1, y1 + 2);
    g.stroke();
  }

  /* ③ 眼睛：深色杏仁形（不画眼白 —— 5m 外眼白只会把眼睛"洗淡"）。
        再点一个极小的浅色高光，只在近景（取证截图/贴脸）看得出来。 */
  for (const s of [-1, 1]) {
    const cx = faceX(s * EX, Y_EYE), cy = faceY(Y_EYE);
    g.fillStyle = '#332c28';
    g.beginPath(); g.ellipse(cx, cy, eyeW, eyeH, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.72)';
    g.beginPath(); g.arc(cx + s * -2.5, cy - 2.4, 1.7, 0, Math.PI * 2); g.fill();
    /* 上眼睑压一条略深的线，眼睛才有"睁开"的形。 */
    g.strokeStyle = 'rgba(46,38,34,0.85)';
    g.lineWidth = 2.2;
    g.beginPath();
    g.moveTo(cx - eyeW, cy - 1);
    g.quadraticCurveTo(cx, cy - eyeH - 3.2, cx + eyeW, cy - 1);
    g.stroke();
  }

  /* ④ 鼻子：只用**暗部**表达（鼻梁两侧 + 鼻头 + 鼻孔）。
        不画轮廓线 —— 线会变成"画上去的鼻子"，暗部才会被当成体积。 */
  const ny = faceY(Y_NOSE);
  g.fillStyle = 'rgba(120,96,80,0.30)';
  g.beginPath();
  g.ellipse(faceX(0, Y_NOSE), ny + 4, 11, 9, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = 'rgba(70,56,48,0.72)';
  for (const s of [-1, 1]) {
    g.beginPath();
    g.ellipse(faceX(s * 0.0135, 1.573), faceY(1.573), 2.1, 1.7, 0, 0, Math.PI * 2);
    g.fill();
  }

  /* ⑤ 嘴：一条带弧度的唇线。variant 3 上扬（笑），variant 2 嘴角下压。 */
  const my = faceY(Y_MOUTH);
  const mw = [20, 22, 17, 21][v];
  const curve = [2, 1, 5, -4][v];
  g.strokeStyle = '#8a5a52';
  g.lineWidth = 3.4;
  g.beginPath();
  g.moveTo(faceX(-0.021, Y_MOUTH), my);
  g.quadraticCurveTo(faceX(0, Y_MOUTH), my + curve, faceX(0.021, Y_MOUTH), my);
  g.stroke();
  /* 下唇上的一道浅高光：让嘴有厚度，不然只是根线。 */
  g.strokeStyle = 'rgba(255,255,255,0.34)';
  g.lineWidth = 1.6;
  g.beginPath();
  g.moveTo(faceX(-0.017, Y_MOUTH), my + 3.4);
  g.quadraticCurveTo(faceX(0, Y_MOUTH), my + curve + 3.4, faceX(0.017, Y_MOUTH), my + 3.4);
  g.stroke();
  void mw;

  /* ⑥ 整体一点极淡的上下渐变：额头略亮、下颌略暗 ——
        纯粹为了打破"平面贴纸"感，强度低到说不出哪里变了但看得出不对。 */
  const grad = g.createLinearGradient(0, 0, 0, FACE_H);
  grad.addColorStop(0, 'rgba(255,255,255,0)');
  grad.addColorStop(0.75, 'rgba(150,120,100,0.10)');
  grad.addColorStop(1, 'rgba(120,95,80,0.16)');
  g.fillStyle = grad;
  g.fillRect(0, 0, FACE_W, FACE_H);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  /* 脸只画一遍（u 只绕一圈），不需要重复采样；夹边比重复安全。 */
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  _faceCache[v] = tex;
  return tex;
}

/* 人类可选外观 —— 皮肤/发色/上衣/裤子。给角色多样性，避免"一排复制人"。 */
const SKIN = [0xc8a07a, 0xb89070, 0xd8b48c, 0xa88060, 0xdcbb96];
const HAIR = [0x22201e, 0x3a2c22, 0x14110f, 0x5a4632, 0x6e6259];
const TOP = [0x3b4048, 0x5a4a42, 0x40514a, 0x6b3a34, 0x3a4a5a, 0x8a8278, 0x4a3f52, 0x2f3a44];
const PANTS = [0x272b2f, 0x2f3a44, 0x3a3a3a, 0x4a4238, 0x1f2429];

/* ── 名字条（命名 NPC 头顶） ─────────────────────────────────────────────
   ★ 为什么必须缓存、且**永不 dispose**：与几何/材质同一条纪律。
     它们是模块级共享资源 —— 同一张"王大婶"贴图在城里可能同时出现一份，
     切地点时还会被下一批 NPC 复用。一旦 dispose，第二次进地点就是**黑框**
     （不报错、只是名字变成一块黑），属于最难查的那类失真。 */
const _nameCache = {};   // name → { tex, mat, aspect }

function nameAsset(name) {
  const cached = _nameCache[name];
  if (cached) return cached;
  const FS = 40, PAD = 10, R = 9;
  const cv = document.createElement('canvas');
  const probe = cv.getContext('2d');
  const font = '500 ' + FS + 'px "PingFang SC","Microsoft YaHei",sans-serif';
  probe.font = font;
  const tw = Math.ceil(probe.measureText(name).width);
  cv.width = Math.max(56, tw + PAD * 2);
  cv.height = FS + PAD * 2;

  const g = cv.getContext('2d');
  g.font = font;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  /* 底框 + 描边 + 白字，三层都要：
       只白字 → 浅色墙面（白灰墙/天空）上直接消失；
       只底框 → 站在车流前会糊成一片色块；
       描边负责让"白字压在浅底上"也读得出来。 */
  g.fillStyle = 'rgba(18,22,26,0.60)';
  const W = cv.width, H = cv.height;
  g.beginPath();
  g.moveTo(R, 0); g.lineTo(W - R, 0); g.quadraticCurveTo(W, 0, W, R);
  g.lineTo(W, H - R); g.quadraticCurveTo(W, H, W - R, H);
  g.lineTo(R, H); g.quadraticCurveTo(0, H, 0, H - R);
  g.lineTo(0, R); g.quadraticCurveTo(0, 0, R, 0);
  g.closePath(); g.fill();
  g.lineWidth = 6; g.lineJoin = 'round';
  g.strokeStyle = 'rgba(0,0,0,0.55)';
  g.strokeText(name, W / 2, H / 2);
  g.fillStyle = '#ffffff';
  g.fillText(name, W / 2, H / 2);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  const mat = new THREE.SpriteMaterial({
    map: tex, transparent: true, depthWrite: false,
    /* ★ depthTest 必须开：名字要被建筑、围墙**挡住**。
       关掉它的话，站在巷子里能看见隔壁街的人名穿过墙面浮进来 —— 一眼假。
       （对比 bridge.js::notify 的提示条是有意关掉 depthTest 的 ——
         那是"必须让玩家看到"的反馈，两者诉求相反，不要照抄。） */
    depthTest: true,
  });
  const asset = { tex, mat, aspect: cv.width / cv.height };
  _nameCache[name] = asset;
  return asset;
}

/** 头顶名字条。高 0.20m —— 3m 外清晰，贴近时不会糊住脸。 */
function nameSprite(name) {
  const a = nameAsset(name);
  const sp = new THREE.Sprite(a.mat);
  sp.scale.set(0.20 * a.aspect, 0.20, 1);
  sp.renderOrder = 2;
  return sp;
}

/**
 * 构建一个改良人形：有五官、手、脚。
 * @param {Function} rng  seeded random
 * @param {number} scale 身高缩放（成人 1.0 ≈ 1.72m）
 */
export function buildHuman(rng, scale = 1) {
  const g = new THREE.Group();
  const skinIdx = (rng() * SKIN.length) | 0;
  /* ★ 皮肤色进材质的 color，贴图底色留白 —— 见 faceTexture 顶注。
     手 / 脖子现在也走同一条纪律（charskin::skinMat 是灰度斑驳图 × color），
     于是 5 种肤色共用 1 张皮肤图而不是 5 张。 */
  const skin = skinMat(SKIN[skinIdx]);
  /* 头的材质单列一份并挂脸贴图。同一材质不能既贴脸又给脖子/手用
     （那会让脖子也长出一张脸）。 */
  const faceMat = new THREE.MeshStandardMaterial({
    map: faceTexture((rng() * 4) | 0), color: SKIN[skinIdx], roughness: 0.72,
  });
  const hairM = hairMat(HAIR[(rng() * HAIR.length) | 0]);
  /* ★ rng 的调用序列**一位都不能挪**（理由见 charskin::TOP_KINDS 顶注）：
     上衣款式由颜色索引推出来，不额外抽一次随机 ——
     否则后面所有外观（背包、帽子）会整体错位一位，
     verify-actors / rngHygiene 里"同地点同结果"的断言就会莫名其妙变红。 */
  const topIdx = (rng() * TOP.length) | 0;
  const top = topMat(TOP_KINDS[topIdx] || 'tee', TOP[topIdx]);
  /* ★ 袖子必须与躯干**分开**两个材质：躯干贴图上有领口与门襟，
     共用一份的话袖子顶端会长出一圈领口、门襟会顺着胳膊往下跑。 */
  const sleeve = sleeveMat(TOP[topIdx]);
  const pants = pantsMat(PANTS[(rng() * PANTS.length) | 0]);

  /* ★ 只有"大到影子能看出来"的部件才投影（躯干/头/四肢）。
     眼睛/鼻子/嘴/手/脚/帽子都在 2~10cm 量级，它们在路面上的影子
     肉眼根本分不出来，但**每一个都会在阴影 pass 里多花一次 draw call**：
     17 个行人 × 12 个碎件 ≈ 200 次纯浪费（实测占角色总开销的三分之一）。
     投影是"整体轮廓对了就行"的事，细节部件由躯干和头的影子一并覆盖。
     ★ 2026-09-19：五官已经并进头贴图，这里少掉 6 个网格 —— 净减开销。 */
  const SHADOW = new Set([G.torso, G.head, G.leg, G.arm]);
  const add = (geo, mat, x, y, z) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    m.castShadow = SHADOW.has(geo);
    g.add(m);
    return m;
  };

  add(G.torso, top, 0, 1.16, 0);
  add(G.neck, skin, 0, 1.475, 0);
  /* 头：材质自带脸贴图（眉/眼/鼻/唇都在里面，见 faceTexture）。
     面朝 +Z —— 与 _updPed 的 rotation.y 约定一致。 */
  const head = add(G.head, faceMat, 0, HEAD_CY, 0);
  /* 头发帽：正面有缺口（见 geomInit 的注释），不会再盖住脸。 */
  add(G.hairCap, hairM, 0, 1.605, 0);
  void head;

  const legs = [], arms = [];
  /* ★ 手掌必须挂在**手臂**下、脚掌必须挂在**腿**下（局部坐标），不能挂在组根上。
     原先两者都用 add() 挂到组根，于是：
       · 手的位置算出来是 (−0.185, −0.245, 0) 的**组空间**坐标 →
         y 是负的，17 个行人的双手全部埋在路面以下（而且完全没有报错）；
       · 脚固定在 y=0.028，而腿在 _updPed 里靠 rotation.x 摆动 →
         走起来腿在甩、脚钉在地上，**腿脚分离**。
     两者都是一眼可见的失真，但"数一数有几个手/脚的网格"根本发现不了
     （几何参数与位置无关）。所以下面那条验证也一并改成查**世界坐标**。
     局部 y 的算法：部件中心 y − 肢体中心 y，即手掌 0.877−1.13、脚掌 0.028−0.45。 */
  for (const x of [-0.078, 0.078]) {
    const leg = add(G.leg, pants, x, 0.45, 0);
    const foot = new THREE.Mesh(G.foot, M.dark);
    foot.position.set(0, -0.422, 0.045);
    leg.add(foot);
    legs.push(leg);
  }
  for (const x of [-0.185, 0.185]) {
    /* 手臂用 sleeve 而不是 top —— 见上面 sleeve 的注释。 */
    const arm = add(G.arm, sleeve, x, 1.13, 0);
    const hand = new THREE.Mesh(G.hand, skin);
    hand.position.set(0, -0.253, 0);
    arm.add(hand);
    arms.push(arm);
  }

  /* 约 1/4 的人背个包 —— 通勤感的低成本来源。 */
  if (rng() < 0.25) {
    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.13), M.dark);
    bag.position.set(0, 1.16, -0.16);
    bag.castShadow = true;
    g.add(bag);
  }
  /* 约 1/6 打伞 / 戴帽（用一个扁圆柱当帽檐）。 */
  if (rng() < 0.16) {
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.135, 0.022, 10), M.dark);
    cap.position.y = 1.688;
    g.add(cap);
  }

  g.scale.setScalar(scale);
  g.userData.limbs = { legs, arms };
  return g;
}

/* ── 车辆 ────────────────────────────────────────────────────────────────── */

function buildCar(rng) {
  const g = new THREE.Group();
  const color = [0x3a4148, 0x6a6f74, 0x2f3a44, 0x5a4a44, 0x8a8f92, 0x7a2f2f, 0x2f4a6a][(rng() * 7) | 0];
  /* 车身材质带图集（车门缝 / 门把手 / 腰线 / 裙边 / 格栅 / 车牌）。
     图集是灰度图，颜色靠 color 乘进来 —— 所以 7 种车色共用 1 张图集。 */
  const body = carBodyMat(color);
  const b = new THREE.Mesh(G.carBody, body);
  b.position.y = 0.62; b.castShadow = true; g.add(b);
  const r = new THREE.Mesh(G.carRoof, M.glass);
  r.position.set(0, 1.16, -0.28); r.castShadow = true; g.add(r);
  /* 轮胎与车灯不投影（影子里完全看不出，但每个都要多一次 shadow pass）。 */
  for (const [x, z] of [[-0.86, 1.33], [0.86, 1.33], [-0.86, -1.33], [0.86, -1.33]]) {
    const w = new THREE.Mesh(G.wheel, M.dark);
    w.position.set(x, 0.31, z);
    w.rotation.z = Math.PI / 2;
    g.add(w);
  }
  /* 车头灯（面朝 +Z）。夜里靠 emissive 微微发亮，白天看不突兀。 */
  for (const x of [-0.6, 0.6]) {
    const l = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.14, 0.06), M.lamp);
    l.position.set(x, 0.68, 2.02); g.add(l);
  }
  g.userData.len = 4.05;
  return g;
}

function buildBike(rng) {
  const g = new THREE.Group();
  const color = [0x2f3a44, 0x6b3a34, 0x3a4a3a, 0x4a3f52][(rng() * 4) | 0];
  const body = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.25 });
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.3, 1.5), body);
  frame.position.y = 0.66; frame.castShadow = true; g.add(frame);
  for (const z of [0.62, -0.62]) {
    const w = new THREE.Mesh(G.wheel, M.dark);
    w.position.set(0, 0.31, z); w.rotation.z = Math.PI / 2; w.scale.setScalar(0.82); g.add(w);
  }
  /* 骑手：比行人矮一点的剪影，有头有肩。 */
  const rider = buildHuman(rng, 0.82);
  rider.position.y = 0.32;
  g.add(rider);
  g.userData.len = 1.5;
  return g;
}

/* ── 动物 ────────────────────────────────────────────────────────────────── */

function buildDog(rng) {
  const g = new THREE.Group();
  /* 毛皮贴图（短笔触）—— 狗在屏幕上只有 20~40px，
     让它读作"动物"而不是"一根胶囊"靠的正是毛的走向。 */
  const coat = furMat([0x8a6a44, 0x3a3028, 0xd8c8a8, 0x5a4a38][(rng() * 4) | 0]);
  const body = new THREE.Mesh(G.dogBody, coat);
  body.rotation.x = Math.PI / 2; body.position.y = 0.42; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(G.dogHead, coat);
  head.position.set(0, 0.56, 0.26); head.castShadow = true; g.add(head);
  const tail = new THREE.Mesh(G.tail, coat);
  tail.position.set(0, 0.5, -0.26); g.add(tail);
  const legs = [];
  /* 四条腿不投影：狗的影子由身体给，腿上那点影子看不见。 */
  for (const [x, z] of [[-0.09, 0.13], [0.09, 0.13], [-0.09, -0.13], [0.09, -0.13]]) {
    const l = new THREE.Mesh(G.tail, coat);
    l.position.set(x, 0.2, z); l.scale.setScalar(0.85); g.add(l); legs.push(l);
  }
  g.userData.legs = legs;
  g.userData.tail = tail;
  return g;
}

function buildCat(rng) {
  const g = new THREE.Group();
  const coat = furMat([0x3a3430, 0xd8d0c0, 0xa87a48, 0x5a5a5a][(rng() * 4) | 0]);
  const body = new THREE.Mesh(G.catBody, coat);
  body.rotation.x = Math.PI / 2; body.position.y = 0.3; body.castShadow = true; g.add(body);
  const head = new THREE.Mesh(G.catHead, coat);
  head.position.set(0, 0.4, 0.22); head.castShadow = true; g.add(head);
  /* 耳朵：两个小锥，猫的剪影靠它一眼可辨。 */
  for (const x of [-0.045, 0.045]) {
    const ear = new THREE.Mesh(G.nose, coat);
    ear.position.set(x, 0.47, 0.2); g.add(ear);
  }
  const tail = new THREE.Mesh(G.tail, coat);
  tail.position.set(0, 0.36, -0.2);
  tail.rotation.x = -0.7;
  g.add(tail);
  g.userData.tail = tail;
  return g;
}

function buildBird(rng) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(G.birdBody, M.birdBody);
  body.castShadow = true; g.add(body);
  const wings = [];
  for (const s of [-1, 1]) {
    const w = new THREE.Mesh(G.wing, M.birdBody);
    w.position.set(s * 0.1, 0.01, 0);
    g.add(w); wings.push(w);
  }
  const beak = new THREE.Mesh(G.nose, M.lamp);
  beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.005, 0.09); g.add(beak);
  g.userData.wings = wings;
  void rng;
  return g;
}

/* ── 角色包装：把"外观"与"行为"分开 ──────────────────────────────────────
   每个 actor = { kind, obj, 以及行为需要的状态字段 }
   update() 按 kind 分派。这样加一种新角色只需加一个 builder + 一段 case。 */

/* ★ [2026-09-19 修复] 原表**缺 KEEPER 键**，后果是 `KIND.KEEPER === undefined`：
   `_push` 写进 `userData.__actorKind` 的就是 undefined，摊主在 stats 里全归到
   "undefined" 这一类上 —— 验证脚本**按种类数不到任何一个摊主**。
   而 switch 之所以还能工作，是因为 `case undefined:` 恰好匹配了 `a.kind === undefined`，
   属于"靠巧合成立"的一类，正是本项目最忌讳的静默失败。
   ★ NAMED：命名 NPC（见 _spawnNamed）。与 KEEPER 的区别不在**怎么动**，
     而在**他是谁** —— 外观由 npcId 固定、头顶挂名字条。 */
const KIND = {
  PED: 'ped', KEEPER: 'keeper', NAMED: 'npc',
  CAR: 'car', BIKE: 'bike', DOG: 'dog', CAT: 'cat', BIRD: 'bird', INSECT: 'insect',
};

/* ── 碰撞半径（米）—— **唯一真源** ────────────────────────────────────────
   ★ 为什么必须只有一份：验证脚本判"角色有没有落在碰撞盒里"，用的就是这个半径。
     两处各写一份，改一处忘一处，护栏就会**用错的半径去量错的墙**
     （宽了假红、窄了假绿），而且不会报任何错。
     经 index.js 导出为 `Scene3D.ACTOR_R`，验证脚本直接读它，不再自己抄一份。
   ★ 只列**落地**的类别：鸟与虫在空中飞，不受地面碰撞盒约束 ——
     对它们做解算只会把飞鸟从楼里"推"出来，弄出一堆莫名其妙的位移。 */
export const KIND_R = {
  ped: 0.30, keeper: 0.30, npc: 0.30,
  /* ★ 车的半径不能在这里另写一个数：road.js 的 carCorridor() 要用**同一个**
     值去算"车道走廊"，两边不一致的话走廊就会算窄，车又会撞到路边件。
     走廊与避障半径共用 CAR_R 这一个常量。 */
  car: CAR_R, bike: 0.35, dog: 0.30, cat: 0.25,
};

/* 阴影 LOD：离玩家超过这个距离的角色不再投影（见 update 末尾）。 */
const SHADOW_LOD_R = 16;
const SHADOW_LOD_EVERY = 0.25;

/* ══ 任务系统：GTA `CTaskManager` 的最小可用子集 ═══════════════════════════
   2026-09-19 新建。**这是恒稳"人物行动逻辑问题太大"的直接解药。**

   ── 为什么需要它（改造前的病灶，逐条对应）──────────────────────────────
   ① 行为散在 `_updPed` 的一大段 if 里，加一个行为要动三处
      （分派 switch / 行为函数 / 状态字段的声明与初始化）。
   ② 一个行人身上挂 13 个裸状态字段，其中两个靠
      `a.pauseCd === undefined ? 2 + ... : a.pauseCd` **懒初始化**起步 ——
      那是"字段没有统一入口"的症状，失败形态是**静默 NaN**。
   ③ **最要命的一条：没有地方放"被事件打断"的行为。**
      想加"玩家挡在正前方就让行"，只能往 `_updPed` 里再插一个 if 和
      两个新字段；等分支到十个，就没人敢动这段代码了。

   ── GTA 怎么解（VC / SA 同族，本实现取其最小子集）────────────────────
   `CPedIntelligence → CTaskManager`：把行为切成一个个 Task，
   按优先级放进 5 个槽位，**槽号小的先执行**；一帧只跑"最高的那个非空槽"。
   于是高优先级天然覆盖低优先级，而低优先级任务**不被销毁、只是暂停** ——
   高优先级跑完，它从被打断的那一帧接着跑。
   **"打断 + 恢复"是这套结构唯一提供、而 if 链条根本给不了的东西。**

   ── 槽位表（常量名与 GTA 保持一致，便于日后对照资料）──────────────────
     0 PHYSICAL    物理反应（被撞飞 / 摔倒）—— **不可被抢占**
     1 EVENT_TEMP  短期事件反应（被挡路、被招呼）—— 几秒后自己退出
     2 EVENT_LONG  长期行为改变（"认识玩家之后会打招呼"这类）
     3 PRIMARY     主任务（走路 / 逛店 / 看摊）—— 常驻，永不为空
     4 DEFAULT     兜底（站立不动）—— 主任务缺席时顶上

   ── 为什么这样搬是安全的（与本项目既有约定的接口）────────────────────
   · Task **不持有任何几何**：它只读写 `a.obj.position` / `a.rotation`，
     与原来 `_updPed` 做的事逐行对应。所以搬进来之后
     `mergeStatics` / `__shadowParts` / 阴影 LOD 全都不受影响。
   · Task 需要 `_slide` / `_swing`，签名统一成 `tick(a, dt, sys)`，
     **不每帧新建 ctx 对象** —— 40 个角色 × 60fps = 每秒 2400 次分配，
     白白制造 GC 压力。
   · 字段归属有明确规则：**属于"身体"的**（speed / dir / phase / lane / x / z）
     留在角色上；**属于"当前这件事"的**（停顿计时、撞墙冷却、逛店阶段）
     搬进 Task 实例 —— 于是"一被打断就冻结、恢复时接着算"是免费得到的。 */

export const TASK_SLOT = {
  PHYSICAL: 0,
  EVENT_TEMP: 1,
  EVENT_LONG: 2,
  PRIMARY: 3,
  DEFAULT: 4,
};
export const TASK_SLOT_COUNT = 5;

/** 任务基类。子类至少覆写 `tick()`；返回 true 表示"这件事做完了"。 */
export class Task {
  constructor(name) {
    this.name = name;
    /* ★ 默认可被抢占。物理反应槽（被车撞飞）会置 false ——
       那种状态下任何"更该做的事"都不该覆盖它，只能等它播完。
       这是 `interruptible` 唯一的用途，不要拿它做别的判断。 */
    this.interruptible = true;
  }
  /* eslint-disable-next-line no-unused-vars */
  start(a) {}
  /* eslint-disable-next-line no-unused-vars */
  tick(a, dt, sys) { return true; }
  /* eslint-disable-next-line no-unused-vars */
  stop(a) {}
}

/**
 * 复合任务：持有一个子任务，按 `nextSubTask()` 给出的序列依次执行。
 * 对照 GTA 的 `CTaskComplex`（CreateFirstSubTask / CreateNextSubTask / ControlSubTask）。
 * 子类覆写 `nextSubTask(a, sys, finished)`；返回 null 表示整个序列结束。
 */
export class ComplexTask extends Task {
  constructor(name) {
    super(name);
    this.sub = null;
    this.stage = 0;
  }
  tick(a, dt, sys) {
    /* 一帧最多串 8 个子任务。防的是"某条序列永远返回一个立刻完成的子任务"
       这类写出 bug 的序列：那种 bug 现场表现为**游戏突然卡死不动**，
       而日志里什么都看不到 —— 加个上限让它退化成"慢一点"，不要退化成死循环。 */
    let finished = null;
    for (let guard = 0; guard < 8; guard++) {
      if (this.sub) {
        if (!this.sub.tick(a, dt, sys)) return false;   // 子任务还在跑
        finished = this.sub;
        this.sub.stop(a);
        this.sub = null;
      }
      const nx = this.nextSubTask(a, sys, finished);
      finished = null;
      if (nx === null) return true;                     // 序列走完
      this.sub = nx;
      nx.start(a);
    }
    return false;
  }
  stop(a) {
    if (this.sub) { this.sub.stop(a); this.sub = null; }
  }
  /* eslint-disable-next-line no-unused-vars */
  nextSubTask(a, sys, finished) { return null; }
}

/* ── 通用原子任务 ─────────────────────────────────────────────────────── */

/** 原地等 t 秒。★ 无副作用、不依赖玩家，所以它同时也是**任务系统的测试锚**
 *  （验证脚本用它断言"高槽能抢占主任务、且被抢占的主任务会恢复"）。 */
export class WaitTask extends Task {
  constructor(seconds) { super('wait'); this.t = seconds; }
  tick(a, dt, sys) {
    this.t -= dt;
    sys._swing(a.obj, 0, 0);
    a.obj.position.y = 0;
    return this.t <= 0;
  }
}

/**
 * 让行：玩家挡在行进方向正前方很近的地方 → 停下来，转向玩家，等一会儿。
 *
 * ★ 这是**任务系统上线后第一个真正"以前放不下"的行为**。
 *   改造之前，`_updPed` 里只有一个"侧推"（玩家进到 0.85m 内就把行人往旁边挤），
 *   它的观感是**磁铁排斥** —— 行人被一只无形的手推开，而且他"并不知情"。
 *   现在这件事有了明确归属：EVENT_TEMP 槽。行人会**停下来、转过来看着你**，
 *   玩家走开或超时就自动退出，主任务（走路）从被打断的那一帧接着跑。
 */
export class YieldTask extends Task {
  constructor(seconds) { super('yield'); this.t = seconds; }
  start(a) { a.phase = 0; }
  tick(a, dt, sys) {
    const o = a.obj;
    this.t -= dt;
    const pp = sys._playerPos;
    if (pp) {
      /* 面向玩家但**不位移** —— 让"他知道你在这儿"这件事可见。
         不位移是刻意的：让行不是逃跑，逃跑是另一个任务（EVENT_LONG）。 */
      o.rotation.y = Math.atan2(pp.x - o.position.x, pp.z - o.position.z);
      /* 玩家走开 > 2.2m 就提前结束，不必把剩下的秒数站完。
         少了这条，行人会对着空气罚站完最后几秒，非常显眼。 */
      if (Math.hypot(pp.x - o.position.x, pp.z - o.position.z) > 2.2) return true;
    }
    sys._swing(o, 0, 0);
    o.position.y = 0;
    return this.t <= 0;
  }
}

/** 走到某点（到达或撞墙即结束）。`blocked` 会留给父任务判断"是到了还是走不过去"。 */
class GoToPointTask extends Task {
  constructor(x, z, speedMul, arriveR) {
    super('goto');
    this.x = x; this.z = z;
    this.speedMul = speedMul;
    this.arriveR = arriveR;
    this.blocked = false;
  }
  tick(a, dt, sys) {
    const o = a.obj;
    const dx = this.x - o.position.x, dz = this.z - o.position.z;
    const d = Math.hypot(dx, dz);
    if (d < this.arriveR) { sys._swing(o, 0, 0); o.position.y = 0; return true; }
    const sp = Math.min(a.speed * this.speedMul, 2.4);
    const r = sys._slide(o.position.x, o.position.z,
      o.position.x + (dx / d) * sp * dt, o.position.z + (dz / d) * sp * dt, KIND_R.ped);
    /* 走不过去（摊位 / 墙挡死）→ 报 blocked 结束，别原地顶着墙抖。 */
    if (r.hit) { this.blocked = true; return true; }
    o.position.x = r.x;
    o.position.z = r.z;
    o.rotation.y = Math.atan2(dx, dz);
    a.phase += dt * 7.4;
    sys._swing(o, a.phase, 0.5);
    o.position.y = Math.abs(Math.sin(a.phase)) * 0.02;
    return false;
  }
}

/** 站在某点、面朝某方向（挑东西 / 付钱）。 */
class StandTask extends Task {
  constructor(seconds, faceX, faceZ) {
    super('stand');
    this.t = seconds;
    this.faceX = faceX;
    this.faceZ = faceZ;
  }
  tick(a, dt, sys) {
    const o = a.obj;
    this.t -= dt;
    /* 面向摊主 —— 不转身的话就是"背对着摊子发呆"。 */
    o.rotation.y = Math.atan2(this.faceX - o.position.x, this.faceZ - o.position.z);
    sys._swing(o, 0, 0);
    o.position.y = 0;
    return this.t <= 0;
  }
}

/**
 * 逛店：走到摊位前 → 站住挑一会儿 → 结束。
 * ★ 这就是**改造前那个 `shopPhase: 'go' | 'hold' | 'done'` 字符串状态机**
 *   的正身。原来它用三个字符串常量表达两个阶段之间的迁移，
 *   迁移规则散在 `_updPed` 的四个 if 里；现在阶段是 `this.stage`（数字），
 *   迁移规则集中在 `nextSubTask()` 一处 —— 加一个阶段（比如"付钱"）
 *   只需要在这里加一个分支，不必再去 `_updPed` 里找散落的赋值点。
 */
export class ShopVisitTask extends ComplexTask {
  constructor(shop) { super('shop'); this.shop = shop; }
  nextSubTask(a, sys, finished) {
    void sys;
    if (this.stage === 0) {
      this.stage = 1;
      /* arriveR 1.05：锚点正前方已经预留了 `_frontOf` 的进深，
         所以"到跟前"比"到点上"宽一点，避免在摊位前反复微调位置。 */
      return new GoToPointTask(this.shop.x, this.shop.z, 1.3, 1.05);
    }
    if (this.stage === 1) {
      this.stage = 2;
      /* 走不过去 → 放弃这次。罚一个**较短**的冷却（8~22s）让它过会儿再试，
         而不是立刻又冲一次 —— 原来这里也是这么写的。 */
      if (finished && finished.blocked) {
        a.shopCd = 8 + Math.random() * 14;
        this.stage = 3;
        return null;
      }
      return new StandTask(2 + Math.random() * 3, this.shop.x, this.shop.z);
    }
    a.shopCd = 12 + Math.random() * 22;
    this.stage = 3;
    return null;
  }
}

/** 沿街来回走，偶尔停下来。行人本体的"日常"。永不完结（常驻主任务）。 */
class WanderWalkTask extends Task {
  constructor(lim, pauseT = 0) {
    super('wander');
    this.lim = lim;
    /* ★ 这三个计时器原本是角色上的裸字段，且靠 `undefined ? :` 懒初始化起步。
       搬进任务后**构造即赋值**，`undefined` 这条路径从根上不存在。 */
    this.pauseT = pauseT;
    this.turnCd = 0;
    this.pauseCd = 2 + Math.random() * 9;
  }
  tick(a, dt, sys) {
    const o = a.obj;
    const lim = this.lim;

    /* 顾客的"等下一次去摊位"是**冷却**，不是停顿 ——
       冷却期里照常沿街走（原来的写法让顾客在冷却期也站定，
       实测 17 人里只有 4 人在动，恒稳一眼就会看出"人都不走"）。 */
    if (a.shop) a.shopCd -= dt;

    /* 停顿：站着不动。这既是真实感，也让"人流"不至于像传送带。 */
    if (this.pauseT > 0) {
      this.pauseT -= dt;
      sys._swing(o, 0, 0);
      o.position.y = 0;
    } else {
      const x0 = o.position.x, z0 = o.position.z;
      /* 期望位移 = 沿街前进 + 让开玩家的侧推，然后**一次性**做滑动解算。
         分两次直接改 position 会让"让路"把角色推进墙里。 */
      let dx = 0, dz = a.dir * a.speed * dt;
      const pp = sys._playerPos;
      if (pp) {
        const px = x0 - pp.x, pz = z0 - pp.z;
        const pd = Math.hypot(px, pz);
        if (pd < 0.85 && pd > 1e-4) {
          const push = (0.85 - pd) / pd;
          dx += px * push * 0.6;
          dz += pz * push * 0.6;
        }
      }
      const r = sys._slide(x0, z0, x0 + dx, z0 + dz, KIND_R.ped);
      if (r.hit) {
        /* 撞墙 → 换方向。但必须带冷却：每帧都换会在墙前来回抖，
           比穿墙更难看（而且会让"行人是否在动"的断言假绿）。 */
        this.turnCd -= dt;
        if (this.turnCd <= 0) { a.dir *= -1; a.phase = 0; this.turnCd = 1.2; }
      } else {
        o.position.x = r.x;
        o.position.z = r.z;
      }
      a.phase += dt * (6.2 + a.speed);
      sys._swing(o, a.phase, 0.55);
      o.position.y = Math.abs(Math.sin(a.phase)) * 0.022;
      /* ★ 停顿必须"按时间"触发，绝不能"按帧"。
         原写法 `Math.random() < 0.004` 是**每帧**掷一次骰子，于是停顿频率
         直接绑定帧率：144fps 时每个行人每秒掷 144 次（触发率 0.58/s，
         配上平均 2.8 秒的停顿，稳态有约 60% 的行人是站着的），60fps 时只有 0.24/s。
         后果是**同一份代码在快机器上"半条街在站桩"、在慢机器上人流正常** ——
         行为随性能漂移，是最难复现的一类缺陷（实测两次跑出 11/17 与 0/17）。
         改成冷却计时器：平均每 ~13 秒考虑停一次，约 45% 会真的停 1.2~4.4 秒，
         整体"站立率"约 5%，与帧率彻底解耦。 */
      this.pauseCd -= dt;
      if (this.pauseCd <= 0) {
        this.pauseCd = 7 + Math.random() * 12;
        if (Math.random() < 0.45) this.pauseT = 1.2 + Math.random() * 3.2;
      }
    }

    /* 到街尾就折返（换边走：真实行人不会原地转身走同一条线）。 */
    if (o.position.z > lim || o.position.z < -lim) {
      a.dir *= -1;
      a.phase = 0;
    }
    /* 行走时面朝行进方向（+Z 是 0 弧度，因为模型脸部朝 +Z）。 */
    o.rotation.y = a.dir > 0 ? 0 : Math.PI;
    return false;
  }
}

/** 站立不动。DEFAULT 槽的内容：主任务缺席时顶上，保证"人不会变成木头"。 */
class StandStillTask extends Task {
  constructor() { super('standStill'); }
  tick(a, dt, sys) {
    sys._swing(a.obj, 0, 0);
    a.obj.position.y = 0;
    return false;   // 永不完结：兜底任务本就该一直兜着
  }
}

/**
 * 行人的常驻主任务（PRIMARY 槽）。
 *
 * ★ 它扮演的是 GTA 里的 **decision maker**：自己不直接动，
 *   而是每帧决定"现在该干什么"，然后把子任务挂上去。
 *   改造前这个决策是 `_updPed` 顶部那几个 if 的先后顺序，
 *   隐式且没有名字；现在它是一个有名字的对象，规则集中在一处。
 *   将来要加"回家""上班""避雨"，就是在这里多一个分支。
 */
class PedAmbientTask extends Task {
  constructor() {
    super('pedAmbient');
    this.sub = null;
    this.first = true;
  }
  tick(a, dt, sys) {
    /* 决策：冷却到点且当前不在逛店 → 切过去。
       这条原来是 `_updPed` 里的 `if (a.shopCd <= 0)`，且必须写在
       **走路逻辑之前**才能在同一帧生效；搬进任务后同样是"先决策、后执行"。 */
    if (a.shop && a.shopCd <= 0 && !(this.sub instanceof ShopVisitTask)) {
      if (this.sub) { this.sub.stop(a); this.sub = null; }
      this.sub = new ShopVisitTask(a.shop);
      this.sub.start(a);
    }
    if (!this.sub) {
      /* ★ 首次进街给一点随机初始停顿（原来是 `pauseT: rng()*1.6`）。
         不给的话，每次切地点进街都是"全体同时起步" —— 那一眼就是假的。
         之后的重建一律从 0 起步，停顿节奏交给任务自己的 pauseCd。 */
      const p0 = this.first ? a.entryPause : 0;
      this.first = false;
      this.sub = new WanderWalkTask(sys.world && sys.world.streetLen ? sys.world.streetLen / 2 : 48, p0);
      this.sub.start(a);
    }
    if (this.sub.tick(a, dt, sys)) { this.sub.stop(a); this.sub = null; }
    return false;   // 常驻主任务：永不完结
  }
  stop(a) { if (this.sub) { this.sub.stop(a); this.sub = null; } }
}

/* ══ 角色状态工厂 —— "字段没有统一入口"的解药 ═══════════════════════════════
   ★ 改造前的症状（本次审计）：`_updPed` 里有
       `a.turnCd = (a.turnCd === undefined ? 0 : a.turnCd) - dt`
       `a.pauseCd = (a.pauseCd === undefined ? 2 + Math.random()*9 : a.pauseCd) - dt`
     `_updVehicle` 里有 `a.cur = a.cur === undefined ? a.speed : a.cur`。
   `undefined ? :` 出现一次是权宜，出现三次就是**结构问题**：
   它意味着状态字段的初始化没有唯一入口，于是每加一个字段就有一次忘记的机会，
   而失败形态是**静默 NaN**（`undefined - dt` = NaN；NaN 的一切比较都是 false，
   于是那个分支再也不会走，也不会报任何错）。
   ★ 现在所有状态字段一律由下面的工厂产出，构造函数里全部赋好值。
     副作用：`a.moving` / `a.act` / `a.offX` / `a.offZ` 四个字段被删除 ——
     全库审计确认它们**只有写入、没有任何读取点**（见 verify-tasks 的断言）。
     死字段的真正代价不是内存，是**误导**：下一个人读到 `act: 'idle'`
     会以为它决定行为，于是改它、然后发现不生效。 */

/** 行人 / 顾客的状态。属于"身体 + 意图"的字段；计时器都在 Task 里。 */
function newPedState(obj, rng, dir, x, shopPt, shopKeeper) {
  return {
    kind: KIND.PED, obj,
    /* ── 身体 ── */
    speed: 0.75 + rng() * 0.85,
    dir,
    phase: rng() * Math.PI * 2,
    lane: x,
    /* ── 顾客意图 ── */
    shop: shopPt,
    shopKeeper,
    /* 下一次想去摊位还有多久。★ 它是**决策层**的冷却，不是走路任务的一部分，
       所以留在角色上（WanderWalkTask 只负责递减它）。 */
    shopCd: shopPt ? 2 + rng() * 8 : 0,
    /* 进街时的初始停顿（见 PedAmbientTask）。 */
    entryPause: rng() * 1.6,
    /* 让行事件的个人冷却（见 _pedEvents）—— 防止同一个人被反复触发。 */
    yieldCd: 0,
    /* 任务槽位，由 _push 统一安装。 */
    tasks: null,
  };
}

/** 摊主 / 命名 NPC 的状态。`stepT` 由调用方给（两族的节奏不同，见 _spawnKeepers）。 */
function newKeeperState(kind, obj, rng, home, rot, stepT, extra) {
  const s = {
    kind, obj,
    home: { x: home.x, z: home.z },
    rot: rot || 0,
    phase: rng() * Math.PI * 2,
    /* 小动作周期：在"整理货物"与"招呼客人"之间来回（见 _updKeeper）。 */
    actT: rng() * 6,
    /* 岗位 / 搬货之间的切换计时。 */
    stepT,
    target: null,
    tasks: null,
  };
  return extra ? Object.assign(s, extra) : s;
}

/** 车辆状态。★ `cur` 不再是懒初始化 —— 工厂里就给 `speed`，
 *  与原行为一致（车一出场就在行驶），但 `undefined` 那条路径消失了。 */
function newVehicleState(kind, obj, dir, lane, speed, len) {
  return {
    kind, obj,
    speed, dir, lane, len,
    cur: speed,
    braking: false,
    tasks: null,
  };
}

export class ActorSystem {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.group.name = 'actors';
    /* ★ 必须标 noMerge：虽然 actors 不挂在 world.group 下（所以 mergeStatics
       本来就碰不到它），但将来若有人把它挪进去，这个标记能兜住。
       动态物体的几何一旦被合批烘焙，就再也动不了了。 */
    this.group.userData.noMerge = true;
    scene.add(this.group);
    this.actors = [];
    this.world = null;
    this._byKind = {};
    /* 碰撞盒与行为锚点：由 setWorld 填充。放在构造里给出空数组，
       是为了让"没走 setWorld 就 update"的路径不会炸（预览页会这样）。 */
    this.colliders = [];
    this.anchors = [];
    /* 命名 NPC 相关（见 _spawnNamed / setNamedNpcs）。构造里就给空值，
       理由同上面两条：让"没走 setWorld 就 update"的路径不会炸（预览页会这样）。 */
    this._reservedAnchors = [];
    this._namedIds = [];
    this._keeperRng = null;
    this.pedBand = null;
    /* 一帧内所有角色共用的碰撞盒查询缓存。
       为什么需要：行人/车辆每帧各查一次碰撞盒，17 人 + 3 车 = 20 次 × 全部盒；
       而查询是**纯空间**的（与角色自身状态无关），
       按"格"缓存一次即可让整条街共用。见 _nearColliders。 */
    this._grid = null;
    this._cell = 8;
    /* 玩家位置（每帧由 update 写入）。任务对象通过 `sys._playerPos` 读它 ——
       构造里先给 null，让"没走 setWorld 就 update"的路径不会读到 undefined。 */
    this._playerPos = null;
    /* 出生解算与阴影 LOD 的运行态（见 _resolveSpawn / update 末尾）。
       两个计数必须暴露出去：**"推出去了几个"与"推不动卡住了几个"是两件事** ——
       前者是正常工作，后者是布局有问题。只报一个数会把后者藏起来。
       ★ 这两个数**跨地点累积、不随 clear() 清零**：地点 A 卡住的那个不能
       被地点 B 的一次干净重建抹掉 —— 抹掉就等于把问题"刷新"没了。 */
    this.pushedSpawns = 0;
    this.stuckSpawns = 0;
    this._lodT = 0;
    /* 阴影 LOD 每轮评估后的开/关人数（供验证脚本确认 LOD 真的在取舍，
       而不是"距离算错了导致全员恒开/恒关"）。 */
    this.shadowOnCount = 0;
    this.shadowOffCount = 0;
    this.shadowTotal = 0;
    /* LOD 总开关。生产恒为 true；验证脚本用它量"有/无 LOD"的 draw call
       差值（见 bridge.__setShadowLod），把"优化了多少"变成一个可复现的数。 */
    this.shadowLod = true;
  }

  /**
   * 按地点配置重建全部角色。
   * @param {object} w { id, layout, streetLen, roadW, laneHalf, tier,
   *                     colliders, footfall, anchors }
   */
  setWorld(w) {
    this.clear();
    this.world = w;
    if (!w) return;
    geomInit(); matInit();

    const rng = mulberry32(hashSeed(String(w.id || 'x') + '|' + (w.layout || '')));
    const S = w.streetLen || 96;
    const roadW = w.roadW || 9.5;
    const half = w.laneHalf || roadW / 2;
    const tier = w.tier || 1;
    /* footfall（人流指数，来自 locations.js）直接决定密度 ——
       这是"地点内容驱动 3D"的又一处：闹市人多，废地没人。 */
    const foot = typeof w.footfall === 'number' ? w.footfall : 0.6;

    /* ★ 碰撞盒：行人/车辆必须**真的用**它。
       2026-09-19 恒稳反馈「人物、车辆可以直接穿墙而过」——
       根因就是这个数组传进来了却一次都没被读过（只在 JSDoc 里出现过），
       全场景只有玩家在避墙。见 _slideX / _slideZ。 */
    this.colliders = Array.isArray(w.colliders) ? w.colliders : [];
    /* 行为锚点（摊主站位 / 店铺门口）。见 world.js::Ctx.anchor。 */
    this.anchors = Array.isArray(w.anchors) ? w.anchors : [];
    this.pedBand = this._pedBandX(roadW, half);
    /* 匿名摊主的外观种子留一份：时段切换时命名 NPC 名单会变、"被占锚点"集合
       随之变，摊主要重排（见 setNamedNpcs）。留着同一个种子，重排后
       **同一个人还是同一张脸**，只是站位可能挪一格。 */
    this._keeperRng = rng;

    /* ★ 命名 NPC 必须比匿名摊主**先**落位：两者共用同一套锚点，
       不预留就会出现两个人形重叠站在一起（肉眼看到的是"四只手的怪物"）。
       见 _reserveAnchors / _keepersAnchors。 */
    this._reservedAnchors = this._reserveAnchors(Array.isArray(w.npcs) ? w.npcs.length : 0);
    this._spawnNamed(rng, S, half, w.npcs);

    /* 行人里有一部分不是"过路人"，而是**摊主/店主** —— 钉在锚点上，
       有自己的小动作（招呼、整理货物）。剩下的是顾客与过路人。 */
    this._spawnKeepers(rng, S, half);

    /* 人流：巷弄窄就少些，大道/广场多些。上限压住性能。 */
    const pedCount = Math.max(2, Math.min(22, Math.round(6 + foot * 18 + (tier - 1) * 2)));
    for (let i = 0; i < pedCount; i++) this._spawnPed(rng, S, roadW, half);

    /* 车流：只有在"有路"的布局才有。巷弄窄，给 1-2 辆；大道给到 6 辆。 */
    if (w.layout === 'avenue' || w.layout === 'lane' || w.layout === 'plaza') {
      const carCount = w.layout === 'lane' ? 2 : Math.min(7, 3 + tier);
      /* ★ 前两辆强制一正一反：只要路上有 ≥2 辆车，就必须两个方向都有。
         这条不是"锦上添花"——靠右行驶的视觉说服力全靠双向对开，
         单向车流会让整条街显得像模型摆件。 */
      for (let i = 0; i < carCount; i++) {
        this._spawnCar(rng, S, roadW, i === 0 ? 1 : (i === 1 ? -1 : undefined));
      }
      if (w.layout === 'avenue' && rng() < 0.75) this._spawnBike(rng, S, roadW);
    }

    /* 动物：不是每个地点都该有狗。城中村/院区/厂区有看门狗，
       广场/商业街有遛狗的，广场/公园边缘有猫与鸟。 */
    const hasDogs = (w.layout === 'compound' || w.layout === 'yard' || w.layout === 'lane');
    if (hasDogs && rng() < 0.8) {
      const n = 1 + ((rng() * 2) | 0);
      for (let i = 0; i < n; i++) this._spawnDog(rng, S, half);
    }
    const hasCats = (w.layout === 'lane' || w.layout === 'compound' || w.layout === 'yard');
    if (hasCats && rng() < 0.75) {
      const n = 1 + ((rng() * 2) | 0);
      for (let i = 0; i < n; i++) this._spawnCat(rng, S, half);
    }
    { const n = 3 + ((rng() * 4) | 0); for (let i = 0; i < n; i++) this._spawnBird(rng, S, half); }
    /* 昆虫：只在"脏"的地方成群 —— 巷弄/厂区/市场。
       广场/商业街给 0 群，否则会出现"高档商圈一堆苍蝇"的荒谬画面。 */
    const dirty = (w.layout === 'lane' || w.layout === 'yard');
    if (dirty) {
      const swarms = 1 + ((rng() * 2) | 0);
      for (let i = 0; i < swarms; i++) this._spawnSwarm(rng, S, half);
    }
  }

  /* 人行道带：avenue 有真正的人行道（roadW/2 之外），
     lane 没有独立人行道，人就贴路边走。这是"逻辑要对"的一部分 ——
     行人走车道中央是明显的失真。
     ★ [2026-09-19 修正，恒稳反馈「穿墙」] 原公式是
         inner = roadW/2 + 0.35,  outer = max(roadW/2 + 0.6, min(outer, half - 0.5))
       在 lane（half == roadW/2）下会退化成 [roadW/2+0.35, roadW/2+0.35]
       —— 一条**钉死在路沿外**的线，而建筑近面在 half+0.05~0.6。
       即：行人出生点就在楼里，且被夹在楼与路沿之间的缝里走。
       现在把外沿**收进路面内侧**：巷弄行人在 laneHalf-0.45 ~ laneHalf-0.1
       （贴边但仍在路上），大道行人在人行道中段。 */
  _pedBandX(roadW, half) {
    /* ★ 公式已收进 road.js（唯一真源）。这里只负责**把 layout 名传对**：
       road.js 用 layout 名判布局，不拿 half 与 roadW/2 比大小 ——
       实测（2026-09-19）那条浮点比较会判错，导致 17 个行人全被放到
       |x|≈4.75~4.93 的路沿上（正是"人贴着墙走/穿墙"的观感来源）。 */
    const lay = (this.world && this.world.layout) || 'lane';
    return pedBandX(lay, roadW, half);
  }

  _spawnPed(rng, S, roadW, half) {
    const band = this.pedBand || this._pedBandX(roadW, half);
    const side = rng() < 0.5 ? -1 : 1;
    const x = side * (band.inner + rng() * (band.outer - band.inner));
    const dir = rng() < 0.5 ? 1 : -1;
    const obj = buildHuman(rng, 0.94 + rng() * 0.12);
    obj.position.set(x, 0, -S / 2 + rng() * S);
    /* 一部分行人是**顾客**：走一段后停在某个摊位前，再继续走。
       这是"人在路上不只是走"的一半（另一半是摊主，见 _spawnKeepers）。 */
    const shopAnchor = rng() < 0.34 ? this._pickAnchor(rng) : null;
    /* 顾客的落点是**摊位正前方**（anchor 是摊主的站位）——
       直接朝锚点走会一头撞进摊子里。 */
    const shopPt = shopAnchor ? this._frontOf(shopAnchor, shopAnchor.kind) : null;
    /* ★ 状态一律由工厂产出（见 newPedState 顶注）：
       没有任何字段是 `undefined`，也没有 `undefined ? :` 懒初始化。
       行人会停下来（看手机/等摊/聊天）——不停会像传送带，一眼假；
       初始停顿压在 ~1.6s（`entryPause`），否则每次切地点进街
       半条街的人是冻结的，第一眼看上去就是"雕塑"。 */
    this._push(newPedState(obj, rng, dir, x, shopPt, shopAnchor));
  }

  /** 随机取一个行为锚点（顾客要去的地方）。 */
  _pickAnchor(rng) {
    const a = this.anchors;
    if (!a || !a.length) return null;
    return a[(rng() * a.length) | 0];
  }

  /* ── 摊主 / 店主 ─────────────────────────────────────────────────────────
     恒稳反馈原话：「人在路上就只是走吗？店铺或者摊位或者其他的人
     应该有对应的行动逻辑」。
     ★ 为什么单列一类而不是"让行人偶尔停一下"：
       摊主与过路人的区别不在**移动方式**，而在**他属于某个位置**。
       摊主必须钉在摊位上、面朝街心，动作是"整理货物/招呼客人"；
       过路人只是恰好经过。混成一类，摊位就永远没人管。
     ★ 数量上限 8：锚点可能很多（菜市场两侧成排），
       但每多一个摊主就多一份"站着不动的活物"的观感成本。 */
  /* ── 命名 NPC 的锚点预留 ────────────────────────────────────────────────
     命名 NPC 与匿名摊主共用 world.js 投放的同一套锚点，所以必须**先占后发**。
     两个都均匀取样、都用"位置 + 朝向"钉死 —— 不预留就是两个人站在同一个点上。 */

  /** 从锚点里均匀挑 n 个留给命名 NPC。
   *  ★ 均匀取样而非随机：随机会让 9 个 NPC 全挤在街的一头，
   *    另一头明明是商业区主街却空无一人，那比"没有人"更假。 */
  _reserveAnchors(n) {
    const list = this.anchors;
    if (!list || !list.length || !(n > 0)) return [];
    const take = Math.min(n, list.length);
    const out = [];
    for (let i = 0; i < take; i++) {
      out.push(list[Math.floor((i + 0.5) * list.length / take) % list.length]);
    }
    return out;
  }

  /** 匿名摊主能用的锚点 = 全部 − 被命名 NPC 占掉的。 */
  _keepersAnchors() {
    const all = this.anchors;
    const res = this._reservedAnchors;
    if (!all || !res || !res.length) return all;
    const out = [];
    for (let i = 0; i < all.length; i++) {
      if (res.indexOf(all[i]) < 0) out.push(all[i]);
    }
    return out;
  }

  _spawnKeepers(rng, S, half) {
    const list = this._keepersAnchors();
    if (!list || !list.length) return;
    const n = Math.min(8, list.length);
    /* 均匀取样而不是随机取：随机取会让 8 个摊主全挤在街的一头，
       另一头空荡荡 —— 那比"没有人"更假。 */
    for (let i = 0; i < n; i++) {
      const a = list[Math.floor((i + 0.5) * list.length / n) % list.length];
      const obj = buildHuman(rng, 0.95 + rng() * 0.1);
      obj.position.set(a.x, 0, a.z);
      /* 面朝街心：锚点的 rot 就是朝向（由 world.js 给出）。 */
      obj.rotation.y = a.rot || 0;
      /* ★ 状态由工厂产出。原来这里挂着 `act: 'idle'` 与 `offX / offZ`
         三个字段 —— 全库审计确认它们**只有写入、没有任何读取点**，
         本次一并删除（见 newPedState 顶注里关于"死字段的真正代价"那段）。 */
      this._push(newKeeperState(
        KIND.KEEPER, obj, rng, a, a.rot,
        /* 偶尔走开一两米搬货，然后回来 —— 完全钉死会像蜡像。 */
        6 + rng() * 12,
      ));
    }
  }

  /* ── 命名 NPC ───────────────────────────────────────────────────────────
     ★ 这一族的由来（2026-09-19）：
       项目里 `data/npcs.js` 的 20 个 NPC **本来就带 schedule**
       （morning/afternoon/evening → 地点 key），`core/npc_location_bridge.js`
       也早就实现了解算函数 `getNpcCurrentLocation()`。
       但它全库**只有一个消费点** —— `ui/social_tab.js:240` 的一个"🚶 拜访"按钮。
       也就是说：玩家在 3D 街上走了几十次，**从来遇不到自己认识了 30 天的人**。
       两条链一直都在，只是没接线。这不是"缺内容"，是"内容被埋"。
     ★ 与匿名摊主**复用同一段行为**（_updKeeper）：区别不在"怎么动"，
       而在"他是谁" —— 固定外观 + 头顶名字 + 固定岗位。 */

  _spawnNamed(rng, S, half, list) {
    this._namedIds = [];
    const defs = Array.isArray(list) ? list : [];
    if (!defs.length) return;
    void rng;   // 命名 NPC 一律不吃场景 rng（理由见下面的 nrng）
    void half;
    const slots = this._reservedAnchors || [];

    for (let i = 0; i < defs.length; i++) {
      const def = defs[i];
      if (!def || !def.id) continue;
      const a = slots[i] || this._fallbackSpot(i, defs.length, S);

      /* ★★ 外观必须由 npcId 决定，**绝不能吃场景 rng**：
         吃 rng 的话，同一个王大婶今天进巷子是短发红衣、明天是长发蓝衣 ——
         那就把"这是同一个人"这件事整个抹掉了，
         而"持久的、独特的个体"正是这套系统存在的唯一理由。
         mulberry32(hashSeed(id)) 让外观跨地点、跨时段、跨会话稳定复现。 */
      const nrng = mulberry32(hashSeed('npc|' + def.id));
      const obj = buildHuman(nrng, 0.97 + nrng() * 0.08);
      obj.position.set(a.x, 0, a.z);
      obj.rotation.y = a.rot || 0;
      /* ★ 与 __actorKind 并列的第二个标记：验证脚本要能断言
         "此刻街上站着的是哪几个人"，只数个数是不够的。 */
      obj.userData.__actorId = def.id;

      /* 人形约 1.72m。名字条挂 1.93m：低于 1.75 会压住脸，
         高于 2.1 会和头顶拉开一段"飘在空中"的距离。 */
      const label = nameSprite(def.name || def.id);
      label.position.set(0, 1.93, 0);
      obj.add(label);

      /* 行为状态与 _spawnKeepers 完全同构 —— 于是 _updKeeper 可以直接驱动它。
         种子用 nrng 而不是 rng：让"谁站在哪、做小动作的节奏"也稳定下来。
         ★ npcId / npcName 作为 extra 合并进去：它们是"他是谁"，
           摊主没有，所以不进工厂的固定字段表。 */
      this._push(newKeeperState(
        KIND.NAMED, obj, nrng, a, a.rot,
        8 + nrng() * 14,
        { npcId: def.id, npcName: def.name || def.id },
      ));
      this._namedIds.push(def.id);
    }
  }

  /** 锚点不够用时的兜底站位：沿人行带等距排开，面朝街心。
   *  world.js 正常情况下每个建筑都会给锚点，这里是"地点数据缺失"时的安全网。 */
  _fallbackSpot(i, n, S) {
    const band = this.pedBand || { inner: 2.6, outer: 3.6 };
    const x = (band.inner + band.outer) / 2;
    const z = -S / 2 + (S * (i + 1)) / (n + 1);
    /* rot = -π/2 → 局部 +Z 映射到 -X（朝街心）。约定见文件头与 _frontOf。 */
    return { x, z, rot: -Math.PI / 2 };
  }

  /**
   * 只换命名 NPC，**不重建街道**。
   *
   * ★ 为什么必须单列一个方法，而不是再走一次 setWorld()：
   *   `state.player.timeSlot` 是**白天实时变化**的 —— `main.js:5498-5500`
   *   随行动力消耗在 morning→afternoon→evening 之间切换，而 NPC 名单跟着时段走。
   *   若走 setWorld()，玩家会亲眼看到整条街的行人、车流、猫狗在眼前全部重置 ——
   *   人物瞬移、车流归零，那一眼就是 bug，比"没有命名 NPC"更伤。
   *
   * @param {Array<{id:string,name:string}>} list 当前时段、当前地点的 NPC
   * @returns {number} 实际生效的 NPC 数（0 表示名单没变或场景未就绪）
   */
  setNamedNpcs(list) {
    if (!this.world) return 0;
    const next = Array.isArray(list) ? list : [];
    const nextIds = [];
    for (let i = 0; i < next.length; i++) {
      if (next[i] && next[i].id) nextIds.push(next[i].id);
    }
    /* 名单没变就什么都不做 —— refresh() 每次状态变更都会被调用，非常频繁
       （一次玩家操作内部可能连着 update 十几个字段）。 */
    if (nextIds.join('|') === (this._namedIds || []).join('|')) return 0;

    this._dropKind(KIND.NAMED);
    /* ★ 只摘引用，**绝不 dispose** —— 几何/材质/名字贴图全是模块级共享资源，
       一 dispose，下次进这个地点就是黑框或空白人形。见 nameAsset 顶注。 */
    this._namedIds = [];

    const S = this.world.streetLen || 96;
    const roadW = this.world.roadW || 9.5;
    const half = this.world.laneHalf || roadW / 2;
    this._reservedAnchors = this._reserveAnchors(nextIds.length);
    /* 被占锚点变了 → 匿名摊主让位。代价是摊主会重新落位（外观由
       _keeperRng 同种子重放，所以**还是那几张脸**，只是可能挪一格）。
       这是可接受的：时段切换本来就意味着"过了小半天"，街上的人换了一批。 */
    this._respawnKeepers();
    this._spawnNamed(null, S, half, next);
    return nextIds.length;
  }

  /** 摘掉某一类角色（只摘引用，不碰共享资源）。 */
  _dropKind(kind) {
    for (let i = this.actors.length - 1; i >= 0; i--) {
      if (this.actors[i].kind !== kind) continue;
      this.group.remove(this.actors[i].obj);
      this.actors.splice(i, 1);
    }
    if (this._byKind[kind]) delete this._byKind[kind];
  }

  _respawnKeepers() {
    this._dropKind(KIND.KEEPER);
    if (!this.world) return;
    this._spawnKeepers(
      /* 没有 _keeperRng（构造后没走过 setWorld 的异常路径）时兜个临时种子，
         而不是让它抛出 —— 这里失败应当只影响观感，不该让整帧 update 挂掉。 */
      this._keeperRng || mulberry32(hashSeed(String(this.world.id || 'x'))),
      this.world.streetLen || 96,
      this.world.laneHalf || 4.75,
    );
  }

  _spawnCar(rng, S, roadW, forceDir) {
    /* forceDir 用于"必须保证双向都有车"的场合（见 setWorld）。
       否则全交给随机种子，会出现**整条街车流同向**的画面 —— 那看上去就是单行道，
       而且它只在部分地点出现（换个种子就正常），属于最难被发现的那类缺陷。 */
    const dir = forceDir !== undefined ? forceDir : (rng() < 0.5 ? 1 : -1);
    /* ★ 靠右：+Z 走 -X 半道，-Z 走 +X 半道（见文件头推导）。 */
    const lane = (dir > 0 ? -1 : 1) * this._carLane(roadW, this.world.laneHalf || roadW / 2);
    const obj = buildCar(rng);
    obj.position.set(lane, 0, -S / 2 + rng() * S);
    obj.rotation.y = dir > 0 ? 0 : Math.PI;
    this._push(newVehicleState(
      KIND.CAR, obj, dir, lane,
      (2.6 + rng() * 2.2) * (0.8 + (this.world.tier || 1) * 0.12),
      4.05,
    ));
  }

  /* 车道中心 / 非机动车道中心。公式已收进 road.js（唯一真源）——
     原因见该文件顶注：这里原来与 world.js 各写一份，结果垃圾桶被撒到
     车道中央把车拦死。这两处**必须**是同一个公式，不能"看起来一样"。 */
  _carLane(roadW, half) { return carLane(roadW, half); }
  _bikeLane(roadW, half) { return bikeLane(roadW, half); }

  _spawnBike(rng, S, roadW) {
    const dir = rng() < 0.5 ? 1 : -1;
    const lane = (dir > 0 ? -1 : 1) * this._bikeLane(roadW, this.world.laneHalf || roadW / 2);
    const obj = buildBike(rng);
    obj.position.set(lane, 0, -S / 2 + rng() * S);
    obj.rotation.y = dir > 0 ? 0 : Math.PI;
    this._push(newVehicleState(KIND.BIKE, obj, dir, lane, 3.4 + rng() * 2.4, 1.5));
  }

  _spawnDog(rng, S, half) {
    const obj = buildDog(rng);
    const band = this.pedBand || this._pedBandX(this.world.roadW || 9.5, half);
    const x = (rng() < 0.5 ? -1 : 1) * (band.outer - rng() * 0.8);
    const z = -S / 2 + rng() * S;
    obj.position.set(x, 0, z);
    this._push({
      kind: KIND.DOG, obj, speed: 1.15 + rng() * 0.7,
      home: { x, z }, wander: { x, z }, retarget: 0, phase: rng() * 6,
      /* 狗会沿一个方向嗅着走一段再换向 —— 匀速直线是"机器狗"。 */
      sniffT: 0,
    });
  }

  _spawnCat(rng, S, half) {
    const obj = buildCat(rng);
    const band = this.pedBand || this._pedBandX(this.world.roadW || 9.5, half);
    const x = (rng() < 0.5 ? -1 : 1) * (band.outer - rng() * 0.9);
    const z = -S / 2 + rng() * S;
    obj.position.set(x, 0, z);
    this._push({
      kind: KIND.CAT, obj, speed: 0.6 + rng() * 0.5,
      home: { x, z }, wander: { x, z }, retarget: 0, phase: rng() * 6,
      idleT: rng() * 5,
    });
  }

  _spawnBird(rng, S, half) {
    const obj = buildBird(rng);
    const cx = (rng() - 0.5) * half * 1.6;
    const cz = (rng() - 0.5) * S * 0.8;
    const h = 6 + rng() * 7;
    obj.position.set(cx, h, cz);
    this._push({
      kind: KIND.BIRD, obj,
      cx, cz, h, r: 3.5 + rng() * 5,
      ang: rng() * Math.PI * 2,
      angSpeed: 0.22 + rng() * 0.26,
      flap: rng() * 6,
      /* 鸟不是永远在飞：降落到地面啄食再起飞，否则像风筝。 */
      grounded: false, groundT: 0,
    });
  }

  _spawnSwarm(rng, S, half) {
    /* 一群飞虫 = 一个中心 + N 个绕飞个体。中心选在"脏"的位置（路边/角落）。 */
    const cx = (rng() < 0.5 ? -1 : 1) * (half * 0.35 + rng() * half * 0.4);
    const cz = -S / 2 + rng() * S;
    const n = 4 + ((rng() * 4) | 0);
    for (let i = 0; i < n; i++) {
      const obj = new THREE.Mesh(G.insect, M.insect);
      obj.position.set(cx, 0.7 + rng() * 0.8, cz);
      this._push({
        kind: KIND.INSECT, obj,
        cx, cz, r: 0.5 + rng() * 0.9,
        ang: rng() * Math.PI * 2,
        angSpeed: 1.6 + rng() * 2.4,
        bob: rng() * 6,
        /* 蚊子会靠近玩家 —— 这是它能被"感觉到"的唯一方式。 */
        chaser: rng() < 0.34,
      });
    }
  }

  _push(a) {
    /* ★ 把种类写到 userData 上。验证脚本与调试面板需要"按种类"统计
       （"车是否靠右""行人是否在动"），而从几何参数反推种类非常脆：
       three 的 CylinderGeometry 参数叫 radiusTop/radiusBottom，**没有 radius**，
       照 SphereGeometry 去取 radius 会永远数到 0 辆车 —— 一条静默永假的断言。
       一个字段换掉一整类误判，值得。 */
    a.obj.userData.__actorKind = a.kind;
    /* ★ 阴影 LOD 需要一份"哪些网格本来会投影"的名单（见 update 末尾）。
       在这里一次性收集：**所有角色都经过 _push**，改一处即全覆盖，
       不必在 buildHuman / 车辆工厂 / 动物里各写一遍（那种写法必然会漏一种）。 */
    const sp = [];
    a.obj.traverse((o) => { if (o.isMesh && o.castShadow) sp.push(o); });
    a.obj.userData.__shadowParts = sp;
    /* ★ `_shadowOn` 只对"有投影件"的角色有意义。鸟/虫在空中、没有投影件，
       把它们也记成"已关"会让 shadowOff 这个读数虚高 —— 而验证脚本正是
       靠"开着的和关着的都 > 0"来判断 LOD 真的在按距离取舍的。
       记成一个恒 false 的哑值 = 用噪声稀释信号。 */
    a._shadowOn = sp.length > 0;
    /* 落地类角色：出生点若落在碰撞盒里，先推到最近的可站位置再入场。 */
    const r = KIND_R[a.kind];
    if (r !== undefined) this._resolveSpawn(a.obj, r);

    /* ── 任务槽位 ──────────────────────────────────────────────────────────
       ★ 为什么装在这里而不是各个 `_spawnPed` 里：**所有角色都经过 _push**，
         改一处即全覆盖。写在各个 spawner 里的写法必然会漏一种，
         而漏了的后果是"那个角色一动不动" —— 不会报错，只会看起来像 bug。
       ★ 鸟 / 虫在空中飞，没有"任务"语义（它们没有可决策的行为），
         不给它们装槽位；`_pumpTasks` 对 `tasks === null` 直接返回 false。 */
    if (a.kind === KIND.PED) {
      a.tasks = new Array(TASK_SLOT_COUNT).fill(null);
      a.tasks[TASK_SLOT.PRIMARY] = new PedAmbientTask();
      a.tasks[TASK_SLOT.PRIMARY].start(a);
      /* DEFAULT 槽放"站立不动"。按定义它**永远不该被执行**（主任务是常驻的），
         放着是为了让槽位表完整：将来若有人把 PRIMARY 清空
         （"这个人今天不上街"之类），站定行为立刻就在，不必临时想一个兜底。 */
      a.tasks[TASK_SLOT.DEFAULT] = new StandStillTask();
    }

    this.actors.push(a);
    (this._byKind[a.kind] || (this._byKind[a.kind] = [])).push(a);
    this.group.add(a.obj);
  }

  /* ── 出生即解算：把"出生点就在碰撞盒里"这件事从根上掐掉 ──────────────────
     ★ 2026-09-19 实测的穿模第三类（前两类见 _slideX / _slideZ 的注释）：
       分轴滑动只保证"不**走**进墙里"，解不了"一出生就在墙里" ——
       出生即在盒内的角色，滑动逻辑永远不会把它推出来（它每帧只做增量判断）。
       实测踩到的三个，都不是"理论可能"：
         · 摊主：锚点按断面表"摊位进深 1.35m"算的偏移 0.95m，
           而 AI 摊位（菜摊/大排档）实测进深 ~2.9m → 摊主站在摊子里；
         · 行人：落在街边的棚/台子盒里；
         · 车：落在消防栓一类小盒里。
       而且此前**没有任何断言能发现它们** —— 穿模守卫因碰撞盒读数为空而静默失效。
     ★ 为什么放在 _push 里：所有角色都从这里入场，改一处即全覆盖。
     ★ 为什么取"最近的可站位置"而不是朝固定方向推：
       锚点与车道位置是**有设计意图**的（摊主要在摊子后、车要在车道里），
       固定方向会把它们推成另一副样子；最小位移对意图的破坏最小。 */
  _resolveSpawn(obj, r, maxPush = 1.8) {
    const x0 = obj.position.x, z0 = obj.position.z;
    if (!this._blocked(x0, z0, r)) return false;
    const sx = Math.sign(x0) || 1;
    /* ★★ 同侧约束：推出方向**不得越过街心线**。
       为什么必须有：车辆的行进逻辑（`_updVehicle`）**只改 z、不改 x** ——
       所以车一旦被推过 x=0，它就会以"逆行"的姿态一直开下去，
       而且没有任何东西会把它纠正回来。实测（verify-actors ④）：
       加了无约束的解算之后，`靠右行驶` 这条从 0 变红成 1 辆。
       对行人与摊主同理：跨过街心等于换了一条人行道，破坏的是摆位意图。
       ★ 宁可判"推不动"（stuckSpawns +1，让验证脚本红着报出来），
       也不要把人/车挪到街对面去换一个漂亮的绿 —— 那是掩盖。 */
    const keepSide = x0 !== 0;
    /* 同距离下按此顺序取：先朝街心（街心一定是空的），再沿街前后，
       再朝建筑侧，最后四角 —— 等距候选靠这个顺序表达偏好。 */
    const DIRS = [
      [-sx, 0], [0, -1], [0, 1], [sx, 0],
      [-sx, -1], [-sx, 1], [sx, -1], [sx, 1],
    ];
    const cands = [];
    for (let d = 0.1; d <= maxPush + 1e-6; d += 0.1) {
      for (const [ux, uz] of DIRS) {
        const L = Math.hypot(ux, uz);
        cands.push({ d, x: x0 + (ux / L) * d, z: z0 + (uz / L) * d });
      }
    }
    /* ★ 判的是**终点**是否干净，而不是"这一步往哪走"。
       否则两个盒夹着一条窄缝时会 A→B→A 来回弹（每帧换一个盒站着）。
       ★ 复用既有的 `_blocked`（走分格缓存），**不另写一份盒判定** ——
         两份判定迟早分叉，而"哪份才算数"不会有任何报错。 */
    cands.sort((a, b) => a.d - b.d);
    for (const c of cands) {
      if (keepSide && c.x * x0 <= 0) continue;   /* 不许越过（或落在）街心线 */
      if (!this._blocked(c.x, c.z, r)) {
        obj.position.x = c.x;
        obj.position.z = c.z;
        this.pushedSpawns++;
        return true;
      }
    }
    /* 推不动就**保持原样**并单独计数 —— 宁可让验证脚本红着报出来，
       也不要把角色甩到街对面去换"全绿"（那是掩盖，不是修复）。 */
    this.stuckSpawns++;
    return false;
  }

  /* ── 碰撞：把"穿墙"这件事从根上掐掉 ────────────────────────────────────
     ★ 2026-09-19 恒稳反馈「人物、车辆可以直接穿墙而过」。
     根因：colliders 从 bridge.js 一路传进来，但**从没被读过一次**
     （本文件里它原先只出现在 setWorld 的 JSDoc 里）——
     整个场景只有玩家在避墙，NPC 与车是自由穿行的。
     为什么不能只加一句"撞到就停"：那样角色会贴着墙抖动或者卡死。
     正确做法是**分轴滑动**（先解 x 再解 z），撞上墙时沿墙滑过去 ——
     这是所有 3D 游戏里最基础的碰撞响应，观感自然且不会卡住。 */

  /* 按"格"缓存附近的碰撞盒。cell=8m：建筑普遍 7~10m 宽，
     一个 8m 的格子正好让"落点附近要查的盒"落在 1~2 格里。 */
  _gridOf() {
    if (this._grid) return this._grid;
    const cell = this._cell;
    const g = new Map();
    for (const c of this.colliders) {
      /* 一个盒可能横跨多格 → 逐格登记（否则大盒只在它起点那格里被查到）。 */
      const i0 = Math.floor(c.minX / cell), i1 = Math.floor(c.maxX / cell);
      const j0 = Math.floor(c.minZ / cell), j1 = Math.floor(c.maxZ / cell);
      /* 上限保护：异常大的盒（有人误把整块地面登记成碰撞盒）会让
         格数爆炸。真实建筑不会横跨 20 格以上。 */
      if ((i1 - i0) > 20 || (j1 - j0) > 20) continue;
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const k = i + ',' + j;
          let arr = g.get(k);
          if (!arr) { arr = []; g.set(k, arr); }
          arr.push(c);
        }
      }
    }
    this._grid = g;
    return g;
  }

  _nearColliders(x, z) {
    const cell = this._cell;
    const i = Math.floor(x / cell), j = Math.floor(z / cell);
    const g = this._gridOf();
    /* 查 3×3 格：只查自己那格会漏掉"脚已经伸进邻格盒里"的情况。 */
    let out = null;
    for (let di = -1; di <= 1; di++) {
      for (let dj = -1; dj <= 1; dj++) {
        const arr = g.get((i + di) + ',' + (j + dj));
        if (arr) out = out ? out.concat(arr) : arr;
      }
    }
    return out;
  }

  /** 点是否落在某个碰撞盒内（带外扩半径 r）。 */
  _blocked(x, z, r) {
    const near = this._nearColliders(x, z);
    if (!near) return false;
    for (let i = 0; i < near.length; i++) {
      const c = near[i];
      if (x > c.minX - r && x < c.maxX + r && z > c.minZ - r && z < c.maxZ + r) return true;
    }
    return false;
  }

  /**
   * 分轴滑动：把角色从 (x0,z0) 推到 (x1,z1)，遇墙沿墙滑。
   * @returns {{x:number, z:number, hit:boolean}}
   *
   * ★ 为什么先解 x 再解 z、而不是"算出法线再推回去"：
   *   轴对齐的盒子（本项目的碰撞盒全是 AABB）用分轴解算最省，
   *   且天然产生"沿墙滑"—— 斜着撞墙时会保留切向分量，
   *   不会像法线反弹那样出现抖动或原地打转。
   */
  _slide(x0, z0, x1, z1, r) {
    let x = x1, z = z0, hit = false;
    if (this._blocked(x, z, r)) { x = x0; hit = true; }
    if (this._blocked(x, z1, r)) { z = z0; hit = true; } else { z = z1; }
    return { x, z, hit };
  }

  /** 每帧推进 ────────────────────────────────────────────────────────────
     参数：dt 秒；playerPos 用于"车辆避让玩家""蚊子追人"。 */
  update(dt, playerPos) {
    if (!this.world) return;
    /* ★ dt 双侧夹取（2026-09-19）。
       本文件里几乎全是**累加型**计时器：pauseT / pauseCd / yieldCd / shopCd /
       turnCd / retarget / actT / stepT / _lodT。一个负 dt 就能把它们一次性
       推进十几秒之后 —— 症状是"整条街的人进街后十几秒一动不动"，
       而且不报错、不崩，只能靠跟踪计时器才能发现（见 bridge.js 主循环的注释）。
       调用方已经夹过一次；这里再夹一次是**刻意冗余**：
       这条不变量被破坏时的代价太高，而反查它的路径太长。 */
    if (!(dt > 0)) return;
    if (dt > 0.05) dt = 0.05;
    /* ★ 玩家位置存到实例上：任务对象要读它（让行 / 侧推），
       而把 `playerPos` 一路当参数传下去会让每个 Task 的签名都拖着它。
       每帧只写一次，任务里读 `sys._playerPos` —— 零分配。 */
    this._playerPos = playerPos || null;
    /* 碰撞格缓存每帧重建一次（角色会动，但它们的位置变化不会
       改变"哪里有墙"，所以其实可以只在 setWorld 时建；
       重建的成本是遍历 colliders —— 地点切换才发生，故按帧清最省心）。 */
    this._grid = null;
    const S = this.world.streetLen || 96;
    const lim = S / 2;

    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i];
      switch (a.kind) {
        case KIND.PED: this._updPed(a, dt, lim, playerPos); break;
        /* ★ 命名 NPC 与匿名摊主**共用同一段行为** —— 见 _spawnNamed 顶注：
           区别不在"怎么动"，而在"他是谁"。所以这里不是复制一份，
           而是让两种 kind 落到同一个分支上。 */
        case KIND.KEEPER:
        case KIND.NAMED: this._updKeeper(a, dt, lim, playerPos); break;
        case KIND.CAR:
        case KIND.BIKE: this._updVehicle(a, dt, lim, playerPos); break;
        case KIND.DOG: this._updDog(a, dt, lim); break;
        case KIND.CAT: this._updCat(a, dt, lim); break;
        case KIND.BIRD: this._updBird(a, dt, lim); break;
        case KIND.INSECT: this._updInsect(a, dt, playerPos); break;
      }
    }

    /* ── 阴影 LOD ──────────────────────────────────────────────────────────
       ★ 实测（_diag-actors.cjs）：影子 pass 占 442 次 draw call 里的
         138~144，即 31%。而玩家视野半径远小于场景半径 —— 离得远的人，
         他的影子要么落在画面外、要么被近处物体挡掉，全开等于白送一次
         顶点变换。单个人形是 12 网格 / 6 投影，砍掉远处的收益是线性的。
       ★ 只在**阈值两侧**翻转，并留 0.5m 迟滞：没有迟滞的话，一个恰好站在
         16m 线上的角色会在每次评估时反复开关 —— 影子的出现/消失是肉眼
         可见的**闪烁**，而且每次评估都要重写一遍这 6~12 个网格的标志。
         迟滞把"边界上的犹豫"变成一次性决定。
       ★ 参考系取**玩家位置**而非摄像机朝向：视角可以原地转，"附近有谁"
         只随位置变化。也不按视锥裁剪 —— 本项目是等距/斜俯视，视锥覆盖
         范围远大于 16m，按视锥判等于不裁；距离是这里唯一有意义的门。 */
    this._lodT += dt;
    if (this.shadowLod && this._lodT >= SHADOW_LOD_EVERY) {
      this._lodT = 0;
      if (playerPos) {
        const px = playerPos.x, pz = playerPos.z;
        const rOut = SHADOW_LOD_R + 0.5, rIn = SHADOW_LOD_R - 0.5;
        const rOut2 = rOut * rOut, rIn2 = rIn * rIn;
        let on = 0, off = 0;
        for (let i = 0; i < this.actors.length; i++) {
          const a = this.actors[i];
          const sp = a.obj.userData.__shadowParts;
          if (!sp || !sp.length) continue;   /* 无投影件（鸟/虫）不参与记账 */
          const dx = a.obj.position.x - px, dz = a.obj.position.z - pz;
          const d2 = dx * dx + dz * dz;
          /* 已开的：跑出 R+0.5 才关；已关的：进到 R-0.5 才开。 */
          const want = a._shadowOn ? d2 <= rOut2 : d2 <= rIn2;
          if (want !== a._shadowOn) {
            a._shadowOn = want;
            for (let k = 0; k < sp.length; k++) sp[k].castShadow = want;
          }
          if (a._shadowOn) on++; else off++;
        }
        this.shadowTotal = on + off;
        this.shadowOnCount = on;
        this.shadowOffCount = off;
      }
    }
  }

  /** 四肢摆动（走路）。amp=0 即站定。 */
  _swing(o, phase, amp) {
    const L = o.userData.limbs;
    if (!L) return;
    L.legs[0].rotation.x = Math.sin(phase) * amp;
    L.legs[1].rotation.x = -Math.sin(phase) * amp;
    L.arms[0].rotation.x = -Math.sin(phase) * amp * 0.75;
    L.arms[1].rotation.x = Math.sin(phase) * amp * 0.75;
  }

  /** 锚点正前方 dist 米处（顾客该站的位置）。
   *  rot 是锚点朝向（由 world.js 给出，指向街心），局部 +Z 经 rotY 旋转后
   *  映射到世界 (sin(rot), cos(rot)) —— 与 o.rotation.y 的约定一致。 */
  _frontOf(anchor, dist) {
    /* ★ dist 必须是数字。传字符串会**静默**产出 NaN 坐标（见文件头 SHOP_FRONT 注释）。
       这里刻意不做"静默兜底成某个距离"——那会把类型错误伪装成正常行为；
       而是退回锚点自身（坐标合法、看得见）并留下**一次显式告警**，让问题可见。 */
    if (!Number.isFinite(dist)) {
      if (!this._warnedFrontOf) {
        this._warnedFrontOf = true;
        console.warn('[actors] _frontOf: dist 非有限数字，已退回锚点自身。value=', dist);
      }
      return { x: anchor.x, z: anchor.z };
    }
    const r = anchor.rot || 0;
    return { x: anchor.x + Math.sin(r) * dist, z: anchor.z + Math.cos(r) * dist };
  }

  /* ══ 任务推进与事件层 ══════════════════════════════════════════════════
     ★ 这两个方法是整套任务系统的"发动机"，读它们就能明白这次改造买到了什么：

         事件层 `_pedEvents`：**世界 → 角色**。把"外面发生了什么"
           翻译成"临时插进 EVENT_TEMP 槽的一个任务"。
         任务泵 `_pumpTasks`：**角色 → 世界**。只跑优先级最高的那个非空槽；
           低槽任务不执行、也不销毁 —— 它只是**暂停**。

     两者分开是刻意的。合在一起会变成"任务自己在 tick 里检查玩家位置"，
     那是把**输入埋进输出**，加第二个事件时必然打架。 */

  /**
   * 事件层：把世界状态翻译成临时任务。
   * ★ 目前只有一条规则（玩家挡在正前方 → 让行）。
   *   将来要加"被打招呼""看见熟人""下雨去屋檐下"，就在**这里**追加一个 if
   *   和一支任务 —— 不需要动任何已有行为。这正是这次改造要换来的东西。
   */
  _pedEvents(a, dt) {
    if (a.yieldCd > 0) a.yieldCd -= dt;
    const T = a.tasks;
    if (!T) return;
    /* 槽里已经有事件任务 → 不叠加。同一时刻只响应一件事，符合直觉，
       也避免"被两个事件各推一把"。
       ★ 这里**只写 EVENT_TEMP 槽**，PRIMARY 槽纹丝不动 ——
         这正是"打断"能够"恢复"的物理原因。 */
    if (T[TASK_SLOT.EVENT_TEMP]) return;
    if (a.yieldCd > 0) return;
    const pp = this._playerPos;
    if (!pp) return;
    const dx = pp.x - a.obj.position.x;
    const dz = pp.z - a.obj.position.z;
    const d = Math.hypot(dx, dz);
    /* 触发条件收得很紧，三条都必要：
       · 0.55 < d < 1.1 —— 太远不构成阻挡（让行会显得莫名其妙），
         太近已经和走路任务里那段侧推重叠（两个行为会互相拉扯）；
       · |dz| > |dx| —— 保证是"迎面"而不是"旁边路过"；
       · dz * a.dir > 0 —— 玩家在他的**前方**，不是背后。
       ★ 为什么要收紧：这条规则每帧对每个行人跑一次，放宽一点点就会变成
         "行人频繁原地发呆"，直接把 verify:actors 里"过半行人在走动"
         那条护栏打红。这是护栏该起作用的地方，不要为了让新功能显眼
         而把它调松。 */
    if (d <= 0.55 || d >= 1.1) return;
    if (Math.abs(dz) <= Math.abs(dx)) return;
    if (dz * a.dir <= 0) return;
    this.pushTask(a, TASK_SLOT.EVENT_TEMP, new YieldTask(0.9 + Math.random() * 1.0));
    /* 个人冷却：防止同一个人在玩家身边反复触发。
       没有它，一个站着不动的玩家会把周围的行人变成"一停一走的僵尸"。 */
    a.yieldCd = 5 + Math.random() * 5;
  }

  /**
   * 推进一个角色的任务栈。**整套改造的核心语义就在这几行里。**
   * @returns {boolean} 是否有任务被推进（false = 五个槽全空）
   *
   * ★ 只跑"优先级最高的那个非空槽"（槽号小的优先），而不是把五个槽都跑一遍：
   *   GTA 的 CTaskManager 也是这个语义。更重要的是，它保证了
   *   **高优先级独占位移** —— 不会出现两个任务在同一帧各改一次 position 打架。
   * ★ 低槽任务**不被销毁、只是不执行**。所以高槽任务一结束，
   *   主任务就从它被打断的那一帧接着跑，连计时器都是续上的。
   *   这是 if 链条根本给不了的东西，也是本次改造唯一的目的。
   */
  _pumpTasks(a, dt) {
    const T = a.tasks;
    if (!T) return false;
    for (let s = 0; s < TASK_SLOT_COUNT; s++) {
      const t = T[s];
      if (!t) continue;
      if (t.tick(a, dt, this)) { t.stop(a); T[s] = null; }
      return true;   /* ★ 一帧只跑最高的那个非空槽，跑完即止 */
    }
    return false;
  }

  /**
   * 往槽位放一个任务。
   * @param {number}  slot    TASK_SLOT 之一
   * @param {Task}    task
   * @param {boolean} replace 槽已非空时是否覆盖（默认 true）
   * @returns {boolean} 是否真的装进去了
   * ★ `replace = false` 是"只想确保有人在干这件事"的用法：
   *   "如果他没有更重要的事，就让他整理货物" —— 已经有任务时不打扰。
   * ★ 物理反应槽（PHYSICAL）上的任务不可被抢占（`interruptible === false`）：
   *   正在被撞飞的人不该因为"到点该转身了"就站起来。这是该标志唯一的用途。
   */
  pushTask(a, slot, task, replace = true) {
    const T = a.tasks;
    if (!T) return false;
    const cur = T[slot];
    if (cur && !replace) return false;
    if (cur && !cur.interruptible) return false;
    if (cur) cur.stop(a);
    T[slot] = task;
    task.start(a);
    return true;
  }

  /** 清掉一个槽，不动其他槽。主任务被打断后能恢复，靠的就是"从不清它"。 */
  clearTask(a, slot) {
    const T = a.tasks;
    if (!T) return;
    const t = T[slot];
    if (!t) return;
    t.stop(a);
    T[slot] = null;
  }

  /**
   * 行人一帧：先接事件，再泵任务。
   *
   * ★ 顺序不能反。先泵任务的话，事件要等到下一帧才生效 ——
   *   表现为"行人先照常走了一步，然后才停下"，让行看起来是迟到的。
   * ★ 本方法取代了原来那个 100 行的 `_updPed`。行为逐条搬进了
   *   `WanderWalkTask`（走路 + 停顿）/ `ShopVisitTask`（逛店）
   *   / `GoToPointTask`（走向摊位）/ `StandTask`（站着挑东西）。
   *   **参数与阈值一个都没改**：碰撞半径 0.30 / 到达半径 1.05 /
   *   赶路倍率 1.3 / 挑东西 2~5s / 冷却 8~22s 与 12~34s，
   *   与改造前逐字一致 —— 这是一次**纯结构搬家**，不是行为改版。
   */
  _updPed(a, dt, lim, playerPos) {
    void lim; void playerPos;   // 街长与玩家位置都已由任务/实例持有
    const T = a.tasks;
    if (!T) return;   // 未装槽位（不该发生）：宁可不动，也不要抛异常打断整帧
    this._pedEvents(a, dt);
    if (this._pumpTasks(a, dt)) return;
    /* 五个槽全空 —— 按定义不该发生（PRIMARY 是常驻的）。
       真发生了也不能让这个人变成木头：把常驻主任务装回去。 */
    T[TASK_SLOT.PRIMARY] = new PedAmbientTask();
    T[TASK_SLOT.PRIMARY].start(a);
  }

  /* ── 摊主 / 店主 ─────────────────────────────────────────────────────────
     ★ 恒稳原话：「店铺或者摊位或者其他的人应该有对应的行动逻辑」。
     摊主与过路人的区别不在**移动方式**，而在**他属于某个位置**：
     他钉在自己摊后、面朝街心，动作是"整理货物"与"抬手招呼客人"，
     偶尔走开一两米搬货再回来。
     ★ 为什么要"偶尔走开"而不是永远站定：完全钉死会像蜡像，
     比没有人更显假。真实摊主一直在小范围里动。 */
  _updKeeper(a, dt, lim, playerPos) {
    const o = a.obj;
    const R = 0.32;
    const x0 = o.position.x, z0 = o.position.z;
    a.actT += dt;

    /* 岗位/搬货之间的切换。 */
    a.stepT -= dt;
    if (a.stepT <= 0) {
      a.stepT = 11 + Math.random() * 16;
      if (a.target) {
        a.target = null;                       // 回岗位
      } else {
        /* 走开 0.8~2.0m：以"正前方"为主、侧向为辅 ——
           这样他始终在自己摊子那一带，不会逛到隔壁店去。
           ★ 目标点必须先过碰撞校验（2026-09-19）：墙根堆着电动车/垃圾桶，
             不校验的话目标可能落在盒子里，摊主会一路顶到墙边再"放弃搬货"，
             看上去就是一个人贴着墙抖。校验不过就干脆不去 —— 站着不动
             比顶着墙走自然得多。 */
        const fx = Math.sin(a.rot), fz = Math.cos(a.rot);
        const sx = Math.cos(a.rot), sz = -Math.sin(a.rot);
        const f = 0.8 + Math.random() * 1.2, s = (Math.random() - 0.5) * 1.8;
        const tx = a.home.x + fx * f + sx * s, tz = a.home.z + fz * f + sz * s;
        /* 同侧约束：不许把搬货点定到街对面（跨过去等于换人行道）。 */
        if (tx * a.home.x > 0 && !this._blocked(tx, tz, R)) {
          a.target = { x: tx, z: tz };
        }
      }
    }

    const tgt = a.target || a.home;
    const dx = tgt.x - x0, dz = tgt.z - z0;
    const d = Math.hypot(dx, dz);
    const L = o.userData.limbs;

    if (d > 0.16) {
      const sp = 0.8;
      const r = this._slide(x0, z0, x0 + (dx / d) * sp * dt, z0 + (dz / d) * sp * dt, R);
      o.position.x = r.x;
      o.position.z = r.z;
      /* 走不过去 → 放弃这次搬货，回岗位。 */
      if (r.hit) a.target = null;
      o.rotation.y = Math.atan2(dx, dz);
      o.rotation.x = 0;
      a.phase += dt * 5.6;
      this._swing(o, a.phase, 0.42);
      o.position.y = Math.abs(Math.sin(a.phase)) * 0.018;
    } else {
      /* 站定：面朝街心，做小动作。 */
      o.rotation.y = a.rot;
      o.position.y = 0;
      const t = a.actT;
      /* wave > 0.55 的那段周期里是"招呼客人"（抬手挥），
         其余时间"整理货物"（俯身、两手在台面上小幅动）。 */
      const wave = Math.sin(t * 1.55);
      if (L) {
        L.legs[0].rotation.x = L.legs[1].rotation.x = 0;
        if (wave > 0.55) {
          /* 招呼：抬右臂，小幅挥动。 */
          L.arms[1].rotation.x = -2.0 + Math.sin(t * 7.2) * 0.3;
          L.arms[0].rotation.x = Math.sin(t * 1.5) * 0.12;
          o.rotation.x = 0;
        } else {
          /* 整理货物：双臂前伸下压，带一点节奏。 */
          L.arms[0].rotation.x = 0.62 + Math.sin(t * 2.3) * 0.4;
          L.arms[1].rotation.x = 0.62 + Math.sin(t * 2.3 + 1.1) * 0.4;
          /* 前倾 4~9°：绕脚（组原点）转，看起来就是"俯身在摊上"。 */
          o.rotation.x = 0.09 + Math.sin(t * 2.3) * 0.045;
        }
      }
    }
  }

  _updVehicle(a, dt, lim, playerPos) {
    const o = a.obj;
    /* ── 跟车：找同方向、在同车道、前方最近的一辆 ──
       不做这个就会出现"两辆车叠在一起"——车流最刺眼的失真。
       用简单的"距离 < 安全间距就减速到 0"，够用且绝不会穿透。 */
    let gap = Infinity;
    for (const b of (this._byKind[KIND.CAR] || []).concat(this._byKind[KIND.BIKE] || [])) {
      if (b === a || b.dir !== a.dir) continue;
      const dz = (b.obj.position.z - o.position.z) * a.dir;
      if (dz > 0 && dz < gap) gap = dz;
    }
    /* ── 避让玩家：玩家在同车道前方时刹车 ── */
    let pedClose = false;
    if (playerPos) {
      const dz = (playerPos.z - o.position.z) * a.dir;
      const dx = Math.abs(playerPos.x - o.position.x);
      if (dz > 0 && dz < 3.4 && dx < 1.35) pedClose = true;
    }

    /* ── 前方有障碍（墙 / 电线杆 / 停放的车）→ 刹车 ──
       ★ 2026-09-19：原来车**完全不看碰撞盒**，所以恒稳看到"车辆直接穿墙而过"。
         这里用"探针"而不是"移动后滑动"：车辆的速度高（最高 ~7m/s，
         一帧 50ms 就是 35cm），用滑动解算会看到车头插进墙里再弹出来；
         提前在 1.2m 处探一下、减速到 0，才像在开车。 */
    let wallAhead = false;
    {
      const probe = o.position.z + a.dir * (a.len * 0.5 + 1.2);
      const r = Math.max(0.85, Math.abs(a.lane) * 0.15);
      if (this._blocked(o.position.x, probe, r)) wallAhead = true;
    }

    const safe = a.len + 1.6;
    const blocked = gap < safe || pedClose || wallAhead;
    a.braking = blocked;
    const target = blocked ? 0 : a.speed;
    /* a.cur 由 newVehicleState 出厂即赋值 —— 原来这里是
       `a.cur = a.cur === undefined ? a.speed : a.cur` 的懒初始化，现已删除。 */
    /* 加速慢、刹车快 —— 与真实驾驶一致，视觉上也更像车。 */
    const rate = target > a.cur ? 2.6 : 7.5;
    a.cur += Math.max(-rate * dt, Math.min(rate * dt, target - a.cur));

    o.position.z += a.dir * a.cur * dt;
    /* 车轮转起来（轮子是 rotation.z=PI/2 的圆柱，绕自身 x 轴滚）。 */
    for (const c of o.children) {
      if (c.geometry === G.wheel) c.rotation.x += a.cur * dt * 2.6;
    }
    /* 刹车灯：红色 emissive 增强。夜里/日光下都能看出"他在让我"。 */
    for (const c of o.children) {
      if (c.geometry && c.geometry === G.lamp) {
        c.material = a.braking ? M.lampBrake : M.lamp;
      }
    }

    if (o.position.z > lim + 6) { o.position.z = -lim - 6; }
    if (o.position.z < -lim - 6) { o.position.z = lim + 6; }
  }

  _updDog(a, dt, lim) {
    const o = a.obj;
    a.retarget -= dt;
    if (a.retarget <= 0) {
      /* 在"家"附近重新选一个嗅探点。范围小 = 像狗在自家门口转。 */
      a.wander.x = a.home.x + (Math.random() - 0.5) * 7;
      a.wander.z = Math.max(-lim + 2, Math.min(lim - 2, a.home.z + (Math.random() - 0.5) * 9));
      a.retarget = 2.5 + Math.random() * 5;
      a.sniffT = Math.random() < 0.35 ? 0.8 + Math.random() * 1.6 : 0;
    }
    if (a.sniffT > 0) {
      a.sniffT -= dt;
      o.position.y = 0;
    } else {
      const dx = a.wander.x - o.position.x, dz = a.wander.z - o.position.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.12) {
        o.position.x += (dx / d) * a.speed * dt;
        o.position.z += (dz / d) * a.speed * dt;
        o.rotation.y = Math.atan2(dx, dz);
        o.position.y = Math.abs(Math.sin(performance.now() * 0.006)) * 0.03;
      }
    }
    a.phase += dt * 9;
    /* 摇尾巴 + 四条腿小步摆动。 */
    const t = o.userData.tail;
    if (t) t.rotation.z = Math.sin(a.phase) * 0.5;
    for (let i = 0; i < (o.userData.legs || []).length; i++) {
      o.userData.legs[i].rotation.x = Math.sin(a.phase + i * 1.6) * 0.4;
    }
  }

  _updCat(a, dt, lim) {
    const o = a.obj;
    a.retarget -= dt;
    if (a.retarget <= 0) {
      a.wander.x = a.home.x + (Math.random() - 0.5) * 5;
      a.wander.z = Math.max(-lim + 2, Math.min(lim - 2, a.home.z + (Math.random() - 0.5) * 6));
      a.retarget = 3 + Math.random() * 6;
      /* 猫有很长的静止期（蹲着）。这段"什么都不做"正是猫味。 */
      a.idleT = Math.random() < 0.5 ? 2 + Math.random() * 4 : 0;
    }
    if (a.idleT > 0) {
      a.idleT -= dt;
    } else {
      const dx = a.wander.x - o.position.x, dz = a.wander.z - o.position.z;
      const d = Math.hypot(dx, dz);
      if (d > 0.12) {
        const r = this._slide(o.position.x, o.position.z,
          o.position.x + (dx / d) * a.speed * dt,
          o.position.z + (dz / d) * a.speed * dt, 0.26);
        o.position.x = r.x; o.position.z = r.z;
        if (r.hit) a.retarget = 0;
        o.rotation.y = Math.atan2(dx, dz);
      }
    }
    a.phase += dt * 4.5;
    const t = o.userData.tail;
    /* 猫尾竖直慢摆（与狗的横摆不同）。 */
    if (t) t.rotation.z = Math.sin(a.phase) * 0.22;
  }

  _updBird(a, dt, lim) {
    const o = a.obj;
    if (a.grounded) {
      a.groundT -= dt;
      o.position.y = 0.06;
      if (a.groundT <= 0) { a.grounded = false; }
      void lim;
    } else {
      a.ang += a.angSpeed * dt;
      const cx = a.cx, cz = a.cz;
      o.position.x = cx + Math.cos(a.ang) * a.r;
      o.position.z = Math.max(-lim, Math.min(lim, cz + Math.sin(a.ang) * a.r));
      o.position.y = a.h + Math.sin(a.ang * 2.1) * 0.55;
      o.rotation.y = -a.ang + Math.PI / 2;
      /* 偶尔落下来啄食，再起飞 —— 打破"永远绕圈"的呆板。
         ★ 同样不能按帧掷骰子（原为 Math.random() < 0.0016/帧）：
         144fps 下每只鸟每秒触发 0.23 次、每次停 1.5~4 秒，稳态约 39% 的鸟
         是趴在地上的；60fps 下只有 21%。行为随帧率漂移，同行人停顿一个病。
         改成按时间冷却，落地率约 10%。 */
      a.groundCd = (a.groundCd === undefined ? 4 + Math.random() * 12 : a.groundCd) - dt;
      if (a.groundCd <= 0) {
        a.groundCd = 12 + Math.random() * 18;
        if (Math.random() < 0.5) {
          a.grounded = true;
          a.groundT = 1.5 + Math.random() * 2.5;
        }
      }
    }
    a.flap += dt * (a.grounded ? 2 : 11);
    const ws = o.userData.wings || [];
    if (ws[0]) ws[0].rotation.z = Math.sin(a.flap) * 0.75;
    if (ws[1]) ws[1].rotation.z = -Math.sin(a.flap) * 0.75;
  }

  _updInsect(a, dt, playerPos) {
    const o = a.obj;
    a.ang += a.angSpeed * dt;
    a.bob += dt * 7;
    let cx = a.cx, cz = a.cz;
    /* ★ 蚊/蝇追人：只有"会靠近玩家"这一条，才让昆虫从背景噪点
       变成能被感知的存在。但不真贴上（保持在 1.2m 外绕飞），
       否则会像 bug。 */
    if (a.chaser && playerPos) {
      const dx = playerPos.x - cx, dz = playerPos.z - cz;
      const d = Math.hypot(dx, dz) || 1;
      if (d > 3.2) { cx += (dx / d) * 1.4 * dt; cz += (dz / d) * 1.4 * dt; }
      else if (d < 1.2) { cx -= (dx / d) * 1.2 * dt; cz -= (dz / d) * 1.2 * dt; }
      a.cx = cx; a.cz = cz;
    }
    o.position.x = cx + Math.cos(a.ang) * a.r;
    o.position.z = cz + Math.sin(a.ang * 1.3) * a.r;
    o.position.y = 0.85 + Math.sin(a.bob) * 0.22;
  }

  /** 统计（验证脚本用）：按种类计数。 */
  get stats() {
    const out = {};
    for (const k of Object.keys(this._byKind)) out[k] = this._byKind[k].length;
    out.total = this.actors.length;
    return out;
  }

  /** 当前场景里的命名 NPC id（验证脚本用）。
   *  ★ 与 stats 分开：stats 只能给出"有几个 npc"，
   *    而这一层的价值恰恰在**是谁** —— 断言"下午的商业区站着 9 个人"
   *    和断言"站着的是日程表上那 9 个人"是两件事，后者才是真验证。 */
  get namedIds() {
    return (this._namedIds || []).slice();
  }

  /** 只清角色，保留 group（切地点时用）。 */
  clear() {
    for (const a of this.actors) this.group.remove(a.obj);
    this.actors.length = 0;
    this._byKind = {};
    this.world = null;
    /* 命名 NPC 的两份账也要清 —— 不清的话切到新地点后
       setNamedNpcs 会认为"名单没变"，于是新地点一个命名 NPC 都不生成。 */
    this._reservedAnchors = [];
    this._namedIds = [];
  }

  /** 彻底销毁（场景 dispose 时用）。
   *  ★ 只移除引用，**不 dispose 几何/材质** —— 它们被所有实例共享，
   *    也属于模块级缓存，下一次 setWorld 还要复用。 */
  dispose() {
    this.clear();
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}

/* ★ 把各类造型的构建函数一并导出：验证脚本与取证截图脚本需要**单独摆一个**
   （把 4 种人形、车、狗、猫、鸟排一排近距离拍），而不是去几十个移动目标里碰运气。
   这与 index.js 暴露 buildHuman 是同一个理由：让"长什么样"可以被独立检查。
   ★ faceTexture 也导出：脸的**方位**（脸是不是长在 +Z）无法靠数网格判断，
   只能把贴图本身取出来看。验证脚本用它在 node 侧比对人脸中心像素。
   （任务系统各导出见上方 `export const TASK_SLOT` / `export class Task` 等处。） */
export { KIND as ACTOR_KIND, buildCar, buildBike, buildDog, buildCat, buildBird, faceTexture, faceX, faceY, nameSprite };
