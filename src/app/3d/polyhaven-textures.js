/* 由 scripts/gen-texture-manifest.cjs 生成 —— 请勿手改 */
export default {
    "_generated": "scripts/gen-texture-manifest.cjs —— 请勿手改",
    "source": "Poly Haven",
    "license": "CC0 1.0 (Public Domain)",
    "licenseUrl": "https://polyhaven.com/license",
    "commercialUse": true,
    "attributionRequired": false,
    "resolution": "1k",
    "note": "真实照片扫描 PBR 贴图集（1k）。arm.jpg = AO(R) + Roughness(G) + Metalness(B)；three.js 的 roughnessMap 读绿通道（源码注释原文：reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture）。本清单只把 arm 接到 roughnessMap；metalness 仍由材质显式给 0（见 3D_ART_SPEC §6.2 的 P0-2：非金属 metalness 必须归 0）。",
    "base": "assets/polyhaven/",
    "items": {
      "ground-concrete": {
        "use": "ground",
        "note": "干净水泥地（tier2）",
        "meters": 2,
        "source": "https://polyhaven.com/a/concrete_floor_02",
        "files": {
          "map": "textures/ground-concrete/ground-concrete_diff.jpg",
          "normalMap": "textures/ground-concrete/ground-concrete_nor.jpg",
          "roughnessMap": "textures/ground-concrete/ground-concrete_arm.jpg"
        }
      },
      "ground-concrete-worn": {
        "use": "ground",
        "note": "城中村地面：磨损脏水泥（tier1）",
        "meters": 3,
        "source": "https://polyhaven.com/a/concrete_floor_worn_001",
        "files": {
          "map": "textures/ground-concrete-worn/ground-concrete-worn_diff.jpg",
          "normalMap": "textures/ground-concrete-worn/ground-concrete-worn_nor.jpg",
          "roughnessMap": "textures/ground-concrete-worn/ground-concrete-worn_arm.jpg"
        }
      },
      "ground-slab": {
        "use": "ground",
        "note": "长方形水泥板铺装（庭院 / 人行道）",
        "meters": 2,
        "source": "https://polyhaven.com/a/rectangular_paving",
        "files": {
          "map": "textures/ground-slab/ground-slab_diff.jpg",
          "normalMap": "textures/ground-slab/ground-slab_nor.jpg",
          "roughnessMap": "textures/ground-slab/ground-slab_arm.jpg"
        }
      },
      "ground-stone-tile": {
        "use": "ground",
        "note": "预制石材大板（tier3 广场）",
        "meters": 2.24,
        "source": "https://polyhaven.com/a/precast_stone_paving",
        "files": {
          "map": "textures/ground-stone-tile/ground-stone-tile_diff.jpg",
          "normalMap": "textures/ground-stone-tile/ground-stone-tile_nor.jpg",
          "roughnessMap": "textures/ground-stone-tile/ground-stone-tile_arm.jpg"
        }
      },
      "road-asphalt": {
        "use": "ground",
        "note": "沥青机动车道",
        "meters": 4.04,
        "source": "https://polyhaven.com/a/asphalt_04",
        "files": {
          "map": "textures/road-asphalt/road-asphalt_diff.jpg",
          "normalMap": "textures/road-asphalt/road-asphalt_nor.jpg",
          "roughnessMap": "textures/road-asphalt/road-asphalt_arm.jpg"
        }
      },
      "walk-paver": {
        "use": "ground",
        "note": "人行道铺装砖",
        "meters": 2,
        "source": "https://polyhaven.com/a/brick_pavement_02",
        "files": {
          "map": "textures/walk-paver/walk-paver_diff.jpg",
          "normalMap": "textures/walk-paver/walk-paver_nor.jpg",
          "roughnessMap": "textures/walk-paver/walk-paver_arm.jpg"
        }
      },
      "wall-brick": {
        "use": "wall",
        "note": "红砖墙",
        "meters": 3,
        "source": "https://polyhaven.com/a/brick_wall_001",
        "files": {
          "map": "textures/wall-brick/wall-brick_diff.jpg",
          "normalMap": "textures/wall-brick/wall-brick_nor.jpg",
          "roughnessMap": "textures/wall-brick/wall-brick_arm.jpg"
        }
      },
      "wall-brick-2": {
        "use": "wall",
        "note": "红砖墙（另一款，轮换用）",
        "meters": 1.44,
        "source": "https://polyhaven.com/a/brick_wall_005",
        "files": {
          "map": "textures/wall-brick-2/wall-brick-2_diff.jpg",
          "normalMap": "textures/wall-brick-2/wall-brick-2_nor.jpg",
          "roughnessMap": "textures/wall-brick-2/wall-brick-2_arm.jpg"
        }
      },
      "wall-concrete": {
        "use": "wall",
        "note": "水泥墙",
        "meters": 2.71,
        "source": "https://polyhaven.com/a/concrete_wall_008",
        "files": {
          "map": "textures/wall-concrete/wall-concrete_diff.jpg",
          "normalMap": "textures/wall-concrete/wall-concrete_nor.jpg",
          "roughnessMap": "textures/wall-concrete/wall-concrete_arm.jpg"
        }
      },
      "wall-concrete-2": {
        "use": "wall",
        "note": "水泥墙（另一款）",
        "meters": 3,
        "source": "https://polyhaven.com/a/concrete_wall_003",
        "files": {
          "map": "textures/wall-concrete-2/wall-concrete-2_diff.jpg",
          "normalMap": "textures/wall-concrete-2/wall-concrete-2_nor.jpg",
          "roughnessMap": "textures/wall-concrete-2/wall-concrete-2_arm.jpg"
        }
      },
      "wall-plaster": {
        "use": "wall",
        "note": "剥落抹灰露砖 —— 城中村 / 老城区最典型的破败墙面",
        "meters": 1.85,
        "source": "https://polyhaven.com/a/damaged_plaster",
        "files": {
          "map": "textures/wall-plaster/wall-plaster_diff.jpg",
          "normalMap": "textures/wall-plaster/wall-plaster_nor.jpg",
          "roughnessMap": "textures/wall-plaster/wall-plaster_arm.jpg"
        }
      },
      "wall-plaster-2": {
        "use": "wall",
        "note": "抹灰砖墙（另一款）",
        "meters": 2.7,
        "source": "https://polyhaven.com/a/plaster_brick_01",
        "files": {
          "map": "textures/wall-plaster-2/wall-plaster-2_diff.jpg",
          "normalMap": "textures/wall-plaster-2/wall-plaster-2_nor.jpg",
          "roughnessMap": "textures/wall-plaster-2/wall-plaster-2_arm.jpg"
        }
      },
      "wall-stone": {
        "use": "wall",
        "note": "石材（tier3 高层）",
        "meters": 1.5,
        "source": "https://polyhaven.com/a/marble_01",
        "files": {
          "map": "textures/wall-stone/wall-stone_diff.jpg",
          "normalMap": "textures/wall-stone/wall-stone_nor.jpg",
          "roughnessMap": "textures/wall-stone/wall-stone_arm.jpg"
        }
      },
      "wall-tile": {
        "use": "wall",
        "note": "白瓷砖（城中村最标志性的外墙 —— 长条白釉面砖）",
        "meters": 1.27,
        "source": "https://polyhaven.com/a/long_white_tiles",
        "files": {
          "map": "textures/wall-tile/wall-tile_diff.jpg",
          "normalMap": "textures/wall-tile/wall-tile_nor.jpg",
          "roughnessMap": "textures/wall-tile/wall-tile_arm.jpg"
        }
      },
      "wall-tile-2": {
        "use": "wall",
        "note": "小方马赛克外墙（另一款瓷砖，轮换用）",
        "meters": 2.4,
        "source": "https://polyhaven.com/a/square_tiles_02",
        "files": {
          "map": "textures/wall-tile-2/wall-tile-2_diff.jpg",
          "normalMap": "textures/wall-tile-2/wall-tile-2_nor.jpg",
          "roughnessMap": "textures/wall-tile-2/wall-tile-2_arm.jpg"
        }
      }
    }
  };
