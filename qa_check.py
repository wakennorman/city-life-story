#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""全维度 QA：扫描 1893 张卡，按问题类型分组报告。"""
import json, re, os, sys, io
from collections import Counter, defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
MEDIA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
REPORT = r"D:\Claude Code+DeepSeekV4\qa_report.json"

data = json.load(open(DATA, encoding="utf-8"))
cards = data["cards"]
print(f"扫描 {len(cards)} 张卡...\n")

issues = defaultdict(list)

REQUIRED_FIELDS = ["词根", "词根音标", "词根本义", "单词", "单词音标", "单词含义", "拆解", "配图"]

# 配图文件索引
media_files = set(os.listdir(MEDIA)) if os.path.exists(MEDIA) else set()

# IPA 字符集
IPA_CHARS = set("æɛɪʊʌɔəɜːˈˌθðŋʃʒʤʧabcdefghijklmnopqrstuvwxyz/.-' ")

# 单词字段计数（找重复）
word_count = Counter(c["单词"].lower() for c in cards)

# 词根 → 卡数
root_count = Counter(c["词根"] for c in cards)

for i, c in enumerate(cards):
    w = c.get("单词", "").strip()
    root = c.get("词根", "").strip()
    word_l = w.lower()

    # ===== 1. 必填字段缺失 =====
    for f in REQUIRED_FIELDS:
        v = c.get(f, "")
        if not v or not str(v).strip():
            issues[f"missing_{f}"].append(f"#{i} {w}")

    # ===== 2. 占位符/垃圾值 =====
    meaning = c.get("单词含义", "")
    if "待补充" in meaning:
        issues["meaning_still_todo"].append(f"#{i} {w}")
    if "[IPA]" in meaning or "IPA]" in meaning:
        issues["meaning_has_IPA_placeholder"].append(f"#{i} {w} | {meaning[:60]}")
    if re.search(r"^\s*[\[\]\*\-]+\s*$", meaning):
        issues["meaning_is_junk_symbols"].append(f"#{i} {w} | {meaning[:60]}")
    if "***" in meaning or "[IPA" in meaning or "</?[" in meaning:
        issues["meaning_has_markdown_leftover"].append(f"#{i} {w} | {meaning[:60]}")

    # ===== 3. 词根本义异常 =====
    rm = c.get("词根本义", "")
    if rm.startswith("---") or rm.startswith("***") or "**核心含义**" in rm:
        issues["root_meaning_junk"].append(f"#{i} {w} 词根={root} | {rm[:60]}")
    if rm.startswith("词根 ") and "拉丁语" in rm and len(rm) < 30:
        issues["root_meaning_fallback_only"].append(f"#{i} {w} 词根={root} | {rm[:60]}")

    # ===== 4. 词根音标可疑 =====
    ipa = c.get("词根音标", "")
    if not (ipa.startswith("/") and ipa.endswith("/")):
        issues["root_ipa_bad_format"].append(f"#{i} {w} 词根={root} ipa={ipa}")
    elif "/" + root.split("/")[0].strip("-").lower() + "/" == ipa:
        # 兜底"假" IPA: /vert/ 这种就是把词形原样套了
        bare = ipa.strip("/")
        if not any(ch in bare for ch in "æɛɪʊʌɔəɜːθðŋʃʒʤʧˈˌ"):
            issues["root_ipa_likely_fake"].append(f"#{i} {w} 词根={root} ipa={ipa}")

    # ===== 5. 单词音标可疑（fallback 是 /word/）=====
    wipa = c.get("单词音标", "")
    if wipa == f"/{w}/" or wipa == f"/{word_l}/":
        issues["word_ipa_is_fallback"].append(f"#{i} {w} ipa={wipa}")
    if wipa and not (wipa.startswith("/") and wipa.endswith("/")):
        issues["word_ipa_bad_format"].append(f"#{i} {w} ipa={wipa}")

    # ===== 6. 拆解字段可疑 =====
    breakdown = c.get("拆解", "")
    if breakdown.strip() == root or "词缀" in breakdown and "+" not in breakdown:
        issues["breakdown_too_simple"].append(f"#{i} {w} 词根={root} | {breakdown}")
    if breakdown == "":
        issues["breakdown_empty"].append(f"#{i} {w}")

    # ===== 7. 配图问题 =====
    img = c.get("配图", "")
    if not img:
        issues["image_field_empty"].append(f"#{i} {w}")
    elif img not in media_files:
        issues["image_file_missing"].append(f"#{i} {w} 配图={img}")
    else:
        # 看文件大小
        sz = os.path.getsize(os.path.join(MEDIA, img))
        if sz < 1024:
            issues["image_too_small"].append(f"#{i} {w} 配图={img} {sz}B")
        elif sz < 3000:
            issues["image_small_size"].append(f"#{i} {w} 配图={img} {sz}B")

    # ===== 8. 含义里残留 markdown 标记（→] 之类）=====
    if re.search(r"[\[\]→…]{2,}", meaning) or "→]" in meaning or "［" in meaning or "］" in meaning:
        issues["meaning_has_book_marks"].append(f"#{i} {w} | {meaning[:80]}")

    # ===== 9. 词根字段为「VERS-/VERT-」类型，单词不含任何变体 =====
    if root and w:
        variants = [v.strip().strip("-").lower() for v in re.split(r"[/,]", root) if v.strip()]
        variants = [v for v in variants if v]
        if variants and not any(v in word_l for v in variants):
            issues["word_root_mismatch"].append(f"#{i} {w} 词根={root}")

    # ===== 10. 重复单词卡 =====
    if word_count[word_l] > 1:
        issues["duplicate_word"].append(f"#{i} {w} (出现 {word_count[word_l]} 次)")

# 去重 duplicate_word（每词只报一次）
issues["duplicate_word"] = sorted(set(issues["duplicate_word"]))

# ===== 输出报告 =====
print("=" * 60)
print("QA 报告（按问题类型）")
print("=" * 60)
total_problems = 0
for k in sorted(issues.keys()):
    n = len(issues[k])
    if n == 0:
        continue
    total_problems += n
    print(f"\n[{k}] {n} 条")
    for line in issues[k][:5]:
        print(f"  {line}")
    if n > 5:
        print(f"  ... 还有 {n-5} 条")

print(f"\n\n=== 汇总 ===")
print(f"问题类型数：{sum(1 for v in issues.values() if v)}")
print(f"问题条数（含重复计入）：{total_problems}")
print(f"卡总数：{len(cards)}")

# 写报告（结构化）
with open(REPORT, "w", encoding="utf-8") as f:
    json.dump({k: v for k, v in issues.items() if v}, f, ensure_ascii=False, indent=2)
print(f"\n详细报告：{REPORT}")
