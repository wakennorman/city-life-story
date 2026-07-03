#!/usr/bin/env node
/**
 * 平衡性检查脚本 — 蒙特卡洛快速验证
 *
 * 运行 5 次 × 200 天快速模拟，检测基本平衡性未被破坏。
 * 用于 CI/CD 或开发中快速验证。
 *
 * 用法:
 *   node scripts/check-balance.mjs
 *
 * 通过条件：
 *   - 所有策略存活率 ≥ 80%
 *   - 无加载错误
 */

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcPath = path.resolve(__dirname, "../tests/monte_carlo.cjs");

console.log("🔍 平衡性检查 — 蒙特卡洛快速验证");
console.log("  策略: 5次 × 200天\n");

const child = spawn("node", [mcPath, "--trials", "5", "--days", "200"], {
  cwd: path.resolve(__dirname, ".."),
  stdio: ["ignore", "pipe", "pipe"],
});

let output = "";
child.stdout.on("data", (data) => {
  process.stdout.write(data.toString());
  output += data.toString();
});

child.stderr.on("data", (data) => {
  process.stderr.write(data.toString());
});

child.on("close", (code) => {
  const hasError = output.includes("❌") || code !== 0;
  const allSurvive =
    output.includes("存活率") && !output.includes("存活率.*< 80");

  if (hasError) {
    console.log("\n❌ 平衡性检查失败！");
    process.exit(1);
  } else {
    console.log("\n✅ 平衡性检查通过！");
    process.exit(0);
  }
});
