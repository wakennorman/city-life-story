export type MessageType = "info" | "success" | "danger" | "event" | "warning" | "hint";

export interface PlayerState {
  day: number;
  phase: "street" | "corporate" | string;
  actionPoints: number;
  maxActionPoints: number;
  physique?: number;
  intelligence?: number;
  mental?: number;
  charm?: number;
  morality?: number;
  fame?: number;
}

export interface ResourceState {
  cash: number;
  bankBalance?: number;
  debt?: number;
}

export interface NeedsState {
  hunger?: number;
  fatigue?: number;
  hygiene?: number;
  happiness?: number;
}

export interface LegacyGameState {
  version?: string;
  player: PlayerState;
  resources: ResourceState;
  needs: NeedsState;
  flags: Record<string, unknown>;
  trade?: {
    currentLocation?: string;
  };
  legal?: Record<string, unknown>;
  medical?: Record<string, unknown>;
  travel?: Record<string, unknown>;
  _webApp?: WebAppSaveMeta;
  [key: string]: unknown;
}

export interface WebAppSaveMeta {
  schemaVersion: number;
  firstMigratedAt: number;
  lastMigratedAt: number;
  cityServices: {
    used: Record<string, number>;
    legalPrep: number;
    medicalRefunds: number;
    dayTrips: number;
    lastActionDay: number | null;
  };
}

export interface LegacyStateManager {
  getState(): LegacyGameState;
  addMessage(text: string, type?: MessageType): void;
}

export interface LegacyWindow extends Window {
  StateManager?: LegacyStateManager;
  renderAll?: () => void;
  showModal?: (opts: {
    title: string;
    body: string;
    buttons: Array<{ text: string; cls?: string; callback?: () => boolean | void }>;
  }) => void;
  WebAppBridge?: {
    version: string;
    ensureSaveMeta: (state: LegacyGameState) => WebAppSaveMeta;
    showCityServiceModal: () => void;
    applyCityService: (id: string) => boolean;
  };
}
