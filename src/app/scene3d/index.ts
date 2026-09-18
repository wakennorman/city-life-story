/**
 * scene3d · 对外统一入口
 *
 * 用法：
 *   const s3 = createScene3D({ container: el, onAction: id => runAction(id) });
 *   s3.show(location);        // location 为游戏的地点数据对象
 *   s3.dispose();
 *
 * 对游戏的接入面只有这三个方法 —— 内部实现可随意替换，
 * 保证 3D 层与 36 万行逻辑层完全解耦。
 */

import type { ActionInfo, HotspotSpec, LocationLike, SceneSpec } from "./types";
import { buildSceneSpec } from "./sceneSpec";
import { SceneViewer } from "./viewer";
import { HotspotLayer } from "./hotspots";

export type {
  SceneSpec,
  HotspotSpec,
  LocationLike,
  ActionInfo,
  SceneType,
  WealthTier,
} from "./types";
export { buildSceneSpec } from "./sceneSpec";
export { disposeCaches } from "./builder";

/**
 * 行动元数据注册表。
 *
 * 存在的原因：旧版 locations.js 的 `jobs` 只有 id，名称定义在 jobs.js。
 * 游戏启动时调一次 registerActions() 把 id → {name, apCost} 灌进来，
 * 3D 层就能把 jobs 渲染成带中文名的热点，无需反向依赖 jobs.js。
 */
const ACTION_REGISTRY = new Map<string, ActionInfo>();

export function registerActions(list: ActionInfo[]): void {
  for (const a of list) ACTION_REGISTRY.set(a.id, a);
}

export function getRegisteredAction(id: string): ActionInfo | undefined {
  return ACTION_REGISTRY.get(id);
}

export interface Scene3DOptions {
  container: HTMLElement;
  /** 点击热点时回调，参数为行动 id（对应 Location.availableActions[].id） */
  onAction?: (actionId: string) => void;
  /** 渲染降级回调（WebGL 不可用时） */
  onUnavailable?: (reason: string) => void;
  /**
   * 是否渲染行动热点。默认 true。
   * 侧栏微缩景这类窄容器应设为 false —— 250px 宽度下热点会互相压盖。
   */
  hotspots?: boolean;
}

export interface Scene3DHandle {
  /**
   * 载入某个地点的 3D 场景。
   * @param location 游戏地点数据
   * @param actions  可选的行动列表；不传则从 location 自动解析
   */
  show(location: LocationLike, actions?: ActionInfo[]): SceneSpec;
  /** 更新热点可用状态（例如 AP 不足置灰） */
  setDisabledActions(actionIds: string[]): void;
  /** 手动触发一次重绘 */
  requestRender(): void;
  resize(): void;
  dispose(): void;
  readonly spec: SceneSpec | null;
}

/**
 * 样式用运行时注入而非 CSS 文件引入。
 * 原因：本项目有两条构建管线（vite 走 src/app、python build.py 走旧拼接），
 * 运行时注入在两条管线下行为一致，避免 CSS 导入在旧管线中失效。
 */
const STYLE_ID = "scene3d-style";
function injectStyles(): void {
  if (document.getElementById(STYLE_ID)) return;
  const el = document.createElement("style");
  el.id = STYLE_ID;
  el.textContent = `
.scene3d-stage { border-radius: 10px; overflow: hidden; background: #b9b3a4; }
.scene3d-hotspots { pointer-events: none; }
.scene3d-hotspot {
  position: absolute; left: 0; top: 0;
  pointer-events: auto; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
  padding: 5px 11px; border-radius: 999px;
  border: 1px solid rgba(120,104,80,.45);
  background: rgba(252,249,240,.94);
  color: #4a3f30; font: 400 12px/1.2 var(--font-sans, system-ui, sans-serif);
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(60,48,32,.18);
  transition: background .14s, transform .14s, opacity .18s;
  backdrop-filter: blur(2px);
}
.scene3d-hotspot::after {
  content: ""; position: absolute; left: 50%; bottom: -7px;
  width: 1px; height: 7px; transform: translateX(-50%);
  background: rgba(120,104,80,.5);
}
.scene3d-hotspot:hover { background: #fff; transform: translate(-50%, -100%) scale(1.05); }
.scene3d-hotspot:focus-visible { outline: 2px solid #a8763f; outline-offset: 2px; }
.scene3d-hotspot__label { font-weight: 500; }
.scene3d-hotspot__ap {
  font-size: 11px; color: #8a7a62;
  border-left: 1px solid rgba(120,104,80,.3); padding-left: 6px;
}
.scene3d-hotspot.is-disabled {
  opacity: .42; cursor: not-allowed; filter: grayscale(.5);
}
.scene3d-hotspots.is-dense .scene3d-hotspot {
  padding: 3px 8px; font-size: 11px; gap: 4px;
}
.scene3d-hotspots.is-dense .scene3d-hotspot__ap {
  font-size: 10px; padding-left: 4px;
}
.scene3d-fallback {
  display: flex; align-items: center; justify-content: center;
  height: 100%; color: #6d6252; font: 400 13px var(--font-sans, system-ui, sans-serif);
  text-align: center; padding: 20px;
}
@media (prefers-reduced-motion: reduce) {
  .scene3d-hotspot { transition: none; }
}
`;
  document.head.appendChild(el);
}

/**
 * 解析地点可执行的行动，优先序：
 *   1. 调用方显式传入
 *   2. location.availableActions（新版 TS 数据）
 *   3. location.jobs + ACTION_REGISTRY（旧版数据）
 */
function resolveActions(location: LocationLike, explicit?: ActionInfo[]): ActionInfo[] {
  if (explicit && explicit.length) return explicit;
  if (location.availableActions?.length) return location.availableActions;

  if (location.jobs?.length) {
    const out: ActionInfo[] = [];
    for (const id of location.jobs) {
      const meta = ACTION_REGISTRY.get(id);
      out.push(meta ?? { id, name: id, apCost: 0 });
    }
    return out;
  }
  return [];
}

/**
 * 把地点的行动铺成场景中的热点位置。
 *
 * 自适应网格：行动少的（1–4 个）排一行居中；多的（如商业区 13 个零工）
 * 拆成多行并收窄间距。行数不超过 3，避免热点爬到场景顶部压住建筑。
 */
function layoutHotspots(spec: SceneSpec, actions: ActionInfo[]): HotspotSpec[] {
  const n = actions.length;
  if (n === 0) return [];

  const perRow = n <= 4 ? n : Math.min(5, Math.ceil(Math.sqrt(n * 1.6)));
  const rows = Math.ceil(n / perRow);

  // 横向铺开范围随每行数量收缩，保证点间距足够
  const spanX = Math.min(spec.ground.size.w * 0.68, Math.max(9, perRow * 3.4));
  // 纵向：3 行时从 2.8 铺到 8.6
  const zTop = 3.0;
  const zBottom = rows === 1 ? 3.6 : rows === 2 ? 6.6 : 8.6;
  const zStep = rows > 1 ? (zBottom - zTop) / (rows - 1) : 0;

  const out: HotspotSpec[] = [];
  actions.forEach((a, i) => {
    const row = Math.floor(i / perRow);
    const col = i % perRow;
    const countInRow = Math.min(perRow, n - row * perRow);
    // 行内居中：数量少的行向中间收拢
    const step = countInRow > 1 ? spanX / (countInRow - 1) : 0;
    const rowSpan = step * (countInRow - 1);
    const x = countInRow > 1 ? -rowSpan / 2 + step * col : 0;
    const z = rows === 1 ? zBottom : zTop + zStep * row;
    out.push({ actionId: a.id, label: a.name, apCost: a.apCost, pos: { x, z } });
  });
  return out;
}

export function createScene3D(opts: Scene3DOptions): Scene3DHandle {
  const { container, onAction, onUnavailable } = opts;
  const wantHotspots = opts.hotspots !== false;
  injectStyles();

  // WebGL 可用性探测 —— 不可用时交给调用方降级回 DOM 视图
  let viewer: SceneViewer;
  try {
    viewer = new SceneViewer();
  } catch (err) {
    onUnavailable?.(err instanceof Error ? err.message : "WebGL 初始化失败");
    return {
      show: () => {
        throw new Error("scene3d unavailable");
      },
      setDisabledActions: () => {},
      requestRender: () => {},
      resize: () => {},
      dispose: () => {},
      spec: null,
    };
  }

  const hotspots = new HotspotLayer(viewer);
  hotspots.setPickHandler((id) => onAction?.(id));

  // 热点层叠在画布之上
  const stage = document.createElement("div");
  stage.className = "scene3d-stage";
  stage.style.position = "relative";
  stage.style.width = "100%";
  stage.style.height = "100%";
  container.appendChild(stage);

  const canvasHost = document.createElement("div");
  canvasHost.className = "scene3d-canvas-host";
  canvasHost.style.position = "absolute";
  canvasHost.style.inset = "0";
  stage.appendChild(canvasHost);

  hotspots.root.style.position = "absolute";
  hotspots.root.style.inset = "0";
  hotspots.root.style.pointerEvents = "none";
  stage.appendChild(hotspots.root);

  viewer.mount(canvasHost);
  viewer.onAfterRender(() => hotspots.update());

  let current: SceneSpec | null = null;

  return {
    show(location: LocationLike, actions?: ActionInfo[]): SceneSpec {
      const spec = buildSceneSpec(location);
      viewer.load(spec);
      hotspots.set(
        wantHotspots ? layoutHotspots(spec, resolveActions(location, actions)) : []
      );
      current = spec;
      viewer.requestRender();
      return spec;
    },
    setDisabledActions(actionIds: string[]): void {
      hotspots.setDisabled(new Set(actionIds));
    },
    requestRender(): void {
      viewer.requestRender();
    },
    resize(): void {
      viewer.resize();
    },
    dispose(): void {
      hotspots.dispose();
      viewer.dispose();
      stage.remove();
    },
    get spec(): SceneSpec | null {
      return current;
    },
  };
}
