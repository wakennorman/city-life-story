#!/usr/bin/env node
/* ──────────────────────────────────────────────────────────────────────────────
   Poly Haven **PBR 贴图集**下载器（CC0 1.0 · 可商用 · 无需署名）

   与 fetch-polyhaven.cjs 的分工：
     · fetch-polyhaven.cjs → **模型**（.gltf/.glb）+ HDRI
     · 本脚本            → **贴图集**（diffuse + normal + arm 三件套）

   为什么要单独一个脚本，而不是往 fetch-polyhaven.cjs 的 textures 里加几条：
     那个脚本的 textures 段**故意只下 Diffuse**，注释写着
     「法线/粗糙度等我们有自己的程序化方案，混进来会两套打架」。
     ★ 这条假设对**程序化贴图**成立，对**真实照片扫描贴图**恰好相反：
       真实 diffuse 上的凹凸是照片里真实存在的，配一张"我们想象的"程序化法线
       才是真正的打架（法线的凹凸和颜色的凹凸对不上，光一打就露馅）。
       所以真实贴图必须**整套拿**：三张图出自同一次扫描，天然自洽。

   ★ 为什么用 `arm` 而不是分别下 Rough / AO / Metalness：
     arm = **A**O(R) + **R**oughness(G) + **M**etalness(B) 打包在一张图里。
     three.js 的 roughnessMap 读**绿**通道、metalnessMap 读**蓝**通道、
     aoMap 读**红**通道 —— 所以一张 arm.jpg 同时喂三个槽位，省 2 次下载。
     （三通道语义见 three.js 文档：roughnessMap=green / metalnessMap=blue / aoMap=red）

   ★ 真实世界尺寸随包写进清单：Poly Haven 的 info 接口给 `dimensions`（毫米），
     这是本项目「真实构件尺寸」纪律的直接输入 —— 贴图的 repeat 必须由它反推，
     不能拍脑袋。尺寸错了，砖在屏上的大小就错了，大脑立刻读不出那是砖。

   用法：
     node scripts/fetch-textures.cjs               # 下载缺失的
     node scripts/fetch-textures.cjs --list        # 只列清单
     node scripts/fetch-textures.cjs --force       # 全部重下
     node scripts/fetch-textures.cjs --only ground-concrete-worn
   产物：
     src/assets/polyhaven/textures/<as>/<as>_{diff,nor,arm}.jpg
     src/assets/polyhaven/textures-manifest.json
   ────────────────────────────────────────────────────────────────────────────── */
const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DEST_ROOT = path.join(ROOT, 'src/assets/polyhaven');
const MANIFEST_FILE = path.join(DEST_ROOT, 'textures-manifest.json');
const UA = { 'User-Agent': 'city-life-story/1.0 (texture fetcher)' };

/* ── 清单 ────────────────────────────────────────────────────────────────
   选型依据：对照《大多数》实机截图里出现的地面与墙面。
   命名 `as` 是**用途名**不是原 id —— 调用方（palette.js）读的是用途，
   换素材时只改这里，palette 不用动。

   ground = 地面类（world.js 按 4.5m 一格平铺）
   wall   = 立面类（kit.js 按 TILE_M=2.4m 一格平铺）
   ────────────────────────────────────────────────────────────────────── */
const SET = [
  // ── 地面 ──────────────────────────────────────────────────────────────
  { as: 'ground-concrete-worn', id: 'concrete_floor_worn_001', use: 'ground',
    note: '城中村地面：磨损脏水泥（tier1）' },
  { as: 'ground-concrete', id: 'concrete_floor_02', use: 'ground',
    note: '干净水泥地（tier2）' },
  { as: 'ground-slab', id: 'rectangular_paving', use: 'ground',
    note: '长方形水泥板铺装（庭院 / 人行道）' },
  { as: 'ground-stone-tile', id: 'precast_stone_paving', use: 'ground',
    note: '预制石材大板（tier3 广场）' },
  { as: 'road-asphalt', id: 'asphalt_04', use: 'ground',
    note: '沥青机动车道' },
  { as: 'walk-paver', id: 'brick_pavement_02', use: 'ground',
    note: '人行道铺装砖' },

  // ── 立面 ──────────────────────────────────────────────────────────────
  { as: 'wall-brick', id: 'brick_wall_001', use: 'wall',
    note: '红砖墙' },
  { as: 'wall-brick-2', id: 'brick_wall_005', use: 'wall',
    note: '红砖墙（另一款，轮换用）' },
  { as: 'wall-concrete', id: 'concrete_wall_008', use: 'wall',
    note: '水泥墙' },
  { as: 'wall-concrete-2', id: 'concrete_wall_003', use: 'wall',
    note: '水泥墙（另一款）' },
  { as: 'wall-tile', id: 'long_white_tiles', use: 'wall',
    note: '白瓷砖（城中村最标志性的外墙 —— 长条白釉面砖）' },
  { as: 'wall-tile-2', id: 'square_tiles_02', use: 'wall',
    note: '小方马赛克外墙（另一款瓷砖，轮换用）' },
  { as: 'wall-plaster', id: 'damaged_plaster', use: 'wall',
    note: '剥落抹灰露砖 —— 城中村 / 老城区最典型的破败墙面' },
  { as: 'wall-plaster-2', id: 'plaster_brick_01', use: 'wall',
    note: '抹灰砖墙（另一款）' },
  { as: 'wall-stone', id: 'marble_01', use: 'wall',
    note: '石材（tier3 高层）' },
];

/* 需要的贴图槽位 → Poly Haven 的键名。
   `nor_gl` 是 OpenGL 约定（绿通道朝上），three.js 用的就是这一套；
   `nor_dx` 是 DirectX 约定（绿通道朝下），拿错了凹凸方向会整个反过来
   —— 这个错误在平光下几乎看不出来，一打侧光就全反。 */
const SLOTS = [
  { key: 'diff', src: 'Diffuse', file: 'diff' },
  { key: 'nor', src: 'nor_gl', file: 'nor' },
  { key: 'arm', src: 'arm', file: 'arm' },
];

/* ── 网络与文件工具（与 fetch-polyhaven.cjs 同款，保持行为一致）───────── */

function httpsGet(url, { timeout = 60000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout, headers: UA }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        return httpsGet(res.headers.location, { timeout }).then(resolve, reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      resolve(res);
    });
    req.on('timeout', () => { req.destroy(new Error('timeout')); });
    req.on('error', reject);
  });
}

async function getJson(url) {
  const res = await httpsGet(url);
  const chunks = [];
  for await (const c of res) chunks.push(c);
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function download(url, dest) {
  const res = await httpsGet(url, { timeout: 180000 });
  const chunks = [];
  for await (const c of res) chunks.push(c);
  const buf = Buffer.concat(chunks);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, buf);
  return { bytes: buf.length, md5: crypto.createHash('md5').update(buf).digest('hex') };
}

/* 从 files 接口的嵌套结构里取 1k jpg 的 url。
   结构：<Map> → <分辨率> → <格式> → { url, size, md5 } */
function pickJpg(files, srcKey) {
  const m = files[srcKey];
  if (!m) return null;
  const atRes = m['1k'] || m['2k'] || m;
  const fmt = atRes.jpg || atRes.png;
  return fmt && fmt.url ? { url: fmt.url, size: fmt.size || 0 } : null;
}

/* ── 主流程 ───────────────────────────────────────────────────────────── */

(async () => {
  const args = process.argv.slice(2);
  const opts = {
    force: args.includes('--force'),
    list: args.includes('--list'),
    only: (() => { const i = args.indexOf('--only'); return i >= 0 ? args[i + 1] : null; })(),
  };

  const set = opts.only ? SET.filter((e) => e.as === opts.only) : SET;
  if (!set.length) {
    console.error(`--only ${opts.only} 不在清单里。可用：${SET.map((e) => e.as).join(', ')}`);
    process.exit(1);
  }

  if (opts.list) {
    console.log(`清单共 ${set.length} 项（每项 ${SLOTS.length} 张图）：`);
    set.forEach((e) => console.log(`  [${e.use}] ${e.as.padEnd(22)} ← ${e.id.padEnd(26)} ${e.note}`));
    return;
  }

  console.log('Poly Haven PBR 贴图集下载（CC0 1.0 · 可商用 · 无需署名）');
  console.log(`目标：${path.relative(ROOT, path.join(DEST_ROOT, 'textures'))}`);
  console.log(`共 ${set.length} 项 × ${SLOTS.length} 张${opts.force ? '（--force 重下）' : ''}\n`);

  const out = {
    source: 'Poly Haven',
    license: 'CC0 1.0 (Public Domain)',
    licenseUrl: 'https://polyhaven.com/license',
    commercialUse: true,
    attributionRequired: false,
    resolution: '1k',
    note: '真实照片扫描 PBR 贴图集。arm = AO(R)+Roughness(G)+Metalness(B)，'
      + 'three.js 的 roughnessMap 读绿通道 / metalnessMap 读蓝通道 / aoMap 读红通道。',
    dimensionsUnit: 'mm',
    fetchedAt: new Date().toISOString(),
    counts: { ok: 0, skip: 0, fail: 0, total: set.length },
    assets: [],
  };
  /* 断点续传：已有的清单先读进来，只重写本次涉及的那些 —— 这样
     `--only` 单跑一条不会把其他条目的记录抹掉。 */
  let prev = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    try {
      const old = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
      (old.assets || []).forEach((a) => { prev[a.as] = a; });
      out.assets = (old.assets || []).filter((a) => !set.some((e) => e.as === a.as));
    } catch { /* 清单坏了就整体重写 */ }
  }

  for (const entry of set) {
    const label = `${entry.use.padEnd(6)} ${entry.as.padEnd(22)}`;
    try {
      const [info, files] = await Promise.all([
        getJson(`https://api.polyhaven.com/info/${entry.id}`),
        getJson(`https://api.polyhaven.com/files/${entry.id}`),
      ]);
      const dim = Array.isArray(info.dimensions) && info.dimensions.length >= 2
        ? [Math.round(info.dimensions[0]), Math.round(info.dimensions[1])]
        : null;

      const rec = {
        as: entry.as, id: entry.id, use: entry.use, note: entry.note,
        dimensionsMM: dim,
        source: `https://polyhaven.com/a/${entry.id}`,
        files: {},
      };

      let allCached = true;
      for (const slot of SLOTS) {
        const pick = pickJpg(files, slot.src);
        if (!pick) { rec.files[slot.key] = { missing: true, srcKey: slot.src }; continue; }
        const rel = `textures/${entry.as}/${entry.as}_${slot.file}.jpg`;
        const dest = path.join(DEST_ROOT, rel);
        /* ★ 跳过条件不能只看"文件在不在"（第一版就是这样，踩了坑）：
             改了 entry.id 但沿用同一个 as 时，目标文件已存在 →
             静默保留**上一张素材**，画面上什么都不会变，也不报错。
             实测：把 ground-stone-tile 从 stone_tiles_02 换成
             precast_stone_paving，脚本报"已存在"，磁盘上还是旧那张。
             所以必须比对清单里记的 id：id 变了就当缓存失效。 */
        const idChanged = prev[entry.as] && prev[entry.as].id && prev[entry.as].id !== entry.id;
        if (fs.existsSync(dest) && !opts.force && !idChanged) {
          rec.files[slot.key] = {
            rel, bytes: fs.statSync(dest).size,
            md5: crypto.createHash('md5').update(fs.readFileSync(dest)).digest('hex'),
            url: pick.url, cached: true,
          };
        } else {
          allCached = false;
          const r = await download(pick.url, dest);
          rec.files[slot.key] = { rel, bytes: r.bytes, md5: r.md5, url: pick.url };
        }
      }

      out.assets.push(rec);
      if (allCached) { out.counts.skip++; console.log(`  ⏭  ${label} 已存在`); }
      else {
        out.counts.ok++;
        const kb = Object.values(rec.files).reduce((a, f) => a + (f.bytes || 0), 0) / 1024;
        console.log(`  ✅ ${label} ${dim ? dim.join('×') + 'mm' : '尺寸未知'} · ${kb.toFixed(0)}KB`);
      }
    } catch (e) {
      out.counts.fail++;
      out.assets.push({ as: entry.as, id: entry.id, use: entry.use, note: entry.note, error: e.message });
      console.log(`  ❌ ${label} ${e.message}`);
    }
  }

  out.assets.sort((a, b) => a.as.localeCompare(b.as));
  fs.mkdirSync(DEST_ROOT, { recursive: true });
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(out, null, 2) + '\n');

  const totalMB = out.assets.reduce((a, r) =>
    a + Object.values(r.files || {}).reduce((x, f) => x + (f.bytes || 0), 0), 0) / 1048576;
  console.log(`\n完成：${out.counts.ok} 新增 / ${out.counts.skip} 已存在 / ${out.counts.fail} 失败`);
  console.log(`清单：${path.relative(ROOT, MANIFEST_FILE)}（合计 ${totalMB.toFixed(1)}MB）`);
  if (out.counts.fail) process.exit(1);
})();
