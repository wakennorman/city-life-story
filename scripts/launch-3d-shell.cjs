/**
 * 3D-first 外壳启动器（逻辑层）
 *
 * ── 为什么把逻辑从 .bat 挪到 node ────────────────────────────────────────
 * 这段逻辑要做三件事：端口探测 → **校验服务身份** → 等服务就绪再开浏览器。
 * 写在 .bat 里需要 `for /f` 捕获 curl 输出、`netstat | findstr`、延迟展开
 * 三样技巧叠在一起 —— 而且**无法被自动化测试**，写错了只能靠人双击才发现。
 * 挪到 node 后，同一段逻辑可以用探针脚本回归验证。
 * .bat 退化成「找 node → 调用本文件」，语法降到最低。
 *
 * ── 为什么必须校验服务身份（这是恒稳报 404 的真因）──────────────────────
 * 旧启动器只探测「端口有没有应答」，**任何程序应答都算服务已在跑**，
 * 于是直接开浏览器。可旧启动器 start-3d.bat 的服务根是 experiments/3d，
 * 在那种服务上请求 dev/_3dtest/shell.html 必然 404 ——
 * **路径本身没错，是连错了服务。**
 * 现在用 /__ping 确认应答的确实是本服务；不是我们的就换端口，绝不复用。
 *
 * 用法：
 *   node scripts/launch-3d-shell.cjs                # 起服务 + 开浏览器
 *   node scripts/launch-3d-shell.cjs --no-browser   # 只起服务（供测试用）
 */

const { spawn, spawnSync } = require("child_process");
const path = require("path");
const http = require("http");

const ROOT = path.resolve(__dirname, "..");
const PING_BODY = "serve-dev-ok";
const PORTS = [8977, 8978, 8979, 8980];
const OPEN_PATH = "/s";

/** 该端口上是不是**我们的**服务（不是"有没有人应答"） */
function isOurServer(port, timeout = 900) {
  return new Promise((resolve) => {
    const req = http.get({ host: "127.0.0.1", port, path: "/__ping", timeout }, (res) => {
      let b = "";
      res.on("data", (c) => (b += c));
      res.on("end", () => resolve(res.statusCode === 200 && b.trim() === PING_BODY));
    });
    req.on("error", () => resolve(false));
    req.on("timeout", () => { req.destroy(); resolve(false); });
  });
}

/** 端口是否被**别的程序**监听着（那种端口不能用，会连错服务） */
function isPortBusy(port) {
  const r = spawnSync("netstat", ["-ano"], { encoding: "utf8", windowsHide: true });
  if (!r || r.status !== 0 || !r.stdout) return false;
  return r.stdout
    .split(/\r?\n/)
    .some((l) => l.includes(`127.0.0.1:${port} `) && l.includes("LISTENING"));
}

async function waitReady(port, ms = 8000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    if (await isOurServer(port, 400)) return true;
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

/** 用系统默认浏览器打开。
 *  主用 `cmd /c start "" <url>` —— Windows 上打开 URL 的标准做法
 *  （start 的第一个引号参数是窗口标题，所以用空串占位）。
 *  explorer.exe 作兜底：它对 http URL 会交给默认浏览器，
 *  但某些系统上会先弹一个文件管理器窗口。 */
function openBrowser(url) {
  const attempts = [
    ["cmd", ["/c", "start", "", url]],
    ["explorer.exe", [url]],
  ];
  for (const [cmd, args] of attempts) {
    try {
      spawn(cmd, args, { detached: true, stdio: "ignore", windowsHide: true }).unref();
      return true;
    } catch { /* 换下一种 */ }
  }
  return false;
}

(async () => {
  const noBrowser = process.argv.includes("--no-browser");

  let chosen = null;
  let reuse = false;
  for (const p of PORTS) {
    if (await isOurServer(p)) { chosen = p; reuse = true; break; }
    if (!isPortBusy(p)) { chosen = p; reuse = false; break; }
  }

  if (!chosen) {
    console.error(`[ERROR] ${PORTS.join(" / ")} 都被占用，且没有一个是本服务。`);
    console.error(`        手动指定一个空闲端口： node scripts/serve-dev.cjs 9100`);
    process.exit(1);
  }

  console.log(`  端口 : ${chosen}${reuse ? "（复用已在运行的本服务）" : "（空闲，启动新服务）"}`);

  if (!reuse) {
    const child = spawn(
      process.execPath,
      [path.join(ROOT, "scripts", "serve-dev.cjs"), String(chosen)],
      { cwd: ROOT, detached: true, stdio: "ignore" },
    );
    child.unref();
    if (!(await waitReady(chosen))) {
      console.error("[ERROR] 服务启动后 8 秒内未就绪。");
      console.error(`        手动排查： node scripts/serve-dev.cjs ${chosen}`);
      process.exit(1);
    }
    console.log("  服务 : 已就绪");
  }

  const base = `http://127.0.0.1:${chosen}`;
  console.log("");
  console.log(`  3D 外壳  : ${base}${OPEN_PATH}`);
  console.log(`  地点画廊 : ${base}/g`);
  console.log(`  正式游戏 : ${base}/d`);
  console.log(`  全部入口 : ${base}/`);
  console.log("");

  if (noBrowser) {
    console.log("  （--no-browser：只起服务，不打开浏览器）");
    return;
  }
  console.log(openBrowser(`${base}${OPEN_PATH}`) ? "  已打开浏览器。" : `  请手动打开：${base}${OPEN_PATH}`);
})();
