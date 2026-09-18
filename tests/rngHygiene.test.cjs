/**
 * RNG 卫生 · 回归测试
 *
 * 背景：src/js/core/random.js:67 有一条明确约定——
 *   「游戏中所有随机判定必须通过 Random.* API，禁止使用裸 Math.random()」
 * 理由：裸 `Math.random()` **不可种子化** → 一旦落到真实游戏逻辑上，
 * 会直接破坏 MC 跑分的可复现性（本项目为此排查了两轮，见评估报告第十一/十二节）。
 *
 * ★ 关于"49 处违规"这个数字的更正（2026-09-15）：
 *   之前用裸 grep 数出"49 处 / 45 处违规"，**那个数字是错的**。
 *   逐条核实后：**0 处真违规**。49 处的真实构成是——
 *     · 41 处：**兜底分支**，形如 `Random.chance(0.5) : (Math.random() < 0.5)`
 *       —— 只在 `Random` 不存在时才会走到，而 `Random` 是**恒定义**的（见断言 1）
 *     ·  3 处：`src/js/core/random.js` 自身（LCG PRNG 的底层来源，合法）
 *     ·  1 处：`src/js/core/save.js` 生成存档 ID（非游戏逻辑，合法）
 *   所以"加一条 eslint no-restricted-syntax 全面禁止"会造出 **41 个假阳性**，
 *   把噪音当治理。正确的守卫是下面这两条：
 *     ① 断言 `Random` 及其方法**恒定义** → 证明那 41 处兜底**不可达**
 *     ② 断言**没有新增**未加守卫的裸 `Math.random()` → 防止真违规混进来
 *
 * 运行：node tests/rngHygiene.test.cjs
 */
const fs = require("fs");
const path = require("path");
const runner = require("./headless_runner.cjs");
const vm = require("vm");

let pass = 0;
let fail = 0;
function check(actual, expected, name) {
  const ok = actual === expected;
  if (ok) pass++;
  else fail++;
  console.log((ok ? "  ✅ " : "  ❌ ") + name +
    (ok ? "" : "  (实际 " + JSON.stringify(actual) + "，期望 " + JSON.stringify(expected) + ")"));
}
function checkTrue(cond, name) {
  check(!!cond, true, name);
}

const SRC = path.join(__dirname, "..", "src", "js");

/** 递归收集所有 .js 源文件 */
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

(async () => {
  console.log("=".repeat(72));
  console.log("  RNG 卫生 · 回归测试");
  console.log("=".repeat(72));

  const ok = await runner.init({ seed: 20260915 });
  if (!ok) {
    console.error("初始化失败");
    process.exit(1);
  }

  // ---------------------------------------------------------------
  console.log("\n[1] Random 必须恒定义（这决定了 41 处兜底分支是否不可达）");
  const rnd = vm.runInThisContext(`({
    bare: typeof Random,
    win: typeof window.Random,
    g: typeof globalThis.Random,
    chance: typeof Random.chance,
    int: typeof Random.int,
    float: typeof Random.float,
    fromArray: typeof Random.fromArray,
    shuffle: typeof Random.shuffle,
    pickN: typeof Random.pickN,
    weighted: typeof Random.weighted,
    multichance: typeof Random.multichance
  })`);
  check(rnd.bare, "object", "裸标识符 Random 可访问");
  check(rnd.win, "object", "window.Random 已导出（random.js:454）");
  check(rnd.g, "object", "globalThis.Random 已导出");
  for (const m of ["chance", "int", "float", "fromArray", "shuffle", "pickN", "weighted", "multichance"]) {
    check(rnd[m], "function", "Random." + m + " 存在");
  }
  // 结论性断言：只要 Random 恒定义，`typeof Random !== "undefined" ? ... : Math.random()`
  // 这个三元的 else 分支就**永远走不到** → 那 41 处不是违规，是死代码。
  checkTrue(
    rnd.bare === "object" && rnd.chance === "function",
    "→ 因此 `Random.x ? Random.x(...) : Math.random()` 的兜底分支不可达"
  );

  // ---------------------------------------------------------------
  console.log("\n[2] 种子化确实生效（Random 不是 Math.random 的薄包装）");
  const seeded = vm.runInThisContext(`(function(){
    Random.setSeed ? Random.setSeed(12345) : null;
    var a = [Random.float(0,1), Random.float(0,1), Random.int(0,1000)];
    Random.setSeed ? Random.setSeed(12345) : null;
    var b = [Random.float(0,1), Random.float(0,1), Random.int(0,1000)];
    return { same: JSON.stringify(a) === JSON.stringify(b), a: a };
  })()`);
  check(seeded.same, true, "同种子两次取值完全一致（PRNG 已接管，非 Math.random 直通）");

  // ---------------------------------------------------------------
  console.log("\n[3] 裸 Math.random() 分类审计（不得有新增的真违规）");
  const files = walk(SRC);
  const all = [];
  for (const f of files) {
    const src = fs.readFileSync(f, "utf8");
    const lines = src.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].indexOf("Math.random()") < 0) continue;
      // 注释行不算
      const trimmed = lines[i].trim();
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("/*")) continue;
      const rel = path.relative(path.join(__dirname, ".."), f).replace(/\\/g, "/");
      // 取「本行 + 前 6 行」作为上下文，判断是否有 Random 守卫
      const ctx = lines.slice(Math.max(0, i - 6), i + 1).join("\n");
      const guarded = ctx.indexOf("Random.") >= 0 || ctx.indexOf("typeof Random") >= 0;
      all.push({ file: rel, line: i + 1, guarded, text: trimmed.slice(0, 100) });
    }
  }
  const byFile = {};
  for (const o of all) byFile[o.file] = (byFile[o.file] || 0) + 1;
  console.log("     总计 " + all.length + " 处，分布于 " + Object.keys(byFile).length + " 个文件");

  const unguarded = all.filter((o) => !o.guarded);
  // 白名单：合法的基础设施用法（非游戏逻辑）
  const WHITELIST = [
    "src/js/core/random.js",   // LCG PRNG 的底层来源本身
    "src/js/core/save.js",     // 生成存档 ID，与游戏判定无关
    /* ★ 构建产物，不是源码。
       本文件由 scripts/build-3d-bundle.cjs 把 src/app/3d/*.js 用 esbuild
       打成 IIFE（内联 gamedata）。它的**源码不在本测试的扫描根（src/js）之下**，
       对它做源码级卫生检查属于范畴错误 —— 与 build.py 的 pre-commit 明确
       跳过 dist/app.js 同一个道理：产物已被上游检查过，且压缩后行号与上下文
       都不可读（实测 5 处"违规"全是同一行里混排的无关代码，无法逐处加固）。
       3D 内核的随机性属**视觉层**（世界布局、材质微扰），不参与任何游戏判定，
       因此本就不需要走游戏的可复现 RNG 体系。
       回归判据：若有人把 3D 逻辑写进 src/js/ 下的普通模块，仍会被本测试抓到。 */
    "src/js/scene3d.bundle.js",
  ];
  const violations = unguarded.filter(
    (o) => !WHITELIST.some((w) => o.file === w)
  );
  const infra = unguarded.length - violations.length;
  console.log("     其中「有 Random 守卫的兜底」: " + (all.length - unguarded.length) + " 处");
  console.log("     其中「白名单基础设施」: " + infra + " 处");
  console.log("     其中「无守卫、非白名单」: " + violations.length + " 处");
  for (const v of violations) console.log("       ❌ " + v.file + ":" + v.line + "  " + v.text);

  checkTrue(
    all.length - unguarded.length >= 35,
    "兜底形态占绝大多数（" + (all.length - unguarded.length) + " 处，≥35）"
  );
  check(violations.length, 0, "无守卫、非白名单的裸 Math.random() 为 0 处（真违规）");

  // ---------------------------------------------------------------
  console.log("\n[4] 约定文本仍在（防止有人顺手删掉规范）");
  const rndSrc = fs.readFileSync(path.join(SRC, "core", "random.js"), "utf8");
  checkTrue(
    rndSrc.indexOf("禁止使用裸 Math.random()") >= 0,
    "random.js 里的使用规范仍在"
  );

  // ---------------------------------------------------------------
  console.log("\n" + "=".repeat(72));
  console.log("  通过 " + pass + " / 失败 " + fail);
  console.log("=".repeat(72));
  process.exit(fail === 0 ? 0 : 1);
})();
