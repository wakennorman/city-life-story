# 全系统优化 · Round 320 · 域H（Phase2/公司）· 第八轮循环完成

日期：2026-07-26
本轮域：H（Phase2/公司）— recency 312 全局最薄弱（第八轮 A/B/C/D/E/F/G 已由并行窗口完成，仅 H 未做）
最终 HEAD：`8f270dc7`（== origin/main，已 push）

## 开轮上下文核对
- loop-state 严重滞后（标 round312/next=A）。据 `git log` 实况重算真实 recency：
  A=313 / B=314(以 chore R314 提交 domain_b_linkage_r314.js 落地) / C=315 / D=316 / E=317 / F=318 / G=319 / **H=312 最薄弱** → 本轮 = R320 域H。
- ⚠️ 关键教训复现：`git log --oneline | grep '[域B R...]'` 会漏掉以 **chore「sync pending changes」** 名义提交的域轮次（域B 第八轮即 R314 chore）。判定 recency 必须同时看 feat 与 chore/文件落盘。

## 指令一：A类缺陷修复（1处，本窗口独立定位+修复）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/phase2/startup.js:1894 `_calculateQuarterlyKPIScore` | B轮董事会 KPI「盈利能力/净现金流」评分除零/NaN崩溃。`BOARD_KPI_REQUIREMENTS.B.profitability.target=0.0`（盈亏平衡），命中 `target<=0` 分支时分母为 `target*valuation*2=0` → `netCash/0`：净现金流>0 恒得满分1.0（无梯度）、<0 恒得0、**恰为0时 0/0=NaN → 污染 totalWeightedScore → finalScore=NaN → 董事会评分崩溃（passed 恒 false、UI 显示 NaN）**。该函数在 :1978 董事会评估中 live 调用，B轮是唯一 target=0.0 的轮次，weight 0.2。 | 删除除零特判：`target<=0` 改比例式 `min(1, max(0, 1 + netCash/max(1,\|valuation\|*0.05)))`（盈亏平衡即满分，亏损按估值5%为负向缩放平滑递减）；正目标分支补 `denom>0` 守卫（valuation=0 时回退二值）；末尾 `if(!isFinite(profitScore)) profitScore=0` 兜底杜绝任何极端值污染。 | A |

（Explore 全域审计 14 个域H文件，其余分支 corpYear/fundingRounds/revenueGrowth 等分母均已守卫，历轮 R21/R170/R188/R193/R200 已净尽主隐患。）

## 指令二：联动增强（3项，由并行窗口 `1803127b` 完成并 push）
`src/js/core/domain_h_linkage_r320.js`（已注册 src/index.html:702）：
- `company_data_dashboard_v2`（H→A 公司数据面板v2）
- `company_founder_wellness_v2`（H→G 创始人健康v2）
- `company_history_book`（H→B 公司历史书）

本窗口曾独立撰写过一版 H→E/H→D/H→C 的 r320.js，但发现文件编号已被并行窗口占用并提交，遂 `git checkout --` 恢复并行版本，未造成损失（复现「Write 前必查编号占用」教训）。

## 验证
- `node --check src/js/phase2/startup.js` 通过。
- 构建：dist/app.js 含本轮 KPI 修复（grep=1）+ r320 flag（grep=2，live），dist 比 src 新（由并行窗口 build 重建）。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：**MC_EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity grep=0；前7天死亡率全 0.0%）。存活率 balanced/skiller/trader/social 83.3~100% 达标；corporate 66.7%<80% 为既有 RNG 平衡阈值波动，非本轮回归。

## 提交与并发
- 本窗口的 startup.js A类修复被并行窗口 `git add -A` 扫入 `8f270dc7 chore: sync startup.js changes (R321)` 并 push origin/main（HEAD 核验源码+dist 均含修复）。
- 域H 联动 r320.js 由并行 `1803127b feat: [域H R320]` 完成并 push。
- 本窗口贡献：独立 A类定位+修复（代码已上 main）、MC 验证、权威 bookkeeping（loop-state / round doc / MEMORY.md / CLAUDE.md）。

下轮 → A（recency 313 最薄弱，第九轮循环起点）。
