/**
 * 截图有效性校验
 *
 * 为什么要它：当前环境无法直接"看图"，如果不做程序化校验，
 * 截图可能是纯色/空白而截图脚本照样报成功 —— 那截图就不能当证据用。
 *
 * ★ 判据选择（踩过）：最初用"颜色数 > 500"判定，结果把 3D 场景全判成无效。
 *   原因是本项目 3D 走**晦暗降饱和**调（天空 0x59615a + 雾），压缩后量化色
 *   只有 400~470 种 —— 颜色少是**设计使然**，不是空白。
 *   正确判据是"不是纯色/空白"，即：
 *     σ(亮度标准差) 足够大   → 有真实结构
 *     去重色数 > 30          → 不是单色
 *     主色占比 < 85%         → 不是大面积纯色填充
 */
const fs = require("fs");
const path = require("path");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const DIR = path.resolve(__dirname, "..", "dev", "_3dtest", "shots-ingame");
const PORT = 8961;

(async () => {
  const pngs = fs.readdirSync(DIR).filter((f) => f.endsWith(".png")).sort();
  if (!pngs.length) throw new Error("没有截图可校验：" + DIR);

  const ownServer = await ensureServer({ root: DIR, port: PORT, label: "截图校验" });

  const puppeteer = require("puppeteer-core");
  const browser = await puppeteer.launch({
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    headless: "new", args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  // 必须先让页面落在与图片同源的地址上，否则 canvas 被跨源图片污染，getImageData 会抛 SecurityError
  await page.goto(`http://127.0.0.1:${PORT}/${encodeURIComponent(pngs[0])}`, { waitUntil: "load", timeout: 30000 });

  let bad = 0;
  for (const f of pngs) {
    const r = await page.evaluate(async (url) => {
      const img = new Image();
      img.src = url;
      await img.decode();
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const x = c.getContext("2d");
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, c.width, c.height).data;
      const hist = new Map();
      let sum = 0, sum2 = 0, n = 0;
      for (let i = 0; i < d.length; i += 4) {
        const key = (d[i] >> 3 << 10) | (d[i + 1] >> 3 << 5) | (d[i + 2] >> 3);
        hist.set(key, (hist.get(key) || 0) + 1);
        const l = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        sum += l; sum2 += l * l; n++;
      }
      const mean = sum / n;
      const top = Math.max(...hist.values());
      return {
        w: img.width, h: img.height, colors: hist.size,
        mean: Number(mean.toFixed(1)),
        std: Number(Math.sqrt(sum2 / n - mean * mean).toFixed(1)),
        topShare: Number(((top / n) * 100).toFixed(1)),
      };
    }, `http://127.0.0.1:${PORT}/${encodeURIComponent(f)}`);

    // 不是纯色/空白 ⇒ 有效。见文件头「判据选择」说明为什么不用颜色数阈值。
    const ok = r.std > 15 && r.colors > 30 && r.topShare < 85;
    if (!ok) bad++;
    const why = r.topShare >= 85 ? "大面积纯色" : r.std <= 15 ? "无对比度" : "颜色过少";
    const verdict = ok ? "✅ 有效画面" : "❌ " + why;
    const pad = f.length < 24 ? f + " ".repeat(24 - f.length) : f;
    console.log(`${verdict}  ${pad} ${r.w}x${r.h}  色数=${r.colors}  亮度=${r.mean}  σ=${r.std}  主色占比=${r.topShare}%`);
  }

  console.log(bad ? `\n❌ ${bad}/${pngs.length} 张截图不可信` : `\n✅ ${pngs.length} 张截图均为有效画面（非纯色/空白）`);
  await browser.close();
  await closeServer(ownServer);
  process.exit(bad ? 1 : 0);
})().catch((e) => { console.error(e); process.exit(1); });
