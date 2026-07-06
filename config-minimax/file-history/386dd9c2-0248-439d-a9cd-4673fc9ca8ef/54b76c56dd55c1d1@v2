#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段3：为每个待生成词设计「{具体视觉场景}, simple icon style」格式的 prompt。

策略：
1. 词根本身 → 根据词根含义画核心概念图
2. 派生词 → 词根视觉 + 前缀方向 + 后缀词性，组合成具体场景
3. 已在文件中有清晰释义的 → 从释义提取核心名词/动作
4. 兜底 → 用词根含义+词形拼凑
"""
import re, json, os

IN_FILE = r"D:\Claude Code+DeepSeekV4\to_generate_with_meaning.json"
OUT_FILE = r"D:\Claude Code+DeepSeekV4\prompts.json"

# 已有 prompts 缓存（已生成的词的 prompt 文字，用于参考风格）
# 从 gen_clud_images.py 等脚本学到的风格：动作场景 + 角色 + 物体

# 词根 → 核心英文动作/概念（用于生成具体视觉场景）
# 覆盖全部 283 个词根；按 part1/2/3 顺序排
ROOT_CONCEPT = {
    # part1 高频拉丁词根
    "act": ("action", "person performing action with motion lines"),
    "form": ("shape/form", "hands molding clay into shape"),
    "dict": ("to say", "speech bubble with words coming out of mouth"),
    "port": ("to carry", "person carrying heavy box"),
    "vis": ("to see", "large eye looking through magnifying glass"),
    "vid": ("to see", "eye watching screen"),
    "tract": ("to pull", "tractor pulling load"),
    "trace": ("to track", "footprints on ground"),
    "duc": ("to lead", "leader guiding group with arrow"),
    "duct": ("to lead", "pipe channel leading water"),
    "mit": ("to send", "envelope flying through air"),
    "miss": ("to send", "rocket missile launching"),
    "pel": ("to push", "hand pushing button"),
    "puls": ("to push", "heartbeat pulse waveform"),
    "put": ("to think", "thinking person with thought bubble"),
    "spect": ("to look", "eye examining specimen"),
    "ject": ("to throw", "hand throwing ball"),
    "junct": ("to join", "two puzzle pieces joining"),
    "join": ("to join", "two ropes tied together"),
    "flu": ("to flow", "water flowing in river"),
    "flux": ("flowing change", "swirling currents"),
    "numer": ("number", "numbers 1 2 3 floating"),
    "numb": ("number", "calculator with digits"),
    "scrib": ("to write", "quill pen writing on paper"),
    "script": ("written text", "ancient scroll with writing"),
    "clud": ("to close", "closed door with lock"),
    "clus": ("closed off", "fenced off area"),
    "claim": ("to shout", "person shouting through megaphone"),
    "clam": ("to shout", "open mouth shouting"),
    "fect": ("to do/make", "craftsman making object"),
    "fact": ("to do/make", "factory producing goods"),
    "flex": ("to bend", "bent bow flexing"),
    "flect": ("to bend", "mirror reflecting light"),
    "grad": ("step", "stairs going up"),
    "gress": ("to walk", "footsteps walking forward"),
    "stru": ("to build", "construction crane building"),
    "struct": ("structure", "building blueprint"),
    "fid": ("trust/faith", "handshake of trust"),
    "tend": ("to stretch", "stretched rubber band"),
    "tens": ("tension", "taut rope"),
    "tent": ("stretched cover", "stretched tent"),
    "tain": ("to hold", "hands holding object firmly"),
    "ten": ("to hold", "fist gripping tightly"),
    "tin": ("to hold", "container holding contents"),
    "tang": ("to touch", "fingertip touching surface"),
    "tact": ("to touch", "fingers touching screen"),
    "tag": ("to touch", "label tag attached"),
    "tax": ("to arrange", "books arranged in order"),
    "vers": ("to turn", "rotating arrow"),
    "vert": ("to turn", "wheel spinning"),
    "cur": ("to run", "person running fast"),
    "cours": ("to run/course", "race track with runner"),
    "ven": ("to come", "person arriving at door"),
    "vent": ("to come/wind", "wind blowing through vent"),
    # part 2-3 词根（按字母简化映射）
    "fin": ("end/limit", "finish line tape"),
    "firm": ("strong/solid", "strong arm flexing muscle"),
    "fix": ("to fasten", "hammer hammering nail"),
    "flat": ("flat", "flat pancake"),
    "flor": ("flower", "blooming flower"),
    "flu": ("to flow", "river flowing"),
    "fract": ("to break", "broken glass shards"),
    "frag": ("to break", "shattered pottery"),
    "fug": ("to flee", "person running away"),
    "fund": ("bottom/base", "tree roots underground"),
    "fus": ("to pour", "liquid pouring from jug"),
    "gen": ("to produce/birth", "seedling sprouting"),
    "gest": ("to carry", "shoulders carrying load"),
    "graph": ("to write/draw", "hand drawing chart"),
    "gram": ("written letter", "letter envelope sealed"),
    "habit": ("to dwell", "cozy house with smoke chimney"),
    "her": ("to stick", "magnet attracting metal"),
    "hes": ("to stick", "glue bottle dripping"),
    "hum": ("ground/earth", "soil with seedling"),
    "ign": ("fire", "flame burning"),
    "ject": ("to throw", "ball being thrown"),
    "lab": ("work", "worker with shovel"),
    "lat": ("to carry", "carried weight on back"),
    "lect": ("to choose/read", "finger pointing at choice"),
    "leg": ("law/read", "law book with gavel"),
    "lev": ("to lift", "elevator going up"),
    "liber": ("free", "bird flying free from cage"),
    "lic": ("to permit", "permission stamp approval"),
    "lig": ("to bind", "rope tying knot"),
    "loc": ("place", "location pin on map"),
    "log": ("word/study", "open book with words"),
    "loqu": ("to speak", "two people talking"),
    "luc": ("light", "glowing lightbulb"),
    "lumin": ("light", "shining lamp"),
    "lun": ("moon", "crescent moon in sky"),
    "lustr": ("to shine", "polished gem sparkling"),
    "magn": ("great", "giant mountain"),
    "maj": ("greater", "tall king on throne"),
    "max": ("greatest", "trophy gold first place"),
    "mar": ("sea", "ocean waves"),
    "mat": ("mother", "mother holding child"),
    "med": ("middle/heal", "doctor with stethoscope"),
    "medic": ("to heal", "medicine pills bottle"),
    "memor": ("memory", "brain with thought clouds"),
    "member": ("memory/limb", "remembering people in group"),
    "mend": ("to fix", "hands sewing torn cloth"),
    # 其他常见词根
    "ag": ("to do/drive", "driver steering wheel"),
    "ig": ("to drive", "pushing forward arrow"),
    "am": ("to love", "heart symbol"),
    "anim": ("life/spirit", "spark of life energy"),
    "ann": ("year", "calendar year"),
    "anthrop": ("human", "person silhouette"),
    "aqua": ("water", "water drop blue"),
    "arch": ("ruler/chief", "crown of king"),
    "art": ("skill/craft", "paintbrush palette"),
    "aud": ("to hear", "ear listening sound waves"),
    "audi": ("to hear", "headphones music"),
    "bell": ("war", "two swords crossed"),
    "ben": ("good", "thumbs up positive"),
    "bibl": ("book", "open book pages"),
    "bio": ("life", "DNA helix strand"),
    "brev": ("short", "short pencil stub"),
    "cad": ("to fall", "falling leaf"),
    "cas": ("to fall", "waterfall cascade"),
    "cap": ("to take/head", "hand grabbing object"),
    "cept": ("to take", "hands receiving gift"),
    "ceive": ("to receive", "open hands receiving"),
    "cept": ("to take", "catcher's mitt"),
    "ced": ("to go/yield", "footsteps walking forward"),
    "cess": ("to go", "marching feet"),
    "celer": ("swift", "speedometer fast"),
    "cent": ("hundred", "number 100 banner"),
    "centr": ("center", "bullseye target center"),
    "cern": ("to separate", "sifting filter"),
    "cert": ("sure/certain", "certified seal stamp"),
    "chrom": ("color", "color palette rainbow"),
    "chron": ("time", "clock face with hands"),
    "cide": ("to kill", "skull crossbones warning"),
    "cis": ("to cut", "scissors cutting"),
    "cit": ("to call/urge", "summoning hand gesture"),
    "civ": ("citizen/city", "city skyline"),
    "clar": ("clear", "transparent window clear"),
    "clin": ("to lean", "leaning tower"),
    "cogn": ("to know", "brain with idea bulb"),
    "cord": ("heart", "heart shape"),
    "corp": ("body", "human body anatomy"),
    "cosm": ("universe", "stars galaxy space"),
    "cre": ("to grow/create", "growing plant"),
    "cred": ("to believe", "trust handshake"),
    "crim": ("crime/judge", "handcuffs justice"),
    "cult": ("to till/cultivate", "farmer tilling field"),
    "cycl": ("circle", "circle wheel"),
    "dec": ("ten", "ten fingers counting"),
    "dem": ("people", "crowd of people"),
    "dent": ("tooth", "smiling tooth"),
    "derm": ("skin", "hand skin texture"),
    "di": ("two/day", "sun and day"),
    "dign": ("worthy", "medal of honor"),
    "doc": ("to teach", "teacher at blackboard"),
    "dol": ("pain/sorrow", "sad face crying"),
    "dom": ("home/rule", "house with king crown"),
    "don": ("to give", "gift wrapped present"),
    "dorm": ("to sleep", "sleeping person in bed"),
    "dox": ("opinion", "debate speech bubbles"),
    "dynam": ("power", "lightning bolt energy"),
    "ego": ("self/I", "mirror reflecting self"),
    "equ": ("equal", "balanced scale equal"),
    "err": ("to wander/err", "wrong path with X mark"),
    "esth": ("feeling/beauty", "beautiful flower"),
    "ethn": ("nation/people", "globe with flags"),
    "fa": ("to speak/fame", "famous star with microphone"),
    "fer": ("to carry/bear", "porter carrying suitcase"),
    "fid": ("trust", "loyal dog faithful"),
    "fil": ("thread/son", "spool of thread"),
    "flect": ("to bend", "bent ruler"),
    "frag": ("to break", "broken pottery shards"),
    "front": ("forehead/front", "person facing forward"),
    "gam": ("marriage", "wedding rings"),
    "geo": ("earth", "earth globe"),
    "germ": ("seed/sprout", "growing seed sprout"),
    "gest": ("to bear/carry", "pregnant belly"),
    "glor": ("glory", "shining trophy"),
    "gn": ("to know", "lightbulb knowledge"),
    "grad": ("step/grade", "stairs steps"),
    "graph": ("to write", "pen writing"),
    "grat": ("pleasing/thanks", "thank you note heart"),
    "greg": ("flock/group", "flock of sheep together"),
    "hap": ("luck/chance", "four leaf clover"),
    "hemi": ("half", "half moon"),
    "homo": ("same/man", "identical twins"),
    "hum": ("ground/humble", "bowing person humble"),
    "hydr": ("water", "water droplet"),
    "iatr": ("doctor", "doctor with stethoscope"),
    "init": ("to begin", "starting line"),
    "integr": ("whole", "complete circle"),
    "ir": ("anger", "angry red face"),
    "it": ("to go", "walking footsteps"),
    "junct": ("to join", "joining hands"),
    "jur": ("to swear/law", "hand raised oath"),
    "just": ("just/law", "scales of justice"),
    "juven": ("young", "young child"),
    "lab": ("to slip/labor", "worker with tools"),
    "lat": ("side/to bear", "side view of person"),
    "lav": ("to wash", "soap bubbles washing"),
    "lect": ("to read/choose", "open book reading"),
    "leg": ("law/read", "law book"),
    "lev": ("light/lift", "balloon lifting up"),
    "linqu": ("to leave", "person waving goodbye"),
    "liter": ("letter", "alphabet letters"),
    "loc": ("place", "location marker"),
    "log": ("word/study", "speech bubble word"),
    "long": ("long", "long ruler"),
    "luc": ("light", "bright light"),
    "magn": ("great", "giant size"),
    "man": ("hand", "open hand"),
    "manu": ("hand", "handwriting hand"),
    "mar": ("sea", "ocean wave"),
    "mater": ("mother", "mother with baby"),
    "matr": ("mother", "matriarch elder woman"),
    "mech": ("machine", "gears mechanism"),
    "medi": ("middle", "middle position arrow"),
    "memor": ("memory", "memory brain"),
    "mens": ("month/measure", "measuring tape"),
    "merc": ("trade/reward", "marketplace stall"),
    "merg": ("to dip/plunge", "diver into water"),
    "meter": ("measure", "ruler measuring"),
    "min": ("small/lessen", "tiny mouse small"),
    "mir": ("to wonder", "wide eyes amazed"),
    "mis": ("to send", "letter sent"),
    "mob": ("to move", "moving car wheels"),
    "mod": ("manner/measure", "fashion model"),
    "mon": ("to warn/show", "warning sign exclamation"),
    "mor": ("custom/death", "tombstone grave"),
    "mort": ("death", "skull mortality"),
    "mot": ("to move", "motor engine"),
    "mut": ("to change", "transformation arrows"),
    "nasc": ("to be born", "newborn baby"),
    "nat": ("born/native", "newborn baby"),
    "naut": ("ship/sailor", "sailor with ship"),
    "nav": ("ship", "boat sailing"),
    "neg": ("no/deny", "red X negative"),
    "noc": ("harm/night", "danger warning"),
    "nom": ("name/law", "name tag label"),
    "nomin": ("name", "nameplate"),
    "norm": ("rule/standard", "ruler standard"),
    "nounc": ("to announce", "megaphone announcing"),
    "nov": ("new", "shiny new item"),
    "nul": ("none", "empty zero circle"),
    "numer": ("number", "numbers 123"),
    "ocul": ("eye", "eyeball"),
    "od": ("song", "musical note"),
    "onym": ("name", "signature"),
    "oper": ("to work", "machine operator"),
    "opt": ("eye/choose", "checkmark choice"),
    "or": ("mouth/edge", "mouth open"),
    "ord": ("order", "ordered list"),
    "ori": ("to rise", "sunrise"),
    "orn": ("to decorate", "decorated ornament"),
    "ortho": ("straight/correct", "straight ruler"),
    "pac": ("peace", "peace dove"),
    "part": ("part", "puzzle piece"),
    "pass": ("to pass/feel", "passing through doorway"),
    "pat": ("to suffer/father", "wise father"),
    "path": ("feeling/suffering", "sad emoji heart"),
    "pater": ("father", "father with child"),
    "patr": ("father", "fatherly figure"),
    "ped": ("foot/child", "footprints"),
    "pel": ("to push/drive", "pushing arrow"),
    "pend": ("to hang/weigh", "pendulum hanging"),
    "pens": ("to weigh", "scale weighing"),
    "pet": ("to seek", "magnifying glass searching"),
    "phil": ("love", "heart love"),
    "phob": ("fear", "scared face fear"),
    "phon": ("sound", "speaker sound waves"),
    "phot": ("light", "camera flash"),
    "phys": ("nature/body", "muscular body"),
    "pict": ("to paint", "painter painting"),
    "plac": ("to please", "smile happy"),
    "plant": ("plant", "growing plant"),
    "ple": ("to fill", "full glass"),
    "plen": ("full", "overflowing cup"),
    "pli": ("to fold/bend", "folded paper"),
    "plic": ("to fold", "folded fan"),
    "plod": ("to clap", "clapping hands"),
    "plor": ("to cry/explore", "exploring map"),
    "plur": ("more", "many items pile"),
    "ply": ("to fold/employ", "layers stacked"),
    "pneum": ("breath/air", "lungs breathing"),
    "pod": ("foot", "foot icon"),
    "polis": ("city", "city buildings"),
    "polit": ("city/citizen", "political flag"),
    "pon": ("to put/place", "placing block"),
    "pop": ("people", "crowd population"),
    "port": ("to carry", "porter carrying bag"),
    "pos": ("to put", "placed item"),
    "poss": ("to be able", "muscle strong arm"),
    "pot": ("power", "powerful fist"),
    "pre": ("to take/seize", "grabbing hand"),
    "prehend": ("to grasp", "gripping hand"),
    "press": ("to press", "pressing button"),
    "prim": ("first", "number 1 ribbon first"),
    "priv": ("alone/private", "private no entry sign"),
    "prob": ("to test/prove", "testing experiment"),
    "prov": ("to test/prove", "proven checkmark"),
    "psych": ("mind/soul", "brain mind"),
    "pugn": ("to fight", "boxing gloves"),
    "punct": ("point/prick", "needle point"),
    "pung": ("to prick", "thorn sharp"),
    "pur": ("clean/pure", "pure white crystal"),
    "quer": ("to seek/ask", "question mark"),
    "quest": ("to seek", "quest treasure search"),
    "quir": ("to seek", "searching detective"),
    "quit": ("free/discharge", "exit door"),
    "rad": ("ray/root", "sun rays"),
    "ras": ("to scrape", "eraser rubbing"),
    "rat": ("reason/calculate", "calculator thinking"),
    "ration": ("reason", "balance brain"),
    "reg": ("to rule/straight", "king ruling"),
    "rect": ("right/straight", "ruler straight line"),
    "rid": ("to laugh", "laughing face"),
    "rig": ("to rule/right", "straight ruler"),
    "rip": ("riverbank", "riverbank water"),
    "riv": ("river/stream", "stream flowing"),
    "rod": ("to gnaw", "rodent chewing"),
    "rog": ("to ask", "asking question hand raised"),
    "rot": ("wheel/turn", "spinning wheel"),
    "rud": ("rude/rough", "rough rock"),
    "rupt": ("to break", "broken pieces"),
    "sacr": ("sacred", "halo sacred"),
    "sal": ("to leap/salt", "jumping leap"),
    "san": ("healthy/sound", "healthy heart"),
    "sanct": ("sacred", "holy church"),
    "sat": ("enough/full", "full stomach satisfied"),
    "sci": ("to know", "atom science"),
    "scop": ("to look/see", "telescope viewing"),
    "scrib": ("to write", "writing hand"),
    "sect": ("to cut", "scissors cutting"),
    "secut": ("to follow", "following footsteps"),
    "sed": ("to sit", "person sitting chair"),
    "sens": ("to feel/perceive", "five senses icon"),
    "sent": ("to feel", "feeling heart emotion"),
    "sequ": ("to follow", "sequence arrows"),
    "serv": ("to serve/keep", "servant tray"),
    "sess": ("to sit", "seated meeting"),
    "sid": ("to sit", "sitting person"),
    "sign": ("sign/mark", "signature pen"),
    "simil": ("similar/like", "two similar items"),
    "sist": ("to stand", "standing person"),
    "soci": ("companion", "group of friends"),
    "sol": ("alone/sun", "sun alone"),
    "solv": ("to loosen/solve", "untying knot"),
    "solut": ("to loose", "loosened rope"),
    "somn": ("sleep", "sleeping z's"),
    "son": ("sound", "sound waves"),
    "soph": ("wise", "owl wisdom"),
    "spect": ("to look", "eye looking glasses"),
    "spers": ("to scatter", "scattered leaves"),
    "spir": ("breath", "breathing lungs"),
    "spond": ("to promise", "handshake promise"),
    "spons": ("to pledge", "pledge hand"),
    "st": ("to stand", "standing pillar"),
    "stat": ("to stand", "statue standing"),
    "sting": ("to prick", "stinger bee"),
    "stinct": ("to prick", "instinct lightbulb"),
    "stitut": ("to stand", "constitution document"),
    "strict": ("to draw tight", "tight rope binding"),
    "stru": ("to build", "construction crane"),
    "stud": ("study", "student studying"),
    "sum": ("to take up", "summing up calculator"),
    "sumpt": ("to take", "taking item"),
    "tac": ("silent", "shushing finger"),
    "tag": ("to touch", "label tag"),
    "techn": ("art/skill", "tools craftsmanship"),
    "tele": ("far", "telescope distant"),
    "temp": ("time", "hourglass time"),
    "tempor": ("time", "clock time"),
    "ter": ("earth", "earth globe"),
    "term": ("end/boundary", "stop sign end"),
    "terr": ("land", "land map"),
    "text": ("to weave", "woven fabric"),
    "the": ("god", "god temple"),
    "therm": ("heat", "thermometer hot"),
    "ton": ("sound/tone", "tone music note"),
    "top": ("place", "topography map"),
    "tort": ("to twist", "twisted rope"),
    "tox": ("poison", "poison bottle skull"),
    "trib": ("to give/tribe", "giving tribe"),
    "trit": ("to rub", "sandpaper rubbing"),
    "trud": ("to thrust", "intruder breaking in"),
    "trus": ("to thrust", "thrusting sword"),
    "turb": ("to disturb", "stormy turbulence"),
    "umbr": ("shade", "umbrella shade"),
    "und": ("wave", "ocean wave"),
    "uni": ("one", "number one"),
    "urb": ("city", "urban skyscraper"),
    "ut": ("to use", "tool utility"),
    "vac": ("empty", "empty vacuum"),
    "vad": ("to go", "invader marching"),
    "val": ("strong/worth", "muscle valuable"),
    "var": ("different", "varied colors"),
    "veh": ("to carry", "vehicle car"),
    "vell": ("to pluck", "plucking flower"),
    "ven": ("to come", "arriving guest"),
    "vest": ("clothing", "clothes wardrobe"),
    "vi": ("way", "road path"),
    "vict": ("to conquer", "victory podium"),
    "vince": ("to conquer", "winning fist"),
    "vit": ("life", "vital heart pulse"),
    "viv": ("life", "lively energy"),
    "voc": ("voice/call", "microphone voice"),
    "vok": ("voice/call", "calling shouting"),
    "vol": ("will/wish", "wishing star"),
    "volv": ("to roll", "rolling ball"),
    "volut": ("to roll", "rolled scroll"),
    "vor": ("to eat", "eating mouth bite"),
    "vot": ("to vow", "voting ballot"),
}

# 前缀方向修饰
PREFIX_HINT = {
    "ab": "moving away from",
    "ad": "moving toward",
    "ante": "before/front",
    "anti": "against opposing",
    "be": "around surrounding",
    "bi": "two double",
    "circum": "circling around",
    "co": "together joined",
    "col": "together collected",
    "com": "together combined",
    "con": "together connected",
    "contra": "against opposite",
    "counter": "opposing reverse",
    "de": "down removing",
    "di": "apart separating",
    "dis": "apart not",
    "e": "out outward",
    "ec": "out outside",
    "en": "into making",
    "epi": "upon over",
    "ex": "out outward",
    "extra": "beyond outside",
    "fore": "before front",
    "hyper": "over excessive",
    "hypo": "under below",
    "il": "not negative",
    "im": "into not",
    "in": "into not",
    "inter": "between among",
    "intra": "inside within",
    "intro": "inside inward",
    "ir": "not negative",
    "mal": "bad wrong",
    "mis": "wrong wrongly",
    "multi": "many multiple",
    "non": "not negative",
    "ob": "against opposing",
    "out": "outside surpassing",
    "over": "above excessive",
    "para": "beside parallel",
    "per": "through completely",
    "peri": "around encircling",
    "post": "after behind",
    "pre": "before front",
    "pro": "forward forth",
    "re": "back again",
    "retro": "backward back",
    "se": "apart aside",
    "semi": "half partly",
    "sub": "under below",
    "super": "above over",
    "sur": "above over",
    "sym": "together same",
    "syn": "together same",
    "trans": "across through",
    "tri": "three triple",
    "ultra": "beyond extreme",
    "un": "not reverse",
    "under": "below beneath",
    "up": "upward upper",
    "with": "back against",
}

# 后缀 → 词性 → 视觉补足
SUFFIX_HINT = {
    "tion": "action result document",
    "sion": "action condition state",
    "ion": "process state",
    "ment": "result state object",
    "ity": "state quality measure",
    "ness": "quality state nature",
    "ance": "quality action state",
    "ence": "quality action state",
    "er": "person who does",
    "or": "person who does",
    "ist": "person specialist",
    "ism": "doctrine belief",
    "ize": "to make into",
    "ify": "to make into",
    "ate": "to make act",
    "ful": "full of quality",
    "less": "without lacking",
    "able": "capable of able",
    "ible": "capable of able",
    "ive": "tending to nature",
    "al": "relating to",
    "ic": "relating to nature",
    "ous": "having quality",
    "ant": "person doing",
    "ent": "person doing",
    "ly": "manner way",
    "ship": "state position",
    "hood": "state condition",
    "ess": "female person",
    "let": "small little",
    "y": "having quality",
}

def find_root_concept(word, root_field):
    """从词根字段中找最匹配的核心概念。"""
    # 词根字段可能是 "ACT-" "VIS-/VID-" "fin" 等
    roots = re.split(r"[/\-,\s]+", root_field.lower())
    roots = [r.strip("-") for r in roots if r.strip("-")]
    for r in roots:
        if r in ROOT_CONCEPT:
            return ROOT_CONCEPT[r]
    # 找不到：用词本身的字符匹配
    for k, v in ROOT_CONCEPT.items():
        if k in word.lower():
            return v
    return ("concept", "abstract concept icon")

def detect_prefix(word, root_form):
    """检测单词前缀。"""
    w = word.lower()
    rf = root_form.lower().strip("-")
    for p in sorted(PREFIX_HINT.keys(), key=len, reverse=True):
        if w.startswith(p) and len(w) > len(p) + 2:
            return p, PREFIX_HINT[p]
    return None, ""

def detect_suffix(word):
    """检测单词后缀。"""
    w = word.lower()
    for s in sorted(SUFFIX_HINT.keys(), key=len, reverse=True):
        if w.endswith(s) and len(w) > len(s) + 2:
            return s, SUFFIX_HINT[s]
    return None, ""

def design_prompt(word, rec):
    """为单个词设计 prompt。"""
    root_field = rec["root"]
    meaning, base_scene = find_root_concept(word, root_field)
    prefix, prefix_hint = detect_prefix(word, root_field)
    suffix, suffix_hint = detect_suffix(word)

    # 词根本身：用核心场景
    if rec.get("is_root_itself"):
        return f"{base_scene}, simple icon style"

    # 派生词：基础场景 + 前后缀方向
    parts = [base_scene]
    if prefix_hint:
        parts.append(prefix_hint)
    if suffix:
        if "person" in suffix_hint:
            parts.append("with person figure")
        elif "action" in suffix_hint or "process" in suffix_hint:
            parts.append("process unfolding")
        elif "state" in suffix_hint or "quality" in suffix_hint:
            parts.append("quality demonstrated")

    # 加单词本身作为额外提示，让生图有差异性
    scene = ", ".join(parts) + f", concept of {word}, simple icon style"
    return scene


def main():
    with open(IN_FILE, encoding="utf-8") as f:
        data = json.load(f)
    records = data["records"]

    prompts = {}
    need_gen = [(w, r) for w, r in records.items() if not r["cached"]]
    print(f"需设计 prompt：{len(need_gen)} 个")

    seen_prompts = set()
    duplicates = 0
    for word, rec in need_gen:
        p = design_prompt(word, rec)
        # 去重保护：若 prompt 完全相同，加序号微调
        if p in seen_prompts:
            duplicates += 1
            p = p.replace(", simple icon style", f", {word} variant, simple icon style")
        seen_prompts.add(p)
        prompts[word] = p

    # 输出
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(prompts, f, ensure_ascii=False, indent=2)

    print(f"\n生成 prompts：{len(prompts)}")
    print(f"去重前重复数：{duplicates}（已加 variant 标记区分）")
    print(f"\n=== 前 20 个 prompts 示例 ===")
    for w, p in list(prompts.items())[:20]:
        print(f"{w:25} → {p}")
    print(f"\n输出：{OUT_FILE}")

if __name__ == "__main__":
    main()
