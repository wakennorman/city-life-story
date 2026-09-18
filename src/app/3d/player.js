import * as THREE from 'three';

/* ── 角色：低模打工者 ───────────────────────────────────────────────────────
   刻意做得很朴素——晦暗调下细节会被压掉，重点是剪影和走路的节奏感。
   ──────────────────────────────────────────────────────────────────────── */

export class Player {
  constructor(scene, colliders, spawn) {
    this.colliders = colliders;
    this.radius = 0.34;
    this.speed = 3.1;
    this.runSpeed = 5.6;
    this.moving = false;
    this.phase = 0;
    this.bounds = { minX: -26, maxX: 26, minZ: -24, maxZ: 24 };

    const g = new THREE.Group();
    const cloth = new THREE.MeshStandardMaterial({ color: 0x3b4048, roughness: 0.92 });
    const skin = new THREE.MeshStandardMaterial({ color: 0xb09070, roughness: 0.85 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x272b2f, roughness: 0.9 });

    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.23, 0.42, 6, 12), cloth);
    torso.position.y = 0.86;
    torso.castShadow = true;
    g.add(torso);

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.163, 16, 12), skin);
    head.position.y = 1.34;
    head.castShadow = true;
    g.add(head);

    const hair = new THREE.Mesh(new THREE.SphereGeometry(0.168, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55), dark);
    hair.position.y = 1.355;
    g.add(hair);

    this.legs = [];
    for (const x of [-0.105, 0.105]) {
      const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.078, 0.44, 4, 8), dark);
      leg.position.set(x, 0.3, 0);
      leg.castShadow = true;
      g.add(leg);
      this.legs.push(leg);
    }

    this.arms = [];
    for (const x of [-0.3, 0.3]) {
      const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.062, 0.38, 4, 8), cloth);
      arm.position.set(x, 0.9, 0);
      arm.castShadow = true;
      g.add(arm);
      this.arms.push(arm);
    }

    const bag = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.36, 0.16),
      new THREE.MeshStandardMaterial({ color: 0x4a3f36, roughness: 0.95 }));
    bag.position.set(0, 0.86, -0.24);
    g.add(bag);

    g.position.copy(spawn);
    scene.add(g);
    this.mesh = g;
    this.pos = g.position;
    this.facing = Math.PI;
  }

  update(dt, keys, camYaw) {
    let ix = 0, iz = 0;
    if (keys.has('KeyW') || keys.has('ArrowUp')) iz -= 1;
    if (keys.has('KeyS') || keys.has('ArrowDown')) iz += 1;
    if (keys.has('KeyA') || keys.has('ArrowLeft')) ix -= 1;
    if (keys.has('KeyD') || keys.has('ArrowRight')) ix += 1;

    const running = keys.has('ShiftLeft') || keys.has('ShiftRight');
    const speed = running ? this.runSpeed : this.speed;

    this.moving = ix !== 0 || iz !== 0;

    if (this.moving) {
      const len = Math.hypot(ix, iz);
      ix /= len; iz /= len;
      // 相机方向 d = (sin yaw, cos yaw)，屏幕右 = (cos yaw, -sin yaw)
      // W 应朝「远离相机」方向，即 -d。推导见下方注释。
      const cos = Math.cos(camYaw), sin = Math.sin(camYaw);
      const dx = ix * cos + iz * sin;
      const dz = -ix * sin + iz * cos;

      this.pos.x += dx * speed * dt;
      this.pos.z += dz * speed * dt;

      const target = Math.atan2(dx, dz);
      let diff = target - this.facing;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      this.facing += diff * Math.min(1, dt * 12);

      this.phase += dt * (running ? 13 : 8.5);
    } else {
      this.phase += dt * 1.6;
    }

    this.resolveCollisions();

    // 走路姿态
    const swing = this.moving ? (running ? 0.85 : 0.6) : 0.06;
    this.legs[0].rotation.x = Math.sin(this.phase) * swing;
    this.legs[1].rotation.x = -Math.sin(this.phase) * swing;
    this.arms[0].rotation.x = -Math.sin(this.phase) * swing * 0.7;
    this.arms[1].rotation.x = Math.sin(this.phase) * swing * 0.7;
    this.mesh.position.y = this.moving ? Math.abs(Math.sin(this.phase)) * 0.035 : 0;

    this.mesh.rotation.y = this.facing;
  }

  resolveCollisions() {
    const r = this.radius;
    for (const c of this.colliders) {
      const nx = Math.max(c.minX, Math.min(this.pos.x, c.maxX));
      const nz = Math.max(c.minZ, Math.min(this.pos.z, c.maxZ));
      let dx = this.pos.x - nx, dz = this.pos.z - nz;
      let d2 = dx * dx + dz * dz;
      if (d2 >= r * r) continue;

      if (d2 < 1e-6) {
        // 落在盒内：沿最近边推出
        const dl = Math.abs(this.pos.x - c.minX), dr = Math.abs(c.maxX - this.pos.x);
        const db = Math.abs(this.pos.z - c.minZ), df = Math.abs(c.maxZ - this.pos.z);
        const m = Math.min(dl, dr, db, df);
        if (m === dl) this.pos.x = c.minX - r;
        else if (m === dr) this.pos.x = c.maxX + r;
        else if (m === db) this.pos.z = c.minZ - r;
        else this.pos.z = c.maxZ + r;
        continue;
      }
      const d = Math.sqrt(d2);
      const push = (r - d) / d;
      this.pos.x += dx * push;
      this.pos.z += dz * push;
      void d2;
    }
    // 场地边界：随地点切换，不再写死
    const B = this.bounds;
    this.pos.x = Math.max(B.minX, Math.min(B.maxX, this.pos.x));
    this.pos.z = Math.max(B.minZ, Math.min(B.maxZ, this.pos.z));
  }

  /** 切换到新地点：换碰撞体、换出生点、换可行走范围 */
  setWorld({ colliders, spawn, bounds }) {
    this.colliders = colliders || [];
    if (spawn) this.pos.set(spawn.x, 0, spawn.z);
    if (bounds) this.bounds = bounds;
    this.moving = false;
    this.phase = 0;
  }
}

/* ── 等轴测跟随相机 ────────────────────────────────────────────────────────
   固定视角（《大多数》的做法）：玩家看到的方位永远一致，不会迷失方向。
   ──────────────────────────────────────────────────────────────────────── */

export class IsoCamera {
  constructor(camera, target, colliders) {
    this.camera = camera;
    this.colliders = colliders || [];
    this.yaw = 0.38;               // ~22° 斜视：既能看出体积，又不在窄巷里撞墙
    this.pitch = 0.76;             // ~44° 俯角：能同时看到路面和建筑立面
    this.dist = 18.0;
    this.minH = 5.5;               // 水平最小距离，保证角色不被贴脸
    this.cur = new THREE.Vector3().copy(target);
    this.apply(this.cur);
  }

  /* 视线遮挡回避。
     只打一条沿相机轴的前向射线是不够的：等轴测机位有横向偏移，
     相机常常"贴着"侧面建筑的墙皮，而那条射线从没碰到它 ——
     结果就是相机卡在厂房/楼体的墙面上，视野被两面墙夹死。
     所以两级处理：
       1) 前向射线：撞到建筑就把相机拉近（保证不穿墙）
       2) 落点复检：相机最终位置若落进某建筑，继续收缩，直到它在所有建筑之外
   */
  clearance(ox, oz, dx, dz, maxD) {
    let best = maxD;
    for (const c of this.colliders) {
      const t = rayAABB2D(ox, oz, dx, dz, c);
      if (t !== null && t < best) best = t;
    }
    return Math.max(this.minH, best - 0.7);
  }

  /** 相机落点若在建筑内（含膨胀量），返回需要再收缩的距离；否则返回 0 */
  penetration(cx, cz) {
    const pad = 0.9;
    let worst = 0;
    for (const c of this.colliders) {
      if (cx > c.minX - pad && cx < c.maxX + pad && cz > c.minZ - pad && cz < c.maxZ + pad) {
        const dl = cx - (c.minX - pad);
        const dr = (c.maxX + pad) - cx;
        const db = cz - (c.minZ - pad);
        const df = (c.maxZ + pad) - cz;
        worst = Math.max(worst, Math.min(dl, dr, db, df));
      }
    }
    return worst;
  }

  apply(p) {
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);
    const nx = Math.sin(this.yaw), nz = Math.cos(this.yaw);
    const hFull = this.dist * cp;
    let h = Math.min(hFull, this.clearance(p.x, p.z, nx, nz, hFull));

    // 落点复检：反复收缩直到相机脱离所有建筑
    for (let i = 0; i < 10; i++) {
      const pen = this.penetration(p.x + nx * h, p.z + nz * h);
      if (pen <= 0) break;
      const next = h - (pen + 0.5);
      if (next <= this.minH) { h = this.minH; break; }
      h = next;
    }

    const dist = h / Math.max(cp, 0.15);
    this.camera.position.set(p.x + nx * h, p.y + dist * sp, p.z + nz * h);
    this.camera.lookAt(p.x, p.y + 0.9, p.z);
  }

  update(dt, target) {
    this.cur.lerp(target, Math.min(1, dt * 6.5));
    this.apply(this.cur);
  }

  /** 切换到新地点：换遮挡体，并按布局微调机位 */
  setWorld({ colliders, target, yaw, pitch, dist, minH } = {}) {
    this.colliders = colliders || [];
    if (yaw != null) this.yaw = yaw;
    if (pitch != null) this.pitch = pitch;
    if (dist != null) this.dist = dist;
    if (minH != null) this.minH = minH;
    if (target) this.cur.copy(target);
    this.apply(this.cur);
  }

  zoom(delta) {
    this.dist = Math.max(9, Math.min(32, this.dist + delta));
  }
}

/* 2D 射线（slab 法）与 AABB 求交，返回入口参数 t；未命中返回 null */
function rayAABB2D(ox, oz, dx, dz, b) {
  let tmin = 0, tmax = Infinity;
  if (Math.abs(dx) < 1e-8) {
    if (ox < b.minX || ox > b.maxX) return null;
  } else {
    let t1 = (b.minX - ox) / dx, t2 = (b.maxX - ox) / dx;
    if (t1 > t2) { const s = t1; t1 = t2; t2 = s; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
  }
  if (Math.abs(dz) < 1e-8) {
    if (oz < b.minZ || oz > b.maxZ) return null;
  } else {
    let t1 = (b.minZ - oz) / dz, t2 = (b.maxZ - oz) / dz;
    if (t1 > t2) { const s = t1; t1 = t2; t2 = s; }
    tmin = Math.max(tmin, t1); tmax = Math.min(tmax, t2);
  }
  if (tmax < tmin || tmax < 0) return null;
  return tmin > 0 ? tmin : 0;
}
