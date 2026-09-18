/**
 * scene3d · 场景推导层
 *
 * 输入：游戏地点数据（id / name / type / wealthTier / footfall）
 * 输出：SceneSpec（纯数据，不含 three 依赖）
 *
 * 两级形态解析：
 *   1. 先查 VARIANTS[id]  —— 该地点的专属形态（公园 ≠ 寺庙，菜市场 ≠ 汽车城）
 *   2. 未命中则退回 GENERATORS[type] —— 按类型的通用形态
 *
 * 这样新增地点时：type 在枚举内就自动有场景；
 * 想让它长得特别，只需在 variants.ts 加一条，不动其他代码。
 */

import type {
  SceneSpec,
  SceneType,
  WealthTier,
  LocationLike,
  BuildingSpec,
  PropSpec,
} from "./types";
import { paletteForLocation, makeRng } from "./palette";
import { GROUND_W, GROUND_D, block, scatter, type Ctx, type Generator } from "./kit";
import { VARIANTS } from "./variants";

const KNOWN_TYPES: SceneType[] = [
  "residential",
  "commercial",
  "industrial",
  "institutional",
  "corporate",
  "service",
  "recreation",
  "public",
  "education",
];

function normalizeType(raw?: string): SceneType {
  if (raw && (KNOWN_TYPES as string[]).includes(raw)) return raw as SceneType;
  return "service";
}

function normalizeTier(raw?: number): WealthTier {
  return raw === 1 || raw === 3 ? raw : 2;
}

/* ─────────────────────────── 按类型的默认形态 ─────────────────────────── */

/** 住宅：沿街两排楼，中间巷道 */
const residential: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { tier, rnd } = ctx;

  const floors = tier === 1 ? 4 : tier === 2 ? 6 : 9;
  const gap = tier === 1 ? 0.5 : tier === 2 ? 1.6 : 3.2;
  const cols = tier === 1 ? 5 : tier === 2 ? 4 : 3;

  for (let side = 0; side < 2; side++) {
    const z = side === 0 ? -6.4 : 6.4;
    for (let i = 0; i < cols; i++) {
      const seg = GROUND_W / cols;
      const x = -GROUND_W / 2 + seg * (i + 0.5);
      const h = floors * (0.95 + rnd() * 0.35);
      buildings.push(
        block(ctx, x, z, seg - gap, 5.4, h, {
          roofShape: tier === 1 ? "flat" : "gable",
          accent: tier === 1 && rnd() > 0.55,
          rotY: tier === 1 ? (rnd() - 0.5) * 0.06 : 0,
        })
      );
    }
  }

  if (tier === 1) {
    scatter(ctx, 10, ["ac_unit", "antenna", "trash", "crate", "bike"], { x0: -11, x1: 11, z0: -3.2, z1: 3.2 }, props);
    scatter(ctx, 4, ["pole", "lamp"], { x0: -11, x1: 11, z0: -0.6, z1: 0.6 }, props);
  } else if (tier === 2) {
    scatter(ctx, 12, ["tree", "bench", "bike", "trash"], { x0: -11, x1: 11, z0: -2.6, z1: 2.6 }, props);
    scatter(ctx, 5, ["lamp"], { x0: -11, x1: 11, z0: -0.4, z1: 0.4 }, props);
  } else {
    scatter(ctx, 14, ["tree", "flowerbed", "bench"], { x0: -11, x1: 11, z0: -2.8, z1: 2.8 }, props);
    scatter(ctx, 6, ["lamp"], { x0: -11, x1: 11, z0: -0.3, z1: 0.3 }, props);
    props.push({ kind: "fence", pos: { x: -12.4, z: 0 }, rotY: Math.PI / 2 });
    props.push({ kind: "fence", pos: { x: 12.4, z: 0 }, rotY: Math.PI / 2 });
    props.push({ kind: "gate", pos: { x: 0, z: 9.6 } });
  }
  return { buildings, props };
};

/** 商业：临街铺面 + 摊位 + 招牌 */
const commercial: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { tier, rnd } = ctx;

  const floors = tier === 1 ? 2 : tier === 2 ? 3 : 7;
  const cols = 6;
  for (let i = 0; i < cols; i++) {
    const seg = GROUND_W / cols;
    const x = -GROUND_W / 2 + seg * (i + 0.5);
    buildings.push(
      block(ctx, x, -7.2, seg - 0.6, 6, floors * (1.0 + rnd() * 0.3), {
        roofShape: tier === 3 ? "flat" : "gable",
        accent: true,
      })
    );
  }
  if (tier === 3) {
    for (let i = 0; i < 3; i++) {
      buildings.push(block(ctx, -8 + i * 8, 8.2, 5.2, 5.2, 12 + rnd() * 5, { roofShape: "flat" }));
    }
  }

  scatter(ctx, Math.round(6 + ctx.density * 8), ["stall", "crate"], { x0: -11, x1: 11, z0: -2.4, z1: 2.4 }, props);
  scatter(ctx, Math.round(4 + ctx.density * 5), ["sign", "billboard"], { x0: -11, x1: 11, z0: -3.6, z1: 3.6 }, props);
  scatter(ctx, 5, ["car", "bike"], { x0: -11, x1: 11, z0: 3.6, z1: 5.4 }, props);
  scatter(ctx, 4, ["lamp", "pole"], { x0: -11, x1: 11, z0: -0.4, z1: 0.4 }, props);
  return { buildings, props };
};

/** 工业：大跨度厂房 + 货柜 + 渣土 */
const industrial: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { tier, rnd } = ctx;

  for (let i = 0; i < 3; i++) {
    buildings.push(block(ctx, -8.6 + i * 8.6, -7, 7.6, 7, 4.2 + rnd() * 2.2, { roofShape: "sawtooth" }));
  }
  buildings.push(block(ctx, 11.4, -6, 1.6, 1.6, 14 + rnd() * 4, { roofShape: "flat", accent: true }));

  scatter(ctx, 8, ["container", "crate"], { x0: -11, x1: 4, z0: 2, z1: 7 }, props);
  scatter(ctx, 6, ["barrier", "pole"], { x0: -11, x1: 11, z0: -2.4, z1: 2.4 }, props);
  scatter(ctx, 4, ["car"], { x0: -11, x1: 11, z0: 7.4, z1: 9 }, props);
  if (tier === 1) {
    scatter(ctx, 10, ["crate", "barrier", "trash"], { x0: -11, x1: 11, z0: -1.5, z1: 4 }, props);
    props.push({ kind: "fence", pos: { x: 0, z: 9.8 } });
  }
  return { buildings, props };
};

/** 校园 */
const campus: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd } = ctx;

  buildings.push(block(ctx, 0, -8, 14, 6, 8 + rnd() * 2, { roofShape: "hip", accent: true }));
  buildings.push(block(ctx, -9.5, -7.4, 6, 5.4, 5.4, { roofShape: "gable" }));
  buildings.push(block(ctx, 9.5, -7.4, 6, 5.4, 5.4, { roofShape: "gable" }));

  scatter(ctx, 14, ["tree", "bush"], { x0: -11, x1: 11, z0: -2, z1: 8 }, props);
  scatter(ctx, 6, ["bench"], { x0: -8, x1: 8, z0: 0, z1: 4 }, props);
  scatter(ctx, 5, ["lamp"], { x0: -11, x1: 11, z0: -1, z1: 1 }, props);
  props.push({ kind: "statue", pos: { x: 0, z: 2 } });
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 } });
  return { buildings, props };
};

/** 企业园区：玻璃塔 + 水景 */
const corporate: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd } = ctx;

  buildings.push(block(ctx, -4, -8.4, 9, 7, 16 + rnd() * 6, { roofShape: "flat" }));
  buildings.push(block(ctx, 6.4, -7.6, 7, 6, 11 + rnd() * 5, { roofShape: "flat" }));
  buildings.push(block(ctx, 11.6, 2, 4.6, 6, 7, { roofShape: "flat" }));

  scatter(ctx, 12, ["tree", "bush"], { x0: -11, x1: 11, z0: 2, z1: 8 }, props);
  scatter(ctx, 6, ["flowerbed", "bench"], { x0: -9, x1: 9, z0: 1, z1: 5 }, props);
  scatter(ctx, 4, ["car"], { x0: -8, x1: 8, z0: 7.6, z1: 9 }, props);
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 } });
  return { buildings, props };
};

/** 政务/服务：主楼 + 大广场 + 旗杆 */
const service: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd } = ctx;

  buildings.push(block(ctx, 0, -8.4, 16, 6.4, 8 + rnd() * 3, { roofShape: "flat", accent: true }));
  if (rnd() > 0.5) {
    buildings.push(block(ctx, -10.4, -7.6, 5, 5.4, 5, { roofShape: "flat" }));
    buildings.push(block(ctx, 10.4, -7.6, 5, 5.4, 5, { roofShape: "flat" }));
  }

  scatter(ctx, 8, ["tree", "bush"], { x0: -11, x1: 11, z0: 2, z1: 8 }, props);
  scatter(ctx, 6, ["lamp"], { x0: -10, x1: 10, z0: -1, z1: 3 }, props);
  scatter(ctx, 4, ["bench"], { x0: -8, x1: 8, z0: 2, z1: 5 }, props);
  scatter(ctx, 4, ["car"], { x0: -9, x1: 9, z0: 7.4, z1: 9 }, props);
  props.push({ kind: "pole", pos: { x: 0, z: 1.2 }, scale: 1.6 });
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 } });
  return { buildings, props };
};

/** 休闲（默认：绿地主导） */
const recreation: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd, tier } = ctx;

  buildings.push(block(ctx, -7, -8, 8, 6, tier === 3 ? 9 + rnd() * 4 : 4.5 + rnd() * 2, {
    roofShape: tier === 3 ? "flat" : "hip",
    accent: true,
  }));
  buildings.push(block(ctx, 7, -7.6, 6, 5.4, 4.5 + rnd() * 2, { roofShape: "hip" }));

  scatter(ctx, 20, ["tree", "bush", "flowerbed"], { x0: -11, x1: 11, z0: -1, z1: 8 }, props);
  scatter(ctx, 8, ["bench"], { x0: -9, x1: 9, z0: 0, z1: 5 }, props);
  scatter(ctx, 5, ["lamp"], { x0: -11, x1: 11, z0: -1.4, z1: 1.4 }, props);
  scatter(ctx, 3, ["statue"], { x0: -6, x1: 6, z0: 3, z1: 6 }, props);
  props.push({ kind: "gate", pos: { x: 0, z: 9.8 } });
  return { buildings, props };
};

/** 社区 */
const publicSpace: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd } = ctx;

  buildings.push(block(ctx, -3, -7.6, 10, 6, 5 + rnd() * 2, { roofShape: "gable", accent: true }));
  buildings.push(block(ctx, 7.4, -7, 5, 5, 3.6, { roofShape: "flat" }));

  scatter(ctx, 10, ["tree", "bush"], { x0: -11, x1: 11, z0: 0, z1: 7 }, props);
  scatter(ctx, 8, ["bench"], { x0: -8, x1: 8, z0: 0, z1: 5 }, props);
  scatter(ctx, 4, ["lamp"], { x0: -9, x1: 9, z0: -1, z1: 2 }, props);
  scatter(ctx, 6, ["bike"], { x0: -9, x1: 9, z0: 5.5, z1: 7.5 }, props);
  return { buildings, props };
};

/** 教育 */
const education: Generator = (ctx) => {
  const buildings: BuildingSpec[] = [];
  const props: PropSpec[] = [];
  const { rnd } = ctx;

  buildings.push(block(ctx, 0, -8.2, 15, 6, 6.5 + rnd() * 2.5, { roofShape: "flat", accent: true }));
  if (rnd() > 0.45) buildings.push(block(ctx, 10.6, -7, 4.6, 5, 4.2, { roofShape: "gable" }));

  scatter(ctx, 10, ["tree", "bush"], { x0: -11, x1: 11, z0: 1, z1: 8 }, props);
  scatter(ctx, 6, ["bench", "flowerbed"], { x0: -8, x1: 8, z0: 0, z1: 4 }, props);
  scatter(ctx, 5, ["lamp"], { x0: -10, x1: 10, z0: -1, z1: 2 }, props);
  scatter(ctx, 5, ["bike"], { x0: -9, x1: 9, z0: 6, z1: 8 }, props);
  props.push({ kind: "sign", pos: { x: -6, z: 4.5 } });
  return { buildings, props };
};

const GENERATORS: Record<SceneType, Generator> = {
  residential,
  commercial,
  industrial,
  institutional: campus,
  corporate,
  service,
  recreation,
  public: publicSpace,
  education,
};

/* ─────────────────────────── 对外入口 ─────────────────────────── */

export function buildSceneSpec(location: LocationLike): SceneSpec {
  const type = normalizeType(location.type);
  const tier = normalizeTier(location.wealthTier);
  const density = Math.min(2, Math.max(0.2, location.footfall ?? 0.7));
  const pal = paletteForLocation(tier, type);

  const ctx: Ctx = {
    rnd: makeRng(`${location.id}|${type}|${tier}`),
    pal,
    tier,
    type,
    id: location.id,
    density,
  };

  const gen = VARIANTS[location.id] ?? GENERATORS[type];
  const { buildings, props } = gen(ctx);

  const hasRoad = type === "commercial" || type === "industrial" || type === "residential";
  const isBig = type === "corporate" || type === "commercial";

  return {
    id: location.id,
    name: location.name,
    type,
    wealthTier: tier,
    footfall: density,
    sky: pal.sky,
    fog: { color: pal.fog, near: 26, far: 62 },
    lightIntensity: pal.lightIntensity,
    camera: {
      distance: isBig ? 34 : 30,
      height: type === "residential" && tier === 1 ? 16 : 19,
      yaw: Math.PI / 4,
    },
    ground: {
      size: { w: GROUND_W, d: GROUND_D },
      base: pal.groundBase,
      curb: pal.curb,
      road: hasRoad ? { x: 0, w: type === "industrial" ? 7 : 5.2, color: pal.road } : undefined,
      patches:
        tier === 3 ? [{ pos: { x: 0, z: 0 }, w: 20, d: 10, color: pal.curb }] : undefined,
    },
    buildings,
    props,
  };
}
