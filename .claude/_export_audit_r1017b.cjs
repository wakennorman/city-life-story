// [R1017b 域H] 审计：window.X = X 导出块中引用了本文件未定义标识符的裸引用
// 此类裸引用在浏览器/无头环境求值时抛 ReferenceError，会中断该文件后续全部顶层代码。
const fs = require("fs");
const path = require("path");

function walk(dir, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith(".js")) out.push(p);
  }
  return out;
}

const files = walk(path.join(__dirname, "..", "src", "js"), []);
let total = 0;
const report = [];

for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  if (!src.includes("window.")) continue;
  const re = /window\.([A-Za-z_$][\w$]*)\s*=\s*([A-Za-z_$][\w$]*)\s*;/g;
  let m;
  const bad = [];
  while ((m = re.exec(src))) {
    const id = m[2];
    if (["window", "undefined", "null", "this", "document"].includes(id)) continue;
    const defRe = new RegExp(
      "(?:function\\s+" + id + "\\s*\\()|(?:(?:const|let|var|class)\\s+" + id + "\\b)|(?:function\\s*\\*\\s*" + id + "\\b)"
    );
    if (!defRe.test(src)) {
      // 排除已被 typeof 守卫包裹的
      const idx = m.index;
      const before = src.slice(Math.max(0, idx - 200), idx);
      if (new RegExp("typeof\\s+" + id + "\\s*!==?\\s*[\"']undefined[\"']").test(before)) continue;
      const line = src.slice(0, idx).split("\n").length;
      bad.push(id + " @L" + line);
    }
  }
  if (bad.length) {
    total += bad.length;
    report.push(path.relative(path.join(__dirname, ".."), f) + "\n    " + bad.join("\n    "));
  }
}

console.log("扫描文件数: " + files.length);
console.log("无定义裸引用总数: " + total);
if (report.length) console.log("\n" + report.join("\n"));
