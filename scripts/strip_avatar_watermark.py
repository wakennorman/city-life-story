# -*- coding: utf-8 -*-
"""
NPC 立绘去水印（2026-09-19 恒稳定案：「立绘右下角的水印给我裁掉，以后不能有水印」）

── 为什么是「裁」而不是「修」 ────────────────────────────────────────────
水印是生成端自动贴在**右下角**的小字（旧图「图片由AI生成」、新图「AI生成
WORKBUDDY」）。它在图片最底部的一条带里，而对话框显示立绘用的是
`object-fit: cover; object-position: top center` —— 画面只取**顶部**，
底部这条带在界面上**根本不显示**。所以直接裁掉底部，既不损伤可见部分，
也不需要依赖 inpainting 猜测背景（修图猜错就是一块脏斑，比裁更糟）。

── 用法 ──────────────────────────────────────────────────────────────────
  python scripts/strip_avatar_watermark.py            # 处理 src/images/avatars
  python scripts/strip_avatar_watermark.py --check    # 只检测不改动（门禁用）
  python scripts/strip_avatar_watermark.py --dry-run  # 打印将要做的事

  ★ 以后每新增/重生成立绘，跑一次本脚本即可（已接入 package.json 的
    `avatars:dewm`）。不要等到玩家看见水印才处理。

── 裁多少 ────────────────────────────────────────────────────────────────
  默认底部 12%（CUT_FRAC）。这个值由实测定：旧图水印落在 y≈0.94~1.00，
  新图角标同样贴底；12% 留出安全余量，且仍在"界面不显示"的范围内。
"""
import os
import sys
import glob

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
SRC_DIR = os.path.join(ROOT, 'src', 'images', 'avatars')
DIST_DIR = os.path.join(ROOT, 'dist', 'images', 'avatars')
CUT_FRAC = 0.12


def has_watermark(path):
    """检测立绘底部是否带水印。返回 1=有，0=无。

    ★ 覆盖两类水印（恒稳 2026-09-19 实测都遇到过）：
      ① 白色小字「图片由AI生成 / AI生成 WORKBUDDY」——文字状，贴底；
      ② 右下角**蓝色拳 logo**（WORKBUDDY 角标）——饱和蓝块，也贴底。

    ★ 为什么按"小格分布"判白字而不是按总亮像素数：
      初版只数亮像素，结果把**白底/浅色衣服**的立绘全判成有水印
      （ajie / dr_wang / master_zhao 的计数是 4000~5500，那明明是背景）。
      水印是**细笔画小字**：亮像素集中在少数几个小格里、单格计数不多；
      背景是**成片**：连续多个格子都接近满格。
      判据：亮格数 1~8 且 单格最大计数 < 满格的 60% → 判为白字水印。

    ★ 蓝色拳 logo：底部带内找"饱和蓝"连通簇（b 高且明显大于 r、g）。
      只要底部 15% 区域内存在任一饱和蓝簇，即判为有（裁掉底部即可移除）。
    """
    from PIL import Image
    im = Image.open(path).convert('RGB')
    W, H = im.size
    px = im.load()

    # —— ① 白字水印（右下网格）——
    y0 = int(H * 0.85)
    x0 = int(W * 0.60)
    cols, rows = 8, 3
    cw = max(1, (W - x0) // cols)
    ch = max(1, (H - y0) // rows)
    cells = [[0] * cols for _ in range(rows)]
    for ry in range(rows):
        for cx in range(cols):
            c = 0
            for y in range(y0 + ry * ch, min(y0 + (ry + 1) * ch, H), 2):
                for x in range(x0 + cx * cw, min(x0 + (cx + 1) * cw, W), 2):
                    r, g, b = px[x, y]
                    if r > 215 and g > 215 and b > 215:
                        c += 1
            cells[ry][cx] = c
    per_full = max(1, (cw // 2) * (ch // 2))
    flat = [v for row in cells for v in row]
    bright_cells = sum(1 for v in flat if v > 4)
    max_cell = max(flat)
    if 1 <= bright_cells <= 8 and max_cell < per_full * 0.6:
        return 1

    # —— ② 蓝色拳 logo（底部 15% 整宽扫描饱和蓝簇）——
    yb = int(H * 0.85)
    blue = 0
    for y in range(yb, H, 2):
        for x in range(0, W, 2):
            r, g, b = px[x, y]
            if b > 120 and b > r + 40 and b > g + 40 and b > 1.3 * g:
                blue += 1
    if blue > 12:  # 阈值留余量，避开衣服上偶发的小蓝点
        return 1

    return 0


# 旧名保留作别名，避免调用方改动
def has_bottom_bright_ring(path):
    return has_watermark(path)


# ── 幂等基线（关键，2026-09-19 修正"已裁图被反复误裁"的坑）──────────────
# 检测法在"已裁过的图"上会把衣服高光误判成水印 → 无限裁切。
# 解法：用 manifest 把"已处理状态"固化。首次运行把当前磁盘状态登记为基线
# （不改动任何文件），之后只对「高度与基线不符」的新图裁底部 12%。
import json
MANIFEST_PATH = os.path.join(ROOT, 'scripts', '.avatar_strip_manifest.json')
KEEP_RATIO = 1 - CUT_FRAC  # 保留顶部 88%，裁掉底部 12%（水印所在带）


def load_manifest():
    if os.path.isfile(MANIFEST_PATH):
        try:
            with open(MANIFEST_PATH, 'r', encoding='utf-8') as fh:
                return json.load(fh)
        except Exception:
            return {}
    return None  # None = 尚未建立基线


def save_manifest(m):
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as fh:
        json.dump(m, fh, ensure_ascii=False, indent=2)


def main():
    from PIL import Image
    check = '--check' in sys.argv
    dry = '--dry-run' in sys.argv
    files = sorted(glob.glob(os.path.join(SRC_DIR, '*.png')))
    if not files:
        print('没有找到立绘文件：', SRC_DIR)
        return 1

    manifest = load_manifest()

    # —— 首次运行：把当前状态登记为基线，不改动任何文件 ——
    if manifest is None:
        manifest = {}
        for f in files:
            manifest[os.path.basename(f)] = Image.open(f).size[1]
        save_manifest(manifest)
        print(f'已建立去水印基线（当前 {len(files)} 张视为已处理，未改动文件）')
        print('  之后只对新生成的全高立绘裁底部 12%。如需强制复检请删除 '
              + os.path.relpath(MANIFEST_PATH, ROOT))
        if check:
            print('  ✓ 基线已建立')
        return 0

    # —— 常规运行：按基线逐张核对 ——
    dirty = []
    for f in files:
        name = os.path.basename(f)
        h = Image.open(f).size[1]
        if name in manifest and manifest[name] == h:
            continue  # 已处理且高度未变 → 跳过（幂等核心）
        if has_watermark(f):
            dirty.append(name)
        else:
            manifest[name] = h  # 高度变了但干净 → 更新基线

    if check:
        print(f'检测 {len(files)} 张立绘 · 待裁 {len(dirty)} 张')
        for name in dirty:
            print(f'  ✗ {name}')
        if not dirty:
            print('  ✓ 全部已处理')
        return 1 if dirty else 0

    from PIL import Image
    changed = 0
    for f in files:
        name = os.path.basename(f)
        im = Image.open(f)
        W, H = im.size
        if name in manifest and manifest[name] == H:
            if dry:
                print(f'  {name}: 已处理，跳过')
            continue
        if not has_watermark(f):
            manifest[name] = H
            continue
        new_h = int(round(H * KEEP_RATIO))
        if dry:
            print(f'  {name}: {W}x{H} → {W}x{new_h}')
            continue
        cropped = im.crop((0, 0, W, new_h))
        cropped.save(f)
        dst = os.path.join(DIST_DIR, name)
        if os.path.isdir(DIST_DIR):
            cropped.save(dst)
        manifest[name] = new_h
        changed += 1
    save_manifest(manifest)
    print(f'已裁剪 {changed} 张（底部 {int(CUT_FRAC*100)}%）；其余已处理跳过')
    left = [os.path.basename(f) for f in files
            if not (os.path.basename(f) in manifest
                    and manifest[os.path.basename(f)] == Image.open(f).size[1])
            and has_watermark(f)]
    print('复检：待裁', len(left), '张' + (' ✓' if not left else ''))
    for name in left:
        print(f'  ✗ {name} —— 水印可能不在底部右下区，需人工看一眼')
    return 0 if not left else 1


if __name__ == '__main__':
    sys.exit(main())
