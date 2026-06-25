import { CITY_SERVICE_ACTIONS } from "./cityServices";
import { DISEASES } from "./diseases";
import { EVENTS } from "./events";
import { ITEMS } from "./items";
import { JOBS } from "./jobs";
import { LEGAL_CASES } from "./legal";
import { LIFE_NODES } from "./lifeNodes";
import { LOCATIONS } from "./locations";
import { TRAVEL_DESTINATIONS } from "./travel";

export { CITY_SERVICE_ACTIONS } from "./cityServices";
export { DISEASES } from "./diseases";
export type { Disease } from "./diseases";
export { EVENTS } from "./events";
export type { GameEvent } from "./events";
export { ITEMS } from "./items";
export type { Item } from "./items";
export { JOBS } from "./jobs";
export type { Job } from "./jobs";
export { LEGAL_CASES } from "./legal";
export type { LegalCase } from "./legal";
export { LIFE_NODES } from "./lifeNodes";
export { LOCATIONS } from "./locations";
export type { Location } from "./locations";
export { TRAVEL_DESTINATIONS } from "./travel";
export type { TravelDestination } from "./travel";

export interface DataCatalogDescriptor {
  id: string;
  name: string;
  count: number;
  legacySource: string;
  bridgeStatus: "playable" | "typed" | "partial";
  description: string;
}

export const DATA_CATALOGS: DataCatalogDescriptor[] = [
  {
    id: "cityServices",
    name: "城市服务",
    count: CITY_SERVICE_ACTIONS.length,
    legacySource: "src/js/app_bridge/webapp_runtime_bridge.js",
    bridgeStatus: "playable",
    description: "已通过城市服务中心进入旧行动列表。",
  },
  {
    id: "lifeNodes",
    name: "人生节点",
    count: LIFE_NODES.length,
    legacySource: "src/js/core/life_nodes.js",
    bridgeStatus: "partial",
    description: "TS 目录已有节点配置；旧侧仍负责弹窗与管线触发。",
  },
  {
    id: "events",
    name: "事件",
    count: EVENTS.length,
    legacySource: "src/js/core/events_street.js + events_corp.js",
    bridgeStatus: "typed",
    description: "新增一批城市生存事件，作为后续事件 bridge 的数据源。",
  },
  {
    id: "jobs",
    name: "职业",
    count: JOBS.length,
    legacySource: "src/js/data/jobs.js",
    bridgeStatus: "typed",
    description: "覆盖街头、自由职业、公共服务和公司线入口。",
  },
  {
    id: "locations",
    name: "地点",
    count: LOCATIONS.length,
    legacySource: "src/js/data/locations.js",
    bridgeStatus: "typed",
    description: "每个地点保留行动、服务、NPC 三类关联。",
  },
  {
    id: "items",
    name: "物品",
    count: ITEMS.length,
    legacySource: "src/js/data/items.js + goods.js",
    bridgeStatus: "typed",
    description: "补齐工具、装备、消耗品、纪念品和特殊凭证。",
  },
  {
    id: "diseases",
    name: "疾病",
    count: DISEASES.length,
    legacySource: "src/js/data/illnesses.js + src/js/core/medical.js",
    bridgeStatus: "typed",
    description: "按触发条件、症状、治疗、医保和并发症建模。",
  },
  {
    id: "legal",
    name: "法律案件",
    count: LEGAL_CASES.length,
    legacySource: "src/js/core/legal.js",
    bridgeStatus: "typed",
    description: "覆盖劳动、民事、行政和轻微治安处罚。",
  },
  {
    id: "travel",
    name: "旅行目的地",
    count: TRAVEL_DESTINATIONS.length,
    legacySource: "src/js/core/travel.js",
    bridgeStatus: "partial",
    description: "旧侧 5 个目的地仍可玩，TS 侧新增本城环线/杭州/深圳等扩展数据。",
  },
];

export const CONTENT_CATALOG_SUMMARY = {
  totalCatalogs: DATA_CATALOGS.length,
  filledCatalogs: DATA_CATALOGS.filter((catalog) => catalog.count > 0).length,
  totalRecords: DATA_CATALOGS.reduce((sum, catalog) => sum + catalog.count, 0),
  playableCatalogs: DATA_CATALOGS.filter(
    (catalog) => catalog.bridgeStatus === "playable",
  ).length,
} as const;

export function getEmptyCatalogs(): DataCatalogDescriptor[] {
  return DATA_CATALOGS.filter((catalog) => catalog.count <= 0);
}
