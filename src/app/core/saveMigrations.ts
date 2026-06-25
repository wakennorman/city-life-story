import type { LegacyGameState, WebAppSaveMeta } from "../types/game";

export const APP_SAVE_SCHEMA_VERSION = 1;

export function ensureWebAppSaveMeta(state: LegacyGameState): WebAppSaveMeta {
  const now = Date.now();
  const current = state._webApp;
  if (current && current.schemaVersion >= APP_SAVE_SCHEMA_VERSION) {
    return current;
  }

  const migrated: WebAppSaveMeta = {
    schemaVersion: APP_SAVE_SCHEMA_VERSION,
    firstMigratedAt: current?.firstMigratedAt ?? now,
    lastMigratedAt: now,
    cityServices: {
      used: current?.cityServices?.used ?? {},
      legalPrep: current?.cityServices?.legalPrep ?? 0,
      medicalRefunds: current?.cityServices?.medicalRefunds ?? 0,
      dayTrips: current?.cityServices?.dayTrips ?? 0,
      lastActionDay: current?.cityServices?.lastActionDay ?? null,
    },
  };

  state._webApp = migrated;
  return migrated;
}
