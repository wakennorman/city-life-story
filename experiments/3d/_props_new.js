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
    // 路灯：沿人行道等距
    for (let z = -S / 2 + 6; z < S / 2; z += 16) {
      for (const side of [-1, 1]) {
        if (Math.abs(z - ctx.spawnZ) < 3) continue;
        const l = K.streetLamp({ h: 7.4, tier });
        ctx.place(l, side * (half - 0.5), z, side > 0 ? Math.PI : 0, {});
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
      const [x, z] = sp(-20, 20, -S / 2 + 6, S / 2 - 6, 5);
      const c = K.car({ color: pick([0x3a4148, 0x5a5a5a, 0x4a5a6a]), kind: chance(0.6) ? 'truck' : 'sedan' });
      ctx.place(c, x, z, chance(0.5) ? 0 : Math.PI / 2, {});
    }
    for (let i = 0; i < 6; i++) {
      const [x, z] = sp(-18, 18, -S / 2 + 4, S / 2 - 4, 3.2);
      ctx.place(K.twoWheeler({ kind: 'tricycle', color: pick([0x4a5a4a, 0x6a4a3a]) }), x, z, rnd(0, Math.PI * 2), {});
    }
    for (let i = 0; i < 4; i++) {
      const [x, z] = sp(-18, 18, -S / 2 + 4, S / 2 - 4, 3.2);
      ctx.place(K.bin({ large: true }), x, z, rnd(0, Math.PI * 2), {});
    }
    if (spec.structure === 'site') {
      // 工地堆放：钢筋 / 模板 / 砂石
      for (let i = 0; i < 14; i++) {
        const [x, z] = sp(-18, 18, -S / 2 + 4, S / 2 - 4, 3.0);
        const stock = new THREE.Mesh(
          chance(0.5) ? new THREE.BoxGeometry(rnd(1.4, 2.6), rnd(0.3, 0.7), rnd(0.9, 1.5))
            : new THREE.CylinderGeometry(rnd(0.3, 0.6), rnd(0.3, 0.6), rnd(1.2, 3), 10),
          new THREE.MeshStandardMaterial({ color: pick([0x6a5a4a, 0x8a8078, 0x5a4a3a, 0x4a4a4a]), roughness: 0.9, metalness: 0.2 }));
        stock.position.y = 0.4;
        stock.castShadow = true;
        ctx.place(stock, x, z, rnd(0, Math.PI), {});
      }
      for (let i = 0; i < 8; i++) {
        const [x, z] = sp(-20, 20, -S / 2 + 4, S / 2 - 4, 3.0);
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
