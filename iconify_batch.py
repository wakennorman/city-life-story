#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""用 Iconify 矢量图标替换全部 1893 张配图。

策略：
1. 直接搜词
2. 0 hit → 从中文释义抽英文核心词搜
3. 仍 0 hit → 用词根英文概念（ROOT_TO_EN）搜
4. 仍 0 hit → 退到 emoji fallback（'star' 之类通用占位）
5. 挑图：跳过 token/cryptocurrency/flag 等品牌图标；优先 emoji 套件
"""
import urllib.request, urllib.parse, json, os, re, time, sys, io
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

MEDIA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
ANKI_MEDIA = r"C:\Users\陈恒稳\AppData\Roaming\Anki2\账户 1\collection.media"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
RESULT = r"D:\Claude Code+DeepSeekV4\iconify_results.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 5     # Iconify CDN 稳定，能上 5
PAUSE = 0.3
TIMEOUT = 10

cache_lock = threading.Lock()

# 跳过的图标集（logo/币种/旗帜，对学英语没用）
SKIP_PREFIXES = {
    "token", "token-branded", "cryptocurrency", "cryptocurrency-color",
    "circle-flags", "flag", "flagpack", "twemoji-flag", "flag-icons",
    "logos", "simple-icons", "skill-icons", "devicon",
    "fa-brands", "brandico", "akar-icons-brands",
}

# 优先选这些（彩色 emoji 最直观）
PREFERRED_ORDER = [
    "twemoji", "noto", "noto-v1", "fluent-emoji-flat", "fluent-emoji",
    "openmoji", "streamline-emojis", "emojione",
    "material-symbols", "mdi", "material-symbols-light",
    "solar", "tabler", "lucide", "ph", "mingcute", "iconoir", "carbon",
    "fluent", "ic", "uil", "ri", "bi", "heroicons",
    "roentgen", "pinhead", "temaki", "game-icons",
]

# 词根 → 英文概念（从前面 design_prompts 抄过来）
ROOT_TO_EN = {
    "act": "action", "form": "shape", "dict": "speak", "port": "carry",
    "vis": "eye", "vid": "eye", "tract": "pull", "duc": "lead", "duct": "pipe",
    "mit": "send", "miss": "send", "pel": "push", "puls": "pulse", "put": "think",
    "spect": "watch", "ject": "throw", "junct": "link", "join": "link",
    "flu": "flow", "flux": "wave", "numer": "number", "numb": "number",
    "scrib": "write", "script": "writing", "clud": "lock", "clus": "lock",
    "claim": "shout", "clam": "megaphone", "fect": "make", "fact": "factory",
    "flex": "bend", "flect": "mirror", "grad": "stairs", "gress": "walk",
    "stru": "build", "struct": "structure", "fid": "trust",
    "tend": "stretch", "tens": "tension", "tent": "tent",
    "tain": "hand", "ten": "hand", "tin": "container",
    "tang": "touch", "tact": "touch", "tag": "label",
    "tax": "list", "vers": "rotate", "vert": "rotate",
    "cur": "run", "cours": "track", "ven": "arrive", "vent": "wind",
    "fin": "finish", "firm": "muscle", "fix": "hammer", "fract": "broken",
    "frag": "fragment", "fug": "flee", "fund": "foundation", "fus": "pour",
    "gen": "birth", "gest": "carry", "graph": "draw", "gram": "letter",
    "her": "magnet", "hes": "glue", "hum": "ground", "ign": "fire",
    "lab": "work", "lat": "carry", "lect": "read", "leg": "law",
    "lev": "lift", "liber": "free", "lic": "permit", "lig": "rope",
    "loc": "location", "log": "speech", "loqu": "talk", "luc": "light",
    "lumin": "lamp", "lun": "moon", "lustr": "shine", "magn": "large",
    "maj": "king", "max": "trophy", "mar": "ocean", "mat": "mother",
    "med": "medicine", "medic": "medicine", "memor": "memory", "member": "remember",
    "mend": "repair", "acu": "needle", "aer": "air", "agon": "fight",
    "agr": "farm", "alg": "pain", "ag": "drive", "am": "love",
    "anim": "soul", "ann": "calendar", "anthrop": "human", "aqua": "water",
    "arch": "crown", "art": "art", "aud": "ear", "bell": "war",
    "ben": "good", "bibl": "book", "bio": "biology", "brev": "short",
    "cad": "fall", "cas": "fall", "cap": "head", "cept": "catch",
    "ceive": "receive", "ced": "walk", "cess": "step", "celer": "fast",
    "cent": "hundred", "centr": "center", "cern": "filter", "cert": "certificate",
    "chrom": "color", "chron": "clock", "cide": "skull", "cis": "scissors",
    "cit": "summon", "civ": "city", "clar": "clear", "clin": "lean",
    "cogn": "knowledge", "cord": "heart", "corp": "body", "cosm": "galaxy",
    "cre": "grow", "cred": "trust", "crim": "crime", "cult": "farm",
    "cycl": "cycle", "dec": "ten", "dem": "people", "dent": "tooth",
    "derm": "skin", "dign": "honor", "doc": "teacher", "dol": "sad",
    "dom": "house", "don": "gift", "dorm": "sleep", "dox": "opinion",
    "dynam": "energy", "ego": "ego", "equ": "scale", "err": "error",
    "esth": "beauty", "ethn": "people", "fa": "fame", "fer": "carry",
    "fid": "loyal", "fil": "thread", "front": "front", "gam": "marriage",
    "geo": "earth", "germ": "seed", "gest": "pregnant", "glor": "glory",
    "gn": "knowledge", "grat": "thanks", "greg": "group", "hap": "luck",
    "hemi": "half", "homo": "same", "hydr": "water", "iatr": "doctor",
    "init": "start", "integr": "whole", "ir": "anger", "it": "walk",
    "jur": "oath", "just": "justice", "juven": "child", "lav": "wash",
    "linqu": "goodbye", "liter": "book", "long": "long", "man": "hand",
    "manu": "hand", "mater": "mother", "matr": "mother", "mech": "machine",
    "mens": "ruler", "merc": "shop", "merg": "dive", "meter": "ruler",
    "min": "small", "mir": "wonder", "mob": "vehicle", "mod": "fashion",
    "mon": "warning", "mor": "death", "mort": "death", "mot": "motor",
    "mut": "transform", "nasc": "baby", "nat": "baby", "naut": "ship",
    "nav": "boat", "neg": "no", "noc": "danger", "nom": "name",
    "nomin": "name", "norm": "ruler", "nounc": "megaphone", "nov": "new",
    "nul": "zero", "ocul": "eye", "od": "music", "onym": "name",
    "oper": "operator", "opt": "vote", "or": "mouth", "ord": "list",
    "ori": "sunrise", "orn": "decoration", "ortho": "straight", "pac": "peace",
    "part": "puzzle", "pass": "door", "pat": "father", "path": "feelings",
    "pater": "father", "patr": "father", "ped": "foot", "pend": "pendulum",
    "pens": "scale", "pet": "search", "phil": "love", "phob": "fear",
    "phon": "speaker", "phot": "camera", "phys": "body", "pict": "painting",
    "plac": "smile", "plant": "plant", "ple": "full", "plen": "full",
    "pli": "fold", "plic": "fold", "plod": "applause", "plor": "explore",
    "plur": "many", "ply": "layers", "pneum": "lungs", "pod": "foot",
    "polis": "city", "polit": "vote", "pon": "place", "pop": "crowd",
    "pos": "place", "poss": "muscle", "pot": "power", "pre": "grab",
    "prehend": "grab", "press": "press", "prim": "first", "priv": "private",
    "prob": "test", "prov": "checkmark", "psych": "brain", "pugn": "boxing",
    "punct": "point", "pung": "thorn", "pur": "clean", "quer": "question",
    "quest": "treasure", "quir": "detective", "quit": "exit", "rad": "ray",
    "ras": "eraser", "rat": "calculator", "ration": "scale", "reg": "king",
    "rect": "rectangle", "rid": "laugh", "rig": "ruler", "rip": "river",
    "riv": "stream", "rod": "rodent", "rog": "raise-hand", "rot": "wheel",
    "rud": "rock", "rupt": "broken", "sacr": "holy", "sal": "salt",
    "san": "healthy", "sanct": "church", "sat": "satisfied", "sci": "atom",
    "scop": "telescope", "sect": "scissors", "secut": "follow", "sed": "chair",
    "sens": "five-senses", "sent": "heart", "sequ": "sequence", "serv": "tray",
    "sess": "meeting", "sid": "chair", "sign": "signature", "simil": "similar",
    "sist": "stand", "soci": "friends", "sol": "sun", "solv": "untie",
    "solut": "untie", "somn": "sleep", "son": "sound", "soph": "owl",
    "spers": "scatter", "spir": "breath", "spond": "handshake", "spons": "pledge",
    "st": "pillar", "stat": "statue", "sting": "bee", "stinct": "lightbulb",
    "stitut": "constitution", "strict": "tight", "stud": "student", "sum": "sum",
    "sumpt": "take", "tac": "silence", "techn": "tools", "tele": "antenna",
    "temp": "hourglass", "tempor": "clock", "ter": "earth", "term": "stop",
    "terr": "land", "text": "fabric", "the": "temple", "therm": "thermometer",
    "ton": "music-note", "top": "map", "tort": "twist", "tox": "poison",
    "trib": "tribe", "trit": "rub", "trud": "intruder", "trus": "sword",
    "turb": "storm", "umbr": "umbrella", "und": "wave", "uni": "one",
    "urb": "city", "ut": "tool", "vac": "vacuum", "vad": "invade",
    "val": "muscle", "var": "variety", "veh": "car", "vell": "pluck",
    "vest": "clothes", "vi": "road", "vict": "trophy", "vince": "winner",
    "vit": "heart", "viv": "energy", "voc": "microphone", "vok": "shout",
    "vol": "star", "volv": "ball", "volut": "scroll", "vor": "eat",
    "vot": "ballot",
}


def iconify_search(q, limit=15):
    """搜 Iconify。"""
    url = f"https://api.iconify.design/search?query={urllib.parse.quote(q)}&limit={limit}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        return json.loads(urllib.request.urlopen(req, timeout=TIMEOUT).read()).get("icons", [])
    except Exception:
        return []


def pick_best_icon(icons):
    """从结果里挑首选：跳过 logo 类，按 PREFERRED_ORDER 排"""
    candidates = []
    for ic in icons:
        prefix = ic.split(":")[0]
        if prefix in SKIP_PREFIXES:
            continue
        # 跳过太具体的（地区/品牌名）
        name = ic.split(":", 1)[-1].lower()
        if "logo" in name or "brand" in name:
            continue
        try:
            rank = PREFERRED_ORDER.index(prefix)
        except ValueError:
            rank = len(PREFERRED_ORDER) + 1
        candidates.append((rank, ic))
    if not candidates:
        return None
    candidates.sort()
    return candidates[0][1]


def extract_en_keywords(meaning):
    """从中文释义里抽英文核心词。"""
    if not meaning:
        return []
    words = re.findall(r"\b[a-zA-Z]{4,}\b", meaning)
    stop = {"adj", "noun", "verb", "and", "the", "for", "from", "with", "that", "this",
            "have", "been", "such", "also", "into", "than", "wholly", "carefully",
            "result", "condition", "quality", "actually"}
    return [w.lower() for w in words if w.lower() not in stop][:3]


def get_root_concept(root_field):
    if not root_field:
        return None
    roots = re.split(r"[/\-,\s]+", root_field.lower())
    for r in [x.strip("-") for x in roots if x.strip("-")]:
        if r in ROOT_TO_EN:
            return ROOT_TO_EN[r]
    return None


def find_icon(word, meaning, root):
    """主流程：多 query 搜，选最佳。"""
    queries = [word]  # 1) 原词

    # 2) 释义里的英文核心
    for kw in extract_en_keywords(meaning):
        queries.append(kw)

    # 3) 词根概念
    root_kw = get_root_concept(root)
    if root_kw:
        queries.append(root_kw)
        queries.append(root_kw.replace("-", " "))

    # 4) 兜底通用
    queries.append("star")

    tried = set()
    for q in queries:
        if q in tried:
            continue
        tried.add(q)
        icons = iconify_search(q)
        best = pick_best_icon(icons)
        if best:
            return (best, q)
    return (None, "")


def download_svg(icon_name, dest):
    """下载 SVG。"""
    url = f"https://api.iconify.design/{icon_name}.svg"
    req = urllib.request.Request(url, headers=HEADERS)
    data = urllib.request.urlopen(req, timeout=TIMEOUT).read()
    # 检查是否是 SVG（Iconify 找不到时返回 404 或空 SVG）
    if len(data) < 100 or b"<svg" not in data:
        return 0
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def process_one(word, meaning, root):
    """处理一个词。"""
    try:
        icon, query = find_icon(word, meaning, root)
        if not icon:
            return (word, "no_icon", "", 0)
        dest_svg = os.path.join(MEDIA, f"{word}.svg")
        sz = download_svg(icon, dest_svg)
        if sz == 0:
            return (word, "bad_svg", icon, 0)
        # 同步到 Anki
        try:
            import shutil
            shutil.copy2(dest_svg, os.path.join(ANKI_MEDIA, f"{word}.svg"))
        except Exception:
            pass
        return (word, "ok", icon, sz)
    except Exception as e:
        return (word, f"err: {str(e)[:40]}", "", 0)


def main():
    data = json.load(open(DATA, encoding="utf-8"))
    cards = data["cards"]

    # 收集所有待处理词
    words_data = []
    for c in cards:
        w = c["单词"]
        words_data.append((w, c.get("单词含义", ""), c.get("词根", "")))

    print(f"总词数：{len(words_data)}")

    # 已存在 SVG 的跳过（中断恢复）
    todo = [(w, m, r) for w, m, r in words_data
            if not os.path.exists(os.path.join(MEDIA, f"{w}.svg"))]
    print(f"待处理：{len(todo)}")

    results = {}
    if os.path.exists(RESULT):
        results = json.load(open(RESULT, encoding="utf-8"))

    done = 0
    ok = 0
    failed = []
    start = time.time()

    def worker(t):
        time.sleep(PAUSE)
        return process_one(*t)

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, t): t[0] for t in todo}
        for fut in as_completed(futures):
            word, status, icon, sz = fut.result()
            done += 1
            results[word] = {"status": status, "icon": icon, "size": sz}
            if status == "ok":
                ok += 1
            else:
                failed.append({"word": word, "status": status})

            if done % 50 == 0:
                with cache_lock:
                    with open(RESULT, "w", encoding="utf-8") as f:
                        json.dump(results, f, ensure_ascii=False, indent=2)
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                eta = (len(todo) - done) / rate if rate else 0
                print(f"[{done:4}/{len(todo)}] ok={ok} fail={len(failed)} "
                      f"rate={rate:.1f}/min eta={eta:.0f}m")

    with open(RESULT, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

    elapsed = (time.time() - start) / 60
    print(f"\n=== 完成 ===")
    print(f"成功 {ok}/{len(todo)}")
    print(f"失败 {len(failed)}")
    print(f"耗时 {elapsed:.1f} min")
    if failed:
        print(f"失败示例：{failed[:10]}")


if __name__ == "__main__":
    main()
