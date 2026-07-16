#!/usr/bin/env node
/**
 * verify-deploy.mjs — 部署一致性校验
 *
 * 防止 "build 产物目录 ≠ Netlify publish 目录" 的错配再次发生。
 * 在 `npm run build` 末尾自动调用；也可独立 `node scripts/verify-deploy.mjs`。
 *
 * 本项目有两套构建：
 *   - build.py (legacy) → dist/index.html（单文件，Netlify 实际发布）
 *   - vite (webapp)    → dist-webapp/（TS 迁移壳，重定向到 legacy）
 *
 * Netlify 发布的是 dist/，所以校验焦点在 dist/index.html。
 *
 * 校验项：
 *   1. netlify.toml 的 publish 必须是 dist
 *   2. dist/index.html 必须存在且非空
 *   3. dist/index.html 必须包含游戏入口标志（防止 src 没被正确打包）
 *   4. dist/index.html 大小合理（> 1MB，过小说明打包失败）
 */

import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

let failures = 0;
function check(label, ok, failDetail = "", okDetail = "") {
  const mark = ok ? "✅" : "❌";
  const detail = ok ? okDetail : failDetail;
  console.log(`  ${mark} ${label}${detail ? " — " + detail : ""}`);
  if (!ok) failures++;
}

function readConfigValue(toml, key) {
  const re = new RegExp(`^\\s*${key}\\s*=\\s*"([^"]+)"`, "m");
  const m = toml.match(re);
  return m ? m[1].replace(/\\/g, "/") : null;
}

// ── 1. 读取 netlify.toml ─────────────────────────────────────────
const netlifyPath = join(ROOT, "netlify.toml");
const netlify = readFileSync(netlifyPath, "utf8");

const publish = readConfigValue(netlify, "publish");
const command = readConfigValue(netlify, "command");

console.log("\n📦 部署一致性校验\n");
console.log(`   netlify command  = ${command ?? "(未找到)"}`);
console.log(`   netlify publish  = ${publish ?? "(未找到)"}\n`);

// ── 2. publish 必须是 dist ───────────────────────────────────────
check(
  "publish 目录是 dist",
  publish === "dist",
  publish !== "dist" ? `"${publish}" 不是 dist` : "一致",
);

// ── 3. 构建产物必须存在且合理 ────────────────────────────────────
// P0-1 起：游戏逻辑外部化到 dist/app.js（defer 加载），index.html 仅为
// 瘦身壳。故渲染标记 / 体积断言目标从 index.html 迁到 app.js。
const distIndexAbs = join(ROOT, "dist", "index.html");
const distAppAbs = join(ROOT, "dist", "app.js");

check(
  "dist/index.html 存在",
  existsSync(distIndexAbs),
  existsSync(distIndexAbs)
    ? `${(statSync(distIndexAbs).size / 1024 / 1024).toFixed(2)} MB`
    : `${distIndexAbs} 不存在 — 运行 npm run build:legacy`,
);

check(
  "dist/app.js 存在",
  existsSync(distAppAbs),
  existsSync(distAppAbs)
    ? `${(statSync(distAppAbs).size / 1024 / 1024).toFixed(2)} MB`
    : `${distAppAbs} 不存在 — 运行 npm run build:legacy`,
);

if (existsSync(distIndexAbs)) {
  const html = readFileSync(distIndexAbs, "utf8");
  check("index.html 非空", html.length > 100, `${html.length} 字节`);
  check(
    "index.html 引用 defer app.js",
    /<script[^>]+defer[^>]+src="app\.js"|<script[^>]+src="app\.js"[^>]+defer/i.test(
      html,
    ),
    "未找到 <script defer src=\"app.js\"> — 外部化可能异常",
  );
}

if (existsSync(distAppAbs)) {
  const app = readFileSync(distAppAbs, "utf8");
  const sizeMB = (app.length / 1024 / 1024).toFixed(2);
  check(
    "app.js 大小合理（> 1MB）",
    app.length > 1024 * 1024,
    `${sizeMB} MB — 过小可能打包失败`,
    `${sizeMB} MB`,
  );
  check(
    "包含游戏入口标志",
    /renderTimeSlot|initGame|_gameState|城市浮生记/i.test(app),
    "未找到游戏入口标志 — 构建可能异常",
  );
  check(
    "包含移动端顶栏代码",
    /renderTitleBar|renderStatsStrip/i.test(app),
    "未找到移动端代码 — 可能未在 build 前提交 src/ 改动",
  );
}

// ── 4. 结论 ──────────────────────────────────────────────────────
console.log("");
if (failures > 0) {
  console.error(`❌ 部署校验失败（${failures} 项）。请修复后再 push。\n`);
  process.exit(1);
} else {
  console.log(
    "✅ 部署校验通过。build 产物与 Netlify publish 一致，移动端代码已包含。\n",
  );
}
