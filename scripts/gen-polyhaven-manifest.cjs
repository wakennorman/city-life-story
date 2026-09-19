#!/usr/bin/env node
/**
 * 生成 Poly Haven 的游戏侧清单（src/app/3d/polyhaven-manifest.json）。
 *
 * ── 为什么需要这一步（不能直接用下载脚本写的 manifest.json）──────────────
 *   `src/assets/polyhaven/manifest.json` 是**下载台账**：记的是来源 URL、md5、
 *   字节数 —— 面向"可追溯性/审计"。它的结构是按下载顺序的扁平数组。
 *
 *   游戏要的是**按用途分组**的清单：哪些是"城中村细节"、哪些是"建筑立面"、
 *   每个模型的**实测尺寸**是多少。而且要能被 esbuild 内联（体积小、无冗余）。
 *
 *   所以本脚本做一次"台账 → 游戏清单"的转换，顺便：
 *     ① 读每个 gltf 的 POSITION accessor，算出**实测米制尺寸**（w/h/d）
 *     ② 按 note 里的语义分组（detail / facade / road）
 *     ③ 剔掉下载台账里的 URL/md5（游戏运行时用不上，白占体积）
 *
 * ── 为什么要实测尺寸而不是手写 ────────────────────────────────────────────
 *   尺寸是**断言的基础**：验证脚本要靠它检出"模型被放大 8 倍"这类错误。
 *   手写的数字会随模型更新而失效；实测的永远对得上当前文件。
 *
 * 用法：
 *   node scripts/gen-polyhaven-manifest.cjs          # 生成
 *   node scripts/gen-polyhaven-manifest.cjs --check  # 只校验，不写（CI 用）
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const POLY_ROOT = path.join(ROOT, 'src', 'assets', 'polyhaven');
const OUT = path.join(ROOT, 'src', 'app', '3d', 'polyhaven-manifest.json');

/* ══════════════════════════════════════════════════════════════════════════
   分组规则
   ══════════════════════════════════════════════════════════════════════════

   ★ 为什么按"用途"分而不是照抄 Poly Haven 的 categories：
     Poly Haven 的分类是"素材库视角"（buildings / structures / props），
     我们要的是"游戏视角"—— 这个东西放在场景里的**角色**是什么。
     比如卷帘门在素材库里是 buildings，在游戏里是"店铺门面细节"。
   ────────────────────────────────────────────────────────────────────────── */

const GROUPS = [
  {
    key: 'detail',
    note: '城中村 / 老城区标志性细节（贴在建筑上或摆在街边）',
    match: [
      /rollershutter-door/,
      /rollershutter-window/,
      /fire-hydrant/,
      /metal-gutter/,
    ],
  },
  {
    key: 'structure',
    note: '结构件（可攀附建筑、也可独立摆放）',
    match: [
      /fire-escape/,
      /electricity-poles/,
      /chainlink-fence/,
    ],
  },
  {
    key: 'road',
    note: '道路 / 工地设施',
    match: [
      /road-barrier/,
    ],
  },
  {
    key: 'facade',
    note: '模块化建筑立面（可拼装成楼体）',
    match: [
      /apartments-facade/,
      /factory-facade/,
    ],
  },
];

/** 读 glTF 或 GLB 的 POSITION accessor min/max，算实测包围盒（单位 = 米）。 */
function measureGltf(filePath) {
  const buf = fs.readFileSync(filePath);
  let j;
  if (buf.slice(0, 4).toString('ascii') === 'glTF') {
    /* GLB 容器：JSON 在第 0 个 chunk（12 字节头 + 8 字节 chunk 头之后） */
    const jsonLen = buf.readUInt32LE(12);
    j = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
  } else {
    j = JSON.parse(buf.toString('utf8'));
  }

  let mn = [Infinity, Infinity, Infinity];
  let mx = [-Infinity, -Infinity, -Infinity];
  let prims = 0;
  for (const m of j.meshes || []) {
    for (const pr of m.primitives || []) {
      const a = j.accessors[pr.attributes.POSITION];
      if (!a || !a.min || !a.max) continue;
      prims++;
      for (let i = 0; i < 3; i++) {
        mn[i] = Math.min(mn[i], a.min[i]);
        mx[i] = Math.max(mx[i], a.max[i]);
      }
    }
  }
  if (!prims) return null;
  return {
    w: +(mx[0] - mn[0]).toFixed(3),
    h: +(mx[1] - mn[1]).toFixed(3),
    d: +(mx[2] - mn[2]).toFixed(3),
  };
}

function main() {
  const checkOnly = process.argv.includes('--check');

  const ledgerPath = path.join(POLY_ROOT, 'manifest.json');
  if (!fs.existsSync(ledgerPath)) {
    console.error(`❌ 找不到下载台账 ${path.relative(ROOT, ledgerPath)}`);
    console.error('   先跑：node scripts/fetch-polyhaven.cjs');
    process.exit(1);
  }
  const ledger = JSON.parse(fs.readFileSync(ledgerPath, 'utf8'));

  /* ── 模型 ── */
  const modelsDir = path.join(POLY_ROOT, 'models');
  const entries = [];

  for (const dir of fs.readdirSync(modelsDir)) {
    const p = path.join(modelsDir, dir);
    if (!fs.statSync(p).isDirectory()) continue;

    /* ★ 尺寸从**打包后的 GLB** 读，而不是原始 gltf。
       理由：运行时加载的就是 GLB；从 gltf 读会掩盖"打包过程出错"
       （比如 BIN 数据错位导致包围盒变了）。读被测对象本身才有意义。
       ★ 原始 .gltf 已经被 pack-polyhaven-glb.cjs 之后清理掉了
         （见 clean 脚本：留着会让"改回 .gltf"这条错误路径可用，
          而那会重新踩 IDM 抢下载的坑）。
         所以 source 字段只记"从下载台账里能查到来源"，不再依赖本地文件。 */
    const glbFile = dir + '.glb';
    const glbPath = path.join(p, glbFile);

    if (!fs.existsSync(glbPath)) {
      console.warn(`  ⚠  ${dir}：没有 ${glbFile}（先跑 scripts/pack-polyhaven-glb.cjs）`);
      continue;
    }

    const box = measureGltf(glbPath);
    if (!box) {
      console.warn(`  ⚠  ${dir}：读不到 POSITION，跳过`);
      continue;
    }
    entries.push({
      name: dir,
      file: glbFile,               // 运行时加载的文件
      w: box.w, h: box.h, d: box.d,
    });
  }

  /* ── 按组归类（每条必须落进恰好一个组，否则报错促使人补规则）── */
  const groups = {};
  for (const g of GROUPS) groups[g.key] = { note: g.note, items: [] };
  const ungrouped = [];

  for (const e of entries) {
    const g = GROUPS.find((G) => G.match.some((re) => re.test(e.name)));
    if (g) groups[g.key].items.push(e);
    else ungrouped.push(e.name);
  }

  if (ungrouped.length) {
    console.error(`❌ 有 ${ungrouped.length} 个模型没归进任何组：${ungrouped.join(', ')}`);
    console.error('   请在上方 GROUPS 里补匹配规则 —— 「未归类」会让它永远不被场景使用。');
    process.exit(1);
  }

  /* 每组按名字排序，保证清单稳定（否则 diff 噪声大） */
  for (const k of Object.keys(groups)) {
    groups[k].items.sort((a, b) => a.name.localeCompare(b.name));
  }

  /* ── HDRI ── */
  const hdriDir = path.join(POLY_ROOT, 'hdri');
  const hdri = {};
  if (fs.existsSync(hdriDir)) {
    const NOTES = {
      'day-cloudy': '上午 · 多云',
      'day-clearsky': '下午 · 晴',
      dusk: '傍晚 · 暖',
      night: '夜间',
    };
    for (const f of fs.readdirSync(hdriDir)) {
      if (!f.endsWith('.hdr')) continue;
      const n = f.replace(/\.hdr$/, '');
      hdri[n] = { note: NOTES[n] || n };
    }
  }

  /* ── 贴图 ── */
  const texDir = path.join(POLY_ROOT, 'textures');
  const textures = {};
  if (fs.existsSync(texDir)) {
    for (const f of fs.readdirSync(texDir)) {
      if (!/\.(jpg|png)$/i.test(f)) continue;
      textures[f.replace(/\.(jpg|png)$/i, '')] = { file: f };
    }
  }

  const manifest = {
    _generated: 'scripts/gen-polyhaven-manifest.cjs —— 请勿手改',
    source: ledger.source,
    license: ledger.license,
    licenseUrl: ledger.licenseUrl,
    commercialUse: ledger.commercialUse,
    attributionRequired: ledger.attributionRequired,
    units: 'meter',
    groups,
    hdri,
    textures,
    counts: {
      models: entries.length,
      groups: Object.keys(groups).length,
      hdri: Object.keys(hdri).length,
      textures: Object.keys(textures).length,
    },
  };

  const json = JSON.stringify(manifest, null, 2) + '\n';

  if (checkOnly) {
    if (!fs.existsSync(OUT)) { console.error('❌ 清单不存在'); process.exit(1); }
    const cur = fs.readFileSync(OUT, 'utf8');
    if (cur !== json) {
      console.error('❌ 清单已过期（源码/资产变了但没重新生成）');
      console.error('   跑：node scripts/gen-polyhaven-manifest.cjs');
      process.exit(1);
    }
    console.log('✅ 清单是最新的');
    return;
  }

  fs.writeFileSync(OUT, json);

  console.log(`Poly Haven 清单已生成 → ${path.relative(ROOT, OUT)}`);
  console.log(`  模型 ${entries.length} 个 · HDRI ${Object.keys(hdri).length} 个 · 贴图 ${Object.keys(textures).length} 个`);
  console.log('');
  for (const g of GROUPS) {
    const items = groups[g.key].items;
    console.log(`  [${g.key.padEnd(9)}] ${items.length} 个 — ${g.note}`);
    for (const it of items) {
      console.log(`      · ${it.name.padEnd(24)} ${it.w} × ${it.h} × ${it.d} m`);
    }
  }
}

main();
