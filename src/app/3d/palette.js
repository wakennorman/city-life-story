import * as THREE from 'three';
import {
  tileWallTex, concreteTex, roofTex, glassTex, brickTex, metalPanelTex,
  curtainWallTex, asphaltTex, paverTex, grassTex, stoneTex, woodTex,
} from './materials.js';

/* ── 质感档位（wealthTier）────────────────────────────────────────────────
   同一个「结构原型」在不同的财富档位下，外墙、地面、屋顶、点缀色全都不一样：
     tier 1 → 贫困区：脏、旧、暖灰、密度高
     tier 2 → 中产区：中性混凝土、整洁、克制
     tier 3 → 富裕区：冷色玻璃、石材、铺装完整
   全部保持低饱和，任何档位都不破坏「晦暗调」这个统一底色。
   ──────────────────────────────────────────────────────────────────────── */

let P = null;

const std = (o) => new THREE.MeshStandardMaterial(o);

export function buildPalette() {
  const tex = {
    glass: glassTex(),
    asphalt: asphaltTex(),
    paver: paverTex(),
    grass: grassTex(),
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
       用 metalness 做玻璃是常见误区 —— 它会削掉漫反射，把玻璃变暗变死。 */
  const wallFor = (tier) => {
    if (tier <= 1) {
      return [
        std({ map: tileWallTex({ base: '#c2bfb4' }), roughness: 0.45 }),
        std({ map: tileWallTex({ base: '#b6b3a7', tile: 19 }), roughness: 0.48 }),
        std({ map: brickTex({ base: '#7d5644' }), roughness: 0.94 }),
        std({ map: concreteTex({ base: '#8a8880', wet: 0.2 }), roughness: 0.93 }),
      ];
    }
    if (tier === 2) {
      return [
        std({ map: tileWallTex({ base: '#cbc9c0', tile: 26, water: 8 }), roughness: 0.42 }),
        std({ map: concreteTex({ base: '#9a978e', wet: 0.1, crack: 10 }), roughness: 0.92 }),
        std({ map: brickTex({ base: '#8a6a56', rowH: 18 }), roughness: 0.95 }),
        std({ map: tileWallTex({ base: '#b8b6ac', tile: 30, water: 6 }), roughness: 0.46 }),
      ];
    }
    return [
      std({ map: stoneTex({ base: '#a8a49b' }), roughness: 0.70 }),
      std({ map: curtainWallTex({ base: '#424e58' }), roughness: 0.30, envMapIntensity: 1.4 }),
      std({ map: stoneTex({ base: '#9c9a92' }), roughness: 0.75 }),
      std({ map: curtainWallTex({ base: '#4a5258', cell: 36 }), roughness: 0.32, envMapIntensity: 1.4 }),
    ];
  };

  const groundFor = (tier) => {
    if (tier <= 1) return std({ map: concreteTex({ base: '#6c6f66', wet: 0.4, crack: 22 }), roughness: 0.95 });
    if (tier === 2) return std({ map: concreteTex({ base: '#7d7f76', wet: 0.28, crack: 14 }), roughness: 0.93 });
    return std({ map: tex.paver.clone(), roughness: 0.86 });
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
      metal: std({ color: 0x4e514c, roughness: 0.45, metalness: 0.90 }),
      metalLight: std({ color: 0x8d918a, roughness: 0.42, metalness: 0.85 }),
      dark: std({ color: 0x2c2f31, roughness: 0.8 }),
      rubber: std({ color: 0x1e2022, roughness: 0.95 }),
      wood: std({ map: tex.wood, roughness: 0.75 }),
      stone: std({ map: tex.stone, roughness: 0.72 }),
      asphalt: std({ map: tex.asphalt, roughness: 0.90 }),
      paver: std({ map: tex.paver, roughness: 0.86 }),
      grass: std({ map: tex.grass, roughness: 0.99 }),
      glassPane: std({ map: tex.glass, roughness: 0.10, envMapIntensity: 1.5 }),
      curtain: std({ map: curtainWallTex(), roughness: 0.30, envMapIntensity: 1.4 }),
      panel: std({ map: metalPanelTex({ base: '#6d7370' }), roughness: 0.72 }),
      panelBlue: std({ map: metalPanelTex({ base: '#4e5a63', period: 18 }), roughness: 0.70 }),
      panelRust: std({ map: metalPanelTex({ base: '#6a5a4c', period: 16 }), roughness: 0.84 }),
      /* [2026-09-18 美术修复] 路缘石专用 —— kit.js::curb() 写的是
         `P.common.trim || P.common.metalLight`，但 P.common 里**从来没有 trim 这个键**
         （trim 只存在于 P.tiers[t].trim，见本文件下方）。
         于是所有路缘石永远**静默回退**到冷灰金属材质，tier1 本该是暖灰 0x9a9186。
         不报错、不崩溃、就是不对 —— 典型的静默失效。此处补上，与 tier1 的 trim 同色。 */
      trim: std({ color: 0x9a9186, roughness: 0.90 }),
      tarp: std({ color: 0x3f4a44, roughness: 0.96, side: THREE.DoubleSide }),
      /* 巷弄路面：比沥青浅、比院内地面脏，带油渍 —— 城中村的巷子不是柏油马路 */
      laneSurf: std({ map: concreteTex({ base: '#75786f', wet: 0.5, crack: 26 }), roughness: 0.97 }),
      signRed: null,   // 由招牌纹理按需生成
      cloth: [0x5b6b7a, 0x8a8078, 0x6d5f66, 0x7a8a72, 0x9a9a92].map(c => std({ color: c, roughness: 0.95, side: THREE.DoubleSide })),
    },
  };

  for (const tier of [1, 2, 3]) {
    const walls = wallFor(tier);
    P.tiers[tier] = {
      walls,
      wall: walls[0],
      ground: groundFor(tier),
      roof: std({ map: roofTex(), roughness: 0.93 }),
      /* 点缀色：招牌底、雨棚、栏杆、围挡 —— 各档的"精气神"差别在这 */
      /* accent 是招牌底 / 雨棚 / 栏杆 / 围挡 —— 都属非金属。
         tier3 原来带的 metalness 0.25 是典型的"半金属"取值，已归 0（理由见 common 段）。 */
      accent: tier <= 1 ? std({ color: 0x8a3a30, roughness: 0.85 })
        : tier === 2 ? std({ color: 0x6a6f6b, roughness: 0.8 })
          : std({ color: 0x37414a, roughness: 0.62, envMapIntensity: 1.2 }),
      trim: tier <= 1 ? std({ color: 0x9a9186, roughness: 0.9 })
        : tier === 2 ? std({ color: 0xa8a69c, roughness: 0.88 })
          : std({ color: 0xb0b3ad, roughness: 0.7 }),
      awning: tier <= 1 ? std({ color: 0x4a4438, roughness: 0.95, side: THREE.DoubleSide })
        : std({ color: 0x555b58, roughness: 0.92, side: THREE.DoubleSide }),
    };
  }

  /* 地面纹理的平铺密度不在这里定。
     three 的 repeat 是"整张平面重复多少次"，所以同一张纹理贴到 190m 底板
     和 12m 小地块上，密度差 16 倍 —— 小地块会变成密密麻麻的细格。
     正确做法是每个地面平面按自己的尺寸生成材质，见 world.js 的 tileMat()。
     这里只做单位化基准。 */
  for (const t of [1, 2, 3]) {
    P.tiers[t].ground.map.repeat.set(1, 1);
    P.tiers[t].ground.map.needsUpdate = true;
  }
  P.common.asphalt.map.repeat.set(1, 1);
  P.common.laneSurf.map.repeat.set(1, 1);
  P.common.paver.map.repeat.set(1, 1);

  return P;
}

export function palette() {
  if (!P) throw new Error('palette 未初始化，先调用 buildPalette()');
  return P;
}

export const tierOf = (t) => P.tiers[Math.min(3, Math.max(1, t | 0))] || P.tiers[2];
