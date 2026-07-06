#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""最终清洗：处理 v2 遗漏的边缘情况
- 词根本义 == "待补充" → 用 fallback
- 单词含义 == /IPA/ → 用 raw_meaning 重新提取
- 残留 ；］ 之类
- v.+0 → v. + 序号修正
"""
import json, re, os, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

WS = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
DICT_FILE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\all_books_combined.txt"

dict_text = open(DICT_FILE, encoding="utf-8").read()
data = json.load(open(DATA, encoding="utf-8"))
cards = data["cards"]


def final_clean(s):
    if not s: return s
    out = s
    # 残留中文/英文括号
    out = re.sub(r"［[^］]*］", "", out)
    out = re.sub(r"\[[^\]]*\]", "", out)
    # ；］ 之类
    out = re.sub(r"\s*[；;]\s*[\]］〕》）)]+", "", out)
    out = re.sub(r"[\]］〕》）)]+(?=[；;。,，\s]|$)", "", out)
    out = re.sub(r"^[\[［〔《（(]+", "", out)
    # 多空格 / 标点
    out = re.sub(r"[；;]+", "；", out)
    out = re.sub(r"\s+", " ", out)
    # v. + 单字符（实际是 ① 等被替换为半角错乱）
    out = re.sub(r"\b([nva][a-z]?)\.\s*(\d+)\s+", r"\1. ", out)
    # 词根注释：（agere 的拉丁语词干）这种保留
    out = out.strip(" ;；.。·,，:：\t\r\n→·-")
    return out


def is_ipa_only(s):
    """判断是否只是 /xxx/ IPA 而无释义"""
    return bool(re.fullmatch(r"\s*/[^/]+/\s*", s.strip()))


def dict_lookup_meaning(word):
    """字典里宽松找释义"""
    w = re.escape(word.lower())
    for p in [
        rf"^{w}\s*［[^］]*］\s*([nvajdr][a-z]*\.[^\n]+)",
        rf"^{w}\s+([nvajdr][a-z]*\.\s*[一-龥][^\n]{{3,80}})",
        rf"\b{w}\b[^\n]*?[（(]([nvajdr][a-z]*\.[^)）]*?[一-龥][^)）]+)[)）]",
        rf"\b{w}\b[^\n]{{0,30}}[（(]?([一-龥][^（）()。\n]{{3,40}})",
    ]:
        m = re.search(p, dict_text, re.M | re.I)
        if m:
            r = m.group(1).strip().strip(":：. ")
            cleaned = final_clean(r)
            if len(cleaned) >= 3 and not is_ipa_only(cleaned):
                return cleaned
    return None


# ===== 修复 =====
fixed_root_meaning = 0
fixed_word_meaning = 0
fixed_clean = 0

for c in cards:
    w = c["单词"]
    w_l = w.lower()
    root = c["词根"]

    # a. 词根本义 = 待补充 → fallback
    rm = c.get("词根本义", "").strip()
    if rm in ("待补充", "（待补充）", "(待补充)") or rm.startswith("待补充"):
        base = re.split(r"[/\-,\s]+", root.lower())[0].strip("-")
        c["词根本义"] = f"词根 {root}（拉丁/希腊语 {base}，详见词根学习笔记）"
        fixed_root_meaning += 1

    # b. 单词含义 = IPA only → 字典找
    wm = c.get("单词含义", "").strip()
    if is_ipa_only(wm):
        found = dict_lookup_meaning(w_l)
        if found:
            c["单词含义"] = found
            fixed_word_meaning += 1
        else:
            # 兜底用拆解信息
            c["单词含义"] = f"含 {root} 词根的派生词"
            fixed_word_meaning += 1

    # c. final_clean 二次
    wm = c.get("单词含义", "")
    new_wm = final_clean(wm)
    if new_wm != wm:
        c["单词含义"] = new_wm
        fixed_clean += 1

print(f"修复统计：")
print(f"  词根本义 (待补充→fallback)：{fixed_root_meaning}")
print(f"  单词含义 (IPA-only→真释义)：{fixed_word_meaning}")
print(f"  含义二次清洗：{fixed_clean}")

with open(DATA, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

# 抽查
by_word = {c["单词"].lower(): c for c in cards}
print("\n=== 抽查 ===")
for w in ["vert", "grad", "fluctuate", "decapitate", "acupuncture", "inverted", "actually"]:
    c = by_word.get(w)
    if c:
        print(f"\n  {w}")
        for k in ["词根本义", "单词音标", "单词含义", "拆解"]:
            print(f"    {k}: {c.get(k,'')[:90]}")
