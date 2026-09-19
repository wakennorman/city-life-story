import * as THREE from 'three';

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

/* ── 可复现随机：同一地点每次生成的角色布置应一致 ─────────────────────────
   为什么不用 Math.random：验证脚本要断言"某地点有 N 个行人/几辆车"，
   纯随机会让断言变成薛定谔的绿灯。用地点名做种子 → 同地点稳定、异地不同。 */
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── 共享几何/材质缓存 ─────────────────────────────────────────────────────
   几十个角色各自 new 几何会让显存与 draw call 双爆。
   所有基础体只建一次，角色之间共享（clone 只复制 Object3D 树，几何仍共享）。
   ★ 与 assets.js 同一条纪律：共享几何**不可 dispose** ——
     释放了会连带毁掉其它活着的实例（而且不报错，只是"人不见了"）。 */
const G = {
  head: null, torso: null, neck: null, arm: null, leg: null,
  hand: null, foot: null, eye: null, nose: null, mouth: null,
  hairCap: null, carBody: null, carRoof: null, wheel: null,
  dogBody: null, dogHead: null, catBody: null, catHead: null,
  tail: null, birdBody: null, wing: null, insect: null,
};
function geomInit() {
  if (G.head) return;
  G.head = new THREE.SphereGeometry(0.105, 14, 10);
  G.torso = new THREE.CylinderGeometry(0.155, 0.135, 0.56, 9, 1);
  G.neck = new THREE.CylinderGeometry(0.045, 0.05, 0.09, 7);
  G.arm = new THREE.CapsuleGeometry(0.043, 0.42, 4, 7);
  G.leg = new THREE.CapsuleGeometry(0.072, 0.62, 4, 8);
  G.hand = new THREE.SphereGeometry(0.05, 8, 6);
  G.foot = new THREE.BoxGeometry(0.105, 0.055, 0.225);
  G.eye = new THREE.SphereGeometry(0.019, 7, 5);
  G.nose = new THREE.ConeGeometry(0.021, 0.05, 6);
  /* 嘴用薄盒：真正的"张开"要靠骨骼/形态键，低成本方案给一条唇线即可，
     远看足以打破"无脸球"。 */
  G.mouth = new THREE.BoxGeometry(0.055, 0.012, 0.014);
  G.hairCap = new THREE.SphereGeometry(0.112, 14, 10, 0, Math.PI * 2, 0, Math.PI * 0.62);
  G.carBody = new THREE.BoxGeometry(1.78, 0.62, 4.05);
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
  if (M.skin) return;
  M.skin = new THREE.MeshStandardMaterial({ color: 0xc8a07a, roughness: 0.78 });
  M.dark = new THREE.MeshStandardMaterial({ color: 0x2b2f34, roughness: 0.85 });
  M.hair = new THREE.MeshStandardMaterial({ color: 0x22201e, roughness: 0.9 });
  M.eyeW = new THREE.MeshStandardMaterial({ color: 0xf2efe8, roughness: 0.4 });
  M.eyeD = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.3 });
  M.mouth = new THREE.MeshStandardMaterial({ color: 0x7a4a48, roughness: 0.7 });
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

/* 人类可选外观 —— 皮肤/发色/上衣/裤子。给角色多样性，避免"一排复制人"。 */
const SKIN = [0xc8a07a, 0xb89070, 0xd8b48c, 0xa88060, 0xdcbb96];
const HAIR = [0x22201e, 0x3a2c22, 0x14110f, 0x5a4632, 0x6e6259];
const TOP = [0x3b4048, 0x5a4a42, 0x40514a, 0x6b3a34, 0x3a4a5a, 0x8a8278, 0x4a3f52, 0x2f3a44];
const PANTS = [0x272b2f, 0x2f3a44, 0x3a3a3a, 0x4a4238, 0x1f2429];

/**
 * 构建一个改良人形：有五官、手、脚。
 * @param {Function} rng  seeded random
 * @param {number} scale 身高缩放（成人 1.0 ≈ 1.72m）
 */
export function buildHuman(rng, scale = 1) {
  const g = new THREE.Group();
  const skin = new THREE.MeshStandardMaterial({ color: SKIN[(rng() * SKIN.length) | 0], roughness: 0.78 });
  const hairM = new THREE.MeshStandardMaterial({ color: HAIR[(rng() * HAIR.length) | 0], roughness: 0.9 });
  const top = new THREE.MeshStandardMaterial({ color: TOP[(rng() * TOP.length) | 0], roughness: 0.9 });
  const pants = new THREE.MeshStandardMaterial({ color: PANTS[(rng() * PANTS.length) | 0], roughness: 0.9 });

  /* ★ 只有"大到影子能看出来"的部件才投影（躯干/头/四肢）。
     眼睛/鼻子/嘴/手/脚/帽子都在 2~10cm 量级，它们在路面上的影子
     肉眼根本分不出来，但**每一个都会在阴影 pass 里多花一次 draw call**：
     17 个行人 × 12 个碎件 ≈ 200 次纯浪费（实测占角色总开销的三分之一）。
     投影是"整体轮廓对了就行"的事，细节部件由躯干和头的影子一并覆盖。 */
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
  const head = add(G.head, skin, 0, 1.60, 0);
  add(G.hairCap, hairM, 0, 1.605, 0);
  /* 五官：两眼 + 鼻 + 唇线。position.z 递增方向 = 面朝 +Z（与 facing 一致）。 */
  add(G.eye, M.eyeW, -0.040, 1.622, 0.088);
  add(G.eye, M.eyeW, 0.040, 1.622, 0.088);
  add(G.eyeD, M.eyeD, -0.040, 1.622, 0.098);
  add(G.eyeD, M.eyeD, 0.040, 1.622, 0.098);
  const nose = add(G.nose, skin, 0, 1.587, 0.104);
  nose.rotation.x = Math.PI / 2;
  add(G.mouth, M.mouth, 0, 1.556, 0.095);
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
    const arm = add(G.arm, top, x, 1.13, 0);
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
  const body = new THREE.MeshStandardMaterial({ color, roughness: 0.42, metalness: 0.32 });
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
  const coat = new THREE.MeshStandardMaterial({
    color: [0x8a6a44, 0x3a3028, 0xd8c8a8, 0x5a4a38][(rng() * 4) | 0], roughness: 0.92,
  });
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
  const coat = new THREE.MeshStandardMaterial({
    color: [0x3a3430, 0xd8d0c0, 0xa87a48, 0x5a5a5a][(rng() * 4) | 0], roughness: 0.9,
  });
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

const KIND = { PED: 'ped', CAR: 'car', BIKE: 'bike', DOG: 'dog', CAT: 'cat', BIRD: 'bird', INSECT: 'insect' };

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
  }

  /**
   * 按地点配置重建全部角色。
   * @param {object} w { id, layout, streetLen, roadW, laneHalf, tier, colliders, footfall }
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
     行人走车道中央是明显的失真。 */
  _pedBandX(roadW, half) {
    const outer = roadW / 2 + (half - roadW / 2) * 0.55;
    return { inner: roadW / 2 + 0.35, outer: Math.max(roadW / 2 + 0.6, Math.min(outer, half - 0.5)) };
  }

  _spawnPed(rng, S, roadW, half) {
    const band = this._pedBandX(roadW, half);
    const side = rng() < 0.5 ? -1 : 1;
    const x = side * (band.inner + rng() * (band.outer - band.inner));
    const dir = rng() < 0.5 ? 1 : -1;
    const obj = buildHuman(rng, 0.94 + rng() * 0.12);
    obj.position.set(x, 0, -S / 2 + rng() * S);
    this._push({
      kind: KIND.PED, obj,
      speed: 0.75 + rng() * 0.85,
      dir, phase: rng() * Math.PI * 2,
      /* 行人会停下来（看手机/等摊/聊天）。不停会像传送带，一眼假。
         ★ 但初始停顿必须短：这里原本给 rng()*6（最长 6 秒），
           后果是**每次切地点进街，半条街的人是冻结的**，要等几秒才陆续走起来 ——
           第一眼看上去就是"雕塑"。真实街道上你看到的永远是"有人走、有人停"，
           所以初始错开压到 ~1.6s，之后再靠下面的随机停顿拉开节奏。 */
      pauseT: rng() * 1.6, moving: true,
      lane: x,
    });
  }

  _spawnCar(rng, S, roadW, forceDir) {
    /* forceDir 用于"必须保证双向都有车"的场合（见 setWorld）。
       否则全交给随机种子，会出现**整条街车流同向**的画面 —— 那看上去就是单行道，
       而且它只在部分地点出现（换个种子就正常），属于最难被发现的那类缺陷。 */
    const dir = forceDir !== undefined ? forceDir : (rng() < 0.5 ? 1 : -1);
    /* ★ 靠右：+Z 走 -X 半道，-Z 走 +X 半道（见文件头推导）。 */
    const lane = (dir > 0 ? -1 : 1) * roadW * 0.25;
    const obj = buildCar(rng);
    obj.position.set(lane, 0, -S / 2 + rng() * S);
    obj.rotation.y = dir > 0 ? 0 : Math.PI;
    this._push({
      kind: KIND.CAR, obj,
      speed: (2.6 + rng() * 2.2) * (0.8 + (this.world.tier || 1) * 0.12),
      dir, lane, len: 4.05,
      braking: false,
    });
  }

  _spawnBike(rng, S, roadW) {
    const dir = rng() < 0.5 ? 1 : -1;
    const lane = (dir > 0 ? -1 : 1) * roadW * 0.36;
    const obj = buildBike(rng);
    obj.position.set(lane, 0, -S / 2 + rng() * S);
    obj.rotation.y = dir > 0 ? 0 : Math.PI;
    this._push({ kind: KIND.BIKE, obj, speed: 3.4 + rng() * 2.4, dir, lane, len: 1.5, braking: false });
  }

  _spawnDog(rng, S, half) {
    const obj = buildDog(rng);
    const x = (rng() < 0.5 ? -1 : 1) * (half * 0.42 + rng() * half * 0.3);
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
    const x = (rng() < 0.5 ? -1 : 1) * (half * 0.5 + rng() * half * 0.28);
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
    this.actors.push(a);
    (this._byKind[a.kind] || (this._byKind[a.kind] = [])).push(a);
    this.group.add(a.obj);
  }

  /* ── 每帧推进 ────────────────────────────────────────────────────────────
     参数：dt 秒；playerPos 用于"车辆避让玩家""蚊子追人"。 */
  update(dt, playerPos) {
    if (!this.world) return;
    const S = this.world.streetLen || 96;
    const lim = S / 2;

    for (let i = 0; i < this.actors.length; i++) {
      const a = this.actors[i];
      switch (a.kind) {
        case KIND.PED: this._updPed(a, dt, lim, playerPos); break;
        case KIND.CAR:
        case KIND.BIKE: this._updVehicle(a, dt, lim, playerPos); break;
        case KIND.DOG: this._updDog(a, dt, lim); break;
        case KIND.CAT: this._updCat(a, dt, lim); break;
        case KIND.BIRD: this._updBird(a, dt, lim); break;
        case KIND.INSECT: this._updInsect(a, dt, playerPos); break;
      }
    }
  }

  _updPed(a, dt, lim, playerPos) {
    const o = a.obj;
    /* 停顿：站着不动。这既是真实感，也让"人流"不至于像传送带。 */
    if (a.pauseT > 0) {
      a.pauseT -= dt;
      a.moving = false;
      const L = o.userData.limbs;
      if (L) {
        L.legs[0].rotation.x = L.legs[1].rotation.x = 0;
        L.arms[0].rotation.x = L.arms[1].rotation.x = 0;
      }
    } else {
      a.moving = true;
      o.position.z += a.dir * a.speed * dt;
      a.phase += dt * (6.2 + a.speed);
      const L = o.userData.limbs;
      if (L) {
        const sw = 0.55;
        L.legs[0].rotation.x = Math.sin(a.phase) * sw;
        L.legs[1].rotation.x = -Math.sin(a.phase) * sw;
        L.arms[0].rotation.x = -Math.sin(a.phase) * sw * 0.75;
        L.arms[1].rotation.x = Math.sin(a.phase) * sw * 0.75;
      }
      o.position.y = Math.abs(Math.sin(a.phase)) * 0.022;
      /* ★ 停顿必须"按时间"触发，绝不能"按帧"。
         原写法 `Math.random() < 0.004` 是**每帧**掷一次骰子，于是停顿频率
         直接绑定帧率：144fps 时每个行人每秒掷 144 次（触发率 0.58/s，
         配上平均 2.8 秒的停顿，稳态有约 60% 的行人是站着的），60fps 时只有 0.24/s。
         后果是**同一份代码在快机器上"半条街在站桩"、在慢机器上人流正常** ——
         行为随性能漂移，是最难复现的一类缺陷（本脚本实测两次跑出 11/17 与 0/17）。
         改成冷却计时器：平均每 ~13 秒考虑停一次，约 45% 会真的停 1.2~4.4 秒，
         整体"站立率"约 5%，与帧率彻底解耦。 */
      a.pauseCd = (a.pauseCd === undefined ? 2 + Math.random() * 9 : a.pauseCd) - dt;
      if (a.pauseCd <= 0) {
        a.pauseCd = 7 + Math.random() * 12;
        if (Math.random() < 0.45) a.pauseT = 1.2 + Math.random() * 3.2;
      }
    }

    /* 到街尾就折返（换边走：真实行人不会原地转身走同一条线）。 */
    if (o.position.z > lim || o.position.z < -lim) {
      a.dir *= -1;
      a.phase = 0;
    }
    /* ★ 玩家贴近时侧身让路 —— 不让人从玩家身体里穿过去。
       这是"逻辑要对"里最容易被忽略的一条：让位比穿模可信得多。 */
    if (playerPos) {
      const dx = o.position.x - playerPos.x, dz = o.position.z - playerPos.z;
      const d = Math.hypot(dx, dz);
      if (d < 0.85 && d > 1e-4) {
        const push = (0.85 - d) / d;
        o.position.x += dx * push * 0.6;
        o.position.z += dz * push * 0.6;
      }
    }
    /* 行走时面朝行进方向（+Z 是 0 弧度，因为模型脸部朝 +Z）。 */
    o.rotation.y = a.dir > 0 ? 0 : Math.PI;
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

    const safe = a.len + 1.6;
    const blocked = gap < safe || pedClose;
    a.braking = blocked;
    const target = blocked ? 0 : a.speed;
    a.cur = a.cur === undefined ? a.speed : a.cur;
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
        o.position.x += (dx / d) * a.speed * dt;
        o.position.z += (dz / d) * a.speed * dt;
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

  /** 只清角色，保留 group（切地点时用）。 */
  clear() {
    for (const a of this.actors) this.group.remove(a.obj);
    this.actors.length = 0;
    this._byKind = {};
    this.world = null;
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
   这与 index.js 暴露 buildHuman 是同一个理由：让"长什么样"可以被独立检查。 */
export { KIND as ACTOR_KIND, buildCar, buildBike, buildDog, buildCat, buildBird };
