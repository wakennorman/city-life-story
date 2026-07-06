#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扩充 complete_data.json：把 3 个 roots_part 文件里所有 1768 个词全部加上卡片，
   带配图字段（指向 anki/media/ 里下好的 jpg）。
   不动已有 488 张卡的内容，只追加缺失的。
"""
import os, json, re, sys, io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

WS = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace"
ANKI = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki"
PROMPTS = r"D:\Claude Code+DeepSeekV4\prompts.json"
FULL_DATA = r"D:\Claude Code+DeepSeekV4\to_generate_with_meaning.json"
DATA_FILE = os.path.join(ANKI, "complete_data.json")
LOCAL_MAP = os.path.join(ANKI, "local_image_map.json")
BACKUP = os.path.join(ANKI, "complete_data.json.bak")

# 1) 备份现有 complete_data.json
with open(DATA_FILE, encoding="utf-8") as f:
    existing = json.load(f)
with open(BACKUP, "w", encoding="utf-8") as f:
    json.dump(existing, f, ensure_ascii=False, indent=2)
print(f"已备份现有 {len(existing['cards'])} 张卡 → {BACKUP}")

# 2) 索引已有卡片（按单词去重）
existing_words = {c["单词"].lower(): c for c in existing["cards"]}
print(f"已有覆盖词数：{len(existing_words)}")

# 3) 加载新词的元数据
with open(FULL_DATA, encoding="utf-8") as f:
    full = json.load(f)
records = full["records"]

with open(LOCAL_MAP, encoding="utf-8") as f:
    local_map = json.load(f)
print(f"已下图：{len(local_map)} 张")

# 4) 词根 → 中文含义映射（从 part3 文件里直接抽，最准）
ROOT_META = {}
for fn in ["roots_part1.md", "roots_part2.md", "roots_part3.md"]:
    path = os.path.join(WS, fn)
    with open(path, encoding="utf-8") as f:
        text = f.read()
    blocks = re.split(r"^# 📚 第\d+个词根：", text, flags=re.M)[1:]
    headers = re.findall(r"^# 📚 第\d+个词根：(.+)$", text, flags=re.M)
    for hdr, block in zip(headers, blocks):
        root = hdr.strip()
        # 找含义行
        m = re.search(r"\*\*(?:含义|核心含义)\*\*[:：]\s*(.+)", block)
        meaning = m.group(1).strip() if m else ""
        # 找来源
        m2 = re.search(r"\*\*(?:来源|词根来源)\*\*[:：]\s*(.+)", block)
        source = m2.group(1).strip() if m2 else ""
        ROOT_META[root] = {"meaning": meaning, "source": source}

# 5) 词根音标兜底表（高频词根）
ROOT_IPA = {
    "ACT-": "/ækt/", "FORM-": "/fɔːm/", "DICT-": "/dɪkt/", "PORT-": "/pɔːt/",
    "VIS-": "/vɪs/", "VID-": "/vɪd/", "TRACT-": "/trækt/",
    "DUC-": "/djuːk/", "DUCT-": "/dʌkt/", "MIT-": "/mɪt/", "MISS-": "/mɪs/",
    "PEL-": "/pel/", "PULS-": "/pʌls/", "PUT-": "/pjuːt/", "SPECT-": "/spekt/",
    "JECT-": "/dʒekt/", "JUNCT-": "/dʒʌŋkt/", "JOIN-": "/dʒɔɪn/",
    "FLU-": "/fluː/", "FLUX-": "/flʌks/", "NUMER-": "/njuːmər/", "NUMB-": "/nʌm/",
    "SCRIB-": "/skraɪb/", "SCRIPT-": "/skrɪpt/", "CLUD-": "/kluːd/", "CLUS-": "/kluːs/",
    "CLAIM-": "/kleɪm/", "CLAM-": "/klæm/", "FECT-": "/fekt/", "FACT-": "/fækt/",
    "FLEX-": "/fleks/", "FLECT-": "/flekt/", "GRAD-": "/ɡreɪd/", "GRESS-": "/ɡres/",
    "STRU-": "/struː/", "STRUCT-": "/strʌkt/", "FID-": "/fɪd/",
    "TEND-": "/tend/", "TENS-": "/tens/", "TENT-": "/tent/",
    "TAIN-": "/teɪn/", "TEN-": "/ten/", "TIN-": "/tɪn/",
    "TANG-": "/tæŋ/", "TACT-": "/tækt/", "TAG-": "/tæɡ/",
    "TAX-": "/tæks/", "VERS-": "/vɜːs/", "VERT-": "/vɜːt/",
    "CUR-": "/kɜːr/", "COURS-": "/kɔːs/", "VEN-": "/ven/", "VENT-": "/vent/",
}

def get_root_ipa(root_field):
    # 直接命中
    if root_field in ROOT_IPA:
        return ROOT_IPA[root_field]
    # 拆 / 取第一个
    for variant in re.split(r"[/,]", root_field):
        v = variant.strip()
        if v in ROOT_IPA:
            return ROOT_IPA[v]
        # 加 - 试试
        if v + "-" in ROOT_IPA:
            return ROOT_IPA[v + "-"]
    # 兜底：估算 IPA
    base = re.split(r"[/\-,\s]+", root_field.lower())[0].strip("-")
    return f"/{base}/"


def get_root_meaning(root_field):
    """从 ROOT_META 取，或回退到已有卡片的同词根。"""
    if root_field in ROOT_META and ROOT_META[root_field]["meaning"]:
        m = ROOT_META[root_field]["meaning"]
        src = ROOT_META[root_field]["source"]
        return f"{m}（{src}）" if src else m
    # 从已有卡片找
    for c in existing["cards"]:
        if c["词根"] == root_field and c.get("词根本义"):
            return c["词根本义"]
    # 兜底：用词根本身的字面
    base = re.split(r"[/\-,\s]+", root_field.lower())[0].strip("-")
    return f"词根 {root_field}（拉丁语 {base}）"


def get_word_ipa(word, raw_text):
    """从 raw text 找 /xxx/ 形式的 IPA"""
    m = re.search(r"/([^/]+)/", raw_text)
    return f"/{m.group(1)}/" if m else f"/{word}/"


def split_word(word, root_field):
    """简单拆解：词根 + 词的剩余部分"""
    # 找哪个变体在词里
    for variant in re.split(r"[/,]", root_field):
        v = variant.strip().strip("-").lower()
        if v and v in word.lower():
            idx = word.lower().find(v)
            prefix = word[:idx]
            suffix = word[idx+len(v):]
            parts = []
            if prefix:
                parts.append(f"{prefix}-")
            parts.append(v.upper())
            if suffix:
                parts.append(f"-{suffix}")
            return " + ".join(parts)
    return f"{root_field} + 词缀"


# 6) 遍历所有 records，构造完整卡片
new_cards = []
preserved = 0
created = 0

with open(PROMPTS, encoding="utf-8") as f:
    prompts = json.load(f)

# 用 records 顺序（含词根本身和派生词）
for word, rec in records.items():
    word_lower = word.lower()
    # 已有卡：保留，只刷新配图字段
    if word_lower in existing_words:
        card = existing_words[word_lower].copy()
        # 更新配图字段（若 local_map 有）
        if word_lower in local_map:
            card["配图"] = local_map[word_lower]
        new_cards.append(card)
        preserved += 1
        continue

    # 新卡
    root_field = rec.get("root", "")
    raw_meaning = rec.get("raw_meaning", "")
    # 字段
    card = {
        "词根": root_field,
        "词根音标": get_root_ipa(root_field),
        "词根本义": get_root_meaning(root_field),
        "单词": word,
        "单词音标": get_word_ipa(word, raw_meaning),
        "单词含义": raw_meaning if raw_meaning else "（待补充）",
        "拆解": split_word(word, root_field),
        "配图": local_map.get(word_lower, ""),
    }
    new_cards.append(card)
    created += 1

# 6.5) 把没出现在 records 里的老卡也加上（保留）
seen_words = {c["单词"].lower() for c in new_cards}
orphan = 0
for w, c in existing_words.items():
    if w not in seen_words:
        # 若 local_map 有图，刷新配图
        if w in local_map and not c.get("配图"):
            c["配图"] = local_map[w]
        new_cards.append(c)
        orphan += 1

print(f"\n构建完成：保留 {preserved}，新建 {created}，老卡兜底 {orphan}，总卡数 {len(new_cards)}")

# 7) 输出
out = {"cards": new_cards}
with open(DATA_FILE, "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=2)
print(f"写入 {DATA_FILE}")

# 校验：配图覆盖率
with_img = sum(1 for c in new_cards if c.get("配图"))
print(f"\n配图字段覆盖率：{with_img}/{len(new_cards)} ({with_img/len(new_cards)*100:.1f}%)")
no_img = [c["单词"] for c in new_cards if not c.get("配图")][:10]
if no_img:
    print(f"无配图字段（示例）：{no_img}")
