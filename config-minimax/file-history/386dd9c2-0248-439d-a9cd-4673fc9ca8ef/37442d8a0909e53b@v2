#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""综合修复：从原始 roots_part*.md 重新精确抽取
- 单词音标（第一列里 word /IPA/ 那个 IPA）
- 词根本义（**含义**: 行）
- 单词含义清洗（去 [xxx] ［xxx］ → ］ 等书本符号）
"""
import json, re, os, sys, io
from collections import defaultdict

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

WS = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
FILES = ["roots_part1.md", "roots_part2.md", "roots_part3.md"]


# ===== 1. 从源文件重新抽取所有信息 =====
print("[1/3] 解析 3 个 roots_part 源文件...")

word_ipa_map = {}          # word_lower → IPA
root_meaning_map = {}      # root → 中文含义
word_raw_meaning_map = {}  # word_lower → 释义（清洗前的原始）
word_breakdown_map = {}    # word_lower → 拆解

for fn in FILES:
    path = os.path.join(WS, fn)
    text = open(path, encoding="utf-8").read()

    # 按词根块切
    blocks = re.split(r"^# 📚 第\d+个词根：", text, flags=re.M)[1:]
    headers = re.findall(r"^# 📚 第\d+个词根：(.+)$", text, flags=re.M)

    for hdr, block in zip(headers, blocks):
        root = hdr.strip()

        # 词根含义：多种格式
        # 格式 A：**含义**: xxx
        # 格式 B：**核心含义**：xxx
        # 格式 C：含义: xxx
        # 格式 D：part3 是 **含义**: word 中文
        m = re.search(r"\*\*(?:核心)?含义\*\*[:：]\s*([^\n]+)", block)
        if m:
            root_meaning_map[root] = m.group(1).strip()

        # 解析表格
        for line in block.splitlines():
            # 格式 A（part1/2）：| word /ipa/ | [IPA] |  | ACT + affix |
            m = re.match(r"^\|\s*([a-zA-Z][a-zA-Z\-]+)\s+/([^/\|]+)/\s*\|\s*([^|]*)\|\s*([^|]*)\|", line)
            if m:
                word = m.group(1).lower().strip("-")
                ipa = m.group(2).strip()
                meaning_col = m.group(3).strip()
                breakdown_col = m.group(4).strip()
                if word and ipa and ipa not in ("IPA", ""):
                    word_ipa_map[word] = f"/{ipa}/"
                if word and breakdown_col and breakdown_col != "ACT + affix":
                    if not word_breakdown_map.get(word):
                        word_breakdown_map[word] = breakdown_col
                continue
            # 格式 B（part3）：| word | 中文释义 |
            m = re.match(r"^\|\s*([a-zA-Z][a-zA-Z\-]+)\s*\|\s*(.+?)\s*\|", line)
            if m:
                word = m.group(1).lower().strip("-")
                meaning = m.group(2).strip()
                if word and meaning and meaning not in ("[IPA]", "", "ipa"):
                    if not word_raw_meaning_map.get(word):
                        word_raw_meaning_map[word] = meaning

        # 核心派生词精讲（含 IPA）
        # ### 1. act /ækt/ [IPA]
        for m in re.finditer(r"###\s*\d+\.\s+([a-zA-Z\-]+)\s+/([^/\s]+)/", block):
            word = m.group(1).lower().strip("-")
            ipa = m.group(2).strip()
            if word and ipa:
                word_ipa_map.setdefault(word, f"/{ipa}/")

# 来源/页码：part3 顶部还有 **来源**: 【L】 **含义**: needle 针
for fn in FILES:
    path = os.path.join(WS, fn)
    text = open(path, encoding="utf-8").read()
    blocks = re.split(r"^# 📚 第\d+个词根：", text, flags=re.M)[1:]
    headers = re.findall(r"^# 📚 第\d+个词根：(.+)$", text, flags=re.M)
    for hdr, block in zip(headers, blocks):
        root = hdr.strip()
        # 用 **含义** 后面的整段（part3 通常是 needle 针 这种 英文+中文）
        m = re.search(r"\*\*(?:核心)?含义\*\*[:：]\s*([^\n]+)", block)
        if m and root not in root_meaning_map:
            root_meaning_map[root] = m.group(1).strip()

print(f"  → 抽到 {len(word_ipa_map)} 个 word IPA")
print(f"  → 抽到 {len(root_meaning_map)} 个词根含义")
print(f"  → 抽到 {len(word_raw_meaning_map)} 个原始释义")


# ===== 2. 含义清洗函数 =====
def clean_meaning(s):
    if not s:
        return s
    out = s
    # 去掉 [xxx] ［xxx］ 内的注释（词素拆解）
    out = re.sub(r"［[^］]*］", "", out)
    out = re.sub(r"\[[^\]]*\]", "", out)
    # 去掉孤立 ］ → ］ 之类残留
    out = re.sub(r"[→]+\s*[\]）)]+", "", out)
    out = re.sub(r"[\]）)]+\s*$", "", out)
    out = re.sub(r"^\s*[\[（(]+", "", out)
    # 全/半角空格归一
    out = re.sub(r"[　\s]+", " ", out)
    out = out.strip(" ;；.。·,，:：\t")
    # 把"v. ① wholly turn"里的 ① 序号还原成 (1)
    out = re.sub(r"[①②③④⑤⑥⑦⑧⑨⑩]", lambda m: {"①":"(1)","②":"(2)","③":"(3)","④":"(4)","⑤":"(5)","⑥":"(6)","⑦":"(7)","⑧":"(8)","⑨":"(9)","⑩":"(10)"}[m.group()], out)
    return out


# ===== 3. 词根本义生成（含义 + 字面） =====
def build_root_meaning(root):
    if root in root_meaning_map:
        m = root_meaning_map[root].strip()
        # part3 格式：来源/含义/页码 行被一起抓的话也清理
        m = m.replace("**", "").strip(":：; ")
        if m and m not in ("---", ""):
            return m
    # 回退
    return f"词根 {root}（拉丁/希腊语 {root.split('/')[0].strip('-').lower()}）"


# ===== 4. 词根音标（手工 + 估算） =====
ROOT_IPA = {
    # 已知精确
    "ACT-": "/ækt/", "FORM-": "/fɔːm/", "DICT-": "/dɪkt/", "PORT-": "/pɔːt/",
    "VIS-/VID-": "/vɪz/, /vɪd/", "VIS-": "/vɪz/", "VID-": "/vɪd/",
    "TRACT-": "/trækt/", "DUC-/DUCT-": "/djuːs/, /dʌkt/",
    "DUC-": "/djuːs/", "DUCT-": "/dʌkt/",
    "MIT-/MISS-": "/mɪt/, /mɪs/", "MIT-": "/mɪt/", "MISS-": "/mɪs/",
    "PEL-/PULS-": "/pel/, /pʌls/", "PEL-": "/pel/", "PULS-": "/pʌls/",
    "PUT-": "/pjuːt/", "SPECT-": "/spekt/",
    "JECT-": "/dʒekt/", "JUNCT-/JOIN-": "/dʒʌŋkt/, /dʒɔɪn/",
    "JUNCT-": "/dʒʌŋkt/", "JOIN-": "/dʒɔɪn/",
    "FLU-/FLUX-": "/fluː/, /flʌks/", "FLU-": "/fluː/", "FLUX-": "/flʌks/",
    "NUMER-/NUMB-": "/njuːmər/, /nʌmb/", "NUMER-": "/njuːmər/", "NUMB-": "/nʌmb/",
    "SCRIB-/SCRIPT-": "/skraɪb/, /skrɪpt/",
    "SCRIB-": "/skraɪb/", "SCRIPT-": "/skrɪpt/",
    "CLUD-/CLUS-": "/kluːd/, /kluːs/", "CLUD-": "/kluːd/", "CLUS-": "/kluːs/",
    "CLAIM-/CLAM-": "/kleɪm/, /klæm/", "CLAIM-": "/kleɪm/", "CLAM-": "/klæm/",
    "FECT-/FACT-": "/fekt/, /fækt/", "FECT-": "/fekt/", "FACT-": "/fækt/",
    "FLEX-/FLECT-": "/fleks/, /flekt/", "FLEX-": "/fleks/", "FLECT-": "/flekt/",
    "GRAD-/GRESS-": "/ɡreɪd/, /ɡres/", "GRAD-": "/ɡreɪd/", "GRESS-": "/ɡres/",
    "STRU-/STRUCT-": "/struː/, /strʌkt/", "STRU-": "/struː/", "STRUCT-": "/strʌkt/",
    "FID-": "/fɪd/",
    "TEND-/TENS-/TENT-": "/tend/, /tens/, /tent/",
    "TEND-": "/tend/", "TENS-": "/tens/", "TENT-": "/tent/",
    "TAIN-/TEN-/TIN-": "/teɪn/, /ten/, /tɪn/",
    "TAIN-": "/teɪn/", "TEN-": "/ten/", "TIN-": "/tɪn/",
    "TANG-/TACT-/TAG-": "/tæŋ/, /tækt/, /tæɡ/",
    "TANG-": "/tæŋ/", "TACT-": "/tækt/", "TAG-": "/tæɡ/",
    "TAX-": "/tæks/",
    "VERS-/VERT-": "/vɜːs/, /vɜːt/", "VERS-": "/vɜːs/", "VERT-": "/vɜːt/",
    "CUR-/COURS-": "/kɜːr/, /kɔːrs/", "CUR-": "/kɜːr/", "COURS-": "/kɔːrs/",
    "VEN-/VENT-": "/ven/, /vent/", "VEN-": "/ven/", "VENT-": "/vent/",
}

def best_root_ipa(root):
    if root in ROOT_IPA:
        return ROOT_IPA[root]
    # 单变体
    for variant in re.split(r"[/,]", root):
        v = variant.strip()
        if v in ROOT_IPA:
            return ROOT_IPA[v]
    # part3 词根多是小写形态，用字面 + 标注"估"
    base = re.split(r"[/\-,\s]+", root.lower())[0].strip("-")
    if base:
        return f"/{base}/"
    return ""


# ===== 5. 应用修复 =====
print("\n[2/3] 应用修复到 complete_data.json...")
data = json.load(open(DATA, encoding="utf-8"))
cards = data["cards"]

fix_word_ipa = 0
fix_root_meaning = 0
fix_meaning_clean = 0
fix_root_ipa = 0
fix_word_meaning = 0

for c in cards:
    w = c["单词"].lower()
    root = c["词根"]

    # a. 单词音标：若是 /word/ 兜底，用真 IPA 替换
    cur_ipa = c.get("单词音标", "")
    if cur_ipa in (f"/{w}/", f"/{c['单词']}/") and w in word_ipa_map:
        c["单词音标"] = word_ipa_map[w]
        fix_word_ipa += 1

    # b. 词根本义：去除占位
    cur_rm = c.get("词根本义", "")
    if cur_rm.startswith("---") or "**核心含义**" in cur_rm or cur_rm == "":
        new_rm = build_root_meaning(root)
        c["词根本义"] = new_rm
        fix_root_meaning += 1

    # c. 单词含义清洗
    cur_meaning = c.get("单词含义", "")
    cleaned = clean_meaning(cur_meaning)
    if cleaned != cur_meaning:
        c["单词含义"] = cleaned
        fix_meaning_clean += 1

    # d. 词根音标（如果之前是没有 IPA 字符的伪 IPA）
    cur_ripa = c.get("词根音标", "")
    bare = cur_ripa.strip("/")
    has_ipa_chars = any(ch in bare for ch in "æɛɪʊʌɔəɜːθðŋʃʒʤʧˈˌ")
    if cur_ripa and not has_ipa_chars:
        # 试用查表
        new_ripa = best_root_ipa(root)
        if new_ripa and new_ripa != cur_ripa:
            new_bare = new_ripa.strip("/").replace(",", "").replace(" ", "")
            if any(ch in new_bare for ch in "æɛɪʊʌɔəɜːθðŋʃʒʤʧˈˌ"):
                c["词根音标"] = new_ripa
                fix_root_ipa += 1

    # e. 含义如果还是空或仅"(待补充)"，用原始书本释义代替
    if (not c.get("单词含义") or "待补充" in c.get("单词含义", "")) and w in word_raw_meaning_map:
        c["单词含义"] = clean_meaning(word_raw_meaning_map[w])
        fix_word_meaning += 1

print(f"\n  修复统计：")
print(f"  - 单词音标（替换兜底）：{fix_word_ipa}")
print(f"  - 词根本义（替换占位）：{fix_root_meaning}")
print(f"  - 单词含义清洗：{fix_meaning_clean}")
print(f"  - 词根音标（修真 IPA）：{fix_root_ipa}")
print(f"  - 单词含义补回原书：{fix_word_meaning}")

# 写回（备份）
bak = DATA + ".bak3"
with open(bak, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
with open(DATA, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
print(f"\n备份：{bak}")
print(f"已写回：{DATA}")

# ===== 6. 抽查 =====
print("\n[3/3] 抽查修复后的卡：")
by_word = {c["单词"].lower(): c for c in cards}
for w in ["act", "vert", "inverted", "fluctuate", "acupuncture", "actually", "decapitate", "grad"]:
    c = by_word.get(w)
    if c:
        print(f"\n  {w}:")
        for k in ["词根", "词根音标", "词根本义", "单词音标", "单词含义", "拆解"]:
            v = c.get(k, "")
            print(f"    {k}: {v[:100] if v else '(空)'}")
