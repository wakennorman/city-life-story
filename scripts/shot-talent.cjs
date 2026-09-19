#!/usr/bin/env node
/**
 * 天赋揭晓弹窗取证 —— 恒稳 2026-09-19 反馈「选天赋这里太黑了，看不清」。
 *
 * 做什么：
 *   1. 打开真实入口 src/index.html，等 3D 首屏挂好（`Scene3DBridge.first.active`）；
 *   2. 直接调 `window.startNewGame()` —— 它会同步弹出天赋揭晓弹窗；
 *   3. 读该弹窗的**计算样式**（卡片底色 / 标题色 / 描述色 / 按钮底色 / 遮罩）
 *      并算 WCAG 对比度，截图落盘。
 *
 * ★ 为什么必须测"计算样式"而不是只看截图：
 *   截图能看出"糊成一团"，但说不清是卡片太黑、遮罩太黑还是字太暗 ——
 *   三者修法完全不同。对比度是可断言的读数，截图是给人看的证据，两个都要。
 *
 * 用法：node scripts/shot-talent.cjs
 */

const path = require("path");
const fs = require("fs");
const puppeteer = require("puppeteer-core");
const { EDGE } = require("./_boot.cjs");
const { ensureServer, closeServer } = require("./lib/serve.cjs");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8893;
/* ★ 必须是 `/src/index.html`：ensureServer 的 root 是**仓库根**，
   写 `/index.html` 拿到的是仓库根那个（不是游戏入口），
   症状是"逻辑层永远不就绪"（typeof startNewGame === 'undefined'）——
   而且不报错，只是干等到超时。与 verify-3d-opening.cjs 保持同一个写法。 */
const URL = `http://127.0.0.1:${PORT}/src/index.html`;
const OUT = path.join(ROOT, "dev/_3dtest/shots-talent");
const VW = 1280, VH = 860;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* WCAG 相对亮度 & 对比度 */
function lum(rgb) {
  const c = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}
function ratio(a, b) {
  const la = lum(a), lb = lum(b);
  return +(((Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05))).toFixed(2);
}
/**
 * 从 `getComputedStyle().background` 里取一个**可用于对比度计算**的底色。
 *
 * ★ 为什么不能只取 `backgroundColor`：3D 皮肤给弹窗铺的是
 *   `linear-gradient(180deg, …)`（渐变落在 background-image 上），
 *   此时 backgroundColor 仍是 `rgba(0,0,0,0)`。拿它去算对比度，
 *   会得到"黑底 vs 深字 = 1.15:1"这种**假红** —— 这是我第一版的实测教训。
 * ★ 同理必须**跳过 alpha≈0 的颜色**：`background` 简写里第一个 rgba
 *   往往就是那个透明的 backgroundColor。
 * ★ 渐变取两端平均：按钮是金渐变，取哪一端都会偏差一档。
 */
function parseRGB(s) {
  if (!s) return null;
  const all = s.match(/rgba?\([^)]+\)/g) || [];
  const cols = [];
  for (const one of all) {
    const p = one.match(/rgba?\(([^)]+)\)/)[1].split(",").map((x) => parseFloat(x));
    const a = p.length > 3 ? p[3] : 1;
    if (!(a > 0.05)) continue;                    // 透明 → 不是真正的底色
    cols.push([p[0] || 0, p[1] || 0, p[2] || 0, a]);
  }
  if (!cols.length) return null;
  const n = cols.length;
  const avg = [0, 1, 2].map((i) => cols.reduce((t, c) => t + c[i], 0) / n);
  return avg;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const own = await ensureServer({ root: ROOT, port: PORT, label: "天赋弹窗取证" });
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage",
      "--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--use-gl=angle"],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: VW, height: VH, deviceScaleFactor: 1 });
  /* ★ 用 domcontentloaded，不用 networkidle2：src/ 下有上千个 js 文件，
     外部行情请求在离线环境还会挂到超时 —— networkidle2 会一直等不到，
     表现为"脚本卡死几十分钟"（实测踩过）。就绪判断交给下面的轮询。 */
  await page.goto(URL, { waitUntil: "domcontentloaded", timeout: 90000 });

  let booted = false;
  for (let i = 0; i < 200 && !booted; i++) {
    booted = await page.evaluate(() => typeof window.startNewGame === "function" && typeof window.showTalentRevealModal === "function");
    if (!booted) await sleep(500);
  }
  console.log("逻辑层就绪：", booted);
  let mounted = false;
  for (let i = 0; i < 160 && !mounted; i++) {
    mounted = await page.evaluate(() => !!(window.Scene3DBridge && window.Scene3DBridge.first && window.Scene3DBridge.first.active));
    if (!mounted) await sleep(500);
  }
  console.log("3D 首屏挂载：", mounted);

  /* 天赋是随机抽的（10% 无天赋），为了**稳定重现**，直接传一组双天赋进去
     —— 取证脚本不该靠运气抽到想看的那一屏。 */
  const picked = await page.evaluate(() => {
    const sc = (typeof getScenarioById === "function") ? getScenarioById("classic") : null;
    const pool = (sc && sc.talents) || [];
    /* ★ 三种稀有度各取一个，而不是随便抽两个：
       取证脚本要覆盖的是**配色**，抽到两个同色等于没测到另外两支。 */
    const byR = {};
    for (const t of pool) if (!byR[t.rarity]) byR[t.rarity] = t;
    const picked = ["rare", "uncommon", "common"].map((r) => byR[r]).filter(Boolean);
    if (picked.length && typeof showTalentRevealModal === "function") {
      showTalentRevealModal(picked, () => {}, () => {});
    }
    return picked.map((t) => t.rarity + ":" + t.name);
  });
  console.log("注入天赋：", picked.join(" / ") || "（池为空）");
  await page.waitForSelector("#_talent_accept, #_talent_ok", { timeout: 15000 });
  await sleep(900);

  const info = await page.evaluate(() => {
    const gcs = (el) => el ? getComputedStyle(el) : null;
    const btn = document.querySelector("#_talent_accept") || document.querySelector("#_talent_ok");
    const card = btn ? btn.closest(".talent-reveal-card") : null;
    const overlay = card ? card.closest(".talent-reveal-overlay") : null;
    const title = card ? card.querySelector("div") : null;
    const desc = card ? card.querySelector('[style*="text-secondary"]') : null;
    const tag = card ? card.querySelector('span[style*="rarity"]') : null;
    return {
      bodyClass: document.body.className,
      overlayBg: overlay ? gcs(overlay).background.slice(0, 120) : null,
      overlayZ: overlay ? gcs(overlay).zIndex : null,
      cardBg: card ? gcs(card).background : null,
      cardBorder: card ? gcs(card).borderTopWidth + " " + gcs(card).borderTopColor : null,
      cardCls: card ? card.className : null,
      titleColor: title ? gcs(title).color : null,
      descColor: desc ? gcs(desc).color : null,
      tagColor: tag ? gcs(tag).color : null,
      btnBg: btn ? gcs(btn).background.slice(0, 120) : null,
      btnColor: btn ? gcs(btn).color : null,
      talentCount: card ? card.querySelectorAll('[style*="rarity"]').length : 0,
    };
  });

  console.log("\n── 计算样式 ──");
  for (const [k, v] of Object.entries(info)) console.log(`  ${k.padEnd(12)} ${v}`);

  const cardRGB = parseRGB(info.cardBg);
  console.log("\n── 对比度（WCAG，正文需 ≥4.5，大字/标题需 ≥3）──");
  const pairs = [
    ["标题文字 / 卡片底", info.titleColor, info.cardBg, 3],
    ["描述文字 / 卡片底", info.descColor, info.cardBg, 4.5],
    ["稀有度标签 / 卡片底", info.tagColor, info.cardBg, 4.5],
    ["按钮文字 / 按钮底", info.btnColor, info.btnBg, 4.5],
  ];
  let bad = 0;
  for (const [name, fg, bg, need] of pairs) {
    const f = parseRGB(fg), b = parseRGB(bg);
    if (!f || !b) { console.log(`  ${name}: 取不到颜色（fg=${fg} bg=${bg}）`); continue; }
    const r = ratio(f, b);
    const ok = r >= need;
    if (!ok) bad++;
    console.log(`  ${ok ? "✅" : "❌"} ${name.padEnd(20)} ${r}:1  (需 ≥${need})`);
  }

  const shot = path.join(OUT, "talent-reveal.png");
  await page.screenshot({ path: shot });
  console.log(`\n截图：${shot}`);
  console.log(bad === 0 ? "✅ 全部达标" : `❌ ${bad} 项不达标`);

  await browser.close();
  if (own) closeServer();
})().catch((e) => { console.error(e); process.exit(1); });
