/**
 * script_manifest.cjs — 脚本加载清单单一真相源（P0-4）
 *
 * 根除 headless_runner.cjs::getScriptOrder() 的「手抄副本漂移」问题：
 * 该函数曾手工维护 index.html 的 <script src> 列表，已漂移缺失 ~40 个文件
 * （trigger_registry / *_linkage_events* / cross_system_events_part1..8 等），
 * 使无头测试的事件池与真实浏览器加载不一致——这本身就是「语法正确却静默
 * 失效」的温床。
 *
 * 此模块直接正则解析 src/index.html 的 <script src="..."> 出现序，作为唯一
 * 权威加载顺序。build.py 也用相同顺序串接 dist/app.js，故三方（浏览器 /
 * 构建产物 / 测试）始终一致。
 */

const fs = require("fs");
const path = require("path");

/** 定位 city-life-story/src 目录（从本文件位置稳健推断） */
function resolveSrcDir(explicit) {
  if (explicit) return explicit;
  // tests/lib/script_manifest.cjs → ../../src
  return path.join(__dirname, "..", "..", "src");
}

/**
 * 解析 index.html，返回 <script src> 的相对路径有序数组。
 * 与 build.py 的 bundle_js 正则保持一致：<script\s+src="([^"]+)"[^>]*></script>
 * @param {string} [srcDir] 可选，src 目录绝对路径
 * @returns {string[]} 形如 ["js/core/random.js", ...]，按 index.html 出现序
 */
function getScriptManifest(srcDir) {
  var dir = resolveSrcDir(srcDir);
  var indexPath = path.join(dir, "index.html");
  var html = fs.readFileSync(indexPath, "utf8");
  var re = /<script\s+src="([^"]+)"[^>]*><\/script>/g;
  var scripts = [];
  var m;
  while ((m = re.exec(html)) !== null) {
    scripts.push(m[1]);
  }
  return scripts;
}

module.exports = { getScriptManifest: getScriptManifest, resolveSrcDir: resolveSrcDir };
