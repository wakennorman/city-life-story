const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const ICONS_DIR = path.resolve(__dirname, "..", "assets/icons");
const PNG_DIR = path.join(ICONS_DIR, "png");

if (!fs.existsSync(PNG_DIR)) fs.mkdirSync(PNG_DIR, { recursive: true });

const tasks = [
  // 小程序主动图标
  { src: "icon-app.svg", name: "app.png", size: 1024 },
  { src: "icon-app.svg", name: "app-180.png", size: 180 },
  { src: "icon-app-simple.svg", name: "app-simple.png", size: 1024 },
  { src: "icon-app-simple.svg", name: "app-simple-180.png", size: 180 },
  { src: "icon-app-simple.svg", name: "app-simple-512.png", size: 512 },

  // 启动页
  { src: "icon-splash.svg", name: "splash.png", size: 750, height: 1334 },

  // Tab 图标（未选中 = 灰色描边）
  { src: "icon-tab-home.svg", name: "tab-home.png", size: 81 },
  { src: "icon-tab-explore.svg", name: "tab-explore.png", size: 81 },
  { src: "icon-tab-shop.svg", name: "tab-shop.png", size: 81 },
  { src: "icon-tab-profile.svg", name: "tab-profile.png", size: 81 },
  { src: "icon-tab-job.svg", name: "tab-job.png", size: 81 },
  { src: "icon-tab-news.svg", name: "tab-news.png", size: 81 },
  { src: "icon-tab-achievement.svg", name: "tab-achievement.png", size: 81 },

  // Tab 图标（选中 = 品牌绿填充 — 使用彩色版本）
  { src: "icon-tab-home.svg", name: "tab-home-active.png", size: 81 },
  { src: "icon-tab-explore.svg", name: "tab-explore-active.png", size: 81 },
  { src: "icon-tab-shop.svg", name: "tab-shop-active.png", size: 81 },
  { src: "icon-tab-profile.svg", name: "tab-profile-active.png", size: 81 },
  { src: "icon-tab-job.svg", name: "tab-job-active.png", size: 81 },
  { src: "icon-tab-news.svg", name: "tab-news-active.png", size: 81 },
  {
    src: "icon-tab-achievement.svg",
    name: "tab-achievement-active.png",
    size: 81,
  },

  // 导航栏图标
  { src: "icon-nav-back.svg", name: "nav-back.png", size: 54 },
  { src: "icon-nav-close.svg", name: "nav-close.png", size: 54 },

  // Favicon — 写到项目根目录
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "favicon.png"),
    size: 32,
  },
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "favicon-16.png"),
    size: 16,
  },
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "favicon-32.png"),
    size: 32,
  },
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "favicon-64.png"),
    size: 64,
  },
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "favicon-128.png"),
    size: 128,
  },
  {
    src: "icon-app-simple.svg",
    name: path.resolve(__dirname, "..", "apple-touch-icon.png"),
    size: 180,
  },
];

let done = 0,
  failed = 0;

async function run() {
  for (const t of tasks) {
    const srcPath = path.join(ICONS_DIR, t.src);
    const outPath = path.resolve(PNG_DIR, t.name);

    try {
      const svgBuf = fs.readFileSync(srcPath);
      let pipeline = sharp(svgBuf).resize(t.size, t.height || t.size, {
        fit: "contain",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      });
      await pipeline.png().toFile(outPath);
      console.log(`✅ ${t.name.padEnd(32)} ${t.size}×${t.height || t.size}`);
      done++;
    } catch (err) {
      console.error(`❌ ${t.name.padEnd(32)} ${err.message}`);
      failed++;
    }
  }
  console.log(`\n📊 完成: ${done}, 失败: ${failed}`);
}

run();
