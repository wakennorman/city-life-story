#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""恢复脚本：等 OpenClaw token 服务恢复后，自动续跑失败和未生成词。

用法：
1. 重启 OpenClaw / AutoClaw 桌面应用，确认 127.0.0.1:18432 可访问
2. python resume_batch.py
   - 自动等待 token 服务上线
   - 自动重跑 batch_progress.json 里的 failed 词
   - 自动续跑 prompts.json 里还没生成的词
   - 用更低的并发（2 worker）+ 更长的间隔（3s）避免再次拖垮服务
"""
import subprocess, json, time, os, urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

SKILL = r"C:\Users\陈恒稳\.openclaw-autoclaw\skills\autoglm-generate-image-seedream\generate-image-seedream.py"
PROMPTS_FILE = r"D:\Claude Code+DeepSeekV4\prompts.json"
PROGRESS_FILE = r"D:\Claude Code+DeepSeekV4\batch_progress.json"
CACHE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\concept_urls.json"
TOKEN_URL = "http://127.0.0.1:18432/get_token"
WORKERS = 2     # 比之前更保守
PAUSE = 3.0     # 更长间隔
TIMEOUT = 90

cache_lock = threading.Lock()


def check_token_alive():
    try:
        with urllib.request.urlopen(TOKEN_URL, timeout=3) as resp:
            t = resp.read().decode().strip()
            return bool(t)
    except Exception:
        return False


def wait_for_token():
    print("等待 token 服务（127.0.0.1:18432）上线...")
    interval = 10
    waited = 0
    while not check_token_alive():
        print(f"  ...仍未上线，已等 {waited}s（请重启 OpenClaw/AutoClaw 桌面应用）")
        time.sleep(interval)
        waited += interval
        if waited > 1800:  # 等 30 分钟还没起来就放弃
            print("等待超时，放弃")
            return False
    print(f"✓ Token 服务上线（等了 {waited}s）")
    return True


def gen(prompt, retries=3, timeout=TIMEOUT):
    for attempt in range(retries):
        try:
            r = subprocess.run(
                ["python", SKILL, prompt],
                capture_output=True, timeout=timeout,
            )
            text = r.stdout.decode("utf-8", errors="ignore").strip()
            if not text:
                if attempt < retries - 1:
                    time.sleep(5)
                    continue
                return ("", "empty stdout (token service down?)")
            obj = json.loads(text)
            if obj.get("code") == 0:
                u = obj.get("data", {}).get("image_url", "")
                if u:
                    return (u, "ok")
            if attempt < retries - 1:
                time.sleep(5)
                continue
            return ("", f"code={obj.get('code')} msg={obj.get('msg', '')[:80]}")
        except subprocess.TimeoutExpired:
            if attempt < retries - 1:
                time.sleep(5)
                continue
            return ("", "timeout")
        except Exception as e:
            if attempt < retries - 1:
                time.sleep(3)
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
    if not wait_for_token():
        return

    # 加载现有缓存
    cache = {}
    if os.path.exists(CACHE):
        with open(CACHE, encoding="utf-8") as f:
            cache = json.load(f)
    print(f"[init] 已缓存：{len(cache)}")

    # 加载 prompts
    with open(PROMPTS_FILE, encoding="utf-8") as f:
        prompts = json.load(f)

    # 算待生成（包括上次失败的）
    todo = [(w, p) for w, p in prompts.items() if not cache.get(w)]
    print(f"[init] 待生成：{len(todo)}")

    if not todo:
        print("全部已生成")
        return

    # 中间检查 token 是否还活着，每 100 张检查一次
    done = 0
    failed = []
    start = time.time()

    def worker(word_prompt):
        word, prompt = word_prompt
        time.sleep(PAUSE)
        url, status = gen(prompt)
        return (word, prompt, url, status)

    with ThreadPoolExecutor(max_workers=WORKERS) as ex:
        futures = {ex.submit(worker, wp): wp[0] for wp in todo}
        for fut in as_completed(futures):
            word, prompt, url, status = fut.result()
            done += 1
            if url:
                cache[word] = url
                if done % 5 == 0:
                    save_cache(cache)
            else:
                failed.append({"word": word, "status": status})

            if done % 10 == 0 or done == len(todo):
                elapsed = (time.time() - start) / 60
                rate = done / elapsed if elapsed else 0
                remaining = len(todo) - done
                eta = remaining / rate if rate else 0
                print(f"[{done}/{len(todo)}] ok={done-len(failed)} fail={len(failed)} "
                      f"elapsed={elapsed:.1f}min rate={rate:.1f}/min eta={eta:.0f}min")

            # 每 100 张检查 token 还活着
            if done % 100 == 0:
                if not check_token_alive():
                    print("⚠ Token 服务似乎挂了，暂停 30s 等恢复")
                    time.sleep(30)

    save_cache(cache)
    total_time = (time.time() - start) / 60
    print(f"\n=== 完成 ===")
    print(f"成功：{done - len(failed)} / {len(todo)}")
    print(f"失败：{len(failed)}")
    print(f"总耗时：{total_time:.1f} min")
    if failed:
        with open(r"D:\Claude Code+DeepSeekV4\final_failed.json", "w", encoding="utf-8") as f:
            json.dump(failed, f, ensure_ascii=False, indent=2)
        print(f"失败列表已写：final_failed.json")


if __name__ == "__main__":
    main()
