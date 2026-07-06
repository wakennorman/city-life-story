#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""更彻底的清洗 + 词根含义最大化抽取 + 含义二次精修。"""
import json, re, os, sys, io
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

WS = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
DICT_FILE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\all_books_combined.txt"
FILES = ["roots_part1.md", "roots_part2.md", "roots_part3.md"]


def clean_meaning_v2(s):
    if not s:
        return s
    out = s
    # 1) 去掉 [xxx] ［xxx］ 拆解括号
    out = re.sub(r"［[^］]*］", "", out)
    out = re.sub(r"\[[^\]]*\]", "", out)
    # 2) 去掉孤立 → ］ 之类残留
    out = re.sub(r"→\s*[\]）)］〕》］]+", "", out)
    out = re.sub(r"[\]］〕》）)]+(?=[；;。\s]|$)", "", out)
    out = re.sub(r"(?:^|[；;\s])[\[［〔《（(]+", " ", out)
    # 3) 多重标点合并
    out = re.sub(r"[；;]+", "；", out)
    out = re.sub(r"[，,]+", "，", out)
    out = re.sub(r"\s+", " ", out)
    # 4) ① ② → (1) (2)
    out = re.sub(r"[①②③④⑤⑥⑦⑧⑨⑩⑪⑫]",
                 lambda m: f"({'①②③④⑤⑥⑦⑧⑨⑩⑪⑫'.index(m.group())+1})", out)
    # 5) 去开头/结尾杂符号
    out = out.strip(" ;；.。·,，:：\t\r\n→·-")
    # 6) 如果只剩词性标签（如 "v."），返回空让上游接管
    if re.fullmatch(r"[nvajdrpc]+\.\s*", out.strip()):
        return ""
    return out


# === 1. 全量重抽词根含义 ===
print("[1] 重抽词根含义（多种格式）...")
root_meaning_map = {}

for fn in FILES:
    text = open(os.path.join(WS, fn), encoding="utf-8").read()
    blocks = re.split(r"^# 📚 第\d+个词根：", text, flags=re.M)[1:]
    headers = re.findall(r"^# 📚 第\d+个词根：(.+)$", text, flags=re.M)
    for hdr, block in zip(headers, blocks):
        root = hdr.strip()
        # 多种模式找含义
        candidates = []
        for p in [
            r"\*\*核心含义\*\*[:：]\s*([^\n]+)",
            r"\*\*含义\*\*[:：]\s*([^\n]+)",
            r"^含义[:：]\s*([^\n]+)",
            r"\*\*词根含义\*\*[:：]\s*([^\n]+)",
        ]:
            m = re.search(p, block, re.M)
            if m:
                v = m.group(1).strip().strip("`*").strip()
                if v and v not in ("---", ""):
                    candidates.append(v)
        # part3 还有 **含义**: needle 针 这种
        if candidates:
            root_meaning_map[root] = candidates[0]

print(f"  → 抽到 {len(root_meaning_map)} 个词根含义")

# === 2. 词根含义不在 markdown 里的，去字典找 ===
print("[2] 从字典补词根含义...")
dict_text = open(DICT_FILE, encoding="utf-8").read()

def dict_root_lookup(root):
    base = re.split(r"[/\-,\s]+", root.lower())[0].strip("-")
    if not base or len(base) < 2:
        return None
    # 在字典里找 "base [...] xxx" 或 "base = xxx" 类
    patterns = [
        rf"^{re.escape(base)}\s*[=＝]\s*([a-zA-Z\s/]+)[；;]?\s*([一-龥][^\n]{{2,40}})",
        rf"\b{re.escape(base)}\s*[=＝]\s*([a-zA-Z]+)[\s,]+([一-龥][^\n]{{2,40}})",
    ]
    for p in patterns:
        m = re.search(p, dict_text, re.M | re.I)
        if m:
            return f"{m.group(1).strip()} {m.group(2).strip()}"
    return None


# === 3. 应用所有修复 ===
print("[3] 应用修复...")
data = json.load(open(DATA, encoding="utf-8"))
cards = data["cards"]

stats = defaultdict(int)
sample_fixed = []

for c in cards:
    w_l = c["单词"].lower()
    root = c["词根"]

    # a. 再次清洗含义（彻底版）
    cur_m = c.get("单词含义", "")
    new_m = clean_meaning_v2(cur_m)
    if new_m and new_m != cur_m:
        c["单词含义"] = new_m
        stats["cleaned"] += 1
        if len(sample_fixed) < 5:
            sample_fixed.append((c["单词"], cur_m[:50], new_m[:50]))

    # b. 词根本义：用更准的版本
    cur_rm = c.get("词根本义", "")
    if root in root_meaning_map:
        new_rm = root_meaning_map[root]
        if new_rm != cur_rm and ("拉丁/希腊语" in cur_rm or "---" in cur_rm or not cur_rm):
            c["词根本义"] = new_rm
            stats["root_meaning_updated"] += 1
    elif "拉丁/希腊语" in cur_rm:
        # 试字典
        m = dict_root_lookup(root)
        if m:
            c["词根本义"] = m
            stats["root_meaning_from_dict"] += 1

print(f"\n  含义清洗：{stats['cleaned']}")
print(f"  词根本义（从源文件）：{stats['root_meaning_updated']}")
print(f"  词根本义（从字典）：{stats['root_meaning_from_dict']}")

# 写
with open(DATA, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"\n写回 {DATA}")

print("\n=== 抽查 ===")
by_word = {c["单词"].lower(): c for c in cards}
for w in ["vert", "grad", "fluctuate", "decapitate", "acupuncture"]:
    c = by_word.get(w)
    if c:
        print(f"  {w:15} 词根本义={c['词根本义'][:50]:50} | 含义={c['单词含义'][:50]}")

print("\n清洗示例（cur → new）：")
for w, before, after in sample_fixed:
    print(f"  {w:18} {before!r} → {after!r}")
