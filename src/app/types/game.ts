export type MessageType =
  "info" | "success" | "danger" | "event" | "warning" | "hint";

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
  health?: number;
  age?: number;
}

export interface ResourceState {
  cash: number;
  bankBalance?: number;
  debt?: number;
  loan?: number;
}

export interface NeedsState {
  hunger?: number;
  fatigue?: number;
  hygiene?: number;
  happiness?: number;
}

export interface WeatherState {
  current?: string;
  temperature?: number;
  season?: string;
  forecast?: Array<{
    weather: string;
    temp: number;
  }>;
  duration?: number;
  daysActive?: number;
}

export interface NpcRelationshipsState {
  [npcId: string]: {
    affinity: number;
    discovered?: Record<string, boolean>;
    presenceChance?: number;
    _unlocked?: Record<string, boolean>;
    interactionHistory?: Array<{
      day: number;
      type: string;
      delta: number;
      message: string;
    }>;
  };
}

export interface TradeState {
  currentLocation?: string;
  priceMemory?: Record<string, unknown>;
  visitedToday?: Record<string, boolean>;
}

export interface MedicalState {
  insurance?: "basic" | "supplement" | "premium";
  insuranceMonths?: number;
  treatment?: {
    active: boolean;
    type: string;
    daysRemaining: number;
    cost: number;
  };
  recovery?: {
    active: boolean;
    daysRemaining: number;
  };
  billingReviews?: number;
  costAwareness?: number;
}

export interface LegalState {
  caseType?: string;
  caseStage?: "filing" | "evidence" | "trial" | "verdict";
  daysRemaining?: number;
  lawyerLevel?: number;
  lawyerCost?: number;
  prepScore?: number;
  caseConfidence?: number;
}

export interface TravelState {
  active?: boolean;
  destination?: string | null;
  daysRemaining?: number;
  visitedDestinations?: string[];
  localFamiliarity?: number;
  dayTrips?: number;
}

export interface SideHustleState {
  active?: string | null;
  income?: number;
  fatigue?: number;
  reputation?: number;
}

export interface StartupState {
  company?: {
    name: string;
    industry: string;
    product: string;
    valuation: number;
    stage: string;
    employees: Record<string, number>;
    cash: number;
    burnRate: number;
  };
}

export interface WebAppSaveMeta {
  schemaVersion: number;
  firstMigratedAt: number;
  lastMigratedAt: number;
  cityServices: {
    used: Record<string, number>;
    followUps: Record<string, boolean>;
    legalPrep: number;
    medicalRefunds: number;
    dayTrips: number;
    lastActionDay: number | null;
    lastTickDay?: number | null;
  };
}

export interface NpcSkillUnlocks {
  _unlocked_aunt_wang_cooking?: boolean;
  _unlocked_boss_li_sales?: boolean;
  _unlocked_sister_zhang_physique?: boolean;
  _unlocked_old_zhou_repair?: boolean;
  _unlocked_xiao_mei_charm?: boolean;
}

export interface EraState {
  phase?: string;
  day?: number;
  inflation?: number;
  industryBoost?: Record<string, number>;
}

export interface LegacyGameState {
  version?: string;
  player: PlayerState;
  resources: ResourceState;
  needs: NeedsState;
  flags: Record<string, unknown>;
  weather?: WeatherState;
  trade?: TradeState;
  npcRelationships?: NpcRelationshipsState;
  legal?: LegalState;
  medical?: MedicalState;
  travel?: TravelState;
  sideHustle?: SideHustleState;
  startup?: StartupState;
  era?: EraState;
  skills?: Record<string, { level: number; xp: number }>;
  inventory?: Array<{
    id: string;
    name: string;
    quality?: string;
    durability?: number;
    maxDurability?: number;
  }>;
  stats?: Record<string, number>;
  _webApp?: WebAppSaveMeta;
  _moralScore?: number;
  _npcAffinityEventsSeen?: Record<string, boolean>;
  _npcSkillUnlocks?: NpcSkillUnlocks;
  _pendingLifeNode?: unknown;
  [key: string]: unknown;
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
    buttons: Array<{
      text: string;
      cls?: string;
      callback?: () => boolean | void;
    }>;
  }) => void;
  WebAppBridge?: {
    version: string;
    ensureSaveMeta: (state: LegacyGameState) => WebAppSaveMeta;
    showCityServiceModal: () => void;
    applyCityService: (id: string) => boolean;
    tickCityServices: (state: LegacyGameState) => void;
    getRecommendedCityServices?: (state: LegacyGameState) => unknown[];
    getDataCatalogSummary?: () => {
      version: string;
      totalRecords: number;
      catalogs: Array<{
        id: string;
        name: string;
        count: number;
        status: string;
      }>;
    };
  };
}
