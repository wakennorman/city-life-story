# 全系统自洽优化 · Round 191 · 域C（职业/成长）

- 日期：2026-07-24
- 本轮域：C 职业/成长（domainRecency 187，最薄弱）
- 下轮域：G 核心机制/生命周期（recency 180，最薄弱）

## 一、A类缺陷修复清单

| 文件 | 缺陷简述 | 修复内容 | 类别 |
|---|---|---|---|
| src/js/data/jobs.js:376 | `long_haul_driver`（长途司机）`requiredFlag: "_synergy_driving_accounting"` 引用了**不存在的连携 flag** —— skill_synergy.js 真实设置的是 `_synergy_driving_logistics`（DUAL「长途运输」driving+accounting）与 `_synergy_driving_logistics_accounting`（TRIPLE「物流帝国」driving+accounting+management），**没有 driving_accounting**。该岗位 `requiredFlag` 永不成立 → 永久不可入职的**死工作**。 | 改为真实连携 `"_synergy_driving_logistics"`。依据：该 DUAL 连携中文名恰为「长途运输」、技能组合 driving+accounting，与死工作的 `desc`（"需要长途运输连携激活"）与 `payCalc`（driving+accounting 计薪）完全对应，是设计原意。 | **A** |

说明：此 A类修复已随并行窗口提交 `eb13d27b fix: [域C] A类修复1项(perf.js NaN)+联动增强1项` 一并落地到 main（工作树该行已带 `// [全系统自洽修复] 域C` 注释且 git status clean）。本轮不重复提交 jobs.js。

其他扫描：域C 事件文件（career_path_events / personal_growth_events / skill_tree / skill_synergy / perf / job_milestone_events / performance_legacy_events）的全部 `addSkillXp(...)` 键均为真实技能键（cooking/repair/coding/english/driving/sales/management/accounting/electrician/welding/medicine/social 白名单内），无死引用。域C 本轮无其他确证 A类。

## 二、联动增强清单（3项，新建 domain_c_linkage_r191.js）

| 新增事件 | 联动域 | 设计意图（一句话） |
|---|---|---|
| skill_r191_synergy_gig | C→E | 「长途运输」连携激活后货主上门请跑私活 → 一次性现金收入，让刚复活的连携价值链第一次直接变现（承接本轮 A类修复）。 |
| skill_r191_peer_respect | C→D | 一门手艺练到火候被同行看见、主动讨教 → 已结识NPC好感，把"技能成长"翻译成"人情与圈内认可"。 |
| skill_r191_hard_won | C→G | 夜里回望一路熬出来的硬本事（≥2门） → 心智/幸福感回补，为零散技能加一层"我是怎么走到今天"的成长叙事。 |

设计与自检：
- 严格照 domain_b_linkage_r190.js 已验证 IIFE 范式：`RANDOM_EVENTS` 存在性 + `_domainCLinkageR191Loaded` 幂等守卫；每个事件显式 `phase:"street"`；`triggers` 仅用引擎白名单字段（minDay/excludeFlags）；`conditions` 全部 `gameOver` 闸门 + 逐字段防御。
- 真实字段核实：技能等级经 `skillLv(st,key)` 读 `st.skills[key].level`（子对象缺失返回 0）；连携 flag `st.flags._synergy_driving_logistics`（skill_synergy.js 设置）；现金 `st.resources.cash`；心智 `st.player.mental`；幸福 `st.needs.happiness`。
- NPC 好感一律走 `applyAffinityChange` 且经 `firstMetNpc` 只取 `rel.met` 的已结识街坊（域D铁律：只读 relationships、绝不硬编码未激活NPC）。
- conditions 全 false 时不触发即不产生叙事矛盾；桌面/移动端共用文本无 UI 溢出风险；数值全部 `[PLACEHOLDER]` 待平衡组校准。

## 三、验证

- `node --check src/js/core/domain_c_linkage_r191.js` ✅
- `node --check src/js/data/jobs.js` ✅
- `python build.py` ✅ 重建 dist/index.html(133.5KB)+app.js(9036.8KB)，dist 新于源；`_domainCLinkageR191Loaded`/`skill_r191_synergy_gig` 已入 bundle。
- 蒙特卡洛 `--trials 6 --days 400`：**0 代码异常**（无 TypeError/ReferenceError；输出中 `NaN%` 仅为空分布桶 0/0 的既有报表显示项，与本轮改动无关）。trader/corporate 存活率偏低为 C类平衡项，记录不改。

## 四、提交

- commit（feat）：`feat: [域C] R191 联动增强(3项) 承接long_haul_driver死工作复活`
- 提交文件：domain_c_linkage_r191.js（新）、src/index.html（注册）、dist/index.html、dist/app.js、CLAUDE.md、.claude/loop-domain-state.json、.claude/last_known_head、.claude/domain-optimization-round-191.md、.workbuddy/memory/MEMORY.md
- 推送：`git pull --rebase origin main` 后 `git push origin main`（冲突则中止报告，不 force）。
