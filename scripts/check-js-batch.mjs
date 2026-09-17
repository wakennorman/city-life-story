#!/usr/bin/env node
/**
 * 批量 JS 语法检查 —— 从 stdin 读取文件路径列表（每行一个），
 * 在单个进程内用 vm.Script 逐个编译，只检查、不执行。
 *
 * [为什么需要它]
 * build.py 原先在循环里对每个文件 spawn 一次 `node --check`：
 *
 *     for src in files:
 *         subprocess.run(['node', '--check', path], ...)
 *
 * 实测单次 spawn 平均 344ms，× 1174 个被 index.html 引用的文件 ≈ 400 秒。
 * 而构建本身（读 1177 个文件 + 拼接 + 写出 16MB）只需 0.63 秒。
 * 即构建耗时的 99.8% 花在进程启动上，而非构建。
 *
 * 这与 scripts/check-js-syntax.mjs 修掉的是同一个问题
 * （那里 1177 文件 255s → 1.5s，见报告第 37 节）。
 * 当时只修了 CI 侧那一份，build.py 里这份留到现在。
 *
 * [为什么不用 check-js-syntax.mjs]
 * 那个脚本固定扫描 src/js/**（1177 个文件），而 build.py 只应检查
 * **被 src/index.html 实际引用**的文件（1174 个）。两者范围不同：
 *   - src/js 下有 3 个文件未被任何 <script src> 引用
 *     （app_bridge/webapp_runtime_bridge.js、core/gate_registry.js、
 *      phase1/weather.js，属已知的悬空文件）
 *   - 若换成全量扫描，会把它们也纳入检查，超出 build 的职责
 * 故此处接受显式文件列表，保持 build.py 的原有语义不变。
 *
 * [用法]
 *   node scripts/check-js-batch.mjs < filelist.txt
 * 退出码 0 = 全部通过；1 = 存在语法错误（错误详情打到 stderr）
 */

import { readFileSync } from "node:fs";
import vm from "node:vm";

const input = readFileSync(0, "utf8"); // fd 0 = stdin
const files = input.split("\n").map((s) => s.trim()).filter(Boolean);

if (files.length === 0) {
  console.error("check-js-batch: 未收到任何文件路径（stdin 为空）");
  process.exit(1);
}

let failed = 0;
for (const file of files) {
  try {
    // 仅编译，不执行 —— 与 `node --check` 语义等价
    new vm.Script(readFileSync(file, "utf8"), { filename: file });
  } catch (err) {
    failed += 1;
    console.error(err && err.stack ? err.stack : String(err));
  }
}

if (failed > 0) {
  console.error(`JS syntax check failed: ${failed}/${files.length}`);
  process.exit(1);
}

console.log(`JS syntax check passed: ${files.length} files`);
