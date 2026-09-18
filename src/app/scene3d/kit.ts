/**
 * scene3d · 生成器公共工具
 *
 * 把「造楼 / 撒道具 / 取色」这类原语抽出来，
 * 供 sceneSpec.ts（按 type 的默认形态）与 variants.ts（按 id 的专属形态）共用。
 */

import type { BuildingSpec, PropSpec, SceneType, WealthTier } from "./types";
import type { ScenePalette } from "./palette";

export const GROUND_W = 26;
export const GROUND_D = 22;

export interface Ctx {
  rnd: () => number;
  pal: ScenePalette;
  tier: WealthTier;
  type: SceneType;
  /** 地点 id —— 变体生成器据此细分形态 */
  id: string;
  /** 人流密度，决定道具与摊位数量 */
  density: number;
}

export type Generated = { buildings: BuildingSpec[]; props: PropSpec[] };
export type Generator = (ctx: Ctx) => Generated;

export function pick(list: string[], rnd: () => number): string {
  return list[Math.floor(rnd() * list.length) % list.length];
}

/** 生成一栋楼 */
export function block(
  ctx: Ctx,
  x: number,
  z: number,
  w: number,
  d: number,
  h: number,
  opts?: { roofShape?: BuildingSpec["roofShape"]; accent?: boolean; rotY?: number }
): BuildingSpec {
  const spec: BuildingSpec = {
    pos: { x, z },
    size: { w, d, h },
    body: pick(ctx.pal.buildingBodies, ctx.rnd),
    roof: pick(ctx.pal.buildingRoofs, ctx.rnd),
    roofShape: opts?.roofShape ?? "flat",
    windows: {
      rows: Math.max(1, Math.floor(h / 1.35)),
      cols: Math.max(1, Math.floor(w / 1.5)),
      color: ctx.pal.window,
      lit: ctx.tier === 1 ? 0.06 : ctx.tier === 2 ? 0.1 : 0.16,
    },
    rotY: opts?.rotY,
  };
  if (opts?.accent) spec.accent = pick(ctx.pal.accents, ctx.rnd);
  return spec;
}

/** 一次散布若干道具到矩形区域 */
export function scatter(
  ctx: Ctx,
  count: number,
  kinds: PropSpec["kind"][],
  area: { x0: number; x1: number; z0: number; z1: number },
  out: PropSpec[],
  colorPool?: string[]
): void {
  for (let i = 0; i < count; i++) {
    const x = area.x0 + ctx.rnd() * (area.x1 - area.x0);
    const z = area.z0 + ctx.rnd() * (area.z1 - area.z0);
    const p: PropSpec = {
      kind: kinds[Math.floor(ctx.rnd() * kinds.length) % kinds.length],
      pos: { x, z },
      rotY: ctx.rnd() * Math.PI * 2,
      scale: 0.85 + ctx.rnd() * 0.3,
    };
    if (colorPool && colorPool.length) p.color = pick(colorPool, ctx.rnd);
    out.push(p);
  }
}

/** 沿一条直线等距撒道具（路灯、行道树、围栏等） */
export function line(
  ctx: Ctx,
  count: number,
  kind: PropSpec["kind"],
  from: { x: number; z: number },
  to: { x: number; z: number },
  out: PropSpec[],
  opts?: { scale?: number; jitter?: number }
): void {
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const jx = opts?.jitter ? (ctx.rnd() - 0.5) * opts.jitter : 0;
    const jz = opts?.jitter ? (ctx.rnd() - 0.5) * opts.jitter : 0;
    out.push({
      kind,
      pos: { x: from.x + (to.x - from.x) * t + jx, z: from.z + (to.z - from.z) * t + jz },
      rotY: ctx.rnd() * Math.PI * 2,
      scale: opts?.scale ?? 1,
    });
  }
}

/** 便捷：按 id 判断是否命中某个特征词 */
export function idHas(id: string, ...words: string[]): boolean {
  const low = id.toLowerCase();
  return words.some((w) => low.includes(w.toLowerCase()));
}
