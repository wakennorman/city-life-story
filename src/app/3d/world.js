import * as THREE from 'three';
import { palette, tierOf } from './palette.js';
import { syncNormalRepeat } from './materials.js';
import * as K from './kit.js';

/* ══ 场地布局引擎 ═══════════════════════════════════════════════════════════
   5 种布局 × 结构原型 × 道具包 × 质感档位 = 29 个地点。

   每个 layout 函数负责"把结构摆到地上"，并把可用的空位（lots）交回来，
   供道具与交互点二次投放。这样加一个新地点只需要加一行配方。
   ═══════════════════════════════════════════════════════════════════════════ */

const rnd = (a, b) => a + Math.random() * (b - a);
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const chance = (p) => Math.random() < p;

/* ── 建造上下文：统一收集碰撞体 / 相机遮挡体 / 交互位 ──────────────────── */
class Ctx {
  constructor(scene, spec, tier) {
    this.scene = scene;
    this.spec = spec;
    this.tier = tier;
    this.T = tierOf(tier);
    this.group = new THREE.Group();
    this.group.name = spec.id;
    this.colliders = [];
    this.blockers = [];
    this.lots = [];        // { x, z, rot, kind } 可供道具/交互点使用的空位
    this.hotspots = [];
    scene.add(this.group);
  }
  /** 放置一个物件；footprint 存在时自动注册碰撞盒 */
  place(obj, x, z, rotY = 0, { collide = 'auto', block = false, noMerge = false } = {}) {
    obj.position.set(x, obj.position.y, z);
    obj.rotation.y = rotY;
    if (noMerge) obj.userData.noMerge = true;
    this.group.add(obj);
    const fp = obj.userData.footprint;
    if (fp && collide !== 'none') {
      const c = Math.cos(-rotY), s = Math.sin(-rotY);
      // 旋转后的 AABB（取包围盒即可，物件大多轴对齐或小角度）
      const ex = (Math.abs(c) * fp.w + Math.abs(s) * fp.d) / 2;
      const ez = (Math.abs(s) * fp.w + Math.abs(c) * fp.d) / 2;
      const box = { minX: x - ex, maxX: x + ex, minZ: z - ez, maxZ: z + ez };
      this.colliders.push(box);
      if (block) this.blockers.push(box);
    }
    return obj;
  }
  /** 登记一个空位，供后续投放道具 */
  lot(x, z, rotY = 0, kind = 'walk') {
    this.lots.push({ x, z, rot: rotY, kind });
  }
  /** 随机取一个落点，避开出生点的安全圈。
   *  没有这一步的话，垃圾桶/电动车会盖在出生点上，
   *  角色的碰撞推出逻辑每帧把它顶回去 —— 表现为"走不动"。 */
  spot(xa, xb, za, zb, clear = 3.6) {
    for (let i = 0; i < 30; i++) {
      const x = rnd(xa, xb), z = rnd(za, zb);
      if (Math.hypot(x, z - (this.spawnZ || 0)) >= clear) return [x, z];
    }
    // 兜底：往街道另一头放，至少不压出生点
    return [xr(xa, xb), za < 0 ? zb - 2 : za + 2];
  }
  addRaw(obj, noMerge = false) {
    if (noMerge) obj.userData.noMerge = true;
    this.group.add(obj);
    return obj;
  }
}

function xr(a, b) { return a + (b - a) * 0.5; }

/** 按平面尺寸生成地面材质。
 *  three 的 repeat 是"整张平面重复几次"，所以必须逐平面算：
 *  同一张纹理贴到 190m 底板与 12m 地块，密度差 16 倍。
 *  tile 是"一个纹理格代表多少米"。
 *
 *  ★ [2026-09-18 Agent B 补齐] 原来这里**只克隆了 map**：
 *      const m = base.clone();
 *      m.map = base.map.clone();
 *      m.map.repeat.set(w/tile, l/tile);   // ← normalMap 没动
 *    加了法线贴图（P1-1）之后，材质克隆会**共享**同一个 normalMap，
 *    它的 repeat 停在 1×1，而颜色 repeat 是 40×40 ——
 *    表现是"地面颜色是细砖、凹凸是整面糊的"，**不报错**。
 *    验证脚本把这个读数暴露为 repeatMismatch=1，但当时 world.js
 *    不在任何一方的改动清单里，所以一直挂着（已记为已知偏差）。
 *    现用 materials.js 提供的 syncNormalRepeat() 收口 —— 它同时
 *    把 tile 口径改为**读纹理自己声明的 metersPerRepeat**，
 *    这样"图案按什么尺度画"与"按什么尺度铺"永远一致，
 *    不会再出现 300mm 铺装砖被按 4.5m 铺开而显示成 562mm 的事。 */
function tileMat(base, w, l, tile = null) {
  const m = base.clone();
  if (base.map) {
    m.map = base.map.clone();
    m.map.needsUpdate = true;
    /* tile 未显式指定时，取纹理自己声明的一格多少米（materials.js::toTexture
       登记在 userData.surface 上）。拿不到才退回默认 4.5。 */
    const declared = base.map.userData && base.map.userData.surface
      ? base.map.userData.surface.metersPerRepeat : null;
    const t = tile || declared || 4.5;
    m.map.repeat.set(Math.max(1, w / t), Math.max(1, l / t));
  }
  syncNormalRepeat(m);   // ★ 凹凸密度必须跟着颜色走
  return m;
}

/* ══ 地面处理 ═══════════════════════════════════════════════════════════ */

function groundFor(ctx, kind) {
  const { group, T, spec } = ctx;
  const size = 190;
  const base = new THREE.Mesh(new THREE.PlaneGeometry(size, size), tileMat(T.ground, size, size));
  base.rotation.x = -Math.PI / 2;
  base.receiveShadow = true;
  group.add(base);

  // 先从配方里取出场地尺寸，后面的布局函数统统读 ctx，避免各处各猜一遍
  const S = ctx.streetLen = spec.streetLen || 96;
  ctx.courtW = spec.courtW || 46;
  ctx.plazaW = spec.plazaW || 44;
  /* 出生点：必须落在街区内部。
     如果在街尾，跟随相机会被顶到街区外面，看到的是建筑端头 + 空地。 */
  ctx.spawnZ = 12;

  if (kind === 'avenue') {
    ctx.roadW = ctx.spec.roadW || 15;
    const road = K.road({ len: size, w: ctx.roadW });
    group.add(road);
    for (const sx of [-1, 1]) {
      group.add(K.sidewalk({ len: size, w: 3.6, x: sx * (ctx.roadW / 2 + 1.8) }));
      group.add(K.curb({ len: size, x: sx * (ctx.roadW / 2 + 0.05), h: 0.16 }));
    }
    for (let z = -S / 2 + 6; z < S / 2; z += 22) {
      group.add(K.crosswalk({ len: Math.min(ctx.roadW, 12), z }));
    }
    ctx.laneHalf = ctx.roadW / 2 + 3.8;
  } else if (kind === 'lane') {
    ctx.roadW = ctx.spec.roadW || 9.5;
    // 巷子用浅色脏水泥，不用沥青 —— 城中村的巷子不是柏油马路
    const road = K.road({ len: size, w: ctx.roadW, mat: palette().common.laneSurf });
    group.add(road);
    for (const sx of [-1, 1]) {
      group.add(K.curb({ len: size, x: sx * (ctx.roadW / 2 + 0.1), h: 0.12 }));
    }
    ctx.laneHalf = ctx.roadW / 2;
  } else if (kind === 'compound') {
    // 院区：中间铺装内院，外围土色
    const court = new THREE.Mesh(new THREE.PlaneGeometry(ctx.courtW, S), tileMat(T.ground, ctx.courtW, S));
    court.rotation.x = -Math.PI / 2;
    court.position.y = 0.014;
    court.receiveShadow = true;
    group.add(court);
    ctx.laneHalf = ctx.courtW / 2;
  } else if (kind === 'yard') {
    const apron = K.road({ len: size, w: 58 });
    apron.position.y = 0.014;
    group.add(apron);
    for (let i = 0; i < 6; i++) {
      const pw = rnd(8, 16), pl = rnd(8, 16);
      const patch = new THREE.Mesh(new THREE.PlaneGeometry(pw, pl), tileMat(T.ground, pw, pl));
      patch.rotation.x = -Math.PI / 2;
      patch.position.set(rnd(-22, 22), 0.016, rnd(-S / 2, S / 2));
      patch.receiveShadow = true;
      group.add(patch);
    }
    ctx.laneHalf = 26;
  } else {
    // plaza：铺装主广场 + 草地带
    const pv = new THREE.Mesh(new THREE.PlaneGeometry(ctx.plazaW, S), tileMat(T.ground, ctx.plazaW, S));
    pv.rotation.x = -Math.PI / 2;
    pv.position.y = 0.014;
    pv.receiveShadow = true;
    group.add(pv);
    for (let i = 0; i < 5; i++) {
      const lw = rnd(9, 18), ll = rnd(12, 22);
      /* 不再显式传 3.0 —— grassTex 已按 GRASS_TILE_M=3.0 画好图案，
         tileMat 会读它自己声明的 metersPerRepeat。
         两边都写一遍 = 两份定义，改一处忘另一处就是下一个静默失效。 */
      const lawn = new THREE.Mesh(new THREE.PlaneGeometry(lw, ll),
        tileMat(palette().common.grass, lw, ll));
      lawn.rotation.x = -Math.PI / 2;
      lawn.position.set(rnd(-22, 22), 0.018, rnd(-S / 2 + 8, S / 2 - 8));
      lawn.receiveShadow = true;
      group.add(lawn);
    }
    ctx.laneHalf = ctx.plazaW / 2;
  }
}

/* ══ 布局：巷弄（城中村 / 夜市 / 二手市场 / 花鸟市场）══════════════════ */
function layoutLane(ctx) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const half = ctx.laneHalf;
  const rows = [];
  for (const side of [-1, 1]) {
    let z = -S / 2;
    while (z < S / 2) {
      const w = rnd(6.5, 10.5);
      const d = rnd(7, 10);
      const floors = chance(0.25) ? rndInt(2, 3) : rndInt(3, spec.maxFloors || 6);
      const b = K.lowRise({ w, d, floors, tier });
      const x = side * (half + d / 2 + rnd(0.05, 0.6));
      ctx.place(b, x, z + w / 2, 0, { block: true });
      rows.push({ x, z: z + w / 2, d, w, side });
      z += w + rnd(0.1, 0.6);
    }
  }
  return rows;
}

/* ══ 布局：宽街（商业区 / 娱乐城 / 汽车城 / 银行）═════════════════════ */
function layoutAvenue(ctx) {
  const { tier } = ctx;
  const S = ctx.streetLen;
  const off = ctx.laneHalf;
  const rows = [];
  for (const side of [-1, 1]) {
    let z = -S / 2;
    while (z < S / 2) {
      const w = rnd(12, 20);
      const d = rnd(12, 17);
      const isTower = chance(tier >= 3 ? 0.62 : 0.3);
      let b;
      if (isTower) {
        b = K.tower({ w, d, floors: rndInt(tier >= 3 ? 8 : 5, tier >= 3 ? 20 : 11), tier });
      } else {
        b = K.slabBlock({ w, d, floors: rndInt(4, 7), tier, units: Math.max(3, Math.round(w / 4)) });
      }
      const x = side * (off + d / 2);
      ctx.place(b, x, z + w / 2, 0, { block: true });
      rows.push({ x, z: z + w / 2, d, w, side });
      z += w + rnd(0.6, 2.2);
    }
  }
  return rows;
}

/* ══ 布局：院区（小区 / 医院 / 社区中心 / 培训中心 / 菜市场）═══════════ */
function layoutCompound(ctx) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const cw = ctx.courtW || 46;
  const half = cw / 2;
  const wallH = tier >= 3 ? 2.0 : 2.4;
  const wallKind = tier >= 3 ? 'railing' : 'brick';

  // 四周围墙，正面留一个大门缺口
  const gap = 9;
  for (const side of [-1, 1]) {
    ctx.place(K.fenceWall({ len: S, h: wallH, tier, kind: wallKind }),
      side * (half + 0.4), 0, Math.PI / 2, { collide: 'auto' });
  }
  for (const sz of [-1, 1]) {
    const seg = (cw - gap) / 2;
    ctx.place(K.fenceWall({ len: seg, h: wallH, tier, kind: wallKind }),
      -(cw + gap) / 4, sz * (S / 2 - 0.4), 0, {});
    ctx.place(K.fenceWall({ len: seg, h: wallH, tier, kind: wallKind }),
      (cw + gap) / 4, sz * (S / 2 - 0.4), 0, {});
  }

  // 内部建筑：沿两侧排布，中间留出院子
  const rows = [];
  for (const side of [-1, 1]) {
    let z = -S / 2 + 8;
    const n = spec.blocks || 3;
    for (let i = 0; i < n; i++) {
      const w = rnd(14, 22);
      const d = rnd(10, 14);
      let b;
      if (spec.structure === 'tower') {
        b = K.tower({ w, d, floors: rndInt(7, 16), tier, podium: false });
      } else if (spec.structure === 'hall') {
        b = K.hall({ w, d, h: rnd(10, 15), tier, steps: false, columns: i === 0, roofStyle: 'flat' });
      } else {
        b = K.slabBlock({ w, d, floors: spec.floors || rndInt(4, 6), tier, units: Math.max(3, Math.round(w / 4)) });
      }
      const x = side * (half - d / 2 - rnd(0.5, 1.5));
      ctx.place(b, x, z + w / 2, 0, { block: true });
      rows.push({ x, z: z + w / 2, d, w, side });
      z += w + rnd(4, 9);
    }
  }
  // 大门
  if (spec.gate !== false) {
    const a = K.archway({ w: gap + 0.6, h: 5.4, text: spec.shortName || spec.name });
    ctx.place(a, 0, S / 2 - 0.4, 0, {});
  }
  // 出生点：刚进大门的位置，回头能看到门，往前能看到院子
  ctx.spawnZ = S / 2 - 16;
  return rows;
}

/* ══ 布局：厂区（工业区 / 物流园 / 批发市场 / 工地）═══════════════════ */
function layoutYard(ctx) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const rows = [];

  if (spec.structure === 'site') {
    /* 工地是一次"摆拍"而不是随机撒点：
       框架楼在正前方，脚手架挡在人眼前（近景纵深），塔吊在外侧压住天际线。
       随机撒点的结果是把最重要的主体扔到雾里去。 */
    const fw = rnd(20, 26), fd = rnd(14, 18), ff = rndInt(3, 6);
    const fx = -5;
    /* 出生点在 z = spawnZ(12)，玩家朝 -z 看。
       原来把 fz 也写成 12，等于房子正好压在出生点上，碰撞盒把角色顶死。
       往前推"半进深 + 6m 净空"：既保住"主体在正前方"的构图，
       又让出生点落在实地上。 */
    const fz = ctx.spawnZ - (fd / 2 + 6);
    const frame = frameBuilding({ w: fw, d: fd, floors: ff, tier });
    ctx.place(frame, fx, fz, 0.06, { block: true });

    /* 脚手架只贴框架楼的半幅立面（左半边）。
       铺满整面的话，它的碰撞盒会在出生点前方拉出一道 20m 的墙，
       角色一出生就被堵死——真的绕不过去。留半幅，人可以绕到右半边。 */
    const sc = K.scaffold({ w: fw * 0.5, h: ff * 2.9, d: 1.4 });
    ctx.place(sc, fx - fw * 0.24, fz + fd / 2 + 1.3, 0, {});

    const cr = K.crane({ h: 26 + ff * 2.8, jib: 22 });
    ctx.place(cr, 12, 3, 0.6, {});

    // 围挡
    for (const side of [-1, 1]) {
      ctx.place(K.fenceWall({ len: S, h: 2.6, tier, kind: 'hoarding' }), side * 24, 0, Math.PI / 2, {});
    }
    for (const sz of [-1, 1]) {
      ctx.place(K.fenceWall({ len: 40, h: 2.6, tier, kind: 'hoarding' }), 0, sz * (S / 2), 0, {});
    }
    // 工棚
    const hut = K.shed({ w: 8, d: 4.6, h: 3.2, tier, sawtooth: false, doors: 1, panel: palette().common.panelRust });
    ctx.place(hut, -15, 24, 0.18, { block: true });

    ctx.lots.push({ x: fx, z: fz + fd / 2 + 4, rot: 0, kind: 'site-center' });
    ctx.lots.push({ x: 4, z: 20, rot: 0, kind: 'site' });
    ctx.lots.push({ x: -14, z: 18, rot: 0, kind: 'site' });
    // 站在工地中央：框架楼 10m、脚手架 4m、塔吊 18m —— 都在视野里
    ctx.spawnZ = 22;
    return rows;
  }

  // —— 常规厂区 ——
  /* 厂房靠边站，中间留一条贯穿的通道。
     横向位置必须由进深 d 反推：写死 x 偏移的话，宽厂房会横跨到中线上，
     把出生点和主通道一起堵死（logistics_park 就栽在这）。 */
  const CORRIDOR = 5;   // 中央通道半宽。收到 5m 让厂房夹出一条工业巷道；
                        // 相机贴墙由 IsoCamera 的落点复检兜住，不再靠"把场地摊大"来回避
  /* 出生点必须在放道具之前定下来。
     放在后面赋值的话，ctx.spot() 的安全圈是按默认值算的 ——
     等于没避开真正的出生点，道具照样压在角色头上。 */
  ctx.spawnZ = S / 2 - 30;
  let z = -S / 2 + 6;
  while (z < S / 2 - 10) {
    const w = rnd(15, 21);      // 沿 z
    const d = rnd(11, 15);      // 进深（沿 x）
    const h = rnd(6, 9.5);
    const side = chance(0.5) ? -1 : 1;
    const b = K.shed({ w, d, h, tier, sawtooth: chance(0.7), doors: rndInt(2, 3) });
    const x = side * (CORRIDOR + d / 2 + rnd(0, 2));
    ctx.place(b, x, z + w / 2, side > 0 ? 0 : Math.PI, { block: true });
    rows.push({ x, z: z + w / 2, d, w, side });
    z += w + rnd(3, 8);
  }
  // 堆场杂物
  for (let i = 0; i < 5; i++) {
    const c = K.container({
      w: rnd(5, 7), d: 2.5, h: rnd(2.5, 3),
      color: pick([0x3f5a6a, 0x5a4a3a, 0x4a5a44, 0x6a5a4a]),
    });
    const cx = pick([-1, 1]) * rnd(2, 12);
    ctx.place(c, cx, sp2(-S / 2 + 6, S / 2 - 6, ctx.spawnZ), rnd(-0.4, 0.4) + (chance(0.5) ? 0 : Math.PI / 2), {});
  }
  /* 中央通道也要有东西 —— 但绝不能堆在正前方。
     早期的版本把料堆撒在 x ∈ [-5.5, 5.5]：那正是中轴，
     结果出生点正对面杵着一个大箱子，整个画面被挡住。
     现在强制偏离中轴、并与出生点在 z 上拉开距离，保证前方留出通视。 */
  const yardSpot = (clear) => {
    const side = chance(0.5) ? 1 : -1;
    const [x, z] = ctx.spot(side * 2.4, side * 7.5, -S / 2 + 8, S / 2 - 8, clear);
    // 再保证与出生点前后拉开 7m 以上
    if (Math.abs(z - ctx.spawnZ) < 7) return [x, z + (z < ctx.spawnZ ? -8 : 8)];
    return [x, z];
  };
  for (let i = 0; i < 4; i++) {
    const stack = new THREE.Group();
    const cw = rnd(4.2, 6.2), cd = 2.5;
    const c1 = K.container({ w: cw, d: cd, h: 2.6, color: pick([0x3f5a6a, 0x4a5a44, 0x6a5a4a, 0x5a4a3a]) });
    stack.add(c1);
    if (chance(0.45)) {
      const c2 = K.container({ w: cw, d: cd, h: 2.6, color: pick([0x4a5a44, 0x3f5a6a, 0x6a5a4a]) });
      c2.position.y = 2.6;
      c2.rotation.y = chance(0.5) ? 0 : 0.06;
      stack.add(c2);
    }
    const [sx, sz] = yardSpot(9);
    stack.userData.footprint = { w: cw, d: cd, h: 2.6 };   // 让叠放集装箱也参与碰撞
    ctx.place(stack, sx, sz, chance(0.5) ? 0 : Math.PI / 2, {});
  }
  // 钢管 / 卷材堆
  for (let i = 0; i < 8; i++) {
    const roll = new THREE.Mesh(
      chance(0.5) ? new THREE.CylinderGeometry(rnd(0.3, 0.55), rnd(0.3, 0.55), rnd(2.2, 4.5), 10)
        : new THREE.BoxGeometry(rnd(1.2, 2.2), rnd(0.5, 1.1), rnd(0.8, 1.4)),
      new THREE.MeshStandardMaterial({ color: pick([0x5a5a52, 0x6a6a62, 0x4a4a46, 0x6a5a4a]), roughness: 0.82, metalness: 0.3 }));
    roll.position.y = 0.5;
    roll.rotation.z = Math.PI / 2;
    roll.castShadow = true;
    const [rx, rz] = yardSpot(8);
    ctx.place(roll, rx, rz, rnd(0, Math.PI), {});
  }
  ctx.spawnZ = S / 2 - 30;

  /* —— 厂区：工业构件（GLB）——
     这一组是 Kenney industrial kit 里"只有工业场景才会出现"的形：
       · 储罐 detail-tank —— 程序化只能拼圆柱，缺罐顶与人孔，一眼假；
       · 烟囱 chimney-medium —— 厂区天际线的标志物；
       · 水塔 water-tower —— 老厂区/城中村边上的典型构筑物。
     ★ 全部用工厂函数（而不是直接 instance），因为它们自带程序化兜底。 */
  const tankCount = rndInt(1, 2);
  for (let i = 0; i < tankCount; i++) {
    const [x, z] = yardSpot(7);
    ctx.place(K.tankProp({ large: chance(0.4), tier }), x, z, rnd(0, Math.PI * 2), {});
  }
  {
    /* 烟囱与水塔要"远、但显眼"：贴着厂区后沿，压住天际线。
       放在 y=0 的地面上（它们自带基座），不要抬高。 */
    const chimX = pick([-1, 1]) * rnd(9, 15);
    ctx.place(K.chimneyProp({ kind: pick(['medium', 'large']) }), chimX, -S / 2 + rnd(8, 14), 0, {});
    const wtX = -chimX;
    ctx.place(K.waterTowerProp(), wtX, -S / 2 + rnd(10, 16), rnd(0, Math.PI * 2), {});
  }
  /* 散落的交通锥：厂区/工地的必然产物，面数极低可多放几个。
     ★ 这里必须用 ctx.spot 而不是 sp —— sp 是 propsFor 内部的局部别名，
       layoutYard 作用域里没有它（本行第一版写成 sp，直接 ReferenceError）。 */
  for (let i = 0; i < 4; i++) {
    const [x, z] = ctx.spot(-8, 8, -S / 2 + 8, S / 2 - 8, 5);
    ctx.place(K.trafficCone(), x, z, 0, {});
  }

  return rows;
}

/** 在 [a,b] 里取一个离出生点至少 4m 的 z */
function sp2(a, b, spawnZ) {
  for (let i = 0; i < 20; i++) {
    const z = rnd(a, b);
    if (Math.abs(z - (spawnZ || 0)) > 4) return z;
  }
  return a;
}

/** 未完工的混凝土框架楼（工地专属） */
function frameBuilding({ w, d, floors, tier = 1 }) {
  const g = new THREE.Group();
  const fh = 3.0;
  const concrete = palette().common.stone;
  const grid = { x: Math.max(2, Math.round(w / 4)), z: Math.max(2, Math.round(d / 4)) };
  for (let f = 0; f < floors; f++) {
    const y = f * fh;
    // 楼板
    const slab = new THREE.Mesh(new THREE.BoxGeometry(w, 0.28, d), concrete);
    slab.position.set(0, y + 0.14, 0);
    slab.castShadow = true; slab.receiveShadow = true;
    g.add(slab);
    // 柱子
    for (let ix = 0; ix <= grid.x; ix++) {
      for (let iz = 0; iz <= grid.z; iz++) {
        if (ix > 0 && ix < grid.x && iz > 0 && iz < grid.z) continue;
        const col = new THREE.Mesh(new THREE.BoxGeometry(0.42, fh, 0.42), concrete);
        col.position.set(-w / 2 + (ix * w) / grid.x, y + fh / 2, -d / 2 + (iz * d) / grid.z);
        col.castShadow = true;
        g.add(col);
      }
    }
  }
  // 顶部半截剪力墙（有"正在施工"的观感）
  const half = Math.max(2, Math.round(d / 4));
  for (let iz = 0; iz <= half; iz++) {
    const wall = new THREE.Mesh(new THREE.BoxGeometry(w * 0.94, fh * 0.6, 0.2), concrete);
    wall.position.set(0, floors * fh + fh * 0.3, -d / 2 + (iz * d) / half);
    wall.castShadow = true;
    g.add(wall);
  }
  // 钢筋头
  for (let i = 0; i < 14; i++) {
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, rnd(0.5, 1.3), 5),
      new THREE.MeshStandardMaterial({ color: 0x6a5a4a, roughness: 0.7, metalness: 0.5 }));
    bar.position.set(rnd(-w / 2, w / 2), floors * fh + rnd(0.3, 0.8), rnd(-d / 2, d / 2));
    g.add(bar);
  }
  g.userData.footprint = { w, d, h: floors * fh };
  return g;
}

/* ══ 布局：广场（公园 / 政务 / 法院 / 人才市场 / 图书馆 / 体育馆 / 寺庙 / 大学城 / 科技园）══ */
function layoutPlaza(ctx) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const rows = [];

  // 主建筑：坐北朝南，正面朝 +z（面向出生点方向）
  const bw = spec.mainW || (spec.structure === 'tower' ? rnd(18, 24) : rnd(24, 34));
  const bd = rnd(12, 18);
  let main;
  if (spec.structure === 'tower') {
    main = K.tower({ w: bw, d: bd, floors: rndInt(10, 20), tier });
  } else if (spec.structure === 'teaching') {
    main = K.teachingBlock({ w: bw, d: bd, floors: rndInt(4, 6), tier });
  } else if (spec.structure === 'pavilion') {
    main = K.hall({ w: bw, d: bd, h: 10, tier, steps: true, columns: true, roofStyle: 'hip' });
  } else {
    main = K.hall({
      w: bw, d: bd,
      h: spec.mainH || rnd(11, 17),
      tier,
      steps: spec.steps !== false,
      columns: true,
      roofStyle: spec.hipRoof ? 'hip' : 'flat',
    });
  }
  const mz = -S / 2 + bd / 2 + 14;
  ctx.place(main, 0, mz, 0, { block: true });
  rows.push({ x: 0, z: mz, d: bd, w: bw, side: 0 });
  // 出生点放在主楼前的广场上：主楼要能一眼看见，雾里透出轮廓
  ctx.spawnZ = Math.min(S / 2 - 8, mz + bd / 2 + 13);

  // 次要建筑：两侧各一栋（后排），拉开层次
  for (const side of [-1, 1]) {
    if (chance(0.25)) continue;
    const w = rnd(14, 22), d = rnd(10, 15);
    let b;
    if (spec.structure === 'teaching') b = K.teachingBlock({ w, d, floors: rndInt(3, 5), tier, corridor: chance(0.5) });
    else if (tier >= 3 && chance(0.5)) b = K.tower({ w: w * 0.8, d, floors: rndInt(6, 12), tier, podium: false });
    else b = K.slabBlock({ w, d, floors: rndInt(3, 6), tier, units: Math.max(2, Math.round(w / 4)) });
    ctx.place(b, side * rnd(20, 27), mz + rnd(6, 16), side > 0 ? -0.35 : 0.35, { block: true });
    rows.push({ x: side * 22, z: mz + 10, d, w, side });
  }

  // 入口序列：旗杆 / 牌坊 / 台阶广场
  if (spec.flagPole) {
    for (let i = 0; i < 3; i++) ctx.place(K.flagPole({ h: 11 }), (i - 1) * 4.5, mz + bd / 2 + 9, 0, {});
  }
  if (spec.gate) {
    const gap = 10;
    for (const side of [-1, 1]) {
      ctx.place(K.fenceWall({ len: S / 2 - gap / 2, h: 2.2, tier, kind: 'railing' }),
        side * (S / 4 + gap / 4), S / 2 - 1.5, 0, {});
    }
    ctx.place(K.archway({ w: gap + 0.8, h: 5.6, text: spec.shortName || spec.name }), 0, S / 2 - 1.5, 0, {});
  }

  /* —— 广场：遮阳伞（GLB，商业 kit）——
     广场/公园/夜市边缘的露天休息位。程序化的广场只有硬质铺装与树，
     加几把伞立刻有"人能坐下来"的暗示 —— 这是生活模拟场景最需要的。
     ★ 只放在**休闲性**广场：政务/法院/医院这类有 gate 的机构场地放伞
       不合逻辑（那里没有露天消费场景），故用 !spec.gate 排除。 */
  const parasolCount = spec.gate ? 0 : rndInt(2, 4);
  for (let i = 0; i < parasolCount; i++) {
    const [x, z] = ctx.spot(-10, 10, -S / 2 + 10, S / 2 - 10, 7);
    ctx.place(K.parasolProp({ variant: chance(0.5) ? 'a' : 'b' }), x, z, rnd(0, Math.PI * 2), {});
  }

  return rows;
}

/* ══ 道具包 ═══════════════════════════════════════════════════════════ */

const SHOP_NAMES = {
  slum: ['便利超市', '五金水电', '平价水果', '阿强理发', '兰州拉面', '手机维修', '废品回收', '宽带办理'],
  wholesaleMarket: ['南北干货', '冻品批发', '粮油批发', '一次性用品', '塑料制品'],
  night_market: ['烧烤', '麻辣烫', '炒粉炒面', '烤冷面', '炸串', '柠檬茶', '铁板鱿鱼', '糖水'],
  flea_market: ['收旧手机', '二手书', '旧家电', '古玩杂项', '旧衣翻新', '维修钟表'],
  flower_bird_market: ['绿植花卉', '观赏鱼', '鸟笼鸟粮', '宠物用品', '盆栽多肉'],
  vegetable_market: ['时令蔬菜', '猪牛羊肉', '活鱼水产', '粮油副食', '豆制品', '干货调料'],
  internet_cafe: ['网咖', '电竞馆', '奶茶'],
  commercialDist: ['潮流服饰', '数码旗舰店', '美妆', '烘焙', '零食优选', '运动装备'],
  entertainment: ['KTV', '电玩城', '影城', '棋牌室', '酒吧'],
  auto_city: ['汽车销售', '轮胎店', '汽修厂', '汽车美容', '汽配'],
  bank: ['储蓄所', '理财中心', 'ATM'],
  trainingCenter: ['公考培训', '电工焊工', '会计实操', '电脑培训'],
  default: ['杂货', '快递代收', '小卖部'],
};

function propsFor(ctx, kind, rows) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const half = ctx.laneHalf;
  const P = palette();
  const sp = (xa, xb, za, zb, clear) => ctx.spot(xa, xb, za, zb, clear);

  /* —— 通用：垃圾桶 ——
     散落道具一律走 ctx.spot()，避开出生点安全圈。
     否则垃圾桶/电动车会压住出生点，角色每帧被碰撞推出逻辑顶回去，表现为"走不动"。 */
  const binCount = Math.max(3, Math.round((spec.footfall || 0.6) * 10));
  for (let i = 0; i < binCount; i++) {
    const [x, z] = sp(-half, half, -S / 2, S / 2);
    const b = K.bin({ color: pick([0x8a7a3a, 0x3f6a44, 0x3a4a5a]), large: chance(0.3) });
    ctx.place(b, x, z, rnd(0, Math.PI * 2));
  }

  /* —— 外部资产（Kenney CC0 GLB）：路边件 ——
     这一组是全场景共享的"城市味"来源。为什么挑这几件：
       · 大垃圾箱 dumpster —— 程序化的圆桶只有"容器"语义，缺"街面"语义；
         Kenney 那只是带盖+轮的有体量箱体，一眼就是"城市后巷"。
       · 电线杆 —— 城中村/老城区的标志物，程序化拼的是纯圆杆，没有瓷瓶与横担。
       · 工况件（围挡/锥）—— 只在特定地点出现（见下面分层投放），
         因为它们携带"这里在施工"的叙事，撒满全城反而失真。
     ★ 全部走 glbProp：GLB 未就绪时自动显示程序化兜底，绝不空窗。 */
  const dumpsterCount = Math.max(1, Math.round((spec.footfall || 0.6) * 3));
  for (let i = 0; i < dumpsterCount; i++) {
    const [x, z] = sp(-half, half, -S / 2 + 3, S / 2 - 3, 4.5);
    ctx.place(K.dumpster(), x, z, rnd(-0.3, 0.3) + (chance(0.5) ? 0 : Math.PI / 2), {});
  }

  /* —— 通用：路灯 ——
     ★ [2026-09-18 美术 P0-3] 这一段原来只写在 `avenue` 分支里，
       于是**城中村（lane）根本没有路灯** —— 而夜间照明全靠它。
       症状极具迷惑性：夜间一片黑，但逐行看代码都正常 ——
       灯杆、灯头、灯罩、夜间点光源的代码全对，只是那段代码从不执行。
       （诊断路径：先加"灯锚点计数"读数 → 看到「遍历 5800 个对象 / 0 个锚点」，
        才把范围从"灯太弱"缩小到"压根没有灯"。）
     ★ 灯杆自带 userData.lampHead 锚点，bridge.js 靠它生成夜间点光源。 */
  for (let z = -S / 2 + 6; z < S / 2; z += 16) {
    for (const side of [-1, 1]) {
      if (Math.abs(z - ctx.spawnZ) < 3) continue;
      const l = K.streetLamp({ h: 7.4, tier });
      ctx.place(l, side * (half - 0.5), z, side > 0 ? Math.PI : 0, {});
    }
  }

  /* —— 通用：市政小件（Poly Haven CC0，米制）——
     ★ 2026-09-18 新增。这三件解决的是同一个问题：
       "街道两侧只有灯杆和垃圾桶，缺**市政基础设施**的那层细节"。
       程序化几何擅长造体量，但造不出"这是市政管网/管线"的语义，
       而这正是"城市"与"一堆方块"的分界。
       三件都极矮（消防栓 0.8m / 落水管贴墙 / 卷帘窗 1.4m），
       不抢视线高度，只负责近景的可信度。
     ★ 为什么不撒满：消防栓在真实城市里 ~50m 一个，
       撒满会变成"消防栓森林"，反而假。按人行道间隔取稀疏分布。 */
  for (let z = -S / 2 + 10; z < S / 2 - 6; z += 22) {
    for (const side of [-1, 1]) {
      if (Math.abs(z - ctx.spawnZ) < 3) continue;
      if (chance(0.45)) continue;
      const h = K.hydrantProp();
      ctx.place(h, side * (half - 1.3) + rnd(-0.3, 0.3), z + rnd(-2, 2), rnd(0, Math.PI * 2), {});
    }
  }

  /* —— 通用：建筑外立面附属件（Poly Haven）——
     给沿街建筑挂落水管与卷帘窗。
     ★ 为什么挂在**建筑**而不是散在街上：这两件是"长在墙上"的构件，
       离开墙就没有意义。故位置从 rows（沿街建筑行）反推，
       与 shopUnit 用同一套坐标推导，保证贴墙不悬空。 */
  rows.forEach((r) => {
    const side = Math.sign(r.x) || 1;
    const wallX = side * (Math.abs(r.x) - r.d / 2 - 0.12);
    /* 落水管：沿墙一条竖管。MO 面几乎为零但视觉收益高。 */
    if (chance(0.6)) {
      const g = K.gutterProp();
      ctx.place(g, wallX, r.z + (chance(0.5) ? -1 : 1) * (r.w / 2 - 0.6), side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    }
    /* 卷帘窗：铺面的侧窗。只有部分铺子拉下来（打烊感）。 */
    if (chance(0.4)) {
      const w = K.shutterWindowProp({ variant: 1 + Math.floor(rnd(0, 3)) });
      ctx.place(w, wallX, r.z + rnd(-r.w / 3, r.w / 3), side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    }
  });

  if (kind === 'lane') {
    // 沿巷店铺门脸
    const names = SHOP_NAMES[spec.id] || SHOP_NAMES.default;
    rows.forEach((r, i) => {
      if (chance(0.42)) return;
      const txt = names[i % names.length];
      const front = K.shopUnit({
        width: Math.min(r.w * 0.86, 5.6), sign: txt, tier, open: chance(0.65),
      });
      front.position.set(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 0.16), 0, r.z);
      front.rotation.y = r.x > 0 ? -Math.PI / 2 : Math.PI / 2;
      ctx.addRaw(front);
      ctx.lot(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 1.7), r.z, 0, 'shop');
    });

    // 电线杆 + 飞线
    const poles = [];
    for (let z = -S / 2 + 4; z <= S / 2 - 4; z += 9) {
      for (const side of [-1, 1]) {
        const p = K.pole();
        const x = side * (half + 0.6);
        ctx.place(p, x, z + rnd(-1.2, 1.2), 0, {});
        poles.push(p);
        ctx.colliders.push({ minX: x - 0.28, maxX: x + 0.28, minZ: p.position.z - 0.28, maxZ: p.position.z + 0.28 });
      }
    }
    for (let i = 0; i < poles.length; i++) {
      const a = poles[i], b2 = poles[i + 2];
      if (b2) {
        for (let k = 0; k < 2; k++) {
          const y = 7.3 - k * 0.7;
          ctx.addRaw(K.wire(
            new THREE.Vector3(a.position.x, y, a.position.z),
            new THREE.Vector3(b2.position.x, y, b2.position.z), rnd(0.7, 1.5)));
        }
      }
      if (chance(0.68)) {
        const opp = poles.find(p => Math.sign(p.position.x) !== Math.sign(a.position.x)
          && Math.abs(p.position.z - a.position.z) < 3.6);
        if (opp) {
          ctx.addRaw(K.wire(
            new THREE.Vector3(a.position.x, rnd(6.2, 7.4), a.position.z),
            new THREE.Vector3(opp.position.x, rnd(6.2, 7.4), opp.position.z), rnd(1.0, 2.0)));
        }
      }
    }

    // 电动车 / 三轮车：贴着巷子两边停
    for (let i = 0; i < 9; i++) {
      const side = chance(0.5) ? -1 : 1;
      const [x, z] = sp(side * half * 0.42, side * half * 0.66, -S / 2 + 2, S / 2 - 2);
      const kindOf = chance(0.22) ? 'tricycle' : chance(0.2) ? 'bike' : 'scooter';
      const s = K.twoWheeler({ kind: kindOf, color: pick([0x2f3a44, 0x6b3a34, 0x3a4a3a, 0x555a60]) });
      s.rotation.y = side > 0 ? rnd(-0.4, 0.4) + Math.PI : rnd(-0.4, 0.4);
      ctx.place(s, x, z, s.rotation.y, {});
    }

    // 夜市专属：摊位 + 串灯
    if (spec.id === 'night_market') {
      for (let z = -S / 2 + 8; z < S / 2 - 6; z += rnd(6.5, 10)) {
        for (const side of [-1, 1]) {
          const [x, zz] = sp(side * (half - 1.5), side * (half - 1.2), z - 1, z + 1, 2.4);
          const st = K.stall({ w: rnd(2.0, 2.8), d: 1.2, tier, box: true });
          ctx.place(st, x, zz, side > 0 ? Math.PI / 2 : -Math.PI / 2, {});
          ctx.lot(x - side * 1.4, zz, 0, 'stall');
        }
      }
      for (let z = -S / 2 + 10; z < S / 2 - 8; z += 9) {
        const y = 5.2;
        const a = new THREE.Vector3(-half - 0.3, y, z), b = new THREE.Vector3(half + 0.3, y, z + rnd(-1, 1));
        ctx.addRaw(K.wire(a, b, 0.5));
        for (let k = 1; k < 9; k++) {
          const p = new THREE.Vector3().lerpVectors(a, b, k / 9);
          p.y -= Math.sin((k / 9) * Math.PI) * 0.5;
          const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.075, 6, 5),
            new THREE.MeshBasicMaterial({ color: pick([0xffd890, 0xffb060, 0xffe8b0]) }));
          bulb.position.copy(p);
          ctx.addRaw(bulb);
        }
      }
    }

    /* —— 城中村：电线杆（GLB）——
       巷子两侧已有程序化电线杆（上面那圈 poles）。这里额外补 Kenney 的
       electricity-pole 作为**更强的形状信号** —— 那种带瓷瓶与横担的杆，
       是"这是中国城中村/老城区"最快被认出来的符号之一。
       只撒少量（3 根），避免与程序化杆抢位置显得杂乱。 */
    for (let i = 0; i < 3; i++) {
      const [x, z] = sp(-half * 0.9, half * 0.9, -S / 2 + 6, S / 2 - 6, 6);
      ctx.place(K.utilityPole(), x, z, rnd(-0.2, 0.2), {});
    }

    /* —— 城中村专属：外部资产（Poly Haven）——
       这三件是**只有城中村才成立**的构筑物，放到 CBD/广场会失真，
       所以写在这个分支里而不是通用段：
         · 高压电线杆（10m，带横担绝缘子）—— 城中村的"盘丝"天际线由它撑起；
           程序化那根纯圆杆没有横担，撑不起这个意象。
         · 外挂消防梯（6.5m）—— 老宿舍楼/厂房的侧墙标志，
           是"这栋楼很旧、是加建/改建过"的最强视觉线索。
         · 铁丝网围栏 —— 城中村边缘的废地/工地边界，
           真实且廉价地界定"这里不是给人走的"。 */
    for (let i = 0; i < 3; i++) {
      const [x, z] = sp(-half * 0.85, half * 0.85, -S / 2 + 8, S / 2 - 8, 7);
      ctx.place(K.powerPoleProp(), x, z, rnd(-0.3, 0.3), {});
    }
    /* 消防梯贴建筑侧墙 —— 位置由 rows 反推，与 shopUnit 同侧。 */
    rows.forEach((r) => {
      if (chance(0.55)) return;
      const side = Math.sign(r.x) || 1;
      const fe = K.fireEscapeProp();
      ctx.place(fe, side * (Math.abs(r.x) - r.d / 2 - 0.7), r.z + rnd(-r.w / 3, r.w / 3),
        side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    });
    /* 铁丝网：沿场地边缘拉几段。 */
    for (let i = 0; i < 4; i++) {
      const t = -S / 2 + 8 + i * (S - 16) / 3;
      const side = chance(0.5) ? -1 : 1;
      ctx.place(K.chainlinkProp(), side * (half - 0.4), t + rnd(-2, 2), side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    }

    /* —— 城中村：遮阳篷（GLB，商业 kit）——
       挂在店铺门脸那一侧，把"小卖部招牌"升级成"有生活气的铺子"。
       ★ 位置由 rows 反推，与 shopUnit 同侧同 z —— 否则篷子会飘在路中央。 */
    rows.forEach((r, i) => {
      if (chance(0.55)) return;
      const wide = chance(0.4);
      const a = K.awningProp({ wide });
      const side = Math.sign(r.x) || 1;
      ctx.place(a, side * (Math.abs(r.x) - r.d / 2 - 0.5), r.z, side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    });

    return;
  }

  if (kind === 'avenue') {

    // 沿街商铺：贴在每栋楼的临街一侧
    const names = SHOP_NAMES[spec.id] || SHOP_NAMES.default;
    let idx = 0;
    for (const r of rows) {
      const n = rndInt(1, 3);
      const unitW = r.w / (n + 0.4);
      for (let i = 0; i < n; i++) {
        const txt = names[idx++ % names.length];
        const u = K.shopUnit({ width: unitW, sign: txt, tier, open: chance(0.78), height: 3.8 });
        const zz = r.z - r.w / 2 + unitW * (i + 0.7);
        u.position.set(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 0.18), 0, zz);
        u.rotation.y = r.x > 0 ? -Math.PI / 2 : Math.PI / 2;
        ctx.addRaw(u);
        ctx.lot(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 2.1), zz, 0, 'shop');
      }
    }
    // 广告牌
    for (let i = 0; i < 4; i++) {
      const [x, z] = sp(-18, 18, -S / 2 + 10, S / 2 - 10);
      ctx.place(K.billboard({
        w: rnd(3, 4.6), h: rnd(2, 3), y: rnd(3, 4.4),
        text: pick(['限时特惠', '全场五折', '新店开业', '招聘中', '分期免息']),
        bg: pick(['#3a4a58', '#5a3038', '#3f4a3a']), fg: '#e8e4d8',
      }), x, z, rnd(-0.3, 0.3) + (chance(0.5) ? 0 : Math.PI / 2), {});
    }
    // 车：沿车道两侧
    for (let i = 0; i < 7; i++) {
      const side = chance(0.5) ? -1 : 1;
      const [x, z] = sp(side * 2.5, side * (half - 4), -S / 2 + 4, S / 2 - 4, 4.5);
      const c = K.car({ color: pick([0x3a4148, 0x6a6f74, 0x2f3a44, 0x5a4a44, 0x8a8f92]) });
      ctx.place(c, x, z, side > 0 ? 0 : Math.PI, {});
    }
    for (let i = 0; i < 8; i++) {
      const side = chance(0.5) ? -1 : 1;
      const [x, z] = sp(side * (half - 1.4), side * (half - 0.2), -S / 2, S / 2, 3.2);
      const s = K.twoWheeler({ kind: chance(0.3) ? 'bike' : 'scooter', color: pick([0x2f3a44, 0x6b3a34, 0x3a4a3a]) });
      ctx.place(s, x, z, rnd(0, Math.PI * 2), {});
    }
    // 公交站
    const [bsx, bsz] = sp(-14, 14, -S / 2 + 8, S / 2 - 8, 6);
    ctx.place(K.busShelter(), bsx, bsz, chance(0.5) ? Math.PI : 0, {});

    /* —— 大道专属：市政路障 + 拉下的卷帘门（Poly Haven）——
       · 路障：给大道一个"某处正在封路施工"的叙事缺口。
         撒 2 处成对出现（真实封路不会只放一个）。
       · 卷帘门：大道商铺有 1/5 概率是**拉下来的**（非营业时段感），
         位置贴着 shopUnit 的门洞，高度 2.4m 刚好盖住门脸下方。 */
    for (let i = 0; i < 2; i++) {
      const [x, z] = sp(-half + 3, half - 3, -S / 2 + 12, S / 2 - 12, 8);
      const rot = chance(0.5) ? 0 : Math.PI / 2;
      ctx.place(K.roadBarrierProp({ variant: 1 }), x, z, rot, {});
      ctx.place(K.roadBarrierProp({ variant: 2 }), x + (rot === 0 ? 2.2 : 0), z + (rot === 0 ? 0 : 2.2), rot, {});
    }
    rows.forEach((r) => {
      if (chance(0.78)) return;
      const side = Math.sign(r.x) || 1;
      const d = K.shutterDoorProp();
      ctx.place(d, side * (Math.abs(r.x) - r.d / 2 - 0.2), r.z + rnd(-r.w / 3, r.w / 3),
        side > 0 ? -Math.PI / 2 : Math.PI / 2, {});
    });
    return;
  }

  if (kind === 'compound') {
    // 院子里的生活痕迹
    for (let i = 0; i < 10; i++) {
      const [x, z] = sp(-half + 2, half - 2, -S / 2 + 5, S / 2 - 5);
      ctx.place(K.tree({ h: rnd(4.5, 7), tier }), x, z, rnd(0, Math.PI * 2), {});
    }
    for (let i = 0; i < 8; i++) {
      const [x, z] = sp(-half + 3, half - 3, -S / 2 + 6, S / 2 - 6);
      ctx.place(K.bench(), x, z, rnd(0, Math.PI * 2), {});
    }
    for (let i = 0; i < 6; i++) {
      const [x, z] = sp(-half + 2, half - 2, -S / 2 + 5, S / 2 - 5);
      ctx.place(K.bin({ color: pick([0x3f6a44, 0x8a7a3a]) }), x, z, rnd(0, Math.PI * 2), {});
    }
    // 自行车棚（老小区的楼道口）
    for (let i = 0; i < 12; i++) {
      const [x, z] = sp(-half + 3, half - 3, -S / 2 + 6, S / 2 - 6, 2.6);
      const b = K.twoWheeler({ kind: chance(0.65) ? 'bike' : 'scooter', color: pick([0x3a4a3a, 0x4a4a5a, 0x5a3a3a]) });
      ctx.place(b, x, z, rnd(0, Math.PI * 2), {});
    }
    // 宣传栏
    for (let i = 0; i < 3; i++) {
      const [x, z] = sp(-half + 4, half - 4, -S / 2 + 10, S / 2 - 10, 5);
      ctx.place(K.billboard({
        w: 3.2, h: 1.8, y: 2.2,
        text: pick(['社区公告', '文明公约', '收费标准\n明码标价', '招聘信息']),
        bg: '#e0dcd0', fg: '#3a3a36',
      }), x, z, chance(0.5) ? 0 : Math.PI / 2, {});
    }
    // 菜市场 / 批发：摊位成排
    if (spec.stalls) {
      const names = SHOP_NAMES[spec.id] || SHOP_NAMES.default;
      let k = 0;
      for (let z = -S / 2 + 10; z < S / 2 - 10; z += 4.4) {
        for (const side of [-1, 1]) {
          const [x, zz] = sp(side * 5, side * 12, z - 1.2, z + 1.2, 2.6);
          const st = K.stall({ w: rnd(2.2, 3.0), d: 1.4, tier, box: true });
          ctx.place(st, x, zz, side > 0 ? Math.PI / 2 : -Math.PI / 2, {});
          if (chance(0.55)) ctx.lot(x - side * 1.5, zz, 0, 'stall');
        }
        ctx.place(K.billboard({
          w: 2.4, h: 0.7, y: 3.4, text: names[k++ % names.length], bg: '#5a4030', fg: '#e8dcc8', legs: false,
        }), rnd(-8, 8), z, 0, {});
      }
    }
    // 医院：排队护栏 + 救护车
    if (spec.id === 'hospital') {
      const rail = K.queueRail({ len: 7, rows: 3 });
      rail.position.set(0, 0, ctx.spawnZ - 12);
      rail.userData.noMerge = true;
      ctx.addRaw(rail);
      ctx.place(K.car({ color: 0xd8d8d0, kind: 'truck' }), rnd(-10, -5), ctx.spawnZ - 6, Math.PI / 2, {});
    }
    return;
  }

  if (kind === 'yard') {
    // 货运车辆
    for (let i = 0; i < 5; i++) {
      const [x, z] = sp(-half + 5, half - 5, -S / 2 + 6, S / 2 - 6, 5);
      const c = K.car({ color: pick([0x3a4148, 0x5a5a5a, 0x4a5a6a]), kind: chance(0.6) ? 'truck' : 'sedan' });
      ctx.place(c, x, z, chance(0.5) ? 0 : Math.PI / 2, {});
    }
    for (let i = 0; i < 6; i++) {
      const [x, z] = sp(-half + 4, half - 4, -S / 2 + 4, S / 2 - 4, 3.2);
      ctx.place(K.twoWheeler({ kind: 'tricycle', color: pick([0x4a5a4a, 0x6a4a3a]) }), x, z, rnd(0, Math.PI * 2), {});
    }
    for (let i = 0; i < 4; i++) {
      const [x, z] = sp(-half + 4, half - 4, -S / 2 + 4, S / 2 - 4, 3.2);
      ctx.place(K.bin({ large: true }), x, z, rnd(0, Math.PI * 2), {});
    }
    if (spec.structure === 'site') {
      // 工地堆放：钢筋 / 模板 / 砂石
      for (let i = 0; i < 14; i++) {
        const [x, z] = sp(-half + 4, half - 4, -S / 2 + 4, S / 2 - 4, 3.0);
        const stock = new THREE.Mesh(
          chance(0.5) ? new THREE.BoxGeometry(rnd(1.4, 2.6), rnd(0.3, 0.7), rnd(0.9, 1.5))
            : new THREE.CylinderGeometry(rnd(0.3, 0.6), rnd(0.3, 0.6), rnd(1.2, 3), 10),
          new THREE.MeshStandardMaterial({ color: pick([0x6a5a4a, 0x8a8078, 0x5a4a3a, 0x4a4a4a]), roughness: 0.9, metalness: 0.2 }));
        stock.position.y = 0.4;
        stock.castShadow = true;
        ctx.place(stock, x, z, rnd(0, Math.PI), {});
      }
      for (let i = 0; i < 8; i++) {
        const [x, z] = sp(-half + 4, half - 4, -S / 2 + 4, S / 2 - 4, 3.0);
        ctx.place(K.barrier({ kind: chance(0.6) ? 'cone' : 'fence' }), x, z, rnd(0, Math.PI * 2), {});
      }
      // 安全标语
      ctx.place(K.billboard({
        w: 5, h: 1.5, y: 3.2, text: '安全第一 质量为本', bg: '#8a3a2a', fg: '#f0e4cc', legs: false,
      }), -21, ctx.spawnZ + 6, Math.PI / 2, {});
    }
    return;
  }

  // plaza
  for (let i = 0; i < 16; i++) {
    const [x, z] = sp(-half + 3, half - 3, -S / 2 + 4, S / 2 - 4);
    ctx.place(K.tree({ h: rnd(4.5, 8.5), tier, kind: chance(0.18) ? 'palm' : 'broad' }), x, z, rnd(0, Math.PI * 2), {});
  }
  for (let i = 0; i < 7; i++) {
    const [x, z] = sp(-half + 4, half - 4, -S / 2 + 8, S / 2 - 8);
    ctx.place(K.bench(), x, z, rnd(0, Math.PI * 2), {});
  }
  for (let i = 0; i < 8; i++) {
    const [x, z] = sp(-half + 3, half - 3, -S / 2 + 6, S / 2 - 6, 3.0);
    ctx.place(K.streetLamp({ h: 6.6, tier }), x, z, rnd(0, Math.PI * 2), {});
  }
  for (let i = 0; i < 6; i++) {
    const [x, z] = sp(-half + 3, half - 3, -S / 2 + 6, S / 2 - 6);
    ctx.place(K.bin({ color: pick([0x3f6a44, 0x8a7a3a]) }), x, z, 0, {});
  }
  for (let i = 0; i < 5; i++) {
    const [x, z] = sp(-half + 4, half - 4, -S / 2 + 10, S / 2 - 10);
    ctx.place(K.planter({ w: rnd(1.4, 2.4), d: rnd(1.4, 2.4) }), x, z, 0, {});
  }
  for (let i = 0; i < 5; i++) {
    const [x, z] = sp(-half + 4, half - 4, -S / 2 + 8, S / 2 - 8, 2.8);
    const b = K.twoWheeler({ kind: chance(0.6) ? 'bike' : 'scooter', color: pick([0x3a4a3a, 0x4a4a5a, 0x5a3a3a, 0x2f3a44]) });
    ctx.place(b, x, z, rnd(0, Math.PI * 2), {});
  }
  // 特色件
  if (spec.id === 'park') {
    ctx.place(K.pavilion({ r: 2.6 }), rnd(-14, 14), rnd(-6, 6), 0, {});
    ctx.place(K.fountain({ r: 3.2 }), rnd(-16, 16), rnd(2, 14), 0, {});
  }
  if (spec.id === 'temple') {
    ctx.place(K.pavilion({ r: 2.2, tier }), rnd(-16, -8), rnd(-4, 6), 0, {});
    const burner = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 1.3, 14),
      new THREE.MeshStandardMaterial({ color: 0x5a4a3a, roughness: 0.75, metalness: 0.35 }));
    burner.position.y = 0.65; burner.castShadow = true;
    ctx.place(burner, 0, ctx.spawnZ - 16, 0, {});
  }
  if (spec.id === 'techPark') {
    ctx.place(K.fountain({ r: 3.6 }), 0, ctx.spawnZ - 18, 0, {});
    for (let i = 0; i < 8; i++) {
      const [x, z] = sp(-18, 18, -S / 2 + 8, S / 2 - 8, 5);
      ctx.place(K.car({ color: pick([0x2f3a44, 0x8a8f92, 0x3a4148, 0x5a6a7a]) }), x, z, chance(0.5) ? 0 : Math.PI, {});
    }
  }
  if (spec.id === 'gov_office' || spec.id === 'court') {
    const rail = K.queueRail({ len: 8, rows: 4 });
    rail.position.set(0, 0, ctx.spawnZ - 10);
    rail.userData.noMerge = true;
    ctx.addRaw(rail);
    for (let i = 0; i < 5; i++) {
      const [x, z] = sp(-16, 16, S / 2 - 22, S / 2 - 12, 4);
      ctx.place(K.car({ color: pick([0x2f3a44, 0x3a4148, 0x5a5a5a]) }), x, z, chance(0.5) ? 0 : Math.PI, {});
    }
  }
  if (spec.id === 'school' && spec.gym) {
    ctx.place(K.hall({ w: 24, d: 16, h: 13, tier, steps: false, columns: false, roofStyle: 'flat' }), 0, S / 2 - 24, 0, { block: true });
  }
  if (spec.id === 'gym') {
    ctx.place(K.hall({ w: 30, d: 20, h: 15, tier, steps: true, columns: false, roofStyle: 'flat' }), 0, S / 2 - 26, 0, { block: true });
  }
  if (spec.id === 'job_market' || spec.id === 'library' || spec.id === 'community_center') {
    for (let i = 0; i < 4; i++) {
      const [x, z] = sp(-16, 16, -S / 2 + 14, S / 2 - 14, 5);
      ctx.place(K.billboard({
        w: 4, h: 2.4, y: 2.4,
        text: pick(['招聘信息\n每日更新', '免费求职登记', '开放时间\n09:00-21:00', '新书上架']),
        bg: '#3a4a58', fg: '#e8e4d8',
      }), x, z, chance(0.5) ? 0 : Math.PI / 2, {});
    }
  }
}

function side_sign(v) { return v === 0 ? 1 : Math.sign(v); }

/* ══ 29 个地点的配方表 ═══════════════════════════════════════════════════
   layout:   lane | avenue | compound | yard | plaza
   structure: lowRise | slab | tower | hall | shed | teaching | site
   ═══════════════════════════════════════════════════════════════════════ */
export const SPECS = {
  slum: { layout: 'lane', structure: 'lowRise', streetLen: 100, roadW: 9.5, maxFloors: 6 },
  wholesaleMarket: { layout: 'yard', structure: 'shed', streetLen: 92 },
  construction: { layout: 'yard', structure: 'site', streetLen: 86 },
  factoryZone: { layout: 'yard', structure: 'shed', streetLen: 104 },
  school: { layout: 'plaza', structure: 'teaching', streetLen: 104, plazaW: 50, mainW: 40, gym: true, gate: true, shortName: '大学城' },
  commercialDist: { layout: 'avenue', structure: 'tower', streetLen: 108, roadW: 16 },
  techPark: { layout: 'plaza', structure: 'tower', streetLen: 104, plazaW: 52, mainW: 26, flagPole: true },
  hospital: { layout: 'compound', structure: 'tower', streetLen: 96, courtW: 38, blocks: 3, gate: true, shortName: '医院' },
  bank: { layout: 'avenue', structure: 'tower', streetLen: 78, roadW: 14 },
  park: { layout: 'plaza', structure: 'hall', streetLen: 96, plazaW: 56, mainW: 17, mainH: 8, gate: true, shortName: '公园' },
  community_center: { layout: 'plaza', structure: 'hall', streetLen: 84, plazaW: 46, mainW: 26, gate: true, shortName: '社区中心' },
  night_market: { layout: 'lane', structure: 'lowRise', streetLen: 96, roadW: 10, maxFloors: 4 },
  trainingCenter: { layout: 'compound', structure: 'hall', streetLen: 82, courtW: 34, blocks: 2, gate: true, shortName: '培训中心' },
  suburb: { layout: 'lane', structure: 'lowRise', streetLen: 110, roadW: 11, maxFloors: 3 },
  luxury_community: { layout: 'compound', structure: 'tower', streetLen: 104, courtW: 40, blocks: 4, gate: true, shortName: '高档小区' },
  old_community: { layout: 'compound', structure: 'slab', streetLen: 96, courtW: 38, blocks: 3, floors: 6, gate: true, shortName: '老旧小区' },
  gov_office: { layout: 'plaza', structure: 'hall', streetLen: 96, plazaW: 50, mainW: 36, flagPole: true, gate: true, shortName: '政务大厅' },
  court: { layout: 'plaza', structure: 'hall', streetLen: 92, plazaW: 50, mainW: 32, flagPole: true, hipRoof: true, gate: true, shortName: '人民法院' },
  job_market: { layout: 'plaza', structure: 'hall', streetLen: 88, plazaW: 46, mainW: 30, gate: true, shortName: '人才市场' },
  entertainment: { layout: 'avenue', structure: 'tower', streetLen: 96, roadW: 15 },
  temple: { layout: 'plaza', structure: 'pavilion', streetLen: 84, plazaW: 46, mainW: 28, hipRoof: true, gate: true, shortName: '古寺' },
  library: { layout: 'plaza', structure: 'hall', streetLen: 88, plazaW: 48, mainW: 32, gate: true, shortName: '图书馆' },
  gym: { layout: 'plaza', structure: 'hall', streetLen: 100, plazaW: 54, mainW: 30, gate: true, shortName: '体育馆' },
  internet_cafe: { layout: 'lane', structure: 'lowRise', streetLen: 72, roadW: 9, maxFloors: 5 },
  logistics_park: { layout: 'yard', structure: 'shed', streetLen: 108 },
  auto_city: { layout: 'avenue', structure: 'tower', streetLen: 100, roadW: 18 },
  flower_bird_market: { layout: 'lane', structure: 'lowRise', streetLen: 88, roadW: 11, maxFloors: 3 },
  flea_market: { layout: 'lane', structure: 'lowRise', streetLen: 84, roadW: 10, maxFloors: 3 },
  vegetable_market: { layout: 'compound', structure: 'hall', streetLen: 80, courtW: 36, blocks: 2, gate: true, stalls: true, shortName: '菜市场' },
};

export const LAYOUT_KIND = {
  lane: '巷弄', avenue: '商业街', compound: '院区', yard: '厂区', plaza: '广场',
};

let _paletteReady = false;

/** 主入口：按地点 id 生成 3D 场景 */
export function buildLocation(scene, gamedata, id, opts = {}) {
  const loc = gamedata.locations[id];
  if (!loc) throw new Error(`未知地点: ${id}`);
  const spec = { ...(SPECS[id] || SPECS.community_center), name: loc.name, id, shortName: loc.name };

  if (!_paletteReady) { K.initKit(palette()); _paletteReady = true; }

  const tier = Math.min(3, Math.max(1, loc.wealthTier | 0));
  const ctx = new Ctx(scene, spec, tier);
  const kind = spec.layout;

  /* ★ 告诉 kit："接下来这些 glbProp 登记都属于本体地点组"。
     为什么需要：外部资产是异步的，登记表要在"世界被销毁"时按组清理。
     光靠遍历祖先链在 dispose 时序上不可靠（见 kit.js::dropPendingAssets）。
     用 try/finally 保证异常时也恢复所有者，不会把 owner 泄漏给下一个地点。 */
  const releaseOwner = K.setAssetOwner(ctx.group);
  let rows = [];
  try {
    groundFor(ctx, kind);

    if (kind === 'lane') rows = layoutLane(ctx);
    else if (kind === 'avenue') rows = layoutAvenue(ctx);
    else if (kind === 'compound') rows = layoutCompound(ctx);
    else if (kind === 'yard') rows = layoutYard(ctx);
    else rows = layoutPlaza(ctx);

    propsFor(ctx, kind, rows);
  } finally {
    releaseOwner();
  }

  // —— 交互点：绑定真实职业数据 ——
  placeHotspots(ctx, loc, kind);

  const spawn = new THREE.Vector3(0, 0, ctx.spawnZ);

  // 可行走范围：巷弄/商业街按街宽，院区按院墙，厂区按堆场，广场按铺装
  const halfZ = ctx.streetLen / 2 - 1.5;
  const bounds = {
    minX: -ctx.laneHalf + 1, maxX: ctx.laneHalf - 1,
    minZ: -halfZ, maxZ: halfZ,
  };

  /* 机位预设：俯角越大越"俯视图"，越小越"跟肩视角"。
     俯角偏大时地面会吃掉画面下半部、建筑全被顶到上沿 —— 视觉上像在看地图。
     这里统一收到 40-42°，让街道立面重新成为画面主体。 */
  const CAMERA = {
    lane: { yaw: 0.38, pitch: 0.70, dist: 16, minH: 5.2 },
    avenue: { yaw: 0.38, pitch: 0.70, dist: 17, minH: 5.5 },
    compound: { yaw: 0.38, pitch: 0.71, dist: 17, minH: 5.8 },
    yard: { yaw: 0.46, pitch: 0.70, dist: 17, minH: 6.5 },
    plaza: { yaw: 0.38, pitch: 0.72, dist: 18, minH: 7.5 },
  };

  return {
    id,
    name: loc.name,
    meta: loc,
    group: ctx.group,
    colliders: ctx.colliders,
    blockers: ctx.blockers,
    hotspots: ctx.hotspots,
    spawn,
    bounds,
    camera: CAMERA[kind] || CAMERA.lane,
    laneHalf: ctx.laneHalf,
    streetLen: ctx.streetLen,
    stats: { tier, layout: kind, layoutName: LAYOUT_KIND[kind], structure: spec.structure },
  };
}

/* 交互点：把该地点的真实内容绑到可行走的位置上。
   四类来源，全部来自游戏本体数据，3D 场景不自造内容：
     work    街头工作   jobs.js
     action  特色行动   actions.js
     service 服务设施   amenities.js
     trade   买卖货品   goods.js × locations.js 的 priceMod
   优先用布局阶段登记的空位（店铺门前、摊位旁），不够再按布局补。 */
function placeHotspots(ctx, loc, kind) {
  const half = ctx.laneHalf;
  const S = ctx.streetLen;

  const entries = [];
  for (const j of (loc.jobs || [])) {
    entries.push({ kind: 'work', id: j.id, name: j.name, icon: j.icon || '💼', data: j });
  }
  for (const a of (loc.actions || [])) {
    entries.push({ kind: 'action', id: a.id, name: a.name, icon: a.icon || '⚡', data: a });
  }
  /* 扩展行动（phase1/actions_extra.js）与违法行为（core/illegal_actions.js）是
     第五、第六个数据源。少了它们，图书馆 / 娱乐城在场景里就是一片空地 ——
     而这两个地点在游戏里其实各有 3 个专属行动和一个灰色玩法。 */
  for (const a of (loc.actionsExtra || [])) {
    entries.push({ kind: 'extra', id: a.id, name: a.name, icon: a.icon || '⚡', data: a });
  }
  for (const a of (loc.illegal || [])) {
    entries.push({ kind: 'risk', id: a.id, name: a.name, icon: a.icon || '⚠️', data: a });
  }
  for (const a of (loc.amenities || [])) {
    entries.push({ kind: 'service', id: a.id, name: a.name, icon: a.icon || '🏪', data: a });
  }
  if ((loc.buy || []).length || (loc.sell || []).length) {
    entries.push({
      kind: 'trade', id: `${loc.id}_trade`, name: '买卖交易', icon: '🛒',
      data: { buy: loc.buy || [], sell: loc.sell || [], specialties: loc.specialtyLabels || loc.specialties || [], vendingNote: loc.vendingNote || '' },
    });
  }
  if (!entries.length) {
    /* 一个地点如果六个数据源都翻不到东西，就诚实说清楚 ——
       把地点自己声明的品种/价格系数带出来，让人看得出
       "是这块地本来没内容"，还是"内容存在但没挂上"。 */
    entries.push({
      kind: 'look', id: `${loc.id}_look`, name: '四处看看', icon: '👀',
      data: {
        desc: loc.desc,
        type: loc.type,
        footfall: loc.footfall,
        dailyProbability: loc.dailyProbability,
        specialties: loc.specialtyLabels || loc.specialties || [],
        priceMod: loc.priceModList || [],
        vendingNote: loc.vendingNote || '',
      },
    });
  }

  /* 一个地点最多 5 个交互点。
     全摆出来的话，像商业区（21 条内容）会变成满地光圈，反而没有重点；
     按来源轮转取样，保证每类都露脸。 */
  const MAX = 5;
  let picked = entries;
  if (entries.length > MAX) {
    const byKind = {};
    for (const e of entries) (byKind[e.kind] ||= []).push(e);
    picked = [];
    let i = 0;
    while (picked.length < MAX && i < 30) {
      for (const k of ['work', 'trade', 'service', 'action', 'extra', 'risk']) {
        const pool = byKind[k];
        if (pool && pool[i]) { picked.push(pool[i]); if (picked.length >= MAX) break; }
      }
      i++;
    }
  }

  // 候选位置：布局登记的空位优先
  const spots = ctx.lots.map(l => [l.x, l.z]);
  if (spots.length < picked.length) {
    const bonus = [];
    if (kind === 'yard' || kind === 'compound') {
      for (const z of [-S / 3, 0, S / 3, S / 2 - 14]) bonus.push([0, z]);
    } else if (kind === 'plaza') {
      for (const z of [ctx.spawnZ - 7, ctx.spawnZ - 19, 0, -S / 4]) bonus.push([rnd(-6, 6), z]);
    } else {
      for (const z of [-S / 2 + 10, -S / 2 + 24, S / 2 - 24, S / 2 - 10]) bonus.push([-half * 0.5, z]);
    }
    for (const b of bonus) spots.push(b);
  }

  // 打散顺序，避免每次进同一个地点交互点都落在同一处
  spots.sort(() => Math.random() - 0.5);

  const used = [];
  for (const e of picked) {
    // 选一个离已选点最远的空位，让交互点铺得开
    let best = null, bestD = -1;
    for (const [x, z] of spots) {
      let d = Infinity;
      for (const [ux, uz] of used) d = Math.min(d, Math.hypot(x - ux, z - uz));
      if (d > bestD) { bestD = d; best = [x, z]; }
    }
    if (!best) break;
    used.push(best);

    const [x, z] = best;
    const h = K.hotspot({ icon: e.icon });
    h.userData.noMerge = true;
    h.position.set(x, 0, z);
    ctx.group.add(h);
    ctx.hotspots.push({ object: h, x, z, radius: 2.8, kind: e.kind, id: e.id, label: e.name, icon: e.icon, data: e.data, place: loc.name });
  }
}
