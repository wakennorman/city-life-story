import * as THREE from 'three';
import {
  surfaceMat, tileWallTex, concreteTex, roofTex, glassTex, brickTex, metalPanelTex,
  curtainWallTex, asphaltTex, paverTex, grassTex, stoneTex, woodTex, slabTex,
} from './materials.js';

/* ── 质感档位（wealthTier）────────────────────────────────────────────────
   同一个「结构原型」在不同的财富档位下，外墙、地面、屋顶、点缀色全都不一样：
     tier 1 → 贫困区：脏、旧、暖灰、密度高
     tier 2 → 中产区：中性混凝土、整洁、克制
     tier 3 → 富裕区：冷色玻璃、石材、铺装完整
   全部保持低饱和，任何档位都不破坏「晦暗调」这个统一底色。
   ──────────────────────────────────────────────────────────────────────── */

let P = null;

/* ★ [2026-09-18 P1-1] 全部改用 surfaceMat() 而不是裸 new MeshStandardMaterial。
    原因：法线贴图挂在**纹理的 userData.surface** 上（materials.js::toTexture 登记），
    只有 surfaceMat() 会去读它并挂到材质。
    原来这里写 `std({ map: tex(...), roughness })` —— 结果就是
    materials.js 里辛辛苦苦生成的高度图**一张都没被用上**。
    这正是项目反复出现的「静默失效」：代码全对，就是没效果。 */
const surf = surfaceMat;

export function buildPalette() {
  /* 地面类纹理按**地面尺度**(4.5m/格，见 world.js::tileMat)生成，
     立面类按 TILE_M(2.4m/格)生成。两者混用会让砖的真实大小差近一倍。 */
  const tex = {
    glass: glassTex(),
    asphalt: asphaltTex(),
    paver: paverTex(),
    grass: grassTex({ metersPerRepeat: 3.0 }),   // world.js 显式传 3.0
    stone: stoneTex(),
    wood: woodTex(),
    roof: roofTex(),
  };

  /* 每档的 4 种外墙，按顺序轮换，避免整条街一个样。

     ★ [2026-09-18 美术 P1-2] roughness 重做 —— 「看不出砖/水泥/瓷砖」的直接解法。
       原来瓷砖被写成 0.94~0.95，那是**错的**：白瓷砖是上釉的，真实值 0.35~0.55。
       瓷砖 / 砖 / 水泥三种原来全挤在 0.94~0.97 这个窄区间里，
       而项目又完全没有法线贴图 → 三者的 BRDF 响应完全一样，必然分不出。
       现按 3D_ART_SPEC.md §6.2 分开：
         白瓷砖 0.42~0.48（上釉）· 红砖 0.94~0.95（粗糙）· 水泥 0.92~0.93 · 石材 0.70~0.75
     ★ [P0-2] 幕墙 metalness 0.42/0.40 → **0**：
       玻璃不是金属，靠**低 roughness + envMapIntensity** 出反射。
       用 metalness 做玻璃是常见误区 —— 它会削掉漫反射，把玻璃变暗变死。
     ★ [P1-1] 现在每条都有法线贴图兜底，roughness 相近的材质靠**凹凸**也能分开了。 */
  const wallFor = (tier) => {
    if (tier <= 1) {
      return [
        surf(tileWallTex({ base: '#c2bfb4' }), { roughness: 0.45 }),
        surf(tileWallTex({ base: '#b6b3a7', tileHMM: 380 }), { roughness: 0.48 }),
        surf(brickTex({ base: '#7d5644' }), { roughness: 0.94 }),
        surf(concreteTex({ base: '#8a8880', wet: 0.2 }), { roughness: 0.93 }),
      ];
    }
    if (tier === 2) {
      return [
        surf(tileWallTex({ base: '#cbc9c0', water: 8 }), { roughness: 0.42 }),
        surf(concreteTex({ base: '#9a978e', wet: 0.1, crack: 10 }), { roughness: 0.92 }),
        surf(brickTex({ base: '#8a6a56', rowHMM: 140 }), { roughness: 0.95 }),
        surf(tileWallTex({ base: '#b8b6ac', tileWMM: 250, water: 6 }), { roughness: 0.46 }),
      ];
    }
    return [
      surf(stoneTex({ base: '#a8a49b' }), { roughness: 0.70 }),
      surf(curtainWallTex({ base: '#424e58' }), { roughness: 0.30, envMapIntensity: 1.4 }),
      surf(stoneTex({ base: '#9c9a92', slabMM: 1000 }), { roughness: 0.75 }),
      surf(curtainWallTex({ base: '#4a5258', cellMM: 1500 }), { roughness: 0.32, envMapIntensity: 1.4 }),
    ];
  };

  /* 院内地面。★ [静默失效修复] 三档原来全是 512 的水泥（tier3 是铺装），
     而 world.js 的很多地块走的是 tier 默认值 → 富裕区院子还是脏水泥。
     现在按档拉开：tier1 脏板材 / tier2 干净板材 / tier3 石材铺装。

     ★ [2026-09-19 对齐《大多数》] 三档的**结构**换了：
       原来 tier1/tier2 用的是 concreteTex —— 那是**给墙面**的贴图，
       22 条裂缝按 2.4m 平铺，在 190m 的地面上铺出一片规律重复的龟裂纹。
       实机画面里这是最"一眼假"的一处。现改用 slabTex（约 0.9m 见方的大板材，
       板缝清晰、板间有明度差），与《大多数》的地面结构一致。
       底色也一并**往暖里挪**：原来 '#6c6f66' 是偏绿的冷灰，
       而城中村的水泥地是暖灰（3D_ART_SPEC §1.5：脏、旧、暖灰）。 */
  const groundFor = (tier) => {
    if (tier <= 1) return surf(slabTex({ base: '#78756a', slabMM: 900, stain: 9 }), { roughness: 0.95 });
    if (tier === 2) return surf(slabTex({ base: '#8a877e', slabMM: 1000, stain: 4 }), { roughness: 0.93 });
    return surf(stoneTex({ base: '#a8a49b', slabMM: 1200 }), { roughness: 0.74 });
  };

  /* ★ [2026-09-18 美术 P0-2 + P1-2] metalness / roughness 重做，依据 3D_ART_SPEC.md §6.2。

     【metalness】three.js 官方文档的原话是：
       "Non-metallic materials such as wood or stone use 0.0, metallic use 1.0,
        **with nothing (usually) in between**"
     半金属（0.3~0.55）是最糟的取值 —— 它既削掉了漫反射、又给不出清晰的镜面反射。
     在**没有 IBL** 的时候这个错误被放大了十倍：表面直接变暗变死，这就是「整体偏灰暗」的根因。
       · 真金属（灯杆 / 栏杆 / 卷帘门）：提到 0.80~0.90 —— 有 IBL 之后它们会反射环境、有细节
       · 玻璃 / 幕墙 / 涂漆金属板 / 雨棚：**归 0**，靠低 roughness + envMapIntensity 出反射
     注意「涂漆金属板」（panel*）的漆面是非金属，metalness 本就该是 0。

     【roughness】原来木头 0.88、沥青 0.95、铺装 0.90 都偏高得离谱，
     导致一切表面看起来都是"干粉笔"。按表回调。 */
  P = {
    tex,
    tiers: {},
    common: {
      metal: new THREE.MeshStandardMaterial({ color: 0x4e514c, roughness: 0.45, metalness: 0.90 }),
      metalLight: new THREE.MeshStandardMaterial({ color: 0x8d918a, roughness: 0.42, metalness: 0.85 }),
      dark: new THREE.MeshStandardMaterial({ color: 0x2c2f31, roughness: 0.8 }),
      rubber: new THREE.MeshStandardMaterial({ color: 0x1e2022, roughness: 0.95 }),
      wood: surf(tex.wood, { roughness: 0.75 }),
      stone: surf(tex.stone, { roughness: 0.72 }),
      asphalt: surf(tex.asphalt, { roughness: 0.90 }),
      paver: surf(tex.paver, { roughness: 0.86 }),
      grass: surf(tex.grass, { roughness: 0.99 }),
      glassPane: surf(tex.glass, { roughness: 0.10, envMapIntensity: 1.5 }),
      curtain: surf(curtainWallTex(), { roughness: 0.30, envMapIntensity: 1.4 }),
      panel: surf(metalPanelTex({ base: '#6d7370' }), { roughness: 0.72 }),
      panelBlue: surf(metalPanelTex({ base: '#4e5a63', ribMM: 180 }), { roughness: 0.70 }),
      panelRust: surf(metalPanelTex({ base: '#6a5a4c', ribMM: 160 }), { roughness: 0.84 }),
      /* [2026-09-18 美术修复] 路缘石专用 —— kit.js::curb() 写的是
         `P.common.trim || P.common.metalLight`，但 P.common 里**从来没有 trim 这个键**
         （trim 只存在于 P.tiers[t].trim，见本文件下方）。
         于是所有路缘石永远**静默回退**到冷灰金属材质，tier1 本该是暖灰 0x9a9186。
         不报错、不崩溃、就是不对 —— 典型的静默失效。此处补上，与 tier1 的 trim 同色。 */
      trim: new THREE.MeshStandardMaterial({ color: 0x9a9186, roughness: 0.90 }),
      tarp: new THREE.MeshStandardMaterial({ color: 0x3f4a44, roughness: 0.96, side: THREE.DoubleSide }),
      /* 巷弄路面：比沥青浅、比院内地面脏，带油渍 —— 城中村的巷子不是柏油马路。
         ★ 2026-09-19 同样换成 slabTex：巷弄是**水泥板路**（不是柏油路），
           板格比院子小一档（800mm），脏污更重 —— 与《大多数》的巷子一致。
           原来这里的 crack:26 是全项目最密的一处，正是截图里那道
           横贯整条街的重复裂纹的来源。 */
      laneSurf: surf(slabTex({ base: '#6e7069', slabMM: 800, stain: 12, crack: 3 }), { roughness: 0.97 }),
      signRed: null,   // 由招牌纹理按需生成
      cloth: [0x5b6b7a, 0x8a8078, 0x6d5f66, 0x7a8a72, 0x9a9a92].map(
        c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.95, side: THREE.DoubleSide })),
    },
  };

  for (const tier of [1, 2, 3]) {
    const walls = wallFor(tier);
    P.tiers[tier] = {
      walls,
      wall: walls[0],
      ground: groundFor(tier),
      roof: surf(roofTex(), { roughness: 0.93 }),
      /* 点缀色：招牌底、雨棚、栏杆、围挡 —— 各档的"精气神"差别在这 */
      /* accent 是招牌底 / 雨棚 / 栏杆 / 围挡 —— 都属非金属。
         tier3 原来带的 metalness 0.25 是典型的"半金属"取值，已归 0（理由见 common 段）。 */
      accent: tier <= 1 ? new THREE.MeshStandardMaterial({ color: 0x8a3a30, roughness: 0.85 })
        : tier === 2 ? new THREE.MeshStandardMaterial({ color: 0x6a6f6b, roughness: 0.8 })
          : new THREE.MeshStandardMaterial({ color: 0x37414a, roughness: 0.62, envMapIntensity: 1.2 }),
      trim: tier <= 1 ? new THREE.MeshStandardMaterial({ color: 0x9a9186, roughness: 0.9 })
        : tier === 2 ? new THREE.MeshStandardMaterial({ color: 0xa8a69c, roughness: 0.88 })
          : new THREE.MeshStandardMaterial({ color: 0xb0b3ad, roughness: 0.7 }),
      awning: tier <= 1 ? new THREE.MeshStandardMaterial({ color: 0x4a4438, roughness: 0.95, side: THREE.DoubleSide })
        : new THREE.MeshStandardMaterial({ color: 0x555b58, roughness: 0.92, side: THREE.DoubleSide }),
    };
  }

  /* 地面纹理的平铺密度不在这里定。
     three 的 repeat 是"整张平面重复多少次"，所以同一张纹理贴到 190m 底板
     和 12m 小地块上，密度差 16 倍 —— 小地块会变成密密麻麻的细格。
     正确做法是每个地面平面按自己的尺寸生成材质，见 world.js 的 tileMat()。
     这里只做单位化基准。

     ★ [P3-1] 原来这里只重置了 map.repeat，**normalMap 没重置**。
       而 fitRepeat()/tileMat() 克隆时会给 normalMap 设 repeat ——
       共用原型 NormalMap 会导致"最后一块地决定所有地的凹凸密度"。
       所有会被外部克隆的材质，map 与 normalMap 必须成对重置。 */
  const unit = (m) => {
    if (m.map) { m.map.repeat.set(1, 1); m.map.needsUpdate = true; }
    if (m.normalMap) { m.normalMap.repeat.set(1, 1); m.normalMap.needsUpdate = true; }
  };
  for (const t of [1, 2, 3]) unit(P.tiers[t].ground);
  unit(P.common.asphalt);
  unit(P.common.laneSurf);
  unit(P.common.paver);

  return P;
}

export function palette() {
  if (!P) throw new Error('palette 未初始化，先调用 buildPalette()');
  return P;
}

export const tierOf = (t) => P.tiers[Math.min(3, Math.max(1, t | 0))] || P.tiers[2];
