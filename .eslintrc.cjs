/*
 * 城市浮生记 — ESLint 配置（增量采纳版）
 * 设计目标：先立门禁、不阻断现有优化循环；新代码从严，旧代码渐进收敛。
 *
 * - src/js（经典脚本，经 build.py 串接）：no-undef 关闭（window.* 全局是设计意图），
 *   其余规则以 warn 为主，驱动团队把 var→const/let、==→=== 等习惯改过来。
 * - src/app（TypeScript）：由 tsc --strict 负责，本配置不 lint，避免误报。
 * - 仅 error 级规则是"任何代码都不该有"的硬伤（debugger / 重复 case 等）。
 */
module.exports = {
  root: true,
  env: {
    browser: true,
    es2022: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "script", // src/js 为经典脚本（全局串接），非 ES module
  },
  globals: {
    // 小程序运行时（保留）
    wx: "readonly",
    App: "readonly",
    Page: "readonly",
    getCurrentPages: "readonly",
    getApp: "readonly",
    Component: "readonly",
    requirePlugin: "readonly",
    requireMiniProgram: "readonly",
  },
  ignorePatterns: [
    "dist/**",
    "node_modules/**",
    "src/app/**", // TS 由 tsc --strict 负责
    "**/*.cjs", // 测试/工具脚本单独管理
    "**/*.mjs",
  ],
  rules: {
    // —— 硬伤（error：任何代码都不该出现）——
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-dupe-keys": "error",
    "no-dupe-args": "error",

    // —— 正确性（warn：明显隐患，应修）——
    "no-fallthrough": "warn",
    "no-empty": "warn",
    "no-cond-assign": "warn",
    "no-control-regex": "warn",
    "no-regex-spaces": "warn",
    "no-sparse-arrays": "warn",
    "no-unsafe-finally": "warn",
    "use-isnan": "warn",
    "valid-typeof": "warn",

    // —— 风格/习惯（warn：驱动团队渐进改进，不阻断提交）——
    "no-var": "warn",
    "prefer-const": "warn",
    "eqeqeq": ["warn", "smart"], // 允许 a == null 的惯用法
    "curly": ["warn", "multi-line"],
    "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],

    // —— 全局：旧代码大量使用 window.* 全局，经典脚本下 no-undef 噪声过大，关闭 ——
    "no-undef": "off",
  },
};
