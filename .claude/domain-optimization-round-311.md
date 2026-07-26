# 城市浮生记 · 优化循环 Round 311 — 域G 核心机制/生命周期（第七轮循环）

> 自动化 `automation-1783592608308` 执行记录。分支策略：直接 commit + push `main`（pre-commit 三守卫：防覆盖漂移检查 + node --check + ...）。

## 开轮状态（严重滞后，已据 git log 重算）
- `loop-domain-state.json` 标 `round296/G/next=A`，但 git log 显示并行窗口已推进至 `R310 域F`（HEAD `22c6e032`，本地 1 commit 领先 origin `388005b2`）。
- 重算各域最新轮次：`A=304 / B=305 / C=307 / D=308 / E=309 / F=310 / G=302 / H=303` → **G(302) 全局最薄弱** → 本轮 = **R311 域G**。
- 工作树：仅 `src/index.html`（已含 r311 注册）+ 未跟踪 `src/js/core/domain_g_linkage_r311.js`（并行窗口预建的 R311 联动文件，内容经审校合规）。本轮账本记为 **R311**。

## A类缺陷修复（1 项，确证极端值崩溃）
- **`src/js/core/world_params.js` 两处 Yahoo 财经解析器护栏缺失**（A类#3 极端值崩溃）：
  - `parseYahooFinanceResponse`（:170-172）与同步 XHR 版（:347-349）计算 `changePercent=(latestClose-prevClose)/prevClose` 时**未守卫 `prevClose`**；而同文件的腾讯 `parseTencentFinanceResponse`（:232）、新浪 `parseSinaFinanceResponse`（:252）均带 `if(isNaN(prevClose)||isNaN(latestClose)||prevClose===0)return false` 护栏——Yahoo 版不一致。
  - 后果：`prevClose`=0/NaN 时 `changePercent`=Infinity/NaN，污染 `world_params` 的 `marketMood`/增长假设，并向下游经济/事件传播 NaN。
  - 修复：两处 Yahoo 解析器补齐与兄弟解析器一致的护栏 `// [全系统自洽修复] 域G R311 A类: ...`，`if(isNaN(prevClose)||isNaN(latestClose)||prevClose===0)return false;`。

## 联动增强（3 项，承接并行预建文件）
- 文件 `src/js/core/domain_g_linkage_r311.js`（IIFE 注入 `RANDOM_EVENTS`，守卫 `_domainGLinkageR311Loaded`，已注册 `src/index.html:965`）。
- 审校结论：3 事件均 `phase` 齐备（2 street + 1 corporate）、全 `||` 防御、`st.needs.happiness`/`st.player.mental` 真实字段、id（`life_wealth_milestone_v2`/`life_company_anniversary_v2`/`life_data_comprehensive`）全库唯一、数值标 `[PLACEHOLDER]`。
  1. `life_wealth_milestone_v2`（G→E）：总资产 `cash+bankBalance ≥ ¥500,000` → 心智+10/心情+15，置 `_wealthMilestone500k`。
  2. `life_company_anniversary_v2`（G→H）：`startup.company` 成立满 730 天 → 公司声誉+12/心情+15。
  3. `life_data_comprehensive`（G→A）：`player.day ≥ 500` → 心智+10，置 `_comprehensiveDataHub`。

## 验证
- `node --check`：world_params.js / domain_g_linkage_r311.js 均 OK。
- `python build.py` → `dist/app.js` **9949.3 KB**（比 src 新；含 `life_wealth_milestone_v2`×2 + `域G R311 A类`×2）。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：**MC_EXIT=0 · 0 代码异常**（grep 确认无 TypeError/ReferenceError/NaN/Infinity 行；存活率 <80% 为既有 RNG 平衡阈值，非本轮引入）。

## 提交与推送
- fix：`world_params.js`（A类护栏）。
- feat：`domain_g_linkage_r311.js` + `src/index.html`（R311 注册）+ `dist/`。
- docs：`DEVELOPMENT.md`(v3.125) + 本账本 + `loop-domain-state.json` + `MEMORY.md`。
- 铁律：仅 `git add` 本轮文件，绝不 `-A`/`--amend`/`--force`；`git pull --rebase origin main` 后 `git push origin main`；每 commit 前同步 `.claude/last_known_head`=当前 HEAD 过 pre-commit 漂移检查。

## 下轮
- 域H（Phase2/公司），recency 基准 `A=304/B=305/C=307/D=308/E=309/F=310/G=311/H=303` → **H(303) 最薄弱**。
