/**
 * scene3d 场景推导层验证
 *
 * 验证目标：
 *   1. 全部 29 个游戏地点都能生成合法 SceneSpec（不抛错、无 NaN）
 *   2. 9 种 type 全覆盖，无地点落进兜底分支
 *   3. 同一 id 两次生成结果完全一致（seed 稳定性 —— 保证每次进场景不变样）
 *   4. 每个场景都有建筑、有地面、相机参数在合理区间
 *   5. 富裕等级确实产生了差异（不能三档长得一样）
 *
 * 纯数据层测试，不加载 three。
 */

const fs = require("fs");
const path = require("path");
const vm = require("vm");
const assert = require("assert");
const esbuild = require("esbuild");

const ROOT = path.resolve(__dirname, "..");

function loadLocations() {
  const file = path.join(ROOT, "src/js/data/locations.js");
  const src = fs.readFileSync(file, "utf8");
  const sandbox = { window: {}, console, Math, JSON, Object, Array, String, Number };
  sandbox.window.CLS = { data: {} };
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: file });
  const L = sandbox.window.CLS.data.LOCATIONS;
  if (!L) throw new Error("未能从 locations.js 取到 LOCATIONS");
  return L;
}

function loadSceneSpec() {
  const out = esbuild.buildSync({
    entryPoints: [path.join(ROOT, "src/app/scene3d/sceneSpec.ts")],
    bundle: true,
    write: false,
    format: "cjs",
    platform: "node",
    target: "node18",
    logLevel: "silent",
  });
  const code = out.outputFiles[0].text;
  const mod = { exports: {} };
  const fn = new Function("module", "exports", "require", code);
  fn(mod, mod.exports, require);
  return mod.exports;
}

function run() {
  const LOCATIONS = loadLocations();
  const { buildSceneSpec } = loadSceneSpec();

  const ids = Object.keys(LOCATIONS);
  console.log(`地点总数: ${ids.length}`);

  assert.ok(ids.length === 29, `预期 29 个地点，实际 ${ids.length}`);

  const typesSeen = new Set();
  const tierCount = { 1: 0, 2: 0, 3: 0 };
  const fingerprints = new Map();
  const errors = [];

  for (const id of ids) {
    const loc = LOCATIONS[id];
    let spec;
    try {
      spec = buildSceneSpec(loc);
    } catch (e) {
      errors.push(`${id}: 生成抛错 —— ${e.message}`);
      continue;
    }

    // 基本结构
    if (!spec.buildings || spec.buildings.length === 0) errors.push(`${id}: 无建筑`);
    if (!spec.ground || !spec.ground.size) errors.push(`${id}: 无地面`);
    if (!spec.props) errors.push(`${id}: 无道具数组`);

    // 数值合法性
    const nums = [];
    for (const b of spec.buildings) {
      nums.push(b.pos.x, b.pos.z, b.size.w, b.size.d, b.size.h);
    }
    nums.push(spec.camera.distance, spec.camera.height, spec.lightIntensity);
    if (nums.some((n) => typeof n !== "number" || !Number.isFinite(n))) {
      errors.push(`${id}: 存在 NaN / 非有限数`);
    }

    // 相机在合理区间
    if (spec.camera.distance < 10 || spec.camera.distance > 80) {
      errors.push(`${id}: 相机距离越界 ${spec.camera.distance}`);
    }
    if (spec.lightIntensity <= 0 || spec.lightIntensity > 1.2) {
      errors.push(`${id}: 光照强度越界 ${spec.lightIntensity}`);
    }

    // 建筑不出地面
    const halfW = spec.ground.size.w / 2;
    const halfD = spec.ground.size.d / 2;
    for (const b of spec.buildings) {
      if (Math.abs(b.pos.x) > halfW || Math.abs(b.pos.z) > halfD) {
        errors.push(
          `${id}: 建筑越界 pos(${b.pos.x.toFixed(1)}, ${b.pos.z.toFixed(1)})`
        );
      }
    }

    typesSeen.add(spec.type);
    tierCount[spec.wealthTier]++;

    // seed 稳定性：同 id 再生成一次，需完全一致
    const again = buildSceneSpec(loc);
    const fp1 = JSON.stringify(spec);
    const fp2 = JSON.stringify(again);
    if (fp1 !== fp2) errors.push(`${id}: 两次生成结果不一致（seed 不稳定）`);

    // 记录布局指纹：用建筑坐标集合而非数量，才能真正检出「换皮」
    const layoutKey = spec.buildings
      .map((b) => `${b.pos.x.toFixed(1)},${b.pos.z.toFixed(1)},${b.size.h.toFixed(1)}`)
      .sort()
      .join(";");
    fingerprints.set(id, `${spec.type}|${layoutKey}`);
  }

  // 类型覆盖
  const EXPECTED_TYPES = [
    "residential",
    "commercial",
    "industrial",
    "institutional",
    "corporate",
    "service",
    "recreation",
    "public",
    "education",
  ];
  const missing = EXPECTED_TYPES.filter((t) => !typesSeen.has(t));
  if (missing.length) errors.push(`未覆盖的场景类型: ${missing.join(", ")}`);

  // 富裕等级差异：同一 type 下 tier1 与 tier3 的建筑数量/高度应有差异
  const byTypeTier = new Map();
  for (const id of ids) {
    const loc = LOCATIONS[id];
    const spec = buildSceneSpec(loc);
    const key = `${spec.type}|${spec.wealthTier}`;
    if (!byTypeTier.has(key)) byTypeTier.set(key, spec);
  }
  const residential1 = byTypeTier.get("residential|1");
  const residential3 = byTypeTier.get("residential|3");
  if (residential1 && residential3) {
    const h1 = Math.max(...residential1.buildings.map((b) => b.size.h));
    const h3 = Math.max(...residential3.buildings.map((b) => b.size.h));
    if (!(h3 > h1)) {
      errors.push(`住宅 tier3 最高楼(${h3.toFixed(1)}) 未高于 tier1(${h1.toFixed(1)})`);
    }
  } else {
    errors.push("缺少 residential tier1 或 tier3 样本，无法验证等级差异");
  }

  // 输出
  console.log(`\n覆盖类型: ${[...typesSeen].sort().join(", ")}`);
  console.log(`富裕等级分布: 贫困${tierCount[1]} / 中等${tierCount[2]} / 富裕${tierCount[3]}`);

  const dup = new Map();
  for (const [id, fp] of fingerprints) {
    if (!dup.has(fp)) dup.set(fp, []);
    dup.get(fp).push(id);
  }
  // 任何两个地点布局完全相同都视为「换皮」缺陷 —— 必须为 0
  const identical = [...dup.entries()].filter(([, v]) => v.length >= 2);
  if (identical.length) {
    console.log("\n⚠️ 布局完全相同的地点组:");
    for (const [, list] of identical) console.log(`  → ${list.join(", ")}`);
    errors.push(
      `存在 ${identical.length} 组地点布局完全相同（换皮）：${identical
        .map(([, v]) => v.join("/"))
        .join(" | ")}`
    );
  } else {
    console.log(`\n布局唯一性: ${ids.length} 个地点布局两两不同 ✅`);
  }

  if (errors.length) {
    console.error("\n❌ 发现问题:");
    for (const e of errors) console.error("  - " + e);
    process.exit(1);
  }

  console.log("\n✅ 全部 29 个地点场景生成通过：结构合法 / 无 NaN / seed 稳定 / 9 类型全覆盖 / 等级有差异");
}

run();
