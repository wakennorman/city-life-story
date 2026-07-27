/**
 * 技能连携纯逻辑（canonical source / 规范源）
 *
 * 阶段3 批次16：将 vanilla src/js/core/skill_synergy.js 的 checkSkillSynergies
 * 与 getSkillSynergyBonus 迁移为 TS 规范源。vanilla 端零改动、加载序不变。
 *
 * 保真约定：
 * - 计算结果（dual/triple/theme/effects/unlocked*）与 vanilla 逐项 JSON 一致；
 * - 双技能连携激活时写入 state.flags["_synergy_<id>"] = true，与 vanilla 行为一致
 *   （data/jobs.js 以 requiredFlag 依赖该标记解锁连携工作，不可省略）。
 * - getSkillSynergyBonus 对 dual 应用工作特定 incomeMultiplier，对 triple/theme 不应用，
 *   与 vanilla _calcEffectsIncomeBonus(withJobId) 调用约定一致。
 */

import {
  SKILL_SYNERGY_DUAL,
  SKILL_SYNERGY_TRIPLE,
  SKILL_SYNERGY_THEME,
  SynergyEffectsDef,
} from "./synergyData";

// 显式再导出数据表（esbuild 对 `export *` 会按需裁剪，命名再导出可保真暴露给测试比对）
export {
  SKILL_SYNERGY_DUAL,
  SKILL_SYNERGY_TRIPLE,
  SKILL_SYNERGY_THEME,
};

export interface SynergyEffectsDef {
  [key: string]: unknown;
  unlockJobs?: string[];
  unlockBusinesses?: string[];
  unlockActions?: string[];
  incomeMultiplier?: number;
}
export interface SynergyEffects {
  [key: string]: unknown;
}
export interface SynergyEntry {
  synergyId?: string;
  themeId?: string;
  name: string;
  icon: string;
  desc: string;
  qualifiedSkills?: string[];
  effects: SynergyEffects;
}
export interface SynergyEntryData extends SynergyEntry {
  skills: Array<{ id: string; minLevel: number }>;
  effects: SynergyEffectsDef;
}
export interface SynergyThemeData {
  id: string;
  name: string;
  icon: string;
  theme: string;
  skills: string[];
  minSkills: number;
  threshold: number;
  effects: SynergyEffectsDef;
  desc: string;
  synergyId?: string;
  qualifiedSkills?: string[];
}
export interface SynergyResult {
  dual: Record<string, SynergyEntry>;
  triple: Record<string, SynergyEntry>;
  theme: Record<string, SynergyEntry>;
  effects: Record<string, unknown>;
  unlockedJobs: string[];
  unlockedBusinesses: string[];
  unlockedActions: string[];
}

type StateSkills = Record<string, { level?: number } | number | undefined>;
interface SynergyState {
  skills?: StateSkills;
  flags?: Record<string, unknown>;
  skillSynergies?: {
    dual?: Record<string, SynergyEntry>;
    triple?: Record<string, SynergyEntry>;
    theme?: Record<string, SynergyEntry>;
  };
}

/** 规整 state.skills → { id: level }，兼容 {level:N} 与数字两种存储形态 */
function getSkillLevels(state: SynergyState): Record<string, number> {
  const out: Record<string, number> = {};
  if (!state || !state.skills) return out;
  for (const id in state.skills) {
    const s = state.skills[id];
    if (s && typeof s === "object") out[id] = s.level || 0;
    else if (typeof s === "number") out[id] = s;
  }
  return out;
}

function collectUnlocks(
  results: SynergyResult,
  effects: SynergyEffects,
): void {
  if (effects.unlockJobs) {
    results.unlockedJobs = results.unlockedJobs.concat(
      effects.unlockJobs as string[],
    );
  }
  if (effects.unlockBusinesses) {
    results.unlockedBusinesses = results.unlockedBusinesses.concat(
      effects.unlockBusinesses as string[],
    );
  }
  if (effects.unlockActions) {
    results.unlockedActions = results.unlockedActions.concat(
      effects.unlockActions as string[],
    );
  }
}

function allSkillsMet(
  reqs: { id: string; minLevel: number }[],
  levels: Record<string, number>,
): boolean {
  for (const req of reqs) {
    if ((levels[req.id] || 0) < req.minLevel) return false;
  }
  return true;
}

export function checkSkillSynergies(state: SynergyState): SynergyResult {
  if (!state || !state.skills) {
    return {
      dual: {},
      triple: {},
      theme: {},
      effects: {},
      unlockedJobs: [],
      unlockedBusinesses: [],
      unlockedActions: [],
    };
  }

  const skillLevels = getSkillLevels(state);
  const results: SynergyResult = {
    dual: {},
    triple: {},
    theme: {},
    effects: {},
    unlockedJobs: [],
    unlockedBusinesses: [],
    unlockedActions: [],
  };

  // 检测双技能连携
  for (const id in SKILL_SYNERGY_DUAL) {
    const syn = SKILL_SYNERGY_DUAL[id];
    if (allSkillsMet(syn.skills, skillLevels)) {
      results.dual[id] = {
        synergyId: id,
        name: syn.name,
        icon: syn.icon,
        desc: syn.desc,
        effects: syn.effects,
      };
      // 双连携激活标记供工作系统以 requiredFlag 读取（与 vanilla 一致）
      if (state.flags) state.flags["_synergy_" + id] = true;
      collectUnlocks(results, syn.effects);
    }
  }

  // 检测三技能连携
  for (const id in SKILL_SYNERGY_TRIPLE) {
    const syn = SKILL_SYNERGY_TRIPLE[id];
    if (allSkillsMet(syn.skills, skillLevels)) {
      results.triple[id] = {
        synergyId: id,
        name: syn.name,
        icon: syn.icon,
        desc: syn.desc,
        effects: syn.effects,
      };
      collectUnlocks(results, syn.effects);
    }
  }

  // 检测主题连携
  for (const id in SKILL_SYNERGY_THEME) {
    const theme = SKILL_SYNERGY_THEME[id];
    const qualified: string[] = [];
    for (const sk of theme.skills) {
      if ((skillLevels[sk] || 0) >= theme.threshold) qualified.push(sk);
    }
    if (qualified.length >= theme.minSkills) {
      results.theme[id] = {
        themeId: id,
        name: theme.name,
        icon: theme.icon,
        desc: theme.desc,
        qualifiedSkills: qualified,
        effects: theme.effects,
      };
      collectUnlocks(results, theme.effects);
    }
  }

  // 合并所有效果
  const combined: Record<string, unknown> = {};
  function mergeEffects(source: SynergyEffects): void {
    for (const key in source) {
      const value = source[key];
      if (value && typeof value === "object" && !Array.isArray(value)) {
        if (!combined[key]) combined[key] = {};
        for (const k in value as Record<string, unknown>) {
          (combined[key] as Record<string, unknown>)[k] = (
            value as Record<string, Record<string, unknown>>
          )[k];
        }
      } else {
        combined[key] = value;
      }
    }
  }

  for (const id in results.dual) mergeEffects(results.dual[id].effects);
  for (const id in results.triple) mergeEffects(results.triple[id].effects);
  for (const id in results.theme) mergeEffects(results.theme[id].effects);

  results.effects = combined;

  // 去重解锁列表
  results.unlockedJobs = [...new Set(results.unlockedJobs)];
  results.unlockedBusinesses = [...new Set(results.unlockedBusinesses)];
  results.unlockedActions = [...new Set(results.unlockedActions)];

  return results;
}

/**
 * 获取技能连携对特定工作的收入加成（倍率增量累加）
 * @param jobId 工作ID
 * @param state 含 state.skillSynergies（checkSkillSynergies 的结果）
 * @returns 收入加成倍率（0 表示无加成）
 */
export function getSkillSynergyBonus(
  jobId: string,
  state: SynergyState,
): number {
  if (!state || !state.skillSynergies) return 0;

  const synergyResults = state.skillSynergies;
  let totalBonus = 0;

  // 约定式自动归类：扫描 effects 中所有 *IncomeBonus / *RepairBonus 字段 +
  // 工作特定 incomeMultiplier；新增收入加成字段自动发现，零代码修改
  function calcEffectsIncomeBonus(
    effects: SynergyEffects | undefined,
    withJobId: boolean,
  ): number {
    if (!effects) return 0;
    let bonus = 0;
    for (const key in effects) {
      const val = effects[key];
      if (typeof val !== "number") continue;
      if (key.indexOf("IncomeBonus") >= 0 || key.indexOf("RepairBonus") >= 0) {
        bonus += val;
      }
    }
    if (withJobId && effects[jobId] && (effects[jobId] as SynergyEffects).incomeMultiplier) {
      const im = (effects[jobId] as SynergyEffects).incomeMultiplier;
      if (typeof im === "number" && isFinite(im)) {
        bonus += im - 1;
      }
    }
    return bonus;
  }

  for (const id in synergyResults.dual) {
    totalBonus += calcEffectsIncomeBonus(synergyResults.dual[id].effects, true);
  }
  for (const id in synergyResults.triple) {
    totalBonus += calcEffectsIncomeBonus(synergyResults.triple[id].effects, false);
  }
  for (const id in synergyResults.theme) {
    totalBonus += calcEffectsIncomeBonus(synergyResults.theme[id].effects, false);
  }

  return totalBonus;
}
