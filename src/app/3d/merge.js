import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

/* ══ 静态几何合并 ═══════════════════════════════════════════════════════════
   一个地点会生成上千个 Mesh（窗、空调、栏杆、砖块……）。每个 Mesh = 一次
   draw call，不处理的话帧率会被拖死。

   做法：按「材质外观签名」分组，把同组几何烘焙到世界坐标后合并成一个 Mesh。
   为什么按键而不是按材质实例：工具箱里大量材质是 `new Material({color: 随机色})`，
   实例各不相同但外观完全一致。按实例分组等于没分。按签名分组能一路合并到底。

   被标记 userData.noMerge 的子树（交互点等动态物件）原样保留。
   ═══════════════════════════════════════════════════════════════════════════ */

/** 材质外观签名：外观一致即可合并 */
function matKey(m) {
  return [
    m.type,
    m.color ? m.color.getHexString() : '',
    m.emissive ? m.emissive.getHexString() : '',
    m.roughness, m.metalness, m.side,
    m.transparent ? 1 : 0, m.opacity,
    m.flatShading ? 1 : 0,
    m.map ? m.map.uuid : '',
    m.map ? `${m.map.repeat.x}x${m.map.repeat.y}` : '',
    m.alphaMap ? m.alphaMap.uuid : '',
  ].join('|');
}

function markedNoMerge(o) {
  let p = o;
  while (p) {
    if (p.userData && p.userData.noMerge) return true;
    p = p.parent;
  }
  return false;
}

/** 允许的属性集合：合并要求所有几何属性一致，多余的删掉 */
function normalize(g) {
  for (const name of Object.keys(g.attributes)) {
    if (name !== 'position' && name !== 'normal' && name !== 'uv') g.deleteAttribute(name);
  }
  for (const name of Object.keys(g.morphAttributes)) delete g.morphAttributes[name];
  g.morphTargetsRelative = false;
  return g;
}

/**
 * 就地合并 root 下的静态网格。
 * @returns {{ before:number, after:number, buckets:number }}
 */
export function mergeStatics(root) {
  root.updateMatrixWorld(true);

  const meshes = [];
  root.traverse((o) => {
    if (o.isMesh && o.geometry && o.geometry.attributes.position && !markedNoMerge(o)) meshes.push(o);
  });
  const before = meshes.length;
  if (before < 12) return { before, after: before, buckets: 0 };

  // 按签名分组
  const buckets = new Map();
  for (const m of meshes) {
    const key = matKey(m.material);
    let b = buckets.get(key);
    if (!b) { b = { mat: m.material, list: [] }; buckets.set(key, b); }
    b.list.push(m);
  }

  let after = 0, mergedBuckets = 0;

  for (const { mat, list } of buckets.values()) {
    // 数量太少的组：合并不划算，还白白展开顶点
    if (list.length < 3) { after += list.length; continue; }

    const geos = [];
    let ok = true;
    for (const m of list) {
      try {
        // 先转成非索引，保证所有几何的索引状态一致（mergeGeometries 的硬要求）
        const g = m.geometry.index ? m.geometry.toNonIndexed() : m.geometry.clone();
        g.applyMatrix4(m.matrixWorld);
        geos.push(normalize(g));
      } catch {
        ok = false;
        break;
      }
    }
    if (!ok) { after += list.length; continue; }

    let mergedGeo = null;
    try {
      mergedGeo = mergeGeometries(geos, false);
    } catch {
      mergedGeo = null;
    }
    if (!mergedGeo) { after += list.length; continue; }

    const mesh = new THREE.Mesh(mergedGeo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = true;
    root.add(mesh);
    mergedBuckets++;

    for (const m of list) {
      if (m.parent) m.parent.remove(m);
      // 不 dispose 原几何：部分几何是组内共享的（如车轮），dispose 会误伤残留网格。
      // 这些几何在合并前从未上传 GPU，留着不占显存。
    }
    after += 1;
  }

  // 清掉被搬空的空 Group
  const empties = [];
  root.traverse((o) => {
    if (o !== root && (o.isGroup || o.isObject3D) && !o.isMesh && o.children.length === 0) empties.push(o);
  });
  for (const e of empties) if (e.parent) e.parent.remove(e);

  return { before, after, buckets: mergedBuckets };
}

/** 统计当前场景的三角面 / 网格数 */
export function countScene(root) {
  let meshes = 0, tris = 0;
  root.traverse((o) => {
    if (!o.isMesh) return;
    meshes++;
    const g = o.geometry;
    if (!g) return;
    const n = g.index ? g.index.count : g.attributes.position.count;
    tris += n / 3;
  });
  return { meshes, tris: Math.round(tris) };
}
