/**
 * 路径感知写入判据 —— 报告第 56 节
 * ============================================================================
 *
 * 【背景】`tests/events_reachability.cjs` 的 `hasWriteSite(pathStr)` 只取
 * **叶子键名**（`key = segs[segs.length - 1]`）在全库源码里找写入点，
 * **不校验路径前缀** → 死字段被同名活字段"洗白"（第 55 节「盲区七」）。
 *
 *    state.investment.totalProfit  ← 全库零写入，被 state.trade.totalProfit 洗白
 *    state.startup.company.team    ← 全库零写入，被 state.corporate.team   洗白
 *
 * 本模块提供**路径感知**的写入判据：写入的接收者必须挂在**同一父容器**上。
 *
 * 【姿态：宁可漏报不可误报】
 * 收紧判据会引入新误报 —— 以下三种形态"看不见"，但它们**都是活的**：
 *   ① 别名写入        ：`var inv = st.investment; inv.key = ...`
 *   ② 整体赋值+字面量 ：`const c = { key: 1 }; state.x.y = c;`
 *   ③ 动态键          ：`state.dict[expr].key = ...`
 * 所以本模块**不做硬失败**，只产出「候选 + 诊断」，并内置 ①② 两个近似
 * （命中即判活），③ 交人工。
 *
 * 【被谁用】
 *   - `tests/reachability_same_name_crosstalk.cjs` —— 产出候选清单
 *   - `tests/reachability_path_aware_control.cjs` —— 阴性对照（保证判据可信）
 * 共用同一份实现，避免两处漂移。
 */

const path = require("path");
const fs = require("fs");

const DEFAULT_SRC_ROOT = path.join(__dirname, "..", "..", "src", "js");

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 路径在源码中的写法：`state.x.y` 或 `st.x.y`。
 *
 * 【坑·自测】顶层 parent（`parent === "state"`）必须返回**不带尾点**的前缀。
 * 初版返回 `["state.", "st."]`，调用方正则里又拼了一个 `\.` → 变成
 * `state..gameOver` → 顶层路径全部匹配失败 → `state.gameOver`（2861 个事件引用）
 * 这种显然有写入的路径被误报为候选。
 */
function parentVariants(parent) {
  const segs = parent.split(".");
  if (segs[0] !== "state") return [escapeRe(parent)];
  const rest = segs.slice(1).join(".");
  return rest
    ? [escapeRe("state." + rest), escapeRe("st." + rest)]
    : [escapeRe("state"), escapeRe("st")];
}

/**
 * 建立源码索引（一次性，避免 O(候选 × 全库) 的重复扫描）。
 *
 * 【坑·性能】初版对每条候选扫全库、每行跑 4 个正则 →
 * O(候选 × 文件 × 行 × 形态) ≈ 33 × 300k × 4，实测 5 分钟跑不完。
 * 修复：扁平化所有行 + 按"子串命中"缓存（标识符出现频率远低于 1，
 * 预筛能砍掉 95%+ 的正则调用）。
 */
function createIndex(srcRoot) {
  const root = srcRoot || DEFAULT_SRC_ROOT;

  const FILES = [];
  (function walk(dir) {
    let ents;
    try { ents = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }
    for (const ent of ents) {
      const p = path.join(dir, ent.name);
      if (ent.isDirectory()) walk(p);
      else if (ent.name.endsWith(".js")) {
        try {
          const text = fs.readFileSync(p, "utf8");
          FILES.push({
            rel: path.relative(root, p).replace(/\\/g, "/"),
            text,
            lines: text.split("\n"),
          });
        } catch (e) {}
      }
    }
  })(root);

  const ALL_LINES = [];
  for (const f of FILES) {
    for (let i = 0; i < f.lines.length; i++) {
      ALL_LINES.push({ file: f.rel, line: i + 1, text: f.lines[i] });
    }
  }

  const lineCache = new Map();
  function linesWith(sub) {
    if (lineCache.has(sub)) return lineCache.get(sub);
    const r = ALL_LINES.filter((x) => x.text.indexOf(sub) !== -1);
    lineCache.set(sub, r);
    return r;
  }

  const fileCache = new Map();
  function filesWith(sub) {
    if (fileCache.has(sub)) return fileCache.get(sub);
    const r = FILES.filter((f) => f.text.indexOf(sub) !== -1);
    fileCache.set(sub, r);
    return r;
  }

  function trim(x) {
    return { file: x.file, line: x.line, text: x.text.trim().slice(0, 140) };
  }

  // ── ① 路径感知写入点：接收者必须是 parent ────────────────────────────
  function scopedWriteSites(parent, key) {
    const hits = [];
    const k = escapeRe(key);
    const pool = linesWith(key);
    for (const v of parentVariants(parent)) {
      const reA = new RegExp("\\b" + v + "\\s*\\.\\s*" + k + "\\s*(?:\\[[^\\]]*\\])?\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--)");
      const reB = new RegExp("\\b" + v + "\\s*\\.\\s*" + k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(");
      const reC = new RegExp("Object\\s*\\.\\s*assign\\s*\\(\\s*" + v + "\\s*,\\s*\\{[^}]*\\b" + k + "\\b");
      const reD = new RegExp("delete\\s+" + v + "\\s*\\.\\s*" + k + "\\b");
      for (const x of pool) {
        if (reA.test(x.text) || reB.test(x.text) || reC.test(x.text) || reD.test(x.text)) hits.push(trim(x));
      }
    }
    return hits;
  }

  // ── ①b 别名写入近似：`var X = ...parent...; X.key = ...` ──────────────
  //
  // 局限（**方向是"判活"，偏保守，符合"宁可漏报不可误报"姿态**）：
  //   - 不做作用域分析 → 不同文件的同名局部变量可能造成假阴性（漏判为活）
  function approximateAliasWrites(parent, key) {
    const hits = [];
    const k = escapeRe(key);
    const tail = parent.substring(parent.lastIndexOf(".") + 1);
    const pool = linesWith(tail);
    const keyPool = null;

    for (const v of parentVariants(parent)) {
      const reAlias = new RegExp("(?:var|let|const)\\s+([A-Za-z_$][\\w$]*)\\s*=\\s*[^;]*\\b" + v + "\\b", "g");
      const names = new Set();
      for (const x of pool) {
        let m;
        reAlias.lastIndex = 0;
        while ((m = reAlias.exec(x.text))) names.add(m[1]);
      }
      if (names.size === 0) continue;

      const kp = keyPool || linesWith(key);
      for (const a of names) {
        const ak = escapeRe(a);
        const reW = new RegExp("\\b" + ak + "\\s*\\.\\s*" + k + "\\s*(?:\\[[^\\]]*\\])?\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--)");
        const reW2 = new RegExp("\\b" + ak + "\\s*\\.\\s*" + k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(");
        for (const x of kp) {
          if (reW.test(x.text) || reW2.test(x.text)) hits.push(Object.assign({ alias: a }, trim(x)));
        }
      }
    }
    return hits;
  }

  // ── ①c 整体赋值 + 字面量键近似 ──────────────────────────────────────
  //
  //   const company = { ..., industry: industry, ... };
  //   state.startup.company = company;
  //
  // 没有这一步，`state.startup.company.industry` 这类**真活**字段会被误报为候选
  // （company 字面量第 540 行就写着 `industry: industry`）。
  function approximateLiteralKey(parent, key) {
    const hits = [];
    const k = escapeRe(key);
    const tail = parent.substring(parent.lastIndexOf(".") + 1);
    const pool = linesWith(tail);

    const names = new Set();
    for (const v of parentVariants(parent)) {
      const re = new RegExp("\\b" + v + "\\s*=\\s*([A-Za-z_$][\\w$]*)\\s*;");
      for (const x of pool) {
        const m = re.exec(x.text);
        if (m && ["null", "undefined", "true", "false"].indexOf(m[1]) === -1) names.add(m[1]);
      }
    }
    if (names.size === 0) return hits;

    const reKeyInLit = new RegExp("(?:^|[^\\w$.])" + k + "\\s*:");
    for (const nm of names) {
      const reDef = new RegExp("(?:var|let|const)\\s+" + escapeRe(nm) + "\\s*=\\s*\\{");
      for (const f of filesWith(nm)) {
        for (let i = 0; i < f.lines.length; i++) {
          if (!reDef.test(f.lines[i])) continue;
          for (let j = i; j < Math.min(i + 300, f.lines.length); j++) {
            if (reKeyInLit.test(f.lines[j])) hits.push(Object.assign({ obj: nm }, { file: f.rel, line: j + 1, text: f.lines[j].trim().slice(0, 140) }));
            if (j > i && /^\s*\};?\s*$/.test(f.lines[j])) break;
          }
        }
      }
    }
    return hits;
  }

  // ── ② 同名写入点（不限前缀）—— 串扰来源诊断 ──────────────────────────
  function globalWriteSites(key) {
    const hits = [];
    const k = escapeRe(key);
    const re = new RegExp("(?:^|[^\\w$.])[\\w$]*\\s*\\.\\s*" + k + "\\s*(?:\\[[^\\]]*\\])?\\s*(?:[-+*/%&|^]?=(?!=|>)|\\+\\+|--)");
    const re2 = new RegExp("\\." + k + "\\s*\\.\\s*(?:push|unshift|splice|set|add)\\s*\\(");
    for (const x of linesWith(key)) {
      if (re.test(x.text) || re2.test(x.text)) hits.push(trim(x));
    }
    return hits;
  }

  // ── ③ 父容器整体赋值（`parent = ...`）—— 诊断 ────────────────────────
  function parentBulkAssignSites(parent) {
    const hits = [];
    const tail = parent.substring(parent.lastIndexOf(".") + 1);
    const pool = linesWith(tail);
    for (const v of parentVariants(parent)) {
      const re = new RegExp("\\b" + v + "\\s*=\\s*(?!=)");
      for (const x of pool) if (re.test(x.text)) hits.push(trim(x));
    }
    return hits;
  }

  /**
   * 综合判定：返回该路径"是否有路径感知可见的写入"。
   *   { alive, how, sites }
   *   how ∈ "scoped"（直接前缀匹配）/ "alias" / "literal" / "none"
   */
  function verdict(parent, key) {
    const s = scopedWriteSites(parent, key);
    if (s.length) return { alive: true, how: "scoped", sites: s };
    const a = approximateAliasWrites(parent, key);
    if (a.length) return { alive: true, how: "alias", sites: a };
    const l = approximateLiteralKey(parent, key);
    if (l.length) return { alive: true, how: "literal", sites: l };
    return { alive: false, how: "none", sites: [] };
  }

  return {
    root,
    files: FILES,
    linesWith,
    filesWith,
    scopedWriteSites,
    approximateAliasWrites,
    approximateLiteralKey,
    globalWriteSites,
    parentBulkAssignSites,
    verdict,
  };
}

/**
 * 剥掉 JS 源码里的注释 —— 报告第 58 节
 * ============================================================================
 *
 * 【为什么判据必须剥注释】
 *   `events_reachability.cjs` 与 `reachability_same_name_crosstalk.cjs` 都用
 *   `e.conditions.toString()` 拿函数源码、再用正则提取 `st.x.y` 路径。
 *   **`Function.prototype.toString()` 会原样保留函数体内的注释。**
 *
 *   于是「解释性注释里提到的旧字段名」会被当成**真实读取点**：
 *
 *     conditions: function (st) {
 *       // 原读 st.startup.companies（已废弃）
 *       return !!(st.startup && st.startup.company);   // ← 真正在跑的代码
 *     }
 *
 *   提取器会同时得到 `state.startup.companies`（来自注释）与
 *   `state.startup.company`（来自代码）→ **凭空多出一条候选**。
 *
 *   实测：第 58 节给 3 个文件加了「原读 xxx」的注释后，候选数**纹丝不动**
 *   —— 因为删掉的真引用与注释里的假引用**恰好抵消**。
 *   这是一个"改对了但仪表没动"的标本：**如果不剥注释，
 *   你越认真地写注释解释旧字段，清单就越长。**
 *
 * 【与「纪律 5：源码守卫要剥注释」同源】那次是守卫正则被自己的注释骗到，
 *   这次是**提取器**被自己的注释骗到。同一类错误的两个出口。
 *
 * 【为什么放在这个 lib 里】两处判据必须用同一份实现（纪律 7：单一事实来源），
 *   否则修了一处、另一处继续产出假候选。
 */
function stripComments(src) {
  return String(src)
    .replace(/\/\*[\s\S]*?\*\//g, "") // 块注释
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1"); // 行注释（`[^:]` 避开 http:// 之类）
}

/**
 * 从事件 conditions 的函数源码里提取 `st.x.y` / `state.x.y` 读取路径 —— 报告第 58 节
 * ============================================================================
 *
 * 【为什么要收进 lib】
 *   原先 `events_reachability.cjs` 与 `reachability_same_name_crosstalk.cjs`
 *   **各持一份完全相同的实现**（一份用 var、一份用 const，逻辑逐字一致）。
 *   后果：第 58 节修「必须剥注释」时得改两遍，而**任何一处漏改都会继续产出假候选**。
 *   这正是纪律 7（单一事实来源）要防的形态 —— 两份会漂移的清单。
 *
 * 【调用方必须自己剥注释】本函数**不自动剥**，以免调用方误以为已经安全。
 *   正确用法：`extractReadPaths(stripComments(fn.toString()))`
 *   —— 若直接传 `fn.toString()`，函数体内的注释会被当成真实读取点。
 *
 * 【为什么只取 3 级、遇 `[` 即停】与门禁原实现保持一致：
 *   `st.relationships[id].affinity` 属动态键，跳过；多取层级会产出无意义的深路径。
 */
function extractReadPaths(fnSrc) {
  var out = {};
  var re = /\b(?:st|state)\s*\.\s*([A-Za-z_$][\w$]*)(?:\s*\.\s*([A-Za-z_$][\w$]*))?(?:\s*\.\s*([A-Za-z_$][\w$]*))?/g;
  var m;
  while ((m = re.exec(fnSrc))) {
    var p = "state." + m[1];
    if (m[2]) p += "." + m[2];
    if (m[3]) p += "." + m[3];
    out[p] = true;
  }
  return Object.keys(out);
}

module.exports = {
  createIndex,
  parentVariants,
  escapeRe,
  stripComments,
  extractReadPaths,
  DEFAULT_SRC_ROOT,
};
