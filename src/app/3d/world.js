import * as THREE from 'three';
import { palette, tierOf } from './palette.js';
import { syncNormalRepeat, posterTex, flyerTex, bannerTex } from './materials.js';
import { bindTexture } from './textures.js';
import * as K from './kit.js';
import { rng, setRng, locationRng } from './rng.js';
/* ★ 街道横断面唯一真源（车/人/道具三方共用）。见 road.js 顶注：
   以前 world.js 与 actors.js 各写一份，结果垃圾桶被撒进车道把车拦死。 */
import { carCorridor, carClearance, roadEdgeBand } from './road.js';

/* ══ 场地布局引擎 ═══════════════════════════════════════════════════════════
   5 种布局 × 结构原型 × 道具包 × 质感档位 = 29 个地点。

   每个 layout 函数负责"把结构摆到地上"，并把可用的空位（lots）交回来，
   供道具与交互点二次投放。这样加一个新地点只需要加一行配方。
   ═══════════════════════════════════════════════════════════════════════════ */

/* ★ 随机统一走 rng.js 那条**可播种**的流（见该文件顶注）。
   原来这里是裸 Math.random()：同一地点每次重建，摊位/道具/锚点位置都不同，
   于是 verify-actors 的"堵死 N 个"在 0~2 之间抖、"车辆全部在行驶"时红时绿 ——
   "绿"是修好了还是撞运气，说不清。播种后同 id 永远同布局。 */
const rnd = (a, b) => a + rng() * (b - a);
const rndInt = (a, b) => Math.floor(rnd(a, b + 1));
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const chance = (p) => rng() < p;

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
    /* ★ 行为锚点（2026-09-19）：交给 actors.js，让"人"有事可做。
       为什么要 world 提供、而不是 actors 自己从碰撞盒反推：
       摊位与店门的位置是**布局阶段挤出来的**，只拿到一堆
       {minX,maxX,minZ,maxZ} 的角色系统无法区分"这是一堵墙"与
       "这是一个摊位" —— 从几何反推语义是不可能的。
       所以谁产生语义，谁就把它写下来。 */
    this.anchors = [];
    /* ★ 车道走廊被"挖掉"的次数（诊断用）：>0 说明原本有道具会落进车道。
       必须能读数 —— 静默把区间缩小，会让"布局原来有错"看起来本来就不存在。 */
    this.corridorClamped = 0;
    /* ★ 走廊兜底（place() 里按实际包围盒收）的账目：
       pushed = 中心在走廊外、盒子仍伸进来、被推开一步的物件数；
       stuck  = 推到路沿仍放不进这条路的（>0 即布局/尺寸真的有问题）。 */
    this.corridorPushed = 0;
    this.corridorStuck = 0;
    /* ★ 飞线登记（2026-09-19）：电线会被 mergeStatics 合批吃掉，
       合批之后**再也无法从场景树里找到某一条线** ——
       而"线是不是穿在楼里"恰恰是恒稳这次报的问题之一。
       线穿楼是**静默**缺陷（不报错、不崩，只是画面上多一团黑线），
       没有可断言的读数，它下次一定还会回来。 */
    this.wires = [];
    scene.add(this.group);
  }
  /** 登记并放置一条飞线（两端都在建筑轮廓之外，见 verify-actors §⑦）。 */
  addWire(a, b, sag) {
    this.wires.push({ ax: a.x, ay: a.y, az: a.z, bx: b.x, by: b.y, bz: b.z });
    return this.addRaw(K.wire(a, b, sag));
  }
  /** 放置一个物件；footprint 存在时自动注册碰撞盒 */
  place(obj, x, z, rotY = 0, { collide = 'auto', block = false, noMerge = false, tag = '' } = {}) {
    obj.position.set(x, obj.position.y, z);
    obj.rotation.y = rotY;
    if (noMerge) obj.userData.noMerge = true;
    this.group.add(obj);
    const fp = obj.userData.footprint;
    if (fp && collide !== 'none') {
      /* ★★ footprint 是**局部**尺寸，碰撞盒必须再乘上 obj.scale（2026-09-19）。
         不乘会得到一个"虚胖"的盒子：buildStall 已把大排档缩到 0.49 倍
         （真实进深 1.30m），若按原始 2.63m 登记，盒子会比实物宽一倍 ——
         摊主站在自家摊子前 0.4m（位置完全正确）却会被判"在墙里"。
         这类错误是**静默**的：不报错、画面上也看不出来（盒子不可见），
         只会表现为"人贴着空气走不过去"和守卫假红。 */
      const sw = Math.abs(obj.scale.x) || 1;
      const sd = Math.abs(obj.scale.z) || 1;
      const fw = fp.w * sw, fd = fp.d * sd;
      const c = Math.cos(-rotY), s = Math.sin(-rotY);
      // 旋转后的 AABB（取包围盒即可，物件大多轴对齐或小角度）
      const ex = (Math.abs(c) * fw + Math.abs(s) * fd) / 2;
      const ez = (Math.abs(s) * fw + Math.abs(c) * fd) / 2;
      /* ★★ 车道走廊**兜底**（2026-09-19）：|x| < corridor 内不许有静态盒。
         为什么 spot() 里已经挖过区间，这里还要再收一道：
         spot() 只能保证物件的**中心**不在车道上，保证不了**盒子不伸进车道** ——
         大垃圾箱/带旋转的摊位半径能到 1m，中心在走廊外、盒子照样压过去。
         实测：只挖中心时 slum 仍有 4 个盒侵入（最深的 0.67m），车照样会停。
         ★ 必须计数（corridorPushed/Stuck）：静默把东西挪开，会让"布局里
           本来有物件占道"这件事看起来从来不存在 —— 那是掩盖，不是修复。
         ★ 建筑（block）不挪：它的门脸/落水管/锚点全按当前位置推导，
           挪一下整栋楼的附属件都错位。建筑本该在 |x| ≥ half+0.05，
           真压到路上是**布局错**，交给验证断言报红，不在这里糊过去。 */
      const COR = this.corridorHalf();
      if (COR > 0 && !block) {
        const side = Math.sign(x) || 1;
        const want = Math.min(COR + ex, this.laneHalf - 0.05 - ex);
        if (Math.abs(x) < want) {
          x = side * want;
          this.corridorPushed++;
          /* 推到极限仍然越界 = 这件东西**根本放不进**这条路（太大/路太窄）。
             单独计数，不能与"推一下就好"混为一谈。 */
          if (Math.abs(x) - ex < COR - 1e-6) this.corridorStuck++;
        }
      }
      /* ★ 物体必须跟着盒子一起挪 —— 否则出现"盒子在这儿、模型在那儿"，
         比不修更糟（玩家会撞到看不见的墙，还会觉得模型悬空）。 */
      if (x !== obj.position.x) obj.position.x = x;
      const box = {
        minX: x - ex, maxX: x + ex, minZ: z - ez, maxZ: z + ez,
        /* ★ 盒子必须能自报家门（2026-09-19）。
           守卫只会说"某角色在墙里"——撞的是自己摊位的盒、还是被别的道具顶了？
           修法完全不同（一个是锚点算错，一个是投放冲突）。没有 tag 就只能靠猜，
           而靠猜的调试每多一轮就多一次改错地方的机会。 */
        tag: tag || obj.name || 'prop',
      };
      this.colliders.push(box);
      if (block) this.blockers.push(box);
    }
    return obj;
  }
  /** 登记一个空位，供后续投放道具 */
  lot(x, z, rotY = 0, kind = 'walk') {
    this.lots.push({ x, z, rot: rotY, kind });
  }
  /** 登记一个行为锚点（摊主站位 / 店铺门口），供 actors.js 使用 */
  anchor(x, z, rotY = 0, kind = 'stall') {
    this.anchors.push({ x, z, rot: rotY, kind });
  }

  /**
   * ★ 锚点收口：把落在碰撞盒里的锚点让出来（2026-09-19）。
   *
   * ── 为什么必须有这一道，而不是"把每个 anchor 的偏移量调准" ──────────────
   *   锚点登记的那一刻，只知道自己面前那栋楼的几何；**道具是之后才投放的**
   *   （propsFor 会往墙根挂电动车、垃圾桶、落水管、空调外机）。
   *   也就是说，"门口前 0.8m"这个位置在登记时**确实是空的**，
   *   等道具投完就变成了墙里 —— 这不是某一行偏移量写错，
   *   是"先定锚点、后放道具"这个顺序本身必然会踩到的坑。
   *   所以调大某个数字只是把坑挪到下一个道具上；正确做法是**在全部投放
   *   结束之后统一收口**：谁落在盒里，就顺着可走的方向让开一步。
   *   实测（_diag-scan）：修好缩放与建筑朝向后剩下的命中**全部**属于这一类。
   *
   * ── 方向上的一条硬约束 ──────────────────────────────────────────────
   *   优先"朝街心"（-sign(x)）。门口的人本来就该站在靠街那一侧，
   *   把人往建筑方向推等于直接塞进墙里；同时**不许越过街心线**：
   *   跨过去等于换了一条人行道，破坏的是摆位意图（同 actors.js::_resolveSpawn）。
   *
   * ── 推不动的怎么办 ────────────────────────────────────────────────
   *   单独计数（anchorStuck）**而不是静默丢弃**。丢弃会让"这条街没有摊主"
   *   看起来像是数据里本来就没有 —— 那是掩盖，不是修复。
   *
   * @returns {{moved:number, stuck:number}}
   */
  resolveAnchors(pad = 0.45, maxPush = 2.4) {
    const blocked = (x, z) => {
      for (const c of this.colliders) {
        if (x > c.minX - pad && x < c.maxX + pad && z > c.minZ - pad && z < c.maxZ + pad) return true;
      }
      return false;
    };
    const STEP = 0.1;
    /* ★★ 搜索方向从 4 个轴向扩到 8 个（加四个对角），2026-09-19。
       为什么：巷子的横断面是"墙挂件带 / 摊位带 / 行人带 / 车道"一层层挤出来的，
       锚点常被夹在**两条带之间**的窄缝里 —— 轴向一步迈不出去（往前撞摊位、
       往左右仍在那两条带里），但沿对角方向挪就能滑出去。
       只搜轴向 = 约束集不全，表现为"明明旁边就有空位却报堵死"。
       ★ 判定顺序仍是"距离从小到大"：先找到的即最近可用点，
         所以锚点不会被无谓地甩到很远。
       ★ maxPush 1.6 → 2.4：与上面同因（窄缝本身有 1~2m 宽）。
         **但不要把 maxPush 当成万能药** —— 若 stuck 依然 > 0，
         说明是布局真的放不下（靠加大距离只会把店主甩到街对面），
         那时要改布局，见本函数顶注。 */
    const DIRS = [
      [-1, 0], [1, 0], [0, -1], [0, 1],          // 轴向优先（位移最直观）
      [-1, -1], [-1, 1], [1, -1], [1, 1],        // 对角（滑出窄缝）
    ];
    let moved = 0, stuck = 0;
    for (const a of this.anchors) {
      if (!blocked(a.x, a.z)) continue;
      const sx = Math.sign(a.x) || 1;
      const x0 = a.x;
      let done = false;
      for (let d = STEP; d <= maxPush + 1e-6 && !done; d += STEP) {
        for (const [ux, uz] of DIRS) {
          const nx = a.x + ux * d, nz = a.z + uz * d;
          if (nx * x0 <= 0) continue;          // 不许越过（或落在）街心线
          if (!blocked(nx, nz)) { a.x = nx; a.z = nz; done = true; moved++; break; }
        }
      }
      if (!done) stuck++;
    }
    this.anchorPushed = moved;
    this.anchorStuck = stuck;
    return { moved, stuck };
  }
  /** 车道走廊半宽（0 = 本布局没有机动车道）。公式见 road.js —— 与
   *  actors.js 的车流避障半径同源，两边不能各写一份（2026-09-19 的教训）。 */
  corridorHalf() {
    return carCorridor(this.spec.layout, this.roadW, this.laneHalf);
  }
  /** 车**物理上**会撞到的 |x| 硬线（= corridorHalf − 留白）。断言用这条，
   *  建造用 corridorHalf。两层阈值为什么分开见 road.js::carCorridor。 */
  clearanceHalf() {
    return carClearance(this.spec.layout, this.roadW, this.laneHalf);
  }
  /** 随机取一个落点：避开出生点安全圈，**并避开车道走廊**。
   *  没有安全圈这一步的话，垃圾桶/电动车会盖在出生点上，
   *  角色的碰撞推出逻辑每帧把它顶回去 —— 表现为"走不动"。 */
  spot(xa, xb, za, zb, clear = 3.6) {
    let lo = Math.min(xa, xb), hi = Math.max(xa, xb);
    /* ★★ 车道走廊在**采样之前**就从区间里挖掉（2026-09-19 根因修复）。
       原来这里是裸的整条路宽，垃圾桶/垃圾箱/电线杆于是落在车道中央，
       把车拦死（实测 car#1 Δ0.00，1.8s 一动不动，且不报任何错）。
       ★ 为什么是"挖区间"而不是"采样后把物件推出去"：
         推出去会把好几件物体挤到同一条 |x| 线上，肉眼可见地"排成一排"；
         挖区间只是把可用范围缩小，分布依旧自然。 */
    const c = this.corridorHalf();
    if (c > 0) {
      const inLane = (v) => v > -c && v < c;
      if (lo < -c && hi > c) {
        /* 区间横跨车道 → 随机挑一侧，只在那一侧采样 */
        if (rng() < 0.5) hi = -c; else lo = c;
        this.corridorClamped++;
      } else {
        if (inLane(lo)) { lo = c; this.corridorClamped++; }
        if (inLane(hi)) { hi = -c; this.corridorClamped++; }
      }
      if (hi - lo < 0.4) {
        /* 整个区间都在车道里（挖完没地方了）→ 退到走廊外侧一条窄带。
           ★ 不能返回一个倒置区间：那样 rnd() 会取到区间外的值（静默越界）。 */
        const s = rng() < 0.5 ? -1 : 1;
        lo = s * (c + 0.3); hi = s * (c + 1.0);
        this.corridorClamped++;
      }
    }
    for (let i = 0; i < 30; i++) {
      const x = rnd(lo, hi), z = rnd(za, zb);
      if (Math.hypot(x, z - (this.spawnZ || 0)) >= clear) return [x, z];
    }
    // 兜底：往街道另一头放，至少不压出生点
    return [xr(lo, hi), za < 0 ? zb - 2 : za + 2];
  }
  /** 街面件（垃圾桶/垃圾箱/杆件）的投放：落在**走廊外、路沿内**的带里。
   *  比 spot(-half, half, ...) 更窄 —— 那一句在车道布局下等于"随便撒在路中间"。 */
  spotEdge(za, zb, clear = 3.6) {
    const b = roadEdgeBand(this.corridorHalf(), this.laneHalf);
    const side = rng() < 0.5 ? -1 : 1;
    const [x, z] = this.spot(side * b.inner, side * b.outer, za, zb, clear);
    return [x, z];
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

  /* ★ [2026-09-19] 克隆体也必须**登记到真实贴图的绑定表**里。
     为什么这是必须的（不是可选的美化）：
       textures.js::applyTo() 换图时靠 `texture.dispose()` 把旧显存分配丢掉，
       而 three 只有在**同一个 Source 的所有贴图都 dispose 之后**才会真正
       删掉 GL 纹理、并在下次渲染按新尺寸重新 texStorage2D。
       这里如果只克隆不登记，这个克隆体就不在 _bind 里、永远不被 dispose，
       usedTimes 归不了零 —— 于是真实贴图（1024²）往程序化（512²）的旧分配里塞，
       texSubImage2D 尺寸不匹配：**报一条 GL_INVALID_VALUE，然后地面静静停在
       程序化内容上**（JS 侧一切正常，截图之外没有任何症状）。
       实测就是这么发现的：4 条 GL_INVALID_VALUE + 地面纹丝不动。
     与 materials.js::fitRepeat() 里的 `if (bind) bindTexture(mat, bind.as)` 同一纪律。 */
  const bind = base.userData && base.userData.texBind;
  if (bind) bindTexture(m, bind.as);
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
/* ══ AI hero 建筑配方（2026-09-19）═════════════════════════════════════════

   把 AI 生成的"一眼中国"标志建筑按**节奏**插进沿街建筑行。

   ★ 为什么是"按节奏插入"而不是"整条街替换"：
     AI 模型每次都是同一份 GLB 的 clone（见 assets.js::instance）。
     全替换 = 整条街变成同一栋楼重复 N 次 —— 比程序化的多样性**更假**。
     间隔插入才像"这条街上刚好有几栋特别的"。

   ★ 为什么只在 lane（巷弄）用：
     lane 是城中村/市井气的地点（slum / night_market / suburb /
     internet_cafe / flea_market / flower_bird_market），AI 那几件
     （骑楼、防盗网居民楼）正是为它们做的。
     avenue 是商业区/银行/汽车城，塞骑楼会串味。

   every: 每 N 栋插一栋（2 = 隔一栋，3 = 隔两栋）。
          N 越小越密、越"AI 化"；越大越接近原有观感。
   ───────────────────────────────────────────────────────────────────────── */

const HERO_BUILDERS = {
  qilou: (o) => K.qilouProp(o),
  old_apartment: (o) => K.oldApartmentProp(o),
  lingnan_temple: (o) => K.lingnanTempleProp(o),
};

const AI_HERO_PLAN = {
  // 城中村：骑楼 + 老楼混合，密一点 —— 这里是"中国南方"最该被认出的地方
  slum: { buildings: ['qilou', 'old_apartment'], every: 2 },
  // 夜市：骑楼为主（沿街全是铺面），密
  night_market: { buildings: ['qilou'], every: 2 },
  // 网吧/二手/花鸟：骑楼适度点缀
  internet_cafe: { buildings: ['qilou'], every: 3 },
  flea_market: { buildings: ['qilou'], every: 3 },
  flower_bird_market: { buildings: ['qilou'], every: 3 },
  // 郊区：老楼为主，稀疏
  suburb: { buildings: ['old_apartment'], every: 3 },
};

/** AI 摊位配方（propsFor 用）：地点 id → 摊位工厂名。
 *  摊位是"人留下的痕迹"，必须贴在人走的地方，故只在市集类地点出现。 */
const AI_STALL_PLAN = {
  night_market: 'dapaidang',
  slum: 'dapaidang',
  flea_market: 'dapaidang',
  vegetable_market: 'market_stall',
  wholesaleMarket: 'market_stall',
};

const STALL_BUILDERS = {
  dapaidang: () => K.dapaidangProp(),
  market_stall: () => K.marketStallProp(),
};

/* ── 摊位的三个常量（2026-09-19 恒稳反馈后新增）────────────────────────────
   反馈原话：「那些摊位肯定不能乱摆在别人门口那里啊，摊位太多了而且都长一个样」。
   三条病根分别是：落点在车道中央、两侧各摆二十来个、同一个造型复制 N 遍。 */

/* 摊位贴路沿的内缩量。摊位进深 ~1.2 → 占 (half-1.95) ~ (half-0.75)，
   **不越过路沿**（half），也**不压建筑**（lane 建筑近面 ≥ half+0.05）。
   ★ 为什么不让它贴墙：贴墙就等于堵住店门口 —— 恒稳说的"乱摆在别人门口"。
     贴路沿 → 摊位在街上、门口那条通道留着，才是真实菜市场的排布。 */
const STALL_INSET = 1.35;

/* 电线杆从路沿往街心内缩多少。
   ★ 必须够大：K.pole() 的横担是 1.9m 长的盒子（中心在杆上，两端各伸出 0.95）。
     杆子若贴在路沿（half），横担外端就会伸到 half+0.95 —— 直接**扎进建筑**。
     lane 建筑近面 = half + 0.05~0.6，所以内缩必须 > 0.95，取 1.05。
     改这个值之前先看 layoutLane 里建筑的落位公式。 */
const POLE_INSET = 1.05;

/* 停放的两轮车（电动车/三轮车）从路沿往街心内缩多少。
   ★ 原来是 `half*0.42 ~ half*0.66` —— 那是**半条车道**，
     既让街面显乱，也让车流避让逻辑形同虚设。收到墙根（只留 0.9m），
     与行人的行走带（actors.js PED_OUT）错开，互不打架。 */
const MOPED_INSET = 0.9;

/* 篷布配色池。★ 必须有：AI 摊位是同一份 GLB 的 clone，
   不给颜色差异，一条街就是同一个摊子复制 N 遍。 */
const STALL_CANOPY = [
  [0x6b4a44, 0x44525a, 0x5a5a44, 0x4a4450],   // 旧雨布：土褐 / 铁灰
  [0x8a4a3a, 0xc8a04a, 0x4a6a5a, 0x7a3a34],   // 大排档：红黄绿
  [0x3a5a6a, 0x6a6a5a, 0x4a4450, 0x5a4a3a],   // 菜摊：冷调
  [0x9a5a3a, 0x5a7a4a, 0x8a8a5a, 0x6a4a5a],   // 杂货：暖杂色
];

/** 按"型号 + 抖动"造一个摊位。
 *  ★ 为什么要混投程序化摊位：AI 摊位只有两个型号（dapaidang / market_stall），
 *    且每次都是同一份 GLB 的 clone —— 单靠它，一条街必然"都长一个样"。
 *    程序化 stall() 能按摊位改篷布颜色与尺寸，正好补上这份差异。
 *    比例 1/3 不是随手取：AI 摊位是这条街的"主角"，程序化的只负责打散重复。
 *
 *  ★ 为什么还要按路宽缩放（2026-09-19 实测补上）：
 *    dapaidang 的 footprint 是 2.88×2.63m。而 lane 的 half 只有 4.75，
 *    减去双向车道(±1.15+半车宽0.89)与行人带(2.2~2.55)之后，
 *    路边只剩约 2.2m 的进深可用。2.63m 的摊子摆下去，
 *    它的碰撞盒会一直吃到 4.715 —— 距离路沿只剩 3.5cm，
 *    **摊主根本没有立足之地**（实测：8 个摊主全被判"在墙里"）。
 *    所以按"可用进深"缩，而不是拿一个固定 scale。
 *    真实城中村的大排档档口也就 2m 见方，缩到 0.78 反而更准。 */
function buildStall(primary, tier, half) {
  /* 可用进深 = 路沿 − 行人带外沿 − 摊主站位。三项都是上面横断面表里的数。 */
  const avail = Math.max(1.3, (half || 4.75) - 2.6 - 0.9);
  if (chance(0.34)) {
    const w = Math.min(2.8, avail), d = Math.min(1.35, avail * 0.75);
    return K.stall({ w, d, tier, colors: pick(STALL_CANOPY), box: chance(0.45) });
  }
  const s = STALL_BUILDERS[primary]();
  const fp = s.userData.footprint || { w: 2.8, d: 2.4 };
  const fit = Math.min(1, avail / fp.d, 1.15);
  s.scale.setScalar(Math.min(fit, 1.08) * rnd(0.97, 1.04));
  return s;
}

/** 摊位实际的进深（旋转后沿 x 轴占多少）——摊主站位要靠它算。
 *  缩放过就必须重新算，否则摊主会站进摊子里（实测踩过）。 */
function stallDepth(obj) {
  const fp = obj.userData.footprint;
  return fp ? fp.d * Math.abs(obj.scale.x) : 1.4;
}

function layoutLane(ctx) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const half = ctx.laneHalf;
  const rows = [];
  const plan = AI_HERO_PLAN[spec.id] || null;
  /* 每个地点固定取方案里的第一件做主角，避免两侧随机导致同一地点风格跳。
     验证脚本据此断言"slum 里出现了 qilou"。 */
  const heroName = plan && plan.buildings && plan.buildings.length ? plan.buildings[0] : null;
  const heroBuild = heroName ? HERO_BUILDERS[heroName] : null;

  for (const side of [-1, 1]) {
    let z = -S / 2;
    let slot = 0;
    while (z < S / 2) {
      /* ★ slot > 0 才用 hero：出生点正对面那栋留给程序化楼。
         为什么：出生点是玩家第一眼看到的位置，AI 模型万一朝向不对，
         第一印象就毁了；等链路验证过再放开。 */
      const useHero = heroBuild && plan.every > 0 && slot > 0 && slot % plan.every === 0;

      if (useHero) {
        const b = heroBuild({ tier });
        const fp = b.userData.footprint || { w: 7.3, d: 6.5, h: 10 };
        /* ★ rotY = -side·90°：让模型正面（假定为局部 +Z）转向街心。
           旋转后模型的 w（局部 x）落到世界 z 轴（沿街），
           d（局部 z）落到世界 x 轴（进深）—— 与下面 lowRise 那支的
           "x 用 d/2、z 推进用 w"形式一致，故两种楼能严丝合缝地排在同一条线上。

           ⚠️ 模型正面是否真为 +Z 未经目视确认（本窗口无法读图）。
           若截图里看到骑楼背面朝街，把这里的负号去掉即可。 */
        const x = side * (half + fp.d / 2 + rnd(0.05, 0.4));
        ctx.place(b, x, z + fp.w / 2, -side * Math.PI / 2, { block: true, tag: 'bld:hero' });
        /* 标 ai: true —— propsFor 要跳过这些行，否则会往骑楼上
           再挂一道卷帘窗/落水管，与模型自带的门脸穿模。 */
        rows.push({ x, z: z + fp.w / 2, d: fp.d, w: fp.w, side, ai: true });
        z += fp.w + rnd(0.1, 0.5);
      } else {
        const w = rnd(6.5, 10.5);
        const d = rnd(7, 10);
        const floors = chance(0.25) ? rndInt(2, 3) : rndInt(3, spec.maxFloors || 6);
        const b = K.lowRise({ w, d, floors, tier });
        const x = side * (half + d / 2 + rnd(0.05, 0.6));
        /* ★★ rotY = -side·90°，与上面 hero 分支**必须一致**（2026-09-19 补）。
           漏了这个旋转的后果不是"朝向不好看"，是几何整体错位：
             · K.lowRise 是 `BoxGeometry(w,h,d)` —— w 在**局部 x**。
             · 但本行的 x 用的是 `d/2`（"进深沿 x"），行距推进用的是 `w`
               （"沿街方向 = w"）。这套算法假定的是"旋转后 X 向占 d"。
             · 传 rotY=0 时 X 向实际占的是 **w**。w(6.5~10.5) 与 d(7~10)
               是两个独立取值的随机数，于是自建房有近一半概率**长边朝街**，
               近面最深能吃到 |x|=3.0 —— 而路沿在 4.75。
               实测（_diag-scan）：盒 x[-13.77,-3.95]，建筑压进马路 0.8m，
               顺带把门口的店主锚点整个吞进墙里。
           旋转之后近面恒为 `half + rnd(0.05,0.6)`，与 hero 楼、店铺门脸、
           落水管全都重新对齐 —— 这三者本来就都按"X 向占 d"写的。 */
        ctx.place(b, x, z + w / 2, -side * Math.PI / 2, { block: true, tag: 'bld:low' });
        rows.push({ x, z: z + w / 2, d, w, side });
        z += w + rnd(0.1, 0.6);
      }
      slot++;
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
      ctx.place(b, x, z + w / 2, 0, { block: true, tag: 'bld:ave' });
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
      ctx.place(b, x, z + w / 2, 0, { block: true, tag: 'bld:court' });
      rows.push({ x, z: z + w / 2, d, w, side });
      z += w + rnd(4, 9);
    }
  }
  /* ★ 2026-09-19 拆牌坊（恒稳的设计反馈）：对标《大多数》——
     切换地点不立"大门"，当前在哪由顶部 HUD 的地点名负责。
     入口只留围墙缺口（gap），出生点构图不变（回头是缺口、往前是院子）。 */
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
    ctx.place(b, x, z + w / 2, side > 0 ? 0 : Math.PI, { block: true, tag: 'bld:shed' });
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
  /* ★ bw/bd 是 let 而不是 const：pavilion 那支要用模型的真实尺寸回填
     （见下方 AI 庙宇分支）。 */
  let bw = spec.mainW || (spec.structure === 'tower' ? rnd(18, 24) : rnd(24, 34));
  let bd = rnd(12, 18);
  let main;
  let mainIsAi = false;
  if (spec.structure === 'tower') {
    main = K.tower({ w: bw, d: bd, floors: rndInt(10, 20), tier });
  } else if (spec.structure === 'teaching') {
    main = K.teachingBlock({ w: bw, d: bd, floors: rndInt(4, 6), tier });
  } else if (spec.structure === 'pavilion') {
    /* —— AI 岭南庙宇（2026-09-19）——
       ★ 为什么不再用 K.hall：程序化的 hall 是"方盒子 + 坡屋顶"的通用形态，
         做不出**镬耳山墙**与**陶塑瓦脊** —— 而 temple 这个地点缺的正是那两样。
         少了它们，寺庙就只是"一个带屋顶的房子"，与图书馆/政务大厅没有区别。
       ★ 尺寸随之从 spec.mainW(28m) 变成模型的 ~11m。这是**有意的**：
         真实岭南小寺的主殿本就在 10~15m 级；28m 是"官方大厅"的尺度
         （对比 gov_office 的 mainW=36、court=32），用在古寺上反而失当。
       ★ bw/bd 必须回填成模型真实尺寸 —— 下面的 mz、广场收边、
         以及两侧次要建筑的落位都从它们推导，写错会让主楼悬空或压住广场。 */
    main = K.lingnanTempleProp({ tier });
    const fp = main.userData.footprint || { w: 11, d: 9 };
    bw = Math.round(fp.w);
    bd = Math.round(fp.d);
    mainIsAi = true;
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
  /* mainIsAi：AI 主殿自带门脸（石狮、门环、檐下彩绘），
     再让 propsFor 往上挂落水管/卷帘窗会与模型自身构件穿模。 */
  rows.push({ x: 0, z: mz, d: bd, w: bw, side: 0, ai: mainIsAi });
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
    ctx.place(b, side * rnd(20, 27), mz + rnd(6, 16), side > 0 ? -0.35 : 0.35, { block: true, tag: 'bld:side' });
    rows.push({ x: side * 22, z: mz + 10, d, w, side });
  }

  /* 入口序列：旗杆 / 台阶广场 / 低栏杆。
     ★ 2026-09-19 拆牌坊：同 layoutCompound 的反馈——不立 archway，
       只留两侧低栏杆标出入口（远景有收束、又不挡"这是哪"的判断）。 */
  if (spec.flagPole) {
    for (let i = 0; i < 3; i++) ctx.place(K.flagPole({ h: 11 }), (i - 1) * 4.5, mz + bd / 2 + 9, 0, {});
  }
  if (spec.formal) {
    const gap = 10;
    for (const side of [-1, 1]) {
      ctx.place(K.fenceWall({ len: S / 2 - gap / 2, h: 2.2, tier, kind: 'railing' }),
        side * (S / 4 + gap / 4), S / 2 - 1.5, 0, {});
    }
  }

  /* —— 广场：遮阳伞（GLB，商业 kit）——
     广场/公园/夜市边缘的露天休息位。程序化的广场只有硬质铺装与树，
     加几把伞立刻有"人能坐下来"的暗示 —— 这是生活模拟场景最需要的。
     ★ 只放在**休闲性**广场：政务/法院/医院这类 formal（庄重机构）场地放伞
       不合逻辑（那里没有露天消费场景），故用 !spec.formal 排除。
       （formal 原名 gate，牌坊拆除后它只剩这层语义，故改名。） */
  const parasolCount = spec.formal ? 0 : rndInt(2, 4);
  for (let i = 0; i < parasolCount; i++) {
    const [x, z] = ctx.spot(-10, 10, -S / 2 + 10, S / 2 - 10, 7);
    ctx.place(K.parasolProp({ variant: chance(0.5) ? 'a' : 'b' }), x, z, rnd(0, Math.PI * 2), {});
  }

  return rows;
}

/* ══ 道具包 ═══════════════════════════════════════════════════════════ */

const SHOP_NAMES = {
  slum: ['便利超市', '五金水电', '平价水果', '理发', '兰州拉面', '手机维修', '废品回收', '宽带办理'],
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

/* ══ 店名生成：前缀 × 主体 ══════════════════════════════════════════════
   [2026-09-19] 换掉原来的 `names[i % names.length]`。

   ★ 为什么必须换：每类只有 3~8 个固定名，而一条街有几十家店 ——
     取模必然反复出现同一个名字。这是"整条街像同一家店开了几十遍"的
     第二处根因（第一处是招牌配色，见 kit.js::styleFor）。

   ★ 主体池一律写**纯行业词**，不带字号人名：原来的"阿强理发"会让前缀
     组合出"老李阿强理发"。人名改由前缀池提供 —— 这也更接近真实结构，
     街上的招牌本来就是「字号 + 行业」。

   ★ 前缀按**街区风格**分档：城中村是"老李/阿强/陈记"，商业区是
     "优选/壹号/尚品"。给高档街区配"肥仔烧烤"会立刻出戏。
   ──────────────────────────────────────────────────────────────────────── */
const SHOP_PREFIX = {
  folk: ['老李', '阿强', '陈记', '肥仔', '张记', '阿珍', '细佬', '阿婆', '强记', '老三'],
  plain: ['永兴', '金利', '顺发', '建华', '兴发', '联兴', '新达', '宏发', '广源', '同益'],
  modern: ['优选', '优品', '悦享', '壹号', '尚品', '佳选', '潮荟', '乐活'],
};
const PREFIX_STYLE = {
  slum: 'folk', night_market: 'folk', flea_market: 'folk', flower_bird_market: 'folk',
  vegetable_market: 'plain', wholesaleMarket: 'plain', internet_cafe: 'plain', auto_city: 'plain',
  bank: 'modern', trainingCenter: 'modern', commercialDist: 'modern', entertainment: 'modern',
};

/** 取第 i 家店的店名。
    ★ 组合是**确定性**的（由 i 直接推出，不用随机数）：同一地点每次生成
      完全一致 —— 这是截图对比与回归验证的前提。
    ★ 半数不加前缀：真实街头有一半店铺直接以行业名做招牌。 */
function shopNameFor(kind, i) {
  const base = SHOP_NAMES[kind] || SHOP_NAMES.default;
  const pool = SHOP_PREFIX[PREFIX_STYLE[kind] || 'plain'];
  const subject = base[i % base.length];
  if (i % 2) return subject;
  const prefix = pool[Math.floor(i / base.length) % pool.length];
  return prefix + subject;
}

/* ── 内容层贴图 → 材质 ────────────────────────────────────────────────────
   ★ key 由「内容类型 + 变体序号」构成，**不是** tex.uuid：
     每次调用 posterTex() 都会产生一张新贴图，用 uuid 当 key 等于没有缓存，
     材质数量会随平面数量线性增长。按变体序号缓存 → 全场景只有
     海报 12 + 牛皮癣 8 + 横幅 8 ≈ 28 个材质，合并后仅多 28 次 draw call。 */
const _contentMatCache = new Map();
function contentMat(key, factory) {
  if (_contentMatCache.has(key)) return _contentMatCache.get(key);
  const m = new THREE.MeshStandardMaterial({
    map: factory(), roughness: 0.9, side: THREE.DoubleSide,
  });
  _contentMatCache.set(key, m);
  return m;
}

function propsFor(ctx, kind, rows) {
  const { spec, tier } = ctx;
  const S = ctx.streetLen;
  const half = ctx.laneHalf;
  const P = palette();
  const sp = (xa, xb, za, zb, clear) => ctx.spot(xa, xb, za, zb, clear);

  /* —— 通用：垃圾桶 ——
     ★ 2026-09-19 修正：原来用 `sp(-half, half, ...)` —— **整条路宽**。
       在车道布局下那就是"随便撒在路中间"，垃圾桶于是落进车道把车拦死
       （实测 car#1 Δ0.00 停驶）。改用 ctx.spotEdge()：走廊外、路沿内的带。
       ★ tag 必须写：撞车那个盒原来 tag 落成默认值 'prop'，
         "是谁在占道"只能靠反查场景树，白花一轮。 */
  const binCount = Math.max(3, Math.round((spec.footfall || 0.6) * 10));
  for (let i = 0; i < binCount; i++) {
    const [x, z] = ctx.spotEdge(-S / 2, S / 2);
    const b = K.bin({ color: pick([0x8a7a3a, 0x3f6a44, 0x3a4a5a]), large: chance(0.3) });
    /* ★ 旋转角原来是 `rnd(0, 2π)` —— 那是"空气墙"的一半成因（2026-09-19）。
       place() 登记的碰撞盒是**旋转后的 AABB**：一个 1.7×1.1 的箱子转到 45°，
       盒子会膨胀到 2.0×2.0（面积翻倍），而场上还是原来那个箱子 ——
       于是人和车会在离箱子还有半米的地方被挡住，看起来就是撞上了空气。
       更糟的是人行道只有 2.55m 宽，一个 2m 的横向盒子**足以把它整段封死**：
       实测两个这样的盒子叠在 slum 的 z∈(-40,-34) 一带，把行人锁进了
       1.3m 的缝里来回打转（diag-airwall 的 #3 号：走了 5.77m、净位移 0.47m）。
       改成**长边沿街**（现实中垃圾桶本来就是这么贴墙摆的）：
       进深回到 1.1m，人行道还剩 1.45m，扣掉行人直径 0.6m 依然走得通。
       ±0.28rad 的抖动是为了不让一排箱子摆得像仪仗队。 */
    ctx.place(b, x, z, Math.PI / 2 + rnd(-0.28, 0.28), { tag: 'bin' });
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
    const [x, z] = ctx.spotEdge(-S / 2 + 3, S / 2 - 3, 4.5);
    ctx.place(K.dumpster(), x, z, rnd(-0.3, 0.3) + (chance(0.5) ? 0 : Math.PI / 2), { tag: 'dumpster' });
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
    /* ★ 跳过 AI hero 建筑：这些件**自带门脸**（骑楼有卷帘门+招牌，
       老楼有防盗网+空调外机）。再往上挂落水管/卷帘窗会与模型自身
       的构件穿模 —— 而且穿得很随机（模型是网格，不是盒子，
       wallX 那个"沿墙内缩 0.12m"的推导对它不成立）。 */
    if (r.ai) return;
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

  /* —— AI 摊位（大排档 / 菜市场蔬菜摊）—— 2026-09-19 ——
     ★ 为什么不并进上面那组"路边件"：
       上面那组是**市政**语义（消防栓、电杆、垃圾箱）—— 城市"自动"运转的部分；
       摊位是**营生**语义 —— 人主动摆出来的部分。两者叙事不同层，
       混投会丢掉"这里有人在讨生活"的指向性，而这正是市井感的来源。
     ★ 尺度差一个量级：消防栓 0.3m、摊位 2.9×2.6m。
       故密度必须低得多 —— 沿街 n = 街长/34，两侧交替，约 2~4 个。
       摆满会变成"大排档森林"，反而像仓库。
     ★ [2026-09-19 重做] 原落点是从 `side*half*0.45` 到 `side*(half-1.6)`
       —— 对 night_market（half=5）就是 ±2.25~3.4，**摆在车道上**；
       朝向还是 `rnd(0, 2π)` 全随机角，摊位歪七扭八。
       这两条合起来正是恒稳说的"乱摆"。现在：贴路沿内 STALL_INSET、
       朝向街心、沿街均匀分段（不再随机扎堆）。 */
  const stallName = AI_STALL_PLAN[spec.id];
  if (stallName && STALL_BUILDERS[stallName]) {
    const n = Math.max(1, Math.round(S / 34));
    for (let i = 0; i < n; i++) {
      const side = i % 2 === 0 ? -1 : 1;
      /* 把街均分成 n 段、每段取中点 —— 均匀排布不会扎堆。
         （随机撒会扎堆，扎堆立刻回到"乱摆"的观感。） */
      const seg = S / n;
      const z = -S / 2 + seg * (i + 0.5) + rnd(-seg * 0.16, seg * 0.16);
      const x = side * (half - STALL_INSET);
      /* 朝向街心。与 shopUnit 用同一套符号约定：
         side>0 的建筑 / 摊位朝 -X（rotY = -90°）。 */
      const rot = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      const s = buildStall(stallName, tier, half);
      ctx.place(s, x, z, rot, { tag: 'stall' });
      /* 摊主站位：摊位**靠街心那一侧**再外移半个摊深 + 0.4m。
         ★ 必须用 stallDepth(s) 而不是写死一个数 —— 摊位按路宽缩放过，
           写死的偏移会让摊主站进摊子里（实测：8 个摊主全被判"在墙里"）。
         ★ 方向是"往街心"（-side），不是"往建筑"（+side）：
           摊主站在自己摊子前面招呼客人，而不是站在摊子与墙的夹缝里。 */
      ctx.anchor(x - side * (stallDepth(s) / 2 + 0.4), z, rot, 'stall');
    }
  }

  /* ══ 通用内容层：海报 / 牛皮癣 / 横幅 ═══════════════════════════════════
     [2026-09-19] 新增。这一层是"街面有没有生活气"的分水岭 ——
     几何再准，缺了这些"贴上去的东西"，街面就只是一组干净的盒子。

     ★ 为什么放在 kind 分支**之前**：这三样是所有街区共有的，
       而原本只有 avenue 有"广告牌"（4 块），是孤例。
     ★ 位置一律由 rows 反推（与 shopUnit 同一套法线偏移 + 0.02~0.07 的
       贴墙间隙），否则平面会飘在路中央或陷进墙里。
     ★ 高度分层，互不打架：牛皮癣 0.5~2.2（人可及）／海报 1.3~2.8（平视）
       ／横幅 4.0~4.5（二楼，压住招牌之上）。
     ──────────────────────────────────────────────────────────────────── */
  const _posterCopy = [
    { title: '大特价', price: '9.9', sub: '限今日', note: '数量有限 售完即止' },
    { title: '新店开业', price: '5折', sub: '全场商品', note: '开业前三天' },
    { title: '招工', price: '', sub: '普工 数名', note: '包吃住 待遇面议' },
    { title: '清仓', price: '1折起', sub: '全场甩卖', note: '最后三天' },
    { title: '免息分期', price: '0首付', sub: '当天放款', note: '凭身份证办理' },
    { title: '买一送一', price: '', sub: '限本店', note: '详情店内咨询' },
  ];

  /* —— 海报：贴墙**成组**出现（真实墙面是"一片"而不是"一张"）—— */
  rows.forEach((r, ri) => {
    if (!chance(0.62)) return;
    const side = Math.sign(r.x) || 1;
    const faceX = side * (Math.abs(r.x) - r.d / 2 - 0.07);
    const rot = side > 0 ? -Math.PI / 2 : Math.PI / 2;
    const n = rndInt(1, 3);
    for (let i = 0; i < n; i++) {
      const pi = (ri * 2 + i) % _posterCopy.length;
      const motif = (ri + i) % 2 ? 'band' : 'circle';
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(rnd(0.66, 0.95), rnd(0.9, 1.28)),
        contentMat(`poster:${pi}:${motif}`, () => posterTex({ ..._posterCopy[pi], motif })));
      m.position.set(faceX, rnd(1.3, 2.8), r.z + rnd(-r.w / 2 + 0.8, r.w / 2 - 0.8));
      m.rotation.y = rot;
      ctx.addRaw(m);
    }
  });

  /* —— 牛皮癣：小、密、歪 —— 价值不在清晰度，在"随贴随掉"的散乱感 —— */
  if (rows.length) {
    const flyerN = 5 + Math.round((spec.footfall || 0.6) * 12);
    for (let i = 0; i < flyerN; i++) {
      const r = rows[rndInt(0, rows.length - 1)];
      const side = Math.sign(r.x) || 1;
      const seed = (i + spec.id.length) % 8;
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(0.21, 0.297),
        contentMat(`flyer:${seed}`, () => flyerTex({ seed })));
      m.position.set(side * (Math.abs(r.x) - r.d / 2 - 0.02), rnd(0.5, 2.2),
        r.z + rnd(-r.w / 2 + 0.5, r.w / 2 - 0.5));
      m.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      m.rotation.z = rnd(-0.15, 0.15);
      ctx.addRaw(m);
    }
  }

  /* —— 横幅：挂二楼高度（压住招牌之上），只给沿街类街区 —— */
  if (rows.length && (kind === 'lane' || kind === 'avenue')) {
    const bn = kind === 'avenue' ? 3 : 2;
    for (let i = 0; i < bn; i++) {
      const r = rows[rndInt(0, rows.length - 1)];
      const side = Math.sign(r.x) || 1;
      const seed = (i * 3 + spec.id.length) % 8;
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 0.52),
        contentMat(`banner:${seed}`, () => bannerTex({ seed })));
      m.position.set(side * (Math.abs(r.x) - r.d / 2 - 0.12), rnd(4.0, 4.5),
        r.z + rnd(-r.w / 3, r.w / 3));
      m.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2;
      ctx.addRaw(m);
    }
  }

  if (kind === 'lane') {
    // 沿巷店铺门脸
    rows.forEach((r, i) => {
      if (chance(0.42)) return;
      const txt = shopNameFor(spec.id, i);
      const front = K.shopUnit({
        width: Math.min(r.w * 0.86, 5.6), sign: txt, tier, open: chance(0.65),
      });
      front.position.set(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 0.16), 0, r.z);
      front.rotation.y = r.x > 0 ? -Math.PI / 2 : Math.PI / 2;
      ctx.addRaw(front);
      ctx.lot(Math.sign(r.x) * (Math.abs(r.x) - r.d / 2 - 1.7), r.z, 0, 'shop');
      /* 店主站位：门脸前 0.8m、面朝街心（与门脸同一朝向）。
         有了它，店主才会"站在自己店门口"而不是在街上游荡。 */
      const sgn = Math.sign(r.x);
      ctx.anchor(sgn * (Math.abs(r.x) - r.d / 2 - 0.8), r.z, sgn > 0 ? -Math.PI / 2 : Math.PI / 2, 'shop');
    });

    /* ── 电线杆 + 飞线 ──────────────────────────────────────────────────
       ★ [2026-09-19 重做，恒稳反馈「街道上很乱，特别是电线混在一起了」]
         原实现有四处叠加，才把巷子做成了一团盘丝：
           ① 杆位 x = ±(half + 0.6) —— 而 lane 的建筑近面在 half+0.05~0.6，
              所以**杆子是插在楼里的**，飞线自然也穿楼而出；
           ② 飞线 y 取 7.3 / 6.6 两个"拍脑袋"的固定高度，
              而 K.pole() 的横担其实在 7.4 / 8.15 / 8.9 —— 线与担从不相接；
           ③ 跨街线两端各取一次 `rnd(6.2, 7.4)`，于是同一条线左右不等高，
              视觉上是斜着挂过去的乱麻（这是"混在一起"最主要的来源）；
           ④ 间距 9m、两侧各一根，18m 内 4 根杆 8 条线，密度远超实际。
         逐条对治：杆移到路沿内（POLE_INSET）、线挂在横担高度上、
         跨街线两端共用同一高度、间距放宽到 18m。 */
    const poleH = 9;
    const armY = [poleH - 1.6, poleH - 1.6 + 0.75];   // 与 K.pole() 的横担对齐
    const poles = [];
    for (let z = -S / 2 + 7; z <= S / 2 - 7; z += 18) {
      for (const side of [-1, 1]) {
        const p = K.pole({ h: poleH });
        const x = side * (half - POLE_INSET);
        ctx.place(p, x, z + rnd(-0.8, 0.8), 0, { tag: 'pole' });
        poles.push(p);
        /* 杆子没有 footprint（K.pole 不声明），碰撞盒在这里手工补。
           ★ 补了才不会被行人和玩家穿过去 —— 一根 15cm 的杆子穿过去
             比穿墙更容易被一眼看见。 */
        ctx.colliders.push({
          minX: x - 0.28, maxX: x + 0.28,
          minZ: p.position.z - 0.28, maxZ: p.position.z + 0.28,
          tag: 'pole',
        });
      }
    }
    for (let i = 0; i < poles.length; i++) {
      const a = poles[i], b2 = poles[i + 2];   // i+2 = 同侧下一根（数组按 z 交替压入）
      if (b2) {
        /* 沿街飞线：挂在**横担**上（原来取的 7.3/6.6 与横担对不上）。 */
        for (const y of armY) {
          ctx.addWire(
            new THREE.Vector3(a.position.x, y, a.position.z),
            new THREE.Vector3(b2.position.x, y, b2.position.z), rnd(0.5, 1.0));
        }
      }
      if (chance(0.5)) {
        const opp = poles.find(p => Math.sign(p.position.x) !== Math.sign(a.position.x)
          && Math.abs(p.position.z - a.position.z) < 3.6);
        if (opp) {
          /* ★ 跨街线两端必须**共用同一个 y**。
             原来是两次独立 rnd(6.2,7.4) → 一条线左右不等高，
             整片看过去就是斜挂的乱麻。一条线，一个高度。 */
          const y = 6.9;
          ctx.addWire(
            new THREE.Vector3(a.position.x, y, a.position.z),
            new THREE.Vector3(opp.position.x, y, opp.position.z), rnd(0.8, 1.4));
        }
      }
    }

    // 电动车 / 三轮车：贴路沿停（原来停在 half*0.42~0.66，那是**车道里**）
    for (let i = 0; i < 5; i++) {
      const side = chance(0.5) ? -1 : 1;
      /* 原来 9 辆撒在 half*0.42~0.66（半条车道）上 —— 既是"街上乱"的一部分，
         也让车流的避让逻辑形同虚设。收到路沿内侧、数量减半、成对停放
         （真实的巷子里电动车是**成堆**停在某家门口，不是均匀撒一路）。 */
      const [x, z] = sp(side * (half - 0.55), side * (half - MOPED_INSET), -S / 2 + 2, S / 2 - 2);
      const kindOf = chance(0.22) ? 'tricycle' : chance(0.2) ? 'bike' : 'scooter';
      const s = K.twoWheeler({ kind: kindOf, color: pick([0x2f3a44, 0x6b3a34, 0x3a4a3a, 0x555a60]) });
      s.rotation.y = side > 0 ? rnd(-0.4, 0.4) + Math.PI : rnd(-0.4, 0.4);
      ctx.place(s, x, z, s.rotation.y, {});
      /* 成对：跟一辆在旁边，形成"一撮"而不是"一列"。 */
      if (chance(0.6)) {
        const s2 = K.twoWheeler({ kind: 'scooter', color: pick([0x2f3a44, 0x6b3a34, 0x3a4a3a, 0x555a60]) });
        s2.rotation.y = s.rotation.y + rnd(-0.25, 0.25);
        ctx.place(s2, x + rnd(-0.5, 0.5), z + rnd(-1.1, 1.1), s2.rotation.y, {});
      }
    }

    // 夜市专属：摊位 + 串灯
    if (spec.id === 'night_market') {
      /* ★ [2026-09-19 重做] 原为 `z += rnd(6.5, 10)` 且两侧各摆一遍 ——
         一条 96m 的街能摆出 20 个摊位，再叠上 AI 摊位就是"大排档森林"
         （恒稳反馈「摊位太多了」）。夜市的热闹该由**串灯与人**给，
         不是靠堆摊位。现在 16~24m 一个、贴路沿、朝向街心。 */
      for (let z = -S / 2 + 9; z < S / 2 - 8; z += rnd(16, 24)) {
        for (const side of [-1, 1]) {
          const x = side * (half - STALL_INSET);
          const zz = z + rnd(-1.6, 1.6);
          /* 朝向街心，与 shopUnit / AI 摊位同一套符号约定。 */
          const rot = side > 0 ? -Math.PI / 2 : Math.PI / 2;
          const st = K.stall({
            w: rnd(2.0, 2.8), d: rnd(1.1, 1.35), tier,
            colors: pick(STALL_CANOPY), box: chance(0.6),
          });
          ctx.place(st, x, zz, rot, {});
          ctx.lot(x - side * 1.4, zz, 0, 'stall');           // 顾客侧
          /* 摊主站摊位靠街心那一侧（同 buildStall 的注释）。 */
          ctx.anchor(x - side * (stallDepth(st) / 2 + 0.4), zz, rot, 'stall');
        }
      }
      for (let z = -S / 2 + 10; z < S / 2 - 8; z += 9) {
        /* ★ 两端挂在**电线杆**上，不是挂进楼里（2026-09-19 修）。
           原来取 ±(half + 0.3) —— 那个 x 已经在建筑红线里面
           （lane 的建筑近面在 half+0.05 起），所以整条串灯是从楼里
           穿出来的，也正是守卫报的"飞线端点在建筑内"。
           挂到杆位（half − POLE_INSET）与横担高度（armY[0]）之后，
           线与杆才真的接上 —— 否则"串灯"只是一排浮在空中的灯泡。 */
        const y = armY[0];
        const xEdge = half - POLE_INSET;
        const a = new THREE.Vector3(-xEdge, y, z), b = new THREE.Vector3(xEdge, y, z + rnd(-0.4, 0.4));
        ctx.addWire(a, b, 0.5);
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
      /* ★ 2026-09-19 修正：原来 `sp(-half*0.9, half*0.9, ...)` 会把杆撒进
         车道中央 —— 一根杆立在路当中，车只能停死。改与程序化杆同一条带
         （half − POLE_INSET ± 0.3），语义上"杆在路沿"，位置上也就安全。 */
      const side = rng() < 0.5 ? -1 : 1;
      const [x, z] = ctx.spot(side * (half - POLE_INSET - 0.3), side * (half - POLE_INSET + 0.3),
        -S / 2 + 6, S / 2 - 6, 6);
      ctx.place(K.utilityPole(), x, z, rnd(-0.2, 0.2), { tag: 'pole:utility' });
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
      /* 同上：高压杆也归到路沿带，别立在路中间。 */
      const side = rng() < 0.5 ? -1 : 1;
      const [x, z] = ctx.spot(side * (half - POLE_INSET - 0.25), side * (half - POLE_INSET + 0.35),
        -S / 2 + 8, S / 2 - 8, 7);
      ctx.place(K.powerPoleProp(), x, z, rnd(-0.3, 0.3), { tag: 'pole:power' });
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
       ★ 位置由 rows 反推，与 shopUnit 同侧同 z —— 否则篷子会飘在路中央。
       ★★ collide:'none'（2026-09-19 修正）。**本项目的碰撞系统是二维的**
         （place() 只看 footprint 的 w/d，没有高度），所以任何写了 footprint
         的物件都会变成一堵地面墙 —— 对"悬空的篷面"来说这是错的：
         篷面在 2.5m 高，玩家本就该从底下走过去。
         实测后果：篷子的盒子（0.9×3，贴在墙上）恰好盖住**店门锚点**，
         店主被自己的雨棚埋住，且因为左右又被摊位夹住，让位算法逃不出去
         （_diag-anchor：slum/suburb/flower_bird_market 的堵死锚点全部由它造成）。
         悬空件必须显式声明不参与地面碰撞，否则"二维碰撞"会把它们变成墙。 */
    rows.forEach((r, i) => {
      if (chance(0.55)) return;
      const wide = chance(0.4);
      const a = K.awningProp({ wide });
      const side = Math.sign(r.x) || 1;
      ctx.place(a, side * (Math.abs(r.x) - r.d / 2 - 0.5), r.z, side > 0 ? -Math.PI / 2 : Math.PI / 2,
        { collide: 'none', tag: 'awning' });
    });

    return;
  }

  if (kind === 'avenue') {

    // 沿街商铺：贴在每栋楼的临街一侧
    let idx = 0;
    for (const r of rows) {
      const n = rndInt(1, 3);
      const unitW = r.w / (n + 0.4);
      for (let i = 0; i < n; i++) {
        const txt = shopNameFor(spec.id, idx++);
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
      let k = 0;
      /* ★ [2026-09-19] 原来 4.4m 一排、两侧齐撒 —— 菜市场摊位多是应该的，
         但"都长一个样"不该：现在步距放到 5.6、配色/尺寸抖动，
         并登记摊主锚点（人站到摊后）。 */
      for (let z = -S / 2 + 10; z < S / 2 - 10; z += 5.6) {
        for (const side of [-1, 1]) {
          const [x, zz] = sp(side * 5, side * 12, z - 1.2, z + 1.2, 2.6);
          const rot = side > 0 ? -Math.PI / 2 : Math.PI / 2;
          const st = K.stall({
            w: rnd(2.2, 3.0), d: rnd(1.2, 1.5), tier,
            colors: pick(STALL_CANOPY), box: true,
          });
          ctx.place(st, x, zz, rot, {});
          if (chance(0.55)) ctx.lot(x - side * 1.5, zz, 0, 'stall');
          /* 摊主站位在摊位**靠过道那一侧**（同 buildStall 的注释）。 */
          ctx.anchor(x - side * (stallDepth(st) / 2 + 0.4), zz, rot, 'stall');
        }
        ctx.place(K.billboard({
          w: 2.4, h: 0.7, y: 3.4, text: shopNameFor(spec.id, k++), bg: '#5a4030', fg: '#e8dcc8', legs: false,
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
  school: { layout: 'plaza', structure: 'teaching', streetLen: 104, plazaW: 50, mainW: 40, gym: true, formal: true, shortName: '大学城' },
  commercialDist: { layout: 'avenue', structure: 'tower', streetLen: 108, roadW: 16 },
  techPark: { layout: 'plaza', structure: 'tower', streetLen: 104, plazaW: 52, mainW: 26, flagPole: true },
  hospital: { layout: 'compound', structure: 'tower', streetLen: 96, courtW: 38, blocks: 3, formal: true, shortName: '医院' },
  bank: { layout: 'avenue', structure: 'tower', streetLen: 78, roadW: 14 },
  park: { layout: 'plaza', structure: 'hall', streetLen: 96, plazaW: 56, mainW: 17, mainH: 8, formal: true, shortName: '公园' },
  community_center: { layout: 'plaza', structure: 'hall', streetLen: 84, plazaW: 46, mainW: 26, formal: true, shortName: '社区中心' },
  night_market: { layout: 'lane', structure: 'lowRise', streetLen: 96, roadW: 10, maxFloors: 4 },
  trainingCenter: { layout: 'compound', structure: 'hall', streetLen: 82, courtW: 34, blocks: 2, formal: true, shortName: '培训中心' },
  suburb: { layout: 'lane', structure: 'lowRise', streetLen: 110, roadW: 11, maxFloors: 3 },
  luxury_community: { layout: 'compound', structure: 'tower', streetLen: 104, courtW: 40, blocks: 4, formal: true, shortName: '高档小区' },
  old_community: { layout: 'compound', structure: 'slab', streetLen: 96, courtW: 38, blocks: 3, floors: 6, formal: true, shortName: '老旧小区' },
  gov_office: { layout: 'plaza', structure: 'hall', streetLen: 96, plazaW: 50, mainW: 36, flagPole: true, formal: true, shortName: '政务大厅' },
  court: { layout: 'plaza', structure: 'hall', streetLen: 92, plazaW: 50, mainW: 32, flagPole: true, hipRoof: true, formal: true, shortName: '人民法院' },
  job_market: { layout: 'plaza', structure: 'hall', streetLen: 88, plazaW: 46, mainW: 30, formal: true, shortName: '人才市场' },
  entertainment: { layout: 'avenue', structure: 'tower', streetLen: 96, roadW: 15 },
  temple: { layout: 'plaza', structure: 'pavilion', streetLen: 84, plazaW: 46, mainW: 28, hipRoof: true, formal: true, shortName: '古寺' },
  library: { layout: 'plaza', structure: 'hall', streetLen: 88, plazaW: 48, mainW: 32, formal: true, shortName: '图书馆' },
  gym: { layout: 'plaza', structure: 'hall', streetLen: 100, plazaW: 54, mainW: 30, formal: true, shortName: '体育馆' },
  internet_cafe: { layout: 'lane', structure: 'lowRise', streetLen: 72, roadW: 9, maxFloors: 5 },
  logistics_park: { layout: 'yard', structure: 'shed', streetLen: 108 },
  auto_city: { layout: 'avenue', structure: 'tower', streetLen: 100, roadW: 18 },
  flower_bird_market: { layout: 'lane', structure: 'lowRise', streetLen: 88, roadW: 11, maxFloors: 3 },
  flea_market: { layout: 'lane', structure: 'lowRise', streetLen: 84, roadW: 10, maxFloors: 3 },
  vegetable_market: { layout: 'compound', structure: 'hall', streetLen: 80, courtW: 36, blocks: 2, formal: true, stalls: true, shortName: '菜市场' },
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

  /* ★ 播种：本地点一条独立随机流，必须在**任何摆放动作之前**。
     同 id 永远同布局（城市持久 + 验证可复现），异地流不同（不雷同）。
     ★ 必须每次 buildLocation 都重播：这条流是模块级可变状态，
      不重播就会带着上一个地点消费掉的进度继续跑 ——
      表现为"第二次进同一个地点，布局和第一次不一样"。 */
  setRng(locationRng(id));

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

  /* ★ 锚点收口必须在**全部投放结束之后**（propsFor 也在这个位置之前跑完）。
     提前收口等于拿"还没放道具的空街"去判定，收了也是白收 ——
     这正是原来"门口 0.8m 明明是空的、投完道具却成了墙里"的成因。
     见 Ctx.resolveAnchors 的顶注。 */
  ctx.resolveAnchors();

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
    /* ★ 行为锚点交给角色系统（摊主站位 / 店铺门口）。
       不给这一个字段，actors.js 就只能"让所有人沿街走" ——
       因为没有别的地方知道"哪里有个摊位、摊主该站哪边"。 */
    anchors: ctx.anchors,
    /* ★ 锚点收口的读数（2026-09-19）：让"有多少锚点是被挪过的"成为
       一个**可断言**的数，而不是只写进注释就算交代过了。
       没有它，收口逻辑一旦整体失效（比如调用点被删掉），
       表现只是"摊位又站进墙里" —— 而那要靠穿模守卫间接推出来。 */
    anchorPushed: ctx.anchorPushed || 0,
    anchorStuck: ctx.anchorStuck || 0,
    /* ★ 车道走廊（2026-09-19）：|x| < corridor 内不许有静态碰撞盒，
       否则车会被拦死。这个数交出去是为了让验证脚本能**读同一个来源**
       去断言 —— 守卫自己另抄一份公式就又变成"两套判定"了。
       corridorClamped > 0 说明本次布局原本有道具会落进车道（已挖掉）。 */
    corridor: ctx.corridorHalf(),
    /* ★ 硬线（= 走廊 − 留白）：验证脚本按这条断言"车会不会撞上"。
       与 corridor 成对交出去，是为了让守卫用的**就是车流那条公式**，
       而不是自己再近似一个数 —— 两层阈值的理由见 road.js::carCorridor。 */
    carClearance: ctx.clearanceHalf(),
    corridorClamped: ctx.corridorClamped || 0,
    corridorPushed: ctx.corridorPushed || 0,
    corridorStuck: ctx.corridorStuck || 0,
    /* ★ 飞线两端（验证用）。见 Ctx.wires 的注释。 */
    wires: ctx.wires,
    spawn,
    bounds,
    camera: CAMERA[kind] || CAMERA.lane,
    laneHalf: ctx.laneHalf,
    streetLen: ctx.streetLen,
    /* roadW 必须交出去 —— 动态角色系统（actors.js）要靠它算车道中心与
       "靠右行驶"的偏移。只给 laneHalf 不够：lane 布局下 laneHalf 恰好
       等于 roadW/2，但 avenue 是 roadW/2+3.8，反推不出路面宽度。 */
    roadW: ctx.roadW,
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

  /* 打散顺序，避免每次进同一个地点交互点都落在同一处。
     ★ 用 Fisher–Yates，**不用** `sort(() => Math.random() - 0.5)`：
       后者对 >10 个元素走 TimSort，比较器本身不自洽（a<b 且 b<a 可能同时为真），
       结果既**分布有偏**（某些排列概率高得多），又**依赖引擎实现**
       —— 换个 Node 版本布局就变，"可复现"当场失效。既然要复现，就自己洗。 */
  for (let i = spots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [spots[i], spots[j]] = [spots[j], spots[i]];
  }

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
