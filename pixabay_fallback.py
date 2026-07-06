#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""失败词兜底：换搜索词重试。

策略：
1. 中文释义里抽英文核心词
2. 拆出词根 + 用词根含义搜
3. 加 "concept" / "vector" 等通用词
4. 还不行就用同词根的别词图（兜兜底）
"""
import urllib.request, urllib.parse, json, os, time, re
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

KEY = "56301016-56b7d4e6af292e4cf31ad7f21"
MEDIA_DIR = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
PIXABAY_CACHE = r"D:\Claude Code+DeepSeekV4\pixabay_results.json"
TO_GEN_FULL = r"D:\Claude Code+DeepSeekV4\to_generate_with_meaning.json"
LOCAL_MAP = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\local_image_map.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 3
PAUSE = 1.5
TIMEOUT = 15

cache_lock = threading.Lock()

# 词根 → 英文核心概念（用于搜图兜底）
ROOT_TO_EN = {
    "act": "action", "form": "shape", "dict": "speak", "port": "carry",
    "vis": "see", "vid": "see", "tract": "pull", "duc": "lead", "duct": "lead",
    "mit": "send", "miss": "send", "pel": "push", "puls": "pulse", "put": "think",
    "spect": "watch", "ject": "throw", "junct": "join", "join": "join",
    "flu": "flow", "flux": "flow", "numer": "number", "numb": "number",
    "scrib": "write", "script": "writing", "clud": "close", "clus": "closed",
    "claim": "shout", "clam": "shout", "fect": "make", "fact": "factory",
    "flex": "bend", "flect": "bend", "grad": "step", "gress": "walk",
    "stru": "build", "struct": "structure", "fid": "trust",
    "tend": "stretch", "tens": "tension", "tent": "tent",
    "tain": "hold", "ten": "hold", "tin": "hold",
    "tang": "touch", "tact": "touch", "tag": "label",
    "tax": "order", "vers": "turn", "vert": "rotate",
    "cur": "run", "cours": "course", "ven": "come", "vent": "wind",
    "fin": "end", "firm": "firm", "fix": "fix", "fract": "break", "frag": "fragment",
    "fug": "flee", "fund": "foundation", "fus": "pour", "gen": "birth",
    "gest": "carry", "graph": "draw", "gram": "letter", "habit": "house",
    "her": "stick", "hes": "glue", "hum": "soil", "ign": "fire",
    "lab": "labor", "lat": "carry", "lect": "read", "leg": "law",
    "lev": "lift", "liber": "freedom", "lic": "permit", "lig": "tie",
    "loc": "location", "log": "word", "loqu": "speak", "luc": "light",
    "lumin": "light", "lun": "moon", "lustr": "shine", "magn": "large",
    "maj": "greater", "max": "maximum", "mar": "sea", "mat": "mother",
    "med": "medical", "medic": "medicine", "memor": "memory", "member": "limb",
    "mend": "fix", "acu": "needle", "aer": "air", "agon": "struggle",
    "agr": "agriculture", "alg": "pain", "ag": "drive", "ig": "drive",
    "am": "love", "anim": "soul", "ann": "year", "anthrop": "human",
    "aqua": "water", "arch": "ancient", "art": "art", "aud": "hear",
    "audi": "audio", "bell": "war", "ben": "good", "bibl": "book",
    "bio": "life", "brev": "short", "cad": "fall", "cas": "fall",
    "cap": "head", "cept": "take", "ceive": "receive", "ced": "yield",
    "cess": "process", "celer": "speed", "cent": "hundred", "centr": "center",
    "cern": "discern", "cert": "certain", "chrom": "color", "chron": "time",
    "cide": "kill", "cis": "cut", "cit": "cite", "civ": "city",
    "clar": "clear", "clin": "incline", "cogn": "knowledge", "cord": "heart",
    "corp": "body", "cosm": "cosmos", "cre": "create", "cred": "credit",
    "crim": "crime", "cult": "culture", "cycl": "cycle", "dec": "decimal",
    "dem": "people", "dent": "tooth", "derm": "skin", "di": "double",
    "dign": "dignity", "doc": "teach", "dol": "pain", "dom": "house",
    "don": "give", "dorm": "sleep", "dox": "opinion", "dynam": "power",
    "ego": "ego", "equ": "equal", "err": "error", "esth": "beauty",
    "ethn": "ethnic", "fa": "fame", "fer": "carry", "fil": "thread",
    "front": "front", "gam": "marriage", "geo": "earth", "germ": "germ",
    "glor": "glory", "gn": "knowledge", "grat": "gratitude", "greg": "group",
    "hap": "luck", "hemi": "half", "homo": "same", "hydr": "water",
    "iatr": "doctor", "init": "start", "integr": "whole", "ir": "anger",
    "it": "move", "jur": "law", "just": "justice", "juven": "young",
    "lav": "wash", "linqu": "leave", "liter": "literature", "long": "long",
    "man": "hand", "manu": "manual", "mater": "mother", "matr": "matrix",
    "mech": "machine", "mens": "month", "merc": "merchant", "merg": "merge",
    "meter": "meter", "min": "minimum", "mir": "wonder", "mis": "send",
    "mob": "mobile", "mod": "mode", "mon": "warning", "mor": "custom",
    "mort": "death", "mot": "motion", "mut": "mutate", "nasc": "newborn",
    "nat": "native", "naut": "nautical", "nav": "navy", "neg": "negation",
    "noc": "harm", "nom": "name", "nomin": "nominate", "norm": "normal",
    "nounc": "announce", "nov": "new", "nul": "null",
    "ocul": "eye", "od": "song", "onym": "name", "oper": "operate",
    "opt": "option", "or": "mouth", "ord": "order", "ori": "rise",
    "orn": "ornament", "ortho": "orthodox", "pac": "peace",
    "part": "part", "pass": "pass", "pat": "patient", "path": "feeling",
    "pater": "father", "patr": "patriarch", "ped": "pedestrian",
    "pend": "pendulum", "pens": "weigh", "pet": "petition", "phil": "love",
    "phob": "fear", "phon": "phone", "phot": "photo", "phys": "physical",
    "pict": "picture", "plac": "place", "plant": "plant", "ple": "full",
    "plen": "plenty", "pli": "fold", "plic": "fold", "plod": "applause",
    "plor": "explore", "plur": "plural", "ply": "ply", "pneum": "lung",
    "pod": "foot", "polis": "city", "polit": "politics", "pon": "place",
    "pop": "population", "pos": "position", "poss": "possible", "pot": "power",
    "pre": "prepare", "prehend": "comprehend", "press": "press", "prim": "primary",
    "priv": "private", "prob": "probe", "prov": "prove", "psych": "mind",
    "pugn": "fight", "punct": "point", "pung": "puncture", "pur": "pure",
    "quer": "query", "quest": "quest", "quir": "inquire", "quit": "quit",
    "rad": "ray", "ras": "erase", "rat": "rational", "ration": "ratio",
    "reg": "regulate", "rect": "rectangle", "rid": "ridicule", "rig": "rigid",
    "rip": "riverbank", "riv": "river", "rod": "rodent", "rog": "interrogate",
    "rot": "rotate", "rud": "rude", "rupt": "rupture", "sacr": "sacred",
    "sal": "salt", "san": "sane", "sanct": "sanctuary", "sat": "satiate",
    "sci": "science", "scop": "telescope", "sect": "section", "secut": "follow",
    "sed": "sediment", "sens": "sense", "sent": "sentiment", "sequ": "sequence",
    "serv": "serve", "sess": "session", "sid": "side", "sign": "sign",
    "simil": "similar", "sist": "consist", "soci": "social", "sol": "solo",
    "solv": "solve", "solut": "solution", "somn": "insomnia", "son": "sound",
    "soph": "wisdom", "spers": "disperse", "spir": "spirit", "spond": "respond",
    "spons": "sponsor", "st": "stand", "stat": "statue", "sting": "sting",
    "stinct": "instinct", "stitut": "institution", "strict": "strict",
    "stud": "study", "sum": "sum", "sumpt": "presumption", "tac": "tacit",
    "techn": "technology", "tele": "telephone", "temp": "temple", "tempor": "temporal",
    "ter": "territory", "term": "terminal", "terr": "land", "text": "text",
    "the": "theology", "therm": "thermal", "ton": "tone", "top": "topology",
    "tort": "tortoise", "tox": "toxic", "trib": "tribe", "trit": "trite",
    "trud": "intrude", "trus": "trust", "turb": "turbine", "umbr": "umbrella",
    "und": "wave", "uni": "uniform", "urb": "urban", "ut": "utility",
    "vac": "vacuum", "vad": "invade", "val": "value", "var": "variable",
    "veh": "vehicle", "vell": "velvet", "vest": "clothing", "vi": "via",
    "vict": "victory", "vince": "convince", "vit": "vital", "viv": "vivid",
    "voc": "voice", "vok": "invoke", "vol": "volunteer", "volv": "revolve",
    "volut": "revolution", "vor": "voracious", "vot": "vote",
}


def get_root_concept(root_field):
    if not root_field:
        return None
    roots = re.split(r"[/\-,\s]+", root_field.lower())
    for r in [x.strip("-") for x in roots if x.strip("-")]:
        if r in ROOT_TO_EN:
            return ROOT_TO_EN[r]
    return None


def extract_english_from_meaning(meaning):
    """从中文释义里抽英文（如 'a. existing in fact' 抽出 'existing fact'）"""
    if not meaning:
        return None
    # 找连续 ASCII 字母词
    words = re.findall(r"\b[a-zA-Z]{4,}\b", meaning)
    # 排除词性缩写
    stop = {"adj", "noun", "verb", "the", "and", "for", "from", "with", "this",
            "that", "have", "been", "such"}
    words = [w.lower() for w in words if w.lower() not in stop]
    return " ".join(words[:3]) if words else None


def pixabay_search(q, per_page=3):
    qs = urllib.parse.quote(q)
    url = (f"https://pixabay.com/api/?key={KEY}&q={qs}"
           f"&image_type=photo&per_page={per_page}&safesearch=true&lang=en")
    req = urllib.request.Request(url, headers=HEADERS)
    return json.loads(urllib.request.urlopen(req, timeout=TIMEOUT).read())


def download(url, dest):
    req = urllib.request.Request(url, headers=HEADERS)
    data = urllib.request.urlopen(req, timeout=TIMEOUT).read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def try_word(word, rec):
    """对失败词尝试多种 query。返回 (word, status, used_query, size)"""
    queries = []

    # 1. 中文里抽英文核心
    en = extract_english_from_meaning(rec.get("raw_meaning", ""))
    if en:
        queries.append(en)

    # 2. 词根概念
    root_concept = get_root_concept(rec.get("root", ""))
    if root_concept:
        queries.append(root_concept)

    # 3. 词本身 + concept
    queries.append(f"{word} concept")

    # 4. 词根 + 词形拼接
    if root_concept:
        queries.append(f"{root_concept} symbol")

    for q in queries:
        try:
            r = pixabay_search(q)
            hits = r.get("hits", [])
            if hits:
                url = hits[0].get("webformatURL", "")
                if url:
                    dest = os.path.join(MEDIA_DIR, f"{word}.jpg")
                    sz = download(url, dest)
                    return (word, "ok", q, sz)
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(10)
            continue
        except Exception:
            continue
        time.sleep(0.3)
    return (word, "still_no_hit", "", 0)


def main():
    # 加载缓存找出失败词
    with open(PIXABAY_CACHE, encoding="utf-8") as f:
        cache = json.load(f)
    with open(TO_GEN_FULL, encoding="utf-8") as f:
        full = json.load(f)

    failed = [w for w, v in cache.items() if not v.get("ok")]
    print(f"失败词总数：{len(failed)}")

    if not failed:
        print("无失败词")
        return

    # 抓记录
    recs = {w: full["records"].get(w, {}) for w in failed}

    done = 0
    recovered = 0
    still_failed = []
    start = time.time()

    def worker(word):
        time.sleep(PAUSE)
        return try_word(word, recs[word])

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, w): w for w in failed}
        for fut in as_completed(futures):
            word, status, query, sz = fut.result()
            done += 1
            if status == "ok":
                cache[word] = {"ok": True, "status": "ok_fallback",
                               "size": sz, "tags": query, "fallback_query": query}
                recovered += 1
            else:
                still_failed.append(word)

            if done % 20 == 0:
                with cache_lock:
                    with open(PIXABAY_CACHE, "w", encoding="utf-8") as f:
                        json.dump(cache, f, ensure_ascii=False, indent=2)
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                eta = (len(failed) - done) / rate if rate else 0
                print(f"[{done}/{len(failed)}] 救回 {recovered}, "
                      f"仍失败 {len(still_failed)}, eta={eta:.0f}m")

    # 保存
    with open(PIXABAY_CACHE, "w", encoding="utf-8") as f:
        json.dump(cache, f, ensure_ascii=False, indent=2)

    # 更新本地映射
    local_map = {}
    for w, v in cache.items():
        if v.get("ok"):
            fn = f"{w}.jpg"
            if os.path.exists(os.path.join(MEDIA_DIR, fn)):
                local_map[w] = fn
    with open(LOCAL_MAP, "w", encoding="utf-8") as f:
        json.dump(local_map, f, ensure_ascii=False, indent=2)

    print(f"\n=== 兜底完成 ===")
    print(f"救回：{recovered} / {len(failed)}")
    print(f"最终仍失败：{len(still_failed)}")
    print(f"总成功率：{sum(1 for v in cache.values() if v.get('ok'))} / {len(cache)} "
          f"({sum(1 for v in cache.values() if v.get('ok'))/len(cache)*100:.1f}%)")
    if still_failed:
        with open(r"D:\Claude Code+DeepSeekV4\final_fail_words.json", "w", encoding="utf-8") as f:
            json.dump(still_failed, f, ensure_ascii=False, indent=2)
        print(f"仍失败词列表：D:\\Claude Code+DeepSeekV4\\final_fail_words.json")
        print(f"前 20：{still_failed[:20]}")


if __name__ == "__main__":
    main()
