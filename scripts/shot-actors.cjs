#!/usr/bin/env node
/**
 * 角色系统「实物取证」截图（人流 / 车流 / 动物 / 人形五官 / 场景内提醒）
 *
 * ── 为什么单独一个脚本 ────────────────────────────────────────────────────
 * verify-actors.cjs 的断言能证明"有 17 个人、车靠右、角色在动"，
 * 但**证明不了"看起来像人"**。数值全绿而模型像积木，是完全可能的。
 * 本脚本负责把相机拉到能看清的距离，逐项拍下来供人工复核 ——
 * 断言替代不了眼睛，两者必须都在。
 *
 * ── 关于机位的一个硬约束（看完再改机位参数）────────────────────────────
 *   IsoCamera 的 dist 被 clamp 在 [9, 32]（player.js::zoom），默认 16~18。
 *   46° 垂直 FOV、900px 高时，9m 处的画面高度约 7.6m：
 *     · 1.72m 的人 ≈ 200px 高（默认 17m 时只有约 105px）
 *     · 头（0.21m）≈ 25px，眼睛（0.038m）≈ 4.5px
 *   → **默认机位下脸是看不清的**。所以本脚本的"造型检查"一张里把角色放大 2 倍，
 *     它展示的是**几何本身有多细**，不代表游戏内观感 —— 两者别混。
 *
 * 用法：node scripts/shot-actors.cjs
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE, attachErrorSink } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'dev/_3dtest/shots-actors');
const PORT = Number(process.env.PORT || 8982);
const DOC = '/dev/_3dtest/shell.html';
const PROBE = 'dev/_3dtest/bundle-probe.js';

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  console.log('重建探针包…');
  execFileSync(process.execPath,
    [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', PROBE],
    { cwd: ROOT, stdio: 'pipe' });

  const own = await ensureServer({ root: ROOT, port: PORT, label: '角色取证' });
  const browser = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
  attachErrorSink(page);
  await page.goto(`http://127.0.0.1:${PORT}${DOC}`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForFunction(() => !!window.Scene3D && window.__shellReady === true, { timeout: 60000 });

  /* 等若干帧，别在资产/角色刚登记、还没收敛时拍。 */
  const settle = (frames = 40) => page.evaluate((n) => new Promise((r) => {
    let i = 0;
    const f = () => (++i >= n ? r(i) : requestAnimationFrame(f));
    requestAnimationFrame(f);
  }), frames);

  const shot = async (name) => {
    await settle(12);
    await page.screenshot({ path: path.join(OUT, name) });
    console.log(`  · ${name}`);
  };

  const pickLoc = (layout) => page.evaluate((lay) => {
    const spec = window.Scene3D.SPECS || {};
    const id = Object.keys(spec).find((k) => spec[k].layout === lay);
    if (id) window.__shell.loadLocation(id);
    return id || null;
  }, layout);

  console.log('\n拍摄中…');

  /* ── ① 城中村街景：人流 + 车流 + 虫群（真实游戏状态，不摆拍）── */
  const lane = await pickLoc('lane');
  await settle(60);
  await page.evaluate(() => window.__shell.view3d.zoom(-99));   // 拉到最近
  await shot('1-street-lane-day.png');

  /* ── ② 大道：双向车流 ── */
  const av = await pickLoc('avenue');
  await settle(60);
  await page.evaluate(() => window.__shell.view3d.zoom(-99));
  await shot('2-street-avenue-day.png');

  /* ── ③ 造型检查：把各类角色摆成一条线，放大 2 倍看清几何 ──
     摆位靠 cameraPos 算，不靠猜方向：相机在 C、玩家在 P，
     沿 C→P 走 78% 处开场，横向铺开，并让每个都**转向相机**。
     （曾经吃过"猜相机在哪一侧"的亏，这里直接用真实机位推。） */
  const staged = await page.evaluate(() => {
    const S = window.Scene3D;
    const v = window.__shell.view3d;
    const sc = v.scene;
    let seed = 20260919;
    const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };

    const C = v.cameraPos, P = v.playerPos;
    let fx = P.x - C.x, fz = P.z - C.z;
    const fl = Math.hypot(fx, fz) || 1;
    fx /= fl; fz /= fl;
    const rx = fz, rz = -fx;                    // 右 = forward × up（见 actors.js 文件头）
    const t = 0.78;
    const bx = C.x + fx * fl * t, bz = C.z + fz * fl * t;

    const made = [];
    const put = (obj, lateral, scaleY) => {
      const x = bx + rx * lateral, z = bz + rz * lateral;
      obj.position.set(x, 0, z);
      /* 面向相机：模型静止时朝 +Z，故 rotation.y = atan2(toCam.x, toCam.z)。 */
      obj.rotation.y = Math.atan2(C.x - x, C.z - z);
      if (scaleY) obj.scale.multiplyScalar(scaleY);
      sc.add(obj);
      made.push(obj);
      return obj;
    };

    /* 4 个人形：不同身高与随机外观（背包/帽子/发型由 rng 决定）。 */
    put(S.buildHuman(rng, 2.0), -3.6);
    put(S.buildHuman(rng, 1.85), -2.4);
    put(S.buildHuman(rng, 2.05), -1.2);
    put(S.buildHuman(rng, 1.9), 0);
    put(S.buildDog(rng), 1.3);
    put(S.buildCat(rng), 2.1);
    /* 车/摩托体量大，缩到 0.75 才塞得下；它们本来就比人宽得多。 */
    put(S.buildCar(rng), 4.0, 0.75);
    const bike = put(S.buildBike(rng), -4.8, 0.9);
    void bike;
    window.__staged = made;
    return { n: made.length, camY: +C.y.toFixed(2), dist: +Math.hypot(C.x - P.x, C.z - P.z).toFixed(2) };
  });
  console.log(`     摆位：${staged.n} 个 · 相机高 ${staged.camY}m · 水平距离 ${staged.dist}m`);
  await shot('3-cast-lineup-x2.png');

  /* ── ④ 3D 场景内提醒（网页浮条已换成场景 sprite）── */
  await page.evaluate(() => {
    const v = window.__shell.view3d;
    v.notify('这一步现在做不了：体力不足', { kind: 'warn' });
    v.notify('已到达：城南商业街', { kind: 'ok' });
  });
  await shot('4-notice-in-scene.png');

  /* ── ⑤ 夜间同一批人（检查角色在夜灯下是否发黑/穿帮）── */
  await page.evaluate(() => {
    window.__shell.view3d.setTimeSlot('夜间');
  });
  await settle(40);
  await shot('5-cast-night.png');

  /* ── ⑥ 收尾：拆掉摆拍、恢复时段与缩放，拍一张"无摆拍"对照 ── */
  await page.evaluate(() => {
    for (const o of window.__staged || []) o.parent && o.parent.remove(o);
    window.__staged = [];
    window.__shell.view3d.setTimeSlot('上午');
    window.__shell.view3d.zoom(+99);
  });
  await settle(30);
  await shot('6-street-lane-plain.png');

  /* ── 截图自检 ─────────────────────────────────────────────────────────
     ★ 为什么截图也要断言：取证截图最常见的失败不是"拍错东西"，
       而是**拍出来一片纯色**（相机卡进墙里、场景没加载、后处理把画面压黑），
       然后人拿到一张黑图还得自己猜是哪一步坏的。
       这里用浏览器自己的 canvas 解码 PNG（Node 侧没有内置解码器），
       统计亮度均值与颜色种类数：正常街景必然又亮又有大量颜色。 */
  const rows = [];
  for (const f of fs.readdirSync(OUT).filter((x) => x.endsWith('.png')).sort()) {
    const b64 = fs.readFileSync(path.join(OUT, f)).toString('base64');
    const st = await page.evaluate(async (b64) => {
      const img = new Image();
      img.src = 'data:image/png;base64,' + b64;
      await img.decode();
      const c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      const g = c.getContext('2d');
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      let sum = 0, n = 0;
      const colors = new Set();
      for (let i = 0; i < d.length; i += 4 * 37) {   // 抽样即可，无需逐像素
        sum += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        n++;
        colors.add((d[i] >> 4) * 256 + (d[i + 1] >> 4) * 16 + (d[i + 2] >> 4));
      }
      /* 3×3 分块亮度：均值说明不了"整屏全黑"还是"暗但局部有灯"，
         分块一眼可分（左上=天空/远景，中下=人物与前场）。 */
      const tiles = [];
      for (let ty = 0; ty < 3; ty++) {
        for (let tx = 0; tx < 3; tx++) {
          const x0 = Math.floor(tx * c.width / 3), x1 = Math.floor((tx + 1) * c.width / 3);
          const y0 = Math.floor(ty * c.height / 3), y1 = Math.floor((ty + 1) * c.height / 3);
          let s = 0, m = 0;
          for (let y = y0; y < y1; y += 6) {
            for (let x = x0; x < x1; x += 6) {
              const i = (y * c.width + x) * 4;
              s += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
              m++;
            }
          }
          tiles.push(Math.round(s / m));
        }
      }
      return { lum: +(sum / n).toFixed(1), colors: colors.size, tiles };
    }, b64);
    rows.push({ f, ...st });
  }
  console.log('\n截图自检（亮度均值 / 颜色种类 / 3×3 分块亮度）：');
  let bad = 0;
  for (const r of rows) {
    const ok = r.lum > 12 && r.colors > 40;
    if (!ok) bad++;
    console.log(`  ${ok ? '✅' : '❌'} ${r.f.padEnd(28)} 亮度 ${String(r.lum).padStart(5)} · 颜色 ${String(r.colors).padStart(3)}`
      + ` · 分块 [${r.tiles.join(' ')}]`);
  }
  if (bad) console.log(`  ⚠️ 有 ${bad} 张疑似纯色/过暗，请先确认相机与环境再做判断。`);

  await browser.close();
  await closeServer(own);
  console.log(`\n截图目录：${path.relative(ROOT, OUT)}`);
})().catch((e) => { console.error(e); process.exit(1); });
