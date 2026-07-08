const fs = require("fs");
let code = fs.readFileSync("launch-agnes.js", "utf-8");

// Replace catch block without error logging
const oldBlock =
  '} catch {\n              res.writeHead(proxyRes.statusCode, {\n                "content-type": "application/json",\n              });\n              res.end(data);\n            }';
const newBlock =
  '} catch (e) {\n              console.error(`[proxy] Non-stream error: ${e.message}`);\n              console.error(`[proxy] Status ${proxyRes.statusCode}, body(500): ${String(data).slice(0, 500)}`);\n              res.writeHead(proxyRes.statusCode, {\n                "content-type": "application/json",\n              });\n              res.end(data);\n            }';

if (code.includes(oldBlock)) {
  code = code.replace(oldBlock, newBlock);
  fs.writeFileSync("launch-agnes.js", code, "utf-8");
  console.log("Replaced successfully");
} else {
  console.log("Not found, trying simpler match...");
  // Let's find the exact text
  const idx = code.indexOf("catch {");
  if (idx > -1) {
    console.log("Found catch at position", idx);
    console.log("Context:", code.substring(idx, idx + 200));
  }
}

// Verify syntax
try {
  require("child_process").execSync("node --check launch-agnes.js", {
    cwd: __dirname,
    stdio: "pipe",
  });
  console.log("Syntax OK");
} catch (e) {
  console.log("Syntax ERROR");
}
