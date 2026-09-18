/**
 * scene3d · 热点层
 *
 * 用 DOM 元素做热点，不用 3D 精灵。理由：
 *   - 文字渲染清晰（可承载中文，不受贴图分辨率限制）
 *   - 天然可访问、可键盘操作、可被 CSS 主题化
 *   - 与游戏现有的「可点区域」交互语汇一致
 * 位置由 viewer.project() 每帧投影得到，视角一动就跟着动。
 */

import type { HotspotSpec } from "./types";
import type { SceneViewer } from "./viewer";

export interface HotspotHandle {
  element: HTMLElement;
  spec: HotspotSpec;
  /** 当前是否被遮挡（相机背后） */
  visible: boolean;
}

export class HotspotLayer {
  readonly root: HTMLElement;
  private items: HotspotHandle[] = [];
  private onPick: ((actionId: string) => void) | null = null;

  constructor(private viewer: SceneViewer) {
    this.root = document.createElement("div");
    this.root.className = "scene3d-hotspots";
    this.root.setAttribute("role", "group");
    this.root.setAttribute("aria-label", "地点可执行行动");
  }

  setPickHandler(fn: (actionId: string) => void): void {
    this.onPick = fn;
  }

  set(specs: HotspotSpec[]): void {
    this.clear();
    // 热点多时收紧外观，避免相互压盖
    this.root.classList.toggle("is-dense", specs.length > 6);
    for (const spec of specs) {
      const el = document.createElement("button");
      el.type = "button";
      el.className = "scene3d-hotspot";
      // 命名空间化：游戏自身行动卡片也用 data-action-id（render.js / tutorial.js），
      // 复用同名属性会让 tutorial 定位、自动滚动等逻辑误命中 3D 热点。
      el.dataset.scene3dAction = spec.actionId;
      el.innerHTML =
        `<span class="scene3d-hotspot__label">${escapeHtml(spec.label)}</span>` +
        (spec.apCost > 0 ? `<span class="scene3d-hotspot__ap">AP ${spec.apCost}</span>` : "");
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        this.onPick?.(spec.actionId);
      });
      // 拖拽旋转时不误触
      el.addEventListener("pointerdown", (e) => e.stopPropagation());

      this.root.appendChild(el);
      this.items.push({ element: el, spec, visible: true });
    }
  }

  /** 每帧调用：把世界坐标投到屏幕 */
  update(): void {
    for (const it of this.items) {
      const p = this.viewer.project(it.spec.pos.x, 1.7, it.spec.pos.z);
      if (!p) {
        if (it.visible) {
          it.element.style.opacity = "0";
          it.element.style.pointerEvents = "none";
          it.visible = false;
        }
        continue;
      }
      if (!it.visible) {
        it.element.style.opacity = "1";
        it.element.style.pointerEvents = "";
        it.visible = true;
      }
      it.element.style.transform = `translate(-50%, -100%) translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px)`;
    }
  }

  /** 按可用性置灰（AP 不足等） */
  setDisabled(actionIds: Set<string>): void {
    for (const it of this.items) {
      const off = actionIds.has(it.spec.actionId);
      it.element.classList.toggle("is-disabled", off);
      (it.element as HTMLButtonElement).disabled = off;
    }
  }

  clear(): void {
    for (const it of this.items) it.element.remove();
    this.items = [];
  }

  dispose(): void {
    this.clear();
    this.root.remove();
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}
