import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = join(process.cwd(), "src", "js");
const files = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path);
    } else if (entry.endsWith(".js")) {
      files.push(path);
    }
  }
}

walk(root);

let failed = 0;
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    failed += 1;
    console.error(
      result.stderr || result.stdout || `node --check failed: ${file}`,
    );
  }
}

if (failed > 0) {
  console.error(`JS syntax check failed: ${failed}/${files.length}`);
  process.exit(1);
}

console.log(`JS syntax check passed: ${files.length} files`);
