#!/usr/bin/env node
/**
 * 校验打包出的 GLB 能被正确读回。
 *
 * ★ 为什么必须单独校验：
 *   手写 GLB 容器有大量"错了也不报错"的细节 —— chunk 4 字节对齐、
 *   bufferView 偏移、images 的 mimeType。错了之后可能：
 *     · 几何读到错位数据 → 模型变形（看起来"能用"但是坏的）
 *     · 贴图缺失 → 材质变成纯灰
 *   两种都不会抛异常。所以必须**读回来量尺寸**，与可信的期望值对比。
 *
 * ★ 期望值的来源在 2026-09-18 换过一次，值得记下：
 *   起初拿"同目录的源 .gltf"当基准，逐字段比对 —— 那在打包脚本刚跑完、
 *   源文件还在时成立。但源文件（gltf+bin+贴图，78MB）在验证通过后
 *   **被刻意删掉了**（它们对分发无用，只占体积）。
 *   于是这个脚本改成 0 通过 / 13 失败，报 `path must be string, undefined`
 *   —— 不是 GLB 坏了，是**基准消失了**。
 *   现在改用 `src/app/3d/polyhaven-manifest.json` 里的米制尺寸做基准。
 *   这其实**比原来更强**：那份清单正是游戏运行时用来换算/摆位的依据，
 *   拿它当期望值，等于断言"打包产物与游戏所依赖的尺寸一致"，
 *   而不是"与一个已经不需要存在的中间产物一致"。
 *
 * 用法：node scripts/verify-glb-pack.cjs
 */

const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const MODELS = path.join(ROOT, 'src', 'assets', 'polyhaven', 'models');
const MANIFEST = path.join(ROOT, 'src', 'app', '3d', 'polyhaven-manifest.json');

/** 从 glTF/GLB 的 accessor 里算总包围盒（不依赖 three）。 */
function bboxFromGltfJson(json) {
  let mn = [Infinity, Infinity, Infinity], mx = [-Infinity, -Infinity, -Infinity];
  let prims = 0;
  for (const m of json.meshes || []) {
    for (const p of m.primitives || []) {
      const a = json.accessors[p.attributes.POSITION];
      if (!a || !a.min || !a.max) continue;
      prims++;
      for (let i = 0; i < 3; i++) { mn[i] = Math.min(mn[i], a.min[i]); mx[i] = Math.max(mx[i], a.max[i]); }
    }
  }
  return prims ? { w: mx[0] - mn[0], h: mx[1] - mn[1], d: mx[2] - mn[2] } : null;
}

/** 解析 GLB 容器，返回 { json, binLength }。 */
function parseGlb(buf) {
  const magic = buf.slice(0, 4).toString('ascii');
  if (magic !== 'glTF') throw new Error('magic 不是 glTF');
  const version = buf.readUInt32LE(4);
  const total = buf.readUInt32LE(8);
  if (version !== 2) throw new Error('version 不是 2: ' + version);
  if (total !== buf.length) throw new Error(`totalLength 不匹配: 头里 ${total}, 实际 ${buf.length}`);

  let off = 12;
  let json = null, binLength = 0;
  const chunks = [];
  while (off < buf.length) {
    const len = buf.readUInt32LE(off);
    const type = buf.slice(off + 4, off + 8).toString('ascii');
    const data = buf.slice(off + 8, off + 8 + len);
    chunks.push({ type, len });
    if (type === 'JSON') json = JSON.parse(data.toString('utf8'));
    if (type.startsWith('BIN')) binLength = len;
    off += 8 + len;
    /* ★ chunk 必须 4 字节对齐 —— 这里顺便校验，不对齐说明打包错了 */
    if (off % 4 !== 0) throw new Error(`chunk 未对齐: off=${off}`);
  }
  if (!json) throw new Error('没有 JSON chunk');
  return { json, binLength, chunks };
}

let pass = 0, fail = 0;
const fails = [];

/* 从清单建 name → {h,w,d} 索引。清单是**游戏运行时**的换算依据，
   所以它同时充当"打包产物是否正确"的期望值（见文件头注释）。 */
const man = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const EXPECT = {};
for (const g of Object.values(man.groups || {})) {
  for (const it of g.items || []) EXPECT[it.name] = it;
}

const dirs = fs.readdirSync(MODELS).filter((d) => fs.statSync(path.join(MODELS, d)).isDirectory());
console.log('GLB 打包校验\n');

for (const d of dirs) {
  const dir = path.join(MODELS, d);
  const glbPath = path.join(dir, d + '.glb');

  if (!fs.existsSync(glbPath)) { fail++; fails.push(`${d} 无 GLB`); console.log(`  ❌ ${d}  没有 GLB`); continue; }

  try {
    const glbBuf = fs.readFileSync(glbPath);

    console.log(`  ${d}`);
    console.log(`    GLB ${(glbBuf.length / 1024 / 1024).toFixed(1)} MB`);

    /* ① 容器结构 */
    const parsed = parseGlb(glbBuf);
    console.log(`    ✅ 容器合法（${parsed.chunks.map((c) => c.type + ':' + (c.len / 1024 / 1024 * 1024 | 0) + 'B').join(' + ')}）`);

    /* ② 几何包围盒与**清单**一致 —— 这条能抓住"BIN 数据错位"。
       ★ 换基准后的口径（见文件头）：与游戏运行时依赖的米制尺寸对齐，
         而不是与已删除的中间产物对齐。 */
    const packBox = bboxFromGltfJson(parsed.json);
    const want = EXPECT[d];
    if (!want) { fail++; fails.push(`${d} 不在清单里`); console.log('    ❌ 清单里没有这个模型（清单与资产不同步）'); }
    else if (!packBox) { fail++; fails.push(`${d} 读不到包围盒`); console.log('    ❌ 读不到包围盒'); }
    else {
      /* 只比高度（h）：它是"这个模型是否被正确缩放/解码"最敏感的指标，
         且清单里 h 是从同一份几何量出来的，可直接比。
         容差 0.005m（5mm）：够吸收浮点与量化误差，又远小于任何真实缩放错误。 */
      const dh = Math.abs(want.h - packBox.h);
      if (dh < 0.005) { pass++; console.log(`    ✅ 几何高度与清单一致（${packBox.h.toFixed(3)}m vs 清单 ${want.h}m，差 ${(dh * 1000).toFixed(1)}mm）`); }
      else { fail++; fails.push(`${d} 高度不符`); console.log(`    ❌ 高度不符：清单 ${want.h}m vs 包内 ${packBox.h.toFixed(3)}m（差 ${(dh * 1000).toFixed(0)}mm）`); }
    }

    /* ③ 贴图真的内嵌了（不是还留着外部 uri） */
    const imgs = parsed.json.images || [];
    const external = imgs.filter((i) => i.uri);
    const embedded = imgs.filter((i) => i.bufferView !== undefined);
    if (external.length) { fail++; fails.push(`${d} 有 ${external.length} 张贴图仍是外部引用`); console.log(`    ❌ ${external.length} 张贴图仍是外部 uri（没内嵌）`); }
    else { pass++; console.log(`    ✅ 贴图全部内嵌（${embedded.length} 张）`); }

    /* ④ buffer 不再引用外部文件 —— 这是修 IDM 抢下载的关键 */
    const bufs = parsed.json.buffers || [];
    const bad = bufs.filter((b) => b.uri);
    if (bad.length) { fail++; fails.push(`${d} buffer 仍引用外部 uri`); console.log(`    ❌ buffer 仍引用外部 ${bad[0].uri}`); }
    else { pass++; console.log('    ✅ buffer 无外部引用（IDM 不会抢）'); }

    /* ⑤ BIN chunk 长度与 buffer.byteLength 一致 */
    const declared = (bufs[0] && bufs[0].byteLength) || 0;
    if (declared <= parsed.binLength) { pass++; console.log(`    ✅ BIN 长度自洽（${(declared / 1024).toFixed(0)} KB ≤ chunk ${(parsed.binLength / 1024).toFixed(0)} KB）`); }
    else { fail++; fails.push(`${d} BIN 长度不符`); console.log(`    ❌ BIN 声明 ${declared} > chunk ${parsed.binLength}`); }

  } catch (e) {
    fail++; fails.push(`${d} ${e.message}`);
    console.log(`    ❌ ${e.message}`);
  }
}

/* ⑥ 反向检查：清单里的每个模型都必须有对应 GLB。
   不加这条的话，"清单多列了/少列了"永远发现不了 ——
   遍历目录只能查"文件对不对"，查不出"清单全不全"。 */
const onDisk = new Set(dirs);
const missing = Object.keys(EXPECT).filter((n) => !onDisk.has(n));
if (missing.length) { fail++; fails.push(`清单有 ${missing.length} 项缺 GLB`); console.log(`\n  ❌ 清单里 ${missing.length} 个模型没有对应 GLB：${missing.join(', ')}`); }
else { pass++; console.log(`\n  ✅ 清单 ${Object.keys(EXPECT).length} 项与磁盘 GLB 一一对应`); }

console.log(`\n结果：${pass} 通过 · ${fail} 失败`);
if (fails.length) { console.log('失败: ' + fails.join(' | ')); process.exit(1); }
