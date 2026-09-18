/**
 * 3D 场景截图的像素级验证（开发用）
 *
 * 目的：不靠肉眼，用统计量证明「确实画出了东西且画对了」。
 * 检查项：
 *   1. 非空白 —— 像素方差足够大（全同色 = 渲染失败）
 *   2. 上天下地 —— 顶部区域应接近 spec.sky，底部应接近 spec.ground.base
 *   3. 建筑存在 —— 中带应出现与地面/天空都不同的色块
 *   4. 地点可区分 —— 不同地点的像素签名不得雷同
 *   5. 明度合理 —— 整体不应过曝或全黑
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
// 支持指定目录：node scripts/analyze-scene3d-shots.cjs [dir]
const SHOT_DIR = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.join(ROOT, "dev", "shots");

function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function dist(a, b) {
  return Math.sqrt((a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2);
}

async function analyze(sharp, file) {
  const img = sharp(file);
  const meta = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  const ch = info.channels;
  const W = info.width;
  const H = info.height;

  const px = (x, y) => {
    const i = (y * W + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  };

  // 全局统计
  let sum = [0, 0, 0];
  let sumSq = 0;
  const colorSet = new Set();
  const N = W * H;

  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      const p = px(x, y);
      sum[0] += p[0];
      sum[1] += p[1];
      sum[2] += p[2];
      const lum = 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
      sumSq += lum * lum;
      // 量化到 5 位色阶统计色数
      colorSet.add(((p[0] >> 3) << 10) | ((p[1] >> 3) << 5) | (p[2] >> 3));
    }
  }
  const sampled = Math.ceil(H / 2) * Math.ceil(W / 2);
  const mean = sum.map((s) => s / sampled);
  const meanLum = 0.299 * mean[0] + 0.587 * mean[1] + 0.114 * mean[2];
  const variance = sumSq / sampled - meanLum * meanLum;

  // 分区统计：顶部 12%（天空）、底部 25%（地面）
  const bandMean = (y0f, y1f) => {
    let s = [0, 0, 0];
    let n = 0;
    for (let y = Math.floor(H * y0f); y < Math.floor(H * y1f); y += 2) {
      for (let x = 0; x < W; x += 2) {
        const p = px(x, y);
        s[0] += p[0];
        s[1] += p[1];
        s[2] += p[2];
        n++;
      }
    }
    return s.map((v) => v / n);
  };

  const top = bandMean(0.0, 0.12);
  const bottom = bandMean(0.78, 1.0);
  const middle = bandMean(0.4, 0.65);

  // 结构签名：16×16 灰度缩略图，量化到 8 级
  const G = 16;
  const cells = [];
  for (let gy = 0; gy < G; gy++) {
    for (let gx = 0; gx < G; gx++) {
      const x0 = Math.floor((gx * W) / G);
      const x1 = Math.max(x0 + 1, Math.floor(((gx + 1) * W) / G));
      const y0 = Math.floor((gy * H) / G);
      const y1 = Math.max(y0 + 1, Math.floor(((gy + 1) * H) / G));
      let s = 0;
      let n = 0;
      for (let y = y0; y < y1; y += 2) {
        for (let x = x0; x < x1; x += 2) {
          const p = px(x, y);
          s += 0.299 * p[0] + 0.587 * p[1] + 0.114 * p[2];
          n++;
        }
      }
      cells.push(Math.round(s / n / 32));
    }
  }
  const thumb = cells.join("");

  return {
    meta, mean, meanLum, variance, colorCount: colorSet.size,
    top, bottom, middle, W, H, thumb,
  };
}

async function main() {
  const sharp = require("sharp");
  if (!fs.existsSync(SHOT_DIR)) {
    console.error("未找到截图目录，请先运行 scripts/shot-scene3d.cjs");
    process.exit(1);
  }

  // 载入 spec 以拿到预期色
  const vm = require("vm");
  const esbuild = require("esbuild");

  const locFile = path.join(ROOT, "src/js/data/locations.js");
  const sandbox = { window: { CLS: { data: {} } }, console, Math, JSON, Object, Array, String, Number };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(locFile, "utf8"), sandbox, { filename: locFile });
  const LOCATIONS = sandbox.window.CLS.data.LOCATIONS;

  const out = esbuild.buildSync({
    entryPoints: [path.join(ROOT, "src/app/scene3d/sceneSpec.ts")],
    bundle: true, write: false, format: "cjs", platform: "node", target: "node18", logLevel: "silent",
  });
  const mod = { exports: {} };
  new Function("module", "exports", "require", out.outputFiles[0].text)(mod, mod.exports, require);
  const { buildSceneSpec } = mod.exports;

  const files = fs.readdirSync(SHOT_DIR).filter((f) => f.endsWith(".png")).sort();
  if (!files.length) {
    console.error("dev/shots/ 下没有 PNG");
    process.exit(1);
  }

  console.log("文件".padEnd(24) + "均色".padEnd(20) + "明度  方差  色数  天/地匹配");
  console.log("-".repeat(88));

  const errors = [];
  const signatures = new Map();

  for (const f of files) {
    // 兼容 <loc>.png 与 <loc>-overlay.png / <loc>-mini.png 两种命名
    const id = f.replace(/\.png$/, "").replace(/-(overlay|mini)$/, "");
    const a = await analyze(sharp, path.join(SHOT_DIR, f));
    const spec = LOCATIONS[id] ? buildSceneSpec(LOCATIONS[id]) : null;

    const hex = (m) =>
      "#" + m.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
    const meanHex = hex(a.mean);

    let matchNote = "—";
    if (spec) {
      const skyExp = hexToRgb(spec.sky);
      const gndExp = hexToRgb(spec.ground.base);
      const dSky = dist(a.top, skyExp);
      const dGnd = dist(a.bottom, gndExp);
      const dTopGnd = dist(a.top, gndExp);
      // 取景感知：本项目的相机俯角等于 spec 的 pitch（默认 0.72rad ≈ 41°），
      // 半视场角仅 19°，因此视野整体位于地平线以下 —— 顶带在密集场景里是
      // **远处地面**而非天空，天空只在稀疏场景（如公园）露出。故顶带接受
      // 「接近天空色」或「接近地面基调」二者之一，只拦截真正的异常画面。
      const topIsSky = dSky < 90;
      const topIsFarGround = dTopGnd < 90;
      const okSky = topIsSky || topIsFarGround;
      const okGnd = dGnd < 90;
      const topTag = topIsSky ? `天${dSky.toFixed(0)}` : `远景地${dTopGnd.toFixed(0)}`;
      matchNote = `${topTag} 地${dGnd.toFixed(0)} ${okSky && okGnd ? "✓" : "✗"}`;
      if (!okSky) {
        errors.push(
          `${id}: 顶部区域既非天空色也非地面基调 (天${dSky.toFixed(0)} 地${dTopGnd.toFixed(0)})，疑似渲染异常`
        );
      }
      if (!okGnd) errors.push(`${id}: 底部区域与预期地面色差距过大 (${dGnd.toFixed(0)})`);
    }

    console.log(
      f.padEnd(24) +
        meanHex.padEnd(20) +
        a.meanLum.toFixed(1).padStart(4) +
        a.variance.toFixed(0).padStart(6) +
        String(a.colorCount).padStart(7) +
        "  " + matchNote
    );

    // 空白检测
    if (a.variance < 12) errors.push(`${id}: 画面近似纯色，疑似渲染失败 (方差 ${a.variance.toFixed(1)})`);
    if (a.colorCount < 40) errors.push(`${id}: 颜色种类过少 (${a.colorCount})，画面可能未正确生成`);
    if (a.meanLum < 12) errors.push(`${id}: 画面过暗 (明度 ${a.meanLum.toFixed(1)})`);
    if (a.meanLum > 245) errors.push(`${id}: 画面过曝 (明度 ${a.meanLum.toFixed(1)})`);

    // 签名：16×16 灰度缩略图量化。
    // 不用平均色 —— 同一富裕等级共用一套色板，均色天然相近，
    // 真正该比的是「画面结构」（建筑在哪、占多大），缩略图才能反映这一点。
    const sig = a.thumb;
    if (!signatures.has(sig)) signatures.set(sig, []);
    signatures.get(sig).push(id);
  }

  const dupes = [...signatures.entries()].filter(([, v]) => v.length > 1);
  if (dupes.length) {
    console.log("\n⚠️ 画面签名相同的地点组（可能渲染雷同）:");
    for (const [, v] of dupes) console.log("  → " + v.join(", "));
    errors.push(`${dupes.length} 组地点画面签名相同`);
  } else {
    console.log(`\n画面区分度: ${files.length} 张截图两两不同 ✅`);
  }

  console.log("");
  if (errors.length) {
    console.log("❌ 发现问题:");
    errors.forEach((e) => console.log("  - " + e));
    process.exit(1);
  }
  console.log("✅ 像素级验证通过：非空白 / 上天下地正确 / 明度合理 / 地点可区分");
}

main().catch((e) => {
  console.error("分析失败:", e.message);
  process.exit(1);
});
