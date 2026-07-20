/**
 * 难度分层系统 · barrel reexport（阶段3 TS 规范源）
 *
 * src/app 内统一从此处引入难度相关能力：
 *   import { DIFFICULTY_LEVELS, getDifficultyConfig, getDifficultyMultiplier } from "@/core/difficulty";
 */

export * from "./difficultyLevels";
export * from "./difficultySelectors";
