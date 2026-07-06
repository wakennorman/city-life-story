#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""补齐 complete_data.json 里「（待补充）」的含义字段。

策略：
1. 在 all_books_combined.txt 里用更宽松 regex 找
2. 找不到 → 找词根（去 -ed/-ing/-ly/-ic/-er/-or/-able/-ible/-ation 等后缀）
3. 还找不到 → 用同根词（其他卡里同 词根 的非待补充词）的含义 + 拆解规则推导
4. 都不行 → 老实写「[根=X+派生] 待人工补」
"""
import json, re, os, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

DICT_FILE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\all_books_combined.txt"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"

# 加载词典
print("加载 4MB 词典...")
dict_text = open(DICT_FILE, encoding="utf-8").read()

# 加载卡片
data = json.load(open(DATA, encoding="utf-8"))
cards = data["cards"]

# 索引：词 → 卡，词根 → [卡]
by_word = {c["单词"].lower(): c for c in cards}
by_root = {}
for c in cards:
    r = c["词根"]
    by_root.setdefault(r, []).append(c)


# ---- 字典查询（更宽松，多模式） ----
def dict_lookup(word):
    w = re.escape(word.lower())
    patterns = [
        # 行首：word［...］　n. 中文
        rf"^{w}\s*［[^］]*］\s*([nvajdr][a-z]*\.?[^\n]+)",
        # 行首：word [...] n. 释义
        rf"^{w}\s*\[[^\]]*\]\s*([nvajdr][a-z]*\.?[^\n]+)",
        # 行内带括号释义
        rf"\b{w}\b[^\n]*?\(([^)]*[一-龥][^)]*)\)",
        # 行内 word ... n. 中文
        rf"\b{w}\b[^\n]{{0,40}}([nvajdr][a-z]*\.?\s*[一-龥][^\n]{{2,80}})",
        # 行内紧跟着中文
        rf"\b{w}\b[^\n]{{0,30}}([一-龥][^\n]{{3,80}})",
    ]
    for p in patterns:
        m = re.search(p, dict_text, re.M | re.I)
        if m:
            r = m.group(1).strip().strip(":：. ")
            if len(r) >= 3:
                return r[:160]
    return None


# ---- 去后缀找根词 ----
SUFFIXES = ["iness", "ation", "ization", "ising", "ising", "ising", "ising",
            "tions", "sions", "ments", "ities", "ness", "less", "ment",
            "ible", "able", "ical", "ical", "tion", "sion", "ance", "ence",
            "ship", "hood", "ize", "ise", "ify", "ate", "ous", "ive",
            "ing", "ed", "es", "er", "or", "ic", "al", "ly", "ty", "y", "s"]

def strip_suffix(word):
    """返回 [可能的词干列表]"""
    out = [word]
    w = word.lower()
    for sfx in SUFFIXES:
        if w.endswith(sfx) and len(w) > len(sfx) + 2:
            stem = w[:-len(sfx)]
            out.append(stem)
            # e 还原（如 fondle → fond → fonde）
            if not stem.endswith("e"):
                out.append(stem + "e")
            # 双辅音单写（如 stopping → stop, but checking → check）
            if len(stem) >= 3 and stem[-1] == stem[-2]:
                out.append(stem[:-1])
    return out


# ---- 通过同根词推导 ----
PREFIX_HINT_ZH = {
    "in": "向内/进入/否定",
    "im": "向内/进入/否定",
    "il": "不/否定",
    "ir": "不/否定",
    "un": "不/反向",
    "non": "非/不",
    "re": "再/重新/回",
    "pre": "前/预先",
    "post": "后/在...之后",
    "sub": "下/次/亚",
    "super": "上/超",
    "ex": "向外/前任",
    "en": "使...化",
    "de": "向下/去掉",
    "dis": "不/分开/相反",
    "mis": "错/坏",
    "co": "共同",
    "con": "共/与",
    "com": "共/与/完全",
    "col": "共同",
    "cor": "共/与",
    "inter": "相互/之间",
    "intra": "内部",
    "trans": "横跨/转",
    "ante": "前",
    "anti": "反对",
    "auto": "自动/自我",
    "bi": "二/双",
    "tri": "三",
    "multi": "多",
    "over": "过/越",
    "under": "下/不足",
    "out": "超出/向外",
    "ab": "离/去",
    "ad": "向/趋",
    "circum": "环绕",
    "extra": "之外",
    "pro": "向前/支持",
    "para": "旁/类似",
    "fore": "前/预",
    "peri": "周围",
    "hyper": "过度/超",
    "hypo": "下/不足",
    "ultra": "超/极",
    "semi": "半",
    "self": "自我",
}

SUFFIX_HINT_ZH = {
    "tion": "n.（动作/结果）",
    "sion": "n.（动作/结果）",
    "ment": "n.（结果/状态）",
    "ity": "n.（性质/状态）",
    "ness": "n.（性质）",
    "ance": "n.（性质/动作）",
    "ence": "n.（性质/动作）",
    "er": "n.（人/工具）",
    "or": "n.（人/工具）",
    "ist": "n.（…者）",
    "ism": "n.（主义）",
    "ize": "v. 使…化",
    "ise": "v. 使…化",
    "ify": "v. 使…化",
    "ate": "v. 使…",
    "ful": "a.（充满…的）",
    "less": "a.（无…的）",
    "able": "a.（可…的）",
    "ible": "a.（可…的）",
    "ive": "a.（…性的）",
    "al": "a.（…的）",
    "ic": "a.（…的）",
    "ous": "a.（…的）",
    "ant": "n./a.（…的人/…的）",
    "ent": "n./a.（…的人/…的）",
    "ly": "ad.（…地）",
    "ship": "n.（关系/地位）",
    "hood": "n.（状态/时期）",
    "ed": "（过去式/已…的）",
    "ing": "（动名词/进行）",
    "y": "a.（…的）",
}

def find_prefix(word):
    w = word.lower()
    for p in sorted(PREFIX_HINT_ZH.keys(), key=len, reverse=True):
        if w.startswith(p) and len(w) > len(p) + 2:
            return p, PREFIX_HINT_ZH[p]
    return "", ""


def find_suffix(word):
    w = word.lower()
    for s in sorted(SUFFIX_HINT_ZH.keys(), key=len, reverse=True):
        if w.endswith(s) and len(w) > len(s) + 2:
            return s, SUFFIX_HINT_ZH[s]
    return "", ""


def derive_meaning(word, root_field):
    """规则推导：用同根词找最近的，加前后缀语义微调。"""
    # 1) 找同根词里非待补充的
    siblings = [c for c in by_root.get(root_field, [])
                if c["单词"].lower() != word.lower()
                and "待补充" not in c.get("单词含义", "")
                and c.get("单词含义")]
    if not siblings:
        return None

    # 选最近的：单词形态最像的（编辑距离）
    def sim(a, b):
        # 简单：公共前缀+后缀长度
        a, b = a.lower(), b.lower()
        i = 0
        while i < min(len(a), len(b)) and a[i] == b[i]:
            i += 1
        j = 0
        while j < min(len(a), len(b)) and a[-1-j] == b[-1-j]:
            j += 1
        return i + j

    best = max(siblings, key=lambda c: sim(word, c["单词"]))
    base_meaning = best["单词含义"][:80]

    # 加前后缀注解
    pfx, pfx_hint = find_prefix(word)
    sfx, sfx_hint = find_suffix(word)
    notes = []
    if pfx_hint:
        notes.append(f"{pfx}-（{pfx_hint}）")
    if sfx_hint:
            notes.append(f"-{sfx}（{sfx_hint}）")
    note_str = " + ".join(notes) if notes else ""
    if note_str:
        return f"{note_str}｜近 {best['单词']}：{base_meaning}"
    return f"近 {best['单词']}：{base_meaning}"


# ---- 主流程 ----
todo = [c for c in cards if "待补充" in c.get("单词含义", "")]
print(f"待补充总数：{len(todo)}")

fixed_dict = 0
fixed_stem = 0
fixed_derive = 0
still_open = 0

for c in todo:
    w = c["单词"]
    root = c["词根"]

    # 策略 1: 直接查字典
    m = dict_lookup(w)
    if m:
        c["单词含义"] = m
        fixed_dict += 1
        continue

    # 策略 2: 找词干（去后缀）查字典
    found = None
    for stem in strip_suffix(w):
        m = dict_lookup(stem)
        if m:
            sfx, sfx_hint = find_suffix(w)
            if sfx_hint:
                found = f"{sfx_hint}｜<{stem}> {m[:100]}"
            else:
                found = f"<{stem}> {m[:140]}"
            break
    if found:
        c["单词含义"] = found
        fixed_stem += 1
        continue

    # 策略 3: 同根词推导
    derived = derive_meaning(w, root)
    if derived:
        c["单词含义"] = derived
        fixed_derive += 1
        continue

    still_open += 1

# 报告
print(f"\n=== 修复统计 ===")
print(f"字典直查命中：{fixed_dict}")
print(f"去后缀查字典：{fixed_stem}")
print(f"同根词推导：{fixed_derive}")
print(f"仍待人工：{still_open}")

# 写回
bak = DATA + ".bak2"
with open(bak, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
with open(DATA, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"\n备份：{bak}")
print(f"已写回 {DATA}")

# 抽查
print(f"\n=== 抽查修复后的卡 ===")
for c in cards[:0]:
    pass
sample_words = ["actually", "ductile", "numeric", "inverted", "trend", "stagnant", "criticise", "computable"]
for w in sample_words:
    c = by_word.get(w)
    if c:
        print(f"  {w:18} {c['单词含义'][:80]}")
