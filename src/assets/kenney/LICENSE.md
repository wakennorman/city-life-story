# 第三方 3D 资产许可台账（Kenney City Kit 系列）

本目录下的 3D 模型与贴图全部来自 **Kenney**（https://kenney.nl），采用 **CC0 1.0 通用（公共领域贡献）** 许可。

CC0 意味着：可自由用于个人、教育、商业用途，**无署名义务**。本项目仍在此登记来源，属自愿署名，
用于满足《免费3D素材源与许可速查.md》要求的「许可台账」纪律。

---

## 资产清单

| 子目录 | 资产包 | 版本 | 模型数 | 来源页 | 下载直链 |
|---|---|---|---|---|---|
| `commercial/` | City Kit (Commercial) | 2.1 | 41 | https://kenney.nl/assets/city-kit-commercial | `kenney_city-kit-commercial_2.1.zip` |
| `industrial/` | City Kit (Industrial) | 2.0 | 37 | https://kenney.nl/assets/city-kit-industrial | `kenney_city-kit-industrial_2.0.zip` |
| `roads/` | City Kit (Roads) | — | 95 | https://kenney.nl/assets/city-kit-roads | `kenney_city-kit-roads.zip` |
| **合计** | | | **173** | | |

## 目录结构约定

```
src/assets/kenney/
├── LICENSE.md            ← 本文件（许可台账）
├── manifest.json         ← 资产索引（名称 / 面数 / 字节数），供代码与验证脚本读取
├── commercial/
│   ├── *.glb             ← GLB 模型（自包含几何 + 内嵌 BIN 缓冲）
│   ├── Textures/
│   │   └── colormap.png  ← 该 kit 专用的调色板贴图（512×512）
│   └── LICENSE.txt       ← 原包内 Kenney 原始许可文本（原样保留）
├── industrial/           （同上结构）
└── roads/                （同上结构）
```

## ⚠️ 关键约束：三套 kit 的 colormap 互不通用

三套 kit 各自引用**同名但内容不同**的 `Textures/colormap.png`：

| kit | colormap MD5 | 尺寸 |
|---|---|---|
| commercial | `0d6f4b089c350f6a73d58534f7ccd979` | 512×512 / 11002 B |
| industrial | `f6295644b69210bdfeb9d5e11f089e4f` | 512×512 / 11986 B |
| roads | `ed0b867825794a6d5e1b7e81044db437` | 512×512 / 11428 B |

因此：**每个 GLB 必须从它自己所在 kit 的目录加载**，`GLTFLoader` 会按 GLB 内部记录的相对
URI（`Textures/colormap.png`）解析贴图。若把三套模型混放到同一目录，贴图会串色。
目录结构（每 kit 一个子目录）即是为解决此问题而设，勿合并。

## 风格统一说明

依据速查文件的「只跟一个作者，避免风格打架」原则，本项目 3D 资产**只采用 Kenney 一家**。
Kenney City Kit 系列内部风格一致（低多边形 + 共享调色板贴图），且与现有 `kit.js`
程序化几何的极简风格最接近，故可混用。

## 面数预算（由 manifest.json 实测）

| kit | 合计三角面 | 单模型最大 |
|---|---|---|
| commercial | 44,682 | 5,246 |
| industrial | 35,390 | 2,422 |
| roads | 17,146 | 1,636 |

均在 Web 实时渲染的安全范围内（单模型 < 6k 面）。

## 自愿署名（非义务）

> 3D assets by [Kenney](https://kenney.nl) — CC0 1.0 Universal (Public Domain Dedication)

## 原始许可文本

各 kit 的 `LICENSE.txt` 为资产包内原始文件，原样保留。核心条款（以 commercial 为例）：

> License: (Creative Commons Zero, CC0)
> http://creativecommons.org/publicdomain/zero/1.0/
> You can use this content for personal, educational, and commercial purposes.
> Support by crediting 'Kenney' or 'www.kenney.nl' (this is not a requirement)
