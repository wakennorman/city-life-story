#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""v3：只针对 385 个仍 = star 的词，扩 ROOT_QUERIES 覆盖 part3 词根。"""
import urllib.request, urllib.parse, json, os, re, time, sys, io, shutil
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

MEDIA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
ANKI_MEDIA = r"C:\Users\陈恒稳\AppData\Roaming\Anki2\账户 1\collection.media"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
PREV = r"D:\Claude Code+DeepSeekV4\iconify_results_v2.json"
NEW = r"D:\Claude Code+DeepSeekV4\iconify_results_v3.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 4
PAUSE = 0.4
cache_lock = threading.Lock()

SKIP_PREFIXES = {"token", "token-branded", "cryptocurrency", "cryptocurrency-color",
                 "circle-flags", "flag", "flagpack", "twemoji-flag", "flag-icons",
                 "logos", "simple-icons", "skill-icons", "devicon", "arcticons",
                 "fa-brands", "brandico"}
SKIP_NAMES = {"star", "circle", "dot", "square", "rectangle", "action-key",
              "loyalty", "coffee-maker", "subway-walk", "leaderboard", "honor-of-kings-fill",
              "select-to-speak", "align-items-stretch", "shape-line", "ten-oclock",
              "muscle-fat", "ignition", "calendar-pen", "format-quote",
              "send", "error", "link"}

PREFERRED = [
    "twemoji", "noto", "noto-v1", "fluent-emoji-flat", "fluent-emoji",
    "openmoji", "streamline-emojis", "emojione", "game-icons",
    "mdi", "material-symbols", "solar", "tabler", "lucide", "ph",
    "mingcute", "iconoir", "carbon", "fluent", "ic", "uil", "ri",
    "bi", "heroicons", "healthicons", "roentgen", "pinhead", "temaki",
]

# part3 词根 → 英文搜索词（专补 v2 没覆盖的 abstract Latin/Greek）
ROOT_PART3 = {
    # 已知 stuck 词根，挨个查 part3 文件得来
    "foli": ["leaf", "foliage"],
    "gam": ["marriage", "wedding"],
    "damn": ["judge", "gavel"], "demn": ["judge", "gavel"],
    "glut": ["glue", "swallow"], "glutin": ["glue", "sticky"],
    "gorg": ["throat", "neck"], "gurg": ["whirlpool", "swirl"],
    "gastr": ["stomach", "belly"],
    "horr": ["scream", "horror"],
    "culp": ["guilty", "blame"],
    "dur": ["endurance", "hourglass"],
    "em": ["shopping-bag", "buy"], "empt": ["shopping", "purchase"],
    "ferv": ["fire", "boiling"],
    "fibr": ["thread", "fiber"],
    "friger": ["snowflake", "cold"], "frigid": ["snowflake", "ice"],
    "heli": ["sun", "sunshine"],
    "idi": ["fingerprint", "unique"],
    "later": ["side-view", "lateral"],
    "andr": ["man", "male"],
    "anth": ["flower", "blossom"],
    "arbor": ["tree", "evergreen"],
    "syn": ["link", "synergy"], "synerg": ["link", "merge"],
    "facil": ["smile", "easy"], "fac": ["face", "smile"],
    "fort": ["castle", "fortress"],
    "gn": ["lightbulb", "knowledge"], "gnos": ["knowledge", "wisdom"],
    "insul": ["island"],
    "jud": ["judge", "gavel"], "judic": ["scales", "justice"],
    "jug": ["yoke", "join"], "junct": ["link", "join"],
    "lingu": ["tongue", "language"],
    "labor": ["worker", "tools"],
    "lat": ["carry", "side"],
    "lud": ["laughing", "joke"], "lus": ["play", "fun"],
    "merc": ["shop", "market"], "merchand": ["shopping-cart", "store"],
    "migr": ["airplane", "migration"],
    "fla": ["wind", "breeze"], "flat": ["pancake", "flat"],
    "flu": ["water-drop", "river"], "flect": ["mirror", "reflect"],
    "fond": ["heart", "kiss"], "found": ["foundation", "house"],
    "for": ["door", "outside"], "forc": ["arm-flex", "force"],
    "frig": ["snowflake", "cold"], "frigus": ["ice", "snow"],
    "front": ["face-front", "front"],
    "fund": ["foundation", "money"],
    "germ": ["sprout", "seed"],
    "gest": ["pregnant", "carry"],
    "grav": ["heavy", "weight"], "griev": ["sad", "mourn"],
    "gnos": ["brain", "wisdom"],
    "gust": ["taste", "fork"],
    "hab": ["house", "dwelling"], "habit": ["house", "home"],
    "hal": ["breath", "exhale"], "halat": ["breath", "lung"],
    "hered": ["family-tree", "inheritance"], "herit": ["inheritance", "legacy"],
    "host": ["sword", "fight"], "hosp": ["hotel", "welcome"],
    "ign": ["fire", "flame"], "ignit": ["match-fire", "ignite"],
    "init": ["start", "play"],
    "insul": ["island"],
    "jac": ["throw", "ball"], "jec": ["throw"],
    "joc": ["laughing", "joke"],
    "labil": ["sliding", "slip"], "laps": ["slip", "fall"],
    "lat": ["wide", "side"],
    "lev": ["lift", "feather"],
    "loc": ["pin-location"],
    "long": ["long-ruler"],
    "luc": ["lightbulb", "lamp"],
    "lus": ["sparkle", "shine"],
    "main": ["hand"],
    "mal": ["sad", "bad"],
    "mand": ["command", "order"], "mans": ["house", "mansion"],
    "meditat": ["meditation", "yoga"], "mens": ["measure", "ruler"],
    "merc": ["money", "trade"],
    "merg": ["dive", "swimmer"], "mers": ["swim", "dive"],
    "metr": ["ruler", "measure"],
    "migr": ["bird-migration", "move"],
    "milit": ["soldier", "army"],
    "min": ["mouse", "small"],
    "mir": ["amazed", "wow"],
    "miser": ["sad", "poor"],
    "mit": ["envelope"], "mitt": ["send"],
    "mod": ["model", "fashion"],
    "moll": ["soft"], "mole": ["mountain"],
    "mor": ["custom", "tradition"], "mort": ["skull"],
    "morb": ["sick", "ill"],
    "mov": ["motion", "running"],
    "mun": ["city", "community"],
    "nat": ["baby"],
    "naut": ["sailor"],
    "neg": ["x-mark", "no"],
    "negro": ["dark"], "nigr": ["black"],
    "noct": ["moon", "night"], "noc": ["moon", "darkness"],
    "norm": ["ruler"],
    "not": ["pencil", "note"],
    "noun": ["megaphone"],
    "nov": ["new", "sparkles"],
    "nud": ["bare"],
    "nul": ["empty", "zero"],
    "nutr": ["food", "nourish"], "nutri": ["fruit", "vegetable"],
    "ocul": ["eye"],
    "od": ["song"], "odi": ["hate"],
    "oner": ["weight", "burden"],
    "opt": ["choice", "vote"],
    "opt": ["eye"],
    "or": ["mouth"],
    "ord": ["list", "order"],
    "ori": ["sunrise"],
    "ortho": ["straight"],
    "ov": ["egg"],
    "pac": ["dove", "peace"],
    "palat": ["mouth"],
    "palp": ["touch", "finger"],
    "par": ["equal"],
    "parl": ["talk"],
    "past": ["food", "feeding"],
    "pat": ["father"], "path": ["heart", "feeling"],
    "ped": ["foot"], "pedi": ["children"],
    "pell": ["push", "skin"],
    "pen": ["pencil"],
    "pend": ["pendulum"],
    "pen": ["punishment"], "penit": ["jail", "regret"],
    "per": ["through"],
    "peri": ["test", "danger"],
    "perit": ["expert"],
    "perm": ["lasting"],
    "pet": ["search"],
    "pet": ["request"],
    "phag": ["eating", "bite"],
    "pharm": ["pill", "medicine"],
    "phil": ["heart"],
    "phon": ["phone"], "phren": ["brain"],
    "pict": ["picture", "painting"],
    "pir": ["fire"],
    "piscat": ["fish"], "pisc": ["fish"],
    "plac": ["smile"],
    "plant": ["plant"],
    "plat": ["flat", "plate"],
    "plaud": ["clap"], "plaus": ["applause"],
    "ple": ["full", "fill"], "plen": ["overflow"], "plet": ["full"], "pli": ["fold"], "plic": ["fold"],
    "plumb": ["weight"],
    "plus": ["plus-sign"],
    "polit": ["voting"], "polis": ["city"],
    "popul": ["crowd"],
    "potent": ["fist"],
    "press": ["press"],
    "preci": ["price", "money"],
    "pris": ["jail"],
    "priv": ["lock"],
    "prob": ["test-tube"],
    "prol": ["talk"], "prole": ["family"],
    "propri": ["owner"],
    "pros": ["chair"],
    "prox": ["arrow-close"],
    "pug": ["boxing"], "pugn": ["fist-fight"],
    "punct": ["point"], "pung": ["thorn"],
    "puns": ["punish"],
    "pur": ["clean"], "purg": ["cleaning"],
    "putr": ["rotten"], "pus": ["pus"],
    "quadr": ["four", "square"],
    "qui": ["calm"], "quies": ["sleep"], "quiet": ["calm"],
    "rad": ["sun-ray", "root"],
    "rap": ["grab"], "rapt": ["seize"],
    "rar": ["rare"],
    "ras": ["eraser"], "rad": ["scrape"],
    "rect": ["straight"],
    "ren": ["kidney"],
    "rod": ["mouse"], "ros": ["eat"],
    "rog": ["raised-hand", "ask"],
    "rud": ["rough", "rock"],
    "rupt": ["broken", "crack"],
    "sacr": ["halo"], "sanct": ["church"],
    "sal": ["salt", "leap"], "sali": ["leap"],
    "salv": ["save", "rescue"],
    "san": ["healthy"],
    "sap": ["sap", "wise"], "sav": ["wise"],
    "sat": ["full-belly"], "satur": ["soaked"],
    "scand": ["climbing"], "scens": ["stairs-up"],
    "schol": ["school"],
    "schiz": ["broken", "split"],
    "sci": ["atom"], "scia": ["shadow"],
    "scind": ["cut"], "sciss": ["scissors"],
    "scop": ["telescope"],
    "scrib": ["pen", "write"],
    "sect": ["scissors"], "seg": ["cut"],
    "secut": ["follow"],
    "sed": ["chair"], "sid": ["chair"], "sess": ["meeting"],
    "sed": ["calm"],
    "sect": ["cut"],
    "sembl": ["resemble"],
    "semin": ["seed"],
    "sen": ["old", "elder"],
    "sens": ["nose"], "sent": ["heart"],
    "sequ": ["follow"], "secut": ["track"],
    "ser": ["chain", "link"],
    "serv": ["servant"], "servi": ["chain", "slave"],
    "sever": ["serious"],
    "sex": ["six"],
    "sic": ["dry"],
    "sider": ["star"], "sidere": ["star", "constellation"],
    "sign": ["sign"],
    "silv": ["forest"],
    "simil": ["copy", "twins"],
    "simul": ["mask"],
    "sing": ["solo"], "singul": ["one"],
    "sinist": ["left"], "sinistr": ["left-hand"],
    "sinu": ["wave", "curve"],
    "sist": ["standing"],
    "soci": ["friends"],
    "sol": ["sun"], "solar": ["sun"],
    "soli": ["alone"], "solo": ["alone"],
    "sol": ["custom"],
    "solv": ["loosen"], "solut": ["loosen"],
    "somn": ["sleep"],
    "son": ["sound-wave"],
    "soph": ["owl"],
    "sopor": ["sleep"],
    "spec": ["watch"], "spic": ["look"], "spect": ["eye"],
    "sper": ["seed"],
    "sphere": ["sphere"], "spher": ["globe"],
    "spir": ["lung"], "spirat": ["breath"],
    "splend": ["shine", "sparkle"],
    "spond": ["handshake"], "spons": ["pledge"],
    "spons": ["sponsor"],
    "stab": ["balance", "stable"],
    "stagn": ["pond"],
    "stell": ["star"],
    "sten": ["narrow"],
    "stat": ["statue"], "stit": ["constitution"], "stat": ["status"],
    "stell": ["star"],
    "ster": ["solid"], "stere": ["solid", "3d"],
    "stetho": ["chest"],
    "stilus": ["pen"], "styl": ["pen"],
    "sting": ["bee"], "stinct": ["bee"], "stict": ["pressed"],
    "stol": ["robe", "uniform"],
    "stom": ["mouth"],
    "stop": ["stop-sign"],
    "stra": ["road"], "strat": ["layer"],
    "stren": ["strong"], "strenu": ["energy"],
    "strict": ["tight"], "string": ["chord"],
    "stru": ["construction"], "struct": ["building"],
    "stud": ["student"],
    "stup": ["surprised"], "stupe": ["amazed"],
    "suad": ["persuade"], "suas": ["talk"],
    "suet": ["habit"], "suesc": ["custom"],
    "sum": ["sum"],
    "sumpt": ["take"],
    "super": ["above"],
    "supin": ["lying-down"],
    "sur": ["above"],
    "surg": ["rising"], "surrec": ["uprising"],
    "sym": ["together"], "syn": ["together"],
    "tang": ["touch"], "tact": ["touch"],
    "tact": ["tact"], "tang": ["touch"],
    "tang": ["fingertip"], "tag": ["label"],
    "tact": ["finger-touch"], "tax": ["list"],
    "ten": ["hand"], "tin": ["container"], "tain": ["hand-grip"],
    "tend": ["stretch"], "tens": ["rope-tension"], "tent": ["tent"],
    "tenu": ["thin"],
    "tep": ["lukewarm"], "tepid": ["warm-water"],
    "ter": ["earth"], "terr": ["land"],
    "termin": ["stop"],
    "test": ["witness"], "testi": ["witness"],
    "text": ["fabric"],
    "the": ["temple"], "theo": ["god"],
    "therm": ["thermometer"],
    "thes": ["thesis"],
    "thrall": ["chains"],
    "tim": ["fear"],
    "tom": ["scalpel"], "tomy": ["cut"],
    "ton": ["music-note"],
    "tort": ["twist"], "tors": ["torque"],
    "tot": ["whole"],
    "tox": ["poison"],
    "tract": ["pull"],
    "trans": ["arrow-cross"],
    "trem": ["earthquake"], "tremul": ["shaking"],
    "trep": ["trembling"],
    "tribut": ["gift"], "trib": ["tribe"],
    "trit": ["sand"],
    "trud": ["breakin"], "trus": ["thrust"],
    "tuit": ["teaching"], "tut": ["protect"],
    "tum": ["swelling"], "tume": ["swell"],
    "turb": ["storm"], "turbul": ["chaos"],
    "tut": ["guard"],
    "umbr": ["umbrella"],
    "uni": ["one"],
    "urb": ["city"],
    "ut": ["tool"],
    "vac": ["empty"], "van": ["empty", "vanish"],
    "vad": ["soldier"], "vas": ["walk-through"],
    "vag": ["wandering"],
    "val": ["strong"], "valu": ["price"],
    "var": ["different"], "vari": ["variety"],
    "ven": ["arrival"], "vent": ["wind"],
    "ver": ["true"], "veri": ["truth"],
    "verb": ["word"],
    "verg": ["edge"],
    "vert": ["rotate"], "vers": ["spin"],
    "vest": ["clothing"],
    "vest": ["trace"],
    "veter": ["old"],
    "vi": ["road"], "via": ["path"],
    "vict": ["trophy"], "vinc": ["winner"],
    "vid": ["video"], "vis": ["eye"],
    "vil": ["cheap"],
    "vinc": ["chain"],
    "violat": ["broken"],
    "vis": ["seeing"],
    "vit": ["heart"], "viv": ["lively"],
    "voc": ["microphone"], "vok": ["call"],
    "vol": ["wish"], "vot": ["vow", "ballot"],
    "volv": ["roll"], "volut": ["scroll"],
    "vor": ["mouth-eating"],
    "vulg": ["crowd"],
    "vuln": ["wound"],
    "xen": ["foreign"],
    "xer": ["dry"],
    "zo": ["animal"], "zoo": ["zebra"],
}


def search(q, limit=15):
    url = f"https://api.iconify.design/search?query={urllib.parse.quote(q)}&limit={limit}"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        return json.loads(urllib.request.urlopen(req, timeout=10).read()).get("icons", [])
    except Exception:
        return []


def pick(icons):
    cands = []
    for ic in icons:
        if ":" not in ic:
            continue
        prefix, name = ic.split(":", 1)
        name_low = name.lower()
        if prefix in SKIP_PREFIXES:
            continue
        if "logo" in name_low or "brand" in name_low:
            continue
        if name_low in SKIP_NAMES:
            continue
        try:
            rank = PREFERRED.index(prefix)
        except ValueError:
            rank = len(PREFERRED) + 1
        cands.append((rank, ic))
    cands.sort()
    return cands[0][1] if cands else None


def root_queries(root_field):
    if not root_field:
        return []
    roots = re.split(r"[/\-,\s]+", root_field.lower())
    out = []
    for r in [x.strip("-").strip() for x in roots if x.strip("-")]:
        if r in ROOT_PART3:
            out.extend(ROOT_PART3[r])
    return out


def download(icon, dest):
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


def process(word, root):
    try:
        # 优先用补充的 ROOT_PART3 查
        for q in root_queries(root):
            icons = search(q)
            best = pick(icons)
            if best:
                dest = os.path.join(MEDIA, f"{word}.svg")
                sz = download(best, dest)
                if sz:
                    try:
                        shutil.copy2(dest, os.path.join(ANKI_MEDIA, f"{word}.svg"))
                    except:
                        pass
                    return (word, "ok", best, q, sz)
        return (word, "no_icon", "", "", 0)
    except Exception as e:
        return (word, f"err: {str(e)[:40]}", "", "", 0)


def main():
    prev = json.load(open(PREV, encoding="utf-8"))
    data = json.load(open(DATA, encoding="utf-8"))
    cards = {c["单词"].lower(): c for c in data["cards"]}

    targets = [w for w, v in prev.items() if v.get("icon") == "material-symbols:star"]
    print(f"待重做（star 词）：{len(targets)}")

    results = dict(prev)
    done = 0
    improved = 0
    start = time.time()

    def worker(w):
        time.sleep(PAUSE)
        c = cards.get(w.lower(), {})
        return process(w, c.get("词根", ""))

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, w): w for w in targets}
        for fut in as_completed(futures):
            word, status, icon, q, sz = fut.result()
            done += 1
            if status == "ok":
                results[word] = {"status": "ok", "icon": icon, "query": q, "size": sz}
                improved += 1

            if done % 30 == 0:
                with cache_lock:
                    with open(NEW, "w", encoding="utf-8") as f:
                        json.dump(results, f, ensure_ascii=False, indent=2)
                elapsed = (time.time()-start)/60
                rate = done/elapsed if elapsed else 0
                eta = (len(targets)-done)/rate if rate else 0
                print(f"[{done}/{len(targets)}] 救回 {improved}, rate={rate:.0f}/m, eta={eta:.0f}m")

    with open(NEW, "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)
    print(f"\n=== 完成 救回 {improved}/{len(targets)} 耗时 {(time.time()-start)/60:.1f}m ===")


if __name__ == "__main__":
    main()
