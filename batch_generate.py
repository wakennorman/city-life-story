#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段5：全量批跑剩余词。并发3，每写盘，可中断恢复。"""
import subprocess, json, time, os
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

SKILL = r"C:\Users\陈恒稳\.openclaw-autoclaw\skills\autoglm-generate-image-seedream\generate-image-seedream.py"
PROMPTS_FILE = r"D:\Claude Code+DeepSeekV4\prompts.json"
TEST20 = r"D:\Claude Code+DeepSeekV4\test20_results.json"
CACHE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\concept_urls.json"
PROGRESS = r"D:\Claude Code+DeepSeekV4\batch_progress.json"
WORKERS = 3        # 并发数（不敢太大，怕触发限流）
PAUSE = 1.5        # 每个 worker 提交间隔
TIMEOUT = 90

cache_lock = threading.Lock()


def gen(prompt, retries=2, timeout=TIMEOUT):
    for attempt in range(retries):
        try:
            r = subprocess.run(
                ["python", SKILL, prompt],
                capture_output=True, timeout=timeout,
            )
            text = r.stdout.decode("utf-8", errors="ignore").strip()
            if not text:
                if attempt < retries - 1:
                    time.sleep(2)
                    continue
                return ("", "empty stdout")
            obj = json.loads(text)
            if obj.get("code") == 0:
                u = obj.get("data", {}).get("image_url", "")
                if u:
                    return (u, "ok")
            if attempt < retries - 1:
                time.sleep(3)
                continue
            return ("", f"code={obj.get('code')} msg={obj.get('msg', '')[:80]}")
        except subprocess.TimeoutExpired:
            if attempt < retries - 1:
                time.sleep(3)
                continue
            return ("", "timeout")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(2)
                continue
            return ("", f"err: {e}")
    return ("", "exhausted")


def save_cache(cache):
    with cache_lock:
        tmp = CACHE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
        os.replace(tmp, CACHE)


def main():
    # 1) 加载现有缓存
    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE, encoding="utf-8") as f:
            cache = json.load(f)
    initial_cached = len(cache)
    print(f"[init] 已缓存：{initial_cached}")

    # 2) 把 test20 的成功结果合并进 cache
    if os.path.exists(TEST20):
        with open(TEST20, encoding="utf-8") as f:
            t20 = json.load(f)
        for w, v in t20.items():
            if v.get("url") and not cache.get(w):
                cache[w] = v["url"]
        save_cache(cache)
        print(f"[init] 合并 test20 后缓存：{len(cache)}")

    # 3) 加载 prompts
    with open(PROMPTS_FILE, encoding="utf-8") as f:
        prompts = json.load(f)

    # 4) 算待生成
    todo = [(w, p) for w, p in prompts.items() if not cache.get(w)]
    print(f"[init] 待生成：{len(todo)} / 总 prompts：{len(prompts)}")

    if not todo:
        print("全部已生成，无需运行")
        return

    # 5) 并发跑
    done = 0
    failed = []
    progress = {"done": 0, "total": len(todo), "failed": [], "started": time.time()}
    start = time.time()

    def worker(word_prompt):
        word, prompt = word_prompt
        time.sleep(PAUSE)  # 错开
        url, status = gen(prompt)
        return (word, prompt, url, status)

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, wp): wp[0] for wp in todo}
        for fut in as_completed(futures):
            word, prompt, url, status = fut.result()
            done += 1
            if url:
                cache[word] = url
                # 每 5 个写一次盘
                if done % 5 == 0:
                    save_cache(cache)
            else:
                failed.append({"word": word, "status": status})

            if done % 25 == 0 or done == len(todo):
                elapsed = time.time() - start
                rate = done / elapsed if elapsed else 0
                eta = (len(todo) - done) / rate if rate else 0
                print(f"[{done}/{len(todo)}] ok={done-len(failed)} fail={len(failed)} "
                      f"elapsed={elapsed/60:.1f}m rate={rate:.2f}/s eta={eta/60:.1f}m")

            # 每 50 个更新进度文件
            if done % 50 == 0:
                progress["done"] = done
                progress["failed"] = failed
                with open(PROGRESS, "w", encoding="utf-8") as f:
                    json.dump(progress, f, ensure_ascii=False, indent=2)

    # 最后一次写盘
    save_cache(cache)
    progress["done"] = done
    progress["failed"] = failed
    progress["finished"] = time.time()
    with open(PROGRESS, "w", encoding="utf-8") as f:
        json.dump(progress, f, ensure_ascii=False, indent=2)

    total_time = (time.time() - start) / 60
    print(f"\n=== 全部完成 ===")
    print(f"成功：{done - len(failed)} / {len(todo)}")
    print(f"失败：{len(failed)}")
    print(f"总耗时：{total_time:.1f} 分钟")
    print(f"缓存：{CACHE}")
    if failed:
        print(f"失败示例：{failed[:5]}")


if __name__ == "__main__":
    main()
