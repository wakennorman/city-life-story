# 域F UI/UX 优化轮 · R590（2026-07-28）

## 选域
- recency 重算（linkage 文件最大轮号/域）：A=583 / B=584 / C=586 / D=587 / E=589 / F=580 / G=583 / H=581 → **F(580) 全局最陈旧** → 域F。与 loop-state `nextDirection=DOMAIN_F` 一致。
- 轮号 R590 未被占用（git log --all 无 R590/r590）。

## A类（悬空引用清理 4 处）
- `src/index.html` 挂载 `domain_f_linkage_r530.js` / `r539.js` / `r556.js` / `r564.js` 四文件，但经 `git ls-files` / `git log --all` / 全盘 `find` / `dist/app.js` 四重核查，**四文件从未被创建**（属"并行先写 index.html 挂载+注释、源文件始终未建"的逆向悬空引用）。
- build.py 对缺失本地文件静默跳过 → 其声称的事件（R530 成就墙/F→E资产曲线/R→B叙事图鉴 等）**从未进入 bundle**，等于死引用。移除 4 行挂载（含注释）。
- 功能损失 = 0（事件本就从未注册、从未运行）。
- 经典 A类（死字段/未声明变量）：死字段黑名单 `player.happiness/needs.health/player.health/state.certs` 全库 grep 0 活命中（仅 `webapp_runtime_bridge.js:176-188` 读 `state.player.health` 已知误报 + 局部 `var certs = state.certificates` 非死字段）→ **A类=0 诚实报告**。域F 历 R19/R183/R186/R198/R384/R390/R397/R442/R530 多轮已净尽主隐患。

## 联动增强 3 项（domain_f_linkage_r590.js，IIFE→RANDOM_EVENTS）
全 `||` 防御、`maxRepeats:1`、显式 `phase`、守卫 `_domainFLinkageR590Loaded`、`firstMetNpc/bumpAffinity/countSkillsAtOrAbove` 辅助、`StateManager.addMessage`/`addSkillXp` 均 try/catch 守卫：
1. `f590_skill_balance_board`（F→A，street）：技能面板显示发展均衡（≥4 项技能 `level≥10`）→ 数据/数值平衡：统筹能力提升（intelligence+2 / mental+3 / needs.happiness+2）。
2. `f590_career_panel_praise`（F→C，street）：职业面板基本功扎实（≥2 项技能 `level≥20` 且有 `career.currentJob`/`corporate.company`）→ 职业成长：Leader 会上表扬（addSkillXp("management",8) + cash+800）。
3. `f590_watchlist_discipline`（F→E，corporate）：投资面板坚持复盘（`investment.stockHoldings.length≥3`）→ 经济/投资：波动中更从容（复用 `_dataInvestorMindset` + addSkillXp("accounting",6) + mental+3）。

## 关键坑（自避 A类）
- `state.skills[key]` 是**对象** `{level,xp}`，技能等级须读 `.level`（非数值）。误用 `st.skills.coding >= 10` 会让 condition 恒 false = 死事件。条件里用 `countSkillsAtOrAbove` 遍历读 `.level` 校验。

## 验证
- `node --check src/js/core/domain_f_linkage_r590.js` → SYNTAX OK。
- `python build.py` → dist/app.js 12059.7KB（r589 12051.6KB→+8.1KB）；`grep -c _domainFLinkageR590Loaded`=2（已入 bundle）；孤儿 `r530/r539/r556/r564` 在 bundle 中 grep=0（彻底清除）。
- MC `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → **MC_EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity grep=0）；**前7天死亡率全 0.0%**（无早期死亡崩溃回归）；balanced 100%/grinder 50%/skiller 50%/trader 83.3%/social 66.7%/corporate 66.7% 存活（social/corporate <80% 为既有 RNG 平衡阈值，历轮一致，非代码回归）；36氪/澎湃/TianAPI RSS timeout = 离线新闻回退非代码异常。

## 提交与下轮
- 提交：feat(域F R590 悬空引用清理+3联动) + docs(CLAUDE.md 迭代表/loop-state/MEMORY.md/本文件)，push origin main。
- 并行：执行期无并行在途改动干扰（工作树干净，仅本窗口改动）；HEAD==origin/main==aa91dae4 起，commit 后 push。
- 下轮：**DOMAIN_G**（recency F590>A583/B584/C586/D587/E589/G583/H581，G 与 A 并列最旧 583；轮换 F→G）。
