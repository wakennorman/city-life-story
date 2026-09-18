/**
 * scene3d · 渲染器与交互
 *
 * 职责：
 *   - 建立 WebGL 渲染器 / 等轴相机 / 光照 / 雾
 *   - 拖拽旋转、滚轮缩放、双击复位（自研，不引入 addons）
 *   - 按需渲染（闲置时停帧，省电省 CPU —— 这是网页游戏必须做的）
 *   - 把世界坐标投影成屏幕坐标，供 DOM 热点层定位
 */

import * as THREE from "three";
import type { SceneSpec } from "./types";
import { buildScene, disposeCaches, type BuiltScene } from "./builder";

export interface ViewerOptions {
  /** 像素比上限，防止高分屏拖垮帧率 */
  maxPixelRatio?: number;
}

export class SceneViewer {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;

  private container: HTMLElement | null = null;
  private current: BuiltScene | null = null;
  private spec: SceneSpec | null = null;

  private sun: THREE.DirectionalLight;
  private hemi: THREE.HemisphereLight;
  private resizeObserver: ResizeObserver | null = null;

  // 相机轨道状态
  private yaw = Math.PI / 4;
  private pitch = 0.72;
  private distance = 30;
  private targetY = 2;
  private targetYaw = Math.PI / 4;
  private targetPitch = 0.72;
  private targetDist = 30;

  private needRender = true;
  private raf = 0;
  private disposed = false;
  private dragging = false;
  private lastX = 0;
  private lastY = 0;
  private readonly maxPR: number;

  constructor(opts: ViewerOptions = {}) {
    this.maxPR = opts.maxPixelRatio ?? 2;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.5, 220);

    this.hemi = new THREE.HemisphereLight(0xffffff, 0x6b6459, 0.75);
    this.scene.add(this.hemi);

    this.sun = new THREE.DirectionalLight(0xfff0d8, 1.0);
    this.sun.position.set(-16, 26, 14);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera as THREE.OrthographicCamera;
    sc.left = -22;
    sc.right = 22;
    sc.top = 22;
    sc.bottom = -22;
    sc.near = 1;
    sc.far = 90;
    this.scene.add(this.sun);
    this.scene.add(this.sun.target);
  }

  /* ───────────── 挂载 ───────────── */

  mount(container: HTMLElement): void {
    this.container = container;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.display = "block";
    this.renderer.domElement.style.width = "100%";
    this.renderer.domElement.style.height = "100%";
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.style.cursor = "grab";

    this.bindControls(container);

    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(container);
    }
    this.resize();
    this.loop();
  }

  private bindControls(el: HTMLElement): void {
    const dom = this.renderer.domElement;

    const onDown = (e: PointerEvent) => {
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      dom.style.cursor = "grabbing";
      dom.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      this.targetYaw -= dx * 0.006;
      this.targetPitch = clamp(this.targetPitch + dy * 0.004, 0.22, 1.32);
      this.needRender = true;
    };
    const onUp = (e: PointerEvent) => {
      this.dragging = false;
      dom.style.cursor = "grab";
      dom.releasePointerCapture?.(e.pointerId);
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      this.targetDist = clamp(this.targetDist * (1 + e.deltaY * 0.0011), 14, 62);
      this.needRender = true;
    };
    const onDouble = () => {
      if (!this.spec) return;
      this.targetYaw = this.spec.camera.yaw;
      this.targetPitch = 0.72;
      this.targetDist = this.spec.camera.distance;
      this.needRender = true;
    };

    dom.addEventListener("pointerdown", onDown);
    dom.addEventListener("pointermove", onMove);
    dom.addEventListener("pointerup", onUp);
    dom.addEventListener("pointercancel", onUp);
    dom.addEventListener("wheel", onWheel, { passive: false });
    dom.addEventListener("dblclick", onDouble);
    // 阻止长按选中
    el.addEventListener("contextmenu", (e) => e.preventDefault());

    this._unbind = () => {
      dom.removeEventListener("pointerdown", onDown);
      dom.removeEventListener("pointermove", onMove);
      dom.removeEventListener("pointerup", onUp);
      dom.removeEventListener("pointercancel", onUp);
      dom.removeEventListener("wheel", onWheel);
      dom.removeEventListener("dblclick", onDouble);
    };
  }

  private _unbind: (() => void) | null = null;

  /* ───────────── 场景切换 ───────────── */

  load(spec: SceneSpec): void {
    if (this.current) {
      this.scene.remove(this.current.root);
      this.current.dispose();
      this.current = null;
    }
    disposeCaches();

    this.spec = spec;
    this.current = buildScene(spec);
    this.scene.add(this.current.root);

    this.scene.background = new THREE.Color(spec.sky);
    this.scene.fog = new THREE.Fog(spec.fog.color, spec.fog.near, spec.fog.far);

    this.hemi.intensity = spec.lightIntensity * 0.9;
    this.sun.intensity = spec.lightIntensity * 1.35;
    this.sun.target.position.set(0, 0, 0);

    // 相机立即就位（避免切场景时飞镜头）
    this.yaw = this.targetYaw = spec.camera.yaw;
    this.pitch = this.targetPitch = 0.72;
    this.distance = this.targetDist = spec.camera.distance;
    this.targetY = spec.camera.height * 0.14;

    this.needRender = true;
    this.resize();
  }

  /* ───────────── 坐标投影（供热点层用） ───────────── */

  /** 世界坐标 → 画布内像素坐标；返回 null 表示在相机背后 */
  project(x: number, y: number, z: number): { x: number; y: number } | null {
    const v = new THREE.Vector3(x, y, z);
    v.project(this.camera);
    if (v.z > 1) return null;
    const rect = this.renderer.domElement.getBoundingClientRect();
    return {
      x: (v.x * 0.5 + 0.5) * rect.width,
      y: (-v.y * 0.5 + 0.5) * rect.height,
    };
  }

  get isDragging(): boolean {
    return this.dragging;
  }

  /** 请求一次重绘（场景内容变化后调用） */
  requestRender(): void {
    this.needRender = true;
  }

  /** 供热点层判断「这一帧视角变了吗」 */
  onAfterRender(cb: () => void): void {
    this._afterRender = cb;
  }
  private _afterRender: (() => void) | null = null;

  /* ───────────── 尺寸与渲染循环 ───────────── */

  resize(): void {
    if (!this.container) return;
    const w = this.container.clientWidth || 640;
    const h = this.container.clientHeight || 360;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.maxPR));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.needRender = true;
  }

  private loop = (): void => {
    if (this.disposed) return;
    this.raf = requestAnimationFrame(this.loop);

    // 阻尼插值
    const lerp = 0.16;
    const dYaw = this.targetYaw - this.yaw;
    const dPitch = this.targetPitch - this.pitch;
    const dDist = this.targetDist - this.distance;
    if (Math.abs(dYaw) > 1e-4 || Math.abs(dPitch) > 1e-4 || Math.abs(dDist) > 1e-3) {
      this.yaw += dYaw * lerp;
      this.pitch += dPitch * lerp;
      this.distance += dDist * lerp;
      this.needRender = true;
    }

    if (!this.needRender && !this.dragging) return;

    const cy = Math.cos(this.pitch);
    this.camera.position.set(
      Math.sin(this.yaw) * cy * this.distance,
      Math.sin(this.pitch) * this.distance + this.targetY,
      Math.cos(this.yaw) * cy * this.distance
    );
    this.camera.lookAt(0, this.targetY, 0);

    this.renderer.render(this.scene, this.camera);
    if (this._afterRender) this._afterRender();
    this.needRender = false;
  };

  dispose(): void {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.resizeObserver?.disconnect();
    this._unbind?.();
    if (this.current) {
      this.scene.remove(this.current.root);
      this.current.dispose();
      this.current = null;
    }
    disposeCaches();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.container = null;
  }
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}
