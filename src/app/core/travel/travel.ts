// 地点旅行纯函数集 — 阶段3批次14 TS 规范源
// 1:1 复刻 src/js/data/locations.js 的 getLocationHops / getTaxiCost
// TRAVEL_GRAPH / LOCATIONS 配置以注入参数传入(默认空对象)，避免较大的地图数据双源

export type TravelGraph = Record<string, string[]>;
export type LocationMap = Record<string, { wealthTier?: number; [k: string]: unknown }>;

/**
 * BFS 计算两地最短跳数（同地=0，无连通=99）
 * 复刻 vanilla getLocationHops：依赖 TRAVEL_GRAPH + LOCATIONS 静态数据
 */
export function getLocationHops(
  fromKey: string,
  toKey: string,
  graph: TravelGraph = {},
  locations: LocationMap = {}
): number {
  if (fromKey === toKey) return 0;
  if (!graph[fromKey] || !locations[toKey]) return 99;
  const visited: Record<string, number> = {};
  visited[fromKey] = 0;
  const queue: string[] = [fromKey];
  while (queue.length) {
    const cur = queue.shift() as string;
    const dist = visited[cur];
    const neighbors = graph[cur] || [];
    for (let i = 0; i < neighbors.length; i++) {
      const n = neighbors[i];
      if (visited[n] !== undefined) continue;
      visited[n] = dist + 1;
      if (n === toKey) return dist + 1;
      queue.push(n);
    }
  }
  return 99; // 不可达
}

/**
 * 打车费用：按距离（跳数）递增，可达任意地点
 *   1跳=¥12, 2跳=¥16, 3跳=¥20 ... 封顶¥40
 *   不可达（hops>=99）时按远距离 fallback=¥35
 * 复刻 vanilla getTaxiCost
 */
export function getTaxiCost(
  fromKey: string,
  toKey: string,
  graph: TravelGraph = {},
  locations: LocationMap = {}
): number {
  if (fromKey === toKey) return 0;
  const hops = getLocationHops(fromKey, toKey, graph, locations);
  if (hops >= 99) return 35; // 远距离 fallback
  return Math.min(40, 8 + hops * 4);
}
