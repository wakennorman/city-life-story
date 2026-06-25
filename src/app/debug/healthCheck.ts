import { DATA_CATALOGS } from "../data";
import { inspectBridgeHealth } from "../core/gameBridge";

interface HealthRow {
  name: string;
  status: string;
  detail: string;
}

function checkDataDirectory(
  catalog: (typeof DATA_CATALOGS)[number],
): HealthRow {
  const count = catalog.count;
  return {
    name: `📂 ${catalog.name}`,
    status: count > 0 ? "ready" : "empty",
    detail:
      count > 0
        ? `${count} 条数据已填充（${catalog.bridgeStatus}；legacy: ${catalog.legacySource}）`
        : `仅状态标记，实际数据仍在 ${catalog.legacySource}`,
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
    ...DATA_CATALOGS.map(checkDataDirectory),
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
  return DATA_CATALOGS.filter((catalog) => catalog.count <= 0).length;
}
