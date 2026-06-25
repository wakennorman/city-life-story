import { CITY_SERVICE_ACTIONS } from "../data/cityServices";
import { ensureWebAppSaveMeta } from "./saveMigrations";
import type { LegacyGameState, LegacyWindow } from "../types/game";

const legacyWindow = window as LegacyWindow;

export interface BridgeHealth {
  ok: boolean;
  checks: Array<{ name: string; ok: boolean; detail: string }>;
}

export function inspectBridgeHealth(): BridgeHealth {
  const state = legacyWindow.StateManager?.getState();
  const checks = [
    {
      name: "legacy StateManager",
      ok: Boolean(legacyWindow.StateManager),
      detail: legacyWindow.StateManager ? "可读取旧游戏状态" : "旧游戏尚未在同一窗口加载",
    },
    {
      name: "typed city service data",
      ok: CITY_SERVICE_ACTIONS.length >= 3,
      detail: `${CITY_SERVICE_ACTIONS.length} 个城市服务行动`,
    },
    {
      name: "save migration facade",
      ok: true,
      detail: `schema v${state ? ensureWebAppSaveMeta(state as LegacyGameState).schemaVersion : 1}`,
    },
    {
      name: "legacy runtime bridge",
      ok: Boolean(legacyWindow.WebAppBridge),
      detail: legacyWindow.WebAppBridge?.version ?? "Vite 壳内不强制要求",
    },
  ];
  return { ok: checks.every((check) => check.ok || check.name === "legacy StateManager"), checks };
}
