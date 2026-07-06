#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Pixabay 全量批跑：1768 词 → 真实图片 → 本地 anki/media/"""
import urllib.request, urllib.parse, json, os, time, hashlib
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

KEY = "56301016-56b7d4e6af292e4cf31ad7f21"
PROMPTS = r"D:\Claude Code+DeepSeekV4\prompts.json"
TO_GEN_FULL = r"D:\Claude Code+DeepSeekV4\to_generate_with_meaning.json"
MEDIA_DIR = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\media"
PIXABAY_CACHE = r"D:\Claude Code+DeepSeekV4\pixabay_results.json"
LOCAL_MAP = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\local_image_map.json"

HEADERS = {"User-Agent": "Mozilla/5.0 Chrome/120"}
WORKERS = 4         # Pixabay 限 100 req/60s，4 worker × 1s pause ≈ 80/min，安全
PAUSE = 1.0
TIMEOUT = 15

os.makedirs(MEDIA_DIR, exist_ok=True)
cache_lock = threading.Lock()


def pixabay_search(q, per_page=5):
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


def best_query(word, raw_meaning):
    """根据词形和释义，决定搜索词。"""
    # 提取中文释义里的核心英文动词/名词（如有）
    queries = [word]
    # 兜底：原词 + 英文同义近似
    return queries


def process_word(word, rec_meaning):
    """主流程：搜 → 选 → 下 → 返回本地文件名"""
    # 第一次尝试：原词
    for q_attempt in [word]:
        try:
            r = pixabay_search(q_attempt, per_page=3)
            hits = r.get("hits", [])
            if hits:
                h = hits[0]
                url = h.get("webformatURL", "")
                if url:
                    dest = os.path.join(MEDIA_DIR, f"{word}.jpg")
                    sz = download(url, dest)
                    return (word, "ok", sz, h.get("tags", "")[:60])
        except urllib.error.HTTPError as e:
            if e.code == 429:
                # rate limit
                time.sleep(10)
                continue
            return (word, f"http_{e.code}", 0, "")
        except Exception as e:
            return (word, f"err: {str(e)[:60]}", 0, "")
    return (word, "no_hit", 0, "")


def main():
    # 加载 prompts.json 拿要做的词
    with open(PROMPTS, encoding="utf-8") as f:
        prompts = json.load(f)
    with open(TO_GEN_FULL, encoding="utf-8") as f:
        full = json.load(f)
    meanings = {w: r.get("raw_meaning", "") for w, r in full["records"].items()}

    # 加载已有 Pixabay 缓存（避免重跑）
    pix_cache = {}
    if os.path.exists(PIXABAY_CACHE):
        with open(PIXABAY_CACHE, encoding="utf-8") as f:
            pix_cache = json.load(f)

    # 待办：prompts 里所有词 - 已 cache 的
    all_words = list(prompts.keys())
    # 检查文件是否已存在（中断恢复）
    todo = [w for w in all_words
            if not (pix_cache.get(w, {}).get("ok") and
                    os.path.exists(os.path.join(MEDIA_DIR, f"{w}.jpg")))]
    print(f"总词数：{len(all_words)}")
    print(f"已缓存：{len(all_words) - len(todo)}")
    print(f"待下载：{len(todo)}")

    if not todo:
        print("全部已下载")
        return

    done = 0
    ok = 0
    failed = []
    start = time.time()

    def worker(word):
        time.sleep(PAUSE)
        return process_word(word, meanings.get(word, ""))

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, w): w for w in todo}
        for fut in as_completed(futures):
            word, status, sz, tags = fut.result()
            done += 1
            pix_cache[word] = {"ok": status == "ok", "status": status, "size": sz, "tags": tags}
            if status == "ok":
                ok += 1
            else:
                failed.append({"word": word, "status": status})

            if done % 20 == 0:
                with cache_lock:
                    with open(PIXABAY_CACHE, "w", encoding="utf-8") as f:
                        json.dump(pix_cache, f, ensure_ascii=False, indent=2)
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                eta = (len(todo) - done) / rate if rate else 0
                print(f"[{done:4}/{len(todo)}] ok={ok} fail={len(failed)} "
                      f"elapsed={elapsed:.1f}m rate={rate:.1f}/min eta={eta:.0f}m")

    # 最后保存
    with open(PIXABAY_CACHE, "w", encoding="utf-8") as f:
        json.dump(pix_cache, f, ensure_ascii=False, indent=2)

    # 生成本地文件名映射（给 gen_anki_from_json.py 用）
    local_map = {}
    for w, v in pix_cache.items():
        if v.get("ok"):
            fn = f"{w}.jpg"
            if os.path.exists(os.path.join(MEDIA_DIR, fn)):
                local_map[w] = fn
    with open(LOCAL_MAP, "w", encoding="utf-8") as f:
        json.dump(local_map, f, ensure_ascii=False, indent=2)

    total = (time.time() - start) / 60
    print(f"\n=== 完成 ===")
    print(f"成功 {ok}/{len(todo)}，失败 {len(failed)}")
    print(f"耗时 {total:.1f} min")
    print(f"本地图：{MEDIA_DIR}")
    print(f"映射：{LOCAL_MAP}")
    if failed:
        print(f"\n失败前 10：{failed[:10]}")


if __name__ == "__main__":
    main()
