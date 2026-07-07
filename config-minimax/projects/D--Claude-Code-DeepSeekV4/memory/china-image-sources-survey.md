---
name: china-image-sources-survey
description: 2026-06-14 在国内网络实测各种图源，记录哪个能用哪个不能，避免下次重测
metadata:
  node_type: memory
  type: reference
  originSessionId: 386dd9c2-0248-439d-a9cd-4673fc9ca8ef
---

# 国内网络可用图源实测（2026-06-14）

## ❌ GFW 直接卡死

- `en.wikipedia.org` / `commons.wikimedia.org` — connection timeout
- `duckduckgo.com` 图搜 — timeout
- `api.openverse.engineering` — timeout
- `source.unsplash.com` — 503 (官方已停服，跟 GFW 无关)
- `api.pexels.com` — 需要 key

## ⚠️ 通但质量差

| 源                                   | 问题                                                                                                                   |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| `cn.bing.com/images/search?q={word}` | 单英文词 → 返回明星八卦/政治新闻/电商图，**与词义无关**；加 `+filterui:photo-photo+filterui:imagesize-medium` 也不改善 |
| `www.bing.com/images` 国际版         | 国内访问自动重定向回中文结果，同样噪声                                                                                 |
| `image.baidu.com`                    | 安全验证页（反爬）                                                                                                     |
| `pic.sogou.com` / `image.so.com`     | 通，但需要复杂的 HTML 解析；质量同 Bing                                                                                |
| `picsum.photos`                      | 通，但返回**随机风景图**，不能按词搜                                                                                   |

## ❌ 词典站陷阱

- `quword.com/images/words/{word}1.jpg` — URL 规律对，但**所有词返回同一张海上小船占位图**（默认 fallback）
- `dict.youdao.com/pureimage?docid=...` — 返回的是**教学视频截图**（"See Lecture Notes For Details"），不是配图
- `iciba.com/word?w={word}` — JS 渲染，HTML 里抓不到图
- `dict.cn/{word}` — 只有 logo 和备案号图
- `cn.bing.com/dict/search` — JS 渲染，HTML 里 0 张图

## ✅ 真正能用

| 源          | 用法                                                                                                 | 评价                                                                                                                                                               |
| ----------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Pixabay** | `https://pixabay.com/api/?key={KEY}&q={en_word}&image_type=photo&per_page=3&safesearch=true&lang=en` | **金标准**。需要免费 key，instant 注册。100 req/60s，5000/h。返回真实照片，质量稳定。1768 词 79% 一次命中，剩 21% 用「中文释义抽英文 + 词根英文概念」兜底救回 100% |
| **Iconify** | `https://api.iconify.design/{prefix}:{name}.svg` 或 `/search?query=...`                              | 走 Cloudflare，国内通；emoji/material 等开源图标库；适合 icon-style 需求                                                                                           |
| **Bing CN** | 极个别词（常见日常词如 acupuncture）有用                                                             | 不推荐当主源                                                                                                                                                       |

## 关键经验

- **抽象拉丁词根派生词**（fluctuate / compulsion / inscription / circumspect）**没有任何免费源**给得出"释义图"，因为这种词本身就不是具体物
- 对这类词，**Pixabay 用「释义里的英文核心动词」搜**比用原词效果好得多（兜底脚本 372/372 全救回）
- 不要寄希望于国内搜索引擎："中文 SEO 系统不为英语学习者优化"

相关：[[pixabay-anki-pipeline]] [[cant-natively-generate-images]]
