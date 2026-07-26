# 域优化循环 · Round 331 · 域A（数据/数值平衡）· 第十轮循环起点

**日期**: 2026-07-26
**本轮域**: A（数据/数值平衡 — jobs, skills, items, goods, illnesses, pricing, trade, economy_v3.1）
**起始 HEAD**: c5925278（R330 收官，第九轮全8域完成）→ 提交后 3b4ebcd9
**开轮核对**: loop-state 严重滞后（标 round324/next=C），据 git log 实况重算并行已推进 R324(C)-R330(H) 第九轮全8域联动增强。真实 recency A=321/B=323/C=324/D=325/E=326/F=327/G=329/H=330 → **A(321)全局最薄弱** → 本轮 R331=域A。

## 一、修复清单（A类）

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| `src/js/phase1/illness.js:1095` | `trackJobDiseaseRisk` 的 `jobRiskMap` 键 `skilled_labor_construction` 非真实 job id（全库 0 命中；news.js/npcs.js 早已确证真实技能岗为 `steel_worker`）→ 钢筋工/技能建筑工的过劳·职业病风险追踪永不生效（死数据） | 改真实 job id `steel_worker`（该工作此前无 jobRiskMap 覆盖，修复后 `hf/lh/pb` 风险正确计入） | **A** |
| `src/js/phase1/illness.js:1104` | `jobRiskMap` 键 `customer_service_tech` 非真实 job id（全库 0 命中，无任何对应久坐岗位）→ 颈椎/久坐风险条目永不命中（死数据） | 删除死键（`data_entry`/`content_writing`/`junior_analyst` 已覆盖久坐岗位，无功能损失） | **A** |
| `src/js/phase1/illness.js:1108` | `jobRiskMap` 键 `food_stall` 是行动 id（`actionFreq`）非真实 job id → 作为 `doStreetJob` 传入的 `jobId` 永不命中；且与下方真实餐饮 job `street_vending_food`（`{jf:1}`）风险完全重复 | 删除死键（真实 job `street_vending_food` 已在同 map 覆盖） | **A** |

**误报排除（未修，诚实报告）**:
- `jobs.js` 多处 payCalc 读 `state.skills.<key>.level` 无可选链（与连携工作的 `?.level` 写法不一致）——但 `state.js:110-124` 恒初始化全部 12 个技能键（`cooking`…`social`，`{level:0,xp:0}`），对象永不 undefined，历轮数百次 MC 0 TypeError，**非 A 类崩溃**，仅 B 类防御一致性，不在本轮 A 类范畴内伪造。
- 其余 9 个域A文件（economy_v3.1/skills/items/goods/illnesses/pricing/trade/trade_intel）经 Explore 审计 + 除法/NaN 守卫核查 clean（`calcTradeProfitRate` fromPrice 守卫、`getMarketSaturationPenalty`/`getConsecutiveWinDecay` isFinite 守卫等均完好）。域A历轮 R14/R22/R197/R242/R251/R258/R267/R277 已净尽主隐患。

## 二、增强清单（联动增强 3 项）

新建 `src/js/core/domain_a_linkage_r331.js`（IIFE→RANDOM_EVENTS，2 street + 1 corporate，全 `||` 防御，数值 `[PLACEHOLDER]`，id 前缀 `a331_`，注册于 `src/index.html`）：

| 新增事件 | 文件 | 联动域 | 设计意图（一句话） |
|---|---|---|---|
| `a331_occupational_health_guard`（职业健康风险自检） | domain_a_linkage_r331.js | **A→G** 核心机制/生命周期 | 用职业病风险数据主动防护过劳——**消费 `_habits.highFatigueStreak/lateNightActions` 累积字段**并削减之，呼应本轮 jobRiskMap 修复主题。 |
| `a331_price_data_neighbor`（把物价账本讲给街坊） | domain_a_linkage_r331.js | **A→D** NPC/社交 | 把省钱物价数据分享给已结识街坊换人情——**守 rel.met 铁律走 applyAffinityChange**。 |
| `a331_cost_structure_audit`（成本结构审计） | domain_a_linkage_r331.js | **A→H** Phase2/公司 | 用成本结构数据做经营审计堵利润漏洞——`addSkillXp("management")` 变现 + `player.corporate.upward` 晋升势能。 |

## 三、验证

- `node --check src/js/phase1/illness.js` + `domain_a_linkage_r331.js` → 均 OK。
- `python build.py` → dist/app.js 重建（含 `_domainALinkageR331Loaded` + `a331_*` count=4），比 src 新。
- 蒙特卡洛 `node --max-old-space-size=8192 tests/monte_carlo.cjs --trials 6 --days 400` → **MC_EXIT=0 · 0 代码异常**（TypeError/ReferenceError/NaN/Infinity grep=0；全路径前7天死亡率 0.0% < 10% 无早期死亡崩溃回归）。存活率 skiller 100%/trader 83.3%/social 83.3% 达标；corporate 50% < 80% 为既有 RNG 平衡阈值波动（harness 标"🔧 需要调整"非代码回归）。RSS timeout 为离线新闻网络回退，非代码异常。

## 四、提交与并发

- 代码改动（illness.js + domain_a_linkage_r331.js + src/index.html + dist）在验证期间被并行窗口 `git add -A` 扫入 **feat `2d18fa43`「[域A R331] 联动增强(3项,第十轮循环)」** + **chore `3b4ebcd9`「sync pending changes (R331)」**，核验提交内容为本窗口版本（`a331_occupational_health_guard` 等 + steel_worker 修复），HEAD==origin/main==`3b4ebcd9` → **已 push origin main 成功**。
- ⚠️ 注意：`src/index.html:1014` 存在并行窗口预写的陈旧注释（描述 A→G健康仪表盘/A→H商业智能v2/A→F人生仪表盘，与实际落地的本窗口 A→G/A→D/A→H 文件不符）——为纯 HTML 注释不影响执行，且 index.html 被并行高频编辑，本窗口不触碰以免冲突。

## 五、下轮

真实 recency（R331 后）：**A=331 / B=323 / C=324 / D=325 / E=326 / F=327 / G=329 / H=330** → **B(323) 全局最薄弱** → 下轮 **R332 = 域B（事件/叙事）**。开轮必先 `git log` + `git rev-parse origin/main` 重算真实 recency（并行窗口极活跃，可能已抢先推进）。
