#!/usr/bin/env node
/**
 * 生成 Poly Haven **资产台账**（src/assets/polyhaven/assets-ledger.json）。
 *
 * ══ 这份台账要解决的到底是什么问题 ══════════════════════════════════════════
 *
 * 仓库里本来已经有一份 `manifest.json`（由 fetch-polyhaven.cjs 写），但它是
 * **下载当时**的台账，记的是**分离式 glTF 形态**：
 *
 *     dest: .../models/rollershutter-door/rollershutter_door_1k.gltf
 *     md5 : <原始 .gltf 的 md5>
 *
 * 而 `pack-polyhaven-glb.cjs` 后来把 `.gltf + .bin + textures/` 打成了单文件
 * `.glb`，**并把原始文件删掉了**，却**没有回写台账**。后果实测（2026-09-19）：
 *
 *     manifest.json 的 13 条 md5 → **13/13 找不到对应文件**
 *     4 个 HDRI            → **完全没有台账条目**
 *
 * 也就是说：**仓库里有 64 个资产，却没有任何东西能自证它们没被改坏。**
 * 这个脚本补的就是这一环 —— 记**仓库里实际存在**的形态（后打包），
 * 每条带 bytes + md5，可与磁盘逐字节比对。
 *
 * ══ 与另两份清单的分工（三份各司其职，不要合并）══════════════════════════
 *   `manifest.json`          —— 下载台账（来源 URL / 许可 / 原始 gltf 的 md5）
 *                              面向「可追溯、可审计、可重下」
 *   `assets-ledger.json`     —— **资产台账**（后打包形态 path + bytes + md5）
 *                              面向「仓库自洽：磁盘上的东西 == 提交的东西」
 *   `src/app/3d/polyhaven-manifest.json` —— 游戏清单（米制尺寸 / 分组）
 *                              面向「运行时内联，剔掉 url/md5 省包体」
 *
 * ══ ★ 为什么"扫到 0 个"必须硬失败 ══════════════════════════════════════════
 *   本脚本是**扫描目录**生成台账的。如果 `models/` 是空的（例如换机器、
 *   资产没下载、被误删），一个"只报告不报错"的生成器会写出一份**空台账**，
 *   然后一切照常：`python build.py` 成功、页面能打开、只是**满城没有卷帘门
 *   和电线杆，而且不报错**。这正是本项目反复踩的"静默失效"。
 *   所以：扫到 0 个模型 → 直接退出码 1，并把"可能是资产没下载"写在提示里。
 *   （部分缺失（0 < n < 期望）只警告不失败 —— 允许有意只下几个做实验。）
 *
 * 用法：
 *   node scripts/gen-asset-ledger.cjs            # 生成
 *   node scripts/gen-asset-ledger.cjs --check    # 只校验不写（门禁用）
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
/* 扫描根可用环境变量覆盖 —— 只为**让「扫到 0 个」这条守卫可被测试**。
   不然要验证它会硬失败，就得把 79MB 的 models/ 挪走再挪回来，风险不值得。 */
const PH = process.env.POLYHAVEN_ROOT
  ? path.resolve(process.env.POLYHAVEN_ROOT)
  : path.join(ROOT, 'src/assets/polyhaven');
const MODELS = path.join(PH, 'models');
const HDRI = path.join(PH, 'hdri');
const OUT = path.join(PH, 'assets-ledger.json');

/* 期望值：与 fetch-polyhaven.cjs 的清单一致。
   ★ 用途是"显著变少就吵一声"，不是硬门槛 —— 所以写成警告而非断言。 */
const EXPECT = { models: 13, hdri: 4 };

function md5(file) {
  return crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');
}

/** 扫出仓库里**实际存在**的资产。path 一律相对 polyhaven 根，台账才与位置无关。 */
function scan() {
  const assets = [];

  if (fs.existsSync(MODELS)) {
    for (const d of fs.readdirSync(MODELS).sort()) {
      const dir = path.join(MODELS, d);
      if (!fs.statSync(dir).isDirectory()) continue;
      /* 约定：目录名 == 文件名（pack-polyhaven-glb.cjs 就是这么写的） */
      const f = path.join(dir, d + '.glb');
      if (!fs.existsSync(f)) continue;
      assets.push({
        kind: 'model',
        as: d,
        path: `models/${d}/${d}.glb`,
        bytes: fs.statSync(f).size,
        md5: md5(f),
      });
    }
  }

  if (fs.existsSync(HDRI)) {
    for (const f of fs.readdirSync(HDRI).sort()) {
      if (!/\.hdr$/i.test(f)) continue;
      const full = path.join(HDRI, f);
      assets.push({
        kind: 'hdri',
        as: f.replace(/\.hdr$/i, ''),
        path: `hdri/${f}`,
        bytes: fs.statSync(full).size,
        md5: md5(full),
      });
    }
  }

  return assets;
}

function build() {
  const assets = scan();
  const models = assets.filter((a) => a.kind === 'model').length;
  const hdri = assets.filter((a) => a.kind === 'hdri').length;
  const out = {
    _generated: 'scripts/gen-asset-ledger.cjs —— 请勿手改',
    _why: '记录**仓库里实际存在**的资产（后打包形态）。manifest.json 是下载台账，'
      + '记的是原始 .gltf/.bin（打包成 .glb 后已删除），因此它**无法**校验现有资产；'
      + '本文件才是自洽的那一份。三者分工见 gen-asset-ledger.cjs 头注。',
    source: 'Poly Haven',
    license: 'CC0 1.0 (Public Domain)',
    licenseUrl: 'https://polyhaven.com/license',
    /* 路径相对于本文件所在目录 —— 这样仓库搬到哪、部署到哪都不用改。 */
    base: 'src/assets/polyhaven/',
    counts: { models, hdri, total: assets.length },
    assets,
  };
  return { out, models, hdri, total: assets.length };
}

function render(out) {
  return JSON.stringify(out, null, 2) + '\n';
}

const r = build();
const args = process.argv.slice(2);

/* ★ 扫到 0 个模型 = 资产不在盘上。硬失败，不写空台账。 */
if (r.models === 0) {
  console.error('❌ 扫到 0 个模型 —— 这不是合法状态，拒绝写出空台账。');
  console.error(`   目录：${path.relative(ROOT, MODELS)}`);
  console.error('   最可能的原因：资产没下载（换机器 / 新克隆后忘了跑）');
  console.error('   先跑：node scripts/fetch-polyhaven.cjs');
  console.error('   若模型确已入库，检查 git 是否真的检出了它们：');
  console.error('     git ls-tree -r HEAD --name-only -- src/assets/polyhaven/models');
  process.exit(1);
}

const next = render(r.out);

if (args.includes('--check')) {
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : '';
  if (prev === next) {
    console.log(`✅ 资产台账是最新的（模型 ${r.models} · HDRI ${r.hdri}）`);
    process.exit(0);
  }
  /* 差异要说清楚是哪一种，否则门禁红了还得人工 diff */
  console.error('❌ 资产台账已过期。差异：');
  try {
    const a = prev ? JSON.parse(prev) : { assets: [] };
    const b = JSON.parse(next);
    const idx = (o) => new Map((o.assets || []).map((x) => [x.path, x]));
    const A = idx(a), B = idx(b);
    for (const [p, x] of B) {
      if (!A.has(p)) console.error(`   + 新增 ${p}（${x.bytes} 字节）`);
      else if (A.get(p).md5 !== x.md5) console.error(`   ~ 内容变了 ${p}（md5 不符）`);
      else if (A.get(p).bytes !== x.bytes) console.error(`   ~ 大小变了 ${p}`);
    }
    for (const [p] of A) if (!B.has(p)) console.error(`   - 已消失 ${p}`);
  } catch (_) {
    console.error('   （台账无法解析，直接按"过期"处理）');
  }
  console.error('   修法：node scripts/gen-asset-ledger.cjs');
  process.exit(1);
}

fs.writeFileSync(OUT, next);
console.log(`✅ 已写出 ${path.relative(ROOT, OUT)}`);
console.log(`   模型 ${r.models} · HDRI ${r.hdri} · 合计 ${r.total} 条`
  + ` · ${(fs.statSync(OUT).size / 1024).toFixed(1)}KB`);

/* 显著变少 → 吵一声（可能是删了资产忘了同步，也可能是有意精简） */
for (const [k, exp] of Object.entries(EXPECT)) {
  const got = k === 'models' ? r.models : r.hdri;
  if (got < exp) console.log(`   ⚠️  ${k} 只有 ${got} 个（清单期望 ${exp} 个）—— 确认是有意精简？`);
}
