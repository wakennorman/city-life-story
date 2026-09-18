/**
 * scene3d · 网格生成层
 *
 * 输入：SceneSpec
 * 输出：THREE.Group
 *
 * 全部几何体程序化生成 —— 不依赖任何外部模型文件。
 * 这样做的三个理由：
 *   1. 零资产管线：不用下载/减面/统一轴向，离线可用
 *   2. 风格天然统一：所有物件出自同一套参数化生成器，不会「素材感」
 *   3. 完全参数化：wealthTier 一改，整座城市换风格
 */

import * as THREE from "three";
import type { BuildingSpec, PropSpec, SceneSpec } from "./types";
import { makeRng } from "./palette";

/* ───────────────────────── 材质与几何缓存 ───────────────────────── */

const matCache = new Map<string, THREE.MeshLambertMaterial>();

function mat(color: string): THREE.MeshLambertMaterial {
  let m = matCache.get(color);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color });
    matCache.set(color, m);
  }
  return m;
}

const geoCache = new Map<string, THREE.BufferGeometry>();

function boxGeo(w: number, h: number, d: number): THREE.BufferGeometry {
  const key = `b${w.toFixed(2)}_${h.toFixed(2)}_${d.toFixed(2)}`;
  let g = geoCache.get(key);
  if (!g) {
    g = new THREE.BoxGeometry(w, h, d);
    geoCache.set(key, g);
  }
  return g;
}

const cylGeoCache = new Map<string, THREE.BufferGeometry>();

function cylGeo(rt: number, rb: number, h: number, seg = 8): THREE.BufferGeometry {
  const key = `c${rt}_${rb}_${h}_${seg}`;
  let g = cylGeoCache.get(key);
  if (!g) {
    g = new THREE.CylinderGeometry(rt, rb, h, seg);
    cylGeoCache.set(key, g);
  }
  return g;
}

/* ───────────────────────── 窗户贴图 ───────────────────────── */

const winTexCache = new Map<string, THREE.Texture>();

/** 用 canvas 生成窗户网格贴图 —— 比逐窗建面片便宜得多 */
function windowTexture(spec: BuildingSpec): THREE.Texture | null {
  if (!spec.windows) return null;
  const { rows, cols, color, lit = 0 } = spec.windows;
  const key = `${rows}x${cols}|${color}|${lit.toFixed(2)}`;
  const hit = winTexCache.get(key);
  if (hit) return hit;

  const cell = 16;
  const W = Math.min(1024, cols * cell);
  const H = Math.min(1024, rows * cell);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d");
  if (!c) return null;

  c.fillStyle = spec.body;
  c.fillRect(0, 0, W, H);

  const cw = W / cols;
  const ch = H / rows;
  const pad = Math.max(1.5, cw * 0.18);
  const rnd = makeRng(`${rows}${cols}${color}`);

  for (let r = 0; r < rows; r++) {
    for (let i = 0; i < cols; i++) {
      const x = i * cw + pad;
      const y = r * ch + pad;
      const isLit = rnd() < lit;
      c.fillStyle = isLit ? "#e8c98a" : color;
      c.fillRect(x, y, cw - pad * 2, ch - pad * 2);
    }
  }

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  winTexCache.set(key, tex);
  return tex;
}

/* ───────────────────────── 屋顶 ───────────────────────── */

function buildRoof(spec: BuildingSpec, w: number, h: number, d: number): THREE.Object3D {
  const shape = spec.roofShape ?? "flat";
  const roofMat = mat(spec.roof);
  const group = new THREE.Group();

  if (shape === "flat") {
    const parapet = 0.18;
    const slab = new THREE.Mesh(boxGeo(w * 1.03, parapet, d * 1.03), roofMat);
    slab.position.y = h / 2 + parapet / 2;
    group.add(slab);
  } else if (shape === "gable") {
    const g = new THREE.CylinderGeometry(0, Math.SQRT2 * (w / 2) * 0.72, d, 4, 1);
    const m = new THREE.Mesh(g, roofMat);
    m.rotation.y = Math.PI / 4;
    m.rotation.z = Math.PI / 2;
    m.scale.set(1, 1, 0.62);
    m.position.y = h / 2 + w * 0.19;
    group.add(m);
  } else if (shape === "hip") {
    const g = new THREE.ConeGeometry(Math.max(w, d) * 0.62, w * 0.34, 4);
    const m = new THREE.Mesh(g, roofMat);
    m.rotation.y = Math.PI / 4;
    m.position.y = h / 2 + w * 0.17;
    group.add(m);
  } else if (shape === "sawtooth") {
    const teeth = Math.max(2, Math.round(w / 2.4));
    const tw = w / teeth;
    for (let i = 0; i < teeth; i++) {
      const t = new THREE.Mesh(boxGeo(tw * 0.92, 0.42, d * 0.96), roofMat);
      t.position.set(-w / 2 + tw * (i + 0.5), h / 2 + 0.21, 0);
      t.rotation.z = 0.22;
      group.add(t);
    }
  }
  return group;
}

/* ───────────────────────── 建筑 ───────────────────────── */

function createBuilding(spec: BuildingSpec): THREE.Object3D {
  const { w, h, d } = spec.size;
  const g = new THREE.Group();

  const tex = windowTexture(spec);
  const bodyMat = tex
    ? new THREE.MeshLambertMaterial({ map: tex })
    : mat(spec.body);

  const body = new THREE.Mesh(boxGeo(w, h, d), bodyMat);
  body.position.y = h / 2;
  body.castShadow = true;
  body.receiveShadow = true;
  g.add(body);

  // 屋顶：buildRoof 内部的 y 以「楼体中心」为基准，故整体上移 h/2 落到楼顶
  const roof = buildRoof(spec, w, h, d);
  roof.children.forEach((ch) => (ch.position.y += h / 2));
  g.add(roof);

  // 门头/雨棚
  if (spec.accent) {
    const awning = new THREE.Mesh(boxGeo(w * 0.42, 0.16, 0.9), mat(spec.accent));
    awning.position.set(0, Math.min(h * 0.28, 2.4), d / 2 + 0.45);
    awning.castShadow = true;
    g.add(awning);

    const door = new THREE.Mesh(boxGeo(1.1, 2.0, 0.14), mat("#3b3835"));
    door.position.set(0, 1.0, d / 2 + 0.07);
    g.add(door);
  }

  g.position.set(spec.pos.x, 0, spec.pos.z);
  if (spec.rotY) g.rotation.y = spec.rotY;
  return g;
}

/* ───────────────────────── 道具 ───────────────────────── */

function createProp(spec: PropSpec, spec3d: SceneSpec): THREE.Object3D {
  const g = new THREE.Group();
  const s = spec.scale ?? 1;
  const pal = { foliage: ["#6f8055", "#61734a"], metal: "#8b8880", accents: ["#a06b4c"] };

  switch (spec.kind) {
    case "tree": {
      const trunk = new THREE.Mesh(cylGeo(0.13, 0.19, 1.5, 6), mat("#6b5a48"));
      trunk.position.y = 0.75;
      trunk.castShadow = true;
      g.add(trunk);
      const c1 = new THREE.Mesh(cylGeo(0, 1.05, 1.8, 7), mat(spec.color ?? "#6f8055"));
      c1.position.y = 2.1;
      c1.castShadow = true;
      g.add(c1);
      const c2 = new THREE.Mesh(cylGeo(0, 0.78, 1.3, 7), mat(spec.color ?? "#7a8a5e"));
      c2.position.y = 2.85;
      g.add(c2);
      break;
    }
    case "bush": {
      const b = new THREE.Mesh(cylGeo(0.5, 0.62, 0.72, 7), mat(spec.color ?? "#64804d"));
      b.position.y = 0.36;
      b.castShadow = true;
      g.add(b);
      break;
    }
    case "flowerbed": {
      const rim = new THREE.Mesh(boxGeo(1.7, 0.3, 0.9), mat("#9a9488"));
      rim.position.y = 0.15;
      g.add(rim);
      const soil = new THREE.Mesh(boxGeo(1.5, 0.14, 0.72), mat("#6d7a52"));
      soil.position.y = 0.32;
      g.add(soil);
      const bloom = new THREE.Mesh(boxGeo(1.3, 0.16, 0.6), mat("#a8705a"));
      bloom.position.y = 0.42;
      g.add(bloom);
      break;
    }
    case "pole": {
      const p = new THREE.Mesh(cylGeo(0.07, 0.09, 5.4 * s, 6), mat("#8b8880"));
      p.position.y = 2.7 * s;
      p.castShadow = true;
      g.add(p);
      const arm = new THREE.Mesh(boxGeo(1.3, 0.07, 0.07), mat("#8b8880"));
      arm.position.set(0.5, 5.1 * s, 0);
      g.add(arm);
      break;
    }
    case "lamp": {
      const p = new THREE.Mesh(cylGeo(0.06, 0.08, 4.2 * s, 6), mat("#7d7a74"));
      p.position.y = 2.1 * s;
      g.add(p);
      const head = new THREE.Mesh(boxGeo(0.5, 0.14, 0.3), mat("#c9c2a8"));
      head.position.y = 4.2 * s;
      g.add(head);
      break;
    }
    case "sign": {
      const p = new THREE.Mesh(cylGeo(0.05, 0.06, 2.2, 5), mat("#7d7a74"));
      p.position.y = 1.1;
      g.add(p);
      const b = new THREE.Mesh(boxGeo(1.15, 0.62, 0.08), mat(spec.color ?? "#a06b4c"));
      b.position.y = 2.1;
      g.add(b);
      break;
    }
    case "billboard": {
      const b = new THREE.Mesh(boxGeo(2.6, 1.3, 0.14), mat(spec.color ?? "#8f6b52"));
      b.position.y = 1.6;
      b.castShadow = true;
      g.add(b);
      for (const dx of [-1, 1]) {
        const leg = new THREE.Mesh(boxGeo(0.12, 1.6, 0.12), mat("#6f6a63"));
        leg.position.set(dx, 0.8, 0);
        g.add(leg);
      }
      break;
    }
    case "stall": {
      const top = new THREE.Mesh(boxGeo(2.0, 0.14, 1.2), mat(spec.color ?? "#a8543c"));
      top.position.y = 2.0;
      top.castShadow = true;
      g.add(top);
      const table = new THREE.Mesh(boxGeo(1.8, 0.6, 1.0), mat("#9c8a6e"));
      table.position.y = 0.6;
      g.add(table);
      for (const dx of [-0.85, 0.85]) {
        for (const dz of [-0.5, 0.5]) {
          const leg = new THREE.Mesh(boxGeo(0.09, 2.0, 0.09), mat("#7d7a74"));
          leg.position.set(dx, 1.0, dz);
          g.add(leg);
        }
      }
      break;
    }
    case "crate": {
      const c = new THREE.Mesh(boxGeo(0.78, 0.62, 0.78), mat(spec.color ?? "#9a7a52"));
      c.position.y = 0.31;
      c.castShadow = true;
      g.add(c);
      break;
    }
    case "barrier": {
      const b = new THREE.Mesh(boxGeo(1.5, 0.95, 0.1), mat(spec.color ?? "#b8a44a"));
      b.position.y = 0.62;
      g.add(b);
      for (const dx of [-0.6, 0.6]) {
        const leg = new THREE.Mesh(boxGeo(0.1, 0.7, 0.42), mat("#8b8880"));
        leg.position.set(dx, 0.35, 0);
        g.add(leg);
      }
      break;
    }
    case "car": {
      const body = new THREE.Mesh(boxGeo(1.9, 0.62, 3.9), mat(spec.color ?? "#7d8a93"));
      body.position.y = 0.55;
      body.castShadow = true;
      g.add(body);
      const cabin = new THREE.Mesh(boxGeo(1.7, 0.55, 2.0), mat("#5f6a70"));
      cabin.position.set(0, 1.12, -0.15);
      g.add(cabin);
      for (const dx of [-0.85, 0.85]) {
        for (const dz of [1.25, -1.25]) {
          const w = new THREE.Mesh(cylGeo(0.31, 0.31, 0.2, 8), mat("#3b3835"));
          w.rotation.z = Math.PI / 2;
          w.position.set(dx, 0.31, dz);
          g.add(w);
        }
      }
      break;
    }
    case "bike": {
      for (const dz of [-0.5, 0.5]) {
        const w = new THREE.Mesh(cylGeo(0.32, 0.32, 0.07, 8), mat("#4a4744"));
        w.rotation.x = Math.PI / 2;
        w.rotation.z = Math.PI / 2;
        w.position.set(0, 0.32, dz);
        g.add(w);
      }
      const bar = new THREE.Mesh(boxGeo(0.06, 0.06, 1.0), mat("#8b8880"));
      bar.position.y = 0.62;
      g.add(bar);
      const seat = new THREE.Mesh(boxGeo(0.14, 0.1, 0.32), mat("#3b3835"));
      seat.position.set(0, 0.86, -0.35);
      g.add(seat);
      break;
    }
    case "bench": {
      const seat = new THREE.Mesh(boxGeo(1.7, 0.1, 0.46), mat("#9a8163"));
      seat.position.y = 0.46;
      seat.castShadow = true;
      g.add(seat);
      const back = new THREE.Mesh(boxGeo(1.7, 0.42, 0.08), mat("#9a8163"));
      back.position.set(0, 0.7, -0.2);
      g.add(back);
      for (const dx of [-0.7, 0.7]) {
        const leg = new THREE.Mesh(boxGeo(0.1, 0.46, 0.4), mat("#6f6a63"));
        leg.position.set(dx, 0.23, 0);
        g.add(leg);
      }
      break;
    }
    case "fence": {
      for (let i = 0; i < 5; i++) {
        const bar = new THREE.Mesh(boxGeo(0.06, 1.2, 0.06), mat("#7d7a74"));
        bar.position.set(-2 + i, 0.6, 0);
        g.add(bar);
      }
      const rail = new THREE.Mesh(boxGeo(4.2, 0.07, 0.07), mat("#7d7a74"));
      rail.position.y = 1.1;
      g.add(rail);
      break;
    }
    case "container": {
      const c = new THREE.Mesh(boxGeo(2.4, 1.3, 1.1), mat(spec.color ?? "#8a5a3c"));
      c.position.y = 0.65;
      c.castShadow = true;
      g.add(c);
      break;
    }
    case "ac_unit": {
      const c = new THREE.Mesh(boxGeo(0.62, 0.42, 0.4), mat("#b0aca4"));
      c.position.y = 0.21;
      g.add(c);
      break;
    }
    case "antenna": {
      const p = new THREE.Mesh(cylGeo(0.03, 0.05, 1.6, 5), mat("#8b8880"));
      p.position.y = 0.8;
      g.add(p);
      const d = new THREE.Mesh(boxGeo(0.7, 0.06, 0.06), mat("#8b8880"));
      d.position.y = 1.3;
      g.add(d);
      break;
    }
    case "trash": {
      const t = new THREE.Mesh(cylGeo(0.3, 0.26, 0.72, 7), mat(spec.color ?? "#6d7066"));
      t.position.y = 0.36;
      t.castShadow = true;
      g.add(t);
      break;
    }
    case "statue": {
      const base = new THREE.Mesh(boxGeo(1.1, 0.5, 1.1), mat("#9a9488"));
      base.position.y = 0.25;
      g.add(base);
      const body = new THREE.Mesh(cylGeo(0.16, 0.24, 1.5, 6), mat("#a8a294"));
      body.position.y = 1.25;
      g.add(body);
      break;
    }
    case "gate": {
      for (const dx of [-2.1, 2.1]) {
        const p = new THREE.Mesh(boxGeo(0.42, 3.2, 0.42), mat("#9a9488"));
        p.position.set(dx, 1.6, 0);
        p.castShadow = true;
        g.add(p);
      }
      const beam = new THREE.Mesh(boxGeo(4.9, 0.42, 0.46), mat("#8a8478"));
      beam.position.y = 3.35;
      g.add(beam);
      break;
    }
    default:
      break;
  }

  g.position.set(spec.pos.x, 0, spec.pos.z);
  if (spec.rotY) g.rotation.y = spec.rotY;
  g.scale.setScalar(s);
  void spec3d;
  void pal;
  return g;
}

/* ───────────────────────── 地面 ───────────────────────── */

function createGround(spec: SceneSpec): THREE.Object3D {
  const g = new THREE.Group();
  const { w, d } = spec.ground.size;

  const base = new THREE.Mesh(boxGeo(w, 0.4, d), mat(spec.ground.base));
  base.position.y = -0.2;
  base.receiveShadow = true;
  g.add(base);

  if (spec.ground.road) {
    const r = spec.ground.road;
    const road = new THREE.Mesh(boxGeo(r.w, 0.06, d * 1.02), mat(r.color));
    road.position.set(r.x, 0.035, 0);
    road.receiveShadow = true;
    g.add(road);
    if (spec.ground.curb) {
      for (const dx of [-r.w / 2 - 0.16, r.w / 2 + 0.16]) {
        const c = new THREE.Mesh(boxGeo(0.3, 0.2, d * 1.02), mat(spec.ground.curb));
        c.position.set(r.x + dx, 0.1, 0);
        g.add(c);
      }
    }
  }

  for (const p of spec.ground.patches ?? []) {
    const patch = new THREE.Mesh(boxGeo(p.w, 0.05, p.d), mat(p.color));
    patch.position.set(p.pos.x, 0.03, p.pos.z);
    g.add(patch);
  }

  return g;
}

/* ───────────────────────── 对外入口 ───────────────────────── */

export interface BuiltScene {
  root: THREE.Group;
  dispose(): void;
}

export function buildScene(spec: SceneSpec): BuiltScene {
  const root = new THREE.Group();
  root.add(createGround(spec));

  const buildingGroup = new THREE.Group();
  for (const b of spec.buildings) buildingGroup.add(createBuilding(b));
  root.add(buildingGroup);

  const propGroup = new THREE.Group();
  for (const p of spec.props) propGroup.add(createProp(p, spec));
  root.add(propGroup);

  return {
    root,
    dispose() {
      // 几何/材质为跨场景共享的全局缓存，此处只摘除引用，
      // 真正的显存回收交给 disposeCaches()，避免释放掉仍被其他场景使用的对象。
      root.clear();
    },
  };
}

/** 释放全局几何/材质缓存（切换场景时调用可回收显存） */
export function disposeCaches(): void {
  geoCache.forEach((g) => g.dispose());
  geoCache.clear();
  cylGeoCache.forEach((g) => g.dispose());
  cylGeoCache.clear();
  matCache.forEach((m) => m.dispose());
  matCache.clear();
  winTexCache.forEach((t) => t.dispose());
  winTexCache.clear();
}
