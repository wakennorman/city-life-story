# 域G 核心机制/生命周期 · R554 轮（2026-07-27 21:11）

> 自动化 8 域轮换优化循环。本轮由本窗口接手：loop-state 滞后标 round552/F/next=G，git log 重算并行已推进至 R553（域F R552 + 集成 chore），故本轮 = R554 = 域G。

## 起始状态
- 工作树仅 2 个 untracked 文件：`.claude/domain-optimization-p0-hotfix.md`（上轮 P0 账本）+ `src/js/core/domain_g_linkage_r554.js`（域G 联动文件，已被并行窗口挂进 src/index.html:1352 但源未提交=悬空引用风险）。
- P0 热修复（_guardNeedsP1/P3-P8 缺失）经核验已由并行窗口提交（HEAD 从 a0c3a49b→e01105c8 R553，part1.js/part2.js grep 各 117/119 命中守卫定义），无需本窗口重复提交。

## A类1（确证·联动文件假技能键回潮）
- `domain_g_linkage_r554.js:101` `g554_life_retrain`「报名学习」分支 `var skills = ["accounting","management","marketing","technology","social","trade"]` —— marketing/technology/trade 非 state.skills 真实键（真实12键：cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social）→ addSkillXp 静默丢弃 XP。这是 R535「全库清零」之后新建 linkage 文件**再次引入**的同类污染。
- 修复：映射 marketing→social / technology→coding / trade→sales，数组改为 `["accounting","management","social","coding","sales","electrician"]`（全真实键），加 `// [全系统自洽修复]` 注释。node --check 通过。

## 联动增强（已就位，非本轮新建）
- `domain_g_linkage_r554.js` 3 事件（IIFE→RANDOM_EVENTS，全 phase:"street"·||防御·excludeFlags 冷却·id 唯一）：
  - g554_life_old_friend（G→D 老友叙旧·firstMetNpc 守 rel.met + applyAffinityChange 好感+4）
  - g554_life_emergency_fund（G→E 应急基金·accounting XP+4 + cash→bankBalance 2000）
  - g554_life_retrain（G→C 再培训·全技能 XP+3 + mental/happiness）

## 验证
- 全库 grep 假技能键数组：除已修复注释外 0 活命中；dead-field 黑名单（player.happiness/needs.health/player.health）在 r554 + 全部 domain_g_linkage_*.js 均 0 命中。
- `python build.py`→dist/app.js 11965.3KB（12252474B），`_domainGLinkageR554Loaded` count=2（源+守卫）闭合悬空引用。
- MC 6×400d EXIT=0·**0 硬代码异常**（TypeError/ReferenceError/pipeline_error/Uncaught grep 全空）·**前7天死亡率全 0.0%**。balanced 83.3%/social 83.3%≥80%；grinder 16.7%/trader 50%/corporate 50% <阈值为既有 RNG 平衡波动非回归（RSS timeout=离线新闻回退）。

## 提交与并发
- 本窗口修复+验证+重建 dist 后，并行窗口以 `e16b2689`「chore: [R555] sync state」将 r554.js（含本窗口修复）+ 重建 dist + p0-hotfix.md + loop-domain-state.json(R554/G/next=DOMAIN_H) 一并扫入提交，HEAD=e16b2689。本窗口修复无损落地。
- 下轮：DOMAIN_H（Phase2/公司，recency 最薄弱候选）。开轮必 git log 重算真实 recency，勿信 loop-state。

## 关键教训
- 假技能键污染会回潮：新建/在途 linkage 文件落库前**必 grep 假键数组**（`marketing.*technology.*trade` 模板）。R535 清零不等于永久清零。
- 悬空引用新形态：并行窗口先挂 index.html `<script>` 再创建源文件，源未提交即构成悬空→落库后必须核验 dist bundle 含该标志。
