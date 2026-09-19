import * as THREE from 'three';

/* ══ 角色贴图：人 · 车 · 动物 ══════════════════════════════════════════════
   2026-09-19 新建。目标：把"低模 + 纯色块"升级成"低模 + 贴图"，
   让角色一侧的美术风格向《大多数》靠。

   ── 为什么低模角色必须靠贴图 ─────────────────────────────────────────────
   本项目的人形是"球 + 胶囊 + 盒"拼的（actors.js::buildHuman），
   几何层面永远做不出衣服。而人眼认"这是件衣服"靠的从来不是几何，是
   **领口、袖口、下摆、门襟、侧缝、明线、织物纹理**这些高频线索 ——
   它们全是**平面**信息，正好是贴图能零成本提供的。
   把一根圆柱读作"一件 T 恤"，靠的就是领口那道弧线和下摆那条边。

   ── 与 actors.js::faceTexture 的分工（不要重复实现）──────────────────────
   脸（眉/眼/鼻/唇）已经在 faceTexture 里画好了，用的是
   **底色留白 + 材质 color 相乘**的方案（4 种脸型 × 5 种肤色只花 4 张图）。
   本文件沿用同一条纪律：**所有贴图都是灰度（亮度）贴图，底色纯白，
   只画"变暗"的结构**，颜色一律由材质的 color 乘进去。
   于是"8 种上衣色"只花 1 张上衣图，而不是 8 张 —— 显存省 8 倍，
   而且调色板（actors.js 的 TOP / PANTS）以后增删颜色不需要重新出图。

   ── UV 约定（★ 改之前必须核对，错了会静默贴歪，不报错）─────────────────
   · 躯干 CylinderGeometry：**已把 thetaStart 改成 π**（见 actors.js::geomInit）。
     于是 u=0.5 是正面（+Z）、u=0/1 是背面。
     不这么改的话，正面正好落在画布接缝上 —— 门襟会被劈成两半贴到左右两侧，
     而且"看起来还挺像件衣服"，属于最难发现的一类错。
   · 手臂 / 腿 CapsuleGeometry：走 LatheGeometry 的 UV ——
     uv.x 绕圆周（u=0 = +Z = 正面）、uv.y 在**上端为 1**。
   · 画布行 0 = uv.y = 1 = 模型上端（CanvasTexture 默认 flipY = true）。
     所以本文件里 v 一律按"0 = 上"的直觉方向写，不要再想 flipY。
   · 车 BoxGeometry：六个面默认 uv 全是 0..1（= 六个面只能贴同一张图）。
     这里用 remapCarUV() 把它们重映射到一张图集的六个区，于是
     **一个材质 + 一次 draw call** 就能让车头、车侧、车顶各长各的样。

   ── 纪律（与 actors.js 的 G / M 完全一致）───────────────────────────────
   本文件的所有纹理与材质都是**模块级共享资源，永不 dispose**。
   角色是动态对象、每次切地点整批销毁重建，一旦把共享材质 dispose 掉，
   第二次进地点就是**纯黑/纯白的人**（不报错，只是"人不对了"）——
   与 assets.js 里 GLB 几何被误 dispose 是同一类事故。
   ────────────────────────────────────────────────────────────────────────── */

/* ── 缓存与读数 ───────────────────────────────────────────────────────────
   ★ 读数存在的理由和 materials.js 里 __matDebug 一样：
     本项目的历史教训是"静默失效是常态"——
     贴图生成了但没挂上、挂了但 UV 全错，两种情况都**不报错**。
     所以宁可多留几个可观测计数，也不要靠盯着截图猜。 */
const _tex = new Map();      // key → THREE.Texture
const _mat = new Map();      // key → THREE.Material
let _texBuilt = 0, _matBuilt = 0;

function cached(map, key, make) {
  let v = map.get(key);
  if (!v) { v = make(); map.set(key, v); }
  return v;
}

const _debug = {
  get textures() { return _tex.size; },
  get materials() { return _mat.size; },
  get texturesBuilt() { return _texBuilt; },
  get materialsBuilt() { return _matBuilt; },
  /* 车 UV 重映射是否真的跑过 —— 没跑的话车身六面会贴同一张图（静默） */
  carUvRemapped: false,
  carUvFaces: 0,
  /* 每个几何的实测 UV 覆盖范围，给验证脚本断言用。
     只看"函数被调用了"是不够的 —— 要看到 uv 值真的落在目标区域内。 */
  carUvRects: null,
};
if (typeof window !== 'undefined') window.__charSkinDebug = _debug;

/* ── 画布工具 ──────────────────────────────────────────────────────────── */

function canvas(w, h = w) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

/* 噪点：一张 256² 图平铺。
   与 materials.js::grain 同一条性能纪律 —— 不用逐像素 getImageData 循环，
   那是 6.5 万次运算；createPattern + 一次 fillRect 就够。 */
let _noise = null;
function noiseTile() {
  if (_noise) return _noise;
  const s = 256;
  const c = canvas(s, s), ctx = c.getContext('2d');
  const img = ctx.createImageData(s, s), d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = 128 + (Math.random() - 0.5) * 255;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  _noise = c;
  return c;
}

/** 颗粒。overlay 混合：>128 提亮、<128 压暗。 */
function grain(ctx, w, h, amount) {
  if (amount <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(0.8, amount / 70);
  ctx.globalCompositeOperation = 'overlay';
  ctx.fillStyle = ctx.createPattern(noiseTile(), 'repeat');
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

/* ── 织物底纹 ─────────────────────────────────────────────────────────────
   三种织法各一张 8×8 的小图案，平铺成整面。
   ★ 为什么必须平铺小图案而不是直接画横竖线：
     整面画线时线距是按像素写的，而贴图横向与纵向的"每像素多少毫米"
     **不一样**（躯干是 0.911m 绕一圈 × 0.56m 高，画布却是正方形），
     于是横线与竖线的真实密度会差 1.6 倍，近看是明显的各向异性。
     平铺图案可以按 canvas 变换把两个方向分别缩放，密度就对了。 */
const _fabric = {};
function fabricTile(kind) {
  if (_fabric[kind]) return _fabric[kind];
  const S = 8;
  const c = canvas(S, S), ctx = c.getContext('2d');
  /* ★ 底纹的**平均明度必须压到 ~0.90，不能是 1.0**。
     这是本文件第四个静默失效的根因：底色纯白时，"更亮"无处可去 ——
     卷边提亮、膝部磨白都会撞上 255 的钳位，在画面上等于没画，
     在验证脚本里也量不出落差。压到 0.90 之后这些高光才有 10% 的余量。 */
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, S, S);
  ctx.strokeStyle = 'rgba(0,0,0,0.26)';
  ctx.lineWidth = 1;
  if (kind === 'twill') {
    // 斜纹（牛仔 / 工装）：45° 短斜线
    for (let i = -S; i < S * 2; i += 3) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + S, S); ctx.stroke();
    }
  } else if (kind === 'canvas') {
    // 平纹（帆布 / 床单）：横竖各一组，一上一下
    for (let i = 0; i < S; i += 2) {
      ctx.beginPath(); ctx.moveTo(0, i + 0.5); ctx.lineTo(S, i + 0.5); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(i + 0.5, 0); ctx.lineTo(i + 0.5, S); ctx.stroke();
    }
  } else {
    // 针织（T 恤 / 卫衣）：细密的点阵，行与行错开半格
    ctx.fillStyle = 'rgba(0,0,0,0.24)';
    for (let y = 0; y < S; y += 2) {
      for (let x = ((y / 2) % 2) * 1; x < S; x += 2) ctx.fillRect(x, y, 1, 1);
    }
  }
  _fabric[kind] = c;
  return c;
}

/** 把织物铺满整张画布。
 *  @param {number} ax  横向缩放（补偿 u/v 两个方向的真实密度差）
 *  @param {number} ay  纵向缩放 */
function fabric(ctx, w, h, kind, ax = 1, ay = 1, alpha = 0.6) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.scale(ax, ay);
  ctx.fillStyle = ctx.createPattern(fabricTile(kind), 'repeat');
  ctx.fillRect(0, 0, w / ax, h / ay);
  ctx.restore();
}

/** 在 u 方向的接缝两侧各画一遍。
 *  ★ 存在的理由：躯干的 u=0 与 u=1 是**同一条线**（背面正中）。
 *    任何压在画布左右边缘上的图形，只画一次的话另一边是断的 ——
 *    表现是"背后有一道整齐的裂口"。三遍（-W / 0 / +W）最省心。 */
function wrapX(ctx, W, fn) {
  for (const dx of [-W, 0, W]) {
    ctx.save();
    ctx.translate(dx, 0);
    fn();
    ctx.restore();
  }
}

/** 明线（缝纫线）：牛仔的侧缝、T 恤的下摆压线都靠它。
 *  必须是虚线 —— 实线读作"印上去的条"，虚线才读作"缝出来的线"。 */
function stitch(ctx, x0, y0, x1, y1, color = 'rgba(0,0,0,0.34)', w = 1.4, dash = 3, gap = 2.6) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = w;
  ctx.lineCap = 'butt';
  ctx.setLineDash([dash, gap]);
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x1, y1);
  ctx.stroke();
  ctx.restore();
}

/** 柔和径向暗斑（污渍 / 磨损 / 体积阴影）。 */
function blob(ctx, x, y, r, rgba, squashY = 1) {
  const g = ctx.createRadialGradient(x, y, r * 0.12, x, y, r);
  g.addColorStop(0, rgba);
  g.addColorStop(1, rgba.replace(/[\d.]+\)$/, '0)'));
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, squashY);
  ctx.translate(-x, -y);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** 提亮（加法混合）。
 *
 *  ★ 为什么必须有这个函数 —— 这是本文件踩的第三个静默失效：
 *    本文件所有贴图都是**白底 + 只画变暗的结构**（颜色由材质 color 乘进来）。
 *    于是"在底上再叠一层白色"用普通的 source-over **什么都不会发生**：
 *    result = 1.0×(1−a) + 1.0×a = 1.0。代码看起来完全正常，贴图上也确实
 *    什么都没变 —— 裤脚卷边与膝部磨白第一版就是这样，两处**都是空的**。
 *    要"更亮"只能走加法：co = cs·as + cb（白底之上最多还能再加 1−cb）。 */
function lift(ctx, x, y, w, h, amount) {
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = `rgba(255,255,255,${amount})`;
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** 脏污：下摆 / 裤脚 / 膝部。城中村的衣服是脏的，干净的衣服反而假。 */
function dirt(ctx, w, h, count, strength, seedArea) {
  for (let i = 0; i < count; i++) {
    const [x, y] = seedArea
      ? seedArea(w, h)
      : [Math.random() * w, Math.random() * h];
    blob(ctx, x, y, 8 + Math.random() * 26,
      `rgba(86,70,52,${strength * (0.35 + Math.random() * 0.65)})`, 0.7);
  }
}

/* ── 上衣（躯干）──────────────────────────────────────────────────────────
   画布尺寸 256×256 对应 0.911m（绕一圈）× 0.56m（高）。
   ★ 这两个米数是**唯一真源**：领口开多深、下摆多高、肩缝落在哪，
     全部由它们换算。改了 buildHuman 的躯干几何必须同步改这里，
     否则领口会跑到胸口上（而且不报错）。 */
const TOP_W = 256, TOP_H = 256;
export const TORSO_C = 0.911;   // 2π × 0.145
export const TORSO_H = 0.56;

/* 上衣款式 —— 按上衣颜色索引取，**不额外抽随机数**。
   ★ 为什么这么讲究：buildHuman 里 rng() 的调用序列是确定性的，
     verify-actors.cjs 与 tests/rngHygiene 都依赖"同地点同结果"。
     为了款式再多抽一次 rng，会把后面所有外观（背包、帽子）整体错位一位，
     属于"看起来只是多了个随机"、实际会打乱既有断言的那类改动。 */
export const TOP_KINDS = ['tee', 'tee', 'shirt', 'tee', 'jacket', 'tee', 'shirt', 'tee'];

function topTex(kind) {
  const W = TOP_W, H = TOP_H;
  const c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);

  /* ★★ 两个换算函数**不能混用**，这是本文件踩过的第一个坑：
       um() 收「米」，uf() 收「u 的比例」。
     混用不会报错，只会把图形整体挪位并拉宽 —— 例如领口中心
     本该在 u=0.5（128px），写成 um(0.5) 会得到 140px：
     领口右偏 12px、开口宽了 10%，在画面上表现为"领子是歪的"。
     而 u 方向是**环绕**的，偏出去的部分还会绕到背后去，
     所以连"看起来偏了"都不容易判断。 */
  const um = (m) => (m / TORSO_C) * W;   // 米 → px（横向，绕躯干）
  const uf = (f) => f * W;               // u 比例 → px
  const vm = (m) => (m / TORSO_H) * H;   // 米 → px（纵向，肩→下摆）
  const vf = (f) => f * H;               // v 比例 → px

  /* 织物：针织。横向密度补偿 1.63（0.911/0.56），否则竖行比横行稀。 */
  fabric(g, W, H, kind === 'jacket' ? 'canvas' : 'knit', 1, 1.63, 0.72);

  /* ① 肩部压暗：肩膀与领口交接处天然有暗部。
        没有它，领口弧线会像"贴在纸上的一个圈"。
        ★ 强度与深度都刻意压得很低（0.15 / 0.06m）：第一版用了
          0.26 / 0.11m，结果整块上胸变成深色，领口读成了"围脖 / 披肩"
          而不是 T 恤领 —— 领口的辨识度来自**弧线本身**，
          不来自它周围的暗部；暗部一重，弧线就被吞掉了。 */
  let gr = g.createLinearGradient(0, 0, 0, vm(0.06));
  gr.addColorStop(0, 'rgba(0,0,0,0.15)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, vm(0.06));

  /* ② 领口。★ 画在画布**顶部**（v=0 是肩）。
        不是画一圈等高的环 —— 真实衣领在正面往下开口，等高环看起来
        就是"脖子上套了个圈"。
        尺寸依据：成衣 T 恤领口宽约 20cm，而躯干一圈 0.911m → 半宽 0.10m；
        前领深约 7cm（二次贝塞尔的控制点要放 2 倍处才落到 7cm）。 */
  const neckD = kind === 'jacket' ? 0.055 : 0.072;   // 前领深（米，u=0.5 处）
  const neckB = 0.024;                               // 后领深（米，u=0 处）
  /* 领深随 u 变化：背面浅、正面深，用 (1-cos)/2 平滑过渡。
     ★ 为什么不用两段二次贝塞尔拼（第一版就是这么写的）：
       那样拼出来的是一个**只覆盖正面的封闭透镜形**（x 只落在 u≈0.4~0.6），
       背面根本没有领口 —— 而躯干是**环绕**的，转过去看就是一截光脖子。
       这种错在正面截图里完全看不出来，只有转到背后才会发现。
       逐点采样的曲线天然是环绕的，且前深后浅，与真实衣领一致。 */
  const depthAt = (f) => neckB + (neckD - neckB) * (1 - Math.cos(f * Math.PI * 2)) / 2;
  const NECK_STEPS = 72;
  const neckPath = () => {
    g.beginPath();
    g.moveTo(0, 0);
    for (let i = 0; i <= NECK_STEPS; i++) {
      const f = i / NECK_STEPS;
      g.lineTo(f * W, vm(depthAt(f)));
    }
    g.lineTo(W, 0);
    g.closePath();
  };
  /* 领口区 = 从躯干顶边（肩线）到领深曲线之间那一圈。
     填充是罗纹的"深色"，描边是开口的"线" ——
     ★ 罗纹不能画黑：它是深色不是黑色，纯黑会变成"脖子上挖了个洞"。
       真正的辨识度来自那道弧线，所以填充轻（0.20）、描边相对重（0.40）。 */
  neckPath();
  g.fillStyle = 'rgba(0,0,0,0.20)';
  g.fill();
  neckPath();
  g.strokeStyle = 'rgba(0,0,0,0.40)';
  g.lineWidth = 2.4;
  g.stroke();

  /* ③ 肩缝：从领口两端斜向肩外，明线。T 恤的识别度有一半在这两条线上。
        起点取领口在肩线处的落点（u = 0.5 ± 0.10），终点在袖窿上方。 */
  for (const s of [-1, 1]) {
    const x0 = uf(0.5 + s * 0.10), x1 = uf(0.5 + s * 0.22);
    stitch(g, x0, vm(depthAt(0.5 + s * 0.10)), x1, vm(0.055), 'rgba(0,0,0,0.26)', 1.5, 3, 2.4);
  }

  /* ④ 袖窿阴影：两侧（u=0.25 / 0.75 是左右侧面）腋下的暗部。
        躯干两侧本来就是背光面，加一点让圆柱读作"有体积的躯干"。
        ★ 同样刻意很轻：第一版半径 um(0.085)（=24px）压 2.6 倍，
          在上胸形成一片 60px 高的暗区，与肩部渐变叠起来把整块胸都压黑了。 */
  for (const f of [0.25, 0.75]) {
    blob(g, uf(f), vm(0.22), um(0.055), 'rgba(0,0,0,0.10)', 2.2);
  }

  /* ⑤ 门襟（衬衫 / 外套）：正面正中一条竖线 + 纽扣。
        门襟必须落在 u=0.5 —— 这正是"躯干 thetaStart 改成 π"换来的东西。 */
  if (kind === 'shirt' || kind === 'jacket') {
    const x = uf(0.5);
    /* ★ y1 用 vf 不用 vm —— 见下面下摆处的长注。 */
    const y0 = vm(neckD + 0.02), y1 = vf(kind === 'jacket' ? 0.97 : 0.95);
    g.save();
    g.strokeStyle = 'rgba(0,0,0,0.20)';
    g.lineWidth = 5;
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
    stitch(g, x - 3.5, y0, x - 3.5, y1, 'rgba(0,0,0,0.26)', 1.3, 3, 2.6);
    stitch(g, x + 3.5, y0, x + 3.5, y1, 'rgba(0,0,0,0.26)', 1.3, 3, 2.6);
    g.restore();
    if (kind === 'shirt') {
      const n = 5;
      for (let i = 1; i <= n; i++) {
        const y = y0 + (y1 - y0) * (i / (n + 1));
        g.fillStyle = 'rgba(0,0,0,0.42)';
        g.beginPath(); g.arc(x, y, 2.6, 0, Math.PI * 2); g.fill();
      }
    } else {
      /* 外套画拉链：一条连续的亮暗对线，比纽扣更像夹克 */
      g.strokeStyle = 'rgba(0,0,0,0.30)';
      g.lineWidth = 1.6;
      for (let y = y0; y < y1; y += 5) {
        g.beginPath(); g.moveTo(x - 2.4, y); g.lineTo(x + 2.4, y); g.stroke();
      }
    }
  }

  /* ⑥ 印花（只有 T 恤）。
        ★ 为什么不写具体文字：胸口的印花在跟随视距下只有 8~14px 高，
          写什么字都会糊成一坨。低模游戏里它读作"饱和/高对比的一块图形"，
          所以画抽象印刷块（破边矩形 + 几条字行）反而更真。
          用乘色法（灰度贴图）时印花只能是"更深的同色" —— 这是本方案的
          已知代价，换来的是 8 种衣色共用一张图。 */
  if (kind === 'tee') {
    const cx = uf(0.5), cy = vm(0.29);   // uf 不是 um —— 见上面两个换算函数的注释
    const pw = um(0.135), ph = vm(0.16);
    g.save();
    g.globalAlpha = 0.42;
    g.fillStyle = '#000000';
    // 破边外框
    g.fillRect(cx - pw / 2, cy - ph / 2, pw, ph * 0.06);
    g.fillRect(cx - pw / 2, cy + ph / 2 - ph * 0.06, pw, ph * 0.06);
    // 三行"字"：宽度不一，模拟长短不齐的排版
    const rows = [0.86, 0.62, 0.74];
    rows.forEach((r, i) => {
      const y = cy - ph * 0.24 + i * ph * 0.24;
      g.fillRect(cx - (pw * r) / 2, y, pw * r, ph * 0.15);
    });
    g.restore();
    // 印花边缘做旧：随机抠掉几个小点，避免"印刷完美"的塑料感
    g.save();
    g.globalCompositeOperation = 'destination-out';
    for (let i = 0; i < 60; i++) {
      g.globalAlpha = 0.25 + Math.random() * 0.5;
      g.beginPath();
      g.arc(cx + (Math.random() - 0.5) * pw, cy + (Math.random() - 0.5) * ph,
        0.6 + Math.random() * 1.8, 0, Math.PI * 2);
      g.fill();
    }
    g.restore();
  }

  /* ⑦ 下摆：底部一条压暗带 + 明线。
        这是"衣服有下摆"的唯一线索，也是最容易被忽略的一条 ——
        没有它，躯干就是一截悬空的圆柱。

     ★★ 这里踩过一个**静默失效**，改之前务必看懂：
        vm() 收的是**米**（0.56m = 整条躯干 = 画布高 256px），
        而"下摆在高度的 94.5% 处"是**比例**。第一版写的是 vm(0.945)，
        算出来 432px —— 远超 256px 的画布。于是：
          · createLinearGradient 的两个端点都在画布外；
          · fillRect 的高度是 H - hemY = 256 - 432 = **负数**，
            而 Canvas 对负高度是**直接不画**（不报错、不警告）。
        结果是"下摆整个没画上去"，而代码逐行看全对、
        材质上也确实挂了贴图 —— 属于最难发现的一类。
        所以纵向也必须区分 vm(米) 与 vf(比例)，与 uf/um 同理。 */
  const hemY = vf(kind === 'jacket' ? 0.955 : 0.945);
  gr = g.createLinearGradient(0, hemY - vm(0.03), 0, H);
  gr.addColorStop(0, 'rgba(0,0,0,0)');
  gr.addColorStop(1, 'rgba(0,0,0,0.30)');
  g.fillStyle = gr; g.fillRect(0, hemY - vm(0.03), W, H - hemY + vm(0.03));
  wrapX(g, W, () => {
    stitch(g, 0, hemY, W, hemY, 'rgba(0,0,0,0.30)', 1.5, 3.2, 2.4);
  });

  /* ⑧ 脏污：集中在下摆与侧面（手肘蹭、靠墙蹭）。 */
  dirt(g, W, H, 12, 0.16, (w, h) => [Math.random() * w, h * (0.72 + Math.random() * 0.28)]);
  dirt(g, W, H, 8, 0.10, (w, h) => [Math.random() * w, Math.random() * h]);
  grain(g, W, H, 16);

  return makeTex(c, `${kind}`);
}

/* ── 袖子（手臂）──────────────────────────────────────────────────────────
   画布 128×128 对应 0.270m（绕一圈）× 0.506m（肩→腕）。
   ★ 手臂与躯干**必须用两个材质**：躯干上有领口和门襟，
     共用一份材质的话，袖子顶部会长出一圈领口、门襟会顺着胳膊往下跑。 */
const SLV_W = 128, SLV_H = 128;
export const ARM_C = 0.270;   // 2π × 0.043
export const ARM_H = 0.506;   // 0.42 + 2 × 0.043（含两端半球）

function sleeveTex() {
  const W = SLV_W, H = SLV_H;
  const c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  const vm = (m) => (m / ARM_H) * H;   // 米
  const v = (f) => f * H;              // 比例（两者不可混用，见 topTex 的长注）

  fabric(g, W, H, 'knit', 1, 1.87, 0.72);

  /* 肩头：胳膊最上端与躯干相接，本来就该暗。 */
  let gr = g.createLinearGradient(0, 0, 0, vm(0.12));
  gr.addColorStop(0, 'rgba(0,0,0,0.24)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, vm(0.12));

  /* 袖口：短袖的袖口在**上臂中段**，不是手腕 ——
     0.42m 的臂长里，短袖大约盖到 0.20m 处（v ≈ 0.40）。
     ★ 这一条是"T 恤 vs 长袖"的唯一区别，位置错了会变成长袖工装。 */
  const cuffY = vm(0.20);
  gr = g.createLinearGradient(0, cuffY - vm(0.02), 0, cuffY + vm(0.02));
  gr.addColorStop(0, 'rgba(0,0,0,0)');
  gr.addColorStop(0.5, 'rgba(0,0,0,0.34)');
  gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.fillRect(0, cuffY - vm(0.02), W, vm(0.04));
  stitch(g, 0, cuffY, W, cuffY, 'rgba(0,0,0,0.30)', 1.4, 3, 2.4);

  /* 袖缝：u=0 正好是圆周接缝，画在这里不用 wrapX —— 它本来就该是"接缝"。 */
  stitch(g, 0.7, v(0.05), 0.7, v(0.95), 'rgba(0,0,0,0.20)', 1.2, 3, 2.6);

  /* 手肘 / 小臂的脏污。 */
  dirt(g, W, H, 8, 0.14, (w, h) => [Math.random() * w, h * (0.45 + Math.random() * 0.55)]);
  grain(g, W, H, 14);
  return makeTex(c, 'sleeve');
}

/* ── 长裤（腿）────────────────────────────────────────────────────────────
   画布 256×256 对应 0.452m（绕一圈）× 0.764m（腰→裤脚）。
   u 方向：0 = 前、0.25 = 右侧、0.5 = 后、0.75 = 左侧。 */
const PNT_W = 256, PNT_H = 256;
export const LEG_C = 0.452;   // 2π × 0.072
export const LEG_H = 0.764;   // 0.62 + 2 × 0.072

function pantsTex() {
  const W = PNT_W, H = PNT_H;
  const c = canvas(W, H), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  /* ★ 同样区分"米"与"比例"：um/vm 收米，u/v 收比例。
     裤脚卷边第一版写成 vm(0.885)（想表达"高度的 88.5%"）→ 296px > 256px，
     fillRect 高度为负 → **卷边没画上去**。与下摆是同一个坑。 */
  const um = (m) => (m / LEG_C) * W;
  const vm = (m) => (m / LEG_H) * H;
  const u = (f) => f * W;
  const v = (f) => f * H;

  /* 牛仔 / 斜纹布。横向密度补偿 1.69（0.452/0.764 的倒数）。 */
  fabric(g, W, H, 'twill', 1, 1.69, 0.76);

  /* ① 侧缝明线：u=0.25 / 0.75，牛仔最标志性的一条。
        用**橙色调**的明线 —— 但本方案是灰度贴图，只能用亮度表达，
        所以画成比布面略暗的虚线。远看同样是"一条贯穿的缝"。 */
  for (const f of [0.25, 0.75]) {
    stitch(g, u(f), v(0.03), u(f), v(0.92), 'rgba(0,0,0,0.32)', 1.8, 3.4, 2.6);
  }

  /* ② 前插袋：正面（u=0 / 1，跨接缝）两侧各一个斜袋口 + 明线。 */
  wrapX(g, W, () => {
    for (const s of [-1, 1]) {
      g.save();
      g.strokeStyle = 'rgba(0,0,0,0.26)';
      g.lineWidth = 1.6;
      g.beginPath();
      g.moveTo(u(0.5) + s * um(0.012), vm(0.10));
      g.lineTo(u(0.5) + s * um(0.075), vm(0.045));
      g.stroke();
      g.restore();
    }
  });

  /* ③ 后袋：u=0.5 正中（一条腿只有一个，符合实际）。 */
  const bx0 = u(0.5) - um(0.055), bx1 = u(0.5) + um(0.055);
  const by0 = vm(0.11), by1 = vm(0.235);
  g.save();
  g.fillStyle = 'rgba(0,0,0,0.10)';
  g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);
  g.strokeStyle = 'rgba(0,0,0,0.30)';
  g.lineWidth = 1.6;
  g.strokeRect(bx0, by0, bx1 - bx0, by1 - by0);
  g.restore();

  /* ④ 膝部磨白：v 0.48~0.66，正面（u 靠近 0 / 1）最强、背面最弱。
        ★ 用横向 alpha 渐变而不是一条实带 —— 膝盖的磨白是"中间最亮、
          两侧渐隐"，画成实带会变成裤子上的一个白圈。 */
  const ky0 = vm(0.47), ky1 = vm(0.67);
  g.save();
  /* ★ 提亮必须走 lighter —— 见 lift() 的注释。用 source-over 画白是空的。 */
  g.globalCompositeOperation = 'lighter';
  const kg = g.createLinearGradient(0, ky0, 0, ky1);
  kg.addColorStop(0, 'rgba(255,255,255,0)');
  kg.addColorStop(0.45, 'rgba(255,255,255,0.22)');
  kg.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = kg;
  g.fillRect(0, ky0, W, ky1 - ky0);
  /* 背面压回去：背面膝盖不磨。multiply 是**变暗**，白底上有效。 */
  const kg2 = g.createLinearGradient(u(0.32), 0, u(0.68), 0);
  kg2.addColorStop(0, 'rgba(0,0,0,0)');
  kg2.addColorStop(0.5, 'rgba(0,0,0,0.34)');
  kg2.addColorStop(1, 'rgba(0,0,0,0)');
  g.globalCompositeOperation = 'multiply';
  g.fillStyle = kg2;
  g.fillRect(u(0.32), ky0, u(0.36), ky1 - ky0);
  g.restore();

  /* ⑤ 裤脚：卷边（略亮）+ 明线。城中村的长裤多数是卷边的。 */
  const cy0 = v(0.885);
  lift(g, 0, cy0, W, H - cy0, 0.07);          // 卷边的受光面（加法，见 lift）
  g.fillStyle = 'rgba(0,0,0,0.22)';           // 折痕：卷边的分界必须有一条硬线
  g.fillRect(0, cy0, W, vm(0.010));
  stitch(g, 0, v(0.925), W, v(0.925), 'rgba(0,0,0,0.30)', 1.4, 3, 2.4);

  /* ⑥ 脏污：裤脚最重（走路蹭地），膝部次之。 */
  dirt(g, W, H, 14, 0.20, (w, h) => [Math.random() * w, h * (0.80 + Math.random() * 0.20)]);
  dirt(g, W, H, 8, 0.10, (w, h) => [Math.random() * w, h * (0.40 + Math.random() * 0.45)]);
  grain(g, W, H, 18);
  return makeTex(c, 'pants');
}

/* ── 皮肤 ─────────────────────────────────────────────────────────────────
   极低对比的斑驳。用途是手与脖子（脸有独立贴图，见 faceTexture）。
   ★ 强度必须极低：皮肤贴图一重，人手就变成"脏兮兮的橡胶手套"。
     这里的目的是打破"纯色塑料"，不是画细节。 */
function skinTex() {
  const N = 128;
  const c = canvas(N), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, N, N);
  for (let i = 0; i < 26; i++) {
    blob(g, Math.random() * N, Math.random() * N, 6 + Math.random() * 16,
      `rgba(120,96,78,${0.03 + Math.random() * 0.05})`, 0.8);
  }
  for (let i = 0; i < 14; i++) {
    blob(g, Math.random() * N, Math.random() * N, 5 + Math.random() * 12,
      `rgba(255,255,255,${0.10 + Math.random() * 0.14})`, 0.8);
  }
  grain(g, N, N, 10);
  return makeTex(c, 'skin');
}

/* ── 动物毛皮 ─────────────────────────────────────────────────────────────
   短笔触堆叠。狗猫在屏幕上只有 20~40px，靠"毛的走向"读作动物而不是胶囊。 */
function furTex() {
  const N = 128;
  const c = canvas(N), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, N, N);
  /* ★ 第一版的问题是"斑块感"而不是"毛感"：当时铺了 12 个半径 8~28px 的暗斑，
     而狗在屏幕上是 200px 长、贴图整张铺在它身上 ——
     28px 的暗斑 = 狗身上一块占 1/5 的灰斑，看起来像奶牛的斑纹。
     毛的关键是**细、密、方向一致、对比低**，大色块一律不要。
     现在：暗斑减到 4 个且很淡，笔触加密、变细、压低对比。 */
  for (let i = 0; i < 4200; i++) {
    const x = Math.random() * N, y = Math.random() * N;
    const len = 1.4 + Math.random() * 2.8;
    const ang = -Math.PI / 2 + (Math.random() - 0.5) * 1.4;
    const v = Math.random();
    g.strokeStyle = v > 0.5
      ? `rgba(255,255,255,${0.14 + Math.random() * 0.20})`
      : `rgba(58,46,34,${0.06 + Math.random() * 0.13})`;
    g.lineWidth = 0.6 + Math.random() * 0.6;
    g.beginPath();
    g.moveTo(x, y);
    g.lineTo(x + Math.sin(ang) * len, y + Math.cos(ang) * len);
    g.stroke();
  }
  for (let i = 0; i < 4; i++) {
    blob(g, Math.random() * N, Math.random() * N, 6 + Math.random() * 9,
      `rgba(70,56,42,${0.02 + Math.random() * 0.03})`, 1);
  }
  grain(g, N, N, 14);
  return makeTex(c, 'fur');
}

/* ── 车身图集 ─────────────────────────────────────────────────────────────
   一张 1024×256 的图，切成 6 个区，对应 BoxGeometry 的 6 个面。
   ★ 为什么是图集而不是 6 个材质：
     BoxGeometry 的 6 个面默认 uv 全是 0..1 —— 不重映射的话六个面只能贴同一张图，
     于是车头上也会出现车门缝。而用"材质数组"虽然能解决，却会让
     一辆车从 1 次 draw call 变成 6 次（7 辆车 = +35 次）。
     图集 + UV 重映射两者都避开：一个材质、一次 draw call、六面各不相同。

   区的位置（比例已按各面的真实米数配好，避免拉伸）：
     px / nx 侧 面 4.05 × 0.62 → 纵横比 6.53（区 512×80 → 6.40）
     pz / nz 头尾面 1.78 × 0.62 → 2.87（区 256×90 → 2.84）
     py      顶面（引擎盖/尾箱）：纯色，不留结构
     ny      底面：压暗（正常看不见，但留着防"车底发亮"） */
const CAR_W = 1024, CAR_H = 256;
export const CAR_RECT = {
  px: [0, 0, 512, 80],
  nx: [0, 0, 512, 80],      // 与 px 同区 → 左右天然镜像（车本就左右对称）
  py: [0, 186, 256, 250],
  ny: [256, 186, 512, 250],
  pz: [0, 88, 256, 178],
  nz: [256, 88, 512, 178],
};

function carAtlasTex() {
  const c = canvas(CAR_W, CAR_H), g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, CAR_W, CAR_H);

  /* ── 侧面：车门缝 + 门把手 + 腰线 + 裙边 ── */
  const [sx0, sy0, sx1, sy1] = CAR_RECT.px;
  const sw = sx1 - sx0, sh = sy1 - sy0;
  g.save();
  g.beginPath(); g.rect(sx0, sy0, sw, sh); g.clip();

  /* 下裙压暗：车身下沿总是最脏最暗 */
  let gr = g.createLinearGradient(0, sy0 + sh * 0.72, 0, sy1);
  gr.addColorStop(0, 'rgba(0,0,0,0)');
  gr.addColorStop(1, 'rgba(0,0,0,0.42)');
  g.fillStyle = gr; g.fillRect(sx0, sy0 + sh * 0.72, sw, sh * 0.28);

  /* 腰线：一道压痕（上暗下亮），车身侧面全靠它才有"钣金"感 */
  g.fillStyle = 'rgba(0,0,0,0.18)';
  g.fillRect(sx0, sy0 + sh * 0.40, sw, 1.6);
  g.fillStyle = 'rgba(255,255,255,0.22)';
  g.fillRect(sx0, sy0 + sh * 0.40 + 1.6, sw, 1.6);

  /* 车门缝：三条竖缝（前后门 + 尾门），从腰线拉到裙边 */
  for (const f of [0.16, 0.52, 0.88]) {
    const x = sx0 + sw * f;
    g.fillStyle = 'rgba(0,0,0,0.34)';
    g.fillRect(x - 1, sy0 + sh * 0.10, 2, sh * 0.78);
  }
  /* 门把手：短横条，落在腰线略上方 */
  for (const f of [0.235, 0.60]) {
    g.fillStyle = 'rgba(0,0,0,0.30)';
    g.fillRect(sx0 + sw * f - 7, sy0 + sh * 0.30, 14, 3.2);
  }
  /* 轮眉：前后各一段暗弧（车轮位置 = 车长的 1/6 与 5/6） */
  for (const f of [0.165, 0.835]) {
    blob(g, sx0 + sw * f, sy1 - 2, sh * 0.62, 'rgba(0,0,0,0.30)', 0.6);
  }
  g.restore();

  /* ── 车头：进气格栅 + 车牌框 + 灯位 ── */
  const drawEnd = (rect, rear) => {
    const [x0, y0, x1, y1] = rect;
    const w = x1 - x0, h = y1 - y0;
    g.save();
    g.beginPath(); g.rect(x0, y0, w, h); g.clip();

    /* 下沿压暗 */
    const gg = g.createLinearGradient(0, y0 + h * 0.70, 0, y1);
    gg.addColorStop(0, 'rgba(0,0,0,0)');
    gg.addColorStop(1, 'rgba(0,0,0,0.40)');
    g.fillStyle = gg; g.fillRect(x0, y0 + h * 0.70, w, h * 0.30);

    if (!rear) {
      /* 格栅：中央偏下，四条横条 */
      const gx = x0 + w * 0.30, gw = w * 0.40;
      const gy = y0 + h * 0.46, gh = h * 0.30;
      g.fillStyle = 'rgba(0,0,0,0.34)';
      g.fillRect(gx, gy, gw, gh);
      g.fillStyle = 'rgba(255,255,255,0.16)';
      for (let i = 1; i < 4; i++) g.fillRect(gx, gy + (gh * i) / 4, gw, 1.4);
    } else {
      /* 尾门缝：一道横缝 + 两侧尾灯位 */
      g.fillStyle = 'rgba(0,0,0,0.28)';
      g.fillRect(x0 + w * 0.08, y0 + h * 0.30, w * 0.84, 1.8);
    }
    /* 车牌框（前后都有，正中偏下） */
    g.strokeStyle = 'rgba(0,0,0,0.34)';
    g.lineWidth = 2;
    g.strokeRect(x0 + w * 0.40, y0 + h * 0.60, w * 0.20, h * 0.24);
    g.fillStyle = 'rgba(0,0,0,0.16)';
    g.fillRect(x0 + w * 0.40, y0 + h * 0.60, w * 0.20, h * 0.24);
    g.restore();
  };
  drawEnd(CAR_RECT.pz, false);
  drawEnd(CAR_RECT.nz, true);

  /* ── 顶面：只压一点点暗，保持纯色（引擎盖 / 尾箱）── */
  const [tx0, ty0, tx1, ty1] = CAR_RECT.py;
  g.save();
  g.beginPath(); g.rect(tx0, ty0, tx1 - tx0, ty1 - ty0); g.clip();
  blob(g, tx0 + (tx1 - tx0) * 0.5, ty0 + (ty1 - ty0) * 0.5,
    (tx1 - tx0) * 0.7, 'rgba(0,0,0,0.06)', 1);
  g.restore();

  /* ── 底面：整体压暗 ── */
  const [bx0, by0, bx1, by1] = CAR_RECT.ny;
  g.fillStyle = 'rgba(0,0,0,0.55)';
  g.fillRect(bx0, by0, bx1 - bx0, by1 - by0);

  return makeTex(c, 'carAtlas');
}

/* ── 材质工厂 ──────────────────────────────────────────────────────────── */

/** 把 canvas 包成 CanvasTexture。
 *  ★ 必须是 sRGB：这是**颜色**贴图。法线贴图才用 NoColorSpace
 *    （见 materials.js::normalFromHeight 的注释，那是另一个坑）。 */
function makeTex(c, tag) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  t.name = 'charskin:' + tag;
  _texBuilt++;
  return t;
}

const hex = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0');

/* ── 对外：人 ───────────────────────────────────────────────────────────── */

/** 躯干（上衣）。kind 取 TOP_KINDS 里的一项。 */
export function topMat(kind, color) {
  return cached(_mat, `top|${kind}|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, `top|${kind}`, () => topTex(kind)),
      color, roughness: 0.92,
    });
  });
}

/** 手臂（袖子）。与躯干分开是**必须**的，理由见 sleeveTex 顶注。 */
export function sleeveMat(color) {
  return cached(_mat, `slv|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, 'sleeve', sleeveTex),
      color, roughness: 0.92,
    });
  });
}

/** 腿（长裤）。 */
export function pantsMat(color) {
  return cached(_mat, `pnt|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, 'pants', pantsTex),
      color, roughness: 0.93,
    });
  });
}

/** 皮肤（手 / 脖子）。脸有自己的贴图，不走这里。 */
export function skinMat(color) {
  return cached(_mat, `skin|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, 'skin', skinTex),
      color, roughness: 0.78,
    });
  });
}

/** 头发。原本 buildHuman 每个角色 new 一份 —— 5 种发色 × 17 个行人 = 17 份材质，
 *  而这 17 份里最多只有 5 种是真正不同的。改成按色缓存后与其它部件一致。 */
export function hairMat(color) {
  return cached(_mat, `hair|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  });
}

/* ── 对外：车 ───────────────────────────────────────────────────────────── */

export function carBodyMat(color) {
  return cached(_mat, `car|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, 'carAtlas', carAtlasTex),
      color, roughness: 0.42, metalness: 0.32,
    });
  });
}

/**
 * 把 BoxGeometry 的 6 个面重映射到车身图集的 6 个区。
 *
 * ★ 顶点顺序的依据（three.js r186 BoxGeometry::buildPlane）：
 *   六个面按 **+X, -X, +Y, -Y, +Z, -Z** 的顺序各推 4 个顶点与 4 组 uv，
 *   即 uv 索引 i 属于第 floor(i / 4) 个面。所以按 4 个一组重映射即可，
 *   不需要去读 geo.groups（那是索引缓冲的区间，换算更绕）。
 *
 * ★ 幂等：几何是模块级共享的（actors.js::G.carBody），只会建一次；
 *   但万一将来有人重复调用，这里用 userData 标记挡住 ——
 *   二次重映射会把已经映射过的 uv 再映射一次，图集区域会被裁得更小，
 *   表现是"车身的缝全糊在一起"，且不报错。
 */
export function remapCarUV(geo) {
  if (!geo || !geo.attributes || !geo.attributes.uv) return geo;
  if (geo.userData.__carUvDone) return geo;
  const uv = geo.attributes.uv;
  const order = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
  const seen = {};
  for (let f = 0; f < 6; f++) {
    const r = CAR_RECT[order[f]];
    if (!r) continue;
    const [u0, v0, u1, v1] = r;
    /* 图集坐标是"像素"（左上原点），three 的 uv 是"比例 + 左下原点"。
       v 要翻：v0 在上、v1 在下 → uv.y = 1 - 像素y/高。 */
    const au0 = u0 / CAR_W, au1 = u1 / CAR_W;
    const av0 = 1 - v0 / CAR_H, av1 = 1 - v1 / CAR_H;
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      if (i >= uv.count) continue;
      const u = uv.getX(i), v = uv.getY(i);
      uv.setXY(i, au0 + u * (au1 - au0), av0 + v * (av1 - av0));
    }
    seen[order[f]] = [au0, av0, au1, av1];
  }
  uv.needsUpdate = true;
  geo.userData.__carUvDone = true;
  _debug.carUvRemapped = true;
  _debug.carUvFaces = 6;
  _debug.carUvRects = seen;
  return geo;
}

/* ── 对外：动物 ─────────────────────────────────────────────────────────── */

export function furMat(color) {
  return cached(_mat, `fur|${color}`, () => {
    _matBuilt++;
    return new THREE.MeshStandardMaterial({
      map: cached(_tex, 'fur', furTex),
      color, roughness: 0.93,
    });
  });
}

/* ── 供验证脚本读取 ────────────────────────────────────────────────────── */

export function charSkinDebug() {
  return {
    textures: _tex.size,
    materials: _mat.size,
    texturesBuilt: _texBuilt,
    materialsBuilt: _matBuilt,
    carUvRemapped: _debug.carUvRemapped,
    carUvFaces: _debug.carUvFaces,
    carUvRects: _debug.carUvRects,
    /* 贴图清单：验证脚本可以断言"上衣贴图存在且分辨率正确"，
       而不是只断言"函数被调用了"（后者对"贴图没挂上"毫无察觉）。 */
    keys: [..._tex.keys()],
    /* 各纹理的实测尺寸 —— 用来抓"canvas 被建成 0×0"这类静默失败
       （createPattern 在 0 尺寸画布上不报错，只是什么都不画）。 */
    sizes: Object.fromEntries([..._tex.entries()].map(([k, t]) => [k, [t.image.width, t.image.height]])),
    /* 换算常数导出：验证脚本要用同一份米数去反算"领口开在哪一行"，
       不要自己再抄一份（抄表必然漂移）。 */
    geom: { TORSO_C, TORSO_H, ARM_C, ARM_H, LEG_C, LEG_H },
    hexOf: hex,
  };
}
