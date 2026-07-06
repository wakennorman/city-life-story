#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测：用中文释义而非英文裸词搜图，比较效果。"""
import urllib.request, urllib.parse, re, json, os, time

TEST_DIR = r"D:\Claude Code+DeepSeekV4\bing_v2"
os.makedirs(TEST_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

# 词 → 试不同搜索词
TESTS = [
    ("act", ["act", "动作 行动", "act vocabulary"]),
    ("react", ["react", "反应", "react meaning"]),
    ("fluctuate", ["fluctuate", "波动 涨落", "波动曲线"]),
    ("exclude", ["exclude", "排除 圈外", "exclude 排除"]),
    ("acupuncture", ["acupuncture", "针灸"]),
    ("circumspect", ["circumspect", "谨慎", "circumspect 谨慎"]),
    ("tractor", ["tractor", "拖拉机"]),
    ("magnet", ["magnet", "磁铁"]),
    ("inscription", ["inscription", "碑文 题词"]),
    ("compulsion", ["compulsion", "强迫"]),
]


def bing_search(q, topk=3):
    qs = urllib.parse.quote(q)
    url = f"https://cn.bing.com/images/search?q={qs}&FORM=HDRSC2&safeSearch=Strict"
    req = urllib.request.Request(url, headers=HEADERS)
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
    matches = re.findall(r'class="iusc"[^>]*m="([^"]+)"', html)
    out = []
    for m in matches[:topk]:
        try:
            j = json.loads(m.replace("&quot;", '"'))
            out.append({
                "url": j.get("turl") or j.get("murl"),
                "title": j.get("t", "")[:60],
            })
        except Exception:
            pass
    return out


def download(url, dest):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=15) as r:
        data = r.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def main():
    summary = {}
    for word, queries in TESTS:
        print(f"\n=== {word} ===")
        summary[word] = {}
        for qi, q in enumerate(queries):
            try:
                hits = bing_search(q)
                if not hits:
                    print(f"  q[{qi}] '{q}': 无结果")
                    continue
                top = hits[0]
                dest = os.path.join(TEST_DIR, f"{word}_q{qi}.jpg")
                sz = download(top["url"], dest)
                print(f"  q[{qi}] '{q}': {sz/1024:.1f}KB | {top['title']}")
                summary[word][f"q{qi}"] = {"query": q, "size": sz, "title": top["title"]}
            except Exception as e:
                print(f"  q[{qi}] '{q}': ERR {str(e)[:60]}")
            time.sleep(0.3)

    with open(os.path.join(TEST_DIR, "_summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, ensure_ascii=False, indent=2)
    print(f"\n下到：{TEST_DIR}")


if __name__ == "__main__":
    main()
