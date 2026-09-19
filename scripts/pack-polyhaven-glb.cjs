#!/usr/bin/env node
/**
 * 把 Poly Haven 的**分离式 glTF** 打包成**单文件 GLB**。
 *
 * ══ 为什么要做这一步（这不是优化，是修 bug）════════════════════════════════
 *
 * Poly Haven 导出的 glTF 是分离式的：
 *   xxx_1k.gltf     (JSON，引用下面两个)
 *   xxx.bin         (几何数据)
 *   textures/*.jpg  (贴图)
 *
 * 主 .gltf 用**相对路径**引用它们。这在浏览器里会踩一个大坑：
 *
 *   ★ `.bin` 的 MIME 是 `application/octet-stream` 时，
 *     **下载管理器会把它抢走**（IDM / 迅雷 / FDM 都这样）。
 *     实测（装了 IDM 的机器）：
 *       fetch('/.../fire_hydrant.bin') → { status: 204, bytes: 0 }
 *     而且**请求根本不到服务器** —— 浏览器把响应当成"要下载的文件"
 *     交给了外部程序，页面拿到一个空的 204。
 *     GLTFLoader 于是报 `Failed to load buffer "xxx.bin"`，模型静默消失。
 *
 *   这不是"某个人的环境问题"：任何装了下载管理器的玩家都会中招，
 *   而且症状是"模型不见了但不报错"，极难排查。
 *
 * ══ 为什么 GLB 能解决 ══════════════════════════════════════════════════════
 *   GLB 是单文件容器：JSON + BIN + 贴图全部内嵌在一个 buffer 里。
 *     · 不再有外部引用 → 没有相对路径问题
 *     · MIME 是 `model/gltf-binary` → 不在下载管理器的接管名单里
 *     · 每模型从 7 个请求降到 1 个
 *     · 体积不变（贴图还是会带上，但省掉 HTTP 开销）
 *
 * ══ 做法 ═══════════════════════════════════════════════════════════════════
 *   用 three 的 GLTFLoader 读入（它会自己解析 .bin 与 textures/），
 *   再用 GLTFExporter 导出成 GLB（binary: true，贴图内嵌）。
 *
 *   为什么不用 npm 的 gltf-pipeline：
 *     多一个依赖，且它只做压缩不解决内嵌（还得配 Draco）。
 *     我们已经有 three，GLTFLoader + GLTFExporter 是同一套类型系统，
 *     不会出现"导出后 three 读不回来"的兼容问题。
 *
 * 用法：
 *   node scripts/pack-polyhaven-glb.cjs            # 打包全部
 *   node scripts/pack-polyhaven-glb.cjs --force    # 重打
 *   node scripts/pack-polyhaven-glb.cjs --verify   # 只校验已有 glb 完好
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const MODELS = path.join(ROOT, 'src', 'assets', 'polyhaven', 'models');

/* ── 为什么要在 Node 里"假装"一个浏览器 ────────────────────────────────────
   three 的 GLTFLoader/GLTFExporter 依赖少数 DOM API：
     · ImageBitmap / createImageBitmap  → 贴图解码（但我们要的是**原样内嵌**，不是解码）
     · Blob / FileReader                → 二进制转换
     · document.createElement('canvas') → 贴图重编码
   ★ 关键决定：**不让它重编码贴图**。
     GLTFExporter 对 ImageBitmap 会走 canvas 重编码（JPEG→PNG，体积暴涨）。
     我们已经在源文件里有 jpg 了，直接用它们更好。
     所以这里用 GLTFLoader 时**只读几何**（跳过贴图解码），
     再用一个更底层的方式组装 GLB：自己拼 JSON chunk + BIN chunk。
   ───────────────────────────────────────────────────────────────────────── */

/** 读一个 glTF 目录，返回 { json, bin, textures } —— 全部原始字节，不解码。 */
function readRaw(dir) {
  const gltfFile = fs.readdirSync(dir).find((f) => f.endsWith('.gltf'));
  if (!gltfFile) return null;
  const json = JSON.parse(fs.readFileSync(path.join(dir, gltfFile), 'utf8'));

  const baseDir = dir;
  const bin = json.buffers && json.buffers[0] && json.buffers[0].uri
    ? fs.readFileSync(path.join(baseDir, json.buffers[0].uri))
    : null;

  const images = (json.images || []).map((im) => {
    if (!im.uri) return null;
    return { uri: im.uri, bytes: fs.readFileSync(path.join(baseDir, im.uri)), mime: im.mimeType || 'image/jpeg' };
  });

  return { gltfFile, json, bin, images };
}

/**
 * 组装 GLB。
 *
 * GLB 格式（Khronos 规范）：
 *   header  : magic('glTF') + version(2) + totalLength      —— 12 字节
 *   chunk 0 : JSON  —— length + type('JSON') + data（4 字节对齐，空格补齐）
 *   chunk 1 : BIN   —— length + type('BIN\0') + data（4 字节对齐，\0 补齐）
 *
 * ★ 对齐不是可选的：规范要求 chunk 按 4 字节对齐，
 *   不补齐的话 three/其它解析器会读到错位的数据（且**不一定报错**，
 *   可能只是渲染出乱掉的几何）。这是手写 GLB 最常见的坑。
 */
function buildGlb(json, binBuf) {
  /* 1) 把外部引用改写成内嵌引用：
        · buffers[0].uri 删掉 → 指向 BIN chunk（GLB 里无 uri 即表示用 chunk 0）
        · images[i].uri 删掉 → 改写成 bufferView（把每张贴图塞进 BIN chunk） */
  const jsonOut = JSON.parse(JSON.stringify(json));

  const binParts = [];
  let offset = 0;
  const pushBin = (buf) => {
    const off = offset;
    binParts.push(buf);
    offset += buf.length;
    /* 内部也补齐到 4 字节，保证后续 bufferView 偏移合法 */
    const pad = (4 - (buf.length % 4)) % 4;
    if (pad) { binParts.push(Buffer.alloc(pad)); offset += pad; }
    return { off, len: buf.length };
  };

  /* 几何 BIN 放最前 */
  const geoRef = binBuf ? pushBin(binBuf) : null;

  if (jsonOut.buffers && jsonOut.buffers[0]) {
    delete jsonOut.buffers[0].uri;           // ← 关键：无 uri = 使用 GLB 的 BIN chunk
    jsonOut.buffers[0].byteLength = geoRef ? geoRef.len : 0;
  }

  /* 贴图：追加到 BIN 尾部，并把 images[].uri 换成 bufferView */
  jsonOut.bufferViews = jsonOut.bufferViews || [];
  (jsonOut.images || []).forEach((im, i) => {
    const src = json.images[i];
    if (!src || !src.uri) return;            // 已经是 bufferView，不动
    const buf = fs.readFileSync(path.join(galleryDir, src.uri));
    const ref = pushBin(buf);
    const bvIndex = jsonOut.bufferViews.length;
    jsonOut.bufferViews.push({ buffer: 0, byteOffset: ref.off, byteLength: ref.len });
    delete im.uri;
    im.bufferView = bvIndex;
    im.mimeType = src.mimeType || 'image/jpeg';
  });

  const binAll = Buffer.concat(binParts);

  /* 2) JSON chunk */
  let jsonStr = JSON.stringify(jsonOut);
  let jsonBuf = Buffer.from(jsonStr, 'utf8');
  const jsonPad = (4 - (jsonBuf.length % 4)) % 4;
  if (jsonPad) jsonBuf = Buffer.concat([jsonBuf, Buffer.from(' '.repeat(jsonPad))]);

  /* 3) BIN chunk 补齐 */
  let binPadded = binAll;
  const binPad = (4 - (binAll.length % 4)) % 4;
  if (binPad) binPadded = Buffer.concat([binAll, Buffer.alloc(binPad)]);

  /* 4) 拼头 */
  const total = 12 + 8 + jsonBuf.length + 8 + binPadded.length;
  const header = Buffer.alloc(12);
  header.write('glTF', 0, 'ascii');
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(total, 8);

  const jsonChunkHead = Buffer.alloc(8);
  jsonChunkHead.writeUInt32LE(jsonBuf.length, 0);
  jsonChunkHead.write('JSON', 4, 'ascii');

  const binChunkHead = Buffer.alloc(8);
  binChunkHead.writeUInt32LE(binPadded.length, 0);
  binChunkHead.write('BIN\0', 4, 'ascii');

  return Buffer.concat([header, jsonChunkHead, jsonBuf, binChunkHead, binPadded]);
}

let galleryDir = null;

function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const verifyOnly = args.includes('--verify');

  if (!fs.existsSync(MODELS)) {
    console.error('❌ 找不到', path.relative(ROOT, MODELS));
    process.exit(1);
  }

  const dirs = fs.readdirSync(MODELS).filter((d) => fs.statSync(path.join(MODELS, d)).isDirectory());
  let ok = 0, skip = 0, fail = 0;

  for (const d of dirs) {
    const dir = path.join(MODELS, d);
    galleryDir = dir;
    const glbPath = path.join(dir, d + '.glb');

    if (fs.existsSync(glbPath) && !force) {
      if (verifyOnly) {
        const buf = fs.readFileSync(glbPath);
        const magic = buf.slice(0, 4).toString('ascii');
        const ver = buf.readUInt32LE(4);
        const len = buf.readUInt32LE(8);
        if (magic === 'glTF' && ver === 2 && len === buf.length) { ok++; console.log(`  ✅ ${d}  GLB 完好 (${(buf.length / 1024 / 1024).toFixed(1)} MB)`); }
        else { fail++; console.log(`  ❌ ${d}  GLB 损坏`); }
      } else { skip++; console.log(`  ⏭  ${d}  已存在`); }
      continue;
    }

    try {
      const raw = readRaw(dir);
      if (!raw) { fail++; console.log(`  ❌ ${d}  无 .gltf`); continue; }
      if (!raw.bin) { fail++; console.log(`  ❌ ${d}  无 .bin（几何缺失）`); continue; }

      const glb = buildGlb(raw.json, raw.bin);
      fs.writeFileSync(glbPath, glb);

      /* 自检：读回来确认头正确 */
      const back = fs.readFileSync(glbPath);
      const magic = back.slice(0, 4).toString('ascii');
      const len = back.readUInt32LE(8);
      const good = magic === 'glTF' && len === back.length;
      if (!good) { fail++; console.log(`  ❌ ${d}  打包后自检失败`); continue; }

      ok++;
      const kb = (back.length / 1024).toFixed(0);
      console.log(`  ✅ ${d.padEnd(22)} ${kb.padStart(7)} KB  (贴图 ${raw.images.length} 张已内嵌)`);
    } catch (e) {
      fail++;
      console.log(`  ❌ ${d}  ${String(e.message || e).slice(0, 90)}`);
    }
  }

  console.log(`\n完成：成功 ${ok} · 跳过 ${skip} · 失败 ${fail}`);
  if (fail) process.exit(1);
}

main();
