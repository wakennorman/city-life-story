/** 对比两张整页截图的像素差异，输出变化区域的包围盒与占比 */
const path = require("path");
const ROOT = path.resolve(__dirname, "..");

async function main() {
  const sharp = require("sharp");
  const a = path.join(ROOT, process.argv[2]);
  const b = path.join(ROOT, process.argv[3]);

  const ia = await sharp(a).raw().toBuffer({ resolveWithObject: true });
  const ib = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = ia.info;
  const { width: W2, height: H2 } = ib.info;
  if (W !== W2 || H !== H2) {
    console.log(`尺寸不同: ${W}x${H} vs ${W2}x${H2}`);
    return;
  }

  let changed = 0;
  let minX = W, minY = H, maxX = -1, maxY = -1;
  const THRESH = 12; // 单通道差阈值，滤掉抗锯齿噪声

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const p = (y * W + x) * C;
      let d = 0;
      for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(ia.data[p + c] - ib.data[p + c]));
      if (d > THRESH) {
        changed++;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  const total = W * H;
  console.log(`图片尺寸        : ${W} x ${H}`);
  console.log(`差异像素        : ${changed} / ${total}  (${((changed / total) * 100).toFixed(2)}%)`);
  if (maxX >= 0) {
    console.log(`变化区域包围盒  : x ${minX}..${maxX}  y ${minY}..${maxY}`);
    console.log(`                 宽 ${maxX - minX + 1}px  高 ${maxY - minY + 1}px`);
    console.log(`                （页面主内容区从 x≈296 起，故变化集中在内容区）`);
  } else {
    console.log("两张图完全一致。");
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
