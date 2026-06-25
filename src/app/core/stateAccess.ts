import { ensureWebAppSaveMeta } from "./saveMigrations";
import type {
  LegacyGameState,
  LegacyWindow,
  MessageType,
  WebAppSaveMeta,
} from "../types/game";

const legacyWindow = window as LegacyWindow;

export function getLegacyState(): LegacyGameState | null {
  return legacyWindow.StateManager?.getState() ?? null;
}

export function getLocationId(state: LegacyGameState | null): string {
  return state?.trade?.currentLocation ?? "unknown";
}

export function addLegacyMessage(
  text: string,
  type: MessageType = "info",
): void {
  legacyWindow.StateManager?.addMessage(text, type);
}

export function renderLegacy(): void {
  legacyWindow.renderAll?.();
}

export function ensureAppMetaOnLegacyState(): WebAppSaveMeta | null {
  const state = getLegacyState();
  if (!state) return null;
  return ensureWebAppSaveMeta(state);
}

export function legacyRuntimeSummary(): Array<{
  label: string;
  value: string;
}> {
  const state = getLegacyState();
  return [
    {
      label: "StateManager",
      value: legacyWindow.StateManager ? "ready" : "missing",
    },
    { label: "showModal", value: legacyWindow.showModal ? "ready" : "missing" },
    { label: "renderAll", value: legacyWindow.renderAll ? "ready" : "missing" },
    {
      label: "Bridge",
      value: legacyWindow.WebAppBridge
        ? legacyWindow.WebAppBridge.version
        : "not loaded",
    },
    {
      label: "Legacy state",
      value: state ? `day ${state.player.day}` : "not started",
    },
  ];
}
