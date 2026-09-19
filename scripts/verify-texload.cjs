#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────────────────────────
   真实扫描贴图（Poly Haven PBR）**接入链路**门禁。

   ── 为什么不能靠 verify-polyhaven / verify-textures ──────────────────────────
     · verify-textures.cjs  —— 管的是**程序化**贴图的画质（块级/像素级 CV）。
     · verify-polyhaven.cjs —— 管的是外部 **GLB 模型**的接入（尺寸/缩放/附属文件）。
     真实扫描**贴图**这条链是第三个东西，而且它的失败模式全是静默的：
       "文件下下来了" ≠ "贴图挂到材质上了" ≠ "GPU 上真的换了内容"。
     这三件事依次为真，前一真推不出后一真，而且**都不报错**：
       · 只下文件不挂材质 → 画面照常（还是程序化），15/15 就绪照样打出来；
       · 挂了材质没上 GPU → JS 侧 map.image 是 <img>、swapped>0、截图外无任何症状，
         但屏幕上还是程序化内容（three 的 texStorage2D 只在首帧分配，
         之后 texSubImage2D 遇到尺寸变化会失败 —— 只留一条 GL_INVALID_VALUE）。

   ── 本脚本的断言分三层 ────────────────────────────────────────────────────
     L1 磁盘层：清单里每个槽位的文件真的在磁盘上（抓"清单写了但没下"）。
     L2 绑定层：运行时状态 + **真实场景树**里的材质（抓"只挂了原型、克隆体没挂"）。
     L3 GPU 层：GL 错误计数 + **像素级 A/B**（抓"JS 改了但显存没换"）。
     L3 是这套断言里唯一无法被 JS 侧读数骗过的一层 —— 所以它必须在。

   用法：
     node scripts/verify-texload.cjs              # 跑门禁
     node scripts/verify-texload.cjs --verbose    # 额外打印逐材质读数表
   ────────────────────────────────────────────────────────────────────────────── */
const path = require('path');
const fs = require('fs');
const { execFileSync } = require('child_process');
const { chromium } = require('playwright-core');
const { EDGE } = require('./_boot.cjs');
const { ensureServer, closeServer } = require('./lib/serve.cjs');

const ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 8994);
const VERBOSE = process.argv.includes('--verbose');

const fails = [];
const warns = [];
const ok = (cond, msg) => { if (!cond) fails.push(msg); return cond; };
const warn = (cond, msg) => { if (!cond) warns.push(msg); return cond; };

(async () => {
  /* ── L1 磁盘层 ─────────────────────────────────────────────────────── */
  /* 清单是 ES 模块（不是 JSON）—— 用动态 import 读，见 gen-texture-manifest.cjs 顶注。 */
  const { pathToFileURL } = require('url');
  const manifest = (await import(pathToFileURL(
    path.join(ROOT, 'src/app/3d/polyhaven-textures.js')).href)).default;
  const ids = Object.keys(manifest.items);
  console.log(`清单：${ids.length} 套贴图集 · ${manifest.resolution} · ${manifest.license}`);
  ok(ids.length >= 12, `清单条目太少（${ids.length}），可能没跑 gen-texture-manifest.cjs`);

  let slotFiles = 0, missing = [];
  for (const [as, it] of Object.entries(manifest.items)) {
    ok(typeof it.meters === 'number' && it.meters > 0, `${as}: 缺真实米数 meters（尺度会退回默认值）`);
    ok(it.files && it.files.map && it.files.normalMap && it.files.roughnessMap,
      `${as}: 槽位不全（必须有 map / normalMap / roughnessMap 三件套）`);
    for (const [slot, rel] of Object.entries(it.files || {})) {
      slotFiles++;
      const f = path.join(ROOT, 'src', manifest.base, rel);
      if (!fs.existsSync(f)) missing.push(`${as}/${slot} → ${rel}`);
    }
  }
  ok(missing.length === 0, `磁盘缺文件 ${missing.length} 个：${missing.slice(0, 4).join(' | ')}`);
  console.log(`磁盘：${slotFiles} 个槽位文件全部就位${missing.length ? '（有缺！）' : ' ✓'}`);
  /* 许可：CC0 才能商用且免署名。换成别的源必须在这里改，否则会静默违规。 */
  ok(/CC0/i.test(manifest.license || ''), `许可不是 CC0（现为 ${manifest.license}）—— 商用/署名要求需重新评估`);
  ok(manifest.commercialUse === true, '清单未声明可商用');

  /* ── 起浏览器 ──────────────────────────────────────────────────────── */
  execFileSync(process.execPath,
    [path.join(__dirname, 'build-3d-bundle.cjs'), '--out', 'dev/_3dtest/bundle-probe.js'],
    { cwd: ROOT, stdio: 'pipe' });
  const own = await ensureServer({ root: ROOT, port: PORT, label: 'verify-texload' });
  const b = await chromium.launch({ executablePath: EDGE, args: ['--enable-unsafe-swiftshader'] });
  const p = await b.newPage({ viewport: { width: 1280, height: 800 } });

  /* ★ GL 上传错误必须单独收集 —— 这是 L3 唯一的"零成本"信号。
     texSubImage2D 尺寸不匹配不会抛异常、不会让页面红，只在控制台留一条
     GL_INVALID_VALUE。不主动收集就等于没有。 */
  const glErrors = [];
  p.on('console', (m) => {
    const t = m.text();
    if (/GL_INVALID|texSubImage|texStorage/i.test(t)) glErrors.push(t.slice(0, 140));
  });
  p.on('pageerror', (e) => fails.push('页面异常：' + e.message));

  await p.goto(`http://127.0.0.1:${PORT}/dev/_3dtest/shell.html`, { waitUntil: 'load', timeout: 60000 });
  await p.waitForTimeout(6000);

  /* ── L2 绑定层 ─────────────────────────────────────────────────────── */
  const st = await p.evaluate(() => (window.Scene3D && window.Scene3D.textureStats ? window.Scene3D.textureStats() : null));
  if (!ok(st, 'Scene3D.textureStats 不存在 —— 3D 层没暴露读数，本门禁无法工作')) {
    await b.close(); if (own) await closeServer(); report(); process.exit(1);
  }
  console.log(`运行时：${JSON.stringify(st.byState)} · settled=${st.settled} · enabled=${st.enabled}`);
  ok(st.byState.fail === 0, `有 ${st.byState.fail} 套贴图加载失败：${st.errors.slice(0, 3).join(' | ')}`);
  ok(st.settled === true, '贴图未落定（textureSettled=false）—— 断言会在加载中途跑，结论不可信');
  ok(st.byState.ok === ids.length, `就绪数 ${st.byState.ok} ≠ 清单 ${ids.length}`);

  /* ★ swapped 是"链路真的通了"的最硬 JS 侧证据：
     byState.ok 只说明"文件加载成功"，swapped 才说明"换到了材质上"。
     没有它，"15/15 就绪"这句话可以在一张贴图都没挂上时照样打印。 */
  ok(st.swapped > 0, 'swapped=0 —— 贴图加载了但一个槽位都没换到材质上（热替换链路断了）');
  ok(st.swapped >= st.boundTotal * 2, `swapped(${st.swapped}) 少于"绑定材质数×2"(${st.boundTotal * 2})，疑似有槽位没换`);
  ok(st.slotMiss.length === 0, `有槽位挂不上去：${JSON.stringify(st.slotMiss)}`);
  ok(st.boundTotal >= ids.length, `绑定材质数 ${st.boundTotal} < 清单 ${ids.length}（有贴图集没被任何材质使用）`);
  for (const id of ids) {
    if (!ok(st.bound[id] >= 1, `${id} 没有任何材质绑定它（清单里有、代码里没用）`)) break;
  }
  ok(st.sizeChanges.length > 0,
    'sizeChanges 为空 —— 说明"程序化兜底 → 真实贴图"的尺寸变迁一次都没发生，'
    + '要么贴图没换上，要么程序化与真实贴图分辨率恰好相同（此时重分配风险自然消失）');

  /* 真实场景树：真正渲染的是克隆体，只看原型会漏掉"只挂了原型"这类缺陷。 */
  const scene = await p.evaluate(() => {
    const S3 = window.Scene3D;
    const sh = window.__shell;
    const sc = sh && sh.view3d && sh.view3d.scene;
    if (!sc) return { err: 'scene 取不到' };
    /* 原型材质 uuid 集合 —— 用来区分"原型"与"克隆体"。 */
    const P = S3.palette();
    const protoUuids = new Set();
    const add = (m) => { if (m) protoUuids.add(m.uuid); };
    for (const t of [1, 2, 3]) {
      add(P.tiers[t] && P.tiers[t].ground);
      ((P.tiers[t] && P.tiers[t].walls) || []).forEach(add);
    }
    Object.values(P.common || {}).forEach((m) => { if (m && m.isMaterial) add(m); });

    const rows = [];
    let boundClones = 0, canvasMaps = [], roughBad = [], colorBad = [];
    sc.traverse((o) => {
      if (!o.isMesh || !o.material) return;
      for (const m of (Array.isArray(o.material) ? o.material : [o.material])) {
        if (!m.userData || !m.userData.texBind) continue;
        if (!protoUuids.has(m.uuid)) boundClones++;
        const img = m.map && m.map.image;
        const kind = img ? (img.tagName === 'IMG' ? 'img' : img.tagName === 'CANVAS' ? 'canvas' : '?') : 'none';
        if (kind !== 'img') canvasMaps.push(m.userData.texBind.as);
        /* roughness 必须归 1（从此由 arm 的绿通道决定）；否则是"贴图×材质值"双重衰减。 */
        if (m.roughnessMap && Math.abs(m.roughness - 1) > 1e-6) roughBad.push(m.userData.texBind.as + '=' + m.roughness);
        /* 真实贴图自带颜色 → 材质色必须归白，否则乘出偏色。 */
        if (m.color && m.color.getHex() !== 0xffffff) colorBad.push(m.userData.texBind.as + '=#' + m.color.getHexString());
        rows.push({
          as: m.userData.texBind.as, kind, clone: !protoUuids.has(m.uuid),
          rep: m.map ? [+m.map.repeat.x.toFixed(2), +m.map.repeat.y.toFixed(2)] : null,
          nor: !!(m.normalMap && m.normalMap.image && m.normalMap.image.tagName === 'IMG'),
          arm: !!(m.roughnessMap && m.roughnessMap.image && m.roughnessMap.image.tagName === 'IMG'),
          size: img ? img.width + 'x' + img.height : '-',
        });
      }
    });
    return { rows, boundClones, canvasMaps, roughBad, colorBad, meshes: sc.children.length };
  });

  if (scene.err) fails.push('场景树读取失败：' + scene.err);
  else {
    const n = scene.rows.length;
    console.log(`场景树：${n} 个带贴图绑定的材质（其中克隆体 ${scene.boundClones} 个）`);
    ok(n >= ids.length, `场景里只有 ${n} 个绑定材质，少于清单 ${ids.length}`);
    ok(scene.canvasMaps.length === 0,
      `${scene.canvasMaps.length} 个绑定材质的 map 仍是程序化兜底：${[...new Set(scene.canvasMaps)].join(',')}`);
    ok(scene.roughBad.length === 0, `roughness 未归 1（会双重衰减）：${[...new Set(scene.roughBad)].slice(0, 4).join(',')}`);
    ok(scene.colorBad.length === 0, `材质色未归白（会乘出偏色）：${[...new Set(scene.colorBad)].slice(0, 4).join(',')}`);
    ok(scene.rows.every((r) => r.nor), '有绑定材质的 normalMap 不是真实贴图');
    ok(scene.rows.every((r) => r.arm), '有绑定材质的 roughnessMap 不是真实贴图');
    /* ★ 这条是本轮修掉的洞：world.js::tileMat() 克隆了 base.map 却没登记绑定，
       导致同一 Source 的贴图不全在绑定表里 → dispose 的 usedTimes 归不了零
       → 显存不重分配 → texSubImage2D 尺寸不匹配。断言"克隆体确实在绑定表里"，
       就是把这个洞钉死在门禁上。 */
    ok(scene.boundClones > 0,
      '场景里没有任何**克隆体**材质带 texBind —— world.js::tileMat / kit.js::fitRepeat 的登记断了，'
      + '热替换只会换到原型，真正渲染的克隆体会停在程序化贴图上');

    if (VERBOSE) {
      console.log('\n逐材质读数：');
      for (const r of scene.rows.sort((a, b) => (a.as < b.as ? -1 : 1))) {
        console.log('  ' + r.as.padEnd(22) + (r.clone ? 'clone' : 'proto').padEnd(7)
          + r.kind.padEnd(7) + r.size.padEnd(11) + 'rep=' + JSON.stringify(r.rep).padEnd(16)
          + 'nor=' + (r.nor ? 'Y' : '-') + ' arm=' + (r.arm ? 'Y' : '-'));
      }
    }
  }

  /* ── L3 GPU 层 ─────────────────────────────────────────────────────── */
  /* ① GL 上传错误：尺寸不匹配（texStorage2D 只分配一次）会在这里留痕。 */
  ok(glErrors.length === 0, `GL 纹理上传报错 ${glErrors.length} 条：${glErrors.slice(0, 2).join(' | ')}`);

  /* ② 像素级 A/B：交替采样，让系统性漂移在两侧等价抵消。
        判据 = 信号 / 噪声地板。噪声地板取 ON 组偶数帧 vs 奇数帧
        （横跨整个采样窗口，含漂移），这样信噪比不会被漂移虚高。 */
  const dir = path.join(ROOT, '.tmp-probe');
  fs.mkdirSync(dir, { recursive: true });
  const N = 6;
  const onF = [], offF = [];
  for (let i = 0; i < N; i++) {
    await p.evaluate(() => window.Scene3D.setTextureEnabled(true));
    await p.waitForTimeout(150);
    const a = path.join(dir, 'vtl-on-' + i + '.png'); await p.screenshot({ path: a }); onF.push(a);
    await p.evaluate(() => window.Scene3D.setTextureEnabled(false));
    await p.waitForTimeout(150);
    const c = path.join(dir, 'vtl-off-' + i + '.png'); await p.screenshot({ path: c }); offF.push(c);
  }
  await p.evaluate(() => window.Scene3D.setTextureEnabled(true));

  /* 顺带断言 A/B 开关是**可逆**的：关掉必须退回程序化，再开必须回来。
     不可逆的话，"两张图一样"会被误读成"真实贴图没效果"。 */
  const ab = await p.evaluate(() => {
    const pick = () => {
      let r = null;
      window.__shell.view3d.scene.traverse((o) => {
        if (r || !o.isMesh || !o.material) return;
        const m = Array.isArray(o.material) ? o.material[0] : o.material;
        if (m.userData && m.userData.texBind && m.map && m.map.image) r = m.map.image.tagName;
      });
      return r;
    };
    const S3 = window.Scene3D;
    S3.setTextureEnabled(false); const off = pick();
    S3.setTextureEnabled(true); const on = pick();
    return { off, on, swappedAfter: S3.textureStats().swapped };
  });
  ok(ab.off === 'CANVAS', `关掉开关后贴图没退回程序化（读到 ${ab.off}）—— A/B 对照不可信`);
  ok(ab.on === 'IMG', `重新打开后贴图没回来（读到 ${ab.on}）`);
  ok(ab.swappedAfter > 0, '重开开关后 swapped 归零 —— 换图计数或还原逻辑有漏');

  const sharp = require('sharp');
  const load = async (f) => (await sharp(f).greyscale().raw().toBuffer({ resolveWithObject: true })).data;
  const avgOf = (arrs) => {
    const acc = new Array(arrs[0].length).fill(0);
    for (const a of arrs) for (let k = 0; k < a.length; k++) acc[k] += a[k];
    for (let k = 0; k < acc.length; k++) acc[k] /= arrs.length;
    return acc;
  };
  const diffAvg = (a, b) => {
    const n = Math.min(a.length, b.length);
    let s = 0;
    for (let i = 0; i < n; i++) s += Math.abs(a[i] - b[i]);
    return s / n;
  };
  const onPx = [], offPx = [];
  for (let i = 0; i < N; i++) { onPx.push(await load(onF[i])); offPx.push(await load(offF[i])); }
  const signal = diffAvg(avgOf(onPx), avgOf(offPx));
  const noise = diffAvg(avgOf(onPx.filter((_, i) => i % 2 === 0)), avgOf(onPx.filter((_, i) => i % 2 === 1)));
  const snr = signal / Math.max(noise, 0.001);
  console.log(`\nGPU 像素判定：信号=${signal.toFixed(2)}  噪声地板=${noise.toFixed(2)}  信噪比=${snr.toFixed(1)}×`);
  console.log('  （噪声来自人流车流，不是随机噪声 —— 所以判据看的是**信噪比**，不是绝对阈值）');
  ok(snr >= 2, `信噪比 ${snr.toFixed(1)}× < 2 —— 真实贴图可能只改了 JS 引用、没上 GPU`
    + `（three 的 texStorage2D 只在首帧分配，尺寸变化时若没触发重分配就会这样）`);

  await b.close();
  if (own) await closeServer();
  report();

  function report() {
    console.log('');
    for (const w of warns) console.log('  ⚠ ' + w);
    if (fails.length) {
      console.log(`❌ 真实贴图接入：${fails.length} 项不合格`);
      for (const f of fails) console.log('   · ' + f);
      process.exit(1);
    }
    console.log(`✅ 真实贴图接入：全部通过${warns.length ? `（${warns.length} 项警告）` : ''}`);
    process.exit(0);
  }
})().catch((e) => { console.error('脚本异常：', e); process.exit(2); });
