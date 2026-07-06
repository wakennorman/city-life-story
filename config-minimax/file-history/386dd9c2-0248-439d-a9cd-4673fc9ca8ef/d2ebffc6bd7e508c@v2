#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""阶段4：试跑 20 张图，跨词根/词性/抽象具体度抽样验证 prompt 风格。"""
import subprocess, json, time, os, sys

SKILL = r"C:\Users\陈恒稳\.openclaw-autoclaw\skills\autoglm-generate-image-seedream\generate-image-seedream.py"
PROMPTS_FILE = r"D:\Claude Code+DeepSeekV4\prompts.json"
CACHE = r"C:\Users\陈恒稳\.openclaw-autoclaw\workspace\anki\concept_urls.json"
TEST_OUT = r"D:\Claude Code+DeepSeekV4\test20_results.json"

# 试跑挑选：跨词根、跨词性、覆盖动词/名词/形容词、覆盖具体/抽象
TEST_WORDS = [
    "actual",       # adj 从 ACT
    "enact",        # v + en-
    "interaction",  # n + inter- + -tion
    "formulate",    # v 从 form
    "dictator",     # n 从 dict
    "visage",       # n 从 vis
    "tractor",      # n 从 tract
    "induce",       # v 从 duc
    "permission",   # n 从 mit/miss + per-
    "compulsion",   # n 从 pel/puls
    "computation",  # n 从 put + com-
    "circumspect",  # adj 从 spect + circum-
    "rejection",    # n 从 ject + re-
    "junction",     # n 从 junct
    "fluctuate",    # v 从 flux
    "numeric",      # adj 从 numer
    "inscription",  # n 从 scrib/script + in-
    "exclusion",    # n 从 clud/clus + ex-
    "acupuncture",  # n 从 acu
    "lumination",   # n 从 lumin（编造但合理）
]

def gen(prompt, timeout=90):
    """调 seedream 生图，返回 url 或空。"""
    try:
        r = subprocess.run(
            ["python", SKILL, prompt],
            capture_output=True, timeout=timeout,
        )
        text = r.stdout.decode("utf-8", errors="ignore").strip()
        if not text:
            return ("", "empty stdout")
        obj = json.loads(text)
        if obj.get("code") == 0:
            return (obj.get("data", {}).get("image_url", ""), "ok")
        return ("", f"code={obj.get('code')} msg={obj.get('msg', '')[:80]}")
    except subprocess.TimeoutExpired:
        return ("", "timeout")
    except Exception as e:
        return ("", f"err: {e}")

def main():
    # 加载 prompts
    with open(PROMPTS_FILE, encoding="utf-8") as f:
        all_prompts = json.load(f)

    print(f"试跑 {len(TEST_WORDS)} 个词...")
    results = {}
    for i, w in enumerate(TEST_WORDS, 1):
        if w not in all_prompts:
            # 不在待生成清单中（可能已缓存或拼写不对），自己拼个 prompt
            prompt = f"{w} concept, simple icon style"
            print(f"[{i}/{len(TEST_WORDS)}] {w} (没在 prompts.json 里，自生 prompt)")
        else:
            prompt = all_prompts[w]
        print(f"[{i}/{len(TEST_WORDS)}] {w}")
        print(f"    prompt: {prompt[:100]}")
        url, status = gen(prompt)
        results[w] = {"prompt": prompt, "url": url, "status": status}
        if url:
            print(f"    OK: {url[:80]}")
        else:
            print(f"    FAIL: {status}")
        # 每次写盘，方便中断恢复
        with open(TEST_OUT, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        time.sleep(3)  # 节流

    # 汇总
    ok = sum(1 for r in results.values() if r["url"])
    print(f"\n=== 试跑完成 ===")
    print(f"成功 {ok}/{len(TEST_WORDS)}")
    print(f"结果：{TEST_OUT}")

if __name__ == "__main__":
    main()
