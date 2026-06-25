import { CITY_SERVICE_ACTIONS } from "../data/cityServices";
import { LIFE_NODES } from "../data/lifeNodes";
import { inspectBridgeHealth } from "../core/gameBridge";

interface HealthRow {
  name: string;
  status: string;
  detail: string;
}

function checkDataDirectory(
  name: string,
  items: unknown[] | readonly unknown[] | null | undefined,
  legacyPath: string,
): HealthRow {
  const count = Array.isArray(items) ? items.length : 0;
  return {
    name: `📂 ${name}`,
    status: count > 0 ? "ready" : "empty",
    detail:
      count > 0
        ? `${count} 条数据已填充（legacy: ${legacyPath}）`
        : `仅状态标记，实际数据仍在 ${legacyPath}`,
  };
}

function getLegacyStatus(): HealthRow[] {
  const rows: HealthRow[] = [];
  if (typeof window === "undefined") {
    rows.push({
      name: "🎮 Legacy Runtime",
      status: "unknown",
      detail: "不在浏览器环境，无法检测 window 状态",
    });
    return rows;
  }
  const win = window as unknown as Record<string, unknown>;
  const sm = win.StateManager;
  rows.push({
    name: "🎮 StateManager",
    status: sm ? "ready" : "missing",
    detail: sm ? "StateManager 已就绪" : "StateManager 未加载",
  });

  const bridge = win.WebAppBridge;
  rows.push({
    name: "🌉 WebAppBridge",
    status: bridge ? "ready" : "missing",
    detail: bridge ? "桥接层已暴露到 window.WebAppBridge" : "桥接层未加载",
  });

  const mech = win.MECHANICS as Record<string, unknown> | undefined;
  rows.push({
    name: "📖 MECHANICS 注册表",
    status: mech?.webapp_bridge ? "ready" : "missing",
    detail: mech?.webapp_bridge
      ? "webapp_bridge 百科条目已注册"
      : "百科条目未注册",
  });

  return rows;
}

export function buildHealthRows(): HealthRow[] {
  const bridge = inspectBridgeHealth();

  const rows: HealthRow[] = [
    {
      name: "⚡ Vite + TypeScript",
      status: "ready",
      detail: "并行 Web App 壳已加载，不替代 legacy 正式入口。",
    },
    // ===== TS 数据目录检测 =====
    checkDataDirectory(
      "城市服务",
      CITY_SERVICE_ACTIONS,
      "src/js/app_bridge/webapp_runtime_bridge.js",
    ),
    checkDataDirectory("人生节点", LIFE_NODES, "src/js/core/life_nodes.js"),
    {
      name: "📂 事件 (events)",
      status: "empty",
      detail: "仅状态标记，实际数据在 src/js/core/events_street.js (163+)",
    },
    {
      name: "📂 职业 (jobs)",
      status: "empty",
      detail: "仅状态标记，实际数据在 src/js/data/jobs.js (20+)",
    },
    {
      name: "📂 地点 (locations)",
      status: "empty",
      detail: "仅状态标记，实际数据在 src/js/data/locations.js (15+)",
    },
    {
      name: "📂 物品 (items)",
      status: "empty",
      detail: "仅状态标记，实际数据在 src/js/data/items.js (43+)",
    },
    {
      name: "📂 疾病 (diseases)",
      status: "empty",
      detail: "仅状态标记，实际数据在 src/js/data/illnesses.js",
    },
    // ===== Legacy 状态检测 =====
    ...getLegacyStatus(),
    // ===== Bridge 检测 =====
    ...bridge.checks.map((check) => ({
      name: `🔌 ${check.name}`,
      status: check.ok ? "ready" : "pending",
      detail: check.detail,
    })),
  ];

  return rows;
}

export function countEmptyDirectories(): number {
  const dirs = [CITY_SERVICE_ACTIONS.length > 0, LIFE_NODES.length > 0];
  const empty = dirs.filter((d) => !d).length;
  // 8 total TS dirs: events, jobs, locations, items, diseases, legal, travel, lifeNodes
  // plus cityServices as bridge data
  const totalDirs = 9;
  const filled = dirs.filter(Boolean).length;
  return totalDirs - filled;
}
