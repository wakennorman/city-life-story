#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Bing 图搜下载器 - 10 张测试。"""
import urllib.request, urllib.parse, re, json, os, time

MEDIA_DIR = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
TEST_DIR = r"D:\Claude Code+DeepSeekV4\bing_test"
os.makedirs(TEST_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
}

TEST_WORDS = [
    "act", "react", "dict", "fluctuate", "exclude",
    "acupuncture", "induce", "circumspect", "tractor", "magnet",
]


def bing_search(word, topk=5, safesearch="Strict"):
    """搜 Bing 图片，返回 [{murl, turl, w, h, title}]"""
    q = urllib.parse.quote(word)
    url = f"https://cn.bing.com/images/search?q={q}&FORM=HDRSC2&safeSearch={safesearch}"
    req = urllib.request.Request(url, headers=HEADERS)
    html = urllib.request.urlopen(req, timeout=10).read().decode("utf-8", errors="ignore")
    matches = re.findall(r'class="iusc"[^>]*m="([^"]+)"', html)
    results = []
    for m in matches[:topk*2]:
        try:
            j = json.loads(m.replace("&quot;", '"'))
            results.append({
                "murl": j.get("murl", ""),
                "turl": j.get("turl", ""),
                "title": j.get("t", "")[:80],
                "w": j.get("mw") or 0,
                "h": j.get("mh") or 0,
            })
        except Exception:
            pass
    return results[:topk]


def download(url, dest, timeout=15):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def main():
    print(f"测 {len(TEST_WORDS)} 个词\n")
    results = {}
    for i, w in enumerate(TEST_WORDS, 1):
        try:
            t0 = time.time()
            hits = bing_search(w)
            if not hits:
                print(f"[{i}] {w}: 无结果")
                continue
            # 取第一张缩略图（Bing CDN 稳定）
            first = hits[0]
            url = first["turl"] or first["murl"]
            dest = os.path.join(TEST_DIR, f"{w}.jpg")
            sz = download(url, dest)
            elapsed = time.time() - t0
            results[w] = {"url": url, "size": sz, "title": first["title"]}
            print(f"[{i}] {w:15} | {sz/1024:.1f}KB | {elapsed:.1f}s | {first['title']}")
        except Exception as e:
            print(f"[{i}] {w}: ERR {type(e).__name__}: {str(e)[:80]}")
        time.sleep(0.5)  # 礼貌间隔

    print(f"\n下到：{TEST_DIR}")
    with open(os.path.join(TEST_DIR, "_meta.json"), "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=2)


if __name__ == "__main__":
    main()
