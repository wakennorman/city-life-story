---
name: anki-apkg-media-not-imported
description: 给 Anki 导入大批 apkg 时，新媒体文件经常不被自动复制到 collection.media；要手动 sync
metadata:
  node_type: memory
  type: feedback
  originSessionId: 386dd9c2-0248-439d-a9cd-4673fc9ca8ef
---

## 现象

用 genanki 打了 1893 卡 + 2104 张本地嵌入图的 `.apkg`，让用户 Anki 导入。结果**卡片字段对、apkg 内 media 编号对（vert→2093），但 Anki 预览破图**。

排查发现：

- `media/vert.jpg` 文件在 OpenClaw workspace 存在 ✓
- `local_image_map['vert'] = 'vert.jpg'` ✓
- `complete_data.json` 里这张卡的 `配图: vert.jpg` ✓
- `apkg` 解 zip 后 `media` 索引里有 `vert.jpg`（编号 2093） ✓
- **但 `C:\Users\xxx\AppData\Roaming\Anki2\{profile}\collection.media\vert.jpg` 不存在** ✗

Anki 已经有 12705 张媒体（来自早期 488 卡 apkg 导入），但**这次新加的 1877 张媒体没进 collection**。

## 真因（推测）

Anki 导入 apkg 在「Update existing notes」模式下，**会更新字段但不一定复制所有媒体**。这可能跟：

- 增量更新逻辑只复制"新引用"的媒体
- note type / model GUID 不完全匹配
- apkg 体积过大（476MB）触发不完整导入

有关。`workspace/memory/word-roots/full_workflow.md` 2026-05-24 那条「note type 不匹配 → Update existing 失效」教训已经预警过类似问题。

## 解决（立即可用）

绕过 apkg 导入，**直接 shutil.copy 把所有 jpg 同步到 Anki collection.media**：

```python
import os, shutil
SRC = r"C:\Users\xxx\.openclaw-autoclaw\workspace\anki\media"
DST = r"C:\Users\xxx\AppData\Roaming\Anki2\{profile}\collection.media"
src = set(os.listdir(SRC))
dst = set(os.listdir(DST))
for fn in src - dst:
    shutil.copy2(os.path.join(SRC, fn), os.path.join(DST, fn))
```

1877 张 7.3 秒搞定，0 失败。

## 教训

**以后批量更新 Anki 卡组时**：

1. 用 gen_anki_from_json.py 生成 apkg（让用户能导入卡片字段）
2. **同时**主动 shutil.copy media 到 collection.media（保证图一定在）
3. 不要假设 apkg 导入会"自动"处理媒体

可以在 gen_anki_from_json.py 里加一段自动 sync：

```python
ANKI_COLLECTION = os.path.expandvars(r"%APPDATA%\Anki2\账户 1\collection.media")
if os.path.isdir(ANKI_COLLECTION):
    for f in os.listdir(MEDIA_DIR):
        dst = os.path.join(ANKI_COLLECTION, f)
        if not os.path.exists(dst):
            shutil.copy2(os.path.join(MEDIA_DIR, f), dst)
```

## Anki profile 文件夹位置（Windows）

`%APPDATA%\Anki2\{profile_name}\collection.media\` — W哥的 profile 是「账户 1」（注意是中文带空格，路径里要保留）。

相关：[[pixabay-anki-pipeline]]
