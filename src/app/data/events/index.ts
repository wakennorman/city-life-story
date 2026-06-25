export const EVENT_CATALOG_STATUS = {
  migrated: 0,
  legacySource: "src/js/core/events_core.js + events_street.js + events_corp.js",
  nextStep: "新增事件优先进入 TypeScript 目录，再通过 bridge 注册到 legacy runtime。",
} as const;
