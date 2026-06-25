import { CITY_SERVICE_ACTIONS } from "../data/cityServices";
import { inspectBridgeHealth } from "../core/gameBridge";

export function buildHealthRows(): Array<{ name: string; status: string; detail: string }> {
  const bridge = inspectBridgeHealth();
  return [
    {
      name: "Vite + TypeScript",
      status: "ready",
      detail: "并行 Web App 壳已加载，不替代 legacy 正式入口。",
    },
    {
      name: "数据目录",
      status: "ready",
      detail: `已建立 8 个目标目录，当前 typed city services: ${CITY_SERVICE_ACTIONS.length}`,
    },
    ...bridge.checks.map((check) => ({
      name: check.name,
      status: check.ok ? "ready" : "pending",
      detail: check.detail,
    })),
  ];
}
