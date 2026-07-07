---
name: card-meaning-fill-fallback-chain
description: 给 Anki 词卡补释义时的三级降级策略：字典直查 → 去后缀查 → 同根词推导
metadata:
  node_type: memory
  type: project
  originSessionId: 386dd9c2-0248-439d-a9cd-4673fc9ca8ef
---

# 词卡释义补全降级链（2026-06-14 跑通 64/64）

## 用户场景

complete_data.json 里 1893 张卡，64 张的「单词含义」字段是 `（待补充）` —— 都是字典里查不到原词的派生词（actually / numeric / inverted / criticise 等）。脚本：`D:\Claude Code+DeepSeekV4\fill_meanings.py`

## 三级降级

| 级  | 策略                                                                                                                                                                       | 64 词命中 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| 1   | **字典直查**：扩 regex（5 种模式 + 行内+括号+中文连续匹配）在 `all_books_combined.txt` 找                                                                                  | 4         |
| 2   | **去后缀查字典**：用 SUFFIXES 表脱去 `-tion/-ment/-ize/-ed/-ing/-ly/-ic/-able/-ous/-ity` 等剥到词干，再查；含 e 还原（`fondle→fond→fonde`）、双辅音单写（`stopping→stop`） | 16        |
| 3   | **同根词推导**：从 `by_root` 同 词根 字段的其他卡里挑形态最像的（公共前后缀长度评分），取它含义，加 PREFIX_HINT_ZH / SUFFIX_HINT_ZH 前后缀语义注解                         | 44        |

最终 0 待补，100% 覆盖。

## 关键代码片段

```python
PREFIX_HINT_ZH = {"in": "向内/进入/否定", "re": "再/重新/回", "ex": "向外/前任", ...}
SUFFIX_HINT_ZH = {"tion": "n.（动作/结果）", "ed": "（过去式/已…的）", "able": "a.（可…的）", ...}

def derive_meaning(word, root_field):
    siblings = [c for c in by_root[root_field]
                if c["单词"].lower() != word.lower()
                and "待补充" not in c.get("单词含义", "")]
    if not siblings: return None
    best = max(siblings, key=lambda c: sim(word, c["单词"]))  # 形态最像
    pfx, pfx_hint = find_prefix(word)
    sfx, sfx_hint = find_suffix(word)
    return f"{pfx}-（{pfx_hint}）+ -{sfx}（{sfx_hint}）｜近 {best['单词']}：{best['单词含义']}"
```

## 注意事项

- **推导出的释义可能不准**（stagnant 推到了 tangent 上、trend 推到 tend「倾向」，但 trend 真义是「趋势」）。降级链是"有总比没有强"，不是"保证正确"
- 输出格式带「来源标记」给用户一眼看出是推导的：`a.（可…的）｜<comput> n. 电子计算机`、`近 tend：v. 倾向、照料`
- **同根词推导的核心 trick**：用公共前缀+公共后缀长度做形态相似度评分，比 Levenshtein 距离更适合英语派生词

## 复用提示

下次 Anki 词卡补释义直接复用这个脚本，调整两点：

1. 字典文件路径
2. complete_data 字段名

相关：[[pixabay-anki-pipeline]] [[anki-apkg-media-not-imported]]
