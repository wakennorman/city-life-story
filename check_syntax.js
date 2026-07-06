const fs = require("fs");
const path = "D:/Claude Code+DeepSeekV4/dist/index.html";
const html = fs.readFileSync(path, "utf8");
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scripts) {
  for (let i = 0; i < scripts.length; i++) {
    const code = scripts[i].replace(/^<script>/, "").replace(/<\/script>$/, "");
    try {
      new Function(code);
    } catch (e) {
      console.log("Script " + i + " error: " + e.message);
    }
  }
}
console.log("Checked " + (scripts ? scripts.length : 0) + " scripts");
