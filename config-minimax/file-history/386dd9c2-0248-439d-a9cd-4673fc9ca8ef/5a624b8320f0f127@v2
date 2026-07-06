#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""测：加 illustration/clipart 修饰，搜插画。"""
import urllib.request, urllib.parse, re, json, os, time

TEST_DIR = r"D:\Claude Code+DeepSeekV4\bing_v3"
os.makedirs(TEST_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

# 词 → 加修饰词
TESTS = [
    "act", "react", "dict", "fluctuate", "exclude",
    "acupuncture", "induce", "circumspect", "tractor",
    "magnet", "inscription", "compulsion", "form",
    "exclude", "permission", "junction", "numeric",
]

# 几种修饰组合
SUFFIXES = [
    "vector illustration",
    "cartoon clipart",
    "flat icon",
]

def bing(q, topk=3):
    qs = urllib.parse.quote(q)
    url = f"https://cn.bing.com/images/search?q={qs}&FORM=HDRSC2&safeSearch=Strict"
    req = urllib.request.Request(url, headers=HEADERS)
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
    matches = re.findall(r'class="iusc"[^>]*m="([^"]+)"', html)
    out = []
    for m in matches[:topk]:
        try:
            j = json.loads(m.replace("&quot;", '"'))
            out.append({"url": j.get("turl") or j.get("murl"), "title": j.get("t", "")[:60]})
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
    for word in TESTS:
        for sfx in SUFFIXES:
            q = f"{word} {sfx}"
            try:
                hits = bing(q)
                if not hits:
                    print(f"  {word:15} + {sfx:20}: 无")
                    continue
                top = hits[0]
                fn = f"{word}__{sfx.replace(' ', '_')}.jpg"
                dest = os.path.join(TEST_DIR, fn)
                sz = download(top["url"], dest)
                print(f"  {word:15} + {sfx:20}: {sz/1024:5.1f}KB | {top['title'][:50]}")
            except Exception as e:
                print(f"  {word:15} + {sfx:20}: ERR {str(e)[:50]}")
            time.sleep(0.3)
        print()


if __name__ == "__main__":
    main()
