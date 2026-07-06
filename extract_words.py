#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段1：从 3 个 roots_part 文件抽取所有待生图的词，去重 + 标已缓存。"""
import re, json, os
from collections import OrderedDict

WS = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace"
FILES = ["roots_part1.md", "roots_part2.md", "roots_part3.md"]
CACHE = os.path.join(WS, "anki", "concept_urls.json")
OUT = r"D:\Claude Code+DeepSeekV4\to_generate.json"

# 加载已缓存
cached = {}
if os.path.exists(CACHE):
    with open(CACHE, encoding="utf-8") as f:
        cached = json.load(f)

records = OrderedDict()  # key = word (lower), value = {root, source, raw_meaning, cached}
root_order = []          # 词根顺序

for fn in FILES:
    path = os.path.join(WS, fn)
    with open(path, encoding="utf-8") as f:
        text = f.read()

    # 按词根切块（# 📚 第N个词根：XXX）
    blocks = re.split(r"^# 📚 第\d+个词根：", text, flags=re.M)[1:]
    headers = re.findall(r"^# 📚 第\d+个词根：(.+)$", text, flags=re.M)

    for hdr, block in zip(headers, blocks):
        root = hdr.strip()
        if root not in records:
            root_order.append(root)
        # 词根本身也要图：用词根的第一个形态（如 VIS-/VID- → vis）
        root_word = re.split(r"[/\s,]+", root)[0].strip("-").lower()
        if root_word and root_word not in records:
            records[root_word] = {
                "root": root,
                "source": fn,
                "raw_meaning": "",
                "is_root_itself": True,
                "cached": root_word in cached and bool(cached.get(root_word))
            }
        # 解析派生词表
        # 两种格式：
        # part1/2:  | word /ipa/ | [IPA] |  | ACT + affix |
        # part3:    | acuity | ［acu ; -ity n. ］　n. 尖锐；敏锐 | |
        for line in block.splitlines():
            m = re.match(r"^\|\s*([a-zA-Z][a-zA-Z\-]+)(?:\s*/[^/]+/)?\s*\|\s*(.*?)\s*\|", line)
            if not m:
                continue
            word = m.group(1).strip().lower().strip("-")
            meaning_raw = m.group(2).strip()
            if word in ("单词", "ipa") or len(word) < 2:
                continue
            # 跳过示例/占位
            if meaning_raw in ("[IPA]", ""):
                meaning_raw = ""
            if word not in records:
                records[word] = {
                    "root": root,
                    "source": fn,
                    "raw_meaning": meaning_raw,
                    "is_root_itself": False,
                    "cached": word in cached and bool(cached.get(word))
                }
            else:
                # 已存在：若新出现的有更详细释义，合并
                if meaning_raw and not records[word]["raw_meaning"]:
                    records[word]["raw_meaning"] = meaning_raw

# 统计
total = len(records)
cached_count = sum(1 for v in records.values() if v["cached"])
need_gen = total - cached_count
with_meaning = sum(1 for v in records.values() if v["raw_meaning"])
need_lookup = need_gen - sum(1 for v in records.values() if not v["cached"] and v["raw_meaning"])

print(f"词根数：{len(root_order)}")
print(f"待生图词总数：{total}")
print(f"已缓存：{cached_count}")
print(f"需新生成：{need_gen}")
print(f"文件中已有中文释义：{with_meaning}")
print(f"需查字典补释义：{need_lookup}")

# 输出
with open(OUT, "w", encoding="utf-8") as f:
    json.dump({
        "stats": {
            "roots": len(root_order),
            "total_words": total,
            "cached": cached_count,
            "need_generate": need_gen,
            "with_meaning_in_file": with_meaning,
            "need_dict_lookup": need_lookup,
        },
        "records": records,
    }, f, ensure_ascii=False, indent=2)
print(f"\n写入：{OUT}")
