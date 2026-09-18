/**
 * scene3d 预览入口（开发用，不参与正式构建）
 *
 * 走完整的 createScene3D 路径（含热点层），以验证真实接入链路。
 * 用法：dev/scene3d-preview.html?loc=slum
 */

import { createScene3D, registerActions } from "../src/app/scene3d/index";

declare const LOCATIONS: Record<string, Record<string, unknown>>;
declare const JOB_META: Array<{ id: string; name: string; apCost: number }>;
declare const ACTIONS_BY_LOCATION: Record<
  string,
  Array<{ id: string; name: string; apCost: number }>
>;

interface W extends Window {
  __ready?: boolean;
  __lastAction?: string;
  __spec?: unknown;
  __scene3d?: unknown;
}

// 旧版 jobs 只有 id，名称在 jobs.js —— 构建时已抽取并通过 JOB_META 注入
registerActions(JOB_META);

const w = window as W;
const params = new URLSearchParams(location.search);
const id = params.get("loc") || "slum";
const loc = LOCATIONS[id];

const host = document.getElementById("app") as HTMLElement;
const status = document.getElementById("status") as HTMLElement;

if (!loc) {
  status.textContent = `未找到地点: ${id}`;
  w.__ready = true;
} else {
  const s3 = createScene3D({
    container: host,
    onAction: (actionId) => {
      status.textContent = `点击行动: ${actionId}`;
      w.__lastAction = actionId;
    },
    onUnavailable: (reason) => {
      status.textContent = `WebGL 不可用: ${reason}`;
    },
  });
  const spec = s3.show(loc, ACTIONS_BY_LOCATION[id]);
  const hotspots = document.querySelectorAll(".scene3d-hotspot").length;
  status.textContent =
    `${spec.name} · ${spec.type} · tier${spec.wealthTier} · ` +
    `建筑${spec.buildings.length} 道具${spec.props.length} 热点${hotspots}`;
  w.__scene3d = s3;
  w.__spec = spec;
  w.__ready = true;
}
