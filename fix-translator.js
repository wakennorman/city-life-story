const fs = require("fs");
let code = fs.readFileSync("launch-agnes.js", "utf-8");

// Change 1: Inside tool_call for loop, add per-chunk input_json_delta send
const oldAccumulate = `if (tc.function?.arguments) this._tcBlocks[idx].args += tc.function.arguments;`;
const newAccumulate = `if (tc.function?.arguments) {
            const frag = tc.function.arguments;
            this._tcBlocks[idx].args += frag;
            events.push(\`event: content_block_delta\\ndata: {\\"type\\":\\"content_block_delta\\",\\"index\\":\\${idx + 1},\\"delta\\":{\\"type\\":\\"input_json_delta\\",\\"partial_json\\":\\"\\${this._e(frag)}\\"}}\`); }`;

if (code.includes(oldAccumulate)) {
  code = code.replace(oldAccumulate, newAccumulate);
  console.log("Change 1: Added per-chunk input_json_delta");
} else {
  console.log("Change 1: oldAccumulate NOT FOUND");
}

// Change 2: Remove the old accumulated send loop
const oldLoop = `        // 每次有 tool_calls delta 都发 input_json_delta（多块累积）
        for (const idx of Object.keys(this._tcBlocks).sort()) {
          const tc = this._tcBlocks[idx];
          // 只发新累积的部分——不好分割，每次发全部累积量
          // OpenAI 单块可能只含部分 arguments，累积后每块重发全部
          if (tc.args) {
            events.push(\`event: content_block_delta\\ndata: {\\"type\\":\\"content_block_delta\\",\\"index\\":\\${parseInt(idx) + 1},\\"delta\\":{\\"type\\":\\"input_json_delta\\",\\"partial_json\\":\\"\\${this._e(tc.args)}\\"}}\`);
          }
        }`;

if (code.includes(oldLoop)) {
  code = code.replace(oldLoop, "");
  console.log("Change 2: Removed accumulated send loop");
} else {
  console.log("Change 2: oldLoop NOT FOUND");
}

fs.writeFileSync("launch-agnes.js", code, "utf-8");
console.log("Written");

// Verify syntax
try {
  require("child_process").execSync("node --check launch-agnes.js", {
    cwd: __dirname,
    stdio: "pipe",
  });
  console.log("Syntax OK");
} catch (e) {
  console.log("Syntax ERROR:", e.stderr?.toString() || e.message);
}
