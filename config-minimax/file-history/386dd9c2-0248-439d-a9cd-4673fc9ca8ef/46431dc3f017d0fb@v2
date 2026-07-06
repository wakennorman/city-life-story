#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""重搜不准图：对 372 个 fallback 词用更具体 query 重搜。

策略升级：
1. 用 "{word} meaning" 这种组合搜（Pixabay 对短语友好）
2. 从 complete_data.json 的 单词含义 里抽英文核心词作为辅助 query
3. 多 query 试，挑 tags 跟词义最相关的图
4. 替换 media/{word}.jpg
"""
import urllib.request, urllib.parse, json, os, time, re
from concurrent.futures import ThreadPoolExecutor, as_completed

KEY = "56301016-56b7d4e6af292e4cf31ad7f21"
MEDIA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
ANKI_MEDIA = r"C:\Users\陈恒稳\AppData\Roaming\Anki2\账户 1\collection.media"
PIX = r"D:\Claude Code+DeepSeekV4\pixabay_results.json"
DATA = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\complete_data.json"
LOG = r"D:\Claude Code+DeepSeekV4\image_refresh_log.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 3
PAUSE = 1.5


def pixabay(q, per_page=5):
    qs = urllib.parse.quote(q)
    url = (f"https://pixabay.com/api/?key={KEY}&q={qs}&image_type=photo"
           f"&per_page={per_page}&safesearch=true&lang=en")
    req = urllib.request.Request(url, headers=HEADERS)
    return json.loads(urllib.request.urlopen(req, timeout=15).read())


def download(url, dest):
    req = urllib.request.Request(url, headers=HEADERS)
    data = urllib.request.urlopen(req, timeout=15).read()
    with open(dest, "wb") as f:
        f.write(data)
    return len(data)


def extract_en_keywords(meaning):
    """从含义里抽英文关键词（前 2-3 个）"""
    if not meaning: return None
    words = re.findall(r"\b[a-zA-Z]{4,}\b", meaning)
    stop = {"adj", "noun", "verb", "and", "the", "for", "from", "with", "that", "this",
            "have", "been", "such", "also", "into", "than"}
    words = [w.lower() for w in words if w.lower() not in stop]
    if not words: return None
    return " ".join(words[:2])


def score_hit(hit, word, en_kw):
    """给 hit 打分：tags 含 word 或 en_kw 越多分越高。"""
    tags = (hit.get("tags") or "").lower()
    s = 0
    if word.lower() in tags:
        s += 5
    if en_kw:
        for kw in en_kw.split():
            if kw in tags:
                s += 2
    return s


def refetch_one(word, meaning, root):
    """对一个词试多 query，选最佳。"""
    en_kw = extract_en_keywords(meaning) or ""
    queries = [
        f"{word}",                                 # 原词（保险尝试）
        f"{word} concept" if en_kw else None,
        en_kw if en_kw else None,
        f"{en_kw} concept" if en_kw else None,
    ]
    queries = [q for q in queries if q]

    best_hit = None
    best_score = -1
    best_query = ""

    for q in queries:
        try:
            r = pixabay(q, per_page=5)
            for h in r.get("hits", []):
                s = score_hit(h, word, en_kw)
                if s > best_score:
                    best_score = s
                    best_hit = h
                    best_query = q
            if best_score >= 5:
                break  # 已找到强相关的，不再试
        except urllib.error.HTTPError as e:
            if e.code == 429:
                time.sleep(8)
                continue
        except Exception:
            continue

    if not best_hit:
        return (word, "no_hit", "", "", 0)

    url = best_hit.get("webformatURL", "")
    if not url:
        return (word, "no_url", "", "", 0)

    try:
        dest = os.path.join(MEDIA, f"{word}.jpg")
        sz = download(url, dest)
        # 顺便复制到 Anki collection
        try:
            import shutil
            shutil.copy2(dest, os.path.join(ANKI_MEDIA, f"{word}.jpg"))
        except Exception:
            pass
        return (word, "ok", best_query, best_hit.get("tags", "")[:60], sz)
    except Exception as e:
        return (word, f"dl_err: {str(e)[:40]}", best_query, "", 0)


def main():
    pix = json.load(open(PIX, encoding="utf-8"))
    data = json.load(open(DATA, encoding="utf-8"))
    cards = {c["单词"].lower(): c for c in data["cards"]}

    targets = [w for w, v in pix.items() if v.get("status") == "ok_fallback"]
    print(f"要重搜的词：{len(targets)} 个")

    done = 0
    improved = 0
    log = {}
    start = time.time()

    def worker(w):
        time.sleep(PAUSE)
        c = cards.get(w, {})
        return refetch_one(w, c.get("单词含义", ""), c.get("词根", ""))

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, w): w for w in targets}
        for fut in as_completed(futures):
            word, status, query, tags, sz = fut.result()
            done += 1
            log[word] = {"status": status, "query": query, "tags": tags, "size": sz}
            if status == "ok":
                improved += 1
                # 更新 pix 状态
                pix[word]["status"] = "ok_refetched"
                pix[word]["fallback_query"] = query
                pix[word]["tags"] = tags
                pix[word]["size"] = sz

            if done % 30 == 0:
                with open(PIX, "w", encoding="utf-8") as f:
                    json.dump(pix, f, ensure_ascii=False, indent=2)
                with open(LOG, "w", encoding="utf-8") as f:
                    json.dump(log, f, ensure_ascii=False, indent=2)
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                eta = (len(targets) - done) / rate if rate else 0
                print(f"[{done}/{len(targets)}] 改善 {improved}，rate={rate:.1f}/min，eta={eta:.0f}m")

    # 最后写
    with open(PIX, "w", encoding="utf-8") as f:
        json.dump(pix, f, ensure_ascii=False, indent=2)
    with open(LOG, "w", encoding="utf-8") as f:
        json.dump(log, f, ensure_ascii=False, indent=2)

    print(f"\n=== 重搜完成 ===")
    print(f"成功替换：{improved} / {len(targets)}")
    print(f"耗时：{(time.time()-start)/60:.1f} min")


if __name__ == "__main__":
    main()
