/**
 * 构建 scene3d 预览页（开发工具）
 *
 * 做两件事：
 *   1. 用 vm 从 src/js/data/locations.js 取出真实 LOCATIONS，序列化后注入
 *      —— 保证预览用的就是游戏真实数据，不是另抄一份
 *   2. esbuild 打包预览入口（含 three），产出单文件 JS + HTML
 *
 * 产物写入 dev/，不参与正式构建。
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "dev");

function loadLocations() {
  const file = path.join(ROOT, "src/js/data/locations.js");
  const src = fs.readFileSync(file, "utf8");
  const sandbox = { window: { CLS: { data: {} } }, console, Math, JSON, Object, Array, String, Number };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: file });
  return sandbox.window.CLS.data.LOCATIONS;
}

/**
 * 抽取职业元数据（id → 名称）。
 * 旧版 locations.js 的 jobs 只有 id，中文名在 jobs.js 里，
 * 这里用沙箱跑一遍 jobs.js，再借 window.getJobById 逐个取值。
 */
function loadJobMeta(LOCATIONS) {
  const file = path.join(ROOT, "src/js/data/jobs.js");
  const src = fs.readFileSync(file, "utf8");
  const sandbox = {
    window: { CLS: { data: {} } },
    console,
    Math,
    JSON,
    Object,
    Array,
    String,
    Number,
  };
  vm.createContext(sandbox);
  try {
    vm.runInContext(src, sandbox, { filename: file });
  } catch (e) {
    console.warn("jobs.js 执行告警:", e.message);
  }

  const getJobById = sandbox.window.getJobById;
  const ids = new Set();
  for (const loc of Object.values(LOCATIONS)) {
    for (const j of loc.jobs || []) ids.add(j);
  }

  const meta = [];
  for (const id of ids) {
    let name = id;
    let apCost = 0;
    try {
      const job = getJobById ? getJobById(id) : null;
      if (job) {
        name = job.name || id;
        // 旧数据无 apCost 字段，用疲劳消耗折算一个近似值（每 10 点疲劳约 1 AP）
        const fatigue = job.effects && job.effects.fatigue;
        if (typeof fatigue === "number") apCost = Math.max(1, Math.round(fatigue / 2));
      }
    } catch {
      /* 取不到就保留 id 作名称 */
    }
    meta.push({ id, name, apCost });
  }
  return meta;
}

/**
 * 从新版 TS 地点数据抽取 availableActions。
 * 旧版 jobs 只覆盖 21 个地点，TS 侧的 availableActions 补上了
 * gov_office / library / park 等 8 个空白地点，两源合并才能全覆盖。
 */
function loadTsActions() {
  const file = path.join(ROOT, "src/app/data/locations/index.ts");
  if (!fs.existsSync(file)) return {};
  const src = fs.readFileSync(file, "utf8");
  const map = {};
  const re =
    /id:\s*"([a-zA-Z_]+)",\s*\n\s*name:\s*"([^"]+)"[\s\S]*?availableActions:\s*\[([\s\S]*?)\]/g;
  let m;
  while ((m = re.exec(src))) {
    const locId = m[1];
    const body = m[3];
    const acts = [];
    const are =
      /id:\s*"([a-zA-Z_]+)",\s*name:\s*"([^"]+)",\s*apCost:\s*(\d+)/g;
    let a;
    while ((a = are.exec(body))) {
      acts.push({ id: a[1], name: a[2], apCost: Number(a[3]) });
    }
    if (acts.length) map[locId] = acts;
  }
  return map;
}

/** 合并两源，产出「地点 id → 行动列表」 */
function buildActionsByLocation(LOCATIONS, TS_ACTIONS, JOB_META) {
  const jobMap = new Map(JOB_META.map((j) => [j.id, j]));
  const out = {};
  for (const [id, loc] of Object.entries(LOCATIONS)) {
    const merged = [];
    const seen = new Set();

    for (const a of TS_ACTIONS[id] || []) {
      if (seen.has(a.id)) continue;
      seen.add(a.id);
      merged.push(a);
    }
    for (const jobId of loc.jobs || []) {
      if (seen.has(jobId)) continue;
      seen.add(jobId);
      const meta = jobMap.get(jobId);
      merged.push(meta ? { ...meta } : { id: jobId, name: jobId, apCost: 0 });
    }
    if (merged.length) out[id] = merged;
  }
  return out;
}

const LOCATIONS = loadLocations();
const TS_ACTIONS = loadTsActions();
const JOB_META = loadJobMeta(LOCATIONS);
const ACTIONS_BY_LOCATION = buildActionsByLocation(LOCATIONS, TS_ACTIONS, JOB_META);

const covered = Object.keys(ACTIONS_BY_LOCATION).length;
const uncovered = Object.keys(LOCATIONS).filter((id) => !ACTIONS_BY_LOCATION[id]);
console.log(
  `载入地点 ${Object.keys(LOCATIONS).length} 个 / 职业元数据 ${JOB_META.length} 条 / ` +
    `行动覆盖 ${covered} 个地点`
);
if (uncovered.length) {
  console.log("尚无行动配置的地点（场景仍可用，只是无热点）: " + uncovered.join(", "));
}

const result = esbuild.buildSync({
  entryPoints: [path.join(OUT_DIR, "scene3d-preview.entry.ts")],
  bundle: true,
  write: false,
  format: "iife",
  platform: "browser",
  target: "es2020",
  minify: false,
  sourcemap: false,
  logLevel: "warning",
  define: {
    LOCATIONS: JSON.stringify(LOCATIONS),
    JOB_META: JSON.stringify(JOB_META),
    ACTIONS_BY_LOCATION: JSON.stringify(ACTIONS_BY_LOCATION),
  },
});

const js = result.outputFiles[0].text;
fs.writeFileSync(path.join(OUT_DIR, "scene3d-preview.js"), js, "utf8");

const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<title>scene3d 预览</title>
<style>
  html, body { margin: 0; height: 100%; background: #d9d4c8; }
  #wrap { display: flex; flex-direction: column; height: 100%; }
  #status {
    flex: 0 0 auto; padding: 8px 14px;
    font: 500 13px/1.4 system-ui, -apple-system, "Segoe UI", sans-serif;
    color: #4a3f30; background: #f6f2e8; border-bottom: 1px solid #cfc7b6;
  }
  #app { flex: 1 1 auto; position: relative; min-height: 0; }
</style>
</head>
<body>
<div id="wrap">
  <div id="status">加载中…</div>
  <div id="app"></div>
</div>
<script src="./scene3d-preview.js"></script>
</body>
</html>`;

fs.writeFileSync(path.join(OUT_DIR, "scene3d-preview.html"), html, "utf8");

const kb = (js.length / 1024).toFixed(0);
console.log(`已产出 dev/scene3d-preview.html + scene3d-preview.js (${kb} KB)`);
