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

  /* 每档的 4 种外墙，按顺序轮换，避免整条街一个样 */
  const wallFor = (tier) => {
    if (tier <= 1) {
      return [
        std({ map: tileWallTex({ base: '#c2bfb4' }), roughness: 0.95 }),
        std({ map: tileWallTex({ base: '#b6b3a7', tile: 19 }), roughness: 0.95 }),
        std({ map: brickTex({ base: '#7d5644' }), roughness: 0.96 }),
        std({ map: concreteTex({ base: '#8a8880', wet: 0.2 }), roughness: 0.97 }),
      ];
    }
    if (tier === 2) {
      return [
        std({ map: tileWallTex({ base: '#cbc9c0', tile: 26, water: 8 }), roughness: 0.94 }),
        std({ map: concreteTex({ base: '#9a978e', wet: 0.1, crack: 10 }), roughness: 0.95 }),
        std({ map: brickTex({ base: '#8a6a56', rowH: 18 }), roughness: 0.95 }),
        std({ map: tileWallTex({ base: '#b8b6ac', tile: 30, water: 6 }), roughness: 0.94 }),
      ];
    }
    return [
      std({ map: stoneTex({ base: '#a8a49b' }), roughness: 0.7 }),
      std({ map: curtainWallTex({ base: '#424e58' }), roughness: 0.28, metalness: 0.42 }),
      std({ map: stoneTex({ base: '#9c9a92' }), roughness: 0.72 }),
      std({ map: curtainWallTex({ base: '#4a5258', cell: 36 }), roughness: 0.3, metalness: 0.4 }),
    ];
  };

  const groundFor = (tier) => {
    if (tier <= 1) return std({ map: concreteTex({ base: '#6c6f66', wet: 0.4, crack: 22 }), roughness: 0.98 });
    if (tier === 2) return std({ map: concreteTex({ base: '#7d7f76', wet: 0.28, crack: 14 }), roughness: 0.97 });
    return std({ map: tex.paver.clone(), roughness: 0.9 });
  };

  P = {
    tex,
    tiers: {},
    common: {
      metal: std({ color: 0x4e514c, roughness: 0.62, metalness: 0.55 }),
      metalLight: std({ color: 0x8d918a, roughness: 0.55, metalness: 0.5 }),
      dark: std({ color: 0x2c2f31, roughness: 0.8 }),
      rubber: std({ color: 0x1e2022, roughness: 0.95 }),
      wood: std({ map: tex.wood, roughness: 0.88 }),
      stone: std({ map: tex.stone, roughness: 0.72 }),
      asphalt: std({ map: tex.asphalt, roughness: 0.95 }),
      paver: std({ map: tex.paver, roughness: 0.9 }),
      grass: std({ map: tex.grass, roughness: 0.99 }),
      glassPane: std({ map: tex.glass, roughness: 0.32, metalness: 0.34 }),
      curtain: std({ map: curtainWallTex(), roughness: 0.3, metalness: 0.4 }),
      panel: std({ map: metalPanelTex({ base: '#6d7370' }), roughness: 0.78, metalness: 0.28 }),
      panelBlue: std({ map: metalPanelTex({ base: '#4e5a63', period: 18 }), roughness: 0.74, metalness: 0.3 }),
      panelRust: std({ map: metalPanelTex({ base: '#6a5a4c', period: 16 }), roughness: 0.86, metalness: 0.18 }),
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
      accent: tier <= 1 ? std({ color: 0x8a3a30, roughness: 0.85 })
        : tier === 2 ? std({ color: 0x6a6f6b, roughness: 0.8 })
          : std({ color: 0x37414a, roughness: 0.68, metalness: 0.25 }),
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
