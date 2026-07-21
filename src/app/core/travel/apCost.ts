// 地点旅行 AP 消耗纯函数 — 阶段3批次15 TS 规范源（独立模块，避免改动批次14已入库的 travel.ts）
// 1:1 复刻 src/js/data/locations.js 的 getTravelApCost
// TRAVEL_GRAPH / LOCATIONS 配置以注入参数传入(默认空对象)，避免较大的地图数据双源
// getTravelApReduction / getWeatherTravelApMod 为可选注入依赖（驾驶技能减免 / 天气倍率），
//   默认 undefined → 与 vanilla 单文件 vm 加载时「函数不在作用域、typeof 守卫跳过」行为严格一致

import { getLocationHops, TravelGraph, LocationMap } from "./travel";

export type { TravelGraph, LocationMap };

export interface TravelState {
  skills?: { driving?: { level?: number } };
  flags?: { oldZhouTricycle?: boolean };
  weather?: { current?: string };
  [k: string]: unknown;
}

/**
 * 旅行 AP 消耗：基础 12 + (hops-1)×4，富区互通 -3 / 贫富跨区 +2，
 *   驾驶技能减免（getTravelApReduction 注入）、老周三轮车 -2、天气倍率（getWeatherTravelApMod 注入），保底 5 AP。
 * 复刻 vanilla getTravelApCost：两个可选依赖以注入参数传入（默认 undefined →
 *   与 vanilla 单文件 vm 加载时「typeof 守卫跳过」行为严格一致）。同地=0 / 不连通=99。
 */
export function getTravelApCost(
  fromKey: string,
  toKey: string,
  state?: TravelState | null,
  graph: TravelGraph = {},
  locations: LocationMap = {},
  getTravelApReduction?: (drivingLevel: number) => number,
  getWeatherTravelApMod?: (s: TravelState | null | undefined) => number
): number {
  const hops = getLocationHops(fromKey, toKey, graph, locations);
  if (hops <= 0) return 0;
  if (hops >= 99) return 99; // 不连通

  let base = 12 + (hops - 1) * 4;

  const fromLoc = locations[fromKey];
  const toLoc = locations[toKey];
  const ft = (fromLoc && fromLoc.wealthTier) || 2;
  const tt = (toLoc && toLoc.wealthTier) || 2;
  if (ft === 3 && tt === 3) base -= 3; // 富区互通方便
  if ((ft === 1 && tt === 3) || (ft === 3 && tt === 1)) base += 2; // 贫富两端跨区

  // 驾驶技能减免
  if (state && state.skills && state.skills.driving) {
    const reduction =
      typeof getTravelApReduction === "function"
        ? getTravelApReduction(state.skills.driving.level || 0)
        : 0;
    base -= reduction;
  }
  // 老周三轮车
  if (state && state.flags && state.flags.oldZhouTricycle) base -= 2;

  // 天气 AP 修正（天气深化系统）：降低能见度天气增加出行消耗
  if (typeof getWeatherTravelApMod === "function") {
    const weatherApMod = getWeatherTravelApMod(state);
    if (weatherApMod !== 1.0) {
      base = Math.round(base * weatherApMod);
    }
  }

  return Math.max(5, base);
}
