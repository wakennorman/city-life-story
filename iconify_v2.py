#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""重做被退到 star/action-key 的词。
策略：
1. 用更聪明的 query：词根英文概念 + emoji 关键词
2. 移除 "star" 兜底
3. 优先 emoji 类（twemoji/noto/fluent-emoji-flat）
4. 实在搜不到 → 用词根级图标（同根都用一样的，至少相关）
"""
import urllib.request, urllib.parse, json, os, re, time, sys, io
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading
import shutil

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

MEDIA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
ANKI_MEDIA = r"C:\Users\陈恒稳\AppData\Roaming\Anki2\账户 1\collection.media"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
PREV = r"D:\Claude Code+DeepSeekV4\iconify_results.json"
NEW = r"D:\Claude Code+DeepSeekV4\iconify_results_v2.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 5
PAUSE = 0.3

SKIP_PREFIXES = {
    "token", "token-branded", "cryptocurrency", "cryptocurrency-color",
    "circle-flags", "flag", "flagpack", "twemoji-flag", "flag-icons",
    "logos", "simple-icons", "skill-icons", "devicon",
    "fa-brands", "brandico", "akar-icons-brands",
}

# 跳过的"差"图标名字
SKIP_ICON_NAMES = {"star", "action-key", "circle", "dot", "square", "rectangle",
                   "loyalty", "coffee-maker"}

# 优先：emoji 套件最前，UI 图标其次
PREFERRED_ORDER = [
    "twemoji", "noto", "noto-v1", "fluent-emoji-flat", "fluent-emoji",
    "openmoji", "streamline-emojis", "emojione",
    "game-icons", "roentkin", "pinhead", "temaki",
    "material-symbols", "mdi", "material-symbols-light",
    "solar", "tabler", "lucide", "ph", "mingcute", "iconoir", "carbon",
    "fluent", "ic", "uil", "ri", "bi", "heroicons",
]


# 词根 → 多个英文备用搜索词（避免单一概念太窄）
ROOT_QUERIES = {
    "act": ["running-person", "fist", "do"],
    "form": ["shape", "geometry"],
    "dict": ["speak", "megaphone", "speech-bubble"],
    "port": ["luggage", "suitcase", "carry"],
    "vis": ["eye", "magnifying-glass"],
    "vid": ["eye", "video"],
    "tract": ["tractor", "pull"],
    "duc": ["leader", "guide"],
    "duct": ["pipe", "tube"],
    "mit": ["envelope", "send"],
    "miss": ["rocket", "launch"],
    "pel": ["push", "arrow-right"],
    "puls": ["pulse", "heart-rate"],
    "put": ["thought", "thinking"],
    "spect": ["eye", "magnifying-glass"],
    "ject": ["throw", "baseball"],
    "junct": ["link", "chain"],
    "join": ["link", "chain"],
    "flu": ["water", "drop"],
    "flux": ["wave", "tide"],
    "numer": ["abacus", "number"],
    "numb": ["abacus", "calculator"],
    "scrib": ["pen", "writing"],
    "script": ["scroll", "document"],
    "clud": ["lock", "door-closed"],
    "clus": ["lock", "padlock"],
    "claim": ["megaphone", "shout"],
    "clam": ["megaphone", "voice"],
    "fect": ["factory", "make"],
    "fact": ["factory", "industry"],
    "flex": ["bend", "muscle"],
    "flect": ["mirror", "reflection"],
    "grad": ["stairs", "steps"],
    "gress": ["walking", "foot"],
    "stru": ["construction", "build"],
    "struct": ["building", "blueprint"],
    "fid": ["handshake", "trust"],
    "tend": ["stretch", "rubber-band"],
    "tens": ["tension", "rope"],
    "tent": ["tent", "camping"],
    "tain": ["hand-holding", "grip"],
    "ten": ["hand", "grip"],
    "tin": ["container", "can"],
    "tang": ["touch", "finger"],
    "tact": ["touch", "finger"],
    "tag": ["label", "tag"],
    "tax": ["list", "order"],
    "vers": ["rotate", "swap-vertical"],
    "vert": ["rotate", "swap-horizontal"],
    "cur": ["running", "marathon"],
    "cours": ["running-track", "course"],
    "ven": ["arrival", "door"],
    "vent": ["wind", "fan"],
    "fin": ["finish-line", "checkered-flag"],
    "firm": ["muscle", "strong"],
    "fix": ["hammer", "screwdriver"],
    "fract": ["broken", "crack"],
    "frag": ["fragment", "puzzle-piece"],
    "fug": ["running-away", "fugitive"],
    "fund": ["foundation", "money"],
    "fus": ["pour", "liquid"],
    "gen": ["seedling", "birth"],
    "gest": ["carry", "load"],
    "graph": ["pencil", "drawing"],
    "gram": ["envelope", "letter"],
    "her": ["magnet", "stick"],
    "hes": ["glue", "tape"],
    "hum": ["soil", "ground"],
    "ign": ["fire", "flame"],
    "lab": ["worker", "tools"],
    "lat": ["carry-backpack", "porter"],
    "lect": ["book", "read"],
    "leg": ["scale", "law"],
    "lev": ["elevator", "lift"],
    "liber": ["bird-cage-open", "free"],
    "lic": ["check-mark", "approved"],
    "lig": ["rope", "knot"],
    "loc": ["pin", "location"],
    "log": ["book", "logbook"],
    "loqu": ["chat", "talk"],
    "luc": ["light-bulb", "lamp"],
    "lumin": ["lamp", "light"],
    "lun": ["moon", "crescent"],
    "lustr": ["shine", "diamond"],
    "magn": ["large", "giant"],
    "maj": ["crown", "king"],
    "max": ["trophy", "first-place"],
    "mar": ["wave", "ocean"],
    "mat": ["mother", "baby"],
    "med": ["doctor", "stethoscope"],
    "medic": ["medicine", "pill"],
    "memor": ["brain", "memory"],
    "member": ["people-group", "remember"],
    "mend": ["repair", "wrench"],
    "acu": ["needle", "syringe"],
    "aer": ["airplane", "air"],
    "agon": ["fight", "struggle"],
    "agr": ["tractor", "farm"],
    "alg": ["pain", "hurt"],
    "ag": ["car", "drive"],
    "am": ["heart", "love"],
    "anim": ["soul", "spark"],
    "ann": ["calendar", "year"],
    "anthrop": ["person", "human"],
    "aqua": ["water-drop", "wave"],
    "arch": ["crown", "ancient"],
    "art": ["palette", "brush"],
    "aud": ["ear", "hearing"],
    "bell": ["sword", "war"],
    "ben": ["thumbs-up", "good"],
    "bibl": ["book", "library"],
    "bio": ["dna", "biology"],
    "brev": ["short", "pencil-stub"],
    "cad": ["falling", "leaf"],
    "cas": ["waterfall", "cascade"],
    "cap": ["hand-grab", "head"],
    "cept": ["catch", "glove"],
    "ceive": ["receive", "hands"],
    "ced": ["walking", "steps"],
    "cess": ["walking", "footsteps"],
    "celer": ["speedometer", "fast"],
    "cent": ["hundred", "one-hundred"],
    "centr": ["target", "bullseye"],
    "cern": ["filter", "sieve"],
    "cert": ["certificate", "stamp"],
    "chrom": ["color", "palette"],
    "chron": ["clock", "time"],
    "cide": ["skull", "danger"],
    "cis": ["scissors", "cut"],
    "cit": ["call", "summon"],
    "civ": ["city", "buildings"],
    "clar": ["clear", "transparent"],
    "clin": ["tilt", "lean"],
    "cogn": ["brain", "lightbulb"],
    "cord": ["heart"],
    "corp": ["body", "person"],
    "cosm": ["galaxy", "stars"],
    "cre": ["seedling", "grow"],
    "cred": ["trust", "handshake"],
    "crim": ["handcuffs", "crime"],
    "cult": ["farmer", "plant"],
    "cycl": ["cycle", "wheel"],
    "dec": ["ten", "10"],
    "dem": ["people", "crowd"],
    "dent": ["tooth", "teeth"],
    "derm": ["skin", "hand-skin"],
    "dign": ["medal", "honor"],
    "doc": ["teacher", "blackboard"],
    "dol": ["sad", "crying"],
    "dom": ["house", "home"],
    "don": ["gift", "present"],
    "dorm": ["sleep", "bed"],
    "dox": ["thought", "opinion"],
    "dynam": ["lightning", "energy"],
    "ego": ["mirror", "self"],
    "equ": ["balance-scale", "equal"],
    "err": ["x-mark", "wrong"],
    "esth": ["flower", "beauty"],
    "ethn": ["globe", "people"],
    "fa": ["star", "fame"],
    "fer": ["porter", "carry"],
    "fil": ["thread", "spool"],
    "front": ["face-front", "front"],
    "gam": ["wedding-rings", "marriage"],
    "geo": ["earth-globe", "globe"],
    "germ": ["sprout", "seed"],
    "glor": ["trophy", "shine"],
    "gn": ["light-bulb", "idea"],
    "grat": ["thank-you", "heart"],
    "greg": ["sheep", "flock"],
    "hap": ["four-leaf-clover", "luck"],
    "hemi": ["half-moon", "half"],
    "homo": ["same", "equal"],
    "hydr": ["water-drop", "faucet"],
    "iatr": ["doctor", "stethoscope"],
    "init": ["start", "play"],
    "integr": ["circle", "whole"],
    "ir": ["angry", "rage"],
    "it": ["walking", "footsteps"],
    "jur": ["hand-raised", "oath"],
    "just": ["balance-scale", "justice"],
    "juven": ["child", "young"],
    "lav": ["soap", "wash"],
    "linqu": ["waving-goodbye", "leave"],
    "liter": ["letter", "alphabet"],
    "long": ["long-ruler", "long"],
    "man": ["hand", "open-hand"],
    "manu": ["hand-writing", "hand"],
    "mater": ["mother-baby", "mother"],
    "matr": ["elderly-woman", "matriarch"],
    "mech": ["gear", "mechanism"],
    "mens": ["ruler", "measuring-tape"],
    "merc": ["shop", "market"],
    "merg": ["dive", "swim"],
    "meter": ["ruler", "measure"],
    "min": ["mouse", "small"],
    "mir": ["amazed-face", "wow"],
    "mob": ["car", "vehicle"],
    "mod": ["fashion", "model"],
    "mon": ["warning", "alert"],
    "mor": ["grave", "tombstone"],
    "mort": ["skull", "death"],
    "mot": ["motor", "engine"],
    "mut": ["transform", "change"],
    "nasc": ["baby", "newborn"],
    "nat": ["baby", "born"],
    "naut": ["sailor", "ship"],
    "nav": ["boat", "anchor"],
    "neg": ["x-mark", "no-entry"],
    "noc": ["warning", "danger"],
    "nom": ["name-tag", "label"],
    "nomin": ["nameplate", "tag"],
    "norm": ["ruler", "standard"],
    "nounc": ["megaphone", "announce"],
    "nov": ["sparkles", "new"],
    "nul": ["zero", "empty"],
    "ocul": ["eye", "eyeball"],
    "od": ["music-note", "song"],
    "onym": ["signature", "name"],
    "oper": ["operator", "machinist"],
    "opt": ["check-mark", "choice"],
    "or": ["mouth", "lips"],
    "ord": ["list", "order"],
    "ori": ["sunrise", "rise"],
    "orn": ["ornament", "decoration"],
    "ortho": ["straight-ruler", "correct"],
    "pac": ["peace-dove", "peace"],
    "part": ["puzzle-piece", "fragment"],
    "pass": ["doorway", "pass"],
    "pat": ["father", "patient"],
    "path": ["sad-heart", "feeling"],
    "pater": ["father-child", "father"],
    "patr": ["father-figure", "patriarch"],
    "ped": ["foot", "footprint"],
    "pend": ["pendulum", "hanging"],
    "pens": ["scale-weighing", "weigh"],
    "pet": ["magnifying-glass", "search"],
    "phil": ["heart", "love"],
    "phob": ["scared", "fear"],
    "phon": ["speaker", "phone"],
    "phot": ["camera", "flash"],
    "phys": ["muscle", "body"],
    "pict": ["painting", "easel"],
    "plac": ["smile", "happy"],
    "plant": ["plant", "leaf"],
    "ple": ["full-glass", "full"],
    "plen": ["overflow", "abundance"],
    "pli": ["folded-paper", "fold"],
    "plic": ["fan", "fold"],
    "plod": ["clapping", "applause"],
    "plor": ["map", "explore"],
    "plur": ["pile", "many"],
    "ply": ["layers", "stack"],
    "pneum": ["lungs", "breath"],
    "pod": ["foot", "footprint"],
    "polis": ["city", "skyline"],
    "polit": ["voting", "ballot"],
    "pon": ["place", "block"],
    "pop": ["crowd", "people"],
    "pos": ["placement", "position"],
    "poss": ["muscle-arm", "able"],
    "pot": ["fist", "power"],
    "pre": ["grabbing-hand", "seize"],
    "prehend": ["gripping-hand", "grasp"],
    "press": ["button-press", "press"],
    "prim": ["first-place", "no-1"],
    "priv": ["lock", "private"],
    "prob": ["test-tube", "experiment"],
    "prov": ["check-mark", "verified"],
    "psych": ["brain", "mind"],
    "pugn": ["boxing-glove", "fight"],
    "punct": ["pin", "point"],
    "pung": ["thorn", "sharp"],
    "pur": ["clean", "sparkle"],
    "quer": ["question-mark", "ask"],
    "quest": ["treasure-chest", "search"],
    "quir": ["detective", "search"],
    "quit": ["exit-door", "leave"],
    "rad": ["sun-rays", "ray"],
    "ras": ["eraser", "erase"],
    "rat": ["calculator", "math"],
    "ration": ["scale", "reason"],
    "reg": ["king", "crown"],
    "rect": ["rectangle", "straight"],
    "rid": ["laughing-face", "laugh"],
    "rig": ["straight-ruler", "right"],
    "rip": ["river", "stream"],
    "riv": ["river", "stream"],
    "rod": ["mouse-animal", "rodent"],
    "rog": ["raised-hand", "ask"],
    "rot": ["wheel", "rotate"],
    "rud": ["rock", "stone"],
    "rupt": ["broken", "crack"],
    "sacr": ["halo", "holy"],
    "sal": ["salt-shaker", "leap"],
    "san": ["healthy-heart", "healthy"],
    "sanct": ["church", "holy"],
    "sat": ["satisfied", "full"],
    "sci": ["atom", "science"],
    "scop": ["telescope", "view"],
    "sect": ["scissors", "cut"],
    "secut": ["footprints", "follow"],
    "sed": ["chair", "sit"],
    "sens": ["sensing-hand", "feel"],
    "sent": ["heart-feeling", "emotion"],
    "sequ": ["arrows-sequence", "order"],
    "serv": ["tray-server", "serve"],
    "sess": ["meeting", "session"],
    "sid": ["sitting-person", "sit"],
    "sign": ["signature", "pen-signature"],
    "simil": ["copy", "similar"],
    "sist": ["standing-person", "stand"],
    "soci": ["group-people", "friends"],
    "sol": ["sun", "solo"],
    "solv": ["untie", "loosen"],
    "solut": ["untie", "release"],
    "somn": ["sleeping", "zzz"],
    "son": ["sound-wave", "speaker"],
    "soph": ["owl", "wise"],
    "spers": ["scatter", "leaves"],
    "spir": ["lungs", "breath"],
    "spond": ["handshake", "promise"],
    "spons": ["handshake", "pledge"],
    "st": ["standing", "pillar"],
    "stat": ["statue", "still"],
    "sting": ["bee", "sting"],
    "stinct": ["bee", "lightbulb"],
    "stitut": ["constitution", "document"],
    "strict": ["tight-rope", "tight"],
    "stud": ["student", "books"],
    "sum": ["calculator-sum", "total"],
    "sumpt": ["hand-take", "take"],
    "tac": ["silence", "shush"],
    "techn": ["tools", "wrench"],
    "tele": ["antenna", "satellite"],
    "temp": ["hourglass", "time"],
    "tempor": ["clock", "watch"],
    "ter": ["earth-globe", "land"],
    "term": ["stop-sign", "end"],
    "terr": ["land", "map"],
    "text": ["fabric", "cloth"],
    "the": ["temple", "church"],
    "therm": ["thermometer", "fire"],
    "ton": ["music-note", "sound"],
    "top": ["map", "topography"],
    "tort": ["twisted", "knot"],
    "tox": ["poison-bottle", "skull"],
    "trib": ["tribe", "family"],
    "trit": ["sandpaper", "rub"],
    "trud": ["intruder", "break-in"],
    "trus": ["sword", "thrust"],
    "turb": ["storm", "tornado"],
    "umbr": ["umbrella", "parasol"],
    "und": ["wave", "ocean"],
    "uni": ["one", "no-1"],
    "urb": ["city", "buildings"],
    "ut": ["tool", "wrench"],
    "vac": ["vacuum", "empty"],
    "vad": ["invasion", "soldier"],
    "val": ["muscle-strong", "valuable"],
    "var": ["different-colors", "variety"],
    "veh": ["car", "vehicle"],
    "vell": ["pluck", "flower-pick"],
    "vest": ["clothes", "wardrobe"],
    "vi": ["road", "path"],
    "vict": ["trophy", "victory"],
    "vince": ["winning-fist", "winner"],
    "vit": ["heart-pulse", "vital"],
    "viv": ["energy", "lively"],
    "voc": ["microphone", "voice"],
    "vok": ["megaphone", "call"],
    "vol": ["star-wish", "wish"],
    "volv": ["rolling-ball", "roll"],
    "volut": ["scroll", "rolled"],
    "vor": ["eating", "bite"],
    "vot": ["ballot-box", "vote"],
    "ced": ["walking", "yield"],
    "cret": ["growing", "create"],
    "cli": ["lean", "tilt"],
    "clin": ["tilt", "incline"],
    "crat": ["king", "ruler"],
    "crit": ["judging", "critic"],
    "fond": ["heart", "fond"],
    "force": ["strong-arm", "force"],
    "fract": ["broken-glass", "fracture"],
    "fract": ["broken", "fracture"],
    "fract": ["broken", "shatter"],
    "merg": ["dive", "merge"],
    "mort": ["skull", "death"],
    "nat": ["baby", "newborn"],
    "nounc": ["megaphone", "announce"],
    "phon": ["phone", "speaker"],
    "press": ["press-down", "press"],
    "vers": ["spin", "rotate"],
    "vert": ["spin", "swap-vertical"],
    "vit": ["heart-pulse", "vital"],
    "voc": ["microphone", "voice"],
    "vol": ["wish-star", "wish"],
    "volv": ["ball-roll", "roll"],
    "volut": ["scroll-rolled", "scroll"],
    "vor": ["mouth-bite", "eat"],
    "vot": ["ballot", "vote"],
}

# Anki 接受的 emoji 设置（避免 ASCII 字符不显示）
EMOJI_FALLBACK_BY_ROOT = {
    # 词根 → emoji 词（必能在 twemoji 找到）
    "act": "🏃", "form": "▰", "dict": "🗣️", "port": "🛄",
    # 用 emoji unicode 名搜更好命中
}


def iconify_search(q, limit=15):
    url = f"https://api.iconify.design/search?query={urllib.parse.quote(q)}&limit={limit}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        return json.loads(urllib.request.urlopen(req, timeout=10).read()).get("icons", [])
    except Exception:
        return []


def pick_best_icon(icons):
    candidates = []
    for ic in icons:
        if ":" not in ic:
            continue
        prefix, name = ic.split(":", 1)
        name_low = name.lower()
        if prefix in SKIP_PREFIXES:
            continue
        if "logo" in name_low or "brand" in name_low:
            continue
        if name_low in SKIP_ICON_NAMES:
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
    if not meaning:
        return []
    # 抽英文连续词，跳常见 stop 和词性缩写
    words = re.findall(r"\b[a-zA-Z]{4,}\b", meaning)
    stop = {"adj", "noun", "verb", "and", "the", "for", "from", "with", "that", "this",
            "have", "been", "such", "also", "into", "than", "wholly", "carefully",
            "result", "condition", "quality", "actually", "concept", "result"}
    return [w.lower() for w in words if w.lower() not in stop][:3]


def get_root_queries(root_field):
    if not root_field:
        return []
    roots = re.split(r"[/\-,\s]+", root_field.lower())
    for r in [x.strip("-") for x in roots if x.strip("-")]:
        if r in ROOT_QUERIES:
            return ROOT_QUERIES[r]
    return []


def find_icon_v2(word, meaning, root):
    """优先策略：先词根概念（更稳定）→ 再原词 → 再 meaning 关键词"""
    queries = []

    # 1) 词根概念 query（多个备选）
    for rq in get_root_queries(root):
        queries.append(rq)

    # 2) 原词（次优）
    queries.append(word)

    # 3) meaning 关键词
    for kw in extract_en_keywords(meaning):
        queries.append(kw)

    tried = set()
    for q in queries:
        if q.lower() in tried:
            continue
        tried.add(q.lower())
        icons = iconify_search(q)
        best = pick_best_icon(icons)
        if best:
            return (best, q)
    return (None, "")


def download_svg(icon, dest):
    url = f"https://api.iconify.design/{icon}.svg"
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        data = urllib.request.urlopen(req, timeout=10).read()
        if len(data) < 100 or b"<svg" not in data:
            return 0
        with open(dest, "wb") as f:
            f.write(data)
        return len(data)
    except Exception:
        return 0


def process(word, meaning, root):
    try:
        icon, q = find_icon_v2(word, meaning, root)
        if not icon:
            return (word, "no_icon", "", "", 0)
        dest = os.path.join(MEDIA, f"{word}.svg")
        sz = download_svg(icon, dest)
        if sz == 0:
            return (word, "bad_svg", icon, q, 0)
        try:
            shutil.copy2(dest, os.path.join(ANKI_MEDIA, f"{word}.svg"))
        except Exception:
            pass
        return (word, "ok", icon, q, sz)
    except Exception as e:
        return (word, f"err: {str(e)[:40]}", "", "", 0)


def main():
    # 加载现有结果，找出差图（star/action-key/repeated）
    prev = json.load(open(PREV, encoding="utf-8"))
    data = json.load(open(DATA, encoding="utf-8"))
    cards = {c["单词"].lower(): c for c in data["cards"]}

    # 重做的目标：
    # 1) 已记的 19 个失败
    # 2) 选了 material-symbols:star（405个）
    # 3) 选了 material-symbols:action-key（8个，被滥用）
    # 4) 任何被前 30 个最常用图标霸占的（>=8 次重复使用的）
    from collections import Counter
    icon_cnt = Counter(v.get("icon", "") for v in prev.values() if v["status"] == "ok")
    over_used = {ic for ic, c in icon_cnt.items() if c >= 8}
    print(f"过度重用图标：{len(over_used)} 个")

    targets = []
    for w, v in prev.items():
        if v["status"] != "ok":
            targets.append(w)
            continue
        icon = v.get("icon", "")
        if icon in over_used:
            targets.append(w)
            continue
        name = icon.split(":")[-1] if ":" in icon else ""
        if name in SKIP_ICON_NAMES:
            targets.append(w)

    print(f"待重做：{len(targets)}")

    new_results = dict(prev)
    done = 0
    improved = 0
    failed = []
    start = time.time()

    def worker(w):
        time.sleep(PAUSE)
        c = cards.get(w.lower(), {})
        return process(w, c.get("单词含义", ""), c.get("词根", ""))

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, w): w for w in targets}
        for fut in as_completed(futures):
            word, status, icon, q, sz = fut.result()
            done += 1
            if status == "ok":
                # 检查新图是否比旧好（不是 SKIP_ICON_NAMES）
                new_results[word] = {"status": "ok", "icon": icon, "query": q, "size": sz}
                improved += 1
            else:
                failed.append({"word": word, "status": status})

            if done % 50 == 0:
                with cache_lock:
                    with open(NEW, "w", encoding="utf-8") as f:
                        json.dump(new_results, f, ensure_ascii=False, indent=2)
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                eta = (len(targets) - done) / rate if rate else 0
                print(f"[{done}/{len(targets)}] 改善 {improved} 失败 {len(failed)} "
                      f"rate={rate:.0f}/min eta={eta:.0f}m")

    with open(NEW, "w", encoding="utf-8") as f:
        json.dump(new_results, f, ensure_ascii=False, indent=2)

    print(f"\n=== 完成 ===")
    print(f"改善：{improved} / {len(targets)}")
    print(f"耗时：{(time.time()-start)/60:.1f} min")


cache_lock = threading.Lock()
if __name__ == "__main__":
    main()
