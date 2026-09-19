#!/usr/bin/env node
/**
 * 诊断「空气墙 / 行人原地打转」。
 *
 * ── 它回答两个问题（都是恒稳 2026-09-19 的截图反馈）──────────────────────
 *   ① 谁在打转？—— 逐行人统计"路径长度 / 净位移"，比值越大越像原地打转。
 *   ② 撞的是什么？—— 对打转者附近的每个碰撞盒，从 3m 高处**向下打一条射线**：
 *      命中点 y > 0.25 说明那里真有可见实体（墙/摊位/杆子）；
 *      命中点 y ≤ 0.25（=地面）说明这个盒子**挡住了人却什么也没有** —— 就是空气墙。
 *
 *   ★ 为什么用射线而不是"遍历 mesh 包围盒"：
 *     world.js 会把静态物件 mergeStatics 合批，合批后整条街是**一个** Mesh，
 *     它的包围盒覆盖全场 —— 任何盒子都会被判成"有实体"，检测直接失效。
 *     射线打的是**真实三角面**，合批骗不过它。
 *
 * 用法：node scripts/diag-airwall.cjs [--sec=16] [--loc=slum]
 */

const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer } = require('./lib/serve.cjs');

const PORT = Number(process.env.PORT || 8995);
const ROOT = path.resolve(__dirname, '..');
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

const argv = process.argv.slice(2);
const SEC = Number((argv.find((a) => a.startsWith('--sec=')) || '--sec=16').split('=')[1]);
const LOC = (argv.find((a) => a.startsWith('--loc=')) || '--loc=').split('=')[1] || '';

(async () => {
  console.log('空气墙 / 打转诊断\n');
  console.log('重建探针包…');
  execFileSync(process.execPath, [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });
  await ensureServer({ root: ROOT, port: PORT, label: '空气墙诊断' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const errors = attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });
  if (argv.includes('--solid')) await page.evaluate(() => { window.__AW_SOLID = 1; });

  // 打桩：拿到活的 ActorSystem 实例 + 记录每个 ped 的轨迹
  const patched = await page.evaluate(() => {
    const A = window.Scene3D && window.Scene3D.ActorSystem;
    if (!A || !A.prototype || typeof A.prototype.update !== 'function') return 'no ActorSystem.update';
    const D = { t: 0, traj: null, sys: null, hits: 0 };
    window.__AW = D;
    const origU = A.prototype.update;
    const origS = A.prototype._slide;
    if (typeof origS === 'function') {
      A.prototype._slide = function (x0, z0, x1, z1, r) {
        const o = origS.apply(this, arguments);
        if (o && o.hit) {
          D.hits++;
          (D.hitPts || (D.hitPts = [])).push([+((x0 + x1) / 2).toFixed(2), +((z0 + z1) / 2).toFixed(2)]);
          if (D.hitPts.length > 4000) D.hitPts.shift();
        }
        return o;
      };
    }
    A.prototype.update = function (dt, pp) {
      try {
        D.sys = this;
        D.t += dt;
        const peds = (this.actors || []).filter((a) => a.kind === 'ped');
        if (!D.traj) D.traj = peds.map(() => []);
        while (D.traj.length < peds.length) D.traj.push([]);
        for (let i = 0; i < peds.length; i++) {
          const p = peds[i].obj.position;
          const arr = D.traj[i];
          const last = arr[arr.length - 1];
          if (!last || Math.abs(last[0] - p.x) > 1e-4 || Math.abs(last[1] - p.z) > 1e-4) {
            arr.push([+p.x.toFixed(3), +p.z.toFixed(3)]);
            if (arr.length > 3000) arr.shift();
          }
        }
      } catch (e) {
        D.err = String((e && e.message) || e);
      }
      return origU.call(this, dt, pp);
    };
    return 'ok';
  });
  if (patched !== 'ok') { console.error('打桩失败：', patched); await browser.close(); process.exit(1); }

  // 跑 SEC 秒
  await page.evaluate((SEC) => new Promise((res) => {
    let sim = 0, prev = performance.now();
    const f = () => {
      const now = performance.now();
      sim += Math.min(0.05, (now - prev) / 1000); prev = now;
      if (sim >= SEC) return res();
      requestAnimationFrame(f);
    };
    requestAnimationFrame(f);
  }), SEC);

  const out = await page.evaluate(() => {
    const D = window.__AW;
    const sys = D.sys;
    if (!sys) return { err: 'no sys' };
    /* THREE 没有挂到 window 上（probe bundle 只导出 Scene3D），
       所以**不能**用 THREE.Raycaster —— 但 scene 是活的 Object3D，
       traverse / matrixWorld 都在，顶点数组也在。自己算就够了。 */
    let scene = sys.scene || (sys.world && sys.world.scene) || null;
    if (!scene) {
      const anyObj = (sys.actors || [])[0] && sys.actors[0].obj;
      let p = anyObj;
      while (p && p.parent) p = p.parent;
      scene = p;
    }
    if (!scene) return { err: 'no scene' };

    // ── 逐人打转指标 ──
    const peds = (sys.actors || []).filter((a) => a.kind === 'ped');
    const stats = [];
    for (let i = 0; i < peds.length; i++) {
      const arr = (D.traj && D.traj[i]) || [];
      if (arr.length < 4) continue;
      let pathLen = 0;
      for (let k = 1; k < arr.length; k++) pathLen += Math.hypot(arr[k][0] - arr[k - 1][0], arr[k][1] - arr[k - 1][1]);
      const net = Math.hypot(arr[arr.length - 1][0] - arr[0][0], arr[arr.length - 1][1] - arr[0][1]);
      let minX = 1e9, maxX = -1e9, minZ = 1e9, maxZ = -1e9;
      for (const p of arr) { minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]); minZ = Math.min(minZ, p[1]); maxZ = Math.max(maxZ, p[1]); }
      const p = peds[i].obj.position;
      stats.push({
        i, pathLen: +pathLen.toFixed(2), net: +net.toFixed(2),
        ratio: +(pathLen / Math.max(net, 0.15)).toFixed(2),
        spanX: +(maxX - minX).toFixed(2), spanZ: +(maxZ - minZ).toFixed(2),
        at: [+p.x.toFixed(2), +p.z.toFixed(2)],
      });
    }
    stats.sort((a, b) => b.ratio - a.ratio);

    /* ── 碰撞盒体检：找出"挡人却没有可见实体"的盒子 ──────────────────────
       ★ 为什么不用 mesh 包围盒：world.js 会把静态物件 mergeStatics 合批，
         合批后整条街是**一个** Mesh，包围盒覆盖全场 —— 任何盒子都会被判成
         "有实体"，检测直接失效。
       ★ 改用**顶点云**：把所有可见 mesh 的顶点按世界坐标投到 0.25m 的
         平面网格上，只保留 y∈[0.25, 3.2]（人的高度带）的顶点。
         盒子里一个顶点都没有 = 那里确实是空的 = 空气墙。 */
    const CELL = 0.25;
    const occ = new Map();
    let vtxTotal = 0, vtxInBand = 0, meshN = 0;
    /* ★ 顶点遍历是**可选**的（--solid 才开）：整条街合批后有几十万顶点，
       逐顶点做矩阵乘法 + Map 写字符串 key，在无头软件渲染下要跑到分钟级，
       而它回答的是**第二**个问题。默认只做"谁在打转 + 撞的是什么盒子"，
       那才是先要回答的。★ 所以 solid 未开时一律记 -1，绝不能让 -1 被
       当成"空气墙" —— 下面的输出层已按 -1 单独归类。 */
    const SOLID = !!window.__AW_SOLID;
    if (SOLID) {
    scene.updateMatrixWorld(true);
    scene.traverse((o) => {
      let p = o;
      while (p) { if (!p.visible) return; p = p.parent; }      // 父级隐藏 → 整个子树不算
      const g = o.geometry;
      if (!g || !g.attributes || !g.attributes.position) return;
      const attr = g.attributes.position;
      const arr = attr.array, step = attr.itemSize || 3;
      const e = o.matrixWorld.elements;
      meshN++;
      for (let k = 0; k < arr.length; k += step) {
        const x = arr[k], y = arr[k + 1], z = arr[k + 2];
        vtxTotal++;
        const wy = e[1] * x + e[5] * y + e[9] * z + e[13];
        if (wy < 0.25 || wy > 3.2) continue;
        const wx = e[0] * x + e[4] * y + e[8] * z + e[12];
        const wz = e[2] * x + e[6] * y + e[10] * z + e[14];
        const key = Math.floor(wx / CELL) + ',' + Math.floor(wz / CELL);
        occ.set(key, (occ.get(key) || 0) + 1);
        vtxInBand++;
      }
    });
    }

    const probe = (x, z) => {   // 该 XZ 处 0.25m 格内是否有实体顶点
      if (!SOLID) return -1;    // 未开顶点遍历：不参与"空气墙"判定
      return occ.get(Math.floor(x / CELL) + ',' + Math.floor(z / CELL)) || 0;
    };
    const boxes = [];
    for (const c of sys.colliders || []) {
      c.__aw = boxes.length;          // 反查索引：boxes 与 colliders 同序
      const w = c.maxX - c.minX, d = c.maxZ - c.minZ;
      const cx = (c.minX + c.maxX) / 2, cz = (c.minZ + c.maxZ) / 2;
      /* 盒内**逐格**采样，取最大占用数：只要盒子里任何一处有实体，
         它就可能是"看得见的墙/摊位"，不该被判成空气墙。 */
      let best = SOLID ? 0 : -1;
      const nx = Math.max(1, Math.ceil(w / CELL)), nz = Math.max(1, Math.ceil(d / CELL));
      for (let ix = 0; ix < nx; ix++) {
        for (let iz = 0; iz < nz; iz++) {
          const px = c.minX + (ix + 0.5) * CELL, pz = c.minZ + (iz + 0.5) * CELL;
          const v = probe(px, pz);
          if (v > best) best = v;
        }
      }
      boxes.push({
        tag: c.tag || '?',
        box: [+c.minX.toFixed(2), +c.maxX.toFixed(2), +c.minZ.toFixed(2), +c.maxZ.toFixed(2)],
        cx: +cx.toFixed(2), cz: +cz.toFixed(2),
        w: +w.toFixed(2), d: +d.toFixed(2),
        solid: best,
      });
    }
    const ghosts = SOLID ? boxes.filter((b) => b.solid === 0) : [];

    // ── 打转者脚边的盒子 ──
    const nearSpinners = [];
    for (const s of stats.slice(0, 6)) {
      const [x, z] = s.at;
      const near = (sys.colliders || []).map((c) => ({ c, dist: Math.hypot((c.minX + c.maxX) / 2 - x, (c.minZ + c.maxZ) / 2 - z) }))
        .filter((o) => o.dist < 2.6).sort((a, b) => a.dist - b.dist)
        .map((o) => ({
          tag: o.c.tag || '?',
          box: [+o.c.minX.toFixed(2), +o.c.maxX.toFixed(2), +o.c.minZ.toFixed(2), +o.c.maxZ.toFixed(2)],
          dist: +o.dist.toFixed(2),
          solid: boxes[o.c.__aw] ? boxes[o.c.__aw].solid : -2,
        }));
      nearSpinners.push({ ...s, near: near.slice(0, 5) });
    }

    /* 绕障的副作用读数：横让会把行人推向街心，推过头就成了"人走在车道上"。
       这个数必须能读 —— 修了打转却把人赶到马路上，等于换了一个更显眼的毛病。 */
    const COR = (typeof sys.corridorHalf === 'function') ? sys.corridorHalf() : 2.2;
    let laneIn = 0, minAbsX = 1e9;
    for (const p of peds) {
      const ax = Math.abs(p.obj.position.x);
      if (ax < COR) laneIn++;
      if (ax < minAbsX) minAbsX = ax;
    }

    return {
      pedCount: peds.length, colliderCount: (sys.colliders || []).length,
      laneIn, minAbsX: +minAbsX.toFixed(2), corridor: +COR.toFixed(2),
      slideHits: D.hits, simT: +D.t.toFixed(1),
      vtx: { meshes: meshN, total: vtxTotal, inBand: vtxInBand },
      topSpinners: nearSpinners,
      ghosts,
      allBoxes: boxes,
      tagCount: boxes.reduce((m, b) => { m[b.tag] = (m[b.tag] || 0) + 1; return m; }, {}),
      err: D.err || null,
    };
  });

  console.log('\n──── 概览 ────');
  console.log(`行人 ${out.pedCount} · 碰撞盒 ${out.colliderCount} · 撞墙 ${out.slideHits} 次 · 仿真 ${out.simT}s`);
  if (out.vtx) console.log(`顶点云：${out.vtx.meshes} 个 mesh / ${out.vtx.total} 顶点，其中 ${out.vtx.inBand} 个落在 0.25~3.2m 高度带`);
  console.log(`绕障副作用：车道走廊 |x|<${out.corridor} 内有 ${out.laneIn}/${out.pedCount} 人 · 最小 |x| = ${out.minAbsX}`);
  if (out.err) console.log('打桩错误：', out.err);
  console.log('盒子按 tag 统计：', JSON.stringify(out.tagCount));

  console.log('\n──── 打转排行（ratio = 路径长/净位移，越大越像原地打转）────');
  for (const s of out.topSpinners) {
    console.log(`  #${s.i} ratio=${s.ratio} 路径${s.pathLen}m 净位移${s.net}m 活动范围${s.spanX}×${s.spanZ}m 位置(${s.at[0]}, ${s.at[1]})`);
    for (const n of s.near) {
      console.log(`      ↳ ${n.dist}m  ${n.tag.padEnd(14)} box=[${n.box.join(', ')}]  ${n.solid < 0 ? '（未开顶点检测）' : (n.solid > 0 ? '有实体' : '★空气墙')}`);
    }
  }

  console.log(`\n──── 空气墙清单（${out.ghosts.length} 个盒子挡人却无可见实体）────`);
  for (const g of out.ghosts) {
    console.log(`  ${g.tag.padEnd(16)} 中心(${g.cx}, ${g.cz}) 尺寸 ${g.w}×${g.d}m  box=[${g.box.join(', ')}]`);
  }
  if (!out.ghosts.length) console.log('  （未开 --solid 时不做实体检测；加 --solid 才会真的去数顶点）');

  /* 全量盒子：对称性只能靠人眼扫 ——
     恒稳说"路的对面同一个地方也有一个"，那必然是**镜像摆放**的同类物件，
     按 x 排序后两两一对会立刻显形。 */
  console.log('\n──── 全部碰撞盒（按 |x| 分组，看对称）────');
  const all = (out.allBoxes || []).slice().sort((a, b) => Math.abs(a.cx) - Math.abs(b.cx) || a.cz - b.cz);
  for (const b of all) {
    console.log(`  ${b.tag.padEnd(16)} x∈[${b.box[0]}, ${b.box[1]}]  z∈[${b.box[2]}, ${b.box[3]}]  ${b.w}×${b.d}m`);
  }

  if (errors.length) console.log('\n页面错误：', errors.slice(0, 5));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
