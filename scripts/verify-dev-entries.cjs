/**
 * 本地预览服务入口验证
 *
 * 为什么要固化成脚本：恒稳报过一次「404 not found: dev/_3dtest/shell.html」，
 * 排查发现**不是路径问题，是连错了服务** —— 旧启动器的服务根是 experiments/3d，
 * 在那种服务上请求本仓库的路径必然 404。这类故障的特征是：
 *   **服务本身没坏、路径也没错，坏的是「你连的是哪个服务」**，
 * 所以靠读代码看不出来，必须有一个「从外部打请求」的检查。
 *
 * 本脚本验证四件事：
 *   ① /__ping 返回约定的正文（启动器靠它区分「本服务」与「别的程序」）
 *   ② 短别名 /s /g /d 都能命中，且 /s 返回的确实是外壳页
 *   ③ 别名带污染尾巴（`/s）`）也能命中 —— 聊天窗口会吞字符
 *   ④ 不存在的路径给的是**诊断页**（含「本服务的根」），不是死胡同
 *
 * ★ 必须起 scripts/serve-dev.cjs 本身来测，不能用 scripts/lib/serve.cjs ——
 *   后者是给验证脚本用的**通用静态服务**，没有 /__ping 也没有短别名，
 *   拿它测会得到"全 404"的假失败（这个坑本脚本第一次就踩了）。
 *
 * 用法：node scripts/verify-dev-entries.cjs
 * 自给自足：端口无服务时自动起一个（结束关闭）。
 */

const path = require("path");
const http = require("http");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8976; // 避开 start-3d-shell 用的 8977~8980
const PING_BODY = "serve-dev-ok";

let pass = 0;
let fail = 0;
function check(name, ok, detail) {
  if (ok) { pass++; console.log(`  ✅ ${name}${detail ? "  → " + detail : ""}`); }
  else { fail++; console.log(`  ❌ ${name}${detail ? "  → " + detail : ""}`); }
}

function get(p) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port: PORT, path: encodeURI(p) }, (res) => {
      let b = "";
      res.on("data", (c) => (b += c));
      res.on("end", () => resolve({ code: res.statusCode, body: b }));
    });
    req.on("error", (e) => resolve({ code: "ERR", body: e.code || String(e) }));
    req.setTimeout(5000, () => { req.destroy(); resolve({ code: "TIMEOUT", body: "" }); });
  });
}

async function isOurServer() {
  const r = await get("/__ping");
  return r.code === 200 && r.body.trim() === PING_BODY;
}

/** 起被测服务；若该端口已是本服务则复用（返回 null 表示"不是我起的"） */
async function startDevServer() {
  if (await isOurServer()) return null;
  const child = spawn(process.execPath, [path.join(__dirname, "serve-dev.cjs"), String(PORT)], {
    cwd: ROOT, stdio: "ignore", windowsHide: true,
  });
  const t0 = Date.now();
  while (Date.now() - t0 < 8000) {
    if (await isOurServer()) return child;
    await new Promise((r) => setTimeout(r, 250));
  }
  try { child.kill(); } catch { /* ignore */ }
  throw new Error(`serve-dev.cjs 未在 8 秒内就绪（端口 ${PORT}）`);
}

(async () => {
  const child = await startDevServer();
  console.log(`\n=== 本地预览服务入口验证 ===（端口 ${PORT}${child ? "，脚本自起" : "，复用已有"}）\n`);

  console.log("① 服务身份");
  const ping = await get("/__ping");
  check("/__ping 返回约定正文", ping.code === 200 && ping.body.trim() === PING_BODY,
    `status=${ping.code} body=${JSON.stringify(ping.body.slice(0, 20))}`);

  console.log("\n② 短别名（聊天窗口里出现的 URL 越短越不易被弄坏）");
  const s = await get("/s");
  check("/s 命中 3D 外壳页", s.code === 200 && s.body.includes("3D-first 外壳预览"),
    `status=${s.code}`);
  for (const [p, label] of [["/g", "地点画廊"], ["/d", "正式游戏"], ["/shell", "外壳长别名"]]) {
    const r = await get(p);
    check(`${p} 命中（${label}）`, r.code === 200, `status=${r.code}`);
  }

  console.log("\n③ 别名污染容错（`**` `）` `` ` `` `。` 是聊天窗口常见的吞字符形态）");
  for (const bad of ["/s）", "/s**", "/s`）", "/s。"]) {
    const r = await get(bad);
    check(`${bad} 仍命中外壳页`, r.code === 200 && r.body.includes("3D-first 外壳预览"),
      `status=${r.code}`);
  }

  console.log("\n④ 诊断型 404");
  const nf = await get("/definitely-not-here");
  check("不存在路径返回 404", nf.code === 404, `status=${nf.code}`);
  check("诊断页印出「本服务的根」", nf.body.includes("本服务的根"));
  check("诊断页给出短入口", nf.body.includes("/s"));

  console.log(`\n════ 结果: ${pass} 通过 / ${fail} 失败 ════\n`);

  if (child) { try { child.kill(); } catch { /* ignore */ } }
  process.exit(fail === 0 ? 0 : 1);
})().catch((e) => {
  console.error("验证脚本自身出错:", e && e.message);
  process.exit(1);
});
