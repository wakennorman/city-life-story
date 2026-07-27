# Round 442 — 域F UI/UX（第二十二轮循环）

日期：2026-07-27
域：F（UI/UX）— git log 时间序重算 recency：D 已被并行 R440(老陈+社区中心·大量NPC/社交内容)刷新为最新鲜域，F 最近一次为并行 R48(25600d72)位次最旧 → F 全局最薄弱。

## 一、A类缺陷修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|------|----------|----------|------|
| （无） | A类=0 诚实报告 | — | — |

审计过程：
- 死字段黑名单（player.happiness / needs.health / player.health / .certs）src/js/ui/ 全目录 grep = **0 活代码命中**（仅历轮修复注释）。
- data_viz.js / daily_report.js 除零、toLocaleString/toFixed 无守卫扫描 = 0 命中。
- 并行 R48（25600d72，本轮开轮前最近一次域F提交）刚修复 render.js renderStreetStats state.player 守卫 + modal.js villageDebt/fineDebt toLocaleString NaN 守卫 ×2，域F 属刚被加固状态。
- 历轮 R19/R183/R186/R198/R384/R390/R397/R413/R421/R48 已净尽域F主隐患。

## 二、联动增强清单（3项）

新文件：`src/js/core/domain_f_linkage_r442.js`（IIFE → RANDOM_EVENTS，守卫 `_domainFLinkageR442Loaded`，全字段 || 防御，数值 [PLACEHOLDER] 保守占位，冷却 excludeFlags，均显式 phase）

| 新增内容 | 联动域 | 设计意图（一句话） |
|----------|--------|-------------------|
| `f442_neglect_reconnect` 关系面板"久未联系"提醒（street） | F→D | **全库首个消费 rel._lastInteractionDay 的 UI 叙事**——把关系网面板从只读升级为"疏远预警→主动重连"驱动，选中最久未互动的已结识NPC，走 applyAffinityChange 正规入口（met 铁律 + getNpcDisplayName 显名） |
| `f442_asset_allocation` 资产配置视图（street） | F→E | 财务面板叙事化：持仓≥1 时复盘配置集中度（≥4只=分散/否则提示单一风险），复用 _dataInvestorMindset 投资意识 flag + 心智+4 |
| `f442_ops_dashboard` 经营仪表盘（corporate） | F→H | 公司看板从展示升级为汇报变现：需 corporate.company，用数据做季度汇报 → management XP+8 / 奖金 ¥1,500 / upward 晋升势能+3（复用 player.corporate.upward 真实惰性字段） |

注册：`src/index.html` 第1114-1115行（domain_f_linkage_r421.js 之后）。

## 三、验证

- `node --check src/js/core/domain_f_linkage_r442.js` ✅
- `python build.py` → dist/app.js **10967.8 KB**，grep `_domainFLinkageR442Loaded|f442_` = 8 处入 bundle ✅
- MC `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400`：**🎉 总体通过 all pass**——6策略存活率全达标（balanced 100%/trader 83.3%/social 83.3%/corporate 83.3%≥80%；grinder 33.3%/skiller 33.3%≥30% 高风险路径），前7天死亡率全 0.0%，0 代码异常（36氪/澎湃 RSS timeout 为离线新闻网络回退，非代码异常）。

## 四、并发纪律

- 开轮 HEAD=origin/main=18000073；并行窗口在途改动 loop-domain-state.json / locations.js / npcs.js / jobs.js（执行中实时出现）全程 `git stash push` 隔离，push 后 pop 无损还原。
- **loop-domain-state.json 本轮不更新**：该文件已被并行 STATIC_AUDIT/F5/MC_VERIFY 方向轮重新占用（schema 已改为 lastDirection/nextDirection，且工作树有并行在途编辑），写入必冲突。权威 recency 依 git log 时间序 + MEMORY.md 基准（既定纪律）。
- 提交仅 add 本轮文件：domain_f_linkage_r442.js / src/index.html / dist / CLAUDE.md / 本文件 / MEMORY.md / last_known_head。

## 五、recency 基准（R442后，git log 时间序）

D=R440(最新)→H=R438→C=R53→A=R431→E=R415→B=R417→G=R49→**F=R442(本轮)** → 下轮最薄弱=**域G**（R49, 2dd1dcaa 位次最旧）。开轮必 git log 重算。
