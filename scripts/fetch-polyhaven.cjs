#!/usr/bin/env node
/**
 * 从 Poly Haven 下载 3D 资产（CC0，可商用、无需署名）。
 *
 * ── 为什么要写脚本而不是手动下载 ──────────────────────────────────────────
 *   1. **可复现**：dist/assets/ 不进版本库（8.5MB 二进制），任何人 clone 后
 *      跑一次本脚本就能拿到同一批资产。手动下载做不到这点。
 *   2. **可追溯**：写一份 manifest（来源 URL + md5 + 字节数 + 许可），
 *      以后审计"这个文件哪来的、什么许可"时有据可查。
 *   3. **增量**：已存在的文件跳过（除非 --force），改清单后重跑很快。
 *
 * ── 遵守 Poly Haven 的 ToS ────────────────────────────────────────────────
 *   官方服务条款**禁止 web scraping**（抓网页），但**公开 API 是明确允许的**。
 *   所以本脚本只用 api.polyhaven.com，不去爬 polyhaven.com 的页面。
 *
 * 用法：
 *   node scripts/fetch-polyhaven.cjs                # 下载清单里的全部
 *   node scripts/fetch-polyhaven.cjs --only hdri    # 只下 HDRI
 *   node scripts/fetch-polyhaven.cjs --only model   # 只下模型
 *   node scripts/fetch-polyhaven.cjs --force        # 重新下载
 *   node scripts/fetch-polyhaven.cjs --list         # 只打印清单，不下载
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const DEST_ROOT = path.join(ROOT, 'src', 'assets', 'polyhaven');

/* ══════════════════════════════════════════════════════════════════════════
   资产清单
   ══════════════════════════════════════════════════════════════════════════

   挑选原则（针对《城市浮生记》的城中村 / 工业区 / 商业街题材）：

   ── 模型：只要"城中村最缺的那几个标志性细节" ──
   Poly Haven 的模型库以家具/道具为主，建筑类只有 13 个 —— 但恰好撞上
   我们最缺的东西：卷帘门、防盗卷帘窗、消防梯、电线杆、铁丝网、消防栓。
   这些是"一看就知道是城中村/老城区"的元素，程序化几何很难做出质感。

   ── HDRI：挑与游戏时段照明对得上的 ──
   Poly Haven 偏欧洲写实风，与国内城中村不完全贴，但 HDRI 主要是
   **环境光照与反射**（不是内容主体），影响的是"光线的真实感"。
   按游戏的四个时段（上午/下午/傍晚/夜间）各挑一个。
   ★ 只下 1k：1k 约 1.6MB，够做环境光；8k 会到 50MB+，对网页游戏不值。
     真需要更清晰时改 RES 常量重跑即可。
   ────────────────────────────────────────────────────────────────────────── */

const HDRI_RES = '1k';

/* 模型分辨率。★ 别调大：8k 的单个模型贴图近百 MB（见 fetchModel 注释）。 */
const MODEL_RES = '1k';

const MANIFEST = {
  /* ── 城中村 / 老城区标志性细节 ─────────────────────────────────── */
  models: [
    // 卷帘门 —— 城中村一楼店铺、仓库的标配
    { id: 'rollershutter_door', as: 'rollershutter-door', note: '卷帘门（店铺/仓库）' },
    // 防盗卷帘窗 —— 城中村一楼的典型外观
    { id: 'rollershutter_window_01', as: 'rollershutter-window-1', note: '卷帘窗 1' },
    { id: 'rollershutter_window_02', as: 'rollershutter-window-2', note: '卷帘窗 2' },
    { id: 'rollershutter_window_03', as: 'rollershutter-window-3', note: '卷帘窗 3（仓库型）' },
    // 消防梯 —— 老城区外墙的强辨识元素
    { id: 'modular_fire_escape', as: 'fire-escape', note: '模块化消防梯' },
    // 电线杆 —— 城中村"电线乱拉"的载体（游戏里也有这个场景）
    { id: 'modular_electricity_poles', as: 'electricity-poles', note: '模块化电线杆' },
    // 铁丝网围栏 —— 工地、废品站、工业区
    { id: 'modular_chainlink_fence', as: 'chainlink-fence', note: '模块化铁丝网' },
    // 消防栓 —— 街道细节
    { id: 'fire_hydrant', as: 'fire-hydrant', note: '消防栓' },
    // 水泥路障 —— 工地、路口
    { id: 'concrete_road_barrier', as: 'road-barrier', note: '水泥路障' },
    { id: 'concrete_road_barrier_02', as: 'road-barrier-2', note: '水泥路障 2' },
    // 建筑立面（模块化，可拼装）
    { id: 'modular_urban_apartments_facade', as: 'apartments-facade', note: '城市公寓立面' },
    { id: 'modular_factory_facade', as: 'factory-facade', note: '工厂立面' },
    { id: 'modular_metal_gutter', as: 'metal-gutter', note: '金属落水管' },
  ],

  /* ── HDRI：按游戏四个时段各挑一个 ───────────────────────────────── */
  hdris: [
    { id: 'bloem_train_track_cloudy', as: 'day-cloudy', note: '上午·多云' },
    { id: 'kloppenheim_06_puresky', as: 'day-clearsky', note: '下午·晴' },
    { id: 'venice_sunset', as: 'dusk', note: '傍晚·暖' },
    { id: 'dikhololo_night', as: 'night', note: '夜间' },
  ],

  /* ── 贴图：城中村外墙/地面的真实质感 ─────────────────────────────── */
  textures: [
    { id: 'concrete_wall_008', as: 'concrete-wall', note: '水泥墙' },
    { id: 'brick_wall_001', as: 'brick-wall', note: '砖墙' },
    // ★ `paving_stones_02` 实测 404（Poly Haven 的 API 里没有这个 id）。
    //   换用磨损水泥地 —— 城中村地面本来就是水泥/水磨石，比"欧式铺装石"更贴。
    { id: 'concrete_floor_worn_001', as: 'paving', note: '磨损水泥地（原 paving_stones_02 已 404）' },
  ],
};

/* ── 网络与文件工具 ───────────────────────────────────────────────────── */

function httpsGet(url, { timeout = 60000 } = {}) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout }, (res) => {
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

/* ── 各类资产的下载逻辑 ───────────────────────────────────────────────── */

/**
 * 模型：取 gltf 1k **全套**（主文件 + .bin + 贴图）。
 *
 * ══ 为什么必须下全套，不能只下主文件 ══════════════════════════════════════
 * Poly Haven 的 `gltf` 是**分离式** glTF（Khronos Blender I/O 导出）：
 *   主 .gltf 是 JSON，里面用**相对路径**引用
 *     · `fire_hydrant.bin`            ← 几何数据（1.9MB）
 *     · `textures/fire_hydrant_diff_1k.jpg`  ← 贴图
 * 只下主文件 = 一个 5KB 的 JSON + 一堆 404 的引用 —— 模型根本加载不出来。
 * 我第一次就是这么下的（20 个文件看起来都"成功"，其实是残废的）。
 *
 * ══ 为什么是 1k ════════════════════════════════════════════════════════════
 * 实测 8k 的代价：单个消防栓的 diffuse 贴图就 **27MB**，六张贴图近百 MB。
 * 一个网页游戏放十几个这样的模型 = 几百 MB。1k 全套才 5.2MB，视觉上
 * 在 RTS/俯视视角下与 8k 几乎无差别（视角远，看不到贴图细节）。
 *
 * ══ 为什么按 API 给的 include 清单下，而不是拼 URL ════════════════════════
 * `gltf.1k.gltf.include` 是**权威清单**：{ 相对路径 → {url, size, md5} }。
 * 拼 URL 有两个坑：
 *   1. `.bin` 的 URL 指向 **8k 目录**（它是分辨率无关的，Poly Haven 只存一份）——
 *      按"1k 目录"去拼会 404。
 *   2. 各模型的贴图命名不统一（`_diff_1k` / `_diff` / `_nor_gl_1k`…）。
 * 用 include 就不会错。
 *
 * ══ 为什么保持目录结构 ═════════════════════════════════════════════════════
 * 主 gltf 里写的是 `textures/xxx.jpg` 这种相对路径。若把贴图平铺到同一层，
 * 路径就对不上了 —— 而这个错误**在浏览器里表现为模型静默不显示**，
 * 不报错、不 404（因为根本没请求），是最难查的一类。
 * 所以：<as>/<原名>.gltf + <as>/<原名>.bin + <as>/textures/<原名>.jpg
 */
async function fetchModel(entry, opts) {
  const info = await getJson(`https://api.polyhaven.com/files/${entry.id}`);
  const res = info.gltf && info.gltf[MODEL_RES];
  if (!res || !res.gltf) return { skip: `无 gltf ${MODEL_RES}` };

  const main = res.gltf;                       // { url, size, md5, include }
  const dir = path.join(DEST_ROOT, 'models', entry.as);
  const mainDest = path.join(dir, path.basename(new URL(main.url).pathname));

  if (fs.existsSync(mainDest) && !opts.force) return { skip: '已存在', dest: mainDest };

  /* 1) 主 gltf */
  const r = await download(main.url, mainDest);

  /* 2) include 清单里的全部附属文件（.bin + 贴图），**按相对路径落盘** */
  const inc = main.include || {};
  let extraBytes = 0, extraCount = 0;
  for (const [rel, meta] of Object.entries(inc)) {
    const d = path.join(dir, rel);            // rel 可能含 "textures/" 前缀
    /* bin 是共享的（不同分辨率指向同一个文件），已存在就跳过 */
    if (fs.existsSync(d) && !opts.force) continue;
    const rr = await download(meta.url, d);
    extraBytes += rr.bytes;
    extraCount++;
  }

  return {
    ...r,
    bytes: r.bytes + extraBytes,
    dest: mainDest,
    url: main.url,
    gltfMainBytes: r.bytes,
    includeCount: extraCount,
    includeTotal: Object.keys(inc).length,
  };
}

/**
 * HDRI：取 .hdr（Radiance RGBE）。
 * ★ 为什么不是 .exr：.hdr 体积小得多（1k 约 1.6MB vs exr 5.9MB），
 *   而 Three.js 的 RGBELoader 原生读 .hdr，够用。
 */
async function fetchHdri(entry, opts) {
  const info = await getJson(`https://api.polyhaven.com/files/${entry.id}`);
  const res = info.hdri && info.hdri[HDRI_RES];
  if (!res || !res.hdr) return { skip: `无 ${HDRI_RES} hdr` };
  const dest = path.join(DEST_ROOT, 'hdri', entry.as + '.hdr');
  if (fs.existsSync(dest) && !opts.force) return { skip: '已存在', dest };
  const r = await download(res.hdr.url, dest);
  return { ...r, dest, url: res.hdr.url };
}

/**
 * 贴图：只要 diffuse（Color）的 1k jpg。
 * ★ 只要 base color：法线/粗糙度等我们有自己的程序化方案
 *   （见 materials.js 的 P1-1），混进来会两套打架。
 */
async function fetchTexture(entry, opts) {
  const info = await getJson(`https://api.polyhaven.com/files/${entry.id}`);
  const diffuse = info.Diffuse || info.diffuse;
  if (!diffuse) return { skip: '无 Diffuse 贴图' };

  const dest = path.join(DEST_ROOT, 'textures', entry.as + '.jpg');
  if (fs.existsSync(dest) && !opts.force) return { skip: '已存在', dest };

  /* 结构：Diffuse → { "1k": { jpg: {url} } } */
  const res = diffuse['1k'] || diffuse;
  const fmt = res.jpg || res.png;
  if (!fmt || !fmt.url) return { skip: '1k 里无 jpg/png' };
  const r = await download(fmt.url, dest);
  return { ...r, dest, url: fmt.url };
}

/* ── 主流程 ───────────────────────────────────────────────────────────── */

(async () => {
  const args = process.argv.slice(2);
  const opts = {
    force: args.includes('--force'),
    list: args.includes('--list'),
    only: (() => { const i = args.indexOf('--only'); return i >= 0 ? args[i + 1] : null; })(),
  };

  const jobs = [];
  if (!opts.only || opts.only === 'model') MANIFEST.models.forEach((e) => jobs.push({ kind: 'model', entry: e, fn: fetchModel }));
  if (!opts.only || opts.only === 'hdri') MANIFEST.hdris.forEach((e) => jobs.push({ kind: 'hdri', entry: e, fn: fetchHdri }));
  if (!opts.only || opts.only === 'texture') MANIFEST.textures.forEach((e) => jobs.push({ kind: 'texture', entry: e, fn: fetchTexture }));

  if (opts.list) {
    console.log(`清单共 ${jobs.length} 项：`);
    jobs.forEach((j) => console.log(`  [${j.kind}] ${j.entry.id} → ${j.entry.as}  (${j.entry.note})`));
    return;
  }

  console.log(`Poly Haven 资产下载（CC0 1.0 · 可商用 · 无需署名）`);
  console.log(`目标目录：${path.relative(ROOT, DEST_ROOT)}`);
  console.log(`共 ${jobs.length} 项${opts.force ? '（--force 重新下载）' : ''}\n`);

  const report = [];
  let ok = 0, skip = 0, fail = 0;

  for (const job of jobs) {
    const label = `${job.kind.padEnd(7)} ${job.entry.as.padEnd(24)}`;
    try {
      const r = await job.fn(job.entry, opts);
      if (r.skip) { skip++; console.log(`  ⏭  ${label} ${r.skip}`); }
      else {
        ok++;
        const kb = (r.bytes / 1024).toFixed(0);
        console.log(`  ✅ ${label} ${kb.padStart(6)} KB  ${r.md5 ? r.md5.slice(0, 8) : ''}`);
      }
      report.push({ kind: job.kind, id: job.entry.id, as: job.entry.as, note: job.entry.note, ...r });
    } catch (e) {
      fail++;
      console.log(`  ❌ ${label} ${String(e.message || e).slice(0, 90)}`);
      report.push({ kind: job.kind, id: job.entry.id, as: job.entry.as, error: String(e.message || e) });
    }
  }

  /* 写 manifest —— 可追溯性的关键：每个文件记下来源 URL、md5、许可。
     以后有人问"这个资产哪来的、能商用吗"，看这份文件即可。 */
  const manifestPath = path.join(DEST_ROOT, 'manifest.json');
  fs.mkdirSync(DEST_ROOT, { recursive: true });
  fs.writeFileSync(manifestPath, JSON.stringify({
    source: 'Poly Haven',
    license: 'CC0 1.0 (Public Domain)',
    licenseUrl: 'https://polyhaven.com/license',
    commercialUse: true,
    attributionRequired: false,
    fetchedAt: new Date().toISOString(),
    hdriResolution: HDRI_RES,
    counts: { ok, skip, fail, total: jobs.length },
    assets: report,
  }, null, 2) + '\n');

  console.log(`\n完成：成功 ${ok} · 跳过 ${skip} · 失败 ${fail}`);
  console.log(`清单已写入 ${path.relative(ROOT, manifestPath)}`);
  if (fail) process.exit(1);
})();
