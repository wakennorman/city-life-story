/**
 * 贷款评估因子引擎 — TypeScript 规范源（阶段3迁移试点 · 首例）
 *
 * 迁移依据：CLAUDE.md L20/L153 —— src/app(TS) 为 Web App 新架构真相；
 *          纯逻辑优先迁入 TS，旧游戏经 bridge/facade 接入，禁止新增 window.* 全局。
 *
 * 本模块从 src/js/core/finance.js 抽取 5 个「叶子纯函数」：
 *   calculateAgeFactor / calculateDTIPenalty / calculateCreditHistoryFactor /
 *   calculateAssetBonus / calculateStabilityMultiplier
 * 它们只读 state 的局部切片、无副作用、无 window 依赖，是最适合首例迁移的单元。
 *
 * 运行时契约（SOP 安全）：
 *   - src/js/core/finance.js 暂不改写 —— 保持 src/index.html 加载序与游戏行为零变动。
 *   - 本文件是规范源；后续 src/app 内贷款相关 UI / 逻辑统一从本模块引入。
 *   - 迁移完成判据：src/app 成为被加载入口后，vanilla 副本改为经 bridge 调用本模块。
 */

/** 贷款因子函数所读取的 state 局部切片（结构化子集，不与巨型 state 耦合） */
export interface LoanFactorState {
  player?: {
    phase?: "street" | "corporate" | string;
    age?: number;
    education?: number;
    corpYear?: number;
  };
  resources?: {
    debt?: number;
    bankDebt?: number;
    villageDebt?: number;
    bankBalance?: number;
    bankCreditHistory?: Array<{ repaid?: boolean; rating?: "good" | "bad" | string }>;
  };
  investment?: {
    properties?: Array<{ currentPrice?: number; buyPrice?: number }>;
    cars?: Array<{ currentPrice?: number; buyPrice?: number }>;
  };
  flags?: {
    hasStreetStall?: boolean;
    hasScavengeRoute?: boolean;
  };
  corporate?: {
    rank?: string;
  };
}

/** 年龄因子：未成年拒贷，黄金年龄(23-35)最优 */
export function calculateAgeFactor(age: number): number {
  if (age < 18) return 0; // 未成年，不能贷款
  if (age < 23) return 0.7; // 刚成年，谨慎
  if (age < 36) return 1.0; // 黄金年龄
  if (age < 46) return 0.9;
  return 0.7;
}

/** 负债率(DTI)惩罚：无收入近拒贷；DTI 越高额度系数越低 */
export function calculateDTIPenalty(state: LoanFactorState, monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0.05; // 无收入 → 接近拒贷

  // [全系统自洽修复] 域E 修复:运算符优先级——+高于||，导致 debt 非零时
  // bankDebt/villageDebt 被静默忽略（与 vanilla 端修复保持一致）
  const totalDebt =
    (state.resources?.debt || 0) +
    (state.resources?.bankDebt || 0) +
    (state.resources?.villageDebt || 0);

  const dti = totalDebt / monthlyIncome;
  if (dti < 1) return 1.0;
  if (dti < 3) return 0.7;
  if (dti < 5) return 0.4;
  return 0.1; // DTI >= 5，接近拒贷
}

/** 信贷历史系数：无记录中性；良好记录 +10%，不良记录 -20% */
export function calculateCreditHistoryFactor(state: LoanFactorState): number {
  const history = state.resources?.bankCreditHistory || [];
  if (history.length === 0) return 1.0; // 无历史记录，中性

  let goodCount = 0;
  let badCount = 0;
  for (const record of history) {
    if (record.repaid && record.rating === "good") {
      goodCount++;
    } else if (!record.repaid || record.rating === "bad") {
      badCount++;
    }
  }

  const total = goodCount + badCount;
  if (total === 0) return 1.0;

  const goodRatio = goodCount / total;
  if (goodRatio >= 0.8) return 1.1; // 良好记录 → +10%
  if (goodRatio >= 0.5) return 1.0; // 中性
  return 0.8; // 有不良记录 → -20%
}

/** 资产增信：房产估值5% + 车辆估值2% + 存款>1万 +5000 */
export function calculateAssetBonus(state: LoanFactorState): number {
  let bonus = 0;
  const inv = state.investment;

  if (inv?.properties) {
    for (const prop of inv.properties) {
      const propValue = prop.currentPrice || prop.buyPrice || 0;
      bonus += propValue * 0.05;
    }
  }

  if (inv?.cars) {
    for (const car of inv.cars) {
      const carValue = car.currentPrice || car.buyPrice || 0;
      bonus += carValue * 0.02;
    }
  }

  if ((state.resources?.bankBalance || 0) > 10000) {
    bonus += 5000;
  }

  return Math.round(bonus);
}

/** 职业稳定性系数：街头低(0.3-0.5)，职场随入职时长与职级提升(0.6-1.1) */
export function calculateStabilityMultiplier(state: LoanFactorState): number {
  const phase = state.player?.phase;

  if (phase === "street") {
    const hasStreetJob =
      state.flags?.hasStreetStall || state.flags?.hasScavengeRoute;
    return hasStreetJob ? 0.5 : 0.3;
  }

  if (phase === "corporate") {
    const corpYear = state.player?.corpYear || 0;
    const rank = state.corporate?.rank || "P5";

    let stability = 0.6; // 默认：刚入职
    if (corpYear >= 2) {
      stability = 1.0;
    } else if (corpYear >= 0.5) {
      stability = 0.8;
    }

    const seniorRanks = ["P7", "P8", "P9", "P10"];
    if (seniorRanks.includes(rank)) {
      stability = Math.min(1.1, stability + 0.1);
    }

    return stability;
  }

  return 0.3;
}
