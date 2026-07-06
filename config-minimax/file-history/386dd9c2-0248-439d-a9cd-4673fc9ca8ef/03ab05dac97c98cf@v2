#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段2：从 all_books_combined.txt 查字典，补齐没有释义的词。"""
import re, json, os

DICT_FILE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\all_books_combined.txt"
IN_FILE = r"D:\Claude Code+DeepSeekV4\to_generate.json"
OUT_FILE = r"D:\Claude Code+DeepSeekV4\to_generate_with_meaning.json"

print("[1/3] 加载词表...")
with open(IN_FILE, encoding="utf-8") as f:
    data = json.load(f)
records = data["records"]
print(f"  词数：{len(records)}")

print("[2/3] 加载词典（4MB）...")
with open(DICT_FILE, encoding="utf-8") as f:
    dict_text = f.read()

print("[3/3] 查字典补释义...")
need_lookup = [w for w, r in records.items() if not r["raw_meaning"]]
print(f"  待查询：{len(need_lookup)} 词")

found_count = 0
for i, word in enumerate(need_lookup, 1):
    if i % 100 == 0:
        print(f"  进度 {i}/{len(need_lookup)}，命中 {found_count}")
    # 查找模式：
    # 1) 词条开头：^word［...］　n. 释义
    # 2) 词条带空格：^word ［...］ n. 释义
    # 3) 释义提示：word [acu ＝sharp...］n. 中文释义
    patterns = [
        rf"^{re.escape(word)}［[^］]*］[　\s]*([nvajd]\.?[^\n]+)$",
        rf"^{re.escape(word)}[\s]+［[^］]*］[　\s]*([nvajd]\.?[^\n]+)$",
        rf"^{re.escape(word)}\s+\[[^]]+\][　\s]*([nvajd]\.?[^\n]*[一-龥]+[^\n]*)",
        rf"\b{re.escape(word)}[\s]*\([^)]+\)[　\s]*([nvajd]\.?[^\n]*[一-龥]+[^\n]+)",
    ]
    meaning = ""
    for p in patterns:
        m = re.search(p, dict_text, re.M | re.I)
        if m:
            meaning = m.group(1).strip()[:200]
            break
    # 兜底：直接搜行内出现 + 中文短语
    if not meaning:
        m = re.search(rf"\b{re.escape(word)}\b[^\n]*?([一-龥][^\n]{{3,80}})", dict_text)
        if m:
            meaning = m.group(1).strip()[:200]
    if meaning:
        records[word]["raw_meaning"] = meaning
        records[word]["meaning_source"] = "dict_lookup"
        found_count += 1

print(f"\n找到 {found_count}/{len(need_lookup)} 个词的释义")

# 统计仍无释义的
still_missing = [w for w, r in records.items() if not r["raw_meaning"]]
print(f"仍无释义：{len(still_missing)}")
print(f"前20个：{still_missing[:20]}")

# 输出
data["records"] = records
data["stats"]["meanings_filled"] = found_count
data["stats"]["still_missing"] = len(still_missing)
with open(OUT_FILE, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"\n写入：{OUT_FILE}")
