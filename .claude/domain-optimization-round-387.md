# Round 387 — 域A 数据/数值平衡（P0 崩溃热修复）

日期：2026-07-27
域：A（数据/数值平衡）
父 HEAD：63377def（R386 域H）

## 背景
开轮 loop-state 严重滞后（标 nextDomain=G/lastRound=384）。据 `git log` 重算真实 recency：
A=379/B=380/C=381/D=382/E=383/F=384/G=385/H=386 → A(379) 全局最薄弱 → 本轮域A（R387）。
工作树发现并行窗口在途 R387=域A 代码（pricing.js/trade.js：getNpcTradeAdvice A→D / applyPriceMoodEffect A→G / checkTradeMilestone A→B）——按纪律 stash 隔离不碰。

## 指令一：A类缺陷修复（1处 · P0 崩溃）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/core/events_core.js | `rollStreetEvent`（:119-134）用 `mod`（:123-131 `mod+=`/`mod-=`）但**从未声明 `let mod`**。并行窗口某次"域B A类修复"（:122 注释）加 state.status/needs 守卫时漏删/漏加声明。→ 每日经 rollDailyNews→daily_pipeline 运行时抛 `ReferenceError: mod is not defined`（events_core.js:125）→ 全策略 100% 死亡、前7天死亡率 100%、游戏完全不可玩 | 补 `let mod = 0;`（与同文件 `rollCorporateEvent`:150 完全一致的写法），注释 `// [全系统自洽修复] 域A R387 修复:...` | **A（P0）** |

### 确证证据
- MC 崩溃现象：所有策略存活率 0.0%、前7天死亡率 100%、总耗时仅 0.5 秒（硬崩溃）。
- Stack trace（临时给 harness catch 加 e.stack 定位，运行后还原）：
  `ReferenceError: mod is not defined at rollStreetEvent (events_core.js:125:50) ← rollDailyNews (:1214) ← daily_pipeline.js:1065 ← runDailyPipeline`
- stash 隔离并行在途改动后崩溃仍在 HEAD（committed 代码）→ 证明是已推送到 main 的回归，非并行在途所致。

## 指令二：联动增强
本轮为 P0 热修复轮，联动增强由并行窗口 R387 域A（pricing/trade：A→D 交易情报 / A→G 价格心情 / A→B 交易里程碑）承接，在途未提交，本窗口 stash 隔离不重复。

## 验证
- `node --check src/js/core/events_core.js` 通过。
- `python build.py` 重建 dist（app.js 10521.7 KB，比 src 新；含修复注释 count=1，不含并行 stash 代码 getNpcTradeAdvice count=0）。
- MC `--trials 6 --days 400`：**MC_EXIT=0 · 0 代码异常**。总耗时 83.2s（真实完整运行）。前7天死亡率**全部恢复 0.0%**（修复前 100%）。存活率 balanced 100%/grinder 33.3%(≥30%高风险)/skiller 50%/trader 66.7%/social 50%/corporate 50%——trader/social/corporate<80% 为既有 RNG 平衡阈值（harness "🔧 需要调整"），非代码异常。无 TypeError/ReferenceError/NaN/Infinity。

## 提交
- 仅 `git add` src/js/core/events_core.js + dist/app.js + .claude/loop-domain-state.json + .claude/last_known_head + 本 round doc + MEMORY.md。绝不 -A/--amend/force。
- 并行在途 pricing.js/trade.js 全程 stash 隔离，push 后 pop 无损还原。
- push 前 `git pull --rebase origin main`。

## 下轮
域 B（recency 380 最薄弱）。开轮必 `git log` 重算真实 recency（并行速度远快于本自动化）。
